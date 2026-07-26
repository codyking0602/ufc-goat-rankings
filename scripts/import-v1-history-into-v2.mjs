import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const managementToken = process.env.SUPABASE_ACCESS_TOKEN?.trim();
const v1ProjectRef = process.env.V1_PROJECT_REF?.trim();
const payloadPath = process.env.EXPORT_OUTPUT?.trim();
const firstReportPath = process.env.FIRST_REPORT?.trim();
const secondReportPath = process.env.SECOND_REPORT?.trim();
const combinedReportPath = process.env.COMBINED_REPORT?.trim();

for (const [name, value] of Object.entries({
  SUPABASE_ACCESS_TOKEN: managementToken,
  V1_PROJECT_REF: v1ProjectRef,
  EXPORT_OUTPUT: payloadPath,
  FIRST_REPORT: firstReportPath,
  SECOND_REPORT: secondReportPath,
  COMBINED_REPORT: combinedReportPath,
})) {
  if (!value) throw new Error(`${name} is required.`);
}

const expectedNames = ["BROCK", "CODY", "RHONDA", "SHANE", "TONY", "TYLER"];
const rpcPath = "/rpc/import_v1_history_atomic_reconciled";

async function fetchJson(url, options = {}, label = "request") {
  const response = await fetch(url, options);
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!response.ok) {
    const detail = typeof body === "string" ? body.slice(0, 500) : JSON.stringify(body).slice(0, 500);
    throw new Error(`${label} failed (${response.status}): ${detail}`);
  }
  return body;
}

function serviceKeyFrom(keys) {
  if (!Array.isArray(keys)) return "";
  const row = keys.find((candidate) => candidate?.name === "service_role" || candidate?.name === "secret");
  return String(row?.api_key || row?.key || "").trim();
}

function normalizedNames(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => String(row?.normalized_name || "").trim().toUpperCase()).filter(Boolean).sort();
}

const payloadText = await readFile(payloadPath, "utf8");
const payload = JSON.parse(payloadText);
const payloadChecksum = createHash("sha256").update(payloadText).digest("hex");

if (payload.schemaVersion !== 1 || payload.cutoff !== "2026-07-25T00:00:00.000Z") {
  throw new Error("Sanitized V1 payload schema or cutoff is invalid.");
}
if (payload?.rules?.canonicalSixMemberGroupOnly !== true || !payload.sourceGroupFingerprint) {
  throw new Error("Sanitized V1 payload lacks canonical group proof.");
}
const payloadNames = payload.profiles.map((profile) => String(profile.normalizedName || "").trim().toUpperCase()).sort();
if (JSON.stringify(payloadNames) !== JSON.stringify(expectedNames)) {
  throw new Error(`Sanitized V1 payload member set is invalid: ${JSON.stringify(payloadNames)}`);
}

const managementHeaders = {
  authorization: `Bearer ${managementToken}`,
  accept: "application/json",
};
const projects = await fetchJson("https://api.supabase.com/v1/projects", { headers: managementHeaders }, "list projects");
if (!Array.isArray(projects)) throw new Error("Supabase management project list was not an array.");

const candidates = [];
const diagnostics = {
  accessibleProjects: projects.length,
  nonV1Projects: 0,
  serviceCredentialProjects: 0,
  canonicalProfileMatches: 0,
  rpcSchemaMatches: 0,
  profileNameSets: [],
};

for (const project of projects) {
  const projectRef = String(project?.id || project?.ref || "").trim();
  if (!projectRef || projectRef === v1ProjectRef) continue;
  diagnostics.nonV1Projects += 1;

  let keys;
  try {
    keys = await fetchJson(
      `https://api.supabase.com/v1/projects/${projectRef}/api-keys`,
      { headers: managementHeaders },
      `resolve API keys for ${projectRef}`,
    );
  } catch {
    continue;
  }
  const serviceKey = serviceKeyFrom(keys);
  if (!serviceKey) continue;
  diagnostics.serviceCredentialProjects += 1;

  const dataHeaders = {
    apikey: serviceKey,
    authorization: `Bearer ${serviceKey}`,
  };
  let profileRows;
  try {
    profileRows = await fetchJson(
      `https://${projectRef}.supabase.co/rest/v1/profiles?select=normalized_name&normalized_name=in.(BROCK,CODY,RHONDA,SHANE,TONY,TYLER)&order=normalized_name.asc`,
      { headers: dataHeaders },
      `read canonical profiles from ${projectRef}`,
    );
  } catch {
    diagnostics.profileNameSets.push({ projectRef, names: [], readable: false });
    continue;
  }
  const names = normalizedNames(profileRows);
  diagnostics.profileNameSets.push({ projectRef, names, readable: true });
  const profileMatch = JSON.stringify(names) === JSON.stringify(expectedNames);
  if (!profileMatch) continue;
  diagnostics.canonicalProfileMatches += 1;

  let rpcVisible = false;
  try {
    const schema = await fetchJson(
      `https://${projectRef}.supabase.co/rest/v1/`,
      { headers: { ...dataHeaders, accept: "application/openapi+json" } },
      `read PostgREST schema from ${projectRef}`,
    );
    rpcVisible = Boolean(schema?.paths?.[rpcPath]);
  } catch {
    rpcVisible = false;
  }
  if (rpcVisible) diagnostics.rpcSchemaMatches += 1;

  candidates.push({ projectRef, serviceKey, rpcVisible });
}

console.log(JSON.stringify({ targetDiscovery: diagnostics }));
if (candidates.length !== 1) {
  throw new Error(`Expected exactly one canonical six-profile V2 target; found ${candidates.length}.`);
}

const target = candidates[0];
if (!target.rpcVisible) {
  console.log(JSON.stringify({ warning: "RPC absent from cached OpenAPI schema; attempting exact endpoint once." }));
}
const dataHeaders = {
  apikey: target.serviceKey,
  authorization: `Bearer ${target.serviceKey}`,
  "content-type": "application/json",
};
const requestBody = JSON.stringify({ p_payload: payload });

async function runImport(label) {
  return fetchJson(
    `https://${target.projectRef}.supabase.co/rest/v1${rpcPath}`,
    { method: "POST", headers: dataHeaders, body: requestBody },
    label,
  );
}

const first = await runImport("first atomic import");
await writeFile(firstReportPath, `${JSON.stringify(first, null, 2)}\n`, { mode: 0o600 });
const second = await runImport("second atomic import");
await writeFile(secondReportPath, `${JSON.stringify(second, null, 2)}\n`, { mode: 0o600 });

for (const [label, report] of [["first", first], ["second", second]]) {
  if (!report?.changes || !report?.profiles) throw new Error(`${label} report is missing reconciliation data.`);
  if (report?.recordScoringRules?.missingSelectionCountsAsLoss !== false) {
    throw new Error(`${label} report counts missing selections as losses.`);
  }
  if (report?.recordScoringRules?.predeterminedRecordExpected !== false) {
    throw new Error(`${label} report requires a predetermined record.`);
  }
  if (report.protectedBeforeHash !== report.protectedAfterHash) {
    throw new Error(`${label} import changed protected July 25+ Picks data.`);
  }
}

const mutationKeys = ["avatarsInserted", "findLeaderInserted", "eventsInserted", "boutsInserted", "picksInserted"];
const secondMutations = Object.fromEntries(
  mutationKeys.map((key) => [key, Number(second.changes?.[key] || 0)]).filter(([, value]) => value !== 0),
);
if (Object.keys(secondMutations).length) {
  throw new Error(`Second import mutated rows: ${JSON.stringify(secondMutations)}`);
}
if (first.protectedAfterHash !== second.protectedBeforeHash) {
  throw new Error("Protected Picks hash changed between import calls.");
}
if (JSON.stringify(first.profiles) !== JSON.stringify(second.profiles)) {
  throw new Error("Derived member records changed on the second import.");
}

const combined = {
  schemaVersion: 1,
  v1SourceSha: process.env.GITHUB_SHA || null,
  v2TargetRef: target.projectRef,
  payloadChecksum,
  targetDiscovery: diagnostics,
  firstRun: first,
  secondRun: second,
};
await writeFile(combinedReportPath, `${JSON.stringify(combined, null, 2)}\n`, { mode: 0o600 });

const cody = first.profiles.CODY || {};
console.log(JSON.stringify({
  status: "reconciled",
  codyRecord: {
    wins: cody.historicalPicksCorrect || 0,
    losses: cody.historicalPicksIncorrect || 0,
    missing: cody.historicalPicksMissing || 0,
  },
  codyFindLeader: {
    recordedDays: cody.recordedDays || 0,
    bestStreak: cody.bestStreak || 0,
    perfect10s: cody.perfect10s || 0,
    bestScore: cody.bestScore || 0,
  },
  firstRunChanges: first.changes,
  secondRunChanges: second.changes,
  protectedHash: first.protectedAfterHash,
}));

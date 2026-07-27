import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";

const V1_URL = String(process.env.V1_SUPABASE_URL || "").replace(/\/$/, "");
const V2_URL = String(process.env.V2_SUPABASE_URL || "").replace(/\/$/, "");
const V1_KEY = String(process.env.V1_SERVICE_ROLE_KEY || "");
const V2_KEY = String(process.env.V2_SERVICE_ROLE_KEY || "");
const REPORT_PATH = String(process.env.RECOVERY_REPORT || "/tmp/ankalaev-guskov-pick-recovery.json");
const EVENT_ID = "ufc-fight-night-ankalaev-guskov-2026-07-25";
const EXPECTED_CANONICAL_NAMES = ["BROCK", "CODY", "RHONDA", "SHANE", "TONY", "TYLER"];
const RECOVERY_NAMES = ["CODY", "SHANE"];

for (const [name, value] of Object.entries({ V1_SUPABASE_URL: V1_URL, V2_SUPABASE_URL: V2_URL, V1_SERVICE_ROLE_KEY: V1_KEY, V2_SERVICE_ROLE_KEY: V2_KEY })) {
  if (!value) throw new Error(`${name} is required.`);
}

const v1Headers = { apikey: V1_KEY, authorization: `Bearer ${V1_KEY}`, accept: "application/json" };
const v2Headers = { apikey: V2_KEY, authorization: `Bearer ${V2_KEY}`, accept: "application/json" };

function normalizeName(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toUpperCase();
}

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pairKey(redName, blueName) {
  return [slugify(redName), slugify(blueName)].sort().join("|");
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

function hash(value) {
  return createHash("sha256").update(JSON.stringify(stable(value))).digest("hex");
}

function inFilter(values) {
  return `in.(${[...new Set(values)].join(",")})`;
}

function sameSet(actual, expected) {
  const a = [...new Set(actual)].sort();
  const b = [...new Set(expected)].sort();
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

async function requestJson(url, options = {}, label = "request") {
  const response = await fetch(url, options);
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!response.ok) {
    const detail = typeof body === "string" ? body.slice(0, 500) : JSON.stringify(body).slice(0, 500);
    throw new Error(`${label} failed (${response.status}): ${detail}`);
  }
  return body;
}

async function fetchRows(baseUrl, headers, table, params = {}, label = table) {
  const rows = [];
  const pageSize = 1000;
  for (let start = 0; ; start += pageSize) {
    const url = new URL(`${baseUrl}/rest/v1/${table}`);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
    }
    const page = await requestJson(url, {
      headers: { ...headers, Range: `${start}-${start + pageSize - 1}`, "Range-Unit": "items" },
    }, label);
    if (!Array.isArray(page)) throw new Error(`${label} did not return an array.`);
    rows.push(...page);
    if (page.length < pageSize) break;
  }
  return rows;
}

async function insertRows(baseUrl, headers, table, rows, label) {
  if (!rows.length) return [];
  return requestJson(`${baseUrl}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      ...headers,
      "content-type": "application/json",
      Prefer: "resolution=ignore-duplicates,return=representation",
    },
    body: JSON.stringify(rows),
  }, label);
}

async function loadV1Source() {
  const groupMembers = await fetchRows(V1_URL, v1Headers, "pick_group_members", {
    select: "id,group_id,display_name",
    order: "created_at.asc",
  }, "read V1 group members");

  const membersByGroup = new Map();
  for (const member of groupMembers) {
    const bucket = membersByGroup.get(member.group_id) || [];
    bucket.push(member);
    membersByGroup.set(member.group_id, bucket);
  }
  const canonicalGroups = [...membersByGroup.entries()].filter(([, members]) =>
    sameSet(members.map((member) => normalizeName(member.display_name)), EXPECTED_CANONICAL_NAMES)
  );
  if (canonicalGroups.length !== 1) throw new Error(`Expected one exact canonical six-member V1 group; found ${canonicalGroups.length}.`);
  const [groupId, canonicalMembers] = canonicalGroups[0];
  const canonicalMemberById = new Map(canonicalMembers.map((member) => [member.id, member]));

  const events = await fetchRows(V1_URL, v1Headers, "pick_events", {
    select: "id,name,subtitle,event_date,status",
    id: `eq.${EVENT_ID}`,
  }, "read V1 target event");
  if (events.length !== 1) throw new Error(`Expected one V1 ${EVENT_ID} event; found ${events.length}.`);

  const groupEvents = await fetchRows(V1_URL, v1Headers, "pick_group_events", {
    select: "group_id,event_id,room_id",
    group_id: `eq.${groupId}`,
    event_id: `eq.${EVENT_ID}`,
  }, "read V1 canonical group event");
  if (groupEvents.length !== 1) throw new Error(`Expected one canonical V1 room for ${EVENT_ID}; found ${groupEvents.length}.`);
  const roomId = groupEvents[0].room_id;

  const roomMembers = await fetchRows(V1_URL, v1Headers, "pick_room_members", {
    select: "id,room_id,display_name,group_member_id",
    room_id: `eq.${roomId}`,
  }, "read V1 room members");
  const roomMemberNameById = new Map();
  for (const member of roomMembers) {
    const canonical = member.group_member_id ? canonicalMemberById.get(member.group_member_id) : null;
    const name = normalizeName(canonical?.display_name || member.display_name);
    if (EXPECTED_CANONICAL_NAMES.includes(name)) roomMemberNameById.set(member.id, name);
  }

  const fights = await fetchRows(V1_URL, v1Headers, "pick_fights", {
    select: "id,event_id,bout_order,red_name,blue_name,red_odds,blue_odds,lock_at,result_status,winner_name",
    event_id: `eq.${EVENT_ID}`,
    order: "bout_order.asc",
  }, "read V1 target fights");
  if (!fights.length) throw new Error("V1 target event has no fights.");
  const fightById = new Map(fights.map((fight) => [fight.id, fight]));

  const selections = await fetchRows(V1_URL, v1Headers, "pick_selections", {
    select: "member_id,fight_id,fighter_name,picked_at,is_underdog_lock",
    member_id: inFilter([...roomMemberNameById.keys()]),
    fight_id: inFilter(fights.map((fight) => fight.id)),
    order: "picked_at.asc",
  }, "read V1 target selections");

  const sourcePicks = [];
  for (const selection of selections) {
    const memberName = roomMemberNameById.get(selection.member_id);
    const fight = fightById.get(selection.fight_id);
    if (!memberName || !fight) continue;
    const fighterName = String(selection.fighter_name || "").trim();
    if (![normalizeName(fight.red_name), normalizeName(fight.blue_name)].includes(normalizeName(fighterName))) {
      throw new Error(`Invalid V1 fighter selection for ${memberName} on ${fight.id}.`);
    }
    sourcePicks.push({
      memberName,
      sourceFightId: fight.id,
      pairKey: pairKey(fight.red_name, fight.blue_name),
      fighterName,
      fighterNameKey: slugify(fighterName),
      pickedAt: selection.picked_at || events[0].event_date,
      isUnderdogLock: selection.is_underdog_lock === true,
      selectedOdds: normalizeName(fighterName) === normalizeName(fight.red_name) ? fight.red_odds : fight.blue_odds,
      sourceRedName: fight.red_name,
      sourceBlueName: fight.blue_name,
    });
  }

  const entrants = [...new Set(sourcePicks.map((pick) => pick.memberName))].sort();
  if (!sameSet(entrants, RECOVERY_NAMES)) {
    throw new Error(`Expected only Cody and Shane to have V1 selections; found ${JSON.stringify(entrants)}.`);
  }

  for (const name of RECOVERY_NAMES) {
    const picks = sourcePicks.filter((pick) => pick.memberName === name);
    if (picks.length !== 6) throw new Error(`Expected six V1 picks for ${name}; found ${picks.length}.`);
    if (new Set(picks.map((pick) => pick.pairKey)).size !== 6) throw new Error(`Duplicate V1 matchup detected for ${name}.`);
    const locks = picks.filter((pick) => pick.isUnderdogLock);
    if (locks.length > 1) throw new Error(`Multiple V1 Underdog Locks found for ${name}.`);
    if (locks.length === 1 && (!Number.isInteger(Number(locks[0].selectedOdds)) || Number(locks[0].selectedOdds) < 100)) {
      throw new Error(`V1 Underdog Lock for ${name} lacks proven positive American odds.`);
    }
  }

  return {
    event: events[0],
    groupFingerprint: hash(groupId).slice(0, 16),
    picks: sourcePicks,
  };
}

async function loadV2State() {
  const events = await fetchRows(V2_URL, v2Headers, "pick_events", {
    select: "event_id,name,subtitle,status,starts_at,locks_at,season,completed_at",
    event_id: `eq.${EVENT_ID}`,
  }, "read V2 target event");
  if (events.length !== 1) throw new Error(`Expected one V2 ${EVENT_ID} event; found ${events.length}.`);
  const event = events[0];
  if (!["upcoming", "locked"].includes(event.status)) throw new Error(`V2 target event status is ${event.status}; expected upcoming or locked.`);
  if (event.completed_at) throw new Error("V2 target event is already completed.");

  const bouts = await fetchRows(V2_URL, v2Headers, "pick_bouts", {
    select: "event_id,bout_id,position,red_fighter_slug,red_fighter_name,blue_fighter_slug,blue_fighter_name,result_status,winner_fighter_slug,red_american_odds,blue_american_odds",
    event_id: `eq.${EVENT_ID}`,
    order: "position.asc",
  }, "read V2 target bouts");
  if (bouts.length !== 6) throw new Error(`Expected six V2 target bouts; found ${bouts.length}.`);
  for (const bout of bouts) {
    if (bout.result_status !== "pending" || bout.winner_fighter_slug) {
      throw new Error(`V2 bout ${bout.bout_id} already has a result.`);
    }
  }

  const profiles = await fetchRows(V2_URL, v2Headers, "profiles", {
    select: "id,display_name,normalized_name",
    normalized_name: "in.(CODY,SHANE)",
    order: "normalized_name.asc",
  }, "read V2 Cody and Shane profiles");
  if (!sameSet(profiles.map((profile) => normalizeName(profile.normalized_name)), RECOVERY_NAMES) || profiles.length !== 2) {
    throw new Error(`V2 Cody/Shane profile resolution failed: ${JSON.stringify(profiles.map((profile) => profile.normalized_name))}.`);
  }

  const allTargetPicks = await fetchRows(V2_URL, v2Headers, "profile_event_picks", {
    select: "profile_id,event_id,bout_id,fighter_slug,picked_at,updated_at",
    event_id: `eq.${EVENT_ID}`,
    order: "profile_id.asc,bout_id.asc",
  }, "read V2 target picks");
  const allowedProfileIds = new Set(profiles.map((profile) => profile.id));
  const unexpectedPicks = allTargetPicks.filter((pick) => !allowedProfileIds.has(pick.profile_id));
  if (unexpectedPicks.length) throw new Error(`V2 target event contains ${unexpectedPicks.length} picks outside Cody and Shane.`);

  const allTargetLocks = await fetchRows(V2_URL, v2Headers, "profile_event_underdog_locks", {
    select: "profile_id,event_id,bout_id,fighter_slug,selected_at,frozen_american_odds,frozen_at",
    event_id: `eq.${EVENT_ID}`,
    order: "profile_id.asc",
  }, "read V2 target locks");
  const unexpectedLocks = allTargetLocks.filter((lock) => !allowedProfileIds.has(lock.profile_id));
  if (unexpectedLocks.length) throw new Error(`V2 target event contains ${unexpectedLocks.length} locks outside Cody and Shane.`);

  return { event, bouts, profiles, picks: allTargetPicks, locks: allTargetLocks };
}

async function protectedSnapshot() {
  const [events, bouts, otherPicks, otherLocks] = await Promise.all([
    fetchRows(V2_URL, v2Headers, "pick_events", { select: "event_id,name,subtitle,status,starts_at,locks_at,season,completed_at", order: "event_id.asc" }, "snapshot V2 events"),
    fetchRows(V2_URL, v2Headers, "pick_bouts", { select: "event_id,bout_id,position,red_fighter_slug,blue_fighter_slug,result_status,winner_fighter_slug,red_american_odds,blue_american_odds", order: "event_id.asc,bout_id.asc" }, "snapshot V2 bouts"),
    fetchRows(V2_URL, v2Headers, "profile_event_picks", { select: "profile_id,event_id,bout_id,fighter_slug,picked_at,updated_at", event_id: `neq.${EVENT_ID}`, order: "event_id.asc,profile_id.asc,bout_id.asc" }, "snapshot unrelated V2 picks"),
    fetchRows(V2_URL, v2Headers, "profile_event_underdog_locks", { select: "profile_id,event_id,bout_id,fighter_slug,selected_at,frozen_american_odds,frozen_at", event_id: `neq.${EVENT_ID}`, order: "event_id.asc,profile_id.asc" }, "snapshot unrelated V2 locks"),
  ]);
  return { hash: hash({ events, bouts, otherPicks, otherLocks }), counts: { events: events.length, bouts: bouts.length, otherPicks: otherPicks.length, otherLocks: otherLocks.length } };
}

function buildExpectedRows(source, state) {
  const profileByName = new Map(state.profiles.map((profile) => [normalizeName(profile.normalized_name), profile]));
  const boutByPair = new Map(state.bouts.map((bout) => [pairKey(bout.red_fighter_name, bout.blue_fighter_name), bout]));
  if (boutByPair.size !== 6) throw new Error("V2 target bouts do not contain six distinct matchup pairs.");

  const picks = source.picks.map((sourcePick) => {
    const profile = profileByName.get(sourcePick.memberName);
    const bout = boutByPair.get(sourcePick.pairKey);
    if (!profile || !bout) throw new Error(`Could not map ${sourcePick.memberName} source pick on ${sourcePick.sourceRedName} vs. ${sourcePick.sourceBlueName} into V2.`);
    const chosenSlug = sourcePick.fighterNameKey === slugify(bout.red_fighter_name)
      ? bout.red_fighter_slug
      : sourcePick.fighterNameKey === slugify(bout.blue_fighter_name)
        ? bout.blue_fighter_slug
        : null;
    if (!chosenSlug) throw new Error(`Could not map selected fighter ${sourcePick.fighterName} into V2 bout ${bout.bout_id}.`);
    return {
      profile_id: profile.id,
      event_id: EVENT_ID,
      bout_id: bout.bout_id,
      fighter_slug: chosenSlug,
      picked_at: sourcePick.pickedAt,
      updated_at: sourcePick.pickedAt,
      memberName: sourcePick.memberName,
      fighterName: chosenSlug === bout.red_fighter_slug ? bout.red_fighter_name : bout.blue_fighter_name,
      isUnderdogLock: sourcePick.isUnderdogLock,
      selectedOdds: sourcePick.selectedOdds == null ? null : Number(sourcePick.selectedOdds),
    };
  });

  const locks = picks.filter((pick) => pick.isUnderdogLock).map((pick) => ({
    profile_id: pick.profile_id,
    event_id: EVENT_ID,
    bout_id: pick.bout_id,
    fighter_slug: pick.fighter_slug,
    selected_at: pick.picked_at,
    frozen_american_odds: pick.selectedOdds,
    frozen_at: state.event.locks_at,
    memberName: pick.memberName,
    fighterName: pick.fighterName,
  }));

  if (picks.length !== 12) throw new Error(`Expected 12 mapped picks; found ${picks.length}.`);
  if (new Set(picks.map((pick) => `${pick.profile_id}|${pick.bout_id}`)).size !== 12) throw new Error("Mapped V2 picks are not unique.");
  return { picks, locks };
}

function compareCurrent(state, expected) {
  const expectedPickByKey = new Map(expected.picks.map((pick) => [`${pick.profile_id}|${pick.bout_id}`, pick]));
  const currentPickByKey = new Map(state.picks.map((pick) => [`${pick.profile_id}|${pick.bout_id}`, pick]));
  for (const current of state.picks) {
    const expectedPick = expectedPickByKey.get(`${current.profile_id}|${current.bout_id}`);
    if (!expectedPick || current.fighter_slug !== expectedPick.fighter_slug) {
      throw new Error(`Conflicting V2 target pick exists for profile ${current.profile_id}, bout ${current.bout_id}.`);
    }
  }
  const missingPicks = expected.picks.filter((pick) => !currentPickByKey.has(`${pick.profile_id}|${pick.bout_id}`));

  const expectedLockByProfile = new Map(expected.locks.map((lock) => [lock.profile_id, lock]));
  const currentLockByProfile = new Map(state.locks.map((lock) => [lock.profile_id, lock]));
  for (const current of state.locks) {
    const expectedLock = expectedLockByProfile.get(current.profile_id);
    if (!expectedLock
      || current.bout_id !== expectedLock.bout_id
      || current.fighter_slug !== expectedLock.fighter_slug
      || Number(current.frozen_american_odds) !== Number(expectedLock.frozen_american_odds)) {
      throw new Error(`Conflicting V2 target Underdog Lock exists for profile ${current.profile_id}.`);
    }
  }
  for (const profileId of currentLockByProfile.keys()) {
    if (!expectedLockByProfile.has(profileId)) throw new Error(`V2 has an unproven target lock for profile ${profileId}.`);
  }
  const missingLocks = expected.locks.filter((lock) => !currentLockByProfile.has(lock.profile_id));
  return { missingPicks, missingLocks };
}

async function reconcileOnce(source, label) {
  const state = await loadV2State();
  const expected = buildExpectedRows(source, state);
  const { missingPicks, missingLocks } = compareCurrent(state, expected);

  await insertRows(V2_URL, v2Headers, "profile_event_picks", missingPicks.map(({ memberName, fighterName, isUnderdogLock, selectedOdds, ...row }) => row), `${label}: insert missing V2 picks`);
  await insertRows(V2_URL, v2Headers, "profile_event_underdog_locks", missingLocks.map(({ memberName, fighterName, ...row }) => row), `${label}: insert missing V2 locks`);

  const after = await loadV2State();
  const afterExpected = buildExpectedRows(source, after);
  const remaining = compareCurrent(after, afterExpected);
  if (remaining.missingPicks.length || remaining.missingLocks.length) throw new Error(`${label} did not fully reconcile target rows.`);
  if (after.picks.length !== 12) throw new Error(`${label} expected 12 target picks after recovery; found ${after.picks.length}.`);
  if (after.locks.length !== expected.locks.length) throw new Error(`${label} expected ${expected.locks.length} target locks after recovery; found ${after.locks.length}.`);

  return {
    insertedPicks: missingPicks.length,
    insertedLocks: missingLocks.length,
    targetPickCount: after.picks.length,
    targetLockCount: after.locks.length,
    picks: expected.picks.map((pick) => ({ member: pick.memberName, boutId: pick.bout_id, fighter: pick.fighterName })),
    locks: expected.locks.map((lock) => ({ member: lock.memberName, boutId: lock.bout_id, fighter: lock.fighterName, frozenAmericanOdds: lock.frozen_american_odds })),
  };
}

const source = await loadV1Source();
const protectedBefore = await protectedSnapshot();
const first = await reconcileOnce(source, "first recovery pass");
const protectedAfterFirst = await protectedSnapshot();
if (protectedBefore.hash !== protectedAfterFirst.hash) throw new Error("Recovery changed protected V2 events, bouts, or unrelated picks/locks.");
const second = await reconcileOnce(source, "idempotency pass");
const protectedAfterSecond = await protectedSnapshot();
if (protectedBefore.hash !== protectedAfterSecond.hash) throw new Error("Idempotency pass changed protected V2 data.");
if (second.insertedPicks !== 0 || second.insertedLocks !== 0) throw new Error(`Second recovery pass was not idempotent: ${JSON.stringify(second)}.`);

const report = {
  schemaVersion: 1,
  operation: "ankalaev-guskov-pick-recovery",
  eventId: EVENT_ID,
  generatedAt: new Date().toISOString(),
  source: {
    system: "Octagon HQ V1 production",
    canonicalGroupFingerprint: source.groupFingerprint,
    entrants: RECOVERY_NAMES,
    pickCount: source.picks.length,
    lockCount: source.picks.filter((pick) => pick.isUnderdogLock).length,
  },
  safety: {
    resultsChanged: false,
    eventStatusChanged: false,
    eventOrBoutRowsChanged: false,
    unrelatedRowsChanged: false,
    protectedHash: protectedBefore.hash,
    protectedCounts: protectedBefore.counts,
  },
  firstPass: first,
  secondPass: second,
};

await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, { mode: 0o600 });
console.log(JSON.stringify({
  status: "reconciled",
  eventId: EVENT_ID,
  firstPass: { insertedPicks: first.insertedPicks, insertedLocks: first.insertedLocks, targetPickCount: first.targetPickCount, targetLockCount: first.targetLockCount },
  secondPass: { insertedPicks: second.insertedPicks, insertedLocks: second.insertedLocks },
  protectedHash: protectedBefore.hash,
}));

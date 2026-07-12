import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM, VirtualConsole } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), '..');
const indexPath = path.join(root, 'index.html');
const outputPath = path.join(root, 'docs', 'loss-context-hybrid-audit-output.json');

let html = await fs.readFile(indexPath, 'utf8');
// The audit is ready once ranking-data-patches launches the canonical scoring pipeline.
// Remove later UI-only and external scripts to keep CI deterministic and network-free.
html = html.replace(/<script\s+src="https?:\/\/[^\"]+"[^>]*><\/script>/g, '');
const cutoff = html.indexOf('<script src="assets/js/profile-stat-consistency.js');
if (cutoff >= 0) html = `${html.slice(0, cutoff)}\n</body>\n</html>`;

const jsErrors = [];
const virtualConsole = new VirtualConsole();
virtualConsole.on('jsdomError', error => jsErrors.push(String(error?.stack || error)));
virtualConsole.on('error', (...args) => jsErrors.push(args.map(String).join(' ')));

const dom = new JSDOM(html, {
  url: pathToFileURL(indexPath).href,
  runScripts: 'dangerously',
  resources: 'usable',
  pretendToBeVisual: true,
  virtualConsole,
  beforeParse(window) {
    window.requestAnimationFrame = callback => window.setTimeout(() => callback(Date.now()), 0);
    window.cancelAnimationFrame = id => window.clearTimeout(id);
    window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } });
    window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
    window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
    window.scrollTo = () => {};
    window.fetch = async () => ({ ok: false, status: 404, json: async () => ({}), text: async () => '' });
  }
});

const { window } = dom;
const timeoutMs = 90_000;
const started = Date.now();

await new Promise((resolve, reject) => {
  const check = () => {
    const audit = window.UFC_LOSS_CONTEXT_HYBRID_AUDIT;
    if (audit?.applied) return resolve();
    if (window.UFC_SCORING_PIPELINE?.status === 'error') {
      return reject(new Error(window.UFC_SCORING_PIPELINE.error || 'Scoring pipeline failed.'));
    }
    if (Date.now() - started > timeoutMs) {
      return reject(new Error(`Timed out waiting for hybrid audit. Pipeline: ${JSON.stringify(window.UFC_SCORING_PIPELINE || null)}; JS errors: ${jsErrors.slice(-10).join(' | ')}`));
    }
    window.setTimeout(check, 100);
  };
  check();
});

const audit = window.UFC_LOSS_CONTEXT_HYBRID_AUDIT;
const shadow = window.UFC_LOSS_CONTEXT_HYBRID_SHADOW;
const pick = row => ({
  fighter: row.fighter,
  board: row.board,
  currentRank: row.currentRank,
  projectedRank: row.projectedRank,
  rankMovement: row.rankMovement,
  currentPenalty: row.currentPenalty,
  recommendedPenalty: row.recommendedPenalty,
  projectedDelta: row.projectedDelta,
  severity: row.severity,
  frequency: row.frequency,
  preDivision: row.preDivision,
  divisionMultiplier: row.divisionMultiplier,
  divisionDiscountPct: row.divisionDiscountPct,
  divisionPointsSaved: row.divisionPointsSaved,
  exposure: row.exposure,
  exposureWindowEnd: row.exposureWindowEnd,
  excludedPostPrimeFightCount: row.excludedPostPrimeFightCount,
  eventCount: row.eventCount,
  worstLosses: row.worstLosses,
  blockers: row.blockers
});

const flagNames = {};
for (const [name, rows] of Object.entries(audit.flags || {})) {
  flagNames[name] = (rows || []).map(pick);
}

const output = {
  generatedAt: new Date().toISOString(),
  sourceCommit: process.env.GITHUB_SHA || null,
  pipelineVersion: window.UFC_SCORING_PIPELINE?.version || null,
  shadowVersion: shadow?.version || null,
  auditVersion: audit.version,
  rules: shadow?.rules || null,
  summary: audit.summary,
  readyForLivePromotion: audit.readyForLivePromotion,
  criticalFlags: audit.criticalFlags,
  largestRelief: (audit.largestRelief || []).map(pick),
  harshestProjected: (audit.harshestProjected || []).map(pick),
  biggestRankMovers: (audit.biggestRankMovers || []).map(pick),
  spotlight: (audit.spotlight || []).map(pick),
  flags: flagNames,
  allResults: (shadow?.results || []).map(pick),
  jsErrors: jsErrors.slice(-25)
};

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({
  summary: output.summary,
  readyForLivePromotion: output.readyForLivePromotion,
  criticalFlags: output.criticalFlags,
  largestRelief: output.largestRelief.slice(0, 10),
  harshestProjected: output.harshestProjected.slice(0, 10),
  biggestRankMovers: output.biggestRankMovers.slice(0, 10),
  jsErrors: output.jsErrors
}, null, 2));

if (!output.summary?.coverageComplete) process.exitCode = 2;

import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const FEED_PATH = path.join(ROOT, 'assets/data/octagon-verdict-data.json');
const REPORT_PATH = path.join(ROOT, 'docs/division-era-depth-shadow-report.json');
const RUNTIME_PATH = path.join(ROOT, 'assets/data/division-era-depth-shadow.js');
const GENERATOR_PATH = path.join(ROOT, 'scripts/build-division-era-depth-shadow.mjs');
const OLD_VERSION = 'division-era-depth-shadow-20260712a-fight-network';
const VERSION = 'division-era-depth-shadow-20260712b-alias-complete';

const ALIASES = new Map([
  ['B.J. Penn', 'BJ Penn'],
  ['T.J. Dillashaw', 'TJ Dillashaw'],
  ['Cris Cyborg', 'Cristiane Justino']
]);
const RESTORE = new Map([...ALIASES.entries()].map(([canonical, dataset]) => [dataset, canonical]));

function replaceAllAliases(text) {
  let output = String(text);
  for (const [dataset, canonical] of RESTORE) {
    output = output.replaceAll(`\"${dataset}\"`, `\"${canonical}\"`);
  }
  return output.replaceAll(OLD_VERSION, VERSION);
}

async function main() {
  const originalFeedText = await fs.readFile(FEED_PATH, 'utf8');
  const feed = JSON.parse(originalFeedText);
  let changed = 0;
  for (const fighter of feed.fighters || []) {
    const alias = ALIASES.get(fighter.name);
    if (!alias) continue;
    fighter.name = alias;
    changed += 1;
  }
  if (changed !== ALIASES.size) {
    throw new Error(`Expected ${ALIASES.size} fighter aliases, applied ${changed}.`);
  }

  try {
    await fs.writeFile(FEED_PATH, `${JSON.stringify(feed)}\n`);
    const run = spawnSync(process.execPath, [GENERATOR_PATH], {
      cwd: ROOT,
      stdio: 'inherit',
      env: process.env
    });
    if (run.status !== 0) throw new Error(`Depth generator exited with status ${run.status}.`);

    const report = JSON.parse(await fs.readFile(REPORT_PATH, 'utf8'));
    const restored = JSON.parse(replaceAllAliases(JSON.stringify(report)));
    restored.version = VERSION;
    restored.aliasResolution = {
      version: VERSION,
      applied: true,
      aliases: Object.fromEntries(ALIASES),
      directMatchCoverageRequired: true
    };
    const fallbacks = (restored.fighters || []).filter(row => row.fallback || Number(row.matchedPrimeFightCount || 0) < 1);
    restored.summary.fallbackCount = fallbacks.length;
    restored.summary.directMatchCoverageCount = restored.fighters.length - fallbacks.length;
    restored.summary.aliasResolutionComplete = fallbacks.length === 0;
    if (restored.summary.rosterCount !== 63 || fallbacks.length) {
      throw new Error(`Alias-complete depth coverage failed: ${63 - fallbacks.length}/63 direct matches; ${fallbacks.map(row => row.fighter).join(', ')}`);
    }
    await fs.writeFile(REPORT_PATH, `${JSON.stringify(restored, null, 2)}\n`);

    const runtimeText = await fs.readFile(RUNTIME_PATH, 'utf8');
    await fs.writeFile(RUNTIME_PATH, replaceAllAliases(runtimeText));

    console.log(JSON.stringify({
      version: VERSION,
      rosterCount: restored.summary.rosterCount,
      coverageCount: restored.summary.coverageCount,
      directMatchCoverageCount: restored.summary.directMatchCoverageCount,
      fallbackCount: restored.summary.fallbackCount,
      concernGroup: restored.summary.concernGroup
    }, null, 2));
  } finally {
    await fs.writeFile(FEED_PATH, originalFeedText);
  }
}

main().catch(error => {
  console.error(error?.stack || error);
  process.exitCode = 1;
});

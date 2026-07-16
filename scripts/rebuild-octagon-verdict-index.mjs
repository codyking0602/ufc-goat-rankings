import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const INDEX_SCHEMA_VERSION = 1;
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const fighterDir = path.join(repoRoot, 'assets', 'data', 'octagon-verdict', 'fighters');
const indexPath = path.join(repoRoot, 'assets', 'data', 'octagon-verdict', 'index.json');

function fail(message) {
  throw new Error(`[octagon-verdict-index] ${message}`);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`Could not parse ${path.relative(repoRoot, filePath)}: ${error.message}`);
  }
}

function readSourceVersion(relativePath) {
  const filePath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(filePath)) return null;
  const source = fs.readFileSync(filePath, 'utf8');
  const match = source.match(/\bconst\s+VERSION\s*=\s*['"]([^'"]+)['"]/);
  return match?.[1] || null;
}

if (!fs.existsSync(fighterDir)) fail('Missing fighter JSON directory.');
if (!fs.existsSync(indexPath)) fail('Missing aggregate index.json.');

const fighterFiles = fs.readdirSync(fighterDir)
  .filter((fileName) => fileName.endsWith('.json'))
  .sort((a, b) => a.localeCompare(b));

if (!fighterFiles.length) fail('No fighter JSON files were found.');

const seenSlugs = new Set();
const seenNames = new Set();
const seenGroupRanks = new Set();
const groupOrder = new Map([['men', 0], ['women', 1]]);

const fighters = fighterFiles.map((fileName) => {
  const filePath = path.join(fighterDir, fileName);
  const fighter = readJson(filePath);

  if (!fighter || typeof fighter !== 'object' || Array.isArray(fighter)) {
    fail(`${fileName} must contain one fighter object.`);
  }

  const requiredStrings = ['slug', 'name', 'group', 'division'];
  requiredStrings.forEach((field) => {
    if (typeof fighter[field] !== 'string' || !fighter[field].trim()) {
      fail(`${fileName} is missing a valid ${field}.`);
    }
  });

  if (!Number.isInteger(fighter.rank) || fighter.rank < 1) {
    fail(`${fileName} has an invalid rank.`);
  }
  if (!Number.isFinite(fighter.appOvr)) {
    fail(`${fileName} has an invalid appOvr.`);
  }
  if (!Number.isFinite(fighter.totalScore)) {
    fail(`${fileName} has an invalid totalScore.`);
  }
  if (!Array.isArray(fighter.divisionBoards)) {
    fail(`${fileName} is missing divisionBoards.`);
  }

  const expectedFileName = `${fighter.slug}.json`;
  if (fileName !== expectedFileName) {
    fail(`${fileName} does not match fighter slug ${fighter.slug}.`);
  }
  if (seenSlugs.has(fighter.slug)) fail(`Duplicate fighter slug: ${fighter.slug}.`);
  if (seenNames.has(fighter.name)) fail(`Duplicate fighter name: ${fighter.name}.`);

  const groupRankKey = `${fighter.group}:${fighter.rank}`;
  if (seenGroupRanks.has(groupRankKey)) {
    fail(`Duplicate ${fighter.group} rank ${fighter.rank}.`);
  }

  seenSlugs.add(fighter.slug);
  seenNames.add(fighter.name);
  seenGroupRanks.add(groupRankKey);

  return {
    slug: fighter.slug,
    name: fighter.name,
    group: fighter.group,
    rank: fighter.rank,
    appOvr: fighter.appOvr,
    totalScore: fighter.totalScore,
    division: fighter.division,
    divisionBoards: fighter.divisionBoards,
    tag: typeof fighter.tag === 'string' ? fighter.tag : ''
  };
});

fighters.sort((a, b) => {
  const groupDifference = (groupOrder.get(a.group) ?? 99) - (groupOrder.get(b.group) ?? 99);
  if (groupDifference) return groupDifference;
  if (a.rank !== b.rank) return a.rank - b.rank;
  return a.name.localeCompare(b.name);
});

const divisionNames = new Set();
fighters.forEach((fighter) => {
  fighter.divisionBoards.forEach((board) => {
    if (board && typeof board.division === 'string' && board.division.trim()) {
      divisionNames.add(board.division.trim());
    }
  });
});

const existingIndex = readJson(indexPath);
const generatedAt = new Date().toISOString();
const detectedSourceVersions = {
  scoringPipeline: readSourceVersion('assets/js/production-ranking-bootstrap.js'),
  rankingPipeline: readSourceVersion('assets/js/ranking-pipeline.js'),
  categoryCalculators: readSourceVersion('assets/js/category-calculators.js'),
  canonicalFacts: readSourceVersion('assets/data/canonical-fighter-facts.js'),
  divisionRankings: readSourceVersion('assets/js/division-ranking-pipeline.js'),
  divisionReconciliation: readSourceVersion('assets/js/division-ranking-reconciliation.js')
};

const sourceVersions = { ...(existingIndex.sourceVersions || {}) };
Object.entries(detectedSourceVersions).forEach(([key, value]) => {
  if (value) sourceVersions[key] = value;
});

const rebuiltIndex = {
  ...existingIndex,
  schemaVersion: INDEX_SCHEMA_VERSION,
  version: generatedAt.slice(0, 10),
  generatedAt,
  sourceVersions,
  fighterCount: fighters.length,
  divisionBoardCount: divisionNames.size,
  fighters
};

fs.writeFileSync(indexPath, `${JSON.stringify(rebuiltIndex)}\n`, 'utf8');

const verification = readJson(indexPath);
if (verification.schemaVersion !== INDEX_SCHEMA_VERSION) {
  fail(`Verification failed: schemaVersion is ${verification.schemaVersion}, expected ${INDEX_SCHEMA_VERSION}.`);
}
if (verification.fighterCount !== fighters.length) {
  fail(`Verification failed: fighterCount is ${verification.fighterCount}, expected ${fighters.length}.`);
}
if (verification.fighters.length !== fighters.length) {
  fail(`Verification failed: fighters array has ${verification.fighters.length}, expected ${fighters.length}.`);
}

const verificationSlugs = new Set(verification.fighters.map((fighter) => fighter.slug));
const missingSlugs = fighters
  .map((fighter) => fighter.slug)
  .filter((fighterSlug) => !verificationSlugs.has(fighterSlug));
if (verificationSlugs.size !== fighters.length || missingSlugs.length) {
  fail(`Verification failed: aggregate index roster mismatch${missingSlugs.length ? `; missing ${missingSlugs.join(', ')}` : ''}.`);
}

console.log(`[octagon-verdict-index] Rebuilt ${path.relative(repoRoot, indexPath)} with ${fighters.length} fighters across ${divisionNames.size} division boards.`);

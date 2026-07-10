// One-time branch-only migration: preserve the reviewed profile-facing Prime Records.
// Uses the existing 62-fighter presentation report, with five explicitly reviewed corrections.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = process.cwd();
const DATA_FILE = path.join(ROOT, 'assets/data/ranking-data.js');
const RECORD_RE = /^\d+-\d+(?:-\d+)?(?:,\s*\d+\s*NC)?$/;
const REVIEWED_OVERRIDES = {
  'Holly Holm': '5-5',
  'Miesha Tate': '5-1',
  'Michael Bisping': '7-4',
  'Dustin Poirier': '9-5, 1 NC',
  'Justin Gaethje': '9-5'
};

function matchingBracket(source, start, open, close) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const ch = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === open) depth += 1;
    if (ch === close) {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  throw new Error(`Unmatched ${open}${close} block`);
}

async function capturePresentationRecords() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('http://127.0.0.1:4174/index.html', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000
    });
    await page.waitForFunction(
      () => window.UFC_SCORING_PIPELINE?.status === 'ready' &&
        window.UFC_CATEGORY_RATING_PRIME_RECORD_POLISH?.passed === true,
      { timeout: 90_000 }
    );

    return await page.evaluate(() =>
      window.UFC_CATEGORY_RATING_PRIME_RECORD_POLISH.rows.map(row => ({
        fighter: row.fighter,
        record: row.record
      }))
    );
  } finally {
    await browser.close();
  }
}

(async () => {
  const captured = await capturePresentationRecords();
  if (captured.length !== 62) {
    throw new Error(`Expected 62 Prime Records; captured ${captured.length}`);
  }

  const reviewed = captured.map(row => ({
    fighter: row.fighter,
    record: REVIEWED_OVERRIDES[row.fighter] || row.record
  }));
  const invalid = reviewed.filter(row => !row.fighter || !RECORD_RE.test(String(row.record || '')));
  if (invalid.length) {
    throw new Error(`Invalid reviewed Prime Records: ${JSON.stringify(invalid)}`);
  }

  let source = fs.readFileSync(DATA_FILE, 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox, { filename: DATA_FILE });
  const existing = sandbox.window.RANKING_DATA?.primeRecords || {};
  const records = {};

  for (const row of reviewed) {
    records[row.fighter] = { record: row.record };
    if (existing[row.fighter]?.context) {
      records[row.fighter].context = existing[row.fighter].context;
    }
  }

  const marker = '  "primeRecords": ';
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) throw new Error('Canonical primeRecords map not found');
  const objectStart = source.indexOf('{', markerIndex + marker.length);
  const objectEnd = matchingBracket(source, objectStart, '{', '}');
  const mapJson = JSON.stringify(records, null, 2)
    .split('\n')
    .map((line, index) => index === 0 ? line : `  ${line}`)
    .join('\n');

  source = source.slice(0, objectStart) + mapJson + source.slice(objectEnd + 1);
  source = source.replace(
    '// Prime Record source of truth: RANKING_DATA.primeRecords, formatted from audited Prime Dominance counts.',
    '// Prime Record source of truth: RANKING_DATA.primeRecords, preserving the reviewed profile-facing records.'
  );
  fs.writeFileSync(DATA_FILE, source, 'utf8');

  fs.unlinkSync(__filename);
  console.log(`Synced ${reviewed.length} reviewed profile-facing Prime Records.`);
})().catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});

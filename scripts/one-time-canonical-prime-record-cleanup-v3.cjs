const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = process.cwd();
const RECORD_RE = /^\d+-\d+(?:-\d+)?(?:,\s*\d+\s*NC)?$/;
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const write = (file, content) => fs.writeFileSync(path.join(ROOT, file), content, 'utf8');

function replaceRequired(source, search, replacement, label) {
  if (!source.includes(search)) throw new Error(`Missing expected source for ${label}`);
  return source.replace(search, replacement);
}

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

function stripPrimeRecordLiterals(source) {
  const keys = ['primeRecord', 'primeUfcRecord', 'prime_record', 'primeRecordContext', 'primeWindowContext'];
  for (const key of keys) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    source = source.replace(
      new RegExp(`([,{]\\s*)(["']?${escaped}["']?\\s*:\\s*)'(?:\\\\.|[^'\\\\])*'\\s*,?`, 'g'),
      '$1'
    );
    source = source.replace(
      new RegExp(`([,{]\\s*)(["']?${escaped}["']?\\s*:\\s*)"(?:\\\\.|[^"\\\\])*"\\s*,?`, 'g'),
      '$1'
    );
    source = source.replace(
      new RegExp(`^\\s*["']?${escaped}["']?\\s*:\\s*'(?:\\\\.|[^'\\\\])*'\\s*,?\\s*$`, 'gm'),
      ''
    );
    source = source.replace(
      new RegExp(`^\\s*["']?${escaped}["']?\\s*:\\s*"(?:\\\\.|[^"\\\\])*"\\s*,?\\s*$`, 'gm'),
      ''
    );
  }
  source = source.replace(/\[\s*'Prime Record'\s*,\s*'(?:\\.|[^'\\])*'\s*\]\s*,?/g, '');
  source = source.replace(/\[\s*"Prime Record"\s*,\s*"(?:\\.|[^"\\])*"\s*\]\s*,?/g, '');
  return source;
}

function listJsFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listJsFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(full);
  }
  return files;
}

async function captureAuditedPrimeRecords() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('http://127.0.0.1:4173/index.html', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000
    });
    await page.waitForFunction(
      () => window.UFC_SCORING_PIPELINE?.status === 'ready' && window.UFC_PRIME_DOMINANCE_LEDGERS?.report?.length,
      { timeout: 90_000 }
    );
    return await page.evaluate(() => {
      const boardNames = [
        ...(window.RANKING_DATA?.men || []),
        ...(window.RANKING_DATA?.women || [])
      ].map(row => row.fighter);
      const entries = new Map(
        (window.UFC_PRIME_DOMINANCE_LEDGERS?.report || []).map(entry => [entry.fighter, entry])
      );
      const format = entry => {
        const wins = Number(entry?.primeWins);
        const losses = Number(entry?.primeLosses);
        const draws = Number(entry?.primeDraws || 0);
        const noContests = Number(entry?.primeNCs || 0);
        if (!Number.isFinite(wins) || !Number.isFinite(losses)) return null;
        return `${wins}-${losses}${draws ? `-${draws}` : ''}${noContests ? `, ${noContests} NC` : ''}`;
      };
      return boardNames.map(fighter => {
        const entry = entries.get(fighter) || null;
        return {
          fighter,
          record: format(entry),
          context: entry?.roundControlAudit?.window || window.UFC_PRIME_WINDOWS?.entryFor?.(fighter)?.label || null,
          wins: entry?.primeWins,
          losses: entry?.primeLosses,
          draws: entry?.primeDraws || 0,
          noContests: entry?.primeNCs || 0
        };
      });
    });
  } finally {
    await browser.close();
  }
}

function canonicalizeRankingData(rows) {
  const file = 'assets/data/ranking-data.js';
  let source = stripPrimeRecordLiterals(read(file));
  const records = {};

  for (const row of rows) {
    if (!row?.fighter || !RECORD_RE.test(String(row.record || ''))) {
      throw new Error(`Invalid audited Prime Record: ${JSON.stringify(row)}`);
    }
    records[row.fighter] = {
      record: row.record,
      wins: Number(row.wins),
      losses: Number(row.losses),
      draws: Number(row.draws || 0),
      noContests: Number(row.noContests || 0)
    };
    if (row.context) records[row.fighter].context = String(row.context).trim();
  }

  if (Object.keys(records).length !== 62) {
    throw new Error(`Expected 62 canonical Prime Records; got ${Object.keys(records).length}`);
  }

  const closeIndex = source.lastIndexOf('\n};');
  if (closeIndex < 0) throw new Error('Could not find RANKING_DATA object close');
  const mapJson = JSON.stringify(records, null, 2)
    .split('\n')
    .map((line, index) => index === 0 ? line : `  ${line}`)
    .join('\n');
  source = `${source.slice(0, closeIndex)},\n  "primeRecords": ${mapJson}${source.slice(closeIndex)}`;
  source = source.replace(
    '// UFC GOAT base ranking/profile payload.\n// Main score/stat source for fighter rankings.',
    '// UFC GOAT canonical ranking/profile payload.\n// Prime Record source of truth: RANKING_DATA.primeRecords, formatted from audited Prime Dominance counts.'
  );
  write(file, source);
}

function cleanLegacyPrimeRecordWriters() {
  const files = new Set([
    'assets/data/display-overrides.js',
    'assets/data/ranking-data-additions.js',
    'assets/data/fighter-packets.js',
    ...listJsFiles(path.join(ROOT, 'assets/data/fighter-packets')).map(file => path.relative(ROOT, file))
  ]);
  for (const file of files) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) continue;
    write(file, stripPrimeRecordLiterals(read(file)));
  }
}

function updatePrimeWindows() {
  const file = 'assets/data/prime-windows.js';
  let source = read(file);
  const marker = 'const WINDOWS=';
  const markerIndex = source.indexOf(marker);
  const objectStart = source.indexOf('{', markerIndex);
  const objectEnd = matchingBracket(source, objectStart, '{', '}');
  const windows = vm.runInNewContext(`(${source.slice(objectStart, objectEnd + 1)})`);
  const contextOnly = {};
  for (const [fighter, row] of Object.entries(windows)) {
    contextOnly[fighter] = [row[0], row[1], row[2], row[4] || row[3] || 'review'];
  }
  source = `${source.slice(0, markerIndex)}const WINDOWS=${JSON.stringify(contextOnly, null, 2)}${source.slice(objectEnd + 1)}`;
  source = source.replace("const VERSION='prime-windows-20260708a';", "const VERSION='prime-windows-20260710b-context-only';");
  source = replaceRequired(
    source,
    "function entryFor(fighter){const row=WINDOWS[fighter];return row?{fighter,start:row[0],end:row[1],label:row[2],primeRecord:row[3],status:row[4],version:VERSION}:null;}",
    "function entryFor(fighter){const row=WINDOWS[fighter];return row?{fighter,start:row[0],end:row[1],label:row[2],status:row[3],version:VERSION}:null;}",
    'context-only Prime Window entry'
  );
  source = source.replace(
    /function apply\(\)\{[^\n]*\}/,
    "function apply(){const applied=[];Object.keys(WINDOWS).forEach(fighter=>{const entry=entryFor(fighter);allRowsFor(fighter).forEach(row=>{row.primeWindow=entry;row.primeWindowLabel=entry.label;row.primeStart=entry.start;row.primeEnd=entry.end;row.primeWindowStatus=entry.status;});if(typeof DISPLAY_OVERRIDES!=='undefined'){DISPLAY_OVERRIDES[fighter]=DISPLAY_OVERRIDES[fighter]||{};DISPLAY_OVERRIDES[fighter].snapshotStats={...(DISPLAY_OVERRIDES[fighter].snapshotStats||{}),primeWindow:entry.label};}applied.push(fighter);});window.UFC_PRIME_WINDOWS_APPLIED={version:VERSION,count:applied.length,fighters:applied,appliedAt:new Date().toISOString()};return applied;}"
  );
  write(file, source);
}

function updatePrimeDominancePromoter() {
  const file = 'assets/data/prime-dominance-live-promoter.js';
  let source = read(file);
  source = source.replace("const VERSION='prime-dominance-live-promoter-20260710a-category-only';", "const VERSION='prime-dominance-live-promoter-20260710b-canonical-prime-record';");
  source = source.replace("      profile.primeRecord=entry.primeRecord||profile.primeRecord;\n", '');
  source = source.replace("        ['Prime Record',entry?.primeRecord||profile.primeRecord||'—'],\n", '');
  source = source.replace("        row.primeRecord=entry.primeRecord||row.primeRecord;\n", '');
  write(file, source);
}

function updateProfileTemplate() {
  const file = 'assets/js/profile-template-system.js';
  let source = read(file);
  source = source.replace("const VERSION = 'profile-template-system-20260705c';", "const VERSION = 'profile-template-system-20260710a-canonical-prime-record';");
  source = source.replace("    primeRecord:'16-0, 1 NC',\n", '');
  source = source.replace("      jon.primeRecord = JON_STATS.primeRecord;\n", '');
  source = source.replace("        ['Prime Record', JON_STATS.primeRecord],\n", '');
  source = replaceRequired(
    source,
    "      ['Prime Record', stats.primeRecord || f.primeRecord || findSnap('Prime Record') || '—'],",
    "      ['Prime Record', DATA.primeRecords?.[f.fighter]?.record || '—'],",
    'canonical Prime Record snapshot read'
  );
  write(file, source);
}

function updateAppEvidence() {
  const file = 'assets/js/app.js';
  let source = read(file);
  source = replaceRequired(
    source,
    "function primeRecordText(f){\n  return f.primeRecord || f.primeUfcRecord || f.prime_record || null;\n}",
    "function primeRecordText(f){\n  return DATA.primeRecords?.[f?.fighter]?.record || null;\n}",
    'canonical Prime Record evidence read'
  );
  source = replaceRequired(
    source,
    "    const pr = primeRecordText(f);\n    if(pr) items.push(['Prime UFC record', pr]);",
    "    const canonicalPrime = DATA.primeRecords?.[f?.fighter] || {};\n    const pr = primeRecordText(f);\n    if(pr) items.push(['Prime UFC record', pr]);\n    if(canonicalPrime.context) items.push(['Prime window context', canonicalPrime.context]);",
    'Prime Record context evidence'
  );
  write(file, source);
}

function updateCategoryRatings() {
  const file = 'assets/js/category-percentile-tiers.js';
  let source = read(file);
  source = source.replace('// Percentile-based category tier labels.', '// Rank-based category ratings and tier labels.');
  source = source.replace("const VERSION='category-percentile-tiers-20260710b-deterministic';", "const VERSION='category-percentile-tiers-20260710c-rating-source';");
  source = source.replaceAll(' percentile for ', ' rating for ');
  source = source.replaceAll('<span class="meta">PCTL</span>', '<span class="meta">RATING</span>');
  source = source.replace('${ordinal(pctScore)} percentile', '${pctScore} rating');
  source = source.replaceAll(' PCTL · #', ' RATING · #');
  write(file, source);
}

function updatePacketBridge() {
  const file = 'assets/data/ranking-data-patches.js';
  let source = read(file);
  source = source.replace("const VERSION='ranking-data-patches-20260710c-quality-revisions';", "const VERSION='ranking-data-patches-20260710e-canonical-prime-record';");
  source = source.replace(
    /function syncPacketProfileStats\(\)\{[^\n]*\}/,
    "function syncPacketProfileStats(){if(typeof DISPLAY_OVERRIDES==='undefined')return[];const synced=[];Object.entries(DISPLAY_OVERRIDES).forEach(([fighter,override])=>{if(!override?.packetProfileStats)return;const{primeRecord,primeUfcRecord,prime_record,primeRecordContext,primeWindowContext,...safeStats}=override.packetProfileStats||{};override.snapshotStats={...(override.snapshotStats||{}),...safeStats};synced.push(fighter);});window.UFC_PACKET_PROFILE_STAT_BRIDGE={version:VERSION,synced,primeRecordSource:'RANKING_DATA.primeRecords'};return synced;}"
  );
  source = source.replace(
    'assets/js/profile-template-system.js?v=profile-template-system-20260702b',
    'assets/js/profile-template-system.js?v=profile-template-system-20260710a-canonical-prime-record'
  );
  write(file, source);
}

function updateModuleBootstrap() {
  const file = 'assets/data/module-versions.js';
  let source = read(file);
  source = source.replace('scoringPipeline:"20260710m-prime-record-final-render"', 'scoringPipeline:"20260710n-canonical-prime-record"');
  source = source.replace('primeWindows:"20260708a"', 'primeWindows:"20260710b-context-only"');
  source = source.replace('primeDominanceLivePromoter:"20260710a-category-only"', 'primeDominanceLivePromoter:"20260710b-canonical-prime-record"');
  source = source.replace('categoryPercentileTiers:"20260710b-deterministic"', 'categoryPercentileTiers:"20260710c-rating-source"');
  source = source.replace(/,categoryRatingPrimeRecordPolish:"[^"]+",primeRecordFinalRender:"[^"]+"/, '');
  source = source.replace("VERSION='deterministic-scoring-pipeline-20260710m-prime-record-final-render'", "VERSION='deterministic-scoring-pipeline-20260710n-canonical-prime-record'");
  source = source.replace(/\nawait loadStep\('category-rating-prime-record-polish',[\s\S]*?\nrenderOnce\(\);record/, '\nrenderOnce();record');
  write(file, source);
}

function updateIndexVersions() {
  const file = 'index.html';
  let source = read(file);
  source = source.replace('ranking-data-20260701e', 'ranking-data-20260710a-canonical-prime-record');
  source = source.replace('display-overrides-20260701e', 'display-overrides-20260710a-prime-record-clean');
  source = source.replace('app-prime-source-fix-707f854', 'app-canonical-prime-record-20260710a');
  source = source.replace('module-versions-20260710m-prime-record-cache-fix', 'module-versions-20260710n-canonical-prime-record');
  source = source.replace('ranking-data-patches-20260710d-prime-record-cache-fix', 'ranking-data-patches-20260710e-canonical-prime-record');
  write(file, source);
}

function updatePermanentAuditWorkflow() {
  const file = '.github/workflows/six-category-runtime-audit.yml';
  let source = read(file);
  if (!source.includes('Audit canonical Prime Record source')) {
    const anchor = '      - name: Run effective-weight audit\n';
    const step = "      - name: Audit canonical Prime Record source\n        shell: bash\n        run: |\n          set -o pipefail\n          node scripts/run-prime-record-source-audit.mjs 2>&1 | tee docs/audits/runtime-prime-record-source-console.log\n\n";
    source = replaceRequired(source, anchor, step + anchor, 'Prime Record audit workflow step');
  }
  if (!source.includes('docs/audits/runtime-prime-record-source-audit.json')) {
    source = source.replace(
      '            docs/audits/runtime-effective-weight-audit.json',
      '            docs/audits/runtime-prime-record-source-audit.json\n            docs/audits/runtime-prime-record-source-audit.md\n            docs/audits/runtime-prime-record-source-console.log\n            docs/audits/runtime-effective-weight-audit.json'
    );
  }
  write(file, source);
}

function verifySourceCleanup() {
  const targets = [
    'assets/data/display-overrides.js',
    'assets/data/ranking-data-additions.js',
    'assets/data/fighter-packets.js',
    ...listJsFiles(path.join(ROOT, 'assets/data/fighter-packets')).map(file => path.relative(ROOT, file))
  ];
  const offenders = [];
  for (const file of targets) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) continue;
    const source = read(file);
    if (/\b(?:primeRecord|primeUfcRecord|prime_record)\s*:\s*['"]/.test(source)) offenders.push(file);
    if (/\[\s*['"]Prime Record['"]\s*,/.test(source)) offenders.push(`${file}#snapshot`);
  }
  if (offenders.length) throw new Error(`Prime Record profile writers remain: ${offenders.join(', ')}`);
}

(async () => {
  const rows = await captureAuditedPrimeRecords();
  canonicalizeRankingData(rows);
  cleanLegacyPrimeRecordWriters();
  updatePrimeWindows();
  updatePrimeDominancePromoter();
  updateProfileTemplate();
  updateAppEvidence();
  updateCategoryRatings();
  updatePacketBridge();
  updateModuleBootstrap();
  updateIndexVersions();
  updatePermanentAuditWorkflow();
  verifySourceCleanup();

  for (const obsolete of [
    'assets/js/category-rating-prime-record-polish.js',
    'assets/js/prime-record-final-render.js',
    'scripts/one-time-canonical-prime-record-cleanup.cjs',
    'scripts/one-time-canonical-prime-record-cleanup-v2.cjs',
    'scripts/one-time-canonical-prime-record-cleanup-v3.cjs',
    '.github/workflows/one-time-canonical-prime-record-cleanup.yml'
  ]) {
    const target = path.join(ROOT, obsolete);
    if (fs.existsSync(target)) fs.unlinkSync(target);
  }

  console.log(`Canonicalized ${rows.length} Prime Records from audited Prime Dominance counts and removed competing profile writers.`);
})().catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});

const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = process.cwd();
const RECORD_RE = /^\d+-\d+(?:-\d+)?(?:,\s*\d+\s*NC)?$/;
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const write = (p, value) => fs.writeFileSync(path.join(ROOT, p), value, 'utf8');

function replaceRequired(source, search, replacement, label) {
  if (!source.includes(search)) throw new Error(`Missing expected source for ${label}`);
  return source.replace(search, replacement);
}

function matchingBracket(source, start, open, close) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === open) depth += 1;
    if (ch === close) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  throw new Error(`Unmatched ${open}${close} block`);
}

function stripPrimeRecordStrings(source) {
  const lines = source.split('\n').filter(line => {
    if (/^\s*(?:["']?primeRecord["']?|["']?primeUfcRecord["']?|["']?prime_record["']?|["']?primeRecordContext["']?|["']?primeWindowContext["']?)\s*:\s*["'`]/.test(line)) return false;
    if (/^\s*\[\s*["']Prime Record["']\s*,/.test(line)) return false;
    return true;
  });
  let next = lines.join('\n');
  next = next.replace(/\n\s*\[\s*\n\s*["']Prime Record["']\s*,\s*\n\s*["'](?:\\.|[^"'])*["']\s*\n\s*\]\s*,?/g, '');
  next = next.replace(/\[\s*["']Prime Record["']\s*,\s*["'](?:\\.|[^"'])*["']\s*\]\s*,?/g, '');
  return next;
}

async function captureResolvedPrimeRecords() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('http://127.0.0.1:4173/index.html', { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForFunction(() => window.UFC_SCORING_PIPELINE?.status === 'ready' && window.UFC_CATEGORY_RATING_PRIME_RECORD_POLISH?.passed, { timeout: 90_000 });
    return await page.evaluate(() => window.UFC_CATEGORY_RATING_PRIME_RECORD_POLISH.rows.map(row => ({
      fighter: row.fighter,
      record: row.record,
      context: row.context || null,
      source: row.source
    })));
  } finally {
    await browser.close();
  }
}

function canonicalizeRankingData(rows) {
  const file = 'assets/data/ranking-data.js';
  let source = read(file);
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox, { filename: file });
  const data = sandbox.window.RANKING_DATA;
  const profiles = data?.fighters || [];
  const map = new Map(rows.map(row => [row.fighter, row]));
  if (profiles.length !== 62 || map.size !== 62) throw new Error(`Expected 62 profiles and records; got ${profiles.length}/${map.size}`);
  for (const profile of profiles) {
    const row = map.get(profile.fighter);
    if (!row || !RECORD_RE.test(String(row.record || ''))) throw new Error(`Invalid resolved Prime Record for ${profile.fighter}: ${row?.record}`);
  }

  source = stripPrimeRecordStrings(source);
  const marker = '  "fighters": [';
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) throw new Error('fighters array marker not found');
  const arrayStart = source.indexOf('[', markerIndex);
  const arrayEnd = matchingBracket(source, arrayStart, '[', ']');
  let section = source.slice(arrayStart + 1, arrayEnd);

  for (const profile of profiles) {
    const row = map.get(profile.fighter);
    const needle = `      "fighter": ${JSON.stringify(profile.fighter)},\n`;
    const count = section.split(needle).length - 1;
    if (count !== 1) throw new Error(`Expected one canonical profile row for ${profile.fighter}; found ${count}`);
    const context = row.context && String(row.context).trim() !== row.record
      ? `      "primeWindowContext": ${JSON.stringify(String(row.context).trim())},\n`
      : '';
    section = section.replace(needle, `${needle}      "primeRecord": ${JSON.stringify(row.record)},\n${context}`);
  }

  source = source.slice(0, arrayStart + 1) + section + source.slice(arrayEnd);
  source = source.replace('// UFC GOAT base ranking/profile payload.\n// Main score/stat source for fighter rankings.', '// UFC GOAT canonical ranking/profile payload.\n// Prime Record source of truth: RANKING_DATA.fighters[*].primeRecord.');
  write(file, source);
}

function cleanDisplayOverrides() {
  const file = 'assets/data/display-overrides.js';
  let source = stripPrimeRecordStrings(read(file));
  if (/^\s*(?:["']?primeRecord["']?|["']?primeUfcRecord["']?|["']?prime_record["']?)\s*:\s*["'`]/m.test(source)) {
    throw new Error('String Prime Record writer remains in display-overrides.js');
  }
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
    "      ['Prime Record', liveProfileFor(f.fighter).primeRecord || '—'],",
    'canonical snapshot Prime Record read'
  );
  write(file, source);
}

function updateAppEvidence() {
  const file = 'assets/js/app.js';
  let source = read(file);
  source = replaceRequired(
    source,
    "function primeRecordText(f){\n  return f.primeRecord || f.primeUfcRecord || f.prime_record || null;\n}",
    "function primeRecordText(f){\n  return byName[f?.fighter]?.primeRecord || null;\n}",
    'canonical Prime Record evidence read'
  );
  source = replaceRequired(
    source,
    "    const pr = primeRecordText(f);\n    if(pr) items.push(['Prime UFC record', pr]);",
    "    const canonicalProfile = byName[f?.fighter] || {};\n    const pr = primeRecordText(f);\n    if(pr) items.push(['Prime UFC record', pr]);\n    if(canonicalProfile.primeWindowContext) items.push(['Prime window context', canonicalProfile.primeWindowContext]);",
    'Prime window context evidence'
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

function updateRuntimeLoader() {
  const file = 'assets/data/ranking-data-patches.js';
  let source = read(file);
  source = source.replace("const VERSION='ranking-data-patches-20260710c-quality-revisions';", "const VERSION='ranking-data-patches-20260710e-canonical-prime-record';");
  source = source.replace(/\n\s*const FALLBACK_PACKET_MANIFEST=\[[\s\S]*?\n\s*\];/, '');
  source = source.replace(/function syncPacketProfileStats\(\)\{[^\n]*\}/, "function syncPacketProfileStats(){window.UFC_PACKET_PROFILE_STAT_BRIDGE={version:VERSION,synced:[],disabled:true};return[];}");
  source = source.replace(/function packetManifest\(\)\{[^\n]*\}/, 'function packetManifest(){return[];}');
  source = source.replace(/function packet\(slug,v\)\{[^\n]*\}\n/, '');
  source = source.replace(/function compareCoreScripts\(\)\{const packets=packetManifest\(\)\.map\(row=>packet\(row\.slug,row\.version\)\);return\[/, 'function compareCoreScripts(){return[');
  source = source.split('\n').filter(line => !line.includes('ranking-data-additions.js') && !line.includes('fighter-packet-schema.js') && !line.includes("assets/data/fighter-packets.js") && !line.includes('...packets,')).join('\n');
  source = source.replace(/\n\s*const loadPacketManifest=.*?;\n/, '\n');
  source = source.replace("const loadBranding=()=>loadScriptOnce('assets/js/app-branding.js?v=app-branding-20260702c','data-app-branding',loadPacketManifest);", "const loadBranding=()=>loadScriptOnce('assets/js/app-branding.js?v=app-branding-20260702c','data-app-branding',loadCompareCore);");
  source = source.replace("assets/js/profile-template-system.js?v=profile-template-system-20260702b", "assets/js/profile-template-system.js?v=profile-template-system-20260710a-canonical-prime-record");
  write(file, source);
}

function updateModuleBootstrap() {
  const file = 'assets/data/module-versions.js';
  let source = read(file);
  source = source.replace('scoringPipeline:"20260710m-prime-record-final-render"', 'scoringPipeline:"20260710n-canonical-prime-record"');
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

function permanentAuditSource() {
  return `import { chromium } from 'playwright';\nimport { mkdir, writeFile } from 'node:fs/promises';\n\nconst baseUrl = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';\nconst recordRe = /^\\d+-\\d+(?:-\\d+)?(?:,\\s*\\d+\\s*NC)?$/;\nconst browser = await chromium.launch({ headless: true });\nconst page = await browser.newPage();\ntry {\n  await page.goto(\\`${'${baseUrl}'}/index.html\\`, { waitUntil: 'domcontentloaded', timeout: 60_000 });\n  await page.waitForFunction(() => window.UFC_SCORING_PIPELINE?.status === 'ready', { timeout: 90_000 });\n  const report = await page.evaluate(() => {\n    const profiles = window.RANKING_DATA?.fighters || [];\n    const boardNames = [...(window.RANKING_DATA?.men || []), ...(window.RANKING_DATA?.women || [])].map(row => row.fighter);\n    const canonical = new Map(profiles.map(row => [row.fighter, row.primeRecord]));\n    const rows = [];\n    for (const fighter of boardNames) {\n      window.openFighter(fighter);\n      const tile = [...document.querySelectorAll('#fighterDetail .snapshot-item')].find(item => item.querySelector('small')?.textContent.trim() === 'Prime Record');\n      const visible = tile?.querySelector('strong')?.textContent.trim() || null;\n      const expected = canonical.get(fighter) || null;\n      rows.push({ fighter, expected, visible, passed: Boolean(expected && visible === expected) });\n    }\n    const packetScripts = [...document.scripts].filter(script => [...script.attributes].some(attr => attr.name.startsWith('data-fighter-packet-'))).map(script => script.src);\n    const overrideWriters = [];\n    const scan = (value, path = []) => {\n      if (!value || typeof value !== 'object') return;\n      if (Array.isArray(value)) {\n        value.forEach((item, index) => scan(item, [...path, index]));\n        return;\n      }\n      for (const [key, child] of Object.entries(value)) {\n        if ((key === 'primeRecord' || key === 'primeUfcRecord' || key === 'prime_record') && typeof child === 'string') overrideWriters.push([...path, key].join('.'));\n        scan(child, [...path, key]);\n      }\n    };\n    scan(window.DISPLAY_OVERRIDES || {}, ['DISPLAY_OVERRIDES']);\n    return {\n      fighterCount: boardNames.length,\n      canonicalCount: canonical.size,\n      invalidCanonical: profiles.filter(row => !/^\\d+-\\d+(?:-\\d+)?(?:,\\s*\\d+\\s*NC)?$/.test(String(row.primeRecord || ''))).map(row => ({ fighter: row.fighter, primeRecord: row.primeRecord })),\n      mismatches: rows.filter(row => !row.passed),\n      packetScripts,\n      packetRuntimeCount: Object.keys(window.UFC_FIGHTER_PACKETS || {}).length,\n      overrideWriters,\n      rows\n    };\n  });\n  report.passed = report.fighterCount === 62 && report.canonicalCount === 62 && report.invalidCanonical.length === 0 && report.mismatches.length === 0 && report.packetScripts.length === 0 && report.packetRuntimeCount === 0 && report.overrideWriters.length === 0;\n  await mkdir('docs/audits', { recursive: true });\n  await writeFile('docs/audits/runtime-prime-record-source-audit.json', JSON.stringify(report, null, 2) + '\\n', 'utf8');\n  await writeFile('docs/audits/runtime-prime-record-source-audit.md', \\`# Prime Record Source Audit\\n\\n- Fighters: \\${report.fighterCount}\\n- Canonical records: \\${report.canonicalCount}\\n- Invalid canonical values: \\${report.invalidCanonical.length}\\n- Visible tile mismatches: \\${report.mismatches.length}\\n- Loaded legacy packet scripts: \\${report.packetScripts.length}\\n- Runtime packet entries: \\${report.packetRuntimeCount}\\n- Display override writers: \\${report.overrideWriters.length}\\n- Result: \\${report.passed ? 'PASS' : 'FAIL'}\\n\\`, 'utf8');\n  console.log('PRIME_RECORD_SOURCE_AUDIT=' + JSON.stringify({ passed: report.passed, fighters: report.fighterCount, mismatches: report.mismatches.length, invalidCanonical: report.invalidCanonical.length, packetScripts: report.packetScripts.length, overrideWriters: report.overrideWriters.length }));\n  if (!report.passed) throw new Error('Prime Record source audit failed: ' + JSON.stringify(report));\n} finally {\n  await browser.close();\n}\n`;
}

function updatePermanentAuditWorkflow() {
  const file = '.github/workflows/six-category-runtime-audit.yml';
  let source = read(file);
  const anchor = "      - name: Run effective-weight audit\n";
  const step = "      - name: Audit canonical Prime Record source\n        shell: bash\n        run: |\n          set -o pipefail\n          node scripts/run-prime-record-source-audit.mjs 2>&1 | tee docs/audits/runtime-prime-record-source-console.log\n\n";
  source = replaceRequired(source, anchor, step + anchor, 'Prime Record audit workflow step');
  source = source.replace('            docs/audits/runtime-effective-weight-audit.json', '            docs/audits/runtime-prime-record-source-audit.json\n            docs/audits/runtime-prime-record-source-audit.md\n            docs/audits/runtime-prime-record-source-console.log\n            docs/audits/runtime-effective-weight-audit.json');
  write(file, source);
}

(async () => {
  const rows = await captureResolvedPrimeRecords();
  canonicalizeRankingData(rows);
  cleanDisplayOverrides();
  updateProfileTemplate();
  updateAppEvidence();
  updateCategoryRatings();
  updateRuntimeLoader();
  updateModuleBootstrap();
  updateIndexVersions();
  write('scripts/run-prime-record-source-audit.mjs', permanentAuditSource());
  updatePermanentAuditWorkflow();

  for (const obsolete of ['assets/js/category-rating-prime-record-polish.js', 'assets/js/prime-record-final-render.js']) {
    const target = path.join(ROOT, obsolete);
    if (fs.existsSync(target)) fs.unlinkSync(target);
  }
  fs.unlinkSync(path.join(ROOT, 'scripts/one-time-canonical-prime-record-cleanup.cjs'));
  fs.unlinkSync(path.join(ROOT, '.github/workflows/one-time-canonical-prime-record-cleanup.yml'));

  console.log(`Canonicalized ${rows.length} Prime Records and removed legacy runtime writers.`);
})().catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});

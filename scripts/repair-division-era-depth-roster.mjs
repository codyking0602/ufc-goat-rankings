import fs from 'node:fs/promises';

const SHADOW_VERSION='division-era-depth-shadow-20260712e-roster-72';
const AUDIT_VERSION='division-era-depth-judgment-review-20260712c-roster-72';
const LIVE_VERSION='division-era-depth-live-20260712b-roster-dynamic';
const FINALIZER_VERSION='division-era-depth-finalizer-20260712d-roster-dynamic';

async function edit(path, transform){
  const before=await fs.readFile(path,'utf8');
  const after=transform(before);
  if(after===before)throw new Error(`No change made to ${path}; source may have drifted.`);
  await fs.writeFile(path,after,'utf8');
  console.log(`patched ${path}`);
}
function replaceOnce(text,from,to,label){
  if(text.includes(to))return text;
  const first=text.indexOf(from);
  if(first<0)throw new Error(`Missing ${label}`);
  if(text.indexOf(from,first+from.length)>=0)throw new Error(`Ambiguous ${label}`);
  return text.replace(from,to);
}
function replaceAllRequired(text,from,to,label){
  const count=text.split(from).length-1;
  if(!count){
    if(text.includes(to))return text;
    throw new Error(`Missing ${label}`);
  }
  return text.split(from).join(to);
}

await edit('scripts/build-division-era-depth-shadow.mjs',text=>{
  text=replaceOnce(text,
    "  const feed = JSON.parse(await fs.readFile(feedPath, 'utf8'));\n  const csvText = await downloadSource();",
    "  const feed = JSON.parse(await fs.readFile(feedPath, 'utf8'));\n  const expectedRosterCount = (feed.fighters || []).length;\n  const csvText = await downloadSource();",
    'generator dynamic roster count');
  text=replaceOnce(text,
    '  if (report.summary.rosterCount !== 63 || report.summary.coverageCount !== 63) {',
    '  if (report.summary.rosterCount !== expectedRosterCount || report.summary.coverageCount !== expectedRosterCount) {',
    'generator coverage gate');
  return text;
});

await edit('scripts/run-division-era-depth-shadow.mjs',text=>{
  text=replaceOnce(text,
    "const VERSION = 'division-era-depth-shadow-20260712d-current-wfw-safe';",
    `const VERSION = '${SHADOW_VERSION}';`,
    'shadow version');
  text=replaceOnce(text,
    "  ['Cris Cyborg', 'Cristiane Justino']\n]);",
    "  ['Cris Cyborg', 'Cristiane Justino'],\n  ['Mauricio \"Shogun\" Rua', 'Mauricio Rua']\n]);",
    'Shogun alias');
  text=replaceOnce(text,
    "  const feed = JSON.parse(originalFeedText);\n  let changed = 0;",
    "  const feed = JSON.parse(originalFeedText);\n  const expectedRosterCount = (feed.fighters || []).length;\n  let changed = 0;",
    'runner dynamic roster count');
  text=replaceOnce(text,
    '    if (restored.summary.rosterCount !== 63 || fallbacks.length) {',
    '    if (restored.summary.rosterCount !== expectedRosterCount || fallbacks.length) {',
    'runner coverage gate');
  text=replaceOnce(text,
    '      throw new Error(`Alias-complete depth coverage failed: ${63 - fallbacks.length}/63 direct matches; ${fallbacks.map(row => row.fighter).join(\', \')}`);',
    '      throw new Error(`Alias-complete depth coverage failed: ${expectedRosterCount - fallbacks.length}/${expectedRosterCount} direct matches; ${fallbacks.map(row => row.fighter).join(\', \')}`);',
    'runner coverage error');
  text=replaceOnce(text,
    '      directMatchCoverageComplete: restored.summary.directMatchCoverageCount === 63 && restored.summary.fallbackCount === 0,',
    '      directMatchCoverageComplete: restored.summary.directMatchCoverageCount === expectedRosterCount && restored.summary.fallbackCount === 0,',
    'runner promotion coverage');
  text=replaceOnce(text,
    '      readyForJudgmentFinalization: refreshed.metadata.sourceFresh && restored.summary.womenFeatherweightTreatmentApplied === true && restored.summary.directMatchCoverageCount === 63',
    '      readyForJudgmentFinalization: refreshed.metadata.sourceFresh && restored.summary.womenFeatherweightTreatmentApplied === true && restored.summary.directMatchCoverageCount === expectedRosterCount',
    'runner readiness coverage');
  return text;
});

await edit('scripts/build-division-era-depth-judgment-review.mjs',text=>{
  text=replaceOnce(text,
    "const REPORT_PATH = path.join(ROOT, 'docs/division-era-depth-shadow-report.json');",
    "const REPORT_PATH = path.join(ROOT, 'docs/division-era-depth-shadow-report.json');\nconst FEED_PATH = path.join(ROOT, 'assets/data/octagon-verdict-data.json');",
    'judgment feed path');
  text=replaceOnce(text,
    "const VERSION = 'division-era-depth-judgment-review-20260712b-live-approved';",
    `const VERSION = '${AUDIT_VERSION}';`,
    'audit version');
  text=replaceOnce(text,
    "  const report = JSON.parse(await fs.readFile(REPORT_PATH, 'utf8'));\n  if (report.mode",
    "  const report = JSON.parse(await fs.readFile(REPORT_PATH, 'utf8'));\n  const feed = JSON.parse(await fs.readFile(FEED_PATH, 'utf8'));\n  const expectedRosterCount = (feed.fighters || []).length;\n  if (report.mode",
    'judgment dynamic roster count');
  text=replaceOnce(text,
    "  if (report.summary?.rosterCount !== 63 || report.summary?.directMatchCoverageCount !== 63 || report.summary?.fallbackCount !== 0) {\n    throw new Error('Depth source does not have clean 63-fighter direct coverage.');",
    "  if (report.summary?.rosterCount !== expectedRosterCount || report.summary?.directMatchCoverageCount !== expectedRosterCount || report.summary?.fallbackCount !== 0) {\n    throw new Error(`Depth source does not have clean ${expectedRosterCount}-fighter direct coverage.`);",
    'judgment coverage gate');
  text=replaceOnce(text,
    "blockers.push({ code: 'coverage', severity: 'critical', recommendation: 'Restore direct fight-history coverage for all 63 fighters.' });",
    "blockers.push({ code: 'coverage', severity: 'critical', recommendation: `Restore direct fight-history coverage for all ${expectedRosterCount} fighters.` });",
    'judgment coverage copy');
  text=replaceOnce(text,
    "? 'The curved Division-Era Depth adjustment is approved for live implementation across all 63 fighters.'",
    "? `The curved Division-Era Depth adjustment is approved for live implementation across all ${expectedRosterCount} fighters.`",
    'judgment approval copy');
  text=replaceOnce(text,
    '`## Full 63-Fighter Review\\n\\n${table(fighters)}\\n`;',
    '`## Full ${expectedRosterCount}-Fighter Review\\n\\n${table(fighters)}\\n`;',
    'judgment markdown heading');
  return text;
});

await edit('scripts/validate-division-era-depth-promotion.mjs',text=>{
  text=replaceOnce(text,
    "const report = JSON.parse(await fs.readFile('docs/division-era-depth-shadow-report.json', 'utf8'));\nconst review = JSON.parse(await fs.readFile('docs/division-era-depth-judgment-review.json', 'utf8'));",
    "const report = JSON.parse(await fs.readFile('docs/division-era-depth-shadow-report.json', 'utf8'));\nconst review = JSON.parse(await fs.readFile('docs/division-era-depth-judgment-review.json', 'utf8'));\nconst feed = JSON.parse(await fs.readFile('assets/data/octagon-verdict-data.json', 'utf8'));\nconst expectedRosterCount = (feed.fighters || []).length;",
    'validator dynamic roster count');
  text=replaceAllRequired(text,'=== 63','=== expectedRosterCount','validator roster gates');
  return text;
});

await edit('assets/data/division-era-depth-live.js',text=>{
  text=replaceOnce(text,"const VERSION='division-era-depth-live-20260712a';",`const VERSION='${LIVE_VERSION}';`,'live version');
  text=replaceOnce(text,"const SHADOW_VERSION='division-era-depth-shadow-20260712d-current-wfw-safe';",`const SHADOW_VERSION='${SHADOW_VERSION}';`,'live shadow version');
  text=replaceOnce(text,"const AUDIT_VERSION='division-era-depth-judgment-review-20260712b-live-approved';",`const AUDIT_VERSION='${AUDIT_VERSION}';`,'live audit version');
  text=replaceOnce(text,
    '    if(rows.length!==63||expected.size!==63||rows.some(row=>!expected.has(key(row?.fighter))))return false;',
    '    if(!rows.length||expected.size!==rows.length||Number(AUDIT.rosterCount)!==rows.length||rows.some(row=>!expected.has(key(row?.fighter))))return false;',
    'live roster gate');
  text=replaceOnce(text,
    'DATA.meta.divisionEraDepthLive={version:VERSION,sourceShadowVersion:SHADOW.version,sourceAuditVersion:AUDIT.version,sourceDatasetEnd:report.sourceDatasetEnd,rosterCount:63,promotedCount:63,mismatchCount:report.mismatchCount,applied:report.applied,appliedAt:report.appliedAt};',
    'DATA.meta.divisionEraDepthLive={version:VERSION,sourceShadowVersion:SHADOW.version,sourceAuditVersion:AUDIT.version,sourceDatasetEnd:report.sourceDatasetEnd,rosterCount:liveRows.length,promotedCount:liveRows.length,mismatchCount:report.mismatchCount,applied:report.applied,appliedAt:report.appliedAt};',
    'live metadata');
  text=replaceOnce(text,
    "document.documentElement.setAttribute('data-division-era-depth-live',`${VERSION}-63-${report.mismatchCount}`);",
    "document.documentElement.setAttribute('data-division-era-depth-live',`${VERSION}-${liveRows.length}-${report.mismatchCount}`);",
    'live status attribute');
  return text;
});

await edit('assets/data/division-era-depth-finalizer.js',text=>{
  text=replaceOnce(text,"const VERSION='division-era-depth-finalizer-20260712c-late-ready-sync';",`const VERSION='${FINALIZER_VERSION}';`,'finalizer version');
  text=replaceOnce(text,"const EXPECTED_SHADOW='division-era-depth-shadow-20260712d-current-wfw-safe';",`const EXPECTED_SHADOW='${SHADOW_VERSION}';`,'finalizer shadow version');
  text=replaceOnce(text,"const EXPECTED_AUDIT='division-era-depth-judgment-review-20260712b-live-approved';",`const EXPECTED_AUDIT='${AUDIT_VERSION}';`,'finalizer audit version');
  text=replaceOnce(text,
    '    if(boards.length!==63||expected.size!==63||boards.some(row=>!expected.has(key(row?.fighter))))return false;',
    '    if(!boards.length||expected.size!==boards.length||Number(audit.rosterCount)!==boards.length||boards.some(row=>!expected.has(key(row?.fighter))))return false;',
    'finalizer roster gate');
  text=replaceOnce(text,'      rosterCount:63,\n      promotedCount:63,','      rosterCount:liveRows.length,\n      promotedCount:liveRows.length,','finalizer metadata');
  text=replaceOnce(text,
    "document.documentElement.setAttribute('data-division-era-depth-live',`${report.version}-canonical-63-${report.mismatchCount}`);",
    "document.documentElement.setAttribute('data-division-era-depth-live',`${report.version}-canonical-${liveRows.length}-${report.mismatchCount}`);",
    'finalizer status attribute');
  return text;
});

await edit('scripts/runtime-era-depth-audit.mjs',text=>{
  text=replaceOnce(text,
    '    ||Number(result.live?.promotedCount||0)!==63\n    ||Number(result.live?.mismatchCount||0)!==0\n    ||Number(result.consistency?.rosterCount||0)!==63\n    ||Number(result.consistency?.shadowCount||0)!==63',
    '    ||Number(result.live?.promotedCount||0)!==Number(result.consistency?.rosterCount||0)\n    ||Number(result.live?.mismatchCount||0)!==0\n    ||Number(result.consistency?.rosterCount||0)<1\n    ||Number(result.consistency?.shadowCount||0)!==Number(result.consistency?.rosterCount||0)',
    'runtime dynamic roster checks');
  return text;
});

await edit('scripts/install-division-era-depth-live.mjs',text=>{
  text=replaceOnce(text,"['assets/data/division-era-depth-shadow.js','division-era-depth-shadow-20260712d-current-wfw-safe']",`['assets/data/division-era-depth-shadow.js','${SHADOW_VERSION}']`,'installer shadow version');
  text=replaceOnce(text,"['assets/data/division-era-depth-audit.js','division-era-depth-judgment-review-20260712b-live-approved']",`['assets/data/division-era-depth-audit.js','${AUDIT_VERSION}']`,'installer audit version');
  text=replaceOnce(text,"['assets/data/division-era-depth-live.js','division-era-depth-live-20260712a']",`['assets/data/division-era-depth-live.js','${LIVE_VERSION}']`,'installer live version');
  text=replaceOnce(text,"['assets/data/division-era-depth-finalizer.js','division-era-depth-finalizer-20260712b-canonical-engine-20260712c-late-ready-sync']",`['assets/data/division-era-depth-finalizer.js','${FINALIZER_VERSION}']`,'installer finalizer version');
  return text;
});

await edit('.github/workflows/division-era-depth-shadow.yml',text=>{
  text=replaceOnce(text,'      - name: Build current 63-fighter depth model','      - name: Build current full-roster depth model','workflow build label');
  text=replaceOnce(text,"grep -q 'division-era-depth-shadow-20260712d-current-wfw-safe' index.html",`grep -q '${SHADOW_VERSION}' index.html`,'workflow shadow grep');
  text=replaceOnce(text,"grep -q 'division-era-depth-judgment-review-20260712b-live-approved' index.html",`grep -q '${AUDIT_VERSION}' index.html`,'workflow audit grep');
  text=replaceOnce(text,"grep -q 'division-era-depth-live-20260712a' index.html",`grep -q '${LIVE_VERSION}' index.html`,'workflow live grep');
  text=replaceOnce(text,"grep -q 'division-era-depth-finalizer-20260712b-canonical-engine' index.html",`grep -q '${FINALIZER_VERSION}' index.html`,'workflow finalizer grep');
  return text;
});

console.log(JSON.stringify({patched:true,shadowVersion:SHADOW_VERSION,auditVersion:AUDIT_VERSION,liveVersion:LIVE_VERSION,finalizerVersion:FINALIZER_VERSION},null,2));

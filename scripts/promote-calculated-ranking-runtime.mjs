import fs from 'node:fs/promises';

async function replaceExact(path,before,after){
  const source=await fs.readFile(path,'utf8');
  if(source.includes(after))return false;
  if(!source.includes(before))throw new Error(`${path}: expected source block not found`);
  await fs.writeFile(path,source.replace(before,after),'utf8');
  return true;
}

const changes=[];
changes.push(await replaceExact('assets/js/ranking-pipeline.js',`    const previousProfiles=new Map((state.data.fighters||[]).filter(row=>row?.fighter).map(row=>[key(row.fighter),row]));
    state.data.men=projection.men.map(clone);
    state.data.women=projection.women.map(clone);
    state.data.fighters=projection.rows.map(row=>({
      ...stripCalculated(previousProfiles.get(key(row.fighter))),
      ...clone(row)
    }));`,`    const previousProfiles=new Map((state.data.fighters||[]).filter(row=>row?.fighter).map(row=>[key(row.fighter),row]));
    const nextMen=projection.men.map(clone);
    const nextWomen=projection.women.map(clone);
    const nextProfiles=projection.rows.map(row=>({
      ...stripCalculated(previousProfiles.get(key(row.fighter))),
      ...clone(row)
    }));
    if(Array.isArray(state.data.men))state.data.men.splice(0,state.data.men.length,...nextMen);else state.data.men=nextMen;
    if(Array.isArray(state.data.women))state.data.women.splice(0,state.data.women.length,...nextWomen);else state.data.women=nextWomen;
    if(Array.isArray(state.data.fighters))state.data.fighters.splice(0,state.data.fighters.length,...nextProfiles);else state.data.fighters=nextProfiles;`));

changes.push(await replaceExact('assets/js/app.js',`function overallOvr(f){
  const o = DISPLAY_OVERRIDES[f.fighter];
  if (o?.overallOvr) return o.overallOvr;
  const max = Math.max(...DATA.men.concat(DATA.women).map(x=>x.totalScore||0), 1);
  return clamp(Math.round(75 + ((f.totalScore || 0) / max) * 24), 60, 99);
}`,`function overallOvr(f){
  const calculated = Number(f?.overallOvr);
  if(Number.isFinite(calculated)) return calculated;
  const max = Math.max(...DATA.men.concat(DATA.women).map(x=>x.totalScore||0), 1);
  return clamp(Math.round(75 + ((f.totalScore || 0) / max) * 24), 60, 99);
}`));
changes.push(await replaceExact('assets/js/app.js',`function primeDominanceEntryFor(f){
  if(!f?.fighter) return null;
  return f.primeDominanceLiveAudit
    || f.primeDominanceShadowAudit
    || window.UFC_PRIME_DOMINANCE_LEDGERS?.entryFor?.(f.fighter)
    || window.UFC_PRIME_DOMINANCE_SHADOW_MODEL?.report?.find(entry => entry.fighter === f.fighter)
    || null;
}
function primeDominanceLiveValue(f){
  const entry = primeDominanceEntryFor(f);
  const value = Number(entry?.total ?? f?.primeDominance ?? 0);
  return Number.isFinite(value) ? value : 0;
}`,`function primeDominanceEntryFor(f){
  return f?.fighter ? window.UFC_CATEGORY_CALCULATORS?.rowFor?.('primeDominance', f.fighter) || null : null;
}
function primeDominanceLiveValue(f){
  const value = Number(f?.primeDominance ?? 0);
  return Number.isFinite(value) ? value : 0;
}`));
changes.push(await replaceExact('assets/js/app.js',`function categoryRank(f, key){
  if(key !== 'primeDominance'){
    const o = DISPLAY_OVERRIDES[f.fighter]?.categories?.[key];
    if (o?.rank) return o.rank;
  }
  const board = categoryBoardFor(f).map(fullRow);`,`function categoryRank(f, key){
  const board = categoryBoardFor(f).map(fullRow);`));
changes.push(await replaceExact('assets/js/app.js',`function categoryOvr(f, key){
  if(key !== 'primeDominance'){
    const o = DISPLAY_OVERRIDES[f.fighter]?.categories?.[key];
    if (o?.ovr) return o.ovr;
  }
  const board = categoryBoardFor(f);`,`function categoryOvr(f, key){
  const board = categoryBoardFor(f);`));
changes.push(await replaceExact('assets/js/app.js',`function profileFor(row){ return byName[row.fighter] || {}; }
function fullRow(row){ return { ...profileFor(row), ...row }; }`,`function profileFor(row){ return DATA.fighters.find(profile => profile.fighter === row.fighter) || {}; }
function fullRow(row){ return { ...profileFor(row), ...row }; }`));
changes.push(await replaceExact('assets/js/app.js',`  const rank = Number(override.allTimeRank || f.rank || 999);`,`  const rank = Number(f.rank || 999);`));
changes.push(await replaceExact('assets/js/app.js',`  const rankLabel = override.allTimeRank || f.rank || '—';`,`  const rankLabel = f.rank || '—';`));
changes.push(await replaceExact('assets/js/app.js',`  const snapshot = override.snapshot || [
    ['UFC Record', f.ufcRecord || '—'],
    ['UFC All-Time Rank', \`#\${rankLabel}\`],
    ['Finish Rate', pct(f.finishRatePct)],
    ['Active Elite Years', fmt(f.activeEliteYears)],
    ['Primary Division', f.primaryDivision || '—'],
    ['Secondary Division', f.secondaryDivision || '—']
  ];`,`  const visible = f.visibleStats || {};
  const snapshot = [
    ['UFC Record', visible.ufcRecord || f.ufcRecord || '—'],
    ['UFC All-Time Rank', \`#\${rankLabel}\`],
    ['UFC Title-Fight Wins', visible.titleFightWins ?? f.titleFightWins ?? '—'],
    ['Top-5 Wins', visible.topFiveWins ?? f.topFiveWins ?? '—'],
    ['Finish Rate', pct(visible.finishRatePct ?? f.finishRatePct)],
    ['Prime UFC Record', visible.primeRecord || f.primeRecord || '—'],
    ['Rounds Won', pct(visible.roundsWonPct ?? f.roundsWonPct)],
    ['Active Elite Years', fmt(visible.activeEliteYears ?? f.activeEliteYears)]
  ];`));
changes.push(await replaceExact('assets/js/app.js',`    const ar = key === 'overall' ? (DISPLAY_OVERRIDES[a.fighter]?.allTimeRank || a.rank || '—') : categoryRank(a, key);
    const br = key === 'overall' ? (DISPLAY_OVERRIDES[b.fighter]?.allTimeRank || b.rank || '—') : categoryRank(b, key);`,`    const ar = key === 'overall' ? (a.rank || '—') : categoryRank(a, key);
    const br = key === 'overall' ? (b.rank || '—') : categoryRank(b, key);`));

changes.push(await replaceExact('index.html',`  <meta name="app-build" content="20260713-top10-share-copy-polish" />`,`  <meta name="app-build" content="20260714-calculated-ranking-runtime" />`));
changes.push(await replaceExact('index.html',`  <script src="assets/data/canonical-scoring-records.js?v=canonical-scoring-records-20260713a-stage2"></script>
`,``));
changes.push(await replaceExact('index.html',`  <script src="assets/js/scoring-engine.js?v=scoring-engine-20260713c-finalizer-only"></script>
  <script src="assets/js/scoring-ownership-finalizer.js?v=scoring-ownership-finalizer-20260713f-no-legacy-repair"></script>
`,``));
changes.push(await replaceExact('index.html',`  <script src="assets/data/ranking-data-patches.js?v=ranking-data-patches-20260713y-stage3-clean-packets"></script>`,`  <script src="assets/data/ranking-data-patches.js?v=ranking-data-patches-20260713y-stage3-clean-packets"></script>
  <script src="assets/js/production-ranking-bootstrap.js?v=production-ranking-bootstrap-20260714a"></script>`));

changes.push(await replaceExact('scripts/test-ranking-pipeline.mjs',`async function productionRuntime(){
  const target=runtime();
  await load(target,[...factFiles,...eraFiles]);
  // Temporary compatibility shell for the two still-unsplit diagnostic modules.
  // It contains no frozen values and is deleted before the production API loads.
  target.window.UFC_CANONICAL_SCORING_RECORDS={compatibilityOnly:true,entryFor(){return null;}};
  await load(target,[...primeFiles,...longevityFiles,'assets/data/canonical-leon-final-category-completions.js']);
  delete target.window.UFC_CANONICAL_SCORING_RECORDS;
  await load(target,[
    'assets/data/division-era-depth-shadow.js',
    'assets/data/canonical-division-era-depth-approved-resolutions.js',
    'assets/data/canonical-scoring-judgments.js',
    'assets/js/category-calculators.js',
    'assets/js/ranking-pipeline.js'
  ]);
  return target;
}`,`async function productionRuntime(){
  const target=runtime();
  await load(target,[...factFiles,...eraFiles,
    'assets/data/division-era-depth-shadow.js',
    'assets/data/canonical-division-era-depth-approved-resolutions.js',
    'assets/data/canonical-scoring-judgments.js',
    'assets/js/category-calculators.js',
    'assets/js/ranking-pipeline.js'
  ]);
  return target;
}`));
changes.push(await replaceExact('scripts/test-ranking-pipeline.mjs',`assert.equal(window.UFC_CATEGORY_CALCULATORS?.readsFrozenCategoryControls,false);
assert.equal(window.UFC_RANKING_PIPELINE?.readsFrozenExpectedOutputsAsAuthority,false);`,`assert.equal(window.UFC_CATEGORY_CALCULATORS?.readsFrozenCategoryControls,false);
assert.equal(window.UFC_CATEGORY_CALCULATORS?.readsMigrationReconstructionReports,false);
assert.equal(window.UFC_CANONICAL_PRIME_DOMINANCE_RECONSTRUCTION,undefined);
assert.equal(window.UFC_CANONICAL_LONGEVITY_RECONSTRUCTION,undefined);
assert.match(window.UFC_CATEGORY_CALCULATORS.calculatorOwners.primeDominance,/category-calculators\.js/);
assert.match(window.UFC_CATEGORY_CALCULATORS.calculatorOwners.longevity,/category-calculators\.js/);
assert.equal(window.UFC_RANKING_PIPELINE?.readsFrozenExpectedOutputsAsAuthority,false);`));

console.log(JSON.stringify({changedFiles:changes.filter(Boolean).length},null,2));

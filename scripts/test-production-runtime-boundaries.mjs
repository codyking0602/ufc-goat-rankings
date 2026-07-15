import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const read=path=>fs.readFile(path,'utf8');
const contract=JSON.parse(await read('docs/scoring-architecture-contract.json'));
const [index,app,pipeline,bootstrap,profileRuntime,calculators,play,blind,compare,display]=await Promise.all([
  read('index.html'),
  read('assets/js/app.js'),
  read(contract.pipeline.path),
  read(contract.bootstrap.path),
  read(contract.profileRuntime.path),
  read(contract.calculators.path),
  read('assets/js/play.js'),
  read('assets/js/blind-matchmaking.js'),
  read('assets/compare-data.js'),
  read(contract.presentation.displayOverridesPath)
]);

for(const forbidden of contract.forbiddenIndexReferences){
  assert.ok(!index.includes(forbidden),`index.html must not load ${forbidden}`);
}
const order=contract.bootstrap.requiredIndexOrder.map(source=>index.indexOf(source));
assert.ok(order.every(position=>position>=0),'production loader and bootstrap are present');
assert.ok(order.every((position,index)=>index===0||order[index-1]<position),'production bootstrap loads after the presentation loader');

assert.ok(app.includes('const calculated = Number(f?.overallOvr)'),'leaderboard/profile OVR reads calculated row');
assert.ok(!app.includes('o?.overallOvr'),'app no longer reads override OVR');
assert.ok(!app.includes('override.snapshot ||'),'Resume Snapshot no longer accepts override ownership');
assert.ok(app.includes('const visible = f.visibleStats || {}'),'Resume Snapshot reads calculated visibleStats');
assert.ok(!app.includes('DISPLAY_OVERRIDES[a.fighter]?.allTimeRank'),'Compare no longer reads override rank');
assert.ok(!app.includes('DISPLAY_OVERRIDES[b.fighter]?.allTimeRank'),'Compare no longer reads override rank');
assert.ok(!app.includes('DISPLAY_OVERRIDES[f.fighter]?.categories?.[key]'),'category cards no longer read override rank/OVR');

assert.ok(pipeline.includes(`VERSION='${contract.pipeline.version}'`),'permanent ranking pipeline version is active');
assert.ok(pipeline.includes('championship:35,opponentQuality:25,primeDominance:30,longevity:10'),'approved 35/25/30/10 weights are permanent');
assert.ok(pipeline.includes('state.data.men.splice'),'men board is updated in place');
assert.ok(pipeline.includes('state.data.women.splice'),'women board is updated in place');
assert.ok(pipeline.includes('state.data.fighters.splice'),'profiles are updated in place');
assert.ok(pipeline.includes("scoreInputOwner:'category-calculators.js'"),'projected rows identify category calculator ownership');
assert.ok(pipeline.includes("overallScoreOwner:'ranking-pipeline.js'"),'projected rows identify total/rank/OVR ownership');
assert.ok(pipeline.includes('visibleStats'),'pipeline owns visible stats');
assert.ok(pipeline.includes('readsFrozenExpectedOutputsAsAuthority:false'),'frozen outputs are not authority');
assert.ok(pipeline.includes('readsShadowFinalOrOvrReportsAsAuthority:false'),'shadow total/OVR reports are not authority');

assert.ok(calculators.includes(`VERSION='${contract.calculators.version}'`),'direct seven-calculator version is active');
assert.ok(calculators.includes('readsMigrationReconstructionReports:false'),'production calculator rejects reconstruction-report ownership');
assert.ok(!calculators.includes('UFC_CANONICAL_SCORING_RECORDS'),'calculator never reads frozen category controls');
assert.ok(!calculators.includes('UFC_CANONICAL_PRIME_DOMINANCE_RECONSTRUCTION'),'Prime formula is not delegated to migration reconstruction');
assert.ok(!calculators.includes('UFC_CANONICAL_LONGEVITY_RECONSTRUCTION'),'Longevity formula is not delegated to migration reconstruction');
assert.ok(calculators.includes('function calculatePrimeDominance'),'Prime Dominance formula lives in permanent calculator');
assert.ok(calculators.includes('function calculateLongevity'),'Longevity formula lives in permanent calculator');
assert.ok(calculators.includes('PRIME_COMPONENT_MAX'),'Prime 9/9/5/7 components are explicit');
assert.ok(calculators.includes('LONGEVITY_FULL_CREDIT_MONTHS=144'),'Longevity 144-month ceiling is explicit');
assert.ok(calculators.includes('LONGEVITY_GAP_CAP_MONTHS=18'),'Longevity 18-month gap cap is explicit');

assert.ok(bootstrap.includes('fighter-era-ledger-approved-longevity-resolutions.js'),'browser runtime loads approved longevity era resolutions');
assert.ok(bootstrap.includes('fighter-era-ledger-approved-loss-context-resolutions.js'),'browser runtime loads approved loss-context era resolutions');
assert.ok(bootstrap.includes('calculated-profile-runtime.js'),'browser runtime installs calculated profile renderer');
assert.ok(bootstrap.includes('stripPresentationScoreOwnership'),'bootstrap removes scoring fields from presentation overrides');
assert.ok(bootstrap.includes('syncComparePresentation'),'Compare presentation stats are synchronized from calculated rows');
assert.ok(bootstrap.includes("data-scoring-pipeline','ready"),'bootstrap publishes calculated model readiness');
assert.ok(bootstrap.includes("new CustomEvent('ufc-scoring-pipeline-ready'"),'Play readiness event remains compatible');
assert.ok(!bootstrap.includes('scoring-engine.js'),'bootstrap never loads the legacy engine');
assert.ok(!bootstrap.includes('scoring-ownership-finalizer.js'),'bootstrap never loads the legacy finalizer');

assert.ok(profileRuntime.includes(`snapshotOwner:'${contract.profileRuntime.snapshotOwner}'`),'final profile snapshot owner is calculated visibleStats');
assert.ok(profileRuntime.includes(`rankOwner:'${contract.profileRuntime.rankOwner}'`),'final profile rank owner is calculated rank');
assert.ok(profileRuntime.includes(`ovrOwner:'${contract.profileRuntime.ovrOwner}'`),'final profile OVR owner is calculated OVR');
assert.ok(profileRuntime.includes("['Top-5 Wins'"),'final profile renders calculated Top-5 wins');
assert.ok(!profileRuntime.includes('override.snapshot'),'final profile never reads manual snapshot rows');
assert.ok(!profileRuntime.includes('snapshotStats'),'final profile never reads manual snapshot stats');

assert.ok(play.includes('const live = Number(liveRow(name)?.rank)'),'Top 10 comparisons prefer calculated rank');
assert.ok(blind.includes("window.UFC_SCORING_PIPELINE?.status === 'ready'"),'Blind Resume waits for calculated model readiness');
assert.ok(blind.includes('const live = number(liveRow(fighter?.fighter)?.rank'),'Blind Resume prefers calculated rank');
assert.ok(blind.includes('const candidates = [row.totalScore,row.rawScore,profile.totalScore,profile.rawScore]'),'Blind matchmaking reads calculated total score');

assert.match(compare,/window\.COMPARE_FIGHT_LEDGER\s*=\s*FIGHT_LEDGER/,'real direct fight ledger remains presentation evidence');
assert.match(compare,/window\.COMPARE_PROFILES\s*=\s*COMPARE_PROFILES/,'Compare narrative profiles remain intact');
assert.ok(!/legacyStats\s*:/.test(compare),'Compare source contains no hard-coded legacy stats');

const sandbox={};
vm.runInNewContext(`${display}\n;globalThis.__DISPLAY__=DISPLAY_OVERRIDES;`,sandbox,{timeout:5000});
for(const [fighter,override] of Object.entries(sandbox.__DISPLAY__||{})){
  assert.ok(!Object.prototype.hasOwnProperty.call(override,'snapshot'),`${fighter} has no manual Resume Snapshot`);
  for(const field of contract.presentation.forbiddenDirectFields){
    assert.ok(!Object.prototype.hasOwnProperty.call(override,field),`${fighter} has no presentation-owned ${field}`);
  }
}

console.log('PRODUCTION_RUNTIME_BOUNDARY_CERTIFICATION');
console.log(JSON.stringify({
  rosterContract:contract.expectedRosterCount,
  formula:contract.pipeline.formula,
  legacyRuntimeScriptsLoaded:false,
  snapshotOwner:contract.profileRuntime.snapshotOwner,
  compareStatOwner:'RANKING_DATA calculated projection',
  playRankOwner:'RANKING_DATA.rank',
  categoryOwner:'category-calculators.js',
  totalRankOvrOwner:'ranking-pipeline.js',
  physicalPresentationScoringFields:false
},null,2));

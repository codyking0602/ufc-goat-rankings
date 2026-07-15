import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const read=path=>fs.readFile(path,'utf8');
const [index,app,pipeline,bootstrap,profileRuntime,calculators,play,blind,compare]=await Promise.all([
  read('index.html'),
  read('assets/js/app.js'),
  read('assets/js/ranking-pipeline.js'),
  read('assets/js/production-ranking-bootstrap.js'),
  read('assets/js/calculated-profile-runtime.js'),
  read('assets/js/category-calculators.js'),
  read('assets/js/play.js'),
  read('assets/js/blind-matchmaking.js'),
  read('assets/compare-data.js')
]);

for(const forbidden of [
  'assets/data/canonical-scoring-records.js',
  'assets/js/scoring-engine.js',
  'assets/js/scoring-ownership-finalizer.js'
])assert.ok(!index.includes(forbidden),`index.html must not load ${forbidden}`);
assert.ok(index.includes('assets/js/production-ranking-bootstrap.js'),'production bootstrap is loaded');

assert.ok(app.includes('const calculated = Number(f?.overallOvr)'),'leaderboard/profile OVR reads calculated row');
assert.ok(!app.includes('o?.overallOvr'),'app no longer reads override OVR');
assert.ok(!app.includes('override.snapshot ||'),'Resume Snapshot no longer accepts override ownership');
assert.ok(app.includes('const visible = f.visibleStats || {}'),'Resume Snapshot reads calculated visibleStats');
assert.ok(app.includes("['UFC Title-Fight Wins'"),'Resume Snapshot shows calculated title wins');
assert.ok(app.includes("['Top-5 Wins'"),'Resume Snapshot shows calculated Top-5 wins');
assert.ok(!app.includes('DISPLAY_OVERRIDES[a.fighter]?.allTimeRank'),'Compare no longer reads override rank');
assert.ok(!app.includes('DISPLAY_OVERRIDES[b.fighter]?.allTimeRank'),'Compare no longer reads override rank');
assert.ok(!app.includes('DISPLAY_OVERRIDES[f.fighter]?.categories?.[key]'),'category cards no longer read override rank/OVR');

assert.ok(pipeline.includes('state.data.men.splice'),'men board is updated in place');
assert.ok(pipeline.includes('state.data.women.splice'),'women board is updated in place');
assert.ok(pipeline.includes('state.data.fighters.splice'),'profiles are updated in place');
assert.ok(pipeline.includes("scoreInputOwner:'category-calculators.js'"),'projected rows identify category calculator ownership');
assert.ok(pipeline.includes("overallScoreOwner:'ranking-pipeline.js'"),'projected rows identify total/rank/OVR ownership');
assert.ok(pipeline.includes('visibleStats'),'pipeline owns visible stats');

assert.ok(calculators.includes("VERSION='category-calculators-20260714c-seven-direct-calculators'"),'direct seven-calculator version is active');
assert.ok(calculators.includes('readsMigrationReconstructionReports:false'),'production calculator rejects reconstruction-report ownership');
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
assert.ok(bootstrap.includes("status:'ready'"),'bootstrap publishes calculated model readiness');
assert.ok(bootstrap.includes("new CustomEvent('ufc-scoring-pipeline-ready'"),'Play readiness event remains compatible');

assert.ok(profileRuntime.includes("snapshotOwner:'RANKING_DATA.visibleStats'"),'final profile snapshot owner is calculated visibleStats');
assert.ok(profileRuntime.includes("rankOwner:'RANKING_DATA.rank'"),'final profile rank owner is calculated rank');
assert.ok(profileRuntime.includes("ovrOwner:'RANKING_DATA.overallOvr'"),'final profile OVR owner is calculated OVR');
assert.ok(profileRuntime.includes("['Top-5 Wins'"),'final profile renders calculated Top-5 wins');
assert.ok(!profileRuntime.includes('override.snapshot'),'final profile never reads manual snapshot rows');
assert.ok(!profileRuntime.includes('snapshotStats'),'final profile never reads manual snapshot stats');

assert.ok(play.includes('return [...(DATA.men || []), ...(DATA.women || [])].find'),'Top 10 reads current calculated board rows');
assert.ok(play.includes('const live = Number(liveRow(name)?.rank)'),'Top 10 model comparisons prefer calculated rank');
assert.ok(blind.includes("window.UFC_SCORING_PIPELINE?.status === 'ready'"),'Blind Resume waits for calculated model readiness');
assert.ok(blind.includes('const live = number(liveRow(fighter?.fighter)?.rank'),'Blind Resume prefers calculated rank');
assert.ok(blind.includes('const candidates = [row.totalScore,row.rawScore,profile.totalScore,profile.rawScore]'),'Blind matchmaking reads calculated total score');

assert.ok(compare.includes('window.COMPARE_FIGHT_LEDGER = FIGHT_LEDGER'),'real direct fight ledger remains presentation evidence');
assert.ok(compare.includes('window.COMPARE_PROFILES = COMPARE_PROFILES'),'Compare narrative profiles remain intact');

console.log('PRODUCTION_RUNTIME_BOUNDARY_CERTIFICATION');
console.log(JSON.stringify({
  legacyRuntimeScriptsLoaded:false,
  approvedEraResolutionsLoaded:true,
  snapshotOwner:'ranking-pipeline.visibleStats',
  compareRankOwner:'RANKING_DATA.rank',
  playRankOwner:'RANKING_DATA.rank',
  categoryOwner:'category-calculators.js',
  totalRankOvrOwner:'ranking-pipeline.js'
},null,2));

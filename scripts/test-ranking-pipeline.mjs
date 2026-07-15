import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

class CustomEvent{constructor(type,options={}){this.type=type;this.detail=options.detail;}}
function runtime(){
  const attributes={};
  const document={body:null,documentElement:{setAttribute(name,value){attributes[name]=value;}},querySelector(){return null;},querySelectorAll(){return[];}};
  const window={dispatchEvent(){return true;}};
  const context=vm.createContext({window,document,CustomEvent,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
  return{window,document,attributes,context};
}
async function load(target,files){for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),target.context,{filename:file});}
const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');

const factFiles=[
  'assets/data/ranking-data.js',
  'assets/data/canonical-fighter-facts.js',
  'assets/data/canonical-fighter-facts-batch-one.js',
  'assets/data/canonical-fighter-facts-batch-two.js',
  'assets/data/canonical-fighter-facts-batch-three.js',
  'assets/data/canonical-fighter-facts-batch-four.js',
  'assets/data/canonical-fighter-facts-batch-five.js',
  'assets/data/canonical-fighter-facts-batch-six.js',
  'assets/data/canonical-fighter-facts-batch-seven-data-a.js',
  'assets/data/canonical-fighter-facts-batch-seven-data-b.js',
  'assets/data/canonical-fighter-facts-batch-seven.js',
  'assets/data/canonical-fighter-facts-batch-eight-data-a.js',
  'assets/data/canonical-fighter-facts-batch-eight-data-b.js',
  'assets/data/canonical-fighter-facts-batch-eight.js',
  'assets/data/canonical-fighter-facts-batch-nine-data-a.js',
  'assets/data/canonical-fighter-facts-batch-nine-data-b.js',
  'assets/data/canonical-fighter-facts-batch-nine-data-c.js',
  'assets/data/canonical-fighter-facts-batch-nine.js',
  'assets/data/canonical-fighter-facts-approved-corrections.js',
  'assets/data/canonical-fighter-facts-opponent-quality-corrections.js',
  'assets/data/canonical-fighter-facts-prime-round-corrections.js'
];
const eraFiles=[
  'assets/data/fighter-era-ledgers.js',
  'assets/data/fighter-era-ledger-approved-longevity-resolutions.js',
  'assets/data/fighter-era-ledger-approved-loss-context-resolutions.js'
];
const primeFiles=[
  'assets/data/prime-windows.js',
  'assets/data/prime-round-control-audit.js',
  'assets/data/prime-dominance-ledgers.js',
  'assets/data/prime-dominance-shadow-model.js',
  'assets/data/canonical-prime-dominance-reconstruction.js'
];
const longevityFiles=[
  'assets/data/longevity-shadow-scorer.js',
  'assets/data/canonical-longevity-reconstruction.js',
  'assets/data/canonical-longevity-approved-resolutions.js'
];

async function approvedFixture(){
  const target=runtime();
  await load(target,[
    ...factFiles,
    'assets/data/canonical-scoring-records.js',
    ...eraFiles,
    'assets/data/championship-resume-ledgers.js',
    'assets/data/championship-resume-ledger-rule-locks.js',
    'assets/data/canonical-championship-reconstruction.js',
    'assets/data/canonical-championship-approved-resolutions.js',
    'assets/data/opponent-quality-ledgers.js',
    'assets/data/opponent-quality-ledger-batch-four.js',
    'assets/data/opponent-quality-ledger-batch-five.js',
    'assets/data/opponent-quality-ledger-batch-six.js',
    'assets/data/opponent-quality-ledger-batch-seven.js',
    'assets/data/opponent-quality-ledger-batch-eight.js',
    'assets/data/opponent-quality-ledger-batch-nine.js',
    'assets/data/canonical-opponent-quality-approved-judgments.js',
    'assets/data/canonical-opponent-quality-reconstruction.js',
    ...primeFiles,
    ...longevityFiles,
    'assets/data/canonical-loss-context-approved-resolutions.js',
    'assets/data/canonical-loss-context-reconstruction.js',
    'assets/data/canonical-apex-approved-judgments.js',
    'assets/data/canonical-apex-approved-judgments-batch-two.js',
    'assets/data/canonical-apex-approved-judgments-batch-three.js',
    'assets/data/canonical-apex-approved-judgments-batch-four.js'
  ]);
  const snapshot=JSON.parse(await fs.readFile('docs/runtime-scoring-snapshot.json','utf8'));
  assert.equal(snapshot?.summary?.status,'clean');
  target.window.RANKING_DATA.fighters=target.window.RANKING_DATA.fighters||[];
  for(const snapshotRow of snapshot.fighters){
    const existing=[...(target.window.RANKING_DATA.men||[]),...(target.window.RANKING_DATA.women||[]),...(target.window.RANKING_DATA.fighters||[])].find(row=>key(row?.fighter)===key(snapshotRow?.fighter));
    if(existing)existing.apexPeakAudit=JSON.parse(JSON.stringify(snapshotRow.apexPeakAudit));
    else target.window.RANKING_DATA.fighters.push({fighter:snapshotRow.fighter,apexPeakAudit:JSON.parse(JSON.stringify(snapshotRow.apexPeakAudit))});
  }
  await load(target,[
    'assets/data/canonical-apex-reconstruction.js',
    'assets/data/division-era-depth-shadow.js',
    'assets/data/canonical-division-era-depth-approved-resolutions.js',
    'assets/data/canonical-division-era-depth-reconstruction.js',
    'assets/data/canonical-leon-final-category-completions.js',
    'assets/data/canonical-final-score-reconstruction.js',
    'assets/data/canonical-ovr-reconstruction.js'
  ]);
  const final=target.window.UFC_CANONICAL_FINAL_SCORE_RECONSTRUCTION;
  const ovr=target.window.UFC_CANONICAL_OVR_RECONSTRUCTION;
  assert.equal(final?.applied,true);
  assert.equal(ovr?.applied,true);
  const expected=new Map(final.approvedReport.rows.filter(row=>row.status==='complete').map(row=>[key(row.fighter),{
    fighter:row.fighter,board:row.board,rank:row.calculatedRank,totalScore:row.totalScore,overallOvr:ovr.entryFor(row.fighter).calculatedOvr,scores:JSON.parse(JSON.stringify(row.scores))
  }]));
  assert.equal(expected.size,73);
  return expected;
}

async function productionRuntime(){
  const target=runtime();
  await load(target,[...factFiles,...eraFiles,
    'assets/data/division-era-depth-shadow.js',
    'assets/data/canonical-division-era-depth-approved-resolutions.js',
    'assets/data/canonical-scoring-judgments.js',
    'assets/js/category-calculators.js',
    'assets/js/ranking-pipeline.js'
  ]);
  return target;
}

const expected=await approvedFixture();
const production=await productionRuntime();
const {window,attributes}=production;
assert.equal(window.UFC_CANONICAL_SCORING_RECORDS,undefined,'Frozen scoring records are absent from production runtime');
assert.equal(window.UFC_CANONICAL_SCORING_JUDGMENTS?.fighterCount,73);
assert.equal(window.UFC_CANONICAL_SCORING_JUDGMENTS?.ownsCalculatedScores,false);
assert.equal(window.UFC_CANONICAL_SCORING_JUDGMENTS?.ownsTotalsRanksOrOvr,false);
assert.equal(window.UFC_CATEGORY_CALCULATOR_AUDIT?.passed,true);
assert.equal(window.UFC_CATEGORY_CALCULATOR_AUDIT?.completeFighterCount,73);
assert.equal(window.UFC_CATEGORY_CALCULATORS?.readsFrozenExpectedOutputs,false);
assert.equal(window.UFC_CATEGORY_CALCULATORS?.readsFrozenCategoryControls,false);
assert.equal(window.UFC_CATEGORY_CALCULATORS?.readsMigrationReconstructionReports,false);
assert.equal(window.UFC_CANONICAL_PRIME_DOMINANCE_RECONSTRUCTION,undefined);
assert.equal(window.UFC_CANONICAL_LONGEVITY_RECONSTRUCTION,undefined);
assert.match(window.UFC_CATEGORY_CALCULATORS.calculatorOwners.primeDominance,/category-calculators.js/);
assert.match(window.UFC_CATEGORY_CALCULATORS.calculatorOwners.longevity,/category-calculators.js/);
assert.equal(window.UFC_RANKING_PIPELINE?.readsFrozenExpectedOutputsAsAuthority,false);
assert.equal(window.UFC_RANKING_PIPELINE?.readsShadowFinalOrOvrReportsAsAuthority,false);

const report=window.UFC_RANKING_PIPELINE.apply();
assert.equal(report.applied,true);
assert.equal(report.fighterCount,73);
assert.equal(window.RANKING_DATA.men.length+window.RANKING_DATA.women.length,73);
assert.equal(window.RANKING_DATA.fighters.length,73);
assert.deepEqual(JSON.parse(JSON.stringify(window.UFC_RANKING_PIPELINE.weights)),{championship:35,opponentQuality:25,primeDominance:30,longevity:10});
assert.equal(window.RANKING_DATA.meta.calculatedRankingPipeline.frozenExpectedOutputsUsedAsAuthority,false);
assert.equal(window.RANKING_DATA.meta.calculatedRankingPipeline.shadowFinalOrOvrReportsUsedAsAuthority,false);
assert.equal(window.RANKING_DATA.liveScoreMode,'fight-level-calculated-single-owner');

const expectedMenTopTen=['Jon Jones','Georges St-Pierre','Anderson Silva','Demetrious Johnson','Islam Makhachev','Alexander Volkanovski','Khabib Nurmagomedov','Matt Hughes','Kamaru Usman','Max Holloway'];
assert.deepEqual(JSON.parse(JSON.stringify(window.RANKING_DATA.men.slice(0,10).map(row=>row.fighter))),expectedMenTopTen);

for(const row of window.UFC_CALCULATED_RANKING_PROJECTION.rows){
  const fixture=expected.get(key(row.fighter));
  assert.ok(fixture,`${row.fighter} approved fixture`);
  assert.equal(row.rank,fixture.rank,`${row.fighter} rank`);
  assert.equal(row.totalScore,fixture.totalScore,`${row.fighter} total`);
  assert.equal(row.overallOvr,fixture.overallOvr,`${row.fighter} OVR`);
  for(const field of ['championship','opponentQuality','primeDominance','longevity'])assert.equal(row[field],fixture.scores[field],`${row.fighter} ${field}`);
  assert.equal(row.apexPeak,fixture.scores.apex,`${row.fighter} apex`);
  assert.equal(row.penalty,fixture.scores.penalty,`${row.fighter} penalty`);
  assert.equal(row.eraDepthAdjustment,fixture.scores.eraDepth,`${row.fighter} era depth`);
}

const entry=fighter=>window.UFC_CALCULATED_RANKING_PROJECTION.entryFor(fighter);
assert.equal(entry('Jon Jones').rank,1);assert.equal(entry('Jon Jones').overallOvr,99);
assert.equal(entry('Georges St-Pierre').rank,2);assert.equal(entry('Georges St-Pierre').overallOvr,96);
assert.equal(entry('Anderson Silva').rank,3);assert.equal(entry('Demetrious Johnson').rank,4);
assert.equal(entry('Islam Makhachev').rank,5);assert.equal(entry('Alexander Volkanovski').rank,6);
assert.equal(entry('Khabib Nurmagomedov').rank,7);assert.equal(entry('Matt Hughes').rank,8);
assert.equal(entry('Kamaru Usman').rank,9);assert.equal(entry('Max Holloway').rank,10);
assert.equal(entry('Henry Cejudo').rank,38);assert.equal(entry('Royce Gracie').rank,50);
assert.equal(entry('Amanda Nunes').rank,1);assert.equal(entry('Amanda Nunes').overallOvr,99);
assert.equal(entry('Valentina Shevchenko').overallOvr,98);

const boardByKey=new Map([...window.RANKING_DATA.men,...window.RANKING_DATA.women].map(row=>[key(row.fighter),row]));
for(const profile of window.RANKING_DATA.fighters){
  const board=boardByKey.get(key(profile.fighter));
  assert.ok(board,`${profile.fighter} profile has board row`);
  for(const field of ['rank','totalScore','overallOvr','championship','opponentQuality','primeDominance','longevity','apexPeak','penalty','eraDepthAdjustment'])assert.equal(profile[field],board[field],`${profile.fighter} profile ${field}`);
  assert.equal(profile.ufcRecord,window.UFC_CANONICAL_FIGHTER_FACTS.deriveFor(profile.fighter).officialUfcRecord.text,`${profile.fighter} UFC record`);
  assert.equal(profile.primeRecord,window.UFC_CANONICAL_FIGHTER_FACTS.deriveFor(profile.fighter).prime.recordText,`${profile.fighter} prime record`);
  assert.ok(profile.visibleStats,`${profile.fighter} visible stats`);
}
assert.equal(attributes['data-ranking-pipeline'],`${window.UFC_RANKING_PIPELINE.version}-applied-73`);

console.log('RANKING_PIPELINE_NO_FROZEN_CONTROL_CERTIFICATION');
console.log(JSON.stringify({
  version:window.UFC_RANKING_PIPELINE.version,
  categoryVersion:window.UFC_CATEGORY_CALCULATORS.version,
  judgmentVersion:window.UFC_CANONICAL_SCORING_JUDGMENTS.version,
  fighterCount:report.fighterCount,
  exactApprovedOutputMatches:window.UFC_CALCULATED_RANKING_PROJECTION.rows.length,
  frozenScoringRecordsLoaded:false,
  menTopTen:report.menTopTen,
  womenTopTen:report.womenTopTen
},null,2));

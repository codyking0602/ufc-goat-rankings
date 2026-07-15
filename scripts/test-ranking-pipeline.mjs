import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const files=[
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
  'assets/data/canonical-fighter-facts-prime-round-corrections.js',
  'assets/data/canonical-scoring-records.js',
  'assets/data/fighter-era-ledgers.js',
  'assets/data/fighter-era-ledger-approved-longevity-resolutions.js',
  'assets/data/fighter-era-ledger-approved-loss-context-resolutions.js',
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
  'assets/data/prime-windows.js',
  'assets/data/prime-round-control-audit.js',
  'assets/data/prime-dominance-ledgers.js',
  'assets/data/prime-dominance-shadow-model.js',
  'assets/data/canonical-prime-dominance-reconstruction.js',
  'assets/data/longevity-shadow-scorer.js',
  'assets/data/canonical-longevity-reconstruction.js',
  'assets/data/canonical-longevity-approved-resolutions.js',
  'assets/data/canonical-loss-context-approved-resolutions.js',
  'assets/data/canonical-loss-context-reconstruction.js',
  'assets/data/canonical-apex-approved-judgments.js',
  'assets/data/canonical-apex-approved-judgments-batch-two.js',
  'assets/data/canonical-apex-approved-judgments-batch-three.js',
  'assets/data/canonical-apex-approved-judgments-batch-four.js'
];

class CustomEvent{constructor(type,options={}){this.type=type;this.detail=options.detail;}}
const attributes={};
const document={body:null,documentElement:{setAttribute(name,value){attributes[name]=value;}},querySelector(){return null;},querySelectorAll(){return[];}};
const window={dispatchEvent(){return true;}};
const context=vm.createContext({window,document,CustomEvent,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});

const runtimeSnapshot=JSON.parse(await fs.readFile('docs/runtime-scoring-snapshot.json','utf8'));
assert.equal(runtimeSnapshot?.summary?.status,'clean');
window.RANKING_DATA.fighters=window.RANKING_DATA.fighters||[];
const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
for(const snapshotRow of runtimeSnapshot.fighters){
  const existing=[...(window.RANKING_DATA.men||[]),...(window.RANKING_DATA.women||[]),...(window.RANKING_DATA.fighters||[])].find(row=>key(row?.fighter)===key(snapshotRow?.fighter));
  if(existing)existing.apexPeakAudit=JSON.parse(JSON.stringify(snapshotRow.apexPeakAudit));
  else window.RANKING_DATA.fighters.push({fighter:snapshotRow.fighter,apexPeakAudit:JSON.parse(JSON.stringify(snapshotRow.apexPeakAudit))});
}

for(const file of [
  'assets/data/canonical-apex-reconstruction.js',
  'assets/data/division-era-depth-shadow.js',
  'assets/data/canonical-division-era-depth-approved-resolutions.js',
  'assets/data/canonical-division-era-depth-reconstruction.js',
  'assets/data/canonical-leon-final-category-completions.js',
  'assets/data/canonical-final-score-reconstruction.js',
  'assets/data/canonical-ovr-reconstruction.js',
  'assets/js/ranking-pipeline.js'
]){
  vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});
}

assert.equal(window.UFC_CANONICAL_FINAL_SCORE_RECONSTRUCTION?.applied,true);
assert.equal(window.UFC_CANONICAL_OVR_RECONSTRUCTION?.applied,true);
assert.equal(window.UFC_RANKING_PIPELINE?.readsFrozenExpectedOutputsAsAuthority,false);

// A production projection must not consult the frozen migration control.
window.UFC_CANONICAL_SCORING_RECORDS.entryFor=()=>{throw new Error('Frozen scoring controls were read as production authority.');};

const report=window.UFC_RANKING_PIPELINE.apply();
assert.equal(report.applied,true);
assert.equal(report.fighterCount,73);
assert.equal(window.RANKING_DATA.men.length+window.RANKING_DATA.women.length,73);
assert.equal(window.RANKING_DATA.fighters.length,73);
assert.equal(window.RANKING_DATA.meta.calculatedRankingPipeline.frozenExpectedOutputsUsedAsAuthority,false);
assert.equal(window.RANKING_DATA.liveScoreMode,'fight-level-calculated-single-owner');

const expectedMenTopTen=[
  'Jon Jones',
  'Georges St-Pierre',
  'Anderson Silva',
  'Demetrious Johnson',
  'Islam Makhachev',
  'Alexander Volkanovski',
  'Khabib Nurmagomedov',
  'Matt Hughes',
  'Kamaru Usman',
  'Max Holloway'
];
assert.deepEqual(window.RANKING_DATA.men.slice(0,10).map(row=>row.fighter),expectedMenTopTen);

const entry=fighter=>window.UFC_CALCULATED_RANKING_PROJECTION.entryFor(fighter);
assert.equal(entry('Jon Jones').rank,1);
assert.equal(entry('Jon Jones').overallOvr,99);
assert.equal(entry('Georges St-Pierre').rank,2);
assert.equal(entry('Georges St-Pierre').overallOvr,96);
assert.equal(entry('Anderson Silva').rank,3);
assert.equal(entry('Demetrious Johnson').rank,4);
assert.equal(entry('Islam Makhachev').rank,5);
assert.equal(entry('Alexander Volkanovski').rank,6);
assert.equal(entry('Khabib Nurmagomedov').rank,7);
assert.equal(entry('Matt Hughes').rank,8);
assert.equal(entry('Kamaru Usman').rank,9);
assert.equal(entry('Max Holloway').rank,10);
assert.equal(entry('Henry Cejudo').rank,38);
assert.equal(entry('Royce Gracie').rank,50);
assert.equal(entry('Amanda Nunes').rank,1);
assert.equal(entry('Amanda Nunes').overallOvr,99);
assert.equal(entry('Valentina Shevchenko').overallOvr,98);

const boardByKey=new Map([...window.RANKING_DATA.men,...window.RANKING_DATA.women].map(row=>[key(row.fighter),row]));
for(const profile of window.RANKING_DATA.fighters){
  const board=boardByKey.get(key(profile.fighter));
  assert.ok(board,`${profile.fighter} profile has board row`);
  for(const field of ['rank','totalScore','overallOvr','championship','opponentQuality','primeDominance','longevity','apexPeak','penalty','eraDepthAdjustment']){
    assert.equal(profile[field],board[field],`${profile.fighter} profile ${field}`);
  }
  assert.equal(profile.ufcRecord,window.UFC_CANONICAL_FIGHTER_FACTS.deriveFor(profile.fighter).officialUfcRecord.text,`${profile.fighter} UFC record`);
  assert.equal(profile.primeRecord,window.UFC_CANONICAL_FIGHTER_FACTS.deriveFor(profile.fighter).prime.recordText,`${profile.fighter} prime record`);
  assert.ok(profile.visibleStats,`${profile.fighter} visible stats`);
}

assert.equal(attributes['data-ranking-pipeline'],`${window.UFC_RANKING_PIPELINE.version}-applied-73`);

console.log('RANKING_PIPELINE_CERTIFICATION');
console.log(JSON.stringify({
  version:window.UFC_RANKING_PIPELINE.version,
  fighterCount:report.fighterCount,
  menTopTen:report.menTopTen,
  womenTopTen:report.womenTopTen,
  frozenExpectedOutputsUsedAsAuthority:window.RANKING_DATA.meta.calculatedRankingPipeline.frozenExpectedOutputsUsedAsAuthority
},null,2));

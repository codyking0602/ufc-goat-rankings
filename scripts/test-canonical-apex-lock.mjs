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
  'assets/data/canonical-scoring-records.js',
  'assets/data/apex-peak-score-corrections.js',
  'assets/data/apex-peak-component-audit.js',
  'assets/data/apex-peak-live-bonus.js',
  'assets/data/apex-peak-audit-dricus.js',
  'assets/data/canonical-apex-approved-judgments.js',
  'assets/data/canonical-apex-approved-judgments-batch-two.js',
  'assets/data/canonical-apex-approved-judgments-batch-three.js',
  'assets/data/canonical-apex-approved-judgments-batch-four.js'
];

const attributes={};
const document={body:null,documentElement:{setAttribute(name,value){attributes[name]=value;}},querySelector(){return null;},querySelectorAll(){return[];}};
const window={};
const context=vm.createContext({window,document,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});

const runtimeSnapshot=JSON.parse(await fs.readFile('docs/runtime-scoring-snapshot.json','utf8'));
assert.equal(runtimeSnapshot?.summary?.status,'clean');
context.window.RANKING_DATA.fighters=context.window.RANKING_DATA.fighters||[];
const normalized=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
for(const snapshotRow of runtimeSnapshot.fighters){
  const existing=[...(context.window.RANKING_DATA.men||[]),...(context.window.RANKING_DATA.women||[]),...(context.window.RANKING_DATA.fighters||[])].find(row=>normalized(row?.fighter)===normalized(snapshotRow?.fighter));
  if(existing)existing.apexPeakAudit=JSON.parse(JSON.stringify(snapshotRow.apexPeakAudit));
  else context.window.RANKING_DATA.fighters.push({fighter:snapshotRow.fighter,apexPeakAudit:JSON.parse(JSON.stringify(snapshotRow.apexPeakAudit))});
}

const liveBefore=JSON.stringify(context.window.RANKING_DATA);
vm.runInContext(await fs.readFile('assets/data/canonical-apex-reconstruction.js','utf8'),context,{filename:'assets/data/canonical-apex-reconstruction.js'});
vm.runInContext(await fs.readFile('assets/data/canonical-apex-lock.js','utf8'),context,{filename:'assets/data/canonical-apex-lock.js'});

const lock=context.window.UFC_CANONICAL_APEX_LOCK;
const report=context.window.UFC_CANONICAL_APEX_RECONSTRUCTION;
const approved=context.window.UFC_CANONICAL_APEX_APPROVED_JUDGMENTS;

assert.equal(lock?.locked,true);
assert.equal(lock?.status,'locked');
assert.equal(lock?.category,'Apex Peak');
assert.equal(lock?.approvedBy,'Cody');
assert.equal(lock?.lockedAt,'2026-07-14');
assert.deepEqual(JSON.parse(JSON.stringify(lock.scoreRange)),{min:0,max:6});
assert.equal(lock.approvedJudgmentCount,36);
assert.equal(lock.fighterCount,73);
assert.equal(lock.approvedVersion,approved.version);
assert.equal(lock.reconstructionVersion,report.version);
assert.equal(lock.validation.missingApexJudgments,0);
assert.equal(lock.validation.selectedPerformanceIssues,0);
assert.equal(lock.validation.twentyFourMonthViolations,0);
assert.equal(lock.validation.invalidSelectedPerformances,0);
assert.equal(lock.validation.formulaIssues,0);
assert.equal(lock.validation.liveDataUnchanged,true);
assert.equal(lock.mutatesRankingData,false);
assert.equal(lock.mutatesScores,false);
assert.equal(JSON.stringify(context.window.RANKING_DATA),liveBefore,'Lock certification must not mutate live ranking data');
assert.match(lock.changePolicy,/requires Cody approval/i);

console.log('CANONICAL_APEX_PEAK_LOCKED');
console.log(JSON.stringify(lock,null,2));

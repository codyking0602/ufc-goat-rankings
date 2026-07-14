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

const report=context.window.UFC_CANONICAL_APEX_RECONSTRUCTION;
const approved=context.window.UFC_CANONICAL_APEX_APPROVED_JUDGMENTS;
assert.equal(approved?.fighterCount,20,'Approved Apex registry should contain both review batches');
assert.equal(approved?.mutatesRankingData,false);
assert.equal(approved?.mutatesScores,false);
assert.equal(report?.applied,true);
assert.equal(report.fighterCount,73);
assert.equal(report.liveDataUnchanged,true);
assert.equal(JSON.stringify(context.window.RANKING_DATA),liveBefore,'Approved Apex batches must not modify live ranking data');

const expected={
  'Vitor Belfort':{score:5.26,current:5.30,difference:-0.04,pair:['2013-01-19-michael-bisping','2013-05-18-luke-rockhold'],components:[1.86,1.40,1.00,1.00]},
  'Forrest Griffin':{score:4.98,current:5.10,difference:-0.12,pair:['2007-09-22-mauricio-rua','2008-07-05-quinton-jackson'],components:[1.88,1.35,0.90,0.85]},
  'Rashad Evans':{score:4.99,current:5.00,difference:-0.01,pair:['2008-09-06-chuck-liddell','2008-12-27-forrest-griffin'],components:[1.89,1.35,0.90,0.85]},
  'Mauricio "Shogun" Rua':{score:4.81,current:4.80,difference:0.01,pair:['2009-04-18-chuck-liddell','2010-05-08-lyoto-machida'],components:[1.86,1.30,0.90,0.75]},
  'Khamzat Chimaev':{score:5.17,current:4.35,difference:0.82,pair:['2024-10-26-robert-whittaker','2025-08-16-dricus-du-plessis'],components:[1.97,1.45,0.95,0.80]},
  'Valentina Shevchenko':{score:5.19,current:4.70,difference:0.49,pair:['2020-02-08-katlyn-chookagian','2021-04-24-jessica-andrade'],components:[1.89,1.40,1.15,0.75]},
  'Daniel Cormier':{score:5.06,current:4.65,difference:0.41,pair:['2018-01-20-volkan-oezdemir','2018-07-07-stipe-miocic'],components:[1.91,1.45,0.95,0.75]},
  'Rose Namajunas':{score:5.08,current:4.64,difference:0.44,pair:['2017-11-04-joanna-jedrzejczyk','2018-04-07-joanna-jedrzejczyk'],components:[1.93,1.60,0.85,0.70]},
  'Joanna Jedrzejczyk':{score:5.04,current:4.60,difference:0.44,pair:['2015-03-14-carla-esparza','2016-07-08-claudia-gadelha'],components:[1.89,1.45,1.00,0.70]},
  'T.J. Dillashaw':{score:4.85,current:4.55,difference:0.30,pair:['2017-11-04-cody-garbrandt','2018-08-04-cody-garbrandt'],components:[1.90,1.45,0.85,0.65]},
  'Junior dos Santos':{score:4.97,current:4.49,difference:0.48,pair:['2011-06-11-shane-carwin','2011-11-12-cain-velasquez'],components:[1.92,1.45,0.90,0.70]},
  'Tyron Woodley':{score:4.69,current:4.37,difference:0.32,pair:['2016-07-30-robbie-lawler','2017-03-04-stephen-thompson'],components:[1.84,1.35,0.85,0.65]},
  'Cain Velasquez':{score:5.45,current:4.25,difference:1.20,pair:['2012-12-29-junior-dos-santos','2013-10-19-junior-dos-santos'],components:[1.95,1.50,1.10,0.90]},
  'Tony Ferguson':{score:4.90,current:4.19,difference:0.71,pair:['2016-11-05-rafael-dos-anjos','2017-10-07-kevin-lee'],components:[1.85,1.35,0.80,0.90]}
};

for(const [fighter,target] of Object.entries(expected)){
  const row=report.entryFor(fighter);
  assert.ok(row,`${fighter} must appear in the reconstruction`);
  assert.equal(row.judgmentStatus,'cody-approved');
  assert.equal(row.reconstructedScore,target.score,`${fighter} approved score`);
  assert.equal(row.currentScore,target.current,`${fighter} frozen control`);
  assert.equal(row.difference,target.difference,`${fighter} shadow delta`);
  assert.deepEqual(JSON.parse(JSON.stringify(row.stats.performances.map(performance=>performance.matchedFightId))),target.pair,`${fighter} exact approved fight IDs`);
  assert.ok(row.stats.performances.every(performance=>performance.validUfcWin),`${fighter} must use two counted UFC wins`);
  assert.equal(row.stats.windowCheck?.passed,true,`${fighter} must fit the 24-month window`);
  assert.deepEqual([row.stats.components.twoPerformanceStrength,row.stats.components.proof,row.stats.components.bestFighterClaim,row.stats.components.aura],target.components,`${fighter} explicit components`);
  assert.equal(row.stats.formulaTwoPerformanceStrength,target.components[0],`${fighter} mechanical component`);
  assert.equal(row.stats.componentScore,target.score,`${fighter} components must reconcile`);
  assert.equal(row.stats.manualNumericAdjustment,0);
  assert.deepEqual(JSON.parse(JSON.stringify(row.stats.issues)),[],`${fighter} approved row should be clean`);
}

assert.equal(report.exactFrozenControlParityCount,56);
assert.equal(report.scoreDeltaCount,16);
assert.equal(report.selectionIssueFighterCount,8);
assert.equal(report.formulaIssueFighterCount,0);
assert.equal(report.twentyFourMonthViolationCount,8);
assert.equal(report.invalidSelectedPerformanceCount,0);
assert.equal(report.pendingReviewCount,25);
assert.equal(report.missingAuditCount,1);
assert.equal(report.entryFor('Leon Edwards').reconstructedScore,null);

const clean=value=>JSON.parse(JSON.stringify(value,(key,nested)=>typeof nested==='function'?undefined:nested));
await fs.mkdir('docs',{recursive:true});
await fs.writeFile('docs/canonical-apex-reconstruction.json',`${JSON.stringify(clean(report),null,2)}\n`,'utf8');
const approvedRows=approved.rows.map(item=>report.entryFor(item.fighter)).filter(Boolean);
const leaders=report.fighters.filter(row=>Number.isFinite(row.reconstructedScore)).slice(0,20);
const markdown=[
  '# Canonical Apex Peak Reconstruction — Approved Through Batch Two','',
  `- Fighters audited: **${report.fighterCount}**`,
  `- Cody-approved judgments encoded: **${approvedRows.length}**`,
  `- Approved shadow score deltas: **${report.scoreDeltaCount}**`,
  `- Selected-performance issues remaining: **${report.selectionIssueFighterCount}**`,
  `- 24-month violations remaining: **${report.twentyFourMonthViolationCount}**`,
  `- Component-formula issues remaining: **${report.formulaIssueFighterCount}**`,
  `- Pending review rows: **${report.pendingReviewCount}**`,
  `- Live ranking payload changed: **${report.liveDataUnchanged?'No':'Yes'}**`,'',
  '## Approved judgments','',
  '| Fighter | Frozen | Approved | Delta | Pair | Two-performance | Proof | Claim | Aura | Classification |',
  '|---|---:|---:|---:|---|---:|---:|---:|---:|---|',
  ...approvedRows.map(row=>`| ${row.fighter} | ${row.currentScore.toFixed(2)} | ${row.reconstructedScore.toFixed(2)} | ${row.difference>=0?'+':''}${row.difference.toFixed(2)} | ${row.auditWindow} | ${row.stats.components.twoPerformanceStrength.toFixed(2)} | ${row.stats.components.proof.toFixed(2)} | ${row.stats.components.bestFighterClaim.toFixed(2)} | ${row.stats.components.aura.toFixed(2)} | ${row.judgmentClassification} |`),
  '',
  '## Reconstructed Apex leaders','',
  '| Rank | Fighter | Apex | Pair |',
  '|---:|---|---:|---|',
  ...leaders.map((row,index)=>`| ${index+1} | ${row.fighter} | ${row.reconstructedScore.toFixed(2)} | ${row.auditWindow||'—'} |`),
  '',
  'This remains shadow-only. No live category score, total, rank, OVR, profile, or Compare Mode value was changed.',''
].join('\n');
await fs.writeFile('docs/canonical-apex-reconstruction.md',markdown,'utf8');

console.log('CANONICAL_APEX_RECONSTRUCTION_APPROVED_BATCH_TWO');
console.log(JSON.stringify({approvedVersion:approved.version,approvedCount:approved.fighterCount,scoreDeltaCount:report.scoreDeltaCount,selectionIssueFighterCount:report.selectionIssueFighterCount,twentyFourMonthViolationCount:report.twentyFourMonthViolationCount,formulaIssueFighterCount:report.formulaIssueFighterCount,pendingReviewCount:report.pendingReviewCount,liveDataUnchanged:report.liveDataUnchanged},null,2));

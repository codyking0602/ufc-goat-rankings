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
  'assets/data/canonical-apex-approved-judgments-batch-three.js'
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
assert.equal(approved?.fighterCount,29,'Approved Apex registry should contain all three review batches');
assert.equal(approved?.mutatesRankingData,false);
assert.equal(approved?.mutatesScores,false);
assert.equal(report?.applied,true);
assert.equal(report.fighterCount,73);
assert.equal(report.liveDataUnchanged,true);
assert.equal(JSON.stringify(context.window.RANKING_DATA),liveBefore,'Approved Apex batches must not modify live ranking data');

const expected={
  'Alexa Grasso':{score:4.50,current:4.08,difference:0.42,pair:['2022-10-15-viviane-araujo','2023-03-04-valentina-shevchenko'],components:[1.85,1.30,0.70,0.65]},
  'Dustin Poirier':{score:4.94,current:4.07,difference:0.87,pair:['2018-04-14-justin-gaethje','2019-04-13-max-holloway'],components:[1.89,1.55,0.75,0.75]},
  'Julianna Peña':{score:4.65,current:4.02,difference:0.63,pair:['2021-01-24-sara-mcmann','2021-12-11-amanda-nunes'],components:[1.85,1.25,0.75,0.80]},
  'Matt Hughes':{score:5.39,current:3.80,difference:1.59,pair:['2004-10-22-georges-st-pierre','2005-04-16-frank-trigg'],components:[1.89,1.50,1.10,0.90]},
  'Jose Aldo':{score:4.96,current:3.79,difference:1.17,pair:['2013-02-02-frankie-edgar','2014-10-25-chad-mendes'],components:[1.91,1.55,1.00,0.50]},
  'Dan Henderson':{score:4.47,current:3.76,difference:0.71,pair:['2009-01-17-rich-franklin','2009-07-11-michael-bisping'],components:[1.82,1.20,0.55,0.90]},
  'Mackenzie Dern':{score:4.10,current:3.46,difference:0.64,pair:['2025-01-11-amanda-ribas','2025-10-25-virna-jandiroba'],components:[1.80,1.10,0.60,0.60]},
  'Carla Esparza':{score:3.92,current:3.31,difference:0.61,pair:['2021-05-22-yan-xiaonan','2022-05-07-rose-namajunas'],components:[1.72,1.15,0.65,0.40]},
  'Leon Edwards':{score:4.11,current:null,difference:null,pair:['2022-08-20-kamaru-usman','2023-03-18-kamaru-usman'],components:[1.56,1.70,0.50,0.35]}
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

assert.equal(report.exactFrozenControlParityCount,48);
assert.equal(report.scoreDeltaCount,24);
assert.equal(report.selectionIssueFighterCount,0);
assert.equal(report.formulaIssueFighterCount,0);
assert.equal(report.twentyFourMonthViolationCount,0);
assert.equal(report.invalidSelectedPerformanceCount,0);
assert.equal(report.pendingReviewCount,25,'Only approved score deltas plus Leon missing frozen control should remain non-parity');
assert.equal(report.missingAuditCount,0);
assert.equal(report.missingControlCount,1);
assert.equal(report.entryFor('Leon Edwards').status,'missing-control');

const clean=value=>JSON.parse(JSON.stringify(value,(key,nested)=>typeof nested==='function'?undefined:nested));
await fs.mkdir('docs',{recursive:true});
await fs.writeFile('docs/canonical-apex-reconstruction.json',`${JSON.stringify(clean(report),null,2)}\n`,'utf8');
const approvedRows=approved.rows.map(item=>report.entryFor(item.fighter)).filter(Boolean);
const leaders=report.fighters.filter(row=>Number.isFinite(row.reconstructedScore)).slice(0,25);
const markdown=[
  '# Canonical Apex Peak Reconstruction — All Review Batches Approved','',
  `- Fighters audited: **${report.fighterCount}**`,
  `- Cody-approved judgments encoded: **${approvedRows.length}**`,
  `- Missing Apex judgments: **${report.missingAuditCount}**`,
  `- Selected-performance issues remaining: **${report.selectionIssueFighterCount}**`,
  `- 24-month violations remaining: **${report.twentyFourMonthViolationCount}**`,
  `- Component-formula issues remaining: **${report.formulaIssueFighterCount}**`,
  `- Approved shadow score deltas: **${report.scoreDeltaCount}**`,
  `- Missing frozen controls: **${report.missingControlCount}**`,
  `- Live ranking payload changed: **${report.liveDataUnchanged?'No':'Yes'}**`,'',
  '## Approved judgments','',
  '| Fighter | Frozen | Approved | Delta | Pair | Two-performance | Proof | Claim | Aura | Classification |',
  '|---|---:|---:|---:|---|---:|---:|---:|---:|---|',
  ...approvedRows.map(row=>`| ${row.fighter} | ${row.currentScore===null?'—':row.currentScore.toFixed(2)} | ${row.reconstructedScore.toFixed(2)} | ${row.difference===null?'—':`${row.difference>=0?'+':''}${row.difference.toFixed(2)}`} | ${row.auditWindow} | ${row.stats.components.twoPerformanceStrength.toFixed(2)} | ${row.stats.components.proof.toFixed(2)} | ${row.stats.components.bestFighterClaim.toFixed(2)} | ${row.stats.components.aura.toFixed(2)} | ${row.judgmentClassification} |`),
  '',
  '## Reconstructed Apex leaders','',
  '| Rank | Fighter | Apex | Pair |',
  '|---:|---|---:|---|',
  ...leaders.map((row,index)=>`| ${index+1} | ${row.fighter} | ${row.reconstructedScore.toFixed(2)} | ${row.auditWindow||'—'} |`),
  '',
  'All factual pair, 24-month-window, and component-formula review issues are resolved. Approved score deltas remain shadow comparisons against the frozen live controls.','',
  'This remains shadow-only. No live category score, total, rank, OVR, profile, or Compare Mode value was changed.',''
].join('\n');
await fs.writeFile('docs/canonical-apex-reconstruction.md',markdown,'utf8');

console.log('CANONICAL_APEX_RECONSTRUCTION_ALL_REVIEW_BATCHES_APPROVED');
console.log(JSON.stringify({approvedVersion:approved.version,approvedCount:approved.fighterCount,scoreDeltaCount:report.scoreDeltaCount,selectionIssueFighterCount:report.selectionIssueFighterCount,twentyFourMonthViolationCount:report.twentyFourMonthViolationCount,formulaIssueFighterCount:report.formulaIssueFighterCount,missingAuditCount:report.missingAuditCount,missingControlCount:report.missingControlCount,pendingReviewCount:report.pendingReviewCount,liveDataUnchanged:report.liveDataUnchanged},null,2));

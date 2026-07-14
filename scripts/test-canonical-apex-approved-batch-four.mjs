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

const report=context.window.UFC_CANONICAL_APEX_RECONSTRUCTION;
const approved=context.window.UFC_CANONICAL_APEX_APPROVED_JUDGMENTS;
assert.equal(approved?.fighterCount,36,'Approved Apex registry should include the seven leaderboard calibrations');
assert.equal(report?.applied,true);
assert.equal(report.fighterCount,73);
assert.equal(report.liveDataUnchanged,true);
assert.equal(JSON.stringify(context.window.RANKING_DATA),liveBefore,'Leaderboard calibration must remain shadow-only');

const expected={
  'Israel Adesanya':{score:5.12,current:4.77,difference:0.35,pair:['2019-10-05-robert-whittaker','2020-09-26-paulo-costa'],components:[1.87,1.40,1.10,0.75]},
  'Max Holloway':{score:4.89,current:4.74,difference:0.15,pair:['2017-06-03-jose-aldo','2018-12-08-brian-ortega'],components:[1.89,1.45,0.85,0.70]},
  'Chuck Liddell':{score:5.27,current:4.87,difference:0.40,pair:['2005-04-16-randy-couture','2006-12-30-tito-ortiz'],components:[1.82,1.40,1.15,0.90]},
  'Stipe Miocic':{score:5.01,current:4.76,difference:0.25,pair:['2016-05-14-fabricio-werdum','2018-01-20-francis-ngannou'],components:[1.86,1.50,0.95,0.70]},
  'Randy Couture':{score:4.42,current:3.37,difference:1.05,pair:['2007-03-03-tim-sylvia','2007-08-25-gabriel-gonzaga'],components:[1.72,1.25,0.75,0.70]},
  'Charles Oliveira':{score:4.84,current:4.60,difference:0.24,pair:['2021-12-11-dustin-poirier','2022-05-07-justin-gaethje'],components:[1.84,1.60,0.80,0.60]},
  'Merab Dvalishvili':{score:4.30,current:4.00,difference:0.30,pair:['2024-09-14-sean-o-malley','2025-01-18-umar-nurmagomedov'],components:[1.85,1.40,0.60,0.45]}
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

assert.equal(report.selectionIssueFighterCount,0);
assert.equal(report.formulaIssueFighterCount,0);
assert.equal(report.twentyFourMonthViolationCount,0);
assert.equal(report.invalidSelectedPerformanceCount,0);
assert.equal(report.missingAuditCount,0);
assert.equal(report.missingControlCount,1);
assert.equal(report.exactFrozenControlParityCount,41);
assert.equal(report.scoreDeltaCount,31);
assert.equal(report.pendingReviewCount,32);

const clean=value=>JSON.parse(JSON.stringify(value,(key,nested)=>typeof nested==='function'?undefined:nested));
await fs.mkdir('docs',{recursive:true});
await fs.writeFile('docs/canonical-apex-reconstruction.json',`${JSON.stringify(clean(report),null,2)}\n`,'utf8');
const approvedRows=approved.rows.map(item=>report.entryFor(item.fighter)).filter(Boolean);
const leaders=report.fighters.filter(row=>Number.isFinite(row.reconstructedScore)).slice(0,30);
const markdown=[
  '# Canonical Apex Peak Reconstruction — Leaderboard Calibration Approved','',
  `- Fighters audited: **${report.fighterCount}**`,
  `- Cody-approved judgments encoded: **${approvedRows.length}**`,
  `- Missing Apex judgments: **${report.missingAuditCount}**`,
  `- Selected-performance issues remaining: **${report.selectionIssueFighterCount}**`,
  `- 24-month violations remaining: **${report.twentyFourMonthViolationCount}**`,
  `- Component-formula issues remaining: **${report.formulaIssueFighterCount}**`,
  `- Approved shadow score deltas: **${report.scoreDeltaCount}**`,
  `- Live ranking payload changed: **${report.liveDataUnchanged?'No':'Yes'}**`,'',
  '## Reconstructed Apex leaders','',
  '| Rank | Fighter | Apex | Pair |',
  '|---:|---|---:|---|',
  ...leaders.map((row,index)=>`| ${index+1} | ${row.fighter} | ${row.reconstructedScore.toFixed(2)} | ${row.auditWindow||'—'} |`),
  '',
  'All factual pair, 24-month-window, and component-formula review issues remain resolved after the approved leaderboard calibration.','',
  'This remains shadow-only. No live category score, total, rank, OVR, profile, or Compare Mode value was changed.',''
].join('\n');
await fs.writeFile('docs/canonical-apex-reconstruction.md',markdown,'utf8');

console.log('CANONICAL_APEX_LEADERBOARD_CALIBRATION_APPROVED');
console.log(JSON.stringify({approvedVersion:approved.version,approvedCount:approved.fighterCount,scoreDeltaCount:report.scoreDeltaCount,selectionIssueFighterCount:report.selectionIssueFighterCount,twentyFourMonthViolationCount:report.twentyFourMonthViolationCount,formulaIssueFighterCount:report.formulaIssueFighterCount,missingAuditCount:report.missingAuditCount,missingControlCount:report.missingControlCount,pendingReviewCount:report.pendingReviewCount,liveDataUnchanged:report.liveDataUnchanged},null,2));
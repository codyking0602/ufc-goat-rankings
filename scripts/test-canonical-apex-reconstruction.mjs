import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const reconstructionFile='assets/data/canonical-apex-reconstruction.js';
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
  'assets/data/canonical-apex-approved-judgments.js'
];

const attributes={};
const document={body:null,documentElement:{setAttribute(name,value){attributes[name]=value;}},querySelector(){return null;},querySelectorAll(){return[];}};
const window={};
const context=vm.createContext({window,document,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});

// The exact runtime snapshot remains frozen audit evidence only. Approved judgments are read from
// the dedicated shadow layer and never overwrite the live runtime payload.
const runtimeSnapshot=JSON.parse(await fs.readFile('docs/runtime-scoring-snapshot.json','utf8'));
assert.equal(runtimeSnapshot?.summary?.status,'clean','Recovered runtime evidence must come from a clean snapshot');
assert.equal(runtimeSnapshot?.fighters?.length,72,'The runtime evidence snapshot should cover all 72 live-board fighters');
context.window.RANKING_DATA.fighters=context.window.RANKING_DATA.fighters||[];
const normalized=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
for(const snapshotRow of runtimeSnapshot.fighters){
  const existing=[...(context.window.RANKING_DATA.men||[]),...(context.window.RANKING_DATA.women||[]),...(context.window.RANKING_DATA.fighters||[])].find(row=>normalized(row?.fighter)===normalized(snapshotRow?.fighter));
  if(existing)existing.apexPeakAudit=JSON.parse(JSON.stringify(snapshotRow.apexPeakAudit));
  else context.window.RANKING_DATA.fighters.push({fighter:snapshotRow.fighter,apexPeakAudit:JSON.parse(JSON.stringify(snapshotRow.apexPeakAudit))});
}
const liveBefore=JSON.stringify(context.window.RANKING_DATA);
vm.runInContext(await fs.readFile(reconstructionFile,'utf8'),context,{filename:reconstructionFile});

const report=context.window.UFC_CANONICAL_APEX_RECONSTRUCTION;
const approved=context.window.UFC_CANONICAL_APEX_APPROVED_JUDGMENTS;
assert.equal(approved?.fighterCount,6,'Approved Apex batch one should contain six fighters');
assert.equal(approved?.mutatesRankingData,false);
assert.equal(approved?.mutatesScores,false);
assert.equal(report?.applied,true,'Apex reconstruction should calculate successfully');
assert.equal(report.fighterCount,73,'All 73 canonical fighters must appear in the Apex audit');
assert.equal(report.auditedFighterCount,72,'The 72 existing live-board fighters should retain explicit Apex ownership');
assert.equal(report.missingAuditCount,1,'Leon Edwards should remain the only missing Apex judgment');
assert.equal(report.controlCoverage,72,'The frozen canonical snapshot covers the 72 live-board fighters');
assert.equal(report.missingControlCount,1,'Leon Edwards should remain the only missing frozen Apex control');
assert.deepEqual(JSON.parse(JSON.stringify(report.missingAudits.map(row=>row.fighter))),['Leon Edwards']);
assert.deepEqual(JSON.parse(JSON.stringify(report.missingControls.map(row=>row.fighter))),['Leon Edwards']);
assert.equal(report.liveDataUnchanged,true);
assert.equal(JSON.stringify(context.window.RANKING_DATA),liveBefore,'The approved shadow layer must not modify the runtime ranking payload');
assert.equal(report.mutatesRankingData,false);
assert.equal(report.mutatesScores,false);
assert.equal(report.rules.totalMax,6);
assert.equal(report.rules.twoPerformanceStrengthMax,2);
assert.equal(report.rules.proofMax,1.75);
assert.equal(report.rules.bestFighterClaimMax,1.25);
assert.equal(report.rules.auraMax,1);
assert.match(report.formula,/two counted UFC wins/i);
assert.match(report.formula,/24 months/i);

const expected={
  'Glover Teixeira':{score:4.25,current:4.80,difference:-0.55,pair:['2020-11-07-thiago-santos','2021-10-30-jan-b-achowicz'],components:[1.85,1.30,0.60,0.50]},
  'Royce Gracie':{score:5.30,current:5.40,difference:-0.10,pair:['1993-11-12-ken-shamrock','1994-12-16-dan-severn'],components:[1.85,1.20,1.25,1.00]},
  'Deiveson Figueiredo':{score:4.38,current:4.38,difference:0,pair:['2020-07-19-joseph-benavidez-ii','2020-11-21-alex-perez'],components:[1.83,1.15,0.75,0.65]},
  'Frank Shamrock':{score:5.39,current:5.40,difference:-0.01,pair:['1997-12-21-kevin-jackson','1999-09-24-tito-ortiz'],components:[1.84,1.45,1.15,0.95]},
  'Benson Henderson':{score:4.58,current:4.60,difference:-0.02,pair:['2012-02-26-frankie-edgar-i','2012-12-08-nate-diaz'],components:[1.83,1.35,0.80,0.60]},
  'Fabricio Werdum':{score:5.17,current:5.20,difference:-0.03,pair:['2014-11-15-mark-hunt','2015-06-13-cain-velasquez'],components:[1.87,1.45,1.00,0.85]}
};

for(const [fighter,target] of Object.entries(expected)){
  const row=report.entryFor(fighter);
  assert.ok(row,`${fighter} must appear in the reconstruction`);
  assert.equal(row.judgmentStatus,'cody-approved');
  assert.equal(row.reconstructedScore,target.score,`${fighter} approved Apex score`);
  assert.equal(row.currentScore,target.current,`${fighter} frozen score remains visible as control evidence`);
  assert.equal(row.difference,target.difference,`${fighter} approved shadow delta`);
  assert.deepEqual(JSON.parse(JSON.stringify(row.stats.performances.map(performance=>performance.matchedFightId))),target.pair,`${fighter} exact approved fight IDs`);
  assert.ok(row.stats.performances.every(performance=>performance.validUfcWin),`${fighter} must use two counted UFC wins`);
  assert.equal(row.stats.windowCheck?.passed,true,`${fighter} pair must fit the 24-month window`);
  assert.deepEqual([
    row.stats.components.twoPerformanceStrength,
    row.stats.components.proof,
    row.stats.components.bestFighterClaim,
    row.stats.components.aura
  ],target.components,`${fighter} explicit components`);
  assert.equal(row.stats.formulaTwoPerformanceStrength,target.components[0],`${fighter} mechanical component must come from the ratings formula`);
  assert.equal(row.stats.componentScore,target.score,`${fighter} components must reconcile to the final score`);
  assert.equal(row.stats.manualNumericAdjustment,0,`${fighter} cannot contain a hidden numeric adjustment`);
  assert.deepEqual(JSON.parse(JSON.stringify(row.stats.issues)),[],`${fighter} approved row should be clean`);
}

assert.equal(report.exactFrozenControlParityCount,68,'Four approved score changes should move outside the 0.01 parity tolerance');
assert.equal(report.scoreDeltaCount,4,'Glover, Royce, Benson, and Werdum should be explicit score deltas');
assert.deepEqual(JSON.parse(JSON.stringify(report.scoreDeltas.map(row=>row.fighter).sort())),['Benson Henderson','Fabricio Werdum','Glover Teixeira','Royce Gracie']);
assert.equal(report.selectionIssueFighterCount,18,'The three approved factual pair corrections should leave the remaining review queue intact');
assert.equal(report.formulaIssueFighterCount,5,'Five approved component recoveries should be removed from the formula queue');
assert.equal(report.invalidSelectedPerformanceCount,0,'All previously invalid selected performances are corrected in approved batch one');
assert.equal(report.twentyFourMonthViolationCount,18,'Batch one does not alter the remaining 24-month review queue');
assert.equal(report.pendingReviewCount,27,'Deiveson and Frank should leave the pending queue; approved score deltas remain visible for later promotion');

for(const row of report.fighters.filter(row=>row.reconstructedScore!==null&&Number.isFinite(row.reconstructedScore))){
  assert.ok(row.reconstructedScore>=0&&row.reconstructedScore<=6,`${row.fighter} Apex score must stay within 0–6`);
  assert.equal(row.stats.performances.length,2,`${row.fighter} should have two selected performances in the recovered or approved audit`);
  assert.equal(row.stats.manualNumericAdjustment,0);
}

assert.equal(report.entryFor('Jon Jones').reconstructedScore,6);
assert.equal(report.entryFor('Khabib Nurmagomedov').reconstructedScore,6);
assert.equal(report.entryFor('Amanda Nunes').reconstructedScore,6);
assert.equal(report.entryFor('Georges St-Pierre').reconstructedScore,5.56);
assert.equal(report.entryFor('Demetrious Johnson').reconstructedScore,5.15);
assert.equal(report.entryFor('Leon Edwards').reconstructedScore,null);

const clean=value=>JSON.parse(JSON.stringify(value,(key,nested)=>typeof nested==='function'?undefined:nested));
await fs.mkdir('docs',{recursive:true});
await fs.writeFile('docs/canonical-apex-reconstruction.json',`${JSON.stringify(clean(report),null,2)}\n`,'utf8');

const leaders=report.fighters.filter(row=>row.reconstructedScore!==null&&Number.isFinite(row.reconstructedScore)).slice(0,15);
const approvedRows=Object.keys(expected).map(fighter=>report.entryFor(fighter));
const markdown=[
  '# Canonical Apex Peak Reconstruction — Approved Batch One','',
  `- Fighters audited: **${report.fighterCount}**`,
  `- Cody-approved judgments encoded: **${approvedRows.length}**`,
  `- Existing Apex judgments recovered: **${report.auditedFighterCount}/${report.fighterCount}**`,
  `- Missing Apex judgment: **${report.missingAudits.map(row=>row.fighter).join(', ')||'None'}**`,
  `- Frozen controls available: **${report.controlCoverage}/${report.fighterCount}**`,
  `- Approved shadow score deltas: **${report.scoreDeltaCount}**`,
  `- Fighters with selected-performance issues remaining: **${report.selectionIssueFighterCount}**`,
  `- 24-month violations remaining: **${report.twentyFourMonthViolationCount}**`,
  `- Invalid selected performances remaining: **${report.invalidSelectedPerformanceCount}**`,
  `- Fighters with component-formula issues remaining: **${report.formulaIssueFighterCount}**`,
  `- Pending review rows: **${report.pendingReviewCount}**`,
  `- Live ranking payload changed: **${report.liveDataUnchanged?'No':'Yes'}**`,'',
  '## Locked model','',
  `**${report.formula}**`,'',
  '## Approved batch one','',
  '| Fighter | Frozen | Approved | Delta | Pair | Two-performance | Proof | Claim | Aura | Classification |',
  '|---|---:|---:|---:|---|---:|---:|---:|---:|---|',
  ...approvedRows.map(row=>`| ${row.fighter} | ${row.currentScore.toFixed(2)} | ${row.reconstructedScore.toFixed(2)} | ${row.difference>=0?'+':''}${row.difference.toFixed(2)} | ${row.auditWindow} | ${row.stats.components.twoPerformanceStrength.toFixed(2)} | ${row.stats.components.proof.toFixed(2)} | ${row.stats.components.bestFighterClaim.toFixed(2)} | ${row.stats.components.aura.toFixed(2)} | ${row.judgmentClassification} |`),
  '',
  '## Reconstructed Apex leaders','',
  '| Rank | Fighter | Apex | Pair | Two-performance | Proof | Claim | Aura |',
  '|---:|---|---:|---|---:|---:|---:|---:|',
  ...leaders.map((row,index)=>`| ${index+1} | ${row.fighter} | ${row.reconstructedScore.toFixed(2)} | ${row.auditWindow||'—'} | ${row.stats.components.twoPerformanceStrength.toFixed(2)} | ${row.stats.components.proof.toFixed(2)} | ${row.stats.components.bestFighterClaim.toFixed(2)} | ${row.stats.components.aura.toFixed(2)} |`),
  '',
  'This remains a shadow reconstruction only. It does not write Apex scores, total scores, ranks, OVRs, profile values, or Compare Mode values into the live app.',''
].join('\n');
await fs.writeFile('docs/canonical-apex-reconstruction.md',markdown,'utf8');

console.log('CANONICAL_APEX_RECONSTRUCTION_APPROVED_BATCH_ONE');
console.log(JSON.stringify({
  version:report.version,
  approvedVersion:approved.version,
  fighterCount:report.fighterCount,
  auditedFighterCount:report.auditedFighterCount,
  approvedFighters:approvedRows.map(row=>({fighter:row.fighter,currentScore:row.currentScore,reconstructedScore:row.reconstructedScore,difference:row.difference,classification:row.judgmentClassification,pair:row.stats.performances.map(performance=>performance.matchedFightId),components:row.stats.components})),
  scoreDeltaCount:report.scoreDeltaCount,
  selectionIssueFighterCount:report.selectionIssueFighterCount,
  twentyFourMonthViolationCount:report.twentyFourMonthViolationCount,
  invalidSelectedPerformanceCount:report.invalidSelectedPerformanceCount,
  formulaIssueFighterCount:report.formulaIssueFighterCount,
  pendingReviewCount:report.pendingReviewCount,
  liveDataUnchanged:report.liveDataUnchanged
},null,2));

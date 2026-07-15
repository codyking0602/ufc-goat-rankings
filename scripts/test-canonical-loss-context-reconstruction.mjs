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
  'assets/data/fighter-era-ledgers.js',
  'assets/data/fighter-era-ledger-approved-longevity-resolutions.js',
  'assets/data/fighter-era-ledger-approved-loss-context-resolutions.js',
  'assets/data/canonical-loss-context-approved-resolutions.js',
  'assets/data/canonical-loss-context-reconstruction.js'
];

const attributes={};
const document={body:null,documentElement:{setAttribute(name,value){attributes[name]=value;}},querySelector(){return null;},querySelectorAll(){return[];}};
const window={};
const context=vm.createContext({window,document,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});

const report=context.window.UFC_CANONICAL_LOSS_CONTEXT_RECONSTRUCTION;
const approval=context.window.UFC_CANONICAL_LOSS_CONTEXT_APPROVED_RESOLUTIONS;
const era=context.window.UFC_FIGHTER_ERA_LEDGERS;
const near=(actual,expected,tolerance=.05,message='')=>assert.ok(Math.abs(Number(actual)-Number(expected))<=tolerance,`${message} expected ${expected}, received ${actual}`);

assert.equal(report?.applied,true,'Loss Context reconstruction should calculate successfully');
assert.equal(approval?.applied,true,'Approved Loss Context decisions should load');
assert.equal(report.fighterCount,73);
assert.equal(report.scoredFighterCount,73);
assert.equal(report.eraLedgerCoverage,73);
assert.equal(report.controlCoverage,72);
assert.equal(report.effectiveControlCoverage,73);
assert.equal(report.approvedResolutionCount,11,'All eleven Cody-approved decisions must be present');
assert.equal(report.approvedResolutionMismatchCount,0);
assert.equal(report.unresolvedDecisionCount,0);
assert.equal(report.phaseSource,'fighter-era-ledgers');
assert.equal(report.categoryLocalPrimeWindowControlsScore,false);
assert.equal(report.rules.prePrimeElite,-0.75);
assert.equal(report.rules.prePrimeNonElite,-1.25);
assert.equal(report.rules.primeElite,-1.5);
assert.equal(report.rules.primeNonElite,-4);
assert.equal(report.rules.finishedCountedLossExtra,-0.75);
assert.equal(report.rules.postPrime,0);
assert.equal(report.rules.primeUpwardElite,-0.75);
assert.equal(report.rules.primeUpwardEliteFinishedExtra,-0.5);
assert.equal(report.rules.severityLossCount,2);
assert.equal(report.rules.severityMax,3.5);
assert.equal(report.rules.frequencyMax,2.5);
assert.equal(report.rules.frequencyScale,3);
assert.equal(report.rules.primeLossFloorPerLoss,.75);
assert.equal(report.rules.primeFinishFloorExtra,.25);
assert.equal(report.rules.totalMax,6);
assert.equal(report.rules.divisionDiscountMax,.15);
assert.equal(report.liveDataUnchanged,true);
assert.equal(report.mutatesRankingData,false);
assert.equal(report.mutatesPenalty,false);
assert.match(report.formula,/two worst losses/i);
assert.match(report.formula,/loss burden per UFC fight through prime/i);

const names=['Jon Jones','Georges St-Pierre','Khabib Nurmagomedov','Alexander Volkanovski','Anderson Silva','B.J. Penn','Leon Edwards','Tito Ortiz','Miesha Tate','Petr Yan','Randy Couture','Israel Adesanya','Chael Sonnen','Sean Strickland','Jessica Andrade','Francis Ngannou','Benson Henderson','Henry Cejudo'];
const rows=Object.fromEntries(names.map(name=>[name,report.entryFor(name)]));
for(const [name,row] of Object.entries(rows)){
  assert.ok(row,`${name} must appear in the audit`);
  assert.ok(Number.isFinite(row.reconstructedPenalty));
  assert.ok(row.reconstructedPenalty<=0&&row.reconstructedPenalty>=-6);
  assert.equal(row.stats.phaseSource,'fighter-era-ledgers');
  assert.equal(row.stats.categoryLocalPrimeWindowUsed,false);
  assert.equal(row.stats.manualNumericAdjustment,0);
}

const jones=rows['Jon Jones'];
assert.equal(jones.reconstructedPenalty,0);
const hamill=jones.stats.events.find(event=>/hamill/i.test(event.opponent));
assert.ok(hamill);
assert.equal(hamill.technicalException,true);
assert.equal(hamill.penaltyEligible,false);
assert.equal(hamill.rawPenalty,0);
assert.equal(rows['Khabib Nurmagomedov'].reconstructedPenalty,0);
near(rows['Georges St-Pierre'].reconstructedPenalty,-3.78,.08,'GSP reconstructed hybrid penalty');
assert.equal(rows['Georges St-Pierre'].stats.exposure.count,22);
assert.ok(rows['Alexander Volkanovski'].stats.countedEvents.filter(event=>event.upwardDivision).length>=2);
assert.ok(rows['Anderson Silva'].stats.events.some(event=>event.phase==='post-prime'));
assert.ok(rows['B.J. Penn'].stats.events.some(event=>event.phase==='post-prime'));
assert.ok(rows['Petr Yan'].stats.events.some(event=>event.technicalException||event.competitive===false));

assert.equal(era.entryFor('Randy Couture').window.start,'1997-05-30');
assert.equal(rows['Randy Couture'].approvedPenalty,-5.25);
assert.equal(rows['Randy Couture'].resolvedByApproval,true);
assert.equal(era.entryFor('Israel Adesanya').window.end,'2024-08-18');
assert.equal(rows['Israel Adesanya'].approvedPenalty,-3.52);
assert.equal(rows['Israel Adesanya'].resolvedByApproval,true);
assert.equal(era.entryFor('Sean Strickland').window.start,'2021-07-31');
assert.equal(rows['Sean Strickland'].approvedPenalty,-3.42);
assert.equal(rows['Sean Strickland'].resolvedByApproval,true);

const cejudo=rows['Henry Cejudo'];
const cejudoLedger=era.entryFor('Henry Cejudo');
assert.equal(cejudoLedger.window.start,'2018-08-04');
assert.equal(cejudoLedger.window.startLabel,'Demetrious Johnson II');
assert.equal(cejudoLedger.window.end,'2020-05-09');
assert.equal(cejudoLedger.window.endLabel,'Dominick Cruz');
assert.equal(cejudoLedger.window.endType,'retirement_win');
assert.equal(cejudo.stats.exposure.endpoint,'2020-05-09');
assert.equal(cejudo.stats.exposure.count,12);
assert.equal(cejudo.stats.primeLossCount,0);
assert.equal(cejudo.reconstructedPenalty,-1.69);
assert.equal(cejudo.approvedPenalty,-1.69);
assert.equal(cejudo.resolvedByApproval,true);
for(const opponent of ['Aljamain Sterling','Merab Dvalishvili','Song Yadong','Payton Talbott']){
  const event=cejudo.stats.events.find(row=>row.opponent===opponent);
  assert.ok(event,`${opponent} loss must remain visible`);
  assert.equal(event.phase,'post-prime');
  assert.equal(event.rawPenalty,0);
}

const approvedClean={
  'Chael Sonnen':-4.75,
  'Jessica Andrade':-4.08,
  'Miesha Tate':-4.50,
  'Francis Ngannou':-1.07,
  'Tito Ortiz':-3.82,
  'Benson Henderson':-3.26,
  'Leon Edwards':-2.61,
  'Henry Cejudo':-1.69
};
for(const [fighter,score] of Object.entries(approvedClean)){
  const row=report.entryFor(fighter);
  assert.equal(row.approvedPenalty,score,`${fighter} approved control`);
  assert.equal(row.resolvedByApproval,true,`${fighter} approved resolution`);
  near(row.reconstructedPenalty,score,row.approvalTolerance+.001,`${fighter} reconstruction`);
}

assert.ok(report.fighters.every(row=>row.stats.events.filter(event=>event.technicalException||event.competitive===false).every(event=>event.rawPenalty===0)));
assert.ok(report.fighters.every(row=>row.stats.events.filter(event=>event.phase==='post-prime').every(event=>event.rawPenalty===0)));
assert.ok(report.fighters.every(row=>row.reconstructedPenalty<=0&&row.reconstructedPenalty>=-6));
assert.ok(report.exactFrozenControlParityCount>0);
assert.ok(report.technicalExceptionCount>0);
assert.ok(report.postPrimeOfficialLossCount>0);
assert.ok(report.primeVolumeFloorAppliedCount>0);

for(const fighter of ['Jon Jones','Georges St-Pierre','Jose Aldo','Kamaru Usman','Tito Ortiz','Miesha Tate','Randy Couture','Israel Adesanya','Sean Strickland','Henry Cejudo']){
  const original=context.window.UFC_CANONICAL_FIGHTER_FACTS.get(fighter);
  const altered=JSON.parse(JSON.stringify(original));
  altered.primeWindow={startFightId:altered.fights.at(-1)?.id||null,endFightId:altered.fights.at(-1)?.id||null,open:false,reviewStatus:'locked'};
  const recalculated=report.calculateLossContext(altered);
  assert.equal(recalculated.score,report.entryFor(fighter).reconstructedPenalty,`${fighter} changed when the category-local prime window was corrupted`);
  assert.equal(recalculated.phaseSource,'fighter-era-ledgers');
  assert.equal(recalculated.categoryLocalPrimeWindowUsed,false);
}

const clean=value=>JSON.parse(JSON.stringify(value,(key,nested)=>typeof nested==='function'?undefined:nested));
await fs.mkdir('docs',{recursive:true});
await fs.writeFile('docs/canonical-loss-context-reconstruction.json',`${JSON.stringify(clean(report),null,2)}\n`,'utf8');
const markdown=[
  '# Canonical Loss Context Reconstruction — Approved Resolution Audit','',
  `- Fighters audited: **${report.fighterCount}**`,
  `- Canonically scored: **${report.scoredFighterCount}/${report.fighterCount}**`,
  `- Cody-approved resolutions: **${report.approvedResolutionCount}**`,
  `- Approved-resolution mismatches: **${report.approvedResolutionMismatchCount}**`,
  `- Unresolved decision rows: **${report.unresolvedDecisionCount}**`,
  `- Cejudo approved penalty: **${cejudo.reconstructedPenalty.toFixed(2)}**`,
  `- Cejudo shared endpoint: **${cejudo.stats.exposure.endpoint}**`,
  `- Live ranking payload changed: **${report.liveDataUnchanged?'No':'Yes'}**`,'',
  '## Approved formula','',
  `**${report.formula}**`,'',
  'Post-prime losses and technical/noncompetitive exceptions receive zero penalty. The shared Fighter Era Ledger is the sole phase source.',''
].join('\n');
await fs.writeFile('docs/canonical-loss-context-reconstruction.md',markdown,'utf8');

console.log('CANONICAL_LOSS_CONTEXT_RECONSTRUCTION');
console.log(JSON.stringify({
  version:report.version,
  fighterCount:report.fighterCount,
  approvedResolutionCount:report.approvedResolutionCount,
  unresolvedDecisionCount:report.unresolvedDecisionCount,
  cejudo:{penalty:cejudo.reconstructedPenalty,endpoint:cejudo.stats.exposure.endpoint,primeLossCount:cejudo.stats.primeLossCount},
  liveDataUnchanged:report.liveDataUnchanged
},null,2));

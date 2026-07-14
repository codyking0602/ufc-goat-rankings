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
  'assets/data/canonical-loss-context-reconstruction.js'
];

const attributes={};
const document={body:null,documentElement:{setAttribute(name,value){attributes[name]=value;}},querySelector(){return null;},querySelectorAll(){return[];}};
const window={};
const context=vm.createContext({window,document,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});

const report=context.window.UFC_CANONICAL_LOSS_CONTEXT_RECONSTRUCTION;
assert.equal(report?.applied,true,'Loss Context reconstruction should calculate successfully');
assert.equal(report.fighterCount,73,'All 73 canonical fighters must appear in the audit');
assert.equal(report.scoredFighterCount,73,'All 73 canonical fighters should receive a reconstructed Loss Context score');
assert.equal(report.eraLedgerCoverage,73,'The approved shared Era Ledger should cover all 73 fighters');
assert.equal(report.controlCoverage,72,'The frozen canonical snapshot currently covers 72 fighters; Leon remains an explicit missing control');
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
assert.equal(report.rules.primeLossFloorPerLoss,0.75);
assert.equal(report.rules.primeFinishFloorExtra,0.25);
assert.equal(report.rules.totalMax,6);
assert.equal(report.rules.divisionDiscountMax,0.15);
assert.equal(report.liveDataUnchanged,true);
assert.equal(report.mutatesRankingData,false);
assert.equal(report.mutatesPenalty,false);
assert.match(report.formula,/two worst losses/i);
assert.match(report.formula,/loss burden per UFC fight through prime/i);

const near=(actual,expected,tolerance=.05,message='')=>assert.ok(Math.abs(Number(actual)-Number(expected))<=tolerance,`${message} expected ${expected}, received ${actual}`);
const jones=report.entryFor('Jon Jones');
const gsp=report.entryFor('Georges St-Pierre');
const khabib=report.entryFor('Khabib Nurmagomedov');
const volk=report.entryFor('Alexander Volkanovski');
const anderson=report.entryFor('Anderson Silva');
const bj=report.entryFor('B.J. Penn');
const leon=report.entryFor('Leon Edwards');
const tito=report.entryFor('Tito Ortiz');
const miesha=report.entryFor('Miesha Tate');
const yan=report.entryFor('Petr Yan');

for(const row of [jones,gsp,khabib,volk,anderson,bj,leon,tito,miesha,yan]){
  assert.ok(row,`${row?.fighter||'Benchmark fighter'} must appear in the audit`);
  assert.ok(Number.isFinite(row.reconstructedPenalty));
  assert.ok(row.reconstructedPenalty<=0&&row.reconstructedPenalty>=-6);
  assert.equal(row.stats.phaseSource,'fighter-era-ledgers');
  assert.equal(row.stats.categoryLocalPrimeWindowUsed,false);
  assert.equal(row.stats.manualNumericAdjustment,0);
}

assert.equal(jones.reconstructedPenalty,0,'Jones should have no competitive UFC loss penalty');
const hamill=jones.stats.events.find(event=>/hamill/i.test(event.opponent));
assert.ok(hamill,'Jones Hamill result must remain visible');
assert.equal(hamill.technicalException,true);
assert.equal(hamill.penaltyEligible,false);
assert.equal(hamill.rawPenalty,0);
assert.equal(khabib.reconstructedPenalty,0,'Khabib should have no UFC loss penalty');
assert.equal(gsp.stats.exposure.count,22,'GSP exposure should include every scored UFC appearance through Bisping');
assert.equal(gsp.stats.events.length,2,'GSP must include the Hughes and Serra losses');
near(gsp.reconstructedPenalty,-3.78,.08,'GSP reconstructed hybrid penalty');
assert.ok(volk.stats.countedEvents.filter(event=>event.upwardDivision).length>=2,'Volkanovski Islam losses must use upward-division context');
assert.ok(anderson.stats.events.some(event=>event.phase==='post-prime'),'Anderson later losses must be visible as post-prime');
assert.ok(bj.stats.events.some(event=>event.phase==='post-prime'),'B.J. Penn late losses must be visible as post-prime');
assert.ok(anderson.stats.events.filter(event=>event.phase==='post-prime').every(event=>event.rawPenalty===0));
assert.ok(bj.stats.events.filter(event=>event.phase==='post-prime').every(event=>event.rawPenalty===0));
assert.equal(leon.currentPenalty,null,'Leon should remain an explicit missing frozen control');
assert.ok(Number.isFinite(leon.reconstructedPenalty),'Leon must still receive a canonical reconstructed penalty');
assert.equal(leon.stats.exposure.endpoint,'2025-03-22');
assert.equal(tito.stats.exposure.endpoint,'2008-05-24','Tito must use the approved Machida endpoint');
assert.ok(tito.stats.exposure.count>15,'Tito exposure must reflect the approved extended shared window');
assert.ok(miesha.stats.events.some(event=>/rousey/i.test(event.opponent)&&event.phase==='prime'),'Miesha Rousey II loss must be inside the approved shared prime window');
assert.ok(yan.stats.events.some(event=>event.technicalException||event.competitive===false),'Petr Yan Sterling DQ must remain an explicit exception');

assert.ok(report.fighters.every(row=>row.stats.events.filter(event=>event.technicalException||event.competitive===false).every(event=>event.rawPenalty===0)),'Technical/noncompetitive exceptions must receive zero raw penalty');
assert.ok(report.fighters.every(row=>row.stats.events.filter(event=>event.phase==='post-prime').every(event=>event.rawPenalty===0)),'Post-prime losses must receive zero raw penalty');
assert.ok(report.fighters.every(row=>row.reconstructedPenalty<=0&&row.reconstructedPenalty>=-6),'Final hybrid penalties must remain within 0 to -6');
assert.ok(report.exactFrozenControlParityCount>0,'The reconstruction should recover at least some frozen controls exactly');
assert.ok(report.technicalExceptionCount>0,'Technical exceptions should be traced');
assert.ok(report.postPrimeOfficialLossCount>0,'Post-prime losses should be traced and excluded');
assert.ok(report.primeVolumeFloorAppliedCount>0,'Repeated prime losses should trigger the approved minimum burden for some fighters');

for(const fighter of ['Jon Jones','Georges St-Pierre','Jose Aldo','Kamaru Usman','Tito Ortiz','Miesha Tate']){
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

const deltas=report.fighters.filter(row=>Number.isFinite(row.difference)).sort((a,b)=>Math.abs(b.difference)-Math.abs(a.difference)||a.fighter.localeCompare(b.fighter));
const harshest=report.fighters.slice().sort((a,b)=>a.reconstructedPenalty-b.reconstructedPenalty||a.fighter.localeCompare(b.fighter)).slice(0,15);
const spotlight=['Jon Jones','Georges St-Pierre','Khabib Nurmagomedov','Alexander Volkanovski','Jose Aldo','Anderson Silva','Charles Oliveira','Justin Gaethje','Dricus du Plessis','Tito Ortiz','Miesha Tate','Leon Edwards'].map(name=>report.entryFor(name));
const markdown=[
  '# Canonical Loss Context Reconstruction — Initial Shadow Audit','',
  `- Fighters audited: **${report.fighterCount}**`,
  `- Canonically scored: **${report.scoredFighterCount}/${report.fighterCount}**`,
  `- Shared Era Ledger coverage: **${report.eraLedgerCoverage}/${report.fighterCount}**`,
  `- Frozen controls available: **${report.controlCoverage}/${report.fighterCount}**`,
  `- Exact frozen-control parity: **${report.exactFrozenControlParityCount}/${report.controlCoverage}**`,
  `- Meaningful deltas (≥ ${report.meaningfulDeltaThreshold.toFixed(2)}): **${report.meaningfulDeltaCount}**`,
  `- Blocked fighters: **${report.blockedCount}**`,
  `- Missing frozen controls: **${report.missingControlCount}**`,
  `- Fighters retaining review-status judgment inputs: **${report.reviewJudgmentFighterCount}**`,
  `- Prime-loss floor applied: **${report.primeVolumeFloorAppliedCount}**`,
  `- Final 6-point cap applied: **${report.totalCapAppliedCount}**`,
  `- Live ranking payload changed: **${report.liveDataUnchanged?'No':'Yes'}**`,'',
  '## Recovered approved formula','',
  `**${report.formula}**`,'',
  '- Each official UFC loss is classified from canonical facts and the shared Fighter Era Ledger.',
  '- Champion-level/top-five opponents use the elite-loss rule; all lower tiers use the non-elite rule.',
  '- Technical exceptions, noncompetitive results, post-prime losses, and no contests receive zero penalty.',
  '- Severity averages the two worst counted losses and is capped at 3.50.',
  '- Frequency divides total raw loss burden by official UFC appearances through prime, then multiplies by 3 and caps at 2.50.',
  '- Repeated prime losses create a minimum floor: 0.75 per prime loss plus 0.25 per prime finish loss, capped at 5.25.',
  '- The completed burden caps at 6.00. Strong divisions can reduce it by up to 15%; weak divisions receive no additional punishment.','',
  '## Harshest reconstructed penalties','',
  '| Fighter | Reconstructed | Frozen | Delta | Severity | Frequency | Prime floor | Exposure | Division relief |',
  '|---|---:|---:|---:|---:|---:|---:|---:|---:|',
  ...harshest.map(row=>`| ${row.fighter} | ${row.reconstructedPenalty.toFixed(2)} | ${row.currentPenalty===null?'—':row.currentPenalty.toFixed(2)} | ${row.difference===null?'—':`${row.difference>0?'+':''}${row.difference.toFixed(2)}`} | ${row.stats.severity.toFixed(2)} | ${row.stats.frequency.toFixed(2)} | ${row.stats.primeVolumeFloor.toFixed(2)} | ${row.stats.exposure.count} | ${(row.stats.divisionDiscountPct*100).toFixed(0)}% |`),
  '',
  '## Required benchmark fighters','',
  '| Fighter | Reconstructed | Frozen | Delta | Counted losses | Prime losses | Post-prime official losses | Exposure |',
  '|---|---:|---:|---:|---:|---:|---:|---:|',
  ...spotlight.map(row=>`| ${row.fighter} | ${row.reconstructedPenalty.toFixed(2)} | ${row.currentPenalty===null?'—':row.currentPenalty.toFixed(2)} | ${row.difference===null?'—':`${row.difference>0?'+':''}${row.difference.toFixed(2)}`} | ${row.stats.countedEvents.length} | ${row.stats.primeLossCount} | ${row.stats.events.filter(event=>event.phase==='post-prime').length} | ${row.stats.exposure.count} |`),
  '',
  '## Largest changes versus frozen control','',
  '| Fighter | Frozen | Reconstructed | Delta | Status |',
  '|---|---:|---:|---:|---|',
  ...deltas.slice(0,30).map(row=>`| ${row.fighter} | ${row.currentPenalty.toFixed(2)} | ${row.reconstructedPenalty.toFixed(2)} | ${row.difference>0?'+':''}${row.difference.toFixed(2)} | ${row.status} |`),
  '',
  '## Pending review queue','',
  ...(report.pendingReviewRows.length?report.pendingReviewRows.map(row=>`- **${row.fighter}:** ${row.status}; ${row.issues.map(issue=>issue.reason).join('; ')||'review-status judgment input remains'}`):['- None']),
  '',
  'This is a shadow reconstruction only. It does not write penalties, total scores, ranks, OVRs, profiles, or Compare Mode values into the live app.',''
].join('\n');
await fs.writeFile('docs/canonical-loss-context-reconstruction.md',markdown,'utf8');

console.log('CANONICAL_LOSS_CONTEXT_RECONSTRUCTION');
console.log(JSON.stringify({
  version:report.version,
  fighterCount:report.fighterCount,
  scoredFighterCount:report.scoredFighterCount,
  controlCoverage:report.controlCoverage,
  eraLedgerCoverage:report.eraLedgerCoverage,
  exactFrozenControlParityCount:report.exactFrozenControlParityCount,
  meaningfulDeltaCount:report.meaningfulDeltaCount,
  blockedCount:report.blockedCount,
  missingControlCount:report.missingControlCount,
  reviewJudgmentFighterCount:report.reviewJudgmentFighterCount,
  primeVolumeFloorAppliedCount:report.primeVolumeFloorAppliedCount,
  totalCapAppliedCount:report.totalCapAppliedCount,
  largestDeltas:deltas.slice(0,15).map(row=>({fighter:row.fighter,frozen:row.currentPenalty,reconstructed:row.reconstructedPenalty,delta:row.difference,status:row.status})),
  gsp:{penalty:gsp.reconstructedPenalty,frozen:gsp.currentPenalty,exposure:gsp.stats.exposure.count,events:gsp.stats.events.map(event=>({opponent:event.opponent,phase:event.phase,quality:event.qualityClass,finished:event.finished,rawPenalty:event.rawPenalty}))},
  leon:{penalty:leon.reconstructedPenalty,frozen:leon.currentPenalty,exposure:leon.stats.exposure.count},
  liveDataUnchanged:report.liveDataUnchanged
},null,2));

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
  'assets/data/longevity-shadow-scorer.js',
  'assets/data/canonical-longevity-reconstruction.js',
  'assets/data/canonical-longevity-approved-resolutions.js'
];

const attributes={};
const document={body:null,documentElement:{setAttribute(name,value){attributes[name]=value;}},querySelector(){return null;},querySelectorAll(){return[];}};
const window={};
const context=vm.createContext({window,document,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});

const report=context.window.UFC_CANONICAL_LONGEVITY_RECONSTRUCTION;
const approval=context.window.UFC_CANONICAL_LONGEVITY_APPROVED_RESOLUTIONS;
const era=context.window.UFC_FIGHTER_ERA_LEDGERS;
assert.equal(report?.applied,true);
assert.equal(approval?.applied,true);
assert.equal(approval.resolvedCount,18);
assert.equal(approval.allFourteenResolved,true);
assert.equal(approval.allSeventeenResolved,true);
assert.equal(approval.allEighteenResolved,true);
assert.equal(approval.lossContextWindowResolutionCount,4);
assert.deepEqual(JSON.parse(JSON.stringify(approval.unresolved)),[]);
assert.equal(report.missingJudgmentInputCount,0);
assert.equal(report.eraLedgerCoverage,73);
assert.equal(report.scoredFighterCount,73);
assert.equal(report.liveDataUnchanged,true);
assert.equal(report.mutatesRankingData,false);

const accepted={
  'Glover Teixeira':23.00,'Rashad Evans':15.60,'Fabricio Werdum':15.27,'Vitor Belfort':15.24,
  'Dominick Cruz':14.05,'Benson Henderson':11.83,'Forrest Griffin':10.30,'Cris Cyborg':6.86,
  'Mauricio "Shogun" Rua':6.85,'Frank Shamrock':4.59,'Royce Gracie':3.40
};
for(const [fighter,score] of Object.entries(accepted)){
  const row=report.entryFor(fighter);
  assert.ok(row?.resolution?.approved,`${fighter} must have an approved resolution`);
  assert.ok(Math.abs(Number(row.reconstructedScore)-score)<=.06,`${fighter} reconstructed ${row.reconstructedScore} should match approved ${score}`);
}

const tito=era.entryFor('Tito Ortiz');
assert.equal(tito.window.start,'2000-04-14');
assert.equal(tito.window.end,'2008-05-24');
assert.equal(tito.window.endLabel,'Lyoto Machida');
assert.ok(report.entryFor('Tito Ortiz').resolution?.approved);

const miesha=era.entryFor('Miesha Tate');
assert.equal(miesha.window.start,'2013-12-28');
assert.equal(miesha.window.startLabel,'Ronda Rousey II');
assert.equal(miesha.window.end,'2016-07-09');
assert.ok(report.entryFor('Miesha Tate').resolution?.approved);

const leon=era.entryFor('Leon Edwards');
assert.ok(leon,'Leon Edwards must now have a shared Era Ledger entry');
assert.equal(leon.window.start,'2019-07-20');
assert.equal(leon.window.startLabel,'Rafael dos Anjos');
assert.equal(leon.window.end,'2025-03-22');
assert.equal(leon.window.endLabel,'Sean Brady');
assert.equal(leon.longevity.gapCapMonths,18);
assert.equal(leon.longevity.statusMultiplier,1.10);
assert.equal(leon.longevity.divisionMultiplier,1.05);
assert.ok(Number.isFinite(report.entryFor('Leon Edwards').reconstructedScore));
assert.ok(report.entryFor('Leon Edwards').resolution?.approved);

const randy=era.entryFor('Randy Couture');
assert.equal(randy.window.start,'1997-05-30');
assert.equal(randy.window.startLabel,'Vitor Belfort I');
assert.ok(report.entryFor('Randy Couture').resolution?.approved);

const israel=era.entryFor('Israel Adesanya');
assert.equal(israel.window.end,'2024-08-18');
assert.equal(israel.window.endLabel,'Dricus du Plessis');
assert.ok(report.entryFor('Israel Adesanya').resolution?.approved);

const sean=era.entryFor('Sean Strickland');
assert.equal(sean.window.start,'2021-07-31');
assert.equal(sean.window.startLabel,'Uriah Hall');
assert.ok(report.entryFor('Sean Strickland').resolution?.approved);

const cejudo=era.entryFor('Henry Cejudo');
const cejudoRow=report.entryFor('Henry Cejudo');
assert.equal(cejudo.window.start,'2018-08-04');
assert.equal(cejudo.window.startLabel,'Demetrious Johnson II');
assert.equal(cejudo.window.end,'2020-05-09');
assert.equal(cejudo.window.endLabel,'Dominick Cruz');
assert.equal(cejudo.window.endType,'retirement_win');
assert.equal(cejudoRow.reconstructedScore,4.77);
assert.equal(cejudoRow.stats.cappedGapCount,0);
assert.equal(cejudoRow.stats.activeEliteYears,1.77);
assert.ok(cejudoRow.resolution?.approved);

const cruz=era.entryFor('Dominick Cruz');
assert.equal(cruz.longevity.gapAdjustedMonths,66.1);
assert.equal(cruz.longevity.approvedCanonicalAcceptance.score,14.05);
assert.equal(report.fighters.every(row=>row.stats?.windowSource==='fighter-era-ledgers'),true);
assert.equal(report.fighters.filter(row=>Number.isFinite(row.reconstructedScore)).every(row=>row.stats.intervals.every(interval=>interval.countedMonths<=18.01)),true);

console.log('CANONICAL_LONGEVITY_APPROVED_RESOLUTIONS');
console.log(JSON.stringify({
  resolvedCount:approval.resolvedCount,
  unresolved:approval.unresolved,
  eraLedgerCoverage:report.eraLedgerCoverage,
  scoredFighterCount:report.scoredFighterCount,
  tito:report.entryFor('Tito Ortiz').reconstructedScore,
  miesha:report.entryFor('Miesha Tate').reconstructedScore,
  leon:report.entryFor('Leon Edwards').reconstructedScore,
  randy:report.entryFor('Randy Couture').reconstructedScore,
  israel:report.entryFor('Israel Adesanya').reconstructedScore,
  sean:report.entryFor('Sean Strickland').reconstructedScore,
  cejudo:cejudoRow.reconstructedScore,
  liveDataUnchanged:report.liveDataUnchanged
},null,2));

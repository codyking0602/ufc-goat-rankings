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
  'assets/data/canonical-prime-dominance-reconstruction.js'
];

class CustomEvent{constructor(type,options={}){this.type=type;this.detail=options.detail;}}
const document={body:null,documentElement:{setAttribute(){}},querySelector(){return null;},querySelectorAll(){return[];}};
const window={dispatchEvent(){return true;}};
const context=vm.createContext({window,document,CustomEvent,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});

const before=JSON.stringify(context.window.RANKING_DATA);
vm.runInContext(await fs.readFile('assets/data/canonical-leon-final-category-completions.js','utf8'),context,{filename:'assets/data/canonical-leon-final-category-completions.js'});
const layer=context.window.UFC_CANONICAL_LEON_FINAL_CATEGORY_COMPLETIONS;
const oq=context.window.UFC_CANONICAL_OPPONENT_QUALITY_RECONSTRUCTION;
const prime=context.window.UFC_CANONICAL_PRIME_DOMINANCE_RECONSTRUCTION;
const roundCorrections=context.window.UFC_CANONICAL_FIGHTER_FACTS_PRIME_ROUND_CORRECTIONS;

assert.equal(layer?.opponentQualityInstalled,true);
assert.equal(layer?.primeDominanceInstalled,true);
assert.equal(layer.championshipPendingApproval,true);
assert.equal(layer.mutatesRankingData,false);
assert.equal(layer.mutatesScores,false);
assert.equal(layer.mutatesRanks,false);
assert.equal(layer.mutatesOvr,false);
assert.equal(roundCorrections.correctionCount,15);
assert.equal(roundCorrections.expectedCorrectionCount,15);
assert.equal(roundCorrections.missing.length,0);

const leonOq=oq.entryFor('Leon Edwards');
assert.equal(oq.fighterCount,73);
assert.equal(oq.excludedFighters.includes('Leon Edwards'),false);
assert.equal(leonOq.reconstructedScore,21.01);
assert.equal(leonOq.rawCredit,11.4);
assert.equal(leonOq.diminishedCredit,9.875);
assert.equal(leonOq.topFiveWins,4);
assert.equal(leonOq.championLevelWins,2);
assert.equal(leonOq.rankedQualityWins,11);
assert.equal(leonOq.fighterAdjustment,0);

const leonPrime=prime.entryFor('Leon Edwards');
assert.equal(prime.fighterCount,73);
assert.equal(prime.excludedFighters.includes('Leon Edwards'),false);
assert.equal(leonPrime.reconstructedScore,16.4);
assert.equal(leonPrime.stats.recordText,'5-2, 1 NC');
assert.equal(leonPrime.stats.recordPct,71.43);
assert.equal(leonPrime.stats.roundControlPct,55.88);
assert.equal(leonPrime.stats.finishPressurePct,14.29);
assert.deepEqual(JSON.parse(JSON.stringify(leonPrime.stats.components)),{primeRecord:6.43,roundControl:5.03,finishPressure:.5,eliteLevelValidation:4.44});
assert.equal(leonPrime.stats.missingRoundRows.length,0);
assert.equal(leonPrime.stats.eliteLevelValidation.missingRoundRows.length,0);
assert.equal(JSON.stringify(context.window.RANKING_DATA),before,'Leon category completion layer must not mutate live ranking data');

console.log('CANONICAL_LEON_FINAL_CATEGORY_COMPLETIONS');
console.log(JSON.stringify({
  version:layer.version,
  opponentQuality:{score:leonOq.reconstructedScore,rawCredit:leonOq.rawCredit,diminishedCredit:leonOq.diminishedCredit,topFiveWins:leonOq.topFiveWins,championLevelWins:leonOq.championLevelWins,rankedQualityWins:leonOq.rankedQualityWins},
  primeDominance:{score:leonPrime.reconstructedScore,record:leonPrime.stats.recordText,roundControlPct:leonPrime.stats.roundControlPct,finishPressurePct:leonPrime.stats.finishPressurePct,components:leonPrime.stats.components},
  championshipPendingApproval:layer.championshipPendingApproval,
  liveDataUnchanged:JSON.stringify(context.window.RANKING_DATA)===before
},null,2));

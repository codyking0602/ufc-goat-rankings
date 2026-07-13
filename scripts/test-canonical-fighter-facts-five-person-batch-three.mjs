import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const files=[
  'assets/data/canonical-fighter-facts.js',
  'assets/data/canonical-fighter-facts-batch-one.js',
  'assets/data/canonical-fighter-facts-batch-two.js',
  'assets/data/canonical-fighter-facts-batch-three-werdum.js',
  'assets/data/canonical-fighter-facts-batch-three-glover.js',
  'assets/data/canonical-fighter-facts-batch-three-rashad.js',
  'assets/data/canonical-fighter-facts-batch-three-shogun.js',
  'assets/data/canonical-fighter-facts-batch-three-forrest.js',
  'assets/data/canonical-fighter-facts-batch-three.js'
];
const sentinel={
  men:[
    {fighter:'Fabricio Werdum',rank:1,totalScore:1,overallOvr:1},
    {fighter:'Glover Teixeira',rank:2,totalScore:2,overallOvr:2},
    {fighter:'Rashad Evans',rank:3,totalScore:3,overallOvr:3},
    {fighter:'Mauricio "Shogun" Rua',rank:4,totalScore:4,overallOvr:4},
    {fighter:'Forrest Griffin',rank:5,totalScore:5,overallOvr:5}
  ],
  fighters:[{fighter:'Fabricio Werdum',snapshotStats:{ufcRecord:'legacy'}}],
  meta:{expectedRankLocks:true}
};
const before=JSON.stringify(sentinel);
const document={documentElement:{setAttribute(){}}};
const context=vm.createContext({
  window:{RANKING_DATA:sentinel},
  document,
  console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean
});
for(const file of files){
  const source=await fs.readFile(file,'utf8');
  vm.runInContext(source,context,{filename:file});
}

const api=context.window.UFC_CANONICAL_FIGHTER_FACTS;
const batch=context.window.UFC_CANONICAL_FIGHTER_FACTS_BATCH_THREE;
assert.ok(api,'canonical fighter facts API should load');
assert.equal(batch?.applied,true,batch?.error||'five-fighter batch three should apply');
assert.deepEqual(JSON.parse(JSON.stringify(batch.fighters)),[
  'Fabricio Werdum','Glover Teixeira','Rashad Evans','Mauricio "Shogun" Rua','Forrest Griffin'
]);
assert.equal(batch.recordCount,5);
assert.equal(batch.fightCount,103);
assert.equal(api.count(),11,'six prior records plus five new records should produce eleven canonical fighters');
assert.equal(JSON.stringify(context.window.RANKING_DATA),before,'canonical ledgers must not mutate live score, rank, OVR, snapshot, profile, or Compare Mode data');

const expected={"Fabricio Werdum":{"official":"12-6","wins":12,"losses":6,"draws":0,"finishWins":8,"finishRate":66.67,"titleWins":2,"adjusted":1.65,"prime":"9-3","primeFinishWins":5,"primeStoppageLosses":2,"rounds":[23,10,0],"roundPct":69.7,"years":6.11,"fightCount":18,"throughPrime":16,"quality":{"elite":1,"topFive":3,"ranked":11}},"Glover Teixeira":{"official":"16-7","wins":16,"losses":7,"draws":0,"finishWins":13,"finishRate":81.25,"titleWins":1,"adjusted":1.0,"prime":"12-6","primeFinishWins":10,"primeStoppageLosses":3,"rounds":[32,17,0],"roundPct":65.31,"years":8.77,"fightCount":23,"throughPrime":22,"quality":{"elite":1,"topFive":4,"ranked":12}},"Rashad Evans":{"official":"14-8-1","wins":14,"losses":8,"draws":1,"finishWins":6,"finishRate":42.86,"titleWins":1,"adjusted":0.9,"prime":"9-3","primeFinishWins":4,"primeStoppageLosses":1,"rounds":[22,13,0],"roundPct":62.86,"years":6.0,"fightCount":23,"throughPrime":18,"quality":{"elite":2,"topFive":5,"ranked":10}},"Mauricio \"Shogun\" Rua":{"official":"11-12-1","wins":11,"losses":12,"draws":1,"finishWins":8,"finishRate":72.73,"titleWins":1,"adjusted":0.95,"prime":"3-3","primeFinishWins":3,"primeStoppageLosses":1,"rounds":[8,8,0],"roundPct":50.0,"years":2.59,"fightCount":24,"throughPrime":8,"quality":{"elite":1,"topFive":1,"ranked":7}},"Forrest Griffin":{"official":"10-5","wins":10,"losses":5,"draws":0,"finishWins":3,"finishRate":30.0,"titleWins":1,"adjusted":0.95,"prime":"4-3","primeFinishWins":1,"primeStoppageLosses":3,"rounds":[12,7,0],"roundPct":63.16,"years":3.93,"fightCount":15,"throughPrime":14,"quality":{"elite":2,"topFive":2,"ranked":4}}};

for(const [fighter,want] of Object.entries(expected)){
  const record=api.get(fighter);
  const derived=api.deriveFor(fighter);
  assert.ok(record,`${fighter} record should exist`);
  assert.ok(derived,`${fighter} should derive`);
  assert.equal(record.fights.length,want.fightCount,`${fighter} complete UFC bout count`);
  assert.equal(derived.officialUfcRecord.text,want.official,`${fighter} official record`);
  assert.equal(derived.scoringRecord.text,want.official,`${fighter} scoring record`);
  assert.equal(derived.finishWins,want.finishWins,`${fighter} finish wins`);
  assert.equal(derived.finishRatePct,want.finishRate,`${fighter} finish rate`);
  assert.equal(derived.championship.titleFightWins,want.titleWins,`${fighter} title-fight wins`);
  assert.equal(derived.championship.adjustedTitleWins,want.adjusted,`${fighter} adjusted title wins`);
  assert.equal(derived.prime.recordText,want.prime,`${fighter} prime record`);
  assert.equal(derived.prime.finishWins,want.primeFinishWins,`${fighter} prime finish wins`);
  assert.equal(derived.prime.stoppageLosses,want.primeStoppageLosses,`${fighter} prime stoppage losses`);
  assert.equal(derived.prime.rounds.won,want.rounds[0],`${fighter} prime rounds won`);
  assert.equal(derived.prime.rounds.lost,want.rounds[1],`${fighter} prime rounds lost`);
  assert.equal(derived.prime.rounds.drawn,want.rounds[2],`${fighter} prime drawn rounds`);
  assert.equal(derived.prime.roundsWonPct,want.roundPct,`${fighter} prime round-control percentage`);
  assert.equal(derived.longevity.activeEliteYears,want.years,`${fighter} active elite years`);
  assert.equal(derived.lossExposure.throughPrimeUfcFights,want.throughPrime,`${fighter} through-prime exposure`);
  assert.equal(derived.opponentQuality.eliteWins,want.quality.elite,`${fighter} champion-level wins`);
  assert.equal(derived.opponentQuality.topFiveWins,want.quality.topFive,`${fighter} top-five wins`);
  assert.equal(derived.opponentQuality.rankedWins,want.quality.ranked,`${fighter} ranked-quality wins`);
}

const werdum=api.get('Fabricio Werdum');
assert.equal(werdum.fights.some(f=>f.opponent==='Fedor Emelianenko'),false,'Strikeforce Fedor win must stay outside UFC-only ledger');
assert.equal(api.deriveFor('Fabricio Werdum').championship.titleFightWins,2,'Werdum should derive interim and undisputed UFC title-fight wins');

const glover=api.get('Glover Teixeira');
assert.equal(glover.fights.at(-1).opponent,'Jamahal Hill');
assert.equal(api.deriveFor('Glover Teixeira').lossExposure.countedLosses.at(-1).phase,'post-prime','Jamahal Hill must remain post-prime');

const rashad=api.get('Rashad Evans');
for(const exhibitionOpponent of ['Keith Jardine','Mike Whitehead']){
  assert.equal(rashad.fights.some(f=>f.opponent===exhibitionOpponent),false,`${exhibitionOpponent} TUF exhibition must not enter professional UFC ledger`);
}

const shogun=api.get('Mauricio "Shogun" Rua');
for(const prideOpponent of ['Ricardo Arona','Alistair Overeem','Kevin Randleman']){
  assert.equal(shogun.fights.some(f=>f.opponent===prideOpponent),false,`${prideOpponent} PRIDE bout must stay excluded`);
}

const forrest=api.get('Forrest Griffin');
const tufTitle=forrest.fights.find(f=>f.opponent==='Stephan Bonnar'&&f.date==='2005-04-09');
assert.equal(tufTitle?.championshipContext?.type,'tournament');
assert.equal(api.deriveFor('Forrest Griffin').championship.titleFightWins,1,'TUF tournament must not inflate official title-fight wins');

const audit=api.audit();
assert.equal(audit.passed,true,JSON.stringify(audit.invalid,null,2));
assert.equal(audit.invalid.length,0);

console.log('CANONICAL_FIVE_FIGHTER_BATCH_THREE_TEST');
console.log(JSON.stringify({
  version:batch.version,
  canonicalCount:api.count(),
  batchFightCount:batch.fightCount,
  fighters:Object.fromEntries(Object.keys(expected).map(name=>[name,api.deriveFor(name)]))
},null,2));

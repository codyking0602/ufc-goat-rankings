import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const files=[
  'assets/data/canonical-fighter-facts.js',
  'assets/data/canonical-fighter-facts-batch-one.js',
  'assets/data/canonical-fighter-facts-batch-two.js',
  'assets/data/canonical-fighter-facts-batch-three.js'
];
const sentinel={
  men:[
    {fighter:'Fabricio Werdum',rank:44,totalScore:25.0,overallOvr:82},
    {fighter:'Glover Teixeira',rank:38,totalScore:29.0,overallOvr:85},
    {fighter:'Rashad Evans',rank:52,totalScore:22.0,overallOvr:80},
    {fighter:'Mauricio "Shogun" Rua',rank:49,totalScore:23.0,overallOvr:81},
    {fighter:'Forrest Griffin',rank:57,totalScore:20.0,overallOvr:78}
  ],
  fighters:[{fighter:'Glover Teixeira',snapshotStats:{activeEliteYears:8.77}}],
  meta:{expectedRankLocks:true}
};
const before=JSON.stringify(sentinel);
const document={documentElement:{setAttribute(){}}};
const context=vm.createContext({window:{RANKING_DATA:sentinel},document,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean});
for(const file of files){
  const source=await fs.readFile(file,'utf8');
  vm.runInContext(source,context,{filename:file});
}

const api=context.window.UFC_CANONICAL_FIGHTER_FACTS;
const batch=context.window.UFC_CANONICAL_FIGHTER_FACTS_BATCH_THREE;
assert.ok(api,'canonical fighter facts API should load');
assert.equal(batch?.applied,true,batch?.error||'batch three should apply');
assert.deepEqual(JSON.parse(JSON.stringify(batch.fighters)),['Fabricio Werdum','Glover Teixeira','Rashad Evans','Mauricio "Shogun" Rua','Forrest Griffin']);
assert.equal(batch.recordCount,5);
assert.equal(batch.fightCount,103);
const expectedFightCounts={'Fabricio Werdum':18,'Glover Teixeira':23,'Rashad Evans':23,'Mauricio "Shogun" Rua':24,'Forrest Griffin':15};
for(const [fighter,count] of Object.entries(expectedFightCounts))assert.equal(api.get(fighter)?.fights?.length,count,`${fighter} complete UFC bout count`);
assert.equal(api.count(),11,'six previous fighters plus five batch-three fighters should produce eleven canonical records');
assert.equal(JSON.stringify(context.window.RANKING_DATA),before,'canonical ledgers must not mutate live score, rank, OVR, snapshot, profile, or Compare Mode data');

const expected={"Fabricio Werdum":{"official":"12-6","scoring":"12-6","finishWins":8,"finishRatePct":66.67,"titleFightWins":2,"adjustedTitleWins":1.65,"prime":"9-3","primeFinishWins":5,"primeStoppageLosses":2,"roundsWon":26,"roundsLost":7,"roundsDrawn":0,"roundsWonPct":78.79,"activeEliteYears":6.11,"throughPrime":16,"losses":{"pre":2,"prime":3,"post":1}},"Glover Teixeira":{"official":"16-7","scoring":"16-7","finishWins":13,"finishRatePct":81.25,"titleFightWins":1,"adjustedTitleWins":1.0,"prime":"12-6","primeFinishWins":10,"primeStoppageLosses":3,"roundsWon":27,"roundsLost":22,"roundsDrawn":0,"roundsWonPct":55.1,"activeEliteYears":8.77,"throughPrime":22,"losses":{"pre":0,"prime":6,"post":1}},"Rashad Evans":{"official":"14-8-1","scoring":"14-8-1","finishWins":6,"finishRatePct":42.86,"titleFightWins":1,"adjustedTitleWins":0.9,"prime":"9-3","primeFinishWins":4,"primeStoppageLosses":1,"roundsWon":21,"roundsLost":14,"roundsDrawn":0,"roundsWonPct":60.0,"activeEliteYears":6.0,"throughPrime":18,"losses":{"pre":0,"prime":3,"post":5}},"Mauricio \"Shogun\" Rua":{"official":"11-12-1","scoring":"11-12-1","finishWins":8,"finishRatePct":72.73,"titleFightWins":1,"adjustedTitleWins":0.95,"prime":"3-3","primeFinishWins":3,"primeStoppageLosses":1,"roundsWon":8,"roundsLost":8,"roundsDrawn":0,"roundsWonPct":50.0,"activeEliteYears":2.59,"throughPrime":8,"losses":{"pre":1,"prime":3,"post":8}},"Forrest Griffin":{"official":"10-5","scoring":"10-5","finishWins":3,"finishRatePct":30.0,"titleFightWins":1,"adjustedTitleWins":0.95,"prime":"4-3","primeFinishWins":1,"primeStoppageLosses":3,"roundsWon":12,"roundsLost":7,"roundsDrawn":0,"roundsWonPct":63.16,"activeEliteYears":3.93,"throughPrime":14,"losses":{"pre":2,"prime":3,"post":0}}};
for(const [fighter,want] of Object.entries(expected)){
  const derived=api.deriveFor(fighter);
  assert.ok(derived,`${fighter} should derive`);
  assert.equal(derived.officialUfcRecord.text,want.official,`${fighter} official record`);
  assert.equal(derived.scoringRecord.text,want.scoring,`${fighter} scoring record`);
  assert.equal(derived.finishWins,want.finishWins,`${fighter} finish wins`);
  assert.equal(derived.finishRatePct,want.finishRatePct,`${fighter} finish rate`);
  assert.equal(derived.championship.titleFightWins,want.titleFightWins,`${fighter} title-fight wins`);
  assert.equal(derived.championship.adjustedTitleWins,want.adjustedTitleWins,`${fighter} adjusted title wins`);
  assert.equal(derived.prime.recordText,want.prime,`${fighter} prime record`);
  assert.equal(derived.prime.finishWins,want.primeFinishWins,`${fighter} prime finish wins`);
  assert.equal(derived.prime.stoppageLosses,want.primeStoppageLosses,`${fighter} prime stoppage losses`);
  assert.equal(derived.prime.rounds.won,want.roundsWon,`${fighter} prime rounds won`);
  assert.equal(derived.prime.rounds.lost,want.roundsLost,`${fighter} prime rounds lost`);
  assert.equal(derived.prime.rounds.drawn,want.roundsDrawn,`${fighter} prime drawn rounds`);
  assert.equal(derived.prime.roundsWonPct,want.roundsWonPct,`${fighter} prime round-control percentage`);
  assert.equal(derived.longevity.activeEliteYears,want.activeEliteYears,`${fighter} active elite years`);
  assert.equal(derived.lossExposure.throughPrimeUfcFights,want.throughPrime,`${fighter} through-prime exposure`);
  const phaseCounts=derived.lossExposure.countedLosses.reduce((out,row)=>{out[row.phase]=(out[row.phase]||0)+1;return out;},{});
  assert.equal(phaseCounts['pre-prime']||0,want.losses.pre,`${fighter} pre-prime losses`);
  assert.equal(phaseCounts.prime||0,want.losses.prime,`${fighter} prime losses`);
  assert.equal(phaseCounts['post-prime']||0,want.losses.post,`${fighter} post-prime losses`);
}

const werdum=api.deriveFor('Fabricio Werdum');
assert.equal(werdum.championship.titleFightWins,2,'Werdum should derive interim and undisputed UFC title wins');
assert.equal(werdum.championship.adjustedTitleWins,1.65,'Werdum title credit should remain 0.65 interim plus 1.00 undisputed');
assert.equal(api.deriveFor('Glover Teixeira').championship.titleFightWins,1,'Jan should be Glover’s only UFC title-fight win');
assert.equal(api.deriveFor('Rashad Evans').prime.recordText,'9-3','Rashad prime should run from Bisping through Sonnen');
const shogunRecord=api.get('Mauricio "Shogun" Rua');
for(const excluded of ['Quinton Jackson','Antônio Rogério Nogueira','Alistair Overeem','Ricardo Arona'])assert.equal(shogunRecord.fights.some(fight=>fight.opponent===excluded),false,`${excluded} is PRIDE-only for Shogun and must stay outside the UFC ledger`);
const machidaOne=shogunRecord.fights.find(fight=>fight.id==='2009-10-24-lyoto-machida');
assert.equal(machidaOne?.officialResult,'loss','official Machida I result remains a loss');
assert.equal(machidaOne?.rounds?.won,3,'reviewed round evidence can favor Shogun while preserving the official loss');
assert.equal(api.deriveFor('Forrest Griffin').officialUfcRecord.text,'10-5');
assert.equal(api.get('Forrest Griffin').fights[0].opponent,'Stephan Bonnar','TUF 1 Finale is Forrest’s first official UFC bout');
const audit=api.audit();
assert.equal(audit.passed,true,JSON.stringify(audit.invalid,null,2));
assert.equal(audit.invalid.length,0);

console.log('CANONICAL_FIVE_FIGHTER_BATCH_THREE_TEST');
console.log(JSON.stringify({version:batch.version,batchFightCount:batch.fightCount,canonicalCount:api.count(),fighters:Object.fromEntries(Object.keys(expected).map(name=>[name,api.deriveFor(name)]))},null,2));

import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const files=[
'assets/data/canonical-fighter-facts.js',
'assets/data/canonical-fighter-facts-batch-one.js',
'assets/data/canonical-fighter-facts-batch-two.js',
'assets/data/canonical-fighter-facts-batch-three.js',
'assets/data/canonical-fighter-facts-batch-four.js',
'assets/data/canonical-fighter-facts-batch-five.js',
'assets/data/canonical-fighter-facts-batch-six.js',
'assets/data/canonical-fighter-facts-batch-seven-data-a.js',
'assets/data/canonical-fighter-facts-batch-seven-data-b.js',
'assets/data/canonical-fighter-facts-batch-seven.js'
];
const sentinel={men:[{fighter:'Tony Ferguson',rank:30,totalScore:34,overallOvr:82}],fighters:[{fighter:'Aljamain Sterling',snapshotStats:{ufcRecord:'stale'}}],meta:{expectedRankLocks:true}};
const before=JSON.stringify(sentinel);
const document={documentElement:{setAttribute(){}}};
const context=vm.createContext({window:{RANKING_DATA:sentinel},document,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean});
for(const file of files){
  try{vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});}
  catch(error){
    console.error(JSON.stringify(context.window.UFC_CANONICAL_FIGHTER_FACTS_BATCH_SEVEN||{file,error:String(error)},null,2));
    throw error;
  }
}
const api=context.window.UFC_CANONICAL_FIGHTER_FACTS;
const batch=context.window.UFC_CANONICAL_FIGHTER_FACTS_BATCH_SEVEN;
assert.equal(batch?.applied,true,batch?.error||'batch seven should apply');
assert.deepEqual(JSON.parse(JSON.stringify(batch.fighters)),['Tony Ferguson','T.J. Dillashaw','Tito Ortiz','Junior dos Santos','Brock Lesnar','Dricus du Plessis','Tyron Woodley','Aljamain Sterling','Robert Whittaker','Lyoto Machida']);
assert.equal(batch.recordCount,10);
assert.equal(batch.fightCount,199);
assert.equal(api.count(),48);
assert.equal(JSON.stringify(context.window.RANKING_DATA),before,'canonical ledgers must not mutate live data');

const expected={"Tony Ferguson":{"fightCount":24,"official":"15-9","titleFightWins":1,"adjustedTitleWins":0.75,"prime":"8-1","finishWins":11,"activeEliteYears":5.19},"T.J. Dillashaw":{"fightCount":18,"official":"13-5","titleFightWins":5,"adjustedTitleWins":5.0,"prime":"8-3","finishWins":8,"activeEliteYears":7.4},"Tito Ortiz":{"fightCount":27,"official":"15-11-1","titleFightWins":6,"adjustedTitleWins":5.2,"prime":"11-3","finishWins":10,"activeEliteYears":6.71},"Junior dos Santos":{"fightCount":23,"official":"15-8","titleFightWins":2,"adjustedTitleWins":1.85,"prime":"11-3","finishWins":10,"activeEliteYears":7.15},"Brock Lesnar":{"fightCount":8,"official":"4-3, 1 NC","titleFightWins":3,"adjustedTitleWins":2.4,"prime":"3-1","finishWins":3,"activeEliteYears":1.94},"Dricus du Plessis":{"fightCount":10,"official":"9-1","titleFightWins":3,"adjustedTitleWins":3.0,"prime":"4-1","finishWins":6,"activeEliteYears":2.11},"Tyron Woodley":{"fightCount":16,"official":"9-6-1","titleFightWins":4,"adjustedTitleWins":4.0,"prime":"4-2-1","finishWins":6,"activeEliteYears":3.83},"Aljamain Sterling":{"fightCount":24,"official":"19-5","titleFightWins":4,"adjustedTitleWins":3.25,"prime":"9-2","finishWins":6,"activeEliteYears":7.1},"Robert Whittaker":{"fightCount":25,"official":"18-7","titleFightWins":1,"adjustedTitleWins":1.5,"prime":"10-4","finishWins":7,"activeEliteYears":7.91},"Lyoto Machida":{"fightCount":24,"official":"16-8","titleFightWins":2,"adjustedTitleWins":1.65,"prime":"9-5","finishWins":8,"activeEliteYears":5.88}};
for(const [fighter,want] of Object.entries(expected)){
  const record=api.get(fighter);
  const got=api.deriveFor(fighter);
  assert.equal(record.fights.length,want.fightCount,`${fighter} complete UFC bout count`);
  assert.equal(got.officialUfcRecord.text,want.official,`${fighter} official UFC record`);
  assert.equal(got.championship.titleFightWins,want.titleFightWins,`${fighter} official title-fight wins`);
  assert.equal(got.championship.adjustedTitleWins,want.adjustedTitleWins,`${fighter} adjusted title wins`);
  assert.equal(got.prime.recordText,want.prime,`${fighter} prime record`);
  assert.equal(got.finishWins,want.finishWins,`${fighter} UFC finish wins`);
  assert.equal(got.longevity.activeEliteYears,want.activeEliteYears,`${fighter} active elite years`);
}
assert.equal(api.deriveFor('Tony Ferguson').lossExposure.countedLosses.find(row=>row.fightId.includes('charles-oliveira')).phase,'post-prime');
assert.equal(api.deriveFor('T.J. Dillashaw').lossExposure.countedLosses.find(row=>row.fightId.includes('henry-cejudo')).divisionContext,'downward');
assert.equal(api.get('Brock Lesnar').fights.at(-1).officialResult,'no-contest');
assert.equal(api.get('Dricus du Plessis').fights.some(fight=>fight.opponent==='Kamaru Usman'),false);
assert.equal(api.get('Tyron Woodley').fights.find(fight=>fight.opponent==='Stephen Thompson').officialResult,'draw');
assert.equal(api.deriveFor('Aljamain Sterling').officialUfcRecord.text,'19-5');
assert.equal(api.get('Aljamain Sterling').fights.at(-1).opponent,'Youssef Zalal');
assert.equal(api.get('Robert Whittaker').fights.at(-1).opponent,'Nikita Krylov');
assert.equal(api.deriveFor('Robert Whittaker').lossExposure.countedLosses.find(row=>row.fightId.includes('reinier-de-ridder')).phase,'post-prime');
assert.equal(api.get('Lyoto Machida').fights.some(fight=>String(fight.event).includes('Bellator')),false);
assert.equal(api.audit().passed,true);
console.log('CANONICAL_TEN_FIGHTER_BATCH_SEVEN_TEST');
console.log(JSON.stringify({version:batch.version,batchFightCount:batch.fightCount,canonicalCount:api.count()},null,2));

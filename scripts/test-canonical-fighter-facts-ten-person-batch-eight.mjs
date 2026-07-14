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
'assets/data/canonical-fighter-facts-batch-seven.js',
'assets/data/canonical-fighter-facts-batch-eight-data-a.js',
'assets/data/canonical-fighter-facts-batch-eight-data-b.js',
'assets/data/canonical-fighter-facts-batch-eight.js'
];
const sentinel={men:[{fighter:'Khamzat Chimaev',rank:23,totalScore:36.83,overallOvr:87}],fighters:[{fighter:'Frank Shamrock',snapshotStats:{ufcRecord:'stale'}}],meta:{expectedRankLocks:true}};
const before=JSON.stringify(sentinel);
const document={documentElement:{setAttribute(){}}};
const context=vm.createContext({window:{RANKING_DATA:sentinel},document,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});
const api=context.window.UFC_CANONICAL_FIGHTER_FACTS;
const batch=context.window.UFC_CANONICAL_FIGHTER_FACTS_BATCH_EIGHT;
assert.equal(batch?.applied,true,batch?.error||'batch eight should apply');
assert.deepEqual(JSON.parse(JSON.stringify(batch.fighters)),['Khamzat Chimaev','Leon Edwards',"Sean O'Malley",'Sean Strickland','Michael Bisping','Dan Henderson','Chael Sonnen','Robbie Lawler','Frank Shamrock','Royce Gracie']);
assert.equal(batch.recordCount,10);
assert.equal(batch.fightCount,176);
assert.equal(api.count(),58);
assert.equal(JSON.stringify(context.window.RANKING_DATA),before,'canonical ledgers must not mutate live data');

const expected={"Khamzat Chimaev":{"fightCount":10,"official":"9-1","titleFightWins":1,"adjustedTitleWins":1.0,"prime":"5-1","finishWins":6,"activeEliteYears":4.08},"Leon Edwards":{"fightCount":20,"official":"14-5, 1 NC","titleFightWins":3,"adjustedTitleWins":3.0,"prime":"5-1, 1 NC","finishWins":4,"activeEliteYears":4.87},"Sean O'Malley":{"fightCount":16,"official":"12-3, 1 NC","titleFightWins":2,"adjustedTitleWins":2.0,"prime":"5-2","finishWins":7,"activeEliteYears":3.72},"Sean Strickland":{"fightCount":25,"official":"18-7","titleFightWins":2,"adjustedTitleWins":2.0,"prime":"8-4","finishWins":6,"activeEliteYears":4.95},"Michael Bisping":{"fightCount":29,"official":"20-9","titleFightWins":2,"adjustedTitleWins":1.75,"prime":"8-4","finishWins":10,"activeEliteYears":5.12},"Dan Henderson":{"fightCount":18,"official":"9-9","titleFightWins":0,"adjustedTitleWins":0.0,"prime":"4-3","finishWins":4,"activeEliteYears":4.32},"Chael Sonnen":{"fightCount":14,"official":"7-7","titleFightWins":0,"adjustedTitleWins":0,"prime":"5-2","finishWins":2,"activeEliteYears":3.12},"Robbie Lawler":{"fightCount":26,"official":"14-11, 1 NC","titleFightWins":3,"adjustedTitleWins":2.55,"prime":"8-2","finishWins":7,"activeEliteYears":3.43},"Frank Shamrock":{"fightCount":5,"official":"5-0","titleFightWins":5,"adjustedTitleWins":4.25,"prime":"5-0","finishWins":5,"activeEliteYears":1.76},"Royce Gracie":{"fightCount":13,"official":"11-1-1","titleFightWins":0,"adjustedTitleWins":0.0,"prime":"11-0-1","finishWins":11,"activeEliteYears":1.4}};
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
assert.equal(api.get('Khamzat Chimaev').fights.at(-1).opponent,'Sean Strickland');
assert.equal(api.deriveFor('Khamzat Chimaev').lossExposure.countedLosses.at(-1).phase,'prime');
assert.equal(api.get('Leon Edwards').fights.at(-1).opponent,'Carlos Prates');
assert.equal(api.get('Leon Edwards').fights.some(fight=>fight.opponent==='Daniel Rodriguez'),false);
assert.equal(api.deriveFor('Leon Edwards').lossExposure.countedLosses.find(row=>row.fightId.includes('sean-brady')).phase,'post-prime');
assert.equal(api.get("Sean O'Malley").primeWindow.open,true);
assert.equal(api.get("Sean O'Malley").fights.at(-1).opponent,'Aiemann Zahabi');
assert.equal(api.get('Sean Strickland').fights.at(-1).opponent,'Khamzat Chimaev');
assert.equal(api.get('Sean Strickland').fights.some(fight=>fight.opponent==='Anthony Hernandez'),true);
assert.equal(api.deriveFor('Michael Bisping').lossExposure.countedLosses.find(row=>row.fightId.includes('georges-st-pierre')).phase,'prime');
assert.equal(api.deriveFor('Michael Bisping').lossExposure.countedLosses.find(row=>row.fightId.includes('kelvin-gastelum')).phase,'post-prime');
assert.equal(api.get('Dan Henderson').fights.filter(fight=>fight.event==='UFC 17').length,2);
assert.equal(api.deriveFor('Dan Henderson').championship.titleFightWins,0);
assert.equal(api.deriveFor('Chael Sonnen').lossExposure.countedLosses.find(row=>row.fightId.includes('jon-jones')).divisionContext,'upward');
assert.equal(api.get('Robbie Lawler').fights.find(fight=>fight.opponent==='Steve Berger').officialResult,'no-contest');
assert.equal(api.deriveFor('Frank Shamrock').championship.adjustedTitleWins,4.25);
assert.equal(api.get('Royce Gracie').fights.filter(fight=>fight.championshipContext.type==='tournament').length,11);
assert.equal(api.deriveFor('Royce Gracie').championship.titleFightWins,0);
assert.equal(api.audit().passed,true);
console.log('CANONICAL_TEN_FIGHTER_BATCH_EIGHT_TEST');
console.log(JSON.stringify({version:batch.version,batchFightCount:batch.fightCount,canonicalCount:api.count()},null,2));

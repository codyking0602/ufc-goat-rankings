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
'assets/data/canonical-fighter-facts-batch-eight.js',
'assets/data/canonical-fighter-facts-batch-nine-data-a.js',
'assets/data/canonical-fighter-facts-batch-nine-data-b.js',
'assets/data/canonical-fighter-facts-batch-nine-data-c.js',
'assets/data/canonical-fighter-facts-batch-nine.js'
];
const expectedFighters=['Amanda Nunes','Valentina Shevchenko','Zhang Weili','Rose Namajunas','Miesha Tate','Mackenzie Dern','Kayla Harrison','Jessica Andrade','Alexa Grasso','Julianna Peña','Carla Esparza','Holly Holm','Joanna Jedrzejczyk','Ronda Rousey','Cris Cyborg'];
const sentinel={women:[{fighter:'Amanda Nunes',rank:1,totalScore:69.32,overallOvr:96}],fighters:[{fighter:'Valentina Shevchenko',snapshotStats:{ufcRecord:'stale'}}],meta:{expectedRankLocks:true}};
const before=JSON.stringify(sentinel);
const document={documentElement:{setAttribute(){}}};
const context=vm.createContext({window:{RANKING_DATA:sentinel},document,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});
const api=context.window.UFC_CANONICAL_FIGHTER_FACTS;
const batch=context.window.UFC_CANONICAL_FIGHTER_FACTS_BATCH_NINE;
assert.equal(batch?.applied,true,batch?.error||'batch nine should apply');
assert.deepEqual(JSON.parse(JSON.stringify(batch.fighters)),expectedFighters);
assert.equal(batch.recordCount,15);
assert.equal(batch.fightCount,220);
assert.equal(api.count(),73);
assert.equal(JSON.stringify(context.window.RANKING_DATA),before,'canonical ledgers must not mutate live data');

const expected={
  'Amanda Nunes':{fightCount:18,official:'16-2',titleFightWins:11,adjustedTitleWins:11.25,prime:'12-1',finishWins:10,activeEliteYears:7.26},
  'Valentina Shevchenko':{fightCount:19,official:'15-3-1',titleFightWins:11,adjustedTitleWins:10.9,prime:'14-2-1',finishWins:6,activeEliteYears:9.97},
  'Zhang Weili':{fightCount:13,official:'10-3',titleFightWins:6,adjustedTitleWins:6,prime:'7-3',finishWins:4,activeEliteYears:6.87},
  'Rose Namajunas':{fightCount:19,official:'12-7',titleFightWins:4,adjustedTitleWins:4,prime:'5-2',finishWins:5,activeEliteYears:4.5},
  'Miesha Tate':{fightCount:14,official:'7-7',titleFightWins:1,adjustedTitleWins:1,prime:'3-1',finishWins:3,activeEliteYears:1.44},
  'Mackenzie Dern':{fightCount:16,official:'11-5',titleFightWins:1,adjustedTitleWins:.9,prime:'7-4',finishWins:5,activeEliteYears:5.58},
  'Kayla Harrison':{fightCount:3,official:'3-0',titleFightWins:1,adjustedTitleWins:1,prime:'3-0',finishWins:2,activeEliteYears:2.25},
  'Jessica Andrade':{fightCount:30,official:'17-13',titleFightWins:1,adjustedTitleWins:1,prime:'6-4',finishWins:9,activeEliteYears:4.45},
  'Alexa Grasso':{fightCount:15,official:'9-5-1',titleFightWins:1,adjustedTitleWins:1,prime:'5-2-1',finishWins:3,activeEliteYears:5.41},
  'Julianna Peña':{fightCount:12,official:'8-4',titleFightWins:2,adjustedTitleWins:1.9,prime:'5-4',finishWins:4,activeEliteYears:8.37},
  'Carla Esparza':{fightCount:16,official:'10-6',titleFightWins:2,adjustedTitleWins:1.9,prime:'6-1',finishWins:2,activeEliteYears:3.55},
  'Holly Holm':{fightCount:16,official:'8-7, 1 NC',titleFightWins:1,adjustedTitleWins:1,prime:'5-5',finishWins:2,activeEliteYears:4.89},
  'Joanna Jedrzejczyk':{fightCount:15,official:'10-5',titleFightWins:6,adjustedTitleWins:6,prime:'9-4',finishWins:2,activeEliteYears:5.23},
  'Ronda Rousey':{fightCount:8,official:'6-2',titleFightWins:6,adjustedTitleWins:6,prime:'6-2',finishWins:6,activeEliteYears:3.85},
  'Cris Cyborg':{fightCount:6,official:'5-1',titleFightWins:3,adjustedTitleWins:2.9,prime:'5-1',finishWins:4,activeEliteYears:2.63}
};
for(const [fighter,want] of Object.entries(expected)){
  const record=api.get(fighter);
  const got=api.deriveFor(fighter);
  assert.equal(record.board,'women',`${fighter} board`);
  assert.equal(record.fights.length,want.fightCount,`${fighter} complete UFC bout count`);
  assert.equal(got.officialUfcRecord.text,want.official,`${fighter} official UFC record`);
  assert.equal(got.championship.titleFightWins,want.titleFightWins,`${fighter} official title-fight wins`);
  assert.equal(got.championship.adjustedTitleWins,want.adjustedTitleWins,`${fighter} adjusted title wins`);
  assert.equal(got.prime.recordText,want.prime,`${fighter} prime record`);
  assert.equal(got.finishWins,want.finishWins,`${fighter} UFC finish wins`);
  assert.equal(got.longevity.activeEliteYears,want.activeEliteYears,`${fighter} active elite years`);
}
assert.equal(api.get('Amanda Nunes').fights.at(-1).opponent,'Irene Aldana');
assert.equal(api.get('Valentina Shevchenko').fights.at(-1).opponent,'Zhang Weili');
assert.equal(api.deriveFor('Zhang Weili').lossExposure.countedLosses.at(-1).divisionContext,'upward');
assert.equal(api.deriveFor('Rose Namajunas').lossExposure.countedLosses.at(-1).phase,'post-prime');
assert.equal(api.get('Miesha Tate').fights.at(-1).opponent,'Yana Santos');
assert.equal(api.get('Mackenzie Dern').fights.at(-1).championshipContext.type,'vacant-undisputed');
assert.equal(api.get('Kayla Harrison').fights.length,3);
assert.equal(api.get('Jessica Andrade').fights.at(-1).opponent,'Loopy Godinez');
assert.equal(api.get('Alexa Grasso').fights.at(-1).opponent,'Maycee Barber');
assert.equal(api.get('Julianna Peña').fights.at(-1).opponent,'Kayla Harrison');
assert.equal(api.get('Carla Esparza').fights.at(-1).opponent,'Tecia Pennington');
assert.equal(api.get('Holly Holm').fights.find(fight=>fight.opponent==='Mayra Bueno Silva').officialResult,'no-contest');
assert.equal(api.deriveFor('Joanna Jedrzejczyk').lossExposure.countedLosses.find(row=>row.fightId.includes('valentina-shevchenko')).divisionContext,'upward');
assert.equal(api.deriveFor('Ronda Rousey').prime.finishWins,6);
assert.equal(api.get('Cris Cyborg').fights.some(fight=>fight.event.includes('Strikeforce')||fight.event.includes('Bellator')||fight.event.includes('PFL')),false);
assert.equal(api.audit().passed,true);
console.log('CANONICAL_FIFTEEN_WOMAN_BATCH_NINE_TEST');
console.log(JSON.stringify({version:batch.version,batchFightCount:batch.fightCount,canonicalCount:api.count()},null,2));

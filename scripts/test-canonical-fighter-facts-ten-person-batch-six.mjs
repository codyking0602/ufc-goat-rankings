import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
const files=['assets/data/canonical-fighter-facts.js','assets/data/canonical-fighter-facts-batch-one.js','assets/data/canonical-fighter-facts-batch-two.js','assets/data/canonical-fighter-facts-batch-three.js','assets/data/canonical-fighter-facts-batch-four.js','assets/data/canonical-fighter-facts-batch-five.js','assets/data/canonical-fighter-facts-batch-six.js'];
const sentinel={men:[{fighter:'Petr Yan',rank:16,totalScore:43.35,overallOvr:88}],fighters:[{fighter:'Petr Yan',snapshotStats:{ufcRecord:'stale'}}],meta:{expectedRankLocks:true}};
const before=JSON.stringify(sentinel),document={documentElement:{setAttribute(){}}};
const context=vm.createContext({window:{RANKING_DATA:sentinel},document,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean});
for(const file of files)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});
const api=context.window.UFC_CANONICAL_FIGHTER_FACTS,batch=context.window.UFC_CANONICAL_FIGHTER_FACTS_BATCH_SIX;
assert.ok(api);assert.equal(batch?.applied,true,batch?.error||'batch six should apply');assert.equal(batch.recordCount,10);assert.equal(batch.fightCount,189);assert.equal(api.count(),38);assert.equal(JSON.stringify(context.window.RANKING_DATA),before,'canonical ledgers must not mutate live app data');
const expected=[
 ['Petr Yan',16,'12-4','12-4','6-4',3,2.65],['Merab Dvalishvili',17,'14-3','14-3','8-1',4,4],['B.J. Penn',27,'12-13-2','12-13-2','6-5',5,4.9],['Alex Pereira',13,'10-3','10-3','8-3',6,6.15],['Chuck Liddell',23,'16-7','16-7','7-1',5,5],['Francis Ngannou',14,'12-2','12-2','6-0',2,2],['Henry Cejudo',16,'10-6','10-6','4-1',4,4.15],['Conor McGregor',15,'10-5','10-5','6-2',3,3],['Justin Gaethje',16,'11-5','11-5','7-3',3,2.5],['Dustin Poirier',32,'22-9, 1 NC','22-9','7-4',1,.75]
];
for(const [name,count,official,scoring,prime,titleWins,adjusted] of expected){const r=api.get(name),d=api.deriveFor(name);assert.ok(r&&d,name);assert.equal(r.fights.length,count,`${name} bouts`);assert.equal(d.officialUfcRecord.text,official,`${name} official`);assert.equal(d.scoringRecord.text,scoring,`${name} scoring`);assert.equal(d.prime.recordText,prime,`${name} prime`);assert.equal(d.championship.titleFightWins,titleWins,`${name} title wins`);assert.equal(d.championship.adjustedTitleWins,adjusted,`${name} adjusted title wins`);}
const yan=api.get('Petr Yan').fights.find(f=>f.event==='UFC 259');assert.equal(yan.method.category,'dq');assert.equal(yan.lossClassification.overrideRule,'technical-dq-context');
assert.equal(api.deriveFor('Merab Dvalishvili').championship.titleFightWins,4);
assert.equal(api.get('B.J. Penn').fights.some(f=>String(f.event).includes('Pride')),false);
const gane=api.deriveFor('Alex Pereira').lossExposure.countedLosses.find(x=>x.fightId.includes('ciryl-gane'));assert.equal(gane.phase,'prime');assert.equal(gane.divisionContext,'upward');assert.equal(gane.finished,true);
assert.equal(api.get('Chuck Liddell').fights.some(f=>String(f.event).includes('Pride')),false);
assert.equal(api.get('Francis Ngannou').fights.at(-1).opponent,'Ciryl Gane');
assert.match(api.get('Henry Cejudo').fights.find(f=>f.opponent==='Song Yadong').note,/technical-decision/i);
assert.equal(api.get('Conor McGregor').fights.at(-1).event,'UFC 329');
const gaethje=api.get('Justin Gaethje');assert.equal(gaethje.primeWindow.open,true);assert.equal(gaethje.fights.find(f=>f.event==='UFC 291').championshipContext.type,'none');assert.equal(gaethje.fights.find(f=>f.event==='UFC 300').championshipContext.type,'none');
const dustin=api.get('Dustin Poirier');assert.equal(dustin.fights.find(f=>f.event==='UFC 211').scoringDisposition,'excluded-no-contest');assert.equal(dustin.fights.find(f=>f.event==='UFC 318').championshipContext.type,'none');assert.equal(api.deriveFor('Dustin Poirier').lossExposure.countedLosses.find(x=>x.fightId.includes('max-holloway')).phase,'post-prime');
const audit=api.audit();assert.equal(audit.passed,true,JSON.stringify(audit.invalid,null,2));assert.equal(audit.invalid.length,0);
console.log('CANONICAL_TEN_FIGHTER_BATCH_SIX_TEST');console.log(JSON.stringify({version:batch.version,batchFightCount:batch.fightCount,canonicalCount:api.count()},null,2));

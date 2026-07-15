import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const files=[
  'assets/data/canonical-fighter-facts.js',
  'assets/data/canonical-fighter-facts-batch-one.js',
  'assets/data/canonical-fighter-facts-batch-two.js',
  'assets/data/canonical-fighter-facts-batch-three.js',
  'assets/data/canonical-fighter-facts-batch-four.js',
  'assets/data/canonical-fighter-facts-batch-five.js'
];
const sentinel={
  men:[{"fighter":"Randy Couture","rank":8,"totalScore":50,"overallOvr":92},{"fighter":"Max Holloway","rank":9,"totalScore":49,"overallOvr":91},{"fighter":"Kamaru Usman","rank":10,"totalScore":48,"overallOvr":90},{"fighter":"Jose Aldo","rank":11,"totalScore":47,"overallOvr":89},{"fighter":"Matt Hughes","rank":12,"totalScore":46,"overallOvr":88},{"fighter":"Daniel Cormier","rank":13,"totalScore":45,"overallOvr":87},{"fighter":"Stipe Miocic","rank":14,"totalScore":44,"overallOvr":86},{"fighter":"Ilia Topuria","rank":15,"totalScore":43,"overallOvr":85},{"fighter":"Israel Adesanya","rank":16,"totalScore":42,"overallOvr":84},{"fighter":"Cain Velasquez","rank":17,"totalScore":41,"overallOvr":83}],
  fighters:[{fighter:'Max Holloway',snapshotStats:{ufcRecord:'stale',finishRatePct:0}}],
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
const batch=context.window.UFC_CANONICAL_FIGHTER_FACTS_BATCH_FIVE;
assert.ok(api,'canonical fighter facts API should load');
assert.equal(batch?.applied,true,batch?.error||'ten-fighter batch five should apply');
assert.deepEqual(JSON.parse(JSON.stringify(batch.fighters)),["Randy Couture","Max Holloway","Kamaru Usman","Jose Aldo","Matt Hughes","Daniel Cormier","Stipe Miocic","Ilia Topuria","Israel Adesanya","Cain Velasquez"]);
assert.equal(batch.recordCount,10);
assert.equal(batch.fightCount,202);
assert.equal(api.count(),28,'eighteen prior records plus ten batch-five records should produce twenty-eight canonical fighters');
assert.equal(JSON.stringify(context.window.RANKING_DATA),before,'canonical ledgers must not mutate live score, rank, OVR, snapshot, profile, or Compare Mode data');

const expected={"Randy Couture":{"fightCount":24,"official":"16-8","scoring":"16-8","finishWins":11,"finishRatePct":68.75,"titleFightWins":9,"adjustedTitleWins":8.75,"prime":"6-3","primeFinishWins":4,"primeStoppageLosses":3,"roundsWon":21,"roundsLost":5,"roundsDrawn":0,"roundsWonPct":80.77,"activeEliteYears":4.22,"quality":{"elite":5,"topFive":9,"ranked":11,"raw":13.65}},"Max Holloway":{"fightCount":33,"official":"24-9","scoring":"24-9","finishWins":14,"finishRatePct":58.33,"titleFightWins":5,"adjustedTitleWins":4.75,"prime":"16-6","primeFinishWins":9,"primeStoppageLosses":1,"roundsWon":50,"roundsLost":35,"roundsDrawn":0,"roundsWonPct":58.82,"activeEliteYears":11.24,"quality":{"elite":1,"topFive":11,"ranked":15,"raw":18.5}},"Kamaru Usman":{"fightCount":19,"official":"16-3","scoring":"16-3","finishWins":5,"finishRatePct":31.25,"titleFightWins":6,"adjustedTitleWins":6,"prime":"8-3","primeFinishWins":3,"primeStoppageLosses":1,"roundsWon":34,"roundsLost":14,"roundsDrawn":0,"roundsWonPct":70.83,"activeEliteYears":7.47,"quality":{"elite":1,"topFive":8,"ranked":11,"raw":12.65}},"Jose Aldo":{"fightCount":23,"official":"14-9","scoring":"14-9","finishWins":4,"finishRatePct":28.57,"titleFightWins":8,"adjustedTitleWins":7.75,"prime":"8-3","primeFinishWins":2,"primeStoppageLosses":3,"roundsWon":29,"roundsLost":13,"roundsDrawn":0,"roundsWonPct":69.05,"activeEliteYears":6.59,"quality":{"elite":1,"topFive":7,"ranked":14,"raw":12.6}},"Matt Hughes":{"fightCount":25,"official":"18-7","scoring":"18-7","finishWins":13,"finishRatePct":72.22,"titleFightWins":9,"adjustedTitleWins":8.9,"prime":"13-3","primeFinishWins":10,"primeStoppageLosses":3,"roundsWon":28,"roundsLost":7,"roundsDrawn":0,"roundsWonPct":80,"activeEliteYears":6.15,"quality":{"elite":1,"topFive":9,"ranked":14,"raw":14.9}},"Daniel Cormier":{"fightCount":15,"official":"11-3, 1 NC","scoring":"11-3","finishWins":7,"finishRatePct":63.64,"titleFightWins":6,"adjustedTitleWins":6.15,"prime":"7-3, 1 NC","primeFinishWins":5,"primeStoppageLosses":1,"roundsWon":19,"roundsLost":13,"roundsDrawn":0,"roundsWonPct":59.38,"activeEliteYears":5.62,"quality":{"elite":1,"topFive":6,"ranked":8,"raw":8.9}},"Stipe Miocic":{"fightCount":19,"official":"14-5","scoring":"14-5","finishWins":9,"finishRatePct":64.29,"titleFightWins":6,"adjustedTitleWins":6,"prime":"8-3","primeFinishWins":6,"primeStoppageLosses":2,"roundsWon":22,"roundsLost":9,"roundsDrawn":0,"roundsWonPct":70.97,"activeEliteYears":6.29,"quality":{"elite":2,"topFive":8,"ranked":10,"raw":12}},"Ilia Topuria":{"fightCount":10,"official":"9-1","scoring":"9-1","finishWins":7,"finishRatePct":77.78,"titleFightWins":3,"adjustedTitleWins":3.15,"prime":"4-1","primeFinishWins":3,"primeStoppageLosses":1,"roundsWon":10,"roundsLost":5,"roundsDrawn":0,"roundsWonPct":66.67,"activeEliteYears":3.05,"quality":{"elite":1,"topFive":4,"ranked":5,"raw":6.7}},"Israel Adesanya":{"fightCount":19,"official":"13-6","scoring":"13-6","finishWins":5,"finishRatePct":38.46,"titleFightWins":8,"adjustedTitleWins":7.75,"prime":"8-4","primeFinishWins":3,"primeStoppageLosses":2,"roundsWon":30,"roundsLost":20,"roundsDrawn":0,"roundsWonPct":60,"activeEliteYears":5.35,"quality":{"elite":2,"topFive":9,"ranked":11,"raw":11.9}},"Cain Velasquez":{"fightCount":15,"official":"12-3","scoring":"12-3","finishWins":10,"finishRatePct":83.33,"titleFightWins":4,"adjustedTitleWins":4,"prime":"6-2","primeFinishWins":5,"primeStoppageLosses":2,"roundsWon":15,"roundsLost":3,"roundsDrawn":0,"roundsWonPct":83.33,"activeEliteYears":5.16,"quality":{"elite":2,"topFive":6,"ranked":9,"raw":10.4}}};
for(const [fighter,want] of Object.entries(expected)){
  const record=api.get(fighter);
  const derived=api.deriveFor(fighter);
  assert.ok(record,`${fighter} record should exist`);
  assert.ok(derived,`${fighter} should derive`);
  assert.equal(record.fights.length,want.fightCount,`${fighter} complete UFC bout count`);
  assert.equal(derived.officialUfcRecord.text,want.official,`${fighter} official record`);
  assert.equal(derived.scoringRecord.text,want.scoring,`${fighter} scoring record`);
  assert.equal(derived.finishWins,want.finishWins,`${fighter} UFC finish wins`);
  assert.equal(derived.finishRatePct,want.finishRatePct,`${fighter} UFC finish rate`);
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
  assert.equal(derived.opponentQuality.eliteWins,want.quality.elite,`${fighter} champion-level wins`);
  assert.equal(derived.opponentQuality.topFiveWins,want.quality.topFive,`${fighter} top-five wins`);
  assert.equal(derived.opponentQuality.rankedWins,want.quality.ranked,`${fighter} ranked-quality wins`);
  assert.equal(derived.opponentQuality.rawCredit,want.quality.raw,`${fighter} raw quality credit`);
}

const randy=api.get('Randy Couture');
assert.ok(randy.fights.filter(f=>f.event==='UFC 13').every(f=>f.championshipContext.type==='tournament'));
assert.equal(api.deriveFor('Randy Couture').championship.titleFightWins,9);

const max=api.get('Max Holloway');
assert.equal(max.fights.at(-1).opponent,'Conor McGregor');
assert.equal(max.fights.at(-1).event,'UFC 329');
assert.equal(max.fights.at(-1).officialResult,'win');
assert.equal(max.fights.find(f=>f.event==='UFC 300').championshipContext.type,'none','BMF fights must not create UFC divisional title credit');
assert.equal(max.fights.find(f=>f.event==='UFC 326').championshipContext.type,'none','BMF rematch must not create UFC divisional title credit');

const usman=api.get('Kamaru Usman');
assert.equal(usman.fights.some(f=>f.opponent==='Dricus du Plessis'),false,'future July 18, 2026 fight must be excluded');

const aldo=api.get('Jose Aldo');
assert.equal(aldo.fights.length,23);
assert.equal(aldo.coverage.note.includes('WEC'),true);
assert.equal(aldo.fights.some(f=>String(f.event).includes('WEC')),false,'WEC fights must stay excluded');

const dc=api.get('Daniel Cormier');
assert.equal(dc.fights.some(f=>['Josh Barnett','Antonio Silva'].includes(f.opponent)),false,'Strikeforce fights must stay excluded');
assert.equal(dc.fights.find(f=>f.event==='UFC 214').officialResult,'no-contest');

const stipe=api.deriveFor('Stipe Miocic');
assert.equal(stipe.lossExposure.countedLosses.find(row=>row.fightId.includes('jon-jones')).phase,'post-prime');

const ilia=api.deriveFor('Ilia Topuria');
assert.equal(ilia.prime.recordText,'4-1');
assert.equal(ilia.lossExposure.countedLosses.at(-1).phase,'prime');
assert.equal(ilia.lossExposure.countedLosses.at(-1).finished,true);

const israel=api.deriveFor('Israel Adesanya');
assert.equal(israel.lossExposure.countedLosses.find(row=>row.fightId.includes('joe-pyfer')).phase,'post-prime');

const audit=api.audit();
assert.equal(audit.passed,true,JSON.stringify(audit.invalid,null,2));
assert.equal(audit.invalid.length,0);

console.log('CANONICAL_TEN_FIGHTER_BATCH_FIVE_TEST');
console.log(JSON.stringify({version:batch.version,batchFightCount:batch.fightCount,canonicalCount:api.count(),fighters:Object.fromEntries(Object.keys(expected).map(name=>[name,api.deriveFor(name)]))},null,2));

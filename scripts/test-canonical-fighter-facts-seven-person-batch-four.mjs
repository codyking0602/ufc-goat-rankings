import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const files=[
  'assets/data/canonical-fighter-facts.js',
  'assets/data/canonical-fighter-facts-batch-one.js',
  'assets/data/canonical-fighter-facts-batch-two.js',
  'assets/data/canonical-fighter-facts-batch-three.js',
  'assets/data/canonical-fighter-facts-batch-four.js'
];
const sentinel={
  men:[
    {fighter:'Jon Jones',rank:1,totalScore:88.7,overallOvr:99},
    {fighter:'Georges St-Pierre',rank:2,totalScore:79.26,overallOvr:97},
    {fighter:'Demetrious Johnson',rank:3,totalScore:65.94,overallOvr:96},
    {fighter:'Anderson Silva',rank:4,totalScore:59.31,overallOvr:95},
    {fighter:'Islam Makhachev',rank:5,totalScore:56.71,overallOvr:94},
    {fighter:'Khabib Nurmagomedov',rank:6,totalScore:55.54,overallOvr:94},
    {fighter:'Alexander Volkanovski',rank:7,totalScore:50.89,overallOvr:93}
  ],
  fighters:[{fighter:'Alexander Volkanovski',snapshotStats:{finishRatePct:44.4}}],
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
const batch=context.window.UFC_CANONICAL_FIGHTER_FACTS_BATCH_FOUR;
assert.ok(api,'canonical fighter facts API should load');
assert.equal(batch?.applied,true,batch?.error||'seven-fighter batch four should apply');
assert.deepEqual(JSON.parse(JSON.stringify(batch.fighters)),['Jon Jones','Georges St-Pierre','Demetrious Johnson','Anderson Silva','Islam Makhachev','Khabib Nurmagomedov','Alexander Volkanovski']);
assert.equal(batch.recordCount,7);
assert.equal(batch.fightCount,138);
assert.equal(api.count(),18,'eleven prior records plus seven top-seven records should produce eighteen canonical fighters');
assert.equal(JSON.stringify(context.window.RANKING_DATA),before,'canonical ledgers must not mutate live score, rank, OVR, snapshot, profile, or Compare Mode data');

const expected={"Jon Jones":{"fightCount":24,"official":"22-1, 1 NC","scoring":"22-0","finishWins":12,"finishRatePct":54.55,"titleFightWins":16,"adjustedTitleWins":15.8,"prime":"16-0, 1 NC","primeFinishWins":8,"primeStoppageLosses":0,"roundsWon":52,"roundsLost":8,"roundsDrawn":0,"roundsWonPct":86.67,"activeEliteYears":10.51,"quality":{"elite":2,"topFive":12,"ranked":19,"raw":19.8}},"Georges St-Pierre":{"fightCount":22,"official":"20-2","scoring":"20-2","finishWins":8,"finishRatePct":40.0,"titleFightWins":13,"adjustedTitleWins":13.0,"prime":"14-1","primeFinishWins":5,"primeStoppageLosses":1,"roundsWon":49,"roundsLost":8,"roundsDrawn":0,"roundsWonPct":85.96,"activeEliteYears":8.44,"quality":{"elite":4,"topFive":15,"ranked":19,"raw":19.85}},"Demetrious Johnson":{"fightCount":18,"official":"15-2-1","scoring":"15-2-1","finishWins":7,"finishRatePct":46.67,"titleFightWins":12,"adjustedTitleWins":11.9,"prime":"13-1","primeFinishWins":7,"primeStoppageLosses":0,"roundsWon":45,"roundsLost":10,"roundsDrawn":0,"roundsWonPct":81.82,"activeEliteYears":6.15,"quality":{"elite":0,"topFive":8,"ranked":15,"raw":13.55}},"Anderson Silva":{"fightCount":25,"official":"17-7, 1 NC","scoring":"17-7","finishWins":14,"finishRatePct":82.35,"titleFightWins":11,"adjustedTitleWins":11.0,"prime":"16-2","primeFinishWins":14,"primeStoppageLosses":2,"roundsWon":28,"roundsLost":11,"roundsDrawn":0,"roundsWonPct":71.79,"activeEliteYears":7.5,"quality":{"elite":3,"topFive":10,"ranked":16,"raw":16.1}},"Islam Makhachev":{"fightCount":18,"official":"17-1","scoring":"17-1","finishWins":11,"finishRatePct":64.71,"titleFightWins":6,"adjustedTitleWins":6.15,"prime":"10-0","primeFinishWins":8,"primeStoppageLosses":0,"roundsWon":25,"roundsLost":3,"roundsDrawn":0,"roundsWonPct":89.29,"activeEliteYears":5.35,"quality":{"elite":4,"topFive":4,"ranked":12,"raw":13.65}},"Khabib Nurmagomedov":{"fightCount":13,"official":"13-0","scoring":"13-0","finishWins":7,"finishRatePct":53.85,"titleFightWins":4,"adjustedTitleWins":3.9,"prime":"8-0","primeFinishWins":5,"primeStoppageLosses":0,"roundsWon":23,"roundsLost":2,"roundsDrawn":0,"roundsWonPct":92.0,"activeEliteYears":6.02,"quality":{"elite":0,"topFive":5,"ranked":9,"raw":10.0}},"Alexander Volkanovski":{"fightCount":18,"official":"15-3","scoring":"15-3","finishWins":5,"finishRatePct":33.33,"titleFightWins":8,"adjustedTitleWins":7.9,"prime":"9-3","primeFinishWins":2,"primeStoppageLosses":2,"roundsWon":36,"roundsLost":12,"roundsDrawn":0,"roundsWonPct":75.0,"activeEliteYears":7.17,"quality":{"elite":1,"topFive":8,"ranked":12,"raw":12.8}}};
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

const jones=api.get('Jon Jones');
const hamill=jones.fights.find(fight=>fight.opponent==='Matt Hamill');
assert.equal(hamill.scoringDisposition,'technical-exception');
assert.equal(hamill.lossClassification.competitive,false);
assert.equal(api.deriveFor('Jon Jones').lossExposure.countedLosses.length,0,'Hamill DQ must not become a counted competitive loss');
assert.equal(api.deriveFor('Jon Jones').lossExposure.throughPrimeUfcFights,16,'Jones through-prime exposure excludes the Cormier no contest');
assert.equal(api.deriveFor('Jon Jones').lossExposure.countedLosses.some(row=>row.fightId.includes('stipe-miocic')),false);

const gspLosses=api.deriveFor('Georges St-Pierre').lossExposure.countedLosses;
assert.deepEqual(JSON.parse(JSON.stringify(gspLosses.map(row=>[row.fightId,row.phase,row.finished]))),[
  ['2004-10-22-matt-hughes','pre-prime',true],
  ['2007-04-07-matt-serra','prime',true]
]);

const dj=api.get('Demetrious Johnson');
for(const nonUfcOpponent of ['Adriano Moraes','Rodtang Jitmuangnon'])assert.equal(dj.fights.some(fight=>fight.opponent===nonUfcOpponent),false,'ONE Championship must stay excluded from DJ UFC ledger');

const anderson=api.get('Anderson Silva');
assert.equal(anderson.fights.find(fight=>fight.opponent==='Nick Diaz')?.officialResult,'no-contest');
const weidmanLosses=api.deriveFor('Anderson Silva').lossExposure.countedLosses.filter(row=>row.fightId.includes('chris-weidman'));
assert.equal(weidmanLosses.length,2);
assert.ok(weidmanLosses.every(row=>row.phase==='prime'&&row.finished));

const islam=api.get('Islam Makhachev');
assert.equal(islam.fights.at(-1).opponent,'Jack Della Maddalena');
assert.equal(islam.fights.some(fight=>fight.opponent==='Ian Machado Garry'),false,'future UFC 330 defense must not be counted');
assert.equal(api.deriveFor('Islam Makhachev').championship.titleFightWins,6);

assert.equal(api.deriveFor('Khabib Nurmagomedov').lossExposure.countedLosses.length,0,'Khabib has no UFC loss penalty');
assert.equal(api.deriveFor('Khabib Nurmagomedov').finishWins,7,'Khabib UFC finishes must be derived from all thirteen UFC wins');

const volk=api.get('Alexander Volkanovski');
assert.equal(volk.fights.at(-1).event,'UFC 325');
assert.equal(api.deriveFor('Alexander Volkanovski').finishWins,5,'Volkanovski UFC finish count corrects stale presentation data');
const volkLosses=api.deriveFor('Alexander Volkanovski').lossExposure.countedLosses;
assert.deepEqual(JSON.parse(JSON.stringify(volkLosses.map(row=>[row.opponentTier,row.divisionContext,row.overrideRule,row.finished]))),[
  ['champion-level','upward','prime-upward-elite',false],
  ['champion-level','upward','prime-upward-elite',true],
  ['champion-level','home',null,true]
]);

const audit=api.audit();
assert.equal(audit.passed,true,JSON.stringify(audit.invalid,null,2));
assert.equal(audit.invalid.length,0);

console.log('CANONICAL_SEVEN_FIGHTER_BATCH_FOUR_TEST');
console.log(JSON.stringify({version:batch.version,batchFightCount:batch.fightCount,canonicalCount:api.count(),fighters:Object.fromEntries(Object.keys(expected).map(name=>[name,api.deriveFor(name)]))},null,2));

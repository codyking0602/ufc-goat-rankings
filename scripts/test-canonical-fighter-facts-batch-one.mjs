import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const schemaSource=await fs.readFile('assets/data/canonical-fighter-facts.js','utf8');
const batchSource=await fs.readFile('assets/data/canonical-fighter-facts-batch-one.js','utf8');
const rankingSentinel={
  men:[{fighter:'Charles Oliveira',totalScore:53.33,rank:18,overallOvr:90}],
  fighters:[{fighter:'Charles Oliveira',totalScore:53.33,rank:18,overallOvr:90}]
};
const context=vm.createContext({
  window:{RANKING_DATA:structuredClone(rankingSentinel)},
  console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,structuredClone
});

vm.runInContext(schemaSource,context,{filename:'assets/data/canonical-fighter-facts.js'});
vm.runInContext(batchSource,context,{filename:'assets/data/canonical-fighter-facts-batch-one.js'});

const api=context.window.UFC_CANONICAL_FIGHTER_FACTS;
const batch=context.window.UFC_CANONICAL_FIGHTER_FACTS_BATCH_ONE;
assert.ok(api,'canonical fighter facts API should load');
assert.equal(batch?.applied,true,batch?.error||'batch should apply');
assert.deepEqual(JSON.parse(JSON.stringify(batch.fighters)),['Charles Oliveira']);
assert.equal(api.count(),1);

const record=api.get('Charles Oliveira');
const derived=api.deriveFor('Charles Oliveira');
assert.equal(record.status,'audited');
assert.equal(record.coverage.complete,true);
assert.equal(record.coverage.verifiedThrough,'2026-07-13');
assert.equal(record.fights.length,37);
assert.equal(record.primeWindow.startFightId,'2020-03-14-kevin-lee');
assert.equal(record.primeWindow.open,true);

assert.deepEqual(JSON.parse(JSON.stringify(derived.officialUfcRecord)),{
  wins:25,losses:11,draws:0,noContests:1,text:'25-11, 1 NC'
});
assert.deepEqual(JSON.parse(JSON.stringify(derived.scoringRecord)),{
  wins:25,losses:11,draws:0,noContests:1,technicalExceptions:0,text:'25-11'
});
assert.equal(derived.finishWins,21);
assert.equal(derived.finishRatePct,84);

assert.equal(derived.championship.titleFightWins,2);
assert.equal(derived.championship.adjustedTitleWins,1.76);
const gaethjeTitle=derived.championship.rows.find(row=>row.fightId==='2022-05-07-justin-gaethje');
assert.equal(gaethjeTitle.officialTitleFight,true);
assert.equal(gaethjeTitle.eligible,false);
assert.equal(gaethjeTitle.credit,0);
assert.ok(!derived.championship.rows.some(row=>row.fightId==='2026-03-07-max-holloway-ii'));

assert.equal(derived.opponentQuality.eliteWins,3);
assert.equal(derived.opponentQuality.topFiveWins,6);
assert.equal(derived.opponentQuality.rankedWins,13);
assert.equal(derived.opponentQuality.rawCredit,16.75);

assert.equal(derived.prime.recordText,'9-3');
assert.equal(derived.prime.scoredFights,12);
assert.equal(derived.prime.finishWins,6);
assert.equal(derived.prime.finishPressurePct,50);
assert.equal(derived.prime.stoppageLosses,2);
assert.deepEqual(JSON.parse(JSON.stringify(derived.prime.rounds)),{won:22,lost:9,drawn:0});
assert.equal(derived.prime.roundsWonPct,70.97);

assert.equal(derived.longevity.activeEliteYears,6.33);
assert.equal(derived.longevity.gapCapMonths,18);
assert.equal(derived.longevity.statusMultiplier,1.06);
assert.equal(derived.longevity.divisionStrengthKey,'modern-elite-lightweight-1.10');

assert.equal(derived.lossExposure.throughPrimeUfcFights,36);
assert.equal(derived.lossExposure.countedLosses.length,11);
assert.equal(derived.lossExposure.countedLosses.filter(row=>row.phase==='pre-prime').length,8);
assert.equal(derived.lossExposure.countedLosses.filter(row=>row.phase==='prime').length,3);
assert.equal(derived.lossExposure.countedLosses.filter(row=>row.phase==='post-prime').length,0);
assert.deepEqual(
  derived.lossExposure.countedLosses.filter(row=>row.phase==='prime').map(row=>row.fightId),
  ['2022-10-22-islam-makhachev','2024-04-13-arman-tsarukyan','2025-06-28-ilia-topuria']
);
const hollowayInjury=derived.lossExposure.countedLosses.find(row=>row.fightId==='2015-08-23-max-holloway-i');
assert.equal(hollowayInjury.competitive,false);
assert.equal(hollowayInjury.overrideRule,'technical-injury-context');

assert.deepEqual(
  JSON.parse(JSON.stringify(context.window.RANKING_DATA)),
  rankingSentinel,
  'canonical migration must not change live score, rank, OVR, or profile rows'
);
assert.equal(api.audit().passed,true);

console.log('CANONICAL_FIGHTER_FACTS_BATCH_ONE_TEST');
console.log(JSON.stringify({version:batch.version,fighter:record.fighter,derived},null,2));

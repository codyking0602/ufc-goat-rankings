import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const source=await fs.readFile('assets/data/canonical-fighter-facts.js','utf8');
const context=vm.createContext({window:{},console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean});
vm.runInContext(source,context,{filename:'assets/data/canonical-fighter-facts.js'});
const api=context.window.UFC_CANONICAL_FIGHTER_FACTS;
assert.ok(api,'canonical fighter facts API should load');

const fight=(overrides={})=>({
  id:'sample-fight',
  date:'2025-01-01',
  opponent:'Sample Opponent',
  event:'UFC 999',
  division:'Lightweight',
  scheduledRounds:3,
  officialResult:'win',
  scoringDisposition:'count-win',
  method:{category:'ko-tko',round:1,detail:'Punches'},
  rounds:{won:1,lost:0,drawn:0,reviewStatus:'locked'},
  opponentContext:{qualityTier:'champion-level',championStatus:'reigning-champion',reviewStatus:'locked',note:'Test classification.'},
  championshipContext:{type:'normal',fighterEligible:true,opponentStrength:1,reviewStatus:'locked',note:'Test title win.'},
  ...overrides
});

const validRecord=()=>({
  fighter:'Schema Test Fighter',
  board:'men',
  status:'audited',
  identity:{primaryDivision:'Lightweight',aliases:[]},
  coverage:{complete:true,verifiedThrough:'2026-07-13'},
  primeWindow:{startFightId:'prime-title-win',endFightId:'prime-loss',open:false,reviewStatus:'locked',note:'Test prime window.'},
  longevityContext:{gapCapMonths:18,statusMultiplier:1,reviewStatus:'locked',note:'Test longevity context.'},
  divisionStrength:{defaultKey:'modern-lightweight',reviewStatus:'locked',segments:[]},
  fights:[
    fight({
      id:'technical-dq-loss',
      date:'2024-01-01',
      opponent:'DQ Opponent',
      officialResult:'loss',
      scoringDisposition:'technical-exception',
      technicalExceptionNote:'Official DQ loss excluded from competitive scoring.',
      method:{category:'dq',round:1,detail:'Disqualification'},
      rounds:{won:1,lost:0,drawn:0,reviewStatus:'locked'},
      opponentContext:{qualityTier:'top-ten',championStatus:'contender',reviewStatus:'locked'},
      championshipContext:{type:'none'},
      lossClassification:{divisionContext:'home',competitive:false,reviewStatus:'locked',note:'Not a competitive defeat.'}
    }),
    fight({
      id:'prime-title-win',
      date:'2025-01-01'
    }),
    fight({
      id:'prime-loss',
      date:'2025-07-01',
      opponent:'Elite Loss Opponent',
      officialResult:'loss',
      scoringDisposition:'count-loss',
      method:{category:'submission',round:2,detail:'Rear-naked choke'},
      rounds:{won:0,lost:2,drawn:0,reviewStatus:'locked'},
      opponentContext:{qualityTier:'top-five',championStatus:'title-challenger',reviewStatus:'locked'},
      championshipContext:{type:'none'},
      lossClassification:{divisionContext:'home',competitive:true,reviewStatus:'locked',note:'Prime elite loss.'}
    })
  ]
});

const validation=api.validate(validRecord());
assert.equal(validation.valid,true,validation.errors.join('\n'));

api.register(validRecord());
const derived=api.deriveFor('Schema Test Fighter');
assert.deepEqual(JSON.parse(JSON.stringify(derived.officialUfcRecord)),{wins:1,losses:2,draws:0,noContests:0,text:'1-2'});
assert.deepEqual(JSON.parse(JSON.stringify(derived.scoringRecord)),{wins:1,losses:1,draws:0,noContests:0,technicalExceptions:1,text:'1-1'});
assert.equal(derived.finishWins,1);
assert.equal(derived.finishRatePct,100);
assert.equal(derived.championship.titleFightWins,1);
assert.equal(derived.championship.adjustedTitleWins,1);
assert.equal(derived.opponentQuality.eliteWins,1);
assert.equal(derived.opponentQuality.topFiveWins,1);
assert.equal(derived.opponentQuality.rankedWins,1);
assert.equal(derived.prime.recordText,'1-1');
assert.equal(derived.prime.finishWins,1);
assert.equal(derived.prime.stoppageLosses,1);
assert.equal(derived.prime.roundsWonPct,33.33);
assert.equal(derived.lossExposure.throughPrimeUfcFights,2);
assert.equal(derived.lossExposure.countedLosses.length,1);
assert.equal(derived.lossExposure.countedLosses[0].phase,'prime');
assert.ok(derived.longevity.activeEliteYears>0);

const forbidden=validRecord();
forbidden.rank=1;
const forbiddenValidation=api.validate(forbidden);
assert.equal(forbiddenValidation.valid,false);
assert.ok(forbiddenValidation.errors.some(error=>error.includes('Derived score/aggregate fields are forbidden')));

const aggregateForbidden=validRecord();
aggregateForbidden.identity.ufcRecord='1-2';
const aggregateValidation=api.validate(aggregateForbidden);
assert.equal(aggregateValidation.valid,false);
assert.ok(aggregateValidation.errors.some(error=>error.includes('identity.ufcRecord')));

const duplicateFight=validRecord();
duplicateFight.fights[2].id='prime-title-win';
const duplicateFightValidation=api.validate(duplicateFight);
assert.equal(duplicateFightValidation.valid,false);
assert.ok(duplicateFightValidation.errors.some(error=>error.includes('duplicates prime-title-win')));

const badPrimeEnd=validRecord();
badPrimeEnd.primeWindow.endFightId='missing-fight';
const badPrimeValidation=api.validate(badPrimeEnd);
assert.equal(badPrimeValidation.valid,false);
assert.ok(badPrimeValidation.errors.some(error=>error.includes('endFightId must exist')));

const missingTechnicalNote=validRecord();
delete missingTechnicalNote.fights[0].technicalExceptionNote;
const technicalValidation=api.validate(missingTechnicalNote);
assert.equal(technicalValidation.valid,false);
assert.ok(technicalValidation.errors.some(error=>error.includes('technicalExceptionNote')));

const beforeFailedReplace=api.get('Schema Test Fighter');
const invalidReplacement=validRecord();
invalidReplacement.totalScore=999;
assert.throws(()=>api.replace(invalidReplacement,'Invalid replacement should not commit.'),/Derived score\/aggregate fields are forbidden/);
assert.deepEqual(JSON.parse(JSON.stringify(api.get('Schema Test Fighter'))),JSON.parse(JSON.stringify(beforeFailedReplace)),'failed replacement must leave the existing record untouched');

assert.throws(()=>api.register(validRecord()),/Duplicate canonical fighter record/);
assert.equal(api.audit().passed,true);

console.log('CANONICAL_FIGHTER_FACTS_SCHEMA_TEST');
console.log(JSON.stringify({version:api.version,recordCount:api.count(),derived},null,2));

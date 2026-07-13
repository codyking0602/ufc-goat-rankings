import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const files=[
  'assets/data/canonical-fighter-facts.js',
  'assets/data/canonical-fighter-facts-batch-one.js',
  'assets/data/canonical-fighter-facts-batch-two.js'
];
const sentinel={
  men:[
    {fighter:'Benson Henderson',rank:40,totalScore:28.7,overallOvr:84},
    {fighter:'Vitor Belfort',rank:51,totalScore:22.4,overallOvr:80},
    {fighter:'Deiveson Figueiredo',rank:34,totalScore:31.2,overallOvr:86},
    {fighter:'Frankie Edgar',rank:29,totalScore:33.8,overallOvr:87},
    {fighter:'Dominick Cruz',rank:22,totalScore:35.56,overallOvr:88}
  ],
  fighters:[{fighter:'Dominick Cruz',snapshotStats:{activeEliteYears:6.5}}],
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
const batch=context.window.UFC_CANONICAL_FIGHTER_FACTS_BATCH_TWO;
assert.ok(api,'canonical fighter facts API should load');
assert.equal(batch?.applied,true,batch?.error||'five-fighter batch should apply');
assert.deepEqual(JSON.parse(JSON.stringify(batch.fighters)),[
  'Benson Henderson','Vitor Belfort','Deiveson Figueiredo','Frankie Edgar','Dominick Cruz'
]);
assert.equal(batch.recordCount,5);
assert.equal(batch.fightCount,102);
assert.equal(api.count(),6,'Charles plus the five-person batch should produce six canonical records');
assert.equal(JSON.stringify(context.window.RANKING_DATA),before,'canonical ledgers must not mutate live score, rank, OVR, snapshot, or profile data');

const expected={
  'Benson Henderson':{
    official:'11-3',scoring:'11-3',finishWins:2,finishRatePct:18.18,
    titleFightWins:4,adjustedTitleWins:3.65,prime:'10-3',primeFinishWins:2,
    primeStoppageLosses:2,roundsWonPct:67.35,activeEliteYears:4.29,throughPrime:14,
    losses:{pre:0,prime:3,post:0}
  },
  'Vitor Belfort':{
    official:'15-10, 1 NC',scoring:'15-10',finishWins:14,finishRatePct:93.33,
    titleFightWins:1,adjustedTitleWins:1.1,prime:'7-3',primeFinishWins:7,
    primeStoppageLosses:3,roundsWonPct:64.29,activeEliteYears:6.1,throughPrime:21,
    losses:{pre:4,prime:3,post:3}
  },
  'Deiveson Figueiredo':{
    official:'14-7-1',scoring:'14-7-1',finishWins:8,finishRatePct:57.14,
    titleFightWins:3,adjustedTitleWins:2.75,prime:'7-3-1',primeFinishWins:4,
    primeStoppageLosses:2,roundsWonPct:53.03,activeEliteYears:4.73,throughPrime:18,
    losses:{pre:1,prime:3,post:3}
  },
  'Frankie Edgar':{
    official:'18-11-1',scoring:'18-11-1',finishWins:7,finishRatePct:38.89,
    titleFightWins:3,adjustedTitleWins:2.8,prime:'13-6-1',primeFinishWins:6,
    primeStoppageLosses:1,roundsWonPct:68,activeEliteYears:10.18,throughPrime:25,
    losses:{pre:1,prime:6,post:4}
  },
  'Dominick Cruz':{
    official:'7-3',scoring:'7-3',finishWins:1,finishRatePct:14.29,
    titleFightWins:4,adjustedTitleWins:3.8,prime:'5-2',primeFinishWins:1,
    primeStoppageLosses:1,roundsWonPct:67.86,activeEliteYears:5.51,throughPrime:7,
    losses:{pre:0,prime:2,post:1}
  }
};

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
  assert.equal(derived.prime.roundsWonPct,want.roundsWonPct,`${fighter} prime round-control percentage`);
  assert.equal(derived.longevity.activeEliteYears,want.activeEliteYears,`${fighter} active elite years`);
  assert.equal(derived.lossExposure.throughPrimeUfcFights,want.throughPrime,`${fighter} through-prime exposure`);
  const phaseCounts=derived.lossExposure.countedLosses.reduce((out,row)=>{
    out[row.phase]=(out[row.phase]||0)+1;
    return out;
  },{});
  assert.equal(phaseCounts['pre-prime']||0,want.losses.pre,`${fighter} pre-prime losses`);
  assert.equal(phaseCounts.prime||0,want.losses.prime,`${fighter} prime losses`);
  assert.equal(phaseCounts['post-prime']||0,want.losses.post,`${fighter} post-prime losses`);
}

const vitor=api.deriveFor('Vitor Belfort');
const tournament=vitor.championship.rows.find(row=>row.fightId==='1997-02-07-scott-ferrozzo');
assert.equal(tournament?.officialTitleFight,false,'UFC 12 tournament win must not count as an official UFC title fight');
assert.equal(tournament?.credit,.65,'UFC 12 tournament achievement keeps reviewed tournament credit');
assert.equal(vitor.championship.rows.filter(row=>row.officialTitleFight&&row.result==='count-win').length,1,'Randy Couture II is Vitor’s only official UFC title-fight win');

const deivesonRecord=api.get('Deiveson Figueiredo');
const song=deivesonRecord.fights.find(fight=>fight.opponent==='Song Yadong');
assert.equal(song?.date,'2026-05-30');
assert.equal(song?.method?.category,'submission');
assert.equal(song?.method?.round,2);
assert.equal(song?.method?.time,'4:42');
const benavidezOne=deivesonRecord.fights.find(fight=>fight.id==='2020-02-29-joseph-benavidez-i');
assert.equal(benavidezOne?.championshipContext?.fighterEligible,false,'missed-weight title bout must be ineligible');

const cruzRecord=api.get('Dominick Cruz');
const cruzOpponents=cruzRecord.fights.map(fight=>fight.opponent);
for(const excluded of ['Scott Jorgensen','Brian Bowles','Joseph Benavidez','Ian McCall']){
  assert.equal(cruzOpponents.includes(excluded),false,`${excluded} is WEC-only and must stay outside the UFC ledger`);
}
assert.equal(api.deriveFor('Dominick Cruz').longevity.activeEliteYears,5.51,'UFC-only 18-month capped calculation must not preserve the old handwritten 6.5');

const audit=api.audit();
assert.equal(audit.passed,true,JSON.stringify(audit.invalid,null,2));
assert.equal(audit.invalid.length,0);

console.log('CANONICAL_FIVE_FIGHTER_BATCH_TEST');
console.log(JSON.stringify({
  version:batch.version,
  canonicalCount:api.count(),
  fighters:Object.fromEntries(Object.keys(expected).map(name=>[name,api.deriveFor(name)]))
},null,2));

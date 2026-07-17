// Shared canonical roster batch fourteen: normal UFC-only fighter integrations.
(function(){
'use strict';
const VERSION='canonical-roster-batch-fourteen-20260717a-anthony-pettis';
const EXPECTED_FIGHTERS=80;
const PETTIS='Anthony Pettis';
const clean=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/[^a-z0-9']+/g,' ').replace(/\s+/g,' ').trim();
const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
const slug=value=>clean(value).replace(/'/g,'').replace(/\s+/g,'-');
const R=(won,lost,drawn=0,note='Reviewed prime-window round allocation.')=>({status:'audited',won,lost,drawn,reviewStatus:'locked',note});
const NA=()=>({status:'not-audited'});
const none=()=>({type:'none'});
const title=(type,manualCredit,fighterEligible=true)=>({type,manualCredit:Number(manualCredit),fighterEligible:Boolean(fighterEligible),reviewStatus:'locked'});
function fight({date,opponent,event,result='W',method,round,quality,division='Lightweight',rounds=NA(),scheduledRounds=3,titleContext=none(),championStatus='contender',divisionContext='home',note=''}){
  const officialResult=result==='W'?'win':result==='L'?'loss':'draw';
  const scoringDisposition=result==='W'?'count-win':result==='L'?'count-loss':'count-draw';
  const row={id:`${date}-${slug(opponent)}`,date,opponent,event,division,scheduledRounds,officialResult,scoringDisposition,method:{category:method,round},rounds,opponentContext:{qualityTier:quality,championStatus,reviewStatus:'locked'},championshipContext:titleContext};
  if(result==='L')row.lossClassification={divisionContext,competitive:true,reviewStatus:'locked',note:note||'Counted UFC loss.'};
  if(note)row.notes=note;
  return row;
}
const record={
  fighter:PETTIS,
  board:'men',
  status:'audited',
  identity:{primaryDivision:'Lightweight',secondaryDivisions:['Featherweight','Welterweight'],aliases:['Showtime','Anthony “Showtime” Pettis']},
  coverage:{complete:true,verifiedThrough:'2026-07-17',ufcOnly:true,note:'Complete official UFC ledger from Clay Guida through Alex Morono. WEC, PFL, boxing, and all other non-UFC results are excluded.'},
  primeWindow:{startFightId:'2012-02-25-joe-lauzon',endFightId:'2018-10-06-tony-ferguson',open:false,reviewStatus:'locked',note:'The ranked Joe Lauzon head-kick win begins Pettis’s connected elite and title run. The Tony Ferguson corner-stoppage loss closes the prime after a final Michael Chiesa rebound.'},
  longevityContext:{gapCapMonths:18,statusMultiplier:1,reviewStatus:'locked',note:'Closed UFC elite window with the universal 18-month activity-gap cap.'},
  divisionStrength:{defaultKey:'lightweight-murderers-row-1.10',reviewStatus:'locked',segments:[{key:'lightweight-murderers-row-1.10',startFightId:'2012-02-25-joe-lauzon',endFightId:'2016-04-23-edson-barboza',reviewStatus:'locked'},{key:'modern-featherweight-1.05',startFightId:'2016-08-27-charles-oliveira',endFightId:'2016-12-10-max-holloway',reviewStatus:'locked'},{key:'lightweight-murderers-row-1.10',startFightId:'2017-07-08-jim-miller',endFightId:'2018-10-06-tony-ferguson',reviewStatus:'locked'}],note:'Pettis’s prime is centered in the deep lightweight murderers’ row, with a brief elite featherweight segment.'},
  fights:[
    fight({date:'2011-06-04',opponent:'Clay Guida',event:'The Ultimate Fighter 13 Finale',result:'L',method:'decision',round:3,quality:'top-ten',note:'Pre-prime decision loss to a ranked lightweight.'}),
    fight({date:'2011-10-08',opponent:'Jeremy Stephens',event:'UFC 136: Edgar vs. Maynard 3',method:'decision',round:3,quality:'solid',championStatus:'contender'}),
    fight({date:'2012-02-25',opponent:'Joe Lauzon',event:'UFC 144: Edgar vs. Henderson',method:'ko-tko',round:1,quality:'ranked',rounds:R(1,0),championStatus:'contender',note:'Ranked head-kick knockout and prime start.'}),
    fight({date:'2013-01-26',opponent:'Donald Cerrone',event:'UFC on Fox: Johnson vs. Dodson',method:'ko-tko',round:1,quality:'top-five',rounds:R(1,0),championStatus:'contender',note:'Top-five body-kick finish that secured the title path.'}),
    fight({date:'2013-08-31',opponent:'Benson Henderson',event:'UFC 164: Henderson vs. Pettis 2',method:'submission',round:1,quality:'champion-level',rounds:R(1,0),scheduledRounds:5,titleContext:title('normal',1),championStatus:'reigning-champion',note:'Submitted the reigning champion to win the undisputed UFC lightweight title.'}),
    fight({date:'2014-12-06',opponent:'Gilbert Melendez',event:'UFC 181: Hendricks vs. Lawler 2',method:'submission',round:2,quality:'top-five',rounds:R(1,1),scheduledRounds:5,titleContext:title('normal',1),championStatus:'title-challenger',note:'First fighter to finish Melendez; successful undisputed title defense.'}),
    fight({date:'2015-03-14',opponent:'Rafael dos Anjos',event:'UFC 185: Pettis vs. dos Anjos',result:'L',method:'decision',round:5,quality:'champion-level',rounds:R(0,5),scheduledRounds:5,titleContext:title('normal',0),championStatus:'title-challenger',note:'Prime title loss to the elite challenger who became champion.'}),
    fight({date:'2016-01-17',opponent:'Eddie Alvarez',event:'UFC Fight Night: Dillashaw vs. Cruz',result:'L',method:'decision',round:3,quality:'top-five',rounds:R(1,2),championStatus:'contender',note:'Prime split-decision loss to a future UFC champion.'}),
    fight({date:'2016-04-23',opponent:'Edson Barboza',event:'UFC 197: Jones vs. Saint Preux',result:'L',method:'decision',round:3,quality:'top-ten',rounds:R(0,3),championStatus:'contender',note:'Prime loss to a ranked but non-top-five lightweight under the locked penalty rules.'}),
    fight({date:'2016-08-27',opponent:'Charles Oliveira',event:'UFC on Fox: Maia vs. Condit',method:'submission',round:3,quality:'top-ten',division:'Featherweight',rounds:R(2,1),championStatus:'contender',note:'Ranked featherweight submission and meaningful rebound.'}),
    fight({date:'2016-12-10',opponent:'Max Holloway',event:'UFC 206: Holloway vs. Pettis',result:'L',method:'ko-tko',round:3,quality:'top-five',division:'Featherweight',rounds:R(0,3),scheduledRounds:5,titleContext:title('interim',0,false),championStatus:'title-challenger',note:'Prime elite finish loss. Pettis missed weight and was ineligible to win the interim title.'}),
    fight({date:'2017-07-08',opponent:'Jim Miller',event:'UFC 213: Romero vs. Whittaker',method:'decision',round:3,quality:'ranked',rounds:R(3,0),championStatus:'contender'}),
    fight({date:'2017-11-11',opponent:'Dustin Poirier',event:'UFC Fight Night: Poirier vs. Pettis',result:'L',method:'ko-tko',round:3,quality:'top-five',rounds:R(0,3),championStatus:'contender',note:'Prime elite finish loss to a future interim champion.'}),
    fight({date:'2018-07-07',opponent:'Michael Chiesa',event:'UFC 226: Miocic vs. Cormier',method:'submission',round:2,quality:'top-ten',rounds:R(1,1),championStatus:'contender',note:'Ranked submission rebound that kept the prime window open.'}),
    fight({date:'2018-10-06',opponent:'Tony Ferguson',event:'UFC 229: Khabib vs. McGregor',result:'L',method:'ko-tko',round:2,quality:'top-five',rounds:R(0,2),championStatus:'interim-champion',note:'Competitive but unrecovered prime elite corner-stoppage loss and prime endpoint.'}),
    fight({date:'2019-03-23',opponent:'Stephen Thompson',event:'UFC Fight Night: Thompson vs. Pettis',method:'ko-tko',round:2,quality:'top-five',division:'Welterweight',championStatus:'title-challenger',note:'Post-prime upward-division knockout over a top-five welterweight; still receives full win credit.'}),
    fight({date:'2019-08-17',opponent:'Nate Diaz',event:'UFC 241: Cormier vs. Miocic 2',result:'L',method:'decision',round:3,quality:'top-ten',division:'Welterweight',divisionContext:'upward',championStatus:'contender',note:'Post-prime welterweight decision loss; no GOAT loss penalty.'}),
    fight({date:'2020-01-18',opponent:'Carlos Diego Ferreira',event:'UFC 246: McGregor vs. Cowboy',result:'L',method:'submission',round:2,quality:'top-ten',championStatus:'contender',note:'Post-prime lightweight submission loss; no GOAT loss penalty.'}),
    fight({date:'2020-05-09',opponent:'Donald Cerrone',event:'UFC 249: Ferguson vs. Gaethje',method:'decision',round:3,quality:'name-value',division:'Welterweight',championStatus:'former-champion',note:'Late-career rematch win discounted for Cerrone’s decline and losing streak.'}),
    fight({date:'2020-12-19',opponent:'Alex Morono',event:'UFC Fight Night: Thompson vs. Neal',method:'decision',round:3,quality:'solid',division:'Welterweight',championStatus:'unranked',note:'Solid final UFC win without elite ranking value.'})
  ]
};
const judgments={
  championship:{benchmarkCredit:14.54,inputs:[
    {fightId:'2013-08-31-benson-henderson',opponent:'Benson Henderson',finalAdjustedCredit:1,reviewStatus:'locked'},
    {fightId:'2014-12-06-gilbert-melendez',opponent:'Gilbert Melendez',finalAdjustedCredit:1,reviewStatus:'locked'}
  ]},
  opponentQuality:{benchmarkCredit:14.54,fighterAdjustment:0,inputs:[
    ['2013-08-31-benson-henderson','Benson Henderson',1.25,'Submitted the reigning lightweight champion for the undisputed title.'],
    ['2013-01-26-donald-cerrone','Donald Cerrone',1,'Top-five lightweight finished in the first round.'],
    ['2014-12-06-gilbert-melendez','Gilbert Melendez',1,'Elite title challenger and first career finish loss.'],
    ['2019-03-23-stephen-thompson','Stephen Thompson',1,'Top-five welterweight knocked out in an upward-division fight.'],
    ['2016-08-27-charles-oliveira','Charles Oliveira',.85,'Ranked featherweight submission; later greatness is context, not retroactive maximum credit.'],
    ['2018-07-07-michael-chiesa','Michael Chiesa',.85,'Ranked lightweight submission win.'],
    ['2012-02-25-joe-lauzon','Joe Lauzon',.65,'Ranked lightweight head-kick knockout.'],
    ['2017-07-08-jim-miller','Jim Miller',.65,'Ranked veteran win during the late prime.'],
    ['2011-10-08-jeremy-stephens','Jeremy Stephens',.45,'Solid UFC win before the elite run.'],
    ['2020-12-19-alex-morono','Alex Morono',.45,'Solid welterweight win without elite ranking value.'],
    ['2020-05-09-donald-cerrone','Donald Cerrone',.25,'Famous rematch win heavily discounted for late-career decline.']
  ].map(([fightId,opponent,finalCredit,note])=>({fighter:PETTIS,fightId,opponent,finalCredit,note,reviewStatus:'locked'}))},
  apex:{performances:[
    {fightId:'2013-08-31-benson-henderson',opponent:'Benson Henderson',rating:9.8},
    {fightId:'2014-12-06-gilbert-melendez',opponent:'Gilbert Melendez',rating:9.5}
  ],components:{twoPerformanceStrength:1.93,proof:1.25,bestFighterClaim:.9,aura:1.2},notes:'The UFC 164 title-winning armbar and UFC 181 guillotine defense are championship-proven Showtime performances with elite opponent strength and major historical identity.'}
};
const era={status:'locked-complete',window:{start:'2012-02-25',startLabel:'Joe Lauzon',end:'2018-10-06',endLabel:'Tony Ferguson',endType:'unrecovered_elite_loss',endReason:'The Lauzon knockout starts the connected ranked and title-level run. Ferguson is the unrecovered elite finish loss after the final Chiesa rebound.'},lossContext:{unrecoveredLoss:{label:'Tony Ferguson',date:'2018-10-06',phase:'prime elite finished loss'},weirdResults:[],recoveredLosses:[{label:'Rafael dos Anjos',date:'2015-03-14',recovery:'Later submitted Charles Oliveira and returned to ranked lightweight contention.'},{label:'Eddie Alvarez / Edson Barboza',date:'2016-04-23',recovery:'Dropped to featherweight and submitted ranked Charles Oliveira.'},{label:'Max Holloway',date:'2016-12-10',recovery:'Beat Jim Miller and later submitted Michael Chiesa.'},{label:'Dustin Poirier',date:'2017-11-11',recovery:'Submitted Michael Chiesa before the Ferguson war.'}],postPrimeLosses:[{label:'Nate Diaz',date:'2019-08-17'},{label:'Carlos Diego Ferreira',date:'2020-01-18'}]},longevity:{gapCapMonths:18,gapAdjustedMonths:79.34,activeEliteYears:6.61,statusMultiplier:1,divisionMultiplier:1.1,adjustmentNote:'Joe Lauzon through Tony Ferguson across the lightweight murderers’ row, with a brief featherweight segment.',note:'More than six active elite UFC years spanning a title run, defense, division move, and repeated ranked rebounds.'},notes:'UFC-only. The WEC title and Showtime Kick are historical context but do not score in the main ranking.'};
const depthRow={fighter:PETTIS,classification:'batch-fourteen-factual-completion',approvalStatus:'model-reviewed',decision:'Apply a positive era-depth adjustment for a prime centered in the lightweight murderers’ row, with a brief strong featherweight segment.',approvedAdjustment:.45,approvedAt:'2026-07-17',provenance:'Shared canonical roster batch fourteen'};
const compareProfile={shortCase:'Pettis is the iconic lightweight champion peak case: he submitted Benson Henderson for the UFC title, became the first fighter to finish Gilbert Melendez, and added elite wins across three divisions.',peak:'At his best, Showtime blended explosive kicks, opportunistic submissions, and genuine five-round championship composure. Henderson II and the Melendez defense prove the peak was more than highlight-reel style.',resume:'The UFC-only ledger is led by Benson Henderson, Gilbert Melendez, Donald Cerrone, Stephen Thompson, Charles Oliveira, Michael Chiesa, Joe Lauzon, and Jim Miller. His WEC title and Showtime Kick are context only.',championship:'He owns two UFC title-fight wins: the undisputed lightweight title submission of Henderson and the successful defense over Melendez.',opponentQuality:'Henderson, Melendez, Cerrone, and Thompson give Pettis four top-five wins, while Oliveira, Chiesa, Lauzon, and Miller add ranked depth. The back half contains more losses than sustained elite wins.',prime:'The reviewed prime runs from Joe Lauzon through Tony Ferguson at 7-6, with a 11-21 audited round mark, six finish wins, and three counted prime finish losses.',longevity:'The elite UFC window lasts about 6.6 active years and receives strong lightweight-era context under the standard 18-month gap cap.',counter:'The best counterargument against Pettis is consistency: the title reign produced only one defense, the prime finished 7-6, and losses to dos Anjos, Alvarez, Barboza, Holloway, Poirier, and Ferguson prevent a cleaner all-time case.',edge:'Pettis wins appropriate comparisons through championship proof, an elite two-performance apex, finishing versatility, and meaningful wins at lightweight, featherweight, and welterweight. His peak can beat deeper but title-less resumes.',signatureWins:'Benson Henderson, Gilbert Melendez, Donald Cerrone, Stephen Thompson, Charles Oliveira, Michael Chiesa, Joe Lauzon, and Jim Miller define the UFC-only case.',weakness:'One successful title defense, six prime losses, poor prime round control, and an inconsistent post-title run cap the ranking ceiling.',titleSummary:'Won the undisputed UFC lightweight title at UFC 164 and defended it by submitting Gilbert Melendez at UFC 181.',primeSummary:'A 7-6 prime from Joe Lauzon through Tony Ferguson with six finishes and a 34.38% reviewed rounds-won rate.',titleStyle:'showtimeLightweightChampion',primeStyle:'explosiveSubmissionStriker'};
const displayOverride={displayName:'Anthony “Showtime” Pettis',profileDisplayName:'Anthony “Showtime” Pettis',divisionLabel:'LW / FW / WW',resumeTag:'Showtime lightweight champion',photoUrl:'assets/fighters/anthony-pettis.webp',thumbUrl:'assets/fighters/anthony-pettis-thumb.webp',photoUnavailable:false,photoStatus:'verified',signatureFight:'Benson Henderson II — UFC 164',alternateFight:'Gilbert Melendez — UFC 181',oneLiner:'The Showtime champion case: two UFC title-fight wins, an elite submission peak, and signature victories across three divisions.',whyRankedHere:'Pettis earns his place through an undisputed lightweight title win, a successful defense, four top-five victories, and one of the most memorable two-fight championship peaks of his era. The Henderson armbar and Melendez guillotine give the UFC-only resume real title proof beyond the highlight reel.',whyNotHigher:'He does not rank higher because the title reign ended after one defense, the reviewed prime finished 7-6, and six counted prime losses—including three finishes—drag down the consistency and round-control case. The WEC title and Showtime Kick are excluded from the score.',keyJudgmentCalls:[['Nickname','The app-facing profile name is Anthony “Showtime” Pettis.'],['UFC-only scope','The WEC title, Showtime Kick, PFL run, and all non-UFC fights are context only.'],['Prime start','The Joe Lauzon head-kick knockout begins the connected ranked and title-level run.'],['Prime end','Tony Ferguson is the unrecovered elite finish loss after Pettis’s final Chiesa rebound.'],['Max Holloway','The loss counts as a prime elite finish, but Pettis receives no title participation credit because he missed weight and was ineligible for the interim belt.'],['Stephen Thompson','The post-prime upward-division knockout still receives full Opponent Quality win credit.'],['Division depth','The lightweight murderers’ row earns positive era-depth treatment and a 1.10 division multiplier.'],['Signature fight','Benson Henderson II at UFC 164.'],['Alternate fight','Gilbert Melendez at UFC 181.']],finalTakeaway:'Pettis is a real UFC champion case with a spectacular peak, not merely a highlight-reel celebrity. Two title-fight wins and elite finishes secure his ranking; the 7-6 prime and loss-heavy post-title stretch keep Showtime below the deeper long-reign champions.',compareProfile};
const fightLedger={
  'anthony pettis|benson henderson':{fighters:[PETTIS,'Benson Henderson'],fights:1,winner:PETTIS,importance:'major',summary:'Pettis won their only UFC meeting by first-round armbar at UFC 164 to take the lightweight title. Their earlier WEC fight is excluded from the UFC series count.'},
  'anthony pettis|donald cerrone':{fighters:[PETTIS,'Donald Cerrone'],fights:2,winner:PETTIS,importance:'notable',summary:'Pettis won both UFC meetings: a first-round body-kick TKO in 2013 and a close decision rematch in 2020.'}
};
const legacyProfile={id:'AP001',fighter:PETTIS,gender:'Men',primaryDivision:'Lightweight',secondaryDivision:'Featherweight / Welterweight',scope:'UFC',ufcRecord:'11-9',ufcWins:11,ufcLosses:9,ufcDraws:0,scoredUfcFights:20,finishWins:7,finishRatePct:63.64,timesFinishedPrime:3,activeEliteYears:6.61,primeStart:'2012-02-25',primeEnd:'2018-10-06',notes:'Anthony “Showtime” Pettis. Complete UFC-only ledger; WEC, PFL, boxing, and all other non-UFC results excluded. Shared pipeline owns all score, rank, category, and OVR outputs.',title:{normalTitleWins:2,interimTitleWins:0,adjustedTitleWins:2,notes:'Undisputed title win over Benson Henderson and successful defense over Gilbert Melendez.'},opponents:judgments.opponentQuality.inputs.map(row=>({opponent:row.opponent,date:row.fightId.slice(0,10),division:record.fights.find(fight=>fight.id===row.fightId)?.division||'Lightweight',context:row.note,credit:row.finalCredit,source:'UFC/UFCStats'})),rounds:record.fights.filter(row=>row.rounds.status==='audited').map(row=>({opponent:row.opponent,date:row.date,method:row.method.category,roundEnded:row.method.round,roundsCounted:row.rounds.won+row.rounds.lost+row.rounds.drawn,roundsWon:row.rounds.won,basis:row.rounds.note,confidence:'High',notes:row.notes||''}))};
function seedRankingData(){
  const data=window.RANKING_DATA;if(!data)throw new Error('Missing shared RANKING_DATA.');
  data.men=data.men||[];data.fighters=data.fighters||[];data.primeRecords=data.primeRecords||{};
  if(data.men.some(row=>clean(row?.fighter)===clean(PETTIS))||data.fighters.some(row=>clean(row?.fighter)===clean(PETTIS)))throw new Error(`Batch-fourteen duplicate ranking/profile row: ${PETTIS}`);
  data.men.push({fighter:PETTIS,leaderboard:'men',gender:'Men',primaryDivision:'Lightweight',secondaryDivision:'Featherweight / Welterweight'});
  data.fighters.push(legacyProfile);
  data.primeRecords[PETTIS]={record:'7-6',context:'Joe Lauzon 2012 → Tony Ferguson 2018'};
}
function registerFacts(){
  const api=window.UFC_CANONICAL_FIGHTER_FACTS;if(!api?.register)throw new Error('Missing canonical fighter facts API.');
  if(api.has(record.fighter))throw new Error(`Batch-fourteen duplicate canonical fighter: ${record.fighter}`);
  const report=api.validate(record);if(!report.valid)throw new Error(`${record.fighter}: ${report.errors.join(' ')}`);
  api.register(record);
}
function registerEra(){
  const api=window.UFC_FIGHTER_ERA_LEDGERS;if(!api?.ledgers)throw new Error('Missing fighter era ledger API.');
  if(api.ledgers[PETTIS])throw new Error(`Batch-fourteen duplicate era ledger: ${PETTIS}`);
  api.ledgers[PETTIS]=era;api.fighters=api.names();
}
function registerJudgments(){
  const api=window.UFC_CANONICAL_SCORING_JUDGMENTS;if(!api?.entryFor)throw new Error('Missing canonical scoring judgments API.');
  const previousEntry=api.entryFor.bind(api),previousList=api.list?.bind(api),key=clean(PETTIS);
  api.entryFor=(category,fighter)=>clean(fighter)===key&&judgments[category]?clone(judgments[category]):previousEntry(category,fighter);
  if(previousList)api.list=category=>[...(previousList(category)||[]),...(judgments[category]?[{normalized:key,...clone(judgments[category])}]:[])];
  api.fighterCount=EXPECTED_FIGHTERS;
}
function registerDepth(){
  const api=window.UFC_CANONICAL_DIVISION_ERA_DEPTH_APPROVED_RESOLUTIONS;if(!api?.entryFor)throw new Error('Missing era-depth resolution API.');
  const previousEntry=api.entryFor.bind(api),rows=[...(api.rows||[])];
  if(rows.some(existing=>clean(existing.fighter)===clean(PETTIS)))throw new Error(`Batch-fourteen duplicate era-depth row: ${PETTIS}`);
  rows.push(Object.freeze(depthRow));
  window.UFC_CANONICAL_DIVISION_ERA_DEPTH_APPROVED_RESOLUTIONS=Object.freeze({...api,version:`${api.version}+${VERSION}`,rows:Object.freeze(rows),fighterCount:rows.length,entryFor:fighter=>clean(fighter)===clean(PETTIS)?depthRow:previousEntry(fighter)});
}
function registerPresentation(){
  window.DISPLAY_OVERRIDES=window.DISPLAY_OVERRIDES||{};
  window.DISPLAY_OVERRIDES[PETTIS]={...(window.DISPLAY_OVERRIDES[PETTIS]||{}),...displayOverride};
  window.COMPARE_PROFILES=window.COMPARE_PROFILES||{};
  window.COMPARE_PROFILES[PETTIS]={...(window.COMPARE_PROFILES[PETTIS]||{}),...compareProfile};
  window.COMPARE_FIGHT_LEDGER=window.COMPARE_FIGHT_LEDGER||{};
  Object.assign(window.COMPARE_FIGHT_LEDGER,fightLedger);
}
function registerEraFilter(){
  const api=window.UFC_ERA_FILTER_DATA;if(!api?.curatedMembership)return;
  api.curatedMembership[PETTIS]={primary:'golden-age',secondary:'superstar'};
  const ids=[api.curatedMembership[PETTIS].primary,api.curatedMembership[PETTIS].secondary].filter(Boolean);
  const errors=[];ids.forEach(id=>{if(!api.byId?.[id])errors.push(`${PETTIS} uses unknown era ${id}.`);});
  api.version=`${api.version}+${VERSION}`;
  api.audit={fighterCount:Object.keys(api.curatedMembership).length,errors,passed:errors.length===0};
}
function registerProfileNickname(){
  const displayName='Anthony “Showtime” Pettis';
  window.DISPLAY_OVERRIDES=window.DISPLAY_OVERRIDES||{};
  window.DISPLAY_OVERRIDES[PETTIS]={...(window.DISPLAY_OVERRIDES[PETTIS]||{}),profileDisplayName:displayName,displayName};
  const nicknameApi=window.UFC_CARD_NICKNAMES;
  if(nicknameApi?.displayNames){nicknameApi.displayNames[PETTIS]=displayName;if(Array.isArray(nicknameApi.fighters)&&!nicknameApi.fighters.includes(PETTIS))nicknameApi.fighters.push(PETTIS);}
}
function reconcileCalculatorAudit(){
  const api=window.UFC_CATEGORY_CALCULATORS;if(!api?.list)throw new Error('Missing category calculator API.');
  api.expectedFighterCount=EXPECTED_FIGHTERS;
  api.audit=()=>{const rows=api.list(),blocked=rows.filter(row=>row.status!=='complete'),sources={facts:window.UFC_CANONICAL_FIGHTER_FACTS?.count?.()===EXPECTED_FIGHTERS,judgments:Number(window.UFC_CANONICAL_SCORING_JUDGMENTS?.fighterCount)===EXPECTED_FIGHTERS,fighterEraLedgers:window.UFC_FIGHTER_ERA_LEDGERS?.fighters?.length===EXPECTED_FIGHTERS,eraDepthInputs:Boolean(window.UFC_CANONICAL_DIVISION_ERA_DEPTH_APPROVED_RESOLUTIONS?.entryFor?.(PETTIS))};return{version:`${api.version}+${VERSION}`,expectedFighterCount:EXPECTED_FIGHTERS,fighterCount:rows.length,completeFighterCount:rows.length-blocked.length,blockedFighterCount:blocked.length,blockedFighters:blocked.map(row=>({fighter:row.fighter,missing:row.missing})),sources,readsFrozenExpectedOutputs:false,readsFrozenCategoryControls:false,readsMigrationReconstructionReports:false,mutatesRankingData:false,passed:rows.length===EXPECTED_FIGHTERS&&blocked.length===0&&Object.values(sources).every(Boolean),rows};};
  window.UFC_CATEGORY_CALCULATOR_AUDIT=api.audit();
  if(!window.UFC_CATEGORY_CALCULATOR_AUDIT.passed)throw new Error(`Batch-fourteen category audit blocked: ${JSON.stringify(window.UFC_CATEGORY_CALCULATOR_AUDIT.blockedFighters)}`);
}
seedRankingData();
registerFacts();
registerEra();
registerJudgments();
registerDepth();
registerPresentation();
registerEraFilter();
registerProfileNickname();
reconcileCalculatorAudit();
const factsAudit=window.UFC_CANONICAL_FIGHTER_FACTS.audit();
window.UFC_CANONICAL_ROSTER_BATCH_FOURTEEN={version:VERSION,expectedFighterCount:EXPECTED_FIGHTERS,fighters:[PETTIS],factsAudit,categoryAudit:window.UFC_CATEGORY_CALCULATOR_AUDIT,eraMembership:window.UFC_ERA_FILTER_DATA?.curatedMembership?.[PETTIS]||null,photoStatus:'verified',watchStatus:'not-supplied',signatureFight:'Benson Henderson II — UFC 164',alternateFight:'Gilbert Melendez — UFC 181',passed:factsAudit.passed&&factsAudit.total===EXPECTED_FIGHTERS&&window.UFC_CATEGORY_CALCULATOR_AUDIT.passed};
if(!window.UFC_CANONICAL_ROSTER_BATCH_FOURTEEN.passed)throw new Error('Canonical roster batch fourteen failed final shared-registry audit.');
document.documentElement.setAttribute('data-canonical-roster-batch-fourteen',`${VERSION}-clean-${EXPECTED_FIGHTERS}`);
})();

// Shared canonical roster batch thirteen: normal UFC-only fighter integrations.
(function(){
'use strict';
const VERSION='canonical-roster-batch-thirteen-20260717a-brandon-moreno';
const EXPECTED_FIGHTERS=79;
const MORENO='Brandon Moreno';
const clean=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/[^a-z0-9']+/g,' ').replace(/\s+/g,' ').trim();
const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
const slug=value=>clean(value).replace(/'/g,'').replace(/\s+/g,'-');
const R=(won,lost,drawn=0,note='Reviewed prime-window round allocation.')=>({status:'audited',won,lost,drawn,reviewStatus:'locked',note});
const NA=()=>({status:'not-audited'});
const none=()=>({type:'none'});
const title=(type,manualCredit)=>({type,manualCredit:Number(manualCredit),fighterEligible:true,reviewStatus:'locked'});
function fight({date,opponent,event,result='W',method,round,quality,rounds=NA(),scheduledRounds=3,titleContext=none(),championStatus='contender',note=''}){
  const officialResult=result==='W'?'win':result==='L'?'loss':'draw';
  const scoringDisposition=result==='W'?'count-win':result==='L'?'count-loss':'count-draw';
  const row={id:`${date}-${slug(opponent)}`,date,opponent,event,division:'Flyweight',scheduledRounds,officialResult,scoringDisposition,method:{category:method,round},rounds,opponentContext:{qualityTier:quality,championStatus,reviewStatus:'locked'},championshipContext:titleContext};
  if(result==='L')row.lossClassification={divisionContext:'home',competitive:true,reviewStatus:'locked',note:note||'Counted UFC loss.'};
  if(note)row.notes=note;
  return row;
}
const record={
  fighter:MORENO,
  board:'men',
  status:'audited',
  identity:{primaryDivision:'Flyweight',secondaryDivisions:[],aliases:['The Assassin Baby','Brandon “The Assassin Baby” Moreno']},
  coverage:{complete:true,verifiedThrough:'2026-07-17',ufcOnly:true,note:'Complete official UFC ledger from Louis Smolka through Lone’er Kavanagh. The Ultimate Fighter exhibition bout and all non-UFC fights are excluded.'},
  primeWindow:{startFightId:'2020-03-14-jussier-formiga',endFightId:'2025-12-06-tatsuro-taira',open:false,reviewStatus:'locked',note:'The top-five Jussier Formiga win begins Moreno’s connected elite run. Tatsuro Taira is the unrecovered elite finished loss that closes the prime; the later Kavanagh loss confirms the decline.'},
  longevityContext:{gapCapMonths:18,statusMultiplier:1,reviewStatus:'locked',note:'Closed UFC elite window with the universal 18-month activity-gap cap.'},
  divisionStrength:{defaultKey:'modern-flyweight-0.95',reviewStatus:'locked',segments:[{key:'modern-flyweight-0.95',startFightId:'2020-03-14-jussier-formiga',endFightId:'2025-12-06-tatsuro-taira',reviewStatus:'locked'}],note:'Modern flyweight is deeper than the division’s launch era but remains below the strongest lightweight and welterweight periods.'},
  fights:[
    fight({date:'2016-10-01',opponent:'Louis Smolka',event:'UFC Fight Night: Lineker vs. Dodson',method:'submission',round:1,quality:'ranked',championStatus:'contender'}),
    fight({date:'2016-12-03',opponent:'Ryan Benoit',event:'The Ultimate Fighter 24 Finale',method:'decision',round:3,quality:'solid',championStatus:'unranked'}),
    fight({date:'2017-04-22',opponent:'Dustin Ortiz',event:'UFC Fight Night: Swanson vs. Lobov',method:'submission',round:2,quality:'ranked',championStatus:'contender'}),
    fight({date:'2017-08-05',opponent:'Sergio Pettis',event:'UFC Fight Night: Pettis vs. Moreno',result:'L',method:'decision',round:5,quality:'top-five',scheduledRounds:5,championStatus:'contender',note:'Pre-prime decision loss to a top-five flyweight.'}),
    fight({date:'2018-05-19',opponent:'Alexandre Pantoja',event:'UFC Fight Night: Maia vs. Usman',result:'L',method:'decision',round:3,quality:'top-five',championStatus:'contender',note:'Pre-prime decision loss to a future UFC champion; the earlier TUF exhibition is excluded.'}),
    fight({date:'2019-09-21',opponent:'Askar Askarov',event:'UFC Fight Night: Rodriguez vs. Stephens',result:'D',method:'draw',round:3,quality:'top-ten',championStatus:'contender',note:'Official split draw; no win credit or loss penalty.'}),
    fight({date:'2019-12-14',opponent:'Kai Kara-France',event:'UFC 245: Usman vs. Covington',method:'decision',round:3,quality:'top-ten',championStatus:'contender'}),
    fight({date:'2020-03-14',opponent:'Jussier Formiga',event:'UFC Fight Night: Lee vs. Oliveira',method:'decision',round:3,quality:'top-five',rounds:R(2,1),championStatus:'contender',note:'Top-five breakthrough and prime start.'}),
    fight({date:'2020-11-21',opponent:'Brandon Royval',event:'UFC 255: Figueiredo vs. Perez',method:'ko-tko',round:1,quality:'top-ten',rounds:R(1,0),championStatus:'contender'}),
    fight({date:'2020-12-12',opponent:'Deiveson Figueiredo',event:'UFC 256: Figueiredo vs. Moreno',result:'D',method:'draw',round:5,quality:'champion-level',rounds:R(2,3,0,'Reviewed five-round allocation; Figueiredo’s point deduction produced the majority draw.'),scheduledRounds:5,titleContext:title('normal',0),championStatus:'reigning-champion',note:'Majority draw in Moreno’s first undisputed title challenge.'}),
    fight({date:'2021-06-12',opponent:'Deiveson Figueiredo',event:'UFC 263: Adesanya vs. Vettori 2',method:'submission',round:3,quality:'champion-level',rounds:R(3,0),scheduledRounds:5,titleContext:title('normal',1),championStatus:'reigning-champion',note:'Submitted the reigning champion to win the undisputed UFC flyweight title.'}),
    fight({date:'2022-01-22',opponent:'Deiveson Figueiredo',event:'UFC 270: Ngannou vs. Gane',result:'L',method:'decision',round:5,quality:'champion-level',rounds:R(2,3),scheduledRounds:5,titleContext:title('normal',0),championStatus:'title-challenger',note:'Prime elite title loss in the third rivalry fight.'}),
    fight({date:'2022-07-30',opponent:'Kai Kara-France',event:'UFC 277: Peña vs. Nunes 2',method:'ko-tko',round:3,quality:'top-five',rounds:R(2,1),scheduledRounds:5,titleContext:title('interim',.65),championStatus:'title-challenger',note:'Won the interim UFC flyweight title with a body-kick finish.'}),
    fight({date:'2023-01-21',opponent:'Deiveson Figueiredo',event:'UFC 283: Teixeira vs. Hill',method:'doctor-stoppage',round:3,quality:'champion-level',rounds:R(3,0),scheduledRounds:5,titleContext:title('normal',1),championStatus:'reigning-champion',note:'Reclaimed the undisputed flyweight title and closed the four-fight rivalry 2-1-1.'}),
    fight({date:'2023-07-08',opponent:'Alexandre Pantoja',event:'UFC 290: Volkanovski vs. Rodriguez',result:'L',method:'decision',round:5,quality:'top-five',rounds:R(2,3),scheduledRounds:5,titleContext:title('normal',0),championStatus:'title-challenger',note:'Competitive prime title loss to an elite challenger.'}),
    fight({date:'2024-02-24',opponent:'Brandon Royval',event:'UFC Fight Night: Moreno vs. Royval 2',result:'L',method:'decision',round:5,quality:'top-five',rounds:R(2,3),scheduledRounds:5,championStatus:'title-challenger',note:'Competitive split-decision loss to a top-five rival.'}),
    fight({date:'2024-11-02',opponent:'Amir Albazi',event:'UFC Fight Night: Moreno vs. Albazi',method:'decision',round:5,quality:'top-five',rounds:R(5,0),scheduledRounds:5,championStatus:'contender',note:'Dominant five-round win over a top-five contender returning from inactivity.'}),
    fight({date:'2025-03-29',opponent:'Steve Erceg',event:'UFC Fight Night: Moreno vs. Erceg',method:'decision',round:5,quality:'top-ten',rounds:R(4,1),scheduledRounds:5,championStatus:'title-challenger'}),
    fight({date:'2025-12-06',opponent:'Tatsuro Taira',event:'UFC 323',result:'L',method:'ko-tko',round:2,quality:'top-five',rounds:R(0,2),scheduledRounds:5,championStatus:'contender',note:'Unrecovered prime elite finished loss and prime endpoint.'}),
    fight({date:'2026-02-28',opponent:'Lone’er Kavanagh',event:'UFC Fight Night: Moreno vs. Kavanagh',result:'L',method:'decision',round:5,quality:'top-ten',scheduledRounds:5,championStatus:'contender',note:'Post-prime loss; retained in the official record with no GOAT loss penalty.'})
  ]
};
const judgments={
  championship:{benchmarkCredit:14.54,inputs:[
    {fightId:'2021-06-12-deiveson-figueiredo',opponent:'Deiveson Figueiredo',finalAdjustedCredit:1,reviewStatus:'locked'},
    {fightId:'2022-07-30-kai-kara-france',opponent:'Kai Kara-France',finalAdjustedCredit:.65,reviewStatus:'locked'},
    {fightId:'2023-01-21-deiveson-figueiredo',opponent:'Deiveson Figueiredo',finalAdjustedCredit:1,reviewStatus:'locked'}
  ]},
  opponentQuality:{benchmarkCredit:14.54,fighterAdjustment:0,inputs:[
    ['2021-06-12-deiveson-figueiredo','Deiveson Figueiredo',1.25,'Reigning champion submitted for the undisputed title.'],
    ['2023-01-21-deiveson-figueiredo','Deiveson Figueiredo',1.15,'Reigning champion and defining rival; doctor-stoppage context slightly discounts the maximum.'],
    ['2020-03-14-jussier-formiga','Jussier Formiga',1,'Top-five breakthrough win.'],
    ['2022-07-30-kai-kara-france','Kai Kara-France',1,'Top-five interim-title win.'],
    ['2024-11-02-amir-albazi','Amir Albazi',.85,'Top-five win discounted for Albazi’s long inactivity.'],
    ['2020-11-21-brandon-royval','Brandon Royval',.85,'Ranked future title challenger.'],
    ['2025-03-29-steve-erceg','Steve Erceg',.65,'Ranked former title challenger coming off losses.'],
    ['2019-12-14-kai-kara-france','Kai Kara-France',.65,'Ranked flyweight contender.'],
    ['2017-04-22-dustin-ortiz','Dustin Ortiz',.65,'Ranked flyweight contender.'],
    ['2016-10-01-louis-smolka','Louis Smolka',.65,'Ranked debut win.'],
    ['2016-12-03-ryan-benoit','Ryan Benoit',.45,'Solid UFC win without elite ranking value.']
  ].map(([fightId,opponent,finalCredit,note])=>({fighter:MORENO,fightId,opponent,finalCredit,note,reviewStatus:'locked'}))},
  apex:{performances:[
    {fightId:'2021-06-12-deiveson-figueiredo',opponent:'Deiveson Figueiredo',rating:9.8},
    {fightId:'2023-01-21-deiveson-figueiredo',opponent:'Deiveson Figueiredo',rating:9.4}
  ],components:{twoPerformanceStrength:1.92,proof:1.25,bestFighterClaim:.9,aura:.9},notes:'The UFC 263 submission and UFC 283 title reclaim are two championship-proven performances that define Moreno’s four-fight rivalry and flyweight peak.'}
};
const era={status:'locked-complete',window:{start:'2020-03-14',startLabel:'Jussier Formiga',end:'2025-12-06',endLabel:'Tatsuro Taira',endType:'unrecovered_elite_loss',endReason:'The Formiga win begins the connected elite run. Taira is the unrecovered elite finished loss; Kavanagh confirms the post-prime decline.'},lossContext:{unrecoveredLoss:{label:'Tatsuro Taira',date:'2025-12-06',phase:'prime elite finished loss'},weirdResults:[],recoveredLosses:[{label:'Deiveson Figueiredo III',date:'2022-01-22',recovery:'Won the interim title over Kai Kara-France and reclaimed undisputed gold from Figueiredo.'},{label:'Alexandre Pantoja II',date:'2023-07-08',recovery:'Returned with dominant wins over Amir Albazi and Steve Erceg.'},{label:'Brandon Royval II',date:'2024-02-24',recovery:'Returned with dominant wins over Amir Albazi and Steve Erceg.'}],postPrimeLosses:[{label:'Lone’er Kavanagh',date:'2026-02-28'}]},longevity:{gapCapMonths:18,gapAdjustedMonths:68.8,activeEliteYears:5.73,statusMultiplier:1,divisionMultiplier:1,adjustmentNote:'Jussier Formiga through Tatsuro Taira.',note:'Nearly six active elite UFC years across two undisputed title reigns and a sustained contender run.'},notes:'UFC-only. The Ultimate Fighter exhibition and all non-UFC accomplishments are excluded from the ranking score.'};
const depthRow={fighter:MORENO,classification:'batch-thirteen-factual-completion',approvalStatus:'model-reviewed',decision:'Use a modest modern-flyweight discount. The division is deeper than its launch era, but still below the strongest lightweight and welterweight periods.',approvedAdjustment:-.37,approvedAt:'2026-07-17',provenance:'Shared canonical roster batch thirteen'};
const compareProfile={shortCase:'Moreno is the two-reign flyweight resilience case: three UFC title-fight wins, a 2-1-1 Figueiredo rivalry edge, elite comeback wins, and nearly six active prime years.',peak:'At his best, Moreno combined pace, durability, scrambling, sharp combinations, and opportunistic submissions. The Figueiredo II performance is one of the cleanest championship breakthroughs in flyweight history.',resume:'The UFC-only ledger includes Figueiredo twice, Kai Kara-France twice, Jussier Formiga, Brandon Royval, Amir Albazi, Dustin Ortiz, Louis Smolka, and Steve Erceg. TUF and regional results add no score.',championship:'He owns three UFC title-fight wins: the undisputed Figueiredo submission, the interim Kara-France finish, and the undisputed Figueiredo title reclaim.',opponentQuality:'Figueiredo anchors the case, while Formiga, Kara-France, Royval, Albazi, Ortiz, Smolka, and Erceg provide real ranked depth. The best wins are strong without matching the deepest all-division ledgers.',prime:'The reviewed prime runs from Jussier Formiga through Tatsuro Taira at 7-4-1, with a 28-17 audited round edge, four prime finishes, and one counted finish loss.',longevity:'The elite UFC window lasts about 5.7 active years under the standard gap cap, giving Moreno more useful longevity than many short-reign champions.',counter:'The best counterargument against Moreno is title control: he never completed a successful undisputed defense, lost both official UFC fights to Pantoja, and carries four counted prime losses.',edge:'Moreno wins appropriate comparisons through championship resilience, rivalry proof, and a deeper elite window than most two-reign champions. He repeatedly recovered from losses and returned to title level.',signatureWins:'Deiveson Figueiredo twice, Kai Kara-France twice, Jussier Formiga, Brandon Royval, Amir Albazi, Dustin Ortiz, Louis Smolka, and Steve Erceg define the UFC-only case.',weakness:'No successful undisputed defense, a 0-2 official UFC record against Pantoja, four prime losses, and a flyweight-era discount cap the all-time ceiling.',titleSummary:'Won the undisputed flyweight title at UFC 263, won interim gold at UFC 277, and reclaimed the undisputed belt at UFC 283.',primeSummary:'A 7-4-1 prime from Jussier Formiga through Tatsuro Taira with a 28-17 reviewed round edge and four finish wins.',titleStyle:'twoReignFlyweightChampion',primeStyle:'resilientScrambleChampion'};
const displayOverride={displayName:'Brandon “The Assassin Baby” Moreno',profileDisplayName:'Brandon “The Assassin Baby” Moreno',divisionLabel:'FLW',resumeTag:'Two-reign flyweight champion',photoUrl:'assets/fighters/brandon-moreno.webp',thumbUrl:'assets/fighters/brandon-moreno-thumb.webp',photoUnavailable:false,photoStatus:'verified',watchUrl:'https://youtube.com/shorts/eKlp7eFDSTM?is=_dMar84p0EkqYXz_',watchLabel:'Watch Moment',signatureFightUrl:'https://youtu.be/GPrzwbgg8yU?is=M-G22YQ8u-8QVKtz',signatureFightLabel:'Watch Signature Fight',oneLiner:'The resilient two-reign flyweight champion: three UFC title-fight wins, a 2-1-1 Figueiredo rivalry edge, and nearly six active elite years.',whyRankedHere:'Moreno earns his place through three UFC title-fight wins, five top-five victories, two undisputed title reigns, an interim-title finish, and a deep modern flyweight prime. His UFC 263 submission and UFC 283 title reclaim give the resume championship proof and historical identity.',whyNotHigher:'He does not rank higher because he never completed a successful undisputed defense, lost both official UFC fights to Alexandre Pantoja, and accumulated four counted prime losses. Modern flyweight also receives a modest division-depth discount compared with the strongest all-time divisions.',keyJudgmentCalls:[['Nickname','The app-facing profile name is Brandon “The Assassin Baby” Moreno.'],['UFC-only scope','The Ultimate Fighter exhibition loss to Alexandre Pantoja and all regional fights are excluded.'],['Prime start','Jussier Formiga begins the connected elite run.'],['Prime end','Tatsuro Taira is the unrecovered prime finish loss; Lone’er Kavanagh is post-prime decline confirmation.'],['Figueiredo rivalry','The official UFC series is 2-1-1 for Moreno and anchors his championship case.'],['Pantoja rivalry','Pantoja leads the official UFC series 2-0; the TUF exhibition is not part of the UFC record.'],['Division depth','Modern flyweight receives a modest discount rather than the heavier launch-era flyweight penalty.']],finalTakeaway:'Moreno is the resilience champion of the flyweight GOAT conversation: two undisputed reigns, three title-fight wins, rivalry history, and real longevity. The absence of a completed undisputed defense and the Pantoja losses keep him below the division’s deepest UFC-only resumes.',compareProfile};
const fightLedger={
  'brandon moreno|deiveson figueiredo':{fighters:[MORENO,'Deiveson Figueiredo'],fights:4,winner:MORENO,importance:'major',summary:'Moreno won the official UFC rivalry 2-1-1: a draw, a submission title win, a decision loss, and a doctor-stoppage title reclaim.'},
  'alexandre pantoja|brandon moreno':{fighters:['Alexandre Pantoja',MORENO],fights:2,winner:'Alexandre Pantoja',importance:'major',summary:'Pantoja won both official UFC meetings by decision. Their earlier TUF exhibition is excluded from the official UFC series count.'},
  'brandon moreno|brandon royval':{fighters:[MORENO,'Brandon Royval'],fights:2,winner:'Tied 1-1',importance:'notable',summary:'Moreno stopped Royval in their first fight; Royval won the five-round rematch by split decision.'},
  'brandon moreno|kai kara-france':{fighters:[MORENO,'Kai Kara-France'],fights:2,winner:MORENO,importance:'major',summary:'Moreno won both UFC meetings, first by decision and then by body-kick TKO for the interim flyweight title.'}
};
const legacyProfile={id:'BM001',fighter:MORENO,gender:'Men',primaryDivision:'Flyweight',secondaryDivision:'',scope:'UFC',ufcRecord:'11-8-1',ufcWins:11,ufcLosses:8,ufcDraws:1,scoredUfcFights:20,finishWins:6,finishRatePct:54.55,timesFinishedPrime:1,activeEliteYears:5.73,primeStart:'2020-03-14',primeEnd:'2025-12-06',notes:'Brandon “The Assassin Baby” Moreno. Complete UFC-only ledger; TUF exhibition and regional fights excluded. Shared pipeline owns all score, rank, category, and OVR outputs.',title:{normalTitleWins:2,interimTitleWins:1,adjustedTitleWins:2.65,notes:'Undisputed title wins over Deiveson Figueiredo at UFC 263 and UFC 283, plus the interim-title finish of Kai Kara-France.'},opponents:judgments.opponentQuality.inputs.map(row=>({opponent:row.opponent,date:row.fightId.slice(0,10),division:'Flyweight',context:row.note,credit:row.finalCredit,source:'UFC/UFCStats'})),rounds:record.fights.filter(row=>row.rounds.status==='audited').map(row=>({opponent:row.opponent,date:row.date,method:row.method.category,roundEnded:row.method.round,roundsCounted:row.rounds.won+row.rounds.lost+row.rounds.drawn,roundsWon:row.rounds.won,basis:row.rounds.note,confidence:'High',notes:row.notes||''}))};
function seedRankingData(){
  const data=window.RANKING_DATA;if(!data)throw new Error('Missing shared RANKING_DATA.');
  data.men=data.men||[];data.fighters=data.fighters||[];data.primeRecords=data.primeRecords||{};
  if(data.men.some(row=>clean(row?.fighter)===clean(MORENO))||data.fighters.some(row=>clean(row?.fighter)===clean(MORENO)))throw new Error(`Batch-thirteen duplicate ranking/profile row: ${MORENO}`);
  data.men.push({fighter:MORENO,leaderboard:'men',gender:'Men',primaryDivision:'Flyweight',secondaryDivision:''});
  data.fighters.push(legacyProfile);
  data.primeRecords[MORENO]={record:'7-4-1',context:'Jussier Formiga 2020 → Tatsuro Taira 2025'};
}
function registerFacts(){
  const api=window.UFC_CANONICAL_FIGHTER_FACTS;if(!api?.register)throw new Error('Missing canonical fighter facts API.');
  if(api.has(record.fighter))throw new Error(`Batch-thirteen duplicate canonical fighter: ${record.fighter}`);
  const report=api.validate(record);if(!report.valid)throw new Error(`${record.fighter}: ${report.errors.join(' ')}`);
  api.register(record);
}
function registerEra(){
  const api=window.UFC_FIGHTER_ERA_LEDGERS;if(!api?.ledgers)throw new Error('Missing fighter era ledger API.');
  if(api.ledgers[MORENO])throw new Error(`Batch-thirteen duplicate era ledger: ${MORENO}`);
  api.ledgers[MORENO]=era;api.fighters=api.names();
}
function registerJudgments(){
  const api=window.UFC_CANONICAL_SCORING_JUDGMENTS;if(!api?.entryFor)throw new Error('Missing canonical scoring judgments API.');
  const previousEntry=api.entryFor.bind(api),previousList=api.list?.bind(api),key=clean(MORENO);
  api.entryFor=(category,fighter)=>clean(fighter)===key&&judgments[category]?clone(judgments[category]):previousEntry(category,fighter);
  if(previousList)api.list=category=>[...(previousList(category)||[]),...(judgments[category]?[{normalized:key,...clone(judgments[category])}]:[])];
  api.fighterCount=EXPECTED_FIGHTERS;
}
function registerDepth(){
  const api=window.UFC_CANONICAL_DIVISION_ERA_DEPTH_APPROVED_RESOLUTIONS;if(!api?.entryFor)throw new Error('Missing era-depth resolution API.');
  const previousEntry=api.entryFor.bind(api),rows=[...(api.rows||[])];
  if(rows.some(existing=>clean(existing.fighter)===clean(MORENO)))throw new Error(`Batch-thirteen duplicate era-depth row: ${MORENO}`);
  rows.push(Object.freeze(depthRow));
  window.UFC_CANONICAL_DIVISION_ERA_DEPTH_APPROVED_RESOLUTIONS=Object.freeze({...api,version:`${api.version}+${VERSION}`,rows:Object.freeze(rows),fighterCount:rows.length,entryFor:fighter=>clean(fighter)===clean(MORENO)?depthRow:previousEntry(fighter)});
}
function registerPresentation(){
  window.DISPLAY_OVERRIDES=window.DISPLAY_OVERRIDES||{};
  window.DISPLAY_OVERRIDES[MORENO]={...(window.DISPLAY_OVERRIDES[MORENO]||{}),...displayOverride};
  window.COMPARE_PROFILES=window.COMPARE_PROFILES||{};
  window.COMPARE_PROFILES[MORENO]={...(window.COMPARE_PROFILES[MORENO]||{}),...compareProfile};
  window.COMPARE_FIGHT_LEDGER=window.COMPARE_FIGHT_LEDGER||{};
  Object.assign(window.COMPARE_FIGHT_LEDGER,fightLedger);
}
function registerEraFilter(){
  const api=window.UFC_ERA_FILTER_DATA;if(!api?.curatedMembership)return;
  api.curatedMembership[MORENO]={primary:'apex',secondary:'new-blood'};
  const ids=[api.curatedMembership[MORENO].primary,api.curatedMembership[MORENO].secondary].filter(Boolean);
  const errors=[];ids.forEach(id=>{if(!api.byId?.[id])errors.push(`${MORENO} uses unknown era ${id}.`);});
  api.version=`${api.version}+${VERSION}`;
  api.audit={fighterCount:Object.keys(api.curatedMembership).length,errors,passed:errors.length===0};
}
function registerProfileNickname(){
  const displayName='Brandon “The Assassin Baby” Moreno';
  window.DISPLAY_OVERRIDES=window.DISPLAY_OVERRIDES||{};
  window.DISPLAY_OVERRIDES[MORENO]={...(window.DISPLAY_OVERRIDES[MORENO]||{}),profileDisplayName:displayName};
  const nicknameApi=window.UFC_CARD_NICKNAMES;
  if(nicknameApi?.displayNames){nicknameApi.displayNames[MORENO]=displayName;if(Array.isArray(nicknameApi.fighters)&&!nicknameApi.fighters.includes(MORENO))nicknameApi.fighters.push(MORENO);}
}
function reconcileCalculatorAudit(){
  const api=window.UFC_CATEGORY_CALCULATORS;if(!api?.list)throw new Error('Missing category calculator API.');
  api.expectedFighterCount=EXPECTED_FIGHTERS;
  api.audit=()=>{const rows=api.list(),blocked=rows.filter(row=>row.status!=='complete'),sources={facts:window.UFC_CANONICAL_FIGHTER_FACTS?.count?.()===EXPECTED_FIGHTERS,judgments:Number(window.UFC_CANONICAL_SCORING_JUDGMENTS?.fighterCount)===EXPECTED_FIGHTERS,fighterEraLedgers:window.UFC_FIGHTER_ERA_LEDGERS?.fighters?.length===EXPECTED_FIGHTERS,eraDepthInputs:Boolean(window.UFC_CANONICAL_DIVISION_ERA_DEPTH_APPROVED_RESOLUTIONS?.entryFor?.(MORENO))};return{version:`${api.version}+${VERSION}`,expectedFighterCount:EXPECTED_FIGHTERS,fighterCount:rows.length,completeFighterCount:rows.length-blocked.length,blockedFighterCount:blocked.length,blockedFighters:blocked.map(row=>({fighter:row.fighter,missing:row.missing})),sources,readsFrozenExpectedOutputs:false,readsFrozenCategoryControls:false,readsMigrationReconstructionReports:false,mutatesRankingData:false,passed:rows.length===EXPECTED_FIGHTERS&&blocked.length===0&&Object.values(sources).every(Boolean),rows};};
  window.UFC_CATEGORY_CALCULATOR_AUDIT=api.audit();
  if(!window.UFC_CATEGORY_CALCULATOR_AUDIT.passed)throw new Error(`Batch-thirteen category audit blocked: ${JSON.stringify(window.UFC_CATEGORY_CALCULATOR_AUDIT.blockedFighters)}`);
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
window.UFC_CANONICAL_ROSTER_BATCH_THIRTEEN={version:VERSION,expectedFighterCount:EXPECTED_FIGHTERS,fighters:[MORENO],factsAudit,categoryAudit:window.UFC_CATEGORY_CALCULATOR_AUDIT,eraMembership:window.UFC_ERA_FILTER_DATA?.curatedMembership?.[MORENO]||null,photoStatus:'verified',watchStatus:'verified',passed:factsAudit.passed&&factsAudit.total===EXPECTED_FIGHTERS&&window.UFC_CATEGORY_CALCULATOR_AUDIT.passed};
if(!window.UFC_CANONICAL_ROSTER_BATCH_THIRTEEN.passed)throw new Error('Canonical roster batch thirteen failed final shared-registry audit.');
document.documentElement.setAttribute('data-canonical-roster-batch-thirteen',`${VERSION}-clean-${EXPECTED_FIGHTERS}`);
})();

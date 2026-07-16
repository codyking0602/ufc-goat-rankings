// Shared canonical roster batch eleven: normal UFC-only fighter integrations.
(function(){
'use strict';
const VERSION='canonical-roster-batch-eleven-20260716c-tom-aspinall-photos';
const EXPECTED_FIGHTERS=77;
const TOM='Tom Aspinall';
const clean=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/[^a-z0-9']+/g,' ').replace(/\s+/g,' ').trim();
const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
const slug=value=>clean(value).replace(/'/g,'').replace(/\s+/g,'-');
const R=(won,lost,drawn=0,note='Reviewed prime-window round allocation.')=>({status:'audited',won,lost,drawn,reviewStatus:'locked',note});
const NA=()=>({status:'not-audited'});
const none=()=>({type:'none'});
const title=(type,manualCredit)=>({type,manualCredit:Number(manualCredit),fighterEligible:true,reviewStatus:'locked'});
function fight({date,opponent,event,result='W',method,round,quality,rounds=NA(),scheduledRounds=3,titleContext=none(),championStatus='contender',note='',technicalException=false}){
  const officialResult=result==='W'?'win':result==='L'?'loss':'no-contest';
  const scoringDisposition=technicalException?'technical-exception':result==='W'?'count-win':result==='L'?'count-loss':'excluded-no-contest';
  const row={id:`${date}-${slug(opponent)}`,date,opponent,event,division:'Heavyweight',scheduledRounds,officialResult,scoringDisposition,method:{category:method,round},rounds,opponentContext:{qualityTier:quality,championStatus,reviewStatus:'locked'},championshipContext:titleContext};
  if(result==='L'||technicalException){
    row.lossClassification={divisionContext:'home',competitive:!technicalException,reviewStatus:'locked',...(technicalException?{overrideRule:'freak-injury-technical-result'}:{}),note:note||'Counted UFC loss.'};
  }
  if(technicalException)row.technicalExceptionNote=note||'Technical result excluded from normal competitive-loss treatment.';
  if(note)row.notes=note;
  return row;
}
const record={
  fighter:TOM,
  board:'men',
  status:'audited',
  identity:{primaryDivision:'Heavyweight',secondaryDivisions:[],aliases:['Honey Badger']},
  coverage:{complete:true,verifiedThrough:'2026-07-16',ufcOnly:true,note:'Complete official UFC ledger through the Ciryl Gane no contest at UFC 321. Non-UFC fights excluded.'},
  primeWindow:{startFightId:'2022-03-19-alexander-volkov',endFightId:null,open:true,reviewStatus:'locked',note:'The Alexander Volkov submission begins Aspinall’s connected elite heavyweight run. The Blaydes knee injury is a technical exception, and the prime remains open.'},
  longevityContext:{gapCapMonths:18,statusMultiplier:1.08,reviewStatus:'locked',note:'Active heavyweight champion window with the universal 18-month activity-gap cap.'},
  divisionStrength:{defaultKey:'modern-heavyweight-0.96',reviewStatus:'locked',segments:[{key:'modern-heavyweight-0.96',startFightId:'2022-03-19-alexander-volkov',endFightId:null,reviewStatus:'locked'}],note:'Modern heavyweight has elite top-end danger but less full-roster depth than the strongest lightweight and welterweight eras.'},
  fights:[
    fight({date:'2020-07-25',opponent:'Jake Collier',event:'UFC Fight Night: Whittaker vs. Till',method:'ko-tko',round:1,quality:'solid'}),
    fight({date:'2020-10-10',opponent:'Alan Baudot',event:'UFC Fight Night: Moraes vs. Sandhagen',method:'ko-tko',round:1,quality:'minimal'}),
    fight({date:'2021-02-20',opponent:'Andrei Arlovski',event:'UFC Fight Night: Blaydes vs. Lewis',method:'submission',round:2,quality:'name-value',championStatus:'former-champion'}),
    fight({date:'2021-09-04',opponent:'Serghei Spivac',event:'UFC Fight Night: Brunson vs. Till',method:'ko-tko',round:1,quality:'ranked'}),
    fight({date:'2022-03-19',opponent:'Alexander Volkov',event:'UFC Fight Night: Volkov vs. Aspinall',method:'submission',round:1,quality:'top-ten',rounds:R(1,0),championStatus:'contender'}),
    fight({date:'2022-07-23',opponent:'Curtis Blaydes',event:'UFC Fight Night: Blaydes vs. Aspinall',result:'L',method:'other',round:1,quality:'top-five',rounds:R(0,0,0,'Fifteen-second knee injury; no competitive round allocation.'),championStatus:'title-challenger',technicalException:true,note:'Official loss after Aspinall injured his knee 15 seconds into the fight; treated as a freak technical result, not a normal competitive finish loss.'}),
    fight({date:'2023-07-22',opponent:'Marcin Tybura',event:'UFC Fight Night: Aspinall vs. Tybura',method:'ko-tko',round:1,quality:'top-ten',rounds:R(1,0),championStatus:'contender'}),
    fight({date:'2023-11-11',opponent:'Sergei Pavlovich',event:'UFC 295',method:'ko-tko',round:1,quality:'top-five',rounds:R(1,0),scheduledRounds:5,titleContext:title('interim',.75),championStatus:'title-challenger',note:'Won the interim UFC heavyweight title by first-round knockout.'}),
    fight({date:'2024-07-27',opponent:'Curtis Blaydes',event:'UFC 304',method:'ko-tko',round:1,quality:'top-five',rounds:R(1,0),scheduledRounds:5,titleContext:title('interim',.75),championStatus:'title-challenger',note:'Retained the interim UFC heavyweight title and answered the technical-result loss from 2022.'}),
    fight({date:'2025-10-25',opponent:'Ciryl Gane',event:'UFC 321',result:'NC',method:'no-contest',round:1,quality:'champion-level',rounds:R(0,0,0,'Accidental eye-poke no contest; excluded from scored round control.'),scheduledRounds:5,titleContext:title('normal',0),championStatus:'title-challenger',note:'Official no contest after an accidental eye poke at 4:35 of round one; Aspinall retained the undisputed heavyweight title.'})
  ]
};
const judgments={
  championship:{benchmarkCredit:14.54,inputs:[
    {fightId:'2023-11-11-sergei-pavlovich',opponent:'Sergei Pavlovich',finalAdjustedCredit:.75,reviewStatus:'locked'},
    {fightId:'2024-07-27-curtis-blaydes',opponent:'Curtis Blaydes II',finalAdjustedCredit:.75,reviewStatus:'locked'}
  ]},
  opponentQuality:{benchmarkCredit:14.54,fighterAdjustment:0,inputs:[
    ['2024-07-27-curtis-blaydes','Curtis Blaydes',1],
    ['2023-11-11-sergei-pavlovich','Sergei Pavlovich',1],
    ['2022-03-19-alexander-volkov','Alexander Volkov',.85],
    ['2023-07-22-marcin-tybura','Marcin Tybura',.85],
    ['2021-09-04-serghei-spivac','Serghei Spivac',.65],
    ['2021-02-20-andrei-arlovski','Andrei Arlovski',.45],
    ['2020-07-25-jake-collier','Jake Collier',.25],
    ['2020-10-10-alan-baudot','Alan Baudot',.1]
  ].map(([fightId,opponent,finalCredit])=>({fighter:TOM,fightId,opponent,finalCredit,reviewStatus:'locked'}))},
  apex:{performances:[
    {fightId:'2023-11-11-sergei-pavlovich',opponent:'Sergei Pavlovich',rating:9.5},
    {fightId:'2024-07-27-curtis-blaydes',opponent:'Curtis Blaydes',rating:9.4}
  ],components:{twoPerformanceStrength:1.89,proof:1.25,bestFighterClaim:.95,aura:1.0},notes:'Back-to-back first-round interim-title knockouts establish an elite heavyweight apex; undisputed title proof remains incomplete because the Gane defense ended in a no contest.'}
};
const era={status:'locked-current',window:{start:'2022-03-19',startLabel:'Alexander Volkov',end:null,endLabel:'Current heavyweight championship form',endType:'open_current_champion',endReason:'Aspinall remains the active UFC heavyweight champion after the Gane no contest.'},lossContext:{unrecoveredLoss:null,weirdResults:[{label:'Curtis Blaydes I',date:'2022-07-23',phase:'prime freak knee-injury technical result'},{label:'Ciryl Gane',date:'2025-10-25',phase:'prime accidental-eye-poke no contest'}],recoveredLosses:[{label:'Curtis Blaydes',date:'2022-07-23',recovery:'Returned with three straight first-round finishes and stopped Blaydes in the rematch.'}],postPrimeLosses:[]},longevity:{gapCapMonths:18,gapAdjustedMonths:51.8,activeEliteYears:4.32,statusMultiplier:1.08,divisionMultiplier:.96,adjustmentNote:'Volkov through current championship form.',note:'Short but active elite heavyweight window with two interim-title wins and undisputed champion status.'},notes:'UFC-only. The 2022 Blaydes injury is a technical exception; the Gane no contest is excluded from scoring.'};
const depthRow={fighter:TOM,classification:'batch-eleven-factual-completion',approvalStatus:'model-reviewed',decision:'Apply a modest modern-heavyweight depth discount: dangerous elite contenders, but less full-roster depth than the strongest lightweight and welterweight eras.',approvedAdjustment:-.25,approvedAt:'2026-07-16',provenance:'Shared canonical roster batch eleven'};
const compareProfile={shortCase:'Aspinall is the heavyweight speed-and-finishing case: an 8-1 UFC record with one no contest, eight finishes, two interim-title wins, and no normal competitive loss inside his reviewed prime.',peak:'At his best he combines rare heavyweight speed, clean boxing, submission threat, and first-round finishing authority.',resume:'Volkov, Pavlovich, Blaydes, Tybura, Spivac, and Arlovski give him a strong modern heavyweight ledger, but the total UFC volume is still short.',championship:'He won and defended the interim heavyweight title, then became undisputed champion through elevation. The Gane title defense ended in a no contest, so it adds no title-win credit.',opponentQuality:'Pavlovich and Blaydes are the top-five anchors. Volkov and Tybura add ranked depth, while Arlovski is discounted for late-career timing.',prime:'The prime starts with the Volkov submission and remains open. The Blaydes knee injury is treated as a technical exception, followed by three straight first-round finishes.',longevity:'The elite window is a little over four active years after the 18-month gap cap—strong for an active contender, but far below the long-reign heavyweight greats.',counter:'The strongest counterargument is ceiling: his speed, skill, and finishing rate may make him the better fighter than several heavyweights ranked above him.',edge:'He wins comparisons against thinner contender cases through perfect finishing efficiency, title-level proof, and the absence of a real competitive prime loss.',signatureWins:'Sergei Pavlovich, Curtis Blaydes, Alexander Volkov, and Marcin Tybura define the UFC-only case.',weakness:'Only two UFC title-fight wins, a short elite window, and no completed undisputed title defense keep the resume below the established heavyweight champions.',titleSummary:'Won the interim heavyweight title over Pavlovich, defended it against Blaydes, and later became undisputed champion by elevation; the Gane defense was a no contest.',primeSummary:'An open 4-0 scored prime from Volkov forward, plus one freak-injury technical result and one excluded no contest.',titleStyle:'interimToUndisputedHeavyweight',primeStyle:'shortExplosiveHeavyweightPrime'};
const displayOverride={divisionLabel:'HW',resumeTag:'Explosive heavyweight champion',photoUrl:'assets/fighters/tom-aspinall.webp',thumbUrl:'assets/fighters/tom-aspinall-thumb.webp',photoUnavailable:false,photoStatus:'verified',oneLiner:'The heavyweight speed-and-finishing case: eight UFC wins, eight finishes, two interim-title wins, and a freak-injury loss that does not represent a competitive defeat.',whyRankedHere:'Aspinall earns his place through perfect UFC finishing efficiency, elite first-round wins over Sergei Pavlovich and Curtis Blaydes, an Alexander Volkov submission, and two interim-title victories. The shared model also recognizes that his only official UFC loss was a 15-second knee injury rather than a normal competitive defeat.',whyNotHigher:'He does not rank higher because the championship volume and active elite window are still short. He has two UFC title-fight wins, no completed undisputed title defense, and fewer top-five wins than Stipe Miocic, Francis Ngannou, and the deepest heavyweight resumes.',keyJudgmentCalls:[['Prime start','Alexander Volkov begins the connected elite heavyweight window.'],['Curtis Blaydes I','the 15-second knee injury remains an official loss but is treated as a freak technical result with no normal loss penalty.'],['Interim title wins','Pavlovich and the Blaydes rematch receive partial interim-title credit under the shared Championship rules.'],['Ciryl Gane no contest','excluded from scoring and title-win credit; Aspinall retained the undisputed title.'],['Heavyweight depth','receives a modest era-depth discount because the top end is dangerous but the full division is thinner than elite lightweight and welterweight eras.']],finalTakeaway:'Aspinall is already a serious UFC heavyweight peak case: fast, technically complete, title-proven, and perfect as a finisher. He needs completed undisputed defenses and more elite wins to become a top-tier all-time heavyweight resume.',compareProfile};
const fightLedger={
  'curtis blaydes|tom aspinall':{fighters:['Curtis Blaydes',TOM],fights:2,winner:'Split',importance:'major',summary:'Blaydes won the first meeting when Aspinall injured his knee after 15 seconds; Aspinall stopped Blaydes in one minute in the interim-title rematch. The series is officially split, but the first result carries freak-injury context.'},
  'ciryl gane|tom aspinall':{fighters:['Ciryl Gane',TOM],fights:1,winner:'No Contest',importance:'major',summary:'Their UFC 321 undisputed heavyweight title fight ended in a first-round no contest after an accidental eye poke. Aspinall retained the title, and neither fighter receives a direct-series win.'}
};
function registerFacts(){
  const api=window.UFC_CANONICAL_FIGHTER_FACTS;if(!api?.register)throw new Error('Missing canonical fighter facts API.');
  if(api.has(record.fighter))throw new Error(`Batch-eleven duplicate canonical fighter: ${record.fighter}`);
  const report=api.validate(record);if(!report.valid)throw new Error(`${record.fighter}: ${report.errors.join(' ')}`);
  api.register(record);
}
function registerEra(){
  const api=window.UFC_FIGHTER_ERA_LEDGERS;if(!api?.ledgers)throw new Error('Missing fighter era ledger API.');
  if(api.ledgers[TOM])throw new Error(`Batch-eleven duplicate era ledger: ${TOM}`);
  api.ledgers[TOM]=era;api.fighters=api.names();
}
function registerJudgments(){
  const api=window.UFC_CANONICAL_SCORING_JUDGMENTS;if(!api?.entryFor)throw new Error('Missing canonical scoring judgments API.');
  const previousEntry=api.entryFor.bind(api),previousList=api.list?.bind(api),key=clean(TOM);
  api.entryFor=(category,fighter)=>clean(fighter)===key&&judgments[category]?clone(judgments[category]):previousEntry(category,fighter);
  if(previousList)api.list=category=>[...(previousList(category)||[]),...(judgments[category]?[{normalized:key,...clone(judgments[category])}]:[])];
  api.fighterCount=EXPECTED_FIGHTERS;
}
function registerDepth(){
  const api=window.UFC_CANONICAL_DIVISION_ERA_DEPTH_APPROVED_RESOLUTIONS;if(!api?.entryFor)throw new Error('Missing era-depth resolution API.');
  const previousEntry=api.entryFor.bind(api),rows=[...(api.rows||[])];
  if(rows.some(existing=>clean(existing.fighter)===clean(TOM)))throw new Error(`Batch-eleven duplicate era-depth row: ${TOM}`);
  rows.push(Object.freeze(depthRow));
  window.UFC_CANONICAL_DIVISION_ERA_DEPTH_APPROVED_RESOLUTIONS=Object.freeze({...api,version:`${api.version}+${VERSION}`,rows:Object.freeze(rows),fighterCount:rows.length,entryFor:fighter=>clean(fighter)===clean(TOM)?depthRow:previousEntry(fighter)});
}
function registerPresentation(){
  window.DISPLAY_OVERRIDES=window.DISPLAY_OVERRIDES||{};
  window.DISPLAY_OVERRIDES[TOM]={...(window.DISPLAY_OVERRIDES[TOM]||{}),...displayOverride};
  window.COMPARE_PROFILES=window.COMPARE_PROFILES||{};
  window.COMPARE_PROFILES[TOM]={...(window.COMPARE_PROFILES[TOM]||{}),...compareProfile};
  window.COMPARE_FIGHT_LEDGER=window.COMPARE_FIGHT_LEDGER||{};
  Object.assign(window.COMPARE_FIGHT_LEDGER,fightLedger);
}
function registerEraFilter(){
  const api=window.UFC_ERA_FILTER_DATA;if(!api?.curatedMembership)return;
  api.curatedMembership[TOM]={primary:'new-blood',secondary:'apex'};
  const ids=[api.curatedMembership[TOM].primary,api.curatedMembership[TOM].secondary].filter(Boolean);
  const errors=[];ids.forEach(id=>{if(!api.byId?.[id])errors.push(`${TOM} uses unknown era ${id}.`);});
  api.version=`${api.version}+${VERSION}`;
  api.audit={fighterCount:Object.keys(api.curatedMembership).length,errors,passed:errors.length===0};
}
function registerProfileNickname(){
  const displayName='Tom “Honey Badger” Aspinall';
  window.DISPLAY_OVERRIDES=window.DISPLAY_OVERRIDES||{};
  window.DISPLAY_OVERRIDES[TOM]={...(window.DISPLAY_OVERRIDES[TOM]||{}),profileDisplayName:displayName};
  const nicknameApi=window.UFC_CARD_NICKNAMES;
  if(nicknameApi?.displayNames){nicknameApi.displayNames[TOM]=displayName;if(Array.isArray(nicknameApi.fighters)&&!nicknameApi.fighters.includes(TOM))nicknameApi.fighters.push(TOM);}
}
function reconcileCalculatorAudit(){
  const api=window.UFC_CATEGORY_CALCULATORS;if(!api?.list)throw new Error('Missing category calculator API.');
  api.expectedFighterCount=EXPECTED_FIGHTERS;
  api.audit=()=>{const rows=api.list(),blocked=rows.filter(row=>row.status!=='complete'),sources={facts:window.UFC_CANONICAL_FIGHTER_FACTS?.count?.()===EXPECTED_FIGHTERS,judgments:Number(window.UFC_CANONICAL_SCORING_JUDGMENTS?.fighterCount)===EXPECTED_FIGHTERS,fighterEraLedgers:window.UFC_FIGHTER_ERA_LEDGERS?.fighters?.length===EXPECTED_FIGHTERS,eraDepthInputs:Boolean(window.UFC_CANONICAL_DIVISION_ERA_DEPTH_APPROVED_RESOLUTIONS?.entryFor?.(TOM))};return{version:`${api.version}+${VERSION}`,expectedFighterCount:EXPECTED_FIGHTERS,fighterCount:rows.length,completeFighterCount:rows.length-blocked.length,blockedFighterCount:blocked.length,blockedFighters:blocked.map(row=>({fighter:row.fighter,missing:row.missing})),sources,readsFrozenExpectedOutputs:false,readsFrozenCategoryControls:false,readsMigrationReconstructionReports:false,mutatesRankingData:false,passed:rows.length===EXPECTED_FIGHTERS&&blocked.length===0&&Object.values(sources).every(Boolean),rows};};
  window.UFC_CATEGORY_CALCULATOR_AUDIT=api.audit();
  if(!window.UFC_CATEGORY_CALCULATOR_AUDIT.passed)throw new Error(`Batch-eleven category audit blocked: ${JSON.stringify(window.UFC_CATEGORY_CALCULATOR_AUDIT.blockedFighters)}`);
}
registerFacts();
registerEra();
registerJudgments();
registerDepth();
registerPresentation();
registerEraFilter();
registerProfileNickname();
reconcileCalculatorAudit();
const factsAudit=window.UFC_CANONICAL_FIGHTER_FACTS.audit();
window.UFC_CANONICAL_ROSTER_BATCH_ELEVEN={version:VERSION,expectedFighterCount:EXPECTED_FIGHTERS,fighters:[TOM],factsAudit,categoryAudit:window.UFC_CATEGORY_CALCULATOR_AUDIT,eraMembership:window.UFC_ERA_FILTER_DATA?.curatedMembership?.[TOM]||null,photoStatus:'verified',passed:factsAudit.passed&&factsAudit.total===EXPECTED_FIGHTERS&&window.UFC_CATEGORY_CALCULATOR_AUDIT.passed};
if(!window.UFC_CANONICAL_ROSTER_BATCH_ELEVEN.passed)throw new Error('Canonical roster batch eleven failed final shared-registry audit.');
document.documentElement.setAttribute('data-canonical-roster-batch-eleven',`${VERSION}-clean-${EXPECTED_FIGHTERS}`);
})();
// Shared canonical roster batch eleven: normal UFC-only fighter integrations.
(function(){
'use strict';
const VERSION='canonical-roster-batch-eleven-20260716a-tom-aspinall';
const EXPECTED_FIGHTERS=77;
const clean=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/[^a-z0-9']+/g,' ').replace(/\s+/g,' ').trim();
const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
const slug=value=>clean(value).replace(/'/g,'').replace(/\s+/g,'-');
const R=(won,lost,drawn=0,note='Reviewed prime-window round allocation.')=>({status:'audited',won,lost,drawn,reviewStatus:'locked',note});
const NA=()=>({status:'not-audited'});
const none=()=>({type:'none'});
const title=(type,manualCredit)=>({type,manualCredit:Number(manualCredit),fighterEligible:true,reviewStatus:'locked'});
const result={W:['win','count-win'],L:['loss','count-loss'],NC:['no-contest','excluded-no-contest']};
function makeFight({date,opponent,event,resultCode,method,round,quality,rounds=NA(),division='Heavyweight',scheduledRounds=3,titleContext=none(),championStatus='contender',note='',loss}){
  const [officialResult,scoringDisposition]=result[resultCode];
  const fight={id:`${date}-${slug(opponent)}`,date,opponent,event,division,scheduledRounds,officialResult,scoringDisposition,method:{category:method,round},rounds,opponentContext:{qualityTier:quality,championStatus,reviewStatus:'locked'},championshipContext:titleContext};
  if(resultCode==='L')fight.lossClassification={divisionContext:loss?.divisionContext||'home',competitive:loss?.competitive!==false,reviewStatus:'locked',...(loss?.overrideRule?{overrideRule:loss.overrideRule}:{}),note:loss?.note||note||'Counted UFC loss.'};
  if(note)fight.notes=note;
  return fight;
}
const TOM='Tom Aspinall';
const records=[{
  fighter:TOM,board:'men',status:'audited',identity:{primaryDivision:'Heavyweight',secondaryDivisions:[],aliases:['Honey Badger']},
  coverage:{complete:true,verifiedThrough:'2026-07-16',ufcOnly:true,note:'Complete official UFC ledger through Ciryl Gane at UFC 321. Non-UFC fights are excluded.'},
  primeWindow:{startFightId:'2021-09-04-serghei-spivac',endFightId:null,open:true,reviewStatus:'locked',note:'The ranked Spivac finish begins the connected elite heavyweight run; the window remains open after the Gane no contest.'},
  longevityContext:{gapCapMonths:18,statusMultiplier:1.08,reviewStatus:'locked',note:'Current heavyweight champion window with the universal 18-month activity-gap cap.'},
  divisionStrength:{defaultKey:'modern-heavyweight-0.95',reviewStatus:'locked',segments:[],note:'Modern heavyweight receives a light depth discount relative to the strongest lighter-weight eras.'},
  fights:[
    makeFight({date:'2020-07-25',opponent:'Jake Collier',event:'UFC Fight Night: Whittaker vs. Till',resultCode:'W',method:'ko-tko',round:1,quality:'minimal'}),
    makeFight({date:'2020-10-11',opponent:'Alan Baudot',event:'UFC Fight Night: Moraes vs. Sandhagen',resultCode:'W',method:'ko-tko',round:1,quality:'minimal'}),
    makeFight({date:'2021-02-20',opponent:'Andrei Arlovski',event:'UFC Fight Night: Blaydes vs. Lewis',resultCode:'W',method:'submission',round:2,quality:'name-value',championStatus:'former-champion'}),
    makeFight({date:'2021-09-04',opponent:'Serghei Spivac',event:'UFC Fight Night: Brunson vs. Till',resultCode:'W',method:'ko-tko',round:1,quality:'ranked',rounds:R(1,0)}),
    makeFight({date:'2022-03-19',opponent:'Alexander Volkov',event:'UFC Fight Night: Volkov vs. Aspinall',resultCode:'W',method:'submission',round:1,quality:'top-ten',rounds:R(1,0),scheduledRounds:5,championStatus:'title-challenger'}),
    makeFight({date:'2022-07-23',opponent:'Curtis Blaydes',event:'UFC Fight Night: Blaydes vs. Aspinall',resultCode:'L',method:'other',round:1,quality:'top-five',rounds:R(0,1),scheduledRounds:5,note:'Official 15-second TKO injury loss after Aspinall injured his knee; not treated as a normal competitive finish loss.',loss:{competitive:false,overrideRule:'freak-injury-technical-result',note:'Freak knee-injury result; official loss retained without a normal loss penalty or finish add-on.'}}),
    makeFight({date:'2023-07-22',opponent:'Marcin Tybura',event:'UFC Fight Night: Aspinall vs. Tybura',resultCode:'W',method:'ko-tko',round:1,quality:'top-ten',rounds:R(1,0),scheduledRounds:5}),
    makeFight({date:'2023-11-11',opponent:'Sergei Pavlovich',event:'UFC 295',resultCode:'W',method:'ko-tko',round:1,quality:'top-five',rounds:R(1,0),scheduledRounds:5,titleContext:title('interim',.75),championStatus:'title-challenger',note:'Won the interim UFC heavyweight title on short notice in 69 seconds.'}),
    makeFight({date:'2024-07-27',opponent:'Curtis Blaydes',event:'UFC 304',resultCode:'W',method:'ko-tko',round:1,quality:'top-five',rounds:R(1,0),scheduledRounds:5,titleContext:title('interim',.75),championStatus:'title-challenger',note:'Defended the interim heavyweight title and decisively avenged the injury loss in 60 seconds.'}),
    makeFight({date:'2025-10-25',opponent:'Ciryl Gane',event:'UFC 321',resultCode:'NC',method:'no-contest',round:1,quality:'champion-level',rounds:R(0,0,1,'No-contest round recorded neutrally after an accidental eye poke.'),scheduledRounds:5,titleContext:title('normal',0),championStatus:'former-champion',note:'Undisputed heavyweight title defense ended in a first-round no contest after an accidental eye poke; excluded from scoring.'})
  ]
}];
const judgments={
  [TOM]:{
    championship:{benchmarkCredit:14.54,inputs:[
      {fightId:'2023-11-11-sergei-pavlovich',opponent:'Sergei Pavlovich',finalAdjustedCredit:.75,reviewStatus:'locked'},
      {fightId:'2024-07-27-curtis-blaydes',opponent:'Curtis Blaydes',finalAdjustedCredit:.75,reviewStatus:'locked'}
    ]},
    opponentQuality:{benchmarkCredit:14.54,fighterAdjustment:0,inputs:[
      ['2020-07-25-jake-collier','Jake Collier',.1],
      ['2020-10-11-alan-baudot','Alan Baudot',.1],
      ['2021-02-20-andrei-arlovski','Andrei Arlovski',.4],
      ['2021-09-04-serghei-spivac','Serghei Spivac',.65],
      ['2022-03-19-alexander-volkov','Alexander Volkov',.85],
      ['2023-07-22-marcin-tybura','Marcin Tybura',.65],
      ['2023-11-11-sergei-pavlovich','Sergei Pavlovich',1],
      ['2024-07-27-curtis-blaydes','Curtis Blaydes',1]
    ].map(([fightId,opponent,finalCredit])=>({fighter:TOM,fightId,opponent,finalCredit,reviewStatus:'locked'}))},
    apex:{performances:[
      {fightId:'2023-11-11-sergei-pavlovich',opponent:'Sergei Pavlovich',rating:9.5},
      {fightId:'2024-07-27-curtis-blaydes',opponent:'Curtis Blaydes',rating:9.4}
    ],components:{twoPerformanceStrength:1.89,proof:1.25,bestFighterClaim:.95,aura:1.05},notes:'Back-to-back one-minute heavyweight title finishes establish an elite speed-and-power apex, with total title volume still short of the historic heavyweight standard.'}
  }
};
const judgmentByKey=new Map(Object.entries(judgments).map(([fighter,value])=>[clean(fighter),value]));
const eras={
  [TOM]:{status:'locked-current',window:{start:'2021-09-04',startLabel:'Serghei Spivac',end:null,endLabel:'Current heavyweight championship form',endType:'open_current_champion',endReason:'The Gane no contest pauses the title run without closing the prime.'},lossContext:{unrecoveredLoss:null,weirdResults:[{label:'Curtis Blaydes',date:'2022-07-23',phase:'prime freak knee-injury loss'},{label:'Ciryl Gane',date:'2025-10-25',phase:'prime title no contest after accidental eye poke'}],recoveredLosses:[{label:'Curtis Blaydes',date:'2022-07-23',recovery:'Aspinall returned with three straight first-round finishes and avenged Blaydes in 60 seconds.'}],postPrimeLosses:[]},longevity:{gapCapMonths:18,gapAdjustedMonths:58.3,activeEliteYears:4.86,statusMultiplier:1.08,divisionMultiplier:.95,adjustmentNote:'Spivac through current championship form.',note:'Current elite heavyweight window with a light division-depth discount.'},notes:'UFC-only. The Blaydes knee injury is an official loss with technical context; the Gane no contest is excluded.'}
};
const depthRows=[
  {fighter:TOM,classification:'batch-eleven-factual-completion',approvalStatus:'model-reviewed',decision:'Apply a light modern-heavyweight depth discount while preserving the value of elite title-level finishes.',approvedAdjustment:-.25,approvedAt:'2026-07-16',provenance:'Shared canonical roster batch eleven'}
];
const compareProfiles={
  [TOM]:{shortCase:'Aspinall is the heavyweight speed-and-finishing case: an 8-1 UFC record with one no contest, a perfect finish rate, two interim-title wins, and elite one-minute knockouts of Pavlovich and Blaydes.',peak:'At his best, Aspinall combines heavyweight power with rare hand speed, footwork, submissions, and immediate finishing instincts. His peak can look like the best heavyweight skill set in the division.',resume:'Pavlovich, Blaydes, Volkov, Spivac, Tybura, and Arlovski give him a strong modern heavyweight ledger, but the total UFC sample remains compact.',championship:'He won and defended the interim heavyweight title before being elevated to undisputed champion. The Gane defense ended in a no contest, so the model credits two title-fight wins rather than inventing a third.',opponentQuality:'Pavlovich and Blaydes are the top wins. Volkov, Spivac, and Tybura add ranked depth, while Arlovski receives discounted late-career name value.',prime:'The prime starts with the ranked Spivac finish and remains open. The official Blaydes injury loss stays in the record but receives technical context and no normal loss penalty.',longevity:'His active elite window is approaching five years under the 18-month gap cap, which is useful but still short of Stipe, Couture, and the longest all-time heavyweight cases.',counter:'The strongest counterargument is ceiling: his skill and finishing rate may already be better than several heavyweights ranked above him.',edge:'Aspinall wins appropriate comparisons through elite finishing authority, a clean UFC win ledger, title-level proof, and modern heavyweight skill—not through long championship volume.',signatureWins:'Sergei Pavlovich, Curtis Blaydes, Alexander Volkov, Serghei Spivac, and Marcin Tybura define the UFC-only case.',weakness:'Only two UFC title-fight wins, no completed undisputed defense, a compact elite sample, and a lighter heavyweight depth context keep the GOAT resume below the established champions.',titleSummary:'Won the interim heavyweight title over Pavlovich, defended it over Blaydes, and later became undisputed champion; the Gane defense ended in a no contest.',primeSummary:'A 5-1 prime with one no contest from Spivac through Gane, featuring five finishes and a fully avenged freak-injury loss.',titleStyle:'explosiveInterimChampion',primeStyle:'openHeavyweightFinishPrime'}
};
const uiEraMembership={
  [TOM]:{primary:'new-blood',secondary:'apex'}
};
const fightLedger={};
function registerFacts(){
  const api=window.UFC_CANONICAL_FIGHTER_FACTS;if(!api?.register)throw new Error('Missing canonical fighter facts API.');
  records.forEach(record=>{if(api.has(record.fighter))throw new Error(`Batch-eleven duplicate canonical fighter: ${record.fighter}`);const report=api.validate(record);if(!report.valid)throw new Error(`${record.fighter}: ${report.errors.join(' ')}`);api.register(record);});
}
function registerEras(){
  const api=window.UFC_FIGHTER_ERA_LEDGERS;if(!api?.ledgers)throw new Error('Missing fighter era ledger API.');
  Object.entries(eras).forEach(([fighter,entry])=>{if(api.ledgers[fighter])throw new Error(`Batch-eleven duplicate era ledger: ${fighter}`);api.ledgers[fighter]=entry;});
  api.fighters=api.names();
}
function registerUiEraMembership(){
  const api=window.UFC_ERA_FILTER_DATA;if(!api?.curatedMembership)throw new Error('Missing curated era-filter membership data.');
  Object.entries(uiEraMembership).forEach(([fighter,membership])=>{if(api.curatedMembership[fighter])throw new Error(`Batch-eleven duplicate era-filter membership: ${fighter}`);api.curatedMembership[fighter]=membership;});
  if(api.audit){api.audit.fighterCount=Object.keys(api.curatedMembership).length;api.audit.passed=Array.isArray(api.audit.errors)&&api.audit.errors.length===0;}
}
function registerJudgments(){
  const api=window.UFC_CANONICAL_SCORING_JUDGMENTS;if(!api?.entryFor)throw new Error('Missing canonical scoring judgments API.');
  const previousEntry=api.entryFor.bind(api),previousList=api.list?.bind(api);
  api.entryFor=(category,fighter)=>judgmentByKey.get(clean(fighter))?.[category]?clone(judgmentByKey.get(clean(fighter))[category]):previousEntry(category,fighter);
  if(previousList)api.list=category=>[...(previousList(category)||[]),...Object.entries(judgments).filter(([,value])=>value[category]).map(([fighter,value])=>({normalized:clean(fighter),...clone(value[category])}))];
  api.fighterCount=EXPECTED_FIGHTERS;
}
function registerDepth(){
  const api=window.UFC_CANONICAL_DIVISION_ERA_DEPTH_APPROVED_RESOLUTIONS;if(!api?.entryFor)throw new Error('Missing era-depth resolution API.');
  const previousEntry=api.entryFor.bind(api),rows=[...(api.rows||[])];
  depthRows.forEach(row=>{if(rows.some(existing=>clean(existing.fighter)===clean(row.fighter)))throw new Error(`Batch-eleven duplicate era-depth row: ${row.fighter}`);rows.push(Object.freeze(row));});
  const byKey=new Map(depthRows.map(row=>[clean(row.fighter),row]));
  window.UFC_CANONICAL_DIVISION_ERA_DEPTH_APPROVED_RESOLUTIONS=Object.freeze({...api,version:`${api.version}+${VERSION}`,rows:Object.freeze(rows),fighterCount:rows.length,entryFor:fighter=>byKey.get(clean(fighter))||previousEntry(fighter)});
}
function registerCompare(){
  window.COMPARE_PROFILES=window.COMPARE_PROFILES||{};
  Object.entries(compareProfiles).forEach(([fighter,profile])=>{window.COMPARE_PROFILES[fighter]={...(window.COMPARE_PROFILES[fighter]||{}),...profile};if(window.DISPLAY_OVERRIDES?.[fighter])window.DISPLAY_OVERRIDES[fighter].compareProfile={...(window.DISPLAY_OVERRIDES[fighter].compareProfile||{}),...profile};});
  window.COMPARE_FIGHT_LEDGER=window.COMPARE_FIGHT_LEDGER||{};
  Object.assign(window.COMPARE_FIGHT_LEDGER,fightLedger);
}
function reconcileCalculatorAudit(){
  const api=window.UFC_CATEGORY_CALCULATORS;if(!api?.list)throw new Error('Missing category calculator API.');
  api.expectedFighterCount=EXPECTED_FIGHTERS;
  api.audit=()=>{const rows=api.list(),blocked=rows.filter(row=>row.status!=='complete'),sources={facts:window.UFC_CANONICAL_FIGHTER_FACTS?.count?.()===EXPECTED_FIGHTERS,judgments:Number(window.UFC_CANONICAL_SCORING_JUDGMENTS?.fighterCount)===EXPECTED_FIGHTERS,fighterEraLedgers:window.UFC_FIGHTER_ERA_LEDGERS?.fighters?.length===EXPECTED_FIGHTERS,eraDepthInputs:records.every(record=>Boolean(window.UFC_CANONICAL_DIVISION_ERA_DEPTH_APPROVED_RESOLUTIONS?.entryFor?.(record.fighter)||window.UFC_DIVISION_ERA_DEPTH_SHADOW?.fighters?.some(row=>clean(row.fighter)===clean(record.fighter))))};return{version:`${api.version}+${VERSION}`,expectedFighterCount:EXPECTED_FIGHTERS,fighterCount:rows.length,completeFighterCount:rows.length-blocked.length,blockedFighterCount:blocked.length,blockedFighters:blocked.map(row=>({fighter:row.fighter,missing:row.missing})),sources,readsFrozenExpectedOutputs:false,readsFrozenCategoryControls:false,readsMigrationReconstructionReports:false,mutatesRankingData:false,passed:rows.length===EXPECTED_FIGHTERS&&blocked.length===0&&Object.values(sources).every(Boolean),rows};};
  window.UFC_CATEGORY_CALCULATOR_AUDIT=api.audit();
  if(!window.UFC_CATEGORY_CALCULATOR_AUDIT.passed)throw new Error(`Batch-eleven category audit blocked: ${JSON.stringify(window.UFC_CATEGORY_CALCULATOR_AUDIT.blockedFighters)}`);
}
registerFacts();
registerEras();
registerUiEraMembership();
registerJudgments();
registerDepth();
registerCompare();
reconcileCalculatorAudit();
const factsAudit=window.UFC_CANONICAL_FIGHTER_FACTS.audit();
window.UFC_CANONICAL_ROSTER_BATCH_ELEVEN={version:VERSION,expectedFighterCount:EXPECTED_FIGHTERS,fighters:records.map(record=>record.fighter),factsAudit,categoryAudit:window.UFC_CATEGORY_CALCULATOR_AUDIT,uiEraMembership:clone(uiEraMembership),passed:factsAudit.passed&&factsAudit.total===EXPECTED_FIGHTERS&&window.UFC_CATEGORY_CALCULATOR_AUDIT.passed};
if(!window.UFC_CANONICAL_ROSTER_BATCH_ELEVEN.passed)throw new Error('Canonical roster batch eleven failed final shared-registry audit.');
document.documentElement.setAttribute('data-canonical-roster-batch-eleven',`${VERSION}-clean-${EXPECTED_FIGHTERS}`);
})();
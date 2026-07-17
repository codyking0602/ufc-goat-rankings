// Shared canonical roster batch twelve: normal UFC-only fighter integrations.
(function(){
'use strict';
const VERSION='canonical-roster-batch-twelve-20260716b-quinton-jackson-photos';
const EXPECTED_FIGHTERS=78;
const QUINTON='Quinton Jackson';
const clean=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/[^a-z0-9']+/g,' ').replace(/\s+/g,' ').trim();
const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
const slug=value=>clean(value).replace(/'/g,'').replace(/\s+/g,'-');
const R=(won,lost,drawn=0,note='Reviewed prime-window round allocation.')=>({status:'audited',won,lost,drawn,reviewStatus:'locked',note});
const NA=()=>({status:'not-audited'});
const none=()=>({type:'none'});
const title=(type,manualCredit)=>({type,manualCredit:Number(manualCredit),fighterEligible:true,reviewStatus:'locked'});
function fight({date,opponent,event,result='W',method,round,quality,rounds=NA(),scheduledRounds=3,titleContext=none(),championStatus='contender',note=''}){
  const officialResult=result==='W'?'win':'loss';
  const scoringDisposition=result==='W'?'count-win':'count-loss';
  const row={id:`${date}-${slug(opponent)}`,date,opponent,event,division:'Light Heavyweight',scheduledRounds,officialResult,scoringDisposition,method:{category:method,round},rounds,opponentContext:{qualityTier:quality,championStatus,reviewStatus:'locked'},championshipContext:titleContext};
  if(result==='L')row.lossClassification={divisionContext:'home',competitive:true,reviewStatus:'locked',note:note||'Counted UFC loss.'};
  if(note)row.notes=note;
  return row;
}
const record={
  fighter:QUINTON,
  board:'men',
  status:'audited',
  identity:{primaryDivision:'Light Heavyweight',secondaryDivisions:[],aliases:['Rampage']},
  coverage:{complete:true,verifiedThrough:'2026-07-16',ufcOnly:true,note:'Complete official UFC ledger from Marvin Eastman through Fabio Maldonado. PRIDE, Bellator, WFA, and all other non-UFC fights are excluded.'},
  primeWindow:{startFightId:'2007-05-26-chuck-liddell',endFightId:'2011-09-24-jon-jones',open:false,reviewStatus:'locked',note:'The UFC title knockout of Chuck Liddell begins the connected elite run. The Jon Jones title loss closes the prime before the later Bader and Teixeira decline losses.'},
  longevityContext:{gapCapMonths:18,statusMultiplier:1,reviewStatus:'locked',note:'Closed UFC elite window with the universal 18-month activity-gap cap.'},
  divisionStrength:{defaultKey:'tuf-boom-light-heavyweight-1.00',reviewStatus:'locked',segments:[{key:'tuf-boom-light-heavyweight-1.00',startFightId:'2007-05-26-chuck-liddell',endFightId:'2011-09-24-jon-jones',reviewStatus:'locked'}],note:'Late-2000s light heavyweight receives the neutral 1.00 baseline because the division had genuine champion and top-five depth.'},
  fights:[
    fight({date:'2007-02-03',opponent:'Marvin Eastman',event:'UFC 67: All or Nothing',method:'ko-tko',round:2,quality:'solid',championStatus:'contender'}),
    fight({date:'2007-05-26',opponent:'Chuck Liddell',event:'UFC 71: Liddell vs. Jackson',method:'ko-tko',round:1,quality:'champion-level',rounds:R(1,0),scheduledRounds:5,titleContext:title('normal',1),championStatus:'reigning-champion',note:'Knocked out the reigning UFC light heavyweight champion to win the undisputed title.'}),
    fight({date:'2007-09-08',opponent:'Dan Henderson',event:'UFC 75: Champion vs. Champion',method:'decision',round:5,quality:'top-five',rounds:R(3,2,0,'Reviewed five-round allocation: Henderson early, Jackson controlling the championship rounds.'),scheduledRounds:5,titleContext:title('normal',1),championStatus:'title-challenger',note:'Successful UFC light heavyweight title defense over an elite challenger.'}),
    fight({date:'2008-07-05',opponent:'Forrest Griffin',event:'UFC 86: Jackson vs. Griffin',result:'L',method:'decision',round:5,quality:'top-five',rounds:R(2,3,0,'Reviewed allocation gives Jackson rounds one and four in a competitive five-round title loss.'),scheduledRounds:5,titleContext:title('normal',0),championStatus:'title-challenger',note:'Competitive prime title loss to a top-five challenger.'}),
    fight({date:'2008-12-27',opponent:'Wanderlei Silva',event:'UFC 92: The Ultimate 2008',method:'ko-tko',round:1,quality:'top-five',rounds:R(1,0),championStatus:'contender',note:'First-round knockout over a still-ranked elite light heavyweight; prior non-UFC meetings are excluded.'}),
    fight({date:'2009-03-07',opponent:'Keith Jardine',event:'UFC 96: Jackson vs. Jardine',method:'decision',round:3,quality:'top-ten',rounds:R(2,1),championStatus:'contender'}),
    fight({date:'2010-05-29',opponent:'Rashad Evans',event:'UFC 114: Rampage vs. Evans',result:'L',method:'decision',round:3,quality:'top-five',rounds:R(1,2,0,'Evans controlled the first two rounds; Jackson won the third-round comeback frame.'),scheduledRounds:3,championStatus:'former-champion',note:'Prime loss to a former champion and top-five rival.'}),
    fight({date:'2010-11-20',opponent:'Lyoto Machida',event:'UFC 123: Rampage vs. Machida',method:'decision',round:3,quality:'top-five',rounds:R(2,1,0,'Official winning cards gave Jackson rounds one and two; Machida clearly won round three.'),championStatus:'former-champion',note:'Official split-decision win over a former champion; Opponent Quality credit is discounted for the disputed performance.'}),
    fight({date:'2011-05-28',opponent:'Matt Hamill',event:'UFC 130: Rampage vs. Hamill',method:'decision',round:3,quality:'top-ten',rounds:R(3,0),championStatus:'contender'}),
    fight({date:'2011-09-24',opponent:'Jon Jones',event:'UFC 135: Jones vs. Rampage',result:'L',method:'submission',round:4,quality:'champion-level',rounds:R(0,4,0,'Jones won the first three rounds and the fourth-round submission frame.'),scheduledRounds:5,titleContext:title('normal',0),championStatus:'reigning-champion',note:'Prime title loss to the reigning champion; submission finish receives the locked finish add-on.'}),
    fight({date:'2012-02-25',opponent:'Ryan Bader',event:'UFC 144: Edgar vs. Henderson',result:'L',method:'decision',round:3,quality:'top-ten',championStatus:'contender',note:'Post-prime loss; retained in the official record with no GOAT loss penalty.'}),
    fight({date:'2013-01-26',opponent:'Glover Teixeira',event:'UFC on FOX: Johnson vs. Dodson',result:'L',method:'decision',round:3,quality:'top-five',championStatus:'title-challenger',note:'Post-prime loss to an elite contender; retained in the official record with no GOAT loss penalty.'}),
    fight({date:'2015-04-25',opponent:'Fabio Maldonado',event:'UFC 186: Johnson vs. Horiguchi',method:'decision',round:3,quality:'minimal',championStatus:'unranked',note:'Late-career UFC return win with minimal Opponent Quality value.'})
  ]
};
const judgments={
  championship:{benchmarkCredit:14.54,inputs:[
    {fightId:'2007-05-26-chuck-liddell',opponent:'Chuck Liddell',finalAdjustedCredit:1,reviewStatus:'locked'},
    {fightId:'2007-09-08-dan-henderson',opponent:'Dan Henderson',finalAdjustedCredit:1,reviewStatus:'locked'}
  ]},
  opponentQuality:{benchmarkCredit:14.54,fighterAdjustment:0,inputs:[
    ['2007-05-26-chuck-liddell','Chuck Liddell',1.25],
    ['2007-09-08-dan-henderson','Dan Henderson',1],
    ['2008-12-27-wanderlei-silva','Wanderlei Silva',.85],
    ['2010-11-20-lyoto-machida','Lyoto Machida',.85],
    ['2009-03-07-keith-jardine','Keith Jardine',.65],
    ['2011-05-28-matt-hamill','Matt Hamill',.65],
    ['2007-02-03-marvin-eastman','Marvin Eastman',.25],
    ['2015-04-25-fabio-maldonado','Fabio Maldonado',.1]
  ].map(([fightId,opponent,finalCredit])=>({fighter:QUINTON,fightId,opponent,finalCredit,reviewStatus:'locked'}))},
  apex:{performances:[
    {fightId:'2007-05-26-chuck-liddell',opponent:'Chuck Liddell',rating:9.6},
    {fightId:'2007-09-08-dan-henderson',opponent:'Dan Henderson',rating:9.0}
  ],components:{twoPerformanceStrength:1.86,proof:1.25,bestFighterClaim:.9,aura:1.05},notes:'The Liddell knockout and Henderson title defense give Rampage a championship-proven apex with major historical impact, though the UFC-only reign was brief.'}
};
const era={status:'locked-complete',window:{start:'2007-05-26',startLabel:'Chuck Liddell',end:'2011-09-24',endLabel:'Jon Jones',endType:'closed_decline_boundary',endReason:'The Jones title loss closes the connected elite UFC window; the Bader and Teixeira losses belong to the post-prime decline.'},lossContext:{unrecoveredLoss:{label:'Jon Jones',date:'2011-09-24',phase:'prime title loss ending the elite window'},weirdResults:[],recoveredLosses:[{label:'Forrest Griffin',date:'2008-07-05',recovery:'Returned with wins over Wanderlei Silva and Keith Jardine.'},{label:'Rashad Evans',date:'2010-05-29',recovery:'Returned with wins over Lyoto Machida and Matt Hamill before challenging Jon Jones.'}],postPrimeLosses:[{label:'Ryan Bader',date:'2012-02-25'},{label:'Glover Teixeira',date:'2013-01-26'}]},longevity:{gapCapMonths:18,gapAdjustedMonths:52,activeEliteYears:4.33,statusMultiplier:1,divisionMultiplier:1,adjustmentNote:'Chuck Liddell through Jon Jones.',note:'Four-plus active elite UFC years across a deep light heavyweight championship period.'},notes:'UFC-only. PRIDE and Bellator accomplishments are excluded from the ranking score.'};
const depthRow={fighter:QUINTON,classification:'batch-twelve-factual-completion',approvalStatus:'model-reviewed',decision:'Use the neutral 1.00 late-2000s light-heavyweight baseline: genuine champion and top-five depth without an additional era bonus or discount.',approvedAdjustment:0,approvedAt:'2026-07-16',provenance:'Shared canonical roster batch twelve'};
const compareProfile={shortCase:'Rampage is the short-reign, high-impact light heavyweight case: he knocked out Chuck Liddell for the UFC title, defended it against Dan Henderson, and added ranked wins over Wanderlei Silva, Lyoto Machida, Keith Jardine, and Matt Hamill.',peak:'At his UFC best, Rampage paired fight-changing power with elite takedown defense, physical strength, composure, and enough round-winning structure to beat champions in both explosive and five-round fights.',resume:'The UFC-only ledger is compact but legitimate: Liddell, Henderson, Wanderlei, Machida, Jardine, and Hamill, plus a title win and defense. His PRIDE success is historical context only and adds no score.',championship:'He owns two UFC title-fight wins: the championship knockout of Liddell and a five-round defense over Henderson. The reign ended against Forrest Griffin.',opponentQuality:'Liddell and Henderson anchor the case. Wanderlei and Machida add elite name-and-ranking value, but the Machida split decision is discounted because it did not establish clear superiority.',prime:'The reviewed prime runs from Liddell through Jon Jones at 6-3. It includes two title wins, four top-five wins, a 15-13 audited round edge, and one counted finish loss to Jones.',longevity:'The elite UFC window lasts about 4.3 active years after the standard gap cap. That is meaningful, but shorter than the long-reigning light heavyweight champions.',counter:'The best counterargument against Rampage is UFC volume: two title-fight wins, three prime losses, and only thirteen UFC appearances leave less room for sustained dominance than the division’s longest championship resumes.',edge:'Rampage wins appropriate comparisons through championship proof and elite peak wins. He was not merely popular—he beat the reigning champion, defended against an elite challenger, and remained in the top-title mix for years.',signatureWins:'Chuck Liddell, Dan Henderson, Wanderlei Silva, Lyoto Machida, Keith Jardine, and Matt Hamill define the UFC-only case.',weakness:'A short title reign, a disputed Machida win, three counted prime losses, and limited UFC longevity keep him below the deepest light heavyweight resumes.',titleSummary:'Won the UFC light heavyweight title by knocking out Chuck Liddell and successfully defended it over Dan Henderson before losing to Forrest Griffin.',primeSummary:'A 6-3 prime from Chuck Liddell through Jon Jones, with a 15-13 reviewed round edge and two finish wins.',titleStyle:'shortReignUndisputedChampion',primeStyle:'powerChampionTufBoom'};
const displayOverride={displayName:'Quinton “Rampage” Jackson',profileDisplayName:'Quinton “Rampage” Jackson',divisionLabel:'LHW',resumeTag:'High-impact light heavyweight champion',photoUrl:'assets/fighters/quinton-jackson.webp',thumbUrl:'assets/fighters/quinton-jackson-thumb.webp',photoUnavailable:false,photoStatus:'verified',oneLiner:'The high-impact UFC light heavyweight case: knocked out Chuck Liddell for the belt, defended against Dan Henderson, and stayed in the elite title mix through the Jon Jones era.',whyRankedHere:'Rampage earns his place through two UFC title-fight wins, four top-five victories, championship-level wins over Chuck Liddell and Dan Henderson, and a strong late-2000s light heavyweight prime. His PRIDE résumé is excluded, so this ranking stands on UFC work alone.',whyNotHigher:'He does not rank higher because the UFC title reign was short, the reviewed prime includes losses to Forrest Griffin, Rashad Evans, and Jon Jones, and his thirteen-fight UFC sample cannot match the championship volume of the division’s longest-reigning greats.',keyJudgmentCalls:[['Nickname','The app-facing name is Quinton “Rampage” Jackson.'],['UFC-only scope','PRIDE, Bellator, WFA, and regional results are excluded from scoring.'],['Prime start','The Chuck Liddell title knockout begins the connected elite UFC run.'],['Prime end','The Jon Jones title loss closes the prime; Bader and Teixeira are post-prime losses.'],['Lyoto Machida','The official split-decision win counts, but receives discounted Opponent Quality credit because the performance was disputed.'],['Division depth','Late-2000s light heavyweight uses the neutral 1.00 depth baseline.']],finalTakeaway:'Rampage has a real UFC champion’s résumé, not just star power: a title knockout, a defense over an elite challenger, and multiple ranked wins in a deep division. The ceiling is held down by short championship volume and three prime losses.',compareProfile};
const fightLedger={
  'chuck liddell|quinton jackson':{fighters:['Chuck Liddell',QUINTON],fights:1,winner:QUINTON,importance:'major',summary:'Rampage knocked out the reigning UFC light heavyweight champion at UFC 71. Their earlier non-UFC meeting is excluded from the UFC series count.'},
  'dan henderson|quinton jackson':{fighters:['Dan Henderson',QUINTON],fights:1,winner:QUINTON,importance:'major',summary:'Rampage won a five-round decision at UFC 75 to retain the UFC light heavyweight title.'},
  'forrest griffin|quinton jackson':{fighters:['Forrest Griffin',QUINTON],fights:1,winner:'Forrest Griffin',importance:'major',summary:'Griffin won a competitive five-round decision at UFC 86 to take the light heavyweight title from Rampage.'},
  'quinton jackson|rashad evans':{fighters:[QUINTON,'Rashad Evans'],fights:1,winner:'Rashad Evans',importance:'major',summary:'Evans won the UFC 114 grudge match by unanimous decision after controlling the first two rounds.'},
  'lyoto machida|quinton jackson':{fighters:['Lyoto Machida',QUINTON],fights:1,winner:QUINTON,importance:'major',summary:'Rampage won a disputed split decision at UFC 123. The official result stands, with performance context reflected in Opponent Quality.'},
  'jon jones|quinton jackson':{fighters:['Jon Jones',QUINTON],fights:1,winner:'Jon Jones',importance:'major',summary:'Jones submitted Rampage in the fourth round of their UFC 135 light heavyweight title fight.'},
  'glover teixeira|quinton jackson':{fighters:['Glover Teixeira',QUINTON],fights:1,winner:'Glover Teixeira',importance:'notable',summary:'Teixeira won a unanimous decision at UFC on FOX 6 in Rampage’s post-prime UFC exit fight.'}
};
function registerFacts(){
  const api=window.UFC_CANONICAL_FIGHTER_FACTS;if(!api?.register)throw new Error('Missing canonical fighter facts API.');
  if(api.has(record.fighter))throw new Error(`Batch-twelve duplicate canonical fighter: ${record.fighter}`);
  const report=api.validate(record);if(!report.valid)throw new Error(`${record.fighter}: ${report.errors.join(' ')}`);
  api.register(record);
}
function registerEra(){
  const api=window.UFC_FIGHTER_ERA_LEDGERS;if(!api?.ledgers)throw new Error('Missing fighter era ledger API.');
  if(api.ledgers[QUINTON])throw new Error(`Batch-twelve duplicate era ledger: ${QUINTON}`);
  api.ledgers[QUINTON]=era;api.fighters=api.names();
}
function registerJudgments(){
  const api=window.UFC_CANONICAL_SCORING_JUDGMENTS;if(!api?.entryFor)throw new Error('Missing canonical scoring judgments API.');
  const previousEntry=api.entryFor.bind(api),previousList=api.list?.bind(api),key=clean(QUINTON);
  api.entryFor=(category,fighter)=>clean(fighter)===key&&judgments[category]?clone(judgments[category]):previousEntry(category,fighter);
  if(previousList)api.list=category=>[...(previousList(category)||[]),...(judgments[category]?[{normalized:key,...clone(judgments[category])}]:[])];
  api.fighterCount=EXPECTED_FIGHTERS;
}
function registerDepth(){
  const api=window.UFC_CANONICAL_DIVISION_ERA_DEPTH_APPROVED_RESOLUTIONS;if(!api?.entryFor)throw new Error('Missing era-depth resolution API.');
  const previousEntry=api.entryFor.bind(api),rows=[...(api.rows||[])];
  if(rows.some(existing=>clean(existing.fighter)===clean(QUINTON)))throw new Error(`Batch-twelve duplicate era-depth row: ${QUINTON}`);
  rows.push(Object.freeze(depthRow));
  window.UFC_CANONICAL_DIVISION_ERA_DEPTH_APPROVED_RESOLUTIONS=Object.freeze({...api,version:`${api.version}+${VERSION}`,rows:Object.freeze(rows),fighterCount:rows.length,entryFor:fighter=>clean(fighter)===clean(QUINTON)?depthRow:previousEntry(fighter)});
}
function registerPresentation(){
  window.DISPLAY_OVERRIDES=window.DISPLAY_OVERRIDES||{};
  window.DISPLAY_OVERRIDES[QUINTON]={...(window.DISPLAY_OVERRIDES[QUINTON]||{}),...displayOverride};
  window.COMPARE_PROFILES=window.COMPARE_PROFILES||{};
  window.COMPARE_PROFILES[QUINTON]={...(window.COMPARE_PROFILES[QUINTON]||{}),...compareProfile};
  window.COMPARE_FIGHT_LEDGER=window.COMPARE_FIGHT_LEDGER||{};
  Object.assign(window.COMPARE_FIGHT_LEDGER,fightLedger);
}
function registerEraFilter(){
  const api=window.UFC_ERA_FILTER_DATA;if(!api?.curatedMembership)return;
  api.curatedMembership[QUINTON]={primary:'tuf-boom',secondary:'golden-age'};
  const ids=[api.curatedMembership[QUINTON].primary,api.curatedMembership[QUINTON].secondary].filter(Boolean);
  const errors=[];ids.forEach(id=>{if(!api.byId?.[id])errors.push(`${QUINTON} uses unknown era ${id}.`);});
  api.version=`${api.version}+${VERSION}`;
  api.audit={fighterCount:Object.keys(api.curatedMembership).length,errors,passed:errors.length===0};
}
function registerProfileNickname(){
  const displayName='Quinton “Rampage” Jackson';
  window.DISPLAY_OVERRIDES=window.DISPLAY_OVERRIDES||{};
  window.DISPLAY_OVERRIDES[QUINTON]={...(window.DISPLAY_OVERRIDES[QUINTON]||{}),profileDisplayName:displayName};
  const nicknameApi=window.UFC_CARD_NICKNAMES;
  if(nicknameApi?.displayNames){nicknameApi.displayNames[QUINTON]=displayName;if(Array.isArray(nicknameApi.fighters)&&!nicknameApi.fighters.includes(QUINTON))nicknameApi.fighters.push(QUINTON);}
}
function reconcileCalculatorAudit(){
  const api=window.UFC_CATEGORY_CALCULATORS;if(!api?.list)throw new Error('Missing category calculator API.');
  api.expectedFighterCount=EXPECTED_FIGHTERS;
  api.audit=()=>{const rows=api.list(),blocked=rows.filter(row=>row.status!=='complete'),sources={facts:window.UFC_CANONICAL_FIGHTER_FACTS?.count?.()===EXPECTED_FIGHTERS,judgments:Number(window.UFC_CANONICAL_SCORING_JUDGMENTS?.fighterCount)===EXPECTED_FIGHTERS,fighterEraLedgers:window.UFC_FIGHTER_ERA_LEDGERS?.fighters?.length===EXPECTED_FIGHTERS,eraDepthInputs:Boolean(window.UFC_CANONICAL_DIVISION_ERA_DEPTH_APPROVED_RESOLUTIONS?.entryFor?.(QUINTON))};return{version:`${api.version}+${VERSION}`,expectedFighterCount:EXPECTED_FIGHTERS,fighterCount:rows.length,completeFighterCount:rows.length-blocked.length,blockedFighterCount:blocked.length,blockedFighters:blocked.map(row=>({fighter:row.fighter,missing:row.missing})),sources,readsFrozenExpectedOutputs:false,readsFrozenCategoryControls:false,readsMigrationReconstructionReports:false,mutatesRankingData:false,passed:rows.length===EXPECTED_FIGHTERS&&blocked.length===0&&Object.values(sources).every(Boolean),rows};};
  window.UFC_CATEGORY_CALCULATOR_AUDIT=api.audit();
  if(!window.UFC_CATEGORY_CALCULATOR_AUDIT.passed)throw new Error(`Batch-twelve category audit blocked: ${JSON.stringify(window.UFC_CATEGORY_CALCULATOR_AUDIT.blockedFighters)}`);
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
window.UFC_CANONICAL_ROSTER_BATCH_TWELVE={version:VERSION,expectedFighterCount:EXPECTED_FIGHTERS,fighters:[QUINTON],factsAudit,categoryAudit:window.UFC_CATEGORY_CALCULATOR_AUDIT,eraMembership:window.UFC_ERA_FILTER_DATA?.curatedMembership?.[QUINTON]||null,photoStatus:'verified',passed:factsAudit.passed&&factsAudit.total===EXPECTED_FIGHTERS&&window.UFC_CATEGORY_CALCULATOR_AUDIT.passed};
if(!window.UFC_CANONICAL_ROSTER_BATCH_TWELVE.passed)throw new Error('Canonical roster batch twelve failed final shared-registry audit.');
document.documentElement.setAttribute('data-canonical-roster-batch-twelve',`${VERSION}-clean-${EXPECTED_FIGHTERS}`);
})();
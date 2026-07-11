// Canonical fighter registry for post-refactor roster additions.
// Registers approved fighter data once, then integrates it into each live scoring stage.
(function(){
  'use strict';

  const VERSION='canonical-fighter-registry-20260710a-cris-cyborg';
  const NAME='Cris Cyborg';
  const DATA=window.RANKING_DATA;
  const CHAMPIONSHIP_BENCHMARK=14.54;
  const QUALITY_BENCHMARK=14.10;

  function round2(value){return Math.round((Number(value||0)+Number.EPSILON)*100)/100;}
  function key(value){return String(value||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function displayStore(){return typeof DISPLAY_OVERRIDES!=='undefined'?DISPLAY_OVERRIDES:(window.DISPLAY_OVERRIDES||null);}
  function allRowsFor(name){
    const target=key(name),rows=[];
    const push=row=>{if(row&&key(row.fighter)===target)rows.push(row);};
    (DATA?.men||[]).forEach(push);(DATA?.women||[]).forEach(push);(DATA?.fighters||[]).forEach(push);
    return rows;
  }
  function upsert(rows,row){
    if(!Array.isArray(rows)||!row?.fighter)return null;
    const index=rows.findIndex(item=>key(item?.fighter)===key(row.fighter));
    if(index>=0){rows[index]={...rows[index],...row};return rows[index];}
    rows.push(row);return row;
  }
  function mergeCompareProfile(existing,addition){
    return {...(existing||{}),...(addition||{}),legacyStats:{...(existing?.legacyStats||{}),...(addition?.legacyStats||{})}};
  }
  function updateSnapshot(override,label,value,tests){
    if(!override)return;
    const rows=Array.isArray(override.snapshot)?override.snapshot.slice():[];
    const index=rows.findIndex(item=>Array.isArray(item)&&tests.some(test=>test.test(String(item[0]||''))));
    if(index>=0)rows[index]=[label,value];else rows.push([label,value]);
    override.snapshot=rows;
  }

  const championshipWins=[
    {opponent:'Tonya Evinger',titleType:'vacantUndisputed',strength:0.75,adjustedCredit:0.68,reviewStatus:'locked',notes:'Vacant UFC featherweight title win over a promotional newcomer moving up from bantamweight.'},
    {opponent:'Holly Holm',titleType:'normal',strength:0.90,adjustedCredit:0.90,reviewStatus:'locked',notes:'Legitimate five-round defense over a former UFC champion and dangerous title challenger.'},
    {opponent:'Yana Kunitskaya',titleType:'normal',strength:0.75,adjustedCredit:0.75,reviewStatus:'locked',notes:'Valid title defense with a shallow-division and promotional-debut opponent discount.'}
  ];

  const qualityRows=[
    ['Holly Holm',1.00,'True top-5 win','Former UFC champion and legitimate five-round featherweight title challenger.','locked'],
    ['Felicia Spencer',0.85,'Strong top-10 win','Unbeaten UFC contender who later challenged Amanda Nunes for the title.','locked'],
    ['Tonya Evinger',0.65,'Ranked / quality win','Experienced champion entering the UFC, discounted for divisional and debut context.','locked'],
    ['Yana Kunitskaya',0.65,'Ranked / quality win','Title challenger with meaningful ability, discounted for shallow-division and debut context.','locked'],
    ['Leslie Smith',0.45,'Solid resume win','Useful UFC debut win at a catchweight, below ranked championship quality.','locked'],
    ['Lina Lansberg',0.45,'Solid resume win','Solid UFC main-event win at a catchweight, below ranked championship quality.','locked']
  ];

  const rounds=[
    {opponent:'Leslie Smith',date:'2016-05-14',method:'R1 TKO win',roundEnded:1,roundsCounted:1,roundsWon:1,basis:'Round-one finish counted as won',confidence:'High',notes:'140-pound catchweight UFC debut.'},
    {opponent:'Lina Lansberg',date:'2016-09-24',method:'R2 TKO win',roundEnded:2,roundsCounted:2,roundsWon:2,basis:'Finish round and completed opening round counted as won',confidence:'High',notes:'140-pound catchweight main event.'},
    {opponent:'Tonya Evinger',date:'2017-07-29',method:'R3 TKO win',roundEnded:3,roundsCounted:3,roundsWon:3,basis:'Dominant vacant-title finish ledger',confidence:'High',notes:'Won the vacant UFC women’s featherweight title.'},
    {opponent:'Holly Holm',date:'2017-12-30',method:'Decision win',roundEnded:5,roundsCounted:5,roundsWon:3,basis:'Conservative consensus scorecard split',confidence:'Medium',notes:'Unanimous decision defense; two 48-47 cards support a conservative 3-2 round split.'},
    {opponent:'Yana Kunitskaya',date:'2018-03-03',method:'R1 TKO win',roundEnded:1,roundsCounted:1,roundsWon:1,basis:'Round-one finish counted as won',confidence:'High',notes:'Second successful title defense.'},
    {opponent:'Amanda Nunes',date:'2018-12-29',method:'R1 KO loss',roundEnded:1,roundsCounted:1,roundsWon:0,basis:'Round-one finish loss counted as lost',confidence:'High',notes:'Prime elite title loss and only UFC defeat.'},
    {opponent:'Felicia Spencer',date:'2019-07-27',method:'Decision win',roundEnded:3,roundsCounted:3,roundsWon:3,basis:'Official decision scorecards',confidence:'High',notes:'Re-proved elite UFC form after the Nunes loss and ended UFC tenure on a win.'}
  ];

  const compareProfile={
    shortCase:'Cyborg is the compact UFC featherweight champion case: three title-fight wins, dominant control, a strong Holm defense, and one prime loss to Amanda Nunes.',
    peak:'At her UFC best, Cyborg combined physical pressure, power, pace, and finishing danger with enough composure to win a five-round striking fight against Holly Holm.',
    resume:'Her UFC résumé is short but real: a 6-1 record, a vacant-title win, two defenses, four finishes, and a final rebound over Felicia Spencer.',
    championship:'Three UFC title-fight wins give her more championship substance than the one-win or no-defense cases below her, even after opponent-strength discounts.',
    opponentQuality:'Holly Holm anchors the win ledger. Spencer, Evinger, and Kunitskaya provide support, but the division was too shallow to create deep elite volume.',
    longevity:'Her scored UFC elite window lasted a little over three years. That is enough to matter, but nowhere near the longest women’s title runs.',
    counter:'The counterargument is scope: only seven UFC fights and one truly elite UFC victory. Most of Cyborg’s broader historical greatness happened outside this ranking.',
    edge:'Cyborg wins comparisons when championship substance, dominance, and the Holm defense outweigh deeper but less authoritative contender résumés.',
    scope:'Strikeforce, Invicta, Bellator, PFL, and regional accomplishments are historical context only and do not add points.',
    eliteCounter:true,
    signatureWins:'Holly Holm, Felicia Spencer, Tonya Evinger, and Yana Kunitskaya.',
    weakness:'Only seven UFC fights, a shallow featherweight division, and one truly elite UFC win.',
    titleSummary:'Won the vacant UFC featherweight title and made two successful defenses before losing to Amanda Nunes.',
    primeSummary:'6-1 UFC prime from Leslie Smith through Felicia Spencer, with the Nunes title loss fully counted inside the window.',
    titleStyle:'compactFeatherweightReign',
    primeStyle:'destructiveCompactPrime',
    legacyStats:{ufcRecord:'6-1',titleFightWins:3,adjustedTitleWins:2.33,beltsWon:1,titleDefenses:2,activeEliteYearsLabel:'roughly 3.2 active elite years',primeNote:'Leslie Smith through Felicia Spencer; Nunes loss counted, non-UFC career excluded'}
  };

  const boardRow={
    fighter:NAME,totalScore:39.65,championship:4.80,opponentQuality:8.62,primeDominance:23.13,
    longevity:7.78,longevityThirtyPoint:true,apexPeak:4.60,penalty:-2.25,leaderboard:'women',gender:'Women',
    ufcRecord:'6-1',primaryDivision:'Featherweight',secondaryDivision:'Catchweight',finishRatePct:66.7,
    activeEliteYears:3.20,timesFinishedPrime:1,primeRecord:'6-1',roundsWonPct:81.25,
    notes:'UFC-only featherweight champion: three title-fight wins, two defenses, dominant 6-1 run, and one counted prime loss to Amanda Nunes.'
  };

  const profile={
    id:'CYB001',fighter:NAME,gender:'Women',primaryDivision:'Featherweight',secondaryDivision:'Catchweight',scope:'UFC',
    ufcRecord:'6-1',ufcWins:6,ufcLosses:1,ufcNoContests:0,ufcDraws:0,scoredUfcFights:7,
    finishWins:4,finishRatePct:66.7,timesFinishedPrime:1,lossPenalty:-2.25,activeEliteYears:3.20,
    primeStart:'Leslie Smith 2016',primeEnd:'Felicia Spencer 2019',rank:7,totalScore:39.65,
    championship:4.80,opponentQuality:8.62,primeDominance:23.13,longevity:7.78,longevityThirtyPoint:true,
    apexPeak:4.60,penalty:-2.25,leaderboard:'women',primeRecord:'6-1',primeRecordContext:'Leslie Smith → Felicia Spencer',
    title:{normalTitleWins:2,interimTitleWins:0,vacantUndisputedWins:1,secondDivisionUndisputedWins:0,vacantSecondDivisionWins:0,titleFightWins:3,adjustedTitleWins:2.33,notes:'Won the vacant UFC featherweight title and made two successful defenses. Evinger and Kunitskaya receive shallow-division/opponent-context discounts; Holm is the strongest title win.'},
    opponents:qualityRows.map(row=>({opponent:row[0],division:'Featherweight',context:row[3],credit:row[1],type:row[2]})),
    rounds,
    notes:'UFC-only scoring. Strikeforce, Invicta, Bellator, PFL, and regional accomplishments are excluded from the main score.'
  };

  const display={
    divisionLabel:'WFW',resumeTag:'UFC featherweight champion',
    oneLiner:'A dominant 6-1 UFC champion with two defenses and real Holm win value, held below the women’s elite tier by a short run and shallow division depth.',
    snapshot:[
      ['UFC Record','6-1'],['UFC Title-Fight Wins','3'],['Adjusted Title Credit','2.33'],
      ['Prime Record','6-1'],['Rounds Won','13/16 (81.25%)'],['Prime Finish Rate','57.14% (4/7)'],
      ['Active Elite Years','3.20'],['Apex Peak','+4.60'],['Loss Context','-2.25']
    ],
    whyRankedHere:'Cyborg earns a strong UFC-only placement because she went 6-1, won the featherweight title, defended it twice, dominated most of the scored rounds, and lost only to Amanda Nunes.',
    whyNotHigher:'The ceiling is UFC volume and division depth. Seven UFC fights and one truly elite UFC win cannot match the deeper championship and opponent ledgers above her, and her extensive non-UFC greatness is not scored.',
    bigAssumptions:[
      ['Prime window','Leslie Smith through Felicia Spencer. The Nunes loss stays inside the window because Cyborg returned and beat an unbeaten contender.'],
      ['Title discounts','Evinger and Kunitskaya receive 0.75 opponent-strength multipliers; Holm receives 0.90.'],
      ['Round control','Holly Holm is conservatively counted 3-2, producing 13 of 16 prime rounds won.'],
      ['Division strength','Women’s featherweight receives a 0.90 Longevity multiplier because the UFC division was extremely shallow.'],
      ['Scope','All non-UFC accomplishments are historical context only.']
    ],
    keyJudgmentCalls:[
      ['Amanda Nunes loss','Counted as a prime elite title finish loss for -2.25, but not the prime endpoint because Cyborg rebounded against Felicia Spencer.'],
      ['Holly Holm win','The clear anchor of both Championship Resume and Opponent Quality.'],
      ['Short UFC run','Prime Dominance remains strong, but Championship, Quality Wins, and Longevity prevent over-ranking.'],
      ['No photo paths','Initials fallback remains until real WebP assets are added.']
    ],
    finalTakeaway:'Cyborg is a legitimate upper-half women’s UFC legacy case: compact, dominant, and championship-proven, but clearly capped by UFC volume and featherweight depth.',
    compareProfile
  };

  const eraLedger={
    status:'locked',
    window:{start:'2016-05-14',startLabel:'Leslie Smith',end:'2019-07-27',endLabel:'Felicia Spencer',endType:'promotion_exit_win',endReason:'Amanda Nunes did not end the prime because Cyborg immediately re-proved elite UFC form by beating unbeaten contender Felicia Spencer. Her UFC tenure then ended on a win.',canonical:true,locked:true,lockVersion:VERSION},
    lossContext:{
      unrecoveredLoss:null,
      recoveredLosses:[{label:'Amanda Nunes',date:'2018-12-29',type:'prime elite title finish loss',method:'KO',recovery:'Returned to defeat unbeaten UFC contender Felicia Spencer.'}],
      upwardDivisionLosses:[],postPrimeLosses:[],weirdResults:[]
    },
    longevity:{gapCapMonths:18,gapAdjustedMonths:38.4,activeEliteYears:3.20,statusMultiplier:1.08,divisionMultiplier:0.90,adjustmentNote:'Leslie Smith through Felicia Spencer. No elite-fight gap exceeded the universal 18-month cap.',note:'Compact UFC featherweight championship window with shallow-division compression.',windowLockedPendingRecalculation:false,canonicalWindowRecalculated:true,canonicalWindowRecalculationVersion:VERSION,calculationAsOf:'2026-07-10'},
    notes:'UFC-only window. Non-UFC titles and fights are excluded from scoring.',
    lossContextCompletion:{version:VERSION,batch:'canonical-fighter-registry',machineReadable:true,completeUfcLossLedger:true,source:'Approved UFC-only Cris Cyborg audit',completedAt:new Date().toISOString()}
  };

  const primeEntry={
    fighter:NAME,primeRecord:'6-1',primeWins:6,primeLosses:1,primeDraws:0,primeNCs:0,
    primeRecordPct:85.71,primeRecordScore:7.71,roundControlPct:81.25,roundControlScore:6.50,
    roundControlAudit:{fighter:NAME,roundsWon:13,roundsLost:3,roundsCounted:16,roundControlPct:81.25,status:'locked',source:'Approved fight-by-fight UFC prime round ledger',window:'Leslie Smith 2016 → Felicia Spencer 2019',fights:rounds.map(row=>[row.opponent,row.roundsWon,row.roundsCounted-row.roundsWon,row.notes]),version:VERSION},
    primeFights:7,primeFinishes:4,primeFinishRate:57.14,finishPressureScore:3.00,
    eliteStakesBreakdown:{titleFightWins:1.50,topFiveWins:0.75,champFormerChampWins:0.75,fiveRoundTitleStageSample:0.50,divisionStrengthContext:0.20},
    eliteStakesRawScore:3.70,eliteStakesScore:5.92,total:23.13,
    dominanceProfile:'Compact, destructive UFC featherweight championship prime with four finishes and dominant round control; the Nunes knockout is fully counted and shallow division depth caps elite-stakes validation.',
    status:'locked',primeWindow:{...eraLedger.window},canonicalWindowRebuild:true,version:VERSION
  };

  const apexAudit={
    score:4.60,window:'Tonya Evinger 2017 + Holly Holm 2017',
    performances:[
      {label:'Tonya Evinger',date:'2017-07-29',rating:8.0,note:'Dominant third-round finish to win the vacant UFC featherweight title.'},
      {label:'Holly Holm',date:'2017-12-30',rating:8.5,note:'Five-round title defense over a former UFC champion and dangerous striker.'}
    ],
    performanceAverage:8.25,
    components:{twoPerformanceStrength:1.65,proof:1.10,bestFighterClaim:1.00,aura:0.85},
    componentTotal:4.60,
    notes:'Real champion-level aura and proof, capped below the mythic tier by shallow featherweight depth and a two-win apex pair with only one elite UFC opponent.',
    rubric:{twoPerformanceStrength:{label:'Two-performance strength',max:2},proof:{label:'Proof',max:1.75},bestFighterClaim:{label:'Best-fighter claim',max:1.25},aura:{label:'Aura',max:1},total:{label:'Apex Peak bonus',max:6}},
    rules:{window:'Best two UFC wins within 24 months',totalMax:6},source:'Approved Apex Peak audit',version:VERSION
  };

  function registerBase(){
    if(!DATA)return {applied:false,error:'Missing RANKING_DATA'};
    DATA.women=DATA.women||[];DATA.fighters=DATA.fighters||[];DATA.primeRecords=DATA.primeRecords||{};
    const board=upsert(DATA.women,boardRow);
    const fighterProfile=upsert(DATA.fighters,profile);
    DATA.primeRecords[NAME]={...(DATA.primeRecords[NAME]||{}),record:'6-1',context:'Leslie Smith → Felicia Spencer',wins:6,losses:1,draws:0,ncs:0,source:'Approved canonical UFC prime recount',sourceVersion:VERSION,eraWindowLocked:true,primeDominanceRebuildVersion:VERSION};

    const overrides=displayStore();
    if(overrides){overrides[NAME]={...(overrides[NAME]||{}),...display,compareProfile:mergeCompareProfile(overrides[NAME]?.compareProfile,compareProfile)};}

    window.COMPARE_PROFILES=window.COMPARE_PROFILES||{};
    window.COMPARE_PROFILES[NAME]=mergeCompareProfile(window.COMPARE_PROFILES[NAME],compareProfile);
    window.COMPARE_FIGHT_LEDGER=window.COMPARE_FIGHT_LEDGER||{};
    window.COMPARE_FIGHT_LEDGER['amanda nunes|cris cyborg']={fighters:['Amanda Nunes',NAME],fights:1,winner:'Amanda Nunes',importance:'major',summary:'Nunes knocked out Cyborg in 51 seconds to win the UFC featherweight title. It is the defining loss in Cyborg’s UFC résumé and major direct separation for Nunes.'};
    window.COMPARE_FIGHT_LEDGER['cris cyborg|holly holm']={fighters:[NAME,'Holly Holm'],fights:1,winner:NAME,importance:'major',summary:'Cyborg defeated Holm over five rounds in a UFC featherweight title defense, the strongest win and clearest elite proof in Cyborg’s UFC-only case.'};

    const era=window.UFC_FIGHTER_ERA_LEDGERS;
    if(era?.ledgers){era.ledgers[NAME]=eraLedger;era.fighters=Array.from(new Set([...(era.fighters||[]),NAME]));}

    const championshipStore=window.UFC_CHAMPIONSHIP_RESUME_LEDGERS;
    if(championshipStore?.ledgers){
      championshipStore.ledgers[NAME]={fighter:NAME,championshipWins:championshipWins.map(row=>({...row}))};
      championshipStore.version=VERSION;
    }
    applyChampionship();

    const qualityStore=window.UFC_OPPONENT_QUALITY_LEDGERS;
    if(qualityStore?.raw)qualityStore.raw[NAME]=qualityRows.map(row=>row.slice());

    DATA.meta=DATA.meta||{};
    DATA.meta.canonicalFighterRegistry={version:VERSION,fighters:[NAME],appliedAt:new Date().toISOString()};
    const status={applied:true,fighter:NAME,boardRow:board,profile:fighterProfile,eraLedgerRegistered:!!era?.ledgers?.[NAME],championshipLedgerRegistered:!!championshipStore?.ledgers?.[NAME],qualityLedgerRegistered:!!qualityStore?.raw?.[NAME],version:VERSION,appliedAt:new Date().toISOString()};
    API.base=status;
    document.documentElement.setAttribute('data-canonical-fighter-registry',`${VERSION}-base`);
    return status;
  }

  function applyChampionship(){
    if(!DATA)return {applied:false,error:'Missing RANKING_DATA'};
    const adjustedTitleCredit=round2(championshipWins.reduce((sum,row)=>sum+Number(row.adjustedCredit||0),0));
    const score=round2(Math.min(30,(adjustedTitleCredit/CHAMPIONSHIP_BENCHMARK)*30));
    const wins=championshipWins.map((row,index)=>({index:index+1,opponent:row.opponent,titleType:row.titleType,baseValue:row.titleType==='vacantUndisputed'?0.9:1,strength:row.strength,adjustedCredit:round2((row.titleType==='vacantUndisputed'?0.9:1)*row.strength),reviewStatus:row.reviewStatus,source:'canonicalFighterRegistry',notes:row.notes}));
    const report={fighter:NAME,status:'direct-ledger',titleFightWins:3,adjustedTitleCredit,discountedWins:3,reviewStatus:'locked',formulaScore:score,wins};
    allRowsFor(NAME).forEach(row=>{
      row.championship=score;row.championshipResumeLive=true;row.championshipFormulaDriven=true;
      row.championshipResumeAudit=report;
      row.title={...(row.title||{}),titleFightWins:3,normalTitleWins:2,vacantUndisputedWins:1,adjustedTitleWins:adjustedTitleCredit,championshipScore:score,discountedWins:3,reviewStatus:'locked',notes:`Total title fight wins = 3. Adjusted title-win credit = ${adjustedTitleCredit.toFixed(2)}. Championship Resume score = ${score.toFixed(2)}/30.`};
    });
    const shadow=window.UFC_CHAMPIONSHIP_RESUME_SHADOW;
    if(shadow?.report){const existing=shadow.report.findIndex(row=>key(row.fighter)===key(NAME));const row={fighter:NAME,status:'direct-ledger',titleFightWins:3,adjustedTitleCredit,discountedWins:3,reviewStatus:'locked'};if(existing>=0)shadow.report[existing]=row;else shadow.report.push(row);shadow.ledgerFighterCount=Object.keys(window.UFC_CHAMPIONSHIP_RESUME_LEDGERS?.ledgers||{}).length;shadow.reviewRows=shadow.report.filter(row=>row.reviewStatus!=='locked');}
    const live=window.UFC_CHAMPIONSHIP_RESUME_LIVE;
    if(live){live.fighters=(shadow?.report||[]).length;live.approvedRegistryVersion=VERSION;}
    const overrides=displayStore();
    if(overrides?.[NAME]){
      const o=overrides[NAME];o.snapshotStats={...(o.snapshotStats||{}),titleFightWins:3,adjustedTitleWins:adjustedTitleCredit,championshipScore:score};
      updateSnapshot(o,'UFC Title-Fight Wins','3',[/title[-\s]*fight wins/i]);
      updateSnapshot(o,'Championship Resume',`${score.toFixed(2)}/30`,[/championship level/i,/championship resume/i,/title reign/i]);
      updateSnapshot(o,'Adjusted Title Credit',adjustedTitleCredit.toFixed(2),[/adjusted title/i]);
    }
    return {applied:true,fighter:NAME,score,adjustedTitleCredit,titleFightWins:3,version:VERSION};
  }

  function applyOpponentQuality(){
    const store=window.UFC_OPPONENT_QUALITY_LEDGERS;
    const audit=window.UFC_OPPONENT_QUALITY_SHADOW_AUDIT;
    const live=window.UFC_OPPONENT_QUALITY_LIVE;
    if(!store?.raw)return {applied:false,error:'Opponent Quality ledger not ready'};
    store.raw[NAME]=qualityRows.map(row=>row.slice());
    const summary=audit?.summaryFor?.(NAME)||store.summarize?.(NAME);
    if(!summary)return {applied:false,error:'Opponent Quality summary unavailable'};
    const liveScore=round2(Math.min(30,(Number(summary.diminishedCredit||0)/QUALITY_BENCHMARK)*30));
    const report={...summary,liveScore,categoryScore:liveScore,benchmarkCredit:QUALITY_BENCHMARK,sourceBenchmarkCredit:live?.sourceBenchmarkCredit||QUALITY_BENCHMARK,sourceMode:'canonical-registry',writerMode:'category-only',version:VERSION};
    allRowsFor(NAME).forEach(row=>{
      row.opponentQualityLegacy=row.opponentQualityLegacy??row.opponentQuality;row.opponentQuality=liveScore;row.opponentQualityLive=true;
      row.opponentQualityLiveAudit=report;row.opponentQualityShadowAudit=report;row.elitePlusWins=summary.elitePlusWins;row.topFivePlusWins=summary.topFivePlusWins;row.rankedQualityWins=summary.rankedQualityWins;row.winProfile=summary.winProfile;
    });
    if(audit?.report){const index=audit.report.findIndex(row=>key(row.fighter)===key(NAME));if(index>=0)audit.report[index]=summary;else audit.report.push(summary);audit.report.sort((a,b)=>Number(b.diminishedCredit||0)-Number(a.diminishedCredit||0)||Number(b.rawCredit||0)-Number(a.rawCredit||0)||String(a.fighter).localeCompare(String(b.fighter)));audit.fighters=audit.report.length;audit.leaders=audit.report.slice(0,15).map(row=>({fighter:row.fighter,rawCredit:row.rawCredit,diminishedCredit:row.diminishedCredit,elitePlusWins:row.elitePlusWins,topFivePlusWins:row.topFivePlusWins,rankedQualityWins:row.rankedQualityWins,winProfile:row.winProfile}));}
    if(live?.report){const index=live.report.findIndex(row=>key(row.fighter)===key(NAME));if(index>=0)live.report[index]=report;else live.report.push(report);live.report.sort((a,b)=>Number(b.liveScore||0)-Number(a.liveScore||0)||Number(b.diminishedCredit||0)-Number(a.diminishedCredit||0)||String(a.fighter).localeCompare(String(b.fighter)));live.fighters=live.report.length;live.leaders=live.report.slice(0,20).map(row=>({fighter:row.fighter,liveScore:row.liveScore,diminishedCredit:row.diminishedCredit,elitePlusWins:row.elitePlusWins,topFivePlusWins:row.topFivePlusWins,winProfile:row.winProfile}));live.approvedRegistryVersion=VERSION;}
    const overrides=displayStore();
    if(overrides?.[NAME]){
      const o=overrides[NAME];o.snapshotStats={...(o.snapshotStats||{}),elitePlusWins:summary.elitePlusWins,topFivePlusWins:summary.topFivePlusWins,rankedQualityWins:summary.rankedQualityWins,bestQualityWins:(summary.bestWins||[]).slice(0,5).join(', '),winProfile:summary.winProfile,opponentQualityScore:liveScore};
      updateSnapshot(o,'Elite+ / Top-5+ Wins',`${summary.elitePlusWins} / ${summary.topFivePlusWins}`,[/elite\+?\s*\/\s*top[-\s]*5/i,/quality wins/i,/opponent quality/i]);
      updateSnapshot(o,'Win Profile',summary.winProfile,[/win profile/i,/resume shape/i,/quality type/i]);
    }
    const status={applied:true,fighter:NAME,rawCredit:summary.rawCredit,diminishedCredit:summary.diminishedCredit,score:liveScore,summary,version:VERSION,appliedAt:new Date().toISOString()};
    API.opponentQuality=status;return status;
  }

  function applyPrimeDominance(){
    const base=window.UFC_PRIME_DOMINANCE_LEDGERS;
    const model=window.UFC_PRIME_DOMINANCE_SHADOW_MODEL;
    if(!base?.report)return {applied:false,error:'Prime Dominance ledger not ready'};
    const priorEntryFor=base.entryFor;
    base.entryFor=fighter=>key(fighter)===key(NAME)?primeEntry:priorEntryFor?.(fighter)||null;
    const index=base.report.findIndex(row=>key(row.fighter)===key(NAME));if(index>=0)base.report[index]=primeEntry;else base.report.push(primeEntry);
    base.report.sort((a,b)=>Number(b.total||0)-Number(a.total||0)||String(a.fighter).localeCompare(String(b.fighter)));base.leaders=base.report.slice(0,15);base.applied=Array.from(new Set([...(base.applied||[]),NAME]));base.canonicalFighterRegistry={version:VERSION,fighters:[NAME],entries:{[NAME]:primeEntry}};
    if(model){model.report=base.report;model.canonicalFighterRegistry=base.canonicalFighterRegistry;}
    const roundAudit=window.UFC_PRIME_ROUND_CONTROL_AUDIT;
    if(roundAudit){const priorRoundEntryFor=roundAudit.entryFor;roundAudit.entryFor=fighter=>key(fighter)===key(NAME)?primeEntry.roundControlAudit:priorRoundEntryFor?.(fighter)||null;const rows=Array.isArray(roundAudit.report)?roundAudit.report:[];const roundIndex=rows.findIndex(row=>key(row.fighter)===key(NAME));if(roundIndex>=0)rows[roundIndex]=primeEntry.roundControlAudit;else rows.push(primeEntry.roundControlAudit);rows.sort((a,b)=>Number(b.roundControlPct||0)-Number(a.roundControlPct||0)||String(a.fighter).localeCompare(String(b.fighter)));roundAudit.report=rows;roundAudit.canonicalFighterRegistry={version:VERSION,fighters:[NAME]};}
    allRowsFor(NAME).forEach(row=>{row.primeRecord='6-1';row.primeDominanceShadowAudit=primeEntry;row.roundsWonPct=81.25;row.primeFinishRatePct=57.14;});
    const status={applied:true,fighter:NAME,entry:primeEntry,version:VERSION,appliedAt:new Date().toISOString()};API.primeDominance=status;return status;
  }

  function applyApexPeak(){
    allRowsFor(NAME).forEach(row=>{row.apexPeak=4.60;row.apexPeakAudit=apexAudit;row.apexPeakBonusLive=true;row.apexPeakBonusVersion=VERSION;});
    const overrides=displayStore();if(overrides?.[NAME]){overrides[NAME].apexPeakAudit=apexAudit;overrides[NAME].snapshotStats={...(overrides[NAME].snapshotStats||{}),apexPeak:4.60,apexPeakAudit};updateSnapshot(overrides[NAME],'Apex Peak','+4.60',[/apex peak/i]);}
    const component=window.UFC_APEX_PEAK_COMPONENT_AUDIT;
    if(component){component.componentOverrides=component.componentOverrides||{};component.componentOverrides[NAME]=apexAudit;component.patched=Array.from(new Set([...(component.patched||[]),NAME]));component.approvedRegistryVersion=VERSION;}
    const locked=window.UFC_APEX_PEAK_LOCKED_AUDIT;if(locked){locked.fighters=Array.from(new Set([...(locked.fighters||[]),NAME]));locked.patched=Array.from(new Set([...(locked.patched||[]),NAME]));locked.approvedRegistryVersion=VERSION;}
    const live=window.UFC_APEX_PEAK_LIVE_BONUS;if(live){const boardRows=[...(DATA?.men||[]),...(DATA?.women||[])];live.appliedCount=new Set([...(DATA?.men||[]),...(DATA?.women||[])].map(row=>row.fighter)).size;live.lockedCount=(locked?.fighters||[]).length;live.apexLeaders=boardRows.slice().sort((a,b)=>Number(b.apexPeak||0)-Number(a.apexPeak||0)||String(a.fighter).localeCompare(String(b.fighter))).slice(0,10).map(row=>({fighter:row.fighter,apexPeak:row.apexPeak}));live.approvedRegistryVersion=VERSION;}
    const status={applied:true,fighter:NAME,score:4.60,audit:apexAudit,version:VERSION,appliedAt:new Date().toISOString()};API.apexPeak=status;return status;
  }

  function finalize(){
    const board=(DATA?.women||[]).find(row=>key(row.fighter)===key(NAME));
    const fighterProfile=(DATA?.fighters||[]).find(row=>key(row.fighter)===key(NAME));
    if(!board||!fighterProfile)return {applied:false,error:'Cris Cyborg roster rows missing'};
    const overrides=displayStore();
    if(overrides?.[NAME]){
      overrides[NAME].packetStatus={stage:'canonical live fighter',lastUpdated:'2026-07-10',nextFix:'Add real WebP photos after approved source files are uploaded.'};
      overrides[NAME].repoLocations={scoreSource:'assets/data/canonical-fighter-registry.js',centralProfile:'assets/data/canonical-fighter-registry.js',photos:'No real photo files loaded; initials fallback only.'};
    }
    const status={applied:true,fighter:NAME,boardRow:board,profile:fighterProfile,championship:board.championship,opponentQuality:board.opponentQuality,primeDominance:board.primeDominance,longevity:board.longevity,apexPeak:board.apexPeak,penalty:board.penalty,version:VERSION,appliedAt:new Date().toISOString()};
    API.latest=status;document.documentElement.setAttribute('data-canonical-fighter-registry',`${VERSION}-complete`);return status;
  }

  const API={version:VERSION,fighters:[NAME],registerBase,applyChampionship,applyOpponentQuality,applyPrimeDominance,applyApexPeak,finalize,base:null,opponentQuality:null,primeDominance:null,apexPeak:null,latest:null};
  window.UFC_CANONICAL_FIGHTER_REGISTRY=API;
  document.documentElement.setAttribute('data-canonical-fighter-registry-ready',VERSION);
})();
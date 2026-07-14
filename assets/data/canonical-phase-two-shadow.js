// Phase 2 canonical calculation pipeline.
// Calculates stats, categories, penalties, totals, ranks, OVRs, profile stats, and comparison deltas
// from the 73 audited UFC-only ledgers without mutating the live ranking payload.
(function(){
  'use strict';

  const VERSION='canonical-phase-two-shadow-20260713a-calculated-73';
  const EXPECTED_FIGHTERS=73;
  const CATEGORY_MAX=30;
  const QUALITY_BENCHMARK=13;
  const LONGEVITY_BENCHMARK_YEARS=11.5;
  const WEIGHTS={championship:35,opponentQuality:27.5,primeDominance:27.5,longevity:10};
  const OVR={floor:82,menCeiling:99,womenCeiling:96,curve:.85};
  const FINISH_METHODS=new Set(['ko-tko','submission','doctor-stoppage']);
  const OFFICIAL_TITLE_TYPES=new Set(['normal','interim','vacant-undisputed','second-division-undisputed','vacant-second-division']);
  const QUALITY_POINTS=Object.freeze({
    'champion-level':1.25,
    'top-five':1,
    'top-ten':.45,
    ranked:.25,
    solid:.10,
    'name-value':.05,
    minimal:0,
    none:0
  });
  const LOSS_RULES=Object.freeze({
    prePrimeElite:-.75,
    prePrimeNonElite:-1.25,
    primeElite:-1.5,
    primeNonElite:-4,
    finishedExtra:-.75,
    primeUpwardElite:-.75,
    finishedUpwardEliteExtra:-.50,
    postPrime:0
  });

  const round2=value=>Math.round((Number(value||0)+Number.EPSILON)*100)/100;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const normalizeRecordText=value=>String(value||'').replace(/[()]/g,', ').replace(/\s+/g,' ').replace(/\s*,\s*/g,', ').trim().toLowerCase();
  const finite=value=>Number.isFinite(Number(value));

  function divisionMultiplierFromKey(value){
    const match=String(value||'').match(/(?:^|[-_])(0?\.\d+|1(?:\.\d+)?|[2-9](?:\.\d+)?)$/);
    const parsed=match?Number(match[1]):1;
    return finite(parsed)&&parsed>0?parsed:1;
  }

  function phaseBounds(record){
    const fights=record?.fights||[];
    const start=fights.findIndex(fight=>fight.id===record?.primeWindow?.startFightId);
    const end=record?.primeWindow?.open?fights.length-1:fights.findIndex(fight=>fight.id===record?.primeWindow?.endFightId);
    return {start,end};
  }

  function segmentMultiplier(record,fightIndex){
    const fights=record?.fights||[];
    const segments=Array.isArray(record?.divisionStrength?.segments)?record.divisionStrength.segments:[];
    for(const segment of segments){
      const start=segment.startFightId?fights.findIndex(fight=>fight.id===segment.startFightId):0;
      const end=segment.endFightId?fights.findIndex(fight=>fight.id===segment.endFightId):fights.length-1;
      if(fightIndex>=Math.max(0,start)&&fightIndex<=(end<0?fights.length-1:end))return divisionMultiplierFromKey(segment.key);
    }
    return divisionMultiplierFromKey(record?.divisionStrength?.defaultKey);
  }

  function divisionSummary(record){
    const {start,end}=phaseBounds(record);
    const primeIndexes=[];
    for(let index=Math.max(0,start);index<=end;index+=1)primeIndexes.push(index);
    const defaultMultiplier=divisionMultiplierFromKey(record?.divisionStrength?.defaultKey);
    const averagePrimeMultiplier=primeIndexes.length?round2(primeIndexes.reduce((sum,index)=>sum+segmentMultiplier(record,index),0)/primeIndexes.length):round2(defaultMultiplier);
    return {
      key:record?.divisionStrength?.defaultKey||null,
      defaultMultiplier:round2(defaultMultiplier),
      averagePrimeMultiplier,
      segmentCount:Array.isArray(record?.divisionStrength?.segments)?record.divisionStrength.segments.length:0
    };
  }

  function qualitySummary(record){
    const fights=record?.fights||[];
    let rawPoints=0;
    let divisionAdjustedPoints=0;
    const rows=[];
    fights.forEach((fight,index)=>{
      if(fight?.scoringDisposition!=='count-win')return;
      const tier=fight?.opponentContext?.qualityTier||'none';
      const points=Number(QUALITY_POINTS[tier]||0);
      const multiplier=segmentMultiplier(record,index);
      const adjusted=round2(points*multiplier);
      rawPoints+=points;
      divisionAdjustedPoints+=adjusted;
      rows.push({fightId:fight.id,opponent:fight.opponent,tier,points:round2(points),divisionMultiplier:round2(multiplier),adjustedPoints:adjusted});
    });
    const championWins=rows.filter(row=>row.tier==='champion-level').length;
    const topFiveWins=rows.filter(row=>row.tier==='champion-level'||row.tier==='top-five').length;
    const rankedWins=rows.filter(row=>['champion-level','top-five','top-ten','ranked'].includes(row.tier)).length;
    return {rawPoints:round2(rawPoints),divisionAdjustedPoints:round2(divisionAdjustedPoints),championWins,topFiveWins,rankedWins,rows};
  }

  function championshipSummary(record,derived){
    const {start,end}=phaseBounds(record);
    const primeFightIds=new Set((record?.fights||[]).slice(Math.max(0,start),end+1).map(fight=>fight.id));
    const titleFightWins=Number(derived?.championship?.titleFightWins||0);
    const adjustedTitleWins=round2(derived?.championship?.adjustedTitleWins||0);
    const primeTitleFightWins=(record?.fights||[]).filter(fight=>
      primeFightIds.has(fight.id)&&fight.scoringDisposition==='count-win'&&fight?.championshipContext?.fighterEligible!==false&&OFFICIAL_TITLE_TYPES.has(fight?.championshipContext?.type)
    ).length;
    return {titleFightWins,adjustedTitleWins,primeTitleFightWins};
  }

  function lossPenaltySummary(record,derived){
    const byId=new Map((record?.fights||[]).map(fight=>[fight.id,fight]));
    const rows=(derived?.lossExposure?.countedLosses||[]).map(loss=>{
      const fight=byId.get(loss.fightId)||{};
      const elite=loss.opponentTier==='champion-level'||loss.opponentTier==='top-five';
      let base=0;
      let finishExtra=0;
      let rule='post-prime';
      if(loss.competitive===false){
        rule='non-competitive-technical-context';
      }else if(loss.phase==='post-prime'){
        rule='post-prime';
      }else if(loss.phase==='prime'&&loss.divisionContext==='upward'&&elite){
        base=LOSS_RULES.primeUpwardElite;
        finishExtra=loss.finished?LOSS_RULES.finishedUpwardEliteExtra:0;
        rule='prime-upward-elite';
      }else if(loss.phase==='prime'){
        base=elite?LOSS_RULES.primeElite:LOSS_RULES.primeNonElite;
        finishExtra=loss.finished?LOSS_RULES.finishedExtra:0;
        rule=elite?'prime-elite':'prime-non-elite';
      }else if(loss.phase==='pre-prime'){
        base=elite?LOSS_RULES.prePrimeElite:LOSS_RULES.prePrimeNonElite;
        finishExtra=loss.finished?LOSS_RULES.finishedExtra:0;
        rule=elite?'pre-prime-elite':'pre-prime-non-elite';
      }
      const penalty=round2(base+finishExtra);
      return {
        fightId:loss.fightId,
        opponent:fight.opponent||null,
        phase:loss.phase,
        opponentTier:loss.opponentTier,
        divisionContext:loss.divisionContext,
        finished:Boolean(loss.finished),
        competitive:loss.competitive!==false,
        overrideRule:loss.overrideRule||null,
        rule,
        base:round2(base),
        finishExtra:round2(finishExtra),
        penalty
      };
    });
    return {penalty:round2(rows.reduce((sum,row)=>sum+row.penalty,0)),rows};
  }

  function primeSummary(record,derived,championship){
    const prime=derived?.prime||{};
    const scoredFights=Number(prime.scoredFights||0);
    const winRate=scoredFights?clamp((Number(prime.wins||0)+(Number(prime.draws||0)*.5))/scoredFights,0,1):0;
    const roundsWonPct=round2(prime.roundsWonPct||0);
    const roundControl=clamp(roundsWonPct/100,0,1);
    const finishPressurePct=round2(prime.finishPressurePct||0);
    const finishPressure=clamp(finishPressurePct/100,0,1);
    const stoppageLosses=Number(prime.stoppageLosses||0);
    const durability=clamp(1-(stoppageLosses/2),0,1);
    const perfectPrime=Number(prime.losses||0)===0?1:0;
    const titleDensity=clamp(Number(championship.primeTitleFightWins||0)/5,0,1);
    return {
      recordText:prime.recordText||'0-0',wins:Number(prime.wins||0),losses:Number(prime.losses||0),draws:Number(prime.draws||0),noContests:Number(prime.noContests||0),
      scoredFights,finishWins:Number(prime.finishWins||0),stoppageLosses,roundsWonPct,finishPressurePct,
      winRate:round2(winRate),roundControl:round2(roundControl),finishPressure:round2(finishPressure),durability:round2(durability),perfectPrime,titleDensity:round2(titleDensity)
    };
  }

  function categoryScores(stats){
    const championship=round2(clamp(stats.championship.adjustedTitleWins*2,0,CATEGORY_MAX));
    const opponentQuality=round2(clamp(CATEGORY_MAX*Math.sqrt(Math.max(0,stats.quality.divisionAdjustedPoints)/QUALITY_BENCHMARK),0,CATEGORY_MAX));
    const primeDominance=round2(clamp(
      (stats.prime.winRate*12)+
      (stats.prime.roundControl*12)+
      (stats.prime.finishPressure*3)+
      (stats.prime.durability*2)+
      stats.prime.perfectPrime,
      0,CATEGORY_MAX
    ));
    const effectiveEliteYears=round2(stats.longevity.activeEliteYears*stats.longevity.statusMultiplier);
    const longevity=round2(clamp((effectiveEliteYears/LONGEVITY_BENCHMARK_YEARS)*CATEGORY_MAX,0,CATEGORY_MAX));
    const apexIndex=(stats.prime.winRate*.40)+(stats.prime.roundControl*.35)+(stats.prime.finishPressure*.15)+(stats.prime.titleDensity*.10);
    const perfectBonus=stats.prime.perfectPrime?.35:0;
    const championshipRunBonus=stats.prime.perfectPrime&&stats.championship.primeTitleFightWins>=3?.25:0;
    const finishAuraBonus=stats.prime.finishPressure>=.65?.20:0;
    const apexPeak=round2(clamp((apexIndex*6)+perfectBonus+championshipRunBonus+finishAuraBonus,0,6));
    return {championship,opponentQuality,primeDominance,longevity,apexPeak,effectiveEliteYears};
  }

  function weightedScore(categories,penalty){
    const breakdown={
      championship:round2((categories.championship/CATEGORY_MAX)*WEIGHTS.championship),
      opponentQuality:round2((categories.opponentQuality/CATEGORY_MAX)*WEIGHTS.opponentQuality),
      primeDominance:round2((categories.primeDominance/CATEGORY_MAX)*WEIGHTS.primeDominance),
      longevity:round2((categories.longevity/CATEGORY_MAX)*WEIGHTS.longevity)
    };
    breakdown.baseScore=round2(breakdown.championship+breakdown.opponentQuality+breakdown.primeDominance+breakdown.longevity);
    breakdown.apexPeak=round2(categories.apexPeak);
    breakdown.penalty=round2(penalty);
    breakdown.totalScore=round2(breakdown.baseScore+breakdown.apexPeak+breakdown.penalty);
    return breakdown;
  }

  function calculateFighter(record,api){
    const derived=api.derive(record);
    const divisionStrength=divisionSummary(record);
    const quality=qualitySummary(record);
    const championship=championshipSummary(record,derived);
    const loss=lossPenaltySummary(record,derived);
    const prime=primeSummary(record,derived,championship);
    const longevity={
      activeEliteYears:round2(derived?.longevity?.activeEliteYears||0),
      statusMultiplier:round2(record?.longevityContext?.statusMultiplier||1),
      gapCapMonths:Number(record?.longevityContext?.gapCapMonths||18)
    };
    const categories=categoryScores({quality,championship,prime,longevity});
    const score=weightedScore(categories,loss.penalty);
    const profileStats={
      ufcRecord:derived?.officialUfcRecord?.text||'0-0',
      ufcWins:Number(derived?.officialUfcRecord?.wins||0),
      ufcLosses:Number(derived?.officialUfcRecord?.losses||0),
      ufcDraws:Number(derived?.officialUfcRecord?.draws||0),
      ufcNoContests:Number(derived?.officialUfcRecord?.noContests||0),
      titleFightWins:championship.titleFightWins,
      adjustedTitleWins:championship.adjustedTitleWins,
      topFiveWins:quality.topFiveWins,
      rankedWins:quality.rankedWins,
      finishWins:Number(derived?.finishWins||0),
      finishRatePct:round2(derived?.finishRatePct||0),
      primeRecord:prime.recordText,
      roundsWonPct:prime.roundsWonPct,
      activeEliteYears:longevity.activeEliteYears,
      timesFinishedPrime:prime.stoppageLosses,
      lossPenalty:loss.penalty,
      divisionStrengthMultiplier:divisionStrength.averagePrimeMultiplier,
      apexPeak:categories.apexPeak
    };
    return {
      fighter:record.fighter,
      board:record.board,
      identity:record.identity,
      coverage:record.coverage,
      divisionStrength,
      championship,
      quality,
      prime,
      longevity,
      loss,
      categories:{championship:categories.championship,opponentQuality:categories.opponentQuality,primeDominance:categories.primeDominance,longevity:categories.longevity},
      apexPeak:categories.apexPeak,
      score,
      totalScore:score.totalScore,
      profileStats,
      compareStats:{...profileStats,categoryScores:{championship:categories.championship,opponentQuality:categories.opponentQuality,primeDominance:categories.primeDominance,longevity:categories.longevity},totalScore:score.totalScore},
      mutatesLiveData:false
    };
  }

  function assignRanksAndOvr(rows,board){
    const sorted=rows.slice().sort((a,b)=>
      b.totalScore-a.totalScore||
      b.categories.championship-a.categories.championship||
      b.categories.opponentQuality-a.categories.opponentQuality||
      String(a.fighter).localeCompare(String(b.fighter))
    );
    sorted.forEach((row,index)=>{row.rank=index+1;});
    const minScore=Math.min(...sorted.map(row=>row.totalScore));
    const maxScore=Math.max(...sorted.map(row=>row.totalScore));
    const range=Math.max(.01,maxScore-minScore);
    const ceiling=board==='women'?OVR.womenCeiling:OVR.menCeiling;
    sorted.forEach(row=>{
      const normalized=clamp((row.totalScore-minScore)/range,0,1);
      row.overallOvr=clamp(Math.round(OVR.floor+Math.pow(normalized,OVR.curve)*(ceiling-OVR.floor)),OVR.floor,ceiling);
    });
    return sorted;
  }

  function liveProfileMap(data){
    return new Map((data?.fighters||[]).filter(row=>row?.fighter).map(row=>[key(row.fighter),row]));
  }

  function measurableComparison(calculated,data){
    const profiles=liveProfileMap(data);
    const conflicts=[];
    const missing=[];
    const fields=[
      ['ufcRecord','ufcRecord',normalizeRecordText],
      ['finishRatePct','finishRatePct',value=>finite(value)?round2(value):null],
      ['roundsWonPct','roundsWonPct',value=>finite(value)?round2(value):null],
      ['activeEliteYears','activeEliteYears',value=>finite(value)?round2(value):null],
      ['timesFinishedPrime','timesFinishedPrime',value=>finite(value)?Number(value):null],
      ['primeRecord','primeRecord',normalizeRecordText]
    ];
    calculated.forEach(row=>{
      const current=profiles.get(key(row.fighter));
      if(!current){missing.push(row.fighter);return;}
      fields.forEach(([field,currentField,normalize])=>{
        const actual=row.profileStats[field];
        const legacy=current[currentField];
        if(legacy===undefined||legacy===null||legacy==='')return;
        if(normalize(actual)!==normalize(legacy))conflicts.push({fighter:row.fighter,field,calculated:actual,current:legacy});
      });
      const currentAdjusted=current?.title?.adjustedTitleWins;
      if(finite(currentAdjusted)&&Math.abs(Number(currentAdjusted)-row.profileStats.adjustedTitleWins)>.001)conflicts.push({fighter:row.fighter,field:'adjustedTitleWins',calculated:row.profileStats.adjustedTitleWins,current:Number(currentAdjusted)});
    });
    return {currentProfileCount:profiles.size,coveredCount:calculated.length-missing.length,missingCurrentProfiles:missing,conflictCount:conflicts.length,conflicts};
  }

  function legacyScoreComparison(calculated,legacy){
    const deltas=[];
    const missing=[];
    calculated.forEach(row=>{
      const current=legacy?.entryFor?.(row.fighter)||null;
      if(!current){missing.push(row.fighter);return;}
      deltas.push({
        fighter:row.fighter,
        board:row.board,
        calculatedRank:row.rank,
        currentRank:Number(current.expectedRank),
        rankMovement:Number(current.expectedRank)-row.rank,
        calculatedTotal:row.totalScore,
        currentTotal:round2(current.expectedTotalScore),
        totalDelta:round2(row.totalScore-Number(current.expectedTotalScore)),
        calculatedOvr:row.overallOvr,
        currentOvr:Number(current.expectedOverallOvr),
        ovrDelta:row.overallOvr-Number(current.expectedOverallOvr),
        categoryDeltas:{
          championship:round2(row.categories.championship-Number(current.championship||0)),
          opponentQuality:round2(row.categories.opponentQuality-Number(current.opponentQuality||0)),
          primeDominance:round2(row.categories.primeDominance-Number(current.primeDominance||0)),
          longevity:round2(row.categories.longevity-Number(current.longevity||0)),
          apexPeak:round2(row.apexPeak-Number(current.apexPeak||0)),
          penalty:round2(row.loss.penalty-Number(current.penalty||0))
        }
      });
    });
    const biggestRankMovers=deltas.filter(row=>row.rankMovement!==0).slice().sort((a,b)=>Math.abs(b.rankMovement)-Math.abs(a.rankMovement)||b.totalDelta-a.totalDelta||a.fighter.localeCompare(b.fighter)).slice(0,20);
    const biggestTotalChanges=deltas.slice().sort((a,b)=>Math.abs(b.totalDelta)-Math.abs(a.totalDelta)||a.fighter.localeCompare(b.fighter)).slice(0,20);
    return {legacyVersion:legacy?.version||null,comparisonOnly:true,controlsCalculatedScores:false,coveredCount:deltas.length,missingLegacyRows:missing,deltas,biggestRankMovers,biggestTotalChanges};
  }

  function build(){
    const facts=window.UFC_CANONICAL_FIGHTER_FACTS;
    if(!facts||facts.count()!==EXPECTED_FIGHTERS||!facts.audit().passed)return false;
    const data=window.RANKING_DATA||null;
    const before=data?JSON.stringify(data):null;
    const calculated=facts.list().map(record=>calculateFighter(record,facts));
    const men=assignRanksAndOvr(calculated.filter(row=>row.board==='men'),'men');
    const women=assignRanksAndOvr(calculated.filter(row=>row.board==='women'),'women');
    const all=[...men,...women];
    const byKey=new Map(all.map(row=>[key(row.fighter),row]));
    const measurable=measurableComparison(all,data);
    const legacy=legacyScoreComparison(all,window.UFC_CANONICAL_SCORING_RECORDS||null);
    const after=data?JSON.stringify(data):null;
    const report={
      version:VERSION,
      phase:2,
      status:'shadow-ready',
      applied:true,
      mode:'calculated-from-canonical-ledgers-shadow-only',
      fighterCount:all.length,
      menCount:men.length,
      womenCount:women.length,
      fightCount:facts.list().reduce((sum,record)=>sum+(record.fights||[]).length,0),
      canonicalFactsVersion:facts.version,
      canonicalAuditPassed:true,
      usesExpectedRankLocks:false,
      usesExpectedTotalLocks:false,
      usesExpectedOvrLocks:false,
      legacySnapshotRole:'comparison-only',
      mutatesRankingData:false,
      liveDataUnchanged:before===after,
      formula:{weights:WEIGHTS,categoryMax:CATEGORY_MAX,qualityBenchmark:QUALITY_BENCHMARK,longevityBenchmarkYears:LONGEVITY_BENCHMARK_YEARS,qualityPoints:QUALITY_POINTS,lossRules:LOSS_RULES,ovr:OVR,eraDepthAdjustment:'not used; division strength is applied inside opponent quality and retained as profile context'},
      boards:{men,women},
      topTenMen:men.slice(0,10).map(row=>({rank:row.rank,fighter:row.fighter,totalScore:row.totalScore,overallOvr:row.overallOvr})),
      topWomen:women.slice(0,10).map(row=>({rank:row.rank,fighter:row.fighter,totalScore:row.totalScore,overallOvr:row.overallOvr})),
      measurableComparison:measurable,
      legacyScoreComparison:legacy,
      entryFor:fighter=>byKey.get(key(fighter))||null,
      profileFor:fighter=>byKey.get(key(fighter))?.profileStats||null,
      compareFor:fighter=>byKey.get(key(fighter))?.compareStats||null,
      generatedAt:new Date().toISOString()
    };
    window.UFC_CANONICAL_PHASE_TWO_SHADOW=report;
    document?.documentElement?.setAttribute?.('data-canonical-phase-two-shadow',`${VERSION}-${all.length}-${report.liveDataUnchanged?'safe':'mutation'}`);
    if(typeof CustomEvent==='function')window.dispatchEvent?.(new CustomEvent('ufc-canonical-phase-two-shadow-ready',{detail:report}));
    return true;
  }

  const controller={version:VERSION,phase:2,mode:'shadow-only',build,expectedFighterCount:EXPECTED_FIGHTERS,mutatesRankingData:false};
  window.UFC_CANONICAL_PHASE_TWO=controller;
  const initialBuild=build();
  if(!initialBuild)window.UFC_CANONICAL_PHASE_TWO_SHADOW={version:VERSION,phase:2,status:'waiting-for-73-canonical-ledgers',applied:false,mutatesRankingData:false};
  ['ufc-ranking-data-patches-ready','ufc-final-score-engine-applied'].forEach(eventName=>window.addEventListener?.(eventName,build));
})();

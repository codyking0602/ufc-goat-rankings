// Phase 2 ranking-shape calibration over the canonical shadow calculation.
// Uses only canonical fight ledgers plus the approved division-era depth evidence.
// Shadow-only: never mutates RANKING_DATA, live ranks, OVRs, profiles, or Compare Mode.
(function(){
  'use strict';

  const VERSION='canonical-phase-two-calibration-20260714e-reviewed-apex-confidence';
  const WEIGHTS={championship:30,opponentQuality:24,primeDominance:30,longevity:16};
  const CATEGORY_MAX=30;
  const PERFECT_PRIME_APEX_BONUS=1.95;
  const UPWARD_ELITE_PRIME_WEIGHT=.79;
  const OVR={floor:82,menCeiling:99,womenCeiling:96,curve:.80};
  const FINISH_METHODS=new Set(['ko-tko','submission','doctor-stoppage']);
  let lastBaseVersion=null;

  const round2=value=>Math.round((Number(value||0)+Number.EPSILON)*100)/100;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const clone=value=>JSON.parse(JSON.stringify(value));

  function phaseBounds(record){
    const fights=record?.fights||[];
    const start=fights.findIndex(fight=>fight.id===record?.primeWindow?.startFightId);
    const end=record?.primeWindow?.open?fights.length-1:fights.findIndex(fight=>fight.id===record?.primeWindow?.endFightId);
    return {start,end};
  }

  function isUpwardEliteLoss(fight){
    const tier=fight?.opponentContext?.qualityTier;
    return fight?.scoringDisposition==='count-loss'
      &&fight?.lossClassification?.divisionContext==='upward'
      &&(tier==='champion-level'||tier==='top-five');
  }

  function crossDivisionApexBonus(record){
    let bonus=0;
    (record?.fights||[]).forEach(fight=>{
      if(fight?.scoringDisposition!=='count-win'||fight?.championshipContext?.fighterEligible===false)return;
      if(fight?.championshipContext?.type==='second-division-undisputed')bonus=Math.max(bonus,.50);
      else if(fight?.championshipContext?.type==='vacant-second-division')bonus=Math.max(bonus,.30);
    });
    return round2(bonus);
  }

  function sampleConfidence(row,scoredFights,open){
    const activeEliteYears=Number(row?.profileStats?.activeEliteYears||0);
    const fightStrength=clamp(scoredFights/8,0,1);
    const yearStrength=clamp(activeEliteYears/4,0,1);
    const resumeStrength=(fightStrength*.65)+(yearStrength*.35);
    const prime=open
      ?clamp(.72+(resumeStrength*.28),.82,1)
      :clamp(.66+(resumeStrength*.34),.75,1);
    const apex=open
      ?clamp(.78+(resumeStrength*.22),.86,1)
      :clamp(.72+(resumeStrength*.28),.82,1);
    return {
      activeEliteYears:round2(activeEliteYears),
      fightStrength:round2(fightStrength),
      yearStrength:round2(yearStrength),
      resumeStrength:round2(resumeStrength),
      prime:round2(prime),
      apex:round2(apex)
    };
  }

  function calibratedPrime(record,row){
    const {start,end}=phaseBounds(record);
    const fights=(record?.fights||[]).slice(Math.max(0,start),end+1);
    let exposure=0;
    let winCredit=0;
    let roundWon=0;
    let roundLost=0;
    let roundDrawn=0;
    let finishWins=0;
    let weightedStoppageLosses=0;
    let upwardEliteLossCount=0;

    fights.forEach(fight=>{
      if(!['count-win','count-loss','count-draw'].includes(fight?.scoringDisposition))return;
      const upwardElite=isUpwardEliteLoss(fight);
      const weight=upwardElite?UPWARD_ELITE_PRIME_WEIGHT:1;
      exposure+=weight;
      if(fight.scoringDisposition==='count-win'){
        winCredit+=weight;
        if(FINISH_METHODS.has(fight?.method?.category))finishWins+=1;
      }else if(fight.scoringDisposition==='count-draw'){
        winCredit+=weight*.5;
      }else if(upwardElite){
        upwardEliteLossCount+=1;
      }
      if(fight?.rounds?.status==='audited'){
        roundWon+=Number(fight.rounds.won||0)*weight;
        roundLost+=Number(fight.rounds.lost||0)*weight;
        roundDrawn+=Number(fight.rounds.drawn||0)*weight;
      }
      if(fight.scoringDisposition==='count-loss'&&FINISH_METHODS.has(fight?.method?.category))weightedStoppageLosses+=weight;
    });

    const roundTotal=roundWon+roundLost+roundDrawn;
    const winRate=exposure?clamp(winCredit/exposure,0,1):0;
    const roundControl=roundTotal?clamp((roundWon+(roundDrawn*.5))/roundTotal,0,1):0;
    const finishPressure=exposure?clamp(finishWins/exposure,0,1):0;
    const durability=clamp(1-(weightedStoppageLosses/2),0,1);
    const perfectPrime=Number(row?.prime?.losses||0)===0?1:0;
    const scoredFights=Number(row?.prime?.scoredFights||0);
    const open=Boolean(record?.primeWindow?.open);
    const confidence=sampleConfidence(row,scoredFights,open);
    const primeSampleConfidence=confidence.prime;
    const apexSampleConfidence=confidence.apex;
    const titleDensity=clamp(Number(row?.championship?.primeTitleFightWins||0)/5,0,1);
    const primeDominance=round2(clamp((
      (winRate*12)+
      (roundControl*12)+
      (finishPressure*3)+
      (durability*2)+
      perfectPrime
    )*primeSampleConfidence,0,CATEGORY_MAX));
    const apexIndex=(winRate*.40)+(roundControl*.35)+(finishPressure*.15)+(titleDensity*.10);
    const championshipRunBonus=perfectPrime&&Number(row?.championship?.primeTitleFightWins||0)>=3?.25:0;
    const finishAuraBonus=finishPressure>=.65?.20:0;
    const secondDivisionBonus=crossDivisionApexBonus(record);
    const rawApexPeak=(apexIndex*6)+(perfectPrime?PERFECT_PRIME_APEX_BONUS:0)+championshipRunBonus+finishAuraBonus+secondDivisionBonus;
    const apexPeak=round2(clamp(rawApexPeak,0,6)*apexSampleConfidence);

    return {
      ...row.prime,
      open,
      adjustedExposure:round2(exposure),
      adjustedWinRate:round2(winRate),
      adjustedRoundControl:round2(roundControl),
      adjustedFinishPressure:round2(finishPressure),
      adjustedDurability:round2(durability),
      upwardEliteLossCount,
      secondDivisionApexBonus:secondDivisionBonus,
      rawApexPeak:round2(rawApexPeak),
      sampleFightStrength:confidence.fightStrength,
      sampleYearStrength:confidence.yearStrength,
      resumeSampleStrength:confidence.resumeStrength,
      primeSampleConfidence,
      apexSampleConfidence,
      calibratedPrimeDominance:primeDominance,
      calibratedApexPeak:apexPeak
    };
  }

  function eraDepthMap(){
    const shadow=window.UFC_DIVISION_ERA_DEPTH_SHADOW;
    return new Map((shadow?.fighters||[]).map(result=>[key(result.fighter),result]));
  }

  function score(row,record,eraResult){
    const prime=calibratedPrime(record,row);
    const categories={...row.categories,primeDominance:prime.calibratedPrimeDominance};
    const apexPeak=prime.calibratedApexPeak;
    const eraDepthAdjustment=round2(eraResult?.curvedAdjustment||0);
    const weighted={
      championship:round2((Number(categories.championship||0)/CATEGORY_MAX)*WEIGHTS.championship),
      opponentQuality:round2((Number(categories.opponentQuality||0)/CATEGORY_MAX)*WEIGHTS.opponentQuality),
      primeDominance:round2((Number(categories.primeDominance||0)/CATEGORY_MAX)*WEIGHTS.primeDominance),
      longevity:round2((Number(categories.longevity||0)/CATEGORY_MAX)*WEIGHTS.longevity)
    };
    weighted.baseScore=round2(weighted.championship+weighted.opponentQuality+weighted.primeDominance+weighted.longevity);
    weighted.apexPeak=apexPeak;
    weighted.penalty=round2(row?.loss?.penalty||0);
    weighted.eraDepthAdjustment=eraDepthAdjustment;
    weighted.totalScore=round2(weighted.baseScore+weighted.apexPeak+weighted.penalty+weighted.eraDepthAdjustment);
    return {prime,categories,apexPeak,eraDepthAdjustment,weighted,totalScore:weighted.totalScore};
  }

  function assignRanksAndOvr(rows,board){
    rows.sort((a,b)=>b.totalScore-a.totalScore||b.categories.championship-a.categories.championship||b.categories.opponentQuality-a.categories.opponentQuality||a.fighter.localeCompare(b.fighter));
    rows.forEach((row,index)=>{row.rank=index+1;});
    const min=Math.min(...rows.map(row=>row.totalScore));
    const max=Math.max(...rows.map(row=>row.totalScore));
    const range=Math.max(.01,max-min);
    const ceiling=board==='women'?OVR.womenCeiling:OVR.menCeiling;
    rows.forEach(row=>{
      const normalized=clamp((row.totalScore-min)/range,0,1);
      row.overallOvr=clamp(Math.round(OVR.floor+Math.pow(normalized,OVR.curve)*(ceiling-OVR.floor)),OVR.floor,ceiling);
      row.profileStats={...row.profileStats,apexPeak:row.apexPeak,eraDepthAdjustment:row.eraDepthAdjustment};
      row.compareStats={...row.compareStats,categoryScores:{...row.categories},totalScore:row.totalScore,overallOvr:row.overallOvr,apexPeak:row.apexPeak,eraDepthAdjustment:row.eraDepthAdjustment};
    });
    return rows;
  }

  function recalibrateLegacyComparison(all,base){
    const previous=new Map((base?.legacyScoreComparison?.deltas||[]).map(row=>[key(row.fighter),row]));
    const deltas=[];
    const missing=[];
    all.forEach(row=>{
      const current=previous.get(key(row.fighter));
      if(!current){missing.push(row.fighter);return;}
      deltas.push({...current,calculatedRank:row.rank,rankMovement:Number(current.currentRank)-row.rank,calculatedTotal:row.totalScore,totalDelta:round2(row.totalScore-Number(current.currentTotal)),calculatedOvr:row.overallOvr,ovrDelta:row.overallOvr-Number(current.currentOvr)});
    });
    const biggestRankMovers=deltas.filter(row=>row.rankMovement!==0).slice().sort((a,b)=>Math.abs(b.rankMovement)-Math.abs(a.rankMovement)||b.totalDelta-a.totalDelta||a.fighter.localeCompare(b.fighter)).slice(0,20);
    const biggestTotalChanges=deltas.slice().sort((a,b)=>Math.abs(b.totalDelta)-Math.abs(a.totalDelta)||a.fighter.localeCompare(b.fighter)).slice(0,20);
    return {...(base?.legacyScoreComparison||{}),comparisonOnly:true,controlsCalculatedScores:false,coveredCount:deltas.length,missingLegacyRows:missing,deltas,biggestRankMovers,biggestTotalChanges};
  }

  function build(){
    const base=window.UFC_CANONICAL_PHASE_TWO_SHADOW;
    const facts=window.UFC_CANONICAL_FIGHTER_FACTS;
    if(!base?.applied||base?.calibrationVersion===VERSION||!facts||facts.count?.()!==73)return false;
    if(lastBaseVersion===base.version&&window.UFC_CANONICAL_PHASE_TWO_CALIBRATION?.applied)return true;

    const data=window.RANKING_DATA||null;
    const before=data?JSON.stringify(data):null;
    const era=eraDepthMap();
    const missingEraDepth=[];
    const calibrateBoard=board=>(base.boards?.[board]||[]).map(source=>{
      const row=clone(source);
      const record=facts.get(row.fighter);
      const eraResult=era.get(key(row.fighter))||null;
      if(!eraResult)missingEraDepth.push(row.fighter);
      const result=score(row,record,eraResult);
      row.prime=result.prime;
      row.categories=result.categories;
      row.apexPeak=result.apexPeak;
      row.eraDepthAdjustment=result.eraDepthAdjustment;
      row.score=result.weighted;
      row.totalScore=result.totalScore;
      return row;
    });
    const men=assignRanksAndOvr(calibrateBoard('men'),'men');
    const women=assignRanksAndOvr(calibrateBoard('women'),'women');
    const all=[...men,...women];
    const byKey=new Map(all.map(row=>[key(row.fighter),row]));
    const legacyScoreComparison=recalibrateLegacyComparison(all,base);
    const after=data?JSON.stringify(data):null;
    const report={
      ...base,
      version:base.version,
      calibrationVersion:VERSION,
      status:'shadow-calibrated',
      mode:'calculated-from-canonical-ledgers-calibrated-shadow-only',
      boards:{men,women},
      topTenMen:men.slice(0,10).map(row=>({rank:row.rank,fighter:row.fighter,totalScore:row.totalScore,overallOvr:row.overallOvr})),
      topWomen:women.slice(0,10).map(row=>({rank:row.rank,fighter:row.fighter,totalScore:row.totalScore,overallOvr:row.overallOvr})),
      legacyScoreComparison,
      formula:{
        ...base.formula,
        weights:WEIGHTS,
        perfectPrimeApexBonus:PERFECT_PRIME_APEX_BONUS,
        upwardElitePrimeWeight:UPWARD_ELITE_PRIME_WEIGHT,
        secondDivisionApexBonus:{undisputed:.50,vacant:.30},
        sampleConfidence:{fightTarget:8,eliteYearTarget:4,fightWeight:.65,eliteYearWeight:.35,openPrimeFloor:.82,closedPrimeFloor:.75,apexAppliedAfterCap:true},
        overallOvrCurve:OVR.curve,
        eraDepthAdjustment:'approved curved Division-Era Depth evidence, hidden from the profile card'
      },
      eraDepthEvidenceVersion:window.UFC_DIVISION_ERA_DEPTH_SHADOW?.version||null,
      eraDepthCoverageCount:all.length-missingEraDepth.length,
      missingEraDepth:[...new Set(missingEraDepth)],
      liveDataUnchanged:before===after,
      mutatesRankingData:false,
      entryFor:fighter=>byKey.get(key(fighter))||null,
      profileFor:fighter=>byKey.get(key(fighter))?.profileStats||null,
      compareFor:fighter=>byKey.get(key(fighter))?.compareStats||null,
      calibratedAt:new Date().toISOString()
    };
    window.UFC_CANONICAL_PHASE_TWO_SHADOW=report;
    window.UFC_CANONICAL_PHASE_TWO_CALIBRATION={version:VERSION,applied:true,status:report.status,fighterCount:all.length,missingEraDepth:report.missingEraDepth,liveDataUnchanged:report.liveDataUnchanged,mutatesRankingData:false,report};
    lastBaseVersion=base.version;
    document?.documentElement?.setAttribute?.('data-canonical-phase-two-calibration',`${VERSION}-${all.length}-${report.liveDataUnchanged?'safe':'mutation'}`);
    if(typeof CustomEvent==='function')window.dispatchEvent?.(new CustomEvent('ufc-canonical-phase-two-calibrated',{detail:report}));
    return true;
  }

  window.UFC_CANONICAL_PHASE_TWO_CALIBRATION={version:VERSION,applied:false,status:'waiting-for-phase-two-shadow',mutatesRankingData:false,build};
  build();
  window.addEventListener?.('ufc-canonical-phase-two-shadow-ready',build);
  window.addEventListener?.('ufc-division-era-depth-shadow-ready',build);
})();

// Prime Dominance three-fight sample cap.
// Applies one universal maturity adjustment to rate-driven components only.
(function(){
  'use strict';
  const VERSION='prime-dominance-three-fight-cap-20260710a';
  const MAX_PRIME_FIGHTS=3;
  const RATE_COMPONENT_MULTIPLIER=0.70;
  const base=window.UFC_PRIME_DOMINANCE_LEDGERS;
  const model=window.UFC_PRIME_DOMINANCE_SHADOW_MODEL;

  if(!base||!Array.isArray(base.report)){
    window.UFC_PRIME_DOMINANCE_THREE_FIGHT_CAP={
      version:VERSION,applied:false,error:'Missing UFC_PRIME_DOMINANCE_LEDGERS report.'
    };
    return;
  }

  function round(value){
    return Math.round((Number(value||0)+Number.EPSILON)*100)/100;
  }

  function adjustedEntry(entry){
    const fights=Number(entry?.primeFights||0);
    if(!fights||fights>MAX_PRIME_FIGHTS)return entry;

    const uncappedPrimeRecordScore=Number(entry.primeRecordScore||0);
    const uncappedRoundControlScore=Number(entry.roundControlScore||0);
    const uncappedFinishPressureScore=Number(entry.finishPressureScore||0);
    const eliteStakesScore=Number(entry.eliteStakesScore||0);

    const primeRecordScore=round(uncappedPrimeRecordScore*RATE_COMPONENT_MULTIPLIER);
    const roundControlScore=round(uncappedRoundControlScore*RATE_COMPONENT_MULTIPLIER);
    const finishPressureScore=round(uncappedFinishPressureScore*RATE_COMPONENT_MULTIPLIER);
    const uncappedRateScore=round(uncappedPrimeRecordScore+uncappedRoundControlScore+uncappedFinishPressureScore);
    const adjustedRateScore=round(primeRecordScore+roundControlScore+finishPressureScore);
    const uncappedTotal=round(uncappedRateScore+eliteStakesScore);
    const total=round(adjustedRateScore+eliteStakesScore);

    return {
      ...entry,
      primeRecordScore,
      roundControlScore,
      finishPressureScore,
      total,
      uncappedPrimeRecordScore,
      uncappedRoundControlScore,
      uncappedFinishPressureScore,
      uncappedRateScore,
      adjustedRateScore,
      uncappedTotal,
      sampleAdjusted:true,
      sampleSizeAdjustment:{
        rule:'Three or fewer prime fights',
        primeFights:fights,
        maxPrimeFights:MAX_PRIME_FIGHTS,
        rateComponentMultiplier:RATE_COMPONENT_MULTIPLIER,
        rateComponents:['Prime Record','Round Control','Finish Pressure'],
        eliteStakesAdjusted:false,
        scoreReduction:round(uncappedTotal-total),
        version:VERSION
      },
      dominanceProfile:`${entry.dominanceProfile||''} Three-fight sample cap applies 70% weight to the rate-driven components while preserving full elite-stakes credit.`.trim(),
      version:VERSION
    };
  }

  const priorEntryFor=base.entryFor;
  const adjustedByName={};
  const report=base.report.map(entry=>{
    const adjusted=adjustedEntry(entry);
    if(adjusted!==entry)adjustedByName[adjusted.fighter]=adjusted;
    return adjusted;
  }).sort((a,b)=>Number(b.total||0)-Number(a.total||0)||String(a.fighter).localeCompare(String(b.fighter)));

  base.entryFor=fighter=>adjustedByName[fighter]||priorEntryFor?.(fighter)||null;
  base.report=report;
  base.leaders=report.slice(0,15);
  base.threeFightSampleCap={
    version:VERSION,
    maxPrimeFights:MAX_PRIME_FIGHTS,
    rateComponentMultiplier:RATE_COMPONENT_MULTIPLIER,
    affected:Object.keys(adjustedByName),
    entries:adjustedByName,
    appliedAt:new Date().toISOString()
  };
  if(model){
    model.report=report;
    model.threeFightSampleCap=base.threeFightSampleCap;
  }

  window.UFC_PRIME_DOMINANCE_THREE_FIGHT_CAP={
    version:VERSION,
    applied:true,
    maxPrimeFights:MAX_PRIME_FIGHTS,
    rateComponentMultiplier:RATE_COMPONENT_MULTIPLIER,
    affected:Object.keys(adjustedByName),
    affectedCount:Object.keys(adjustedByName).length,
    entries:adjustedByName,
    report,
    mutatesPrimeDominanceCategory:true,
    mutatesEliteStakes:false,
    mutatesTotals:false,
    finalScoreRecalculationOwner:'final-score-engine.js',
    appliedAt:new Date().toISOString()
  };
  document.documentElement.setAttribute('data-prime-dominance-three-fight-cap',`${VERSION}-${Object.keys(adjustedByName).length}`);
})();

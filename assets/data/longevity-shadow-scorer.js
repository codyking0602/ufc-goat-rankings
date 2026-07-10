// Longevity shadow scorer.
// Reads the shared Fighter Era Ledger and produces review-only longevity scores.
// Does not mutate rankings, fighter rows, display overrides, or total scores.
(function(){
  const VERSION='longevity-shadow-scorer-20260710c-144-month-ceiling';
  const era=window.UFC_FIGHTER_ERA_LEDGERS;
  if(!era||!era.entryFor){
    window.UFC_LONGEVITY_SHADOW_SCORER={version:VERSION,error:'Missing UFC_FIGHTER_ERA_LEDGERS. Load fighter-era-ledgers.js first.',mutatesScores:false};
    return;
  }

  const MAX_MONTHS=144;
  const MAX_SCORE=30;
  function round2(value){return Math.round((Number(value||0)+Number.EPSILON)*100)/100;}
  function scoreFromMonths(months){return round2(Math.min(MAX_SCORE,Math.max(0,(Number(months||0)/MAX_MONTHS)*MAX_SCORE)));}
  function hasLongevityInputs(ledger){return ledger&&ledger.longevity&&Number.isFinite(Number(ledger.longevity.gapAdjustedMonths));}

  function buildRow(fighter){
    const ledger=era.entryFor(fighter);
    if(!hasLongevityInputs(ledger))return null;
    const longevity=ledger.longevity||{};
    const statusMultiplier=Number(longevity.statusMultiplier||1);
    const divisionMultiplier=Number(longevity.divisionMultiplier||1);
    const gapAdjustedMonths=Number(longevity.gapAdjustedMonths||0);
    const countedEliteMonths=round2(gapAdjustedMonths*statusMultiplier*divisionMultiplier);
    const score=scoreFromMonths(countedEliteMonths);
    return {
      fighter,window:{...(ledger.window||{})},
      rawWindowLabel:`${ledger.window?.startLabel||ledger.window?.start||'Start'} → ${ledger.window?.endLabel||ledger.window?.end||'Current'}`,
      activeEliteYears:round2(longevity.activeEliteYears),gapAdjustedMonths:round2(gapAdjustedMonths),
      gapCapMonths:Number(longevity.gapCapMonths||era.rules?.gapCapMonthsDefault||18),statusMultiplier:round2(statusMultiplier),divisionMultiplier:round2(divisionMultiplier),
      countedEliteMonths,score,maxScore:MAX_SCORE,ceilingApplied:countedEliteMonths>=MAX_MONTHS,
      endType:ledger.window?.endType||null,endReason:ledger.window?.endReason||'',lossContext:ledger.lossContext||{},
      notes:[longevity.adjustmentNote||'',longevity.note||'',ledger.notes||''].filter(Boolean),
      source:'fighter-era-ledgers longevity inputs',mutatesScores:false
    };
  }

  const fighters=(era.names?era.names():Object.keys(era.ledgers||{})).filter(fighter=>hasLongevityInputs(era.entryFor(fighter)));
  const rows=fighters.map(buildRow).filter(Boolean).sort((a,b)=>b.score-a.score);
  rows.forEach((row,index)=>{row.shadowRank=index+1;});
  function entryFor(fighter){return rows.find(row=>row.fighter===fighter)||null;}
  function report(){return rows.map(row=>({...row}));}

  window.UFC_LONGEVITY_SHADOW_SCORER={
    version:VERSION,
    formula:'score = min(30, (gapAdjustedMonths × statusMultiplier × divisionMultiplier) / 144 × 30)',
    maxMonths:MAX_MONTHS,maxScore:MAX_SCORE,fighters,rows,entryFor,report,mutatesScores:false,
    source:'fighter-era-ledgers.js',sourceEraLedgerVersion:era.version,appliedAt:new Date().toISOString()
  };
  document.documentElement.setAttribute('data-longevity-shadow-scorer',VERSION);
})();

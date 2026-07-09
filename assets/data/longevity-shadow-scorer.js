// Longevity shadow scorer.
// Reads Fighter Era Ledger Batch 1 and produces review-only longevity scores.
// Does not mutate rankings, fighter rows, display overrides, or total scores.
(function(){
  const VERSION='longevity-shadow-scorer-20260709a-batch-one';
  const era=window.UFC_FIGHTER_ERA_LEDGERS;
  if(!era||!era.entryFor){
    window.UFC_LONGEVITY_SHADOW_SCORER={version:VERSION,error:'Missing UFC_FIGHTER_ERA_LEDGERS. Load fighter-era-ledgers.js first.',mutatesScores:false};
    return;
  }

  const MAX_MONTHS=120;
  const MAX_SCORE=30;

  // Batch 1 review inputs. These are shadow inputs derived from the locked Era Ledger calls.
  // They stay here until Cody approves the scoring shape, then can move into the Era Ledger itself.
  const REVIEW_INPUTS={
    'Jon Jones':{
      gapAdjustedMonths:126.1,
      activeEliteYears:10.51,
      adjustmentNote:'Bader 2011 through Gane 2023 with long gaps capped. Ceiling applies after multipliers.'
    },
    'Georges St-Pierre':{
      gapAdjustedMonths:101.3,
      activeEliteYears:8.44,
      adjustmentNote:'Hughes II through Bisping with retirement gap capped.'
    },
    'Jose Aldo':{
      gapAdjustedMonths:135.7,
      activeEliteYears:11.31,
      adjustmentNote:'Hominick through Merab. UFC-only, WEC excluded; elite relevance recovered after prior losses.'
    },
    'Anderson Silva':{
      gapAdjustedMonths:90.0,
      activeEliteYears:7.50,
      adjustmentNote:'Leben through Weidman II. Weidman I included because immediate title rematch kept him elite.'
    },
    'Dominick Cruz':{
      gapAdjustedMonths:78.0,
      activeEliteYears:6.50,
      adjustmentNote:'Faber II through Cejudo. Injury gaps capped; Vera excluded as post-prime.'
    },
    'Demetrious Johnson':{
      gapAdjustedMonths:77.0,
      activeEliteYears:6.42,
      adjustmentNote:'McCall/Benavidez title run through Cejudo II. ONE excluded.'
    },
    'Khabib Nurmagomedov':{
      gapAdjustedMonths:72.2,
      activeEliteYears:6.02,
      adjustmentNote:'RDA through Gaethje. Shorter elite-prime window, no UFC losses.'
    },
    'Alexander Volkanovski':{
      gapAdjustedMonths:68.0,
      activeEliteYears:5.67,
      adjustmentNote:'Aldo through current championship form. Open window; Topuria does not close it because elite form was re-proven.'
    }
  };

  function round2(value){return Math.round((Number(value||0)+Number.EPSILON)*100)/100;}
  function scoreFromMonths(months){return round2(Math.min(MAX_SCORE,Math.max(0,(Number(months||0)/MAX_MONTHS)*MAX_SCORE)));}

  function buildRow(fighter){
    const ledger=era.entryFor(fighter);
    const input=REVIEW_INPUTS[fighter];
    if(!ledger||!input)return null;

    const statusMultiplier=Number(ledger.longevity?.statusMultiplier||1);
    const divisionMultiplier=Number(ledger.longevity?.divisionMultiplier||1);
    const gapAdjustedMonths=Number(input.gapAdjustedMonths||0);
    const countedEliteMonths=round2(gapAdjustedMonths*statusMultiplier*divisionMultiplier);
    const score=scoreFromMonths(countedEliteMonths);

    return {
      fighter,
      window:{...(ledger.window||{})},
      rawWindowLabel:`${ledger.window?.startLabel||ledger.window?.start||'Start'} → ${ledger.window?.endLabel||ledger.window?.end||'Current'}`,
      activeEliteYears:round2(input.activeEliteYears),
      gapAdjustedMonths:round2(gapAdjustedMonths),
      statusMultiplier:round2(statusMultiplier),
      divisionMultiplier:round2(divisionMultiplier),
      countedEliteMonths,
      score,
      maxScore:MAX_SCORE,
      ceilingApplied:countedEliteMonths>=MAX_MONTHS,
      endType:ledger.window?.endType||null,
      endReason:ledger.window?.endReason||'',
      lossContext:ledger.lossContext||{},
      notes:[
        input.adjustmentNote,
        ledger.longevity?.note||'',
        ledger.notes||''
      ].filter(Boolean),
      source:'fighter-era-ledgers + batch-one shadow review inputs',
      mutatesScores:false
    };
  }

  const fighters=Object.keys(REVIEW_INPUTS);
  const rows=fighters.map(buildRow).filter(Boolean).sort((a,b)=>b.score-a.score);
  rows.forEach((row,index)=>{row.shadowRank=index+1;});

  function entryFor(fighter){return rows.find(row=>row.fighter===fighter)||null;}
  function report(){return rows.map(row=>({...row}));}

  window.UFC_LONGEVITY_SHADOW_SCORER={
    version:VERSION,
    formula:'score = min(30, (gapAdjustedMonths × statusMultiplier × divisionMultiplier) / 120 × 30)',
    maxMonths:MAX_MONTHS,
    maxScore:MAX_SCORE,
    fighters,
    rows,
    entryFor,
    report,
    mutatesScores:false,
    sourceEraLedgerVersion:era.version,
    appliedAt:new Date().toISOString()
  };

  document.documentElement.setAttribute('data-longevity-shadow-scorer',VERSION);
})();

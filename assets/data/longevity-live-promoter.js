// Longevity Live Promoter.
// Promotes Era Ledger /30 Longevity shadow scores into live fighter rows.
// Source of truth: fighter-era-ledgers.js via longevity-shadow-scorer.js.
(function(){
  const VERSION='longevity-live-promoter-20260709b-weighted-total-safe';
  const DATA=window.RANKING_DATA;
  const SHADOW=window.UFC_LONGEVITY_SHADOW_SCORER;

  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function round2(value){const n=Number(value);return Number.isFinite(n)?Math.round(n*100)/100:0;}
  function num(value){const n=Number(value||0);return Number.isFinite(n)?n:0;}
  function rows(){return [...(DATA?.men||[]),...(DATA?.women||[]),...(DATA?.fighters||[])].filter(row=>row&&row.fighter);}
  function shadowFor(fighter){return (SHADOW?.entryFor&&SHADOW.entryFor(fighter))||(SHADOW?.rows||[]).find(row=>key(row.fighter)===key(fighter))||null;}
  function weightedBreakdown(row){
    const weights=window.UFC_SCORE_WEIGHTING?.weights||{championship:35,opponentQuality:27.5,primeDominance:27.5,longevity:10};
    const baseMax=window.UFC_SCORE_WEIGHTING?.baseMax||{championship:30,opponentQuality:30,primeDominance:30,longevity:30};
    const championship=(num(row.championship)/baseMax.championship)*weights.championship;
    const opponentQuality=(num(row.opponentQuality)/baseMax.opponentQuality)*weights.opponentQuality;
    const primeDominance=(num(row.primeDominance)/baseMax.primeDominance)*weights.primeDominance;
    const longevity=(num(row.longevity)/baseMax.longevity)*weights.longevity;
    const penalty=num(row.penalty);
    const positiveScore=championship+opponentQuality+primeDominance+longevity;
    return {championship:round2(championship),opponentQuality:round2(opponentQuality),primeDominance:round2(primeDominance),longevity:round2(longevity),apexPeak:round2(row.apexPeak),positiveScore:round2(positiveScore),penalty:round2(penalty),totalScore:round2(positiveScore+penalty)};
  }
  function recalcTotal(row){
    const breakdown=weightedBreakdown(row);
    row.weightedScoreBreakdown=breakdown;
    row.totalScore=breakdown.totalScore;
    return breakdown.totalScore;
  }

  function apply(){
    if(!DATA||!SHADOW){
      const status={version:VERSION,applied:false,error:!DATA?'Missing RANKING_DATA':'Missing UFC_LONGEVITY_SHADOW_SCORER',mutatesScores:true,apply};
      window.UFC_LONGEVITY_LIVE_PROMOTER=status;
      return status;
    }

    const applied=[];
    const missing=[];
    const seen=new Set();

    rows().forEach(row=>{
      const fighter=row.fighter;
      const shadow=shadowFor(fighter);
      const k=key(fighter);
      if(!shadow){
        if(!seen.has(k))missing.push(fighter);
        seen.add(k);
        return;
      }
      const legacy=Number.isFinite(Number(row.longevityLegacyScore))?Number(row.longevityLegacyScore):round2(row.longevity);
      const raw30=round2(shadow.score);
      const weighted10=round2(raw30/3);
      row.longevityLegacyScore=legacy;
      row.longevity=raw30;
      row.longevityThirtyPoint=true;
      row.longevityRaw30=raw30;
      row.longevityWeighted10=weighted10;
      row.longevitySource='fighter-era-ledger';
      row.longevityPromoterVersion=VERSION;
      row.longevityAudit={
        version:VERSION,
        source:'fighter-era-ledgers via longevity-shadow-scorer',
        shadowVersion:SHADOW.version||null,
        eraLedgerVersion:SHADOW.sourceEraLedgerVersion||window.UFC_FIGHTER_ERA_LEDGERS?.version||null,
        formula:SHADOW.formula||'score = min(30, countedEliteMonths / 120 × 30)',
        raw30,
        weighted10,
        legacyScore:legacy,
        legacyDelta:round2(raw30-legacy),
        shadowRank:shadow.shadowRank||null,
        window:shadow.window||null,
        rawWindowLabel:shadow.rawWindowLabel||null,
        activeEliteYears:shadow.activeEliteYears,
        gapAdjustedMonths:shadow.gapAdjustedMonths,
        gapCapMonths:shadow.gapCapMonths,
        statusMultiplier:shadow.statusMultiplier,
        divisionMultiplier:shadow.divisionMultiplier,
        countedEliteMonths:shadow.countedEliteMonths,
        ceilingApplied:!!shadow.ceilingApplied,
        endType:shadow.endType||null,
        endReason:shadow.endReason||'',
        notes:shadow.notes||[],
        appliedAt:new Date().toISOString()
      };
      recalcTotal(row);
      applied.push({fighter,legacyScore:legacy,raw30,weighted10,legacyDelta:round2(raw30-legacy),shadowRank:shadow.shadowRank||null});
    });

    const unique=[];
    const keys=new Set();
    applied.forEach(item=>{const k=key(item.fighter);if(keys.has(k))return;keys.add(k);unique.push(item);});

    function sortBoard(board){
      if(!Array.isArray(board))return;
      board.sort((a,b)=>Number(b.totalScore||0)-Number(a.totalScore||0));
      board.forEach((row,index)=>{row.rank=index+1;});
    }
    sortBoard(DATA.men);
    sortBoard(DATA.women);

    const boardRows=[...(DATA.men||[]),...(DATA.women||[])];
    const rankByFighter=new Map(boardRows.map(row=>[key(row.fighter),row.rank]));
    const scoreByFighter=new Map(boardRows.map(row=>[key(row.fighter),row.totalScore]));
    const breakdownByFighter=new Map(boardRows.map(row=>[key(row.fighter),row.weightedScoreBreakdown]));
    const longevityByFighter=new Map(boardRows.map(row=>[key(row.fighter),row.longevity]));
    const auditByFighter=new Map(boardRows.map(row=>[key(row.fighter),row.longevityAudit]));

    (DATA.fighters||[]).forEach(profile=>{
      const k=key(profile.fighter);
      if(rankByFighter.has(k))profile.rank=rankByFighter.get(k);
      if(scoreByFighter.has(k))profile.totalScore=scoreByFighter.get(k);
      if(breakdownByFighter.has(k))profile.weightedScoreBreakdown=breakdownByFighter.get(k);
      if(longevityByFighter.has(k)){
        profile.longevity=longevityByFighter.get(k);
        profile.longevityThirtyPoint=true;
        profile.longevityRaw30=longevityByFighter.get(k);
        profile.longevityWeighted10=round2(longevityByFighter.get(k)/3);
      }
      if(auditByFighter.has(k))profile.longevityAudit=auditByFighter.get(k);
      profile.longevitySource='fighter-era-ledger';
      profile.longevityPromoterVersion=VERSION;
    });

    if(typeof DISPLAY_OVERRIDES!=='undefined'){
      boardRows.forEach(row=>{
        const fighter=row.fighter;
        if(!DISPLAY_OVERRIDES[fighter])return;
        DISPLAY_OVERRIDES[fighter].allTimeRank=row.rank;
        DISPLAY_OVERRIDES[fighter].longevityAudit=row.longevityAudit;
        if(DISPLAY_OVERRIDES[fighter].categories?.longevity){
          delete DISPLAY_OVERRIDES[fighter].categories.longevity;
        }
      });
    }

    if(DATA.meta){
      DATA.meta.longevitySource='fighter-era-ledger';
      DATA.meta.longevityPromoterVersion=VERSION;
      DATA.meta.longevityLivePromotion={appliedCount:unique.length,missing:[...missing],shadowVersion:SHADOW.version||null,eraLedgerVersion:SHADOW.sourceEraLedgerVersion||window.UFC_FIGHTER_ERA_LEDGERS?.version||null,appliedAt:new Date().toISOString()};
    }

    const status={
      version:VERSION,
      applied:true,
      appliedCount:unique.length,
      missing,
      changed:unique.filter(item=>Math.abs(item.legacyDelta)>0.01),
      shadowVersion:SHADOW.version||null,
      eraLedgerVersion:SHADOW.sourceEraLedgerVersion||window.UFC_FIGHTER_ERA_LEDGERS?.version||null,
      formula:SHADOW.formula||null,
      mutatesScores:true,
      apply,
      appliedAt:new Date().toISOString()
    };
    window.UFC_LONGEVITY_LIVE_PROMOTER=status;
    document.documentElement.setAttribute('data-longevity-live-promoter',VERSION);
    if(typeof refresh==='function'){
      try{refresh();}catch(e){}
    }
    return status;
  }

  apply();
})();

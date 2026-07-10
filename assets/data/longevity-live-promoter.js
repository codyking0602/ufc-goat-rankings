// Longevity Live Promoter.
// Promotes Era Ledger /30 Longevity scores and audit metadata only.
// Overall totals, ranks, weighted breakdowns, and OVR belong to final-score-engine.js.
(function(){
  const VERSION='longevity-live-promoter-20260710a-category-only';
  const DATA=window.RANKING_DATA;
  const SHADOW=window.UFC_LONGEVITY_SHADOW_SCORER;
  let applying=false;

  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function round2(value){const n=Number(value);return Number.isFinite(n)?Math.round((n+Number.EPSILON)*100)/100:0;}
  function rows(){return [...(DATA?.men||[]),...(DATA?.women||[]),...(DATA?.fighters||[])].filter(row=>row&&row.fighter);}
  function shadowFor(fighter){return (SHADOW?.entryFor&&SHADOW.entryFor(fighter))||(SHADOW?.rows||[]).find(row=>key(row.fighter)===key(fighter))||null;}

  function apply(){
    if(applying)return window.UFC_LONGEVITY_LIVE_PROMOTER?.latest||null;
    if(!DATA||!SHADOW){
      const status={version:VERSION,applied:false,error:!DATA?'Missing RANKING_DATA':'Missing UFC_LONGEVITY_SHADOW_SCORER',writesCategory:true,mutatesOverallScores:false,apply};
      window.UFC_LONGEVITY_LIVE_PROMOTER=status;
      return status;
    }

    applying=true;
    try{
      const applied=[];
      const missing=[];
      const seenMissing=new Set();
      const legacyByName=new Map();

      rows().forEach(row=>{
        const fighter=row.fighter;
        const fighterKey=key(fighter);
        const shadow=shadowFor(fighter);
        if(!shadow){
          if(!seenMissing.has(fighterKey))missing.push(fighter);
          seenMissing.add(fighterKey);
          return;
        }

        if(!legacyByName.has(fighterKey)){
          const existing=Number(row.longevityLegacyScore);
          legacyByName.set(fighterKey,Number.isFinite(existing)?existing:round2(row.longevity));
        }
        const legacy=legacyByName.get(fighterKey);
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
        applied.push({fighter,legacyScore:legacy,raw30,weighted10,legacyDelta:round2(raw30-legacy),shadowRank:shadow.shadowRank||null});
      });

      const unique=[];
      const seenApplied=new Set();
      applied.forEach(item=>{const fighterKey=key(item.fighter);if(seenApplied.has(fighterKey))return;seenApplied.add(fighterKey);unique.push(item);});

      if(DATA.meta){
        DATA.meta.longevitySource='fighter-era-ledger';
        DATA.meta.longevityPromoterVersion=VERSION;
        DATA.meta.longevityLivePromotion={
          appliedCount:unique.length,
          missing:[...missing],
          shadowVersion:SHADOW.version||null,
          eraLedgerVersion:SHADOW.sourceEraLedgerVersion||window.UFC_FIGHTER_ERA_LEDGERS?.version||null,
          categoryOnly:true,
          appliedAt:new Date().toISOString()
        };
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
        writesCategory:true,
        mutatesOverallScores:false,
        categoryOnly:true,
        apply,
        appliedAt:new Date().toISOString()
      };
      window.UFC_LONGEVITY_LIVE_PROMOTER=status;
      document.documentElement.setAttribute('data-longevity-live-promoter',VERSION);

      if(window.UFC_FINAL_SCORE_ENGINE?.apply){
        try{window.UFC_FINAL_SCORE_ENGINE.apply('longevity-category-update');}catch(e){}
      }
      if(typeof refresh==='function'){
        try{refresh();}catch(e){}
      }
      return status;
    } finally {
      applying=false;
    }
  }

  window.UFC_LONGEVITY_LIVE_PROMOTER={version:VERSION,writesCategory:true,mutatesOverallScores:false,categoryOnly:true,apply};
  apply();
})();
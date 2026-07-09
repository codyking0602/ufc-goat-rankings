// Loss Context Live Promoter.
// Promotes ledger-adapter loss penalty estimates into live fighter penalty values.
// Source of truth: Fighter Era Ledger + Loss Context Ledger Adapter.
(function(){
  const VERSION='loss-context-live-promoter-20260709a-ledger-source';
  const DATA=window.RANKING_DATA;
  const adapter=window.UFC_LOSS_CONTEXT_LEDGER_ADAPTER;

  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function round2(value){const n=Number(value);return Number.isFinite(n)?Math.round(n*100)/100:0;}
  function rows(){return [...(DATA?.men||[]),...(DATA?.women||[]),...(DATA?.fighters||[])].filter(row=>row&&row.fighter);}
  function adapterEntryFor(fighter){return (adapter?.entryFor&&adapter.entryFor(fighter))||(adapter?.rows||[]).find(row=>key(row.fighter)===key(fighter))||null;}

  function apply(){
    if(!DATA||!adapter){
      window.UFC_LOSS_CONTEXT_LIVE_PROMOTER={version:VERSION,applied:false,error:!DATA?'Missing RANKING_DATA':'Missing UFC_LOSS_CONTEXT_LEDGER_ADAPTER',mutatesScores:true,apply};
      return window.UFC_LOSS_CONTEXT_LIVE_PROMOTER;
    }

    const applied=[];
    const missing=[];
    const seen=new Set();

    rows().forEach(row=>{
      const fighter=row.fighter;
      const entry=adapterEntryFor(fighter);
      if(!entry){
        if(!seen.has(key(fighter)))missing.push(fighter);
        seen.add(key(fighter));
        return;
      }
      const legacy=Number.isFinite(Number(row.lossContextLegacyPenalty))?Number(row.lossContextLegacyPenalty):round2(row.penalty);
      const ledgerPenalty=round2(entry.estimatedPenaltyTotal);
      row.lossContextLegacyPenalty=legacy;
      row.lossContextLedgerPenalty=ledgerPenalty;
      row.lossContextLedgerAudit={
        version:VERSION,
        adapterVersion:adapter.version||null,
        eraLedgerVersion:adapter.sourceEraLedgerVersion||window.UFC_FIGHTER_ERA_LEDGERS?.version||null,
        cleanupVersion:window.UFC_FIGHTER_ERA_LEDGER_CLEANUPS?.version||null,
        cleanupFinalVersion:window.UFC_FIGHTER_ERA_LEDGER_CLEANUPS_FINAL?.version||null,
        window:entry.window||null,
        counts:entry.counts||null,
        events:entry.events||[],
        legacyPenalty:legacy,
        ledgerPenalty,
        delta:round2(ledgerPenalty-legacy),
        appliedAt:new Date().toISOString()
      };
      row.penalty=ledgerPenalty;
      row.lossContextSource='fighter-era-ledger';
      row.lossContextPromoterVersion=VERSION;
      applied.push({fighter,legacyPenalty:legacy,ledgerPenalty,delta:round2(ledgerPenalty-legacy)});
    });

    const uniqueApplied=[];
    const appliedKeys=new Set();
    applied.forEach(item=>{const k=key(item.fighter);if(appliedKeys.has(k))return;appliedKeys.add(k);uniqueApplied.push(item);});

    const status={
      version:VERSION,
      applied:true,
      appliedCount:uniqueApplied.length,
      missing,
      adapterVersion:adapter.version||null,
      eraLedgerVersion:adapter.sourceEraLedgerVersion||window.UFC_FIGHTER_ERA_LEDGERS?.version||null,
      cleanupVersion:window.UFC_FIGHTER_ERA_LEDGER_CLEANUPS?.version||null,
      cleanupFinalVersion:window.UFC_FIGHTER_ERA_LEDGER_CLEANUPS_FINAL?.version||null,
      changed:uniqueApplied.filter(item=>Math.abs(item.delta)>0.01),
      mutatesScores:true,
      apply,
      appliedAt:new Date().toISOString()
    };

    if(DATA.meta){
      DATA.meta.lossContextSource='fighter-era-ledger';
      DATA.meta.lossContextPromoterVersion=VERSION;
      DATA.meta.lossContextLivePromotion={appliedCount:status.appliedCount,missing:[...missing],adapterVersion:status.adapterVersion,eraLedgerVersion:status.eraLedgerVersion,cleanupVersion:status.cleanupVersion,cleanupFinalVersion:status.cleanupFinalVersion,appliedAt:status.appliedAt};
    }

    window.UFC_LOSS_CONTEXT_LIVE_PROMOTER=status;
    document.documentElement.setAttribute('data-loss-context-live-promoter',VERSION);
    return status;
  }

  apply();
})();

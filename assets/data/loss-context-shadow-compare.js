// Loss Context Shadow Comparison.
// Compares current RANKING_DATA penalty values against the ledger-adapter shadow estimate.
// Does not mutate rankings, fighter rows, display overrides, or total scores.
(function(){
  const VERSION='loss-context-shadow-compare-20260709a';
  const data=window.RANKING_DATA;
  const adapter=window.UFC_LOSS_CONTEXT_LEDGER_ADAPTER;

  const STATUS={
    MATCH:'match',
    REVIEW:'review',
    MISSING:'missing',
    ADAPTER_MISSING:'adapter-missing',
    DATA_MISSING:'data-missing'
  };

  function round2(value){
    const n=Number(value);
    return Number.isFinite(n)?Math.round(n*100)/100:null;
  }

  function fighterRows(){
    const rows=[];
    const seen=new Set();
    const push=(row,source)=>{
      const fighter=row?.fighter;
      if(!fighter||seen.has(fighter))return;
      seen.add(fighter);
      rows.push({...row,source});
    };
    (data?.fighters||[]).forEach(row=>push(row,'fighters'));
    (data?.men||[]).forEach(row=>push(row,'men'));
    (data?.women||[]).forEach(row=>push(row,'women'));
    return rows;
  }

  function compareRow(row){
    const fighter=row.fighter;
    const livePenalty=round2(row.penalty);
    const adapterRow=adapter?.entryFor?adapter.entryFor(fighter):null;

    if(!adapter){
      return {fighter,source:row.source,livePenalty,adapterPenalty:null,delta:null,status:STATUS.ADAPTER_MISSING,reason:'UFC_LOSS_CONTEXT_LEDGER_ADAPTER not loaded.'};
    }
    if(!adapterRow){
      return {fighter,source:row.source,livePenalty,adapterPenalty:null,delta:null,status:STATUS.MISSING,reason:'No adapter row for fighter.'};
    }

    const adapterPenalty=round2(adapterRow.estimatedPenaltyTotal);
    const delta=round2((adapterPenalty||0)-(livePenalty||0));
    const absDelta=Math.abs(delta||0);
    const unknownEvents=(adapterRow.events||[]).filter(event=>event.phase==='unknown'||event.penaltyEstimate===null);
    const openCurrent=adapterRow.window?.end==null;
    const status=absDelta<=0.01&&unknownEvents.length===0?STATUS.MATCH:STATUS.REVIEW;
    const reason=status===STATUS.MATCH?'Current penalty matches ledger shadow estimate.':'Review delta and/or unclassified events before promotion.';

    return {
      fighter,
      source:row.source,
      livePenalty,
      adapterPenalty,
      delta,
      status,
      reason,
      openCurrent,
      window:adapterRow.window,
      counts:adapterRow.counts,
      events:adapterRow.events,
      unknownEvents
    };
  }

  function missingFromData(){
    const names=new Set(fighterRows().map(row=>row.fighter));
    return (adapter?.fighters||[]).filter(name=>!names.has(name));
  }

  const comparisons=fighterRows().map(compareRow);
  const review=comparisons.filter(row=>row.status!==STATUS.MATCH);
  const matches=comparisons.filter(row=>row.status===STATUS.MATCH);
  const missingData=missingFromData();
  const summary={
    total:comparisons.length,
    matches:matches.length,
    review:review.length,
    missingData:missingData.length,
    adapterLoaded:!!adapter,
    adapterVersion:adapter?.version||null,
    eraLedgerVersion:adapter?.sourceEraLedgerVersion||window.UFC_FIGHTER_ERA_LEDGERS?.version||null,
    largestAbsoluteDeltas:[...comparisons]
      .filter(row=>row.delta!==null)
      .sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta))
      .slice(0,12)
      .map(row=>({fighter:row.fighter,livePenalty:row.livePenalty,adapterPenalty:row.adapterPenalty,delta:row.delta,status:row.status}))
  };

  function report(){
    return comparisons.map(row=>({
      fighter:row.fighter,
      source:row.source,
      livePenalty:row.livePenalty,
      adapterPenalty:row.adapterPenalty,
      delta:row.delta,
      status:row.status,
      reason:row.reason,
      openCurrent:row.openCurrent,
      window:row.window,
      counts:row.counts,
      events:row.events
    }));
  }

  function byStatus(status){return comparisons.filter(row=>row.status===status);}
  function needsReview(){return review;}
  function entryFor(fighter){return comparisons.find(row=>row.fighter===fighter)||null;}

  window.UFC_LOSS_CONTEXT_SHADOW_COMPARE={
    version:VERSION,
    statusValues:STATUS,
    summary,
    comparisons,
    matches,
    review,
    missingData,
    report,
    byStatus,
    needsReview,
    entryFor,
    mutatesScores:false,
    appliedAt:new Date().toISOString()
  };

  document.documentElement.setAttribute('data-loss-context-shadow-compare',VERSION);
})();

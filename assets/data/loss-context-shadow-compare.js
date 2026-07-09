// Loss Context Shadow Comparison.
// Reviews ledger-adapter output independently from legacy RANKING_DATA penalty values.
// Does not mutate rankings, fighter rows, display overrides, or total scores.
(function(){
  const VERSION='loss-context-shadow-compare-20260709c-cleanup-aware';
  const data=window.RANKING_DATA;
  const adapter=window.UFC_LOSS_CONTEXT_LEDGER_ADAPTER;

  const STATUS={CLEAN:'clean',REVIEW:'review',MISSING:'missing',ADAPTER_MISSING:'adapter-missing',DATA_MISSING:'data-missing'};
  function round2(value){const n=Number(value);return Number.isFinite(n)?Math.round(n*100)/100:null;}
  function key(name){return String(name||'').trim().toLowerCase();}

  function fighterRows(){
    const rows=[];
    const seen=new Set();
    const push=(row,source)=>{const fighter=row?.fighter;if(!fighter||seen.has(key(fighter)))return;seen.add(key(fighter));rows.push({...row,source});};
    (data?.fighters||[]).forEach(row=>push(row,'fighters'));
    (data?.men||[]).forEach(row=>push(row,'men'));
    (data?.women||[]).forEach(row=>push(row,'women'));
    return rows;
  }

  function adapterEntryFor(fighter){
    if(!adapter)return null;
    return (adapter.entryFor&&adapter.entryFor(fighter))||(adapter.rows||[]).find(row=>key(row.fighter)===key(fighter))||null;
  }

  function reviewReasons(adapterRow){
    const events=adapterRow?.events||[];
    const reasons=[];
    const unknownEvents=events.filter(event=>event.isLoss&&(event.phase==='unknown'||event.penaltyEstimate===null));
    const groupedEvents=events.filter(event=>event.isLoss&&(String(event.label||'').includes('/')||/\btrilogy\b|\brun\b|\blosses\b/i.test(String(event.label||''))));
    if(!adapterRow)reasons.push('No ledger adapter row.');
    if(unknownEvents.length)reasons.push(`${unknownEvents.length} loss event(s) need explicit phase/date.`);
    if(groupedEvents.length)reasons.push(`${groupedEvents.length} grouped loss row(s) should be split before live promotion.`);
    return reasons;
  }

  function compareRow(row){
    const fighter=row.fighter;
    const legacyPenalty=round2(row.penalty);
    const adapterRow=adapterEntryFor(fighter);
    if(!adapter)return {fighter,source:row.source,legacyPenalty,adapterPenalty:null,delta:null,status:STATUS.ADAPTER_MISSING,reason:'UFC_LOSS_CONTEXT_LEDGER_ADAPTER not loaded.'};
    if(!adapterRow)return {fighter,source:row.source,legacyPenalty,adapterPenalty:null,delta:null,status:STATUS.MISSING,reason:'No adapter row for fighter.'};
    const adapterPenalty=round2(adapterRow.estimatedPenaltyTotal);
    const legacyDelta=round2((adapterPenalty||0)-(legacyPenalty||0));
    const reasons=reviewReasons(adapterRow);
    const openCurrent=adapterRow.window?.end==null;
    const status=reasons.length?STATUS.REVIEW:STATUS.CLEAN;
    return {fighter,source:row.source,legacyPenalty,livePenalty:legacyPenalty,adapterPenalty,ledgerPenalty:adapterPenalty,delta:legacyDelta,legacyDelta,status,reason:reasons.join(' ')||'Ledger events are classifiable. Legacy penalty delta is informational only.',reviewReasons:reasons,openCurrent,window:adapterRow.window,counts:adapterRow.counts,events:adapterRow.events,unknownEvents:(adapterRow.events||[]).filter(event=>event.isLoss&&(event.phase==='unknown'||event.penaltyEstimate===null))};
  }

  function missingFromData(){
    const names=new Set(fighterRows().map(row=>key(row.fighter)));
    return (adapter?.fighters||[]).filter(name=>!names.has(key(name)));
  }

  const comparisons=fighterRows().map(compareRow);
  const review=comparisons.filter(row=>row.status!==STATUS.CLEAN);
  const clean=comparisons.filter(row=>row.status===STATUS.CLEAN);
  const missingData=missingFromData();
  const summary={total:comparisons.length,matches:clean.length,clean:clean.length,review:review.length,missingData:missingData.length,adapterLoaded:!!adapter,adapterVersion:adapter?.version||null,eraLedgerVersion:adapter?.sourceEraLedgerVersion||window.UFC_FIGHTER_ERA_LEDGERS?.version||null,cleanupVersion:window.UFC_FIGHTER_ERA_LEDGER_CLEANUPS?.version||null,largestAbsoluteDeltas:[...comparisons].filter(row=>row.legacyDelta!==null).sort((a,b)=>Math.abs(b.legacyDelta)-Math.abs(a.legacyDelta)).slice(0,12).map(row=>({fighter:row.fighter,legacyPenalty:row.legacyPenalty,ledgerPenalty:row.ledgerPenalty,legacyDelta:row.legacyDelta,status:row.status,reason:row.reason}))};

  function report(){return comparisons.map(row=>({fighter:row.fighter,source:row.source,legacyPenalty:row.legacyPenalty,ledgerPenalty:row.ledgerPenalty,legacyDelta:row.legacyDelta,status:row.status,reason:row.reason,reviewReasons:row.reviewReasons,openCurrent:row.openCurrent,window:row.window,counts:row.counts,events:row.events}));}
  function byStatus(status){return comparisons.filter(row=>row.status===status);}
  function needsReview(){return review;}
  function entryFor(fighter){return comparisons.find(row=>key(row.fighter)===key(fighter))||null;}

  window.UFC_LOSS_CONTEXT_SHADOW_COMPARE={version:VERSION,statusValues:STATUS,summary,comparisons,matches:clean,clean,review,missingData,report,byStatus,needsReview,entryFor,mutatesScores:false,appliedAt:new Date().toISOString()};
  document.documentElement.setAttribute('data-loss-context-shadow-compare',VERSION);
})();

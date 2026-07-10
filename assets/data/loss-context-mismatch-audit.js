// Roster-wide Loss Context mismatch audit.
// Compares canonical Fighter Era loss events against the current live penalty for every ranked fighter.
// Audit only: does not change penalties, category scores, totals, ranks, or OVR.
(function(){
  'use strict';
  const VERSION='loss-context-mismatch-audit-20260710a-roster-62';
  const CAP=-10;
  const DATA=window.RANKING_DATA;
  const era=window.UFC_FIGHTER_ERA_LEDGERS;
  const adapter=window.UFC_LOSS_CONTEXT_LEDGER_ADAPTER;
  const corrections=window.UFC_PENALTY_SCORE_CORRECTIONS;

  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function round2(value){const n=Number(value);return Number.isFinite(n)?Math.round((n+Number.EPSILON)*100)/100:null;}
  function uniqueRows(){
    const map=new Map();
    [...(DATA?.men||[]),...(DATA?.women||[])].forEach(row=>{if(row?.fighter&&!map.has(key(row.fighter)))map.set(key(row.fighter),row);});
    return [...map.values()];
  }
  function profileFor(name){const target=key(name);return (DATA?.fighters||[]).find(row=>key(row?.fighter)===target)||null;}
  function recordText(row,profile){
    const candidates=[row?.ufcRecord,row?.record,row?.ufc_record,profile?.ufcRecord,profile?.record,profile?.ufc_record];
    return String(candidates.find(value=>typeof value==='string'&&/\d+\s*[-–]\s*\d+/.test(value))||'');
  }
  function parseLosses(text){const match=String(text||'').match(/(\d+)\s*[-–]\s*(\d+)/);return match?Number(match[2]):null;}
  function eventEntryFor(fighter){
    if(typeof adapter?.eventEntryFor==='function')return adapter.eventEntryFor(fighter);
    const target=key(fighter);
    const rows=adapter?.eventRows||adapter?.rows||[];
    return rows.find(row=>key(row?.fighter)===target)||null;
  }
  function sourceContradictions(events){
    return events.filter(event=>{
      if(event.sourceType==='postPrimeLosses'&&event.phase!=='post-prime')return true;
      if(['unrecoveredLoss','recoveredLosses','upwardDivisionLosses'].includes(event.sourceType)&&event.phase==='post-prime')return true;
      if(event.sourceType==='upwardDivisionLosses'&&!event.upwardDivision)return true;
      return false;
    });
  }
  function manualContext(notes){
    const text=String(notes||'').toLowerCase();
    return /dq|no contest|injur|shoulder|technical|discount|current-table|context|post-prime|cap|not treated/.test(text);
  }

  if(!DATA||!era||!adapter){
    window.UFC_LOSS_CONTEXT_MISMATCH_AUDIT={
      version:VERSION,
      error:[!DATA?'Missing RANKING_DATA':null,!era?'Missing UFC_FIGHTER_ERA_LEDGERS':null,!adapter?'Missing UFC_LOSS_CONTEXT_LEDGER_ADAPTER':null].filter(Boolean).join('; '),
      mutatesScores:false
    };
    return;
  }

  const rows=uniqueRows().map(row=>{
    const fighter=row.fighter;
    const profile=profileFor(fighter);
    const eventEntry=eventEntryFor(fighter);
    const events=Array.isArray(eventEntry?.events)?eventEntry.events:[];
    const lossEvents=events.filter(event=>event?.isLoss);
    const weirdContextCount=events.filter(event=>event?.exception==='weird/contextual'||event?.sourceType==='weirdResults').length;
    const record=recordText(row,profile);
    const officialUfcLosses=parseLosses(record);
    const effectiveExpectedLosses=officialUfcLosses===null?null:Math.max(0,officialUfcLosses-weirdContextCount);
    const missingLossEvents=effectiveExpectedLosses===null?null:Math.max(0,effectiveExpectedLosses-lossEvents.length);
    const unknownPhase=lossEvents.filter(event=>event?.phase==='unknown').length;
    const unknownQuality=lossEvents.filter(event=>event?.quality==='unknown'&&event?.phase!=='post-prime'&&event?.exception!=='weird/contextual').length;
    const undatedLosses=lossEvents.filter(event=>!/^\d{4}-\d{2}-\d{2}$/.test(String(event?.date||''))).length;
    const contradictions=sourceContradictions(events);
    const rawEstimate=round2(lossEvents.reduce((sum,event)=>sum+(Number(event?.penaltyEstimate)||0),0))??0;
    const cappedEstimate=round2(Math.max(CAP,rawEstimate));
    const livePenalty=round2(row.penalty);
    const delta=livePenalty===null||cappedEstimate===null?null:round2(cappedEstimate-livePenalty);
    const correction=corrections?.corrections?.[fighter]||null;
    const notes=correction?.notes||row?.lossContextAudit?.notes||row?.penaltyNotes||'';
    const noEventCoverage=livePenalty<0&&lossEvents.length===0;
    const incompleteCoverage=noEventCoverage||(missingLossEvents!==null&&missingLossEvents>0)||unknownPhase>0||unknownQuality>0||undatedLosses>0||contradictions.length>0;
    let status='match';
    if(livePenalty===null)status='missing-live-penalty';
    else if(!eventEntry)status='missing-era-loss-entry';
    else if(incompleteCoverage)status='needs-ledger-completion';
    else if(Math.abs(delta||0)>0.01)status='score-mismatch';
    const reasons=[];
    if(noEventCoverage)reasons.push('Negative live penalty but no machine-readable loss events.');
    if(missingLossEvents>0)reasons.push(`${missingLossEvents} UFC loss event${missingLossEvents===1?'':'s'} not represented after weird-result allowance.`);
    if(unknownPhase)reasons.push(`${unknownPhase} loss event${unknownPhase===1?' has':'s have'} unknown phase.`);
    if(unknownQuality)reasons.push(`${unknownQuality} counted loss event${unknownQuality===1?' has':'s have'} unknown opponent quality.`);
    if(undatedLosses)reasons.push(`${undatedLosses} loss event${undatedLosses===1?' lacks':'s lack'} an ISO fight date.`);
    if(contradictions.length)reasons.push(`${contradictions.length} source-bucket/derived-phase contradiction${contradictions.length===1?'':'s'}.`);
    if(status==='score-mismatch')reasons.push(`Ledger estimate ${cappedEstimate.toFixed(2)} vs live ${livePenalty.toFixed(2)}.`);
    return {
      fighter,
      status,
      canonicalWindow:{...(era.entryFor?.(fighter)?.window||eventEntry?.window||{})},
      ufcRecord:record||null,
      officialUfcLosses,
      effectiveExpectedLosses,
      machineReadableLossEvents:lossEvents.length,
      missingLossEvents,
      livePenalty,
      rawLedgerEstimate:rawEstimate,
      cappedLedgerEstimate:cappedEstimate,
      delta,
      exactScoreMatch:delta!==null&&Math.abs(delta)<=0.01,
      correctionWorksheetEntry:!!correction,
      manualContextException:manualContext(notes),
      notes,
      unknownPhase,
      unknownQuality,
      undatedLosses,
      contradictionCount:contradictions.length,
      contradictions:contradictions.map(event=>({label:event.label,sourceType:event.sourceType,phase:event.phase,date:event.date||null})),
      events:events.map(event=>({...event})),
      reviewReasons:reasons,
      mutatesScores:false
    };
  });

  const byStatus=status=>rows.filter(row=>row.status===status);
  const summary={
    rosterCount:rows.length,
    exactScoreMatches:rows.filter(row=>row.exactScoreMatch).length,
    cleanMatches:byStatus('match').length,
    scoreMismatches:byStatus('score-mismatch').length,
    needsLedgerCompletion:byStatus('needs-ledger-completion').length,
    missingEraLossEntries:byStatus('missing-era-loss-entry').length,
    missingLivePenalties:byStatus('missing-live-penalty').length,
    fightersWithMissingLossEvents:rows.filter(row=>Number(row.missingLossEvents)>0).length,
    fightersWithUnknownPhase:rows.filter(row=>row.unknownPhase>0).length,
    fightersWithUnknownQuality:rows.filter(row=>row.unknownQuality>0).length,
    fightersWithUndatedLosses:rows.filter(row=>row.undatedLosses>0).length,
    fightersWithBucketContradictions:rows.filter(row=>row.contradictionCount>0).length,
    correctionWorksheetCoverage:rows.filter(row=>row.correctionWorksheetEntry).length,
    manualContextExceptions:rows.filter(row=>row.manualContextException).length
  };

  const report={
    version:VERSION,
    sourceEraLedgerVersion:era.version||null,
    sourceAdapterVersion:adapter.version||null,
    sourcePenaltyVersion:corrections?.version||null,
    rules:adapter.rules?.lossPenaltyRules||null,
    cap:CAP,
    summary,
    rows,
    cleanMatches:byStatus('match'),
    scoreMismatches:byStatus('score-mismatch'),
    needsLedgerCompletion:byStatus('needs-ledger-completion'),
    missingEraLossEntries:byStatus('missing-era-loss-entry'),
    entryFor:fighter=>rows.find(row=>key(row.fighter)===key(fighter))||null,
    mutatesScores:false,
    mutatesPenalty:false,
    appliedAt:new Date().toISOString()
  };

  window.UFC_LOSS_CONTEXT_MISMATCH_AUDIT=report;
  if(DATA.meta)DATA.meta.lossContextMismatchAudit={version:VERSION,...summary,mutatesScores:false,appliedAt:report.appliedAt};
  document.documentElement.setAttribute('data-loss-context-mismatch-audit',`${VERSION}-${rows.length}`);
  window.dispatchEvent(new CustomEvent('ufc-loss-context-mismatch-audit-ready',{detail:report}));
})();
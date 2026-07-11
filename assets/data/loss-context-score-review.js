// Canonical Loss Context score review and safe promotion.
// Promotes only fully covered score mismatches from the completed 62-fighter loss ledger.
(function(){
  'use strict';
  const VERSION='loss-context-score-review-20260710a-canonical-ledger-promotion';
  const CAP=-10;
  const DATA=window.RANKING_DATA;
  const audit=window.UFC_LOSS_CONTEXT_MISMATCH_AUDIT;
  const adapter=window.UFC_LOSS_CONTEXT_LEDGER_ADAPTER;

  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function round2(value){const n=Number(value);return Number.isFinite(n)?Math.round((n+Number.EPSILON)*100)/100:null;}
  function allRows(){return [...(DATA?.men||[]),...(DATA?.women||[]),...(DATA?.fighters||[])].filter(row=>row?.fighter);}
  function rowsFor(fighter){const target=key(fighter);return allRows().filter(row=>key(row.fighter)===target);}
  function eventEntryFor(fighter){
    if(typeof adapter?.eventEntryFor==='function')return adapter.eventEntryFor(fighter);
    if(typeof adapter?.entryFor==='function')return adapter.entryFor(fighter);
    return null;
  }
  function safeForPromotion(row){
    if(row?.status!=='score-mismatch')return false;
    if(!Number.isFinite(Number(row?.cappedLedgerEstimate)))return false;
    if(Number(row?.missingLossEvents||0)>0)return false;
    if(Number(row?.unknownPhase||0)>0)return false;
    if(Number(row?.unknownQuality||0)>0)return false;
    if(Number(row?.undatedLosses||0)>0)return false;
    if(Number(row?.contradictionCount||0)>0)return false;
    return !!eventEntryFor(row.fighter);
  }

  if(!DATA||!audit?.rows||!adapter){
    window.UFC_LOSS_CONTEXT_SCORE_REVIEW={
      version:VERSION,
      applied:false,
      error:[!DATA?'Missing RANKING_DATA':null,!audit?.rows?'Missing pre-promotion mismatch audit':null,!adapter?'Missing Loss Context adapter':null].filter(Boolean).join('; '),
      mutatesPenalty:false,
      mutatesScores:false
    };
    return;
  }

  window.UFC_LOSS_CONTEXT_PRE_PROMOTION_AUDIT=audit;
  const promoted=[];
  const unchanged=[];
  const blocked=[];

  audit.rows.forEach(row=>{
    const current=round2(row.livePenalty);
    const recommended=round2(Math.max(CAP,Number(row.cappedLedgerEstimate)));
    if(row.status==='match'||row.exactScoreMatch){
      unchanged.push({fighter:row.fighter,penalty:current,status:'already-matched'});
      return;
    }
    if(!safeForPromotion(row)){
      blocked.push({
        fighter:row.fighter,
        status:row.status,
        currentPenalty:current,
        recommendedPenalty:recommended,
        reasons:[...(row.reviewReasons||[])],
        missingLossEvents:Number(row.missingLossEvents||0),
        unknownPhase:Number(row.unknownPhase||0),
        unknownQuality:Number(row.unknownQuality||0),
        undatedLosses:Number(row.undatedLosses||0),
        contradictionCount:Number(row.contradictionCount||0)
      });
      return;
    }

    const eventEntry=eventEntryFor(row.fighter);
    const delta=round2(recommended-current);
    const notes=`Canonical UFC loss ledger review replaced ${current.toFixed(2)} with ${recommended.toFixed(2)} under the locked phase, opponent-quality, finish, upward-division, post-prime, and -10 cap rules.`;
    rowsFor(row.fighter).forEach(target=>{
      target.penalty=recommended;
      target.lossPenalty=recommended;
      target.penaltyNotes=notes;
      target.penaltyAudit={
        version:VERSION,
        score:recommended,
        priorScore:current,
        delta,
        rules:adapter.rules?.lossPenaltyRules||null,
        cap:CAP,
        notes,
        source:'Canonical Loss Context ledger score review',
        sourceAuditVersion:audit.version||null,
        sourceAdapterVersion:adapter.version||null,
        eventCount:Array.isArray(eventEntry?.events)?eventEntry.events.filter(event=>event?.isLoss).length:0,
        launchMode:'canonical-ledger-promoted',
        appliedAt:new Date().toISOString()
      };
      target.lossContextScoreReview={...target.penaltyAudit};
    });
    promoted.push({
      fighter:row.fighter,
      priorPenalty:current,
      promotedPenalty:recommended,
      delta,
      rawLedgerEstimate:round2(row.rawLedgerEstimate),
      cappedLedgerEstimate:recommended,
      capApplied:Number(row.rawLedgerEstimate)<CAP,
      lossEvents:Array.isArray(eventEntry?.events)?eventEntry.events.filter(event=>event?.isLoss).map(event=>({
        label:event.label,
        date:event.date,
        phase:event.phase,
        quality:event.quality,
        finished:event.finished,
        upwardDivision:event.upwardDivision,
        penaltyEstimate:event.penaltyEstimate
      })):[]
    });
  });

  promoted.sort((a,b)=>Math.abs(Number(b.delta||0))-Math.abs(Number(a.delta||0))||String(a.fighter).localeCompare(String(b.fighter)));
  blocked.sort((a,b)=>String(a.fighter).localeCompare(String(b.fighter)));
  const report={
    version:VERSION,
    applied:true,
    sourceAuditVersion:audit.version||null,
    sourceAdapterVersion:adapter.version||null,
    rosterCount:audit.rows.length,
    prePromotionScoreMismatchCount:audit.summary?.scoreMismatches??audit.rows.filter(row=>row.status==='score-mismatch').length,
    promotedCount:promoted.length,
    unchangedCount:unchanged.length,
    blockedCount:blocked.length,
    capAppliedCount:promoted.filter(row=>row.capApplied).length,
    promoted,
    unchanged,
    blocked,
    entryFor:fighter=>promoted.find(row=>key(row.fighter)===key(fighter))||blocked.find(row=>key(row.fighter)===key(fighter))||unchanged.find(row=>key(row.fighter)===key(fighter))||null,
    rules:adapter.rules?.lossPenaltyRules||null,
    cap:CAP,
    mutatesPenalty:promoted.length>0,
    mutatesScores:promoted.length>0,
    finalScoreRecalculationOwner:'final-score-engine.js',
    appliedAt:new Date().toISOString()
  };
  window.UFC_LOSS_CONTEXT_SCORE_REVIEW=report;
  if(DATA.meta)DATA.meta.lossContextScoreReview={
    version:VERSION,
    rosterCount:report.rosterCount,
    prePromotionScoreMismatchCount:report.prePromotionScoreMismatchCount,
    promotedCount:report.promotedCount,
    unchangedCount:report.unchangedCount,
    blockedCount:report.blockedCount,
    capAppliedCount:report.capAppliedCount,
    finalScoreRecalculationOwner:report.finalScoreRecalculationOwner,
    appliedAt:report.appliedAt
  };
  document.documentElement.setAttribute('data-loss-context-score-review',`${VERSION}-${promoted.length}`);
  window.dispatchEvent(new CustomEvent('ufc-loss-context-score-review-ready',{detail:report}));
})();

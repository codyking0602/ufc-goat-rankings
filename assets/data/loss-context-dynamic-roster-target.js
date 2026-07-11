// Keeps Loss Context completion targets aligned with the live roster as fighters are added.
(function(){
  'use strict';
  const VERSION='loss-context-dynamic-roster-target-20260710a';
  const DATA=window.RANKING_DATA;
  const API=window.UFC_LOSS_CONTEXT_CANONICAL_PRODUCTION;
  if(!DATA||!API?.finalize){
    window.UFC_LOSS_CONTEXT_DYNAMIC_ROSTER_TARGET={version:VERSION,applied:false,error:'Loss Context production engine not ready.'};
    return;
  }

  function target(){
    return new Set([...(DATA.men||[]),...(DATA.women||[])].map(row=>row?.fighter).filter(Boolean)).size;
  }
  function patchFinalizer(){
    const expected=target();
    const finalizer=window.UFC_LOSS_CONTEXT_LEDGER_FINALIZER;
    const flagged=window.UFC_LOSS_CONTEXT_FLAGGED_FIGHTERS;
    if(finalizer){
      finalizer.expectedRosterCount=expected;
      finalizer.complete=Number(finalizer.rosterCount||0)===expected&&Number(finalizer.unresolvedCount||0)===0;
      finalizer.dynamicRosterTargetVersion=VERSION;
    }
    if(flagged){
      flagged.ledgerCoverageComplete=Number(flagged.completedFighters?.length||0)===expected&&Number(flagged.flaggedCount||0)===0;
      flagged.dynamicRosterTargetVersion=VERSION;
    }
    return {expected,finalizer};
  }

  const originalFinalize=API.finalize.bind(API);
  API.finalize=function(){
    const report=originalFinalize();
    const {expected,finalizer}=patchFinalizer();
    if(report){
      report.rosterTarget=expected;
      report.ledgerFinalizer=finalizer||report.ledgerFinalizer;
      const post=report.postPromotionAudit||{};
      report.complete=Number(report.rosterLedgerCoverage||0)===expected&&Number(post.remainingFlaggedCount||0)===0&&Number(post.remainingScoreMismatchCount||0)===0&&Number(post.remainingLedgerBlockCount||0)===0&&Number(post.missingLivePenaltyCount||0)===0;
      report.dynamicRosterTargetVersion=VERSION;
      window.UFC_LOSS_CONTEXT_FINAL_RECONCILIATION=report;
      if(DATA.meta?.lossContextFinalReconciliation){
        DATA.meta.lossContextFinalReconciliation.complete=report.complete;
        DATA.meta.lossContextFinalReconciliation.rosterLedgerCoverage=report.rosterLedgerCoverage;
        DATA.meta.lossContextFinalReconciliation.rosterTarget=expected;
        DATA.meta.lossContextFinalReconciliation.dynamicRosterTargetVersion=VERSION;
      }
    }
    return report;
  };

  const initial=patchFinalizer();
  window.UFC_LOSS_CONTEXT_DYNAMIC_ROSTER_TARGET={version:VERSION,applied:true,expectedRosterCount:initial.expected,mutatesScores:false,mutatesPenalty:false,appliedAt:new Date().toISOString()};
  document.documentElement.setAttribute('data-loss-context-dynamic-roster-target',`${VERSION}-${initial.expected}`);
})();

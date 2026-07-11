// Final runtime closure report for the 62-fighter Loss Context rebuild.
// Runs after the final-score engine so penalty changes, rank movement, and unresolved rows are measured from live data.
(function(){
  'use strict';
  const VERSION='loss-context-final-reconciliation-report-20260710a-runtime-closure';
  const DATA=window.RANKING_DATA;
  const finalizer=window.UFC_LOSS_CONTEXT_LEDGER_FINALIZER;
  const review=window.UFC_LOSS_CONTEXT_SCORE_REVIEW;
  const audit=window.UFC_LOSS_CONTEXT_MISMATCH_AUDIT;
  const queue=window.UFC_LOSS_CONTEXT_FLAGGED_FIGHTERS;
  const engine=window.UFC_FINAL_SCORE_ENGINE;

  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function num(value){const n=Number(value);return Number.isFinite(n)?n:0;}
  function round2(value){return Math.round((num(value)+Number.EPSILON)*100)/100;}
  function boards(){return [{name:'men',rows:DATA?.men||[]},{name:'women',rows:DATA?.women||[]}];}

  if(!DATA||!finalizer||!review||!audit?.rows||!engine){
    window.UFC_LOSS_CONTEXT_FINAL_RECONCILIATION={
      version:VERSION,
      applied:false,
      error:[!DATA?'Missing RANKING_DATA':null,!finalizer?'Missing ledger finalizer':null,!review?'Missing score review':null,!audit?.rows?'Missing post-promotion audit':null,!engine?'Missing final-score engine':null].filter(Boolean).join('; '),
      complete:false,
      mutatesScores:false
    };
    return;
  }

  const promotedByName=new Map((review.promoted||[]).map(row=>[key(row.fighter),row]));
  const rankingMovement=[];
  const counterfactualBoards={};

  boards().forEach(board=>{
    const counterRows=board.rows.map(row=>{
      const promotion=promotedByName.get(key(row.fighter));
      const priorPenalty=promotion?num(promotion.priorPenalty):num(row.penalty);
      const currentPenalty=num(row.penalty);
      const counterfactualTotal=round2(num(row.totalScore)-currentPenalty+priorPenalty);
      return {fighter:row.fighter,currentRank:Number(row.rank||0),currentTotal:round2(row.totalScore),currentPenalty:round2(currentPenalty),priorPenalty:round2(priorPenalty),counterfactualTotal};
    }).sort((a,b)=>b.counterfactualTotal-a.counterfactualTotal||String(a.fighter).localeCompare(String(b.fighter)));
    counterRows.forEach((row,index)=>{row.counterfactualRank=index+1;row.rankMovement=row.counterfactualRank-row.currentRank;});
    counterfactualBoards[board.name]=counterRows;
    counterRows.filter(row=>row.currentPenalty!==row.priorPenalty||row.rankMovement!==0).forEach(row=>rankingMovement.push({board:board.name,...row}));
  });

  rankingMovement.sort((a,b)=>Math.abs(b.rankMovement)-Math.abs(a.rankMovement)||Math.abs(b.currentPenalty-b.priorPenalty)-Math.abs(a.currentPenalty-a.priorPenalty)||String(a.fighter).localeCompare(String(b.fighter)));
  const unresolvedRows=audit.rows.filter(row=>row.status!=='match');
  const remainingScoreMismatches=unresolvedRows.filter(row=>row.status==='score-mismatch');
  const remainingLedgerBlocks=unresolvedRows.filter(row=>['needs-ledger-completion','missing-era-loss-entry'].includes(row.status));
  const missingLivePenalties=unresolvedRows.filter(row=>row.status==='missing-live-penalty');
  const promotedPenaltyChanges=(review.promoted||[]).map(row=>({fighter:row.fighter,priorPenalty:row.priorPenalty,promotedPenalty:row.promotedPenalty,delta:row.delta,capApplied:row.capApplied,lossEventCount:(row.lossEvents||[]).length}));
  const complete=finalizer.complete===true
    && finalizer.rosterCount===62
    && Number(audit.summary?.finalizedLedgerCoverage||0)===62
    && unresolvedRows.length===0
    && Number(review.blockedCount||0)===0;

  const report={
    version:VERSION,
    applied:true,
    complete,
    rosterTarget:62,
    rosterLedgerCoverage:Number(audit.summary?.finalizedLedgerCoverage||0),
    ledgerFinalizer:{
      version:finalizer.version||null,
      complete:finalizer.complete===true,
      bucketRepairCount:Number(finalizer.bucketRepairCount||0),
      recordRepairCount:Number(finalizer.recordRepairCount||0),
      unresolvedCount:Number(finalizer.unresolvedCount||0),
      recordRepairs:[...(finalizer.recordRepairs||[])],
      bucketRepairs:[...(finalizer.bucketRepairs||[])]
    },
    scoreReview:{
      version:review.version||null,
      prePromotionScoreMismatchCount:Number(review.prePromotionScoreMismatchCount||0),
      promotedCount:Number(review.promotedCount||0),
      unchangedCount:Number(review.unchangedCount||0),
      blockedCount:Number(review.blockedCount||0),
      capAppliedCount:Number(review.capAppliedCount||0),
      promotedPenaltyChanges
    },
    postPromotionAudit:{
      version:audit.version||null,
      cleanMatches:Number(audit.summary?.cleanMatches||0),
      exactScoreMatches:Number(audit.summary?.exactScoreMatches||0),
      remainingFlaggedCount:unresolvedRows.length,
      remainingScoreMismatchCount:remainingScoreMismatches.length,
      remainingLedgerBlockCount:remainingLedgerBlocks.length,
      missingLivePenaltyCount:missingLivePenalties.length,
      unresolvedRows:unresolvedRows.map(row=>({fighter:row.fighter,status:row.status,livePenalty:row.livePenalty,cappedLedgerEstimate:row.cappedLedgerEstimate,delta:row.delta,reviewReasons:[...(row.reviewReasons||[])]}))
    },
    rankingImpact:{
      changedPenaltyCount:promotedPenaltyChanges.length,
      fightersWithRankMovement:rankingMovement.filter(row=>row.rankMovement!==0).length,
      movement:rankingMovement,
      counterfactualMethod:'Rebuild each final board using the prior penalty while holding every final positive category and Apex Peak value constant.'
    },
    queue:{
      version:queue?.version||null,
      flaggedCount:Number(queue?.flaggedCount||0),
      nextLedgerBatchCount:Array.isArray(queue?.nextLedgerBatch)?queue.nextLedgerBatch.length:null,
      ledgerCoverageComplete:queue?.ledgerCoverageComplete===true
    },
    finalScoreEngineVersion:engine.version||null,
    warnings:[
      ...(finalizer.unresolved||[]).map(row=>`${row.fighter}: ${row.reason}`),
      ...unresolvedRows.map(row=>`${row.fighter}: ${(row.reviewReasons||[]).join(' ')||row.status}`)
    ],
    mutatesScores:false,
    mutatesPenalty:false,
    generatedAt:new Date().toISOString()
  };

  window.UFC_LOSS_CONTEXT_FINAL_RECONCILIATION=report;
  if(DATA.meta)DATA.meta.lossContextFinalReconciliation={version:VERSION,complete,rosterLedgerCoverage:report.rosterLedgerCoverage,promotedCount:report.scoreReview.promotedCount,remainingFlaggedCount:report.postPromotionAudit.remainingFlaggedCount,fightersWithRankMovement:report.rankingImpact.fightersWithRankMovement,generatedAt:report.generatedAt};
  document.documentElement.setAttribute('data-loss-context-final-reconciliation',`${VERSION}-${complete?'complete':'review'}-${unresolvedRows.length}`);
  window.dispatchEvent(new CustomEvent('ufc-loss-context-final-reconciliation-ready',{detail:report}));
})();
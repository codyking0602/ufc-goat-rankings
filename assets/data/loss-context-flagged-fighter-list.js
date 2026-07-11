// Runtime Loss Context flagged-fighter queue.
// Converts the 62-fighter mismatch audit into practical ledger-completion and score-review batches.
(function(){
  'use strict';
  const VERSION='loss-context-flagged-fighter-list-20260710g-batch-seven-complete-roster';
  const audit=window.UFC_LOSS_CONTEXT_MISMATCH_AUDIT;
  const DATA=window.RANKING_DATA;

  if(!audit?.rows){
    window.UFC_LOSS_CONTEXT_FLAGGED_FIGHTERS={version:VERSION,error:'Missing UFC_LOSS_CONTEXT_MISMATCH_AUDIT.',mutatesScores:false};
    return;
  }

  const rows=audit.rows.map(row=>({...row}));
  const flagged=rows.filter(row=>row.status!=='match');
  const ledgerCompletion=flagged.filter(row=>['needs-ledger-completion','missing-era-loss-entry'].includes(row.status));
  const scoreReview=flagged.filter(row=>row.status==='score-mismatch');
  const missingLivePenalty=flagged.filter(row=>row.status==='missing-live-penalty');

  function priorityValue(row){
    const missing=Number(row.missingLossEvents||0)*100;
    const unknown=(Number(row.unknownPhase||0)+Number(row.unknownQuality||0)+Number(row.undatedLosses||0))*25;
    const contradictions=Number(row.contradictionCount||0)*20;
    const delta=Math.abs(Number(row.delta||0))*5;
    return missing+unknown+contradictions+delta+(row.status==='missing-era-loss-entry'?500:0);
  }

  const priorityQueue=flagged
    .map(row=>({
      fighter:row.fighter,
      status:row.status,
      priority:priorityValue(row),
      missingLossEvents:row.missingLossEvents,
      machineReadableLossEvents:row.machineReadableLossEvents,
      officialUfcLosses:row.officialUfcLosses,
      unknownPhase:row.unknownPhase,
      unknownQuality:row.unknownQuality,
      undatedLosses:row.undatedLosses,
      contradictionCount:row.contradictionCount,
      livePenalty:row.livePenalty,
      cappedLedgerEstimate:row.cappedLedgerEstimate,
      delta:row.delta,
      reviewReasons:[...(row.reviewReasons||[])]
    }))
    .sort((a,b)=>b.priority-a.priority||String(a.fighter).localeCompare(String(b.fighter)));

  const completedBatches={
    batchOne:['Robert Whittaker','Sean Strickland'],
    batchTwo:['B.J. Penn','Tito Ortiz','Robbie Lawler','Charles Oliveira','Jessica Andrade'],
    batchThree:['Frankie Edgar','Michael Bisping','Lyoto Machida','Matt Hughes','Chael Sonnen'],
    batchFour:['Max Holloway','Tony Ferguson','Randy Couture','Dustin Poirier','Miesha Tate'],
    batchFive:['Anderson Silva','Chuck Liddell','Junior dos Santos','Dan Henderson','Joanna Jedrzejczyk','Carla Esparza','Dominick Cruz','Tyron Woodley','T.J. Dillashaw','Stipe Miocic'],
    batchSix:['Jon Jones','Georges St-Pierre','Demetrious Johnson','Khabib Nurmagomedov','Islam Makhachev','Alexander Volkanovski','Jose Aldo','Kamaru Usman','Daniel Cormier','Dricus du Plessis','Israel Adesanya','Aljamain Sterling','Petr Yan','Cain Velasquez','Brock Lesnar','Francis Ngannou','Henry Cejudo','Conor McGregor'],
    batchSeven:['Ilia Topuria','Merab Dvalishvili','Alex Pereira','Justin Gaethje','Deiveson Figueiredo','Khamzat Chimaev',"Sean O'Malley",'Amanda Nunes','Valentina Shevchenko','Zhang Weili','Rose Namajunas','Mackenzie Dern','Kayla Harrison','Alexa Grasso','Julianna Peña','Holly Holm','Ronda Rousey']
  };
  const completedLedgerFighters=Object.values(completedBatches).flat();
  const completedSet=new Set(completedLedgerFighters.map(name=>String(name).replace(/[’‘`´]/g,"'").toLowerCase()));
  const nextLedgerBatch=priorityQueue
    .filter(row=>['needs-ledger-completion','missing-era-loss-entry'].includes(row.status)&&!completedSet.has(String(row.fighter||'').replace(/[’‘`´]/g,"'").toLowerCase()));
  const nextScoreReview=priorityQueue
    .filter(row=>row.status==='score-mismatch')
    .slice(0,10);
  const ledgerCoverageComplete=completedLedgerFighters.length===62&&nextLedgerBatch.length===0;

  const report={
    version:VERSION,
    sourceAuditVersion:audit.version||null,
    rosterCount:audit.summary?.rosterCount||rows.length,
    flaggedCount:flagged.length,
    cleanCount:rows.length-flagged.length,
    ledgerCompletionCount:ledgerCompletion.length,
    scoreReviewCount:scoreReview.length,
    missingLivePenaltyCount:missingLivePenalty.length,
    flaggedFighters:flagged.map(row=>row.fighter),
    ledgerCompletionFighters:ledgerCompletion.map(row=>row.fighter),
    scoreReviewFighters:scoreReview.map(row=>row.fighter),
    priorityQueue,
    completedBatches,
    completedLedgerFighters,
    completedLedgerCount:completedLedgerFighters.length,
    rosterLedgerTarget:62,
    ledgerCoverageComplete,
    nextBatch:nextLedgerBatch,
    nextLedgerBatch,
    nextScoreReview,
    batchSize:0,
    mutatesScores:false,
    mutatesPenalty:false,
    generatedAt:new Date().toISOString()
  };

  window.UFC_LOSS_CONTEXT_FLAGGED_FIGHTERS=report;
  if(DATA?.meta)DATA.meta.lossContextFlaggedFighters={
    version:VERSION,
    flaggedCount:report.flaggedCount,
    ledgerCompletionCount:report.ledgerCompletionCount,
    scoreReviewCount:report.scoreReviewCount,
    completedLedgerFighters:[...completedLedgerFighters],
    completedLedgerCount:report.completedLedgerCount,
    rosterLedgerTarget:report.rosterLedgerTarget,
    ledgerCoverageComplete,
    nextBatch:[],
    batchSize:0,
    generatedAt:report.generatedAt
  };
  document.documentElement.setAttribute('data-loss-context-flagged-count',String(report.flaggedCount));
  document.documentElement.setAttribute('data-loss-context-ledger-coverage',`${report.completedLedgerCount}/${report.rosterLedgerTarget}`);
  document.documentElement.setAttribute('data-loss-context-next-batch','');
})();

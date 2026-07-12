// Phase-two audit for the hybrid UFC Loss Context shadow model.
// Reviews full-roster outputs without mutating live penalties, totals, ranks, or OVR.
(function(){
  'use strict';

  const VERSION='loss-context-hybrid-audit-20260711d-judgment-approved';
  const JUDGMENT_LOCK_VERSION='loss-context-hybrid-judgment-lock-20260711a';
  const THRESHOLDS={
    majorRelief:3.00,
    meaningfulRelief:1.50,
    harsherBy:0.75,
    majorRankMovement:3,
    lowExposure:4
  };

  function round2(value){const n=Number(value||0);return Math.round((n+Number.EPSILON)*100)/100;}
  function abs(value){return Math.abs(Number(value||0));}

  function run(){
    const shadow=window.UFC_LOSS_CONTEXT_HYBRID_SHADOW;
    const exposureLedger=window.UFC_LOSS_CONTEXT_EXPOSURE_LEDGER;
    if(!shadow?.applied||!Array.isArray(shadow.results))return false;

    const scored=shadow.results.filter(row=>row.status==='scored');
    const blocked=shadow.results.filter(row=>row.status!=='scored');
    const relief=scored.filter(row=>Number(row.projectedDelta)>0.01);
    const harsher=scored.filter(row=>Number(row.projectedDelta)<-0.01);
    const unchanged=scored.filter(row=>abs(row.projectedDelta)<=0.01);

    const flags={
      blocked,
      severityCap:scored.filter(row=>Number(row.severity)>=Number(row.severityMax)-0.01),
      frequencyCap:scored.filter(row=>Number(row.frequency)>=Number(row.frequencyMax)-0.01),
      primeVolumeFloorApplied:scored.filter(row=>row.primeVolumeFloorApplied===true),
      totalCap:scored.filter(row=>Number(row.preDivision)>=Number(shadow.rules?.totalMax||6)-0.01),
      maxDivisionDiscount:scored.filter(row=>Number(row.divisionDiscountPct)>=Number(shadow.rules?.divisionDiscountMax||0.15)-0.001),
      majorRelief:scored.filter(row=>Number(row.projectedDelta)>=THRESHOLDS.majorRelief),
      meaningfulRelief:scored.filter(row=>Number(row.projectedDelta)>=THRESHOLDS.meaningfulRelief),
      harsherOutcomes:scored.filter(row=>Number(row.projectedDelta)<=-THRESHOLDS.harsherBy),
      majorRankMovement:scored.filter(row=>abs(row.rankMovement)>=THRESHOLDS.majorRankMovement),
      lowExposure:scored.filter(row=>Number(row.exposure)<=THRESHOLDS.lowExposure),
      postPrimeExclusions:scored.filter(row=>Number(row.excludedPostPrimeFightCount)>0),
      exposureLedgerIssues:scored.filter(row=>row.exposureAuditStatus!=='ready'||(row.exposureAuditIssues||[]).length>0),
      zeroLossAnomalies:scored.filter(row=>Number(row.eventCount)===0&&Number(row.recommendedPenalty)!==0),
      lossPenaltyAnomalies:scored.filter(row=>Number(row.eventCount)>0&&Number(row.recommendedPenalty)===0)
    };

    Object.values(flags).forEach(rows=>rows.sort((a,b)=>abs(b.projectedDelta)-abs(a.projectedDelta)||abs(b.rankMovement)-abs(a.rankMovement)||String(a.fighter).localeCompare(String(b.fighter))));

    const spotlightNames=['Dricus du Plessis','Justin Gaethje','Jon Jones','Georges St-Pierre','Max Holloway','Charles Oliveira','Randy Couture','Jose Aldo','Anderson Silva','Khabib Nurmagomedov'];
    const spotlight=spotlightNames.map(name=>shadow.entryFor?.(name)).filter(Boolean);
    const judgmentReview=(shadow.biggestRankMovers||[]).slice(0,15);

    const criticalFlags=[
      ...flags.blocked.map(row=>({fighter:row.fighter,type:'blocked',detail:(row.blockers||[]).join(', ')})),
      ...flags.exposureLedgerIssues.map(row=>({fighter:row.fighter,type:'exposure-ledger-issue',detail:(row.exposureAuditIssues||[]).join(', ')})),
      ...flags.zeroLossAnomalies.map(row=>({fighter:row.fighter,type:'zero-loss-anomaly',detail:`${row.eventCount} losses but ${row.recommendedPenalty} penalty`})),
      ...flags.lossPenaltyAnomalies.map(row=>({fighter:row.fighter,type:'loss-penalty-anomaly',detail:`${row.eventCount} losses but zero penalty`}))
    ];

    const summary={
      rosterCount:shadow.expectedRosterCount,
      scoredCount:scored.length,
      blockedCount:blocked.length,
      coverageComplete:shadow.coverageComplete===true,
      exposureLedgerCoveredCount:exposureLedger?.coveredCount??null,
      exposureLedgerBlockedCount:exposureLedger?.blockedCount??null,
      exposureLedgerCoverageComplete:exposureLedger?.coverageComplete===true,
      reliefCount:relief.length,
      harsherCount:harsher.length,
      unchangedCount:unchanged.length,
      severityCapCount:flags.severityCap.length,
      frequencyCapCount:flags.frequencyCap.length,
      primeVolumeFloorAppliedCount:flags.primeVolumeFloorApplied.length,
      totalCapCount:flags.totalCap.length,
      maxDivisionDiscountCount:flags.maxDivisionDiscount.length,
      majorReliefCount:flags.majorRelief.length,
      majorRankMovementCount:flags.majorRankMovement.length,
      lowExposureCount:flags.lowExposure.length,
      postPrimeExclusionCount:flags.postPrimeExclusions.length,
      judgmentReviewCount:judgmentReview.length,
      judgmentApproved:true,
      judgmentLockVersion:JUDGMENT_LOCK_VERSION,
      criticalFlagCount:criticalFlags.length,
      averageCurrentPenalty:round2(scored.reduce((sum,row)=>sum+Number(row.currentPenalty||0),0)/Math.max(1,scored.length)),
      averageRecommendedPenalty:round2(scored.reduce((sum,row)=>sum+Number(row.recommendedPenalty||0),0)/Math.max(1,scored.length)),
      averageRelief:round2(relief.reduce((sum,row)=>sum+Number(row.projectedDelta||0),0)/Math.max(1,relief.length))
    };

    const audit={
      version:VERSION,
      applied:true,
      phase:2,
      mode:'full-roster-canonical-exposure-prime-volume-shadow-audit',
      sourceShadowVersion:shadow.version,
      sourceExposureLedgerVersion:exposureLedger?.version||null,
      judgmentApproved:true,
      judgmentLockVersion:JUDGMENT_LOCK_VERSION,
      thresholds:THRESHOLDS,
      summary,
      flags,
      criticalFlags,
      spotlight,
      judgmentReview,
      largestRelief:shadow.largestRelief||[],
      harshestProjected:shadow.harshestProjected||[],
      biggestRankMovers:shadow.biggestRankMovers||[],
      postPrimeExposureAudit:shadow.postPrimeExposureAudit||[],
      readyForLivePromotion:summary.coverageComplete&&summary.exposureLedgerCoverageComplete&&criticalFlags.length===0,
      requiresJudgmentReview:false,
      mutatesScores:false,
      mutatesPenalty:false,
      generatedAt:new Date().toISOString()
    };

    window.UFC_LOSS_CONTEXT_HYBRID_AUDIT=audit;
    if(window.RANKING_DATA?.meta){
      window.RANKING_DATA.meta.lossContextHybridAudit={
        version:VERSION,
        phase:2,
        sourceShadowVersion:shadow.version,
        sourceExposureLedgerVersion:exposureLedger?.version||null,
        summary,
        judgmentApproved:true,
        judgmentLockVersion:JUDGMENT_LOCK_VERSION,
        readyForLivePromotion:audit.readyForLivePromotion,
        requiresJudgmentReview:false,
        mutatesScores:false,
        generatedAt:audit.generatedAt
      };
    }
    document.documentElement.setAttribute('data-loss-context-hybrid-audit',`${VERSION}-${summary.scoredCount}-${summary.criticalFlagCount}`);
    window.dispatchEvent(new CustomEvent('ufc-loss-context-hybrid-audit-ready',{detail:audit}));
    return true;
  }

  if(run())return;
  window.UFC_LOSS_CONTEXT_HYBRID_AUDIT={version:VERSION,applied:false,status:'waiting-for-hybrid-shadow',phase:2,judgmentApproved:true,judgmentLockVersion:JUDGMENT_LOCK_VERSION,mutatesScores:false,mutatesPenalty:false};
  window.addEventListener('ufc-loss-context-hybrid-shadow-ready',()=>run(),{once:true});
  window.addEventListener('ufc-scoring-pipeline-ready',()=>run(),{once:true});
})();
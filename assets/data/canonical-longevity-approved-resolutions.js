// Applies Cody's July 14, 2026 shared-window decisions to the canonical Longevity audit report.
// Shadow-only: classifies approved differences and leaves live scores untouched.
(function(){
  'use strict';
  const VERSION='canonical-longevity-approved-resolutions-20260714b-all-seventeen';
  const report=window.UFC_CANONICAL_LONGEVITY_RECONSTRUCTION;
  const longevityEraApproval=window.UFC_FIGHTER_ERA_LEDGER_APPROVED_LONGEVITY_RESOLUTIONS;
  const lossContextEraApproval=window.UFC_FIGHTER_ERA_LEDGER_APPROVED_LOSS_CONTEXT_RESOLUTIONS;
  if(!report?.applied||!longevityEraApproval?.applied||!lossContextEraApproval?.applied){
    window.UFC_CANONICAL_LONGEVITY_APPROVED_RESOLUTIONS={version:VERSION,applied:false,error:'Missing canonical Longevity reconstruction or approved shared Era resolutions.',mutatesScores:false};
    return;
  }

  const ACCEPTED=new Map(Object.entries(longevityEraApproval.acceptedCleanScores||{}));
  const LONGEVITY_WINDOW_RESOLUTIONS=new Set(longevityEraApproval.windowChanges||[]);
  const LOSS_CONTEXT_WINDOW_RESOLUTIONS=new Set(lossContextEraApproval.windowChanges||[]);
  const WINDOW_RESOLUTIONS=new Set([...LONGEVITY_WINDOW_RESOLUTIONS,...LOSS_CONTEXT_WINDOW_RESOLUTIONS]);
  const ORIGINAL_FOURTEEN=new Set([...ACCEPTED.keys(),...LONGEVITY_WINDOW_RESOLUTIONS]);
  const ALL_RESOLVED=new Set([...ORIGINAL_FOURTEEN,...LOSS_CONTEXT_WINDOW_RESOLUTIONS]);
  const resolved=[];

  report.fighters.forEach(row=>{
    if(!ALL_RESOLVED.has(row.fighter))return;
    const acceptedScore=ACCEPTED.get(row.fighter);
    const fromLossContext=LOSS_CONTEXT_WINDOW_RESOLUTIONS.has(row.fighter);
    const type=fromLossContext
      ?'Cody-approved shared Era Ledger correction from Loss Context'
      :WINDOW_RESOLUTIONS.has(row.fighter)
        ?'Cody-approved shared Era Ledger judgment'
        :'Cody-approved factual correction';
    const decision=fromLossContext
      ?'Use the newly approved shared Era Ledger boundary across Loss Context, Longevity, and Prime Dominance.'
      :WINDOW_RESOLUTIONS.has(row.fighter)
        ?'Use the approved shared Era Ledger boundary and universal 18-month gap cap.'
        :'Accept the clean shared-window reconstruction; do not preserve the frozen score through hidden calibration.';
    row.resolution={approved:true,approvedBy:'Cody',approvedAt:'2026-07-14',classification:type,decision,acceptedReconstructedScore:Number.isFinite(Number(acceptedScore))?Number(acceptedScore):row.reconstructedScore,version:VERSION};
    row.classification=type;
    row.issues=(row.issues||[]).filter(issue=>!/missing judgment|unrecovered|precomputed|frozen value cannot/i.test(String(issue?.reason||'')));
    row.issues.push({classification:type,reason:decision});
    resolved.push({fighter:row.fighter,reconstructedScore:row.reconstructedScore,currentScore:row.currentScore,classification:type,decision});
  });

  report.missingJudgmentInputs=(report.missingJudgmentInputs||[]).filter(row=>!ALL_RESOLVED.has(row.fighter));
  report.missingJudgmentInputCount=report.missingJudgmentInputs.length;
  report.approvedResolutionVersion=VERSION;
  report.approvedResolutionCount=resolved.length;
  report.approvedResolvedFighters=resolved.map(row=>row.fighter);
  report.unresolvedAfterApproval=report.missingJudgmentInputs.map(row=>row.fighter);
  report.allFourteenResolved=Array.from(ORIGINAL_FOURTEEN).every(fighter=>resolved.some(row=>row.fighter===fighter));
  report.allSeventeenResolved=resolved.length===17&&report.missingJudgmentInputs.length===0;
  report.resolutions=resolved;

  window.UFC_CANONICAL_LONGEVITY_APPROVED_RESOLUTIONS={
    version:VERSION,applied:true,approvedBy:'Cody',approvedAt:'2026-07-14',resolvedCount:resolved.length,
    resolved,unresolved:report.unresolvedAfterApproval,allFourteenResolved:report.allFourteenResolved,
    allSeventeenResolved:report.allSeventeenResolved,lossContextWindowResolutionCount:LOSS_CONTEXT_WINDOW_RESOLUTIONS.size,
    mutatesScores:false,liveDataUnchanged:report.liveDataUnchanged,appliedAt:new Date().toISOString()
  };
  document.documentElement.setAttribute('data-canonical-longevity-approved-resolutions',VERSION);
})();

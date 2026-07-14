// Applies Cody's July 14, 2026 decisions to the canonical Longevity audit report.
// Shadow-only: classifies approved differences and leaves live scores untouched.
(function(){
  'use strict';
  const VERSION='canonical-longevity-approved-resolutions-20260714a-all-fourteen';
  const report=window.UFC_CANONICAL_LONGEVITY_RECONSTRUCTION;
  const eraApproval=window.UFC_FIGHTER_ERA_LEDGER_APPROVED_LONGEVITY_RESOLUTIONS;
  if(!report?.applied||!eraApproval?.applied){
    window.UFC_CANONICAL_LONGEVITY_APPROVED_RESOLUTIONS={version:VERSION,applied:false,error:'Missing canonical Longevity reconstruction or approved Era resolutions.',mutatesScores:false};
    return;
  }

  const ACCEPTED=new Map(Object.entries(eraApproval.acceptedCleanScores||{}));
  const WINDOW_RESOLUTIONS=new Set(eraApproval.windowChanges||[]);
  const ALL_RESOLVED=new Set([...ACCEPTED.keys(),...WINDOW_RESOLUTIONS]);
  const resolved=[];

  report.fighters.forEach(row=>{
    if(!ALL_RESOLVED.has(row.fighter))return;
    const acceptedScore=ACCEPTED.get(row.fighter);
    const type=WINDOW_RESOLUTIONS.has(row.fighter)?'Cody-approved shared Era Ledger judgment':'Cody-approved factual correction';
    const decision=WINDOW_RESOLUTIONS.has(row.fighter)
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
  report.allFourteenResolved=resolved.length===14&&report.missingJudgmentInputs.length===0;
  report.resolutions=resolved;

  window.UFC_CANONICAL_LONGEVITY_APPROVED_RESOLUTIONS={
    version:VERSION,applied:true,approvedBy:'Cody',approvedAt:'2026-07-14',resolvedCount:resolved.length,
    resolved,unresolved:report.unresolvedAfterApproval,allFourteenResolved:report.allFourteenResolved,
    mutatesScores:false,liveDataUnchanged:report.liveDataUnchanged,appliedAt:new Date().toISOString()
  };
  document.documentElement.setAttribute('data-canonical-longevity-approved-resolutions',VERSION);
})();
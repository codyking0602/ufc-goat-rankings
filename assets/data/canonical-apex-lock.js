// Final Cody-approved Apex Peak category lock.
// Shadow-only: certifies the reconstructed category without mutating live scores or ranking data.
(function(){
  'use strict';

  const VERSION='canonical-apex-lock-20260714a';
  const approved=window.UFC_CANONICAL_APEX_APPROVED_JUDGMENTS;
  const report=window.UFC_CANONICAL_APEX_RECONSTRUCTION;
  const fail=message=>{throw new Error(`[${VERSION}] ${message}`);};

  if(!approved?.rows)fail('Approved Apex judgment registry is missing.');
  if(!report?.applied)fail('Canonical Apex reconstruction report is missing.');
  if(approved.fighterCount!==36)fail(`Expected 36 approved judgments; found ${approved.fighterCount}.`);
  if(report.fighterCount!==73)fail(`Expected 73 audited fighters; found ${report.fighterCount}.`);
  if(report.missingAuditCount!==0)fail(`Missing Apex judgments remain: ${report.missingAuditCount}.`);
  if(report.selectionIssueFighterCount!==0)fail(`Selected-performance issues remain: ${report.selectionIssueFighterCount}.`);
  if(report.twentyFourMonthViolationCount!==0)fail(`24-month violations remain: ${report.twentyFourMonthViolationCount}.`);
  if(report.invalidSelectedPerformanceCount!==0)fail(`Invalid selected performances remain: ${report.invalidSelectedPerformanceCount}.`);
  if(report.formulaIssueFighterCount!==0)fail(`Component-formula issues remain: ${report.formulaIssueFighterCount}.`);
  if(report.liveDataUnchanged!==true)fail('Live ranking payload changed during shadow reconstruction.');
  if(approved.mutatesRankingData!==false||approved.mutatesScores!==false)fail('Approved registry must remain shadow-only.');

  window.UFC_CANONICAL_APEX_LOCK=Object.freeze({
    version:VERSION,
    status:'locked',
    locked:true,
    lockedAt:'2026-07-14',
    approvedBy:'Cody',
    category:'Apex Peak',
    scoreRange:Object.freeze({min:0,max:6}),
    formula:'Two-performance strength (ratings average / 10 × 2.00) + Proof (max 1.75) + Best-Fighter Claim (max 1.25) + Aura (max 1.00)',
    selectionRule:'Best two counted UFC wins no more than 24 months apart',
    approvedJudgmentCount:approved.fighterCount,
    fighterCount:report.fighterCount,
    approvedVersion:approved.version,
    reconstructionVersion:report.version,
    validation:Object.freeze({
      missingApexJudgments:report.missingAuditCount,
      selectedPerformanceIssues:report.selectionIssueFighterCount,
      twentyFourMonthViolations:report.twentyFourMonthViolationCount,
      invalidSelectedPerformances:report.invalidSelectedPerformanceCount,
      formulaIssues:report.formulaIssueFighterCount,
      liveDataUnchanged:report.liveDataUnchanged
    }),
    changePolicy:'Any future score, pair, rating, Proof, Best-Fighter Claim, Aura, maximum, formula, or selection-rule change requires Cody approval and a new lock version.',
    mutatesRankingData:false,
    mutatesScores:false
  });
})();

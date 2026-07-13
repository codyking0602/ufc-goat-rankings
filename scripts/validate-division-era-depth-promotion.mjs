import fs from 'node:fs/promises';

const report = JSON.parse(await fs.readFile('docs/division-era-depth-shadow-report.json', 'utf8'));
const review = JSON.parse(await fs.readFile('docs/division-era-depth-judgment-review.json', 'utf8'));
const feed = JSON.parse(await fs.readFile('assets/data/octagon-verdict-data.json', 'utf8'));
const expectedRosterCount = (feed.fighters || []).length;

const checks = {
  shadowSafe: report.mode === 'shadow-only' && report.mutatesLiveScores === false,
  rosterComplete: report.summary?.rosterCount === expectedRosterCount && report.summary?.coverageCount === expectedRosterCount,
  directCoverageComplete: report.summary?.directMatchCoverageCount === expectedRosterCount && report.summary?.fallbackCount === 0,
  aliasesComplete: report.summary?.aliasResolutionComplete === true,
  sourceFresh: report.source?.sourceFresh === true && report.promotionContract?.sourceFresh === true,
  womenFeatherweightSafe: report.summary?.womenFeatherweightTreatmentApplied === true
    && report.summary?.pureWomenFeatherweightZeroCount === 1
    && report.promotionContract?.womenFeatherweightSafe === true,
  promotionContractComplete: report.promotionContract?.directMatchCoverageComplete === true
    && report.promotionContract?.readyForJudgmentFinalization === true,
  judgmentSafe: review.mode === 'judgment-review-ready-for-live' && review.mutatesLiveScores === false,
  judgmentCoverageComplete: review.coverage?.rosterCount === expectedRosterCount
    && review.coverage?.reviewedCount === expectedRosterCount
    && review.coverage?.holdCount === 0,
  curvedApproved: review.formulaJudgment?.curvedTranslationApproved === true
    && review.formulaJudgment?.linearTranslationRejected === true,
  moverJudgmentApproved: review.formulaJudgment?.majorMoverJudgmentApproved === true,
  wfwJudgmentApproved: review.formulaJudgment?.womenFeatherweightTreatmentApproved === true,
  livePromotionApproved: review.promotionDecision?.readyForLivePromotion === true
    && (review.promotionDecision?.blockers || []).length === 0
};

const failed = Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name);
const summary = {
  reportVersion: report.version,
  reviewVersion: review.version,
  datasetEnd: report.source?.datasetEnd,
  modelDate: report.source?.modelDate,
  sourceFresh: report.source?.sourceFresh,
  rosterCount: report.summary?.rosterCount,
  directMatchCoverageCount: report.summary?.directMatchCoverageCount,
  fallbackCount: report.summary?.fallbackCount,
  womenFeatherweightAffectedCount: report.summary?.womenFeatherweightAffectedCount,
  pureWomenFeatherweightZeroCount: report.summary?.pureWomenFeatherweightZeroCount,
  readyForLivePromotion: review.promotionDecision?.readyForLivePromotion,
  blockers: review.promotionDecision?.blockers || [],
  checks,
  failed
};

console.log(JSON.stringify(summary, null, 2));
if (failed.length) process.exitCode = 1;

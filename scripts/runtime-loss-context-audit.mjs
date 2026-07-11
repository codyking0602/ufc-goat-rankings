// Runtime audit trigger: 2026-07-10 final closure verification.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import process from 'node:process';

const baseUrl = process.env.UFC_APP_URL || 'http://127.0.0.1:4173';
const outputPath = process.env.UFC_AUDIT_OUTPUT || 'artifacts/loss-context-runtime-report.json';

await fs.mkdir('artifacts', { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const consoleErrors = [];
const pageErrors = [];

page.on('console', message => {
  if (message.type() === 'error') consoleErrors.push(message.text());
});
page.on('pageerror', error => pageErrors.push(String(error?.stack || error)));

try {
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForFunction(() => window.UFC_SCORING_PIPELINE?.status === 'ready' || window.UFC_SCORING_PIPELINE?.status === 'error', null, { timeout: 120_000 });

  const result = await page.evaluate(async () => {
    try {
      await window.UFC_SCORING_PIPELINE_READY;
    } catch (_) {
      // The pipeline state below carries the actionable error.
    }

    const clone = value => JSON.parse(JSON.stringify(value ?? null));
    const report = clone(window.UFC_LOSS_CONTEXT_FINAL_RECONCILIATION);
    const pipeline = clone(window.UFC_SCORING_PIPELINE);
    const scoreReview = clone(window.UFC_LOSS_CONTEXT_SCORE_REVIEW);
    const postAudit = clone(window.UFC_LOSS_CONTEXT_MISMATCH_AUDIT);
    const finalizer = clone(window.UFC_LOSS_CONTEXT_LEDGER_FINALIZER);
    const men = (window.RANKING_DATA?.men || []).slice(0, 20).map(row => ({
      rank: row.rank,
      fighter: row.fighter,
      totalScore: row.totalScore,
      penalty: row.penalty,
      overallOvr: row.overallOvr
    }));
    const women = (window.RANKING_DATA?.women || []).map(row => ({
      rank: row.rank,
      fighter: row.fighter,
      totalScore: row.totalScore,
      penalty: row.penalty,
      overallOvr: row.overallOvr
    }));

    return { report, pipeline, scoreReview, postAudit, finalizer, menTop20: men, womenBoard: women };
  });

  const payload = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    ...result,
    browserDiagnostics: { consoleErrors, pageErrors }
  };

  await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const summary = {
    pipelineStatus: result.pipeline?.status ?? null,
    complete: result.report?.complete ?? false,
    rosterLedgerCoverage: result.report?.rosterLedgerCoverage ?? null,
    promotedCount: result.report?.scoreReview?.promotedCount ?? null,
    blockedCount: result.report?.scoreReview?.blockedCount ?? null,
    remainingFlaggedCount: result.report?.postPromotionAudit?.remainingFlaggedCount ?? null,
    remainingScoreMismatchCount: result.report?.postPromotionAudit?.remainingScoreMismatchCount ?? null,
    remainingLedgerBlockCount: result.report?.postPromotionAudit?.remainingLedgerBlockCount ?? null,
    missingLivePenaltyCount: result.report?.postPromotionAudit?.missingLivePenaltyCount ?? null,
    fightersWithRankMovement: result.report?.rankingImpact?.fightersWithRankMovement ?? null,
    consoleErrorCount: consoleErrors.length,
    pageErrorCount: pageErrors.length
  };

  console.log('LOSS_CONTEXT_RUNTIME_SUMMARY');
  console.log(JSON.stringify(summary, null, 2));
  console.log('PROMOTED_PENALTIES');
  console.log(JSON.stringify(result.report?.scoreReview?.promotedPenaltyChanges || [], null, 2));
  console.log('UNRESOLVED_ROWS');
  console.log(JSON.stringify(result.report?.postPromotionAudit?.unresolvedRows || [], null, 2));
  console.log('RANKING_MOVEMENT');
  console.log(JSON.stringify(result.report?.rankingImpact?.movement || [], null, 2));

  const failed = result.pipeline?.status !== 'ready'
    || result.report?.complete !== true
    || Number(result.report?.rosterLedgerCoverage || 0) !== 62
    || Number(result.report?.scoreReview?.blockedCount || 0) !== 0
    || Number(result.report?.postPromotionAudit?.remainingFlaggedCount || 0) !== 0
    || pageErrors.length > 0;

  if (failed) process.exitCode = 1;
} finally {
  await browser.close();
}

// Runtime audit trigger: 2026-07-10 final closure verification.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import process from 'node:process';

const baseUrl = process.env.UFC_APP_URL || 'http://127.0.0.1:4173';
const outputPath = process.env.UFC_AUDIT_OUTPUT || 'artifacts/loss-context-runtime-report.json';
const summaryPath = process.env.UFC_AUDIT_SUMMARY_OUTPUT || 'artifacts/loss-context-runtime-summary.json';

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
    const key = name => String(name || '').trim().toLowerCase().replace(/[’‘`´]/g, "'").replace(/\s+/g, ' ');
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
    const focusNames = [
      'Randy Couture', "Sean O'Malley", 'Charles Oliveira', 'Israel Adesanya',
      'Henry Cejudo', 'Amanda Nunes', 'Sean Strickland', 'Robert Whittaker',
      'Dan Henderson', 'Alex Pereira', 'Valentina Shevchenko'
    ];
    const allDataRows = [
      ...(window.RANKING_DATA?.men || []),
      ...(window.RANKING_DATA?.women || []),
      ...(window.RANKING_DATA?.fighters || [])
    ];
    const focusDiagnostics = focusNames.map(fighter => {
      const target = key(fighter);
      const dataRows = allDataRows.filter(row => key(row?.fighter) === target).map(row => ({
        fighter: row.fighter,
        leaderboard: row.leaderboard || null,
        ufcRecord: row.ufcRecord || null,
        record: row.record || null,
        ufcLosses: row.ufcLosses ?? null,
        penalty: row.penalty ?? null,
        rank: row.rank ?? null
      }));
      const packet = Object.entries(window.UFC_FIGHTER_PACKETS || {}).find(([name]) => key(name) === target)?.[1] || null;
      const override = typeof DISPLAY_OVERRIDES !== 'undefined'
        ? Object.entries(DISPLAY_OVERRIDES || {}).find(([name]) => key(name) === target)?.[1] || null
        : null;
      const auditRow = (window.UFC_LOSS_CONTEXT_MISMATCH_AUDIT?.rows || []).find(row => key(row?.fighter) === target) || null;
      const eraEntry = window.UFC_FIGHTER_ERA_LEDGERS?.entryFor?.(fighter)
        || Object.entries(window.UFC_FIGHTER_ERA_LEDGERS?.ledgers || {}).find(([name]) => key(name) === target)?.[1]
        || null;
      return {
        fighter,
        dataRows,
        packetRecord: packet?.profileStats?.ufcRecord || packet?.boardRow?.ufcRecord || packet?.profile?.ufcRecord || null,
        overrideRecord: override?.packetProfileStats?.ufcRecord || override?.snapshotStats?.ufcRecord || null,
        audit: auditRow ? {
          status: auditRow.status,
          ufcRecord: auditRow.ufcRecord,
          officialUfcLosses: auditRow.officialUfcLosses,
          officialLossExceptionCount: auditRow.officialLossExceptionCount,
          effectiveExpectedLosses: auditRow.effectiveExpectedLosses,
          machineReadableLossEvents: auditRow.machineReadableLossEvents,
          missingLossEvents: auditRow.missingLossEvents,
          excessLossEvents: auditRow.excessLossEvents,
          livePenalty: auditRow.livePenalty,
          cappedLedgerEstimate: auditRow.cappedLedgerEstimate,
          reviewReasons: auditRow.reviewReasons,
          events: (auditRow.events || []).map(event => ({
            label: event.label,
            date: event.date,
            sourceType: event.sourceType,
            phase: event.phase,
            quality: event.quality,
            finished: event.finished,
            upwardDivision: event.upwardDivision,
            isLoss: event.isLoss,
            exception: event.exception,
            penaltyEstimate: event.penaltyEstimate
          }))
        } : null,
        eraWindow: eraEntry?.window || null,
        completion: eraEntry?.lossContextCompletion || null
      };
    });

    return { report, pipeline, scoreReview, postAudit, finalizer, menTop20: men, womenBoard: women, focusDiagnostics };
  });

  const payload = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    ...result,
    browserDiagnostics: { consoleErrors, pageErrors }
  };

  await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const summary = {
    generatedAt: payload.generatedAt,
    pipelineStatus: result.pipeline?.status ?? null,
    pipelineError: result.pipeline?.error ?? null,
    complete: result.report?.complete ?? false,
    rosterLedgerCoverage: result.report?.rosterLedgerCoverage ?? null,
    promotedCount: result.report?.scoreReview?.promotedCount ?? null,
    blockedCount: result.report?.scoreReview?.blockedCount ?? null,
    remainingFlaggedCount: result.report?.postPromotionAudit?.remainingFlaggedCount ?? null,
    remainingScoreMismatchCount: result.report?.postPromotionAudit?.remainingScoreMismatchCount ?? null,
    remainingLedgerBlockCount: result.report?.postPromotionAudit?.remainingLedgerBlockCount ?? null,
    missingLivePenaltyCount: result.report?.postPromotionAudit?.missingLivePenaltyCount ?? null,
    fightersWithRankMovement: result.report?.rankingImpact?.fightersWithRankMovement ?? null,
    ledgerFinalizer: result.report?.ledgerFinalizer ?? null,
    promotedPenaltyChanges: result.report?.scoreReview?.promotedPenaltyChanges || [],
    unresolvedRows: result.report?.postPromotionAudit?.unresolvedRows || [],
    rankingMovement: result.report?.rankingImpact?.movement || [],
    menTop20: result.menTop20,
    womenBoard: result.womenBoard,
    focusDiagnostics: result.focusDiagnostics,
    browserDiagnostics: { consoleErrors, pageErrors }
  };
  await fs.writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');

  console.log('LOSS_CONTEXT_RUNTIME_SUMMARY');
  console.log(JSON.stringify({
    pipelineStatus: summary.pipelineStatus,
    complete: summary.complete,
    rosterLedgerCoverage: summary.rosterLedgerCoverage,
    promotedCount: summary.promotedCount,
    blockedCount: summary.blockedCount,
    remainingFlaggedCount: summary.remainingFlaggedCount,
    fightersWithRankMovement: summary.fightersWithRankMovement,
    consoleErrorCount: consoleErrors.length,
    pageErrorCount: pageErrors.length
  }, null, 2));
  console.log('UNRESOLVED_ROWS');
  console.log(JSON.stringify(summary.unresolvedRows, null, 2));

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

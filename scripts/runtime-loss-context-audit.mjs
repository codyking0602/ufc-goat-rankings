// Runtime audit trigger: hybrid Loss Context full-roster verification.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import process from 'node:process';

const baseUrl = process.env.UFC_APP_URL || 'http://127.0.0.1:4173';
const outputPath = process.env.UFC_AUDIT_OUTPUT || 'artifacts/loss-context-runtime-report.json';
const summaryPath = process.env.UFC_AUDIT_SUMMARY_OUTPUT || 'artifacts/loss-context-runtime-summary.json';
const judgmentPath = process.env.UFC_AUDIT_JUDGMENT_OUTPUT || 'artifacts/loss-context-hybrid-judgment-review.json';

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

    const waitForHybridAudit = async () => {
      const started = Date.now();
      while (!window.UFC_LOSS_CONTEXT_HYBRID_AUDIT?.applied && Date.now() - started < 30_000) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    };
    await waitForHybridAudit();

    const clone = value => JSON.parse(JSON.stringify(value ?? null));
    const key = name => String(name || '').trim().toLowerCase().replace(/[’‘`´]/g, "'").replace(/\s+/g, ' ');
    const report = clone(window.UFC_LOSS_CONTEXT_FINAL_RECONCILIATION);
    const pipeline = clone(window.UFC_SCORING_PIPELINE);
    const scoreReview = clone(window.UFC_LOSS_CONTEXT_SCORE_REVIEW);
    const postAudit = clone(window.UFC_LOSS_CONTEXT_MISMATCH_AUDIT);
    const finalizer = clone(window.UFC_LOSS_CONTEXT_LEDGER_FINALIZER);
    const hybridShadow = clone(window.UFC_LOSS_CONTEXT_HYBRID_SHADOW);
    const hybridAudit = clone(window.UFC_LOSS_CONTEXT_HYBRID_AUDIT);
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
      'Dricus du Plessis', 'Justin Gaethje', 'Randy Couture', "Sean O'Malley", 'Charles Oliveira', 'Israel Adesanya',
      'Henry Cejudo', 'Amanda Nunes', 'Sean Strickland', 'Robert Whittaker',
      'Dan Henderson', 'Alex Pereira', 'Valentina Shevchenko', 'Max Holloway',
      'Jose Aldo', 'Georges St-Pierre', 'Anderson Silva', 'Jon Jones'
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
      const hybridEntry = window.UFC_LOSS_CONTEXT_HYBRID_SHADOW?.entryFor?.(fighter)
        || (window.UFC_LOSS_CONTEXT_HYBRID_SHADOW?.results || []).find(row => key(row?.fighter) === target)
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
        hybrid: hybridEntry ? {
          status: hybridEntry.status,
          currentPenalty: hybridEntry.currentPenalty,
          recommendedPenalty: hybridEntry.recommendedPenalty,
          projectedDelta: hybridEntry.projectedDelta,
          severity: hybridEntry.severity,
          frequency: hybridEntry.frequency,
          hybridBase: hybridEntry.hybridBase,
          primeLossCount: hybridEntry.primeLossCount,
          primeFinishCount: hybridEntry.primeFinishCount,
          primeVolumeFloor: hybridEntry.primeVolumeFloor,
          primeVolumeFloorApplied: hybridEntry.primeVolumeFloorApplied,
          preDivision: hybridEntry.preDivision,
          divisionMultiplier: hybridEntry.divisionMultiplier,
          divisionDiscountPct: hybridEntry.divisionDiscountPct,
          divisionPointsSaved: hybridEntry.divisionPointsSaved,
          exposure: hybridEntry.exposure,
          exposureWindowEnd: hybridEntry.exposureWindowEnd,
          excludedPostPrimeFightCount: hybridEntry.excludedPostPrimeFightCount,
          eventCount: hybridEntry.eventCount,
          worstLosses: hybridEntry.worstLosses,
          projectedRank: hybridEntry.projectedRank,
          rankMovement: hybridEntry.rankMovement,
          blockers: hybridEntry.blockers
        } : null,
        eraWindow: eraEntry?.window || null,
        completion: eraEntry?.lossContextCompletion || null
      };
    });

    return { report, pipeline, scoreReview, postAudit, finalizer, hybridShadow, hybridAudit, menTop20: men, womenBoard: women, focusDiagnostics };
  });

  const payload = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    ...result,
    browserDiagnostics: { consoleErrors, pageErrors }
  };

  await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const compactJudgmentRows = (result.hybridAudit?.judgmentReview || []).map(row => ({
    fighter: row.fighter,
    board: row.board,
    currentRank: row.currentRank,
    projectedRank: row.projectedRank,
    rankMovement: row.rankMovement,
    currentPenalty: row.currentPenalty,
    recommendedPenalty: row.recommendedPenalty,
    projectedDelta: row.projectedDelta,
    currentTotal: row.currentTotal,
    projectedTotal: row.projectedTotal,
    severity: row.severity,
    frequency: row.frequency,
    hybridBase: row.hybridBase,
    primeLossCount: row.primeLossCount,
    primeFinishCount: row.primeFinishCount,
    primeVolumeFloor: row.primeVolumeFloor,
    primeVolumeFloorApplied: row.primeVolumeFloorApplied,
    exposure: row.exposure,
    divisionMultiplier: row.divisionMultiplier,
    divisionDiscountPct: row.divisionDiscountPct,
    divisionPointsSaved: row.divisionPointsSaved,
    worstLosses: row.worstLosses || []
  }));

  const judgmentReview = {
    generatedAt: payload.generatedAt,
    shadowVersion: result.hybridShadow?.version ?? null,
    auditVersion: result.hybridAudit?.version ?? null,
    readyForLivePromotion: result.hybridAudit?.readyForLivePromotion ?? false,
    criticalFlags: result.hybridAudit?.criticalFlags || [],
    summary: result.hybridAudit?.summary ?? null,
    rules: result.hybridShadow?.rules ?? null,
    fighters: compactJudgmentRows
  };
  await fs.writeFile(judgmentPath, `${JSON.stringify(judgmentReview, null, 2)}\n`, 'utf8');

  const summary = {
    generatedAt: payload.generatedAt,
    pipelineStatus: result.pipeline?.status ?? null,
    pipelineError: result.pipeline?.error ?? null,
    complete: result.report?.complete ?? false,
    rosterLedgerCoverage: result.report?.rosterLedgerCoverage ?? null,
    rosterTarget: result.report?.rosterTarget ?? result.finalizer?.expectedRosterCount ?? null,
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
    hybrid: {
      applied: result.hybridAudit?.applied ?? false,
      shadowVersion: result.hybridShadow?.version ?? null,
      auditVersion: result.hybridAudit?.version ?? null,
      summary: result.hybridAudit?.summary ?? null,
      readyForLivePromotion: result.hybridAudit?.readyForLivePromotion ?? false,
      criticalFlags: result.hybridAudit?.criticalFlags || [],
      judgmentReview: compactJudgmentRows,
      largestRelief: result.hybridAudit?.largestRelief || [],
      harshestProjected: result.hybridAudit?.harshestProjected || [],
      biggestRankMovers: result.hybridAudit?.biggestRankMovers || [],
      spotlight: result.hybridAudit?.spotlight || [],
      flags: result.hybridAudit?.flags || {}
    },
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
    rosterTarget: summary.rosterTarget,
    promotedCount: summary.promotedCount,
    blockedCount: summary.blockedCount,
    remainingFlaggedCount: summary.remainingFlaggedCount,
    fightersWithRankMovement: summary.fightersWithRankMovement,
    hybridApplied: summary.hybrid.applied,
    hybridCoverageComplete: summary.hybrid.summary?.coverageComplete ?? false,
    hybridCriticalFlagCount: summary.hybrid.summary?.criticalFlagCount ?? null,
    hybridJudgmentReviewCount: compactJudgmentRows.length,
    hybridReadyForLivePromotion: summary.hybrid.readyForLivePromotion,
    consoleErrorCount: consoleErrors.length,
    pageErrorCount: pageErrors.length
  }, null, 2));
  console.log('HYBRID_CRITICAL_FLAGS');
  console.log(JSON.stringify(summary.hybrid.criticalFlags, null, 2));

  const expectedRoster = Number(summary.rosterTarget || summary.rosterLedgerCoverage || 0);
  const failed = result.pipeline?.status !== 'ready'
    || result.report?.complete !== true
    || Number(result.report?.rosterLedgerCoverage || 0) !== expectedRoster
    || Number(result.report?.scoreReview?.blockedCount || 0) !== 0
    || Number(result.report?.postPromotionAudit?.remainingFlaggedCount || 0) !== 0
    || result.hybridAudit?.applied !== true
    || result.hybridAudit?.summary?.coverageComplete !== true
    || pageErrors.length > 0;

  if (failed) process.exitCode = 1;
} finally {
  await browser.close();
}
// Runtime audit: canonical pipeline plus judgment-approved live hybrid Loss Context verification.
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

    const waitFor = async predicate => {
      const started = Date.now();
      while (!predicate() && Date.now() - started < 30_000) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    };
    await waitFor(() => window.UFC_LOSS_CONTEXT_HYBRID_AUDIT?.applied === true);
    await waitFor(() => window.UFC_LOSS_CONTEXT_HYBRID_LIVE?.applied === true);

    const clone = value => JSON.parse(JSON.stringify(value ?? null));
    const key = name => String(name || '').trim().toLowerCase().replace(/[’‘`´]/g, "'").replace(/\s+/g, ' ');
    const report = clone(window.UFC_LOSS_CONTEXT_FINAL_RECONCILIATION);
    const pipeline = clone(window.UFC_SCORING_PIPELINE);
    const scoreReview = clone(window.UFC_LOSS_CONTEXT_SCORE_REVIEW);
    const postAudit = clone(window.UFC_LOSS_CONTEXT_MISMATCH_AUDIT);
    const finalizer = clone(window.UFC_LOSS_CONTEXT_LEDGER_FINALIZER);
    const hybridShadow = clone(window.UFC_LOSS_CONTEXT_HYBRID_SHADOW);
    const hybridAudit = clone(window.UFC_LOSS_CONTEXT_HYBRID_AUDIT);
    const hybridLive = clone(window.UFC_LOSS_CONTEXT_HYBRID_LIVE);
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

    const allBoardRows = [...(window.RANKING_DATA?.men || []), ...(window.RANKING_DATA?.women || [])];
    const profiles = window.RANKING_DATA?.fighters || [];
    const shadowByKey = new Map((window.UFC_LOSS_CONTEXT_HYBRID_SHADOW?.scored || []).map(row => [key(row.fighter), row]));
    const boardPenaltyMismatches = allBoardRows.filter(row => Math.abs(Number(row.penalty) - Number(shadowByKey.get(key(row.fighter))?.recommendedPenalty)) > 0.001).map(row => row.fighter);
    const profilePenaltyMismatches = profiles.filter(profile => {
      const board = allBoardRows.find(row => key(row.fighter) === key(profile.fighter));
      return board && Math.abs(Number(profile.penalty) - Number(board.penalty)) > 0.001;
    }).map(row => row.fighter);
    const overrideMismatches = allBoardRows.filter(row => {
      const override = window.DISPLAY_OVERRIDES?.[row.fighter] || {};
      return Number(override.allTimeRank) !== Number(row.rank) || Number(override.overallOvr) !== Number(row.overallOvr);
    }).map(row => row.fighter);

    const focusNames = [
      'Dricus du Plessis', 'Justin Gaethje', 'Randy Couture', "Sean O'Malley", 'Charles Oliveira', 'Israel Adesanya',
      'Henry Cejudo', 'Amanda Nunes', 'Sean Strickland', 'Robert Whittaker',
      'Dan Henderson', 'Alex Pereira', 'Valentina Shevchenko', 'Max Holloway',
      'Jose Aldo', 'Georges St-Pierre', 'Anderson Silva', 'Jon Jones'
    ];
    const allDataRows = [...allBoardRows, ...profiles];
    const focusDiagnostics = focusNames.map(fighter => {
      const target = key(fighter);
      const dataRows = allDataRows.filter(row => key(row?.fighter) === target).map(row => ({
        fighter: row.fighter,
        leaderboard: row.leaderboard || null,
        ufcRecord: row.ufcRecord || null,
        record: row.record || null,
        ufcLosses: row.ufcLosses ?? null,
        penalty: row.penalty ?? null,
        totalScore: row.totalScore ?? null,
        overallOvr: row.overallOvr ?? null,
        rank: row.rank ?? null
      }));
      const packet = Object.entries(window.UFC_FIGHTER_PACKETS || {}).find(([name]) => key(name) === target)?.[1] || null;
      const override = Object.entries(window.DISPLAY_OVERRIDES || {}).find(([name]) => key(name) === target)?.[1] || null;
      const auditRow = (window.UFC_LOSS_CONTEXT_MISMATCH_AUDIT?.rows || []).find(row => key(row?.fighter) === target) || null;
      const eraEntry = window.UFC_FIGHTER_ERA_LEDGERS?.entryFor?.(fighter)
        || Object.entries(window.UFC_FIGHTER_ERA_LEDGERS?.ledgers || {}).find(([name]) => key(name) === target)?.[1]
        || null;
      const hybridEntry = window.UFC_LOSS_CONTEXT_HYBRID_SHADOW?.entryFor?.(fighter)
        || (window.UFC_LOSS_CONTEXT_HYBRID_SHADOW?.results || []).find(row => key(row?.fighter) === target)
        || null;
      const liveEntry = window.UFC_LOSS_CONTEXT_HYBRID_LIVE?.entryFor?.(fighter)
        || allBoardRows.find(row => key(row?.fighter) === target)
        || null;
      return {
        fighter,
        dataRows,
        packetRecord: packet?.profileStats?.ufcRecord || packet?.boardRow?.ufcRecord || packet?.profile?.ufcRecord || null,
        overrideRecord: override?.packetProfileStats?.ufcRecord || override?.snapshotStats?.ufcRecord || null,
        displayRank: override?.allTimeRank ?? null,
        displayOvr: override?.overallOvr ?? null,
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
        live: liveEntry ? {
          penalty: liveEntry.penalty,
          totalScore: liveEntry.totalScore,
          rank: liveEntry.rank,
          overallOvr: liveEntry.overallOvr,
          lossContextHybrid: liveEntry.lossContextHybrid || null
        } : null,
        eraWindow: eraEntry?.window || null,
        completion: eraEntry?.lossContextCompletion || null
      };
    });

    let profileSurface = { rendered: false, hasLiveLossContext: false, hasRank: false, hasOvr: false, text: '' };
    if (typeof window.openFighter === 'function') {
      window.openFighter('Justin Gaethje');
      document.querySelector('#fighterDetail .category-card[data-category="penalty"]')?.click();
      await new Promise(resolve => setTimeout(resolve, 100));
      const text = document.getElementById('fighterDetail')?.innerText || '';
      const gaethje = allBoardRows.find(row => key(row.fighter) === key('Justin Gaethje'));
      profileSurface = {
        rendered: text.includes('Justin Gaethje'),
        hasLiveLossContext: text.includes(Number(gaethje?.penalty).toFixed(2)) && text.includes('Worst-loss severity'),
        hasRank: text.includes(`#${gaethje?.rank}`),
        hasOvr: text.includes(`${gaethje?.overallOvr}`),
        text: text.slice(0, 2500)
      };
    }

    let compareSurface = { rendered: false, hasGaethje: false, hasDricus: false, hasLiveRanks: false, text: '' };
    if (document.getElementById('fighterA') && document.getElementById('fighterB') && typeof window.renderCompare === 'function') {
      document.getElementById('fighterA').value = 'Justin Gaethje';
      document.getElementById('fighterB').value = 'Dricus du Plessis';
      window.renderCompare();
      const text = document.getElementById('compareResult')?.innerText || '';
      const gaethje = allBoardRows.find(row => key(row.fighter) === key('Justin Gaethje'));
      const dricus = allBoardRows.find(row => key(row.fighter) === key('Dricus du Plessis'));
      compareSurface = {
        rendered: text.length > 0,
        hasGaethje: text.includes('Justin Gaethje'),
        hasDricus: text.includes('Dricus du Plessis'),
        hasLiveRanks: text.includes(`#${gaethje?.rank}`) && text.includes(`#${dricus?.rank}`),
        text: text.slice(0, 2000)
      };
    }

    return {
      report,
      pipeline,
      scoreReview,
      postAudit,
      finalizer,
      hybridShadow,
      hybridAudit,
      hybridLive,
      liveConsistency: {
        rosterCount: allBoardRows.length,
        boardPenaltyMismatchCount: boardPenaltyMismatches.length,
        boardPenaltyMismatches,
        profilePenaltyMismatchCount: profilePenaltyMismatches.length,
        profilePenaltyMismatches,
        overrideMismatchCount: overrideMismatches.length,
        overrideMismatches
      },
      profileSurface,
      compareSurface,
      menTop20: men,
      womenBoard: women,
      focusDiagnostics
    };
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
    liveVersion: result.hybridLive?.version ?? null,
    readyForLivePromotion: result.hybridAudit?.readyForLivePromotion ?? false,
    liveApplied: result.hybridLive?.applied ?? false,
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
      flags: result.hybridAudit?.flags || {},
      live: result.hybridLive || null
    },
    liveConsistency: result.liveConsistency,
    profileSurface: result.profileSurface,
    compareSurface: result.compareSurface,
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
    canonicalPromotedCount: summary.promotedCount,
    blockedCount: summary.blockedCount,
    remainingFlaggedCount: summary.remainingFlaggedCount,
    hybridAuditApplied: summary.hybrid.applied,
    hybridCoverageComplete: summary.hybrid.summary?.coverageComplete ?? false,
    hybridCriticalFlagCount: summary.hybrid.summary?.criticalFlagCount ?? null,
    hybridJudgmentApproved: summary.hybrid.summary?.judgmentApproved ?? false,
    hybridLiveApplied: summary.hybrid.live?.applied ?? false,
    hybridLivePromotedCount: summary.hybrid.live?.promotedCount ?? null,
    hybridLiveMismatchCount: summary.hybrid.live?.mismatchCount ?? null,
    boardPenaltyMismatchCount: summary.liveConsistency?.boardPenaltyMismatchCount ?? null,
    profilePenaltyMismatchCount: summary.liveConsistency?.profilePenaltyMismatchCount ?? null,
    overrideMismatchCount: summary.liveConsistency?.overrideMismatchCount ?? null,
    profileSurfacePassed: Boolean(summary.profileSurface?.rendered && summary.profileSurface?.hasLiveLossContext && summary.profileSurface?.hasRank && summary.profileSurface?.hasOvr),
    compareSurfacePassed: Boolean(summary.compareSurface?.rendered && summary.compareSurface?.hasGaethje && summary.compareSurface?.hasDricus && summary.compareSurface?.hasLiveRanks),
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
    || result.hybridAudit?.summary?.judgmentApproved !== true
    || result.hybridLive?.applied !== true
    || Number(result.hybridLive?.promotedCount || 0) !== expectedRoster
    || Number(result.hybridLive?.mismatchCount || 0) !== 0
    || Number(result.liveConsistency?.boardPenaltyMismatchCount || 0) !== 0
    || Number(result.liveConsistency?.profilePenaltyMismatchCount || 0) !== 0
    || Number(result.liveConsistency?.overrideMismatchCount || 0) !== 0
    || result.profileSurface?.rendered !== true
    || result.profileSurface?.hasLiveLossContext !== true
    || result.profileSurface?.hasRank !== true
    || result.profileSurface?.hasOvr !== true
    || result.compareSurface?.rendered !== true
    || result.compareSurface?.hasGaethje !== true
    || result.compareSurface?.hasDricus !== true
    || result.compareSurface?.hasLiveRanks !== true
    || pageErrors.length > 0;

  if (failed) process.exitCode = 1;
} finally {
  await browser.close();
}
// Mechanical canonical category completions for Leon Edwards.
// Shadow-only: augments category reconstruction reports; never writes live scores, totals, ranks, OVRs, profiles, or Compare Mode.
(function(){
  'use strict';

  const VERSION='canonical-leon-final-category-completions-20260714a';
  const FIGHTER='Leon Edwards';
  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');

  const opponentQuality=Object.freeze({
    fighter:FIGHTER,
    board:'men',
    currentScore:null,
    reconstructedScore:21.01,
    difference:null,
    scoreStatus:'factual-completion-no-frozen-control',
    classification:'factual completion from canonical reviewed opponent tiers and locked diminishing returns',
    canonicalWinCount:14,
    inputCount:14,
    legacyRowCount:0,
    canonicalFallbackCount:14,
    explicitApprovedJudgmentCount:0,
    recoveredLegacyJudgmentCount:0,
    removedLegacyRowCount:0,
    duplicateInputFightIds:Object.freeze([]),
    missingInputFightIds:Object.freeze([]),
    rawCredit:11.4,
    preAdjustmentDiminishedCredit:9.875,
    fighterAdjustment:0,
    diminishedCredit:9.875,
    benchmarkCredit:14.1,
    topFiveWins:4,
    championLevelWins:2,
    rankedQualityWins:11,
    inputs:Object.freeze([]),
    removedLegacyRows:Object.freeze([]),
    notices:Object.freeze([{classification:'factual completion',reason:'All 14 counted UFC wins use the already-reviewed canonical opponent quality tiers; no fighter adjustment or manual score override is applied.'}]),
    provenance:'canonical UFC fight facts + reviewed opponentContext quality tiers + locked Opponent Quality formula'
  });

  const primeDominance=Object.freeze({
    fighter:FIGHTER,
    board:'men',
    currentScore:null,
    reconstructedScore:16.4,
    difference:null,
    legacyCanonicalScore:null,
    legacyDifference:null,
    classification:'factual completion under the Cody-approved 9/9/5/7 formula and full-sample lock',
    currentControlSource:'mechanical-factual-completion',
    primeWindowSource:'fighter-era-ledgers',
    legacyJudgmentSource:'none; canonical facts and locked formula only',
    formerLegacyEliteStakes:null,
    stats:Object.freeze({
      windowValid:true,
      windowSource:'fighter-era-ledgers',
      eraStartDate:'2019-07-20',
      eraStartLabel:'Rafael dos Anjos',
      eraEndDate:'2025-03-22',
      eraEndLabel:'Sean Brady',
      eraEndType:'unrecovered-prime-loss',
      open:false,
      eraLedgerDrift:true,
      primeFightCount:8,
      scoredFightCount:7,
      wins:5,
      losses:2,
      draws:0,
      noContests:1,
      technicalExceptions:0,
      recordText:'5-2, 1 NC',
      recordPct:71.43,
      roundsWon:19,
      roundsLost:15,
      roundsDrawn:0,
      effectiveRoundsWon:19,
      roundsCounted:34,
      roundControlPct:55.88,
      missingRoundRows:Object.freeze([]),
      finishWins:1,
      finishPressurePct:14.29,
      stoppageLosses:1,
      components:Object.freeze({primeRecord:6.43,roundControl:5.03,finishPressure:.5,eliteLevelValidation:4.44}),
      rawScore:16.4,
      sampleMultiplier:1,
      samplePercent:100,
      score:16.4,
      eliteLevelValidation:Object.freeze({fightCount:6,wins:4,losses:2,draws:0,resultRate:66.67,roundsWon:15,roundsLost:14,roundsDrawn:0,roundControlRate:51.72,finishWins:1,finishRate:16.67,missingRoundRows:Object.freeze([]),volumeScore:2.25,performanceScore:2.19,performanceBreakdown:Object.freeze({result:1.33,roundControl:.78,finishPressure:.08}),score:4.44})
    }),
    issues:Object.freeze([{classification:'factual completion',reason:'The Sean Brady round audit closes the only missing input; the approved shared Era Ledger and locked formula now calculate 16.40/30 without manual adjustment.'}]),
    provenance:'shared Fighter Era Ledger + canonical UFC fight facts + audited rounds + locked Prime Dominance formula'
  });

  function install(report,entry){
    if(!report?.applied)return false;
    const originalEntryFor=report.entryFor;
    const existing=typeof originalEntryFor==='function'?originalEntryFor(FIGHTER):null;
    if(existing)return true;
    const originalFighters=Array.isArray(report.fighters)?report.fighters.slice():[];
    report.fighters=[...originalFighters,entry].sort((a,b)=>Number(b.reconstructedScore||0)-Number(a.reconstructedScore||0)||String(a.fighter).localeCompare(String(b.fighter)));
    report.fighterCount=report.fighters.length;
    if(Array.isArray(report.excludedFighters))report.excludedFighters=report.excludedFighters.filter(name=>key(name)!==key(FIGHTER));
    report.entryFor=fighter=>key(fighter)===key(FIGHTER)?entry:(typeof originalEntryFor==='function'?originalEntryFor(fighter):null);
    return true;
  }

  const opponentQualityInstalled=install(window.UFC_CANONICAL_OPPONENT_QUALITY_RECONSTRUCTION,opponentQuality);
  const primeDominanceInstalled=install(window.UFC_CANONICAL_PRIME_DOMINANCE_RECONSTRUCTION,primeDominance);

  window.UFC_CANONICAL_LEON_FINAL_CATEGORY_COMPLETIONS=Object.freeze({
    version:VERSION,
    fighter:FIGHTER,
    opponentQuality,
    primeDominance,
    opponentQualityInstalled,
    primeDominanceInstalled,
    championshipPendingApproval:true,
    mutatesFightFacts:false,
    mutatesRankingData:false,
    mutatesScores:false,
    mutatesRanks:false,
    mutatesOvr:false
  });
})();

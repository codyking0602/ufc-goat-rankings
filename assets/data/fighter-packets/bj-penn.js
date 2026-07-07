// Do not add new fighter data here.
// LEGACY: fighter data has been migrated to assets/data/ranking-data.js.
// B.J. Penn fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-bj-penn-20260702b';
  const fighter = 'B.J. Penn';

  const packet = {
    status: { stage: 'packet live; Watch Moment added', lastUpdated: '2026-07-02', nextFix: 'None for BJ Watch Moment.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/bj-penn.js', displayFallback: 'assets/data/display-overrides.js', compareFallback: 'assets/compare-coverage-pack-1.js', watchFallback: 'assets/data/fighter-packets/bj-penn.js', photos: 'assets/fighters/bj-penn.webp and assets/fighters/bj-penn-thumb.webp' },
    photos: { photoUrl: 'assets/fighters/bj-penn.webp', thumbUrl: 'assets/fighters/bj-penn-thumb.webp' },
    display: {
      overallOvr: 85, allTimeRank: 18, divisionLabel: 'LW / WW', resumeTag: 'Two-division skill legend',
      oneLiner: 'The brilliant-but-messy skill case: lightweight gold, the Hughes welterweight upset, elite talent, and a late record collapse that drags the resume down.',
      categories: { championship: { ovr: 80, rank: 16 }, opponentQuality: { ovr: 84, rank: 14 }, primeDominance: { ovr: 82, rank: 32 }, longevity: { ovr: 86, rank: 14 } },
      snapshot: [ ['UFC Record', '12-13-2'], ['UFC Title-Fight Wins', '5'], ['Championship Level', 'Two-Division UFC Champion'], ['Quality Wins', 'Hughes and LW Title Run'], ['Prime Record', 'Brilliant but Messy'], ['Active Elite Years', '6.0 Elite Years'], ['Loss Context', 'Late-career collapse heavily damages record'] ],
      whyRankedHere: 'Penn ranks here because the high-end UFC case is still real: lightweight champion, welterweight champion, the Hughes upset, and a peak skill set that was ahead of its time.',
      whyNotHigher: 'He does not rank higher because the late-career record collapse is too damaging, and the active elite window is not deep enough to offset the loss drag against cleaner champions.',
      keyJudgmentCalls: [ ['Two-division value', 'lightweight and welterweight gold are central to the case.'], ['Hughes upset', 'one of the biggest high-end wins in the profile.'], ['Late losses', 'do not erase the peak, but they drag the UFC-only resume hard.'], ['Non-UFC context', 'historical context only; the ranking is UFC-only.'], ['Skill vs resume', 'his skill reputation is higher than the clean résumé score.'] ],
      finalTakeaway: 'Penn is a real two-division skill legend, but the UFC-only score has to balance the brilliant peak against one of the messiest late-career records in the ranking.'
    },
    profileStats: { ufcRecord: '12-13-2', titleFightWins: 5, eliteWins: 7, primeRecord: '8-5-1', finishRatePct: 58.3, roundsWonPct: 61.8, activeEliteYears: 6.0, timesFinishedPrime: 2, divisionStrengthContext: 'Lightweight title value and the Hughes welterweight upset both matter; non-UFC achievements are context only.', lossContext: 'Late-career losses create major drag and keep the case below cleaner champions.' },
    compareSeasoning: {
      shortCase: 'BJ Penn is the skill-and-two-division legacy case: lightweight champion, welterweight title upset over Hughes, elite talent, and a messy late record that drags the score down.',
      peak: 'At his best, Penn was boxing, takedown defense, jiu-jitsu, balance, and natural fighting instinct. His peak skill level was much cleaner than his final record suggests.',
      resume: 'Penn’s UFC case has huge highs and ugly lows. The Hughes win and lightweight title run are real all-time material, but the late-career losses are impossible to ignore.',
      championship: 'The championship case is strong because Penn won UFC titles at lightweight and welterweight, then defended lightweight gold during one of the division’s defining early runs.',
      opponentQuality: 'Hughes twice, Sherk, Florian, Sanchez, Stevenson, Pulver, and Uno give Penn real UFC value, with GSP and Hughes rivalry context shaping the case.',
      longevity: 'Penn’s true elite window was shorter than his calendar career. The later years should not inflate him; they mostly explain why the record looks so damaged.',
      counter: 'Penn’s argument is peak skill and two-division greatness. The argument against him is the record collapse and too many damaging losses after the best years.',
      edge: 'Penn wins comparisons when peak skill, lightweight title value, and the Hughes upset outweigh a messy career arc.',
      eliteCounter: true,
      signatureWins: 'Hughes twice, Sherk, Florian, Sanchez, Stevenson, Pulver, and Uno give Penn a real UFC-only win list, even without using non-UFC achievements as scoring value.',
      weakness: 'The late-career collapse is the obvious drag and keeps the ranking from matching the peak-skill reputation.',
      titleSummary: 'Penn won UFC titles at lightweight and welterweight, with the Hughes upset and lightweight defenses carrying most of the championship value.',
      primeSummary: 'His best UFC years were brilliant but not long enough to erase the late-career collapse.',
      titleStyle: 'Two-Division Skill Champion', primeStyle: 'Brilliant But Messy Prime',
      legacyStats: { ufcRecord: '12-13-2', titleFightWins: 5, beltsWon: 2, titleDefenses: 3, activeEliteYearsLabel: 'roughly 6 active elite years', primeNote: 'brilliant lightweight and welterweight peak with a late-career collapse that hurts the overall case' }
    },
    watchMoment: { url: 'https://youtube.com/shorts/FfBpWXo-EWo?is=4SrvWa7ntRkx5Bia', label: 'Watch Moment' }
  };
  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}), ...(packet.photos || {}) }; if(packet.watchMoment?.url){ DISPLAY_OVERRIDES[fighter].watchUrl = packet.watchMoment.url; DISPLAY_OVERRIDES[fighter].watchLabel = packet.watchMoment.label || 'Watch Moment'; } DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: current.purpose || 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();
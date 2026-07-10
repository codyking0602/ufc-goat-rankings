// Stipe Miocic fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-stipe-miocic-20260702a';
  const fighter = 'Stipe Miocic';

  const packet = {
    status: { stage: 'complete in packet system', lastUpdated: '2026-07-02', nextFix: 'None for Stipe. Continue current-roster packet cleanup.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/stipe-miocic.js', displayFallback: 'assets/data/display-overrides.js', compareFallback: 'assets/compare-coverage-pack-1.js', profileStatsFallback: 'assets/js/fighter-profile-packages.js', watchFallback: 'assets/js/watch-moments.js', photos: 'assets/fighters/stipe-miocic.webp and assets/fighters/stipe-miocic-thumb.webp' },
    photos: { photoUrl: 'assets/fighters/stipe-miocic.webp', thumbUrl: 'assets/fighters/stipe-miocic-thumb.webp' },
    display: {
      overallOvr: 87, allTimeRank: 14, divisionLabel: 'HW', resumeTag: 'UFC heavyweight standard',
      oneLiner: 'The strongest UFC heavyweight resume case: title defenses, champion wins, Ngannou value, and trilogy separation over Cormier.',
      categories: { championship: { ovr: 83, rank: 12 }, opponentQuality: { ovr: 85, rank: 11 }, primeDominance: { ovr: 90, rank: 6 }, longevity: { ovr: 84, rank: 18 } },
      snapshot: [ ['UFC Record', '15-5'], ['UFC Title-Fight Wins', '6'], ['Championship Level', 'UFC Heavyweight Standard'], ['Quality Wins', 'Best Heavyweight Win Stack'],  ['Active Elite Years', '7.6 Elite Years'], ['Loss Context', 'Heavyweight volatility and late Jones loss matter'] ],
      whyRankedHere: 'Stipe ranks #14 because he has the strongest UFC heavyweight resume: heavyweight title wins, major defenses, champion-level opponent quality, and the Cormier trilogy edge.',
      whyNotHigher: 'He does not rank higher because heavyweight depth and volatility cap the score compared with lighter divisions, and the loss column is real. The Jones loss also keeps the back end from feeling clean.',
      keyJudgmentCalls: [ ['Heavyweight value', 'he is treated as the UFC heavyweight standard, but heavyweight depth is still different from lightweight or welterweight.'], ['Cormier trilogy', 'the 2-1 edge over DC is central to his ranking.'], ['Ngannou split', 'the first win matters a lot, but the knockout loss also matters.'], ['Finish rate', 'his heavyweight finishing profile helps the eye test and dominance case.'], ['Late Jones loss', 'counts as late-career context and keeps the ending from being spotless.'] ],
      finalTakeaway: 'Stipe is the UFC heavyweight benchmark: the best heavyweight title resume, elite champion wins, and direct trilogy separation over Cormier, with heavyweight volatility holding him outside the top ten.'
    },
    profileStats: { ufcRecord: '15-5', titleFightWins: 6, eliteWins: 9,  finishRatePct: 80.0, roundsWonPct: 68.4, activeEliteYears: 7.62, timesFinishedPrime: 2, divisionStrengthContext: 'Heavyweight volatility is acknowledged, while Stipe still gets strong credit as the UFC heavyweight standard.', lossContext: 'Cormier and Ngannou losses matter, and the late Jones loss adds back-end context.' },
    compareSeasoning: {
      shortCase: 'Stipe is the best UFC heavyweight resume case: the strongest heavyweight title-run argument, major wins over champions, and trilogy separation over Cormier.',
      peak: 'At his best, Stipe combined boxing, wrestling, cardio, durability, and calm decision-making better than almost any heavyweight champion.',
      resume: 'Stipe’s UFC case is heavyweight-specific but very strong. Heavyweight careers are volatile, and he still built one of the cleanest title resumes the division has seen.',
      championship: 'The championship case is his separator: heavyweight title wins, defenses, the first Ngannou win, and the Cormier trilogy comeback.',
      opponentQuality: 'Werdum, Overeem, dos Santos, Ngannou, Cormier twice, Hunt, Arlovski, and Nelson give Stipe the deepest UFC heavyweight win list.',
      longevity: 'Stipe stayed elite through multiple heavyweight eras, though heavyweight volatility and the late Jones loss keep the back end from being spotless.',
      counter: 'The counterargument is division ceiling. Heavyweight is chaotic and thinner than lightweight or welterweight, so Stipe needs championship weight to carry the case.',
      edge: 'Stipe wins comparisons when heavyweight title value, champion wins, and the Cormier trilogy matter more than lighter-division depth.',
      eliteCounter: true,
      signatureWins: 'Werdum, Overeem, dos Santos, Ngannou, Cormier twice, Hunt, Arlovski, and Nelson give Stipe the strongest UFC heavyweight win list.',
      weakness: 'Heavyweight depth, loss volatility, and the late Jones loss cap the all-time ranking even though his divisional case is excellent.',
      titleSummary: 'Stipe’s title case is the UFC heavyweight standard: repeated title wins, multiple defenses, and the Cormier trilogy comeback.',
      primeSummary: 'His prime lasted through several heavyweight waves, with enough durability and adaptability to survive a historically volatile division.',
      titleStyle: 'Heavyweight Standard', primeStyle: 'Heavyweight Longevity',
      legacyStats: { ufcRecord: '15-5', titleFightWins: 6, beltsWon: 1, titleDefenses: 4, activeEliteYearsLabel: 'roughly 8 active elite years', primeNote: 'the strongest UFC heavyweight title run, carried by champion wins and trilogy value' }
    },
    watchMoment: { url: 'https://youtube.com/shorts/h_ThhOpI_dg?is=4Sr5Mcp01GkYxtrG', label: 'Watch Moment' }
  };
  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}), ...(packet.photos || {}) }; if(packet.watchMoment?.url){ DISPLAY_OVERRIDES[fighter].watchUrl = packet.watchMoment.url; DISPLAY_OVERRIDES[fighter].watchLabel = packet.watchMoment.label || 'Watch Moment'; } DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ if(!packet.compareSeasoning) return; window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: current.purpose || 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();

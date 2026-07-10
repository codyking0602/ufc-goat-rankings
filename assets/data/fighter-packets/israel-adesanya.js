// Israel Adesanya fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-israel-adesanya-20260702a';
  const fighter = 'Israel Adesanya';

  const packet = {
    status: { stage: 'complete in packet system', lastUpdated: '2026-07-02', nextFix: 'None for Izzy. Continue current-roster packet cleanup.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/israel-adesanya.js', displayFallback: 'assets/data/display-overrides.js', compareFallback: 'assets/compare-coverage-pack-1.js', profileStatsFallback: 'assets/js/fighter-profile-packages.js', watchFallback: 'assets/js/watch-moments.js', photos: 'assets/fighters/israel-adesanya.webp and assets/fighters/israel-adesanya-thumb.webp' },
    photos: { photoUrl: 'assets/fighters/israel-adesanya.webp', thumbUrl: 'assets/fighters/israel-adesanya-thumb.webp' },
    display: {
      overallOvr: 87, allTimeRank: 15, divisionLabel: 'MW / LHW', resumeTag: 'Modern middleweight title volume',
      oneLiner: 'The modern middleweight title-volume case: elite striking, repeated defenses, a title regain, and one of the deepest active title windows of his era.',
      categories: { championship: { ovr: 85, rank: 7 }, opponentQuality: { ovr: 87, rank: 5 }, primeDominance: { ovr: 84, rank: 27 }, longevity: { ovr: 82, rank: 22 } },
      snapshot: [ ['UFC Record', '14-5'], ['UFC Title-Fight Wins', '7'], ['Championship Level', 'Modern Middleweight Standard'], ['Quality Wins', 'Deep Modern MW Ledger'],  ['Active Elite Years', '6.5 Elite Years'], ['Loss Context', 'Pereira, Strickland, and DDP losses drag the case'] ],
      whyRankedHere: 'Adesanya ranks #15 because his middleweight championship volume is real: title win, repeated defenses, a title regain, and a deep list of modern contenders.',
      whyNotHigher: 'He does not rank higher because the later losses make the case less clean, and the Pereira/Strickland/DDP stretch creates prime-dominance drag. The title volume is excellent, but the resume is not as clean as the names above him.',
      keyJudgmentCalls: [ ['Middleweight title volume', 'the repeated defenses and title regain are the core of the case.'], ['Pereira rivalry', 'adds both a major blemish and a major redemption win.'], ['Whittaker wins', 'carry high-end middleweight value.'], ['Later losses', 'create real drag and keep the profile outside the top ten.'], ['Light heavyweight attempt', 'adds context, but middleweight remains the scoring center.'] ],
      finalTakeaway: 'Adesanya is the modern middleweight title-volume standard: deep, active, and important, but less clean than the longest-reign GOAT cases above him.'
    },
    profileStats: { ufcRecord: '14-5', titleFightWins: 7, eliteWins: 10,  finishRatePct: 42.9, roundsWonPct: 72.9, activeEliteYears: 6.54, timesFinishedPrime: 2, divisionStrengthContext: 'Modern middleweight quality is respected, with the light heavyweight attempt treated as context rather than the core case.', lossContext: 'Pereira, Strickland, and DDP losses matter, with Pereira also adding a redemption win.' },
    compareSeasoning: {
      shortCase: 'Adesanya is the modern middleweight title-volume case: elite striking, repeated defenses, two wins over Whittaker, and a long run as the face of the division.',
      peak: 'At his best, Izzy was distance, feints, counter-striking, takedown defense, and five-round control. He made elite middleweights fight at his rhythm.',
      resume: 'Adesanya’s UFC case is built on middleweight title volume and consistency, with the Pereira rivalry adding both a blemish and a major redemption moment.',
      championship: 'His championship case is excellent at middleweight: title win, repeated defenses, a title regain, and multiple wins over the best contenders of his era.',
      opponentQuality: 'Whittaker twice, Costa, Cannonier, Vettori twice, Gastelum, Pereira, Brunson, and Silva give Adesanya a deep modern middleweight ledger.',
      longevity: 'Izzy’s elite window is strong because he fought often, stayed at title level for years, and carried the middleweight division through a full era.',
      counter: 'The counterargument is that the later losses and Pereira rivalry make the case less clean than the longest-reigning champions above him.',
      edge: 'Adesanya wins comparisons when modern middleweight title volume, striking dominance, and repeated elite wins outweigh messy rivalry context.',
      eliteCounter: true,
      signatureWins: 'Whittaker twice, Costa, Cannonier, Vettori twice, Gastelum, Pereira, Brunson, and Silva give Adesanya one of the best modern middleweight win lists.',
      weakness: 'The later losses lower the prime-dominance case and make the story less clean than Anderson or the top GOAT-tier resumes.',
      titleSummary: 'Adesanya’s title case is built on a strong middleweight reign, repeated defenses, and a title regain after the Pereira loss.',
      primeSummary: 'His elite window was active and title-heavy, with frequent five-round fights against the best middleweights of his era.',
      titleStyle: 'Modern Middleweight Volume', primeStyle: 'Active Title Prime',
      legacyStats: { ufcRecord: '14-5', titleFightWins: 7, beltsWon: 1, titleDefenses: 5, activeEliteYearsLabel: 'roughly 7 active elite years', primeNote: 'active modern middleweight title run with a major Pereira redemption win' }
    },
    watchMoment: { url: 'https://youtube.com/shorts/CbvjjHBCUQM?is=J86x9mup7tQHDZS7', label: 'Watch Moment' }
  };
  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}), ...(packet.photos || {}) }; if(packet.watchMoment?.url){ DISPLAY_OVERRIDES[fighter].watchUrl = packet.watchMoment.url; DISPLAY_OVERRIDES[fighter].watchLabel = packet.watchMoment.label || 'Watch Moment'; } DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ if(!packet.compareSeasoning) return; window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: current.purpose || 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();

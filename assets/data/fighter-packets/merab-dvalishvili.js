// Merab Dvalishvili fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-merab-dvalishvili-20260702a';
  const fighter = 'Merab Dvalishvili';

  const packet = {
    status: { stage: 'packet live; Watch Moment needed', lastUpdated: '2026-07-02', nextFix: 'Add Merab Watch Moment link when Cody picks one.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/merab-dvalishvili.js', displayFallback: 'assets/data/display-overrides.js', compareFallback: 'assets/compare-coverage-pack-2.js and assets/compare-phase2-yan.js', photos: 'assets/fighters/merab-dvalishvili.webp and assets/fighters/merab-dvalishvili-thumb.webp' },
    photos: { photoUrl: 'assets/fighters/merab-dvalishvili.webp', thumbUrl: 'assets/fighters/merab-dvalishvili-thumb.webp' },
    display: {
      overallOvr: 86, allTimeRank: 17, divisionLabel: 'BW', resumeTag: 'Modern bantamweight pace case',
      oneLiner: 'The modern bantamweight pace engine: relentless pressure, elite contender depth, and a title case built in one of the sport’s toughest divisions.',
      categories: { championship: { ovr: 77, rank: 22 }, opponentQuality: { ovr: 84, rank: 13 }, primeDominance: { ovr: 92, rank: 6 }, longevity: { ovr: 80, rank: 24 } },
      snapshot: [ ['UFC Record', '13-3'], ['UFC Title-Fight Wins', '3'], ['Championship Level', 'Modern Bantamweight Champion'], ['Quality Wins', 'Deep Modern 135 Ledger'], ['Prime Record', 'Pace-Control Prime'], ['Active Elite Years', '5.0 Elite Years'], ['Loss Context', 'Yan rivalry split adds nuance'] ],
      whyRankedHere: 'Merab ranks here because his modern bantamweight run has serious depth. The pace, wrestling volume, and quality wins in a strong division give him one of the best active-era cases outside the top tier.',
      whyNotHigher: 'He does not rank higher because the title run is still newer than the long-reign champions, and the Yan rematch/split rivalry keeps the case from being cleanly separated.',
      keyJudgmentCalls: [ ['Modern bantamweight strength', 'raises the value of the opponent-quality case.'], ['Pace dominance', 'is the core of the prime-dominance argument.'], ['Yan rivalry', 'needs split-series context rather than a simple one-way read.'], ['Championship volume', 'is still building compared with older champions.'], ['Finish rate', 'is not the point of the case; control and schedule strength are.'] ],
      finalTakeaway: 'Merab is the modern bantamweight pace case: deep, exhausting, and elite, with the ceiling tied to how much more title volume he adds.'
    },
    profileStats: { ufcRecord: '13-3', titleFightWins: 3, eliteWins: 8, primeRecord: '9-2', finishRatePct: 23.1, roundsWonPct: 73.5, activeEliteYears: 5.0, timesFinishedPrime: 0, divisionStrengthContext: 'Modern bantamweight is treated as one of the strongest current divisions.', lossContext: 'Yan rivalry context matters; losses are not treated like a collapse of the whole case.' },
    compareSeasoning: {
      shortCase: 'Merab is the modern bantamweight pressure-and-longevity case: endless pace, elite control, a deep contender run, and a championship profile tied closely to the Yan rivalry.',
      peak: 'At his best, Merab turns fights into a cardio and wrestling test almost nobody can keep up with. The pace, chain wrestling, and control volume are the whole problem.',
      resume: 'Merab’s resume is built on modern bantamweight depth. Yan, Cejudo, Aldo, O’Malley, Umar, and other ranked wins give him a serious current-era case.',
      championship: 'Merab’s championship case is strong but still newer than the long-reign legends, with the Yan rivalry adding direct context.',
      opponentQuality: 'Yan, Cejudo, Aldo, Moraes, O’Malley, Umar, and ranked bantamweight wins give Merab a strong modern opponent-quality lane.',
      longevity: 'Merab’s useful elite window is strong and still active. He stacked years of top-level bantamweight relevance and made one of the division’s deepest title runs.',
      counter: 'Merab’s argument is depth and pace. Even with Yan context, the broader modern bantamweight schedule makes his case stronger than a simple title-loss read suggests.',
      edge: 'Merab wins comparisons when modern division depth, pace, wrestling control, and active elite consistency matter most.',
      eliteCounter: true,
      signatureWins: 'Yan, Cejudo, Aldo, Moraes, O’Malley, Umar, and ranked bantamweight wins give Merab one of the strongest modern 135-pound ledgers.',
      weakness: 'The title run is still young, and the Yan rivalry keeps the championship separation from being completely clean.',
      titleSummary: 'Merab’s title case is a major modern bantamweight run, but the rivalry context keeps it from being a simple long-reign champion story.',
      primeSummary: 'His prime is a pressure-control prime: less about finishes, more about making elite opponents fight his pace for five rounds.',
      titleStyle: 'Modern Bantamweight Pace Champion', primeStyle: 'Pressure-Control Prime',
      legacyStats: { ufcRecord: '13-3', titleFightWins: 3, beltsWon: 1, titleDefenses: 2, activeEliteYearsLabel: 'roughly 5 active elite years', primeNote: 'modern bantamweight pace prime with elite contender wins and a growing title run' }
    }
  };
  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}), ...(packet.photos || {}) }; DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: current.purpose || 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();

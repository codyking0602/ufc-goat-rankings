// Do not add new fighter data here.
// LEGACY: fighter data has been migrated to assets/data/ranking-data.js.
// Kamaru Usman fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-kamaru-usman-20260702a';
  const fighter = 'Kamaru Usman';

  const packet = {
    status: { stage: 'complete in packet system', lastUpdated: '2026-07-02', nextFix: 'None for Usman. Continue mid-board packet cleanup.' },
    repoLocations: {
      scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/kamaru-usman.js', displayFallback: 'assets/data/display-overrides.js', compareFallback: 'assets/compare-data.js', profileStatsFallback: 'assets/js/fighter-profile-packages.js', watchFallback: 'assets/js/watch-moments.js', photos: 'assets/fighters/kamaru-usman.webp and assets/fighters/kamaru-usman-thumb.webp'
    },
    photos: { photoUrl: 'assets/fighters/kamaru-usman.webp', thumbUrl: 'assets/fighters/kamaru-usman-thumb.webp' },
    display: {
      overallOvr: 88, allTimeRank: 10, divisionLabel: 'WW / MW', resumeTag: 'Modern welterweight title authority',
      oneLiner: 'The post-GSP welterweight champion case: dominant title control, elite round winning, and a focused but powerful championship peak.',
      categories: { championship: { ovr: 84, rank: 9 }, opponentQuality: { ovr: 86, rank: 8 }, primeDominance: { ovr: 91, rank: 7 }, longevity: { ovr: 85, rank: 16 } },
      snapshot: [
        ['UFC Record', '16-3'], ['UFC Title-Fight Wins', '6'], ['Championship Level', 'Great Welterweight Reign'], ['Quality Wins', 'Modern Welterweight Elite'], ['Prime Record', 'Dominant Focused Prime'], ['Active Elite Years', '6.0 Elite Years'], ['Loss Context', 'Edwards finish damaged the back end']
      ],
      whyRankedHere: 'Usman ranks #10 because his welterweight title run had real champion authority. He paired elite round control with strong defenses and quality wins over the best contenders of his era.',
      whyNotHigher: 'He does not rank higher because his elite window is more compact than the long-volume cases, and the Edwards losses damaged the clean ending. His peak was elite, but the total UFC resume is not as broad as the names above him.',
      keyJudgmentCalls: [
        ['Championship peak', 'the title run is the center of his case.'], ['Round control', 'his prime round-winning profile is one of his biggest strengths.'], ['Edwards losses', 'the finish loss creates real drag even though Edwards is elite.'], ['Modern welterweight context', 'Woodley, Covington, Burns, Masvidal, Edwards, and RDA give the resume quality.'], ['Middleweight fight', 'adds context, but welterweight carries the ranking.']
      ],
      finalTakeaway: 'Usman is the focused modern welterweight champion case: high-end title control, strong elite wins, and a peak that was better than the total volume of his resume.'
    },
    profileStats: {
      ufcRecord: '16-3', titleFightWins: 6, eliteWins: 8, primeRecord: '12-2', finishRatePct: 56.3, roundsWonPct: 78.1, activeEliteYears: 6.04, timesFinishedPrime: 1,
      divisionStrengthContext: 'Modern welterweight gives him strong quality-win value, though not quite GSP-level depth.',
      lossContext: 'The Edwards finish and rematch loss hurt the back end, but they came against elite opposition.'
    },
    compareSeasoning: {
      shortCase: 'Usman is the great welterweight champion of the post-GSP era: dominant title run, elite round control, strong defenses, and one of the best championship peaks in the ranking.',
      peak: 'At his best, Usman was a suffocating champion with pressure, wrestling threat, cardio, clinch control, and improving power that made him feel like the clear best welterweight in the world.',
      resume: 'Usman’s resume is built on championship authority. He ruled welterweight, defended repeatedly, and beat top contenders during a strong modern era.',
      championship: 'His championship case is stronger than his overall volume case. The title run was clean, controlled, and had real champion energy.',
      opponentQuality: 'Woodley, Covington twice, Burns, Masvidal, Edwards, and RDA give Usman a strong modern welterweight ledger.',
      longevity: 'Usman’s elite window was excellent but not as long as Holloway’s or GSP’s. That is why he can peak higher than some fighters but still trail them in total resume.',
      counter: 'Usman’s argument is champion peak. If the debate is who looked more in control at the top, Usman has a real lane.',
      edge: 'Usman wins when championship peak, round control, and title-defense authority outweigh longer but less dominant resumes.',
      eliteCounter: true,
      signatureWins: 'Woodley, Covington twice, Burns, Masvidal, Edwards, and RDA give Usman a strong modern welterweight ledger.',
      weakness: 'The Edwards losses hurt the clean ending, and the elite window is more compact than the longer all-time cases.',
      titleSummary: 'Usman’s title case is a strong modern welterweight reign with repeated defenses and real champion authority, even if the ending got damaged by Edwards.',
      primeSummary: 'His prime was excellent but tighter than GSP’s or Holloway’s: a dominant title window rather than a decade-long all-time run.',
      titleStyle: 'Modern Title Authority', primeStyle: 'Dominant Focused Prime',
      legacyStats: { ufcRecord: '16-3', titleFightWins: 6, beltsWon: 1, titleDefenses: 5, activeEliteYearsLabel: 'roughly 6 active elite years', primeNote: 'dominant but focused welterweight title window rather than a decade-long elite run' }
    },
    watchMoment: { url: 'https://youtube.com/shorts/IESw7PEdMVo?is=okf-XopaawJFybfz', label: 'Watch Moment' }
  };
  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}), ...(packet.photos || {}) }; if(packet.watchMoment?.url){ DISPLAY_OVERRIDES[fighter].watchUrl = packet.watchMoment.url; DISPLAY_OVERRIDES[fighter].watchLabel = packet.watchMoment.label || 'Watch Moment'; } DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ if(!packet.compareSeasoning) return; window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: current.purpose || 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();

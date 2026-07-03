// Max Holloway fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-max-holloway-20260702a';
  const fighter = 'Max Holloway';

  const packet = {
    status: { stage: 'complete in packet system', lastUpdated: '2026-07-02', nextFix: 'None for Max. Continue mid-board packet cleanup.' },
    repoLocations: {
      scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/max-holloway.js', displayFallback: 'assets/data/display-overrides.js', compareFallback: 'assets/compare-data.js', profileStatsFallback: 'assets/js/fighter-profile-packages.js', watchFallback: 'assets/js/watch-moments.js', photos: 'assets/fighters/max-holloway.webp and assets/fighters/max-holloway-thumb.webp'
    },
    photos: { photoUrl: 'assets/fighters/max-holloway.webp', thumbUrl: 'assets/fighters/max-holloway-thumb.webp' },
    display: {
      overallOvr: 88, allTimeRank: 9, divisionLabel: 'FW / LW', resumeTag: 'Volume and quality wins',
      oneLiner: 'The volume case: relentless pace, elite quality wins, and one of the longest useful elite windows in the featherweight era.',
      categories: { championship: { ovr: 79, rank: 17 }, opponentQuality: { ovr: 93, rank: 2 }, primeDominance: { ovr: 88, rank: 17 }, longevity: { ovr: 95, rank: 3 } },
      snapshot: [
        ['UFC Record', '23-9'], ['UFC Title-Fight Wins', '5'], ['Championship Level', 'Great but Not Massive Belt Volume'], ['Quality Wins', 'Second-Best Score in This Ranking'], ['Prime Record', 'Long High-Level Prime'], ['Active Elite Years', '10.9 Elite Years'], ['Loss Context', 'Many losses came to elite names and across long volume']
      ],
      whyRankedHere: 'Holloway ranks #9 because his quality-wins score and longevity score are both elite. Few fighters in this ranking have stacked as many meaningful UFC wins over as long a stretch.',
      whyNotHigher: 'He sits below the very top names because the current scoring model gives him less championship control and more resume drag from total losses. The volume is impressive, but the belt dominance is not on the level of the names above him.',
      keyJudgmentCalls: [
        ['Quality wins', 'are the clearest strength of the Holloway case and rank #2 in this scoring model.'], ['Longevity', 'is another major positive because he stayed elite for such a long period.'], ['BMF belt', 'is not counted as UFC championship credit here.'], ['Loss volume', 'matters, but much of it came against elite competition, which softens the drag.'], ['Featherweight run', 'is the core of the profile even though important lightweight fights add context.']
      ],
      finalTakeaway: 'Holloway is the volume-and-quality-wins monster of this ranking: one of the deepest win ledgers in the UFC, backed by real longevity, even without a top-tier championship score.'
    },
    profileStats: {
      ufcRecord: '23-9', titleFightWins: 5, eliteWins: 9, primeRecord: '11-5', finishRatePct: 52.2, roundsWonPct: 72.8, activeEliteYears: 8.31, timesFinishedPrime: 1,
      divisionStrengthContext: 'Featherweight value is strong, and the lightweight moments add context without becoming the core case.',
      lossContext: 'Loss volume matters, but several losses came against elite opponents or across a long elite window.'
    },
    compareSeasoning: {
      shortCase: 'Holloway is the volume king at featherweight: elite durability, huge opponent depth, long-term relevance, and one of the deepest bodies of work in the ranking.',
      peak: 'At his best, Max was pace, boxing, durability, and pressure. He overwhelmed great fighters by turning fights into long, exhausting conversations they could not keep up with.',
      resume: 'Holloway’s resume is built on volume and staying power. He kept beating top-tier names before, during, and after his title reign.',
      championship: 'His championship case is strong, but not as clean as Volk’s because the trilogy directly separates them in the same era.',
      opponentQuality: 'Holloway’s win depth is excellent: Aldo twice, Ortega, Kattar, Yair, Korean Zombie, Gaethje, and many more give him one of the best opponent-volume cases.',
      longevity: 'This is one of Max’s biggest edges. He has stayed elite for years, across multiple phases, even after losing the belt.',
      counter: 'Max’s argument is total body of work. Even when someone peaked higher, Max often has more elite volume and more proof over time.',
      edge: 'Holloway wins when the debate rewards longevity, opponent volume, durability, and sustained elite relevance.',
      eliteCounter: true,
      signatureWins: 'Aldo twice, Ortega, Kattar, Yair, Korean Zombie, and Gaethje give Holloway one of the best opponent-volume cases in the ranking.',
      weakness: 'The Volk trilogy blocks the clean featherweight supremacy argument, and the total loss count keeps him out of the top tier.',
      titleSummary: 'Holloway’s title case is strong, but his all-time case is even more about volume, elite wins, and relevance before and after the belt.',
      primeSummary: 'Max’s prime and relevance window is unusually long: he stayed elite through multiple phases, even after losing the featherweight title.',
      titleStyle: 'Champion Volume Case', primeStyle: 'Long Elite Volume',
      legacyStats: { ufcRecord: '23-9', titleFightWins: 5, beltsWon: 1, titleDefenses: 1, activeEliteYearsLabel: 'roughly 8 active elite years', primeNote: 'one of the longest elite windows in the ranking, with major value before and after the belt' }
    },
    watchMoment: { url: 'https://youtube.com/shorts/z4m1wNoAC7k?is=BRWVC4am_k8yJQzZ', label: 'Watch Moment' }
  };
  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}), ...(packet.photos || {}) }; if(packet.watchMoment?.url){ DISPLAY_OVERRIDES[fighter].watchUrl = packet.watchMoment.url; DISPLAY_OVERRIDES[fighter].watchLabel = packet.watchMoment.label || 'Watch Moment'; } DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ if(!packet.compareSeasoning) return; window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: current.purpose || 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();

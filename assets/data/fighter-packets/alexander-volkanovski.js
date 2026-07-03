// Alexander Volkanovski fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-alexander-volkanovski-20260702a';
  const fighter = 'Alexander Volkanovski';

  const packet = {
    status: {
      stage: 'complete in packet system',
      lastUpdated: '2026-07-02',
      nextFix: 'None for Volk. Start mid-board display/profile cleanup next.'
    },
    repoLocations: {
      scoreSource: 'assets/data/ranking-data.js',
      centralPacket: 'assets/data/fighter-packets/alexander-volkanovski.js',
      displayFallback: 'assets/data/display-overrides.js',
      compareFallback: 'assets/compare-data.js',
      profileStatsFallback: 'assets/js/fighter-profile-packages.js',
      watchFallback: 'assets/js/watch-moments.js',
      photos: 'assets/fighters/alexander-volkanovski.webp and assets/fighters/alexander-volkanovski-thumb.webp'
    },
    photos: {
      photoUrl: 'assets/fighters/alexander-volkanovski.webp',
      thumbUrl: 'assets/fighters/alexander-volkanovski-thumb.webp'
    },
    display: {
      overallOvr: 89,
      allTimeRank: 7,
      divisionLabel: 'FW / LW',
      resumeTag: 'All-around featherweight case',
      oneLiner: 'The complete featherweight champion case: title consistency, strong quality wins, and one of the deepest modern resumes in the sport.',
      categories: {
        championship: { ovr: 84, rank: 7 },
        opponentQuality: { ovr: 87, rank: 4 },
        primeDominance: { ovr: 87, rank: 22 },
        longevity: { ovr: 88, rank: 12 }
      },
      snapshot: [
        ['UFC Record', '15-3'],
        ['UFC Title-Fight Wins', '8'],
        ['Championship Level', 'Modern Featherweight Standard'],
        ['Quality Wins', 'Top-End Featherweight Case'],
        ['Prime Record', 'Long Championship Prime'],
        ['Active Elite Years', '6.7 Elite Years'],
        ['Loss Context', 'Islam losses get reduced up-division treatment']
      ],
      whyRankedHere: 'Volkanovski ranks #7 because he checks every important box well: championship success, quality wins, consistency, and a long elite stretch at featherweight. He may not have the single highest peak score, but his overall balance is extremely strong.',
      whyNotHigher: 'The current scoring model hits him for the Topuria loss and keeps his prime-dominance score below the names with more overwhelming peaks. The up-division Islam losses are handled more lightly, but they still do not boost the resume the way a win would have.',
      keyJudgmentCalls: [
        ['Jose Aldo win', 'marks the beginning of the prime scoring window.'],
        ['Islam losses', 'receive reduced penalties because they were elite up-division title fights.'],
        ['Topuria loss', 'counts as a meaningful main-division prime finished loss.'],
        ['Quality wins', 'are a major strength of the Volk case and grade near the top of this ranking.'],
        ['Balanced resume', 'is the core reason he stays near the top seven even without a #1 category score.']
      ],
      finalTakeaway: 'Volkanovski is the all-around featherweight standard: deep title work, strong quality wins, and a balanced resume with very few weak points.'
    },
    profileStats: {
      ufcRecord: '15-3',
      titleFightWins: 8,
      eliteWins: 9,
      primeRecord: '10-3',
      finishRatePct: 53.3,
      roundsWonPct: 76.5,
      activeEliteYears: 5.72,
      timesFinishedPrime: 2,
      divisionStrengthContext: 'Modern featherweight strength helps his opponent-quality case.',
      lossContext: 'Islam losses receive reduced up-division elite-loss treatment; Topuria is the main prime-dominance drag.'
    },
    compareSeasoning: {
      shortCase: 'Volk is the defining modern featherweight champion: elite title control, Max trilogy separation, Aldo win value, and a strong case across skill, resume, and era strength.',
      peak: 'At his best, Volk was adaptable, disciplined, fast, and difficult to solve. He could strike, wrestle, defend, adjust mid-fight, and win tactical battles against elite opponents.',
      resume: 'Volk’s resume is built on featherweight separation. He beat Aldo, took the belt from Holloway, won the trilogy, and defended against multiple top contenders.',
      championship: 'His championship case is extremely clean at featherweight. The Max trilogy gives him direct separation over another all-time great from the same division.',
      opponentQuality: 'Aldo, Holloway, Ortega, Korean Zombie, Yair, and Makhachev context give Volk a strong opponent-quality case, even with the Islam losses treated carefully.',
      longevity: 'Volk’s elite window was strong, but not as long as Holloway’s. His case is more about clean championship separation than pure career volume.',
      counter: 'Volk’s best argument is direct separation. He did not just share an era with Max; he beat him three times and became the defining featherweight champion.',
      edge: 'Volk wins when head-to-head separation, championship control, and modern featherweight strength matter more than raw career volume.',
      rivalry: 'Against Holloway, Volk’s case is simple: Max has the volume, but Volk took the belt, won the trilogy, and owns the championship separation.',
      eliteCounter: true,
      signatureWins: 'Aldo, Holloway three times, Ortega, Korean Zombie, and Yair give Volk one of the cleanest modern featherweight title resumes.',
      weakness: 'The Islam losses do not hurt as much because they were up-division elite fights, but the Topuria loss is real main-division drag and his prime-dominance score is not as high as the peak monsters.',
      titleSummary: 'Volk’s title case is a clean modern featherweight reign built around Holloway trilogy separation and repeated contender defenses.',
      primeSummary: 'His prime was not as long as Holloway’s total run, but at his best he was the defining featherweight of the era.',
      titleStyle: 'Clean Division Separation',
      primeStyle: 'Elite Modern Prime',
      bestArgument: 'Volk’s best argument is balance plus direct separation: title success, elite wins, Max trilogy control, and modern featherweight strength.',
      legacyStats: {
        ufcRecord: '15-3',
        titleFightWins: 8,
        beltsWon: 1,
        titleDefenses: 5,
        activeEliteYearsLabel: 'roughly 6 active elite years',
        primeNote: 'clean modern featherweight prime built around Holloway trilogy separation, with Islam losses treated as up-division elite context'
      }
    },
    watchMoment: {
      url: 'https://youtube.com/shorts/5zVynz57V-c?is=UsPP0oG5BB8Xlg8r',
      label: 'Watch Moment'
    }
  };

  function mergeLegacyStats(existingStats, packetStats) { return { ...(existingStats || {}), ...(packetStats || {}) }; }
  function mergeCompareProfile(existingProfile, packetProfile) {
    return { ...(existingProfile || {}), ...(packetProfile || {}), legacyStats: mergeLegacyStats((existingProfile || {}).legacyStats, (packetProfile || {}).legacyStats) };
  }
  function applyDisplay() {
    if (typeof DISPLAY_OVERRIDES === 'undefined') return;
    DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {};
    DISPLAY_OVERRIDES[fighter] = { ...DISPLAY_OVERRIDES[fighter], ...(packet.display || {}), ...(packet.photos || {}) };
    if (packet.watchMoment?.url) {
      DISPLAY_OVERRIDES[fighter].watchUrl = packet.watchMoment.url;
      DISPLAY_OVERRIDES[fighter].watchLabel = packet.watchMoment.label || 'Watch Moment';
    }
    DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) };
    DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {};
    DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {};
  }
  function applyCompare() {
    if (!packet.compareSeasoning) return;
    window.COMPARE_PROFILES = window.COMPARE_PROFILES || {};
    window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning);
    if (typeof DISPLAY_OVERRIDES !== 'undefined') {
      DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {};
      DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]);
    }
  }
  function registerPacket() {
    window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {};
    window.UFC_FIGHTER_PACKETS[fighter] = packet;
    const current = window.UFC_FIGHTER_PACKET_SYSTEM || {};
    const fighters = Array.from(new Set([...(current.fighters || []), fighter]));
    const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION]));
    window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: current.purpose || 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() };
  }
  applyDisplay();
  applyCompare();
  registerPacket();
})();

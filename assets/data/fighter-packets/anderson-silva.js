// Anderson Silva fighter packet extension.
// Part of the central fighter-packet system; split into its own file to keep packets manageable as the roster grows.
(function(){
  const VERSION = 'fighter-packet-anderson-silva-20260702a';
  const fighter = 'Anderson Silva';

  const packet = {
    status: {
      stage: 'complete in packet system',
      lastUpdated: '2026-07-02',
      nextFix: 'None for Anderson. Migrate Khabib Nurmagomedov next.'
    },
    repoLocations: {
      scoreSource: 'assets/data/ranking-data.js',
      centralPacket: 'assets/data/fighter-packets/anderson-silva.js',
      displayFallback: 'assets/data/display-overrides.js',
      compareFallback: 'assets/compare-data.js',
      profileStatsFallback: 'assets/js/fighter-profile-packages.js',
      watchFallback: 'assets/js/watch-moments.js',
      photos: 'assets/fighters/anderson-silva.webp and assets/fighters/anderson-silva-thumb.webp'
    },
    photos: {
      photoUrl: 'assets/fighters/anderson-silva.webp',
      thumbUrl: 'assets/fighters/anderson-silva-thumb.webp'
    },
    display: {
      overallOvr: 91,
      allTimeRank: 4,
      divisionLabel: 'MW',
      resumeTag: 'Peak aura standard',
      oneLiner: 'The peak-aura case: historic middleweight title control, terrifying finishing dominance, and one of the most iconic prime runs in UFC history.',
      categories: {
        championship: { ovr: 90, rank: 4 },
        opponentQuality: { ovr: 84, rank: 13 },
        primeDominance: { ovr: 90, rank: 10 },
        longevity: { ovr: 91, rank: 6 }
      },
      snapshot: [
        ['UFC Record', '17-7, 1 NC'],
        ['UFC Title-Fight Wins', '11'],
        ['Championship Level', 'Historic Middleweight Reign'],
        ['Elite Wins', 'Strong but Division-Adjusted'],
        ['Prime Record', 'Legendary Peak Run'],
        ['Active Elite Years', 'Long Elite Window'],
        ['Loss Context', 'Weidman losses count; later losses are treated as post-prime context']
      ],
      whyRankedHere: 'Silva ranks #4 because his peak remains one of the most dominant and iconic runs in UFC history. He paired a historic middleweight title reign with rare finishing threat, long-term aura, and a level of separation that still defines elite prime dominance.',
      whyNotHigher: 'Silva does not pass the top three because the current scoring model gives Jones, St-Pierre, and Johnson stronger overall combinations of championship volume, opponent-quality wins, clean prime record, and loss context. The Weidman losses matter, and the middleweight division-strength adjustment keeps his quality-wins score below the very top tier.',
      keyJudgmentCalls: [
        ['Peak aura', 'central to the Silva case and heavily reflected in the prime-dominance score.'],
        ['Weidman losses', 'count as in-prime losses and are real resume drag.'],
        ['Later losses', 'treated mostly as post-prime context rather than the core Silva case.'],
        ['Middleweight context', 'the division-strength adjustment keeps the quality-wins category below the top tier.'],
        ['Finishing threat', 'a major reason his prime still feels more dominant than a normal title reign.']
      ],
      finalTakeaway: 'Silva is the UFC peak-aura legend: a historic champion, terrifying finisher, and one of the most influential dominant runs ever, with enough loss and opponent-strength context to keep him just behind the top three.'
    },
    profileStats: {
      ufcRecord: '17-7, 1 NC',
      titleFightWins: 11,
      eliteWins: 7,
      primeRecord: '16-2',
      finishRatePct: 77.8,
      roundsWonPct: 69.2,
      activeEliteYears: 7.21,
      timesFinishedPrime: 2,
      divisionStrengthContext: 'Middleweight dominance is central to the case, but opponent-quality value is slightly division-adjusted.',
      lossContext: 'Weidman losses count as in-prime drag; later losses are mostly post-prime context.'
    },
    compareSeasoning: {
      shortCase: 'Anderson is the peak-aura legend: the most iconic middleweight reign, terrifying finishing ability, and some of the most memorable dominance moments ever.',
      peak: 'At his best, Anderson felt untouchable. The counters, creativity, front kick, matrix defense, and sudden finishes gave his prime a mythology few fighters can match.',
      resume: 'Anderson’s resume is built on title reign plus aura. He ruled middleweight for years, finished challengers spectacularly, and became the symbol of peak dominance.',
      championship: 'His championship case is huge: a long middleweight reign, repeated title wins, and a stretch where he felt like the most dangerous champion in the sport.',
      opponentQuality: 'The opponent-quality case is strong but not perfect. The names matter, but middleweight division-strength context keeps this from being as clean as GSP or Jones.',
      longevity: 'Anderson’s elite window was long, but the back end is messy. This ranking protects later post-prime losses, while the Weidman losses still matter.',
      counter: 'Anderson’s argument is aura and peak fear factor. If someone values the most terrifying prime, he has one of the strongest cases ever.',
      edge: 'Anderson wins comparisons when peak impact, finishing danger, and iconic championship dominance outweigh cleaner but less explosive resumes.',
      eliteCounter: true,
      signatureWins: 'Franklin, Henderson, Griffin, Belfort, Sonnen, Okami, and years of middleweight title wins give Anderson one of the sport’s most iconic reigns.',
      weakness: 'The Weidman losses matter because they land before this ranking fully moves Anderson into post-prime protection, and middleweight depth is slightly division-adjusted.',
      titleSummary: 'Anderson’s title case is a long middleweight reign built on repeated defenses, spectacular finishes, and one of the most iconic champion runs ever.',
      primeSummary: 'His prime aura lasted for years, but the Weidman losses create drag because they land before the model fully shifts him into post-prime protection.',
      titleStyle: 'Aura Reign Standard',
      primeStyle: 'Peak Fear Factor',
      bestArgument: 'Anderson’s best argument is peak aura: few fighters ever felt more dangerous, more creative, or more inevitable during a title reign.',
      legacyStats: {
        ufcRecord: '17-7, 1 NC',
        titleFightWins: 11,
        beltsWon: 1,
        titleDefenses: 10,
        activeEliteYearsLabel: 'roughly 7 active elite years',
        primeNote: 'long middleweight title aura before the Weidman losses damaged the back end'
      }
    },
    watchMoment: {
      url: 'https://youtube.com/shorts/KITOr2BPlyg?is=czgA_fjxyDuXlbpO',
      label: 'Watch Moment'
    }
  };

  function mergeLegacyStats(existingStats, packetStats) {
    return { ...(existingStats || {}), ...(packetStats || {}) };
  }

  function mergeCompareProfile(existingProfile, packetProfile) {
    return {
      ...(existingProfile || {}),
      ...(packetProfile || {}),
      legacyStats: mergeLegacyStats((existingProfile || {}).legacyStats, (packetProfile || {}).legacyStats)
    };
  }

  function applyDisplay() {
    if (typeof DISPLAY_OVERRIDES === 'undefined') return;
    DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {};
    DISPLAY_OVERRIDES[fighter] = {
      ...DISPLAY_OVERRIDES[fighter],
      ...(packet.display || {}),
      ...(packet.photos || {})
    };
    if (packet.watchMoment?.url) {
      DISPLAY_OVERRIDES[fighter].watchUrl = packet.watchMoment.url;
      DISPLAY_OVERRIDES[fighter].watchLabel = packet.watchMoment.label || 'Watch Moment';
    }
    DISPLAY_OVERRIDES[fighter].packetProfileStats = {
      ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}),
      ...(packet.profileStats || {})
    };
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
    window.UFC_FIGHTER_PACKET_SYSTEM = {
      ...current,
      version: current.version || VERSION,
      purpose: current.purpose || 'Central source for fighter-facing app content during migration.',
      fighters,
      packetExtensions,
      appliedAt: new Date().toISOString()
    };
  }

  applyDisplay();
  applyCompare();
  registerPacket();
})();

// Demetrious Johnson fighter packet extension.
// Part of the central fighter-packet system; split into its own file to keep packets manageable as the roster grows.
(function(){
  const VERSION = 'fighter-packet-demetrious-johnson-20260702a';
  const fighter = 'Demetrious Johnson';

  const packet = {
    status: {
      stage: 'complete in packet system',
      lastUpdated: '2026-07-02',
      nextFix: 'None for DJ. Migrate Anderson Silva next.'
    },
    repoLocations: {
      scoreSource: 'assets/data/ranking-data.js',
      centralPacket: 'assets/data/fighter-packets/demetrious-johnson.js',
      displayFallback: 'assets/data/display-overrides.js',
      compareFallback: 'assets/compare-data.js',
      profileStatsFallback: 'assets/js/fighter-profile-packages.js',
      watchFallback: 'assets/js/watch-moments.js',
      photos: 'assets/fighters/demetrious-johnson.webp and assets/fighters/demetrious-johnson-thumb.webp'
    },
    photos: {
      photoUrl: 'assets/fighters/demetrious-johnson.webp',
      thumbUrl: 'assets/fighters/demetrious-johnson-thumb.webp'
    },
    display: {
      divisionLabel: 'FLW',
      resumeTag: 'Flyweight standard',
      oneLiner: 'The defining UFC flyweight champion: historic title control, elite technical dominance, and one of the cleanest prime skill sets in the sport.',
      snapshot: [
        ['UFC Record', '15-2-1'],
        ['UFC Title-Fight Wins', '12'],
        ['Championship Level', 'Historic Flyweight Reign'],
        ['Elite Wins', 'Strong but Division-Adjusted'],
        
        ['Active Elite Years', 'Elite Championship Window'],
        ['Loss Context', 'Cruz and Cejudo losses add context, not collapse']
      ],
      whyRankedHere: 'Johnson ranks #3 because he built the UFC flyweight standard: a long title reign, elite technical control, strong prime dominance, and one of the best championship resumes in this ranking. His case is especially strong in title success and prime skill separation.',
      whyNotHigher: 'Johnson trails Jones and St-Pierre because his quality-wins score and flyweight division-strength context are lower in the current scoring model. His later non-UFC success adds historical context, but this ranking is based on the UFC resume.',
      keyJudgmentCalls: [
        ['Flyweight context', 'his dominance is respected, while the division-strength adjustment keeps the quality-wins score below the very top tier.'],
        ['Dominick Cruz loss', 'a real UFC loss at bantamweight, but not the core of his flyweight prime.'],
        ['Henry Cejudo loss', 'matters because it ended the UFC reign, but it was close enough that it does not erase the championship run.'],
        ['Non-UFC success', 'can be mentioned historically, but it is not scored in this ranking.'],
        ['Skill vs resume', 'his skill case may be even higher than his UFC resume score.']
      ],
      finalTakeaway: 'Johnson is the UFC flyweight benchmark: historic title success, elite prime dominance, and a clean technical style that still grades near the top of the all-time list.'
    },
    profileStats: {
      ufcRecord: '15-2-1',
      titleFightWins: 12,
      eliteWins: 8,
      
      finishRatePct: 43.8,
      roundsWonPct: 73.9,
      activeEliteYears: 6.84,
      timesFinishedPrime: 0,
      divisionStrengthContext: 'Flyweight dominance is fully respected, but opponent-quality value is division-adjusted.',
      lossContext: 'Cruz at bantamweight and Cejudo in a close flyweight title fight matter, but neither collapses the prime case.'
    },
    compareSeasoning: {
      shortCase: 'DJ is the flyweight standard: historic title control, elite technical completeness, and one of the cleanest dominance cases in the ranking.',
      peak: 'At his best, DJ was the most complete fighter in the sport: pace, wrestling, scrambling, submissions, striking, cardio, and fight IQ all working together.',
      resume: 'DJ’s resume is built on championship consistency. He ruled flyweight for years, defended repeatedly, and rarely looked out of control during his prime run.',
      championship: 'His championship case is historically strong, even with division-strength context. The title reign was long, stable, and clearly separated him from the division.',
      opponentQuality: 'The opponent list is good but division-adjusted. Benavidez, Dodson, Cejudo, Horiguchi, and others matter, but flyweight depth keeps the score below the very top names.',
      longevity: 'DJ’s longevity is strong because he stayed elite across a long title window without many ugly resume dents.',
      counter: 'DJ’s best counterargument is skill and cleanliness. He may not have the biggest names, but his technical control and consistency are almost impossible to ignore.',
      edge: 'DJ wins when the debate rewards complete dominance, clean title control, and fewer resume holes over bigger-name but messier cases.',
      scope: 'His later ONE run adds historical context, but this ranking is scoring the UFC portion of the career.',
      eliteCounter: true,
      signatureWins: 'Benavidez, Dodson, Cejudo, Horiguchi, and years of flyweight title defenses give DJ a clean dominance case even after division-strength context.',
      weakness: 'The only real drag is division depth. DJ’s skill and dominance are elite, but the flyweight opponent pool does not score like welterweight or lightweight.',
      titleSummary: 'DJ’s title case is historic at flyweight: long reign, repeated defenses, and clean separation from the division, with division-strength context applied.',
      primeSummary: 'His UFC prime was long, technical, consistent, and rarely chaotic; he controlled fights without many ugly dips.',
      titleStyle: 'Flyweight Reign Standard',
      primeStyle: 'Technical Completeness',
      bestArgument: 'DJ’s best argument is technical completeness plus title control: he was cleaner than Anderson, more dominant than most longer-resume fighters, and more complete than almost anyone skill-for-skill.',
      legacyStats: {
        ufcRecord: '15-2-1',
        titleFightWins: 12,
        beltsWon: 1,
        titleDefenses: 11,
        activeEliteYearsLabel: 'roughly 7 active elite years',
        primeNote: 'long technical flyweight reign with very few ugly moments and no prime finish losses'
      }
    },
    watchMoment: {
      url: 'https://youtube.com/shorts/U6EH3w_Kg84?is=GNVuKz921_a_zud9',
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

// Khabib Nurmagomedov fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-khabib-nurmagomedov-20260702a';
  const fighter = 'Khabib Nurmagomedov';

  const packet = {
    status: {
      stage: 'complete in packet system',
      lastUpdated: '2026-07-02',
      nextFix: 'None for Khabib. Migrate Islam Makhachev next.'
    },
    repoLocations: {
      scoreSource: 'assets/data/ranking-data.js',
      centralPacket: 'assets/data/fighter-packets/khabib-nurmagomedov.js',
      displayFallback: 'assets/data/display-overrides.js',
      compareFallback: 'assets/compare-data.js',
      profileStatsFallback: 'assets/js/fighter-profile-packages.js',
      watchFallback: 'assets/js/watch-moments.js',
      photos: 'assets/fighters/khabib-nurmagomedov.webp and assets/fighters/khabib-nurmagomedov-thumb.webp'
    },
    photos: {
      photoUrl: 'assets/fighters/khabib-nurmagomedov.webp',
      thumbUrl: 'assets/fighters/khabib-nurmagomedov-thumb.webp'
    },
    display: {
      divisionLabel: 'LW',
      resumeTag: 'Prime dominance case',
      oneLiner: 'The cleanest prime run at lightweight: unbeaten in the UFC, overwhelming round control, and the strongest dominance case in this ranking.',
      snapshot: [
        ['UFC Record', '13-0'],
        ['UFC Title-Fight Wins', '4'],
        ['Championship Level', 'Short but Elite Title Run'],
        ['Quality Wins', 'Lightweight Champion Tier'],
        
        ['Active Elite Years', '6.0 Elite Years'],
        ['Loss Context', 'No UFC losses']
      ],
      whyRankedHere: 'Khabib ranks #6 because his prime-dominance score is the strongest in the current scoring model. He combined elite control, round winning, and a perfect UFC record, giving him one of the hardest peaks to challenge in this ranking.',
      whyNotHigher: 'He does not climb higher because the current scoring model gives him less championship volume and fewer quality-wins layers than the fighters above him. His peak is elite enough to compete with anyone, but his total UFC resume is shorter.',
      keyJudgmentCalls: [
        ['Prime dominance', 'the clearest strength of the Khabib case and the best score in this ranking.'],
        ['No UFC losses', 'helps keep the resume unusually clean.'],
        ['Lightweight strength', 'matters positively because his best work came in an elite division.'],
        ['Short title run', 'keeps the championship category lower than the all-time leaders.'],
        ['Pre-prime wins', 'still matter for record and context, but the core scoring window starts around Rafael dos Anjos.']
      ],
      finalTakeaway: 'Khabib is the lightweight prime-dominance benchmark: unbeatable at his best, extremely efficient, and held back only by shorter championship volume than the names above him.'
    },
    profileStats: {
      ufcRecord: '13-0',
      titleFightWins: 4,
      eliteWins: 5,
      
      finishRatePct: 62.5,
      roundsWonPct: 94.7,
      activeEliteYears: 6.02,
      timesFinishedPrime: 0,
      divisionStrengthContext: 'Lightweight strength is a positive; his best work came in one of the toughest divisions.',
      lossContext: 'No UFC losses and no prime finish losses.'
    },
    compareSeasoning: {
      shortCase: 'Khabib is the cleanest peak-dominance case: unbeaten, overwhelming, and almost never in real trouble once he reached elite lightweight level.',
      peak: 'At his best, Khabib was the strongest control fighter in the sport. Everyone knew the game plan, and almost nobody had answers for it.',
      resume: 'Khabib’s resume is short compared with the biggest title-volume cases, but it is incredibly clean: no losses, elite lightweight wins, and a final stretch that felt dominant and complete.',
      championship: 'The championship case is strong but compact. He beat elite lightweights and retired on top, but he does not have the long title-fight volume of the highest-ranked champions.',
      opponentQuality: 'The best wins are excellent: RDA, Barboza, McGregor, Poirier, and Gaethje give him a strong lightweight-quality case.',
      longevity: 'Khabib’s longevity is not weak, but it is not his main argument. His ranking is built more on peak dominance and perfect record than a massive title reign.',
      counter: 'Khabib’s argument against almost anyone is purity. No losses, no real collapse, no post-prime damage, and one of the clearest primes ever.',
      edge: 'Khabib wins when the debate rewards dominance, perfection, and how unbeatable a fighter looked at his best.',
      eliteCounter: true,
      signatureWins: 'RDA, Barboza, McGregor, Poirier, and Gaethje give Khabib a compact but extremely high-quality lightweight resume.',
      weakness: 'The drag is not quality of prime; it is volume. The title reign is shorter, the title-fight count is lower, and the resume has fewer layers than the long-reign GOAT cases.',
      bestArgument: 'Khabib’s best argument is purity: no UFC losses, no real collapse, and a final stretch that looked like total separation from elite lightweights.',
      againstLongReign: 'Against deeper champions, Khabib makes the debate uncomfortable because his peak was cleaner and more dominant than almost anyone else’s.',
      titleSummary: 'Khabib’s title resume is compact, but his defenses came against elite lightweights and he retired unbeaten on top.',
      primeSummary: 'His prime run from RDA through Gaethje was one of the cleanest dominance stretches ever: short compared with long-reign champions, but almost flawless.',
      titleStyle: 'Perfect Compact Reign',
      primeStyle: 'Unbeaten Peak',
      legacyStats: {
        ufcRecord: '13-0',
        titleFightWins: 4,
        beltsWon: 1,
        titleDefenses: 3,
        activeEliteYearsLabel: 'roughly 6 active elite years',
        primeNote: 'shorter than the long-reign champions, but nearly flawless from RDA through Gaethje'
      }
    },
    watchMoment: {
      url: 'https://youtube.com/shorts/VqN3MN87_FU?is=O2pn1pdk6aS9aqo2',
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

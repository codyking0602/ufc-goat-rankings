// Do not add new fighter data here.
// LEGACY: fighter data has been migrated to assets/data/ranking-data.js.
// Islam Makhachev fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-islam-makhachev-20260702a';
  const fighter = 'Islam Makhachev';

  const packet = {
    status: {
      stage: 'complete in packet system',
      lastUpdated: '2026-07-02',
      nextFix: 'None for Islam. Migrate Alexander Volkanovski next.'
    },
    repoLocations: {
      scoreSource: 'assets/data/ranking-data.js',
      centralPacket: 'assets/data/fighter-packets/islam-makhachev.js',
      displayFallback: 'assets/data/display-overrides.js',
      compareFallback: 'assets/compare-data.js',
      profileStatsFallback: 'assets/js/fighter-profile-packages.js',
      watchFallback: 'assets/js/watch-moments.js',
      photos: 'assets/fighters/islam-makhachev.webp and assets/fighters/islam-makhachev-thumb.webp'
    },
    photos: {
      photoUrl: 'assets/fighters/islam-makhachev.webp',
      thumbUrl: 'assets/fighters/islam-makhachev-thumb.webp'
    },
    display: {
      overallOvr: 90,
      allTimeRank: 5,
      divisionLabel: 'LW / WW',
      resumeTag: 'Modern lightweight standard',
      oneLiner: 'The modern lightweight control case: elite finishing efficiency, high-end prime dominance, and a title run that keeps getting stronger.',
      categories: {
        championship: { ovr: 81, rank: 10 },
        opponentQuality: { ovr: 81, rank: 18 },
        primeDominance: { ovr: 98, rank: 2 },
        longevity: { ovr: 88, rank: 11 }
      },
      snapshot: [
        ['UFC Record', '17-1'],
        ['UFC Title-Fight Wins', '6'],
        ['Championship Level', 'Fast-Rising Champion Resume'],
        ['Quality Wins', 'Modern Lightweight Elite'],
        ['Prime Record', 'Dominant Champion Stretch'],
        ['Active Elite Years', '4.7 Elite Years'],
        ['Loss Context', 'Only UFC loss came pre-prime']
      ],
      whyRankedHere: 'Islam ranks #5 because the current scoring model sees a rare combination of elite prime dominance and a rapidly growing championship resume. His skill, control, and finishing threat already put him near the very top tier.',
      whyNotHigher: 'He is still chasing the total volume of the fighters above him. The current scoring model also carries his pre-prime Martins loss and gives him fewer total elite-year reps than the older all-time resumes above him.',
      keyJudgmentCalls: [
        ['Prime start', 'the main scoring window begins with Drew Dober in 2021.'],
        ['Volkanovski wins', 'receive top-level quality-wins credit in this ranking.'],
        ['Pre-prime loss', 'the Martins loss counts, but only lightly because it came before his prime.'],
        ['Prime dominance', 'is second-best in this ranking and the strongest part of his case outside the belt run.'],
        ['Second division', 'the welterweight piece helps the profile, but lightweight remains the center of his resume.']
      ],
      finalTakeaway: 'Islam is the modern lightweight benchmark: elite control, elite finishing, and a championship case that is already strong enough to sit in the all-time top five.'
    },
    profileStats: {
      ufcRecord: '17-1',
      titleFightWins: 6,
      eliteWins: 7,
      primeRecord: '9-0',
      finishRatePct: 75.0,
      roundsWonPct: 85.7,
      activeEliteYears: 4.7,
      timesFinishedPrime: 0,
      divisionStrengthContext: 'Modern lightweight strength is a positive, and the later welterweight piece adds extra title-level value.',
      lossContext: 'The Martins loss is pre-prime and counts lightly; his prime scoring window starts around Drew Dober.'
    },
    compareSeasoning: {
      shortCase: 'Islam is the modern lightweight resume case: elite skill, growing championship volume, and a deeper title-level resume than Khabib’s shorter run.',
      peak: 'At his best, Islam is a complete control fighter with elite grappling, improved striking, patience, defense, and the ability to beat champions across styles.',
      resume: 'Islam’s resume has grown into one of the strongest lightweight cases. The championship volume and elite-win depth have pushed him beyond a pure successor argument.',
      championship: 'His championship case is now the separator from Khabib. He has more title-fight volume and more time proving the belt against elite opponents.',
      opponentQuality: 'The best wins carry serious weight: Oliveira, Volkanovski, Poirier, Tsarukyan, Hooker, and others give him a deep modern lightweight ledger.',
      longevity: 'Islam’s longevity is still building, but he has already stacked enough elite years to make the resume feel more complete than a short peak-only case.',
      counter: 'The counterargument against Islam is that he still does not feel as untouchable as Khabib. The resume may be bigger, but the aura is not quite as clean.',
      edge: 'Islam wins when the debate rewards total resume over pure peak. His championship volume and elite-win depth have become too much to ignore.',
      eliteCounter: true,
      signatureWins: 'Oliveira, Volkanovski, Poirier, Tsarukyan, and Hooker give Islam a deep modern lightweight ledger with real championship weight.',
      weakness: 'The case is still building compared with older all-time resumes, and the pre-prime Martins loss remains a small drag.',
      titleSummary: 'Islam’s title case has grown into a deeper modern lightweight reign, with more championship volume than a short peak-only case.',
      primeSummary: 'His prime began later than Khabib’s scoring window but has already stacked elite years against modern lightweight and pound-for-pound level opponents.',
      titleStyle: 'Modern Lightweight Reign',
      primeStyle: 'Still-Building Elite Prime',
      bestArgument: 'Islam’s best argument is modern depth: elite skill, growing title volume, quality wins across styles, and a prime run that is still strengthening.',
      legacyStats: {
        ufcRecord: '17-1',
        titleFightWins: 6,
        beltsWon: 2,
        titleDefenses: 4,
        activeEliteYearsLabel: 'roughly 5 active elite years',
        primeNote: 'modern lightweight title run that later expanded into a second-division championship case'
      }
    },
    watchMoment: {
      url: 'https://youtube.com/shorts/_S2i56bqwE8?is=WYg2MSMlw8IGYa9H',
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

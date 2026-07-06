// Jose Aldo fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-jose-aldo-20260705a';
  const fighter = 'Jose Aldo';

  const packet = {
    status: { stage: 'complete in packet system', lastUpdated: '2026-07-05', nextFix: 'Finish-loss display corrected to match Aldo prime/late-prime loss context.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/jose-aldo.js', displayFallback: 'assets/data/display-overrides.js', compareFallback: 'assets/compare-data.js', profileStatsFallback: 'assets/js/fighter-profile-packages.js', watchFallback: 'assets/js/watch-moments.js', photos: 'assets/fighters/jose-aldo.webp and assets/fighters/jose-aldo-thumb.webp' },
    photos: { photoUrl: 'assets/fighters/jose-aldo.webp', thumbUrl: 'assets/fighters/jose-aldo-thumb.webp' },
    display: {
      overallOvr: 88, allTimeRank: 11, divisionLabel: 'FW / BW', resumeTag: 'Longevity legend',
      oneLiner: 'The longevity legend: an elite featherweight reign plus a late-career bantamweight resurgence that keeps his UFC case alive across eras.',
      categories: { championship: { ovr: 84, rank: 8 }, opponentQuality: { ovr: 86, rank: 9 }, primeDominance: { ovr: 85, rank: 26 }, longevity: { ovr: 94, rank: 4 } },
      snapshot: [ ['UFC Record', '14-9'], ['UFC Title-Fight Wins', '8 adjusted credit'], ['Championship Level', 'Historic Featherweight Champion'], ['Quality Wins', 'Deep Across Two Eras'], ['Prime Record', '10-4 prime/late-prime window'], ['Active Elite Years', '11.3 Elite Years'], ['Loss Context', 'McGregor + Holloway x2 finished losses; Volk decision damage'] ],
      whyRankedHere: 'Aldo ranks #11 because the current scoring model rewards his long elite shelf life, strong title work, and years of quality wins. His resume stays relevant because he held up across multiple generations of contenders.',
      whyNotHigher: 'The current scoring model is UFC-only, so his WEC era is not carrying him here. His later UFC losses and a lower prime-dominance score than the names above him keep him just outside the top ten.',
      keyJudgmentCalls: [ ['UFC-only scope', 'means the all-time WEC case is context only, not scored directly.'], ['Longevity', 'is the clear strength of the Aldo profile and one of the best scores in this ranking.'], ['Interim title', 'the UFC 200 interim win adds partial championship credit.'], ['Loss context', 'McGregor and both Holloway losses are counted as finished losses in the prime/late-prime window; Volkanovski is counted as elite decision damage.'], ['Prime dominance', 'sits lower than fans may expect, which is why his total rank lands outside the top ten here.'] ],
      finalTakeaway: 'Aldo is the longevity legend of this ranking: a great champion with a long shelf life, strong quality wins, and a UFC-only profile that still holds up near the top ten.'
    },
    profileStats: {
      ufcRecord: '14-9', titleFightWins: 5, adjustedTitleWins: 8, eliteWins: 8, primeRecord: '10-4', finishRatePct: 50.0, roundsWonPct: 64.8, activeEliteYears: 9.43, timesFinishedPrime: 3,
      divisionStrengthContext: 'UFC featherweight and bantamweight value is strong, but WEC greatness is historical context only.',
      lossContext: 'Prime/late-prime loss context: McGregor KO, Holloway TKO twice, and Volkanovski decision. Yan/Merab are treated as post-prime for penalty.'
    },
    compareSeasoning: {
      shortCase: 'Aldo is one of the great featherweight legends: championship skill, elite longevity, and enough late-career bantamweight relevance to keep his ranking case alive.',
      peak: 'At his best, Aldo was explosive, technical, and difficult to pressure cleanly. The takedown defense, leg kicks, boxing, and athleticism made him feel like a complete champion.',
      resume: 'Aldo’s resume in this ranking is complicated but still strong. His WEC run is historical context, while the scored UFC portion still has enough title value, elite wins, and longevity to rank highly.',
      championship: 'His championship case is strong, but not fully captured by this model because part of his legendary reign happened before the UFC portion being scored.',
      opponentQuality: 'Aldo’s UFC win list has real value: Edgar, Mendes, Korean Zombie, Lamas, Stephens, Moicano, Vera, and Font all help the case.',
      longevity: 'Aldo’s longevity is a major strength. Even after losing the featherweight belt, he stayed relevant and made a serious run at bantamweight.',
      counter: 'Aldo’s argument is historical greatness plus longevity. Even with the scoring boundary, he has more sustained elite relevance than many champions above and below him.',
      edge: 'Aldo wins when the debate values long-term elite relevance, championship skill, and the ability to stay dangerous across eras and divisions.',
      scope: 'Aldo’s WEC greatness matters historically, but this ranking only scores his UFC resume. That keeps the ranking consistent even if it underrates his full career legacy.',
      eliteCounter: true,
      signatureWins: 'Edgar, Mendes, Korean Zombie, Lamas, Stephens, Moicano, Vera, and Font give Aldo real scored value even with the WEC run treated as historical context.',
      weakness: 'UFC-only scope limits his full historical case, and later losses keep the resume from looking as clean as his reputation.',
      titleSummary: 'Aldo’s UFC title case is strong but incomplete without historical context because part of his legendary reign happened in WEC before the scored UFC window.',
      primeSummary: 'Aldo’s broader prime was long and legendary, while the scored UFC portion still shows elite featherweight title value and later bantamweight relevance.',
      titleStyle: 'Scope-Affected Legend', primeStyle: 'Long Historical Prime',
      legacyStats: { ufcRecord: '14-9', titleFightWins: 8, beltsWon: 1, titleDefenses: 7, activeEliteYearsLabel: 'roughly 9 active elite years in the scored window', primeNote: 'long broader featherweight prime, with UFC value continuing into his bantamweight run' }
    },
    watchMoment: { url: 'https://youtube.com/shorts/BC0MG13fz20?is=3YJEJvXqUfyAMg6W', label: 'Watch Moment' }
  };
  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyRankingDataStats(){
    const data = window.RANKING_DATA;
    if(!data || !packet.profileStats) return;
    const visibleStats = {
      primeRecord: packet.profileStats.primeRecord,
      roundsWonPct: packet.profileStats.roundsWonPct,
      timesFinishedPrime: packet.profileStats.timesFinishedPrime
    };
    [...(data.fighters || []), ...(data.men || []), ...(data.women || [])]
      .filter(row => row?.fighter === fighter)
      .forEach(row => Object.entries(visibleStats).forEach(([key,value]) => {
        if(value !== undefined && value !== null) row[key] = value;
      }));
  }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}), ...(packet.photos || {}) }; if(packet.watchMoment?.url){ DISPLAY_OVERRIDES[fighter].watchUrl = packet.watchMoment.url; DISPLAY_OVERRIDES[fighter].watchLabel = packet.watchMoment.label || 'Watch Moment'; } DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ if(!packet.compareSeasoning) return; window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: current.purpose || 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyRankingDataStats(); applyDisplay(); applyCompare(); registerPacket();
})();
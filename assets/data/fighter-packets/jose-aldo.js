// Jose Aldo fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-jose-aldo-20260705b';
  const fighter = 'Jose Aldo';

  const packet = {
    status: { stage: 'complete in packet system', lastUpdated: '2026-07-05', nextFix: 'UFC-only ranking tone rebalanced after Aldo top-10 sanity pass.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/jose-aldo.js', displayFallback: 'assets/data/display-overrides.js', compareFallback: 'assets/compare-data.js', profileStatsFallback: 'assets/js/fighter-profile-packages.js', watchFallback: 'assets/js/watch-moments.js', photos: 'assets/fighters/jose-aldo.webp and assets/fighters/jose-aldo-thumb.webp' },
    photos: { photoUrl: 'assets/fighters/jose-aldo.webp', thumbUrl: 'assets/fighters/jose-aldo-thumb.webp' },
    display: {
      overallOvr: 86, allTimeRank: 14, divisionLabel: 'FW / BW', resumeTag: 'Scope-affected legend',
      oneLiner: 'A UFC-only legend with real title value and longevity, but not a clean top-10 case once WEC is excluded and the McGregor/Holloway/Volk damage is counted.',
      categories: { championship: { ovr: 84, rank: 8 }, opponentQuality: { ovr: 83, rank: 14 }, primeDominance: { ovr: 82, rank: 22 }, longevity: { ovr: 88, rank: 12 } },
      snapshot: [ ['UFC Record', '14-9'], ['UFC Title-Fight Wins', '8 adjusted credit'], ['Championship Level', 'Historic Featherweight Champion'], ['Quality Wins', 'Strong, not top-tier'],  ['Active Elite Years', '7.1 weighted elite years'], ['Loss Context', 'McGregor + Holloway x2 finished losses; Volk decision damage'] ],
      whyRankedHere: 'Aldo ranks in the top-15 range because the UFC-only model still respects his title work, quality wins, and ability to stay relevant across featherweight and bantamweight. He is a real legend, but the app no longer treats him like a clean top-10 UFC-only résumé.',
      whyNotHigher: 'The UFC-only boundary hurts him because his full historical peak includes WEC. Inside the UFC-only scoring window, the McGregor KO, Holloway TKO losses, Volkanovski loss, and uneven back half make him too damaged for the top ten.',
      keyJudgmentCalls: [ ['UFC-only scope', 'means the all-time WEC case is context only, not scored directly.'], ['Title value', 'his UFC title defenses still matter, but inheriting the belt from the WEC transition is treated with some context.'], ['Loss context', 'McGregor and both Holloway losses are counted as finished losses in the prime/late-prime window; Volkanovski is counted as elite decision damage.'], ['Longevity', 'the bantamweight resurgence helps, but it no longer gets max-style elite continuity credit.'], ['Prime dominance', 'is strong historically, but the UFC-only version is not clean enough for top-10 treatment.'] ],
      finalTakeaway: 'Aldo is a scope-affected legend: historically massive, still very strong in UFC-only scoring, but more believable around the top-14/top-15 range than as a top-10 UFC-only GOAT.'
    },
    profileStats: {
      ufcRecord: '14-9', titleFightWins: 5, adjustedTitleWins: 8, eliteWins: 8,  finishRatePct: 50.0, roundsWonPct: 64.8, activeEliteYears: 7.10, timesFinishedPrime: 3,
      divisionStrengthContext: 'UFC featherweight and bantamweight value is strong, but WEC greatness is historical context only.',
      lossContext: 'Prime/late-prime loss context: McGregor KO, Holloway TKO twice, and Volkanovski decision. Yan/Merab are treated as post-prime for penalty.'
    },
    compareSeasoning: {
      shortCase: 'Aldo is a scope-affected UFC-only legend: strong title value, real longevity, and quality wins, but not the same case he has when WEC is included.',
      peak: 'At his best historically, Aldo was explosive, technical, and difficult to pressure cleanly. In UFC-only scoring, that peak is partially outside the model, so the app grades him more conservatively.',
      resume: 'Aldo’s resume in this ranking is strong but complicated. His WEC run is historical context, while the scored UFC portion still has title value and longevity but carries major McGregor/Holloway/Volk damage.',
      championship: 'His championship case is strong, but not fully captured by this model because part of his legendary reign happened before the UFC portion being scored.',
      opponentQuality: 'Aldo’s UFC win list has real value: Edgar, Mendes, Korean Zombie, Lamas, Stephens, Moicano, Vera, and Font all help the case. It is strong, but not enough to make him a clean top-10 UFC-only résumé.',
      longevity: 'Aldo’s longevity still helps, especially the bantamweight run, but it is no longer treated like max elite continuity after the post-title losses.',
      counter: 'Aldo’s argument is historical greatness plus longevity. If WEC is included, his case jumps. In this UFC-only ranking, that context is respected but not scored directly.',
      edge: 'Aldo wins debates when the opponent has weaker championship proof or less sustained elite relevance. He loses more often when the opponent has a cleaner UFC-only prime or stronger modern quality wins.',
      scope: 'Aldo’s WEC greatness matters historically, but this ranking only scores his UFC resume. That keeps the ranking consistent even if it underrates his full career legacy.',
      eliteCounter: true,
      signatureWins: 'Edgar, Mendes, Korean Zombie, Lamas, Stephens, Moicano, Vera, and Font give Aldo real scored value even with the WEC run treated as historical context.',
      weakness: 'UFC-only scope limits his full historical case, and the McGregor/Holloway/Volk stretch keeps the résumé from looking like a top-10 UFC-only case.',
      titleSummary: 'Aldo’s UFC title case is strong but incomplete without historical context because part of his legendary reign happened in WEC before the scored UFC window.',
      primeSummary: 'Aldo’s broader prime was long and legendary, while the UFC-only scored version is damaged by three finished losses and the Volkanovski decision.',
      titleStyle: 'Scope-Affected Legend', primeStyle: 'Damaged UFC-Only Prime',
      legacyStats: { ufcRecord: '14-9', titleFightWins: 8, beltsWon: 1, titleDefenses: 7, activeEliteYearsLabel: 'roughly 7 weighted active elite years in the scored window', primeNote: 'long broader featherweight prime, but UFC-only scoring carries major McGregor/Holloway/Volk damage' }
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
      timesFinishedPrime: packet.profileStats.timesFinishedPrime,
      activeEliteYears: packet.profileStats.activeEliteYears
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
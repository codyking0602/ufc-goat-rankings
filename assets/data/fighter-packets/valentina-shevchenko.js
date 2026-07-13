// Valentina Shevchenko fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-valentina-shevchenko-20260710b-ufc-record';
  const fighter = 'Valentina Shevchenko';
  const packet = {
    status: { stage: 'packet live; UFC-only record corrected; photos and Watch Moment needed', lastUpdated: '2026-07-10', nextFix: 'Add Valentina photos and Watch Moment link.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/valentina-shevchenko.js', compareFallback: 'assets/compare-coverage-pack-2.js' },
    display: {
      divisionLabel: 'FLW / BW',
      resumeTag: 'Technical flyweight standard',
      oneLiner: 'The clean technical champion case: long flyweight reign, elite skill, strong opponent quality, and direct rivalry context behind Nunes.',
      snapshot: [ ['UFC Record', '14-3-1'], ['UFC Title-Fight Wins', '9'], ['Championship Level', 'Long Flyweight Reign'], ['Quality Wins', 'Deep Cross-Division Ledger'],  ['Active Elite Years', '8.0 Elite Years'], ['Loss Context', 'Nunes rivalry and Grasso stretch cap the case'] ],
      whyRankedHere: 'Valentina ranks women’s #2 because her UFC flyweight reign was long, technical, and consistent. She also has meaningful bantamweight context, strong opponent quality, and years of title-level control.',
      whyNotHigher: 'She does not pass Nunes because Nunes owns the direct rivalry edge and the stronger two-division title case. Valentina’s flyweight reign is excellent, but Nunes has the cleaner women’s GOAT separation.',
      keyJudgmentCalls: [ ['Nunes rivalry', 'central reason she trails Amanda even with elite technical dominance.'], ['Flyweight reign', 'the backbone of her ranking and the best women’s flyweight title case.'], ['Grasso rivalry', 'adds both damage and title-regain context.'], ['Bantamweight context', 'helps opponent quality but does not replace flyweight title value.'], ['Technical dominance', 'a major reason her OVR stays close to Nunes.'] ],
      finalTakeaway: 'Valentina is the women’s technical standard: long-reigning, complete, and consistent, but direct rivalry and two-division value keep Nunes ahead.'
    },
    profileStats: { ufcRecord: '14-3-1', titleFightWins: 9, eliteWins: 10,  finishRatePct: 50.0, roundsWonPct: 72.5, activeEliteYears: 8.0, timesFinishedPrime: 1, divisionStrengthContext: 'Flyweight reign is the scoring center, with bantamweight context helping opponent quality.', lossContext: 'Nunes losses and the Grasso rivalry matter, but the title regain keeps the case strong.' },
    compareSeasoning: {
      shortCase: 'Valentina is the clean technical champion case: long flyweight reign, elite skill, high opponent quality, and a resume that only trails Nunes because of direct rivalry and two-division title value.',
      peak: 'At her best, Valentina was balance, timing, counters, clinch control, kicks, grappling, and five-round composure. She made championship fights feel controlled and technical.',
      resume: 'Valentina’s UFC resume is built on flyweight dominance plus high-level bantamweight context. The Nunes losses matter, but they also show she was competitive with the women’s GOAT standard.',
      championship: 'Her championship case is excellent: long flyweight title reign, repeated defenses, and a later title regain that keeps the story from ending with the Grasso loss.',
      opponentQuality: 'Joanna, Andrade, Holm, Julianna, Chookagian, Murphy, Carmouche, Maia, Santos, Grasso, and Eye give Valentina a strong cross-division UFC win list.',
      longevity: 'Valentina stayed elite for years, across bantamweight and flyweight, with one of the longest high-level windows in women’s UFC history.',
      counter: 'The argument against Valentina is Nunes. She came close, but Nunes owns the direct edge and the stronger two-division championship case.',
      edge: 'Valentina wins comparisons when technical dominance, long flyweight control, and active elite years outweigh bigger but shorter peak cases.',
      eliteCounter: true,
      signatureWins: 'Joanna, Andrade, Holm, Julianna, Chookagian, Murphy, Carmouche, Maia, Santos, Grasso, and Eye give Valentina a deep women’s UFC resume.',
      weakness: 'The Nunes rivalry and Grasso stretch prevent a completely clean women’s GOAT case.',
      titleSummary: 'Valentina’s title case is a long flyweight reign with repeated defenses and a title regain, but it does not have Nunes’ two-division separation.',
      primeSummary: 'Her elite window was long and technical, with years of title-level control across bantamweight and flyweight.',
      titleStyle: 'Technical Flyweight Standard', primeStyle: 'Long Technical Prime',
      legacyStats: { ufcRecord: '14-3-1', titleFightWins: 9, beltsWon: 1, titleDefenses: 7, activeEliteYearsLabel: 'roughly 8 active elite years', primeNote: 'long technical flyweight title prime with strong bantamweight context' }
    }
  };
  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}) }; DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();
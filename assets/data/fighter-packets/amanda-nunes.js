// Amanda Nunes fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-amanda-nunes-20260702a';
  const fighter = 'Amanda Nunes';
  const packet = {
    status: { stage: 'packet live; photos and Watch Moment needed', lastUpdated: '2026-07-02', nextFix: 'Add Amanda photos and Watch Moment link.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/amanda-nunes.js', compareFallback: 'assets/compare-coverage-pack-2.js' },
    display: {
      overallOvr: 94,
      allTimeRank: 1,
      divisionLabel: 'BW / FW',
      resumeTag: 'Women’s UFC GOAT standard',
      oneLiner: 'The women’s UFC GOAT case: two-division champion, huge title-fight volume, legendary finishes, and the deepest women’s win list in this ranking.',
      categories: { championship: { ovr: 96, rank: 1 }, opponentQuality: { ovr: 94, rank: 1 }, primeDominance: { ovr: 93, rank: 1 }, longevity: { ovr: 91, rank: 2 } },
      snapshot: [ ['UFC Record', '16-3'], ['UFC Title-Fight Wins', '11'], ['Championship Level', 'Two-Division Women’s GOAT'], ['Quality Wins', 'Deepest Women’s UFC Ledger'], ['Prime Record', 'Long Violent Title Prime'], ['Active Elite Years', '7.0 Elite Years'], ['Loss Context', 'Pena upset matters, but revenge restored the case'] ],
      whyRankedHere: 'Nunes ranks as the women’s #1 because her UFC resume has the cleanest separation: bantamweight title control, featherweight title value, the Cyborg knockout, the Rousey finish, Shevchenko rivalry value, and years of elite wins.',
      whyNotHigher: 'On the full app board, she does not pass the top men because this ranking keeps the men’s and women’s boards separate and does not pretend division depth is identical. Within the women’s board, she is the clear benchmark.',
      keyJudgmentCalls: [ ['Two-division value', 'bantamweight and featherweight gold drive the championship case.'], ['Cyborg knockout', 'one of the biggest single wins in women’s MMA history and a major UFC legacy moment.'], ['Shevchenko rivalry', 'direct edge over Valentina is central to the women’s GOAT separation.'], ['Pena upset', 'a real blemish, but the rematch win restores a lot of the damage.'], ['Featherweight depth', 'thin division context matters, but it does not erase the two-division value.'] ],
      finalTakeaway: 'Nunes is the women’s UFC GOAT standard: two belts, deep elite wins, violent title dominance, and direct separation over every major rival from her era.'
    },
    profileStats: { ufcRecord: '16-3', titleFightWins: 11, eliteWins: 11, primeRecord: '12-2', finishRatePct: 81.3, roundsWonPct: 74.0, activeEliteYears: 7.0, timesFinishedPrime: 1, divisionStrengthContext: 'Bantamweight carries the core case; featherweight adds two-division title value with thin-depth context.', lossContext: 'The Pena upset is a real drag, but the rematch win protects the overall GOAT case.' },
    compareSeasoning: {
      shortCase: 'Nunes is the women’s GOAT standard: two-division champion, massive title-fight volume, legendary finishes, and wins over nearly every major name from her era.',
      peak: 'At her best, Nunes was power, athleticism, takedown defense, jiu-jitsu, confidence, and finishing danger. She could erase great fighters quickly or beat them over five rounds.',
      resume: 'Nunes has the strongest women’s UFC resume: bantamweight reign, featherweight title value, Shevchenko rivalry, Cyborg knockout, Rousey finish, and years of title control.',
      championship: 'Her championship case is the clearest among women. She won belts in two divisions, defended repeatedly, avenged the Pena loss, and retired with the resume still intact.',
      opponentQuality: 'Shevchenko twice, Cyborg, Rousey, Holm, Tate, de Randamie, Pena, Aldana, Spencer, and Anderson give Nunes the deepest women’s win list.',
      longevity: 'Nunes stayed elite across a long title window and did it in two divisions, which gives her a separation point over shorter peak cases.',
      counter: 'The only real argument against Nunes is the Pena upset and the fact that women’s featherweight depth was thin. It matters, but it does not erase the whole case.',
      edge: 'Nunes wins women’s comparisons when total title weight, two-division value, and elite-name wins are the deciding factors.',
      eliteCounter: true,
      signatureWins: 'Shevchenko twice, Cyborg, Rousey, Holm, Tate, de Randamie, Pena, Aldana, Spencer, and Megan Anderson give Nunes the deepest women’s UFC win list.',
      weakness: 'The Pena upset and featherweight depth context are the only real brakes on an otherwise clear women’s GOAT case.',
      titleSummary: 'Nunes has the strongest women’s UFC title case: two belts, repeated defenses, a Cyborg knockout, and the Pena revenge win.',
      primeSummary: 'Her elite window was long, violent, and title-heavy, with enough two-division value to separate her from every other women’s case.',
      titleStyle: 'Women’s GOAT Two-Division Champion', primeStyle: 'Long Violent Title Prime',
      legacyStats: { ufcRecord: '16-3', titleFightWins: 11, beltsWon: 2, titleDefenses: 7, activeEliteYearsLabel: 'roughly 7 active elite years', primeNote: 'long two-division title prime with the deepest women’s UFC win list' }
    }
  };
  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}) }; DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();
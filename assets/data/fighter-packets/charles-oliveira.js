// Charles Oliveira fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-charles-oliveira-20260710b-current-record';
  const fighter = 'Charles Oliveira';
  const packet = {
    status: { stage: 'packet live; current UFC record reconciled; photos and Watch Moment needed', lastUpdated: '2026-07-10', nextFix: 'Add Charles photos and Watch Moment link.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/charles-oliveira.js', compareFallback: 'assets/compare-data.js' },
    display: {
      overallOvr: 84, allTimeRank: 24, divisionLabel: 'LW', resumeTag: 'Late-blooming finish king',
      oneLiner: 'The late-blooming lightweight chaos case: elite finishing value, huge quality wins, and a messy record that keeps the score volatile.',
      categories: { championship: { ovr: 74, rank: 27 }, opponentQuality: { ovr: 91, rank: 3 }, primeDominance: { ovr: 92, rank: 6 }, longevity: { ovr: 78, rank: 27 } },
      snapshot: [ ['UFC Record', '25-11'], ['UFC Title-Fight Wins', '3'], ['Championship Level', 'Short Lightweight Champion Run'], ['Quality Wins', 'Elite Lightweight Finish Ledger'],  ['Active Elite Years', '4.0 Elite Years'], ['Loss Context', 'Early and prime losses create major drag'] ],
      whyRankedHere: 'Oliveira ranks here because his high-end lightweight run is impossible to ignore. Chandler, Poirier, Gaethje, Dariush, Ferguson, and Lee give him one of the most dangerous quality-win ledgers in the ranking.',
      whyNotHigher: 'He does not rank higher because the loss penalty is heavy and the title reign was short. The highs are elite, but the full UFC resume is messier than the cleaner champion cases.',
      keyJudgmentCalls: [ ['Quality wins', 'the biggest strength of the Charles case.'], ['Finish threat', 'central to his prime and why the resume feels so dangerous.'], ['Late-blooming prime', 'the scoring window protects the best lightweight run but cannot erase earlier damage.'], ['Islam and Topuria losses', 'real elite title losses that cap the lightweight supremacy case.'], ['Title volume', 'short reign keeps him below longer champions even with strong wins.'] ],
      finalTakeaway: 'Charles is the lightweight chaos-finishing legend: dangerous, accomplished, and loaded with quality wins, but too messy to rank with the clean long-reign champions.'
    },
    profileStats: { ufcRecord: '25-11', titleFightWins: 3, eliteWins: 8, finishRatePct: 86.4, roundsWonPct: 62.0, activeEliteYears: 4.0, timesFinishedPrime: 3, divisionStrengthContext: 'Lightweight strength is a major positive for his quality-win score.', lossContext: 'The record is messy, with early losses plus Islam, Arman, and Topuria creating real drag.' },
    compareSeasoning: {
      shortCase: 'Oliveira is the late-blooming lightweight danger case: elite finishing, huge quality wins, and one of the most exciting title peaks in the division’s history.',
      peak: 'At his best, Charles was constant danger: submissions, knees, front kicks, pressure, counters, and the ability to survive chaos long enough to finish elite lightweights.',
      resume: 'Oliveira’s resume is high-value and messy. The lightweight peak is elite, but the full UFC record carries too much damage to rank like a clean champion case.',
      championship: 'His championship case is strong but short: belt win, one defense, and title-level wins that felt bigger because of the opponent quality and finishing style.',
      opponentQuality: 'Chandler, Poirier, Gaethje, Dariush, Ferguson, and Lee give Oliveira one of the most dangerous lightweight quality-win ledgers in the ranking.',
      longevity: 'The UFC career is long, but the true elite-title window is shorter. That is why the score rewards the peak without over-crediting the full calendar run.',
      counter: 'Oliveira’s argument is quality and danger. He beat elite lightweights in violent fashion and was never a normal champion to prepare for.',
      edge: 'Oliveira wins comparisons when lightweight quality wins, finishing value, and prime chaos outweigh record cleanliness.',
      eliteCounter: true,
      signatureWins: 'Chandler, Poirier, Gaethje, Dariush, Ferguson, and Lee give Oliveira a dangerous lightweight finishing resume.',
      weakness: 'The loss column is the drag. The prime was great, but the full UFC-only record is too messy for the deeper GOAT tier.',
      titleSummary: 'Oliveira’s title case is short but valuable: belt win, defense-level value, and elite lightweight finishes.',
      primeSummary: 'His late lightweight peak was elite and violent, but not long enough to erase the earlier and later losses.',
      titleStyle: 'Late-Blooming Lightweight Champion', primeStyle: 'Chaos Finish Prime',
      legacyStats: { ufcRecord: '25-11', titleFightWins: 3, beltsWon: 1, titleDefenses: 1, activeEliteYearsLabel: 'roughly 4 active elite years', primeNote: 'late-blooming lightweight title peak with elite finishing value' }
    }
  };
  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}) }; DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: current.purpose || 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();

// Do not add new fighter data here.
// LEGACY: fighter data has been migrated to assets/data/ranking-data.js.
// Henry Cejudo fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-henry-cejudo-20260702a';
  const fighter = 'Henry Cejudo';
  const packet = {
    status: { stage: 'packet live; photos and Watch Moment needed', lastUpdated: '2026-07-02', nextFix: 'Add Henry photos and Watch Moment link.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/henry-cejudo.js', compareFallback: 'assets/compare-data.js' },
    display: {
      overallOvr: 83, allTimeRank: 24, divisionLabel: 'FLW / BW', resumeTag: 'Compact double-champ burst',
      oneLiner: 'The compact achievement burst: flyweight gold, bantamweight gold, huge name wins, and a short window that limits total volume.',
      categories: { championship: { ovr: 78, rank: 19 }, opponentQuality: { ovr: 78, rank: 25 }, primeDominance: { ovr: 86, rank: 21 }, longevity: { ovr: 82, rank: 21 } },
      snapshot: [ ['UFC Record', '10-4'], ['UFC Title-Fight Wins', '4'], ['Championship Level', 'Two-Division UFC Champion'], ['Quality Wins', 'DJ, Dillashaw, Moraes, Cruz'], ['Prime Record', 'Short Achievement Burst'], ['Active Elite Years', '4.0 Elite Years'], ['Loss Context', 'Short window and return losses cap the case'] ],
      whyRankedHere: 'Cejudo ranks here because he packed major value into a short UFC window: flyweight title, bantamweight title, the Demetrious Johnson win, and a fast run through elite names.',
      whyNotHigher: 'He does not rank higher because the title window is short and the total UFC volume is limited. The achievements are loud, but the long-reign proof is not there.',
      keyJudgmentCalls: [ ['Double-champ value', 'a major part of the case.'], ['DJ win', 'huge high-end flyweight value, even with close-fight context.'], ['Dillashaw and Moraes wins', 'make the title burst feel historically loud.'], ['Retirement gap', 'limits active elite longevity.'], ['Return losses', 'add drag and make the case less clean.'] ],
      finalTakeaway: 'Cejudo is the compact double-champ case: one of the most efficient achievement bursts in UFC history, but too short to outrank deeper long-reign resumes.'
    },
    profileStats: { ufcRecord: '10-4', titleFightWins: 4, eliteWins: 5, primeRecord: '6-2', finishRatePct: 40.0, roundsWonPct: 63.5, activeEliteYears: 4.0, timesFinishedPrime: 1, divisionStrengthContext: 'Two-division value matters, with flyweight context adjusted and bantamweight value treated strongly.', lossContext: 'Return losses and short title window cap the ranking despite loud peak achievements.' },
    compareSeasoning: {
      shortCase: 'Cejudo is one of the best short-window legacy cases in the sport: flyweight champion, bantamweight champion, and a fighter who packed a lot of value into a compact UFC run.',
      peak: 'Cejudo’s peak was absurdly efficient: he beat Demetrious Johnson, finished T.J. Dillashaw, moved up, and won bantamweight gold against Marlon Moraes.',
      resume: 'His issue is volume. The high-end wins are excellent, but the long-term UFC resume is short compared with the deeper all-time champions.',
      championship: 'Cejudo has real championship shine because of the two-division achievement, but he does not have the long title reign or defense volume of the bigger all-time cases.',
      opponentQuality: 'The best Cejudo names are strong: Demetrious Johnson, T.J. Dillashaw, Marlon Moraes, Dominick Cruz, and Jussier Formiga give him real elite-name value.',
      longevity: 'The retirement gap and short title window keep Cejudo from climbing as high as fighters with years of sustained championship relevance.',
      counter: 'Cejudo’s argument is peak efficiency. He did a lot in a small window, and his best wins are loud enough to make him dangerous in almost any comparison.',
      edge: 'Cejudo wins when compact championship achievement and two-division value matter more than long-term title volume.',
      eliteCounter: true,
      signatureWins: 'Demetrious Johnson, T.J. Dillashaw, Marlon Moraes, Dominick Cruz, and Jussier Formiga give Cejudo a compact but loud elite-win stack.',
      weakness: 'The short window and return losses keep him below deeper all-time championship resumes.',
      titleSummary: 'Cejudo won UFC gold in two divisions, but the title window was short and does not have long-reign defense volume.',
      primeSummary: 'His best UFC work came in a compact burst from the DJ rematch through the Dillashaw and Moraes wins.',
      titleStyle: 'Compact Double Champ', primeStyle: 'Short Achievement Burst',
      legacyStats: { ufcRecord: '10-4', titleFightWins: 4, beltsWon: 2, titleDefenses: 2, activeEliteYearsLabel: 'roughly 4 active elite years', primeNote: 'compact achievement burst across flyweight and bantamweight' }
    }
  };
  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}) }; DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();
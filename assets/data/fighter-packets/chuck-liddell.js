// Do not add new fighter data here.
// LEGACY: fighter data has been migrated to assets/data/ranking-data.js.
// Chuck Liddell fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-chuck-liddell-20260702a';
  const fighter = 'Chuck Liddell';

  const packet = {
    status: { stage: 'packet live; Watch Moment needed', lastUpdated: '2026-07-02', nextFix: 'Add Chuck Watch Moment link when Cody picks one.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/chuck-liddell.js', displayFallback: 'assets/data/display-overrides.js', compareFallback: 'assets/compare-coverage-pack-1.js', photos: 'assets/fighters/chuck-liddell.webp and assets/fighters/chuck-liddell-thumb.webp' },
    photos: { photoUrl: 'assets/fighters/chuck-liddell.webp', thumbUrl: 'assets/fighters/chuck-liddell-thumb.webp' },
    display: {
      overallOvr: 84, allTimeRank: 21, divisionLabel: 'LHW', resumeTag: 'Classic LHW knockout aura',
      oneLiner: 'The classic light heavyweight star case: knockout aura, title defenses, Tito/Couture rivalry value, and a rough late-career ending.',
      categories: { championship: { ovr: 80, rank: 15 }, opponentQuality: { ovr: 80, rank: 21 }, primeDominance: { ovr: 87, rank: 19 }, longevity: { ovr: 84, rank: 18 } },
      snapshot: [ ['UFC Record', '16-7'], ['UFC Title-Fight Wins', '5'], ['Championship Level', 'Classic LHW Champion'], ['Quality Wins', 'Tito and Couture Anchor the Case'], ['Prime Record', 'Knockout-Aura Prime'], ['Active Elite Years', '5.5 Elite Years'], ['Loss Context', 'Late knockout losses hurt the back half'] ],
      whyRankedHere: 'Liddell ranks here because his light heavyweight title run and rivalry wins were central to the UFC’s breakout era. He had real championship volume, major star power, and a dangerous peak built around knockout threat.',
      whyNotHigher: 'He does not rank higher because later light heavyweight resumes are deeper and cleaner, and the late knockout losses drag the UFC-only profile hard.',
      keyJudgmentCalls: [ ['Era impact', 'matters as context, but the ranking still scores UFC resume value.'], ['Rivalry wins', 'Tito and Couture wins carry a large part of the case.'], ['Title defenses', 'give real championship value for his era.'], ['Late losses', 'hurt the record and durability perception.'], ['Opponent depth', 'is solid but not top-tier compared with Jones or modern deep divisions.'] ],
      finalTakeaway: 'Chuck is the classic UFC light heavyweight star: real title value and huge knockout aura, held back by a rough ending and deeper later-era resumes.'
    },
    profileStats: { ufcRecord: '16-7', titleFightWins: 5, eliteWins: 7, primeRecord: '10-3', finishRatePct: 75.0, roundsWonPct: 66.0, activeEliteYears: 5.5, timesFinishedPrime: 3, divisionStrengthContext: 'Early-modern light heavyweight value is respected, but later LHW depth sets a higher all-time bar.', lossContext: 'Late knockout losses are a real drag and keep him below cleaner champion cases.' },
    compareSeasoning: {
      shortCase: 'Chuck is the classic light heavyweight champion case: knockout aura, title defenses, Tito and Couture rivalries, and one of the defining star runs of the early modern UFC.',
      peak: 'At his best, Chuck was sprawl-and-brawl pressure, knockout power, defensive wrestling, and the confidence to force dangerous exchanges.',
      resume: 'Chuck’s UFC case is built on a real title reign and major rivalry wins, though the late knockout losses make the ending rough.',
      championship: 'The championship case is strong for his era: he won the light heavyweight title, defended it multiple times, and was the face of the division during the UFC breakout period.',
      opponentQuality: 'Couture twice, Ortiz twice, Belfort, Sobral, Horn, Monson, and Mezger give Chuck a meaningful UFC win list with major rivalry value.',
      longevity: 'Chuck’s elite window had real weight, but the post-prime knockout losses clearly damage the back half of the case.',
      counter: 'Chuck’s argument is peak aura and era impact. The knock is that the resume is not as deep or clean as later light heavyweight and pound-for-pound cases.',
      edge: 'Chuck wins comparisons when title-reign value, knockout aura, and era-defining star power matter more than clean longevity.',
      eliteCounter: true,
      signatureWins: 'Couture twice, Ortiz twice, Belfort, Sobral, Horn, Monson, and Mezger give Chuck a strong light heavyweight era resume.',
      weakness: 'The late knockout losses and later-era LHW depth keep him below the cleaner long-reign champions.',
      titleSummary: 'Chuck’s title case is a real light heavyweight reign with multiple defenses and major rivalry wins during the UFC breakout years.',
      primeSummary: 'His prime had huge knockout aura, but the ending was rough and keeps him below cleaner long-reign champions.',
      titleStyle: 'Classic Light Heavyweight Reign', primeStyle: 'Knockout Aura Prime',
      legacyStats: { ufcRecord: '16-7', titleFightWins: 5, beltsWon: 1, titleDefenses: 4, activeEliteYearsLabel: 'roughly 5 active elite years', primeNote: 'classic light heavyweight knockout prime with a rough post-prime ending' }
    }
  };
  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}), ...(packet.photos || {}) }; DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: current.purpose || 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();
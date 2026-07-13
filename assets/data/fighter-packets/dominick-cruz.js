// Dominick Cruz fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-dominick-cruz-20260702a';
  const fighter = 'Dominick Cruz';
  const packet = {
    status: { stage: 'packet live; photos and Watch Moment needed', lastUpdated: '2026-07-02', nextFix: 'Add Cruz photos and Watch Moment link.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/dominick-cruz.js', compareFallback: 'assets/compare-data.js' },
    display: {
      divisionLabel: 'BW', resumeTag: 'Injury-fragmented champion',
      oneLiner: 'The movement genius case: brilliant bantamweight skill, a legendary comeback, and a UFC-only resume capped by injuries and long gaps.',
      snapshot: [ ['UFC Record', '7-4'], ['UFC Title-Fight Wins', '3'], ['Championship Level', 'Fragmented UFC Champion'], ['Quality Wins', 'Dillashaw and DJ Anchor the Case'],  ['Active Elite Years', '5.0 Elite Years'], ['Loss Context', 'Injuries and late losses cap the case'] ],
      whyRankedHere: 'Cruz ranks here because his best UFC work is brilliant. The Demetrious Johnson win, the Dillashaw comeback, and his unique championship style give him a real all-time bantamweight case inside the UFC scoring boundary.',
      whyNotHigher: 'He does not rank higher because this is UFC-only and active elite years matter more than calendar legacy. The WEC reign is historical context only, and the injuries created too many gaps to score like a long uninterrupted UFC reign.',
      keyJudgmentCalls: [ ['WEC reign', 'historical context only, not main scoring credit.'], ['Dillashaw comeback', 'a huge UFC legacy win and the center of his title case.'], ['Injury gaps', 'cap active elite years even though the calendar span is long.'], ['Late losses', 'create drag but do not erase the prime skill case.'], ['Skill vs resume', 'his tactical genius grades higher than the raw UFC-only resume volume.'] ],
      finalTakeaway: 'Cruz is the injury-fragmented genius: one of the smartest and most unique champions ever, but UFC-only scoring keeps the total resume below the deeper title-volume cases.'
    },
    profileStats: { ufcRecord: '7-4', titleFightWins: 3, eliteWins: 4,  finishRatePct: 28.6, roundsWonPct: 66.0, activeEliteYears: 5.0, timesFinishedPrime: 1, divisionStrengthContext: 'Bantamweight value is strong, but WEC accomplishments are context only.', lossContext: 'Late losses and injury gaps cap the all-time UFC-only case.' },
    compareSeasoning: {
      shortCase: 'Cruz is one of the smartest and most unique champions ever: brilliant footwork, elite fight IQ, a historic comeback, and a complicated resume shaped by injuries and gaps.',
      peak: 'At his best, Cruz was a puzzle. The movement, timing, defensive reads, and awkward entries made him one of the hardest champions to prepare for.',
      resume: 'Cruz’s resume is brilliant but fragmented. The highs are elite, especially the Dillashaw comeback, but injuries and gaps limit the total UFC volume.',
      championship: 'His championship case has real shine because of how unique the reign and comeback were, but the scored volume is lighter than the longer title-run champions.',
      opponentQuality: 'Dillashaw, Faber, Demetrious Johnson, and Mizugaki give Cruz meaningful UFC win value, though part of his broader historical case sits outside this scoring boundary.',
      longevity: 'Cruz’s longevity is complicated. He stayed relevant over a huge calendar span, but the model cares about active elite years, and injuries created major gaps.',
      counter: 'Cruz’s argument is uniqueness and comeback value. Few fighters ever returned from that much time away and beat a champion like Dillashaw.',
      edge: 'Cruz wins when the debate values tactical brilliance, comeback legacy, and peak skill over raw fight volume.',
      scope: 'Cruz’s WEC run is historical context, but this ranking scores his UFC resume. That keeps the comparison consistent while limiting his full historical picture.',
      eliteCounter: true,
      signatureWins: 'Dillashaw, Faber, Demetrious Johnson, and Mizugaki give Cruz meaningful win value, with the Dillashaw comeback carrying huge legacy weight.',
      weakness: 'The injuries and WEC/UFC scoring boundary keep the résumé lighter than his full historical reputation.',
      titleSummary: 'Cruz’s UFC title case has real shine, especially the Dillashaw comeback, but injuries and gaps limit the total scored title volume.',
      primeSummary: 'His prime is fragmented: brilliant at his best, but interrupted by long layoffs that cap active elite years.',
      titleStyle: 'Fragmented Champion Case', primeStyle: 'Injury-Interrupted Prime',
      legacyStats: { ufcRecord: '7-4', titleFightWins: 3, beltsWon: 1, titleDefenses: 2, activeEliteYearsLabel: 'roughly 5 active elite years', primeNote: 'brilliant but injury-fragmented prime with long gaps between elite wins' }
    }
  };
  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}) }; DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: current.purpose || 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();
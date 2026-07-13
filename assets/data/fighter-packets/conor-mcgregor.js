// Conor McGregor fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-conor-mcgregor-20260702a';
  const fighter = 'Conor McGregor';
  const packet = {
    status: { stage: 'packet live; photos and Watch Moment needed', lastUpdated: '2026-07-02', nextFix: 'Add Conor photos and Watch Moment link.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/conor-mcgregor.js', compareFallback: 'assets/compare-data.js' },
    display: {
      divisionLabel: 'FW / LW / WW', resumeTag: 'Compact double-champ star',
      oneLiner: 'The iconic-moment case: Aldo in 13 seconds, Alvarez double-champ masterclass, unmatched UFC star power, and a short prime window.',
      snapshot: [ ['UFC Record', '10-4'], ['UFC Title-Fight Wins', '3'], ['Championship Level', 'First Simultaneous Double Champ'], ['Quality Wins', 'Aldo and Alvarez Anchor the Case'],  ['Active Elite Years', '3.0 Elite Years'], ['Loss Context', 'No defenses and later losses cap the resume'] ],
      whyRankedHere: 'McGregor ranks here because his best UFC moments are enormous. The Aldo knockout, Alvarez masterclass, Mendes win, Holloway win, and Poirier early win make his peak impact impossible to ignore.',
      whyNotHigher: 'He does not rank higher because the long-term UFC body of work is short. No title defenses, inactivity, and later losses keep the scoring honest even though the cultural impact is unmatched.',
      keyJudgmentCalls: [ ['Star power', 'respected in the profile but not allowed to replace championship volume.'], ['Aldo knockout', 'one of the biggest single wins in UFC history.'], ['Alvarez win', 'historic double-champ value and one of the cleanest title performances ever.'], ['No title defenses', 'major reason the championship score stays capped.'], ['Later losses', 'drag the resume but do not erase the short prime.'] ],
      finalTakeaway: 'Conor is the UFC iconic-moment king: massive peak impact and history-changing star power, but a shorter and less defended resume than the deeper GOAT cases.'
    },
    profileStats: { ufcRecord: '10-4', titleFightWins: 3, eliteWins: 6,  finishRatePct: 80.0, roundsWonPct: 64.0, activeEliteYears: 3.0, timesFinishedPrime: 1, divisionStrengthContext: 'Featherweight and lightweight title value matter, while welterweight fights are treated mostly as context.', lossContext: 'Diaz and later Poirier losses plus inactivity cap the total UFC-only case.' },
    compareSeasoning: {
      shortCase: 'Conor is the star-power and iconic-moment case: the Aldo knockout, the Alvarez masterclass, the double-champ moment, and the biggest cultural impact in UFC history.',
      peak: 'At his best, Conor was a terrifying precision striker with timing, distance control, confidence, and left-hand power that changed fights instantly.',
      resume: 'Conor’s resume is high-impact but short. The best moments are enormous, but the long-term ranked body of work does not match the deeper all-time champions.',
      championship: 'His championship case is historically important because of the two-division achievement, but he lacks the title-defense volume that drives the top of the ranking.',
      opponentQuality: 'Aldo, Alvarez, Poirier, Holloway, Mendes, and Diaz give Conor real name value, but timing and volume keep the opponent-quality case below the elite resume monsters.',
      longevity: 'Longevity is the problem. Conor’s prime window was electric, but short, and later inactivity keeps the resume from growing.',
      counter: 'Conor’s argument is impact. If the debate is iconic moments, star power, and changing the business, he is in a class almost by himself.',
      edge: 'Conor wins comparisons when peak fame, historic moments, and two-division star power outweigh deeper but less spectacular resumes.',
      starPower: 'Conor should never be treated like a normal resume case. His ranking score should stay honest, but the app should respect that his cultural impact is unmatched.',
      eliteCounter: true,
      signatureWins: 'Aldo, Alvarez, Mendes, Poirier, Holloway, and Diaz give Conor a high-impact win list even though the long-term resume is short.',
      weakness: 'No title defenses, inactivity, and later losses keep the ranking lower than the fame suggests.',
      titleSummary: 'Conor’s title case is historically important because of the two-division achievement, but he lacks the title-defense volume of the deeper champions.',
      primeSummary: 'His prime was electric but short: a fast rise from featherweight contender to double champ, followed by inactivity and uneven later results.',
      titleStyle: 'Compact Double-Champ Star', primeStyle: 'Short Explosive Prime',
      legacyStats: { ufcRecord: '10-4', titleFightWins: 3, beltsWon: 2, titleDefenses: 0, activeEliteYearsLabel: 'roughly 3 active elite years', primeNote: 'short explosive prime built around the Aldo knockout and Alvarez double-champ moment' }
    }
  };
  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}) }; DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();
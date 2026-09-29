// Joanna Jedrzejczyk fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-joanna-jedrzejczyk-20260702b';
  const fighter = 'Joanna Jedrzejczyk';
  const packet = {
    status: { stage: 'packet live; photos and Watch Moment needed', lastUpdated: '2026-07-02', nextFix: 'Add Joanna photos and Watch Moment link.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/joanna-jedrzejczyk.js', compareFallback: 'assets/compare-coverage-pack-2.js' },
    display: {
      overallOvr: 86,
      allTimeRank: 3,
      divisionLabel: 'SW',
      resumeTag: 'Strawweight title standard',
      oneLiner: 'The strawweight standard: long title control, elite striking volume, and one of the cleanest technical champion runs in women’s UFC history.',
      categories: { championship: { ovr: 85, rank: 3 }, opponentQuality: { ovr: 82, rank: 4 }, primeDominance: { ovr: 89, rank: 3 }, longevity: { ovr: 84, rank: 4 } },
      snapshot: [ ['UFC Record', '10-5'], ['UFC Title-Fight Wins', '6'], ['Championship Level', 'Historic Strawweight Champion'], ['Quality Wins', 'Early Strawweight Elite'], ['Prime Record', 'Long Technical Title Prime'], ['Active Elite Years', '5.5 Elite Years'], ['Loss Context', 'Rose and Zhang losses cap the back end'] ],
      whyRankedHere: 'Joanna ranks women’s #3 because her strawweight reign was historically important and technically dominant. Her title defenses, pace, takedown defense, and striking output made her the early standard for the division.',
      whyNotHigher: 'She does not pass Nunes or Valentina because she has less two-division value, less total title-fight separation, and the Rose/Zhang stretch damaged the back end of the case.',
      keyJudgmentCalls: [ ['Strawweight title reign', 'the center of her all-time case.'], ['Technical striking', 'a major part of the prime-dominance score.'], ['Rose losses', 'real championship drag and the turning point of the reign.'], ['Zhang fights', 'add high-level context but also back-end damage.'], ['Division impact', 'she helped define what elite UFC strawweight looked like.'] ],
      finalTakeaway: 'Joanna is the strawweight title standard: technically brilliant, historically important, and clearly women’s top-three in this ranking, but capped below the two deeper GOAT cases.'
    },
    profileStats: { ufcRecord: '10-5', titleFightWins: 6, eliteWins: 6, primeRecord: '8-3', finishRatePct: 20.0, roundsWonPct: 66.5, activeEliteYears: 5.5, timesFinishedPrime: 1, divisionStrengthContext: 'Strawweight title value is respected, especially as the early standard-setting run.', lossContext: 'Rose and Zhang losses create real back-end drag.' },
    compareSeasoning: {
      shortCase: 'Joanna is the strawweight standard: elite striking volume, long title control, and one of the most important early women’s UFC championship runs.',
      peak: 'At her best, Joanna was pace, footwork, combinations, takedown defense, and five-round striking pressure. She made elite strawweights fight at a volume they could not match.',
      resume: 'Joanna’s UFC resume is built on a real title reign and technical dominance at strawweight, with later losses keeping the case from matching the top two women.',
      championship: 'Her championship case is strong: she won the strawweight title, defended repeatedly, and became the early standard for the division.',
      opponentQuality: 'Esparza, Gadelha twice, Penne, Letourneau, Kowalkiewicz, Andrade, and Waterson give Joanna a strong strawweight title-era resume.',
      longevity: 'Joanna stayed elite long enough to define a division, but the late title losses keep the story from being as clean as Nunes or Valentina.',
      counter: 'Joanna’s argument is divisional standard-setting. She may not have two-division value, but she built the strawweight benchmark.',
      edge: 'Joanna wins comparisons when strawweight title control, technical dominance, and division-defining impact matter most.',
      eliteCounter: true,
      signatureWins: 'Esparza, Gadelha twice, Penne, Letourneau, Kowalkiewicz, Andrade, and Waterson give Joanna a strong strawweight title-era resume.',
      weakness: 'No two-division value and the Rose/Zhang losses keep her below Nunes and Valentina.',
      titleSummary: 'Joanna’s title case is a historic strawweight reign with repeated defenses and clear division-setting value.',
      primeSummary: 'Her prime was technical and volume-heavy, but the Rose losses sharply ended the clean title-control phase.',
      titleStyle: 'Strawweight Reign Standard', primeStyle: 'Technical Volume Prime',
      legacyStats: { ufcRecord: '10-5', titleFightWins: 6, beltsWon: 1, titleDefenses: 5, activeEliteYearsLabel: 'roughly 6 active elite years', primeNote: 'strawweight title prime built on striking volume and takedown defense' }
    },
    fightLedger: {
      'joanna jedrzejczyk|valentina shevchenko': {
        fighters: ['Joanna Jedrzejczyk', 'Valentina Shevchenko'],
        fights: 1,
        winner: 'Valentina Shevchenko',
        importance: 'major',
        summary: 'Valentina beat Joanna to win the UFC flyweight title. Joanna still owns the stronger strawweight-specific case, but Valentina owns the direct UFC championship result.'
      }
    }
  };
  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}) }; DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function applyLedger(){ window.COMPARE_FIGHT_LEDGER = { ...(window.COMPARE_FIGHT_LEDGER || {}), ...(packet.fightLedger || {}) }; }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); applyLedger(); registerPacket();
})();
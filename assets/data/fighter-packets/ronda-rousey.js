// Ronda Rousey fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-ronda-rousey-20260702b';
  const fighter = 'Ronda Rousey';
  const packet = {
    status: { stage: 'packet live; photos and Watch Moment needed', lastUpdated: '2026-07-02', nextFix: 'Add Ronda photos and Watch Moment link.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/ronda-rousey.js', compareFallback: 'assets/compare-coverage-pack-2.js' },
    display: {
      overallOvr: 85,
      allTimeRank: 4,
      divisionLabel: 'BW',
      resumeTag: 'Original women’s UFC superstar',
      oneLiner: 'The original women’s UFC superstar case: historic bantamweight title dominance, instant finishes, mainstream impact, and a sharp ending that caps the score.',
      categories: { championship: { ovr: 84, rank: 4 }, opponentQuality: { ovr: 76, rank: 6 }, primeDominance: { ovr: 91, rank: 2 }, longevity: { ovr: 76, rank: 6 } },
      snapshot: [ ['UFC Record', '6-2'], ['UFC Title-Fight Wins', '6'], ['Championship Level', 'Original Women’s BW Champion'], ['Quality Wins', 'Early Bantamweight Elite'],  ['Active Elite Years', '3.0 Elite Years'], ['Loss Context', 'Holm and Nunes losses ended the case sharply'] ],
      whyRankedHere: 'Rousey ranks women’s #4 because her UFC peak mattered enormously. She was the original women’s UFC champion, defended repeatedly, and finished fights in a way that made her feel almost inevitable during the early run.',
      whyNotHigher: 'She does not rank higher because the run was short and the ending was severe. The Holm and Nunes losses damaged the aura, and the later women’s champions built deeper UFC resumes.',
      keyJudgmentCalls: [ ['Era impact', 'huge context, but the scoring still stays UFC-resume based.'], ['Title-fight volume', 'strong for a short UFC run.'], ['Finish dominance', 'central to the prime-dominance score.'], ['Holm/Nunes losses', 'major drag because they ended the reign and aura decisively.'], ['Short window', 'keeps longevity below Nunes, Valentina, and Joanna.'] ],
      finalTakeaway: 'Rousey is the original women’s UFC force: historically massive, brutally dominant for a short window, and held back by a short run with a rough finish.'
    },
    profileStats: { ufcRecord: '6-2', titleFightWins: 6, eliteWins: 4,  finishRatePct: 100.0, roundsWonPct: 80.0, activeEliteYears: 3.0, timesFinishedPrime: 2, divisionStrengthContext: 'Early women’s bantamweight context is respected, while later division depth creates a higher bar.', lossContext: 'Holm and Nunes losses are real high-impact finish losses that sharply cap the resume.' },
    compareSeasoning: {
      shortCase: 'Rousey is the original women’s UFC superstar case: historic title dominance, instant finishes, and one of the most important short peaks in company history.',
      peak: 'At her best, Rousey was immediate chaos: clinch entry, throws, armbar threat, and pressure that made opponents panic before the fight settled.',
      resume: 'Rousey’s UFC resume is short but historically loud. She created the first women’s UFC standard, then lost the aura sharply against Holm and Nunes.',
      championship: 'The championship case is strong for a compact run: she was the first women’s bantamweight champion and defended repeatedly with quick finishes.',
      opponentQuality: 'Tate, Zingano, Davis, Carmouche, McMann, and Correia give Rousey the early bantamweight title-run value, even if later women’s divisions became deeper.',
      longevity: 'Longevity is the limiter. The peak was huge, but the active UFC window was short and ended badly.',
      counter: 'Rousey’s argument is impact and dominance. Nobody on the women’s board changed the UFC faster, but the resume depth is not Nunes or Valentina level.',
      edge: 'Rousey wins comparisons when historic impact, title-finishing dominance, and short-peak aura outweigh long-term resume depth.',
      eliteCounter: true,
      signatureWins: 'Tate, Zingano, Davis, Carmouche, McMann, and Correia give Rousey the original women’s UFC title-run resume.',
      weakness: 'The Holm and Nunes losses ended the aura, and the UFC window was too short to match deeper champions.',
      titleSummary: 'Rousey’s title case is historically important and finish-heavy, but compact compared with Nunes and Valentina.',
      primeSummary: 'Her prime was short, violent, and transformative, then ended sharply in two damaging losses.',
      titleStyle: 'Original Women’s UFC Champion', primeStyle: 'Short Armbar-Aura Prime',
      legacyStats: { ufcRecord: '6-2', titleFightWins: 6, beltsWon: 1, titleDefenses: 6, activeEliteYearsLabel: 'roughly 3 active elite years', primeNote: 'short transformative women’s bantamweight title run with a sharp ending' }
    },
    fightLedger: {
      'amanda nunes|ronda rousey': {
        fighters: ['Amanda Nunes', 'Ronda Rousey'],
        fights: 1,
        winner: 'Amanda Nunes',
        importance: 'major',
        summary: 'Nunes finished Rousey quickly in a UFC bantamweight title fight. It is a clean direct result and a symbolic passing-of-the-torch moment in women’s UFC history.'
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
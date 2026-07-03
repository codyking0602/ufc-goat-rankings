// Justin Gaethje fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-justin-gaethje-20260702c';
  const fighter = 'Justin Gaethje';

  const packet = {
    status: { stage: 'packet live; undisputed title update; Watch Moment added; photos needed', lastUpdated: '2026-07-02', nextFix: 'Add Gaethje photos. Move raw row into ranking-data.js if permanent.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data-patches.js runtime add-on for first test fighter', centralPacket: 'assets/data/fighter-packets/justin-gaethje.js', displayFallback: 'assets/data/display-overrides.js', watchFallback: 'assets/js/watch-moments.js', photos: 'Add assets/fighters/justin-gaethje.webp and assets/fighters/justin-gaethje-thumb.webp when real files exist.' },
    display: {
      overallOvr: 86, allTimeRank: 22, divisionLabel: 'LW', resumeTag: 'Undisputed lightweight chaos case',
      oneLiner: 'The lightweight chaos case: undisputed UFC gold, two interim-title wins, elite action wins, and enough finish-loss damage to keep the GOAT case capped.',
      categories: { championship: { ovr: 81, rank: 19 }, opponentQuality: { ovr: 87, rank: 11 }, primeDominance: { ovr: 84, rank: 26 }, longevity: { ovr: 83, rank: 21 } },
      snapshot: [ ['UFC Record', '12-5'], ['UFC Title-Fight Wins', '3'], ['Championship Level', 'Undisputed Lightweight Champion'], ['Quality Wins', 'Topuria, Ferguson, Poirier, Chandler'], ['Prime Record', 'Explosive but hittable prime'], ['Active Elite Years', '7.0 Elite Years'], ['Loss Context', 'Penalty capped at -10 despite heavy finish-loss stack'] ],
      whyRankedHere: 'Gaethje ranks here because the UFC-only case now has real championship weight: undisputed lightweight gold, two interim/title-level wins, and a modern lightweight win list built around Topuria, Ferguson, Poirier, Chandler, Fiziev, Barboza, Cerrone, and Johnson.',
      whyNotHigher: 'He does not rank higher because the loss context is still heavy even with the -10 cap. Gaethje has been finished in major prime fights, and one undisputed title win does not erase the Khabib, Oliveira, Max, Poirier, and Alvarez damage against cleaner all-time cases.',
      keyJudgmentCalls: [ ['Undisputed title update', 'the Topuria win gives Gaethje real UFC champion value, not just action-fighter value.'], ['Loss cap', 'his raw loss damage would go past -10, but the model caps the visible penalty at -10.'], ['Modern lightweight depth', 'boosts the quality-wins case because this division is treated as one of the hardest UFC environments.'], ['Action style', 'makes the resume feel huge, but style points do not erase finish losses.'], ['Non-UFC résumé', 'WSOF context is historical only and is not scored.'] ],
      finalTakeaway: 'Gaethje is now more than the great action-resume test case: the undisputed title win gives him real UFC champion weight, but the loss cap is doing work because the finish-loss pile still keeps him outside the deeper GOAT tier.'
    },
    profileStats: { ufcRecord: '12-5', titleFightWins: 3, eliteWins: 9, primeRecord: '9-5', finishRatePct: 75.0, roundsWonPct: 58.5, activeEliteYears: 7.0, timesFinishedPrime: 5, divisionStrengthContext: 'Modern lightweight gets strong division-strength credit, and the Topuria win gives Gaethje undisputed champion value.', lossContext: 'Raw loss damage would exceed -10, but the model uses the -10 cap. Khabib, Oliveira, Max, Poirier, and Alvarez remain the main ceiling.' },
    compareSeasoning: {
      shortCase: 'Gaethje is the undisputed lightweight chaos case: real UFC gold, two interim-title wins, elite lightweight schedule strength, huge action wins, and a loss profile that keeps him below cleaner champions.',
      peak: 'At his best, Gaethje is pressure, leg kicks, durability, scrambling, and fight-ending power. The Topuria win adds the missing undisputed-title proof to a resume that was already dangerous.',
      resume: 'The UFC resume is deep and loud. Topuria, Ferguson, Poirier, Chandler, Fiziev, Barboza, Cerrone, Johnson, and title-level moments give him a serious modern lightweight lane.',
      championship: 'The championship case is now meaningful: undisputed lightweight champion plus two interim/title-level wins. It still trails long-reign champions, but it is no longer just a contender résumé.',
      opponentQuality: 'The opponent-quality argument is the strength: Topuria at title level, Ferguson, Poirier, Chandler, Fiziev, Barboza, Cerrone, Johnson, and very little soft matchmaking once he reached the UFC.',
      longevity: 'Gaethje stayed relevant against elite lightweights for years, but the violent style and repeated finish losses keep longevity from reading like clean dominance.',
      counter: 'Gaethje’s counterargument in debates is that his schedule was brutal and his best wins are better than some cleaner records. The Topuria win strengthens that argument a lot.',
      edge: 'Gaethje wins comparisons when modern lightweight strength, action-fight résumé, high-end win quality, and undisputed title value matter more than clean title reign length.',
      eliteCounter: true,
      signatureWins: 'Topuria, Ferguson, Poirier, Chandler, Fiziev, Barboza, Cerrone, and Johnson give Gaethje one of the loudest modern lightweight résumés outside the top tier.',
      weakness: 'The finish-loss pile is the ceiling. Khabib, Oliveira, Max, Poirier, and Alvarez losses mean the -10 penalty cap is doing real work.',
      titleSummary: 'Gaethje’s title case now includes undisputed lightweight gold plus two interim/title-level wins, but not a long reign.',
      primeSummary: 'His prime is explosive and high-impact, but it is not clean. He could end elite fighters, but elite fighters also finished him.',
      titleStyle: 'Undisputed Lightweight Chaos Champion', primeStyle: 'Violent Action Prime',
      legacyStats: { ufcRecord: '12-5', titleFightWins: 3, beltsWon: 2, titleDefenses: 0, activeEliteYearsLabel: 'roughly 7 active elite years', primeNote: 'modern lightweight action prime with undisputed title value, elite wins, and -10 capped loss context' }
    },
    fightLedger: {
      'justin gaethje|ilia topuria': {
        fighters: ['Justin Gaethje', 'Ilia Topuria'], fights: 1, winner: 'Justin Gaethje', importance: 'major',
        summary: 'Gaethje beat Topuria to win the undisputed UFC lightweight title. This is the title win that turns his case from action résumé into real champion résumé.'
      },
      'justin gaethje|khabib nurmagomedov': {
        fighters: ['Justin Gaethje', 'Khabib Nurmagomedov'], fights: 1, winner: 'Khabib Nurmagomedov', importance: 'major',
        summary: 'Khabib submitted Gaethje in a UFC lightweight title fight. Gaethje had real danger, but Khabib owns the clean direct championship result.'
      },
      'charles oliveira|justin gaethje': {
        fighters: ['Charles Oliveira', 'Justin Gaethje'], fights: 1, winner: 'Charles Oliveira', importance: 'major',
        summary: 'Oliveira submitted Gaethje in a chaotic lightweight title-level fight. Gaethje adds danger and schedule strength, but Oliveira owns the direct finish.'
      },
      'justin gaethje|max holloway': {
        fighters: ['Justin Gaethje', 'Max Holloway'], fights: 1, winner: 'Max Holloway', importance: 'major',
        summary: 'Holloway knocked out Gaethje in one of the signature UFC moments. Gaethje still has a strong lightweight résumé, but Max owns the direct result.'
      }
    },
    watchMoment: { url: 'https://youtube.com/shorts/2LxEazU0vuM?is=tHj1Dxylleh4yGG7', label: 'Watch Moment' }
  };

  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}) }; if(packet.watchMoment?.url){ DISPLAY_OVERRIDES[fighter].watchUrl = packet.watchMoment.url; DISPLAY_OVERRIDES[fighter].watchLabel = packet.watchMoment.label || 'Watch Moment'; } DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function applyLedger(){ window.COMPARE_FIGHT_LEDGER = { ...(window.COMPARE_FIGHT_LEDGER || {}), ...(packet.fightLedger || {}) }; }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); applyLedger(); registerPacket();
})();
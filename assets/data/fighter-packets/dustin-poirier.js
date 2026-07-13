// Dustin Poirier fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-dustin-poirier-20260703a';
  const fighter = 'Dustin Poirier';

  const packet = {
    status: { stage: 'permanent hand-added fighter; packet live; photos needed', lastUpdated: '2026-07-03', nextFix: 'Add Dustin Poirier photos. Add Watch Moment only if Cody provides a URL.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data-additions.js', centralPacket: 'assets/data/fighter-packets/dustin-poirier.js', displayFallback: 'assets/data/display-overrides.js', watchFallback: 'assets/js/watch-moments.js', photos: 'Add assets/fighters/dustin-poirier.webp and assets/fighters/dustin-poirier-thumb.webp when real files exist.' },
    display: {
      divisionLabel: 'LW / FW',
      resumeTag: 'Interim lightweight legend, title-shot ceiling',
      oneLiner: 'The best non-undisputed lightweight résumé in this range: elite wins everywhere, an interim belt, three undisputed title misses, and a capped loss profile keeping him out of the higher GOAT tier.',
      snapshot: [ ['UFC Record', '22-9 (1 NC)'], ['UFC Title-Fight Wins', '1'], ['Championship Level', 'Interim Lightweight Champion'], ['Quality Wins', 'Holloway, McGregor, Gaethje, Alvarez, Chandler'],  ['Active Elite Years', '8.5 Elite Years'], ['Loss Context', 'Penalty capped at -10; title losses are the ceiling'] ],
      whyRankedHere: 'Poirier ranks here because the UFC-only résumé is loaded: 22 UFC wins, an interim lightweight title, two UFC wins over Max Holloway, two over Conor McGregor, and major lightweight wins over Justin Gaethje, Eddie Alvarez, Michael Chandler, Anthony Pettis, Dan Hooker, Benoit Saint Denis, and Jim Miller.',
      whyNotHigher: 'He does not rank higher because he never won the undisputed UFC title, lost three undisputed lightweight title fights, and the Gaethje rematch plus Islam finish stack enough late elite damage that the -10 loss cap is doing real work.',
      bigAssumptions: [
        ['Prime start', 'Anthony Pettis 2017 / Justin Gaethje 2018 is treated as the start of the clean title-level lightweight window.'],
        ['Prime end', 'The 2025 Holloway retirement fight is included as late elite context, but not treated like a peak-title version of Poirier.'],
        ['Title credit', 'Only the Max Holloway interim lightweight title win counts as a UFC title-fight win. BMF fights are not scored as title wins.'],
        ['Loss cap', 'Khabib, Charles, Gaethje 2, Islam, and Holloway 3 create more loss drag than the visible -10 cap shows.'],
        ['Division strength', 'Modern lightweight gets strong 1.10-ish environment credit, which boosts the wins but also makes the loss ledger brutal.'],
        ['Non-UFC résumé', 'WEC and regional wins are historical context only and are not scored.']
      ],
      keyJudgmentCalls: [
        ['Interim title', 'the Holloway 2019 win is the championship anchor, but one interim belt cannot match undisputed champions with defenses.'],
        ['Holloway trilogy', 'Poirier owns two UFC wins over Max, while Max owns the final BMF/retirement-fight result and the stronger total GOAT case.'],
        ['McGregor series', 'Poirier’s 2-1 UFC series edge over Conor matters, but the third fight has injury-finish context.'],
        ['Lightweight schedule', 'his opponent-quality score is elite because he spent years fighting the hardest lightweight names available.'],
        ['Ceiling', 'three failed undisputed title shots are the cleanest reason he stays below the higher championship cases.']
      ],
      finalTakeaway: 'Poirier is the elite résumé-over-belt case: he has enough UFC wins and opponent quality to sit around the top 20, but the missing undisputed title and capped loss context keep him below the true champion-reign tier.'
    },
    profileStats: { ufcRecord: '22-9 (1 NC)', titleFightWins: 1, eliteWins: 11,  finishRatePct: 68.2, roundsWonPct: 56.5, activeEliteYears: 8.5, timesFinishedPrime: 4, divisionStrengthContext: 'Modern lightweight gets strong division-strength credit, and Poirier’s best wins came in one of the deepest UFC divisions.', lossContext: 'Loss penalty is capped at -10. Khabib, Charles Oliveira, Justin Gaethje 2, Islam Makhachev, and Max Holloway 3 create the main ceiling.' },
    compareSeasoning: {
      shortCase: 'Poirier is the elite lightweight résumé case: one interim belt, a giant win ledger, brutal schedule strength, and no undisputed title to push him into the higher GOAT tier.',
      peak: 'At his best, Poirier was pressure boxing, southpaw counters, durability, pace, and opportunistic submissions. He was championship-level dangerous without becoming a dominant undisputed champion.',
      resume: 'The UFC résumé is excellent: Max Holloway twice, Conor McGregor twice, Justin Gaethje, Eddie Alvarez, Michael Chandler, Anthony Pettis, Dan Hooker, Benoit Saint Denis, Jim Miller, Bobby Green, and more.',
      championship: 'The championship case is the weakness relative to the names above him. The interim lightweight title matters, but failed undisputed shots to Khabib, Charles, and Islam keep the belt résumé capped.',
      opponentQuality: 'Opponent quality is the argument. Poirier’s win list is better than several cleaner champions, especially when modern lightweight strength is respected.',
      longevity: 'Poirier stayed elite for a long time, from the lightweight breakout through the 2025 Holloway retirement fight, without needing non-UFC achievements to carry the case.',
      counter: 'Poirier’s counterargument in debates is that he beat more great fighters than some actual champions and kept taking the hardest available lightweight fights.',
      edge: 'Poirier wins comparisons when deep win quality, modern lightweight strength, and repeated elite relevance matter more than undisputed title reign length.',
      eliteCounter: true,
      signatureWins: 'Max Holloway twice, Conor McGregor twice, Justin Gaethje, Eddie Alvarez, Michael Chandler, Anthony Pettis, Dan Hooker, Benoit Saint Denis, and Jim Miller.',
      weakness: 'The missing undisputed title is the headline weakness, with Khabib, Charles, Gaethje 2, Islam, and Max 3 making the loss cap important.',
      titleSummary: 'Poirier’s title case is one interim lightweight title win and three failed undisputed title shots.',
      primeSummary: 'His prime is elite, violent, and resilient, but not cleanly dominant enough to overcome the title-fight ceiling.',
      titleStyle: 'Interim Lightweight War King',
      primeStyle: 'Elite Lightweight War Prime',
      legacyStats: { ufcRecord: '22-9 (1 NC)', titleFightWins: 1, beltsWon: 1, titleDefenses: 0, activeEliteYearsLabel: 'roughly 8.5 active elite years', primeNote: 'modern lightweight elite window with huge win quality and capped loss context' }
    },
    fightLedger: {
      'dustin poirier|max holloway': { fighters: ['Dustin Poirier', 'Max Holloway'], fights: 3, winner: 'Dustin Poirier', importance: 'major', summary: 'Poirier leads the UFC trilogy 2-1, including the 2019 interim lightweight title win. Max owns the final BMF/retirement-fight result and still has the stronger UFC-only GOAT case because of featherweight championship dominance.' },
      'conor mcgregor|dustin poirier': { fighters: ['Conor McGregor', 'Dustin Poirier'], fights: 3, winner: 'Dustin Poirier', importance: 'major', summary: 'Poirier went 2-1 against McGregor in UFC fights. McGregor won the early featherweight meeting, but Poirier took the lightweight rematch and trilogy result.' },
      'dustin poirier|justin gaethje': { fighters: ['Dustin Poirier', 'Justin Gaethje'], fights: 2, winner: 'Split series', importance: 'major', summary: 'Poirier and Gaethje split two violent UFC fights: Poirier finished the first meeting, Gaethje won the BMF rematch by head-kick knockout. The series is a true lightweight résumé debate.' },
      'dustin poirier|khabib nurmagomedov': { fighters: ['Dustin Poirier', 'Khabib Nurmagomedov'], fights: 1, winner: 'Khabib Nurmagomedov', importance: 'major', summary: 'Khabib submitted Poirier in an undisputed lightweight title fight. Poirier has a great résumé, but Khabib owns the direct championship result.' },
      'charles oliveira|dustin poirier': { fighters: ['Charles Oliveira', 'Dustin Poirier'], fights: 1, winner: 'Charles Oliveira', importance: 'major', summary: 'Oliveira submitted Poirier in a UFC lightweight title fight. Poirier has deeper name volume, but Oliveira owns the direct undisputed-title finish.' },
      'dustin poirier|islam makhachev': { fighters: ['Dustin Poirier', 'Islam Makhachev'], fights: 1, winner: 'Islam Makhachev', importance: 'major', summary: 'Islam submitted Poirier in a UFC lightweight title fight. Poirier showed veteran danger, but Islam owns the direct title result.' },
      'dustin poirier|michael chandler': { fighters: ['Dustin Poirier', 'Michael Chandler'], fights: 1, winner: 'Dustin Poirier', importance: 'notable', summary: 'Poirier submitted Chandler in a wild elite lightweight fight. It is a strong quality win for Poirier, but not a championship anchor.' }
    }
  };

  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}) }; if(packet.watchMoment?.url){ DISPLAY_OVERRIDES[fighter].watchUrl = packet.watchMoment.url; DISPLAY_OVERRIDES[fighter].watchLabel = packet.watchMoment.label || 'Watch Moment'; } DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function applyLedger(){ window.COMPARE_FIGHT_LEDGER = { ...(window.COMPARE_FIGHT_LEDGER || {}), ...(packet.fightLedger || {}) }; }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); applyLedger(); registerPacket();
})();
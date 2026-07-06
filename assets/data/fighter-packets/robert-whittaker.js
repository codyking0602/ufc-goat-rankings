// Robert Whittaker fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-robert-whittaker-20260706a';
  const fighter = 'Robert Whittaker';

  const packet = {
    status: { stage: 'complete first-pass packet; Cody approved Romero treatment before live add', lastUpdated: '2026-07-06', nextFix: 'Add real photos after Cody uploads source images; add Watch Moment only if Cody provides a link; audit exact round-control rows during next scoring-table rebuild.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data-additions.js', centralPacket: 'assets/data/fighter-packets/robert-whittaker.js', apexPeak: 'assets/data/apex-peak-score-corrections.js', watchMoment: 'assets/js/watch-moments.js', tracker: 'docs/fighter-status.md', photos: 'No real photo files loaded yet; app should use initials fallback.' },
    photos: {},
    display: {
      overallOvr: 84, allTimeRank: 28, divisionLabel: 'MW', resumeTag: 'Middleweight champion contender king',
      oneLiner: 'A former middleweight champion with elite résumé depth, Romero-war proof, and long contender relevance — capped by no defense streak and several elite finish losses.',
      categories: { championship: { ovr: 70, rank: 30 }, opponentQuality: { ovr: 86, rank: 15 }, primeDominance: { ovr: 81, rank: 24 }, longevity: { ovr: 85, rank: 13 }, apexPeak: { ovr: 76, rank: 24 }, penalty: { ovr: 55, rank: 39 } },
      snapshot: [ ['UFC Record', '16-6'], ['UFC Title-Fight Wins', '1 official / 1.5 adjusted'], ['Apex Peak', '+3.25'], ['Quality Wins', 'Romero x2, Jacare, Cannonier'], ['Prime Record', '12-5 Elite MW Window'], ['Prime Dominance', '16.40 / 30'], ['Active Elite Years', '8.5 Elite Years'], ['Loss Context', 'Elite finish losses cap'] ],
      whyRankedHere: 'Whittaker ranks here because his UFC-only résumé has rare middleweight depth: Romero twice, Jacare, Cannonier, Costa, Vettori, Brunson, Till, Gastelum, and years of elite relevance after winning UFC gold.',
      whyNotHigher: 'He does not rank higher because his championship case is light for an all-time champion: no official defense streak, Adesanya clearly capped the title era, and later Dricus/Khamzat finish losses hurt the prime-dominance and loss-context side.',
      bigAssumptions: [ ['Romero rematch', 'Gets major title-level résumé credit even though it was non-title after Romero missed weight. Cody approved this treatment.'], ['RDR loss', 'Treated as post-prime/late-career context instead of a Prime Dominance killer.'], ['Khamzat and Dricus losses', 'Count because Whittaker was still relevant enough to be taking elite middleweight fights.'], ['Championship value', 'Interim title plus promotion to undisputed counts, but lack of official title defenses keeps the championship score modest.'], ['Middleweight strength', 'Whittaker gets solid middleweight era credit, but not lightweight-level division-strength treatment.'] ],
      keyJudgmentCalls: [ ['Romero 1', 'Full elite/title credit as the interim title win.'], ['Romero 2', 'High credit as an elite rematch win, but slightly discounted for non-title/missed-weight/close-war context.'], ['Jacare finish', 'One of the cleanest elite wins on his résumé.'], ['Loss context', 'Adesanya, Dricus, and Khamzat losses keep him from a higher GOAT tier.'] ],
      apexPeakSummary: { score: 3.25, window: 'Jacare Souza 2017 through Yoel Romero II 2018', notes: 'Legit elite middleweight apex with Jacare finish and Romero proof, but not a clean separation/aura peak.' },
      primeDominanceSummary: { score: 16.40, notes: 'Long, skilled, and elite, but not a clean title-dominance prime because of finish losses and no defense streak.' },
      finalTakeaway: 'Whittaker is a better UFC-only résumé case than his belt stats make him look. He is not a long-reign champion, but he is one of the strongest non-inner-circle middleweight legacy résumés.'
    },
    profileStats: { ufcRecord: '16-6', titleFightWins: 1, adjustedTitleWins: 1.5, eliteWins: 8, primeRecord: '12-5 in elite middleweight window', primeDominance: 16.40, finishRatePct: 37.5, roundsWonPct: 58.5, activeEliteYears: 8.50, apexPeak: 3.25, timesFinishedPrime: 3, divisionStrengthContext: 'Strong middleweight era, but not a max division-strength class.', lossContext: 'Adesanya finished loss, Adesanya decision loss, Dricus finish, and Khamzat finish are the main counted caps; RDR treated as post-prime context.' },
    compareSeasoning: {
      shortCase: 'Whittaker is the middleweight résumé-depth case: champion value, Romero x2, Jacare, Cannonier, Costa, Vettori, and years of elite relevance.',
      peak: 'At his best, Whittaker had elite footwork, counter-wrestling, pace, and durability in brutal middleweight matchups.',
      resume: 'His résumé is deep for a non-long-reign champion. The Romero wins and Jacare finish are the centerpieces.',
      championship: 'He has real UFC title value, but the lack of official defenses keeps him below the stronger championship résumés.',
      opponentQuality: 'This is his best category: Romero twice, Jacare, Cannonier, Costa, Vettori, Brunson, Till, and Gastelum give him deep middleweight quality.',
      longevity: 'Whittaker beats many short-burst champions on longevity because he stayed elite after losing the belt.',
      counter: 'The counterargument against Whittaker is that his belt résumé is thin and the elite finish losses are loud.',
      edge: 'Whittaker wins comparisons when résumé depth and elite longevity matter more than title defenses.',
      eliteCounter: true,
      signatureWins: 'Yoel Romero twice, Ronaldo Souza, Jared Cannonier, Paulo Costa, Marvin Vettori, Derek Brunson, Kelvin Gastelum.',
      weakness: 'No official defense streak and multiple elite finish losses.',
      titleSummary: 'Interim UFC middleweight title win, promoted to undisputed champion, but no official defense streak.',
      primeSummary: 'Long elite middleweight prime with high-level wins, but not a clean domination reign.',
      bestArgument: 'Whittaker has one of the best UFC-only middleweight résumés among fighters without a long title reign.',
      titleStyle: 'Interim-to-undisputed Champion', primeStyle: 'Long Elite Contender Prime',
      legacyStats: { ufcRecord: '16-6', titleFightWins: 1, adjustedTitleWins: 1.5, beltsWon: 1, titleDefenses: 0, activeEliteYearsLabel: 'roughly 8.5 active elite years', primeNote: 'Romero/Jacare apex plus long contender relevance' }
    },
    fightLedger: {
      'robert whittaker|yoel romero': { winner: 'Robert Whittaker', summary: 'Whittaker beat Romero twice, including the interim title win and a close non-title rematch after Romero missed weight.' },
      'robert whittaker|israel adesanya': { winner: 'Israel Adesanya', summary: 'Adesanya beat Whittaker twice, including a title-winning finish, which caps Whittaker in that direct rivalry.' },
      'robert whittaker|dricus du plessis': { winner: 'Dricus du Plessis', summary: 'Dricus finished Whittaker in an elite middleweight title eliminator, giving Dricus the direct head-to-head edge.' },
      'robert whittaker|khamzat chimaev': { winner: 'Khamzat Chimaev', summary: 'Khamzat finished Whittaker in a late elite middleweight matchup, adding harsh loss-context weight against Whittaker.' },
      'robert whittaker|jared cannonier': { winner: 'Robert Whittaker', summary: 'Whittaker beat Cannonier in a top middleweight contender fight, adding strong résumé-depth value.' }
    }
  };

  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}) }; DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ if(packet.compareSeasoning){ window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } } if(packet.fightLedger){ window.COMPARE_FIGHT_LEDGER = window.COMPARE_FIGHT_LEDGER || {}; Object.entries(packet.fightLedger).forEach(([key,value])=>{ window.COMPARE_FIGHT_LEDGER[key] = { ...(window.COMPARE_FIGHT_LEDGER[key] || {}), ...value }; }); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: current.purpose || 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();

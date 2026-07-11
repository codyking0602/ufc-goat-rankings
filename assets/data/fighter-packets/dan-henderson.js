// Dan Henderson fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-dan-henderson-20260710b-ufc-record';
  const fighter = 'Dan Henderson';

  const packet = {
    status: { stage: 'permanent hand-added fighter; packet live; UFC record corrected; photos needed', lastUpdated: '2026-07-10', nextFix: 'Add Dan Henderson photos. Add Watch Moment only if Cody provides a URL.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data-additions.js', centralPacket: 'assets/data/fighter-packets/dan-henderson.js', displayFallback: 'assets/data/display-overrides.js', watchFallback: 'assets/js/watch-moments.js', photos: 'Add assets/fighters/dan-henderson.webp and assets/fighters/dan-henderson-thumb.webp when real files exist.' },
    display: {
      overallOvr: 82,
      allTimeRank: 27,
      divisionLabel: 'MW / LHW',
      resumeTag: 'All-time MMA legend, UFC-only cap',
      oneLiner: 'A true all-time MMA legend whose UFC-only score is much harsher: great Shogun/Bisping/Franklin moments, no UFC title wins, and most of the historic aura living outside this scoring scope.',
      categories: { championship: { ovr: 68, rank: 40 }, opponentQuality: { ovr: 78, rank: 27 }, primeDominance: { ovr: 78, rank: 35 }, longevity: { ovr: 81, rank: 24 } },
      snapshot: [ ['UFC Record', '8-9'], ['UFC Title-Fight Wins', '0'], ['Championship Level', 'UFC 17 tournament context only'], ['Quality Wins', 'Shogun, Bisping, Franklin, Lombard'],  ['Active Elite Years', '6.0 Elite Years'], ['Loss Context', 'Most late UFC losses are post-prime/context-heavy'] ],
      whyRankedHere: 'Henderson ranks here because UFC-only still gives him real value: the Shogun classic, the Bisping knockout, the Franklin win, the Lombard knockout, old-era UFC 17 tournament context, and a long stretch of elite-name fights across middleweight and light heavyweight.',
      whyNotHigher: 'He does not rank higher because this ranking does not score Pride, Strikeforce, Rings, or the broader all-time MMA résumé. In the UFC alone, Hendo went 8-9, never won an undisputed UFC title, and lost UFC title-level fights to Anderson Silva, Quinton Jackson, Daniel Cormier, and Michael Bisping.',
      bigAssumptions: [
        ['UFC-only scope', 'Pride titles, Strikeforce title, Rings tournament success, and broader all-time MMA aura are excluded from the score.'],
        ['Championship credit', 'UFC 17 tournament history is context, not treated like a modern undisputed UFC title reign.'],
        ['Prime issue', 'A lot of Henderson’s best career value happened outside the UFC, so the UFC-only prime window is naturally awkward.'],
        ['Post-prime losses', 'Several late UFC losses are treated as post-prime/context-heavy rather than flat prime collapses.'],
        ['Fan perception', 'The OVR is kept respectable because Hendo is a legend, but the raw UFC-only score stays honest.']
      ],
      keyJudgmentCalls: [
        ['Shogun fight', 'The first Rua fight is the UFC-only résumé anchor.'],
        ['Bisping split', 'Hendo owns the iconic knockout, but lost the later UFC title fight.'],
        ['No UFC belt', 'No undisputed UFC title win is the main ceiling.'],
        ['Outside résumé', 'Pride/Strikeforce greatness can be mentioned as context but not scored.'],
        ['Late-career volatility', 'The record looks rough because much of the UFC sample came around or after his broader career peak.']
      ],
      finalTakeaway: 'Henderson is exactly why the app needs UFC-only discipline. Historically, he is much greater than this slot. In this scoring system, the missing UFC title win and 8-9 UFC record keep him below cleaner UFC résumé fighters.'
    },
    profileStats: { ufcRecord: '8-9', titleFightWins: 0, eliteWins: 5, finishRatePct: 50.0, roundsWonPct: 47.0, activeEliteYears: 6.0, timesFinishedPrime: 2, divisionStrengthContext: 'Middleweight/light heavyweight quality is real, but much of Hendo’s best title value happened outside the UFC and is excluded.', lossContext: 'Anderson, Rampage, Machida, Evans, Cormier, Mousasi, Belfort, and Bisping losses are context-heavy, with many coming late or outside his clean UFC prime.' },
    compareSeasoning: {
      shortCase: 'Henderson is the all-time MMA legend with a UFC-only cap: huge names, unforgettable knockouts, no UFC undisputed belt, and too much résumé value outside the scoring scope.',
      peak: 'At his best, Hendo had Olympic-level wrestling roots, absurd durability, and the right hand that could end anyone’s night. The problem is that much of that best value was not UFC-only.',
      resume: 'The UFC résumé has Shogun Rua twice, Michael Bisping, Rich Franklin, Hector Lombard, Carlos Newton, and title-level losses to Anderson Silva, Rampage Jackson, Daniel Cormier, and Bisping.',
      championship: 'The UFC championship case is thin. UFC 17 tournament context matters historically, but there is no modern undisputed UFC title win to score like the champion-reign cases.',
      opponentQuality: 'Opponent quality is respectable because Hendo fought elite names, but the win side is much thinner in UFC-only scoring than his all-promotions legacy.',
      longevity: 'Longevity is real, but gaps and late-career context keep it from becoming a clean elite-years case.',
      counter: 'Hendo’s counterargument is that UFC-only underrates him by design because it excludes the exact promotions where much of his greatness happened.',
      edge: 'Henderson wins comparisons only when the debate allows broader MMA legacy. In strict UFC-only scoring, he loses to fighters with cleaner UFC title résumés.',
      eliteCounter: true,
      signatureWins: 'Mauricio Rua, Michael Bisping, Rich Franklin, Hector Lombard, Carlos Newton, and the old UFC tournament context.',
      weakness: 'No UFC undisputed title win, 8-9 UFC record, and too much greatness outside the scoring scope.',
      titleSummary: 'Henderson has UFC title-challenge and tournament context, but no scored UFC undisputed title-fight wins.',
      primeSummary: 'His UFC prime is hard to isolate because his broader career peak is split across Pride, Strikeforce, and older tournament eras.',
      titleStyle: 'Old-School Tournament Context',
      primeStyle: 'H-Bomb Veteran Prime',
      legacyStats: { ufcRecord: '8-9', titleFightWins: 0, beltsWon: 0, titleDefenses: 0, activeEliteYearsLabel: 'roughly 6 active elite UFC years', primeNote: 'UFC-only veteran elite window with major non-UFC legacy excluded' }
    },
    fightLedger: {
      'anderson silva|dan henderson': { fighters: ['Anderson Silva', 'Dan Henderson'], fights: 1, winner: 'Anderson Silva', importance: 'major', summary: 'Anderson submitted Henderson in a UFC middleweight title fight. Hendo brought elite credentials, but Anderson owns the direct UFC championship result.' },
      'dan henderson|daniel cormier': { fighters: ['Dan Henderson', 'Daniel Cormier'], fights: 1, winner: 'Daniel Cormier', importance: 'major', summary: 'Cormier dominated and submitted Henderson in a UFC light heavyweight contender fight. Hendo’s legend status remains, but DC owns the direct UFC result.' },
      'dan henderson|mauricio rua': { fighters: ['Dan Henderson', 'Mauricio Rua'], fights: 2, winner: 'Dan Henderson', importance: 'major', summary: 'Henderson went 2-0 against Shogun in the UFC, including one of the most famous five-round fights ever and a later comeback finish.' },
      'dan henderson|michael bisping': { fighters: ['Dan Henderson', 'Michael Bisping'], fights: 2, winner: 'Split series', importance: 'major', summary: 'Henderson knocked Bisping out at UFC 100, then lost the later UFC middleweight title rematch. It is one of the cleanest split-series résumé debates.' },
      'dan henderson|vitor belfort': { fighters: ['Dan Henderson', 'Vitor Belfort'], fights: 1, winner: 'Vitor Belfort', importance: 'notable', summary: 'Belfort knocked out Henderson in their UFC meeting. Henderson’s broader series with Belfort includes non-UFC context, but UFC-only gives Vitor the result.' }
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

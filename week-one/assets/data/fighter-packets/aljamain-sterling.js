// Aljamain Sterling fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-aljamain-sterling-20260703a';
  const fighter = 'Aljamain Sterling';

  const packet = {
    status: { stage: 'permanent hand-added fighter; packet live; photos needed', lastUpdated: '2026-07-03', nextFix: 'Add Aljamain Sterling photos. Add Watch Moment only if Cody provides a URL.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data-additions.js', centralPacket: 'assets/data/fighter-packets/aljamain-sterling.js', displayFallback: 'assets/data/display-overrides.js', watchFallback: 'assets/js/watch-moments.js', photos: 'Add assets/fighters/aljamain-sterling.webp and assets/fighters/aljamain-sterling-thumb.webp when real files exist.' },
    display: {
      overallOvr: 88,
      allTimeRank: 14,
      divisionLabel: 'BW / FW',
      resumeTag: 'Modern bantamweight title résumé case',
      oneLiner: 'The awkward-but-real bantamweight résumé case: four UFC title-fight wins, wins over Yan, Cejudo, Sandhagen, and late featherweight relevance, with DQ/injury context keeping the debate spicy.',
      categories: { championship: { ovr: 84, rank: 17 }, opponentQuality: { ovr: 88, rank: 10 }, primeDominance: { ovr: 86, rank: 20 }, longevity: { ovr: 84, rank: 18 } },
      snapshot: [ ['UFC Record', '17-5'], ['UFC Title-Fight Wins', '4'], ['Championship Level', 'Former Bantamweight Champion'], ['Quality Wins', 'Yan, Cejudo, Sandhagen, Dillashaw'], ['Prime Record', '11-3 title/elite BW/FW window'], ['Active Elite Years', '7.0 Elite Years'], ['Loss Context', 'O’Malley finish and Evloev loss cap the ceiling'] ],
      whyRankedHere: 'Sterling ranks here because the UFC-only case is bigger than the jokes around the DQ title win. He has four bantamweight title-fight wins, a real rematch win over Petr Yan, a title defense over Henry Cejudo, an elite Sandhagen submission, and useful featherweight extension wins over Calvin Kattar, Brian Ortega, and Youssef Zalal.',
      whyNotHigher: 'He does not rank higher because the championship résumé needs context. The first Yan title win came by DQ, the Dillashaw defense had major shoulder-injury context, and the Sean O’Malley finish plus Movsar Evloev loss keep him below cleaner all-time champions.',
      bigAssumptions: [
        ['Prime start', 'Pedro Munhoz 2019 / Cory Sandhagen 2020 starts the clean elite window.'],
        ['Title credit', 'The Yan DQ title win counts, but is discounted. The Yan rematch, Dillashaw defense, and Cejudo defense carry the title case.'],
        ['Dillashaw context', 'The TJ win stays on the ledger, but shoulder-injury context keeps it from being treated like a clean prime champion win.'],
        ['Featherweight extension', 'Kattar, Ortega, and Zalal help longevity, but the Evloev loss prevents a second-division title push from scoring yet.'],
        ['Non-UFC résumé', 'CFFC and regional achievements are not scored.']
      ],
      keyJudgmentCalls: [
        ['Yan rivalry', 'Sterling owns the official UFC series and the rematch is the cleanest title anchor.'],
        ['Cejudo defense', 'A split decision over a returning Cejudo still counts as a real title defense over a former two-division champion.'],
        ['O’Malley loss', 'The title-losing finish is the biggest prime-damage item.'],
        ['Featherweight run', 'Adds relevance and longevity without becoming a new championship tier yet.'],
        ['Style translation', 'Control grappling and backpack dominance score well, even if the fan perception is polarizing.']
      ],
      finalTakeaway: 'Sterling is not the cleanest-looking champion, but the UFC-only résumé is legitimately strong. The title context is messy, yet the wins and longevity are too good to keep him out of the top-15 range.'
    },
    profileStats: { ufcRecord: '17-5', titleFightWins: 4, eliteWins: 10, primeRecord: '11-3', finishRatePct: 23.5, roundsWonPct: 64.0, activeEliteYears: 7.0, timesFinishedPrime: 2, divisionStrengthContext: 'Modern bantamweight is treated as a strong, deep division, and Sterling also gets useful featherweight extension credit.', lossContext: 'Caraway and Moraes are early/context losses; O’Malley is the major prime finish loss, and Evloev caps the featherweight extension.' },
    compareSeasoning: {
      shortCase: 'Sterling is the modern bantamweight résumé case: four title-fight wins, a Yan rematch win, Cejudo defense, Sandhagen submission, and featherweight extension with messy context attached.',
      peak: 'At his best, Sterling was back-control, chain wrestling, length, pace, and awkward striking layered into a style most bantamweights hated solving.',
      resume: 'The UFC résumé includes Petr Yan, Henry Cejudo, T.J. Dillashaw, Cory Sandhagen, Pedro Munhoz, Calvin Kattar, Brian Ortega, Youssef Zalal, Jimmie Rivera, and Cody Stamann.',
      championship: 'The championship case is strong by count but messy by feel: four title-fight wins, with the first Yan DQ and Dillashaw injury context preventing a cleaner champion aura.',
      opponentQuality: 'Opponent quality is strong because Yan, Cejudo, Sandhagen, Munhoz, Kattar, Ortega, and Zalal cover multiple elite windows.',
      longevity: 'Sterling stayed elite from bantamweight title contention into featherweight relevance, which gives him more staying power than a short-reign champion.',
      counter: 'The counterargument against Sterling is that the résumé needs footnotes: DQ title win, injured Dillashaw, split Cejudo, and an abrupt O’Malley finish.',
      edge: 'Sterling wins comparisons when official title-fight wins, direct Yan series edge, modern bantamweight depth, and elite longevity matter more than clean aura.',
      eliteCounter: true,
      signatureWins: 'Petr Yan, Henry Cejudo, Cory Sandhagen, T.J. Dillashaw, Pedro Munhoz, Calvin Kattar, Brian Ortega, Youssef Zalal, Jimmie Rivera, and Cody Stamann.',
      weakness: 'The title context is messy, and the O’Malley finish plus Evloev loss stop the case from feeling like a top-10 lock.',
      titleSummary: 'Sterling’s title case is four bantamweight title-fight wins, with the Yan DQ discounted and the Yan rematch/Cejudo defense doing the heavy lifting.',
      primeSummary: 'His prime is more control-and-position dominance than highlight violence, but it produced real elite wins in a loaded bantamweight era.',
      titleStyle: 'Awkward Bantamweight Reign',
      primeStyle: 'Backpack Control Prime',
      legacyStats: { ufcRecord: '17-5', titleFightWins: 4, beltsWon: 1, titleDefenses: 3, activeEliteYearsLabel: 'roughly 7 active elite years', primeNote: 'modern bantamweight title prime with featherweight extension and messy title-context footnotes' }
    },
    fightLedger: {
      'aljamain sterling|petr yan': { fighters: ['Aljamain Sterling', 'Petr Yan'], fights: 2, winner: 'Aljamain Sterling', importance: 'major', summary: 'Sterling went 2-0 against Yan officially. The DQ title win needs context, but the rematch decision gives Sterling the direct UFC series edge.' },
      'aljamain sterling|tj dillashaw': { fighters: ['Aljamain Sterling', 'T.J. Dillashaw'], fights: 1, winner: 'Aljamain Sterling', importance: 'major', summary: 'Sterling stopped Dillashaw in a bantamweight title fight. The win counts, but Dillashaw’s shoulder injury keeps it from being treated like a clean prime champion win.' },
      'aljamain sterling|henry cejudo': { fighters: ['Aljamain Sterling', 'Henry Cejudo'], fights: 1, winner: 'Aljamain Sterling', importance: 'major', summary: 'Sterling defended the bantamweight title against Cejudo by split decision. Cejudo has two-division champion value, but Sterling owns the direct UFC result.' },
      'aljamain sterling|sean omalley': { fighters: ['Aljamain Sterling', 'Sean O’Malley'], fights: 1, winner: 'Sean O’Malley', importance: 'major', summary: 'O’Malley knocked out Sterling to win the bantamweight title. Sterling still has the deeper title-defense résumé, but O’Malley owns the clean direct finish.' },
      'aljamain sterling|movsar evloev': { fighters: ['Aljamain Sterling', 'Movsar Evloev'], fights: 1, winner: 'Movsar Evloev', importance: 'notable', summary: 'Evloev beat Sterling in a featherweight contender fight. It caps Sterling’s second-division case for now without erasing his bantamweight résumé.' }
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
// T.J. Dillashaw fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-tj-dillashaw-20260703a';
  const fighter = 'T.J. Dillashaw';

  const packet = {
    status: { stage: 'permanent hand-added fighter; packet live; photos needed', lastUpdated: '2026-07-03', nextFix: 'Add T.J. Dillashaw photos. Add Watch Moment only if Cody provides a URL.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data-additions.js', centralPacket: 'assets/data/fighter-packets/tj-dillashaw.js', displayFallback: 'assets/data/display-overrides.js', watchFallback: 'assets/js/watch-moments.js', photos: 'Add assets/fighters/tj-dillashaw.webp and assets/fighters/tj-dillashaw-thumb.webp when real files exist.' },
    display: {
      divisionLabel: 'BW / FLW',
      resumeTag: 'Two-time bantamweight champion, tainted ceiling',
      oneLiner: 'A real bantamweight title monster with five UFC title-fight wins, huge finishes over Barao and Garbrandt, and an EPO suspension that keeps the legacy from feeling clean.',
      snapshot: [ ['UFC Record', '13-5'], ['UFC Title-Fight Wins', '5'], ['Championship Level', 'Two-Time Bantamweight Champion'], ['Quality Wins', 'Barao, Garbrandt, Sandhagen, Assuncao'],  ['Active Elite Years', '6.5 Elite Years'], ['Loss Context', 'Cruz, Cejudo, Sterling, plus EPO legacy context'] ],
      whyRankedHere: 'Dillashaw ranks here because the UFC-only résumé has serious championship weight: two bantamweight title reigns, five UFC title-fight wins, title finishes over Renan Barao, Joe Soto, and Cody Garbrandt, plus elite wins over Cory Sandhagen, Raphael Assuncao, and John Lineker.',
      whyNotHigher: 'He does not rank higher because the résumé is permanently clouded by the EPO suspension and vacated belt, the Dominick Cruz loss cost him a cleaner reign, the Cejudo flyweight loss was ugly, and the Sterling fight ended with major shoulder-injury context.',
      bigAssumptions: [
        ['Prime start', 'Renan Barao 2014 starts the clean title-prime window.'],
        ['Title credit', 'All five UFC bantamweight title-fight wins count, even though the later vacated title and EPO suspension are major visible context.'],
        ['PED context', 'The EPO suspension is not a locked formula loss penalty, but it matters heavily in app-facing legacy copy.'],
        ['Cejudo loss', 'The flyweight title loss is treated as a cross-division elite loss with a smaller résumé penalty than a normal bantamweight collapse.'],
        ['Sterling loss', 'The Sterling title loss stays on the record, but the shoulder issue keeps it from being treated like a clean prime destruction.']
      ],
      keyJudgmentCalls: [
        ['Barao upset', 'The first Barao win is the championship anchor and one of the great UFC title upsets.'],
        ['Garbrandt rivalry', 'Two knockout title wins over Cody are huge for the championship case.'],
        ['Cruz loss', 'A close title loss, but it blocks a cleaner all-time bantamweight reign argument.'],
        ['Sandhagen win', 'Counts as a major longevity/quality win, with disputed-scorecard context.'],
        ['EPO', 'The title résumé is real, but the legacy ceiling is capped by the suspension.']
      ],
      finalTakeaway: 'Dillashaw is a top-20-ish UFC-only case because five title-fight wins are hard to ignore. The problem is not talent or peak; it is the EPO cloud and the way the ending keeps the résumé from feeling clean.'
    },
    profileStats: { ufcRecord: '13-5', titleFightWins: 5, eliteWins: 7,  finishRatePct: 61.5, roundsWonPct: 61.0, activeEliteYears: 6.5, timesFinishedPrime: 2, divisionStrengthContext: 'Modern bantamweight gets strong credit, especially for title wins over Barao and Garbrandt.', lossContext: 'Cruz and Assuncao are major competitive losses, Cejudo is reduced as a cross-division elite loss, and Sterling has shoulder-injury context.' },
    compareSeasoning: {
      shortCase: 'Dillashaw is the tainted bantamweight title résumé: two reigns, five title-fight wins, violent finishes, and a PED cloud that caps the GOAT argument.',
      peak: 'At his best, Dillashaw was movement, stance switching, pace, wrestling, and fight-ending combinations. The Barao and Garbrandt performances are elite championship peak proof.',
      resume: 'The UFC résumé has Renan Barao twice, Cody Garbrandt twice, Cory Sandhagen, Raphael Assuncao, John Lineker, Joe Soto, and Mike Easton.',
      championship: 'The championship case is the strength: two bantamweight reigns and five title-fight wins. The vacated belt and EPO suspension make it impossible to present as clean.',
      opponentQuality: 'Opponent quality is strong but not top-tier compared with deeper all-division résumés. Barao, Garbrandt, Sandhagen, Assuncao, and Lineker carry it.',
      longevity: 'Dillashaw had meaningful title-level staying power, but the suspension gap and injury ending cut the longevity case down.',
      counter: 'Dillashaw’s counterargument is that his best title performances are more dominant and more violent than many cleaner champions in this range.',
      edge: 'Dillashaw wins comparisons when title-fight wins, peak performance, and bantamweight finishing dominance matter more than clean legacy optics.',
      eliteCounter: true,
      signatureWins: 'Renan Barao twice, Cody Garbrandt twice, Cory Sandhagen, Raphael Assuncao, John Lineker, Joe Soto, and Mike Easton.',
      weakness: 'The EPO suspension is the obvious weakness, and the Cruz/Cejudo/Sterling losses prevent a clean all-time bantamweight king case.',
      titleSummary: 'Dillashaw’s title case is five UFC bantamweight title-fight wins across two reigns, with one belt later relinquished after an adverse finding.',
      primeSummary: 'His prime was championship-level and explosive, but the legacy trust issue keeps the score from matching the raw title count.',
      titleStyle: 'Tainted Bantamweight King',
      primeStyle: 'Switch-Stance Violence Prime',
      legacyStats: { ufcRecord: '13-5', titleFightWins: 5, beltsWon: 2, titleDefenses: 3, activeEliteYearsLabel: 'roughly 6.5 active elite years', primeNote: 'two-reign bantamweight title prime with EPO legacy cap and injury-ending context' }
    },
    fightLedger: {
      'aljamain sterling|tj dillashaw': { fighters: ['Aljamain Sterling', 'T.J. Dillashaw'], fights: 1, winner: 'Aljamain Sterling', importance: 'major', summary: 'Sterling stopped Dillashaw in a bantamweight title fight. The win counts, but Dillashaw’s shoulder injury keeps it from being treated like a clean prime champion result.' },
      'dominick cruz|tj dillashaw': { fighters: ['Dominick Cruz', 'T.J. Dillashaw'], fights: 1, winner: 'Dominick Cruz', importance: 'major', summary: 'Cruz beat Dillashaw by split decision to reclaim the bantamweight title. It is a close direct result, but Cruz owns the official title-fight win.' },
      'henry cejudo|tj dillashaw': { fighters: ['Henry Cejudo', 'T.J. Dillashaw'], fights: 1, winner: 'Henry Cejudo', importance: 'major', summary: 'Cejudo stopped Dillashaw in a flyweight title fight. Dillashaw was moving down, but Cejudo owns the direct champion-vs-champion result.' },
      'renan barao|tj dillashaw': { fighters: ['Renan Barao', 'T.J. Dillashaw'], fights: 2, winner: 'T.J. Dillashaw', importance: 'major', summary: 'Dillashaw beat Barao twice in UFC bantamweight title fights, including the original upset that made his championship case.' },
      'cory sandhagen|tj dillashaw': { fighters: ['Cory Sandhagen', 'T.J. Dillashaw'], fights: 1, winner: 'T.J. Dillashaw', importance: 'notable', summary: 'Dillashaw beat Sandhagen by split decision in his return fight. It helps his longevity case, though the scoring was debated.' }
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
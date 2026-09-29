// Frankie Edgar fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-frankie-edgar-20260703b';
  const fighter = 'Frankie Edgar';

  const packet = {
    status: { stage: 'permanent hand-added fighter; Watch Moment added; photos needed', lastUpdated: '2026-07-03', nextFix: 'Add Frankie photos.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data-additions.js', centralPacket: 'assets/data/fighter-packets/frankie-edgar.js', displayFallback: 'assets/data/display-overrides.js', watchFallback: 'assets/js/watch-moments.js', photos: 'Add assets/fighters/frankie-edgar.webp and assets/fighters/frankie-edgar-thumb.webp when real files exist.' },
    display: {
      overallOvr: 85,
      allTimeRank: 25,
      divisionLabel: 'LW / FW / BW',
      resumeTag: 'Lightweight champ, three-division grinder',
      oneLiner: 'The toughness-and-longevity case: UFC lightweight gold, legendary title fights, elite featherweight wins, and enough late-career losses to keep the ceiling capped.',
      categories: { championship: { ovr: 79, rank: 21 }, opponentQuality: { ovr: 86, rank: 12 }, primeDominance: { ovr: 82, rank: 28 }, longevity: { ovr: 90, rank: 8 } },
      snapshot: [ ['UFC Record', '18-11-1'], ['UFC Title-Fight Wins', '3'], ['Championship Level', 'Former Lightweight Champion'], ['Quality Wins', 'Penn, Maynard, Mendes, Cub, Oliveira'], ['Prime Record', '9-6-1 title/elite window'], ['Active Elite Years', '10.0 Elite Years'], ['Loss Context', 'Penalty capped at -10; late losses mostly post-prime'] ],
      whyRankedHere: 'Edgar ranks here because his UFC-only résumé has real championship value, rare three-division relevance, and a deep quality-win ledger built around B.J. Penn, Gray Maynard, Chad Mendes, Cub Swanson, Charles Oliveira, Urijah Faber, Sean Sherk, Jeremy Stephens, and Tyson Griffin.',
      whyNotHigher: 'He does not rank higher because the official loss column is heavy, his title reign was not long enough to match the top champions, and his prime dominance is more about grit, pace, and durability than overwhelming separation.',
      bigAssumptions: [
        ['Prime start', 'B.J. Penn 2010 starts the clean title-level prime window.'],
        ['Prime end', 'Brian Ortega 2018 is treated as the end of the counted prime window; later bantamweight losses are mostly post-prime.'],
        ['Title credit', 'Penn, Penn 2, and Maynard 3 count as UFC title-fight wins; the Maynard draw is context only.'],
        ['Division strength', 'Lightweight and featherweight are treated as strong environments, but bantamweight losses come late and do not define the peak case.'],
        ['Loss cap', 'Raw loss damage would be ugly if treated flat, so the locked post-prime and -10 cap rules matter a lot here.']
      ],
      keyJudgmentCalls: [
        ['B.J. Penn rivalry', 'Penn wins are the championship anchor, even with debate around the first decision.'],
        ['Maynard trilogy', 'draw plus comeback title defense adds real title-reign context, but the draw is not scored as a win.'],
        ['Featherweight run', 'Aldo losses hurt, but Mendes, Cub, and Faber keep the second-act case strong.'],
        ['Durability', 'Edgar’s not-finished aura matters, but Ortega and Yair still count in the prime window.'],
        ['Late losses', 'Sandhagen, Vera, Gutierrez, Zombie-type late results are mostly post-prime drag, not the core case.']
      ],
      finalTakeaway: 'Edgar is a classic UFC-only résumé fighter: not a top-tier GOAT case, but a former lightweight champion with elite longevity, real quality wins, and one of the most respected toughness profiles in UFC history.'
    },
    profileStats: { ufcRecord: '18-11-1', titleFightWins: 3, eliteWins: 9, primeRecord: '9-6-1', finishRatePct: 38.9, roundsWonPct: 56.0, activeEliteYears: 10.0, timesFinishedPrime: 2, divisionStrengthContext: 'Lightweight and featherweight both give Edgar meaningful division-strength credit.', lossContext: 'Loss penalty is capped at -10, with late bantamweight and late featherweight losses treated mostly as post-prime context.' },
    compareSeasoning: {
      shortCase: 'Edgar is the lightweight champion and three-division longevity case: title wins, elite featherweight wins, legendary durability, and a loss column that keeps him below cleaner champions.',
      peak: 'At his best, Edgar was pace, wrestling, recovery, boxing volume, and absurd toughness. His peak was less destructive than the knockout artists, but extremely hard to separate from.',
      resume: 'The UFC résumé has real depth: Penn twice, Maynard, Mendes, Cub, Oliveira, Faber, Sherk, Stephens, and Griffin across lightweight and featherweight.',
      championship: 'The championship case is solid: lightweight title win plus title defenses over Penn and Maynard. It is not a long-reign case, but it is real champion value.',
      opponentQuality: 'Opponent quality is the strongest argument. Edgar fought across brutal lightweight and featherweight eras and collected enough meaningful wins to stay in the all-time conversation.',
      longevity: 'Longevity is a major edge. Edgar remained relevant from lightweight title level into featherweight contention and late bantamweight name fights.',
      counter: 'Edgar’s counterargument is simple: his record looks worse than his actual career because he spent years fighting elite and larger opponents across divisions.',
      edge: 'Edgar wins comparisons when title grit, schedule depth, three-division relevance, and elite longevity matter more than clean dominance.',
      eliteCounter: true,
      signatureWins: 'B.J. Penn twice, Gray Maynard, Chad Mendes, Cub Swanson, Charles Oliveira, Urijah Faber, Sean Sherk, Jeremy Stephens, and Tyson Griffin.',
      weakness: 'The losses are the ceiling. Henderson, Aldo, Ortega, Holloway, Zombie, Sandhagen, Vera, and Gutierrez-type results make the -10 cap important.',
      titleSummary: 'Edgar’s title case is lightweight-focused: title win, title defense over Penn, and Maynard trilogy payoff.',
      primeSummary: 'His prime is durable and high-paced rather than overwhelmingly dominant, which keeps his Prime Dominance below the cleaner top-tier cases.',
      titleStyle: 'Lightweight Comeback Champion',
      primeStyle: 'Durable Pace Prime',
      legacyStats: { ufcRecord: '18-11-1', titleFightWins: 3, beltsWon: 1, titleDefenses: 2, activeEliteYearsLabel: 'roughly 10 active elite years', primeNote: 'lightweight title prime plus strong featherweight second act and capped loss context' }
    },
    fightLedger: {
      'bj penn|frankie edgar': { fighters: ['B.J. Penn', 'Frankie Edgar'], fights: 3, winner: 'Frankie Edgar', importance: 'major', summary: 'Edgar went 3-0 against Penn, including the lightweight title win, the clearer rematch defense, and a later featherweight finish. Penn has the broader all-time aura, but Edgar owns the direct UFC series.' },
      'frankie edgar|jose aldo': { fighters: ['Frankie Edgar', 'Jose Aldo'], fights: 2, winner: 'Jose Aldo', importance: 'major', summary: 'Aldo beat Edgar twice in featherweight title-level fights. Edgar’s second-act featherweight résumé is strong, but Aldo owns the direct championship results.' },
      'frankie edgar|max holloway': { fighters: ['Frankie Edgar', 'Max Holloway'], fights: 1, winner: 'Max Holloway', importance: 'major', summary: 'Holloway beat Edgar in a UFC featherweight title fight. Edgar brings longevity and title history, but Max owns the direct result.' },
      'charles oliveira|frankie edgar': { fighters: ['Charles Oliveira', 'Frankie Edgar'], fights: 1, winner: 'Frankie Edgar', importance: 'notable', summary: 'Edgar beat Oliveira before Oliveira’s lightweight title peak. It is useful quality-win context for Edgar, but not treated like beating champion Oliveira.' }
    },
    watchMoment: { url: 'https://youtube.com/shorts/lLpRwEN3PJk?is=QVVQjKx_0gVmw-wO', label: 'Watch Moment' }
  };

  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}) }; if(packet.watchMoment?.url){ DISPLAY_OVERRIDES[fighter].watchUrl = packet.watchMoment.url; DISPLAY_OVERRIDES[fighter].watchLabel = packet.watchMoment.label || 'Watch Moment'; } DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function applyLedger(){ window.COMPARE_FIGHT_LEDGER = { ...(window.COMPARE_FIGHT_LEDGER || {}), ...(packet.fightLedger || {}) }; }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); applyLedger(); registerPacket();
})();
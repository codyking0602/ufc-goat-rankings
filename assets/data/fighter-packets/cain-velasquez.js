// Cain Velasquez fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-cain-velasquez-20260702b';
  const fighter = 'Cain Velasquez';

  const packet = {
    status: { stage: 'packet live; Watch Moment added', lastUpdated: '2026-07-02', nextFix: 'Add direct fight ledger if/when we want Cain rivalry context.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/cain-velasquez.js', displayFallback: 'assets/data/display-overrides.js', watchFallback: 'assets/data/fighter-packets/cain-velasquez.js', photos: 'assets/fighters/cain-velasquez.webp and assets/fighters/cain-velasquez-thumb.webp' },
    photos: { photoUrl: 'assets/fighters/cain-velasquez.webp', thumbUrl: 'assets/fighters/cain-velasquez-thumb.webp' },
    display: {
      overallOvr: 87, allTimeRank: 16, divisionLabel: 'HW', resumeTag: 'Heavyweight peak-dominance case',
      oneLiner: 'The heavyweight pressure machine: elite pace, wrestling, cardio, and one of the best primes in UFC heavyweight history.',
      categories: { championship: { ovr: 76, rank: 24 }, opponentQuality: { ovr: 82, rank: 17 }, primeDominance: { ovr: 93, rank: 5 }, longevity: { ovr: 84, rank: 17 } },
      snapshot: [ ['UFC Record', '12-3'], ['UFC Title-Fight Wins', '4'], ['Championship Level', 'Heavyweight Champion Peak'], ['Quality Wins', 'JDS and Bigfoot Anchor the Case'], ['Prime Record', 'Dominant Heavyweight Prime'], ['Active Elite Years', '7.5 Elite Years'], ['Loss Context', 'Werdum/JDS losses and injuries cap the resume'] ],
      whyRankedHere: 'Cain ranks here because his prime dominance at heavyweight was exceptional. His pace, wrestling pressure, and cardio made him one of the most overwhelming heavyweights ever during his best window.',
      whyNotHigher: 'He does not rank higher because the UFC resume is thin compared with the deeper champions. Injuries, limited title volume, and key losses to dos Santos and Werdum keep his all-time case below Stipe and the broader top tier.',
      keyJudgmentCalls: [ ['Prime dominance', 'the main reason Cain stays this high despite a shorter resume.'], ['Heavyweight context', 'volatility matters, but his peak was genuinely elite.'], ['JDS rivalry', 'Cain won the trilogy and that carries major heavyweight value.'], ['Injuries', 'limit longevity and title-volume credit.'], ['Werdum loss', 'is real prime/back-end drag and keeps the ending from feeling clean.'] ],
      finalTakeaway: 'Cain is the heavyweight peak-pressure case: outstanding at his best, but held back by injuries, shorter title volume, and a thinner total UFC resume than Stipe.'
    },
    profileStats: { ufcRecord: '12-3', titleFightWins: 4, eliteWins: 5, primeRecord: '9-2', finishRatePct: 83.3, roundsWonPct: 77.8, activeEliteYears: 7.47, timesFinishedPrime: 2, divisionStrengthContext: 'Heavyweight volatility is acknowledged, while Cain gets strong credit for a historically dominant prime.', lossContext: 'JDS and Werdum losses matter, but injuries and heavyweight volatility provide context.' },
    compareSeasoning: {
      shortCase: 'Cain is the heavyweight peak-dominance case: pace, wrestling, cardio, pressure, and a prime that looked better than his total resume size.',
      peak: 'At his best, Cain fought with rare heavyweight pace. The wrestling pressure, clinch work, cardio, and repeat attacks made him a uniquely difficult heavyweight champion.',
      resume: 'Cain’s UFC resume is high-end but compact. The JDS trilogy carries major value, but injuries and limited title volume keep the case from matching Stipe’s heavyweight resume.',
      championship: 'The championship case is real but not massive: he won the heavyweight belt, regained it, and defended, but did not build a long reign.',
      opponentQuality: 'Junior dos Santos, Brock Lesnar, Bigfoot Silva twice, Ben Rothwell, and Nogueira give Cain a strong but not deep heavyweight win list.',
      longevity: 'Longevity is the limiter. Cain stayed elite over a meaningful span, but injuries made the active championship window much shorter than the talent suggested.',
      counter: 'Cain’s argument is peak. If the debate is who looked like the most overwhelming heavyweight at his best, Cain has one of the strongest lanes.',
      edge: 'Cain wins comparisons when peak pressure, heavyweight dominance, and the JDS trilogy matter more than title-volume depth.',
      eliteCounter: true,
      signatureWins: 'Junior dos Santos twice, Brock Lesnar, Bigfoot Silva twice, Nogueira, and Rothwell give Cain a compact but serious heavyweight resume.',
      weakness: 'The resume is short, injuries capped the title run, and Stipe has the stronger full UFC heavyweight case.',
      titleSummary: 'Cain’s title case is a strong but compact heavyweight reign built around the JDS rivalry and elite pressure dominance.',
      primeSummary: 'His prime was outstanding and high-paced, but injuries kept it from becoming a long all-time reign.',
      titleStyle: 'Heavyweight Peak Champion', primeStyle: 'Pressure Machine Prime',
      legacyStats: { ufcRecord: '12-3', titleFightWins: 4, beltsWon: 1, titleDefenses: 2, activeEliteYearsLabel: 'roughly 7 active elite years', primeNote: 'dominant heavyweight pressure prime with injuries limiting total volume' }
    },
    watchMoment: { url: 'https://youtube.com/shorts/qF8yfMWdjgg?is=7q2cASkqgIQC9JVY', label: 'Watch Moment' }
  };
  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}), ...(packet.photos || {}) }; if(packet.watchMoment?.url){ DISPLAY_OVERRIDES[fighter].watchUrl = packet.watchMoment.url; DISPLAY_OVERRIDES[fighter].watchLabel = packet.watchMoment.label || 'Watch Moment'; } DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: current.purpose || 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();
// Randy Couture fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-randy-couture-20260702a';
  const fighter = 'Randy Couture';

  const packet = {
    status: { stage: 'complete in packet system', lastUpdated: '2026-07-02', nextFix: 'None for Randy. Continue mid-board packet cleanup.' },
    repoLocations: {
      scoreSource: 'assets/data/ranking-data.js',
      centralPacket: 'assets/data/fighter-packets/randy-couture.js',
      displayFallback: 'assets/data/display-overrides.js',
      compareFallback: 'assets/compare-coverage-pack-1.js',
      profileStatsFallback: 'assets/js/fighter-profile-packages.js',
      watchFallback: 'assets/js/watch-moments.js',
      photos: 'assets/fighters/randy-couture.webp and assets/fighters/randy-couture-thumb.webp'
    },
    photos: { photoUrl: 'assets/fighters/randy-couture.webp', thumbUrl: 'assets/fighters/randy-couture-thumb.webp' },
    display: {
      divisionLabel: 'HW / LHW',
      resumeTag: 'Two-division chaos champion',
      oneLiner: 'The old-school championship chaos case: heavyweight gold, light heavyweight gold, huge title moments, and a messy record built from constant risk.',
      snapshot: [
        ['UFC Record', '16-8'],
        ['UFC Title-Fight Wins', '8'],
        ['Championship Level', 'Two-Division UFC Champion'],
        ['Quality Wins', 'Era-Spanning Title Wins'],
        
        ['Active Elite Years', '8.5 Elite Years'],
        ['Loss Context', 'Messy record, but constant title-risk context']
      ],
      whyRankedHere: 'Couture ranks #8 because his UFC-only case is loaded with championship moments across heavyweight and light heavyweight. The record is messy, but his title wins, two-division relevance, and era-spanning opponent list carry real all-time weight.',
      whyNotHigher: 'He does not climb higher because the loss penalty and prime-dominance profile are much messier than the cleaner GOAT cases. His greatness is championship value and risk-taking, not spotless dominance.',
      keyJudgmentCalls: [
        ['Two-division value', 'heavyweight and light heavyweight gold are central to his ranking.'],
        ['Era context', 'old-school volatility matters because he kept taking dangerous title fights.'],
        ['Loss volume', 'keeps him below cleaner resumes even with strong championship credit.'],
        ['Prime shape', 'his case is multiple veteran surges rather than one smooth prime.'],
        ['UFC-only fit', 'his biggest value is already inside the UFC scoring boundary.']
      ],
      finalTakeaway: 'Couture is the championship-chaos legend: not clean, not smooth, but too decorated across UFC title history to rank like a normal flawed contender.'
    },
    profileStats: {
      ufcRecord: '16-8', titleFightWins: 8, eliteWins: 8,  finishRatePct: 43.8, roundsWonPct: 66.7, activeEliteYears: 8.54, timesFinishedPrime: 2,
      divisionStrengthContext: 'Heavyweight and light heavyweight era context matter because his value comes from repeated title-level risk.',
      lossContext: 'Losses are real drag, but many came in title or high-risk fights across divisions.'
    },
    compareSeasoning: {
      shortCase: 'Couture is the chaos-era championship case: heavyweight gold, light heavyweight gold, huge title moments, and a resume that looks messy because he kept taking dangerous fights.',
      peak: 'At his best, Couture was game-planning, clinch control, dirty boxing, wrestling pressure, and veteran nerve. He repeatedly solved bigger or more explosive champions.',
      resume: 'Couture’s UFC case is built around title moments across two divisions. The losses hurt, but the championship achievements are too loud to treat him like a normal flawed contender.',
      championship: 'The title case is the whole argument: multiple UFC championship runs, heavyweight and light heavyweight value, and major upset wins in early UFC history.',
      opponentQuality: 'Sylvia, Liddell, Ortiz, Belfort, Rizzo, Randleman, Gonzaga, and Coleman give Couture a deep era-spanning UFC win list.',
      longevity: 'Couture’s longevity is unusual because he stayed relevant across weight classes and eras, but the case is also dragged down by losses and late-career damage.',
      counter: 'The case against Couture is the record. He has more losses than the cleaner GOAT candidates, so his ranking depends on how much credit you give for title risk and era context.',
      edge: 'Couture wins comparisons when championship moments, two-division relevance, and title-fight difficulty matter more than clean record aesthetics.',
      eliteCounter: true,
      signatureWins: 'Sylvia, Liddell, Ortiz, Belfort, Rizzo twice, Randleman, Gonzaga, and Coleman give Couture one of the most important old-school UFC win lists.',
      weakness: 'The record is messy, and the loss penalty keeps him from the cleaner top-tier cases.',
      titleSummary: 'Couture’s title case is built on winning UFC gold at heavyweight and light heavyweight, with repeated championship upsets and major title-fight moments.',
      primeSummary: 'His best years were not one smooth prime; they were multiple veteran surges across divisions, which makes the case impressive but messy.',
      titleStyle: 'Two-Division Chaos Champion',
      primeStyle: 'Veteran Era Surges',
      legacyStats: { ufcRecord: '16-8', titleFightWins: 8, beltsWon: 2, titleDefenses: 3, activeEliteYearsLabel: 'roughly 8 active elite years', primeNote: 'multiple veteran surges across heavyweight and light heavyweight rather than one clean uninterrupted prime' }
    },
    watchMoment: { url: 'https://youtube.com/shorts/nU1eSclGMeA?is=R8t0HlpAbHb_E1DO', label: 'Watch Moment' }
  };

  function mergeLegacyStats(existingStats, packetStats){ return { ...(existingStats || {}), ...(packetStats || {}) }; }
  function mergeCompareProfile(existingProfile, packetProfile){ return { ...(existingProfile || {}), ...(packetProfile || {}), legacyStats: mergeLegacyStats((existingProfile || {}).legacyStats, (packetProfile || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}), ...(packet.photos || {}) }; if(packet.watchMoment?.url){ DISPLAY_OVERRIDES[fighter].watchUrl = packet.watchMoment.url; DISPLAY_OVERRIDES[fighter].watchLabel = packet.watchMoment.label || 'Watch Moment'; } DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ if(!packet.compareSeasoning) return; window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: current.purpose || 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();

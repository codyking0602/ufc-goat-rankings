// Petr Yan fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-petr-yan-20260702a';
  const fighter = 'Petr Yan';

  const packet = {
    status: { stage: 'packet live; watch moment needed', lastUpdated: '2026-07-02', nextFix: 'Add Petr Yan Watch Moment link when Cody picks one.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/petr-yan.js', displayFallback: 'assets/data/display-overrides.js', compareFallback: 'assets/compare-phase2-yan.js', profileStatsFallback: 'assets/data/ranking-data.js', photos: 'assets/fighters/petr-yan.webp and assets/fighters/petr-yan-thumb.webp' },
    photos: { photoUrl: 'assets/fighters/petr-yan.webp', thumbUrl: 'assets/fighters/petr-yan-thumb.webp' },
    display: {
      overallOvr: 87, allTimeRank: 16, divisionLabel: 'BW', resumeTag: 'Modern bantamweight title case',
      oneLiner: 'A modern bantamweight title case with elite skill, strong round control, and unusual DQ context that needs more nuance than a normal loss.',
      categories: { championship: { ovr: 78, rank: 20 }, opponentQuality: { ovr: 86, rank: 10 }, primeDominance: { ovr: 91, rank: 8 }, longevity: { ovr: 82, rank: 20 } },
      snapshot: [ ['UFC Record', '12-4'], ['UFC Title-Fight Wins', '2 adjusted title-win credit'], ['Championship Level', 'Former Bantamweight Champion'], ['Quality Wins', 'Aldo and Sandhagen anchor the case'], ['Prime Record', '7-4 in title/elite window'], ['Active Elite Years', '6.0 Elite Years'], ['Loss Context', 'Sterling DQ and elite-loss context need nuance'] ],
      whyRankedHere: 'Yan ranks here because his UFC-only case has real bantamweight title value, strong elite-round control, and enough quality-win/context credit to belong in the all-time conversation rather than being hidden by the messy Sterling rivalry.',
      whyNotHigher: 'He does not climb higher because the championship volume is limited and the official loss column is heavy for an all-time case, even when several losses have strong context.',
      keyJudgmentCalls: [ ['Sterling DQ', 'treated with special context instead of like a normal competitive title loss.'], ['Sandhagen win', 'important interim-title and elite contender value.'], ['Aldo win', 'vacant title win over an elite former champion, but not prime Aldo at featherweight.'], ['Later losses', 'count against the resume, but without finish add-ons where appropriate.'], ['Bantamweight depth', 'modern bantamweight is treated as a strong division context.'] ],
      finalTakeaway: 'Yan is a legit modern bantamweight title case: not a top-tier GOAT resume, but clearly strong enough that he should appear in the ranking and compare mode.'
    },
    profileStats: { ufcRecord: '12-4', titleFightWins: 3, adjustedTitleWins: 2.0, eliteWins: 6, primeRecord: '7-4 in title/elite window', finishRatePct: 18.2, roundsWonPct: 65.2, activeEliteYears: 5.98, timesFinishedPrime: 0, divisionStrengthContext: 'Modern bantamweight is treated as a strong division context.', lossContext: 'Sterling DQ receives special context; later elite losses count but are not treated like non-elite collapse losses.' },
    compareSeasoning: {
      shortCase: 'Yan is a modern bantamweight title case: elite boxing, strong round control, real title-level wins, and loss context that needs more nuance than the record alone shows.',
      peak: 'At his best, Yan was one of the cleanest technical pressure fighters in the UFC: sharp boxing, layered defense, pace, and the ability to take over rounds once reads settled in.',
      resume: 'Yan’s UFC resume has a compact but serious bantamweight title case. Aldo and Sandhagen anchor the title-race value, while the Sterling rivalry and Merab split series make the loss column more nuanced than a cold record read.',
      championship: 'Yan won the UFC bantamweight title, won an interim title-level fight, and later regained title-level value against Merab. The championship case is real, but the total reign volume is still the ceiling.',
      opponentQuality: 'Aldo, Sandhagen, Faber, Dodson, Merab, and later elite bantamweight context give Yan a useful quality-wins case inside a strong modern division.',
      longevity: 'Yan’s elite window is solid but not massive. He has enough high-level bantamweight years to belong, but not the long shelf life of the bigger all-time resumes.',
      counter: 'Yan’s best counterargument is context. The Sterling DQ should not be treated like a normal competitive title loss, the Sterling rematch was close, and the Merab series is split rather than one-way.',
      edge: 'Yan wins comparisons when clean skill, round control, title-rematch context, and DQ/loss-context nuance matter more than raw title-defense volume.',
      eliteCounter: true,
      signatureWins: 'Aldo, Sandhagen, Faber, Dodson, and the Merab title-rematch value give Yan a compact but real UFC bantamweight win stack.',
      weakness: 'The ceiling is title volume. Yan has elite skill and strong context, but the official loss column and lack of a long reign keep him below deeper champion cases.',
      titleSummary: 'Yan’s title case is a real bantamweight champion profile, but it is compact: title win, interim title-level value, title-rematch value, and no long defense run.',
      primeSummary: 'His prime argument is built on round control and technical separation, with major rivalry context against Sterling and Merab.',
      titleStyle: 'Compact Modern Bantamweight Champion', primeStyle: 'Technical Round Control',
      legacyStats: { ufcRecord: '12-4', titleFightWins: 3, beltsWon: 1, titleDefenses: 0, activeEliteYearsLabel: 'roughly 6 active elite years', primeNote: 'modern bantamweight title window with strong round control and unusual DQ/Merab rivalry context' }
    }
  };
  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}), ...(packet.photos || {}) }; if(packet.watchMoment?.url){ DISPLAY_OVERRIDES[fighter].watchUrl = packet.watchMoment.url; DISPLAY_OVERRIDES[fighter].watchLabel = packet.watchMoment.label || 'Watch Moment'; } DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ if(!packet.compareSeasoning) return; window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: current.purpose || 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();

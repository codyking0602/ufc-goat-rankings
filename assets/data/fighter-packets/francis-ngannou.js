// Do not add new fighter data here.
// LEGACY: fighter data has been migrated to assets/data/ranking-data.js.
// Francis Ngannou fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-francis-ngannou-20260702a';
  const fighter = 'Francis Ngannou';
  const packet = {
    status: { stage: 'packet live; photos and Watch Moment needed', lastUpdated: '2026-07-02', nextFix: 'Add Ngannou photos and Watch Moment link.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/francis-ngannou.js', compareFallback: 'assets/compare-coverage-pack-2.js' },
    display: {
      overallOvr: 84, allTimeRank: 23, divisionLabel: 'HW', resumeTag: 'Heavyweight power champion',
      oneLiner: 'The heavyweight terror case: historic power, Stipe title value, Gane defense value, and a UFC run capped before long-reign volume.',
      categories: { championship: { ovr: 72, rank: 30 }, opponentQuality: { ovr: 82, rank: 18 }, primeDominance: { ovr: 92, rank: 5 }, longevity: { ovr: 80, rank: 25 } },
      snapshot: [ ['UFC Record', '11-2'], ['UFC Title-Fight Wins', '2'], ['Championship Level', 'Heavyweight Champion'], ['Quality Wins', 'Stipe and Gane Anchor the Case'], ['Prime Record', 'Terrifying Heavyweight Peak'], ['Active Elite Years', '4.5 Elite Years'], ['Loss Context', 'Stipe/Lewis losses and UFC exit limit volume'] ],
      whyRankedHere: 'Ngannou ranks here because his peak danger and heavyweight title wins are massive. The Stipe knockout and Gane defense give him real championship value, while his finishing threat makes the prime-dominance case unusually strong.',
      whyNotHigher: 'He does not rank higher because the UFC title volume is short. The exit from the UFC capped the long-reign case, and Stipe still has the stronger full UFC heavyweight resume.',
      keyJudgmentCalls: [ ['Stipe split', 'Ngannou gets huge credit for the title knockout, but Stipe has the deeper full heavyweight case.'], ['Gane defense', 'important because it showed a more complete championship skill set.'], ['Power aura', 'central to the prime-dominance argument.'], ['UFC exit', 'caps longevity and championship volume in this ranking.'], ['Heavyweight context', 'volatility is acknowledged while still rewarding the title peak.'] ],
      finalTakeaway: 'Ngannou is the heavyweight power-aura champion: terrifying, historically dangerous, and title-proven, but short on the UFC volume needed to climb higher.'
    },
    profileStats: { ufcRecord: '11-2', titleFightWins: 2, eliteWins: 7, primeRecord: '7-0', finishRatePct: 90.9, roundsWonPct: 66.0, activeEliteYears: 4.5, timesFinishedPrime: 0, divisionStrengthContext: 'Heavyweight power and volatility are part of the case, but title volume remains capped.', lossContext: 'Stipe and Lewis losses matter, while the later title run restores much of the profile.' },
    compareSeasoning: {
      shortCase: 'Ngannou is the heavyweight terror case: historic power, a title win over Stipe, a defense over Gane, and a prime that felt more dangerous than almost anyone’s.',
      peak: 'At his best, Ngannou was pure consequence. His power changed every fight, and the improved patience and wrestling defense later in his UFC run made him more complete than the early version.',
      resume: 'Ngannou’s UFC resume is strong but shorter than Stipe’s. The high-end wins are massive, but the UFC exit capped the long-term title volume.',
      championship: 'The championship case is real: he knocked out Stipe to win the heavyweight belt and defended it by beating Gane in a very different kind of fight.',
      opponentQuality: 'Stipe, Gane, Blaydes twice, Rozenstruik, dos Santos, Cain, Overeem, and Arlovski give Ngannou a dangerous heavyweight win list.',
      longevity: 'Ngannou had a strong elite window, but heavyweight volatility and the early UFC exit limit the all-time volume compared with Stipe.',
      counter: 'The argument against Ngannou is title volume. His peak danger is obvious, but he does not have the long UFC championship run of the top heavyweight resume case.',
      edge: 'Ngannou wins comparisons when peak danger, heavyweight finishing power, and the Stipe title win matter more than long reign volume.',
      eliteCounter: true,
      signatureWins: 'Stipe, Gane, Blaydes twice, Rozenstruik, dos Santos, Cain, Overeem, and Arlovski give Ngannou a dangerous heavyweight win list.',
      weakness: 'The UFC run ended before he could stack long-reign volume, and Stipe still owns the deeper heavyweight case.',
      titleSummary: 'Ngannou’s title case is built on knocking out Stipe for the heavyweight belt and defending against Gane, though the UFC run ended before he could stack long-reign volume.',
      primeSummary: 'His prime was terrifying and more complete by the end, but shorter than the deepest heavyweight championship cases.',
      titleStyle: 'Heavyweight Power Champion', primeStyle: 'Terrifying Heavyweight Peak',
      legacyStats: { ufcRecord: '11-2', titleFightWins: 2, beltsWon: 1, titleDefenses: 1, activeEliteYearsLabel: 'roughly 4 active elite years', primeNote: 'short heavyweight title peak with historic power and a capped UFC championship window' }
    }
  };
  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}) }; DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: current.purpose || 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();
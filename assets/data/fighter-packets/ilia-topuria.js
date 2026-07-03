// Ilia Topuria fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-ilia-topuria-20260702a';
  const fighter = 'Ilia Topuria';

  const packet = {
    status: { stage: 'complete in packet system', lastUpdated: '2026-07-02', nextFix: 'None for Ilia. Continue current-roster packet cleanup.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/ilia-topuria.js', displayFallback: 'assets/data/display-overrides.js', compareFallback: 'assets/compare-coverage-pack-2.js', profileStatsFallback: 'assets/js/fighter-profile-packages.js', watchFallback: 'assets/js/watch-moments.js', photos: 'assets/fighters/ilia-topuria.webp and assets/fighters/ilia-topuria-thumb.webp' },
    photos: { photoUrl: 'assets/fighters/ilia-topuria.webp', thumbUrl: 'assets/fighters/ilia-topuria-thumb.webp' },
    display: {
      overallOvr: 87, allTimeRank: 15, divisionLabel: 'FW / LW', resumeTag: 'New-era title takeover',
      oneLiner: 'The new-era takeover case: unbeaten UFC run, massive featherweight legend wins, elite finishing threat, and a resume still building fast.',
      categories: { championship: { ovr: 76, rank: 23 }, opponentQuality: { ovr: 86, rank: 10 }, primeDominance: { ovr: 94, rank: 4 }, longevity: { ovr: 70, rank: 35 } },
      snapshot: [ ['UFC Record', '9-0'], ['UFC Title-Fight Wins', '2'], ['Championship Level', 'Young But Loud Title Case'], ['Quality Wins', 'Volk and Max Anchor the Case'], ['Prime Record', 'Unbeaten UFC Prime'], ['Active Elite Years', '3.2 Elite Years'], ['Loss Context', 'No UFC losses'] ],
      whyRankedHere: 'Topuria ranks #15 because the high end is already enormous. Beating Volkanovski and Holloway gives him direct value against featherweight history, and his unbeaten UFC run gives the profile a real peak-dominance lane.',
      whyNotHigher: 'He does not rank higher yet because the championship volume and active elite years are still early. The resume is loud, but it has not had time to become a long reign or deep all-time body of work.',
      keyJudgmentCalls: [ ['Volkanovski and Holloway wins', 'carry huge featherweight historical value.'], ['Unbeaten UFC run', 'supports a strong peak-dominance score.'], ['Short sample', 'keeps longevity and championship volume below the long-reign champions.'], ['Current trajectory', 'his ceiling is very high, but the ranking still scores what has happened.'], ['Division context', 'modern featherweight strength helps the quality-win case.'] ],
      finalTakeaway: 'Topuria is the fast-rising new-era case: huge high-end wins and elite peak signals already, with long-reign volume still needed before he can push the very top tier.'
    },
    profileStats: { ufcRecord: '9-0', titleFightWins: 2, eliteWins: 4, primeRecord: '9-0', finishRatePct: 66.7, roundsWonPct: 83.3, activeEliteYears: 3.18, timesFinishedPrime: 0, divisionStrengthContext: 'Modern featherweight strength helps, especially because the key wins directly touch featherweight history.', lossContext: 'No UFC losses, but the sample is still young.' },
    compareSeasoning: {
      shortCase: 'Topuria is the new-era featherweight takeover case: unbeaten UFC run, wins over legends, title-level finishing power, and a resume that is already loud even while still building.',
      peak: 'At his best, Topuria is boxing power, grappling threat, confidence, pressure, and finishing instincts. He does not just win; he changes the temperature of a division fast.',
      resume: 'Topuria’s UFC case is still young, but the high end is already enormous because the Volkanovski and Holloway wins hit directly against featherweight history.',
      championship: 'The championship case is smaller than the long-reign champions, but the title wins carry massive name value and era-shift weight.',
      opponentQuality: 'Volkanovski, Holloway, Emmett, Mitchell, Ryan Hall, and Jai Herbert give Topuria a fast-building quality-win case.',
      longevity: 'Longevity is the obvious gap. Topuria’s case is about peak and current title value, not years of proven elite volume yet.',
      counter: 'The argument against Topuria is that he is still early. The top wins are huge, but he has not had time to build a long title reign.',
      edge: 'Topuria wins comparisons when current peak value, unbeaten momentum, and direct wins over featherweight legends outweigh older fighters’ longer volume.',
      eliteCounter: true,
      signatureWins: 'Volkanovski, Holloway, Emmett, Mitchell, Ryan Hall, and Jai Herbert give Topuria a young but already serious featherweight resume.',
      weakness: 'Longevity and title volume are the clear gaps; the all-time case is loud but still young.',
      titleSummary: 'Topuria’s title case is not long yet, but beating Volkanovski and Holloway gives it rare high-end featherweight value.',
      primeSummary: 'His prime is still building, which makes the ceiling exciting but keeps the all-time case less proven than the long-reign champions.',
      titleStyle: 'New-Era Title Takeover', primeStyle: 'Still-Building Peak',
      legacyStats: { ufcRecord: '9-0', titleFightWins: 2, beltsWon: 1, titleDefenses: 1, activeEliteYearsLabel: 'roughly 3 active elite years', primeNote: 'young but explosive title-level run built around direct wins over featherweight legends' }
    },
    watchMoment: { url: 'https://youtube.com/shorts/8HrxSwOoLZM?is=eygzt_4-hGWU87kL', label: 'Watch Moment' }
  };
  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}), ...(packet.photos || {}) }; if(packet.watchMoment?.url){ DISPLAY_OVERRIDES[fighter].watchUrl = packet.watchMoment.url; DISPLAY_OVERRIDES[fighter].watchLabel = packet.watchMoment.label || 'Watch Moment'; } DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ if(!packet.compareSeasoning) return; window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: current.purpose || 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();

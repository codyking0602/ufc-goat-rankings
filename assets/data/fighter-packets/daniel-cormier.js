// Do not add new fighter data here.
// LEGACY: fighter data has been migrated to assets/data/ranking-data.js.
// Daniel Cormier fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-daniel-cormier-20260702a';
  const fighter = 'Daniel Cormier';

  const packet = {
    status: { stage: 'complete in packet system', lastUpdated: '2026-07-02', nextFix: 'None for DC. Continue current-roster packet cleanup.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/daniel-cormier.js', displayFallback: 'assets/data/display-overrides.js', compareFallback: 'assets/compare-coverage-pack-1.js', profileStatsFallback: 'assets/js/fighter-profile-packages.js', watchFallback: 'assets/js/watch-moments.js', photos: 'assets/fighters/daniel-cormier.webp and assets/fighters/daniel-cormier-thumb.webp' },
    photos: { photoUrl: 'assets/fighters/daniel-cormier.webp', thumbUrl: 'assets/fighters/daniel-cormier-thumb.webp' },
    display: {
      overallOvr: 87, allTimeRank: 13, divisionLabel: 'LHW / HW', resumeTag: 'Compact two-division champion',
      oneLiner: 'The compact two-division champion case: heavyweight gold, light heavyweight gold, elite wins, and rivalry ceilings against Jones and Stipe.',
      categories: { championship: { ovr: 83, rank: 11 }, opponentQuality: { ovr: 84, rank: 12 }, primeDominance: { ovr: 90, rank: 9 }, longevity: { ovr: 82, rank: 21 } },
      snapshot: [ ['UFC Record', '15-3, 1 NC'], ['UFC Title-Fight Wins', '6'], ['Championship Level', 'Two-Division UFC Champion'], ['Quality Wins', 'Dense Title-Level Resume'], ['Prime Record', 'Compact Elite Window'], ['Active Elite Years', '7.1 Elite Years'], ['Loss Context', 'Jones and Stipe rivalry ceilings cap the case'] ],
      whyRankedHere: 'Cormier ranks #13 because his UFC resume is compact but elite: two-division champion, strong title-fight wins, and high-level wins at both light heavyweight and heavyweight.',
      whyNotHigher: 'He does not rank higher because direct rivalry separation blocks him. Jones clearly caps the light heavyweight case, Stipe won the heavyweight trilogy, and the UFC window is not as long as the deeper resumes above him.',
      keyJudgmentCalls: [ ['Two-division value', 'UFC light heavyweight and heavyweight gold are central to the case.'], ['Jones rivalry', 'keeps him out of the top-tier GOAT range even though DC was elite.'], ['Stipe trilogy', 'gives DC huge value but also a direct-rivalry ceiling.'], ['Strikeforce context', 'can be mentioned historically, but it is not scored here.'], ['Compact UFC window', 'dense title value matters more than long calendar volume.'] ],
      finalTakeaway: 'Cormier is a dense elite-resume case: two UFC belts, major title wins, and all-time skill, held back by direct rivalry ceilings against Jones and Stipe.'
    },
    profileStats: { ufcRecord: '15-3, 1 NC', titleFightWins: 6, eliteWins: 9, primeRecord: '12-3, 1 NC', finishRatePct: 53.3, roundsWonPct: 74.6, activeEliteYears: 7.05, timesFinishedPrime: 2, divisionStrengthContext: 'Two-division UFC value helps, but both divisions have rivalry ceilings.', lossContext: 'Jones and Stipe losses are elite losses, but they meaningfully cap the all-time case.' },
    compareSeasoning: {
      shortCase: 'Cormier is the elite two-division champion case: light heavyweight title wins, heavyweight gold, strong opponent quality, and only losing ground because the Jones rivalry blocks the very top tier.',
      peak: 'At his best, Cormier was pressure, wrestling, clinch work, durability, and championship composure. He could fight elite opponents at light heavyweight or heavyweight and still look like one of the best fighters in the world.',
      resume: 'Cormier’s UFC resume is compact but elite: two-division champion, strong title-fight wins, and major victories over contenders and champions.',
      championship: 'The championship case is strong because he won UFC titles in two divisions and defended both belts, even if the Jones rivalry keeps the light heavyweight story from feeling fully clean.',
      opponentQuality: 'Stipe, Anthony Johnson twice, Gustafsson, Oezdemir, Derrick Lewis, Dan Henderson, and Anderson Silva give Cormier a strong high-end UFC resume.',
      longevity: 'Cormier’s UFC elite window was not extremely long, but it was dense. Almost every major UFC fight was title-level or close to it.',
      counter: 'The counterargument is direct separation. Jones beat him, and Stipe won the trilogy, so Cormier has two major rivalry ceilings in the all-time debate.',
      edge: 'Cormier wins comparisons when two-division title value and elite opponent quality outweigh rivalry losses to other all-time greats.',
      eliteCounter: true,
      signatureWins: 'Stipe, Anthony Johnson twice, Gustafsson, Oezdemir, Derrick Lewis, Dan Henderson, and Anderson Silva give Cormier a strong UFC title-level win list.',
      weakness: 'The Jones rivalry and Stipe trilogy keep DC from having clean divisional separation.',
      titleSummary: 'Cormier won UFC gold at light heavyweight and heavyweight, defended both belts, and built a dense title-fight resume in a short UFC window.',
      primeSummary: 'His UFC prime was compact but packed with title fights, elite opponents, and very few low-value appearances.',
      titleStyle: 'Compact Two-Division Champion', primeStyle: 'Dense Elite Window',
      legacyStats: { ufcRecord: '15-3, 1 NC', titleFightWins: 6, beltsWon: 2, titleDefenses: 4, activeEliteYearsLabel: 'roughly 7 active elite years', primeNote: 'compact UFC prime packed with title fights at light heavyweight and heavyweight' }
    },
    watchMoment: { url: 'https://youtube.com/shorts/seA_5VuSqFM?is=2bLCZ4sd8urFGiE8', label: 'Watch Moment' }
  };
  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}), ...(packet.photos || {}) }; if(packet.watchMoment?.url){ DISPLAY_OVERRIDES[fighter].watchUrl = packet.watchMoment.url; DISPLAY_OVERRIDES[fighter].watchLabel = packet.watchMoment.label || 'Watch Moment'; } DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ if(!packet.compareSeasoning) return; window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: current.purpose || 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();

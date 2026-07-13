// Matt Hughes fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-matt-hughes-20260702a';
  const fighter = 'Matt Hughes';

  const packet = {
    status: { stage: 'complete in packet system', lastUpdated: '2026-07-02', nextFix: 'None for Hughes. Continue mid-board packet cleanup.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/matt-hughes.js', displayFallback: 'assets/data/display-overrides.js', compareFallback: 'assets/compare-data.js', profileStatsFallback: 'assets/js/fighter-profile-packages.js', watchFallback: 'assets/js/watch-moments.js', photos: 'assets/fighters/matt-hughes.webp and assets/fighters/matt-hughes-thumb.webp' },
    photos: { photoUrl: 'assets/fighters/matt-hughes.webp', thumbUrl: 'assets/fighters/matt-hughes-thumb.webp' },
    display: {
      divisionLabel: 'WW', resumeTag: 'Early welterweight standard',
      oneLiner: 'The early welterweight title-control case: real championship volume, physical dominance, and one of the defining reigns before the GSP era.',
      snapshot: [ ['UFC Record', '18-7'], ['UFC Title-Fight Wins', '9'], ['Championship Level', 'Early Welterweight Standard'], ['Quality Wins', 'Strong Era Title Wins'],  ['Active Elite Years', '8.4 Elite Years'], ['Loss Context', 'Era context helps, but losses still drag'] ],
      whyRankedHere: 'Hughes ranks #12 because his UFC welterweight title volume is still meaningful. He spent years as the division standard, stacked title wins, and has enough important victories to remain a serious UFC-only GOAT case.',
      whyNotHigher: 'He does not rank higher because era strength, loss volume, and later separation by GSP cap the case. His championship weight is real, but the modern top-tier resumes are cleaner and deeper.',
      keyJudgmentCalls: [ ['Early era context', 'his run was historically huge, but the division was not as deep as later welterweight eras.'], ['GSP rivalry', 'a win over young GSP matters, but GSP ultimately took the all-time welterweight separation.'], ['Title volume', 'is the center of the Hughes case and the reason he remains high.'], ['Loss penalty', 'keeps him below cleaner champions with fewer damaging losses.'], ['UFC-only fit', 'his main value is already inside the UFC scoring boundary.'] ],
      finalTakeaway: 'Hughes is the early welterweight standard: title-heavy, physically dominant, historically important, and held back by era context and loss drag.'
    },
    profileStats: {
      ufcRecord: '18-7', titleFightWins: 9, eliteWins: 9,  finishRatePct: 61.1, roundsWonPct: 70.6, activeEliteYears: 8.36, timesFinishedPrime: 2,
      divisionStrengthContext: 'Early welterweight title value is respected, but division depth is not treated like the later GSP era.',
      lossContext: 'Losses to elite names and later-career damage create real drag, especially once GSP separates himself.'
    },
    compareSeasoning: {
      shortCase: 'Hughes is one of the defining welterweight champions: a physical, title-winning force from the earlier UFC era with real championship volume and a long list of important wins.',
      peak: 'At his best, Hughes was the standard at welterweight: overwhelming grappling, heavy top control, and a title-level style that shaped the division before GSP took over.',
      resume: 'Hughes has real championship depth: title-fight volume, sustained divisional control, and a long run as one of the sport’s defining champions.',
      championship: 'His best argument is championship weight. Hughes did not just win a belt; he spent years as the face of the welterweight title picture.',
      opponentQuality: 'Hughes’ win list carries strong era value, especially when the model gives credit for title-level opponents and former champions in his division.',
      longevity: 'The edge for Hughes is that his case is not one great moment or one short burst. He stayed relevant at championship level for longer than most compact-resume fighters.',
      counter: 'The knock on Hughes is era context. His welterweight run was historically huge, but the division was not as deep or modernized as later welterweight eras.',
      edge: 'Hughes wins when the debate becomes total title weight and sustained divisional control rather than pure peak efficiency.',
      eliteCounter: true,
      signatureWins: 'GSP, Penn, Royce Gracie, Sherk, Trigg, and Newton give Hughes real championship-era weight at welterweight.',
      weakness: 'Era context, later losses, and GSP’s eventual separation keep Hughes below the cleaner modern all-time cases.',
      titleSummary: 'Hughes has major early-welterweight championship volume and spent years as the face of the UFC welterweight title picture.',
      primeSummary: 'His prime was longer and more title-heavy than many compact-resume fighters, even with era-strength context.',
      titleStyle: 'Early Era Long Reign', primeStyle: 'Physical Era Prime',
      legacyStats: { ufcRecord: '18-7', titleFightWins: 9, beltsWon: 1, titleDefenses: 7, activeEliteYearsLabel: 'roughly 8 active elite years', primeNote: 'early-era welterweight title control with real reign volume' }
    },
    watchMoment: { url: 'https://youtube.com/shorts/GmHGebqse1A?is=5ebbOhdaf9CEd8jN', label: 'Watch Moment' }
  };
  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}), ...(packet.photos || {}) }; if(packet.watchMoment?.url){ DISPLAY_OVERRIDES[fighter].watchUrl = packet.watchMoment.url; DISPLAY_OVERRIDES[fighter].watchLabel = packet.watchMoment.label || 'Watch Moment'; } DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ if(!packet.compareSeasoning) return; window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: current.purpose || 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();

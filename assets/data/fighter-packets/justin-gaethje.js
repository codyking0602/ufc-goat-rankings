// Justin Gaethje fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-justin-gaethje-20260702a';
  const fighter = 'Justin Gaethje';

  const packet = {
    status: { stage: 'packet live; photos and Watch Moment needed', lastUpdated: '2026-07-02', nextFix: 'Add Gaethje photos and Watch Moment link. Recalculate raw score if Cody wants final placement.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data-patches.js runtime add-on for first test fighter', centralPacket: 'assets/data/fighter-packets/justin-gaethje.js', displayFallback: 'assets/data/display-overrides.js', watchFallback: 'assets/js/watch-moments.js', photos: 'Add assets/fighters/justin-gaethje.webp and assets/fighters/justin-gaethje-thumb.webp when real files exist.' },
    display: {
      overallOvr: 85, allTimeRank: 27, divisionLabel: 'LW', resumeTag: 'Lightweight violence-resume case',
      oneLiner: 'The lightweight chaos case: elite action wins, huge knockout moments, real title-level relevance, and enough finish losses to keep the GOAT case capped.',
      categories: { championship: { ovr: 76, rank: 26 }, opponentQuality: { ovr: 84, rank: 14 }, primeDominance: { ovr: 84, rank: 26 }, longevity: { ovr: 83, rank: 21 } },
      snapshot: [ ['UFC Record', '11-5'], ['UFC Title-Fight Wins', '3'], ['Championship Level', 'Lightweight title-level threat'], ['Quality Wins', 'Deep modern lightweight ledger'], ['Prime Record', 'Explosive but hittable prime'], ['Active Elite Years', '7.0 Elite Years'], ['Loss Context', 'Khabib, Oliveira, Max, Dustin, and Alvarez losses cap the case'] ],
      whyRankedHere: 'Gaethje ranks here because the UFC-only case has real lightweight depth: Ferguson, Poirier, Chandler, Fiziev, Barboza, Cerrone, Johnson, and later title-level relevance give him one of the louder resumes outside the champion-heavy top tier.',
      whyNotHigher: 'He does not rank higher because the loss context is heavy. Gaethje has been finished in major prime fights, and the championship résumé is not deep enough to offset the damage against cleaner all-time cases.',
      keyJudgmentCalls: [ ['Modern lightweight depth', 'boosts the quality-wins case because this division is treated as one of the hardest UFC environments.'], ['Action style', 'makes the resume feel huge, but style points do not erase finish losses.'], ['Title-level relevance', 'interim/title-level moments matter, but the case trails long-reign champions.'], ['Finish losses', 'Khabib, Oliveira, Max, Dustin, and Alvarez-style damage are the main ceiling.'], ['Non-UFC résumé', 'WSOF context is historical only and is not scored.'] ],
      finalTakeaway: 'Gaethje is a perfect test fighter for the system: wildly respected, very dangerous, loaded with quality fights, but not clean enough to climb into the deeper UFC-only GOAT tier.'
    },
    profileStats: { ufcRecord: '11-5', titleFightWins: 3, eliteWins: 8, primeRecord: '8-5', finishRatePct: 72.7, roundsWonPct: 57.5, activeEliteYears: 7.0, timesFinishedPrime: 5, divisionStrengthContext: 'Modern lightweight gets strong division-strength credit, but the same schedule also creates heavy loss-context drag.', lossContext: 'Gaethje has major prime finish losses to elite opponents, which keeps the UFC-only GOAT score capped despite strong wins.' },
    compareSeasoning: {
      shortCase: 'Gaethje is the lightweight violence-resume case: huge action wins, elite lightweight schedule strength, title-level relevance, and a loss profile that keeps him below cleaner champions.',
      peak: 'At his best, Gaethje is pressure, leg kicks, durability, scrambling, and fight-ending power. He is less controlled than the classic GOAT cases, but the danger level is real every second.',
      resume: 'The UFC resume is deep and loud, especially for a non-long-reign champion. Ferguson, Poirier, Chandler, Fiziev, Barboza, Cerrone, Johnson, and title-level moments give him a strong modern lightweight lane.',
      championship: 'The championship case is meaningful but not top-tier. Gaethje reached and won at title/interim-title level, but he does not have the long reign volume of the elite champions.',
      opponentQuality: 'The opponent-quality argument is the strength: modern lightweight depth, multiple elite names, and very little soft matchmaking once he reached the UFC.',
      longevity: 'Gaethje stayed relevant against elite lightweights for years, but the violent style and repeated finish losses keep longevity from reading like clean dominance.',
      counter: 'Gaethje’s counterargument in debates is that his schedule was brutal and his best wins are better than some cleaner records. The problem is that the losses are also brutal.',
      edge: 'Gaethje wins comparisons when modern lightweight strength, action-fight résumé, and high-end win quality matter more than clean title volume.',
      eliteCounter: true,
      signatureWins: 'Ferguson, Poirier, Chandler, Fiziev, Barboza, Cerrone, Johnson, and title-level lightweight moments make Gaethje one of the best resume-depth additions outside the current board.',
      weakness: 'The finish-loss pile is the ceiling. Khabib, Oliveira, Max, Dustin, and Alvarez-style losses make the case too messy for the higher GOAT tier.',
      titleSummary: 'Gaethje’s title case is real but compact: title/interim-title relevance without the long-reign control needed to challenge the top champions.',
      primeSummary: 'His prime is explosive and high-impact, but it is not clean. He could end elite fighters, but elite fighters also finished him.',
      titleStyle: 'Lightweight Title-Level Threat', primeStyle: 'Violent Action Prime',
      legacyStats: { ufcRecord: '11-5', titleFightWins: 3, beltsWon: 1, titleDefenses: 0, activeEliteYearsLabel: 'roughly 7 active elite years', primeNote: 'modern lightweight action prime with elite wins and heavy finish-loss context' }
    },
    fightLedger: {
      'justin gaethje|khabib nurmagomedov': {
        fighters: ['Justin Gaethje', 'Khabib Nurmagomedov'], fights: 1, winner: 'Khabib Nurmagomedov', importance: 'major',
        summary: 'Khabib submitted Gaethje in a UFC lightweight title fight. Gaethje had real danger, but Khabib owns the clean direct championship result.'
      },
      'charles oliveira|justin gaethje': {
        fighters: ['Charles Oliveira', 'Justin Gaethje'], fights: 1, winner: 'Charles Oliveira', importance: 'major',
        summary: 'Oliveira submitted Gaethje in a chaotic lightweight title-level fight. Gaethje adds danger and schedule strength, but Oliveira owns the direct finish.'
      },
      'justin gaethje|max holloway': {
        fighters: ['Justin Gaethje', 'Max Holloway'], fights: 1, winner: 'Max Holloway', importance: 'major',
        summary: 'Holloway knocked out Gaethje in one of the signature UFC moments. Gaethje still has a strong lightweight résumé, but Max owns the direct result.'
      }
    }
  };

  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}) }; DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function applyLedger(){ window.COMPARE_FIGHT_LEDGER = { ...(window.COMPARE_FIGHT_LEDGER || {}), ...(packet.fightLedger || {}) }; }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); applyLedger(); registerPacket();
})();
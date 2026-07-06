// Dricus du Plessis fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-dricus-du-plessis-20260705a';
  const fighter = 'Dricus du Plessis';

  const packet = {
    status: { stage: 'complete first-pass packet; UFC-only modern middleweight title case loaded', lastUpdated: '2026-07-05', nextFix: 'Audit round-control percentage and exact category ranks after the next scoring pass.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data-additions.js', centralPacket: 'assets/data/fighter-packets/dricus-du-plessis.js', displayFallback: 'packet display object', compareFallback: 'packet compareSeasoning', profileStatsFallback: 'packet profileStats', photos: 'No real photo files loaded yet; app should use initials fallback.' },
    display: {
      overallOvr: 88, allTimeRank: 13, divisionLabel: 'MW', resumeTag: 'Modern middleweight champion',
      oneLiner: 'The modern middleweight chaos champion: Whittaker, Adesanya, and Strickland wins, strong finishing threat, and only one elite decision loss in the UFC.',
      categories: { championship: { ovr: 82, rank: 16 }, opponentQuality: { ovr: 87, rank: 12 }, primeDominance: { ovr: 91, rank: 9 }, longevity: { ovr: 69, rank: 36 } },
      snapshot: [ ['UFC Record', '9-1'], ['UFC Title-Fight Wins', '3'], ['Championship Level', 'Short but Real Title Reign'], ['Quality Wins', 'Whittaker, Adesanya, Strickland x2'], ['Prime Record', '7-1 Elite Window'], ['Active Elite Years', '3.2 Elite Years'], ['Loss Context', 'Khamzat decision loss only'] ],
      whyRankedHere: 'Du Plessis ranks here because his UFC middleweight run got loud fast: Whittaker, Strickland, Adesanya, and Strickland again is a serious modern title-level win stack. The record is clean, the finishing threat is real, and the only UFC loss came to an elite champion-level opponent by decision.',
      whyNotHigher: 'He does not rank higher yet because the elite window is still short. He has strong championship value, but not the long title-fight volume, active elite years, or multi-era proof of the all-time names above him.',
      keyJudgmentCalls: [ ['Non-UFC titles', 'KSW and EFC accomplishments are historical context only, not scored.'], ['Whittaker win', 'treated as the prime-start signal because it proved elite middleweight level.'], ['Adesanya win', 'carries major champion-value credit because it came in a UFC title defense.'], ['Strickland rivalry', 'the two UFC title-fight wins give Dricus real direct separation.'], ['Khamzat loss', 'counts as a prime elite decision loss, with no finish add-on.'] ],
      finalTakeaway: 'Du Plessis is already a real UFC-only middleweight legacy case: not long enough for the inner GOAT circle, but strong enough to sit with the modern champion tier because the high-end wins are loud.'
    },
    profileStats: { ufcRecord: '9-1', titleFightWins: 3, eliteWins: 4, primeRecord: '7-1 in title/elite middleweight window', finishRatePct: 66.7, roundsWonPct: 58.0, activeEliteYears: 3.15, timesFinishedPrime: 0, divisionStrengthContext: 'Modern middleweight is not scored like lightweight, but the Whittaker, Adesanya, and Strickland wins give the opponent-quality case real weight.', lossContext: 'The Khamzat Chimaev loss is counted as a prime elite decision loss, with no finish penalty.' },
    compareSeasoning: {
      shortCase: 'Dricus is the modern middleweight champion burst: a short UFC window, but a loud one built around Whittaker, Strickland, Adesanya, and Strickland again.',
      peak: 'At his best, Dricus is awkward pressure, durability, strength, scrambling, and finishing threat. He may not look clean round-to-round, but he forces elite middleweights into uncomfortable fights.',
      resume: 'The UFC resume is compact but powerful: Whittaker as the elite breakthrough, Strickland for the title, Adesanya for the title defense, and Strickland again for rivalry separation.',
      championship: 'His championship case is real but short. Three UFC title-fight wins give him more than a flash-in-the-pan champion case, but not a long-reign champion case yet.',
      opponentQuality: 'Whittaker, Adesanya, Strickland twice, Brunson, and Till make the win list strong for a short UFC run.',
      longevity: 'Longevity is the clear gap. The elite UFC window is still only a few active years, so older champions with longer proof keep an edge.',
      counter: 'Dricus keeps debates interesting because the high-end wins are stronger than his total UFC time would suggest.',
      edge: 'Dricus wins comparisons when modern title wins and high-end middleweight names matter more than long-term volume.',
      eliteCounter: true,
      signatureWins: 'Whittaker, Strickland twice, Adesanya, Brunson, and Till give Dricus a compact but serious UFC middleweight resume.',
      weakness: 'The weakness is time. His case is still short on title defenses, active elite years, and multi-era proof.',
      titleSummary: 'Three UFC title-fight wins make the title case legit, but still much shorter than the long-reign champions.',
      primeSummary: 'His prime window is still compact, but the peak win quality is already strong enough to matter in all-time debates.',
      titleStyle: 'Short Modern Title Reign', primeStyle: 'Compact Middleweight Burst',
      legacyStats: { ufcRecord: '9-1', titleFightWins: 3, beltsWon: 1, titleDefenses: 2, activeEliteYearsLabel: 'roughly 3 active elite years', primeNote: 'compact modern middleweight burst built around Whittaker, Adesanya, and Strickland title-fight wins' }
    },
    fightLedger: {
      'dricus du plessis|israel adesanya': { winner: 'Dricus du Plessis', summary: 'Dricus submitted Adesanya in a UFC middleweight title defense, so the direct fight helps his case in that matchup.' },
      'dricus du plessis|sean strickland': { winner: 'Dricus du Plessis', summary: 'Dricus beat Strickland twice in UFC middleweight title fights, giving him clean direct rivalry separation.' },
      'dricus du plessis|khamzat chimaev': { winner: 'Khamzat Chimaev', summary: 'Khamzat beat Dricus for the UFC middleweight title, so Dricus loses the direct fight but still keeps a compact champion resume.' },
      'dricus du plessis|robert whittaker': { winner: 'Dricus du Plessis', summary: 'Dricus finished Whittaker in an elite middleweight title eliminator, which is the win that launched his true UFC title-level case.' }
    },
    watchMoment: { url: 'https://youtube.com/shorts/ifsX-hgSzz4?is=NWgRwVVkTzsNBGVC', label: 'Watch Moment' }
  };

  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}) }; if(packet.watchMoment?.url){ DISPLAY_OVERRIDES[fighter].watchUrl = packet.watchMoment.url; DISPLAY_OVERRIDES[fighter].watchLabel = packet.watchMoment.label || 'Watch Moment'; } DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ if(packet.compareSeasoning){ window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } } if(packet.fightLedger){ window.COMPARE_FIGHT_LEDGER = window.COMPARE_FIGHT_LEDGER || {}; Object.entries(packet.fightLedger).forEach(([key,value])=>{ window.COMPARE_FIGHT_LEDGER[key] = { ...(window.COMPARE_FIGHT_LEDGER[key] || {}), ...value }; }); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: current.purpose || 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();

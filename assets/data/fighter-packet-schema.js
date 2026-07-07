// Do not add new fighter data here.
// LEGACY: fighter data has been migrated to assets/data/ranking-data.js.
// Locked Fighter Packet Schema
// This is the checklist for every fighter-facing packet.
// Scoring math stays in ranking-data.js; app-facing content lives in fighter packets.
(function(){
  const VERSION = 'fighter-packet-schema-20260703a';

  const REQUIRED_TOP_LEVEL = [
    'status',
    'repoLocations',
    'photos',
    'display',
    'profileStats',
    'compareSeasoning',
    'watchMoment'
  ];

  const REQUIRED_DISPLAY = [
    'overallOvr',
    'allTimeRank',
    'divisionLabel',
    'resumeTag',
    'oneLiner',
    'categories',
    'snapshot',
    'whyRankedHere',
    'keyJudgmentCalls',
    'finalTakeaway'
  ];

  const REQUIRED_PROFILE_STATS = [
    'ufcRecord',
    'titleFightWins',
    'eliteWins',
    'primeRecord',
    'finishRatePct',
    'roundsWonPct',
    'activeEliteYears',
    'timesFinishedPrime',
    'lossContext'
  ];

  const REQUIRED_COMPARE_SEASONING = [
    'shortCase',
    'peak',
    'resume',
    'championship',
    'opponentQuality',
    'longevity',
    'counter',
    'edge',
    'signatureWins',
    'weakness',
    'titleSummary',
    'primeSummary',
    'titleStyle',
    'primeStyle',
    'bestArgument',
    'legacyStats'
  ];

  const REQUIRED_LEGACY_STATS = [
    'ufcRecord',
    'titleFightWins',
    'activeEliteYearsLabel',
    'primeNote'
  ];

  function missingKeys(obj, keys){
    return keys.filter(key => obj?.[key] === undefined || obj?.[key] === null || obj?.[key] === '');
  }

  function validatePacket(name, packet){
    const missing = {
      topLevel: missingKeys(packet, REQUIRED_TOP_LEVEL),
      display: missingKeys(packet?.display, REQUIRED_DISPLAY),
      profileStats: missingKeys(packet?.profileStats, REQUIRED_PROFILE_STATS),
      compareSeasoning: missingKeys(packet?.compareSeasoning, REQUIRED_COMPARE_SEASONING),
      legacyStats: missingKeys(packet?.compareSeasoning?.legacyStats, REQUIRED_LEGACY_STATS)
    };
    const complete = Object.values(missing).every(list => list.length === 0);
    return { fighter: name, complete, missing };
  }

  function auditPackets(packets){
    const source = packets || window.UFC_FIGHTER_PACKETS || {};
    const results = Object.entries(source).map(([name, packet]) => validatePacket(name, packet));
    return {
      version: VERSION,
      total: results.length,
      complete: results.filter(x => x.complete).map(x => x.fighter),
      incomplete: results.filter(x => !x.complete),
      results
    };
  }

  window.UFC_FIGHTER_PACKET_SCHEMA = {
    version: VERSION,
    required: {
      topLevel: REQUIRED_TOP_LEVEL,
      display: REQUIRED_DISPLAY,
      profileStats: REQUIRED_PROFILE_STATS,
      compareSeasoning: REQUIRED_COMPARE_SEASONING,
      legacyStats: REQUIRED_LEGACY_STATS
    },
    validatePacket,
    auditPackets
  };
})();
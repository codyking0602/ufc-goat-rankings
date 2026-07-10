// Alex Pereira fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-alex-pereira-20260702c';
  const fighter = 'Alex Pereira';

  const packet = {
    status: { stage: 'packet live; Watch Moment added; Gane loss updated', lastUpdated: '2026-07-02', nextFix: 'Recalculate raw model score if Cody wants the base scoring table adjusted too.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data.js', centralPacket: 'assets/data/fighter-packets/alex-pereira.js', displayFallback: 'assets/data/display-overrides.js', compareFallback: 'assets/compare-coverage-pack-2.js', watchFallback: 'assets/data/fighter-packets/alex-pereira.js', photos: 'assets/fighters/alex-pereira.webp and assets/fighters/alex-pereira-thumb.webp' },
    photos: { photoUrl: 'assets/fighters/alex-pereira.webp', thumbUrl: 'assets/fighters/alex-pereira-thumb.webp' },
    display: {
      overallOvr: 85, allTimeRank: 20, divisionLabel: 'MW / LHW / HW', resumeTag: 'Fast two-division knockout case',
      oneLiner: 'The fast-climb knockout case: middleweight gold, light heavyweight gold, huge title moments, and a heavyweight swing that added risk to a short UFC prime.',
      categories: { championship: { ovr: 84, rank: 10 }, opponentQuality: { ovr: 82, rank: 16 }, primeDominance: { ovr: 81, rank: 32 }, longevity: { ovr: 78, rank: 28 } },
      snapshot: [ ['UFC Record', '10-4'], ['UFC Title-Fight Wins', '5'], ['Championship Level', 'Two-Division UFC Champion'], ['Quality Wins', 'Compact High-Impact Win List'],  ['Active Elite Years', '3.6 Elite Years'], ['Loss Context', 'Adesanya and Gane finish losses cap the case'] ],
      whyRankedHere: 'Pereira ranks here because his UFC case is short but extremely loud: two-division champion value, major knockout moments, and high-end wins packed into a very small window.',
      whyNotHigher: 'He does not rank higher because the active elite window is still short compared with the long-reign resumes, and the Adesanya and Gane finish losses now give the profile more prime-loss drag. The peak impact is massive, but the total UFC sample is not deep or clean enough yet.',
      keyJudgmentCalls: [ ['Two-division value', 'middleweight and light heavyweight gold carry major front-end value.'], ['Knockout impact', 'a huge part of the profile and why the resume feels louder than the raw volume.'], ['Gane loss', 'counts as a reduced upward-division elite loss, but being finished still matters.'], ['Adesanya rivalry', 'adds both a major title win and a major knockout loss.'], ['Short sample', 'keeps longevity and total resume score capped.'] ],
      finalTakeaway: 'Pereira remains the loudest short-run case in the ranking: massive title impact and knockout danger, with the Gane heavyweight finish loss adding real drag to an already compact resume.'
    },
    profileStats: { ufcRecord: '10-4', titleFightWins: 5, eliteWins: 6,  finishRatePct: 80.0, roundsWonPct: 60.0, activeEliteYears: 3.59, timesFinishedPrime: 2, divisionStrengthContext: 'Two-division title value drives the case, with the heavyweight Gane attempt treated as upward-division risk rather than the core resume.', lossContext: 'Adesanya and Gane are the counted UFC prime finish losses; Gane receives reduced upward-division elite-loss context but still adds finish drag.' },
    compareSeasoning: {
      shortCase: 'Pereira is the fast-climb, two-division knockout case: middleweight gold, light heavyweight gold, huge title moments, and a risky heavyweight swing that made the resume louder but messier.',
      peak: 'At his best, Pereira is terrifying because every exchange carries fight-ending danger. The left hook, calf kicks, patience, size, and championship composure make him feel different from normal contenders.',
      resume: 'Pereira’s UFC case is short but extremely loud. He does not have the long active-elite window of the older legends, and the Gane finish loss makes the profile messier, but the title value and finish impact are still massive.',
      championship: 'His championship case is the separator: he won UFC titles in two divisions and stacked high-profile light heavyweight title wins in a very short period.',
      opponentQuality: 'Adesanya, Prochazka twice, Hill, Blachowicz, Strickland, and Rountree give Pereira a compact but high-impact UFC win list, while the Gane loss adds heavyweight context without becoming a win credit.',
      longevity: 'Longevity is the limiter. Pereira rose fast and did a lot quickly, but he still trails the long-reign legends in active elite years.',
      counter: 'The argument against Pereira is volume and loss context. The peak is huge, but the UFC sample is still shorter and now messier than the deepest all-time cases.',
      edge: 'Pereira wins comparisons when two-division title value, knockout danger, and high-impact championship moments outweigh longer but less explosive resumes.',
      eliteCounter: true,
      signatureWins: 'Adesanya, Prochazka twice, Hill, Blachowicz, Strickland, and Rountree give Pereira one of the loudest short-run win lists in the ranking.',
      weakness: 'The case is still short, and the Adesanya/Gane finish losses keep him below cleaner long-reign GOAT resumes.',
      titleSummary: 'Pereira’s title case is built on winning UFC gold at middleweight and light heavyweight, then adding major light heavyweight title wins almost immediately.',
      primeSummary: 'His elite window is short compared with long-reign champions, and the Gane loss adds heavyweight risk context plus a second counted UFC prime finish loss.',
      titleStyle: 'Fast Two-Division Champion', primeStyle: 'Short Knockout Prime',
      legacyStats: { ufcRecord: '10-4', titleFightWins: 5, beltsWon: 2, titleDefenses: 3, activeEliteYearsLabel: 'roughly 4 active elite years', primeNote: 'short explosive two-division title run with Adesanya and Gane as counted UFC prime finish losses' }
    },
    watchMoment: { url: 'https://youtube.com/shorts/rb-yUzZNAcQ?is=o8jclP4Z3MTHGH0x', label: 'Watch Moment' }
  };
  function mergeLegacyStats(a,b){ return { ...(a || {}), ...(b || {}) }; }
  function mergeCompareProfile(a,b){ return { ...(a || {}), ...(b || {}), legacyStats: mergeLegacyStats((a || {}).legacyStats, (b || {}).legacyStats) }; }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}), ...(packet.photos || {}) }; if(packet.watchMoment?.url){ DISPLAY_OVERRIDES[fighter].watchUrl = packet.watchMoment.url; DISPLAY_OVERRIDES[fighter].watchLabel = packet.watchMoment.label || 'Watch Moment'; } DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: current.purpose || 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  applyDisplay(); applyCompare(); registerPacket();
})();
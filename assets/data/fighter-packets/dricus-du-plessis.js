// Dricus du Plessis fighter packet extension.
(function(){
  const VERSION = 'fighter-packet-dricus-du-plessis-20260705d-apex-adjust';
  const fighter = 'Dricus du Plessis';

  const rounds = [
    { opponent:'Markus Perez', date:'2020-10-11', method:'KO', roundEnded:1, roundsCounted:1, roundsWon:1, basis:'Round 1 finish counted as won', confidence:'High', notes:'' },
    { opponent:'Trevin Giles', date:'2021-07-10', method:'TKO', roundEnded:2, roundsCounted:2, roundsWon:1, basis:'Finish round counted as won; prior round treated conservatively', confidence:'Low', notes:'Best-effort round-control row.' },
    { opponent:'Brad Tavares', date:'2022-07-02', method:'Decision', roundEnded:3, roundsCounted:3, roundsWon:3, basis:'Decision scorecards / clear control estimate', confidence:'Medium', notes:'' },
    { opponent:'Darren Till', date:'2022-12-10', method:'Submission', roundEnded:3, roundsCounted:3, roundsWon:2, basis:'Round 1 plus finish round counted', confidence:'Medium', notes:'Best-effort split because Till had mid-fight success.' },
    { opponent:'Derek Brunson', date:'2023-03-04', method:'TKO', roundEnded:2, roundsCounted:2, roundsWon:1, basis:'Finish round counted as won; early grappling round treated conservatively', confidence:'Low', notes:'Best-effort round-control row.' },
    { opponent:'Robert Whittaker', date:'2023-07-08', method:'TKO', roundEnded:2, roundsCounted:2, roundsWon:2, basis:'Finish round counted as won with strong prior-round work', confidence:'Medium', notes:'' },
    { opponent:'Sean Strickland', date:'2024-01-20', method:'Split Decision', roundEnded:5, roundsCounted:5, roundsWon:3, basis:'Official split title scorecard result', confidence:'Medium', notes:'Close title fight; 3-of-5 treated as the scoring-side call.' },
    { opponent:'Israel Adesanya', date:'2024-08-18', method:'Submission', roundEnded:4, roundsCounted:4, roundsWon:2, basis:'Finish round counted as won; earlier rounds split conservatively', confidence:'Medium', notes:'Best-effort row due competitive striking rounds.' },
    { opponent:'Sean Strickland 2', date:'2025-02-09', method:'Decision', roundEnded:5, roundsCounted:5, roundsWon:4, basis:'Current-table title-defense result; clearer rematch win', confidence:'Low', notes:'Current-table / best-effort row until next full scoring rebuild.' },
    { opponent:'Khamzat Chimaev', date:'2025-08-16', method:'Decision Loss', roundEnded:5, roundsCounted:5, roundsWon:0, basis:'Current-table title loss treated as elite decision loss', confidence:'Low', notes:'Current-table / best-effort row until next full scoring rebuild.' }
  ];

  const packet = {
    status: { stage: 'complete first-pass packet; reviewed against fighter-add workflow; Dricus Apex Peak adjusted by Cody', lastUpdated: '2026-07-05', nextFix: 'Add real photos after Cody uploads source images; audit exact rounds-won percentage during next scoring-table rebuild.' },
    repoLocations: { scoreSource: 'assets/data/ranking-data-additions.js', centralPacket: 'assets/data/fighter-packets/dricus-du-plessis.js', apexPeak: 'assets/data/apex-peak-score-corrections.js', watchMoment: 'assets/js/watch-moments.js', tracker: 'docs/fighter-status.md', photos: 'No real photo files loaded yet; app should use initials fallback.' },
    photos: {},
    rounds,
    display: {
      overallOvr: 88, allTimeRank: 13, divisionLabel: 'MW', resumeTag: 'Modern middleweight champion',
      oneLiner: 'The modern middleweight chaos champion: Whittaker, Adesanya, and Strickland wins, strong finishing threat, and only one elite decision loss in the UFC.',
      categories: { championship: { ovr: 82, rank: 16 }, opponentQuality: { ovr: 87, rank: 12 }, primeDominance: { ovr: 91, rank: 9 }, longevity: { ovr: 69, rank: 36 }, apexPeak: { ovr: 70, rank: 28 }, penalty: { ovr: 91, rank: 8 } },
      snapshot: [ ['UFC Record', '9-1'], ['UFC Title-Fight Wins', '3'], ['Apex Peak', '+2.50'], ['Quality Wins', 'Whittaker, Adesanya, Strickland x2'], ['Prime Record', '7-1 Elite Window'], ['Active Elite Years', '3.2 Elite Years'], ['Loss Context', 'Khamzat decision loss only'] ],
      whyRankedHere: 'Du Plessis ranks here because his UFC middleweight run got loud fast: Whittaker, Strickland, Adesanya, and Strickland again is a serious modern title-level win stack. The record is clean, the finishing threat is real, and the only UFC loss came to an elite champion-level opponent by decision.',
      whyNotHigher: 'He does not rank higher yet because the elite window is still short. He has strong championship value, but not the long title-fight volume, active elite years, clean apex aura, or multi-era proof of the all-time names above him.',
      bigAssumptions: [ ['Current-table scope', 'Uses the current scoring-table version where Dricus is 9-1 in the UFC with title wins over Strickland, Adesanya, and Strickland again, plus a Khamzat title loss.'], ['Apex window', 'Whittaker through Adesanya/Strickland II is treated as his best short UFC window.'], ['Middleweight strength', 'Modern middleweight gets respect but does not score like lightweight or GSP-era welterweight.'], ['Loss treatment', 'The Khamzat loss is a prime elite decision loss only, not a finish penalty.'], ['Apex adjustment', 'Peak status, elite proof, separation, and aura were reduced by Cody to avoid over-crediting a short, chaotic title burst.'], ['Round control', 'Round rows are best-effort and should be audited in the next full scoring-table rebuild.'] ],
      keyJudgmentCalls: [ ['Non-UFC titles', 'KSW and EFC accomplishments are historical context only, not scored.'], ['Whittaker win', 'treated as the prime-start signal because it proved elite middleweight level.'], ['Adesanya win', 'carries major champion-value credit because it came in a UFC title defense.'], ['Strickland rivalry', 'the two UFC title-fight wins give Dricus real direct separation.'], ['Khamzat loss', 'counts as a prime elite decision loss, with no finish add-on.'] ],
      apexPeakSummary: { score: 2.50, window: 'Robert Whittaker 2023 through Israel Adesanya 2024 / Sean Strickland II 2025', notes: 'Strong title-window proof, but reduced peak-status, separation, and aura credit because the window is short and not clean.' },
      finalTakeaway: 'Du Plessis is already a real UFC-only middleweight legacy case: not long enough or clean enough for the inner GOAT circle, but strong enough to sit with the modern champion tier because the high-end wins are loud.'
    },
    profileStats: { ufcRecord: '9-1', titleFightWins: 3, eliteWins: 4, primeRecord: '7-1 in title/elite middleweight window', finishRatePct: 66.7, roundsWonPct: 58.0, activeEliteYears: 3.15, apexPeak: 2.50, timesFinishedPrime: 0, divisionStrengthContext: 'Modern middleweight is not scored like lightweight, but the Whittaker, Adesanya, and Strickland wins give the opponent-quality case real weight.', lossContext: 'The Khamzat Chimaev loss is counted as a prime elite decision loss, with no finish penalty.' },
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
      weakness: 'The weakness is time. His case is still short on title defenses, active elite years, and clean apex aura.',
      titleSummary: 'Three UFC title-fight wins make the title case legit, but still much shorter than the long-reign champions.',
      primeSummary: 'His prime window is still compact. The win quality matters, but the adjusted apex score avoids treating it like a clean mythic peak.',
      bestArgument: 'Dricus has a rare compact-resume argument: even without long longevity, the Whittaker, Adesanya, and Strickland title-level wins make the top end hard to dismiss.',
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
  function patchData(){ if(!window.RANKING_DATA) return; [...(window.RANKING_DATA.men || []), ...(window.RANKING_DATA.fighters || [])].forEach(row => { if(row?.fighter !== fighter) return; row.rounds = rounds; }); }
  function applyDisplay(){ if(typeof DISPLAY_OVERRIDES === 'undefined') return; DISPLAY_OVERRIDES[fighter] = { ...(DISPLAY_OVERRIDES[fighter] || {}), ...(packet.display || {}) }; if(packet.watchMoment?.url){ DISPLAY_OVERRIDES[fighter].watchUrl = packet.watchMoment.url; DISPLAY_OVERRIDES[fighter].watchLabel = packet.watchMoment.label || 'Watch Moment'; } DISPLAY_OVERRIDES[fighter].packetProfileStats = { ...(DISPLAY_OVERRIDES[fighter].packetProfileStats || {}), ...(packet.profileStats || {}) }; DISPLAY_OVERRIDES[fighter].packetStatus = packet.status || {}; DISPLAY_OVERRIDES[fighter].repoLocations = packet.repoLocations || {}; }
  function applyCompare(){ if(packet.compareSeasoning){ window.COMPARE_PROFILES = window.COMPARE_PROFILES || {}; window.COMPARE_PROFILES[fighter] = mergeCompareProfile(window.COMPARE_PROFILES[fighter], packet.compareSeasoning); if(typeof DISPLAY_OVERRIDES !== 'undefined'){ DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {}; DISPLAY_OVERRIDES[fighter].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[fighter].compareProfile, window.COMPARE_PROFILES[fighter]); } } if(packet.fightLedger){ window.COMPARE_FIGHT_LEDGER = window.COMPARE_FIGHT_LEDGER || {}; Object.entries(packet.fightLedger).forEach(([key,value])=>{ window.COMPARE_FIGHT_LEDGER[key] = { ...(window.COMPARE_FIGHT_LEDGER[key] || {}), ...value }; }); } }
  function registerPacket(){ window.UFC_FIGHTER_PACKETS = window.UFC_FIGHTER_PACKETS || {}; window.UFC_FIGHTER_PACKETS[fighter] = packet; const current = window.UFC_FIGHTER_PACKET_SYSTEM || {}; const fighters = Array.from(new Set([...(current.fighters || []), fighter])); const packetExtensions = Array.from(new Set([...(current.packetExtensions || []), VERSION])); window.UFC_FIGHTER_PACKET_SYSTEM = { ...current, version: current.version || VERSION, purpose: current.purpose || 'Central source for fighter-facing app content during migration.', fighters, packetExtensions, appliedAt: new Date().toISOString() }; }
  patchData(); applyDisplay(); applyCompare(); registerPacket();
})();

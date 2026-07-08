// Matt Hughes category consistency audit.
// Aligns Prime Dominance, profile snapshot, and category notes around the locked title-prime window.
(function(){
  const VERSION = 'matt-hughes-consistency-audit-20260708a';
  const fighter = 'Matt Hughes';
  const DATA = window.RANKING_DATA;
  const base = window.UFC_PRIME_DOMINANCE_LEDGERS;
  if(!DATA || !base || base.mattHughesConsistencyVersion === VERSION) return;

  function round(v){ return Math.round((Number(v || 0) + Number.EPSILON) * 100) / 100; }
  function recalc(row){
    return round(Number(row.championship || 0) + Number(row.opponentQuality || 0) + Number(row.primeDominance || 0) + Number(row.longevity || 0) + Number(row.penalty || 0));
  }
  function rowsFor(name){
    const rows = [];
    const push = row => { if(row?.fighter === name) rows.push(row); };
    (DATA.men || []).forEach(push);
    (DATA.women || []).forEach(push);
    (DATA.fighters || []).forEach(push);
    return rows;
  }
  function rankBoards(){
    [DATA.men, DATA.women].forEach(board => {
      if(!Array.isArray(board)) return;
      board.sort((a,b) => Number(b.totalScore || 0) - Number(a.totalScore || 0) || String(a.fighter).localeCompare(String(b.fighter)));
      board.forEach((row, index) => { row.rank = index + 1; });
    });
  }

  const entry = {
    fighter,
    primeRecord: '12-3',
    primeWins: 12,
    primeLosses: 3,
    primeDraws: 0,
    primeNCs: 0,
    primeRecordPct: 80,
    primeRecordScore: 7.20,
    roundControlPct: 75.76,
    roundControlScore: 6.06,
    roundControlAudit: { fighter, roundsWon: 25, roundsCounted: 33, roundControlPct: 75.76, status: 'locked' },
    primeFights: 15,
    primeFinishes: 9,
    primeFinishRate: 60,
    finishPressureScore: 4.00,
    eliteStakesBreakdown: { titleFightWins: 2, topFiveWins: 1.1, champFormerChampWins: .8, fiveRoundTitleStageSample: .5, divisionStrengthContext: .1 },
    eliteStakesRawScore: 4.50,
    eliteStakesScore: 7.20,
    dominanceProfile: 'UFC title-prime from the Carlos Newton title win through the GSP III interim-title loss; Penn and GSP losses are counted.',
    status: 'locked',
    total: 24.46,
    version: VERSION,
    auditNotes: [
      'Prime starts at the Carlos Newton title win, not the Hallman pre-prime loss.',
      'Prime runs through GSP III because it was still an interim UFC title fight.',
      'Penn I, GSP II, and GSP III are counted inside the Prime Dominance window.',
      'Alves, Penn III, and Koscheck are post-prime for this consistency pass.'
    ]
  };

  const previousEntryFor = base.entryFor;
  base.entryFor = function(name){
    if(name === fighter) return entry;
    return previousEntryFor ? previousEntryFor(name) : null;
  };

  const replaceInReport = report => {
    const next = (Array.isArray(report) ? report : []).filter(row => row?.fighter !== fighter);
    next.push(entry);
    next.sort((a,b) => Number(b.total || 0) - Number(a.total || 0) || String(a.fighter).localeCompare(String(b.fighter)));
    return next;
  };

  base.report = replaceInReport(base.report);
  base.leaders = base.report.slice(0,15);
  base.mattHughesConsistencyVersion = VERSION;
  base.mode = `${base.mode || 'prime-dominance'} + Hughes consistency audit`;

  if(window.UFC_PRIME_DOMINANCE_SHADOW_MODEL){
    window.UFC_PRIME_DOMINANCE_SHADOW_MODEL.report = replaceInReport(window.UFC_PRIME_DOMINANCE_SHADOW_MODEL.report || base.report);
    window.UFC_PRIME_DOMINANCE_SHADOW_MODEL.mattHughesConsistency = entry;
  }

  rowsFor(fighter).forEach(row => {
    row.primeDominance = entry.total;
    row.primeDominanceLiveAudit = entry;
    row.primeDominanceShadowAudit = entry;
    row.primeRecord = entry.primeRecord;
    row.roundsWonPct = entry.roundControlPct;
    row.primeFinishRatePct = entry.primeFinishRate;
    row.primeRoundsWon = entry.roundControlAudit.roundsWon;
    row.primeRoundsCounted = entry.roundControlAudit.roundsCounted;
    row.primeFinishes = entry.primeFinishes;
    row.primeFights = entry.primeFights;
    row.totalScore = recalc(row);
  });
  rankBoards();

  if(typeof DISPLAY_OVERRIDES !== 'undefined'){
    DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {};
    const o = DISPLAY_OVERRIDES[fighter];
    o.snapshotStats = {
      ...(o.snapshotStats || {}),
      primeDominance: entry.total,
      primeDominanceLive: entry.total,
      primeRecord: entry.primeRecord,
      roundsWon: '25/33 (75.76%)',
      roundControl: '75.76%',
      primeFinishRate: '60% (9/15)',
      dominanceProfile: entry.dominanceProfile
    };
    o.packetProfileStats = {
      ...(o.packetProfileStats || {}),
      primeRecord: entry.primeRecord,
      primeDominance: entry.total,
      primeFinishRatePct: entry.primeFinishRate,
      roundsWonPct: entry.roundControlPct,
      lossContext: 'Hallman is pre-prime damage; Penn I, GSP II, and GSP III are title-prime losses; Alves and later losses are post-prime for this pass.'
    };
    o.snapshot = [
      ['UFC Record', '18-7'],
      ['UFC Title-Fight Wins', '9'],
      ['Prime Dominance', `${entry.total.toFixed(2)} / 30`],
      ['Prime Record', entry.primeRecord],
      ['Rounds Won', '25/33 (75.76%)'],
      ['Prime Finish Rate', '60% (9/15)'],
      ['Active Elite Years', '8.36'],
      ['Loss Context', 'Hallman pre-prime; Penn/GSP title-prime damage']
    ];
  }

  window.UFC_MATT_HUGHES_CATEGORY_CONSISTENCY = { version: VERSION, entry, appliedAt: new Date().toISOString() };
  document.documentElement.setAttribute('data-matt-hughes-consistency-audit', VERSION);
  if(window.UFC_PRIME_DOMINANCE_LIVE_PROMOTER?.apply) window.UFC_PRIME_DOMINANCE_LIVE_PROMOTER.apply();
  if(typeof refresh === 'function'){
    try { refresh(); } catch(e) {}
  }
})();

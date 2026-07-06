// Overall score weighting layer.
// Keeps category formulas intact, then applies Cody-approved GOAT weights to the final total.
(function(){
  const VERSION = 'score-weighting-20260705a';
  const DATA = window.RANKING_DATA;
  if(!DATA) return;

  const WEIGHTS = {
    championship: 35,
    primeDominance: 27.5,
    opponentQuality: 27.5,
    longevity: 10
  };
  const BASE_MAX = {
    championship: 30,
    primeDominance: 30,
    opponentQuality: 25,
    longevity: 15
  };
  const PENALTY_MODE = 'Loss penalty remains a separate raw negative modifier after the weighted positive score.';

  function num(value){
    const n = Number(value || 0);
    return Number.isFinite(n) ? n : 0;
  }
  function round2(value){
    return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
  }
  function weightedComponent(row, key){
    return (num(row[key]) / BASE_MAX[key]) * WEIGHTS[key];
  }
  function scoreBreakdown(row){
    const championship = weightedComponent(row, 'championship');
    const primeDominance = weightedComponent(row, 'primeDominance');
    const opponentQuality = weightedComponent(row, 'opponentQuality');
    const longevity = weightedComponent(row, 'longevity');
    const penalty = num(row.penalty);
    const positiveScore = championship + primeDominance + opponentQuality + longevity;
    const totalScore = positiveScore + penalty;
    return {
      championship: round2(championship),
      primeDominance: round2(primeDominance),
      opponentQuality: round2(opponentQuality),
      longevity: round2(longevity),
      positiveScore: round2(positiveScore),
      penalty: round2(penalty),
      totalScore: round2(totalScore)
    };
  }
  function recalcTotal(row){
    return scoreBreakdown(row).totalScore;
  }
  function patchRow(row){
    if(!row) return;
    const breakdown = scoreBreakdown(row);
    row.totalScore = breakdown.totalScore;
    row.weightedScoreBreakdown = breakdown;
    row.scoreWeightingVersion = VERSION;
  }
  function sortBoard(board){
    if(!Array.isArray(board)) return;
    board.sort((a,b) => num(b.totalScore) - num(a.totalScore));
    board.forEach((row,index) => { row.rank = index + 1; });
  }

  [...(DATA.men || []), ...(DATA.women || []), ...(DATA.fighters || [])].forEach(patchRow);
  sortBoard(DATA.men);
  sortBoard(DATA.women);

  const boardRows = [...(DATA.men || []), ...(DATA.women || [])];
  const rankByFighter = new Map(boardRows.map(row => [row.fighter, row.rank]));
  const scoreByFighter = new Map(boardRows.map(row => [row.fighter, row.totalScore]));
  const breakdownByFighter = new Map(boardRows.map(row => [row.fighter, row.weightedScoreBreakdown]));

  (DATA.fighters || []).forEach(profile => {
    if(rankByFighter.has(profile.fighter)) profile.rank = rankByFighter.get(profile.fighter);
    if(scoreByFighter.has(profile.fighter)) profile.totalScore = scoreByFighter.get(profile.fighter);
    if(breakdownByFighter.has(profile.fighter)) profile.weightedScoreBreakdown = breakdownByFighter.get(profile.fighter);
    profile.scoreWeightingVersion = VERSION;
  });

  if(DATA.meta){
    DATA.meta.scoringWeights = { version: VERSION, weights: WEIGHTS, baseMax: BASE_MAX, penaltyMode: PENALTY_MODE };
  }

  if(typeof DISPLAY_OVERRIDES !== 'undefined'){
    rankByFighter.forEach((rank,fighter) => {
      if(!DISPLAY_OVERRIDES[fighter]) return;
      DISPLAY_OVERRIDES[fighter].allTimeRank = rank;
    });
  }

  function installRulesWeightNote(){
    if(typeof renderRules !== 'function') return;
    const originalRenderRules = renderRules;
    renderRules = function(){
      originalRenderRules();
      const target = document.getElementById('rulesContent');
      if(!target || target.dataset.scoreWeightingVersion === VERSION) return;
      target.dataset.scoreWeightingVersion = VERSION;
      target.insertAdjacentHTML('beforeend', `
        <div class="card"><h3>Overall Weighting</h3><table class="table"><tbody>
          <tr><td><strong>Title Reign</strong></td><td>35%</td></tr>
          <tr><td><strong>Prime Dominance</strong></td><td>27.5%</td></tr>
          <tr><td><strong>Quality Wins</strong></td><td>27.5%</td></tr>
          <tr><td><strong>Elite Longevity</strong></td><td>10%</td></tr>
          <tr><td><strong>Loss Context</strong></td><td>Separate modifier after the positive score.</td></tr>
        </tbody></table><p class="meta">Category formulas stay intact; this layer only changes how they combine into the overall ranking.</p></div>
      `);
    };
  }

  installRulesWeightNote();

  window.UFC_SCORE_WEIGHTING = {
    version: VERSION,
    weights: WEIGHTS,
    baseMax: BASE_MAX,
    penaltyMode: PENALTY_MODE,
    formula: 'championship/30*35 + primeDominance/30*27.5 + opponentQuality/25*27.5 + longevity/15*10 + penalty',
    appliedAt: new Date().toISOString()
  };

  if(typeof refresh === 'function'){
    try { refresh(); } catch(e) {}
  }
})();

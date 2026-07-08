// Overall score weighting layer.
// Applies Cody-approved GOAT weights. Main categories are all treated as 30-point category scores.
(function(){
  const VERSION = 'score-weighting-20260708b-prime-windows-loader';
  const DATA = window.RANKING_DATA;
  if(!DATA) return;

  const WEIGHTS = {
    championship: 35,
    opponentQuality: 27.5,
    primeDominance: 27.5,
    longevity: 10
  };
  const BASE_MAX = {
    championship: 30,
    opponentQuality: 30,
    primeDominance: 30,
    longevity: 30
  };
  const LEGACY_LONGEVITY_MAX = 15;
  const PENALTY_MODE = 'Loss penalty remains a separate raw negative modifier after the 100-point positive category score. Apex Peak is display-only and is not included in total score.';

  function num(value){
    const n = Number(value || 0);
    return Number.isFinite(n) ? n : 0;
  }
  function round2(value){
    return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
  }
  function categoryScore(row,key){
    if(key === 'longevity'){
      const raw = num(row.longevity);
      if(row.longevityThirtyPoint === true || raw > LEGACY_LONGEVITY_MAX) return raw;
      return (raw / LEGACY_LONGEVITY_MAX) * BASE_MAX.longevity;
    }
    return num(row[key]);
  }
  function weightedComponent(row, key){
    return (categoryScore(row,key) / BASE_MAX[key]) * WEIGHTS[key];
  }
  function scoreBreakdown(row){
    const championship = weightedComponent(row, 'championship');
    const opponentQuality = weightedComponent(row, 'opponentQuality');
    const primeDominance = weightedComponent(row, 'primeDominance');
    const longevity = weightedComponent(row, 'longevity');
    const apexPeak = num(row.apexPeak);
    const penalty = num(row.penalty);
    const positiveScore = championship + opponentQuality + primeDominance + longevity;
    const totalScore = positiveScore + penalty;
    return {
      championship: round2(championship),
      opponentQuality: round2(opponentQuality),
      primeDominance: round2(primeDominance),
      longevity: round2(longevity),
      apexPeak: round2(apexPeak),
      positiveScore: round2(positiveScore),
      penalty: round2(penalty),
      totalScore: round2(totalScore)
    };
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
    DATA.meta.scoringWeights = { version: VERSION, weights: WEIGHTS, baseMax: BASE_MAX, legacyLongevityMax: LEGACY_LONGEVITY_MAX, penaltyMode: PENALTY_MODE };
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
          <tr><td><strong>Championship Resume</strong></td><td>35%</td></tr>
          <tr><td><strong>Quality Wins</strong></td><td>27.5%</td></tr>
          <tr><td><strong>Prime Dominance</strong></td><td>27.5%</td></tr>
          <tr><td><strong>Elite Longevity</strong></td><td>10%</td></tr>
          <tr><td><strong>Loss Context</strong></td><td>Separate negative modifier after the positive score.</td></tr>
        </tbody></table><p class="meta">Each main category is treated as a 30-point score, then multiplied by its category weight. Apex Peak is shown on profiles but is not part of the total-score formula.</p></div>
      `);
    };
  }

  function loadPrimeWindows(){
    if(document.querySelector('script[data-prime-windows]')){
      if(window.UFC_PRIME_WINDOWS?.apply) window.UFC_PRIME_WINDOWS.apply();
      return;
    }
    const script=document.createElement('script');
    script.src='assets/data/prime-windows.js?v=prime-windows-20260708a';
    script.setAttribute('data-prime-windows','true');
    script.onload=()=>{ if(window.UFC_PRIME_WINDOWS?.apply) window.UFC_PRIME_WINDOWS.apply(); };
    document.body.appendChild(script);
  }

  installRulesWeightNote();
  loadPrimeWindows();

  window.UFC_SCORE_WEIGHTING = {
    version: VERSION,
    weights: WEIGHTS,
    baseMax: BASE_MAX,
    legacyLongevityMax: LEGACY_LONGEVITY_MAX,
    penaltyMode: PENALTY_MODE,
    primeWindowsLoader: true,
    formula: 'championship/30*35 + opponentQuality/30*27.5 + primeDominance/30*27.5 + longevity/30*10 + penalty',
    appliedAt: new Date().toISOString()
  };

  if(typeof refresh === 'function'){
    try { refresh(); } catch(e) {}
  }
})();
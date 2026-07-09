// Overall score weighting layer.
// Applies Cody-approved GOAT weights. Main categories are all treated as 30-point category scores.
(function(){
  const VERSION = 'score-weighting-20260709a-apex-bonus-modifier';
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
  const MODIFIER_MODE = 'Apex Peak is a positive bonus modifier after the 100-point positive category score. Loss Context remains a separate negative modifier after the same base score.';

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
    const modifierScore = apexPeak + penalty;
    const totalScore = positiveScore + modifierScore;
    return {
      championship: round2(championship),
      opponentQuality: round2(opponentQuality),
      primeDominance: round2(primeDominance),
      longevity: round2(longevity),
      apexPeak: round2(apexPeak),
      apexPeakBonus: round2(apexPeak),
      positiveScore: round2(positiveScore),
      penalty: round2(penalty),
      modifierScore: round2(modifierScore),
      totalScore: round2(totalScore)
    };
  }
  function patchRow(row){
    if(!row) return;
    const breakdown = scoreBreakdown(row);
    row.totalScore = breakdown.totalScore;
    row.weightedScoreBreakdown = breakdown;
    row.scoreWeightingVersion = VERSION;
    row.apexPeakBonusLive = true;
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
    profile.apexPeakBonusLive = true;
  });

  if(DATA.meta){
    DATA.meta.scoringWeights = { version: VERSION, weights: WEIGHTS, baseMax: BASE_MAX, legacyLongevityMax: LEGACY_LONGEVITY_MAX, modifierMode: MODIFIER_MODE };
  }

  if(typeof DISPLAY_OVERRIDES !== 'undefined'){
    rankByFighter.forEach((rank,fighter) => {
      if(!DISPLAY_OVERRIDES[fighter]) return;
      DISPLAY_OVERRIDES[fighter].allTimeRank = rank;
      if(Object.prototype.hasOwnProperty.call(DISPLAY_OVERRIDES[fighter], 'overallOvr')) delete DISPLAY_OVERRIDES[fighter].overallOvr;
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
          <tr><td><strong>Apex Peak</strong></td><td>Positive bonus modifier after the 100-point base.</td></tr>
          <tr><td><strong>Loss Context</strong></td><td>Negative modifier after the 100-point base.</td></tr>
        </tbody></table><p class="meta">Each main category is treated as a 30-point score, then multiplied by its category weight. Apex Peak adds bonus points after the 100-point base. Loss Context subtracts points after the same base.</p></div>
      `);
    };
  }

  function loadScriptOnce(src,attr,done){
    if(document.querySelector(`script[${attr}]`)){ if(done)done(); return; }
    const script=document.createElement('script');
    script.src=src;
    script.setAttribute(attr,'true');
    script.onload=()=>{ if(done)done(); };
    document.body.appendChild(script);
  }
  function loadPrimeDominanceShadow(){
    loadScriptOnce('assets/data/prime-dominance-ledgers.js?v=prime-dominance-ledgers-20260708b-data-restart','data-prime-dominance-ledgers',()=>{
      if(window.UFC_PRIME_DOMINANCE_LEDGERS?.apply) window.UFC_PRIME_DOMINANCE_LEDGERS.apply();
    });
  }
  function loadPrimeWindows(){
    loadScriptOnce('assets/data/prime-windows.js?v=prime-windows-20260708a','data-prime-windows',()=>{
      if(window.UFC_PRIME_WINDOWS?.apply) window.UFC_PRIME_WINDOWS.apply();
      loadPrimeDominanceShadow();
    });
  }

  installRulesWeightNote();
  loadPrimeWindows();

  window.UFC_SCORE_WEIGHTING = {
    version: VERSION,
    weights: WEIGHTS,
    baseMax: BASE_MAX,
    legacyLongevityMax: LEGACY_LONGEVITY_MAX,
    modifierMode: MODIFIER_MODE,
    primeWindowsLoader: true,
    primeDominanceShadowLoader: true,
    apexPeakBonusLive: true,
    formula: 'championship/30*35 + opponentQuality/30*27.5 + primeDominance/30*27.5 + longevity/30*10 + apexPeak + penalty',
    appliedAt: new Date().toISOString()
  };

  if(typeof refresh === 'function'){
    try { refresh(); } catch(e) {}
  }
})();

// Forces visible OVR/category values to derive from current scores, not stale display overrides.
(function(){
  const VERSION = 'score-derived-ovr-20260703a';
  const DATA = window.RANKING_DATA;
  if(!DATA) return;

  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
  function boardFor(f){ return f?.leaderboard === 'women' ? (DATA.women || []) : (DATA.men || []); }
  function valueFor(f,key){
    const v = Number(f?.[key] ?? 0);
    return Number.isFinite(v) ? v : 0;
  }
  function categoryRankFromScore(f,key){
    const board = boardFor(f);
    const val = valueFor(f,key);
    return 1 + board.filter(x => valueFor(x,key) > val).length;
  }
  function categoryOvrFromScore(f,key){
    const board = boardFor(f).filter(x => Number.isFinite(Number(x?.[key])));
    if(!board.length) return 55;
    const val = valueFor(f,key);
    const values = board.map(x => valueFor(x,key));
    const max = Math.max(...values);
    const min = Math.min(...values);
    if(max === min) return 99;

    // Penalty is subtractive. Zero is best, deeper negative is worse.
    if(key === 'penalty'){
      return clamp(Math.round(55 + ((val - min) / (max - min)) * 44), 55, 99);
    }

    return clamp(Math.round(55 + (val / Math.max(max,1)) * 44), 55, 99);
  }
  function overallOvrFromScore(f){
    const rows = (DATA.men || []).concat(DATA.women || []);
    const max = Math.max(...rows.map(x => Number(x.totalScore || 0)), 1);
    return clamp(Math.round(75 + (Number(f?.totalScore || 0) / max) * 24), 60, 99);
  }

  window.overallOvr = overallOvrFromScore;
  window.categoryRank = categoryRankFromScore;
  window.categoryOvr = categoryOvrFromScore;
  window.UFC_SCORE_DERIVED_OVR = {
    version: VERSION,
    mode: 'score-derived',
    ignoresDisplayOverrideOvr: true,
    overall: '75 + totalScore/currentMaxTotalScore * 24, clamped 60-99',
    categories: '55 + categoryScore/currentCategoryMax * 44, clamped 55-99; penalty uses min/max because 0 is best',
    appliedAt: new Date().toISOString()
  };

  if(typeof refresh === 'function'){
    try { refresh(); } catch(e) {}
  }
})();
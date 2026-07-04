// Forces visible OVR/category values to derive from current scores, not stale display overrides.
(function(){
  const VERSION = 'score-derived-ovr-20260703b';
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
    if(board.length <= 1) return 99;
    const rank = categoryRankFromScore(f,key);

    // Category cards are rank ratings derived from category scores:
    // score determines rank, rank determines visible category rating.
    // This keeps a #3 category fighter looking elite instead of merely "great"
    // when the category benchmark is unusually high.
    return clamp(Math.round(99 - ((rank - 1) / (board.length - 1)) * 44), 55, 99);
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
    mode: 'score-derived-rank-rated-categories',
    ignoresDisplayOverrideOvr: true,
    overall: '75 + totalScore/currentMaxTotalScore * 24, clamped 60-99',
    categories: 'category score determines category rank; category rank determines visible category rating from 99 down to 55',
    appliedAt: new Date().toISOString()
  };

  if(typeof refresh === 'function'){
    try { refresh(); } catch(e) {}
  }
})();
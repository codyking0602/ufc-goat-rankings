// Forces visible OVR/category values to derive from current scores, not stale display overrides.
(function(){
  const VERSION = 'score-derived-ovr-20260703c';
  const DATA = window.RANKING_DATA;
  if(!DATA) return;

  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
  function boardFor(f){ return f?.leaderboard === 'women' ? (DATA.women || []) : (DATA.men || []); }
  function valueFor(f,key){
    const v = Number(f?.[key] ?? 0);
    return Number.isFinite(v) ? v : 0;
  }
  function rankFromScore(f,key){
    const board = boardFor(f);
    const val = valueFor(f,key);
    return 1 + board.filter(x => valueFor(x,key) > val).length;
  }
  function ratingFromRank(rank, boardLength){
    if(!rank) return 55;
    if(boardLength <= 1) return 99;
    return clamp(Math.round(99 - ((rank - 1) / (boardLength - 1)) * 44), 55, 99);
  }
  function categoryRankFromScore(f,key){
    return rankFromScore(f,key);
  }
  function categoryOvrFromScore(f,key){
    const board = boardFor(f).filter(x => Number.isFinite(Number(x?.[key])));
    return ratingFromRank(categoryRankFromScore(f,key), board.length);
  }
  function overallRankFromScore(f){
    return rankFromScore(f,'totalScore');
  }
  function overallOvrFromScore(f){
    const board = boardFor(f).filter(x => Number.isFinite(Number(x?.totalScore)));

    // Overall OVR is now rank-rated from raw total score:
    // raw total score determines rank, rank determines visible OVR.
    // This keeps the main leaderboard feeling like a UFC/2K rating product
    // while preserving raw score as the actual ranking source of truth.
    return ratingFromRank(overallRankFromScore(f), board.length);
  }

  window.overallOvr = overallOvrFromScore;
  window.categoryRank = categoryRankFromScore;
  window.categoryOvr = categoryOvrFromScore;
  window.UFC_SCORE_DERIVED_OVR = {
    version: VERSION,
    mode: 'score-derived-rank-rated-overall-and-categories',
    ignoresDisplayOverrideOvr: true,
    overall: 'totalScore determines overall rank; overall rank determines visible OVR from 99 down to 55',
    categories: 'category score determines category rank; category rank determines visible category rating from 99 down to 55',
    appliedAt: new Date().toISOString()
  };

  if(typeof refresh === 'function'){
    try { refresh(); } catch(e) {}
  }
})();
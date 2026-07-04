// Forces visible OVR/category values to derive from current scores, not stale display overrides.
(function(){
  const VERSION = 'score-derived-ovr-20260703d';
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
    if(!rank) return 75;
    if(boardLength <= 1) return 99;

    // This is a UFC GOAT board, not a full video-game roster.
    // Keep the rating scale compressed so lower-ranked legends do not fall into 50s/60s.
    // Raw score still determines rank. Rank determines the polished visible rating.
    const floor = 75;
    const ceiling = 99;
    const progress = 1 - ((rank - 1) / Math.max(boardLength - 1, 1));
    const curve = boardLength <= 5 ? 0.65 : 2;
    return clamp(Math.round(floor + Math.pow(Math.max(progress, 0), curve) * (ceiling - floor)), floor, ceiling);
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
    return ratingFromRank(overallRankFromScore(f), board.length);
  }

  window.overallOvr = overallOvrFromScore;
  window.categoryRank = categoryRankFromScore;
  window.categoryOvr = categoryOvrFromScore;
  window.UFC_SCORE_DERIVED_OVR = {
    version: VERSION,
    mode: 'score-derived-compressed-rank-ratings',
    ignoresDisplayOverrideOvr: true,
    overall: 'totalScore determines overall rank; overall rank determines visible OVR on compressed 75-99 GOAT scale',
    categories: 'category score determines category rank; category rank determines visible category rating on compressed 75-99 GOAT scale',
    appliedAt: new Date().toISOString()
  };

  if(typeof refresh === 'function'){
    try { refresh(); } catch(e) {}
  }
})();
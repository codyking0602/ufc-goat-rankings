// Forces visible OVR/category values to derive from current scores, not stale display overrides.
(function(){
  const VERSION = 'score-derived-ovr-20260707c-82-99-score-scale';
  const DATA = window.RANKING_DATA;
  if(!DATA) return;

  const OVERALL_FLOOR = 82;
  const OVERALL_CEILING = 99;
  const CATEGORY_FLOOR = 75;
  const CATEGORY_CEILING = 99;

  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
  function isWomenFighter(f){
    const name = f?.fighter;
    return f?.leaderboard === 'women' || (name && (DATA.women || []).some(x => x.fighter === name));
  }
  function boardFor(f){ return isWomenFighter(f) ? (DATA.women || []) : (DATA.men || []); }
  function valueFor(f,key){
    const v = Number(f?.[key] ?? 0);
    return Number.isFinite(v) ? v : 0;
  }
  function finiteRows(board,key){
    return (board || []).filter(x => Number.isFinite(Number(x?.[key])));
  }
  function stripOverallOverrides(){
    if(typeof DISPLAY_OVERRIDES === 'undefined') return 0;
    let stripped = 0;
    Object.values(DISPLAY_OVERRIDES).forEach(override => {
      if(override && Object.prototype.hasOwnProperty.call(override, 'overallOvr')){
        delete override.overallOvr;
        stripped += 1;
      }
    });
    return stripped;
  }
  function rankFromScore(f,key){
    const board = boardFor(f);
    const val = valueFor(f,key);
    return 1 + board.filter(x => valueFor(x,key) > val).length;
  }
  function ratingFromRank(rank, boardLength){
    if(!rank) return CATEGORY_FLOOR;
    if(boardLength <= 1) return CATEGORY_CEILING;

    // Category cards stay compressed because they read as percentile-style category standing.
    const progress = 1 - ((rank - 1) / Math.max(boardLength - 1, 1));
    const curve = boardLength <= 5 ? 0.65 : 2;
    return clamp(Math.round(CATEGORY_FLOOR + Math.pow(Math.max(progress, 0), curve) * (CATEGORY_CEILING - CATEGORY_FLOOR)), CATEGORY_FLOOR, CATEGORY_CEILING);
  }
  function ratingFromScore(score, board, key){
    const values = finiteRows(board, key).map(x => valueFor(x, key));
    if(!values.length) return OVERALL_FLOOR;

    const min = Math.min(...values);
    const max = Math.max(...values);
    if(max === min) return OVERALL_CEILING;

    const normalized = (Number(score || 0) - min) / (max - min);
    return clamp(Math.round(OVERALL_FLOOR + normalized * (OVERALL_CEILING - OVERALL_FLOOR)), OVERALL_FLOOR, OVERALL_CEILING);
  }
  function categoryRankFromScore(f,key){
    return rankFromScore(f,key);
  }
  function categoryOvrFromScore(f,key){
    const board = finiteRows(boardFor(f), key);
    return ratingFromRank(categoryRankFromScore(f,key), board.length);
  }
  function overallRankFromScore(f){
    return rankFromScore(f,'totalScore');
  }
  function overallOvrFromScore(f){
    return ratingFromScore(valueFor(f,'totalScore'), boardFor(f), 'totalScore');
  }

  const strippedOverallOverrides = stripOverallOverrides();
  window.overallOvr = overallOvrFromScore;
  window.categoryRank = categoryRankFromScore;
  window.categoryOvr = categoryOvrFromScore;
  window.UFC_SCORE_DERIVED_OVR = {
    version: VERSION,
    mode: 'score-derived-raw-score-overall-scale',
    ignoresDisplayOverrideOvr: true,
    strippedOverallOverrides,
    overall: 'visible OVR is scaled from raw totalScore inside the active leaderboard: highest score = 99, lowest score = 82',
    categories: 'category score determines category rank; category rank determines visible category rating on compressed 75-99 category scale',
    floor: OVERALL_FLOOR,
    ceiling: OVERALL_CEILING,
    appliedAt: new Date().toISOString()
  };

  if(typeof refresh === 'function'){
    try { refresh(); } catch(e) {}
  }
})();
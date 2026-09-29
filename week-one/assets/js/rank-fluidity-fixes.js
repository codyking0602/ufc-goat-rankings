// Runtime rank fluidity fixes.
// Keeps visible ranks tied to current sorted scores instead of packet hardcodes.
(function(){
  const VERSION = 'rank-fluidity-fixes-20260706b';
  const CATEGORY_KEYS = ['championship','opponentQuality','primeDominance','longevity','penalty','apexPeak'];

  function data(){ return window.RANKING_DATA || {}; }
  function profileFor(row){ return (data().fighters || []).find(x => x?.fighter === row?.fighter) || {}; }
  function dynamicFullRow(row){ return row ? { ...profileFor(row), ...row } : {}; }
  function full(row){ return dynamicFullRow(row); }
  function boardNameFor(f){ return f?.leaderboard === 'women' ? 'women' : 'men'; }
  function numeric(v){ const n = Number(v || 0); return Number.isFinite(n) ? n : 0; }
  function sortedBoard(boardName){
    return [...(data()[boardName] || [])]
      .map(full)
      .sort((a,b) => numeric(b.totalScore) - numeric(a.totalScore) || String(a.fighter || '').localeCompare(String(b.fighter || '')));
  }
  function boardRank(f){
    const boardName = boardNameFor(f);
    const rows = sortedBoard(boardName);
    const index = rows.findIndex(x => x.fighter === f?.fighter);
    return index >= 0 ? index + 1 : null;
  }
  function categoryValue(f,key){
    const n = Number(f?.[key] ?? 0);
    return Number.isFinite(n) ? n : 0;
  }
  function categoryRankDynamic(f,key){
    const rows = sortedBoard(boardNameFor(f));
    const val = categoryValue(f,key);
    return 1 + rows.filter(x => categoryValue(x,key) > val).length;
  }
  function rankLabelFor(boardName, rank){
    if(!rank) return '—';
    return `${boardName === 'women' ? 'Women' : 'Men'} #${rank}`;
  }
  function cleanRankCopy(text){
    if(typeof text !== 'string') return text;
    return text
      .replace(/\branks women’s #\d+ because/gi, 'belongs in this women’s tier because')
      .replace(/\branks women's #\d+ because/gi, 'belongs in this women’s tier because')
      .replace(/\branks men’s #\d+ because/gi, 'belongs in this men’s tier because')
      .replace(/\branks men's #\d+ because/gi, 'belongs in this men’s tier because')
      .replace(/\branks #\d+ because/gi, 'lands here because')
      .replace(/clearly women’s top-three in this ranking/gi, 'a major women’s GOAT candidate in this ranking')
      .replace(/clearly women's top-three in this ranking/gi, 'a major women’s GOAT candidate in this ranking')
      .replace(/women’s top-three/gi, 'women’s elite tier')
      .replace(/women's top-three/gi, 'women’s elite tier');
  }
  function neutralizeRankSpecificCopy(){
    if(typeof DISPLAY_OVERRIDES === 'undefined') return [];
    const touched = [];
    Object.entries(DISPLAY_OVERRIDES).forEach(([fighter, override]) => {
      if(!override) return;
      ['oneLiner','whyRankedHere','whyNotHigher','whyNotLower','finalTakeaway'].forEach(key => {
        const cleaned = cleanRankCopy(override[key]);
        if(cleaned !== override[key]){ override[key] = cleaned; touched.push(`${fighter}.${key}`); }
      });
    });
    return touched;
  }
  function applyDynamicRanks(){
    const d = data();
    if(!d.men || !d.women) return null;
    const boards = ['men','women'];
    const applied = [];
    boards.forEach(boardName => {
      const rows = sortedBoard(boardName);
      rows.forEach((row,index) => {
        const rank = index + 1;
        const boardRow = (d[boardName] || []).find(x => x?.fighter === row.fighter);
        const profile = (d.fighters || []).find(x => x?.fighter === row.fighter);
        if(boardRow) boardRow.rank = rank;
        if(profile) profile.rank = rank;
        if(typeof DISPLAY_OVERRIDES !== 'undefined'){
          DISPLAY_OVERRIDES[row.fighter] = DISPLAY_OVERRIDES[row.fighter] || {};
          DISPLAY_OVERRIDES[row.fighter].allTimeRank = rank;
          DISPLAY_OVERRIDES[row.fighter].rankLabel = rankLabelFor(boardName, rank);
          DISPLAY_OVERRIDES[row.fighter].categories = DISPLAY_OVERRIDES[row.fighter].categories || {};
          CATEGORY_KEYS.forEach(key => {
            DISPLAY_OVERRIDES[row.fighter].categories[key] = DISPLAY_OVERRIDES[row.fighter].categories[key] || {};
            DISPLAY_OVERRIDES[row.fighter].categories[key].rank = categoryRankDynamic(row,key);
          });
        }
        applied.push({fighter: row.fighter, board: boardName, rank});
      });
      if(Array.isArray(d[boardName])) d[boardName].sort((a,b) => numeric(b.totalScore) - numeric(a.totalScore) || String(a.fighter || '').localeCompare(String(b.fighter || '')));
    });
    const copyFixes = neutralizeRankSpecificCopy();
    window.UFC_RANK_FLUIDITY = { version: VERSION, applied, copyFixes, appliedAt: new Date().toISOString() };
    return window.UFC_RANK_FLUIDITY;
  }

  // Patch the stale app-level fullRow helper so packet-added profiles merge live profile details.
  window.fullRow = dynamicFullRow;

  const originalRefresh = window.refresh;
  if(typeof originalRefresh === 'function' && !originalRefresh.__ufcRankFluidityWrapped){
    const wrapped = function(){
      applyDynamicRanks();
      const result = originalRefresh.apply(this, arguments);
      applyDynamicRanks();
      return result;
    };
    wrapped.__ufcRankFluidityWrapped = true;
    window.refresh = wrapped;
  }

  window.UFC_DYNAMIC_RANKS = { version: VERSION, apply: applyDynamicRanks, boardRank, categoryRank: categoryRankDynamic, fullRow: dynamicFullRow };
  applyDynamicRanks();
  if(typeof window.refresh === 'function') window.refresh();
})();
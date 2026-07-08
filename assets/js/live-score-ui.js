// Live-score UI helpers for dynamic category ranks and category board.
(function(){
  if(!window.RANKING_DATA) return;

  function num(v){ const n = Number(v); return Number.isFinite(n) ? n : 0; }

  if(typeof overallOvr === 'function'){
    overallOvr = function(f){
      const o = DISPLAY_OVERRIDES[f.fighter];
      if(o?.overallOvr) return o.overallOvr;
      const max = Math.max(...DATA.men.concat(DATA.women).map(x => x.totalScore || 0), 1);
      return clamp(Math.round(75 + ((f.totalScore || 0) / max) * 24), 60, 99);
    };
  }

  if(typeof categoryValueForRank === 'function'){
    categoryValueForRank = function(f, key){
      const v = num(f?.[key]);
      return Number.isFinite(v) ? v : 0;
    };
  }

  if(typeof categoryRank === 'function'){
    categoryRank = function(f, key){
      const board = (f.leaderboard === 'women' ? DATA.women : DATA.men).map(fullRow);
      const val = categoryValueForRank(f, key);
      return 1 + board.filter(x => categoryValueForRank(x, key) > val).length;
    };
  }

  if(typeof categoryOvr === 'function'){
    categoryOvr = function(f, key){
      const board = f.leaderboard === 'women' ? DATA.women : DATA.men;
      const rank = categoryRank(f, key);
      if(!rank) return 55;
      if(board.length <= 1) return 99;
      return clamp(Math.round(99 - ((rank - 1) / (board.length - 1)) * 44), 55, 99);
    };
  }

  if(typeof resumeTagFor === 'function'){
    resumeTagFor = function(f){
      const override = DISPLAY_OVERRIDES[f.fighter] || {};
      if(override.resumeTag) return override.resumeTag;
      const rank = Number(f.rank || 999);
      if(rank <= 5) return 'Legendary UFC resume';
      if(rank <= 15) return 'Elite UFC resume';
      if(rank <= 30) return 'Great UFC resume';
      return 'UFC resume';
    };
  }

  function categoryOptions(){
    return (CATEGORY_INFO || []).filter(([key]) => key !== 'penalty');
  }

  function selectedCategory(){
    const select = document.getElementById('categoryBoardSelect');
    return select?.value || 'primeDominance';
  }

  function categoryRows(rows, key){
    return rows.map(fullRow).sort((a,b) => categoryValueForRank(b, key) - categoryValueForRank(a, key) || num(b.totalScore) - num(a.totalScore));
  }

  function categoryBoard(title, rows, key){
    const info = (CATEGORY_INFO || []).find(([k]) => k === key) || [key, key, ''];
    const label = info[1];
    const ranked = categoryRows(rows, key);
    return `<div class="card"><h3>${title} · ${label}</h3><table class="table"><thead><tr><th>Rank</th><th>Fighter</th><th>Raw</th><th>PCTL</th><th>GOAT Score</th></tr></thead><tbody>${ranked.map((r,i) => `<tr class="category-board-row" data-fighter="${r.fighter}"><td>#${i+1}</td><td>${r.fighter}</td><td>${Number(categoryValueForRank(r,key)).toFixed(2)}</td><td>${categoryOvr(r,key)}</td><td>${Number(r.totalScore || 0).toFixed(2)}</td></tr>`).join('')}</tbody></table></div>`;
  }

  window.renderCategories = function renderCategories(){
    const target = document.getElementById('categoryBoardList');
    const select = document.getElementById('categoryBoardSelect');
    if(!target || !select) return;
    const key = selectedCategory();
    const info = (CATEGORY_INFO || []).find(([k]) => k === key) || [key, key, ''];
    target.innerHTML = `<div class="notice">Sorted by ${info[1]}. Raw score is the actual category input; PCTL is the app-facing category rating.</div>${categoryBoard('Men', DATA.men || [], key)}${categoryBoard('Women', DATA.women || [], key)}`;
    target.querySelectorAll('[data-fighter]').forEach(row => row.addEventListener('click', () => openFighter(row.dataset.fighter)));
  };

  function initCategoryBoard(){
    const select = document.getElementById('categoryBoardSelect');
    if(!select || select.dataset.ready === 'true') return;
    categoryOptions().forEach(([key,label]) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = label;
      select.appendChild(option);
    });
    select.value = 'primeDominance';
    select.dataset.ready = 'true';
    select.addEventListener('change', window.renderCategories);
  }

  if(typeof refresh === 'function'){
    const oldRefresh = refresh;
    refresh = function(){
      oldRefresh();
      initCategoryBoard();
      window.renderCategories();
    };
  }

  initCategoryBoard();
  window.renderCategories();
})();

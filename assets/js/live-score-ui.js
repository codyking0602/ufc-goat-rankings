// Live-score UI helpers for dynamic category ranks, Peak Apex, and category board.
(function(){
  if(!window.RANKING_DATA) return;

  function num(v){ const n = Number(v); return Number.isFinite(n) ? n : 0; }
  function cleanKey(name){ return String(name || '').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' '); }
  function isWomenRow(f){ return f?.leaderboard === 'women' || (DATA.women || []).some(row => cleanKey(row.fighter) === cleanKey(f?.fighter)); }
  function boardFor(f){ return isWomenRow(f) ? (DATA.women || []) : (DATA.men || []); }
  function apexAuditFor(f){ return f?.apexPeakAudit || DISPLAY_OVERRIDES?.[f?.fighter]?.apexPeakAudit || null; }
  function apexValue(f){ return num(f?.apexPeak ?? f?.apexPeakBonus ?? apexAuditFor(f)?.score); }
  function apexWinsText(f){
    const audit = apexAuditFor(f);
    const wins = (audit?.performances || []).map(p => `${p.label}${p.date ? ' ' + String(p.date).slice(0,4) : ''}`);
    return wins.length ? wins.join(' + ') : (audit?.window || 'Peak wins still being loaded');
  }
  function apexWhatItProved(f){
    const audit = apexAuditFor(f);
    return audit?.front?.proved || audit?.notes || 'This was the clearest two-win snapshot of the fighter at their highest UFC level.';
  }
  function apexHowItFelt(f){
    const audit = apexAuditFor(f);
    if(audit?.front?.felt) return audit.front.felt;
    const aura = num(audit?.components?.aura);
    const claim = num(audit?.components?.bestFighterClaim);
    if(aura >= .95) return 'Felt scary, iconic, and almost impossible to solve.';
    if(claim >= 1.1) return 'Felt like a real best-in-the-world peak, even if not fully mythic.';
    if(aura >= .65) return 'Felt dangerous, memorable, and clearly title-level.';
    return 'Felt like a strong peak, but not one of the cleanest aura runs.';
  }
  function ensurePeakApexCategory(){
    if(typeof CATEGORY_INFO === 'undefined' || !Array.isArray(CATEGORY_INFO)) return;
    const entry = ['apexPeak', 'Peak Apex', "The best two-win stretch of his UFC career—capturing performance, proof, and peak greatness"];
    const existing = CATEGORY_INFO.find(item => item[0] === 'apexPeak');
    if(existing){ existing[1] = entry[1]; existing[2] = entry[2]; return; }
    const penaltyIndex = CATEGORY_INFO.findIndex(item => item[0] === 'penalty');
    if(penaltyIndex >= 0) CATEGORY_INFO.splice(penaltyIndex, 0, entry);
    else CATEGORY_INFO.push(entry);
  }

  ensurePeakApexCategory();

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
      if(key === 'apexPeak') return apexValue(f);
      const v = num(f?.[key]);
      return Number.isFinite(v) ? v : 0;
    };
  }

  if(typeof categoryRank === 'function'){
    categoryRank = function(f, key){
      const board = boardFor(f).map(fullRow);
      const val = categoryValueForRank(f, key);
      return 1 + board.filter(x => categoryValueForRank(x, key) > val).length;
    };
  }

  if(typeof categoryOvr === 'function'){
    categoryOvr = function(f, key){
      const board = boardFor(f);
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

  const baseCategoryLogicSentence = typeof categoryLogicSentence === 'function' ? categoryLogicSentence : null;
  if(baseCategoryLogicSentence){
    categoryLogicSentence = function(f, key){
      if(key === 'apexPeak') return 'Peak Apex measures the highest two-win stretch of a fighter’s UFC career. It rewards the best version we ever saw: the performances, what those wins proved, whether they created a best-in-the-world claim, and how unbeatable the fighter felt.';
      return baseCategoryLogicSentence(f, key);
    };
  }

  const baseCategoryEvidenceItems = typeof categoryEvidenceItems === 'function' ? categoryEvidenceItems : null;
  if(baseCategoryEvidenceItems){
    categoryEvidenceItems = function(f, key){
      if(key === 'apexPeak'){
        return [
          ['Apex wins', apexWinsText(f)],
          ['What it proved', apexWhatItProved(f)],
          ['How it felt', apexHowItFelt(f)]
        ];
      }
      return baseCategoryEvidenceItems(f, key);
    };
  }

  function categoryOptions(){ return (CATEGORY_INFO || []); }
  function selectedCategory(){ return document.getElementById('categoryBoardSelect')?.value || 'apexPeak'; }
  function categoryRows(rows, key){
    return rows.map(fullRow).sort((a,b) => categoryValueForRank(b, key) - categoryValueForRank(a, key) || num(b.totalScore) - num(a.totalScore));
  }
  function categoryBoard(title, rows, key){
    const info = (CATEGORY_INFO || []).find(([k]) => k === key) || [key, key, ''];
    const label = info[1];
    const ranked = categoryRows(rows, key);
    if(key === 'apexPeak'){
      return `<div class="card"><h3>${label} · ${title}</h3><p class="meta">Best two-win UFC stretch. Peak form, proof, and aura.</p><div class="leaderboard">${ranked.map((r,i) => `<article class="row fighter-row category-board-card" data-fighter="${r.fighter}"><div class="rank">#${i+1}</div>${rowPhoto(r)}<div class="row-main"><div class="name">${r.fighter}</div><div class="meta">Overall #${r.rank || '—'} · ${r.ufcRecord || ''} · ${r.primaryDivision || ''}${r.secondaryDivision ? ' / ' + r.secondaryDivision : ''}</div><div class="resume-tag">${apexWinsText(r)}</div></div><div class="score"><strong>${categoryOvr(r, key)}</strong><span class="meta">PCTL</span></div></article>`).join('')}</div></div>`;
    }
    return `<div class="card"><h3>${title} · ${label}</h3><table class="table"><thead><tr><th>Rank</th><th>Fighter</th><th>Raw</th><th>PCTL</th><th>GOAT Score</th></tr></thead><tbody>${ranked.map((r,i) => `<tr class="category-board-row" data-fighter="${r.fighter}"><td>#${i+1}</td><td>${r.fighter}</td><td>${Number(categoryValueForRank(r,key)).toFixed(2)}</td><td>${categoryOvr(r,key)}</td><td>${Number(r.totalScore || 0).toFixed(2)}</td></tr>`).join('')}</tbody></table></div>`;
  }

  window.renderCategories = function renderCategories(){
    ensurePeakApexCategory();
    const target = document.getElementById('categoryBoardList');
    const select = document.getElementById('categoryBoardSelect');
    if(!target || !select) return;
    const key = selectedCategory();
    const info = (CATEGORY_INFO || []).find(([k]) => k === key) || [key, key, ''];
    const intro = key === 'apexPeak'
      ? 'Peak Apex ranks the greatest two-win UFC peaks. Each card shows the selected apex run.'
      : `Sorted by ${info[1]}. Raw score is the actual category input; PCTL is the app-facing category rating.`;
    target.innerHTML = `<div class="notice">${intro}</div>${categoryBoard('Men', DATA.men || [], key)}${categoryBoard('Women', DATA.women || [], key)}`;
    target.querySelectorAll('[data-fighter]').forEach(row => row.addEventListener('click', () => openFighter(row.dataset.fighter)));
  };

  function initCategoryBoard(){
    const select = document.getElementById('categoryBoardSelect');
    if(!select) return;
    if(select.dataset.ready !== 'true'){
      select.innerHTML = '';
      categoryOptions().forEach(([key,label]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = label;
        select.appendChild(option);
      });
      select.dataset.ready = 'true';
      select.addEventListener('change', window.renderCategories);
    }
    if(!select.value) select.value = 'apexPeak';
  }

  if(typeof openFighter === 'function'){
    const baseOpenFighter = openFighter;
    openFighter = function(name){
      baseOpenFighter(name);
      const f = fullRow((DATA.men.find(x=>x.fighter===name) || DATA.women.find(x=>x.fighter===name) || {fighter:name}));
      if(document.getElementById('peakApexProfileCard')) return;
      const firstCard = document.querySelector('#fighterDetail .card');
      if(!firstCard) return;
      const card = document.createElement('div');
      card.className = 'card';
      card.id = 'peakApexProfileCard';
      card.innerHTML = `<h3>Peak Apex</h3><p><strong>What it means:</strong> Peak Apex measures the highest two-win stretch of a fighter’s UFC career. It rewards the best version we ever saw: the performances, what those wins proved, whether they created a best-in-the-world claim, and how unbeatable the fighter felt.</p>${snapshotGrid([
        ['Apex wins', apexWinsText(f)],
        ['What it proved', apexWhatItProved(f)],
        ['How it felt', apexHowItFelt(f)]
      ])}`;
      firstCard.parentNode.insertBefore(card, firstCard);
    };
  }

  if(typeof renderRules === 'function'){
    const baseRenderRules = renderRules;
    renderRules = function(){
      baseRenderRules();
      const table = document.querySelector('#rulesContent .card table tbody');
      if(table && !table.querySelector('[data-peak-apex-rule]')){
        table.insertAdjacentHTML('beforeend', '<tr data-peak-apex-rule="true"><td><strong>Peak Apex</strong></td><td>Best two-win UFC stretch. This is a positive bonus after the 100-point base, not a normal base-score category.</td></tr>');
      }
    };
  }

  if(typeof refresh === 'function'){
    const oldRefresh = refresh;
    refresh = function(){
      ensurePeakApexCategory();
      oldRefresh();
      initCategoryBoard();
      window.renderCategories();
    };
  }

  initCategoryBoard();
  window.renderCategories();
  document.documentElement.setAttribute('data-peak-apex-ui','20260709a');
})();
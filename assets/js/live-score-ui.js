// Live-score UI helpers for dynamic category ranks, Apex Peak, and live six-category scoring.
(function(){
  if(!window.RANKING_DATA) return;
  const DATA = window.RANKING_DATA;

  function num(v){ const n = Number(v); return Number.isFinite(n) ? n : 0; }
  function round2(v){ return Math.round((num(v) + Number.EPSILON) * 100) / 100; }
  function cleanKey(name){ return String(name || '').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' '); }
  function isWomenRow(f){ return f?.leaderboard === 'women' || (DATA.women || []).some(row => cleanKey(row.fighter) === cleanKey(f?.fighter)); }
  function boardFor(f){ return isWomenRow(f) ? (DATA.women || []) : (DATA.men || []); }
  function apexAuditFor(f){ return f?.apexPeakAudit || DISPLAY_OVERRIDES?.[f?.fighter]?.apexPeakAudit || null; }
  function apexValue(f){ return num(f?.apexPeak ?? f?.apexPeakBonus ?? apexAuditFor(f)?.score); }
  function baseScore(f){
    return round2(
      (num(f?.championship) / 30) * 35 +
      (num(f?.opponentQuality) / 30) * 27.5 +
      (num(f?.primeDominance) / 30) * 27.5 +
      (num(f?.longevity) / 30) * 10
    );
  }
  function liveTotal(f){ return round2(baseScore(f) + apexValue(f) + num(f?.penalty)); }
  function rerank(rows){
    rows.sort((a,b) => num(b.totalScore) - num(a.totalScore) || num(b.championship) - num(a.championship) || String(a.fighter).localeCompare(String(b.fighter)));
    rows.forEach((f,i) => { f.rank = i + 1; });
  }
  function applySixCategoryScoring(){
    const rows = [...(DATA.men || []), ...(DATA.women || []), ...(DATA.fighters || [])];
    rows.forEach(f => {
      if(!f || !f.fighter) return;
      if(f.originalTotalScore === undefined) f.originalTotalScore = num(f.totalScore);
      f.baseScore = baseScore(f);
      f.apexPeak = apexValue(f);
      f.apexPeakBonus = apexValue(f);
      f.lossContext = num(f.penalty);
      f.rawScore = liveTotal(f);
      f.totalScore = f.rawScore;
      f.scoreFormula = 'championship/30*35 + opponentQuality/30*27.5 + primeDominance/30*27.5 + longevity/30*10 + apexPeak + penalty';
    });
    rerank(DATA.men || []);
    rerank(DATA.women || []);
    window.UFC_SIX_CATEGORY_SCORE_MODEL = {
      version: 'six-category-live-20260709b',
      weights: { championship: 35, opponentQuality: 27.5, primeDominance: 27.5, longevity: 10, apexPeak: 'bonus', penalty: 'deduction' },
      formula: 'Championship /30 × 35 + Quality Wins /30 × 27.5 + Prime Dominance /30 × 27.5 + Longevity /30 × 10 + Apex Peak + Loss Context',
      appliedAt: new Date().toISOString(),
      jonJones: (DATA.men || []).find(f => f.fighter === 'Jon Jones') || null
    };
  }
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
    const aura = num(audit?.components?.aura ?? audit?.components?.cleanApexAura);
    const claim = num(audit?.components?.bestFighterClaim ?? audit?.components?.peakStatus);
    if(aura >= .70) return 'Felt scary, iconic, and almost impossible to solve.';
    if(claim >= 1.10) return 'Felt like a real best-in-the-world peak, even if not fully mythic.';
    if(aura >= .45) return 'Felt dangerous, memorable, and clearly title-level.';
    return 'Felt like a strong peak, but not one of the cleanest aura runs.';
  }
  function ensureApexCategory(){
    if(typeof CATEGORY_INFO === 'undefined' || !Array.isArray(CATEGORY_INFO)) return;
    const entry = ['apexPeak', 'Apex Peak', 'Best peak bonus: the highest UFC version of the fighter, added after the 100-point base score'];
    const existing = CATEGORY_INFO.find(item => item[0] === 'apexPeak');
    if(existing){ existing[1] = entry[1]; existing[2] = entry[2]; return; }
    const penaltyIndex = CATEGORY_INFO.findIndex(item => item[0] === 'penalty');
    if(penaltyIndex >= 0) CATEGORY_INFO.splice(penaltyIndex, 0, entry);
    else CATEGORY_INFO.push(entry);
  }

  ensureApexCategory();
  applySixCategoryScoring();

  if(typeof overallOvr === 'function'){
    overallOvr = function(f){
      const o = DISPLAY_OVERRIDES[f.fighter];
      if(o?.overallOvr) return o.overallOvr;
      const allRows = (DATA.men || []).concat(DATA.women || []);
      const max = Math.max(...allRows.map(x => num(x.rawScore ?? x.totalScore)), 1);
      return clamp(Math.round(75 + (num(f.rawScore ?? f.totalScore) / max) * 24), 60, 99);
    };
  }

  if(typeof categoryValueForRank === 'function'){
    categoryValueForRank = function(f, key){
      if(key === 'apexPeak') return apexValue(f);
      return num(f?.[key]);
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
      const override = DISPLAY_OVERRIDES?.[f?.fighter]?.categories?.[key];
      if(override?.ovr) return override.ovr;
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

  if(typeof categoryChipGrid === 'function'){
    categoryChipGrid = function(f){
      return `<div class="category-chips">
        ${categoryChip(f, 'championship')}
        ${categoryChip(f, 'opponentQuality')}
        ${categoryChip(f, 'primeDominance')}
        ${categoryChip(f, 'longevity')}
        ${categoryChip(f, 'apexPeak')}
        ${categoryChip(f, 'penalty')}
      </div>`;
    };
  }

  const baseCategoryLogicSentence = typeof categoryLogicSentence === 'function' ? categoryLogicSentence : null;
  if(baseCategoryLogicSentence){
    categoryLogicSentence = function(f, key){
      if(key === 'apexPeak') return 'Apex Peak is a positive bonus added after the 100-point base. It captures the strongest UFC version of the fighter: the performances, proof, best-fighter claim, and aura at their absolute highest point.';
      return baseCategoryLogicSentence(f, key);
    };
  }

  const baseCategoryEvidenceItems = typeof categoryEvidenceItems === 'function' ? categoryEvidenceItems : null;
  if(baseCategoryEvidenceItems){
    categoryEvidenceItems = function(f, key){
      if(key === 'apexPeak'){
        return [
          ['Apex bonus', `+${Number(apexValue(f)).toFixed(2)}`],
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
    return rows.map(fullRow).sort((a,b) => categoryValueForRank(b, key) - categoryValueForRank(a, key) || num(b.rawScore ?? b.totalScore) - num(a.rawScore ?? a.totalScore));
  }
  function categoryBoard(title, rows, key){
    const info = (CATEGORY_INFO || []).find(([k]) => k === key) || [key, key, ''];
    const label = info[1];
    const ranked = categoryRows(rows, key);
    if(key === 'apexPeak'){
      return `<div class="card"><h3>${label} · ${title}</h3><p class="meta">Positive peak bonus added after the 100-point base.</p><div class="leaderboard">${ranked.map((r,i) => `<article class="row fighter-row category-board-card" data-fighter="${r.fighter}"><div class="rank">#${i+1}</div>${rowPhoto(r)}<div class="row-main"><div class="name">${r.fighter}</div><div class="meta">Overall #${r.rank || '—'} · Raw ${Number(r.rawScore ?? r.totalScore ?? 0).toFixed(2)} · Apex +${Number(apexValue(r)).toFixed(2)}</div><div class="resume-tag">${apexWinsText(r)}</div></div><div class="score"><strong>${categoryOvr(r, key)}</strong><span class="meta">PCTL</span></div></article>`).join('')}</div></div>`;
    }
    return `<div class="card"><h3>${title} · ${label}</h3><table class="table"><thead><tr><th>Rank</th><th>Fighter</th><th>Raw</th><th>PCTL</th><th>GOAT Score</th></tr></thead><tbody>${ranked.map((r,i) => `<tr class="category-board-row" data-fighter="${r.fighter}"><td>#${i+1}</td><td>${r.fighter}</td><td>${Number(categoryValueForRank(r,key)).toFixed(2)}</td><td>${categoryOvr(r,key)}</td><td>${Number(r.rawScore ?? r.totalScore ?? 0).toFixed(2)}</td></tr>`).join('')}</tbody></table></div>`;
  }

  window.renderCategories = function renderCategories(){
    ensureApexCategory();
    applySixCategoryScoring();
    const target = document.getElementById('categoryBoardList');
    const select = document.getElementById('categoryBoardSelect');
    if(!target || !select) return;
    const key = selectedCategory();
    const info = (CATEGORY_INFO || []).find(([k]) => k === key) || [key, key, ''];
    const intro = key === 'apexPeak'
      ? 'Apex Peak is now part of the live scoring model as a positive bonus after the base score.'
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
      applySixCategoryScoring();
      baseOpenFighter(name);
      const f = fullRow((DATA.men.find(x=>x.fighter===name) || DATA.women.find(x=>x.fighter===name) || {fighter:name}));
      if(document.getElementById('apexPeakProfileCard')) return;
      const firstCard = document.querySelector('#fighterDetail .card');
      if(!firstCard) return;
      const card = document.createElement('div');
      card.className = 'card';
      card.id = 'apexPeakProfileCard';
      card.innerHTML = `<h3>Apex Peak</h3><p><strong>What it means:</strong> Apex Peak is a positive bonus added after the base score. It rewards the best UFC version of the fighter.</p>${snapshotGrid([
        ['Apex bonus', '+' + Number(apexValue(f)).toFixed(2)],
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
      if(table && !table.querySelector('[data-apex-peak-rule]')){
        table.insertAdjacentHTML('beforeend', '<tr data-apex-peak-rule="true"><td><strong>Apex Peak</strong></td><td>Positive bonus after the 100-point base.</td></tr>');
      }
      if(table && !table.querySelector('[data-six-category-formula]')){
        table.insertAdjacentHTML('beforeend', '<tr data-six-category-formula="true"><td><strong>Overall Formula</strong></td><td>Championship /30 × 35 + Quality Wins /30 × 27.5 + Prime Dominance /30 × 27.5 + Longevity /30 × 10 + Apex Peak + Loss Context.</td></tr>');
      }
    };
  }

  if(typeof refresh === 'function'){
    const oldRefresh = refresh;
    refresh = function(){
      ensureApexCategory();
      applySixCategoryScoring();
      oldRefresh();
      initCategoryBoard();
      window.renderCategories();
    };
  }

  initCategoryBoard();
  if(typeof refresh === 'function') refresh();
  else window.renderCategories();
  document.documentElement.setAttribute('data-six-category-score','20260709b-live-rerank');
})();
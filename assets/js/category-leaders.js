// Adds a fluid Category Leaders tab tied to the current live category ratings.
(function(){
  const VERSION = 'category-leaders-20260705a';
  const DATA = window.RANKING_DATA;
  if(!DATA) return;

  const APEX_MAX = 6;
  const state = { category: 'championship', board: 'men' };
  const CATEGORIES = [
    { key: 'championship', label: 'Championship Resume', unit: 'PCTL', description: 'UFC title-level accomplishment, weighted title wins, and championship control.' },
    { key: 'opponentQuality', label: 'Opponent Quality Wins', unit: 'PCTL', description: 'Who they beat, when they beat them, and how strong the division was.' },
    { key: 'primeDominance', label: 'Prime Dominance', unit: 'PCTL', description: 'How clearly they separated from opponents at their best.' },
    { key: 'longevity', label: 'Elite Longevity', unit: 'PCTL', description: 'Active elite UFC years, not simple calendar time.' },
    { key: 'apexPeak', label: 'Apex Peak', unit: 'Rating', description: 'Best-night / best-year proof, adjusted for opponent proof, separation, division strength, and aura.' },
    { key: 'penalty', label: 'Loss Context', unit: 'PCTL', description: 'How clean the UFC résumé is after timing, opponent quality, finish context, and division context.' }
  ];

  function el(id){ return document.getElementById(id); }
  function num(value){ const n = Number(value || 0); return Number.isFinite(n) ? n : 0; }
  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
  function escapeHtml(value){ return String(value ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  function escapeAttr(value){ return escapeHtml(value).replace(/'/g, '&#39;'); }
  function categoryInfo(key){ return CATEGORIES.find(c => c.key === key) || CATEGORIES[0]; }
  function allRows(board){ return board === 'women' ? (DATA.women || []) : (DATA.men || []); }
  function profileForName(name){ return (DATA.fighters || []).find(f => f.fighter === name) || {}; }
  function hydrate(row){
    if(typeof fullRow === 'function') return fullRow(row);
    return { ...profileForName(row.fighter), ...row };
  }
  function overallRank(f){
    const overrideRank = window.DISPLAY_OVERRIDES?.[f.fighter]?.allTimeRank;
    return overrideRank || f.rank || '—';
  }
  function overallRating(f){
    if(typeof overallOvr === 'function') return overallOvr(f);
    const max = Math.max(...(DATA.men || []).concat(DATA.women || []).map(x => x.totalScore || 0), 1);
    return clamp(Math.round(75 + ((f.totalScore || 0) / max) * 24), 60, 99);
  }
  function apexRating(f){ return clamp(Math.round(55 + (num(f.apexPeak) / APEX_MAX) * 44), 55, 99); }
  function ratingFor(f,key){
    if(key === 'apexPeak') return apexRating(f);
    if(typeof categoryOvr === 'function') return categoryOvr(f,key);
    return num(f[key]);
  }
  function rankFor(f,key,board){
    if(key !== 'apexPeak' && typeof categoryRank === 'function') return categoryRank(f,key);
    const val = num(f?.[key]);
    return 1 + allRows(board).map(hydrate).filter(row => num(row?.[key]) > val).length;
  }
  function rawFor(f,key){ return key === 'apexPeak' ? num(f.apexPeak) : num(f[key]); }
  function sortRows(rows,key,board){
    return rows.map(hydrate).sort((a,b) => {
      const ar = rankFor(a,key,board), br = rankFor(b,key,board);
      if(ar !== br) return ar - br;
      const ratingGap = ratingFor(b,key) - ratingFor(a,key);
      if(ratingGap) return ratingGap;
      const rawGap = rawFor(b,key) - rawFor(a,key);
      if(rawGap) return rawGap;
      return overallRating(b) - overallRating(a);
    });
  }
  function fighterInitialsLocal(name){ return String(name||'').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase() || 'UFC'; }
  function thumbFor(f){ return window.DISPLAY_OVERRIDES?.[f.fighter]?.thumbUrl || window.DISPLAY_OVERRIDES?.[f.fighter]?.photoUrl || ''; }
  function photoHtml(f){
    if(typeof rowPhoto === 'function') return rowPhoto(f);
    const url = thumbFor(f);
    return `<div class="row-photo">${url ? `<img src="${escapeAttr(url)}" alt="${escapeAttr(f.fighter)} profile photo">` : fighterInitialsLocal(f.fighter)}</div>`;
  }
  function pct(value){ return value === null || value === undefined || value === '' ? '—' : `${Number(value).toFixed(1)}%`; }
  function fmt(value){ return value === null || value === undefined || value === '' ? '—' : Number(value).toFixed(2); }
  function sentence(value){ return String(value || '').split(/(?<=[.!?])\s+/).filter(Boolean)[0] || ''; }
  function titleWins(f){
    const notes = String(f?.title?.notes || '');
    const match = notes.match(/Total title fight wins = ([0-9.]+)/);
    return match ? match[1].replace(/\.0$/, '') : null;
  }
  function opponentNames(f){
    const opps = Array.isArray(f.opponents) ? f.opponents : [];
    const picked = [];
    opps.slice().sort((a,b)=>num(b.credit)-num(a.credit)).forEach(o => {
      const name = String(o.opponent || '').replace(/\s+\d+$/, '').trim();
      if(name && !picked.includes(name)) picked.push(name);
    });
    return picked.slice(0,4).join(', ');
  }
  function contextFor(f,key){
    if(key === 'championship'){
      const wins = titleWins(f);
      if(wins) return `${wins} UFC title-fight wins in the current title model.`;
      if(f?.title?.adjustedTitleWins) return `${Number(f.title.adjustedTitleWins).toFixed(1)} adjusted title-win credit.`;
      return sentence(f?.title?.notes) || 'Championship score is pulled from the live title-resume rating.';
    }
    if(key === 'opponentQuality'){
      const names = opponentNames(f);
      return names ? `Built around wins over ${names}.` : 'Quality-wins score is pulled from the live opponent-quality rating.';
    }
    if(key === 'primeDominance'){
      const pieces = [];
      if(f.primeRecord) pieces.push(f.primeRecord);
      if(f.finishRatePct !== undefined) pieces.push(`${pct(f.finishRatePct)} finish rate`);
      if(f.roundsWonPct !== undefined) pieces.push(`${pct(f.roundsWonPct)} rounds won`);
      return pieces.join(' · ') || 'Prime-dominance score is pulled from the live dominance rating.';
    }
    if(key === 'longevity') return `${fmt(f.activeEliteYears)} active elite UFC years in the current model.`;
    if(key === 'apexPeak'){
      const audit = f.apexPeakAudit || window.DISPLAY_OVERRIDES?.[f.fighter]?.apexPeakAudit || {};
      return audit.window ? `${audit.window}. ${sentence(audit.notes)}` : 'Apex Peak is pulled from the live 0-to-6 apex modifier.';
    }
    if(key === 'penalty'){
      if(typeof lossImpactText === 'function') return lossImpactText(f);
      return rawFor(f,key) === 0 ? 'No meaningful UFC loss damage in the current model.' : 'Loss score reflects timing, opponent quality, finish context, and division context.';
    }
    return '';
  }
  function valueText(f,key){
    if(key === 'apexPeak') return `${ratingFor(f,key)}`;
    return `${ratingFor(f,key)}`;
  }
  function rawText(f,key){
    if(key === 'apexPeak') return `Apex modifier: +${num(f.apexPeak).toFixed(2)} / +6.00`;
    if(key === 'penalty') return `Raw loss context: ${num(f.penalty).toFixed(2)}`;
    return `Raw category score: ${num(f[key]).toFixed(2)}`;
  }
  function ensureStyles(){
    if(document.getElementById('category-leaders-style')) return;
    const style = document.createElement('style');
    style.id = 'category-leaders-style';
    style.textContent = `
      .category-leader-shell{display:grid;gap:14px;margin-bottom:18px}.category-leader-controls{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.category-leader-pill{border:1px solid var(--line);background:var(--panel);color:var(--text);padding:10px 12px;border-radius:999px;cursor:pointer;font-weight:850}.category-leader-pill.active{background:var(--accent2);border-color:var(--accent2);color:#111827}.category-leader-board{min-width:170px}.category-leader-summary{border:1px solid rgba(250,204,21,.25);background:rgba(250,204,21,.07);border-radius:16px;padding:13px 14px;color:#fde68a;line-height:1.45}.category-leader-row{grid-template-columns:54px 64px minmax(0,1fr) 110px}.category-leader-context{margin-top:6px;color:var(--muted);font-size:12px;line-height:1.35}.category-leader-raw{display:inline-flex;margin-top:7px;border:1px solid rgba(255,255,255,.1);background:rgba(15,23,42,.62);color:#d1d5db;border-radius:999px;padding:5px 8px;font-size:11px;font-weight:800}@media(max-width:900px){.category-leader-controls{display:grid;grid-template-columns:1fr}.category-leader-pill,.category-leader-board{width:100%;min-width:0}.category-leader-row{grid-template-columns:34px 58px minmax(0,1fr) 74px}}`;
    document.head.appendChild(style);
  }
  function ensureTab(){
    const nav = document.querySelector('.tabs');
    const main = document.querySelector('main.shell');
    if(!nav || !main) return;
    if(!document.querySelector('[data-view="categoryLeaders"]')){
      const btn = document.createElement('button');
      btn.className = 'tab';
      btn.dataset.view = 'categoryLeaders';
      btn.textContent = 'Category Leaders';
      nav.insertBefore(btn, nav.querySelector('[data-view="compare"]') || nav.querySelector('[data-view="rules"]') || null);
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
        btn.classList.add('active');
        el('categoryLeaders')?.classList.add('active-view');
        render();
      });
    }
    if(!el('categoryLeaders')){
      const section = document.createElement('section');
      section.id = 'categoryLeaders';
      section.className = 'view';
      section.innerHTML = `<div class="section-title"><h2>Category Leaders</h2><p>Every scoring lane sorted 1-to-end from the current live ratings. No hardcoded leaderboard lists.</p></div><div id="categoryLeadersMount"></div>`;
      main.insertBefore(section, el('compare') || el('rules') || null);
    }
  }
  function controlsHtml(){
    return `<div class="category-leader-shell">
      <div class="category-leader-controls" id="categoryLeaderControls">
        ${CATEGORIES.map(cat => `<button type="button" class="category-leader-pill ${cat.key === state.category ? 'active' : ''}" data-category-leader="${cat.key}">${cat.label}</button>`).join('')}
        <select id="categoryLeaderBoard" class="category-leader-board" aria-label="Category leaders board">
          <option value="men" ${state.board === 'men' ? 'selected' : ''}>Men P4P</option>
          <option value="women" ${state.board === 'women' ? 'selected' : ''}>Women Only</option>
        </select>
      </div>
      <div id="categoryLeaderSummary" class="category-leader-summary"></div>
      <div id="categoryLeaderList" class="leaderboard"></div>
    </div>`;
  }
  function render(){
    ensureStyles();
    ensureTab();
    const mount = el('categoryLeadersMount');
    if(!mount) return;
    if(!el('categoryLeaderList')) mount.innerHTML = controlsHtml();
    const info = categoryInfo(state.category);
    document.querySelectorAll('[data-category-leader]').forEach(btn => btn.classList.toggle('active', btn.dataset.categoryLeader === state.category));
    const boardSelect = el('categoryLeaderBoard');
    if(boardSelect) boardSelect.value = state.board;
    const rows = sortRows(allRows(state.board), state.category, state.board);
    const summary = el('categoryLeaderSummary');
    if(summary) summary.innerHTML = `<strong>${info.label}</strong> — ${info.description} Showing ${rows.length} ${state.board === 'women' ? 'women' : 'men'} from the current live rating table.`;
    const list = el('categoryLeaderList');
    if(!list) return;
    list.innerHTML = rows.map((f,index) => {
      const displayRank = index + 1;
      const catRank = rankFor(f,state.category,state.board);
      const rating = valueText(f,state.category);
      const unit = info.unit;
      const divisions = `${f.primaryDivision || ''}${f.secondaryDivision ? ' / ' + f.secondaryDivision : ''}`;
      return `<article class="row fighter-row category-leader-row" data-fighter="${escapeAttr(f.fighter)}">
        <div class="rank">#${displayRank}</div>
        ${photoHtml(f)}
        <div class="row-main">
          <div class="name">${escapeHtml(f.fighter)}</div>
          <div class="meta">Overall #${overallRank(f)} · ${escapeHtml(f.ufcRecord || '')}${divisions ? ` · ${escapeHtml(divisions)}` : ''}</div>
          <div class="category-leader-context">${escapeHtml(contextFor(f,state.category))}</div>
          <div class="category-leader-raw">Category rank #${catRank || displayRank} · ${escapeHtml(rawText(f,state.category))}</div>
        </div>
        <div class="score"><strong>${rating}</strong><span class="meta">${unit}</span></div>
      </article>`;
    }).join('') || '<div class="notice">No fighters are loaded for this category.</div>';
    list.querySelectorAll('.row').forEach(row => row.addEventListener('click', () => { if(typeof openFighter === 'function') openFighter(row.dataset.fighter); }));
  }
  function bind(){
    document.addEventListener('click', event => {
      const btn = event.target.closest?.('[data-category-leader]');
      if(!btn) return;
      state.category = btn.dataset.categoryLeader;
      render();
    });
    document.addEventListener('change', event => {
      if(event.target?.id !== 'categoryLeaderBoard') return;
      state.board = event.target.value === 'women' ? 'women' : 'men';
      render();
    });
  }

  ensureStyles();
  ensureTab();
  bind();
  const previousRefresh = typeof refresh === 'function' ? refresh : null;
  if(previousRefresh && !window.__UFC_CATEGORY_LEADERS_REFRESH_WRAPPED__){
    window.__UFC_CATEGORY_LEADERS_REFRESH_WRAPPED__ = true;
    refresh = function(){ previousRefresh(); render(); };
  }
  render();
  window.UFC_CATEGORY_LEADERS = { version: VERSION, categories: CATEGORIES.map(c => c.key), render, appliedAt: new Date().toISOString() };
})();

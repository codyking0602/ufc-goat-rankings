// Category rank-based tier labels and view-card UX polish.
// Categories display as ratings, while tier labels are tied to rank position in the category.
(function(){
  const VERSION = 'category-rating-tiers-view-ux-20260707a';

  function categoryBoardFor(f){
    const data = window.RANKING_DATA || {};
    const women = data.women || [];
    const men = data.men || [];
    const isWomen = f?.leaderboard === 'women' || women.some(row => row.fighter === f?.fighter);
    return isWomen ? women : men;
  }

  function installBelowAverageStyle(){
    if(document.getElementById('ufc-category-percentile-tier-styles')) return;
    const style = document.createElement('style');
    style.id = 'ufc-category-percentile-tier-styles';
    style.textContent = `
      :root{--tier-below-average:#64748b;}
      .tier-below-average{--tier-color:var(--tier-below-average);}
    `;
    document.head.appendChild(style);
  }

  function tierByCategoryRank(f, key){
    const board = categoryBoardFor(f);
    const total = Math.max(board.length, 1);
    const rank = Number(categoryRank(f, key) || total);

    const legendaryCutoff = Math.max(1, Math.ceil(total * 0.05));
    const eliteCutoff = Math.max(legendaryCutoff, Math.ceil(total * 0.20));
    const greatCutoff = Math.max(eliteCutoff, Math.ceil(total * 0.45));
    const goodCutoff = Math.max(greatCutoff, Math.ceil(total * 0.70));
    const averageCutoff = Math.max(goodCutoff, Math.floor(total * 0.90));

    if(rank <= legendaryCutoff) return {label:'Legendary', cls:'tier-legendary'};
    if(rank <= eliteCutoff) return {label:'Elite', cls:'tier-elite'};
    if(rank <= greatCutoff) return {label:'Great', cls:'tier-great'};
    if(rank <= goodCutoff) return {label:'Good', cls:'tier-good'};
    if(rank <= averageCutoff) return {label:'Average', cls:'tier-average'};
    return {label:'Below Average', cls:'tier-below-average'};
  }

  function categoryTierContext(f, key){
    const ratingScore = categoryOvr(f, key);
    const rank = categoryRank(f, key);
    const tier = tierByCategoryRank(f, key);
    const width = Math.max(0, Math.min(100, ratingScore));
    return {ratingScore, rank, tier, width};
  }

  function installCategoryRatingRenderers(){
    if(typeof CATEGORY_INFO === 'undefined' || typeof categoryOvr !== 'function' || typeof categoryRank !== 'function') return false;
    installBelowAverageStyle();

    window.UFC_CATEGORY_PERCENTILE_TIERS = {
      version: VERSION,
      display: 'rating',
      buckets: [
        ['top 5%', 'Legendary'],
        ['top 20%', 'Elite'],
        ['top 45%', 'Great'],
        ['top 70%', 'Good'],
        ['top 90%', 'Average'],
        ['bottom 10%', 'Below Average']
      ],
      belowAverageColor: '#64748b',
      tierByCategoryRank
    };

    window.tierByCategoryRank = tierByCategoryRank;

    categoryCards = function(f){
      return CATEGORY_INFO.map(([key,label,description]) => {
        const {ratingScore, rank, tier, width} = categoryTierContext(f, key);
        return `<button type="button" class="category-card ${tier.cls}" data-category="${key}" aria-label="Explain ${label} rating for ${f.fighter}">
          <span class="category-label">${label}</span>
          <strong>${ratingScore} <span class="meta">Rating</span></strong>
          <small>#${rank || '—'} in category · ${description}</small>
          <span class="tier-pill">${tier.label}</span>
          <div class="category-bar"><i style="width:${width}%"></i></div>
        </button>`;
      }).join('');
    };

    categoryExplanation = function(f, key){
      const info = CATEGORY_INFO.find(([k]) => k === key) || [key, key, ''];
      const label = info[1];
      const description = info[2];
      const {ratingScore, rank, tier} = categoryTierContext(f, key);
      const items = categoryEvidenceItems(f, key);
      return `<div class="category-explainer ${tier.cls}">
        <div class="category-explainer-kicker">${tier.label} · #${rank || '—'} in category</div>
        <h3>${label}: ${ratingScore} rating</h3>
        <p><strong>What it means:</strong> ${categoryLogicSentence(f, key) || description}</p>
        <div class="category-explainer-grid">
          ${items.map(([k,v])=>`<div class="category-explainer-item"><strong>${k}</strong><small>${v}</small></div>`).join('')}
        </div>
      </div>`;
    };

    categoryMeter = function(f, key){
      const info = CATEGORY_INFO.find(([k]) => k === key) || [key, key, ''];
      const label = info[1];
      const {ratingScore, rank, tier, width} = categoryTierContext(f, key);
      return `<div class="category-mini ${tier.cls}">
        <div class="category-mini-head"><b>${label}</b><span>${ratingScore} Rating · #${rank || '—'} · ${tier.label}</span></div>
        <div class="bar"><i style="width:${width}%"></i></div>
      </div>`;
    };

    categoryChip = function(f, key){
      const info = CATEGORY_INFO.find(([k]) => k === key) || [key, key, ''];
      const label = info[1];
      const {ratingScore, rank, tier} = categoryTierContext(f, key);
      return `<div class="category-chip ${tier.cls}"><b>${label}</b><span>${ratingScore} Rating · #${rank || '—'}</span><small>${tier.label}</small></div>`;
    };

    categoryChipGrid = function(f){
      return `<div class="category-chips">
        ${categoryChip(f, 'championship')}
        ${categoryChip(f, 'opponentQuality')}
        ${categoryChip(f, 'primeDominance')}
        ${categoryChip(f, 'longevity')}
        ${categoryChip(f, 'penalty')}
      </div>`;
    };

    return true;
  }

  const DIVISION_ORDER = ['Heavyweight','Light Heavyweight','Middleweight','Welterweight','Lightweight','Featherweight','Bantamweight','Flyweight'];
  function $id(id){ return document.getElementById(id); }
  function fighters(){ return Array.isArray(window.RANKING_DATA?.fighters) ? window.RANKING_DATA.fighters : []; }
  function normalizeName(name){ return String(name || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[“”"']/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(); }
  function menRows(){ return fighters().filter(f => f?.fighter && (f.leaderboard === 'men' || f.gender === 'Men')).sort((a,b)=>Number(b.totalScore||0)-Number(a.totalScore||0)); }
  function findFighter(name){
    const wanted = normalizeName(name);
    return fighters().find(f => normalizeName(f.fighter) === wanted) || fighters().find(f => wanted.includes(normalizeName(f.fighter)) || normalizeName(f.fighter).includes(wanted));
  }
  function overrideFor(name){ return (typeof window.DISPLAY_OVERRIDES !== 'undefined' && window.DISPLAY_OVERRIDES?.[name]) ? window.DISPLAY_OVERRIDES[name] : {}; }
  function watchUrlFor(f){
    if(!f) return '';
    const o = overrideFor(f.fighter) || {};
    return f.display?.watchUrl || f.display?.watchMomentUrl || f.display?.signatureMomentUrl || f.display?.watch?.url || f.watchUrl || f.watchMomentUrl || f.signatureMomentUrl || f.watch?.url || f.watchMoment?.url || f.signatureMoment?.url || o.watchUrl || o.watchMomentUrl || o.signatureMomentUrl || '';
  }
  function photoFor(f){ return overrideFor(f.fighter)?.thumbUrl || f.display?.thumbUrl || overrideFor(f.fighter)?.photoUrl || f.display?.photoUrl || ''; }
  function initials(name){ return String(name||'').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase() || 'UFC'; }
  function resumeTagFor(f){ return overrideFor(f.fighter)?.resumeTag || f.display?.resumeTag || f.resumeTag || 'UFC resume'; }
  function divs(f){ return [f.primaryDivision, f.secondaryDivision].filter(Boolean); }
  function divisionNames(){
    const found = new Set();
    menRows().forEach(f => divs(f).forEach(d => found.add(d)));
    return [...found].sort((a,b)=>{
      const ai = DIVISION_ORDER.indexOf(a), bi = DIVISION_ORDER.indexOf(b);
      if(ai >= 0 || bi >= 0) return (ai >= 0 ? ai : 999) - (bi >= 0 ? bi : 999);
      return a.localeCompare(b);
    });
  }
  function searchHit(f){
    const q = ($id('search')?.value || '').trim().toLowerCase();
    return !q || String(f.fighter || '').toLowerCase().includes(q);
  }
  function rowsForDivision(division){ return menRows().filter(f => searchHit(f) && divs(f).includes(division)); }
  function rowPhoto(f){
    const src = photoFor(f);
    return `<div class="row-photo">${src ? `<img src="${src}" alt="${f.fighter} profile photo">` : initials(f.fighter)}</div>`;
  }
  function divisionMiniCard(f, rank){
    return `<article class="row fighter-row division-mini-card" data-fighter="${f.fighter}">
      <div class="rank">#${rank}</div>
      ${rowPhoto(f)}
      <div class="row-main"><div class="name">${f.fighter}</div><div class="meta">${f.ufcRecord || ''}${f.ufcRecord ? ' · ' : ''}${divs(f).join(' / ')}</div><div class="division-context">${resumeTagFor(f)}</div></div>
    </article>`;
  }
  function renderDivisionAccordions(){
    const container = $id('divisionList');
    if(!container) return;
    const selected = $id('divisionFilter')?.value || 'All';
    const q = ($id('search')?.value || '').trim().toLowerCase();
    const list = selected === 'All' ? divisionNames() : divisionNames().filter(d => d === selected);
    const key = `${selected}|${q}|${list.join(',')}|${menRows().length}`;
    if(container.dataset.ufcDivisionAccordionKey === key) return;
    container.dataset.ufcDivisionAccordionKey = key;
    const blocks = list.map(division => {
      const rows = rowsForDivision(division);
      if(!rows.length) return '';
      const expanded = selected !== 'All';
      return `<section class="division-accordion ${expanded ? 'is-open' : ''}" data-division="${division}">
        <button type="button" class="division-accordion-head" data-division-toggle="${division}" aria-expanded="${expanded ? 'true' : 'false'}"><span><strong>${division}</strong><small>${rows.length} ranked fighter${rows.length === 1 ? '' : 's'}</small></span><span class="division-preview">#1 ${rows[0].fighter}</span></button>
        <div class="division-accordion-body" ${expanded ? '' : 'hidden'}>${rows.map((f,i)=>divisionMiniCard(f,i+1)).join('')}</div>
      </section>`;
    }).join('');
    container.innerHTML = `<div class="notice division-intro">Pick a division to expand its board. Rankings use the current UFC-only score inside each division, but division cards do not show overall OVR.</div><div class="division-accordion-list">${blocks || '<div class="notice">No fighters match that filter.</div>'}</div>`;
  }
  function installDivisionHandlers(){
    const container = $id('divisionList');
    if(!container || container.dataset.ufcDivisionAccordionHandler) return;
    container.dataset.ufcDivisionAccordionHandler = 'true';
    container.addEventListener('click', event => {
      const toggle = event.target.closest('[data-division-toggle]');
      if(toggle){
        event.preventDefault();
        const section = toggle.closest('.division-accordion');
        const body = section?.querySelector('.division-accordion-body');
        const open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
        section?.classList.toggle('is-open', !open);
        if(body) body.hidden = open;
        return;
      }
      const row = event.target.closest('.division-mini-card');
      if(row && typeof window.openFighter === 'function') window.openFighter(row.dataset.fighter);
    });
  }
  function watchButton(f, cls='watch-moment-pill'){
    const url = watchUrlFor(f);
    if(!url) return '';
    return `<a class="${cls}" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Watch Signature Moment for ${f.fighter}">▶ Watch Signature Moment</a>`;
  }
  function ensureLeaderboardWatchButtons(){
    ['menList','womenList'].forEach(id => {
      const root = $id(id);
      if(!root) return;
      root.querySelectorAll('.fighter-row').forEach(card => {
        if(card.closest('#divisionList') || card.querySelector('.watch-moment-pill,.watch-moment-link')) return;
        const f = findFighter(card.dataset.fighter || card.querySelector('.name')?.textContent);
        const html = watchButton(f);
        if(!html) return;
        const target = card.querySelector('.resume-tag') || card.querySelector('.row-main .meta') || card.querySelector('.row-main');
        target?.insertAdjacentHTML('afterend', html);
      });
    });
  }
  function ensureProfileWatchButton(){
    const detail = $id('fighterDetail');
    const summary = detail?.querySelector('.profile-summary');
    if(!summary || summary.querySelector('.profile-watch-moment')) return;
    const imgName = detail.querySelector('.fighter-photo-img')?.getAttribute('alt')?.replace(/\s+profile photo$/i,'').trim();
    const headingName = summary.querySelector('h2')?.textContent?.trim();
    const html = watchButton(findFighter(imgName) || findFighter(headingName), 'watch-moment-link profile-watch-moment');
    const anchor = summary.querySelector('.profile-copy') || summary.querySelector('.profile-ovr') || summary.querySelector('h2');
    if(html && anchor) anchor.insertAdjacentHTML('afterend', `<div class="profile-watch-row">${html}</div>`);
  }
  function fixVisibleWords(root=document.body){
    if(!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode(node){
      const p = node.parentElement;
      if(!p || ['SCRIPT','STYLE','TEXTAREA','INPUT','SELECT','OPTION'].includes(p.tagName)) return NodeFilter.FILTER_REJECT;
      return /PCTL|percentile/i.test(node.nodeValue || '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }});
    const nodes = [];
    let node;
    while((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(n => { n.nodeValue = n.nodeValue.replace(/\bPCTL\b/g,'Rating').replace(/percentile-style/gi,'rating-style').replace(/percentile/gi,'rating'); });
  }
  function installViewStyles(){
    if(document.getElementById('ufc-view-render-fixes-css')) return;
    const style = document.createElement('style');
    style.id = 'ufc-view-render-fixes-css';
    style.textContent = `
      #menList .fighter-row .watch-moment-pill,#womenList .fighter-row .watch-moment-pill{margin-top:.55rem;padding:.5rem .9rem;border-radius:999px;max-width:100%;font-size:.82rem;font-weight:900;border:1px solid rgba(249,115,22,.58);background:rgba(249,115,22,.14);color:#fed7aa;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;line-height:1.1}
      .profile-watch-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:1rem}.profile-watch-moment{padding:.75rem 1.05rem;border-radius:999px;border:1px solid rgba(249,115,22,.62);background:rgba(249,115,22,.16);color:#fed7aa;text-decoration:none;font-weight:950;letter-spacing:.02em;display:inline-flex;width:fit-content}
      #divisionList .watch-moment-pill,#divisionList .watch-moment-link,#divisionList .category-chips,#divisionList .score{display:none!important}#divisionList .notice.division-intro{margin-bottom:12px}.division-accordion-list{display:grid;gap:12px}.division-accordion{display:grid;gap:8px}.division-accordion-head{width:100%;border:1px solid var(--line);border-radius:18px;padding:14px 16px;background:linear-gradient(180deg,var(--panel2),var(--panel));color:var(--text);display:flex;align-items:center;justify-content:space-between;gap:14px;text-align:left;cursor:pointer;font-family:inherit}.division-accordion-head strong{display:block;font-size:1.05rem;line-height:1.1}.division-accordion-head small{display:block;color:var(--muted);margin-top:4px;font-weight:750}.division-preview{color:#fde68a;font-weight:850;font-size:.9rem;text-align:right}.division-accordion-head::after{content:'+';color:var(--accent2);font-weight:950;font-size:1.25rem}.division-accordion.is-open .division-accordion-head::after{content:'−'}.division-accordion-body{display:grid;gap:9px}.division-mini-card{grid-template-columns:44px 64px minmax(0,1fr)!important;gap:14px!important;cursor:pointer}.division-mini-card .division-context{color:#fde68a;margin-top:5px;font-weight:750;font-size:.88rem}@media(max-width:900px){.division-accordion-head{padding:13px 14px}.division-preview{font-size:.8rem}.division-mini-card{grid-template-columns:34px 58px minmax(0,1fr)!important}}
    `;
    document.head.appendChild(style);
  }
  function applyViewUx(){
    installViewStyles();
    installDivisionHandlers();
    const active = document.querySelector('.tab.active')?.dataset.view;
    if(active === 'division' || document.querySelector('#divisionList .division-fighter-card')) renderDivisionAccordions();
    ensureLeaderboardWatchButtons();
    ensureProfileWatchButton();
    fixVisibleWords();
    document.documentElement.setAttribute('data-view-render-fixes', VERSION);
  }
  let scheduled = false;
  function schedule(){ if(scheduled) return; scheduled = true; requestAnimationFrame(()=>{ scheduled = false; applyViewUx(); }); }

  installCategoryRatingRenderers();
  if(typeof refresh === 'function'){
    try{ refresh(); }catch(e){}
  }
  schedule();
  setTimeout(schedule,250);
  setTimeout(schedule,900);
  document.addEventListener('click', () => setTimeout(schedule,0), true);
  document.addEventListener('change', schedule, true);
  document.addEventListener('input', schedule, true);
  if(document.body) new MutationObserver(schedule).observe(document.body, {childList:true, subtree:true});
  window.UFC_CATEGORY_PERCENTILE_TIERS.version = VERSION;
  window.UFC_VIEW_RENDER_FIXES = {version:VERSION, apply:applyViewUx, renderDivisionAccordions, watchUrlFor};
  document.documentElement.setAttribute('data-category-percentile-tiers', VERSION);
})();
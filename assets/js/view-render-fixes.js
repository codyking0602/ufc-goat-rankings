// Canonical view render fixes.
// Keeps fighter data canonical while enforcing tab-specific presentation rules.
(function(){
  const VERSION = 'view-render-fixes-20260707a';
  const DIVISION_ORDER = [
    'Heavyweight','Light Heavyweight','Middleweight','Welterweight','Lightweight','Featherweight','Bantamweight','Flyweight',
    'Women\'s Featherweight','Women\'s Bantamweight','Women\'s Flyweight','Women\'s Strawweight'
  ];

  function el(id){ return document.getElementById(id); }
  function dataFighters(){ return Array.isArray(window.RANKING_DATA?.fighters) ? window.RANKING_DATA.fighters : []; }
  function normalizeName(name){ return String(name || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[“”"']/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(); }
  function allRows(){ return dataFighters().filter(f => f && f.fighter); }
  function menRows(){ return allRows().filter(f => f.leaderboard === 'men' || f.gender === 'Men').sort((a,b)=>Number(b.totalScore||0)-Number(a.totalScore||0)); }
  function fighterByName(name){
    const wanted = normalizeName(name);
    return allRows().find(f => normalizeName(f.fighter) === wanted) ||
      allRows().find(f => wanted.includes(normalizeName(f.fighter)) || normalizeName(f.fighter).includes(wanted));
  }
  function displayOverrideFor(name){ return (typeof window.DISPLAY_OVERRIDES !== 'undefined' && window.DISPLAY_OVERRIDES?.[name]) ? window.DISPLAY_OVERRIDES[name] : {}; }
  function watchUrlFor(f){
    if(!f) return '';
    const override = displayOverrideFor(f.fighter) || {};
    return (
      f.display?.watchUrl ||
      f.display?.watchMomentUrl ||
      f.display?.signatureMomentUrl ||
      f.display?.watch?.url ||
      f.watchUrl ||
      f.watchMomentUrl ||
      f.signatureMomentUrl ||
      f.watch?.url ||
      f.watchMoment?.url ||
      f.signatureMoment?.url ||
      override.watchUrl ||
      override.watchMomentUrl ||
      override.signatureMomentUrl ||
      window.UFC_WATCH_MOMENTS?.links?.[f.fighter] ||
      window.UFC_WATCH_MOMENTS?.[f.fighter] ||
      ''
    );
  }
  function photoUrlFor(f){ return displayOverrideFor(f.fighter)?.thumbUrl || f.display?.thumbUrl || displayOverrideFor(f.fighter)?.photoUrl || f.display?.photoUrl || ''; }
  function initials(name){ return String(name||'').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase() || 'UFC'; }
  function resumeTagFor(f){ return displayOverrideFor(f.fighter)?.resumeTag || f.display?.resumeTag || f.resumeTag || 'UFC resume'; }
  function divisionsForFighter(f){ return [f.primaryDivision, f.secondaryDivision].filter(Boolean); }
  function divisionList(){
    const found = new Set();
    menRows().forEach(f => divisionsForFighter(f).forEach(d => found.add(d)));
    return [...found].sort((a,b)=>{
      const ai = DIVISION_ORDER.indexOf(a), bi = DIVISION_ORDER.indexOf(b);
      if(ai >= 0 || bi >= 0) return (ai >= 0 ? ai : 999) - (bi >= 0 ? bi : 999);
      return a.localeCompare(b);
    });
  }
  function rowMatchesSearch(f){
    const q = (el('search')?.value || '').trim().toLowerCase();
    return !q || String(f.fighter || '').toLowerCase().includes(q);
  }
  function divisionRows(division){
    return menRows().filter(f => rowMatchesSearch(f) && divisionsForFighter(f).includes(division));
  }
  function rowPhoto(f){
    const src = photoUrlFor(f);
    return `<div class="row-photo">${src ? `<img src="${src}" alt="${f.fighter} profile photo">` : initials(f.fighter)}</div>`;
  }
  function divisionMiniCard(f, rank){
    const divText = divisionsForFighter(f).join(' / ');
    return `<article class="row fighter-row division-mini-card" data-fighter="${f.fighter}">
      <div class="rank">#${rank}</div>
      ${rowPhoto(f)}
      <div class="row-main">
        <div class="name">${f.fighter}</div>
        <div class="meta">${f.ufcRecord || ''}${f.ufcRecord ? ' · ' : ''}${divText}</div>
        <div class="division-context">${resumeTagFor(f)}</div>
      </div>
    </article>`;
  }
  function renderDivisionAccordions(){
    const container = el('divisionList');
    if(!container) return;
    const selected = el('divisionFilter')?.value || 'All';
    const q = (el('search')?.value || '').trim().toLowerCase();
    const divisions = selected === 'All' ? divisionList() : divisionList().filter(d => d === selected);
    const key = `${selected}|${q}|${divisions.join(',')}|${menRows().length}`;
    if(container.dataset.ufcDivisionAccordionKey === key) return;
    container.dataset.ufcDivisionAccordionKey = key;
    const blocks = divisions.map((division, index) => {
      const rows = divisionRows(division);
      if(!rows.length) return '';
      const preview = rows[0] ? `#1 ${rows[0].fighter}` : 'No fighters yet';
      const expanded = selected !== 'All';
      return `<section class="division-accordion ${expanded ? 'is-open' : ''}" data-division="${division}">
        <button type="button" class="division-accordion-head" data-division-toggle="${division}" aria-expanded="${expanded ? 'true' : 'false'}">
          <span><strong>${division}</strong><small>${rows.length} ranked fighter${rows.length === 1 ? '' : 's'}</small></span>
          <span class="division-preview">${preview}</span>
        </button>
        <div class="division-accordion-body" ${expanded ? '' : 'hidden'}>
          ${rows.map((f,i)=>divisionMiniCard(f,i+1)).join('')}
        </div>
      </section>`;
    }).join('');
    container.innerHTML = `<div class="notice division-intro">Pick a division to expand its board. Rankings use the current UFC-only score inside each division, but division cards do not show overall OVR.</div><div class="division-accordion-list">${blocks || '<div class="notice">No fighters match that filter.</div>'}</div>`;
  }

  function installDivisionAccordionHandlers(){
    const container = el('divisionList');
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

  function visibleTextNodes(root){
    const nodes = [];
    if(!root) return nodes;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node){
        const parent = node.parentElement;
        if(!parent || ['SCRIPT','STYLE','TEXTAREA','INPUT','SELECT','OPTION'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        return /PCTL|percentile/i.test(node.nodeValue || '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    let node;
    while((node = walker.nextNode())) nodes.push(node);
    return nodes;
  }
  function fixCategoryRatingWording(root=document.body){
    visibleTextNodes(root).forEach(node => {
      node.nodeValue = node.nodeValue
        .replace(/\bPCTL\b/g, 'Rating')
        .replace(/percentile-style/gi, 'rating-style')
        .replace(/percentile/gi, 'rating');
    });
    document.querySelectorAll('[aria-label*="percentile"]').forEach(elm => {
      elm.setAttribute('aria-label', elm.getAttribute('aria-label').replace(/percentile/gi,'rating'));
    });
  }

  function watchButtonHtml(f, cls='watch-moment-pill'){
    const url = watchUrlFor(f);
    if(!url) return '';
    return `<a class="${cls}" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Watch Signature Moment for ${f.fighter}">▶ Watch Signature Moment</a>`;
  }
  function ensureLeaderboardWatchButtons(){
    ['menList','womenList'].forEach(id => {
      const root = el(id);
      if(!root) return;
      root.querySelectorAll('.fighter-row').forEach(card => {
        if(card.closest('#divisionList') || card.querySelector('.watch-moment-pill,.watch-moment-link')) return;
        const f = fighterByName(card.dataset.fighter || card.querySelector('.name')?.textContent);
        const html = watchButtonHtml(f);
        if(!html) return;
        const target = card.querySelector('.resume-tag') || card.querySelector('.row-main .meta') || card.querySelector('.row-main');
        if(target) target.insertAdjacentHTML('afterend', html);
      });
    });
  }
  function ensureProfileWatchButton(){
    const detail = el('fighterDetail');
    if(!detail) return;
    const summary = detail.querySelector('.profile-summary');
    if(!summary || summary.querySelector('.profile-watch-moment')) return;
    const imgName = detail.querySelector('.fighter-photo-img')?.getAttribute('alt')?.replace(/\s+profile photo$/i,'').trim();
    const headingName = summary.querySelector('h2')?.textContent?.trim();
    const f = fighterByName(imgName) || fighterByName(headingName);
    const html = watchButtonHtml(f, 'watch-moment-link profile-watch-moment');
    if(!html) return;
    const anchor = summary.querySelector('.profile-copy') || summary.querySelector('.profile-ovr') || summary.querySelector('h2');
    anchor?.insertAdjacentHTML('afterend', `<div class="profile-watch-row">${html}</div>`);
  }

  function installStyles(){
    if(document.getElementById('ufc-view-render-fixes-css')) return;
    const style = document.createElement('style');
    style.id = 'ufc-view-render-fixes-css';
    style.textContent = `
      #menList .leaderboard-fighter-card .watch-moment-pill,
      #womenList .leaderboard-fighter-card .watch-moment-pill,
      #menList .fighter-row .watch-moment-pill,
      #womenList .fighter-row .watch-moment-pill{margin-top:.55rem;padding:.5rem .9rem;border-radius:999px;max-width:100%;font-size:.82rem;font-weight:900;border:1px solid rgba(249,115,22,.58);background:rgba(249,115,22,.14);color:#fed7aa;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;line-height:1.1}
      #menList .fighter-row .watch-moment-pill:hover,#womenList .fighter-row .watch-moment-pill:hover,.profile-watch-moment:hover{background:rgba(249,115,22,.22);color:#fff}
      .profile-watch-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:1rem}
      .profile-watch-moment{padding:.75rem 1.05rem;border-radius:999px;border:1px solid rgba(249,115,22,.62);background:rgba(249,115,22,.16);color:#fed7aa;text-decoration:none;font-weight:950;letter-spacing:.02em;display:inline-flex;width:fit-content}
      #divisionList .watch-moment-pill,#divisionList .watch-moment-link,#divisionList .category-chips,#divisionList .score{display:none!important}
      #divisionList .notice.division-intro{margin-bottom:12px}
      .division-accordion-list{display:grid;gap:12px}
      .division-accordion{display:grid;gap:8px}
      .division-accordion-head{width:100%;border:1px solid var(--line);border-radius:18px;padding:14px 16px;background:linear-gradient(180deg,var(--panel2),var(--panel));color:var(--text);display:flex;align-items:center;justify-content:space-between;gap:14px;text-align:left;cursor:pointer;font-family:inherit}
      .division-accordion-head strong{display:block;font-size:1.05rem;line-height:1.1}
      .division-accordion-head small{display:block;color:var(--muted);margin-top:4px;font-weight:750}
      .division-preview{color:#fde68a;font-weight:850;font-size:.9rem;text-align:right}
      .division-accordion-head::after{content:'+';color:var(--accent2);font-weight:950;font-size:1.25rem}
      .division-accordion.is-open .division-accordion-head::after{content:'−'}
      .division-accordion-body{display:grid;gap:9px}
      .division-mini-card{grid-template-columns:44px 64px minmax(0,1fr)!important;gap:14px!important;cursor:pointer}
      .division-mini-card .division-context{color:#fde68a;margin-top:5px;font-weight:750;font-size:.88rem}
      @media(max-width:900px){.division-accordion-head{padding:13px 14px}.division-preview{font-size:.8rem}.division-mini-card{grid-template-columns:34px 58px minmax(0,1fr)!important}}
    `;
    document.head.appendChild(style);
  }

  function applyAll(){
    installStyles();
    installDivisionAccordionHandlers();
    const active = document.querySelector('.tab.active')?.dataset.view;
    if(active === 'division' || document.querySelector('#divisionList .division-fighter-card')) renderDivisionAccordions();
    ensureLeaderboardWatchButtons();
    ensureProfileWatchButton();
    fixCategoryRatingWording(document.body);
    document.documentElement.setAttribute('data-view-render-fixes', VERSION);
  }

  let scheduled = false;
  function schedule(){
    if(scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; applyAll(); });
  }

  document.addEventListener('click', event => {
    if(event.target.closest('.tab,#resetBtn,#divisionFilter,#search,.fighter-row,.category-card')) setTimeout(schedule, 0);
  }, true);
  document.addEventListener('change', schedule, true);
  document.addEventListener('input', schedule, true);

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, {once:true});
  else schedule();
  setTimeout(schedule, 250);
  setTimeout(schedule, 900);

  const observer = new MutationObserver(schedule);
  if(document.body) observer.observe(document.body, {childList:true, subtree:true});
  window.UFC_VIEW_RENDER_FIXES = {version:VERSION, apply:applyAll, watchUrlFor, renderDivisionAccordions};
})();

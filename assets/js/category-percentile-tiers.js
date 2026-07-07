// Category rank-based tier labels + watch pill/profile restoration.
// Categories display as ratings, while tier labels are tied to rank position in the category.
(function(){
  const VERSION = 'category-rating-tiers-watch-pill-20260707c';

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
      #menList .fighter-row .watch-moment-pill,
      #womenList .fighter-row .watch-moment-pill{
        margin-top:7px;
        border:1px solid rgba(249,115,22,.42);
        background:rgba(249,115,22,.11);
        color:#fed7aa;
        border-radius:999px;
        padding:5px 8px;
        font-size:11px;
        font-weight:850;
        max-width:100%;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        text-decoration:none;
        display:inline-flex;
        align-items:center;
        width:fit-content;
        line-height:1.05;
      }
      .profile-watch-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:1rem;}
      .profile-watch-moment{padding:.7rem 1rem;border-radius:999px;border:1px solid rgba(249,115,22,.62);background:rgba(249,115,22,.16);color:#fed7aa;text-decoration:none;font-weight:950;letter-spacing:.02em;display:inline-flex;width:fit-content;}
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
    window.UFC_CATEGORY_PERCENTILE_TIERS = {version: VERSION, display: 'rating', buckets: [['top 5%', 'Legendary'], ['top 20%', 'Elite'], ['top 45%', 'Great'], ['top 70%', 'Good'], ['top 90%', 'Average'], ['bottom 10%', 'Below Average']], belowAverageColor: '#64748b', tierByCategoryRank};
    window.tierByCategoryRank = tierByCategoryRank;
    categoryCards = function(f){
      return CATEGORY_INFO.map(([key,label,description]) => {
        const {ratingScore, rank, tier, width} = categoryTierContext(f, key);
        return `<button type="button" class="category-card ${tier.cls}" data-category="${key}" aria-label="Explain ${label} rating for ${f.fighter}"><span class="category-label">${label}</span><strong>${ratingScore} <span class="meta">Rating</span></strong><small>#${rank || '—'} in category · ${description}</small><span class="tier-pill">${tier.label}</span><div class="category-bar"><i style="width:${width}%"></i></div></button>`;
      }).join('');
    };
    categoryExplanation = function(f, key){
      const info = CATEGORY_INFO.find(([k]) => k === key) || [key, key, ''];
      const label = info[1];
      const description = info[2];
      const {ratingScore, rank, tier} = categoryTierContext(f, key);
      const items = categoryEvidenceItems(f, key);
      return `<div class="category-explainer ${tier.cls}"><div class="category-explainer-kicker">${tier.label} · #${rank || '—'} in category</div><h3>${label}: ${ratingScore} rating</h3><p><strong>What it means:</strong> ${categoryLogicSentence(f, key) || description}</p><div class="category-explainer-grid">${items.map(([k,v])=>`<div class="category-explainer-item"><strong>${k}</strong><small>${v}</small></div>`).join('')}</div></div>`;
    };
    categoryMeter = function(f, key){
      const info = CATEGORY_INFO.find(([k]) => k === key) || [key, key, ''];
      const label = info[1];
      const {ratingScore, rank, tier, width} = categoryTierContext(f, key);
      return `<div class="category-mini ${tier.cls}"><div class="category-mini-head"><b>${label}</b><span>${ratingScore} Rating · #${rank || '—'} · ${tier.label}</span></div><div class="bar"><i style="width:${width}%"></i></div></div>`;
    };
    categoryChip = function(f, key){
      const info = CATEGORY_INFO.find(([k]) => k === key) || [key, key, ''];
      const label = info[1];
      const {ratingScore, rank, tier} = categoryTierContext(f, key);
      return `<div class="category-chip ${tier.cls}"><b>${label}</b><span>${ratingScore} Rating · #${rank || '—'}</span><small>${tier.label}</small></div>`;
    };
    categoryChipGrid = function(f){
      return `<div class="category-chips">${categoryChip(f, 'championship')}${categoryChip(f, 'opponentQuality')}${categoryChip(f, 'primeDominance')}${categoryChip(f, 'longevity')}${categoryChip(f, 'penalty')}</div>`;
    };
    return true;
  }

  function fighters(){ return Array.isArray(window.RANKING_DATA?.fighters) ? window.RANKING_DATA.fighters : []; }
  function normalizeName(name){ return String(name || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[“”"']/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(); }
  function findFighter(name){
    const wanted = normalizeName(name);
    if(!wanted) return null;
    return fighters().find(f => normalizeName(f.fighter) === wanted) || fighters().find(f => wanted.includes(normalizeName(f.fighter)) || normalizeName(f.fighter).includes(wanted));
  }
  function overrideFor(name){ return (typeof DISPLAY_OVERRIDES !== 'undefined' && DISPLAY_OVERRIDES?.[name]) ? DISPLAY_OVERRIDES[name] : {}; }
  function deepFindWatchUrl(source, seen){
    if(!source) return '';
    if(!seen) seen = new WeakSet();
    if(typeof source === 'string'){
      const match = source.match(/https?:\/\/[^\s"'<>]+/i);
      const url = match ? match[0] : '';
      return /youtu\.?be|youtube\.com/i.test(url) ? url : '';
    }
    if(typeof source !== 'object') return '';
    if(seen.has(source)) return '';
    seen.add(source);
    for(const key of Object.keys(source)){
      const found = deepFindWatchUrl(source[key], seen);
      if(found) return found;
    }
    return '';
  }
  function watchUrlFor(f){
    if(!f) return '';
    const o = overrideFor(f.fighter) || {};
    return f.display?.watchUrl || f.display?.watchMomentUrl || f.display?.signatureMomentUrl || f.display?.watch?.url || f.watchUrl || f.watchMomentUrl || f.signatureMomentUrl || f.watch?.url || f.watchMoment?.url || f.signatureMoment?.url || o.watchUrl || o.watchMomentUrl || o.signatureMomentUrl || deepFindWatchUrl(f) || deepFindWatchUrl(o) || '';
  }
  function watchButton(f, cls){
    const url = watchUrlFor(f);
    if(!url) return '';
    return `<a class="${cls || 'watch-moment-pill'}" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Watch Signature Moment for ${f.fighter}">▶ Watch Moment</a>`;
  }
  function installWatchMomentRenderer(){
    if(typeof watchMomentPillHtml === 'function'){
      watchMomentPillHtml = function(f){ return watchButton(f, 'watch-moment-pill'); };
    }
    if(typeof watchMomentLabelFor === 'function'){
      watchMomentLabelFor = function(){ return 'Watch Signature Moment'; };
    }
  }
  function ensureLeaderboardWatchButtons(){
    ['menList','womenList'].forEach(id => {
      const root = document.getElementById(id);
      if(!root) return;
      root.querySelectorAll('.fighter-row').forEach(card => {
        if(card.closest('#divisionList') || card.querySelector('.watch-moment-pill,.watch-moment-link')) return;
        const f = findFighter(card.dataset.fighter || card.querySelector('.name')?.textContent);
        const html = watchButton(f, 'watch-moment-pill');
        if(!html) return;
        const target = card.querySelector('.resume-tag') || card.querySelector('.row-main .meta') || card.querySelector('.row-main');
        if(target) target.insertAdjacentHTML('afterend', html);
      });
    });
  }
  function ensureProfileWatchButton(){
    const detail = document.getElementById('fighterDetail');
    const summary = detail?.querySelector('.profile-summary');
    if(!summary || summary.querySelector('.profile-watch-moment')) return;
    const imgName = detail.querySelector('.fighter-photo-img')?.getAttribute('alt')?.replace(/\s+profile photo$/i,'').trim();
    const headingName = summary.querySelector('h2')?.textContent?.trim();
    const f = findFighter(imgName) || findFighter(headingName);
    const html = watchButton(f, 'watch-moment-link profile-watch-moment');
    const anchor = summary.querySelector('.profile-copy') || summary.querySelector('.profile-ovr') || summary.querySelector('h2');
    if(html && anchor) anchor.insertAdjacentHTML('afterend', `<div class="profile-watch-row">${html}</div>`);
  }
  function renderRealDivisionBoard(){
    const active = document.querySelector('.tab.active')?.dataset.view;
    if(active === 'division' && typeof window.renderDivision === 'function'){
      try{ window.renderDivision(); }catch(e){}
    }
  }
  function applyUx(){
    ensureLeaderboardWatchButtons();
    ensureProfileWatchButton();
    renderRealDivisionBoard();
    document.documentElement.setAttribute('data-category-percentile-tiers', VERSION);
  }
  let scheduled = false;
  function schedule(){ if(scheduled) return; scheduled = true; requestAnimationFrame(()=>{ scheduled = false; applyUx(); }); }

  installCategoryRatingRenderers();
  installWatchMomentRenderer();
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
})();
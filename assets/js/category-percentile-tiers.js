// Percentile-based category tier labels.
// Keeps category PCTL as the displayed number, but labels the tag by category rank position.
(function(){
  const VERSION = 'category-percentile-tiers-20260707a';

  function categoryBoardFor(f){
    const data = window.RANKING_DATA || {};
    const women = data.women || [];
    const men = data.men || [];
    const isWomen = f?.leaderboard === 'women' || women.some(row => row.fighter === f?.fighter);
    return isWomen ? women : men;
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
    return {label:'Below Average', cls:'tier-average'};
  }

  function categoryTierContext(f, key){
    const pctScore = categoryOvr(f, key);
    const rank = categoryRank(f, key);
    const tier = tierByCategoryRank(f, key);
    const width = Math.max(0, Math.min(100, pctScore));
    return {pctScore, rank, tier, width};
  }

  function install(){
    if(typeof CATEGORY_INFO === 'undefined' || typeof categoryOvr !== 'function' || typeof categoryRank !== 'function') return false;

    window.UFC_CATEGORY_PERCENTILE_TIERS = {
      version: VERSION,
      buckets: [
        ['top 5%', 'Legendary'],
        ['top 20%', 'Elite'],
        ['top 45%', 'Great'],
        ['top 70%', 'Good'],
        ['top 90%', 'Average'],
        ['bottom 10%', 'Below Average']
      ],
      tierByCategoryRank
    };

    window.tierByCategoryRank = tierByCategoryRank;

    categoryCards = function(f){
      return CATEGORY_INFO.map(([key,label,description]) => {
        const {pctScore, rank, tier, width} = categoryTierContext(f, key);
        return `<button type="button" class="category-card ${tier.cls}" data-category="${key}" aria-label="Explain ${label} percentile for ${f.fighter}">
          <span class="category-label">${label}</span>
          <strong>${pctScore} <span class="meta">PCTL</span></strong>
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
      const {pctScore, rank, tier} = categoryTierContext(f, key);
      const items = categoryEvidenceItems(f, key);
      return `<div class="category-explainer ${tier.cls}">
        <div class="category-explainer-kicker">${tier.label} · #${rank || '—'} in category</div>
        <h3>${label}: ${ordinal(pctScore)} percentile</h3>
        <p><strong>What it means:</strong> ${categoryLogicSentence(f, key) || description}</p>
        <div class="category-explainer-grid">
          ${items.map(([k,v])=>`<div class="category-explainer-item"><strong>${k}</strong><small>${v}</small></div>`).join('')}
        </div>
      </div>`;
    };

    categoryMeter = function(f, key){
      const info = CATEGORY_INFO.find(([k]) => k === key) || [key, key, ''];
      const label = info[1];
      const {pctScore, rank, tier, width} = categoryTierContext(f, key);
      return `<div class="category-mini ${tier.cls}">
        <div class="category-mini-head"><b>${label}</b><span>${pctScore} PCTL · #${rank || '—'} · ${tier.label}</span></div>
        <div class="bar"><i style="width:${width}%"></i></div>
      </div>`;
    };

    categoryChip = function(f, key){
      const info = CATEGORY_INFO.find(([k]) => k === key) || [key, key, ''];
      const label = info[1];
      const {pctScore, rank, tier} = categoryTierContext(f, key);
      return `<div class="category-chip ${tier.cls}"><b>${label}</b><span>${pctScore} PCTL · #${rank || '—'}</span><small>${tier.label}</small></div>`;
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

    if(typeof refresh === 'function'){
      try{ refresh(); }catch(e){}
    }
    document.documentElement.setAttribute('data-category-percentile-tiers', VERSION);
    return true;
  }

  install();
})();

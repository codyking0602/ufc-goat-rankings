// Adds Apex Peak as a visible fighter-card category without touching the base app shell.
(function(){
  const VERSION = 'apex-peak-category-card-20260711c-compact-profile-card';
  const APEX_MAX = 6;

  function num(value){
    const n = Number(value || 0);
    return Number.isFinite(n) ? n : 0;
  }
  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
  function apexScore(f){
    return num(f?.apexPeak);
  }
  function apexRating(f){
    return clamp(Math.round(55 + (apexScore(f) / APEX_MAX) * 44), 55, 99);
  }
  function apexWidth(f){
    return apexRating(f);
  }
  function apexTierFromRating(rating){
    if(typeof tierForOvr === 'function') return tierForOvr(rating);
    if(rating >= 97) return { label: 'Legendary', cls: 'tier-legendary' };
    if(rating >= 90) return { label: 'Elite', cls: 'tier-elite' };
    if(rating >= 85) return { label: 'Great', cls: 'tier-great' };
    if(rating >= 80) return { label: 'Good', cls: 'tier-good' };
    return { label: 'Average', cls: 'tier-average' };
  }
  function apexRank(f){
    const board = f?.leaderboard === 'women' ? (window.RANKING_DATA?.women || []) : (window.RANKING_DATA?.men || []);
    const val = apexScore(f);
    return 1 + board.filter(row => apexScore(row) > val).length;
  }
  function apexCard(f){
    const rating = apexRating(f);
    const tier = apexTierFromRating(rating);
    const width = apexWidth(f);
    return `<button type="button" class="category-card ${tier.cls}" data-category="apexPeak" aria-label="Explain Apex Peak rating for ${f.fighter}">
      <span class="category-label">Apex Peak</span>
      <strong>${rating} <span class="meta">Rating</span></strong>
      <small>#${apexRank(f) || '—'} in category</small>
      <span class="tier-pill">${tier.label}</span>
      <div class="category-bar"><i style="width:${width}%"></i></div>
    </button>`;
  }
  function apexExplanation(f){
    const score = apexScore(f);
    const rating = apexRating(f);
    const tier = apexTierFromRating(rating);
    const audit = f?.apexPeakAudit || {};
    const components = audit.components || {};
    const items = [
      ['Apex rating', `${rating} / 99`],
      ['Score modifier', `+${score.toFixed(2)} / +6.00`],
      ['Apex window', audit.window || 'Apex window not scored yet'],
      ['Best-alive claim', `${num(components.peakStatus).toFixed(2)} / 1.50`],
      ['Elite opponent proof', `${num(components.eliteOpponentProof).toFixed(2)} / 1.50`],
      ['Separation / dominance', `${num(components.separationDominance).toFixed(2)} / 1.25`],
      ['Division strength', `${num(components.divisionStrength).toFixed(2)} / 1.00`],
      ['Clean apex / aura', `${num(components.cleanApexAura).toFixed(2)} / 0.75`]
    ];
    const notes = audit.notes || 'This fighter has not been scored in the Apex Peak batch yet, so the rating is currently a placeholder.';
    return `<div class="category-explainer ${tier.cls}">
      <div class="category-explainer-kicker">${tier.label} · #${apexRank(f) || '—'} in category</div>
      <h3>Apex Peak: ${rating} Rating</h3>
      <p><strong>What it means:</strong> The best version of the fighter for one night or one short stretch — how unbeatable they looked, adjusted for elite opponent proof, dominance, division strength, and aura.</p>
      <div class="category-explainer-grid">
        ${items.map(([k,v])=>`<div class="category-explainer-item"><strong>${k}</strong><small>${v}</small></div>`).join('')}
      </div>
      <p><strong>Why it ranks here:</strong> ${notes}</p>
    </div>`;
  }
  function loadPrimeRowPolish(){
    if(document.querySelector('script[data-category-leaders-prime-row-polish]')) return;
    const script = document.createElement('script');
    script.src = 'assets/js/category-leaders-prime-row-polish.js?v=category-leaders-prime-row-polish-20260708a';
    script.setAttribute('data-category-leaders-prime-row-polish','true');
    document.body.appendChild(script);
  }
  function loadCategoryLeaders(){
    if(document.querySelector('script[data-category-leaders]')){
      loadPrimeRowPolish();
      return;
    }
    const script = document.createElement('script');
    script.src = 'assets/js/category-leaders.js?v=category-leaders-20260708a-live-prime-dominance';
    script.setAttribute('data-category-leaders','true');
    script.onload = loadPrimeRowPolish;
    document.body.appendChild(script);
  }

  const previousCategoryCards = typeof categoryCards === 'function' ? categoryCards : null;
  if(previousCategoryCards){
    categoryCards = function(f){
      const html = previousCategoryCards(f);
      const longevityLabel = 'data-category="longevity"';
      const longevityIndex = html.indexOf(longevityLabel);
      if(longevityIndex < 0) return `${html}${apexCard(f)}`;
      const nextButton = html.indexOf('</button>', longevityIndex);
      if(nextButton < 0) return `${html}${apexCard(f)}`;
      const insertAt = nextButton + '</button>'.length;
      return `${html.slice(0, insertAt)}${apexCard(f)}${html.slice(insertAt)}`;
    };
  }

  const previousCategoryExplanation = typeof categoryExplanation === 'function' ? categoryExplanation : null;
  if(previousCategoryExplanation){
    categoryExplanation = function(f,key){
      if(key === 'apexPeak') return apexExplanation(f);
      return previousCategoryExplanation(f,key);
    };
  }

  window.UFC_APEX_PEAK_CATEGORY_CARD = {
    version: VERSION,
    max: APEX_MAX,
    mode: 'visible fighter-card rating and explainer',
    categoryLeadersLoader: true,
    appliedAt: new Date().toISOString()
  };

  if(typeof refresh === 'function'){
    try { refresh(); } catch(e) {}
  }
  loadCategoryLeaders();
})();

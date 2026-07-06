// Adds Apex Peak as a visible fighter-card category without touching the base app shell.
(function(){
  const VERSION = 'apex-peak-category-card-20260705a';
  const APEX_MAX = 6;

  function num(value){
    const n = Number(value || 0);
    return Number.isFinite(n) ? n : 0;
  }
  function apexScore(f){
    return num(f?.apexPeak);
  }
  function apexWidth(f){
    return Math.max(0, Math.min(100, (apexScore(f) / APEX_MAX) * 100));
  }
  function apexTier(score){
    if(score >= 5.75) return { label: 'Mythic Apex', cls: 'tier-legendary' };
    if(score >= 5.00) return { label: 'All-Time Apex', cls: 'tier-elite' };
    if(score >= 4.00) return { label: 'Elite Apex', cls: 'tier-great' };
    if(score >= 2.50) return { label: 'Strong Apex', cls: 'tier-good' };
    return { label: score > 0 ? 'Context Apex' : 'Unscored Apex', cls: 'tier-average' };
  }
  function apexRank(f){
    const board = f?.leaderboard === 'women' ? (window.RANKING_DATA?.women || []) : (window.RANKING_DATA?.men || []);
    const val = apexScore(f);
    return 1 + board.filter(row => apexScore(row) > val).length;
  }
  function apexCard(f){
    const score = apexScore(f);
    const tier = apexTier(score);
    const width = apexWidth(f);
    const audit = f?.apexPeakAudit || {};
    const windowText = audit.window ? ` · ${audit.window}` : '';
    return `<button type="button" class="category-card ${tier.cls}" data-category="apexPeak" aria-label="Explain Apex Peak for ${f.fighter}">
      <span class="category-label">Apex Peak</span>
      <strong>+${score.toFixed(2)} <span class="meta">BONUS</span></strong>
      <small>#${apexRank(f) || '—'} in apex · Best-night / best-year proof${windowText}</small>
      <span class="tier-pill">${tier.label}</span>
      <div class="category-bar"><i style="width:${width}%"></i></div>
    </button>`;
  }
  function apexExplanation(f){
    const score = apexScore(f);
    const tier = apexTier(score);
    const audit = f?.apexPeakAudit || {};
    const components = audit.components || {};
    const items = [
      ['Apex window', audit.window || 'Apex window not scored yet'],
      ['Best-alive claim', `${num(components.peakStatus).toFixed(2)} / 1.50`],
      ['Elite opponent proof', `${num(components.eliteOpponentProof).toFixed(2)} / 1.50`],
      ['Separation / dominance', `${num(components.separationDominance).toFixed(2)} / 1.25`],
      ['Division strength', `${num(components.divisionStrength).toFixed(2)} / 1.00`],
      ['Clean apex / aura', `${num(components.cleanApexAura).toFixed(2)} / 0.75`]
    ];
    const notes = audit.notes || 'This fighter has not been scored in the Apex Peak batch yet, so the bonus is currently zero.';
    return `<div class="category-explainer ${tier.cls}">
      <div class="category-explainer-kicker">${tier.label} · #${apexRank(f) || '—'} in apex</div>
      <h3>Apex Peak: +${score.toFixed(2)} bonus</h3>
      <p><strong>What it means:</strong> The best version of the fighter for one night or one short stretch, adjusted for opponent proof, separation, division strength, and how few answers opponents seemed to have.</p>
      <div class="category-explainer-grid">
        ${items.map(([k,v])=>`<div class="category-explainer-item"><strong>${k}</strong><small>${v}</small></div>`).join('')}
      </div>
      <p><strong>Why it ranks here:</strong> ${notes}</p>
    </div>`;
  }

  const previousCategoryCards = typeof categoryCards === 'function' ? categoryCards : null;
  if(previousCategoryCards){
    categoryCards = function(f){
      const html = previousCategoryCards(f);
      const primeLabel = 'data-category="primeDominance"';
      const primeIndex = html.indexOf(primeLabel);
      if(primeIndex < 0) return `${html}${apexCard(f)}`;
      const nextButton = html.indexOf('</button>', primeIndex);
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
    mode: 'visible fighter-card category and explainer',
    appliedAt: new Date().toISOString()
  };

  if(typeof refresh === 'function'){
    try { refresh(); } catch(e) {}
  }
})();

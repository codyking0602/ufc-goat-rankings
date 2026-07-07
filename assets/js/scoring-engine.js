// UFC scoring engine foundation.
// Shadow mode only: calculates model totals, normalizes profile snapshot display,
// and keeps visible category UI aligned without changing canonical fighter scores yet.
(function(){
  const VERSION = 'scoring-engine-20260707a-shadow-snapshot-apex';
  const WEIGHTS = {
    championship: 35 / 30,
    primeDominance: 25 / 30,
    opponentQuality: 1,
    longevity: 10 / 15,
    apexPeak: 1
  };
  const CATEGORY_UI = [
    ['championship', 'Championship Resume', 'UFC title-level accomplishment: title-fight wins, reign strength, and control of the division'],
    ['opponentQuality', 'Quality Wins', 'Who they beat, when they beat them, and how strong the division was'],
    ['primeDominance', 'Prime Dominance', 'How clearly they separated from opponents at their best'],
    ['apexPeak', 'Apex Peak', 'Best one-night or short-stretch version: peak form, elite proof, dominance, and aura'],
    ['longevity', 'Elite Longevity', 'How long they stayed elite in the UFC, not just calendar span'],
    ['penalty', 'Loss Context', 'How much UFC losses actually hurt the resume after context']
  ];

  function fighters(){ return Array.isArray(window.RANKING_DATA?.fighters) ? window.RANKING_DATA.fighters : []; }
  function num(value, fallback=0){
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }
  function round2(value){ return Math.round((num(value) + Number.EPSILON) * 100) / 100; }
  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
  function html(value){
    return String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }
  function firstNumber(value){
    if(value === null || value === undefined || value === '') return null;
    if(Number.isFinite(Number(value))) return Number(value);
    const match = String(value).match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : null;
  }
  function categoryRaw(f,key){
    return num(f?.[key] ?? f?.scoring?.[key] ?? 0);
  }
  function storedScore(f){ return num(f?.totalScore ?? 0); }

  function calculateScore(f){
    const championship = round2(categoryRaw(f,'championship') * WEIGHTS.championship);
    const primeDominance = round2(categoryRaw(f,'primeDominance') * WEIGHTS.primeDominance);
    const opponentQuality = round2(categoryRaw(f,'opponentQuality') * WEIGHTS.opponentQuality);
    const longevity = round2(categoryRaw(f,'longevity') * WEIGHTS.longevity);
    const apexPeak = round2(categoryRaw(f,'apexPeak') * WEIGHTS.apexPeak);
    const penalty = round2(num(f?.penalty ?? f?.lossPenalty ?? f?.scoring?.penalty ?? 0));
    const positiveScore = round2(championship + primeDominance + opponentQuality + longevity + apexPeak);
    const totalScore = round2(positiveScore + penalty);
    return {
      categories: {
        championship: categoryRaw(f,'championship'),
        opponentQuality: categoryRaw(f,'opponentQuality'),
        primeDominance: categoryRaw(f,'primeDominance'),
        longevity: categoryRaw(f,'longevity'),
        apexPeak: categoryRaw(f,'apexPeak'),
        penalty
      },
      weightedScoreBreakdown: { championship, primeDominance, opponentQuality, longevity, apexPeak, positiveScore, penalty, totalScore },
      totalScore,
      storedTotalScore: storedScore(f),
      delta: round2(totalScore - storedScore(f))
    };
  }

  function titleFightWins(f){
    const direct = [
      f?.snapshot?.titleFightWins,
      f?.titleFightWins,
      f?.ufcTitleFightWins,
      f?.resume?.titleFightWins,
      f?.profileStats?.titleFightWins,
      f?.title?.titleFightWins
    ].map(firstNumber).find(v => Number.isFinite(v) && v >= 0 && v <= 25);
    if(direct !== undefined) return direct;
    const title = f?.title || {};
    const total = ['normalTitleWins','interimTitleWins','vacantUndisputedWins','secondDivisionUndisputedWins','vacantSecondDivisionWins']
      .reduce((sum,key)=>sum + num(title[key]),0);
    if(total) return total;
    const noteMatch = String(title.notes || '').match(/(?:Total\s*)?title[-\s]?fight wins\s*=\s*([0-9.]+)/i);
    return noteMatch ? Number(noteMatch[1]) : null;
  }
  function adjustedTitleWins(f){
    const direct = [f?.snapshot?.adjustedTitleWins, f?.adjustedTitleWins, f?.resume?.adjustedTitleWins, f?.title?.adjustedTitleWins]
      .map(firstNumber).find(v => Number.isFinite(v) && v >= 0 && v <= 30);
    return direct ?? null;
  }
  function cleanOpponentName(name){
    return String(name || '')
      .replace(/\s+(?:I{1,3}|IV|V)$/i,'')
      .replace(/\s+\d+$/,'')
      .trim();
  }
  function derivedEliteWins(f){
    const direct = [
      f?.snapshot?.eliteTopFiveWins,
      f?.eliteTopFiveWins,
      f?.eliteWins,
      f?.topFiveWins,
      f?.resume?.eliteTopFiveWins,
      f?.resume?.eliteWins,
      f?.resume?.topFiveWins,
      f?.profileStats?.eliteTopFiveWins,
      f?.profileStats?.eliteWins,
      f?.profileStats?.topFiveWins
    ].map(firstNumber).find(v => Number.isFinite(v) && v > 0 && v < 50);
    if(direct !== undefined) return direct;
    const wins = Array.isArray(f?.qualityWins) ? f.qualityWins : (Array.isArray(f?.opponents) ? f.opponents : []);
    const names = new Set();
    wins.forEach(o => {
      const credit = num(o?.credit ?? o?.value ?? 0);
      const context = String([o?.context,o?.type,o?.notes,o?.note].filter(Boolean).join(' ')).toLowerCase();
      if(credit >= 0.75 || /champion|top\s*-?\s*5|top-five|elite|p4p/.test(context)){
        const name = cleanOpponentName(o?.opponent);
        if(name) names.add(name);
      }
    });
    return names.size || null;
  }
  function finishRate(f){ return [f?.snapshot?.finishRatePct, f?.resume?.finishRatePct, f?.finishRatePct].map(firstNumber).find(v => Number.isFinite(v)); }
  function roundsWonPct(f){ return [f?.snapshot?.roundsWonPct, f?.resume?.roundsWonPct, f?.roundsWonPct, f?.roundsWonPercentage, f?.roundWinPct].map(firstNumber).find(v => Number.isFinite(v)); }
  function activeEliteYears(f){ return [f?.snapshot?.activeEliteYears, f?.resume?.activeEliteYears, f?.activeEliteYears].map(firstNumber).find(v => Number.isFinite(v)); }
  function timesFinishedPrime(f){ return [f?.snapshot?.timesFinishedPrime, f?.resume?.timesFinishedPrime, f?.timesFinishedPrime].map(firstNumber).find(v => Number.isFinite(v)); }
  function primeRecord(f){ return f?.snapshot?.primeRecord || f?.resume?.primeRecord || f?.primeRecord || f?.primeUfcRecord || f?.prime_record || null; }
  function fmtPct(value){ return Number.isFinite(value) ? `${Number(value).toFixed(1)}%` : '—'; }
  function fmtNum(value, digits=2){ return Number.isFinite(value) ? Number(value).toFixed(digits).replace(/\.00$/,'') : '—'; }
  function fmtYears(value){ return Number.isFinite(value) ? Number(value).toFixed(1).replace(/\.0$/,'') : '—'; }

  function snapshotItems(f){
    const titleWins = titleFightWins(f);
    const adjTitle = adjustedTitleWins(f);
    const eliteWins = derivedEliteWins(f);
    const finish = finishRate(f);
    const rounds = roundsWonPct(f);
    const years = activeEliteYears(f);
    const finished = timesFinishedPrime(f);
    return [
      ['UFC Record', f?.snapshot?.ufcRecord || f?.resume?.ufcRecord || f?.ufcRecord || '—'],
      ['UFC Title-Fight Wins', Number.isFinite(titleWins) ? String(titleWins).replace(/\.0$/,'') : '—'],
      ['Adjusted Title Wins', Number.isFinite(adjTitle) ? Number(adjTitle).toFixed(2) : '—'],
      ['Elite / Top-5 Wins', Number.isFinite(eliteWins) ? String(eliteWins).replace(/\.0$/,'') : '—'],
      ['Prime Record', primeRecord(f) || '—'],
      ['Finish Rate', fmtPct(finish)],
      ['Rounds Won', fmtPct(rounds)],
      ['Active Elite Years', fmtYears(years)],
      ['Times Finished in Prime', Number.isFinite(finished) ? String(finished).replace(/\.0$/,'') : '—']
    ];
  }
  function snapshotGrid(items){
    return `<div class="snapshot-grid">${items.map(([label,value])=>`<div class="snapshot-item"><strong>${html(value)}</strong><small>${html(label)}</small></div>`).join('')}</div>`;
  }
  function normalizeSnapshots(){
    fighters().forEach(f => { f.modelSnapshot = snapshotItems(f); });
  }
  function normalizeScores(){
    const rows = fighters();
    const report = rows.map(f => {
      const calc = calculateScore(f);
      f.calculatedScore = calc;
      f.modelScore = calc;
      return { fighter: f.fighter, storedTotalScore: calc.storedTotalScore, calculatedTotalScore: calc.totalScore, delta: calc.delta };
    });
    window.UFC_SCORING_ENGINE_REPORT = report.sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta));
  }

  function boardFor(f){
    const data = window.RANKING_DATA || {};
    return f?.leaderboard === 'women' ? (data.fighters || []).filter(x=>x.leaderboard==='women') : (data.fighters || []).filter(x=>x.leaderboard==='men');
  }
  function categoryContext(f, key){
    const ratingScore = typeof categoryOvr === 'function' ? categoryOvr(f,key) : 55;
    const rank = typeof categoryRank === 'function' ? categoryRank(f,key) : null;
    const tier = typeof tierByCategoryRank === 'function' ? tierByCategoryRank(f,key) : (typeof tierForOvr === 'function' ? tierForOvr(ratingScore) : {label:'Rated',cls:'tier-average'});
    const width = clamp(ratingScore,0,100);
    return {ratingScore, rank, tier, width};
  }
  function apexExplanation(f){
    const ctx = categoryContext(f,'apexPeak');
    const audit = f?.apexPeakAudit || {};
    const components = audit.components || {};
    const score = categoryRaw(f,'apexPeak');
    const items = [
      ['Apex score', `+${score.toFixed(2)} / +6.00`],
      ['Apex window', audit.window || 'Apex window not scored yet'],
      ['Best-alive claim', `${num(components.peakStatus).toFixed(2)} / 1.50`],
      ['Elite opponent proof', `${num(components.eliteOpponentProof).toFixed(2)} / 1.50`],
      ['Separation / dominance', `${num(components.separationDominance).toFixed(2)} / 1.25`],
      ['Division strength', `${num(components.divisionStrength).toFixed(2)} / 1.00`],
      ['Clean apex / aura', `${num(components.cleanApexAura).toFixed(2)} / 0.75`]
    ];
    return `<div class="category-explainer ${ctx.tier.cls}"><div class="category-explainer-kicker">${ctx.tier.label} · #${ctx.rank || '—'} in category</div><h3>Apex Peak: ${ctx.ratingScore} Rating</h3><p><strong>What it means:</strong> The best version of the fighter for one night or one short stretch — peak form, elite proof, dominance, division strength, and aura.</p><div class="category-explainer-grid">${items.map(([k,v])=>`<div class="category-explainer-item"><strong>${html(k)}</strong><small>${html(v)}</small></div>`).join('')}</div><p><strong>Why it ranks here:</strong> ${html(audit.notes || 'Apex Peak needs a full input audit for this fighter.')}</p></div>`;
  }
  function installCategoryRenderers(){
    if(typeof categoryOvr !== 'function' || typeof categoryRank !== 'function') return;
    const previousExplanation = typeof categoryExplanation === 'function' ? categoryExplanation : null;
    window.UFC_CATEGORY_UI_INFO = CATEGORY_UI;
    window.categoryCards = categoryCards = function(f){
      return CATEGORY_UI.map(([key,label,description]) => {
        const {ratingScore, rank, tier, width} = categoryContext(f,key);
        return `<button type="button" class="category-card ${tier.cls}" data-category="${key}" aria-label="Explain ${html(label)} rating for ${html(f.fighter)}"><span class="category-label">${html(label)}</span><strong>${ratingScore} <span class="meta">Rating</span></strong><small>#${rank || '—'} in category · ${html(description)}</small><span class="tier-pill">${html(tier.label)}</span><div class="category-bar"><i style="width:${width}%"></i></div></button>`;
      }).join('');
    };
    window.categoryChipGrid = categoryChipGrid = function(f){
      return `<div class="category-chips">${CATEGORY_UI.map(([key,label]) => {
        const {ratingScore, rank, tier} = categoryContext(f,key);
        return `<div class="category-chip ${tier.cls}"><b>${html(label)}</b><span>${ratingScore} Rating · #${rank || '—'}</span><small>${html(tier.label)}</small></div>`;
      }).join('')}</div>`;
    };
    window.categoryExplanation = categoryExplanation = function(f,key){
      if(key === 'apexPeak') return apexExplanation(f);
      return previousExplanation ? previousExplanation(f,key) : `<div class="category-explainer"><h3>${html(key)}</h3><p>Category explanation unavailable.</p></div>`;
    };
  }

  function activeProfileFighter(){
    const detail = document.getElementById('fighterDetail');
    const name = detail?.querySelector('.profile-summary h2')?.textContent?.trim();
    if(!name) return null;
    const norm = s => String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
    const wanted = norm(name);
    return fighters().find(f => norm(f.fighter) === wanted) || null;
  }
  function applyProfileSnapshot(){
    const detail = document.getElementById('fighterDetail');
    const f = activeProfileFighter();
    if(!detail || !f) return;
    const card = Array.from(detail.querySelectorAll('.card')).find(c => /^Resume Snapshot$/i.test(c.querySelector('h3')?.textContent?.trim() || ''));
    if(!card) return;
    const grid = card.querySelector('.snapshot-grid');
    const next = snapshotGrid(snapshotItems(f));
    if(grid) grid.outerHTML = next;
    else card.insertAdjacentHTML('beforeend', next);
  }
  function scheduleProfileSnapshot(){ requestAnimationFrame(applyProfileSnapshot); setTimeout(applyProfileSnapshot, 200); }

  function apply(){
    normalizeScores();
    normalizeSnapshots();
    installCategoryRenderers();
    scheduleProfileSnapshot();
    window.UFC_SCORING_ENGINE = {
      version: VERSION,
      mode: 'shadow',
      weights: WEIGHTS,
      categories: CATEGORY_UI.map(([key,label])=>({key,label})),
      calculateScore,
      snapshotItems,
      report: window.UFC_SCORING_ENGINE_REPORT
    };
    document.documentElement.setAttribute('data-scoring-engine', VERSION);
  }

  apply();
  if(typeof refresh === 'function'){
    try{ refresh(); }catch(e){}
  }
  document.addEventListener('click', () => setTimeout(applyProfileSnapshot, 0), true);
  document.addEventListener('change', () => setTimeout(applyProfileSnapshot, 0), true);
  document.addEventListener('input', () => setTimeout(applyProfileSnapshot, 0), true);
  if(document.body) new MutationObserver(() => scheduleProfileSnapshot()).observe(document.body, {childList:true, subtree:true});
})();

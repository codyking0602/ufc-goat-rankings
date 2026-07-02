// Division Rankings: men-only division boards with a first-pass division scoring model.
(function(){
  const DATA = window.RANKING_DATA;
  const VERSION = 'division-rankings-20260702e';
  if(!DATA || typeof DISPLAY_OVERRIDES === 'undefined') return;

  const DIVISION_ORDER = [
    'Heavyweight',
    'Light Heavyweight',
    'Middleweight',
    'Welterweight',
    'Lightweight',
    'Featherweight',
    'Bantamweight',
    'Flyweight'
  ];

  // Division score = existing UFC resume components, reweighted for the selected weight class.
  // Resume factor controls how much of a fighter's all-time resume actually belongs in that division.
  // 1.00 = primary division resume. Lower factors = real but smaller crossover resume.
  const DIVISION_RESUME_FACTORS = {
    'Heavyweight': {
      'Daniel Cormier': 0.92,
      'Jon Jones': 0.58
    },
    'Light Heavyweight': {
      'Randy Couture': 0.86,
      'Anderson Silva': 0.35
    },
    'Middleweight': {
      'Georges St-Pierre': 0.38,
      'Alex Pereira': 0.82
    },
    'Welterweight': {
      'B.J. Penn': 0.45,
      'Islam Makhachev': 0.55
    },
    'Lightweight': {
      'Max Holloway': 0.38,
      'Conor McGregor': 0.75,
      'Alexander Volkanovski': 0.30
    },
    'Featherweight': {
      'Conor McGregor': 0.78,
      'Jose Aldo': 1.00
    },
    'Bantamweight': {
      'Jose Aldo': 0.55,
      'Henry Cejudo': 0.72
    },
    'Flyweight': {
      'Henry Cejudo': 0.78
    }
  };

  const CANONICAL_DIVISIONS = {
    'heavyweight':'Heavyweight',
    'light heavyweight':'Light Heavyweight',
    'middleweight':'Middleweight',
    'welterweight':'Welterweight',
    'lightweight':'Lightweight',
    'featherweight':'Featherweight',
    'bantamweight':'Bantamweight',
    'flyweight':'Flyweight',
    'lhw':'Light Heavyweight',
    'hw':'Heavyweight'
  };

  function injectCss(){
    const existing = document.getElementById('division-rankings-css');
    if(existing) existing.remove();
    const style = document.createElement('style');
    style.id = 'division-rankings-css';
    style.textContent = `
      .division-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;margin-top:12px}
      .division-card{cursor:pointer;transition:.16s ease;overflow:hidden;color:#f8faff!important}
      .division-card:hover{transform:translateY(-1px);border-color:rgba(249,115,22,.72)!important}
      .division-card h3{display:flex;justify-content:space-between;gap:10px;align-items:center;margin:0 0 8px;font-size:18px;color:#f8faff!important}
      .division-card h3 span{font-size:12px;font-weight:900;color:#facc15!important;text-transform:uppercase;letter-spacing:.08em}
      .division-card p,.division-card .meta{color:#c7d2e2!important}
      .division-card p strong{color:#f8faff!important}
      .division-topline{display:grid;gap:6px;margin-top:10px}
      .division-topline-row{display:flex;justify-content:space-between;gap:10px;align-items:center;border-top:1px solid rgba(148,163,184,.28);padding-top:7px;font-size:13px;color:#c7d2e2!important}
      .division-topline-row strong{font-weight:900;color:#f8faff!important}
      .division-topline-row span{color:#c7d2e2!important}
    `;
    document.head.appendChild(style);
  }

  function clean(s){ return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(); }
  function canonicalDivisionName(s){ return CANONICAL_DIVISIONS[clean(s)] || String(s || '').trim(); }
  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
  function fighterInitialsLocal(name){ return String(name || '').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase(); }
  function full(row){
    if(typeof fullRow === 'function') return fullRow(row);
    const profile = DATA.fighters.find(f => f.fighter === row.fighter) || {};
    return {...profile, ...row};
  }
  function allRows(){
    const boards = [...(DATA.men || [])];
    const names = new Set(boards.map(r => r.fighter));
    DATA.fighters.filter(f => f.gender === 'Men').forEach(f => names.add(f.fighter));
    return [...names].map(name => full(boards.find(r => r.fighter === name) || {fighter:name})).filter(f => f.gender !== 'Women');
  }
  function divisionsFor(f){
    const raw = [f.primaryDivision, f.secondaryDivision, f.division, f.weightClass].filter(Boolean).join(' / ');
    return raw.split(/\/|,| and /i).map(x => canonicalDivisionName(x.trim())).filter(Boolean);
  }
  function targetDivision(division){ return canonicalDivisionName(division); }
  function primaryMatch(f, division){ return canonicalDivisionName(f.primaryDivision) === targetDivision(division); }
  function resumeFactor(f, division){
    if(primaryMatch(f, division)) return 1;
    const explicit = DIVISION_RESUME_FACTORS[division]?.[f.fighter];
    if(typeof explicit === 'number') return explicit;
    return 0;
  }
  function divisionMatch(f, division){
    if(division === 'All') return true;
    if(f.gender === 'Women') return false;
    const target = targetDivision(division);
    const ownsDivision = divisionsFor(f).some(d => d === target);
    return ownsDivision && resumeFactor(f, division) > 0;
  }
  function divisionScoreParts(f, division){
    const factor = resumeFactor(f, division);
    const title = clamp((Number(f.championship || 0) / 30) * 35, 0, 35);
    const quality = clamp((Number(f.opponentQuality || 0) / 25) * 30, 0, 30);
    const dominance = clamp((Number(f.primeDominance || 0) / 29) * 20, 0, 20);
    const longevity = clamp((Number(f.longevity || 0) / 15) * 15, 0, 15);
    const loss = clamp((Number(f.penalty || 0) / 10) * 5, -5, 0);
    const base = title + quality + dominance + longevity + loss;
    const score = clamp(base * factor, 0, 100);
    return {score, factor, title, quality, dominance, longevity, loss};
  }
  function divisionScore(f, division){ return divisionScoreParts(f, division).score; }
  function divisionRating(f, division){ return clamp(Math.round(70 + divisionScore(f, division) * 0.29), 70, 99); }
  function divisionRows(division){
    return allRows()
      .filter(f => divisionMatch(f, division))
      .sort((a,b) => divisionScore(b, division) - divisionScore(a, division) || Number(b.totalScore || 0) - Number(a.totalScore || 0));
  }
  function thumb(f){
    const url = DISPLAY_OVERRIDES[f.fighter]?.thumbUrl || DISPLAY_OVERRIDES[f.fighter]?.photoUrl || '';
    return `<div class="row-photo">${url ? `<img src="${url}" alt="${f.fighter} thumbnail" loading="lazy">` : fighterInitialsLocal(f.fighter)}</div>`;
  }
  function roleTag(f, division){
    if(division === 'All') return DISPLAY_OVERRIDES[f.fighter]?.resumeTag || 'Division profile';
    const factor = resumeFactor(f, division);
    if(primaryMatch(f, division)) return `${division} resume`;
    if(factor >= .75) return `${division} title resume`;
    return `${division} crossover`;
  }
  function rowHtml(f, i, division){
    const rating = divisionRating(f, division);
    return `<article class="row clean-row fighter-row division-row" data-fighter="${f.fighter}"><div class="rank">#${i + 1}</div>${thumb(f)}<div class="row-main"><div class="name">${f.fighter}</div><div class="meta">${f.ufcRecord || ''} · ${f.primaryDivision || ''}${f.secondaryDivision ? ' / ' + f.secondaryDivision : ''}</div><div class="resume-tag">${roleTag(f, division)}</div></div><div class="score"><strong>${rating}</strong><span class="meta">DIV</span></div></article>`;
  }
  function setDivisionHeading(title, copy){
    const section = document.querySelector('#division .section-title');
    if(!section) return;
    const h2 = section.querySelector('h2');
    const p = section.querySelector('p');
    if(h2) h2.textContent = title;
    if(p) p.textContent = copy;
  }
  function availableDivisions(){ return DIVISION_ORDER.filter(d => divisionRows(d).length > 0); }
  function normalizeDivisionSelect(){
    const select = el('divisionFilter');
    if(!select || select.dataset.menDivisionOrder === VERSION) return;
    const current = select.value;
    select.innerHTML = '<option value="All">All divisions</option>';
    availableDivisions().forEach(d => {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d;
      select.appendChild(opt);
    });
    select.value = DIVISION_ORDER.includes(current) ? current : 'All';
    select.dataset.menDivisionOrder = VERSION;
  }
  function renderDivisionHub(){
    setDivisionHeading('UFC Division Boards', 'Men-only weight-class boards, ordered heaviest to lightest.');
    const cards = availableDivisions().map(division => {
      const rows = divisionRows(division);
      const top = rows[0];
      const topThree = rows.slice(0,3).map((f,i)=>`<div class="division-topline-row"><strong>#${i+1} ${f.fighter}</strong><span>${divisionRating(f, division)} DIV</span></div>`).join('');
      return `<article class="card division-card" data-division-pick="${division}"><h3>${division}<span>${rows.length} loaded</span></h3><p class="meta">Current #1: <strong>${top ? top.fighter : '—'}</strong></p><div class="division-topline">${topThree}</div></article>`;
    }).join('');
    el('divisionList').innerHTML = `<div class="division-grid">${cards}</div>`;
    document.querySelectorAll('[data-division-pick]').forEach(card => card.addEventListener('click', () => {
      el('divisionFilter').value = card.dataset.divisionPick;
      window.renderDivision();
    }));
  }
  window.renderDivision = function(){
    injectCss();
    normalizeDivisionSelect();
    const division = el('divisionFilter').value;
    if(division === 'All'){
      renderDivisionHub();
      return;
    }
    const rows = divisionRows(division);
    setDivisionHeading(`${division} GOAT Board`, `${rows.length} loaded fighters · ranked by division-specific DIV rating.`);
    el('divisionList').innerHTML = rows.map((r,i)=>rowHtml(r,i,division)).join('') || '<div class="notice">No fighters are loaded for this division yet.</div>';
    document.querySelectorAll(`#divisionList .fighter-row`).forEach(row => row.addEventListener('click', () => openFighter(row.dataset.fighter)));
  };
  window.UFC_DIVISION_RANKINGS = { version: VERSION, mode: 'men-only-division-score-v1' };
  if(typeof window.renderDivision === 'function') window.renderDivision();
})();

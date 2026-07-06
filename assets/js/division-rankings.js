// Division Rankings: explicit UFC-only division boards with formula fallback for future fighters.
(function(){
  const DATA = window.RANKING_DATA;
  const VERSION = 'division-rankings-20260705c-explicit-boards';
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

  // These are division-only UFC boards, not filtered P4P rankings.
  // Cross-division work is included only where that division resume is real enough to rank.
  // Future added fighters not listed here still fall back into the board by division score.
  const DIVISION_BOARDS = {
    'Heavyweight': [
      { fighter:'Stipe Miocic', tag:'HW benchmark resume' },
      { fighter:'Cain Velasquez', tag:'Peak HW dominance' },
      { fighter:'Randy Couture', tag:'Historic HW title résumé' },
      { fighter:'Daniel Cormier', tag:'Short elite HW run' },
      { fighter:'Francis Ngannou', tag:'HW peak threat' },
      { fighter:'Jon Jones', tag:'Small HW sample' }
    ],
    'Light Heavyweight': [
      { fighter:'Jon Jones', tag:'LHW benchmark resume' },
      { fighter:'Daniel Cormier', tag:'Elite LHW résumé' },
      { fighter:'Chuck Liddell', tag:'Classic LHW title era' },
      { fighter:'Alex Pereira', tag:'Fast-rising LHW title run' },
      { fighter:'Randy Couture', tag:'Real but split résumé' },
      { fighter:'Dan Henderson', tag:'UFC-only LHW context' }
    ],
    'Middleweight': [
      { fighter:'Anderson Silva', tag:'MW benchmark resume' },
      { fighter:'Israel Adesanya', tag:'Modern MW title standard' },
      { fighter:'Alex Pereira', tag:'Short elite MW run' },
      { fighter:'Dan Henderson', tag:'UFC-only MW context' },
      { fighter:'Georges St-Pierre', tag:'One-fight MW title case' }
    ],
    'Welterweight': [
      { fighter:'Georges St-Pierre', tag:'WW benchmark resume' },
      { fighter:'Kamaru Usman', tag:'Modern WW title standard' },
      { fighter:'Matt Hughes', tag:'Classic WW title reign' },
      { fighter:'B.J. Penn', tag:'Two-division title context' }
    ],
    'Lightweight': [
      { fighter:'Islam Makhachev', tag:'Current LW scoring leader' },
      { fighter:'Khabib Nurmagomedov', tag:'LW dominance benchmark' },
      { fighter:'Charles Oliveira', tag:'Elite LW win ledger' },
      { fighter:'B.J. Penn', tag:'Classic LW champion' },
      { fighter:'Dustin Poirier', tag:'Elite LW résumé' },
      { fighter:'Frankie Edgar', tag:'LW title reign' },
      { fighter:'Max Holloway', tag:'LW crossover résumé' },
      { fighter:'Justin Gaethje', tag:'Elite LW title résumé' },
      { fighter:'Conor McGregor', tag:'LW title peak' },
      { fighter:'Alexander Volkanovski', tag:'LW challenger context' }
    ],
    'Featherweight': [
      { fighter:'Alexander Volkanovski', tag:'FW benchmark resume' },
      { fighter:'Jose Aldo', tag:'UFC-only FW title résumé' },
      { fighter:'Max Holloway', tag:'Elite FW title résumé' },
      { fighter:'Ilia Topuria', tag:'Current FW title peak' },
      { fighter:'Conor McGregor', tag:'FW title peak' },
      { fighter:'Dustin Poirier', tag:'Early FW résumé' },
      { fighter:'Frankie Edgar', tag:'FW contender résumé' },
      { fighter:'Aljamain Sterling', tag:'FW extension' }
    ],
    'Bantamweight': [
      { fighter:'Aljamain Sterling', tag:'BW title résumé leader' },
      { fighter:'Dominick Cruz', tag:'UFC-only BW standard' },
      { fighter:'T.J. Dillashaw', tag:'Two-time BW champion' },
      { fighter:'Merab Dvalishvili', tag:'Modern BW title run' },
      { fighter:'Petr Yan', tag:'Elite BW résumé' },
      { fighter:'Henry Cejudo', tag:'BW title win context' },
      { fighter:'Jose Aldo', tag:'Late BW contender run' },
      { fighter:'Frankie Edgar', tag:'Late BW context' }
    ],
    'Flyweight': [
      { fighter:'Demetrious Johnson', tag:'FLW benchmark resume' },
      { fighter:'Henry Cejudo', tag:'FLW title/rivalry résumé' }
    ]
  };

  // Used only for fighters not explicitly placed above.
  const DIVISION_RESUME_FACTORS = {
    'Heavyweight': { 'Daniel Cormier':0.92, 'Jon Jones':0.35 },
    'Light Heavyweight': { 'Randy Couture':0.62, 'Anderson Silva':0.20, 'Dan Henderson':0.50 },
    'Middleweight': { 'Georges St-Pierre':0.28, 'Alex Pereira':0.72, 'Dan Henderson':0.45 },
    'Welterweight': { 'B.J. Penn':0.42, 'Islam Makhachev':0.25 },
    'Lightweight': { 'Max Holloway':0.30, 'Conor McGregor':0.55, 'Alexander Volkanovski':0.18, 'Frankie Edgar':0.65 },
    'Featherweight': { 'Conor McGregor':0.72, 'Jose Aldo':1.00, 'Frankie Edgar':0.50, 'Aljamain Sterling':0.22, 'Dustin Poirier':0.28 },
    'Bantamweight': { 'Jose Aldo':0.42, 'Henry Cejudo':0.62, 'Frankie Edgar':0.15 },
    'Flyweight': { 'Henry Cejudo':0.78, 'T.J. Dillashaw':0.05 }
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
    'hw':'Heavyweight',
    'mw':'Middleweight',
    'ww':'Welterweight',
    'lw':'Lightweight',
    'fw':'Featherweight',
    'bw':'Bantamweight',
    'flw':'Flyweight'
  };

  function injectCss(){
    const existing = document.getElementById('division-rankings-css');
    if(existing) existing.remove();
    const style = document.createElement('style');
    style.id = 'division-rankings-css';
    style.textContent = `
      .division-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px;margin-top:8px}
      .division-card{cursor:pointer;transition:.16s ease;overflow:hidden;color:#f8faff!important;padding:13px 16px!important;border-radius:18px!important}
      .division-card:hover{transform:translateY(-1px);border-color:rgba(249,115,22,.72)!important}
      .division-card h3{display:flex;justify-content:space-between;gap:12px;align-items:center;margin:0 0 8px;font-size:20px;line-height:1.05;color:#f8faff!important}
      .division-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .division-rank-pill{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;min-height:28px;padding:5px 10px;border-radius:12px;border:1px solid rgba(250,204,21,.22);background:linear-gradient(135deg,rgba(126,86,18,.96),rgba(88,62,15,.9));box-shadow:inset 0 1px 0 rgba(255,255,255,.08);font-size:12px;font-weight:950;color:#facc15!important;letter-spacing:.01em;white-space:nowrap}
      .division-card p,.division-card .meta{color:#c7d2e2!important}
      .division-card p strong{color:#f8faff!important}
      .division-topline{display:grid;gap:0;margin-top:2px}
      .division-topline-row{display:flex;justify-content:flex-start;gap:10px;align-items:center;border-top:1px solid rgba(148,163,184,.28);padding:7px 0;font-size:14px;line-height:1.18;color:#c7d2e2!important}
      .division-topline-row strong{font-weight:900;color:#f8faff!important}
      .division-topline-row.is-top strong{color:#fff7d6!important}
      .division-rank-num{color:#facc15!important;margin-right:3px}
      .division-row{grid-template-columns:54px 64px minmax(0,1fr)!important}
      @media(max-width:900px){.division-grid{gap:9px;margin-top:8px}.division-card{padding:11px 14px!important;border-radius:18px!important}.division-card h3{font-size:19px;margin-bottom:7px}.division-rank-pill{min-height:26px;padding:4px 9px;font-size:12px}.division-topline-row{padding:6px 0;font-size:14px}.division-row{grid-template-columns:34px 58px minmax(0,1fr)!important}}
    `;
    document.head.appendChild(style);
  }

  function clean(s){ return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(); }
  function canonicalDivisionName(s){ return CANONICAL_DIVISIONS[clean(s)] || String(s || '').trim(); }
  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
  function fighterInitialsLocal(name){ return String(name || '').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase(); }
  function boardFor(division){ return DIVISION_BOARDS[targetDivision(division)] || []; }
  function boardEntry(fighter, division){ return boardFor(division).find(x => x.fighter === fighter); }
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
    if(boardEntry(f.fighter, division)) return 1;
    if(primaryMatch(f, division)) return 1;
    const explicit = DIVISION_RESUME_FACTORS[targetDivision(division)]?.[f.fighter];
    if(typeof explicit === 'number') return explicit;
    return 0;
  }
  function divisionMatch(f, division){
    if(division === 'All') return true;
    if(f.gender === 'Women') return false;
    const target = targetDivision(division);
    const ownsDivision = divisionsFor(f).some(d => d === target);
    return ownsDivision && resumeFactor(f, target) > 0;
  }
  function fallbackScoreParts(f, division){
    const factor = resumeFactor(f, division);
    const title = clamp((Number(f.championship || 0) / 30) * 35, 0, 35);
    const quality = clamp((Number(f.opponentQuality || 0) / 25) * 30, 0, 30);
    const dominance = clamp((Number(f.primeDominance || 0) / 29) * 20, 0, 20);
    const longevity = clamp((Number(f.longevity || 0) / 15) * 15, 0, 15);
    const loss = clamp((Number(f.penalty || 0) / 10) * 5, -5, 0);
    const base = title + quality + dominance + longevity + loss;
    return {score:clamp(base * factor, 0, 100), factor, title, quality, dominance, longevity, loss};
  }
  function fallbackScore(f, division){ return fallbackScoreParts(f, division).score; }
  function divisionRows(division){
    const target = targetDivision(division);
    if(division === 'All') return allRows().filter(f => f.gender !== 'Women');
    const rows = allRows().filter(f => divisionMatch(f, target));
    const explicit = boardFor(target)
      .map((entry, index) => ({entry, index, row: rows.find(f => f.fighter === entry.fighter)}))
      .filter(x => !!x.row)
      .sort((a,b) => a.index - b.index)
      .map(x => x.row);
    const explicitNames = new Set(explicit.map(f => f.fighter));
    const fallback = rows
      .filter(f => !explicitNames.has(f.fighter))
      .sort((a,b) => fallbackScore(b, target) - fallbackScore(a, target) || Number(b.totalScore || 0) - Number(a.totalScore || 0));
    return [...explicit, ...fallback];
  }
  function thumb(f){
    const url = DISPLAY_OVERRIDES[f.fighter]?.thumbUrl || DISPLAY_OVERRIDES[f.fighter]?.photoUrl || '';
    return `<div class="row-photo">${url ? `<img src="${url}" alt="${f.fighter} thumbnail" loading="lazy">` : fighterInitialsLocal(f.fighter)}</div>`;
  }
  function roleTag(f, division){
    const target = targetDivision(division);
    const explicit = boardEntry(f.fighter, target);
    if(explicit?.tag) return explicit.tag;
    if(division === 'All') return DISPLAY_OVERRIDES[f.fighter]?.resumeTag || 'Division profile';
    if(primaryMatch(f, target)) return `${target} resume`;
    const factor = resumeFactor(f, target);
    if(factor >= .65) return `${target} title resume`;
    return `${target} crossover`;
  }
  function rowHtml(f, i, division){
    return `<article class="row clean-row fighter-row division-row" data-fighter="${f.fighter}"><div class="rank">#${i + 1}</div>${thumb(f)}<div class="row-main"><div class="name">${f.fighter}</div><div class="meta">${f.ufcRecord || ''} · ${f.primaryDivision || ''}${f.secondaryDivision ? ' / ' + f.secondaryDivision : ''}</div><div class="resume-tag">${roleTag(f, division)}</div></div></article>`;
  }
  function setDivisionHeading(title, copy){
    const section = document.querySelector('#division .section-title');
    if(!section) return;
    const h2 = section.querySelector('h2');
    const p = section.querySelector('p');
    if(h2) h2.textContent = title;
    if(p) p.textContent = copy || '';
  }
  function availableDivisions(){ return DIVISION_ORDER.filter(d => divisionRows(d).length > 0); }
  function normalizeDivisionSelect(){
    const select = el('divisionFilter');
    if(!select) return;
    const divisions = availableDivisions();
    const signature = `${VERSION}|${divisions.join('|')}|${allRows().length}`;
    if(select.dataset.menDivisionOrder === signature) return;
    const current = select.value;
    select.innerHTML = '<option value="All">All divisions</option>';
    divisions.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d;
      select.appendChild(opt);
    });
    select.value = divisions.includes(current) ? current : 'All';
    select.dataset.menDivisionOrder = signature;
  }
  function renderDivisionHub(){
    setDivisionHeading('UFC Division Boards', 'Division-only rankings. A fighter’s P4P résumé does not automatically carry into every weight class.');
    const cards = availableDivisions().map(division => {
      const rows = divisionRows(division);
      const topThree = rows.slice(0,3).map((f,i)=>`<div class="division-topline-row ${i === 0 ? 'is-top' : ''}"><strong><span class="division-rank-num">#${i+1}</span> ${f.fighter}</strong></div>`).join('');
      return `<article class="card division-card" data-division-pick="${division}"><h3><span class="division-title">${division}</span><span class="division-rank-pill">${rows.length} Ranked</span></h3><div class="division-topline">${topThree}</div></article>`;
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
    setDivisionHeading(`${division} All-Time Rankings`, 'UFC-only division résumé. Cross-division achievements are context, not automatic ranking credit.');
    el('divisionList').innerHTML = rows.map((r,i)=>rowHtml(r,i,division)).join('') || '<div class="notice">No fighters are loaded for this division yet.</div>';
    document.querySelectorAll(`#divisionList .fighter-row`).forEach(row => row.addEventListener('click', () => openFighter(row.dataset.fighter)));
  };
  window.UFC_DIVISION_RANKINGS = { version: VERSION, mode: 'explicit-ufc-division-boards-with-fallback', boards: DIVISION_BOARDS };
  if(typeof window.renderDivision === 'function') window.renderDivision();
})();
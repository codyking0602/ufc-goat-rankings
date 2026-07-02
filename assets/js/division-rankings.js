// Division Rankings: productized division tab, replacing the old prototype note.
(function(){
  const DATA = window.RANKING_DATA;
  const VERSION = 'division-rankings-20260702a';
  if(!DATA || typeof DISPLAY_OVERRIDES === 'undefined') return;

  const DIVISION_ORDER = [
    'Heavyweight','Light Heavyweight','Middleweight','Welterweight','Lightweight','Featherweight','Bantamweight','Flyweight',
    "Women's Bantamweight","Women's Flyweight","Women's Strawweight","Women's Featherweight"
  ];

  const DIVISION_RANKS = {
    'Heavyweight': ['Stipe Miocic','Randy Couture','Daniel Cormier','Cain Velasquez','Francis Ngannou','Jon Jones','Alex Pereira'],
    'Light Heavyweight': ['Jon Jones','Daniel Cormier','Chuck Liddell','Alex Pereira','Randy Couture','Anderson Silva'],
    'Middleweight': ['Anderson Silva','Israel Adesanya','Alex Pereira','Georges St-Pierre'],
    'Welterweight': ['Georges St-Pierre','Kamaru Usman','Matt Hughes','B.J. Penn','Islam Makhachev'],
    'Lightweight': ['Khabib Nurmagomedov','Islam Makhachev','B.J. Penn','Charles Oliveira','Max Holloway','Conor McGregor','Alexander Volkanovski'],
    'Featherweight': ['Alexander Volkanovski','Max Holloway','Jose Aldo','Ilia Topuria','Conor McGregor'],
    'Bantamweight': ['Dominick Cruz','Merab Dvalishvili','Petr Yan','Henry Cejudo','Jose Aldo'],
    'Flyweight': ['Demetrious Johnson','Henry Cejudo'],
    "Women's Bantamweight": ['Amanda Nunes','Ronda Rousey','Valentina Shevchenko'],
    "Women's Flyweight": ['Valentina Shevchenko','Amanda Nunes'],
    "Women's Strawweight": ['Zhang Weili','Rose Namajunas'],
    "Women's Featherweight": ['Amanda Nunes']
  };

  const ALIASES = {
    'Heavyweight': ['Heavyweight'],
    'Light Heavyweight': ['Light Heavyweight','LHW'],
    'Middleweight': ['Middleweight'],
    'Welterweight': ['Welterweight'],
    'Lightweight': ['Lightweight'],
    'Featherweight': ['Featherweight'],
    'Bantamweight': ['Bantamweight'],
    'Flyweight': ['Flyweight'],
    "Women's Bantamweight": ["Women's Bantamweight",'Women Bantamweight','Bantamweight'],
    "Women's Flyweight": ["Women's Flyweight",'Women Flyweight','Flyweight'],
    "Women's Strawweight": ["Women's Strawweight",'Women Strawweight','Strawweight'],
    "Women's Featherweight": ["Women's Featherweight",'Women Featherweight','Featherweight']
  };

  function injectCss(){
    if(document.getElementById('division-rankings-css')) return;
    const style = document.createElement('style');
    style.id = 'division-rankings-css';
    style.textContent = `
      .division-board-intro{margin:0 0 14px;padding:16px;border-radius:20px;display:grid;gap:10px}
      .division-board-intro h3{margin:0;font-size:22px;letter-spacing:-.02em}
      .division-board-intro p{margin:0;line-height:1.45}
      .division-stat-strip{display:flex;flex-wrap:wrap;gap:8px;margin-top:2px}
      .division-stat-pill{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--line);border-radius:999px;padding:7px 10px;font-weight:850;font-size:12px}
      .division-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;margin-top:12px}
      .division-card{cursor:pointer;transition:.16s ease;overflow:hidden}
      .division-card:hover{transform:translateY(-1px);border-color:rgba(249,115,22,.72)!important}
      .division-card h3{display:flex;justify-content:space-between;gap:10px;align-items:center;margin:0 0 8px;font-size:18px}
      .division-card h3 span{font-size:12px;font-weight:900;color:#facc15;text-transform:uppercase;letter-spacing:.08em}
      .division-topline{display:grid;gap:6px;margin-top:10px}
      .division-topline-row{display:flex;justify-content:space-between;gap:10px;align-items:center;border-top:1px solid rgba(148,163,184,.22);padding-top:7px;font-size:13px}
      .division-topline-row strong{font-weight:900}
      .division-role{display:inline-flex;margin-top:7px;border:1px solid rgba(250,204,21,.25);background:rgba(250,204,21,.08);color:#fde68a;border-radius:999px;padding:5px 8px;font-size:11px;font-weight:850;max-width:max-content}
    `;
    document.head.appendChild(style);
  }

  function clean(s){ return String(s || '').toLowerCase().replace(/women'?s/g,'women').replace(/[^a-z0-9]+/g,' ').trim(); }
  function fighterInitialsLocal(name){ return String(name || '').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase(); }
  function full(row){
    if(typeof fullRow === 'function') return fullRow(row);
    const profile = DATA.fighters.find(f => f.fighter === row.fighter) || {};
    return {...profile, ...row};
  }
  function allRows(){
    const boards = [...(DATA.men || []), ...(DATA.women || [])];
    const names = new Set(boards.map(r => r.fighter));
    DATA.fighters.forEach(f => names.add(f.fighter));
    return [...names].map(name => full(boards.find(r => r.fighter === name) || {fighter:name}));
  }
  function divisionsFor(f){
    const raw = [f.primaryDivision, f.secondaryDivision, f.division, f.weightClass].filter(Boolean).join(' / ');
    return raw.split(/\/|,| and /i).map(x => x.trim()).filter(Boolean);
  }
  function divisionMatch(f, division){
    if(division === 'All') return true;
    const aliases = (ALIASES[division] || [division]).map(clean);
    const d = divisionsFor(f).map(clean);
    if(String(division).startsWith("Women's")){
      return f.gender === 'Women' && d.some(x => aliases.some(a => x.includes(a) || a.includes(x)));
    }
    return d.some(x => aliases.some(a => x === a || x.includes(a) || a.includes(x)));
  }
  function primaryMatch(f, division){
    if(!division || division === 'All') return true;
    if(String(division).startsWith("Women's") && f.gender !== 'Women') return false;
    return clean(f.primaryDivision) === clean(division).replace(/^women\s+/,'') || clean(f.primaryDivision) === clean(division);
  }
  function rankPriority(f, division){
    const list = DIVISION_RANKS[division] || [];
    const manual = list.indexOf(f.fighter);
    if(manual >= 0) return manual + 1;
    const secondaryPenalty = primaryMatch(f, division) ? 0 : 100;
    return 500 + secondaryPenalty - Number(f.totalScore || 0);
  }
  function divisionRows(division){
    return allRows()
      .filter(f => divisionMatch(f, division))
      .sort((a,b) => rankPriority(a, division) - rankPriority(b, division) || Number(b.totalScore || 0) - Number(a.totalScore || 0));
  }
  function thumb(f){
    const url = DISPLAY_OVERRIDES[f.fighter]?.thumbUrl || DISPLAY_OVERRIDES[f.fighter]?.photoUrl || '';
    return `<div class="row-photo">${url ? `<img src="${url}" alt="${f.fighter} thumbnail" loading="lazy">` : fighterInitialsLocal(f.fighter)}</div>`;
  }
  function roleTag(f, division){
    if(division === 'All') return DISPLAY_OVERRIDES[f.fighter]?.resumeTag || 'Division profile';
    return primaryMatch(f, division) ? `${division} résumé` : `${division} crossover`;
  }
  function rowHtml(f, i, division){
    const ovr = typeof overallOvr === 'function' ? overallOvr(f) : Math.round(75 + Number(f.totalScore || 0));
    return `<article class="row clean-row fighter-row division-row" data-fighter="${f.fighter}"><div class="rank">#${i + 1}</div>${thumb(f)}<div class="row-main"><div class="name">${f.fighter}</div><div class="meta">${f.ufcRecord || ''} · ${f.primaryDivision || ''}${f.secondaryDivision ? ' / ' + f.secondaryDivision : ''}</div><div class="resume-tag">${roleTag(f, division)}</div></div><div class="score"><strong>${ovr}</strong><span class="meta">OVR</span></div></article>`;
  }
  function setDivisionHeading(title, copy){
    const section = document.querySelector('#division .section-title');
    if(!section) return;
    const h2 = section.querySelector('h2');
    const p = section.querySelector('p');
    if(h2) h2.textContent = title;
    if(p) p.textContent = copy;
  }
  function availableDivisions(){
    const fromData = (DATA.divisions || []).filter(d => d && d !== 'All');
    const merged = [...new Set([...DIVISION_ORDER, ...fromData])];
    return merged.filter(d => divisionRows(d).length > 0);
  }
  function renderDivisionHub(){
    setDivisionHeading('UFC Division Boards', 'Choose a weight class to see the current division-specific leaderboard.');
    const cards = availableDivisions().map(division => {
      const rows = divisionRows(division);
      const top = rows[0];
      const topThree = rows.slice(0,3).map((f,i)=>`<div class="division-topline-row"><strong>#${i+1} ${f.fighter}</strong><span class="meta">${typeof overallOvr === 'function' ? overallOvr(f) : Math.round(f.totalScore || 0)} OVR</span></div>`).join('');
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
    const division = el('divisionFilter').value;
    if(division === 'All'){
      renderDivisionHub();
      return;
    }
    const rows = divisionRows(division);
    setDivisionHeading(`${division} GOAT Board`, `Current division view for fighters with meaningful UFC work at ${division}.`);
    const top = rows[0];
    const intro = `<div class="card division-board-intro"><h3>${division} Leaderboard</h3><p class="meta">Ranked as a division board, with primary-division résumés ahead of lighter crossover cases when needed.</p><div class="division-stat-strip"><span class="division-stat-pill">${rows.length} fighters loaded</span><span class="division-stat-pill">#1 ${top ? top.fighter : '—'}</span><span class="division-stat-pill">Tap a fighter for profile</span></div></div>`;
    el('divisionList').innerHTML = intro + (rows.map((r,i)=>rowHtml(r,i,division)).join('') || '<div class="notice">No fighters are loaded for this division yet.</div>');
    document.querySelectorAll(`#divisionList .fighter-row`).forEach(row => row.addEventListener('click', () => openFighter(row.dataset.fighter)));
  };
  window.UFC_DIVISION_RANKINGS = { version: VERSION };
  if(typeof window.renderDivision === 'function') window.renderDivision();
})();

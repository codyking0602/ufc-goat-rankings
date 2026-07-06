// Division Rankings: fluid UFC-only division boards with Apex Peak included.
(function(){
  const DATA = window.RANKING_DATA;
  const VERSION = 'division-rankings-20260705d-fluid-apex';
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

  // Fluid scoring inputs mirror the live overall weighting layer:
  // Title Reign + Prime Dominance + Quality Wins + Elite Longevity + Apex Peak + Loss Context.
  // Division guardrails control how much of a fighter's current résumé belongs in a given division.
  // They are not hard ranks; changing category values, Apex, or penalties will move the board.
  const SCORE_WEIGHTS = {
    championship: 35,
    primeDominance: 25,
    opponentQuality: 25,
    longevity: 10
  };
  const BASE_MAX = {
    championship: 30,
    primeDominance: 30,
    opponentQuality: 25,
    longevity: 15
  };

  const DIVISION_GUARDRAILS = {
    'Heavyweight': {
      'Stipe Miocic': { sample:1.00, modifier:1.05, tag:'HW benchmark resume' },
      'Cain Velasquez': { sample:1.00, modifier:1.06, tag:'Peak HW dominance' },
      'Randy Couture': { sample:1.00, modifier:0.88, tag:'Historic HW title résumé' },
      'Daniel Cormier': { sample:0.84, modifier:1.03, tag:'Short elite HW run' },
      'Francis Ngannou': { sample:1.00, modifier:1.00, tag:'HW peak threat' },
      'Jon Jones': { sample:0.32, modifier:1.00, tag:'Small HW sample' }
    },
    'Light Heavyweight': {
      'Jon Jones': { sample:1.00, modifier:1.04, tag:'LHW benchmark resume' },
      'Daniel Cormier': { sample:0.90, modifier:1.02, tag:'Elite LHW résumé' },
      'Chuck Liddell': { sample:1.00, modifier:1.04, tag:'Classic LHW title era' },
      'Alex Pereira': { sample:0.72, modifier:1.00, tag:'Fast-rising LHW title run' },
      'Randy Couture': { sample:0.62, modifier:0.95, tag:'Real but split résumé' },
      'Dan Henderson': { sample:0.52, modifier:0.95, tag:'UFC-only LHW context' },
      'Anderson Silva': { sample:0.18, modifier:0.90, tag:'LHW cameo context' }
    },
    'Middleweight': {
      'Anderson Silva': { sample:1.00, modifier:1.03, tag:'MW benchmark resume' },
      'Israel Adesanya': { sample:1.00, modifier:1.00, tag:'Modern MW title standard' },
      'Alex Pereira': { sample:0.68, modifier:1.00, tag:'Short elite MW run' },
      'Dan Henderson': { sample:0.45, modifier:0.95, tag:'UFC-only MW context' },
      'Georges St-Pierre': { sample:0.25, modifier:1.00, tag:'One-fight MW title case' }
    },
    'Welterweight': {
      'Georges St-Pierre': { sample:1.00, modifier:1.03, tag:'WW benchmark resume' },
      'Kamaru Usman': { sample:1.00, modifier:1.00, tag:'Modern WW title standard' },
      'Matt Hughes': { sample:1.00, modifier:1.00, tag:'Classic WW title reign' },
      'B.J. Penn': { sample:0.42, modifier:1.00, tag:'Two-division title context' }
    },
    'Lightweight': {
      'Islam Makhachev': { sample:1.00, modifier:1.00, tag:'Current LW scoring leader' },
      'Khabib Nurmagomedov': { sample:1.00, modifier:1.00, tag:'LW dominance benchmark' },
      'Charles Oliveira': { sample:1.00, modifier:1.00, tag:'Elite LW win ledger' },
      'B.J. Penn': { sample:0.82, modifier:1.00, tag:'Classic LW champion' },
      'Dustin Poirier': { sample:0.94, modifier:1.00, tag:'Elite LW résumé' },
      'Frankie Edgar': { sample:0.72, modifier:1.00, tag:'LW title reign' },
      'Max Holloway': { sample:0.30, modifier:1.00, tag:'LW crossover résumé' },
      'Justin Gaethje': { sample:1.00, modifier:1.00, tag:'Elite LW title résumé' },
      'Conor McGregor': { sample:0.55, modifier:1.00, tag:'LW title peak' },
      'Alexander Volkanovski': { sample:0.18, modifier:1.00, tag:'LW challenger context' },
      'Ilia Topuria': { sample:0.35, modifier:1.00, tag:'Current-table LW context' }
    },
    'Featherweight': {
      'Alexander Volkanovski': { sample:1.00, modifier:1.03, tag:'FW benchmark resume' },
      'Jose Aldo': { sample:0.86, modifier:1.03, tag:'UFC-only FW title résumé' },
      'Max Holloway': { sample:0.82, modifier:1.00, tag:'Elite FW title résumé' },
      'Ilia Topuria': { sample:0.82, modifier:1.00, tag:'Current FW title peak' },
      'Conor McGregor': { sample:0.72, modifier:1.00, tag:'FW title peak' },
      'Dustin Poirier': { sample:0.25, modifier:1.00, tag:'Early FW résumé' },
      'Frankie Edgar': { sample:0.42, modifier:1.00, tag:'FW contender résumé' },
      'Aljamain Sterling': { sample:0.22, modifier:1.00, tag:'FW extension' }
    },
    'Bantamweight': {
      'Aljamain Sterling': { sample:0.92, modifier:1.03, tag:'BW title résumé leader' },
      'Dominick Cruz': { sample:1.00, modifier:1.00, tag:'UFC-only BW standard' },
      'T.J. Dillashaw': { sample:0.95, modifier:0.98, tag:'Two-time BW champion' },
      'Merab Dvalishvili': { sample:1.00, modifier:1.00, tag:'Modern BW title run' },
      'Petr Yan': { sample:1.00, modifier:1.00, tag:'Elite BW résumé' },
      'Henry Cejudo': { sample:0.62, modifier:1.00, tag:'BW title win context' },
      'Jose Aldo': { sample:0.35, modifier:1.00, tag:'Late BW contender run' },
      'Frankie Edgar': { sample:0.12, modifier:1.00, tag:'Late BW context' }
    },
    'Flyweight': {
      'Demetrious Johnson': { sample:1.00, modifier:1.04, tag:'FLW benchmark resume' },
      'Henry Cejudo': { sample:0.78, modifier:1.00, tag:'FLW title/rivalry résumé' }
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
      .division-row{grid-template-columns:54px 64px minmax(0,1fr) 78px!important}
      .division-score{justify-items:end;text-align:right;font-weight:950;color:#f8faff;line-height:1}
      .division-score strong{display:block;font-size:22px;letter-spacing:-.03em}
      .division-score small{display:block;color:#9ca3af;font-size:10px;text-transform:uppercase;letter-spacing:.08em;margin-top:3px}
      @media(max-width:900px){.division-grid{gap:9px;margin-top:8px}.division-card{padding:11px 14px!important;border-radius:18px!important}.division-card h3{font-size:19px;margin-bottom:7px}.division-rank-pill{min-height:26px;padding:4px 9px;font-size:12px}.division-topline-row{padding:6px 0;font-size:14px}.division-row{grid-template-columns:34px 58px minmax(0,1fr) 58px!important}.division-score strong{font-size:18px}.division-score small{font-size:9px}}
    `;
    document.head.appendChild(style);
  }

  function clean(s){ return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(); }
  function canonicalDivisionName(s){ return CANONICAL_DIVISIONS[clean(s)] || String(s || '').trim(); }
  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
  function num(value){ const n = Number(value || 0); return Number.isFinite(n) ? n : 0; }
  function round1(value){ return Math.round((num(value) + Number.EPSILON) * 10) / 10; }
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
  function guardrail(f, division){ return DIVISION_GUARDRAILS[targetDivision(division)]?.[f.fighter] || null; }
  function sampleShare(f, division){
    const g = guardrail(f, division);
    if(g && typeof g.sample === 'number') return clamp(g.sample, 0, 1);
    return primaryMatch(f, division) ? 1 : 0;
  }
  function divisionMatch(f, division){
    if(division === 'All') return true;
    if(f.gender === 'Women') return false;
    const target = targetDivision(division);
    const ownsDivision = divisionsFor(f).some(d => d === target);
    return ownsDivision && sampleShare(f, target) > 0;
  }
  function weightedComponent(row, key){ return (num(row[key]) / BASE_MAX[key]) * SCORE_WEIGHTS[key]; }
  function liveBreakdown(row){
    if(row.weightedScoreBreakdown){
      return {
        championship:num(row.weightedScoreBreakdown.championship),
        primeDominance:num(row.weightedScoreBreakdown.primeDominance),
        opponentQuality:num(row.weightedScoreBreakdown.opponentQuality),
        longevity:num(row.weightedScoreBreakdown.longevity),
        apexPeak:num(row.weightedScoreBreakdown.apexPeak ?? row.apexPeak),
        penalty:num(row.weightedScoreBreakdown.penalty ?? row.penalty)
      };
    }
    return {
      championship:weightedComponent(row, 'championship'),
      primeDominance:weightedComponent(row, 'primeDominance'),
      opponentQuality:weightedComponent(row, 'opponentQuality'),
      longevity:weightedComponent(row, 'longevity'),
      apexPeak:num(row.apexPeak),
      penalty:num(row.penalty)
    };
  }
  function divisionScoreParts(f, division){
    const target = targetDivision(division);
    const g = guardrail(f, target) || {};
    const sample = sampleShare(f, target);
    const modifier = typeof g.modifier === 'number' ? g.modifier : 1;
    const b = liveBreakdown(f);
    const positive = b.championship + b.primeDominance + b.opponentQuality + b.longevity + b.apexPeak;
    const penaltyWeight = clamp(sample + 0.20, 0, 1);
    const adjustedPositive = positive * sample;
    const adjustedPenalty = b.penalty * penaltyWeight;
    const score = clamp((adjustedPositive + adjustedPenalty) * modifier, 0, 100);
    return {
      score,
      displayScore: clamp(Math.round(72 + (score / 65) * 27), 60, 99),
      sample,
      modifier,
      penaltyWeight,
      positive,
      adjustedPositive,
      adjustedPenalty,
      ...b
    };
  }
  function divisionScore(f, division){ return divisionScoreParts(f, division).score; }
  function divisionRows(division){
    const target = targetDivision(division);
    if(division === 'All') return allRows().filter(f => f.gender !== 'Women');
    return allRows()
      .filter(f => divisionMatch(f, target))
      .sort((a,b) => divisionScore(b, target) - divisionScore(a, target) || num(b.totalScore) - num(a.totalScore));
  }
  function thumb(f){
    const url = DISPLAY_OVERRIDES[f.fighter]?.thumbUrl || DISPLAY_OVERRIDES[f.fighter]?.photoUrl || '';
    return `<div class="row-photo">${url ? `<img src="${url}" alt="${f.fighter} thumbnail" loading="lazy">` : fighterInitialsLocal(f.fighter)}</div>`;
  }
  function roleTag(f, division){
    const target = targetDivision(division);
    const g = guardrail(f, target);
    if(g?.tag) return g.tag;
    if(division === 'All') return DISPLAY_OVERRIDES[f.fighter]?.resumeTag || 'Division profile';
    if(primaryMatch(f, target)) return `${target} resume`;
    return `${target} crossover`;
  }
  function rowHtml(f, i, division){
    const parts = divisionScoreParts(f, division);
    return `<article class="row clean-row fighter-row division-row" data-fighter="${f.fighter}" data-division-score="${round1(parts.score)}"><div class="rank">#${i + 1}</div>${thumb(f)}<div class="row-main"><div class="name">${f.fighter}</div><div class="meta">${f.ufcRecord || ''} · ${f.primaryDivision || ''}${f.secondaryDivision ? ' / ' + f.secondaryDivision : ''}</div><div class="resume-tag">${roleTag(f, division)}</div></div><div class="division-score"><strong>${parts.displayScore}</strong><small>DIV OVR</small></div></article>`;
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
    setDivisionHeading('UFC Division Boards', 'Fluid division-only rankings using live categories, Apex Peak, loss context, and division sample guardrails.');
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
    setDivisionHeading(`${division} All-Time Rankings`, 'Fluid UFC-only division résumé. Category edits and Apex changes move the board; guardrails only limit cross-division sample size.');
    el('divisionList').innerHTML = rows.map((r,i)=>rowHtml(r,i,division)).join('') || '<div class="notice">No fighters are loaded for this division yet.</div>';
    document.querySelectorAll(`#divisionList .fighter-row`).forEach(row => row.addEventListener('click', () => openFighter(row.dataset.fighter)));
  };
  window.UFC_DIVISION_RANKINGS = { version: VERSION, mode: 'fluid-division-score-with-apex-peak', weights: SCORE_WEIGHTS, baseMax: BASE_MAX, guardrails: DIVISION_GUARDRAILS, scoreParts: divisionScoreParts };
  if(typeof window.renderDivision === 'function') window.renderDivision();
})();
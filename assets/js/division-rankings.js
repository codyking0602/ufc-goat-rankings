// Division Rankings: clean UFC-only division boards with Apex Peak included.
(function(){
  const DATA = window.RANKING_DATA;
  const VERSION = 'division-rankings-20260707g-canonical-photos-only';
  if(!DATA) return;

  const DIVISION_ORDER = ['Heavyweight','Light Heavyweight','Middleweight','Welterweight','Lightweight','Featherweight','Bantamweight','Flyweight'];

  const SCORE_WEIGHTS = { championship:35, primeDominance:25, opponentQuality:25, longevity:10 };
  const BASE_MAX = { championship:30, primeDominance:30, opponentQuality:25, longevity:15 };

  const DIVISION_GUARDRAILS = {
    'Heavyweight': {
      'Stipe Miocic': { sample:1.00, modifier:1.05, tag:'HW benchmark resume' },
      'Cain Velasquez': { sample:1.00, modifier:1.06, tag:'Peak HW dominance' },
      'Randy Couture': { sample:1.00, modifier:0.88, tag:'Historic HW title resume' },
      'Daniel Cormier': { sample:0.84, modifier:1.03, tag:'Short elite HW run' },
      'Francis Ngannou': { sample:1.00, modifier:1.00, tag:'HW peak threat' },
      'Jon Jones': { sample:0.32, modifier:1.00, tag:'Small HW sample' }
    },
    'Light Heavyweight': {
      'Jon Jones': { sample:1.00, modifier:1.04, tag:'LHW benchmark resume' },
      'Daniel Cormier': { sample:0.90, modifier:1.02, tag:'Elite LHW resume' },
      'Chuck Liddell': { sample:1.00, modifier:1.04, tag:'Classic LHW title era' },
      'Alex Pereira': { sample:0.72, modifier:1.00, tag:'Fast-rising LHW title run' },
      'Randy Couture': { sample:0.62, modifier:0.95, tag:'Real but split resume' },
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
      'Dustin Poirier': { sample:0.94, modifier:1.00, tag:'Elite LW resume' },
      'Frankie Edgar': { sample:0.72, modifier:1.00, tag:'LW title reign' },
      'Max Holloway': { sample:0.30, modifier:1.00, tag:'LW crossover resume' },
      'Justin Gaethje': { sample:1.00, modifier:1.00, tag:'Elite LW title resume' },
      'Conor McGregor': { sample:0.55, modifier:1.00, tag:'LW title peak' },
      'Alexander Volkanovski': { sample:0.18, modifier:1.00, tag:'LW challenger context' },
      'Ilia Topuria': { sample:0.35, modifier:1.00, tag:'Current-table LW context' }
    },
    'Featherweight': {
      'Alexander Volkanovski': { sample:1.00, modifier:1.03, tag:'FW benchmark resume' },
      'Jose Aldo': { sample:0.86, modifier:1.03, tag:'UFC-only FW title resume' },
      'Max Holloway': { sample:0.82, modifier:1.00, tag:'Elite FW title resume' },
      'Ilia Topuria': { sample:0.82, modifier:1.00, tag:'Current FW title peak' },
      'Conor McGregor': { sample:0.72, modifier:1.00, tag:'FW title peak' },
      'Dustin Poirier': { sample:0.25, modifier:1.00, tag:'Early FW resume' },
      'Frankie Edgar': { sample:0.42, modifier:1.00, tag:'FW contender resume' },
      'Aljamain Sterling': { sample:0.22, modifier:1.00, tag:'FW extension' }
    },
    'Bantamweight': {
      'Aljamain Sterling': { sample:0.92, modifier:1.03, tag:'BW title resume leader' },
      'Dominick Cruz': { sample:1.00, modifier:1.00, tag:'UFC-only BW standard' },
      'T.J. Dillashaw': { sample:0.95, modifier:0.98, tag:'Two-time BW champion' },
      'Merab Dvalishvili': { sample:1.00, modifier:1.00, tag:'Modern BW title run' },
      'Petr Yan': { sample:1.00, modifier:1.00, tag:'Elite BW resume' },
      'Henry Cejudo': { sample:0.62, modifier:1.00, tag:'BW title win context' },
      'Jose Aldo': { sample:0.35, modifier:1.00, tag:'Late BW contender run' },
      'Frankie Edgar': { sample:0.12, modifier:1.00, tag:'Late BW context' }
    },
    'Flyweight': {
      'Demetrious Johnson': { sample:1.00, modifier:1.04, tag:'FLW benchmark resume' },
      'Henry Cejudo': { sample:0.78, modifier:1.00, tag:'FLW title/rivalry resume' }
    }
  };

  const CANONICAL_DIVISIONS = {
    'heavyweight':'Heavyweight','light heavyweight':'Light Heavyweight','middleweight':'Middleweight','welterweight':'Welterweight','lightweight':'Lightweight','featherweight':'Featherweight','bantamweight':'Bantamweight','flyweight':'Flyweight',
    'lhw':'Light Heavyweight','hw':'Heavyweight','mw':'Middleweight','ww':'Welterweight','lw':'Lightweight','fw':'Featherweight','bw':'Bantamweight','flw':'Flyweight'
  };

  function injectCss(){
    const existing = document.getElementById('division-rankings-css');
    if(existing) existing.remove();
    const style = document.createElement('style');
    style.id = 'division-rankings-css';
    style.textContent = `
      .division-leader-shell{display:grid;gap:14px;margin-bottom:18px}
      .division-leader-controls{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;align-items:center}
      .division-leader-pill{border:1px solid var(--line);background:var(--panel);color:var(--text);padding:10px 12px;border-radius:999px;cursor:pointer;font-weight:850;line-height:1.1;min-height:42px;text-align:center}
      .division-leader-pill.active{background:var(--accent2);border-color:var(--accent2);color:#111827}
      .division-leader-summary{border:1px solid rgba(250,204,21,.28);background:rgba(18,23,34,.94);border-radius:16px;padding:12px 14px;color:var(--text);line-height:1.38}
      .division-leader-summary strong{color:var(--accent2)}
      .division-row{grid-template-columns:54px 64px minmax(0,1fr)!important;cursor:pointer}
      .division-row .score,.division-row .division-score,.division-row .watch-moment-pill,.division-row .watch-moment-link{display:none!important}
      .division-row .row-photo{overflow:hidden;display:flex;align-items:center;justify-content:center}
      .division-row .row-photo img{width:100%;height:100%;object-fit:cover;display:block}
      .division-context{margin-top:6px;color:var(--muted);font-size:12px;line-height:1.35}
      @media(max-width:1100px){.division-leader-controls{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:900px){.division-leader-controls{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.division-leader-pill{width:100%;min-width:0;min-height:40px;padding:9px 10px;font-size:12px}.division-leader-summary{font-size:13px;padding:11px 12px}.division-row{grid-template-columns:34px 58px minmax(0,1fr)!important}}
    `;
    document.head.appendChild(style);
  }

  function el(id){ return document.getElementById(id); }
  function clean(s){ return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(); }
  function canonicalDivisionName(s){ return CANONICAL_DIVISIONS[clean(s)] || String(s || '').trim(); }
  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
  function num(value){ const n = Number(value || 0); return Number.isFinite(n) ? n : 0; }
  function escapeHtml(s){ return String(s || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function fighterInitialsLocal(name){ return String(name || '').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase(); }
  function displayFor(f){ const display = (typeof window.DISPLAY_OVERRIDES !== 'undefined' && window.DISPLAY_OVERRIDES) ? window.DISPLAY_OVERRIDES : {}; return display[f.fighter] || f.display || {}; }
  function full(row){
    if(typeof fullRow === 'function') return fullRow(row);
    const profile = (DATA.fighters || []).find(f => f.fighter === row.fighter) || {};
    return {...profile, ...row, display: {...(profile.display || {}), ...(row.display || {})}};
  }
  function allRows(){
    const boards = [...(DATA.men || [])];
    const names = new Set(boards.map(r => r.fighter));
    (DATA.fighters || []).filter(f => f.gender === 'Men' || f.leaderboard === 'men').forEach(f => names.add(f.fighter));
    return [...names].map(name => full(boards.find(r => r.fighter === name) || {fighter:name})).filter(f => f.gender !== 'Women' && f.leaderboard !== 'women');
  }
  function divisionsFor(f){
    const raw = [f.primaryDivision, f.secondaryDivision, f.division, f.weightClass].filter(Boolean).join(' / ');
    return raw.split(/\/|,| and /i).map(x => canonicalDivisionName(x.trim())).filter(Boolean);
  }
  function targetDivision(division){ return canonicalDivisionName(division); }
  function primaryMatch(f, division){ return canonicalDivisionName(f.primaryDivision) === targetDivision(division); }
  function guardrail(f, division){ return DIVISION_GUARDRAILS[targetDivision(division)]?.[f.fighter] || null; }
  function sampleShare(f, division){ const g = guardrail(f, division); if(g && typeof g.sample === 'number') return clamp(g.sample, 0, 1); return primaryMatch(f, division) ? 1 : 0; }
  function divisionMatch(f, division){
    if(division === 'All') return true;
    if(f.gender === 'Women' || f.leaderboard === 'women') return false;
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
    return { championship:weightedComponent(row,'championship'), primeDominance:weightedComponent(row,'primeDominance'), opponentQuality:weightedComponent(row,'opponentQuality'), longevity:weightedComponent(row,'longevity'), apexPeak:num(row.apexPeak), penalty:num(row.penalty) };
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
    return { score, sample, modifier, penaltyWeight, positive, adjustedPositive, adjustedPenalty, ...b };
  }
  function divisionScore(f, division){ return divisionScoreParts(f, division).score; }
  function divisionRows(division){
    const target = targetDivision(division);
    if(division === 'All') return allRows().filter(f => f.gender !== 'Women' && f.leaderboard !== 'women');
    return allRows().filter(f => divisionMatch(f, target)).sort((a,b) => divisionScore(b, target) - divisionScore(a, target) || num(b.totalScore) - num(a.totalScore));
  }
  function divisionRank(f, division){ const val = divisionScore(f, division); return 1 + divisionRows(division).filter(row => divisionScore(row, division) > val).length; }
  function photoUrlFor(f){
    const display = displayFor(f);
    return display.thumbUrl || f.display?.thumbUrl || f.thumbUrl || display.photoUrl || f.display?.photoUrl || f.photoUrl || '';
  }
  function thumb(f){
    const url = photoUrlFor(f);
    const initials = escapeHtml(fighterInitialsLocal(f.fighter));
    const name = escapeHtml(f.fighter);
    if(!url) return `<div class="row-photo">${initials}</div>`;
    return `<div class="row-photo"><img src="${escapeHtml(url)}" alt="${name} profile photo" loading="lazy" onerror="this.parentElement.textContent='${initials}'"></div>`;
  }
  function roleTag(f, division){
    const target = targetDivision(division);
    const g = guardrail(f, target);
    if(g?.tag) return g.tag;
    const display = displayFor(f);
    if(division === 'All') return display.resumeTag || f.resumeTag || 'Division profile';
    if(primaryMatch(f, target)) return `${target} resume`;
    return `${target} crossover`;
  }
  function rowHtml(f, division){
    const display = displayFor(f);
    const divisions = `${f.primaryDivision || ''}${f.secondaryDivision ? ' / ' + f.secondaryDivision : ''}`;
    const overallRank = display.allTimeRank || f.rank || '—';
    return `<article class="row fighter-row division-row" role="button" tabindex="0" data-fighter="${escapeHtml(f.fighter)}"><div class="rank">#${divisionRank(f, division)}</div>${thumb(f)}<div class="row-main"><div class="name">${escapeHtml(f.fighter)}</div><div class="meta">Overall #${overallRank} · ${escapeHtml(f.ufcRecord || '')}${divisions ? ' · ' + escapeHtml(divisions) : ''}</div><div class="division-context">${escapeHtml(roleTag(f, division))}</div></div></article>`;
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
    divisions.forEach(d => { const opt = document.createElement('option'); opt.value = d; opt.textContent = d; select.appendChild(opt); });
    select.value = divisions.includes(current) ? current : 'All';
    select.dataset.menDivisionOrder = signature;
  }
  function divisionControlsHtml(activeDivision){ return `<div class="division-leader-controls">${availableDivisions().map(division => `<button type="button" class="division-leader-pill ${division === activeDivision ? 'active' : ''}" data-division-pick="${division}">${division}</button>`).join('')}</div>`; }
  function renderShell(activeDivision, innerHtml){
    const selected = activeDivision === 'All' ? '' : activeDivision;
    const rows = selected ? divisionRows(selected) : [];
    const summary = selected ? `<strong>${selected} · Men</strong><br>Top UFC resumes in this division. Showing ${rows.length} fighters.` : `<strong>Pick a division</strong><br>See the top UFC resumes by weight class.`;
    el('divisionList').innerHTML = `<div class="division-leader-shell">${divisionControlsHtml(selected)}<div class="division-leader-summary">${summary}</div>${innerHtml || ''}</div>`;
    document.querySelectorAll('[data-division-pick]').forEach(card => card.addEventListener('click', () => { el('divisionFilter').value = card.dataset.divisionPick; window.renderDivision(); }));
  }
  function renderDivisionHub(){ setDivisionHeading('Division Boards', 'See the top fighters by division.'); renderShell('All', ''); }
  function openDivisionFighter(name){ if(!name) return; if(typeof window.openFighter === 'function') { window.openFighter(name); return; } if(typeof openFighter === 'function') openFighter(name); }
  function installDivisionCardClicks(){
    const list = el('divisionList');
    if(!list || list.dataset.divisionClickHandler === VERSION) return;
    list.dataset.divisionClickHandler = VERSION;
    list.addEventListener('click', event => { const row = event.target.closest('.division-row'); if(!row || event.target.closest('a, button')) return; openDivisionFighter(row.dataset.fighter); });
    list.addEventListener('keydown', event => { if(event.key !== 'Enter' && event.key !== ' ') return; const row = event.target.closest('.division-row'); if(!row) return; event.preventDefault(); openDivisionFighter(row.dataset.fighter); });
  }
  window.renderDivision = function(){
    injectCss();
    installDivisionCardClicks();
    normalizeDivisionSelect();
    const division = el('divisionFilter').value;
    if(division === 'All'){ renderDivisionHub(); return; }
    const rows = divisionRows(division);
    setDivisionHeading(`${division} Rankings`, 'See the top fighters by division.');
    const list = `<div class="leaderboard">${rows.map(r=>rowHtml(r,division)).join('') || '<div class="notice">No fighters are loaded for this division yet.</div>'}</div>`;
    renderShell(division, list);
  };
  window.UFC_DIVISION_RANKINGS = { version: VERSION, mode:'clean-fluid-division-score-with-apex-peak-canonical-photo-only', weights:SCORE_WEIGHTS, baseMax:BASE_MAX, guardrails:DIVISION_GUARDRAILS, scoreParts:divisionScoreParts };
  if(typeof window.renderDivision === 'function') window.renderDivision();
})();

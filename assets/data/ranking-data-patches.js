// Lightweight post-load status hook plus Jon-first profile data/package hotfix.
// Durable fighter scoring remains in source files. This patch only controls profile presentation until consolidated into app.js.

(function () {
  const data = window.RANKING_DATA;
  const PATCH_VERSION = 'jon-profile-package-2026-07-01d';

  const JON_PROFILE_STATS = {
    ufcRecord: '22-1, 1 NC',
    titleFightWins: 16,
    eliteWins: 10,
    primeRecord: '16-0, 1 NC',
    finishRatePct: 52.2,
    roundsWonPct: 90.4,
    activeEliteYears: 10.82,
    timesFinishedPrime: 0
  };

  const JON_OPPONENT_PRIORITY = {
    'Daniel Cormier': 1,
    'Mauricio Rua': 2,
    'Ciryl Gane': 3,
    'Rashad Evans': 4,
    'Rampage Jackson': 5,
    'Quinton Jackson': 5,
    'Alexander Gustafsson': 6,
    'Glover Teixeira': 7,
    'Lyoto Machida': 8,
    'Ryan Bader': 9,
    'Stipe Miocic': 10,
    'Vitor Belfort': 11,
    'Dominick Reyes': 12,
    'Thiago Santos': 13,
    'Anthony Smith': 14,
    'Chael Sonnen': 15,
    'Ovince Saint Preux': 16,
    'Brandon Vera': 17,
    'Vladimir Matyushenko': 18,
    'Stephan Bonnar': 19,
    "Jake O'Brien": 20,
    'Andre Gusmao': 21
  };

  function refreshStatus() {
    window.UFC_PHASE2_DATA_STATUS = {
      version: PATCH_VERSION,
      mode: 'source-clean-jon-profile-package',
      petrYanInMen: !!(data && Array.isArray(data.men) && data.men.some(f => f.fighter === 'Petr Yan')),
      petrYanInProfiles: !!(data && Array.isArray(data.fighters) && data.fighters.some(f => f.fighter === 'Petr Yan')),
      jonProfileStats: !!(data && Array.isArray(data.fighters) && data.fighters.some(f => f.fighter === 'Jon Jones' && f.snapshotStats)),
      appliedAt: new Date().toISOString()
    };
    document.documentElement.setAttribute('data-phase2-data-patch', PATCH_VERSION);
  }

  function cleanOpponentName(name) {
    return String(name || '').replace(/\s+\d+$/, '').trim();
  }

  function cleanNumberText(v) {
    if (v === null || v === undefined || v === '') return '—';
    const n = Number(String(v).replace(/[^0-9.\-]/g, ''));
    if (Number.isFinite(n)) return Number.isInteger(n) ? String(n) : String(Number(n.toFixed(1)));
    return String(v).replace(/\.$/, '');
  }

  function pctText(v) {
    return v === null || v === undefined || v === '' || !Number.isFinite(Number(v)) ? '—' : `${Number(v).toFixed(1)}%`;
  }

  function fmtText(v) {
    if (v === null || v === undefined || v === '') return '—';
    const n = Number(v);
    return Number.isFinite(n) ? String(Number(n.toFixed(2))) : String(v);
  }

  function opponentPriority(row) {
    const name = cleanOpponentName(row?.opponent);
    if (row?.displayPriority) return Number(row.displayPriority);
    if (row?.opponentStrengthScore) return 1000 - Number(row.opponentStrengthScore);
    if (JON_OPPONENT_PRIORITY[name]) return JON_OPPONENT_PRIORITY[name];
    const credit = Number(row?.credit || 0);
    return 500 - (credit * 10);
  }

  function sortRowsByOpponentStrength(rows) {
    return [...(rows || [])].sort((a, b) => {
      const pa = opponentPriority(a);
      const pb = opponentPriority(b);
      if (pa !== pb) return pa - pb;
      return Number(b?.credit || 0) - Number(a?.credit || 0);
    });
  }

  function applyJonProfilePackage() {
    if (!data || typeof DISPLAY_OVERRIDES === 'undefined') return;
    const jon = data.fighters?.find(f => f.fighter === 'Jon Jones');
    if (jon) {
      jon.snapshotStats = { ...JON_PROFILE_STATS };
      jon.primeRecord = JON_PROFILE_STATS.primeRecord;
      jon.roundsWonPct = JON_PROFILE_STATS.roundsWonPct;
      jon.eliteWins = JON_PROFILE_STATS.eliteWins;
      jon.timesFinishedPrime = JON_PROFILE_STATS.timesFinishedPrime;
      jon.opponents?.forEach(row => {
        const name = cleanOpponentName(row.opponent);
        if (JON_OPPONENT_PRIORITY[name]) {
          row.displayPriority = JON_OPPONENT_PRIORITY[name];
          row.opponentStrengthScore = 101 - JON_OPPONENT_PRIORITY[name];
        }
      });
      jon.rounds?.forEach(row => {
        const name = cleanOpponentName(row.opponent);
        if (JON_OPPONENT_PRIORITY[name]) {
          row.displayPriority = JON_OPPONENT_PRIORITY[name];
          row.opponentStrengthScore = 101 - JON_OPPONENT_PRIORITY[name];
        }
      });
    }

    const o = DISPLAY_OVERRIDES['Jon Jones'];
    if (o) {
      o.snapshotStats = { ...JON_PROFILE_STATS };
      o.snapshot = [
        ['UFC Record', JON_PROFILE_STATS.ufcRecord],
        ['UFC Title-Fight Wins', String(JON_PROFILE_STATS.titleFightWins)],
        ['Elite / Top-5 Wins', String(JON_PROFILE_STATS.eliteWins)],
        ['Prime Record', JON_PROFILE_STATS.primeRecord],
        ['Finish Rate', pctText(JON_PROFILE_STATS.finishRatePct)],
        ['Rounds Won', pctText(JON_PROFILE_STATS.roundsWonPct)],
        ['Active Elite Years', fmtText(JON_PROFILE_STATS.activeEliteYears)],
        ['Times Finished in Prime', String(JON_PROFILE_STATS.timesFinishedPrime)]
      ];
      o.photoPosition = o.photoPosition || 'center top';
    }
  }

  function injectTemplateFixCss() {
    if (document.getElementById('template-polish-hotfix-css')) return;
    const style = document.createElement('style');
    style.id = 'template-polish-hotfix-css';
    style.textContent = `
      .row.clean-row { grid-template-columns:54px 64px minmax(0,1fr) 96px !important; overflow:hidden !important; }
      .row.clean-row .row-photo { width:64px !important; height:64px !important; min-width:64px !important; max-width:64px !important; aspect-ratio:1/1 !important; position:relative !important; overflow:hidden !important; border-radius:16px !important; grid-column:auto !important; grid-row:auto !important; }
      .row.clean-row .row-photo img { position:absolute !important; inset:0 !important; width:100% !important; height:100% !important; max-width:100% !important; max-height:100% !important; object-fit:cover !important; object-position:center 10% !important; display:block !important; transform:none !important; }
      .fighter-photo-img { object-position: var(--fighter-photo-position, center top) !important; }
      .row.clean-row .score { display:grid !important; justify-items:end !important; gap:2px !important; line-height:1 !important; text-align:right !important; }
      .row.clean-row .score strong { font-size:26px !important; line-height:.9 !important; letter-spacing:-.03em !important; }
      .row.clean-row .score .meta { display:block !important; margin:0 !important; font-size:11px !important; letter-spacing:.08em !important; text-transform:uppercase !important; }
      @media (max-width:900px){
        .row.clean-row { grid-template-columns:34px 58px minmax(0,1fr) 70px !important; }
        .row.clean-row .row-photo { width:58px !important; height:58px !important; min-width:58px !important; max-width:58px !important; border-radius:15px !important; }
        .row.clean-row .score strong { font-size:21px !important; }
        .row.clean-row .score .meta { font-size:10px !important; }
      }
    `;
    document.head.appendChild(style);
  }

  window.titleFightWinsFromNotes = function(title) {
    const match = String(title?.notes || '').match(/Total title fight wins\s*=\s*([0-9]+(?:\.[0-9]+)?)/);
    return match ? cleanNumberText(match[1]) : null;
  };

  window.roundControlText = function(f) {
    const stats = f?.snapshotStats || DISPLAY_OVERRIDES?.[f?.fighter]?.snapshotStats;
    if (stats?.roundsWonPct !== undefined) return pctText(stats.roundsWonPct);
    const candidates = [f.roundsWonPct, f.roundsWonPercentage, f.roundWinPct, f.roundsWonPercent];
    const val = candidates.find(x => x !== undefined && x !== null && Number.isFinite(Number(x)));
    return val !== undefined ? pctText(val) : null;
  };

  window.lossImpactText = function(f) {
    const penalty = lossPenaltyValue(f);
    if (f.fighter === 'Jon Jones') return 'No true competitive loss';
    if (penalty === 0) return 'Clean loss context';
    if (penalty <= -3) return 'Meaningful loss drag';
    return 'Small contextual drag';
  };

  function overrideSnapshotMap(f) {
    const map = {};
    (DISPLAY_OVERRIDES[f.fighter]?.snapshot || []).forEach(([label, value]) => { map[label] = value; });
    return map;
  }

  function standardSnapshotClean(f) {
    const o = overrideSnapshotMap(f);
    const stats = f.snapshotStats || DISPLAY_OVERRIDES[f.fighter]?.snapshotStats || {};
    return [
      ['UFC Record', stats.ufcRecord || f.ufcRecord || o['UFC Record'] || '—'],
      ['UFC Title-Fight Wins', cleanNumberText(stats.titleFightWins ?? o['UFC Title-Fight Wins'] ?? titleFightWinsFromNotes(f.title || {}))],
      ['Elite / Top-5 Wins', cleanNumberText(stats.eliteWins ?? o['Elite / Top-5 Wins'] ?? o['Elite Wins'] ?? f.eliteWins)],
      ['Prime Record', stats.primeRecord || o['Prime Record'] || primeRecordText(f) || '—'],
      ['Finish Rate', pctText(stats.finishRatePct ?? f.finishRatePct)],
      ['Rounds Won', pctText(stats.roundsWonPct ?? f.roundsWonPct)],
      ['Active Elite Years', fmtText(stats.activeEliteYears ?? f.activeEliteYears)],
      ['Times Finished in Prime', cleanNumberText(stats.timesFinishedPrime ?? f.timesFinishedPrime ?? 0)]
    ];
  }

  function rowPhotoClean(f) {
    const url = thumbUrlFor(f);
    const shellStyle = 'width:64px;height:64px;min-width:64px;max-width:64px;position:relative;overflow:hidden;border-radius:16px;';
    const imgStyle = 'position:absolute;inset:0;width:100%;height:100%;max-width:100%;max-height:100%;object-fit:cover;object-position:center 10%;display:block;';
    return `<div class="row-photo" style="${shellStyle}">${url ? `<img src="${url}" alt="${f.fighter} thumbnail" loading="lazy" style="${imgStyle}">` : fighterInitials(f.fighter)}</div>`;
  }

  function renderFighterRowClean(r, rankOverride = null, tagOverride = null) {
    const rank = rankOverride || r.rank || '—';
    const tag = tagOverride || resumeTagFor(r);
    return `<article class="row clean-row fighter-row" data-fighter="${r.fighter}">
      <div class="rank">#${rank}</div>
      ${rowPhotoClean(r)}
      <div class="row-main"><div class="name">${r.fighter}</div><div class="meta">${r.ufcRecord || ''} · ${r.primaryDivision || ''}${r.secondaryDivision ? ' / ' + r.secondaryDivision : ''}</div><div class="resume-tag">${tag}</div></div>
      <div class="score"><strong>${overallOvr(r)}</strong><span class="meta">OVR</span></div>
    </article>`;
  }

  window.rowsTable = function(rows, cols, max = 18) {
    const labels = cols.map(c => c.label).join('|');
    const shouldSort = labels.includes('Opponent') && (labels.includes('Context') || labels.includes('Rounds Won'));
    const sorted = shouldSort ? sortRowsByOpponentStrength(rows) : [...(rows || [])];
    const body = sorted.slice(0, max).map(r => `<tr>${cols.map(c => `<td>${r[c.key] ?? ''}</td>`).join('')}</tr>`).join('');
    return `<table class="table"><thead><tr>${cols.map(c => `<th>${c.label}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table>${sorted.length > max ? `<p class="meta">Showing first ${max} of ${sorted.length} rows.</p>` : ''}`;
  };

  window.renderList = function(containerId, rows) {
    const q = el('search').value.trim().toLowerCase();
    const div = el('divisionFilter').value;
    const filtered = rows.map(fullRow).filter(r => {
      const textHit = !q || r.fighter.toLowerCase().includes(q);
      const divs = [r.primaryDivision, r.secondaryDivision].join(' ').toLowerCase();
      const divHit = div === 'All' || divs.includes(div.toLowerCase());
      return textHit && divHit;
    });
    el(containerId).innerHTML = filtered.map(r => renderFighterRowClean(r)).join('') || '<div class="notice">No fighters match that filter.</div>';
    document.querySelectorAll(`#${containerId} .row`).forEach(row => row.addEventListener('click', () => openFighter(row.dataset.fighter)));
  };

  window.renderDivision = function() {
    const div = el('divisionFilter').value;
    const rows = data.fighters.filter(f => f.gender === 'Men').map(f => fullRow(data.men.find(x => x.fighter === f.fighter) || { fighter: f.fighter, totalScore: f.totalScore }))
      .filter(f => div === 'All' || [f.primaryDivision, f.secondaryDivision].join(' ').toLowerCase().includes(div.toLowerCase()))
      .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
    el('divisionList').innerHTML = `<div class="notice">Prototype note: this is a division filter using the current P4P score. True division-only scoring will use division-specific fight rows next.</div>`;
    el('divisionList').innerHTML += rows.map((r, i) => renderFighterRowClean(r, i + 1, div === 'All' ? resumeTagFor(r) : `${div} view`)).join('');
    document.querySelectorAll(`#divisionList .row`).forEach(row => row.addEventListener('click', () => openFighter(row.dataset.fighter)));
  };

  const originalOpenFighter = window.openFighter || openFighter;
  window.openFighter = function(name) {
    originalOpenFighter(name);
    const f = fullRow((data.men.find(x => x.fighter === name) || data.women.find(x => x.fighter === name) || { fighter: name }));
    const override = DISPLAY_OVERRIDES[f.fighter] || {};
    const img = document.querySelector('#fighterDetail .fighter-photo-img');
    if (img && override.photoPosition) img.style.objectPosition = override.photoPosition;
    const snapshotCard = Array.from(document.querySelectorAll('#fighterDetail .card')).find(card => card.querySelector('h3')?.textContent === 'Resume Snapshot');
    if (snapshotCard) snapshotCard.innerHTML = `<h3>Resume Snapshot</h3>${snapshotGrid(standardSnapshotClean(f))}`;
  };

  window.UFC_RANKING_DATA_PATCHES_V1 = {
    meta: {
      purpose: 'Jon-first profile package and table sorting hotfix',
      note: 'Presentation-only: real Jon snapshot stats, opponent-strength sorting, thumbnail containment, and status metadata.',
      updated: '2026-07-01',
      version: PATCH_VERSION
    },
    apply: refreshStatus
  };

  applyJonProfilePackage();
  injectTemplateFixCss();
  refreshStatus();
  if (typeof refresh === 'function') refresh();

  window.UFC_PHASE2_DATA_REFRESH = refreshStatus;
})();

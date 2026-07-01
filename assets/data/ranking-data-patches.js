// Lightweight post-load status hook plus template polish hotfix.
// Durable fighter data remains in source files. This only patches presentation after app load.

(function () {
  const data = window.RANKING_DATA;
  const PATCH_VERSION = 'template-polish-hotfix-2026-07-01b';

  function refreshStatus() {
    window.UFC_PHASE2_DATA_STATUS = {
      version: PATCH_VERSION,
      mode: 'source-clean-template-hotfix',
      petrYanInMen: !!(data && Array.isArray(data.men) && data.men.some(f => f.fighter === 'Petr Yan')),
      petrYanInProfiles: !!(data && Array.isArray(data.fighters) && data.fighters.some(f => f.fighter === 'Petr Yan')),
      appliedAt: new Date().toISOString()
    };
    document.documentElement.setAttribute('data-phase2-data-patch', PATCH_VERSION);
  }

  function injectTemplateFixCss() {
    if (document.getElementById('template-polish-hotfix-css')) return;
    const style = document.createElement('style');
    style.id = 'template-polish-hotfix-css';
    style.textContent = `
      .row.clean-row { grid-template-columns:54px 64px minmax(0,1fr) 96px !important; overflow:hidden !important; }
      .row.clean-row .row-photo { width:64px !important; height:64px !important; min-width:64px !important; max-width:64px !important; aspect-ratio:1/1 !important; position:relative !important; overflow:hidden !important; border-radius:16px !important; grid-column:auto !important; grid-row:auto !important; }
      .row.clean-row .row-photo img { position:absolute !important; inset:0 !important; width:100% !important; height:100% !important; max-width:100% !important; max-height:100% !important; object-fit:cover !important; object-position:center 10% !important; display:block !important; transform:none !important; }
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

  function cleanNumberText(v) {
    if (v === null || v === undefined || v === '') return '—';
    const n = Number(String(v).replace(/[^0-9.\-]/g, ''));
    if (Number.isFinite(n)) return Number.isInteger(n) ? String(n) : String(Number(n.toFixed(1)));
    return String(v).replace(/\.$/, '');
  }

  window.titleFightWinsFromNotes = function(title) {
    const match = String(title?.notes || '').match(/Total title fight wins\s*=\s*([0-9]+(?:\.[0-9]+)?)/);
    return match ? cleanNumberText(match[1]) : null;
  };

  window.roundControlText = function(f) {
    const candidates = [f.roundsWonPct, f.roundsWonPercentage, f.roundWinPct, f.roundsWonPercent];
    const val = candidates.find(x => x !== undefined && x !== null && Number.isFinite(Number(x)));
    return val !== undefined ? pct(Number(val)) : null;
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

  function eliteWinsTextClean(f) {
    const o = overrideSnapshotMap(f);
    if (o['Elite Wins']) return o['Elite Wins'];
    if (o['Quality Wins']) return o['Quality Wins'];
    const opps = f.opponents || [];
    const full = opps.filter(o => Number(o.credit || 0) >= 1).length;
    if (full) return `${full} elite wins`;
    const raw = rawCreditTotal(opps);
    if (raw) return `${cleanNumberText(raw)} quality-win credit`;
    return '—';
  }

  function titleFightWinsTextClean(f) {
    const title = f.title || {};
    const noteWins = titleFightWinsFromNotes(title);
    if (noteWins) return noteWins;
    const vals = ['normalTitleWins','interimTitleWins','vacantUndisputedWins','secondDivisionUndisputedWins','vacantSecondDivisionWins'].map(k => Number(title?.[k] || 0));
    const total = vals.reduce((a, b) => a + b, 0);
    return total ? cleanNumberText(total) : '—';
  }

  function standardSnapshotClean(f) {
    const o = overrideSnapshotMap(f);
    return [
      ['UFC Record', ufcRecordLine(f)],
      ['UFC Title-Fight Wins', titleFightWinsTextClean(f)],
      ['Elite Wins', eliteWinsTextClean(f)],
      ['Prime Record', o['Prime Record'] || primeRecordText(f) || 'Context below'],
      ['Finish Rate', pct(f.finishRatePct)],
      ['Rounds Won', roundControlText(f) || 'Context below'],
      ['Active Elite Years', fmt(f.activeEliteYears)],
      ['Loss Context', o['Loss Context'] || lossImpactText(f)]
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
    const snapshotCard = document.querySelector('#fighterDetail .profile-main-flow .card, #fighterDetail .card');
    if (snapshotCard && snapshotCard.querySelector('h3')?.textContent === 'Resume Snapshot') {
      snapshotCard.innerHTML = `<h3>Resume Snapshot</h3>${snapshotGrid(standardSnapshotClean(f))}`;
    }
  };

  window.UFC_RANKING_DATA_PATCHES_V1 = {
    meta: {
      purpose: 'Post-materialization status hook and template polish hotfix',
      note: 'Presentation-only: thumbnail containment, cleaner snapshot values, and status metadata.',
      updated: '2026-07-01',
      version: PATCH_VERSION
    },
    apply: refreshStatus
  };

  injectTemplateFixCss();
  refreshStatus();
  if (typeof refresh === 'function') refresh();

  window.UFC_PHASE2_DATA_REFRESH = refreshStatus;
})();

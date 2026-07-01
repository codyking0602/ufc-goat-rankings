// Live presentation patch. Durable fighter scoring remains in ranking-data.js.
(function(){
  const DATA = window.RANKING_DATA;
  const PATCH_VERSION = 'live-template-jon-package-20260701e';
  if(!DATA || typeof DISPLAY_OVERRIDES === 'undefined') return;

  const CATEGORY_INFO_LIVE = [
    ['championship','Title Reign','Title wins, reign strength, division control'],
    ['opponentQuality','Quality Wins','Who he beat, when he beat them, and division strength'],
    ['primeDominance','Prime Dominance','Rounds, finishes, separation, durability'],
    ['longevity','Elite Longevity','Active elite UFC years, not calendar padding'],
    ['penalty','Loss Context','Losses adjusted for timing, opponent, finish, and division']
  ];

  const JON_STATS = {
    ufcRecord:'22-1, 1 NC',
    titleFightWins:16,
    eliteWins:10,
    primeRecord:'16-0, 1 NC',
    finishRatePct:52.2,
    roundsWonPct:90.4,
    activeEliteYears:10.82,
    timesFinishedPrime:0
  };

  const JON_PRIORITY = {
    'Daniel Cormier':1,'Mauricio Rua':2,'Ciryl Gane':3,'Rashad Evans':4,'Rampage Jackson':5,'Quinton Jackson':5,
    'Alexander Gustafsson':6,'Glover Teixeira':7,'Lyoto Machida':8,'Ryan Bader':9,'Stipe Miocic':10,'Vitor Belfort':11,
    'Dominick Reyes':12,'Thiago Santos':13,'Anthony Smith':14,'Chael Sonnen':15,'Ovince Saint Preux':16,'Brandon Vera':17,
    'Vladimir Matyushenko':18,'Stephan Bonnar':19,"Jake O'Brien":20,'Andre Gusmao':21
  };

  const cleanName = name => String(name || '').replace(/\s+\d+$/, '').trim();
  const pctText = n => (n === null || n === undefined || n === '' || !Number.isFinite(Number(n))) ? '—' : `${Number(n).toFixed(1)}%`;
  const fmtText = n => (n === null || n === undefined || n === '') ? '—' : (Number.isFinite(Number(n)) ? String(Number(Number(n).toFixed(2))) : String(n));
  const numText = v => {
    if(v === null || v === undefined || v === '') return '—';
    const n = Number(String(v).replace(/[^0-9.\-]/g,''));
    if(Number.isFinite(n)) return Number.isInteger(n) ? String(n) : String(Number(n.toFixed(1)));
    return String(v).replace(/\.$/,'');
  };

  function applyJon(){
    const jon = DATA.fighters?.find(f => f.fighter === 'Jon Jones');
    if(jon){
      jon.snapshotStats = {...JON_STATS};
      jon.primeRecord = JON_STATS.primeRecord;
      jon.roundsWonPct = JON_STATS.roundsWonPct;
      jon.eliteWins = JON_STATS.eliteWins;
      jon.timesFinishedPrime = JON_STATS.timesFinishedPrime;
      jon.opponents?.forEach(r => { const p = JON_PRIORITY[cleanName(r.opponent)]; if(p){ r.displayPriority = p; r.opponentStrengthScore = 101 - p; }});
      jon.rounds?.forEach(r => { const p = JON_PRIORITY[cleanName(r.opponent)]; if(p){ r.displayPriority = p; r.opponentStrengthScore = 101 - p; }});
    }
    const o = DISPLAY_OVERRIDES['Jon Jones'];
    if(o){
      o.snapshotStats = {...JON_STATS};
      o.photoPosition = o.photoPosition || 'center top';
      o.snapshot = [
        ['UFC Record', JON_STATS.ufcRecord],
        ['UFC Title-Fight Wins', String(JON_STATS.titleFightWins)],
        ['Elite / Top-5 Wins', String(JON_STATS.eliteWins)],
        ['Prime Record', JON_STATS.primeRecord],
        ['Finish Rate', pctText(JON_STATS.finishRatePct)],
        ['Rounds Won', pctText(JON_STATS.roundsWonPct)],
        ['Active Elite Years', fmtText(JON_STATS.activeEliteYears)],
        ['Times Finished in Prime', String(JON_STATS.timesFinishedPrime)]
      ];
    }
  }

  function injectCss(){
    if(document.getElementById('live-template-patch-css')) return;
    const style = document.createElement('style');
    style.id = 'live-template-patch-css';
    style.textContent = `
      .row.clean-row{grid-template-columns:54px 64px minmax(0,1fr) 96px!important;overflow:hidden!important}
      .row.clean-row .row-photo{width:64px!important;height:64px!important;min-width:64px!important;max-width:64px!important;position:relative!important;overflow:hidden!important;border-radius:16px!important}
      .row.clean-row .row-photo img{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:100%!important;max-height:100%!important;object-fit:cover!important;object-position:center 10%!important;display:block!important;transform:none!important}
      .row.clean-row .score{display:grid!important;justify-items:end!important;gap:2px!important;line-height:1!important;text-align:right!important}
      .row.clean-row .score strong{font-size:26px!important;line-height:.9!important;letter-spacing:-.03em!important}
      .row.clean-row .score .meta{display:block!important;margin:0!important;font-size:11px!important;letter-spacing:.08em!important;text-transform:uppercase!important}
      .profile-pill.tier-overall{border-color:rgba(34,197,94,.35);background:rgba(34,197,94,.08);color:#bbf7d0}
      .profile-ovr-wrap{display:flex;align-items:end;gap:12px;flex-wrap:wrap}.profile-ovr-wrap .tier-pill{margin:0 0 8px}
      .category-card strong .meta{display:inline;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
      .category-explainer h3 span{color:var(--muted);font-size:13px;font-weight:750;letter-spacing:.04em;text-transform:uppercase}
      .profile-deep-cuts{margin-top:16px}.profile-deep-cuts .card+.card,.profile-main-flow .card+.card{margin-top:12px}
      .snapshot-item strong{line-height:1.15}.snapshot-item small{display:block;margin-top:5px;line-height:1.25}
      @media(max-width:900px){.row.clean-row{grid-template-columns:34px 58px minmax(0,1fr) 70px!important}.row.clean-row .row-photo{width:58px!important;height:58px!important;min-width:58px!important;max-width:58px!important;border-radius:15px!important}.row.clean-row .score strong{font-size:21px!important}.row.clean-row .score .meta{font-size:10px!important}}
    `;
    document.head.appendChild(style);
  }

  function snapshotFor(f){
    const stats = f.snapshotStats || DISPLAY_OVERRIDES[f.fighter]?.snapshotStats || {};
    const titleWins = stats.titleFightWins ?? (typeof titleFightWinsFromNotes === 'function' ? titleFightWinsFromNotes(f.title || {}) : null);
    return [
      ['UFC Record', stats.ufcRecord || f.ufcRecord || '—'],
      ['UFC Title-Fight Wins', numText(titleWins)],
      ['Elite / Top-5 Wins', numText(stats.eliteWins ?? f.eliteWins ?? DISPLAY_OVERRIDES[f.fighter]?.snapshot?.find(x => x[0] === 'Elite / Top-5 Wins')?.[1] ?? DISPLAY_OVERRIDES[f.fighter]?.snapshot?.find(x => x[0] === 'Elite Wins')?.[1])],
      ['Prime Record', stats.primeRecord || f.primeRecord || '—'],
      ['Finish Rate', pctText(stats.finishRatePct ?? f.finishRatePct)],
      ['Rounds Won', pctText(stats.roundsWonPct ?? f.roundsWonPct)],
      ['Active Elite Years', fmtText(stats.activeEliteYears ?? f.activeEliteYears)],
      ['Times Finished in Prime', numText(stats.timesFinishedPrime ?? f.timesFinishedPrime ?? 0)]
    ];
  }

  function priority(row){
    if(row?.displayPriority) return Number(row.displayPriority);
    if(row?.opponentStrengthScore) return 1000 - Number(row.opponentStrengthScore);
    const p = JON_PRIORITY[cleanName(row?.opponent)];
    if(p) return p;
    return 500 - Number(row?.credit || 0) * 10;
  }
  function sortOpponentRows(rows){
    return [...(rows || [])].sort((a,b) => priority(a) - priority(b) || Number(b?.credit || 0) - Number(a?.credit || 0));
  }

  window.rowsTable = function(rows, cols, max=18){
    const labels = cols.map(c => c.label).join('|');
    const sorted = labels.includes('Opponent') && (labels.includes('Context') || labels.includes('Rounds Won')) ? sortOpponentRows(rows) : [...(rows || [])];
    const body = sorted.slice(0,max).map(r => `<tr>${cols.map(c => `<td>${r[c.key] ?? ''}</td>`).join('')}</tr>`).join('');
    return `<table class="table"><thead><tr>${cols.map(c => `<th>${c.label}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table>${sorted.length > max ? `<p class="meta">Showing first ${max} of ${sorted.length} rows.</p>`:''}`;
  };

  window.categoryCards = function(f){
    return CATEGORY_INFO_LIVE.map(([key,label,description]) => {
      const rating = categoryOvr(f,key);
      const rank = categoryRank(f,key);
      const tier = tierForOvr(rating);
      const width = Math.max(0, Math.min(100, rating));
      return `<button type="button" class="category-card ${tier.cls}" data-category="${key}" aria-label="Explain ${label} rating for ${f.fighter}"><span class="category-label">${label}</span><strong>${rating} <span class="meta">Rating</span></strong><small>#${rank || '—'} in category · ${description}</small><span class="tier-pill">${tier.label}</span><div class="category-bar"><i style="width:${width}%"></i></div></button>`;
    }).join('');
  };

  window.categoryExplanation = function(f,key){
    const info = CATEGORY_INFO_LIVE.find(([k]) => k === key) || [key,key,''];
    const rating = categoryOvr(f,key);
    const rank = categoryRank(f,key);
    const tier = tierForOvr(rating);
    const items = categoryEvidenceItems(f,key);
    return `<div class="category-explainer ${tier.cls}"><div class="category-explainer-kicker">${tier.label} · #${rank || '—'} in category</div><h3>${info[1]}: ${rating} <span>rating</span></h3><p><strong>What it means:</strong> ${categoryLogicSentence(f,key) || info[2]}</p><div class="category-explainer-grid">${items.map(([k,v])=>`<div class="category-explainer-item"><strong>${k}</strong><small>${v}</small></div>`).join('')}</div></div>`;
  };

  function rowPhotoClean(f){
    const url = (DISPLAY_OVERRIDES[f.fighter]?.thumbUrl || DISPLAY_OVERRIDES[f.fighter]?.photoUrl || '');
    const shell = 'width:64px;height:64px;min-width:64px;max-width:64px;position:relative;overflow:hidden;border-radius:16px;';
    const img = 'position:absolute;inset:0;width:100%;height:100%;max-width:100%;max-height:100%;object-fit:cover;object-position:center 10%;display:block;';
    return `<div class="row-photo" style="${shell}">${url ? `<img src="${url}" alt="${f.fighter} thumbnail" loading="lazy" style="${img}">` : fighterInitials(f.fighter)}</div>`;
  }
  function fighterRow(r, rankOverride=null, tagOverride=null){
    const tag = tagOverride || resumeTagFor(r);
    return `<article class="row clean-row fighter-row" data-fighter="${r.fighter}"><div class="rank">#${rankOverride || r.rank || '—'}</div>${rowPhotoClean(r)}<div class="row-main"><div class="name">${r.fighter}</div><div class="meta">${r.ufcRecord || ''} · ${r.primaryDivision || ''}${r.secondaryDivision ? ' / ' + r.secondaryDivision : ''}</div><div class="resume-tag">${tag}</div></div><div class="score"><strong>${overallOvr(r)}</strong><span class="meta">OVR</span></div></article>`;
  }
  window.renderList = function(containerId, rows){
    const q = el('search').value.trim().toLowerCase();
    const div = el('divisionFilter').value;
    const filtered = rows.map(fullRow).filter(r => (!q || r.fighter.toLowerCase().includes(q)) && (div === 'All' || [r.primaryDivision,r.secondaryDivision].join(' ').toLowerCase().includes(div.toLowerCase())));
    el(containerId).innerHTML = filtered.map(r => fighterRow(r)).join('') || '<div class="notice">No fighters match that filter.</div>';
    document.querySelectorAll(`#${containerId} .row`).forEach(row => row.addEventListener('click', () => openFighter(row.dataset.fighter)));
  };
  window.renderDivision = function(){
    const div = el('divisionFilter').value;
    const rows = DATA.fighters.filter(f => f.gender === 'Men').map(f => fullRow(DATA.men.find(x=>x.fighter===f.fighter) || {fighter:f.fighter,totalScore:f.totalScore})).filter(f => div === 'All' || [f.primaryDivision,f.secondaryDivision].join(' ').toLowerCase().includes(div.toLowerCase())).sort((a,b)=>(b.totalScore||0)-(a.totalScore||0));
    el('divisionList').innerHTML = `<div class="notice">Prototype note: this is a division filter using the current P4P score. True division-only scoring will use division-specific fight rows next.</div>` + rows.map((r,i)=>fighterRow(r,i+1,div==='All'?resumeTagFor(r):`${div} view`)).join('');
    document.querySelectorAll(`#divisionList .row`).forEach(row => row.addEventListener('click', () => openFighter(row.dataset.fighter)));
  };

  window.openFighter = function(name){
    const f = fullRow((DATA.men.find(x=>x.fighter===name) || DATA.women.find(x=>x.fighter===name) || {fighter:name}));
    const override = DISPLAY_OVERRIDES[f.fighter] || {};
    const title = f.title || {};
    const opps = f.opponents || [];
    const rounds = f.rounds || [];
    const divisionLabel = override.divisionLabel || `${f.primaryDivision || ''}${f.secondaryDivision ? ' / ' + f.secondaryDivision : ''}`;
    const rankLabel = override.allTimeRank || f.rank || '—';
    const photoUrl = override.photoUrl || '';
    const photoClass = photoUrl ? 'fighter-photo has-photo' : 'fighter-photo';
    const overallTier = tierForOvr(overallOvr(f));
    const rankedSectionTitle = Number(rankLabel) === 1 ? 'Why Not Lower?' : 'Why Not Ranked Higher?';
    const rankedSectionBody = Number(rankLabel) === 1 ? `<p>${override.whyNotLower || 'The #1 case holds because the fighters below do not match the same full blend of title volume, elite wins, longevity, and clean loss context.'}</p>` : `<p>${override.whyNotHigher || 'The ranking is showing which inputs keep the resume from climbing higher.'}</p>`;
    const keyJudgments = override.keyJudgmentCalls ? `<ul class="judgment-list">${override.keyJudgmentCalls.map(([k,v])=>`<li><strong>${k}:</strong> ${v}</li>`).join('')}</ul>` : `<p>${f.notes || 'No extra judgment-call note entered yet.'}</p>`;
    const finalTakeaway = override.finalTakeaway || `${f.fighter}'s UFC-only case is built around the balance of title success, quality wins, dominance, longevity, and loss context.`;
    el('fighterDetail').innerHTML = `<section class="profile-hero"><div class="${photoClass}">${photoUrl ? `<img src="${photoUrl}" alt="${f.fighter} profile photo" class="fighter-photo-img" style="object-position:${override.photoPosition || 'center top'}">` : `<div class="photo-initials">${fighterInitials(f.fighter)}</div>`}${override.photoNote ? `<div class="photo-note">${override.photoNote}</div>` : (!photoUrl ? `<div class="photo-note">Photo slot: use a licensed upper-half fighter crop, centered from head to waist.</div>` : '')}</div><div class="profile-summary"><div class="profile-topline"><span class="profile-pill gold">UFC All-Time Rank: #${rankLabel}</span><span class="profile-pill">${divisionLabel}</span><span class="profile-pill tier-overall">${overallTier.label} OVR</span></div><h2>${f.fighter}</h2><div class="profile-ovr-wrap"><div class="profile-ovr">${overallOvr(f)} <small>OVR</small></div><span class="tier-pill ${overallTier.cls}">${overallTier.label}</span></div><p class="profile-copy">${override.oneLiner || `${f.fighter}'s UFC resume is graded across championship success, quality wins, prime dominance, elite longevity, and loss context.`}</p></div></section><section class="profile-main-flow"><div class="card"><h3>Resume Snapshot</h3>${snapshotGrid(snapshotFor(f))}</div><div class="category-grid">${categoryCards(f)}</div><div id="categoryExplanation" class="category-explainer"><h3>Category Breakdown</h3><p>Tap any category to see what it means, what evidence matters, and why this fighter lands there.</p></div><div class="card"><h3>Why Ranked Here</h3><p>${override.whyRankedHere || `${f.fighter} ranks here based on the current UFC-only balance of championship success, quality wins, prime dominance, and active elite longevity.`}</p></div><div class="card"><h3>${rankedSectionTitle}</h3>${rankedSectionBody}</div><div class="card"><h3>Key Judgment Calls</h3>${keyJudgments}</div><div class="card"><h3>Final Takeaway</h3><p>${finalTakeaway}</p></div></section><section class="profile-deep-cuts"><div class="card"><h3>Title Context</h3><p>${title.notes || 'No title note entered.'}</p></div><div class="card"><h3>Quality Wins</h3>${rowsTable(opps,[{key:'opponent',label:'Opponent'},{key:'division',label:'Division'},{key:'context',label:'Context'}])}</div><div class="card"><h3>Rounds Won</h3>${rowsTable(rounds,[{key:'opponent',label:'Opponent'},{key:'method',label:'Result'},{key:'roundsWon',label:'Rounds Won'},{key:'roundsCounted',label:'Fight Rounds'}])}</div></section>`;
    el('drawer').classList.add('open');
    el('drawer').setAttribute('aria-hidden','false');
    const panel = document.querySelector('.drawer-panel');
    if(panel) panel.scrollTop = 0;
    attachCategoryExplanations(f);
  };

  applyJon(); injectCss();
  window.UFC_PHASE2_DATA_STATUS = { version: PATCH_VERSION, mode: 'live-template-jon-package', jonProfileStats: true, appliedAt: new Date().toISOString() };
  document.documentElement.setAttribute('data-phase2-data-patch', PATCH_VERSION);
  if(typeof refresh === 'function') refresh();
})();

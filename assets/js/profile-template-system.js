// Durable UFC profile template system.
// Locks the approved profile layout for all fighters without changing scoring data.
(function(){
  const DATA = window.RANKING_DATA;
  const VERSION = 'profile-template-system-20260711c-compact-cards-snapshot';
  if(!DATA || typeof DISPLAY_OVERRIDES === 'undefined') return;

  const CATEGORY_INFO_LIVE = [
    ['championship','Title Reign','Title wins, reign strength, division control'],
    ['opponentQuality','Quality Wins','Who he beat, when he beat them, and division strength'],
    ['primeDominance','Prime Dominance','Rounds, finishes, separation, durability'],
    ['longevity','Elite Longevity','Active elite UFC years, not calendar padding'],
    ['penalty','Loss Context','Losses adjusted for timing, opponent, finish, and division']
  ];

  // Profile-card-only display names. These preserve how each nickname is naturally used.
  // They do not change ranking rows, Compare Mode, or scoring data.
  const PROFILE_DISPLAY_NAMES = {
    'Jon Jones':'Jon “Bones” Jones',
    'Georges St-Pierre':'Georges “Rush” St-Pierre',
    'Demetrious Johnson':'Demetrious “Mighty Mouse” Johnson',
    'Anderson Silva':'Anderson “The Spider” Silva',
    'Khabib Nurmagomedov':'Khabib “The Eagle” Nurmagomedov',
    'Alexander Volkanovski':'Alexander “The Great” Volkanovski',
    'Jose Aldo':'Jose Aldo “Junior”',
    'Max Holloway':'Max “Blessed” Holloway',
    'Kamaru Usman':'Kamaru “The Nigerian Nightmare” Usman',
    'Randy Couture':'Randy “The Natural” Couture',
    'Chuck Liddell':'Chuck “The Iceman” Liddell',
    'Israel Adesanya':'Israel “The Last Stylebender” Adesanya',
    'Alex Pereira':'Alex “Poatan” Pereira',
    'Aljamain Sterling':'Aljamain “Funk Master” Sterling',
    'Petr Yan':'Petr “No Mercy” Yan',
    'Merab Dvalishvili':'Merab “The Machine” Dvalishvili',
    'B.J. Penn':'B.J. “The Prodigy” Penn',
    'BJ Penn':'B.J. “The Prodigy” Penn',
    'Dustin Poirier':'Dustin “The Diamond” Poirier',
    'Dominick Cruz':'Dominick “The Dominator” Cruz',
    'Francis Ngannou':'Francis “The Predator” Ngannou',
    'Charles Oliveira':'Charles “Do Bronx” Oliveira',
    'Henry Cejudo':'Henry “Triple C” Cejudo',
    'Conor McGregor':'“The Notorious” Conor McGregor',
    'Justin Gaethje':'Justin “The Highlight” Gaethje',
    'Frankie Edgar':'Frankie “The Answer” Edgar',
    'Dan Henderson':'Dan “Hendo” Henderson',
    'Amanda Nunes':'Amanda “The Lioness” Nunes',
    'Valentina Shevchenko':'Valentina “Bullet” Shevchenko',
    'Joanna Jedrzejczyk':'Joanna “Champion” Jedrzejczyk',
    'Ronda Rousey':'Ronda “Rowdy” Rousey',
    'Ilia Topuria':'Ilia “El Matador” Topuria',
    'Daniel Cormier':'Daniel “DC” Cormier',
    'Mauricio Rua':'Mauricio “Shogun” Rua',
    'Maurício Rua':'Mauricio “Shogun” Rua',
    'Junior dos Santos':'Junior “Cigano” dos Santos',
    'Tony Ferguson':'Tony “El Cucuy” Ferguson'
  };

  const JON_STATS = {
    ufcRecord:'22-1, 1 NC',
    titleFightWins:16,
    eliteWins:10,
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
  const pctText = n => (n === null || n === undefined || n === '' || !Number.isFinite(Number(n))) ? '—' : `${Math.round(Number(n))}%`;
  const yearsText = n => (n === null || n === undefined || n === '' || !Number.isFinite(Number(n))) ? '—' : `${Number(n).toFixed(1)} YRS`;
  const numText = v => {
    if(v === null || v === undefined || v === '') return '—';
    const n = Number(String(v).replace(/[^0-9.\-]/g,''));
    if(Number.isFinite(n)) return Number.isInteger(n) ? String(n) : String(Number(n.toFixed(1)));
    return String(v).replace(/\.$/,'');
  };

  function liveProfileFor(name){
    return DATA.fighters?.find(f => f?.fighter === name) || {};
  }
  function liveBoardRowFor(name){
    return DATA.men?.find(f => f?.fighter === name) || DATA.women?.find(f => f?.fighter === name) || {};
  }
  window.profileFor = function(row){
    const name = row?.fighter || row;
    return liveProfileFor(name);
  };
  window.fullRow = function(row){
    const name = row?.fighter || row;
    return { ...liveProfileFor(name), ...liveBoardRowFor(name), ...(typeof row === 'object' ? row : {fighter:name}) };
  };

  function profileDisplayName(f, override){
    return override?.profileDisplayName || override?.fighterDisplayName || PROFILE_DISPLAY_NAMES[f.fighter] || f.fighter;
  }

  function applyJonPackage(){
    const jon = DATA.fighters?.find(f => f.fighter === 'Jon Jones');
    if(jon){
      jon.snapshotStats = {...JON_STATS};
      jon.roundsWonPct = JON_STATS.roundsWonPct;
      jon.eliteWins = JON_STATS.eliteWins;
      jon.timesFinishedPrime = JON_STATS.timesFinishedPrime;
      jon.opponents?.forEach(r => {
        const p = JON_PRIORITY[cleanName(r.opponent)];
        if(p){ r.displayPriority = p; r.opponentStrengthScore = 101 - p; }
      });
      jon.rounds?.forEach(r => {
        const p = JON_PRIORITY[cleanName(r.opponent)];
        if(p){ r.displayPriority = p; r.opponentStrengthScore = 101 - p; }
      });
    }
    const o = DISPLAY_OVERRIDES['Jon Jones'];
    if(o){
      o.snapshotStats = {...JON_STATS};
      o.photoPosition = o.photoPosition || 'center top';
      o.snapshot = [
        ['UFC Record', JON_STATS.ufcRecord],
        ['UFC Title-Fight Wins', String(JON_STATS.titleFightWins)],
        ['Elite / Top-5 Wins', String(JON_STATS.eliteWins)],
        ['Finish Rate', pctText(JON_STATS.finishRatePct)],
        ['Rounds Won', pctText(JON_STATS.roundsWonPct)],
        ['Active Elite Years', yearsText(JON_STATS.activeEliteYears)],
        ['Prime Stoppage Losses', String(JON_STATS.timesFinishedPrime)]
      ];
    }
  }

  function snapshotFor(f){
    const stats = f.snapshotStats || DISPLAY_OVERRIDES[f.fighter]?.snapshotStats || {};
    const overrideSnap = DISPLAY_OVERRIDES[f.fighter]?.snapshot || [];
    const findSnap = label => overrideSnap.find(x => x[0] === label)?.[1];
    const titleWins = stats.titleFightWins ?? (typeof titleFightWinsFromNotes === 'function' ? titleFightWinsFromNotes(f.title || {}) : null);
    return [
      ['UFC Record', stats.ufcRecord || f.ufcRecord || findSnap('UFC Record') || '—'],
      ['UFC Title-Fight Wins', numText(titleWins ?? findSnap('UFC Title-Fight Wins'))],
      ['Elite / Top-5 Wins', numText(stats.eliteWins ?? f.eliteWins ?? findSnap('Elite / Top-5 Wins') ?? findSnap('Elite Wins') ?? findSnap('Quality Wins'))],
      ['Prime Record', DATA.primeRecords?.[f.fighter]?.record || '—'],
      ['Finish Rate', pctText(stats.finishRatePct ?? f.finishRatePct)],
      ['Rounds Won', pctText(stats.roundsWonPct ?? f.roundsWonPct)],
      ['Active Elite Years', yearsText(stats.activeEliteYears ?? f.activeEliteYears)],
      ['Prime Stoppage Losses', numText(stats.timesFinishedPrime ?? f.timesFinishedPrime ?? findSnap('Prime Stoppage Losses') ?? findSnap('Times Finished in Prime') ?? 0)]
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
    if(!sorted.length) return '<p class="meta evidence-empty">Evidence rows are still being added for this fighter.</p>';
    const body = sorted.slice(0,max).map(r => `<tr>${cols.map(c => `<td>${r[c.key] ?? ''}</td>`).join('')}</tr>`).join('');
    return `<table class="table"><thead><tr>${cols.map(c => `<th>${c.label}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table>${sorted.length > max ? `<p class="meta">Showing first ${max} of ${sorted.length} rows.</p>`:''}`;
  };

  window.categoryCards = function(f){
    return CATEGORY_INFO_LIVE.map(([key,label]) => {
      const rating = categoryOvr(f,key);
      const rank = categoryRank(f,key);
      const tier = tierForOvr(rating);
      const width = Math.max(0, Math.min(100, rating));
      return `<button type="button" class="category-card ${tier.cls}" data-category="${key}" aria-label="Explain ${label} rating for ${f.fighter}"><span class="category-label">${label}</span><strong>${rating} <span class="meta">Rating</span></strong><small>#${rank || '—'} in category</small><span class="tier-pill">${tier.label}</span><div class="category-bar"><i style="width:${width}%"></i></div></button>`;
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
    return `<div class="row-photo">${url ? `<img src="${url}" alt="${f.fighter} thumbnail" loading="lazy">` : fighterInitials(f.fighter)}</div>`;
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
    const divisionLabel = override.divisionLabel || `${f.primaryDivision || ''}${f.secondaryDivision ? ' / ' + f.secondaryDivision : ''}`;
    const rankLabel = override.allTimeRank || f.rank || '—';
    const photoUrl = override.photoUrl || '';
    const photoClass = photoUrl ? 'fighter-photo has-photo' : 'fighter-photo';
    const rankedSectionTitle = Number(rankLabel) === 1 ? 'Why Not Lower?' : 'Why Not Ranked Higher?';
    const rankedSectionBody = Number(rankLabel) === 1
      ? `<p>${override.whyNotLower || 'The #1 case holds because the fighters below do not match the same full blend of title volume, elite wins, longevity, and clean loss context.'}</p>`
      : `<p>${override.whyNotHigher || 'The ranking is showing which inputs keep the resume from climbing higher.'}</p>`;
    const displayName = profileDisplayName(f, override);

    el('fighterDetail').innerHTML = `
      <section class="profile-hero">
        <div class="${photoClass}">
          ${photoUrl ? `<img src="${photoUrl}" alt="${f.fighter} profile photo" class="fighter-photo-img" style="object-position:${override.photoPosition || 'center top'}">` : `<div class="photo-initials">${fighterInitials(f.fighter)}</div>`}
          ${override.photoNote ? `<div class="photo-note">${override.photoNote}</div>` : (!photoUrl ? `<div class="photo-note">Photo slot: use a licensed upper-half fighter crop, centered from head to waist.</div>` : '')}
        </div>
        <div class="profile-summary">
          <div class="profile-topline"><span class="profile-pill gold">UFC All-Time Rank: #${rankLabel}</span><span class="profile-pill">${divisionLabel}</span></div>
          <h2>${displayName}</h2>
          <div class="profile-ovr-wrap"><div class="profile-ovr">${overallOvr(f)} <small>OVR</small></div></div>
          <p class="profile-copy">${override.oneLiner || `${f.fighter}'s UFC resume is graded across championship success, quality wins, prime dominance, elite longevity, and loss context.`}</p>
        </div>
      </section>
      <section class="profile-main-flow">
        <div class="card"><h3>Resume Snapshot</h3>${snapshotGrid(snapshotFor(f))}</div>
        <div class="category-grid">${categoryCards(f)}</div>
        <div id="categoryExplanation"></div>
        <div class="card"><h3>Why Ranked Here</h3><p>${override.whyRankedHere || `${f.fighter} ranks here based on the current UFC-only balance of championship success, quality wins, prime dominance, and active elite longevity.`}</p></div>
        <div class="card"><h3>${rankedSectionTitle}</h3>${rankedSectionBody}</div>
      </section>`;

    el('drawer').classList.add('open');
    el('drawer').setAttribute('aria-hidden','false');
    const panel = document.querySelector('.drawer-panel');
    if(panel) panel.scrollTop = 0;
    attachCategoryExplanations(f);
  };

  applyJonPackage();
  window.UFC_PROFILE_TEMPLATE_SYSTEM = {
    version: VERSION,
    snapshotLabels: ['UFC Record','UFC Title-Fight Wins','Elite / Top-5 Wins','Prime Record','Finish Rate','Rounds Won','Active Elite Years','Prime Stoppage Losses'],
    profileDisplayNames: PROFILE_DISPLAY_NAMES,
    publicProfileSections: ['Hero','Resume Snapshot','Category Cards','Why Ranked Here','Why Not Ranked Higher']
  };
  if(typeof refresh === 'function') refresh();
})();

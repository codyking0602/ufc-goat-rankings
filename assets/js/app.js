// Built from embedded source app logic by tools/split-app-js.py.
// Long-term source target: edit this file directly once index.html is fully layout-only.

const DATA = window.RANKING_DATA;
const allProfiles = DATA.fighters;
const menNames = new Set(DATA.men.map(d => d.fighter));
const womenNames = new Set(DATA.women.map(d => d.fighter));
const byName = Object.fromEntries(allProfiles.map(f => [f.fighter, f]));

function fmt(n){ return (n === null || n === undefined || n === '') ? '—' : Number(n).toFixed(2); }
function pct(n){ return (n === null || n === undefined || n === '') ? '—' : `${Number(n).toFixed(1)}%`; }
function el(id){ return document.getElementById(id); }

const CATEGORY_INFO = [
  ["championship", "Title Reign", "Championship resume: title-fight wins, reign strength, and control of the division"],
  ["opponentQuality", "Quality Wins", "Who he beat, when he beat them, and how strong the division was"],
  ["primeDominance", "Prime Dominance", "How clearly he separated from opponents at his best"],
  ["longevity", "Elite Longevity", "How long he stayed elite in the UFC, not just calendar span"],
  ["penalty", "Loss Context", "How much UFC losses actually hurt the resume after context"]
];
function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
function ordinal(n){ const s=["th","st","nd","rd"], v=n%100; return n+(s[(v-20)%10]||s[v]||s[0]); }
function overallOvr(f){
  const o = DISPLAY_OVERRIDES[f.fighter];
  if (o?.overallOvr) return o.overallOvr;
  const max = Math.max(...DATA.men.concat(DATA.women).map(x=>x.totalScore||0), 1);
  return clamp(Math.round(75 + ((f.totalScore || 0) / max) * 24), 60, 99);
}
function categoryBoardFor(f){
  const women = DATA.women || [];
  const men = DATA.men || [];
  const isWomen = f?.leaderboard === 'women' || womenNames.has(f?.fighter) || women.some(row => row.fighter === f?.fighter);
  return isWomen ? women : men;
}
function primeDominanceEntryFor(f){
  if(!f?.fighter) return null;
  return f.primeDominanceLiveAudit
    || f.primeDominanceShadowAudit
    || window.UFC_PRIME_DOMINANCE_LEDGERS?.entryFor?.(f.fighter)
    || window.UFC_PRIME_DOMINANCE_SHADOW_MODEL?.report?.find(entry => entry.fighter === f.fighter)
    || null;
}
function primeDominanceLiveValue(f){
  const entry = primeDominanceEntryFor(f);
  const value = Number(entry?.total ?? f?.primeDominance ?? 0);
  return Number.isFinite(value) ? value : 0;
}
function categoryValueForRank(f, key){
  if(key === 'primeDominance') return primeDominanceLiveValue(f);
  const v = Number(f?.[key] ?? 0);
  return Number.isFinite(v) ? v : 0;
}
function categoryRank(f, key){
  if(key !== 'primeDominance'){
    const o = DISPLAY_OVERRIDES[f.fighter]?.categories?.[key];
    if (o?.rank) return o.rank;
  }
  const board = categoryBoardFor(f).map(fullRow);
  const val = categoryValueForRank(f, key);
  return 1 + board.filter(x => categoryValueForRank(x, key) > val).length;
}
function categoryOvr(f, key){
  if(key !== 'primeDominance'){
    const o = DISPLAY_OVERRIDES[f.fighter]?.categories?.[key];
    if (o?.ovr) return o.ovr;
  }
  const board = categoryBoardFor(f);
  const rank = categoryRank(f, key);
  if (!rank) return 55;
  if (board.length <= 1) return 99;
  return clamp(Math.round(99 - ((rank - 1) / (board.length - 1)) * 44), 55, 99);
}
function fighterInitials(name){ return name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase(); }
function tierForOvr(ovr){
  if (ovr >= 97) return {label:"Legendary", cls:"tier-legendary"};
  if (ovr >= 90) return {label:"Elite", cls:"tier-elite"};
  if (ovr >= 85) return {label:"Great", cls:"tier-great"};
  if (ovr >= 80) return {label:"Good", cls:"tier-good"};
  return {label:"Average", cls:"tier-average"};
}
function categoryCards(f){
  return CATEGORY_INFO.map(([key,label,description]) => {
    const pctScore = categoryOvr(f,key);
    const rank = categoryRank(f,key);
    const tier = tierForOvr(pctScore);
    const width = Math.max(0, Math.min(100, pctScore));
    return `<button type="button" class="category-card ${tier.cls}" data-category="${key}" aria-label="Explain ${label} percentile for ${f.fighter}">
      <span class="category-label">${label}</span>
      <strong>${pctScore} <span class="meta">PCTL</span></strong>
      <small>#${rank || '—'} in category · ${description}</small>
      <span class="tier-pill">${tier.label}</span>
      <div class="category-bar"><i style="width:${width}%"></i></div>
    </button>`;
  }).join('');
}
function titleFightWinsFromNotes(title){
  const match = String(title?.notes || '').match(/Total title fight wins = ([0-9.]+)/);
  return match ? match[1].replace(/\.0$/, '') : null;
}
function cleanOpponentName(name){ return String(name || '').replace(/\s+\d+$/, '').trim(); }
function compactOpponentNames(opps, count=5){
  if(!opps.length) return 'Opponent detail is still being loaded for this fighter.';
  const sorted = [...opps].sort((a,b)=>Number(b.credit||0)-Number(a.credit||0));
  const picked = [];
  const counts = {};
  sorted.forEach(o => {
    const n = cleanOpponentName(o.opponent);
    if(!n) return;
    if(!picked.includes(n)) picked.push(n);
    counts[n] = (counts[n] || 0) + 1;
  });
  return picked.slice(0,count).map(n => counts[n] > 1 ? `${n} x${counts[n]}` : n).join(', ');
}
function compactOpponentContext(opps, count=3){
  if(!opps.length) return 'More opponent detail will be added here.';
  return [...opps]
    .sort((a,b)=>Number(b.credit||0)-Number(a.credit||0))
    .slice(0,count)
    .map(o => `${cleanOpponentName(o.opponent)} — ${o.context || 'key UFC win'}`)
    .join(' · ');
}
function rawCreditTotal(opps){
  const total = opps.reduce((sum,o)=>sum + Number(o.credit || 0), 0);
  return total ? total.toFixed(2) : null;
}
function lossPenaltyValue(f){
  const v = Number(f.penalty ?? f.lossPenalty ?? 0);
  return Number.isFinite(v) ? v : 0;
}
function titleMix(title){
  const parts = [];
  if(Number(title.normalTitleWins || 0)) parts.push(`${title.normalTitleWins} regular title wins`);
  if(Number(title.interimTitleWins || 0)) parts.push(`${title.interimTitleWins} interim`);
  if(Number(title.vacantUndisputedWins || 0)) parts.push(`${title.vacantUndisputedWins} vacant-title win`);
  return parts.length ? parts.join(' · ') : 'No UFC title wins loaded';
}
function ufcRecordLine(f){
  if(f.ufcRecord) return f.ufcRecord;
  if(f.record) return f.record;
  if(f.ufcWins !== undefined && f.ufcLosses !== undefined) return `${f.ufcWins}-${f.ufcLosses}`;
  return 'Record detail loaded in resume snapshot';
}
function knownEliteWindow(f){
  const windows = {
    "Jon Jones": "Ryan Bader 2011 → Ciryl Gane 2023",
    "Georges St-Pierre": "Matt Hughes II 2006 → Michael Bisping 2017",
    "Demetrious Johnson": "Joseph Benavidez 2012 → Henry Cejudo II 2018",
    "Anderson Silva": "Chris Leben 2006 → Chris Weidman II 2013",
    "Khabib Nurmagomedov": "Rafael dos Anjos 2014 → Justin Gaethje 2020",
    "Islam Makhachev": "Drew Dober 2021 → active",
    "Alexander Volkanovski": "Jose Aldo 2019 → active",
    "Jose Aldo": "Frankie Edgar II 2016 → Merab Dvalishvili 2022"
  };
  if(windows[f.fighter]) return windows[f.fighter];
  if(f.primeStart || f.primeEnd) return `${f.primeStart || 'elite start TBD'} → ${f.primeEnd || 'active/elite end TBD'}`;
  return null;
}
function primeRecordText(f){
  return DATA.primeRecords?.[f?.fighter]?.record || null;
}
function roundControlText(f){
  const candidates = [f.roundsWonPct, f.roundsWonPercentage, f.roundWinPct, f.roundsWonPercent];
  const val = candidates.find(x => x !== undefined && x !== null && Number.isFinite(Number(x)));
  if(val !== undefined) return pct(Number(val));
  const rounds = f.rounds || [];
  if(rounds.length) return `${rounds.length} tracked UFC fights`;
  return null;
}
function divisionContextText(f){
  const d = String(f.division || f.weightClass || '').toLowerCase();
  if(d.includes('lightweight')) return 'Lightweight is treated as one of the toughest UFC divisions.';
  if(d.includes('welterweight')) return 'Welterweight depth gives strong wins extra value.';
  if(d.includes('featherweight')) return 'Modern featherweight depth gives strong wins extra value.';
  if(d.includes('middleweight')) return 'Middleweight gets some era/division-strength context.';
  if(d.includes('flyweight')) return 'Flyweight dominance is respected, but division depth is discounted slightly.';
  if(d.includes('bantamweight')) return 'Bantamweight is treated as a deep modern division.';
  return 'Division strength is part of how opponent wins are valued.';
}
function lossImpactText(f){
  const penalty = lossPenaltyValue(f);
  if(penalty === 0) return 'No meaningful damage to the UFC-only resume.';
  if(penalty <= -3) return 'Meaningful damage because at least one counted loss came in a worse context.';
  return 'Small damage because the loss has timing, opponent, or division context.';
}
function categoryEvidenceItems(f, key){
  const title = f.title || {};
  const opps = f.opponents || [];
  const rounds = f.rounds || [];
  const penalty = lossPenaltyValue(f);
  const items = [];
  if(key === 'championship'){
    const tfw = titleFightWinsFromNotes(title);
    if(tfw) items.push(['UFC title-fight wins', tfw]);
    if(title.adjustedTitleWins) items.push(['Adjusted title wins', `${Number(title.adjustedTitleWins).toFixed(1)} weighted wins`]);
    items.push(['Title resume type', titleMix(title)]);
    items.push(['Why it ranks here', 'This category favors fighters who repeatedly won at UFC championship level.']);
  } else if(key === 'opponentQuality'){
    items.push(['Key UFC wins', compactOpponentNames(opps, 5)]);
    items.push(['Best win context', compactOpponentContext(opps, 3)]);
    items.push(['Division context', divisionContextText(f)]);
    items.push(['Why it ranks here', 'Name value alone is not enough; timing, ranking, and division strength matter.']);
  } else if(key === 'primeDominance'){
    const window = knownEliteWindow(f);
    if(window) items.push(['Peak window', window]);
    const canonicalPrime = DATA.primeRecords?.[f?.fighter] || {};
    const pr = primeRecordText(f);
    if(pr) items.push(['Prime UFC record', pr]);
    if(canonicalPrime.context) items.push(['Prime window context', canonicalPrime.context]);
    items.push(['Finish rate', pct(f.finishRatePct)]);
    const rc = roundControlText(f);
    if(rc) items.push(['Round control', rc]);
    items.push(['Finished at peak', `${f.timesFinishedPrime ?? 0} time${Number(f.timesFinishedPrime||0) === 1 ? '' : 's'}`]);
  } else if(key === 'longevity'){
    const window = knownEliteWindow(f);
    if(window) items.push(['Elite UFC window', window]);
    items.push(['Active elite years', fmt(f.activeEliteYears)]);
    items.push(['How gaps are handled', 'Long inactive stretches are limited, so time away does not inflate the score.']);
    items.push(['Why it ranks here', 'This rewards repeatedly proving elite status in UFC fights.']);
  } else if(key === 'penalty'){
    items.push(['UFC record context', ufcRecordLine(f)]);
    items.push(['How losses affect it', lossImpactText(f)]);
    items.push(['Finished at peak', `${f.timesFinishedPrime ?? 0} time${Number(f.timesFinishedPrime||0) === 1 ? '' : 's'}`]);
    items.push(['Important context', f.notes || 'Losses are weighed by timing, opponent quality, and whether the fighter was finished.']);
  }
  return items.filter(([,v]) => v !== null && v !== undefined && String(v).trim() !== '' && String(v).trim() !== '— to —');
}

function categoryLogicSentence(f, key){
  const title = f.title || {};
  const opps = f.opponents || [];
  const rank = categoryRank(f, key);
  const penalty = lossPenaltyValue(f);
  if(key === 'championship'){
    const adj = title.adjustedTitleWins ? Number(title.adjustedTitleWins).toFixed(1) : null;
    const tfw = titleFightWinsFromNotes(title);
    if(rank <= 3) return `${f.fighter} is this high because his UFC title resume has rare volume and staying power${tfw ? `: ${tfw} UFC title-fight wins` : ''}${adj ? ` and ${adj} adjusted title-win credit` : ''}.`;
    return `${f.fighter} scores well here, but this category rewards longer UFC title reigns and repeated title-fight wins.`;
  }
  if(key === 'opponentQuality'){
    return `${f.fighter}'s quality-wins rank is built around ${compactOpponentNames(opps, 5)}. The score asks how strong those wins were at the time, not just how famous the names are now.`;
  }
  if(key === 'primeDominance'){
    const window = knownEliteWindow(f);
    const record = primeRecordText(f);
    const parts = [];
    if(window) parts.push(`elite window: ${window}`);
    if(record) parts.push(`prime record: ${record}`);
    parts.push(`${pct(f.finishRatePct)} finish rate`);
    parts.push(`${f.timesFinishedPrime ?? 0} finish losses at peak`);
    const rc = roundControlText(f);
    if(rc) parts.push(`round control: ${rc}`);
    return `${f.fighter}'s dominance rank comes from ${parts.join(', ')}. This is about how little opponents could do to him when he was at his best.`;
  }
  if(key === 'longevity'){
    const window = knownEliteWindow(f);
    return `${f.fighter}'s longevity rank is based on ${fmt(f.activeEliteYears)} active elite UFC years${window ? `, roughly from ${window}` : ''}. It rewards proven elite UFC fights, not simply being on the roster for a long time.`;
  }
  if(key === 'penalty'){
    if(penalty === 0) return `${f.fighter}'s loss context is extremely clean in this UFC-only model. Official weirdness can still appear in the record, but it is not treated the same as a real competitive loss.`;
    return `${f.fighter}'s loss context is still strong, but not spotless. The score looks at when the loss happened, who it was against, and whether he was finished.`;
  }
  return '';
}

function whyNotHigher(f, key){
  const rank = categoryRank(f, key);
  const penalty = lossPenaltyValue(f);
  if(key === 'championship'){
    if(rank <= 1) return 'This is basically the ceiling for UFC championship resume.';
    if(rank <= 3) return 'Already elite; only tiny separation exists among the best championship cases.';
    return 'Needs more title-fight volume or longer championship control to catch the longest UFC reigns.';
  }
  if(key === 'opponentQuality'){
    if(rank <= 1) return 'This is the benchmark quality-wins case in the current board.';
    if(rank <= 3) return 'Already near the ceiling; only the deepest UFC-only win ledgers can challenge it.';
    return 'The very top names have either more elite wins, better prime timing, or stronger division context.';
  }
  if(key === 'primeDominance'){
    if(rank <= 1) return 'This is the current peak-dominance benchmark.';
    if(rank <= 3) return 'Already close to the ceiling; only the cleanest peak-control cases compare.';
    return 'Needs a longer or cleaner peak sample to pass the all-time dominance outliers.';
  }
  if(key === 'longevity'){
    if(rank <= 1) return 'This is the current active-elite longevity benchmark.';
    if(rank <= 3) return 'Already a top longevity case; only small model differences separate the leaders.';
    return 'Needs more active elite UFC years to match the longest-running championship resumes.';
  }
  if(key === 'penalty'){
    if(penalty === 0) return 'No meaningful loss problem here; this is already one of the cleanest UFC loss-context cases.';
    return 'A counted loss keeps this below cleaner records, even when the loss has understandable context.';
  }
  return '';
}
function categoryExplanation(f, key){
  const info = CATEGORY_INFO.find(([k]) => k === key) || [key, key, ''];
  const label = info[1];
  const description = info[2];
  const pctScore = categoryOvr(f,key);
  const rank = categoryRank(f,key);
  const tier = tierForOvr(pctScore);
  const items = categoryEvidenceItems(f,key);
  return `<div class="category-explainer ${tier.cls}">
    <div class="category-explainer-kicker">${tier.label} · #${rank || '—'} in category</div>
    <h3>${label}: ${ordinal(pctScore)} percentile</h3>
    <p><strong>What it means:</strong> ${categoryLogicSentence(f, key) || description}</p>
    <div class="category-explainer-grid">
      ${items.map(([k,v])=>`<div class="category-explainer-item"><strong>${k}</strong><small>${v}</small></div>`).join('')}
    </div>
  </div>`;
}
function attachCategoryExplanations(f){
  const cards = document.querySelectorAll('#fighterDetail .category-card');
  const target = document.getElementById('categoryExplanation');
  if(!cards.length || !target) return;
  cards.forEach(card => {
    card.addEventListener('click', e => {
      e.stopPropagation();
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      target.innerHTML = categoryExplanation(f, card.dataset.category);
      target.scrollIntoView({behavior:'smooth', block:'nearest'});
    });
  });
}


function snapshotGrid(items){
  return `<div class="snapshot-grid">${items.map(([label,value])=>`<div class="snapshot-item"><strong>${value}</strong><small>${label}</small></div>`).join('')}</div>`;
}


function profileFor(row){ return byName[row.fighter] || {}; }
function fullRow(row){ return { ...profileFor(row), ...row }; }

function setKpis(id, rows){
  const avg = rows.reduce((a,b)=>a + (b.totalScore||0),0) / Math.max(rows.length,1);
  const top = rows[0];
  el(id).innerHTML = `
    <div class="kpi"><span>${rows.length}</span><small>fighters</small></div>
    <div class="kpi"><span>${top ? top.fighter : '—'}</span><small>current #1</small></div>
    <div class="kpi"><span>${Math.round(rows.reduce((a,b)=>a + overallOvr(fullRow(b)),0) / Math.max(rows.length,1))}</span><small>average OVR</small></div>
  `;
}

function categoryMeter(f, key){
  const info = CATEGORY_INFO.find(([k]) => k === key) || [key, key, ""];
  const label = info[1];
  const ovr = categoryOvr(f,key);
  const rank = categoryRank(f,key);
  const tier = tierForOvr(ovr);
  const width = Math.max(0, Math.min(100, ovr));
  return `<div class="category-mini ${tier.cls}">
    <div class="category-mini-head"><b>${label}</b><span>${ovr} PCTL · #${rank || '—'} · ${tier.label}</span></div>
    <div class="bar"><i style="width:${width}%"></i></div>
  </div>`;
}

function photoUrlFor(f){ return DISPLAY_OVERRIDES[f.fighter]?.photoUrl || ""; }
function thumbUrlFor(f){ return DISPLAY_OVERRIDES[f.fighter]?.thumbUrl || photoUrlFor(f); }
function rowPhoto(f){
  const url = thumbUrlFor(f);
  return `<div class="row-photo">${url ? `<img src="${url}" alt="${f.fighter} profile photo">` : fighterInitials(f.fighter)}</div>`;
}
function resumeTagFor(f){
  const override = DISPLAY_OVERRIDES[f.fighter] || {};
  if (override.resumeTag) return override.resumeTag;
  const rank = Number(override.allTimeRank || f.rank || 999);
  if (rank <= 5) return "Legendary UFC resume";
  if (rank <= 15) return "Elite UFC resume";
  if (rank <= 30) return "Great UFC resume";
  return "UFC resume";
}
function categoryChip(f, key){
  const info = CATEGORY_INFO.find(([k]) => k === key) || [key, key, ""];
  const label = info[1];
  const ovr = categoryOvr(f,key);
  const rank = categoryRank(f,key);
  const tier = tierForOvr(ovr);
  return `<div class="category-chip ${tier.cls}"><b>${label}</b><span>${ovr} PCTL · #${rank || '—'}</span><small>${tier.label}</small></div>`;
}
function categoryChipGrid(f){
  return `<div class="category-chips">
    ${categoryChip(f, 'championship')}
    ${categoryChip(f, 'opponentQuality')}
    ${categoryChip(f, 'primeDominance')}
    ${categoryChip(f, 'longevity')}
    ${categoryChip(f, 'penalty')}
  </div>`;
}

function renderList(containerId, rows){
  const q = el('search').value.trim().toLowerCase();
  const div = el('divisionFilter').value;
  let filtered = rows.map(fullRow).filter(r => {
    const textHit = !q || r.fighter.toLowerCase().includes(q);
    const divs = [r.primaryDivision, r.secondaryDivision].join(' ').toLowerCase();
    const divHit = div === 'All' || divs.includes(div.toLowerCase());
    return textHit && divHit;
  });
  el(containerId).innerHTML = filtered.map(r => `
    <article class="row fighter-row" data-fighter="${r.fighter}">
      <div class="rank">#${r.rank || '—'}</div>
      ${rowPhoto(r)}
      <div class="row-main"><div class="name">${r.fighter}</div><div class="meta">${r.ufcRecord || ''} · ${r.primaryDivision || ''}${r.secondaryDivision ? ' / ' + r.secondaryDivision : ''}</div><div class="resume-tag">${resumeTagFor(r)}</div></div>
      <div class="score">${overallOvr(r)} <span class="meta">OVR</span></div>
      ${categoryChipGrid(r)}
    </article>`).join('') || '<div class="notice">No fighters match that filter.</div>';
  document.querySelectorAll(`#${containerId} .row`).forEach(row => row.addEventListener('click', () => openFighter(row.dataset.fighter)));
}

function whyNotHigher(f){
  const reasons = [];
  if ((f.championship || 0) < 10) reasons.push(['Limited title volume', 'Championship resume trails the top tier.']);
  if ((f.opponentQuality || 0) < 10) reasons.push(['Opponent quality wins gap', 'Quality wins are strong, but not enough volume versus elite all-time candidates.']);
  if ((f.primeDominance || 0) < 18) reasons.push(['Dominance score', 'Rounds won, finish rate, or times finished pull the score down.']);
  if ((f.longevity || 0) < 8) reasons.push(['Short active elite window', 'Less sustained UFC elite time than the top names.']);
  if ((f.timesFinishedPrime || 0) >= 2) reasons.push(['Finished in prime', `${f.timesFinishedPrime} counted prime finish losses hurt the dominance profile.`]);
  if (!reasons.length) reasons.push(['Benchmark gap', 'The fighters above him have more title volume, quality wins, or active elite longevity.']);
  return reasons.slice(0,5);
}

function rowsTable(rows, cols, max=18){
  const body = rows.slice(0,max).map(r => `<tr>${cols.map(c => `<td>${r[c.key] ?? ''}</td>`).join('')}</tr>`).join('');
  return `<table class="table"><thead><tr>${cols.map(c => `<th>${c.label}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table>${rows.length > max ? `<p class="meta">Showing first ${max} of ${rows.length} rows.</p>`:''}`;
}

function openFighter(name){
  const f = fullRow((DATA.men.find(x=>x.fighter===name) || DATA.women.find(x=>x.fighter===name) || {fighter:name}));
  const override = DISPLAY_OVERRIDES[f.fighter] || {};
  const title = f.title || {};
  const opps = f.opponents || [];
  const rounds = f.rounds || [];
  const reasons = whyNotHigher(f);
  const divisionLabel = override.divisionLabel || `${f.primaryDivision || ''}${f.secondaryDivision ? ' / ' + f.secondaryDivision : ''}`;
  const rankLabel = override.allTimeRank || f.rank || '—';
  const photoUrl = override.photoUrl || '';
  const photoStyle = '';
  const photoClass = photoUrl ? 'fighter-photo has-photo' : 'fighter-photo';
  const snapshot = override.snapshot || [
    ['UFC Record', f.ufcRecord || '—'],
    ['UFC All-Time Rank', `#${rankLabel}`],
    ['Finish Rate', pct(f.finishRatePct)],
    ['Active Elite Years', fmt(f.activeEliteYears)],
    ['Primary Division', f.primaryDivision || '—'],
    ['Secondary Division', f.secondaryDivision || '—']
  ];
  const rankedSectionTitle = Number(rankLabel) === 1 ? 'Why Not Lower?' : 'Why Not Ranked Higher?';
  const rankedSectionBody = Number(rankLabel) === 1
    ? (override.whyNotLower ? `<p>${override.whyNotLower}</p>` : rowsTable(reasons.map(x=>({issue:x[0], reason:x[1]})), [{key:'issue',label:'Issue'},{key:'reason',label:'Why it matters'}], 8))
    : (override.whyNotHigher ? `<p>${override.whyNotHigher}</p>` : rowsTable(reasons.map(x=>({issue:x[0], reason:x[1]})), [{key:'issue',label:'Issue'},{key:'reason',label:'Why it matters'}], 8));
  const keyJudgments = override.keyJudgmentCalls
    ? `<ul class="judgment-list">${override.keyJudgmentCalls.map(([k,v])=>`<li><strong>${k}:</strong> ${v}</li>`).join('')}</ul>`
    : `<p>${f.notes || 'No notes entered.'}</p>`;
  el('fighterDetail').innerHTML = `
    <section class="profile-hero">
      <div class="${photoClass}" ${photoStyle}>
        ${photoUrl ? `<img src="${photoUrl}" alt="${f.fighter} profile photo" class="fighter-photo-img">` : `<div class="photo-initials">${fighterInitials(f.fighter)}</div>`}
        ${override.photoNote ? `<div class="photo-note">${override.photoNote}</div>` : (!photoUrl ? `<div class="photo-note">Photo slot: use a licensed upper-half fighter crop, centered from head to waist.</div>` : '')}
      </div>
      <div class="profile-summary">
        <div class="profile-topline"><span class="profile-pill gold">UFC All-Time Rank: #${rankLabel}</span><span class="profile-pill">${divisionLabel}</span></div>
        <h2>${f.fighter}</h2>
        <div class="profile-ovr">${overallOvr(f)} <small>OVR</small></div>
        <p class="profile-copy">${override.oneLiner || `${f.fighter}'s UFC resume is graded across championship success, quality wins, prime dominance, and longevity.`}</p>
      </div>
    </section>
    <div class="category-grid">${categoryCards(f)}</div>
    <div id="categoryExplanation" class="category-explainer"><h3>Category Breakdown</h3><p>Tap any category to see what it means, what evidence matters, and why this fighter lands there.</p></div>
    <div class="card"><h3>Resume Snapshot</h3>${snapshotGrid(snapshot)}</div>
    <div class="card"><h3>Why Ranked Here</h3><p>${override.whyRankedHere || `${f.fighter} ranks here based on the current balance of championship success, quality wins, prime dominance, and active elite longevity.`}</p></div>
    <div class="card"><h3>${rankedSectionTitle}</h3>${rankedSectionBody}</div>
    <div class="card"><h3>Key Judgment Calls</h3>${keyJudgments}</div>
    ${override.finalTakeaway ? `<div class="card"><h3>Final Takeaway</h3><p>${override.finalTakeaway}</p></div>` : ''}
    <div class="card"><h3>Title Context</h3><p>${title.notes || 'No title note entered.'}</p></div>
    <div class="card"><h3>Quality Wins</h3>${rowsTable(opps, [{key:'opponent',label:'Opponent'},{key:'division',label:'Division'},{key:'context',label:'Context'}])}</div>
    <div class="card"><h3>Round Control</h3>${rowsTable(rounds, [{key:'opponent',label:'Opponent'},{key:'method',label:'Result'},{key:'roundsWon',label:'Rounds Won'},{key:'roundsCounted',label:'Fight Rounds'}])}</div>
  `;
  el('drawer').classList.add('open');
  el('drawer').setAttribute('aria-hidden','false');
  const panel = document.querySelector('.drawer-panel');
  if(panel) panel.scrollTop = 0;
  attachCategoryExplanations(f);
}

function renderDivision(){
  const div = el('divisionFilter').value;
  const rows = allProfiles.filter(f => f.gender === 'Men').map(f => fullRow(DATA.men.find(x=>x.fighter===f.fighter) || { fighter: f.fighter, totalScore: f.totalScore }))
    .filter(f => div === 'All' || [f.primaryDivision, f.secondaryDivision].join(' ').toLowerCase().includes(div.toLowerCase()))
    .sort((a,b)=>(b.totalScore||0)-(a.totalScore||0));
  el('divisionList').innerHTML = `<div class="notice">Prototype note: this is a division filter using the current P4P score. True division-only scoring will use division-specific fight rows next.</div>`;
  el('divisionList').innerHTML += rows.map((r,i)=>`<article class="row fighter-row" data-fighter="${r.fighter}"><div class="rank">#${i+1}</div>${rowPhoto(r)}<div class="row-main"><div class="name">${r.fighter}</div><div class="meta">${r.ufcRecord || ''} · ${r.primaryDivision || ''}${r.secondaryDivision ? ' / ' + r.secondaryDivision : ''}</div><div class="resume-tag">${div === 'All' ? resumeTagFor(r) : div + ' view'}</div></div><div class="score">${overallOvr(r)} <span class="meta">OVR</span></div>${categoryChipGrid(r)}</article>`).join('');
  document.querySelectorAll(`#divisionList .row`).forEach(row => row.addEventListener('click', () => openFighter(row.dataset.fighter)));
}

function renderCompare(){
  const a = fullRow({fighter: el('fighterA').value});
  const b = fullRow({fighter: el('fighterB').value});
  const cats = [
    ['overall','Overall'], ['championship','Title Reign'], ['opponentQuality','Quality Wins'], ['primeDominance','Prime Dominance'], ['longevity','Elite Longevity'], ['penalty','Loss Context']
  ];
  const rows = cats.map(([key,label]) => {
    const av = key === 'overall' ? overallOvr(a) : categoryOvr(a, key);
    const bv = key === 'overall' ? overallOvr(b) : categoryOvr(b, key);
    const ar = key === 'overall' ? (DISPLAY_OVERRIDES[a.fighter]?.allTimeRank || a.rank || '—') : categoryRank(a, key);
    const br = key === 'overall' ? (DISPLAY_OVERRIDES[b.fighter]?.allTimeRank || b.rank || '—') : categoryRank(b, key);
    const unit = key === 'overall' ? 'OVR' : 'PCTL';
    const aWin = av > bv;
    const bWin = bv > av;
    return `<tr><td>${label}</td><td class="${aWin?'winner':''}">${av} ${unit} <span class="meta">· #${ar}</span></td><td class="${bWin?'winner':''}">${bv} ${unit} <span class="meta">· #${br}</span></td></tr>`;
  }).join('');
  el('compareResult').innerHTML = `
    <div class="card"><h3>${a.fighter}</h3><p>${a.ufcRecord || ''} · ${a.primaryDivision || ''}</p></div>
    <div class="card"><h3>${b.fighter}</h3><p>${b.ufcRecord || ''} · ${b.primaryDivision || ''}</p></div>
    <div class="card" style="grid-column:1/-1"><table class="table"><thead><tr><th>Category</th><th>${a.fighter}</th><th>${b.fighter}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderRules(){
  const divRows = DATA.divisionStrength.map(r=>`<tr><td>${r.divisionEra}</td><td>${r.multiplier ?? 'Varies'}</td><td>${r.rationale}</td></tr>`).join('');
  el('rulesContent').innerHTML = `
    <div class="card"><h3>Visible Categories</h3><table class="table"><tbody>
      <tr><td><strong>Title Reign</strong></td><td>Title-level resume and how clearly the fighter ruled at championship level.</td></tr>
      <tr><td><strong>Quality Wins</strong></td><td>Quality of wins, with extra attention to top-tier and prime opponent context.</td></tr>
      <tr><td><strong>Prime Dominance</strong></td><td>How dominant the fighter was at their best: rounds, finishes, separation, and control.</td></tr>
      <tr><td><strong>Elite Longevity</strong></td><td>Active elite years, not just calendar span.</td></tr>
      <tr><td><strong>Loss Context</strong></td><td>How much UFC losses actually hurt the resume after timing, opponent quality, finish context, and division context.</td></tr>
    </tbody></table></div>
    <div class="card"><h3>Division Strength</h3><table class="table"><thead><tr><th>Division/Era</th><th>Multiplier</th><th>Rationale</th></tr></thead><tbody>${divRows}</tbody></table></div>
    <div class="card"><h3>Model Note</h3><p>Overall fighter score remains an OVR. Category cards are percentile-style scores so they read as category standing instead of mini-overalls.</p></div>
  `;
}

function populateControls(){
  el('fighterCount').textContent = allProfiles.length;
  DATA.divisions.forEach(d => {
    const opt = document.createElement('option'); opt.value = d; opt.textContent = d; el('divisionFilter').appendChild(opt);
  });
  const names = allProfiles.map(f=>f.fighter).sort();
  ['fighterA','fighterB'].forEach((id,idx)=>{
    const sel = el(id);
    names.forEach(n => { const o=document.createElement('option'); o.value=n; o.textContent=n; sel.appendChild(o); });
    sel.value = idx === 0 ? 'Jon Jones' : 'Georges St-Pierre';
    sel.addEventListener('change', renderCompare);
  });
}

function refresh(){
  renderList('menList', DATA.men);
  renderList('womenList', DATA.women);
  setKpis('menStats', DATA.men);
  setKpis('womenStats', DATA.women);
  renderDivision();
  renderCompare();
  renderRules();
}

populateControls(); refresh();

document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active-view'));
  btn.classList.add('active');
  el(btn.dataset.view).classList.add('active-view');
  refresh();
}));

el('search').addEventListener('input', refresh);
el('divisionFilter').addEventListener('change', refresh);
el('resetBtn').addEventListener('click', () => { el('search').value=''; el('divisionFilter').value='All'; refresh(); });
el('closeDrawer').addEventListener('click', () => { el('drawer').classList.remove('open'); el('drawer').setAttribute('aria-hidden','true'); });
el('drawer').addEventListener('click', e => { if(e.target.id==='drawer') el('closeDrawer').click(); });

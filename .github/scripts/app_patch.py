from pathlib import Path
import sys

path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("index.html")
s = path.read_text()

# Muted category tier colors / naming.
s = s.replace('--tier-alltime: #22c55e;', '--tier-legendary: #d6a73c;')
s = s.replace('--tier-elite: #22c55e;', '--tier-elite: #35a86b;')
s = s.replace('--tier-great: #22c55e;', '--tier-great: #8b6fb3;')
s = s.replace('--tier-good: #22c55e;', '--tier-good: #4f7fa8;')
s = s.replace('--tier-average: #22c55e;', '--tier-average: #c8753e;')
s = s.replace('.tier-alltime { --tier-color: var(--tier-alltime); }', '.tier-legendary { --tier-color: var(--tier-legendary); }')
s = s.replace('if (ovr >= 97) return {label:"All-Time Elite", cls:"tier-alltime"};', 'if (ovr >= 97) return {label:"Legendary", cls:"tier-legendary"};')
s = s.replace('if (rank <= 5) return "All-time elite resume";', 'if (rank <= 5) return "Legendary UFC resume";')

# Mobile profile photo behavior.
s = s.replace('.fighter-photo.has-photo { background-size:cover; background-position:center 8%; }', '.fighter-photo.has-photo { background-size:cover; background-position:center top; }')
s = s.replace('.fighter-photo-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 8%; z-index:0; }', '.fighter-photo-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center top; z-index:0; display:block; }')
s = s.replace('@media (max-width:800px){ .profile-hero { grid-template-columns:1fr; } .fighter-photo { min-height:260px; } .profile-ovr { font-size:58px; } }', '@media (max-width:800px){ .profile-hero { grid-template-columns:1fr; } .fighter-photo { aspect-ratio:4 / 5; min-height:0; width:100%; } .profile-ovr { font-size:58px; } }')
s = s.replace('@media (max-width:800px){ .profile-hero { grid-template-columns:1fr; } .fighter-photo { aspect-ratio:4 / 5; min-height:0; } .profile-ovr { font-size:58px; } }', '@media (max-width:800px){ .profile-hero { grid-template-columns:1fr; } .fighter-photo { aspect-ratio:4 / 5; min-height:0; width:100%; } .profile-ovr { font-size:58px; } }')
s = s.replace('  .fighter-photo { min-height:360px; border-radius:22px; }', '  .fighter-photo { aspect-ratio:4 / 5; min-height:0; width:100%; border-radius:22px; }')
s = s.replace('  .fighter-photo { min-height:330px; }', '  .fighter-photo { aspect-ratio:4 / 5; min-height:0; width:100%; }')
if '.fighter-photo { width:100%; min-width:0; }' not in s:
    s = s.replace('.fighter-photo { min-height:320px;', '.fighter-photo { width:100%; min-width:0; }\n.fighter-photo { min-height:320px;')

# Category explainer CSS.
css_anchor = '.category-card { border:1px solid var(--line); border-radius:16px; padding:14px; background:rgba(18,23,34,.88); position:relative; overflow:hidden; }'
extra_css = '''
.category-card { cursor:pointer; text-align:left; color:var(--text); font-family:inherit; }
.category-card:hover, .category-card.active { border-color:color-mix(in srgb, var(--tier-color, var(--accent)) 70%, var(--line)); transform:translateY(-1px); }
.category-card:focus-visible { outline:2px solid var(--accent2); outline-offset:2px; }
.category-explainer { border:1px solid var(--line); border-radius:18px; padding:16px; background:linear-gradient(180deg, rgba(23,29,42,.96), rgba(18,23,34,.94)); margin:-2px 0 16px; }
.category-explainer h3 { margin:0 0 8px; font-size:20px; }
.category-explainer p { margin:8px 0; color:var(--muted); line-height:1.5; }
.category-explainer-kicker { color:var(--tier-color, var(--accent)); font-weight:900; text-transform:uppercase; letter-spacing:.06em; font-size:11px; margin-bottom:8px; }
.category-explainer-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:8px; margin-top:12px; }
.category-explainer-item { border:1px solid var(--line); border-radius:12px; padding:10px; background:rgba(15,23,42,.62); }
.category-explainer-item strong { display:block; font-size:14px; }
.category-explainer-item small { display:block; color:var(--muted); line-height:1.35; margin-top:3px; }
.category-why { margin-top:12px; border-left:3px solid var(--tier-color, var(--accent)); padding:9px 11px; border-radius:10px; background:rgba(15,23,42,.54); color:var(--muted); }
.category-why strong { color:var(--text); }
.tap-hint { margin-top:10px; color:var(--muted); font-size:12px; font-weight:750; letter-spacing:.02em; text-transform:uppercase; }
'''
if '.category-explainer {' not in s and css_anchor in s:
    s = s.replace(css_anchor, css_anchor + '\n' + extra_css)

# Use tier color for bars/chips.
s = s.replace('.bar > i { background:#22c55e; }', '.bar > i { background:var(--tier-color, #35a86b); }')
s = s.replace('.category-bar > i { display:block; height:100%; border-radius:999px; background:#22c55e; }', '.category-bar > i { display:block; height:100%; border-radius:999px; background:var(--tier-color, #35a86b); }')
s = s.replace('.category-card::before { content:""; position:absolute; inset:0 auto 0 0; width:4px; background:#22c55e; }', '.category-card::before { content:""; position:absolute; inset:0 auto 0 0; width:4px; background:var(--tier-color, #35a86b); }')
s = s.replace('.category-chip small { display:block; margin-top:3px; color:#22c55e;', '.category-chip small { display:block; margin-top:3px; color:var(--tier-color, #35a86b);')
s = s.replace('.tier-pill { display:inline-flex; margin-top:10px; border:1px solid rgba(34,197,94,.52); background:rgba(34,197,94,.10); color:#22c55e;', '.tier-pill { display:inline-flex; margin-top:10px; border:1px solid color-mix(in srgb, var(--tier-color, var(--accent)) 52%, transparent); background:color-mix(in srgb, var(--tier-color, var(--accent)) 12%, transparent); color:var(--tier-color, var(--accent));')

# Replace the full category JS block with more public-facing copy.
start = s.find('const CATEGORY_INFO = [')
end = s.find('function snapshotGrid', start)
if start == -1 or end == -1:
    raise SystemExit('Could not find category JS block')
new_block = r'''const CATEGORY_INFO = [
  ["championship", "Title Reign", "Championship résumé: title-fight wins, reign strength, and control of the division"],
  ["opponentQuality", "Quality Wins", "Who he beat, when he beat them, and how strong the division was"],
  ["primeDominance", "Prime Dominance", "How clearly he separated from opponents at his best"],
  ["longevity", "Elite Longevity", "How long he stayed elite in the UFC, not just calendar span"],
  ["penalty", "Loss Context", "How much UFC losses actually hurt the résumé after context"]
];
function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
function ordinal(n){ const s=["th","st","nd","rd"], v=n%100; return n+(s[(v-20)%10]||s[v]||s[0]); }
function overallOvr(f){
  const o = DISPLAY_OVERRIDES[f.fighter];
  if (o?.overallOvr) return o.overallOvr;
  const max = Math.max(...DATA.men.concat(DATA.women).map(x=>x.totalScore||0), 1);
  return clamp(Math.round(75 + ((f.totalScore || 0) / max) * 24), 60, 99);
}
function categoryValueForRank(f, key){
  const v = Number(f?.[key] ?? 0);
  return Number.isFinite(v) ? v : 0;
}
function categoryRank(f, key){
  const o = DISPLAY_OVERRIDES[f.fighter]?.categories?.[key];
  if (o?.rank) return o.rank;
  const board = (f.leaderboard === "women" ? DATA.women : DATA.men).map(fullRow);
  const val = categoryValueForRank(f, key);
  return 1 + board.filter(x => categoryValueForRank(x, key) > val).length;
}
function categoryOvr(f, key){
  const o = DISPLAY_OVERRIDES[f.fighter]?.categories?.[key];
  if (o?.ovr) return o.ovr;
  const board = f.leaderboard === "women" ? DATA.women : DATA.men;
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
  return 'Record detail loaded in résumé snapshot';
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
    if(title.adjustedTitleWins) items.push(['Adjusted title credit', `${Number(title.adjustedTitleWins).toFixed(1)} title-win value`]);
    items.push(['Title résumé type', titleMix(title)]);
    items.push(['Plain-English read', 'This rewards actually ruling at UFC championship level, not just owning a belt once.']);
  } else if(key === 'opponentQuality'){
    items.push(['Key UFC wins', compactOpponentNames(opps, 5)]);
    if(rawCreditTotal(opps)) items.push(['Win-depth score', rawCreditTotal(opps)]);
    items.push(['Best win context', compactOpponentContext(opps, 3)]);
    items.push(['Plain-English read', 'Beating great fighters in their best window counts more than just beating famous names.']);
  } else if(key === 'primeDominance'){
    items.push(['Finish rate', pct(f.finishRatePct)]);
    items.push(['Finished at peak', `${f.timesFinishedPrime ?? 0} time${Number(f.timesFinishedPrime||0) === 1 ? '' : 's'}`]);
    if(rounds.length) items.push(['Control sample', `${rounds.length} UFC fights tracked`]);
    items.push(['Plain-English read', 'This asks how much opponents could really do to him when he was at his best.']);
  } else if(key === 'longevity'){
    items.push(['Active elite years', fmt(f.activeEliteYears)]);
    if(f.primeStart || f.primeEnd) items.push(['Prime window', `${f.primeStart || '—'} to ${f.primeEnd || '—'}`]);
    items.push(['Gap handling', 'Inactive gaps are limited so calendar span does not create fake longevity.']);
    items.push(['Plain-English read', 'This rewards staying elite in real UFC fights, not simply being around longer.']);
  } else if(key === 'penalty'){
    items.push(['UFC record context', ufcRecordLine(f)]);
    items.push(['Resume impact from losses', penalty === 0 ? 'None in the current model' : `Small/moderate hit (${penalty.toFixed(2)})`]);
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
    if(rank <= 3) return `${f.fighter} is at the top of this category because his UFC title résumé has rare volume and staying power${tfw ? `: ${tfw} UFC title-fight wins` : ''}${adj ? ` and ${adj} adjusted title-win credit` : ''}.`;
    return `${f.fighter} scores well here, but this category favors fighters who stacked title-fight wins over a longer UFC reign.`;
  }
  if(key === 'opponentQuality'){
    return `${f.fighter}'s quality-wins case is built around ${compactOpponentNames(opps, 5)}. This category is about who he beat, when he beat them, and whether the division context made those wins harder.`;
  }
  if(key === 'primeDominance'){
    return `${f.fighter}'s prime score measures how dominant he looked at his best: finishing threat, round control, prime record, and whether opponents had real moments of success.`;
  }
  if(key === 'longevity'){
    return `${f.fighter}'s longevity score counts ${fmt(f.activeEliteYears)} active elite UFC years. It is not just a calendar-span award.`;
  }
  if(key === 'penalty'){
    if(penalty === 0) return `${f.fighter}'s loss résumé is extremely clean in this UFC-only model. Official weirdness still appears in the record, but it is not treated the same as a real competitive loss.`;
    return `${f.fighter}'s loss résumé is still strong, but not spotless. The model looks at when the loss happened, who it was against, and whether he was finished.`;
  }
  return '';
}
function whyNotHigher(f, key){
  const rank = categoryRank(f, key);
  const penalty = lossPenaltyValue(f);
  if(key === 'championship'){
    if(rank <= 1) return 'This is basically the ceiling for UFC championship résumé.';
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
    return 'Needs more active elite UFC years to match the longest-running championship résumés.';
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
    <p><strong>In plain English:</strong> ${categoryLogicSentence(f, key) || description}</p>
    <div class="category-explainer-grid">
      ${items.map(([k,v])=>`<div class="category-explainer-item"><strong>${k}</strong><small>${v}</small></div>`).join('')}
    </div>
    <div class="category-why"><strong>Why not higher?</strong> ${whyNotHigher(f, key)}</div>
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


'''
s = s[:start] + new_block + s[end:]

# Insert explainer into the profile if it is not already present.
s = s.replace('<p class="profile-copy">${override.oneLiner || `${f.fighter}\\\'s UFC resume is graded across championship success, quality wins, prime dominance, and longevity.`}</p>', '<p class="profile-copy">${override.oneLiner || `${f.fighter}\\\'s UFC resume is graded across championship success, quality wins, prime dominance, and longevity.`}</p><div class="tap-hint">Tap any category card for fighter-specific scoring context.</div>')
s = s.replace('<div class="category-grid">${categoryCards(f)}</div>', '<div class="category-grid">${categoryCards(f)}</div>\n    <div id="categoryExplanation" class="category-explainer"><h3>Category Breakdown</h3><p>Tap any category to see what it means, what evidence matters, and why this fighter lands there.</p></div>')
s = s.replace("  el('drawer').classList.add('open');\n  el('drawer').setAttribute('aria-hidden','false');\n}", "  el('drawer').classList.add('open');\n  el('drawer').setAttribute('aria-hidden','false');\n  const panel = document.querySelector('.drawer-panel');\n  if(panel) panel.scrollTop = 0;\n  attachCategoryExplanations(f);\n}")

# Category chips/meters should read as percentiles.
s = s.replace('${ovr} OVR · #${rank || \'—\'} · ${tier.label}', '${ovr} PCTL · #${rank || \'—\'} · ${tier.label}')
s = s.replace('${ovr} OVR · #${rank || \'—\'}', '${ovr} PCTL · #${rank || \'—\'}')

# Add Loss Context chip to rows if missing.
s = s.replace("""    ${categoryChip(f, 'longevity')}
  </div>`;""", """    ${categoryChip(f, 'longevity')}
    ${categoryChip(f, 'penalty')}
  </div>`;""")

# Compare mode: overall remains OVR, categories become PCTL, and Loss Context returns.
old_compare = """  const cats = [
    ['overall','Overall'], ['championship','Title Reign'], ['opponentQuality','Quality Wins'], ['primeDominance','Prime Dominance'], ['longevity','Elite Longevity']
  ];
  const rows = cats.map(([key,label]) => {
    const av = key === 'overall' ? overallOvr(a) : categoryOvr(a, key);
    const bv = key === 'overall' ? overallOvr(b) : categoryOvr(b, key);
    const ar = key === 'overall' ? (DISPLAY_OVERRIDES[a.fighter]?.allTimeRank || a.rank || '—') : categoryRank(a, key);
    const br = key === 'overall' ? (DISPLAY_OVERRIDES[b.fighter]?.allTimeRank || b.rank || '—') : categoryRank(b, key);
    const aWin = av > bv;
    const bWin = bv > av;
    return `<tr><td>${label}</td><td class="${aWin?'winner':''}">${av} OVR <span class="meta">· #${ar}</span></td><td class="${bWin?'winner':''}">${bv} OVR <span class="meta">· #${br}</span></td></tr>`;
  }).join('');"""
new_compare = """  const cats = [
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
  }).join('');"""
if old_compare in s:
    s = s.replace(old_compare, new_compare)

# Rules page: bring Loss Context back as a visible category.
s = s.replace("""      <tr><td><strong>Elite Longevity</strong></td><td>Active elite years, not just calendar span.</td></tr>
    </tbody></table></div>
    <div class="card"><h3>Division Strength</h3><table class="table"><thead><tr><th>Division/Era</th><th>Multiplier</th><th>Rationale</th></tr></thead><tbody>${divRows}</tbody></table></div>
    <div class="card"><h3>Model Note</h3><p>Loss context is still part of the behind-the-scenes scoring logic, but it is not displayed as a front-end category.</p></div>""", """      <tr><td><strong>Elite Longevity</strong></td><td>Active elite years, not just calendar span.</td></tr>
      <tr><td><strong>Loss Context</strong></td><td>How much UFC losses actually hurt the résumé after timing, opponent quality, finish context, and division context.</td></tr>
    </tbody></table></div>
    <div class="card"><h3>Division Strength</h3><table class="table"><thead><tr><th>Division/Era</th><th>Multiplier</th><th>Rationale</th></tr></thead><tbody>${divRows}</tbody></table></div>
    <div class="card"><h3>Model Note</h3><p>Overall fighter score remains an OVR. Category cards are percentile-style scores so they read as category standing instead of mini-overalls.</p></div>""")

path.write_text(s)

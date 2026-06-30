from pathlib import Path
import re
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
.category-explainer-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:8px; margin-top:12px; }
.category-explainer-item { border:1px solid var(--line); border-radius:12px; padding:10px; background:rgba(15,23,42,.62); }
.category-explainer-item strong { display:block; font-size:14px; }
.category-explainer-item small { color:var(--muted); line-height:1.35; }
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

# Replace the whole category JS block so category cards are percentiles and include Loss Context.
start = s.find('const CATEGORY_INFO = [')
end = s.find('function snapshotGrid', start)
if start == -1 or end == -1:
    raise SystemExit('Could not find category JS block')
new_block = r'''const CATEGORY_INFO = [
  ["championship", "Title Reign", "Title resume and championship control"],
  ["opponentQuality", "Quality Wins", "Quality of wins and opponent context"],
  ["primeDominance", "Prime Dominance", "Peak separation and round-by-round control"],
  ["longevity", "Elite Longevity", "Active elite years, not just calendar span"],
  ["penalty", "Loss Context", "How clean the UFC loss record is after timing/opponent/finish context"]
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
  // Front-end category display is a percentile-style score, not an OVR.
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
function scoreTierSentence(score, label, tier){
  return `${label} grades as ${tier.label} at the ${ordinal(score)} percentile.`;
}
function titleFightWinsFromNotes(title){
  const match = String(title?.notes || '').match(/Total title fight wins = ([0-9.]+)/);
  return match ? match[1] : null;
}
function topOpponentSummary(opps, count=5){
  if(!opps.length) return 'No detailed opponent rows loaded yet.';
  return [...opps]
    .sort((a,b)=>Number(b.credit||0)-Number(a.credit||0))
    .slice(0,count)
    .map(o => `${o.opponent}${o.context ? ` (${o.context})` : ''}`)
    .join(', ');
}
function rawCreditTotal(opps){
  const total = opps.reduce((sum,o)=>sum + Number(o.credit || 0), 0);
  return total ? total.toFixed(2) : '—';
}
function lossPenaltyValue(f){
  const v = Number(f.penalty ?? f.lossPenalty ?? 0);
  return Number.isFinite(v) ? v : 0;
}
function categoryEvidenceItems(f, key){
  const title = f.title || {};
  const opps = f.opponents || [];
  const rounds = f.rounds || [];
  const items = [];
  if(key === 'championship'){
    items.push(['Title-fight wins', titleFightWinsFromNotes(title) || 'Scored in model']);
    items.push(['Adjusted title wins', title.adjustedTitleWins ? Number(title.adjustedTitleWins).toFixed(1) : '—']);
    items.push(['Title mix', `${title.normalTitleWins ?? 0} normal · ${title.interimTitleWins ?? 0} interim · ${title.vacantUndisputedWins ?? 0} vacant`]);
    items.push(['Model read', 'Rewards ruling the UFC division more than merely touching a belt.']);
  } else if(key === 'opponentQuality'){
    items.push(['Best credited wins', topOpponentSummary(opps, 4)]);
    items.push(['Elite-win credit', rawCreditTotal(opps)]);
    items.push(['Rows loaded', opps.length ? `${opps.length} UFC opponent rows` : 'Best-available current data']);
    items.push(['Model read', 'Prime timing and division strength can raise or lower the name value.']);
  } else if(key === 'primeDominance'){
    items.push(['Finish rate', pct(f.finishRatePct)]);
    items.push(['Prime finish losses', f.timesFinishedPrime ?? 0]);
    items.push(['Round-control sample', rounds.length ? `${rounds.length} UFC fights tracked` : 'Best-available current data']);
    items.push(['Model read', 'Rewards clear separation: round control, danger, and not being broken at peak.']);
  } else if(key === 'longevity'){
    items.push(['Active elite years', fmt(f.activeEliteYears)]);
    items.push(['Prime window', `${f.primeStart || '—'} to ${f.primeEnd || '—'}`]);
    items.push(['Gap rule', 'Long inactivity gaps are capped/limited around the elite-fight window.']);
    items.push(['Model read', 'Rewards sustained UFC relevance, not just calendar age or late-career volume.']);
  } else if(key === 'penalty'){
    const penalty = lossPenaltyValue(f);
    items.push(['Score drag', penalty === 0 ? '0.00 / clean case' : penalty.toFixed(2)]);
    items.push(['UFC losses', f.ufcLosses ?? '—']);
    items.push(['Finished in prime', f.timesFinishedPrime ?? 0]);
    items.push(['Model read', f.notes || 'Losses are judged by timing, opponent quality, finish context, and division context.']);
  }
  return items;
}
function categoryLogicSentence(f, key){
  const title = f.title || {};
  const opps = f.opponents || [];
  const penalty = lossPenaltyValue(f);
  if(key === 'championship'){
    return `${f.fighter}'s Title Reign percentile comes from ${titleFightWinsFromNotes(title) || 'scored'} UFC title-fight wins and ${title.adjustedTitleWins ? Number(title.adjustedTitleWins).toFixed(1) : '—'} adjusted title wins. This is where the model asks whether he actually ruled at UFC championship level.`;
  }
  if(key === 'opponentQuality'){
    return `${f.fighter}'s Quality Wins percentile is driven by the depth and timing of his best UFC wins. Current high-credit examples include: ${topOpponentSummary(opps, 5)}`;
  }
  if(key === 'primeDominance'){
    return `${f.fighter}'s Prime Dominance percentile weighs peak separation: ${pct(f.finishRatePct)} finish rate, round-control data, prime record context, and whether opponents could actually hurt or finish him at his best.`;
  }
  if(key === 'longevity'){
    return `${f.fighter}'s Elite Longevity percentile is based on ${fmt(f.activeEliteYears)} active elite UFC years. The model limits long gaps, so this is not just a calendar-span award.`;
  }
  if(key === 'penalty'){
    if(penalty === 0){
      return `${f.fighter}'s Loss Context percentile is high because he carries no scored UFC loss penalty in the current model. Clean records and weird technical results are handled with context rather than blindly counted.`;
    }
    return `${f.fighter}'s Loss Context percentile reflects ${penalty.toFixed(2)} points of score drag under the locked rules. Pre-prime losses, prime losses, finishes, post-prime losses, and upward-division elite losses are treated differently.`;
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
    <h3>${label}: ${ordinal(pctScore)} percentile <span class="meta">· #${rank || '—'} in category · ${tier.label}</span></h3>
    <p>${categoryLogicSentence(f, key) || description}</p>
    <p><strong>What this category is really testing:</strong> ${description}</p>
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


'''
s = s[:start] + new_block + s[end:]

# Ensure category cards/explainer are inserted into the profile if the source does not already have them.
s = s.replace('<p class="profile-copy">${override.oneLiner || `${f.fighter}\\\'s UFC resume is graded across championship success, quality wins, prime dominance, and longevity.`}</p>', '<p class="profile-copy">${override.oneLiner || `${f.fighter}\\\'s UFC resume is graded across championship success, quality wins, prime dominance, and longevity.`}</p><div class="tap-hint">Tap any category card for fighter-specific scoring context.</div>')
s = s.replace('<div class="category-grid">${categoryCards(f)}</div>', '<div class="category-grid">${categoryCards(f)}</div>\n    <div id="categoryExplanation" class="category-explainer"><h3>Category Breakdown</h3><p>Tap any category to see the fighter-specific scoring logic, raw inputs, and why the percentile/rank lands there.</p></div>')
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
      <tr><td><strong>Loss Context</strong></td><td>How clean the UFC loss record is after timing, opponent quality, finish context, and division context.</td></tr>
    </tbody></table></div>
    <div class="card"><h3>Division Strength</h3><table class="table"><thead><tr><th>Division/Era</th><th>Multiplier</th><th>Rationale</th></tr></thead><tbody>${divRows}</tbody></table></div>
    <div class="card"><h3>Model Note</h3><p>Overall fighter score remains an OVR. Category cards are percentile-style scores so they read as category standing instead of mini-overalls.</p></div>""")

path.write_text(s)

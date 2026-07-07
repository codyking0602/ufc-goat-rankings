// Octagon Verdict Compare Launcher
// Stable GPT matchup launcher for the Compare tab.
(function(){
  const GPT_URL = window.OCTAGON_VERDICT_GPT_URL || 'https://chatgpt.com/g/g-6a4c40425d4881919ddebc7231bff09f-octagon-verdict';
  let rendering = false;

  function $(id){ return document.getElementById(id); }
  function data(){ return window.RANKING_DATA || {}; }
  function overrides(){ return window.DISPLAY_OVERRIDES || {}; }
  function rows(){ return [...(data().men || []), ...(data().women || [])]; }
  function profiles(){ return data().fighters || []; }
  function profileMap(){ return Object.fromEntries(profiles().map(f => [f.fighter, f])); }
  function rowFor(name){ return rows().find(r => r.fighter === name) || { fighter: name }; }
  function fullRow(name){ return { ...(profileMap()[name] || {}), ...rowFor(name), fighter: name }; }
  function fmt(n, digits=2){ return (n === null || n === undefined || n === '' || !Number.isFinite(Number(n))) ? '—' : Number(n).toFixed(digits); }
  function pct(n){ return (n === null || n === undefined || n === '' || !Number.isFinite(Number(n))) ? '—' : `${Number(n).toFixed(1)}%`; }
  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
  function initials(name){ return String(name||'').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase() || 'UFC'; }
  function cleanOpponentName(name){ return String(name || '').replace(/\s+\d+$/, '').trim(); }

  function root(){
    let node = $('octagonVerdictLauncher');
    if(node) return node;
    node = document.createElement('div');
    node.id = 'octagonVerdictLauncher';
    node.className = 'ov-launcher';
    const result = $('compareResult');
    const controls = document.querySelector('#compare .compare-controls');
    if(result && result.parentNode){
      result.parentNode.insertBefore(node, result);
    } else if(controls && controls.parentNode){
      controls.parentNode.insertBefore(node, controls.nextSibling);
    }
    return node;
  }

  function overallOvr(f){
    const o = overrides()[f.fighter];
    if(o?.overallOvr) return o.overallOvr;
    const max = Math.max(...rows().map(x => Number(x.totalScore || 0)), 1);
    return clamp(Math.round(75 + ((Number(f.totalScore) || 0) / max) * 24), 60, 99);
  }
  function rankFor(f){ return overrides()[f.fighter]?.allTimeRank || f.rank || '—'; }
  function divisionFor(f){ return overrides()[f.fighter]?.divisionLabel || [f.primaryDivision, f.secondaryDivision].filter(Boolean).join(' / ') || '—'; }
  function photoFor(f){ return overrides()[f.fighter]?.thumbUrl || overrides()[f.fighter]?.photoUrl || ''; }
  function statBridge(f){ return overrides()[f.fighter]?.packetProfileStats || overrides()[f.fighter]?.snapshotStats || {}; }
  function titleFightWins(f){
    const stats = statBridge(f);
    if(stats.titleFightWins !== undefined) return stats.titleFightWins;
    const title = f.title || {};
    const noteMatch = String(title.notes || '').match(/Total title fight wins = ([0-9.]+)/);
    if(noteMatch) return Number(noteMatch[1]);
    const total = Number(title.normalTitleWins || 0) + Number(title.interimTitleWins || 0) + Number(title.vacantUndisputedWins || 0) + Number(title.secondDivisionUndisputedWins || 0) + Number(title.vacantSecondDivisionWins || 0);
    return total || '—';
  }
  function eliteWins(f){ const stats = statBridge(f); return stats.eliteWins !== undefined ? stats.eliteWins : (f.eliteWins ?? '—'); }
  function primeRecord(f){ const stats = statBridge(f); return stats.primeRecord || f.primeRecord || f.primeUfcRecord || '—'; }
  function activeEliteYears(f){ const stats = statBridge(f); return stats.activeEliteYears ?? f.activeEliteYears; }
  function finishRate(f){ const stats = statBridge(f); return stats.finishRatePct ?? f.finishRatePct; }
  function bestWins(f, count=4){
    const opps = Array.isArray(f.opponents) ? [...f.opponents] : [];
    const picked = [];
    opps.sort((a,b)=>Number(b.credit||0)-Number(a.credit||0)).forEach(o => {
      const n = cleanOpponentName(o.opponent);
      if(n && !picked.includes(n)) picked.push(n);
    });
    return picked.slice(0,count);
  }
  function matchupKey(a,b){ return [a,b].sort().join('::'); }
  function special(frame, swing, edges){ return { frame, swing, edges }; }
  const SPECIAL = {
    [matchupKey('Francis Ngannou','Tony Ferguson')]: special('Championship peak vs lightweight streak depth','Official title peak vs deeper division grind',{'Francis Ngannou':'Championship case','Tony Ferguson':'Longevity / contender run'}),
    [matchupKey('Khabib Nurmagomedov','Islam Makhachev')]: special('Clean dominance vs growing championship volume','Undefeated aura vs fuller current title work',{'Khabib Nurmagomedov':'Cleaner peak','Islam Makhachev':'Title-fight volume'}),
    [matchupKey('Jon Jones','Georges St-Pierre')]: special('Bigger championship case vs cleaner all-time case','Volume and top-end value vs fewer debate complications',{'Jon Jones':'Championship scale','Georges St-Pierre':'Cleaner case'}),
    [matchupKey('Kamaru Usman','Max Holloway')]: special('Championship peak vs deeper overall case','Title reign authority vs quality-win volume',{'Kamaru Usman':'Champion dominance','Max Holloway':'Elite longevity'}),
    [matchupKey('Alexander Volkanovski','Max Holloway')]: special('Rivalry edge vs long-run volume','Direct rivalry resume results vs broader body of work',{'Alexander Volkanovski':'Direct rivalry case','Max Holloway':'Career depth'}),
    [matchupKey('Amanda Nunes','Valentina Shevchenko')]: special('Two-division finishing dominance vs technical longevity','Finishing peak vs long-form control',{'Amanda Nunes':'Bigger title case','Valentina Shevchenko':'Technical reign depth'}),
    [matchupKey('Zhang Weili','Rose Namajunas')]: special('Overall championship strength vs direct rivalry problem','Board strength vs direct rivalry credit',{'Zhang Weili':'Sustained title strength','Rose Namajunas':'Direct rivalry wins'})
  };
  const CATEGORY_LABELS = { championship:'Championship case', opponentQuality:'Quality wins', primeDominance:'Prime dominance', longevity:'Elite longevity', penalty:'Loss context' };
  function bestCategoryEdge(f,g){
    const keys = ['championship','opponentQuality','primeDominance','longevity'];
    const winner = keys.map(key => ({ key, gap: Number(f[key] || 0) - Number(g[key] || 0) })).sort((x,y)=>Math.abs(y.gap)-Math.abs(x.gap))[0];
    return winner ? (CATEGORY_LABELS[winner.key] || 'Overall case') : 'Overall case';
  }
  function debateFrame(a,b){
    const found = SPECIAL[matchupKey(a.fighter,b.fighter)];
    if(found) return { frame: found.frame, swing: found.swing, aEdge: found.edges?.[a.fighter] || bestCategoryEdge(a,b), bEdge: found.edges?.[b.fighter] || bestCategoryEdge(b,a), special: true };
    const aEdge = bestCategoryEdge(a,b);
    const bEdge = bestCategoryEdge(b,a);
    return { frame: aEdge === bEdge ? `${aEdge} and overall case separation` : `${aEdge} vs ${bEdge}`, aEdge, bEdge, swing: 'Current score gap, title work, quality wins, and loss context' };
  }
  function leanText(a,b){
    const av = Number(a.totalScore || 0);
    const bv = Number(b.totalScore || 0);
    const gap = Math.abs(av-bv);
    if(!Number.isFinite(av) || !Number.isFinite(bv) || av === bv) return { name: 'Essentially even', tone: '', gap: '—' };
    const leader = av > bv ? a : b;
    let tone = 'narrowly';
    if(gap >= 10) tone = 'strongly';
    else if(gap >= 5) tone = 'clearly';
    return { name: leader.fighter, tone, gap: fmt(gap, 2) };
  }
  function oneLine(f){ return overrides()[f.fighter]?.resumeTag || overrides()[f.fighter]?.oneLiner || 'Current ranking case'; }
  function fighterCard(f, sideLabel){
    const wins = bestWins(f,4);
    const photo = photoFor(f);
    return `<article class="ov-card">
      <div class="ov-card-photo">${photo ? `<img src="${photo}" alt="${f.fighter} profile photo">` : `<span>${initials(f.fighter)}</span>`}</div>
      <div class="ov-card-body">
        <div class="ov-kicker">${sideLabel}</div>
        <h3>${f.fighter}</h3>
        <div class="ov-card-meta"><b>#${rankFor(f)}</b><span>${overallOvr(f)} OVR</span><span>${divisionFor(f)}</span></div>
        <p class="ov-one-line">${oneLine(f)}</p>
        <div class="ov-stat-grid">
          <div><strong>${f.ufcRecord || '—'}</strong><small>UFC record</small></div>
          <div><strong>${titleFightWins(f)}</strong><small>Title wins</small></div>
          <div><strong>${eliteWins(f)}</strong><small>Elite wins</small></div>
          <div><strong>${fmt(activeEliteYears(f), 2)}</strong><small>Elite years</small></div>
        </div>
        <div class="ov-mini-line"><strong>Prime:</strong> ${primeRecord(f)}</div>
        <div class="ov-mini-line"><strong>Finish:</strong> ${pct(finishRate(f))}</div>
        ${wins.length ? `<div class="ov-wins"><strong>Key wins:</strong> ${wins.join(', ')}</div>` : ''}
      </div>
    </article>`;
  }
  function copyText(text){
    if(navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly','');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    return Promise.resolve();
  }
  function toast(message){
    let node = document.querySelector('.ov-toast');
    if(!node){ node = document.createElement('div'); node.className = 'ov-toast'; document.body.appendChild(node); }
    node.textContent = message;
    node.classList.add('show');
    setTimeout(()=>node.classList.remove('show'), 1800);
  }
  function render(){
    const node = root();
    const selA = $('fighterA');
    const selB = $('fighterB');
    if(!node || !selA || !selB || !window.RANKING_DATA || rendering) return;
    const a = fullRow(selA.value);
    const b = fullRow(selB.value);
    if(!a.fighter || !b.fighter) return;
    rendering = true;
    const title = document.querySelector('#compare .section-title h2');
    const subtitle = document.querySelector('#compare .section-title p');
    if(title) title.textContent = 'Octagon Verdict';
    if(subtitle) subtitle.textContent = 'Pick two fighters. Copy the matchup. Settle the greatness case in the GPT.';
    const frame = debateFrame(a,b);
    const lean = leanText(a,b);
    const matchup = `${a.fighter} vs ${b.fighter}`;
    node.innerHTML = `
      <section class="ov-hero-card">
        <p class="ov-eyebrow">Greatness comparison</p>
        <h2>${matchup}</h2>
        <p>The cards show the board context; Octagon Verdict handles the full debate.</p>
        <div class="ov-cta-row">
          <button type="button" class="ghost ov-copy-btn">Copy Matchup</button>
          <button type="button" class="ghost ov-open-btn">Open Octagon Verdict</button>
        </div>
      </section>
      <section class="ov-matchup-grid">
        ${fighterCard(a,'Fighter A')}
        <div class="ov-vs">VS</div>
        ${fighterCard(b,'Fighter B')}
      </section>
      <section class="ov-verdict-strip">
        <div><small>Current board lean</small><strong>${lean.name}${lean.tone ? `, ${lean.tone}` : ''}</strong></div>
        <div><small>This debate comes down to</small><strong>${frame.frame}</strong></div>
        <div><small>Swing point</small><strong>${frame.swing}</strong></div>
      </section>
      <section class="ov-quick-case">
        <div class="card"><h3>${a.fighter} edge</h3><p>${frame.aEdge || bestCategoryEdge(a,b)}</p></div>
        <div class="card"><h3>${b.fighter} edge</h3><p>${frame.bEdge || bestCategoryEdge(b,a)}</p></div>
      </section>
    `;
    node.querySelector('.ov-copy-btn')?.addEventListener('click', () => { copyText(matchup).then(()=>toast(`Copied: ${matchup}`)); });
    node.querySelector('.ov-open-btn')?.addEventListener('click', () => { window.open(GPT_URL, '_blank', 'noopener,noreferrer'); });
    rendering = false;
  }
  function installStyles(){
    if(document.getElementById('octagon-verdict-compare-launcher-css')) return;
    const style = document.createElement('style');
    style.id = 'octagon-verdict-compare-launcher-css';
    style.textContent = `
      #compare.active-view{overflow:visible!important;min-height:120vh}#compare.active-view #compareResult{display:none!important}#octagonVerdictLauncher{display:grid;gap:14px;padding-bottom:40px}.ov-launcher,.ov-launcher *{box-sizing:border-box}.ov-launcher h2,.ov-launcher h3,.ov-launcher strong,.ov-launcher b{color:#f8fafc!important}.ov-launcher p,.ov-launcher small,.ov-mini-line,.ov-wins{color:#cbd5e1!important}.ov-hero-card{border:1px solid rgba(250,204,21,.38);background:linear-gradient(135deg,rgba(249,115,22,.20),rgba(17,24,39,.96));border-radius:24px;padding:18px;box-shadow:0 22px 70px rgba(0,0,0,.18)}.ov-hero-card h2{margin:3px 0 6px;font-size:clamp(30px,4vw,52px);line-height:.96}.ov-eyebrow{color:#fde047!important;text-transform:uppercase;letter-spacing:.14em;font-size:12px;font-weight:900}.ov-cta-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}.ov-cta-row .ghost{background:#fff!important;color:#111827!important;border-color:#e5e7eb!important}.ov-cta-row .ov-copy-btn{background:#f97316!important;border-color:#f97316!important}.ov-matchup-grid{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:14px;align-items:stretch}.ov-card{display:grid;grid-template-columns:112px minmax(0,1fr);gap:14px;border:1px solid rgba(148,163,184,.30);background:linear-gradient(180deg,#1f314d,#111827);border-radius:22px;padding:14px;min-width:0;overflow:hidden}.ov-card-photo{width:112px;min-height:146px;border-radius:18px;overflow:hidden;background:#0f172a;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:950;color:#f8fafc;border:1px solid rgba(255,255,255,.08)}.ov-card-photo img{width:100%;height:100%;object-fit:cover;object-position:center 10%;display:block}.ov-card-body h3{margin:2px 0 7px;font-size:26px;line-height:1}.ov-kicker{color:#fde047!important;font-weight:900;font-size:11px;text-transform:uppercase;letter-spacing:.12em}.ov-card-meta{display:flex;flex-wrap:wrap;gap:7px;margin:0 0 10px}.ov-card-meta b,.ov-card-meta span{border:1px solid rgba(148,163,184,.35);border-radius:999px;padding:5px 8px;font-size:11px;color:#f8fafc!important;font-weight:900;background:rgba(15,23,42,.35)}.ov-card-meta b{background:rgba(250,204,21,.14);color:#fde68a!important;border-color:rgba(250,204,21,.35)}.ov-one-line{margin-bottom:10px!important}.ov-stat-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:10px 0}.ov-stat-grid div{border:1px solid rgba(148,163,184,.35);border-radius:12px;padding:8px;background:rgba(15,23,42,.52)}.ov-stat-grid strong,.ov-stat-grid small{display:block}.ov-stat-grid small{font-size:11px;margin-top:2px}.ov-vs{align-self:center;border:1px solid rgba(250,204,21,.36);background:rgba(250,204,21,.10);color:#fde68a;border-radius:999px;width:54px;height:54px;display:flex;align-items:center;justify-content:center;font-weight:950;letter-spacing:.08em}.ov-verdict-strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.ov-verdict-strip div{border:1px solid rgba(148,163,184,.28);border-radius:18px;padding:14px;background:rgba(17,24,39,.92)}.ov-verdict-strip small{display:block;text-transform:uppercase;letter-spacing:.08em;font-weight:850;font-size:11px;margin-bottom:5px}.ov-verdict-strip strong{font-size:18px;line-height:1.15}.ov-quick-case{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.ov-quick-case .card{background:linear-gradient(180deg,#18243a,#111827)!important;border-color:rgba(148,163,184,.28)!important}.ov-quick-case .card h3{margin-top:0}.ov-quick-case .card p{margin-bottom:0}.ov-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(16px);background:#111827;border:1px solid rgba(250,204,21,.35);color:#fde68a;border-radius:999px;padding:10px 14px;font-weight:900;opacity:0;pointer-events:none;z-index:60;transition:.18s ease}.ov-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}@media(max-width:900px){#compare.active-view{min-height:140vh}.ov-hero-card{padding:16px}.ov-hero-card h2{font-size:31px}.ov-matchup-grid{grid-template-columns:1fr}.ov-vs{width:100%;height:auto;padding:8px}.ov-card{grid-template-columns:72px minmax(0,1fr);gap:12px;padding:12px;border-radius:20px}.ov-card-photo{width:72px;min-height:116px;border-radius:15px;font-size:24px}.ov-card-body h3{font-size:22px}.ov-card-meta{gap:5px}.ov-card-meta b,.ov-card-meta span{font-size:10px;padding:4px 7px}.ov-stat-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.ov-stat-grid div{padding:7px}.ov-mini-line,.ov-wins{font-size:12px}.ov-verdict-strip,.ov-quick-case{grid-template-columns:1fr}.ov-cta-row .ghost{width:auto;min-width:0}}
    `;
    document.head.appendChild(style);
  }
  function install(){
    installStyles();
    const controls = document.querySelector('.compare-controls');
    if(controls) controls.classList.add('ov-controls');
    ['fighterA','fighterB'].forEach(id => $(id)?.addEventListener('change', () => setTimeout(render, 0)));
    document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => setTimeout(render, 0)));
    setTimeout(render, 50);
    setTimeout(render, 500);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
  window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER = { render, version: '20260706d' };
})();

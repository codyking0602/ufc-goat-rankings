// Octagon Verdict Compare Launcher
// Simple GPT matchup launcher for the Compare tab.
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
  function fullRow(name){ return { ...(profileMap()[name] || {}), ...rowFor(name), ...(FALLBACK_STATS[name] || {}), fighter: name }; }
  function fmt(n, digits=2){ return (n === null || n === undefined || n === '' || !Number.isFinite(Number(n))) ? '—' : Number(n).toFixed(digits); }
  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }

  const FALLBACK_STATS = {
    'Henry Cejudo': {
      ufcRecord: '10-6',
      eliteWins: 5,
      activeEliteYears: 6.75,
      primeRecord: '6-3 title/elite window',
      finishRatePct: 36.4,
      titleFightWins: 4,
      oneLineFallback: 'Two-division Olympic-to-UFC title case'
    }
  };

  function root(){
    let node = $('octagonVerdictLauncher');
    if(node) return node;
    node = document.createElement('div');
    node.id = 'octagonVerdictLauncher';
    node.className = 'ov-launcher';
    const result = $('compareResult');
    const controls = document.querySelector('#compare .compare-controls');
    if(result && result.parentNode) result.parentNode.insertBefore(node, result);
    else if(controls && controls.parentNode) controls.parentNode.insertBefore(node, controls.nextSibling);
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
  function statBridge(f){ return overrides()[f.fighter]?.packetProfileStats || overrides()[f.fighter]?.snapshotStats || {}; }
  function titleFightWins(f){
    if(f.titleFightWins !== undefined) return f.titleFightWins;
    const stats = statBridge(f);
    if(stats.titleFightWins !== undefined) return stats.titleFightWins;
    const title = f.title || {};
    const noteMatch = String(title.notes || '').match(/Total title fight wins = ([0-9.]+)/);
    if(noteMatch) return Number(noteMatch[1]);
    if(title.adjustedTitleWins !== undefined) return title.adjustedTitleWins;
    const total = Number(title.normalTitleWins || 0) + Number(title.interimTitleWins || 0) + Number(title.vacantUndisputedWins || 0) + Number(title.secondDivisionUndisputedWins || 0) + Number(title.vacantSecondDivisionWins || 0);
    return total || '—';
  }
  function eliteWins(f){
    const stats = statBridge(f);
    if(stats.eliteWins !== undefined) return stats.eliteWins;
    if(f.eliteWins !== undefined) return f.eliteWins;
    if(Array.isArray(f.opponents) && f.opponents.length) return f.opponents.filter(o => Number(o.credit || 0) >= 0.75).length || '—';
    return '—';
  }
  function activeEliteYears(f){ const stats = statBridge(f); return stats.activeEliteYears ?? f.activeEliteYears; }
  function oneLine(f){ return overrides()[f.fighter]?.resumeTag || overrides()[f.fighter]?.oneLiner || f.oneLineFallback || 'Current ranking case'; }

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

  function fighterCard(f, sideLabel){
    return `<article class="ov-fighter-card">
      <div class="ov-kicker">${sideLabel}</div>
      <h3>${f.fighter}</h3>
      <div class="ov-card-meta"><b>#${rankFor(f)}</b><span>${overallOvr(f)} OVR</span><span>${divisionFor(f)}</span></div>
      <p>${oneLine(f)}</p>
      <div class="ov-stat-grid">
        <div><strong>${f.ufcRecord || '—'}</strong><small>UFC record</small></div>
        <div><strong>${titleFightWins(f)}</strong><small>Title wins</small></div>
        <div><strong>${eliteWins(f)}</strong><small>Elite wins</small></div>
        <div><strong>${fmt(activeEliteYears(f), 2)}</strong><small>Elite years</small></div>
      </div>
    </article>`;
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
    if(subtitle) subtitle.textContent = 'Pick two fighters. Copy the matchup. Get the verdict.';
    const matchup = `${a.fighter} vs ${b.fighter}`;
    node.innerHTML = `
      <section class="ov-action-card">
        <p class="ov-eyebrow">${matchup}</p>
        <div class="ov-cta-row">
          <button type="button" class="ghost ov-copy-btn">Copy Matchup</button>
          <button type="button" class="ghost ov-open-btn">Open Octagon Verdict</button>
        </div>
      </section>
      <section class="ov-card-grid">
        ${fighterCard(a,'Fighter A')}
        ${fighterCard(b,'Fighter B')}
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
      #compare.active-view{overflow:visible!important;min-height:100vh}#compare.active-view #compareResult{display:none!important}#octagonVerdictLauncher{display:grid;gap:12px;padding-bottom:36px}.ov-launcher,.ov-launcher *{box-sizing:border-box}.ov-launcher h3,.ov-launcher strong,.ov-launcher b{color:#f8fafc!important}.ov-launcher p,.ov-launcher small{color:#cbd5e1!important}.ov-action-card,.ov-fighter-card{border:1px solid rgba(148,163,184,.30);background:linear-gradient(180deg,#1f314d,#111827);border-radius:20px;padding:14px;box-shadow:0 18px 50px rgba(0,0,0,.14)}.ov-action-card{border-color:rgba(250,204,21,.36);background:linear-gradient(135deg,rgba(249,115,22,.18),rgba(17,24,39,.96))}.ov-eyebrow{color:#fde047!important;text-transform:uppercase;letter-spacing:.12em;font-size:12px;font-weight:900;margin:0 0 12px}.ov-cta-row{display:flex;flex-wrap:wrap;gap:10px}.ov-cta-row .ghost{background:#fff!important;color:#111827!important;border-color:#e5e7eb!important;width:auto!important;min-width:0}.ov-cta-row .ov-copy-btn{background:#f97316!important;border-color:#f97316!important}.ov-card-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.ov-kicker{color:#fde047!important;font-weight:900;font-size:11px;text-transform:uppercase;letter-spacing:.12em}.ov-fighter-card h3{margin:4px 0 8px;font-size:26px;line-height:1}.ov-card-meta{display:flex;flex-wrap:wrap;gap:7px;margin:0 0 10px}.ov-card-meta b,.ov-card-meta span{border:1px solid rgba(148,163,184,.35);border-radius:999px;padding:5px 8px;font-size:11px;color:#f8fafc!important;font-weight:900;background:rgba(15,23,42,.35)}.ov-card-meta b{background:rgba(250,204,21,.14);color:#fde68a!important;border-color:rgba(250,204,21,.35)}.ov-fighter-card p{margin:0 0 10px!important;line-height:1.35}.ov-stat-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.ov-stat-grid div{border:1px solid rgba(148,163,184,.35);border-radius:12px;padding:8px;background:rgba(15,23,42,.52)}.ov-stat-grid strong,.ov-stat-grid small{display:block}.ov-stat-grid small{font-size:11px;margin-top:2px}.ov-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(16px);background:#111827;border:1px solid rgba(250,204,21,.35);color:#fde68a;border-radius:999px;padding:10px 14px;font-weight:900;opacity:0;pointer-events:none;z-index:60;transition:.18s ease}.ov-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}@media(max-width:900px){#octagonVerdictLauncher{gap:10px}.ov-action-card,.ov-fighter-card{padding:12px;border-radius:18px}.ov-card-grid{grid-template-columns:1fr;gap:10px}.ov-fighter-card h3{font-size:24px}.ov-card-meta{gap:5px}.ov-card-meta b,.ov-card-meta span{font-size:10px;padding:4px 7px}.ov-stat-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.ov-stat-grid div{padding:7px}.ov-cta-row .ghost{width:auto!important}}
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
  window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER = { render, version: '20260706f' };
})();

// Octagon Verdict Compare Launcher: always uses the current calculated app payload.
(function(){
  'use strict';
  const VERSION='octagon-verdict-compare-launcher-20260716b-intelligence-skip';
  const GPT_URL=window.OCTAGON_VERDICT_GPT_URL||'https://chatgpt.com/g/g-6a4c40425d4881919ddebc7231bff09f-octagon-verdict';
  let rendering=false;
  const $=id=>document.getElementById(id);
  const data=()=>window.RANKING_DATA||{};
  const rows=()=>[...(data().men||[]),...(data().women||[])];
  const profiles=()=>data().fighters||[];
  const profileMap=()=>Object.fromEntries(profiles().map(f=>[f.fighter,f]));
  const overrides=()=>window.DISPLAY_OVERRIDES||{};
  const packets=()=>window.UFC_FIGHTER_PACKETS||{};
  const rowFor=name=>rows().find(r=>r.fighter===name)||{fighter:name};
  const fullRow=name=>({...profileMap()[name],...rowFor(name),fighter:name});
  const finite=value=>Number.isFinite(Number(value))?Number(value):undefined;
  const firstDefined=(...values)=>values.find(value=>value!==undefined&&value!==null&&value!=='');
  const fmt=(value,digits=1)=>finite(value)===undefined?'—':finite(value).toFixed(digits);
  const overrideFor=f=>overrides()[f.fighter]||{};
  const packetFor=f=>packets()[f.fighter]||{};
  const statBridge=f=>({...packetFor(f).profileStats,...overrideFor(f).packetProfileStats,...overrideFor(f).snapshotStats});
  const overallOvrFor=f=>finite(f.overallOvr)??82;
  const rankFor=f=>firstDefined(f.rank,'—');
  const divisionFor=f=>firstDefined(overrideFor(f).divisionLabel,[f.primaryDivision,f.secondaryDivision].filter(Boolean).join(' / '),f.division,'—');
  const oneLine=f=>firstDefined(overrideFor(f).resumeTag,overrideFor(f).oneLiner,overrideFor(f).compareProfile?.shortCase,f.resumeTag,'Current ranking case');
  const copyText=text=>navigator.clipboard?.writeText?navigator.clipboard.writeText(text):Promise.resolve();
  const intelligenceOwnsCompare=()=>Boolean(document.querySelector('#compare.intelligence-view'));
  function removeLegacyLauncher(){document.getElementById('octagonVerdictLauncher')?.remove();}
  function toast(message){let node=document.querySelector('.ov-toast');if(!node){node=document.createElement('div');node.className='ov-toast';document.body.appendChild(node);}node.textContent=message;node.classList.add('show');setTimeout(()=>node.classList.remove('show'),1800);}
  function root(){
    if(intelligenceOwnsCompare()){
      removeLegacyLauncher();
      return null;
    }
    let node=$('octagonVerdictLauncher');
    if(node)return node;
    node=document.createElement('div');
    node.id='octagonVerdictLauncher';
    node.className='ov-launcher';
    const result=$('compareResult');
    const controls=document.querySelector('#compare .compare-controls');
    if(result?.parentNode)result.parentNode.insertBefore(node,result);
    else if(controls?.parentNode)controls.parentNode.insertBefore(node,controls.nextSibling);
    return node;
  }
  function fighterCard(f,sideLabel){const stats=statBridge(f);return `<article class="ov-fighter-card"><div class="ov-kicker">${sideLabel}</div><h3>${f.fighter}</h3><div class="ov-card-meta"><b>#${rankFor(f)}</b><span>${overallOvrFor(f)} OVR</span><span>${divisionFor(f)}</span></div><p>${oneLine(f)}</p><div class="ov-stat-grid"><div><strong>${f.ufcRecord||stats.ufcRecord||'—'}</strong><small>UFC record</small></div><div><strong>${f.titleFightWins??stats.titleFightWins??'—'}</strong><small>Title-fight wins</small></div><div><strong>${f.topFiveWins??stats.topFiveWins??'—'}</strong><small>Top-5 wins</small></div><div><strong>${fmt(f.activeEliteYears??stats.activeEliteYears,1)}</strong><small>Elite years</small></div></div></article>`;}
  function matchupPayload(a,b){return window.UFC_OCTAGON_VERDICT_DATA?.matchup?.(a.fighter,b.fighter)||{fighters:[a,b]};}
  function verdictPrompt(a,b){return `Use the attached live UFC-only model payload to compare ${a.fighter} vs ${b.fighter}. Start with the verdict. Separate better fighter from better UFC-only GOAT resume. Give the losing fighter's real counterargument, explain why the winner still wins, and avoid spreadsheet-style narration.\n\n${JSON.stringify(matchupPayload(a,b),null,2)}`;}
  function render(){
    if(intelligenceOwnsCompare()){
      removeLegacyLauncher();
      return;
    }
    const node=root();
    const selA=$('fighterA');
    const selB=$('fighterB');
    if(!node||!selA||!selB||!window.RANKING_DATA||rendering)return;
    const a=fullRow(selA.value);
    const b=fullRow(selB.value);
    rendering=true;
    const title=document.querySelector('#compare .section-title h2');
    const subtitle=document.querySelector('#compare .section-title p');
    if(title)title.textContent='Octagon Verdict';
    if(subtitle)subtitle.textContent='Pick two fighters. Copy the live model payload or open the verdict GPT.';
    node.innerHTML=`<section class="ov-action-card"><p class="ov-eyebrow">${a.fighter} vs ${b.fighter}</p><div class="ov-cta-row"><button type="button" class="ghost ov-copy-btn">Copy Live Matchup</button><button type="button" class="ghost ov-download-btn">Download Full JSON</button><button type="button" class="ghost ov-open-btn">Open Octagon Verdict</button></div><p class="meta">The copied matchup includes current ranks, OVRs, categories, resume stats, division-ledger shares, and judgment copy.</p></section><section class="ov-card-grid">${fighterCard(a,'Fighter A')}${fighterCard(b,'Fighter B')}</section>`;
    node.querySelector('.ov-copy-btn')?.addEventListener('click',()=>copyText(verdictPrompt(a,b)).then(()=>toast('Live matchup data copied')));
    node.querySelector('.ov-download-btn')?.addEventListener('click',()=>{window.UFC_OCTAGON_VERDICT_DATA?.download?.();toast('Current 73-fighter JSON downloaded');});
    node.querySelector('.ov-open-btn')?.addEventListener('click',()=>window.open(GPT_URL,'_blank','noopener,noreferrer'));
    rendering=false;
  }
  function installStyles(){if(document.getElementById('octagon-verdict-compare-launcher-css'))return;const style=document.createElement('style');style.id='octagon-verdict-compare-launcher-css';style.textContent=`#compare.active-view{overflow:visible!important;min-height:100vh}#compare.active-view #compareResult{display:none!important}#octagonVerdictLauncher{display:grid;gap:12px;padding-bottom:36px}.ov-launcher,.ov-launcher *{box-sizing:border-box}.ov-launcher h3,.ov-launcher strong,.ov-launcher b{color:#f8fafc!important}.ov-launcher p,.ov-launcher small{color:#cbd5e1!important}.ov-action-card,.ov-fighter-card{border:1px solid rgba(148,163,184,.30);background:linear-gradient(180deg,#1f314d,#111827);border-radius:20px;padding:14px;box-shadow:0 18px 50px rgba(0,0,0,.14)}.ov-action-card{border-color:rgba(250,204,21,.36);background:linear-gradient(135deg,rgba(249,115,22,.18),rgba(17,24,39,.96))}.ov-eyebrow{color:#fde047!important;text-transform:uppercase;letter-spacing:.12em;font-size:12px;font-weight:900;margin:0 0 12px}.ov-cta-row{display:flex;flex-wrap:wrap;gap:10px}.ov-cta-row .ghost{background:#fff!important;color:#111827!important;border-color:#e5e7eb!important;width:auto!important;min-width:0}.ov-cta-row .ov-copy-btn{background:#f97316!important;border-color:#f97316!important}.ov-card-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.ov-kicker{color:#fde047!important;font-weight:900;font-size:11px;text-transform:uppercase;letter-spacing:.12em}.ov-fighter-card h3{margin:4px 0 8px;font-size:26px;line-height:1}.ov-card-meta{display:flex;flex-wrap:wrap;gap:7px;margin:0 0 10px}.ov-card-meta b,.ov-card-meta span{border:1px solid rgba(148,163,184,.35);border-radius:999px;padding:5px 8px;font-size:11px;color:#f8fafc!important;font-weight:900;background:rgba(15,23,42,.35)}.ov-card-meta b{background:rgba(250,204,21,.14);color:#fde68a!important;border-color:rgba(250,204,21,.35)}.ov-fighter-card p{margin:0 0 10px!important;line-height:1.35}.ov-stat-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.ov-stat-grid div{border:1px solid rgba(148,163,184,.35);border-radius:12px;padding:8px;background:rgba(15,23,42,.52)}.ov-stat-grid strong,.ov-stat-grid small{display:block}.ov-stat-grid small{font-size:11px;margin-top:2px}.ov-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(16px);background:#111827;border:1px solid rgba(250,204,21,.35);color:#fde68a;border-radius:999px;padding:10px 14px;font-weight:900;opacity:0;pointer-events:none;z-index:60;transition:.18s ease}.ov-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}@media(max-width:900px){.ov-card-grid{grid-template-columns:1fr}.ov-stat-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.ov-cta-row .ghost{width:auto!important}}`;document.head.appendChild(style);}
  function install(){
    if(intelligenceOwnsCompare()){
      removeLegacyLauncher();
      return;
    }
    installStyles();
    document.querySelector('.compare-controls')?.classList.add('ov-controls');
    ['fighterA','fighterB'].forEach(id=>$(id)?.addEventListener('change',()=>setTimeout(render,0)));
    document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>setTimeout(render,0)));
    window.addEventListener?.('ufc-scoring-pipeline-ready',()=>setTimeout(render,0));
    window.addEventListener?.('octagon-verdict-data-ready',()=>setTimeout(render,0));
    setTimeout(render,50);
    setTimeout(render,600);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
  window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER={render,version:VERSION};
})();

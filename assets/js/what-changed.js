(function(){
  'use strict';

  const VERSION='what-changed-20260718a-phase-2d';
  const SOURCE=window.OCTAGON_CHANGELOG||{entries:[],timezone:'America/Chicago',seenStorageKey:'octagon-hq-what-changed-seen-v1'};
  const TYPE_META={
    'Fighter Added':['ADD','Fighter Added'],
    'Audit Completed':['AUDIT','Audit Completed'],
    'Rank Changed':['RANK','Rank Changed'],
    'OVR Changed':['OVR','OVR Changed'],
    'Watch Moment Added':['WATCH','Watch Moment Added'],
    'Game Updated':['GAME','Game Updated'],
    'Picks Updated':['PICKS','Picks Updated'],
    'War Room Updated':['WAR','War Room Updated'],
    'App Updated':['APP','App Updated']
  };
  const state={installed:false,rendered:false,open:false,returnFocus:null};

  const text=value=>String(value??'').trim();
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const slugify=value=>text(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const entries=()=>Array.isArray(SOURCE.entries)?[...SOURCE.entries].sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt)):[];
  function displayOverrides(){
    try{return typeof DISPLAY_OVERRIDES!=='undefined'&&DISPLAY_OVERRIDES?DISPLAY_OVERRIDES:(window.DISPLAY_OVERRIDES||{});}
    catch(_error){return window.DISPLAY_OVERRIDES||{};}
  }

  function readSeen(){
    try{
      const value=JSON.parse(localStorage.getItem(SOURCE.seenStorageKey)||'[]');
      return new Set(Array.isArray(value)?value:[]);
    }catch(_error){return new Set();}
  }
  function markAllSeen(){
    const ids=entries().map(entry=>entry.id).filter(Boolean);
    try{localStorage.setItem(SOURCE.seenStorageKey,JSON.stringify(ids));}catch(_error){}
    window.dispatchEvent(new CustomEvent('octagon-hq:what-changed-seen',{detail:{ids}}));
  }

  function rankingRows(){
    const data=window.RANKING_DATA||{};
    const profiles=Array.isArray(data.fighters)?data.fighters:[];
    const profileMap=new Map(profiles.map(profile=>[profile.fighter,profile]));
    return [...(data.men||[]),...(data.women||[])].map(row=>({...profileMap.get(row.fighter),...row}));
  }
  function calculateOvr(row,rows){
    const override=displayOverrides()[row.fighter]||{};
    const direct=Number(row.overallOvr??row.ovr??override.overallOvr??override.ovr);
    if(Number.isFinite(direct))return direct;
    const max=Math.max(...rows.map(item=>Number(item.totalScore)||0),1);
    return Math.max(60,Math.min(99,Math.round(75+((Number(row.totalScore)||0)/max)*24)));
  }
  function fighterFor(slug){
    if(!slug)return null;
    const rows=rankingRows();
    const row=rows.find(item=>slugify(item.fighter)===slug);
    if(!row)return null;
    const override=displayOverrides()[row.fighter]||{};
    return{
      fighter:row.fighter,
      displayName:override.profileDisplayName||override.displayName||row.fighter,
      photo:override.thumbUrl||override.photoUrl||'',
      rank:Number(row.rank)||null,
      ovr:calculateOvr(row,rows),
      division:override.divisionLabel||row.primaryDivision||row.division||''
    };
  }
  function initials(name){return text(name).split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase()||'UFC';}

  function centralDayParts(date){
    try{
      const parts=new Intl.DateTimeFormat('en-CA',{timeZone:SOURCE.timezone||'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
      return Object.fromEntries(parts.map(part=>[part.type,part.value]));
    }catch(_error){return{year:String(date.getFullYear()),month:String(date.getMonth()+1).padStart(2,'0'),day:String(date.getDate()).padStart(2,'0')};}
  }
  function dayNumber(date){const p=centralDayParts(date);return Date.UTC(Number(p.year),Number(p.month)-1,Number(p.day));}
  function groupLabel(value){
    const date=new Date(value);
    if(Number.isNaN(date.getTime()))return'Earlier';
    const diff=Math.floor((dayNumber(new Date())-dayNumber(date))/86400000);
    if(diff<=0)return'Today';
    if(diff<=7)return'This Week';
    return'Earlier';
  }
  function dateLabel(value){
    const date=new Date(value);
    if(Number.isNaN(date.getTime()))return'';
    try{return new Intl.DateTimeFormat('en-US',{timeZone:SOURCE.timezone||'America/Chicago',month:'short',day:'numeric'}).format(date);}
    catch(_error){return date.toLocaleDateString();}
  }

  function changeMarkup(entry){
    const beforeRank=entry.verified?.beforeRank;
    const afterRank=entry.verified?.afterRank;
    const beforeOvr=entry.verified?.beforeOvr;
    const afterOvr=entry.verified?.afterOvr;
    const rankAtPublish=entry.verified?.rankAtPublish;
    const values=[];
    if(Number.isFinite(Number(beforeRank))&&Number.isFinite(Number(afterRank)))values.push(`<span>#${esc(beforeRank)} → #${esc(afterRank)}</span>`);
    if(Number.isFinite(Number(beforeOvr))&&Number.isFinite(Number(afterOvr)))values.push(`<span>${esc(beforeOvr)} → ${esc(afterOvr)} OVR</span>`);
    if(Number.isFinite(Number(rankAtPublish)))values.push(`<span>Added at #${esc(rankAtPublish)}</span>`);
    return values.length?`<div class="what-changed-verified" aria-label="Verified change values">${values.join('')}</div>`:'';
  }
  function fighterMarkup(entry){
    const fighter=fighterFor(entry.fighterSlug);
    if(!fighter)return'';
    const photo=fighter.photo?`<img src="${esc(fighter.photo)}" alt="">`:`<span>${esc(initials(fighter.displayName))}</span>`;
    return`<div class="what-changed-fighter"><div class="what-changed-avatar">${photo}</div><div><strong>${esc(fighter.displayName)}</strong><small>${fighter.rank?`Current #${fighter.rank}`:'Current rank —'} · ${fighter.ovr} OVR${fighter.division?` · ${esc(fighter.division)}`:''}</small></div></div>`;
  }
  function entryMarkup(entry){
    const [code,label]=TYPE_META[entry.type]||['UPDATE',entry.type||'Update'];
    const actionable=Boolean(entry.fighterSlug||entry.destination);
    const tag=actionable?'button':'article';
    const attrs=actionable?`type="button" data-what-changed-entry="${esc(entry.id)}" aria-label="Open update: ${esc(entry.headline)}"`:'';
    return`<${tag} class="what-changed-entry${actionable?' is-actionable':''}" ${attrs}>
      <div class="what-changed-entry-top"><span class="what-changed-type"><b>${esc(code)}</b>${esc(label)}</span><time datetime="${esc(entry.publishedAt)}">${esc(dateLabel(entry.publishedAt))}</time></div>
      <h3>${esc(entry.headline)}</h3>
      <p>${esc(entry.summary)}</p>
      ${changeMarkup(entry)}
      ${fighterMarkup(entry)}
      ${actionable?'<span class="what-changed-open">Open <i aria-hidden="true">→</i></span>':''}
    </${tag}>`;
  }
  function render(){
    const feed=document.getElementById('whatChangedFeed');
    if(!feed||state.rendered)return;
    const rows=entries();
    if(!rows.length){feed.innerHTML='<div class="what-changed-empty"><strong>No updates yet.</strong><span>The next meaningful Octagon HQ change will appear here.</span></div>';state.rendered=true;return;}
    const groups=new Map();
    rows.forEach(entry=>{const label=groupLabel(entry.publishedAt);if(!groups.has(label))groups.set(label,[]);groups.get(label).push(entry);});
    feed.innerHTML=['Today','This Week','Earlier'].filter(label=>groups.has(label)).map(label=>`<section class="what-changed-group" aria-labelledby="whatChanged${label.replace(/\s/g,'')}"><h2 id="whatChanged${label.replace(/\s/g,'')}">${label}</h2><div>${groups.get(label).map(entryMarkup).join('')}</div></section>`).join('');
    state.rendered=true;
  }

  function installStyles(){
    if(document.getElementById('whatChangedStyles'))return;
    const style=document.createElement('style');
    style.id='whatChangedStyles';
    style.textContent=`
      body.what-changed-open{overflow:hidden;overscroll-behavior:none}
      #whatChangedOverlay[hidden]{display:none!important}#whatChangedOverlay{position:fixed;inset:0;z-index:11000;display:flex;justify-content:flex-end;background:rgba(2,6,14,.78);backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px)}
      #whatChangedDialog{display:flex;flex-direction:column;width:min(560px,100%);height:100%;max-height:100dvh;border-left:1px solid rgba(249,115,22,.35);background:linear-gradient(180deg,#111a2b 0%,#07101d 100%);box-shadow:-30px 0 80px rgba(0,0,0,.52);color:#f8fafc;outline:none;overflow:hidden}
      .what-changed-head{position:relative;flex:0 0 auto;padding:24px 68px 19px 22px;border-bottom:1px solid rgba(148,163,184,.18);background:linear-gradient(145deg,rgba(30,41,59,.88),rgba(9,17,30,.96))}.what-changed-head:before{content:"";position:absolute;inset:0 auto 0 0;width:5px;background:#f97316}.what-changed-kicker{margin:0;color:#fb923c;font:950 10px/1 system-ui;letter-spacing:.16em;text-transform:uppercase}.what-changed-head h1{margin:9px 0 0;font:950 clamp(29px,8vw,42px)/.96 system-ui;letter-spacing:-.045em}.what-changed-head p:last-of-type{margin:10px 0 0;color:#b9c7d9;font:650 14px/1.45 system-ui}
      #whatChangedClose{position:absolute;top:17px;right:17px;width:42px;height:42px;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(3,8,16,.58);color:#fff;font:500 25px/1 system-ui;cursor:pointer}
      #whatChangedFeed{flex:1 1 auto;min-height:0;padding:18px 18px 34px;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}.what-changed-group+ .what-changed-group{margin-top:24px}.what-changed-group>h2{margin:0 4px 10px;color:#94a3b8;font:950 10px/1 system-ui;letter-spacing:.14em;text-transform:uppercase}.what-changed-group>div{display:grid;gap:10px}
      .what-changed-entry{position:relative;display:block;width:100%;min-width:0;margin:0;padding:16px;border:1px solid rgba(148,163,184,.18);border-radius:17px;background:linear-gradient(145deg,rgba(23,35,54,.94),rgba(10,18,31,.96));color:inherit;text-align:left;font:inherit;box-shadow:0 14px 30px rgba(0,0,0,.18);overflow:hidden}.what-changed-entry.is-actionable{cursor:pointer}.what-changed-entry.is-actionable:hover,.what-changed-entry.is-actionable:focus-visible{border-color:rgba(249,115,22,.72);transform:translateY(-1px);outline:none}.what-changed-entry-top{display:flex;align-items:center;justify-content:space-between;gap:12px}.what-changed-type{display:inline-flex;align-items:center;gap:8px;color:#fed7aa;font:900 9px/1 system-ui;letter-spacing:.09em;text-transform:uppercase}.what-changed-type b{display:grid;place-items:center;min-width:38px;height:24px;padding:0 7px;border-radius:8px;background:rgba(249,115,22,.14);color:#fb923c;font-size:8px}.what-changed-entry time{color:#8494aa;font:750 10px/1.2 system-ui;white-space:nowrap}.what-changed-entry h3{margin:13px 0 0;color:#fff;font:900 18px/1.16 system-ui;letter-spacing:-.018em}.what-changed-entry>p{margin:8px 0 0;color:#c2cfdf;font:560 13px/1.48 system-ui}.what-changed-verified{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}.what-changed-verified span{padding:6px 8px;border:1px solid rgba(249,115,22,.28);border-radius:999px;background:rgba(249,115,22,.09);color:#ffedd5;font:850 10px/1 system-ui}.what-changed-fighter{display:flex;align-items:center;gap:10px;margin-top:14px;padding-top:13px;border-top:1px solid rgba(148,163,184,.14)}.what-changed-avatar{display:grid;place-items:center;flex:0 0 42px;width:42px;height:42px;border:1px solid rgba(249,115,22,.3);border-radius:50%;background:#111827;color:#fb923c;font:900 11px/1 system-ui;overflow:hidden}.what-changed-avatar img{width:100%;height:100%;object-fit:cover}.what-changed-fighter strong,.what-changed-fighter small{display:block}.what-changed-fighter strong{font:900 13px/1.2 system-ui}.what-changed-fighter small{margin-top:4px;color:#94a3b8;font:750 10px/1.25 system-ui}.what-changed-open{display:flex;align-items:center;justify-content:flex-end;gap:7px;margin-top:12px;color:#fb923c;font:900 10px/1 system-ui;letter-spacing:.08em;text-transform:uppercase}.what-changed-open i{font-style:normal;font-size:15px}.what-changed-empty{display:grid;gap:6px;padding:20px;border:1px solid rgba(148,163,184,.18);border-radius:16px;background:rgba(15,23,42,.75)}.what-changed-empty span{color:#94a3b8;font-size:13px}
      @media(max-width:620px){#whatChangedOverlay{align-items:flex-end}#whatChangedDialog{width:100%;height:min(92dvh,820px);border-top:1px solid rgba(249,115,22,.42);border-left:0;border-radius:22px 22px 0 0}.what-changed-head{padding:21px 62px 16px 18px}.what-changed-head h1{font-size:32px}#whatChangedFeed{padding:14px 12px 28px}.what-changed-entry{padding:14px}.what-changed-entry-top{align-items:flex-start}.what-changed-entry time{font-size:9px}}
      @media(prefers-reduced-motion:no-preference){.what-changed-entry.is-actionable{transition:border-color .14s ease,transform .14s ease}}
    `;
    document.head.appendChild(style);
  }

  function install(){
    if(state.installed)return;
    installStyles();
    const overlay=document.createElement('div');
    overlay.id='whatChangedOverlay';
    overlay.hidden=true;
    overlay.setAttribute('aria-hidden','true');
    overlay.innerHTML=`<section id="whatChangedDialog" role="dialog" aria-modal="true" aria-labelledby="whatChangedTitle" aria-describedby="whatChangedDescription" tabindex="-1"><header class="what-changed-head"><p class="what-changed-kicker">Octagon HQ updates</p><h1 id="whatChangedTitle">What Changed</h1><p id="whatChangedDescription">Verified ranking, fighter, game, Picks, War Room, and product changes.</p><button id="whatChangedClose" type="button" aria-label="Close What Changed">×</button></header><div id="whatChangedFeed" aria-live="polite"></div></section>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click',event=>{if(event.target===overlay)close();});
    document.getElementById('whatChangedClose')?.addEventListener('click',()=>close());
    overlay.addEventListener('keydown',handleKeydown);
    overlay.addEventListener('click',event=>{
      const target=event.target.closest?.('[data-what-changed-entry]');
      if(!target)return;
      const entry=entries().find(item=>item.id===target.dataset.whatChangedEntry);
      if(entry)openEntry(entry);
    });
    state.installed=true;
  }

  function focusables(){
    const dialog=document.getElementById('whatChangedDialog');
    if(!dialog)return[];
    return[...dialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(node=>node.offsetParent!==null);
  }
  function handleKeydown(event){
    if(!state.open)return;
    if(event.key==='Escape'){event.preventDefault();close();return;}
    if(event.key!=='Tab')return;
    const nodes=focusables();
    if(!nodes.length){event.preventDefault();document.getElementById('whatChangedDialog')?.focus();return;}
    const first=nodes[0],last=nodes[nodes.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }

  function open(trigger){
    install();
    render();
    const overlay=document.getElementById('whatChangedOverlay');
    if(!overlay)return;
    state.returnFocus=trigger||document.activeElement;
    state.open=true;
    overlay.hidden=false;
    overlay.setAttribute('aria-hidden','false');
    document.body.classList.add('what-changed-open');
    markAllSeen();
    requestAnimationFrame(()=>document.getElementById('whatChangedClose')?.focus());
  }
  function close({restoreFocus=true}={}){
    const overlay=document.getElementById('whatChangedOverlay');
    if(!overlay||overlay.hidden)return;
    overlay.hidden=true;
    overlay.setAttribute('aria-hidden','true');
    document.body.classList.remove('what-changed-open');
    state.open=false;
    const target=state.returnFocus;
    state.returnFocus=null;
    if(restoreFocus)target?.focus?.();
  }

  function activateDestination(destination){
    if(!destination)return false;
    return Boolean(window.UFC_APP_SHELL?.activateDestination?.(destination)||window.UFC_PRODUCT_ARCHITECTURE?.activateDestination?.(destination));
  }
  function openEntry(entry){
    close({restoreFocus:false});
    if(entry.fighterSlug){
      const fighter=fighterFor(entry.fighterSlug);
      activateDestination('rankings');
      window.setTimeout(()=>{
        if(fighter&&typeof window.openFighter==='function')window.openFighter(fighter.fighter);
        else if(fighter){const row=[...document.querySelectorAll('[data-fighter]')].find(node=>node.dataset.fighter===fighter.fighter);row?.click();}
      },40);
      return;
    }
    activateDestination(entry.destination);
    if(entry.action==='find-leader')window.setTimeout(()=>document.querySelector('[data-open-game="find-leader"]')?.click(),120);
  }

  window.UFC_WHAT_CHANGED={version:VERSION,open,close,render,entries,readSeen,markAllSeen,fighterFor};
  document.documentElement.setAttribute('data-what-changed',VERSION);
})();

(function(){
  'use strict';

  const VERSION='what-changed-20260718b-compact';
  const SOURCE=window.OCTAGON_CHANGELOG||{entries:[],timezone:'America/Chicago',seenStorageKey:'octagon-hq-what-changed-seen-v1'};
  const TYPE_LABELS={
    'Fighter Added':'Fighter Added',
    'Audit Completed':'Audit Completed',
    'Rank Changed':'Rank Changed',
    'OVR Changed':'OVR Changed',
    'Watch Moment Added':'Watch Moment',
    'Game Updated':'Game Updated',
    'Picks Updated':'Picks Updated',
    'War Room Updated':'War Room Updated',
    'App Updated':'App Updated'
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
    return`<div class="what-changed-fighter"><div class="what-changed-avatar">${photo}</div><div><strong>${esc(fighter.displayName)}</strong><small>${fighter.rank?`#${fighter.rank}`:'Rank —'} · ${fighter.ovr} OVR${fighter.division?` · ${esc(fighter.division)}`:''}</small></div></div>`;
  }
  function entryMarkup(entry){
    const label=TYPE_LABELS[entry.type]||entry.type||'Update';
    const actionable=Boolean(entry.fighterSlug||entry.destination);
    const tag=actionable?'button':'article';
    const attrs=actionable?`type="button" data-what-changed-entry="${esc(entry.id)}" aria-label="Open update: ${esc(entry.headline)}"`:'';
    const arrow=actionable?'<i class="what-changed-arrow" aria-hidden="true">→</i>':'';
    return`<${tag} class="what-changed-entry${actionable?' is-actionable':''}" ${attrs}>
      <div class="what-changed-entry-top"><span class="what-changed-type">${esc(label)}</span><span class="what-changed-date"><time datetime="${esc(entry.publishedAt)}">${esc(dateLabel(entry.publishedAt))}</time>${arrow}</span></div>
      <h3>${esc(entry.headline)}</h3>
      <p>${esc(entry.summary)}</p>
      ${changeMarkup(entry)}
      ${fighterMarkup(entry)}
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
      #whatChangedDialog{display:flex;flex-direction:column;width:min(560px,100%);height:100%;max-height:100dvh;border-left:1px solid rgba(249,115,22,.38);background:linear-gradient(180deg,#111a2b 0%,#07101d 100%);box-shadow:-30px 0 80px rgba(0,0,0,.52);color:#f8fafc;outline:none;overflow:hidden}
      .what-changed-head{position:relative;flex:0 0 auto;padding:18px 62px 14px 19px;border-bottom:1px solid rgba(148,163,184,.2);background:linear-gradient(145deg,#1a273a,#0b1423)}.what-changed-head:before{content:"";position:absolute;inset:0 auto 0 0;width:5px;background:#f97316}.what-changed-kicker{margin:0;color:#ff9b50;font:950 10px/1 system-ui;letter-spacing:.15em;text-transform:uppercase}.what-changed-head h1{margin:6px 0 0;color:#fff!important;opacity:1!important;text-transform:none!important;font:950 clamp(28px,7vw,36px)/1 system-ui;letter-spacing:-.035em;text-shadow:0 2px 18px rgba(0,0,0,.38)}.what-changed-head p:last-of-type{margin:7px 0 0;color:#d4deea!important;text-transform:none!important;letter-spacing:0!important;font:650 12.5px/1.35 system-ui}
      #whatChangedClose{position:absolute;top:12px;right:14px;width:38px;height:38px;border:1px solid rgba(255,255,255,.24);border-radius:999px;background:rgba(3,8,16,.66);color:#fff;font:500 23px/1 system-ui;cursor:pointer}
      #whatChangedFeed{flex:1 1 auto;min-height:0;padding:12px 12px calc(22px + env(safe-area-inset-bottom));overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}.what-changed-group+.what-changed-group{margin-top:17px}.what-changed-group>h2{margin:0 3px 8px;color:#b5c2d4;font:950 10px/1 system-ui;letter-spacing:.13em;text-transform:uppercase}.what-changed-group>div{display:grid;gap:8px}
      .what-changed-entry{position:relative;display:block;width:100%;min-width:0;margin:0;padding:13px 14px;border:1px solid rgba(148,163,184,.22);border-radius:15px;background:linear-gradient(145deg,rgba(23,35,54,.96),rgba(10,18,31,.98));color:inherit;text-align:left;font:inherit;box-shadow:0 10px 24px rgba(0,0,0,.15);overflow:hidden}.what-changed-entry.is-actionable{cursor:pointer}.what-changed-entry.is-actionable:hover,.what-changed-entry.is-actionable:focus-visible{border-color:rgba(249,115,22,.78);transform:translateY(-1px);outline:none}.what-changed-entry-top{display:flex;align-items:center;justify-content:space-between;gap:10px}.what-changed-type{display:inline-flex;align-items:center;min-height:25px;padding:0 9px;border-radius:8px;background:rgba(249,115,22,.14);color:#ffd3b2;font:900 9.5px/1 system-ui;letter-spacing:.075em;text-transform:uppercase}.what-changed-date{display:inline-flex;align-items:center;gap:9px;flex:0 0 auto}.what-changed-entry time{color:#b7c3d4;font:800 10.5px/1.2 system-ui;white-space:nowrap}.what-changed-arrow{color:#ff8a35;font:900 19px/1 system-ui;font-style:normal}.what-changed-entry h3{margin:9px 0 0;color:#fff;font:900 17px/1.18 system-ui;letter-spacing:-.015em}.what-changed-entry>p{margin:6px 0 0;color:#d2dce8!important;text-transform:none!important;letter-spacing:0!important;font:570 12.5px/1.38 system-ui}.what-changed-verified{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}.what-changed-verified span{padding:5px 8px;border:1px solid rgba(249,115,22,.36);border-radius:999px;background:rgba(249,115,22,.1);color:#ffe4cf;font:850 10px/1 system-ui}.what-changed-fighter{display:flex;align-items:center;gap:8px;margin-top:10px;padding-top:9px;border-top:1px solid rgba(148,163,184,.16)}.what-changed-avatar{display:grid;place-items:center;flex:0 0 34px;width:34px;height:34px;border:1px solid rgba(249,115,22,.38);border-radius:50%;background:#111827;color:#fb923c;font:900 9px/1 system-ui;overflow:hidden}.what-changed-avatar img{width:100%;height:100%;object-fit:cover}.what-changed-fighter strong,.what-changed-fighter small{display:block}.what-changed-fighter strong{font:900 11.5px/1.15 system-ui}.what-changed-fighter small{margin-top:3px;color:#aebdd0;font:750 9.5px/1.2 system-ui}.what-changed-empty{display:grid;gap:6px;padding:17px;border:1px solid rgba(148,163,184,.2);border-radius:15px;background:rgba(15,23,42,.75)}.what-changed-empty span{color:#aebdd0;font-size:12.5px}
      @media(max-width:620px){#whatChangedOverlay{align-items:flex-end}#whatChangedDialog{width:100%;height:min(92dvh,820px);border-top:1px solid rgba(249,115,22,.46);border-left:0;border-radius:20px 20px 0 0}.what-changed-head{padding:16px 56px 12px 16px}.what-changed-head h1{font-size:28px}.what-changed-head p:last-of-type{font-size:12px}#whatChangedClose{top:10px;right:12px}#whatChangedFeed{padding:11px 10px calc(20px + env(safe-area-inset-bottom))}.what-changed-entry{padding:12px 13px}.what-changed-entry h3{font-size:16.5px}.what-changed-entry>p{font-size:12.5px}.what-changed-entry time{font-size:10px}}
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
    overlay.innerHTML=`<section id="whatChangedDialog" role="dialog" aria-modal="true" aria-labelledby="whatChangedTitle" aria-describedby="whatChangedDescription" tabindex="-1"><header class="what-changed-head"><p class="what-changed-kicker">Octagon HQ updates</p><h1 id="whatChangedTitle">What Changed</h1><p id="whatChangedDescription">Verified ranking, fighter, game, Picks and product updates.</p><button id="whatChangedClose" type="button" aria-label="Close What Changed">×</button></header><div id="whatChangedFeed" aria-live="polite"></div></section>`;
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

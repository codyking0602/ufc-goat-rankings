(function(){
  'use strict';

  const VERSION='product-architecture-20260717b';
  const RANKING_VIEWS=['men','women','division','categories'];
  const DESTINATIONS=[
    {key:'home',label:'Home',view:'home'},
    {key:'rankings',label:'Rankings',view:'men'},
    {key:'play',label:'Play',view:'play'},
    {key:'picks',label:'Picks',view:'picks'},
    {key:'war-room',label:'War Room',view:'octagon'},
    {key:'intelligence',label:'Intelligence',view:'compare'}
  ];
  const RANKING_TABS=[
    {view:'men',label:'Overall'},
    {view:'women',label:'Women'},
    {view:'division',label:'Divisions'},
    {view:'categories',label:'Categories'}
  ];

  let currentDestination='rankings';
  let currentRankingView='men';
  let applying=false;
  let resizeTimer=0;
  let warRoomAccess={
    disabled:true,
    betaAccess:'locked',
    member:''
  };

  const text=value=>String(value??'').trim();

  function installStyles(){
    if(document.getElementById('productArchitectureCss'))return;
    const style=document.createElement('style');
    style.id='productArchitectureCss';
    style.textContent=`
      .tabs[data-product-architecture]{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:7px!important;overflow:visible!important;padding:8px 14px!important}
      .tabs[data-product-architecture] .tab{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;max-width:none!important;min-height:40px!important;height:40px!important;margin:0!important;padding:6px 8px!important;box-sizing:border-box!important;white-space:nowrap!important;line-height:1!important}
      .tabs[data-product-architecture] .tab[data-destination="war-room"]:disabled{opacity:.52;cursor:not-allowed}
      .tabs[data-product-architecture] .tab[data-destination="war-room"][data-beta-access="owner"]{border-color:rgba(249,115,22,.62)}
      .rankings-subnav{display:none;align-items:center;gap:7px;margin:0 0 12px;padding:7px;border:1px solid var(--line,#263244);border-radius:15px;background:rgba(15,23,42,.72)}
      .rankings-subnav.active{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}
      .rankings-subnav button{min-width:0;min-height:38px;border:1px solid transparent;border-radius:11px;background:transparent;color:var(--muted,#94a3b8);cursor:pointer;font:900 12px/1 system-ui;padding:7px 8px}
      .rankings-subnav button:hover{background:rgba(148,163,184,.08);color:var(--text,#f8fafc)}
      .rankings-subnav button.active{border-color:rgba(249,115,22,.54);background:rgba(249,115,22,.13);color:#fff}
      .architecture-home{min-height:320px}
      .architecture-home-shell{max-width:760px;margin:0 auto;padding:clamp(28px,6vw,64px);border:1px solid var(--line,#263244);border-radius:26px;background:linear-gradient(155deg,#172238,#0c1322);color:#f8fafc;box-shadow:0 22px 60px rgba(0,0,0,.22)}
      .architecture-home-shell span{display:block;color:#fb923c;font:950 10px/1 system-ui;letter-spacing:.15em}
      .architecture-home-shell h2{margin:12px 0 10px;font-size:clamp(38px,8vw,72px);line-height:.92;letter-spacing:-.05em}
      .architecture-home-shell p{max-width:620px;margin:0;color:#cbd5e1;font-size:clamp(16px,2.4vw,20px);line-height:1.45}
      #rules,.tab[data-view="rules"],[data-product-legacy-ranking-tab]{display:none!important}
      @media(max-width:900px){
        .tabs[data-product-architecture]{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important;padding:5px 10px 7px!important}
        .tabs[data-product-architecture] .tab{height:39px!important;min-height:39px!important;padding:5px 4px!important;font-size:10.5px!important;white-space:normal!important;border-radius:11px!important}
        .rankings-subnav{margin-bottom:10px;padding:6px;gap:5px}
        .rankings-subnav button{min-height:36px;padding:6px 3px;font-size:10.5px}
      }
      @media(max-width:430px){
        .tabs[data-product-architecture]{padding-left:9px!important;padding-right:9px!important}
        .tabs[data-product-architecture] .tab{font-size:10px!important}
        .architecture-home-shell{padding:30px 22px;border-radius:21px}
      }
    `;
    document.head.appendChild(style);
  }

  function ensureHome(){
    let home=document.getElementById('home');
    if(home)return home;
    home=document.createElement('section');
    home.id='home';
    home.className='view architecture-home';
    home.innerHTML=`<div class="architecture-home-shell"><span>OCTAGON HQ</span><h2>Your UFC headquarters.</h2><p>Rankings, games, picks, The War Room, and Intelligence—organized under one roof.</p></div>`;
    const shell=document.querySelector('main.shell');
    const toolbar=shell?.querySelector('.toolbar');
    if(toolbar)toolbar.before(home);else shell?.prepend(home);
    return home;
  }

  function removeRules(){
    document.querySelectorAll('#rules,.tab[data-view="rules"]').forEach(node=>node.remove());
  }

  function ensureRankingSubnav(){
    const shell=document.querySelector('main.shell');
    if(!shell)return null;
    let subnav=shell.querySelector('[data-rankings-subnav]');
    if(!subnav){
      subnav=document.createElement('nav');
      subnav.className='rankings-subnav';
      subnav.dataset.rankingsSubnav='true';
      subnav.setAttribute('aria-label','Ranking views');
      const toolbar=shell.querySelector('.toolbar');
      if(toolbar)toolbar.before(subnav);else shell.prepend(subnav);
    }
    subnav.innerHTML=RANKING_TABS.map(item=>`<button type="button" data-ranking-view="${item.view}" aria-pressed="${item.view===currentRankingView?'true':'false'}" class="${item.view===currentRankingView?'active':''}">${item.label}</button>`).join('');
    return subnav;
  }

  function captureWarRoomAccess(root=document){
    const button=root.querySelector?.('[data-octagon-beta-tab]');
    if(!button)return warRoomAccess;
    warRoomAccess={
      disabled:Boolean(button.disabled||button.getAttribute('aria-disabled')==='true'),
      betaAccess:text(button.dataset.betaAccess)||'locked',
      member:text(button.dataset.betaMember)
    };
    return warRoomAccess;
  }

  function destinationMarkup(){
    return DESTINATIONS.map(item=>{
      const selected=item.key===currentDestination;
      if(item.key!=='war-room'){
        return `<button type="button" class="tab${selected?' active':''}" data-destination="${item.key}" data-view="${item.view}" aria-selected="${selected?'true':'false'}">${item.label}</button>`;
      }
      const disabled=warRoomAccess.disabled;
      const member=warRoomAccess.member?` data-beta-member="${warRoomAccess.member.replace(/"/g,'&quot;')}"`:'';
      return `<button type="button" class="tab${selected?' active':''}" data-destination="war-room" data-view="octagon" data-octagon-beta-tab="true" data-beta-access="${warRoomAccess.betaAccess}"${member} aria-selected="${selected?'true':'false'}" aria-disabled="${disabled?'true':'false'}" aria-label="${disabled?'War Room access not enabled':'Open The War Room'}" title="${disabled?'War Room access not enabled':'Open The War Room'}" ${disabled?'disabled':''}>War Room</button>`;
    }).join('');
  }

  function normalizeNavigation(){
    const nav=document.querySelector('nav.tabs');
    if(!nav)return null;
    captureWarRoomAccess(nav);
    applying=true;
    nav.dataset.productArchitecture=VERSION;
    nav.setAttribute('aria-label','Primary app destinations');
    nav.removeAttribute('style');
    nav.innerHTML=destinationMarkup();
    nav.querySelectorAll('.tab').forEach(button=>button.removeAttribute('style'));
    applying=false;
    return nav;
  }

  function destinationForView(view){
    if(RANKING_VIEWS.includes(view))return'rankings';
    if(view==='compare')return'intelligence';
    if(view==='octagon')return'war-room';
    return DESTINATIONS.find(item=>item.view===view)?.key||'rankings';
  }

  function syncToolbar(view){
    const toolbar=document.querySelector('.toolbar');
    const search=document.getElementById('search');
    const era=document.getElementById('eraFilter');
    const division=document.getElementById('divisionFilter');
    const reset=document.getElementById('resetBtn');
    const rankingUtility=view==='men'||view==='women'||view==='division';
    if(toolbar)toolbar.style.display=rankingUtility?'':'none';
    if(search)search.style.display=(view==='men'||view==='women')?'':'none';
    if(era)era.style.display=rankingUtility?'':'none';
    if(division)division.style.display=view==='division'?'':'none';
    if(reset)reset.style.display=rankingUtility?'':'none';
    if(view!=='division'&&division&&division.value!=='All'){
      division.value='All';
      if(typeof window.refresh==='function')window.refresh();
    }
  }

  function syncRankingSubnav(){
    const subnav=ensureRankingSubnav();
    if(!subnav)return;
    const active=currentDestination==='rankings';
    subnav.classList.toggle('active',active);
    subnav.setAttribute('aria-hidden',String(!active));
    subnav.querySelectorAll('[data-ranking-view]').forEach(button=>{
      const selected=button.dataset.rankingView===currentRankingView;
      button.classList.toggle('active',selected);
      button.setAttribute('aria-pressed',String(selected));
    });
  }

  function syncPrimaryNav(){
    const nav=document.querySelector('nav.tabs');
    if(!nav)return;
    nav.querySelectorAll('[data-destination]').forEach(button=>{
      const selected=button.dataset.destination===currentDestination;
      button.classList.toggle('active',selected);
      button.setAttribute('aria-selected',String(selected));
    });
  }

  function activateView(view,{updateHash=true}={}){
    captureWarRoomAccess();
    if(view==='octagon'&&warRoomAccess.disabled){
      view='men';
    }
    if(RANKING_VIEWS.includes(view))currentRankingView=view;
    currentDestination=destinationForView(view);

    let target=document.getElementById(view);
    if(!target&&view==='home')target=ensureHome();
    if(!target&&view==='octagon'){
      window.UFC_WAR_ROOM_BRANDING?.apply?.();
      target=document.getElementById('octagon');
    }
    if(!target){
      currentDestination='rankings';
      currentRankingView='men';
      target=document.getElementById('men');
      view='men';
    }

    document.querySelectorAll('main.shell > .view').forEach(section=>section.classList.remove('active-view'));
    target?.classList.add('active-view');
    syncPrimaryNav();
    syncRankingSubnav();
    syncToolbar(view);

    if(updateHash){
      const next=currentDestination==='rankings'
        ? `#rankings/${currentRankingView}`
        : `#${currentDestination}`;
      if(window.location.hash!==next)history.replaceState(null,'',next);
    }

    window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:currentDestination,view}}));
  }

  function activateDestination(destination){
    const item=DESTINATIONS.find(entry=>entry.key===destination);
    if(!item)return;
    if(destination==='war-room'){
      captureWarRoomAccess();
      if(warRoomAccess.disabled)return;
    }
    activateView(destination==='rankings'?currentRankingView:item.view);
  }

  function parseHash(){
    const hash=text(window.location.hash).replace(/^#/,'').toLowerCase();
    if(!hash)return'men';
    if(hash.startsWith('rankings/')){
      const requested=hash.split('/')[1];
      return RANKING_VIEWS.includes(requested)?requested:'men';
    }
    const aliases={p4p:'men',overall:'men',women:'women',division:'division',divisions:'division',categories:'categories',intelligence:'compare','war-room':'octagon',octagon:'octagon',home:'home',play:'play',picks:'picks'};
    return aliases[hash]||'men';
  }

  function bindEvents(){
    document.addEventListener('click',event=>{
      const destinationButton=event.target.closest?.('[data-destination]');
      if(destinationButton){
        event.preventDefault();
        event.stopImmediatePropagation();
        if(destinationButton.disabled||destinationButton.getAttribute('aria-disabled')==='true')return;
        activateDestination(destinationButton.dataset.destination);
        return;
      }
      const rankingButton=event.target.closest?.('[data-ranking-view]');
      if(rankingButton){
        event.preventDefault();
        event.stopImmediatePropagation();
        activateView(rankingButton.dataset.rankingView);
      }
    },true);
    window.addEventListener('hashchange',()=>activateView(parseHash(),{updateHash:false}));
    window.addEventListener('resize',()=>{
      window.clearTimeout(resizeTimer);
      resizeTimer=window.setTimeout(applyArchitecture,140);
    });
  }

  function protectArchitecture(){
    const nav=document.querySelector('nav.tabs');
    if(!nav)return;
    const observer=new MutationObserver(()=>{
      if(applying)return;
      const buttons=[...nav.querySelectorAll('[data-destination]')];
      const valid=buttons.length===DESTINATIONS.length&&DESTINATIONS.every((item,index)=>buttons[index]?.dataset.destination===item.key&&buttons[index]?.textContent.trim()===item.label);
      if(!valid||nav.hasAttribute('style')||buttons.some(button=>button.hasAttribute('style'))){
        queueMicrotask(()=>{
          normalizeNavigation();
          syncPrimaryNav();
        });
      }
    });
    observer.observe(nav,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class','disabled','aria-label','aria-disabled','data-beta-access','data-beta-member']});
  }

  function applyArchitecture(){
    installStyles();
    document.getElementById('octagonHqCompressionCss')?.remove();
    ensureHome();
    removeRules();
    normalizeNavigation();
    ensureRankingSubnav();
    syncPrimaryNav();
    syncRankingSubnav();
    syncToolbar(currentDestination==='rankings'?currentRankingView:DESTINATIONS.find(item=>item.key===currentDestination)?.view);
    window.UFC_WAR_ROOM_BRANDING?.apply?.();
  }

  function start(){
    const initialView=parseHash();
    currentRankingView=RANKING_VIEWS.includes(initialView)?initialView:'men';
    currentDestination=destinationForView(initialView);
    applyArchitecture();
    bindEvents();
    protectArchitecture();
    activateView(initialView,{updateHash:Boolean(window.location.hash)});
    [80,300,900,2200].forEach(delay=>window.setTimeout(applyArchitecture,delay));
  }

  window.UFC_PRODUCT_ARCHITECTURE={version:VERSION,apply:applyArchitecture,activateView,activateDestination};
  document.documentElement.setAttribute('data-product-architecture',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

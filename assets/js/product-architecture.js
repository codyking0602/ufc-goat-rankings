(function(){
  'use strict';

  const VERSION='product-architecture-20260717e-home-default';
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

  let currentDestination='home';
  let currentRankingView='men';
  let bound=false;

  const text=value=>String(value??'').trim();

  function installStyles(){
    let style=document.getElementById('productArchitectureCss');
    if(!style){
      style=document.createElement('style');
      style.id='productArchitectureCss';
      document.head.appendChild(style);
    }
    style.textContent=`
      .tabs[data-product-architecture]{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;grid-auto-flow:row!important;gap:7px!important;overflow:visible!important;padding:8px 14px!important;margin-top:0!important}
      .tabs[data-product-architecture] .tab{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;max-width:none!important;height:40px!important;min-height:40px!important;max-height:40px!important;margin:0!important;padding:6px 8px!important;box-sizing:border-box!important;white-space:nowrap!important;line-height:1!important;order:initial!important;grid-column:auto!important;grid-row:auto!important}
      .tabs[data-product-architecture] .tab[data-destination="war-room"]:disabled{opacity:.52;cursor:not-allowed}
      .rankings-subnav{display:none;align-items:center;gap:7px;margin:0 0 12px;padding:7px;border:1px solid var(--line,#263244);border-radius:15px;background:rgba(15,23,42,.72)}
      .rankings-subnav.active{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}
      .rankings-subnav button{min-width:0;min-height:38px;border:1px solid transparent;border-radius:11px;background:transparent;color:var(--muted,#94a3b8);cursor:pointer;font:900 12px/1 system-ui;padding:7px 8px}
      .rankings-subnav button.active{border-color:rgba(249,115,22,.54);background:rgba(249,115,22,.13);color:#fff}
      #rules,.tab[data-view="rules"],[data-product-legacy-ranking-tab]{display:none!important}
      @media(max-width:900px){
        .tabs[data-product-architecture]{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important;padding:5px 10px 7px!important}
        .tabs[data-product-architecture] .tab{height:39px!important;min-height:39px!important;max-height:39px!important;padding:5px 4px!important;font-size:10.5px!important;white-space:normal!important;border-radius:11px!important}
        .rankings-subnav{margin-bottom:10px;padding:6px;gap:5px}
        .rankings-subnav button{min-height:36px;padding:6px 3px;font-size:10.5px}
      }
      @media(max-width:430px){
        .tabs[data-product-architecture]{padding-left:9px!important;padding-right:9px!important}
        .tabs[data-product-architecture] .tab{font-size:10px!important}
      }
    `;
  }

  function ensureHome(){
    let home=document.getElementById('home');
    if(!home){
      home=document.createElement('section');
      home.id='home';
      home.className='view';
      const shell=document.querySelector('main.shell');
      const toolbar=shell?.querySelector('.toolbar');
      if(toolbar)toolbar.before(home);else shell?.prepend(home);
    }
    if(!home.firstElementChild)home.innerHTML='<div id="homeDashboardMount" aria-live="polite"></div>';
    return home;
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
    if(!subnav.children.length){
      subnav.innerHTML=RANKING_TABS.map(item=>`<button type="button" data-ranking-view="${item.view}">${item.label}</button>`).join('');
    }
    return subnav;
  }

  function cleanNav(){
    const nav=document.querySelector('nav.tabs');
    if(!nav)return null;
    document.getElementById('octagonHqCompressionCss')?.remove();
    nav.dataset.productArchitecture=VERSION;
    nav.setAttribute('aria-label','Primary app destinations');
    nav.removeAttribute('style');
    nav.querySelectorAll('.tab').forEach(button=>button.removeAttribute('style'));
    nav.querySelectorAll('.tab:not([data-destination])').forEach(button=>button.remove());

    DESTINATIONS.forEach(item=>{
      let button=nav.querySelector(`[data-destination="${item.key}"]`);
      if(!button){
        button=document.createElement('button');
        button.type='button';
        button.className='tab';
        button.dataset.destination=item.key;
        nav.appendChild(button);
      }
      button.dataset.view=item.view;
      if(item.key==='war-room')button.dataset.octagonBetaTab='true';
      if(button.textContent!==item.label)button.textContent=item.label;
    });

    const desired=DESTINATIONS.map(item=>item.key);
    const current=[...nav.children].filter(node=>node.dataset?.destination).map(node=>node.dataset.destination);
    if(current.join('|')!==desired.join('|')){
      desired.forEach(key=>{
        const button=nav.querySelector(`[data-destination="${key}"]`);
        if(button)nav.appendChild(button);
      });
    }
    return nav;
  }

  function destinationForView(view){
    if(RANKING_VIEWS.includes(view))return'rankings';
    if(view==='compare')return'intelligence';
    if(view==='octagon')return'war-room';
    return DESTINATIONS.find(item=>item.view===view)?.key||'home';
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
  }

  function syncNavigation(){
    const nav=document.querySelector('nav.tabs');
    nav?.querySelectorAll('[data-destination]').forEach(button=>{
      const selected=button.dataset.destination===currentDestination;
      button.classList.toggle('active',selected);
      button.setAttribute('aria-selected',String(selected));
      if(button.dataset.destination==='war-room'&&button.textContent!=='War Room')button.textContent='War Room';
    });

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

  function showView(view,{updateHash=true}={}){
    const warButton=document.querySelector('[data-destination="war-room"]');
    if(view==='octagon'&&(warButton?.disabled||warButton?.getAttribute('aria-disabled')==='true'))return;

    if(RANKING_VIEWS.includes(view))currentRankingView=view;
    currentDestination=destinationForView(view);

    let target=view==='home'?ensureHome():document.getElementById(view);
    if(!target){
      view='home';
      currentDestination='home';
      target=ensureHome();
    }

    document.querySelectorAll('main.shell .view').forEach(section=>section.classList.remove('active-view'));
    target.classList.add('active-view');
    syncNavigation();
    syncToolbar(view);

    if(updateHash){
      const next=currentDestination==='rankings'?`#rankings/${currentRankingView}`:`#${currentDestination}`;
      if(window.location.hash!==next)history.replaceState(null,'',next);
    }
    window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:currentDestination,view}}));
  }

  function parseHash(){
    const hash=text(window.location.hash).replace(/^#/,'').toLowerCase();
    if(!hash)return'home';
    if(hash.startsWith('rankings/')){
      const requested=hash.split('/')[1];
      return RANKING_VIEWS.includes(requested)?requested:'men';
    }
    const aliases={home:'home',rankings:'men',p4p:'men',overall:'men',women:'women',division:'division',divisions:'division',categories:'categories',play:'play',picks:'picks','war-room':'octagon',octagon:'octagon',intelligence:'compare'};
    return aliases[hash]||'home';
  }

  function bindEvents(){
    if(bound)return;
    bound=true;
    document.addEventListener('click',event=>{
      const destinationButton=event.target.closest?.('nav.tabs [data-destination]');
      if(destinationButton){
        event.preventDefault();
        event.stopImmediatePropagation();
        if(destinationButton.disabled||destinationButton.getAttribute('aria-disabled')==='true')return;
        const key=destinationButton.dataset.destination;
        const item=DESTINATIONS.find(entry=>entry.key===key);
        if(item)showView(key==='rankings'?currentRankingView:item.view);
        return;
      }
      const rankingButton=event.target.closest?.('[data-rankings-subnav] [data-ranking-view]');
      if(rankingButton){
        event.preventDefault();
        event.stopImmediatePropagation();
        showView(rankingButton.dataset.rankingView);
      }
    },true);
    window.addEventListener('hashchange',()=>showView(parseHash(),{updateHash:false}));
  }

  function observeNav(){
    const nav=document.querySelector('nav.tabs');
    if(!nav)return;
    const options={childList:true,subtree:true,attributes:true,attributeFilter:['style','class','aria-label','disabled','aria-disabled','data-beta-access','data-beta-member']};
    const observer=new MutationObserver(()=>{
      observer.disconnect();
      cleanNav();
      syncNavigation();
      observer.observe(nav,options);
    });
    observer.observe(nav,options);
  }

  function apply(){
    installStyles();
    ensureHome();
    document.querySelector('#rules')?.remove();
    cleanNav();
    ensureRankingSubnav();
    syncNavigation();
    syncToolbar(currentDestination==='rankings'?currentRankingView:DESTINATIONS.find(item=>item.key===currentDestination)?.view);
    window.UFC_WAR_ROOM_BRANDING?.apply?.();
  }

  function start(){
    const initialView=parseHash();
    currentRankingView=RANKING_VIEWS.includes(initialView)?initialView:'men';
    currentDestination=destinationForView(initialView);
    apply();
    bindEvents();
    observeNav();
    showView(initialView,{updateHash:Boolean(window.location.hash)});
    [100,500,1500,5000].forEach(delay=>window.setTimeout(()=>{
      cleanNav();
      syncNavigation();
    },delay));
  }

  window.UFC_PRODUCT_ARCHITECTURE={version:VERSION,apply,activateView:showView,activateDestination:key=>{
    const item=DESTINATIONS.find(entry=>entry.key===key);
    if(item)showView(key==='rankings'?currentRankingView:item.view);
  }};
  document.documentElement.setAttribute('data-product-architecture',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

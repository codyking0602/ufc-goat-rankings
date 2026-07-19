(function(){
  'use strict';

  if(window.__UFC_OCTAGON_HQ_SHELL_STARTED__)return;
  window.__UFC_OCTAGON_HQ_SHELL_STARTED__=true;

  const VERSION='app-shell-20260718d-rankings-static';
  const DESTINATIONS=[
    ['home','Home','home'],
    ['rankings','Rankings','men'],
    ['play','Play','play'],
    ['picks','Picks','picks'],
    ['war-room','War Room','octagon'],
    ['intelligence','Intelligence','compare']
  ];
  const RANKING_VIEWS=['men','women','division','categories'];
  const RANKING_TABS=[['men','Overall'],['women','Women'],['division','Divisions'],['categories','Categories']];

  let started=false;
  let eventsBound=false;
  let playSupportLoaded=false;
  let currentDestination='home';
  let currentRankingView='men';
  let warObserver=null;
  let rankingObserver=null;
  let normalizingWar=false;
  let normalizingRankings=false;

  const text=value=>String(value??'').trim();

  function installStyles(){
    let style=document.getElementById('appShellCss');
    if(!style){style=document.createElement('style');style.id='appShellCss';document.head.appendChild(style);}
    style.textContent=`
      .hero{position:relative;align-items:center!important}.hero>div:first-child{min-width:0}.hero h1{letter-spacing:-.045em}.hero .subtitle{max-width:680px;margin-bottom:0}.hero .hero-card[aria-hidden="true"]{display:none!important}
      .tabs[data-app-shell]{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;grid-auto-flow:row!important;gap:7px!important;overflow:visible!important;padding:8px 14px!important;margin:0!important}
      .tabs[data-app-shell] .tab{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;max-width:none!important;height:40px!important;min-height:40px!important;max-height:40px!important;margin:0!important;padding:6px 8px!important;box-sizing:border-box!important;white-space:nowrap!important;line-height:1!important;order:initial!important;grid-column:auto!important;grid-row:auto!important}
      .tabs[data-app-shell] .tab[data-destination="rankings"]{font-size:0!important}
      .tabs[data-app-shell] .tab[data-destination="rankings"]::after{content:"Rankings";font:900 12px/1 system-ui}
      .tabs[data-app-shell] .tab[data-destination="war-room"]:disabled{opacity:.52;cursor:not-allowed}
      .rankings-subnav{display:none;align-items:center;gap:7px;margin:0 0 12px;padding:7px;border:1px solid var(--line,#263244);border-radius:15px;background:rgba(15,23,42,.72)}
      .rankings-subnav.active{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}.rankings-subnav button{min-width:0;min-height:38px;border:1px solid transparent;border-radius:11px;background:transparent;color:var(--muted,#94a3b8);cursor:pointer;font:900 12px/1 system-ui;padding:7px 8px}.rankings-subnav button.active{border-color:rgba(249,115,22,.54);background:rgba(249,115,22,.13);color:#fff}
      main.shell>.view:not(.active-view){display:none!important}#rules,.tab[data-view="rules"],[data-product-legacy-ranking-tab],.critical-home-fallback,.architecture-home-shell,.boot-home,.boot-nav,.boot-hero{display:none!important}
      @media(max-width:900px){.hero{padding:13px 16px 12px!important;gap:8px!important}.hero>div:first-child{width:100%}.hero .eyebrow{margin:1px 0 6px!important;font-size:10px!important;letter-spacing:.13em!important}.hero h1{font-size:clamp(38px,11vw,48px)!important;line-height:.92!important}.hero .subtitle{margin:7px 0 0!important;font-size:15px!important;line-height:1.3!important}.tabs[data-app-shell]{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important;padding:6px 10px 8px!important}.tabs[data-app-shell] .tab{height:42px!important;min-height:42px!important;max-height:42px!important;padding:6px 5px!important;font-size:11px!important;white-space:normal!important;border-radius:12px!important}.tabs[data-app-shell] .tab[data-destination="rankings"]{font-size:0!important}.tabs[data-app-shell] .tab[data-destination="rankings"]::after{font-size:10.5px}.rankings-subnav{margin-bottom:10px;padding:6px;gap:5px}.rankings-subnav button{min-height:36px;padding:6px 3px;font-size:10.5px}}
    `;
  }

  function purgeLegacy(){
    ['criticalShellCss','productArchitectureCss','octagonHqCompressionCss'].forEach(id=>document.getElementById(id)?.remove());
    document.querySelectorAll('.critical-home-fallback,.architecture-home-shell,.boot-home,.boot-nav,.boot-hero').forEach(node=>node.remove());
    document.querySelectorAll('script[id^="criticalShell"],script[id^="criticalProduct"],script[id^="criticalHome"]').forEach(node=>node.remove());
    const shell=document.querySelector('main.shell');
    if(!shell)return;
    const homes=[...shell.querySelectorAll(':scope > #home')];
    homes.slice(1).forEach(node=>node.remove());
    let home=homes[0];
    if(!home){home=document.createElement('section');home.id='home';home.className='view';shell.prepend(home);}
    if(!home.querySelector('#homeDashboardMount'))home.innerHTML='<div id="homeDashboardMount" aria-live="polite"></div>';
  }

  function normalizeHeader(){
    const hero=document.querySelector('.hero');
    const brand=hero?.firstElementChild;
    if(!hero||!brand)return;
    const eyebrow=brand.querySelector('.eyebrow');
    const title=brand.querySelector('h1');
    const subtitle=brand.querySelector('.subtitle');
    if(eyebrow)eyebrow.textContent='UFC RANKINGS · GAMES · PICKS · COMMUNITY';
    if(title)title.textContent='Octagon HQ';
    if(subtitle)subtitle.textContent='Rankings, games, picks, and UFC conversation.';
    hero.querySelector('.hero-card')?.setAttribute('aria-hidden','true');
    document.title='Octagon HQ';
  }

  function ensureViews(){
    const shell=document.querySelector('main.shell');
    if(!shell)return;
    if(!document.getElementById('octagon')){const section=document.createElement('section');section.id='octagon';section.className='view';shell.appendChild(section);}
    let subnav=shell.querySelector('[data-rankings-subnav]');
    if(!subnav){subnav=document.createElement('nav');subnav.className='rankings-subnav';subnav.dataset.rankingsSubnav='true';subnav.setAttribute('aria-label','Ranking views');const toolbar=shell.querySelector('.toolbar');if(toolbar)toolbar.before(subnav);else shell.prepend(subnav);}
    subnav.innerHTML=RANKING_TABS.map(([view,label])=>`<button type="button" data-ranking-view="${view}">${label}</button>`).join('');
  }

  function warState(button){return{disabled:Boolean(button?.disabled),aria:button?.getAttribute('aria-disabled')||'false',access:button?.dataset?.betaAccess||'',member:button?.dataset?.betaMember||'',title:button?.title||''};}

  function normalizeRankingsButton(){
    if(normalizingRankings)return;
    const button=document.querySelector('nav.tabs [data-destination="rankings"]');
    if(!button)return;
    normalizingRankings=true;
    let label=button.querySelector('[data-destination-label]');
    if(!label||label.textContent!=='Rankings'){
      button.textContent='';
      label=document.createElement('span');
      label.dataset.destinationLabel='true';
      label.textContent='Rankings';
      button.appendChild(label);
    }
    button.setAttribute('aria-label','Open Rankings');
    normalizingRankings=false;
  }

  function normalizeWarButton(){
    if(normalizingWar)return;
    const button=document.querySelector('nav.tabs [data-destination="war-room"]');
    if(!button)return;
    normalizingWar=true;
    const badge=button.querySelector('[data-octagon-unread-badge]');
    let label=button.querySelector('[data-destination-label]');
    if(!label||label.textContent!=='War Room'){button.textContent='';label=document.createElement('span');label.dataset.destinationLabel='true';label.textContent='War Room';button.appendChild(label);if(badge)button.appendChild(badge);}
    button.setAttribute('aria-label',button.disabled?'War Room access not enabled':'Open The War Room');
    button.title=button.disabled?'War Room access not enabled':'Open The War Room';
    normalizingWar=false;
  }

  function normalizeNavigation(){
    const nav=document.querySelector('nav.tabs');
    if(!nav)return;
    const access=warState(nav.querySelector('[data-destination="war-room"],[data-octagon-beta-tab]'));
    nav.innerHTML='';nav.dataset.appShell=VERSION;nav.dataset.productArchitecture=VERSION;nav.setAttribute('aria-label','Primary app destinations');
    DESTINATIONS.forEach(([key,labelText,view])=>{
      const button=document.createElement('button');button.type='button';button.className='tab';button.dataset.destination=key;button.dataset.view=view;button.setAttribute('aria-selected','false');
      const label=document.createElement('span');label.dataset.destinationLabel='true';label.textContent=labelText;button.appendChild(label);
      if(key==='war-room'){button.dataset.octagonBetaTab='true';if(access.access)button.dataset.betaAccess=access.access;if(access.member)button.dataset.betaMember=access.member;button.disabled=access.disabled;button.setAttribute('aria-disabled',access.aria);button.title=access.title;}
      nav.appendChild(button);
    });
    normalizeRankingsButton();
    normalizeWarButton();
    rankingObserver?.disconnect();
    rankingObserver=new MutationObserver(()=>queueMicrotask(normalizeRankingsButton));
    rankingObserver.observe(nav,{childList:true,subtree:true,characterData:true});
    warObserver?.disconnect();
    const war=nav.querySelector('[data-destination="war-room"]');
    if(war){warObserver=new MutationObserver(()=>queueMicrotask(normalizeWarButton));warObserver.observe(war,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled','aria-disabled','data-beta-access','data-beta-member']});}
  }

  function destinationForView(view){if(RANKING_VIEWS.includes(view))return'rankings';if(view==='compare')return'intelligence';if(view==='octagon')return'war-room';return DESTINATIONS.find(item=>item[2]===view)?.[0]||'home';}

  function syncToolbar(view){
    const toolbar=document.querySelector('.toolbar');const search=document.getElementById('search');const era=document.getElementById('eraFilter');const division=document.getElementById('divisionFilter');const reset=document.getElementById('resetBtn');const ranking=view==='men'||view==='women'||view==='division';
    if(toolbar)toolbar.style.display=ranking?'':'none';if(search)search.style.display=(view==='men'||view==='women')?'':'none';if(era)era.style.display=ranking?'':'none';if(division)division.style.display=view==='division'?'':'none';if(reset)reset.style.display=ranking?'':'none';
  }

  function syncNavigation(){
    normalizeRankingsButton();
    document.querySelectorAll('nav.tabs [data-destination]').forEach(button=>{const selected=button.dataset.destination===currentDestination;button.classList.toggle('active',selected);button.setAttribute('aria-selected',String(selected));});
    const subnav=document.querySelector('[data-rankings-subnav]');const active=currentDestination==='rankings';subnav?.classList.toggle('active',active);subnav?.setAttribute('aria-hidden',String(!active));
    subnav?.querySelectorAll('[data-ranking-view]').forEach(button=>{const selected=button.dataset.rankingView===currentRankingView;button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected));});
  }

  function loadScript(id,src){if(document.getElementById(id)||document.querySelector(`script[src*="${src.split('?')[0]}"]`))return;const script=document.createElement('script');script.id=id;script.src=src;script.async=true;document.head.appendChild(script);}

  function loadPlaySupport(){
    if(playSupportLoaded)return;playSupportLoaded=true;
    requestAnimationFrame(()=>{loadScript('playPermanentDailyController','assets/js/play-daily-rotation.js?v=play-daily-controller-20260717e-find-leader-permanent');const loadBoard=()=>loadScript('playDailyLeaderboardCurrent','assets/js/play-daily-leaderboard.js?v=play-daily-leaderboard-20260717e-find-leader-only');if(typeof requestIdleCallback==='function')requestIdleCallback(loadBoard,{timeout:900});else setTimeout(loadBoard,250);});
  }

  function showView(view,{updateHash=true}={}){
    if(view==='octagon'){
      const war=document.querySelector('[data-destination="war-room"]');
      if(war?.disabled||war?.getAttribute('aria-disabled')==='true')view='home';
    }
    if(RANKING_VIEWS.includes(view))currentRankingView=view;
    currentDestination=destinationForView(view);
    let target=document.getElementById(view);
    if(!target){view='home';currentDestination='home';target=document.getElementById('home');}
    document.querySelectorAll('main.shell>.view').forEach(section=>section.classList.toggle('active-view',section===target));
    syncNavigation();syncToolbar(view);
    if(updateHash){const next=currentDestination==='rankings'?`#rankings/${currentRankingView}`:`#${currentDestination}`;if(location.hash!==next)history.replaceState(null,'',next);}
    requestAnimationFrame(()=>{if(currentDestination==='play')loadPlaySupport();window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:currentDestination,view}}));});
    return true;
  }

  function parseRoute(){
    const params=new URLSearchParams(location.search);
    if(params.has('open')){params.delete('open');const query=params.toString();history.replaceState(null,'',`${location.pathname}${query?`?${query}`:''}${location.hash}`);}
    const hash=text(location.hash).replace(/^#/,'').toLowerCase();
    if(hash.startsWith('rankings/')){const view=hash.split('/')[1];return RANKING_VIEWS.includes(view)?view:'men';}
    return({home:'home',rankings:'men',p4p:'men',overall:'men',women:'women',division:'division',divisions:'division',categories:'categories',play:'play',picks:'picks','war-room':'octagon',octagon:'octagon',intelligence:'compare'})[hash]||'home';
  }

  function bindEvents(){
    if(eventsBound)return;eventsBound=true;
    document.addEventListener('click',event=>{
      const destination=event.target.closest?.('nav.tabs [data-destination]');
      if(destination){event.preventDefault();event.stopImmediatePropagation();if(destination.disabled||destination.getAttribute('aria-disabled')==='true')return;const item=DESTINATIONS.find(row=>row[0]===destination.dataset.destination);if(item)showView(item[0]==='rankings'?currentRankingView:item[2]);return;}
      const ranking=event.target.closest?.('[data-rankings-subnav] [data-ranking-view]');if(ranking){event.preventDefault();event.stopImmediatePropagation();showView(ranking.dataset.rankingView);}
    },true);
    window.addEventListener('hashchange',()=>showView(parseRoute(),{updateHash:false}));
  }

  function start(){
    if(started){syncNavigation();return true;}
    if(!document.querySelector('nav.tabs')||!document.querySelector('main.shell'))return false;
    started=true;installStyles();purgeLegacy();normalizeHeader();ensureViews();normalizeNavigation();bindEvents();
    const route=parseRoute();currentRankingView=RANKING_VIEWS.includes(route)?route:'men';currentDestination=destinationForView(route);showView(route,{updateHash:Boolean(location.hash)});document.documentElement.setAttribute('data-app-shell',VERSION);return true;
  }

  const api={version:VERSION,start,apply:start,activateView:showView,activateDestination:key=>{const item=DESTINATIONS.find(row=>row[0]===key);return item?showView(key==='rankings'?currentRankingView:item[2]):false;},loadPlaySupport,get currentDestination(){return currentDestination;},get currentRankingView(){return currentRankingView;}};
  window.UFC_APP_SHELL=api;window.UFC_PRODUCT_ARCHITECTURE=api;
  if(!start())document.addEventListener('DOMContentLoaded',start,{once:true});
})();

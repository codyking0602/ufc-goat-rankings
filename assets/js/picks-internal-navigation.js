(function(){
  'use strict';

  const ROUTES=['home','event','settings'];
  const URL_KEY='picksView';
  const SESSION_KEY='ufc-picks:internal-view';
  let activeRoute='';
  let routing=false;

  const routeConfig={
    home:{label:'Home',kicker:'GROUP HOME',title:'Season, group and history',empty:'Your group home will appear here after you start or join a room.'},
    event:{label:'Event',kicker:'EVENT',title:'Picks, results and recap',empty:'Choose an event to start picking.'},
    settings:{label:'Settings',kicker:'SETTINGS',title:'Profile and commissioner controls',empty:'Profile and group controls appear after you join a permanent group.'}
  };

  const routeIds={
    home:['picksGroupCard','picksHistoryCard'],
    event:[
      'picksEventPicker','picksEventHero','picksSetupNote','picksRoomBanner','picksLiveNotices',
      'picksLivePanel','picksEventRecap','picksRoomSetup','picksAdminPanel','picksProgressCard',
      'picksFightList','picksStandingsCard','picksRoomPicksCard'
    ],
    settings:['picksProfileShell','picksCommissionerCard']
  };

  function validRoute(value){
    return ROUTES.includes(String(value || '').toLowerCase()) ? String(value).toLowerCase() : '';
  }

  function ensureShell(){
    const shell=document.querySelector('#picks .picks-shell');
    if(!shell) return null;

    if(!document.getElementById('picksInternalNav')){
      const nav=document.createElement('nav');
      nav.id='picksInternalNav';
      nav.className='picks-internal-nav';
      nav.setAttribute('aria-label','Picks sections');
      nav.setAttribute('role','tablist');
      nav.innerHTML=ROUTES.map(route=>`<button type="button" role="tab" data-picks-route="${route}" aria-controls="picks${route[0].toUpperCase()+route.slice(1)}View"><span>${routeConfig[route].label}</span><i aria-hidden="true"></i></button>`).join('');
      shell.prepend(nav);
      nav.querySelectorAll('[data-picks-route]').forEach(button=>button.addEventListener('click',()=>setRoute(button.dataset.picksRoute,{updateUrl:true,scroll:true})));
    }

    ROUTES.forEach(route=>{
      const viewId=`picks${route[0].toUpperCase()+route.slice(1)}View`;
      if(document.getElementById(viewId)) return;
      const view=document.createElement('section');
      view.id=viewId;
      view.className=`picks-internal-view picks-${route}-view`;
      view.dataset.picksView=route;
      view.setAttribute('role','tabpanel');
      view.innerHTML=`<div class="picks-view-heading"><span>${routeConfig[route].kicker}</span><strong>${routeConfig[route].title}</strong></div><div id="picks${route[0].toUpperCase()+route.slice(1)}Content" class="picks-route-content"></div><div id="picks${route[0].toUpperCase()+route.slice(1)}Empty" class="picks-route-empty" hidden>${routeConfig[route].empty}${route==='home'?' <button type="button" data-open-event>Open Event</button>':''}</div>`;
      shell.appendChild(view);
      view.querySelector('[data-open-event]')?.addEventListener('click',()=>setRoute('event',{updateUrl:true,scroll:true}));
    });

    const progress=document.getElementById('picksProgress')?.closest('.picks-progress-card');
    if(progress && !progress.id) progress.id='picksProgressCard';
    return shell;
  }

  function routeNode(id,route){
    const node=document.getElementById(id);
    const content=document.getElementById(`picks${route[0].toUpperCase()+route.slice(1)}Content`);
    if(node && content && node.parentElement!==content) content.appendChild(node);
  }

  function orderContent(route){
    const content=document.getElementById(`picks${route[0].toUpperCase()+route.slice(1)}Content`);
    if(!content) return;
    const desired=routeIds[route].map(id=>document.getElementById(id)).filter(Boolean);
    const desiredIds=desired.map(node=>node.id).join('|');
    const currentIds=[...content.children].map(node=>node.id).filter(Boolean).join('|');
    if(desiredIds!==currentIds) desired.forEach(node=>content.appendChild(node));
  }

  function syncEmptyStates(){
    ROUTES.forEach(route=>{
      const content=document.getElementById(`picks${route[0].toUpperCase()+route.slice(1)}Content`);
      const empty=document.getElementById(`picks${route[0].toUpperCase()+route.slice(1)}Empty`);
      if(!content || !empty) return;
      const visible=[...content.children].some(node=>!node.hidden && getComputedStyle(node).display!=='none');
      empty.hidden=visible;
    });
  }

  function routeExistingContent(){
    if(routing) return;
    routing=true;
    try{
      if(!ensureShell()) return;
      ROUTES.forEach(route=>routeIds[route].forEach(id=>routeNode(id,route)));
      ROUTES.forEach(orderContent);
      syncEmptyStates();
      applyRoute(activeRoute || initialRoute(),false);
    }finally{
      routing=false;
    }
  }

  function initialRoute(){
    const url=new URL(window.location.href);
    const explicit=validRoute(url.searchParams.get(URL_KEY));
    if(explicit) return explicit;
    const room=String(url.searchParams.get('room') || '').trim();
    if(room) return 'event';
    const remembered=validRoute(sessionStorage.getItem(SESSION_KEY));
    return remembered || 'home';
  }

  function applyRoute(route,scroll){
    const next=validRoute(route) || 'home';
    activeRoute=next;
    ROUTES.forEach(name=>{
      const view=document.querySelector(`[data-picks-view="${name}"]`);
      const button=document.querySelector(`[data-picks-route="${name}"]`);
      const active=name===next;
      if(view) view.hidden=!active;
      if(button){
        button.classList.toggle('active',active);
        button.setAttribute('aria-selected',String(active));
        button.tabIndex=active ? 0 : -1;
      }
    });
    document.getElementById('picks')?.setAttribute('data-picks-active-view',next);
    if(scroll) document.getElementById('picksInternalNav')?.scrollIntoView({behavior:'smooth',block:'start'});
    window.dispatchEvent(new CustomEvent('picks:routechange',{detail:{route:next}}));
  }

  function setRoute(route,{updateUrl=true,scroll=false}={}){
    const next=validRoute(route) || 'home';
    sessionStorage.setItem(SESSION_KEY,next);
    if(updateUrl){
      const url=new URL(window.location.href);
      url.searchParams.set(URL_KEY,next);
      history.replaceState(null,'',url.toString());
    }
    applyRoute(next,scroll);
  }

  function isEventAction(target){
    if(!target) return false;
    if(target.closest('[data-group-room],[data-history-room],[data-admin-fight],#picksRoomAction,#picksCompleteEvent,#picksMarkEventLive,#picksSeeAllResults,#picksSeeAllRoomPicks,#picksJumpCurrent')) return true;
    const button=target.closest('button,a');
    const text=String(button?.textContent || '').trim().toLowerCase();
    return /^(open current|open recap|open event|open room|results|room picks|see fight results|see every room pick)/.test(text);
  }

  function updateEventIndicator(){
    const button=document.querySelector('[data-picks-route="event"]');
    if(!button) return;
    const hasRoom=Boolean(new URL(window.location.href).searchParams.get('room') || document.querySelector('#picksRoomBanner .picks-code'));
    button.classList.toggle('has-room',hasRoom);
  }

  function start(){
    activeRoute=initialRoute();
    routeExistingContent();
    updateEventIndicator();

    document.addEventListener('click',event=>{
      if(isEventAction(event.target)) setRoute('event',{updateUrl:true,scroll:false});
    },true);

    const observer=new MutationObserver(()=>{
      clearTimeout(start.timer);
      start.timer=setTimeout(()=>{
        routeExistingContent();
        updateEventIndicator();
      },90);
    });
    observer.observe(document.getElementById('picks') || document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class']});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
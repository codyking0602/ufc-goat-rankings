(function(){
  'use strict';

  const VERSION='picks-internal-navigation-20260718a-fast-routes';
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
      'picksEventPicker','picksEventHero','picksRoomBanner','picksLiveNotices','picksLivePanel',
      'picksEventRecap','picksAdminPanel','picksProgressCard','picksFightList','picksStandingsCard','picksRoomPicksCard'
    ],
    settings:['picksProfileShell','picksCommissionerCard']
  };
  routeIds.home=['picksRoomSetup','picksSetupNote',...routeIds.home];

  function validRoute(value){const route=String(value||'').toLowerCase();return ROUTES.includes(route)?route:'';}
  function routeViewId(route){return `picks${route[0].toUpperCase()+route.slice(1)}View`;}
  function routeContentId(route){return `picks${route[0].toUpperCase()+route.slice(1)}Content`;}
  function focusRoute(route){document.querySelector(`[data-picks-route="${route}"]`)?.focus();}

  function bindNavKeyboard(nav){if(nav.dataset.keyboardBound)return;nav.dataset.keyboardBound='true';nav.addEventListener('keydown',event=>{const current=event.target.closest?.('[data-picks-route]');if(!current)return;const index=ROUTES.indexOf(current.dataset.picksRoute);let next=-1;if(event.key==='ArrowRight')next=(index+1)%ROUTES.length;if(event.key==='ArrowLeft')next=(index-1+ROUTES.length)%ROUTES.length;if(event.key==='Home')next=0;if(event.key==='End')next=ROUTES.length-1;if(next<0)return;event.preventDefault();const route=ROUTES[next];setRoute(route,{updateUrl:true,scroll:false});focusRoute(route);});}

  function ensureShell(){
    const shell=document.querySelector('#picks .picks-shell');if(!shell)return null;
    let nav=document.getElementById('picksInternalNav');
    if(!nav){nav=document.createElement('nav');nav.id='picksInternalNav';nav.className='picks-internal-nav';nav.setAttribute('aria-label','Picks sections');nav.setAttribute('role','tablist');nav.innerHTML=ROUTES.map(route=>{const tabId=`picks${route[0].toUpperCase()+route.slice(1)}Tab`;return `<button id="${tabId}" type="button" role="tab" data-picks-route="${route}" aria-controls="${routeViewId(route)}"><span>${routeConfig[route].label}</span><i aria-hidden="true"></i></button>`;}).join('');shell.prepend(nav);nav.querySelectorAll('[data-picks-route]').forEach(button=>button.addEventListener('click',()=>setRoute(button.dataset.picksRoute,{updateUrl:true,scroll:false})));}
    bindNavKeyboard(nav);
    ROUTES.forEach(route=>{const viewId=routeViewId(route);if(document.getElementById(viewId))return;const view=document.createElement('section');view.id=viewId;view.className=`picks-internal-view picks-${route}-view`;view.dataset.picksView=route;view.setAttribute('role','tabpanel');view.setAttribute('aria-labelledby',`picks${route[0].toUpperCase()+route.slice(1)}Tab`);view.innerHTML=`<div class="picks-view-heading"><span>${routeConfig[route].kicker}</span><strong>${routeConfig[route].title}</strong></div><div id="${routeContentId(route)}" class="picks-route-content"></div><div id="picks${route[0].toUpperCase()+route.slice(1)}Empty" class="picks-route-empty" hidden>${routeConfig[route].empty}${route==='home'?' <button type="button" data-open-event>Open Event</button>':''}</div>`;shell.appendChild(view);view.querySelector('[data-open-event]')?.addEventListener('click',()=>setRoute('event',{updateUrl:true,scroll:false}));});
    const progress=document.getElementById('picksProgress')?.closest('.picks-progress-card');if(progress&&!progress.id)progress.id='picksProgressCard';return shell;
  }

  function routeNode(id,route){const node=document.getElementById(id);const content=document.getElementById(routeContentId(route));if(node&&content&&node.parentElement!==content)content.appendChild(node);}
  function orderContent(route){const content=document.getElementById(routeContentId(route));if(!content)return;const desired=routeIds[route].map(id=>document.getElementById(id)).filter(Boolean);const desiredIds=desired.map(node=>node.id).join('|');const currentIds=[...content.children].map(node=>node.id).filter(Boolean).join('|');if(desiredIds!==currentIds)desired.forEach(node=>content.appendChild(node));}
  function meaningfulNode(node){if(!node||node.hidden||node.getAttribute('aria-hidden')==='true')return false;const style=getComputedStyle(node);if(style.display==='none'||style.visibility==='hidden')return false;if(node.id==='picksHistoryCard')return Boolean(node.querySelector('.picks-history-row'));if(node.id==='picksGroupCard')return Boolean(node.querySelector('#picksHomeCompact,.picks-group-member,.picks-group-event'));if(node.id==='picksProfileShell')return Boolean(node.querySelector('.social-profile'));if(node.id==='picksCommissionerCard')return Boolean(node.querySelector('#picksCommissionerContent')?.children.length);if(node.id==='picksFightList')return Boolean(node.children.length);if(node.id==='picksEventHero')return Boolean(node.textContent.trim());return Boolean(node.textContent.trim()||node.childElementCount);}
  function syncEmptyStates(){ROUTES.forEach(route=>{const content=document.getElementById(routeContentId(route));const empty=document.getElementById(`picks${route[0].toUpperCase()+route.slice(1)}Empty`);if(!content||!empty)return;empty.hidden=[...content.children].some(meaningfulNode);});}
  function routeFromLocation({remember=true}={}){const url=new URL(window.location.href);const explicit=validRoute(url.searchParams.get(URL_KEY));if(explicit)return explicit;if(String(url.searchParams.get('room')||'').trim())return'event';if(remember){const stored=validRoute(sessionStorage.getItem(SESSION_KEY));if(stored)return stored;}return'home';}
  function needsRouting(){return ROUTES.some(route=>{const content=document.getElementById(routeContentId(route));return routeIds[route].some(id=>{const node=document.getElementById(id);return node&&content&&node.parentElement!==content;});});}
  function routeExistingContent(){if(routing)return;routing=true;try{if(!ensureShell())return;ROUTES.forEach(route=>routeIds[route].forEach(id=>routeNode(id,route)));ROUTES.forEach(orderContent);syncEmptyStates();applyRoute(activeRoute||routeFromLocation(),false);}finally{routing=false;}}
  function applyRoute(route,scroll){const next=validRoute(route)||'home';activeRoute=next;ROUTES.forEach(name=>{const view=document.querySelector(`[data-picks-view="${name}"]`);const button=document.querySelector(`[data-picks-route="${name}"]`);const active=name===next;if(view)view.hidden=!active;if(button){button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;}});document.getElementById('picks')?.setAttribute('data-picks-active-view',next);if(scroll)requestAnimationFrame(()=>document.getElementById('picksInternalNav')?.scrollIntoView({behavior:'auto',block:'start'}));window.dispatchEvent(new CustomEvent('picks:routechange',{detail:{route:next}}));}
  function setRoute(route,{updateUrl=true,scroll=false}={}){const next=validRoute(route)||'home';sessionStorage.setItem(SESSION_KEY,next);if(updateUrl){const url=new URL(window.location.href);url.searchParams.set(URL_KEY,next);history.replaceState(null,'',url.toString());}applyRoute(next,scroll);requestAnimationFrame(syncEmptyStates);}
  function isEventAction(target){if(!target)return false;if(target.closest('[data-group-room],[data-history-room],[data-admin-fight],#picksRoomAction,#picksCompleteEvent,#picksMarkEventLive,#picksSeeAllResults,#picksSeeAllRoomPicks,#picksJumpCurrent'))return true;const button=target.closest('button,a');const label=String(button?.textContent||'').trim().toLowerCase();return/^(open current|open recap|open event|open room|results|room picks|see fight results|see every room pick)/.test(label);}
  function updateEventIndicator(){const button=document.querySelector('[data-picks-route="event"]');if(!button)return;const hasRoom=Boolean(new URL(window.location.href).searchParams.get('room')||document.querySelector('#picksRoomBanner .picks-code'));button.classList.toggle('has-room',hasRoom);}

  function start(){
    activeRoute=routeFromLocation();routeExistingContent();updateEventIndicator();
    document.addEventListener('click',event=>{if(isEventAction(event.target))setRoute('event',{updateUrl:true,scroll:false});},true);
    window.addEventListener('popstate',()=>{const next=routeFromLocation({remember:false});sessionStorage.setItem(SESSION_KEY,next);applyRoute(next,false);updateEventIndicator();});
    window.addEventListener('picks:profileupdated',()=>requestAnimationFrame(syncEmptyStates));
    const root=document.getElementById('picks')||document.body;
    const observer=new MutationObserver(()=>{clearTimeout(start.timer);start.timer=setTimeout(()=>{if(needsRouting())routeExistingContent();else{syncEmptyStates();updateEventIndicator();}},45);});
    observer.observe(root,{childList:true,subtree:true});
    window.UFCPicksNavigation={version:VERSION,setRoute,getRoute:()=>activeRoute,refresh:routeExistingContent};
    document.documentElement.setAttribute('data-picks-internal-navigation',VERSION);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
(function(){
  'use strict';

  const VERSION='app-update-watcher-20260718f-build-aware-refresh';
  const WHAT_CHANGED_SRC='assets/js/what-changed.js?v=what-changed-20260718b-compact';
  const PROFILE_BRIDGE_SRC='assets/js/activity-profile-phase3-bridge.js?v=activity-profile-phase3-bridge-20260718a';
  const RESTORE_KEY='ufc-goat-manual-refresh-v1';
  const LEGACY_KEYS=['ufc-goat-update-restore-v1','ufc-goat-update-target-v1','ufc-goat-manual-refresh-progress-v1'];
  let playSupportScheduled=false;
  let whatChangedLoading=null;
  let refreshBusy=false;

  const currentBuild=()=>document.querySelector('meta[name="app-build"]')?.content||'';
  const activeView=()=>document.querySelector('.tab.active')?.dataset.view||document.querySelector('.view.active-view')?.id||'home';
  const activePlayMode=()=>document.querySelector('[data-play-mode].active')?.dataset.playMode||'top10';

  function loadScript(id,src){
    if(document.getElementById(id)||document.querySelector(`script[src*="${src.split('?')[0]}"]`))return null;
    const script=document.createElement('script');script.id=id;script.src=src;script.async=true;document.head.appendChild(script);return script;
  }

  function cleanRefreshState(){
    const button=document.getElementById('manualRefreshBtn');
    button?.classList.remove('refreshing');button?.removeAttribute('aria-busy');if(button)delete button.dataset.refreshBusy;
    const track=document.getElementById('manualRefreshProgress');track?.classList.remove('visible');track?.setAttribute('aria-hidden','true');
    const fill=document.getElementById('manualRefreshProgressFill');if(fill)fill.style.width='0%';
    const url=new URL(window.location.href);let changed=false;
    ['__manual_refresh','__shell','__app_update','__build_check'].forEach(key=>{if(url.searchParams.has(key)){url.searchParams.delete(key);changed=true;}});
    if(changed)window.history.replaceState(window.history.state,'',`${url.pathname}${url.search}${url.hash}`);
  }

  function saveState(){
    const state={activeView:activeView(),playMode:activePlayMode(),search:document.getElementById('search')?.value||'',era:document.getElementById('eraFilter')?.value||'All',division:document.getElementById('divisionFilter')?.value||'All',category:document.getElementById('categoryBoardSelect')?.value||'',scrollY:window.scrollY||0};
    try{sessionStorage.setItem(RESTORE_KEY,JSON.stringify(state));}catch(_error){}
  }
  function setControlValue(id,value){const node=document.getElementById(id);if(!node)return;if(node.options){if([...node.options].some(option=>option.value===value))node.value=value;return;}node.value=value||'';}
  function restoreState(){
    let state=null;try{state=JSON.parse(sessionStorage.getItem(RESTORE_KEY)||'null');sessionStorage.removeItem(RESTORE_KEY);}catch(_error){}
    if(!state)return;
    setControlValue('search',state.search);setControlValue('eraFilter',state.era);setControlValue('divisionFilter',state.division);setControlValue('categoryBoardSelect',state.category);
    document.querySelector(`.tab[data-view="${state.activeView||'home'}"]`)?.click();
    if(state.activeView==='play'){schedulePlaySupport();document.querySelector(`[data-play-mode="${state.playMode||'top10'}"]`)?.click();}
    if(state.era)document.getElementById('eraFilter')?.dispatchEvent(new Event('change',{bubbles:true}));
    if(state.category)document.getElementById('categoryBoardSelect')?.dispatchEvent(new Event('change',{bubbles:true}));
    window.setTimeout(()=>window.scrollTo({top:Number(state.scrollY)||0,left:0,behavior:'auto'}),120);
  }

  function progress(value){const fill=document.getElementById('manualRefreshProgressFill');if(fill)fill.style.width=`${Math.max(0,Math.min(100,value))}%`;}
  function beginRefresh(button){if(!button)return;button.dataset.refreshBusy='true';button.classList.add('refreshing');button.setAttribute('aria-busy','true');button.textContent='↻ Syncing';const track=document.getElementById('manualRefreshProgress');track?.classList.add('visible');track?.setAttribute('aria-hidden','false');progress(18);}
  function finishRefresh(button,label='Updated'){progress(100);if(button)button.textContent=`✓ ${label}`;window.setTimeout(()=>{if(button){button.textContent='↻ Refresh';button.classList.remove('refreshing');button.removeAttribute('aria-busy');delete button.dataset.refreshBusy;}const track=document.getElementById('manualRefreshProgress');track?.classList.remove('visible');track?.setAttribute('aria-hidden','true');progress(0);refreshBusy=false;},700);}

  async function remoteBuild(){
    const controller=new AbortController();const timer=window.setTimeout(()=>controller.abort(),1800);
    try{const url=new URL('index.html',document.baseURI);url.searchParams.set('__build_check',String(Date.now()));const response=await fetch(url,{cache:'no-store',headers:{'Cache-Control':'no-cache'},signal:controller.signal});if(!response.ok)return'';const html=await response.text();return html.match(/<meta\s+name=["']app-build["']\s+content=["']([^"']+)["']/i)?.[1]||html.match(/<meta\s+content=["']([^"']+)["']\s+name=["']app-build["']/i)?.[1]||'';}catch(_error){return'';}finally{window.clearTimeout(timer);}
  }

  async function quickSync(){
    const tasks=[];const add=value=>{if(value&&typeof value.then==='function')tasks.push(value);};
    try{add(window.UFC_PLAY_DAILY_SERVICE?.recoverCurrentDay?.());}catch(_error){}
    try{add(window.UFC_DAILY_LEADERBOARD_LIVE?.check?.({force:true}));}catch(_error){}
    try{add(window.UFC_PROFILE_CHALLENGES?.loadInbox?.());}catch(_error){}
    try{add(window.UFC_APP_NOTIFICATIONS?.loadSettings?.(true));}catch(_error){}
    try{if(activeView()==='octagon'||activeView()==='war-room')add(window.UFC_OCTAGON_BOARD?.load?.(null,{silent:true}));}catch(_error){}
    try{window.UFC_HOME_DASHBOARD?.render?.();}catch(_error){}
    window.dispatchEvent(new CustomEvent('octagon-hq:soft-refresh',{detail:{view:activeView(),build:currentBuild()}}));
    await Promise.race([Promise.allSettled(tasks),new Promise(resolve=>window.setTimeout(resolve,1800))]);
  }

  async function installNewBuild(build){saveState();progress(82);try{const registration=await navigator.serviceWorker?.getRegistration?.();await registration?.update?.();}catch(_error){}const url=new URL(window.location.href);url.searchParams.set('__app_update',`${build||'latest'}-${Date.now()}`);window.location.replace(url.toString());}
  async function networkRefresh(button){
    if(refreshBusy||button?.dataset.refreshBusy==='true')return;
    refreshBusy=true;beginRefresh(button);const local=currentBuild();
    try{const buildPromise=remoteBuild();await quickSync();progress(58);const remote=await buildPromise;if(remote&&remote!==local){if(button)button.textContent='↻ Updating app';await installNewBuild(remote);return;}finishRefresh(button,remote?'Updated':'Synced');}catch(error){console.error(error);finishRefresh(button,'Synced');}
  }

  function changeSource(){return window.OCTAGON_CHANGELOG||{entries:[],seenStorageKey:'octagon-hq-what-changed-seen-v1'};}
  function seenIds(){try{const parsed=JSON.parse(localStorage.getItem(changeSource().seenStorageKey)||'[]');return new Set(Array.isArray(parsed)?parsed:[]);}catch(_error){return new Set();}}
  function unreadCount(){const seen=seenIds();return(changeSource().entries||[]).filter(entry=>entry?.id&&!seen.has(entry.id)).length;}
  function syncUnread(){const button=document.getElementById('whatsNewBtn'),badge=document.getElementById('whatsNewUnread');if(!button||!badge)return;const count=unreadCount();button.classList.toggle('has-unread',count>0);badge.hidden=count===0;badge.textContent=count>99?'99+':String(count);badge.setAttribute('aria-label',`${count} unread update${count===1?'':'s'}`);button.setAttribute('aria-label',count?`Open What Changed, ${count} unread update${count===1?'':'s'}`:'Open What Changed');}
  function loadWhatChanged(){if(window.UFC_WHAT_CHANGED)return Promise.resolve(window.UFC_WHAT_CHANGED);if(whatChangedLoading)return whatChangedLoading;whatChangedLoading=new Promise((resolve,reject)=>{const existing=document.getElementById('whatChangedController');if(existing){existing.addEventListener('load',()=>resolve(window.UFC_WHAT_CHANGED),{once:true});existing.addEventListener('error',reject,{once:true});return;}const script=document.createElement('script');script.id='whatChangedController';script.src=WHAT_CHANGED_SRC;script.async=true;script.addEventListener('load',()=>window.UFC_WHAT_CHANGED?resolve(window.UFC_WHAT_CHANGED):reject(new Error('What Changed controller did not initialize')),{once:true});script.addEventListener('error',()=>reject(new Error('What Changed controller failed to load')),{once:true});document.head.appendChild(script);}).finally(()=>{whatChangedLoading=null;});return whatChangedLoading;}
  function openWhatChanged(trigger){const button=trigger||document.getElementById('whatsNewBtn');button?.setAttribute('aria-busy','true');loadWhatChanged().then(controller=>controller.open(button)).catch(()=>{if(button)button.setAttribute('aria-label','What Changed could not load. Refresh and try again.');}).finally(()=>button?.removeAttribute('aria-busy'));}

  function injectStyles(){
    if(document.getElementById('appUpdateWatcherStyles'))return;
    const style=document.createElement('style');style.id='appUpdateWatcherStyles';style.textContent=`
      #manualRefreshControl{display:flex;flex:0 0 auto;align-self:flex-start;flex-direction:column;align-items:stretch;gap:4px;min-width:206px}#manualRefreshActions{display:flex;align-items:center;justify-content:flex-end;gap:7px}
      #manualRefreshBtn,#whatsNewBtn{position:relative;z-index:1;min-height:40px;padding:9px 13px;border:1px solid rgba(249,115,22,.72);border-radius:999px;background:rgba(10,13,19,.9);box-shadow:0 10px 30px rgba(0,0,0,.24);color:#fed7aa;font:900 .76rem/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.06em;white-space:nowrap;cursor:pointer}#whatsNewBtn{display:grid;place-items:center;min-width:82px;border-color:rgba(255,255,255,.2);color:#f8fafc;text-align:center}#whatsNewBtn.has-unread{border-color:rgba(249,115,22,.9);box-shadow:0 0 0 3px rgba(249,115,22,.11),0 10px 30px rgba(0,0,0,.24)}#whatsNewUnread{position:absolute;top:5px;right:5px;display:grid;place-items:center;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:#f97316;color:#1b0c03;font:950 10px/1 system-ui;letter-spacing:0}#whatsNewUnread[hidden]{display:none!important}#manualRefreshBtn:active,#whatsNewBtn:active{transform:translateY(1px) scale(.98)}#manualRefreshBtn.refreshing{opacity:.82;pointer-events:none}#manualRefreshProgress{height:2px;width:calc(100% - 14px);margin:0 7px;border-radius:999px;overflow:hidden;background:rgba(249,115,22,.16);opacity:0;transition:opacity .12s ease}#manualRefreshProgress.visible{opacity:1}#manualRefreshProgressFill{display:block;height:100%;width:0;border-radius:inherit;background:#f97316;box-shadow:0 0 5px rgba(249,115,22,.7);transition:width .16s ease}
      @media(max-width:900px){#manualRefreshControl{order:-1;align-self:flex-end;min-width:196px}#manualRefreshBtn,#whatsNewBtn{min-height:38px;padding:8px 11px;font-size:.7rem}#whatsNewBtn{padding-left:22px;padding-right:22px}}@media(max-width:430px){#manualRefreshControl{min-width:0;width:100%}#manualRefreshActions{justify-content:stretch}#manualRefreshBtn,#whatsNewBtn{flex:1;padding-left:8px;padding-right:8px}}
    `;document.head.appendChild(style);
  }

  function installButton(){const hero=document.querySelector('.hero');if(!hero)return;let control=document.getElementById('manualRefreshControl');if(!control){control=document.createElement('div');control.id='manualRefreshControl';control.innerHTML='<div id="manualRefreshActions"><button id="manualRefreshBtn" type="button" aria-label="Sync the latest app data and check for updates">↻ Refresh</button><button id="whatsNewBtn" type="button" aria-label="Open What Changed">NEW <span id="whatsNewUnread" role="status" aria-live="polite" hidden></span></button></div><div id="manualRefreshProgress" aria-hidden="true"><i id="manualRefreshProgressFill"></i></div>';hero.appendChild(control);}const refreshButton=document.getElementById('manualRefreshBtn');if(refreshButton&&!refreshButton.dataset.currentRefreshBound){refreshButton.dataset.currentRefreshBound='true';refreshButton.addEventListener('click',event=>void networkRefresh(event.currentTarget));}const button=document.getElementById('whatsNewBtn');if(button&&!button.dataset.currentWhatsNewBound){button.dataset.currentWhatsNewBound='true';button.addEventListener('click',event=>openWhatChanged(event.currentTarget));}syncUnread();}

  function loadPermanentDaily(){loadScript('playPermanentDailyController','assets/js/play-daily-rotation.js?v=play-daily-controller-20260717e-find-leader-permanent');}
  function loadDailyLeaderboard(){loadScript('playDailyLeaderboardCurrent','assets/js/play-daily-leaderboard.js?v=play-daily-leaderboard-20260717e-find-leader-only');loadScript('playDailyLeaderboardLive','assets/js/play-daily-live-sync.js?v=play-daily-live-sync-20260718a-phase-3');}
  function loadChallengeCompat(){loadScript('playChallengeCompatCurrent','assets/js/play-challenge-compat.js?v=play-challenge-compat-20260717c-on-demand');}
  function loadBlindSupport(){loadScript('blindDailyStartupFixCurrent','assets/js/blind-daily-startup-fix.js?v=blind-daily-startup-fix-20260717f-on-demand');}
  function schedulePlaySupport(){if(playSupportScheduled)return;playSupportScheduled=true;requestAnimationFrame(()=>{loadPermanentDaily();const loadBoard=()=>loadDailyLeaderboard();if(typeof requestIdleCallback==='function')requestIdleCallback(loadBoard,{timeout:450});else window.setTimeout(loadBoard,100);});}
  function bindDeferredSupport(){if(document.documentElement.dataset.playSupportBinding===VERSION)return;document.documentElement.dataset.playSupportBinding=VERSION;window.addEventListener('octagon-hq:view-change',event=>{if(event.detail?.destination==='play')schedulePlaySupport();});document.addEventListener('click',event=>{if(event.target.closest?.('[data-open-game="blind"],[data-play-mode="blind"],[data-five-round-replay]'))loadBlindSupport();if(event.target.closest?.('[data-kc-challenge],[data-br-challenge],[data-five-round-share]'))loadChallengeCompat();},true);}

  LEGACY_KEYS.forEach(key=>{try{sessionStorage.removeItem(key);}catch(_error){}});
  cleanRefreshState();injectStyles();installButton();bindDeferredSupport();loadScript('activityProfilePhase3Bridge',PROFILE_BRIDGE_SRC);window.setTimeout(restoreState,100);
  window.addEventListener('octagon-hq:what-changed-seen',syncUnread);
  window.addEventListener('storage',event=>{if(event.key===changeSource().seenStorageKey)syncUnread();});

  window.UFC_APP_UPDATE_WATCHER={version:VERSION,refresh:networkRefresh,quickSync,openWhatChanged,syncUnread,schedulePlaySupport};
  document.documentElement.setAttribute('data-app-update-watcher',VERSION);
})();

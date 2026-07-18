(function(){
  'use strict';

  const VERSION='app-update-watcher-20260718c-compact-feed';
  const WHAT_CHANGED_SRC='assets/js/what-changed.js?v=what-changed-20260718b-compact';
  const RESTORE_KEY='ufc-goat-manual-refresh-v1';
  const PROGRESS_KEY='ufc-goat-manual-refresh-progress-v1';
  const LEGACY_KEYS=['ufc-goat-update-restore-v1','ufc-goat-update-target-v1'];
  let playSupportScheduled=false;
  let whatChangedLoading=null;

  function activeView(){return document.querySelector('.tab.active')?.dataset.view||document.querySelector('.view.active-view')?.id||'home';}
  function activePlayMode(){return document.querySelector('[data-play-mode].active')?.dataset.playMode||'top10';}

  function cleanRefreshState(){
    try{sessionStorage.removeItem(PROGRESS_KEY);}catch(_error){}
    const button=document.getElementById('manualRefreshBtn');
    button?.classList.remove('refreshing');
    button?.removeAttribute('aria-busy');
    if(button)delete button.dataset.refreshBusy;
    const track=document.getElementById('manualRefreshProgress');
    track?.classList.remove('visible');
    track?.setAttribute('aria-hidden','true');
    const fill=document.getElementById('manualRefreshProgressFill');
    if(fill)fill.style.width='0%';
    const url=new URL(window.location.href);
    let changed=false;
    ['__manual_refresh','__shell'].forEach(key=>{if(url.searchParams.has(key)){url.searchParams.delete(key);changed=true;}});
    if(changed)window.history.replaceState(window.history.state,'',`${url.pathname}${url.search}${url.hash}`);
  }

  function saveState(){
    const state={activeView:activeView(),playMode:activePlayMode(),search:document.getElementById('search')?.value||'',era:document.getElementById('eraFilter')?.value||'All',division:document.getElementById('divisionFilter')?.value||'All',fighterA:document.getElementById('fighterA')?.value||'',fighterB:document.getElementById('fighterB')?.value||'',category:document.getElementById('categoryBoardSelect')?.value||'',scrollY:window.scrollY||0};
    try{sessionStorage.setItem(RESTORE_KEY,JSON.stringify(state));}catch(_error){}
  }
  function setControlValue(id,value){
    const node=document.getElementById(id);if(!node)return;
    if(node.options){if([...node.options].some(option=>option.value===value))node.value=value;return;}
    node.value=value||'';
  }
  function restoreState(){
    let state=null;
    try{state=JSON.parse(sessionStorage.getItem(RESTORE_KEY)||'null');sessionStorage.removeItem(RESTORE_KEY);}catch(_error){}
    if(!state)return;
    setControlValue('search',state.search);setControlValue('eraFilter',state.era);setControlValue('divisionFilter',state.division);setControlValue('fighterA',state.fighterA);setControlValue('fighterB',state.fighterB);setControlValue('categoryBoardSelect',state.category);
    if(['men','women','division','categories'].includes(state.activeView)&&typeof window.refresh==='function'){try{window.refresh();}catch(_error){}}
    document.querySelector(`.tab[data-view="${state.activeView||'home'}"]`)?.click();
    if(state.activeView==='play'){schedulePlaySupport();document.querySelector(`[data-play-mode="${state.playMode||'top10'}"]`)?.click();}
    if(state.era)document.getElementById('eraFilter')?.dispatchEvent(new Event('change',{bubbles:true}));
    if(state.category)document.getElementById('categoryBoardSelect')?.dispatchEvent(new Event('change',{bubbles:true}));
    window.setTimeout(()=>window.scrollTo({top:Number(state.scrollY)||0,left:0,behavior:'auto'}),100);
  }

  function showQuickProgress(button){
    if(!button)return;
    button.classList.add('refreshing');button.setAttribute('aria-busy','true');
    const track=document.getElementById('manualRefreshProgress');const fill=document.getElementById('manualRefreshProgressFill');
    track?.classList.add('visible');track?.setAttribute('aria-hidden','false');
    if(fill){fill.style.width='28%';window.setTimeout(()=>{fill.style.width='88%';},20);}
  }
  function networkRefresh(button){
    if(button?.dataset.refreshBusy==='true')return;
    if(button)button.dataset.refreshBusy='true';
    saveState();showQuickProgress(button);
    const url=new URL('index.html',window.location.href);url.searchParams.set('__manual_refresh',String(Date.now()));url.searchParams.set('__shell','light');url.hash=window.location.hash;
    window.setTimeout(()=>window.location.replace(url.toString()),50);
  }

  function changeSource(){return window.OCTAGON_CHANGELOG||{entries:[],seenStorageKey:'octagon-hq-what-changed-seen-v1'};}
  function seenIds(){
    const source=changeSource();
    try{const parsed=JSON.parse(localStorage.getItem(source.seenStorageKey)||'[]');return new Set(Array.isArray(parsed)?parsed:[]);}catch(_error){return new Set();}
  }
  function unreadCount(){const seen=seenIds();return(changeSource().entries||[]).filter(entry=>entry?.id&&!seen.has(entry.id)).length;}
  function syncUnread(){
    const button=document.getElementById('whatsNewBtn');const badge=document.getElementById('whatsNewUnread');if(!button||!badge)return;
    const count=unreadCount();
    button.classList.toggle('has-unread',count>0);badge.hidden=count===0;badge.textContent=count>99?'99+':String(count);badge.setAttribute('aria-label',`${count} unread update${count===1?'':'s'}`);
    button.setAttribute('aria-label',count?`Open What Changed, ${count} unread update${count===1?'':'s'}`:'Open What Changed');
  }
  function loadWhatChanged(){
    if(window.UFC_WHAT_CHANGED)return Promise.resolve(window.UFC_WHAT_CHANGED);
    if(whatChangedLoading)return whatChangedLoading;
    whatChangedLoading=new Promise((resolve,reject)=>{
      const existing=document.getElementById('whatChangedController');
      if(existing){existing.addEventListener('load',()=>resolve(window.UFC_WHAT_CHANGED),{once:true});existing.addEventListener('error',reject,{once:true});return;}
      const script=document.createElement('script');script.id='whatChangedController';script.src=WHAT_CHANGED_SRC;script.async=true;
      script.addEventListener('load',()=>window.UFC_WHAT_CHANGED?resolve(window.UFC_WHAT_CHANGED):reject(new Error('What Changed controller did not initialize')),{once:true});
      script.addEventListener('error',()=>reject(new Error('What Changed controller failed to load')),{once:true});
      document.head.appendChild(script);
    }).finally(()=>{whatChangedLoading=null;});
    return whatChangedLoading;
  }
  function openWhatChanged(trigger){
    const button=trigger||document.getElementById('whatsNewBtn');
    button?.setAttribute('aria-busy','true');
    loadWhatChanged().then(controller=>controller.open(button)).catch(()=>{if(button){button.dataset.loadError='true';button.setAttribute('aria-label','What Changed could not load. Refresh and try again.');}}).finally(()=>button?.removeAttribute('aria-busy'));
  }

  function injectStyles(){
    if(document.getElementById('appUpdateWatcherStyles'))return;
    const style=document.createElement('style');style.id='appUpdateWatcherStyles';style.textContent=`
      #manualRefreshControl{display:flex;flex:0 0 auto;align-self:flex-start;flex-direction:column;align-items:stretch;gap:4px;min-width:206px}#manualRefreshActions{display:flex;align-items:center;justify-content:flex-end;gap:7px}
      #manualRefreshBtn,#whatsNewBtn{position:relative;z-index:1;min-height:40px;padding:9px 13px;border:1px solid rgba(249,115,22,.72);border-radius:999px;background:rgba(10,13,19,.9);box-shadow:0 10px 30px rgba(0,0,0,.24);color:#fed7aa;font:900 .76rem/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.06em;white-space:nowrap;cursor:pointer}#whatsNewBtn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border-color:rgba(255,255,255,.2);color:#f8fafc}#whatsNewBtn.has-unread{border-color:rgba(249,115,22,.9);box-shadow:0 0 0 3px rgba(249,115,22,.11),0 10px 30px rgba(0,0,0,.24)}#whatsNewUnread{display:grid;place-items:center;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:#f97316;color:#1b0c03;font:950 10px/1 system-ui;letter-spacing:0}#whatsNewUnread[hidden]{display:none!important}#manualRefreshBtn:active,#whatsNewBtn:active{transform:translateY(1px) scale(.98)}#manualRefreshBtn.refreshing{opacity:.82;pointer-events:none}#manualRefreshProgress{height:2px;width:calc(100% - 14px);margin:0 7px;border-radius:999px;overflow:hidden;background:rgba(249,115,22,.16);opacity:0;transition:opacity .12s ease}#manualRefreshProgress.visible{opacity:1}#manualRefreshProgressFill{display:block;height:100%;width:0;border-radius:inherit;background:#f97316;box-shadow:0 0 5px rgba(249,115,22,.7);transition:width .12s ease}
      @media(max-width:900px){#manualRefreshControl{order:-1;align-self:flex-end;min-width:196px}#manualRefreshBtn,#whatsNewBtn{min-height:38px;padding:8px 11px;font-size:.7rem}}@media(max-width:430px){#manualRefreshControl{min-width:0;width:100%}#manualRefreshActions{justify-content:stretch}#manualRefreshBtn,#whatsNewBtn{flex:1;padding-left:8px;padding-right:8px}}
    `;document.head.appendChild(style);
  }
  function installButton(){
    const hero=document.querySelector('.hero');if(!hero)return;
    let control=document.getElementById('manualRefreshControl');
    if(!control){control=document.createElement('div');control.id='manualRefreshControl';control.innerHTML='<div id="manualRefreshActions"><button id="manualRefreshBtn" type="button" aria-label="Refresh app for the latest updates">↻ Refresh</button><button id="whatsNewBtn" type="button" aria-label="Open What Changed">NEW <span id="whatsNewUnread" role="status" aria-live="polite" hidden></span></button></div><div id="manualRefreshProgress" aria-hidden="true"><i id="manualRefreshProgressFill"></i></div>';hero.appendChild(control);}
    const refreshButton=document.getElementById('manualRefreshBtn');
    if(refreshButton&&!refreshButton.dataset.currentRefreshBound){refreshButton.dataset.currentRefreshBound='true';refreshButton.addEventListener('click',event=>networkRefresh(event.currentTarget));}
    const button=document.getElementById('whatsNewBtn');
    if(button&&!button.dataset.currentWhatsNewBound){button.dataset.currentWhatsNewBound='true';button.addEventListener('click',event=>openWhatChanged(event.currentTarget));}
    syncUnread();
  }

  function loadScript(id,src){if(document.getElementById(id))return;document.querySelectorAll(`script[data-deferred-guard="${id}"]`).forEach(node=>node.remove());const script=document.createElement('script');script.id=id;script.src=src;script.async=true;document.head.appendChild(script);}
  function loadPermanentDaily(){loadScript('playPermanentDailyController','assets/js/play-daily-rotation.js?v=play-daily-controller-20260717e-find-leader-permanent');}
  function loadDailyLeaderboard(){loadScript('playDailyLeaderboardCurrent','assets/js/play-daily-leaderboard.js?v=play-daily-leaderboard-20260717e-find-leader-only');}
  function loadChallengeCompat(){loadScript('playChallengeCompatCurrent','assets/js/play-challenge-compat.js?v=play-challenge-compat-20260717c-on-demand');}
  function loadBlindSupport(){loadScript('blindDailyStartupFixCurrent','assets/js/blind-daily-startup-fix.js?v=blind-daily-startup-fix-20260717f-on-demand');}
  function schedulePlaySupport(){if(playSupportScheduled)return;playSupportScheduled=true;requestAnimationFrame(()=>{loadPermanentDaily();const loadBoard=()=>loadDailyLeaderboard();if(typeof requestIdleCallback==='function')requestIdleCallback(loadBoard,{timeout:900});else window.setTimeout(loadBoard,250);});}
  function bindDeferredSupport(){
    if(document.documentElement.dataset.playSupportBinding===VERSION)return;
    document.documentElement.dataset.playSupportBinding=VERSION;
    window.addEventListener('octagon-hq:view-change',event=>{if(event.detail?.destination==='play')schedulePlaySupport();});
    document.addEventListener('click',event=>{if(event.target.closest?.('[data-open-game="blind"],[data-play-mode="blind"],[data-five-round-replay]'))loadBlindSupport();if(event.target.closest?.('[data-kc-challenge],[data-br-challenge],[data-five-round-share]'))loadChallengeCompat();},true);
  }

  LEGACY_KEYS.forEach(key=>{try{sessionStorage.removeItem(key);}catch(_error){}});
  cleanRefreshState();injectStyles();installButton();bindDeferredSupport();window.setTimeout(restoreState,160);
  window.addEventListener('octagon-hq:what-changed-seen',syncUnread);
  window.addEventListener('storage',event=>{if(event.key===changeSource().seenStorageKey)syncUnread();});

  window.UFC_APP_UPDATE_WATCHER={version:VERSION,networkRefresh,openWhatChanged,openWhatsNew:openWhatChanged,restoreState,syncUnread,unreadCount,schedulePlaySupport,loadPermanentDaily,loadDailyLeaderboard,loadChallengeCompat,loadBlindSupport,mode:'phase-2d-lazy-compact-history'};
  document.documentElement.setAttribute('data-app-update-watcher',VERSION);
})();

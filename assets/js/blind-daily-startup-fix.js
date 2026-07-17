(function(){
  'use strict';

  const VERSION='blind-daily-startup-fix-20260717e-refresh-failsafe';
  const REFRESH_LOCATION_KEY='ufc-goat-manual-refresh-location-v1';
  const PRIMARY_RESTORE_KEY='ufc-goat-manual-refresh-v1';
  const REFRESH_PROGRESS_KEY='ufc-goat-manual-refresh-progress-v1';
  const PETTIS_WHATS_NEW_KEY='ufc-whats-new-20260717-anthony-pettis';
  const REFRESH_FAILSAFE_MS=6500;
  let attempts=0;
  let timer=null;
  let pendingRefreshLocation=null;
  let refreshFailSafeTimer=null;

  function refreshProgressState(){
    let raw='';
    try{raw=sessionStorage.getItem(REFRESH_PROGRESS_KEY)||'';}catch(_error){}
    if(!raw)return null;
    if(raw==='1')return{startedAt:Date.now()-500};
    try{
      const state=JSON.parse(raw);
      const startedAt=Number(state?.startedAt);
      return Number.isFinite(startedAt)&&startedAt>0?{...state,startedAt}:null;
    }catch(_error){return null;}
  }

  function clearStrandedRefresh(reason='failsafe'){
    if(refreshFailSafeTimer)window.clearTimeout(refreshFailSafeTimer);
    refreshFailSafeTimer=null;
    try{sessionStorage.removeItem(REFRESH_PROGRESS_KEY);}catch(_error){}
    const button=document.getElementById('manualRefreshBtn');
    if(button){
      button.classList.remove('refreshing');
      button.removeAttribute('aria-busy');
    }
    const track=document.getElementById('manualRefreshProgress');
    if(track){
      track.classList.remove('visible');
      track.setAttribute('aria-hidden','true');
    }
    const fill=document.getElementById('manualRefreshProgressFill');
    if(fill)fill.style.width='0%';
    document.documentElement.setAttribute('data-refresh-progress-recovered',`${VERSION}:${reason}`);
  }

  function armRefreshFailSafe(){
    const state=refreshProgressState();
    const button=document.getElementById('manualRefreshBtn');
    const track=document.getElementById('manualRefreshProgress');
    const active=Boolean(state||button?.classList.contains('refreshing')||track?.classList.contains('visible'));
    if(!active)return false;
    const age=state?.startedAt?Math.max(0,Date.now()-state.startedAt):0;
    const remaining=Math.max(250,REFRESH_FAILSAFE_MS-age);
    const settle=reason=>window.setTimeout(()=>clearStrandedRefresh(reason),250);
    window.addEventListener('ufc-scoring-pipeline-ready',()=>settle('scoring-ready'),{once:true});
    window.addEventListener('ufc-production-ranking-ready',()=>settle('production-ready'),{once:true});
    if(document.readyState==='complete')window.setTimeout(()=>clearStrandedRefresh('page-ready'),2400);
    else window.addEventListener('load',()=>window.setTimeout(()=>clearStrandedRefresh('page-load'),2400),{once:true});
    refreshFailSafeTimer=window.setTimeout(()=>clearStrandedRefresh(age>=REFRESH_FAILSAFE_MS?'stale-state':'hard-timeout'),remaining);
    return true;
  }

  function usableRows(rows){
    return (rows||[]).filter(row=>{
      const rank=Number(row?.rank);
      const score=Number(row?.totalScore ?? row?.rawScore);
      return Boolean(row?.fighter)&&Number.isFinite(rank)&&rank>0&&Number.isFinite(score);
    });
  }

  function modelDataIsUsable(){
    const data=window.RANKING_DATA||{};
    return usableRows(data.men).length>=2;
  }

  function blindNeedsKick(){
    const game=window.UFC_BLIND_MATCHMAKING;
    const panel=document.getElementById('playBlindPanel');
    return Boolean(game?.state?.waitingForModel&&panel&&!panel.hidden);
  }

  function kickBlindGame(){
    if(!blindNeedsKick()||!modelDataIsUsable())return false;
    document.documentElement.setAttribute('data-scoring-pipeline','ready');
    window.dispatchEvent(new CustomEvent('ufc-scoring-pipeline-ready',{detail:{source:VERSION,fallback:true}}));
    document.documentElement.setAttribute('data-blind-daily-startup-fix',VERSION);
    return true;
  }

  function activeView(){
    const visible=document.querySelector('.view.active-view');
    if(visible?.id)return visible.id;
    return document.querySelector('.tab.active')?.dataset.view||'men';
  }

  function activePlayScreen(){
    return document.documentElement.getAttribute('data-play-screen')||'hub';
  }

  function captureRefreshLocation(){
    const state={
      activeView:activeView(),
      playScreen:activePlayScreen(),
      scrollY:window.scrollY||0
    };
    pendingRefreshLocation=state;
    try{sessionStorage.setItem(REFRESH_LOCATION_KEY,JSON.stringify(state));}catch(_error){}
    return state;
  }

  function readRefreshLocation(){
    try{return JSON.parse(sessionStorage.getItem(REFRESH_LOCATION_KEY)||'null');}
    catch(_error){return null;}
  }

  function patchPrimaryRestoreState(state){
    if(!state)return;
    let primary={};
    try{primary=JSON.parse(sessionStorage.getItem(PRIMARY_RESTORE_KEY)||'{}')||{};}catch(_error){}
    primary.activeView=state.activeView||'men';
    primary.scrollY=Number(state.scrollY)||0;
    if(primary.activeView==='play'){
      primary.playMode=state.playScreen==='blind'||state.playScreen==='daily-blind'?'blind':'top10';
    }
    try{sessionStorage.setItem(PRIMARY_RESTORE_KEY,JSON.stringify(primary));}catch(_error){}
  }

  function activateView(view){
    const target=view||'men';
    document.querySelectorAll('.tab').forEach(tab=>tab.classList.toggle('active',tab.dataset.view===target));
    document.querySelectorAll('.view').forEach(panel=>panel.classList.toggle('active-view',panel.id===target));
  }

  async function restorePlayScreen(screen){
    const hub=window.UFC_PLAY_HUB;
    if(!hub)return false;
    const target=screen||'hub';
    if(target==='hub'){
      hub.showHub?.();
      return true;
    }
    if(target==='daily-blind'){
      await hub.openGame?.('blind',{daily:true});
      return true;
    }
    if(target==='daily-find-leader'){
      await hub.openDailyChallenge?.();
      return true;
    }
    if(['top10','blind','better-than','find-leader'].includes(target)){
      await hub.openGame?.(target);
      return true;
    }
    const trigger=document.querySelector(`[data-open-game="${target}"]`);
    if(trigger){trigger.click();return true;}
    hub.showHub?.();
    return true;
  }

  async function restoreRefreshLocation(){
    const state=readRefreshLocation();
    if(!state)return false;
    patchPrimaryRestoreState(state);
    activateView(state.activeView);
    if(state.activeView==='play'){
      const restored=await restorePlayScreen(state.playScreen);
      if(!restored)return false;
    }
    const y=Number(state.scrollY)||0;
    window.setTimeout(()=>window.scrollTo({top:y,left:0,behavior:'auto'}),80);
    window.setTimeout(()=>window.scrollTo({top:y,left:0,behavior:'auto'}),320);
    try{sessionStorage.removeItem(REFRESH_LOCATION_KEY);}catch(_error){}
    document.documentElement.setAttribute('data-refresh-location-restored',VERSION);
    return true;
  }

  function scheduleRefreshLocationRestore(){
    const state=readRefreshLocation();
    if(!state)return;
    patchPrimaryRestoreState(state);
    [300,700,1250].forEach(delay=>window.setTimeout(()=>restoreRefreshLocation(),delay));
  }

  function markPettisWhatsNewSeen(){
    try{localStorage.setItem(PETTIS_WHATS_NEW_KEY,'1');}catch(_error){}
  }

  function hasSeenPettisWhatsNew(){
    try{return localStorage.getItem(PETTIS_WHATS_NEW_KEY)==='1';}catch(_error){return false;}
  }

  function updatePettisWhatsNew(){
    const overlay=document.getElementById('whatsNewOverlay');
    if(!overlay)return false;
    const fighters=overlay.querySelector('.whats-new-fighters');
    const heading=fighters?.previousElementSibling;
    if(heading)heading.textContent='Seven more names enter the rankings';
    if(fighters&&!Array.from(fighters.children).some(node=>node.textContent.trim()==='Anthony Pettis')){
      const name=document.createElement('span');
      name.textContent='Anthony Pettis';
      fighters.appendChild(name);
    }
    if(!overlay.dataset.pettisSeenBinding){
      overlay.dataset.pettisSeenBinding='true';
      document.getElementById('whatsNewClose')?.addEventListener('click',markPettisWhatsNewSeen);
      document.getElementById('whatsNewExplore')?.addEventListener('click',markPettisWhatsNewSeen);
      overlay.addEventListener('click',event=>{if(event.target===overlay)markPettisWhatsNewSeen();});
      document.addEventListener('keydown',event=>{
        if(event.key==='Escape'&&!overlay.hidden)markPettisWhatsNewSeen();
      });
    }
    if(!hasSeenPettisWhatsNew())window.UFC_APP_UPDATE_WATCHER?.openWhatsNew?.();
    document.documentElement.setAttribute('data-pettis-whats-new',VERSION);
    return true;
  }

  function schedulePettisWhatsNew(){
    let tries=0;
    const pettisTimer=window.setInterval(()=>{
      tries+=1;
      if(updatePettisWhatsNew()||tries>=30)window.clearInterval(pettisTimer);
    },100);
  }

  function check(){
    attempts+=1;
    if(kickBlindGame()||attempts>=40){
      if(timer)window.clearInterval(timer);
      timer=null;
    }
  }

  window.addEventListener('ufc-production-ranking-ready',check);
  window.addEventListener('ufc-scoring-pipeline-ready',()=>{
    if(window.UFC_SCORING_PIPELINE?.status==='ready')document.documentElement.setAttribute('data-scoring-pipeline','ready');
  });
  window.addEventListener('ufc-play-hub-ready',()=>window.setTimeout(()=>restoreRefreshLocation(),0));
  window.addEventListener('pageshow',()=>window.setTimeout(armRefreshFailSafe,0));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)window.setTimeout(armRefreshFailSafe,0);});

  document.addEventListener('pointerdown',event=>{
    if(event.target.closest?.('#manualRefreshBtn'))captureRefreshLocation();
  },true);

  document.addEventListener('click',event=>{
    if(event.target.closest?.('#manualRefreshBtn'))captureRefreshLocation();
    if(event.target.closest?.('[data-open-game="blind"],[data-play-mode="blind"]'))window.setTimeout(check,80);
  },true);

  document.addEventListener('click',event=>{
    if(!event.target.closest?.('#manualRefreshBtn'))return;
    const state=pendingRefreshLocation||captureRefreshLocation();
    patchPrimaryRestoreState(state);
    window.setTimeout(armRefreshFailSafe,0);
  });

  scheduleRefreshLocationRestore();
  schedulePettisWhatsNew();
  armRefreshFailSafe();
  timer=window.setInterval(check,250);
  window.setTimeout(check,0);
  window.UFC_REFRESH_PROGRESS_FAILSAFE={version:VERSION,arm:armRefreshFailSafe,clear:clearStrandedRefresh};
})();
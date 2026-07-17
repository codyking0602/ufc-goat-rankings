(function(){
  'use strict';

  const VERSION='blind-daily-startup-fix-20260717b-refresh-location';
  const REFRESH_LOCATION_KEY='ufc-goat-manual-refresh-location-v1';
  let attempts=0;
  let timer=null;

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
    return document.querySelector('.tab.active')?.dataset.view||'men';
  }

  function activePlayScreen(){
    return document.documentElement.getAttribute('data-play-screen')||'hub';
  }

  function saveRefreshLocation(){
    const state={
      activeView:activeView(),
      playScreen:activePlayScreen(),
      scrollY:window.scrollY||0
    };
    try{sessionStorage.setItem(REFRESH_LOCATION_KEY,JSON.stringify(state));}catch(_error){}
  }

  function readRefreshLocation(){
    try{return JSON.parse(sessionStorage.getItem(REFRESH_LOCATION_KEY)||'null');}
    catch(_error){return null;}
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
    if(['top10','blind','better-than','find-leader'].includes(target)){
      await hub.openGame?.(target);
      return true;
    }
    hub.showHub?.();
    return true;
  }

  async function restoreRefreshLocation(){
    const state=readRefreshLocation();
    if(!state)return false;
    activateView(state.activeView);
    if(state.activeView==='play')await restorePlayScreen(state.playScreen);
    window.setTimeout(()=>window.scrollTo({top:Number(state.scrollY)||0,left:0,behavior:'auto'}),80);
    try{sessionStorage.removeItem(REFRESH_LOCATION_KEY);}catch(_error){}
    document.documentElement.setAttribute('data-refresh-location-restored',VERSION);
    return true;
  }

  function scheduleRefreshLocationRestore(){
    if(!readRefreshLocation())return;
    window.setTimeout(()=>restoreRefreshLocation(),340);
    window.setTimeout(()=>restoreRefreshLocation(),850);
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
  document.addEventListener('click',event=>{
    if(event.target.closest?.('#manualRefreshBtn'))saveRefreshLocation();
    if(event.target.closest?.('[data-open-game="blind"],[data-play-mode="blind"]'))window.setTimeout(check,80);
  },true);

  scheduleRefreshLocationRestore();
  timer=window.setInterval(check,250);
  window.setTimeout(check,0);
})();

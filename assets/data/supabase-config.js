// Public browser credentials only. Never place a Supabase service-role key here.
window.UFC_SUPABASE_CONFIG = {
  url: 'https://hdkjwezaswhisxupxydc.supabase.co',
  anonKey: 'sb_publishable_thQI0qVmK_zOMjlmSiITww_MgWO-RNi'
};

// Play challenge links must never inherit or lose to a remembered Picks route.
// This runs before the Picks routing scripts and before the generic challenge handler.
(function(){
  'use strict';

  const VERSION='play-challenge-route-20260715c-picks-lockout';
  const PICKS_KEYS=['group','room','event','archive'];
  const LEGACY_PLAY_KEYS=['game','kcpack','kclineup','kcchoices','kcv','brpack','brlineup'];
  const PICKS_AUTO_RESTORE_KEY='ufc-picks:auto-restore-disabled';

  function replaceUrl(url){
    window.history.replaceState(window.history.state,'',`${url.pathname}${url.search}${url.hash}`);
  }

  function stripPicksRouteForShare(){
    const url=new URL(window.location.href);
    let changed=false;
    PICKS_KEYS.forEach(key=>{
      if(url.searchParams.has(key)){
        url.searchParams.delete(key);
        changed=true;
      }
    });
    if(changed){
      url.hash='play';
      replaceUrl(url);
    }
  }

  // Registered before play-shared-system.js, so newly created links start from a clean Play URL.
  document.addEventListener('click',event=>{
    if(event.target.closest?.('[data-br-challenge],[data-kc-challenge],[data-five-round-share]')){
      stripPicksRouteForShare();
    }
  },true);

  const url=new URL(window.location.href);
  const queryCode=String(url.searchParams.get('challenge')||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10);
  const hashMatch=String(url.hash||'').match(/(?:^#|[&#])challenge=([A-Z0-9]{4,10})/i);
  const code=queryCode||String(hashMatch?.[1]||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10);
  if(!code)return;

  [...PICKS_KEYS,...LEGACY_PLAY_KEYS].forEach(key=>url.searchParams.delete(key));
  url.searchParams.set('challenge',code);
  url.hash='play';
  replaceUrl(url);
  document.documentElement.setAttribute('data-play-challenge-route',VERSION);

  // Existing Picks users often have an active room saved locally. Suppress that automatic
  // restore while the incoming challenge is opening; an explicit Picks-tab click re-enables it.
  try{localStorage.setItem(PICKS_AUTO_RESTORE_KEY,'1');}catch(_error){}

  let attempts=0;
  let timer=null;

  function stopGuard(){
    if(timer)window.clearInterval(timer);
    timer=null;
  }

  function keepPlaySelected(){
    attempts+=1;
    const playTab=document.querySelector('.tab[data-view="play"]');
    if(playTab&&!playTab.classList.contains('active'))playTab.click();
    if(attempts>=75)stopGuard();
  }

  document.addEventListener('click',event=>{
    if(!event.target.closest?.('.tab[data-view="picks"]'))return;
    stopGuard();
    try{localStorage.removeItem(PICKS_AUTO_RESTORE_KEY);}catch(_error){}
  },true);

  keepPlaySelected();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',keepPlaySelected,{once:true});
  timer=window.setInterval(keepPlaySelected,120);
  window.addEventListener('ufc-play-shared-ready',keepPlaySelected);
  window.addEventListener('ufc-play-adapter-ready',keepPlaySelected);
})();

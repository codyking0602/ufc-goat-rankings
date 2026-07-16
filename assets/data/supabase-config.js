// Public browser credentials only. Never place a Supabase service-role key here.
window.UFC_SUPABASE_CONFIG = {
  url: 'https://hdkjwezaswhisxupxydc.supabase.co',
  anonKey: 'sb_publishable_thQI0qVmK_zOMjlmSiITww_MgWO-RNi'
};

// Keep shared Play challenges from inheriting a remembered Picks route.
// This runs before Picks and Play scripts, but only selects Play when needed—
// never on a repeating timer that can fight the game renderer.
(function(){
  'use strict';

  const VERSION='play-challenge-route-20260715d-stable-once';
  const PICKS_KEYS=['group','room','event','archive'];
  const LEGACY_PLAY_KEYS=['game','kcpack','kclineup','kcchoices','kcv','brpack','brlineup'];
  const PICKS_AUTO_RESTORE_KEY='ufc-picks:auto-restore-disabled';
  const MANUAL_RESTORE_KEY='ufc-goat-manual-refresh-v1';

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

  // Registered before play-shared-system.js so newly created links start clean.
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

  window.__UFC_PLAY_CHALLENGE_ROUTE_ACTIVE=true;
  document.documentElement.setAttribute('data-play-challenge-route',VERSION);
  try{
    localStorage.setItem(PICKS_AUTO_RESTORE_KEY,'1');
    sessionStorage.removeItem(MANUAL_RESTORE_KEY);
  }catch(_error){}

  function selectPlayOnce(){
    if(!window.__UFC_PLAY_CHALLENGE_ROUTE_ACTIVE)return;
    const playTab=document.querySelector('.tab[data-view="play"]');
    if(playTab&&!playTab.classList.contains('active'))playTab.click();
  }

  // One startup selection, plus readiness checks that are no-ops once Play is active.
  selectPlayOnce();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',selectPlayOnce,{once:true});
  else window.setTimeout(selectPlayOnce,0);
  window.addEventListener('ufc-play-shared-ready',selectPlayOnce,{once:true});
  window.addEventListener('ufc-play-adapter-ready',selectPlayOnce,{once:true});

  document.addEventListener('click',event=>{
    if(!event.target.closest?.('.tab[data-view="picks"]'))return;
    window.__UFC_PLAY_CHALLENGE_ROUTE_ACTIVE=false;
    try{localStorage.removeItem(PICKS_AUTO_RESTORE_KEY);}catch(_error){}
  },true);
})();
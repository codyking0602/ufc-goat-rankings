// Public browser credentials only. Never place a Supabase service-role key here.
window.UFC_SUPABASE_CONFIG = {
  url: 'https://hdkjwezaswhisxupxydc.supabase.co',
  anonKey: 'sb_publishable_thQI0qVmK_zOMjlmSiITww_MgWO-RNi'
};

// A shared Play challenge must outrank any remembered Picks room on startup.
// This runs before the Picks routing scripts, removes stale Picks URL state,
// and keeps the Play tab selected until the challenge adapter opens the game.
(function(){
  'use strict';

  const VERSION='play-challenge-route-20260715a';
  const url=new URL(window.location.href);
  const queryCode=String(url.searchParams.get('challenge')||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10);
  const hashMatch=String(url.hash||'').match(/(?:^#|[&#])challenge=([A-Z0-9]{4,10})/i);
  const code=queryCode||String(hashMatch?.[1]||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10);
  if(!code)return;

  [
    'group','room','event','archive',
    'game','kcpack','kclineup','kcchoices','kcv','brpack','brlineup'
  ].forEach(key=>url.searchParams.delete(key));
  url.searchParams.set('challenge',code);
  url.hash='play';
  window.history.replaceState(window.history.state,'',`${url.pathname}${url.search}${url.hash}`);
  document.documentElement.setAttribute('data-play-challenge-route',VERSION);

  let attempts=0;
  let timer=null;

  function challengeGameIsOpen(){
    const screen=document.documentElement.getAttribute('data-play-screen')||'';
    return Boolean(
      document.getElementById('playChallengeBanner') ||
      (screen && !['hub','picks','top10','blind','daily-blind'].includes(screen))
    );
  }

  function keepPlaySelected(){
    attempts+=1;
    const playTab=document.querySelector('.tab[data-view="play"]');
    if(playTab&&!playTab.classList.contains('active'))playTab.click();
    if(challengeGameIsOpen()||attempts>=50){
      if(timer)window.clearInterval(timer);
      timer=null;
    }
  }

  keepPlaySelected();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',keepPlaySelected,{once:true});
  timer=window.setInterval(keepPlaySelected,120);
  window.addEventListener('ufc-play-shared-ready',keepPlaySelected);
  window.addEventListener('ufc-play-adapter-ready',keepPlaySelected);
})();

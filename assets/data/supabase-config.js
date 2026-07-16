// Public browser credentials only. Never place a Supabase service-role key here.
window.UFC_SUPABASE_CONFIG = {
  url: 'https://hdkjwezaswhisxupxydc.supabase.co',
  anonKey: 'sb_publishable_thQI0qVmK_zOMjlmSiITww_MgWO-RNi'
};

// Incoming Play challenges should outrank remembered Picks navigation without
// repeatedly clicking tabs or observing/re-writing the page. The game adapter
// performs the one real Play-tab activation when its saved setup is ready.
(function(){
  'use strict';

  const VERSION='play-challenge-route-20260715f-trusted-click-guard';
  const url=new URL(window.location.href);
  const queryCode=String(url.searchParams.get('challenge')||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10);
  const hashMatch=String(url.hash||'').match(/(?:^#|[&#])challenge=([A-Z0-9]{4,10})/i);
  const code=queryCode||String(hashMatch?.[1]||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10);
  if(!code)return;

  ['group','room','event','archive','game','kcpack','kclineup','kcchoices','kcv','brpack','brlineup','__manual_refresh','__shell']
    .forEach(key=>url.searchParams.delete(key));
  url.searchParams.set('challenge',code);
  url.hash='play';
  window.history.replaceState(window.history.state,'',`${url.pathname}${url.search}${url.hash}`);

  window.__UFC_PLAY_CHALLENGE_ROUTE_ACTIVE=true;
  document.documentElement.setAttribute('data-play-challenge-route',VERSION);

  // Picks restoration scripts use programmatic .click() calls. Block only those
  // synthetic Picks clicks while the challenge is opening. A real user tap is
  // always allowed and releases the guard.
  document.addEventListener('click',event=>{
    const picksTab=event.target.closest?.('.tab[data-view="picks"]');
    if(!picksTab||!window.__UFC_PLAY_CHALLENGE_ROUTE_ACTIVE)return;
    if(event.isTrusted){
      window.__UFC_PLAY_CHALLENGE_ROUTE_ACTIVE=false;
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
  },true);

  // Select Play once when the shell exists. No interval, retry loop, or repeated
  // readiness-event clicks. The adapter will select it again only when opening the game.
  const selectPlayOnce=()=>{
    if(!window.__UFC_PLAY_CHALLENGE_ROUTE_ACTIVE)return;
    const playTab=document.querySelector('.tab[data-view="play"]');
    if(playTab&&!playTab.classList.contains('active'))playTab.click();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',selectPlayOnce,{once:true});
  else selectPlayOnce();
})();

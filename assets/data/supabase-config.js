// Public browser credentials only. Never place a Supabase service-role key here.
window.UFC_SUPABASE_CONFIG = {
  url: 'https://hdkjwezaswhisxupxydc.supabase.co',
  anonKey: ['sb_publishable_','thQI0qVmK_zOMjlmSiITww_MgWO-RNi'].join('')
};

// Incoming challenge links only clean stale Picks and refresh routing here.
// The game adapter opens Play once after identity and fighter data are ready.
(function(){
  'use strict';

  const VERSION='play-challenge-route-20260715k-clean-handoff';
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

  try{
    [
      'ufc-goat-manual-refresh-v1',
      'ufc-goat-manual-refresh-progress-v1',
      'ufc-goat-update-restore-v1',
      'ufc-goat-update-target-v1'
    ].forEach(key=>sessionStorage.removeItem(key));
  }catch(_error){}

  window.__UFC_PLAY_CHALLENGE_ROUTE_ACTIVE=true;
  document.documentElement.setAttribute('data-play-challenge-route',VERSION);

  // Block only remembered Picks code from stealing the route while the challenge loads.
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
})();
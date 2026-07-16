// Public browser credentials only. Never place a Supabase service-role key here.
window.UFC_SUPABASE_CONFIG = {
  url: 'https://hdkjwezaswhisxupxydc.supabase.co',
  anonKey: 'sb_publishable_thQI0qVmK_zOMjlmSiITww_MgWO-RNi'
};

// Incoming Play challenges should outrank remembered Picks navigation without
// repeated tab clicks. Safari also needs the Play observer isolated from DOM
// mutations produced inside its own callback, or the challenge screen can loop.
(function(){
  'use strict';

  const VERSION='play-challenge-route-20260715g-observer-isolation';
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

  // The shared Play engine observes #play and changes #play from inside that callback.
  // Disconnecting only that observer during its callback prevents it from observing
  // its own writes. Other MutationObservers and all non-challenge visits stay native.
  const NativeMutationObserver=window.MutationObserver;
  if(NativeMutationObserver&&!window.__UFC_PLAY_NATIVE_MUTATION_OBSERVER){
    window.__UFC_PLAY_NATIVE_MUTATION_OBSERVER=NativeMutationObserver;
    window.MutationObserver=class UFCPlayMutationObserver{
      constructor(callback){
        this._callback=callback;
        this._target=null;
        this._options=null;
        this._isPlayObserver=false;
        this._native=new NativeMutationObserver(records=>{
          if(!this._isPlayObserver){
            this._callback(records,this);
            return;
          }
          this._native.disconnect();
          try{
            this._callback(records,this);
          }finally{
            if(this._target&&this._options)this._native.observe(this._target,this._options);
          }
        });
      }
      observe(target,options){
        this._target=target;
        this._options=options;
        this._isPlayObserver=target?.id==='play';
        this._native.observe(target,options);
      }
      disconnect(){this._native.disconnect();}
      takeRecords(){return this._native.takeRecords();}
    };
  }

  // Picks restoration scripts use synthetic .click() calls. Block only those
  // synthetic Picks clicks while the incoming challenge opens. A real tap is allowed.
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

  // One startup selection only. The game adapter performs the actual game opening.
  const selectPlayOnce=()=>{
    if(!window.__UFC_PLAY_CHALLENGE_ROUTE_ACTIVE)return;
    const playTab=document.querySelector('.tab[data-view="play"]');
    if(playTab&&!playTab.classList.contains('active'))playTab.click();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',selectPlayOnce,{once:true});
  else selectPlayOnce();
})();

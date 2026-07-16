// Public browser credentials only. Never place a Supabase service-role key here.
window.UFC_SUPABASE_CONFIG = {
  url: 'https://hdkjwezaswhisxupxydc.supabase.co',
  anonKey: ['sb_publishable_','thQI0qVmK_zOMjlmSiITww_MgWO-RNi'].join('')
};

// Incoming Play challenges must outrank remembered navigation and must not let
// the shared Play observer observe DOM writes scheduled by its own callback.
(function(){
  'use strict';

  const VERSION='play-challenge-route-20260715i-frame-isolation';
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

  // Do not let the manual-refresh restore state put P4P back over the challenge.
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

  // play-shared-system observes #play and schedules its actual DOM writes in the
  // following animation frame. Keep that observer disconnected through that frame,
  // then reconnect after its writes finish. This stops Safari's mutation loop.
  const NativeMutationObserver=window.MutationObserver;
  if(NativeMutationObserver&&!window.__UFC_PLAY_NATIVE_MUTATION_OBSERVER){
    window.__UFC_PLAY_NATIVE_MUTATION_OBSERVER=NativeMutationObserver;
    window.MutationObserver=class UFCPlayMutationObserver{
      constructor(callback){
        this._callback=callback;
        this._target=null;
        this._options=null;
        this._isPlayObserver=false;
        this._manuallyDisconnected=false;
        this._scheduledFrame=0;
        this._records=[];
        this._native=new NativeMutationObserver(records=>{
          if(!this._isPlayObserver){
            this._callback(records,this);
            return;
          }
          this._records.push(...records);
          if(this._scheduledFrame)return;
          this._scheduledFrame=requestAnimationFrame(()=>{
            this._scheduledFrame=0;
            const batch=this._records.splice(0);
            this._native.disconnect();
            this._callback(batch,this);
            requestAnimationFrame(()=>{
              if(this._target&&this._options&&!this._manuallyDisconnected){
                this._native.observe(this._target,this._options);
              }
            });
          });
        });
      }
      observe(target,options){
        this._target=target;
        this._options=options;
        this._isPlayObserver=target?.id==='play';
        this._manuallyDisconnected=false;
        this._native.observe(target,options);
      }
      disconnect(){
        this._manuallyDisconnected=true;
        this._records=[];
        if(this._scheduledFrame)cancelAnimationFrame(this._scheduledFrame);
        this._scheduledFrame=0;
        this._native.disconnect();
      }
      takeRecords(){return this._native.takeRecords();}
    };
  }

  // Block only programmatic Picks restoration while the challenge opens.
  // A real user tap remains available and releases the route guard.
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

  const selectPlayOnce=()=>{
    if(!window.__UFC_PLAY_CHALLENGE_ROUTE_ACTIVE)return;
    const playTab=document.querySelector('.tab[data-view="play"]');
    if(playTab&&!playTab.classList.contains('active'))playTab.click();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',selectPlayOnce,{once:true});
  else selectPlayOnce();
})();
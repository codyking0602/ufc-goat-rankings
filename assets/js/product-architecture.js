(function(){
  'use strict';

  const VERSION='product-architecture-20260718q-picks-cohesion';
  const SHELL_SRC='assets/js/octagon-hq-shell.js?v=app-shell-20260718d-rankings-static';
  const CONNECTIVITY_SRC='assets/js/product-connectivity.js?v=product-connectivity-20260718c-clean-handoffs';
  const POLISH_CSS='assets/css/product-polish.css?v=product-polish-20260718c-header-final';
  const POLISH_SRC='assets/js/product-polish.js?v=product-polish-20260718c-header-final';
  const AVATAR_SYNC_SRC='assets/js/profile-avatar-sync.js?v=profile-avatar-sync-20260718c-home-war-room';
  const ACTIVITY_SRC='assets/js/profile-activity.js?v=profile-activity-20260718a-phase-2a';
  const FIND_LEADER_RETENTION_SRC='assets/js/find-leader-retention.js?v=find-leader-retention-20260718c-phase-2b-lazy';
  const PICKS_SEASON_SRC='assets/js/picks-season-loop.js?v=picks-season-loop-20260718d-canonical-ui';

  function shell(){
    return window.UFC_APP_SHELL||null;
  }

  function loadScriptOnce(match,src){
    if(document.querySelector(`script[src*="${match}"]`))return;
    const script=document.createElement('script');
    script.src=src;
    script.async=false;
    document.head.appendChild(script);
  }

  function loadStyleOnce(match,href){
    if(document.querySelector(`link[href*="${match}"]`))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href=href;
    document.head.appendChild(link);
  }

  function loadShell(){
    if(!shell())loadScriptOnce('assets/js/octagon-hq-shell.js',SHELL_SRC);
  }

  function loadConnectivity(){
    if(!window.UFC_PRODUCT_CONNECTIVITY){
      loadScriptOnce('assets/js/product-connectivity.js',CONNECTIVITY_SRC);
    }
  }

  function loadPolish(){
    loadStyleOnce('assets/css/product-polish.css',POLISH_CSS);
    if(!window.UFC_PRODUCT_POLISH){
      loadScriptOnce('assets/js/product-polish.js',POLISH_SRC);
    }
  }

  function loadAvatarSync(){
    if(!window.UFC_PROFILE_AVATAR_SYNC){
      loadScriptOnce('assets/js/profile-avatar-sync.js',AVATAR_SYNC_SRC);
    }
  }

  function loadActivityProfile(){
    if(!window.UFC_PROFILE_ACTIVITY){
      loadScriptOnce('assets/js/profile-activity.js',ACTIVITY_SRC);
    }
  }

  function loadFindLeaderRetention(){
    if(!window.UFC_FIND_LEADER_RETENTION){
      loadScriptOnce('assets/js/find-leader-retention.js',FIND_LEADER_RETENTION_SRC);
    }
  }

  function loadPicksSeason(){
    if(!window.UFC_PICKS_SEASON_LOOP){
      loadScriptOnce('assets/js/picks-season-loop.js',PICKS_SEASON_SRC);
    }
  }

  function call(method,...args){
    const api=shell();
    if(api?.[method])return api[method](...args);
    loadShell();
    return false;
  }

  const facade={
    version:VERSION,
    compatibilityOnly:true,
    apply:()=>call('start'),
    activateView:(view,options)=>call('activateView',view,options),
    activateDestination:key=>call('activateDestination',key),
    schedulePlaySupport:()=>call('loadPlaySupport')
  };

  if(shell())window.UFC_PRODUCT_ARCHITECTURE=shell();
  else{
    window.UFC_PRODUCT_ARCHITECTURE=facade;
    loadShell();
  }

  loadConnectivity();
  loadPolish();
  loadAvatarSync();
  loadActivityProfile();
  loadFindLeaderRetention();
  loadPicksSeason();

  document.documentElement.setAttribute('data-product-architecture',VERSION);
})();
(function(){
  'use strict';

  if(window.__UFC_PRODUCT_ARCHITECTURE_STARTED__)return;
  window.__UFC_PRODUCT_ARCHITECTURE_STARTED__=true;

  const VERSION='product-architecture-20260720a-shell-recovery-queue';
  const SHELL_SRC='assets/js/octagon-hq-shell.js?v=app-shell-20260720a-recovery-handoff';
  const CONNECTIVITY_SRC='assets/js/product-connectivity.js?v=product-connectivity-20260718c-clean-handoffs';
  const POLISH_CSS='assets/css/product-polish.css?v=product-polish-20260718c-header-final';
  const POLISH_SRC='assets/js/product-polish.js?v=product-polish-20260718c-header-final';
  const AVATAR_SYNC_SRC='assets/js/profile-avatar-sync.js?v=profile-avatar-sync-20260718c-home-war-room';
  const ACTIVITY_SRC='assets/js/profile-activity.js?v=profile-activity-20260718a-phase-2a';
  const FIND_LEADER_RETENTION_SRC='assets/js/find-leader-retention.js?v=find-leader-retention-20260718c-phase-2b-lazy';
  const PICKS_SEASON_SRC='assets/js/picks-season-loop.js?v=picks-season-loop-20260718d-canonical-ui';
  const CANONICAL_CODE='GOAT26';
  const GROUP_TOKEN_KEY=`ufc-picks:group:${CANONICAL_CODE}`;
  const ACTIVE_GROUP_KEY='ufc-player:group-code';
  const PENDING_NAVIGATION_KEY='__UFC_PENDING_SHELL_NAVIGATION__';

  let recoveryEventsBound=false;
  let recoveryScript=null;

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

  function releaseRecoveryNavigation(){
    if(!recoveryEventsBound)return;
    recoveryEventsBound=false;
    document.removeEventListener('click',captureRecoveryNavigation,true);
  }

  function publishRecoveredShell(){
    const api=shell();
    if(!api)return false;
    releaseRecoveryNavigation();
    window.UFC_PRODUCT_ARCHITECTURE=api;
    return true;
  }

  function bindRecoveryNavigation(){
    if(recoveryEventsBound||shell())return;
    recoveryEventsBound=true;
    document.addEventListener('click',captureRecoveryNavigation,true);
  }

  function loadShell(){
    if(publishRecoveredShell())return true;
    bindRecoveryNavigation();
    if(recoveryScript?.isConnected||document.querySelector('script[data-product-architecture-shell-recovery="true"]'))return false;
    const script=document.createElement('script');
    script.src=SHELL_SRC;
    script.async=false;
    script.dataset.productArchitectureShellRecovery='true';
    script.addEventListener('load',()=>{
      recoveryScript=null;
      if(!publishRecoveredShell())script.remove();
    },{once:true});
    script.addEventListener('error',()=>{
      recoveryScript=null;
      script.remove();
    },{once:true});
    recoveryScript=script;
    document.head.appendChild(script);
    return false;
  }

  function queueNavigation(method,...args){
    window[PENDING_NAVIGATION_KEY]={method,args};
    loadShell();
    return false;
  }

  function captureRecoveryNavigation(event){
    if(shell()){
      releaseRecoveryNavigation();
      return;
    }
    const destination=event.target.closest?.('nav.tabs [data-destination]');
    if(destination){
      event.preventDefault();
      event.stopImmediatePropagation();
      if(destination.disabled||destination.getAttribute('aria-disabled')==='true')return;
      const key=String(destination.dataset.destination||'').trim();
      if(key)queueNavigation('activateDestination',key);
      return;
    }
    const ranking=event.target.closest?.('[data-rankings-subnav] [data-ranking-view]');
    if(ranking){
      event.preventDefault();
      event.stopImmediatePropagation();
      const view=String(ranking.dataset.rankingView||'').trim();
      if(view)queueNavigation('activateView',view);
    }
  }

  function loadConnectivity(){
    if(!window.UFC_PRODUCT_CONNECTIVITY)loadScriptOnce('assets/js/product-connectivity.js',CONNECTIVITY_SRC);
  }

  function loadPolish(){
    loadStyleOnce('assets/css/product-polish.css',POLISH_CSS);
    if(!window.UFC_PRODUCT_POLISH)loadScriptOnce('assets/js/product-polish.js',POLISH_SRC);
  }

  function loadAvatarSync(){
    if(!window.UFC_PROFILE_AVATAR_SYNC)loadScriptOnce('assets/js/profile-avatar-sync.js',AVATAR_SYNC_SRC);
  }

  function loadActivityProfile(){
    if(!window.UFC_PROFILE_ACTIVITY)loadScriptOnce('assets/js/profile-activity.js',ACTIVITY_SRC);
  }

  function loadFindLeaderRetention(){
    if(!window.UFC_FIND_LEADER_RETENTION)loadScriptOnce('assets/js/find-leader-retention.js',FIND_LEADER_RETENTION_SRC);
  }

  function loadPicksSeason(){
    if(!window.UFC_PICKS_SEASON_LOOP)loadScriptOnce('assets/js/picks-season-loop.js',PICKS_SEASON_SRC);
  }

  function identityFrom(value){
    return value?.identity||value||window.UFC_PLAY_PROFILE?.identity||window.UFC_APP_PROFILE?.identity||null;
  }

  function identityToken(identity){
    return String(identity?.memberToken||identity?.member_token||'').trim();
  }

  function installSharedProfileStyle(){
    if(document.getElementById('sharedProfileAuthCss'))return;
    const style=document.createElement('style');
    style.id='sharedProfileAuthCss';
    style.textContent='html[data-shared-profile-auth="true"] #picksPinSignInCard{display:none!important}';
    document.head.appendChild(style);
  }

  function suppressDuplicatePicksSignIn(){
    installSharedProfileStyle();
    document.documentElement.dataset.sharedProfileAuth='true';
    const hide=()=>{
      const card=document.getElementById('picksPinSignInCard');
      if(!card)return;
      card.hidden=true;
      card.dataset.sharedProfileSuppressed='true';
    };
    hide();
    queueMicrotask(hide);
    window.setTimeout(hide,160);
    window.setTimeout(hide,500);
    window.setTimeout(()=>document.getElementById('picksPinSignInCard')?.remove(),520);
  }

  function syncSharedProfileToPicks(value){
    const identity=identityFrom(value);
    const token=identityToken(identity);
    if(!token)return false;
    try{
      localStorage.setItem(GROUP_TOKEN_KEY,token);
      localStorage.setItem(ACTIVE_GROUP_KEY,CANONICAL_CODE);
      if(identity?.member?.display_name)localStorage.setItem('ufc-picks:display-name',String(identity.member.display_name));
    }catch(_error){}
    suppressDuplicatePicksSignIn();
    if(document.getElementById('picks')?.classList.contains('active-view')||location.hash==='#picks'){
      const url=new URL(location.href);
      if(!url.searchParams.get('group')){
        url.searchParams.set('group',CANONICAL_CODE);
        history.replaceState(history.state,'',`${url.pathname}${url.search}${url.hash||'#picks'}`);
      }
    }
    window.UFCPicksPinAuth?.refresh?.();
    return true;
  }

  function bindSharedProfileAuth(){
    window.addEventListener('ufc-play-profile-ready',event=>syncSharedProfileToPicks(event.detail));
    window.addEventListener('ufc-app-profile-updated',event=>syncSharedProfileToPicks(event.detail));
    window.addEventListener('octagon-hq:view-change',event=>{
      if(event.detail?.destination==='picks')syncSharedProfileToPicks();
    });
    window.UFC_PLAY_PROFILE?.resolve?.().then(syncSharedProfileToPicks).catch(()=>null);
  }

  function call(method,...args){
    const api=shell();
    if(api?.[method])return api[method](...args);
    loadShell();
    return false;
  }

  function callNavigation(method,...args){
    const api=shell();
    if(api?.[method])return api[method](...args);
    return queueNavigation(method,...args);
  }

  const facade={
    version:VERSION,
    compatibilityOnly:true,
    apply:()=>call('start'),
    activateView:(view,options)=>callNavigation('activateView',view,options),
    activateDestination:key=>callNavigation('activateDestination',key),
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
  bindSharedProfileAuth();

  // native-app-shell.js and app-notification-surface-fix.js are explicit,
  // ordered index.html dependencies. They must never be injected here too.
  document.documentElement.setAttribute('data-product-architecture',VERSION);
})();
(function(){
  'use strict';

  if(window.__UFC_FRESH_HOME_LAUNCH_STARTED__)return;
  window.__UFC_FRESH_HOME_LAUNCH_STARTED__=true;

  const VERSION='fresh-home-launch-20260719e-single-startup-route';
  const RESUME_PICKS_KEY='__picks_resume';
  const RESUME_WINDOW_MS=30000;
  const deepLinkKeys=['challenge','share','fighter','message','notification','push'];
  const picksRouteKeys=['group','room','event','picksView','archive'];
  const staleKeys=['group','room','event','picksView','archive','week','open','game',RESUME_PICKS_KEY];
  const navigationType=performance.getEntriesByType?.('navigation')?.[0]?.type||'navigate';
  const standalone=window.navigator.standalone===true
    ||window.matchMedia?.('(display-mode: standalone)')?.matches===true;
  let resumeMarkerTimer=0;

  function currentUrl(){return new URL(location.href);}
  function hasExplicitDeepLink(url=currentUrl()){
    return deepLinkKeys.some(key=>url.searchParams.has(key));
  }
  function hasPicksRoute(url=currentUrl()){
    return String(url.hash||'').toLowerCase()==='#picks'
      ||picksRouteKeys.some(key=>url.searchParams.has(key));
  }
  function isBarePicksInvite(url=currentUrl()){
    const group=String(url.searchParams.get('group')||'').trim();
    const room=String(url.searchParams.get('room')||'').trim();
    return Boolean(group||room)
      &&!url.searchParams.has('event')
      &&!url.searchParams.has('picksView')
      &&!url.searchParams.has('archive');
  }
  function resumeTimestamp(url=currentUrl()){
    return Number(url.searchParams.get(RESUME_PICKS_KEY)||0);
  }
  function hasFreshPicksResume(url=currentUrl()){
    const markedAt=resumeTimestamp(url);
    return markedAt>0&&Date.now()-markedAt<RESUME_WINDOW_MS;
  }
  function replaceUrl(url){
    history.replaceState(history.state,'',`${url.pathname}${url.search}${url.hash}`);
  }
  function clearResumeMarker(){
    window.clearTimeout(resumeMarkerTimer);
    const url=currentUrl();
    if(!url.searchParams.has(RESUME_PICKS_KEY))return;
    url.searchParams.delete(RESUME_PICKS_KEY);
    replaceUrl(url);
  }
  function markPicksResume(){
    const url=currentUrl();
    url.searchParams.set(RESUME_PICKS_KEY,String(Date.now()));
    replaceUrl(url);
    window.clearTimeout(resumeMarkerTimer);
    resumeMarkerTimer=window.setTimeout(clearResumeMarker,RESUME_WINDOW_MS);
  }
  function activatePicks(source='startup'){
    const url=currentUrl();
    url.searchParams.delete(RESUME_PICKS_KEY);
    url.hash='picks';
    replaceUrl(url);
    window.UFC_APP_SHELL?.activateDestination?.('picks')
      ||window.UFC_PRODUCT_ARCHITECTURE?.activateDestination?.('picks');
    document.documentElement.dataset.freshLaunchRoute='picks';
    document.documentElement.dataset.freshLaunchSource=source;
    return true;
  }
  function activateHome(source='startup'){
    const url=currentUrl();
    staleKeys.forEach(key=>url.searchParams.delete(key));
    url.hash='home';
    replaceUrl(url);
    window.UFC_APP_SHELL?.activateDestination?.('home')
      ||window.UFC_PRODUCT_ARCHITECTURE?.activateDestination?.('home');
    document.documentElement.dataset.freshLaunchRoute='home';
    document.documentElement.dataset.freshLaunchSource=source;
    return true;
  }

  const startupUrl=currentUrl();
  const picksRoute=hasPicksRoute(startupUrl);
  const barePicksInvite=isBarePicksInvite(startupUrl);
  const resumePicks=hasFreshPicksResume(startupUrl);
  const preserveBrowserReload=picksRoute&&navigationType==='reload'&&!standalone;
  const picksContinuation=picksRoute&&(resumePicks||barePicksInvite||preserveBrowserReload);
  const explicitDeepLink=hasExplicitDeepLink(startupUrl);

  if(picksContinuation)activatePicks(resumePicks?'one-navigation-picks-resume':barePicksInvite?'picks-invite':'browser-reload');
  else if(!explicitDeepLink)activateHome('startup');

  document.addEventListener('click',event=>{
    const trigger=event.target.closest?.('#picksPinSignInButton,[data-group-room],[data-history-room],#picksGroupAddEvent,#picksRoomAction');
    if(trigger)markPicksResume();
  },true);

  if(!document.getElementById('profileSetupReminderScript')){
    const reminder=document.createElement('script');
    reminder.id='profileSetupReminderScript';
    reminder.src='assets/js/profile-setup-reminder.js?v=profile-setup-reminder-20260719b';
    reminder.async=false;
    document.body.appendChild(reminder);
  }

  const route=picksContinuation?'picks':explicitDeepLink?'deep-link':'home';
  document.documentElement.setAttribute('data-fresh-launch-route',route);
  window.UFC_FRESH_HOME_LAUNCH={
    version:VERSION,
    explicitDeepLink,
    picksRoute,
    picksContinuation,
    barePicksInvite,
    resumePicks,
    navigationType,
    standalone,
    route,
    markPicksResume,
    activateHome,
    activatePicks
  };
})();

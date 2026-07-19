(function(){
  'use strict';

  const VERSION='fresh-home-launch-20260719c-cold-start-home';
  const RESUME_PICKS_KEY='ufc-app:resume-picks-once';
  const RESUME_WINDOW_MS=120000;
  const params=new URLSearchParams(location.search);
  const deepLinkKeys=['challenge','share','fighter','message','notification','push'];
  const picksRouteKeys=['group','room','event','picksView','archive'];
  const staleKeys=['group','room','event','picksView','archive','week','open','game'];
  const picksHash=String(location.hash||'').toLowerCase()==='#picks';
  const picksRoute=picksHash||picksRouteKeys.some(key=>params.has(key));
  const group=String(params.get('group')||'').trim();
  const room=String(params.get('room')||'').trim();
  const barePicksInvite=Boolean(group||room)
    &&!params.has('event')
    &&!params.has('picksView')
    &&!params.has('archive');
  const navigationType=performance.getEntriesByType?.('navigation')?.[0]?.type||'navigate';
  const standalone=window.navigator.standalone===true
    ||window.matchMedia?.('(display-mode: standalone)')?.matches===true;

  function markPicksResume(){
    try{sessionStorage.setItem(RESUME_PICKS_KEY,String(Date.now()));}catch(_error){}
  }

  let resumePicks=false;
  try{
    const markedAt=Number(sessionStorage.getItem(RESUME_PICKS_KEY)||0);
    resumePicks=markedAt>0&&Date.now()-markedAt<RESUME_WINDOW_MS;
    sessionStorage.removeItem(RESUME_PICKS_KEY);
  }catch(_error){}

  const preserveBrowserReload=picksRoute&&navigationType==='reload'&&!standalone;
  const picksContinuation=picksRoute&&(resumePicks||barePicksInvite||preserveBrowserReload);
  const explicitDeepLink=deepLinkKeys.some(key=>params.has(key));

  if(picksContinuation){
    const url=new URL(location.href);
    url.hash='picks';
    history.replaceState(history.state,'',`${url.pathname}${url.search}#picks`);
    window.UFC_APP_SHELL?.activateDestination?.('picks')
      ||window.UFC_PRODUCT_ARCHITECTURE?.activateDestination?.('picks');
    if(barePicksInvite)markPicksResume();
  }else if(!explicitDeepLink){
    const url=new URL(location.href);
    staleKeys.forEach(key=>url.searchParams.delete(key));
    url.hash='home';
    history.replaceState(history.state,'',`${url.pathname}${url.search}#home`);
    window.UFC_APP_SHELL?.activateDestination?.('home')
      ||window.UFC_PRODUCT_ARCHITECTURE?.activateDestination?.('home');
  }

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
    route
  };
})();

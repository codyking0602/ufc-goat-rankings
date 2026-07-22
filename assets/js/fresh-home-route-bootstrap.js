(function(){
  'use strict';

  if(window.__UFC_FRESH_HOME_ROUTE_BOOTSTRAP_STARTED__)return;
  window.__UFC_FRESH_HOME_ROUTE_BOOTSTRAP_STARTED__=true;

  const VERSION='fresh-home-route-bootstrap-20260722j-profile-owned-pin-handoff';
  const UPDATE_OWNER_SRC='assets/js/app-update-watcher.js?v=app-update-watcher-20260722c-early-worker-owner';
  const RESUME_PICKS_KEY='__picks_resume';
  const PIN_RESUME_STORAGE_KEY='__ufc_picks_pin_resume';
  const INVITE_KEY='invite';
  const RESUME_WINDOW_MS=30000;
  const deepLinkKeys=['challenge','share','fighter','message','notification','push'];
  const picksRouteKeys=['group','room','event','picksView','archive'];
  const staleKeys=['group','room','event','picksView','archive','week','open','game',INVITE_KEY,RESUME_PICKS_KEY];

  function publishUpdateOwner(){
    if(window.__UFC_APP_UPDATE_WATCHER_STARTED__||document.querySelector?.('script[src*="assets/js/app-update-watcher.js"]'))return false;
    if(document.readyState==='loading'&&typeof document.write==='function'){
      document.write(`<script src="${UPDATE_OWNER_SRC}"><\/script>`);
      return true;
    }
    const script=document.createElement?.('script');
    if(!script)return false;
    script.src=UPDATE_OWNER_SRC;
    script.async=false;
    (document.head||document.documentElement)?.appendChild?.(script);
    return true;
  }

  publishUpdateOwner();

  const url=new URL(location.href);
  const standalone=window.navigator.standalone===true
    ||window.matchMedia?.('(display-mode: standalone)')?.matches===true;
  const picksRoute=String(url.hash||'').toLowerCase()==='#picks'
    ||picksRouteKeys.some(key=>url.searchParams.has(key));
  const group=String(url.searchParams.get('group')||'').trim();
  const room=String(url.searchParams.get('room')||'').trim();
  const event=String(url.searchParams.get('event')||'').trim();
  const picksView=String(url.searchParams.get('picksView')||'').trim();
  const inviteMarked=url.searchParams.get(INVITE_KEY)==='1'&&Boolean(group||room);
  const markedAt=Number(url.searchParams.get(RESUME_PICKS_KEY)||0);
  let pinResumeAt=0;
  try{
    pinResumeAt=Number(window.sessionStorage?.getItem(PIN_RESUME_STORAGE_KEY)||0);
    if(pinResumeAt)window.sessionStorage?.removeItem(PIN_RESUME_STORAGE_KEY);
  }catch(_error){}
  const pinResumeTarget=Boolean(group&&(
    (picksView==='event'&&room&&event)
    ||(picksView==='home'&&!room)
  ));
  const resumePicks=(markedAt>0&&Date.now()-markedAt<RESUME_WINDOW_MS)
    ||(pinResumeTarget&&pinResumeAt>0&&Date.now()-pinResumeAt<RESUME_WINDOW_MS);
  const explicitDeepLink=deepLinkKeys.some(key=>url.searchParams.has(key));
  const preservePicks=picksRoute&&(resumePicks||inviteMarked);

  if(inviteMarked){
    window.__UFC_FRESH_HOME_PICKS_ENTRY__='invite';
    document.documentElement.dataset.freshHomeBootstrapPicksEntry='invite';
    url.searchParams.delete(INVITE_KEY);
    history.replaceState(history.state,'',`${url.pathname}${url.search}${url.hash}`);
  }else if(resumePicks){
    window.__UFC_FRESH_HOME_PICKS_ENTRY__='resume';
    document.documentElement.dataset.freshHomeBootstrapPicksEntry='resume';
  }else if(!preservePicks&&!explicitDeepLink){
    staleKeys.forEach(key=>url.searchParams.delete(key));
    url.hash='home';
    history.replaceState(history.state,'',`${url.pathname}${url.search}#home`);
  }

  document.documentElement.dataset.freshHomeBootstrap=VERSION;
  document.documentElement.dataset.freshHomeBootstrapRoute=preservePicks?'picks':explicitDeepLink?'deep-link':'home';
  document.documentElement.dataset.freshHomeBootstrapStandalone=String(standalone);
})();
(function(){
  'use strict';

  if(window.__UFC_FRESH_HOME_ROUTE_BOOTSTRAP_STARTED__)return;
  window.__UFC_FRESH_HOME_ROUTE_BOOTSTRAP_STARTED__=true;

  const VERSION='fresh-home-route-bootstrap-20260722g-pin-resume-owner';
  const RESUME_PICKS_KEY='__picks_resume';
  const INVITE_KEY='invite';
  const RESUME_WINDOW_MS=30000;
  const deepLinkKeys=['challenge','share','fighter','message','notification','push'];
  const picksRouteKeys=['group','room','event','picksView','archive'];
  const staleKeys=['group','room','event','picksView','archive','week','open','game',INVITE_KEY,RESUME_PICKS_KEY];
  const url=new URL(location.href);
  const standalone=window.navigator.standalone===true
    ||window.matchMedia?.('(display-mode: standalone)')?.matches===true;
  const picksRoute=String(url.hash||'').toLowerCase()==='#picks'
    ||picksRouteKeys.some(key=>url.searchParams.has(key));
  const group=String(url.searchParams.get('group')||'').trim();
  const room=String(url.searchParams.get('room')||'').trim();
  const inviteMarked=url.searchParams.get(INVITE_KEY)==='1'&&Boolean(group||room);
  const markedAt=Number(url.searchParams.get(RESUME_PICKS_KEY)||0);
  const resumePicks=markedAt>0&&Date.now()-markedAt<RESUME_WINDOW_MS;
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

  document.addEventListener?.('click',event=>{
    if(!event.target.closest?.('#picksPinSignInButton'))return;
    const next=new URL(location.href);
    next.searchParams.delete(INVITE_KEY);
    next.searchParams.set(RESUME_PICKS_KEY,String(Date.now()));
    history.replaceState(history.state,'',`${next.pathname}${next.search}${next.hash}`);
  },true);

  document.documentElement.dataset.freshHomeBootstrap=VERSION;
  document.documentElement.dataset.freshHomeBootstrapRoute=preservePicks?'picks':explicitDeepLink?'deep-link':'home';
  document.documentElement.dataset.freshHomeBootstrapStandalone=String(standalone);
})();
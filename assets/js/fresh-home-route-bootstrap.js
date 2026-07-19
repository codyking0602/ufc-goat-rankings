(function(){
  'use strict';

  const VERSION='fresh-home-route-bootstrap-20260719a';
  const RESUME_PICKS_KEY='__picks_resume';
  const RESUME_WINDOW_MS=30000;
  const deepLinkKeys=['challenge','share','fighter','message','notification','push'];
  const picksRouteKeys=['group','room','event','picksView','archive'];
  const staleKeys=['group','room','event','picksView','archive','week','open','game',RESUME_PICKS_KEY];
  const url=new URL(location.href);
  const navigationType=performance.getEntriesByType?.('navigation')?.[0]?.type||'navigate';
  const standalone=window.navigator.standalone===true
    ||window.matchMedia?.('(display-mode: standalone)')?.matches===true;
  const picksRoute=String(url.hash||'').toLowerCase()==='#picks'
    ||picksRouteKeys.some(key=>url.searchParams.has(key));
  const group=String(url.searchParams.get('group')||'').trim();
  const room=String(url.searchParams.get('room')||'').trim();
  const barePicksInvite=Boolean(group||room)
    &&!url.searchParams.has('event')
    &&!url.searchParams.has('picksView')
    &&!url.searchParams.has('archive');
  const markedAt=Number(url.searchParams.get(RESUME_PICKS_KEY)||0);
  const resumePicks=markedAt>0&&Date.now()-markedAt<RESUME_WINDOW_MS;
  const preserveBrowserReload=picksRoute&&navigationType==='reload'&&!standalone;
  const explicitDeepLink=deepLinkKeys.some(key=>url.searchParams.has(key));
  const preservePicks=picksRoute&&(resumePicks||barePicksInvite||preserveBrowserReload);

  if(!preservePicks&&!explicitDeepLink){
    staleKeys.forEach(key=>url.searchParams.delete(key));
    url.hash='home';
    history.replaceState(history.state,'',`${url.pathname}${url.search}#home`);
  }

  document.documentElement.dataset.freshHomeBootstrap=VERSION;
  document.documentElement.dataset.freshHomeBootstrapRoute=preservePicks?'picks':explicitDeepLink?'deep-link':'home';
})();

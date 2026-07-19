(function(){
  'use strict';

  const VERSION='fresh-home-launch-20260718g-picks-route-safe';
  const params=new URLSearchParams(location.search);
  const deepLinkKeys=['challenge','share','fighter','message','notification','push'];
  const picksRouteKeys=['group','room','event','picksView','archive'];
  const staleKeys=['picksView','event','week','open','room','game'];
  const picksRoute=picksRouteKeys.some(key=>params.has(key));
  const explicitDeepLink=picksRoute||deepLinkKeys.some(key=>params.has(key));

  if(picksRoute){
    window.UFC_APP_SHELL?.activateDestination?.('picks')
      ||window.UFC_PRODUCT_ARCHITECTURE?.activateDestination?.('picks');
  }else if(!explicitDeepLink){
    const url=new URL(location.href);
    staleKeys.forEach(key=>url.searchParams.delete(key));
    url.hash='home';
    history.replaceState(null,'',`${url.pathname}${url.search}#home`);
    window.UFC_APP_SHELL?.activateDestination?.('home')
      ||window.UFC_PRODUCT_ARCHITECTURE?.activateDestination?.('home');
  }

  const route=picksRoute?'picks':explicitDeepLink?'deep-link':'home';
  document.documentElement.setAttribute('data-fresh-launch-route',route);
  window.UFC_FRESH_HOME_LAUNCH={version:VERSION,explicitDeepLink,picksRoute,route};
})();

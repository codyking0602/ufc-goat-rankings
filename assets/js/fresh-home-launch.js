(function(){
  'use strict';
  const VERSION='fresh-home-launch-20260718-main-one-shot';
  const params=new URLSearchParams(location.search);
  const deepLinkKeys=['challenge','share','fighter','message','notification','push'];
  const staleKeys=['picksView','event','week','open','room','game'];
  const explicitDeepLink=deepLinkKeys.some(key=>params.has(key));
  if(!explicitDeepLink){
    const url=new URL(location.href);
    staleKeys.forEach(key=>url.searchParams.delete(key));
    url.hash='home';
    history.replaceState(null,'',`${url.pathname}${url.search}#home`);
    window.UFC_APP_SHELL?.activateDestination?.('home')||window.UFC_PRODUCT_ARCHITECTURE?.activateDestination?.('home');
  }
  document.documentElement.setAttribute('data-fresh-launch-route',explicitDeepLink?'deep-link':'home');
  window.UFC_FRESH_HOME_LAUNCH={version:VERSION,explicitDeepLink};
})();
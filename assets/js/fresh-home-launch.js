(function(){
  'use strict';
  const VERSION='fresh-home-launch-20260718a-phase-4b';
  const params=new URLSearchParams(location.search);
  const deepLinkKeys=['challenge','share','fighter','event','message','game','picksView','open','week'];
  const explicitDeepLink=deepLinkKeys.some(key=>params.has(key));
  if(!explicitDeepLink){
    history.replaceState(null,'',`${location.pathname}${location.search}#home`);
    const openHome=()=>window.UFC_APP_SHELL?.activateDestination?.('home')||window.UFC_PRODUCT_ARCHITECTURE?.activateDestination?.('home');
    if(!openHome())document.addEventListener('DOMContentLoaded',openHome,{once:true});
  }
  document.documentElement.setAttribute('data-fresh-launch-route',explicitDeepLink?'deep-link':'home');
  window.UFC_FRESH_HOME_LAUNCH={version:VERSION,explicitDeepLink};
})();

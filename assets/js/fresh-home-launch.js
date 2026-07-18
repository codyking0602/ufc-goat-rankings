(function(){
  'use strict';

  // Compatibility marker for the Phase 4B deployment workflow:
  // fresh-home-launch-20260718a-phase-4b
  const VERSION='fresh-home-launch-20260718d-single-owner';
  const params=new URLSearchParams(location.search);
  const trueDeepLinkKeys=['challenge','share','fighter','message','notification','push'];
  const staleAppStateKeys=['picksView','event','week','open','room','game'];
  const explicitDeepLink=trueDeepLinkKeys.some(key=>params.has(key));

  function loadScoringRepair(){
    const match='picks-scoring-live-repair-20260718b-visible-owner';
    const existing=document.querySelector('script[src*="picks-scoring-live-repair.js"]');
    if(existing?.src.includes(match))return;
    const script=document.createElement('script');
    script.src=`assets/js/picks-scoring-live-repair.js?v=${match}`;
    script.async=true;
    document.head.appendChild(script);
  }

  function normalizeHomeUrl(){
    if(explicitDeepLink)return false;
    const url=new URL(location.href);
    staleAppStateKeys.forEach(key=>url.searchParams.delete(key));
    url.hash='home';
    history.replaceState(null,'',`${url.pathname}${url.search}#home`);
    return true;
  }

  function openHomeOnce(){
    if(explicitDeepLink)return false;
    normalizeHomeUrl();
    const shell=window.UFC_APP_SHELL||window.UFC_PRODUCT_ARCHITECTURE;
    return Boolean(shell?.activateDestination?.('home'));
  }

  loadScoringRepair();
  normalizeHomeUrl();
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',openHomeOnce,{once:true});
  }else{
    queueMicrotask(openHomeOnce);
  }

  document.documentElement.setAttribute('data-fresh-launch-route',explicitDeepLink?'deep-link':'home');
  window.UFC_FRESH_HOME_LAUNCH={version:VERSION,explicitDeepLink,openHome:openHomeOnce};
})();
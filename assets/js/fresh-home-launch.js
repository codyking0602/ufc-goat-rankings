(function(){
  'use strict';

  const VERSION='fresh-home-launch-20260718b-reliable-home';
  const params=new URLSearchParams(location.search);
  const externalDeepLinkKeys=['challenge','share','fighter','message','game','room','notification','push'];
  const staleInternalKeys=['picksView','event','week','open'];
  const explicitDeepLink=externalDeepLinkKeys.some(key=>params.has(key));
  let userInteracted=false;

  function loadScoringRepair(){
    if(document.querySelector('script[src*="picks-scoring-live-repair.js"]')) return;
    const script=document.createElement('script');
    script.src='assets/js/picks-scoring-live-repair.js?v=picks-scoring-live-repair-20260718a';
    script.async=true;
    document.head.appendChild(script);
  }

  function cleanHomeUrl(){
    if(explicitDeepLink) return;
    const url=new URL(location.href);
    staleInternalKeys.forEach(key=>url.searchParams.delete(key));
    url.hash='home';
    history.replaceState(null,'',`${url.pathname}${url.search}#home`);
  }

  function openHome(){
    if(explicitDeepLink||userInteracted) return false;
    cleanHomeUrl();
    const shell=window.UFC_APP_SHELL||window.UFC_PRODUCT_ARCHITECTURE;
    const opened=shell?.activateDestination?.('home');
    if(!opened){
      document.querySelector('nav.tabs [data-destination="home"],nav.tabs [data-view="home"]')?.click();
    }
    return Boolean(opened);
  }

  function scheduleBootHome(){
    [0,60,220,650].forEach(delay=>setTimeout(openHome,delay));
  }

  document.addEventListener('pointerdown',event=>{
    if(event.target.closest?.('button,a,input,select,textarea,[role="button"]')) userInteracted=true;
  },true);

  loadScoringRepair();
  cleanHomeUrl();
  scheduleBootHome();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',scheduleBootHome,{once:true});
  window.addEventListener('pageshow',event=>{
    if(!event.persisted) scheduleBootHome();
  },{once:true});

  document.documentElement.setAttribute('data-fresh-launch-route',explicitDeepLink?'deep-link':'home');
  window.UFC_FRESH_HOME_LAUNCH={version:VERSION,explicitDeepLink,openHome};
})();

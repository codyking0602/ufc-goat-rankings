(function(){
  'use strict';

  // Compatibility marker for the Phase 4B deployment workflow:
  // fresh-home-launch-20260718a-phase-4b
  const VERSION='fresh-home-launch-20260718c-cold-home-owner';
  const params=new URLSearchParams(location.search);
  const trueDeepLinkKeys=['challenge','share','fighter','message','notification','push'];
  const staleAppStateKeys=['picksView','event','week','open','room','game'];
  const explicitDeepLink=trueDeepLinkKeys.some(key=>params.has(key));
  let userInteracted=false;

  function loadScoringRepair(){
    const existing=document.querySelector('script[src*="picks-scoring-live-repair.js"]');
    if(existing){
      if(!existing.src.includes('20260718b-visible-owner')){
        const script=document.createElement('script');
        script.src='assets/js/picks-scoring-live-repair.js?v=picks-scoring-live-repair-20260718b-visible-owner';
        script.async=true;
        document.head.appendChild(script);
      }
      return;
    }
    const script=document.createElement('script');
    script.src='assets/js/picks-scoring-live-repair.js?v=picks-scoring-live-repair-20260718b-visible-owner';
    script.async=true;
    document.head.appendChild(script);
  }

  function cleanHomeUrl(){
    if(explicitDeepLink)return;
    const url=new URL(location.href);
    staleAppStateKeys.forEach(key=>url.searchParams.delete(key));
    url.hash='home';
    history.replaceState(null,'',`${url.pathname}${url.search}#home`);
  }

  function openHome(){
    if(explicitDeepLink||userInteracted)return false;
    cleanHomeUrl();
    const shell=window.UFC_APP_SHELL||window.UFC_PRODUCT_ARCHITECTURE;
    const opened=shell?.activateDestination?.('home');
    if(!opened){
      document.querySelector('nav.tabs [data-destination="home"],nav.tabs [data-view="home"]')?.click();
    }
    return Boolean(opened);
  }

  function scheduleBootHome(){
    [0,40,120,300,700,1300,2200].forEach(delay=>setTimeout(openHome,delay));
  }

  document.addEventListener('pointerdown',event=>{
    if(event.target.closest?.('button,a,input,select,textarea,[role="button"]'))userInteracted=true;
  },true);

  loadScoringRepair();
  cleanHomeUrl();
  scheduleBootHome();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scheduleBootHome,{once:true});
  window.addEventListener('pageshow',scheduleBootHome);

  document.documentElement.setAttribute('data-fresh-launch-route',explicitDeepLink?'deep-link':'home');
  window.UFC_FRESH_HOME_LAUNCH={version:VERSION,explicitDeepLink,openHome};
})();
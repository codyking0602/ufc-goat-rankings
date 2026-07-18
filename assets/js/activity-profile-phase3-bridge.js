(function(){
  'use strict';

  const VERSION='activity-profile-phase3-bridge-20260718a';
  const CACHE_PREFIX='octagon-hq:activity-profile-html-v1:';
  let observer=null;
  let syncTimer=0;

  const text=value=>String(value??'').trim();
  const profileName=()=>text(document.querySelector('.profile-activity-title strong')?.textContent||window.UFC_APP_PROFILE?.identity?.member?.display_name||'profile').toLowerCase();
  const cacheKey=()=>`${CACHE_PREFIX}${profileName()}`;

  function bindCachedActions(root){
    root?.querySelectorAll?.('[data-profile-activity-destination]').forEach(button=>{
      if(button.dataset.phase3BridgeBound===VERSION)return;
      button.dataset.phase3BridgeBound=VERSION;
      button.addEventListener('click',()=>{
        const destination=button.dataset.profileActivityDestination;
        window.UFC_PROFILE_ACTIVITY?.close?.();
        window.UFC_APP_SHELL?.activateDestination?.(destination)||window.UFC_PRODUCT_ARCHITECTURE?.activateDestination?.(destination);
      });
    });
  }

  function saveFinishedProfile(){
    const body=document.querySelector('.profile-activity-body');
    const grid=body?.querySelector('.profile-activity-grid');
    if(!body||!grid||body.querySelector('.profile-activity-loading'))return;
    const clone=body.cloneNode(true);
    clone.querySelectorAll('[data-app-notification-center]').forEach(node=>node.remove());
    try{localStorage.setItem(cacheKey(),clone.innerHTML);}catch(_error){}
  }

  function restoreCachedProfile(){
    const body=document.querySelector('.profile-activity-body');
    if(!body||!body.querySelector('.profile-activity-loading'))return false;
    let cached='';
    try{cached=localStorage.getItem(cacheKey())||'';}catch(_error){}
    if(!cached||!cached.includes('profile-activity-grid'))return false;
    body.innerHTML=cached;
    body.dataset.cachedActivityProfile='true';
    bindCachedActions(body);
    return true;
  }

  function syncNotifications(){
    window.clearTimeout(syncTimer);
    syncTimer=window.setTimeout(()=>{
      const api=window.UFC_APP_NOTIFICATIONS;
      if(!api)return;
      api.render?.();
      if(!api.settings)void api.loadSettings?.();
    },20);
  }

  function sync(){
    restoreCachedProfile();
    saveFinishedProfile();
    bindCachedActions(document.querySelector('.profile-activity-body'));
    syncNotifications();
  }

  function installObserver(){
    if(observer)return;
    observer=new MutationObserver(records=>{
      let relevant=false;
      for(const record of records){
        for(const node of record.addedNodes){
          if(node.nodeType!==1)continue;
          if(node.matches?.('.profile-activity-overlay,.profile-activity-body,.profile-activity-grid,.app-profile-panel,.app-profile-body')||node.querySelector?.('.profile-activity-overlay,.profile-activity-body,.profile-activity-grid,.app-profile-panel,.app-profile-body')){
            relevant=true;
            break;
          }
        }
        if(relevant)break;
      }
      if(relevant){
        window.requestAnimationFrame(sync);
        window.setTimeout(sync,120);
      }
    });
    observer.observe(document.body,{childList:true,subtree:true});
  }

  function registerCurrentWorker(){
    if(!('serviceWorker' in navigator))return;
    navigator.serviceWorker.register('sw.js?v=octagon-hq-sw-20260718b-fast-refresh',{scope:'./'}).then(registration=>registration.update?.()).catch(()=>undefined);
  }

  function start(){
    installObserver();
    registerCurrentWorker();
    document.addEventListener('click',event=>{
      if(event.target.closest?.('.app-profile-chip,[data-profile-activity-edit]')){
        [0,40,140,500,1200].forEach(delay=>window.setTimeout(sync,delay));
      }
    },true);
    ['ufc-play-profile-ready','ufc-app-profile-updated','octagon-hq:notification-device-change','octagon-hq:soft-refresh'].forEach(name=>window.addEventListener(name,()=>window.setTimeout(sync,40)));
    [0,120,500,1400].forEach(delay=>window.setTimeout(sync,delay));
  }

  window.UFC_ACTIVITY_PROFILE_PHASE3_BRIDGE={version:VERSION,sync,restoreCachedProfile,saveFinishedProfile};
  document.documentElement.setAttribute('data-activity-profile-phase3-bridge',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

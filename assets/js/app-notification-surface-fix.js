(function(){
  'use strict';

  const VERSION='app-notification-surface-fix-20260718a';
  let observer=null;
  let timer=0;

  function controller(){return window.UFC_APP_NOTIFICATIONS||null;}

  function render(){
    const api=controller();
    if(!api)return false;
    try{api.render?.();}catch(_error){}
    if(!api.settings){
      try{void api.loadSettings?.();}catch(_error){}
    }
    return true;
  }

  function schedule(delay=35){
    window.clearTimeout(timer);
    timer=window.setTimeout(render,delay);
  }

  function relevant(node){
    if(!node||node.nodeType!==1)return false;
    const selector='.profile-activity-grid,.profile-activity-body,.profile-activity-panel,.app-profile-body,.app-profile-panel';
    return Boolean(node.matches?.(selector)||node.querySelector?.(selector));
  }

  function start(){
    if(observer)return;
    observer=new MutationObserver(records=>{
      if(records.some(record=>[...record.addedNodes].some(relevant))){
        schedule(20);
        window.setTimeout(render,120);
      }
    });
    observer.observe(document.body,{childList:true,subtree:true});

    document.addEventListener('click',event=>{
      if(!event.target.closest?.('.app-profile-chip,[data-profile-activity-edit]'))return;
      [20,100,300,800].forEach(delay=>window.setTimeout(render,delay));
    },true);

    ['ufc-play-profile-ready','ufc-app-profile-updated','ufc-profile-challenges-updated','octagon-hq:notification-device-change'].forEach(name=>{
      window.addEventListener(name,()=>{schedule(20);window.setTimeout(render,180);});
    });

    [0,180,650,1500,3000].forEach(delay=>window.setTimeout(render,delay));
  }

  window.UFC_APP_NOTIFICATION_SURFACE_FIX={version:VERSION,render,schedule};
  document.documentElement.setAttribute('data-app-notification-surface-fix',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

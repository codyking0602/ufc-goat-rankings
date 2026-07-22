(function(){
  'use strict';

  if(window.__UFC_APP_LAUNCH_WORKER_STARTED__)return;
  window.__UFC_APP_LAUNCH_WORKER_STARTED__=true;

  const VERSION='app-launch-worker-20260722a-pre-supabase-update';
  const RELOAD_KEY='ufc-app:launch-worker-controller-reload:v21';
  let reloading=false;

  function reloadOnce(){
    if(reloading)return false;
    try{
      if(sessionStorage.getItem(RELOAD_KEY)==='1')return false;
      sessionStorage.setItem(RELOAD_KEY,'1');
    }catch(_error){}
    reloading=true;
    const url=new URL(location.href);
    url.searchParams.set('__shell_update','v21');
    location.replace(url.toString());
    return true;
  }

  async function start(){
    if(!('serviceWorker' in navigator))return false;
    navigator.serviceWorker.addEventListener('controllerchange',reloadOnce);
    try{
      const registration=await navigator.serviceWorker.register('./sw.js',{
        scope:'./',
        updateViaCache:'none'
      });
      await registration.update();
      document.documentElement.dataset.appLaunchWorker=VERSION;
      return true;
    }catch(_error){
      document.documentElement.dataset.appLaunchWorker=`${VERSION}:unavailable`;
      return false;
    }
  }

  window.UFC_APP_LAUNCH_WORKER={version:VERSION,start,reloadOnce};
  void start();
})();
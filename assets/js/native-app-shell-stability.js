(function(){
  'use strict';

  if(window.__UFC_NATIVE_APP_SHELL_STABILITY_STARTED__)return;
  window.__UFC_NATIVE_APP_SHELL_STABILITY_STARTED__=true;

  const VERSION='native-app-shell-stability-20260721e-drawer-observer';
  let observer=null;
  let timer=0;

  function syncDrawerState(){
    const open=document.getElementById('drawer')?.classList.contains('open');
    document.body.classList.toggle('fighter-profile-open',Boolean(open));
  }

  function closeFighterProfile(){
    const drawer=document.getElementById('drawer');
    if(!drawer?.classList.contains('open'))return false;
    const close=document.getElementById('closeDrawer');
    if(close)close.click();
    else{drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');}
    document.body.classList.remove('fighter-profile-open');
    return true;
  }

  function scheduleDrawerSync(){
    window.clearTimeout(timer);
    timer=window.setTimeout(syncDrawerState,30);
  }

  function start(){
    document.addEventListener('click',event=>{
      if(event.target.closest?.('[data-native-destination]'))closeFighterProfile();
    },true);
    const drawer=document.getElementById('drawer');
    if(drawer){
      observer=new MutationObserver(scheduleDrawerSync);
      observer.observe(drawer,{attributes:true,attributeFilter:['class','aria-hidden']});
    }
    syncDrawerState();
    document.documentElement.dataset.nativeAppShellStability=VERSION;
  }

  window.UFC_NATIVE_APP_SHELL_STABILITY={version:VERSION,closeFighterProfile};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

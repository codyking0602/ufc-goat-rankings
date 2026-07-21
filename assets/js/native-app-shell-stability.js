(function(){
  'use strict';

  if(window.__UFC_NATIVE_APP_SHELL_STABILITY_STARTED__)return;
  window.__UFC_NATIVE_APP_SHELL_STABILITY_STARTED__=true;

  const VERSION='native-app-shell-stability-20260721e-drawer-owner';

  function closeFighterProfile(){
    const drawer=document.getElementById('drawer');
    if(!drawer?.classList.contains('open'))return false;
    const close=document.getElementById('closeDrawer');
    if(close)close.click();
    else{
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden','true');
      document.body.classList.remove('fighter-profile-open');
    }
    return true;
  }

  function start(){
    document.addEventListener('click',event=>{
      if(event.target.closest?.('[data-native-destination]'))closeFighterProfile();
    },true);
    document.documentElement.dataset.nativeAppShellStability=VERSION;
  }

  window.UFC_NATIVE_APP_SHELL_STABILITY={version:VERSION,closeFighterProfile};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

(function(){
  'use strict';

  const VERSION='product-architecture-20260718a-facade';
  const SHELL_SRC='assets/js/octagon-hq-shell.js?v=app-shell-20260718a-single-owner';

  function shell(){return window.UFC_APP_SHELL||null;}
  function loadShell(){
    if(shell()||document.querySelector(`script[src*="assets/js/octagon-hq-shell.js"]`))return;
    const script=document.createElement('script');
    script.src=SHELL_SRC;
    script.async=false;
    document.head.appendChild(script);
  }
  function call(method,...args){
    const api=shell();
    if(api?.[method])return api[method](...args);
    loadShell();
    return false;
  }

  const facade={
    version:VERSION,
    compatibilityOnly:true,
    apply:()=>call('start'),
    activateView:(view,options)=>call('activateView',view,options),
    activateDestination:key=>call('activateDestination',key),
    schedulePlaySupport:()=>call('loadPlaySupport')
  };

  if(shell())window.UFC_PRODUCT_ARCHITECTURE=shell();
  else{
    window.UFC_PRODUCT_ARCHITECTURE=facade;
    loadShell();
  }
  document.documentElement.setAttribute('data-product-architecture',VERSION);
})();
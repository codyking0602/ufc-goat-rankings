(function(){
  'use strict';

  const VERSION='product-architecture-20260718c-connectivity-loader';
  const SHELL_SRC='assets/js/octagon-hq-shell.js?v=app-shell-20260718c-legacy-route-safe';
  const CONNECTIVITY_SRC='assets/js/product-connectivity.js?v=product-connectivity-20260718c-clean-handoffs';

  function shell(){return window.UFC_APP_SHELL||null;}

  function loadOnce(match,src){
    if(document.querySelector(`script[src*="${match}"]`))return;
    const script=document.createElement('script');
    script.src=src;
    script.async=false;
    document.head.appendChild(script);
  }

  function loadShell(){
    if(shell())return;
    loadOnce('assets/js/octagon-hq-shell.js',SHELL_SRC);
  }

  function loadConnectivity(){
    if(window.UFC_PRODUCT_CONNECTIVITY)return;
    loadOnce('assets/js/product-connectivity.js',CONNECTIVITY_SRC);
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

  loadConnectivity();
  document.documentElement.setAttribute('data-product-architecture',VERSION);
})();
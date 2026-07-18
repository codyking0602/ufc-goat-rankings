(function(){
  'use strict';

  const VERSION='product-architecture-20260718f-profile-unification';
  const SHELL_SRC='assets/js/octagon-hq-shell.js?v=app-shell-20260718c-legacy-route-safe';
  const CONNECTIVITY_SRC='assets/js/product-connectivity.js?v=product-connectivity-20260718c-clean-handoffs';
  const POLISH_CSS='assets/css/product-polish.css?v=product-polish-20260718c-header-final';
  const POLISH_SRC='assets/js/product-polish.js?v=product-polish-20260718c-header-final';

  function shell(){return window.UFC_APP_SHELL||null;}

  function loadScriptOnce(match,src){
    if(document.querySelector(`script[src*="${match}"]`))return;
    const script=document.createElement('script');
    script.src=src;
    script.async=false;
    document.head.appendChild(script);
  }

  function loadStyleOnce(match,href){
    if(document.querySelector(`link[href*="${match}"]`))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href=href;
    document.head.appendChild(link);
  }

  function loadShell(){
    if(shell())return;
    loadScriptOnce('assets/js/octagon-hq-shell.js',SHELL_SRC);
  }

  function loadConnectivity(){
    if(window.UFC_PRODUCT_CONNECTIVITY)return;
    loadScriptOnce('assets/js/product-connectivity.js',CONNECTIVITY_SRC);
  }

  function loadPolish(){
    loadStyleOnce('assets/css/product-polish.css',POLISH_CSS);
    if(!window.UFC_PRODUCT_POLISH)loadScriptOnce('assets/js/product-polish.js',POLISH_SRC);
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
  loadPolish();
  document.documentElement.setAttribute('data-product-architecture',VERSION);
})();
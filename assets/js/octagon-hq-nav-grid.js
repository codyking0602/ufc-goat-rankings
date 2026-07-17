(function(){
  'use strict';

  const VERSION='octagon-hq-nav-grid-disabled-20260717a';

  function clearLegacyGrid(){
    document.getElementById('octagonHqCompressionCss')?.remove();
    const nav=document.querySelector('nav.tabs');
    if(nav)nav.removeAttribute('style');
    nav?.querySelectorAll('.tab').forEach(button=>{
      button.removeAttribute('style');
      button.style.removeProperty('grid-column');
      button.style.removeProperty('grid-row');
      button.style.removeProperty('order');
    });
  }

  function start(){
    clearLegacyGrid();
    [50,250,900,2200,5000].forEach(delay=>window.setTimeout(clearLegacyGrid,delay));
    window.addEventListener('resize',clearLegacyGrid,{passive:true});
  }

  window.UFC_OCTAGON_HQ_NAV_GRID={
    version:VERSION,
    apply:clearLegacyGrid,
    forceGrid:clearLegacyGrid,
    clearLegacyGrid
  };
  document.documentElement.setAttribute('data-octagon-hq-nav-grid',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
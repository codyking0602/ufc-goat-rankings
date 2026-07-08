// Runtime stabilizer disabled. Source renderers now own photos and tabs.
(function(){
  const VERSION = 'runtime-stability-fixes-20260707b-disabled';
  window.UFC_RUNTIME_STABILITY_FIXES = {
    version: VERSION,
    mode: 'disabled-no-runtime-loops',
    hydrateRowPhotos(){},
    ensureDivisionBoard(){}
  };
  document.documentElement.setAttribute('data-runtime-stability-fixes', VERSION);
})();

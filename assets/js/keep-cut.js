(function(){
  'use strict';

  const VERSION='keep-cut-bootstrap-20260717e-full-roster-ledger';
  const LEDGER_SRC='assets/data/keep-cut-category-ratings.js?v=keep-cut-category-ratings-20260717a-phase-one';
  const ENGINE_SRC='assets/js/keep-cut-v2.js?v=keep-cut-20260717e-full-roster-ledger';

  function loadEngine(){
    if(window.UFC_KEEP_CUT?.version==='keep-cut-20260717e-full-roster-ledger')return;
    if(document.querySelector('script[data-keep-cut-v2-loader]'))return;
    const script=document.createElement('script');
    script.src=ENGINE_SRC;
    script.async=false;
    script.dataset.keepCutV2Loader='true';
    script.addEventListener('error',()=>document.documentElement.setAttribute('data-keep-cut','engine-load-error'),{once:true});
    document.head.appendChild(script);
  }

  function loadLedger(){
    if(window.UFC_KEEP_CUT_CATEGORY_RATINGS){loadEngine();return;}
    window.addEventListener('ufc-keep-cut-ratings-ready',loadEngine,{once:true});
    if(document.querySelector('script[data-keep-cut-category-ratings-loader]'))return;
    const script=document.createElement('script');
    script.src=LEDGER_SRC;
    script.async=false;
    script.dataset.keepCutCategoryRatingsLoader='true';
    script.addEventListener('error',()=>document.documentElement.setAttribute('data-keep-cut-rating-ledger','load-error'),{once:true});
    document.head.appendChild(script);
  }

  document.documentElement.setAttribute('data-keep-cut-bootstrap',VERSION);
  loadLedger();
})();

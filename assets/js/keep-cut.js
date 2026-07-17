(function(){
  'use strict';

  const VERSION='keep-cut-bootstrap-20260717m-roster-batch-audited';
  const BATCH_SRC='assets/data/play-roster-batch-one.js?v=play-roster-batch-one-20260717c-current-audit';
  const BATCH_VERSION='play-roster-batch-one-20260717c-current-audit';
  const COMPARE_SRCS=[
    'assets/data/compare-profiles-batch-one-a.js?v=compare-profiles-batch-one-a-20260717b',
    'assets/data/compare-profiles-batch-one-b.js?v=compare-profiles-batch-one-b-20260717b',
    'assets/data/compare-profiles-batch-one-c.js?v=compare-profiles-batch-one-c-20260717b'
  ];
  const DISPLAY_SRC='assets/data/display-overrides-batch-one.js?v=display-overrides-batch-one-20260717a';
  const CURRENT_PATCH_SRC='assets/data/play-roster-batch-one-current-patch.js?v=play-roster-batch-one-current-patch-20260717b';
  const CHAMPION_ELIGIBILITY_SRC='assets/data/keep-cut-champion-eligibility-patch.js?v=keep-cut-champion-eligibility-20260717a';
  const LEDGER_SRC='assets/data/keep-cut-category-ratings.js?v=keep-cut-category-ratings-20260717a-phase-one';
  const ENGINE_SRC='assets/js/keep-cut-v2.js?v=keep-cut-20260717e-full-roster-ledger';
  const PHASE_THREE_SRC='assets/js/keep-cut-phase3.js?v=keep-cut-20260717f-absolute-role-engine';
  const PHASE_THREE_VERSION='keep-cut-20260717f-absolute-role-engine';
  const PHASE_FOUR_SRC='assets/js/keep-cut-phase4.js?v=keep-cut-20260717h-category-lineup';
  const PHASE_FOUR_VERSION='keep-cut-20260717h-category-lineup';

  function loadScript(src,marker,onload){
    const existing=document.querySelector(`script[${marker}]`);
    if(existing){existing.addEventListener('load',onload,{once:true});return;}
    const script=document.createElement('script');
    script.src=src;
    script.async=false;
    script.setAttribute(marker,'true');
    script.addEventListener('load',onload,{once:true});
    script.addEventListener('error',()=>document.documentElement.setAttribute('data-keep-cut','dependency-load-error'),{once:true});
    document.head.appendChild(script);
  }

  function loadPhaseFour(){
    if(window.UFC_KEEP_CUT?.version===PHASE_FOUR_VERSION)return;
    if(document.querySelector('script[data-keep-cut-phase-four-loader]'))return;
    loadScript(PHASE_FOUR_SRC,'data-keep-cut-phase-four-loader',()=>{});
  }

  function loadPhaseThree(){
    const version=window.UFC_KEEP_CUT?.version;
    if(version===PHASE_FOUR_VERSION)return;
    if(version===PHASE_THREE_VERSION){loadPhaseFour();return;}
    loadScript(PHASE_THREE_SRC,'data-keep-cut-phase-three-loader',loadPhaseFour);
  }

  function loadEngine(){
    if(window.UFC_KEEP_CUT){loadPhaseThree();return;}
    loadScript(ENGINE_SRC,'data-keep-cut-v2-loader',loadPhaseThree);
  }

  function loadLedger(){
    if(window.UFC_KEEP_CUT_CATEGORY_RATINGS){loadEngine();return;}
    window.addEventListener('ufc-keep-cut-ratings-ready',loadEngine,{once:true});
    if(document.querySelector('script[data-keep-cut-category-ratings-loader]'))return;
    loadScript(LEDGER_SRC,'data-keep-cut-category-ratings-loader',()=>{});
  }

  function loadChampionEligibility(){
    loadScript(CHAMPION_ELIGIBILITY_SRC,'data-keep-cut-champion-eligibility-loader',loadLedger);
  }

  function loadCurrentPatch(){
    loadScript(CURRENT_PATCH_SRC,'data-keep-cut-batch-one-current-patch',loadChampionEligibility);
  }

  function loadDisplayOverrides(){
    loadScript(DISPLAY_SRC,'data-keep-cut-batch-one-display-overrides',loadCurrentPatch);
  }

  function loadCompare(index=0){
    if(index>=COMPARE_SRCS.length){loadDisplayOverrides();return;}
    const marker=`data-keep-cut-batch-one-compare-${index+1}`;
    loadScript(COMPARE_SRCS[index],marker,()=>loadCompare(index+1));
  }

  function loadBatch(){
    if(window.UFC_PLAY_ROSTER_BATCH_ONE?.version===BATCH_VERSION){loadCompare();return;}
    loadScript(BATCH_SRC,'data-keep-cut-roster-batch-one-loader',loadCompare);
  }

  document.documentElement.setAttribute('data-keep-cut-bootstrap',VERSION);
  loadBatch();
})();

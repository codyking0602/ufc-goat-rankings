// Retired compatibility adapter. Prime Dominance is owned by category-calculators.js.
(function(){
  'use strict';
  const VERSION='prime-dominance-live-promoter-retired-20260714a';
  const status={
    version:VERSION,
    status:'retired',
    applied:false,
    mutatesCategoryOnly:false,
    mutatesTotals:false,
    mutatesRanks:false,
    mutatesOvr:false,
    owner:'assets/js/category-calculators.js',
    reason:'Permanent calculated pipeline owns Prime Dominance.'
  };
  const API={...status,latest:status,apply(){return status;}};
  window.UFC_PRIME_DOMINANCE_LIVE_PROMOTER=API;
  window.UFC_LIVE_SCORE_PROMOTION=status;
  document.documentElement?.setAttribute?.('data-prime-dominance-live',VERSION);
})();

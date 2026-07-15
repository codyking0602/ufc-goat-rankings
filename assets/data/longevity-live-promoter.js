// Retired compatibility adapter. Longevity is owned by category-calculators.js.
(function(){
  'use strict';
  const VERSION='longevity-live-promoter-retired-20260714a';
  const status={
    version:VERSION,
    status:'retired',
    applied:false,
    writesCategory:false,
    mutatesOverallScores:false,
    categoryOnly:false,
    owner:'assets/js/category-calculators.js',
    reason:'Permanent calculated pipeline owns Longevity.'
  };
  const API={...status,latest:status,apply(){return status;}};
  window.UFC_LONGEVITY_LIVE_PROMOTER=API;
  document.documentElement?.setAttribute?.('data-longevity-live-promoter',VERSION);
})();

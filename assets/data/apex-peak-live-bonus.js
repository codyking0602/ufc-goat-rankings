// Retired compatibility adapter. Apex Peak is owned by category-calculators.js.
(function(){
  'use strict';
  const VERSION='apex-peak-live-bonus-retired-20260714a';
  const status={
    version:VERSION,
    status:'retired',
    applied:false,
    categoryOnly:false,
    mutatesCategoryScores:false,
    mutatesOverallScores:false,
    owner:'assets/js/category-calculators.js',
    reason:'Permanent calculated pipeline owns Apex Peak.',
    apply(){return status;}
  };
  window.UFC_APEX_PEAK_LIVE_BONUS=status;
  document.documentElement?.setAttribute?.('data-apex-peak-live-bonus',VERSION);
})();

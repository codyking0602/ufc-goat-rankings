// Retired compatibility adapter. Championship is owned by category-calculators.js.
(function(){
  'use strict';
  const VERSION='championship-resume-live-retired-20260714a';
  const status={
    version:VERSION,status:'retired',applied:false,categoryOnly:false,mutatesCategoryScores:false,mutatesOverall:false,
    owner:'assets/js/category-calculators.js',reason:'Permanent calculated pipeline owns Championship.'
  };
  window.UFC_CHAMPIONSHIP_RESUME_LIVE=status;
  document.documentElement?.setAttribute?.('data-championship-resume-live',VERSION);
})();

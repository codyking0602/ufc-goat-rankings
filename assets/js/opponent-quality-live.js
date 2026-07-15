// Retired compatibility adapter. Opponent Quality is owned by category-calculators.js.
(function(){
  'use strict';
  const VERSION='opponent-quality-live-retired-20260714a';
  const status={
    version:VERSION,status:'retired',applied:false,categoryOnly:false,mutatesCategoryScores:false,mutatesOverall:false,
    owner:'assets/js/category-calculators.js',reason:'Permanent calculated pipeline owns Opponent Quality.'
  };
  window.UFC_OPPONENT_QUALITY_LIVE=status;
  if(typeof window.UFC_RESOLVE_OPPONENT_QUALITY_READY==='function')window.UFC_RESOLVE_OPPONENT_QUALITY_READY(status);
  window.dispatchEvent?.(new CustomEvent('ufc-opponent-quality-ready',{detail:status}));
  document.documentElement?.setAttribute?.('data-opponent-quality-live',VERSION);
})();

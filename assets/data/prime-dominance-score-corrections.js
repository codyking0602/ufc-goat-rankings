// Prime Dominance worksheet corrections are obsolete.
// Prime Dominance now comes from prime-dominance-shadow-model.js + prime-dominance-live-promoter.js.
(function(){
  const VERSION='prime-dominance-score-corrections-disabled-20260709a';
  window.UFC_PRIME_DOMINANCE_SCORE_CORRECTIONS={
    version:VERSION,
    disabled:true,
    reason:'Prime Dominance is now sourced from the audited shadow/live model. This legacy worksheet layer no longer mutates fighter rows.',
    appliedAt:new Date().toISOString()
  };
  document.documentElement.setAttribute('data-prime-dominance-score-corrections',VERSION);
})();

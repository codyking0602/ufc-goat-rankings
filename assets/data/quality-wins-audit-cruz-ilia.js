// Retired migration compatibility marker.
// Dominick Cruz and Ilia Topuria Quality Wins inputs are owned by canonical fighter facts and the permanent category calculator.
(function(){
  'use strict';
  const VERSION='quality-wins-audit-cruz-ilia-retired-20260715a';
  window.UFC_QUALITY_WINS_AUDIT_CRUZ_ILIA={
    version:VERSION,
    applied:false,
    retired:true,
    mutatesScores:false,
    mutatesPresentation:false,
    owner:'canonical-fighter-facts + category-calculators.js'
  };
  document.documentElement.setAttribute('data-quality-wins-audit-cruz-ilia',VERSION);
})();

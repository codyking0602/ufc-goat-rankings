// Compatibility marker retained for older cached index files.
(function(){
  'use strict';
  const VERSION='canonical-fighter-registry-batch-eight-audit-fixes-20260712e-consolidated';
  const fighters=Array.isArray(window.UFC_BATCH_EIGHT_FIGHTER_DATA)?window.UFC_BATCH_EIGHT_FIGHTER_DATA.map(row=>row.name):[];
  window.UFC_BATCH_EIGHT_AUDIT_FIXES={version:VERSION,fighters,applied:true,mutatesRegistry:false,source:'canonical-fighter-registry-batch-eight.js'};
  document.documentElement.setAttribute('data-batch-eight-audit-fixes-ready',VERSION);
})();
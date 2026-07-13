// Compatibility marker retained for older cached index files.
(function(){
  'use strict';
  const VERSION='batch-eight-audit-data-patch-20260712d-consolidated';
  const fighters=Array.isArray(window.UFC_BATCH_EIGHT_FIGHTER_DATA)?window.UFC_BATCH_EIGHT_FIGHTER_DATA.map(row=>row.name):[];
  window.UFC_BATCH_EIGHT_AUDIT_DATA_PATCH={version:VERSION,fighters,applied:true,mutatesData:false,source:'canonical-fighter-registry-batch-eight-data.js'};
  document.documentElement.setAttribute('data-batch-eight-audit-data-ready',VERSION);
})();
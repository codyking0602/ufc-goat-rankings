// Retired migration compatibility marker.
// Resume Snapshot and all visible profile stats are owned by ranking-pipeline.js via RANKING_DATA.visibleStats.
(function(){
  'use strict';
  const VERSION='profile-stat-consistency-retired-20260715a';
  window.UFC_PROFILE_STAT_CONSISTENCY={
    version:VERSION,
    applied:false,
    retired:true,
    mutatesScores:false,
    mutatesRanks:false,
    mutatesOvr:false,
    mutatesPresentation:false,
    owner:'ranking-pipeline.js + calculated-profile-runtime.js'
  };
  document.documentElement.setAttribute('data-profile-stat-consistency',VERSION);
})();

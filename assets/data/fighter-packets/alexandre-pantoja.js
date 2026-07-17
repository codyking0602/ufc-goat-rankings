// Retired legacy compatibility marker.
// Alexandre Pantoja is a normal shared-roster fighter owned by canonical-roster-batch-ten.js.
// This file intentionally contains no fighter data, fallback row, timer, loader, count mutation, or runtime reinsertion.
(function(){
  'use strict';
  const VERSION='retired-fighter-packet-alexandre-pantoja-20260717a';
  window.UFC_RETIRED_FIGHTER_PACKETS=window.UFC_RETIRED_FIGHTER_PACKETS||{};
  window.UFC_RETIRED_FIGHTER_PACKETS['Alexandre Pantoja']={
    version:VERSION,
    status:'retired',
    canonicalOwner:'assets/data/canonical-roster-batch-ten.js',
    mutatesRoster:false,
    mutatesScores:false,
    installsFallback:false
  };
  document.documentElement.setAttribute('data-retired-pantoja-packet',VERSION);
})();

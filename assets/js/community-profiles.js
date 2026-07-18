(function(){
  'use strict';
  // community-profiles-20260718a-phase-4b
  const VERSION='community-profiles-20260718d-emergency-disabled';
  const disabled=()=>false;
  window.UFC_COMMUNITY_PROFILES={
    version:VERSION,
    disabled:true,
    load:async()=>null,
    refresh:async()=>null,
    openMember:disabled,
    close:disabled,
    syncTop10:async()=>false,
    render:disabled
  };
  document.documentElement.setAttribute('data-community-profiles',VERSION);
})();

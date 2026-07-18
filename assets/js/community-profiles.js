(function(){
  'use strict';
  const VERSION='community-profiles-20260718-main-dormant';
  const disabled=()=>false;
  window.UFC_COMMUNITY_PROFILES={
    version:VERSION,
    previewOnly:true,
    load:async()=>null,
    refresh:async()=>null,
    renderDirectory:disabled,
    openMember:disabled,
    close:disabled,
    publishTop10:async()=>false
  };
  document.documentElement.setAttribute('data-community-profiles',VERSION);
})();
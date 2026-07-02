// Lightweight post-load status hook.
// Durable profile rendering lives in assets/js/profile-template-system.js.
// Durable fighter stat packages live in assets/js/fighter-profile-packages.js.
// Watch Moment links live in assets/js/watch-moments.js.
(function(){
  const VERSION = 'ranking-data-patches-20260702a';

  function status(){
    const data = window.RANKING_DATA;
    window.UFC_PHASE2_DATA_STATUS = {
      version: VERSION,
      mode: 'lightweight-status-hook',
      profileTemplateSystem: !!window.UFC_PROFILE_TEMPLATE_SYSTEM,
      fighterProfilePackages: !!window.UFC_FIGHTER_PROFILE_PACKAGES,
      watchMoments: !!window.UFC_WATCH_MOMENTS,
      packagedFighters: window.UFC_FIGHTER_PROFILE_PACKAGES?.fighters || [],
      watchMomentFighters: window.UFC_WATCH_MOMENTS?.fighters || [],
      petrYanInMen: !!(data && Array.isArray(data.men) && data.men.some(f => f.fighter === 'Petr Yan')),
      petrYanInProfiles: !!(data && Array.isArray(data.fighters) && data.fighters.some(f => f.fighter === 'Petr Yan')),
      appliedAt: new Date().toISOString()
    };
    document.documentElement.setAttribute('data-phase2-data-patch', VERSION);
  }

  function loadScriptOnce(src, attr, done){
    if(document.querySelector(`script[${attr}]`)){
      if(done) done();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.setAttribute(attr, 'true');
    script.onload = () => { if(done) done(); };
    script.onerror = () => { if(done) done(); };
    document.body.appendChild(script);
  }

  function loadModules(){
    const loadWatchMoments = () => loadScriptOnce('assets/js/watch-moments.js?v=watch-moments-20260702a', 'data-watch-moments', status);
    const loadPackages = () => loadScriptOnce('assets/js/fighter-profile-packages.js?v=fighter-profile-packages-20260702a', 'data-fighter-profile-packages', loadWatchMoments);
    if(window.UFC_PROFILE_TEMPLATE_SYSTEM){
      loadPackages();
      return;
    }
    loadScriptOnce('assets/js/profile-template-system.js?v=profile-template-system-20260701a', 'data-profile-template-system', loadPackages);
  }

  window.UFC_RANKING_DATA_PATCHES_V1 = {
    meta: {
      purpose: 'Status hook and durable module loader',
      note: 'Presentation logic, fighter packages, and Watch Moment links are split into durable JS modules.',
      updated: '2026-07-02',
      version: VERSION
    },
    apply: status
  };

  loadModules();
  window.UFC_PHASE2_DATA_REFRESH = status;
})();

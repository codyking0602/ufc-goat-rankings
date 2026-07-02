// Lightweight post-load status hook.
(function(){
  const VERSION = 'ranking-data-patches-20260702j';

  function status(){
    window.UFC_PHASE2_DATA_STATUS = {
      version: VERSION,
      mode: 'lightweight-status-hook',
      profileTemplateSystem: !!window.UFC_PROFILE_TEMPLATE_SYSTEM,
      fighterProfilePackages: !!window.UFC_FIGHTER_PROFILE_PACKAGES,
      watchMoments: !!window.UFC_WATCH_MOMENTS,
      homePolish: !!window.UFC_HOME_POLISH,
      divisionRankings: !!window.UFC_DIVISION_RANKINGS,
      packagedFighters: window.UFC_FIGHTER_PROFILE_PACKAGES?.fighters || [],
      watchMomentFighters: window.UFC_WATCH_MOMENTS?.fighters || [],
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
    const loadDivisionRankings = () => loadScriptOnce('assets/js/division-rankings.js?v=division-rankings-20260702d', 'data-division-rankings', status);
    const loadHomePolish = () => loadScriptOnce('assets/js/home-polish.js?v=home-polish-hybrid-preview-20260702a', 'data-home-polish', loadDivisionRankings);
    const loadWatchMoments = () => loadScriptOnce('assets/js/watch-moments.js?v=watch-moments-20260702a', 'data-watch-moments', loadHomePolish);
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
      updated: '2026-07-02',
      version: VERSION
    },
    apply: status
  };

  loadModules();
  window.UFC_PHASE2_DATA_REFRESH = status;
})();

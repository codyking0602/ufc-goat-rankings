// Lightweight post-load status hook.
(function(){
  const VERSION = 'ranking-data-patches-20260702x';
  function applyLateDisplayOverrides(){
    if(!window.DISPLAY_OVERRIDES) return;
    window.DISPLAY_OVERRIDES["Ilia Topuria"] = {
      ...(window.DISPLAY_OVERRIDES["Ilia Topuria"] || {}),
      photoUrl: "assets/fighters/ilia-topuria.webp",
      thumbUrl: "assets/fighters/ilia-topuria-thumb.webp"
    };
  }

  function refreshApp(){
    if(typeof window.refresh === 'function'){
      try { window.refresh(); } catch(e) {}
    }
  }

  function status(){
    applyLateDisplayOverrides();
    refreshApp();
    window.UFC_PHASE2_DATA_STATUS = {
      version: VERSION,
      mode: 'lightweight-status-hook',
      profileTemplateSystem: !!window.UFC_PROFILE_TEMPLATE_SYSTEM,
      fighterProfilePackages: !!window.UFC_FIGHTER_PROFILE_PACKAGES,
      watchMoments: !!window.UFC_WATCH_MOMENTS,
      homePolish: !!window.UFC_HOME_POLISH,
      divisionRankings: !!window.UFC_DIVISION_RANKINGS,
      appBranding: !!window.UFC_APP_BRANDING,
      compareNarrative: !!window.UFC_COMPARE_NARRATIVE_SYSTEM,
      compareNarrativeWatchdog: !!window.UFC_COMPARE_NARRATIVE_WATCHDOG,
      compareProfiles: !!window.COMPARE_PROFILES,
      compareLedger: !!window.COMPARE_FIGHT_LEDGER,
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

  function loadSequence(items, done){
    const next = (i) => {
      if(i >= items.length){
        if(done) done();
        return;
      }
      loadScriptOnce(items[i].src, items[i].attr, () => next(i + 1));
    };
    next(0);
  }

  function loadModules(){
    const compareCoreScripts = [
      {src:'assets/compare-data.js?v=compare-data-20260630a', attr:'data-compare-data'},
      {src:'assets/compare-coverage-pack-1.js?v=compare-coverage-pack-1-20260630a', attr:'data-compare-coverage-pack-1'},
      {src:'assets/compare-coverage-pack-2.js?v=compare-coverage-pack-2-20260630a', attr:'data-compare-coverage-pack-2'},
      {src:'assets/compare-phase2-yan.js?v=compare-phase2-yan-20260701b', attr:'data-compare-phase2-yan'},
      {src:'assets/compare-mode.js?v=special-matchups-20260630l', attr:'data-compare-mode'},
      {src:'assets/compare-engine-v1-5.js?v=compare-engine-v1-5-20260630b', attr:'data-compare-engine-v1-5'},
      {src:'assets/compare-copy-fixes-v1.js?v=compare-copy-fixes-v1-20260630a', attr:'data-compare-copy-fixes-v1'}
    ];

    const loadCompareWatchdog = () => loadScriptOnce('assets/js/compare-narrative-watchdog.js?v=compare-narrative-watchdog-20260702a', 'data-compare-narrative-watchdog', status);
    const loadCompareNarrative = () => loadScriptOnce('assets/js/compare-narrative-system.js?v=compare-narrative-system-20260702d', 'data-compare-narrative-system', loadCompareWatchdog);
    const loadCompareCore = () => loadSequence(compareCoreScripts, loadCompareNarrative);
    const loadBranding = () => loadScriptOnce('assets/js/app-branding.js?v=app-branding-20260702c', 'data-app-branding', loadCompareCore);
    const loadDivisionRankings = () => loadScriptOnce('assets/js/division-rankings.js?v=division-rankings-20260702f', 'data-division-rankings', loadBranding);
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

  applyLateDisplayOverrides();
  loadModules();
  window.UFC_PHASE2_DATA_REFRESH = status;
})();

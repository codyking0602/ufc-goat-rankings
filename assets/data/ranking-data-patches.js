// Lightweight post-load status hook.
// Durable profile rendering now lives in assets/js/profile-template-system.js.
(function(){
  const VERSION = 'ranking-data-patches-20260701f';
  function status(){
    const data = window.RANKING_DATA;
    window.UFC_PHASE2_DATA_STATUS = {
      version: VERSION,
      mode: 'lightweight-status-hook',
      profileTemplateSystem: !!window.UFC_PROFILE_TEMPLATE_SYSTEM,
      petrYanInMen: !!(data && Array.isArray(data.men) && data.men.some(f => f.fighter === 'Petr Yan')),
      petrYanInProfiles: !!(data && Array.isArray(data.fighters) && data.fighters.some(f => f.fighter === 'Petr Yan')),
      appliedAt: new Date().toISOString()
    };
    document.documentElement.setAttribute('data-phase2-data-patch', VERSION);
  }
  function loadTemplateSystem(){
    if(window.UFC_PROFILE_TEMPLATE_SYSTEM || document.querySelector('script[data-profile-template-system]')){
      status();
      return;
    }
    const script = document.createElement('script');
    script.src = 'assets/js/profile-template-system.js?v=profile-template-system-20260701a';
    script.dataset.profileTemplateSystem = 'true';
    script.onload = status;
    script.onerror = status;
    document.body.appendChild(script);
  }
  window.UFC_RANKING_DATA_PATCHES_V1 = {
    meta: {
      purpose: 'Status hook and durable template module loader',
      note: 'Presentation logic has been moved to assets/js/profile-template-system.js.',
      updated: '2026-07-01',
      version: VERSION
    },
    apply: status
  };
  loadTemplateSystem();
  window.UFC_PHASE2_DATA_REFRESH = status;
})();

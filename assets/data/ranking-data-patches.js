// Lightweight post-load status hook.
// Durable GSP, Charles, Ilia, and Petr Yan changes now live in the real source files.

(function () {
  const data = window.RANKING_DATA;
  const PATCH_VERSION = 'phase2-source-clean-2026-07-01';

  function refreshStatus() {
    window.UFC_PHASE2_DATA_STATUS = {
      version: PATCH_VERSION,
      mode: 'source-clean',
      petrYanInMen: !!(data && Array.isArray(data.men) && data.men.some(f => f.fighter === 'Petr Yan')),
      petrYanInProfiles: !!(data && Array.isArray(data.fighters) && data.fighters.some(f => f.fighter === 'Petr Yan')),
      appliedAt: new Date().toISOString()
    };
    document.documentElement.setAttribute('data-phase2-data-patch', PATCH_VERSION);
  }

  window.UFC_RANKING_DATA_PATCHES_V1 = {
    meta: {
      purpose: 'Post-materialization status hook',
      note: 'No durable ranking mutations remain here; source files own the fighter data.',
      updated: '2026-07-01',
      version: PATCH_VERSION
    },
    apply: refreshStatus
  };

  window.UFC_PHASE2_DATA_REFRESH = refreshStatus;
  refreshStatus();
})();

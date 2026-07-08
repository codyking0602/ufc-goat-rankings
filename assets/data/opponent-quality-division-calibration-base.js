// Opponent Quality division calibration: base ledger group. Shadow-only.
// Hard-division trims reverted. Division strength should push borderline wins upward, not down.
(function(){
  const VERSION='opponent-quality-division-calibration-base-20260708b-hard-division-revert';
  const store=window.UFC_OPPONENT_QUALITY_LEDGERS;
  if(!store?.raw)return;
  const changes=[];
  store.version=VERSION;
  store.baseDivisionCalibration={version:VERSION,changes,appliedAt:new Date().toISOString(),note:'No base-ledger hard-division trims active. Original ledger values stand for GSP, Jones, Khabib, Islam, Volk, Max, Aldo, Charles, Dustin, and Gaethje.'};
  document.documentElement.setAttribute('data-opponent-quality-division-calibration-base',VERSION);
})();
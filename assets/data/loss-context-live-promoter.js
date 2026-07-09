// Loss Context Live Promoter.
// Temporarily disabled pending full UFC loss-ledger completeness audit.
// Keeps the adapter/ledger available for QA without mutating live fighter penalty values.
(function(){
  const VERSION='loss-context-live-promoter-20260709b-disabled-pending-full-ledger';
  const DATA=window.RANKING_DATA;
  const adapter=window.UFC_LOSS_CONTEXT_LEDGER_ADAPTER;

  function apply(){
    const status={
      version:VERSION,
      applied:false,
      reason:'Disabled pending full UFC loss-ledger completeness audit. Adapter/era ledger remain QA-only until every fighter has all counted pre-prime, prime, upward-division, weird, and post-prime UFC losses represented.',
      dataLoaded:!!DATA,
      adapterLoaded:!!adapter,
      adapterVersion:adapter?.version||null,
      eraLedgerVersion:adapter?.sourceEraLedgerVersion||window.UFC_FIGHTER_ERA_LEDGERS?.version||null,
      mutatesScores:false,
      apply,
      appliedAt:new Date().toISOString()
    };
    window.UFC_LOSS_CONTEXT_LIVE_PROMOTER=status;
    document.documentElement.setAttribute('data-loss-context-live-promoter',VERSION);
    return status;
  }

  apply();
})();

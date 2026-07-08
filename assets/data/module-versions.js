// Central cache-bust versions for scoring/category modules.
window.UFC_MODULE_VERSIONS = {
  primeWindows: "20260708a",
  primeRoundControlAudit: "20260708a",
  primeDominanceLedgers: "20260708d-round-audit-batch-one",
  scoreWeighting: "20260708d-prime-dominance-data-restart-loader",
  championshipResumeLive: "20260708e",
  opponentQualityLive: "20260708b"
};

(function(){
  const versions = window.UFC_MODULE_VERSIONS || {};
  function loadScript(src, attr, done){
    if(!src || document.querySelector(`script[${attr}]`)){
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

  loadScript(
    versions.primeRoundControlAudit ? `assets/data/prime-round-control-audit.js?v=prime-round-control-audit-${versions.primeRoundControlAudit}` : null,
    'data-prime-round-control-audit',
    () => loadScript(
      versions.primeDominanceLedgers ? `assets/data/prime-dominance-ledgers.js?v=prime-dominance-ledgers-${versions.primeDominanceLedgers}` : null,
      'data-prime-dominance-ledgers'
    )
  );
})();

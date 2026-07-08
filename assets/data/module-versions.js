// Central cache-bust versions for scoring/category modules.
window.UFC_MODULE_VERSIONS = {
  primeWindows: "20260708a",
  primeDominanceLedgers: "20260708d-round-audit-batch-one",
  scoreWeighting: "20260708d-prime-dominance-data-restart-loader",
  championshipResumeLive: "20260708e",
  opponentQualityLive: "20260708b"
};

(function(){
  const v = window.UFC_MODULE_VERSIONS.primeDominanceLedgers;
  if(!v || document.querySelector('script[data-prime-dominance-ledgers]')) return;
  const script = document.createElement('script');
  script.src = `assets/data/prime-dominance-ledgers.js?v=prime-dominance-ledgers-${v}`;
  script.setAttribute('data-prime-dominance-ledgers','true');
  document.body.appendChild(script);
})();
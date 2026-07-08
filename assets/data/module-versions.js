// Central cache-bust versions for scoring/category modules.
window.UFC_MODULE_VERSIONS = {
  primeWindows: "20260708a",
  primeRoundControlAudit: "20260708c-batch-three",
  primeDominanceLedgers: "20260708j-round-audit-batch-two",
  primeDominanceShadowModel: "20260708a",
  primeDominanceLivePromoter: "20260708b",
  primeDominanceCopyPolish: "20260708a",
  scoreWeighting: "20260708d-prime-dominance-data-restart-loader",
  championshipResumeLive: "20260708e",
  opponentQualityLive: "20260708b"
};

(function(){
  const versions = window.UFC_MODULE_VERSIONS || {};

  function loadScript(src, attr, done){
    if(!src || document.querySelector('script[' + attr + ']')){
      if(done) done();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.setAttribute(attr, 'true');
    s.onload = function(){ if(done) done(); };
    s.onerror = function(){ if(done) done(); };
    document.body.appendChild(s);
  }

  loadScript(
    versions.primeRoundControlAudit ? 'assets/data/prime-round-control-audit.js?v=prime-round-control-audit-' + versions.primeRoundControlAudit : null,
    'data-prime-round-control-audit',
    function(){
      loadScript(
        versions.primeDominanceLedgers ? 'assets/data/prime-dominance-ledgers.js?v=prime-dominance-ledgers-' + versions.primeDominanceLedgers : null,
        'data-prime-dominance-ledgers',
        function(){
          loadScript(
            versions.primeDominanceShadowModel ? 'assets/data/prime-dominance-shadow-model.js?v=prime-dominance-shadow-model-' + versions.primeDominanceShadowModel : null,
            'data-prime-dominance-shadow-model',
            function(){
              loadScript(
                versions.primeDominanceLivePromoter ? 'assets/data/prime-dominance-live-promoter.js?v=prime-dominance-live-promoter-' + versions.primeDominanceLivePromoter : null,
                'data-prime-dominance-live-promoter',
                function(){
                  loadScript(
                    versions.primeDominanceCopyPolish ? 'assets/js/prime-dominance-copy-polish.js?v=prime-dominance-copy-polish-' + versions.primeDominanceCopyPolish : null,
                    'data-prime-dominance-copy-polish'
                  );
                }
              );
            }
          );
        }
      );
    }
  );
})();

// Central cache-bust versions for scoring/category modules.
window.UFC_MODULE_VERSIONS = {
  primeWindows: "20260708a",
  primeRoundControlAudit: "20260708d-jon-54-63",
  primeDominanceLedgers: "20260708j-round-audit-batch-two",
  primeDominanceShadowModel: "20260708c-jon-elite-stakes",
  primeDominanceLivePromoter: "20260708c",
  primeDominanceCopyPolish: "20260708b",
  categoryPercentileTiers: "20260708b-live-prime-dominance-final",
  scoreWeighting: "20260709a-apex-bonus-modifier",
  championshipResumeLive: "20260708e",
  opponentQualityLive: "20260708b",
  fighterEraLedgers: "20260709g-review-corrections",
  longevityShadowScorer: "20260709b-ledger-driven",
  longevityLivePromoter: "20260709b-weighted-total-safe",
  apexPeakCorrections: "20260709b-full-roster",
  apexPeakLiveBonus: "20260709a-positive-modifier"
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

  function runApexBonus(){
    if(window.UFC_APEX_PEAK_LIVE_BONUS?.apply){
      try{ window.UFC_APEX_PEAK_LIVE_BONUS.apply(); }catch(e){}
    }
  }

  function forceLivePrimePercentiles(delay, label){
    setTimeout(function(){
      const version = versions.categoryPercentileTiers || '20260708b-live-prime-dominance-final';
      loadScript(
        'assets/js/category-percentile-tiers.js?v=category-percentile-tiers-' + version + '-' + label,
        'data-category-percentile-tiers-final-' + label,
        function(){
          if(window.UFC_PRIME_DOMINANCE_LIVE_PROMOTER?.apply){
            try{ window.UFC_PRIME_DOMINANCE_LIVE_PROMOTER.apply(); }catch(e){}
          }
          if(window.UFC_LONGEVITY_LIVE_PROMOTER?.apply){
            try{ window.UFC_LONGEVITY_LIVE_PROMOTER.apply(); }catch(e){}
          }
          runApexBonus();
          if(typeof refresh === 'function'){
            try{ refresh(); }catch(e){}
          }
        }
      );
    }, delay);
  }

  function loadLongevityLive(label){
    loadScript(
      versions.fighterEraLedgers ? 'assets/data/fighter-era-ledgers.js?v=fighter-era-ledgers-' + versions.fighterEraLedgers + '-' + label : null,
      'data-fighter-era-ledgers',
      function(){
        loadScript(
          versions.longevityShadowScorer ? 'assets/data/longevity-shadow-scorer.js?v=longevity-shadow-scorer-' + versions.longevityShadowScorer + '-' + label : null,
          'data-longevity-shadow-scorer',
          function(){
            loadScript(
              versions.longevityLivePromoter ? 'assets/data/longevity-live-promoter.js?v=longevity-live-promoter-' + versions.longevityLivePromoter + '-' + label : null,
              'data-longevity-live-promoter',
              function(){
                if(window.UFC_LONGEVITY_LIVE_PROMOTER?.apply){
                  try{ window.UFC_LONGEVITY_LIVE_PROMOTER.apply(); }catch(e){}
                }
                runApexBonus();
                if(typeof refresh === 'function'){
                  try{ refresh(); }catch(e){}
                }
              }
            );
          }
        );
      }
    );
  }

  function loadApexLive(label){
    loadScript(
      versions.apexPeakCorrections ? 'assets/data/apex-peak-score-corrections.js?v=apex-peak-score-corrections-' + versions.apexPeakCorrections + '-' + label : null,
      'data-apex-peak-score-corrections',
      function(){
        loadScript(
          versions.apexPeakLiveBonus ? 'assets/data/apex-peak-live-bonus.js?v=apex-peak-live-bonus-' + versions.apexPeakLiveBonus + '-' + label : null,
          'data-apex-peak-live-bonus',
          function(){
            runApexBonus();
            if(typeof refresh === 'function'){
              try{ refresh(); }catch(e){}
            }
          }
        );
      }
    );
  }

  function forceLongevityLive(delay, label){
    setTimeout(function(){
      loadLongevityLive(label);
    }, delay);
  }

  function forceApexLive(delay, label){
    setTimeout(function(){
      loadApexLive(label);
    }, delay);
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
                    'data-prime-dominance-copy-polish',
                    function(){
                      loadScript(
                        versions.categoryPercentileTiers ? 'assets/js/category-percentile-tiers.js?v=category-percentile-tiers-' + versions.categoryPercentileTiers : null,
                        'data-category-percentile-tiers',
                        function(){
                          forceLivePrimePercentiles(350, 'early');
                          forceLivePrimePercentiles(1400, 'late');
                          forceLivePrimePercentiles(2800, 'final');
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );

  forceLongevityLive(1800, 'early');
  forceLongevityLive(3800, 'late');
  forceLongevityLive(6500, 'final');

  forceApexLive(2400, 'early');
  forceApexLive(5200, 'late');
  forceApexLive(8200, 'final');
})();

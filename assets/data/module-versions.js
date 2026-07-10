// Central cache-bust versions for scoring/category modules.
window.UFC_MODULE_VERSIONS={
  finalScoreEngine:"20260710a",
  primeWindows:"20260708a",
  primeRoundControlAudit:"20260708d-jon-54-63",
  primeDominanceLedgers:"20260708j-round-audit-batch-two",
  primeDominanceShadowModel:"20260708c-jon-elite-stakes",
  primeDominanceLivePromoter:"20260710a-category-only",
  primeDominanceCopyPolish:"20260708b",
  liveScoreUi:"20260709a-peak-apex",
  categoryPercentileTiers:"20260709a-peak-apex",
  scoreWeighting:"20260709a-apex-bonus-modifier",
  championshipResumeLive:"20260710a-category-only",
  opponentQualityLive:"20260710a-category-only",
  fighterEraLedgers:"20260709g-review-corrections",
  longevityShadowScorer:"20260709b-ledger-driven",
  longevityLivePromoter:"20260710a-category-only",
  apexPeakCorrections:"20260709b-full-roster",
  apexPeakComponentAudit:"20260709c-batch-one-review-adjustments",
  apexPeakLiveBonus:"20260709c-missing-row-fixes"
};

(function(){
  const v=window.UFC_MODULE_VERSIONS||{};
  function load(src,attr,done){
    if(!src||document.querySelector('script['+attr+']')){if(done)done();return;}
    const s=document.createElement('script');
    s.src=src;
    s.setAttribute(attr,'true');
    s.onload=function(){if(done)done();};
    s.onerror=function(){if(done)done();};
    document.body.appendChild(s);
  }
  function refreshSafe(){if(typeof refresh==='function'){try{refresh();}catch(e){}}}
  function applyPrime(){if(window.UFC_PRIME_DOMINANCE_LIVE_PROMOTER?.apply){try{window.UFC_PRIME_DOMINANCE_LIVE_PROMOTER.apply();}catch(e){}}}
  function applyLongevity(){if(window.UFC_LONGEVITY_LIVE_PROMOTER?.apply){try{window.UFC_LONGEVITY_LIVE_PROMOTER.apply();}catch(e){}}}
  function applyApex(){if(window.UFC_APEX_PEAK_LIVE_BONUS?.apply){try{window.UFC_APEX_PEAK_LIVE_BONUS.apply();}catch(e){}}}
  function applyFinalScore(reason){if(window.UFC_FINAL_SCORE_ENGINE?.apply){try{window.UFC_FINAL_SCORE_ENGINE.apply(reason||'module-versions-final-refresh');}catch(e){}}}
  function finalRefresh(){applyPrime();applyLongevity();applyApex();applyFinalScore('module-versions-final-refresh');refreshSafe();}
  function cache(path,name,label){return path+'?v='+name+'-'+label;}

  function startScoringModules(){
    load(v.liveScoreUi?'assets/js/live-score-ui.js?v=live-score-ui-'+v.liveScoreUi:null,'data-live-score-ui-peak-apex',refreshSafe);

    function loadLongevity(label){
      load(v.fighterEraLedgers?cache('assets/data/fighter-era-ledgers.js','fighter-era-ledgers-'+v.fighterEraLedgers,label):null,'data-fighter-era-ledgers',function(){
        load(v.longevityShadowScorer?cache('assets/data/longevity-shadow-scorer.js','longevity-shadow-scorer-'+v.longevityShadowScorer,label):null,'data-longevity-shadow-scorer',function(){
          load(v.longevityLivePromoter?cache('assets/data/longevity-live-promoter.js','longevity-live-promoter-'+v.longevityLivePromoter,label):null,'data-longevity-live-promoter',finalRefresh);
        });
      });
    }
    function loadApex(label){
      load(v.apexPeakCorrections?cache('assets/data/apex-peak-score-corrections.js','apex-peak-score-corrections-'+v.apexPeakCorrections,label):null,'data-apex-peak-score-corrections',function(){
        load(v.apexPeakComponentAudit?cache('assets/data/apex-peak-component-audit.js','apex-peak-component-audit-'+v.apexPeakComponentAudit,label):null,'data-apex-peak-component-audit',function(){
          load(v.apexPeakLiveBonus?cache('assets/data/apex-peak-live-bonus.js','apex-peak-live-bonus-'+v.apexPeakLiveBonus,label):null,'data-apex-peak-live-bonus',finalRefresh);
        });
      });
    }
    function loadPrimePercentiles(delay,label){
      setTimeout(function(){
        load(v.categoryPercentileTiers?cache('assets/js/category-percentile-tiers.js','category-percentile-tiers-'+v.categoryPercentileTiers,label):null,'data-category-percentile-tiers-final-'+label,finalRefresh);
      },delay);
    }

    load(v.primeRoundControlAudit?'assets/data/prime-round-control-audit.js?v=prime-round-control-audit-'+v.primeRoundControlAudit:null,'data-prime-round-control-audit',function(){
      load(v.primeDominanceLedgers?'assets/data/prime-dominance-ledgers.js?v=prime-dominance-ledgers-'+v.primeDominanceLedgers:null,'data-prime-dominance-ledgers',function(){
        load(v.primeDominanceShadowModel?'assets/data/prime-dominance-shadow-model.js?v=prime-dominance-shadow-model-'+v.primeDominanceShadowModel:null,'data-prime-dominance-shadow-model',function(){
          load(v.primeDominanceLivePromoter?'assets/data/prime-dominance-live-promoter.js?v=prime-dominance-live-promoter-'+v.primeDominanceLivePromoter:null,'data-prime-dominance-live-promoter',function(){
            load(v.primeDominanceCopyPolish?'assets/js/prime-dominance-copy-polish.js?v=prime-dominance-copy-polish-'+v.primeDominanceCopyPolish:null,'data-prime-dominance-copy-polish',function(){
              load(v.categoryPercentileTiers?'assets/js/category-percentile-tiers.js?v=category-percentile-tiers-'+v.categoryPercentileTiers:null,'data-category-percentile-tiers',function(){
                finalRefresh();
                loadPrimePercentiles(350,'early');
                loadPrimePercentiles(1400,'late');
                loadPrimePercentiles(2800,'final');
              });
            });
          });
        });
      });
    });
    setTimeout(function(){loadLongevity('early');},1800);
    setTimeout(function(){loadLongevity('late');},3800);
    setTimeout(function(){loadLongevity('final');},6500);
    setTimeout(function(){loadApex('early');},2400);
    setTimeout(function(){loadApex('late');},5200);
    setTimeout(function(){loadApex('final');},8200);
  }

  load(v.finalScoreEngine?'assets/js/final-score-engine.js?v=final-score-engine-'+v.finalScoreEngine:null,'data-final-score-engine',function(){
    applyFinalScore('module-versions-bootstrap');
    startScoringModules();
  });
})();
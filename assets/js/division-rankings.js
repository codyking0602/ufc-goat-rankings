// Compatibility shim. The permanent division owner is division-ranking-pipeline.js.
(function(){
  'use strict';
  const VERSION='division-rankings-20260715b-pipeline-delegate';
  function render(){
    const owner=window.UFC_DIVISION_RANKING_PIPELINE;
    if(owner?.rebuild)owner.rebuild();
    window.UFC_DIVISION_RANKINGS?.render?.();
  }
  window.UFC_DIVISION_RANKINGS_LEGACY_SHIM={version:VERSION,manualGuardrails:false,owner:'division-ranking-pipeline.js',render};
  window.addEventListener?.('ufc-scoring-pipeline-ready',render);
})();

// Central cache-bust versions and deterministic scoring bootstrap.
window.UFC_MODULE_VERSIONS={scoringPipeline:"20260710t-loss-context-audit",finalScoreEngine:"20260710b-deterministic",primeWindows:"20260710b-context-only",primeRoundControlAudit:"20260708d-jon-54-63",primeDominanceLedgers:"20260708j-round-audit-batch-two",primeDominanceShadowModel:"20260708c-jon-elite-stakes",primeDominanceAuditBatchSeven:"20260710d-frankie-full-window",primeDominanceAuditBatchTen:"20260710a-canonical-window-five",primeDominanceLivePromoter:"20260710d-canonical-prime-source",primeDominanceCopyPolish:"20260708b",categoryPercentileTiers:"20260710c-rating-source",scoreWeighting:"20260710a-compatibility-only",championshipResumeLive:"20260710d-fixed-benchmark",opponentQualityLive:"20260710c-fixed-benchmark",fighterEraLedgers:"20260709g-review-corrections",canonicalPrimeRecords:"20260710b-prime-ledger-recount",fighterEraWindowAudit:"20260710b-record-dependencies",lossContextMismatchAudit:"20260710a-roster-62",longevityCanonicalRecalculation:"20260710a-ten-window-rebuild",longevityShadowScorer:"20260710c-144-month-ceiling",longevityLivePromoter:"20260710b-144-month-ceiling",apexPeakCorrections:"20260709b-full-roster",apexPeakComponentAudit:"20260709c-batch-one-review-adjustments",apexPeakLiveBonus:"20260710a-category-only",apexPeakDricusAudit:"20260710b-merab-zhang"};
(function(){
'use strict';
const v=window.UFC_MODULE_VERSIONS||{},VERSION='deterministic-scoring-pipeline-20260710t-loss-context-audit';
const state={version:VERSION,mode:'deterministic-single-pass',status:'waiting-for-patches',sequence:[],timerCount:0,repeatedLoadCount:0,finalScoreApplyCount:0,startedAt:new Date().toISOString(),completedAt:null,error:null};
let qualityReadyResolved=false,resolveQualityReady;
window.UFC_OPPONENT_QUALITY_READY=new Promise(resolve=>{resolveQualityReady=resolve;});
window.UFC_RESOLVE_OPPONENT_QUALITY_READY=detail=>{if(qualityReadyResolved)return;qualityReadyResolved=true;state.opponentQualityReadyDetail=detail||null;resolveQualityReady(detail||null);};
window.UFC_SCORING_PIPELINE=state;document.documentElement.setAttribute('data-scoring-pipeline','waiting');
const cache=(path,name)=>`${path}?v=${name}`,record=label=>state.sequence.push(label);
function load(src,attr){return new Promise(resolve=>{if(!src){resolve({src,skipped:true,reason:'missing-version'});return;}const existing=document.querySelector(`script[${attr}]`);if(existing){resolve({src,skipped:true,reason:'already-loaded'});return;}const script=document.createElement('script');script.src=src;script.setAttribute(attr,'true');script.onload=()=>resolve({src,skipped:false,loaded:true});script.onerror=()=>resolve({src,skipped:false,loaded:false,error:'load-failed'});document.body.appendChild(script);});}
async function loadStep(label,src,attr){const result=await load(src,attr);record(`${label}:${result.skipped?'existing':result.loaded?'loaded':'failed'}`);return result;}
function renderOnce(){if(typeof window.refresh==='function'){try{window.refresh();}catch(e){state.renderError=String(e?.message||e);}}}
function patchesReady(){if(window.UFC_RANKING_DATA_PATCHES_READY)return window.UFC_RANKING_DATA_PATCHES_READY;return new Promise(resolve=>window.addEventListener('ufc-ranking-data-patches-ready',event=>resolve(event.detail||window.UFC_PHASE2_DATA_STATUS||null),{once:true}));}
function opponentQualityReady(){return window.UFC_OPPONENT_QUALITY_LIVE?Promise.resolve(window.UFC_OPPONENT_QUALITY_LIVE):window.UFC_OPPONENT_QUALITY_READY;}
async function run(){try{
await patchesReady();record('ranking-data-patches:ready');
await loadStep('loss-context-mismatch-audit',cache('assets/data/loss-context-mismatch-audit.js',`loss-context-mismatch-audit-${v.lossContextMismatchAudit}`),'data-loss-context-mismatch-audit');
state.lossContextMismatchAudit=window.UFC_LOSS_CONTEXT_MISMATCH_AUDIT||null;
await loadStep('canonical-longevity-recalculation',cache('assets/data/longevity-canonical-recalculation.js',`longevity-canonical-recalculation-${v.longevityCanonicalRecalculation}`),'data-canonical-longevity-recalculation');
state.canonicalLongevityRecalculation=window.UFC_CANONICAL_LONGEVITY_RECALCULATION||null;
await loadStep('canonical-prime-records',cache('assets/data/canonical-prime-records.js',`canonical-prime-records-${v.canonicalPrimeRecords}`),'data-canonical-prime-records');
state.canonicalPrimeRecords=window.UFC_CANONICAL_PRIME_RECORDS||null;
state.status='waiting-for-quality';await opponentQualityReady();record('opponent-quality:ready');
state.status='loading-prime';
await loadStep('prime-round-control',cache('assets/data/prime-round-control-audit.js',`prime-round-control-audit-${v.primeRoundControlAudit}`),'data-prime-round-control-audit');
await loadStep('prime-ledgers',cache('assets/data/prime-dominance-ledgers.js',`prime-dominance-ledgers-${v.primeDominanceLedgers}`),'data-prime-dominance-ledgers');
await loadStep('prime-shadow',cache('assets/data/prime-dominance-shadow-model.js',`prime-dominance-shadow-model-${v.primeDominanceShadowModel}`),'data-prime-dominance-shadow-model');
await loadStep('prime-audit-batch-seven',cache('assets/data/prime-dominance-audit-batch-seven.js',`prime-dominance-audit-batch-seven-${v.primeDominanceAuditBatchSeven}`),'data-prime-dominance-audit-batch-seven');
await loadStep('prime-audit-batch-ten',cache('assets/data/prime-dominance-audit-batch-ten.js',`prime-dominance-audit-batch-ten-${v.primeDominanceAuditBatchTen}`),'data-prime-dominance-audit-batch-ten');
await loadStep('prime-live',cache('assets/data/prime-dominance-live-promoter.js',`prime-dominance-live-promoter-${v.primeDominanceLivePromoter}`),'data-prime-dominance-live-promoter');
await loadStep('prime-copy',cache('assets/js/prime-dominance-copy-polish.js',`prime-dominance-copy-polish-${v.primeDominanceCopyPolish}`),'data-prime-dominance-copy-polish');
state.status='loading-longevity';
await loadStep('fighter-era-ledgers',cache('assets/data/fighter-era-ledgers.js',`fighter-era-ledgers-${v.fighterEraLedgers}`),'data-fighter-era-ledgers');
await loadStep('longevity-shadow',cache('assets/data/longevity-shadow-scorer.js',`longevity-shadow-scorer-${v.longevityShadowScorer}`),'data-longevity-shadow-scorer');
await loadStep('longevity-live',cache('assets/data/longevity-live-promoter.js',`longevity-live-promoter-${v.longevityLivePromoter}`),'data-longevity-live-promoter');
await loadStep('fighter-era-window-audit',cache('assets/data/fighter-era-window-audit.js',`fighter-era-window-audit-${v.fighterEraWindowAudit}`),'data-fighter-era-window-audit');
state.fighterEraWindowAudit=window.UFC_FIGHTER_ERA_WINDOW_AUDIT||null;
state.status='loading-apex';
await loadStep('apex-corrections',cache('assets/data/apex-peak-score-corrections.js',`apex-peak-score-corrections-${v.apexPeakCorrections}`),'data-apex-peak-score-corrections');
await loadStep('apex-component-audit',cache('assets/data/apex-peak-component-audit.js',`apex-peak-component-audit-${v.apexPeakComponentAudit}`),'data-apex-peak-component-audit');
await loadStep('apex-live',cache('assets/data/apex-peak-live-bonus.js',`apex-peak-live-bonus-${v.apexPeakLiveBonus}`),'data-apex-peak-live-bonus');
await loadStep('apex-dricus-audit',cache('assets/data/apex-peak-audit-dricus.js',`apex-peak-audit-dricus-${v.apexPeakDricusAudit}`),'data-apex-peak-dricus-audit');
state.status='finalizing';
await loadStep('final-score-engine',cache('assets/js/final-score-engine.js',`final-score-engine-${v.finalScoreEngine}`),'data-final-score-engine');
if(!window.UFC_FINAL_SCORE_ENGINE?.apply)throw new Error('Final score engine did not load.');
const finalResult=window.UFC_FINAL_SCORE_ENGINE.apply('deterministic-scoring-pipeline');state.finalScoreApplyCount=window.UFC_FINAL_SCORE_ENGINE.applyCount||0;state.finalScoreResult=finalResult||null;record('final-score-engine:applied');
await loadStep('category-percentile-tiers',cache('assets/js/category-percentile-tiers.js',`category-percentile-tiers-${v.categoryPercentileTiers}`),'data-category-percentile-tiers');
renderOnce();record('ui:refreshed-once');
state.status='ready';state.completedAt=new Date().toISOString();state.fighterCount=[...(window.RANKING_DATA?.men||[]),...(window.RANKING_DATA?.women||[])].length;document.documentElement.setAttribute('data-scoring-pipeline','ready');window.dispatchEvent(new CustomEvent('ufc-scoring-pipeline-ready',{detail:state}));return state;
}catch(error){state.status='error';state.error=String(error?.stack||error?.message||error);state.completedAt=new Date().toISOString();document.documentElement.setAttribute('data-scoring-pipeline','error');window.dispatchEvent(new CustomEvent('ufc-scoring-pipeline-error',{detail:state}));throw error;}}
window.UFC_SCORING_PIPELINE_READY=run();
})();
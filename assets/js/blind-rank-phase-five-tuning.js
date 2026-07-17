(function(root){
  'use strict';

  const VERSION='blind-rank-phase-five-tuning-20260717a';
  const DEFAULT_GAMES=25000;
  const MAX_GAMES=100000;
  const STORAGE_KEY='ufc-blind-rank-phase-five-last-report';
  const api={version:VERSION,phase:5,defaultGames:DEFAULT_GAMES,lastReport:null,run,runAll,summary,compare};
  root.UFC_BLIND_RANK_PHASE_FIVE=api;
  root.document?.documentElement?.setAttribute('data-blind-rank-phase-five',VERSION);

  function count(value){return Math.max(1,Math.min(MAX_GAMES,Math.floor(Number(value)||DEFAULT_GAMES)));}
  function round(value,digits=2){const factor=10**digits;return Math.round((Number(value)||0)*factor)/factor;}
  function packSummary(result){
    const emergency=(result?.fallbackBehavior?.emergency||0)+(result?.fallbackBehavior?.['repeat-break-emergency']||0);
    const zeroWindow=result?.repeatProtection?.gamesByUsedWindow?.['0'];
    return {
      packId:result.packId,
      packName:result.packName,
      categoryId:result.categoryId,
      status:result.status,
      passed:result.passed,
      games:result.gamesCompleted,
      poolSize:result.poolSize,
      tiers:Object.fromEntries(Object.entries(result.tierRates||{}).map(([tier,row])=>[tier,row.poolCount])),
      badGamePct:result.badGameFrequency?.actualPct??null,
      fallbackPct:result.fallbackBehavior?.fallbackSelectionPct??null,
      emergencyFallbackPct:result.gamesCompleted?round((emergency/(result.gamesCompleted*5))*100,2):null,
      repeatProtectionExhaustedPct:zeroWindow?.pct??null,
      duplicateFighterGames:result.lineupUniqueness?.duplicateFighterGames||0,
      immediateDuplicateLineups:result.repeatProtection?.immediateDuplicateLineups||0,
      brokenGames:result.lineupUniqueness?.brokenGames||0,
      overexposed:(result.fighterExposure?.overexposed||[]).map(row=>({name:row.name,tier:row.tier,exposureIndex:row.exposureIndex,appearanceRatePct:row.appearanceRatePct})),
      warnings:[...(result.warnings||[])]
    };
  }
  function run(packId,games=DEFAULT_GAMES){
    const game=root.UFC_BLIND_RANK;
    if(!game?.simulate)throw new Error('Blind Rank engine is not ready.');
    return game.simulate(packId,count(games));
  }
  function runAll(games=DEFAULT_GAMES,options={}){
    const game=root.UFC_BLIND_RANK;
    if(!game?.simulate)throw new Error('Blind Rank engine is not ready.');
    const requested=count(games);
    const startedAt=Date.now();
    const results=game.packs.map(pack=>run(pack.id,requested));
    const report={
      version:VERSION,
      generatedAt:new Date().toISOString(),
      gamesPerPack:requested,
      expansionEnabled:root.UFC_BLIND_RANK_EXPANSION_BATCH_ONE?.enabled!==false,
      expansionVersion:root.UFC_BLIND_RANK_EXPANSION_BATCH_ONE?.version||null,
      expansionFighters:[...(root.UFC_BLIND_RANK_EXPANSION_BATCH_ONE?.names||[])],
      rosterSize:root.UFC_PLAY_DATA?.poolFor?.('blind-rank')?.length||null,
      ledgerAudit:root.UFC_BLIND_RANK_CATEGORY_RATINGS?.audit||null,
      poolAudit:root.UFC_BLIND_RANK_POOL_AUDIT?.report||null,
      durationMs:Date.now()-startedAt,
      packs:results.map(packSummary),
      raw:options.includeRaw===false?undefined:results
    };
    report.passed=report.packs.every(pack=>pack.passed);
    report.needsAttention=report.packs.filter(pack=>pack.status!=='passed'||pack.warnings.length||pack.emergencyFallbackPct>2||pack.repeatProtectionExhaustedPct>10).map(pack=>pack.packId);
    api.lastReport=report;
    try{root.sessionStorage?.setItem(STORAGE_KEY,JSON.stringify({...report,raw:undefined,poolAudit:undefined,ledgerAudit:undefined}));}catch(_error){}
    root.document?.documentElement?.setAttribute('data-blind-rank-phase-five-audit',report.passed?'passed':'failed');
    root.dispatchEvent?.(new CustomEvent('ufc-blind-rank-phase-five-audit-ready',{detail:{version:VERSION,report}}));
    return report;
  }
  function summary(report=api.lastReport){return report?.packs||[];}
  function compare(before,after){
    const beforeMap=Object.fromEntries((before?.packs||[]).map(pack=>[pack.packId,pack]));
    return (after?.packs||[]).map(pack=>{
      const old=beforeMap[pack.packId]||{};
      return {
        packId:pack.packId,
        poolChange:(pack.poolSize||0)-(old.poolSize||0),
        fallbackChange:round((pack.fallbackPct||0)-(old.fallbackPct||0),2),
        emergencyChange:round((pack.emergencyFallbackPct||0)-(old.emergencyFallbackPct||0),2),
        exhaustedRepeatChange:round((pack.repeatProtectionExhaustedPct||0)-(old.repeatProtectionExhaustedPct||0),2),
        badGameChange:round((pack.badGamePct||0)-(old.badGamePct||0),2)
      };
    });
  }

  const params=new URLSearchParams(root.location?.search||'');
  if(params.get('blindRankAudit')==='1'||params.get('auditBlindRank')==='1'){
    const games=count(params.get('blindRankGames')||DEFAULT_GAMES);
    const start=()=>root.setTimeout?.(()=>{
      try{runAll(games);}catch(error){root.console?.error?.('Blind Rank Phase 5 audit failed',error);}
    },50);
    if(root.UFC_BLIND_RANK)start();
    else root.addEventListener?.('ufc-blind-rank-ready',start,{once:true});
  }
})(typeof window!=='undefined'?window:globalThis);

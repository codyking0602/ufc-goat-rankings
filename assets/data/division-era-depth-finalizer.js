// Canonical runtime scoring coordinator.
// Loss Context and Era Depth own only their modifiers; final-score-engine.js owns totals, ranks, breakdowns, and OVR.
(function installFinalScoreOwnershipGuard(){
  'use strict';
  const GUARD_VERSION='final-score-ownership-guard-20260713a';
  let engineValue=window.UFC_FINAL_SCORE_ENGINE;

  function correctionsReady(){
    return window.UFC_APPROVED_PRIME_DOMINANCE_CORRECTIONS?.applied===true&&window.UFC_QUALITY_WINS_AUDIT_CRUZ_ILIA?.applied===true;
  }
  function notify(){
    setTimeout(()=>window.dispatchEvent(new CustomEvent('ufc-scoring-category-corrections-ready',{detail:{version:GUARD_VERSION,ready:correctionsReady()}})),0);
  }
  function wrap(engine){
    if(!engine?.apply||engine.__singleOwnerGuardVersion===GUARD_VERSION)return engine;
    const original=engine.apply.bind(engine);
    engine.apply=function(reason='manual'){
      if(reason==='scoring-runtime-coordinator'&&correctionsReady())return original(reason);
      engine.deferredCount=Number(engine.deferredCount||0)+1;
      const result={version:engine.version,applied:true,deferred:true,reason,applyCount:engine.applyCount||0,deferredCount:engine.deferredCount,owner:'final-score-engine.js',waitingFor:correctionsReady()?['scoring-runtime-coordinator']:['approved-prime-corrections','quality-wins-audit'],appliedAt:new Date().toISOString()};
      engine.latest=result;
      notify();
      return result;
    };
    engine.__singleOwnerGuardVersion=GUARD_VERSION;
    engine.__unguardedApply=original;
    return engine;
  }

  try{
    Object.defineProperty(window,'UFC_FINAL_SCORE_ENGINE',{
      configurable:true,
      enumerable:true,
      get(){return engineValue;},
      set(value){engineValue=wrap(value);}
    });
    if(engineValue)engineValue=wrap(engineValue);
    window.UFC_FINAL_SCORE_OWNERSHIP_GUARD={version:GUARD_VERSION,installed:true,overallOwner:'final-score-engine.js',coordinatorReason:'scoring-runtime-coordinator'};
  }catch(error){
    window.UFC_FINAL_SCORE_OWNERSHIP_GUARD={version:GUARD_VERSION,installed:false,error:String(error?.message||error)};
  }
})();

(function(){
  'use strict';

  const VERSION='scoring-runtime-coordinator-20260713a-stage-two-owner';
  const COMPAT_REPAIR_VERSION='dynamic-roster-scoring-repair-20260712a';
  const COMPAT_LOSS_VERSION='loss-context-hybrid-live-dynamic-roster-20260712a';
  const COMPAT_DEPTH_VERSION='division-era-depth-live-dynamic-roster-20260712a';
  const SCORE_OVERRIDE_FIELDS=['overallOvr','allTimeRank','rankLabel','totalScore','rawScore','rank','baseScore','penalty','lossPenalty','lossContext','eraDepthAdjustment','lossContextHybrid','divisionEraDepth'];
  const CATEGORY_OVERRIDE_FIELDS=['ovr','rank','score','value'];
  let finalized=false;

  const key=name=>String(name||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  function rows(data){return [...(data?.men||[]),...(data?.women||[])].filter(row=>row?.fighter);}

  function stripScoreDerivedOverrides(){
    let stripped=0;
    Object.values(window.DISPLAY_OVERRIDES||{}).forEach(override=>{
      if(!override||typeof override!=='object')return;
      SCORE_OVERRIDE_FIELDS.forEach(field=>{
        if(Object.prototype.hasOwnProperty.call(override,field)){delete override[field];stripped+=1;}
      });
      Object.values(override.categories||{}).forEach(value=>{
        if(!value||typeof value!=='object')return;
        CATEGORY_OVERRIDE_FIELDS.forEach(field=>{
          if(Object.prototype.hasOwnProperty.call(value,field)){delete value[field];stripped+=1;}
        });
      });
    });
    return stripped;
  }

  function scoreDerivedOverrideFields(){
    const issues=[];
    Object.entries(window.DISPLAY_OVERRIDES||{}).forEach(([fighter,override])=>{
      if(!override||typeof override!=='object')return;
      SCORE_OVERRIDE_FIELDS.forEach(field=>{
        if(Object.prototype.hasOwnProperty.call(override,field))issues.push({fighter,field});
      });
      Object.entries(override.categories||{}).forEach(([category,value])=>{
        if(!value||typeof value!=='object')return;
        CATEGORY_OVERRIDE_FIELDS.forEach(field=>{
          if(Object.prototype.hasOwnProperty.call(value,field))issues.push({fighter,field:`categories.${category}.${field}`});
        });
      });
    });
    return issues;
  }

  function completeLiveReports(data,boardRows){
    const byKey=new Map(boardRows.map(row=>[key(row.fighter),row]));
    const loss=window.UFC_LOSS_CONTEXT_HYBRID_LIVE||{};
    const depth=window.UFC_DIVISION_ERA_DEPTH_LIVE||{};

    window.UFC_LOSS_CONTEXT_HYBRID_LIVE={
      ...loss,
      version:COMPAT_LOSS_VERSION,
      applied:true,
      finalizedBy:VERSION,
      results:boardRows.map(row=>({
        fighter:row.fighter,
        board:(data.women||[]).includes(row)?'women':'men',
        rank:row.rank,
        totalScore:row.totalScore,
        penalty:row.penalty,
        overallOvr:row.overallOvr,
        lossContextHybrid:row.lossContextHybrid
      })),
      entryFor:fighter=>byKey.get(key(fighter))||null
    };

    window.UFC_DIVISION_ERA_DEPTH_LIVE={
      ...depth,
      version:COMPAT_DEPTH_VERSION,
      applied:true,
      finalizedBy:VERSION,
      finalizedAfterPipeline:true,
      results:boardRows.map(row=>({
        fighter:row.fighter,
        board:(data.women||[]).includes(row)?'women':'men',
        rank:row.rank,
        preEraDepthTotalScore:row.preEraDepthTotalScore,
        totalScore:row.totalScore,
        eraDepthAdjustment:row.eraDepthAdjustment,
        overallOvr:row.overallOvr,
        divisionEraDepth:row.divisionEraDepth
      }))
    };
  }

  function finalize(){
    if(finalized)return true;
    const data=window.RANKING_DATA;
    const engine=window.UFC_FINAL_SCORE_ENGINE;
    const pipeline=window.UFC_SCORING_PIPELINE;
    const loss=window.UFC_LOSS_CONTEXT_HYBRID_LIVE;
    const depth=window.UFC_DIVISION_ERA_DEPTH_LIVE;
    const primeCorrections=window.UFC_APPROVED_PRIME_DOMINANCE_CORRECTIONS;
    const qualityCorrections=window.UFC_QUALITY_WINS_AUDIT_CRUZ_ILIA;
    if(!data||!engine?.apply||pipeline?.status!=='ready'||loss?.applied!==true||depth?.applied!==true||primeCorrections?.applied!==true||qualityCorrections?.applied!==true)return false;

    const boardRows=rows(data);
    if(!boardRows.length||Number(loss.rosterCount)!==boardRows.length||Number(depth.rosterCount)!==boardRows.length)return false;

    const result=engine.apply('scoring-runtime-coordinator');
    if(!result?.applied||result?.deferred)return false;

    pipeline.finalScoreApplyCount=engine.applyCount||0;
    pipeline.finalScoreResult=result;
    pipeline.overallScoreOwner='final-score-engine.js';
    pipeline.runtimeCoordinatorVersion=VERSION;
    if(Array.isArray(pipeline.sequence)&&!pipeline.sequence.includes('runtime-coordinator:final-score-engine-applied'))pipeline.sequence.push('runtime-coordinator:final-score-engine-applied');

    completeLiveReports(data,boardRows);

    if(typeof window.refresh==='function')window.refresh();
    if(typeof window.renderCategories==='function')window.renderCategories();
    if(window.UFC_HOME_POLISH?.refreshHero)window.UFC_HOME_POLISH.refreshHero();
    if(window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER?.render)window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER.render();
    const postRenderStrippedOverrideFields=stripScoreDerivedOverrides();

    const scoreMismatches=boardRows.filter(row=>Math.abs(num(row.totalScore)-num(engine.scoreBreakdown(row).totalScore))>0.011).map(row=>row.fighter);
    const ownershipMismatches=boardRows.filter(row=>row.overallScoreOwner!=='final-score-engine.js'||row.finalScoreEngineVersion!==engine.version).map(row=>row.fighter);
    const overrideIssues=scoreDerivedOverrideFields();
    const rankIssues=[];
    for(const [boardName,board] of [['men',data.men||[]],['women',data.women||[]]]){
      board.forEach((row,index)=>{if(Number(row.rank)!==index+1)rankIssues.push({board:boardName,fighter:row.fighter,expected:index+1,actual:row.rank});});
    }
    const byKey=new Map(boardRows.map(row=>[key(row.fighter),row]));
    const gaethje=byKey.get(key('Justin Gaethje'))||null;
    const dricus=byKey.get(key('Dricus du Plessis'))||null;
    const applied=scoreMismatches.length===0&&ownershipMismatches.length===0&&overrideIssues.length===0&&rankIssues.length===0&&engine.applyCount===1;

    const compatibilityReport={
      version:COMPAT_REPAIR_VERSION,
      applied,
      applyCount:engine.applyCount,
      mode:'compatibility-report-only-stage-two',
      rosterCount:boardRows.length,
      hybridScoredCount:loss.promotedCount,
      empiricalEraDepthCount:depth.promotedCount,
      canonicalEraDepthExtensions:[],
      missingHybrid:[],
      missingDepth:[],
      scoreMismatches,
      ownershipMismatches,
      overrideIssues,
      rankIssues,
      postRenderStrippedOverrideFields,
      anchors:{
        justinGaethje:gaethje?{rank:gaethje.rank,totalScore:gaethje.totalScore,penalty:gaethje.penalty,eraDepthAdjustment:gaethje.eraDepthAdjustment,overallOvr:gaethje.overallOvr}:null,
        dricusDuPlessis:dricus?{rank:dricus.rank,totalScore:dricus.totalScore,penalty:dricus.penalty,eraDepthAdjustment:dricus.eraDepthAdjustment,overallOvr:dricus.overallOvr}:null
      },
      gaethjeAheadOfDricus:Boolean(gaethje&&dricus&&num(gaethje.rank)<num(dricus.rank)),
      finalScoreEngineVersion:engine.version,
      runtimeCoordinatorVersion:VERSION,
      mutatesScores:false,
      verifiedAt:new Date().toISOString()
    };
    window.UFC_DYNAMIC_ROSTER_SCORING_REPAIR=compatibilityReport;

    const report={
      version:VERSION,
      applied,
      status:applied?'ready':'mismatch',
      overallOwner:'final-score-engine.js',
      modifierOwners:{lossContext:'loss-context-hybrid-live.js',eraDepth:'division-era-depth-live.js'},
      rosterCount:boardRows.length,
      finalScoreApplyCount:engine.applyCount,
      finalScoreEngineVersion:engine.version,
      scoreMismatches,
      ownershipMismatches,
      scoreDerivedOverrideIssues:overrideIssues,
      postRenderStrippedOverrideFields,
      rankIssues,
      compatibilityRepairVersion:COMPAT_REPAIR_VERSION,
      finalizedAt:new Date().toISOString()
    };

    data.meta=data.meta||{};
    data.meta.scoringRuntimeCoordinator=report;
    data.meta.lossContextHybridLive={...(data.meta.lossContextHybridLive||{}),version:COMPAT_LOSS_VERSION,applied:true,finalizedBy:VERSION};
    data.meta.divisionEraDepthLive={...(data.meta.divisionEraDepthLive||{}),version:COMPAT_DEPTH_VERSION,applied:true,finalizedAfterPipeline:true,finalizedBy:VERSION};
    window.UFC_SCORING_RUNTIME_COORDINATOR=report;
    window.UFC_DIVISION_ERA_DEPTH_FINALIZER={version:VERSION,applied,status:report.status,live:window.UFC_DIVISION_ERA_DEPTH_LIVE,finalizedAt:report.finalizedAt};

    document.documentElement.setAttribute('data-scoring-runtime-coordinator',`${VERSION}-${boardRows.length}-${applied?'ready':'mismatch'}`);
    document.documentElement.setAttribute('data-dynamic-roster-scoring-repair',`${COMPAT_REPAIR_VERSION}-${boardRows.length}-${applied?'ready':'mismatch'}`);
    document.documentElement.setAttribute('data-loss-context-hybrid-live',`${COMPAT_LOSS_VERSION}-${boardRows.length}-${loss.mismatchCount||0}`);
    document.documentElement.setAttribute('data-division-era-depth-live',`${COMPAT_DEPTH_VERSION}-${boardRows.length}-${depth.mismatchCount||0}`);

    finalized=applied;
    window.dispatchEvent(new CustomEvent('ufc-scoring-runtime-coordinator-ready',{detail:report}));
    window.dispatchEvent(new CustomEvent('ufc-dynamic-roster-scoring-repaired',{detail:compatibilityReport}));
    window.dispatchEvent(new CustomEvent('ufc-division-era-depth-finalized',{detail:window.UFC_DIVISION_ERA_DEPTH_LIVE}));
    return finalized;
  }

  function attempt(){
    if(finalize())return;
    window.UFC_SCORING_RUNTIME_COORDINATOR={version:VERSION,applied:false,status:'waiting-for-pipeline-modifiers-and-category-corrections'};
  }

  window.UFC_SCORING_RUNTIME_COORDINATOR={version:VERSION,applied:false,status:'waiting-for-pipeline-modifiers-and-category-corrections'};
  window.UFC_DIVISION_ERA_DEPTH_FINALIZER={version:VERSION,applied:false,status:'waiting-for-pipeline-modifiers-and-category-corrections'};
  ['ufc-scoring-pipeline-ready','ufc-loss-context-hybrid-live-ready','ufc-division-era-depth-live-ready','ufc-scoring-category-corrections-ready'].forEach(eventName=>window.addEventListener(eventName,attempt));
  [0,50,250,750,1500,3000,5000,8000].forEach(delay=>setTimeout(attempt,delay));
})();

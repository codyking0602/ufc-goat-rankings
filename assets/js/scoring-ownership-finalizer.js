// Stage 2 scoring ownership finalizer.
// Enforces a copy-only display boundary and gives the canonical scoring engine sole score authority.
(function(){
  'use strict';
  const VERSION='scoring-ownership-finalizer-20260713e-evidence-ready';
  const EXPECTED_ROSTER=72;
  const STARTED_AT=Date.now();
  const MIN_SETTLE_MS=10000;
  const HARD_STOP_MS=22000;
  const SCORE_FIELDS=['championship','opponentQuality','primeDominance','longevity','apexPeak','penalty','eraDepthAdjustment','totalScore','rawScore','rank','overallOvr'];
  const DISPLAY_SCORE_FIELDS=[
    ...SCORE_FIELDS,'allTimeRank','rankLabel','baseScore','preEraDepthTotalScore',
    'lossPenalty','lossContext','apexPeakBonus','lossContextHybrid','divisionEraDepth'
  ];
  const NESTED_SCORE_FIELDS=[
    ...DISPLAY_SCORE_FIELDS,'championshipScore','opponentQualityScore','primeDominanceScore','longevityScore'
  ];
  const CATEGORY_SCORE_FIELDS=['ovr','rank','score','value'];
  const DISPLAY_SCORE_SET=new Set(DISPLAY_SCORE_FIELDS);
  const NESTED_SCORE_SET=new Set(NESTED_SCORE_FIELDS);
  const CATEGORY_SCORE_SET=new Set(CATEGORY_SCORE_FIELDS);
  const protectedNames=new Set();
  const proxyCache=new WeakMap();
  let finalized=false;
  let intervalId=null;
  let attemptCount=0;
  let stableRuns=0;
  let engineApplied=false;
  let engineResult=null;

  const key=name=>String(name||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const boards=data=>[...(data?.men||[]),...(data?.women||[])].filter(row=>row?.fighter);
  const isObject=value=>Boolean(value)&&typeof value==='object'&&!Array.isArray(value);

  function blockedProperty(property,set){return typeof property==='string'&&set.has(property);}
  function copyAllowed(source,blocked){
    const target={};
    if(!isObject(source))return target;
    Object.entries(source).forEach(([property,value])=>{if(!blocked.has(property))target[property]=value;});
    return target;
  }
  function wrapFlatObject(value,blocked){
    if(!isObject(value))return {};
    if(proxyCache.has(value))return proxyCache.get(value);
    const target=copyAllowed(value,blocked);
    const proxy=new Proxy(target,{
      set(object,property,next){if(blockedProperty(property,blocked))return true;object[property]=next;return true;},
      defineProperty(object,property,descriptor){if(blockedProperty(property,blocked))return true;Object.defineProperty(object,property,descriptor);return true;}
    });
    proxyCache.set(value,proxy);
    proxyCache.set(target,proxy);
    return proxy;
  }
  function wrapCategories(value){
    if(!isObject(value))return {};
    if(proxyCache.has(value))return proxyCache.get(value);
    const target={};
    Object.entries(value).forEach(([category,entry])=>{target[category]=wrapFlatObject(entry,CATEGORY_SCORE_SET);});
    const proxy=new Proxy(target,{
      set(object,property,next){object[property]=wrapFlatObject(next,CATEGORY_SCORE_SET);return true;},
      defineProperty(object,property,descriptor){
        const next={...descriptor,value:wrapFlatObject(descriptor?.value,CATEGORY_SCORE_SET)};
        Object.defineProperty(object,property,next);
        return true;
      }
    });
    proxyCache.set(value,proxy);
    proxyCache.set(target,proxy);
    return proxy;
  }
  function wrapOverride(value){
    if(!isObject(value))value={};
    if(proxyCache.has(value))return proxyCache.get(value);
    const target={};
    Object.entries(value).forEach(([property,next])=>{
      if(DISPLAY_SCORE_SET.has(property))return;
      if(property==='snapshotStats'||property==='packetProfileStats')target[property]=wrapFlatObject(next,NESTED_SCORE_SET);
      else if(property==='categories')target[property]=wrapCategories(next);
      else target[property]=next;
    });
    const proxy=new Proxy(target,{
      set(object,property,next){
        if(blockedProperty(property,DISPLAY_SCORE_SET))return true;
        if(property==='snapshotStats'||property==='packetProfileStats')object[property]=wrapFlatObject(next,NESTED_SCORE_SET);
        else if(property==='categories')object[property]=wrapCategories(next);
        else object[property]=next;
        return true;
      },
      defineProperty(object,property,descriptor){
        if(blockedProperty(property,DISPLAY_SCORE_SET))return true;
        let value=descriptor?.value;
        if(property==='snapshotStats'||property==='packetProfileStats')value=wrapFlatObject(value,NESTED_SCORE_SET);
        else if(property==='categories')value=wrapCategories(value);
        Object.defineProperty(object,property,{...descriptor,value});
        return true;
      }
    });
    proxyCache.set(value,proxy);
    proxyCache.set(target,proxy);
    return proxy;
  }
  function rosterNames(){
    const data=window.RANKING_DATA||{};
    return [...new Set([
      ...Object.keys(window.DISPLAY_OVERRIDES||{}),
      ...(data.men||[]).map(row=>row?.fighter),
      ...(data.women||[]).map(row=>row?.fighter),
      ...(data.fighters||[]).map(row=>row?.fighter)
    ].filter(Boolean))];
  }
  function protectDisplayOverride(name){
    const overrides=window.DISPLAY_OVERRIDES;
    if(!overrides||!name||protectedNames.has(name))return false;
    let current=wrapOverride(overrides[name]||{});
    Object.defineProperty(overrides,name,{
      configurable:true,
      enumerable:true,
      get(){return current;},
      set(value){current=wrapOverride(value);}
    });
    protectedNames.add(name);
    return true;
  }
  function installDisplayBoundary(){
    const overrides=window.DISPLAY_OVERRIDES;
    if(!overrides)return {installed:false,protectedCount:0};
    rosterNames().forEach(protectDisplayOverride);
    window.UFC_DISPLAY_OVERRIDE_OWNERSHIP_GUARD={
      version:VERSION,
      installed:true,
      role:'copy-only-display-boundary',
      protect:protectDisplayOverride,
      protectAll:installDisplayBoundary,
      protectedCount:protectedNames.size,
      forbiddenDirect:[...DISPLAY_SCORE_SET],
      forbiddenNested:[...NESTED_SCORE_SET],
      forbiddenCategory:[...CATEGORY_SCORE_SET]
    };
    document.documentElement.setAttribute('data-display-override-ownership-guard',`${VERSION}-${protectedNames.size}`);
    return {installed:true,protectedCount:protectedNames.size};
  }

  function stripFields(target,fields){
    if(!target||typeof target!=='object')return 0;
    let stripped=0;
    fields.forEach(field=>{if(Object.prototype.hasOwnProperty.call(target,field)){delete target[field];stripped+=1;}});
    return stripped;
  }
  function stripDisplayScoreFields(){
    installDisplayBoundary();
    let stripped=0;
    Object.values(window.DISPLAY_OVERRIDES||{}).forEach(override=>{
      if(!override||typeof override!=='object')return;
      stripped+=stripFields(override,DISPLAY_SCORE_FIELDS);
      ['snapshotStats','packetProfileStats'].forEach(container=>{stripped+=stripFields(override[container],NESTED_SCORE_FIELDS);});
      Object.values(override.categories||{}).forEach(category=>{stripped+=stripFields(category,CATEGORY_SCORE_FIELDS);});
    });
    return stripped;
  }
  function displayOverrideViolations(){
    const rows=[];
    Object.entries(window.DISPLAY_OVERRIDES||{}).forEach(([fighter,override])=>{
      if(!override||typeof override!=='object')return;
      const fields=[];
      DISPLAY_SCORE_FIELDS.forEach(field=>{if(Object.prototype.hasOwnProperty.call(override,field))fields.push(field);});
      ['snapshotStats','packetProfileStats'].forEach(container=>{
        const target=override[container];
        if(!target||typeof target!=='object')return;
        NESTED_SCORE_FIELDS.forEach(field=>{if(Object.prototype.hasOwnProperty.call(target,field))fields.push(`${container}.${field}`);});
      });
      Object.entries(override.categories||{}).forEach(([category,value])=>{
        if(!value||typeof value!=='object')return;
        CATEGORY_SCORE_FIELDS.forEach(field=>{if(Object.prototype.hasOwnProperty.call(value,field))fields.push(`categories.${category}.${field}`);});
      });
      if(fields.length)rows.push({fighter,fields});
    });
    return rows;
  }
  function compareScoreViolations(){
    const rows=[];
    Object.entries(window.COMPARE_PROFILES||{}).forEach(([fighter,profile])=>{
      if(!profile||typeof profile!=='object')return;
      const fields=DISPLAY_SCORE_FIELDS.filter(field=>Object.prototype.hasOwnProperty.call(profile,field));
      if(fields.length)rows.push({fighter,fields});
    });
    return rows;
  }
  function profileMismatches(data){
    const byKey=new Map(boards(data).map(row=>[key(row.fighter),row]));
    const mismatches=[];
    (data.fighters||[]).forEach(profile=>{
      const board=byKey.get(key(profile?.fighter));
      if(!board){mismatches.push({fighter:profile?.fighter||'Unknown',field:'missing-board-row'});return;}
      SCORE_FIELDS.forEach(field=>{if(Math.abs(num(profile[field])-num(board[field]))>0.001)mismatches.push({fighter:profile.fighter,field,board:board[field],profile:profile[field]});});
    });
    return mismatches;
  }
  function stripCompareScoreFields(){
    let stripped=0;
    Object.values(window.COMPARE_PROFILES||{}).forEach(profile=>{stripped+=stripFields(profile,DISPLAY_SCORE_FIELDS);});
    return stripped;
  }
  function annotateEvidenceModules(){
    const loss=window.UFC_LOSS_CONTEXT_HYBRID_LIVE;
    if(loss){loss.authoritativeScoreOwner='scoring-engine.js';loss.runtimeRole='evidence-and-detail-provider';loss.authoritativeScoreWrites=false;loss.scoringOwnershipFinalizerVersion=VERSION;}
    const depth=window.UFC_DIVISION_ERA_DEPTH_LIVE;
    if(depth){depth.authoritativeScoreOwner='scoring-engine.js';depth.runtimeRole='evidence-and-detail-provider';depth.authoritativeScoreWrites=false;depth.scoringOwnershipFinalizerVersion=VERSION;}
  }
  function publishWaiting(status,readiness={}){
    const elapsedMs=Date.now()-STARTED_AT;
    window.UFC_SCORING_OWNERSHIP_CONTRACT={version:VERSION,applied:false,status,attemptCount,elapsedMs,minimumSettleMs:MIN_SETTLE_MS,displayBoundary:installDisplayBoundary(),readiness};
    document.documentElement.setAttribute('data-scoring-ownership-contract',`${VERSION}-${status}`);
  }
  function finalize(){
    if(finalized)return true;
    attemptCount+=1;
    installDisplayBoundary();
    const data=window.RANKING_DATA;
    const engine=window.UFC_SCORING_ENGINE;
    const canonical=window.UFC_CANONICAL_SCORING_RECORDS;
    const legacyRepair=window.UFC_DYNAMIC_ROSTER_SCORING_REPAIR;
    const depthFinalizer=window.UFC_DIVISION_ERA_DEPTH_FINALIZER;
    const pipelineReady=window.UFC_SCORING_PIPELINE?.status==='ready';
    const elapsedMs=Date.now()-STARTED_AT;
    const boardRows=boards(data);
    const missingLossContextDetail=boardRows.filter(row=>!row.lossContextHybrid).map(row=>row.fighter);
    const missingEraDepthDetail=boardRows.filter(row=>!row.divisionEraDepth).map(row=>row.fighter);
    const evidenceReady=legacyRepair?.applied===true&&boardRows.length===EXPECTED_ROSTER&&missingLossContextDetail.length===0&&missingEraDepthDetail.length===0;
    if(!data||!engine?.apply||!canonical||!pipelineReady||!evidenceReady){
      publishWaiting('waiting',{
        data:Boolean(data),engine:Boolean(engine?.apply),canonical:Boolean(canonical),pipelineReady,
        dynamicRosterEvidence:Boolean(legacyRepair?.applied),depthFinalizerInformational:Boolean(depthFinalizer?.applied),
        rosterCount:boardRows.length,missingLossContextDetailCount:missingLossContextDetail.length,missingEraDepthDetailCount:missingEraDepthDetail.length
      });
      return false;
    }
    if(elapsedMs<MIN_SETTLE_MS){
      publishWaiting('settling',{data:true,engine:true,canonical:true,pipelineReady:true,dynamicRosterEvidence:true,rosterCount:boardRows.length,missingLossContextDetailCount:0,missingEraDepthDetailCount:0});
      return false;
    }
    if(!engineApplied){
      engineResult=engine.apply('stage2-scoring-ownership-finalizer');
      engineApplied=true;
      window.UFC_FINAL_SCORE_ENGINE=engine;
    }
    annotateEvidenceModules();
    const strippedDisplayFields=stripDisplayScoreFields();
    const strippedCompareFields=stripCompareScoreFields();
    const engineParity=engine.parityReport?.()||{passed:false,mismatches:[{field:'missing-engine-parity-report'}],missingCanonical:[]};
    const profiles=profileMismatches(data);
    const displayViolations=displayOverrideViolations();
    const compareViolations=compareScoreViolations();
    const wrongOwners=boardRows.filter(row=>row.scoreInputOwner!=='scoring-engine.js'||row.overallScoreOwner!=='scoring-engine.js').map(row=>({fighter:row.fighter,scoreInputOwner:row.scoreInputOwner,overallScoreOwner:row.overallScoreOwner}));
    const rosterCount=boardRows.length;
    const clean=Boolean(engineResult?.applied)&&rosterCount===EXPECTED_ROSTER&&engineParity.passed&&profiles.length===0&&displayViolations.length===0&&compareViolations.length===0&&wrongOwners.length===0&&missingLossContextDetail.length===0&&missingEraDepthDetail.length===0;
    const report={
      version:VERSION,applied:clean,status:clean?'clean':'blocked',attemptCount,elapsedMs,minimumSettleMs:MIN_SETTLE_MS,settled:true,
      mode:'single-authority-copy-boundary',rosterCount,expectedRosterCount:EXPECTED_ROSTER,
      owners:{canonicalScoreInputs:'assets/data/canonical-scoring-records.js',categoryScores:'assets/js/scoring-engine.js',modifiers:'assets/js/scoring-engine.js',totals:'assets/js/scoring-engine.js',ranks:'assets/js/scoring-engine.js',ovr:'assets/js/scoring-engine.js',profileScoreSync:'assets/js/scoring-engine.js',displayOverrides:'copy-only-guarded',compareProfiles:'narrative-only',lossContext:'evidence-and-detail-provider',divisionEraDepth:'evidence-and-detail-provider'},
      canonicalScoringRecordsVersion:canonical.version,canonicalSourceSha:canonical.sourceFighterDataSha256,
      finalScoreEngineVersion:engine.version,finalScoreEngineApplyCount:engine.applyCount,engineApplyResult:engineResult||null,engineParity,
      displayBoundary:installDisplayBoundary(),profileMismatchCount:profiles.length,profileMismatches:profiles,
      displayOverrideViolationCount:displayViolations.length,displayOverrideViolations:displayViolations,
      compareScoreViolationCount:compareViolations.length,compareScoreViolations:compareViolations,
      strippedDisplayFields,strippedCompareFields,
      missingLossContextDetailCount:missingLossContextDetail.length,missingLossContextDetail,
      missingEraDepthDetailCount:missingEraDepthDetail.length,missingEraDepthDetail,
      wrongOwnerCount:wrongOwners.length,wrongOwners,
      legacyModules:{dynamicRosterRepairVersion:legacyRepair?.version||null,divisionEraDepthFinalizerVersion:depthFinalizer?.version||null,retainedForEvidenceParity:true,scoreAuthority:false,depthFinalizerReadinessRequired:false},
      appliedAt:new Date().toISOString()
    };
    data.meta=data.meta||{};
    data.meta.scoringOwnershipContract={version:VERSION,applied:clean,status:report.status,owners:report.owners,canonicalSourceSha:report.canonicalSourceSha,finalScoreEngineVersion:report.finalScoreEngineVersion,appliedAt:report.appliedAt};
    window.UFC_SCORING_OWNERSHIP_CONTRACT=report;
    document.documentElement.setAttribute('data-scoring-ownership-contract',`${VERSION}-${report.status}-${rosterCount}`);
    if(clean)window.dispatchEvent(new CustomEvent('ufc-scoring-ownership-ready',{detail:report}));
    stableRuns=clean?stableRuns+1:0;
    finalized=stableRuns>=2;
    return finalized;
  }
  function attempt(){if(finalize()&&intervalId){clearInterval(intervalId);intervalId=null;}}

  installDisplayBoundary();
  ['ufc-scoring-pipeline-ready','ufc-dynamic-roster-scoring-repaired','ufc-division-era-depth-finalized','ufc-ranking-data-patches-ready'].forEach(eventName=>window.addEventListener(eventName,attempt));
  [0,100,500,1500,3000,5000,7500,9000,10000,11000,13000,16000].forEach(delay=>setTimeout(attempt,delay));
  intervalId=setInterval(attempt,500);
  setTimeout(()=>{attempt();if(intervalId){clearInterval(intervalId);intervalId=null;}},HARD_STOP_MS);
  window.UFC_SCORING_OWNERSHIP_CONTRACT={version:VERSION,applied:false,status:'waiting',attemptCount:0,elapsedMs:0,minimumSettleMs:MIN_SETTLE_MS,displayBoundary:installDisplayBoundary()};
})();
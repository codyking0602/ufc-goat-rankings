// Stage 2 scoring ownership finalizer.
// Converts the settled legacy pipeline into a single-authority runtime without changing scores.
(function(){
  'use strict';
  const VERSION='scoring-ownership-finalizer-20260713b-stage2';
  const EXPECTED_ROSTER=72;
  const SCORE_FIELDS=['championship','opponentQuality','primeDominance','longevity','apexPeak','penalty','eraDepthAdjustment','totalScore','rawScore','rank','overallOvr'];
  let finalized=false;
  let intervalId=null;
  let attemptCount=0;
  let stableRuns=0;

  const key=name=>String(name||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const round2=value=>Math.round((num(value)+Number.EPSILON)*100)/100;
  const boards=data=>[...(data?.men||[]),...(data?.women||[])].filter(row=>row?.fighter);

  function displayOverrideViolations(){
    const rows=[];
    Object.entries(window.DISPLAY_OVERRIDES||{}).forEach(([fighter,override])=>{
      if(!override||typeof override!=='object')return;
      const direct=SCORE_FIELDS.filter(field=>Object.prototype.hasOwnProperty.call(override,field));
      const nested=[];
      ['snapshotStats','packetProfileStats'].forEach(container=>{
        const target=override[container];
        if(!target||typeof target!=='object')return;
        SCORE_FIELDS.forEach(field=>{if(Object.prototype.hasOwnProperty.call(target,field))nested.push(`${container}.${field}`);});
      });
      if(direct.length||nested.length)rows.push({fighter,fields:[...direct,...nested]});
    });
    return rows;
  }

  function compareScoreViolations(){
    const rows=[];
    Object.entries(window.COMPARE_PROFILES||{}).forEach(([fighter,profile])=>{
      if(!profile||typeof profile!=='object')return;
      const fields=SCORE_FIELDS.filter(field=>Object.prototype.hasOwnProperty.call(profile,field));
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
      SCORE_FIELDS.forEach(field=>{
        if(Math.abs(num(profile[field])-num(board[field]))>0.001)mismatches.push({fighter:profile.fighter,field,board:board[field],profile:profile[field]});
      });
    });
    return mismatches;
  }

  function stripCompareScoreFields(){
    let stripped=0;
    Object.values(window.COMPARE_PROFILES||{}).forEach(profile=>{
      if(!profile||typeof profile!=='object')return;
      SCORE_FIELDS.forEach(field=>{if(Object.prototype.hasOwnProperty.call(profile,field)){delete profile[field];stripped+=1;}});
    });
    return stripped;
  }

  function annotateEvidenceModules(){
    const loss=window.UFC_LOSS_CONTEXT_HYBRID_LIVE;
    if(loss){
      loss.authoritativeScoreOwner='scoring-engine.js';
      loss.runtimeRole='evidence-and-detail-provider';
      loss.authoritativeScoreWrites=false;
      loss.scoringOwnershipFinalizerVersion=VERSION;
    }
    const depth=window.UFC_DIVISION_ERA_DEPTH_LIVE;
    if(depth){
      depth.authoritativeScoreOwner='scoring-engine.js';
      depth.runtimeRole='evidence-and-detail-provider';
      depth.authoritativeScoreWrites=false;
      depth.scoringOwnershipFinalizerVersion=VERSION;
    }
  }

  function finalize(){
    if(finalized)return true;
    attemptCount+=1;
    const data=window.RANKING_DATA;
    const engine=window.UFC_SCORING_ENGINE;
    const canonical=window.UFC_CANONICAL_SCORING_RECORDS;
    const legacyRepair=window.UFC_DYNAMIC_ROSTER_SCORING_REPAIR;
    const depthFinalizer=window.UFC_DIVISION_ERA_DEPTH_FINALIZER;
    const pipelineReady=window.UFC_SCORING_PIPELINE?.status==='ready';
    if(!data||!engine?.apply||!canonical||!pipelineReady){
      window.UFC_SCORING_OWNERSHIP_CONTRACT={version:VERSION,applied:false,status:'waiting',attemptCount,readiness:{data:Boolean(data),engine:Boolean(engine?.apply),canonical:Boolean(canonical),pipelineReady}};
      return false;
    }

    const result=engine.apply('stage2-scoring-ownership-finalizer');
    window.UFC_FINAL_SCORE_ENGINE=engine;
    annotateEvidenceModules();
    const strippedCompareFields=stripCompareScoreFields();

    const boardRows=boards(data);
    const engineParity=engine.parityReport?.()||{passed:false,mismatches:[{field:'missing-engine-parity-report'}],missingCanonical:[]};
    const profiles=profileMismatches(data);
    const displayViolations=displayOverrideViolations();
    const compareViolations=compareScoreViolations();
    const wrongOwners=boardRows.filter(row=>row.scoreInputOwner!=='scoring-engine.js'||row.overallScoreOwner!=='scoring-engine.js').map(row=>({fighter:row.fighter,scoreInputOwner:row.scoreInputOwner,overallScoreOwner:row.overallScoreOwner}));
    const missingLossContextDetail=boardRows.filter(row=>!row.lossContextHybrid).map(row=>row.fighter);
    const missingEraDepthDetail=boardRows.filter(row=>!row.divisionEraDepth).map(row=>row.fighter);
    const rosterCount=boardRows.length;
    const applied=Boolean(result?.applied)&&rosterCount===EXPECTED_ROSTER&&engineParity.passed&&profiles.length===0&&displayViolations.length===0&&compareViolations.length===0&&wrongOwners.length===0&&missingLossContextDetail.length===0&&missingEraDepthDetail.length===0;

    const report={
      version:VERSION,
      applied,
      status:applied?'clean':'blocked',
      attemptCount,
      mode:'single-authority-post-pipeline',
      rosterCount,
      expectedRosterCount:EXPECTED_ROSTER,
      owners:{
        canonicalScoreInputs:'assets/data/canonical-scoring-records.js',
        categoryScores:'assets/js/scoring-engine.js',
        modifiers:'assets/js/scoring-engine.js',
        totals:'assets/js/scoring-engine.js',
        ranks:'assets/js/scoring-engine.js',
        ovr:'assets/js/scoring-engine.js',
        profileScoreSync:'assets/js/scoring-engine.js',
        displayOverrides:'copy-only',
        compareProfiles:'narrative-only',
        lossContext:'evidence-and-detail-provider',
        divisionEraDepth:'evidence-and-detail-provider'
      },
      canonicalScoringRecordsVersion:canonical.version,
      canonicalSourceSha:canonical.sourceFighterDataSha256,
      finalScoreEngineVersion:engine.version,
      finalScoreEngineApplyCount:engine.applyCount,
      engineApplyResult:result||null,
      engineParity,
      profileMismatchCount:profiles.length,
      profileMismatches:profiles,
      displayOverrideViolationCount:displayViolations.length,
      displayOverrideViolations:displayViolations,
      compareScoreViolationCount:compareViolations.length,
      compareScoreViolations:compareViolations,
      strippedCompareFields,
      missingLossContextDetailCount:missingLossContextDetail.length,
      missingLossContextDetail,
      missingEraDepthDetailCount:missingEraDepthDetail.length,
      missingEraDepthDetail,
      wrongOwnerCount:wrongOwners.length,
      wrongOwners,
      legacyModules:{
        dynamicRosterRepairVersion:legacyRepair?.version||null,
        divisionEraDepthFinalizerVersion:depthFinalizer?.version||null,
        retainedForEvidenceParity:true,
        scoreAuthority:false
      },
      appliedAt:new Date().toISOString()
    };

    data.meta=data.meta||{};
    data.meta.scoringOwnershipContract={
      version:VERSION,
      applied,
      owners:report.owners,
      canonicalSourceSha:report.canonicalSourceSha,
      finalScoreEngineVersion:report.finalScoreEngineVersion,
      appliedAt:report.appliedAt
    };
    window.UFC_SCORING_OWNERSHIP_CONTRACT=report;
    document.documentElement.setAttribute('data-scoring-ownership-contract',`${VERSION}-${applied?'clean':'blocked'}-${rosterCount}`);
    window.dispatchEvent(new CustomEvent('ufc-scoring-ownership-ready',{detail:report}));
    stableRuns=applied?stableRuns+1:0;
    finalized=stableRuns>=3;
    return finalized;
  }

  function attempt(){
    if(finalize()&&intervalId){clearInterval(intervalId);intervalId=null;}
  }

  [
    'ufc-scoring-pipeline-ready',
    'ufc-dynamic-roster-scoring-repaired',
    'ufc-division-era-depth-finalized',
    'ufc-final-score-engine-applied',
    'ufc-ranking-data-patches-ready'
  ].forEach(eventName=>window.addEventListener(eventName,attempt));

  [0,100,500,1500,3000,5000,7500,9000].forEach(delay=>setTimeout(attempt,delay));
  intervalId=setInterval(attempt,500);
  setTimeout(()=>{if(intervalId){clearInterval(intervalId);intervalId=null;}},12000);

  window.UFC_SCORING_OWNERSHIP_CONTRACT={version:VERSION,applied:false,status:'waiting',attemptCount:0};
})();

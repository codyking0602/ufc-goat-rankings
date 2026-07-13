import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import process from 'node:process';

const baseUrl=process.env.UFC_APP_URL||'http://127.0.0.1:4173';
const outputPath=process.env.UFC_ERA_AUDIT_OUTPUT||'artifacts/division-era-depth-runtime-report.json';
const summaryPath=process.env.UFC_ERA_AUDIT_SUMMARY_OUTPUT||'artifacts/division-era-depth-runtime-summary.json';

await fs.mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const consoleErrors=[];
const pageErrors=[];
page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
page.on('pageerror',error=>pageErrors.push(String(error?.stack||error)));

try{
  await page.goto(baseUrl,{waitUntil:'domcontentloaded',timeout:60_000});
  await page.waitForFunction(
    ()=>window.UFC_SCORING_RUNTIME_COORDINATOR?.applied===true||window.UFC_SCORING_PIPELINE?.status==='error',
    null,
    {timeout:120_000,polling:100}
  );
  await page.waitForTimeout(300);

  const result=await page.evaluate(async()=>{
    const clone=value=>JSON.parse(JSON.stringify(value??null));
    const key=name=>String(name||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
    const data=window.RANKING_DATA||{};
    const shadow=clone(window.UFC_DIVISION_ERA_DEPTH_SHADOW);
    const audit=clone(window.UFC_DIVISION_ERA_DEPTH_AUDIT);
    const live=clone(window.UFC_DIVISION_ERA_DEPTH_LIVE);
    const finalizer=clone(window.UFC_DIVISION_ERA_DEPTH_FINALIZER);
    const coordinator=clone(window.UFC_SCORING_RUNTIME_COORDINATOR);
    const finalScoreEngine=clone(window.UFC_FINAL_SCORE_ENGINE);
    const sixCategoryModel=clone(window.UFC_SIX_CATEGORY_SCORE_MODEL);
    const boards=[...(data.men||[]),...(data.women||[])];
    const profiles=data.fighters||[];
    const shadowByKey=new Map((window.UFC_DIVISION_ERA_DEPTH_SHADOW?.fighters||[]).map(row=>[key(row.fighter),row]));
    const boardByKey=new Map(boards.map(row=>[key(row.fighter),row]));

    const boardMismatches=boards.filter(row=>{
      const expected=shadowByKey.get(key(row.fighter));
      return !expected
        ||Math.abs(Number(row.eraDepthAdjustment)-Number(expected.curvedAdjustment))>0.001
        ||Math.abs(Number(row.totalScore)-(Number(row.preEraDepthTotalScore)+Number(expected.curvedAdjustment)))>0.001;
    }).map(row=>row.fighter);
    const profileMismatches=profiles.filter(profile=>{
      const board=boardByKey.get(key(profile.fighter));
      return !board||(
        Math.abs(Number(profile.eraDepthAdjustment)-Number(board.eraDepthAdjustment))>0.001
        ||Number(profile.rank)!==Number(board.rank)
        ||Number(profile.overallOvr)!==Number(board.overallOvr)
        ||Math.abs(Number(profile.totalScore)-Number(board.totalScore))>0.001
      );
    }).map(row=>row.fighter);

    const forbiddenOverrideFields=[];
    Object.entries(window.DISPLAY_OVERRIDES||{}).forEach(([fighter,override])=>{
      if(!override||typeof override!=='object')return;
      ['overallOvr','allTimeRank','rankLabel','totalScore','rawScore','rank','baseScore','penalty','lossPenalty','lossContext','eraDepthAdjustment','lossContextHybrid','divisionEraDepth'].forEach(field=>{
        if(Object.prototype.hasOwnProperty.call(override,field))forbiddenOverrideFields.push({fighter,field});
      });
      Object.entries(override.categories||{}).forEach(([category,value])=>{
        if(!value||typeof value!=='object')return;
        ['ovr','rank','score','value'].forEach(field=>{
          if(Object.prototype.hasOwnProperty.call(value,field))forbiddenOverrideFields.push({fighter,field:`categories.${category}.${field}`});
        });
      });
    });

    const ownershipMismatches=boards.filter(row=>row.overallScoreOwner!=='final-score-engine.js'||row.finalScoreEngineVersion!==window.UFC_FINAL_SCORE_ENGINE?.version).map(row=>row.fighter);

    const fighter=name=>boardByKey.get(key(name))||null;
    const anchorNames=['Jon Jones','Georges St-Pierre','Demetrious Johnson','Anderson Silva','Islam Makhachev','Alexander Volkanovski','Jose Aldo','Khabib Nurmagomedov','Kamaru Usman','Stipe Miocic','Matt Hughes','Junior dos Santos','Tito Ortiz','Amanda Nunes','Cris Cyborg','Holly Holm'];
    const anchors=anchorNames.map(name=>{
      const row=fighter(name);
      return row?{fighter:name,rank:row.rank,totalScore:row.totalScore,preEraDepthTotalScore:row.preEraDepthTotalScore,adjustment:row.eraDepthAdjustment,overallOvr:row.overallOvr,depthIndex:row.divisionEraDepth?.depthIndex,sampledDivisions:row.divisionEraDepth?.sampledDivisions||[],womenFeatherweightTreatment:row.divisionEraDepth?.womenFeatherweightTreatment||null}:{fighter:name,missing:true};
    });

    const nunes=fighter('Amanda Nunes');
    const cyborg=fighter('Cris Cyborg');
    const holm=fighter('Holly Holm');
    const wfwSafety={
      nunesExcludesWfw:!nunes?.divisionEraDepth?.sampledDivisions?.includes('WFW')&&nunes?.divisionEraDepth?.womenFeatherweightTreatment?.treatment==='mixed-career-non-wfw-only',
      cyborgNeutral:Number(cyborg?.eraDepthAdjustment)===0&&cyborg?.divisionEraDepth?.womenFeatherweightTreatment?.treatment==='pure-wfw-zero-adjustment',
      holmExcludesWfw:!holm?.divisionEraDepth?.sampledDivisions?.includes('WFW')&&holm?.divisionEraDepth?.womenFeatherweightTreatment?.treatment==='mixed-career-non-wfw-only'
    };

    let profileSurface={rendered:false,eraCardHidden:false,hasRank:false,hasOvr:false,text:''};
    if(typeof window.openFighter==='function'){
      window.openFighter('Matt Hughes');
      await new Promise(resolve=>setTimeout(resolve,100));
      const text=document.getElementById('fighterDetail')?.innerText||'';
      const row=fighter('Matt Hughes');
      const hasEraCopy=text.includes('Era-depth adjustment')||text.includes('ranks 6–15 strength')||text.includes(Number(row?.eraDepthAdjustment).toFixed(2));
      profileSurface={rendered:text.includes('Matt Hughes'),eraCardHidden:!hasEraCopy,hasRank:text.includes(`#${row?.rank}`),hasOvr:text.includes(`${row?.overallOvr}`),text:text.slice(0,3000)};
    }

    let compareSurface={rendered:false,hasHughes:false,hasKhabib:false,hasLiveRanks:false,text:''};
    if(document.getElementById('fighterA')&&document.getElementById('fighterB')&&typeof window.renderCompare==='function'){
      document.getElementById('fighterA').value='Matt Hughes';
      document.getElementById('fighterB').value='Khabib Nurmagomedov';
      window.renderCompare();
      const text=document.getElementById('compareResult')?.innerText||'';
      compareSurface={rendered:text.length>0,hasHughes:text.includes('Matt Hughes'),hasKhabib:text.includes('Khabib Nurmagomedov'),hasLiveRanks:text.includes(`#${fighter('Matt Hughes')?.rank}`)&&text.includes(`#${fighter('Khabib Nurmagomedov')?.rank}`),text:text.slice(0,2500)};
    }

    return{
      pipeline:clone(window.UFC_SCORING_PIPELINE),shadow,audit,live,finalizer,coordinator,finalScoreEngine,sixCategoryModel,
      finalizationObserved:coordinator?.applied===true&&finalizer?.applied===true&&live?.finalizedAfterPipeline===true,
      consistency:{
        rosterCount:boards.length,shadowCount:shadowByKey.size,
        boardMismatchCount:boardMismatches.length,boardMismatches,
        profileMismatchCount:profileMismatches.length,profileMismatches,
        ownershipMismatchCount:ownershipMismatches.length,ownershipMismatches,
        forbiddenOverrideFieldCount:forbiddenOverrideFields.length,forbiddenOverrideFields
      },
      wfwSafety,anchors,
      menTop20:(data.men||[]).slice(0,20).map(row=>({rank:row.rank,fighter:row.fighter,preEraDepthTotalScore:row.preEraDepthTotalScore,totalScore:row.totalScore,eraDepthAdjustment:row.eraDepthAdjustment,overallOvr:row.overallOvr})),
      womenBoard:(data.women||[]).map(row=>({rank:row.rank,fighter:row.fighter,preEraDepthTotalScore:row.preEraDepthTotalScore,totalScore:row.totalScore,eraDepthAdjustment:row.eraDepthAdjustment,overallOvr:row.overallOvr})),
      profileSurface,compareSurface
    };
  });

  const payload={generatedAt:new Date().toISOString(),baseUrl,...result,browserDiagnostics:{consoleErrors,pageErrors}};
  await fs.writeFile(outputPath,`${JSON.stringify(payload,null,2)}\n`,'utf8');
  const summary={
    generatedAt:payload.generatedAt,
    pipelineStatus:result.pipeline?.status??null,
    coordinatorVersion:result.coordinator?.version??null,
    coordinatorApplied:result.coordinator?.applied??false,
    shadowVersion:result.shadow?.version??null,
    auditVersion:result.audit?.version??null,
    liveVersion:result.live?.version??null,
    finalizerVersion:result.finalizer?.version??null,
    finalizerStatus:result.finalizer?.status??null,
    finalizerApplied:result.finalizer?.applied??false,
    finalizedAfterPipeline:result.live?.finalizedAfterPipeline??false,
    finalizationObserved:result.finalizationObserved,
    finalScoreEngineVersion:result.finalScoreEngine?.version??null,
    finalScoreApplyCount:result.finalScoreEngine?.applyCount??null,
    sixCategoryModelVersion:result.sixCategoryModel?.version??null,
    datasetEnd:result.shadow?.source?.datasetEnd??null,
    sourceFresh:result.shadow?.source?.sourceFresh??false,
    judgmentApproved:result.audit?.judgmentApproved??false,
    readyForLivePromotion:result.audit?.readyForLivePromotion??false,
    liveApplied:result.live?.applied??false,
    promotedCount:result.live?.promotedCount??null,
    liveMismatchCount:result.live?.mismatchCount??null,
    consistency:result.consistency,wfwSafety:result.wfwSafety,anchors:result.anchors,
    menTop20:result.menTop20,womenBoard:result.womenBoard,
    profileSurface:result.profileSurface,compareSurface:result.compareSurface,
    browserDiagnostics:{consoleErrors,pageErrors}
  };
  await fs.writeFile(summaryPath,`${JSON.stringify(summary,null,2)}\n`,'utf8');
  console.log('DIVISION_ERA_DEPTH_RUNTIME_SUMMARY');
  console.log(JSON.stringify({
    datasetEnd:summary.datasetEnd,sourceFresh:summary.sourceFresh,judgmentApproved:summary.judgmentApproved,
    coordinatorApplied:summary.coordinatorApplied,finalizerStatus:summary.finalizerStatus,finalizerApplied:summary.finalizerApplied,finalizedAfterPipeline:summary.finalizedAfterPipeline,
    finalScoreEngineVersion:summary.finalScoreEngineVersion,finalScoreApplyCount:summary.finalScoreApplyCount,
    liveApplied:summary.liveApplied,promotedCount:summary.promotedCount,liveMismatchCount:summary.liveMismatchCount,
    boardMismatchCount:summary.consistency?.boardMismatchCount,profileMismatchCount:summary.consistency?.profileMismatchCount,
    ownershipMismatchCount:summary.consistency?.ownershipMismatchCount,forbiddenOverrideFieldCount:summary.consistency?.forbiddenOverrideFieldCount,wfwSafety:summary.wfwSafety,
    profileSurfacePassed:Boolean(summary.profileSurface?.rendered&&summary.profileSurface?.eraCardHidden&&summary.profileSurface?.hasRank&&summary.profileSurface?.hasOvr),
    compareSurfacePassed:Boolean(summary.compareSurface?.rendered&&summary.compareSurface?.hasHughes&&summary.compareSurface?.hasKhabib&&summary.compareSurface?.hasLiveRanks),
    consoleErrorCount:consoleErrors.length,pageErrorCount:pageErrors.length
  },null,2));

  const failed=result.pipeline?.status!=='ready'
    ||result.coordinator?.applied!==true
    ||Number(result.finalScoreEngine?.applyCount||0)!==1
    ||result.shadow?.promotionContract?.readyForJudgmentFinalization!==true
    ||result.shadow?.source?.sourceFresh!==true
    ||result.audit?.judgmentApproved!==true
    ||result.audit?.readyForLivePromotion!==true
    ||result.finalizer?.applied!==true
    ||result.live?.finalizedAfterPipeline!==true
    ||result.live?.applied!==true
    ||Number(result.live?.promotedCount||0)!==Number(result.consistency?.rosterCount||0)
    ||Number(result.live?.mismatchCount||0)!==0
    ||Number(result.consistency?.rosterCount||0)<1
    ||Number(result.consistency?.shadowCount||0)!==Number(result.consistency?.rosterCount||0)
    ||Number(result.consistency?.boardMismatchCount||0)!==0
    ||Number(result.consistency?.profileMismatchCount||0)!==0
    ||Number(result.consistency?.ownershipMismatchCount||0)!==0
    ||Number(result.consistency?.forbiddenOverrideFieldCount||0)!==0
    ||result.wfwSafety?.nunesExcludesWfw!==true
    ||result.wfwSafety?.cyborgNeutral!==true
    ||result.wfwSafety?.holmExcludesWfw!==true
    ||result.profileSurface?.rendered!==true
    ||result.profileSurface?.eraCardHidden!==true
    ||result.profileSurface?.hasRank!==true
    ||result.profileSurface?.hasOvr!==true
    ||result.compareSurface?.rendered!==true
    ||result.compareSurface?.hasHughes!==true
    ||result.compareSurface?.hasKhabib!==true
    ||result.compareSurface?.hasLiveRanks!==true
    ||pageErrors.length>0;
  if(failed)process.exitCode=1;
}finally{
  await browser.close();
}

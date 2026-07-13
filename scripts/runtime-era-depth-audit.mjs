// Runtime audit for Division-Era Depth under the Stage 2 single-owner scoring architecture.
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
  await page.waitForFunction(()=>window.UFC_SCORING_PIPELINE?.status==='ready'&&window.UFC_DIVISION_ERA_DEPTH_LIVE?.applied===true&&window.UFC_DIVISION_ERA_DEPTH_FINALIZER?.applied===true&&window.UFC_SCORING_OWNERSHIP_CONTRACT?.applied===true,null,{timeout:120_000,polling:100});
  await page.waitForTimeout(500);

  const result=await page.evaluate(async()=>{
    const clone=value=>JSON.parse(JSON.stringify(value??null));
    const key=name=>String(name||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
    const num=value=>Number.isFinite(Number(value))?Number(value):0;
    const data=window.RANKING_DATA||{};
    const boards=[...(data.men||[]),...(data.women||[])];
    const profiles=data.fighters||[];
    const canonical=window.UFC_CANONICAL_SCORING_RECORDS||null;
    const engine=window.UFC_SCORING_ENGINE||window.UFC_FINAL_SCORE_ENGINE||null;
    const shadow=window.UFC_DIVISION_ERA_DEPTH_SHADOW||null;
    const audit=window.UFC_DIVISION_ERA_DEPTH_AUDIT||null;
    const live=window.UFC_DIVISION_ERA_DEPTH_LIVE||null;
    const finalizer=window.UFC_DIVISION_ERA_DEPTH_FINALIZER||null;
    const contract=window.UFC_SCORING_OWNERSHIP_CONTRACT||null;
    const shadowByKey=new Map((shadow?.fighters||[]).map(row=>[key(row?.fighter),row]));
    const boardByKey=new Map(boards.map(row=>[key(row?.fighter),row]));
    const profileByKey=new Map(profiles.map(row=>[key(row?.fighter),row]));

    const canonicalMismatches=[];
    const evidenceMismatches=[];
    const formulaMismatches=[];
    const profileMismatches=[];
    const missingDetail=[];
    boards.forEach(row=>{
      const expected=canonical?.entryFor?.(row.fighter)||null;
      const evidence=shadowByKey.get(key(row.fighter))||null;
      if(!expected||Math.abs(num(row.eraDepthAdjustment)-num(expected?.eraDepthAdjustment))>0.001||Math.abs(num(row.totalScore)-num(expected?.expectedTotalScore))>0.011)canonicalMismatches.push({fighter:row.fighter,expectedAdjustment:expected?.eraDepthAdjustment??null,actualAdjustment:row.eraDepthAdjustment,expectedTotal:expected?.expectedTotalScore??null,actualTotal:row.totalScore});
      if(!evidence||Math.abs(num(row.eraDepthAdjustment)-num(evidence?.curvedAdjustment))>0.001)evidenceMismatches.push({fighter:row.fighter,expected:evidence?.curvedAdjustment??null,actual:row.eraDepthAdjustment});
      const formulaTotal=engine?.scoreBreakdown?.(row)?.totalScore;
      if(!Number.isFinite(Number(formulaTotal))||Math.abs(num(row.totalScore)-num(formulaTotal))>0.011)formulaMismatches.push({fighter:row.fighter,expected:formulaTotal,actual:row.totalScore});
      const profile=profileByKey.get(key(row.fighter));
      if(!profile||Math.abs(num(profile.eraDepthAdjustment)-num(row.eraDepthAdjustment))>0.001||Math.abs(num(profile.totalScore)-num(row.totalScore))>0.011||num(profile.rank)!==num(row.rank)||num(profile.overallOvr)!==num(row.overallOvr))profileMismatches.push({fighter:row.fighter});
      if(!row.divisionEraDepth)missingDetail.push(row.fighter);
    });

    const scoreFields=['championship','opponentQuality','primeDominance','longevity','apexPeak','penalty','eraDepthAdjustment','totalScore','rawScore','baseScore','preEraDepthTotalScore','rank','allTimeRank','overallOvr','lossContextHybrid','divisionEraDepth'];
    const overrideViolations=[];
    Object.entries(window.DISPLAY_OVERRIDES||{}).forEach(([fighter,override])=>{
      if(!override||typeof override!=='object')return;
      scoreFields.forEach(field=>{if(Object.prototype.hasOwnProperty.call(override,field))overrideViolations.push({fighter,field});});
      ['snapshotStats','packetProfileStats'].forEach(container=>{
        const target=override[container];
        if(!target||typeof target!=='object')return;
        scoreFields.forEach(field=>{if(Object.prototype.hasOwnProperty.call(target,field))overrideViolations.push({fighter,field:`${container}.${field}`});});
      });
    });
    const wrongOwners=boards.filter(row=>row.scoreInputOwner!=='scoring-engine.js'||row.overallScoreOwner!=='scoring-engine.js'||row.finalScoreEngineVersion!==engine?.version).map(row=>({fighter:row.fighter,scoreInputOwner:row.scoreInputOwner,overallScoreOwner:row.overallScoreOwner,engineVersion:row.finalScoreEngineVersion}));

    const fighter=name=>boardByKey.get(key(name))||null;
    const anchorNames=['Jon Jones','Georges St-Pierre','Demetrious Johnson','Anderson Silva','Islam Makhachev','Alexander Volkanovski','Jose Aldo','Khabib Nurmagomedov','Kamaru Usman','Stipe Miocic','Matt Hughes','Junior dos Santos','Tito Ortiz','Amanda Nunes','Cris Cyborg','Holly Holm'];
    const anchors=anchorNames.map(name=>{const row=fighter(name);return row?{fighter:name,rank:row.rank,totalScore:row.totalScore,preEraDepthTotalScore:row.preEraDepthTotalScore,adjustment:row.eraDepthAdjustment,overallOvr:row.overallOvr,depthIndex:row.divisionEraDepth?.depthIndex,sampledDivisions:row.divisionEraDepth?.sampledDivisions||[],womenFeatherweightTreatment:row.divisionEraDepth?.womenFeatherweightTreatment||null}:{fighter:name,missing:true};});
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
      pipeline:clone(window.UFC_SCORING_PIPELINE),shadow:clone(shadow),audit:clone(audit),live:clone(live),finalizer:clone(finalizer),ownershipContract:clone(contract),engine:clone(engine),
      consistency:{rosterCount:boards.length,shadowCount:shadowByKey.size,canonicalMismatchCount:canonicalMismatches.length,canonicalMismatches,evidenceMismatchCount:evidenceMismatches.length,evidenceMismatches,formulaMismatchCount:formulaMismatches.length,formulaMismatches,profileMismatchCount:profileMismatches.length,profileMismatches,missingDetailCount:missingDetail.length,missingDetail,overrideViolationCount:overrideViolations.length,overrideViolations,wrongOwnerCount:wrongOwners.length,wrongOwners},
      wfwSafety,anchors,profileSurface,compareSurface,
      menTop20:(data.men||[]).slice(0,20).map(row=>({rank:row.rank,fighter:row.fighter,preEraDepthTotalScore:row.preEraDepthTotalScore,totalScore:row.totalScore,eraDepthAdjustment:row.eraDepthAdjustment,overallOvr:row.overallOvr})),
      womenBoard:(data.women||[]).map(row=>({rank:row.rank,fighter:row.fighter,preEraDepthTotalScore:row.preEraDepthTotalScore,totalScore:row.totalScore,eraDepthAdjustment:row.eraDepthAdjustment,overallOvr:row.overallOvr}))
    };
  });

  const payload={generatedAt:new Date().toISOString(),baseUrl,...result,browserDiagnostics:{consoleErrors,pageErrors}};
  const summary={generatedAt:payload.generatedAt,pipelineStatus:result.pipeline?.status??null,ownershipApplied:result.ownershipContract?.applied??false,shadowVersion:result.shadow?.version??null,auditVersion:result.audit?.version??null,liveVersion:result.live?.version??null,finalizerVersion:result.finalizer?.version??null,finalizerApplied:result.finalizer?.applied??false,engineVersion:result.engine?.version??null,engineApplyCount:result.engine?.applyCount??null,datasetEnd:result.shadow?.source?.datasetEnd??null,sourceFresh:result.shadow?.source?.sourceFresh??false,judgmentApproved:result.audit?.judgmentApproved??false,readyForLivePromotion:result.audit?.readyForLivePromotion??false,liveApplied:result.live?.applied??false,promotedCount:result.live?.promotedCount??null,liveMismatchCount:result.live?.mismatchCount??null,consistency:result.consistency,wfwSafety:result.wfwSafety,anchors:result.anchors,profileSurface:result.profileSurface,compareSurface:result.compareSurface,browserDiagnostics:{consoleErrors,pageErrors}};
  await fs.writeFile(outputPath,`${JSON.stringify(payload,null,2)}\n`,'utf8');
  await fs.writeFile(summaryPath,`${JSON.stringify(summary,null,2)}\n`,'utf8');
  console.log('DIVISION_ERA_DEPTH_RUNTIME_SUMMARY');
  console.log(JSON.stringify(summary,null,2));

  const failed=result.pipeline?.status!=='ready'
    ||result.ownershipContract?.applied!==true
    ||result.shadow?.promotionContract?.readyForJudgmentFinalization!==true
    ||result.shadow?.source?.sourceFresh!==true
    ||result.audit?.judgmentApproved!==true
    ||result.audit?.readyForLivePromotion!==true
    ||result.finalizer?.applied!==true
    ||result.live?.applied!==true
    ||Number(result.live?.promotedCount||0)!==Number(result.consistency?.rosterCount||0)
    ||Number(result.live?.mismatchCount||0)!==0
    ||Number(result.consistency?.rosterCount||0)!==72
    ||Number(result.consistency?.shadowCount||0)!==Number(result.consistency?.rosterCount||0)
    ||Number(result.consistency?.canonicalMismatchCount||0)!==0
    ||Number(result.consistency?.evidenceMismatchCount||0)!==0
    ||Number(result.consistency?.formulaMismatchCount||0)!==0
    ||Number(result.consistency?.profileMismatchCount||0)!==0
    ||Number(result.consistency?.missingDetailCount||0)!==0
    ||Number(result.consistency?.overrideViolationCount||0)!==0
    ||Number(result.consistency?.wrongOwnerCount||0)!==0
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

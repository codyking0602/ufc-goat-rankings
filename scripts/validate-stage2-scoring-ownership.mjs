import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const url=process.env.UFC_APP_URL||'http://127.0.0.1:4173/index.html?stage2-scoring-ownership=1';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1200}});
 const errors=[];
 const consoleErrors=[];
 page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
 page.on('pageerror',e=>errors.push(e?.stack||e?.message||String(e)));
 await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForFunction(()=>window.UFC_SCORING_PIPELINE?.status==='ready'||window.UFC_SCORING_PIPELINE?.status==='error',null,{timeout:120000,polling:100});
 await page.waitForFunction(()=>window.UFC_SCORING_OWNERSHIP_CONTRACT?.applied===true,null,{timeout:30000,polling:100}).catch(()=>{});
 const report=await page.evaluate(()=>{
  const data=window.RANKING_DATA;
  const canonical=window.UFC_CANONICAL_SCORING_RECORDS;
  const contract=window.UFC_SCORING_OWNERSHIP_CONTRACT||{};
  const rows=[...(data?.men||[]),...(data?.women||[])];
  const fields=['championship','opponentQuality','primeDominance','longevity','apexPeak','penalty','eraDepthAdjustment'];
  const mismatches=[];
  rows.forEach(row=>{
   const expected=canonical?.entryFor?.(row.fighter);
   if(!expected){mismatches.push({fighter:row.fighter,field:'missing-canonical'});return;}
   fields.forEach(field=>{if(Math.abs(Number(row[field])-Number(expected[field]))>.001)mismatches.push({fighter:row.fighter,field,expected:expected[field],actual:row[field]});});
   if(Math.abs(Number(row.totalScore)-Number(expected.expectedTotalScore))>.011)mismatches.push({fighter:row.fighter,field:'totalScore',expected:expected.expectedTotalScore,actual:row.totalScore});
   if(Number(row.rank)!==Number(expected.expectedRank))mismatches.push({fighter:row.fighter,field:'rank',expected:expected.expectedRank,actual:row.rank});
   if(Number(row.overallOvr)!==Number(expected.expectedOverallOvr))mismatches.push({fighter:row.fighter,field:'overallOvr',expected:expected.expectedOverallOvr,actual:row.overallOvr});
  });
  const guard=window.UFC_DISPLAY_OVERRIDE_OWNERSHIP_GUARD;
  const legacyRepair=window.UFC_DYNAMIC_ROSTER_SCORING_REPAIR;
  const depthFinalizer=window.UFC_DIVISION_ERA_DEPTH_FINALIZER;
  const lossLive=window.UFC_LOSS_CONTEXT_HYBRID_LIVE;
  const eraLive=window.UFC_DIVISION_ERA_DEPTH_LIVE;
  const readiness=contract.readiness||{};
  return {
   contract:{
    version:contract.version||null,
    applied:contract.applied===true,
    status:contract.status||null,
    settled:contract.settled===true,
    attemptCount:contract.attemptCount??null,
    elapsedMs:contract.elapsedMs??null,
    rosterCount:contract.rosterCount??null,
    expectedRosterCount:contract.expectedRosterCount??null,
    profileMismatchCount:contract.profileMismatchCount??null,
    displayOverrideViolationCount:contract.displayOverrideViolationCount??null,
    compareScoreViolationCount:contract.compareScoreViolationCount??null,
    missingLossContextDetailCount:contract.missingLossContextDetailCount??readiness.missingLossContextDetailCount??null,
    missingEraDepthDetailCount:contract.missingEraDepthDetailCount??readiness.missingEraDepthDetailCount??null,
    wrongOwnerCount:contract.wrongOwnerCount??null,
    readiness:{
     data:readiness.data??null,
     engine:readiness.engine??null,
     canonical:readiness.canonical??null,
     pipelineReady:readiness.pipelineReady??null,
     dynamicRosterEvidence:readiness.dynamicRosterEvidence??null,
     depthFinalizerInformational:readiness.depthFinalizerInformational??null,
     rosterCount:readiness.rosterCount??null,
     missingLossContextDetailCount:readiness.missingLossContextDetailCount??null,
     missingEraDepthDetailCount:readiness.missingEraDepthDetailCount??null
    }
   },
   rosterCount:rows.length,
   mismatches,
   engineVersion:window.UFC_SCORING_ENGINE?.version||null,
   engineApplyCount:window.UFC_SCORING_ENGINE?.applyCount??null,
   displayGuard:guard?{version:guard.version,installed:guard.installed,role:guard.role,protectedCount:guard.protectedCount,forbiddenDirectCount:guard.forbiddenDirect?.length||0,forbiddenNestedCount:guard.forbiddenNested?.length||0,forbiddenCategoryCount:guard.forbiddenCategory?.length||0}:null,
   pipeline:{version:window.UFC_SCORING_PIPELINE?.version||null,status:window.UFC_SCORING_PIPELINE?.status||null,mode:window.UFC_SCORING_PIPELINE?.mode||null},
   legacyRepair:legacyRepair?{version:legacyRepair.version,applied:legacyRepair.applied===true,status:legacyRepair.status||null,applyCount:legacyRepair.applyCount??null,rosterCount:legacyRepair.rosterCount??null,scoreMismatchCount:(legacyRepair.scoreMismatches||[]).length}:null,
   depthFinalizer:depthFinalizer?{version:depthFinalizer.version,applied:depthFinalizer.applied===true,status:depthFinalizer.status||null,applyCount:depthFinalizer.applyCount??null,rosterCount:depthFinalizer.rosterCount??null}:null,
   lossLive:lossLive?{version:lossLive.version,applied:lossLive.applied===true,status:lossLive.status||null,rosterCount:lossLive.rosterCount??null,mismatchCount:lossLive.mismatchCount??null}:null,
   eraLive:eraLive?{version:eraLive.version,applied:eraLive.applied===true,status:eraLive.status||null,rosterCount:eraLive.rosterCount??null,mismatchCount:eraLive.mismatchCount??null}:null
  };
 });
 report.errors=errors;
 report.consoleErrors=consoleErrors;
 await fs.mkdir('docs',{recursive:true});
 await fs.writeFile('docs/stage2-scoring-ownership-report.json',JSON.stringify(report,null,2)+'\n');
 console.log('STAGE2_OWNERSHIP='+JSON.stringify(report));
 if(!report.contract?.applied||report.contract?.settled!==true||report.rosterCount!==72||report.mismatches.length||report.errors.length||report.contract?.wrongOwnerCount||report.contract?.displayOverrideViolationCount||report.contract?.compareScoreViolationCount||report.contract?.missingLossContextDetailCount||report.contract?.missingEraDepthDetailCount)process.exitCode=1;
}finally{await browser.close();}

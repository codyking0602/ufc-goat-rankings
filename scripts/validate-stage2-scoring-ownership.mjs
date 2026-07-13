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
 const started=Date.now();
 while(window.UFC_SCORING_OWNERSHIP_CONTRACT?.applied!==true&&Date.now()-started<30000){
  await page.waitForTimeout(250);
 }
 const report=await page.evaluate(()=>{
  const clone=value=>JSON.parse(JSON.stringify(value??null));
  const data=window.RANKING_DATA;
  const canonical=window.UFC_CANONICAL_SCORING_RECORDS;
  const contract=window.UFC_SCORING_OWNERSHIP_CONTRACT;
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
  return {
   contract:clone(contract),
   rosterCount:rows.length,
   mismatches,
   engineVersion:window.UFC_SCORING_ENGINE?.version||null,
   engineApplyCount:window.UFC_SCORING_ENGINE?.applyCount??null,
   displayGuard:guard?{version:guard.version,installed:guard.installed,role:guard.role,protectedCount:guard.protectedCount,forbiddenDirectCount:guard.forbiddenDirect?.length||0,forbiddenNestedCount:guard.forbiddenNested?.length||0,forbiddenCategoryCount:guard.forbiddenCategory?.length||0}:null,
   pipeline:clone(window.UFC_SCORING_PIPELINE),
   legacyRepair:legacyRepair?{version:legacyRepair.version,applied:legacyRepair.applied,status:legacyRepair.status,applyCount:legacyRepair.applyCount,rosterCount:legacyRepair.rosterCount,scoreMismatches:legacyRepair.scoreMismatches||[]}:null,
   depthFinalizer:depthFinalizer?{version:depthFinalizer.version,applied:depthFinalizer.applied,status:depthFinalizer.status,applyCount:depthFinalizer.applyCount,rosterCount:depthFinalizer.rosterCount}:null,
   lossLive:lossLive?{version:lossLive.version,applied:lossLive.applied,status:lossLive.status,rosterCount:lossLive.rosterCount,mismatchCount:lossLive.mismatchCount}:null,
   eraLive:eraLive?{version:eraLive.version,applied:eraLive.applied,status:eraLive.status,rosterCount:eraLive.rosterCount,mismatchCount:eraLive.mismatchCount}:null
  };
 });
 report.errors=errors;
 report.consoleErrors=consoleErrors;
 await fs.mkdir('docs',{recursive:true});
 await fs.writeFile('docs/stage2-scoring-ownership-report.json',JSON.stringify(report,null,2)+'\n');
 console.log('STAGE2_OWNERSHIP='+JSON.stringify(report));
 if(!report.contract?.applied||report.contract?.settled!==true||report.rosterCount!==72||report.mismatches.length||report.errors.length||report.contract?.wrongOwnerCount||report.contract?.displayOverrideViolationCount||report.contract?.compareScoreViolationCount||report.contract?.missingLossContextDetailCount||report.contract?.missingEraDepthDetailCount)process.exitCode=1;
}finally{await browser.close();}

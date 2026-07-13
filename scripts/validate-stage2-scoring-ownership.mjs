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
 await page.waitForFunction(()=>window.UFC_SCORING_PIPELINE?.status==='ready'&&Number(window.UFC_SCORING_OWNERSHIP_CONTRACT?.attemptCount||0)>=1,null,{timeout:60000,polling:100});
 await page.waitForTimeout(4000);
 const report=await page.evaluate(()=>{
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
  return {contract,rosterCount:rows.length,mismatches,engineVersion:window.UFC_SCORING_ENGINE?.version||null,pipeline:window.UFC_SCORING_PIPELINE||null,legacyRepair:window.UFC_DYNAMIC_ROSTER_SCORING_REPAIR||null,depthFinalizer:window.UFC_DIVISION_ERA_DEPTH_FINALIZER||null};
 });
 report.errors=errors;
 report.consoleErrors=consoleErrors;
 await fs.mkdir('docs',{recursive:true});
 await fs.writeFile('docs/stage2-scoring-ownership-report.json',JSON.stringify(report,null,2)+'\n');
 console.log('STAGE2_OWNERSHIP='+JSON.stringify(report));
 if(!report.contract?.applied||report.rosterCount!==72||report.mismatches.length||report.errors.length||report.contract?.wrongOwnerCount||report.contract?.displayOverrideViolationCount||report.contract?.compareScoreViolationCount||report.contract?.missingLossContextDetailCount||report.contract?.missingEraDepthDetailCount)process.exitCode=1;
}finally{await browser.close();}

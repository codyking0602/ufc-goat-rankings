import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import * as acorn from 'acorn';

const ROOT=process.cwd();
const url=process.env.UFC_APP_URL||'http://127.0.0.1:4173/index.html?stage3-scoring-cleanup=1';
const reportPath='docs/stage3-scoring-cleanup-report.json';

const deletedFiles=[
  'assets/js/final-score-engine.js',
  'assets/js/rank-fluidity-fixes.js',
  'assets/data/division-era-depth-finalizer.js',
  'assets/data/championship-score-corrections.js',
  'assets/data/opponent-quality-score-corrections.js',
  'assets/data/longevity-score-corrections.js'
];
const forbiddenRuntimeReferences=[
  'final-score-engine.js',
  'rank-fluidity-fixes.js',
  'division-era-depth-finalizer.js',
  'championship-score-corrections.js',
  'opponent-quality-score-corrections.js',
  'longevity-score-corrections.js',
  'dynamic-roster-scoring-repair'
];
const displayDirect=[
  'overallOvr','allTimeRank','rankLabel','totalScore','rawScore','rank',
  'championship','opponentQuality','primeDominance','longevity','apexPeak',
  'penalty','lossPenalty','lossContext','eraDepthAdjustment','baseScore',
  'preEraDepthTotalScore','apexPeakBonus','lossContextHybrid','divisionEraDepth'
];
const displayNested=[...displayDirect,'championshipScore','opponentQualityScore','primeDominanceScore','longevityScore'];
const categoryFields=['ovr','rank','score','value'];
const packetDisplayForbidden=new Set(['overallOvr','allTimeRank','rankLabel','categories','totalScore','rawScore','rank']);

async function exists(relative){
  try{await fs.access(path.join(ROOT,relative));return true;}catch{return false;}
}
function propertyName(node){
  if(!node||node.type!=='Property')return null;
  if(!node.computed&&node.key?.type==='Identifier')return node.key.name;
  if(node.key?.type==='Literal')return String(node.key.value);
  return null;
}
function childObject(objectNode,name){
  const property=objectNode?.properties?.find(item=>propertyName(item)===name);
  return property?.value?.type==='ObjectExpression'?property.value:null;
}
function findPacketObject(ast){
  const stack=[ast];
  while(stack.length){
    const node=stack.pop();
    if(!node||typeof node!=='object')continue;
    if(node.type==='VariableDeclarator'&&node.id?.type==='Identifier'&&node.id.name==='packet'&&node.init?.type==='ObjectExpression')return node.init;
    for(const value of Object.values(node)){
      if(Array.isArray(value))value.forEach(item=>{if(item&&typeof item==='object')stack.push(item);});
      else if(value&&typeof value==='object'&&typeof value.type==='string')stack.push(value);
    }
  }
  return null;
}
function inspectDisplayOverrides(overrides){
  const violations=[];
  Object.entries(overrides||{}).forEach(([fighter,override])=>{
    if(!override||typeof override!=='object')return;
    displayDirect.forEach(field=>{if(Object.prototype.hasOwnProperty.call(override,field))violations.push({fighter,field});});
    ['snapshotStats','packetProfileStats'].forEach(container=>{
      const target=override[container];
      if(!target||typeof target!=='object')return;
      displayNested.forEach(field=>{if(Object.prototype.hasOwnProperty.call(target,field))violations.push({fighter,field:`${container}.${field}`});});
    });
    Object.entries(override.categories||{}).forEach(([category,entry])=>{
      if(!entry||typeof entry!=='object')return;
      categoryFields.forEach(field=>{if(Object.prototype.hasOwnProperty.call(entry,field))violations.push({fighter,field:`categories.${category}.${field}`});});
    });
  });
  return violations;
}

async function sourceAudit(){
  const deletedStillPresent=[];
  for(const file of deletedFiles){if(await exists(file))deletedStillPresent.push(file);}

  const referenceFiles=['index.html','assets/data/module-versions.js','assets/data/ranking-data-patches.js','assets/data/loss-context-exposure-ledger.js'];
  const forbiddenReferences=[];
  for(const file of referenceFiles){
    const source=await fs.readFile(path.join(ROOT,file),'utf8');
    forbiddenRuntimeReferences.forEach(reference=>{
      if(source.includes(reference))forbiddenReferences.push({file,reference});
    });
  }

  const displaySource=await fs.readFile(path.join(ROOT,'assets/data/display-overrides.js'),'utf8');
  const sandbox={};
  vm.runInNewContext(`${displaySource}\n;globalThis.__AUDIT_DISPLAY_OVERRIDES__=DISPLAY_OVERRIDES;`,sandbox,{filename:'assets/data/display-overrides.js',timeout:5000});
  const displayOverrideViolations=inspectDisplayOverrides(sandbox.__AUDIT_DISPLAY_OVERRIDES__);

  const packetViolations=[];
  const packetDirectory=path.join(ROOT,'assets/data/fighter-packets');
  const packetEntries=await fs.readdir(packetDirectory,{withFileTypes:true});
  for(const entry of packetEntries){
    if(!entry.isFile()||!entry.name.endsWith('.js'))continue;
    const relative=path.join('assets/data/fighter-packets',entry.name);
    const source=await fs.readFile(path.join(ROOT,relative),'utf8');
    const ast=acorn.parse(source,{ecmaVersion:'latest',sourceType:'script'});
    const packet=findPacketObject(ast);
    const display=childObject(packet,'display');
    if(!display)continue;
    display.properties.forEach(property=>{
      const field=propertyName(property);
      if(packetDisplayForbidden.has(field))packetViolations.push({file:relative,field});
    });
  }

  return {
    deletedFileCount:deletedFiles.length,
    deletedStillPresent,
    forbiddenReferences,
    displayOverrideViolations,
    packetViolations,
    passed:deletedStillPresent.length===0&&forbiddenReferences.length===0&&displayOverrideViolations.length===0&&packetViolations.length===0
  };
}

const source=await sourceAudit();
const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage({viewport:{width:1440,height:1200}});
  const errors=[];
  const consoleErrors=[];
  page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
  page.on('pageerror',error=>errors.push(error?.stack||error?.message||String(error)));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60_000});
  await page.waitForFunction(()=>window.UFC_SCORING_PIPELINE?.status==='ready'||window.UFC_SCORING_PIPELINE?.status==='error',null,{timeout:120_000,polling:100});
  await page.waitForFunction(()=>window.UFC_SCORING_OWNERSHIP_CONTRACT?.applied===true,null,{timeout:30_000,polling:100}).catch(()=>{});

  const runtime=await page.evaluate(()=>{
    const num=value=>Number.isFinite(Number(value))?Number(value):0;
    const data=window.RANKING_DATA||{};
    const canonical=window.UFC_CANONICAL_SCORING_RECORDS;
    const contract=window.UFC_SCORING_OWNERSHIP_CONTRACT||{};
    const engine=window.UFC_SCORING_ENGINE;
    const rows=[...(data.men||[]),...(data.women||[])];
    const fields=['championship','opponentQuality','primeDominance','longevity','apexPeak','penalty','eraDepthAdjustment'];
    const mismatches=[];
    rows.forEach(row=>{
      const expected=canonical?.entryFor?.(row.fighter);
      if(!expected){mismatches.push({fighter:row.fighter,field:'missing-canonical'});return;}
      fields.forEach(field=>{if(Math.abs(num(row[field])-num(expected[field]))>.001)mismatches.push({fighter:row.fighter,field,expected:expected[field],actual:row[field]});});
      if(Math.abs(num(row.totalScore)-num(expected.expectedTotalScore))>.011)mismatches.push({fighter:row.fighter,field:'totalScore',expected:expected.expectedTotalScore,actual:row.totalScore});
      if(num(row.rank)!==num(expected.expectedRank))mismatches.push({fighter:row.fighter,field:'rank',expected:expected.expectedRank,actual:row.rank});
      if(num(row.overallOvr)!==num(expected.expectedOverallOvr))mismatches.push({fighter:row.fighter,field:'overallOvr',expected:expected.expectedOverallOvr,actual:row.overallOvr});
    });
    const lossLive=window.UFC_LOSS_CONTEXT_HYBRID_LIVE||{};
    const eraLive=window.UFC_DIVISION_ERA_DEPTH_LIVE||{};
    return {
      pipeline:{version:window.UFC_SCORING_PIPELINE?.version||null,status:window.UFC_SCORING_PIPELINE?.status||null,mode:window.UFC_SCORING_PIPELINE?.mode||null,finalScoreApplyCount:window.UFC_SCORING_PIPELINE?.finalScoreApplyCount??null},
      contract:{version:contract.version||null,applied:contract.applied===true,status:contract.status||null,settled:contract.settled===true,rosterCount:contract.rosterCount??null,wrongOwnerCount:contract.wrongOwnerCount??null,displayOverrideViolationCount:contract.displayOverrideViolationCount??null,compareScoreViolationCount:contract.compareScoreViolationCount??null,missingLossContextDetailCount:contract.missingLossContextDetailCount??null,missingEraDepthDetailCount:contract.missingEraDepthDetailCount??null,removedLegacyScoreLayers:contract.removedLegacyScoreLayers||[]},
      rosterCount:rows.length,
      mismatches,
      engineVersion:engine?.version||null,
      engineApplyCount:engine?.applyCount??null,
      engineRejectedApplyCount:engine?.rejectedApplyCount??null,
      engineApplyAttempts:(engine?.applyAttempts||[]).map(attempt=>({...attempt})),
      finalEngineAliasIsCanonical:window.UFC_FINAL_SCORE_ENGINE===engine,
      legacyGlobals:{dynamicRosterRepair:typeof window.UFC_DYNAMIC_ROSTER_SCORING_REPAIR!=='undefined',eraDepthFinalizer:typeof window.UFC_DIVISION_ERA_DEPTH_FINALIZER!=='undefined'},
      lossEvidence:{version:lossLive.version||null,applied:lossLive.applied===true,mode:lossLive.mode||null,rosterCount:lossLive.rosterCount??null,mismatchCount:lossLive.mismatchCount??null,mutatesScores:lossLive.mutatesScores??null,mutatesPenalty:lossLive.mutatesPenalty??null},
      eraEvidence:{version:eraLive.version||null,applied:eraLive.applied===true,mode:eraLive.mode||null,rosterCount:eraLive.rosterCount??null,mismatchCount:eraLive.mismatchCount??null,mutatesScores:eraLive.mutatesScores??null,mutatesAdjustment:eraLive.mutatesAdjustment??null}
    };
  });

  const report={generatedAt:new Date().toISOString(),url,source,runtime,browserDiagnostics:{errors,consoleErrors}};
  await fs.mkdir('docs',{recursive:true});
  await fs.writeFile(reportPath,`${JSON.stringify(report,null,2)}\n`,'utf8');
  console.log('STAGE3_SCORING_CLEANUP');
  console.log(JSON.stringify(report,null,2));

  const failed=!source.passed
    ||runtime.pipeline.status!=='ready'
    ||runtime.pipeline.mode!=='deterministic-evidence-prerequisite-pipeline'
    ||Number(runtime.pipeline.finalScoreApplyCount||0)!==0
    ||runtime.contract.applied!==true
    ||runtime.contract.settled!==true
    ||runtime.rosterCount!==72
    ||runtime.mismatches.length>0
    ||runtime.engineApplyCount!==1
    ||Number(runtime.engineRejectedApplyCount||0)!==0
    ||runtime.engineApplyAttempts.length!==1
    ||runtime.engineApplyAttempts[0]?.reason!=='stage3-scoring-ownership-finalizer'
    ||runtime.engineApplyAttempts[0]?.accepted!==true
    ||runtime.finalEngineAliasIsCanonical!==true
    ||runtime.legacyGlobals.dynamicRosterRepair!==false
    ||runtime.legacyGlobals.eraDepthFinalizer!==false
    ||runtime.lossEvidence.applied!==true
    ||runtime.lossEvidence.rosterCount!==72
    ||Number(runtime.lossEvidence.mismatchCount||0)!==0
    ||runtime.lossEvidence.mutatesScores!==false
    ||runtime.lossEvidence.mutatesPenalty!==false
    ||runtime.eraEvidence.applied!==true
    ||runtime.eraEvidence.rosterCount!==72
    ||Number(runtime.eraEvidence.mismatchCount||0)!==0
    ||runtime.eraEvidence.mutatesScores!==false
    ||runtime.eraEvidence.mutatesAdjustment!==false
    ||Number(runtime.contract.wrongOwnerCount||0)!==0
    ||Number(runtime.contract.displayOverrideViolationCount||0)!==0
    ||Number(runtime.contract.compareScoreViolationCount||0)!==0
    ||Number(runtime.contract.missingLossContextDetailCount||0)!==0
    ||Number(runtime.contract.missingEraDepthDetailCount||0)!==0
    ||errors.length>0;
  if(failed)process.exitCode=1;
}finally{
  await browser.close();
}

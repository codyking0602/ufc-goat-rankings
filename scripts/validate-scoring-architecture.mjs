import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import * as acorn from 'acorn';

const ROOT=process.cwd();
const CONTRACT_PATH='docs/scoring-architecture-contract.json';
const REPORT_PATH='docs/scoring-architecture-guardrails-report.json';
const URL=process.env.UFC_APP_URL||'http://127.0.0.1:4173/index.html?scoring-architecture-guardrails=1';
const contract=JSON.parse(await fs.readFile(path.join(ROOT,CONTRACT_PATH),'utf8'));

async function exists(relative){
  try{await fs.access(path.join(ROOT,relative));return true;}catch{return false;}
}
function propertyName(node){
  if(!node)return null;
  if(node.type==='Property'){
    if(!node.computed&&node.key?.type==='Identifier')return node.key.name;
    if(node.key?.type==='Literal')return String(node.key.value);
  }
  return null;
}
function traverse(node,visit){
  if(!node||typeof node!=='object')return;
  visit(node);
  for(const value of Object.values(node)){
    if(Array.isArray(value))value.forEach(item=>traverse(item,visit));
    else if(value&&typeof value==='object'&&typeof value.type==='string')traverse(value,visit);
  }
}
function childObject(objectNode,name){
  const property=objectNode?.properties?.find(item=>propertyName(item)===name);
  return property?.value?.type==='ObjectExpression'?property.value:null;
}
function findPacketObject(ast){
  let packet=null;
  traverse(ast,node=>{
    if(!packet&&node.type==='VariableDeclarator'&&node.id?.type==='Identifier'&&node.id.name==='packet'&&node.init?.type==='ObjectExpression')packet=node.init;
  });
  return packet;
}
function inspectDisplayOverrides(overrides){
  const violations=[];
  const direct=contract.presentation.forbiddenDirectFields;
  const nested=contract.presentation.forbiddenNestedFields;
  const categoryFields=contract.presentation.forbiddenCategoryFields;
  Object.entries(overrides||{}).forEach(([fighter,override])=>{
    if(!override||typeof override!=='object')return;
    direct.forEach(field=>{if(Object.prototype.hasOwnProperty.call(override,field))violations.push({fighter,field});});
    ['snapshotStats','packetProfileStats'].forEach(container=>{
      const target=override[container];
      if(!target||typeof target!=='object')return;
      nested.forEach(field=>{if(Object.prototype.hasOwnProperty.call(target,field))violations.push({fighter,field:`${container}.${field}`});});
    });
    Object.entries(override.categories||{}).forEach(([category,entry])=>{
      if(!entry||typeof entry!=='object')return;
      categoryFields.forEach(field=>{if(Object.prototype.hasOwnProperty.call(entry,field))violations.push({fighter,field:`categories.${category}.${field}`});});
    });
  });
  return violations;
}

async function staticAudit(){
  const requiredFiles=[
    CONTRACT_PATH,
    contract.facts.path,
    contract.judgments.path,
    contract.calculators.path,
    contract.pipeline.path,
    contract.bootstrap.path,
    contract.profileRuntime.path,
    contract.presentation.displayOverridesPath,
    'index.html'
  ];
  const missingRequired=[];
  for(const file of requiredFiles)if(!await exists(file))missingRequired.push(file);

  const read=async file=>await fs.readFile(path.join(ROOT,file),'utf8');
  const indexSource=await read('index.html');
  const calculatorSource=await read(contract.calculators.path);
  const pipelineSource=await read(contract.pipeline.path);
  const bootstrapSource=await read(contract.bootstrap.path);
  const displaySource=await read(contract.presentation.displayOverridesPath);

  const forbiddenIndexReferences=contract.forbiddenIndexReferences.filter(reference=>indexSource.includes(reference));
  const requiredIndexOrder=contract.bootstrap.requiredIndexOrder.map(script=>({
    script,index:indexSource.indexOf(script),occurrences:indexSource.split(script).length-1
  }));
  const requiredIndexOrderPassed=requiredIndexOrder.every(item=>item.index>=0&&item.occurrences===1)
    &&requiredIndexOrder.every((item,index)=>index===0||requiredIndexOrder[index-1].index<item.index);

  const calculatorChecks={
    version:calculatorSource.includes(contract.calculators.version),
    directSeven:calculatorSource.includes('seven-direct-calculators'),
    noFrozenControls:!calculatorSource.includes('UFC_CANONICAL_SCORING_RECORDS'),
    noPrimeReconstruction:!calculatorSource.includes('UFC_CANONICAL_PRIME_DOMINANCE_RECONSTRUCTION'),
    noLongevityReconstruction:!calculatorSource.includes('UFC_CANONICAL_LONGEVITY_RECONSTRUCTION'),
    explicitNoMigrationReports:calculatorSource.includes('readsMigrationReconstructionReports:false')
  };
  const pipelineChecks={
    version:pipelineSource.includes(contract.pipeline.version),
    weights:pipelineSource.includes('championship:35,opponentQuality:25,primeDominance:30,longevity:10'),
    fixedOvr:pipelineSource.includes('OVR_FLOOR=82')&&pipelineSource.includes('OVR_CEILING=99')&&pipelineSource.includes('OVR_CURVE=.85'),
    noFrozenAuthority:pipelineSource.includes('readsFrozenExpectedOutputsAsAuthority:false'),
    noShadowAuthority:pipelineSource.includes('readsShadowFinalOrOvrReportsAsAuthority:false')
  };
  const bootstrapChecks={
    appliesPipeline:bootstrapSource.includes('UFC_RANKING_PIPELINE.apply')||bootstrapSource.includes('pipeline.apply()'),
    loadsCalculatedProfile:bootstrapSource.includes('calculated-profile-runtime.js'),
    noLegacyEngine:!bootstrapSource.includes('scoring-engine.js'),
    noLegacyFinalizer:!bootstrapSource.includes('scoring-ownership-finalizer.js'),
    publishesReady:bootstrapSource.includes("data-scoring-pipeline','ready")
  };

  const sandbox={};
  vm.runInNewContext(`${displaySource}\n;globalThis.__GUARD_DISPLAY_OVERRIDES__=DISPLAY_OVERRIDES;`,sandbox,{filename:contract.presentation.displayOverridesPath,timeout:5000});
  const displayOverrideViolations=inspectDisplayOverrides(sandbox.__GUARD_DISPLAY_OVERRIDES__);

  const packetViolations=[];
  const packetDirectory=path.join(ROOT,contract.presentation.fighterPacketsDirectory);
  if(await exists(contract.presentation.fighterPacketsDirectory)){
    const entries=await fs.readdir(packetDirectory,{withFileTypes:true});
    const forbidden=new Set(contract.presentation.fighterPacketForbiddenDisplayFields);
    for(const entry of entries){
      if(!entry.isFile()||!entry.name.endsWith('.js'))continue;
      const relative=path.join(contract.presentation.fighterPacketsDirectory,entry.name).replaceAll('\\','/');
      const source=await read(relative);
      const ast=acorn.parse(source,{ecmaVersion:'latest',sourceType:'script',locations:true});
      const display=childObject(findPacketObject(ast),'display');
      display?.properties?.forEach(property=>{
        const field=propertyName(property);
        if(forbidden.has(field))packetViolations.push({file:relative,field,line:property.loc?.start?.line??null});
      });
    }
  }

  const passed=missingRequired.length===0
    &&forbiddenIndexReferences.length===0
    &&requiredIndexOrderPassed
    &&Object.values(calculatorChecks).every(Boolean)
    &&Object.values(pipelineChecks).every(Boolean)
    &&Object.values(bootstrapChecks).every(Boolean)
    &&displayOverrideViolations.length===0
    &&packetViolations.length===0;

  return{passed,missingRequired,forbiddenIndexReferences,requiredIndexOrder,requiredIndexOrderPassed,calculatorChecks,pipelineChecks,bootstrapChecks,displayOverrideViolations,packetViolations};
}

const source=await staticAudit();
const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage({viewport:{width:1440,height:1200}});
  const errors=[];
  const consoleErrors=[];
  page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
  page.on('pageerror',error=>errors.push(error?.stack||error?.message||String(error)));
  await page.goto(URL,{waitUntil:'domcontentloaded',timeout:60_000});
  await page.waitForFunction(()=>document.documentElement.getAttribute('data-scoring-pipeline')==='ready'||window.UFC_PRODUCTION_RANKING_BOOTSTRAP?.status==='error',null,{timeout:120_000,polling:100});
  await page.waitForTimeout(2000);

  const runtime=await page.evaluate(contractValue=>{
    const num=value=>Number.isFinite(Number(value))?Number(value):0;
    const round2=value=>Math.round((num(value)+Number.EPSILON)*100)/100;
    const key=name=>String(name||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
    const data=window.RANKING_DATA||{};
    const calculators=window.UFC_CATEGORY_CALCULATORS||{};
    const audit=window.UFC_CATEGORY_CALCULATOR_AUDIT||{};
    const pipeline=window.UFC_RANKING_PIPELINE||{};
    const projection=window.UFC_CALCULATED_RANKING_PROJECTION||{};
    const bootstrap=window.UFC_PRODUCTION_RANKING_BOOTSTRAP||{};
    const profileRuntime=window.UFC_CALCULATED_PROFILE_RUNTIME||{};
    const judgments=window.UFC_CANONICAL_SCORING_JUDGMENTS||{};
    const rows=[...(data.men||[]),...(data.women||[])];
    const profiles=data.fighters||[];
    const boardByKey=new Map(rows.map(row=>[key(row.fighter),row]));
    const formulaMismatches=[];
    const profileMismatches=[];
    rows.forEach(row=>{
      const computed=round2(
        num(row.championship)/30*35+
        num(row.opponentQuality)/30*25+
        num(row.primeDominance)/30*30+
        num(row.longevity)/30*10+
        num(row.apexPeak)+num(row.penalty)+num(row.eraDepthAdjustment)
      );
      if(Math.abs(computed-num(row.totalScore))>.011)formulaMismatches.push({fighter:row.fighter,computed,actual:row.totalScore});
    });
    profiles.forEach(profile=>{
      const board=boardByKey.get(key(profile.fighter));
      if(!board){profileMismatches.push({fighter:profile.fighter,field:'missing-board-row'});return;}
      ['rank','overallOvr','totalScore','championship','opponentQuality','primeDominance','longevity','apexPeak','penalty','eraDepthAdjustment'].forEach(field=>{
        if(Math.abs(num(profile[field])-num(board[field]))>.001)profileMismatches.push({fighter:profile.fighter,field,board:board[field],profile:profile[field]});
      });
    });

    const displayViolations=[];
    Object.entries(window.DISPLAY_OVERRIDES||{}).forEach(([fighter,override])=>{
      contractValue.presentation.forbiddenDirectFields.forEach(field=>{if(Object.prototype.hasOwnProperty.call(override||{},field))displayViolations.push({fighter,field});});
      ['snapshotStats','packetProfileStats'].forEach(container=>{
        const target=override?.[container];
        contractValue.presentation.forbiddenNestedFields.forEach(field=>{if(Object.prototype.hasOwnProperty.call(target||{},field))displayViolations.push({fighter,field:`${container}.${field}`});});
      });
      Object.entries(override?.categories||{}).forEach(([category,entry])=>{
        contractValue.presentation.forbiddenCategoryFields.forEach(field=>{if(Object.prototype.hasOwnProperty.call(entry||{},field))displayViolations.push({fighter,field:`categories.${category}.${field}`});});
      });
    });

    const runtimeGlobals={};
    contractValue.forbiddenRuntimeGlobals.forEach(name=>{runtimeGlobals[name]=typeof window[name]!=='undefined';});
    const entry=name=>rows.find(row=>key(row.fighter)===key(name))||null;
    const keyResults={};
    Object.keys(contractValue.keyResults).forEach(name=>{const row=entry(name);keyResults[name]=row?{rank:row.rank,overallOvr:row.overallOvr}:null;});

    return{
      bootstrap:{version:bootstrap.version||null,status:bootstrap.status||null,error:bootstrap.error||null},
      rosterCount:rows.length,
      uniqueRosterCount:new Set(rows.map(row=>key(row.fighter))).size,
      factsCount:window.UFC_CANONICAL_FIGHTER_FACTS?.count?.()||0,
      judgments:{fighterCount:judgments.fighterCount||0,ownsCalculatedScores:judgments.ownsCalculatedScores,ownsTotalsRanksOrOvr:judgments.ownsTotalsRanksOrOvr},
      calculators:{version:calculators.version||null,owners:calculators.calculatorOwners||null,readsFrozenExpectedOutputs:calculators.readsFrozenExpectedOutputs,readsFrozenCategoryControls:calculators.readsFrozenCategoryControls,readsMigrationReconstructionReports:calculators.readsMigrationReconstructionReports},
      categoryAudit:{passed:audit.passed===true,fighterCount:audit.fighterCount||0,completeFighterCount:audit.completeFighterCount||0,blockedFighterCount:audit.blockedFighterCount||0},
      pipeline:{version:pipeline.version||null,weights:pipeline.weights||null,categoryMax:pipeline.categoryMax||null,ovr:pipeline.ovr||null,latest:pipeline.latest||null},
      scoreMode:data.liveScoreMode||null,
      topTen:(data.men||[]).slice(0,10).map(row=>row.fighter),
      projectionTopTen:(projection.men||[]).slice(0,10).map(row=>row.fighter),
      keyResults,
      formulaMismatches,
      profileMismatches,
      displayViolations,
      profileRuntime:{snapshotOwner:profileRuntime.snapshotOwner||null,rankOwner:profileRuntime.rankOwner||null,ovrOwner:profileRuntime.ovrOwner||null},
      compareSource:window.COMPARE_PROFILES?.['Jon Jones']?.legacyStats?.source||null,
      runtimeGlobals
    };
  },contract);

  const failures=[];
  const requireRuntime=(condition,code,detail)=>{if(!condition)failures.push({code,detail});};
  requireRuntime(runtime.bootstrap.status==='ready','bootstrap-status',runtime.bootstrap);
  requireRuntime(runtime.rosterCount===contract.expectedRosterCount,'roster-count',{expected:contract.expectedRosterCount,actual:runtime.rosterCount});
  requireRuntime(runtime.uniqueRosterCount===contract.expectedRosterCount,'unique-roster-count',{expected:contract.expectedRosterCount,actual:runtime.uniqueRosterCount});
  requireRuntime(runtime.factsCount===contract.expectedRosterCount,'facts-count',{expected:contract.expectedRosterCount,actual:runtime.factsCount});
  requireRuntime(runtime.judgments.fighterCount===contract.judgments.expectedFighterCount,'judgment-count',runtime.judgments);
  requireRuntime(runtime.judgments.ownsCalculatedScores===contract.judgments.ownsCalculatedScores,'judgments-score-ownership',runtime.judgments);
  requireRuntime(runtime.judgments.ownsTotalsRanksOrOvr===contract.judgments.ownsTotalsRanksOrOvr,'judgments-total-ownership',runtime.judgments);
  requireRuntime(runtime.calculators.version===contract.calculators.version,'calculator-version',{expected:contract.calculators.version,actual:runtime.calculators.version});
  requireRuntime(runtime.calculators.readsFrozenExpectedOutputs===false,'calculator-frozen-expected-outputs',runtime.calculators);
  requireRuntime(runtime.calculators.readsFrozenCategoryControls===false,'calculator-frozen-category-controls',runtime.calculators);
  requireRuntime(runtime.calculators.readsMigrationReconstructionReports===false,'calculator-migration-reports',runtime.calculators);
  requireRuntime(runtime.categoryAudit.passed===true&&runtime.categoryAudit.completeFighterCount===contract.expectedRosterCount&&runtime.categoryAudit.blockedFighterCount===0,'category-audit',runtime.categoryAudit);
  requireRuntime(runtime.pipeline.version===contract.pipeline.version,'pipeline-version',{expected:contract.pipeline.version,actual:runtime.pipeline.version});
  requireRuntime(JSON.stringify(runtime.pipeline.weights)===JSON.stringify(contract.pipeline.weights),'pipeline-weights',{expected:contract.pipeline.weights,actual:runtime.pipeline.weights});
  requireRuntime(runtime.pipeline.categoryMax===contract.pipeline.categoryMax,'category-max',{expected:contract.pipeline.categoryMax,actual:runtime.pipeline.categoryMax});
  requireRuntime(JSON.stringify(runtime.pipeline.ovr)===JSON.stringify(contract.pipeline.ovr),'ovr-contract',{expected:contract.pipeline.ovr,actual:runtime.pipeline.ovr});
  requireRuntime(runtime.scoreMode==='fight-level-calculated-single-owner','score-mode',{actual:runtime.scoreMode});
  requireRuntime(JSON.stringify(runtime.topTen)===JSON.stringify(contract.approvedMenTopTen),'approved-top-ten',{expected:contract.approvedMenTopTen,actual:runtime.topTen});
  requireRuntime(JSON.stringify(runtime.projectionTopTen)===JSON.stringify(contract.approvedMenTopTen),'projection-top-ten',{expected:contract.approvedMenTopTen,actual:runtime.projectionTopTen});
  Object.entries(contract.keyResults).forEach(([fighter,expected])=>{
    const actual=runtime.keyResults[fighter];
    if(Object.prototype.hasOwnProperty.call(expected,'rank'))requireRuntime(actual?.rank===expected.rank,'key-rank',{fighter,expected:expected.rank,actual:actual?.rank});
    if(Object.prototype.hasOwnProperty.call(expected,'overallOvr'))requireRuntime(actual?.overallOvr===expected.overallOvr,'key-ovr',{fighter,expected:expected.overallOvr,actual:actual?.overallOvr});
  });
  requireRuntime(runtime.formulaMismatches.length===0,'formula-mismatches',{count:runtime.formulaMismatches.length,sample:runtime.formulaMismatches.slice(0,10)});
  requireRuntime(runtime.profileMismatches.length===0,'profile-mismatches',{count:runtime.profileMismatches.length,sample:runtime.profileMismatches.slice(0,10)});
  requireRuntime(runtime.displayViolations.length===0,'runtime-display-violations',{count:runtime.displayViolations.length,sample:runtime.displayViolations.slice(0,10)});
  requireRuntime(runtime.profileRuntime.snapshotOwner===contract.profileRuntime.snapshotOwner,'profile-snapshot-owner',runtime.profileRuntime);
  requireRuntime(runtime.profileRuntime.rankOwner===contract.profileRuntime.rankOwner,'profile-rank-owner',runtime.profileRuntime);
  requireRuntime(runtime.profileRuntime.ovrOwner===contract.profileRuntime.ovrOwner,'profile-ovr-owner',runtime.profileRuntime);
  requireRuntime(runtime.compareSource==='calculated-ranking-pipeline','compare-source',{actual:runtime.compareSource});
  requireRuntime(Object.values(runtime.runtimeGlobals).every(value=>value===false),'legacy-runtime-globals',runtime.runtimeGlobals);

  const report={
    generatedAt:new Date().toISOString(),contractVersion:contract.version,url:URL,source,runtime,runtimeFailures:failures,
    browserDiagnostics:{errors,consoleErrors},passed:source.passed&&failures.length===0&&errors.length===0
  };
  await fs.mkdir(path.dirname(REPORT_PATH),{recursive:true});
  await fs.writeFile(REPORT_PATH,`${JSON.stringify(report,null,2)}\n`,'utf8');
  console.log('SCORING_ARCHITECTURE_GUARDRAILS');
  console.log(JSON.stringify(report,null,2));
  if(!report.passed)process.exitCode=1;
}finally{
  await browser.close();
}

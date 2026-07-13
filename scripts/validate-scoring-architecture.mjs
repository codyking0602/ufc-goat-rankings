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
async function walk(relative){
  const absolute=path.join(ROOT,relative);
  const entries=await fs.readdir(absolute,{withFileTypes:true});
  const files=[];
  for(const entry of entries){
    const child=path.join(relative,entry.name).replaceAll('\\','/');
    if(entry.isDirectory())files.push(...await walk(child));
    else files.push(child);
  }
  return files;
}
function countOccurrences(source,needle){
  if(!needle)return 0;
  let count=0;
  let index=0;
  while((index=source.indexOf(needle,index))!==-1){count+=1;index+=needle.length;}
  return count;
}
function propertyName(node){
  if(!node)return null;
  if(node.type==='MemberExpression'){
    if(!node.computed&&node.property?.type==='Identifier')return node.property.name;
    if(node.computed&&node.property?.type==='Literal')return String(node.property.value);
  }
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
function assignmentProperties(source,filename){
  const ast=acorn.parse(source,{ecmaVersion:'latest',sourceType:'script',locations:true});
  const writes=[];
  traverse(ast,node=>{
    if(node.type==='AssignmentExpression'&&node.left?.type==='MemberExpression'){
      writes.push({property:propertyName(node.left),line:node.loc?.start?.line??null,kind:'assignment'});
    }
    if(node.type==='UpdateExpression'&&node.argument?.type==='MemberExpression'){
      writes.push({property:propertyName(node.argument),line:node.loc?.start?.line??null,kind:'update'});
    }
    if(node.type==='CallExpression'&&node.callee?.type==='MemberExpression'){
      const object=node.callee.object;
      const method=propertyName(node.callee);
      const isObjectAssign=method==='assign'&&object?.type==='Identifier'&&object.name==='Object';
      if(isObjectAssign){
        node.arguments.slice(1).forEach(argument=>{
          if(argument?.type!=='ObjectExpression')return;
          argument.properties.forEach(property=>writes.push({property:propertyName(property),line:property.loc?.start?.line??null,kind:'object-assign'}));
        });
      }
    }
  });
  return writes.filter(write=>write.property).map(write=>({...write,file:filename}));
}
function childObject(objectNode,name){
  const property=objectNode?.properties?.find(item=>propertyName(item)===name);
  return property?.value?.type==='ObjectExpression'?property.value:null;
}
function findPacketObject(ast){
  let packet=null;
  traverse(ast,node=>{
    if(packet)return;
    if(node.type==='VariableDeclarator'&&node.id?.type==='Identifier'&&node.id.name==='packet'&&node.init?.type==='ObjectExpression')packet=node.init;
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
    contract.canonical.path,
    contract.engine.path,
    contract.finalizer.path,
    contract.pipeline.path,
    contract.presentation.displayOverridesPath,
    ...contract.evidenceProviders.map(provider=>provider.path)
  ];
  const missingRequired=[];
  for(const file of requiredFiles){if(!await exists(file))missingRequired.push(file);}

  const forbiddenPresent=[];
  for(const file of [...contract.deletedLegacyFiles,...contract.supersededGuardrailFiles]){
    if(await exists(file))forbiddenPresent.push(file);
  }

  const productionFiles=['index.html',...(await walk('assets')).filter(file=>file.endsWith('.js'))];
  const sourceByFile=new Map();
  for(const file of productionFiles)sourceByFile.set(file,await fs.readFile(path.join(ROOT,file),'utf8'));

  const loaderFiles=['index.html',contract.pipeline.path,'assets/data/ranking-data-patches.js','assets/data/loss-context-exposure-ledger.js'];
  const forbiddenReferences=[];
  for(const file of loaderFiles){
    const source=sourceByFile.get(file)??await fs.readFile(path.join(ROOT,file),'utf8');
    contract.forbiddenLegacyReferences.forEach(reference=>{
      if(source.includes(reference))forbiddenReferences.push({file,reference});
    });
  }

  const engineDefinitionFiles=[];
  const aliasDefinitionFiles=[];
  const directGlobalApplyFiles=[];
  const suspiciousLocalEngineApplyFiles=[];
  for(const [file,source] of sourceByFile){
    if(/window\.UFC_SCORING_ENGINE\s*=/.test(source))engineDefinitionFiles.push(file);
    if(/window\.UFC_FINAL_SCORE_ENGINE\s*=/.test(source))aliasDefinitionFiles.push(file);
    if(/window\.(?:UFC_SCORING_ENGINE|UFC_FINAL_SCORE_ENGINE)(?:\?\.|\.)apply\s*\(/.test(source))directGlobalApplyFiles.push(file);
    if(file!==contract.engine.path&&file!==contract.finalizer.path&&source.includes('UFC_SCORING_ENGINE')&&/\bengine(?:\?\.|\.)apply\s*\(/.test(source))suspiciousLocalEngineApplyFiles.push(file);
  }

  const engineSource=sourceByFile.get(contract.engine.path)||'';
  const finalizerSource=sourceByFile.get(contract.finalizer.path)||'';
  const pipelineSource=sourceByFile.get(contract.pipeline.path)||'';
  const canonicalSource=sourceByFile.get(contract.canonical.path)||await fs.readFile(path.join(ROOT,contract.canonical.path),'utf8');
  const canonicalShaMatch=canonicalSource.match(/const\s+SOURCE_SHA\s*=\s*["']([^"']+)["']/);
  const canonicalVersionMatch=canonicalSource.match(/const\s+VERSION\s*=\s*["']([^"']+)["']/);
  const sourceContract={
    canonicalSourceSha:canonicalShaMatch?.[1]||null,
    canonicalVersion:canonicalVersionMatch?.[1]||null,
    engineVersionPresent:engineSource.includes(`const VERSION='${contract.engine.version}'`)||engineSource.includes(`const VERSION=\"${contract.engine.version}\"`),
    formulaPresent:engineSource.includes(contract.engine.formula),
    authorizedReasonPresent:engineSource.includes(contract.engine.authorizedApplyReason),
    finalizerVersionPresent:finalizerSource.includes(`const VERSION='${contract.finalizer.version}'`)||finalizerSource.includes(`const VERSION=\"${contract.finalizer.version}\"`),
    finalizerModePresent:finalizerSource.includes(contract.finalizer.expectedMode),
    pipelineModePresent:pipelineSource.includes(contract.pipeline.expectedMode),
    finalizerApplyCallCount:(finalizerSource.match(/\bengine(?:\?\.|\.)apply\s*\(/g)||[]).length,
    finalizerAuthorizedReasonPresent:finalizerSource.includes(contract.engine.authorizedApplyReason)
  };

  const indexSource=sourceByFile.get('index.html')||'';
  const scriptOrder=contract.requiredScriptOrder.map(script=>({
    script,
    index:indexSource.indexOf(script),
    occurrences:countOccurrences(indexSource,script)
  }));
  const scriptOrderPassed=scriptOrder.every(item=>item.index>=0&&item.occurrences===1)
    &&scriptOrder.every((item,index)=>index===0||scriptOrder[index-1].index<item.index);

  const displaySource=sourceByFile.get(contract.presentation.displayOverridesPath)||'';
  const sandbox={};
  vm.runInNewContext(`${displaySource}\n;globalThis.__SCORING_GUARD_DISPLAY_OVERRIDES__=DISPLAY_OVERRIDES;`,sandbox,{filename:contract.presentation.displayOverridesPath,timeout:5000});
  const displayOverrideViolations=inspectDisplayOverrides(sandbox.__SCORING_GUARD_DISPLAY_OVERRIDES__);

  const packetViolations=[];
  const packetDirectory=path.join(ROOT,contract.presentation.fighterPacketsDirectory);
  const packetEntries=await fs.readdir(packetDirectory,{withFileTypes:true});
  const packetForbidden=new Set(contract.presentation.fighterPacketForbiddenDisplayFields);
  for(const entry of packetEntries){
    if(!entry.isFile()||!entry.name.endsWith('.js'))continue;
    const relative=path.join(contract.presentation.fighterPacketsDirectory,entry.name).replaceAll('\\','/');
    const source=await fs.readFile(path.join(ROOT,relative),'utf8');
    const ast=acorn.parse(source,{ecmaVersion:'latest',sourceType:'script',locations:true});
    const packet=findPacketObject(ast);
    const display=childObject(packet,'display');
    if(!display)continue;
    display.properties.forEach(property=>{
      const field=propertyName(property);
      if(packetForbidden.has(field))packetViolations.push({file:relative,field,line:property.loc?.start?.line??null});
    });
  }

  const evidenceMutationViolations=[];
  const commonForbidden=new Set(['totalScore','rawScore','rank','overallOvr','scoreFormula','weightedScoreBreakdown','baseScore','preEraDepthTotalScore']);
  for(const provider of contract.evidenceProviders){
    const source=sourceByFile.get(provider.path)||'';
    const writes=assignmentProperties(source,provider.path);
    const forbidden=new Set(commonForbidden);
    if(provider.global==='UFC_LOSS_CONTEXT_HYBRID_LIVE'){
      ['penalty','lossPenalty','lossContext'].forEach(field=>forbidden.add(field));
    }
    if(provider.global==='UFC_DIVISION_ERA_DEPTH_LIVE')forbidden.add('eraDepthAdjustment');
    writes.filter(write=>forbidden.has(write.property)).forEach(write=>evidenceMutationViolations.push(write));
  }

  const passed=missingRequired.length===0
    &&forbiddenPresent.length===0
    &&forbiddenReferences.length===0
    &&engineDefinitionFiles.length===1&&engineDefinitionFiles[0]===contract.engine.path
    &&JSON.stringify([...aliasDefinitionFiles].sort())===JSON.stringify([...(contract.engine.aliasDefinitionPaths||[])].sort())
    &&directGlobalApplyFiles.length===0
    &&suspiciousLocalEngineApplyFiles.length===0
    &&sourceContract.canonicalSourceSha===contract.canonical.sourceSha
    &&sourceContract.canonicalVersion===contract.canonical.version
    &&sourceContract.engineVersionPresent
    &&sourceContract.formulaPresent
    &&sourceContract.authorizedReasonPresent
    &&sourceContract.finalizerVersionPresent
    &&sourceContract.finalizerModePresent
    &&sourceContract.pipelineModePresent
    &&sourceContract.finalizerApplyCallCount===1
    &&sourceContract.finalizerAuthorizedReasonPresent
    &&scriptOrderPassed
    &&displayOverrideViolations.length===0
    &&packetViolations.length===0
    &&evidenceMutationViolations.length===0;

  return {
    passed,
    missingRequired,
    forbiddenPresent,
    forbiddenReferences,
    engineDefinitionFiles,
    aliasDefinitionFiles,
    directGlobalApplyFiles,
    suspiciousLocalEngineApplyFiles,
    sourceContract,
    scriptOrder,
    scriptOrderPassed,
    displayOverrideViolations,
    packetViolations,
    evidenceMutationViolations
  };
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
  await page.waitForFunction(()=>window.UFC_SCORING_PIPELINE?.status==='ready'||window.UFC_SCORING_PIPELINE?.status==='error',null,{timeout:120_000,polling:100});
  await page.waitForFunction(()=>window.UFC_SCORING_OWNERSHIP_CONTRACT?.applied===true,null,{timeout:30_000,polling:100});

  const runtime=await page.evaluate(contractValue=>{
    const num=value=>Number.isFinite(Number(value))?Number(value):0;
    const round2=value=>Math.round((num(value)+Number.EPSILON)*100)/100;
    const key=name=>String(name||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
    const data=window.RANKING_DATA||{};
    const canonical=window.UFC_CANONICAL_SCORING_RECORDS||{};
    const engine=window.UFC_SCORING_ENGINE||{};
    const ownership=window.UFC_SCORING_OWNERSHIP_CONTRACT||{};
    const pipeline=window.UFC_SCORING_PIPELINE||{};
    const rows=[...(data.men||[]),...(data.women||[])];
    const profiles=data.fighters||[];
    const byKey=new Map(rows.map(row=>[key(row.fighter),row]));
    const mismatches=[];
    const formulaMismatches=[];
    const profileMismatches=[];
    const inputFields=contractValue.engine.scoreInputFields;

    rows.forEach(row=>{
      const expected=canonical.entryFor?.(row.fighter);
      if(!expected){mismatches.push({fighter:row.fighter,field:'missing-canonical'});return;}
      inputFields.forEach(field=>{
        if(Math.abs(num(row[field])-num(expected[field]))>.001)mismatches.push({fighter:row.fighter,field,expected:expected[field],actual:row[field]});
      });
      if(Math.abs(num(row.totalScore)-num(expected.expectedTotalScore))>.011)mismatches.push({fighter:row.fighter,field:'totalScore',expected:expected.expectedTotalScore,actual:row.totalScore});
      if(num(row.rank)!==num(expected.expectedRank))mismatches.push({fighter:row.fighter,field:'rank',expected:expected.expectedRank,actual:row.rank});
      if(num(row.overallOvr)!==num(expected.expectedOverallOvr))mismatches.push({fighter:row.fighter,field:'overallOvr',expected:expected.expectedOverallOvr,actual:row.overallOvr});
      const computed=round2(num(row.championship)/30*35+num(row.opponentQuality)/30*27.5+num(row.primeDominance)/30*27.5+num(row.longevity)/30*10+num(row.apexPeak)+num(row.penalty)+num(row.eraDepthAdjustment));
      if(Math.abs(computed-num(row.totalScore))>.011)formulaMismatches.push({fighter:row.fighter,computed,actual:row.totalScore});
    });

    profiles.forEach(profile=>{
      const board=byKey.get(key(profile.fighter));
      if(!board){profileMismatches.push({fighter:profile.fighter,field:'missing-board-row'});return;}
      [...inputFields,'totalScore','rank','overallOvr'].forEach(field=>{
        if(Math.abs(num(profile[field])-num(board[field]))>.001)profileMismatches.push({fighter:profile.fighter,field,board:board[field],profile:profile[field]});
      });
    });

    const direct=contractValue.presentation.forbiddenDirectFields;
    const nested=contractValue.presentation.forbiddenNestedFields;
    const categoryFields=contractValue.presentation.forbiddenCategoryFields;
    const displayViolations=[];
    Object.entries(window.DISPLAY_OVERRIDES||{}).forEach(([fighter,override])=>{
      if(!override||typeof override!=='object')return;
      direct.forEach(field=>{if(Object.prototype.hasOwnProperty.call(override,field))displayViolations.push({fighter,field});});
      ['snapshotStats','packetProfileStats'].forEach(container=>{
        const target=override[container];
        if(!target||typeof target!=='object')return;
        nested.forEach(field=>{if(Object.prototype.hasOwnProperty.call(target,field))displayViolations.push({fighter,field:`${container}.${field}`});});
      });
      Object.entries(override.categories||{}).forEach(([category,entry])=>{
        if(!entry||typeof entry!=='object')return;
        categoryFields.forEach(field=>{if(Object.prototype.hasOwnProperty.call(entry,field))displayViolations.push({fighter,field:`categories.${category}.${field}`});});
      });
    });
    const compareViolations=[];
    Object.entries(window.COMPARE_PROFILES||{}).forEach(([fighter,profile])=>{
      if(!profile||typeof profile!=='object')return;
      direct.forEach(field=>{if(Object.prototype.hasOwnProperty.call(profile,field))compareViolations.push({fighter,field});});
    });

    const scripts=[...document.scripts].map(script=>{
      try{return new URL(script.src,location.href).pathname.replace(/^\//,'');}catch{return '';}
    }).filter(Boolean);
    const requiredScriptOrder=contractValue.requiredScriptOrder.map(script=>({script,index:scripts.findIndex(source=>source===script),occurrences:scripts.filter(source=>source===script).length}));
    const scriptOrderPassed=requiredScriptOrder.every(item=>item.index>=0&&item.occurrences===1)
      &&requiredScriptOrder.every((item,index)=>index===0||requiredScriptOrder[index-1].index<item.index);

    const loss=window.UFC_LOSS_CONTEXT_HYBRID_LIVE||{};
    const era=window.UFC_DIVISION_ERA_DEPTH_LIVE||{};
    const runtimeGlobals={};
    contractValue.forbiddenRuntimeGlobals.forEach(name=>{runtimeGlobals[name]=typeof window[name]!=='undefined';});

    return {
      rosterCount:rows.length,
      uniqueRosterCount:new Set(rows.map(row=>key(row.fighter))).size,
      canonical:{version:canonical.version||null,sourceSha:canonical.sourceFighterDataSha256||null,recordCount:canonical.recordCount??null},
      engine:{
        version:engine.version||null,
        formula:engine.formula||null,
        weights:engine.weights||null,
        max:engine.max||null,
        scoreInputFields:engine.scoreInputFields||null,
        authorizedApplyReason:engine.authorizedApplyReason||null,
        applyCount:engine.applyCount??null,
        rejectedApplyCount:engine.rejectedApplyCount??null,
        applyAttempts:(engine.applyAttempts||[]).map(item=>({...item})),
        parity:engine.parityReport?.()||null,
        aliasIsCanonical:window.UFC_FINAL_SCORE_ENGINE===window.UFC_SCORING_ENGINE
      },
      pipeline:{version:pipeline.version||null,status:pipeline.status||null,mode:pipeline.mode||null,finalScoreApplyCount:pipeline.finalScoreApplyCount??null},
      ownership:{
        version:ownership.version||null,
        applied:ownership.applied===true,
        status:ownership.status||null,
        mode:ownership.mode||null,
        rosterCount:ownership.rosterCount??null,
        wrongOwnerCount:ownership.wrongOwnerCount??null,
        displayOverrideViolationCount:ownership.displayOverrideViolationCount??null,
        compareScoreViolationCount:ownership.compareScoreViolationCount??null,
        missingLossContextDetailCount:ownership.missingLossContextDetailCount??null,
        missingEraDepthDetailCount:ownership.missingEraDepthDetailCount??null,
        owners:ownership.owners||null
      },
      lossEvidence:{version:loss.version||null,applied:loss.applied===true,mode:loss.mode||null,runtimeRole:loss.runtimeRole||null,rosterCount:loss.rosterCount??null,mismatchCount:loss.mismatchCount??null,mutatesScores:loss.mutatesScores??null,mutatesPenalty:loss.mutatesPenalty??null},
      eraEvidence:{version:era.version||null,applied:era.applied===true,mode:era.mode||null,runtimeRole:era.runtimeRole||null,rosterCount:era.rosterCount??null,mismatchCount:era.mismatchCount??null,mutatesScores:era.mutatesScores??null,mutatesAdjustment:era.mutatesAdjustment??null},
      mismatches,
      formulaMismatches,
      profileMismatches,
      displayViolations,
      compareViolations,
      requiredScriptOrder,
      scriptOrderPassed,
      runtimeGlobals
    };
  },contract);

  const expectedWeights=JSON.stringify(contract.engine.weights);
  const actualWeights=JSON.stringify(runtime.engine.weights);
  const expectedMax=JSON.stringify(contract.engine.max);
  const actualMax=JSON.stringify(runtime.engine.max);
  const expectedInputs=JSON.stringify(contract.engine.scoreInputFields);
  const actualInputs=JSON.stringify(runtime.engine.scoreInputFields);
  const evidenceByGlobal={
    UFC_LOSS_CONTEXT_HYBRID_LIVE:runtime.lossEvidence,
    UFC_DIVISION_ERA_DEPTH_LIVE:runtime.eraEvidence
  };
  const evidenceFailures=[];
  for(const provider of contract.evidenceProviders){
    const actual=evidenceByGlobal[provider.global]||{};
    if(actual.applied!==true)evidenceFailures.push({provider:provider.global,field:'applied',actual:actual.applied});
    if(actual.runtimeRole!==provider.expectedRole)evidenceFailures.push({provider:provider.global,field:'runtimeRole',expected:provider.expectedRole,actual:actual.runtimeRole});
    if(actual.rosterCount!==contract.expectedRosterCount)evidenceFailures.push({provider:provider.global,field:'rosterCount',expected:contract.expectedRosterCount,actual:actual.rosterCount});
    if(Number(actual.mismatchCount||0)!==0)evidenceFailures.push({provider:provider.global,field:'mismatchCount',actual:actual.mismatchCount});
    for(const [field,expected] of Object.entries(provider.expectedMutationFlags)){
      if(actual[field]!==expected)evidenceFailures.push({provider:provider.global,field,expected,actual:actual[field]});
    }
  }

  const runtimeFailures=[];
  const requireRuntime=(condition,code,detail)=>{if(!condition)runtimeFailures.push({code,detail});};
  requireRuntime(runtime.rosterCount===contract.expectedRosterCount,'roster-count',{expected:contract.expectedRosterCount,actual:runtime.rosterCount});
  requireRuntime(runtime.uniqueRosterCount===contract.expectedRosterCount,'unique-roster-count',{expected:contract.expectedRosterCount,actual:runtime.uniqueRosterCount});
  requireRuntime(runtime.canonical.version===contract.canonical.version,'canonical-version',{expected:contract.canonical.version,actual:runtime.canonical.version});
  requireRuntime(runtime.canonical.sourceSha===contract.canonical.sourceSha,'canonical-source-sha',{expected:contract.canonical.sourceSha,actual:runtime.canonical.sourceSha});
  requireRuntime(runtime.engine.version===contract.engine.version,'engine-version',{expected:contract.engine.version,actual:runtime.engine.version});
  requireRuntime(runtime.engine.formula===contract.engine.formula,'formula',{expected:contract.engine.formula,actual:runtime.engine.formula});
  requireRuntime(actualWeights===expectedWeights,'weights',{expected:contract.engine.weights,actual:runtime.engine.weights});
  requireRuntime(actualMax===expectedMax,'max',{expected:contract.engine.max,actual:runtime.engine.max});
  requireRuntime(actualInputs===expectedInputs,'score-input-fields',{expected:contract.engine.scoreInputFields,actual:runtime.engine.scoreInputFields});
  requireRuntime(runtime.engine.authorizedApplyReason===contract.engine.authorizedApplyReason,'authorized-apply-reason',{expected:contract.engine.authorizedApplyReason,actual:runtime.engine.authorizedApplyReason});
  requireRuntime(runtime.engine.applyCount===contract.engine.expectedApplyCount,'engine-apply-count',{expected:contract.engine.expectedApplyCount,actual:runtime.engine.applyCount});
  requireRuntime(Number(runtime.engine.rejectedApplyCount||0)===0,'rejected-apply-count',{actual:runtime.engine.rejectedApplyCount});
  requireRuntime(runtime.engine.applyAttempts.length===1,'engine-apply-attempts',{actual:runtime.engine.applyAttempts});
  requireRuntime(runtime.engine.applyAttempts[0]?.reason===contract.engine.authorizedApplyReason&&runtime.engine.applyAttempts[0]?.accepted===true,'accepted-apply-attempt',{actual:runtime.engine.applyAttempts[0]});
  requireRuntime(runtime.engine.aliasIsCanonical===true,'engine-alias',{});
  requireRuntime(runtime.engine.parity?.passed===true,'engine-parity',{actual:runtime.engine.parity});
  requireRuntime(runtime.pipeline.status==='ready','pipeline-status',{actual:runtime.pipeline.status});
  requireRuntime(runtime.pipeline.mode===contract.pipeline.expectedMode,'pipeline-mode',{expected:contract.pipeline.expectedMode,actual:runtime.pipeline.mode});
  requireRuntime(Number(runtime.pipeline.finalScoreApplyCount||0)===contract.pipeline.expectedFinalScoreApplyCount,'pipeline-score-apply-count',{expected:contract.pipeline.expectedFinalScoreApplyCount,actual:runtime.pipeline.finalScoreApplyCount});
  requireRuntime(runtime.ownership.version===contract.finalizer.version,'finalizer-version',{expected:contract.finalizer.version,actual:runtime.ownership.version});
  requireRuntime(runtime.ownership.applied===true&&runtime.ownership.status==='clean','ownership-contract',{actual:runtime.ownership});
  requireRuntime(runtime.ownership.mode===contract.finalizer.expectedMode,'ownership-mode',{expected:contract.finalizer.expectedMode,actual:runtime.ownership.mode});
  requireRuntime(runtime.ownership.rosterCount===contract.expectedRosterCount,'ownership-roster-count',{actual:runtime.ownership.rosterCount});
  requireRuntime(Number(runtime.ownership.wrongOwnerCount||0)===0,'wrong-owner-count',{actual:runtime.ownership.wrongOwnerCount});
  requireRuntime(Number(runtime.ownership.displayOverrideViolationCount||0)===0,'ownership-display-violations',{actual:runtime.ownership.displayOverrideViolationCount});
  requireRuntime(Number(runtime.ownership.compareScoreViolationCount||0)===0,'ownership-compare-violations',{actual:runtime.ownership.compareScoreViolationCount});
  requireRuntime(Number(runtime.ownership.missingLossContextDetailCount||0)===0,'missing-loss-detail',{actual:runtime.ownership.missingLossContextDetailCount});
  requireRuntime(Number(runtime.ownership.missingEraDepthDetailCount||0)===0,'missing-era-detail',{actual:runtime.ownership.missingEraDepthDetailCount});
  requireRuntime(runtime.mismatches.length===0,'canonical-mismatches',{count:runtime.mismatches.length,sample:runtime.mismatches.slice(0,10)});
  requireRuntime(runtime.formulaMismatches.length===0,'formula-mismatches',{count:runtime.formulaMismatches.length,sample:runtime.formulaMismatches.slice(0,10)});
  requireRuntime(runtime.profileMismatches.length===0,'profile-mismatches',{count:runtime.profileMismatches.length,sample:runtime.profileMismatches.slice(0,10)});
  requireRuntime(runtime.displayViolations.length===0,'display-violations',{count:runtime.displayViolations.length,sample:runtime.displayViolations.slice(0,10)});
  requireRuntime(runtime.compareViolations.length===0,'compare-violations',{count:runtime.compareViolations.length,sample:runtime.compareViolations.slice(0,10)});
  requireRuntime(runtime.scriptOrderPassed===true,'runtime-script-order',{actual:runtime.requiredScriptOrder});
  requireRuntime(Object.values(runtime.runtimeGlobals).every(value=>value===false),'legacy-runtime-globals',{actual:runtime.runtimeGlobals});
  runtimeFailures.push(...evidenceFailures.map(detail=>({code:'evidence-provider',detail})));

  const report={
    generatedAt:new Date().toISOString(),
    contractVersion:contract.version,
    url:URL,
    source,
    runtime,
    runtimeFailures,
    browserDiagnostics:{errors,consoleErrors},
    passed:source.passed&&runtimeFailures.length===0&&errors.length===0
  };
  await fs.mkdir(path.dirname(REPORT_PATH),{recursive:true});
  await fs.writeFile(REPORT_PATH,`${JSON.stringify(report,null,2)}\n`,'utf8');
  console.log('SCORING_ARCHITECTURE_GUARDRAILS');
  console.log(JSON.stringify(report,null,2));
  if(!report.passed)process.exitCode=1;
}finally{
  await browser.close();
}

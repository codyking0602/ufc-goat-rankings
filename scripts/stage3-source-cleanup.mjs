import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import * as acorn from 'acorn';

const ROOT=process.cwd();
const report={
  generatedAt:new Date().toISOString(),
  indexReplacements:0,
  loaderLinesRemoved:[],
  displayOverrideFieldsRemoved:0,
  displayOverrideFighters:0,
  packetFilesChanged:[],
  packetPropertiesRemoved:0
};

const read=relative=>fs.readFile(path.join(ROOT,relative),'utf8');
const write=(relative,content)=>fs.writeFile(path.join(ROOT,relative),content,'utf8');

function replaceRequired(source,search,replacement,label){
  if(!source.includes(search))throw new Error(`Missing required ${label} pattern.`);
  report.indexReplacements+=1;
  return source.replace(search,replacement);
}

async function cleanIndex(){
  const file='index.html';
  let source=await read(file);
  source=replaceRequired(source,'20260713-stage2-scoring-ownership-final','20260713-stage3-legacy-scoring-removed','app build');
  source=replaceRequired(source,'assets/data/module-versions.js?v=module-versions-20260713a-stage2','assets/data/module-versions.js?v=module-versions-20260713b-stage3-evidence-only','module versions cache');
  source=replaceRequired(source,'assets/data/loss-context-exposure-ledger.js?v=loss-context-exposure-ledger-20260711c-gsp-ufc-count','assets/data/loss-context-exposure-ledger.js?v=loss-context-exposure-ledger-20260713e-evidence-only','exposure cache');
  source=replaceRequired(source,'assets/data/loss-context-hybrid-live.js?v=loss-context-hybrid-live-20260711f-surface-ovr-sync','assets/data/loss-context-hybrid-live.js?v=loss-context-hybrid-live-20260713g-evidence-only','loss live cache');
  source=replaceRequired(source,'assets/data/division-era-depth-live.js?v=division-era-depth-live-20260712b-roster-dynamic','assets/data/division-era-depth-live.js?v=division-era-depth-live-20260713c-evidence-only','era live cache');
  source=replaceRequired(source,'assets/js/scoring-ownership-finalizer.js?v=scoring-ownership-finalizer-20260713e-evidence-ready','assets/js/scoring-ownership-finalizer.js?v=scoring-ownership-finalizer-20260713f-no-legacy-repair','ownership cache');

  const oldBlock=`  <script src="assets/data/division-era-depth-live.js?v=division-era-depth-live-20260713c-evidence-only"></script>
  <script src="assets/data/division-era-depth-finalizer.js?v=division-era-depth-finalizer-20260712d-roster-dynamic"></script>
  <script src="assets/data/ranking-data-patches.js?v=ranking-data-patches-20260711w-profile-stat-merge"></script>
  <script src="assets/data/quality-wins-audit-cruz-ilia.js?v=quality-wins-audit-cruz-ilia-20260712b-evidence-sync"></script>
  <script src="assets/js/profile-stat-consistency.js?v=profile-stat-consistency-20260712d-prime-phase-finish-count"></script>
  <script src="assets/js/scoring-engine.js?v=scoring-engine-20260713b-single-owner"></script>
  <script src="assets/js/scoring-ownership-finalizer.js?v=scoring-ownership-finalizer-20260713f-no-legacy-repair"></script>`;
  const newBlock=`  <script src="assets/data/division-era-depth-live.js?v=division-era-depth-live-20260713c-evidence-only"></script>
  <script src="assets/js/scoring-engine.js?v=scoring-engine-20260713b-single-owner"></script>
  <script src="assets/js/scoring-ownership-finalizer.js?v=scoring-ownership-finalizer-20260713f-no-legacy-repair"></script>
  <script src="assets/data/ranking-data-patches.js?v=ranking-data-patches-20260713x-stage3-loader-clean"></script>
  <script src="assets/data/quality-wins-audit-cruz-ilia.js?v=quality-wins-audit-cruz-ilia-20260712b-evidence-sync"></script>
  <script src="assets/js/profile-stat-consistency.js?v=profile-stat-consistency-20260712d-prime-phase-finish-count"></script>`;
  source=replaceRequired(source,oldBlock,newBlock,'Stage 3 script order');
  await write(file,source);
}

async function cleanRankingPatches(){
  const file='assets/data/ranking-data-patches.js';
  let source=await read(file);
  source=source.replace("const VERSION='ranking-data-patches-20260711w-profile-stat-merge';","const VERSION='ranking-data-patches-20260713x-stage3-loader-clean';");
  const staleLoaders=[
    'rank-fluidity-fixes.js',
    'championship-score-corrections.js',
    'opponent-quality-score-corrections.js',
    'longevity-score-corrections.js',
    'apex-peak-score-corrections.js'
  ];
  const lines=source.split('\n');
  const kept=[];
  for(const line of lines){
    const stale=staleLoaders.find(name=>line.includes(name));
    if(stale){report.loaderLinesRemoved.push(stale);continue;}
    kept.push(line);
  }
  source=kept.join('\n');
  await write(file,source);
}

function assertSerializable(value,pathName='DISPLAY_OVERRIDES'){
  if(value===null)return;
  const type=typeof value;
  if(type==='string'||type==='number'||type==='boolean')return;
  if(type==='undefined'||type==='function'||type==='symbol'||type==='bigint'){
    throw new Error(`Non-serializable value at ${pathName}: ${type}`);
  }
  if(Array.isArray(value)){
    value.forEach((item,index)=>assertSerializable(item,`${pathName}[${index}]`));
    return;
  }
  if(type==='object'){
    Object.entries(value).forEach(([key,item])=>assertSerializable(item,`${pathName}.${key}`));
  }
}

function stripObjectFields(target,fields){
  if(!target||typeof target!=='object'||Array.isArray(target))return 0;
  let removed=0;
  for(const field of fields){
    if(Object.prototype.hasOwnProperty.call(target,field)){
      delete target[field];
      removed+=1;
    }
  }
  return removed;
}

async function cleanDisplayOverrides(){
  const file='assets/data/display-overrides.js';
  const source=await read(file);
  const sandbox={};
  vm.runInNewContext(`${source}\n;globalThis.__STAGE3_DISPLAY_OVERRIDES__=DISPLAY_OVERRIDES;`,sandbox,{filename:file,timeout:5000});
  const overrides=sandbox.__STAGE3_DISPLAY_OVERRIDES__;
  if(!overrides||typeof overrides!=='object')throw new Error('Could not evaluate DISPLAY_OVERRIDES.');

  const direct=[
    'overallOvr','allTimeRank','rankLabel','totalScore','rawScore','rank',
    'championship','opponentQuality','primeDominance','longevity','apexPeak',
    'penalty','lossPenalty','lossContext','eraDepthAdjustment','baseScore',
    'preEraDepthTotalScore','apexPeakBonus','lossContextHybrid','divisionEraDepth'
  ];
  const nested=[
    ...direct,'championshipScore','opponentQualityScore','primeDominanceScore','longevityScore'
  ];
  const category=['ovr','rank','score','value'];

  for(const override of Object.values(overrides)){
    report.displayOverrideFieldsRemoved+=stripObjectFields(override,direct);
    for(const container of ['snapshotStats','packetProfileStats']){
      report.displayOverrideFieldsRemoved+=stripObjectFields(override?.[container],nested);
    }
    if(override?.categories&&typeof override.categories==='object'){
      for(const [name,entry] of Object.entries(override.categories)){
        report.displayOverrideFieldsRemoved+=stripObjectFields(entry,category);
        if(entry&&typeof entry==='object'&&!Array.isArray(entry)&&Object.keys(entry).length===0)delete override.categories[name];
      }
      if(Object.keys(override.categories).length===0)delete override.categories;
    }
  }

  report.displayOverrideFighters=Object.keys(overrides).length;
  assertSerializable(overrides);
  const output=`// App-facing copy, photos, links, and presentation-only overrides.\n// Score inputs, totals, ranks, category ratings, Loss Context, and Era Depth live in the canonical scoring pipeline.\nconst DISPLAY_OVERRIDES = ${JSON.stringify(overrides,null,2)};\n`;
  await write(file,output);
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
function deletionRange(objectNode,index){
  const properties=objectNode.properties;
  const current=properties[index];
  if(properties.length===1)return [current.start,current.end];
  if(index<properties.length-1)return [current.start,properties[index+1].start];
  return [properties[index-1].end,current.end];
}
function mergeRanges(ranges){
  const sorted=ranges.slice().sort((a,b)=>a[0]-b[0]);
  const merged=[];
  for(const range of sorted){
    const last=merged.at(-1);
    if(last&&range[0]<=last[1])last[1]=Math.max(last[1],range[1]);
    else merged.push([...range]);
  }
  return merged;
}
function removeProperties(source,objectNode,names){
  const targets=[];
  objectNode.properties.forEach((property,index)=>{
    if(names.has(propertyName(property)))targets.push(deletionRange(objectNode,index));
  });
  return targets;
}
function applyRanges(source,ranges){
  let output=source;
  for(const [start,end] of mergeRanges(ranges).sort((a,b)=>b[0]-a[0])){
    output=output.slice(0,start)+output.slice(end);
  }
  return output;
}

async function cleanFighterPackets(){
  const directory=path.join(ROOT,'assets/data/fighter-packets');
  const entries=await fs.readdir(directory,{withFileTypes:true});
  const forbiddenDisplay=new Set(['overallOvr','allTimeRank','rankLabel','categories','totalScore','rawScore','rank']);
  for(const entry of entries){
    if(!entry.isFile()||!entry.name.endsWith('.js'))continue;
    const relative=path.join('assets/data/fighter-packets',entry.name);
    const source=await read(relative);
    let ast;
    try{
      ast=acorn.parse(source,{ecmaVersion:'latest',sourceType:'script'});
    }catch(error){
      throw new Error(`Could not parse ${relative}: ${error.message}`);
    }
    let packetObject=null;
    const stack=[ast];
    while(stack.length){
      const node=stack.pop();
      if(!node||typeof node!=='object')continue;
      if(node.type==='VariableDeclarator'&&node.id?.type==='Identifier'&&node.id.name==='packet'&&node.init?.type==='ObjectExpression'){
        packetObject=node.init;
        break;
      }
      for(const value of Object.values(node)){
        if(Array.isArray(value))value.forEach(item=>{if(item&&typeof item==='object')stack.push(item);});
        else if(value&&typeof value==='object'&&typeof value.type==='string')stack.push(value);
      }
    }
    if(!packetObject)continue;
    const display=childObject(packetObject,'display');
    if(!display)continue;
    const ranges=removeProperties(source,display,forbiddenDisplay);
    if(!ranges.length)continue;
    const updated=applyRanges(source,ranges);
    await write(relative,updated);
    report.packetFilesChanged.push(relative);
    report.packetPropertiesRemoved+=ranges.length;
  }
}

await cleanIndex();
await cleanRankingPatches();
await cleanDisplayOverrides();
await cleanFighterPackets();
await fs.mkdir(path.join(ROOT,'docs'),{recursive:true});
await write('docs/stage3-source-cleanup.json',`${JSON.stringify(report,null,2)}\n`);
console.log(JSON.stringify(report,null,2));

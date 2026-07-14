import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { buildCurrentDepthCsv } from './refresh-division-era-depth-source-fast.mjs';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const ROOT=path.resolve(HERE,'..');
const FEED_PATH=path.join(ROOT,'assets/data/octagon-verdict-data.json');
const SHADOW_PATH=path.join(ROOT,'assets/data/division-era-depth-shadow.js');
const REPORT_PATH=path.join(ROOT,'docs/division-era-depth-shadow-report.json');
const OUTPUT_PATH='/tmp/leon-division-era-depth.json';
const MODEL_DATE='2026-07-12';
const WFW_SAFE=new Set(['Amanda Nunes','Cris Cyborg','Holly Holm']);
const ALIASES=new Map([
  ['B.J. Penn','BJ Penn'],
  ['T.J. Dillashaw','TJ Dillashaw'],
  ['Cris Cyborg','Cristiane Justino'],
  ['Mauricio "Shogun" Rua','Mauricio Rua']
]);
const RESTORE=new Map([...ALIASES].map(([canonical,source])=>[source,canonical]));
const FACT_FILES=[
  'assets/data/ranking-data.js',
  'assets/data/canonical-fighter-facts.js',
  'assets/data/canonical-fighter-facts-batch-one.js',
  'assets/data/canonical-fighter-facts-batch-two.js',
  'assets/data/canonical-fighter-facts-batch-three.js',
  'assets/data/canonical-fighter-facts-batch-four.js',
  'assets/data/canonical-fighter-facts-batch-five.js',
  'assets/data/canonical-fighter-facts-batch-six.js',
  'assets/data/canonical-fighter-facts-batch-seven-data-a.js',
  'assets/data/canonical-fighter-facts-batch-seven-data-b.js',
  'assets/data/canonical-fighter-facts-batch-seven.js',
  'assets/data/canonical-fighter-facts-batch-eight-data-a.js',
  'assets/data/canonical-fighter-facts-batch-eight-data-b.js',
  'assets/data/canonical-fighter-facts-batch-eight.js',
  'assets/data/canonical-fighter-facts-batch-nine-data-a.js',
  'assets/data/canonical-fighter-facts-batch-nine-data-b.js',
  'assets/data/canonical-fighter-facts-batch-nine-data-c.js',
  'assets/data/canonical-fighter-facts-batch-nine.js',
  'assets/data/canonical-fighter-facts-approved-corrections.js',
  'assets/data/canonical-fighter-facts-opponent-quality-corrections.js'
];

const round=(value,digits=4)=>{const factor=10**digits;return Math.round((Number(value||0)+Number.EPSILON)*factor)/factor;};
const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
const divisionCode=value=>({
  heavyweight:'HW','light heavyweight':'LHW',middleweight:'MW',welterweight:'WW',lightweight:'LW',featherweight:'FW',bantamweight:'BW',flyweight:'FLW',
  "women's bantamweight":'WBW',"women's flyweight":'WFLW',"women's strawweight":'WSW',"women's featherweight":'WFW',strawweight:'WSW'
}[String(value||'').trim().toLowerCase()]||null);

function curvedAdjustment(depthIndex){
  const depth=Number(depthIndex);
  if(!Number.isFinite(depth))return null;
  const value=depth<1?-3*(((1-depth)/.25)**1.5):(depth-1)*20;
  return round(Math.min(.75,Math.max(-3,value)),2);
}

async function loadCanonicalFacts(){
  class CustomEvent{constructor(type,options={}){this.type=type;this.detail=options.detail;}}
  const document={documentElement:{setAttribute(){}},querySelector(){return null;},querySelectorAll(){return[];}};
  const window={dispatchEvent(){return true;}};
  const context=vm.createContext({window,document,CustomEvent,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
  for(const relative of FACT_FILES)vm.runInContext(await fs.readFile(path.join(ROOT,relative),'utf8'),context,{filename:relative});
  return context.window.UFC_CANONICAL_FIGHTER_FACTS;
}

async function loadShadow(){
  class CustomEvent{constructor(type,options={}){this.type=type;this.detail=options.detail;}}
  const document={documentElement:{setAttribute(){}}};
  const window={dispatchEvent(){return true;}};
  const context=vm.createContext({window,document,CustomEvent,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean,Promise});
  vm.runInContext(await fs.readFile(SHADOW_PATH,'utf8'),context,{filename:SHADOW_PATH});
  return context.window.UFC_DIVISION_ERA_DEPTH_SHADOW_MODEL||context.window.UFC_DIVISION_ERA_DEPTH_SHADOW;
}

function runGenerator(sourceUrl){
  return new Promise((resolve,reject)=>{
    const child=spawn(process.execPath,['scripts/build-division-era-depth-shadow.mjs'],{
      cwd:ROOT,
      env:{...process.env,UFC_DEPTH_SOURCE_URL:sourceUrl},
      stdio:['ignore','pipe','pipe']
    });
    let stdout='';
    let stderr='';
    child.stdout.on('data',chunk=>{stdout+=chunk;});
    child.stderr.on('data',chunk=>{stderr+=chunk;});
    child.on('error',reject);
    child.on('close',code=>code===0?resolve({stdout,stderr}):reject(new Error(`Depth generator exited ${code}.\n${stdout}\n${stderr}`)));
  });
}

async function main(){
  const facts=await loadCanonicalFacts();
  const leon=facts?.get?.('Leon Edwards');
  assert.ok(leon,'Leon Edwards canonical record is required.');
  const startFight=leon.fights.find(fight=>fight.id===leon.primeWindow.startFightId);
  const endFight=leon.primeWindow.open?null:leon.fights.find(fight=>fight.id===leon.primeWindow.endFightId);
  assert.ok(startFight?.date,'Leon prime start fight/date is required.');
  if(!leon.primeWindow.open)assert.ok(endFight?.date,'Leon closed prime end fight/date is required.');

  const originalFeedText=await fs.readFile(FEED_PATH,'utf8');
  const originalShadowText=await fs.readFile(SHADOW_PATH,'utf8');
  const originalReportText=await fs.readFile(REPORT_PATH,'utf8').catch(()=>null);
  const existingShadow=await loadShadow();
  assert.equal(existingShadow?.fighters?.length,72,'Expected frozen 72-fighter empirical shadow.');

  const feed=JSON.parse(originalFeedText);
  feed.fighters=(feed.fighters||[]).map(row=>ALIASES.has(row.name)?{...row,name:ALIASES.get(row.name)}:row);
  assert.ok(!feed.fighters.some(row=>key(row.name)===key('Leon Edwards')),'Leon should be absent from the frozen 72-fighter feed.');
  feed.fighters.push({
    name:'Leon Edwards',
    group:leon.board,
    rank:999,
    appOvr:0,
    totalScore:0,
    division:divisionCode(leon.identity?.primaryDivision)||'WW',
    primeWindowDetail:{start:startFight.date,end:endFight?.date||null},
    primeWindow:`${startFight.date} → ${endFight?.date||'Open'}`
  });

  const built=await buildCurrentDepthCsv({modelDate:MODEL_DATE});
  const server=http.createServer((request,response)=>{
    response.writeHead(200,{'content-type':'text/csv; charset=utf-8','cache-control':'no-store'});
    response.end(built.csv);
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  const address=server.address();
  const sourceUrl=`http://127.0.0.1:${address.port}/depth.csv`;

  try{
    await fs.writeFile(FEED_PATH,`${JSON.stringify(feed,null,2)}\n`,'utf8');
    await runGenerator(sourceUrl);
    const generated=JSON.parse(await fs.readFile(REPORT_PATH,'utf8'));
    const generatedMap=new Map(generated.fighters.map(row=>[key(RESTORE.get(row.fighter)||row.fighter),{...row,fighter:RESTORE.get(row.fighter)||row.fighter}]));
    const mismatches=[];
    for(const frozen of existingShadow.fighters){
      if(WFW_SAFE.has(frozen.fighter))continue;
      const rebuilt=generatedMap.get(key(frozen.fighter));
      if(!rebuilt){mismatches.push({fighter:frozen.fighter,issue:'missing rebuilt row'});continue;}
      const fields=['depthIndex','matchedPrimeFightCount','primeStart','primeEnd','openPrime'];
      const differences=fields.filter(field=>JSON.stringify(rebuilt[field])!==JSON.stringify(frozen[field]));
      for(const field of ['qualifiedActivePool','ranksSixToFifteenElo','contenderDiversity']){
        if(Number(rebuilt.componentRatios?.[field])!==Number(frozen.componentRatios?.[field]))differences.push(`componentRatios.${field}`);
      }
      if(differences.length)mismatches.push({fighter:frozen.fighter,differences,frozen:{depthIndex:frozen.depthIndex,componentRatios:frozen.componentRatios,matchedPrimeFightCount:frozen.matchedPrimeFightCount,primeStart:frozen.primeStart,primeEnd:frozen.primeEnd,openPrime:frozen.openPrime},rebuilt:{depthIndex:rebuilt.depthIndex,componentRatios:rebuilt.componentRatios,matchedPrimeFightCount:rebuilt.matchedPrimeFightCount,primeStart:rebuilt.primeStart,primeEnd:rebuilt.primeEnd,openPrime:rebuilt.openPrime}});
    }
    assert.equal(mismatches.length,0,`Current generator must reproduce all 69 non-WFW frozen rows. First mismatch: ${JSON.stringify(mismatches[0]||null)}`);
    const leonRow=generatedMap.get(key('Leon Edwards'));
    assert.ok(leonRow,'Generator must produce Leon Edwards.');
    const output={
      version:'leon-division-era-depth-reconstruction-20260714a',
      classification:'factual-completion',
      shadowOnly:true,
      source:built.metadata,
      frozenShadowVersion:existingShadow.version,
      parity:{checked:69,excludedWfw:[...WFW_SAFE],mismatchCount:0},
      canonicalPrime:{startFightId:leon.primeWindow.startFightId,startDate:startFight.date,endFightId:leon.primeWindow.endFightId||null,endDate:endFight?.date||null,open:Boolean(leon.primeWindow.open),primaryDivision:leon.identity?.primaryDivision||null},
      leon:{
        fighter:'Leon Edwards',
        group:leonRow.group,
        primeStart:leonRow.primeStart,
        primeEnd:leonRow.primeEnd,
        openPrime:leonRow.openPrime,
        primaryDivision:leonRow.primaryDivision,
        sampledDivisions:leonRow.sampledDivisions,
        matchedPrimeFightCount:leonRow.matchedPrimeFightCount,
        scoredSampleCount:leonRow.scoredSampleCount,
        titleWeightedSampleCount:leonRow.titleWeightedSampleCount,
        depthIndex:leonRow.depthIndex,
        componentRatios:leonRow.componentRatios,
        curvedAdjustment:curvedAdjustment(leonRow.depthIndex),
        samples:leonRow.samples
      },
      mutatesLiveScores:false
    };
    await fs.writeFile(OUTPUT_PATH,`${JSON.stringify(output,null,2)}\n`,'utf8');
    console.log('LEON_DIVISION_ERA_DEPTH_RECONSTRUCTION');
    console.log(JSON.stringify({...output,leon:{...output.leon,samples:undefined}},null,2));
  }finally{
    server.close();
    await fs.writeFile(FEED_PATH,originalFeedText,'utf8');
    await fs.writeFile(SHADOW_PATH,originalShadowText,'utf8');
    if(originalReportText===null)await fs.rm(REPORT_PATH,{force:true});
    else await fs.writeFile(REPORT_PATH,originalReportText,'utf8');
  }
}

main().catch(error=>{
  console.error(error?.stack||error);
  process.exitCode=1;
});

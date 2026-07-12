import fs from 'node:fs/promises';

const ENGINE_PATH='assets/js/final-score-engine.js';
const VERSIONS_PATH='assets/data/module-versions.js';
const PREVIOUS_ENGINE_VERSION='final-score-engine-20260712a-division-era-depth';
const TARGET_ENGINE_VERSION='final-score-engine-20260712b-era-shadow-fallback';
const PREVIOUS_CACHE_VERSION="finalScoreEngine:'20260712a-division-era-depth'";
const TARGET_CACHE_VERSION="finalScoreEngine:'20260712b-era-shadow-fallback'";

function replaceOnce(text,oldValue,newValue,label){
  if(text.includes(newValue))return text;
  const first=text.indexOf(oldValue);
  if(first<0)throw new Error(`Missing ${label}; refusing to guess.`);
  if(text.indexOf(oldValue,first+oldValue.length)>=0)throw new Error(`Multiple ${label} matches; refusing ambiguous replacement.`);
  return text.replace(oldValue,newValue);
}

let engine=await fs.readFile(ENGINE_PATH,'utf8');
engine=replaceOnce(
  engine,
  `const VERSION='${PREVIOUS_ENGINE_VERSION}';`,
  `const VERSION='${TARGET_ENGINE_VERSION}';`,
  'final score engine version'
);
engine=replaceOnce(
  engine,
  "  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,\"'\").replace(/\\s+/g,' ');}\n  function boardRows()",
  "  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,\"'\").replace(/\\s+/g,' ');}\n  const ERA_DEPTH_BY_FIGHTER=new Map((window.UFC_DIVISION_ERA_DEPTH_SHADOW?.fighters||[]).map(row=>[key(row?.fighter),row]));\n  function eraDepthAdjustmentFor(row){\n    const direct=row?.eraDepthAdjustment;\n    if(direct!==undefined&&direct!==null&&direct!==''&&Number.isFinite(Number(direct)))return Number(direct);\n    return num(ERA_DEPTH_BY_FIGHTER.get(key(row?.fighter))?.curvedAdjustment);\n  }\n  function boardRows()",
  'era-depth shadow fallback'
);
engine=replaceOnce(
  engine,
  "    const eraDepthAdjustment=num(row?.eraDepthAdjustment);",
  "    const eraDepthAdjustment=eraDepthAdjustmentFor(row);",
  'era-depth score lookup'
);
engine=replaceOnce(
  engine,
  "    row.weightedScoreBreakdown=breakdown;\n    row.preEraDepthTotalScore=breakdown.preEraDepthTotalScore;",
  "    row.weightedScoreBreakdown=breakdown;\n    row.eraDepthAdjustment=breakdown.eraDepthAdjustment;\n    row.preEraDepthTotalScore=breakdown.preEraDepthTotalScore;",
  'era-depth row assignment'
);
await fs.writeFile(ENGINE_PATH,engine,'utf8');

let versions=await fs.readFile(VERSIONS_PATH,'utf8');
versions=replaceOnce(versions,PREVIOUS_CACHE_VERSION,TARGET_CACHE_VERSION,'final score engine cache version');
await fs.writeFile(VERSIONS_PATH,versions,'utf8');

const verifiedEngine=await fs.readFile(ENGINE_PATH,'utf8');
const verifiedVersions=await fs.readFile(VERSIONS_PATH,'utf8');
const checks={
  engineVersion:verifiedEngine.includes(TARGET_ENGINE_VERSION),
  formula:verifiedEngine.includes('+ penalty + eraDepthAdjustment'),
  shadowFallback:verifiedEngine.includes('const ERA_DEPTH_BY_FIGHTER=')&&verifiedEngine.includes('function eraDepthAdjustmentFor(row)'),
  lookup:verifiedEngine.includes('const eraDepthAdjustment=eraDepthAdjustmentFor(row);'),
  rowAssignment:verifiedEngine.includes('row.eraDepthAdjustment=breakdown.eraDepthAdjustment;'),
  cacheVersion:verifiedVersions.includes(TARGET_CACHE_VERSION)
};
const failed=Object.entries(checks).filter(([,passed])=>!passed).map(([name])=>name);
console.log(JSON.stringify({installed:failed.length===0,engineVersion:TARGET_ENGINE_VERSION,checks,failed},null,2));
if(failed.length)process.exitCode=1;

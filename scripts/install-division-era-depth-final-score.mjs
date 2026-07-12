import fs from 'node:fs/promises';

const ENGINE_PATH='assets/js/final-score-engine.js';
const VERSIONS_PATH='assets/data/module-versions.js';
const OLD_ENGINE_VERSION='final-score-engine-20260711a-fixed-anchor-curve';
const NEW_ENGINE_VERSION='final-score-engine-20260712a-division-era-depth';
const OLD_CACHE_VERSION="finalScoreEngine:'20260711a-fixed-anchor-curve'";
const NEW_CACHE_VERSION="finalScoreEngine:'20260712a-division-era-depth'";

function replaceOnce(text,oldValue,newValue,label){
  if(text.includes(newValue))return text;
  const first=text.indexOf(oldValue);
  if(first<0)throw new Error(`Missing ${label}; refusing to guess.`);
  if(text.indexOf(oldValue,first+oldValue.length)>=0)throw new Error(`Multiple ${label} matches; refusing ambiguous replacement.`);
  return text.replace(oldValue,newValue);
}

let engine=await fs.readFile(ENGINE_PATH,'utf8');
engine=replaceOnce(engine,`const VERSION='${OLD_ENGINE_VERSION}';`,`const VERSION='${NEW_ENGINE_VERSION}';`,'final score engine version');
engine=replaceOnce(
  engine,
  "const FORMULA='championship/30*35 + opponentQuality/30*27.5 + primeDominance/30*27.5 + longevity/30*10 + apexPeak + penalty';",
  "const FORMULA='championship/30*35 + opponentQuality/30*27.5 + primeDominance/30*27.5 + longevity/30*10 + apexPeak + penalty + eraDepthAdjustment';",
  'final score formula'
);
engine=replaceOnce(
  engine,
  "    const penalty=num(row?.penalty);\n    const baseScore=championship+opponentQuality+primeDominance+longevity;\n    const modifierScore=apexPeak+penalty;\n    const totalScore=baseScore+modifierScore;",
  "    const penalty=num(row?.penalty);\n    const eraDepthAdjustment=num(row?.eraDepthAdjustment);\n    const baseScore=championship+opponentQuality+primeDominance+longevity;\n    const preEraDepthTotalScore=baseScore+apexPeak+penalty;\n    const modifierScore=apexPeak+penalty+eraDepthAdjustment;\n    const totalScore=baseScore+modifierScore;",
  'era-depth score calculation'
);
engine=replaceOnce(
  engine,
  "      penalty:round2(penalty),\n      modifierScore:round2(modifierScore),\n      totalScore:round2(totalScore)",
  "      penalty:round2(penalty),\n      eraDepthAdjustment:round2(eraDepthAdjustment),\n      preEraDepthTotalScore:round2(preEraDepthTotalScore),\n      modifierScore:round2(modifierScore),\n      totalScore:round2(totalScore)",
  'era-depth score breakdown'
);
engine=replaceOnce(
  engine,
  "    row.weightedScoreBreakdown=breakdown;\n    row.rawScore=breakdown.totalScore;",
  "    row.weightedScoreBreakdown=breakdown;\n    row.preEraDepthTotalScore=breakdown.preEraDepthTotalScore;\n    row.rawScore=breakdown.totalScore;",
  'pre-era total assignment'
);
await fs.writeFile(ENGINE_PATH,engine,'utf8');

let versions=await fs.readFile(VERSIONS_PATH,'utf8');
versions=replaceOnce(versions,OLD_CACHE_VERSION,NEW_CACHE_VERSION,'final score engine cache version');
await fs.writeFile(VERSIONS_PATH,versions,'utf8');

const verifiedEngine=await fs.readFile(ENGINE_PATH,'utf8');
const verifiedVersions=await fs.readFile(VERSIONS_PATH,'utf8');
const checks={
  engineVersion:verifiedEngine.includes(NEW_ENGINE_VERSION),
  formula:verifiedEngine.includes('+ penalty + eraDepthAdjustment'),
  calculation:verifiedEngine.includes('const preEraDepthTotalScore=baseScore+apexPeak+penalty;')&&verifiedEngine.includes('const modifierScore=apexPeak+penalty+eraDepthAdjustment;'),
  breakdown:verifiedEngine.includes('eraDepthAdjustment:round2(eraDepthAdjustment)')&&verifiedEngine.includes('preEraDepthTotalScore:round2(preEraDepthTotalScore)'),
  cacheVersion:verifiedVersions.includes(NEW_CACHE_VERSION)
};
const failed=Object.entries(checks).filter(([,passed])=>!passed).map(([name])=>name);
console.log(JSON.stringify({installed:failed.length===0,engineVersion:NEW_ENGINE_VERSION,checks,failed},null,2));
if(failed.length)process.exitCode=1;

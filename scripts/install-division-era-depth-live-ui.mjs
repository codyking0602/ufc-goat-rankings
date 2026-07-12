import fs from 'node:fs/promises';

const UI_PATH='assets/js/live-score-ui.js';
const INDEX_PATH='index.html';
const OLD_CACHE='assets/js/live-score-ui.js?v=live-score-ui-20260708a';
const NEW_CACHE='assets/js/live-score-ui.js?v=live-score-ui-20260712a-era-depth';

function replaceOnce(text,oldValue,newValue,label){
  if(text.includes(newValue))return text;
  const first=text.indexOf(oldValue);
  if(first<0)throw new Error(`Missing ${label}; refusing to guess.`);
  if(text.indexOf(oldValue,first+oldValue.length)>=0)throw new Error(`Multiple ${label} matches; refusing ambiguous replacement.`);
  return text.replace(oldValue,newValue);
}

let ui=await fs.readFile(UI_PATH,'utf8');
ui=replaceOnce(
  ui,
  '  function liveTotal(f){ return round2(baseScore(f) + apexValue(f) + num(f?.penalty)); }',
  '  function liveTotal(f){ return round2(baseScore(f) + apexValue(f) + num(f?.penalty) + num(f?.eraDepthAdjustment)); }',
  'live total formula'
);
ui=replaceOnce(
  ui,
  "      f.lossContext = num(f.penalty);\n      f.rawScore = liveTotal(f);",
  "      f.lossContext = num(f.penalty);\n      f.eraDepthAdjustment = num(f.eraDepthAdjustment);\n      f.rawScore = liveTotal(f);",
  'era-depth row modifier'
);
ui=replaceOnce(
  ui,
  "      f.scoreFormula = 'championship/30*35 + opponentQuality/30*27.5 + primeDominance/30*27.5 + longevity/30*10 + apexPeak + penalty';",
  "      f.preEraDepthTotalScore = round2(f.rawScore - f.eraDepthAdjustment);\n      f.scoreFormula = 'championship/30*35 + opponentQuality/30*27.5 + primeDominance/30*27.5 + longevity/30*10 + apexPeak + penalty + eraDepthAdjustment';",
  'live UI score formula'
);
ui=replaceOnce(
  ui,
  "      version: 'six-category-live-20260709b',\n      weights: { championship: 35, opponentQuality: 27.5, primeDominance: 27.5, longevity: 10, apexPeak: 'bonus', penalty: 'deduction' },\n      formula: 'Championship /30 × 35 + Quality Wins /30 × 27.5 + Prime Dominance /30 × 27.5 + Longevity /30 × 10 + Apex Peak + Loss Context',",
  "      version: 'six-category-live-20260712a-era-depth',\n      weights: { championship: 35, opponentQuality: 27.5, primeDominance: 27.5, longevity: 10, apexPeak: 'bonus', penalty: 'deduction', eraDepthAdjustment: 'post-base modifier' },\n      formula: 'Championship /30 × 35 + Quality Wins /30 × 27.5 + Prime Dominance /30 × 27.5 + Longevity /30 × 10 + Apex Peak + Loss Context + Division-Era Depth',",
  'live UI model metadata'
);
await fs.writeFile(UI_PATH,ui,'utf8');

let index=await fs.readFile(INDEX_PATH,'utf8');
index=replaceOnce(index,OLD_CACHE,NEW_CACHE,'live-score UI cache version');
await fs.writeFile(INDEX_PATH,index,'utf8');

const verifiedUi=await fs.readFile(UI_PATH,'utf8');
const verifiedIndex=await fs.readFile(INDEX_PATH,'utf8');
const checks={
  liveTotal:verifiedUi.includes('num(f?.penalty) + num(f?.eraDepthAdjustment)'),
  rowModifier:verifiedUi.includes('f.eraDepthAdjustment = num(f.eraDepthAdjustment);'),
  preEraTotal:verifiedUi.includes('f.preEraDepthTotalScore = round2(f.rawScore - f.eraDepthAdjustment);'),
  formula:verifiedUi.includes('+ penalty + eraDepthAdjustment'),
  metadata:verifiedUi.includes("six-category-live-20260712a-era-depth"),
  cache:verifiedIndex.includes(NEW_CACHE)
};
const failed=Object.entries(checks).filter(([,passed])=>!passed).map(([name])=>name);
console.log(JSON.stringify({installed:failed.length===0,checks,failed},null,2));
if(failed.length)process.exitCode=1;

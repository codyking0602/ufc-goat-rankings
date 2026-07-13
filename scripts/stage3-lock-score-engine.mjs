import fs from 'node:fs/promises';

function replaceRequired(source,before,after,label){
  if(source.includes(after))return source;
  if(!source.includes(before))throw new Error(`Missing ${label} pattern.`);
  return source.replace(before,after);
}

let engine=await fs.readFile('assets/js/scoring-engine.js','utf8');
engine=replaceRequired(engine,"const VERSION='scoring-engine-20260713b-single-owner';","const VERSION='scoring-engine-20260713c-finalizer-only';",'engine version');
engine=replaceRequired(engine,"  let applying=false;","  let applying=false;\n  const AUTHORIZED_APPLY_REASON='stage3-scoring-ownership-finalizer';\n  const APPLY_ATTEMPTS=[];",'apply constants');
engine=replaceRequired(engine,"    applyCount:0,\n    scoreBreakdown,","    applyCount:0,\n    rejectedApplyCount:0,\n    authorizedApplyReason:AUTHORIZED_APPLY_REASON,\n    applyAttempts:APPLY_ATTEMPTS,\n    scoreBreakdown,",'API counters');
engine=replaceRequired(engine,"  function apply(reason='manual'){\n    if(applying)return API.latest||null;","  function apply(reason='manual'){\n    const accepted=reason===AUTHORIZED_APPLY_REASON;\n    const attempt={reason,accepted,at:new Date().toISOString()};\n    APPLY_ATTEMPTS.push(attempt);\n    if(!accepted){\n      API.rejectedApplyCount+=1;\n      API.latestRejected={version:VERSION,applied:false,skipped:true,reason,error:`Only ${AUTHORIZED_APPLY_REASON} may apply canonical scores.`,attemptedAt:attempt.at};\n      return API.latestRejected;\n    }\n    if(API.applyCount>0)return API.latest||null;\n    if(applying)return API.latest||null;",'apply authorization');
await fs.writeFile('assets/js/scoring-engine.js',engine,'utf8');

let index=await fs.readFile('index.html','utf8');
index=replaceRequired(index,'assets/js/scoring-engine.js?v=scoring-engine-20260713b-single-owner','assets/js/scoring-engine.js?v=scoring-engine-20260713c-finalizer-only','engine cache key');
await fs.writeFile('index.html',index,'utf8');

let validator=await fs.readFile('scripts/validate-stage3-scoring-cleanup.mjs','utf8');
validator=replaceRequired(validator,"      engineApplyCount:engine?.applyCount??null,\n      finalEngineAliasIsCanonical:window.UFC_FINAL_SCORE_ENGINE===engine,","      engineApplyCount:engine?.applyCount??null,\n      engineRejectedApplyCount:engine?.rejectedApplyCount??null,\n      engineApplyAttempts:(engine?.applyAttempts||[]).map(attempt=>({...attempt})),\n      finalEngineAliasIsCanonical:window.UFC_FINAL_SCORE_ENGINE===engine,",'validator diagnostics');
await fs.writeFile('scripts/validate-stage3-scoring-cleanup.mjs',validator,'utf8');

console.log('Stage 3 score engine locked to the ownership finalizer.');

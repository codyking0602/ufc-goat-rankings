import fs from 'node:fs/promises';

function required(source,before,after,label){
  if(source.includes(after)&&!source.includes(before))return source;
  if(!source.includes(before))throw new Error(`Missing ${label} pattern.`);
  return source.replace(before,after);
}
async function edit(path,changes){
  let source=await fs.readFile(path,'utf8');
  for(const [before,after,label] of changes)source=required(source,before,after,label);
  await fs.writeFile(path,source,'utf8');
}

await edit('assets/js/championship-resume-live.js',[
  ["const VERSION='championship-resume-live-20260712a-old-era-chain';","const VERSION='championship-resume-live-20260713a-category-only';",'championship version'],
  ["o.snapshotStats.titleFightWins=report.titleFightWins;o.snapshotStats.adjustedTitleWins=r(report.adjustedTitleCredit);o.snapshotStats.championshipScore=score;","o.snapshotStats.titleFightWins=report.titleFightWins;o.snapshotStats.adjustedTitleWins=r(report.adjustedTitleCredit);",'championship display score mirror'],
  ["  function applyFinalScore(reason){if(window.UFC_FINAL_SCORE_ENGINE?.apply){try{return window.UFC_FINAL_SCORE_ENGINE.apply(reason);}catch(e){}}return null;}\n\n","",'championship final-score helper'],
  ["  loadProfilePolish();loadOpponentQualityShadow();applyFinalScore('championship-resume-category-update');","  loadProfilePolish();loadOpponentQualityShadow();",'championship final-score call']
]);

await edit('assets/data/prime-dominance-live-promoter.js',[
  ["const VERSION='prime-dominance-live-promoter-20260710d-canonical-prime-source';","const VERSION='prime-dominance-live-promoter-20260713a-category-only';",'prime version'],
  ["override.snapshotStats={...(override.snapshotStats||{}),primeRecord,primeRecordContext:context,primeDominance:row.primeDominance,primeDominanceLive:row.primeDominance,primeFinishRate:finishRateText(entry),roundControl:`${entry.roundControlPct}%`,roundsWon:roundsWonText(entry),dominanceProfile:entry.dominanceProfile,primeDominanceRecordInput:entry.primeRecord||null,primeDominanceRebuildRequired:row.primeDominanceRebuildRequired};","override.snapshotStats={...(override.snapshotStats||{}),primeRecord,primeRecordContext:context,primeFinishRate:finishRateText(entry),roundControl:`${entry.roundControlPct}%`,roundsWon:roundsWonText(entry),dominanceProfile:entry.dominanceProfile,primeDominanceRecordInput:entry.primeRecord||null,primeDominanceRebuildRequired:row.primeDominanceRebuildRequired};",'prime display score mirrors'],
  ["  if(window.UFC_FINAL_SCORE_ENGINE?.apply)window.UFC_FINAL_SCORE_ENGINE.apply('prime-dominance-promoted');\n","",'prime final-score call']
]);

await edit('assets/data/longevity-live-promoter.js',[
  ["const VERSION='longevity-live-promoter-20260710b-144-month-ceiling';","const VERSION='longevity-live-promoter-20260713a-category-only';",'longevity version'],
  ["override.snapshotStats={...(override.snapshotStats||{}),activeEliteYears:round2(shadow.activeEliteYears),longevityScore:raw30};","override.snapshotStats={...(override.snapshotStats||{}),activeEliteYears:round2(shadow.activeEliteYears)};",'longevity display score mirror'],
  ["      if(window.UFC_FINAL_SCORE_ENGINE?.apply){try{window.UFC_FINAL_SCORE_ENGINE.apply('longevity-category-update');}catch(e){}}\n","",'longevity final-score call']
]);

await edit('assets/data/apex-peak-live-bonus.js',[
  ["const VERSION='apex-peak-live-bonus-20260710a-category-only';","const VERSION='apex-peak-live-bonus-20260713a-category-only';",'apex version'],
  ["    const finalScoreResult=window.UFC_FINAL_SCORE_ENGINE?.apply?.('apex-peak-category-update')||null;\n","",'apex final-score call'],
  ["      finalScoreEngineVersion:window.UFC_FINAL_SCORE_ENGINE?.version||null,\n      finalScoreResult,\n","",'apex final-score status']
]);

await edit('assets/data/canonical-fighter-registry-batch-eight.js',[
  ["const VERSION = 'canonical-fighter-registry-batch-eight-20260712d-final-handoffs';","const VERSION = 'canonical-fighter-registry-batch-eight-20260713a-no-score-finalize';",'batch-eight version'],
  ["  function rerank() {\n    DATA.men.sort((a, b) =>\n      Number(b.totalScore || 0) - Number(a.totalScore || 0) ||\n      String(a.fighter).localeCompare(String(b.fighter))\n    );\n    DATA.men.forEach((row, index) => { row.rank = index + 1; });\n  }\n\n","",'batch-eight rerank function'],
  ["      timesFinishedPrime: fighter.stopped,\n      primeStoppageLosses: fighter.stopped,\n      apexPeak: fighter.c[4],\n      lossContext: fighter.c[5],\n      eraDepthAdjustment: fighter.c[6]","      timesFinishedPrime: fighter.stopped,\n      primeStoppageLosses: fighter.stopped",'batch-eight display score mirrors'],
  ["    rerank();\n\n","",'batch-eight base rerank'],
  ["    if (window.UFC_FINAL_SCORE_ENGINE?.apply) window.UFC_FINAL_SCORE_ENGINE.apply('batch-eight-canonical-finalize');\n    rerank();\n    window.UFC_DYNAMIC_ROSTER_RUNTIME?.sync?.('batch-eight-canonical-finalize');\n\n","",'batch-eight finalize hooks']
]);

await edit('assets/data/quality-wins-audit-cruz-ilia.js',[
  ["const VERSION='quality-wins-audit-cruz-ilia-20260712b-evidence-sync';","const VERSION='quality-wins-audit-cruz-ilia-20260713a-category-only';",'quality audit version'],
  ["      winProfile:summary.winProfile,\n      opponentQualityScore:liveScore","      winProfile:summary.winProfile",'quality display score mirror'],
  ["  function syncRanksAndOverrides(){\n    const overrides=displayOverrides();\n    if(!overrides)return;\n    [...(window.RANKING_DATA?.men||[]),...(window.RANKING_DATA?.women||[])].forEach(row=>{\n      if(!row?.fighter)return;\n      overrides[row.fighter]=overrides[row.fighter]||{};\n      overrides[row.fighter].allTimeRank=row.rank;\n      overrides[row.fighter].rank=row.rank;\n      overrides[row.fighter].overallOvr=row.overallOvr;\n      overrides[row.fighter].totalScore=row.totalScore;\n      overrides[row.fighter].rawScore=row.rawScore;\n    });\n  }\n","",'quality rank mirror function'],
  ["    const finalScoreResult=window.UFC_FINAL_SCORE_ENGINE?.apply?.('quality-wins-audit-cruz-ilia')||null;\n    syncRanksAndOverrides();\n","",'quality final-score hooks'],
  ["const result={version:VERSION,applied:true,attempts,changes,results,validation,validationPassed:validation.every(row=>row.passed),finalScoreResult,appliedAt:new Date().toISOString()};","const result={version:VERSION,applied:true,attempts,changes,results,validation,validationPassed:validation.every(row=>row.passed),appliedAt:new Date().toISOString()};",'quality result cleanup']
]);

await edit('assets/data/approved-fighter-audit-corrections.js',[
  ["const VERSION='approved-fighter-audit-corrections-20260712d-cruz-tate-ilia-deiveson';","const VERSION='approved-fighter-audit-corrections-20260713e-no-score-finalize';",'approved correction version'],
  ["patchDisplay('Tito Ortiz',{snapshotStats:{activeEliteYears:6.71,roundsWonPct:62.16,lossContextScore:-9.5},","patchDisplay('Tito Ortiz',{snapshotStats:{activeEliteYears:6.71,roundsWonPct:62.16},",'Tito score mirror'],
  ["patchDisplay('Jessica Andrade',{snapshotStats:{activeEliteYears:5.41,apexPeak:3.25},","patchDisplay('Jessica Andrade',{snapshotStats:{activeEliteYears:5.41},",'Andrade score mirror'],
  ["patchDisplay(fighter,{snapshotStats:{primeRecord:input.record,roundsWonPct:roundControlPct,primeDominanceShadow:total,primeFinishRate:`${round2(finishRate*100)}%`,primeRecordContext:input.reason},","patchDisplay(fighter,{snapshotStats:{primeRecord:input.record,roundsWonPct:roundControlPct,primeFinishRate:`${round2(finishRate*100)}%`,primeRecordContext:input.reason},",'approved prime score mirror'],
  ["    const finalScoreResult=window.UFC_FINAL_SCORE_ENGINE?.apply?.('approved-six-fighter-audit-corrections')||null;\n    const overrides=displayOverrides();\n    if(overrides){\n      [...(DATA.men||[]),...(DATA.women||[])].forEach(row=>{\n        if(!row?.fighter)return;\n        overrides[row.fighter]=overrides[row.fighter]||{};\n        overrides[row.fighter].allTimeRank=row.rank;\n        overrides[row.fighter].rank=row.rank;\n        overrides[row.fighter].overallOvr=row.overallOvr;\n        overrides[row.fighter].totalScore=row.totalScore;\n        overrides[row.fighter].rawScore=row.rawScore;\n      });\n    }\n","",'approved final-score and rank mirrors'],
  ["const result={applied:true,fighters:Object.keys(corrections),results,finalScoreResult,version:VERSION,appliedAt:new Date().toISOString()};","const result={applied:true,fighters:Object.keys(corrections),results,version:VERSION,appliedAt:new Date().toISOString()};",'approved result cleanup']
]);

await edit('assets/data/module-versions.js',[
  ["primeDominanceLivePromoter:'20260710d-canonical-prime-source'","primeDominanceLivePromoter:'20260713a-category-only'",'prime cache version'],
  ["approvedFighterAuditCorrections:'20260710a-tito-pereira-hughes-kayla'","approvedFighterAuditCorrections:'20260713e-no-score-finalize'",'approved cache version'],
  ["longevityLivePromoter:'20260710b-144-month-ceiling'","longevityLivePromoter:'20260713a-category-only'",'longevity cache version'],
  ["apexPeakLiveBonus:'20260710a-category-only'","apexPeakLiveBonus:'20260713a-category-only'",'apex cache version']
]);

await edit('assets/data/ranking-data-patches.js',[
  ["assets/js/championship-resume-live.js?v=championship-resume-live-20260710e-frankie-quality-chain","assets/js/championship-resume-live.js?v=championship-resume-live-20260713a-category-only",'championship cache key']
]);

await edit('index.html',[
  ["canonical-fighter-registry-batch-eight.js?v=canonical-fighter-registry-batch-eight-20260712d-final-handoffs","canonical-fighter-registry-batch-eight.js?v=canonical-fighter-registry-batch-eight-20260713a-no-score-finalize",'batch-eight cache key'],
  ["window.UFC_MODULE_VERSIONS.approvedFighterAuditCorrections='20260712d-cruz-tate-ilia-deiveson';","window.UFC_MODULE_VERSIONS.approvedFighterAuditCorrections='20260713e-no-score-finalize';",'approved inline cache version'],
  ["quality-wins-audit-cruz-ilia.js?v=quality-wins-audit-cruz-ilia-20260712b-evidence-sync","quality-wins-audit-cruz-ilia.js?v=quality-wins-audit-cruz-ilia-20260713a-category-only",'quality audit cache key']
]);

await edit('scripts/validate-stage3-scoring-cleanup.mjs',[
  ["    ||runtime.engineApplyCount!==1\n    ||runtime.finalEngineAliasIsCanonical!==true","    ||runtime.engineApplyCount!==1\n    ||Number(runtime.engineRejectedApplyCount||0)!==0\n    ||runtime.engineApplyAttempts.length!==1\n    ||runtime.engineApplyAttempts[0]?.reason!=='stage3-scoring-ownership-finalizer'\n    ||runtime.engineApplyAttempts[0]?.accepted!==true\n    ||runtime.finalEngineAliasIsCanonical!==true",'zero rejected apply assertion']
]);

console.log('Removed all seven legacy final-score callers and score mirrors.');

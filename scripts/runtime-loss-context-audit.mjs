// Runtime audit for the Stage 2 scoring ownership model.
// Verifies the live hybrid Loss Context modifier without requiring score-derived display overrides.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import process from 'node:process';

const baseUrl=process.env.UFC_APP_URL||'http://127.0.0.1:4173';
const outputPath=process.env.UFC_AUDIT_OUTPUT||'artifacts/loss-context-runtime-report.json';
const summaryPath=process.env.UFC_AUDIT_SUMMARY_OUTPUT||'artifacts/loss-context-runtime-summary.json';
const judgmentPath=process.env.UFC_AUDIT_JUDGMENT_OUTPUT||'artifacts/loss-context-hybrid-judgment-review.json';

await fs.mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const consoleErrors=[];
const pageErrors=[];
page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
page.on('pageerror',error=>pageErrors.push(String(error?.stack||error)));

try{
  await page.goto(baseUrl,{waitUntil:'domcontentloaded',timeout:60_000});
  await page.waitForFunction(()=>{
    const data=window.RANKING_DATA;
    const count=(data?.men?.length||0)+(data?.women?.length||0);
    return Boolean(
      count&&
      window.UFC_SCORING_PIPELINE?.status==='ready'&&
      window.UFC_SCORING_RUNTIME_COORDINATOR?.applied===true&&
      window.UFC_DYNAMIC_ROSTER_SCORING_REPAIR?.applied===true&&
      window.UFC_LOSS_CONTEXT_HYBRID_LIVE?.applied===true&&
      window.UFC_FINAL_SCORE_ENGINE?.applyCount===1
    );
  },null,{timeout:120_000,polling:100});
  await page.waitForTimeout(300);

  const result=await page.evaluate(async()=>{
    const clone=value=>JSON.parse(JSON.stringify(value??null));
    const key=name=>String(name||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
    const data=window.RANKING_DATA||{};
    const boardRows=[...(data.men||[]),...(data.women||[])];
    const profiles=data.fighters||[];
    const shadow=window.UFC_LOSS_CONTEXT_HYBRID_SHADOW;
    const audit=window.UFC_LOSS_CONTEXT_HYBRID_AUDIT;
    const live=window.UFC_LOSS_CONTEXT_HYBRID_LIVE;
    const shadowByKey=new Map((shadow?.scored||[]).map(row=>[key(row.fighter),row]));
    const boardByKey=new Map(boardRows.map(row=>[key(row.fighter),row]));

    const boardPenaltyMismatches=boardRows.filter(row=>Math.abs(Number(row.penalty)-Number(shadowByKey.get(key(row.fighter))?.recommendedPenalty))>0.001).map(row=>row.fighter);
    const profilePenaltyMismatches=profiles.filter(profile=>{
      const board=boardByKey.get(key(profile.fighter));
      return !board||Math.abs(Number(profile.penalty)-Number(board.penalty))>0.001;
    }).map(row=>row.fighter);

    const forbiddenOverrideFields=[];
    Object.entries(window.DISPLAY_OVERRIDES||{}).forEach(([fighter,override])=>{
      if(!override||typeof override!=='object')return;
      ['overallOvr','allTimeRank','rankLabel','totalScore','rawScore','rank','baseScore','penalty','lossPenalty','lossContext','eraDepthAdjustment','lossContextHybrid','divisionEraDepth'].forEach(field=>{
        if(Object.prototype.hasOwnProperty.call(override,field))forbiddenOverrideFields.push({fighter,field});
      });
      Object.entries(override.categories||{}).forEach(([category,value])=>{
        if(!value||typeof value!=='object')return;
        ['ovr','rank','score','value'].forEach(field=>{
          if(Object.prototype.hasOwnProperty.call(value,field))forbiddenOverrideFields.push({fighter,field:`categories.${category}.${field}`});
        });
      });
    });

    const ownershipMismatches=boardRows.filter(row=>row.overallScoreOwner!=='final-score-engine.js'||row.finalScoreEngineVersion!==window.UFC_FINAL_SCORE_ENGINE?.version).map(row=>row.fighter);

    let profileSurface={rendered:false,hasLiveLossContext:false,hasRank:false,hasOvr:false,text:''};
    if(typeof window.openFighter==='function'){
      window.openFighter('Justin Gaethje');
      document.querySelector('#fighterDetail .category-card[data-category="penalty"]')?.click();
      await new Promise(resolve=>setTimeout(resolve,100));
      const text=document.getElementById('fighterDetail')?.innerText||'';
      const gaethje=boardByKey.get(key('Justin Gaethje'));
      profileSurface={rendered:text.includes('Justin Gaethje'),hasLiveLossContext:text.includes(Number(gaethje?.penalty).toFixed(2))&&text.includes('Worst-loss severity'),hasRank:text.includes(`#${gaethje?.rank}`),hasOvr:text.includes(`${gaethje?.overallOvr}`),text:text.slice(0,2500)};
    }

    let compareSurface={rendered:false,hasGaethje:false,hasDricus:false,hasLiveRanks:false,text:''};
    if(document.getElementById('fighterA')&&document.getElementById('fighterB')&&typeof window.renderCompare==='function'){
      document.getElementById('fighterA').value='Justin Gaethje';
      document.getElementById('fighterB').value='Dricus du Plessis';
      window.renderCompare();
      const text=document.getElementById('compareResult')?.innerText||'';
      const gaethje=boardByKey.get(key('Justin Gaethje'));
      const dricus=boardByKey.get(key('Dricus du Plessis'));
      compareSurface={rendered:text.length>0,hasGaethje:text.includes('Justin Gaethje'),hasDricus:text.includes('Dricus du Plessis'),hasLiveRanks:text.includes(`#${gaethje?.rank}`)&&text.includes(`#${dricus?.rank}`),text:text.slice(0,2000)};
    }

    return {
      canonicalReconciliation:clone(window.UFC_LOSS_CONTEXT_FINAL_RECONCILIATION),
      ledgerFinalizer:clone(window.UFC_LOSS_CONTEXT_LEDGER_FINALIZER),
      pipeline:clone(window.UFC_SCORING_PIPELINE),
      coordinator:clone(window.UFC_SCORING_RUNTIME_COORDINATOR),
      finalScoreEngine:{version:window.UFC_FINAL_SCORE_ENGINE?.version||null,applyCount:window.UFC_FINAL_SCORE_ENGINE?.applyCount??null,deferredCount:window.UFC_FINAL_SCORE_ENGINE?.deferredCount??null,overallOwner:window.UFC_FINAL_SCORE_ENGINE?.overallOwner||null,mode:window.UFC_FINAL_SCORE_ENGINE?.mode||null},
      hybridShadow:clone(shadow),
      hybridAudit:clone(audit),
      hybridLive:clone(live),
      liveConsistency:{rosterCount:boardRows.length,profileCount:profiles.length,boardPenaltyMismatchCount:boardPenaltyMismatches.length,boardPenaltyMismatches,profilePenaltyMismatchCount:profilePenaltyMismatches.length,profilePenaltyMismatches,ownershipMismatchCount:ownershipMismatches.length,ownershipMismatches,forbiddenOverrideFieldCount:forbiddenOverrideFields.length,forbiddenOverrideFields},
      profileSurface,
      compareSurface,
      menTop20:(data.men||[]).slice(0,20).map(row=>({rank:row.rank,fighter:row.fighter,totalScore:row.totalScore,penalty:row.penalty,overallOvr:row.overallOvr})),
      womenBoard:(data.women||[]).map(row=>({rank:row.rank,fighter:row.fighter,totalScore:row.totalScore,penalty:row.penalty,overallOvr:row.overallOvr}))
    };
  });

  const payload={generatedAt:new Date().toISOString(),baseUrl,...result,browserDiagnostics:{consoleErrors,pageErrors}};
  await fs.writeFile(outputPath,`${JSON.stringify(payload,null,2)}\n`,'utf8');

  const compactJudgmentRows=(result.hybridAudit?.judgmentReview||[]).map(row=>({fighter:row.fighter,board:row.board,currentRank:row.currentRank,projectedRank:row.projectedRank,rankMovement:row.rankMovement,currentPenalty:row.currentPenalty,recommendedPenalty:row.recommendedPenalty,projectedDelta:row.projectedDelta,severity:row.severity,frequency:row.frequency,primeLossCount:row.primeLossCount,primeFinishCount:row.primeFinishCount,primeVolumeFloor:row.primeVolumeFloor,divisionDiscountPct:row.divisionDiscountPct,worstLosses:row.worstLosses||[]}));
  const judgmentReview={generatedAt:payload.generatedAt,shadowVersion:result.hybridShadow?.version??null,auditVersion:result.hybridAudit?.version??null,liveVersion:result.hybridLive?.version??null,readyForLivePromotion:result.hybridAudit?.readyForLivePromotion??false,liveApplied:result.hybridLive?.applied??false,criticalFlags:result.hybridAudit?.criticalFlags||[],summary:result.hybridAudit?.summary??null,rules:result.hybridShadow?.rules??null,fighters:compactJudgmentRows};
  await fs.writeFile(judgmentPath,`${JSON.stringify(judgmentReview,null,2)}\n`,'utf8');

  const summary={
    generatedAt:payload.generatedAt,
    pipelineStatus:result.pipeline?.status??null,
    coordinatorApplied:result.coordinator?.applied??false,
    finalScoreApplyCount:result.finalScoreEngine?.applyCount??null,
    complete:result.ledgerFinalizer?.complete??result.canonicalReconciliation?.complete??false,
    rosterLedgerCoverage:result.canonicalReconciliation?.rosterLedgerCoverage??result.liveConsistency.rosterCount,
    rosterTarget:result.hybridLive?.rosterCount??result.liveConsistency.rosterCount,
    hybrid:{applied:result.hybridAudit?.applied??false,shadowVersion:result.hybridShadow?.version??null,auditVersion:result.hybridAudit?.version??null,summary:result.hybridAudit?.summary??null,readyForLivePromotion:result.hybridAudit?.readyForLivePromotion??false,criticalFlags:result.hybridAudit?.criticalFlags||[],judgmentReview:compactJudgmentRows,live:result.hybridLive||null},
    liveConsistency:result.liveConsistency,
    profileSurface:result.profileSurface,
    compareSurface:result.compareSurface,
    menTop20:result.menTop20,
    womenBoard:result.womenBoard,
    browserDiagnostics:{consoleErrors,pageErrors}
  };
  await fs.writeFile(summaryPath,`${JSON.stringify(summary,null,2)}\n`,'utf8');

  console.log('LOSS_CONTEXT_RUNTIME_SUMMARY');
  console.log(JSON.stringify({pipelineStatus:summary.pipelineStatus,coordinatorApplied:summary.coordinatorApplied,finalScoreApplyCount:summary.finalScoreApplyCount,rosterTarget:summary.rosterTarget,hybridLiveApplied:summary.hybrid.live?.applied??false,hybridLiveMismatchCount:summary.hybrid.live?.mismatchCount??null,boardPenaltyMismatchCount:summary.liveConsistency.boardPenaltyMismatchCount,profilePenaltyMismatchCount:summary.liveConsistency.profilePenaltyMismatchCount,ownershipMismatchCount:summary.liveConsistency.ownershipMismatchCount,forbiddenOverrideFieldCount:summary.liveConsistency.forbiddenOverrideFieldCount,profileSurfacePassed:Boolean(summary.profileSurface?.rendered&&summary.profileSurface?.hasLiveLossContext&&summary.profileSurface?.hasRank&&summary.profileSurface?.hasOvr),compareSurfacePassed:Boolean(summary.compareSurface?.rendered&&summary.compareSurface?.hasGaethje&&summary.compareSurface?.hasDricus&&summary.compareSurface?.hasLiveRanks),consoleErrorCount:consoleErrors.length,pageErrorCount:pageErrors.length},null,2));

  const expectedRoster=Number(summary.rosterTarget||0);
  const failed=summary.pipelineStatus!=='ready'
    || summary.coordinatorApplied!==true
    || Number(summary.finalScoreApplyCount)!==1
    || result.finalScoreEngine?.overallOwner!=='final-score-engine.js'
    || result.hybridAudit?.applied!==true
    || result.hybridAudit?.summary?.coverageComplete!==true
    || result.hybridAudit?.summary?.judgmentApproved!==true
    || result.hybridLive?.applied!==true
    || Number(result.hybridLive?.promotedCount||0)!==expectedRoster
    || Number(result.hybridLive?.mismatchCount||0)!==0
    || Number(result.liveConsistency?.boardPenaltyMismatchCount||0)!==0
    || Number(result.liveConsistency?.profilePenaltyMismatchCount||0)!==0
    || Number(result.liveConsistency?.ownershipMismatchCount||0)!==0
    || Number(result.liveConsistency?.forbiddenOverrideFieldCount||0)!==0
    || result.profileSurface?.rendered!==true
    || result.profileSurface?.hasLiveLossContext!==true
    || result.profileSurface?.hasRank!==true
    || result.profileSurface?.hasOvr!==true
    || result.compareSurface?.rendered!==true
    || result.compareSurface?.hasGaethje!==true
    || result.compareSurface?.hasDricus!==true
    || result.compareSurface?.hasLiveRanks!==true
    || pageErrors.length>0;
  if(failed)process.exitCode=1;
}finally{
  await browser.close();
}

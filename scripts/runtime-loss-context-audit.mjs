// Runtime audit for live hybrid Loss Context under the Stage 2 single-owner scoring architecture.
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
  await page.waitForFunction(()=>window.UFC_SCORING_PIPELINE?.status==='ready'&&window.UFC_LOSS_CONTEXT_HYBRID_AUDIT?.applied===true&&window.UFC_LOSS_CONTEXT_HYBRID_LIVE?.applied===true&&window.UFC_SCORING_OWNERSHIP_CONTRACT?.applied===true,null,{timeout:120_000,polling:100});
  await page.waitForTimeout(500);

  const result=await page.evaluate(async()=>{
    const clone=value=>JSON.parse(JSON.stringify(value??null));
    const key=name=>String(name||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
    const num=value=>Number.isFinite(Number(value))?Number(value):0;
    const data=window.RANKING_DATA||{};
    const boards=[...(data.men||[]),...(data.women||[])];
    const profiles=data.fighters||[];
    const canonical=window.UFC_CANONICAL_SCORING_RECORDS||null;
    const contract=window.UFC_SCORING_OWNERSHIP_CONTRACT||null;
    const hybridShadow=window.UFC_LOSS_CONTEXT_HYBRID_SHADOW||null;
    const hybridAudit=window.UFC_LOSS_CONTEXT_HYBRID_AUDIT||null;
    const hybridLive=window.UFC_LOSS_CONTEXT_HYBRID_LIVE||null;
    const byProfile=new Map(profiles.map(row=>[key(row?.fighter),row]));

    const canonicalMismatches=[];
    const evidenceMismatches=[];
    const profileMismatches=[];
    const missingDetail=[];
    boards.forEach(row=>{
      const expected=canonical?.entryFor?.(row.fighter)||null;
      const evidence=hybridShadow?.entryFor?.(row.fighter)||(hybridShadow?.results||hybridShadow?.scored||[]).find(item=>key(item?.fighter)===key(row.fighter))||null;
      if(!expected||Math.abs(num(row.penalty)-num(expected?.penalty))>0.001)canonicalMismatches.push({fighter:row.fighter,expected:expected?.penalty??null,actual:row.penalty});
      if(!evidence||Math.abs(num(row.penalty)-num(evidence?.recommendedPenalty))>0.001)evidenceMismatches.push({fighter:row.fighter,expected:evidence?.recommendedPenalty??null,actual:row.penalty});
      const profile=byProfile.get(key(row.fighter));
      if(!profile||Math.abs(num(profile.penalty)-num(row.penalty))>0.001)profileMismatches.push({fighter:row.fighter,board:row.penalty,profile:profile?.penalty??null});
      if(!row.lossContextHybrid)missingDetail.push(row.fighter);
    });

    const scoreFields=['championship','opponentQuality','primeDominance','longevity','apexPeak','penalty','eraDepthAdjustment','totalScore','rawScore','baseScore','preEraDepthTotalScore','rank','allTimeRank','overallOvr','lossContextHybrid','divisionEraDepth'];
    const overrideViolations=[];
    Object.entries(window.DISPLAY_OVERRIDES||{}).forEach(([fighter,override])=>{
      if(!override||typeof override!=='object')return;
      scoreFields.forEach(field=>{if(Object.prototype.hasOwnProperty.call(override,field))overrideViolations.push({fighter,field});});
      ['snapshotStats','packetProfileStats'].forEach(container=>{
        const target=override[container];
        if(!target||typeof target!=='object')return;
        scoreFields.forEach(field=>{if(Object.prototype.hasOwnProperty.call(target,field))overrideViolations.push({fighter,field:`${container}.${field}`});});
      });
    });
    const wrongOwners=boards.filter(row=>row.scoreInputOwner!=='scoring-engine.js'||row.overallScoreOwner!=='scoring-engine.js').map(row=>({fighter:row.fighter,scoreInputOwner:row.scoreInputOwner,overallScoreOwner:row.overallScoreOwner}));

    let profileSurface={rendered:false,hasLiveLossContext:false,hasRank:false,hasOvr:false,lossRating:null,text:''};
    if(typeof window.openFighter==='function'){
      window.openFighter('Justin Gaethje');
      document.querySelector('#fighterDetail .category-card[data-category="penalty"]')?.click();
      await new Promise(resolve=>setTimeout(resolve,100));
      const text=document.getElementById('fighterDetail')?.innerText||'';
      const row=boards.find(item=>key(item.fighter)===key('Justin Gaethje'));
      const lossRating=window.UFC_SCORING_ENGINE?.categoryOvrFor?.(row,'penalty')??window.categoryOvr?.(row,'penalty')??null;
      profileSurface={
        rendered:text.includes('Justin Gaethje'),
        hasLiveLossContext:text.includes('Loss Context')&&text.includes('How losses affect it')&&(lossRating===null||text.includes(String(lossRating))),
        hasRank:text.includes(`#${row?.rank}`),
        hasOvr:text.includes(`${row?.overallOvr}`),
        lossRating,
        text:text.slice(0,2500)
      };
    }

    let compareSurface={rendered:false,hasGaethje:false,hasDricus:false,hasLiveRanks:false,text:''};
    if(document.getElementById('fighterA')&&document.getElementById('fighterB')&&typeof window.renderCompare==='function'){
      document.getElementById('fighterA').value='Justin Gaethje';
      document.getElementById('fighterB').value='Dricus du Plessis';
      window.renderCompare();
      const text=document.getElementById('compareResult')?.innerText||'';
      const gaethje=boards.find(row=>key(row.fighter)===key('Justin Gaethje'));
      const dricus=boards.find(row=>key(row.fighter)===key('Dricus du Plessis'));
      compareSurface={rendered:text.length>0,hasGaethje:text.includes('Justin Gaethje'),hasDricus:text.includes('Dricus du Plessis'),hasLiveRanks:text.includes(`#${gaethje?.rank}`)&&text.includes(`#${dricus?.rank}`),text:text.slice(0,2000)};
    }

    return{
      pipeline:clone(window.UFC_SCORING_PIPELINE),
      reconciliation:clone(window.UFC_LOSS_CONTEXT_FINAL_RECONCILIATION),
      hybridShadow:clone(hybridShadow),
      hybridAudit:clone(hybridAudit),
      hybridLive:clone(hybridLive),
      ownershipContract:clone(contract),
      consistency:{rosterCount:boards.length,canonicalMismatchCount:canonicalMismatches.length,canonicalMismatches,evidenceMismatchCount:evidenceMismatches.length,evidenceMismatches,profileMismatchCount:profileMismatches.length,profileMismatches,missingDetailCount:missingDetail.length,missingDetail,overrideViolationCount:overrideViolations.length,overrideViolations,wrongOwnerCount:wrongOwners.length,wrongOwners},
      profileSurface,compareSurface,
      menTop20:(data.men||[]).slice(0,20).map(row=>({rank:row.rank,fighter:row.fighter,totalScore:row.totalScore,penalty:row.penalty,overallOvr:row.overallOvr})),
      womenBoard:(data.women||[]).map(row=>({rank:row.rank,fighter:row.fighter,totalScore:row.totalScore,penalty:row.penalty,overallOvr:row.overallOvr}))
    };
  });

  const payload={generatedAt:new Date().toISOString(),baseUrl,...result,browserDiagnostics:{consoleErrors,pageErrors}};
  const judgmentReview={generatedAt:payload.generatedAt,shadowVersion:result.hybridShadow?.version??null,auditVersion:result.hybridAudit?.version??null,liveVersion:result.hybridLive?.version??null,readyForLivePromotion:result.hybridAudit?.readyForLivePromotion??false,liveApplied:result.hybridLive?.applied??false,criticalFlags:result.hybridAudit?.criticalFlags||[],summary:result.hybridAudit?.summary??null,rules:result.hybridShadow?.rules??null,fighters:result.hybridAudit?.judgmentReview||[]};
  const summary={generatedAt:payload.generatedAt,pipelineStatus:result.pipeline?.status??null,reconciliationComplete:result.reconciliation?.complete??false,ownershipApplied:result.ownershipContract?.applied??false,hybridAuditApplied:result.hybridAudit?.applied??false,hybridCoverageComplete:result.hybridAudit?.summary?.coverageComplete??false,hybridCriticalFlagCount:result.hybridAudit?.summary?.criticalFlagCount??null,hybridLiveApplied:result.hybridLive?.applied??false,hybridLivePromotedCount:result.hybridLive?.promotedCount??null,hybridLiveMismatchCount:result.hybridLive?.mismatchCount??null,consistency:result.consistency,profileSurface:result.profileSurface,compareSurface:result.compareSurface,browserDiagnostics:{consoleErrors,pageErrors}};
  await fs.writeFile(outputPath,`${JSON.stringify(payload,null,2)}\n`,'utf8');
  await fs.writeFile(summaryPath,`${JSON.stringify(summary,null,2)}\n`,'utf8');
  await fs.writeFile(judgmentPath,`${JSON.stringify(judgmentReview,null,2)}\n`,'utf8');
  console.log('LOSS_CONTEXT_RUNTIME_SUMMARY');
  console.log(JSON.stringify(summary,null,2));

  const failed=result.pipeline?.status!=='ready'
    ||result.reconciliation?.complete!==true
    ||result.hybridAudit?.applied!==true
    ||result.hybridAudit?.summary?.coverageComplete!==true
    ||result.hybridAudit?.summary?.judgmentApproved!==true
    ||Number(result.hybridAudit?.summary?.criticalFlagCount||0)!==0
    ||result.hybridLive?.applied!==true
    ||Number(result.hybridLive?.promotedCount||0)!==Number(result.consistency?.rosterCount||0)
    ||Number(result.hybridLive?.mismatchCount||0)!==0
    ||result.ownershipContract?.applied!==true
    ||Number(result.consistency?.canonicalMismatchCount||0)!==0
    ||Number(result.consistency?.evidenceMismatchCount||0)!==0
    ||Number(result.consistency?.profileMismatchCount||0)!==0
    ||Number(result.consistency?.missingDetailCount||0)!==0
    ||Number(result.consistency?.overrideViolationCount||0)!==0
    ||Number(result.consistency?.wrongOwnerCount||0)!==0
    ||result.profileSurface?.rendered!==true
    ||result.profileSurface?.hasLiveLossContext!==true
    ||result.profileSurface?.hasRank!==true
    ||result.profileSurface?.hasOvr!==true
    ||result.compareSurface?.rendered!==true
    ||result.compareSurface?.hasGaethje!==true
    ||result.compareSurface?.hasDricus!==true
    ||result.compareSurface?.hasLiveRanks!==true
    ||pageErrors.length>0;
  if(failed)process.exitCode=1;
}finally{
  await browser.close();
}

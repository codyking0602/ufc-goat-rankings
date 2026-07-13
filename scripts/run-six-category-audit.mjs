import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const baseUrl=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage();

page.on('console',message=>console.log(`[browser:${message.type()}] ${message.text()}`));
page.on('pageerror',error=>console.error(`[browser:error] ${error.stack||error.message}`));

try{
  await page.goto(`${baseUrl}/audit.html`,{waitUntil:'domcontentloaded',timeout:60_000});
  await page.waitForFunction(()=>{
    const win=document.getElementById('appFrame')?.contentWindow;
    return Boolean(
      win?.UFC_SCORING_PIPELINE?.status==='ready'&&
      win?.UFC_SCORING_RUNTIME_COORDINATOR?.applied===true&&
      win?.UFC_DYNAMIC_ROSTER_SCORING_REPAIR?.applied===true&&
      win?.UFC_FINAL_SCORE_ENGINE?.applyCount===1&&
      win?.UFC_SIX_CATEGORY_INTEGRITY_AUDIT
    );
  },null,{timeout:120_000,polling:100});

  const payload=await page.evaluate(()=>{
    const win=document.getElementById('appFrame')?.contentWindow;
    const audit=win?.UFC_SIX_CATEGORY_INTEGRITY_AUDIT;
    if(!audit||!win)return null;

    const report=audit.run('github-actions-stage-two-runtime');
    const engine=win.UFC_FINAL_SCORE_ENGINE||null;
    const weighting=win.UFC_SCORE_WEIGHTING||null;
    const pipeline=win.UFC_SCORING_PIPELINE||null;
    const coordinator=win.UFC_SCORING_RUNTIME_COORDINATOR||null;
    const tiers=win.UFC_CATEGORY_PERCENTILE_TIERS||null;
    const boardRows=[...(win.RANKING_DATA?.men||[]),...(win.RANKING_DATA?.women||[])];

    const canonicalFormulaMismatches=boardRows.map(row=>{
      const expected=engine?.scoreBreakdown?.(row)?.totalScore;
      const actual=Number(row?.totalScore);
      const delta=Number.isFinite(Number(expected))&&Number.isFinite(actual)?Math.round((actual-Number(expected)+Number.EPSILON)*100)/100:null;
      return {fighter:row?.fighter,expected,actual,delta};
    }).filter(row=>row.delta===null||Math.abs(row.delta)>0.011);

    const rowsWithWrongOwner=boardRows.filter(row=>row?.finalScoreEngineVersion!==engine?.version||row?.overallScoreOwner!=='final-score-engine.js').map(row=>({fighter:row?.fighter,expectedOwnerVersion:engine?.version||null,actualOwnerVersion:row?.finalScoreEngineVersion||null,actualOwner:row?.overallScoreOwner||null}));

    const forbiddenOverrideFields=[];
    Object.entries(win.DISPLAY_OVERRIDES||{}).forEach(([fighter,override])=>{
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

    const scoringAttrs=['data-prime-round-control-audit','data-prime-dominance-ledgers','data-prime-dominance-shadow-model','data-prime-dominance-live-promoter','data-prime-dominance-copy-polish','data-fighter-era-ledgers','data-longevity-shadow-scorer','data-longevity-live-promoter','data-apex-peak-score-corrections','data-apex-peak-component-audit','data-apex-peak-live-bonus','data-final-score-engine','data-category-percentile-tiers'];
    const scoringScriptCounts=Object.fromEntries(scoringAttrs.map(attr=>[attr,win.document.querySelectorAll(`script[${attr}]`).length]));
    const duplicateScoringScripts=Object.entries(scoringScriptCounts).filter(([,count])=>count>1).map(([attr,count])=>({attr,count}));

    const ownership={
      finalScoreEnginePresent:Boolean(engine),
      finalScoreEngineVersion:engine?.version||null,
      finalScoreApplyCount:engine?.applyCount??null,
      declaredOverallOwner:weighting?.overallOwner||null,
      legacyWeightingPresent:Boolean(weighting),
      legacyWeightingVersion:weighting?.version||null,
      legacyWeightingMode:weighting?.mode||null,
      legacyWeightingMutatesScores:weighting?.mutatesScores,
      fighterRowsChecked:boardRows.length,
      rowsWithWrongOwner,
      forbiddenOverrideFields,
      passed:Boolean(engine&&engine.applyCount===1&&weighting&&weighting.mutatesScores===false&&weighting.mode==='compatibility-only'&&weighting.overallOwner==='final-score-engine.js'&&rowsWithWrongOwner.length===0&&forbiddenOverrideFields.length===0)
    };

    const initialization={
      pipelinePresent:Boolean(pipeline),
      pipelineVersion:pipeline?.version||null,
      pipelineMode:pipeline?.mode||null,
      pipelineStatus:pipeline?.status||null,
      pipelineTimerCount:pipeline?.timerCount??null,
      pipelineRepeatedLoadCount:pipeline?.repeatedLoadCount??null,
      pipelineFinalScoreApplyCount:pipeline?.finalScoreApplyCount??null,
      engineApplyCount:engine?.applyCount??null,
      coordinatorVersion:coordinator?.version||null,
      coordinatorApplied:coordinator?.applied??false,
      coordinatorOwner:coordinator?.overallOwner||null,
      categoryTiersMode:tiers?.mode||null,
      categoryTiersMutateScores:tiers?.mutatesScores,
      categoryTiersReapplyPrime:tiers?.reappliesPrime,
      scoringScriptCounts,
      duplicateScoringScripts,
      sequence:pipeline?.sequence||[],
      passed:Boolean(pipeline?.status==='ready'&&pipeline?.mode==='deterministic-single-pass'&&pipeline?.timerCount===0&&pipeline?.repeatedLoadCount===0&&pipeline?.finalScoreApplyCount===1&&engine?.applyCount===1&&coordinator?.applied===true&&coordinator?.overallOwner==='final-score-engine.js'&&tiers?.mutatesScores===false&&tiers?.reappliesPrime===false&&duplicateScoringScripts.length===0)
    };

    report.formula=engine?.formula||report.formula;
    report.formulaMismatches=canonicalFormulaMismatches;
    report.summary.formulaMismatchCount=canonicalFormulaMismatches.length;
    report.ownership=ownership;
    report.initialization=initialization;
    report.summary.ownershipPass=ownership.passed;
    report.summary.deterministicInitializationPass=initialization.passed;
    report.summary.scoreDerivedOverrideFieldCount=forbiddenOverrideFields.length;
    report.stageTwoPassed=ownership.passed&&initialization.passed&&canonicalFormulaMismatches.length===0;

    const markdown=`${audit.exportMarkdown()}\n\n## Stage 2 Canonical Formula\n\n`+
      `- Formula: ${report.formula}\n`+
      `- Final-engine formula mismatches: ${canonicalFormulaMismatches.length}\n\n`+
      `## Overall Score Ownership\n\n`+
      `- Final score engine: ${ownership.finalScoreEngineVersion||'missing'}\n`+
      `- Final score apply count: ${String(ownership.finalScoreApplyCount)}\n`+
      `- Fighter rows with a non-final owner: ${ownership.rowsWithWrongOwner.length}\n`+
      `- Score-derived display override fields: ${ownership.forbiddenOverrideFields.length}\n`+
      `- Ownership gate: ${ownership.passed?'PASS':'FAIL'}\n\n`+
      `## Deterministic Initialization\n\n`+
      `- Pipeline: ${initialization.pipelineVersion||'missing'}\n`+
      `- Coordinator: ${initialization.coordinatorVersion||'missing'}\n`+
      `- Status: ${initialization.pipelineStatus||'missing'}\n`+
      `- Scoring timers: ${String(initialization.pipelineTimerCount)}\n`+
      `- Final score applies: ${String(initialization.engineApplyCount)}\n`+
      `- Duplicate scoring scripts: ${initialization.duplicateScoringScripts.length}\n`+
      `- Deterministic initialization gate: ${initialization.passed?'PASS':'FAIL'}\n`;

    return{report,json:JSON.stringify(report,null,2),markdown};
  });

  if(!payload?.report)throw new Error('Six-category integrity report was not available after Stage 2 finalization.');

  await mkdir('docs/audits',{recursive:true});
  await writeFile('docs/audits/runtime-six-category-audit.json',`${payload.json}\n`,'utf8');
  await writeFile('docs/audits/runtime-six-category-audit.md',`${payload.markdown}\n`,'utf8');

  const summary=payload.report.summary||{};
  console.log('AUDIT_SUMMARY='+JSON.stringify(summary));
  console.log(`AUDIT_STAGE_TWO_PASSED=${Boolean(payload.report.stageTwoPassed)}`);
  console.log(`AUDIT_FIGHTERS=${summary.fighterCount??'unknown'}`);
  console.log(`AUDIT_FORMULA_MISMATCHES=${summary.formulaMismatchCount??'unknown'}`);
  console.log(`AUDIT_SCORE_DERIVED_OVERRIDE_FIELDS=${summary.scoreDerivedOverrideFieldCount??'unknown'}`);
  console.log(`AUDIT_OWNERSHIP_PASS=${Boolean(summary.ownershipPass)}`);
  console.log(`AUDIT_DETERMINISTIC_INIT_PASS=${Boolean(summary.deterministicInitializationPass)}`);

  if(!payload.report.ownership?.passed)throw new Error(`Overall score ownership gate failed: ${JSON.stringify(payload.report.ownership)}`);
  if(!payload.report.initialization?.passed)throw new Error(`Deterministic initialization gate failed: ${JSON.stringify(payload.report.initialization)}`);
  if((summary.formulaMismatchCount??1)!==0)throw new Error(`Final-engine formula regression detected: ${summary.formulaMismatchCount} mismatches.`);
}finally{
  await browser.close();
}

await import('./run-prime-record-source-audit.mjs');

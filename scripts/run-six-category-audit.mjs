import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const baseUrl=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1200}});
const consoleErrors=[];
const pageErrors=[];
page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
page.on('pageerror',error=>pageErrors.push(String(error?.stack||error)));

try{
  await page.goto(`${baseUrl}/index.html?six-category-audit=1`,{waitUntil:'domcontentloaded',timeout:60_000});
  await page.waitForFunction(()=>window.UFC_SCORING_PIPELINE?.status==='ready'&&window.UFC_SCORING_OWNERSHIP_CONTRACT?.applied===true,null,{timeout:120_000,polling:100});
  await page.waitForTimeout(500);

  const report=await page.evaluate(()=>{
    const data=window.RANKING_DATA||{};
    const engine=window.UFC_SCORING_ENGINE||window.UFC_FINAL_SCORE_ENGINE||null;
    const canonical=window.UFC_CANONICAL_SCORING_RECORDS||null;
    const contract=window.UFC_SCORING_OWNERSHIP_CONTRACT||null;
    const rows=[...(data.men||[]),...(data.women||[])];
    const profiles=data.fighters||[];
    const key=name=>String(name||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
    const num=value=>Number.isFinite(Number(value))?Number(value):0;
    const scoreFields=['championship','opponentQuality','primeDominance','longevity','apexPeak','penalty','eraDepthAdjustment'];
    const parityFields=[...scoreFields,'totalScore','rank','overallOvr'];
    const byProfile=new Map(profiles.map(row=>[key(row?.fighter),row]));
    const mismatches=[];
    const profileMismatches=[];

    rows.forEach(row=>{
      const expected=canonical?.entryFor?.(row.fighter)||null;
      if(!expected){mismatches.push({fighter:row.fighter,field:'missing-canonical'});return;}
      scoreFields.forEach(field=>{
        if(Math.abs(num(row[field])-num(expected[field]))>0.001)mismatches.push({fighter:row.fighter,field,expected:expected[field],actual:row[field]});
      });
      if(Math.abs(num(row.totalScore)-num(expected.expectedTotalScore))>0.011)mismatches.push({fighter:row.fighter,field:'totalScore',expected:expected.expectedTotalScore,actual:row.totalScore});
      if(num(row.rank)!==num(expected.expectedRank))mismatches.push({fighter:row.fighter,field:'rank',expected:expected.expectedRank,actual:row.rank});
      if(num(row.overallOvr)!==num(expected.expectedOverallOvr))mismatches.push({fighter:row.fighter,field:'overallOvr',expected:expected.expectedOverallOvr,actual:row.overallOvr});
      const formulaTotal=engine?.scoreBreakdown?.(row)?.totalScore;
      if(!Number.isFinite(Number(formulaTotal))||Math.abs(num(row.totalScore)-num(formulaTotal))>0.011)mismatches.push({fighter:row.fighter,field:'formula-total',expected:formulaTotal,actual:row.totalScore});

      const profile=byProfile.get(key(row.fighter));
      if(!profile){profileMismatches.push({fighter:row.fighter,field:'missing-profile'});return;}
      parityFields.forEach(field=>{
        if(Math.abs(num(profile[field])-num(row[field]))>0.001)profileMismatches.push({fighter:row.fighter,field,board:row[field],profile:profile[field]});
      });
    });

    const overrideViolations=[];
    const overrideFields=[...scoreFields,'totalScore','rawScore','baseScore','preEraDepthTotalScore','rank','allTimeRank','overallOvr','lossContextHybrid','divisionEraDepth'];
    Object.entries(window.DISPLAY_OVERRIDES||{}).forEach(([fighter,override])=>{
      if(!override||typeof override!=='object')return;
      overrideFields.forEach(field=>{if(Object.prototype.hasOwnProperty.call(override,field))overrideViolations.push({fighter,field});});
      ['snapshotStats','packetProfileStats'].forEach(container=>{
        const value=override[container];
        if(!value||typeof value!=='object')return;
        overrideFields.forEach(field=>{if(Object.prototype.hasOwnProperty.call(value,field))overrideViolations.push({fighter,field:`${container}.${field}`});});
      });
      Object.entries(override.categories||{}).forEach(([category,value])=>{
        if(!value||typeof value!=='object')return;
        ['ovr','rank','score','value'].forEach(field=>{if(Object.prototype.hasOwnProperty.call(value,field))overrideViolations.push({fighter,field:`categories.${category}.${field}`});});
      });
    });

    const compareViolations=[];
    Object.entries(window.COMPARE_PROFILES||{}).forEach(([fighter,profile])=>{
      if(!profile||typeof profile!=='object')return;
      overrideFields.forEach(field=>{if(Object.prototype.hasOwnProperty.call(profile,field))compareViolations.push({fighter,field});});
    });

    const wrongOwners=rows.filter(row=>row.scoreInputOwner!=='scoring-engine.js'||row.overallScoreOwner!=='scoring-engine.js'||row.finalScoreEngineVersion!==engine?.version).map(row=>({fighter:row.fighter,scoreInputOwner:row.scoreInputOwner,overallScoreOwner:row.overallScoreOwner,engineVersion:row.finalScoreEngineVersion}));
    const summary={
      fighterCount:rows.length,
      menCount:(data.men||[]).length,
      womenCount:(data.women||[]).length,
      canonicalCount:canonical?.fighterCount??null,
      mismatchCount:mismatches.length,
      profileMismatchCount:profileMismatches.length,
      scoreDerivedOverrideFieldCount:overrideViolations.length,
      compareScoreViolationCount:compareViolations.length,
      wrongOwnerCount:wrongOwners.length,
      ownershipContractApplied:contract?.applied===true,
      engineVersion:engine?.version||null,
      engineApplyCount:engine?.applyCount??null,
      canonicalVersion:canonical?.version||null,
      canonicalSourceSha:canonical?.sourceFighterDataSha256||null,
      formula:engine?.formula||null
    };
    const passed=Boolean(contract?.applied)&&rows.length===72&&mismatches.length===0&&profileMismatches.length===0&&overrideViolations.length===0&&compareViolations.length===0&&wrongOwners.length===0&&Number(contract?.displayOverrideViolationCount||0)===0&&Number(contract?.compareScoreViolationCount||0)===0&&Number(contract?.wrongOwnerCount||0)===0;
    return {version:'six-category-runtime-audit-20260713c-stage2-owner',generatedAt:new Date().toISOString(),passed,stageTwoPassed:passed,summary,mismatches,profileMismatches,overrideViolations,compareViolations,wrongOwners,contract,menTop10:(data.men||[]).slice(0,10).map(row=>({rank:row.rank,fighter:row.fighter,totalScore:row.totalScore,overallOvr:row.overallOvr})),womenTop10:(data.women||[]).slice(0,10).map(row=>({rank:row.rank,fighter:row.fighter,totalScore:row.totalScore,overallOvr:row.overallOvr}))};
  });

  report.browserDiagnostics={consoleErrors,pageErrors};
  const markdown=[
    '# Six-Category Runtime Audit','',
    `- Result: **${report.passed?'PASS':'FAIL'}**`,
    `- Fighters: **${report.summary.fighterCount}**`,
    `- Canonical/category/total/rank/OVR mismatches: **${report.summary.mismatchCount}**`,
    `- Board/profile mismatches: **${report.summary.profileMismatchCount}**`,
    `- Score-derived display override fields: **${report.summary.scoreDerivedOverrideFieldCount}**`,
    `- Compare score fields: **${report.summary.compareScoreViolationCount}**`,
    `- Wrong score owners: **${report.summary.wrongOwnerCount}**`,
    `- Engine: \`${report.summary.engineVersion}\``,
    `- Canonical source SHA: \`${report.summary.canonicalSourceSha}\``,
    '',
    'The audit validates the current Stage 2 owner directly. Legacy category modules remain evidence providers and are not treated as final score owners.',''
  ].join('\n');
  await mkdir('docs/audits',{recursive:true});
  await writeFile('docs/audits/runtime-six-category-audit.json',`${JSON.stringify(report,null,2)}\n`,'utf8');
  await writeFile('docs/audits/runtime-six-category-audit.md',`${markdown}\n`,'utf8');
  console.log('AUDIT_SUMMARY='+JSON.stringify(report.summary));
  console.log(`AUDIT_STAGE_TWO_PASSED=${report.passed}`);
  if(!report.passed||pageErrors.length)throw new Error(`Stage 2 six-category audit failed: ${JSON.stringify({summary:report.summary,pageErrors})}`);
}finally{
  await browser.close();
}

await import('./run-prime-record-source-audit.mjs');

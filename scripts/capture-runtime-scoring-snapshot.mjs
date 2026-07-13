import { chromium } from 'playwright';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';

const url=process.env.UFC_APP_URL||'http://127.0.0.1:4173/index.html?runtime-scoring-snapshot=1';
const jsonPath=process.env.UFC_SNAPSHOT_JSON||'docs/runtime-scoring-snapshot.json';
const mdPath=process.env.UFC_SNAPSHOT_MD||'docs/runtime-scoring-snapshot.md';
const timeout=Number(process.env.UFC_SNAPSHOT_TIMEOUT_MS||45000);
const browserErrors=[];
let browser;

try{
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:1200}});
  page.on('console',message=>{if(message.type()==='error')browserErrors.push(message.text());});
  page.on('pageerror',error=>browserErrors.push(error?.stack||error?.message||String(error)));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60_000});
  await page.waitForFunction(()=>{
    const data=window.RANKING_DATA;
    const count=(data?.men?.length||0)+(data?.women?.length||0);
    return Boolean(count
      &&window.UFC_FINAL_SCORE_ENGINE?.version
      &&window.UFC_SCORING_OWNERSHIP_CONTRACT?.applied===true
      &&window.UFC_LOSS_CONTEXT_HYBRID_LIVE?.applied===true
      &&window.UFC_DIVISION_ERA_DEPTH_LIVE?.applied===true
      &&Number(window.UFC_SCORING_OWNERSHIP_CONTRACT?.rosterCount)===count
      &&Number(window.UFC_LOSS_CONTEXT_HYBRID_LIVE?.rosterCount)===count
      &&Number(window.UFC_DIVISION_ERA_DEPTH_LIVE?.rosterCount)===count);
  },null,{timeout,polling:100});
  await page.waitForTimeout(500);

  const snapshot=await page.evaluate(()=>{
    const data=window.RANKING_DATA;
    const key=name=>String(name||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
    const num=value=>Number.isFinite(Number(value))?Number(value):null;
    const first=(...values)=>values.find(value=>value!==undefined&&value!==null&&value!=='');
    const clone=value=>{try{return JSON.parse(JSON.stringify(value));}catch{return null;}};
    const round=value=>Number.isFinite(Number(value))?Math.round((Number(value)+Number.EPSILON)*10000)/10000:null;
    const groups=[{board:'men',rows:[...(data?.men||[])]},{board:'women',rows:[...(data?.women||[])]}];
    const profiles=[...(data?.fighters||[])];
    const profileMap=new Map(profiles.filter(row=>row?.fighter).map(row=>[key(row.fighter),row]));
    const eraFor=fighter=>window.UFC_FIGHTER_ERA_LEDGERS?.entryFor?.(fighter)||Object.entries(window.UFC_FIGHTER_ERA_LEDGERS?.ledgers||{}).find(([name])=>key(name)===key(fighter))?.[1]||null;
    const apex=row=>num(first(row?.apexPeak,row?.apexPeakBonus,row?.apexPeakAudit?.score,window.DISPLAY_OVERRIDES?.[row?.fighter]?.apexPeakAudit?.score))||0;
    const expected=row=>round((num(row?.championship)||0)/30*35+(num(row?.opponentQuality)||0)/30*27.5+(num(row?.primeDominance)||0)/30*27.5+(num(row?.longevity)||0)/30*10+apex(row)+(num(first(row?.penalty,row?.lossPenalty,row?.lossContext))||0)+(num(row?.eraDepthAdjustment)||0));

    const fighters=groups.flatMap(group=>group.rows.map(row=>{
      const profile=profileMap.get(key(row.fighter))||null;
      const era=eraFor(row.fighter);
      const total=num(row.totalScore);
      const recomputed=expected(row);
      const profileTotal=num(profile?.totalScore);
      return {
        fighter:row.fighter,
        board:group.board,
        rank:num(row.rank),
        overallOvr:num(row.overallOvr),
        division:first(row.primaryDivision,row.division,profile?.primaryDivision,profile?.division),
        scores:{championship:num(row.championship),opponentQuality:num(row.opponentQuality),primeDominance:num(row.primeDominance),longevity:num(row.longevity),apexPeak:apex(row),lossContext:num(first(row.penalty,row.lossPenalty,row.lossContext)),eraDepthAdjustment:num(row.eraDepthAdjustment),baseScore:num(row.baseScore),totalScore:total,recomputedTotal:recomputed,recomputationDelta:total===null?null:round(total-recomputed)},
        coreStats:{ufcRecord:first(row.ufcRecord,row.record,profile?.ufcRecord,profile?.record),titleFightWins:num(first(row.titleFightWins,profile?.titleFightWins)),adjustedTitleWins:num(first(row.adjustedTitleWins,row.adjustedChampionshipWins,profile?.adjustedTitleWins,profile?.adjustedChampionshipWins)),top5Wins:num(first(row.top5Wins,row.topFiveWins,profile?.top5Wins,profile?.topFiveWins)),eliteWins:num(first(row.eliteWins,profile?.eliteWins)),rankedWins:num(first(row.rankedWins,profile?.rankedWins)),finishPercentage:num(first(row.finishPercentage,row.finishPct,profile?.finishPercentage,profile?.finishPct)),roundsWonPercentage:num(first(row.roundsWonPercentage,row.roundsWonPct,profile?.roundsWonPercentage,profile?.roundsWonPct)),primeRecord:first(row.primeRecord,profile?.primeRecord,era?.primeRecord),primeFinishes:num(first(row.primeFinishes,profile?.primeFinishes)),timesFinishedPrime:num(first(row.timesFinishedPrime,profile?.timesFinishedPrime)),activeEliteYears:num(first(row.activeEliteYears,profile?.activeEliteYears,era?.longevity?.activeEliteYears)),durability:first(row.durability,row.notFinished,profile?.durability,profile?.notFinished)},
        primeWindow:clone(era?.window||{start:first(row.primeStart,profile?.primeStart),end:first(row.primeEnd,profile?.primeEnd)}),
        lossContextDetail:clone(row.lossContextHybrid||profile?.lossContextHybrid),
        divisionEraDepth:clone(row.divisionEraDepth||profile?.divisionEraDepth),
        weightedScoreBreakdown:clone(row.weightedScoreBreakdown||profile?.weightedScoreBreakdown),
        apexPeakAudit:clone(row.apexPeakAudit||profile?.apexPeakAudit||window.DISPLAY_OVERRIDES?.[row.fighter]?.apexPeakAudit),
        ownership:{finalScoreEngineVersion:first(row.finalScoreEngineVersion,profile?.finalScoreEngineVersion,window.UFC_FINAL_SCORE_ENGINE?.version),overallScoreOwner:first(row.overallScoreOwner,profile?.overallScoreOwner),scoreFormula:first(row.scoreFormula,profile?.scoreFormula)},
        parity:{profilePresent:Boolean(profile),profileRankDelta:profile&&num(profile.rank)!==null?round(num(profile.rank)-num(row.rank)):null,profileOvrDelta:profile&&num(profile.overallOvr)!==null?round(num(profile.overallOvr)-num(row.overallOvr)):null,profileTotalDelta:profileTotal===null||total===null?null:round(profileTotal-total)}
      };
    }));

    const names=fighters.map(row=>key(row.fighter));
    const duplicates=[...new Set(names.filter((name,index)=>names.indexOf(name)!==index))];
    const missingProfiles=fighters.filter(row=>!row.parity.profilePresent).map(row=>row.fighter);
    const recomputationMismatches=fighters.filter(row=>row.scores.recomputationDelta===null||Math.abs(row.scores.recomputationDelta)>.011).map(row=>({fighter:row.fighter,...row.scores}));
    const profileMismatches=fighters.filter(row=>[row.parity.profileRankDelta,row.parity.profileOvrDelta,row.parity.profileTotalDelta].some(value=>value!==null&&Math.abs(value)>.011)).map(row=>({fighter:row.fighter,...row.parity}));
    const missingLossContext=fighters.filter(row=>!row.lossContextDetail).map(row=>row.fighter);
    const missingEraDepth=fighters.filter(row=>!row.divisionEraDepth).map(row=>row.fighter);
    const invalidOvrs=fighters.filter(row=>row.overallOvr===null||row.overallOvr<82||row.overallOvr>99).map(row=>row.fighter);
    const rankSequenceIssues=groups.filter(group=>group.rows.some((row,index)=>Number(row.rank)!==index+1)).map(group=>group.board);
    const issues=[];
    if(duplicates.length)issues.push(`Duplicate fighters: ${duplicates.join(', ')}`);
    if(missingProfiles.length)issues.push(`Missing profiles: ${missingProfiles.join(', ')}`);
    if(recomputationMismatches.length)issues.push(`${recomputationMismatches.length} total-score mismatches`);
    if(profileMismatches.length)issues.push(`${profileMismatches.length} board/profile mismatches`);
    if(missingLossContext.length)issues.push(`${missingLossContext.length} fighters missing live Loss Context detail`);
    if(missingEraDepth.length)issues.push(`${missingEraDepth.length} fighters missing live Era Depth detail`);
    if(invalidOvrs.length)issues.push(`${invalidOvrs.length} invalid OVR values`);
    if(rankSequenceIssues.length)issues.push(`Rank sequence issue: ${rankSequenceIssues.join(', ')}`);

    return {
      schemaVersion:'ufc-runtime-scoring-snapshot-v1',
      captureMode:'post-pipeline-browser-runtime',
      capturedAt:new Date().toISOString(),
      source:{
        url:location.href,
        appBuild:document.querySelector('meta[name="app-build"]')?.content||null,
        moduleVersions:clone(window.UFC_MODULE_VERSIONS||{}),
        scoringPipeline:clone(window.UFC_SCORING_PIPELINE||null),
        scoringOwnershipContract:clone(window.UFC_SCORING_OWNERSHIP_CONTRACT||null),
        finalScoreEngine:{version:window.UFC_FINAL_SCORE_ENGINE?.version||null,applyCount:window.UFC_FINAL_SCORE_ENGINE?.applyCount??null},
        lossContextHybridLive:{version:window.UFC_LOSS_CONTEXT_HYBRID_LIVE?.version||null,applied:window.UFC_LOSS_CONTEXT_HYBRID_LIVE?.applied===true,rosterCount:window.UFC_LOSS_CONTEXT_HYBRID_LIVE?.rosterCount??null,mismatchCount:window.UFC_LOSS_CONTEXT_HYBRID_LIVE?.mismatchCount??null,rules:clone(window.UFC_LOSS_CONTEXT_HYBRID_LIVE?.rules||window.UFC_LOSS_CONTEXT_HYBRID_SHADOW?.rules||null)},
        divisionEraDepthLive:{version:window.UFC_DIVISION_ERA_DEPTH_LIVE?.version||null,applied:window.UFC_DIVISION_ERA_DEPTH_LIVE?.applied===true,rosterCount:window.UFC_DIVISION_ERA_DEPTH_LIVE?.rosterCount??null,mismatchCount:window.UFC_DIVISION_ERA_DEPTH_LIVE?.mismatchCount??null}
      },
      summary:{status:issues.length?'captured-with-blocking-issues':'clean',rosterCount:fighters.length,menCount:groups[0].rows.length,womenCount:groups[1].rows.length,profileCount:profiles.length,blockingIssueCount:issues.length,recomputationMismatchCount:recomputationMismatches.length,profileMismatchCount:profileMismatches.length,duplicateFighterCount:duplicates.length,missingProfileCount:missingProfiles.length,missingLossContextCount:missingLossContext.length,missingEraDepthCount:missingEraDepth.length,invalidOvrCount:invalidOvrs.length,rankSequenceIssueCount:rankSequenceIssues.length},
      invariants:{blockingIssues:issues,duplicateFighters:duplicates,missingProfiles,recomputationMismatches,profileMismatches,missingLossContext,missingEraDepth,invalidOvrs,rankSequenceIssues},
      fighters
    };
  });

  snapshot.captureDiagnostics={browserErrorCount:browserErrors.length,browserErrors:browserErrors.slice(0,50)};
  snapshot.fighterDataSha256=crypto.createHash('sha256').update(JSON.stringify(snapshot.fighters)).digest('hex');
  await fs.mkdir('docs',{recursive:true});
  await fs.writeFile(jsonPath,`${JSON.stringify(snapshot,null,2)}\n`);
  const rows=board=>snapshot.fighters.filter(row=>row.board===board).slice(0,10).map(row=>`| ${row.rank} | ${row.fighter.replaceAll('|','\|')} | ${row.overallOvr} | ${row.scores.totalScore?.toFixed(2)??'—'} | ${row.scores.lossContext?.toFixed(2)??'—'} | ${row.scores.eraDepthAdjustment?.toFixed(2)??'—'} |`);
  const markdown=['# Runtime Scoring Snapshot','', '> Generated from the fully initialized browser runtime. This is a parity baseline, not a scoring source.','',`- Captured: ${snapshot.capturedAt}`,`- Status: **${snapshot.summary.status}**`,`- Fighters: **${snapshot.summary.rosterCount}** (${snapshot.summary.menCount} men, ${snapshot.summary.womenCount} women)`,`- Fighter data SHA-256: \`${snapshot.fighterDataSha256}\``,`- Final score engine: \`${snapshot.source.finalScoreEngine.version}\``,`- Loss Context: \`${snapshot.source.lossContextHybridLive.version}\``,`- Era Depth: \`${snapshot.source.divisionEraDepthLive.version}\``,'','## Parity checks','',`- Total-score mismatches: **${snapshot.summary.recomputationMismatchCount}**`,`- Board/profile mismatches: **${snapshot.summary.profileMismatchCount}**`,`- Duplicate fighters: **${snapshot.summary.duplicateFighterCount}**`,`- Missing profiles: **${snapshot.summary.missingProfileCount}**`,`- Missing Loss Context detail: **${snapshot.summary.missingLossContextCount}**`,`- Missing Era Depth detail: **${snapshot.summary.missingEraDepthCount}**`,`- Invalid OVR values: **${snapshot.summary.invalidOvrCount}**`,'','## Men’s top 10','','| Rank | Fighter | OVR | Total | Loss Context | Era Depth |','|---:|---|---:|---:|---:|---:|',...rows('men'),'','## Women’s top 10','','| Rank | Fighter | OVR | Total | Loss Context | Era Depth |','|---:|---|---:|---:|---:|---:|',...rows('women'),'','## Blocking issues','',...(snapshot.invariants.blockingIssues.length?snapshot.invariants.blockingIssues.map(issue=>`- ${issue}`):['- None.']),''].join('\n');
  await fs.writeFile(mdPath,markdown);
  console.log(`Captured ${snapshot.summary.rosterCount} fighters; status=${snapshot.summary.status}; sha256=${snapshot.fighterDataSha256}`);
  if(snapshot.summary.blockingIssueCount)process.exitCode=1;
}catch(error){
  console.error(error?.stack||error);
  process.exitCode=1;
}finally{
  if(browser)await browser.close();
}

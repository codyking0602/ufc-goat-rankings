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
  page.on('console',m=>{if(m.type()==='error')browserErrors.push(m.text());});
  page.on('pageerror',e=>browserErrors.push(e?.stack||e?.message||String(e)));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>{
    const data=window.RANKING_DATA;
    const count=(data?.men?.length||0)+(data?.women?.length||0);
    return Boolean(count&&window.UFC_FINAL_SCORE_ENGINE?.version&&
      window.UFC_DYNAMIC_ROSTER_SCORING_REPAIR?.applied===true&&
      window.UFC_LOSS_CONTEXT_HYBRID_LIVE?.applied===true&&
      window.UFC_DIVISION_ERA_DEPTH_LIVE?.applied===true&&
      Number(window.UFC_DYNAMIC_ROSTER_SCORING_REPAIR?.rosterCount)===count&&
      Number(window.UFC_LOSS_CONTEXT_HYBRID_LIVE?.rosterCount)===count&&
      Number(window.UFC_DIVISION_ERA_DEPTH_LIVE?.rosterCount)===count);
  },null,{timeout,polling:100});
  await page.waitForTimeout(1500);

  const snapshot=await page.evaluate(()=>{
    const data=window.RANKING_DATA;
    const key=n=>String(n||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
    const num=v=>Number.isFinite(Number(v))?Number(v):null;
    const first=(...v)=>v.find(x=>x!==undefined&&x!==null&&x!=='');
    const clone=v=>{try{return JSON.parse(JSON.stringify(v));}catch{return null;}};
    const round=v=>Number.isFinite(Number(v))?Math.round((Number(v)+Number.EPSILON)*10000)/10000:null;
    const groups=[{board:'men',rows:[...(data?.men||[])]},{board:'women',rows:[...(data?.women||[])]}];
    const profiles=[...(data?.fighters||[])];
    const profileMap=new Map(profiles.filter(x=>x?.fighter).map(x=>[key(x.fighter),x]));
    const eraFor=f=>window.UFC_FIGHTER_ERA_LEDGERS?.entryFor?.(f)||Object.entries(window.UFC_FIGHTER_ERA_LEDGERS?.ledgers||{}).find(([n])=>key(n)===key(f))?.[1]||null;
    const apex=r=>num(first(r?.apexPeak,r?.apexPeakBonus,r?.apexPeakAudit?.score,window.DISPLAY_OVERRIDES?.[r?.fighter]?.apexPeakAudit?.score))||0;
    const expected=r=>round((num(r?.championship)||0)/30*35+(num(r?.opponentQuality)||0)/30*27.5+(num(r?.primeDominance)||0)/30*27.5+(num(r?.longevity)||0)/30*10+apex(r)+(num(first(r?.penalty,r?.lossPenalty,r?.lossContext))||0)+(num(r?.eraDepthAdjustment)||0));

    const fighters=groups.flatMap(g=>g.rows.map(r=>{
      const p=profileMap.get(key(r.fighter))||null;
      const era=eraFor(r.fighter);
      const total=num(r.totalScore),recomputed=expected(r),profileTotal=num(p?.totalScore);
      return {
        fighter:r.fighter,board:g.board,rank:num(r.rank),overallOvr:num(r.overallOvr),division:first(r.primaryDivision,r.division,p?.primaryDivision,p?.division),
        scores:{championship:num(r.championship),opponentQuality:num(r.opponentQuality),primeDominance:num(r.primeDominance),longevity:num(r.longevity),apexPeak:apex(r),lossContext:num(first(r.penalty,r.lossPenalty,r.lossContext)),eraDepthAdjustment:num(r.eraDepthAdjustment),baseScore:num(r.baseScore),totalScore:total,recomputedTotal:recomputed,recomputationDelta:total===null?null:round(total-recomputed)},
        coreStats:{ufcRecord:first(r.ufcRecord,r.record,p?.ufcRecord,p?.record),titleFightWins:num(first(r.titleFightWins,p?.titleFightWins)),adjustedTitleWins:num(first(r.adjustedTitleWins,r.adjustedChampionshipWins,p?.adjustedTitleWins,p?.adjustedChampionshipWins)),top5Wins:num(first(r.top5Wins,r.topFiveWins,p?.top5Wins,p?.topFiveWins)),eliteWins:num(first(r.eliteWins,p?.eliteWins)),rankedWins:num(first(r.rankedWins,p?.rankedWins)),finishPercentage:num(first(r.finishPercentage,r.finishPct,p?.finishPercentage,p?.finishPct)),roundsWonPercentage:num(first(r.roundsWonPercentage,r.roundsWonPct,p?.roundsWonPercentage,p?.roundsWonPct)),primeRecord:first(r.primeRecord,p?.primeRecord,era?.primeRecord),primeFinishes:num(first(r.primeFinishes,p?.primeFinishes)),timesFinishedPrime:num(first(r.timesFinishedPrime,p?.timesFinishedPrime)),activeEliteYears:num(first(r.activeEliteYears,p?.activeEliteYears,era?.longevity?.activeEliteYears)),durability:first(r.durability,r.notFinished,p?.durability,p?.notFinished)},
        primeWindow:clone(era?.window||{start:first(r.primeStart,p?.primeStart),end:first(r.primeEnd,p?.primeEnd)}),
        lossContextDetail:clone(r.lossContextHybrid||p?.lossContextHybrid),divisionEraDepth:clone(r.divisionEraDepth||p?.divisionEraDepth),weightedScoreBreakdown:clone(r.weightedScoreBreakdown||p?.weightedScoreBreakdown),apexPeakAudit:clone(r.apexPeakAudit||p?.apexPeakAudit||window.DISPLAY_OVERRIDES?.[r.fighter]?.apexPeakAudit),
        ownership:{finalScoreEngineVersion:first(r.finalScoreEngineVersion,p?.finalScoreEngineVersion,window.UFC_FINAL_SCORE_ENGINE?.version),overallScoreOwner:first(r.overallScoreOwner,p?.overallScoreOwner),scoreFormula:first(r.scoreFormula,p?.scoreFormula)},
        parity:{profilePresent:Boolean(p),profileRankDelta:p&&num(p.rank)!==null?round(num(p.rank)-num(r.rank)):null,profileOvrDelta:p&&num(p.overallOvr)!==null?round(num(p.overallOvr)-num(r.overallOvr)):null,profileTotalDelta:profileTotal===null||total===null?null:round(profileTotal-total)}
      };
    }));

    const names=fighters.map(x=>key(x.fighter));
    const duplicates=[...new Set(names.filter((n,i)=>names.indexOf(n)!==i))];
    const missingProfiles=fighters.filter(x=>!x.parity.profilePresent).map(x=>x.fighter);
    const recomputationMismatches=fighters.filter(x=>x.scores.recomputationDelta===null||Math.abs(x.scores.recomputationDelta)>.011).map(x=>({fighter:x.fighter,...x.scores}));
    const profileMismatches=fighters.filter(x=>[x.parity.profileRankDelta,x.parity.profileOvrDelta,x.parity.profileTotalDelta].some(v=>v!==null&&Math.abs(v)>.011)).map(x=>({fighter:x.fighter,...x.parity}));
    const missingLossContext=fighters.filter(x=>!x.lossContextDetail).map(x=>x.fighter);
    const missingEraDepth=fighters.filter(x=>!x.divisionEraDepth).map(x=>x.fighter);
    const invalidOvrs=fighters.filter(x=>x.overallOvr===null||x.overallOvr<82||x.overallOvr>99).map(x=>x.fighter);
    const rankSequenceIssues=groups.filter(g=>g.rows.some((r,i)=>Number(r.rank)!==i+1)).map(g=>g.board);
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
      schemaVersion:'ufc-runtime-scoring-snapshot-v1',captureMode:'post-pipeline-browser-runtime',capturedAt:new Date().toISOString(),
      source:{url:location.href,appBuild:document.querySelector('meta[name="app-build"]')?.content||null,moduleVersions:clone(window.UFC_MODULE_VERSIONS||{}),finalScoreEngine:{version:window.UFC_FINAL_SCORE_ENGINE?.version||null},dynamicRosterRepair:{version:window.UFC_DYNAMIC_ROSTER_SCORING_REPAIR?.version||null,applied:window.UFC_DYNAMIC_ROSTER_SCORING_REPAIR?.applied===true,applyCount:window.UFC_DYNAMIC_ROSTER_SCORING_REPAIR?.applyCount??null,rosterCount:window.UFC_DYNAMIC_ROSTER_SCORING_REPAIR?.rosterCount??null,scoreMismatches:clone(window.UFC_DYNAMIC_ROSTER_SCORING_REPAIR?.scoreMismatches||[])},lossContextHybridLive:{version:window.UFC_LOSS_CONTEXT_HYBRID_LIVE?.version||null,applied:window.UFC_LOSS_CONTEXT_HYBRID_LIVE?.applied===true,rosterCount:window.UFC_LOSS_CONTEXT_HYBRID_LIVE?.rosterCount??null,mismatchCount:window.UFC_LOSS_CONTEXT_HYBRID_LIVE?.mismatchCount??null,rules:clone(window.UFC_LOSS_CONTEXT_HYBRID_LIVE?.rules||window.UFC_LOSS_CONTEXT_HYBRID_SHADOW?.rules||null)},divisionEraDepthLive:{version:window.UFC_DIVISION_ERA_DEPTH_LIVE?.version||null,applied:window.UFC_DIVISION_ERA_DEPTH_LIVE?.applied===true,rosterCount:window.UFC_DIVISION_ERA_DEPTH_LIVE?.rosterCount??null,mismatchCount:window.UFC_DIVISION_ERA_DEPTH_LIVE?.mismatchCount??null}},
      summary:{status:issues.length?'captured-with-blocking-issues':'clean',rosterCount:fighters.length,menCount:groups[0].rows.length,womenCount:groups[1].rows.length,profileCount:profiles.length,blockingIssueCount:issues.length,recomputationMismatchCount:recomputationMismatches.length,profileMismatchCount:profileMismatches.length,duplicateFighterCount:duplicates.length,missingProfileCount:missingProfiles.length,missingLossContextCount:missingLossContext.length,missingEraDepthCount:missingEraDepth.length,invalidOvrCount:invalidOvrs.length,rankSequenceIssueCount:rankSequenceIssues.length},
      invariants:{blockingIssues:issues,duplicateFighters:duplicates,missingProfiles,recomputationMismatches,profileMismatches,missingLossContext,missingEraDepth,invalidOvrs,rankSequenceIssues},fighters
    };
  });

  snapshot.captureDiagnostics={browserErrorCount:browserErrors.length,browserErrors:browserErrors.slice(0,50)};
  snapshot.fighterDataSha256=crypto.createHash('sha256').update(JSON.stringify(snapshot.fighters)).digest('hex');
  await fs.mkdir('docs',{recursive:true});
  await fs.writeFile(jsonPath,JSON.stringify(snapshot,null,2)+'\n');
  const rows=(board)=>snapshot.fighters.filter(x=>x.board===board).slice(0,10).map(x=>`| ${x.rank} | ${x.fighter.replaceAll('|','\\|')} | ${x.overallOvr} | ${x.scores.totalScore?.toFixed(2)??'—'} | ${x.scores.lossContext?.toFixed(2)??'—'} | ${x.scores.eraDepthAdjustment?.toFixed(2)??'—'} |`);
  const md=['# Runtime Scoring Snapshot','', '> Generated from the fully initialized browser runtime. This is a parity baseline, not a scoring source.','',`- Captured: ${snapshot.capturedAt}`,`- Status: **${snapshot.summary.status}**`,`- Fighters: **${snapshot.summary.rosterCount}** (${snapshot.summary.menCount} men, ${snapshot.summary.womenCount} women)`,`- Fighter data SHA-256: \`${snapshot.fighterDataSha256}\``,`- Final score engine: \`${snapshot.source.finalScoreEngine.version}\``,`- Loss Context: \`${snapshot.source.lossContextHybridLive.version}\``,`- Era Depth: \`${snapshot.source.divisionEraDepthLive.version}\``,'','## Parity checks','',`- Total-score mismatches: **${snapshot.summary.recomputationMismatchCount}**`,`- Board/profile mismatches: **${snapshot.summary.profileMismatchCount}**`,`- Duplicate fighters: **${snapshot.summary.duplicateFighterCount}**`,`- Missing profiles: **${snapshot.summary.missingProfileCount}**`,`- Missing Loss Context detail: **${snapshot.summary.missingLossContextCount}**`,`- Missing Era Depth detail: **${snapshot.summary.missingEraDepthCount}**`,`- Invalid OVR values: **${snapshot.summary.invalidOvrCount}**`,'','## Men’s top 10','','| Rank | Fighter | OVR | Total | Loss Context | Era Depth |','|---:|---|---:|---:|---:|---:|',...rows('men'),'','## Women’s top 10','','| Rank | Fighter | OVR | Total | Loss Context | Era Depth |','|---:|---|---:|---:|---:|---:|',...rows('women'),'','## Blocking issues','',...(snapshot.invariants.blockingIssues.length?snapshot.invariants.blockingIssues.map(x=>`- ${x}`):['- None.']),''].join('\n');
  await fs.writeFile(mdPath,md);
  console.log(`Captured ${snapshot.summary.rosterCount} fighters; status=${snapshot.summary.status}; sha256=${snapshot.fighterDataSha256}`);
  if(snapshot.summary.blockingIssueCount)process.exitCode=1;
}catch(error){console.error(error?.stack||error);process.exitCode=1;}finally{if(browser)await browser.close();}

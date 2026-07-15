import { chromium } from 'playwright';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';

const url=process.env.UFC_APP_URL||'http://127.0.0.1:4173/index.html?production-ranking-snapshot=1';
const jsonPath=process.env.UFC_SNAPSHOT_JSON||'docs/production-ranking-snapshot.json';
const mdPath=process.env.UFC_SNAPSHOT_MD||'docs/production-ranking-snapshot.md';
const timeout=Number(process.env.UFC_SNAPSHOT_TIMEOUT_MS||90000);
const browserErrors=[];
let browser;

try{
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:1200}});
  page.on('console',message=>{if(message.type()==='error')browserErrors.push(message.text());});
  page.on('pageerror',error=>browserErrors.push(error?.stack||error?.message||String(error)));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60_000});
  await page.waitForFunction(()=>document.documentElement.getAttribute('data-scoring-pipeline')==='ready'||window.UFC_PRODUCTION_RANKING_BOOTSTRAP?.status==='error',null,{timeout,polling:100});
  await page.waitForTimeout(1500);

  const snapshot=await page.evaluate(()=>{
    const data=window.RANKING_DATA||{};
    const num=value=>Number.isFinite(Number(value))?Number(value):0;
    const round2=value=>Math.round((num(value)+Number.EPSILON)*100)/100;
    const clone=value=>{try{return JSON.parse(JSON.stringify(value));}catch{return null;}};
    const groups=[{board:'men',rows:[...(data.men||[])]},{board:'women',rows:[...(data.women||[])]}];
    const profileMap=new Map((data.fighters||[]).map(row=>[row.fighter,row]));
    const fighters=groups.flatMap(group=>group.rows.map(row=>{
      const profile=profileMap.get(row.fighter)||null;
      const visible=row.visibleStats||{};
      const recomputed=round2(
        num(row.championship)/30*35+
        num(row.opponentQuality)/30*25+
        num(row.primeDominance)/30*30+
        num(row.longevity)/30*10+
        num(row.apexPeak)+num(row.penalty)+num(row.eraDepthAdjustment)
      );
      return{
        fighter:row.fighter,
        board:group.board,
        rank:num(row.rank),
        overallOvr:num(row.overallOvr),
        totalScore:round2(row.totalScore),
        recomputedTotal:recomputed,
        recomputationDelta:round2(num(row.totalScore)-recomputed),
        scores:{
          championship:round2(row.championship),opponentQuality:round2(row.opponentQuality),primeDominance:round2(row.primeDominance),
          longevity:round2(row.longevity),apexPeak:round2(row.apexPeak),penalty:round2(row.penalty),eraDepthAdjustment:round2(row.eraDepthAdjustment)
        },
        visibleStats:clone(visible),
        ownership:{scoreInputOwner:row.scoreInputOwner||null,overallScoreOwner:row.overallScoreOwner||null,finalScoreEngineVersion:row.finalScoreEngineVersion||null},
        profileParity:profile?{
          rankDelta:round2(num(profile.rank)-num(row.rank)),ovrDelta:round2(num(profile.overallOvr)-num(row.overallOvr)),totalDelta:round2(num(profile.totalScore)-num(row.totalScore))
        }:null
      };
    }));
    const names=fighters.map(row=>row.fighter.toLowerCase());
    const duplicates=[...new Set(names.filter((name,index)=>names.indexOf(name)!==index))];
    const formulaMismatches=fighters.filter(row=>Math.abs(row.recomputationDelta)>.011);
    const profileMismatches=fighters.filter(row=>!row.profileParity||Object.values(row.profileParity).some(value=>Math.abs(value)>.011));
    const rankSequenceIssues=groups.filter(group=>group.rows.some((row,index)=>Number(row.rank)!==index+1)).map(group=>group.board);
    const invalidOvrs=fighters.filter(row=>row.overallOvr<82||row.overallOvr>99).map(row=>row.fighter);
    const missingVisibleStats=fighters.filter(row=>!row.visibleStats||!row.visibleStats.ufcRecord||!row.visibleStats.primeRecord).map(row=>row.fighter);
    const legacyGlobals=['UFC_CANONICAL_SCORING_RECORDS','UFC_SCORING_ENGINE','UFC_FINAL_SCORE_ENGINE','UFC_SCORING_OWNERSHIP_FINALIZER','UFC_CANONICAL_PRIME_DOMINANCE_RECONSTRUCTION','UFC_CANONICAL_LONGEVITY_RECONSTRUCTION'].filter(name=>typeof window[name]!=='undefined');
    const issues=[];
    if(fighters.length!==73)issues.push(`Expected 73 fighters, found ${fighters.length}`);
    if(duplicates.length)issues.push(`Duplicate fighters: ${duplicates.join(', ')}`);
    if(formulaMismatches.length)issues.push(`${formulaMismatches.length} formula mismatches`);
    if(profileMismatches.length)issues.push(`${profileMismatches.length} profile parity mismatches`);
    if(rankSequenceIssues.length)issues.push(`Rank sequence issue: ${rankSequenceIssues.join(', ')}`);
    if(invalidOvrs.length)issues.push(`${invalidOvrs.length} invalid OVR values`);
    if(missingVisibleStats.length)issues.push(`${missingVisibleStats.length} fighters missing visible stats`);
    if(legacyGlobals.length)issues.push(`Legacy runtime globals: ${legacyGlobals.join(', ')}`);
    return{
      schemaVersion:'ufc-production-ranking-snapshot-v1',captureMode:'permanent-calculated-browser-runtime',capturedAt:new Date().toISOString(),
      source:{url:location.href,appBuild:document.querySelector('meta[name="app-build"]')?.content||null,bootstrap:clone(window.UFC_PRODUCTION_RANKING_BOOTSTRAP||null),pipeline:clone(window.UFC_RANKING_PIPELINE?.latest||null),categoryAudit:clone(window.UFC_CATEGORY_CALCULATOR_AUDIT||null)},
      formula:{weights:{championship:35,opponentQuality:25,primeDominance:30,longevity:10},modifiers:['apexPeak','penalty','eraDepthAdjustment']},
      summary:{status:issues.length?'captured-with-blocking-issues':'clean',rosterCount:fighters.length,menCount:groups[0].rows.length,womenCount:groups[1].rows.length,profileCount:(data.fighters||[]).length,blockingIssueCount:issues.length},
      invariants:{blockingIssues:issues,duplicates,formulaMismatches,profileMismatches,rankSequenceIssues,invalidOvrs,missingVisibleStats,legacyGlobals},
      topTen:{men:fighters.filter(row=>row.board==='men').slice(0,10).map(row=>row.fighter),women:fighters.filter(row=>row.board==='women').slice(0,10).map(row=>row.fighter)},
      fighters
    };
  });

  snapshot.captureDiagnostics={browserErrorCount:browserErrors.length,browserErrors:browserErrors.slice(0,50)};
  snapshot.fighterDataSha256=crypto.createHash('sha256').update(JSON.stringify(snapshot.fighters)).digest('hex');
  await fs.mkdir('docs',{recursive:true});
  await fs.writeFile(jsonPath,`${JSON.stringify(snapshot,null,2)}\n`);
  const rows=board=>snapshot.fighters.filter(row=>row.board===board).slice(0,10).map(row=>`| ${row.rank} | ${row.fighter.replaceAll('|','\\|')} | ${row.overallOvr} | ${row.totalScore.toFixed(2)} | ${row.scores.apexPeak.toFixed(2)} | ${row.scores.penalty.toFixed(2)} | ${row.scores.eraDepthAdjustment.toFixed(2)} |`);
  const markdown=['# Production Ranking Snapshot','', '> Generated from the permanent calculated browser runtime. This is a diagnostic artifact, never a scoring source.','',`- Captured: ${snapshot.capturedAt}`,`- Status: **${snapshot.summary.status}**`,`- Fighters: **${snapshot.summary.rosterCount}** (${snapshot.summary.menCount} men, ${snapshot.summary.womenCount} women)`,`- Fighter data SHA-256: \`${snapshot.fighterDataSha256}\``,`- Formula: **35 / 25 / 30 / 10**, then Apex, Loss Context, and Era Depth`,'','## Men’s top 10','','| Rank | Fighter | OVR | Total | Apex | Penalty | Era Depth |','|---:|---|---:|---:|---:|---:|---:|',...rows('men'),'','## Women’s top 10','','| Rank | Fighter | OVR | Total | Apex | Penalty | Era Depth |','|---:|---|---:|---:|---:|---:|---:|',...rows('women'),'','## Blocking issues','',...(snapshot.invariants.blockingIssues.length?snapshot.invariants.blockingIssues.map(issue=>`- ${issue}`):['- None.']),''].join('\n');
  await fs.writeFile(mdPath,markdown);
  console.log(`Captured permanent production ranking: fighters=${snapshot.summary.rosterCount}; status=${snapshot.summary.status}; sha256=${snapshot.fighterDataSha256}`);
  if(snapshot.summary.blockingIssueCount||browserErrors.length)process.exitCode=1;
}catch(error){
  console.error(error?.stack||error);
  process.exitCode=1;
}finally{
  if(browser)await browser.close();
}

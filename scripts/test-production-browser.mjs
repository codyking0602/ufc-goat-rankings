import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const EXPECTED_FIGHTERS=80;
const PETTIS='Anthony Pettis';
const WATCH='https://youtube.com/shorts/BiPvl_p6JqY?is=gwu2EsszP22T9us-';
const FIGHT='https://youtu.be/smbYO1-yqtA?is=lhtpeK1nOCqGUvdc';
const TOP_TEN=['Jon Jones','Georges St-Pierre','Anderson Silva','Demetrious Johnson','Islam Makhachev','Alexander Volkanovski','Khabib Nurmagomedov','Matt Hughes','Kamaru Usman','Max Holloway'];

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}});
const pageErrors=[];
const consoleErrors=[];
page.on('pageerror',error=>pageErrors.push({message:String(error?.message||error),stack:String(error?.stack||'')}));
page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});

try{
  await page.goto('http://127.0.0.1:4173/index.html',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>document.documentElement.getAttribute('data-scoring-pipeline')==='ready',null,{timeout:120000});
  await page.waitForSelector('#menList .fighter-row',{timeout:30000});
  await page.evaluate(()=>document.getElementById('whatsNewOverlay')?.remove());
  await page.waitForTimeout(6500);

  const runtime=await page.evaluate(fighter=>{
    const men=window.RANKING_DATA?.men||[];
    const women=window.RANKING_DATA?.women||[];
    const lightweight=window.UFC_DIVISION_RANKING_PIPELINE?.boardFor?.('Lightweight')||[];
    const featherweight=window.UFC_DIVISION_RANKING_PIPELINE?.boardFor?.('Featherweight')||[];
    const welterweight=window.UFC_DIVISION_RANKING_PIPELINE?.boardFor?.('Welterweight')||[];
    const row=window.UFC_CALCULATED_RANKING_PROJECTION?.entryFor?.(fighter)||men.find(item=>item.fighter===fighter)||null;
    return{
      fighterCount:men.length+women.length,
      topTen:men.slice(0,10).map(item=>item.fighter),
      projectionTopTen:window.UFC_CALCULATED_RANKING_PROJECTION?.men?.slice(0,10).map(item=>item.fighter)||[],
      pipelineTopTen:window.UFC_RANKING_PIPELINE?.latest?.menTopTen?.map(item=>item.fighter)||[],
      bootstrap:window.UFC_PRODUCTION_RANKING_BOOTSTRAP||null,
      categoryAudit:window.UFC_CATEGORY_CALCULATOR_AUDIT||null,
      factsAudit:window.UFC_CANONICAL_FIGHTER_FACTS?.audit?.()||null,
      divisionReport:window.UFC_DIVISION_RANKING_PIPELINE?.latest||null,
      pettis:row,
      pettisCategory:window.UFC_CATEGORY_CALCULATORS?.entryFor?.(fighter)||null,
      pettisOverride:window.DISPLAY_OVERRIDES?.[fighter]||null,
      pettisCompare:window.COMPARE_PROFILES?.[fighter]||null,
      pettisEra:window.UFC_ERA_FILTER_DATA?.curatedMembership?.[fighter]||null,
      pettisLedgers:Object.entries(window.COMPARE_FIGHT_LEDGER||{}).filter(([,item])=>Array.isArray(item?.fighters)&&item.fighters.includes(fighter)).map(([key,item])=>({key,...item})),
      lightweight,
      featherweight,
      welterweight,
      jon:men.find(item=>item.fighter==='Jon Jones'),
      gsp:men.find(item=>item.fighter==='Georges St-Pierre'),
      amanda:women.find(item=>item.fighter==='Amanda Nunes'),
      valentina:women.find(item=>item.fighter==='Valentina Shevchenko'),
      scoringRecordsLoaded:Boolean(window.UFC_CANONICAL_SCORING_RECORDS),
      legacyEngineLoaded:Boolean(window.UFC_SCORING_ENGINE),
      legacyFinalizerLoaded:Boolean(window.UFC_SCORING_OWNERSHIP_FINALIZER),
      profileRuntime:window.UFC_CALCULATED_PROFILE_RUNTIME||null
    };
  },PETTIS);

  assert.equal(runtime.fighterCount,EXPECTED_FIGHTERS);
  assert.equal(runtime.bootstrap?.status,'ready');
  assert.equal(runtime.bootstrap?.report?.fighterCount,EXPECTED_FIGHTERS);
  assert.equal(runtime.bootstrap?.rosterBatchFourteen?.passed,true);
  assert.equal(runtime.categoryAudit?.passed,true);
  assert.equal(runtime.categoryAudit?.completeFighterCount,EXPECTED_FIGHTERS);
  assert.equal(runtime.factsAudit?.passed,true);
  assert.equal(runtime.factsAudit?.total,EXPECTED_FIGHTERS);
  assert.deepEqual(runtime.topTen,TOP_TEN);
  assert.deepEqual(runtime.projectionTopTen,TOP_TEN);
  assert.deepEqual(runtime.pipelineTopTen,TOP_TEN);
  assert.equal(runtime.jon.rank,1);assert.equal(runtime.jon.overallOvr,99);
  assert.equal(runtime.gsp.rank,2);assert.equal(runtime.gsp.overallOvr,96);
  assert.equal(runtime.amanda.rank,1);assert.equal(runtime.amanda.overallOvr,99);
  assert.equal(runtime.valentina.overallOvr,98);
  assert.equal(runtime.scoringRecordsLoaded,false);
  assert.equal(runtime.legacyEngineLoaded,false);
  assert.equal(runtime.legacyFinalizerLoaded,false);
  assert.equal(runtime.profileRuntime?.snapshotOwner,'RANKING_DATA.visibleStats');
  assert.equal(runtime.profileRuntime?.rankOwner,'RANKING_DATA.rank');
  assert.equal(runtime.profileRuntime?.ovrOwner,'RANKING_DATA.overallOvr');

  const row=runtime.pettis;
  assert.ok(row,'Anthony Pettis calculated row exists');
  assert.equal(row.rank,57);
  assert.equal(row.totalScore,37.5);
  assert.equal(row.overallOvr,87);
  assert.equal(row.ufcRecord,'11-9');
  assert.equal(row.titleFightWins,2);
  assert.equal(row.adjustedTitleWins,2);
  assert.equal(row.topFiveWins,3);
  assert.equal(row.rankedWins,8);
  assert.equal(row.finishRatePct,63.64);
  assert.equal(row.primeRecord,'7-6');
  assert.equal(row.roundsWonPct,34.38);
  assert.equal(row.activeEliteYears,6.61);
  assert.equal(row.timesFinishedPrime,3);
  assert.equal(row.primaryDivision,'Lightweight');
  assert.match(String(row.secondaryDivision),/Featherweight/);
  assert.match(String(row.secondaryDivision),/Welterweight/);
  assert.equal(runtime.pettisCategory?.status,'complete');
  assert.equal(runtime.pettisCategory?.championship,4.13);
  assert.equal(runtime.pettisCategory?.opponentQuality,15.76);
  assert.equal(runtime.pettisCategory?.primeDominance,14.31);
  assert.equal(runtime.pettisCategory?.longevity,16.52);
  assert.equal(runtime.pettisCategory?.apex,5.28);
  assert.equal(runtime.pettisCategory?.penalty,-6);
  assert.equal(runtime.pettisCategory?.eraDepth,.45);
  assert.deepEqual(runtime.pettisEra,{primary:'golden-age',secondary:'superstar'});
  assert.equal(runtime.pettisLedgers.length,3);
  assert.ok(runtime.pettisCompare?.shortCase&&runtime.pettisCompare?.counter&&runtime.pettisCompare?.edge);
  assert.equal(runtime.pettisOverride?.profileDisplayName,'Anthony “Showtime” Pettis');
  assert.equal(runtime.pettisOverride?.photoUrl,'assets/fighters/anthony-pettis.webp');
  assert.equal(runtime.pettisOverride?.thumbUrl,'assets/fighters/anthony-pettis-thumb.webp');
  assert.equal(runtime.pettisOverride?.signatureFight,'Benson Henderson II — UFC 164');
  assert.equal(runtime.pettisOverride?.alternateFight,'Gilbert Melendez — UFC 181');
  assert.equal(runtime.pettisOverride?.watchUrl,WATCH);
  assert.equal(runtime.pettisOverride?.signatureFightUrl,FIGHT);

  assert.equal(runtime.divisionReport?.passed,true);
  assert.equal(runtime.divisionReport?.manualGuardrails,false);
  assert.equal(runtime.divisionReport?.conservation?.length,0);
  assert.equal(runtime.divisionReport?.allocationWarnings?.length,0);
  assert.equal(Object.keys(runtime.divisionReport?.boards||{}).length,9);
  assert.ok(runtime.lightweight.some(item=>item.fighter===PETTIS),'Pettis appears on Lightweight board');
  assert.ok(runtime.featherweight.some(item=>item.fighter===PETTIS),'Pettis appears on Featherweight board');
  assert.ok(runtime.welterweight.some(item=>item.fighter===PETTIS),'Pettis appears on Welterweight board');
  for(const board of Object.values(runtime.divisionReport?.boards||{}))for(const item of board)assert.ok(item.stats?.ufcWins>0,`${item.fighter} owns a UFC win in ${item.division}`);

  const pettisRow=page.locator('#menList .fighter-row[data-fighter="Anthony Pettis"]');
  await pettisRow.scrollIntoViewIfNeeded();
  assert.match(await pettisRow.textContent(),/Anthony.*Pettis/);
  const cardWatch=await pettisRow.locator('.watch-moment-link').getAttribute('href');
  assert.equal(cardWatch,WATCH);

  await page.evaluate(name=>window.openFighter?.(name),PETTIS);
  await page.waitForSelector('#drawer.open',{timeout:15000});
  const profile=await page.evaluate(()=>({
    heading:document.querySelector('#fighterDetail h2')?.textContent?.trim()||'',
    text:document.querySelector('#fighterDetail')?.textContent||'',
    links:[...document.querySelectorAll('#fighterDetail a')].map(link=>({text:link.textContent?.trim()||'',href:link.href}))
  }));
  assert.match(profile.heading,/Anthony.*Showtime.*Pettis/);
  assert.ok(profile.text.includes('Why Not Ranked Higher?'));
  assert.ok(profile.text.includes('Benson Henderson II'));
  assert.ok(profile.text.includes('Gilbert Melendez'));
  assert.ok(profile.links.some(link=>link.href===FIGHT&&/signature fight/i.test(link.text)));
  await page.locator('#closeDrawer').click();

  await page.locator('.tab[data-view="compare"]').click();
  const compareOptions=await page.locator('#fighterA option').allTextContents();
  assert.ok(compareOptions.some(text=>text.includes(PETTIS)),'Pettis appears in Compare selector');

  await page.locator('.tab[data-view="play"]').click();
  await page.locator('#playHub [data-open-game="top10"]').click();
  const search=page.locator('#playFighterSearch');
  await search.waitFor({state:'visible',timeout:10000});
  await search.fill(PETTIS);
  await page.locator(`[data-add-fighter="${PETTIS}"]`).waitFor({state:'visible',timeout:10000});

  const certification={
    fighterCount:runtime.fighterCount,
    row,
    categories:runtime.pettisCategory,
    era:runtime.pettisEra,
    directFightLedgers:runtime.pettisLedgers,
    divisionBoards:{
      Lightweight:runtime.lightweight.findIndex(item=>item.fighter===PETTIS)+1,
      Featherweight:runtime.featherweight.findIndex(item=>item.fighter===PETTIS)+1,
      Welterweight:runtime.welterweight.findIndex(item=>item.fighter===PETTIS)+1
    },
    cardWatch,
    profile,
    audits:{facts:runtime.factsAudit,category:runtime.categoryAudit,division:runtime.divisionReport},
    crossTabs:{leaderboard:true,profile:true,compare:true,playSearch:true,era:true},
    pageErrors,
    consoleErrors
  };
  fs.writeFileSync('/tmp/anthony-pettis-pipeline-result.json',JSON.stringify(certification,null,2));
  console.log('ANTHONY_PETTIS_PIPELINE_RESULT');
  console.log(JSON.stringify(certification,null,2));
  console.log('PRODUCTION_BROWSER_CERTIFICATION');
  console.log(JSON.stringify({fighterCount:runtime.fighterCount,topTen:runtime.topTen,divisionBoards:Object.keys(runtime.divisionReport?.boards||{}),compareSelector:true,playSearch:true,pageErrors},null,2));

  assert.deepEqual(pageErrors,[],'rendered app has no uncaught page errors');
  assert.deepEqual(consoleErrors.filter(message=>!/supabase|realtime|octagon message/i.test(message)),[],'rendered ranking has no unexpected console errors');
}finally{
  await browser.close();
}

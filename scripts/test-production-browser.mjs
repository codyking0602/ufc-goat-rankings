import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const EXPECTED_FIGHTERS=79;
const MORENO='Brandon Moreno';
const WATCH='https://youtube.com/shorts/eKlp7eFDSTM?is=_dMar84p0EkqYXz_';
const FIGHT='https://youtu.be/GPrzwbgg8yU?is=M-G22YQ8u-8QVKtz';
const TOP_TEN=['Jon Jones','Georges St-Pierre','Anderson Silva','Demetrious Johnson','Islam Makhachev','Alexander Volkanovski','Khabib Nurmagomedov','Matt Hughes','Kamaru Usman','Max Holloway'];

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}});
const pageErrors=[];
page.on('pageerror',error=>pageErrors.push(error.message));

try{
  await page.goto('http://127.0.0.1:4173/index.html',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>document.documentElement.getAttribute('data-scoring-pipeline')==='ready',null,{timeout:120000});
  await page.waitForSelector('#menList .fighter-row',{timeout:30000});
  await page.evaluate(()=>document.getElementById('whatsNewOverlay')?.remove());
  await page.waitForTimeout(6500);

  const runtime=await page.evaluate(fighter=>{
    const men=window.RANKING_DATA?.men||[];
    const women=window.RANKING_DATA?.women||[];
    const flyweight=window.UFC_DIVISION_RANKING_PIPELINE?.boardFor?.('Flyweight')||[];
    const row=window.UFC_CALCULATED_RANKING_PROJECTION?.entryFor?.(fighter)||men.find(item=>item.fighter===fighter)||null;
    const divisionIndex=flyweight.findIndex(item=>item.fighter===fighter);
    return{
      fighterCount:men.length+women.length,
      topTen:men.slice(0,10).map(item=>item.fighter),
      projectionTopTen:window.UFC_CALCULATED_RANKING_PROJECTION?.men?.slice(0,10).map(item=>item.fighter)||[],
      pipelineTopTen:window.UFC_RANKING_PIPELINE?.latest?.menTopTen?.map(item=>item.fighter)||[],
      bootstrap:window.UFC_PRODUCTION_RANKING_BOOTSTRAP||null,
      divisionReport:window.UFC_DIVISION_RANKING_PIPELINE?.latest||null,
      moreno:row,
      morenoCategory:window.UFC_CATEGORY_CALCULATORS?.entryFor?.(fighter)||null,
      morenoDivisionRank:divisionIndex>=0?divisionIndex+1:null,
      morenoOverride:window.DISPLAY_OVERRIDES?.[fighter]||null,
      morenoCompare:window.COMPARE_PROFILES?.[fighter]||null,
      morenoEra:window.UFC_ERA_FILTER_DATA?.curatedMembership?.[fighter]||null,
      morenoLedgers:Object.entries(window.COMPARE_FIGHT_LEDGER||{}).filter(([,item])=>Array.isArray(item?.fighters)&&item.fighters.includes(fighter)).map(([key,item])=>({key,...item})),
      jon:men.find(item=>item.fighter==='Jon Jones'),
      gsp:men.find(item=>item.fighter==='Georges St-Pierre'),
      amanda:women.find(item=>item.fighter==='Amanda Nunes'),
      valentina:women.find(item=>item.fighter==='Valentina Shevchenko'),
      flyweight,
      openweight:window.UFC_DIVISION_RANKING_PIPELINE?.boardFor?.('Openweight')||[],
      scoringRecordsLoaded:Boolean(window.UFC_CANONICAL_SCORING_RECORDS),
      legacyEngineLoaded:Boolean(window.UFC_SCORING_ENGINE),
      legacyFinalizerLoaded:Boolean(window.UFC_SCORING_OWNERSHIP_FINALIZER),
      profileRuntime:window.UFC_CALCULATED_PROFILE_RUNTIME||null
    };
  },MORENO);

  assert.equal(runtime.fighterCount,EXPECTED_FIGHTERS);
  assert.equal(runtime.bootstrap?.status,'ready');
  assert.equal(runtime.bootstrap?.report?.fighterCount,EXPECTED_FIGHTERS);
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

  const row=runtime.moreno;
  assert.ok(row,'Moreno calculated row exists');
  assert.equal(row.rank,47);
  assert.equal(row.totalScore,45.3);
  assert.equal(row.overallOvr,88);
  assert.equal(row.ufcRecord,'11-7-2');
  assert.equal(row.titleFightWins,3);
  assert.equal(row.adjustedTitleWins,2.65);
  assert.equal(row.topFiveWins,5);
  assert.equal(row.rankedWins,10);
  assert.equal(row.finishRatePct,54.55);
  assert.equal(row.primeRecord,'7-4-1');
  assert.equal(row.roundsWonPct,62.22);
  assert.equal(row.activeEliteYears,5.73);
  assert.equal(row.timesFinishedPrime,1);
  assert.equal(row.primaryDivision,'Flyweight');
  assert.equal(runtime.morenoDivisionRank,3);
  assert.equal(runtime.morenoCategory?.status,'complete');
  assert.deepEqual(runtime.morenoEra,{primary:'apex',secondary:'new-blood'});
  assert.equal(runtime.morenoLedgers.length,4);
  assert.ok(runtime.morenoCompare?.shortCase&&runtime.morenoCompare?.counter&&runtime.morenoCompare?.edge);
  assert.equal(runtime.morenoOverride?.profileDisplayName,'Brandon “The Assassin Baby” Moreno');
  assert.equal(runtime.morenoOverride?.watchUrl,WATCH);
  assert.equal(runtime.morenoOverride?.signatureFightUrl,FIGHT);

  assert.equal(runtime.divisionReport?.passed,true);
  assert.equal(runtime.divisionReport?.manualGuardrails,false);
  assert.equal(runtime.divisionReport?.conservation?.length,0);
  assert.equal(runtime.divisionReport?.allocationWarnings?.length,0);
  assert.equal(Object.keys(runtime.divisionReport?.boards||{}).length,9);
  assert.equal(runtime.flyweight[0]?.fighter,'Demetrious Johnson');
  assert.equal(runtime.openweight[0]?.fighter,'Royce Gracie');
  for(const board of Object.values(runtime.divisionReport?.boards||{}))for(const item of board)assert.ok(item.stats?.ufcWins>0,`${item.fighter} owns a UFC win in ${item.division}`);

  const morenoRow=page.locator('#menList .fighter-row[data-fighter="Brandon Moreno"]');
  await morenoRow.scrollIntoViewIfNeeded();
  const cardWatch=await morenoRow.locator('.watch-moment-link').getAttribute('href');
  assert.equal(cardWatch,WATCH,'fighter-card Watch Moment uses supplied Short');

  await page.evaluate(name=>window.openFighter?.(name),MORENO);
  await page.waitForSelector('#drawer.open',{timeout:15000});
  const profile=await page.evaluate(()=>({
    heading:document.querySelector('#fighterDetail h2')?.textContent?.trim()||'',
    text:document.querySelector('#fighterDetail')?.textContent||'',
    links:[...document.querySelectorAll('#fighterDetail a')].map(link=>({text:link.textContent?.trim()||'',href:link.href}))
  }));
  assert.match(profile.heading,/Brandon.*The Assassin Baby.*Moreno/);
  assert.ok(profile.text.includes('Why Not Ranked Higher?'));
  assert.ok(profile.links.some(link=>link.href===FIGHT&&/signature fight/i.test(link.text)),'profile Signature Fight uses supplied full fight');
  await page.locator('#closeDrawer').click();

  await page.locator('.tab[data-view="compare"]').click();
  const compareOptions=await page.locator('#fighterA option').allTextContents();
  assert.ok(compareOptions.some(text=>text.includes(MORENO)),'Moreno appears in Compare selector');

  await page.locator('.tab[data-view="play"]').click();
  const search=page.locator('#playFighterSearch');
  await search.fill(MORENO);
  await page.locator(`[data-add-fighter="${MORENO}"]`).waitFor({state:'visible',timeout:10000});
  await page.locator('[data-play-mode="blind"]').click();
  await page.waitForSelector('.blind-comparison-card',{timeout:30000});
  const blindText=await page.locator('#blindMatchup').textContent();
  for(const label of ['UFC title-fight wins','Top-5 wins','Prime UFC record','Apex rating','Rounds won','Finish rate','Active elite years'])assert.ok(blindText.includes(label),`Blind Resume contains ${label}`);

  assert.deepEqual(pageErrors,[],'rendered app has no uncaught page errors');
  console.log('BRANDON_MORENO_PIPELINE_RESULT');
  console.log(JSON.stringify({row,divisionRank:runtime.morenoDivisionRank,categories:runtime.morenoCategory,cardWatch,profile,era:runtime.morenoEra,directFightLedgers:runtime.morenoLedgers},null,2));
  console.log('PRODUCTION_BROWSER_CERTIFICATION');
  console.log(JSON.stringify({fighterCount:runtime.fighterCount,topTen:runtime.topTen,divisionBoards:Object.keys(runtime.divisionReport?.boards||{}),compareSelector:true,playSearch:true,blindResume:true,pageErrors},null,2));
}finally{
  await browser.close();
}

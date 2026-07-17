import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const EXPECTED_FIGHTERS=79;
const MORENO='Brandon Moreno';
const MORENO_WATCH='https://youtube.com/shorts/eKlp7eFDSTM?is=_dMar84p0EkqYXz_';
const MORENO_FIGHT='https://youtu.be/GPrzwbgg8yU?is=M-G22YQ8u-8QVKtz';
const expectedTopTen=[
  'Jon Jones','Georges St-Pierre','Anderson Silva','Demetrious Johnson','Islam Makhachev',
  'Alexander Volkanovski','Khabib Nurmagomedov','Matt Hughes','Kamaru Usman','Max Holloway'
];

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}});
const pageErrors=[];
const consoleErrors=[];
page.on('pageerror',error=>pageErrors.push(error.message));
page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});

const captureRuntime=()=>page.evaluate(fighter=>({
  fighterCount:(window.RANKING_DATA.men||[]).length+(window.RANKING_DATA.women||[]).length,
  topTen:window.RANKING_DATA.men.slice(0,10).map(row=>row.fighter),
  projectionTopTen:window.UFC_CALCULATED_RANKING_PROJECTION?.men?.slice(0,10).map(row=>row.fighter)||[],
  reportTopTen:window.UFC_RANKING_PIPELINE?.latest?.menTopTen?.map(row=>row.fighter)||[],
  jon:window.RANKING_DATA.men.find(row=>row.fighter==='Jon Jones'),
  gsp:window.RANKING_DATA.men.find(row=>row.fighter==='Georges St-Pierre'),
  amanda:window.RANKING_DATA.women.find(row=>row.fighter==='Amanda Nunes'),
  valentina:window.RANKING_DATA.women.find(row=>row.fighter==='Valentina Shevchenko'),
  moreno:window.UFC_CALCULATED_RANKING_PROJECTION?.entryFor?.(fighter)||window.RANKING_DATA.men.find(row=>row.fighter===fighter)||null,
  morenoCategory:window.UFC_CATEGORY_CALCULATORS?.entryFor?.(fighter)||null,
  morenoOverride:window.DISPLAY_OVERRIDES?.[fighter]||null,
  morenoCompare:window.COMPARE_PROFILES?.[fighter]||null,
  morenoEra:window.UFC_ERA_FILTER_DATA?.curatedMembership?.[fighter]||null,
  morenoFightLedgers:Object.entries(window.COMPARE_FIGHT_LEDGER||{}).filter(([,row])=>Array.isArray(row?.fighters)&&row.fighters.includes(fighter)).map(([key,row])=>({key,...row})),
  scoringRecordsLoaded:Boolean(window.UFC_CANONICAL_SCORING_RECORDS),
  legacyEngineLoaded:Boolean(window.UFC_SCORING_ENGINE),
  legacyFinalizerLoaded:Boolean(window.UFC_SCORING_OWNERSHIP_FINALIZER),
  scoreMode:window.RANKING_DATA.liveScoreMode,
  categoryVersion:window.UFC_CATEGORY_CALCULATORS?.version||null,
  primeReconstructionLoaded:Boolean(window.UFC_CANONICAL_PRIME_DOMINANCE_RECONSTRUCTION),
  longevityReconstructionLoaded:Boolean(window.UFC_CANONICAL_LONGEVITY_RECONSTRUCTION),
  compareSource:window.COMPARE_PROFILES?.['Jon Jones']?.legacyStats?.source||null,
  profileSnapshotOwner:window.UFC_CALCULATED_PROFILE_RUNTIME?.snapshotOwner||null,
  profileRankOwner:window.UFC_CALCULATED_PROFILE_RUNTIME?.rankOwner||null,
  profileOvrOwner:window.UFC_CALCULATED_PROFILE_RUNTIME?.ovrOwner||null,
  overrideRank:window.DISPLAY_OVERRIDES?.['Jon Jones']?.allTimeRank,
  overrideOvr:window.DISPLAY_OVERRIDES?.['Jon Jones']?.overallOvr,
  inertLegacySnapshotPresent:Array.isArray(window.DISPLAY_OVERRIDES?.['Jon Jones']?.snapshot),
  divisionReport:window.UFC_DIVISION_RANKING_PIPELINE?.latest||null,
  lhwBoard:window.UFC_DIVISION_RANKING_PIPELINE?.boardFor?.('Light Heavyweight')||[],
  wwBoard:window.UFC_DIVISION_RANKING_PIPELINE?.boardFor?.('Welterweight')||[],
  mwBoard:window.UFC_DIVISION_RANKING_PIPELINE?.boardFor?.('Middleweight')||[],
  hwBoard:window.UFC_DIVISION_RANKING_PIPELINE?.boardFor?.('Heavyweight')||[],
  flwBoard:window.UFC_DIVISION_RANKING_PIPELINE?.boardFor?.('Flyweight')||[],
  openweightBoard:window.UFC_DIVISION_RANKING_PIPELINE?.boardFor?.('Openweight')||[],
  writers:{
    liveScoreUi:window.UFC_SIX_CATEGORY_SCORE_MODEL||null,
    championship:window.UFC_CHAMPIONSHIP_RESUME_LIVE||null,
    opponentQuality:window.UFC_OPPONENT_QUALITY_LIVE||null,
    prime:window.UFC_PRIME_DOMINANCE_LIVE_PROMOTER||null,
    longevity:window.UFC_LONGEVITY_LIVE_PROMOTER||null,
    apex:window.UFC_APEX_PEAK_LIVE_BONUS||null,
    dynamicRanks:window.UFC_DYNAMIC_RANKS||null
  }
}),MORENO);

const captureBootstrap=()=>page.evaluate(()=>({
  htmlState:document.documentElement.getAttribute('data-production-ranking-bootstrap'),
  scoringState:document.documentElement.getAttribute('data-scoring-pipeline'),
  divisionState:document.documentElement.getAttribute('data-division-ranking-pipeline'),
  bootstrap:window.UFC_PRODUCTION_RANKING_BOOTSTRAP||null,
  factsCount:window.UFC_CANONICAL_FIGHTER_FACTS?.count?.()||null,
  categoryAudit:window.UFC_CATEGORY_CALCULATOR_AUDIT||null,
  judgmentCount:window.UFC_CANONICAL_SCORING_JUDGMENTS?.fighterCount||null,
  longevityResolution:window.UFC_FIGHTER_ERA_LEDGER_APPROVED_LONGEVITY_RESOLUTIONS||null,
  lossResolution:window.UFC_FIGHTER_ERA_LEDGER_APPROVED_LOSS_CONTEXT_RESOLUTIONS||null,
  calculatedProfile:Boolean(window.UFC_CALCULATED_PROFILE_RUNTIME),
  patchesState:window.UFC_PHASE2_DATA_STATUS?.version||null
}));

try{
  await page.goto('http://127.0.0.1:4173/index.html',{waitUntil:'domcontentloaded'});
  try{
    await page.waitForFunction(()=>document.documentElement.getAttribute('data-scoring-pipeline')==='ready',null,{timeout:90000});
  }catch(error){
    console.log('PRODUCTION_BROWSER_BOOTSTRAP_FAILURE');
    console.log(JSON.stringify({diagnostic:await captureBootstrap(),pageErrors,consoleErrors},null,2));
    throw error;
  }
  await page.waitForSelector('#menList .fighter-row',{timeout:15000});
  await page.evaluate(()=>document.getElementById('whatsNewOverlay')?.remove());

  const atReady=await captureRuntime();
  await page.waitForTimeout(6500);
  const runtime=await captureRuntime();
  const morenoDivisionIndex=runtime.flwBoard.findIndex(row=>row.fighter===MORENO);
  const morenoDivisionRank=morenoDivisionIndex>=0?morenoDivisionIndex+1:null;
  console.log('PRODUCTION_BROWSER_PREFLIGHT');
  console.log(JSON.stringify({atReady:{topTen:atReady.topTen,projectionTopTen:atReady.projectionTopTen,reportTopTen:atReady.reportTopTen},stable:{topTen:runtime.topTen,projectionTopTen:runtime.projectionTopTen,reportTopTen:runtime.reportTopTen},profileOwners:{snapshot:runtime.profileSnapshotOwner,rank:runtime.profileRankOwner,ovr:runtime.profileOvrOwner,inertLegacySnapshotPresent:runtime.inertLegacySnapshotPresent},division:{status:runtime.divisionReport?.status,manualGuardrails:runtime.divisionReport?.manualGuardrails,eligibilityRule:runtime.divisionReport?.eligibilityRule,boards:Object.keys(runtime.divisionReport?.boards||{})},moreno:{row:runtime.moreno,divisionRank:morenoDivisionRank,category:runtime.morenoCategory,era:runtime.morenoEra,ledgerCount:runtime.morenoFightLedgers.length},writers:runtime.writers,pageErrors,consoleErrors},null,2));

  assert.equal(runtime.fighterCount,EXPECTED_FIGHTERS);
  assert.deepEqual(runtime.projectionTopTen,expectedTopTen,'calculated projection top ten');
  assert.deepEqual(runtime.reportTopTen,expectedTopTen,'ranking pipeline report top ten');
  assert.deepEqual(runtime.topTen,expectedTopTen,'rendered RANKING_DATA top ten');
  assert.equal(runtime.jon.rank,1);assert.equal(runtime.jon.overallOvr,99);
  assert.equal(runtime.gsp.rank,2);assert.equal(runtime.gsp.overallOvr,96);
  assert.equal(runtime.amanda.rank,1);assert.equal(runtime.amanda.overallOvr,99);
  assert.equal(runtime.valentina.overallOvr,98);
  assert.equal(runtime.scoringRecordsLoaded,false);
  assert.equal(runtime.legacyEngineLoaded,false);
  assert.equal(runtime.legacyFinalizerLoaded,false);
  assert.equal(runtime.primeReconstructionLoaded,false);
  assert.equal(runtime.longevityReconstructionLoaded,false);
  assert.equal(runtime.scoreMode,'fight-level-calculated-single-owner');
  assert.match(runtime.categoryVersion,/seven-direct-calculators/);
  assert.equal(runtime.compareSource,'calculated-ranking-pipeline');
  assert.equal(runtime.profileSnapshotOwner,'RANKING_DATA.visibleStats');
  assert.equal(runtime.profileRankOwner,'RANKING_DATA.rank');
  assert.equal(runtime.profileOvrOwner,'RANKING_DATA.overallOvr');
  assert.equal(runtime.overrideRank,undefined);
  assert.equal(runtime.overrideOvr,undefined);

  assert.ok(runtime.moreno,'Moreno calculated row exists');
  assert.equal(runtime.moreno.ufcRecord,'11-8-1');
  assert.equal(runtime.moreno.titleFightWins,3);
  assert.equal(runtime.moreno.adjustedTitleWins,2.65);
  assert.equal(runtime.moreno.topFiveWins,5);
  assert.equal(runtime.moreno.rankedWins,10);
  assert.equal(runtime.moreno.primeRecord,'7-4-1');
  assert.equal(runtime.moreno.roundsWonPct,62.22);
  assert.equal(runtime.moreno.finishRatePct,54.55);
  assert.equal(runtime.moreno.activeEliteYears,5.73);
  assert.equal(runtime.moreno.timesFinishedPrime,1);
  assert.equal(runtime.moreno.primaryDivision,'Flyweight');
  assert.equal(runtime.morenoCategory?.status,'complete');
  assert.deepEqual(runtime.morenoEra,{primary:'apex',secondary:'new-blood'});
  assert.ok(runtime.morenoCompare?.shortCase&&runtime.morenoCompare?.counter&&runtime.morenoCompare?.edge);
  assert.equal(runtime.morenoFightLedgers.length,4);
  assert.equal(runtime.morenoOverride?.profileDisplayName,'Brandon “The Assassin Baby” Moreno');
  assert.equal(runtime.morenoOverride?.watchUrl,MORENO_WATCH);
  assert.equal(runtime.morenoOverride?.signatureFightUrl,MORENO_FIGHT);

  assert.equal(runtime.divisionReport?.passed,true,'automatic division ranking report passes');
  assert.equal(runtime.divisionReport?.manualGuardrails,false,'division rankings have no manual guardrails');
  assert.equal(runtime.divisionReport?.eligibilityRule,'at least one UFC win in the division');
  assert.match(runtime.divisionReport?.allocationOwner||'',/canonical fight-level division evidence/);
  assert.equal(runtime.divisionReport?.conservation?.length,0,'division allocations conserve each fighter total score');
  assert.equal(runtime.divisionReport?.allocationWarnings?.length,0,'division allocation has no unexplained gaps');
  assert.equal(Object.keys(runtime.divisionReport?.boards||{}).length,9,'eight modern boards plus historical Openweight');
  assert.equal(runtime.lhwBoard[0]?.fighter,'Jon Jones','Jon Jones leads calculated LHW board');
  assert.equal(runtime.wwBoard[0]?.fighter,'Georges St-Pierre','GSP leads calculated WW board');
  assert.equal(runtime.flwBoard[0]?.fighter,'Demetrious Johnson','DJ leads calculated flyweight board');
  assert.ok(morenoDivisionRank,'Moreno is included on the calculated flyweight board');
  assert.equal(runtime.openweightBoard[0]?.fighter,'Royce Gracie','Royce leads historical Openweight board');
  assert.ok(runtime.openweightBoard[0]?.stats?.ufcWins>0,'Royce Openweight row contains UFC wins');
  assert.ok(!runtime.wwBoard.some(row=>row.fighter==='Royce Gracie'),'Royce loss-only Hughes cameo is excluded from welterweight board');
  assert.ok(!runtime.hwBoard.some(row=>row.fighter==='Alex Pereira'),'Pereira loss-only heavyweight cameo is excluded');
  assert.ok(!runtime.lhwBoard.some(row=>row.fighter==='Israel Adesanya'),'Adesanya loss-only light-heavyweight cameo is excluded');
  assert.ok(!runtime.mwBoard.some(row=>['Kamaru Usman','Rashad Evans'].includes(row.fighter)),'loss-only middleweight cameos are excluded');
  assert.ok(!runtime.flwBoard.some(row=>row.fighter==='T.J. Dillashaw'),'Dillashaw loss-only flyweight cameo is excluded');
  for(const board of Object.values(runtime.divisionReport?.boards||{}))for(const row of board)assert.ok(row.stats?.ufcWins>0,`${row.fighter} owns a UFC win in ${row.division}`);

  const firstRow=page.locator('#menList .fighter-row').first();
  const firstText=await firstRow.textContent();
  assert.match(firstText,/^\s*#1/);
  assert.match(firstText,/Jon Jones/);
  assert.match(firstText,/99\s*OVR/);
  await firstRow.click();
  await page.waitForSelector('#drawer.open');
  const profileText=await page.locator('#fighterDetail').textContent();
  for(const text of ['UFC All-Time Rank: #1','99 OVR','Resume Snapshot','UFC Title-Fight Wins','Top-5 Wins','Prime UFC Record','Rounds Won','Active Elite Years'])assert.ok(profileText.includes(text),`profile contains ${text}`);
  assert.ok(!profileText.includes('Prime Stoppage Losses'),'legacy manual snapshot rows are not rendered');
  await page.locator('#closeDrawer').click();

  await page.evaluate(name=>window.openFighter?.(name),MORENO);
  await page.waitForSelector('#drawer.open');
  const morenoProfile=await page.evaluate(()=>({
    text:document.querySelector('#fighterDetail')?.textContent||'',
    heading:document.querySelector('#fighterDetail h2')?.textContent?.trim()||'',
    links:[...document.querySelectorAll('#fighterDetail a')].map(link=>({text:link.textContent?.trim()||'',href:link.href}))
  }));
  assert.match(morenoProfile.heading,/Brandon.*The Assassin Baby.*Moreno/);
  assert.ok(morenoProfile.text.includes('Why Not Ranked Higher?'));
  assert.ok(morenoProfile.links.some(link=>link.href===MORENO_WATCH));
  assert.ok(morenoProfile.links.some(link=>link.href===MORENO_FIGHT));
  await page.locator('#closeDrawer').click();

  await page.locator('.tab[data-view="division"]').click();
  await page.locator('[data-division-pick="Light Heavyweight"]').click();
  const divisionText=await page.locator('#divisionList').textContent();
  const firstDivisionText=await page.locator('#divisionList .fighter-row').first().textContent();
  assert.match(divisionText,/Light Heavyweight · Men/);
  assert.match(firstDivisionText,/^\s*#1/);
  assert.match(firstDivisionText,/Jon Jones/);
  assert.match(divisionText,/DIV SCORE/);
  assert.match(divisionText,/calculated UFC résumé/);

  await page.locator('[data-division-pick="Openweight"]').click();
  const openweightText=await page.locator('#divisionList').textContent();
  assert.match(openweightText,/Openweight \(Historical\) · Men/);
  assert.match(openweightText,/Royce Gracie/);
  assert.match(openweightText,/11-0-1 UFC/);

  await page.locator('.tab[data-view="compare"]').click();
  const compareOptions=await page.locator('#fighterA option').allTextContents();
  assert.ok(compareOptions.some(text=>text.includes('Brandon Moreno')),'Moreno appears in Compare selector');
  const compareText=await page.locator('#compareResult').textContent();
  assert.match(compareText,/Jon Jones/);
  assert.match(compareText,/Georges St-Pierre/);
  assert.match(compareText,/(?:#1\s*·\s*99 OVR|99 OVR\s*·\s*#1)/);
  assert.match(compareText,/(?:#2\s*·\s*96 OVR|96 OVR\s*·\s*#2)/);
  const launcherText=await page.locator('#octagonVerdictLauncher').textContent();
  assert.match(launcherText,/Copy Live Matchup/);
  assert.match(launcherText,/Download Full JSON/);

  await page.locator('.tab[data-view="play"]').click();
  const search=page.locator('#playFighterSearch');
  await search.fill(MORENO);
  await page.locator(`[data-add-fighter="${MORENO}"]`).waitFor({state:'visible',timeout:10000});
  await search.fill('');
  for(const name of expectedTopTen){
    await search.fill(name);
    const add=page.locator(`[data-add-fighter="${name}"]`);
    await add.waitFor({state:'visible',timeout:10000});
    await add.click();
  }
  assert.equal(await page.locator('#playCompareBtn').isEnabled(),true);
  await page.locator('#playCompareBtn').click();
  const topTenResult=await page.locator('#playTop10Result').textContent();
  assert.match(topTenResult,/MODEL AGREEMENT\s*100\s*out of 100/);
  assert.match(topTenResult,/Jon Jones\s*Model #1/);
  assert.match(topTenResult,/Max Holloway\s*Model #10/);

  await page.locator('[data-play-mode="blind"]').click();
  await page.waitForSelector('.blind-comparison-card',{timeout:30000});
  const blindText=await page.locator('#blindMatchup').textContent();
  for(const label of ['UFC title-fight wins','Top-5 wins','Prime UFC record','Apex rating','Rounds won','Finish rate','Active elite years'])assert.ok(blindText.includes(label),`Blind Resume contains ${label}`);
  assert.ok(!blindText.includes('Finalizing the live model'));

  assert.deepEqual(pageErrors,[],'rendered app has no uncaught page errors');

  console.log('BRANDON_MORENO_PIPELINE_RESULT');
  console.log(JSON.stringify({row:runtime.moreno,divisionRank:morenoDivisionRank,categories:runtime.morenoCategory,profile:morenoProfile,era:runtime.morenoEra,directFightLedgers:runtime.morenoFightLedgers},null,2));
  console.log('PRODUCTION_BROWSER_CERTIFICATION');
  console.log(JSON.stringify({fighterCount:runtime.fighterCount,topTen:runtime.topTen,jonOvr:runtime.jon.overallOvr,gspOvr:runtime.gsp.overallOvr,snapshot:'calculated visibleStats rendered',compare:'calculated rank/OVR and live Octagon launcher rendered',division:'nine automatic win-qualified canonical boards rendered',openweightLeader:runtime.openweightBoard[0]?.fighter,top10Game:'100/100 for model-order list',blindResume:'calculated seven-stat matchup rendered',legacyRuntimeLoaded:false,inertLegacySnapshotPayloadIgnored:runtime.inertLegacySnapshotPresent,pageErrors:pageErrors.length},null,2));
}finally{
  await browser.close();
}
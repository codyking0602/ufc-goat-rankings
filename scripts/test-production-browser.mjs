import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const expectedTopTen=[
  'Jon Jones','Georges St-Pierre','Anderson Silva','Demetrious Johnson','Islam Makhachev',
  'Alexander Volkanovski','Khabib Nurmagomedov','Matt Hughes','Kamaru Usman','Max Holloway'
];

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}});
const pageErrors=[];
page.on('pageerror',error=>pageErrors.push(error.message));

try{
  await page.goto('http://127.0.0.1:4173/index.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.documentElement.getAttribute('data-scoring-pipeline')==='ready',null,{timeout:90000});
  await page.waitForSelector('#menList .fighter-row',{timeout:15000});

  const runtime=await page.evaluate(()=>({
    topTen:window.RANKING_DATA.men.slice(0,10).map(row=>row.fighter),
    jon:window.RANKING_DATA.men.find(row=>row.fighter==='Jon Jones'),
    gsp:window.RANKING_DATA.men.find(row=>row.fighter==='Georges St-Pierre'),
    amanda:window.RANKING_DATA.women.find(row=>row.fighter==='Amanda Nunes'),
    valentina:window.RANKING_DATA.women.find(row=>row.fighter==='Valentina Shevchenko'),
    scoringRecordsLoaded:Boolean(window.UFC_CANONICAL_SCORING_RECORDS),
    legacyEngineLoaded:Boolean(window.UFC_SCORING_ENGINE),
    legacyFinalizerLoaded:Boolean(window.UFC_SCORING_OWNERSHIP_FINALIZER),
    scoreMode:window.RANKING_DATA.liveScoreMode,
    categoryVersion:window.UFC_CATEGORY_CALCULATORS?.version||null,
    primeReconstructionLoaded:Boolean(window.UFC_CANONICAL_PRIME_DOMINANCE_RECONSTRUCTION),
    longevityReconstructionLoaded:Boolean(window.UFC_CANONICAL_LONGEVITY_RECONSTRUCTION),
    compareSource:window.COMPARE_PROFILES?.['Jon Jones']?.legacyStats?.source||null,
    overrideRank:window.DISPLAY_OVERRIDES?.['Jon Jones']?.allTimeRank,
    overrideOvr:window.DISPLAY_OVERRIDES?.['Jon Jones']?.overallOvr,
    overrideSnapshot:window.DISPLAY_OVERRIDES?.['Jon Jones']?.snapshot
  }));

  assert.deepEqual(runtime.topTen,expectedTopTen);
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
  assert.equal(runtime.overrideRank,undefined);
  assert.equal(runtime.overrideOvr,undefined);
  assert.equal(runtime.overrideSnapshot,undefined);

  const firstRow=page.locator('#menList .fighter-row').first();
  const firstText=await firstRow.textContent();
  assert.match(firstText,/^\s*#1/);
  assert.match(firstText,/Jon Jones/);
  assert.match(firstText,/99\s*OVR/);

  await firstRow.click();
  await page.waitForSelector('#drawer.open');
  const profileText=await page.locator('#fighterDetail').textContent();
  for(const text of ['UFC All-Time Rank: #1','99 OVR','Resume Snapshot','UFC Title-Fight Wins','Top-5 Wins','Prime UFC Record','Rounds Won','Active Elite Years'])assert.ok(profileText.includes(text),`profile contains ${text}`);
  await page.locator('#closeDrawer').click();

  await page.locator('.tab[data-view="compare"]').click();
  const compareText=await page.locator('#compareResult').textContent();
  assert.match(compareText,/Jon Jones/);
  assert.match(compareText,/Georges St-Pierre/);
  assert.match(compareText,/99 OVR\s*·\s*#1/);
  assert.match(compareText,/96 OVR\s*·\s*#2/);

  await page.locator('.tab[data-view="play"]').click();
  const search=page.locator('#playFighterSearch');
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

  console.log('PRODUCTION_BROWSER_CERTIFICATION');
  console.log(JSON.stringify({
    topTen:runtime.topTen,
    jonOvr:runtime.jon.overallOvr,
    gspOvr:runtime.gsp.overallOvr,
    snapshot:'calculated visibleStats rendered',
    compare:'calculated rank/OVR rendered',
    top10Game:'100/100 for model-order list',
    blindResume:'calculated seven-stat matchup rendered',
    legacyRuntimeLoaded:false,
    pageErrors:pageErrors.length
  },null,2));
}finally{
  await browser.close();
}

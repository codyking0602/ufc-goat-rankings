import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const ORIGIN='http://127.0.0.1:4173';
const REPORT='/tmp/better-than-photo-authority-owner-report.json';
const report={passed:false,stage:'static-contract',production:null,recovery:null,error:null};
let browser;

const index=fs.readFileSync('index.html','utf8');
const betterThan=fs.readFileSync('assets/js/better-than-standalone-share.js','utf8');
const photoAuthority=fs.readFileSync('assets/js/play-photo-authority.js','utf8');
const currentVersion=photoAuthority.match(/const VERSION='([^']+)'/)?.[1]||'';

assert(currentVersion,'Current Play photo authority version could not be identified.');
assert(index.indexOf('assets/js/play-photo-authority.js')>=0,'Production manifest must explicitly load Play photo authority.');
assert(index.indexOf('assets/js/better-than-standalone-share.js')>=0,'Production manifest must load Better Than compatibility.');
assert(index.indexOf('assets/js/play-photo-authority.js')<index.indexOf('assets/js/better-than-standalone-share.js'),'The Play photo authority owner must load before Better Than compatibility.');
assert.match(betterThan,/if\(!window\.UFC_PLAY_PHOTO_AUTHORITY\)\{[\s\S]*data-play-photo-authority[\s\S]*return;[\s\S]*\}/,'Photo authority fallback must run only while the manifest owner is absent.');
assert(betterThan.includes(`assets/js/play-photo-authority.js?v=${currentVersion}`),'The missing-owner recovery must request the current photo authority build.');
assert.match(photoAuthority,/window\.UFC_PLAY_PHOTO_AUTHORITY=\{[\s\S]*version:VERSION[\s\S]*sync[\s\S]*\};/,'Play photo authority must publish its public owner API synchronously.');

const supabaseStub=`window.supabase={createClient(){const chain={select(){return chain;},eq(){return chain;},order(){return Promise.resolve({data:[],error:null});},limit(){return Promise.resolve({data:null,error:null});},single(){return Promise.resolve({data:null,error:null});}};return{rpc:async()=>({data:null,error:null}),from:()=>chain,channel(){return{on(){return this;},subscribe(){return this;}}},removeChannel:async()=>{}};}};`;

try{
  report.stage='browser-launch';
  browser=await chromium.launch({headless:true});

  report.stage='production-owner';
  const productionContext=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const productionPage=await productionContext.newPage();
  const productionRequests=[];
  productionPage.on('request',request=>{
    const url=new URL(request.url());
    if(url.pathname.endsWith('/assets/js/play-photo-authority.js'))productionRequests.push(request.url());
  });
  await productionPage.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',route=>route.fulfill({status:200,contentType:'application/javascript',body:supabaseStub}));
  await productionPage.goto(`${ORIGIN}/index.html?phase5=photo-authority-owner#home`,{waitUntil:'domcontentloaded',timeout:60000});
  await productionPage.waitForFunction(()=>window.UFC_PLAY_PHOTO_AUTHORITY&&document.documentElement.dataset.betterThanStandaloneShare,null,{timeout:60000});
  await productionPage.waitForTimeout(500);
  report.production=await productionPage.evaluate(()=>({
    version:window.UFC_PLAY_PHOTO_AUTHORITY?.version||'',
    ownerScripts:document.querySelectorAll('script[src*="assets/js/play-photo-authority.js"]').length,
    recoveryScripts:document.querySelectorAll('script[data-play-photo-authority]').length,
    styles:document.querySelectorAll('#play-photo-authority-css').length,
    compatibility:document.documentElement.dataset.betterThanStandaloneShare||''
  }));
  report.production.requests=productionRequests;
  assert.equal(productionRequests.length,1,'Healthy production startup must request the explicit photo authority owner exactly once.');
  assert.equal(report.production.version,currentVersion,'Better Than compatibility must retain the current manifest-owned photo authority.');
  assert.equal(report.production.ownerScripts,1,'Healthy production startup must retain one photo authority script.');
  assert.equal(report.production.recoveryScripts,0,'Healthy production startup must not inject the missing-owner photo authority recovery script.');
  assert.equal(report.production.styles,1,'Healthy production startup must retain one photo authority style owner.');
  await productionContext.close();

  report.stage='missing-owner-recovery';
  const recoveryContext=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const recoveryPage=await recoveryContext.newPage();
  const recoveryRequests=[];
  recoveryPage.on('request',request=>{
    const url=new URL(request.url());
    if(url.pathname.endsWith('/assets/js/play-photo-authority.js'))recoveryRequests.push(request.url());
  });
  const fixture=`<!doctype html><html><head><meta charset="utf-8"><title>Photo authority owner recovery</title></head><body>
    <section id="play"><div class="play-shell"><article class="play-game-card" data-open-game="find-leader"><div class="play-game-copy"><small>Find the leader</small></div></article></div></section>
    <script>window.UFC_PLAY_SHARED={dailyContext:{challenge_day:'proof'}};</script>
    <script src="/assets/js/better-than-standalone-share.js"></script>
  </body></html>`;
  await recoveryPage.route(`${ORIGIN}/better-than-photo-authority-owner-proof.html`,route=>route.fulfill({status:200,contentType:'text/html',body:fixture}));
  for(const pattern of [
    '**/assets/data/find-leader-record-book-data.js*',
    '**/assets/data/find-leader-question-bank.js*',
    '**/assets/js/find-leader-standalone-share.js*',
    '**/assets/js/play-daily-rotation.js*',
    '**/assets/js/play-daily-leaderboard.js*',
    '**/assets/js/play-daily-polish.js*',
    '**/assets/js/play-community-picks.js*',
    '**/assets/js/play-daily-find-leader.js*'
  ])await recoveryPage.route(pattern,route=>route.fulfill({status:200,contentType:'application/javascript',body:''}));
  await recoveryPage.route('**/assets/js/find-leader.js*',route=>route.fulfill({status:200,contentType:'application/javascript',body:'window.UFC_FIND_LEADER={version:"proof",open(){},dailySetup(){return null;}};'}));
  await recoveryPage.goto(`${ORIGIN}/better-than-photo-authority-owner-proof.html`,{waitUntil:'domcontentloaded',timeout:60000});
  await recoveryPage.waitForFunction(()=>window.UFC_PLAY_PHOTO_AUTHORITY&&document.querySelector('script[data-play-photo-authority]')?.dataset.loaded==='true',null,{timeout:10000});
  await recoveryPage.waitForTimeout(250);
  report.recovery=await recoveryPage.evaluate(()=>({
    version:window.UFC_PLAY_PHOTO_AUTHORITY?.version||'',
    ownerScripts:document.querySelectorAll('script[src*="assets/js/play-photo-authority.js"]').length,
    recoveryScripts:document.querySelectorAll('script[data-play-photo-authority]').length,
    styles:document.querySelectorAll('#play-photo-authority-css').length,
    compatibility:document.documentElement.dataset.betterThanStandaloneShare||''
  }));
  report.recovery.requests=recoveryRequests;
  assert.equal(recoveryRequests.length,1,'An absent manifest owner must trigger one bounded photo authority recovery request.');
  assert.equal(report.recovery.version,currentVersion,'The recovery path must publish the current photo authority owner.');
  assert.equal(report.recovery.ownerScripts,1,'The recovery fixture must contain one photo authority script.');
  assert.equal(report.recovery.recoveryScripts,1,'The recovery fixture must identify one bounded recovery script.');
  assert.equal(report.recovery.styles,1,'The recovered photo authority must install one style owner.');
  await recoveryContext.close();

  report.passed=true;
  report.stage='complete';
  console.log('Better Than photo authority manifest ownership proof passed.');
}catch(error){
  report.error={message:error?.message||String(error),stack:error?.stack||null};
  throw error;
}finally{
  fs.writeFileSync(REPORT,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}

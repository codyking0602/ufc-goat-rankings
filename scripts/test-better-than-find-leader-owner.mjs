import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const ORIGIN='http://127.0.0.1:4173';
const REPORT='/tmp/better-than-find-leader-owner-report.json';
const DAILY_CONTEXT={
  ok:true,
  game_type:'find-leader',
  game_version:'find-leader-daily-v1',
  challenge_day:'2026-07-21',
  challenge_key:'find-leader:2026-07-21',
  seed:'canonical-find-leader-proof-seed',
  max_score:10,
  timezone:'America/Chicago'
};
const report={passed:false,stage:'static-contract',production:null,peer:null,recovery:null,error:null};
let browser;

const index=fs.readFileSync('index.html','utf8');
const source=fs.readFileSync('assets/js/better-than-standalone-share.js','utf8');
const findLeader=fs.readFileSync('assets/js/find-leader.js','utf8');
const playDaily=fs.readFileSync('assets/js/play-daily-find-leader.js','utf8');
const currentVersion=findLeader.match(/const VERSION='([^']+)'/)?.[1]||'';

assert(currentVersion,'Current Find the Leader version could not be identified.');
assert(index.indexOf('assets/js/find-leader.js')>=0,'Production manifest must explicitly load Find the Leader.');
assert(index.indexOf('assets/js/better-than-standalone-share.js')>=0,'Production manifest must load Better Than sharing support.');
assert(index.indexOf('assets/js/find-leader.js')<index.indexOf('assets/js/better-than-standalone-share.js'),'The Find the Leader owner must load before Better Than compatibility.');
assert.doesNotMatch(source,/FIND_LEADER_VERSION/,'Better Than compatibility must not maintain a competing Find the Leader version requirement.');
assert.doesNotMatch(source,/UFC_FIND_LEADER\?\.version\s*!==/,'A valid manifest-owned Find the Leader must not be replaced because of a compatibility-layer version comparison.');
assert.doesNotMatch(source,/patchBalancedDailySetup/,'Better Than compatibility must not replace the canonical daily setup owner.');
assert.doesNotMatch(source,/play-daily-rotation\.js/,'Better Than compatibility must not load a competing daily rotation owner.');
assert.doesNotMatch(source,/play-daily-leaderboard\.js/,'Better Than compatibility must not load a competing daily leaderboard owner.');
assert.doesNotMatch(playDaily,/game\.dailySetup\s*=/,'The Play presentation layer must consume, not replace, the canonical Find the Leader daily setup.');
assert.match(findLeader,/function dailySetup\(context=\{\}\)\{[\s\S]*bank\.scheduledDefinition\(scheduleDay\)[\s\S]*dailySetupCache/,'Find the Leader must own and cache the scheduled daily board.');
assert.match(source,/if\(!window\.UFC_FIND_LEADER\)\{[\s\S]*data-find-leader-owner-recovery[\s\S]*\}else gameReady\(\);/,'The fallback must run only when the manifest owner is absent.');
assert(source.includes(`assets/js/find-leader.js?v=${currentVersion}`),'The missing-owner recovery must request the current manifest-owned Find the Leader build.');

const supabaseStub=`window.supabase={createClient(){const chain={select(){return chain;},eq(){return chain;},order(){return Promise.resolve({data:[],error:null});},limit(){return Promise.resolve({data:null,error:null});},single(){return Promise.resolve({data:null,error:null});}};return{rpc:async(name)=>name==='play_daily_context'?({data:${JSON.stringify(DAILY_CONTEXT)},error:null}):({data:null,error:null}),from:()=>chain,channel(){return{on(){return this;},subscribe(){return this;}}},removeChannel:async()=>{}};}};`;

async function loadDailyProof(page,url){
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',route=>route.fulfill({status:200,contentType:'application/javascript',body:supabaseStub}));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(context=>Boolean(window.UFC_FIND_LEADER?.dailySetup?.(context)?.questionId),DAILY_CONTEXT,{timeout:60000});
  return await page.evaluate(async context=>{
    const take=setup=>({
      questionId:String(setup?.questionId||''),
      question:String(setup?.question||''),
      statLabel:String(setup?.statLabel||''),
      leaderId:String(setup?.leaderId||''),
      candidateIds:Array.isArray(setup?.candidates)?setup.candidates.map(row=>String(row?.id||'')):[],
      candidateValues:Array.isArray(setup?.candidates)?setup.candidates.map(row=>Number(row?.value)):[],
      dailyChallengeDay:String(setup?.dailyChallengeDay||''),
      dailyChallengeKey:String(setup?.dailyChallengeKey||'')
    });
    const first=take(window.UFC_FIND_LEADER.dailySetup(context));
    window.dispatchEvent(new CustomEvent('ufc-play-hub-ready'));
    window.dispatchEvent(new CustomEvent('ufc-play-daily-rotation-ready'));
    await new Promise(resolve=>setTimeout(resolve,180));
    const second=take(window.UFC_FIND_LEADER.dailySetup(context));
    return{
      first,
      second,
      version:window.UFC_FIND_LEADER?.version||'',
      panels:document.querySelectorAll('#playFindLeaderPanel').length,
      recoveryScripts:document.querySelectorAll('script[data-find-leader-owner-recovery]').length,
      compatibility:document.documentElement.dataset.betterThanStandaloneShare||'',
      scheduleOwner:document.documentElement.getAttribute('data-find-leader-daily-schedule')||''
    };
  },DAILY_CONTEXT);
}

try{
  report.stage='browser-launch';
  browser=await chromium.launch({headless:true});

  report.stage='production-owner';
  const productionContext=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const productionPage=await productionContext.newPage();
  const productionRequests=[];
  productionPage.on('request',request=>{
    const url=new URL(request.url());
    if(url.pathname.endsWith('/assets/js/find-leader.js'))productionRequests.push(request.url());
  });
  report.production=await loadDailyProof(productionPage,`${ORIGIN}/index.html?phase5=find-leader-owner#home`);
  report.production.requests=productionRequests;
  assert.equal(productionRequests.length,1,'Healthy production startup must request the explicit Find the Leader owner exactly once.');
  assert.equal(report.production.version,currentVersion,'Better Than compatibility must retain the current manifest-owned Find the Leader.');
  assert.equal(report.production.panels,1,'Healthy production startup must retain one Find the Leader panel.');
  assert.equal(report.production.recoveryScripts,0,'Healthy production startup must not inject the missing-owner recovery script.');
  assert.deepEqual(report.production.first,report.production.second,'Late Play events must not change today’s question or board on the same device.');

  report.stage='cross-device-daily-board';
  const peerContext=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,isMobile:false,hasTouch:false});
  const peerPage=await peerContext.newPage();
  report.peer=await loadDailyProof(peerPage,`${ORIGIN}/index.html?phase5=find-leader-peer#play`);
  assert.deepEqual(report.peer.first,report.peer.second,'Today’s board must remain stable on the second device.');
  assert.deepEqual(report.peer.first,report.production.first,'Two clean devices must receive the exact same question, leader, fighter order, and values.');
  assert.equal(report.peer.version,currentVersion,'The peer device must use the same canonical Find the Leader owner.');
  await peerContext.close();
  await productionContext.close();

  report.stage='missing-owner-recovery';
  const recoveryContext=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const recoveryPage=await recoveryContext.newPage();
  const recoveryRequests=[];
  const fixture=`<!doctype html><html><head><meta charset="utf-8"><title>Find the Leader owner recovery</title></head><body>
    <section id="play"><div class="play-shell"><article class="play-game-card" data-open-game="find-leader"><div class="play-game-copy"><small>Find the leader</small></div></article></div></section>
    <script>window.__FIND_LEADER_RECOVERY_PROOF__={photoSyncs:0};window.UFC_PLAY_PHOTO_AUTHORITY={sync(){window.__FIND_LEADER_RECOVERY_PROOF__.photoSyncs+=1;}};window.UFC_PLAY_SHARED={dailyContext:{challenge_day:'proof'}};</script>
    <script src="/assets/js/better-than-standalone-share.js"></script>
  </body></html>`;
  await recoveryPage.route(`${ORIGIN}/better-than-find-leader-owner-proof.html`,route=>route.fulfill({status:200,contentType:'text/html',body:fixture}));
  for(const pattern of [
    '**/assets/data/find-leader-record-book-data.js*',
    '**/assets/data/find-leader-question-bank.js*',
    '**/assets/js/find-leader-standalone-share.js*',
    '**/assets/js/play-daily-polish.js*',
    '**/assets/js/play-community-picks.js*',
    '**/assets/js/play-daily-find-leader.js*'
  ])await recoveryPage.route(pattern,route=>route.fulfill({status:200,contentType:'application/javascript',body:''}));
  await recoveryPage.route('**/assets/js/find-leader.js*',route=>{
    recoveryRequests.push(route.request().url());
    route.fulfill({status:200,contentType:'application/javascript',body:`window.UFC_FIND_LEADER={version:${JSON.stringify(currentVersion)}};document.documentElement.dataset.findLeader=${JSON.stringify(currentVersion)};`});
  });
  await recoveryPage.goto(`${ORIGIN}/better-than-find-leader-owner-proof.html`,{waitUntil:'domcontentloaded',timeout:60000});
  await recoveryPage.waitForFunction(()=>window.UFC_FIND_LEADER&&document.querySelector('script[data-find-leader-owner-recovery]')?.dataset.loaded==='true',null,{timeout:10000});
  report.recovery=await recoveryPage.evaluate(()=>({
    version:window.UFC_FIND_LEADER?.version||'',
    recoveryScripts:document.querySelectorAll('script[data-find-leader-owner-recovery]').length,
    photoSyncs:window.__FIND_LEADER_RECOVERY_PROOF__?.photoSyncs||0,
    compatibility:document.documentElement.dataset.betterThanStandaloneShare||''
  }));
  report.recovery.requests=recoveryRequests;
  assert.equal(recoveryRequests.length,1,'An absent manifest owner must trigger one bounded Find the Leader recovery request.');
  assert.equal(report.recovery.version,currentVersion,'The recovery path must publish the current Find the Leader owner.');
  assert.equal(report.recovery.recoveryScripts,1,'The recovery fixture must contain one bounded recovery script.');
  assert(report.recovery.photoSyncs>=1,'Recovery must preserve the photo-authority synchronization handoff.');
  await recoveryContext.close();

  report.passed=true;
  report.stage='complete';
  console.log('Better Than Find the Leader manifest and canonical daily ownership proof passed.');
}catch(error){
  report.error={message:error?.message||String(error),stack:error?.stack||null};
  throw error;
}finally{
  fs.writeFileSync(REPORT,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}

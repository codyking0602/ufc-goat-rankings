import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

await import('./test-native-pull-refresh-ownership-contract.mjs');

const fixtureUrl='http://127.0.0.1:4173/native-pull-refresh-ownership-proof.html';
const reportPath='/tmp/native-pull-refresh-ownership-report.json';
const report={proof:'native-pull-refresh-ownership',phase:'launch',scenarios:{}};

const fixture=`<!doctype html>
<html><head><meta charset="utf-8"><title>Native pull refresh ownership</title></head>
<body>
  <header class="hero"></header>
  <nav class="tabs"><button type="button" data-destination="war-room" aria-disabled="false">War Room</button></nav>
  <main class="shell"><section id="home" class="view active-view"></section><section id="octagon" class="view"></section></main>
  <div id="picksProgress"><div class="picks-progress-top"><strong>0 / 0</strong></div></div>
  <script>
  (function(){
    let destination='home';
    const counts={quickSync:0,daily:0,leaderboard:0,inbox:0,settings:0,activity:0,board:0,home:0,softRefresh:0,haptics:0};
    const proof=window.__NATIVE_PULL_PROOF__={
      counts,
      delayMs:0,
      reset(){Object.keys(counts).forEach(key=>{counts[key]=0;});this.delayMs=0;},
      setDestination(value){destination=value;},
      installWatcher(delay=0){
        this.delayMs=delay;
        window.UFC_APP_UPDATE_WATCHER={quickSync:()=>this.call('quickSync')};
      },
      removeWatcher(){window.UFC_APP_UPDATE_WATCHER=null;},
      call(name){
        counts[name]+=1;
        const delay=Number(this.delayMs)||0;
        return delay?new Promise(resolve=>setTimeout(resolve,delay)):Promise.resolve({ok:true});
      }
    };
    Object.defineProperty(window,'matchMedia',{configurable:true,value:()=>({matches:true,addEventListener(){},removeEventListener(){}})});
    Object.defineProperty(navigator,'vibrate',{configurable:true,value:()=>{counts.haptics+=1;return true;}});
    Object.defineProperty(navigator,'setAppBadge',{configurable:true,value:async()=>{}});
    Object.defineProperty(navigator,'clearAppBadge',{configurable:true,value:async()=>{}});
    window.UFC_APP_SHELL={
      get currentDestination(){return destination;},
      activateDestination(value){destination=value;return true;}
    };
    window.UFC_PLAY_DAILY_SERVICE={recoverCurrentDay:()=>proof.call('daily')};
    window.UFC_DAILY_LEADERBOARD_LIVE={check:()=>proof.call('leaderboard')};
    window.UFC_PROFILE_CHALLENGES={unreadCount:2,loadInbox:()=>proof.call('inbox')};
    window.UFC_APP_NOTIFICATIONS={loadSettings:()=>proof.call('settings')};
    window.UFC_OCTAGON_NOTIFICATIONS={unread:3,refreshStatus:()=>proof.call('activity')};
    window.UFC_OCTAGON_BOARD={load:()=>proof.call('board')};
    window.UFC_HOME_DASHBOARD={render(){counts.home+=1;}};
    window.addEventListener('octagon-hq:soft-refresh',()=>{counts.softRefresh+=1;});
  })();
  </script>
  <script src="/assets/js/native-app-shell.js"></script>
</body></html>`;

async function openPage(browser){
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.route(`${fixtureUrl}*`,route=>route.fulfill({status:200,contentType:'text/html',body:fixture}));
  await page.goto(fixtureUrl,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_NATIVE_APP_SHELL&&window.__NATIVE_PULL_PROOF__,null,{timeout:10000});
  return{context,page};
}

async function snapshot(page){
  return page.evaluate(()=>({
    counts:{...window.__NATIVE_PULL_PROOF__.counts},
    version:window.UFC_NATIVE_APP_SHELL.version,
    destination:window.UFC_APP_SHELL.currentDestination,
    refreshing:document.documentElement.dataset.nativeRefreshing||'',
    label:document.querySelector('[data-native-pull-refresh] span')?.textContent||'',
    complete:document.querySelector('[data-native-pull-refresh]')?.classList.contains('complete')===true,
    bottomNav:document.querySelectorAll('[data-native-bottom-nav]').length,
    askAction:document.querySelectorAll('[data-native-ask]').length
  }));
}

function assertCompleted(value,stage){
  assert.match(value.version,/single-activity-refresh/,`${stage}: corrected native runtime did not load.`);
  assert.equal(value.refreshing,'',`${stage}: native refreshing state did not clear.`);
  assert.equal(value.label,'Updated just now',`${stage}: pull-to-refresh completion copy changed.`);
  assert.equal(value.complete,true,`${stage}: pull-to-refresh completion state changed.`);
  assert.equal(value.bottomNav,1,`${stage}: native bottom navigation changed.`);
  assert.equal(value.askAction,1,`${stage}: native Ask action changed.`);
}

const browser=await chromium.launch({headless:true});
try{
  report.phase='watcher-path';
  {
    const {context,page}=await openPage(browser);
    await page.evaluate(()=>window.__NATIVE_PULL_PROOF__.installWatcher());
    await page.evaluate(()=>window.UFC_NATIVE_APP_SHELL.refresh());
    const value=await snapshot(page);
    report.scenarios.watcher=value;
    assert.equal(value.counts.quickSync,1,'Watcher path did not use the canonical quick-sync owner exactly once.');
    assert.equal(value.counts.activity,1,'Watcher path did not perform exactly one final activity refresh.');
    for(const key of ['daily','leaderboard','inbox','settings','board','home','softRefresh'])assert.equal(value.counts[key],0,`Watcher path unexpectedly entered fallback ${key}.`);
    assertCompleted(value,'watcher path');
    await context.close();
  }

  report.phase='fallback-home';
  {
    const {context,page}=await openPage(browser);
    await page.evaluate(()=>window.__NATIVE_PULL_PROOF__.removeWatcher());
    await page.evaluate(()=>window.UFC_NATIVE_APP_SHELL.refresh());
    const value=await snapshot(page);
    report.scenarios.fallbackHome=value;
    assert.equal(value.counts.quickSync,0);
    for(const key of ['daily','leaderboard','inbox','settings','home','softRefresh','activity'])assert.equal(value.counts[key],1,`Home fallback ${key} did not run exactly once.`);
    assert.equal(value.counts.board,0,'Home fallback unexpectedly refreshed the War Room board.');
    assertCompleted(value,'home fallback');
    await context.close();
  }

  report.phase='fallback-war-room';
  {
    const {context,page}=await openPage(browser);
    await page.evaluate(()=>{
      window.__NATIVE_PULL_PROOF__.removeWatcher();
      window.__NATIVE_PULL_PROOF__.setDestination('war-room');
    });
    await page.evaluate(()=>window.UFC_NATIVE_APP_SHELL.refresh());
    const value=await snapshot(page);
    report.scenarios.fallbackWarRoom=value;
    assert.equal(value.counts.board,1,'War Room fallback did not retain one silent board refresh.');
    assert.equal(value.counts.activity,1,'War Room fallback performed zero or multiple final activity refreshes.');
    assert.equal(value.counts.softRefresh,1,'War Room fallback did not publish one soft-refresh event.');
    assertCompleted(value,'War Room fallback');
    await context.close();
  }

  report.phase='concurrent-accepted-action';
  {
    const {context,page}=await openPage(browser);
    await page.evaluate(async()=>{
      window.__NATIVE_PULL_PROOF__.installWatcher(120);
      const first=window.UFC_NATIVE_APP_SHELL.refresh();
      const second=window.UFC_NATIVE_APP_SHELL.refresh();
      await Promise.all([first,second]);
    });
    const value=await snapshot(page);
    report.scenarios.concurrent=value;
    assert.equal(value.counts.quickSync,1,'Concurrent accepted pull calls started multiple quick-sync owners.');
    assert.equal(value.counts.activity,1,'Concurrent accepted pull calls started multiple activity refreshes.');
    assertCompleted(value,'concurrent accepted action');
    await context.close();
  }

  report.phase='complete';
  report.passed=true;
  console.log(JSON.stringify(report,null,2));
}catch(error){
  report.passed=false;
  report.error={name:error?.name||'Error',message:error?.message||String(error),stack:error?.stack||''};
  fs.writeFileSync(reportPath,JSON.stringify(report,null,2));
  throw error;
}finally{
  await browser.close();
}

import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

await import('./test-octagon-notification-startup-retry-contract.mjs');

const fixtureUrl='http://127.0.0.1:4173/phase-4-octagon-notification-startup-proof.html';
const reportPath='/tmp/octagon-notification-startup-retry-report.json';
const report={proof:'octagon-notification-startup-retry-owner',phase:'launch',scenarios:{}};

const identity={groupCode:'GOAT26',memberToken:'notification-startup-token',member:{id:'m1',display_name:'Cody'}};
const status={ok:true,can_access:true,unread_count:3,vapid_public_key:'',member:{id:'m1',display_name:'Cody'}};

function fixture({cached=false}={}){
  return `<!doctype html><html><head><meta charset="utf-8"><title>Notification startup retry proof</title></head><body>
  <button type="button" data-octagon-beta-tab aria-disabled="false">War Room</button>
  <section id="octagon"><section data-octagon-board><header class="octagon-board-head"><div class="octagon-board-head-actions"><button type="button" data-octagon-refresh>Refresh</button></div></header></section></section>
  <script>
  (function(){
    const identity=${JSON.stringify(identity)};
    const status=${JSON.stringify(status)};
    const proof=window.__OCTAGON_STARTUP_PROOF__={rpcs:[],intervals:[],channels:0,identity};
    const channel={on(){return this;},subscribe(){return this;},async unsubscribe(){}};
    const client={
      async rpc(name,args){proof.rpcs.push({name,args,at:Date.now()});if(name==='octagon_activity_status'){await new Promise(resolve=>setTimeout(resolve,20));return{data:structuredClone(status),error:null};}return{data:{ok:true},error:null};},
      channel(){proof.channels+=1;return channel;},
      async removeChannel(){}
    };
    window.UFC_PLAY_PROFILE={identity:${cached?'identity':'null'},client};
    window.UFC_APP_PROFILE={identity:${cached?'identity':'null'}};
    const realSetInterval=window.setInterval.bind(window);
    window.setInterval=(callback,delay)=>{proof.intervals.push({callback,delay});return proof.intervals.length;};
  })();
  </script>
  <script src="/assets/js/octagon-notifications.js"></script>
  </body></html>`;
}

async function open(browser,options){
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.route(`${fixtureUrl}*`,route=>route.fulfill({status:200,contentType:'text/html',body:fixture(options)}));
  await page.goto(fixtureUrl,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_OCTAGON_NOTIFICATIONS&&window.__OCTAGON_STARTUP_PROOF__?.intervals.length===2,null,{timeout:10000});
  return{context,page};
}

async function snapshot(page){
  return page.evaluate(()=>({
    version:window.UFC_OCTAGON_NOTIFICATIONS?.version||'',
    rpcs:window.__OCTAGON_STARTUP_PROOF__.rpcs.map(row=>({...row})),
    intervals:window.__OCTAGON_STARTUP_PROOF__.intervals.map(row=>row.delay),
    unread:window.UFC_OCTAGON_NOTIFICATIONS?.unread||0,
    badges:document.querySelectorAll('[data-octagon-unread-badge]').length,
    badgeText:document.querySelector('[data-octagon-unread-badge]')?.textContent||'',
    badgeHidden:document.querySelector('[data-octagon-unread-badge]')?.hidden,
    alerts:document.querySelectorAll('[data-octagon-alerts]').length,
    alertsHidden:document.querySelector('[data-octagon-alerts]')?.hidden,
    statuses:document.querySelectorAll('[data-octagon-notification-status]').length,
    banners:document.querySelectorAll('[data-octagon-return-banner]').length
  }));
}

const browser=await chromium.launch({headless:true});
try{
  report.phase='uncached-startup-window';
  {
    const {context,page}=await open(browser,{cached:false});
    await page.waitForTimeout(4400);
    const startup=await snapshot(page);
    report.scenarios.uncached=startup;
    assert.equal(startup.version,'octagon-notifications-20260721c-single-startup-status');
    assert.equal(startup.rpcs.filter(row=>row.name==='octagon_activity_status').length,0,'Uncached startup retried activity status without published identity.');
    assert.deepEqual(startup.intervals,[30000,3000],'The separate notification intervals changed.');
    assert.equal(startup.badges,1,'One unread badge shell must remain.');
    assert.equal(startup.alerts,1,'One Alerts shell must remain.');
    assert.equal(startup.statuses,1,'One notification status shell must remain.');
    assert.equal(startup.banners,1,'One return banner shell must remain.');

    await page.evaluate(()=>{
      window.UFC_PLAY_PROFILE.identity=window.__OCTAGON_STARTUP_PROOF__.identity;
      window.UFC_APP_PROFILE.identity=window.__OCTAGON_STARTUP_PROOF__.identity;
      window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:window.__OCTAGON_STARTUP_PROOF__.identity}));
    });
    await page.waitForFunction(()=>window.UFC_OCTAGON_NOTIFICATIONS?.unread===3,null,{timeout:10000});
    const ready=await snapshot(page);
    report.scenarios.readiness=ready;
    assert.equal(ready.rpcs.filter(row=>row.name==='octagon_activity_status').length,1,'Published identity did not start exactly one activity-status request.');
    assert.equal(ready.badgeText,'3');
    assert.equal(ready.badgeHidden,false);
    assert.equal(ready.alertsHidden,false);
    await context.close();
  }

  report.phase='cached-startup-window';
  {
    const {context,page}=await open(browser,{cached:true});
    await page.waitForFunction(()=>window.UFC_OCTAGON_NOTIFICATIONS?.unread===3,null,{timeout:10000});
    await page.waitForTimeout(4400);
    const cached=await snapshot(page);
    report.scenarios.cached=cached;
    assert.equal(cached.rpcs.filter(row=>row.name==='octagon_activity_status').length,1,'Cached startup performed zero or repeated activity-status requests through the former retry window.');
    assert.equal(cached.badgeText,'3');
    assert.equal(cached.badgeHidden,false);
    assert.equal(cached.alertsHidden,false);
    assert.deepEqual(cached.intervals,[30000,3000]);

    await page.evaluate(()=>window.__OCTAGON_STARTUP_PROOF__.intervals.find(row=>row.delay===30000).callback());
    await page.waitForFunction(()=>window.__OCTAGON_STARTUP_PROOF__.rpcs.filter(row=>row.name==='octagon_activity_status').length===2,null,{timeout:10000});
    const polled=await snapshot(page);
    report.scenarios.poll=polled;
    assert.equal(polled.rpcs.filter(row=>row.name==='octagon_activity_status').length,2,'The preserved 30-second status poll no longer refreshes activity status.');
    await context.close();
  }

  report.phase='complete';
  report.passed=true;
  console.log(JSON.stringify(report,null,2));
}catch(error){
  report.passed=false;
  report.error={name:error?.name||'Error',message:error?.message||String(error),stack:error?.stack||''};
  fs.writeFileSync(reportPath,JSON.stringify(report,null,2));
  console.error(JSON.stringify(report,null,2));
  throw error;
}finally{await browser.close();}

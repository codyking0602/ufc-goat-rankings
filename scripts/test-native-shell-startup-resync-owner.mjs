import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

await import('./test-native-shell-startup-resync-contract.mjs');

const fixtureUrl='http://127.0.0.1:4173/phase-4-native-startup-resync-proof.html';
const reportPath='/tmp/native-shell-startup-resync-owner-report.json';
const report={proof:'native-shell-startup-resync-owner',phase:'launch',snapshots:{}};

const fixture=`<!doctype html><html><head><meta charset="utf-8"><title>Native startup resync proof</title></head><body>
<header class="hero"></header>
<nav class="tabs"><button type="button" data-destination="war-room" aria-disabled="false">War Room</button></nav>
<main class="shell"><section id="home" class="view active-view"></section><section id="picks" class="view"><div id="picksProgress"><div class="picks-progress-top"><strong>0 / 0</strong></div></div></section></main>
<script>
(function(){
  let destination='home';
  const proof=window.__NATIVE_STARTUP_RESYNC_PROOF__={badgeWrites:[],intervals:[],setDestination(value){destination=value;}};
  window.UFC_APP_SHELL={get currentDestination(){return destination;},activateDestination(value){destination=value;return true;}};
  window.UFC_PROFILE_CHALLENGES={unreadCount:0};
  window.UFC_OCTAGON_NOTIFICATIONS={unread:0,markSeen(){}};
  Object.defineProperty(window,'matchMedia',{configurable:true,value:()=>({matches:true,addEventListener(){},removeEventListener(){}})});
  Object.defineProperty(navigator,'setAppBadge',{configurable:true,value:async value=>{proof.badgeWrites.push({type:'set',value});}});
  Object.defineProperty(navigator,'clearAppBadge',{configurable:true,value:async()=>{proof.badgeWrites.push({type:'clear',value:0});}});
  window.setInterval=(callback,delay)=>{proof.intervals.push({callback,delay});return proof.intervals.length;};
})();
</script>
<script src="/assets/js/native-app-shell.js"></script>
</body></html>`;

async function snapshot(page){
  return page.evaluate(()=>({
    version:window.UFC_NATIVE_APP_SHELL?.version||'',
    badgeWrites:window.__NATIVE_STARTUP_RESYNC_PROOF__.badgeWrites.map(row=>({...row})),
    intervals:window.__NATIVE_STARTUP_RESYNC_PROOF__.intervals.map(row=>row.delay),
    bottomNav:document.querySelectorAll('[data-native-bottom-nav]').length,
    askAction:document.querySelectorAll('[data-native-ask]').length,
    pullIndicator:document.querySelectorAll('[data-native-pull-refresh]').length,
    active:[...document.querySelectorAll('[data-native-destination].active')].map(node=>node.dataset.nativeDestination),
    badges:Object.fromEntries([...document.querySelectorAll('[data-native-badge]')].map(node=>[node.dataset.nativeBadge,{text:node.textContent,hidden:node.hidden}]))
  }));
}

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.route(`${fixtureUrl}*`,route=>route.fulfill({status:200,contentType:'text/html',body:fixture}));
  await page.goto(fixtureUrl,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_NATIVE_APP_SHELL&&window.__NATIVE_STARTUP_RESYNC_PROOF__?.badgeWrites.length>0,null,{timeout:10000});

  report.phase='initial-start';
  const initial=await snapshot(page);
  report.snapshots.initial=initial;
  assert.equal(initial.version,'native-app-shell-20260721c-no-delayed-startup-resync');
  assert.equal(initial.bottomNav,1,'Initial startup did not create exactly one bottom navigation.');
  assert.equal(initial.askAction,1,'Initial startup did not create exactly one Ask action.');
  assert.equal(initial.pullIndicator,1,'Initial startup did not create exactly one pull indicator.');
  assert.deepEqual(initial.active,['home'],'Initial native route state did not match the canonical Home destination.');
  assert.deepEqual(initial.intervals,[10000],'The separate 10-second badge poll changed or duplicated.');
  assert.equal(initial.badgeWrites.length,1,'Initial startup performed multiple app-badge synchronizations.');

  report.phase='retired-delay-window';
  await page.waitForTimeout(4400);
  const delayed=await snapshot(page);
  report.snapshots.delayed=delayed;
  assert.equal(delayed.bottomNav,1,'Retired startup passes duplicated the bottom navigation.');
  assert.equal(delayed.askAction,1,'Retired startup passes duplicated the Ask action.');
  assert.equal(delayed.pullIndicator,1,'Retired startup passes duplicated the pull indicator.');
  assert.equal(delayed.badgeWrites.length,initial.badgeWrites.length,'Unconditional startup badge work continued through the retired 4.2-second window.');
  assert.deepEqual(delayed.active,['home'],'Unconditional startup route work changed the active destination.');

  report.phase='owner-events-and-observation';
  await page.evaluate(()=>{
    window.UFC_PROFILE_CHALLENGES.unreadCount=2;
    window.dispatchEvent(new CustomEvent('ufc-profile-challenges-updated'));
  });
  await page.waitForFunction(()=>document.querySelector('[data-native-badge="play"]')?.textContent==='2',null,{timeout:10000});
  await page.evaluate(()=>{document.querySelector('#picksProgress strong').textContent='1 / 4';});
  await page.waitForFunction(()=>document.querySelector('[data-native-badge="picks"]')?.textContent==='3',null,{timeout:10000});
  await page.evaluate(()=>{
    window.UFC_OCTAGON_NOTIFICATIONS.unread=4;
    const badge=document.createElement('span');badge.dataset.octagonUnreadBadge='true';badge.textContent='4';
    document.querySelector('[data-destination="war-room"]').appendChild(badge);
  });
  await page.waitForFunction(()=>document.querySelector('[data-native-badge="war-room"]')?.textContent==='4',null,{timeout:10000});
  const ownerUpdates=await snapshot(page);
  report.snapshots.ownerUpdates=ownerUpdates;
  assert.equal(ownerUpdates.badges.play.hidden,false,'Challenge owner event did not update the native Play badge.');
  assert.equal(ownerUpdates.badges.picks.hidden,false,'Picks progress mutation did not update the native Picks badge.');
  assert.equal(ownerUpdates.badges['war-room'].hidden,false,'War Room unread-badge mutation did not update the native badge.');

  report.phase='canonical-route-event';
  await page.evaluate(()=>{
    window.__NATIVE_STARTUP_RESYNC_PROOF__.setDestination('picks');
    window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:'picks'}}));
  });
  await page.waitForFunction(()=>document.querySelector('[data-native-destination="picks"]')?.classList.contains('active'),null,{timeout:10000});
  const routed=await snapshot(page);
  report.snapshots.routed=routed;
  assert.deepEqual(routed.active,['picks'],'Canonical route event no longer owns late native route synchronization.');

  report.phase='separate-live-poll';
  await page.evaluate(()=>{
    window.UFC_PROFILE_CHALLENGES.unreadCount=5;
    window.__NATIVE_STARTUP_RESYNC_PROOF__.intervals.find(row=>row.delay===10000).callback();
  });
  await page.waitForFunction(()=>document.querySelector('[data-native-badge="play"]')?.textContent==='5',null,{timeout:10000});
  const polled=await snapshot(page);
  report.snapshots.polled=polled;
  assert.equal(polled.badges.play.hidden,false,'The preserved live badge poll no longer updates late state.');

  report.phase='complete';
  report.passed=true;
  console.log(JSON.stringify(report,null,2));
  await context.close();
}catch(error){
  report.passed=false;
  report.error={name:error?.name||'Error',message:error?.message||String(error),stack:error?.stack||''};
  fs.writeFileSync(reportPath,JSON.stringify(report,null,2));
  console.error(JSON.stringify(report,null,2));
  throw error;
}finally{await browser.close();}

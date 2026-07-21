import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

await import('./test-native-shell-stability-whats-new-contract.mjs');

const fixtureUrl='http://127.0.0.1:4173/phase-3-whats-new-owner-proof.html#home';
const reportPath='/tmp/native-shell-stability-whats-new-owner-report.json';
const report={proof:'native-shell-stability-whats-new-owner',phase:'launch',snapshots:{}};

const fixture=`<!doctype html>
<html><head><meta charset="utf-8"><meta name="app-build" content="phase-3-proof"><title>Phase 3 What’s New ownership</title></head>
<body>
  <header class="hero"><h1>Octagon HQ</h1></header>
  <nav><button id="nativeRankings" type="button" data-native-destination="rankings">Rankings</button></nav>
  <main class="shell"><section id="home" class="view active-view"></section></main>
  <aside id="drawer" aria-hidden="true"><button id="closeDrawer" type="button">Close</button></aside>
  <script>
  (function(){
    const counts={controlWrites:0,buttonWrites:0,openCalls:0};
    const inner=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');
    Object.defineProperty(Element.prototype,'innerHTML',{
      configurable:true,
      get(){return inner.get.call(this);},
      set(value){
        if(this.id==='manualRefreshControl')counts.controlWrites+=1;
        if(this.id==='whatsNewBtn')counts.buttonWrites+=1;
        return inner.set.call(this,value);
      }
    });
    window.__PHASE3_WHATS_NEW_PROOF__={counts};
    window.OCTAGON_CHANGELOG={
      seenStorageKey:'phase3-whats-new-seen',
      entries:[{id:'one'},{id:'two'},{id:'three'}]
    };
    localStorage.setItem('phase3-whats-new-seen',JSON.stringify(['one']));
    window.UFC_WHAT_CHANGED={open(){counts.openCalls+=1;}};
    window.scrollTo=()=>{};
    document.getElementById('closeDrawer').addEventListener('click',()=>{
      const drawer=document.getElementById('drawer');
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden','true');
    });
  })();
  </script>
  <script src="/assets/js/app-update-watcher.js"></script>
  <script src="/assets/js/native-app-shell-stability.js"></script>
</body></html>`;

async function snapshot(page){
  return page.evaluate(()=>({
    counts:{...window.__PHASE3_WHATS_NEW_PROOF__.counts},
    watcherVersion:window.UFC_APP_UPDATE_WATCHER?.version||'',
    stabilityVersion:window.UFC_NATIVE_APP_SHELL_STABILITY?.version||'',
    controls:document.querySelectorAll('#manualRefreshControl').length,
    buttons:document.querySelectorAll('#whatsNewBtn').length,
    labels:document.querySelectorAll('#whatsNewBtn [data-whats-new-label]').length,
    labelText:document.querySelector('#whatsNewBtn [data-whats-new-label]')?.textContent||'',
    badges:document.querySelectorAll('#whatsNewUnread').length,
    badgeText:document.getElementById('whatsNewUnread')?.textContent||'',
    badgeHidden:document.getElementById('whatsNewUnread')?.hidden??null,
    hasUnread:document.getElementById('whatsNewBtn')?.classList.contains('has-unread')||false,
    buttonLabel:document.getElementById('whatsNewBtn')?.getAttribute('aria-label')||'',
    drawerOpen:document.getElementById('drawer')?.classList.contains('open')||false,
    bodyOpen:document.body.classList.contains('fighter-profile-open')
  }));
}

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.route('**/phase-3-whats-new-owner-proof.html*',route=>route.fulfill({status:200,contentType:'text/html',body:fixture}));
  await page.goto(fixtureUrl,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_APP_UPDATE_WATCHER&&window.UFC_NATIVE_APP_SHELL_STABILITY&&document.getElementById('whatsNewUnread')?.textContent==='2',null,{timeout:10000});

  report.phase='canonical-startup';
  const cold=await snapshot(page);
  report.snapshots.cold=cold;
  assert.match(cold.watcherVersion,/whats-new-owner/,'The corrected canonical update watcher did not load.');
  assert.match(cold.stabilityVersion,/whats-new-owner/,'The corrected subordinate stability runtime did not load.');
  assert.equal(cold.controls,1,'Canonical startup must create exactly one update control.');
  assert.equal(cold.buttons,1,'Canonical startup must create exactly one What’s New button.');
  assert.equal(cold.labels,1,'Canonical startup must create exactly one labeled NEW node.');
  assert.equal(cold.labelText,'NEW','Canonical startup rendered the wrong button label.');
  assert.equal(cold.badges,1,'Canonical startup must create exactly one unread badge.');
  assert.equal(cold.badgeText,'2','Canonical unread state rendered the wrong count.');
  assert.equal(cold.badgeHidden,false,'Unread badge should be visible for unseen entries.');
  assert.equal(cold.hasUnread,true,'Unread visual state was not applied by the canonical owner.');
  assert.equal(cold.buttonLabel,'Open What Changed, 2 unread updates','Canonical accessibility state is incorrect.');
  assert.equal(cold.counts.controlWrites,1,'What’s New markup must be created through one canonical control write.');
  assert.equal(cold.counts.buttonWrites,0,'The stability layer rewrote the canonical button during startup.');

  report.phase='route-observer-and-delayed-window';
  await page.evaluate(()=>{
    const noise=document.createElement('span');
    noise.textContent='hero noise';
    document.querySelector('.hero').appendChild(noise);
    noise.remove();
    for(let index=0;index<3;index+=1){
      window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:index%2?'home':'rankings'}}));
      window.dispatchEvent(new CustomEvent('octagon-hq:soft-refresh'));
      window.UFC_NATIVE_APP_SHELL_STABILITY.schedule();
    }
  });
  await page.waitForTimeout(3900);
  const delayed=await snapshot(page);
  report.snapshots.delayed=delayed;
  assert.equal(delayed.controls,1,'Route, observer, or delayed work duplicated the update control.');
  assert.equal(delayed.buttons,1,'Route, observer, or delayed work duplicated the What’s New button.');
  assert.equal(delayed.labels,1,'Route, observer, or delayed work changed the canonical label structure.');
  assert.equal(delayed.counts.controlWrites,1,'Delayed stability work recreated canonical update markup.');
  assert.equal(delayed.counts.buttonWrites,0,'Delayed stability work rewrote the What’s New button.');

  report.phase='canonical-unread-events';
  await page.evaluate(()=>{
    localStorage.setItem('phase3-whats-new-seen',JSON.stringify(['one','two','three']));
    window.dispatchEvent(new CustomEvent('octagon-hq:what-changed-seen'));
  });
  await page.waitForFunction(()=>document.getElementById('whatsNewUnread')?.hidden===true,null,{timeout:10000});
  const seen=await snapshot(page);
  report.snapshots.seen=seen;
  assert.equal(seen.badgeText,'0','Seen-event synchronization did not update the unread count.');
  assert.equal(seen.badgeHidden,true,'Seen-event synchronization did not hide the badge.');
  assert.equal(seen.hasUnread,false,'Seen-event synchronization did not clear the unread visual state.');
  assert.equal(seen.counts.buttonWrites,0,'Unread synchronization rewrote the canonical button markup.');

  await page.evaluate(()=>{
    localStorage.setItem('phase3-whats-new-seen',JSON.stringify(['one']));
    window.dispatchEvent(new StorageEvent('storage',{key:'phase3-whats-new-seen'}));
  });
  await page.waitForFunction(()=>document.getElementById('whatsNewUnread')?.textContent==='2'&&!document.getElementById('whatsNewUnread')?.hidden,null,{timeout:10000});
  const storage=await snapshot(page);
  report.snapshots.storage=storage;
  assert.equal(storage.badgeText,'2','Storage-event synchronization did not restore the unread count.');
  assert.equal(storage.counts.buttonWrites,0,'Storage-event synchronization rewrote the canonical button markup.');

  report.phase='canonical-click-binding';
  await page.click('#whatsNewBtn');
  await page.waitForFunction(()=>window.__PHASE3_WHATS_NEW_PROOF__.counts.openCalls===1,null,{timeout:10000});
  const clicked=await snapshot(page);
  report.snapshots.clicked=clicked;
  assert.equal(clicked.counts.openCalls,1,'The canonical owner did not retain the What Changed click binding.');
  assert.equal(clicked.counts.buttonWrites,0,'Opening What Changed rewrote the trigger markup.');

  report.phase='retired-repair-boundary';
  await page.evaluate(()=>{
    document.querySelector('[data-whats-new-label]').textContent='BROKEN';
    window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:'home'}}));
    window.dispatchEvent(new CustomEvent('octagon-hq:soft-refresh'));
    window.UFC_NATIVE_APP_SHELL_STABILITY.schedule();
  });
  await page.waitForTimeout(250);
  const corrupted=await snapshot(page);
  report.snapshots.corrupted=corrupted;
  assert.equal(corrupted.labelText,'BROKEN','The stability layer still reclaims canonical What’s New markup.');
  assert.equal(corrupted.counts.buttonWrites,0,'The retired normalization repair still writes the button.');

  report.phase='canonical-refresh';
  await page.reload({waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_APP_UPDATE_WATCHER&&window.UFC_NATIVE_APP_SHELL_STABILITY&&document.querySelector('[data-whats-new-label]')?.textContent==='NEW',null,{timeout:10000});
  const refreshed=await snapshot(page);
  report.snapshots.refreshed=refreshed;
  assert.equal(refreshed.controls,1,'Refresh duplicated the update control.');
  assert.equal(refreshed.buttons,1,'Refresh duplicated the What’s New button.');
  assert.equal(refreshed.labels,1,'Refresh did not restore the canonical label structure.');
  assert.equal(refreshed.counts.controlWrites,1,'Refresh must perform one canonical control write.');
  assert.equal(refreshed.counts.buttonWrites,0,'Refresh revived the retired button rewrite.');

  report.phase='retained-drawer-recovery';
  await page.evaluate(()=>{
    const drawer=document.getElementById('drawer');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
    window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:'rankings'}}));
  });
  await page.waitForFunction(()=>document.body.classList.contains('fighter-profile-open'),null,{timeout:10000});
  await page.click('#nativeRankings');
  await page.waitForFunction(()=>!document.getElementById('drawer').classList.contains('open')&&!document.body.classList.contains('fighter-profile-open'),null,{timeout:10000});
  const closed=await snapshot(page);
  report.snapshots.closed=closed;
  assert.equal(closed.drawerOpen,false,'Retiring What’s New normalization broke native profile dismissal.');
  assert.equal(closed.bodyOpen,false,'Retiring What’s New normalization left stale drawer body state.');

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
}finally{
  await browser.close();
}

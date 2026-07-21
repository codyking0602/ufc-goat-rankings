import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

await import('./test-native-shell-stability-drawer-contract.mjs');

const fixtureUrl='http://127.0.0.1:4173/phase-3-drawer-owner-proof.html#rankings';
const reportPath='/tmp/native-shell-stability-drawer-owner-report.json';
const report={proof:'native-shell-stability-drawer-owner',phase:'launch',snapshots:{}};

const fixture=`<!doctype html>
<html><head><meta charset="utf-8"><title>Phase 3 drawer ownership</title></head>
<body class="fighter-profile-open">
  <header class="hero"><h1>Octagon HQ</h1></header>
  <nav><button id="nativeHome" type="button" data-native-destination="home">Home</button></nav>
  <main class="shell"><section id="men" class="view active-view"></section></main>
  <aside id="drawer" class="drawer" aria-hidden="true"><div class="drawer-panel"><button id="closeDrawer" type="button">Close</button></div></aside>
  <script>
  (function(){
    const counts={closeClicks:0};
    window.__PHASE3_DRAWER_PROOF__={counts};
    document.getElementById('closeDrawer').addEventListener('click',()=>{
      counts.closeClicks+=1;
      const drawer=document.getElementById('drawer');
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden','true');
    });
  })();
  </script>
  <script src="/assets/js/native-app-shell-stability.js"></script>
</body></html>`;

async function snapshot(page){
  return page.evaluate(()=>({
    version:window.UFC_NATIVE_APP_SHELL_STABILITY?.version||'',
    publicSchedule:typeof window.UFC_NATIVE_APP_SHELL_STABILITY?.schedule,
    drawerOpen:document.getElementById('drawer')?.classList.contains('open')||false,
    drawerAria:document.getElementById('drawer')?.getAttribute('aria-hidden')||'',
    bodyOpen:document.body.classList.contains('fighter-profile-open'),
    closeClicks:window.__PHASE3_DRAWER_PROOF__?.counts.closeClicks||0
  }));
}

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.route('**/phase-3-drawer-owner-proof.html*',route=>route.fulfill({status:200,contentType:'text/html',body:fixture}));
  await page.goto(fixtureUrl,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_NATIVE_APP_SHELL_STABILITY,null,{timeout:10000});
  await page.waitForFunction(()=>!document.body.classList.contains('fighter-profile-open'),null,{timeout:10000});

  report.phase='one-time-startup-sync';
  const cold=await snapshot(page);
  report.snapshots.cold=cold;
  assert.match(cold.version,/drawer-observer/,'The narrowed drawer stability runtime did not load.');
  assert.equal(cold.publicSchedule,'undefined','The historical public repair schedule remains exposed.');
  assert.equal(cold.drawerOpen,false,'The startup fixture must begin with the drawer closed.');
  assert.equal(cold.drawerAria,'true','The startup fixture must begin accessibility-hidden.');
  assert.equal(cold.bodyOpen,false,'One startup sync did not clear stale mobile profile body state.');

  report.phase='real-drawer-open-mutation';
  await page.evaluate(()=>{
    const drawer=document.getElementById('drawer');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
  });
  await page.waitForFunction(()=>document.body.classList.contains('fighter-profile-open'),null,{timeout:10000});
  const opened=await snapshot(page);
  report.snapshots.opened=opened;
  assert.equal(opened.drawerOpen,true,'The canonical drawer mutation did not open the drawer.');
  assert.equal(opened.drawerAria,'false','The canonical drawer mutation did not publish accessibility state.');
  assert.equal(opened.bodyOpen,true,'The drawer-only observer did not apply mobile scroll lock.');

  report.phase='retired-broad-trigger-window';
  await page.evaluate(()=>{
    document.body.classList.remove('fighter-profile-open');
    const noise=document.createElement('span');
    noise.textContent='unrelated body mutation';
    document.querySelector('.hero').appendChild(noise);
    noise.remove();
    window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:'home'}}));
    window.dispatchEvent(new CustomEvent('octagon-hq:soft-refresh'));
  });
  await page.waitForTimeout(3900);
  const retired=await snapshot(page);
  report.snapshots.retired=retired;
  assert.equal(retired.drawerOpen,true,'The drawer unexpectedly changed during unrelated route and body activity.');
  assert.equal(retired.bodyOpen,false,'A retired broad observer, route listener, or delayed retry still reclaimed body state.');

  report.phase='drawer-only-recovery';
  await page.evaluate(()=>{
    const drawer=document.getElementById('drawer');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden','true');
  });
  await page.waitForFunction(()=>!document.body.classList.contains('fighter-profile-open'),null,{timeout:10000});
  await page.evaluate(()=>{
    const drawer=document.getElementById('drawer');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
  });
  await page.waitForFunction(()=>document.body.classList.contains('fighter-profile-open'),null,{timeout:10000});
  const recovered=await snapshot(page);
  report.snapshots.recovered=recovered;
  assert.equal(recovered.drawerOpen,true,'The real drawer reopen mutation failed.');
  assert.equal(recovered.bodyOpen,true,'The drawer-only observer did not recover mobile body state.');

  report.phase='canonical-close-button';
  await page.click('#closeDrawer');
  await page.waitForFunction(()=>!document.getElementById('drawer').classList.contains('open')&&!document.body.classList.contains('fighter-profile-open'),null,{timeout:10000});
  const closed=await snapshot(page);
  report.snapshots.closed=closed;
  assert.equal(closed.closeClicks,1,'The canonical close button did not retain drawer close ownership.');
  assert.equal(closed.drawerAria,'true','Canonical close did not restore drawer accessibility state.');
  assert.equal(closed.bodyOpen,false,'The drawer-only observer did not clear mobile scroll lock after canonical close.');

  report.phase='native-destination-dismissal';
  await page.evaluate(()=>{
    const drawer=document.getElementById('drawer');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
  });
  await page.waitForFunction(()=>document.body.classList.contains('fighter-profile-open'),null,{timeout:10000});
  await page.click('#nativeHome');
  await page.waitForFunction(()=>!document.getElementById('drawer').classList.contains('open')&&!document.body.classList.contains('fighter-profile-open'),null,{timeout:10000});
  const nativeClosed=await snapshot(page);
  report.snapshots.nativeClosed=nativeClosed;
  assert.equal(nativeClosed.closeClicks,2,'Native destination dismissal did not delegate to the canonical close button.');
  assert.equal(nativeClosed.drawerAria,'true','Native destination dismissal left the drawer exposed to assistive technology.');

  report.phase='native-destination-fallback';
  await page.evaluate(()=>{
    document.getElementById('closeDrawer')?.remove();
    const drawer=document.getElementById('drawer');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
  });
  await page.waitForFunction(()=>document.body.classList.contains('fighter-profile-open'),null,{timeout:10000});
  await page.click('#nativeHome');
  await page.waitForFunction(()=>!document.getElementById('drawer').classList.contains('open')&&!document.body.classList.contains('fighter-profile-open'),null,{timeout:10000});
  const fallback=await snapshot(page);
  report.snapshots.fallback=fallback;
  assert.equal(fallback.closeClicks,2,'Fallback dismissal should not invent a close-button click.');
  assert.equal(fallback.drawerAria,'true','Fallback dismissal did not restore drawer accessibility state.');
  assert.equal(fallback.bodyOpen,false,'Fallback dismissal left stale mobile body state.');

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

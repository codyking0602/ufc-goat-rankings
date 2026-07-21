import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

await import('./test-native-shell-startup-pass-contract.mjs');

const fixtureUrl='http://127.0.0.1:4173/phase-4-native-shell-startup-pass-proof.html';
const reportPath='/tmp/native-shell-startup-pass-owner-report.json';
const report={proof:'native-shell-startup-pass-owner',phase:'launch',snapshots:{}};
const fixture=`<!doctype html><html><head><meta charset="utf-8"><title>Native startup pass proof</title></head><body>
<header class="hero"><div><h1>Octagon HQ</h1></div></header>
<nav class="tabs"><button data-destination="war-room" aria-disabled="true" disabled>War Room</button></nav>
<main class="shell"><section id="home" class="view active-view"></section><section id="picks" class="view"><div id="picksProgress"><div class="picks-progress-top"><strong>1 / 3</strong></div></div></section></main>
<script>
(function(){
  const counts={selectedWrites:0,disabledWrites:0,badgeWrites:0};
  const proof=window.__NATIVE_STARTUP_PASS_PROOF__={counts,destination:'home',playUnread:0,warUnread:0,intervals:[]};
  const setAttribute=Element.prototype.setAttribute;
  Element.prototype.setAttribute=function(name,value){
    if(this.matches?.('[data-native-destination]')&&name==='aria-selected')counts.selectedWrites+=1;
    if(this.matches?.('[data-native-destination="war-room"]')&&name==='aria-disabled')counts.disabledWrites+=1;
    return setAttribute.call(this,name,value);
  };
  const textContent=Object.getOwnPropertyDescriptor(Node.prototype,'textContent');
  Object.defineProperty(Node.prototype,'textContent',{configurable:true,get(){return textContent.get.call(this);},set(value){if(this.nodeType===1&&this.matches?.('[data-native-badge]'))counts.badgeWrites+=1;return textContent.set.call(this,value);}});
  window.setInterval=(callback,delay)=>{proof.intervals.push({callback,delay});return proof.intervals.length;};
  window.UFC_APP_SHELL={get currentDestination(){return proof.destination;},activateDestination(value){proof.destination=value;document.querySelectorAll('main.shell>.view').forEach(node=>node.classList.toggle('active-view',node.id===value));window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:value}}));}};
  window.UFC_PROFILE_CHALLENGES={get unreadCount(){return proof.playUnread;}};
  window.UFC_OCTAGON_NOTIFICATIONS={get unread(){return proof.warUnread;},markSeen(){}};
})();
</script>
<script src="/assets/js/native-app-shell.js"></script>
</body></html>`;

async function snapshot(page){return page.evaluate(()=>({counts:{...window.__NATIVE_STARTUP_PASS_PROOF__.counts},askCount:document.querySelectorAll('[data-native-ask]').length,navCount:document.querySelectorAll('[data-native-bottom-nav]').length,pullCount:document.querySelectorAll('[data-native-pull-refresh]').length,active:[...document.querySelectorAll('[data-native-destination].active')].map(node=>node.dataset.nativeDestination),warDisabled:document.querySelector('[data-native-bottom-nav] [data-native-destination="war-room"]')?.disabled,badges:Object.fromEntries([...document.querySelectorAll('[data-native-badge]')].map(node=>[node.dataset.nativeBadge,node.hidden?'':node.textContent])),version:window.UFC_NATIVE_APP_SHELL?.version||'',intervals:window.__NATIVE_STARTUP_PASS_PROOF__.intervals.map(row=>row.delay)}));}

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.route('**/phase-4-native-shell-startup-pass-proof.html*',route=>route.fulfill({status:200,contentType:'text/html',body:fixture}));
  await page.goto(fixtureUrl,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_NATIVE_APP_SHELL&&document.querySelector('[data-native-bottom-nav]'),null,{timeout:10000});
  await page.waitForTimeout(120);

  report.phase='single-startup-pass';
  const initial=await snapshot(page);report.snapshots.initial=initial;
  assert.match(initial.version,/event-driven-startup/);
  assert.equal(initial.askCount,1);assert.equal(initial.navCount,1);assert.equal(initial.pullCount,1);
  assert.deepEqual(initial.active,['home']);assert.equal(initial.warDisabled,true);
  assert.deepEqual(initial.intervals,[10000],'Only the separate live badge interval should remain.');
  const baseline={...initial.counts};

  await page.waitForTimeout(4300);
  const delayed=await snapshot(page);report.snapshots.afterRetiredWindow=delayed;
  assert.deepEqual(delayed.counts,baseline,'Unconditional startup resynchronization continued through the retired 4.2-second window.');
  assert.equal(delayed.askCount,1);assert.equal(delayed.navCount,1);assert.equal(delayed.pullCount,1);

  report.phase='late-access-event';
  await page.evaluate(()=>{const source=document.querySelector('nav.tabs [data-destination="war-room"]');source.disabled=false;source.setAttribute('aria-disabled','false');window.dispatchEvent(new CustomEvent('octagon-hq:war-room-access-change',{detail:{allowed:true}}));});
  await page.waitForTimeout(80);
  const access=await snapshot(page);report.snapshots.access=access;
  assert.equal(access.warDisabled,false,'The explicit access event did not update the native War Room button.');
  assert.equal(access.counts.selectedWrites,baseline.selectedWrites+5,'Access publication must perform one native-nav synchronization.');

  report.phase='delayed-badge-sources';
  await page.evaluate(()=>{window.__NATIVE_STARTUP_PASS_PROOF__.playUnread=2;window.dispatchEvent(new CustomEvent('ufc-profile-challenges-updated'));});
  await page.waitForTimeout(80);
  assert.equal((await snapshot(page)).badges.play,'2');
  await page.evaluate(()=>{document.querySelector('#picksProgress strong').textContent='1 / 4';});
  await page.waitForTimeout(80);
  assert.equal((await snapshot(page)).badges.picks,'3');
  await page.evaluate(()=>{window.__NATIVE_STARTUP_PASS_PROOF__.warUnread=5;const badge=document.createElement('span');badge.dataset.octagonUnreadBadge='true';document.querySelector('nav.tabs [data-destination="war-room"]').appendChild(badge);});
  await page.waitForTimeout(80);
  assert.equal((await snapshot(page)).badges['war-room'],'5');

  report.phase='route-and-layout-events';
  await page.evaluate(()=>window.UFC_APP_SHELL.activateDestination('picks'));
  await page.waitForTimeout(80);
  assert.deepEqual((await snapshot(page)).active,['picks']);
  await page.evaluate(()=>{document.querySelector('[data-native-ask]').remove();window.dispatchEvent(new Event('resize'));});
  await page.waitForTimeout(80);
  assert.equal((await snapshot(page)).askCount,1,'Resize recovery did not restore the static Ask action.');

  report.phase='manual-live-badge-poll';
  await page.evaluate(()=>{window.__NATIVE_STARTUP_PASS_PROOF__.playUnread=4;window.__NATIVE_STARTUP_PASS_PROOF__.intervals.find(row=>row.delay===10000).callback();});
  await page.waitForTimeout(80);
  assert.equal((await snapshot(page)).badges.play,'4','The retained live badge freshness poll no longer synchronizes badges.');

  report.phase='complete';report.passed=true;console.log(JSON.stringify(report,null,2));await context.close();
}catch(error){report.passed=false;report.error={name:error?.name||'Error',message:error?.message||String(error),stack:error?.stack||''};fs.writeFileSync(reportPath,JSON.stringify(report,null,2));console.error(JSON.stringify(report,null,2));throw error;}finally{await browser.close();}

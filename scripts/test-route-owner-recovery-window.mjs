import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const appSource=read('assets/js/app.js');
const shellSource=read('assets/js/octagon-hq-shell.js');
const productSource=read('assets/js/product-architecture.js');

const legacyBlock=/document\.querySelectorAll\('\.tab'\)\.forEach\(btn => btn\.addEventListener\('click', \(\) => \{\n  document\.querySelectorAll\('\.tab'\)\.forEach\(b=>b\.classList\.remove\('active'\)\);\n  document\.querySelectorAll\('\.view'\)\.forEach\(v=>v\.classList\.remove\('active-view'\)\);\n  btn\.classList\.add\('active'\);\n  el\(btn\.dataset\.view\)\.classList\.add\('active-view'\);\n  refresh\(\);\n\}\)\);/;
const match=appSource.match(legacyBlock);
assert(match,'Could not extract the exact legacy app.js top-navigation listener.');
const legacyListenerSource=match[0];

const fixture=`<!doctype html><html><head><title>Route recovery fixture</title></head><body>
<header class="hero"><div><p class="eyebrow"></p><h1></h1><p class="subtitle"></p></div><div class="hero-card"></div></header>
<nav class="tabs" aria-label="Primary app destinations">
  <button type="button" class="tab active" data-destination="home" data-view="home" aria-selected="true">Home</button>
  <button type="button" class="tab" data-destination="rankings" data-view="men" aria-selected="false">Rankings</button>
  <button type="button" class="tab" data-destination="play" data-view="play" aria-selected="false">Play</button>
  <button type="button" class="tab" data-destination="picks" data-view="picks" aria-selected="false">Picks</button>
  <button type="button" class="tab" data-destination="war-room" data-view="octagon" aria-selected="false" aria-disabled="true" disabled>War Room</button>
  <button type="button" class="tab" data-destination="intelligence" data-view="compare" aria-selected="false">Intelligence</button>
</nav>
<main class="shell">
  <section id="home" class="view active-view"><div id="homeDashboardMount"></div></section>
  <nav class="rankings-subnav" data-rankings-subnav aria-label="Ranking views" aria-hidden="true">
    <button type="button" data-ranking-view="men">Overall</button>
    <button type="button" data-ranking-view="women">Women</button>
    <button type="button" data-ranking-view="division">Divisions</button>
    <button type="button" data-ranking-view="categories">Categories</button>
  </nav>
  <section class="toolbar"><input id="search"><select id="eraFilter"></select><select id="divisionFilter"></select><button id="resetBtn"></button></section>
  <section id="men" class="view"></section><section id="women" class="view"></section><section id="division" class="view"></section><section id="categories" class="view"></section>
  <section id="play" class="view"></section><section id="picks" class="view"></section><section id="compare" class="view"></section><section id="octagon" class="view"></section>
</main>
</body></html>`;

const twoFrames=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));

async function state(page){
  return page.evaluate(()=>({
    active:[...document.querySelectorAll('main.shell>.view.active-view')].map(node=>node.id),
    selected:[...document.querySelectorAll('nav.tabs .tab.active')].map(node=>node.dataset.destination||''),
    ariaSelected:[...document.querySelectorAll('nav.tabs [aria-selected="true"]')].map(node=>node.dataset.destination||''),
    destination:window.UFC_APP_SHELL?.currentDestination||'',
    rankingView:window.UFC_APP_SHELL?.currentRankingView||'',
    shellApi:Boolean(window.UFC_APP_SHELL),
    facade:Boolean(window.UFC_PRODUCT_ARCHITECTURE?.compatibilityOnly),
    capturedShell:Boolean(window.__capturedRecoveryShell),
    events:[...(window.__routeEvents||[])],
    refreshes:window.__legacyRefreshes||0,
    hash:location.hash
  }));
}

async function buildScenario(browser,{legacy}){
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.route('**/route-owner-recovery-fixture',route=>route.fulfill({status:200,contentType:'text/html',body:fixture}));
  await page.goto('http://127.0.0.1:4173/route-owner-recovery-fixture#home',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>{
    window.__routeEvents=[];
    window.__legacyRefreshes=0;
    window.addEventListener('octagon-hq:view-change',event=>window.__routeEvents.push({destination:event.detail?.destination||'',view:event.detail?.view||''}));
    const nativeAppend=document.head.appendChild.bind(document.head);
    document.head.appendChild=node=>{
      if(node.tagName==='SCRIPT'){
        if(String(node.src||'').includes('assets/js/octagon-hq-shell.js'))window.__capturedRecoveryShell=node;
        return node;
      }
      if(node.tagName==='LINK')return node;
      return nativeAppend(node);
    };
  });

  // Simulate a first shell script attempt that evaluates but does not publish UFC_APP_SHELL.
  await page.addScriptTag({content:'window.__firstShellAttemptFailed=true;'});
  assert.equal(await page.evaluate(()=>Boolean(window.UFC_APP_SHELL)),false,'Failed first shell attempt unexpectedly published the API.');

  if(legacy){
    await page.addScriptTag({content:`const el=id=>document.getElementById(id);function refresh(){window.__legacyRefreshes+=1;}\n${legacyListenerSource}`});
  }

  // This is the real product-architecture recovery path. Script insertion is captured until released below.
  await page.addScriptTag({content:productSource});
  let before=await state(page);
  assert.equal(before.shellApi,false,'Shell API existed before recovery was released.');
  assert.equal(before.facade,true,'Product architecture did not publish its compatibility facade.');
  assert.equal(before.capturedShell,true,'Product architecture did not request the canonical shell script.');

  const attempted=['rankings','play','picks','intelligence','rankings'];
  await page.evaluate(sequence=>sequence.forEach(destination=>{
    document.querySelector(`nav.tabs [data-destination="${destination}"]`).dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
  }),attempted);
  const during=await state(page);

  await page.addScriptTag({content:shellSource});
  await twoFrames(page);
  const recovered=await state(page);

  await page.evaluate(()=>{window.__routeEvents.length=0;});
  await page.evaluate(()=>document.querySelector('nav.tabs [data-destination="rankings"]').click());
  await twoFrames(page);
  const immediateAfter=await state(page);

  await page.evaluate(()=>{window.__routeEvents.length=0;});
  const rapidAfter=['home','rankings','play','picks','intelligence','rankings'];
  await page.evaluate(sequence=>sequence.forEach(destination=>document.querySelector(`nav.tabs [data-destination="${destination}"]`).click()),rapidAfter);
  await twoFrames(page);
  const rapid=await state(page);

  await page.evaluate(()=>{window.__routeEvents.length=0;window.UFC_APP_SHELL.activateDestination('picks');});
  await twoFrames(page);
  const programmatic=await state(page);

  await page.evaluate(()=>{window.__routeEvents.length=0;location.hash='#rankings/women';});
  await page.waitForFunction(()=>window.__routeEvents.length===1);
  await twoFrames(page);
  const hashDriven=await state(page);

  await context.close();
  return{attempted,before,during,recovered,immediateAfter,rapid,programmatic,hashDriven};
}

let browser;
try{
  browser=await chromium.launch({headless:true});
  const baseline=await buildScenario(browser,{legacy:true});
  const candidate=await buildScenario(browser,{legacy:false});

  assert.deepEqual(baseline.during.active,['men'],'Baseline did not reproduce the legacy-only final Rankings view during recovery.');
  assert.deepEqual(baseline.during.selected,['rankings'],'Baseline did not reproduce the legacy-only selected Rankings tab.');
  assert.equal(baseline.during.shellApi,false,'Baseline unexpectedly had canonical shell state during the recovery window.');
  assert.equal(baseline.during.destination,'','Baseline legacy-only navigation unexpectedly updated canonical shell state.');
  assert.equal(baseline.during.events.length,0,'Baseline legacy-only navigation unexpectedly emitted a canonical route event.');
  assert.equal(baseline.during.hash,'#home','Baseline legacy-only navigation unexpectedly updated the route hash.');
  assert.equal(baseline.during.refreshes,baseline.attempted.length,'Baseline legacy listener did not handle every recovery-window tap.');

  assert.deepEqual(candidate.during.active,['home'],'Candidate changed the visible destination without the shell.');
  assert.deepEqual(candidate.during.selected,['home'],'Candidate left a stale selected top tab during recovery.');
  assert.equal(candidate.during.events.length,0,'Candidate emitted a route event without the shell.');
  assert.equal(candidate.during.hash,'#home','Candidate changed the hash without the shell.');

  for(const [label,result] of [['baseline',baseline],['candidate',candidate]]){
    assert.deepEqual(result.recovered.active,['home'],`${label} did not converge to one canonical Home view after recovery.`);
    assert.equal(result.recovered.destination,'home',`${label} canonical state did not match the recovered Home surface.`);
    assert.deepEqual(result.recovered.selected,['home'],`${label} retained stale selected tabs after recovery.`);
    assert.equal(result.recovered.events.length,1,`${label} shell recovery did not emit exactly one complete canonical activation.`);
    assert.deepEqual(result.immediateAfter.active,['men'],`${label} immediate post-recovery tap failed.`);
    assert.equal(result.immediateAfter.destination,'rankings',`${label} immediate post-recovery tap did not update canonical state.`);
    assert.equal(result.immediateAfter.events.length,1,`${label} immediate post-recovery tap emitted duplicate events.`);
    assert.deepEqual(result.rapid.active,['men'],`${label} rapid post-recovery taps left the wrong view.`);
    assert.equal(result.rapid.destination,'rankings',`${label} rapid post-recovery taps left mismatched canonical state.`);
    assert.equal(result.rapid.events.length,6,`${label} rapid post-recovery taps were lost or duplicated.`);
    assert.deepEqual(result.programmatic.active,['picks'],`${label} programmatic activation failed after recovery.`);
    assert.equal(result.programmatic.destination,'picks',`${label} programmatic activation left mismatched state.`);
    assert.equal(result.programmatic.events.length,1,`${label} programmatic activation emitted duplicate events.`);
    assert.deepEqual(result.hashDriven.active,['women'],`${label} hash-driven activation failed after recovery.`);
    assert.equal(result.hashDriven.destination,'rankings',`${label} hash-driven activation left mismatched destination state.`);
    assert.equal(result.hashDriven.rankingView,'women',`${label} hash-driven ranking view was not preserved.`);
    assert.equal(result.hashDriven.events.length,1,`${label} hash-driven activation emitted duplicate events.`);
  }

  const report={
    passed:true,
    normalRecoveryConverges:true,
    baselinePartialLegacyOnlyNavigation:true,
    candidateAvoidsPartialNavigation:true,
    recoveryWindowAttemptedDestination:'rankings',
    recoveredCanonicalDestination:candidate.recovered.destination,
    recoveryWindowActivationLost:candidate.recovered.destination!=='rankings',
    baseline:{during:baseline.during,recovered:baseline.recovered},
    candidate:{during:candidate.during,recovered:candidate.recovered},
    postRecovery:{immediate:candidate.immediateAfter,rapid:candidate.rapid,programmatic:candidate.programmatic,hashDriven:candidate.hashDriven}
  };
  console.log(JSON.stringify(report,null,2));
  assert.equal(report.recoveryWindowActivationLost,false,'STOP CONDITION: removing the legacy app.js listener loses the primary top-navigation activation attempted while product-architecture shell recovery is in flight.');
}finally{
  if(browser)await browser.close();
}

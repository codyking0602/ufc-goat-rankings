import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const productSource=read('assets/js/product-architecture.js');
const shellSource=read('assets/js/octagon-hq-shell.js');
const baseUrl='http://127.0.0.1:4173/index.html?routeRecoveryQueue=1#home';
const fixtureUrl='http://127.0.0.1:4173/route-recovery-queue-fixture.html';

const supabaseStub=`
window.supabase={createClient(){
  const chain={select(){return chain;},eq(){return chain;},order(){return Promise.resolve({data:[],error:null});},limit(){return Promise.resolve({data:[],error:null});},single(){return Promise.resolve({data:null,error:null});}};
  return{rpc:async()=>({data:null,error:null}),from:()=>chain,channel(){return{on(){return this;},subscribe(){return this;}}},removeChannel:async()=>{}};
}};
`;

const waitForFrames=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));

function fixtureHtml({warDisabled=true,withDom=true}={}){
  const disabled=warDisabled?' disabled aria-disabled="true" data-beta-access="locked"':' aria-disabled="false" data-beta-access="enabled"';
  const body=withDom?`
    <header class="hero"><div><p class="eyebrow"></p><h1></h1><p class="subtitle"></p></div><div class="hero-card"></div></header>
    <nav class="tabs" aria-label="Primary app destinations">
      <button type="button" class="tab active" data-destination="home" data-view="home" aria-selected="true">Home</button>
      <button type="button" class="tab" data-destination="rankings" data-view="men" aria-selected="false">Rankings</button>
      <button type="button" class="tab" data-destination="play" data-view="play" aria-selected="false">Play</button>
      <button type="button" class="tab" data-destination="picks" data-view="picks" aria-selected="false">Picks</button>
      <button type="button" class="tab" data-destination="war-room" data-view="octagon" aria-selected="false"${disabled}>War Room</button>
      <button type="button" class="tab" data-destination="intelligence" data-view="compare" aria-selected="false">Intelligence</button>
    </nav>
    <main class="shell">
      <section id="home" class="view active-view"><div id="homeDashboardMount"></div></section>
      <nav class="rankings-subnav" data-rankings-subnav aria-hidden="true">
        <button type="button" data-ranking-view="men">Overall</button>
        <button type="button" data-ranking-view="women">Women</button>
        <button type="button" data-ranking-view="division">Divisions</button>
        <button type="button" data-ranking-view="categories">Categories</button>
      </nav>
      <section class="toolbar"><input id="search"><select id="eraFilter"></select><select id="divisionFilter"></select><button id="resetBtn"></button></section>
      <section id="men" class="view"></section>
      <section id="women" class="view"></section>
      <section id="division" class="view"></section>
      <section id="categories" class="view"></section>
      <section id="play" class="view"></section>
      <section id="picks" class="view"></section>
      <section id="octagon" class="view"></section>
      <section id="compare" class="view"></section>
    </main>`:'';
  return `<!doctype html><html><head><base href="http://127.0.0.1:4173/"><link rel="stylesheet" href="assets/css/product-polish.css"></head><body>${body}</body></html>`;
}

async function addNormalInstrumentation(page){
  await page.addInitScript(()=>{
    window.__routeRecoveryEvents=[];
    window.addEventListener('octagon-hq:view-change',event=>window.__routeRecoveryEvents.push({
      destination:event.detail?.destination||'',
      view:event.detail?.view||''
    }));
  });
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',route=>route.fulfill({status:200,contentType:'application/javascript',body:supabaseStub}));
}

async function clearEvents(page){
  await page.evaluate(()=>{window.__routeRecoveryEvents.length=0;});
}

async function state(page){
  return page.evaluate(()=>({
    active:[...document.querySelectorAll('main.shell>.view.active-view')].map(node=>node.id),
    destination:window.UFC_APP_SHELL?.currentDestination||'',
    rankingView:window.UFC_APP_SHELL?.currentRankingView||'',
    selectedTop:[...document.querySelectorAll('nav.tabs [data-destination].active[aria-selected="true"]')].map(node=>node.dataset.destination),
    selectedRanking:[...document.querySelectorAll('[data-rankings-subnav] [data-ranking-view].active[aria-pressed="true"]')].map(node=>node.dataset.rankingView),
    hash:location.hash,
    events:[...(window.__routeRecoveryEvents||[])],
    pending:window.__UFC_PENDING_SHELL_NAVIGATION__||null,
    recoveryScripts:document.querySelectorAll('script[data-product-architecture-shell-recovery="true"]').length
  }));
}

function assertSingleActivation(result,{destination,view,rankingView}){
  assert.deepEqual(result.active,[view],`${destination} did not leave exactly one expected active view.`);
  assert.equal(result.destination,destination,`${destination} did not match canonical shell state.`);
  assert.deepEqual(result.selectedTop,[destination],`${destination} selected-state and ARIA were not singular.`);
  assert.equal(result.events.length,1,`${destination} emitted ${result.events.length} route events instead of one.`);
  assert.equal(result.events[0].destination,destination,`${destination} emitted the wrong destination event.`);
  if(rankingView){
    assert.equal(result.rankingView,rankingView,`${destination} did not retain the expected ranking view.`);
    assert.deepEqual(result.selectedRanking,[rankingView],`${destination} ranking-subnavigation state was not singular.`);
  }
}

async function clickDestination(page,destination,{enableWar=false}={}){
  await clearEvents(page);
  await page.evaluate(({destination,enableWar})=>{
    const button=document.querySelector(`nav.tabs [data-destination="${destination}"]`);
    if(!button)throw new Error(`Missing destination button: ${destination}`);
    if(enableWar&&destination==='war-room'){
      button.disabled=false;
      button.setAttribute('aria-disabled','false');
      button.dataset.betaAccess='enabled';
    }
    button.click();
  },{destination,enableWar});
  await waitForFrames(page);
  return state(page);
}

async function testNormalOwnership(browser){
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await addNormalInstrumentation(page);
  await page.goto(baseUrl,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_APP_SHELL&&typeof window.refresh==='function'&&document.querySelectorAll('#menList .fighter-row').length>0,null,{timeout:60000});
  await page.waitForFunction(()=>window.UFC_FRESH_HOME_LAUNCH,null,{timeout:60000});
  await page.waitForTimeout(1200);

  const results={};
  results.home=await clickDestination(page,'home');
  assertSingleActivation(results.home,{destination:'home',view:'home'});
  results.rankings=await clickDestination(page,'rankings');
  assertSingleActivation(results.rankings,{destination:'rankings',view:'men',rankingView:'men'});
  results.play=await clickDestination(page,'play');
  assertSingleActivation(results.play,{destination:'play',view:'play'});
  results.picks=await clickDestination(page,'picks');
  assertSingleActivation(results.picks,{destination:'picks',view:'picks'});
  results.intelligence=await clickDestination(page,'intelligence');
  assertSingleActivation(results.intelligence,{destination:'intelligence',view:'compare'});

  await clickDestination(page,'home');
  await page.evaluate(()=>{
    const war=document.querySelector('nav.tabs [data-destination="war-room"]');
    war.disabled=true;
    war.setAttribute('aria-disabled','true');
  });
  const disabledWar=await clickDestination(page,'war-room');
  assert.deepEqual(disabledWar.active,['home'],'Disabled War Room changed the active surface.');
  assert.equal(disabledWar.destination,'home','Disabled War Room changed canonical state.');
  assert.equal(disabledWar.events.length,0,'Disabled War Room emitted a route event.');

  results.warRoom=await clickDestination(page,'war-room',{enableWar:true});
  assertSingleActivation(results.warRoom,{destination:'war-room',view:'octagon'});

  await clickDestination(page,'rankings');
  for(const [rankingView,view] of [['men','men'],['women','women'],['division','division'],['categories','categories']]){
    await clearEvents(page);
    await page.evaluate(rankingView=>document.querySelector(`[data-rankings-subnav] [data-ranking-view="${rankingView}"]`).click(),rankingView);
    await waitForFrames(page);
    assertSingleActivation(await state(page),{destination:'rankings',view,rankingView});
  }
  await clickDestination(page,'play');
  const returned=await clickDestination(page,'rankings');
  assertSingleActivation(returned,{destination:'rankings',view:'categories',rankingView:'categories'});

  await clearEvents(page);
  const rapid=['home','rankings','play','picks','intelligence','home','rankings'];
  await page.evaluate(sequence=>sequence.forEach(destination=>document.querySelector(`nav.tabs [data-destination="${destination}"]`).click()),rapid);
  await waitForFrames(page);
  const rapidState=await state(page);
  assert.equal(rapidState.events.length,rapid.length,'Rapid normal taps were lost or duplicated.');
  assert.deepEqual(rapidState.active,['categories'],'Rapid normal taps left the wrong active ranking view.');
  assert.equal(rapidState.destination,'rankings','Rapid normal taps left the wrong destination.');

  await clearEvents(page);
  await page.evaluate(()=>window.UFC_APP_SHELL.activateDestination('picks'));
  await waitForFrames(page);
  assertSingleActivation(await state(page),{destination:'picks',view:'picks'});

  await clearEvents(page);
  await page.evaluate(()=>{location.hash='#rankings/women';});
  await page.waitForFunction(()=>window.__routeRecoveryEvents.length===1,null,{timeout:10000});
  await waitForFrames(page);
  assertSingleActivation(await state(page),{destination:'rankings',view:'women',rankingView:'women'});

  const controls=await page.evaluate(async()=>{
    const initial=document.querySelectorAll('#menList .fighter-row').length;
    const first=document.querySelector('#menList .fighter-row .name')?.textContent?.trim()||'';
    const search=document.getElementById('search');
    search.value=first;
    search.dispatchEvent(new Event('input',{bubbles:true}));
    const searched=document.querySelectorAll('#menList .fighter-row').length;
    const division=document.getElementById('divisionFilter');
    const option=[...division.options].find(item=>item.value!=='All');
    if(option){division.value=option.value;division.dispatchEvent(new Event('change',{bubbles:true}));}
    const divisionRows=document.querySelectorAll('#divisionList .fighter-row').length;
    document.getElementById('resetBtn').click();
    window.UFC_APP_SHELL.activateView('men');
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    document.querySelector('#menList .fighter-row')?.click();
    const opened=document.getElementById('drawer')?.classList.contains('open')===true;
    document.getElementById('closeDrawer')?.click();
    const closed=document.getElementById('drawer')?.classList.contains('open')===false;
    window.refresh();
    return{
      initial,first,searched,divisionRows,
      resetSearch:search.value,
      resetDivision:division.value,
      opened,closed,
      refreshed:document.querySelectorAll('#menList .fighter-row').length,
      productIsShell:window.UFC_PRODUCT_ARCHITECTURE===window.UFC_APP_SHELL,
      pending:Boolean(window.__UFC_PENDING_SHELL_NAVIGATION__),
      recoveryScripts:document.querySelectorAll('script[data-product-architecture-shell-recovery="true"]').length
    };
  });
  assert(controls.initial>0&&controls.first,'Normal ranking rendering was unavailable.');
  assert(controls.searched>0&&controls.searched<=controls.initial,'Search behavior changed.');
  assert(controls.divisionRows>0,'Division filter behavior changed.');
  assert.equal(controls.resetSearch,'','Reset did not clear search.');
  assert.equal(controls.resetDivision,'All','Reset did not restore the division filter.');
  assert.equal(controls.opened,true,'Fighter profile did not open.');
  assert.equal(controls.closed,true,'Fighter profile did not close.');
  assert(controls.refreshed>0,'refresh() no longer rendered rankings.');
  assert.equal(controls.productIsShell,true,'Normal startup did not retain the canonical shell API.');
  assert.equal(controls.pending,false,'Normal startup left a recovery request queued.');
  assert.equal(controls.recoveryScripts,0,'Normal startup dynamically loaded a recovery shell.');

  await context.close();
  return{destinations:Object.keys(results),returnedRankingView:returned.rankingView,rapidEvents:rapidState.events.length,controls};
}

async function prepareRecoveryPage(browser,{warDisabled=true}={}){
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.goto(fixtureUrl,{waitUntil:'domcontentloaded',timeout:60000});
  await page.setContent(fixtureHtml({warDisabled}),{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>{
    history.replaceState(null,'','#home');
    window.UFC_PRODUCT_CONNECTIVITY={};
    window.UFC_PRODUCT_POLISH={};
    window.UFC_PROFILE_AVATAR_SYNC={};
    window.UFC_PROFILE_ACTIVITY={};
    window.UFC_FIND_LEADER_RETENTION={};
    window.UFC_PICKS_SEASON_LOOP={};
    window.UFC_PLAY_PROFILE={resolve:()=>Promise.resolve(null)};
    window.__routeRecoveryEvents=[];
    window.__legacyRefreshes=0;
    window.addEventListener('octagon-hq:view-change',event=>window.__routeRecoveryEvents.push({destination:event.detail?.destination||'',view:event.detail?.view||''}));
    document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{
      document.querySelectorAll('.tab').forEach(button=>button.classList.remove('active'));
      document.querySelectorAll('.view').forEach(view=>view.classList.remove('active-view'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.view).classList.add('active-view');
      window.__legacyRefreshes+=1;
    }));
  });
  return{context,page};
}

async function recoveryFixtureState(page){
  return page.evaluate(()=>({
    active:[...document.querySelectorAll('main.shell>.view.active-view')].map(node=>node.id),
    visualTop:[...document.querySelectorAll('nav.tabs .tab.active')].map(node=>node.dataset.destination),
    ariaTop:[...document.querySelectorAll('nav.tabs [data-destination][aria-selected="true"]')].map(node=>node.dataset.destination),
    destination:window.UFC_APP_SHELL?.currentDestination||'',
    rankingView:window.UFC_APP_SHELL?.currentRankingView||'',
    hash:location.hash,
    events:[...window.__routeRecoveryEvents],
    pending:window.__UFC_PENDING_SHELL_NAVIGATION__||null,
    legacyRefreshes:window.__legacyRefreshes,
    productIsShell:window.UFC_PRODUCT_ARCHITECTURE===window.UFC_APP_SHELL,
    facade:Boolean(window.UFC_PRODUCT_ARCHITECTURE?.compatibilityOnly),
    recoveryScripts:document.querySelectorAll('script[data-product-architecture-shell-recovery="true"]').length
  }));
}

async function testRecoveryTapQueue(browser){
  const {context,page}=await prepareRecoveryPage(browser);
  let releaseRecovery;
  let markSeen;
  const recoveryReleased=new Promise(resolve=>{releaseRecovery=resolve;});
  const requestSeen=new Promise(resolve=>{markSeen=resolve;});
  await page.route('**/assets/js/octagon-hq-shell.js*',async route=>{
    markSeen();
    await recoveryReleased;
    await route.fulfill({status:200,contentType:'application/javascript',body:shellSource});
  });
  await page.evaluate(source=>(0,eval)(source),productSource);
  await requestSeen;

  const taps=['play','picks','intelligence','rankings'];
  await page.evaluate(sequence=>sequence.forEach(destination=>document.querySelector(`nav.tabs [data-destination="${destination}"]`).click()),taps);
  const during=await recoveryFixtureState(page);
  assert.deepEqual(during.active,['home'],'Recovery taps caused partial DOM navigation.');
  assert.deepEqual(during.visualTop,['home'],'Recovery taps changed visual top-navigation state before the shell was ready.');
  assert.deepEqual(during.ariaTop,['home'],'Recovery taps changed ARIA state before the shell was ready.');
  assert.equal(during.hash,'#home','Recovery taps changed the hash outside the canonical shell.');
  assert.equal(during.events.length,0,'Recovery taps emitted a route event before the shell was ready.');
  assert.equal(during.legacyRefreshes,0,'The legacy app listener handled a recovery-window tap.');
  assert.equal(during.pending?.method,'activateDestination','The recovery intent was not queued as a destination activation.');
  assert.equal(during.pending?.args?.[0],'rankings','Latest-wins recovery intent did not retain the final destination.');

  releaseRecovery();
  await page.waitForFunction(()=>window.UFC_APP_SHELL&&document.documentElement.hasAttribute('data-app-shell'),null,{timeout:60000});
  await waitForFrames(page);
  const recovered=await recoveryFixtureState(page);
  assert.deepEqual(recovered.active,['men'],'Recovered shell did not activate the queued Rankings destination.');
  assert.deepEqual(recovered.visualTop,['rankings'],'Recovered shell left stale visual top-navigation state.');
  assert.deepEqual(recovered.ariaTop,['rankings'],'Recovered shell left stale top-navigation ARIA state.');
  assert.equal(recovered.destination,'rankings','Recovered canonical destination did not match the queued intent.');
  assert.equal(recovered.rankingView,'men','Recovered Rankings destination did not use the current ranking view.');
  assert.equal(recovered.hash,'#rankings/men','Recovered shell did not write the canonical Rankings hash.');
  assert.equal(recovered.events.length,1,'Recovered shell emitted more than one initial route event.');
  assert.deepEqual(recovered.events[0],{destination:'rankings',view:'men'},'Recovered shell emitted the wrong initial route event.');
  assert.equal(recovered.pending,null,'Recovered shell did not consume the queued intent.');
  assert.equal(recovered.legacyRefreshes,0,'Recovery triggered the legacy app refresh path.');
  assert.equal(recovered.productIsShell,true,'Product architecture did not hand back to the canonical shell API.');

  windowResult: {
    await page.evaluate(()=>{window.__routeRecoveryEvents.length=0;});
  }
  await page.evaluate(()=>document.querySelector('nav.tabs [data-destination="picks"]').click());
  await waitForFrames(page);
  const immediate=await recoveryFixtureState(page);
  assert.deepEqual(immediate.active,['picks'],'Immediate post-recovery tap did not activate Picks.');
  assert.equal(immediate.destination,'picks','Immediate post-recovery canonical state was wrong.');
  assert.equal(immediate.events.length,1,'Immediate post-recovery tap emitted the wrong event count.');

  await page.evaluate(()=>{window.__routeRecoveryEvents.length=0;});
  const rapid=['home','rankings','play','picks','intelligence','rankings'];
  await page.evaluate(sequence=>sequence.forEach(destination=>document.querySelector(`nav.tabs [data-destination="${destination}"]`).click()),rapid);
  await waitForFrames(page);
  const rapidState=await recoveryFixtureState(page);
  assert.equal(rapidState.events.length,rapid.length,'Rapid post-recovery taps were lost or duplicated.');
  assert.deepEqual(rapidState.active,['men'],'Rapid post-recovery taps ended on the wrong view.');
  assert.equal(rapidState.destination,'rankings','Rapid post-recovery taps ended on the wrong destination.');

  await context.close();
  return{during,recovered,immediate:{active:immediate.active,destination:immediate.destination,events:immediate.events.length},rapid:{events:rapidState.events.length,destination:rapidState.destination}};
}

async function testProgrammaticRecovery(browser){
  const {context,page}=await prepareRecoveryPage(browser);
  let releaseRecovery;
  let markSeen;
  const recoveryReleased=new Promise(resolve=>{releaseRecovery=resolve;});
  const requestSeen=new Promise(resolve=>{markSeen=resolve;});
  await page.route('**/assets/js/octagon-hq-shell.js*',async route=>{
    markSeen();
    await recoveryReleased;
    await route.fulfill({status:200,contentType:'application/javascript',body:shellSource});
  });
  await page.evaluate(source=>(0,eval)(source),productSource);
  await requestSeen;
  const returned=await page.evaluate(()=>window.UFC_PRODUCT_ARCHITECTURE.activateView('women'));
  assert.equal(returned,false,'Recovery facade changed its asynchronous return contract.');
  const during=await recoveryFixtureState(page);
  assert.equal(during.pending?.method,'activateView','Programmatic recovery did not queue activateView.');
  assert.equal(during.pending?.args?.[0],'women','Programmatic recovery queued the wrong ranking view.');
  assert.deepEqual(during.active,['home'],'Programmatic recovery caused partial DOM navigation.');
  releaseRecovery();
  await page.waitForFunction(()=>window.UFC_APP_SHELL&&document.documentElement.hasAttribute('data-app-shell'),null,{timeout:60000});
  await waitForFrames(page);
  const recovered=await recoveryFixtureState(page);
  assert.deepEqual(recovered.active,['women'],'Programmatic recovery did not activate Women.');
  assert.equal(recovered.destination,'rankings','Programmatic recovery canonical destination was not Rankings.');
  assert.equal(recovered.rankingView,'women','Programmatic recovery did not preserve Women.');
  assert.equal(recovered.events.length,1,'Programmatic recovery emitted more than one route event.');
  assert.equal(recovered.hash,'#rankings/women','Programmatic recovery wrote the wrong hash.');
  await context.close();
  return{during,recovered};
}

async function testDisabledWarRecovery(browser){
  const {context,page}=await prepareRecoveryPage(browser,{warDisabled:true});
  let releaseRecovery;
  let markSeen;
  const recoveryReleased=new Promise(resolve=>{releaseRecovery=resolve;});
  const requestSeen=new Promise(resolve=>{markSeen=resolve;});
  await page.route('**/assets/js/octagon-hq-shell.js*',async route=>{
    markSeen();
    await recoveryReleased;
    await route.fulfill({status:200,contentType:'application/javascript',body:shellSource});
  });
  await page.evaluate(source=>(0,eval)(source),productSource);
  await requestSeen;
  await page.evaluate(()=>{
    const war=document.querySelector('nav.tabs [data-destination="war-room"]');
    war.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
  });
  const during=await recoveryFixtureState(page);
  assert.equal(during.pending,null,'Disabled War Room created a queued recovery request.');
  assert.deepEqual(during.active,['home'],'Disabled War Room changed the active surface during recovery.');
  assert.equal(during.legacyRefreshes,0,'Disabled War Room reached the legacy app listener during recovery.');
  releaseRecovery();
  await page.waitForFunction(()=>window.UFC_APP_SHELL&&document.documentElement.hasAttribute('data-app-shell'),null,{timeout:60000});
  await waitForFrames(page);
  const recovered=await recoveryFixtureState(page);
  assert.deepEqual(recovered.active,['home'],'Disabled War Room recovery did not remain on Home.');
  assert.equal(recovered.destination,'home','Disabled War Room recovery changed canonical state.');
  assert.equal(recovered.events.length,1,'Disabled War Room recovery emitted the wrong startup event count.');
  await context.close();
  return{during,recovered};
}

async function testRecoveryRetry(browser){
  const {context,page}=await prepareRecoveryPage(browser);
  let requestCount=0;
  await page.route('**/assets/js/octagon-hq-shell.js*',async route=>{
    requestCount+=1;
    if(requestCount===1){await route.abort('failed');return;}
    await route.fulfill({status:200,contentType:'application/javascript',body:shellSource});
  });
  await page.evaluate(source=>(0,eval)(source),productSource);
  await page.waitForFunction(()=>document.querySelectorAll('script[data-product-architecture-shell-recovery="true"]').length===0,null,{timeout:10000});
  await page.evaluate(()=>document.querySelector('nav.tabs [data-destination="play"]').click());
  await page.waitForFunction(()=>window.UFC_APP_SHELL&&document.documentElement.hasAttribute('data-app-shell'),null,{timeout:60000});
  await waitForFrames(page);
  const recovered=await recoveryFixtureState(page);
  assert.equal(requestCount,2,'Failed dynamic shell recovery was not retried exactly once.');
  assert.deepEqual(recovered.active,['play'],'Retry recovery did not activate the queued Play destination.');
  assert.equal(recovered.destination,'play','Retry recovery canonical destination was wrong.');
  assert.equal(recovered.events.length,1,'Retry recovery emitted more than one route event.');
  assert.equal(recovered.legacyRefreshes,0,'Retry recovery reached the legacy app listener.');
  await context.close();
  return{requestCount,recovered};
}

async function testMissingDomHandoff(browser){
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.goto(fixtureUrl,{waitUntil:'domcontentloaded',timeout:60000});
  await page.setContent(fixtureHtml({withDom:false}),{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>{
    history.replaceState(null,'','#home');
    window.__routeRecoveryEvents=[];
    window.addEventListener('octagon-hq:view-change',event=>window.__routeRecoveryEvents.push({destination:event.detail?.destination||'',view:event.detail?.view||''}));
    window.__UFC_PENDING_SHELL_NAVIGATION__={method:'activateView',args:['categories']};
  });
  await page.evaluate(source=>(0,eval)(source),shellSource);
  const before=await page.evaluate(()=>({api:Boolean(window.UFC_APP_SHELL),started:document.documentElement.hasAttribute('data-app-shell'),pending:window.__UFC_PENDING_SHELL_NAVIGATION__||null,events:window.__routeRecoveryEvents.length}));
  assert.equal(before.api,true,'Missing-DOM shell did not publish its canonical API.');
  assert.equal(before.started,false,'Missing-DOM shell started before prerequisites existed.');
  assert.equal(before.pending?.args?.[0],'categories','Missing-DOM shell consumed the recovery handoff too early.');
  assert.equal(before.events,0,'Missing-DOM shell emitted a premature route event.');
  await page.evaluate(html=>{
    document.body.innerHTML=new DOMParser().parseFromString(html,'text/html').body.innerHTML;
    document.dispatchEvent(new Event('DOMContentLoaded'));
  },fixtureHtml());
  await page.waitForFunction(()=>document.documentElement.hasAttribute('data-app-shell'),null,{timeout:10000});
  await waitForFrames(page);
  const after=await recoveryFixtureState(page);
  assert.deepEqual(after.active,['categories'],'Missing-DOM recovery did not activate the queued Categories view.');
  assert.equal(after.destination,'rankings','Missing-DOM recovery canonical destination was wrong.');
  assert.equal(after.rankingView,'categories','Missing-DOM recovery ranking view was wrong.');
  assert.equal(after.events.length,1,'Missing-DOM recovery emitted more than one route event.');
  assert.equal(after.pending,null,'Missing-DOM recovery did not consume the handoff.');
  await context.close();
  return{before,after};
}

let browser;
try{
  browser=await chromium.launch({headless:true});
  const normal=await testNormalOwnership(browser);
  const recovery=await testRecoveryTapQueue(browser);
  const programmatic=await testProgrammaticRecovery(browser);
  const disabledWar=await testDisabledWarRecovery(browser);
  const retry=await testRecoveryRetry(browser);
  const missingDom=await testMissingDomHandoff(browser);
  console.log(JSON.stringify({passed:true,normal,recovery,programmatic,disabledWar,retry,missingDom},null,2));
}finally{
  if(browser)await browser.close();
}

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const appSource=read('assets/js/app.js');
const shellSource=read('assets/js/octagon-hq-shell.js');
const baseUrl='http://127.0.0.1:4173/index.html?routeOwnerProof=1#home';

const legacyBlock=/\ndocument\.querySelectorAll\('\.tab'\)\.forEach\(btn => btn\.addEventListener\('click', \(\) => \{\n  document\.querySelectorAll\('\.tab'\)\.forEach\(b=>b\.classList\.remove\('active'\)\);\n  document\.querySelectorAll\('\.view'\)\.forEach\(v=>v\.classList\.remove\('active-view'\)\);\n  btn\.classList\.add\('active'\);\n  el\(btn\.dataset\.view\)\.classList\.add\('active-view'\);\n  refresh\(\);\n\}\)\);\n/;
assert(legacyBlock.test(appSource),'Focused proof could not locate the exact legacy app.js primary-tab activation block.');
const candidateSource=appSource.replace(legacyBlock,'\n');
assert.equal(legacyBlock.test(candidateSource),false,'Candidate source still contains the legacy primary-tab activation block.');

const supabaseStub=`
window.supabase={createClient(){
  const chain={select(){return chain;},eq(){return chain;},order(){return Promise.resolve({data:[],error:null});},limit(){return Promise.resolve({data:[],error:null});},single(){return Promise.resolve({data:null,error:null});}};
  return{rpc:async()=>({data:null,error:null}),from:()=>chain,channel(){return{on(){return this;},subscribe(){return this;}}},removeChannel:async()=>{}};
}};
`;

const waitForFrames=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));

async function instrument(page){
  await page.addInitScript(()=>{
    window.__routeOwnerProof={events:[],history:[]};
    window.addEventListener('octagon-hq:view-change',event=>window.__routeOwnerProof.events.push({
      destination:event.detail?.destination||'',
      view:event.detail?.view||''
    }));
    const original=history.replaceState.bind(history);
    history.replaceState=(state,title,url)=>{
      window.__routeOwnerProof.history.push(String(url??''));
      return original(state,title,url);
    };
  });
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',route=>route.fulfill({status:200,contentType:'application/javascript',body:supabaseStub}));
}

async function installAppVariant(page,source){
  await page.route('**/assets/js/app.js*',route=>route.fulfill({status:200,contentType:'application/javascript',body:source}));
}

async function clearTelemetry(page){
  await page.evaluate(()=>{
    window.__routeOwnerProof.events.length=0;
    window.__routeOwnerProof.history.length=0;
  });
}

async function routeState(page){
  return page.evaluate(()=>({
    active:[...document.querySelectorAll('main.shell>.view.active-view')].map(node=>node.id),
    destination:window.UFC_APP_SHELL?.currentDestination||'',
    rankingView:window.UFC_APP_SHELL?.currentRankingView||'',
    selectedTop:[...document.querySelectorAll('nav.tabs [data-destination].active[aria-selected="true"]')].map(node=>node.dataset.destination),
    selectedRanking:[...document.querySelectorAll('[data-rankings-subnav] [data-ranking-view].active[aria-pressed="true"]')].map(node=>node.dataset.rankingView),
    hash:location.hash,
    events:[...window.__routeOwnerProof.events],
    history:[...window.__routeOwnerProof.history]
  }));
}

async function clickDestination(page,destination,{enableWar=false}={}){
  await clearTelemetry(page);
  await page.evaluate(({destination,enableWar})=>{
    const button=document.querySelector(`nav.tabs [data-destination="${destination}"]`);
    if(!button)throw new Error(`Missing top-navigation button: ${destination}`);
    if(enableWar&&destination==='war-room'){
      button.disabled=false;
      button.setAttribute('aria-disabled','false');
      button.dataset.betaAccess='enabled';
    }
    button.click();
  },{destination,enableWar});
  await waitForFrames(page);
  return routeState(page);
}

function assertSingleActivation(state,{destination,view,rankingView}){
  assert.deepEqual(state.active,[view],`${destination} did not leave exactly one expected active view.`);
  assert.equal(state.destination,destination,`${destination} did not match canonical shell destination state.`);
  assert.deepEqual(state.selectedTop,[destination],`${destination} top-navigation active/ARIA state was not singular.`);
  assert.equal(state.events.length,1,`${destination} emitted ${state.events.length} route events instead of one.`);
  assert.equal(state.events[0].destination,destination,`${destination} emitted the wrong route event destination.`);
  if(rankingView){
    assert.equal(state.rankingView,rankingView,`${destination} did not retain the expected ranking subview.`);
    assert.deepEqual(state.selectedRanking,[rankingView],`${destination} ranking subnavigation active/ARIA state was not singular.`);
  }
}

async function testNormalVariant(browser,label,source){
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await instrument(page);
  await installAppVariant(page,source);
  await page.goto(baseUrl,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_APP_SHELL&&typeof window.refresh==='function'&&document.querySelectorAll('#menList .fighter-row').length>0,null,{timeout:60000});
  await page.waitForFunction(()=>window.UFC_FRESH_HOME_LAUNCH,null,{timeout:60000});
  await page.waitForTimeout(1200);

  const routeResults={};
  routeResults.home=await clickDestination(page,'home');
  assertSingleActivation(routeResults.home,{destination:'home',view:'home'});
  routeResults.rankings=await clickDestination(page,'rankings');
  assertSingleActivation(routeResults.rankings,{destination:'rankings',view:'men',rankingView:'men'});
  routeResults.play=await clickDestination(page,'play');
  assertSingleActivation(routeResults.play,{destination:'play',view:'play'});
  routeResults.picks=await clickDestination(page,'picks');
  assertSingleActivation(routeResults.picks,{destination:'picks',view:'picks'});
  routeResults.intelligence=await clickDestination(page,'intelligence');
  assertSingleActivation(routeResults.intelligence,{destination:'intelligence',view:'compare'});

  await clickDestination(page,'home');
  await page.evaluate(()=>{
    const war=document.querySelector('nav.tabs [data-destination="war-room"]');
    war.disabled=true;
    war.setAttribute('aria-disabled','true');
  });
  const disabledWar=await clickDestination(page,'war-room');
  assert.deepEqual(disabledWar.active,['home'],'Disabled War Room changed the active destination.');
  assert.equal(disabledWar.destination,'home','Disabled War Room changed canonical shell state.');
  assert.equal(disabledWar.events.length,0,'Disabled War Room emitted a route event.');

  routeResults.warRoom=await clickDestination(page,'war-room',{enableWar:true});
  assertSingleActivation(routeResults.warRoom,{destination:'war-room',view:'octagon'});

  await clickDestination(page,'rankings');
  for(const [rankingView,view] of [['men','men'],['women','women'],['division','division'],['categories','categories']]){
    await clearTelemetry(page);
    await page.evaluate(rankingView=>document.querySelector(`[data-rankings-subnav] [data-ranking-view="${rankingView}"]`).click(),rankingView);
    await waitForFrames(page);
    const state=await routeState(page);
    assertSingleActivation(state,{destination:'rankings',view,rankingView});
  }
  await clickDestination(page,'play');
  const returnedRankings=await clickDestination(page,'rankings');
  assertSingleActivation(returnedRankings,{destination:'rankings',view:'categories',rankingView:'categories'});

  await clearTelemetry(page);
  const rapidSequence=['home','rankings','play','picks','intelligence','home','rankings'];
  await page.evaluate(sequence=>{
    sequence.forEach(destination=>document.querySelector(`nav.tabs [data-destination="${destination}"]`).click());
  },rapidSequence);
  await waitForFrames(page);
  const rapid=await routeState(page);
  assert.equal(rapid.events.length,rapidSequence.length,`${label} rapid top-navigation taps were lost or duplicated.`);
  assert.deepEqual(rapid.active,['categories'],`${label} rapid top-navigation taps left the wrong active view.`);
  assert.equal(rapid.destination,'rankings',`${label} rapid top-navigation taps left the wrong canonical destination.`);

  await clearTelemetry(page);
  await page.evaluate(()=>window.UFC_APP_SHELL.activateDestination('picks'));
  await waitForFrames(page);
  const programmatic=await routeState(page);
  assertSingleActivation(programmatic,{destination:'picks',view:'picks'});

  await clearTelemetry(page);
  await page.evaluate(()=>{location.hash='#rankings/women';});
  await page.waitForFunction(()=>window.__routeOwnerProof.events.length===1,null,{timeout:10000});
  await waitForFrames(page);
  const hashDriven=await routeState(page);
  assertSingleActivation(hashDriven,{destination:'rankings',view:'women',rankingView:'women'});

  const legacyBehavior=await page.evaluate(async()=>{
    const initialMenRows=document.querySelectorAll('#menList .fighter-row').length;
    const firstName=document.querySelector('#menList .fighter-row .name')?.textContent?.trim()||'';
    const search=document.getElementById('search');
    search.value=firstName;
    search.dispatchEvent(new Event('input',{bubbles:true}));
    const searchedRows=document.querySelectorAll('#menList .fighter-row').length;
    const division=document.getElementById('divisionFilter');
    const option=[...division.options].find(item=>item.value!=='All');
    if(option){division.value=option.value;division.dispatchEvent(new Event('change',{bubbles:true}));}
    const divisionRows=document.querySelectorAll('#divisionList .fighter-row').length;
    document.getElementById('resetBtn').click();
    window.UFC_APP_SHELL.activateView('men');
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    document.querySelector('#menList .fighter-row')?.click();
    const drawerOpened=document.getElementById('drawer')?.classList.contains('open')===true&&document.getElementById('drawer')?.getAttribute('aria-hidden')==='false';
    document.getElementById('closeDrawer')?.click();
    const drawerClosed=document.getElementById('drawer')?.classList.contains('open')===false&&document.getElementById('drawer')?.getAttribute('aria-hidden')==='true';
    window.refresh();
    return{
      initialMenRows,
      firstName,
      searchedRows,
      divisionRows,
      resetSearch:search.value,
      resetDivision:division.value,
      drawerOpened,
      drawerClosed,
      refreshedRows:document.querySelectorAll('#menList .fighter-row').length,
      playPresent:Boolean(document.getElementById('playTop10Panel')),
      picksPresent:Boolean(document.getElementById('picks')),
      intelligencePresent:Boolean(document.querySelector('#compare [data-intelligence-open]')),
      warRoomPresent:Boolean(document.getElementById('octagon')),
      refreshType:typeof window.refresh
    };
  });
  assert(legacyBehavior.initialMenRows>0,`${label} ranking lists did not render.`);
  assert(legacyBehavior.firstName,`${label} search fixture fighter was missing.`);
  assert(legacyBehavior.searchedRows>0&&legacyBehavior.searchedRows<=legacyBehavior.initialMenRows,`${label} search listener did not preserve filtered ranking rendering.`);
  assert(legacyBehavior.divisionRows>0,`${label} division filter listener did not render division rows.`);
  assert.equal(legacyBehavior.resetSearch,'',`${label} reset listener did not clear search.`);
  assert.equal(legacyBehavior.resetDivision,'All',`${label} reset listener did not restore division filter.`);
  assert.equal(legacyBehavior.drawerOpened,true,`${label} fighter-row profile listener did not open the drawer.`);
  assert.equal(legacyBehavior.drawerClosed,true,`${label} drawer close listener did not close the drawer.`);
  assert(legacyBehavior.refreshedRows>0,`${label} refresh() no longer renders ranking rows.`);
  assert.equal(legacyBehavior.refreshType,'function',`${label} refresh() is no longer available.`);
  for(const key of ['playPresent','picksPresent','intelligencePresent','warRoomPresent'])assert.equal(legacyBehavior[key],true,`${label} ${key} changed.`);

  await context.close();
  return{
    destinations:Object.fromEntries(Object.entries(routeResults).map(([key,value])=>[key,{active:value.active,destination:value.destination,events:value.events.length}])),
    disabledWar:{active:disabledWar.active,destination:disabledWar.destination,events:disabledWar.events.length},
    returnedRankingView:returnedRankings.rankingView,
    rapid:{events:rapid.events.length,active:rapid.active,destination:rapid.destination},
    programmatic:{events:programmatic.events.length,active:programmatic.active,destination:programmatic.destination},
    hashDriven:{events:hashDriven.events.length,active:hashDriven.active,destination:hashDriven.destination,rankingView:hashDriven.rankingView},
    legacyBehavior
  };
}

async function testTemporaryMissingShellDom(browser){
  const page=await browser.newPage();
  await page.setContent('<!doctype html><html><head></head><body></body></html>');
  await page.evaluate(()=>{
    window.__routeOwnerProof={events:[]};
    window.addEventListener('octagon-hq:view-change',event=>window.__routeOwnerProof.events.push(event.detail));
  });
  await page.addScriptTag({content:shellSource});
  let state=await page.evaluate(()=>({api:Boolean(window.UFC_APP_SHELL),started:document.documentElement.hasAttribute('data-app-shell')}));
  assert.equal(state.api,true,'Shell API was not published when DOM prerequisites were missing.');
  assert.equal(state.started,false,'Shell incorrectly reported started while DOM prerequisites were missing.');
  await page.evaluate(()=>{
    document.body.innerHTML=`
      <header class="hero"><div><p class="eyebrow"></p><h1></h1><p class="subtitle"></p></div><div class="hero-card"></div></header>
      <nav class="tabs"><button class="tab active" data-destination="home" data-view="home"></button></nav>
      <main class="shell">
        <section id="home" class="view active-view"><div id="homeDashboardMount"></div></section>
        <nav class="rankings-subnav" data-rankings-subnav></nav>
        <section class="toolbar"><input id="search"><select id="eraFilter"></select><select id="divisionFilter"></select><button id="resetBtn"></button></section>
        <section id="men" class="view"></section><section id="women" class="view"></section><section id="division" class="view"></section><section id="categories" class="view"></section><section id="play" class="view"></section><section id="picks" class="view"></section><section id="compare" class="view"></section><section id="octagon" class="view"></section>
      </main>`;
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });
  await page.waitForFunction(()=>document.documentElement.hasAttribute('data-app-shell'),null,{timeout:10000});
  await waitForFrames(page);
  state=await page.evaluate(()=>({
    active:[...document.querySelectorAll('main.shell>.view.active-view')].map(node=>node.id),
    destination:window.UFC_APP_SHELL.currentDestination,
    events:window.__routeOwnerProof.events.length
  }));
  assert.deepEqual(state.active,['home'],'Shell DOM-prerequisite recovery did not produce one complete Home activation.');
  assert.equal(state.destination,'home','Shell DOM-prerequisite recovery did not publish matching canonical state.');
  assert.equal(state.events,1,'Shell DOM-prerequisite recovery emitted the wrong number of route events.');
  await page.close();
  return state;
}

async function testRecoveryVariant(browser,label,source){
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await instrument(page);
  await installAppVariant(page,source);

  let shellRequests=0;
  let releaseRecovery;
  const recoveryReleased=new Promise(resolve=>{releaseRecovery=resolve;});
  let markSecondRequest;
  const secondRequestSeen=new Promise(resolve=>{markSecondRequest=resolve;});
  await page.route('**/assets/js/octagon-hq-shell.js*',async route=>{
    shellRequests+=1;
    if(shellRequests===1){
      await route.fulfill({
        status:200,
        contentType:'application/javascript',
        body:`const failedShellScript=document.currentScript;failedShellScript.dataset.routeOwnerProofFailure='true';queueMicrotask(()=>failedShellScript.remove());`
      });
      return;
    }
    markSecondRequest();
    await recoveryReleased;
    await route.fulfill({status:200,contentType:'application/javascript',body:shellSource});
  });

  const navigation=page.goto(baseUrl,{waitUntil:'domcontentloaded',timeout:60000});
  await secondRequestSeen;
  await page.waitForFunction(()=>typeof window.refresh==='function'&&window.UFC_PRODUCT_ARCHITECTURE?.compatibilityOnly===true,null,{timeout:60000});
  await clearTelemetry(page);

  const attempted=['rankings','play','picks','intelligence','rankings'];
  await page.evaluate(sequence=>{
    sequence.forEach(destination=>{
      const button=document.querySelector(`nav.tabs [data-destination="${destination}"]`);
      button.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
    });
  },attempted);
  await page.waitForTimeout(80);
  const during=await page.evaluate(()=>({
    active:[...document.querySelectorAll('main.shell>.view.active-view')].map(node=>node.id),
    selectedTop:[...document.querySelectorAll('nav.tabs .tab.active')].map(node=>node.dataset.destination||node.dataset.view||''),
    shellApi:Boolean(window.UFC_APP_SHELL),
    facade:Boolean(window.UFC_PRODUCT_ARCHITECTURE?.compatibilityOnly),
    events:window.__routeOwnerProof.events.length,
    hash:location.hash
  }));

  releaseRecovery();
  await navigation;
  await page.waitForFunction(()=>window.UFC_APP_SHELL&&!window.UFC_PRODUCT_ARCHITECTURE?.compatibilityOnly&&document.documentElement.hasAttribute('data-app-shell'),null,{timeout:60000});
  await waitForFrames(page);
  const recovered=await routeState(page);

  const afterRecovery=await clickDestination(page,'rankings');
  assertSingleActivation(afterRecovery,{destination:'rankings',view:'men',rankingView:'men'});

  await clearTelemetry(page);
  const rapidAfter=['home','rankings','play','picks','intelligence','rankings'];
  await page.evaluate(sequence=>sequence.forEach(destination=>document.querySelector(`nav.tabs [data-destination="${destination}"]`).click()),rapidAfter);
  await waitForFrames(page);
  const rapid=await routeState(page);
  assert.equal(rapid.events.length,rapidAfter.length,`${label} rapid taps after shell recovery were lost or duplicated.`);
  assert.deepEqual(rapid.active,['men'],`${label} rapid taps after shell recovery left a stale or partial active view.`);
  assert.equal(rapid.destination,'rankings',`${label} rapid taps after shell recovery did not match canonical state.`);

  const result={
    shellRequests,
    attempted,
    during,
    recovered:{active:recovered.active,destination:recovered.destination,events:recovered.events.length,hash:recovered.hash},
    afterRecovery:{active:afterRecovery.active,destination:afterRecovery.destination,events:afterRecovery.events.length},
    rapidAfter:{active:rapid.active,destination:rapid.destination,events:rapid.events.length},
    partialLegacyOnly:during.active.length===1&&during.active[0]!=='home'&&!during.shellApi&&during.events===0,
    activationReplayed:recovered.destination==='rankings'&&recovered.active.length===1&&recovered.active[0]==='men',
    activationLost:attempted.length>0&&!(recovered.destination==='rankings'&&recovered.active.length===1&&recovered.active[0]==='men')
  };
  await context.close();
  return result;
}

let browser;
try{
  browser=await chromium.launch({headless:true});
  const normalBaseline=await testNormalVariant(browser,'baseline',appSource);
  const normalCandidate=await testNormalVariant(browser,'candidate',candidateSource);
  assert.deepEqual(normalCandidate,normalBaseline,'Removing only the legacy app.js tab block changed normal canonical route or legacy rendering/control behavior.');

  const missingDom=await testTemporaryMissingShellDom(browser);
  const recoveryBaseline=await testRecoveryVariant(browser,'baseline',appSource);
  const recoveryCandidate=await testRecoveryVariant(browser,'candidate',candidateSource);

  assert.equal(recoveryBaseline.partialLegacyOnly,true,'Baseline did not reproduce the legacy-only partial navigation during shell recovery.');
  assert.equal(recoveryCandidate.partialLegacyOnly,false,'Candidate unexpectedly performed partial legacy-only navigation during shell recovery.');
  assert.deepEqual(recoveryBaseline.recovered,{active:['home'],destination:'home',events:1,hash:'#home'},'Baseline shell recovery did not converge to one canonical Home route.');
  assert.deepEqual(recoveryCandidate.recovered,{active:['home'],destination:'home',events:1,hash:'#home'},'Candidate shell recovery did not converge to one canonical Home route.');

  const report={
    passedNormalCanonicalOwnership:true,
    passedRankingSubviewPreservation:true,
    passedLegacyRenderingAndControls:true,
    passedTemporaryMissingDomRecovery:true,
    missingDom,
    recoveryBaseline,
    recoveryCandidate,
    candidateSafeToRemove:!recoveryCandidate.activationLost&&!recoveryCandidate.partialLegacyOnly
  };
  console.log(JSON.stringify(report,null,2));

  assert.equal(
    recoveryCandidate.activationLost,
    false,
    'STOP CONDITION: a primary top-navigation activation attempted while product-architecture shell recovery was in flight was not queued or replayed after the canonical shell recovered.'
  );
  assert.equal(report.candidateSafeToRemove,true,'The isolated app.js legacy listener removal is not proven safe.');
}finally{
  if(browser)await browser.close();
}

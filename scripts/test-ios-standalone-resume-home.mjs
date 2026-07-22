import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const failures=[];
const capture=(stage,error)=>failures.push({stage,name:error?.name||'Error',message:error?.message||String(error),stack:error?.stack||''});
const runImport=async(stage,path)=>{try{await import(path);}catch(error){capture(stage,error);}};

await runImport('fresh-launch-route-contract','./test-fresh-launch-route-ownership-contract.mjs');

const supabaseStub=`
window.supabase={createClient(){
  const chain={select(){return chain;},eq(){return chain;},order(){return Promise.resolve({data:[],error:null});},limit(){return Promise.resolve({data:null,error:null});},single(){return Promise.resolve({data:null,error:null});}};
  return{rpc:async()=>({data:null,error:null}),from:()=>chain,channel(){return{on(){return this;},subscribe(){return this;}}},removeChannel:async()=>{}};
}};
`;

let browser;
try{
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await page.addInitScript(()=>{
    Object.defineProperty(window.navigator,'standalone',{configurable:true,get:()=>true});
    window.__viewChanges=[];
    window.addEventListener('octagon-hq:view-change',event=>window.__viewChanges.push({destination:event.detail?.destination||'',at:Date.now()}));
  });
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',route=>route.fulfill({status:200,contentType:'application/javascript',body:supabaseStub}));

  const stale='http://127.0.0.1:4173/index.html?group=GOAT26#picks';
  await page.goto(stale,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_APP_SHELL&&window.UFC_FRESH_HOME_LAUNCH,null,{timeout:60000});
  await page.waitForFunction(()=>document.querySelector('#home')?.classList.contains('active-view'),null,{timeout:10000});

  const startup=await page.evaluate(()=>({
    url:location.href,
    bootstrapRoute:document.documentElement.dataset.freshHomeBootstrapRoute||'',
    route:document.documentElement.dataset.freshLaunchRoute||'',
    active:[...document.querySelectorAll('main.shell>.view.active-view')].map(node=>node.id)
  }));
  const startupUrl=new URL(startup.url);
  assert.equal(startupUrl.hash,'#home','A group-only standalone Picks restore was not normalized before app startup.');
  assert.equal(startupUrl.searchParams.has('group'),false,'Startup retained the stale standalone group.');
  assert.equal(startupUrl.searchParams.has('invite'),false,'Startup retained a consumed or stale invite marker.');
  assert.equal(startup.bootstrapRoute,'home','Early route bootstrap did not classify the group-only restore as Home.');
  assert.equal(startup.route,'home','Late launch controller did not remain on Home.');
  assert.deepEqual(startup.active,['home'],'Home was not the only active startup view.');

  await page.evaluate(()=>window.UFC_APP_SHELL.activateDestination('rankings'));
  await page.waitForFunction(()=>document.querySelector('#men')?.classList.contains('active-view'),null,{timeout:10000});
  await page.waitForFunction(()=>window.__viewChanges.at(-1)?.destination==='rankings',null,{timeout:10000});
  const baselineChanges=await page.evaluate(()=>window.__viewChanges.length);

  for(let index=0;index<3;index+=1){
    await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));
    await page.waitForTimeout(650);
    await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));
    await page.waitForTimeout(650);
  }
  await page.waitForTimeout(5000);

  const stable=await page.evaluate(()=>({
    url:location.href,
    active:[...document.querySelectorAll('main.shell>.view.active-view')].map(node=>node.id),
    viewChanges:window.__viewChanges.length,
    freshSource:document.documentElement.dataset.freshLaunchSource||''
  }));
  assert.deepEqual(stable.active,['men'],'Visibility/page lifecycle churn repeatedly reset the active view.');
  assert.equal(stable.viewChanges,baselineChanges,'Lifecycle churn emitted additional route changes.');
  assert.notEqual(stable.freshSource,'standalone-pageshow-resume','Removed pageshow resume handler is still active.');
}catch(error){
  capture('standalone-resume-home',error);
}finally{
  if(browser)await browser.close();
}

let coldBrowser;
try{
  coldBrowser=await chromium.launch({headless:true});
  const context=await coldBrowser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'allow'});
  await context.addInitScript(()=>{
    Object.defineProperty(window.navigator,'standalone',{configurable:true,get:()=>true});
  });
  await context.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',route=>route.fulfill({status:200,contentType:'application/javascript',body:supabaseStub}));
  const warm=await context.newPage();
  await warm.goto('http://127.0.0.1:4173/index.html#home',{waitUntil:'domcontentloaded',timeout:60000});
  await warm.waitForFunction(()=>window.UFC_APP_SHELL&&window.UFC_HOME_DASHBOARD,null,{timeout:60000});
  await warm.evaluate(async()=>{
    await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
    await navigator.serviceWorker.ready;
  });
  if(!await warm.evaluate(()=>Boolean(navigator.serviceWorker.controller))){
    await warm.reload({waitUntil:'domcontentloaded',timeout:60000});
  }
  await warm.waitForFunction(()=>Boolean(navigator.serviceWorker.controller),null,{timeout:60000});
  await warm.waitForFunction(async()=>{
    const keys=await caches.keys();
    return keys.includes('octagon-hq-static-v20');
  },null,{timeout:60000});

  const cachedShell=await warm.evaluate(async()=>{
    const cache=await caches.open('octagon-hq-static-v20');
    const paths=[
      'index.html',
      'assets/css/app.css',
      'assets/css/home-dashboard.css',
      'assets/css/native-app-shell-stability.css',
      'assets/css/product-polish.css',
      'assets/js/fresh-home-route-bootstrap.js',
      'assets/js/octagon-hq-shell.js',
      'assets/data/ranking-data.js',
      'assets/data/display-overrides.js',
      'assets/js/app.js',
      'assets/data/play-data.js',
      'assets/data/picks-events.js',
      'assets/js/home-dashboard.js',
      'assets/js/native-app-shell.js'
    ];
    const entries={};
    for(const path of paths){
      const request=new Request(new URL(path,location.href));
      entries[path]=Boolean(await cache.match(request,{ignoreSearch:true}));
    }
    return entries;
  });
  assert(Object.values(cachedShell).every(Boolean),`Cold-launch shell was not fully cached: ${JSON.stringify(cachedShell)}`);

  await context.unroute('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
  await context.setOffline(true);
  await warm.close();

  const cold=await context.newPage();
  const failed=[];
  cold.on('requestfailed',request=>failed.push({url:request.url(),error:request.failure()?.errorText||''}));
  await cold.goto('http://127.0.0.1:4173/index.html?group=GOAT26#picks',{waitUntil:'domcontentloaded',timeout:60000});
  await cold.waitForFunction(()=>window.UFC_APP_SHELL&&window.UFC_HOME_DASHBOARD,null,{timeout:60000});
  await cold.waitForFunction(()=>document.querySelector('#home')?.classList.contains('active-view')&&document.querySelector('#homeDashboardMount .home-dashboard'),null,{timeout:30000});

  const coldLaunch=await cold.evaluate(()=>({
    url:location.href,
    active:[...document.querySelectorAll('main.shell>.view.active-view')].map(node=>node.id),
    dashboardText:document.querySelector('#homeDashboardMount')?.textContent||'',
    dashboardHeight:Math.round(document.querySelector('#homeDashboardMount')?.getBoundingClientRect().height||0),
    bodyHeight:Math.round(document.body.getBoundingClientRect().height||0),
    shellVersion:document.documentElement.dataset.nativeAppShell||'',
    homeVersion:document.documentElement.getAttribute('data-home-dashboard')||''
  }));
  const coldUrl=new URL(coldLaunch.url);
  assert.equal(coldUrl.hash,'#home','Offline standalone restore did not normalize to Home.');
  assert.equal(coldUrl.searchParams.has('group'),false,'Offline standalone restore retained the stale Picks group.');
  assert.deepEqual(coldLaunch.active,['home'],'Offline cold launch did not leave Home as the only active view.');
  assert.match(coldLaunch.dashboardText,/Find the Leader/i,'Offline cold launch did not paint visible Home content.');
  assert(coldLaunch.dashboardHeight>100&&coldLaunch.bodyHeight>300,`Offline cold launch rendered an empty black canvas: ${JSON.stringify(coldLaunch)}`);
  assert(coldLaunch.shellVersion&&coldLaunch.homeVersion,'Offline cold launch did not initialize the mobile shell and Home renderer.');
  const criticalFailures=failed.filter(row=>/\/(?:assets\/(?:css\/(?:app|home-dashboard|native-app-shell|native-app-shell-stability|product-polish)|js\/(?:fresh-home-route-bootstrap|octagon-hq-shell|home-dashboard|native-app-shell)|data\/(?:ranking-data|display-overrides|play-data|picks-events))|index\.html)(?:\?|$)/.test(row.url));
  assert.deepEqual(criticalFailures,[],'Offline cold launch failed a critical cached request.');
  await context.close();
}catch(error){
  capture('service-worker-offline-cold-launch',error);
}finally{
  if(coldBrowser)await coldBrowser.close();
}

const imports=[
  ['installed-shell-offline-cache','./test-installed-shell-offline-cache.mjs'],
  ['fresh-launch-route-owner','./test-fresh-launch-route-ownership.mjs'],
  ['native-shell-spotlight-owner','./test-native-shell-stability-spotlight-owner.mjs'],
  ['native-shell-profile-owner','./test-native-shell-stability-profile-owner.mjs'],
  ['native-shell-whats-new-owner','./test-native-shell-stability-whats-new-owner.mjs'],
  ['native-shell-drawer-owner','./test-native-shell-stability-drawer-owner.mjs'],
  ['native-pull-refresh-owner','./test-native-pull-refresh-ownership.mjs'],
  ['picks-commissioner-owner','./test-picks-commissioner-active-owner.mjs'],
  ['native-shell-startup-resync-owner','./test-native-shell-startup-resync-owner.mjs'],
  ['octagon-notification-startup-retry-owner','./test-octagon-notification-startup-retry-owner.mjs'],
  ['octagon-access-startup-retry-owner','./test-octagon-access-startup-retry-owner.mjs'],
  ['octagon-board-startup-retry-owner','./test-octagon-board-startup-retry-owner.mjs'],
  ['picks-persistent-groups-owner','./test-picks-persistent-groups-active-owner.mjs'],
  ['picks-social-owner','./test-picks-social-active-owner.mjs'],
  ['product-startup-handoff-contract','./test-product-startup-handoff-contract.mjs'],
  ['better-than-find-leader-owner','./test-better-than-find-leader-owner.mjs'],
  ['better-than-photo-authority-owner','./test-better-than-photo-authority-owner.mjs'],
  ['picks-mobile-top-tabs','./test-picks-mobile-top-tabs.mjs']
];
for(const [stage,path] of imports)await runImport(stage,path);

fs.writeFileSync('/tmp/profile-signin-stability-report.json',JSON.stringify({proof:'ios-startup-aggregate',failures},null,2));
if(failures.length)throw new AggregateError(failures.map(row=>new Error(`${row.stage}: ${row.message}`)),`${failures.length} iOS aggregate check${failures.length===1?'':'s'} failed.`);

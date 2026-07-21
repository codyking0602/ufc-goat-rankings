import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base='http://127.0.0.1:4173/index.html';
const stub="window.supabase={createClient(){const c={select(){return c},eq(){return c},order(){return Promise.resolve({data:[],error:null})},limit(){return Promise.resolve({data:[],error:null})},single(){return Promise.resolve({data:null,error:null})}};return{rpc:async()=>({data:null,error:null}),from:()=>c,channel(){return{on(){return this},subscribe(){return this}}},removeChannel:async()=>{}}}};";

async function pageFor(context){
  const page=await context.newPage();
  await page.addInitScript(()=>{
    window.__freshLaunchRouteEvents=[];
    window.addEventListener('octagon-hq:view-change',event=>window.__freshLaunchRouteEvents.push({destination:event.detail?.destination||'',view:event.detail?.view||''}));
  });
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',route=>route.fulfill({status:200,contentType:'application/javascript',body:stub}));
  return page;
}

async function ready(page){
  await page.waitForFunction(()=>window.UFC_APP_SHELL&&window.UFC_FRESH_HOME_LAUNCH,null,{timeout:60000});
  await page.waitForTimeout(400);
}

const snap=page=>page.evaluate(()=>({
  destination:window.UFC_APP_SHELL.currentDestination,
  active:[...document.querySelectorAll('main.shell>.view.active-view')].map(node=>node.id),
  events:[...window.__freshLaunchRouteEvents],
  navigationType:window.UFC_FRESH_HOME_LAUNCH.navigationType
}));

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});

  const home=await pageFor(context);
  await home.goto(`${base}?freshLaunchRouteOwner=home`,{waitUntil:'domcontentloaded',timeout:60000});
  await ready(home);
  const homeStart=await snap(home);
  assert.equal(homeStart.destination,'home');
  assert.deepEqual(homeStart.active,['home']);
  assert.deepEqual(homeStart.events,[{destination:'home',view:'home'}]);
  await home.evaluate(()=>window.UFC_FRESH_HOME_LAUNCH.activateHome('proof'));
  await home.waitForTimeout(100);
  assert.equal((await snap(home)).events.length,1,'Already-active Home emitted a duplicate route event.');
  await home.evaluate(()=>window.UFC_FRESH_HOME_LAUNCH.activatePicks('proof'));
  await home.waitForTimeout(100);
  await home.evaluate(()=>window.UFC_FRESH_HOME_LAUNCH.activatePicks('proof-repeat'));
  await home.waitForTimeout(100);
  const direct=await snap(home);
  assert.equal(direct.destination,'picks');
  assert.equal(direct.events.length,2,'Picks should receive one real handoff and no duplicate repeat.');
  await home.close();

  const reload=await pageFor(context);
  await reload.goto(`${base}?freshLaunchRouteOwner=reload#home`,{waitUntil:'domcontentloaded',timeout:60000});
  await ready(reload);
  await reload.evaluate(()=>history.replaceState(history.state,'',`${location.pathname}${location.search}#picks`));
  await reload.reload({waitUntil:'domcontentloaded',timeout:60000});
  await ready(reload);
  const picksReload=await snap(reload);
  assert.equal(picksReload.navigationType,'reload');
  assert.equal(picksReload.destination,'picks');
  assert.deepEqual(picksReload.active,['picks']);
  assert.deepEqual(picksReload.events,[{destination:'picks',view:'picks'}]);
  await reload.close();

  const invite=await pageFor(context);
  await invite.goto(`${base}?group=GOAT26&freshLaunchRouteOwner=invite`,{waitUntil:'domcontentloaded',timeout:60000});
  await ready(invite);
  const bareInvite=await snap(invite);
  assert.equal(bareInvite.destination,'picks');
  assert.deepEqual(bareInvite.active,['picks']);
  assert.deepEqual(bareInvite.events,[{destination:'home',view:'home'},{destination:'picks',view:'picks'}]);
  await invite.close();

  await context.close();
  console.log(JSON.stringify({passed:true,home:homeStart.events,direct:direct.events,reload:picksReload.events,invite:bareInvite.events},null,2));
}finally{
  await browser.close();
}

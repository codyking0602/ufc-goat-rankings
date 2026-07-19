import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const supabaseStub=`
window.supabase={createClient(){
  const chain={select(){return chain;},eq(){return chain;},order(){return Promise.resolve({data:[],error:null});},limit(){return Promise.resolve({data:[],error:null});},single(){return Promise.resolve({data:null,error:null});}};
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

  const stale='http://127.0.0.1:4173/index.html?group=GOAT26&room=ROOM01&event=event-1&picksView=event#picks';
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
  assert.equal(startupUrl.hash,'#home','Stale standalone Picks route was not normalized before app startup.');
  for(const key of ['group','room','event','picksView'])assert.equal(startupUrl.searchParams.has(key),false,`Startup retained stale ${key}.`);
  assert.equal(startup.bootstrapRoute,'home','Early route bootstrap did not classify the launch as Home.');
  assert.equal(startup.route,'home','Late launch controller did not remain on Home.');
  assert.deepEqual(startup.active,['home'],'Home was not the only active startup view.');

  await page.evaluate(()=>window.UFC_APP_SHELL.activateDestination('rankings'));
  await page.waitForFunction(()=>document.querySelector('#men')?.classList.contains('active-view'),null,{timeout:10000});
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
}finally{
  if(browser)await browser.close();
}

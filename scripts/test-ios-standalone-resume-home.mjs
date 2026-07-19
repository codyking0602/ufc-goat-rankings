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
  });
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',route=>route.fulfill({status:200,contentType:'application/javascript',body:supabaseStub}));
  await page.goto('http://127.0.0.1:4173/index.html#home',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_APP_SHELL&&window.UFC_FRESH_HOME_LAUNCH,null,{timeout:60000});

  await page.evaluate(()=>window.UFC_APP_SHELL.activateDestination('picks'));
  await page.waitForFunction(()=>document.querySelector('#picks')?.classList.contains('active-view'),null,{timeout:10000});
  assert.equal(new URL(page.url()).hash,'#picks','Test did not reach Picks before suspension.');

  await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));
  await page.waitForTimeout(700);
  await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));
  await page.waitForFunction(()=>document.querySelector('#home')?.classList.contains('active-view'),null,{timeout:10000});

  const result=await page.evaluate(()=>({
    url:location.href,
    route:document.documentElement.dataset.freshLaunchRoute||'',
    source:document.documentElement.dataset.freshLaunchSource||'',
    active:[...document.querySelectorAll('main.shell>.view.active-view')].map(node=>node.id)
  }));
  const url=new URL(result.url);
  assert.equal(url.hash,'#home','Suspended standalone app did not resume on Home.');
  assert.equal(url.searchParams.has('group'),false,'Suspended resume kept a Picks group route.');
  assert.equal(url.searchParams.has('room'),false,'Suspended resume kept a Picks room route.');
  assert.equal(url.searchParams.has('event'),false,'Suspended resume kept a Picks event route.');
  assert.equal(url.searchParams.has('picksView'),false,'Suspended resume kept an internal Picks view.');
  assert.equal(result.route,'home','Resume controller did not classify the restored view as Home.');
  assert.equal(result.source,'standalone-pageshow-resume','Resume controller did not use the standalone pageshow path.');
  assert.deepEqual(result.active,['home'],'Home was not the only active view after resume.');
}finally{
  if(browser)await browser.close();
}

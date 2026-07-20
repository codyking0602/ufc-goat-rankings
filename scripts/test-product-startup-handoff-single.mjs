import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const ORIGIN='http://127.0.0.1:4173';
const REPORT='/tmp/product-startup-handoff-single-report.json';
const report={passed:false,stage:'boot',uncached:null,cached:null,error:null};
let browser;

function html(mode){
  const cached=mode==='cached';
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Product startup handoff ${mode}</title></head>
<body>
  <div id="picksPinSignInCard">Sign in</div>
  <section id="picks"></section>
  <script>
  (function(){
    const identity=token=>({ok:true,group:{code:'GOAT26'},member:{id:'m1',display_name:'Cody'},member_token:token,rooms:[]});
    window.__PRODUCT_STARTUP_HANDOFF__={mode:${JSON.stringify(mode)},resolves:0,readyEvents:0,refreshes:0};
    window.UFC_PLAY_SUPABASE_CONFIG={url:'https://proof.supabase.co',anonKey:'proof-key'};
    window.supabase={createClient(){return{async rpc(name,args){
      if(name==='app_profile_resolve'||name==='play_identity_snapshot'){
        window.__PRODUCT_STARTUP_HANDOFF__.resolves+=1;
        return{data:identity(args?.p_member_token),error:null};
      }
      return{data:{ok:true},error:null};
    }}}};
    window.UFC_APP_SHELL={start(){return true;},activateView(){return true;},activateDestination(){return true;},loadPlaySupport(){return true;}};
    window.UFC_PRODUCT_CONNECTIVITY={};
    window.UFC_PRODUCT_POLISH={};
    window.UFC_PROFILE_AVATAR_SYNC={};
    window.UFC_PROFILE_ACTIVITY={};
    window.UFC_FIND_LEADER_RETENTION={};
    window.UFC_PICKS_SEASON_LOOP={};
    window.UFC_APP_PROFILE={identity:null};
    window.UFCPicksPinAuth={refresh(){window.__PRODUCT_STARTUP_HANDOFF__.refreshes+=1;}};
    window.addEventListener('ufc-play-profile-ready',()=>{window.__PRODUCT_STARTUP_HANDOFF__.readyEvents+=1;});
    localStorage.setItem('ufc-picks:group:GOAT26','startup-handoff-token');
  })();
  </script>
  <script src="/assets/js/play-profile-identity.js"></script>
  ${cached?`<script>
    (async()=>{
      await window.UFC_PLAY_PROFILE.resolve();
      const script=document.createElement('script');
      script.src='/assets/js/product-architecture.js';
      document.body.appendChild(script);
    })();
  </script>`:`<script src="/assets/js/product-architecture.js"></script>`}
</body></html>`;
}

async function runScenario(mode){
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const page=await context.newPage();
  const url=`${ORIGIN}/product-startup-handoff-${mode}.html`;
  await page.route(url,route=>route.fulfill({status:200,contentType:'text/html',body:html(mode)}));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>document.documentElement.dataset.productArchitecture&&window.__PRODUCT_STARTUP_HANDOFF__?.refreshes>=1,null,{timeout:30000});
  await page.waitForTimeout(100);
  const result=await page.evaluate(()=>({
    resolves:window.__PRODUCT_STARTUP_HANDOFF__.resolves,
    readyEvents:window.__PRODUCT_STARTUP_HANDOFF__.readyEvents,
    refreshes:window.__PRODUCT_STARTUP_HANDOFF__.refreshes,
    sharedAuth:document.documentElement.dataset.sharedProfileAuth||'',
    productVersion:document.documentElement.dataset.productArchitecture||''
  }));
  await context.close();
  return result;
}

try{
  browser=await chromium.launch({headless:true});

  report.stage='uncached-startup';
  report.uncached=await runScenario('uncached');
  assert.equal(report.uncached.resolves,1,'Uncached Product startup must request one canonical identity snapshot.');
  assert.equal(report.uncached.readyEvents,1,'Uncached Product startup must receive one canonical ready publication.');
  assert.equal(report.uncached.refreshes,1,'One uncached canonical resolve must produce exactly one Product Picks refresh.');
  assert.equal(report.uncached.sharedAuth,'true','Uncached startup must retain duplicate Picks-card suppression.');

  report.stage='cached-startup';
  report.cached=await runScenario('cached');
  assert.equal(report.cached.resolves,1,'Cached scenario setup must resolve identity once before Product loads.');
  assert.equal(report.cached.readyEvents,1,'Cached scenario must publish readiness only during setup.');
  assert.equal(report.cached.refreshes,1,'Product must directly hand off an already-cached identity exactly once.');
  assert.equal(report.cached.sharedAuth,'true','Cached startup must retain duplicate Picks-card suppression.');

  report.passed=true;
  report.stage='complete';
  console.log('Product single startup handoff proof passed.');
}catch(error){
  report.error={message:error?.message||String(error),stack:error?.stack||null};
  throw error;
}finally{
  fs.writeFileSync(REPORT,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}

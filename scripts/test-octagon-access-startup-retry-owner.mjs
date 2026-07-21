import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const ORIGIN='http://127.0.0.1:4173';
const UNCACHED=`${ORIGIN}/octagon-access-startup-uncached-proof.html`;
const PRECACHED=`${ORIGIN}/octagon-access-startup-precached-proof.html`;
const REPORT='/tmp/octagon-access-startup-retry-owner-report.json';
const report={passed:false,stage:'static-contract',uncached:null,readiness:null,precached:null,error:null};
let browser;

const source=fs.readFileSync('assets/js/octagon-access-panel.js','utf8');
assert.match(source,/octagon-access-panel-20260721c-single-startup-access-check/,'Corrected access runtime version is missing.');
assert.doesNotMatch(source,/\[0,250,900,2600,5000\]/,'Repeated startup access checks remain.');
assert.match(source,/setInterval\(\(\)=>\{[\s\S]*if\(!document\.hidden\)checkCurrentAccess\(\);[\s\S]*\},60000\)/,'The separate 60-second access poll changed.');

const identity={
  ok:true,
  group:{code:'GOAT26'},
  groupCode:'GOAT26',
  member:{id:'m1',display_name:'Cody',is_admin:true},
  memberToken:'access-startup-token',
  member_token:'access-startup-token'
};
const status={ok:true,can_access:true,member:{id:'m1',display_name:'Cody',is_admin:true}};

function html(cached){return `<!doctype html><html><head><meta charset="utf-8"><title>Octagon access startup retries</title></head><body>
  <button type="button" class="tab" data-octagon-beta-tab disabled aria-disabled="true">War Room</button>
  <section id="octagon"><section data-octagon-board><header class="octagon-board-head"><div class="octagon-board-head-actions"><button type="button" data-octagon-refresh>Refresh</button></div></header></section></section>
  <script>
    window.__ACCESS_IDENTITY__=${JSON.stringify(identity)};
    window.__ACCESS_STATUS__=${JSON.stringify(status)};
    window.__ACCESS_STARTUP_PROOF__={rpcs:[],channels:0,canonicalResolves:0,canonicalRequires:0,editorResolves:0};
    const proof=window.__ACCESS_STARTUP_PROOF__;
    const identity=window.__ACCESS_IDENTITY__;
    const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
    const channel={on(){return this;},subscribe(){return this;},async send(){return'ok';},async unsubscribe(){return'ok';}};
    const client={
      async rpc(name,args){
        proof.rpcs.push({name,args});
        if(name==='octagon_access_status'){await sleep(80);return{data:structuredClone(window.__ACCESS_STATUS__),error:null};}
        return{data:{ok:true,members:[]},error:null};
      },
      channel(){proof.channels+=1;return channel;},
      async removeChannel(){return'ok';}
    };
    window.UFC_PLAY_PROFILE={identity:${cached?'identity':'null'},client,async resolve(){proof.canonicalResolves+=1;return identity;},async require(){proof.canonicalRequires+=1;return identity;}};
    window.UFC_APP_PROFILE={identity:${cached?'identity':'null'},async resolve(){proof.editorResolves+=1;return identity;}};
  </script>
  <script src="/assets/js/octagon-access-panel.js"></script>
</body></html>`;}

async function snapshot(page){
  return page.evaluate(()=>({
    ...window.__ACCESS_STARTUP_PROOF__,
    canAccess:Boolean(window.UFC_OCTAGON_ACCESS?.canAccess),
    betaDisabled:document.querySelector('[data-octagon-beta-tab]')?.disabled,
    betaAccess:document.querySelector('[data-octagon-beta-tab]')?.dataset.betaAccess||'',
    manageButtons:document.querySelectorAll('[data-octagon-manage-beta]').length,
    manageHidden:document.querySelector('[data-octagon-manage-beta]')?.hidden,
    panels:document.querySelectorAll('[data-octagon-access-panel]').length,
    panelHidden:document.querySelector('[data-octagon-access-panel]')?.hidden
  }));
}

async function openPage(context,url,cached){
  const page=await context.newPage();
  await page.route(url,route=>route.fulfill({status:200,contentType:'text/html',body:html(cached)}));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_OCTAGON_ACCESS&&window.__ACCESS_STARTUP_PROOF__,null,{timeout:10000});
  return page;
}

try{
  report.stage='browser-launch';
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});

  const uncached=await openPage(context,UNCACHED,false);
  report.stage='uncached-window';
  await uncached.waitForTimeout(5300);
  report.uncached=await snapshot(uncached);
  assert.equal(report.uncached.rpcs.filter(row=>row.name==='octagon_access_status').length,0,'Uncached startup performed an access RPC during the retired retry window.');
  assert.equal(report.uncached.manageButtons,1,'The Manage Beta shell must be created once.');
  assert.equal(report.uncached.manageHidden,true,'Manage Beta must remain hidden before verified Cody access.');
  assert.equal(report.uncached.panels,1,'The access panel shell must be created once.');
  assert.equal(report.uncached.betaDisabled,true,'War Room must remain locked before verified access.');
  assert.equal(report.uncached.canonicalResolves,0);
  assert.equal(report.uncached.canonicalRequires,0);
  assert.equal(report.uncached.editorResolves,0);

  report.stage='readiness-handoff';
  await uncached.evaluate(()=>{
    window.UFC_PLAY_PROFILE.identity=window.__ACCESS_IDENTITY__;
    window.UFC_APP_PROFILE.identity=window.__ACCESS_IDENTITY__;
    window.__ACCESS_STARTUP_PROOF__.rpcs=[];
    window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:window.__ACCESS_IDENTITY__}));
  });
  await uncached.waitForFunction(()=>window.UFC_OCTAGON_ACCESS?.canAccess===true,null,{timeout:10000});
  report.readiness=await snapshot(uncached);
  const readinessRpcs=report.readiness.rpcs.filter(row=>row.name==='octagon_access_status');
  assert.equal(readinessRpcs.length,1,'One readiness event must produce one access-status RPC.');
  assert.equal(readinessRpcs[0]?.args?.p_member_token,'access-startup-token');
  assert.equal(report.readiness.betaDisabled,false);
  assert.equal(report.readiness.betaAccess,'owner');
  assert.equal(report.readiness.manageHidden,false,'Cody must retain the Manage Beta control after verification.');
  assert.equal(report.readiness.channels,1,'Verified access must establish one realtime channel.');

  const precached=await openPage(context,PRECACHED,true);
  report.stage='precached-window';
  await precached.waitForFunction(()=>window.UFC_OCTAGON_ACCESS?.canAccess===true,null,{timeout:10000});
  await precached.waitForTimeout(5300);
  report.precached=await snapshot(precached);
  const precachedRpcs=report.precached.rpcs.filter(row=>row.name==='octagon_access_status');
  assert.equal(precachedRpcs.length,1,'Pre-cached identity must produce exactly one startup access-status RPC through the former retry window.');
  assert.equal(precachedRpcs[0]?.args?.p_member_token,'access-startup-token');
  assert.equal(report.precached.manageButtons,1);
  assert.equal(report.precached.panels,1);
  assert.equal(report.precached.manageHidden,false);
  assert.equal(report.precached.channels,1);
  assert.equal(report.precached.canonicalResolves,0);
  assert.equal(report.precached.canonicalRequires,0);
  assert.equal(report.precached.editorResolves,0);

  report.passed=true;
  report.stage='complete';
  console.log('Octagon access startup retry ownership proof passed.');
  await context.close();
}catch(error){
  report.error={message:error?.message||String(error),stack:error?.stack||null};
  throw error;
}finally{
  fs.writeFileSync(REPORT,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}

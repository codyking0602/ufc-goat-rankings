import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const SOURCE_PATH='assets/js/octagon-access-panel.js';
const BASE='http://127.0.0.1:4173/octagon-access-identity-owner-proof.html';
const REPORT='/tmp/octagon-access-identity-owner-report.json';
const report={passed:false,stage:'static-contract',initial:null,readiness:null,concurrent:null,interactive:null,error:null};
let browser;

const source=fs.readFileSync(SOURCE_PATH,'utf8');
assert.match(source,/function cachedIdentity\(\)[\s\S]*UFC_PLAY_PROFILE\?\.identity[\s\S]*UFC_APP_PROFILE\?\.identity/,'Octagon access must consume published identity caches.');
assert.doesNotMatch(source,/UFC_PLAY_PROFILE\?\.resolve\?\.\(/,'Octagon access must not invoke the canonical resolver.');
assert.doesNotMatch(source,/UFC_APP_PROFILE\?\.resolve\?\.\(/,'Octagon access must not invoke the profile editor resolver.');
assert.doesNotMatch(source,/localStorage\.getItem\(/,'Octagon access must not read canonical access from storage.');
assert.match(source,/async function interactiveContext\(\)[\s\S]*UFC_PLAY_PROFILE[\s\S]*require\?\.\(/,'Explicit admin actions may require identity through the canonical owner.');

const html=`<!doctype html>
<html><head><meta charset="utf-8"><title>Octagon access identity ownership</title></head>
<body>
  <button type="button" data-octagon-beta-tab disabled>Beta</button>
  <section data-octagon-board>
    <header class="octagon-board-head"><div class="octagon-board-head-actions"><button data-octagon-refresh>Refresh</button></div></header>
  </section>
  <script>
  (function(){
    const identity={memberToken:'octagon-access-token',member_token:'octagon-access-token',member:{id:'m1',display_name:'Cody',is_admin:true}};
    const ok=data=>({data,error:null});
    window.__OCTAGON_ACCESS_PROOF__={canonicalResolves:0,canonicalRequires:0,editorResolves:0,rpcs:[],channels:0,identity};
    const proof=window.__OCTAGON_ACCESS_PROOF__;
    const client={
      async rpc(name,args){
        proof.rpcs.push({name,args});
        if(name==='octagon_access_status'){
          await new Promise(resolve=>setTimeout(resolve,140));
          return ok({ok:true,member:{id:'m1',display_name:'Cody',is_admin:true},can_access:true});
        }
        if(name==='octagon_admin_access_roster')return ok({ok:true,members:[{id:'m1',display_name:'Cody',is_admin:true,can_access:true},{id:'m2',display_name:'Shane',is_admin:false,can_access:false}]});
        if(name==='octagon_admin_set_access')return ok({ok:true});
        return ok({ok:true});
      },
      channel(){
        proof.channels+=1;
        return{on(){return this;},subscribe(){return this;},async send(){return'ok';},async unsubscribe(){}};
      },
      async removeChannel(){}
    };
    window.UFC_PLAY_PROFILE={
      identity:null,
      client,
      async resolve(){
        proof.canonicalResolves+=1;
        const node=document.createElement('div');node.dataset.unexpectedOctagonSignin='true';document.body.appendChild(node);
        this.identity=identity;return identity;
      },
      async require(){proof.canonicalRequires+=1;this.identity=identity;return identity;}
    };
    window.UFC_APP_PROFILE={
      identity:null,
      async resolve(){proof.editorResolves+=1;throw new Error('Octagon access invoked the editor resolver.');}
    };
  })();
  </script>
  <script src="/assets/js/octagon-access-panel.js"></script>
</body></html>`;

async function snapshot(page){
  return await page.evaluate(()=>({
    canonicalResolves:window.__OCTAGON_ACCESS_PROOF__.canonicalResolves,
    canonicalRequires:window.__OCTAGON_ACCESS_PROOF__.canonicalRequires,
    editorResolves:window.__OCTAGON_ACCESS_PROOF__.editorResolves,
    rpcs:window.__OCTAGON_ACCESS_PROOF__.rpcs,
    channels:window.__OCTAGON_ACCESS_PROOF__.channels,
    storageReads:window.__OCTAGON_ACCESS_STORAGE_READS__,
    panels:document.querySelectorAll('[data-octagon-access-panel]').length,
    manageButtons:document.querySelectorAll('[data-octagon-manage-beta]').length,
    betaDisabled:document.querySelector('[data-octagon-beta-tab]')?.disabled,
    unexpectedSignin:document.querySelectorAll('[data-unexpected-octagon-signin]').length
  }));
}

try{
  report.stage='browser-launch';
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const page=await context.newPage();

  await page.addInitScript(()=>{
    const originalGet=Storage.prototype.getItem;
    localStorage.setItem('ufc-picks:group:GOAT26','stale-storage-token');
    window.__OCTAGON_ACCESS_STORAGE_READS__=[];
    Storage.prototype.getItem=function(key){
      const value=String(key);
      if(this===window.localStorage&&value==='ufc-picks:group:GOAT26')window.__OCTAGON_ACCESS_STORAGE_READS__.push({key:value,stack:String(new Error().stack||'')});
      return originalGet.call(this,key);
    };
  });

  await page.route(BASE,route=>route.fulfill({status:200,contentType:'text/html',body:html}));
  await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_OCTAGON_ACCESS&&document.querySelector('[data-octagon-access-panel]'),null,{timeout:10000});
  await page.waitForTimeout(600);

  report.stage='uncached-startup';
  report.initial=await snapshot(page);
  assert.equal(report.initial.canonicalResolves,0,'Passive Octagon startup must not invoke the canonical resolver.');
  assert.equal(report.initial.canonicalRequires,0,'Passive Octagon startup must not require sign-in.');
  assert.equal(report.initial.editorResolves,0,'Passive Octagon startup must not invoke the profile editor resolver.');
  assert.equal(report.initial.rpcs.filter(row=>row.name==='octagon_access_status').length,0,'Uncached startup must wait for published identity before access RPC work.');
  assert.equal(report.initial.storageReads.some(row=>/octagon-access-panel\.js/i.test(row.stack)),false,'Octagon access must not read canonical access from storage.');
  assert.equal(report.initial.panels,1,'Octagon access must retain one panel surface.');
  assert.equal(report.initial.manageButtons,1,'Octagon access must retain one manage button surface.');
  assert.equal(report.initial.betaDisabled,true);
  assert.equal(report.initial.unexpectedSignin,0,'Passive Octagon startup must not create a sign-in surface.');

  report.stage='canonical-readiness';
  await page.evaluate(()=>{
    const identity=window.__OCTAGON_ACCESS_PROOF__.identity;
    window.UFC_PLAY_PROFILE.identity=identity;
    window.__OCTAGON_ACCESS_PROOF__.rpcs=[];
    window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:identity}));
    window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:identity}));
  });
  await page.waitForFunction(()=>window.__OCTAGON_ACCESS_PROOF__.rpcs.some(row=>row.name==='octagon_access_status'),null,{timeout:10000});
  await page.waitForTimeout(260);
  report.readiness=await snapshot(page);
  assert.equal(report.readiness.canonicalResolves,0);
  assert.equal(report.readiness.canonicalRequires,0);
  assert.equal(report.readiness.editorResolves,0);
  assert.equal(report.readiness.rpcs.filter(row=>row.name==='octagon_access_status').length,1,'Competing readiness events must produce one access-status RPC.');
  assert.equal(report.readiness.betaDisabled,false,'Published Cody access must enable the Beta destination.');
  assert.equal(report.readiness.panels,1);
  assert.equal(report.readiness.manageButtons,1);

  report.stage='concurrent-refresh';
  await page.evaluate(()=>{window.__OCTAGON_ACCESS_PROOF__.rpcs=[];});
  await page.evaluate(()=>Promise.all([window.UFC_OCTAGON_ACCESS.checkCurrentAccess(),window.UFC_OCTAGON_ACCESS.checkCurrentAccess(),window.UFC_OCTAGON_ACCESS.checkCurrentAccess()]));
  report.concurrent=await snapshot(page);
  assert.equal(report.concurrent.rpcs.filter(row=>row.name==='octagon_access_status').length,1,'Concurrent access checks must share one in-flight RPC.');
  assert.equal(report.concurrent.canonicalResolves,0);
  assert.equal(report.concurrent.canonicalRequires,0);

  report.stage='explicit-admin-panel';
  await page.evaluate(()=>{window.__OCTAGON_ACCESS_PROOF__.rpcs=[];});
  await page.click('[data-octagon-manage-beta]');
  await page.waitForFunction(()=>window.__OCTAGON_ACCESS_PROOF__.rpcs.some(row=>row.name==='octagon_admin_access_roster'),null,{timeout:10000});
  report.interactive=await snapshot(page);
  assert.equal(report.interactive.rpcs.filter(row=>row.name==='octagon_admin_access_roster').length,1,'Opening the explicit admin panel must retain one roster request.');
  assert.equal(report.interactive.canonicalRequires,0,'A cached explicit admin action must not prompt again.');
  assert.equal(report.interactive.canonicalResolves,0);
  assert.equal(report.interactive.panels,1);
  assert.equal(report.interactive.manageButtons,1);

  report.passed=true;
  report.stage='complete';
  console.log('Octagon access passive identity ownership proof passed.');
  await context.close();
}catch(error){
  report.error={message:error?.message||String(error),stack:error?.stack||null};
  throw error;
}finally{
  fs.writeFileSync(REPORT,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}

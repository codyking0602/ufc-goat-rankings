import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

await import('./test-octagon-access-startup-retry-contract.mjs');

const fixtureUrl='http://127.0.0.1:4173/phase-4-octagon-access-startup-proof.html';
const reportPath='/tmp/octagon-access-startup-retry-report.json';
const report={proof:'octagon-access-startup-retry-owner',phase:'launch',scenarios:{}};

const identity={groupCode:'GOAT26',memberToken:'access-startup-token',member:{id:'m1',display_name:'Cody',is_admin:true}};
const status={ok:true,can_access:true,member:{id:'m1',display_name:'Cody',is_admin:true}};

function fixture({cached=false}={}){
  return `<!doctype html><html><head><meta charset="utf-8"><title>Access startup retry proof</title></head><body>
  <button type="button" class="tab" data-octagon-beta-tab disabled aria-disabled="true">War Room</button>
  <section id="octagon"><section data-octagon-board><header class="octagon-board-head"><div class="octagon-board-head-actions"><button type="button" data-octagon-refresh>Refresh</button></div></header></section></section>
  <script>
  (function(){
    const identity=${JSON.stringify(identity)};
    const status=${JSON.stringify(status)};
    const proof=window.__ACCESS_STARTUP_PROOF__={rpcs:[],intervals:[],channels:0,identity};
    const channel={on(){return this;},subscribe(){return this;},async unsubscribe(){}};
    const client={
      async rpc(name,args){proof.rpcs.push({name,args,at:Date.now()});if(name==='octagon_access_status'){await new Promise(resolve=>setTimeout(resolve,20));return{data:structuredClone(status),error:null};}return{data:{ok:true,members:[]},error:null};},
      channel(){proof.channels+=1;return channel;},
      async removeChannel(){}
    };
    window.UFC_PLAY_PROFILE={identity:${cached?'identity':'null'},client};
    window.UFC_APP_PROFILE={identity:${cached?'identity':'null'}};
    window.UFC_OCTAGON_BOARD={async broadcastChange(){return true;}};
    window.setInterval=(callback,delay)=>{proof.intervals.push({callback,delay});return proof.intervals.length;};
  })();
  </script>
  <script src="/assets/js/octagon-access-panel.js"></script>
  </body></html>`;
}

async function open(browser,options){
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.route(`${fixtureUrl}*`,route=>route.fulfill({status:200,contentType:'text/html',body:fixture(options)}));
  await page.goto(fixtureUrl,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_OCTAGON_ACCESS&&window.__ACCESS_STARTUP_PROOF__?.intervals.length===1,null,{timeout:10000});
  return{context,page};
}

async function snapshot(page){
  return page.evaluate(()=>({
    version:window.UFC_OCTAGON_ACCESS?.version||'',
    rpcs:window.__ACCESS_STARTUP_PROOF__.rpcs.map(row=>({...row})),
    intervals:window.__ACCESS_STARTUP_PROOF__.intervals.map(row=>row.delay),
    canAccess:Boolean(window.UFC_OCTAGON_ACCESS?.canAccess),
    betaDisabled:document.querySelector('[data-octagon-beta-tab]')?.disabled,
    betaAccess:document.querySelector('[data-octagon-beta-tab]')?.dataset.betaAccess||'',
    manageButtons:document.querySelectorAll('[data-octagon-manage-beta]').length,
    manageHidden:document.querySelector('[data-octagon-manage-beta]')?.hidden,
    panels:document.querySelectorAll('[data-octagon-access-panel]').length,
    panelHidden:document.querySelector('[data-octagon-access-panel]')?.hidden
  }));
}

const browser=await chromium.launch({headless:true});
try{
  report.phase='uncached-startup-window';
  {
    const {context,page}=await open(browser,{cached:false});
    await page.waitForTimeout(5200);
    const startup=await snapshot(page);
    report.scenarios.uncached=startup;
    assert.equal(startup.version,'octagon-access-panel-20260721c-single-startup-access');
    assert.equal(startup.rpcs.filter(row=>row.name==='octagon_access_status').length,0,'Uncached startup retried access status without published identity.');
    assert.deepEqual(startup.intervals,[60000],'The separate 60-second access poll changed.');
    assert.equal(startup.manageButtons,1,'One access-management shell must remain.');
    assert.equal(startup.panels,1,'One access panel shell must remain.');
    assert.equal(startup.manageHidden,true,'Management must remain hidden before verified Cody access.');
    assert.equal(startup.betaDisabled,true,'War Room must remain locked before verified access.');

    await page.evaluate(()=>{
      window.UFC_PLAY_PROFILE.identity=window.__ACCESS_STARTUP_PROOF__.identity;
      window.UFC_APP_PROFILE.identity=window.__ACCESS_STARTUP_PROOF__.identity;
      window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:window.__ACCESS_STARTUP_PROOF__.identity}));
    });
    await page.waitForFunction(()=>window.UFC_OCTAGON_ACCESS?.canAccess===true,null,{timeout:10000});
    const ready=await snapshot(page);
    report.scenarios.readiness=ready;
    assert.equal(ready.rpcs.filter(row=>row.name==='octagon_access_status').length,1,'Published identity did not start exactly one access-status request.');
    assert.equal(ready.betaDisabled,false);
    assert.equal(ready.betaAccess,'owner');
    assert.equal(ready.manageHidden,false);
    await context.close();
  }

  report.phase='cached-startup-window';
  {
    const {context,page}=await open(browser,{cached:true});
    await page.waitForFunction(()=>window.UFC_OCTAGON_ACCESS?.canAccess===true,null,{timeout:10000});
    await page.waitForTimeout(5200);
    const cached=await snapshot(page);
    report.scenarios.cached=cached;
    assert.equal(cached.rpcs.filter(row=>row.name==='octagon_access_status').length,1,'Cached startup performed zero or repeated access-status requests through the former retry window.');
    assert.equal(cached.betaDisabled,false);
    assert.equal(cached.manageHidden,false);
    assert.deepEqual(cached.intervals,[60000]);

    await page.evaluate(()=>window.__ACCESS_STARTUP_PROOF__.intervals.find(row=>row.delay===60000).callback());
    await page.waitForFunction(()=>window.__ACCESS_STARTUP_PROOF__.rpcs.filter(row=>row.name==='octagon_access_status').length===2,null,{timeout:10000});
    const polled=await snapshot(page);
    report.scenarios.poll=polled;
    assert.equal(polled.rpcs.filter(row=>row.name==='octagon_access_status').length,2,'The preserved 60-second access poll no longer verifies server state.');
    await context.close();
  }

  report.phase='complete';
  report.passed=true;
  console.log(JSON.stringify(report,null,2));
}catch(error){
  report.passed=false;
  report.error={name:error?.name||'Error',message:error?.message||String(error),stack:error?.stack||''};
  fs.writeFileSync(reportPath,JSON.stringify(report,null,2));
  console.error(JSON.stringify(report,null,2));
  throw error;
}finally{await browser.close();}

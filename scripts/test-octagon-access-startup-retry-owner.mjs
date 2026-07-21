import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

await import('./test-octagon-access-startup-retry-contract.mjs');

const fixtureUrl='http://127.0.0.1:4173/war-room-permission-proof.html';
const reportPath='/tmp/octagon-access-startup-retry-report.json';
const report={proof:'war-room-permission-owner',phase:'launch',scenarios:{}};

const identity={groupCode:'GOAT26',memberToken:'access-startup-token',member:{id:'m1',display_name:'Cody',is_admin:true}};
const status={ok:true,can_access:true,member:{id:'m1',display_name:'Cody',is_admin:true}};

function fixture({cached=false}={}){
  return `<!doctype html><html><head><meta charset="utf-8"><title>War Room permission proof</title></head><body>
  <nav class="tabs"><button type="button" class="tab" data-destination="war-room" data-octagon-beta-tab disabled aria-disabled="true">War Room</button></nav>
  <main class="shell">
    <section id="home" class="view active-view"><div id="homeDashboardMount"></div></section>
    <section id="octagon" class="view"><section data-octagon-board><header class="octagon-board-head"><div class="octagon-board-head-actions"><button type="button" data-octagon-refresh>Refresh</button></div></header></section></section>
  </main>
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
  <script src="/assets/js/home-dashboard.js"></script>
  <script src="/assets/js/octagon-access-panel.js"></script>
  </body></html>`;
}

async function open(browser,{cached=false,invite=false}={}){
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.route(`${fixtureUrl}*`,route=>route.fulfill({status:200,contentType:'text/html',body:fixture({cached})}));
  await page.goto(`${fixtureUrl}${invite?'?group=GOAT26':''}`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_OCTAGON_ACCESS&&window.__ACCESS_STARTUP_PROOF__?.intervals.length===1,null,{timeout:10000});
  await page.waitForTimeout(120);
  return{context,page};
}

async function snapshot(page){
  return page.evaluate(()=>{
    const beta=document.querySelector('[data-octagon-beta-tab]');
    const card=document.querySelector('#home .home-war-room');
    const cta=card?.querySelector('[data-home-action="war-room"]');
    return{
      version:window.UFC_OCTAGON_ACCESS?.version||'',
      mode:window.UFC_OCTAGON_ACCESS?.mode||'',
      rpcs:window.__ACCESS_STARTUP_PROOF__.rpcs.map(row=>({...row})),
      intervals:window.__ACCESS_STARTUP_PROOF__.intervals.map(row=>row.delay),
      canAccess:Boolean(window.UFC_OCTAGON_ACCESS?.canAccess),
      betaHidden:Boolean(beta?.hidden),
      betaDisabled:Boolean(beta?.disabled),
      betaAccess:beta?.dataset.betaAccess||'',
      betaText:beta?.textContent?.trim()||'',
      homeCards:document.querySelectorAll('#home .home-war-room').length,
      homeCtaText:cta?.textContent?.trim()||'',
      homeCtaDisabled:Boolean(cta?.disabled),
      manageButtons:document.querySelectorAll('[data-octagon-manage-beta]').length,
      manageHidden:document.querySelector('[data-octagon-manage-beta]')?.hidden,
      panels:document.querySelectorAll('section[data-octagon-access-panel]').length,
      panelHidden:document.querySelector('section[data-octagon-access-panel]')?.hidden
    };
  });
}

const browser=await chromium.launch({headless:true});
try{
  report.phase='signed-out-locked';
  {
    const {context,page}=await open(browser,{cached:false,invite:false});
    const signedOut=await snapshot(page);
    report.scenarios.signedOut=signedOut;
    assert.equal(signedOut.version,'octagon-access-panel-20260721d-permission-surfaces');
    assert.equal(signedOut.rpcs.filter(row=>row.name==='octagon_access_status').length,0,'Signed-out startup verified access without published identity.');
    assert.deepEqual(signedOut.intervals,[60000],'The separate 60-second access poll changed.');
    assert.equal(signedOut.mode,'locked');
    assert.equal(signedOut.betaHidden,true,'Locked War Room remained visible in desktop navigation.');
    assert.equal(signedOut.betaDisabled,true);
    assert.equal(signedOut.homeCards,0,'Locked War Room remained visible on Home.');
    assert.equal(signedOut.homeCtaText,'','Home rendered a locked Join Conversation action.');
    assert.equal(signedOut.manageButtons,1,'One access-management shell must remain.');
    assert.equal(signedOut.panels,1,'One access panel shell must remain.');
    assert.equal(signedOut.manageHidden,true,'Management must remain hidden before verified Cody access.');

    await page.evaluate(()=>{
      window.UFC_PLAY_PROFILE.identity=window.__ACCESS_STARTUP_PROOF__.identity;
      window.UFC_APP_PROFILE.identity=window.__ACCESS_STARTUP_PROOF__.identity;
      window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:window.__ACCESS_STARTUP_PROOF__.identity}));
    });
    await page.waitForFunction(()=>window.UFC_OCTAGON_ACCESS?.mode==='owner'&&document.querySelector('#home .home-war-room'),null,{timeout:10000});
    const ready=await snapshot(page);
    report.scenarios.readiness=ready;
    assert.equal(ready.rpcs.filter(row=>row.name==='octagon_access_status').length,1,'Published identity did not start exactly one access-status request.');
    assert.equal(ready.mode,'owner');
    assert.equal(ready.betaHidden,false);
    assert.equal(ready.betaDisabled,false);
    assert.equal(ready.betaText,'War Room');
    assert.equal(ready.homeCards,1);
    assert.equal(ready.homeCtaText,'JOIN CONVERSATION →');
    assert.equal(ready.homeCtaDisabled,false,'Eligible Home action became disabled.');
    assert.equal(ready.manageHidden,false);
    await context.close();
  }

  report.phase='invite-only';
  {
    const {context,page}=await open(browser,{cached:false,invite:true});
    const invite=await snapshot(page);
    report.scenarios.invite=invite;
    assert.equal(invite.rpcs.filter(row=>row.name==='octagon_access_status').length,0,'Invite-only startup verified access without a signed-in identity.');
    assert.equal(invite.mode,'invite');
    assert.equal(invite.betaHidden,false);
    assert.equal(invite.betaDisabled,false);
    assert.equal(invite.betaText,'Join with invite');
    assert.equal(invite.homeCards,1);
    assert.equal(invite.homeCtaText,'JOIN WITH INVITE →');
    assert.equal(invite.homeCtaDisabled,false,'Invite Home action became disabled.');
    assert.deepEqual(invite.intervals,[60000]);
    await context.close();
  }

  report.phase='cached-eligible';
  {
    const {context,page}=await open(browser,{cached:true,invite:false});
    await page.waitForFunction(()=>window.UFC_OCTAGON_ACCESS?.mode==='owner',null,{timeout:10000});
    await page.waitForTimeout(120);
    const cached=await snapshot(page);
    report.scenarios.cached=cached;
    assert.equal(cached.rpcs.filter(row=>row.name==='octagon_access_status').length,1,'Cached startup performed zero or repeated access-status requests.');
    assert.equal(cached.mode,'owner');
    assert.equal(cached.betaHidden,false);
    assert.equal(cached.betaDisabled,false);
    assert.equal(cached.homeCtaText,'JOIN CONVERSATION →');
    assert.equal(cached.homeCtaDisabled,false);
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

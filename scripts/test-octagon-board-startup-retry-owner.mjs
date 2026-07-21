import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

await import('./test-octagon-board-startup-retry-contract.mjs');

const ORIGIN='http://127.0.0.1:4173';
const INACTIVE=`${ORIGIN}/octagon-board-startup-inactive-proof.html`;
const ACTIVE_CACHED=`${ORIGIN}/octagon-board-startup-active-cached-proof.html`;
const ACTIVE_UNCACHED=`${ORIGIN}/octagon-board-startup-active-uncached-proof.html`;
const REPORT='/tmp/octagon-board-startup-retry-report.json';
const report={passed:false,stage:'static-contract',inactive:null,inactiveLate:null,tabEntry:null,activeCached:null,activeUncached:null,readiness:null,error:null};
let browser;

const identity={groupCode:'GOAT26',memberToken:'board-startup-token',member_token:'board-startup-token',member:{id:'m1',display_name:'Cody',is_admin:true}};
const snapshot={ok:true,board:{is_current:true,week_start:'2026-07-20',week_end:'2026-07-26'},messages:[],available_weeks:['2026-07-20']};

function fixture({active=false,cached=false}={}){return `<!doctype html><html><head><meta charset="utf-8"><title>War Room board startup retries</title></head><body>
  <button type="button" class="tab" data-octagon-beta-tab>War Room</button>
  <section id="octagon" class="${active?'active-view':''}"></section>
  <script>
    window.__BOARD_STARTUP_IDENTITY__=${JSON.stringify(identity)};
    window.__BOARD_STARTUP_SNAPSHOT__=${JSON.stringify(snapshot)};
    window.__BOARD_STARTUP_PROOF__={rpcs:[],channels:0,canonicalResolves:0,canonicalRequires:0,editorResolves:0};
    const proof=window.__BOARD_STARTUP_PROOF__;
    const identity=window.__BOARD_STARTUP_IDENTITY__;
    const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
    const channel={on(){return this;},subscribe(callback){callback?.('SUBSCRIBED');return this;},async send(){return'ok';},async unsubscribe(){return'ok';}};
    const client={
      async rpc(name,args){
        proof.rpcs.push({name,args});
        if(name==='octagon_snapshot'){await sleep(40);return{data:structuredClone(window.__BOARD_STARTUP_SNAPSHOT__),error:null};}
        return{data:{ok:true},error:null};
      },
      channel(){proof.channels+=1;return channel;},
      async removeChannel(){return'ok';}
    };
    window.UFC_PLAY_PROFILE={identity:${cached?'identity':'null'},client,async resolve(){proof.canonicalResolves+=1;return identity;},async require(){proof.canonicalRequires+=1;return identity;}};
    window.UFC_APP_PROFILE={identity:${cached?'identity':'null'},async resolve(){proof.editorResolves+=1;return identity;}};
  </script>
  <script src="/assets/js/octagon-message-board.js"></script>
</body></html>`;}

async function openPage(context,url,options){
  const page=await context.newPage();
  await page.route(url,route=>route.fulfill({status:200,contentType:'text/html',body:fixture(options)}));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_OCTAGON_BOARD&&document.querySelector('[data-octagon-board]'),null,{timeout:10000});
  return page;
}

async function state(page){
  return page.evaluate(()=>({
    version:window.UFC_OCTAGON_BOARD?.version||'',
    rpcs:window.__BOARD_STARTUP_PROOF__.rpcs.map(row=>({...row})),
    channels:window.__BOARD_STARTUP_PROOF__.channels,
    canonicalResolves:window.__BOARD_STARTUP_PROOF__.canonicalResolves,
    canonicalRequires:window.__BOARD_STARTUP_PROOF__.canonicalRequires,
    editorResolves:window.__BOARD_STARTUP_PROOF__.editorResolves,
    boards:document.querySelectorAll('[data-octagon-board]').length,
    bound:document.querySelector('[data-octagon-beta-tab]')?.dataset.octagonBoardBound||'',
    marker:document.querySelector('[data-octagon-board]')?.dataset.proofMarker||'',
    authCards:document.querySelectorAll('.octagon-auth-card').length,
    ready:Boolean(window.UFC_OCTAGON_BOARD?.snapshot?.ok),
    active:document.getElementById('octagon')?.classList.contains('active-view')||false
  }));
}

try{
  report.stage='browser-launch';
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});

  report.stage='inactive-immediate';
  const inactive=await openPage(context,INACTIVE,{active:false,cached:true});
  report.inactive=await state(inactive);
  assert.equal(report.inactive.version,'octagon-message-board-20260721e-single-startup-mount-bind');
  assert.equal(report.inactive.boards,1,'One board shell must mount synchronously.');
  assert.equal(report.inactive.bound,'true','The static beta tab must bind synchronously.');
  assert.equal(report.inactive.rpcs.filter(row=>row.name==='octagon_snapshot').length,0,'Inactive startup must not load the board snapshot.');
  assert.equal(report.inactive.canonicalResolves,0);
  assert.equal(report.inactive.canonicalRequires,0);
  assert.equal(report.inactive.editorResolves,0);
  await inactive.evaluate(()=>{document.querySelector('[data-octagon-board]').dataset.proofMarker='preserved';});
  await inactive.waitForTimeout(2400);
  report.inactiveLate=await state(inactive);
  assert.equal(report.inactiveLate.boards,1,'The board shell changed during the retired retry window.');
  assert.equal(report.inactiveLate.marker,'preserved','The initial board shell was replaced during the retired retry window.');
  assert.equal(report.inactiveLate.rpcs.filter(row=>row.name==='octagon_snapshot').length,0);

  report.stage='inactive-tab-entry';
  await inactive.click('[data-octagon-beta-tab]');
  await inactive.waitForFunction(()=>window.__BOARD_STARTUP_PROOF__.rpcs.some(row=>row.name==='octagon_snapshot'),null,{timeout:10000});
  await inactive.waitForTimeout(100);
  report.tabEntry=await state(inactive);
  assert.equal(report.tabEntry.rpcs.filter(row=>row.name==='octagon_snapshot').length,1,'The immediate beta-tab binding must produce one board load.');
  assert.equal(report.tabEntry.rpcs.find(row=>row.name==='octagon_snapshot')?.args?.p_member_token,'board-startup-token');
  assert.equal(report.tabEntry.ready,true);
  await inactive.close();

  report.stage='active-cached-window';
  const activeCached=await openPage(context,ACTIVE_CACHED,{active:true,cached:true});
  await activeCached.waitForFunction(()=>window.UFC_OCTAGON_BOARD?.snapshot?.ok,null,{timeout:10000});
  await activeCached.waitForTimeout(2400);
  report.activeCached=await state(activeCached);
  assert.equal(report.activeCached.boards,1);
  assert.equal(report.activeCached.bound,'true');
  assert.equal(report.activeCached.rpcs.filter(row=>row.name==='octagon_snapshot').length,1,'Cached active startup must load exactly one board snapshot through the former retry window.');
  assert.equal(report.activeCached.channels,1,'Active verified startup must retain one realtime channel.');
  assert.equal(report.activeCached.canonicalResolves,0);
  assert.equal(report.activeCached.canonicalRequires,0);
  assert.equal(report.activeCached.editorResolves,0);
  await activeCached.close();

  report.stage='active-uncached-window';
  const activeUncached=await openPage(context,ACTIVE_UNCACHED,{active:true,cached:false});
  await activeUncached.waitForTimeout(2400);
  report.activeUncached=await state(activeUncached);
  assert.equal(report.activeUncached.rpcs.filter(row=>row.name==='octagon_snapshot').length,0,'Uncached active startup must wait for published identity.');
  assert.equal(report.activeUncached.authCards,1,'Uncached active startup must retain one reconnect card.');
  assert.equal(report.activeUncached.boards,1);
  assert.equal(report.activeUncached.bound,'true');
  await activeUncached.evaluate(()=>{
    window.UFC_PLAY_PROFILE.identity=window.__BOARD_STARTUP_IDENTITY__;
    window.UFC_APP_PROFILE.identity=window.__BOARD_STARTUP_IDENTITY__;
    window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:window.__BOARD_STARTUP_IDENTITY__}));
  });
  await activeUncached.waitForFunction(()=>window.UFC_OCTAGON_BOARD?.snapshot?.ok,null,{timeout:10000});
  await activeUncached.waitForTimeout(100);
  report.readiness=await state(activeUncached);
  assert.equal(report.readiness.rpcs.filter(row=>row.name==='octagon_snapshot').length,1,'Published identity must produce exactly one board snapshot load.');
  assert.equal(report.readiness.rpcs.find(row=>row.name==='octagon_snapshot')?.args?.p_member_token,'board-startup-token');
  assert.equal(report.readiness.authCards,0);
  assert.equal(report.readiness.channels,1);
  assert.equal(report.readiness.canonicalResolves,0);
  assert.equal(report.readiness.canonicalRequires,0);
  assert.equal(report.readiness.editorResolves,0);
  await activeUncached.close();

  report.passed=true;
  report.stage='complete';
  console.log('War Room board startup retry ownership proof passed.');
  await context.close();
}catch(error){
  report.error={message:error?.message||String(error),stack:error?.stack||null};
  throw error;
}finally{
  fs.writeFileSync(REPORT,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}

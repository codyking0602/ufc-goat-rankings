import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const ORIGIN='http://127.0.0.1:4173';
const BASE=`${ORIGIN}/octagon-access-identity-owner-proof.html`;
const REPORT='/tmp/octagon-access-identity-owner-report.json';
const report={passed:false,stage:'static-contract',uncached:null,readiness:null,concurrent:null,admin:null,error:null};
let browser;

const source=fs.readFileSync('assets/js/octagon-access-panel.js','utf8');
assert.match(source,/function passiveIdentity\(value\)[\s\S]*UFC_PLAY_PROFILE\?\.identity[\s\S]*UFC_APP_PROFILE\?\.identity/,'Octagon access must consume published identity caches.');
assert.doesNotMatch(source,/UFC_PLAY_PROFILE\?\.(?:resolve|resolveIdentity)\?\.\(/,'Octagon access passive work must not invoke the canonical identity owner.');
assert.doesNotMatch(source,/UFC_APP_PROFILE\?\.resolve\?\.\(/,'Octagon access must not invoke the profile editor resolver.');
assert.doesNotMatch(source,/TOKEN_KEY|localStorage\.getItem\(/,'Octagon access must not own or read canonical access storage.');

const identity={
  ok:true,
  group:{code:'GOAT26'},
  groupCode:'GOAT26',
  member:{id:'m1',display_name:'Cody',is_admin:true},
  memberToken:'access-owner-token',
  member_token:'access-owner-token'
};
const status={
  ok:true,
  can_access:true,
  member:{id:'m1',display_name:'Cody',is_admin:true}
};
const roster={
  ok:true,
  members:[
    {id:'m1',display_name:'Cody',is_admin:true,can_access:true,fighter_avatar_slug:''},
    {id:'m2',display_name:'Bailey',is_admin:false,can_access:false,fighter_avatar_slug:''}
  ]
};

const html=`<!doctype html><html><head><meta charset="utf-8"><title>Octagon access identity ownership</title></head><body>
  <button type="button" class="tab" data-octagon-beta-tab disabled aria-disabled="true">War Room</button>
  <section id="octagon">
    <section data-octagon-board>
      <header class="octagon-board-head">
        <div class="octagon-board-head-actions"><button type="button" data-octagon-refresh>Refresh</button></div>
      </header>
    </section>
  </section>
  <script>
    window.__ACCESS_IDENTITY__=${JSON.stringify(identity)};
    window.__ACCESS_STATUS__=${JSON.stringify(status)};
    window.__ACCESS_ROSTER__=${JSON.stringify(roster)};
    window.__ACCESS_PROOF__={canonicalResolves:0,canonicalRequires:0,editorResolves:0,rpcs:[],channels:0,sends:0};
    const proof=window.__ACCESS_PROOF__;
    const identity=window.__ACCESS_IDENTITY__;
    const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
    const channel={
      on(){return this;},
      subscribe(){return this;},
      async send(){proof.sends+=1;return'ok';},
      async unsubscribe(){return'ok';}
    };
    const client={
      async rpc(name,args){
        proof.rpcs.push({name,args});
        if(name==='octagon_access_status'){
          await sleep(180);
          return{data:structuredClone(window.__ACCESS_STATUS__),error:null};
        }
        if(name==='octagon_admin_access_roster'){
          return{data:structuredClone(window.__ACCESS_ROSTER__),error:null};
        }
        if(name==='octagon_admin_set_access'){
          return{data:{ok:true},error:null};
        }
        return{data:{ok:true},error:null};
      },
      channel(){proof.channels+=1;return channel;},
      async removeChannel(){return'ok';}
    };
    window.UFC_PLAY_PROFILE={
      identity:null,
      client,
      async resolve(){proof.canonicalResolves+=1;this.identity=identity;return identity;},
      async require(){proof.canonicalRequires+=1;this.identity=identity;return identity;}
    };
    window.UFC_APP_PROFILE={
      identity:null,
      async resolve(){proof.editorResolves+=1;throw new Error('Octagon access invoked the editor resolver.');}
    };
    window.UFC_OCTAGON_BOARD={async broadcastChange(){return true;}};
  </script>
  <script src="/assets/js/octagon-access-panel.js"></script>
</body></html>`;

async function snapshot(page){
  return page.evaluate(()=>({
    ...window.__ACCESS_PROOF__,
    storageReads:window.__ACCESS_STORAGE_READS__,
    betaDisabled:document.querySelector('[data-octagon-beta-tab]')?.disabled,
    betaAccess:document.querySelector('[data-octagon-beta-tab]')?.dataset.betaAccess||'',
    manageButtons:document.querySelectorAll('[data-octagon-manage-beta]').length,
    manageHidden:document.querySelector('[data-octagon-manage-beta]')?.hidden,
    panels:document.querySelectorAll('[data-octagon-access-panel]').length,
    panelHidden:document.querySelector('[data-octagon-access-panel]')?.hidden,
    rosterRows:document.querySelectorAll('[data-access-member-id]').length,
    signInSurfaces:document.querySelectorAll('[role="dialog"],.app-profile-overlay,.play-profile-modal,.picks-pin-signin').length,
    canAccess:Boolean(window.UFC_OCTAGON_ACCESS?.canAccess)
  }));
}

async function openProofPage(context){
  const page=await context.newPage();
  await page.addInitScript(()=>{
    localStorage.setItem('ufc-picks:group:GOAT26','stale-access-token');
    const originalGet=Storage.prototype.getItem;
    window.__ACCESS_STORAGE_READS__=[];
    Storage.prototype.getItem=function(key){
      const value=String(key);
      if(this===window.localStorage&&value==='ufc-picks:group:GOAT26'){
        window.__ACCESS_STORAGE_READS__.push({key:value,stack:String(new Error().stack||'')});
      }
      return originalGet.call(this,key);
    };
  });
  await page.route(BASE,route=>route.fulfill({status:200,contentType:'text/html',body:html}));
  await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_OCTAGON_ACCESS&&window.__ACCESS_PROOF__,null,{timeout:10000});
  await page.waitForTimeout(120);
  return page;
}

try{
  report.stage='browser-launch';
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const page=await openProofPage(context);

  report.stage='uncached-startup';
  report.uncached=await snapshot(page);
  assert.equal(report.uncached.canonicalResolves,0,'Uncached passive Octagon access startup must not invoke the canonical resolver.');
  assert.equal(report.uncached.canonicalRequires,0,'Octagon access has no passive sign-in boundary.');
  assert.equal(report.uncached.editorResolves,0,'Passive Octagon access startup must not invoke the editor resolver.');
  assert.equal(report.uncached.rpcs.length,0,'Uncached Octagon access startup must wait for published identity before any RPC.');
  assert.equal(report.uncached.storageReads.some(row=>/octagon-access-panel\.js/i.test(row.stack)),false,'Octagon access must not read the canonical GOAT26 token from storage.');
  assert.equal(report.uncached.betaDisabled,true);
  assert.equal(report.uncached.manageButtons,1,'The admin control shell must remain single.');
  assert.equal(report.uncached.manageHidden,true,'The admin control must remain hidden before verified access.');
  assert.equal(report.uncached.panels,1,'The access panel shell must remain single.');
  assert.equal(report.uncached.signInSurfaces,0,'Passive Octagon access startup must not create a sign-in surface.');

  report.stage='canonical-readiness';
  await page.evaluate(()=>{
    window.UFC_PLAY_PROFILE.identity=window.__ACCESS_IDENTITY__;
    window.UFC_APP_PROFILE.identity=window.__ACCESS_IDENTITY__;
    window.__ACCESS_PROOF__.rpcs=[];
    window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:window.__ACCESS_IDENTITY__}));
  });
  await page.waitForFunction(()=>window.UFC_OCTAGON_ACCESS?.canAccess===true,null,{timeout:10000});
  report.readiness=await snapshot(page);
  const readinessStatus=report.readiness.rpcs.filter(row=>row.name==='octagon_access_status');
  assert.equal(readinessStatus.length,1,'One readiness handoff must start one access-status request.');
  assert.equal(readinessStatus[0]?.args?.p_member_token,'access-owner-token','Access verification must use the published member token.');
  assert.equal(report.readiness.canonicalResolves,0);
  assert.equal(report.readiness.canonicalRequires,0);
  assert.equal(report.readiness.editorResolves,0);
  assert.equal(report.readiness.storageReads.some(row=>/octagon-access-panel\.js/i.test(row.stack)),false);
  assert.equal(report.readiness.betaDisabled,false,'Verified access must enable the War Room tab.');
  assert.equal(report.readiness.betaAccess,'owner');
  assert.equal(report.readiness.manageHidden,false,'Cody must retain the visible Manage Beta control.');

  report.stage='concurrent-refresh';
  await page.evaluate(()=>{
    window.__ACCESS_PROOF__.rpcs=[];
    window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:window.__ACCESS_IDENTITY__}));
    window.dispatchEvent(new CustomEvent('ufc-app-profile-updated',{detail:{identity:window.__ACCESS_IDENTITY__}}));
    window.dispatchEvent(new CustomEvent('ufc-canonical-group-ready',{detail:{canonicalCode:'GOAT26'}}));
    void window.UFC_OCTAGON_ACCESS.checkCurrentAccess();
    void window.UFC_OCTAGON_ACCESS.checkCurrentAccess();
    void window.UFC_OCTAGON_ACCESS.checkCurrentAccess();
  });
  await page.waitForFunction(()=>window.__ACCESS_PROOF__.rpcs.some(row=>row.name==='octagon_access_status'),null,{timeout:10000});
  await page.waitForTimeout(260);
  report.concurrent=await snapshot(page);
  assert.equal(report.concurrent.rpcs.filter(row=>row.name==='octagon_access_status').length,1,'Competing readiness and direct access checks must share one in-flight request.');
  assert.equal(report.concurrent.canonicalResolves,0);
  assert.equal(report.concurrent.canonicalRequires,0);
  assert.equal(report.concurrent.editorResolves,0);

  report.stage='admin-actions';
  await page.evaluate(()=>{window.__ACCESS_PROOF__.rpcs=[];});
  await page.click('[data-octagon-manage-beta]');
  await page.waitForFunction(()=>document.querySelectorAll('[data-access-member-id]').length===2,null,{timeout:10000});
  await page.click('[data-access-member-id="m2"] [data-access-toggle]');
  await page.waitForFunction(()=>window.__ACCESS_PROOF__.rpcs.some(row=>row.name==='octagon_admin_set_access'),null,{timeout:10000});
  await page.waitForTimeout(80);
  report.admin=await snapshot(page);
  const rosterRpc=report.admin.rpcs.find(row=>row.name==='octagon_admin_access_roster');
  const toggleRpc=report.admin.rpcs.find(row=>row.name==='octagon_admin_set_access');
  assert.equal(rosterRpc?.args?.p_member_token,'access-owner-token','Admin roster loading must reuse published identity.');
  assert.equal(toggleRpc?.args?.p_member_token,'access-owner-token','Admin access changes must reuse published identity.');
  assert.equal(toggleRpc?.args?.p_target_member_id,'m2');
  assert.equal(report.admin.canonicalResolves,0);
  assert.equal(report.admin.canonicalRequires,0);
  assert.equal(report.admin.editorResolves,0);
  assert.equal(report.admin.storageReads.some(row=>/octagon-access-panel\.js/i.test(row.stack)),false);
  assert.equal(report.admin.panelHidden,false);
  assert.equal(report.admin.rosterRows,2);

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

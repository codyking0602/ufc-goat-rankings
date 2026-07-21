import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const ORIGIN='http://127.0.0.1:4173';
const BASE=`${ORIGIN}/octagon-notification-identity-owner-proof.html`;
const REPORT='/tmp/octagon-notification-identity-owner-report.json';
const report={passed:false,stage:'static-contract',uncached:null,readiness:null,concurrent:null,activity:null,error:null};
let browser;

const source=fs.readFileSync('assets/js/octagon-notifications.js','utf8');
assert.match(source,/function passiveIdentity\(value\)[\s\S]*UFC_PLAY_PROFILE\?\.identity[\s\S]*UFC_APP_PROFILE\?\.identity/,'Octagon notifications must consume published identity caches.');
assert.doesNotMatch(source,/UFC_PLAY_PROFILE\?\.(?:resolve|resolveIdentity)\?\.\(/,'Octagon notifications must not invoke canonical resolution.');
assert.doesNotMatch(source,/UFC_APP_PROFILE\?\.resolve\?\.\(/,'Octagon notifications must not invoke editor resolution.');
assert.doesNotMatch(source,/TOKEN_KEY|localStorage\.getItem\(/,'Octagon notifications must not own canonical storage.');

const identity={
  ok:true,
  group:{code:'GOAT26'},
  groupCode:'GOAT26',
  member:{id:'m1',display_name:'Cody',is_admin:true},
  memberToken:'notification-owner-token',
  member_token:'notification-owner-token'
};
const status={
  ok:true,
  can_access:true,
  unread_count:3,
  vapid_public_key:'test-vapid-key',
  member:{id:'m1',display_name:'Cody',is_admin:true}
};

const html=`<!doctype html><html><head><meta charset="utf-8"><title>Octagon notification identity ownership</title></head><body>
  <button type="button" class="tab" data-octagon-beta-tab aria-disabled="false">War Room</button>
  <section id="octagon" class="active-view">
    <section data-octagon-board>
      <header class="octagon-board-head"><div class="octagon-board-head-actions"><button type="button" data-octagon-refresh>Refresh</button></div></header>
    </section>
  </section>
  <script>
    window.__NOTIFICATION_IDENTITY__=${JSON.stringify(identity)};
    window.__NOTIFICATION_STATUS__=${JSON.stringify(status)};
    window.__NOTIFICATION_PROOF__={canonicalResolves:0,canonicalRequires:0,editorResolves:0,rpcs:[],channels:0,sends:0,functions:[]};
    const proof=window.__NOTIFICATION_PROOF__;
    const identity=window.__NOTIFICATION_IDENTITY__;
    const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
    const channel={
      on(){return this;},
      subscribe(){return this;},
      async send(payload){proof.sends+=1;proof.lastSend=payload;return'ok';},
      async unsubscribe(){return'ok';}
    };
    const client={
      async rpc(name,args){
        proof.rpcs.push({name,args});
        if(name==='octagon_activity_status'){
          await sleep(180);
          return{data:structuredClone(window.__NOTIFICATION_STATUS__),error:null};
        }
        if(name==='octagon_mark_seen')return{data:{ok:true},error:null};
        if(name==='octagon_post_message')return{data:{ok:true,message:{id:'new-message',parent_message_id:null}},error:null};
        if(name==='octagon_delete_message')return{data:{ok:true},error:null};
        return{data:{ok:true},error:null};
      },
      channel(){proof.channels+=1;return channel;},
      async removeChannel(){return'ok';},
      functions:{async invoke(name,args){proof.functions.push({name,args});return{data:{ok:true},error:null};}}
    };
    window.UFC_PLAY_PROFILE={
      identity:null,
      client,
      async resolve(){proof.canonicalResolves+=1;this.identity=identity;return identity;},
      async require(){proof.canonicalRequires+=1;this.identity=identity;return identity;}
    };
    window.UFC_APP_PROFILE={
      identity:null,
      async resolve(){proof.editorResolves+=1;throw new Error('Octagon notifications invoked the editor resolver.');}
    };
  </script>
  <script src="/assets/js/octagon-notifications.js"></script>
</body></html>`;

async function snapshot(page){
  return page.evaluate(()=>({
    ...window.__NOTIFICATION_PROOF__,
    storageReads:window.__NOTIFICATION_STORAGE_READS__,
    unread:Number(window.UFC_OCTAGON_NOTIFICATIONS?.unread||0),
    badges:document.querySelectorAll('[data-octagon-unread-badge]').length,
    badgeText:document.querySelector('[data-octagon-unread-badge]')?.textContent||'',
    badgeHidden:document.querySelector('[data-octagon-unread-badge]')?.hidden,
    alerts:document.querySelectorAll('[data-octagon-alerts]').length,
    alertsHidden:document.querySelector('[data-octagon-alerts]')?.hidden,
    statuses:document.querySelectorAll('[data-octagon-notification-status]').length,
    banners:document.querySelectorAll('[data-octagon-return-banner]').length,
    signInSurfaces:document.querySelectorAll('[role="dialog"],.app-profile-overlay,.play-profile-modal,.picks-pin-signin').length
  }));
}

async function openProofPage(context){
  const page=await context.newPage();
  await page.addInitScript(()=>{
    localStorage.setItem('ufc-picks:group:GOAT26','stale-notification-token');
    const originalGet=Storage.prototype.getItem;
    window.__NOTIFICATION_STORAGE_READS__=[];
    Storage.prototype.getItem=function(key){
      const value=String(key);
      if(this===window.localStorage&&value==='ufc-picks:group:GOAT26'){
        window.__NOTIFICATION_STORAGE_READS__.push({key:value,stack:String(new Error().stack||'')});
      }
      return originalGet.call(this,key);
    };
  });
  await page.route(BASE,route=>route.fulfill({status:200,contentType:'text/html',body:html}));
  await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_OCTAGON_NOTIFICATIONS&&window.__NOTIFICATION_PROOF__,null,{timeout:10000});
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
  assert.equal(report.uncached.canonicalResolves,0,'Uncached notification startup must not invoke canonical resolution.');
  assert.equal(report.uncached.canonicalRequires,0,'Notification startup must not invoke sign-in ownership.');
  assert.equal(report.uncached.editorResolves,0,'Notification startup must not invoke editor resolution.');
  assert.equal(report.uncached.rpcs.length,0,'Uncached notification startup must wait for published identity.');
  assert.equal(report.uncached.storageReads.some(row=>/octagon-notifications\.js/i.test(row.stack)),false,'Notifications must not read the canonical token from storage.');
  assert.equal(report.uncached.badges,1,'One unread badge shell must remain.');
  assert.equal(report.uncached.alerts,1,'One Alerts button shell must remain.');
  assert.equal(report.uncached.alertsHidden,true,'Alerts must remain hidden before verified access.');
  assert.equal(report.uncached.statuses,1);
  assert.equal(report.uncached.banners,1);
  assert.equal(report.uncached.signInSurfaces,0);

  report.stage='canonical-readiness';
  await page.evaluate(()=>{
    window.UFC_PLAY_PROFILE.identity=window.__NOTIFICATION_IDENTITY__;
    window.UFC_APP_PROFILE.identity=window.__NOTIFICATION_IDENTITY__;
    window.__NOTIFICATION_PROOF__.rpcs=[];
    window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:window.__NOTIFICATION_IDENTITY__}));
  });
  await page.waitForFunction(()=>window.UFC_OCTAGON_NOTIFICATIONS?.unread===3,null,{timeout:10000});
  report.readiness=await snapshot(page);
  const readinessStatus=report.readiness.rpcs.filter(row=>row.name==='octagon_activity_status');
  assert.equal(readinessStatus.length,1,'One readiness handoff must start one activity-status RPC.');
  assert.equal(readinessStatus[0]?.args?.p_member_token,'notification-owner-token');
  assert.equal(report.readiness.canonicalResolves,0);
  assert.equal(report.readiness.canonicalRequires,0);
  assert.equal(report.readiness.editorResolves,0);
  assert.equal(report.readiness.storageReads.some(row=>/octagon-notifications\.js/i.test(row.stack)),false);
  assert.equal(report.readiness.badgeText,'3');
  assert.equal(report.readiness.badgeHidden,false);
  assert.equal(report.readiness.alertsHidden,false);

  report.stage='concurrent-refresh';
  await page.evaluate(()=>{
    window.__NOTIFICATION_PROOF__.rpcs=[];
    window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:window.__NOTIFICATION_IDENTITY__}));
    window.dispatchEvent(new CustomEvent('ufc-app-profile-updated',{detail:{identity:window.__NOTIFICATION_IDENTITY__}}));
    window.dispatchEvent(new CustomEvent('ufc-canonical-group-ready',{detail:{canonicalCode:'GOAT26'}}));
    void window.UFC_OCTAGON_NOTIFICATIONS.refreshStatus();
    void window.UFC_OCTAGON_NOTIFICATIONS.refreshStatus();
    void window.UFC_OCTAGON_NOTIFICATIONS.refreshStatus();
  });
  await page.waitForFunction(()=>window.__NOTIFICATION_PROOF__.rpcs.some(row=>row.name==='octagon_activity_status'),null,{timeout:10000});
  await page.waitForTimeout(260);
  report.concurrent=await snapshot(page);
  assert.equal(report.concurrent.rpcs.filter(row=>row.name==='octagon_activity_status').length,1,'Competing notification refreshes must share one activity-status request.');
  assert.equal(report.concurrent.canonicalResolves,0);
  assert.equal(report.concurrent.canonicalRequires,0);
  assert.equal(report.concurrent.editorResolves,0);

  report.stage='activity-actions';
  await page.evaluate(()=>{window.__NOTIFICATION_PROOF__.rpcs=[];window.__NOTIFICATION_PROOF__.functions=[];window.__NOTIFICATION_PROOF__.sends=0;});
  await page.evaluate(async()=>{
    await window.UFC_OCTAGON_NOTIFICATIONS.markSeen();
    await window.UFC_OCTAGON_NOTIFICATIONS.messageCreated('m-post','post');
  });
  await page.waitForFunction(()=>window.__NOTIFICATION_PROOF__.functions.some(row=>row.name==='octagon-push'),null,{timeout:10000});
  report.activity=await snapshot(page);
  const seen=report.activity.rpcs.find(row=>row.name==='octagon_mark_seen');
  const push=report.activity.functions.find(row=>row.name==='octagon-push');
  assert.equal(seen?.args?.p_member_token,'notification-owner-token','Mark-seen must reuse published identity.');
  assert.equal(push?.args?.body?.member_token,'notification-owner-token','Push invocation must reuse published identity.');
  assert.equal(push?.args?.body?.message_id,'m-post');
  assert.equal(report.activity.sends,1,'Activity broadcast must remain.');
  assert.equal(report.activity.canonicalResolves,0);
  assert.equal(report.activity.canonicalRequires,0);
  assert.equal(report.activity.editorResolves,0);
  assert.equal(report.activity.storageReads.some(row=>/octagon-notifications\.js/i.test(row.stack)),false);

  report.passed=true;
  report.stage='complete';
  console.log('Octagon notification passive identity ownership proof passed.');
  await context.close();
}catch(error){
  report.error={message:error?.message||String(error),stack:error?.stack||null};
  throw error;
}finally{
  fs.writeFileSync(REPORT,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}

import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

await import('./test-notification-surface-passive-contract.mjs');

const SOURCE_PATH='assets/js/app-notification-center.js';
const BASE='http://127.0.0.1:4173/notification-identity-owner-proof.html';
const REPORT='/tmp/notification-identity-owner-report.json';
const report={passed:false,stage:'static-contract',initial:null,readiness:null,profileUpdate:null,surfaceTriggers:null,cacheRestore:null,preference:null,interactive:null,error:null};
let browser;

const source=fs.readFileSync(SOURCE_PATH,'utf8');
assert.match(source,/function cachedIdentity\(\)[\s\S]*UFC_PLAY_PROFILE\?\.identity[\s\S]*UFC_APP_PROFILE\?\.identity/,'Notification center must consume the published canonical identity cache.');
assert.doesNotMatch(source,/UFC_PLAY_PROFILE\?\.(?:resolve|resolveIdentity)\?\.\(/,'Notification center must not invoke the canonical resolver.');
assert.doesNotMatch(source,/UFC_APP_PROFILE\?\.resolve\?\.\(/,'Notification center must not invoke the profile editor resolver.');
assert.match(source,/async function loadSettings\(force=false\)[\s\S]*const who=cachedIdentity\(\),rpc=client\(\),token=tokenFor\(who\)/,'Passive settings loads must read cached identity before RPC work.');
assert.match(source,/async function requireIdentity\(\)[\s\S]*UFC_PLAY_PROFILE\?\.require\?\.\(/,'Explicit notification actions may require identity through the canonical owner.');
assert.match(source,/ufc-play-profile-ready/,'Notification center must retain canonical readiness synchronization.');

const html=`<!doctype html>
<html><head><meta charset="utf-8"><title>Notification identity owner proof</title></head>
<body>
  <div class="app-profile-panel"><div class="app-profile-body"><section class="app-profile-photo-section"></section></div></div>
  <div class="profile-activity-title"><strong>Cody</strong></div>
  <div class="profile-activity-body"><div class="profile-activity-grid"><button type="button" data-profile-activity-destination="picks">Open Picks</button></div></div>
  <button type="button" class="app-profile-chip">Profile</button>
  <script>
  (function(){
    const member={id:'m1',display_name:'Cody'};
    const identity={memberToken:'notification-owner-token',member_token:'notification-owner-token',member};
    const ok=data=>({data,error:null});
    const proof=window.__NOTIFICATION_OWNER__={
      canonicalResolves:0,
      canonicalRequires:0,
      editorResolves:0,
      rpcs:[],
      publicLoadSettings:[],
      publicRender:[],
      routeActivations:[],
      profileCloses:0,
      identity
    };
    const client={
      async rpc(name,args){
        proof.rpcs.push({name,args});
        if(name==='app_notification_settings')return ok({ok:true,preferences:{direct_challenges:false,picks_reminders:false,war_room_messages:false},vapid_public_key:'proof-key',push_enabled:false});
        if(name==='app_notification_update_preferences')return ok({ok:true,preferences:{direct_challenges:Boolean(args?.p_direct_challenges),picks_reminders:Boolean(args?.p_picks_reminders),war_room_messages:Boolean(args?.p_war_room_messages)}});
        if(name==='app_register_push_subscription'||name==='app_remove_push_subscription'||name==='app_notification_send_test')return ok({ok:true});
        return ok({ok:true});
      }
    };
    window.UFC_PLAY_PROFILE={
      identity:null,
      client,
      async resolve(){
        proof.canonicalResolves+=1;
        const node=document.createElement('div');node.dataset.unexpectedNotificationSignin='true';document.body.appendChild(node);
        this.identity=proof.identity;
        return this.identity;
      },
      async require(){
        proof.canonicalRequires+=1;
        this.identity=proof.identity;
        return this.identity;
      }
    };
    window.UFC_APP_PROFILE={
      identity:null,
      async resolve(){
        proof.editorResolves+=1;
        throw new Error('Notification center invoked the profile editor resolver.');
      }
    };
    window.UFC_PROFILE_ACTIVITY={close(){proof.profileCloses+=1;}};
    window.UFC_APP_SHELL={activateDestination(destination){proof.routeActivations.push(destination);return true;}};

    let notificationApi=null;
    Object.defineProperty(window,'UFC_APP_NOTIFICATIONS',{
      configurable:true,
      get(){return notificationApi;},
      set(value){
        const originalLoad=value.loadSettings;
        const originalRender=value.render;
        value.loadSettings=function(...args){
          proof.publicLoadSettings.push({args,stack:String(new Error().stack||'')});
          return originalLoad.apply(value,args);
        };
        value.render=function(...args){
          proof.publicRender.push({args,stack:String(new Error().stack||'')});
          return originalRender.apply(value,args);
        };
        notificationApi=value;
      }
    });
  })();
  </script>
  <script src="/assets/js/app-notification-center.js"></script>
  <script src="/assets/js/app-notification-surface-fix.js"></script>
</body></html>`;

async function snapshot(page){
  return await page.evaluate(()=>({
    canonicalResolves:window.__NOTIFICATION_OWNER__.canonicalResolves,
    canonicalRequires:window.__NOTIFICATION_OWNER__.canonicalRequires,
    editorResolves:window.__NOTIFICATION_OWNER__.editorResolves,
    rpcs:window.__NOTIFICATION_OWNER__.rpcs,
    publicLoadSettings:window.__NOTIFICATION_OWNER__.publicLoadSettings,
    publicRender:window.__NOTIFICATION_OWNER__.publicRender,
    routeActivations:window.__NOTIFICATION_OWNER__.routeActivations,
    profileCloses:window.__NOTIFICATION_OWNER__.profileCloses,
    storageReads:window.__NOTIFICATION_STORAGE_READS__,
    profileCards:document.querySelectorAll('[data-app-notification-center="profile"]').length,
    activityCards:document.querySelectorAll('[data-app-notification-center="activity"]').length,
    unexpectedSignin:document.querySelectorAll('[data-unexpected-notification-signin]').length,
    compatibilityVersion:window.UFC_APP_NOTIFICATION_SURFACE_FIX?.version||''
  }));
}

async function clearActivity(page){
  await page.evaluate(()=>{
    window.__NOTIFICATION_OWNER__.rpcs=[];
    window.__NOTIFICATION_OWNER__.publicLoadSettings=[];
    window.__NOTIFICATION_OWNER__.publicRender=[];
    window.__NOTIFICATION_STORAGE_READS__=[];
  });
}

function assertPassiveSurface(value,stage){
  assert.equal(value.publicLoadSettings.length,0,`${stage}: compatibility surface invoked canonical settings ownership.`);
  assert.equal(value.publicRender.length,0,`${stage}: compatibility surface invoked canonical render ownership.`);
}

try{
  report.stage='browser-launch';
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const page=await context.newPage();

  await page.addInitScript(()=>{
    const registration={pushManager:{getSubscription:async()=>null},update:async()=>{}};
    Object.defineProperty(navigator,'serviceWorker',{configurable:true,value:{
      getRegistration:async()=>null,
      register:async()=>registration,
      ready:Promise.resolve(registration)
    }});
    const originalGet=Storage.prototype.getItem;
    originalGet.call(localStorage,'ufc-picks:group:GOAT26');
    localStorage.setItem('ufc-picks:group:GOAT26','stale-storage-token');
    window.__NOTIFICATION_STORAGE_READS__=[];
    Storage.prototype.getItem=function(key){
      const value=String(key);
      if(this===window.localStorage&&value==='ufc-picks:group:GOAT26')window.__NOTIFICATION_STORAGE_READS__.push({key:value,stack:String(new Error().stack||'')});
      return originalGet.call(this,key);
    };
  });

  await page.route(BASE,route=>route.fulfill({status:200,contentType:'text/html',body:html}));
  await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForSelector('[data-app-notification-center="profile"]',{state:'attached',timeout:10000});
  await page.waitForSelector('[data-app-notification-center="activity"]',{state:'attached',timeout:10000});
  await page.waitForFunction(()=>window.UFC_APP_NOTIFICATION_SURFACE_FIX,null,{timeout:10000});
  await page.waitForTimeout(1650);

  report.stage='uncached-startup';
  report.initial=await snapshot(page);
  assert.equal(report.initial.canonicalResolves,0,'Passive notification startup must not invoke the canonical resolver.');
  assert.equal(report.initial.canonicalRequires,0,'Passive notification startup must not require sign-in.');
  assert.equal(report.initial.editorResolves,0,'Passive notification startup must not invoke the editor resolver.');
  assert.equal(report.initial.rpcs.filter(row=>row.name==='app_notification_settings').length,0,'Uncached startup must wait for published identity before loading settings.');
  assert.equal(report.initial.storageReads.some(row=>/app-notification-(?:center|surface-fix)\.js/i.test(row.stack)),false,'Notification surfaces must not read canonical access from storage.');
  assert.equal(report.initial.profileCards,1,'Notification center must retain one profile surface.');
  assert.equal(report.initial.activityCards,1,'Notification center must retain one activity surface.');
  assert.equal(report.initial.unexpectedSignin,0,'Passive notification startup must not create a sign-in surface.');
  assert.match(report.initial.compatibilityVersion,/profile-cache-only/,'The profile-cache-only compatibility runtime did not load.');
  assertPassiveSurface(report.initial,'uncached startup');

  report.stage='canonical-readiness';
  await clearActivity(page);
  await page.evaluate(()=>{
    window.UFC_PLAY_PROFILE.identity=window.__NOTIFICATION_OWNER__.identity;
    window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:window.__NOTIFICATION_OWNER__.identity}));
  });
  await page.waitForFunction(()=>window.__NOTIFICATION_OWNER__.rpcs.some(row=>row.name==='app_notification_settings'&&row.args?.p_member_token==='notification-owner-token'),null,{timeout:10000});
  await page.waitForTimeout(180);
  report.readiness=await snapshot(page);
  assert.equal(report.readiness.canonicalResolves,0,'Published canonical readiness must not re-enter the resolver.');
  assert.equal(report.readiness.canonicalRequires,0,'Published canonical readiness must not require sign-in.');
  assert.equal(report.readiness.editorResolves,0);
  assert.equal(report.readiness.rpcs.filter(row=>row.name==='app_notification_settings').length,1,'Canonical readiness must load notification settings once.');
  assert.equal(report.readiness.profileCards,1);
  assert.equal(report.readiness.activityCards,1);
  assertPassiveSurface(report.readiness,'canonical readiness');

  report.stage='profile-update';
  await clearActivity(page);
  await page.evaluate(()=>{
    const updated={memberToken:'notification-update-token',member_token:'notification-update-token',member:{id:'m1',display_name:'Cody Updated'}};
    window.UFC_PLAY_PROFILE.identity=updated;
    window.dispatchEvent(new CustomEvent('ufc-app-profile-updated',{detail:{identity:updated}}));
  });
  await page.waitForFunction(()=>window.__NOTIFICATION_OWNER__.rpcs.some(row=>row.name==='app_notification_settings'&&row.args?.p_member_token==='notification-update-token'),null,{timeout:10000});
  await page.waitForTimeout(180);
  report.profileUpdate=await snapshot(page);
  assert.equal(report.profileUpdate.canonicalResolves,0,'A published profile update must reuse its supplied canonical identity.');
  assert.equal(report.profileUpdate.canonicalRequires,0);
  assert.equal(report.profileUpdate.editorResolves,0);
  assert.equal(report.profileUpdate.rpcs.filter(row=>row.name==='app_notification_settings').length,1,'A profile update must have one canonical settings owner.');
  assert.equal(report.profileUpdate.storageReads.some(row=>/app-notification-(?:center|surface-fix)\.js/i.test(row.stack)),false);
  assertPassiveSurface(report.profileUpdate,'profile update');

  report.stage='surface-triggers';
  await clearActivity(page);
  await page.evaluate(()=>{
    window.dispatchEvent(new CustomEvent('octagon-hq:soft-refresh'));
    const panel=document.createElement('div');panel.className='app-profile-panel';panel.innerHTML='<div class="app-profile-body"></div>';document.body.appendChild(panel);
    document.querySelector('.app-profile-chip').click();
    window.UFC_APP_NOTIFICATION_SURFACE_FIX.schedule();
  });
  await page.waitForTimeout(1350);
  report.surfaceTriggers=await snapshot(page);
  assert.equal(report.surfaceTriggers.rpcs.filter(row=>row.name==='app_notification_settings').length,0,'Soft refresh, observer, click, and direct cache sync must not start settings work.');
  assert.equal(report.surfaceTriggers.canonicalResolves,0);
  assert.equal(report.surfaceTriggers.canonicalRequires,0);
  assert.equal(report.surfaceTriggers.editorResolves,0);
  assertPassiveSurface(report.surfaceTriggers,'surface compatibility triggers');

  report.stage='cache-restore';
  report.cacheRestore=await page.evaluate(()=>{
    const body=document.querySelector('.profile-activity-body');
    window.UFC_APP_NOTIFICATION_SURFACE_FIX.saveFinishedProfile();
    body.innerHTML='<div class="profile-activity-loading">Loading</div>';
    const restored=window.UFC_APP_NOTIFICATION_SURFACE_FIX.restoreCachedProfile();
    const action=body.querySelector('[data-profile-activity-destination="picks"]');
    action?.click();
    return{
      restored,
      cached:body.dataset.cachedActivityProfile||'',
      grid:Boolean(body.querySelector('.profile-activity-grid')),
      notificationCards:body.querySelectorAll('[data-app-notification-center]').length,
      routeActivations:[...window.__NOTIFICATION_OWNER__.routeActivations],
      profileCloses:window.__NOTIFICATION_OWNER__.profileCloses,
      publicLoadSettings:[...window.__NOTIFICATION_OWNER__.publicLoadSettings],
      publicRender:[...window.__NOTIFICATION_OWNER__.publicRender]
    };
  });
  assert.equal(report.cacheRestore.restored,true,'Cached activity profile did not restore.');
  assert.equal(report.cacheRestore.cached,'true');
  assert.equal(report.cacheRestore.grid,true);
  assert.equal(report.cacheRestore.notificationCards,0,'Cached activity HTML retained canonical notification markup.');
  assert.equal(report.cacheRestore.routeActivations.at(-1),'picks','Restored cached action did not delegate through the shell.');
  assert(report.cacheRestore.profileCloses>0,'Restored cached action did not close the activity surface.');
  assert.equal(report.cacheRestore.publicLoadSettings.length,0);
  assert.equal(report.cacheRestore.publicRender.length,0);

  report.stage='preference-save';
  await clearActivity(page);
  await page.evaluate(()=>window.UFC_APP_NOTIFICATIONS.updatePreference('direct_challenges',true));
  await page.waitForFunction(()=>window.__NOTIFICATION_OWNER__.rpcs.some(row=>row.name==='app_notification_update_preferences'),null,{timeout:10000});
  report.preference=await snapshot(page);
  const preferenceRpc=report.preference.rpcs.find(row=>row.name==='app_notification_update_preferences');
  assert.equal(preferenceRpc?.args?.p_member_token,'notification-update-token','Notification preference writes must use the published canonical token.');
  assert.equal(preferenceRpc?.args?.p_direct_challenges,true);
  assert.equal(report.preference.canonicalResolves,0);
  assert.equal(report.preference.canonicalRequires,0,'Cached explicit actions must not prompt again.');
  assert.equal(report.preference.editorResolves,0);
  assert.equal(report.preference.storageReads.some(row=>/app-notification-(?:center|surface-fix)\.js/i.test(row.stack)),false);
  assertPassiveSurface(report.preference,'preference save');

  report.stage='explicit-fallback';
  await page.reload({waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForSelector('[data-app-notification-center="profile"]',{state:'attached',timeout:10000});
  await page.waitForFunction(()=>window.UFC_APP_NOTIFICATION_SURFACE_FIX,null,{timeout:10000});
  await page.waitForTimeout(400);
  await clearActivity(page);
  await page.evaluate(()=>window.UFC_APP_NOTIFICATIONS.disableDevice());
  await page.waitForFunction(()=>window.__NOTIFICATION_OWNER__.canonicalRequires===1&&window.__NOTIFICATION_OWNER__.rpcs.some(row=>row.name==='app_notification_settings'),null,{timeout:10000});
  report.interactive=await snapshot(page);
  assert.equal(report.interactive.canonicalResolves,0,'Explicit notification actions must still avoid the generic resolver.');
  assert.equal(report.interactive.canonicalRequires,1,'An explicit notification action may require identity through the canonical owner.');
  assert.equal(report.interactive.editorResolves,0);
  assert.equal(report.interactive.rpcs.some(row=>row.name==='app_notification_settings'&&row.args?.p_member_token==='notification-owner-token'),true,'Explicit identity fallback must load settings with the required token.');
  assert.equal(report.interactive.storageReads.some(row=>/app-notification-(?:center|surface-fix)\.js/i.test(row.stack)),false);
  assertPassiveSurface(report.interactive,'explicit fallback');

  report.passed=true;
  report.stage='complete';
  console.log('Notification passive identity and surface ownership proof passed.');
  await context.close();
}catch(error){
  report.error={message:error?.message||String(error),stack:error?.stack||null};
  throw error;
}finally{
  fs.writeFileSync(REPORT,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}

import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE='http://127.0.0.1:4173/notification-identity-owner-proof.html';
const REPORT='/tmp/notification-identity-owner-report.json';
const report={passed:false,stage:'boot',initial:null,profileUpdate:null,preference:null,error:null};
let browser;

const html=`<!doctype html>
<html><head><meta charset="utf-8"><title>Notification identity owner proof</title></head>
<body>
  <div class="app-profile-panel"><div class="app-profile-body"><section class="app-profile-photo-section"></section></div></div>
  <div class="profile-activity-body"><div class="profile-activity-grid"></div></div>
  <script>
  (function(){
    const member={id:'m1',display_name:'Cody'};
    const identity={memberToken:'notification-owner-token',member_token:'notification-owner-token',member};
    const ok=data=>({data,error:null});
    window.__NOTIFICATION_OWNER__={canonicalResolves:0,editorResolves:0,rpcs:[],identity};
    const client={
      async rpc(name,args){
        window.__NOTIFICATION_OWNER__.rpcs.push({name,args});
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
        window.__NOTIFICATION_OWNER__.canonicalResolves+=1;
        this.identity=window.__NOTIFICATION_OWNER__.identity;
        return this.identity;
      }
    };
    window.UFC_APP_PROFILE={
      identity:null,
      async resolve(){
        window.__NOTIFICATION_OWNER__.editorResolves+=1;
        throw new Error('Notification center invoked the profile editor resolver.');
      }
    };
  })();
  </script>
  <script src="/assets/js/app-notification-center.js"></script>
</body></html>`;

try{
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const page=await context.newPage();

  await page.addInitScript(()=>{
    const registration={pushManager:{getSubscription:async()=>null}};
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
      const text=String(key);
      if(this===window.localStorage&&text==='ufc-picks:group:GOAT26'){
        window.__NOTIFICATION_STORAGE_READS__.push({key:text,stack:String(new Error().stack||'')});
      }
      return originalGet.call(this,key);
    };
  });

  await page.route(BASE,route=>route.fulfill({status:200,contentType:'text/html',body:html}));
  report.stage='launch';
  await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_APP_NOTIFICATIONS?.settings,null,{timeout:30000});
  await page.waitForSelector('[data-app-notification-center="profile"]',{state:'attached',timeout:10000});
  await page.waitForSelector('[data-app-notification-center="activity"]',{state:'attached',timeout:10000});

  report.stage='initial-settings';
  report.initial=await page.evaluate(()=>({
    canonicalResolves:window.__NOTIFICATION_OWNER__.canonicalResolves,
    editorResolves:window.__NOTIFICATION_OWNER__.editorResolves,
    rpcs:window.__NOTIFICATION_OWNER__.rpcs,
    storageReads:window.__NOTIFICATION_STORAGE_READS__,
    profileCards:document.querySelectorAll('[data-app-notification-center="profile"]').length,
    activityCards:document.querySelectorAll('[data-app-notification-center="activity"]').length
  }));
  assert.equal(report.initial.canonicalResolves,1,'Notification settings must resolve through the canonical profile owner.');
  assert.equal(report.initial.editorResolves,0,'Notification settings must not invoke the profile editor resolver.');
  assert.equal(report.initial.rpcs.filter(row=>row.name==='app_notification_settings').length,1,'Notification settings must load once.');
  assert.equal(report.initial.rpcs.find(row=>row.name==='app_notification_settings')?.args?.p_member_token,'notification-owner-token');
  assert.equal(report.initial.storageReads.some(row=>/app-notification-center\.js/i.test(row.stack)),false,'Notification center must not read canonical access from storage.');
  assert.equal(report.initial.profileCards,1,'Notification settings must retain one profile surface.');
  assert.equal(report.initial.activityCards,1,'Notification settings must retain one activity surface.');

  report.stage='profile-update';
  await page.evaluate(()=>{
    const updated={memberToken:'notification-update-token',member_token:'notification-update-token',member:{id:'m1',display_name:'Cody Updated'}};
    window.UFC_PLAY_PROFILE.identity=updated;
    window.__NOTIFICATION_OWNER__.rpcs=[];
    window.__NOTIFICATION_STORAGE_READS__=[];
    window.dispatchEvent(new CustomEvent('ufc-app-profile-updated',{detail:{identity:updated}}));
  });
  await page.waitForFunction(()=>window.__NOTIFICATION_OWNER__.rpcs.some(row=>row.name==='app_notification_settings'&&row.args?.p_member_token==='notification-update-token'),null,{timeout:10000});
  report.profileUpdate=await page.evaluate(()=>({
    canonicalResolves:window.__NOTIFICATION_OWNER__.canonicalResolves,
    editorResolves:window.__NOTIFICATION_OWNER__.editorResolves,
    rpcs:window.__NOTIFICATION_OWNER__.rpcs,
    storageReads:window.__NOTIFICATION_STORAGE_READS__
  }));
  assert.equal(report.profileUpdate.canonicalResolves,1,'A published profile update must reuse its supplied canonical identity.');
  assert.equal(report.profileUpdate.editorResolves,0);
  assert.equal(report.profileUpdate.storageReads.some(row=>/app-notification-center\.js/i.test(row.stack)),false);

  report.stage='preference-save';
  await page.evaluate(()=>{window.__NOTIFICATION_OWNER__.rpcs=[];window.__NOTIFICATION_STORAGE_READS__=[];});
  await page.evaluate(()=>window.UFC_APP_NOTIFICATIONS.updatePreference('direct_challenges',true));
  await page.waitForFunction(()=>window.__NOTIFICATION_OWNER__.rpcs.some(row=>row.name==='app_notification_update_preferences'),null,{timeout:10000});
  report.preference=await page.evaluate(()=>({
    editorResolves:window.__NOTIFICATION_OWNER__.editorResolves,
    rpcs:window.__NOTIFICATION_OWNER__.rpcs,
    storageReads:window.__NOTIFICATION_STORAGE_READS__,
    enabled:window.UFC_APP_NOTIFICATIONS.settings?.preferences?.direct_challenges
  }));
  const preferenceRpc=report.preference.rpcs.find(row=>row.name==='app_notification_update_preferences');
  assert.equal(preferenceRpc?.args?.p_member_token,'notification-update-token','Notification preference writes must use the supplied canonical identity token.');
  assert.equal(preferenceRpc?.args?.p_direct_challenges,true);
  assert.equal(report.preference.editorResolves,0);
  assert.equal(report.preference.storageReads.some(row=>/app-notification-center\.js/i.test(row.stack)),false);
  assert.equal(report.preference.enabled,true,'Notification preference state must remain functional.');

  report.passed=true;
  report.stage='complete';
  console.log('Notification canonical identity ownership proof passed.');
  await context.close();
}catch(error){
  report.error={message:error?.message||String(error),stack:error?.stack||null};
  throw error;
}finally{
  fs.writeFileSync(REPORT,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}

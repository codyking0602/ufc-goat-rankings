import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const reportPath='/tmp/profile-signin-stability-report.json';
const report={
  passed:false,
  stage:'boot',
  scriptCounts:{},
  navigationRequests:[],
  finalUrl:'',
  freshLaunchRoute:'',
  activeViews:[],
  consoleErrors:[],
  error:null
};
let browser;
let page;

const supabaseStub=`
(function(){
  const member={id:'m1',display_name:'Cody',is_admin:true,points:40,score:40,correct:10,picks_made:12,picks_count:12,event_wins:1};
  const room={code:'ROOM01',event_id:'event-1'};
  const group={code:'GOAT26',name:'GOAT26',is_admin:true,member_count:1};
  const ok=data=>({data,error:null});
  const client={
    async rpc(name,args){
      if(name==='picks_member_login_pin')return ok({ok:true,group,member,member_token:'signin-stability-token',admin_token:'admin-token',active_room:room,rooms:[room]});
      if(name==='picks_group_for_room')return ok({group_code:'GOAT26'});
      if(name==='picks_group_snapshot')return ok({group,season:{name:'2026 Season',correct_points:4,underdog_bonus:1},me:member,members:[member],events:[{event_id:'event-1',room_code:'ROOM01',status:'active',is_active:true,name:'Test Event'}],available_events:[],active_room:room});
      if(name==='picks_room_snapshot')return ok({room,members:[member],me:member});
      if(name==='picks_public_events')return ok([{id:'event-1',name:'Test Event',status:'upcoming',eventDate:'2026-07-25T00:00:00Z',fights:[]}]);
      if(name==='picks_group_public')return ok(group);
      if(name==='picks_social_snapshot')return ok({group:{me:member,members:[member]}});
      if(name==='app_profile_resolve')return ok({ok:true,member,member_token:'signin-stability-token',rooms:[room]});
      if(name==='play_identity_snapshot')return ok({ok:true,member,member_token:'signin-stability-token',rooms:[room]});
      if(name==='app_profile_group_snapshot')return ok({ok:true,group,me:member,members:[member]});
      if(name==='app_profile_community_snapshot')return ok({ok:true,group,me_id:'m1',members:[member]});
      if(name==='app_notification_settings')return ok({ok:true,preferences:{direct_challenges:false,picks_reminders:false,war_room_messages:false},vapid_public_key:'',push_enabled:false});
      return ok({ok:true});
    },
    from(){
      const chain={
        select(){return chain;},eq(){return chain;},order(){return Promise.resolve({data:[],error:null});},
        limit(){return Promise.resolve({data:[],error:null});},insert(){return Promise.resolve({data:[],error:null});},
        update(){return chain;},delete(){return chain;},single(){return Promise.resolve({data:null,error:null});}
      };
      return chain;
    },
    channel(){return{on(){return this;},subscribe(){return this;}};},
    removeChannel(){return Promise.resolve();}
  };
  window.supabase={createClient(){return client;}};
})();
`;

try{
  browser=await chromium.launch({headless:true});
  page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',route=>route.fulfill({status:200,contentType:'application/javascript',body:supabaseStub}));
  page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push(message.text());});
  page.on('pageerror',error=>report.consoleErrors.push(error.stack||error.message));
  page.on('request',request=>{
    if(request.isNavigationRequest()&&request.frame()===page.mainFrame()&&request.url().startsWith('http://127.0.0.1:4173/')){
      report.navigationRequests.push(request.url());
    }
  });

  report.stage='launch';
  await page.goto('http://127.0.0.1:4173/index.html#home',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_APP_SHELL&&window.UFC_NATIVE_APP_SHELL&&window.UFCPicksPinAuth,null,{timeout:60000});
  await page.evaluate(()=>window.UFC_APP_SHELL.activateDestination('picks'));
  await page.waitForSelector('#picksPinSignInCard',{state:'visible',timeout:30000});

  report.stage='real-pin-signin';
  await page.fill('#picksPinGroupCode','GOAT26');
  await page.fill('#picksPinDisplayName','Cody');
  await page.fill('#picksPinValue','1234');
  await Promise.all([
    page.waitForURL(url=>url.searchParams.get('group')==='GOAT26'&&url.searchParams.get('room')==='ROOM01',{timeout:30000}),
    page.click('#picksPinSignInButton')
  ]);

  report.stage='post-signin-stability';
  await page.waitForFunction(()=>document.querySelector('#picks')?.classList.contains('active-view'),null,{timeout:30000});
  await page.waitForTimeout(9000);

  report.finalUrl=page.url();
  report.freshLaunchRoute=await page.evaluate(()=>document.documentElement.dataset.freshLaunchRoute||'');
  report.activeViews=await page.evaluate(()=>[...document.querySelectorAll('main.shell>.view.active-view')].map(node=>node.id));
  report.scriptCounts=await page.evaluate(()=>({
    productArchitecture:document.querySelectorAll('script[src*="assets/js/product-architecture.js"]').length,
    nativeShell:document.querySelectorAll('script[src*="assets/js/native-app-shell.js"]').length,
    notificationSurface:document.querySelectorAll('script[src*="assets/js/app-notification-surface-fix.js"]').length,
    bottomNav:document.querySelectorAll('[data-native-bottom-nav]').length
  }));

  const final=new URL(report.finalUrl);
  assert.equal(final.searchParams.get('group'),'GOAT26','Signed-in group route was removed.');
  assert.equal(final.searchParams.get('room'),'ROOM01','Signed-in active room route was removed.');
  assert.equal(final.searchParams.get('event'),'event-1','Signed-in event route was removed.');
  assert.equal(final.searchParams.get('picksView'),'event','Signed-in Picks view was removed.');
  assert.equal(final.hash,'#picks','Signed-in route did not remain on Picks.');
  assert.equal(report.freshLaunchRoute,'picks','Fresh launch controller did not recognize the signed-in Picks route.');
  assert.deepEqual(report.activeViews,['picks'],'Signed-in Picks did not remain the only active app view.');
  assert.equal(report.navigationRequests.length,2,`Expected one initial load and one successful-login navigation, received ${report.navigationRequests.length}.`);
  assert.equal(report.scriptCounts.productArchitecture,1,'Product architecture loaded more than once.');
  assert.equal(report.scriptCounts.nativeShell,1,'Native app shell loaded more than once.');
  assert.equal(report.scriptCounts.notificationSurface,1,'Notification surface loaded more than once.');
  assert.equal(report.scriptCounts.bottomNav,1,'Native bottom navigation was duplicated.');

  const featureErrors=report.consoleErrors.filter(message=>/fresh-home-launch|picks-persistent-groups|picks-member-pin|SyntaxError|ReferenceError/i.test(message));
  assert.deepEqual(featureErrors,[],'Real Picks PIN sign-in emitted a routing error.');

  report.passed=true;
  report.stage='complete';
}catch(error){
  report.error={message:error?.message||String(error),stack:error?.stack||null};
  throw error;
}finally{
  fs.writeFileSync(reportPath,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}

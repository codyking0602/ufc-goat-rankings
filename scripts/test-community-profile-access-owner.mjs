import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE='http://127.0.0.1:4173/index.html#home';
const REPORT='/tmp/community-profile-access-owner-report.json';
const report={passed:false,stage:'boot',initial:null,profileUpdate:null,picks:null,snapshot:null,error:null};
let browser;

const supabaseStub=`
(function(){
  const member={id:'m1',display_name:'Cody',is_admin:true,points:40,score:40,correct:10,picks_made:12,picks_count:12,event_wins:1,top_ten:[]};
  const room={code:'ROOM01',event_id:'event-1'};
  const group={code:'GOAT26',name:'GOAT26',is_admin:true,member_count:1};
  const identity=token=>({ok:true,group,member,member_token:token||'community-owner-token',active_room:room,rooms:[room]});
  const ok=data=>({data,error:null});
  const client={
    async rpc(name,args){
      if(name==='app_profile_resolve')return ok(identity(args?.p_member_token));
      if(name==='play_identity_snapshot')return ok(identity(args?.p_member_token));
      if(name==='app_profile_group_snapshot')return ok({ok:true,group,me:member,members:[member]});
      if(name==='app_profile_community_snapshot')return ok({ok:true,group,me_id:'m1',members:[member]});
      if(name==='picks_group_for_room')return ok({group_code:'GOAT26'});
      if(name==='picks_group_snapshot')return ok({group,season:{name:'2026 Season',correct_points:4,underdog_bonus:1},me:member,members:[member],events:[{event_id:'event-1',room_code:'ROOM01',status:'active',is_active:true,name:'Test Event'}],available_events:[],active_room:room});
      if(name==='picks_room_snapshot')return ok({room,members:[member],me:member});
      if(name==='picks_public_events')return ok([{id:'event-1',name:'Test Event',status:'upcoming',eventDate:'2026-07-25T00:00:00Z',fights:[]}]);
      if(name==='picks_group_public')return ok(group);
      if(name==='picks_social_snapshot')return ok({group:{me:member,members:[member]}});
      if(name==='app_notification_settings')return ok({ok:true,preferences:{direct_challenges:false,picks_reminders:false,war_room_messages:false},vapid_public_key:'',push_enabled:false});
      if(name==='picks_member_pin_status')return ok({has_pin:true});
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
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const page=await context.newPage();

  await page.addInitScript(()=>{
    const originalSet=Storage.prototype.setItem;
    originalSet.call(localStorage,'ufc-picks:group:GOAT26','community-owner-token');
    window.__COMMUNITY_ACCESS_WRITES__=[];
    window.__COMMUNITY_HISTORY_WRITES__=[];
    Storage.prototype.setItem=function(key,value){
      const text=String(key);
      if(this===window.localStorage&&(
        text==='ufc-player:group-code'||
        text==='ufc-picks:display-name'||
        text.startsWith('ufc-picks:group:')||
        text.startsWith('ufc-picks:room:')
      )){
        window.__COMMUNITY_ACCESS_WRITES__.push({key:text,value:String(value),stack:String(new Error().stack||'')});
      }
      return originalSet.call(this,key,value);
    };
    const originalReplace=history.replaceState.bind(history);
    history.replaceState=function(state,title,url){
      window.__COMMUNITY_HISTORY_WRITES__.push({url:String(url||''),stack:String(new Error().stack||'')});
      return originalReplace(state,title,url);
    };
  });

  report.stage='launch';
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',route=>route.fulfill({status:200,contentType:'application/javascript',body:supabaseStub}));
  await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_PLAY_PROFILE&&window.UFC_PRODUCT_ARCHITECTURE&&window.UFC_COMMUNITY_PROFILES&&window.UFCPicksPinAuth,null,{timeout:60000});
  await page.waitForSelector('#communityProfilesMount .community-directory',{state:'attached',timeout:30000});
  await page.waitForFunction(()=>localStorage.getItem('ufc-picks:room:ROOM01')==='community-owner-token',null,{timeout:30000});

  report.stage='initial-access';
  report.initial=await page.evaluate(()=>({
    group:localStorage.getItem('ufc-picks:group:GOAT26'),
    room:localStorage.getItem('ufc-picks:room:ROOM01'),
    active:localStorage.getItem('ufc-player:group-code'),
    display:localStorage.getItem('ufc-picks:display-name'),
    writes:window.__COMMUNITY_ACCESS_WRITES__,
    history:window.__COMMUNITY_HISTORY_WRITES__
  }));
  assert.equal(report.initial.group,'community-owner-token');
  assert.equal(report.initial.room,'community-owner-token');
  assert.equal(report.initial.active,'GOAT26');
  assert.equal(report.initial.display,'Cody');
  assert.equal(report.initial.writes.some(row=>/community-profiles\.js/i.test(row.stack)),false,'Community profiles must not persist shared Picks access.');
  assert.equal(report.initial.history.some(row=>/community-profiles\.js/i.test(row.stack)),false,'Community profiles must not own Picks route compatibility writes.');

  report.stage='profile-update';
  await page.evaluate(()=>{
    window.__PIN_REFRESH_COUNT__=0;
    window.UFCPicksPinAuth.refresh=()=>{window.__PIN_REFRESH_COUNT__+=1;};
    window.__COMMUNITY_ACCESS_WRITES__=[];
    window.dispatchEvent(new CustomEvent('ufc-app-profile-updated',{detail:{identity:window.UFC_PLAY_PROFILE.identity}}));
  });
  await page.waitForTimeout(250);
  report.profileUpdate=await page.evaluate(()=>({
    refreshes:window.__PIN_REFRESH_COUNT__,
    writes:window.__COMMUNITY_ACCESS_WRITES__
  }));
  assert.equal(report.profileUpdate.refreshes,1,'One profile update must produce one product-owned Picks compatibility refresh.');
  assert.equal(report.profileUpdate.writes.some(row=>/community-profiles\.js/i.test(row.stack)),false);

  report.stage='picks-handoff';
  await page.evaluate(()=>{
    const url=new URL(location.href);
    url.searchParams.delete('group');
    url.hash='picks';
    history.replaceState(history.state,'',`${url.pathname}${url.search}${url.hash}`);
    window.__PIN_REFRESH_COUNT__=0;
    window.__COMMUNITY_HISTORY_WRITES__=[];
    window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:'picks'}}));
  });
  await page.waitForTimeout(250);
  report.picks=await page.evaluate(()=>({
    group:new URL(location.href).searchParams.get('group'),
    refreshes:window.__PIN_REFRESH_COUNT__,
    history:window.__COMMUNITY_HISTORY_WRITES__,
    cardSuppressed:document.documentElement.dataset.sharedProfileAuth==='true'
  }));
  assert.equal(report.picks.group,'GOAT26','Product compatibility must retain the Picks group route handoff.');
  assert.equal(report.picks.refreshes,1,'One Picks view change must produce one product-owned compatibility refresh.');
  assert.equal(report.picks.history.some(row=>/community-profiles\.js/i.test(row.stack)),false);
  assert.equal(report.picks.cardSuppressed,true,'The shared-profile duplicate Picks card suppression must remain active.');

  report.stage='community-load';
  report.snapshot=await page.evaluate(()=>window.UFC_COMMUNITY_PROFILES.load(true));
  assert.equal(report.snapshot?.ok,true,'Community profile loading must remain functional after access ownership removal.');
  assert.equal(await page.locator('#communityProfilesMount').count(),1,'Community rendering must retain one mount.');

  report.passed=true;
  report.stage='complete';
  console.log('Community profile access ownership proof passed.');
  await context.close();
}catch(error){
  report.error={message:error?.message||String(error),stack:error?.stack||null};
  throw error;
}finally{
  fs.writeFileSync(REPORT,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}

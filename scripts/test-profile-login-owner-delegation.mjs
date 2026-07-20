import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE='http://127.0.0.1:4173/index.html#home';
const CREDENTIAL_RPCS=new Set(['app_profile_login','picks_member_login_pin','app_profile_resolve','play_identity_snapshot']);
let browser;

function supabaseStub(){
  return `
  (function(){
    const scenario=window.__PROFILE_OWNER_SCENARIO__||{};
    const member={id:'m1',display_name:'Cody',is_admin:true,points:40,score:40,correct:10,picks_made:12,picks_count:12,event_wins:1};
    const room={code:'ROOM01',event_id:'event-1'};
    const rooms=scenario.noRoom?[]:[room];
    const activeRoom=scenario.noRoom?null:room;
    const group={code:'GOAT26',name:'GOAT26',is_admin:true,member_count:1};
    const loginData=()=>({ok:true,group,member,member_token:'owner-token',admin_token:'owner-admin',active_room:activeRoom,rooms});
    const ok=data=>({data,error:null});
    const record=(name,args)=>window.__recordProfileRpc?.(name,args);
    const client={
      async rpc(name,args){
        record(name,args);
        if(name==='app_profile_login'){
          if(scenario.mode==='fallback')return{data:null,error:{message:'Could not find the function app_profile_login in the schema cache'}};
          if(scenario.mode==='wrong')return ok({ok:false,error:'Sign-in details did not match.'});
          return ok(loginData());
        }
        if(name==='picks_member_login_pin')return ok(loginData());
        if(name==='app_profile_resolve')return ok({ok:true,group,member,member_token:args?.p_member_token||'owner-token',active_room:activeRoom,rooms});
        if(name==='play_identity_snapshot')return ok({ok:true,group,member,member_token:args?.p_member_token||'owner-token',active_room:activeRoom,rooms});
        if(name==='picks_group_for_room')return ok({group_code:'GOAT26'});
        if(name==='picks_group_snapshot')return ok({group,season:{name:'2026 Season',correct_points:4,underdog_bonus:1},me:member,members:[member],events:activeRoom?[{event_id:'event-1',room_code:'ROOM01',status:'active',is_active:true,name:'Test Event'}]:[],available_events:[],active_room:activeRoom});
        if(name==='picks_room_snapshot')return ok({room:activeRoom,members:[member],me:member});
        if(name==='picks_public_events')return ok([{id:'event-1',name:'Test Event',status:'upcoming',eventDate:'2026-07-25T00:00:00Z',fights:[]}]);
        if(name==='picks_group_public')return ok(group);
        if(name==='picks_social_snapshot')return ok({group:{me:member,members:[member]}});
        if(name==='app_profile_group_snapshot')return ok({ok:true,group,me:member,members:[member]});
        if(name==='app_profile_community_snapshot')return ok({ok:true,group,me_id:'m1',members:[member]});
        if(name==='app_notification_settings')return ok({ok:true,preferences:{direct_challenges:false,picks_reminders:false,war_room_messages:false},vapid_public_key:'',push_enabled:false});
        if(name==='picks_member_pin_status')return ok({has_pin:true});
        return ok({ok:true});
      },
      from(){const chain={select(){return chain;},eq(){return chain;},order(){return Promise.resolve({data:[],error:null});},limit(){return Promise.resolve({data:[],error:null});},insert(){return Promise.resolve({data:[],error:null});},update(){return chain;},delete(){return chain;},single(){return Promise.resolve({data:null,error:null});}};return chain;},
      channel(){return{on(){return this;},subscribe(){return this;}};},
      removeChannel(){return Promise.resolve();}
    };
    window.supabase={createClient(){return client;}};
  })();`;
}

async function openCase(scenario={}){
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.addInitScript(value=>{
    window.__PROFILE_OWNER_SCENARIO__=value;
    const read=(key,fallback)=>{try{return JSON.parse(sessionStorage.getItem(key)||JSON.stringify(fallback));}catch(_error){return fallback;}};
    window.__PROFILE_RPC_LOG__=read('__profile_rpc_log',[]);
    window.__PROFILE_STORAGE_WRITES__=read('__profile_storage_writes',[]);
    window.__PROFILE_READY_EVENTS__=Number(sessionStorage.getItem('__profile_ready_events')||0);
    window.__recordProfileRpc=(name,args)=>{
      window.__PROFILE_RPC_LOG__.push({name,args});
      sessionStorage.setItem('__profile_rpc_log',JSON.stringify(window.__PROFILE_RPC_LOG__));
    };
    const originalSet=Storage.prototype.setItem;
    Storage.prototype.setItem=function(key,val){
      if(this===window.localStorage&&!String(key).startsWith('__profile_')){
        window.__PROFILE_STORAGE_WRITES__.push({key:String(key),value:String(val)});
        sessionStorage.setItem('__profile_storage_writes',JSON.stringify(window.__PROFILE_STORAGE_WRITES__));
      }
      return originalSet.call(this,key,val);
    };
    window.addEventListener('ufc-play-profile-ready',()=>{
      window.__PROFILE_READY_EVENTS__+=1;
      sessionStorage.setItem('__profile_ready_events',String(window.__PROFILE_READY_EVENTS__));
    });
  },scenario);
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',route=>route.fulfill({status:200,contentType:'application/javascript',body:supabaseStub()}));
  await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_APP_SHELL&&window.UFC_PLAY_PROFILE&&window.UFCPicksPinAuth,null,{timeout:60000});
  return {context,page};
}

async function openPicksCard(page){
  await page.evaluate(()=>window.UFC_APP_SHELL.activateDestination('picks'));
  await page.waitForSelector('#picksPinSignInCard',{state:'visible',timeout:30000});
  await page.evaluate(()=>{
    const input=document.getElementById('picksPinGroupCode');
    if(!input)return;
    input.removeAttribute('readonly');
    input.removeAttribute('aria-readonly');
    input.value='GOAT26';
    input.dispatchEvent(new Event('input',{bubbles:true}));
  });
  await page.fill('#picksPinDisplayName','Cody');
  await page.fill('#picksPinValue','1234');
}

const rpcNames=page=>page.evaluate(()=>window.__PROFILE_RPC_LOG__.map(row=>row.name));
const credentialRpcNames=async page=>(await rpcNames(page)).filter(name=>CREDENTIAL_RPCS.has(name));

try{
  browser=await chromium.launch({headless:true});

  console.log('Case 1: normal canonical login');
  {
    const {context,page}=await openCase({mode:'current'});
    const result=await page.evaluate(()=>window.UFC_PLAY_PROFILE.login('GOAT26','Cody','1234'));
    assert.equal(result.group.code,'GOAT26');
    assert.equal(result.active_room.code,'ROOM01');
    assert.equal(result.memberToken,'owner-token');
    assert.deepEqual(await credentialRpcNames(page),['app_profile_login','app_profile_resolve']);
    assert.equal(await page.evaluate(()=>window.__PROFILE_READY_EVENTS__),1,'Normal shared profile login must still publish readiness once.');
    await context.close();
  }

  console.log('Case 2: reload-bound readiness suppression');
  {
    const {context,page}=await openCase({mode:'current'});
    const result=await page.evaluate(()=>window.UFC_PLAY_PROFILE.login('GOAT26','Cody','1234',{publish:false,source:'proof'}));
    assert.equal(result.active_room.code,'ROOM01');
    assert.equal(await page.evaluate(()=>window.__PROFILE_READY_EVENTS__),0,'Suppressed reload-bound login must not publish readiness before navigation.');
    await context.close();
  }

  console.log('Case 3: Picks active-room continuation');
  {
    const {context,page}=await openCase({mode:'current'});
    await openPicksCard(page);
    await Promise.all([
      page.waitForURL(url=>url.searchParams.get('group')==='GOAT26'&&url.searchParams.get('room')==='ROOM01'&&url.searchParams.get('event')==='event-1'&&url.searchParams.get('picksView')==='event'&&url.hash==='#picks',{timeout:30000}),
      page.click('#picksPinSignInButton')
    ]);
    const names=await rpcNames(page);
    assert.equal(names.filter(name=>name==='app_profile_login').length,1);
    assert.equal(names.filter(name=>name==='picks_member_login_pin').length,0);
    const writes=await page.evaluate(()=>window.__PROFILE_STORAGE_WRITES__);
    for(const key of ['ufc-picks:group:GOAT26','ufc-picks:group-admin:GOAT26','ufc-player:group-code','ufc-picks:display-name','ufc-picks:room:ROOM01','ufc-picks:admin:ROOM01','ufc-picks:last-room']){
      assert(writes.some(row=>row.key===key),`Missing preserved storage write: ${key}`);
    }
    assert.equal(await page.evaluate(()=>Number(sessionStorage.getItem('__profile_ready_events')||0)),1,'Picks continuation must publish only the expected post-navigation identity resolution event.');
    await context.close();
  }

  console.log('Case 4: legacy login fallback');
  {
    const {context,page}=await openCase({mode:'fallback'});
    await openPicksCard(page);
    await Promise.all([
      page.waitForURL(url=>url.searchParams.get('room')==='ROOM01'&&url.hash==='#picks',{timeout:30000}),
      page.click('#picksPinSignInButton')
    ]);
    const names=await rpcNames(page);
    assert.equal(names.filter(name=>name==='app_profile_login').length,1);
    assert.equal(names.filter(name=>name==='picks_member_login_pin').length,1,'Legacy credential fallback must remain inside the canonical owner.');
    await context.close();
  }

  console.log('Case 5: wrong PIN');
  {
    const {context,page}=await openCase({mode:'wrong'});
    await openPicksCard(page);
    await page.click('#picksPinSignInButton');
    await page.waitForFunction(()=>/did not match/i.test(document.getElementById('picksPinSignInStatus')?.textContent||''));
    assert.equal(new URL(page.url()).hash,'#picks');
    assert.equal(await page.isEnabled('#picksPinSignInButton'),true);
    const names=await rpcNames(page);
    assert.equal(names.filter(name=>name==='app_profile_login').length,1);
    assert.equal(names.filter(name=>name==='picks_member_login_pin').length,0);
    const writes=await page.evaluate(()=>window.__PROFILE_STORAGE_WRITES__);
    assert.equal(writes.some(row=>row.key==='ufc-picks:group:GOAT26'),false,'Wrong PIN must not persist access.');
    await context.close();
  }

  console.log('Case 6: delayed canonical owner retry');
  {
    const {context,page}=await openCase({mode:'current'});
    await openPicksCard(page);
    await page.evaluate(()=>{window.__savedProfileOwner=window.UFC_PLAY_PROFILE;window.UFC_PLAY_PROFILE=null;});
    await page.click('#picksPinSignInButton');
    await page.waitForFunction(()=>/still loading/i.test(document.getElementById('picksPinSignInStatus')?.textContent||''));
    assert.deepEqual(await credentialRpcNames(page),[],'A delayed canonical owner must not trigger a direct credential fallback.');
    await page.evaluate(()=>{
      window.UFC_PLAY_PROFILE=window.__savedProfileOwner;
      window.__PROFILE_RETRY_BUTTON__=document.getElementById('picksPinSignInButton');
      window.__PROFILE_RETRY_TARGET_CLICKS__=0;
      window.__PROFILE_RETRY_BUTTON__?.addEventListener('click',()=>{window.__PROFILE_RETRY_TARGET_CLICKS__+=1;});
    });
    const retryNavigation=page.waitForURL(url=>url.searchParams.get('room')==='ROOM01'&&url.hash==='#picks',{timeout:30000}).catch(async error=>{
      const diagnostic=await page.evaluate(()=>({
        url:location.href,
        owner:Boolean(window.UFC_PLAY_PROFILE?.login),
        sameButton:window.__PROFILE_RETRY_BUTTON__===document.getElementById('picksPinSignInButton'),
        targetClicks:window.__PROFILE_RETRY_TARGET_CLICKS__,
        buttonDisabled:document.getElementById('picksPinSignInButton')?.disabled,
        status:document.getElementById('picksPinSignInStatus')?.textContent||'',
        cardCount:document.querySelectorAll('#picksPinSignInCard').length,
        rpcNames:window.__PROFILE_RPC_LOG__.map(row=>row.name),
        storageWrites:window.__PROFILE_STORAGE_WRITES__.map(row=>row.key)
      }));
      console.log(`Case 6 diagnostic: ${JSON.stringify(diagnostic)}`);
      throw error;
    });
    await Promise.all([retryNavigation,page.click('#picksPinSignInButton')]);
    assert.equal((await rpcNames(page)).filter(name=>name==='app_profile_login').length,1,'Retry after owner recovery must perform one canonical login.');
    await context.close();
  }

  console.log('Case 7: no active room');
  {
    const {context,page}=await openCase({mode:'current',noRoom:true});
    await openPicksCard(page);
    await Promise.all([
      page.waitForURL(url=>url.searchParams.get('group')==='GOAT26'&&url.searchParams.get('picksView')==='home'&&!url.searchParams.has('room')&&!url.searchParams.has('event')&&url.hash==='#picks',{timeout:30000}),
      page.click('#picksPinSignInButton')
    ]);
    assert.equal((await rpcNames(page)).filter(name=>name==='app_profile_login').length,1);
    await context.close();
  }

  console.log('Canonical profile login delegation proof passed.');
}finally{
  if(browser)await browser.close();
}

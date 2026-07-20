import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const ORIGIN='http://127.0.0.1:4173';
const REPORT='/tmp/profile-challenge-identity-owner-report.json';
const report={passed:false,stage:'boot',startup:null,concurrent:null,directSend:null,error:null};
let browser;

const html=`<!doctype html>
<html><head><meta charset="utf-8"><title>Profile challenge identity owner</title></head>
<body>
  <button class="app-profile-chip"><span class="app-profile-chip-badge">GOAT26</span></button>
  <section class="profile-activity-body"><div class="profile-activity-grid"></div></section>
  <script>
  (function(){
    const identity={ok:true,group:{code:'GOAT26'},groupCode:'GOAT26',member:{id:'m1',display_name:'Cody',is_admin:true},memberToken:'challenge-token',member_token:'challenge-token',rooms:[]};
    const counters=window.__PROFILE_CHALLENGE_PROOF__={canonicalResolves:0,canonicalRequires:0,editorResolves:0,readyEvents:0,updatedEvents:0,inboxCalls:0,groupSnapshots:0};
    const client={async rpc(name,args){
      if(name==='play_profile_challenge_inbox'){
        counters.inboxCalls+=1;
        await new Promise(resolve=>setTimeout(resolve,200));
        return{data:{ok:true,unread_count:1,rows:[{code:'ABC123',creator_name:'Shane',creator_fighter_avatar_slug:'',creator_profile_photo_data:'',created_at:new Date().toISOString(),opened_at:null,completed:false,score:null}]},error:null};
      }
      return{data:{ok:true},error:null};
    }};
    window.UFC_PLAY_PROFILE={
      identity:null,
      client,
      async resolve(){counters.canonicalResolves+=1;throw new Error('Passive challenge loading must not initiate canonical resolution.');},
      async require(){counters.canonicalRequires+=1;this.identity=identity;return identity;}
    };
    window.UFC_APP_PROFILE={
      identity:null,
      group:null,
      async resolve(){counters.editorResolves+=1;throw new Error('Editor resolver must not be called passively.');},
      async groupSnapshot(){
        counters.groupSnapshots+=1;
        return{ok:true,me:{...identity.member},members:[{...identity.member},{id:'m2',display_name:'Ashley',is_admin:false}]};
      },
      avatarMarkup(member){return '<span class="app-profile-avatar friend"><span>'+String(member?.display_name||'U').slice(0,2)+'</span></span>';}
    };
    window.addEventListener('ufc-play-profile-ready',()=>{counters.readyEvents+=1;});
    window.addEventListener('ufc-profile-challenges-updated',()=>{counters.updatedEvents+=1;});
    window.UFC_PROFILE_ACTIVITY={close(){}};
    setTimeout(()=>{
      window.UFC_PLAY_PROFILE.identity=identity;
      window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:identity}));
    },100);
  })();
  </script>
  <script src="/assets/js/profile-challenges.js"></script>
</body></html>`;

try{
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const page=await context.newPage();
  const url=`${ORIGIN}/profile-challenge-identity-owner.html`;
  await page.route(url,route=>route.fulfill({status:200,contentType:'text/html',body:html}));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});

  report.stage='startup';
  await page.waitForFunction(()=>window.UFC_PROFILE_CHALLENGES?.unreadCount===1&&window.__PROFILE_CHALLENGE_PROOF__?.inboxCalls===1,null,{timeout:30000});
  await page.waitForTimeout(120);
  report.startup=await page.evaluate(()=>({
    ...window.__PROFILE_CHALLENGE_PROOF__,
    unread:window.UFC_PROFILE_CHALLENGES.unreadCount,
    inboxCards:document.querySelectorAll('[data-profile-challenge-inbox]').length,
    badge:document.querySelector('.app-profile-chip-badge')?.textContent||''
  }));
  assert.equal(report.startup.canonicalResolves,0,'Passive startup must not initiate canonical identity resolution.');
  assert.equal(report.startup.canonicalRequires,0,'Passive startup must not open canonical sign-in.');
  assert.equal(report.startup.editorResolves,0,'Passive startup must never invoke the visible profile editor resolver.');
  assert.equal(report.startup.readyEvents,1,'The canonical owner must be able to publish readiness once.');
  assert.equal(report.startup.inboxCalls,1,'Ready-event and scheduled startup loads must coalesce into one inbox RPC.');
  assert.equal(report.startup.updatedEvents,1,'One startup inbox RPC must publish one inbox update.');
  assert.equal(report.startup.inboxCards,1,'The Activity Profile must retain one challenge inbox card.');
  assert.match(report.startup.badge,/1 NEW/,'The profile chip must retain the unread challenge badge.');

  report.stage='concurrent';
  await page.evaluate(()=>{window.__PROFILE_CHALLENGE_PROOF__.inboxCalls=0;window.__PROFILE_CHALLENGE_PROOF__.updatedEvents=0;});
  await page.evaluate(()=>Promise.all([
    window.UFC_PROFILE_CHALLENGES.loadInbox(),
    window.UFC_PROFILE_CHALLENGES.loadInbox(),
    window.UFC_PROFILE_CHALLENGES.loadInbox()
  ]));
  report.concurrent=await page.evaluate(()=>({
    inboxCalls:window.__PROFILE_CHALLENGE_PROOF__.inboxCalls,
    updatedEvents:window.__PROFILE_CHALLENGE_PROOF__.updatedEvents,
    unread:window.UFC_PROFILE_CHALLENGES.unreadCount
  }));
  assert.equal(report.concurrent.inboxCalls,1,'Concurrent manual inbox refreshes must share one RPC.');
  assert.equal(report.concurrent.updatedEvents,1,'Concurrent refreshes must publish one update.');
  assert.equal(report.concurrent.unread,1,'Concurrent refreshes must preserve inbox state.');

  report.stage='direct-send';
  const payload={setup:{question:'Who leads?',candidates:Array.from({length:10},(_,index)=>({id:`f${index+1}`}))},result:{score:7}};
  const opened=await page.evaluate(payload=>window.UFC_PROFILE_CHALLENGES.openSendModal(payload),payload);
  report.directSend=await page.evaluate(()=>({
    opened:Boolean(document.querySelector('.profile-challenge-overlay')),
    groupSnapshots:window.__PROFILE_CHALLENGE_PROOF__.groupSnapshots,
    canonicalResolves:window.__PROFILE_CHALLENGE_PROOF__.canonicalResolves,
    canonicalRequires:window.__PROFILE_CHALLENGE_PROOF__.canonicalRequires,
    editorResolves:window.__PROFILE_CHALLENGE_PROOF__.editorResolves,
    members:document.querySelectorAll('[data-challenge-member]').length
  }));
  assert.equal(opened,true,'Direct challenge modal must still open.');
  assert.equal(report.directSend.groupSnapshots,1,'Direct challenge sending must request the member-list snapshot once.');
  assert.equal(report.directSend.canonicalResolves,0,'Direct send must reuse the supplied canonical identity without resolving again.');
  assert.equal(report.directSend.canonicalRequires,0,'Direct send must not request sign-in when identity already exists.');
  assert.equal(report.directSend.editorResolves,0,'Direct send must not invoke the editor identity resolver.');
  assert.equal(report.directSend.members,1,'Direct send must retain the other-profile recipient choice.');

  report.passed=true;
  report.stage='complete';
  console.log('Profile challenge passive identity proof passed.');
  await context.close();
}catch(error){
  report.error={message:error?.message||String(error),stack:error?.stack||null};
  throw error;
}finally{
  fs.writeFileSync(REPORT,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}

import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const ORIGIN='http://127.0.0.1:4173';
const REPORT='/tmp/app-profile-group-snapshot-single-report.json';
const report={passed:false,stage:'boot',startup:null,externalReady:null,modalSignIn:null,error:null};
let browser;

function html(mode){
  const requireMode=mode==='require';
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>App profile group snapshot ${mode}</title></head>
<body>
  <section class="hero"><article class="hero-card">Hero</article></section>
  <script>
  (function(){
    const makeIdentity=(token='profile-snapshot-token',name='Cody')=>({
      ok:true,
      memberToken:token,
      member_token:token,
      group:{code:'GOAT26'},
      member:{id:'m1',display_name:name,is_admin:true,fighter_avatar_slug:''},
      rooms:[]
    });
    const state=window.__APP_PROFILE_SNAPSHOT__={mode:${JSON.stringify(mode)},resolves:0,requires:0,readyEvents:0,groupSnapshots:[],identity:makeIdentity()};
    const client={async rpc(name,args){
      if(name==='app_profile_group_snapshot'){
        state.groupSnapshots.push(args?.p_member_token||'');
        const identity=window.UFC_PLAY_PROFILE.identity||state.identity;
        return{data:{ok:true,group:{code:'GOAT26'},me:{...identity.member},members:[{...identity.member}]},error:null};
      }
      if(name==='app_profile_set_avatar'||name==='app_profile_set_photo')return{data:{ok:true,member:{...state.identity.member}},error:null};
      return{data:{ok:true},error:null};
    }};
    window.UFC_PLAY_PROFILE={
      identity:null,
      client,
      async resolve(){
        state.resolves+=1;
        if(${requireMode?'true':'false'})return null;
        this.identity=state.identity;
        window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:this.identity}));
        return this.identity;
      },
      async require(){
        state.requires+=1;
        this.identity=state.identity;
        window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:this.identity}));
        return this.identity;
      }
    };
    window.addEventListener('ufc-play-profile-ready',()=>{state.readyEvents+=1;});
    window.UFC_PLAY_DATA={search(){return[];},resolve(){return null;},byId:{}};
    window.RANKING_DATA={men:[],women:[]};
    window.DISPLAY_OVERRIDES={};
  })();
  </script>
  <script src="/assets/js/app-profile.js"></script>
</body></html>`;
}

async function openScenario(mode){
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const page=await context.newPage();
  const url=`${ORIGIN}/app-profile-group-snapshot-${mode}.html`;
  await page.route(url,route=>route.fulfill({status:200,contentType:'text/html',body:html(mode)}));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_APP_PROFILE&&document.querySelector('.app-profile-chip'),null,{timeout:30000});
  return{context,page};
}

try{
  browser=await chromium.launch({headless:true});

  report.stage='startup';
  {
    const {context,page}=await openScenario('startup');
    await page.waitForFunction(()=>window.UFC_APP_PROFILE.group&&window.__APP_PROFILE_SNAPSHOT__.groupSnapshots.length===1,null,{timeout:30000});
    report.startup=await page.evaluate(()=>({
      resolves:window.__APP_PROFILE_SNAPSHOT__.resolves,
      readyEvents:window.__APP_PROFILE_SNAPSHOT__.readyEvents,
      groupSnapshots:[...window.__APP_PROFILE_SNAPSHOT__.groupSnapshots],
      chip:document.querySelector('.app-profile-chip')?.textContent||''
    }));
    assert.equal(report.startup.resolves,1,'App-profile startup must request canonical identity once.');
    assert.equal(report.startup.readyEvents,1,'Canonical startup resolution must publish readiness once.');
    assert.deepEqual(report.startup.groupSnapshots,['profile-snapshot-token'],'Canonical startup must produce one full group snapshot.');
    assert.match(report.startup.chip,/Cody/,'The profile chip must remain populated after startup.');

    report.stage='external-ready';
    await page.evaluate(()=>{
      const state=window.__APP_PROFILE_SNAPSHOT__;
      state.groupSnapshots=[];
      const updated={...state.identity,memberToken:'external-ready-token',member_token:'external-ready-token',member:{...state.identity.member,display_name:'Cody Updated'}};
      state.identity=updated;
      window.UFC_PLAY_PROFILE.identity=updated;
      window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:updated}));
    });
    await page.waitForFunction(()=>/Cody Updated/.test(document.querySelector('.app-profile-chip')?.textContent||''),null,{timeout:10000});
    const immediate=await page.evaluate(()=>({
      groupSnapshots:[...window.__APP_PROFILE_SNAPSHOT__.groupSnapshots],
      group:window.UFC_APP_PROFILE.group,
      chip:document.querySelector('.app-profile-chip')?.textContent||''
    }));
    assert.deepEqual(immediate.groupSnapshots,[],'An external ready event must not independently fetch the full group.');
    assert.equal(immediate.group,null,'A new canonical identity must invalidate stale group state.');
    await page.evaluate(()=>window.UFC_APP_PROFILE.resolve());
    await page.waitForFunction(()=>window.__APP_PROFILE_SNAPSHOT__.groupSnapshots.length===1,null,{timeout:10000});
    report.externalReady=await page.evaluate(()=>({
      groupSnapshots:[...window.__APP_PROFILE_SNAPSHOT__.groupSnapshots],
      groupLoaded:Boolean(window.UFC_APP_PROFILE.group),
      chip:document.querySelector('.app-profile-chip')?.textContent||''
    }));
    assert.deepEqual(report.externalReady.groupSnapshots,['external-ready-token'],'The next editor resolve must hydrate the new identity exactly once.');
    assert.equal(report.externalReady.groupLoaded,true);
    assert.match(report.externalReady.chip,/Cody Updated/);
    await context.close();
  }

  report.stage='modal-sign-in';
  {
    const {context,page}=await openScenario('require');
    await page.waitForFunction(()=>window.__APP_PROFILE_SNAPSHOT__.resolves>=1,null,{timeout:10000});
    await page.evaluate(()=>window.UFC_APP_PROFILE.open());
    await page.waitForSelector('.app-profile-overlay',{state:'attached',timeout:30000});
    report.modalSignIn=await page.evaluate(()=>({
      resolves:window.__APP_PROFILE_SNAPSHOT__.resolves,
      requires:window.__APP_PROFILE_SNAPSHOT__.requires,
      readyEvents:window.__APP_PROFILE_SNAPSHOT__.readyEvents,
      groupSnapshots:[...window.__APP_PROFILE_SNAPSHOT__.groupSnapshots],
      overlays:document.querySelectorAll('.app-profile-overlay').length,
      title:document.querySelector('#appProfileTitle')?.textContent||''
    }));
    assert.equal(report.modalSignIn.requires,1,'Profile modal must use the canonical require flow once.');
    assert.equal(report.modalSignIn.readyEvents,1,'Modal sign-in must publish one canonical ready event.');
    assert.deepEqual(report.modalSignIn.groupSnapshots,['profile-snapshot-token'],'Modal sign-in must produce one full group snapshot.');
    assert.equal(report.modalSignIn.overlays,1,'Profile modal behavior must remain intact.');
    assert.equal(report.modalSignIn.title,'Cody');
    await context.close();
  }

  report.passed=true;
  report.stage='complete';
  console.log('App profile single group snapshot proof passed.');
}catch(error){
  report.error={message:error?.message||String(error),stack:error?.stack||null};
  throw error;
}finally{
  fs.writeFileSync(REPORT,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}

import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const ORIGIN='http://127.0.0.1:4173';
const BASE=`${ORIGIN}/picks-season-identity-owner-proof.html`;
const REPORT='/tmp/picks-season-identity-owner-report.json';
const report={passed:false,stage:'static-contract',uncached:null,readiness:null,concurrent:null,reminder:null,error:null};
let browser;

const source=fs.readFileSync('assets/js/picks-season-loop.js','utf8');
assert.match(source,/function passiveIdentity\(\)[\s\S]*UFC_PLAY_PROFILE\?\.identity[\s\S]*UFC_APP_PROFILE\?\.identity/,'Picks season must consume published identity caches.');
assert.doesNotMatch(source,/UFC_PLAY_PROFILE\?\.(?:resolve|require|resolveIdentity)\?\.\(/,'Picks season must not invoke the canonical identity owner during passive work.');
assert.doesNotMatch(source,/UFC_APP_PROFILE\?\.resolve\?\.\(/,'Picks season must not invoke the profile editor resolver.');
assert.doesNotMatch(source,/GROUP_TOKEN_KEY|GROUP_ADMIN_KEY|localStorage\.getItem\(/,'Picks season must not own or read canonical access storage.');

const identity={
  ok:true,
  group:{code:'GOAT26'},
  groupCode:'GOAT26',
  member:{id:'m1',display_name:'Cody',is_admin:true},
  memberToken:'picks-season-owner-token',
  member_token:'picks-season-owner-token',
  adminToken:'picks-season-admin-token',
  admin_token:'picks-season-admin-token'
};

const html=`<!doctype html><html><head><meta charset="utf-8"><title>Picks season identity ownership</title></head><body>
  <section id="picks" class="active-view">
    <div id="picksHomeContent"></div>
    <div id="picksEventContent"></div>
    <div id="picksStandings"></div>
    <div id="picksEventRecap" hidden></div>
  </section>
  <div id="picksToast"></div>
  <script>
    window.__PICKS_SEASON_IDENTITY__=${JSON.stringify(identity)};
    window.__PICKS_SEASON_PROOF__={canonicalResolves:0,canonicalRequires:0,editorResolves:0,rpcs:[]};
    const proof=window.__PICKS_SEASON_PROOF__;
    const identity=window.__PICKS_SEASON_IDENTITY__;
    const me={id:'m1',display_name:'Cody',is_admin:true,picks_made:12,correct:8,points:32,event_wins:1,accuracy:67};
    const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
    const client={async rpc(name,args){
      proof.rpcs.push({name,args});
      if(name==='picks_group_snapshot'){
        await sleep(180);
        return{data:{group:{code:'GOAT26'},me,members:[me],events:[],season:{name:'2026 Season',correct_points:4}},error:null};
      }
      if(name==='picks_public_events'){
        await sleep(180);
        return{data:[],error:null};
      }
      if(name==='picks_social_snapshot'){
        await sleep(180);
        return{data:{group:{code:'GOAT26'},me:{...me,reminder_opt_in:false,avatar_key:'gloves'},members:[me],upcoming_event:null},error:null};
      }
      if(name==='picks_social_update_profile')return{data:{ok:true},error:null};
      return{data:{ok:true},error:null};
    }};
    window.UFC_SUPABASE_CONFIG={url:'https://proof.invalid',anonKey:'proof'};
    window.supabase={createClient(){return client;}};
    window.UFC_PLAY_PROFILE={identity:null,client,async resolve(){proof.canonicalResolves+=1;this.identity=identity;return identity;},async require(){proof.canonicalRequires+=1;this.identity=identity;return identity;}};
    window.UFC_APP_PROFILE={identity:null,async resolve(){proof.editorResolves+=1;throw new Error('Picks season invoked the editor resolver.');}};
  </script>
  <script src="/assets/js/picks-season-loop.js"></script>
</body></html>`;

async function snapshot(page){
  return page.evaluate(()=>({
    ...window.__PICKS_SEASON_PROOF__,
    storageReads:window.__PICKS_SEASON_STORAGE_READS__,
    summaries:document.querySelectorAll('#picksSeasonSummary').length,
    summaryText:document.getElementById('picksSeasonSummary')?.textContent||'',
    signInSurfaces:document.querySelectorAll('[role="dialog"],.app-profile-overlay,.play-profile-modal,.picks-pin-signin').length
  }));
}

try{
  report.stage='browser-launch';
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const page=await context.newPage();

  await page.addInitScript(()=>{
    const originalGet=Storage.prototype.getItem;
    localStorage.setItem('ufc-picks:group:GOAT26','stale-member-token');
    localStorage.setItem('ufc-picks:group-admin:GOAT26','stale-admin-token');
    window.__PICKS_SEASON_STORAGE_READS__=[];
    Storage.prototype.getItem=function(key){
      const value=String(key);
      if(this===window.localStorage&&/^ufc-picks:group(?:-admin)?:GOAT26$/.test(value))window.__PICKS_SEASON_STORAGE_READS__.push({key:value,stack:String(new Error().stack||'')});
      return originalGet.call(this,key);
    };
  });

  await page.route(BASE,route=>route.fulfill({status:200,contentType:'text/html',body:html}));
  await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_PICKS_SEASON_LOOP&&window.__PICKS_SEASON_PROOF__,null,{timeout:10000});
  await page.waitForTimeout(350);

  report.stage='uncached-startup';
  report.uncached=await snapshot(page);
  assert.equal(report.uncached.canonicalResolves,0,'Uncached passive Picks season startup must not invoke the canonical resolver.');
  assert.equal(report.uncached.canonicalRequires,0,'Uncached passive Picks season startup must not require sign-in.');
  assert.equal(report.uncached.editorResolves,0,'Uncached passive Picks season startup must not invoke the editor resolver.');
  assert.equal(report.uncached.rpcs.length,0,'Uncached Picks entry must wait for published identity before any season RPC.');
  assert.equal(report.uncached.storageReads.some(row=>/picks-season-loop\.js/i.test(row.stack)),false,'Picks season must not read canonical member or admin access from storage.');
  assert.equal(report.uncached.summaries,0,'Uncached startup must not render a false season summary.');
  assert.equal(report.uncached.signInSurfaces,0,'Passive Picks season startup must not create a sign-in surface.');

  report.stage='canonical-readiness';
  await page.evaluate(()=>{
    window.UFC_PLAY_PROFILE.identity=window.__PICKS_SEASON_IDENTITY__;
    window.UFC_APP_PROFILE.identity=window.__PICKS_SEASON_IDENTITY__;
    window.__PICKS_SEASON_PROOF__.rpcs=[];
    window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:window.__PICKS_SEASON_IDENTITY__}));
  });
  await page.waitForFunction(()=>document.getElementById('picksSeasonSummary'),null,{timeout:10000});
  await page.waitForTimeout(80);
  report.readiness=await snapshot(page);
  assert.equal(report.readiness.canonicalResolves,0,'Readiness-driven season loading must not re-enter the canonical resolver.');
  assert.equal(report.readiness.canonicalRequires,0);
  assert.equal(report.readiness.editorResolves,0);
  assert.equal(report.readiness.rpcs.filter(row=>row.name==='picks_group_snapshot').length,1,'One readiness event must load one group snapshot.');
  assert.equal(report.readiness.rpcs.filter(row=>row.name==='picks_public_events').length,1,'One readiness event must load public events once.');
  assert.equal(report.readiness.rpcs.filter(row=>row.name==='picks_social_snapshot').length,1,'One readiness event must load one social snapshot.');
  const groupRpc=report.readiness.rpcs.find(row=>row.name==='picks_group_snapshot');
  assert.equal(groupRpc?.args?.p_member_token,'picks-season-owner-token','Season group loading must use the published member token.');
  assert.equal(groupRpc?.args?.p_admin_token,'picks-season-admin-token','Season group loading must use the published admin token.');
  assert.equal(report.readiness.storageReads.some(row=>/picks-season-loop\.js/i.test(row.stack)),false);
  assert.equal(report.readiness.summaries,1,'Picks season must retain one summary renderer.');
  assert.match(report.readiness.summaryText,/YOUR SEASON|Your season/i);

  report.stage='concurrent-refresh';
  await page.evaluate(()=>{
    window.__PICKS_SEASON_PROOF__.rpcs=[];
    void window.UFC_PICKS_SEASON_LOOP.refresh();
    void window.UFC_PICKS_SEASON_LOOP.refresh();
    void window.UFC_PICKS_SEASON_LOOP.refresh();
  });
  await page.waitForFunction(()=>window.__PICKS_SEASON_PROOF__.rpcs.some(row=>row.name==='picks_group_snapshot'),null,{timeout:10000});
  await page.waitForTimeout(260);
  report.concurrent=await snapshot(page);
  assert.equal(report.concurrent.rpcs.filter(row=>row.name==='picks_group_snapshot').length,1,'Competing season refreshes must share the in-flight load.');
  assert.equal(report.concurrent.rpcs.filter(row=>row.name==='picks_public_events').length,1);
  assert.equal(report.concurrent.rpcs.filter(row=>row.name==='picks_social_snapshot').length,1);
  assert.equal(report.concurrent.canonicalResolves,0);
  assert.equal(report.concurrent.editorResolves,0);
  assert.equal(report.concurrent.summaries,1);

  report.stage='explicit-reminder';
  await page.evaluate(()=>{
    window.__PICKS_SEASON_PROOF__.rpcs=[];
    const input=document.createElement('input');
    input.type='checkbox';
    input.dataset.picksSeasonReminder='true';
    input.checked=false;
    document.body.appendChild(input);
    input.dispatchEvent(new Event('change',{bubbles:true}));
  });
  await page.waitForFunction(()=>window.__PICKS_SEASON_PROOF__.rpcs.some(row=>row.name==='picks_social_update_profile'),null,{timeout:10000});
  report.reminder=await snapshot(page);
  const reminderRpc=report.reminder.rpcs.find(row=>row.name==='picks_social_update_profile');
  assert.equal(reminderRpc?.args?.p_member_token,'picks-season-owner-token','Explicit reminder updates must reuse the published member token.');
  assert.equal(report.reminder.canonicalResolves,0);
  assert.equal(report.reminder.canonicalRequires,0);
  assert.equal(report.reminder.editorResolves,0);
  assert.equal(report.reminder.storageReads.some(row=>/picks-season-loop\.js/i.test(row.stack)),false);

  report.passed=true;
  report.stage='complete';
  console.log('Picks season passive identity ownership proof passed.');
  await context.close();
}catch(error){
  report.error={message:error?.message||String(error),stack:error?.stack||null};
  throw error;
}finally{
  fs.writeFileSync(REPORT,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}

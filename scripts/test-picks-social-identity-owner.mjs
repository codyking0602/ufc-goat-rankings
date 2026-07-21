import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const ORIGIN='http://127.0.0.1:4173';
const BASE=`${ORIGIN}/picks-social-identity-owner-proof.html`;
const REPORT='/tmp/picks-social-identity-owner-report.json';
const report={passed:false,stage:'static-contract',uncached:null,readiness:null,concurrent:null,error:null};
let browser;

const source=fs.readFileSync('assets/js/picks-social-retention.js','utf8');
assert.match(source,/function passiveIdentity\(\)[\s\S]*UFC_PLAY_PROFILE\?\.identity[\s\S]*UFC_APP_PROFILE\?\.identity/,'Picks social must consume published identity caches.');
assert.doesNotMatch(source,/UFC_PLAY_PROFILE\?\.(?:resolve|require|resolveIdentity)\?\.\(/,'Picks social passive work must not invoke the canonical identity owner.');
assert.doesNotMatch(source,/UFC_APP_PROFILE\?\.resolve\?\.\(/,'Picks social must not invoke the profile editor resolver.');
assert.doesNotMatch(source,/GROUP_TOKEN_PREFIX|storedGroupCode|ufc-picks:group:/,'Picks social must not own or scan canonical group-token storage.');

const identity={ok:true,group:{code:'GOAT26'},groupCode:'GOAT26',member:{id:'m1',display_name:'Cody',is_admin:true},memberToken:'picks-social-owner-token',member_token:'picks-social-owner-token'};
const html=`<!doctype html><html><head><meta charset="utf-8"><title>Picks social identity ownership</title></head><body>
  <section id="picks" class="active-view"><div class="picks-shell"></div></section>
  <div id="picksToast"></div>
  <script>
    window.__PICKS_SOCIAL_IDENTITY__=${JSON.stringify(identity)};
    window.__PICKS_SOCIAL_PROOF__={canonicalResolves:0,canonicalRequires:0,editorResolves:0,rpcs:[]};
    const proof=window.__PICKS_SOCIAL_PROOF__;
    const identity=window.__PICKS_SOCIAL_IDENTITY__;
    const group={me:{id:'m1',display_name:'Cody',is_admin:true},members:[{id:'m1',display_name:'Cody',is_admin:true}]};
    const client={async rpc(name,args){proof.rpcs.push({name,args});if(name==='picks_social_snapshot'){await new Promise(resolve=>setTimeout(resolve,180));return{data:{group:{code:'GOAT26'},me:{id:'m1',display_name:'Cody',is_admin:true,reminder_opt_in:false,avatar_key:'gloves'},members:[{id:'m1',display_name:'Cody',is_admin:true}],upcoming_event:null},error:null};}return{data:{ok:true},error:null};}};
    window.UFC_SUPABASE_CONFIG={url:'https://proof.invalid',anonKey:'proof'};
    window.supabase={createClient(){return client;}};
    window.UFC_PLAY_PROFILE={identity:null,canonicalGroupCode:'GOAT26',async resolve(){proof.canonicalResolves+=1;this.identity=identity;return identity;},async require(){proof.canonicalRequires+=1;this.identity=identity;return identity;}};
    window.UFC_APP_PROFILE={identity:null,canonicalGroupCode:'GOAT26',group,avatarMarkup(member,className=''){return '<span class="app-profile-avatar '+className+'"><span>'+String(member?.display_name||'UFC').slice(0,2)+'</span></span>';},open(){},async resolve(){proof.editorResolves+=1;throw new Error('Picks social invoked the editor resolver.');}};
  </script>
  <script src="/assets/js/picks-social-retention.js"></script>
</body></html>`;

async function snapshot(page){
  return page.evaluate(()=>({
    ...window.__PICKS_SOCIAL_PROOF__,
    storageReads:window.__PICKS_SOCIAL_STORAGE_READS__,
    shells:document.querySelectorAll('#picksProfileShell').length,
    hidden:document.getElementById('picksProfileShell')?.hidden,
    text:document.getElementById('picksProfileShell')?.textContent||'',
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
    localStorage.setItem('ufc-picks:group:GOAT26','stale-storage-token');
    window.__PICKS_SOCIAL_STORAGE_READS__=[];
    Storage.prototype.getItem=function(key){
      const value=String(key);
      if(this===window.localStorage&&value==='ufc-picks:group:GOAT26')window.__PICKS_SOCIAL_STORAGE_READS__.push({key:value,stack:String(new Error().stack||'')});
      return originalGet.call(this,key);
    };
  });

  await page.route(BASE,route=>route.fulfill({status:200,contentType:'text/html',body:html}));
  await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_PICKS_SHARED_PROFILE&&document.getElementById('picksProfileShell'),null,{timeout:10000});
  await page.waitForTimeout(350);

  report.stage='uncached-startup';
  report.uncached=await snapshot(page);
  assert.equal(report.uncached.canonicalResolves,0,'Uncached passive Picks social startup must not invoke the canonical resolver.');
  assert.equal(report.uncached.canonicalRequires,0,'Uncached passive Picks social startup must not require sign-in.');
  assert.equal(report.uncached.editorResolves,0,'Uncached passive Picks social startup must not invoke the editor resolver.');
  assert.equal(report.uncached.rpcs.filter(row=>row.name==='picks_social_snapshot').length,0,'Uncached startup must wait for published identity before loading the social snapshot.');
  assert.equal(report.uncached.storageReads.some(row=>/picks-social-retention\.js/i.test(row.stack)),false,'Picks social must not read canonical access from storage.');
  assert.equal(report.uncached.shells,1,'Picks social must retain one profile shell.');
  assert.equal(report.uncached.hidden,true,'The admin profile shell must remain hidden without published identity.');
  assert.equal(report.uncached.signInSurfaces,0,'Passive startup must not create a sign-in surface.');

  report.stage='canonical-readiness';
  await page.evaluate(()=>{
    window.UFC_PLAY_PROFILE.identity=window.__PICKS_SOCIAL_IDENTITY__;
    window.UFC_APP_PROFILE.identity=window.__PICKS_SOCIAL_IDENTITY__;
    window.__PICKS_SOCIAL_PROOF__.rpcs=[];
    window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:window.__PICKS_SOCIAL_IDENTITY__}));
  });
  await page.waitForFunction(()=>window.__PICKS_SOCIAL_PROOF__.rpcs.some(row=>row.name==='picks_social_snapshot'&&row.args?.p_member_token==='picks-social-owner-token'),null,{timeout:10000});
  await page.waitForFunction(()=>document.getElementById('picksProfileShell')?.hidden===false,null,{timeout:10000});
  report.readiness=await snapshot(page);
  assert.equal(report.readiness.canonicalResolves,0,'Readiness-driven sync must not re-enter the canonical resolver.');
  assert.equal(report.readiness.canonicalRequires,0);
  assert.equal(report.readiness.editorResolves,0);
  assert.equal(report.readiness.rpcs.filter(row=>row.name==='picks_social_snapshot').length,1,'One readiness event must load one Picks social snapshot.');
  assert.equal(report.readiness.rpcs[0]?.args?.p_group_code,'GOAT26');
  assert.equal(report.readiness.storageReads.some(row=>/picks-social-retention\.js/i.test(row.stack)),false);
  assert.equal(report.readiness.shells,1);
  assert.match(report.readiness.text,/Profile & Reminders/);

  report.stage='concurrent-refresh';
  await page.evaluate(()=>{
    window.__PICKS_SOCIAL_PROOF__.rpcs=[];
    void window.UFC_PICKS_SHARED_PROFILE.refresh(true);
    void window.UFC_PICKS_SHARED_PROFILE.refresh(true);
    void window.UFC_PICKS_SHARED_PROFILE.refresh(true);
  });
  await page.waitForFunction(()=>window.__PICKS_SOCIAL_PROOF__.rpcs.some(row=>row.name==='picks_social_snapshot'),null,{timeout:10000});
  await page.waitForTimeout(260);
  report.concurrent=await snapshot(page);
  assert.equal(report.concurrent.rpcs.filter(row=>row.name==='picks_social_snapshot').length,1,'Competing passive refreshes must share the existing in-flight guard.');
  assert.equal(report.concurrent.canonicalResolves,0);
  assert.equal(report.concurrent.canonicalRequires,0);
  assert.equal(report.concurrent.editorResolves,0);
  assert.equal(report.concurrent.shells,1);

  report.passed=true;
  report.stage='complete';
  console.log('Picks social passive identity ownership proof passed.');
  await context.close();
}catch(error){
  report.error={message:error?.message||String(error),stack:error?.stack||null};
  throw error;
}finally{
  fs.writeFileSync(REPORT,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}

import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

await import('./test-picks-social-active-contract.mjs');

const ORIGIN='http://127.0.0.1:4173';
const BASE=`${ORIGIN}/picks-social-active-proof.html`;
const REPORT='/tmp/picks-social-active-owner-report.json';
const report={passed:false,stage:'static-contract',home:null,hiddenReadiness:null,routeEntry:null,activeMutation:null,activePoll:null,routeExit:null,directCached:null,directUncached:null,activeReadiness:null,lateBefore:null,lateAfter:null,explicitInactive:null,error:null};
let browser;

const identity={ok:true,group:{code:'GOAT26'},groupCode:'GOAT26',member:{id:'m1',display_name:'Cody',is_admin:true},memberToken:'picks-social-active-token',member_token:'picks-social-active-token'};
const snapshot={group:{code:'GOAT26'},me:{id:'m1',display_name:'Cody',is_admin:true,reminder_opt_in:false,avatar_key:'gloves'},members:[{id:'m1',display_name:'Cody',is_admin:true}],upcoming_event:null};

function fixture(mode){
  const active=['direct-cached','direct-uncached','late-shell'].includes(mode);
  const cached=['home','route-entry','direct-cached','late-shell'].includes(mode);
  const hasShell=mode!=='late-shell';
  return `<!doctype html><html><head><meta charset="utf-8"><title>Picks social activation</title></head><body>
    <section id="home" class="${active?'':'active-view'}"></section>
    <section id="picks" class="${active?'active-view':''}">${hasShell?'<div class="picks-shell"><div class="picks-group-member"><strong>Cody</strong></div></div>':''}</section>
    <div id="picksToast"></div>
    <script>
      window.__PICKS_SOCIAL_IDENTITY__=${JSON.stringify(identity)};
      window.__PICKS_SOCIAL_SNAPSHOT__=${JSON.stringify(snapshot)};
      window.__PICKS_SOCIAL_DESTINATION__=${JSON.stringify(active?'picks':'home')};
      window.__PICKS_SOCIAL_ACTIVE_PROOF__={rpcs:[],intervals:[],canonicalResolves:0,canonicalRequires:0,editorResolves:0};
      window.__PICKS_SOCIAL_INTERVAL_CALLBACKS__=[];
      const proof=window.__PICKS_SOCIAL_ACTIVE_PROOF__;
      const identity=window.__PICKS_SOCIAL_IDENTITY__;
      const group={me:{id:'m1',display_name:'Cody',is_admin:true},members:[{id:'m1',display_name:'Cody',is_admin:true}]};
      const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
      const client={async rpc(name,args){proof.rpcs.push({name,args});if(name==='picks_social_snapshot'){await sleep(50);return{data:structuredClone(window.__PICKS_SOCIAL_SNAPSHOT__),error:null};}return{data:{ok:true},error:null};}};
      window.UFC_SUPABASE_CONFIG={url:'https://proof.invalid',anonKey:'proof'};
      window.supabase={createClient(){return client;}};
      window.UFC_APP_SHELL={get currentDestination(){return window.__PICKS_SOCIAL_DESTINATION__;}};
      window.UFC_PLAY_PROFILE={identity:${cached?'identity':'null'},canonicalGroupCode:'GOAT26',async resolve(){proof.canonicalResolves+=1;return identity;},async require(){proof.canonicalRequires+=1;return identity;}};
      window.UFC_APP_PROFILE={identity:${cached?'identity':'null'},canonicalGroupCode:'GOAT26',group,avatarMarkup(member,className=''){return '<span class="app-profile-avatar '+className+'"><span>'+String(member?.display_name||'UFC').slice(0,2)+'</span></span>';},open(){},async resolve(){proof.editorResolves+=1;return identity;}};
      window.setInterval=(fn,delay,...args)=>{proof.intervals.push(Number(delay));window.__PICKS_SOCIAL_INTERVAL_CALLBACKS__.push({fn,delay:Number(delay),args});return proof.intervals.length;};
      window.clearInterval=()=>{};
    </script>
    <script src="/assets/js/picks-social-retention.js"></script>
  </body></html>`;
}

function url(mode){const value=new URL(BASE);value.searchParams.set('mode',mode);return value.toString();}

async function openPage(context,mode){
  const page=await context.newPage();
  await page.route('**/picks-social-active-proof.html*',route=>{
    const requested=new URL(route.request().url()).searchParams.get('mode')||mode;
    return route.fulfill({status:200,contentType:'text/html',body:fixture(requested)});
  });
  await page.goto(url(mode),{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_PICKS_SHARED_PROFILE&&window.__PICKS_SOCIAL_INTERVAL_CALLBACKS__,null,{timeout:10000});
  await page.waitForTimeout(180);
  return page;
}

async function state(page){return page.evaluate(()=>({
  rpcs:window.__PICKS_SOCIAL_ACTIVE_PROOF__.rpcs.map(row=>structuredClone(row)),
  intervals:[...window.__PICKS_SOCIAL_ACTIVE_PROOF__.intervals],
  destination:window.__PICKS_SOCIAL_DESTINATION__,
  active:document.getElementById('picks')?.classList.contains('active-view')||false,
  shells:document.querySelectorAll('#picksProfileShell').length,
  hidden:document.getElementById('picksProfileShell')?.hidden,
  text:document.getElementById('picksProfileShell')?.textContent||'',
  inlineAvatars:document.querySelectorAll('.picks-shared-avatar').length,
  canonicalResolves:window.__PICKS_SOCIAL_ACTIVE_PROOF__.canonicalResolves,
  canonicalRequires:window.__PICKS_SOCIAL_ACTIVE_PROOF__.canonicalRequires,
  editorResolves:window.__PICKS_SOCIAL_ACTIVE_PROOF__.editorResolves
}));}

const snapshots=value=>value.rpcs.filter(row=>row.name==='picks_social_snapshot');

try{
  report.stage='browser-launch';
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});

  report.stage='home-startup';
  const home=await openPage(context,'home');
  report.home=await state(home);
  assert.equal(report.home.shells,1,'Home startup must still install one local Picks profile shell.');
  assert.equal(report.home.hidden,true);
  assert.equal(snapshots(report.home).length,0,'Home startup with cached identity must perform zero Picks social RPCs.');
  assert.deepEqual(report.home.intervals,[30000]);

  report.stage='hidden-readiness';
  await home.evaluate(()=>{window.__PICKS_SOCIAL_ACTIVE_PROOF__.rpcs=[];window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:window.__PICKS_SOCIAL_IDENTITY__}));});
  await home.waitForTimeout(120);
  report.hiddenReadiness=await state(home);
  assert.equal(snapshots(report.hiddenReadiness).length,0,'Published identity must not wake Picks social while Picks is inactive.');

  report.stage='route-entry';
  await home.evaluate(()=>{
    window.__PICKS_SOCIAL_ACTIVE_PROOF__.rpcs=[];
    window.__PICKS_SOCIAL_DESTINATION__='picks';
    document.getElementById('home').classList.remove('active-view');
    document.getElementById('picks').classList.add('active-view');
    window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:'picks'}}));
  });
  await home.waitForFunction(()=>document.getElementById('picksProfileShell')?.hidden===false,null,{timeout:10000});
  report.routeEntry=await state(home);
  assert.equal(snapshots(report.routeEntry).length,1,'Canonical Picks route entry must load one social snapshot.');
  assert.equal(snapshots(report.routeEntry)[0]?.args?.p_member_token,'picks-social-active-token');
  assert.match(report.routeEntry.text,/Profile & Reminders/);

  report.stage='active-mutation';
  await home.evaluate(()=>{window.__PICKS_SOCIAL_ACTIVE_PROOF__.rpcs=[];document.querySelector('#picks .picks-shell').append(document.createElement('div'));});
  await home.waitForTimeout(160);
  report.activeMutation=await state(home);
  assert.equal(snapshots(report.activeMutation).length,0,'Ordinary active Picks mutation must not request another social snapshot.');

  report.stage='active-poll';
  await home.evaluate(async()=>{window.__PICKS_SOCIAL_ACTIVE_PROOF__.rpcs=[];const poll=window.__PICKS_SOCIAL_INTERVAL_CALLBACKS__.find(row=>row.delay===30000);await poll.fn(...poll.args);});
  await home.waitForFunction(()=>window.__PICKS_SOCIAL_ACTIVE_PROOF__.rpcs.some(row=>row.name==='picks_social_snapshot'),null,{timeout:10000});
  await home.waitForTimeout(80);
  report.activePoll=await state(home);
  assert.equal(snapshots(report.activePoll).length,1,'The active 30-second poll must load one social snapshot.');

  report.stage='route-exit';
  await home.evaluate(async()=>{window.__PICKS_SOCIAL_ACTIVE_PROOF__.rpcs=[];window.__PICKS_SOCIAL_DESTINATION__='home';document.getElementById('picks').classList.remove('active-view');document.getElementById('home').classList.add('active-view');const poll=window.__PICKS_SOCIAL_INTERVAL_CALLBACKS__.find(row=>row.delay===30000);await poll.fn(...poll.args);});
  await home.waitForTimeout(100);
  report.routeExit=await state(home);
  assert.equal(snapshots(report.routeExit).length,0,'Picks social polling continued after route exit.');

  report.stage='explicit-inactive';
  await home.evaluate(async()=>{window.__PICKS_SOCIAL_ACTIVE_PROOF__.rpcs=[];await window.UFC_PICKS_SHARED_PROFILE.refresh(true);});
  report.explicitInactive=await state(home);
  assert.equal(snapshots(report.explicitInactive).length,1,'The explicit refresh API must remain usable outside automatic activation.');
  await home.close();

  report.stage='direct-cached';
  const directCached=await openPage(context,'direct-cached');
  await directCached.waitForFunction(()=>document.getElementById('picksProfileShell')?.hidden===false,null,{timeout:10000});
  report.directCached=await state(directCached);
  assert.equal(snapshots(report.directCached).length,1,'Direct active Picks startup with cached identity must load one snapshot.');
  assert.match(report.directCached.text,/Profile & Reminders/);
  await directCached.close();

  report.stage='direct-uncached';
  const directUncached=await openPage(context,'direct-uncached');
  report.directUncached=await state(directUncached);
  assert.equal(snapshots(report.directUncached).length,0,'Direct active uncached startup must wait for identity.');
  assert.equal(report.directUncached.shells,1);
  assert.equal(report.directUncached.hidden,true);
  await directUncached.evaluate(()=>{
    window.UFC_PLAY_PROFILE.identity=window.__PICKS_SOCIAL_IDENTITY__;
    window.UFC_APP_PROFILE.identity=window.__PICKS_SOCIAL_IDENTITY__;
    window.dispatchEvent(new CustomEvent('ufc-play-profile-ready',{detail:window.__PICKS_SOCIAL_IDENTITY__}));
  });
  await directUncached.waitForFunction(()=>document.getElementById('picksProfileShell')?.hidden===false,null,{timeout:10000});
  report.activeReadiness=await state(directUncached);
  assert.equal(snapshots(report.activeReadiness).length,1,'Active readiness must load one social snapshot.');
  assert.match(report.activeReadiness.text,/Profile & Reminders/);
  await directUncached.close();

  report.stage='late-shell-before';
  const late=await openPage(context,'late-shell');
  report.lateBefore=await state(late);
  assert.equal(report.lateBefore.shells,0,'Late-shell fixture unexpectedly mounted a profile shell.');
  assert.equal(snapshots(report.lateBefore).length,0,'Picks social loaded before its local shell could mount.');
  await late.evaluate(()=>{const shell=document.createElement('div');shell.className='picks-shell';shell.innerHTML='<div class="picks-group-member"><strong>Cody</strong></div>';document.getElementById('picks').append(shell);});
  await late.waitForFunction(()=>document.getElementById('picksProfileShell')?.hidden===false,null,{timeout:10000});
  report.lateAfter=await state(late);
  assert.equal(report.lateAfter.shells,1);
  assert.equal(snapshots(report.lateAfter).length,1,'Late active Picks shell mount must receive one bounded social snapshot handoff.');
  assert.match(report.lateAfter.text,/Profile & Reminders/);
  await late.close();

  for(const result of [report.home,report.hiddenReadiness,report.routeEntry,report.directCached,report.directUncached,report.activeReadiness,report.lateBefore,report.lateAfter]){
    assert.equal(result.canonicalResolves,0);
    assert.equal(result.canonicalRequires,0);
    assert.equal(result.editorResolves,0);
  }

  report.passed=true;
  report.stage='complete';
  console.log('Picks social active-Picks ownership proof passed.');
  await context.close();
}catch(error){
  report.error={message:error?.message||String(error),stack:error?.stack||null};
  throw error;
}finally{
  fs.writeFileSync(REPORT,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}

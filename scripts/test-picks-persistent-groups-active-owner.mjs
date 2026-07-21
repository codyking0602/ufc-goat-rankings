import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

await import('./test-picks-persistent-groups-active-contract.mjs');

const ORIGIN='http://127.0.0.1:4173';
const BASE=`${ORIGIN}/picks-persistent-groups-active-proof.html`;
const REPORT='/tmp/picks-persistent-groups-active-owner-report.json';
const report={passed:false,stage:'static-contract',home:null,hiddenMutation:null,hiddenPoll:null,routeEntry:null,activeMutation:null,activePoll:null,routeExit:null,directGroup:null,directRoom:null,lateBefore:null,lateAfter:null,error:null};
let browser;

const snapshot={
  group:{code:'GOAT26',name:'GOAT26 PICKS',is_admin:false},
  season:{name:'2026 Season',correct_points:1,underdog_bonus:1},
  me:{id:'m1'},
  members:[{id:'m1',display_name:'Cody',correct:2,picks_made:3,accuracy:67,event_wins:1,points:3,lock_bonus:0}],
  events:[],
  available_events:[],
  active_room:null
};

function fixture(mode){
  const active=['direct-group','direct-room','late-shell'].includes(mode);
  const includeShell=mode!=='late-shell';
  const hasRoomBanner=['home','direct-room'].includes(mode);
  const shell=includeShell?`<div class="picks-shell">${hasRoomBanner?'<div id="picksRoomBanner"><span class="picks-code">ROOM01</span></div>':''}<div id="picksEventRecap"></div></div>`:'';
  return `<!doctype html><html><head><meta charset="utf-8"><title>Persistent group activation</title></head><body>
    <section id="home" class="${active?'':'active-view'}"></section>
    <section id="picks" class="${active?'active-view':''}">${shell}</section>
    <div id="picksToast"></div>
    <script>
      window.UFC_SUPABASE_CONFIG={url:'https://example.supabase.co',anonKey:'anon'};
      window.__PERSISTENT_MODE__=${JSON.stringify(mode)};
      window.__PERSISTENT_SNAPSHOT__=${JSON.stringify(snapshot)};
      window.__PERSISTENT_DESTINATION__=${JSON.stringify(active?'picks':'home')};
      window.__PERSISTENT_PROOF__={rpcs:[],intervals:[],assigns:[]};
      window.__PERSISTENT_INTERVAL_CALLBACKS__=[];
      const proof=window.__PERSISTENT_PROOF__;
      const client={async rpc(name,args){
        proof.rpcs.push({name,args});
        if(name==='picks_group_public')return{data:{code:'GOAT26',name:'GOAT26 PICKS',member_count:1,event_name:'Next UFC event'},error:null};
        if(name==='picks_group_for_room')return{data:{group_code:'GOAT26'},error:null};
        if(name==='picks_group_snapshot')return{data:structuredClone(window.__PERSISTENT_SNAPSHOT__),error:null};
        if(name==='picks_group_add_event')return{data:{room_code:'ROOM02',event_id:'event-2'},error:null};
        if(name==='picks_join_group')return{data:{group:{code:'GOAT26'},member_token:'joined-token',active_room:null},error:null};
        return{data:{},error:null};
      }};
      window.supabase={createClient(){return client;}};
      window.UFC_APP_SHELL={get currentDestination(){return window.__PERSISTENT_DESTINATION__;}};
      window.setInterval=(fn,delay,...args)=>{proof.intervals.push(Number(delay));window.__PERSISTENT_INTERVAL_CALLBACKS__.push({fn,delay:Number(delay),args});return proof.intervals.length;};
      window.clearInterval=()=>{};
      if(${JSON.stringify(mode)}==='home')localStorage.setItem('ufc-picks:room:ROOM01','room-token');
      if(['route-entry','direct-group','late-shell'].includes(${JSON.stringify(mode)}))localStorage.setItem('ufc-picks:group:GOAT26','group-token');
      if(${JSON.stringify(mode)}==='direct-room')localStorage.setItem('ufc-picks:room:ROOM01','room-token');
    </script>
    <script src="/assets/js/picks-persistent-groups.js"></script>
  </body></html>`;
}

function url(mode){
  const target=new URL(BASE);
  target.searchParams.set('mode',mode);
  if(['route-entry','direct-group','late-shell'].includes(mode))target.searchParams.set('group','GOAT26');
  if(mode==='direct-room'){
    target.searchParams.set('group','GOAT26');
    target.searchParams.set('room','ROOM01');
  }
  return target.toString();
}

async function openPage(context,mode){
  const page=await context.newPage();
  await page.route('**/picks-persistent-groups-active-proof.html*',route=>{
    const requested=new URL(route.request().url()).searchParams.get('mode')||mode;
    return route.fulfill({status:200,contentType:'text/html',body:fixture(requested)});
  });
  await page.goto(url(mode),{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.__PERSISTENT_PROOF__&&window.__PERSISTENT_INTERVAL_CALLBACKS__,null,{timeout:10000});
  await page.waitForTimeout(320);
  return page;
}

async function state(page){
  return page.evaluate(()=>({
    rpcs:window.__PERSISTENT_PROOF__.rpcs.map(row=>structuredClone(row)),
    intervals:[...window.__PERSISTENT_PROOF__.intervals],
    destination:window.__PERSISTENT_DESTINATION__,
    active:document.getElementById('picks')?.classList.contains('active-view')||false,
    cards:document.querySelectorAll('#picksGroupCard').length,
    cardHidden:document.getElementById('picksGroupCard')?.hidden,
    contentChildren:document.getElementById('picksGroupContent')?.children.length||0
  }));
}

const count=(value,name)=>value.rpcs.filter(row=>row.name===name).length;
const totalGroupRpcs=value=>value.rpcs.filter(row=>['picks_group_public','picks_group_for_room','picks_group_snapshot'].includes(row.name)).length;

try{
  report.stage='browser-launch';
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});

  report.stage='home-startup';
  const home=await openPage(context,'home');
  report.home=await state(home);
  assert.equal(report.home.cards,1,'Home startup must still install one local group card shell.');
  assert.equal(totalGroupRpcs(report.home),0,'Home startup with a saved hidden room must perform zero persistent-group RPCs.');
  assert.deepEqual(report.home.intervals,[45000],'The persistent-group freshness interval changed.');

  report.stage='hidden-mutation';
  await home.evaluate(()=>{window.__PERSISTENT_PROOF__.rpcs=[];document.querySelector('#picks .picks-shell').append(document.createElement('div'));});
  await home.waitForTimeout(360);
  report.hiddenMutation=await state(home);
  assert.equal(totalGroupRpcs(report.hiddenMutation),0,'An ordinary hidden Picks mutation woke persistent-group network work.');

  report.stage='hidden-poll';
  await home.evaluate(async()=>{window.__PERSISTENT_PROOF__.rpcs=[];const poll=window.__PERSISTENT_INTERVAL_CALLBACKS__.find(row=>row.delay===45000);await poll.fn(...poll.args);});
  await home.waitForTimeout(80);
  report.hiddenPoll=await state(home);
  assert.equal(totalGroupRpcs(report.hiddenPoll),0,'The 45-second poll woke persistent-group work while Picks was inactive.');
  await home.close();

  report.stage='route-entry';
  const route=await openPage(context,'route-entry');
  assert.equal(totalGroupRpcs(await state(route)),0,'Inactive group-link startup performed premature RPCs.');
  await route.evaluate(()=>{
    window.__PERSISTENT_PROOF__.rpcs=[];
    window.__PERSISTENT_DESTINATION__='picks';
    document.getElementById('home').classList.remove('active-view');
    document.getElementById('picks').classList.add('active-view');
    window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:'picks'}}));
  });
  await route.waitForFunction(()=>document.getElementById('picksGroupContent')?.children.length>0,null,{timeout:10000});
  report.routeEntry=await state(route);
  assert.equal(count(report.routeEntry,'picks_group_public'),1);
  assert.equal(count(report.routeEntry,'picks_group_snapshot'),1);
  assert.equal(report.routeEntry.cards,1);
  assert.equal(report.routeEntry.cardHidden,false);

  report.stage='active-mutation';
  await route.evaluate(()=>{window.__PERSISTENT_PROOF__.rpcs=[];document.querySelector('#picks .picks-shell').append(document.createElement('div'));});
  await route.waitForTimeout(360);
  report.activeMutation=await state(route);
  assert.equal(totalGroupRpcs(report.activeMutation),0,'An ordinary active Picks mutation scheduled a duplicate group refresh.');

  report.stage='active-poll';
  await route.evaluate(async()=>{window.__PERSISTENT_PROOF__.rpcs=[];const poll=window.__PERSISTENT_INTERVAL_CALLBACKS__.find(row=>row.delay===45000);await poll.fn(...poll.args);});
  await route.waitForFunction(()=>window.__PERSISTENT_PROOF__.rpcs.some(row=>row.name==='picks_group_snapshot'),null,{timeout:10000});
  report.activePoll=await state(route);
  assert.equal(count(report.activePoll,'picks_group_public'),1);
  assert.equal(count(report.activePoll,'picks_group_snapshot'),1);

  report.stage='route-exit';
  await route.evaluate(async()=>{window.__PERSISTENT_PROOF__.rpcs=[];window.__PERSISTENT_DESTINATION__='home';document.getElementById('picks').classList.remove('active-view');document.getElementById('home').classList.add('active-view');const poll=window.__PERSISTENT_INTERVAL_CALLBACKS__.find(row=>row.delay===45000);await poll.fn(...poll.args);});
  await route.waitForTimeout(80);
  report.routeExit=await state(route);
  assert.equal(totalGroupRpcs(report.routeExit),0,'Persistent-group polling continued after leaving Picks.');
  await route.close();

  report.stage='direct-group';
  const directGroup=await openPage(context,'direct-group');
  await directGroup.waitForFunction(()=>document.getElementById('picksGroupContent')?.children.length>0,null,{timeout:10000});
  report.directGroup=await state(directGroup);
  assert.equal(count(report.directGroup,'picks_group_public'),1,'Direct group-link startup must resolve the public group once.');
  assert.equal(count(report.directGroup,'picks_group_snapshot'),1,'Direct group-link startup must load one member snapshot.');
  assert.equal(report.directGroup.cards,1);
  await directGroup.close();

  report.stage='direct-room';
  const directRoom=await openPage(context,'direct-room');
  await directRoom.waitForFunction(()=>document.getElementById('picksGroupContent')?.children.length>0,null,{timeout:10000});
  report.directRoom=await state(directRoom);
  assert.equal(count(report.directRoom,'picks_group_for_room'),1,'Direct room startup must resolve its persistent group once.');
  assert.equal(count(report.directRoom,'picks_group_snapshot'),1,'Direct room startup must load one persistent group snapshot.');
  assert.equal(count(report.directRoom,'picks_group_public'),0);
  await directRoom.close();

  report.stage='late-shell-before';
  const late=await openPage(context,'late-shell');
  report.lateBefore=await state(late);
  assert.equal(report.lateBefore.cards,0,'The late-shell fixture unexpectedly mounted a group card.');
  assert.equal(totalGroupRpcs(report.lateBefore),0,'Persistent groups requested network state before the local card could mount.');
  await late.evaluate(()=>{const shell=document.createElement('div');shell.className='picks-shell';shell.innerHTML='<div id="picksEventRecap"></div>';document.getElementById('picks').append(shell);});
  await late.waitForFunction(()=>document.getElementById('picksGroupContent')?.children.length>0,null,{timeout:10000});
  report.lateAfter=await state(late);
  assert.equal(report.lateAfter.cards,1,'Late Picks shell insertion must mount exactly one group card.');
  assert.equal(count(report.lateAfter,'picks_group_public'),1);
  assert.equal(count(report.lateAfter,'picks_group_snapshot'),1);
  await late.close();

  report.passed=true;
  report.stage='complete';
  console.log('Persistent-group active-Picks ownership proof passed.');
  await context.close();
}catch(error){
  report.error={message:error?.message||String(error),stack:error?.stack||null};
  throw error;
}finally{
  fs.writeFileSync(REPORT,`${JSON.stringify(report,null,2)}\n`,'utf8');
  if(browser)await browser.close();
}

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const index=read('index.html');
const early=read('assets/js/fresh-home-route-bootstrap.js');
const shell=read('assets/js/octagon-hq-shell.js');
const picks=read('assets/js/picks.js');
const launch=read('assets/js/fresh-home-launch.js');
const canonicalGroup=read('assets/js/app-canonical-group.js');
const serviceWorker=read('sw.js');

const localPaths=[...index.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)]
  .map(match=>match[1].split('?')[0]);
const position=source=>localPaths.indexOf(source);

const earlyPath='assets/js/fresh-home-route-bootstrap.js';
const shellPath='assets/js/octagon-hq-shell.js';
const picksPath='assets/js/picks.js';
const launchPath='assets/js/fresh-home-launch.js';

assert(position(earlyPath)>=0,'The early route bootstrap must remain production-loaded.');
assert(position(shellPath)>position(earlyPath),'The canonical shell must load after early route normalization.');
assert(position(picksPath)>position(shellPath),'Picks must initialize only after the canonical shell owns the primary route.');
assert(position(launchPath)>position(picksPath),'Fresh launch must remain a subordinate late continuation layer.');

assert(early.includes("url.hash='home'"),'The early bootstrap must keep ordinary startup URL normalization.');
assert(early.includes("const INVITE_KEY='invite'"),'The early bootstrap must distinguish a fresh Picks invite from a restored Picks URL.');
assert.equal(early.includes('legacyBrowserInvite'),false,'The early bootstrap still preserves an unmarked browser group URL as Picks.');
assert.equal(early.includes('preserveBrowserReload'),false,'A browser reload still bypasses explicit Picks entry requirements.');
assert(early.includes("const PIN_RESUME_STORAGE_KEY='__ufc_picks_pin_resume'"),'The earliest route owner must define the one-use PIN navigation handoff.');
assert(early.includes("window.sessionStorage?.setItem(PIN_RESUME_STORAGE_KEY,String(Date.now()))"),'The earliest route owner must record the PIN handoff before async sign-in begins.');
assert(early.includes('const pinResumeTarget=Boolean(room&&url.searchParams.has(\'event\')&&url.searchParams.get(\'picksView\')===\'event\');'),'The PIN handoff may only resume a complete room/event target.');
assert(early.includes('if(pinResumeAt)window.sessionStorage?.removeItem(PIN_RESUME_STORAGE_KEY);'),'The PIN handoff must be consumed once on the next navigation.');
assert(early.includes('const preservePicks=picksRoute&&(resumePicks||inviteMarked);'),'The early bootstrap must preserve Picks only for an explicit invite or intentional resume.');
assert.equal(early.includes('activateDestination('),false,'The early bootstrap must not activate a primary destination.');
assert(shell.includes('showView(initialView'),'The canonical shell must retain the one initial route activation.');
assert(shell.includes("let currentView=''"),'The canonical shell must retain exact-view activation state.');
assert(shell.includes("if(currentView===view&&target?.classList.contains('active-view'))"),'The canonical shell must coalesce an already-active exact view.');
assert(shell.includes('get currentDestination(){return currentDestination;}'),'The canonical shell must publish its current destination for passive route handoffs.');
assert.equal(picks.includes('UFC_APP_SHELL'),false,'Picks must not become a direct primary-route owner.');
assert.equal(picks.includes('UFC_PRODUCT_ARCHITECTURE'),false,'Picks must not invoke the compatibility route owner directly.');
assert(serviceWorker.includes('product-architecture|octagon-hq-shell|native-app-shell'),'The canonical shell must remain network-first in the installed app.');
assert(serviceWorker.includes('fresh-home-route-bootstrap|fresh-home-launch'),'Both Home startup layers must remain network-first in the installed app.');
assert(serviceWorker.includes('app-canonical-group'),'The canonical group startup owner must remain network-first so installed apps cannot retain the route bug.');
assert(serviceWorker.includes('SUPABASE_SCRIPT_SOURCES'),'The cache owner must bound the external Supabase startup dependency.');
const activation=serviceWorker.match(/self\.addEventListener\('activate',event=>\{([\s\S]*?)\n\}\);\n\nfunction isNavigation/);
assert(activation,'The service-worker activation boundary could not be identified.');
assert.doesNotMatch(activation[1],/clients\.matchAll|client\.navigate|openWindow/,'Service-worker activation must not replace the live standalone document.');
assert(canonicalGroup.includes('canonicalizeUrl(hasPicksContext())'),'Canonical group adoption must only force the group parameter in Picks context.');
assert.equal(canonicalGroup.includes('const urlChanged=canonicalizeUrl(true);'),false,'Canonical group adoption must not manufacture a Picks invite during ordinary Home startup.');

const helper=launch.match(/function activateDestinationOnce\(destination\)\{([\s\S]*?)\n  \}/);
assert(helper,'Fresh launch must use one subordinate route-handoff helper.');
assert(helper[1].includes('window.UFC_APP_SHELL||window.UFC_PRODUCT_ARCHITECTURE||null'),'Fresh launch must delegate route activation to the canonical owner.');
assert(helper[1].includes('if(owner.currentDestination===destination)return false;'),'Fresh launch must not reactivate the destination already selected by the canonical shell.');
assert.equal((helper[1].match(/activateDestination\(destination\)/g)||[]).length,1,'The subordinate handoff must contain exactly one canonical activation call.');

for(const [name,destination] of [['activatePicks','picks'],['activateHome','home']]){
  const boundary=launch.match(new RegExp(`function ${name}\\(source='startup'\\)\\{([\\s\\S]*?)\\n  \\}`));
  assert(boundary,`${name} boundary could not be identified.`);
  assert(boundary[1].includes(`activateDestinationOnce('${destination}')`),`${name} must use the deduplicated canonical handoff.`);
  assert.equal(boundary[1].includes('UFC_APP_SHELL?.activateDestination'),false,`${name} must not directly compete with the canonical shell.`);
  assert.equal(boundary[1].includes('UFC_PRODUCT_ARCHITECTURE?.activateDestination'),false,`${name} must not invoke a compatibility route owner directly.`);
}

assert.equal((launch.match(/activateDestinationOnce\('home'\)/g)||[]).length,1,'Home continuation must have exactly one route handoff.');
assert.equal((launch.match(/activateDestinationOnce\('picks'\)/g)||[]).length,1,'Picks continuation must have exactly one route handoff.');
assert(launch.includes('const explicitPicksInvite=isExplicitPicksInvite(startupUrl);'),'Fresh launch must consume the early explicit Picks entry classification.');
assert.equal(launch.includes('legacyBrowserInvite'),false,'Fresh launch still preserves an unmarked group-only browser URL.');
assert.equal(launch.includes('preserveBrowserReload'),false,'Fresh launch still treats browser reload as Picks permission.');
assert(launch.includes('const picksContinuation=picksRoute&&(resumePicks||explicitPicksInvite);'),'Fresh launch must require an explicit invite or intentional resume for Picks continuation.');
assert(launch.includes("event.target.closest?.('#picksShareGroup,#picksShareRoom')"),'Existing Picks share buttons must mark outgoing links as explicit invites.');
assert(launch.includes("url.searchParams.set(INVITE_KEY,'1')"),'The Picks share boundary must add the one-use invite marker.');
assert.equal(launch.includes('#picksPinSignInButton'),false,'The late launch layer still duplicates the early PIN navigation handoff owner.');
assert(launch.includes('if(picksContinuation)activatePicks('),'Fresh launch must preserve explicit Picks continuation recovery.');
assert(launch.includes("else if(!explicitDeepLink)activateHome('startup')"),'Fresh launch must preserve ordinary Home normalization.');

function makeStorage(seed={}){
  const map=new Map(Object.entries(seed).map(([key,value])=>[String(key),String(value)]));
  return {
    get length(){return map.size;},
    key:index=>[...map.keys()][index]??null,
    getItem:key=>map.has(String(key))?map.get(String(key)):null,
    setItem:(key,value)=>map.set(String(key),String(value)),
    removeItem:key=>map.delete(String(key)),
    snapshot:()=>Object.fromEntries(map)
  };
}

function runEarlyScenario(href,{standalone=true,navigationType='navigate',pinClick=false,sessionSeed={}}={}){
  let currentHref=href;
  let clickHandler=null;
  const sessionStorage=makeStorage(sessionSeed);
  const location={
    get href(){return currentHref;},
    set href(value){currentHref=String(value);}
  };
  const history={
    state:null,
    replaceState(_state,_title,value){currentHref=new URL(String(value),currentHref).toString();}
  };
  const document={
    documentElement:{dataset:{}},
    addEventListener(type,handler){if(type==='click')clickHandler=handler;}
  };
  const window={
    navigator:{standalone},
    matchMedia:()=>({matches:standalone}),
    location,
    history,
    sessionStorage
  };
  const performance={getEntriesByType:()=>[{type:navigationType}]};
  const context={window,document,location,history,performance,URL,Date};
  vm.runInNewContext(early,context,{filename:'fresh-home-route-bootstrap.js'});
  if(pinClick){
    clickHandler?.({target:{closest:selector=>selector==='#picksPinSignInButton'?{}:null}});
  }
  return{
    url:new URL(currentHref),
    route:document.documentElement.dataset.freshHomeBootstrapRoute,
    entry:document.documentElement.dataset.freshHomeBootstrapPicksEntry||'',
    windowEntry:window.__UFC_FRESH_HOME_PICKS_ENTRY__||'',
    session:sessionStorage.snapshot()
  };
}

const staleStandalonePicks=runEarlyScenario('https://example.test/?group=GOAT26#picks');
assert.equal(staleStandalonePicks.url.hash,'#home','A restored standalone group URL still opened Picks.');
assert.equal(staleStandalonePicks.url.searchParams.has('group'),false,'A restored standalone launch retained its stale group.');
assert.equal(staleStandalonePicks.route,'home','A restored standalone Picks URL was not classified as Home.');

const staleStandaloneHome=runEarlyScenario('https://example.test/?group=GOAT26#home');
assert.equal(staleStandaloneHome.url.hash,'#home','A stale group parameter overrode an explicit Home hash.');
assert.equal(staleStandaloneHome.url.searchParams.has('group'),false,'Home retained a stale Picks group parameter.');

const staleBrowserPicks=runEarlyScenario('https://example.test/?group=GOAT26#picks',{standalone:false,navigationType:'navigate'});
assert.equal(staleBrowserPicks.url.hash,'#home','A Safari navigation still treated an unmarked group URL as a Picks invite.');
assert.equal(staleBrowserPicks.url.searchParams.has('group'),false,'A Safari navigation retained the stale group parameter.');

const staleBrowserReload=runEarlyScenario('https://example.test/?group=GOAT26#picks',{standalone:false,navigationType:'reload'});
assert.equal(staleBrowserReload.url.hash,'#home','A Safari reload still bypassed explicit Picks entry.');
assert.equal(staleBrowserReload.url.searchParams.has('group'),false,'A Safari reload retained the stale group parameter.');

const pinClick=runEarlyScenario('https://example.test/?group=GOAT26&invite=1#picks',{pinClick:true});
const pinMarkedAt=Number(pinClick.session.__ufc_picks_pin_resume||0);
assert(pinMarkedAt>0,'PIN click did not record the one-use navigation handoff.');
assert.equal(pinClick.url.searchParams.has('__picks_resume'),false,'PIN click leaked its private handoff into the public URL.');

const pinNavigation=runEarlyScenario(
  'https://example.test/?group=GOAT26&room=ROOM01&event=event-1&picksView=event#picks',
  {sessionSeed:pinClick.session}
);
assert.equal(pinNavigation.url.hash,'#picks','The next resolved PIN room navigation was redirected to Home.');
assert.equal(pinNavigation.url.searchParams.get('room'),'ROOM01','The resolved PIN room navigation lost its room.');
assert.equal(pinNavigation.route,'picks','The resolved PIN room navigation was not classified as Picks.');
assert.equal(pinNavigation.entry,'resume','The resolved PIN room navigation was not published as a one-use resume.');
assert.equal('__ufc_picks_pin_resume' in pinNavigation.session,false,'The PIN navigation handoff was not consumed after one use.');

const unmarkedRoomNavigation=runEarlyScenario('https://example.test/?group=GOAT26&room=ROOM01&event=event-1&picksView=event#picks');
assert.equal(unmarkedRoomNavigation.url.hash,'#home','An unmarked room/event URL bypassed Home.');
assert.equal(unmarkedRoomNavigation.url.searchParams.has('room'),false,'An unmarked room/event URL retained stale room state.');

const markedInvite=runEarlyScenario('https://example.test/?group=GOAT26&invite=1#picks');
assert.equal(markedInvite.url.hash,'#picks','A marked fresh Picks invite was redirected to Home.');
assert.equal(markedInvite.url.searchParams.get('group'),'GOAT26','A marked fresh Picks invite lost its group.');
assert.equal(markedInvite.url.searchParams.has('invite'),false,'The one-use Picks invite marker was not consumed.');
assert.equal(markedInvite.route,'picks','A marked fresh Picks invite was not classified as Picks.');
assert.equal(markedInvite.entry,'invite','The early bootstrap did not publish the consumed invite entry.');
assert.equal(markedInvite.windowEntry,'invite','The late launch handoff cannot observe the consumed invite entry.');

const freshResume=runEarlyScenario(`https://example.test/?group=GOAT26&__picks_resume=${Date.now()}#picks`);
assert.equal(freshResume.url.hash,'#picks','A fresh URL-based one-navigation Picks resume was redirected to Home.');
assert.equal(freshResume.route,'picks','A fresh URL-based Picks resume was not classified as Picks.');
assert.equal(freshResume.entry,'resume','The early bootstrap did not publish the fresh URL-based resume entry.');

async function runCanonicalGroupScenario(href){
  let currentHref=href;
  let reloads=0;
  const localStorage=makeStorage({'ufc-picks:group:GOAT26':'member-token-123'});
  const sessionStorage=makeStorage();
  const location={
    get href(){return currentHref;},
    set href(value){currentHref=String(value);},
    reload(){reloads+=1;},
    assign(value){currentHref=String(value);}
  };
  const history={replaceState(_state,_title,value){currentHref=new URL(String(value),currentHref).toString();}};
  const document={
    readyState:'complete',
    body:{},
    documentElement:{setAttribute(){}},
    getElementById(){return null;},
    querySelector(){return null;},
    addEventListener(){}
  };
  class MutationObserver{observe(){}}
  class CustomEvent{constructor(type,options={}){this.type=type;this.detail=options.detail;}}
  const client={rpc:async name=>name==='app_profile_resolve'
    ? {data:{ok:true,member:{display_name:'Cody'},rooms:[]},error:null}
    : {data:null,error:{message:'unexpected fallback'}}};
  const window={
    UFC_SUPABASE_CONFIG:{url:'https://example.supabase.co',anonKey:'anon'},
    supabase:{createClient:()=>client},
    location,
    history,
    dispatchEvent(){}
  };
  const context={window,document,localStorage,sessionStorage,MutationObserver,CustomEvent,URL,console};
  vm.runInNewContext(canonicalGroup,context,{filename:'app-canonical-group.js'});
  await window.UFC_APP_IDENTITY_CONFIG.ready;
  return{url:new URL(currentHref),reloads};
}

const signedInHome=await runCanonicalGroupScenario('https://example.test/#home');
assert.equal(signedInHome.url.hash,'#home','Signed-in identity resolution moved the app away from Home.');
assert.equal(signedInHome.url.searchParams.has('group'),false,'Signed-in Home startup manufactured a Picks group parameter.');
assert.equal(signedInHome.reloads,0,'Signed-in Home startup reloaded after identity resolution.');

const explicitPicks=await runCanonicalGroupScenario('https://example.test/#picks');
assert.equal(explicitPicks.url.hash,'#picks','Explicit Picks startup lost its Picks route.');
assert.equal(explicitPicks.url.searchParams.get('group'),'GOAT26','Explicit Picks startup did not receive the canonical group.');
assert.equal(explicitPicks.reloads,1,'Explicit Picks canonicalization should reload exactly once.');

console.log(JSON.stringify({
  passed:true,
  owner:shellPath,
  consumers:[picksPath,launchPath],
  earlyPosition:position(earlyPath),
  ownerPosition:position(shellPath),
  picksPosition:position(picksPath),
  subordinatePosition:position(launchPath),
  sameViewActivationCoalesced:true,
  sameDestinationHandoffBlocked:true,
  standaloneGroupRestoreReset:true,
  browserGroupRestoreReset:true,
  browserReloadReset:true,
  pinNavigationHandoffPreserved:true,
  unmarkedRoomNavigationReset:true,
  markedInvitePreserved:true,
  freshResumePreserved:true,
  shareInviteMarked:true,
  signedInHomePreserved:true,
  explicitPicksCanonicalized:true,
  installedSourceFreshnessProtected:true,
  boundedSupabaseStartup:true,
  safeServiceWorkerActivation:true
},null,2));
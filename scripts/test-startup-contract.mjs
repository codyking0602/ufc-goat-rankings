import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const index=read('index.html');

const sources=[...index.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(match=>match[1]);
const localSources=sources.filter(source=>!/^https?:\/\//i.test(source));
const localPaths=localSources.map(source=>source.split('?')[0]);
const positions=new Map(localPaths.map((source,index)=>[source,index]));

function count(source){return localPaths.filter(value=>value===source).length;}
function requireOne(source){assert.equal(count(source),1,`${source} must be loaded exactly once from index.html.`);}
function requireBefore(first,second){
  assert(positions.has(first),`${first} is missing from index.html.`);
  assert(positions.has(second),`${second} is missing from index.html.`);
  assert(positions.get(first)<positions.get(second),`${first} must load before ${second}.`);
}
function forbid(source,patterns){
  const body=read(source);
  patterns.forEach(pattern=>assert.equal(body.includes(pattern),false,`${source} must not contain ${pattern}.`));
  return body;
}

const duplicates=[...new Set(localPaths.filter((source,index)=>localPaths.indexOf(source)!==index))];
assert.deepEqual(duplicates,[],'index.html contains duplicate local script sources.');

const singleOwnerScripts=[
  'assets/js/fresh-home-route-bootstrap.js',
  'assets/js/octagon-hq-shell.js',
  'assets/js/octagon-hq-nav-grid.js',
  'assets/js/home-dashboard.js',
  'assets/js/product-architecture.js',
  'assets/js/community-profiles.js',
  'assets/js/fresh-home-launch.js',
  'assets/js/app-notification-center.js',
  'assets/js/app-notification-surface-fix.js',
  'assets/js/native-app-shell.js',
  'assets/js/native-app-shell-stability.js',
  'assets/js/share-deep-links.js'
];
singleOwnerScripts.forEach(requireOne);

[
  ['assets/js/fresh-home-route-bootstrap.js','assets/js/octagon-hq-shell.js'],
  ['assets/js/octagon-hq-shell.js','assets/js/octagon-hq-nav-grid.js'],
  ['assets/data/ranking-data.js','assets/js/app.js'],
  ['assets/data/display-overrides.js','assets/js/app.js'],
  ['assets/js/app.js','assets/js/production-ranking-bootstrap.js'],
  ['assets/js/app-canonical-group.js','assets/js/picks.js'],
  ['assets/js/picks.js','assets/js/picks-persistent-groups.js'],
  ['assets/js/play.js','assets/js/play-hub.js'],
  ['assets/js/play-hub.js','assets/js/home-dashboard.js'],
  ['assets/js/home-dashboard.js','assets/js/product-architecture.js'],
  ['assets/js/product-architecture.js','assets/js/community-profiles.js'],
  ['assets/js/community-profiles.js','assets/js/fresh-home-launch.js'],
  ['assets/js/fresh-home-launch.js','assets/js/app-notification-center.js'],
  ['assets/js/app-notification-center.js','assets/js/app-notification-surface-fix.js'],
  ['assets/js/app-notification-surface-fix.js','assets/js/native-app-shell.js'],
  ['assets/js/native-app-shell.js','assets/js/native-app-shell-stability.js'],
  ['assets/js/native-app-shell-stability.js','assets/js/share-deep-links.js']
].forEach(([first,second])=>requireBefore(first,second));

const earlyRoute=forbid('assets/js/fresh-home-route-bootstrap.js',[
  'addEventListener(',
  'MutationObserver',
  'setInterval(',
  'setTimeout(',
  'location.reload',
  'window.location.reload'
]);
assert(earlyRoute.includes('__UFC_FRESH_HOME_ROUTE_BOOTSTRAP_STARTED__'),'The early route bootstrap must keep its global duplicate-start guard.');
assert(earlyRoute.includes('history.replaceState'),'The early route bootstrap must remain a synchronous URL normalizer.');

const pendingNavigationKey='__UFC_PENDING_SHELL_NAVIGATION__';
const shell=read('assets/js/octagon-hq-shell.js');
assert(shell.includes('__UFC_OCTAGON_HQ_SHELL_STARTED__'),'The app shell must keep its global duplicate-file-execution guard.');
assert(shell.includes('let started=false'),'The app shell must keep its single-start guard.');
assert(shell.includes('if(started){syncNavigation();return true;}'),'The app shell must remain idempotent.');
assert(shell.includes('window.UFC_APP_SHELL=api'),'The app shell must remain the canonical navigation API.');
assert(shell.includes(`const PENDING_NAVIGATION_KEY='${pendingNavigationKey}'`),'The canonical shell must own the recovery-navigation handoff key.');
assert(shell.includes('function takePendingNavigation(defaultRankingView)'),'The canonical shell must consume a queued recovery navigation request.');
assert(/const route=parseRoute\(\);currentRankingView=RANKING_VIEWS\.includes\(route\)\?route:'men';const pending=takePendingNavigation\(currentRankingView\);const initialView=pending\?\.view\|\|route;[\s\S]*showView\(initialView,pending\?\.options\|\|\{updateHash:Boolean\(location\.hash\)\}\)/.test(shell),'The shell must consume the queued request inside its single startup activation rather than replaying a second route after startup.');
assert.equal((shell.match(/takePendingNavigation\(currentRankingView\)/g)||[]).length,1,'The shell must consume at most one queued navigation handoff during startup.');

const navGrid=read('assets/js/octagon-hq-nav-grid.js');
assert(navGrid.includes('__UFC_OCTAGON_HQ_NAV_GRID_STARTED__'),'The nav-grid cleanup must keep its global duplicate-file-execution guard.');

const homeDashboard=read('assets/js/home-dashboard.js');
assert(homeDashboard.includes('__UFC_HOME_DASHBOARD_STARTED__'),'The Home dashboard must keep its global duplicate-file-execution guard.');

assert(read('assets/js/picks.js').includes('__UFC_PICKS_STARTED__'),'Picks must keep its global duplicate-file-execution guard.');
assert(read('assets/js/community-profiles.js').includes('__UFC_COMMUNITY_PROFILES_STARTED__'),'Community profiles must keep its global duplicate-file-execution guard.');
const play=read('assets/js/play.js');
assert(/if\(!panel \|\| !Array\.isArray\(DATA\.men\)\) return;\s+if\(window\.__UFC_PLAY_STARTED__\) return;\s+window\.__UFC_PLAY_STARTED__ = true;\s+const state = \{/.test(play),'Play must keep its duplicate-file guard after required DOM and ranking-data prerequisites pass and before successful ownership begins.');
const playHub=read('assets/js/play-hub.js');
assert(/if\(!play\|\|!shell\|\|!sectionTitle\|\|!top10Button\|\|!blindButton\)return;\s+if\(window\.__UFC_PLAY_HUB_STARTED__\)return;\s+window\.__UFC_PLAY_HUB_STARTED__=true;\s+const nativeRandom=/.test(playHub),'Play hub must keep its duplicate-file guard after required Play DOM prerequisites pass and before successful ownership begins.');

const app=read('assets/js/app.js');
assert.equal(app.includes("document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click'"),false,'app.js must not own primary tab activation; the canonical shell owns route activation.');

const profileIdentity=read('assets/js/play-profile-identity.js');
assert(profileIdentity.includes("async function login(_groupCode,displayName,pin,options={})"),'The shared profile owner must expose the canonical login transaction.');
assert(profileIdentity.includes("if(options.publish!==false)window.dispatchEvent(new CustomEvent('ufc-play-profile-ready'"),'The canonical login owner must preserve normal readiness publication while allowing a reload-bound consumer to suppress it.');
assert(profileIdentity.includes("active_room:data?.active_room||identity?.active_room||null"),'The canonical login result must preserve Picks active-room continuation context.');
const picksPin=read('assets/js/picks-member-pin.js');
const picksSignIn=picksPin.match(/async function signIn\(\)\{([\s\S]*?)\n  \}\n\n  function ensureSignInCard/);
assert(picksSignIn,'The returning-member Picks sign-in boundary could not be identified.');
assert(picksSignIn[1].includes('window.UFC_PLAY_PROFILE'),'The Picks returning-member card must delegate authentication to the canonical shared profile owner.');
assert(picksSignIn[1].includes("{publish:false,source:'picks-member-pin'}"),'The reload-bound Picks login must suppress only its redundant pre-navigation readiness publication.');
assert.equal(picksSignIn[1].includes("client.rpc('picks_member_login_pin'"),false,'The Picks sign-in surface must not call a credential RPC directly.');
assert.equal(picksPin.includes('function storeAccess(data)'),false,'The Picks PIN module must not duplicate canonical access-token persistence.');
assert(picksPin.includes("client.rpc('picks_member_set_pin'"),'The Picks module must retain member PIN management.');
assert(picksPin.includes("client.rpc('picks_commissioner_set_member_pin'"),'The Picks module must retain commissioner PIN management.');

const product=read('assets/js/product-architecture.js');
assert(product.includes('__UFC_PRODUCT_ARCHITECTURE_STARTED__'),'Product architecture must keep its global duplicate-start guard.');
assert.equal(product.includes('loadNativeShell'),false,'Product architecture must not dynamically load the native shell.');
assert.equal(product.includes('loadNotificationSurfaceFix'),false,'Product architecture must not dynamically load the notification surface.');
assert(product.includes(`const PENDING_NAVIGATION_KEY='${pendingNavigationKey}'`),'Product architecture and the canonical shell must share one explicit recovery handoff key.');
assert(product.includes("document.addEventListener('click',captureRecoveryNavigation,true)"),'Product architecture must intercept navigation only during a missing-shell recovery window.');
assert(product.includes("document.removeEventListener('click',captureRecoveryNavigation,true)"),'The recovery interception must be removed when the shell becomes available.');
assert(product.includes("queueNavigation('activateDestination',key)"),'Recovery-window destination taps must be queued for the canonical shell.');
assert(product.includes("queueNavigation('activateView',view)"),'Recovery-window ranking-view taps must be queued for the canonical shell.');
assert(product.includes("script.dataset.productArchitectureShellRecovery='true'"),'Dynamic shell recovery must remain explicitly marked.');
assert(product.includes("script.addEventListener('error'"),'A failed recovery shell request must remain retryable.');
assert.equal(product.includes('setInterval('),false,'Product architecture must not add a recovery polling loop.');
assert.equal(product.includes('location.reload'),false,'Product architecture must not add a recovery reload path.');
const recoveryCapture=product.match(/function captureRecoveryNavigation\(event\)\{([\s\S]*?)\n  \}\n\n  function loadConnectivity/);
assert(recoveryCapture,'The recovery capture boundary could not be identified.');
assert.equal(/classList\.(?:add|remove|toggle)/.test(recoveryCapture[1]),false,'Recovery interception must not mutate active classes or partially activate a destination.');
assert.equal(recoveryCapture[1].includes('history.'),false,'Recovery interception must not write route history outside the canonical shell.');
assert.equal(recoveryCapture[1].includes('dispatchEvent'),false,'Recovery interception must not publish a route event outside the canonical shell.');

const freshLaunch=forbid('assets/js/fresh-home-launch.js',[
  'MutationObserver',
  'setInterval(',
  'visibilitychange',
  'pagehide',
  'pageshow',
  'location.reload',
  'window.location.reload'
]);
assert(freshLaunch.includes('__UFC_FRESH_HOME_LAUNCH_STARTED__'),'Fresh launch must keep its global duplicate-start guard.');
assert(freshLaunch.includes('profile-setup-reminder.js'),'Fresh launch may only inject the profile setup reminder after route selection.');

assert(read('assets/js/app-notification-center.js').includes('__UFC_APP_NOTIFICATION_CENTER_STARTED__'),'Notification center must keep its global duplicate-file-execution guard.');
const notificationSurface=read('assets/js/app-notification-surface-fix.js');
assert(notificationSurface.includes('__UFC_APP_NOTIFICATION_SURFACE_FIX_STARTED__'),'Notification surface must keep its global duplicate-start guard.');

const nativeShell=read('assets/js/native-app-shell.js');
assert(nativeShell.includes('__UFC_NATIVE_APP_SHELL_STARTED__'),'Native shell must keep its global duplicate-file-execution guard.');
assert(nativeShell.includes("document.querySelector('[data-native-bottom-nav]')"),'Native shell must reuse the existing bottom navigation.');
assert(nativeShell.includes('state.started'),'Native shell must keep an idempotent start state.');

forbid('assets/js/native-app-shell-stability.js',[
  'activateDestination(',
  'activateView(',
  'location.reload',
  'window.location.reload',
  'setInterval('
]);
assert(read('assets/js/native-app-shell-stability.js').includes('__UFC_NATIVE_APP_SHELL_STABILITY_STARTED__'),'Native shell stability must keep its global duplicate-file-execution guard.');

const shareDeepLinks=read('assets/js/share-deep-links.js');
assert(/'use strict';\s+if\(window\.__UFC_SHARE_DEEP_LINKS_STARTED__\)return;\s+window\.__UFC_SHARE_DEEP_LINKS_STARTED__=true;\s+const VERSION=/.test(shareDeepLinks),'Share/deep links must keep its duplicate-file guard before private state, listeners, API publication, and route ownership.');

const productionRankingBootstrap=read('assets/js/production-ranking-bootstrap.js');
assert(/'use strict';\s+if\(window\.__UFC_PRODUCTION_RANKING_BOOTSTRAP_OWNER__\)return;\s+const VERSION=[\s\S]*function run\(force\)\{\s+if\(lifecycleState\.attempt\)return lifecycleState\.attempt;\s+if\(!force&&lifecycleState\.status==='ready'\)return Promise\.resolve\(lifecycleState\.lastResult\);[\s\S]*const lifecycle=\{\s+version:VERSION,\s+start:\(\)=>run\(false\),\s+retry:\(\)=>run\(false\),\s+apply:\(\)=>run\(true\),\s+refresh:\(\)=>run\(true\),[\s\S]*window\.__UFC_PRODUCTION_RANKING_BOOTSTRAP_OWNER__=lifecycle;\s+window\.UFC_PRODUCTION_RANKING_BOOTSTRAP_LIFECYCLE=lifecycle;\s+lifecycle\.start\(\);/.test(productionRankingBootstrap),'Production ranking bootstrap must keep its owner guard before private state and its explicit deduplicated start/retry/apply/refresh lifecycle before the automatic first attempt.');

assert(/<meta\s+name=["']app-build["']\s+content=["'][^"']+["']/i.test(index),'index.html must retain an app-build marker for update delivery.');

console.log(JSON.stringify({
  passed:true,
  localScriptCount:localPaths.length,
  singleOwnerScripts:singleOwnerScripts.length,
  recoveryNavigationHandoff:true,
  firstScript:localPaths[0],
  lastScript:localPaths.at(-1)
},null,2));

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
assert(earlyRoute.includes('history.replaceState'),'The early route bootstrap must remain a synchronous URL normalizer.');

const shell=read('assets/js/octagon-hq-shell.js');
assert(shell.includes('let started=false'),'The app shell must keep its single-start guard.');
assert(shell.includes('if(started){syncNavigation();return true;}'),'The app shell must remain idempotent.');
assert(shell.includes('window.UFC_APP_SHELL=api'),'The app shell must remain the canonical navigation API.');

const product=read('assets/js/product-architecture.js');
assert(product.includes('__UFC_PRODUCT_ARCHITECTURE_STARTED__'),'Product architecture must keep its global duplicate-start guard.');
assert.equal(product.includes('loadNativeShell'),false,'Product architecture must not dynamically load the native shell.');
assert.equal(product.includes('loadNotificationSurfaceFix'),false,'Product architecture must not dynamically load the notification surface.');

const freshLaunch=forbid('assets/js/fresh-home-launch.js',[
  'MutationObserver',
  'setInterval(',
  'visibilitychange',
  'pagehide',
  'pageshow',
  'location.reload',
  'window.location.reload'
]);
assert(freshLaunch.includes('profile-setup-reminder.js'),'Fresh launch may only inject the profile setup reminder after route selection.');

const notificationSurface=read('assets/js/app-notification-surface-fix.js');
assert(notificationSurface.includes('__UFC_APP_NOTIFICATION_SURFACE_FIX_STARTED__'),'Notification surface must keep its global duplicate-start guard.');

const nativeShell=read('assets/js/native-app-shell.js');
assert(nativeShell.includes("document.querySelector('[data-native-bottom-nav]')"),'Native shell must reuse the existing bottom navigation.');
assert(nativeShell.includes('state.started'),'Native shell must keep an idempotent start state.');

forbid('assets/js/native-app-shell-stability.js',[
  'activateDestination(',
  'activateView(',
  'location.reload',
  'window.location.reload',
  'setInterval('
]);

assert(/<meta\s+name=["']app-build["']\s+content=["'][^"']+["']/i.test(index),'index.html must retain an app-build marker for update delivery.');

console.log(JSON.stringify({
  passed:true,
  localScriptCount:localPaths.length,
  singleOwnerScripts:singleOwnerScripts.length,
  firstScript:localPaths[0],
  lastScript:localPaths.at(-1)
},null,2));

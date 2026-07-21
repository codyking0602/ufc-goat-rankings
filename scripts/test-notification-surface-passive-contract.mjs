import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const index=read('index.html');
const owner=read('assets/js/app-notification-center.js');
const consumer=read('assets/js/app-notification-surface-fix.js');

const loaded=[...index.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)]
  .map(match=>match[1].split('?')[0]);
const ownerPath='assets/js/app-notification-center.js';
const consumerPath='assets/js/app-notification-surface-fix.js';
const ownerPosition=loaded.indexOf(ownerPath);
const consumerPosition=loaded.indexOf(consumerPath);

assert(ownerPosition>=0,'The canonical notification center must remain production-loaded.');
assert(consumerPosition>ownerPosition,'The notification surface compatibility layer must load after its canonical owner.');

assert.match(owner,/async function loadSettings\(force=false\)/,'The canonical owner must retain notification settings loading.');
assert.match(owner,/function render\(\)/,'The canonical owner must retain notification surface rendering.');
assert.match(owner,/function scheduleRender\(\)/,'The canonical owner must retain render coalescing.');
assert.match(owner,/ufc-play-profile-ready/,'The canonical owner must retain readiness-driven settings refresh.');
assert.match(owner,/ufc-app-profile-updated/,'The canonical owner must retain profile-update settings refresh.');
assert.match(owner,/octagon-hq:notification-device-change/,'The canonical owner must retain device-change settings refresh.');
assert.match(owner,/state\.observer=new MutationObserver/,'The canonical owner must retain notification-surface observation.');

assert.doesNotMatch(consumer,/UFC_APP_NOTIFICATIONS/,'The compatibility layer must not invoke notification rendering or settings ownership.');
assert.doesNotMatch(consumer,/\bloadSettings\s*\??\.??\s*\(/,'The compatibility layer must not load canonical notification settings.');
assert.doesNotMatch(consumer,/syncNotifications/,'The removed cross-owner notification bridge must not return.');
assert.doesNotMatch(consumer,/UFC_PLAY_PROFILE\?\.(?:resolve|resolveIdentity|require)\?\.\(/,'The compatibility layer must not resolve or require canonical identity.');
assert.doesNotMatch(consumer,/UFC_APP_PROFILE\?\.resolve\?\.\(/,'The compatibility layer must not invoke the visible profile editor resolver.');
assert.doesNotMatch(consumer,/ufc-picks:group:GOAT26/,'The compatibility layer must not read canonical group access storage.');

assert.match(consumer,/function restoreCachedProfile\(\)/,'Cached profile restoration must remain.');
assert.match(consumer,/function saveFinishedProfile\(\)/,'Finished profile caching must remain.');
assert.match(consumer,/function bindCachedActions\(root\)/,'Cached activity actions must remain bound.');
assert.match(consumer,/new MutationObserver/,'Profile-cache observation must remain.');
assert.match(consumer,/serviceWorker\.register/,'Installed-app worker registration compatibility must remain.');
assert.match(consumer,/octagon-hq:soft-refresh/,'Soft refresh may still synchronize the profile cache.');
assert.match(consumer,/UFC_APP_NOTIFICATION_SURFACE_FIX=\{version:VERSION,render:sync,schedule:sync,restoreCachedProfile,saveFinishedProfile\}/,'The compatibility API must remain available for profile-cache synchronization only.');

console.log(JSON.stringify({
  passed:true,
  owner:ownerPath,
  passiveConsumer:consumerPath,
  ownerPosition,
  consumerPosition,
  notificationRenderOwnedByCenter:true,
  notificationSettingsOwnedByCenter:true,
  profileCacheCompatibilityPreserved:true
},null,2));

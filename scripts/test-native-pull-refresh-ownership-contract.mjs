import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const index=read('index.html');
const native=read('assets/js/native-app-shell.js');
const watcher=read('assets/js/app-update-watcher.js');
const activity=read('assets/js/octagon-notifications.js');

const loaded=[...index.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)]
  .map(match=>match[1].split('?')[0]);
const watcherPath='assets/js/app-update-watcher.js';
const activityPath='assets/js/octagon-notifications.js';
const nativePath='assets/js/native-app-shell.js';
const watcherPosition=loaded.indexOf(watcherPath);
const activityPosition=loaded.indexOf(activityPath);
const nativePosition=loaded.indexOf(nativePath);

assert(watcherPosition>=0,'The canonical quick-sync owner must remain production-loaded.');
assert(activityPosition>watcherPosition,'Octagon activity status must load after the quick-sync owner.');
assert(nativePosition>activityPosition,'The native pull presentation must load after both data owners.');

function boundary(source,startMarker,endMarker){
  const start=source.indexOf(startMarker);
  const end=source.indexOf(endMarker,start+startMarker.length);
  assert(start>=0&&end>start,`Could not identify ${startMarker}.`);
  return source.slice(start,end);
}

const fallback=boundary(native,'  async function fallbackQuickSync(){','\n\n  async function refresh(){');
const refresh=boundary(native,'  async function refresh(){','\n\n  function bindPullToRefresh(){');
const quickSync=boundary(watcher,'  async function quickSync(){','\n  }\n\n  async function installNewBuild');
const activityRefresh=boundary(activity,'  async function refreshStatus(options={}){','\n\n  async function markSeen(){');

assert.doesNotMatch(fallback,/UFC_OCTAGON_NOTIFICATIONS|refreshStatus/,'The subordinate fallback must not perform the accepted pull action’s final activity-status refresh.');
assert.match(fallback,/UFC_PLAY_DAILY_SERVICE\?\.recoverCurrentDay/,'Fallback daily recovery must remain.');
assert.match(fallback,/UFC_DAILY_LEADERBOARD_LIVE\?\.check/,'Fallback leaderboard recovery must remain.');
assert.match(fallback,/UFC_PROFILE_CHALLENGES\?\.loadInbox/,'Fallback inbox recovery must remain.');
assert.match(fallback,/UFC_APP_NOTIFICATIONS\?\.loadSettings/,'Fallback notification settings refresh must remain.');
assert.match(fallback,/UFC_OCTAGON_BOARD\?\.load/,'Fallback active War Room board refresh must remain.');
assert.match(fallback,/UFC_HOME_DASHBOARD\?\.render/,'Fallback Home presentation refresh must remain.');
assert.match(fallback,/octagon-hq:soft-refresh/,'Fallback soft-refresh publication must remain.');

assert.match(refresh,/if\(state\.refreshing\)return;/,'One accepted pull action must retain its in-flight owner.');
assert.equal((refresh.match(/UFC_OCTAGON_NOTIFICATIONS\?\.refreshStatus\?\.\(\)/g)||[]).length,1,'The accepted pull action must perform exactly one final activity-status refresh.');
assert.match(refresh,/UFC_APP_UPDATE_WATCHER\?\.quickSync/,'Native refresh must prefer the canonical quick-sync owner.');
assert.match(refresh,/\|\|fallbackQuickSync\(\)/,'Native refresh must retain its missing-owner fallback.');
assert.match(refresh,/syncBadges\(\)/,'Native refresh must retain badge synchronization.');

assert.doesNotMatch(quickSync,/UFC_OCTAGON_NOTIFICATIONS|refreshStatus/,'The canonical app quick-sync must continue leaving the final activity refresh to the accepted native action.');
assert.match(quickSync,/octagon-hq:soft-refresh/,'Canonical quick-sync must retain soft-refresh publication.');
assert.match(activityRefresh,/if\(state\.refreshPromise\)return state\.refreshPromise/,'The activity owner must retain in-flight coalescing.');
assert.match(activityRefresh,/finally\{state\.refreshPromise=null;\}/,'The activity owner must retain request lifecycle cleanup.');

console.log(JSON.stringify({
  passed:true,
  acceptedActionOwner:nativePath,
  quickSyncOwner:watcherPath,
  activityOwner:activityPath,
  fallback:'native fallbackQuickSync',
  watcherPosition,
  activityPosition,
  nativePosition,
  oneFinalActivityRefresh:true,
  fallbackRecoveryPreserved:true
},null,2));

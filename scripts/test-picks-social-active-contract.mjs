import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync('assets/js/picks-social-retention.js','utf8');
const start=source.match(/function start\(\)\{([\s\S]*?)\n  \}\n\n  window\.UFC_PICKS_SHARED_PROFILE/);
const active=source.match(/function picksActive\(\)\{([\s\S]*?)\n  \}/);
const sync=source.match(/function syncSharedProfile\(\)\{([\s\S]*?)\n  \}/);

assert(start,'Picks social startup body could not be located.');
assert(active,'Picks social active-destination boundary could not be located.');
assert(sync,'Picks social synchronization boundary could not be located.');
assert.match(source,/picks-social-retention-20260721h-active-picks-only/,'Corrected Picks social runtime version is missing.');
assert.match(active[1],/window\.UFC_APP_SHELL\?\.currentDestination/,'Picks social must prefer the canonical shell destination.');
assert.match(active[1],/destination==='picks'/,'Picks social automatic work must be bound to Picks.');
assert.match(active[1],/getElementById\('picks'\)\?\.classList\.contains\('active-view'\)/,'Picks social must retain a direct-startup DOM fallback.');
assert.match(sync[1],/if\(!picksActive\(\)\)return/,'Readiness/profile synchronization must not wake inactive Picks.');
assert.match(sync[1],/state\.snapshot\?render\(state\.snapshot\):refresh\(true\)/,'Active synchronization must retain local render or snapshot refresh ownership.');
assert.match(start[1],/installStyles\(\);ensureProfileShell\(\);if\(picksActive\(\)&&document\.getElementById\('picksProfileShell'\)\)refresh\(\)/,'Direct active Picks startup must retain one mounted-shell refresh.');
assert.doesNotMatch(start[1],/installStyles\(\);ensureProfileShell\(\);refresh\(\)/,'Picks social still refreshes unconditionally during startup.');
assert.match(start[1],/MutationObserver[\s\S]*hadShell[\s\S]*ensureProfileShell\(\)[\s\S]*!hadShell[\s\S]*scheduleSync\(\)/,'Mutation observation must use one late-shell handoff.');
assert.match(start[1],/ufc-play-profile-ready[\s\S]*state\.identity=event\.detail[\s\S]*if\(picksActive\(\)\)setTimeout\(syncSharedProfile,0\)/,'Canonical readiness must update cached identity without waking inactive Picks.');
assert.match(start[1],/ufc-app-profile-updated[\s\S]*if\(picksActive\(\)\)setTimeout\(syncSharedProfile,0\)/,'Profile updates must remain active-Picks-only.');
assert.match(start[1],/octagon-hq:view-change[\s\S]*destination!=='picks'[\s\S]*ensureProfileShell\(\)[\s\S]*refresh\(true\)/,'Canonical Picks route entry must retain a fresh snapshot handoff.');
assert.match(start[1],/setInterval\(\(\)=>\{if\(picksActive\(\)\)refresh\(\);\},30000\)/,'The 30-second poll must be active-Picks-only.');
assert.match(source,/client\.rpc\('picks_social_snapshot'/,'Picks social snapshot ownership must remain.');
assert.match(source,/client\.rpc\('picks_social_update_profile'/,'Reminder preference ownership must remain.');
assert.match(source,/Notification\.requestPermission/,'Reminder permission behavior must remain.');
assert.match(source,/BEGIN:VCALENDAR/,'Phone-calendar reminder ownership must remain.');

console.log(JSON.stringify({passed:true,responsibility:'Picks social retention activation',inactiveStartupRpc:false,inactiveReadinessRpc:false,poll:'active-picks-only',preserved:['direct Picks startup','route entry','active readiness','late shell','profile editor','reminder preference','calendar reminders','explicit refresh API']},null,2));

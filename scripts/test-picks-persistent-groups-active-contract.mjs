import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync('assets/js/picks-persistent-groups.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const start=source.match(/function start\(\)\{([\s\S]*?)\n  \}\n\n  if\(document\.readyState/);
const active=source.match(/function picksActive\(\)\{([\s\S]*?)\n  \}/);
const schedule=source.match(/function scheduleRefresh\(\)\{([\s\S]*?)\n  \}/);
const loaded=[...index.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(match=>match[1].split('?')[0]);
const shellPosition=loaded.indexOf('assets/js/octagon-hq-shell.js');
const ownerPosition=loaded.indexOf('assets/js/picks-persistent-groups.js');

assert(start,'Persistent-group startup body could not be located.');
assert(active,'Persistent-group active-destination boundary could not be located.');
assert(schedule,'Persistent-group bounded refresh scheduler could not be located.');
assert(ownerPosition>=0&&shellPosition>=0,'Persistent-group owner and canonical shell must both be production-loaded.');
assert.match(active[1],/window\.UFC_APP_SHELL\?\.currentDestination/,'Persistent groups must prefer the canonical shell destination.');
assert.match(active[1],/destination==='picks'/,'Persistent-group work must be bound to Picks.');
assert.match(active[1],/getElementById\('picks'\)\?\.classList\.contains\('active-view'\)/,'Persistent groups must retain the DOM fallback for direct startup.');
assert.match(schedule[1],/clearTimeout\(start\.timer\)/,'Late card refresh scheduling must remain bounded.');
assert.match(schedule[1],/if\(picksActive\(\)\) refresh\(\)/,'The bounded scheduler must not wake inactive Picks.');
assert.match(start[1],/ensureCard\(\);[\s\S]*if\(picksActive\(\)[\s\S]*picksGroupCard[\s\S]*refresh\(\)/,'Direct active Picks startup must retain one mounted-card refresh.');
assert.doesNotMatch(start[1],/\n\s*refresh\(\);/,'Persistent groups still refresh unconditionally during startup.');
assert.match(start[1],/MutationObserver[\s\S]*hadCard[\s\S]*ensureCard\(\)[\s\S]*!hadCard[\s\S]*scheduleRefresh\(\)/,'Mutation observation must only hand off one late card creation.');
assert.match(start[1],/octagon-hq:view-change[\s\S]*destination!=='picks'[\s\S]*ensureCard\(\)[\s\S]*refresh\(\)/,'Canonical Picks route entry must retain refresh ownership.');
assert.match(start[1],/setInterval\(\(\)=>\{ if\(picksActive\(\)\) refresh\(\); \},45000\)/,'The 45-second poll must be active-Picks-only.');
assert.match(source,/picks_group_public/,'Public group-link resolution must remain.');
assert.match(source,/picks_group_for_room/,'Direct room-to-group resolution must remain.');
assert.match(source,/picks_group_snapshot/,'Persistent group snapshot ownership must remain.');
assert.match(source,/picks_join_group/,'Invite joining must remain.');
assert.match(source,/picks_group_add_event/,'Admin add-event and auto-advance ownership must remain.');
assert.match(source,/navigator\.share/,'Permanent group sharing must remain.');

console.log(JSON.stringify({passed:true,responsibility:'persistent group activation and polling',inactiveStartupRpc:false,ordinaryMutationRpc:false,poll:'active-picks-only',preserved:['direct group link','direct room resolution','late card mount','invite join','auto-advance','share','admin event action']},null,2));

import assert from 'node:assert/strict';
import fs from 'node:fs';

// Permanent War Room proof: one access owner publishes permission state; shell surfaces only consume it.
const access=fs.readFileSync('assets/js/octagon-access-panel.js','utf8');
const board=fs.readFileSync('assets/js/octagon-message-board.js','utf8');
const shell=fs.readFileSync('assets/js/octagon-hq-shell.js','utf8');
const home=fs.readFileSync('assets/js/home-dashboard.js','utf8');
const native=fs.readFileSync('assets/js/native-app-shell.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const loaded=[...index.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(match=>match[1].split('?')[0]);
const boardPosition=loaded.indexOf('assets/js/octagon-message-board.js');
const accessPosition=loaded.indexOf('assets/js/octagon-access-panel.js');
const start=access.match(/function start\(\)\{([\s\S]*?)\n  \}\n\n  window\.UFC_OCTAGON_ACCESS/);
const boardStart=board.match(/function start\(\)\{([\s\S]*?)\n  \}\n\n  window\.addEventListener\('ufc-play-profile-ready'/);

assert(boardPosition>=0&&accessPosition>boardPosition,'The War Room board owner must load before the access panel owner.');
assert(start,'Access-panel startup body could not be located.');
assert(boardStart,'War Room board startup body could not be located.');
assert.match(boardStart[1],/installStyles\(\);[\s\S]*mount\(\);[\s\S]*bindTab\(\);/,'The board owner must mount synchronously before the access-panel startup listener runs.');
assert.match(access,/octagon-access-panel-20260721d-permission-surfaces/,'Permission-aware access runtime version is missing.');
assert.doesNotMatch(access,/\[0,250,900,2600,5000\]/,'The retired access-status startup retries returned.');
assert.match(start[1],/installStyles\(\);[\s\S]*ensurePanel\(\);[\s\S]*void checkCurrentAccess\(\);/,'One immediate access shell/status attempt must remain.');
assert.match(start[1],/ufc-play-profile-ready[\s\S]*ufc-app-profile-updated[\s\S]*ufc-canonical-group-ready/,'Identity readiness events must remain.');
assert.match(start[1],/passiveIdentity\(event\.detail\);[\s\S]*scheduleAccessCheck\(60\);/,'Readiness events must retain one access-status handoff.');
assert.match(start[1],/visibilitychange[\s\S]*scheduleAccessCheck\(80\)/,'Visibility access verification must remain.');
assert.match(start[1],/window\.addEventListener\('online',[\s\S]*scheduleAccessCheck\(100\)/,'Online access verification must remain.');
assert.match(start[1],/setInterval\(\(\)=>\{[\s\S]*if\(!document\.hidden\)checkCurrentAccess\(\);[\s\S]*\},60000\)/,'The separate 60-second server verification poll changed.');
assert.match(access,/channel\.on\('broadcast',\{event:'access-change'\}[\s\S]*scheduleAccessCheck\(80\)/,'Realtime access-change verification must remain.');
assert.match(access,/octagon_admin_access_roster[\s\S]*octagon_admin_set_access/,'Cody-only roster and toggle ownership must remain.');
assert.doesNotMatch(access,/UFC_PLAY_PROFILE\?\.resolve|UFC_APP_PROFILE\?\.resolve|localStorage\.getItem/,'The access owner must remain a passive identity consumer.');

assert.match(access,/function accessMode\(allowed\)\{[\s\S]*if\(allowed\)return'owner';[\s\S]*hasInvite\(\)\?'invite':'locked'/,'The canonical access owner must publish owner, invite, and locked states.');
assert.match(access,/button\.hidden=locked;[\s\S]*button\.disabled=locked;[\s\S]*button\.textContent=invited\?'Join with invite':'War Room'/,'The access owner must hide locked access and keep invite access actionable.');
assert.match(access,/octagon-hq:war-room-access-change/,'The access owner must publish one permission-change handoff for passive consumers.');
assert.match(access,/get mode\(\)\{return state\.mode;\}/,'The canonical permission mode must be exposed read-only.');

assert.match(shell,/app-shell-20260721c-permission-aware-war-room/,'Permission-aware app shell version is missing.');
assert.match(shell,/data-war-room-access=\"locked\"/,'The desktop shell must collapse the hidden War Room destination.');
assert.match(shell,/const labelText=invited\?'Join with invite':'War Room'/,'The shell must preserve the invite state instead of converting it to disabled UI.');
assert.match(shell,/button\.hidden=locked;[\s\S]*button\.disabled=locked/,'The shell must hide locked War Room navigation.');
assert.doesNotMatch(shell,/UFC_PLAY_PROFILE|UFC_APP_PROFILE|octagon_access_status/,'The shell must not resolve identity or verify access.');

assert.match(home,/home-dashboard-20260721a-permission-aware-war-room/,'Permission-aware Home version is missing.');
assert.match(home,/function warMode\(\)\{return text\(window\.UFC_OCTAGON_ACCESS\?\.mode\)/,'Home must consume only the canonical permission mode.');
assert.match(home,/if\(mode==='locked'\)return'';/,'Home must remove the War Room card for locked or signed-out users.');
assert.match(home,/JOIN WITH INVITE/,'Home must expose an understandable invite action.');
assert.match(home,/JOIN CONVERSATION/,'Home must preserve the eligible conversation action.');
assert.doesNotMatch(home,/data-home-action=\"war-room\"[^`]*disabled/,'Home must never render a disabled Join Conversation action.');

assert.match(native,/native-app-shell-20260721d-permission-aware-war-room/,'Permission-aware native shell version is missing.');
assert.match(native,/window\.UFC_OCTAGON_ACCESS\?\.mode/,'Native navigation must consume only the canonical permission mode.');
assert.match(native,/button\.hidden=locked;[\s\S]*button\.disabled=locked/,'Native navigation must hide locked War Room access.');
assert.match(native,/octagon-hq:war-room-access-change/,'Native navigation must update from the owner event rather than a retry path.');
assert.doesNotMatch(native,/octagon_access_status|UFC_PLAY_PROFILE\?\.resolve|UFC_APP_PROFILE\?\.resolve/,'Native navigation must not become a second permission owner.');

console.log(JSON.stringify({
  passed:true,
  responsibility:'War Room permission surfaces',
  owner:'assets/js/octagon-access-panel.js',
  states:['locked:hidden','invite:actionable','owner:actionable'],
  consumers:['app shell','Home dashboard','native navigation'],
  preserved:['single startup access attempt','identity readiness handoff','realtime refresh','visibility and online recovery','60-second server poll','Cody-only management actions']
},null,2));

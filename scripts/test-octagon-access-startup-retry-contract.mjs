import assert from 'node:assert/strict';
import fs from 'node:fs';

// Permanent Phase 4 proof: synchronous board mount and readiness events replace repeated access retries.
const access=fs.readFileSync('assets/js/octagon-access-panel.js','utf8');
const board=fs.readFileSync('assets/js/octagon-message-board.js','utf8');
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
assert.match(access,/octagon-access-panel-20260721c-single-startup-access/,'Corrected access runtime version is missing.');
assert.doesNotMatch(access,/\[0,250,900,2600,5000\]/,'The five access-status startup retries remain.');
assert.match(start[1],/installStyles\(\);[\s\S]*ensurePanel\(\);[\s\S]*void checkCurrentAccess\(\);/,'One immediate access shell/status attempt must remain.');
assert.match(start[1],/ufc-play-profile-ready[\s\S]*ufc-app-profile-updated[\s\S]*ufc-canonical-group-ready/,'Identity readiness events must remain.');
assert.match(start[1],/passiveIdentity\(event\.detail\);[\s\S]*scheduleAccessCheck\(60\);/,'Readiness events must retain one access-status handoff.');
assert.match(start[1],/visibilitychange[\s\S]*scheduleAccessCheck\(80\)/,'Visibility access verification must remain.');
assert.match(start[1],/window\.addEventListener\('online',[\s\S]*scheduleAccessCheck\(100\)/,'Online access verification must remain.');
assert.match(start[1],/setInterval\(\(\)=>\{[\s\S]*if\(!document\.hidden\)checkCurrentAccess\(\);[\s\S]*\},60000\)/,'The separate 60-second server verification poll changed.');
assert.match(access,/channel\.on\('broadcast',\{event:'access-change'\}[\s\S]*scheduleAccessCheck\(80\)/,'Realtime access-change verification must remain.');
assert.match(access,/octagon_admin_access_roster[\s\S]*octagon_admin_set_access/,'Cody-only roster and toggle ownership must remain.');

console.log(JSON.stringify({passed:true,responsibility:'War Room access startup status retries',removed:[250,900,2600,5000],preserved:['one immediate panel/status attempt','synchronous board mount order','identity readiness refresh','realtime refresh','visibility and online recovery','60-second server poll','Cody-only management actions']},null,2));

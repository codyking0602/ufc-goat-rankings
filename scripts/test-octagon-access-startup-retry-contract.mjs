import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync('assets/js/octagon-access-panel.js','utf8');
const start=source.match(/function start\(\)\{([\s\S]*?)\n  \}\n\n  window\.UFC_OCTAGON_ACCESS/);
const realtime=source.match(/async function ensureAccessRealtime[\s\S]*?\n  \}/);

assert(start,'War Room access startup body could not be located.');
assert(realtime,'War Room access realtime boundary could not be located.');
assert.match(source,/octagon-access-panel-20260721c-single-startup-access-check/,'Corrected access runtime version is missing.');
assert.doesNotMatch(source,/\[0,250,900,2600,5000\]/,'The five access startup checks remain.');
assert.match(start[1],/installStyles\(\);[\s\S]*ensurePanel\(\);[\s\S]*void checkCurrentAccess\(\);/,'One immediate panel/access attempt must remain.');
assert.match(start[1],/ufc-play-profile-ready[\s\S]*ufc-app-profile-updated[\s\S]*ufc-canonical-group-ready/,'Identity readiness events must remain.');
assert.match(start[1],/passiveIdentity\(event\.detail\);[\s\S]*scheduleAccessCheck\(60\);/,'Identity readiness must still schedule one access check.');
assert.match(start[1],/visibilitychange[\s\S]*scheduleAccessCheck\(80\)/,'Visibility recovery must remain.');
assert.match(start[1],/window\.addEventListener\('online',[\s\S]*scheduleAccessCheck\(100\)/,'Online recovery must remain.');
assert.match(start[1],/setInterval\(\(\)=>\{[\s\S]*if\(!document\.hidden\)checkCurrentAccess\(\);[\s\S]*\},60000\)/,'The separate 60-second access poll changed.');
assert.match(realtime[0],/channel\.on\('broadcast',\{event:'access-change'\}[\s\S]*scheduleAccessCheck\(80\)/,'Realtime access synchronization changed.');
assert.match(source,/client\.rpc\('octagon_admin_access_roster'/,'Cody roster management must remain.');
assert.match(source,/client\.rpc\('octagon_admin_set_access'/,'Cody access toggles must remain.');

console.log(JSON.stringify({passed:true,responsibility:'War Room access startup retries',removed:[250,900,2600,5000],preserved:['one immediate panel/access attempt','identity readiness','realtime access refresh','visibility and online recovery','60-second access poll','Cody roster and toggle actions']},null,2));

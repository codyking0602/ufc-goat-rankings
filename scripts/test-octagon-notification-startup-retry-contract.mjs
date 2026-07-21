import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync('assets/js/octagon-notifications.js','utf8');
const start=source.match(/function start\(\)\{([\s\S]*?)\n  \}\n\n  window\.UFC_OCTAGON_NOTIFICATIONS/);
const events=source.match(/function bindEvents\(\)\{([\s\S]*?)\n  \}\n\n  function start/);
const deepLink=source.match(/function openRequestedBoard\(\)\{([\s\S]*?)\n  \}\n\n  function bindEvents/);

assert(start,'War Room notification startup body could not be located.');
assert(events,'War Room notification event boundary could not be located.');
assert(deepLink,'War Room notification deep-link boundary could not be located.');
assert.match(source,/octagon-notifications-20260721c-single-startup-status/,'Corrected notification runtime version is missing.');
assert.doesNotMatch(source,/\[0,180,700,1800,4200\]/,'The five notification startup status retries remain.');
assert.match(start[1],/ensureBadge\(\);[\s\S]*ensureBoardExtras\(\);[\s\S]*void refreshStatus\(\);/,'One immediate shell/status attempt must remain.');
assert.match(start[1],/setInterval\(\(\)=>\{[\s\S]*if\(!document\.hidden\)refreshStatus\(\);[\s\S]*\},30000\)/,'The separate 30-second status poll changed.');
assert.match(start[1],/setInterval\(\(\)=>\{ensureBadge\(\);ensureBoardExtras\(\);\},3000\)/,'The separate 3-second local DOM maintenance changed.');
assert.match(events[1],/ufc-play-profile-ready[\s\S]*ufc-app-profile-updated[\s\S]*ufc-canonical-group-ready/,'Identity readiness events must remain.');
assert.match(events[1],/passiveIdentity\(event\.detail\);[\s\S]*scheduleRefresh\(70\);/,'Identity readiness must still schedule one status refresh.');
assert.match(events[1],/visibilitychange[\s\S]*scheduleRefresh\(80\)/,'Visibility recovery must remain.');
assert.match(events[1],/window\.addEventListener\('online',[\s\S]*scheduleRefresh\(100\)/,'Online recovery must remain.');
assert.match(deepLink[1],/setInterval\(async\(\)=>[\s\S]*refreshStatus\(\)[\s\S]*attempts>=16[\s\S]*\},350\)/,'Direct-link opening retries must remain bounded and separate.');
assert.match(source,/channel\.on\('broadcast',\{event:'activity-change'\}[\s\S]*scheduleRefresh\(80\)/,'Realtime activity refresh must remain.');

console.log(JSON.stringify({passed:true,responsibility:'War Room notification startup status retries',removed:[180,700,1800,4200],preserved:['one immediate shell/status attempt','identity readiness refresh','direct-link retry','realtime refresh','visibility and online recovery','30-second status poll','3-second DOM maintenance']},null,2));

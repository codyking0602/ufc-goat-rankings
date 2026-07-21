import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const source=read('assets/js/native-app-shell.js');
const index=read('index.html');
const challenges=read('assets/js/profile-challenges.js');
const notifications=read('assets/js/octagon-notifications.js');
const loaded=[...index.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(match=>match[1].split('?')[0]);
const shellPosition=loaded.indexOf('assets/js/octagon-hq-shell.js');
const nativePosition=loaded.indexOf('assets/js/native-app-shell.js');
const start=source.match(/function start\(\)\{([\s\S]*?)\n  \}\n\n  window\.UFC_NATIVE_APP_SHELL/);

assert(shellPosition>=0&&nativePosition>shellPosition,'The native shell must load after the canonical route owner.');
assert(start,'Native shell startup body could not be located.');
assert.match(source,/native-app-shell-20260721c-no-delayed-startup-resync/,'The corrected native-shell runtime version is missing.');
assert.doesNotMatch(source,/\[80,260,800,1800,4200\]/,'The five unconditional startup resynchronization passes remain.');
for(const call of ['ensureBottomNav','ensureAskAction','ensurePullIndicator','syncActive','syncBadges'])assert.match(start[1],new RegExp(`\\b${call}\\(\\);`),`Initial ${call} work was removed.`);
assert.match(start[1],/bindEvents\(\);[\s\S]*observe\(\);/,'Late owner events and targeted observation must remain bound.');
assert.match(start[1],/setInterval\(\(\)=>\{if\(!document\.hidden\)syncBadges\(\);\},10000\)/,'The separate live badge poll must remain.');
assert.match(source,/octagon-hq:view-change[\s\S]*syncActive[\s\S]*syncBadges/,'Canonical route events no longer synchronize native state.');
assert.match(source,/#picksProgress[\s\S]*data-octagon-unread-badge[\s\S]*data-profile-challenge-inbox/,'Targeted late badge observation was removed.');
assert.match(challenges,/ufc-profile-challenges-updated/,'The challenge owner no longer publishes unread updates.');
assert.match(notifications,/ensureBadge\(\)[\s\S]*refreshStatus\(\)/,'The notification owner no longer publishes its unread badge DOM state.');

console.log(JSON.stringify({passed:true,responsibility:'native shell delayed startup resynchronization',removed:[80,260,800,1800,4200],preserved:['one initial component/route/badge synchronization','owner events','targeted observation','visibility recovery','10-second live badge poll']},null,2));

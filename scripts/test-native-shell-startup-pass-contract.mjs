import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const index=read('index.html');
const native=read('assets/js/native-app-shell.js');
const access=read('assets/js/octagon-access-panel.js');
const loaded=[...index.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(match=>match[1].split('?')[0]);
const accessPosition=loaded.indexOf('assets/js/octagon-access-panel.js');
const nativePosition=loaded.indexOf('assets/js/native-app-shell.js');

assert.match(index,/<header class="hero">/,'The static hero prerequisite must remain in the production shell.');
assert(accessPosition>=0&&nativePosition>accessPosition,'The access owner must load before the native presentation consumer.');
assert.match(native,/function start\(\)\{[\s\S]*ensureBottomNav\(\);[\s\S]*ensureAskAction\(\);[\s\S]*ensurePullIndicator\(\);[\s\S]*syncActive\(\);[\s\S]*syncBadges\(\);/,'The native shell must retain one immediate deterministic installation and synchronization pass.');
assert.doesNotMatch(native,/\[80,260,800,1800,4200\]/,'The five unconditional startup resynchronization passes remain.');
assert.doesNotMatch(native,/forEach\(delay=>window\.setTimeout\(\(\)=>\{ensureAskAction\(\);syncActive\(\);syncBadges\(\);\},delay\)\)/,'A renamed native startup retry loop remains.');
assert.match(native,/octagon-hq:war-room-access-change[\s\S]*?syncActive\(currentDestination\(\)\)/,'Native War Room access mirroring must be event-driven.');
assert.match(access,/beforeDisabled!==button\.disabled\|\|beforeAccess!==button\.dataset\.betaAccess/,'The access owner must suppress unchanged access publications.');
assert.match(access,/new CustomEvent\('octagon-hq:war-room-access-change',\{detail:\{allowed:Boolean\(allowed\)\}\}\)/,'The access owner must publish the updated desktop-tab state.');
assert.match(native,/ufc-profile-challenges-updated/,'Profile challenge badge updates must remain event-driven.');
assert.match(native,/#picksProgress,\.app-profile-chip,\[data-octagon-unread-badge\]/,'Picks, profile, and War Room badge mutation coverage must remain.');
assert.match(native,/visibilitychange[\s\S]*?syncBadges\(\);syncActive\(\);/,'Foreground recovery must remain.');
assert.match(native,/setInterval\(\(\)=>\{if\(!document\.hidden\)syncBadges\(\);\},10000\)/,'The separate live badge freshness poll must remain.');
assert.match(native,/resize[\s\S]*?ensureAskAction\(\);syncActive\(\);/,'Ask/action layout recovery must remain resize-driven.');

console.log(JSON.stringify({passed:true,responsibility:'native shell startup resynchronization',removed:['80 ms pass','260 ms pass','800 ms pass','1800 ms pass','4200 ms pass'],replacement:'explicit War Room access-change event',preserved:['one immediate install/sync','route events','badge source events and observer','resize/orientation','visibility recovery','10-second badge poll']},null,2));

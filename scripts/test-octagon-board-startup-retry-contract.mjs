import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync('assets/js/octagon-message-board.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const start=source.match(/function start\(\)\{([\s\S]*?)\n  \}\n\n  window\.addEventListener\('ufc-play-profile-ready'/);
const bindTab=source.match(/function bindTab\(\)\{([\s\S]*?)\n  \}\n\n  function bindNavigation/);
const bindNavigation=source.match(/function bindNavigation\(\)\{([\s\S]*?)\n  \}\n\n  function start/);
const scriptMatch=index.match(/<script\b[^>]*\bsrc=["'][^"']*assets\/js\/octagon-message-board\.js[^"']*["'][^>]*>/i);
const rootMatch=index.match(/id=["']octagon["']/i);
const tabMatch=index.match(/data-octagon-beta-tab/i);

assert(start,'War Room board startup body could not be located.');
assert(bindTab,'War Room beta-tab binding boundary could not be located.');
assert(bindNavigation,'War Room navigation lifecycle boundary could not be located.');
assert(scriptMatch&&rootMatch&&tabMatch,'The production shell must contain the Octagon root, beta tab, and board script.');
assert(rootMatch.index<scriptMatch.index,'The static Octagon root must exist before the board owner loads.');
assert(tabMatch.index<scriptMatch.index,'The static War Room beta tab must exist before the board owner loads.');
assert.match(source,/octagon-message-board-20260721e-single-startup-mount-bind/,'Corrected message-board runtime version is missing.');
assert.doesNotMatch(source,/\[50,220,850,2200\]/,'The four delayed board mount/bind retries remain.');
assert.match(start[1],/installStyles\(\);[\s\S]*mount\(\);[\s\S]*bindTab\(\);[\s\S]*bindNavigation\(\);/,'One synchronous board mount/tab/navigation bind must remain.');
assert.match(start[1],/if\(root\(\)\?\.classList\.contains\('active-view'\)\)load\(\);/,'Active War Room startup loading changed.');
assert.match(bindTab[1],/button\.dataset\.octagonBoardBound='true'/,'The beta tab must retain its one-time binding marker.');
assert.match(bindTab[1],/button\.addEventListener\('click',[\s\S]*await load\(\);[\s\S]*await syncRealtime\(\);/,'Beta-tab entry must retain board loading and realtime synchronization.');
assert.match(bindNavigation[1],/visibilitychange[\s\S]*if\(boardActive\(\)\)await load\(state\.weekStart,\{silent:true\}\)/,'Visible active-board recovery changed.');
assert.match(bindNavigation[1],/window\.addEventListener\('online',[\s\S]*if\(boardActive\(\)\)await load\(state\.weekStart,\{silent:true\}\)/,'Online active-board recovery changed.');
assert.match(source,/window\.addEventListener\('ufc-play-profile-ready',[\s\S]*if\(root\(\)\?\.classList\.contains\('active-view'\)\)load\(\);/,'Canonical identity readiness loading changed.');
assert.match(source,/client\.rpc\('octagon_snapshot'/,'Canonical board snapshot ownership changed.');
assert.match(source,/channel\.on\('broadcast',\{event:'board-change'\}/,'Board realtime ownership changed.');

console.log(JSON.stringify({passed:true,responsibility:'War Room board delayed startup mount/bind retries',removed:[50,220,850,2200],preserved:['one synchronous mount/bind','static root and beta-tab prerequisite','active startup loading','identity readiness loading','tab entry loading','visibility and online recovery','realtime and snapshot ownership']},null,2));

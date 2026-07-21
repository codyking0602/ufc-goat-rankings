import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const index=read('index.html');
const early=read('assets/js/fresh-home-route-bootstrap.js');
const shell=read('assets/js/octagon-hq-shell.js');
const picks=read('assets/js/picks.js');
const launch=read('assets/js/fresh-home-launch.js');

const localPaths=[...index.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)]
  .map(match=>match[1].split('?')[0]);
const position=source=>localPaths.indexOf(source);

const earlyPath='assets/js/fresh-home-route-bootstrap.js';
const shellPath='assets/js/octagon-hq-shell.js';
const picksPath='assets/js/picks.js';
const launchPath='assets/js/fresh-home-launch.js';

assert(position(earlyPath)>=0,'The early route bootstrap must remain production-loaded.');
assert(position(shellPath)>position(earlyPath),'The canonical shell must load after early route normalization.');
assert(position(picksPath)>position(shellPath),'Picks must initialize only after the canonical shell owns the primary route.');
assert(position(launchPath)>position(picksPath),'Fresh launch must remain a subordinate late continuation layer.');

assert(early.includes("url.hash='home'"),'The early bootstrap must keep ordinary startup URL normalization.');
assert.equal(early.includes('activateDestination('),false,'The early bootstrap must not activate a primary destination.');
assert(shell.includes('showView(initialView'),'The canonical shell must retain the one initial route activation.');
assert(shell.includes("let currentView=''"),'The canonical shell must retain exact-view activation state.');
assert(shell.includes("if(currentView===view&&target?.classList.contains('active-view'))"),'The canonical shell must coalesce an already-active exact view.');
assert(shell.includes('get currentDestination(){return currentDestination;}'),'The canonical shell must publish its current destination for passive route handoffs.');
assert.equal(picks.includes('UFC_APP_SHELL'),false,'Picks must not become a direct primary-route owner.');
assert.equal(picks.includes('UFC_PRODUCT_ARCHITECTURE'),false,'Picks must not invoke the compatibility route owner directly.');

const helper=launch.match(/function activateDestinationOnce\(destination\)\{([\s\S]*?)\n  \}/);
assert(helper,'Fresh launch must use one subordinate route-handoff helper.');
assert(helper[1].includes('window.UFC_APP_SHELL||window.UFC_PRODUCT_ARCHITECTURE||null'),'Fresh launch must delegate route activation to the canonical owner.');
assert(helper[1].includes('if(owner.currentDestination===destination)return false;'),'Fresh launch must not reactivate the destination already selected by the canonical shell.');
assert.equal((helper[1].match(/activateDestination\(destination\)/g)||[]).length,1,'The subordinate handoff must contain exactly one canonical activation call.');

for(const [name,destination] of [['activatePicks','picks'],['activateHome','home']]){
  const boundary=launch.match(new RegExp(`function ${name}\\(source='startup'\\)\\{([\\s\\S]*?)\\n  \\}`));
  assert(boundary,`${name} boundary could not be identified.`);
  assert(boundary[1].includes(`activateDestinationOnce('${destination}')`),`${name} must use the deduplicated canonical handoff.`);
  assert.equal(boundary[1].includes('UFC_APP_SHELL?.activateDestination'),false,`${name} must not directly compete with the canonical shell.`);
  assert.equal(boundary[1].includes('UFC_PRODUCT_ARCHITECTURE?.activateDestination'),false,`${name} must not invoke a compatibility route owner directly.`);
}

assert.equal((launch.match(/activateDestinationOnce\('home'\)/g)||[]).length,1,'Home continuation must have exactly one route handoff.');
assert.equal((launch.match(/activateDestinationOnce\('picks'\)/g)||[]).length,1,'Picks continuation must have exactly one route handoff.');
assert(launch.includes("if(picksContinuation)activatePicks("),'Fresh launch must preserve Picks continuation recovery.');
assert(launch.includes("else if(!explicitDeepLink)activateHome('startup')"),'Fresh launch must preserve ordinary Home normalization.');

console.log(JSON.stringify({
  passed:true,
  owner:shellPath,
  consumers:[picksPath,launchPath],
  earlyPosition:position(earlyPath),
  ownerPosition:position(shellPath),
  picksPosition:position(picksPath),
  subordinatePosition:position(launchPath),
  sameViewActivationCoalesced:true,
  sameDestinationHandoffBlocked:true,
  bareInviteRecoveryPreserved:true
},null,2));

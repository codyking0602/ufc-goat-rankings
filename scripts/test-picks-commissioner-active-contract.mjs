import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Commissioner network work is allowed only after Picks is active and its local card is mounted.
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=fs.readFileSync(path.join(root,'assets/js/picks-commissioner.js'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const loaded=[...index.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(match=>match[1].split('?')[0]);
const shellPosition=loaded.indexOf('assets/js/octagon-hq-shell.js');
const commissionerPosition=loaded.indexOf('assets/js/picks-commissioner.js');
const start=source.match(/function start\(\)\{([\s\S]*?)\n  \}\n\n  if\(document\.readyState/);

assert(shellPosition>=0,'The canonical shell must remain production-loaded.');
assert(commissionerPosition>shellPosition,'Commissioner refresh gating must load after the canonical route owner.');
assert(start,'Commissioner startup body could not be located.');
assert.match(source,/function picksActive\(\)/,'Commissioner refresh must retain one visible-destination predicate.');
assert.match(source,/window\.UFC_APP_SHELL\?\.currentDestination/,'The active predicate must prefer the canonical shell destination.');
assert.match(source,/classList\.contains\('active-view'\)/,'The active predicate must retain direct/deferred Picks DOM fallback.');
assert.doesNotMatch(start[1],/^\s*refresh\(\);/m,'Home startup must not unconditionally request commissioner state.');
assert.match(start[1],/if\(picksActive\(\) && document\.getElementById\('picksCommissionerCard'\)\) refresh\(\);/,'Direct Picks startup must wait for the mounted commissioner card.');
assert.match(start[1],/octagon-hq:view-change[\s\S]*destination!=='picks'[\s\S]*return[\s\S]*ensureCard\(\)[\s\S]*picksCommissionerCard[\s\S]*refresh\(\)/,'Entering Picks must mount the local card before requesting commissioner state.');
assert.match(start[1],/!hadCard[\s\S]*scheduleRefresh\(\)/,'Late Picks card creation must retain one bounded refresh handoff.');
assert.match(start[1],/setInterval\(\(\)=>\{ if\(picksActive\(\)\) refresh\(\); \},45000\)/,'The existing freshness poll must be gated to active Picks.');
assert.doesNotMatch(start[1],/MutationObserver\(\(\)=>\{[\s\S]*ensureCard\(\);[\s\S]*setTimeout\(\(\)=>refresh\(\),300\)/,'Ordinary hidden Picks mutations must not schedule commissioner RPCs.');

console.log(JSON.stringify({passed:true,responsibility:'Picks commissioner snapshot activation',removed:['Home startup RPC','hidden Picks mutation refresh','hidden 45-second polling'],preserved:['direct Picks startup after card mount','route entry after card mount','late card mount','active freshness polling']},null,2));

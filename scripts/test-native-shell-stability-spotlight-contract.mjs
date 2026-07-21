import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const index=read('index.html');
const home=read('assets/js/home-dashboard.js');
const stability=read('assets/js/native-app-shell-stability.js');

const loaded=[...index.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(match=>match[1].split('?')[0]);
const homePath='assets/js/home-dashboard.js';
const stabilityPath='assets/js/native-app-shell-stability.js';
const homePosition=loaded.indexOf(homePath);
const stabilityPosition=loaded.indexOf(stabilityPath);

assert(homePosition>=0,'The canonical Home Dashboard owner must remain production-loaded.');
assert(stabilityPosition>homePosition,'The native stability layer must remain subordinate to Home Dashboard load order.');
assert.doesNotMatch(stability,/function\s+repairSpotlight\s*\(/,'The stability layer must not retain an independent Ranking Spotlight renderer.');
assert.doesNotMatch(stability,/repairSpotlight|home-spotlight-loading|ufc-scoring-pipeline-ready|ufc-production-ranking-ready/,'The retired Spotlight repair or triggers returned.');
assert.match(home,/function\s+spotlight\s*\(/,'Home Dashboard must retain Ranking Spotlight selection ownership.');
assert.match(home,/if\(!productionReady\(\)\)return null/,'Home Dashboard must retain its production-readiness boundary.');
assert.match(home,/home-spotlight-loading/,'Home Dashboard must retain its own loading placeholder.');
assert.match(home,/ufc-scoring-pipeline-ready/,'Home Dashboard must retain scoring-readiness recovery.');
assert.match(home,/ufc-production-ranking-ready/,'Home Dashboard must retain production-ranking recovery.');
assert.match(home,/octagon-hq:view-change/,'Home Dashboard must retain route-driven rendering.');
assert.match(home,/visibilitychange/,'Home Dashboard must retain foreground recovery.');
assert.match(home,/markup===lastMarkup/,'Home Dashboard must retain stable duplicate-render suppression.');
assert.match(stability,/closeFighterProfile/,'Native destination profile dismissal must remain pending its separate audit.');

console.log(JSON.stringify({passed:true,retiredBehavior:'native Ranking Spotlight DOM repair',canonicalOwner:homePath,subordinateLayer:stabilityPath,homePosition,stabilityPosition,preserved:['native destination profile dismissal']},null,2));

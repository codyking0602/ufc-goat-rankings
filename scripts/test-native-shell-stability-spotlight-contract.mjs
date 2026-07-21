import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const index=read('index.html');
const home=read('assets/js/home-dashboard.js');
const stability=read('assets/js/native-app-shell-stability.js');

const loaded=[...index.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)]
  .map(match=>match[1].split('?')[0]);
const homePath='assets/js/home-dashboard.js';
const stabilityPath='assets/js/native-app-shell-stability.js';
const homePosition=loaded.indexOf(homePath);
const stabilityPosition=loaded.indexOf(stabilityPath);

assert(homePosition>=0,'The canonical Home Dashboard owner must remain production-loaded.');
assert(stabilityPosition>homePosition,'The native stability layer must remain subordinate to Home Dashboard load order.');

assert.doesNotMatch(stability,/function\s+repairSpotlight\s*\(/,'The stability layer must not retain an independent Ranking Spotlight renderer.');
assert.doesNotMatch(stability,/repairSpotlight/,'The retired Ranking Spotlight repair must not remain callable or exported.');
assert.doesNotMatch(stability,/home-spotlight-loading/,'The stability observer must not target the canonical owner’s loading placeholder.');
assert.doesNotMatch(stability,/ufc-scoring-pipeline-ready|ufc-production-ranking-ready/,'Ranking readiness must be consumed only by the canonical Home owner.');
assert.doesNotMatch(stability,/closest\?\.\('#drawer,#home/,'The indefinite stability observer must not wake for arbitrary Home mutations.');

assert.match(home,/function\s+spotlight\s*\(/,'Home Dashboard must retain Ranking Spotlight selection ownership.');
assert.match(home,/if\(!productionReady\(\)\)return null/,'Home Dashboard must retain its production-readiness boundary.');
assert.match(home,/home-spotlight-loading/,'Home Dashboard must retain its own loading placeholder.');
assert.match(home,/ufc-scoring-pipeline-ready/,'Home Dashboard must retain scoring-readiness recovery.');
assert.match(home,/ufc-production-ranking-ready/,'Home Dashboard must retain production-ranking recovery.');
assert.match(home,/octagon-hq:view-change/,'Home Dashboard must retain route-driven rendering.');
assert.match(home,/visibilitychange/,'Home Dashboard must retain foreground recovery.');
assert.match(home,/markup===lastMarkup/,'Home Dashboard must retain stable duplicate-render suppression.');

for(const preserved of ['normalizeWhatsNew','syncDrawerState','closeFighterProfile','manualRefreshControl','octagon-hq:soft-refresh','[0,80,240,700,1600,3600]']){
  assert(stability.includes(preserved),`Legitimate stability recovery changed unexpectedly: ${preserved}`);
}

console.log(JSON.stringify({
  passed:true,
  retiredBehavior:'native Ranking Spotlight DOM repair',
  canonicalOwner:homePath,
  subordinateLayer:stabilityPath,
  homePosition,
  stabilityPosition,
  preserved:['drawer state','What’s New normalization','native destination close','delayed startup recovery']
},null,2));

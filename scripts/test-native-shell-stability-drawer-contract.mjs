import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const app=read('assets/js/app.js');
const calculated=read('assets/js/calculated-profile-runtime.js');
const stability=read('assets/js/native-app-shell-stability.js');

assert.match(app,/el\('drawer'\)\.classList\.add\('open'\);\s*el\('drawer'\)\.setAttribute\('aria-hidden','false'\);\s*document\.body\.classList\.add\('fighter-profile-open'\)/s,'Base profile open must own the body lock with drawer state.');
assert.match(calculated,/drawer\?\.classList\.add\('open'\);\s*drawer\?\.setAttribute\('aria-hidden','false'\);\s*document\.body\.classList\.add\('fighter-profile-open'\)/s,'Calculated profile open must own the body lock with drawer state.');
assert.match(app,/closeDrawer'.*classList\.remove\('open'\).*setAttribute\('aria-hidden','true'\).*document\.body\.classList\.remove\('fighter-profile-open'\)/s,'Canonical close must clear drawer and body state together.');
assert.match(app,/if\(e\.target\.id==='drawer'\) el\('closeDrawer'\)\.click\(\)/,'Backdrop close must delegate to the canonical close control.');
assert.match(stability,/function\s+closeFighterProfile\s*\(/,'Native destination dismissal must remain pending its separate audit.');
assert.match(stability,/data-native-destination/,'Native destination dismissal must remain event-driven.');
assert.doesNotMatch(stability,/syncDrawerState|function\s+schedule|MutationObserver|octagon-hq:view-change|octagon-hq:soft-refresh|\[0,80,240,700,1600,3600\]|let observer|let timer/,'The retired drawer synchronization loop or supporting triggers remain.');
assert.doesNotMatch(stability,/classList\.toggle\('fighter-profile-open'/,'The stability layer must not infer body state from drawer state.');

console.log(JSON.stringify({passed:true,retiredBehavior:'native drawer/body synchronization loop',canonicalOpenOwners:['assets/js/app.js','assets/js/calculated-profile-runtime.js'],canonicalCloseOwner:'assets/js/app.js',preserved:['native destination profile dismissal fallback']},null,2));

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const index=read('index.html');
const app=read('assets/js/app.js');
const calculatedProfile=read('assets/js/calculated-profile-runtime.js');
const nativeShell=read('assets/js/native-app-shell.js');
const stability=read('assets/js/native-app-shell-stability.js');
const stabilityCss=read('assets/css/native-app-shell-stability.css');

const drawerMarkup=index.indexOf('<aside id="drawer"');
const stabilityScript=index.indexOf('assets/js/native-app-shell-stability.js');
assert(drawerMarkup>=0,'The canonical fighter drawer must remain static production markup.');
assert(stabilityScript>drawerMarkup,'The stability runtime must load after the static drawer exists.');

assert.match(app,/classList\.add\('open'\).*setAttribute\('aria-hidden','false'\)/s,'The base fighter profile owner must retain drawer open state.');
assert.match(app,/closeDrawer.*classList\.remove\('open'\).*setAttribute\('aria-hidden','true'\)/s,'The base fighter profile owner must retain drawer close state.');
assert.match(calculatedProfile,/drawer\?\.classList\.add\('open'\).*drawer\?\.setAttribute\('aria-hidden','false'\)/s,'The calculated profile owner must retain drawer open state.');
assert.doesNotMatch(app,/fighter-profile-open/,'The base profile owner must not silently become a second mobile body-state owner.');
assert.doesNotMatch(calculatedProfile,/fighter-profile-open/,'The calculated profile owner must not silently become a second mobile body-state owner.');
assert.match(stabilityCss,/body\.fighter-profile-open\{overflow:hidden!important;padding-bottom:0!important\}/,'Mobile profile presentation must retain its body scroll-lock contract.');

assert.match(stability,/function\s+syncDrawerState\s*\(\).*classList\.contains\('open'\).*classList\.toggle\('fighter-profile-open'/s,'The stability runtime must retain the one drawer-to-body presentation mapping.');
assert.match(stability,/observer\.observe\(drawer,\{attributes:true,attributeFilter:\['class','aria-hidden'\]\}\)/,'Drawer synchronization must observe only canonical drawer attributes.');
assert.match(stability,/syncDrawerState\(\);\s*document\.documentElement\.dataset\.nativeAppShellStability/,'Startup must perform one immediate drawer/body synchronization after binding the observer.');
assert.doesNotMatch(stability,/observer\.observe\(document\.body|childList:true|subtree:true|attributeFilter:\['class','hidden','aria-hidden'\]/,'The retired body-wide repair observer must not return.');
assert.doesNotMatch(stability,/octagon-hq:view-change|octagon-hq:soft-refresh|\[0,80,240,700,1600,3600\]/,'Drawer synchronization must not depend on route events or delayed retry passes.');
assert.doesNotMatch(stability,/closest\?\.\('#closeDrawer'\)|setTimeout\(syncDrawerState,0\)/,'The close button must rely on its real drawer mutation rather than a duplicate click continuation.');
assert.doesNotMatch(stability,/UFC_NATIVE_APP_SHELL_STABILITY=\{[^}]*schedule/,'The internal drawer debounce must not remain a public repair API.');

assert.match(nativeShell,/data-native-destination/,'The native shell must retain native destination buttons.');
assert.match(nativeShell,/shell\(\)\?\.activateDestination\?\.\(key\)/,'The native shell must retain canonical route delegation.');
assert.doesNotMatch(nativeShell,/closeDrawer|fighter-profile-open/,'The native shell must not silently become a competing drawer/body owner.');
assert.match(stability,/function\s+closeFighterProfile\s*\(/,'Native destination overlay dismissal must remain present pending its separate audit.');
assert.match(stability,/closest\?\.\('\[data-native-destination\]'\)/,'Native destination overlay dismissal must retain its explicit trigger.');

console.log(JSON.stringify({
  passed:true,
  retainedResponsibility:'drawer open state to mobile body scroll lock',
  narrowedTriggers:['one startup sync','drawer class/aria-hidden observer'],
  retiredTriggers:['body-wide mutation observer','route event listener','soft-refresh listener','six delayed startup retries','close-button continuation','public schedule API'],
  separatePendingResponsibility:'native destination overlay dismissal'
},null,2));

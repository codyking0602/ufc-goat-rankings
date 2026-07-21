import assert from 'node:assert/strict';
import fs from 'node:fs';

const index=fs.readFileSync('index.html','utf8');
const product=fs.readFileSync('assets/js/product-architecture.js','utf8');
const season=fs.readFileSync('assets/js/picks-season-loop.js','utf8');
const boundary=product.match(/function bindSharedProfileAuth\(\)\{([\s\S]*?)\n  \}\n\n  function call\(/);

assert(boundary,'Product shared-profile startup boundary could not be identified.');
assert(boundary[1].includes("window.addEventListener('ufc-play-profile-ready'"),'Product must retain the canonical ready-event handoff.');
assert(boundary[1].includes("window.addEventListener('ufc-app-profile-updated'"),'Product must retain profile-update handoff behavior.');
assert(boundary[1].includes("event.detail?.destination==='picks'"),'Product must retain Picks destination handoff behavior.');
assert(boundary[1].includes('const existing=identityFrom();'),'Product must check for an already-resolved canonical identity before requesting resolution.');
assert(boundary[1].includes('if(existing)handoffSharedProfileToPicks(existing);'),'Cached startup identity must receive exactly one direct compatibility handoff.');
assert(boundary[1].includes('else window.UFC_PLAY_PROFILE?.resolve?.().catch(()=>null);'),'Uncached startup must delegate resolution and rely on canonical readiness publication.');
assert.equal(boundary[1].includes('.then(handoffSharedProfileToPicks)'),false,'Canonical resolve must not feed the same startup handoff through both readiness publication and its returned promise.');
assert.equal((boundary[1].match(/handoffSharedProfileToPicks\(existing\)/g)||[]).length,1,'Cached startup must contain one direct Product handoff.');
assert(product.includes('window.UFCPicksPinAuth?.refresh?.()'),'Product must retain Picks PIN-surface refresh ownership.');

const seasonTag=index.indexOf('assets/js/picks-season-loop.js');
const productTag=index.indexOf('assets/js/product-architecture.js');
assert(seasonTag>=0,'Production manifest must load the Picks season owner.');
assert(productTag>=0,'Production manifest must load Product compatibility.');
assert(seasonTag<productTag,'The Picks season owner must load before Product compatibility.');

const seasonPublication=season.indexOf('window.UFC_PICKS_SEASON_LOOP=');
const seasonStartGate=season.indexOf("if(document.readyState==='loading')");
assert(seasonPublication>=0,'Picks season must publish its public owner API synchronously.');
assert(seasonStartGate>=0,'Picks season startup gate could not be identified.');
assert(seasonPublication<seasonStartGate,'Picks season must publish its API before deferred DOM startup.');

assert.equal(product.includes('PICKS_SEASON_SRC'),false,'Product compatibility must not retain a second Picks season source.');
assert.equal(product.includes('function loadPicksSeason'),false,'Product compatibility must not retain a duplicate Picks season loader.');
assert.equal(product.includes("loadScriptOnce('assets/js/picks-season-loop.js'"),false,'Product compatibility must not dynamically inject the manifest-owned Picks season owner.');
assert.equal(product.includes('loadPicksSeason();'),false,'Product startup must not call a duplicate Picks season loader.');

for(const retained of ['loadConnectivity();','loadPolish();','loadAvatarSync();','loadActivityProfile();','loadFindLeaderRetention();','bindSharedProfileAuth();']){
  assert(product.includes(retained),`Product compatibility must retain ${retained}`);
}

console.log(JSON.stringify({
  passed:true,
  cachedStartupHandoff:'direct-once',
  uncachedStartupHandoff:'canonical-event-once',
  duplicatePromiseHandoff:false,
  picksSeasonOwner:'explicit-manifest-before-product',
  duplicatePicksSeasonLoader:false
},null,2));

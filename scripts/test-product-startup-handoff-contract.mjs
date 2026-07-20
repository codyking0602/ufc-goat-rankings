import assert from 'node:assert/strict';
import fs from 'node:fs';

const product=fs.readFileSync('assets/js/product-architecture.js','utf8');
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

console.log(JSON.stringify({
  passed:true,
  cachedStartupHandoff:'direct-once',
  uncachedStartupHandoff:'canonical-event-once',
  duplicatePromiseHandoff:false
},null,2));

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const index=read('index.html');
const watcher=read('assets/js/app-update-watcher.js');
const stability=read('assets/js/native-app-shell-stability.js');
const loaded=[...index.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(match=>match[1].split('?')[0]);
const watcherPath='assets/js/app-update-watcher.js';
const stabilityPath='assets/js/native-app-shell-stability.js';
const watcherPosition=loaded.indexOf(watcherPath);
const stabilityPosition=loaded.indexOf(stabilityPath);

assert(watcherPosition>=0,'The canonical app update watcher must remain production-loaded.');
assert(stabilityPosition>watcherPosition,'The native stability layer must remain subordinate to the What’s New owner.');
assert.match(watcher,/function\s+installButton\s*\(/,'The app update watcher must retain control-markup ownership.');
assert.match(watcher,/<span data-whats-new-label>NEW<\/span><span id="whatsNewUnread"/,'The canonical owner must create the complete labeled button and badge in one write.');
assert.match(watcher,/function\s+syncUnread\s*\(\).*button\.classList\.toggle\('has-unread'/s,'The app update watcher must retain unread visual-state ownership.');
assert.match(watcher,/window\.addEventListener\('octagon-hq:what-changed-seen',syncUnread\)/,'The canonical owner must retain seen-event synchronization.');
assert.match(watcher,/window\.addEventListener\('storage'.*syncUnread/s,'The canonical owner must retain cross-tab unread synchronization.');
assert.doesNotMatch(stability,/normalizeWhatsNew|whatsNewBtn|whatsNewUnread|manualRefreshControl|data-whats-new-label|NEWNEW|UFC_APP_UPDATE_WATCHER/,'The stability layer must not inspect, rewrite, observe, or resync What’s New markup.');
assert.match(stability,/closeFighterProfile/,'Native destination profile dismissal must remain pending its separate audit.');

console.log(JSON.stringify({passed:true,retiredBehavior:'native What’s New markup normalization',canonicalOwner:watcherPath,subordinateLayer:stabilityPath,watcherPosition,stabilityPosition,preserved:['native destination profile dismissal']},null,2));

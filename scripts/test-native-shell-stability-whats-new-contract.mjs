import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const index=read('index.html');
const watcher=read('assets/js/app-update-watcher.js');
const stability=read('assets/js/native-app-shell-stability.js');

const loaded=[...index.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)]
  .map(match=>match[1].split('?')[0]);
const watcherPath='assets/js/app-update-watcher.js';
const stabilityPath='assets/js/native-app-shell-stability.js';
const watcherPosition=loaded.indexOf(watcherPath);
const stabilityPosition=loaded.indexOf(stabilityPath);

assert(watcherPosition>=0,'The canonical app update watcher must remain production-loaded.');
assert(stabilityPosition>watcherPosition,'The native stability layer must remain subordinate to the What’s New owner.');

assert.match(watcher,/function\s+installButton\s*\(/,'The app update watcher must retain control-markup ownership.');
assert.match(watcher,/<span data-whats-new-label>NEW<\/span><span id=\"whatsNewUnread\"/,'The canonical owner must create the complete labeled What’s New button and unread badge in one write.');
assert.doesNotMatch(watcher,/>NEW\s+<span id=\"whatsNewUnread\"/,'The canonical owner must not emit the historical unlabeled markup that required normalization.');
assert.match(watcher,/function\s+syncUnread\s*\(\).*button\.classList\.toggle\('has-unread'/s,'The app update watcher must retain unread visual-state ownership.');
assert.match(watcher,/badge\.hidden=count===0;badge\.textContent=count>99\?'99\+':String\(count\)/,'The canonical owner must retain badge visibility and count ownership.');
assert.match(watcher,/window\.addEventListener\('octagon-hq:what-changed-seen',syncUnread\)/,'The canonical owner must retain seen-event synchronization.');
assert.match(watcher,/window\.addEventListener\('storage'.*syncUnread/s,'The canonical owner must retain cross-tab unread synchronization.');
assert.match(watcher,/cleanRefreshState\(\);injectStyles\(\);installButton\(\);bindDeferredSupport\(\)/,'The canonical owner must install its own markup during startup.');

assert.doesNotMatch(stability,/normalizeWhatsNew|whatsNewBtn|whatsNewUnread|manualRefreshControl|data-whats-new-label|NEWNEW|UFC_APP_UPDATE_WATCHER/,'The stability layer must not inspect, rewrite, observe, or resync What’s New markup.');
assert.doesNotMatch(stability,/document\.body,\{childList|subtree:true|octagon-hq:view-change|octagon-hq:soft-refresh|\[0,80,240,700,1600,3600\]/,'What’s New retirement must not leave broad observer, route, or delayed retry triggers behind.');
for(const preserved of ['syncDrawerState','closeFighterProfile','fighter-profile-open','observer.observe(drawer','attributeFilter:[\'class\',\'aria-hidden\']']){
  assert(stability.includes(preserved),`Legitimate drawer stability recovery changed unexpectedly: ${preserved}`);
}

function jsFiles(directory){
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{
    const absolute=path.join(directory,entry.name);
    if(entry.isDirectory())return jsFiles(absolute);
    return entry.isFile()&&entry.name.endsWith('.js')?[absolute]:[];
  });
}
const assetRoot=path.join(root,'assets','js');
const normalizationOwners=jsFiles(assetRoot)
  .filter(file=>/\bnormalizeWhatsNew\b|NEWNEW/.test(fs.readFileSync(file,'utf8')))
  .map(file=>path.relative(root,file));
assert.deepEqual(normalizationOwners,[],'A hidden What’s New normalization repair remains in production JavaScript.');

const buttonMarkupOwners=jsFiles(assetRoot)
  .filter(file=>/id=[\\"']whatsNewBtn[\\"']/.test(fs.readFileSync(file,'utf8')))
  .map(file=>path.relative(root,file));
assert.deepEqual(buttonMarkupOwners,[watcherPath],'What’s New button markup has more than one production owner.');

console.log(JSON.stringify({
  passed:true,
  retiredBehavior:'native What’s New markup normalization',
  canonicalOwner:watcherPath,
  subordinateLayer:stabilityPath,
  watcherPosition,
  stabilityPosition,
  preserved:['drawer/body synchronization','native destination close','drawer-only observation']
},null,2));

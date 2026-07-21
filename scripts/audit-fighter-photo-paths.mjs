import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const run=(command,args)=>{
  const result=spawnSync(command,args,{stdio:'inherit',encoding:'utf8'});
  if(result.status!==0)throw new Error(`${command} ${args.join(' ')} failed with ${result.status}`);
};

function replace(path,oldValue,newValue){
  let source=fs.readFileSync(path,'utf8');
  if(!source.includes(oldValue))throw new Error(`Expected source block not found in ${path}`);
  source=source.replace(oldValue,newValue);
  fs.writeFileSync(path,source);
}

replace('assets/js/native-app-shell.js',
"  const VERSION='native-app-shell-20260721b-single-activity-refresh';",
"  const VERSION='native-app-shell-20260721c-event-driven-startup';");

replace('assets/js/native-app-shell.js',
`    window.addEventListener('octagon-hq:view-change',event=>{
      syncActive(event.detail?.destination||currentDestination());
      animateActiveView();
      syncBadges();
    });
    ['ufc-profile-challenges-updated','ufc-profile-challenge-sent','ufc-play-profile-ready','ufc-app-profile-updated','octagon-hq:soft-refresh','octagon-hq:notification-device-change'].forEach(name=>window.addEventListener(name,syncBadges));`,
`    window.addEventListener('octagon-hq:view-change',event=>{
      syncActive(event.detail?.destination||currentDestination());
      animateActiveView();
      syncBadges();
    });
    window.addEventListener('octagon-hq:war-room-access-change',()=>syncActive(currentDestination()));
    ['ufc-profile-challenges-updated','ufc-profile-challenge-sent','ufc-play-profile-ready','ufc-app-profile-updated','octagon-hq:soft-refresh','octagon-hq:notification-device-change'].forEach(name=>window.addEventListener(name,syncBadges));`);

replace('assets/js/native-app-shell.js',
"    [80,260,800,1800,4200].forEach(delay=>window.setTimeout(()=>{ensureAskAction();syncActive();syncBadges();},delay));\n",
'');

replace('assets/js/octagon-access-panel.js',
"  const VERSION='octagon-access-panel-20260721b-passive-identity';",
"  const VERSION='octagon-access-panel-20260721c-native-access-event';");

replace('assets/js/octagon-access-panel.js',
`  function setBetaTabAccess(allowed,member=state.me){
    const button=betaButton();
    if(!button)return false;
    button.disabled=!allowed;
    button.setAttribute('aria-disabled',String(!allowed));
    button.dataset.betaAccess=allowed?'owner':'locked';
    button.title=allowed?'Open The Octagon':'Private Beta · Access not enabled';
    button.textContent='Beta';
    button.setAttribute('aria-label',allowed?'Open The Octagon':'Private Beta · Access not enabled');
    if(member?.display_name)button.dataset.betaMember=text(member.display_name);
    return true;
  }`,
`  function setBetaTabAccess(allowed,member=state.me){
    const button=betaButton();
    if(!button)return false;
    const beforeDisabled=button.disabled;
    const beforeAccess=button.dataset.betaAccess||'';
    button.disabled=!allowed;
    button.setAttribute('aria-disabled',String(!allowed));
    button.dataset.betaAccess=allowed?'owner':'locked';
    button.title=allowed?'Open The Octagon':'Private Beta · Access not enabled';
    button.textContent='Beta';
    button.setAttribute('aria-label',allowed?'Open The Octagon':'Private Beta · Access not enabled');
    if(member?.display_name)button.dataset.betaMember=text(member.display_name);
    if(beforeDisabled!==button.disabled||beforeAccess!==button.dataset.betaAccess){
      window.dispatchEvent(new CustomEvent('octagon-hq:war-room-access-change',{detail:{allowed:Boolean(allowed)}}));
    }
    return true;
  }`);

fs.writeFileSync('scripts/test-native-shell-startup-pass-contract.mjs',`import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const index=read('index.html');
const native=read('assets/js/native-app-shell.js');
const access=read('assets/js/octagon-access-panel.js');
const loaded=[...index.matchAll(/<script\\b[^>]*\\bsrc=["']([^"']+)["'][^>]*>/gi)].map(match=>match[1].split('?')[0]);
const accessPosition=loaded.indexOf('assets/js/octagon-access-panel.js');
const nativePosition=loaded.indexOf('assets/js/native-app-shell.js');

assert.match(index,/<header class="hero">/,'The static hero prerequisite must remain in the production shell.');
assert(accessPosition>=0&&nativePosition>accessPosition,'The access owner must load before the native presentation consumer.');
assert.match(native,/function start\\(\\)\\{[\\s\\S]*ensureBottomNav\\(\\);[\\s\\S]*ensureAskAction\\(\\);[\\s\\S]*ensurePullIndicator\\(\\);[\\s\\S]*syncActive\\(\\);[\\s\\S]*syncBadges\\(\\);/,'The native shell must retain one immediate deterministic installation and synchronization pass.');
assert.doesNotMatch(native,/\\[80,260,800,1800,4200\\]/,'The five unconditional startup resynchronization passes remain.');
assert.doesNotMatch(native,/forEach\\(delay=>window\\.setTimeout\\(\\(\\)=>\\{ensureAskAction\\(\\);syncActive\\(\\);syncBadges\\(\\);\\},delay\\)\\)/,'A renamed native startup retry loop remains.');
assert.match(native,/octagon-hq:war-room-access-change[\\s\\S]*?syncActive\\(currentDestination\\(\\)\\)/,'Native War Room access mirroring must be event-driven.');
assert.match(access,/beforeDisabled!==button\\.disabled\\|\\|beforeAccess!==button\\.dataset\\.betaAccess/,'The access owner must suppress unchanged access publications.');
assert.match(access,/new CustomEvent\\('octagon-hq:war-room-access-change',\\{detail:\\{allowed:Boolean\\(allowed\\)\\}\\}\\)/,'The access owner must publish the updated desktop-tab state.');
assert.match(native,/ufc-profile-challenges-updated/,'Profile challenge badge updates must remain event-driven.');
assert.match(native,/#picksProgress,\\.app-profile-chip,\\[data-octagon-unread-badge\\]/,'Picks, profile, and War Room badge mutation coverage must remain.');
assert.match(native,/visibilitychange[\\s\\S]*?syncBadges\\(\\);syncActive\\(\\);/,'Foreground recovery must remain.');
assert.match(native,/setInterval\\(\\(\\)=>\\{if\\(!document\\.hidden\\)syncBadges\\(\\);\\},10000\\)/,'The separate live badge freshness poll must remain.');
assert.match(native,/resize[\\s\\S]*?ensureAskAction\\(\\);syncActive\\(\\);/,'Ask/action layout recovery must remain resize-driven.');

console.log(JSON.stringify({passed:true,responsibility:'native shell startup resynchronization',removed:['80 ms pass','260 ms pass','800 ms pass','1800 ms pass','4200 ms pass'],replacement:'explicit War Room access-change event',preserved:['one immediate install/sync','route events','badge source events and observer','resize/orientation','visibility recovery','10-second badge poll']},null,2));
`);

fs.writeFileSync('scripts/test-native-shell-startup-pass-owner.mjs',`import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

await import('./test-native-shell-startup-pass-contract.mjs');

const fixtureUrl='http://127.0.0.1:4173/phase-4-native-shell-startup-pass-proof.html';
const reportPath='/tmp/native-shell-startup-pass-owner-report.json';
const report={proof:'native-shell-startup-pass-owner',phase:'launch',snapshots:{}};
const fixture=\`<!doctype html><html><head><meta charset="utf-8"><title>Native startup pass proof</title></head><body>
<header class="hero"><div><h1>Octagon HQ</h1></div></header>
<nav class="tabs"><button data-destination="war-room" aria-disabled="true" disabled>War Room</button></nav>
<main class="shell"><section id="home" class="view active-view"></section><section id="picks" class="view"><div id="picksProgress"><div class="picks-progress-top"><strong>1 / 3</strong></div></div></section></main>
<script>
(function(){
  const counts={selectedWrites:0,disabledWrites:0,badgeWrites:0};
  const proof=window.__NATIVE_STARTUP_PASS_PROOF__={counts,destination:'home',playUnread:0,warUnread:0,intervals:[]};
  const setAttribute=Element.prototype.setAttribute;
  Element.prototype.setAttribute=function(name,value){
    if(this.matches?.('[data-native-destination]')&&name==='aria-selected')counts.selectedWrites+=1;
    if(this.matches?.('[data-native-destination="war-room"]')&&name==='aria-disabled')counts.disabledWrites+=1;
    return setAttribute.call(this,name,value);
  };
  const textContent=Object.getOwnPropertyDescriptor(Node.prototype,'textContent');
  Object.defineProperty(Node.prototype,'textContent',{configurable:true,get(){return textContent.get.call(this);},set(value){if(this.nodeType===1&&this.matches?.('[data-native-badge]'))counts.badgeWrites+=1;return textContent.set.call(this,value);}});
  window.setInterval=(callback,delay)=>{proof.intervals.push({callback,delay});return proof.intervals.length;};
  window.UFC_APP_SHELL={get currentDestination(){return proof.destination;},activateDestination(value){proof.destination=value;document.querySelectorAll('main.shell>.view').forEach(node=>node.classList.toggle('active-view',node.id===value));window.dispatchEvent(new CustomEvent('octagon-hq:view-change',{detail:{destination:value}}));}};
  window.UFC_PROFILE_CHALLENGES={get unreadCount(){return proof.playUnread;}};
  window.UFC_OCTAGON_NOTIFICATIONS={get unread(){return proof.warUnread;},markSeen(){}};
})();
</script>
<script src="/assets/js/native-app-shell.js"></script>
</body></html>\`;

async function snapshot(page){return page.evaluate(()=>({counts:{...window.__NATIVE_STARTUP_PASS_PROOF__.counts},askCount:document.querySelectorAll('[data-native-ask]').length,navCount:document.querySelectorAll('[data-native-bottom-nav]').length,pullCount:document.querySelectorAll('[data-native-pull-refresh]').length,active:[...document.querySelectorAll('[data-native-destination].active')].map(node=>node.dataset.nativeDestination),warDisabled:document.querySelector('[data-native-bottom-nav] [data-native-destination="war-room"]')?.disabled,badges:Object.fromEntries([...document.querySelectorAll('[data-native-badge]')].map(node=>[node.dataset.nativeBadge,node.hidden?'':node.textContent])),version:window.UFC_NATIVE_APP_SHELL?.version||'',intervals:window.__NATIVE_STARTUP_PASS_PROOF__.intervals.map(row=>row.delay)}));}

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.route('**/phase-4-native-shell-startup-pass-proof.html*',route=>route.fulfill({status:200,contentType:'text/html',body:fixture}));
  await page.goto(fixtureUrl,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.UFC_NATIVE_APP_SHELL&&document.querySelector('[data-native-bottom-nav]'),null,{timeout:10000});
  await page.waitForTimeout(120);

  report.phase='single-startup-pass';
  const initial=await snapshot(page);report.snapshots.initial=initial;
  assert.match(initial.version,/event-driven-startup/);
  assert.equal(initial.askCount,1);assert.equal(initial.navCount,1);assert.equal(initial.pullCount,1);
  assert.deepEqual(initial.active,['home']);assert.equal(initial.warDisabled,true);
  assert.deepEqual(initial.intervals,[10000],'Only the separate live badge interval should remain.');
  const baseline={...initial.counts};

  await page.waitForTimeout(4300);
  const delayed=await snapshot(page);report.snapshots.afterRetiredWindow=delayed;
  assert.deepEqual(delayed.counts,baseline,'Unconditional startup resynchronization continued through the retired 4.2-second window.');
  assert.equal(delayed.askCount,1);assert.equal(delayed.navCount,1);assert.equal(delayed.pullCount,1);

  report.phase='late-access-event';
  await page.evaluate(()=>{const source=document.querySelector('nav.tabs [data-destination="war-room"]');source.disabled=false;source.setAttribute('aria-disabled','false');window.dispatchEvent(new CustomEvent('octagon-hq:war-room-access-change',{detail:{allowed:true}}));});
  await page.waitForTimeout(80);
  const access=await snapshot(page);report.snapshots.access=access;
  assert.equal(access.warDisabled,false,'The explicit access event did not update the native War Room button.');
  assert.equal(access.counts.selectedWrites,baseline.selectedWrites+5,'Access publication must perform one native-nav synchronization.');

  report.phase='delayed-badge-sources';
  await page.evaluate(()=>{window.__NATIVE_STARTUP_PASS_PROOF__.playUnread=2;window.dispatchEvent(new CustomEvent('ufc-profile-challenges-updated'));});
  await page.waitForTimeout(80);
  assert.equal((await snapshot(page)).badges.play,'2');
  await page.evaluate(()=>{document.querySelector('#picksProgress strong').textContent='1 / 4';});
  await page.waitForTimeout(80);
  assert.equal((await snapshot(page)).badges.picks,'3');
  await page.evaluate(()=>{window.__NATIVE_STARTUP_PASS_PROOF__.warUnread=5;const badge=document.createElement('span');badge.dataset.octagonUnreadBadge='true';document.querySelector('nav.tabs [data-destination="war-room"]').appendChild(badge);});
  await page.waitForTimeout(80);
  assert.equal((await snapshot(page)).badges['war-room'],'5');

  report.phase='route-and-layout-events';
  await page.evaluate(()=>window.UFC_APP_SHELL.activateDestination('picks'));
  await page.waitForTimeout(80);
  assert.deepEqual((await snapshot(page)).active,['picks']);
  await page.evaluate(()=>{document.querySelector('[data-native-ask]').remove();window.dispatchEvent(new Event('resize'));});
  await page.waitForTimeout(80);
  assert.equal((await snapshot(page)).askCount,1,'Resize recovery did not restore the static Ask action.');

  report.phase='manual-live-badge-poll';
  await page.evaluate(()=>{window.__NATIVE_STARTUP_PASS_PROOF__.playUnread=4;window.__NATIVE_STARTUP_PASS_PROOF__.intervals.find(row=>row.delay===10000).callback();});
  await page.waitForTimeout(80);
  assert.equal((await snapshot(page)).badges.play,'4','The retained live badge freshness poll no longer synchronizes badges.');

  report.phase='complete';report.passed=true;console.log(JSON.stringify(report,null,2));await context.close();
}catch(error){report.passed=false;report.error={name:error?.name||'Error',message:error?.message||String(error),stack:error?.stack||''};fs.writeFileSync(reportPath,JSON.stringify(report,null,2));console.error(JSON.stringify(report,null,2));throw error;}finally{await browser.close();}
`);

const iosPath='scripts/test-ios-standalone-resume-home.mjs';
let ios=fs.readFileSync(iosPath,'utf8');
const marker="await import('./test-picks-commissioner-active-owner.mjs');\n";
if(!ios.includes(marker))throw new Error('iOS suite import marker not found.');
ios=ios.replace(marker,marker+"await import('./test-native-shell-startup-pass-owner.mjs');\n");
fs.writeFileSync(iosPath,ios);

for(const file of ['assets/js/native-app-shell.js','assets/js/octagon-access-panel.js','scripts/test-native-shell-startup-pass-contract.mjs','scripts/test-native-shell-startup-pass-owner.mjs','scripts/test-ios-standalone-resume-home.mjs'])run('node',['--check',file]);
run('git',['checkout','origin/main','--','scripts/audit-fighter-photo-paths.mjs']);
for(const file of ['index.html','assets/data/display-overrides.js','octagon-verdict-knowledge.md'])run('git',['checkout','HEAD','--',file]);
fs.rmSync('node_modules',{recursive:true,force:true});
run('git',['config','user.name','github-actions[bot]']);
run('git',['config','user.email','41898282+github-actions[bot]@users.noreply.github.com']);
run('git',['add','assets/js/native-app-shell.js','assets/js/octagon-access-panel.js','scripts/test-native-shell-startup-pass-contract.mjs','scripts/test-native-shell-startup-pass-owner.mjs','scripts/test-ios-standalone-resume-home.mjs','scripts/audit-fighter-photo-paths.mjs']);
run('git',['commit','-m','Replace native startup retries with access event']);
run('git',['push','origin','HEAD:agent/phase-4-retire-native-shell-startup-passes']);
console.log('Applied and pushed the event-driven native shell startup patch.');

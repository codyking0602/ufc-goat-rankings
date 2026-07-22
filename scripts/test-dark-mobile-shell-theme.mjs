import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {chromium} from 'playwright';

const ROOT=process.cwd();
const PORT=4173;
const BASE=`http://127.0.0.1:${PORT}`;
const index=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('assets/css/app.css','utf8');
const home=fs.readFileSync('assets/css/home-dashboard.css','utf8');
const findLeader=fs.readFileSync('assets/css/find-leader.css','utf8');
const picksMobile=fs.readFileSync('assets/css/picks-mobile-polish.css','utf8');
const registration=fs.readFileSync('assets/js/app-notification-surface-fix.js','utf8');
const serviceWorker=fs.readFileSync('sw.js','utf8');

assert.ok(app.startsWith(':root{--bg:#080808;--panel:#111111;--panel2:#191919;--text:#f5f5f5;--muted:#a3a3a3;--line:#303030;--accent:#d20a0a;--accent2:#ff4d4d;'),'The canonical app palette changed.');
assert.doesNotMatch(home,/#f97316|#fb923c|#facc15|rgba\(249,115,22|background:#fff(?:;|})/i,'Home still contains a retired visible palette declaration.');
assert.doesNotMatch(findLeader,/#f97316|#fb923c|#facc15|#fde68a|#fdba74|#111827|#172033|#101725|#1e293b|#253247/i,'Find the Leader still owns navy, orange, or yellow presentation.');
assert.match(findLeader,/\.find-leader-primary\{[^}]*background:linear-gradient\(135deg,var\(--accent\),var\(--accent2\)\);color:#fff/s,'Find the Leader primary action is not canonical red with white text.');
assert.match(picksMobile,/\.picks-event-hero\{[^}]*linear-gradient\(135deg,var\(--panel2\) 0%,var\(--panel\) 72%\)/s,'Mobile Picks does not own a charcoal upcoming-event surface.');
assert.match(picksMobile,/\.picks-progress-bar i\{background:var\(--accent\)\}/,'Mobile Picks progress does not own a solid UFC-red fill.');
assert.match(serviceWorker,/const VERSION='octagon-hq-sw-20260721g-palette-shell-reset';/,'The current palette worker version is not published.');
assert.match(serviceWorker,/const CACHE_NAME='octagon-hq-static-v16';/,'The current palette worker cache is not published.');
assert.match(serviceWorker,/function isShellPath\(path\)[\s\S]*?\/\\\/(?:index\\\.html)?\$\/i\.test\(path\)/,'The cache owner does not identify stale shell requests.');
assert.match(serviceWorker,/if\(isShellPath\(path\)\|\|FORCE_NETWORK\.test\(path\)\|\|PALETTE_NETWORK_ONLY\.test\(path\)\)continue;/,'Legacy shell HTML can still migrate into the current cache.');
assert.match(serviceWorker,/find-leader\|picks-mobile-polish/,'Visible component palette styles are not network-only.');
assert.match(registration,/register\('sw\.js\?v=octagon-hq-sw-20260721g-palette-shell-reset',\{scope:'\.\/',updateViaCache:'none'\}\)/,'The existing registration owner is not requesting the current worker without HTTP-cache reuse.');
assert.ok(index.includes('assets/css/app.css?v=app-css-20260721c-canonical-black-red')&&index.includes('assets/css/home-dashboard.css?v=home-dashboard-20260721b-visible-black-red')&&index.includes('assets/css/native-app-shell.css?v=native-app-shell-css-20260721c-canonical-black-red'),'Production index is not requesting the canonical shell assets.');

const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json; charset=utf-8','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml'};
const seedHtml='<!doctype html><html><head><meta charset="utf-8"><title>Palette cache seed</title></head><body>seed</body></html>';
const server=http.createServer((request,response)=>{
  const url=new URL(request.url,BASE);
  if(url.pathname==='/palette-seed.html'){
    response.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store','service-worker-allowed':'/'});
    response.end(seedHtml);
    return;
  }
  const relative=decodeURIComponent(url.pathname).replace(/^\/+/, '')||'index.html';
  const file=path.resolve(ROOT,relative);
  if(file!==ROOT&&!file.startsWith(`${ROOT}${path.sep}`)){
    response.writeHead(403);response.end('Forbidden');return;
  }
  let target=file;
  try{if(fs.statSync(target).isDirectory())target=path.join(target,'index.html');}catch(_error){}
  if(!fs.existsSync(target)){
    response.writeHead(404,{'cache-control':'no-store'});response.end('Not found');return;
  }
  response.writeHead(200,{'content-type':MIME[path.extname(target).toLowerCase()]||'application/octet-stream','cache-control':'no-store','service-worker-allowed':'/'});
  fs.createReadStream(target).pipe(response);
});
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(PORT,'127.0.0.1',resolve);});

const supabaseStub=`window.supabase={createClient(){const chain={select(){return chain},insert(){return chain},update(){return chain},upsert(){return chain},delete(){return chain},eq(){return chain},neq(){return chain},in(){return chain},order(){return chain},limit(){return chain},single(){return Promise.resolve({data:null,error:null})},maybeSingle(){return Promise.resolve({data:null,error:null})},then(resolve){return Promise.resolve({data:[],error:null}).then(resolve)}};return{auth:{getSession:async()=>({data:{session:null},error:null}),getUser:async()=>({data:{user:null},error:null}),signInWithOtp:async()=>({data:null,error:null}),signOut:async()=>({error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:()=>chain,channel:()=>({on(){return this},subscribe(){return this}}),removeChannel(){}}}};`;

const browser=await chromium.launch({headless:true});
const pageErrors=[];

async function preparePage(context){
  const page=await context.newPage();
  page.on('pageerror',error=>pageErrors.push(String(error?.message||error)));
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',route=>route.fulfill({status:200,contentType:'text/javascript',body:supabaseStub}));
  return page;
}

async function waitForApp(page){
  await page.waitForSelector('.home-dashboard .home-event',{state:'attached',timeout:60000});
  await page.waitForSelector('.native-bottom-nav .native-nav-button.active',{state:'attached',timeout:60000});
  await page.waitForSelector('.product-header-tools .app-profile-chip',{state:'attached',timeout:60000});
  await page.waitForSelector('#whatsNewBtn',{state:'attached',timeout:60000});
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
}

async function homeSnapshot(page){
  return page.evaluate(()=>{
    const view=selector=>{
      const node=document.querySelector(selector);
      if(!node)return null;
      const style=getComputedStyle(node);
      return{backgroundColor:style.backgroundColor,backgroundImage:style.backgroundImage,color:style.color,borderColor:style.borderColor,display:style.display};
    };
    const links=[...document.querySelectorAll('link[rel="stylesheet"]')].map(node=>new URL(node.href).pathname);
    const stability=[...document.styleSheets].find(sheet=>sheet.href?.includes('native-app-shell-stability.css'));
    let importedPolish='';
    try{importedPolish=stability?.cssRules?.[0]?.styleSheet?.href||'';}catch(_error){}
    const root=getComputedStyle(document.documentElement);
    return{
      tokens:{bg:root.getPropertyValue('--bg').trim(),panel:root.getPropertyValue('--panel').trim(),panel2:root.getPropertyValue('--panel2').trim(),text:root.getPropertyValue('--text').trim(),muted:root.getPropertyValue('--muted').trim(),accent:root.getPropertyValue('--accent').trim(),accent2:root.getPropertyValue('--accent2').trim()},
      links,
      importedPolish,
      dynamicStyleIds:[...document.querySelectorAll('style[id]')].map(node=>node.id).sort(),
      actual:{body:view('body'),header:view('.hero'),title:view('.hero h1'),profile:view('.product-header-tools .app-profile-chip'),refresh:view('#manualRefreshBtn'),update:view('#whatsNewBtn'),event:view('.home-event'),eventTitle:view('.home-event h3'),kicker:view('.home-event .home-dashboard-kicker'),primary:view('.home-daily .home-dashboard-action'),progress:view('.home-event-track i'),activeNav:view('.native-nav-button.active')}
    };
  });
}

async function picksSnapshot(page){
  await page.evaluate(()=>window.UFC_APP_SHELL?.activateDestination?.('picks')||document.querySelector('[data-destination="picks"]')?.click());
  await page.waitForSelector('#picks.active-view .picks-event-hero',{state:'visible',timeout:30000});
  await page.waitForSelector('#picks .picks-progress-bar i',{state:'attached',timeout:30000});
  return page.evaluate(()=>{
    const read=selector=>{const style=getComputedStyle(document.querySelector(selector));return{backgroundColor:style.backgroundColor,backgroundImage:style.backgroundImage,color:style.color,borderColor:style.borderColor};};
    return{event:read('#picks .picks-event-hero'),progressCard:read('#picks .picks-progress-card'),progressTrack:read('#picks .picks-progress-bar'),progressFill:read('#picks .picks-progress-bar i')};
  });
}

async function findLeaderSnapshot(page){
  await page.evaluate(()=>{
    window.UFC_APP_SHELL?.activateDestination?.('play')||document.querySelector('[data-destination="play"]')?.click();
    window.UFC_FIND_LEADER?.open?.();
  });
  await page.waitForSelector('#playFindLeaderPanel:not([hidden]) [data-find-leader-pick]',{state:'attached',timeout:30000});
  await page.evaluate(()=>{
    const leader=window.UFC_FIND_LEADER?.state?.setup?.leaderId;
    document.querySelector(`[data-find-leader-pick="${CSS.escape(String(leader||''))}"]`)?.click();
  });
  await page.waitForSelector('#playFindLeaderPanel .find-leader-primary',{state:'visible',timeout:30000});
  return page.evaluate(()=>{
    const read=selector=>{const style=getComputedStyle(document.querySelector(selector));return{backgroundColor:style.backgroundColor,backgroundImage:style.backgroundImage,color:style.color,borderColor:style.borderColor};};
    return{panel:read('#playFindLeaderPanel .find-leader-results'),primary:read('#playFindLeaderPanel .find-leader-primary'),label:read('#playFindLeaderPanel .find-leader-results>header span')};
  });
}

const forbidden=['rgb(249, 115, 22)','rgb(251, 146, 60)','rgb(250, 204, 21)','rgb(17, 24, 39)','rgb(24, 34, 51)','rgb(23, 32, 51)','rgb(16, 23, 37)','rgb(30, 41, 59)'];
function assertNoRetiredColors(value,label){
  const serialized=JSON.stringify(value);
  forbidden.forEach(color=>assert.ok(!serialized.includes(color),`${label} contains retired ${color}.`));
}
function assertSurface(actual,expected,label){
  assert.equal(actual?.backgroundColor,expected,`${label} is not the expected canonical surface.`);
  assertNoRetiredColors(actual,label);
}
function assertHome(snapshot,label){
  assert.deepEqual(snapshot.tokens,{bg:'#080808',panel:'#111111',panel2:'#191919',text:'#f5f5f5',muted:'#a3a3a3',accent:'#d20a0a',accent2:'#ff4d4d'},`${label} lost canonical tokens.`);
  assert.equal(snapshot.links[0],'/assets/css/app.css',`${label} did not load app.css first.`);
  assert.equal(snapshot.links.at(-1),'/assets/css/native-app-shell-stability.css',`${label} did not retain the production final stylesheet order.`);
  assert.ok(snapshot.importedPolish.includes('/assets/css/product-polish.css'),`${label} did not load the final product-polish import.`);
  assertSurface(snapshot.actual.header,'rgb(17, 17, 17)',`${label} header`);
  assert.equal(snapshot.actual.title.color,'rgb(245, 245, 245)',`${label} title is not light text.`);
  assertSurface(snapshot.actual.profile,'rgb(25, 25, 25)',`${label} profile control`);
  assertSurface(snapshot.actual.refresh,'rgb(25, 25, 25)',`${label} refresh control`);
  assertSurface(snapshot.actual.update,'rgb(25, 25, 25)',`${label} update control`);
  assertSurface(snapshot.actual.event,'rgb(25, 25, 25)',`${label} upcoming-event card`);
  assert.equal(snapshot.actual.eventTitle.color,'rgb(245, 245, 245)',`${label} upcoming-event title is not light text.`);
  assert.equal(snapshot.actual.kicker.color,'rgb(255, 77, 77)',`${label} card label is not the red highlight.`);
  assert.equal(snapshot.actual.primary.backgroundColor,'rgb(210, 10, 10)',`${label} primary action is not UFC red.`);
  assert.equal(snapshot.actual.primary.color,'rgb(255, 255, 255)',`${label} primary action text is not white.`);
  assert.equal(snapshot.actual.progress.backgroundColor,'rgb(210, 10, 10)',`${label} Home progress is not UFC red.`);
  assert.equal(snapshot.actual.activeNav.color,'rgb(255, 77, 77)',`${label} active navigation is not the red highlight.`);
  assertNoRetiredColors(snapshot.actual,label);
}
function assertPicks(snapshot,label){
  assertSurface(snapshot.event,'rgb(25, 25, 25)',`${label} Picks event hero`);
  assertSurface(snapshot.progressCard,'rgb(25, 25, 25)',`${label} Picks progress card`);
  assertSurface(snapshot.progressTrack,'rgb(17, 17, 17)',`${label} Picks progress track`);
  assert.equal(snapshot.progressFill.backgroundColor,'rgb(210, 10, 10)',`${label} Picks progress fill is not UFC red.`);
  assertNoRetiredColors(snapshot,label);
}
function assertFindLeader(snapshot,label){
  assertSurface(snapshot.panel,'rgb(17, 17, 17)',`${label} Find the Leader result panel`);
  assert.ok(snapshot.primary.backgroundImage.includes('rgb(210, 10, 10)')&&snapshot.primary.backgroundImage.includes('rgb(255, 77, 77)'),`${label} Find the Leader CTA is not the canonical red gradient.`);
  assert.equal(snapshot.primary.color,'rgb(255, 255, 255)',`${label} Find the Leader CTA text is not white.`);
  assert.equal(snapshot.label.color,'rgb(255, 77, 77)',`${label} Find the Leader label is not red.`);
  assertNoRetiredColors(snapshot,label);
}

async function exerciseRealApp(page,label,url=`${BASE}/index.html`){
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  await waitForApp(page);
  const initialHome=await homeSnapshot(page);
  assertHome(initialHome,`${label} initial paint`);
  await page.waitForTimeout(2800);
  const finalHome=await homeSnapshot(page);
  assertHome(finalHome,`${label} delayed startup`);
  assert.deepEqual(finalHome.actual,initialHome.actual,`${label} changed the visible palette after startup.`);
  assert.ok(finalHome.dynamicStyleIds.includes('appProfileCss')&&finalHome.dynamicStyleIds.includes('appUpdateWatcherStyles'),`${label} did not execute the real late style injection chain.`);
  const initialPicks=await picksSnapshot(page);
  assertPicks(initialPicks,`${label} Picks initial`);
  await page.waitForTimeout(2400);
  const finalPicks=await picksSnapshot(page);
  assertPicks(finalPicks,`${label} Picks delayed`);
  assert.deepEqual(finalPicks,initialPicks,`${label} Picks palette changed after delayed startup.`);
  const initialFind=await findLeaderSnapshot(page);
  assertFindLeader(initialFind,`${label} Find the Leader initial`);
  await page.waitForTimeout(2400);
  const finalFind=await findLeaderSnapshot(page);
  assertFindLeader(finalFind,`${label} Find the Leader delayed`);
  assert.deepEqual(finalFind,initialFind,`${label} Find the Leader palette changed after delayed startup.`);
  return{initialHome,finalHome,initialPicks,finalPicks,initialFind,finalFind};
}

try{
  const browserContext=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'});
  const browserPage=await preparePage(browserContext);
  const browserProof=await exerciseRealApp(browserPage,'uncontrolled browser');
  await browserContext.close();

  const pwaContext=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'allow'});
  const pwaPage=await preparePage(pwaContext);
  await pwaPage.goto(`${BASE}/palette-seed.html`,{waitUntil:'domcontentloaded'});
  await pwaPage.evaluate(async()=>{
    const legacy=await caches.open('octagon-hq-static-v15');
    await legacy.put('/index.html?legacy-installed=1',new Response('<!doctype html><html><head><title>STALE PALETTE SHELL</title></head><body>stale shell</body></html>',{headers:{'content-type':'text/html'}}));
    await legacy.put('/assets/css/picks-mobile-polish.css?v=picks-mobile-polish-20260718f-event-art',new Response('.picks-event-hero{background:#111827}.picks-progress-bar i{background:#f97316}',{headers:{'content-type':'text/css'}}));
    await navigator.serviceWorker.register('/sw.js?v=octagon-hq-sw-20260721g-palette-shell-reset',{scope:'/',updateViaCache:'none'});
    await navigator.serviceWorker.ready;
    if(!navigator.serviceWorker.controller)await new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true}));
  });
  const pwaProof=await exerciseRealApp(pwaPage,'installed PWA upgrade',`${BASE}/index.html?legacy-installed=1`);
  const workerProof=await pwaPage.evaluate(async()=>{
    const controller=navigator.serviceWorker.controller;
    const version=await new Promise((resolve,reject)=>{
      const timeout=setTimeout(()=>reject(new Error('Timed out waiting for service-worker version.')),5000);
      const handler=event=>{if(event.data?.type!=='OCTAGON_SW_VERSION')return;clearTimeout(timeout);navigator.serviceWorker.removeEventListener('message',handler);resolve(event.data);};
      navigator.serviceWorker.addEventListener('message',handler);
      controller.postMessage({type:'OCTAGON_SW_VERSION'});
    });
    const keys=await caches.keys();
    const urls=[];
    for(const key of keys){for(const request of await (await caches.open(key)).keys())urls.push(request.url);}
    return{controller:controller?.scriptURL||'',version,keys,urls,title:document.title,build:document.querySelector('meta[name="app-build"]')?.content||''};
  });
  assert.ok(workerProof.controller.includes('octagon-hq-sw-20260721g-palette-shell-reset'),'Installed PWA is not controlled by the current worker URL.');
  assert.deepEqual(workerProof.version,{type:'OCTAGON_SW_VERSION',version:'octagon-hq-sw-20260721g-palette-shell-reset',cache:'octagon-hq-static-v16'},'Installed PWA worker identity is wrong.');
  assert.deepEqual(workerProof.keys,['octagon-hq-static-v16'],'Legacy service-worker caches survived activation.');
  assert.ok(!workerProof.urls.some(url=>url.includes('legacy-installed=1')||url.includes('picks-mobile-polish.css')),'Stale shell or palette assets migrated into the current cache.');
  assert.equal(workerProof.title,'Octagon HQ','Installed PWA served the stale cached HTML shell.');
  assert.equal(workerProof.build,'visible-home-palette-20260721b','Installed PWA did not serve the current production index.');
  await pwaContext.close();

  console.log(JSON.stringify({proof:'real-production-black-red-palette',browser:browserProof,pwa:pwaProof,worker:workerProof,pageErrors},null,2));
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}

console.log('Real production mobile palette regression passed.');
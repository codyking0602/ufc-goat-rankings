import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {chromium} from 'playwright';

const ROOT=process.cwd();
const PORT=4173;
const PREFIX='/ufc-goat-rankings';
const ORIGIN=`http://127.0.0.1:${PORT}`;
const BASE=`${ORIGIN}${PREFIX}`;
const INDEX=fs.readFileSync('index.html','utf8');
const SW_VERSION='octagon-hq-sw-20260721g-palette-shell-reset';
const SW_URL_VERSION='octagon-hq-sw-20260720c-picks-runtime-refresh';
const SW_CACHE='octagon-hq-static-v16';
const CSS_ORDER=[...INDEX.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(match=>new URL(match[1],`${BASE}/index.html`).pathname);
const retired=['rgb(249, 115, 22)','rgb(251, 146, 60)','rgb(250, 204, 21)','rgb(17, 24, 39)','rgb(24, 34, 51)','rgb(23, 32, 51)','rgb(16, 23, 37)','rgb(30, 41, 59)'];
const dark=['rgb(8, 8, 8)','rgb(17, 17, 17)','rgb(25, 25, 25)'];

const app=fs.readFileSync('assets/css/app.css','utf8');
const home=fs.readFileSync('assets/css/home-dashboard.css','utf8');
const findLeader=fs.readFileSync('assets/css/find-leader.css','utf8');
const picksMobile=fs.readFileSync('assets/css/picks-mobile-polish.css','utf8');
const registration=fs.readFileSync('assets/js/app-notification-surface-fix.js','utf8');
const worker=fs.readFileSync('sw.js','utf8');
assert.ok(app.startsWith(':root{--bg:#080808;--panel:#111111;--panel2:#191919;--text:#f5f5f5;--muted:#a3a3a3;--line:#303030;--accent:#d20a0a;--accent2:#ff4d4d;'));
assert.doesNotMatch(home,/#f97316|#fb923c|#facc15|rgba\(249,115,22|background:#fff(?:;|})/i);
assert.doesNotMatch(findLeader,/#f97316|#fb923c|#facc15|#fde68a|#fdba74/i);
assert.match(findLeader,/\.find-leader-primary\{[^}]*var\(--accent\)[^}]*var\(--accent2\)[^}]*color:#fff/s);
assert.match(picksMobile,/\.picks-event-hero\{[^}]*var\(--panel2\)[^}]*var\(--panel\)/s);
assert.match(picksMobile,/\.picks-progress-bar i\{background:var\(--accent\)\}/);
assert.ok(worker.includes(`const VERSION='${SW_VERSION}';`)&&worker.includes(`const CACHE_NAME='${SW_CACHE}';`));
assert.ok(worker.includes('function isShellPath(path){')&&worker.includes("return /\\/(?:index\\.html)?$/i.test(path);"));
assert.ok(worker.includes('if(isShellPath(path)||FORCE_NETWORK.test(path)||PALETTE_NETWORK_ONLY.test(path))continue;'));
assert.match(worker,/find-leader\|picks-mobile-polish/);
assert.ok(registration.includes(`register('sw.js?v=${SW_URL_VERSION}',{scope:'./'})`)&&registration.includes('registration.update?.()'));

const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((request,response)=>{
  const url=new URL(request.url,ORIGIN);
  if(url.pathname===`${PREFIX}/seed.html`){response.writeHead(200,{'content-type':'text/html','cache-control':'no-store','service-worker-allowed':`${PREFIX}/`});response.end('<!doctype html><title>seed</title>');return;}
  if(url.pathname!==PREFIX&&!url.pathname.startsWith(`${PREFIX}/`)){response.writeHead(404);response.end();return;}
  const relative=decodeURIComponent(url.pathname.slice(PREFIX.length)).replace(/^\/+/, '')||'index.html';
  let file=path.resolve(ROOT,relative);
  if(file!==ROOT&&!file.startsWith(`${ROOT}${path.sep}`)){response.writeHead(403);response.end();return;}
  try{if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');}catch(_error){}
  if(!fs.existsSync(file)){response.writeHead(404);response.end();return;}
  response.writeHead(200,{'content-type':MIME[path.extname(file).toLowerCase()]||'application/octet-stream','cache-control':'no-store','service-worker-allowed':`${PREFIX}/`});
  fs.createReadStream(file).pipe(response);
});
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(PORT,'127.0.0.1',resolve);});

const stub=`window.supabase={createClient(){const c={select(){return c},insert(){return c},update(){return c},upsert(){return c},delete(){return c},eq(){return c},neq(){return c},in(){return c},order(){return c},limit(){return c},single:async()=>({data:null,error:null}),maybeSingle:async()=>({data:null,error:null}),then(r){return Promise.resolve({data:[],error:null}).then(r)}};return{auth:{getSession:async()=>({data:{session:null},error:null}),getUser:async()=>({data:{user:null},error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:()=>c,rpc:async()=>({data:null,error:null}),channel:()=>({on(){return this},subscribe(){return this}}),removeChannel(){}}}};`;
const browser=await chromium.launch({headless:true});

async function pageFor(context){
  const page=await context.newPage();
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',route=>route.fulfill({status:200,contentType:'text/javascript',body:stub}));
  await page.route(/https:\/\/[^/]+\.supabase\.co\/.*/,route=>route.fulfill({status:200,contentType:'application/json',body:'[]'}));
  return page;
}
async function ready(page){
  await page.waitForSelector('.home-dashboard .home-event',{timeout:60000});
  await page.waitForSelector('.native-bottom-nav .native-nav-button.active',{timeout:60000});
  await page.waitForSelector('.product-header-tools .app-profile-chip',{timeout:60000});
  await page.waitForSelector('#whatsNewBtn',{timeout:60000});
}
async function snapshot(page,screen){
  if(screen==='picks'){
    await page.evaluate(()=>window.UFC_APP_SHELL?.activateDestination?.('picks'));
    await page.waitForSelector('#picks.active-view .picks-progress-bar i',{timeout:30000});
  }
  if(screen==='leader'){
    await page.evaluate(()=>{window.UFC_APP_SHELL?.activateDestination?.('play');window.UFC_FIND_LEADER?.open?.();});
    await page.waitForSelector('#playFindLeaderPanel:not([hidden]) [data-find-leader-pick]',{timeout:30000});
    await page.evaluate(()=>{const id=String(window.UFC_FIND_LEADER?.state?.setup?.leaderId||'');document.querySelector(`[data-find-leader-pick="${CSS.escape(id)}"]`)?.click();});
    await page.waitForSelector('#playFindLeaderPanel .find-leader-primary',{timeout:30000});
  }
  return page.evaluate(({screen})=>{
    const read=selector=>{const node=document.querySelector(selector);if(!node)return null;const s=getComputedStyle(node);return{backgroundColor:s.backgroundColor,backgroundImage:s.backgroundImage,color:s.color,borderColor:s.borderColor};};
    const root=getComputedStyle(document.documentElement);
    if(screen==='home')return{tokens:['--bg','--panel','--panel2','--text','--muted','--accent','--accent2'].map(key=>root.getPropertyValue(key).trim()),links:[...document.querySelectorAll('link[rel="stylesheet"]')].map(node=>({path:new URL(node.href).pathname,loaded:Boolean(node.sheet),disabled:Boolean(node.disabled)})),styles:[...document.querySelectorAll('style[id]')].map(node=>node.id).sort(),values:{header:read('.hero'),title:read('.hero h1'),profile:read('.app-profile-chip'),refresh:read('#manualRefreshBtn'),update:read('#whatsNewBtn'),event:read('.home-event'),eventTitle:read('.home-event h3'),kicker:read('.home-event .home-dashboard-kicker'),primary:read('.home-daily .home-dashboard-action'),progress:read('.home-event-track i'),nav:read('.native-nav-button.active')}};
    if(screen==='picks')return{event:read('#picks .picks-event-hero'),card:read('#picks .picks-progress-card'),track:read('#picks .picks-progress-bar'),fill:read('#picks .picks-progress-bar i')};
    return{panel:read('#playFindLeaderPanel .find-leader-results'),primary:read('#playFindLeaderPanel .find-leader-primary'),label:read('#playFindLeaderPanel .find-leader-results>header span')};
  },{screen});
}
function noRetired(value,label){const text=JSON.stringify(value);retired.forEach(color=>assert.ok(!text.includes(color),`${label}: retired ${color}`));}
function surface(value,label,exact){const text=`${value?.backgroundColor} ${value?.backgroundImage}`;if(exact)assert.equal(value?.backgroundColor,exact,label);else assert.ok(dark.some(color=>text.includes(color)),label);noRetired(value,label);}
function verify(screen,value,label){
  if(screen==='home'){
    assert.deepEqual(value.tokens,['#080808','#111111','#191919','#f5f5f5','#a3a3a3','#d20a0a','#ff4d4d']);
    assert.deepEqual(value.links.map(row=>row.path),CSS_ORDER);assert.ok(value.links.every(row=>row.loaded&&!row.disabled));
    assert.ok(value.styles.includes('appProfileCss')&&value.styles.includes('appUpdateWatcherStyles'));
    surface(value.values.header,`${label} header`,'rgb(17, 17, 17)');surface(value.values.profile,`${label} profile`,'rgb(25, 25, 25)');surface(value.values.refresh,`${label} refresh`,'rgb(25, 25, 25)');surface(value.values.update,`${label} update`,'rgb(25, 25, 25)');surface(value.values.event,`${label} event`,'rgb(25, 25, 25)');
    assert.equal(value.values.title.color,'rgb(245, 245, 245)');assert.equal(value.values.eventTitle.color,'rgb(245, 245, 245)');assert.equal(value.values.kicker.color,'rgb(255, 77, 77)');assert.equal(value.values.primary.backgroundColor,'rgb(210, 10, 10)');assert.equal(value.values.primary.color,'rgb(255, 255, 255)');assert.equal(value.values.progress.backgroundColor,'rgb(210, 10, 10)');assert.equal(value.values.nav.color,'rgb(255, 77, 77)');
  }else if(screen==='picks'){
    surface(value.event,`${label} event`);surface(value.card,`${label} card`,'rgb(25, 25, 25)');surface(value.track,`${label} track`,'rgb(17, 17, 17)');assert.equal(value.fill.backgroundColor,'rgb(210, 10, 10)');
  }else{
    surface(value.panel,`${label} panel`);assert.ok(value.primary.backgroundImage.includes('rgb(210, 10, 10)')&&value.primary.backgroundImage.includes('rgb(255, 77, 77)'));assert.equal(value.primary.color,'rgb(255, 255, 255)');assert.equal(value.label.color,'rgb(255, 77, 77)');
  }
  noRetired(value,label);
}
async function stable(page,screen,label){const initial=await snapshot(page,screen);verify(screen,initial,`${label} initial`);await page.waitForTimeout(2800);const final=await snapshot(page,screen);verify(screen,final,`${label} delayed`);assert.deepEqual(final,initial,`${label} changed after startup`);return{initial,final};}
async function exercise(page,label,url){await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});await ready(page);return{home:await stable(page,'home',`${label} Home`),picks:await stable(page,'picks',`${label} Picks`),leader:await stable(page,'leader',`${label} Find the Leader`)};}

try{
  const normal=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'});
  const normalProof=await exercise(await pageFor(normal),'browser',`${BASE}/index.html`);await normal.close();

  const pwa=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'allow'});
  const page=await pageFor(pwa);await page.goto(`${BASE}/seed.html`);
  await page.evaluate(async({base})=>{const cache=await caches.open('octagon-hq-static-v15');await cache.put(`${base}/index.html?installed=1`,new Response('legacy',{headers:{'content-type':'text/html'}}));await cache.put(`${base}/assets/css/picks-mobile-polish.css?v=old`,new Response('.x{color:#f97316}',{headers:{'content-type':'text/css'}}));},{base:BASE});
  await page.evaluate(({base,prefix,urlVersion})=>{navigator.serviceWorker.register(`${base}/sw.js?v=${urlVersion}`,{scope:`${prefix}/`});},{base:BASE,prefix:PREFIX,urlVersion:SW_URL_VERSION});
  await page.waitForFunction(urlVersion=>navigator.serviceWorker.controller?.scriptURL.includes(urlVersion),SW_URL_VERSION,{timeout:30000});
  const pwaProof=await exercise(page,'installed PWA',`${BASE}/index.html?installed=1`);
  const workerProof=await page.evaluate(async({url})=>{const controller=navigator.serviceWorker.controller;const identity=await new Promise(resolve=>{const handler=event=>{if(event.data?.type!=='OCTAGON_SW_VERSION')return;navigator.serviceWorker.removeEventListener('message',handler);resolve(event.data);};navigator.serviceWorker.addEventListener('message',handler);controller.postMessage({type:'OCTAGON_SW_VERSION'});});const keys=await caches.keys();const urls=[];for(const key of keys)for(const request of await (await caches.open(key)).keys())urls.push(request.url);const cached=await caches.match(url);return{controller:controller.scriptURL,identity,keys,urls,html:cached?await cached.text():'',title:document.title};},{url:`${BASE}/index.html?installed=1`});
  assert.ok(workerProof.controller.includes(SW_URL_VERSION));assert.deepEqual(workerProof.identity,{type:'OCTAGON_SW_VERSION',version:SW_VERSION,cache:SW_CACHE});assert.deepEqual(workerProof.keys.filter(key=>key.startsWith('octagon-hq-static-')),['octagon-hq-static-v16']);assert.ok(!workerProof.urls.some(url=>url.includes('find-leader.css')||url.includes('picks-mobile-polish.css')));assert.notEqual(workerProof.html,'legacy');assert.equal(workerProof.title,'Octagon HQ');await pwa.close();
  console.log(JSON.stringify({proof:'real-production-palette',normal:normalProof,pwa:pwaProof,worker:workerProof},null,2));
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
console.log('Real production palette regression passed.');
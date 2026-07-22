const VERSION='octagon-hq-sw-20260722e-installed-shell-fallback';
const CACHE_NAME='octagon-hq-static-v20';
const LEGACY_PREFIX='octagon-hq-static-';
const SHELL_FALLBACKS=[
  './index.html',
  './assets/css/app.css',
  './assets/css/home-dashboard.css',
  './assets/css/native-app-shell.css',
  './assets/css/native-app-shell-stability.css',
  './assets/css/product-polish.css',
  './assets/js/fresh-home-route-bootstrap.js',
  './assets/js/octagon-hq-shell.js',
  './assets/js/app-update-watcher.js',
  './assets/js/home-dashboard.js',
  './assets/js/fresh-home-launch.js',
  './assets/js/native-app-shell.js',
  './assets/js/native-app-shell-stability.js'
];
const CORE=['./','./manifest.webmanifest',...SHELL_FALLBACKS];
const PALETTE_NETWORK_FIRST=/\/assets\/css\/(?:app|home-dashboard|native-app-shell|native-app-shell-stability|product-polish)\.css$/i;
const FORCE_NETWORK=/\/assets\/(?:(?:js\/(?:app-canonical-group|app-notification-surface-fix|app-update-watcher|product-architecture|octagon-hq-shell|native-app-shell|native-app-shell-stability|community-profiles|fresh-home-route-bootstrap|fresh-home-launch|home-dashboard|find-leader|better-than-standalone-share|play-daily-find-leader|game-challenges|profile-challenges|share-deep-links|picks|picks-auto-advance|octagon-notifications)|data\/(?:find-leader-question-bank|find-leader-record-book-data|what-changed|supabase-config|picks-events))\.js|css\/(?:app|home-dashboard|native-app-shell|native-app-shell-stability|product-polish|community-profiles|find-leader|picks-mobile-polish)\.css)$/i;
const scopedUrl=path=>new URL(path,self.registration.scope).href;
const SHELL_FALLBACK_PATHS=new Set(SHELL_FALLBACKS.map(path=>new URL(path,self.registration.scope).pathname));
const isShellFallbackPath=path=>SHELL_FALLBACK_PATHS.has(path);

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    await Promise.all(CORE.map(path=>cache.add(new Request(scopedUrl(path),{cache:'reload'}))));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const target=await caches.open(CACHE_NAME);
    const keys=await caches.keys();
    for(const key of keys){
      if(!key.startsWith(LEGACY_PREFIX)||key===CACHE_NAME)continue;
      const source=await caches.open(key);
      const requests=await source.keys();
      for(const request of requests){
        const path=new URL(request.url).pathname;
        if((FORCE_NETWORK.test(path)||PALETTE_NETWORK_FIRST.test(path))&&!isShellFallbackPath(path))continue;
        if(await target.match(request,{ignoreSearch:isShellFallbackPath(path)}))continue;
        const response=await source.match(request);
        if(response)await target.put(request,response);
      }
      await caches.delete(key);
    }
    const stale=await target.keys();
    await Promise.all(stale.filter(request=>{
      const path=new URL(request.url).pathname;
      return(FORCE_NETWORK.test(path)||PALETTE_NETWORK_FIRST.test(path))&&!isShellFallbackPath(path);
    }).map(request=>target.delete(request)));
    await self.clients.claim();
  })());
});

function isNavigation(request){
  return request.mode==='navigate';
}

function isVersionedStatic(request,url){
  if(url.origin!==self.location.origin)return false;
  if(request.destination==='serviceworker')return false;
  return /\.(?:js|css|json|webmanifest|png|webp|jpe?g|gif|svg|ico)$/i.test(url.pathname);
}

async function updateCache(request){
  const cache=await caches.open(CACHE_NAME);
  try{
    const response=await fetch(request,{cache:'no-cache'});
    if(response?.ok)await cache.put(request,response.clone());
    return response;
  }catch(_error){return null;}
}

async function cachedFallback(cache,request){
  return await cache.match(request)||await cache.match(request,{ignoreSearch:true});
}

async function networkFirst(request){
  const cache=await caches.open(CACHE_NAME);
  const network=await updateCache(request);
  if(network?.ok)return network;
  return await cachedFallback(cache,request)||Response.error();
}

async function instantNavigation(request){
  const cache=await caches.open(CACHE_NAME);
  const network=await updateCache(request);
  if(network?.ok)return network;
  return await cache.match(request,{ignoreSearch:true})
    ||await cache.match(scopedUrl('./index.html'))
    ||await cache.match(scopedUrl('./'))
    ||Response.error();
}

async function cacheFirst(request){
  const cache=await caches.open(CACHE_NAME);
  const url=new URL(request.url);
  if(FORCE_NETWORK.test(url.pathname))return networkFirst(request);
  const cached=await cache.match(request)||(isShellFallbackPath(url.pathname)?await cache.match(request,{ignoreSearch:true}):null);
  if(cached)return cached;
  try{
    const response=await fetch(request);
    if(response?.ok)await cache.put(request,response.clone());
    return response;
  }catch(_error){return Response.error();}
}

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(isNavigation(request)){
    event.respondWith(instantNavigation(request));
    return;
  }
  if(url.origin===self.location.origin&&PALETTE_NETWORK_FIRST.test(url.pathname)){
    event.respondWith(networkFirst(request));
    return;
  }
  if(isVersionedStatic(request,url))event.respondWith(cacheFirst(request));
});

self.addEventListener('push',event=>{
  let payload={};
  try{payload=event.data?.json?.()||{};}catch(_error){payload={body:event.data?.text?.()||''};}
  const title=String(payload.title||'Octagon HQ');
  const options={
    body:String(payload.body||'New Octagon HQ activity.'),
    tag:String(payload.tag||'octagon-hq-activity'),
    renotify:true,
    icon:'./assets/app-icon.png?v=20260702c',
    badge:'./assets/app-icon.png?v=20260702c',
    data:{url:String(payload.url||'./#home')}
  };
  event.waitUntil(self.registration.showNotification(title,options));
});

self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const target=new URL(String(event.notification.data?.url||'./#home'),self.registration.scope).href;
  event.waitUntil((async()=>{
    const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const client of windows){
      if('navigate' in client)await client.navigate(target);
      if('focus' in client)return client.focus();
    }
    return self.clients.openWindow(target);
  })());
});

self.addEventListener('message',event=>{
  if(event.data?.type==='OCTAGON_SW_VERSION')event.source?.postMessage?.({type:'OCTAGON_SW_VERSION',version:VERSION,cache:CACHE_NAME});
});
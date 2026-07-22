const VERSION='octagon-hq-sw-20260721g-palette-shell-reset';
const CACHE_NAME='octagon-hq-static-v16';
const LEGACY_PREFIX='octagon-hq-static-';
const CORE=['./','./index.html','./manifest.webmanifest'];
const PALETTE_NETWORK_ONLY=/\/assets\/css\/(?:app|home-dashboard|native-app-shell|native-app-shell-stability|product-polish|find-leader|picks-mobile-polish)\.css$/i;
const FORCE_NETWORK=/\/assets\/(?:(?:js\/(?:app-notification-surface-fix|app-update-watcher|product-architecture|octagon-hq-shell|native-app-shell|native-app-shell-stability|community-profiles|fresh-home-launch|home-dashboard|find-leader|game-challenges|share-deep-links|picks|picks-auto-advance|octagon-notifications)|data\/(?:what-changed|supabase-config|picks-events))\.js|css\/(?:app|home-dashboard|native-app-shell|native-app-shell-stability|product-polish|community-profiles|find-leader|picks-mobile-polish)\.css)$/i;

function isShellPath(path){
  return /\/(?:index\.html)?$/i.test(path);
}

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    await Promise.allSettled(CORE.map(path=>cache.add(new Request(path,{cache:'reload'}))));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const target=await caches.open(CACHE_NAME);
    const keys=await caches.keys();
    const replacedLegacy=keys.some(key=>key.startsWith(LEGACY_PREFIX)&&key!==CACHE_NAME);
    for(const key of keys){
      if(!key.startsWith(LEGACY_PREFIX)||key===CACHE_NAME)continue;
      const source=await caches.open(key);
      const requests=await source.keys();
      for(const request of requests){
        const path=new URL(request.url).pathname;
        if(isShellPath(path)||FORCE_NETWORK.test(path)||PALETTE_NETWORK_ONLY.test(path))continue;
        if(await target.match(request))continue;
        const response=await source.match(request);
        if(response)await target.put(request,response);
      }
      await caches.delete(key);
    }
    const stale=await target.keys();
    await Promise.all(stale.filter(request=>{
      const path=new URL(request.url).pathname;
      return FORCE_NETWORK.test(path)||PALETTE_NETWORK_ONLY.test(path);
    }).map(request=>target.delete(request)));
    await self.clients.claim();
    if(replacedLegacy){
      const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
      await Promise.allSettled(windows.map(client=>client.navigate?.(client.url)));
    }
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

async function networkOnly(request){
  try{return await fetch(request,{cache:'no-store'});}
  catch(_error){return Response.error();}
}

async function updateCache(request){
  const cache=await caches.open(CACHE_NAME);
  try{
    const response=await fetch(request,{cache:'no-cache'});
    if(response?.ok)await cache.put(request,response.clone());
    return response;
  }catch(_error){return null;}
}

async function instantNavigation(request,event){
  const cache=await caches.open(CACHE_NAME);
  const cached=await cache.match(request,{ignoreSearch:true})||await cache.match('./index.html')||await cache.match('./');
  const network=updateCache(request);
  if(cached){
    event.waitUntil(network);
    return cached;
  }
  return (await network)||Response.error();
}

async function cacheFirst(request){
  const cache=await caches.open(CACHE_NAME);
  const url=new URL(request.url);
  if(FORCE_NETWORK.test(url.pathname)){
    return (await updateCache(request))||await cache.match(request)||Response.error();
  }
  const cached=await cache.match(request);
  if(cached)return cached;
  const response=await fetch(request);
  if(response?.ok)await cache.put(request,response.clone());
  return response;
}

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(isNavigation(request)){
    event.respondWith(instantNavigation(request,event));
    return;
  }
  if(url.origin===self.location.origin&&PALETTE_NETWORK_ONLY.test(url.pathname)){
    event.respondWith(networkOnly(request));
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
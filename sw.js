const VERSION='octagon-hq-sw-20260718b-fast-refresh';
const CACHE_NAME='octagon-hq-static-20260718b';

self.addEventListener('install',event=>{
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('octagon-hq-static-')&&key!==CACHE_NAME).map(key=>caches.delete(key)));
    const cache=await caches.open(CACHE_NAME);
    const requests=await cache.keys();
    await Promise.all(requests.filter(request=>{
      const path=new URL(request.url).pathname;
      return /\/assets\/js\/(?:product-architecture|app-notification-center)\.js$/i.test(path);
    }).map(request=>cache.delete(request)));
    await self.clients.claim();
  })());
});

function isNavigation(request,url){
  return request.mode==='navigate'||/\/(?:index|share)\.html$/i.test(url.pathname);
}

function isVersionedStatic(request,url){
  if(url.origin!==self.location.origin)return false;
  if(request.destination==='serviceworker')return false;
  return /\.(?:js|css|json|webmanifest|png|webp|jpe?g|gif|svg|ico)$/i.test(url.pathname);
}

async function updateNavigationCache(request,cache){
  try{
    const response=await fetch(request,{cache:'no-cache'});
    if(response?.ok)await cache.put(request,response.clone());
    return response;
  }catch(_error){
    return null;
  }
}

async function staleNavigation(request,event){
  const cache=await caches.open(CACHE_NAME);
  const cached=await cache.match(request,{ignoreSearch:true});
  const network=updateNavigationCache(request,cache);
  if(cached){
    event.waitUntil(network.catch(()=>null));
    return cached;
  }
  return (await network)||Response.error();
}

async function cacheFirst(request){
  const cache=await caches.open(CACHE_NAME);
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
  if(isNavigation(request,url)){
    event.respondWith(staleNavigation(request,event));
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
  if(event.data?.type==='OCTAGON_SW_VERSION')event.source?.postMessage?.({type:'OCTAGON_SW_VERSION',version:VERSION});
});

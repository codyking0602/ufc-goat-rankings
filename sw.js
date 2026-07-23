const VERSION='octagon-hq-sw-20260723a-temporary-disable';
const CACHE_PREFIX='octagon-hq-static-';

self.addEventListener('install',event=>{
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)).map(key=>caches.delete(key)));
    await self.clients.claim();
    await self.registration.unregister();
  })());
});

self.addEventListener('message',event=>{
  if(event.data?.type==='OCTAGON_SW_VERSION'){
    event.source?.postMessage?.({type:'OCTAGON_SW_VERSION',version:VERSION,cache:'disabled',revision:'network-only'});
  }
});

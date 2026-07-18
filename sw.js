const VERSION='octagon-hq-sw-20260718a-network-first';

self.addEventListener('install',event=>{
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

function shouldReload(request,url){
  if(request.mode==='navigate')return true;
  if(url.origin!==self.location.origin)return false;
  return /\.(?:html|js|css|json|webmanifest)$/i.test(url.pathname);
}

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(!shouldReload(request,url))return;
  event.respondWith((async()=>{
    try{
      return await fetch(request,{cache:'reload'});
    }catch(_error){
      return fetch(request);
    }
  })());
});

self.addEventListener('push',event=>{
  let payload={};
  try{payload=event.data?.json?.()||{};}catch(_error){payload={body:event.data?.text?.()||''};}
  const title=String(payload.title||'The War Room');
  const options={
    body:String(payload.body||'New activity in The War Room.'),
    tag:String(payload.tag||'war-room-activity'),
    renotify:true,
    data:{url:String(payload.url||'./#war-room')}
  };
  event.waitUntil(self.registration.showNotification(title,options));
});

self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const target=new URL(String(event.notification.data?.url||'./#war-room'),self.registration.scope).href;
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
const VERSION='war-room-push-sw-20260717b';

self.addEventListener('install',event=>{
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate',event=>{
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push',event=>{
  let payload={};
  try{payload=event.data?.json?.()||{};}catch(_error){
    payload={body:event.data?.text?.()||''};
  }
  const title=String(payload.title||'The War Room');
  const options={
    body:String(payload.body||'New activity in The War Room.'),
    tag:String(payload.tag||'war-room-activity'),
    renotify:true,
    data:{url:String(payload.url||'./?open=octagon')},
  };
  event.waitUntil(self.registration.showNotification(title,options));
});

self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const target=new URL(String(event.notification.data?.url||'./?open=octagon'),self.registration.scope).href;
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

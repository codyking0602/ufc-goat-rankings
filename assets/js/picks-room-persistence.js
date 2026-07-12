(function(){
  'use strict';

  const LAST_ROOM_KEY='ufc-picks:last-room';
  const ROOM_TOKEN_PREFIX='ufc-picks:room:';
  const ADMIN_TOKEN_PREFIX='ufc-picks:admin:';

  function normalizeCode(value){
    return String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);
  }

  function roomCodeFromUrl(value){
    try{
      return normalizeCode(new URL(value || window.location.href,window.location.href).searchParams.get('room'));
    }catch(_error){
      return '';
    }
  }

  function roomTokenExists(code){
    return Boolean(code && localStorage.getItem(`${ROOM_TOKEN_PREFIX}${code}`));
  }

  function rememberRoom(code){
    const normalized=normalizeCode(code);
    if(normalized && roomTokenExists(normalized)) localStorage.setItem(LAST_ROOM_KEY,normalized);
  }

  function forgetRoom(code){
    const normalized=normalizeCode(code);
    localStorage.removeItem(LAST_ROOM_KEY);
    if(!normalized) return;
    localStorage.removeItem(`${ROOM_TOKEN_PREFIX}${normalized}`);
    localStorage.removeItem(`${ADMIN_TOKEN_PREFIX}${normalized}`);
  }

  function discoverStoredRoom(){
    const remembered=normalizeCode(localStorage.getItem(LAST_ROOM_KEY));
    if(roomTokenExists(remembered)) return remembered;

    const candidates=[];
    for(let index=0;index<localStorage.length;index+=1){
      const key=localStorage.key(index) || '';
      if(!key.startsWith(ROOM_TOKEN_PREFIX)) continue;
      const code=normalizeCode(key.slice(ROOM_TOKEN_PREFIX.length));
      if(roomTokenExists(code)) candidates.push(code);
    }

    if(!candidates.length) return '';
    return candidates.find(code=>localStorage.getItem(`${ADMIN_TOKEN_PREFIX}${code}`)) || candidates[0];
  }

  function wrapHistoryMethod(methodName){
    const original=history[methodName];
    if(typeof original!=='function') return;
    history[methodName]=function(state,title,url){
      const previousCode=roomCodeFromUrl(window.location.href);
      const nextCode=url == null ? previousCode : roomCodeFromUrl(url);
      const result=original.apply(this,arguments);
      if(nextCode) rememberRoom(nextCode);
      else if(previousCode) forgetRoom(previousCode);
      return result;
    };
  }

  wrapHistoryMethod('replaceState');
  wrapHistoryMethod('pushState');

  const currentCode=roomCodeFromUrl(window.location.href);
  if(currentCode){
    rememberRoom(currentCode);
    return;
  }

  const savedCode=discoverStoredRoom();
  if(!savedCode) return;

  rememberRoom(savedCode);
  const restoredUrl=new URL(window.location.href);
  restoredUrl.searchParams.set('room',savedCode);
  restoredUrl.hash='picks';
  window.location.replace(restoredUrl.toString());
})();
(function(){
  'use strict';

  const LAST_ROOM_KEY='ufc-picks:last-room';
  const ROOM_TOKEN_PREFIX='ufc-picks:room:';
  const ADMIN_TOKEN_PREFIX='ufc-picks:admin:';
  const AUTO_RESTORE_DISABLED_KEY='ufc-picks:auto-restore-disabled';

  function normalizeCode(value){
    return String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);
  }

  function paramFromUrl(name,value){
    try{
      return normalizeCode(new URL(value || window.location.href,window.location.href).searchParams.get(name));
    }catch(_error){
      return '';
    }
  }

  function roomCodeFromUrl(value){ return paramFromUrl('room',value); }
  function groupCodeFromUrl(value){ return paramFromUrl('group',value); }

  function roomTokenExists(code){
    return Boolean(code && localStorage.getItem(`${ROOM_TOKEN_PREFIX}${code}`));
  }

  function rememberRoom(code){
    const normalized=normalizeCode(code);
    if(!normalized || !roomTokenExists(normalized)) return;
    localStorage.setItem(LAST_ROOM_KEY,normalized);
    localStorage.removeItem(AUTO_RESTORE_DISABLED_KEY);
  }

  function leaveActiveRoom(){
    localStorage.removeItem(LAST_ROOM_KEY);
    localStorage.setItem(AUTO_RESTORE_DISABLED_KEY,'1');
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
      else if(previousCode && !groupCodeFromUrl(url || window.location.href)) leaveActiveRoom();
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

  // A permanent group link decides which event room should open.
  if(groupCodeFromUrl(window.location.href)) return;

  if(localStorage.getItem(AUTO_RESTORE_DISABLED_KEY)==='1') return;

  const savedCode=discoverStoredRoom();
  if(!savedCode) return;

  rememberRoom(savedCode);
  const restoredUrl=new URL(window.location.href);
  restoredUrl.searchParams.set('room',savedCode);
  restoredUrl.hash='picks';
  window.location.replace(restoredUrl.toString());
})();
(function(){
  'use strict';

  const VERSION='profile-avatar-sync-20260718a';
  let frame=0;
  let observer=null;

  const text=value=>String(value??'').trim();
  const initials=value=>text(value).split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase()||'UFC';

  function memberByName(name){
    const clean=text(name).toLowerCase();
    if(!clean)return null;
    const group=window.UFC_APP_PROFILE?.group;
    if(text(group?.me?.display_name).toLowerCase()===clean)return group.me;
    return (group?.members||[]).find(member=>text(member?.display_name).toLowerCase()===clean)||null;
  }

  function signature(member){
    return [member?.id||'',member?.profile_updated_at||'',member?.fighter_avatar_slug||'',String(member?.profile_photo_data||'').length].join('|');
  }

  function syncWarRoom(){
    const api=window.UFC_APP_PROFILE;
    if(!api)return;
    document.querySelectorAll('.octagon-avatar[data-member-name]').forEach(node=>{
      const member=memberByName(node.dataset.memberName);
      if(!member)return;
      const nextSignature=signature(member);
      if(node.dataset.profileSignature===nextSignature)return;
      const src=api.avatarSource?.(member)||'';
      node.dataset.profileSignature=nextSignature;
      node.style.borderRadius='50%';
      node.innerHTML=src
        ?`<img src="${String(src).replace(/"/g,'&quot;')}" alt="${text(member.display_name).replace(/"/g,'&quot;')} profile" data-octagon-avatar-image>`
        :`<span>${initials(member.display_name)}</span>`;
    });
  }

  function syncHomeAvatars(){
    const api=window.UFC_APP_PROFILE;
    if(!api)return;
    document.querySelectorAll('.home-war-avatar[data-member-name]').forEach(node=>{
      const member=memberByName(node.dataset.memberName);
      if(!member)return;
      const nextSignature=signature(member);
      if(node.dataset.profileSignature===nextSignature)return;
      const src=api.avatarSource?.(member)||'';
      node.dataset.profileSignature=nextSignature;
      node.style.borderRadius='50%';
      node.innerHTML=src?`<img src="${String(src).replace(/"/g,'&quot;')}" alt="${text(member.display_name).replace(/"/g,'&quot;')} profile">`:`<span>${initials(member.display_name)}</span>`;
    });
  }

  function apply(){
    syncWarRoom();
    syncHomeAvatars();
    document.documentElement.dataset.profileAvatarSync=VERSION;
  }

  function schedule(){
    if(frame)return;
    frame=requestAnimationFrame(()=>{frame=0;apply();});
  }

  function start(){
    schedule();
    const octagon=document.getElementById('octagon');
    if(octagon){
      observer=new MutationObserver(schedule);
      observer.observe(octagon,{childList:true,subtree:true});
    }
    ['ufc-app-profile-updated','ufc-play-profile-ready','ufc-play-data-ready','octagon-hq:view-change'].forEach(name=>window.addEventListener(name,schedule));
  }

  window.UFC_PROFILE_AVATAR_SYNC={version:VERSION,apply};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
(function(){
  'use strict';

  const config=window.UFC_SUPABASE_CONFIG || {};
  if(!config.url || !config.anonKey || !window.supabase?.createClient) return;

  const client=window.supabase.createClient(config.url,config.anonKey);

  function roomCode(){
    const fromUrl=new URL(window.location.href).searchParams.get('room');
    const fromBanner=document.querySelector('#picksRoomBanner .picks-code')?.textContent;
    return String(fromUrl || fromBanner || '').trim().toUpperCase();
  }

  function adminToken(code){
    return code ? localStorage.getItem(`ufc-picks:admin:${code}`) : null;
  }

  function showToast(message){
    const toast=document.getElementById('picksToast');
    if(!toast) return;
    toast.textContent=message;
    toast.classList.add('show');
    window.setTimeout(()=>toast.classList.remove('show'),1500);
  }

  function fightIsLocked(fightId){
    const escaped=window.CSS?.escape ? CSS.escape(fightId) : fightId.replace(/"/g,'\\"');
    const card=document.querySelector(`.pick-fight[data-fight="${escaped}"]`);
    return Boolean(card?.querySelector('.pick-fighter[disabled], .pick-fight-head > span.locked'));
  }

  async function setFightLock(button){
    const code=roomCode();
    const token=adminToken(code);
    if(!code || !token){ showToast('Room-owner access is not available.'); return; }

    const locked=button.dataset.locked==='true';
    const original=button.textContent;
    button.disabled=true;
    button.textContent=locked ? 'Reopening…' : 'Locking…';

    const {error}=await client.rpc('picks_admin_set_fight_lock',{
      p_room_code:code,
      p_admin_token:token,
      p_fight_id:button.dataset.fightId,
      p_locked:!locked,
      p_reopen_minutes:15
    });

    if(error){
      button.disabled=false;
      button.textContent=original;
      showToast(error.message || 'Fight lock was not updated.');
      return;
    }

    showToast(locked ? 'Fight reopened for 15 minutes' : 'Fight locked now');
    window.setTimeout(()=>window.location.reload(),350);
  }

  function enhanceAdmin(){
    const panel=document.getElementById('picksAdminContent');
    if(!panel) return;

    panel.querySelectorAll('.picks-admin-fight').forEach(row=>{
      const statusText=row.querySelector('.picks-admin-fight-head span')?.textContent.trim().toLowerCase();
      if(statusText!=='awaiting result') return;

      const actions=row.querySelector('.picks-admin-actions');
      const sourceButton=actions?.querySelector('[data-admin-fight]');
      if(!actions || !sourceButton) return;

      const fightId=sourceButton.dataset.adminFight;
      const oldReopen=actions.querySelector('[data-admin-status="scheduled"]');
      if(oldReopen) oldReopen.remove();
      actions.querySelector('.picks-admin-lock-button')?.remove();

      const locked=fightIsLocked(fightId);
      const button=document.createElement('button');
      button.type='button';
      button.className=`picks-admin-lock-button${locked ? ' is-reopen' : ''}`;
      button.dataset.fightId=fightId;
      button.dataset.locked=String(locked);
      button.textContent=locked ? 'Reopen 15m' : 'Lock now';
      button.addEventListener('click',()=>setFightLock(button));
      actions.appendChild(button);
    });
  }

  const observer=new MutationObserver(enhanceAdmin);
  const start=()=>{
    const panel=document.getElementById('picksAdminContent');
    if(!panel) return;
    observer.observe(panel,{childList:true,subtree:true});
    enhanceAdmin();
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
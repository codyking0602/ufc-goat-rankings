(function(){
  'use strict';

  const config=window.UFC_SUPABASE_CONFIG || {};
  if(!config.url || !config.anonKey || !window.supabase?.createClient) return;

  const client=window.supabase.createClient(config.url,config.anonKey);
  const GROUP_TOKEN_PREFIX='ufc-picks:group:';
  const GROUP_ADMIN_PREFIX='ufc-picks:group-admin:';
  const ROOM_TOKEN_PREFIX='ufc-picks:room:';
  const ROOM_ADMIN_PREFIX='ufc-picks:admin:';
  let statusLoading=false;
  let statusSignature='';
  let recoveryMode=false;

  const safe=value=>String(value ?? '').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const normalize=value=>String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);
  const normalizeRecovery=value=>String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,12);

  function toast(message){
    const node=document.getElementById('picksToast');
    if(!node) return;
    node.textContent=message;
    node.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>node.classList.remove('show'),1900);
  }

  function storedCodes(prefix){
    const codes=[];
    for(let index=0;index<localStorage.length;index+=1){
      const key=localStorage.key(index) || '';
      if(!key.startsWith(prefix) || !localStorage.getItem(key)) continue;
      const code=normalize(key.slice(prefix.length));
      if(code) codes.push(code);
    }
    return [...new Set(codes)];
  }

  function groupCode(){
    const url=new URL(window.location.href);
    return normalize(url.searchParams.get('group')) || (storedCodes(GROUP_TOKEN_PREFIX).length===1 ? storedCodes(GROUP_TOKEN_PREFIX)[0] : '');
  }

  function groupToken(code){ return code ? localStorage.getItem(`${GROUP_TOKEN_PREFIX}${code}`) || '' : ''; }
  function groupAdmin(code){ return code ? localStorage.getItem(`${GROUP_ADMIN_PREFIX}${code}`) || '' : ''; }

  function friendlyError(error,fallback){
    const message=String(error?.message || fallback || 'That did not work.');
    if(/function .* does not exist|schema cache|could not find the function/i.test(message)) return 'Run the device recovery migration in Supabase first.';
    return message;
  }

  function presentKey({title='Save your recovery key',key,copy='This key is shown only now.',note='',onContinue=null}){
    document.getElementById('picksRecoveryModal')?.remove();
    const modal=document.createElement('div');
    modal.id='picksRecoveryModal';
    modal.className='picks-recovery-modal';
    modal.setAttribute('role','dialog');
    modal.setAttribute('aria-modal','true');
    modal.setAttribute('aria-labelledby','picksRecoveryModalTitle');
    modal.innerHTML=`<div class="picks-recovery-dialog">
      <span>DEVICE RECOVERY</span>
      <h3 id="picksRecoveryModalTitle">${safe(title)}</h3>
      <p>${safe(copy)}</p>
      <div class="picks-recovery-key-row"><code>${safe(key)}</code><button type="button" data-copy-recovery>Copy</button></div>
      ${note ? `<small>${safe(note)}</small>` : ''}
      <button class="picks-recovery-continue" type="button">Done</button>
    </div>`;
    document.body.appendChild(modal);
    const close=()=>{
      modal.remove();
      document.body.classList.remove('picks-recovery-modal-open');
      if(typeof onContinue==='function') onContinue();
    };
    document.body.classList.add('picks-recovery-modal-open');
    modal.querySelector('[data-copy-recovery]')?.addEventListener('click',async event=>{
      try{ await navigator.clipboard.writeText(key); event.currentTarget.textContent='Copied'; }
      catch(_error){ toast(key); }
    });
    modal.querySelector('.picks-recovery-continue')?.addEventListener('click',close);
    modal.addEventListener('click',event=>{ if(event.target===modal) close(); });
    modal.querySelector('[data-copy-recovery]')?.focus();
  }

  window.UFCPicksRecovery={presentKey};

  function ensureSettingsCard(){
    const shell=document.getElementById('picksProfileShell');
    if(!shell || shell.hidden) return null;
    let card=document.getElementById('picksRecoveryCard');
    if(card && card.parentElement===shell) return card;
    card=document.createElement('details');
    card.id='picksRecoveryCard';
    card.className='picks-recovery-card';
    card.innerHTML='<summary><div><span>ACCOUNT SAFETY</span><strong>Device Recovery</strong></div><b>Checking…</b></summary><div id="picksRecoveryContent" class="picks-recovery-content"><div class="picks-recovery-loading">Checking recovery status…</div></div>';
    shell.appendChild(card);
    return card;
  }

  function renderStatus(data){
    const card=ensureSettingsCard();
    const target=document.getElementById('picksRecoveryContent');
    if(!card || !target) return;
    const protectedProfile=Boolean(data?.has_recovery_key);
    card.querySelector(':scope > summary b').textContent=protectedProfile ? 'Protected' : 'Not set';
    target.innerHTML=`<section class="picks-recovery-status ${protectedProfile?'protected':'unprotected'}">
      <div class="picks-recovery-shield">${protectedProfile?'✓':'!'}</div>
      <div><span>${protectedProfile?'RECOVERY READY':'ACTION RECOMMENDED'}</span><strong>${protectedProfile?'Your permanent profile can be recovered':'Protect this profile before changing phones'}</strong><small>${protectedProfile?'Use your saved recovery key on a new device. Recovering rotates access and signs the old device out.':'Create one private recovery key and save it outside the app.'}</small></div>
    </section>
    <button id="picksGenerateRecovery" class="picks-recovery-primary" type="button">${protectedProfile?'Replace Recovery Key':'Create Recovery Key'}</button>
    <p class="picks-recovery-note">${data?.is_owner?'Commissioner access moves with your profile when this key is used. ':''}The app never displays an existing key again. Replacing it immediately invalidates the previous key.</p>`;
    document.getElementById('picksGenerateRecovery')?.addEventListener('click',generateRecoveryKey);
  }

  async function refreshStatus(force=false){
    if(statusLoading) return;
    const code=groupCode();
    const token=groupToken(code);
    const card=ensureSettingsCard();
    if(!code || !token){ card?.remove(); return; }
    statusLoading=true;
    try{
      const {data,error}=await client.rpc('picks_member_recovery_status',{p_group_code:code,p_member_token:token});
      if(error){
        if(card){
          card.querySelector(':scope > summary b').textContent='Setup needed';
          const target=document.getElementById('picksRecoveryContent');
          if(target) target.innerHTML=`<div class="picks-recovery-error">${safe(friendlyError(error,'Could not check recovery status.'))}</div>`;
        }
        return;
      }
      const signature=JSON.stringify(data || {});
      if(force || signature!==statusSignature || !document.getElementById('picksGenerateRecovery')){
        statusSignature=signature;
        renderStatus(data);
      }
    }finally{
      statusLoading=false;
    }
  }

  async function generateRecoveryKey(){
    const code=groupCode();
    const token=groupToken(code);
    const button=document.getElementById('picksGenerateRecovery');
    if(!code || !token) return;
    const original=button?.textContent;
    if(button){ button.disabled=true; button.textContent='Creating…'; }
    const {data,error}=await client.rpc('picks_member_generate_recovery_key',{p_group_code:code,p_member_token:token});
    if(button){ button.disabled=false; button.textContent=original || 'Create Recovery Key'; }
    if(error){ toast(friendlyError(error,'Recovery key was not created.')); return; }
    presentKey({
      title:'Save this recovery key',
      key:data.recovery_key,
      copy:'Store it in Notes, a password manager, or another safe place. It is shown only now.',
      note:data.is_owner?'This also restores commissioner access on a replacement device.':'Using this key on another device signs this device out of the group.',
      onContinue:()=>refreshStatus(true)
    });
  }

  function inviteContext(){
    const url=new URL(window.location.href);
    const code=normalize(url.searchParams.get('group'));
    return {code,hasRoom:Boolean(normalize(url.searchParams.get('room'))),hasToken:Boolean(groupToken(code))};
  }

  function setRecoveryMode(open){
    recoveryMode=Boolean(open);
    const action=document.getElementById('picksRoomAction');
    const panel=document.getElementById('picksInviteRecoveryPanel');
    const toggle=document.getElementById('picksInviteRecoveryToggle');
    if(action) action.hidden=recoveryMode;
    if(panel) panel.hidden=!recoveryMode;
    if(toggle) toggle.textContent=recoveryMode ? 'Join as a new member instead' : 'Already a member? Recover your profile';
    if(recoveryMode) document.getElementById('picksRecoveryCode')?.focus();
  }

  function ensureInviteRecovery(){
    const context=inviteContext();
    const setup=document.getElementById('picksRoomSetup');
    if(!context.code || context.hasRoom || context.hasToken || !setup || setup.hidden){
      document.getElementById('picksInviteRecovery')?.remove();
      recoveryMode=false;
      return;
    }
    if(document.getElementById('picksInviteRecovery')) return;
    const wrap=document.createElement('div');
    wrap.id='picksInviteRecovery';
    wrap.className='picks-invite-recovery';
    wrap.innerHTML=`<button id="picksInviteRecoveryToggle" type="button">Already a member? Recover your profile</button>
      <div id="picksInviteRecoveryPanel" class="picks-invite-recovery-panel" hidden>
        <label>Recovery key or commissioner code<input id="picksRecoveryCode" maxlength="14" autocapitalize="characters" autocomplete="off" placeholder="AB12-CD34-EF56"></label>
        <p>Use the same display name already on the leaderboard.</p>
        <button id="picksRecoverProfile" type="button">Recover Existing Profile</button>
      </div>`;
    document.getElementById('picksRoomAction')?.insertAdjacentElement('afterend',wrap);
    document.getElementById('picksInviteRecoveryToggle')?.addEventListener('click',()=>setRecoveryMode(!recoveryMode));
    document.getElementById('picksRecoverProfile')?.addEventListener('click',recoverProfile);
  }

  function storeRecoveredAccess(data){
    const code=normalize(data?.group?.code);
    const memberToken=data?.member_token;
    const adminToken=data?.admin_token || '';
    if(!code || !memberToken) return;
    localStorage.setItem(`${GROUP_TOKEN_PREFIX}${code}`,memberToken);
    if(adminToken) localStorage.setItem(`${GROUP_ADMIN_PREFIX}${code}`,adminToken);
    localStorage.setItem('ufc-picks:display-name',data.member?.display_name || '');
    (data.rooms || []).forEach(room=>{
      const roomCode=normalize(room.code);
      if(!roomCode) return;
      localStorage.setItem(`${ROOM_TOKEN_PREFIX}${roomCode}`,memberToken);
      if(adminToken) localStorage.setItem(`${ROOM_ADMIN_PREFIX}${roomCode}`,adminToken);
    });
  }

  async function recoverProfile(){
    const context=inviteContext();
    const name=document.getElementById('picksDisplayName')?.value.trim();
    const code=normalizeRecovery(document.getElementById('picksRecoveryCode')?.value);
    const button=document.getElementById('picksRecoverProfile');
    if(!name){ toast('Enter the exact name already in the group.'); return; }
    if(code.length!==12){ toast('Enter the 12-character recovery code.'); return; }
    const original=button?.textContent;
    if(button){ button.disabled=true; button.textContent='Recovering…'; }
    const {data,error}=await client.rpc('picks_member_recover',{p_group_code:context.code,p_display_name:name,p_recovery_code:code});
    if(button){ button.disabled=false; button.textContent=original || 'Recover Existing Profile'; }
    if(error){ toast(friendlyError(error,'Profile could not be recovered.')); return; }
    storeRecoveredAccess(data);
    const destination=new URL(window.location.href);
    destination.searchParams.set('group',normalize(data.group.code));
    if(data.active_room?.code){
      destination.searchParams.set('room',normalize(data.active_room.code));
      destination.searchParams.set('event',data.active_room.event_id);
      destination.searchParams.set('picksView','event');
      localStorage.setItem('ufc-picks:last-room',normalize(data.active_room.code));
      localStorage.removeItem('ufc-picks:auto-restore-disabled');
    }else{
      destination.searchParams.delete('room');
      destination.searchParams.delete('event');
      destination.searchParams.set('picksView','home');
    }
    destination.hash='picks';
    presentKey({
      title:'Profile recovered',
      key:data.recovery_key,
      copy:'Your access was moved to this device. Save this new recovery key; the old key and old device access no longer work.',
      note:data.is_owner?'Commissioner access was moved too.':'Your picks, points, avatar, and history are unchanged.',
      onContinue:()=>window.location.assign(destination.toString())
    });
  }

  function decorateCommissioner(){
    const code=groupCode();
    const admin=groupAdmin(code);
    if(!code || !admin) return;
    document.querySelectorAll('.commissioner-member').forEach(article=>{
      if(article.classList.contains('inactive') || article.querySelector('[data-recovery-member]')) return;
      const source=article.querySelector('[data-transfer-member],[data-remove-member]');
      if(!source) return;
      const memberId=source.dataset.transferMember || source.dataset.removeMember;
      const memberName=source.dataset.memberName || article.querySelector('strong')?.textContent?.replace(/COMMISSIONER/i,'').trim() || 'member';
      const actions=source.parentElement;
      if(!memberId || !actions) return;
      const button=document.createElement('button');
      button.type='button';
      button.dataset.recoveryMember=memberId;
      button.dataset.memberName=memberName;
      button.textContent='Recovery';
      actions.prepend(button);
    });
  }

  async function issueCommissionerCode(button){
    const code=groupCode();
    const admin=groupAdmin(code);
    if(!code || !admin) return;
    const original=button.textContent;
    button.disabled=true;
    button.textContent='Creating…';
    const {data,error}=await client.rpc('picks_commissioner_issue_member_recovery',{p_group_code:code,p_admin_token:admin,p_member_id:button.dataset.recoveryMember});
    button.disabled=false;
    button.textContent=original;
    if(error){ toast(friendlyError(error,'Recovery code was not created.')); return; }
    presentKey({
      title:`Recovery code for ${data.display_name}`,
      key:data.recovery_code,
      copy:'Send this code privately. They must use the permanent group link, their exact display name, and this code within 30 minutes.',
      note:'Using it moves their profile to the new device and invalidates access on the old device.'
    });
  }

  function sync(){
    ensureInviteRecovery();
    ensureSettingsCard();
    refreshStatus();
    decorateCommissioner();
  }

  function start(){
    sync();
    document.addEventListener('click',event=>{
      const button=event.target.closest?.('[data-recovery-member]');
      if(button) issueCommissionerCode(button);
    });
    const observer=new MutationObserver(()=>{
      clearTimeout(start.timer);
      start.timer=setTimeout(sync,120);
    });
    observer.observe(document.getElementById('picks') || document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class']});
    window.addEventListener('picks:routechange',()=>setTimeout(sync,40));
    window.setInterval(()=>refreshStatus(),45000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

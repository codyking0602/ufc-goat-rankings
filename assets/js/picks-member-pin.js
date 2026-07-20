(function(){
  'use strict';

  const config=window.UFC_SUPABASE_CONFIG || {};
  if(!config.url || !config.anonKey || !window.supabase?.createClient) return;

  const client=window.supabase.createClient(config.url,config.anonKey);
  const GROUP_TOKEN_PREFIX='ufc-picks:group:';
  const GROUP_ADMIN_PREFIX='ufc-picks:group-admin:';
  const ROOM_TOKEN_PREFIX='ufc-picks:room:';
  const ROOM_ADMIN_PREFIX='ufc-picks:admin:';
  let accessInvalid=false;
  let statusLoading=false;
  let statusCode='';

  const safe=value=>String(value ?? '').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const normalizeCode=value=>String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);
  const normalizePin=value=>String(value || '').replace(/\D/g,'').slice(0,4);

  function toast(message){
    const node=document.getElementById('picksToast');
    if(!node) return;
    node.textContent=message;
    node.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>node.classList.remove('show'),2200);
  }

  function friendlyError(error,fallback){
    const message=String(error?.message || fallback || 'That did not work.');
    if(/function .* does not exist|schema cache|could not find the function/i.test(message)) return 'PIN sign-in needs the new Supabase migration first.';
    return message;
  }

  function storedCodes(prefix){
    const codes=[];
    for(let index=0;index<localStorage.length;index+=1){
      const key=localStorage.key(index) || '';
      if(!key.startsWith(prefix) || !localStorage.getItem(key)) continue;
      const code=normalizeCode(key.slice(prefix.length));
      if(code) codes.push(code);
    }
    return [...new Set(codes)];
  }

  function resolveCode(){
    const url=new URL(window.location.href);
    return normalizeCode(url.searchParams.get('group'))
      || (storedCodes(GROUP_TOKEN_PREFIX).length===1 ? storedCodes(GROUP_TOKEN_PREFIX)[0] : '');
  }

  function memberToken(code){ return code ? localStorage.getItem(`${GROUP_TOKEN_PREFIX}${code}`) || '' : ''; }
  function adminToken(code){ return code ? localStorage.getItem(`${GROUP_ADMIN_PREFIX}${code}`) || '' : ''; }

  function hasLocalAccess(){
    const code=resolveCode();
    return Boolean(code && memberToken(code) && !accessInvalid);
  }

  function homeHost(){
    return document.getElementById('picksHomeContent')
      || document.querySelector('#picks .picks-shell');
  }

  function settingsHost(){
    return document.getElementById('picksSettingsContent')
      || document.getElementById('picksProfileShell');
  }

  function setSignInStatus(message,type=''){
    const node=document.getElementById('picksPinSignInStatus');
    if(!node) return;
    node.textContent=message || '';
    node.className=`picks-pin-status${type ? ` ${type}` : ''}`;
  }

  function openSignedInProfile(data){
    const destination=new URL(window.location.href);
    const code=normalizeCode(data?.group?.code||data?.groupCode||window.UFC_PLAY_PROFILE?.canonicalGroupCode);
    destination.searchParams.set('group',code);

    if(data.active_room?.code){
      const room=normalizeCode(data.active_room.code);
      destination.searchParams.set('room',room);
      destination.searchParams.set('event',data.active_room.event_id);
      destination.searchParams.set('picksView','event');
      localStorage.setItem('ufc-picks:last-room',room);
      localStorage.removeItem('ufc-picks:auto-restore-disabled');
    }else{
      destination.searchParams.delete('room');
      destination.searchParams.delete('event');
      destination.searchParams.set('picksView','home');
    }

    destination.hash='picks';
    window.location.assign(destination.toString());
  }

  async function signIn(){
    const button=document.getElementById('picksPinSignInButton');
    const group=normalizeCode(document.getElementById('picksPinGroupCode')?.value);
    const name=document.getElementById('picksPinDisplayName')?.value.trim() || '';
    const pin=normalizePin(document.getElementById('picksPinValue')?.value);

    if(group.length!==6){ setSignInStatus('Enter the 6-character group code.','error'); return; }
    if(!name){ setSignInStatus('Enter the exact name on the leaderboard.','error'); return; }
    if(pin.length!==4){ setSignInStatus('Enter the 4-digit PIN.','error'); return; }

    const owner=window.UFC_PLAY_PROFILE;
    if(!owner?.login){
      setSignInStatus('Profile sign-in is still loading. Try again.','error');
      return;
    }

    const original=button?.textContent;
    if(button){ button.disabled=true; button.textContent='Signing In…'; }
    setSignInStatus('Checking your profile…','working');

    try{
      const data=await owner.login(group,name,pin,{publish:false,source:'picks-member-pin'});
      accessInvalid=false;
      setSignInStatus('Profile found. Opening your group…','success');
      openSignedInProfile(data);
    }catch(error){
      const message=friendlyError(error,'Could not sign in.');
      setSignInStatus(message,'error');
      toast(message);
    }finally{
      if(button){ button.disabled=false; button.textContent=original || 'Sign In'; }
    }
  }

  function ensureSignInCard(){
    const existing=document.getElementById('picksPinSignInCard');
    if(hasLocalAccess()){
      existing?.remove();
      return;
    }

    const host=homeHost();
    if(!host) return;

    let card=existing;
    if(!card){
      const url=new URL(window.location.href);
      const code=normalizeCode(url.searchParams.get('group'));
      const name=localStorage.getItem('ufc-picks:display-name') || '';
      card=document.createElement('details');
      card.id='picksPinSignInCard';
      card.className='picks-pin-card picks-pin-signin';
      card.open=true;
      card.innerHTML=`<summary><div><span>RETURNING MEMBER</span><strong>Sign In to Your Profile</strong></div><b>4-DIGIT PIN</b></summary>
        <div class="picks-pin-content">
          <p class="picks-pin-intro">Use the same profile in Safari, the Home Screen app, or a replacement phone.</p>
          <div class="picks-pin-fields">
            <label>Group code<input id="picksPinGroupCode" maxlength="6" autocapitalize="characters" autocomplete="off" placeholder="ABC123" value="${safe(code)}"></label>
            <label>Existing display name<input id="picksPinDisplayName" maxlength="30" autocomplete="nickname" placeholder="Shane" value="${safe(name)}"></label>
            <label>4-digit PIN<input id="picksPinValue" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" placeholder="••••"></label>
          </div>
          <button id="picksPinSignInButton" class="picks-pin-primary" type="button">Sign In</button>
          <div id="picksPinSignInStatus" class="picks-pin-status" role="status" aria-live="polite"></div>
          <small>Signing in moves this profile’s access to this device. Picks, points, avatar, and history stay unchanged.</small>
        </div>`;
      card.querySelector('#picksPinSignInButton')?.addEventListener('click',signIn);
      card.querySelectorAll('input').forEach(input=>input.addEventListener('keydown',event=>{
        if(event.key==='Enter') signIn();
      }));
    }

    if(card.parentElement!==host) host.prepend(card);
  }

  function renderPinSettings(data){
    const card=document.getElementById('picksPinSettingsCard');
    const target=document.getElementById('picksPinSettingsContent');
    if(!card || !target) return;

    const hasPin=Boolean(data?.has_pin);
    card.querySelector(':scope > summary b').textContent=hasPin ? 'READY' : 'SET UP';
    target.innerHTML=`<div class="picks-pin-profile-state ${hasPin?'ready':'needed'}">
        <span>${hasPin?'PIN READY':'ACTION NEEDED'}</span>
        <strong>${hasPin?'You can sign in on another device':'Create a PIN for portable sign-in'}</strong>
        <small>${hasPin?'Your group code, profile name, and PIN restore this profile anywhere.':'Choose four numbers you can remember. Do not use a recovery code here.'}</small>
      </div>
      <div class="picks-pin-fields compact">
        <label>${hasPin?'New 4-digit PIN':'Choose 4-digit PIN'}<input id="picksOwnPin" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" placeholder="••••"></label>
        <label>Confirm PIN<input id="picksOwnPinConfirm" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" placeholder="••••"></label>
      </div>
      <button id="picksSaveOwnPin" class="picks-pin-primary" type="button">${hasPin?'Change PIN':'Save PIN'}</button>
      <div id="picksOwnPinStatus" class="picks-pin-status" role="status" aria-live="polite"></div>`;
    document.getElementById('picksSaveOwnPin')?.addEventListener('click',saveOwnPin);
  }

  async function refreshPinStatus(force=false){
    if(statusLoading || !hasLocalAccess()) return;
    const code=resolveCode();
    const token=memberToken(code);
    const target=document.getElementById('picksPinSettingsContent');
    if(!target) return;
    if(!force && statusCode===code && target.dataset.loaded==='true') return;

    statusLoading=true;
    const {data,error}=await client.rpc('picks_member_pin_status',{
      p_group_code:code,
      p_member_token:token
    });
    statusLoading=false;

    if(error){
      const message=friendlyError(error,'Could not check PIN status.');
      target.innerHTML=`<div class="picks-pin-error">${safe(message)}</div>`;
      if(/access expired|sign in/i.test(message)){
        accessInvalid=true;
        document.getElementById('picksPinSettingsCard')?.remove();
        ensureSignInCard();
      }
      return;
    }

    accessInvalid=false;
    statusCode=code;
    target.dataset.loaded='true';
    renderPinSettings(data);
  }

  function ensurePinSettings(){
    if(!hasLocalAccess()){
      document.getElementById('picksPinSettingsCard')?.remove();
      return;
    }

    const host=settingsHost();
    if(!host) return;
    let card=document.getElementById('picksPinSettingsCard');
    if(!card){
      card=document.createElement('details');
      card.id='picksPinSettingsCard';
      card.className='picks-pin-card picks-pin-settings';
      card.innerHTML='<summary><div><span>PROFILE ACCESS</span><strong>Member PIN</strong></div><b>CHECKING</b></summary><div id="picksPinSettingsContent" class="picks-pin-content"><div class="picks-pin-loading">Checking PIN status…</div></div>';
    }
    if(card.parentElement!==host) host.appendChild(card);
    refreshPinStatus();
  }

  function ownPinStatus(message,type=''){
    const node=document.getElementById('picksOwnPinStatus');
    if(!node) return;
    node.textContent=message || '';
    node.className=`picks-pin-status${type ? ` ${type}` : ''}`;
  }

  async function saveOwnPin(){
    const code=resolveCode();
    const token=memberToken(code);
    const pin=normalizePin(document.getElementById('picksOwnPin')?.value);
    const confirm=normalizePin(document.getElementById('picksOwnPinConfirm')?.value);
    const button=document.getElementById('picksSaveOwnPin');

    if(pin.length!==4){ ownPinStatus('PIN must be exactly four numbers.','error'); return; }
    if(pin!==confirm){ ownPinStatus('The two PIN entries do not match.','error'); return; }

    const original=button?.textContent;
    if(button){ button.disabled=true; button.textContent='Saving…'; }
    const {error}=await client.rpc('picks_member_set_pin',{
      p_group_code:code,
      p_member_token:token,
      p_pin:pin
    });
    if(button){ button.disabled=false; button.textContent=original || 'Save PIN'; }

    if(error){
      const message=friendlyError(error,'PIN was not saved.');
      ownPinStatus(message,'error');
      toast(message);
      return;
    }

    ownPinStatus('PIN saved. You can now sign in on another device.','success');
    toast('Member PIN saved');
    const target=document.getElementById('picksPinSettingsContent');
    if(target) target.dataset.loaded='false';
    refreshPinStatus(true);
  }

  function closePinModal(){
    document.getElementById('picksCommissionerPinModal')?.remove();
    document.body.classList.remove('picks-pin-modal-open');
  }

  function openCommissionerPin(button){
    closePinModal();
    const memberId=button.dataset.pinMember;
    const memberName=button.dataset.memberName || 'member';
    const modal=document.createElement('div');
    modal.id='picksCommissionerPinModal';
    modal.className='picks-pin-modal';
    modal.setAttribute('role','dialog');
    modal.setAttribute('aria-modal','true');
    modal.innerHTML=`<div class="picks-pin-dialog">
      <span>COMMISSIONER</span>
      <h3>Set PIN for ${safe(memberName)}</h3>
      <p>Choose a temporary or permanent four-digit PIN, then send the group code, profile name, and PIN privately.</p>
      <label>4-digit PIN<input id="picksCommissionerPin" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" placeholder="••••"></label>
      <label>Confirm PIN<input id="picksCommissionerPinConfirm" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" placeholder="••••"></label>
      <div id="picksCommissionerPinStatus" class="picks-pin-status" role="status" aria-live="polite"></div>
      <div class="picks-pin-dialog-actions"><button type="button" data-cancel-pin>Cancel</button><button id="picksCommissionerPinSave" class="picks-pin-primary" type="button">Save PIN</button></div>
    </div>`;
    document.body.appendChild(modal);
    document.body.classList.add('picks-pin-modal-open');
    modal.querySelector('[data-cancel-pin]')?.addEventListener('click',closePinModal);
    modal.addEventListener('click',event=>{ if(event.target===modal) closePinModal(); });
    modal.querySelector('#picksCommissionerPinSave')?.addEventListener('click',()=>saveCommissionerPin(memberId,memberName));
    modal.querySelector('#picksCommissionerPin')?.focus();
  }

  async function saveCommissionerPin(memberId,memberName){
    const code=resolveCode();
    const admin=adminToken(code);
    const pin=normalizePin(document.getElementById('picksCommissionerPin')?.value);
    const confirm=normalizePin(document.getElementById('picksCommissionerPinConfirm')?.value);
    const status=document.getElementById('picksCommissionerPinStatus');
    const button=document.getElementById('picksCommissionerPinSave');
    const show=(message,type='')=>{
      if(!status) return;
      status.textContent=message;
      status.className=`picks-pin-status${type ? ` ${type}` : ''}`;
    };

    if(pin.length!==4){ show('PIN must be exactly four numbers.','error'); return; }
    if(pin!==confirm){ show('The two PIN entries do not match.','error'); return; }
    if(!code || !admin){ show('Commissioner access is missing on this device.','error'); return; }

    const original=button?.textContent;
    if(button){ button.disabled=true; button.textContent='Saving…'; }
    const {error}=await client.rpc('picks_commissioner_set_member_pin',{
      p_group_code:code,
      p_admin_token:admin,
      p_member_id:memberId,
      p_pin:pin
    });
    if(button){ button.disabled=false; button.textContent=original || 'Save PIN'; }

    if(error){
      const message=friendlyError(error,'PIN was not saved.');
      show(message,'error');
      return;
    }

    show(`PIN saved for ${memberName}.`,'success');
    toast(`PIN saved for ${memberName}`);
    setTimeout(closePinModal,700);
  }

  function decorateCommissioner(){
    if(!hasLocalAccess() || !adminToken(resolveCode())) return;
    document.querySelectorAll('.commissioner-member:not(.inactive)').forEach(article=>{
      if(article.querySelector('[data-pin-member]')) return;
      const source=article.querySelector('[data-transfer-member],[data-remove-member]');
      if(!source) return;
      const memberId=source.dataset.transferMember || source.dataset.removeMember;
      const memberName=source.dataset.memberName || article.querySelector('strong')?.textContent?.replace(/COMMISSIONER/i,'').trim() || 'member';
      const actions=source.parentElement;
      if(!memberId || !actions) return;
      const button=document.createElement('button');
      button.type='button';
      button.dataset.pinMember=memberId;
      button.dataset.memberName=memberName;
      button.className='commissioner-pin-button';
      button.textContent='Set PIN';
      actions.prepend(button);
    });
  }

  function decorateGroupCode(){
    const code=resolveCode();
    const label=document.querySelector('#picksGroupCard > summary span');
    if(!code || !label) return;
    label.textContent=`UFC PICKS GROUP · CODE ${code}`;
    label.title=`Group code ${code}`;
  }

  function sync(){
    document.body.classList.add('picks-pin-auth-ready');
    ensureSignInCard();
    ensurePinSettings();
    decorateCommissioner();
    decorateGroupCode();
  }

  function start(){
    sync();
    document.addEventListener('click',event=>{
      const button=event.target.closest?.('[data-pin-member]');
      if(button) openCommissionerPin(button);
    });
    const observer=new MutationObserver(()=>{
      clearTimeout(start.timer);
      start.timer=setTimeout(sync,120);
    });
    observer.observe(document.getElementById('picks') || document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class']});
    window.addEventListener('picks:routechange',()=>setTimeout(sync,50));
    window.setInterval(()=>refreshPinStatus(),45000);
    window.UFCPicksPinAuth={refresh:sync};
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

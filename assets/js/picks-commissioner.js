(function(){
  'use strict';

  const config=window.UFC_SUPABASE_CONFIG || {};
  if(!config.url || !config.anonKey || !window.supabase?.createClient) return;

  const client=window.supabase.createClient(config.url,config.anonKey);
  const GROUP_TOKEN_PREFIX='ufc-picks:group:';
  const GROUP_ADMIN_PREFIX='ufc-picks:group-admin:';
  const ROOM_TOKEN_PREFIX='ufc-picks:room:';
  const ROOM_ADMIN_PREFIX='ufc-picks:admin:';
  const state={code:'',adminToken:'',memberToken:'',snapshot:null,claimStatus:null,transferInfo:null,oddsEventId:'',loading:false,lastSignature:''};

  const safe=value=>String(value ?? '').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const normalize=value=>String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);

  function toast(message){
    const node=document.getElementById('picksToast');
    if(!node) return;
    node.textContent=message;
    node.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>node.classList.remove('show'),1900);
  }

  function storedCode(prefix){
    const matches=[];
    for(let i=0;i<localStorage.length;i+=1){
      const key=localStorage.key(i) || '';
      if(!key.startsWith(prefix)) continue;
      const code=normalize(key.slice(prefix.length));
      if(code && localStorage.getItem(key)) matches.push(code);
    }
    return matches.length===1 ? matches[0] : '';
  }

  function resolveCode(){
    const url=new URL(window.location.href);
    return normalize(url.searchParams.get('group'))
      || storedCode(GROUP_ADMIN_PREFIX)
      || storedCode(GROUP_TOKEN_PREFIX);
  }

  function context(){
    const code=resolveCode();
    return {
      code,
      adminToken:code ? localStorage.getItem(`${GROUP_ADMIN_PREFIX}${code}`) || '' : '',
      memberToken:code ? localStorage.getItem(`${GROUP_TOKEN_PREFIX}${code}`) || '' : ''
    };
  }

  function ensureCard(){
    if(document.getElementById('picksCommissionerCard')) return;
    const shell=document.querySelector('#picks .picks-shell');
    if(!shell) return;
    const card=document.createElement('details');
    card.id='picksCommissionerCard';
    card.className='picks-commissioner-card';
    card.hidden=true;
    card.innerHTML='<summary><div><span>GROUP CONTROL</span><strong>Commissioner</strong></div><b id="picksCommissionerSummary">Settings</b></summary><div id="picksCommissionerContent" class="picks-commissioner-content"></div>';
    const manager=document.getElementById('picksEventManagerCard');
    const group=document.getElementById('picksGroupCard');
    if(manager) manager.insertAdjacentElement('afterend',card);
    else if(group) group.insertAdjacentElement('afterend',card);
    else shell.prepend(card);
  }

  function formatDate(value){
    if(!value) return '';
    return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(new Date(value));
  }

  function formatOdds(value){
    const number=Number(value);
    if(!Number.isFinite(number) || number===0) return '';
    return number>0 ? `+${number}` : String(number);
  }

  function activeSeason(){
    return state.snapshot?.seasons?.find(season=>season.is_active) || null;
  }

  function seasonSection(){
    const season=activeSeason();
    if(!season) return '<section class="commissioner-section"><div class="commissioner-empty">No active season found.</div></section>';
    const history=(state.snapshot.seasons || []).filter(item=>!item.is_active);
    return `<section class="commissioner-section">
      <div class="commissioner-section-head"><div><span>ACTIVE SEASON</span><h3>${safe(season.name)}</h3></div><b>${season.event_count} event${season.event_count===1?'':'s'}</b></div>
      <div class="commissioner-form-grid">
        <label>Season name<input id="commissionerSeasonName" value="${safe(season.name)}" maxlength="40"></label>
        <label>Correct pick points<input id="commissionerCorrectPoints" type="number" min="1" max="5" value="${safe(season.correct_points)}"></label>
        <label>Underdog Lock bonus<input id="commissionerLockBonus" type="number" min="0" max="5" value="${safe(season.underdog_bonus)}"></label>
      </div>
      <div class="commissioner-inline-actions"><button id="commissionerSaveSeason" type="button">Save season settings</button><small>Scoring locks after the first pick of the season.</small></div>
      <details class="commissioner-subpanel">
        <summary>Start a new season</summary>
        <div class="commissioner-form-grid">
          <label>New season name<input id="commissionerNewSeasonName" value="Season ${state.snapshot.seasons.length+1}" maxlength="40"></label>
          <label>Correct pick points<input id="commissionerNewCorrectPoints" type="number" min="1" max="5" value="1"></label>
          <label>Underdog Lock bonus<input id="commissionerNewLockBonus" type="number" min="0" max="5" value="1"></label>
        </div>
        <button id="commissionerStartSeason" class="commissioner-primary" type="button">Start New Season</button>
        <p>Current standings are archived. Members and past events stay intact.</p>
      </details>
      ${history.length ? `<div class="commissioner-season-history"><span>PAST SEASONS</span>${history.map(item=>`<div><strong>${safe(item.name)}</strong><small>${item.event_count} events · ${item.correct_points} per win · +${item.underdog_bonus} lock · ended ${safe(formatDate(item.ended_at))}</small></div>`).join('')}</div>` : ''}
    </section>`;
  }

  function memberSection(){
    const members=state.snapshot?.members || [];
    return `<section class="commissioner-section">
      <div class="commissioner-section-head"><div><span>ROSTER</span><h3>Member Management</h3></div><b>${members.filter(member=>member.is_active).length} active</b></div>
      <div class="commissioner-members">${members.map(member=>`<article class="commissioner-member${member.is_active?'':' inactive'}">
        <div><strong>${safe(member.display_name)}${member.is_owner?' <em>COMMISSIONER</em>':''}</strong><small>${member.is_active?'Active member':`Removed ${formatDate(member.removed_at)}`}</small></div>
        ${member.is_active && !member.is_owner ? `<div><button type="button" data-transfer-member="${safe(member.id)}" data-member-name="${safe(member.display_name)}">Transfer</button><button type="button" class="danger" data-remove-member="${safe(member.id)}" data-member-name="${safe(member.display_name)}">Remove</button></div>` : ''}
      </article>`).join('')}</div>
      ${transferBlock()}
    </section>`;
  }

  function transferBlock(){
    const info=state.transferInfo;
    const pending=state.snapshot?.pending_transfer;
    if(info) return `<div class="commissioner-transfer-code"><span>TRANSFER CODE FOR ${safe(info.target_name)}</span><strong>${safe(info.claim_code)}</strong><small>Expires in 30 minutes. Send this code only to ${safe(info.target_name)}.</small><button id="commissionerCopyTransfer" type="button">Copy code</button></div>`;
    if(pending) return `<div class="commissioner-transfer-pending"><strong>Ownership transfer pending</strong><small>${safe(pending.target_name)} has until ${safe(new Date(pending.expires_at).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}))} to claim it. Start another transfer to replace it.</small></div>`;
    return '';
  }

  function eventSection(){
    const events=state.snapshot?.events || [];
    const selected=events.find(event=>event.event_id===state.oddsEventId) || events[0] || null;
    if(selected && (!state.oddsEventId || !events.some(event=>event.event_id===state.oddsEventId))) state.oddsEventId=selected.event_id;
    const options=events.map(event=>`<option value="${safe(event.event_id)}" ${selected?.event_id===event.event_id?'selected':''}>${safe(event.name)} · ${safe(event.status)}</option>`).join('');
    return `<section class="commissioner-section">
      <div class="commissioner-section-head"><div><span>EVENT CONTROL</span><h3>Corrections & Reopening</h3></div><b>${events.length} total</b></div>
      <div class="commissioner-events">${events.map(event=>`<article class="commissioner-event">
        <div><span>${safe(event.status)}</span><strong>${safe(event.name)}</strong><small>${safe(event.subtitle || '')}</small></div>
        ${event.status==='complete' ? `<button type="button" data-reopen-event="${safe(event.event_id)}" data-event-name="${safe(event.name)}">Reopen</button>` : `<b>${safe(formatDate(event.event_date))}</b>`}
      </article>`).join('')}</div>
      ${selected ? `<details class="commissioner-subpanel commissioner-odds" open>
        <summary>Correct event odds</summary>
        <label class="commissioner-event-select">Event<select id="commissionerOddsEvent">${options}</select></label>
        <div class="commissioner-odds-list">${(selected.fights || []).map(fight=>`<div class="commissioner-odds-row">
          <div><span>${String(fight.order || '').padStart(2,'0')}</span><strong>${safe(fight.red)} <em>vs.</em> ${safe(fight.blue)}</strong><small>${fight.winner?`Winner: ${safe(fight.winner)}`:safe(fight.result_status)}</small></div>
          <label>${safe(fight.red)}<input data-red-odds="${safe(fight.id)}" type="number" value="${safe(fight.red_odds ?? '')}" placeholder="${safe(formatOdds(fight.red_odds))}"></label>
          <label>${safe(fight.blue)}<input data-blue-odds="${safe(fight.id)}" type="number" value="${safe(fight.blue_odds ?? '')}" placeholder="${safe(formatOdds(fight.blue_odds))}"></label>
          <button type="button" data-save-odds="${safe(fight.id)}">Save</button>
        </div>`).join('')}</div>
      </details>` : '<div class="commissioner-empty">No group events yet.</div>'}
    </section>`;
  }

  function renderOwner(){
    ensureCard();
    const card=document.getElementById('picksCommissionerCard');
    const target=document.getElementById('picksCommissionerContent');
    const summary=document.getElementById('picksCommissionerSummary');
    if(!card || !target || !state.snapshot) return;
    card.hidden=false;
    summary.textContent=`${activeSeason()?.name || 'Season'} · ${state.snapshot.members.filter(member=>member.is_active).length} members`;
    target.innerHTML=`
      <section class="commissioner-hero">
        <div><span>COMMISSIONER CONTROLS</span><h3>${safe(state.snapshot.group.name)}</h3><p>Manage the group without touching Supabase.</p></div>
        <div class="commissioner-rename"><input id="commissionerGroupName" value="${safe(state.snapshot.group.name)}" maxlength="50"><button id="commissionerRenameGroup" type="button">Rename Group</button></div>
      </section>
      ${seasonSection()}
      ${memberSection()}
      ${eventSection()}`;
    bindOwner();
  }

  function renderClaim(){
    ensureCard();
    const card=document.getElementById('picksCommissionerCard');
    const target=document.getElementById('picksCommissionerContent');
    const summary=document.getElementById('picksCommissionerSummary');
    if(!card || !target) return;
    card.hidden=!state.claimStatus?.pending;
    if(card.hidden){ target.innerHTML=''; return; }
    card.open=true;
    summary.textContent='Ownership waiting';
    target.innerHTML=`<section class="commissioner-claim"><span>OWNERSHIP TRANSFER</span><h3>You were selected as commissioner</h3><p>Enter the eight-character code the current commissioner sent you.</p><div><input id="commissionerClaimCode" maxlength="8" autocapitalize="characters" placeholder="AB12CD34"><button id="commissionerClaimOwnership" type="button">Claim Commissioner Role</button></div></section>`;
    document.getElementById('commissionerClaimOwnership')?.addEventListener('click',claimOwnership);
  }

  function bindOwner(){
    document.getElementById('commissionerRenameGroup')?.addEventListener('click',renameGroup);
    document.getElementById('commissionerSaveSeason')?.addEventListener('click',saveSeason);
    document.getElementById('commissionerStartSeason')?.addEventListener('click',startSeason);
    document.getElementById('commissionerCopyTransfer')?.addEventListener('click',()=>navigator.clipboard?.writeText(state.transferInfo?.claim_code || '').then(()=>toast('Transfer code copied')));
    document.querySelectorAll('[data-remove-member]').forEach(button=>button.addEventListener('click',()=>removeMember(button.dataset.removeMember,button.dataset.memberName)));
    document.querySelectorAll('[data-transfer-member]').forEach(button=>button.addEventListener('click',()=>beginTransfer(button.dataset.transferMember,button.dataset.memberName)));
    document.querySelectorAll('[data-reopen-event]').forEach(button=>button.addEventListener('click',()=>reopenEvent(button.dataset.reopenEvent,button.dataset.eventName)));
    document.getElementById('commissionerOddsEvent')?.addEventListener('change',event=>{ state.oddsEventId=event.target.value; renderOwner(); });
    document.querySelectorAll('[data-save-odds]').forEach(button=>button.addEventListener('click',()=>saveOdds(button.dataset.saveOdds,button)));
  }

  async function rpc(name,args,button,working){
    const original=button?.textContent;
    if(button){ button.disabled=true; if(working) button.textContent=working; }
    const {data,error}=await client.rpc(name,args);
    if(button){ button.disabled=false; if(original) button.textContent=original; }
    if(error){ toast(error.message || 'That change was not saved'); return {data:null,error}; }
    return {data,error:null};
  }

  async function renameGroup(){
    const button=document.getElementById('commissionerRenameGroup');
    const name=document.getElementById('commissionerGroupName')?.value.trim();
    if(!name){ toast('Enter a group name'); return; }
    const result=await rpc('picks_commissioner_rename_group',{p_group_code:state.code,p_admin_token:state.adminToken,p_name:name},button,'Saving…');
    if(result.error) return;
    toast('Group renamed');
    await refresh(true);
  }

  async function saveSeason(){
    const button=document.getElementById('commissionerSaveSeason');
    const name=document.getElementById('commissionerSeasonName')?.value.trim();
    const correct=Number(document.getElementById('commissionerCorrectPoints')?.value);
    const bonus=Number(document.getElementById('commissionerLockBonus')?.value);
    const result=await rpc('picks_commissioner_update_season',{p_group_code:state.code,p_admin_token:state.adminToken,p_season_name:name,p_correct_points:correct,p_underdog_bonus:bonus},button,'Saving…');
    if(result.error) return;
    toast('Season settings saved');
    await refresh(true);
  }

  async function startSeason(){
    const name=document.getElementById('commissionerNewSeasonName')?.value.trim();
    const correct=Number(document.getElementById('commissionerNewCorrectPoints')?.value);
    const bonus=Number(document.getElementById('commissionerNewLockBonus')?.value);
    if(!window.confirm(`Start ${name}? Current standings will move to season history.`)) return;
    const button=document.getElementById('commissionerStartSeason');
    const result=await rpc('picks_commissioner_start_season',{p_group_code:state.code,p_admin_token:state.adminToken,p_name:name,p_correct_points:correct,p_underdog_bonus:bonus},button,'Starting…');
    if(result.error) return;
    toast(`${name} started`);
    window.setTimeout(()=>window.location.reload(),500);
  }

  async function removeMember(id,name){
    if(!window.confirm(`Remove ${name} from the permanent group? Their past results stay in history.`)) return;
    const result=await rpc('picks_commissioner_remove_member',{p_group_code:state.code,p_admin_token:state.adminToken,p_member_id:id});
    if(result.error) return;
    toast(`${name} removed`);
    await refresh(true);
  }

  async function beginTransfer(id,name){
    if(!window.confirm(`Transfer commissioner control to ${name}? They must claim it with a one-time code.`)) return;
    const result=await rpc('picks_commissioner_begin_transfer',{p_group_code:state.code,p_admin_token:state.adminToken,p_target_member_id:id});
    if(result.error) return;
    state.transferInfo=result.data;
    renderOwner();
    toast('Transfer code created');
  }

  async function reopenEvent(id,name){
    if(!window.confirm(`Reopen ${name} for result corrections? Existing results and picks stay intact.`)) return;
    const result=await rpc('picks_commissioner_reopen_event',{p_group_code:state.code,p_admin_token:state.adminToken,p_event_id:id});
    if(result.error) return;
    const roomCode=normalize(result.data?.room_code);
    toast(`${name} reopened`);
    if(roomCode){
      if(state.memberToken) localStorage.setItem(`${ROOM_TOKEN_PREFIX}${roomCode}`,state.memberToken);
      localStorage.setItem(`${ROOM_ADMIN_PREFIX}${roomCode}`,state.adminToken);
      localStorage.setItem('ufc-picks:last-room',roomCode);
      localStorage.removeItem('ufc-picks:auto-restore-disabled');
      const url=new URL(window.location.href);
      url.searchParams.set('group',state.code);
      url.searchParams.set('room',roomCode);
      url.searchParams.set('event',id);
      url.hash='picks';
      window.setTimeout(()=>window.location.assign(url.toString()),350);
      return;
    }
    await refresh(true);
  }

  function nullableNumber(value){
    if(value==='' || value==null) return null;
    const number=Number(value);
    return Number.isFinite(number) ? number : null;
  }

  async function saveOdds(fightId,button){
    const red=nullableNumber(document.querySelector(`[data-red-odds="${CSS.escape(fightId)}"]`)?.value);
    const blue=nullableNumber(document.querySelector(`[data-blue-odds="${CSS.escape(fightId)}"]`)?.value);
    const result=await rpc('picks_commissioner_update_odds',{p_group_code:state.code,p_admin_token:state.adminToken,p_fight_id:fightId,p_red_odds:red,p_blue_odds:blue},button,'Saving…');
    if(result.error) return;
    toast('Odds corrected');
    await refresh(true);
  }

  async function claimOwnership(){
    const code=document.getElementById('commissionerClaimCode')?.value.trim().toUpperCase();
    const button=document.getElementById('commissionerClaimOwnership');
    if(code?.length!==8){ toast('Enter the eight-character transfer code'); return; }
    const result=await rpc('picks_claim_group_ownership',{p_group_code:state.code,p_member_token:state.memberToken,p_claim_code:code},button,'Claiming…');
    if(result.error) return;
    localStorage.setItem(`${GROUP_ADMIN_PREFIX}${state.code}`,result.data.admin_token);
    (result.data.room_codes || []).forEach(roomCode=>localStorage.setItem(`${ROOM_ADMIN_PREFIX}${roomCode}`,result.data.admin_token));
    toast('You are now the commissioner');
    window.setTimeout(()=>window.location.reload(),500);
  }

  async function refresh(force=false){
    if(state.loading) return;
    ensureCard();
    const next=context();
    if(!next.code) return;
    state.code=next.code;
    state.adminToken=next.adminToken;
    state.memberToken=next.memberToken;
    state.loading=true;
    try{
      if(state.adminToken){
        const {data,error}=await client.rpc('picks_commissioner_snapshot',{p_group_code:state.code,p_admin_token:state.adminToken});
        if(error || !data?.group) return;
        const signature=`owner:${JSON.stringify(data)}`;
        state.snapshot=data;
        state.claimStatus=null;
        if(force || signature!==state.lastSignature){ state.lastSignature=signature; renderOwner(); }
      }else if(state.memberToken){
        const {data}=await client.rpc('picks_commissioner_transfer_status',{p_group_code:state.code,p_member_token:state.memberToken});
        const signature=`claim:${JSON.stringify(data || {})}`;
        state.claimStatus=data || {pending:false};
        if(force || signature!==state.lastSignature){ state.lastSignature=signature; renderClaim(); }
      }
    }finally{
      state.loading=false;
    }
  }

  function start(){
    ensureCard();
    refresh();
    const observer=new MutationObserver(()=>{
      ensureCard();
      clearTimeout(start.timer);
      start.timer=setTimeout(()=>refresh(),300);
    });
    observer.observe(document.getElementById('picks') || document.body,{childList:true,subtree:true});
    window.setInterval(()=>refresh(),45000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

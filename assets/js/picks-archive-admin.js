(function(){
  'use strict';

  const config=window.UFC_SUPABASE_CONFIG || {};
  if(!config.url || !config.anonKey || !window.supabase?.createClient) return;

  const client=window.supabase.createClient(config.url,config.anonKey);
  const GROUP_TOKEN_PREFIX='ufc-picks:group:';
  const GROUP_ADMIN_PREFIX='ufc-picks:group-admin:';
  const ROOM_TOKEN_PREFIX='ufc-picks:room:';
  const ROOM_ADMIN_PREFIX='ufc-picks:admin:';
  const state={roomCode:'',roomSnapshot:null,event:null,adminSnapshot:null,loadingRoom:false,loadingAdmin:false,syncing:false,lastRoomSignature:'',lastAdminSignature:''};

  const safe=value=>String(value ?? '').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const normalize=value=>String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);

  function toast(message){
    const node=document.getElementById('picksToast');
    if(!node) return;
    node.textContent=message;
    node.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>node.classList.remove('show'),2100);
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

  function url(){ return new URL(window.location.href); }
  function roomCode(){ return normalize(url().searchParams.get('room')) || normalize(document.querySelector('#picksRoomBanner .picks-code')?.textContent); }
  function groupCode(){
    const direct=normalize(url().searchParams.get('group'));
    if(direct) return direct;
    const codes=storedCodes(GROUP_TOKEN_PREFIX);
    return codes.length===1 ? codes[0] : '';
  }
  function roomToken(code){ return code ? localStorage.getItem(`${ROOM_TOKEN_PREFIX}${code}`) || '' : ''; }
  function roomAdmin(code){ return code ? localStorage.getItem(`${ROOM_ADMIN_PREFIX}${code}`) || '' : ''; }
  function groupAdmin(code){ return code ? localStorage.getItem(`${GROUP_ADMIN_PREFIX}${code}`) || '' : ''; }
  function isArchive(){ return url().searchParams.get('archive')==='1'; }

  function hideRetiredRecovery(){
    ['picksRecoveryCard','picksInviteRecovery'].forEach(id=>{
      const node=document.getElementById(id);
      if(node && !node.hidden) node.hidden=true;
    });
  }

  function syncRoomSetup(){
    const setup=document.getElementById('picksRoomSetup');
    if(!setup) return;
    const code=groupCode();
    const room=roomCode();
    const hasAccess=Boolean((code && localStorage.getItem(`${GROUP_TOKEN_PREFIX}${code}`)) || (room && roomToken(room)));
    const activeGroup=Boolean(document.querySelector('#picksGroupCard:not([hidden]) .picks-group-member'));
    if((hasAccess || activeGroup) && !setup.hidden) setup.hidden=true;
  }

  function returnToCurrentEvent(){
    const destination=url();
    const group=groupCode();
    if(group) destination.searchParams.set('group',group);
    destination.searchParams.delete('room');
    destination.searchParams.delete('event');
    destination.searchParams.delete('archive');
    destination.searchParams.set('picksView','event');
    destination.hash='picks';
    window.location.assign(destination.toString());
  }

  function pickFor(member,fightId){
    return (member?.visible_picks || []).find(pick=>pick.fight_id===fightId) || null;
  }

  function fightResult(fight){
    if(fight.winner) return `Winner: ${fight.winner}`;
    if(fight.resultStatus && fight.resultStatus!=='scheduled') return fight.resultStatus.replace(/-/g,' ');
    return 'Awaiting result';
  }

  function buildFightMap(snapshot,event){
    const members=snapshot?.members || [];
    const fights=[...(event?.fights || [])].sort((a,b)=>(a.order||0)-(b.order||0));
    return `<details class="picks-archive-fight-map">
      <summary><div><span>FINAL CARD</span><strong>Fight-by-Fight Recap</strong></div><b>${fights.length} fights</b></summary>
      <div class="picks-archive-fight-list">${fights.map(fight=>{
        const red=[];
        const blue=[];
        const missed=[];
        members.forEach(member=>{
          const pick=pickFor(member,fight.id);
          const name=`${member.display_name}${pick?.is_underdog_lock?' ★':''}`;
          if(!pick) missed.push(member.display_name);
          else if(pick.fighter_name===fight.red) red.push(name);
          else if(pick.fighter_name===fight.blue) blue.push(name);
          else missed.push(member.display_name);
        });
        return `<article class="picks-archive-fight-row">
          <div class="picks-archive-fight-head"><span>${String(fight.order||'').padStart(2,'0')}</span><div><strong>${safe(fight.red)} vs. ${safe(fight.blue)}</strong><small>${safe(fightResult(fight))}</small></div></div>
          <div class="picks-archive-pick-sides">
            <div class="${fight.winner===fight.red?'winner':''}"><b>${safe(fight.red)} · ${red.length}</b><small>${red.length?red.map(safe).join(', '):'No picks'}</small></div>
            <div class="${fight.winner===fight.blue?'winner':''}"><b>${safe(fight.blue)} · ${blue.length}</b><small>${blue.length?blue.map(safe).join(', '):'No picks'}</small></div>
          </div>
          ${missed.length?`<p>No pick: ${missed.map(safe).join(', ')}</p>`:''}
        </article>`;
      }).join('')}</div>
    </details>`;
  }

  function decorateRecap(){
    const recap=document.getElementById('picksEventRecap');
    if(!recap || recap.hidden || !recap.innerHTML.trim()) return;

    const kicker=recap.querySelector('.picks-recap-kicker');
    if(kicker && isArchive() && kicker.textContent!=='ARCHIVED EVENT FINAL') kicker.textContent='ARCHIVED EVENT FINAL';

    if(isArchive() && !recap.querySelector('.picks-archive-toolbar')){
      const toolbar=document.createElement('div');
      toolbar.className='picks-archive-toolbar';
      toolbar.innerHTML='<div><span>PAST EVENT</span><strong>You are viewing the saved event recap.</strong><small>Results, every member’s picks, and commissioner corrections stay attached to this event.</small></div><button type="button" id="picksReturnCurrentEvent">Return to Current Event</button>';
      recap.prepend(toolbar);
      toolbar.querySelector('#picksReturnCurrentEvent')?.addEventListener('click',returnToCurrentEvent);
    }

    if(state.roomSnapshot && state.event && !recap.querySelector('.picks-archive-fight-map')){
      const actions=recap.querySelector('.picks-recap-actions');
      const wrapper=document.createElement('div');
      wrapper.innerHTML=buildFightMap(state.roomSnapshot,state.event);
      const map=wrapper.firstElementChild;
      if(map) actions?.insertAdjacentElement('beforebegin',map);
    }
  }

  function correctionAllowed(){
    const panel=document.getElementById('picksAdminPanel');
    if(!panel) return false;
    if(!panel.classList.contains('picks-final-corrections')) return true;
    return panel.classList.contains('correction-mode');
  }

  function buildMemberCorrections(snapshot,event){
    const members=snapshot?.members || [];
    const fights=[...(event?.fights || [])].sort((a,b)=>(a.order||0)-(b.order||0));
    const disabled=correctionAllowed() ? '' : ' disabled';
    return `<section id="picksMemberPickCorrections" class="picks-member-corrections">
      <div class="picks-member-corrections-head"><div><span>COMMISSIONER</span><h4>Member Pick Corrections</h4><p>Edit a saved pick or Underdog Lock without changing the member’s identity or history.</p></div><b>${members.length} members</b></div>
      <div class="picks-member-correction-list">${members.map(member=>`<details class="picks-member-correction">
        <summary><div><strong>${safe(member.display_name)}</strong><small>${member.correct||0}/${member.picks_made||0} correct · ${member.score||0} pts</small></div><b>Edit picks</b></summary>
        <div class="picks-member-correction-fights">${fights.map(fight=>{
          const pick=pickFor(member,fight.id);
          return `<div class="picks-member-correction-row" data-member="${safe(member.id)}" data-fight="${safe(fight.id)}">
            <div><span>${String(fight.order||'').padStart(2,'0')}</span><strong>${safe(fight.red)} vs. ${safe(fight.blue)}</strong><small>${safe(fightResult(fight))}</small></div>
            <select data-member-pick${disabled} aria-label="Pick for ${safe(member.display_name)} on ${safe(fight.red)} vs. ${safe(fight.blue)}">
              <option value="" ${!pick?'selected':''}>No pick</option>
              <option value="${safe(fight.red)}" ${pick?.fighter_name===fight.red?'selected':''}>${safe(fight.red)}</option>
              <option value="${safe(fight.blue)}" ${pick?.fighter_name===fight.blue?'selected':''}>${safe(fight.blue)}</option>
            </select>
            <label><input type="checkbox" data-member-lock ${pick?.is_underdog_lock?'checked':''}${disabled}> Lock</label>
          </div>`;
        }).join('')}</div>
      </details>`).join('')}</div>
    </section>`;
  }

  function bindMemberCorrections(section){
    section.querySelectorAll('[data-member-pick],[data-member-lock]').forEach(control=>control.addEventListener('change',async event=>{
      const row=event.currentTarget.closest('.picks-member-correction-row');
      const select=row?.querySelector('[data-member-pick]');
      const lock=row?.querySelector('[data-member-lock]');
      if(!row || !select || !lock) return;
      if(lock.checked && !select.value){
        lock.checked=false;
        toast('Choose a fighter before adding the Underdog Lock');
        return;
      }
      await saveMemberPick(row.dataset.member,row.dataset.fight,select.value,lock.checked,row);
    }));
  }

  async function saveMemberPick(memberId,fightId,fighterName,isLock,row){
    const code=roomCode();
    const admin=roomAdmin(code) || groupAdmin(groupCode());
    if(!code || !admin){ toast('Commissioner access is missing on this device'); return; }
    row.classList.add('saving');
    row.querySelectorAll('select,input').forEach(control=>{ control.disabled=true; });
    const {error}=await client.rpc('picks_commissioner_set_member_pick',{
      p_room_code:code,
      p_admin_token:admin,
      p_member_id:memberId,
      p_fight_id:fightId,
      p_fighter_name:fighterName || null,
      p_is_underdog_lock:Boolean(isLock)
    });
    if(error){
      row.classList.remove('saving');
      row.querySelectorAll('select,input').forEach(control=>{ control.disabled=!correctionAllowed(); });
      toast(error.message || 'That pick correction was not saved');
      return;
    }
    toast(fighterName ? 'Member pick updated' : 'Member pick removed');
    window.setTimeout(()=>window.location.reload(),450);
  }

  function decorateAdmin(){
    const panel=document.getElementById('picksAdminPanel');
    const content=document.getElementById('picksAdminContent');
    const code=roomCode();
    const admin=roomAdmin(code) || groupAdmin(groupCode());
    if(!panel || !content || !code || !admin || !state.roomSnapshot || !state.event) return;

    if(panel.hidden) panel.hidden=false;
    const summary=panel.querySelector(':scope > summary');
    if(summary && !state.roomSnapshot.room?.is_result_admin && !summary.textContent.includes('Event Corrections')) summary.innerHTML='Event Corrections <span>Commissioner</span>';

    const signature=JSON.stringify({
      room:code,
      event:state.event.id,
      allowed:correctionAllowed(),
      members:(state.roomSnapshot.members||[]).map(member=>[member.id,member.display_name,member.score,member.correct,member.picks_made,(member.visible_picks||[]).map(pick=>[pick.fight_id,pick.fighter_name,pick.is_underdog_lock])])
    });
    const existing=document.getElementById('picksMemberPickCorrections');
    if(existing?.dataset.signature===signature) return;
    existing?.remove();
    const wrapper=document.createElement('div');
    wrapper.innerHTML=buildMemberCorrections(state.roomSnapshot,state.event);
    const section=wrapper.firstElementChild;
    if(!section) return;
    section.dataset.signature=signature;
    const eventActions=content.querySelector('.picks-admin-event-actions');
    if(eventActions) eventActions.insertAdjacentElement('beforebegin',section);
    else content.appendChild(section);
    bindMemberCorrections(section);
  }

  async function loadRoomContext(force=false){
    const code=roomCode();
    const token=roomToken(code);
    if(!code || !token){ state.roomCode=''; state.roomSnapshot=null; state.event=null; return; }
    if(state.loadingRoom) return;
    if(!force && state.roomCode===code && state.roomSnapshot && state.event) return;
    state.loadingRoom=true;
    try{
      const [{data:snapshot,error:snapshotError},{data:events,error:eventError}]=await Promise.all([
        client.rpc('picks_room_snapshot',{p_room_code:code,p_member_token:token}),
        client.rpc('picks_public_events')
      ]);
      if(snapshotError || eventError || !snapshot?.room || !Array.isArray(events)) return;
      state.roomCode=code;
      state.roomSnapshot=snapshot;
      state.event=events.find(event=>event.id===snapshot.room.event_id) || null;
      state.lastRoomSignature=JSON.stringify({room:code,event:state.event?.id,members:(snapshot.members||[]).map(member=>[member.id,member.score,member.correct,member.picks_made,(member.visible_picks||[]).length])});
    }finally{
      state.loadingRoom=false;
    }
  }

  function memberNameFromArticle(article){
    const clone=article.querySelector('strong')?.cloneNode(true);
    clone?.querySelectorAll('em').forEach(node=>node.remove());
    return String(clone?.textContent || '').trim();
  }

  function promptRename(member){
    const next=window.prompt(`Rename ${member.display_name}`,member.display_name);
    if(next==null) return;
    const name=next.trim();
    if(!name || name===member.display_name) return;
    renameMember(member.id,name);
  }

  async function renameMember(memberId,name){
    const code=groupCode();
    const admin=groupAdmin(code);
    if(!code || !admin){ toast('Commissioner access is missing on this device'); return; }
    const {error}=await client.rpc('picks_commissioner_rename_member',{
      p_group_code:code,
      p_admin_token:admin,
      p_member_id:memberId,
      p_display_name:name
    });
    if(error){ toast(error.message || 'Member name was not changed'); return; }
    toast(`Member renamed to ${name}`);
    window.setTimeout(()=>window.location.reload(),450);
  }

  function decorateMemberRename(){
    const members=state.adminSnapshot?.members || [];
    if(!members.length) return;
    document.querySelectorAll('.commissioner-member:not(.inactive)').forEach(article=>{
      if(article.querySelector('[data-rename-member]')) return;
      const name=memberNameFromArticle(article);
      const member=members.find(item=>item.is_active && item.display_name===name);
      if(!member) return;
      let actions=article.querySelector(':scope > div:last-child');
      if(!actions || actions===article.firstElementChild){
        actions=document.createElement('div');
        article.appendChild(actions);
      }
      const button=document.createElement('button');
      button.type='button';
      button.dataset.renameMember=member.id;
      button.className='commissioner-rename-member';
      button.textContent='Rename';
      button.addEventListener('click',()=>promptRename(member));
      actions.prepend(button);
    });
  }

  function decoratePinCopy(){
    document.querySelectorAll('.commissioner-pin-button').forEach(button=>{ if(button.textContent!=='Set / Reset PIN') button.textContent='Set / Reset PIN'; });
    const modal=document.getElementById('picksCommissionerPinModal');
    const heading=modal?.querySelector('h3');
    if(heading) heading.textContent=heading.textContent.replace(/^Set PIN for /,'Set / Reset PIN for ');
  }

  async function loadAdminSnapshot(force=false){
    const code=groupCode();
    const admin=groupAdmin(code);
    if(!code || !admin){ state.adminSnapshot=null; return; }
    if(state.loadingAdmin) return;
    if(!force && state.adminSnapshot) return;
    state.loadingAdmin=true;
    try{
      const {data,error}=await client.rpc('picks_commissioner_snapshot',{p_group_code:code,p_admin_token:admin});
      if(error || !data?.group) return;
      state.adminSnapshot=data;
      state.lastAdminSignature=JSON.stringify((data.members||[]).map(member=>[member.id,member.display_name,member.is_active,member.is_owner]));
    }finally{
      state.loadingAdmin=false;
    }
  }

  async function sync(){
    if(state.syncing) return;
    state.syncing=true;
    try{
      hideRetiredRecovery();
      syncRoomSetup();
      await Promise.all([loadRoomContext(),loadAdminSnapshot()]);
      decorateRecap();
      decorateAdmin();
      decorateMemberRename();
      decoratePinCopy();
    }finally{
      state.syncing=false;
    }
  }

  function start(){
    sync();
    const observer=new MutationObserver(()=>{
      clearTimeout(start.timer);
      start.timer=setTimeout(sync,130);
    });
    observer.observe(document.getElementById('picks') || document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class','open']});
    window.addEventListener('picks:routechange',()=>setTimeout(sync,50));
    window.setInterval(async()=>{ await Promise.all([loadRoomContext(true),loadAdminSnapshot(true)]); sync(); },45000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

(function(){
  'use strict';

  const config=window.UFC_SUPABASE_CONFIG || {};
  if(!config.url || !config.anonKey || !window.supabase?.createClient) return;

  const client=window.supabase.createClient(config.url,config.anonKey);
  let busy=false;
  let pendingContext=null;

  const safe=value=>String(value ?? '').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

  function roomCode(){
    const url=new URL(window.location.href);
    return String(url.searchParams.get('room') || document.querySelector('#picksRoomBanner .picks-code')?.textContent || '').trim().toUpperCase();
  }

  function adminToken(code){
    return code ? localStorage.getItem(`ufc-picks:admin:${code}`) || '' : '';
  }

  function toast(message){
    const node=document.getElementById('picksToast');
    if(!node) return;
    node.textContent=message;
    node.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>node.classList.remove('show'),2200);
  }

  function ensureModal(){
    if(document.getElementById('picksCompletionGuard')) return;
    const modal=document.createElement('div');
    modal.id='picksCompletionGuard';
    modal.className='picks-completion-guard';
    modal.hidden=true;
    modal.innerHTML=`<div class="picks-completion-dialog" role="dialog" aria-modal="true" aria-labelledby="picksCompletionTitle">
      <span>EVENT CHECK</span>
      <h3 id="picksCompletionTitle">Unresolved fights remain</h3>
      <p id="picksCompletionCopy"></p>
      <div id="picksCompletionFights" class="picks-completion-fights"></div>
      <div class="picks-completion-actions">
        <button id="picksCompletionReturn" type="button">Go Back to Results</button>
        <button id="picksCompletionVoid" class="primary" type="button">Mark Cancelled & Complete</button>
      </div>
    </div>`;
    document.body.appendChild(modal);
    document.getElementById('picksCompletionReturn')?.addEventListener('click',closeModal);
    document.getElementById('picksCompletionVoid')?.addEventListener('click',completeWithCancellations);
    modal.addEventListener('click',event=>{ if(event.target===modal) closeModal(); });
  }

  function closeModal(){
    const modal=document.getElementById('picksCompletionGuard');
    if(modal) modal.hidden=true;
    document.body.classList.remove('picks-modal-open');
    pendingContext=null;
    document.getElementById('picksAdminPanel')?.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function openModal(context){
    ensureModal();
    pendingContext=context;
    const modal=document.getElementById('picksCompletionGuard');
    const count=context.unresolved.length;
    const copy=document.getElementById('picksCompletionCopy');
    const fights=document.getElementById('picksCompletionFights');
    const action=document.getElementById('picksCompletionVoid');
    if(copy) copy.textContent=`${count} fight${count===1?'':'s'} still ${count===1?'needs':'need'} a result. Return to the results panel, or mark every unresolved fight cancelled and finish the event.`;
    if(fights) fights.innerHTML=context.unresolved.slice(0,6).map(fight=>`<div>${safe(fight.red)} <span>vs.</span> ${safe(fight.blue)}</div>`).join('')+(count>6?`<small>+${count-6} more</small>`:'');
    if(action) action.textContent=`Mark ${count} Cancelled & Complete`;
    if(modal) modal.hidden=false;
    document.body.classList.add('picks-modal-open');
  }

  async function getCompletionContext(){
    const code=roomCode();
    const token=adminToken(code);
    if(!code || !token) throw new Error('Room-owner access was not found on this device.');

    const [{data:events,error:eventError},{data:snapshot,error:snapshotError}]=await Promise.all([
      client.rpc('picks_public_events'),
      client.rpc('picks_room_snapshot',{p_room_code:code,p_member_token:localStorage.getItem(`ufc-picks:room:${code}`) || ''})
    ]);
    if(eventError) throw eventError;
    if(snapshotError) throw snapshotError;
    const event=(events || []).find(item=>item.id===snapshot?.room?.event_id);
    if(!event) throw new Error('The current event could not be loaded.');
    return {
      code,
      token,
      event,
      unresolved:(event.fights || []).filter(fight=>!fight.resultStatus || fight.resultStatus==='scheduled')
    };
  }

  async function markComplete(context,button){
    const {error}=await client.rpc('picks_admin_set_event_status',{
      p_room_code:context.code,
      p_admin_token:context.token,
      p_event_status:'complete'
    });
    if(error) throw error;
    toast('Event completed');
    setTimeout(()=>window.location.reload(),450);
    if(button) button.disabled=false;
  }

  async function beginCompletion(button){
    if(busy) return;
    busy=true;
    const original=button.textContent;
    button.disabled=true;
    button.textContent='Checking fights…';
    try{
      const context=await getCompletionContext();
      if(context.unresolved.length) openModal(context);
      else await markComplete(context,button);
    }catch(error){
      toast(error?.message || 'The event could not be completed');
    }finally{
      busy=false;
      if(document.body.contains(button)){
        button.disabled=false;
        button.textContent=original;
      }
    }
  }

  async function completeWithCancellations(){
    if(busy || !pendingContext) return;
    busy=true;
    const button=document.getElementById('picksCompletionVoid');
    const original=button?.textContent;
    if(button){ button.disabled=true; button.textContent='Completing…'; }
    try{
      const {data,error}=await client.rpc('picks_admin_cancel_unresolved_and_complete',{
        p_room_code:pendingContext.code,
        p_admin_token:pendingContext.token
      });
      if(error) throw error;
      toast(`${data?.cancelled_count || pendingContext.unresolved.length} unresolved fight${(data?.cancelled_count || pendingContext.unresolved.length)===1?'':'s'} marked cancelled`);
      setTimeout(()=>window.location.reload(),500);
    }catch(error){
      toast(error?.message || 'The event could not be completed');
      if(button){ button.disabled=false; button.textContent=original; }
    }finally{
      busy=false;
    }
  }

  function polishLabels(){
    const completedHero=String(document.querySelector('#picksEventHero .picks-event-kicker')?.textContent || '').toLowerCase().includes('completed');
    const roomState=document.querySelector('#picksRoomBanner .picks-room-live');
    if(roomState && completedHero) roomState.textContent='Completed room';

    document.querySelectorAll('.picks-group-event').forEach(row=>{
      const status=String(row.querySelector('div > span')?.textContent || '').trim().toLowerCase();
      const button=row.querySelector('button[data-group-room]');
      if(!button) return;
      if(status==='complete'){
        button.textContent='Open recap';
        row.classList.remove('active');
      }else if(row.classList.contains('active')){
        button.textContent='Open current';
      }else{
        button.textContent='Open event';
      }
    });
  }

  function start(){
    ensureModal();
    document.addEventListener('click',event=>{
      const button=event.target.closest?.('#picksCompleteEvent');
      if(!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      beginCompletion(button);
    },true);

    polishLabels();
    const observer=new MutationObserver(()=>{
      clearTimeout(start.timer);
      start.timer=setTimeout(polishLabels,80);
    });
    observer.observe(document.getElementById('picks') || document.body,{childList:true,subtree:true});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

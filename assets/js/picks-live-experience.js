(function(){
  'use strict';

  const config=window.UFC_SUPABASE_CONFIG || {};
  if(!config.url || !config.anonKey || !window.supabase?.createClient) return;

  const client=window.supabase.createClient(config.url,config.anonKey);
  const state={
    roomCode:'',
    token:'',
    event:null,
    snapshot:null,
    previousFights:null,
    previousPositions:{},
    pollTimer:null,
    busy:false,
    lastUpdated:0,
    observer:null
  };

  const safe=value=>String(value ?? '').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const normalize=value=>String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);

  function roomCode(){
    const fromUrl=normalize(new URL(window.location.href).searchParams.get('room'));
    const fromBanner=normalize(document.querySelector('#picksRoomBanner .picks-code')?.textContent);
    return fromUrl || fromBanner;
  }

  function memberToken(code){
    return code ? localStorage.getItem(`ufc-picks:room:${code}`) : null;
  }

  function picksTabActive(){
    return document.getElementById('picks')?.classList.contains('active-view');
  }

  function isLocked(fight){
    return Boolean(fight?.winner)
      || Boolean(fight?.resultStatus && fight.resultStatus!=='scheduled')
      || Date.now()>=new Date(fight?.lockAt || 0).getTime();
  }

  function isFinalFight(fight){
    return Boolean(fight?.winner) || Boolean(fight?.resultStatus && fight.resultStatus!=='scheduled');
  }

  function formatTime(value){
    if(!value) return 'TBD';
    return new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit'}).format(new Date(value));
  }

  function formatResult(fight){
    if(fight.winner) return `${fight.winner} wins`;
    if(fight.resultStatus==='draw') return 'Draw';
    if(fight.resultStatus==='no-contest') return 'No contest';
    if(fight.resultStatus==='cancelled') return 'Cancelled';
    return 'Awaiting result';
  }

  function pickFor(member,fightId){
    return (member?.visible_picks || []).find(pick=>pick.fight_id===fightId) || null;
  }

  function myPickFor(fightId){
    return (state.snapshot?.my_picks || []).find(pick=>pick.fight_id===fightId) || null;
  }

  function ensureLivePanel(){
    if(document.getElementById('picksLivePanel')) return;
    const banner=document.getElementById('picksRoomBanner');
    const shell=document.querySelector('#picks .picks-shell');
    if(!shell) return;
    const panel=document.createElement('section');
    panel.id='picksLivePanel';
    panel.className='picks-live-panel';
    panel.hidden=true;
    if(banner) banner.insertAdjacentElement('afterend',panel);
    else shell.prepend(panel);
  }

  function ensureNoticeStack(){
    if(document.getElementById('picksLiveNotices')) return;
    const shell=document.querySelector('#picks .picks-shell');
    if(!shell) return;
    const stack=document.createElement('div');
    stack.id='picksLiveNotices';
    stack.className='picks-live-notices';
    shell.prepend(stack);
  }

  function showNotice(type,kicker,title,copy){
    ensureNoticeStack();
    const stack=document.getElementById('picksLiveNotices');
    if(!stack) return;
    const notice=document.createElement('div');
    notice.className=`picks-live-notice ${type}`;
    notice.innerHTML=`<span>${safe(kicker)}</span><strong>${safe(title)}</strong><small>${safe(copy)}</small><button type="button" aria-label="Dismiss">×</button>`;
    notice.querySelector('button')?.addEventListener('click',()=>notice.remove());
    stack.prepend(notice);
    while(stack.children.length>2) stack.lastElementChild?.remove();
    window.setTimeout(()=>{
      notice.classList.add('leaving');
      window.setTimeout(()=>notice.remove(),260);
    },8000);
  }

  function currentFightData(){
    const fights=[...(state.event?.fights || [])].sort((a,b)=>new Date(a.lockAt)-new Date(b.lockAt));
    const awaiting=fights
      .filter(fight=>isLocked(fight) && !isFinalFight(fight))
      .sort((a,b)=>new Date(b.lockAt)-new Date(a.lockAt));
    const next=fights.find(fight=>!isLocked(fight)) || null;
    const lastResult=fights
      .filter(isFinalFight)
      .sort((a,b)=>new Date(b.lockAt)-new Date(a.lockAt))[0] || null;
    return {current:awaiting[0] || null,next,lastResult};
  }

  function groupCounts(fight){
    const counts={red:0,blue:0,missed:0,total:0};
    (state.snapshot?.members || []).forEach(member=>{
      const pick=pickFor(member,fight.id);
      if(!pick){ counts.missed+=1; return; }
      counts.total+=1;
      if(pick.fighter_name===fight.red) counts.red+=1;
      else if(pick.fighter_name===fight.blue) counts.blue+=1;
    });
    return counts;
  }

  function renderLivePanel(){
    ensureLivePanel();
    const panel=document.getElementById('picksLivePanel');
    if(!panel || !state.event || !state.snapshot?.room){
      if(panel) panel.hidden=true;
      return;
    }
    if(state.event.status==='complete'){
      panel.hidden=true;
      return;
    }

    const {current,next,lastResult}=currentFightData();
    const focus=current || next || lastResult;
    if(!focus){ panel.hidden=true; return; }

    let kicker='NEXT TO LOCK';
    let headline=`${focus.red} vs. ${focus.blue}`;
    let detail=`Locks at ${formatTime(focus.lockAt)}`;
    let statusClass='upcoming';

    if(current){
      kicker='AWAITING RESULT';
      detail='Picks are revealed · standings update when the result is posted';
      statusClass='waiting';
    }else if(!next && lastResult){
      kicker='LATEST RESULT';
      detail=formatResult(lastResult);
      statusClass='final';
    }else if(next){
      const remaining=Math.max(0,new Date(next.lockAt).getTime()-Date.now());
      const minutes=Math.ceil(remaining/60000);
      detail=minutes<=1 ? 'Locks in under a minute' : `Locks in about ${minutes} minutes`;
    }

    const counts=isLocked(focus) ? groupCounts(focus) : null;
    const submitted=counts?.total || 0;
    const redPct=submitted ? Math.round(100*counts.red/submitted) : 0;
    const bluePct=submitted ? 100-redPct : 0;
    panel.hidden=false;
    panel.className=`picks-live-panel ${statusClass}`;
    panel.innerHTML=`
      <div class="picks-live-copy">
        <span>${safe(kicker)}</span>
        <strong>${safe(headline)}</strong>
        <small>${safe(detail)}</small>
      </div>
      ${counts ? `<div class="picks-live-split"><div><b>${safe(focus.red)}</b><span>${redPct}%</span></div><i><em style="width:${redPct}%"></em></i><div><b>${safe(focus.blue)}</b><span>${bluePct}%</span></div></div>` : ''}
      <div class="picks-live-actions"><small>Updated ${state.lastUpdated ? 'just now' : '—'}</small><button id="picksJumpCurrent" type="button">Jump to fight</button></div>`;
    document.getElementById('picksJumpCurrent')?.addEventListener('click',()=>{
      const card=document.querySelector(`.pick-fight[data-fight="${CSS.escape(focus.id)}"]`);
      const details=card?.closest('details');
      if(details) details.open=true;
      card?.scrollIntoView({behavior:'smooth',block:'center'});
    });
  }

  function applyFightPercentages(){
    if(!state.event || !state.snapshot?.room) return;
    state.event.fights.forEach(fight=>{
      const card=document.querySelector(`.pick-fight[data-fight="${CSS.escape(fight.id)}"]`);
      if(!card) return;
      card.classList.remove('live-current-fight','live-final-card','live-user-correct','live-user-wrong','live-void-card');
      card.querySelectorAll('.live-pick-percent').forEach(node=>node.remove());
      card.querySelectorAll('.pick-fighter').forEach(button=>button.classList.remove('live-winner','live-loser'));

      if(isFinalFight(fight)) card.classList.add('live-final-card');
      if(['draw','no-contest','cancelled'].includes(fight.resultStatus)) card.classList.add('live-void-card');

      const myPick=myPickFor(fight.id);
      if(fight.winner && myPick){
        card.classList.add(myPick.fighter_name===fight.winner ? 'live-user-correct' : 'live-user-wrong');
      }

      const locked=isLocked(fight);
      const headStatus=card.querySelector('.pick-fight-head > span');
      const footer=card.querySelector('.pick-lock');
      card.querySelectorAll('.pick-fighter').forEach(button=>{
        if(locked) button.disabled=true;
        if(fight.winner){
          button.classList.add(button.dataset.pick===fight.winner ? 'live-winner' : 'live-loser');
        }
      });
      card.querySelectorAll('[data-underdog-lock]').forEach(button=>{ if(locked) button.hidden=true; });
      if(isFinalFight(fight)){
        if(headStatus) headStatus.textContent=fight.winner ? 'Final' : 'Void';
        if(footer) footer.textContent=fight.winner ? `Winner: ${fight.winner}` : formatResult(fight);
      }else if(locked){
        if(headStatus) headStatus.textContent='Locked';
        if(footer) footer.textContent='This fight is locked.';
      }

      if(!locked) return;
      const counts=groupCounts(fight);
      const submitted=counts.total;
      const redPct=submitted ? Math.round(100*counts.red/submitted) : 0;
      const bluePct=submitted ? 100-redPct : 0;
      card.querySelectorAll('.pick-fighter').forEach(button=>{
        const pct=button.dataset.pick===fight.red ? redPct : bluePct;
        const count=button.dataset.pick===fight.red ? counts.red : counts.blue;
        const badge=document.createElement('span');
        badge.className='live-pick-percent';
        badge.innerHTML=`<b>${pct}%</b><small>${count} pick${count===1?'':'s'}</small><i><em style="width:${pct}%"></em></i>`;
        button.appendChild(badge);
      });
    });

    const {current}=currentFightData();
    if(current){
      document.querySelector(`.pick-fight[data-fight="${CSS.escape(current.id)}"]`)?.classList.add('live-current-fight');
    }
  }

  function organizeLockedFights(){
    if(state.event?.status==='complete') return;
    const wrapper=document.querySelector('.picks-locked-section');
    const list=wrapper?.querySelector('.picks-locked-list');
    if(!wrapper || !list) return;

    wrapper.querySelector('.picks-live-results-section')?.remove();
    const cards=[...list.querySelectorAll(':scope > .pick-fight')];
    const finalCards=[];
    const waitingCards=[];
    cards.forEach(card=>{
      const fight=state.event?.fights.find(item=>item.id===card.dataset.fight);
      if(fight && isFinalFight(fight)) finalCards.push(card);
      else waitingCards.push(card);
    });

    const summary=wrapper.querySelector(':scope > summary');
    if(summary){
      summary.querySelector('span').textContent=waitingCards.length ? 'Awaiting results' : 'Locked fights';
      summary.querySelector('b').textContent=waitingCards.length;
    }
    wrapper.open=waitingCards.length>0;
    list.hidden=waitingCards.length===0;

    if(finalCards.length){
      const results=document.createElement('details');
      results.className='picks-live-results-section';
      results.innerHTML=`<summary><span>Fight results</span><b>${finalCards.length}</b></summary><div class="picks-live-results-list"></div>`;
      const resultsList=results.querySelector('.picks-live-results-list');
      finalCards.forEach(card=>resultsList.appendChild(card));
      wrapper.appendChild(results);
    }
  }

  function standingsKey(){
    return `ufc-picks:live-positions:${state.roomCode}:${state.event?.id || 'event'}`;
  }

  function loadStoredPositions(){
    try{ return JSON.parse(sessionStorage.getItem(standingsKey()) || '{}'); }
    catch(_error){ return {}; }
  }

  function renderStandings(){
    const target=document.getElementById('picksStandings');
    if(!target || !state.snapshot?.room) return;
    const members=[...(state.snapshot.members || [])].sort((a,b)=>(b.score||0)-(a.score||0) || (b.correct||0)-(a.correct||0) || (b.picks_made||0)-(a.picks_made||0) || String(a.display_name).localeCompare(String(b.display_name)));
    const previous=Object.keys(state.previousPositions).length ? state.previousPositions : loadStoredPositions();
    const current={};
    target.innerHTML=members.map((member,index)=>{
      const place=index+1;
      current[member.id]=place;
      const before=previous[member.id];
      const delta=before ? before-place : 0;
      const movement=delta>0 ? `<span class="picks-live-move up">▲${delta}</span>` : delta<0 ? `<span class="picks-live-move down">▼${Math.abs(delta)}</span>` : '<span class="picks-live-move even">—</span>';
      return `<div class="picks-standing-row${delta>0?' moved-up':delta<0?' moved-down':''}">
        <div class="picks-standing-rank">#${place}${movement}</div>
        <div><strong>${safe(member.display_name)}${member.id===state.snapshot.me?.id ? ' <span class="picks-you">You</span>' : ''}</strong><div class="meta">${member.correct||0} correct · ${member.picks_made||0} picks${member.upset_bonus ? ' · +1 lock bonus' : ''}</div></div>
        <div class="picks-standing-score"><strong>${member.score||0}</strong><small>PTS</small></div>
      </div>`;
    }).join('') || '<div class="picks-empty">No room members yet.</div>';
    state.previousPositions=current;
    sessionStorage.setItem(standingsKey(),JSON.stringify(current));
  }

  function detectChanges(){
    const fights=state.event?.fights || [];
    const current=Object.fromEntries(fights.map(fight=>[fight.id,{locked:isLocked(fight),status:fight.resultStatus || 'scheduled',winner:fight.winner || null,red:fight.red,blue:fight.blue}]));
    if(state.previousFights){
      fights.forEach(fight=>{
        const before=state.previousFights[fight.id];
        const after=current[fight.id];
        if(!before) return;
        if(!before.locked && after.locked){
          showNotice('locked','FIGHT LOCKED',`${fight.red} vs. ${fight.blue}`,'Room picks are now revealed.');
        }
        const resultChanged=(before.status!==after.status || before.winner!==after.winner) && after.status!=='scheduled';
        if(resultChanged){
          showNotice('result','RESULT POSTED',formatResult(fight),'Standings have been refreshed.');
        }
      });
    }
    state.previousFights=current;
  }

  function applyEnhancements(){
    state.observer?.disconnect();
    try{
      renderLivePanel();
      renderStandings();
      applyFightPercentages();
      organizeLockedFights();
    }finally{
      const root=document.getElementById('picks') || document.body;
      state.observer?.observe(root,{childList:true,subtree:true});
    }
  }

  async function fetchLiveState(){
    if(state.busy) return;
    const code=roomCode();
    const token=memberToken(code);
    if(!code || !token){
      state.roomCode='';
      state.token='';
      document.getElementById('picksLivePanel')?.setAttribute('hidden','');
      return;
    }

    state.busy=true;
    try{
      const [{data:events,error:eventError},{data:snapshot,error:snapshotError}]=await Promise.all([
        client.rpc('picks_public_events'),
        client.rpc('picks_room_snapshot',{p_room_code:code,p_member_token:token})
      ]);
      if(eventError || snapshotError || !snapshot?.room || !Array.isArray(events)) return;
      const event=events.find(item=>item.id===snapshot.room.event_id);
      if(!event) return;
      state.roomCode=code;
      state.token=token;
      state.event=event;
      state.snapshot=snapshot;
      state.lastUpdated=Date.now();
      detectChanges();
      applyEnhancements();
    }finally{
      state.busy=false;
      schedulePoll();
    }
  }

  function schedulePoll(){
    window.clearTimeout(state.pollTimer);
    const delay=picksTabActive() ? 8000 : 20000;
    state.pollTimer=window.setTimeout(fetchLiveState,delay);
  }

  function start(){
    ensureLivePanel();
    ensureNoticeStack();
    fetchLiveState();
    state.observer=new MutationObserver(mutations=>{
      const baseChanged=mutations.some(mutation=>[...mutation.addedNodes].some(node=>{
        if(node.nodeType!==1) return false;
        return node.matches?.('.pick-fight,.picks-standing-row,.picks-locked-section') || node.querySelector?.('.pick-fight,.picks-standing-row,.picks-locked-section');
      }));
      if(!baseChanged) return;
      window.clearTimeout(start.timer);
      start.timer=window.setTimeout(applyEnhancements,80);
    });
    state.observer.observe(document.getElementById('picks') || document.body,{childList:true,subtree:true});
    document.querySelectorAll('.tab').forEach(button=>button.addEventListener('click',schedulePoll));
    window.addEventListener('focus',fetchLiveState);
    document.addEventListener('visibilitychange',()=>{ if(!document.hidden) fetchLiveState(); });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

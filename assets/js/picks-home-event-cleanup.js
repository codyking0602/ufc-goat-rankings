(function(){
  'use strict';

  let syncing=false;

  const safe=value=>String(value ?? '').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

  function openSettings(){
    document.querySelector('[data-picks-route="settings"]')?.click();
  }

  function statusOf(row){
    return String(row?.querySelector('div > span')?.textContent || '').trim().toLowerCase();
  }

  function currentEventRow(events){
    const rows=[...(events?.querySelectorAll('.picks-group-event') || [])];
    return rows.find(row=>row.classList.contains('active'))
      || rows.find(row=>['live','upcoming'].includes(statusOf(row)))
      || null;
  }

  function profileSnapshot(){
    const profile=document.getElementById('picksProfileShell');
    const avatar=profile?.querySelector('.profile-avatar')?.textContent?.trim()
      || profile?.querySelector('[data-social-avatar].active')?.textContent?.trim()
      || '🥊';
    const reminder=Boolean(profile?.querySelector('#picksSocialReminder')?.checked);
    return {avatar,reminder};
  }

  function updateProfileShortcut(compact){
    const target=compact?.querySelector('.picks-home-profile');
    if(!target) return;
    const profile=profileSnapshot();
    const avatar=target.querySelector('.picks-home-profile-avatar');
    const status=target.querySelector('small');
    if(avatar) avatar.textContent=profile.avatar;
    if(status) status.textContent=profile.reminder ? 'Event reminder on' : 'Event reminder off';
  }

  function buildCompactHome(){
    const card=document.getElementById('picksGroupCard');
    const content=document.getElementById('picksGroupContent');
    if(!card || !content || card.hidden) return;

    card.open=true;
    card.classList.add('picks-group-home-clean');

    let compact=document.getElementById('picksHomeCompact');
    if(compact){
      updateProfileShortcut(compact);
      return;
    }

    const top=content.querySelector('.picks-group-top');
    const members=content.querySelector('.picks-group-members');
    const events=content.querySelector('.picks-group-events');
    if(!top || !members) return;

    const groupName=card.querySelector('summary strong')?.textContent?.trim() || 'UFC Picks Group';
    const summaryText=card.querySelector('summary b')?.textContent?.trim() || '';
    const seasonName=top.querySelector('span')?.textContent?.trim() || 'CURRENT SEASON';
    const scoring=top.querySelector('p')?.textContent?.trim() || 'Season standings continue across every event.';
    const shareButton=content.querySelector('#picksShareGroup');
    const memberCount=members.querySelectorAll('.picks-group-member').length;
    const current=currentEventRow(events);
    const currentStatus=statusOf(current);

    compact=document.createElement('div');
    compact.id='picksHomeCompact';
    compact.className='picks-home-compact';
    compact.innerHTML=`
      <section class="picks-home-group-header">
        <div><span>${safe(seasonName)}</span><h3>${safe(groupName)}</h3><p>${memberCount} member${memberCount===1?'':'s'} · ${safe(summaryText)}</p></div>
        <div class="picks-home-share-slot"></div>
        <small>Send the permanent group link to add new members.</small>
      </section>
      <section class="picks-home-current">
        <div class="picks-home-section-head"><div><span>${current ? (currentStatus==='live'?'LIVE EVENT':'NEXT EVENT') : 'NEXT EVENT'}</span><h3>${current ? 'Ready when you are' : 'Coming soon'}</h3></div></div>
        <div class="picks-home-current-slot"></div>
      </section>
      <section class="picks-home-leaderboard">
        <div class="picks-home-section-head"><div><span>${safe(seasonName)}</span><h3>Season Leaderboard</h3></div><b>${memberCount} player${memberCount===1?'':'s'}</b></div>
        <p>${safe(scoring)}</p>
        <div class="picks-home-members-slot"></div>
      </section>
      <button class="picks-home-profile" type="button">
        <span class="picks-home-profile-avatar">🥊</span>
        <div><strong>Profile & reminders</strong><small>Event reminder off</small></div>
        <b>Edit</b>
      </button>`;

    content.prepend(compact);
    if(shareButton){
      shareButton.textContent='Share Group';
      compact.querySelector('.picks-home-share-slot')?.appendChild(shareButton);
    }

    const currentSlot=compact.querySelector('.picks-home-current-slot');
    if(current && currentSlot){
      current.classList.add('picks-home-current-event');
      const button=current.querySelector('button[data-group-room]');
      if(button) button.textContent=currentStatus==='live' ? 'Open Live Event' : 'Open Event';
      currentSlot.appendChild(current);
    }else if(currentSlot){
      currentSlot.innerHTML='<div class="picks-home-no-event"><strong>Next event coming soon</strong><small>Completed cards stay available in Past Events below.</small></div>';
    }

    compact.querySelector('.picks-home-members-slot')?.appendChild(members);
    compact.querySelector('.picks-home-profile')?.addEventListener('click',openSettings);
    updateProfileShortcut(compact);

    top.classList.add('picks-home-source-hidden');
    content.querySelector('.picks-group-section-head')?.classList.add('picks-home-source-hidden');
    events?.classList.add('picks-home-source-hidden');
    content.querySelector('.picks-group-owner')?.classList.add('picks-home-source-hidden');
  }

  function setInitialClosed(id){
    const details=document.getElementById(id);
    if(!details || details.dataset.cleanupInitialized) return;
    details.open=false;
    details.dataset.cleanupInitialized='true';
  }

  function isFinalEvent(){
    const recap=document.getElementById('picksEventRecap');
    return Boolean(recap && !recap.hidden && recap.innerHTML.trim());
  }

  function ensureRoomHistoryToggle(finalMode){
    const card=document.getElementById('picksRoomPicksCard');
    if(!card) return;
    const head=card.querySelector('.picks-card-head');
    const title=head?.querySelector('h3');
    const subtitle=card.querySelector('.picks-card-subtitle');
    if(title) title.textContent=finalMode ? 'Room Pick History' : 'Room Picks';
    if(subtitle) subtitle.textContent=finalMode ? 'Every revealed pick from this completed event.' : 'Everyone’s picks appear here as soon as each fight locks.';

    let toggle=document.getElementById('picksRoomHistoryToggle');
    if(!toggle && head){
      toggle=document.createElement('button');
      toggle.id='picksRoomHistoryToggle';
      toggle.className='picks-room-history-toggle';
      toggle.type='button';
      head.appendChild(toggle);
      toggle.addEventListener('click',()=>{
        const collapsed=card.classList.toggle('is-collapsed');
        toggle.textContent=collapsed ? 'View' : 'Hide';
        toggle.setAttribute('aria-expanded',String(!collapsed));
      });
    }

    if(finalMode && !card.dataset.finalCollapseInitialized){
      card.classList.add('is-collapsed');
      card.dataset.finalCollapseInitialized='true';
    }
    if(!finalMode){
      card.classList.remove('is-collapsed');
      delete card.dataset.finalCollapseInitialized;
    }
    if(toggle){
      toggle.hidden=!finalMode;
      toggle.textContent=card.classList.contains('is-collapsed') ? 'View' : 'Hide';
      toggle.setAttribute('aria-expanded',String(!card.classList.contains('is-collapsed')));
    }
  }

  function cleanEvent(){
    const eventView=document.getElementById('picksEventView');
    if(!eventView) return;
    const finalMode=isFinalEvent();
    eventView.classList.toggle('picks-final-event-clean',finalMode);

    const standingsTitle=document.querySelector('#picksStandingsCard h3');
    if(standingsTitle) standingsTitle.textContent='Event Standings';

    const recapTitle=document.querySelector('#picksEventRecap .picks-recap-title-row h3');
    if(recapTitle) recapTitle.textContent=recapTitle.textContent.replace(/ Room Recap$/,' Recap');
    const recapBoardTitle=document.querySelector('#picksEventRecap .picks-recap-board-head h4');
    if(recapBoardTitle) recapBoardTitle.textContent='Event Standings';
    const roomAction=document.getElementById('picksSeeAllRoomPicks');
    if(roomAction) roomAction.textContent='Room pick history';

    const results=document.querySelector('#picksFightList .picks-locked-section');
    if(results){
      results.classList.toggle('picks-final-results',finalMode);
      const label=results.querySelector('summary span');
      if(label) label.textContent=finalMode ? 'Fight Results' : 'Locked fights';
      if(finalMode && !results.dataset.cleanupInitialized){
        results.open=false;
        results.dataset.cleanupInitialized='true';
      }
      if(!finalMode) delete results.dataset.cleanupInitialized;
    }

    ensureRoomHistoryToggle(finalMode);
    if(finalMode) setInitialClosed('picksAdminPanel');
  }

  function bindRecapActions(){
    if(document.documentElement.dataset.picksRecapCleanupBound) return;
    document.documentElement.dataset.picksRecapCleanupBound='true';
    document.addEventListener('click',event=>{
      const resultsButton=event.target.closest?.('#picksSeeAllResults');
      if(resultsButton){
        const details=document.querySelector('#picksFightList .picks-locked-section');
        if(details){
          details.open=true;
          setTimeout(()=>details.scrollIntoView({behavior:'smooth',block:'start'}),30);
        }
      }
      const historyButton=event.target.closest?.('#picksSeeAllRoomPicks');
      if(historyButton){
        const card=document.getElementById('picksRoomPicksCard');
        const toggle=document.getElementById('picksRoomHistoryToggle');
        if(card){
          card.classList.remove('is-collapsed');
          if(toggle){ toggle.textContent='Hide'; toggle.setAttribute('aria-expanded','true'); }
          setTimeout(()=>card.scrollIntoView({behavior:'smooth',block:'start'}),30);
        }
      }
    },true);
  }

  function sync(){
    if(syncing) return;
    syncing=true;
    try{
      buildCompactHome();
      setInitialClosed('picksHistoryCard');
      setInitialClosed('picksSocialCard');
      cleanEvent();
      bindRecapActions();
    }finally{
      syncing=false;
    }
  }

  function start(){
    sync();
    const observer=new MutationObserver(()=>{
      clearTimeout(start.timer);
      start.timer=setTimeout(sync,110);
    });
    observer.observe(document.getElementById('picks') || document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class','open']});
    window.addEventListener('picks:routechange',()=>setTimeout(sync,40));
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
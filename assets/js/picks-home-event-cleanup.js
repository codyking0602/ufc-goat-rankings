(function(){
  'use strict';

  const VERSION='picks-home-event-cleanup-20260718c-no-reminder';
  let syncing=false;
  let groupObserver=null;
  let groupTarget=null;
  let eventObserver=null;
  let eventTarget=null;

  const safe=value=>String(value??'').replace(/[&<>'"]/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
  }[char]));

  function removeUpcomingReminder(){
    let style=document.getElementById('picksNoUpcomingReminderCss');
    if(!style){
      style=document.createElement('style');
      style.id='picksNoUpcomingReminderCss';
      style.textContent='#picksSeasonReminder{display:none!important}';
      document.head.appendChild(style);
    }
    document.getElementById('picksSeasonReminder')?.remove();
  }

  function restoreLegacyHome(compact,events){
    if(!compact)return;
    const legacyEvent=compact.querySelector('.picks-home-current-event');
    if(legacyEvent&&events&&legacyEvent.parentElement!==events){
      events.prepend(legacyEvent);
    }
    compact.querySelector('.picks-home-current')?.remove();
    compact.querySelector('.picks-home-profile')?.remove();
  }

  function buildCompactHome(){
    const card=document.getElementById('picksGroupCard');
    const content=document.getElementById('picksGroupContent');
    if(!card||!content||card.hidden)return;

    card.open=true;
    card.classList.add('picks-group-home-clean');

    const top=content.querySelector('.picks-group-top');
    const members=content.querySelector('.picks-group-members');
    const events=content.querySelector('.picks-group-events');
    if(!top||!members)return;

    let compact=document.getElementById('picksHomeCompact');
    if(compact){
      restoreLegacyHome(compact,events);
      const memberSlot=compact.querySelector('.picks-home-members-slot');
      if(memberSlot&&members.parentElement!==memberSlot)memberSlot.appendChild(members);
      const shareButton=content.querySelector('#picksShareGroup');
      const shareSlot=compact.querySelector('.picks-home-share-slot');
      if(shareButton&&shareSlot&&shareButton.parentElement!==shareSlot){
        shareButton.textContent='Share Group';
        shareSlot.appendChild(shareButton);
      }
      compact.setAttribute('data-home-layout','season-only');
      top.classList.add('picks-home-source-hidden');
      content.querySelector('.picks-group-section-head')?.classList.add('picks-home-source-hidden');
      events?.classList.add('picks-home-source-hidden');
      content.querySelector('.picks-group-owner')?.classList.add('picks-home-source-hidden');
      return;
    }

    const groupName=card.querySelector('summary strong')?.textContent?.trim()||'UFC Picks';
    const summaryText=card.querySelector('summary b')?.textContent?.trim()||'';
    const seasonName=top.querySelector('span')?.textContent?.trim()||'CURRENT SEASON';
    const scoring=top.querySelector('p')?.textContent?.trim()||'Season standings continue across every event.';
    const shareButton=content.querySelector('#picksShareGroup');
    const memberCount=members.querySelectorAll('.picks-group-member').length;

    compact=document.createElement('div');
    compact.id='picksHomeCompact';
    compact.className='picks-home-compact';
    compact.dataset.homeLayout='season-only';
    compact.innerHTML=`
      <section class="picks-home-group-header">
        <div>
          <span>${safe(seasonName)}</span>
          <h3>${safe(groupName)}</h3>
          <p>${memberCount} member${memberCount===1?'':'s'} · ${safe(summaryText)}</p>
        </div>
        <div class="picks-home-share-slot"></div>
        <small>Send the permanent group link to add new members.</small>
      </section>
      <section class="picks-home-leaderboard">
        <div class="picks-home-section-head">
          <div><span>${safe(seasonName)}</span><h3>Season Leaderboard</h3></div>
          <b>${memberCount} player${memberCount===1?'':'s'}</b>
        </div>
        <p>${safe(scoring)}</p>
        <div class="picks-home-members-slot"></div>
      </section>
    `;

    content.prepend(compact);

    if(shareButton){
      shareButton.textContent='Share Group';
      compact.querySelector('.picks-home-share-slot')?.appendChild(shareButton);
    }
    compact.querySelector('.picks-home-members-slot')?.appendChild(members);

    top.classList.add('picks-home-source-hidden');
    content.querySelector('.picks-group-section-head')?.classList.add('picks-home-source-hidden');
    events?.classList.add('picks-home-source-hidden');
    content.querySelector('.picks-group-owner')?.classList.add('picks-home-source-hidden');

    window.dispatchEvent(new CustomEvent('picks:homecompactready',{detail:{version:VERSION}}));
  }

  function setInitialClosed(id){
    const details=document.getElementById(id);
    if(!details||details.dataset.cleanupInitialized)return;
    details.open=false;
    details.dataset.cleanupInitialized='true';
  }

  function isFinalEvent(){
    const recap=document.getElementById('picksEventRecap');
    return Boolean(recap&&!recap.hidden&&recap.innerHTML.trim());
  }

  function ensureRoomHistoryToggle(finalMode){
    const card=document.getElementById('picksRoomPicksCard');
    if(!card)return;

    const head=card.querySelector('.picks-card-head');
    const title=head?.querySelector('h3');
    const subtitle=card.querySelector('.picks-card-subtitle');

    if(title)title.textContent=finalMode?'Room Pick History':'Room Picks';
    if(subtitle){
      subtitle.textContent=finalMode
        ? 'Every revealed pick from this completed event.'
        : 'Everyone’s picks appear here as soon as each fight locks.';
    }

    let toggle=document.getElementById('picksRoomHistoryToggle');
    if(!toggle&&head){
      toggle=document.createElement('button');
      toggle.id='picksRoomHistoryToggle';
      toggle.className='picks-room-history-toggle';
      toggle.type='button';
      head.appendChild(toggle);
      toggle.addEventListener('click',()=>{
        const collapsed=card.classList.toggle('is-collapsed');
        toggle.textContent=collapsed?'View':'Hide';
        toggle.setAttribute('aria-expanded',String(!collapsed));
      });
    }

    if(finalMode&&!card.dataset.finalCollapseInitialized){
      card.classList.add('is-collapsed');
      card.dataset.finalCollapseInitialized='true';
    }
    if(!finalMode){
      card.classList.remove('is-collapsed');
      delete card.dataset.finalCollapseInitialized;
    }
    if(toggle){
      toggle.hidden=!finalMode;
      toggle.textContent=card.classList.contains('is-collapsed')?'View':'Hide';
      toggle.setAttribute('aria-expanded',String(!card.classList.contains('is-collapsed')));
    }
  }

  function cleanEvent(){
    removeUpcomingReminder();
    const eventView=document.getElementById('picksEventView');
    if(!eventView)return;

    const finalMode=isFinalEvent();
    eventView.classList.toggle('picks-final-event-clean',finalMode);

    const standingsTitle=document.querySelector('#picksStandingsCard h3');
    if(standingsTitle)standingsTitle.textContent='Event Standings';

    const recapTitle=document.querySelector('#picksEventRecap .picks-recap-title-row h3');
    if(recapTitle)recapTitle.textContent=recapTitle.textContent.replace(/ Room Recap$/,' Recap');

    const recapBoardTitle=document.querySelector('#picksEventRecap .picks-recap-board-head h4');
    if(recapBoardTitle)recapBoardTitle.textContent='Event Standings';

    const roomAction=document.getElementById('picksSeeAllRoomPicks');
    if(roomAction)roomAction.textContent='Room pick history';

    const results=document.querySelector('#picksFightList .picks-locked-section');
    if(results){
      results.classList.toggle('picks-final-results',finalMode);
      const label=results.querySelector('summary span');
      if(label)label.textContent=finalMode?'Fight Results':'Locked fights';

      if(finalMode&&!results.dataset.cleanupInitialized){
        results.open=false;
        results.dataset.cleanupInitialized='true';
      }
      if(!finalMode)delete results.dataset.cleanupInitialized;
    }

    ensureRoomHistoryToggle(finalMode);
    if(finalMode)setInitialClosed('picksAdminPanel');
  }

  function bindRecapActions(){
    if(document.documentElement.dataset.picksRecapCleanupBound)return;
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
          if(toggle){
            toggle.textContent='Hide';
            toggle.setAttribute('aria-expanded','true');
          }
          setTimeout(()=>card.scrollIntoView({behavior:'smooth',block:'start'}),30);
        }
      }
    },true);
  }

  function sync(){
    if(syncing)return;
    syncing=true;
    try{
      removeUpcomingReminder();
      buildCompactHome();
      setInitialClosed('picksHistoryCard');
      setInitialClosed('picksSocialCard');
      cleanEvent();
      bindRecapActions();
      installObservers();
    }finally{
      syncing=false;
    }
  }

  function scheduleSync(){
    clearTimeout(scheduleSync.timer);
    scheduleSync.timer=setTimeout(sync,55);
  }

  function installObservers(){
    const group=document.getElementById('picksGroupContent');
    if(group&&group!==groupTarget){
      groupObserver?.disconnect();
      groupTarget=group;
      groupObserver=new MutationObserver(scheduleSync);
      groupObserver.observe(group,{childList:true,subtree:true});
    }

    const eventView=document.getElementById('picksEventView');
    if(eventView&&eventView!==eventTarget){
      eventObserver?.disconnect();
      eventTarget=eventView;
      eventObserver=new MutationObserver(scheduleSync);
      eventObserver.observe(eventView,{
        childList:true,
        subtree:true,
        attributes:true,
        attributeFilter:['hidden','open']
      });
    }
  }

  function start(){
    removeUpcomingReminder();
    sync();
    [80,280,800].forEach(delay=>setTimeout(sync,delay));
    window.addEventListener('picks:routechange',()=>requestAnimationFrame(sync));
    window.addEventListener('ufc-picks-season-updated',()=>requestAnimationFrame(sync));
    document.documentElement.setAttribute('data-picks-home-event-cleanup',VERSION);
  }

  window.UFC_PICKS_HOME_EVENT_CLEANUP={version:VERSION,sync};
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',start,{once:true});
  }else{
    start();
  }
})();
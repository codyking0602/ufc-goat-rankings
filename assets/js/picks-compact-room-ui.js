(function(){
  'use strict';

  let expanded=false;

  function applyRoomPicksState(){
    const card=document.getElementById('picksRoomPicksCard');
    const list=document.getElementById('picksRoomPicks');
    const toggle=document.getElementById('picksRoomPicksToggle');
    const standings=document.getElementById('picksStandingsCard');
    if(!card || !list || !toggle) return;

    if(standings && standings.nextElementSibling!==card) standings.insertAdjacentElement('afterend',card);

    const rows=[...list.querySelectorAll('.room-picks-fight')];
    const hasOverflow=rows.length>2;
    toggle.hidden=!hasOverflow;
    toggle.setAttribute('aria-expanded',String(expanded));
    toggle.textContent=expanded ? 'Show latest 2' : `View all ${rows.length}`;
    card.classList.toggle('is-expanded',expanded);

    rows.forEach((row,index)=>{
      row.hidden=!expanded && index>=2;
    });
  }

  function start(){
    const list=document.getElementById('picksRoomPicks');
    const toggle=document.getElementById('picksRoomPicksToggle');
    if(!list || !toggle) return;

    toggle.addEventListener('click',()=>{
      expanded=!expanded;
      applyRoomPicksState();
    });

    const observer=new MutationObserver(applyRoomPicksState);
    observer.observe(list,{childList:true,subtree:false});
    applyRoomPicksState();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
(function(){
  'use strict';

  const VERSION='picks-scoring-live-repair-20260718a';
  let syncing=false;
  let timer=0;

  function bonusForOdds(value){
    const odds=Number(value);
    if(!Number.isFinite(odds)) return 0;
    if(odds>=400) return 7;
    if(odds>=350) return 6;
    if(odds>=300) return 5;
    if(odds>=250) return 4;
    if(odds>=200) return 3;
    if(odds>=150) return 2;
    if(odds>=100) return 1;
    return 0;
  }

  function oddsFromButton(button){
    const raw=String(button?.querySelector('.pick-fighter-odds')?.textContent||'')
      .replace(/\s*FAV\s*$/i,'')
      .trim();
    return /^[+-]?\d+$/.test(raw) ? Number(raw) : null;
  }

  function setText(node,value){
    if(node && node.textContent!==value) node.textContent=value;
  }

  function syncCard(card){
    const selected=card.querySelector('.pick-fighter.selected');
    const action=card.querySelector('.pick-underdog-action');
    if(!selected || !action) return null;

    const odds=oddsFromButton(selected);
    const bonus=bonusForOdds(odds);
    if(bonus<=0) return null;

    const active=selected.classList.contains('underdog-locked')
      || action.classList.contains('active')
      || /lock active/i.test(action.textContent||'');
    const moving=/^Move Underdog Lock/i.test(action.textContent||'');
    const badge=selected.querySelector('.pick-lock-badge');

    if(badge) setText(badge,`LOCK +${bonus}`);
    setText(action,active
      ? `★ Underdog Lock active · +${bonus} if correct`
      : moving
        ? `Move Underdog Lock here · +${bonus} if correct`
        : `★ Lock this underdog · +${bonus} if correct`);

    return active ? {
      name:String(selected.dataset.pick||selected.querySelector('.pick-fighter-name')?.textContent||'').trim(),
      bonus,
    } : null;
  }

  function sync(){
    if(syncing) return;
    syncing=true;
    try{
      let active=null;
      document.querySelectorAll('#picksFightList .pick-fight').forEach(card=>{
        active=syncCard(card)||active;
      });

      if(active){
        setText(document.querySelector('#picksProgress .picks-lock-summary'),`★ Underdog Lock: ${active.name} · +${active.bonus}`);
        const status=document.getElementById('picksStatus');
        if(status && /Underdog Lock saved|worth \+\d+|if correct/i.test(status.textContent||'')){
          setText(status,`Underdog Lock saved · +${active.bonus} if correct.`);
        }
      }

      document.querySelectorAll('#picks .picks-standing-row .meta').forEach(node=>{
        node.textContent=node.textContent.replace(/ · \+1 lock bonus$/,' · lock bonus earned');
      });
    }finally{
      syncing=false;
    }
  }

  function schedule(delay=30){
    clearTimeout(timer);
    timer=setTimeout(sync,delay);
  }

  function start(){
    sync();
    const root=document.getElementById('picks')||document.body;
    const observer=new MutationObserver(()=>schedule(50));
    observer.observe(root,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class','hidden']});
    document.addEventListener('click',event=>{
      if(event.target.closest?.('#picksFightList .pick-fighter,#picksFightList .pick-underdog-action')) schedule(0);
    },true);
    window.addEventListener('picks:routechange',()=>schedule(20));
    window.addEventListener('octagon-hq:soft-refresh',()=>schedule(20));
  }

  window.UFC_PICKS_SCORING_REPAIR={version:VERSION,bonusForOdds,refresh:sync};
  document.documentElement.setAttribute('data-picks-scoring-repair',VERSION);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

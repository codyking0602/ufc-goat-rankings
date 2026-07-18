(function(){
  'use strict';

  const VERSION='picks-scoring-live-repair-20260718b-visible-owner';
  let syncing=false;
  let timer=0;

  function bonusForOdds(value){
    const odds=Number(value);
    if(!Number.isFinite(odds))return 0;
    if(odds>=400)return 7;
    if(odds>=350)return 6;
    if(odds>=300)return 5;
    if(odds>=250)return 4;
    if(odds>=200)return 3;
    if(odds>=150)return 2;
    if(odds>=100)return 1;
    return 0;
  }

  function installStyles(){
    if(document.getElementById('picksLiveBonusOwnerCss'))return;
    const style=document.createElement('style');
    style.id='picksLiveBonusOwnerCss';
    style.textContent=`
      #picks .picks-live-bonus-owned{font-size:0!important}
      #picks .picks-live-bonus-owned::after{content:attr(data-live-label);display:inline;font-family:system-ui,sans-serif}
      #picks .pick-underdog-action.picks-live-bonus-owned::after{font-size:12px;font-weight:900;line-height:1.2}
      #picks .pick-lock-badge.picks-live-bonus-owned::after{font-size:9px;font-weight:950;line-height:1}
      #picks .picks-lock-summary.picks-live-bonus-owned::after{font-size:12px;font-weight:850;line-height:1.3}
      #picks #picksStatus.picks-live-bonus-owned::after{font-size:11px;font-weight:750;line-height:1.35}
    `;
    document.head.appendChild(style);
  }

  function oddsFromButton(button){
    const raw=String(button?.querySelector('.pick-fighter-odds')?.textContent||'')
      .replace(/\s*FAV\s*$/i,'')
      .trim();
    return /^[+-]?\d+$/.test(raw)?Number(raw):null;
  }

  function own(node,label){
    if(!node)return;
    node.dataset.liveLabel=label;
    node.classList.add('picks-live-bonus-owned');
    node.setAttribute('aria-label',label.replace(/^★\s*/,''));
  }

  function release(node){
    if(!node)return;
    node.classList.remove('picks-live-bonus-owned');
    delete node.dataset.liveLabel;
  }

  function syncCard(card){
    const selected=card.querySelector('.pick-fighter.selected');
    const action=card.querySelector('.pick-underdog-action');
    if(!selected||!action){
      release(action);
      return null;
    }

    const odds=oddsFromButton(selected);
    const bonus=bonusForOdds(odds);
    if(bonus<=0){
      release(action);
      release(selected.querySelector('.pick-lock-badge'));
      return null;
    }

    const active=selected.classList.contains('underdog-locked')
      || action.classList.contains('active')
      || /lock active/i.test(action.textContent||'');
    const moving=/^Move Underdog Lock/i.test(action.textContent||'');
    const badge=selected.querySelector('.pick-lock-badge');

    if(badge)own(badge,`LOCK +${bonus}`);
    own(action,active
      ? `★ Underdog Lock active · +${bonus} if correct`
      : moving
        ? `Move Underdog Lock here · +${bonus} if correct`
        : `★ Lock this underdog · +${bonus} if correct`);

    return active?{
      name:String(selected.dataset.pick||selected.querySelector('.pick-fighter-name')?.textContent||'').trim(),
      bonus
    }:null;
  }

  function sync(){
    if(syncing)return;
    syncing=true;
    try{
      let active=null;
      document.querySelectorAll('#picksFightList .pick-fight').forEach(card=>{
        active=syncCard(card)||active;
      });

      const summary=document.querySelector('#picksProgress .picks-lock-summary');
      const status=document.getElementById('picksStatus');
      if(active){
        own(summary,`★ Underdog Lock: ${active.name} · +${active.bonus}`);
        own(status,`Underdog Lock saved · +${active.bonus} if correct.`);
      }else{
        release(summary);
        release(status);
      }

      document.querySelectorAll('#picks .picks-standing-row .meta').forEach(node=>{
        node.textContent=node.textContent.replace(/ · \+1 lock bonus$/,' · lock bonus earned');
      });
    }finally{
      syncing=false;
    }
  }

  function schedule(delay=20){
    clearTimeout(timer);
    timer=setTimeout(sync,delay);
  }

  function start(){
    installStyles();
    sync();
    const root=document.getElementById('picks')||document.body;
    const observer=new MutationObserver(()=>schedule(30));
    observer.observe(root,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class','hidden']});
    document.addEventListener('click',event=>{
      if(event.target.closest?.('#picksFightList .pick-fighter,#picksFightList .pick-underdog-action'))schedule(0);
    },true);
    window.addEventListener('picks:routechange',()=>schedule(10));
    window.addEventListener('octagon-hq:soft-refresh',()=>schedule(10));
    window.setInterval(()=>{
      const picks=document.getElementById('picks');
      if(picks?.classList.contains('active-view'))sync();
    },500);
  }

  window.UFC_PICKS_SCORING_REPAIR={version:VERSION,bonusForOdds,refresh:sync};
  document.documentElement.setAttribute('data-picks-scoring-repair',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
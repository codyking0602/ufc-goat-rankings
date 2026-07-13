(function(){
  'use strict';

  const config=window.UFC_SUPABASE_CONFIG || {};
  const client=config.url && config.anonKey && window.supabase?.createClient
    ? window.supabase.createClient(config.url,config.anonKey)
    : null;
  const CURRENT_SCORING_START=new Date('2026-07-18T00:00:00-05:00').getTime();
  let events=Array.isArray(window.UFC_PICKS_EVENTS) ? window.UFC_PICKS_EVENTS : [];
  let loading=false;
  let syncing=false;

  function ensureStyles(){
    if(document.querySelector('link[data-picks-tiered-scoring]')) return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='assets/css/picks-tiered-scoring.css?v=picks-tiered-scoring-20260713a';
    link.dataset.picksTieredScoring='true';
    document.head.appendChild(link);
  }

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

  function currentEventId(){
    return document.getElementById('picksEventSelect')?.value
      || new URL(window.location.href).searchParams.get('event')
      || '';
  }

  function preferredEvent(){
    const selected=currentEventId();
    return events.find(event=>event.id===selected)
      || events.find(event=>event.status==='live')
      || events.find(event=>event.status==='upcoming')
      || events[0]
      || null;
  }

  function isTiered(event){
    if(!event) return false;
    if(event.scoringVersion) return event.scoringVersion==='tiered-v1';
    if(event.scoring_version) return event.scoring_version==='tiered-v1';
    return new Date(event.eventDate || event.event_date || 0).getTime()>=CURRENT_SCORING_START;
  }

  function fightFor(event,id){
    return (event?.fights || []).find(fight=>String(fight.id)===String(id)) || null;
  }

  function oddsForSelection(fight,name){
    if(!fight || !name) return null;
    if(name===fight.red) return fight.redOdds;
    if(name===fight.blue) return fight.blueOdds;
    return null;
  }

  function lockBonus(fight,name){
    if(!fight || !name) return 0;
    if(name===fight.red && Number.isFinite(Number(fight.redLockBonus))) return Number(fight.redLockBonus);
    if(name===fight.blue && Number.isFinite(Number(fight.blueLockBonus))) return Number(fight.blueLockBonus);
    return bonusForOdds(oddsForSelection(fight,name));
  }

  function ensureScoringCard(){
    const progress=document.getElementById('picksProgress');
    const host=progress?.closest('.picks-progress-card');
    if(!host) return null;
    let card=document.getElementById('picksTieredScoring');
    if(!card){
      card=document.createElement('section');
      card.id='picksTieredScoring';
      card.className='picks-tiered-scoring';
    }
    if(card.parentElement!==host) host.prepend(card);
    return card;
  }

  function renderScoringCard(event){
    const card=ensureScoringCard();
    if(!card) return;
    card.hidden=!isTiered(event);
    if(card.hidden) return;
    const markup=`
      <div class="picks-tiered-head">
        <div><span>SCORING</span><strong>Correct pick <b>+4</b></strong></div>
        <small>One Underdog Lock · bonus only when correct</small>
      </div>
      <div class="picks-tiered-levels" aria-label="Underdog Lock bonus levels">
        <span><b>+100–149</b><em>+1</em></span>
        <span><b>+150–199</b><em>+2</em></span>
        <span><b>+200–249</b><em>+3</em></span>
        <span><b>+250–299</b><em>+4</em></span>
        <span><b>+300–349</b><em>+5</em></span>
        <span><b>+350–399</b><em>+6</em></span>
        <span><b>+400+</b><em>+7</em></span>
      </div>`;
    if(card.dataset.version!=='tiered-v1'){
      card.innerHTML=markup;
      card.dataset.version='tiered-v1';
    }
  }

  function decorateFightCards(event){
    if(!isTiered(event)) return;
    let activeLock=null;

    document.querySelectorAll('#picksFightList .pick-fight[data-fight]').forEach(card=>{
      const fight=fightFor(event,card.dataset.fight);
      const selectedButton=card.querySelector('.pick-fighter.selected');
      const selected=selectedButton?.dataset.pick || '';
      const bonus=lockBonus(fight,selected);
      const action=card.querySelector('.pick-underdog-action');
      const badge=selectedButton?.querySelector('.pick-lock-badge');
      const active=Boolean(selectedButton?.classList.contains('underdog-locked') || action?.classList.contains('active'));

      if(active) activeLock={fight,name:selected,bonus};
      if(badge && bonus>0){
        const value=`LOCK +${bonus}`;
        if(badge.textContent!==value) badge.textContent=value;
      }
      if(!action || bonus<=0) return;

      const moving=/^Move Underdog Lock/i.test(action.textContent || '');
      const value=active
        ? `★ Underdog Lock active · +${bonus} if correct`
        : moving
          ? `Move Underdog Lock here · +${bonus} if correct`
          : `★ Underdog Lock · +${bonus} if correct`;
      if(action.textContent!==value) action.textContent=value;
    });

    const summary=document.querySelector('#picksProgress .picks-lock-summary');
    if(summary && activeLock){
      const value=`★ Underdog Lock: ${activeLock.name} · +${activeLock.bonus}`;
      if(summary.textContent!==value) summary.textContent=value;
    }

    const status=document.getElementById('picksStatus');
    if(status && activeLock && /Underdog Lock saved|season bonus|worth \+1/i.test(status.textContent || '')){
      const value=`Underdog Lock saved · +${activeLock.bonus} if correct.`;
      if(status.textContent!==value) status.textContent=value;
    }
  }

  function decorateHome(){
    const copy=document.querySelector('#picksGroupContent .picks-group-top p');
    if(!copy) return;
    const value='Current scoring: 4 points per correct pick · Underdog Lock +1 to +7 by odds. The same group continues every event.';
    if(copy.textContent!==value) copy.textContent=value;
  }

  function hideCommissionerScoringInputs(){
    ['commissionerCorrectPoints','commissionerLockBonus','commissionerNewCorrectPoints','commissionerNewLockBonus'].forEach(id=>{
      const input=document.getElementById(id);
      const label=input?.closest('label');
      if(label && !label.hidden) label.hidden=true;
    });

    const save=document.getElementById('commissionerSaveSeason');
    if(save && save.textContent!=='Save season name') save.textContent='Save season name';

    const note=save?.parentElement?.querySelector('small');
    if(note){
      const value='Scoring is fixed and shown on the Event tab.';
      if(note.textContent!==value) note.textContent=value;
    }
  }

  function decorate(){
    if(syncing) return;
    syncing=true;
    try{
      const event=preferredEvent();
      renderScoringCard(event);
      decorateFightCards(event);
      decorateHome();
      hideCommissionerScoringInputs();
    }finally{
      syncing=false;
    }
  }

  async function loadEvents(force=false){
    if(loading || (!force && events.some(event=>event.scoringVersion || event.scoring_version))) return;
    if(!client){ decorate(); return; }
    loading=true;
    try{
      const {data}=await client.rpc('picks_public_events');
      if(Array.isArray(data) && data.length) events=data;
    }finally{
      loading=false;
      decorate();
    }
  }

  function start(){
    ensureStyles();
    decorate();
    loadEvents();

    document.getElementById('picksEventSelect')?.addEventListener('change',()=>setTimeout(decorate,0));
    window.addEventListener('picks:routechange',()=>setTimeout(decorate,30));

    const observer=new MutationObserver(()=>{
      clearTimeout(start.timer);
      start.timer=setTimeout(decorate,70);
    });
    observer.observe(document.getElementById('picks') || document.body,{
      childList:true,
      subtree:true,
      characterData:true,
      attributes:true,
      attributeFilter:['hidden','class','open']
    });

    window.setInterval(()=>loadEvents(true),30000);
  }

  window.UFCPicksTieredScoring={bonusForOdds,refresh:()=>loadEvents(true)};

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

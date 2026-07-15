(function(){
  'use strict';

  let syncing=false;

  function fightCards(){
    return [...document.querySelectorAll('#picksFightList .pick-fight')]
      .filter(card=>!String(card.querySelector('.pick-lock')?.textContent || '').toLowerCase().includes('cancelled'));
  }

  function usableOddsText(node){
    return String(node?.textContent || '')
      .replace(/\s*FAV\s*$/i,'')
      .trim();
  }

  function hasUsableOdds(node){
    const value=usableOddsText(node);
    return /^[+-]\d+$/.test(value) && Number(value)!==0;
  }

  function cardHasOdds(card){
    const lines=[...card.querySelectorAll('.pick-fighter-odds')];
    return lines.length>=2 && lines.slice(0,2).every(hasUsableOdds);
  }

  function cardHasOpenUnderdog(card){
    const openButtons=[...card.querySelectorAll('.pick-fighter:not(:disabled)')];
    if(!openButtons.length) return false;
    return openButtons.some(button=>{
      const line=button.querySelector('.pick-fighter-odds');
      return hasUsableOdds(line) && usableOddsText(line).startsWith('+');
    });
  }

  function cleanSource(value){
    return String(value || '')
      .replace(/^Odds snapshot:\s*/i,'')
      .replace(/\s*·\s*for context only\s*$/i,'')
      .trim();
  }

  function oddsNote(hero){
    let note=hero.querySelector('.picks-odds-source');
    if(note) return note;
    note=document.createElement('div');
    note.className='picks-odds-source';
    note.dataset.oddsCoverageBase='';
    note.dataset.oddsCoverageManaged='true';
    hero.querySelector('.picks-event-meta')?.insertAdjacentElement('afterend',note);
    return note;
  }

  function baseSource(note){
    if(note.dataset.oddsCoverageBase!==undefined) return note.dataset.oddsCoverageBase;
    const source=note.dataset.oddsCoverageManaged ? '' : cleanSource(note.textContent);
    note.dataset.oddsCoverageBase=source;
    note.dataset.oddsCoverageManaged='true';
    return source;
  }

  function setText(node,value){
    if(node && node.textContent!==value) node.textContent=value;
  }

  function updateHero(cards){
    const hero=document.getElementById('picksEventHero');
    if(!hero || !cards.length) return;
    const note=oddsNote(hero);
    if(!note) return;

    const total=cards.length;
    const available=cards.filter(cardHasOdds).length;
    const source=baseSource(note);
    let message='';
    let state='picks-odds-empty';

    if(available===0){
      message='Odds have not been posted yet. Underdog Lock is unavailable until usable lines are posted, but you can still submit normal fight picks.';
    }else if(available<total){
      state='picks-odds-partial';
      message=`Odds available for ${available} of ${total} fights · Not all odds available yet`;
    }else{
      state='picks-odds-complete';
      message=`Odds available for all ${total} fights`;
    }

    if(source && available>0) message+=` · ${source}`;
    note.classList.remove('picks-odds-empty','picks-odds-partial','picks-odds-complete');
    note.classList.add(state);
    setText(note,message);
  }

  function updateUnderdogSummary(cards){
    const summary=document.querySelector('#picksProgress .picks-lock-summary');
    const activeLock=cards.some(card=>card.querySelector('.underdog-locked') && cardHasOdds(card));
    if(!summary || activeLock) return;

    const available=cards.filter(cardHasOdds).length;
    const eligible=cards.filter(cardHasOpenUnderdog).length;
    if(available===0){
      setText(summary,'★ Underdog Lock unavailable · normal picks still open');
    }else if(eligible===0){
      setText(summary,'★ No eligible underdog yet');
    }else{
      setText(summary,'★ Choose 1 Underdog Lock');
    }
  }

  function sync(){
    if(syncing) return;
    syncing=true;
    try{
      const cards=fightCards();
      if(!cards.length) return;
      updateHero(cards);
      updateUnderdogSummary(cards);
    }finally{
      syncing=false;
    }
  }

  function start(){
    sync();
    const root=document.getElementById('picks') || document.body;
    const observer=new MutationObserver(()=>{
      clearTimeout(start.timer);
      start.timer=setTimeout(sync,80);
    });
    observer.observe(root,{childList:true,subtree:true,characterData:true});
    window.addEventListener('picks:routechange',()=>setTimeout(sync,30));
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

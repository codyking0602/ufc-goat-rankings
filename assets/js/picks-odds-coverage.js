(function(){
  'use strict';

  let syncing=false;

  function fightCards(){
    return [...document.querySelectorAll('#picksFightList .pick-fight')]
      .filter(card=>!String(card.querySelector('.pick-lock')?.textContent || '').toLowerCase().includes('cancelled'));
  }

  function cardHasOdds(card){
    return card.querySelectorAll('.pick-fighter-odds').length>=2;
  }

  function cardHasOpenUnderdog(card){
    const openButtons=[...card.querySelectorAll('.pick-fighter:not(:disabled)')];
    if(!openButtons.length) return false;
    return openButtons.some(button=>/^\+\d+/.test(String(button.querySelector('.pick-fighter-odds')?.textContent || '').trim()));
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
      message='Odds have not been posted yet. Underdog Lock will appear as lines become available.';
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
    if(!summary || /^★\s*Underdog Lock:/i.test(summary.textContent.trim())) return;

    const available=cards.filter(cardHasOdds).length;
    const eligible=cards.filter(cardHasOpenUnderdog).length;
    if(available===0){
      setText(summary,'★ Underdog Lock waiting on posted odds');
    }else if(eligible===0){
      setText(summary,'★ Underdog Lock waiting for a listed underdog');
    }else{
      setText(summary,`★ Underdog Lock available on ${eligible} fight${eligible===1?'':'s'}`);
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

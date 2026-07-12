(function(){
  'use strict';

  let syncing=false;

  function commissionerContent(){
    return document.getElementById('picksCommissionerContent');
  }

  function sourceOwner(){
    return document.querySelector('#picksGroupContent .picks-group-owner');
  }

  function existingPanel(content){
    return content?.querySelector('.picks-upcoming-event-section') || null;
  }

  function createPanel(content){
    const panel=document.createElement('details');
    panel.className='commissioner-clean-section picks-upcoming-event-section';
    panel.open=true;
    panel.innerHTML='<summary><div><span>GROUP CONTROL</span><strong>Add Upcoming Event</strong></div><b>Ready to add</b></summary>';
    const hero=content.querySelector('.commissioner-hero');
    if(hero) hero.insertAdjacentElement('afterend',panel);
    else content.prepend(panel);
    return panel;
  }

  function selectedEventName(owner){
    const select=owner?.querySelector('#picksGroupEventSelect');
    return select?.selectedOptions?.[0]?.textContent?.trim() || '';
  }

  function updateCopy(owner,panel){
    if(!owner || !panel) return;
    const eventName=selectedEventName(owner);
    const label=owner.querySelector('span');
    const title=owner.querySelector('strong');
    const copy=owner.querySelector('small');
    const button=owner.querySelector('#picksGroupAddEvent');
    const meta=panel.querySelector(':scope > summary > b');

    owner.classList.remove('picks-home-source-hidden');
    owner.removeAttribute('hidden');
    if(label) label.textContent='UPCOMING EVENT';
    if(title) title.textContent=eventName || 'No upcoming event ready';
    if(copy) copy.textContent=eventName
      ? 'Add this card to the current season. Every group member will see it automatically.'
      : 'A new UFC card will appear here as soon as it is loaded.';
    if(button) button.textContent='Add to Season';
    if(meta) meta.textContent=eventName || 'Waiting for event';
  }

  function bindSelect(owner,panel){
    const select=owner?.querySelector('#picksGroupEventSelect');
    if(!select || select.dataset.settingsEventBound) return;
    select.dataset.settingsEventBound='true';
    select.addEventListener('change',()=>updateCopy(owner,panel));
  }

  function sync(){
    if(syncing) return;
    syncing=true;
    try{
      const content=commissionerContent();
      if(!content) return;

      const source=sourceOwner();
      let panel=existingPanel(content);

      if(source){
        if(panel && !panel.contains(source)) panel.remove();
        panel=createPanel(content);
        panel.appendChild(source);
      }

      panel=existingPanel(content);
      const owner=panel?.querySelector('.picks-group-owner');
      if(!panel || !owner) return;

      panel.open=true;
      updateCopy(owner,panel);
      bindSelect(owner,panel);
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
    observer.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class','open']});
    window.addEventListener('picks:routechange',()=>setTimeout(sync,30));
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
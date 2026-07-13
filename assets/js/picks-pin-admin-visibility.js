(function(){
  'use strict';

  const ADMIN_PREFIX='ufc-picks:group-admin:';
  const normalize=value=>String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);

  function storedAdminCodes(){
    const codes=[];
    for(let index=0;index<localStorage.length;index+=1){
      const key=localStorage.key(index) || '';
      if(!key.startsWith(ADMIN_PREFIX) || !localStorage.getItem(key)) continue;
      const code=normalize(key.slice(ADMIN_PREFIX.length));
      if(code) codes.push(code);
    }
    return [...new Set(codes)];
  }

  function ensureGroupCodeInUrl(){
    const url=new URL(window.location.href);
    if(normalize(url.searchParams.get('group'))) return;
    const codes=storedAdminCodes();
    if(codes.length!==1) return;
    url.searchParams.set('group',codes[0]);
    window.history.replaceState(window.history.state,'',url.toString());
  }

  function decorate(){
    ensureGroupCodeInUrl();
    const commissioner=document.getElementById('picksCommissionerCard');
    if(!commissioner || commissioner.hidden || storedAdminCodes().length===0) return;

    commissioner.querySelectorAll('.commissioner-member:not(.inactive)').forEach(article=>{
      const existing=article.querySelector('[data-pin-member]');
      if(existing){
        existing.textContent='Set / Reset PIN';
        return;
      }

      const source=article.querySelector('[data-transfer-member],[data-remove-member]');
      if(!source) return;
      const memberId=source.dataset.transferMember || source.dataset.removeMember;
      const memberName=source.dataset.memberName || article.querySelector('strong')?.textContent?.replace(/COMMISSIONER/i,'').trim() || 'member';
      const actions=source.parentElement;
      if(!memberId || !actions) return;

      const button=document.createElement('button');
      button.type='button';
      button.dataset.pinMember=memberId;
      button.dataset.memberName=memberName;
      button.className='commissioner-pin-button';
      button.textContent='Set / Reset PIN';
      actions.prepend(button);
    });
  }

  function start(){
    decorate();
    const observer=new MutationObserver(()=>{
      clearTimeout(start.timer);
      start.timer=setTimeout(decorate,80);
    });
    observer.observe(document.getElementById('picks') || document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class','open']});
    window.addEventListener('picks:routechange',()=>setTimeout(decorate,30));
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

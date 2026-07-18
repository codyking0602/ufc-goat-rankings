(function(){
  'use strict';

  const VERSION='war-room-branding-20260717d-clean';
  const ATTRIBUTE_NAMES=['title','aria-label','placeholder'];
  const USER_COPY_SELECTOR='.octagon-message-body';

  function replaceCopy(value){
    return String(value??'')
      .replace(/PRIVATE BETA\s*·\s*GOAT26/gi,'GOAT26 WAR ROOM')
      .replace(/Manage Beta Access/gi,'Manage War Room Access')
      .replace(/Manage Beta/gi,'Manage Access')
      .replace(/Private Beta/gi,'War Room')
      .replace(/The Octagon/g,'The War Room')
      .replace(/the Octagon/g,'the War Room')
      .replace(/Octagon Beta/g,'War Room')
      .replace(/Octagon week/g,'War Room week')
      .replace(/Octagon board/g,'War Room board')
      .replace(/Octagon messages/g,'War Room messages')
      .replace(/Octagon message/g,'War Room message')
      .replace(/Octagon posts/g,'War Room posts')
      .replace(/Octagon post/g,'War Room post')
      .replace(/Octagon replies/g,'War Room replies')
      .replace(/Octagon reply/g,'War Room reply')
      .replace(/Octagon activity/g,'War Room activity')
      .replace(/Octagon access/g,'War Room access')
      .replace(/Octagon/g,'War Room');
  }

  function inUserCopy(node){
    const element=node?.nodeType===Node.ELEMENT_NODE?node:node?.parentElement;
    return Boolean(element?.closest?.(USER_COPY_SELECTOR));
  }

  function brandAttributes(element){
    if(!element||element.nodeType!==Node.ELEMENT_NODE)return;
    for(const name of ATTRIBUTE_NAMES){
      if(!element.hasAttribute(name))continue;
      const current=element.getAttribute(name)||'';
      const next=replaceCopy(current);
      if(next!==current)element.setAttribute(name,next);
    }
  }

  function brandTextNode(node){
    if(!node||node.nodeType!==Node.TEXT_NODE||inUserCopy(node))return;
    const current=node.nodeValue||'';
    const next=replaceCopy(current);
    if(next!==current)node.nodeValue=next;
  }

  function normalizeWarRoom(root=document){
    const board=root.querySelector?.('[data-octagon-board]')||root.closest?.('[data-octagon-board]');
    if(!board)return;
    const kicker=board.querySelector('.octagon-board-kicker');
    const heading=board.querySelector('.octagon-board-head h2');
    const input=board.querySelector('[data-octagon-input]');
    const manage=board.querySelector('[data-octagon-manage-beta]');
    if(kicker)kicker.textContent='GOAT26 WAR ROOM';
    if(heading)heading.textContent='The War Room';
    if(input&&/Octagon|Beta/i.test(input.placeholder||''))input.placeholder=replaceCopy(input.placeholder);
    if(manage)manage.textContent='Manage Access';
  }

  function brandElement(element){
    if(!element||element.nodeType!==Node.ELEMENT_NODE)return;
    brandAttributes(element);
    if(!inUserCopy(element)){
      const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);
      let node;
      while((node=walker.nextNode()))brandTextNode(node);
    }
    element.querySelectorAll?.('[title],[aria-label],[placeholder]').forEach(brandAttributes);
    normalizeWarRoom(element);
  }

  function applyBranding(){
    if(!document.body)return;
    brandElement(document.body);
    normalizeWarRoom(document);
  }

  function preserveRulesCompatibilityMount(){
    const section=document.getElementById('rules');
    let mount=document.getElementById('rulesContent');
    if(!mount){
      mount=document.createElement('div');
      mount.id='rulesContent';
    }
    if(section?.contains(mount))mount.remove();
    mount.hidden=true;
    mount.setAttribute('aria-hidden','true');
    mount.dataset.legacyRulesCompatibility='true';
    if(mount.parentElement!==document.body)document.body.appendChild(mount);
  }

  function loadScript(id,src,ready){
    if(ready?.())return;
    const existing=document.getElementById(id);
    if(existing&&existing.src.includes(src.split('?v=')[1]||src))return;
    existing?.remove();
    const script=document.createElement('script');
    script.id=id;
    script.src=src;
    script.async=false;
    document.body.appendChild(script);
  }

  function loadProductArchitecture(){
    loadScript(
      'productArchitectureCurrent',
      'assets/js/product-architecture.js?v=product-architecture-20260717g-performance',
      ()=>window.UFC_PRODUCT_ARCHITECTURE?.version==='product-architecture-20260717g-performance'
    );
  }

  function loadProductConnectivity(){
    loadScript(
      'productConnectivityCurrent',
      'assets/js/product-connectivity.js?v=product-connectivity-20260717c-clean-handoffs',
      ()=>window.UFC_PRODUCT_CONNECTIVITY?.version==='product-connectivity-20260717c-clean-handoffs'
    );
  }

  function observe(){
    const observer=new MutationObserver(mutations=>{
      for(const mutation of mutations){
        if(mutation.type==='characterData'){
          brandTextNode(mutation.target);
          continue;
        }
        if(mutation.type==='attributes'){
          brandAttributes(mutation.target);
          normalizeWarRoom(mutation.target);
          continue;
        }
        for(const node of mutation.addedNodes){
          if(node.nodeType===Node.TEXT_NODE)brandTextNode(node);
          else if(node.nodeType===Node.ELEMENT_NODE)brandElement(node);
        }
      }
    });
    observer.observe(document.body,{
      subtree:true,
      childList:true,
      characterData:true,
      attributes:true,
      attributeFilter:ATTRIBUTE_NAMES
    });
  }

  function start(){
    applyBranding();
    preserveRulesCompatibilityMount();
    loadProductArchitecture();
    loadProductConnectivity();
    observe();
    window.addEventListener('octagon-hq:view-change',event=>{
      if(event.detail?.destination==='war-room')window.setTimeout(applyBranding,0);
    });
    ['ufc-play-profile-ready','ufc-app-profile-updated','ufc-canonical-group-ready'].forEach(name=>{
      window.addEventListener(name,()=>window.setTimeout(applyBranding,0));
    });
  }

  window.UFC_WAR_ROOM_BRANDING={version:VERSION,apply:applyBranding,replaceCopy,preserveRulesCompatibilityMount};
  document.documentElement.setAttribute('data-war-room-branding',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
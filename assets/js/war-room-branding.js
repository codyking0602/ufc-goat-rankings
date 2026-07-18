(function(){
  'use strict';

  const VERSION='war-room-branding-20260717f-shell-recovery';
  const ARCH_VERSION='product-architecture-20260717g-performance';
  const CONNECT_VERSION='product-connectivity-20260717d-clean-handoffs';
  const ATTRIBUTE_NAMES=['title','aria-label','placeholder'];
  const SKIP_SELECTOR='.octagon-message-body, textarea, input, script, style, noscript';
  let queued=false;

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
      .replace(/Octagon access/g,'War Room access');
  }

  function shouldSkip(node){
    const element=node?.nodeType===Node.ELEMENT_NODE?node:node?.parentElement;
    return Boolean(element?.closest?.(SKIP_SELECTOR));
  }

  function brandTextNode(node){
    if(!node||node.nodeType!==Node.TEXT_NODE||shouldSkip(node))return;
    const current=node.nodeValue||'';
    const next=replaceCopy(current);
    if(next!==current)node.nodeValue=next;
  }

  function brandElement(element){
    if(!element||element.nodeType!==Node.ELEMENT_NODE)return;
    if(!shouldSkip(element)){
      for(const name of ATTRIBUTE_NAMES){
        if(!element.hasAttribute(name))continue;
        const current=element.getAttribute(name)||'';
        const next=replaceCopy(current);
        if(next!==current)element.setAttribute(name,next);
      }
    }

    const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode()))brandTextNode(node);

    element.querySelectorAll?.('[title],[aria-label],[placeholder]').forEach(child=>{
      if(shouldSkip(child))return;
      for(const name of ATTRIBUTE_NAMES){
        if(!child.hasAttribute(name))continue;
        const current=child.getAttribute(name)||'';
        const next=replaceCopy(current);
        if(next!==current)child.setAttribute(name,next);
      }
    });
  }

  function normalizeShellCopy(){
    const hero=document.querySelector('.hero');
    const brand=hero?.firstElementChild;
    const eyebrow=brand?.querySelector('.eyebrow');
    const title=brand?.querySelector('h1');
    const subtitle=brand?.querySelector('.subtitle');
    if(eyebrow)eyebrow.textContent='UFC RANKINGS · GAMES · PICKS · COMMUNITY';
    if(title)title.textContent='Octagon HQ';
    if(subtitle)subtitle.textContent='Rankings, games, picks, and UFC conversation.';
    document.title='Octagon HQ';

    const board=document.querySelector('[data-octagon-board]');
    const kicker=board?.querySelector('.octagon-board-kicker');
    const heading=board?.querySelector('.octagon-board-head h2');
    const input=board?.querySelector('[data-octagon-input]');
    const manage=board?.querySelector('[data-octagon-manage-beta]');
    if(kicker)kicker.textContent='GOAT26 WAR ROOM';
    if(heading)heading.textContent='The War Room';
    if(input&&/Octagon|Beta/i.test(input.placeholder||''))input.placeholder=replaceCopy(input.placeholder);
    if(manage)manage.textContent='Manage Access';
  }

  function applyBranding(){
    queued=false;
    if(document.body)brandElement(document.body);
    normalizeShellCopy();
  }

  function scheduleBranding(){
    if(queued)return;
    queued=true;
    queueMicrotask(applyBranding);
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

  function appendScript(id,src){
    if(document.getElementById(id))return;
    const script=document.createElement('script');
    script.id=id;
    script.src=src;
    script.async=false;
    document.body.appendChild(script);
  }

  function recoverArchitecture(){
    if(window.UFC_PRODUCT_ARCHITECTURE?.version!==ARCH_VERSION){
      appendScript('productArchitectureRecovery','assets/js/product-architecture.js?v=product-architecture-20260717g-performance-recovery');
    }else{
      window.UFC_PRODUCT_ARCHITECTURE.apply?.();
    }
  }

  function recoverConnectivity(){
    if(window.UFC_PRODUCT_CONNECTIVITY?.version!==CONNECT_VERSION){
      appendScript('productConnectivityRecovery','assets/js/product-connectivity.js?v=product-connectivity-20260717d-clean-handoffs-recovery');
    }else{
      window.UFC_PRODUCT_CONNECTIVITY.render?.();
    }
  }

  function start(){
    applyBranding();
    preserveRulesCompatibilityMount();
    recoverArchitecture();
    recoverConnectivity();

    const observer=new MutationObserver(mutations=>{
      for(const mutation of mutations){
        if(mutation.type==='characterData'){
          brandTextNode(mutation.target);
          continue;
        }
        if(mutation.type==='attributes'){
          brandElement(mutation.target);
          continue;
        }
        for(const node of mutation.addedNodes){
          if(node.nodeType===Node.TEXT_NODE)brandTextNode(node);
          else if(node.nodeType===Node.ELEMENT_NODE)brandElement(node);
        }
      }
      scheduleBranding();
    });
    observer.observe(document.body,{
      subtree:true,
      childList:true,
      characterData:true,
      attributes:true,
      attributeFilter:ATTRIBUTE_NAMES
    });

    [50,250,800,1800,3600].forEach(delay=>window.setTimeout(()=>{
      applyBranding();
      recoverArchitecture();
      recoverConnectivity();
    },delay));

    ['ufc-play-profile-ready','ufc-app-profile-updated','ufc-canonical-group-ready'].forEach(name=>{
      window.addEventListener(name,scheduleBranding);
    });
  }

  window.UFC_WAR_ROOM_BRANDING={
    version:VERSION,
    apply:applyBranding,
    replaceCopy,
    preserveRulesCompatibilityMount,
    recoverArchitecture,
    recoverConnectivity
  };
  document.documentElement.setAttribute('data-war-room-branding',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
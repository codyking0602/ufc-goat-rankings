(function(){
  'use strict';

  const VERSION='war-room-branding-20260717b';
  const ATTRIBUTE_NAMES=['title','aria-label','placeholder'];
  const SKIP_SELECTOR='.octagon-message-body, textarea, input, script, style, noscript';
  let queued=false;

  function replaceCopy(value){
    return String(value??'')
      .replace(/The Octagon/g,'The War Room')
      .replace(/the Octagon/g,'the War Room')
      .replace(/Octagon Beta/g,'War Room Beta')
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

    const heading=element.matches?.('[data-octagon-board]')
      ? element.querySelector('.octagon-board-head h2')
      : element.querySelector?.('[data-octagon-board] .octagon-board-head h2');
    if(heading&&heading.textContent!=='The War Room')heading.textContent='The War Room';
  }

  function applyBranding(){
    queued=false;
    if(document.body)brandElement(document.body);
  }

  function scheduleBranding(){
    if(queued)return;
    queued=true;
    queueMicrotask(applyBranding);
  }

  function loadProductArchitecture(){
    if(window.UFC_PRODUCT_ARCHITECTURE||document.querySelector('script[data-product-architecture-loader]'))return;
    const script=document.createElement('script');
    script.src='assets/js/product-architecture.js?v=product-architecture-20260717a';
    script.dataset.productArchitectureLoader='true';
    script.async=false;
    document.body.appendChild(script);
  }

  function start(){
    applyBranding();
    loadProductArchitecture();
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

    [50,250,900,2400].forEach(delay=>window.setTimeout(applyBranding,delay));
    ['ufc-play-profile-ready','ufc-app-profile-updated','ufc-canonical-group-ready'].forEach(name=>{
      window.addEventListener(name,scheduleBranding);
    });
  }

  window.UFC_WAR_ROOM_BRANDING={version:VERSION,apply:applyBranding,replaceCopy};
  document.documentElement.setAttribute('data-war-room-branding',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

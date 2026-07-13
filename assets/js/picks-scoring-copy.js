(function(){
  'use strict';

  function cleanText(node,replacements){
    if(!node) return;
    let value=node.textContent || '';
    replacements.forEach(([from,to])=>{ value=value.replace(from,to); });
    if(value!==node.textContent) node.textContent=value;
  }

  function apply(){
    document.querySelectorAll('#picks .picks-standing-row .meta').forEach(node=>cleanText(node,[[' · +1 lock bonus',' · lock bonus']]));
    document.querySelectorAll('#picks .picks-recap-row small').forEach(node=>cleanText(node,[[' · +1 lock',' · lock bonus']]));
  }

  function start(){
    apply();
    const root=document.getElementById('picks') || document.body;
    const observer=new MutationObserver(()=>{
      clearTimeout(start.timer);
      start.timer=setTimeout(apply,60);
    });
    observer.observe(root,{childList:true,subtree:true,characterData:true});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

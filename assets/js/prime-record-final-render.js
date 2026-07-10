// Final presentation guard for Resume Snapshot Prime Record values.
// Converts descriptive values such as "5-5 title/elite window" to the record-only form "5-5".
(function(){
  'use strict';

  const VERSION='prime-record-final-render-20260710a';
  const TARGET_LABEL='Prime Record';

  function normalizePrimeRecord(value){
    const text=String(value??'').trim();
    if(!text||text==='—') return null;
    const match=text.match(/(?:^|[^0-9])(\d+)\s*-\s*(\d+)(?:\s*-\s*(\d+))?(?:\s*[,;]?\s*\(?\s*(\d+)\s*NC\s*\)?)?/i);
    if(!match) return null;
    const wins=Number(match[1]);
    const losses=Number(match[2]);
    const draws=match[3]===undefined?null:Number(match[3]);
    const noContests=match[4]===undefined?null:Number(match[4]);
    return `${wins}-${losses}${draws===null?'':`-${draws}`}${noContests===null?'':`, ${noContests} NC`}`;
  }

  function cleanPrimeRecordTiles(root=document){
    if(!root?.querySelectorAll) return [];
    const cleaned=[];
    root.querySelectorAll('.snapshot-item').forEach(item=>{
      const label=item.querySelector('small')?.textContent?.trim();
      if(label!==TARGET_LABEL) return;
      const valueNode=item.querySelector('strong');
      if(!valueNode) return;
      const before=valueNode.textContent.trim();
      const after=normalizePrimeRecord(before);
      if(after&&after!==before){
        valueNode.textContent=after;
        cleaned.push({before,after});
      }
    });
    return cleaned;
  }

  function wrapOpenFighter(){
    const original=window.openFighter;
    if(typeof original!=='function'||original.__primeRecordFinalRenderWrapped) return false;
    const wrapped=function(...args){
      const result=original.apply(this,args);
      cleanPrimeRecordTiles(document.getElementById('fighterDetail')||document);
      return result;
    };
    wrapped.__primeRecordFinalRenderWrapped=true;
    wrapped.__original=original;
    window.openFighter=wrapped;
    return true;
  }

  function installObserver(){
    const detail=document.getElementById('fighterDetail');
    if(!detail||window.UFC_PRIME_RECORD_FINAL_RENDER_OBSERVER) return false;
    const observer=new MutationObserver(()=>cleanPrimeRecordTiles(detail));
    observer.observe(detail,{childList:true,subtree:true,characterData:true});
    window.UFC_PRIME_RECORD_FINAL_RENDER_OBSERVER=observer;
    return true;
  }

  function visiblePrimeRecord(){
    const detail=document.getElementById('fighterDetail');
    if(!detail) return null;
    const item=[...detail.querySelectorAll('.snapshot-item')].find(node=>node.querySelector('small')?.textContent?.trim()===TARGET_LABEL);
    return item?.querySelector('strong')?.textContent?.trim()||null;
  }

  function auditFighter(name,expected){
    const detail=document.getElementById('fighterDetail');
    const drawer=document.getElementById('drawer');
    if(!detail||!drawer||typeof window.openFighter!=='function'){
      return {fighter:name,expected,actual:null,passed:false,reason:'renderer-unavailable'};
    }
    const panel=drawer.querySelector('.drawer-panel');
    const saved={
      html:detail.innerHTML,
      drawerClass:drawer.className,
      ariaHidden:drawer.getAttribute('aria-hidden'),
      visibility:drawer.style.visibility,
      scrollTop:panel?.scrollTop||0
    };
    drawer.style.visibility='hidden';
    try{
      window.openFighter(name);
      cleanPrimeRecordTiles(detail);
      const actual=visiblePrimeRecord();
      return {fighter:name,expected,actual,passed:actual===expected};
    }finally{
      detail.innerHTML=saved.html;
      drawer.className=saved.drawerClass;
      if(saved.ariaHidden===null) drawer.removeAttribute('aria-hidden');
      else drawer.setAttribute('aria-hidden',saved.ariaHidden);
      drawer.style.visibility=saved.visibility;
      const restoredPanel=drawer.querySelector('.drawer-panel');
      if(restoredPanel) restoredPanel.scrollTop=saved.scrollTop;
    }
  }

  const wrapped=wrapOpenFighter();
  const observerInstalled=installObserver();
  const initialCleanups=cleanPrimeRecordTiles(document.getElementById('fighterDetail')||document);

  window.UFC_PRIME_RECORD_FINAL_RENDER={
    version:VERSION,
    mutatesScores:false,
    wrapped,
    observerInstalled,
    initialCleanups,
    normalizePrimeRecord,
    cleanPrimeRecordTiles,
    auditFighter
  };
  document.documentElement.setAttribute('data-prime-record-final-render',VERSION);
})();

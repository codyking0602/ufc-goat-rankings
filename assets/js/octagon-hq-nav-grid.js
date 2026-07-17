(function(){
  'use strict';

  const VERSION='octagon-hq-nav-grid-20260717b';
  let applying=false;

  function removeSubtitle(){
    document.querySelector('.hero .subtitle')?.remove();
  }

  function visibleTabs(nav){
    return [...nav.querySelectorAll('.tab')].filter(tab=>tab.dataset.view!=='rules');
  }

  function forceBetaLabel(){
    const button=document.querySelector('[data-octagon-beta-tab]');
    if(!button)return;
    if(button.textContent.trim()!=='Beta')button.textContent='Beta';
    button.setAttribute('aria-label',button.disabled?'Private beta · Cody only':'Open private beta');
  }

  function forceLayout(){
    if(applying)return;
    const nav=document.querySelector('.tabs');
    if(!nav)return;
    applying=true;

    const mobile=window.matchMedia('(max-width: 900px)').matches;
    const rules=nav.querySelector('.tab[data-view="rules"]');
    if(rules)rules.style.setProperty('display','none','important');

    if(mobile){
      nav.style.setProperty('display','grid','important');
      nav.style.setProperty('grid-template-columns','repeat(4,minmax(0,1fr))','important');
      nav.style.setProperty('grid-auto-flow','row','important');
      nav.style.setProperty('align-items','stretch','important');
      nav.style.setProperty('overflow','visible','important');
      nav.style.setProperty('flex-wrap','initial','important');
      nav.style.setProperty('gap','7px','important');
      nav.style.setProperty('padding','9px 14px','important');

      visibleTabs(nav).forEach((tab,index)=>{
        tab.style.setProperty('display','flex','important');
        tab.style.setProperty('align-items','center','important');
        tab.style.setProperty('justify-content','center','important');
        tab.style.setProperty('width','auto','important');
        tab.style.setProperty('min-width','0','important');
        tab.style.setProperty('min-height','48px','important');
        tab.style.setProperty('padding','8px 4px','important');
        tab.style.setProperty('font-size','11px','important');
        tab.style.setProperty('line-height','1.05','important');
        tab.style.setProperty('white-space','normal','important');
        tab.style.setProperty('grid-column','auto','important');
        tab.style.setProperty('grid-row',String(Math.floor(index/4)+1),'important');
        tab.style.setProperty('order',String(index+1),'important');
      });
    }

    forceBetaLabel();
    removeSubtitle();
    window.setTimeout(()=>{applying=false;},0);
  }

  function start(){
    forceLayout();
    const nav=document.querySelector('.tabs');
    if(!nav)return;
    const observer=new MutationObserver(forceLayout);
    observer.observe(nav,{childList:true,subtree:true,characterData:true,attributes:true});
    window.addEventListener('resize',forceLayout,{passive:true});
    [0,50,150,350,900,1800,3000].forEach(delay=>window.setTimeout(forceLayout,delay));
  }

  window.UFC_OCTAGON_HQ_NAV_GRID={version:VERSION,forceLayout,forceBetaLabel,removeSubtitle};
  document.documentElement.setAttribute('data-octagon-hq-nav-grid',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
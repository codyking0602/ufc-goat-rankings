(function(){
  'use strict';

  const VERSION='octagon-hq-nav-grid-20260717d';
  let resizeTimer=0;

  function installCompressionStyles(){
    if(document.getElementById('octagonHqCompressionCss'))return;
    const style=document.createElement('style');
    style.id='octagonHqCompressionCss';
    style.textContent=`
      @media(max-width:900px){
        .hero{padding:10px 16px 9px!important;gap:6px!important}
        .hero .eyebrow{margin:0 0 4px!important;font-size:9px!important;letter-spacing:.12em!important}
        .hero h1{font-size:clamp(35px,10vw,44px)!important;line-height:.91!important}
        .hero #manualRefreshControl{margin-bottom:0!important}
        #manualRefreshBtn,#whatsNewBtn{min-height:29px!important;padding:5px 9px!important;font-size:.65rem!important}
        .app-profile-tools{margin-top:1px!important}
        .app-profile-chip{min-height:38px!important;padding:4px 7px!important;grid-template-columns:30px minmax(0,1fr) auto!important;gap:7px!important;border-radius:13px!important}
        .app-profile-chip .app-profile-avatar{width:30px!important;height:30px!important;min-width:30px!important;border-radius:9px!important}
        .app-profile-chip-copy small{font-size:6.5px!important}
        .app-profile-chip-copy strong{font-size:11.5px!important}
        .app-profile-chip-badge{font-size:7.5px!important}
        .tabs{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;grid-auto-flow:row!important;align-items:stretch!important;overflow:visible!important;flex-wrap:initial!important;gap:6px!important;padding:7px 12px!important}
        .tabs .tab{display:flex!important;align-items:center!important;justify-content:center!important;width:auto!important;min-width:0!important;height:46px!important;min-height:46px!important;max-height:46px!important;padding:5px 2px!important;font-size:10.5px!important;line-height:1!important;white-space:normal!important;border-radius:14px!important}
        .tabs .tab[data-view="rules"]{display:none!important}
      }
      @media(max-width:430px){
        .hero{padding-top:8px!important}
        .hero h1{font-size:36px!important}
        .tabs{gap:5px!important;padding:6px 10px!important}
        .tabs .tab{height:44px!important;min-height:44px!important;max-height:44px!important;font-size:10px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function removeSubtitle(){
    document.querySelector('.hero .subtitle')?.remove();
  }

  function forceBetaLabel(){
    const button=document.querySelector('[data-octagon-beta-tab]');
    if(!button)return;
    if(button.textContent.trim()!=='Beta')button.textContent='Beta';
    button.setAttribute('aria-label',button.disabled?'Private beta · Cody only':'Open private beta');
  }

  function forceOrder(){
    const nav=document.querySelector('.tabs');
    if(!nav)return;
    const tabs=[...nav.querySelectorAll('.tab')].filter(tab=>tab.dataset.view!=='rules');
    tabs.forEach((tab,index)=>{
      tab.style.setProperty('grid-row',String(Math.floor(index/4)+1),'important');
      tab.style.setProperty('order',String(index+1),'important');
    });
  }

  function apply(){
    installCompressionStyles();
    removeSubtitle();
    forceOrder();
    forceBetaLabel();
  }

  function scheduleApply(){
    window.clearTimeout(resizeTimer);
    resizeTimer=window.setTimeout(apply,80);
  }

  function start(){
    apply();
    window.addEventListener('resize',scheduleApply,{passive:true});
    ['ufc-app-profile-updated','ufc-play-profile-ready','ufc-canonical-group-ready','ufc-play-data-ready'].forEach(name=>{
      window.addEventListener(name,()=>window.setTimeout(apply,0));
    });
    [50,220,850,2200,3200].forEach(delay=>window.setTimeout(apply,delay));
  }

  window.UFC_OCTAGON_HQ_NAV_GRID={version:VERSION,apply,forceBetaLabel,removeSubtitle};
  document.documentElement.setAttribute('data-octagon-hq-nav-grid',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
(function(){
  'use strict';

  const VERSION='octagon-hq-nav-grid-20260717e';
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
        .tabs{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;grid-auto-flow:row!important;align-items:stretch!important;justify-items:stretch!important;overflow:visible!important;flex-wrap:initial!important;gap:6px!important;padding:7px 12px!important}
        .tabs .tab{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;max-width:none!important;height:46px!important;min-height:46px!important;max-height:46px!important;margin:0!important;padding:5px 2px!important;font-size:10.5px!important;line-height:1!important;white-space:normal!important;border-radius:14px!important;box-sizing:border-box!important;flex:none!important}
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

  function forceGrid(){
    const nav=document.querySelector('.tabs');
    if(!nav||!window.matchMedia('(max-width: 900px)').matches)return;

    nav.style.setProperty('display','grid','important');
    nav.style.setProperty('grid-template-columns','repeat(4,minmax(0,1fr))','important');
    nav.style.setProperty('grid-auto-flow','row','important');
    nav.style.setProperty('align-items','stretch','important');
    nav.style.setProperty('justify-items','stretch','important');
    nav.style.setProperty('overflow','visible','important');
    nav.style.setProperty('gap',window.innerWidth<=430?'5px':'6px','important');
    nav.style.setProperty('padding',window.innerWidth<=430?'6px 10px':'7px 12px','important');

    const rules=nav.querySelector('.tab[data-view="rules"]');
    if(rules)rules.style.setProperty('display','none','important');

    const tabs=[...nav.querySelectorAll('.tab')].filter(tab=>tab.dataset.view!=='rules');
    tabs.forEach((tab,index)=>{
      const height=window.innerWidth<=430?'44px':'46px';
      tab.style.setProperty('display','flex','important');
      tab.style.setProperty('align-items','center','important');
      tab.style.setProperty('justify-content','center','important');
      tab.style.setProperty('width','100%','important');
      tab.style.setProperty('min-width','0','important');
      tab.style.setProperty('max-width','none','important');
      tab.style.setProperty('height',height,'important');
      tab.style.setProperty('min-height',height,'important');
      tab.style.setProperty('max-height',height,'important');
      tab.style.setProperty('margin','0','important');
      tab.style.setProperty('padding','5px 2px','important');
      tab.style.setProperty('font-size',window.innerWidth<=430?'10px':'10.5px','important');
      tab.style.setProperty('line-height','1','important');
      tab.style.setProperty('white-space','normal','important');
      tab.style.setProperty('box-sizing','border-box','important');
      tab.style.setProperty('flex','none','important');
      tab.style.setProperty('grid-column',String((index%4)+1),'important');
      tab.style.setProperty('grid-row',String(Math.floor(index/4)+1),'important');
      tab.style.setProperty('order',String(index+1),'important');
    });
  }

  function apply(){
    installCompressionStyles();
    removeSubtitle();
    forceBetaLabel();
    forceGrid();
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
    [50,220,850,2200,5000,8000].forEach(delay=>window.setTimeout(apply,delay));
  }

  window.UFC_OCTAGON_HQ_NAV_GRID={version:VERSION,apply,forceBetaLabel,forceGrid,removeSubtitle};
  document.documentElement.setAttribute('data-octagon-hq-nav-grid',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
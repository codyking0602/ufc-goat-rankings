(function(){
  'use strict';

  const VERSION='octagon-hq-nav-grid-20260717a';

  function installStyles(){
    if(document.getElementById('octagonHqNavGridCss'))return;
    const style=document.createElement('style');
    style.id='octagonHqNavGridCss';
    style.textContent=`
      @media(max-width:900px){
        .tabs{
          display:grid!important;
          grid-template-columns:repeat(4,minmax(0,1fr))!important;
          grid-auto-flow:row!important;
          align-items:stretch!important;
          overflow:visible!important;
          flex-wrap:initial!important;
          gap:7px!important;
          padding:9px 14px!important;
        }
        .tabs .tab{
          width:100%!important;
          min-width:0!important;
          min-height:48px!important;
          padding:8px 4px!important;
          font-size:11px!important;
          line-height:1.05!important;
          white-space:normal!important;
        }
        .tabs .tab[data-view="men"]{order:1}
        .tabs .tab[data-view="women"]{order:2}
        .tabs .tab[data-view="compare"]{order:3}
        .tabs .tab[data-view="play"]{order:4}
        .tabs .tab[data-view="division"]{order:5}
        .tabs .tab[data-view="categories"]{order:6}
        .tabs .tab[data-view="picks"]{order:7}
        .tabs .octagon-beta-tab{order:8}
        .tabs .tab[data-view="rules"]{display:none!important}
        .octagon-beta-tab small,.octagon-beta-tab b{display:none!important}
      }
      @media(max-width:430px){
        .tabs{gap:6px!important;padding:8px 12px!important}
        .tabs .tab{min-height:46px!important;font-size:10.5px!important;padding-left:2px!important;padding-right:2px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function forceBetaLabel(){
    const button=document.querySelector('[data-octagon-beta-tab]');
    if(!button)return;
    if(button.textContent.trim()!=='Beta')button.textContent='Beta';
    button.setAttribute('aria-label',button.disabled?'Private beta · Cody only':'Open private beta');
  }

  function start(){
    installStyles();
    forceBetaLabel();
    const nav=document.querySelector('.tabs');
    if(!nav)return;
    const observer=new MutationObserver(forceBetaLabel);
    observer.observe(nav,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['disabled','data-beta-access']});
    [0,100,350,900,2200].forEach(delay=>window.setTimeout(forceBetaLabel,delay));
  }

  window.UFC_OCTAGON_HQ_NAV_GRID={version:VERSION,forceBetaLabel};
  document.documentElement.setAttribute('data-octagon-hq-nav-grid',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

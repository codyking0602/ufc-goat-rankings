(function(){
  'use strict';

  const VERSION='critical-shell-bootstrap-20260717b-immediate';
  const ARCH_VERSION='product-architecture-20260717g-performance';
  let started=false;

  function installStyle(){
    if(document.getElementById('criticalShellCss'))return;
    const style=document.createElement('style');
    style.id='criticalShellCss';
    style.textContent=`
      html[data-critical-shell] .hero .hero-card{display:none!important}
      html[data-critical-shell] nav.tabs{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:7px!important;overflow:visible!important;padding:8px 14px!important}
      html[data-critical-shell] nav.tabs .tab{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;max-width:none!important;min-height:40px!important;margin:0!important;box-sizing:border-box!important;order:initial!important;grid-column:auto!important;grid-row:auto!important;white-space:nowrap!important}
      html[data-critical-shell] main.shell>.view:not(.active-view){display:none!important}
      html[data-critical-shell] #homeDashboardMount:empty{min-height:260px;display:grid;place-items:center;padding:22px;border:1px solid rgba(71,85,105,.45);border-radius:22px;background:linear-gradient(145deg,#142033,#0d1523);color:#cbd5e1;text-align:center}
      html[data-critical-shell] #homeDashboardMount:empty:before{content:'Loading Octagon HQ…';font:900 15px/1.2 system-ui;letter-spacing:.04em}
      @media(max-width:900px){
        html[data-critical-shell] nav.tabs{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important;padding:6px 10px 8px!important}
        html[data-critical-shell] nav.tabs .tab{min-height:42px!important;padding:6px 5px!important;font-size:11px!important;border-radius:12px!important;white-space:normal!important}
      }
    `;
    document.head.appendChild(style);
  }

  function normalizeHeader(){
    const hero=document.querySelector('.hero');
    const brand=hero?.firstElementChild;
    const eyebrow=brand?.querySelector('.eyebrow');
    const title=brand?.querySelector('h1');
    const subtitle=brand?.querySelector('.subtitle');
    if(eyebrow)eyebrow.textContent='UFC RANKINGS · GAMES · PICKS · COMMUNITY';
    if(title)title.textContent='Octagon HQ';
    if(subtitle)subtitle.textContent='Rankings, games, picks, and UFC conversation.';
    hero?.querySelector('.hero-card')?.setAttribute('aria-hidden','true');
    document.title='Octagon HQ';
  }

  function normalizeNavigation(){
    const nav=document.querySelector('nav.tabs');
    if(!nav)return;
    const rows=[
      ['home','Home','home'],
      ['rankings','Rankings','men'],
      ['play','Play','play'],
      ['picks','Picks','picks'],
      ['war-room','War Room','octagon'],
      ['intelligence','Intelligence','compare']
    ];
    const access=nav.querySelector('[data-destination="war-room"],[data-octagon-beta-tab]');
    const accessState={
      disabled:Boolean(access?.disabled),
      aria:access?.getAttribute('aria-disabled'),
      beta:access?.dataset?.betaAccess,
      member:access?.dataset?.betaMember
    };
    nav.innerHTML='';
    rows.forEach(([destination,label,view])=>{
      const button=document.createElement('button');
      button.type='button';
      button.className=`tab${destination==='home'?' active':''}`;
      button.dataset.destination=destination;
      button.dataset.view=view;
      button.setAttribute('aria-selected',String(destination==='home'));
      button.textContent=label;
      if(destination==='war-room'){
        button.dataset.octagonBetaTab='true';
        if(accessState.beta)button.dataset.betaAccess=accessState.beta;
        if(accessState.member)button.dataset.betaMember=accessState.member;
        button.disabled=accessState.disabled;
        button.setAttribute('aria-disabled',accessState.aria||String(accessState.disabled));
      }
      nav.appendChild(button);
    });
  }

  function normalizeViews(){
    const home=document.getElementById('home');
    document.querySelectorAll('main.shell>.view').forEach(view=>view.classList.toggle('active-view',view===home));
    const toolbar=document.querySelector('.toolbar');
    if(toolbar)toolbar.style.display='none';
  }

  function loadScript(id,src){
    if(document.getElementById(id))return;
    const script=document.createElement('script');
    script.id=id;
    script.src=src;
    script.async=false;
    document.head.appendChild(script);
  }

  function recover(){
    installStyle();
    normalizeHeader();
    if(window.UFC_PRODUCT_ARCHITECTURE?.version===ARCH_VERSION){
      window.UFC_PRODUCT_ARCHITECTURE.apply?.();
      return;
    }
    normalizeNavigation();
    normalizeViews();
    loadScript('criticalProductArchitecture','assets/js/product-architecture.js?v=product-architecture-20260717g-critical');
    loadScript('criticalHomeDashboard','assets/js/home-dashboard.js?v=home-dashboard-20260717d-critical');
  }

  function start(){
    if(started)return;
    started=true;
    document.documentElement.dataset.criticalShell=VERSION;
    recover();
    [80,300,900,2200].forEach(delay=>window.setTimeout(recover,delay));
    window.addEventListener('ufc-production-ranking-ready',()=>window.UFC_PRODUCT_ARCHITECTURE?.apply?.());
  }

  window.UFC_CRITICAL_SHELL={version:VERSION,recover};
  if(document.body)start();
  else document.addEventListener('DOMContentLoaded',start,{once:true});
})();
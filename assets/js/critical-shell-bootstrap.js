(function(){
  'use strict';

  const VERSION='critical-shell-bootstrap-20260717d-no-tab-reset';
  const ARCH_VERSION='product-architecture-20260717g-performance';
  const HOME_SRC='assets/js/home-dashboard.js?v=home-dashboard-20260717e-recovery';
  let started=false;
  let dashboardAttempt=0;
  let dashboardLoading=false;

  function installStyle(){
    if(document.getElementById('criticalShellCss'))return;
    const style=document.createElement('style');
    style.id='criticalShellCss';
    style.textContent=`
      html[data-critical-shell] .hero .hero-card{display:none!important}
      html[data-critical-shell] nav.tabs{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:7px!important;overflow:visible!important;padding:8px 14px!important}
      html[data-critical-shell] nav.tabs .tab{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;max-width:none!important;min-height:40px!important;margin:0!important;box-sizing:border-box!important;order:initial!important;grid-column:auto!important;grid-row:auto!important;white-space:nowrap!important}
      html[data-critical-shell] main.shell>.view:not(.active-view){display:none!important}
      .critical-home-fallback{display:grid;gap:16px}
      .critical-home-fallback .critical-home-primary,.critical-home-fallback .critical-home-card{border:1px solid rgba(71,85,105,.55);border-radius:22px;padding:24px;background:linear-gradient(145deg,#142033,#0d1523);color:#f8fafc}
      .critical-home-fallback .critical-home-primary{border-color:rgba(249,115,22,.38);background:radial-gradient(circle at 92% 8%,rgba(249,115,22,.22),transparent 32%),linear-gradient(145deg,#142033,#0d1523)}
      .critical-home-fallback .critical-home-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
      .critical-home-fallback .critical-home-kicker{margin:0 0 9px;color:#fb923c;font:950 11px/1 system-ui;letter-spacing:.16em;text-transform:uppercase}
      .critical-home-fallback h2,.critical-home-fallback h3{margin:0;color:#fff;font:950 clamp(26px,7vw,48px)/.98 system-ui;letter-spacing:-.04em}
      .critical-home-fallback h3{font-size:clamp(22px,5vw,34px)}
      .critical-home-fallback p{margin:11px 0 0;color:#cbd5e1;font:600 15px/1.48 system-ui}
      .critical-home-fallback button{margin-top:20px;min-height:48px;padding:13px 19px;border:0;border-radius:13px;background:#f97316;color:#170b03;font:950 14px/1 system-ui;letter-spacing:.04em;cursor:pointer}
      .critical-home-fallback button.secondary{background:#111827;color:#fff;border:1px solid #334155}
      @media(max-width:900px){
        html[data-critical-shell] nav.tabs{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important;padding:6px 10px 8px!important}
        html[data-critical-shell] nav.tabs .tab{min-height:42px!important;padding:6px 5px!important;font-size:11px!important;border-radius:12px!important;white-space:normal!important}
      }
      @media(max-width:620px){.critical-home-fallback .critical-home-grid{grid-template-columns:1fr}.critical-home-fallback .critical-home-primary,.critical-home-fallback .critical-home-card{padding:21px}}
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
      ['home','Home','home'],['rankings','Rankings','men'],['play','Play','play'],
      ['picks','Picks','picks'],['war-room','War Room','octagon'],['intelligence','Intelligence','compare']
    ];
    const access=nav.querySelector('[data-destination="war-room"],[data-octagon-beta-tab]');
    const accessState={disabled:Boolean(access?.disabled),aria:access?.getAttribute('aria-disabled'),beta:access?.dataset?.betaAccess,member:access?.dataset?.betaMember};
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

  function fullDashboardReady(){
    return Boolean(document.querySelector('#home .home-dashboard:not(.critical-home-fallback)'));
  }

  function renderHomeFallback(){
    if(fullDashboardReady())return;
    const home=document.getElementById('home');
    if(!home||home.querySelector('.critical-home-fallback'))return;
    home.innerHTML=`<div class="home-dashboard critical-home-fallback">
      <section class="critical-home-primary"><div class="critical-home-kicker">TODAY'S CHALLENGE</div><h2>Find the Leader</h2><p>Eliminate nine UFC fighters without removing the verified stat leader.</p><button type="button" data-critical-destination="play">PLAY NOW →</button></section>
      <div class="critical-home-grid">
        <section class="critical-home-card"><div class="critical-home-kicker">NEXT UFC EVENT</div><h3>Make Your Picks</h3><p>The live event card and your saved picks are loading.</p><button type="button" class="secondary" data-critical-destination="picks">OPEN PICKS →</button></section>
        <section class="critical-home-card"><div class="critical-home-kicker">THE WAR ROOM</div><h3>Join Conversation</h3><p>Recent avatars and notifications are loading.</p><button type="button" class="secondary" data-critical-destination="war-room">JOIN CONVERSATION →</button></section>
      </div>
      <section class="critical-home-card"><div class="critical-home-kicker">RANKING SPOTLIGHT</div><h3>Explore the Top 80</h3><p>Today's fighter spotlight is finalizing with the production rankings.</p><button type="button" class="secondary" data-critical-destination="rankings">VIEW RANKINGS →</button></section>
    </div>`;
  }

  function loadArchitecture(){
    if(window.UFC_PRODUCT_ARCHITECTURE?.version===ARCH_VERSION){window.UFC_PRODUCT_ARCHITECTURE.apply?.();return;}
    if(document.getElementById('criticalProductArchitecture'))return;
    const script=document.createElement('script');
    script.id='criticalProductArchitecture';
    script.src='assets/js/product-architecture.js?v=product-architecture-20260717g-critical';
    script.async=false;
    document.head.appendChild(script);
  }

  function ensureDashboard(force=false){
    if(fullDashboardReady()){dashboardLoading=false;return;}
    renderHomeFallback();
    if(dashboardLoading&&!force)return;
    dashboardLoading=true;
    dashboardAttempt+=1;
    const prior=document.getElementById('criticalHomeDashboard');
    if(prior)prior.remove();
    const script=document.createElement('script');
    script.id='criticalHomeDashboard';
    script.src=`${HOME_SRC}&attempt=${dashboardAttempt}`;
    script.async=true;
    script.onload=()=>{
      dashboardLoading=false;
      window.setTimeout(()=>{if(!fullDashboardReady()&&dashboardAttempt<4)ensureDashboard(true);},80);
    };
    script.onerror=()=>{
      dashboardLoading=false;
      if(dashboardAttempt<4)window.setTimeout(()=>ensureDashboard(true),300*dashboardAttempt);
    };
    document.head.appendChild(script);
  }

  function recover(forceDashboard=false){
    installStyle();
    normalizeHeader();
    const architectureReady=window.UFC_PRODUCT_ARCHITECTURE?.version===ARCH_VERSION;
    if(!architectureReady){
      normalizeNavigation();
      normalizeViews();
      loadArchitecture();
    }else{
      window.UFC_PRODUCT_ARCHITECTURE.apply?.();
    }
    ensureDashboard(forceDashboard);
  }

  function bindFallback(){
    document.addEventListener('click',event=>{
      const button=event.target.closest?.('[data-critical-destination]');
      if(!button)return;
      const destination=button.dataset.criticalDestination;
      if(window.UFC_PRODUCT_ARCHITECTURE?.activateDestination)window.UFC_PRODUCT_ARCHITECTURE.activateDestination(destination);
      else document.querySelector(`[data-destination="${destination}"]`)?.click();
    });
  }

  function start(){
    if(started)return;
    started=true;
    document.documentElement.dataset.criticalShell=VERSION;
    bindFallback();
    recover();
    [180,700,1800,4200].forEach((delay,index)=>window.setTimeout(()=>recover(index>1),delay));
    window.addEventListener('load',()=>recover(true),{once:true});
    window.addEventListener('ufc-production-ranking-ready',()=>{window.UFC_PRODUCT_ARCHITECTURE?.apply?.();ensureDashboard(true);});
  }

  window.UFC_CRITICAL_SHELL={version:VERSION,recover,ensureDashboard};
  if(document.body)start();
  else document.addEventListener('DOMContentLoaded',start,{once:true});
})();
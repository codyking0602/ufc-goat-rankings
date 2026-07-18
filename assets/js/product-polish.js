(function(){
  'use strict';

  const VERSION='product-polish-20260718b-mobile-audit';
  let scheduled=false;
  let resizeTimer=0;

  const text=value=>String(value??'').trim();

  function ensureHeaderTools(){
    const hero=document.querySelector('.hero');
    if(!hero)return false;
    let tools=hero.querySelector('.product-header-tools');
    if(!tools){
      tools=document.createElement('div');
      tools.className='product-header-tools';
      tools.setAttribute('aria-label','App profile and update controls');
      hero.appendChild(tools);
    }
    const profile=hero.querySelector('.app-profile-tools');
    const refresh=hero.querySelector('#manualRefreshControl');
    if(profile&&profile.parentElement!==tools)tools.appendChild(profile);
    if(refresh&&refresh.parentElement!==tools)tools.appendChild(refresh);
    return true;
  }

  function standardizeHeaders(){
    document.querySelectorAll('.section-title').forEach(header=>header.classList.add('product-page-header'));
  }

  function removeDeveloperResidue(){
    document.querySelectorAll('#picksSetupNote,.picks-setup-note,#picksWarRoomBridge,.picks-war-room-bridge,[data-dev-note],[data-preview-note]').forEach(node=>node.remove());
  }

  function normalizeWarRoomCopy(){
    const board=document.querySelector('[data-octagon-board]');
    if(!board)return;
    const kicker=board.querySelector('.octagon-board-kicker');
    const title=board.querySelector('.octagon-board-head h2');
    const input=board.querySelector('[data-octagon-input]');
    const manage=board.querySelector('[data-octagon-manage-beta]');
    if(kicker)kicker.textContent='GOAT26 WAR ROOM';
    if(title)title.textContent='The War Room';
    if(input)input.placeholder='Post to The War Room…';
    if(manage){
      manage.textContent='Manage Access';
      manage.setAttribute('aria-label','Manage War Room access');
    }
    const panel=board.querySelector('[data-octagon-access-panel]');
    const panelTitle=panel?.querySelector('.octagon-access-panel-head strong');
    const panelCopy=panel?.querySelector('.octagon-access-panel-head small');
    if(panelTitle)panelTitle.textContent='Manage Access';
    if(panelCopy)panelCopy.textContent='Choose which GOAT26 profiles can open The War Room.';
  }

  function normalizeUpdateCopy(){
    const title=document.getElementById('whatsNewTitle');
    if(title&&/octagon just got bigger/i.test(text(title.textContent)))title.textContent='Octagon HQ Update';
  }

  function cleanStaleLoading(){
    const home=document.getElementById('homeDashboardMount');
    if(home?.querySelector('.home-dashboard')){
      [...home.childNodes].forEach(node=>{
        if(node.nodeType===Node.TEXT_NODE&&/loading octagon hq/i.test(text(node.textContent)))node.remove();
      });
      home.querySelectorAll('.home-dashboard-empty').forEach(node=>{
        if(/loading octagon hq/i.test(text(node.textContent)))node.remove();
      });
    }
  }

  function visibleMajorControls(){
    const selectors=[
      'nav.tabs .tab',
      '.rankings-subnav button',
      '.home-dashboard-action',
      '.play-primary','.play-secondary',
      '.picks-primary','.picks-secondary',
      '.intelligence-primary','.intelligence-secondary',
      '.profile-connectivity-actions button',
      '.octagon-intelligence-button',
      '[data-octagon-refresh]','[data-octagon-alerts]','[data-octagon-manage-beta]'
    ];
    return [...document.querySelectorAll(selectors.join(','))].filter(node=>{
      const style=getComputedStyle(node);
      return style.display!=='none'&&style.visibility!=='hidden'&&node.getClientRects().length>0;
    });
  }

  function auditMobileCohesion(){
    window.clearTimeout(resizeTimer);
    resizeTimer=window.setTimeout(()=>{
      const viewport=Math.max(document.documentElement.clientWidth,window.innerWidth||0);
      const documentOverflow=document.documentElement.scrollWidth>viewport+2;
      const active=document.querySelector('main.shell>.view.active-view');
      const activeBox=active?.getBoundingClientRect();
      const activeOverflow=Boolean(activeBox&&(activeBox.left<-2||activeBox.right>viewport+2||active.scrollWidth>active.clientWidth+2));
      const undersized=viewport<=900
        ? visibleMajorControls().filter(node=>node.getBoundingClientRect().height<40).length
        : 0;
      const guarded=documentOverflow||activeOverflow;
      document.body.classList.toggle('product-overflow-guard',guarded);
      document.documentElement.dataset.mobileCohesion=guarded||undersized?'guarded':'passed';
      document.documentElement.dataset.mobileOverflow=guarded?'true':'false';
      document.documentElement.dataset.mobileTouchTargets=undersized?'guarded':'passed';
      document.documentElement.dataset.mobileViewport=viewport<=430?'phone-small':viewport<=900?'phone-tablet':'desktop';
    },80);
  }

  function apply(){
    ensureHeaderTools();
    standardizeHeaders();
    removeDeveloperResidue();
    normalizeWarRoomCopy();
    normalizeUpdateCopy();
    cleanStaleLoading();
    auditMobileCohesion();
    document.documentElement.dataset.productPolish=VERSION;
  }

  function schedule(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{
      scheduled=false;
      apply();
    });
  }

  function start(){
    apply();
    [120,420,1100,2200].forEach(delay=>window.setTimeout(schedule,delay));
    ['octagon-hq:view-change','ufc-play-profile-ready','ufc-app-profile-updated','ufc-production-ranking-ready','ufc-scoring-pipeline-ready'].forEach(name=>window.addEventListener(name,schedule));
    window.addEventListener('resize',auditMobileCohesion,{passive:true});
    window.addEventListener('orientationchange',auditMobileCohesion,{passive:true});
  }

  window.UFC_PRODUCT_POLISH={version:VERSION,apply,auditMobileCohesion};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

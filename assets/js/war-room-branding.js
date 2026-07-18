(function(){
  'use strict';

  const VERSION='war-room-experience-20260718c-hierarchy-live';
  let observer=null;
  let frame=0;
  let organizing=false;
  let active=false;

  function installStyles(){
    let style=document.getElementById('warRoomExperienceCss');
    if(!style){
      style=document.createElement('style');
      style.id='warRoomExperienceCss';
      document.head.appendChild(style);
    }
    style.textContent=`
      .octagon-board-head{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:16px!important;align-items:stretch!important}
      .octagon-board-head-actions.war-room-control-stack{display:grid!important;grid-template-columns:1fr!important;gap:10px!important;align-items:stretch!important;justify-content:stretch!important;width:100%!important}
      .war-room-utility-row{display:flex;align-items:center;gap:8px;min-width:0}
      .war-room-utility-row .octagon-live{margin-right:auto;pointer-events:none}
      .war-room-utility-row .octagon-week-select:not([hidden]){min-width:0;max-width:210px}
      .war-room-utility-icon{width:38px!important;min-width:38px!important;height:38px!important;min-height:38px!important;padding:0!important;border-radius:12px!important;font-size:0!important;line-height:0!important;display:inline-grid!important;place-items:center!important}
      .war-room-utility-icon:before{font:800 18px/1 system-ui}
      [data-octagon-alerts].war-room-utility-icon:before{content:"🔔"}
      [data-octagon-refresh].war-room-utility-icon:before{content:"↻";font-size:22px}
      [data-octagon-alerts].war-room-utility-icon.on:after{content:"";position:absolute;width:7px;height:7px;border-radius:50%;background:#22c55e;transform:translate(11px,-11px);box-shadow:0 0 0 2px #101827}
      [data-octagon-alerts].war-room-utility-icon{position:relative}
      .war-room-primary-actions{display:grid;width:100%}
      .war-room-primary-actions .octagon-intelligence-button{width:100%!important;min-height:50px!important;border:1px solid #f97316!important;border-radius:14px!important;background:#f97316!important;color:#17100b!important;padding:0 16px!important;font:950 11px/1 system-ui!important;letter-spacing:.06em!important}
      .war-room-admin-actions{display:flex;justify-content:flex-end;min-height:0}
      .war-room-admin-actions:empty{display:none}
      .war-room-admin-actions .octagon-manage-beta{min-height:32px!important;border-color:#435675!important;background:transparent!important;color:#94a3b8!important;padding:0 10px!important;font-size:9px!important}
      .war-room-admin-actions .octagon-manage-beta.active{border-color:#f97316!important;color:#fed7aa!important;background:rgba(249,115,22,.1)!important}
      .octagon-board-kicker{color:#fb923c!important}
      @media(max-width:620px){
        .octagon-board-head{padding:16px!important;gap:14px!important}
        .war-room-utility-row{gap:7px}
        .war-room-utility-row .octagon-week-select:not([hidden]){max-width:150px}
        .war-room-primary-actions .octagon-intelligence-button{min-height:48px!important}
      }
    `;
  }

  function ensureGroup(parent,className,dataName){
    let node=parent.querySelector(`:scope > .${className}`);
    if(!node){
      node=document.createElement('div');
      node.className=className;
      if(dataName)node.dataset[dataName]='true';
      parent.appendChild(node);
    }
    return node;
  }

  function replaceVisibleCopy(board){
    const kicker=board.querySelector('.octagon-board-kicker');
    const title=board.querySelector('.octagon-board-head h2');
    const input=board.querySelector('[data-octagon-input]');
    if(kicker&&kicker.textContent!=='GOAT26 WAR ROOM')kicker.textContent='GOAT26 WAR ROOM';
    if(title&&title.textContent!=='The War Room')title.textContent='The War Room';
    if(input&&input.placeholder!=='Post to The War Room…')input.placeholder='Post to The War Room…';

    board.querySelectorAll('.octagon-empty strong,.octagon-auth-card strong,.octagon-notice,.octagon-board-week').forEach(node=>{
      const current=node.textContent||'';
      const next=current
        .replace(/The Octagon/g,'The War Room')
        .replace(/the Octagon/g,'the War Room')
        .replace(/Octagon/g,'War Room')
        .replace(/private Beta/gi,'War Room');
      if(next!==current)node.textContent=next;
    });

    const panel=board.querySelector('[data-octagon-access-panel]');
    if(panel){
      const eyebrow=panel.querySelector('.octagon-access-panel-head span');
      const heading=panel.querySelector('.octagon-access-panel-head strong');
      const description=panel.querySelector('.octagon-access-panel-head small');
      if(eyebrow)eyebrow.textContent='CODY · ADMIN ONLY';
      if(heading)heading.textContent='Manage Access';
      if(description)description.textContent='Choose which GOAT26 profiles can open The War Room.';
    }
  }

  function organize(){
    if(organizing)return false;
    const board=document.querySelector('[data-octagon-board]');
    const header=board?.querySelector('.octagon-board-head');
    const actions=header?.querySelector('.octagon-board-head-actions');
    if(!board||!header||!actions)return false;

    organizing=true;
    try{
      installStyles();
      replaceVisibleCopy(board);
      actions.classList.add('war-room-control-stack');

      const utility=ensureGroup(actions,'war-room-utility-row','warRoomUtility');
      const primary=ensureGroup(actions,'war-room-primary-actions','warRoomPrimaryActions');
      const admin=ensureGroup(actions,'war-room-admin-actions','warRoomAdminActions');

      const live=actions.querySelector('[data-octagon-live]');
      const week=actions.querySelector('[data-octagon-week-select]');
      const alerts=actions.querySelector('[data-octagon-alerts]');
      const refresh=actions.querySelector('[data-octagon-refresh]');
      const intelligence=actions.querySelector('[data-connectivity-war-intelligence]');
      const manage=actions.querySelector('[data-octagon-manage-beta]');

      [live,week,alerts,refresh].forEach(node=>{if(node&&node.parentElement!==utility)utility.appendChild(node);});
      if(alerts){
        alerts.classList.add('war-room-utility-icon');
        alerts.setAttribute('aria-label',alerts.classList.contains('on')?'Disable War Room alerts':'Enable War Room alerts');
        alerts.title=alerts.getAttribute('aria-label');
      }
      if(refresh){
        refresh.classList.add('war-room-utility-icon');
        refresh.setAttribute('aria-label','Refresh The War Room');
        refresh.title='Refresh The War Room';
      }
      if(intelligence){
        if(intelligence.parentElement!==primary)primary.appendChild(intelligence);
        if(intelligence.textContent!=='TAKE TO INTELLIGENCE →')intelligence.textContent='TAKE TO INTELLIGENCE →';
      }
      if(manage){
        if(manage.parentElement!==admin)admin.appendChild(manage);
        if(manage.textContent!=='Manage Access')manage.textContent='Manage Access';
        manage.setAttribute('aria-label','Manage War Room access');
      }

      const liveLabel=live?.querySelector('b');
      if(active&&liveLabel?.textContent==='PAUSED'){
        live.classList.remove('live','offline');
        live.classList.add(navigator.onLine?'connecting':'offline');
        liveLabel.textContent=navigator.onLine?'CONNECTING':'OFFLINE';
      }
    }finally{
      organizing=false;
    }
    return true;
  }

  function schedule(){
    if(frame)return;
    frame=requestAnimationFrame(()=>{
      frame=0;
      organize();
    });
  }

  async function syncForView(isActive){
    active=Boolean(isActive);
    schedule();
    const board=window.UFC_OCTAGON_BOARD;
    if(active){
      const live=document.querySelector('[data-octagon-live]');
      const label=live?.querySelector('b');
      if(label&&(label.textContent==='PAUSED'||label.textContent==='OFFLINE')&&navigator.onLine){
        live.classList.remove('live','offline');
        live.classList.add('connecting');
        label.textContent='CONNECTING';
      }
      await window.UFC_OCTAGON_NOTIFICATIONS?.refreshStatus?.({opening:true});
      await board?.load?.(null,{silent:true});
      await board?.ensureRealtime?.();
      window.setTimeout(()=>window.UFC_OCTAGON_NOTIFICATIONS?.markSeen?.(),500);
    }else{
      await board?.stopRealtime?.();
    }
    schedule();
  }

  function bind(){
    const root=document.getElementById('octagon');
    if(root){
      observer?.disconnect();
      observer=new MutationObserver(schedule);
      observer.observe(root,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class','hidden']});
    }
    window.addEventListener('octagon-hq:view-change',event=>{
      syncForView(event.detail?.destination==='war-room');
    });
    document.addEventListener('visibilitychange',()=>{
      if(document.hidden){
        window.UFC_OCTAGON_BOARD?.stopRealtime?.();
      }else if(active){
        syncForView(true);
      }
    });
  }

  function start(){
    installStyles();
    active=window.UFC_PRODUCT_ARCHITECTURE?.currentDestination==='war-room'
      ||document.getElementById('octagon')?.classList.contains('active-view');
    bind();
    organize();
    [80,260,700,1600].forEach(delay=>window.setTimeout(schedule,delay));
    if(active)syncForView(true);
  }

  window.UFC_WAR_ROOM_EXPERIENCE={
    version:VERSION,
    apply:organize,
    syncForView
  };
  document.documentElement.setAttribute('data-war-room-branding',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
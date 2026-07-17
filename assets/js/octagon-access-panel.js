(function(){
  'use strict';

  const VERSION='octagon-access-panel-20260717a';
  const CANONICAL_CODE='GOAT26';
  const TOKEN_KEY=`ufc-picks:group:${CANONICAL_CODE}`;
  const ACCESS_CHANNEL=`octagon-access-${CANONICAL_CODE.toLowerCase()}`;
  const instanceId=globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const state={
    me:null,
    canAccess:false,
    roster:[],
    loading:false,
    busyId:'',
    panelOpen:false,
    channel:null,
    realtimeClient:null,
    refreshTimer:0,
    pollTimer:0
  };

  const text=value=>String(value??'').trim();
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));
  const initials=value=>text(value).split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase()||'UFC';
  const get=key=>{try{return localStorage.getItem(key)||'';}catch(_error){return'';}};
  const tokenFor=identity=>text(identity?.memberToken||identity?.member_token||get(TOKEN_KEY));

  function fighterFor(slug){
    const clean=text(slug).toLowerCase();
    if(!clean)return null;
    return window.UFC_PLAY_DATA?.byId?.[clean]
      || window.UFC_PLAY_DATA?.resolve?.(clean)
      || null;
  }

  function fighterPhoto(fighter){
    if(!fighter)return'';
    if(fighter.thumbUrl)return text(fighter.thumbUrl);
    const candidates=window.UFC_PLAY_PHOTO_AUTHORITY?.candidatesFor?.(fighter);
    return text(candidates?.thumbs?.[0]||fighter.profileUrl||candidates?.profiles?.[0]);
  }

  function avatarMarkup(member){
    const fighter=fighterFor(member?.fighter_avatar_slug);
    const src=fighterPhoto(fighter);
    const label=fighter?.name||member?.display_name||'UFC profile';
    return `<span class="octagon-access-avatar" data-access-member-name="${esc(member?.display_name||'')}">${src
      ? `<img src="${esc(src)}" alt="${esc(label)}" data-access-avatar-image>`
      : `<span>${esc(initials(member?.display_name))}</span>`}</span>`;
  }

  function hydrateBrokenImages(rootNode=document){
    rootNode.querySelectorAll?.('img[data-access-avatar-image]').forEach(image=>{
      if(image.dataset.accessErrorBound)return;
      image.dataset.accessErrorBound='true';
      image.addEventListener('error',()=>{
        const fallback=document.createElement('span');
        fallback.textContent=initials(image.closest('[data-access-member-name]')?.dataset.accessMemberName||image.alt);
        image.replaceWith(fallback);
      },{once:true});
    });
  }

  function installStyles(){
    if(document.getElementById('octagonAccessPanelCss'))return;
    const style=document.createElement('style');
    style.id='octagonAccessPanelCss';
    style.textContent=`
      .octagon-manage-beta{border-color:rgba(249,115,22,.5)!important;color:#fed7aa!important}.octagon-manage-beta.active{border-color:#f97316!important;background:rgba(249,115,22,.14)!important;color:#fff!important}.octagon-manage-beta[hidden]{display:none!important}
      .octagon-access-panel{border-left:1px solid #2b3a52;border-right:1px solid #2b3a52;background:linear-gradient(180deg,#111a2a,#0d1523);padding:14px}.octagon-access-panel[hidden]{display:none!important}.octagon-access-panel-inner{border:1px solid rgba(249,115,22,.34);border-radius:17px;background:rgba(249,115,22,.055);overflow:hidden}.octagon-access-panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:14px;border-bottom:1px solid #2b3a52}.octagon-access-panel-head span,.octagon-access-panel-head strong,.octagon-access-panel-head small{display:block}.octagon-access-panel-head span{color:#fb923c;font:950 8px/1 system-ui;letter-spacing:.13em}.octagon-access-panel-head strong{margin-top:5px;color:#fff;font:950 16px/1.05 system-ui}.octagon-access-panel-head small{margin-top:6px;color:#94a3b8;font:700 10px/1.35 system-ui}.octagon-access-panel-close{width:31px;height:31px;min-width:31px;border:1px solid #435675;border-radius:10px;background:#111827;color:#fff;cursor:pointer;font:900 17px/1 system-ui}.octagon-access-status{min-height:0;padding:0 14px;color:#fdba74;font:750 10px/1.4 system-ui}.octagon-access-status:not(:empty){padding-top:10px}.octagon-access-status.error{color:#fca5a5}.octagon-access-list{display:grid;gap:7px;padding:12px}.octagon-access-row{display:grid;grid-template-columns:38px minmax(0,1fr) auto;align-items:center;gap:10px;min-width:0;padding:9px 10px;border:1px solid #2f405a;border-radius:14px;background:#101827}.octagon-access-avatar{width:38px;height:38px;min-width:38px;border:1px solid rgba(249,115,22,.5);border-radius:12px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 18%,rgba(249,115,22,.35),#111827 68%);color:#fff;font:950 10px/1 system-ui}.octagon-access-avatar img{width:100%;height:100%;display:block;object-fit:cover;object-position:center 12%}.octagon-access-member{min-width:0}.octagon-access-member strong,.octagon-access-member small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.octagon-access-member strong{color:#fff;font:950 12px/1 system-ui}.octagon-access-member small{margin-top:5px;color:#94a3b8;font:750 8px/1 system-ui;letter-spacing:.06em}.octagon-access-member small.admin{color:#fb923c}.octagon-access-toggle{min-width:82px;min-height:34px;border:1px solid #475569;border-radius:999px;background:#0b1220;color:#94a3b8;padding:0 9px;display:inline-flex;align-items:center;justify-content:center;gap:7px;cursor:pointer;font:950 8px/1 system-ui;letter-spacing:.06em}.octagon-access-toggle i{width:8px;height:8px;border-radius:50%;background:#64748b}.octagon-access-toggle.enabled{border-color:rgba(34,197,94,.46);background:rgba(22,101,52,.16);color:#86efac}.octagon-access-toggle.enabled i{background:#22c55e}.octagon-access-toggle:disabled{cursor:not-allowed;opacity:.62}.octagon-access-footer{padding:0 14px 13px;color:#64748b;font:700 9px/1.4 system-ui}.octagon-access-loading{padding:22px;color:#94a3b8;text-align:center;font:800 11px/1.4 system-ui}
      @media(max-width:620px){.octagon-access-panel{padding:10px}.octagon-access-panel-head{padding:12px}.octagon-access-list{padding:9px}.octagon-access-row{grid-template-columns:36px minmax(0,1fr) auto;padding:8px}.octagon-access-avatar{width:36px;height:36px;min-width:36px}.octagon-access-toggle{min-width:76px;padding:0 7px}}
    `;
    document.head.appendChild(style);
  }

  function boardRoot(){return document.querySelector('[data-octagon-board]');}
  function betaButton(){return document.querySelector('[data-octagon-beta-tab]');}
  function isCody(member){return Boolean(member?.is_admin)&&text(member?.display_name).toLowerCase()==='cody';}

  function setBetaTabAccess(allowed,member=state.me){
    const button=betaButton();
    if(!button)return false;
    button.disabled=!allowed;
    button.setAttribute('aria-disabled',String(!allowed));
    button.dataset.betaAccess=allowed?'owner':'locked';
    button.title=allowed?'Open The Octagon':'Private Beta · Access not enabled';
    button.textContent='Beta';
    button.setAttribute('aria-label',allowed?'Open The Octagon':'Private Beta · Access not enabled');
    if(member?.display_name)button.dataset.betaMember=text(member.display_name);
    return true;
  }

  function ensurePanel(){
    const board=boardRoot();
    const header=board?.querySelector('.octagon-board-head');
    const actions=header?.querySelector('.octagon-board-head-actions');
    if(!board||!header||!actions)return false;
    installStyles();

    let manage=actions.querySelector('[data-octagon-manage-beta]');
    if(!manage){
      manage=document.createElement('button');
      manage.type='button';
      manage.className='octagon-manage-beta';
      manage.dataset.octagonManageBeta='true';
      manage.textContent='Manage Beta';
      const refresh=actions.querySelector('[data-octagon-refresh]');
      if(refresh)refresh.before(manage);else actions.appendChild(manage);
      manage.addEventListener('click',()=>togglePanel());
    }

    let panel=board.querySelector('[data-octagon-access-panel]');
    if(!panel){
      panel=document.createElement('section');
      panel.className='octagon-access-panel';
      panel.dataset.octagonAccessPanel='true';
      panel.hidden=true;
      panel.innerHTML=`<div class="octagon-access-panel-inner">
        <div class="octagon-access-panel-head"><div><span>CODY · ADMIN ONLY</span><strong>Manage Beta Access</strong><small>Choose which GOAT26 profiles can open The Octagon.</small></div><button type="button" class="octagon-access-panel-close" data-octagon-access-close aria-label="Close access panel">×</button></div>
        <div class="octagon-access-status" data-octagon-access-status role="status"></div>
        <div class="octagon-access-list" data-octagon-access-list><div class="octagon-access-loading">Open the panel to load the GOAT26 roster.</div></div>
        <div class="octagon-access-footer">Cody stays enabled permanently. Changes are checked against the server on every device.</div>
      </div>`;
      header.after(panel);
      panel.querySelector('[data-octagon-access-close]')?.addEventListener('click',()=>togglePanel(false));
    }

    const admin=isCody(state.me);
    manage.hidden=!admin;
    if(!admin&&state.panelOpen)togglePanel(false);
    return true;
  }

  function accessStatus(message='',kind=''){
    const node=boardRoot()?.querySelector('[data-octagon-access-status]');
    if(!node)return;
    node.textContent=message;
    node.classList.toggle('error',kind==='error');
  }

  function renderRoster(){
    const list=boardRoot()?.querySelector('[data-octagon-access-list]');
    if(!list)return;
    if(state.loading){
      list.innerHTML='<div class="octagon-access-loading">Loading GOAT26 access…</div>';
      return;
    }
    if(!state.roster.length){
      list.innerHTML='<div class="octagon-access-loading">No active GOAT26 profiles were returned.</div>';
      return;
    }
    list.innerHTML=state.roster.map(member=>{
      const lockedAdmin=isCody(member);
      const enabled=Boolean(member.can_access);
      const busy=state.busyId===member.id;
      return `<div class="octagon-access-row" data-access-member-id="${esc(member.id)}">
        ${avatarMarkup(member)}
        <div class="octagon-access-member"><strong>${esc(member.display_name)}</strong><small class="${member.is_admin?'admin':''}">${member.is_admin?'ADMIN · ALWAYS ENABLED':member.fighter_avatar_slug?'FIGHTER PROFILE SET':'NO FIGHTER SELECTED'}</small></div>
        <button type="button" class="octagon-access-toggle ${enabled?'enabled':'locked'}" data-access-toggle aria-pressed="${enabled?'true':'false'}" ${lockedAdmin||busy?'disabled':''}><i></i><b>${busy?'SAVING…':enabled?'ENABLED':'LOCKED'}</b></button>
      </div>`;
    }).join('');
    list.querySelectorAll('[data-access-toggle]').forEach(button=>button.addEventListener('click',()=>{
      const row=button.closest('[data-access-member-id]');
      if(row?.dataset.accessMemberId)toggleMember(row.dataset.accessMemberId);
    }));
    hydrateBrokenImages(list);
  }

  async function context(){
    const profile=window.UFC_PLAY_PROFILE;
    const identity=await profile?.resolve?.().catch(()=>null);
    return{client:profile?.client||null,identity,token:tokenFor(identity)};
  }

  async function checkCurrentAccess(){
    const {client,token}=await context();
    if(!client||!token){
      state.me=null;
      state.canAccess=false;
      setBetaTabAccess(false,null);
      ensurePanel();
      return null;
    }
    try{
      const {data,error}=await client.rpc('octagon_access_status',{p_member_token:token});
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'Could not verify Octagon access.');
      state.me=data.member||null;
      state.canAccess=Boolean(data.can_access);
      setBetaTabAccess(state.canAccess,state.me);
      ensurePanel();
      await ensureAccessRealtime(client);
      return data;
    }catch(_error){
      ensurePanel();
      return null;
    }
  }

  async function loadRoster(){
    if(state.loading||!isCody(state.me))return null;
    state.loading=true;
    accessStatus('Loading GOAT26 access…');
    renderRoster();
    try{
      const {client,token}=await context();
      if(!client||!token)throw new Error('Reconnect your Cody profile.');
      const {data,error}=await client.rpc('octagon_admin_access_roster',{p_member_token:token});
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'The access roster could not be loaded.');
      state.roster=Array.isArray(data.members)?data.members:[];
      accessStatus('');
      return data;
    }catch(error){
      state.roster=[];
      accessStatus(text(error?.message)||'The access roster could not be loaded.','error');
      return null;
    }finally{
      state.loading=false;
      renderRoster();
    }
  }

  async function toggleMember(memberId){
    const member=state.roster.find(item=>item.id===memberId);
    if(!member||isCody(member)||state.busyId)return;
    const next=!Boolean(member.can_access);
    state.busyId=member.id;
    accessStatus(`${next?'Enabling':'Locking'} ${member.display_name}…`);
    renderRoster();
    try{
      const {client,token}=await context();
      if(!client||!token)throw new Error('Reconnect your Cody profile.');
      const {data,error}=await client.rpc('octagon_admin_set_access',{
        p_member_token:token,
        p_target_member_id:member.id,
        p_can_access:next
      });
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'The access change could not be saved.');
      member.can_access=next;
      accessStatus(`${member.display_name} is now ${next?'enabled':'locked'}.`);
      await broadcastAccessChange();
      await window.UFC_OCTAGON_BOARD?.broadcastChange?.('access');
    }catch(error){
      accessStatus(text(error?.message)||'The access change could not be saved.','error');
    }finally{
      state.busyId='';
      renderRoster();
    }
  }

  async function togglePanel(force){
    ensurePanel();
    if(!isCody(state.me))return;
    state.panelOpen=typeof force==='boolean'?force:!state.panelOpen;
    const panel=boardRoot()?.querySelector('[data-octagon-access-panel]');
    const manage=boardRoot()?.querySelector('[data-octagon-manage-beta]');
    if(panel)panel.hidden=!state.panelOpen;
    manage?.classList.toggle('active',state.panelOpen);
    manage?.setAttribute('aria-expanded',String(state.panelOpen));
    if(state.panelOpen)await loadRoster();
  }

  function scheduleAccessCheck(delay=120){
    window.clearTimeout(state.refreshTimer);
    state.refreshTimer=window.setTimeout(()=>checkCurrentAccess(),delay);
  }

  async function stopAccessRealtime(){
    const channel=state.channel;
    const client=state.realtimeClient;
    state.channel=null;
    state.realtimeClient=null;
    if(!channel)return;
    try{
      if(client?.removeChannel)await client.removeChannel(channel);
      else await channel.unsubscribe?.();
    }catch(_error){}
  }

  async function ensureAccessRealtime(client=window.UFC_PLAY_PROFILE?.client){
    if(!client?.channel)return null;
    if(state.channel&&state.realtimeClient===client)return state.channel;
    if(state.channel)await stopAccessRealtime();
    const channel=client.channel(ACCESS_CHANNEL,{config:{broadcast:{self:false,ack:true}}});
    channel.on('broadcast',{event:'access-change'},event=>{
      if(event?.payload?.source===instanceId)return;
      scheduleAccessCheck(80);
      if(state.panelOpen&&isCody(state.me))window.setTimeout(loadRoster,180);
    });
    state.channel=channel;
    state.realtimeClient=client;
    channel.subscribe();
    return channel;
  }

  async function broadcastAccessChange(){
    const channel=await ensureAccessRealtime();
    if(!channel)return;
    try{
      await channel.send({
        type:'broadcast',
        event:'access-change',
        payload:{source:instanceId,at:new Date().toISOString()}
      });
    }catch(_error){}
  }

  function start(){
    installStyles();
    [0,250,900,2600,5000].forEach(delay=>window.setTimeout(()=>{
      ensurePanel();
      checkCurrentAccess();
    },delay));
    ['ufc-play-profile-ready','ufc-app-profile-updated','ufc-canonical-group-ready'].forEach(name=>{
      window.addEventListener(name,()=>{
        scheduleAccessCheck(60);
        window.setTimeout(checkCurrentAccess,500);
      });
    });
    window.addEventListener('storage',event=>{
      if(event.key===TOKEN_KEY)scheduleAccessCheck(60);
    });
    document.addEventListener('visibilitychange',()=>{
      if(!document.hidden)scheduleAccessCheck(80);
    });
    window.addEventListener('online',()=>scheduleAccessCheck(100));
    window.addEventListener('pagehide',()=>stopAccessRealtime(),{once:true});
    state.pollTimer=window.setInterval(()=>{
      if(!document.hidden)checkCurrentAccess();
    },60000);
  }

  window.UFC_OCTAGON_ACCESS={
    version:VERSION,
    checkCurrentAccess,
    loadRoster,
    toggleMember,
    togglePanel,
    get roster(){return state.roster.slice();},
    get canAccess(){return state.canAccess;}
  };
  document.documentElement.setAttribute('data-octagon-access-panel',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

(function(){
  'use strict';

  const VERSION='app-profile-20260717a';
  const CANONICAL_CODE='GOAT26';
  const state={identity:null,group:null,selectedSlug:'',modal:null};

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));
  const text=value=>String(value??'').trim();
  const initials=value=>text(value).split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase()||'UFC';
  const tokenFor=identity=>text(identity?.memberToken||identity?.member_token);

  function fighterForSlug(slug){
    const clean=text(slug).toLowerCase();
    if(!clean)return null;
    return window.UFC_PLAY_DATA?.byId?.[clean]
      || window.UFC_PLAY_DATA?.resolve?.(clean)
      || null;
  }

  function fighterPhoto(fighter,kind='thumb'){
    if(!fighter)return'';
    if(kind==='profile'&&fighter.profileUrl)return fighter.profileUrl;
    if(fighter.thumbUrl)return fighter.thumbUrl;
    const candidates=window.UFC_PLAY_PHOTO_AUTHORITY?.candidatesFor?.(fighter);
    return kind==='profile'?(candidates?.profiles?.[0]||candidates?.thumbs?.[0]||''):(candidates?.thumbs?.[0]||candidates?.profiles?.[0]||'');
  }

  function memberFighter(member){
    return fighterForSlug(member?.fighter_avatar_slug);
  }

  function avatarMarkup(member,className=''){
    const fighter=memberFighter(member);
    const src=fighterPhoto(fighter);
    const label=fighter?.name||member?.display_name||'UFC profile';
    return `<span class="app-profile-avatar ${esc(className)}" aria-label="${esc(label)}">${src
      ? `<img src="${esc(src)}" alt="${esc(label)}" data-profile-avatar-image data-fighter-photo="true" data-fighter-name="${esc(fighter?.name||'')}">`
      : `<span>${esc(initials(member?.display_name))}</span>`}</span>`;
  }

  function hydrateBrokenImages(root=document){
    root.querySelectorAll?.('img[data-profile-avatar-image]').forEach(image=>{
      if(image.dataset.profileErrorBound)return;
      image.dataset.profileErrorBound='true';
      image.addEventListener('error',()=>{
        const fallback=document.createElement('span');
        fallback.textContent=initials(image.closest('[data-member-name]')?.dataset.memberName||image.alt);
        image.replaceWith(fallback);
      },{once:true});
    });
  }

  async function groupSnapshot(identity=state.identity){
    const client=window.UFC_PLAY_PROFILE?.client;
    const token=tokenFor(identity);
    if(!client||!token)return null;
    const {data,error}=await client.rpc('app_profile_group_snapshot',{p_member_token:token});
    if(error)throw error;
    if(!data?.ok)throw new Error(data?.error||'Could not load the UFC App group.');
    state.group=data;
    return data;
  }

  async function resolve(force=false){
    if(state.identity&&!force)return state.identity;
    const identity=await window.UFC_PLAY_PROFILE?.resolve?.();
    state.identity=identity||null;
    if(identity){
      try{await groupSnapshot(identity);}catch(_error){state.group=null;}
    }else{
      state.group=null;
    }
    renderChip();
    return state.identity;
  }

  function installStyles(){
    if(document.getElementById('appProfileCss'))return;
    const style=document.createElement('style');
    style.id='appProfileCss';
    style.textContent=`
      .app-profile-tools{display:grid;gap:10px;min-width:184px}.app-profile-tools .hero-card{min-width:0}.app-profile-chip{width:100%;min-height:56px;border:1px solid #34445d;border-radius:18px;background:linear-gradient(180deg,#1a2435,#111827);color:#fff;display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:center;gap:10px;padding:7px 10px;cursor:pointer;text-align:left;box-shadow:0 14px 35px rgba(0,0,0,.24)}.app-profile-chip:hover{border-color:#f97316;transform:translateY(-1px)}.app-profile-chip-copy{min-width:0}.app-profile-chip-copy small,.app-profile-chip-copy strong{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.app-profile-chip-copy small{color:#94a3b8;font:900 9px/1 system-ui;letter-spacing:.1em}.app-profile-chip-copy strong{margin-top:4px;font:950 14px/1 system-ui}.app-profile-chip-badge{color:#fdba74;font:950 9px/1 system-ui;letter-spacing:.08em}.app-profile-avatar{width:42px;height:42px;min-width:42px;border-radius:14px;overflow:hidden;border:1px solid rgba(249,115,22,.55);background:radial-gradient(circle at 50% 20%,rgba(249,115,22,.38),#111827 65%);display:flex;align-items:center;justify-content:center;color:#fff;font:950 12px/1 system-ui}.app-profile-avatar img{width:100%;height:100%;object-fit:cover;object-position:center 12%;display:block}.app-profile-avatar.large{width:74px;height:74px;min-width:74px;border-radius:20px;font-size:20px}.app-profile-avatar.friend{width:36px;height:36px;min-width:36px;border-radius:12px;font-size:10px}.app-profile-open{overflow:hidden}.app-profile-overlay{position:fixed;inset:0;z-index:6000;padding:18px;display:grid;place-items:center;background:rgba(3,7,18,.86);backdrop-filter:blur(12px)}.app-profile-panel{width:min(760px,100%);max-height:min(860px,94vh);overflow:auto;border:1px solid rgba(249,115,22,.7);border-radius:26px;background:linear-gradient(180deg,#202c40,#0f1624);box-shadow:0 32px 110px rgba(0,0,0,.62);color:#f8fafc}.app-profile-head{display:flex;justify-content:space-between;gap:18px;padding:20px;border-bottom:1px solid #34445d}.app-profile-head-copy{display:flex;align-items:center;gap:14px;min-width:0}.app-profile-head-copy span,.app-profile-head-copy strong,.app-profile-head-copy small{display:block}.app-profile-head-copy span{color:#fb923c;font:950 9px/1 system-ui;letter-spacing:.14em}.app-profile-head-copy strong{margin-top:6px;font:950 24px/1 system-ui}.app-profile-head-copy small{margin-top:7px;color:#94a3b8;font:700 11px/1.3 system-ui}.app-profile-close{width:38px;height:38px;border:1px solid #475569;border-radius:12px;background:#111827;color:#fff;font-size:24px;cursor:pointer}.app-profile-body{padding:20px}.app-profile-friends{display:flex;gap:8px;overflow-x:auto;padding:2px 0 16px}.app-profile-friend{min-width:108px;border:1px solid #34445d;border-radius:15px;background:#111827;padding:9px;display:grid;grid-template-columns:36px minmax(0,1fr);align-items:center;gap:8px}.app-profile-friend strong,.app-profile-friend small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.app-profile-friend strong{font:900 11px/1 system-ui}.app-profile-friend small{margin-top:4px;color:#94a3b8;font:750 8px/1 system-ui;letter-spacing:.06em}.app-profile-section-title{display:flex;align-items:end;justify-content:space-between;gap:12px;margin:2px 0 10px}.app-profile-section-title h3{margin:0;font:950 17px/1 system-ui}.app-profile-section-title span{color:#94a3b8;font:700 10px/1.3 system-ui}.app-profile-search{width:100%;min-width:0!important;margin-bottom:12px;border-color:#475569!important;background:#0b1220!important}.app-profile-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;max-height:390px;overflow:auto;padding-right:3px}.app-profile-fighter{min-width:0;border:1px solid #34445d;border-radius:15px;background:#111827;color:#fff;padding:8px;cursor:pointer;text-align:left}.app-profile-fighter:hover,.app-profile-fighter.selected{border-color:#f97316;background:rgba(249,115,22,.12)}.app-profile-fighter-photo{aspect-ratio:1;border-radius:11px;overflow:hidden;background:#0b1220;display:flex;align-items:center;justify-content:center;font:950 16px/1 system-ui}.app-profile-fighter-photo img{width:100%;height:100%;object-fit:cover;object-position:center 12%}.app-profile-fighter strong{display:block;margin-top:7px;font:900 10px/1.15 system-ui;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.app-profile-footer{position:sticky;bottom:0;display:grid;grid-template-columns:auto 1fr auto;gap:9px;padding:14px 20px;border-top:1px solid #34445d;background:rgba(15,22,36,.97);backdrop-filter:blur(10px)}.app-profile-footer button{min-height:44px;border:1px solid #475569;border-radius:13px;background:#172033;color:#fff;padding:0 15px;font:950 10px/1 system-ui;cursor:pointer}.app-profile-footer .save{border-color:#f97316;background:#f97316;color:#111827}.app-profile-status{align-self:center;color:#fdba74;font:750 10px/1.35 system-ui}.app-profile-empty{grid-column:1/-1;padding:24px;border:1px dashed #475569;border-radius:15px;color:#94a3b8;text-align:center;font:750 12px/1.4 system-ui}@media(max-width:900px){.app-profile-tools{width:100%;grid-template-columns:1fr}.app-profile-chip{min-height:52px}.app-profile-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:520px){.app-profile-overlay{padding:0;align-items:end}.app-profile-panel{max-height:94vh;border-radius:24px 24px 0 0}.app-profile-head,.app-profile-body{padding:16px}.app-profile-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.app-profile-footer{grid-template-columns:1fr 1fr;padding:12px 16px}.app-profile-status{grid-column:1/-1;grid-row:1}.app-profile-footer button{padding:0 10px}}
    `;
    document.head.appendChild(style);
  }

  function ensureChip(){
    const hero=document.querySelector('.hero');
    const card=hero?.querySelector('.hero-card');
    if(!hero||!card)return null;
    let tools=hero.querySelector('.app-profile-tools');
    if(!tools){
      tools=document.createElement('div');
      tools.className='app-profile-tools';
      card.before(tools);
      tools.appendChild(card);
    }
    let chip=tools.querySelector('.app-profile-chip');
    if(!chip){
      chip=document.createElement('button');
      chip.type='button';
      chip.className='app-profile-chip';
      chip.addEventListener('click',open);
      tools.appendChild(chip);
    }
    return chip;
  }

  function renderChip(){
    const chip=ensureChip();
    if(!chip)return;
    const member=state.group?.me||state.identity?.member;
    if(!member){
      chip.innerHTML=`${avatarMarkup({display_name:'UFC'})}<span class="app-profile-chip-copy"><small>UFC APP PROFILE</small><strong>Sign in</strong></span><span class="app-profile-chip-badge">GOAT26</span>`;
    }else{
      chip.innerHTML=`${avatarMarkup(member)}<span class="app-profile-chip-copy"><small>UFC APP PROFILE</small><strong>${esc(member.display_name)}</strong></span><span class="app-profile-chip-badge">${member.is_admin?'ADMIN':'GOAT26'}</span>`;
    }
    hydrateBrokenImages(chip);
  }

  function roster(query=''){
    const api=window.UFC_PLAY_DATA;
    if(!api)return[];
    const options={limit:48,filters:{requirePhoto:true}};
    const rows=query?api.search(query,options):api.search('',options);
    return rows.filter(fighter=>fighter?.id&&fighter?.name);
  }

  function friendStrip(){
    const members=state.group?.members||[];
    if(!members.length)return'';
    return `<div class="app-profile-friends">${members.map(member=>`<div class="app-profile-friend" data-member-name="${esc(member.display_name)}">${avatarMarkup(member,'friend')}<div><strong>${esc(member.display_name)}</strong><small>${member.is_admin?'ADMIN':member.fighter_avatar_slug?'FIGHTER SET':'CHOOSE FIGHTER'}</small></div></div>`).join('')}</div>`;
  }

  function renderFighterGrid(query=''){
    const grid=state.modal?.querySelector('[data-profile-fighter-grid]');
    if(!grid)return;
    const rows=roster(query);
    if(!rows.length){
      grid.innerHTML='<div class="app-profile-empty">No fighter matched that search.</div>';
      return;
    }
    grid.innerHTML=rows.map(fighter=>{
      const src=fighterPhoto(fighter);
      return `<button class="app-profile-fighter${fighter.id===state.selectedSlug?' selected':''}" type="button" data-avatar-slug="${esc(fighter.id)}" aria-pressed="${fighter.id===state.selectedSlug?'true':'false'}"><span class="app-profile-fighter-photo">${src?`<img src="${esc(src)}" alt="${esc(fighter.name)}" data-profile-avatar-image data-fighter-photo="true" data-fighter-name="${esc(fighter.name)}">`:esc(initials(fighter.name))}</span><strong>${esc(fighter.name)}</strong></button>`;
    }).join('');
    grid.querySelectorAll('[data-avatar-slug]').forEach(button=>button.addEventListener('click',()=>{
      state.selectedSlug=button.dataset.avatarSlug||'';
      renderFighterGrid(state.modal?.querySelector('[data-profile-search]')?.value||'');
      const status=state.modal?.querySelector('[data-profile-status]');
      const fighter=fighterForSlug(state.selectedSlug);
      if(status)status.textContent=fighter?`${fighter.name} selected. Save to use it everywhere.`:'Avatar selected.';
    }));
    hydrateBrokenImages(grid);
  }

  async function saveAvatar(slug=state.selectedSlug){
    const identity=state.identity||await resolve();
    const client=window.UFC_PLAY_PROFILE?.client;
    const token=tokenFor(identity);
    if(!client||!token)throw new Error('Sign in to your UFC App profile first.');
    const {data,error}=await client.rpc('app_profile_set_avatar',{
      p_member_token:token,
      p_fighter_avatar_slug:text(slug)
    });
    if(error)throw error;
    if(!data?.ok)throw new Error(data?.error||'Could not save that fighter avatar.');
    const saved=data.member||{};
    if(state.identity?.member)Object.assign(state.identity.member,saved);
    if(window.UFC_PLAY_PROFILE?.identity?.member)Object.assign(window.UFC_PLAY_PROFILE.identity.member,saved);
    if(state.group?.me)Object.assign(state.group.me,saved);
    const member=state.group?.members?.find(row=>row.id===saved.id);
    if(member)Object.assign(member,saved);
    state.selectedSlug=text(saved.fighter_avatar_slug);
    renderChip();
    window.dispatchEvent(new CustomEvent('ufc-app-profile-updated',{detail:{identity:state.identity,group:state.group,member:saved}}));
    return saved;
  }

  function close(){
    state.modal?.remove();
    state.modal=null;
    document.body.classList.remove('app-profile-open');
  }

  async function open(){
    installStyles();
    let identity=await resolve().catch(()=>null);
    if(!identity){
      identity=await window.UFC_PLAY_PROFILE?.require?.({
        title:'Open your UFC App profile',
        description:'Use your GOAT26 display name and four-digit PIN. This same profile follows you through Picks, Play, and The Octagon.'
      });
      if(!identity)return;
      state.identity=identity;
      try{await groupSnapshot(identity);}catch(_error){state.group=null;}
      renderChip();
    }

    close();
    const member=state.group?.me||state.identity?.member||{};
    state.selectedSlug=text(member.fighter_avatar_slug);
    const overlay=document.createElement('div');
    overlay.className='app-profile-overlay';
    overlay.innerHTML=`<section class="app-profile-panel" role="dialog" aria-modal="true" aria-labelledby="appProfileTitle">
      <header class="app-profile-head"><div class="app-profile-head-copy" data-member-name="${esc(member.display_name)}">${avatarMarkup(member,'large')}<div><span>UFC APP PROFILE · ${CANONICAL_CODE}</span><strong id="appProfileTitle">${esc(member.display_name)}</strong><small>One identity across Picks, Play, leaderboards, and The Octagon.</small></div></div><button class="app-profile-close" type="button" aria-label="Close profile" data-profile-close>×</button></header>
      <div class="app-profile-body">${friendStrip()}<div class="app-profile-section-title"><h3>Choose your fighter</h3><span>Your fighter becomes your avatar everywhere.</span></div><input class="app-profile-search" type="search" placeholder="Search the UFC roster…" autocomplete="off" data-profile-search><div class="app-profile-grid" data-profile-fighter-grid></div></div>
      <footer class="app-profile-footer"><button type="button" data-profile-clear>CLEAR</button><div class="app-profile-status" data-profile-status>${state.selectedSlug?`${esc(fighterForSlug(state.selectedSlug)?.name||state.selectedSlug)} is your current fighter.`:'Choose any fighter from the roster.'}</div><button class="save" type="button" data-profile-save>SAVE PROFILE</button></footer>
    </section>`;
    document.body.appendChild(overlay);
    document.body.classList.add('app-profile-open');
    state.modal=overlay;
    overlay.querySelector('[data-profile-close]')?.addEventListener('click',close);
    overlay.addEventListener('click',event=>{if(event.target===overlay)close();});
    overlay.querySelector('[data-profile-search]')?.addEventListener('input',event=>renderFighterGrid(event.target.value));
    overlay.querySelector('[data-profile-clear]')?.addEventListener('click',()=>{
      state.selectedSlug='';
      renderFighterGrid(overlay.querySelector('[data-profile-search]')?.value||'');
      overlay.querySelector('[data-profile-status]').textContent='Avatar cleared. Save to use your initials.';
    });
    overlay.querySelector('[data-profile-save]')?.addEventListener('click',async event=>{
      const button=event.currentTarget;
      const status=overlay.querySelector('[data-profile-status]');
      button.disabled=true;
      button.textContent='SAVING…';
      status.textContent='Saving your UFC App profile…';
      try{
        await saveAvatar();
        status.textContent='Saved. Your fighter avatar is now live everywhere.';
        button.textContent='SAVED';
        setTimeout(close,650);
      }catch(error){
        status.textContent=text(error?.message)||'Could not save your profile.';
        button.disabled=false;
        button.textContent='SAVE PROFILE';
      }
    });
    hydrateBrokenImages(overlay);
    renderFighterGrid();
    overlay.querySelector('[data-profile-search]')?.focus();
  }

  function createAvatar(member,options={}){
    const wrapper=document.createElement(options.tagName||'span');
    wrapper.innerHTML=avatarMarkup(member,options.className||'');
    const node=wrapper.firstElementChild;
    hydrateBrokenImages(node);
    return node;
  }

  function start(){
    installStyles();
    renderChip();
    resolve().catch(()=>renderChip());
  }

  window.UFC_APP_PROFILE={
    version:VERSION,
    canonicalGroupCode:CANONICAL_CODE,
    resolve,
    open,
    close,
    saveAvatar,
    groupSnapshot,
    fighterForSlug,
    fighterForMember:memberFighter,
    avatarUrl:member=>fighterPhoto(memberFighter(member)),
    createAvatar,
    get identity(){return state.identity;},
    get group(){return state.group;}
  };
  document.documentElement.setAttribute('data-app-profile',VERSION);
  window.addEventListener('ufc-play-profile-ready',event=>{
    state.identity=event.detail||null;
    groupSnapshot(state.identity).catch(()=>null).finally(renderChip);
  });
  window.addEventListener('ufc-play-data-ready',()=>state.modal&&renderFighterGrid(state.modal.querySelector('[data-profile-search]')?.value||''));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

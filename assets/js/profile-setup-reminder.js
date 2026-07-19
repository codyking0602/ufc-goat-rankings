(function(){
  'use strict';

  const VERSION='profile-setup-reminder-20260719a';
  const TOP10_KEY='ufc-goat-play-top10-v1';
  const state={member:null,shown:false,overlay:null,timer:null,bound:false};

  const text=value=>String(value??'').trim();
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));
  const parse=(value,fallback=null)=>{try{return JSON.parse(value);}catch(_error){return fallback;}};

  function localTop10(){
    try{
      const rows=parse(localStorage.getItem(TOP10_KEY),[]);
      return Array.isArray(rows)?rows.map(text).filter(Boolean).slice(0,10):[];
    }catch(_error){return[];}
  }

  function currentId(){
    return state.member?.id
      ||window.UFC_APP_PROFILE?.group?.me?.id
      ||window.UFC_APP_PROFILE?.identity?.member?.id
      ||window.UFC_PLAY_PROFILE?.identity?.member?.id
      ||'';
  }

  function memberFromSnapshot(snapshot){
    if(!snapshot)return null;
    const id=snapshot.me_id||snapshot.me?.id||currentId();
    return snapshot.me||snapshot.members?.find?.(member=>member?.id===id)||null;
  }

  function mergeMember(member){
    if(!member)return null;
    state.member={...(state.member||{}),...member};
    return state.member;
  }

  function completion(){
    const member=state.member||{};
    const hasPublishedTop10=Array.isArray(member.top_ten);
    const serverTop10=hasPublishedTop10?member.top_ten.map(text).filter(Boolean).slice(0,10):[];
    const rows=hasPublishedTop10?serverTop10:localTop10();
    const top10=rows.length===10&&new Set(rows.map(name=>name.toLowerCase())).size===10;
    const photo=Boolean(text(member.profile_photo_data||member.profilePhotoData));
    const percent=(top10?50:0)+(photo?50:0);
    return{top10,photo,percent,complete:top10&&photo};
  }

  function injectStyles(){
    if(document.getElementById('profileSetupReminderCss'))return;
    const style=document.createElement('style');
    style.id='profileSetupReminderCss';
    style.textContent=`
      body.profile-setup-reminder-open{overflow:hidden}.profile-setup-chip-progress{display:block;margin-top:4px;color:#fdba74;font:900 8px/1 system-ui;letter-spacing:.07em;white-space:nowrap}.profile-setup-chip-progress.complete{color:#86efac}
      .profile-setup-reminder-overlay{position:fixed;inset:0;z-index:6800;display:grid;place-items:center;padding:18px;background:rgba(2,6,23,.82);backdrop-filter:blur(11px)}.profile-setup-reminder-panel{position:relative;width:min(480px,100%);border:1px solid rgba(249,115,22,.72);border-radius:24px;background:linear-gradient(180deg,#202c40,#0f1624);box-shadow:0 30px 100px rgba(0,0,0,.6);padding:22px;color:#f8fafc}.profile-setup-reminder-close{position:absolute;top:14px;right:14px;width:36px;height:36px;border:1px solid #475569;border-radius:11px;background:#111827;color:#fff;font-size:22px;line-height:1;cursor:pointer}.profile-setup-reminder-kicker{color:#fb923c;font:950 9px/1 system-ui;letter-spacing:.15em}.profile-setup-reminder-panel h2{margin:8px 44px 0 0;font:950 27px/1.04 system-ui}.profile-setup-reminder-panel>p{margin:9px 0 17px;color:#cbd5e1;font:650 12px/1.45 system-ui}.profile-setup-reminder-list{display:grid;gap:9px}.profile-setup-reminder-item{display:grid;grid-template-columns:38px minmax(0,1fr) auto;align-items:center;gap:11px;padding:12px;border:1px solid #34445d;border-radius:16px;background:#111827}.profile-setup-reminder-item.done{opacity:.62}.profile-setup-reminder-icon{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:rgba(249,115,22,.14);color:#fb923c;font:950 14px/1 system-ui}.profile-setup-reminder-item.done .profile-setup-reminder-icon{background:rgba(34,197,94,.13);color:#86efac}.profile-setup-reminder-item strong,.profile-setup-reminder-item small{display:block}.profile-setup-reminder-item strong{font:950 13px/1.1 system-ui}.profile-setup-reminder-item small{margin-top:5px;color:#94a3b8;font:700 10px/1.25 system-ui}.profile-setup-reminder-status{color:#fdba74;font:950 9px/1 system-ui;letter-spacing:.06em}.profile-setup-reminder-item.done .profile-setup-reminder-status{color:#86efac}.profile-setup-reminder-actions{display:grid;grid-template-columns:1.2fr 1fr;gap:9px;margin-top:15px}.profile-setup-reminder-actions button{min-height:46px;border:1px solid #475569;border-radius:13px;background:#172033;color:#fff;padding:0 13px;font:950 10px/1 system-ui;cursor:pointer}.profile-setup-reminder-actions .primary{border-color:#f97316;background:#f97316;color:#111827}.profile-setup-reminder-actions .later{grid-column:1/-1;min-height:38px;border:0;background:transparent;color:#94a3b8}.profile-setup-reminder-actions.single{grid-template-columns:1fr}.profile-setup-reminder-actions.single .later{grid-column:auto}
      @media(max-width:520px){.profile-setup-reminder-overlay{padding:0;align-items:end}.profile-setup-reminder-panel{border-radius:24px 24px 0 0;padding:20px 16px max(18px,env(safe-area-inset-bottom))}.profile-setup-reminder-panel h2{font-size:24px}.profile-setup-reminder-actions{grid-template-columns:1fr}.profile-setup-reminder-actions .later{grid-column:auto}}
    `;
    document.head.appendChild(style);
  }

  function renderChip(){
    const chip=document.querySelector('.app-profile-chip');
    const member=state.member;
    if(!chip||!member)return false;
    const copy=chip.querySelector('.app-profile-chip-copy');
    if(!copy)return false;
    let cue=copy.querySelector('[data-profile-setup-progress]');
    if(!cue){
      cue=document.createElement('span');
      cue.className='profile-setup-chip-progress';
      cue.dataset.profileSetupProgress='true';
      copy.appendChild(cue);
    }
    const value=completion();
    cue.textContent=value.complete?'PROFILE COMPLETE':`PROFILE ${value.percent}% COMPLETE`;
    cue.classList.toggle('complete',value.complete);
    chip.dataset.profileCompletion=String(value.percent);
    return true;
  }

  function homeIsActive(){
    return document.getElementById('home')?.classList.contains('active-view')
      ||document.querySelector('[data-destination="home"].active')?.getAttribute('aria-selected')==='true';
  }

  function appIsBusy(){
    return Boolean(state.overlay)
      ||['app-profile-open','community-profile-open','community-top10-open','play-profile-open'].some(name=>document.body.classList.contains(name))
      ||Boolean(document.querySelector('.app-profile-overlay,.community-profile-overlay,.community-top10-overlay,.play-profile-modal'));
  }

  function copyFor(value){
    if(!value.top10&&!value.photo)return{
      title:'Make it yours',
      description:'Build your personal UFC Top 10 and add a photo so leaderboards, game results, and shared matchups feel like your profile.'
    };
    if(!value.top10)return{
      title:'Your GOAT list is waiting',
      description:'Build your Top 10 so everyone can see exactly where you stand.'
    };
    return{
      title:'Put a face to the takes',
      description:'Add a profile photo for leaderboards, game results, and shared rankings.'
    };
  }

  function close(){
    state.overlay?.remove();
    state.overlay=null;
    document.body.classList.remove('profile-setup-reminder-open');
  }

  function open(){
    const value=completion();
    if(state.shown||value.complete||!state.member||!homeIsActive()||appIsBusy())return false;
    state.shown=true;
    const copy=copyFor(value);
    const actions=[];
    if(!value.top10)actions.push('<button type="button" class="primary" data-profile-setup-action="top10">BUILD MY TOP 10</button>');
    if(!value.photo)actions.push(`<button type="button" class="${value.top10?'primary':''}" data-profile-setup-action="photo">ADD PHOTO</button>`);
    actions.push('<button type="button" class="later" data-profile-setup-close>MAYBE LATER</button>');
    const overlay=document.createElement('div');
    overlay.className='profile-setup-reminder-overlay';
    overlay.innerHTML=`<section class="profile-setup-reminder-panel" role="dialog" aria-modal="true" aria-labelledby="profileSetupReminderTitle"><button type="button" class="profile-setup-reminder-close" aria-label="Close profile reminder" data-profile-setup-close>×</button><div class="profile-setup-reminder-kicker">FINISH YOUR PROFILE · ${value.percent}% COMPLETE</div><h2 id="profileSetupReminderTitle">${esc(copy.title)}</h2><p>${esc(copy.description)}</p><div class="profile-setup-reminder-list"><div class="profile-setup-reminder-item${value.top10?' done':''}"><span class="profile-setup-reminder-icon">${value.top10?'✓':'10'}</span><div><strong>Build your Top 10</strong><small>${value.top10?'Published to your profile.':'Choose and order your ten UFC GOATs.'}</small></div><span class="profile-setup-reminder-status">${value.top10?'DONE':'NOT SET'}</span></div><div class="profile-setup-reminder-item${value.photo?' done':''}"><span class="profile-setup-reminder-icon">${value.photo?'✓':'●'}</span><div><strong>Add a profile photo</strong><small>${value.photo?'Showing across Octagon HQ.':'Used on leaderboards, games, and shared results.'}</small></div><span class="profile-setup-reminder-status">${value.photo?'DONE':'NOT SET'}</span></div></div><div class="profile-setup-reminder-actions${actions.length===2?' single':''}">${actions.join('')}</div></section>`;
    document.body.appendChild(overlay);
    document.body.classList.add('profile-setup-reminder-open');
    state.overlay=overlay;
    overlay.addEventListener('click',event=>{
      if(event.target===overlay||event.target.closest('[data-profile-setup-close]')){close();return;}
      const action=event.target.closest('[data-profile-setup-action]')?.dataset.profileSetupAction;
      if(!action)return;
      close();
      if(action==='top10')void window.UFC_COMMUNITY_PROFILES?.openTop10?.();
      if(action==='photo')void window.UFC_APP_PROFILE?.open?.();
    });
    return true;
  }

  function schedule(){
    renderChip();
    const value=completion();
    if(state.shown||value.complete||!state.member||!homeIsActive()||appIsBusy())return;
    clearTimeout(state.timer);
    state.timer=window.setTimeout(()=>{
      state.timer=null;
      open();
    },900);
  }

  function receiveCommunity(snapshot){
    const member=memberFromSnapshot(snapshot);
    if(member)mergeMember(member);
    schedule();
  }

  function receiveProfile(detail){
    mergeMember(detail?.member||detail?.group?.me||detail?.identity?.member||detail);
    renderChip();
    if(document.getElementById('home')?.classList.contains('active-view'))schedule();
  }

  function receiveTop10(detail){
    const published=detail?.member?.top_ten||detail?.top_ten||localTop10();
    mergeMember({...detail?.member,top_ten:Array.isArray(published)?published:localTop10()});
    renderChip();
  }

  function bind(){
    if(state.bound)return;
    state.bound=true;
    window.addEventListener('octagon-hq:community-updated',event=>receiveCommunity(event.detail));
    window.addEventListener('ufc-app-profile-updated',event=>receiveProfile(event.detail));
    window.addEventListener('ufc-play-profile-ready',event=>{
      receiveProfile(event.detail);
      void window.UFC_COMMUNITY_PROFILES?.refresh?.();
    });
    window.addEventListener('octagon-hq:top-ten-published',event=>receiveTop10(event.detail));
    window.addEventListener('octagon-hq:view-change',event=>{
      if(event.detail?.destination==='home')schedule();
    });
    document.addEventListener('click',()=>{
      if(!state.shown&&homeIsActive())requestAnimationFrame(schedule);
    });
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&state.overlay)close();
    });
  }

  function start(){
    injectStyles();
    bind();
    mergeMember(window.UFC_APP_PROFILE?.group?.me||window.UFC_APP_PROFILE?.identity?.member||window.UFC_PLAY_PROFILE?.identity?.member||null);
    renderChip();
    window.setTimeout(()=>{
      void window.UFC_COMMUNITY_PROFILES?.refresh?.();
      schedule();
    },180);
    document.documentElement.dataset.profileSetupReminder=VERSION;
  }

  window.UFC_PROFILE_SETUP_REMINDER={version:VERSION,open,close,completion,refresh:schedule};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

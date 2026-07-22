(function(){
  'use strict';

  const VERSION='profile-challenges-20260722b-play-challenge-center';
  const ROOT='https://codyking0602.github.io/ufc-goat-rankings/';
  const GAME_TITLES={
    'find-leader':'Find the Leader',
    wavelength:'Wavelength',
    blind:'Blind Resume',
    'blind-resume':'Blind Resume',
    'blind-rank':'Blind Rank 5',
    'keep-cut':'Keep 4, Cut 4',
    'better-than':'Better Than'
  };
  const state={
    identity:null,
    inbox:{rows:[],unread_count:0,received_count:0,sent_count:0},
    inboxPromise:null,
    active:null,
    modal:null,
    resultModal:null,
    payload:null,
    recipient:'',
    busy:false,
    seenBusy:false,
    routed:false,
    observer:null,
    decorateTimer:0,
    filter:'all'
  };

  const text=value=>String(value??'').trim();
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const tokenFor=identity=>text(identity?.memberToken||identity?.member_token);
  const client=()=>window.UFC_PLAY_PROFILE?.client||null;
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  const typeFor=value=>text(value?.game_type||value?.gameType||value?.type);
  const titleFor=value=>GAME_TITLES[text(value)]||'UFC Game';
  const directionFor=row=>text(row?.direction)==='sent'?'sent':'received';
  const timeAgo=value=>{
    const then=new Date(value).getTime();
    if(!Number.isFinite(then))return'';
    const minutes=Math.max(0,Math.round((Date.now()-then)/60000));
    if(minutes<1)return'Just now';
    if(minutes<60)return`${minutes}m ago`;
    const hours=Math.floor(minutes/60);
    if(hours<24)return`${hours}h ago`;
    const days=Math.floor(hours/24);
    return days<7?`${days}d ago`:new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric'}).format(new Date(value));
  };

  function styles(){
    if(document.getElementById('profileChallengeCss'))return;
    const node=document.createElement('style');
    node.id='profileChallengeCss';
    node.textContent=`
      body.profile-challenge-open{overflow:hidden}
      .profile-challenge-overlay{position:fixed;inset:0;z-index:15000;display:grid;place-items:center;padding:18px;background:rgba(2,6,23,.92);backdrop-filter:blur(12px)}
      .profile-challenge-panel{width:min(620px,100%);max-height:94vh;overflow:auto;border:1px solid rgba(249,115,22,.68);border-radius:24px;background:linear-gradient(180deg,#1c293d,#0d1421);color:#f8fafc;box-shadow:0 24px 80px rgba(0,0,0,.52)}
      .profile-challenge-head{display:flex;justify-content:space-between;gap:14px;padding:18px;border-bottom:1px solid #33445f}
      .profile-challenge-head span,.profile-challenge-head strong,.profile-challenge-head small{display:block}
      .profile-challenge-head span{color:#fb923c;font:950 9px/1 system-ui;letter-spacing:.14em}
      .profile-challenge-head strong{margin-top:7px;font:950 26px/1 system-ui}
      .profile-challenge-head small{margin-top:7px;color:#94a3b8;font:700 11px/1.4 system-ui}
      .profile-challenge-close{width:40px;height:40px;border:1px solid #475569;border-radius:12px;background:#111827;color:#fff;font-size:22px;cursor:pointer}
      .profile-challenge-body{padding:16px}
      .profile-challenge-summary{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px;padding:13px;border:1px solid rgba(249,115,22,.34);border-radius:16px;background:rgba(249,115,22,.07)}
      .profile-challenge-summary strong,.profile-challenge-summary small{display:block}
      .profile-challenge-summary small{margin-top:5px;color:#94a3b8;font:700 10px/1.35 system-ui}
      .profile-challenge-summary b{font:950 28px/1 system-ui}
      .profile-challenge-members{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .profile-challenge-member{display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:center;gap:9px;padding:9px;border:1px solid #33445f;border-radius:14px;background:#111827;color:#fff;text-align:left;cursor:pointer}
      .profile-challenge-member.selected{border-color:#f97316;background:rgba(249,115,22,.12)}
      .profile-challenge-member .app-profile-avatar{width:42px;height:42px;min-width:42px}
      .profile-challenge-member strong,.profile-challenge-member small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .profile-challenge-member small{margin-top:4px;color:#94a3b8;font:750 8px/1 system-ui}
      .profile-challenge-member i{width:18px;height:18px;border:1px solid #475569;border-radius:50%}
      .profile-challenge-member.selected i{border:6px solid #f97316}
      .profile-challenge-status{min-height:22px;padding:10px 16px 0;color:#fdba74;font:800 10px/1.4 system-ui}
      .profile-challenge-actions{display:grid;grid-template-columns:1fr 1.3fr;gap:8px;padding:12px 16px 16px}
      .profile-challenge-actions button{min-height:46px;border:1px solid #475569;border-radius:13px;background:#172033;color:#fff;font:950 11px/1 system-ui;cursor:pointer}
      .profile-challenge-actions .primary{border-color:#f97316;background:#f97316;color:#111827}
      .profile-challenge-actions button:disabled{opacity:.45}
      .profile-challenge-empty{padding:20px;border:1px dashed #475569;border-radius:14px;color:#94a3b8;text-align:center}
      .play-profile-challenge-banner{margin-bottom:12px;padding:12px;border:1px solid rgba(249,115,22,.5);border-radius:15px;background:rgba(249,115,22,.09);text-align:center}
      .play-profile-challenge-banner span,.play-profile-challenge-banner strong,.play-profile-challenge-banner small{display:block}
      .play-profile-challenge-banner span{color:#fb923c;font:950 8px/1 system-ui;letter-spacing:.13em}
      .play-profile-challenge-banner strong{margin-top:5px}
      .play-profile-challenge-banner small{margin-top:5px;color:#94a3b8;font-size:9px}

      .play-challenge-center{margin:16px 0;padding:16px;border:1px solid rgba(249,115,22,.48);border-radius:22px;background:linear-gradient(145deg,rgba(249,115,22,.08),rgba(15,23,42,.04)),#101827;color:#f8fafc}
      .play-challenge-center[hidden]{display:none!important}
      .play-challenge-center-head{display:flex;align-items:start;justify-content:space-between;gap:12px}
      .play-challenge-center-head span,.play-challenge-center-head strong,.play-challenge-center-head small{display:block}
      .play-challenge-center-head span{color:#fb923c;font:950 9px/1 system-ui;letter-spacing:.13em}
      .play-challenge-center-head strong{margin-top:6px;font:950 21px/1 system-ui}
      .play-challenge-center-head small{color:#94a3b8;font:800 10px/1.3 system-ui;text-align:right}
      .play-challenge-filters{display:flex;gap:7px;overflow:auto;margin:14px 0 10px;padding-bottom:2px}
      .play-challenge-filter{min-height:34px;border:1px solid #33445f;border-radius:999px;background:#0b1220;color:#cbd5e1;padding:0 12px;font:900 9px/1 system-ui;white-space:nowrap;cursor:pointer}
      .play-challenge-filter.active{border-color:#f97316;background:#f97316;color:#111827}
      .play-challenge-list{display:grid;gap:9px;max-height:430px;overflow:auto;padding-right:2px}
      .play-challenge-row{display:grid;grid-template-columns:46px minmax(0,1fr) auto;align-items:center;gap:11px;padding:11px;border:1px solid #2f3e56;border-radius:16px;background:#0b1220}
      .play-challenge-row.unread{border-color:rgba(249,115,22,.72);background:rgba(249,115,22,.08)}
      .play-challenge-row.completed{border-color:rgba(34,197,94,.44);background:rgba(20,83,45,.12)}
      .play-challenge-row .app-profile-avatar{width:46px;height:46px;min-width:46px}
      .play-challenge-copy{min-width:0}
      .play-challenge-copy span,.play-challenge-copy strong,.play-challenge-copy small{display:block}
      .play-challenge-copy span{color:#fb923c;font:950 8px/1 system-ui;letter-spacing:.1em}
      .play-challenge-copy strong{margin-top:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:900 12px/1.2 system-ui}
      .play-challenge-copy small{margin-top:5px;color:#94a3b8;font:750 9px/1.3 system-ui}
      .play-challenge-row button{min-height:38px;border:1px solid #f97316;border-radius:12px;background:#f97316;color:#111827;padding:0 12px;cursor:pointer;font:950 9px/1 system-ui}
      .play-challenge-row button.results{border-color:#22c55e;background:rgba(34,197,94,.16);color:#bbf7d0}
      .play-challenge-row button:disabled{border-color:#475569;background:#172033;color:#94a3b8;cursor:default}
      .play-challenge-empty-state{padding:18px;border:1px dashed #475569;border-radius:15px;color:#94a3b8;text-align:center;font:750 11px/1.45 system-ui}

      .challenge-results-panel{width:min(680px,100%)}
      .challenge-results-body{display:grid;gap:14px;padding:16px}
      .challenge-results-verdict{padding:14px;border:1px solid rgba(249,115,22,.4);border-radius:17px;background:rgba(249,115,22,.07)}
      .challenge-results-verdict span,.challenge-results-verdict strong,.challenge-results-verdict small{display:block}
      .challenge-results-verdict span{color:#fb923c;font:950 8px/1 system-ui;letter-spacing:.12em}
      .challenge-results-verdict strong{margin-top:7px;font:950 23px/1 system-ui}
      .challenge-results-verdict small{margin-top:7px;color:#cbd5e1;font:750 10px/1.4 system-ui}
      .challenge-results-scoreboard{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:stretch}
      .challenge-results-player{min-width:0;padding:14px;border:1px solid #33445f;border-radius:16px;background:#0b1220}
      .challenge-results-player span,.challenge-results-player strong,.challenge-results-player b,.challenge-results-player small{display:block}
      .challenge-results-player span{color:#94a3b8;font:850 8px/1 system-ui;letter-spacing:.1em}
      .challenge-results-player strong{margin-top:7px;font:950 15px/1.1 system-ui}
      .challenge-results-player b{margin-top:11px;color:#fdba74;font:950 26px/1 system-ui}
      .challenge-results-player small{margin-top:8px;color:#94a3b8;font:750 9px/1.4 system-ui;word-break:break-word}
      .challenge-results-vs{align-self:center;color:#64748b;font:950 10px/1 system-ui}
      .challenge-results-close{min-height:46px;border:1px solid #f97316;border-radius:13px;background:#f97316;color:#111827;font:950 11px/1 system-ui;cursor:pointer}

      @media(max-width:600px){
        .profile-challenge-overlay{padding:0;align-items:end}
        .profile-challenge-panel{border-radius:24px 24px 0 0}
        .profile-challenge-members,.profile-challenge-actions{grid-template-columns:1fr}
        .play-challenge-center{padding:14px}
        .play-challenge-row{grid-template-columns:42px minmax(0,1fr)}
        .play-challenge-row .app-profile-avatar{width:42px;height:42px;min-width:42px}
        .play-challenge-row>button{grid-column:1/-1;width:100%}
        .challenge-results-scoreboard{grid-template-columns:1fr}
        .challenge-results-vs{text-align:center}
      }
    `;
    document.head.appendChild(node);
  }

  async function passiveIdentity(){
    const value=state.identity||window.UFC_PLAY_PROFILE?.identity||window.UFC_APP_PROFILE?.identity;
    state.identity=value||null;
    return state.identity;
  }

  async function identity(options={}){
    let value=await passiveIdentity();
    if(!value)value=await window.UFC_PLAY_PROFILE?.require?.({
      title:options.title||'Open your UFC App profile',
      description:options.description||'Use your GOAT26 display name and four-digit PIN.'
    });
    state.identity=value||null;
    return state.identity;
  }

  function validPayload(value){
    const setup=value?.setup,result=value?.result;
    if(!setup||!result||!Array.isArray(setup.candidates)||setup.candidates.length!==10)return null;
    return{
      gameType:'find-leader',
      gameVersion:'find-leader-profile-challenge-v1',
      setup:clone(setup),
      result:clone(result)
    };
  }

  function avatar(member){
    return window.UFC_APP_PROFILE?.avatarMarkup?.(member,'friend')
      ||`<span class="app-profile-avatar friend"><span>${esc(text(member?.display_name).slice(0,2).toUpperCase()||'UFC')}</span></span>`;
  }

  function status(message){
    const node=state.modal?.querySelector('[data-challenge-status]');
    if(node)node.textContent=message||'';
  }

  function close(){
    state.modal?.remove();
    state.modal=null;
    state.payload=null;
    state.recipient='';
    if(!state.resultModal)document.body.classList.remove('profile-challenge-open');
  }

  function closeResults(){
    state.resultModal?.remove();
    state.resultModal=null;
    if(!state.modal)document.body.classList.remove('profile-challenge-open');
  }

  function challengeUrl(code){
    const url=new URL('share.html',ROOT);
    url.searchParams.set('share','play-challenge');
    url.searchParams.set('challenge',text(code).toUpperCase());
    url.hash='play';
    return url.toString();
  }

  async function copy(value){
    try{
      await navigator.clipboard.writeText(value);
      return true;
    }catch(_error){
      return false;
    }
  }

  async function groupSnapshot(who){
    let group=window.UFC_APP_PROFILE?.group;
    if(!group?.members?.length)group=await window.UFC_APP_PROFILE?.groupSnapshot?.(who).catch(()=>null);
    return group||{members:[],me:who?.member};
  }

  async function createLink(){
    if(state.busy)return;
    state.busy=true;
    const who=state.identity,payload=state.payload,rpc=client(),button=state.modal?.querySelector('[data-challenge-copy]');
    if(button){button.disabled=true;button.textContent='CREATING…';}
    status('Creating a short challenge link…');
    try{
      const {data,error}=await rpc.rpc('play_create_challenge',{
        p_game_type:payload.gameType,
        p_game_version:payload.gameVersion,
        p_group_code:who.groupCode||'GOAT26',
        p_member_token:tokenFor(who),
        p_setup:payload.setup,
        p_result:payload.result,
        p_metadata:{delivery:'link'},
        p_expires_days:30
      });
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'Could not create the challenge.');
      const url=challengeUrl(data.code);
      const message=`I scored ${Number(payload.result.score)||0}/10. Play my exact Find the Leader board.`;
      if(navigator.share){
        try{
          await navigator.share({title:'Find the Leader Challenge',text:message,url});
          status('Challenge ready to send.');
          return;
        }catch(error){
          if(error?.name==='AbortError'){status('Share cancelled.');return;}
        }
      }
      status(await copy(`${message}\n\n${url}`)?'Challenge link copied.':'Could not copy the link.');
    }catch(error){
      status(text(error?.message)||'Could not create the challenge.');
    }finally{
      state.busy=false;
      if(button){button.disabled=false;button.textContent='COPY LINK';}
    }
  }

  async function send(){
    if(state.busy||!state.recipient)return;
    state.busy=true;
    const payload=state.payload,rpc=client(),button=state.modal?.querySelector('[data-challenge-send]');
    if(button){button.disabled=true;button.textContent='SENDING…';}
    status('Sending challenge to their Play inbox…');
    try{
      const {data,error}=await rpc.rpc('play_send_profile_challenge',{
        p_member_token:tokenFor(state.identity),
        p_recipient_member_id:state.recipient,
        p_game_type:payload.gameType,
        p_game_version:payload.gameVersion,
        p_setup:payload.setup,
        p_result:payload.result,
        p_metadata:{sender_score:Number(payload.result.score)||0,title:'Find the Leader'},
        p_expires_days:30
      });
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'Challenge could not be sent.');
      status(`Sent to ${data.recipient?.display_name||'their Play inbox'}.`);
      window.dispatchEvent(new CustomEvent('ufc-profile-challenge-sent',{detail:data}));
      await loadInbox();
      setTimeout(close,700);
    }catch(error){
      status(text(error?.message)||'Challenge could not be sent.');
      if(button){button.disabled=false;button.textContent='SEND CHALLENGE';}
    }finally{
      state.busy=false;
    }
  }

  async function openSendModal(raw){
    styles();
    const payload=validPayload(raw);
    if(!payload)return false;
    const who=await identity({title:'Challenge someone',description:'Choose an Octagon HQ profile or copy a link.'});
    if(!who)return false;
    const group=await groupSnapshot(who),me=group.me?.id||who.member?.id;
    const members=(group.members||[]).filter(member=>member.id!==me);
    close();
    state.payload=payload;
    const overlay=document.createElement('div');
    overlay.className='profile-challenge-overlay';
    overlay.innerHTML=`<section class="profile-challenge-panel" role="dialog" aria-modal="true" aria-labelledby="challengeTitle"><header class="profile-challenge-head"><div><span>GAME CHALLENGE</span><strong id="challengeTitle">Challenge Someone</strong><small>They get this exact board in Challenge Center on Play. Your score stays hidden until they finish.</small></div><button class="profile-challenge-close" type="button" data-challenge-close aria-label="Close">×</button></header><div class="profile-challenge-body"><div class="profile-challenge-summary"><div><strong>${esc(payload.setup.question||'Find the Leader')}</strong><small>Your completed board</small></div><b>${Number(payload.result.score)||0}/10</b></div>${members.length?`<div class="profile-challenge-members">${members.map(member=>`<button class="profile-challenge-member" type="button" data-challenge-member="${esc(member.id)}">${avatar(member)}<span><strong>${esc(member.display_name)}</strong><small>OCTAGON HQ PROFILE</small></span><i></i></button>`).join('')}</div>`:'<div class="profile-challenge-empty">No other active profiles yet. Use Copy Link instead.</div>'}</div><div class="profile-challenge-status" data-challenge-status>${members.length?'Choose a profile.':'Copy a link to send outside the app.'}</div><footer class="profile-challenge-actions"><button type="button" data-challenge-copy>COPY LINK</button><button type="button" class="primary" data-challenge-send disabled>SEND CHALLENGE</button></footer></section>`;
    document.body.appendChild(overlay);
    document.body.classList.add('profile-challenge-open');
    state.modal=overlay;
    overlay.querySelector('[data-challenge-close]')?.addEventListener('click',close);
    overlay.addEventListener('click',event=>{if(event.target===overlay)close();});
    overlay.querySelector('[data-challenge-copy]')?.addEventListener('click',createLink);
    overlay.querySelector('[data-challenge-send]')?.addEventListener('click',send);
    overlay.querySelectorAll('[data-challenge-member]').forEach(button=>button.addEventListener('click',()=>{
      state.recipient=button.dataset.challengeMember;
      overlay.querySelectorAll('[data-challenge-member]').forEach(row=>row.classList.toggle('selected',row===button));
      overlay.querySelector('[data-challenge-send]').disabled=false;
      status(`${button.querySelector('strong')?.textContent||'Profile'} selected.`);
    }));
    return true;
  }

  function centerRows(){
    const rows=state.inbox.rows||[];
    if(state.filter==='received')return rows.filter(row=>directionFor(row)==='received');
    if(state.filter==='sent')return rows.filter(row=>directionFor(row)==='sent');
    return rows;
  }

  function counterpart(row){
    return{
      display_name:row.counterpart_name||(directionFor(row)==='sent'?row.recipient_name:row.creator_name)||'UFC Profile',
      fighter_avatar_slug:row.counterpart_fighter_avatar_slug||(directionFor(row)==='sent'?row.recipient_fighter_avatar_slug:row.creator_fighter_avatar_slug),
      profile_photo_data:row.counterpart_profile_photo_data||(directionFor(row)==='sent'?row.recipient_profile_photo_data:row.creator_profile_photo_data)
    };
  }

  function rowPresentation(row){
    const direction=directionFor(row),completed=Boolean(row.completed),opened=Boolean(row.opened_at);
    const other=counterpart(row).display_name;
    if(direction==='sent'){
      if(completed)return{eyebrow:'COMPLETED WITH',title:`${other} · ${titleFor(typeFor(row))}`,detail:`Both finished ${timeAgo(row.completed_at)||timeAgo(row.created_at)}`,action:'RESULTS',kind:'results',disabled:false};
      if(opened)return{eyebrow:'OPENED BY',title:`${other} · ${titleFor(typeFor(row))}`,detail:'They opened it · waiting on their result',action:'WAITING',kind:'waiting',disabled:true};
      return{eyebrow:'SENT TO',title:`${other} · ${titleFor(typeFor(row))}`,detail:`Waiting for them to open · ${timeAgo(row.created_at)}`,action:'WAITING',kind:'waiting',disabled:true};
    }
    if(completed)return{eyebrow:'COMPLETED WITH',title:`${other} · ${titleFor(typeFor(row))}`,detail:`Both finished ${timeAgo(row.completed_at)||timeAgo(row.created_at)}`,action:'RESULTS',kind:'results',disabled:false};
    if(opened)return{eyebrow:'FROM',title:`${other} · ${titleFor(typeFor(row))}`,detail:'Opened · your result is still waiting',action:'PLAY',kind:'play',disabled:false};
    return{eyebrow:'NEW FROM',title:`${other} · ${titleFor(typeFor(row))}`,detail:`Sent ${timeAgo(row.created_at)}`,action:'PLAY',kind:'play',disabled:false};
  }

  function challengeRow(row){
    const presentation=rowPresentation(row),direction=directionFor(row),completed=Boolean(row.completed),unread=direction==='received'&&!row.opened_at&&!completed;
    const other=counterpart(row);
    const action=presentation.kind==='results'
      ?`<button type="button" class="results" data-view-profile-challenge="${esc(row.code)}">RESULTS</button>`
      :presentation.kind==='play'
        ?`<button type="button" data-open-profile-challenge="${esc(row.code)}">PLAY</button>`
        :`<button type="button" disabled>${esc(presentation.action)}</button>`;
    return`<article class="play-challenge-row${unread?' unread':''}${completed?' completed':''}" data-member-name="${esc(other.display_name)}">${avatar(other)}<div class="play-challenge-copy"><span>${esc(presentation.eyebrow)}</span><strong>${esc(presentation.title)}</strong><small>${esc(presentation.detail)}</small></div>${action}</article>`;
  }

  function centerSignature(){
    return JSON.stringify([
      state.filter,
      Number(state.inbox.unread_count)||0,
      ...(state.inbox.rows||[]).map(row=>[
        row.code,directionFor(row),typeFor(row),row.opened_at,row.completed,row.completed_at,row.score,row.created_at,row.counterpart_name
      ])
    ]);
  }

  function renderChallengeCenter(){
    const hub=document.getElementById('playHub');
    if(!hub)return false;
    let center=hub.querySelector('[data-play-challenge-center]');
    if(!center){
      center=document.createElement('section');
      center.className='play-challenge-center';
      center.dataset.playChallengeCenter='true';
      center.dataset.profileChallengeInbox='true';
      const daily=hub.querySelector('.play-daily-card');
      if(daily)daily.insertAdjacentElement('afterend',center);
      else hub.prepend(center);
    }
    const who=state.identity||window.UFC_PLAY_PROFILE?.identity||window.UFC_APP_PROFILE?.identity;
    center.hidden=!who;
    if(!who)return true;
    const signature=centerSignature();
    if(center.dataset.signature===signature)return true;
    center.dataset.signature=signature;
    const rows=centerRows();
    const received=(state.inbox.rows||[]).filter(row=>directionFor(row)==='received');
    const sent=(state.inbox.rows||[]).filter(row=>directionFor(row)==='sent');
    const waiting=received.filter(row=>!row.completed).length;
    const sentWaiting=sent.filter(row=>!row.completed).length;
    center.innerHTML=`<header class="play-challenge-center-head"><div><span>CHALLENGE CENTER</span><strong>Your matchups</strong></div><small>${waiting} waiting · ${sentWaiting} sent</small></header><div class="play-challenge-filters" role="tablist" aria-label="Challenge filters"><button type="button" class="play-challenge-filter${state.filter==='all'?' active':''}" data-challenge-filter="all">ALL ${state.inbox.rows.length}</button><button type="button" class="play-challenge-filter${state.filter==='received'?' active':''}" data-challenge-filter="received">RECEIVED ${received.length}</button><button type="button" class="play-challenge-filter${state.filter==='sent'?' active':''}" data-challenge-filter="sent">SENT ${sent.length}</button></div>${rows.length?`<div class="play-challenge-list">${rows.map(challengeRow).join('')}</div>`:'<div class="play-challenge-empty-state">No active challenges here yet. Finish any Play game and challenge another Octagon HQ profile.</div>'}`;
    return true;
  }

  function scheduleDecorate(){
    clearTimeout(state.decorateTimer);
    state.decorateTimer=setTimeout(renderChallengeCenter,50);
  }

  function publishInbox(){
    window.dispatchEvent(new CustomEvent('ufc-profile-challenges-updated',{detail:state.inbox}));
    scheduleDecorate();
  }

  async function loadInbox(){
    if(state.inboxPromise)return state.inboxPromise;
    state.inboxPromise=(async()=>{
      const who=await passiveIdentity(),rpc=client();
      if(!who||!rpc){
        state.inbox={rows:[],unread_count:0,received_count:0,sent_count:0};
        publishInbox();
        return state.inbox;
      }
      try{
        const {data,error}=await rpc.rpc('play_profile_challenge_inbox',{p_member_token:tokenFor(who)});
        if(error||!data?.ok)throw error||new Error(data?.error||'Challenge Center unavailable.');
        state.inbox={
          rows:Array.isArray(data.rows)?data.rows:[],
          unread_count:Number(data.unread_count)||0,
          received_count:Number(data.received_count)||0,
          sent_count:Number(data.sent_count)||0
        };
      }catch(_error){
        state.inbox={rows:[],unread_count:0,received_count:0,sent_count:0};
      }
      publishInbox();
      return state.inbox;
    })();
    try{return await state.inboxPromise;}
    finally{state.inboxPromise=null;}
  }

  function isPlayActive(){
    const current=window.UFC_APP_SHELL?.currentDestination||window.UFC_PRODUCT_ARCHITECTURE?.currentDestination;
    return current==='play'||document.getElementById('play')?.classList.contains('active-view');
  }

  async function markSeen(){
    if(state.seenBusy||Number(state.inbox.unread_count)<1)return false;
    const who=await passiveIdentity(),rpc=client();
    if(!who||!rpc)return false;
    state.seenBusy=true;
    try{
      const {data,error}=await rpc.rpc('play_mark_profile_challenges_seen',{p_member_token:tokenFor(who)});
      if(error||!data?.ok)throw error||new Error();
      const openedAt=data.opened_at||new Date().toISOString();
      state.inbox.rows=(state.inbox.rows||[]).map(row=>directionFor(row)==='received'&&!row.completed&&!row.opened_at?{...row,opened_at:openedAt}:row);
      state.inbox.unread_count=0;
      publishInbox();
      return true;
    }catch(_error){
      return false;
    }finally{
      state.seenBusy=false;
    }
  }

  function waitFor(check,timeout=12000){
    return new Promise((resolve,reject)=>{
      const start=Date.now();
      const tick=()=>{
        let value;
        try{value=check();}catch(_error){}
        if(value)return resolve(value);
        if(Date.now()-start>timeout)return reject(new Error('Challenge tools did not load.'));
        setTimeout(tick,80);
      };
      tick();
    });
  }

  async function openCenter(){
    window.UFC_APP_SHELL?.activateDestination?.('play')||window.UFC_PRODUCT_ARCHITECTURE?.activateDestination?.('play');
    const hub=await waitFor(()=>window.UFC_PLAY_HUB?.showHub&&window.UFC_PLAY_HUB);
    hub.showHub();
    await loadInbox();
    renderChallengeCenter();
    await markSeen();
    setTimeout(()=>document.querySelector('[data-play-challenge-center]')?.scrollIntoView?.({behavior:'smooth',block:'start'}),80);
    return true;
  }

  async function playInboxChallenge(rawCode){
    const code=text(rawCode).toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10);
    const row=state.inbox.rows.find(value=>text(value.code).toUpperCase()===code);
    if(!code||!row||directionFor(row)!=='received'||row.completed)return false;
    try{
      if(typeFor(row)&&typeFor(row)!=='find-leader'){
        const games=await waitFor(()=>window.UFC_GAME_CHALLENGES?.openChallenge&&window.UFC_GAME_CHALLENGES);
        const opened=await games.openChallenge(code,true);
        if(!opened)throw new Error('That challenge could not open.');
      }else{
        await openChallenge(code,{directOnly:true});
      }
      await loadInbox();
      return true;
    }catch(error){
      console.error(error);
      return false;
    }
  }

  function fighterName(id){
    const fighter=window.UFC_PLAY_DATA?.resolve?.(id);
    return fighter?.name||text(id)||'—';
  }

  function listNames(ids,limit=5){
    const names=(Array.isArray(ids)?ids:[]).map(fighterName).filter(Boolean);
    if(!names.length)return'No selections recorded';
    const shown=names.slice(0,limit).join(', ');
    return names.length>limit?`${shown} +${names.length-limit}`:shown;
  }

  function scoreValue(game,result){
    if(game==='find-leader')return{value:Number(result?.score),suffix:'/10'};
    if(game==='wavelength')return{value:Number(result?.score),suffix:'/100'};
    if(game==='blind'||game==='blind-resume')return{value:Number(result?.score),suffix:'/5'};
    return{value:NaN,suffix:''};
  }

  function playerSummary(game,result,setup){
    if(game==='find-leader'){
      return result?.perfect?'Perfect run':`Leader removed in Round ${Number(result?.score)||'—'}`;
    }
    if(game==='wavelength'){
      return`Final guess ${Number(result?.finalGuess)} · Target ${Number(result?.target??setup?.target)}`;
    }
    if(game==='blind'||game==='blind-resume'){
      return`${Number(result?.score)||0} stronger résumés picked`;
    }
    if(game==='blind-rank'){
      return`1–5: ${listNames(result?.placements,5)}`;
    }
    if(game==='keep-cut'){
      const decisions=Array.isArray(result?.decisions)?result.decisions:[];
      const kept=decisions.filter(row=>text(row?.choice).toLowerCase()==='keep').length;
      return`${kept} kept · ${Math.max(0,decisions.length-kept)} cut`;
    }
    if(game==='better-than'){
      return`${Number(result?.claimCount)||0} names: ${listNames(result?.selections,5)}`;
    }
    return'Completed';
  }

  function comparisonVerdict(detail){
    const game=typeFor(detail),creator=detail.creator_name||'Sender',responder=detail.responder_name||'Responder';
    const creatorScore=scoreValue(game,detail.creator_result),responderScore=scoreValue(game,detail.responder_result);
    if(Number.isFinite(creatorScore.value)&&Number.isFinite(responderScore.value)){
      if(creatorScore.value===responderScore.value)return{title:'Tie game',copy:`${creator} and ${responder} finished even.`};
      const winner=creatorScore.value>responderScore.value?creator:responder;
      return{title:`${winner} wins`,copy:`${creatorScore.value}${creatorScore.suffix} vs ${responderScore.value}${responderScore.suffix}`};
    }
    if(game==='keep-cut'){
      const left=new Map((detail.creator_result?.decisions||[]).map(row=>[text(row?.fighterId),text(row?.choice)]));
      const right=new Map((detail.responder_result?.decisions||[]).map(row=>[text(row?.fighterId),text(row?.choice)]));
      const shared=[...left.keys()].filter(id=>right.has(id));
      const agreements=shared.filter(id=>left.get(id)===right.get(id)).length;
      return{title:`Agreed on ${agreements} of ${shared.length||8}`,copy:'Open the two decision summaries below and argue the disagreements.'};
    }
    if(game==='blind-rank'){
      const left=detail.creator_result?.placements||[],right=detail.responder_result?.placements||[];
      const exact=left.filter((id,index)=>id&&id===right[index]).length;
      return{title:`${exact} exact slot${exact===1?'':'s'} matched`,copy:'The rest of the ranking is the debate.'};
    }
    if(game==='better-than'){
      const left=new Set(detail.creator_result?.selections||[]),right=new Set(detail.responder_result?.selections||[]);
      const overlap=[...left].filter(id=>right.has(id)).length;
      return{title:`${overlap} shared name${overlap===1?'':'s'}`,copy:'Compare where the two UFC arguments overlapped and split.'};
    }
    return{title:'Matchup complete',copy:'Both results are ready to compare.'};
  }

  async function fetchDetail(code){
    const who=await identity({title:'Open challenge results',description:'Use your Octagon HQ profile to view this matchup.'});
    const rpc=client();
    if(!who||!rpc)throw new Error('Challenge results are not connected.');
    const {data,error}=await rpc.rpc('play_profile_challenge_detail',{p_member_token:tokenFor(who),p_challenge_code:code});
    if(error)throw error;
    if(!data?.ok)throw new Error(data?.error||'Challenge results unavailable.');
    return data.challenge;
  }

  async function viewResults(rawCode){
    const code=text(rawCode).toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10);
    if(!code)return false;
    try{
      const detail=await fetchDetail(code);
      if(!detail?.completed)throw new Error('Both players have not finished yet.');
      closeResults();
      const game=typeFor(detail),verdict=comparisonVerdict(detail);
      const creatorScore=scoreValue(game,detail.creator_result),responderScore=scoreValue(game,detail.responder_result);
      const overlay=document.createElement('div');
      overlay.className='profile-challenge-overlay';
      overlay.innerHTML=`<section class="profile-challenge-panel challenge-results-panel" role="dialog" aria-modal="true" aria-labelledby="challengeResultsTitle"><header class="profile-challenge-head"><div><span>CHALLENGE RESULTS</span><strong id="challengeResultsTitle">${esc(titleFor(game))}</strong><small>Both players finished this exact challenge.</small></div><button type="button" class="profile-challenge-close" data-results-close aria-label="Close">×</button></header><div class="challenge-results-body"><div class="challenge-results-verdict"><span>MATCHUP COMPLETE</span><strong>${esc(verdict.title)}</strong><small>${esc(verdict.copy)}</small></div><div class="challenge-results-scoreboard"><article class="challenge-results-player"><span>SENDER</span><strong>${esc(detail.creator_name||'Sender')}</strong><b>${Number.isFinite(creatorScore.value)?`${creatorScore.value}${creatorScore.suffix}`:'DONE'}</b><small>${esc(playerSummary(game,detail.creator_result,detail.setup))}</small></article><div class="challenge-results-vs">VS</div><article class="challenge-results-player"><span>RESPONDER</span><strong>${esc(detail.responder_name||'Responder')}</strong><b>${Number.isFinite(responderScore.value)?`${responderScore.value}${responderScore.suffix}`:'DONE'}</b><small>${esc(playerSummary(game,detail.responder_result,detail.setup))}</small></article></div><button type="button" class="challenge-results-close" data-results-close>CLOSE</button></div></section>`;
      document.body.appendChild(overlay);
      document.body.classList.add('profile-challenge-open');
      state.resultModal=overlay;
      overlay.querySelectorAll('[data-results-close]').forEach(button=>button.addEventListener('click',closeResults));
      overlay.addEventListener('click',event=>{if(event.target===overlay)closeResults();});
      return true;
    }catch(error){
      console.error(error);
      return false;
    }
  }

  function banner(){
    const panel=document.getElementById('playFindLeaderPanel');
    if(!panel||!state.active)return;
    panel.querySelector('.play-profile-challenge-banner')?.remove();
    const node=document.createElement('div');
    node.className='play-profile-challenge-banner';
    node.innerHTML=`<span>PROFILE CHALLENGE</span><strong>${esc(state.active.creatorName||'A friend')} sent this exact board.</strong><small>Finish to unlock both results in Challenge Center.</small>`;
    panel.prepend(node);
  }

  async function fetchChallenge(code,who,{directOnly=false}={}){
    const rpc=client(),token=tokenFor(who);
    if(token){
      const direct=await rpc.rpc('play_open_profile_challenge',{p_member_token:token,p_challenge_code:code});
      if(!direct.error&&direct.data?.ok)return{...direct.data.challenge,direct:true};
      if(directOnly)throw direct.error||new Error(direct.data?.error||'That profile challenge is not available.');
    }
    if(directOnly)throw new Error('That profile challenge is not available.');
    const open=await rpc.rpc('play_get_challenge',{p_challenge_code:code});
    if(open.error)throw open.error;
    if(!open.data?.ok)throw new Error(open.data?.error||'Challenge not found.');
    return{...open.data.challenge,direct:false};
  }

  async function openChallenge(rawCode,options={}){
    const code=text(rawCode).toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10);
    const who=await identity({title:'Open the challenge',description:'Sign in so the result belongs to your profile.'});
    if(!code||!who)return false;
    const challenge=await fetchChallenge(code,who,options);
    if(challenge.game_type!=='find-leader')throw new Error('That game is handled by the all-game challenge owner.');
    window.UFC_APP_SHELL?.activateDestination?.('play')||window.UFC_PRODUCT_ARCHITECTURE?.activateDestination?.('play');
    const hub=await waitFor(()=>window.UFC_PLAY_HUB?.openGame&&window.UFC_PLAY_HUB);
    await hub.openGame('find-leader',{daily:false});
    const game=await waitFor(()=>window.UFC_FIND_LEADER?.startGame&&window.UFC_FIND_LEADER);
    if(!game.startGame({setup:challenge.setup}))throw new Error('The exact board could not open.');
    state.active={code,direct:challenge.direct,creatorName:challenge.creator_name,setup:clone(challenge.setup),identity:who};
    banner();
    await loadInbox();
    return true;
  }

  function matches(){
    const current=window.UFC_FIND_LEADER?.state?.setup,expected=state.active?.setup;
    return current&&expected&&(current.candidates||[]).map(row=>row.id).join('|')===(expected.candidates||[]).map(row=>row.id).join('|');
  }

  async function complete(detail){
    if(state.busy||!state.active||detail.gameType!=='find-leader'||!matches())return;
    state.busy=true;
    const who=state.active.identity,rpc=client(),result=window.UFC_FIND_LEADER?.sharePayload?.()?.result||detail.result;
    try{
      const args=state.active.direct
        ?{p_member_token:tokenFor(who),p_challenge_code:state.active.code,p_result:result,p_score:Number(result.score)||0,p_metadata:{delivery:'profile'}}
        :{p_challenge_code:state.active.code,p_group_code:who.groupCode||'GOAT26',p_member_token:tokenFor(who),p_result:result,p_score:Number(result.score)||0,p_metadata:{delivery:'link'}};
      const response=await rpc.rpc(state.active.direct?'play_submit_profile_challenge':'play_submit_challenge',args);
      if(response.error)throw response.error;
      window.UFC_FIND_LEADER?.renderChallengeComparison?.(response.data);
      state.active=null;
      await loadInbox();
    }catch(error){
      console.error(error);
    }finally{
      state.busy=false;
    }
  }

  async function routeCurrent(){
    if(state.routed)return false;
    const params=new URL(location.href).searchParams,code=params.get('challenge');
    if(!code)return false;
    state.routed=true;
    try{return await openChallenge(code);}
    catch(error){console.error(error);return false;}
  }

  function start(){
    styles();
    window.addEventListener('click',event=>{
      const filter=event.target.closest?.('[data-challenge-filter]');
      if(filter){
        state.filter=filter.dataset.challengeFilter||'all';
        renderChallengeCenter();
        return;
      }
      const results=event.target.closest?.('[data-view-profile-challenge]');
      if(results){
        event.preventDefault();
        event.stopImmediatePropagation();
        void viewResults(results.dataset.viewProfileChallenge);
        return;
      }
      const challenge=event.target.closest?.('[data-open-profile-challenge]');
      if(challenge){
        event.preventDefault();
        event.stopImmediatePropagation();
        void playInboxChallenge(challenge.dataset.openProfileChallenge);
        return;
      }
      const playNav=event.target.closest?.('[data-native-destination="play"]');
      if(playNav&&Number(state.inbox.unread_count)>0){
        event.preventDefault();
        event.stopImmediatePropagation();
        void openCenter();
      }
    },true);

    window.addEventListener('ufc-play-game-complete',event=>complete(event.detail||{}));
    window.addEventListener('ufc-play-profile-ready',event=>{state.identity=event.detail||null;loadInbox();});
    window.addEventListener('ufc-app-profile-updated',event=>{state.identity=event.detail?.identity||state.identity;loadInbox();});
    window.addEventListener('ufc-profile-challenge-sent',loadInbox);
    window.addEventListener('ufc-play-hub-ready',()=>{renderChallengeCenter();if(isPlayActive())markSeen();});
    window.addEventListener('octagon-hq:view-change',event=>{
      if(event.detail?.destination!=='play')return;
      setTimeout(async()=>{
        window.UFC_PLAY_HUB?.showHub?.();
        await loadInbox();
        renderChallengeCenter();
        await markSeen();
      },60);
    });
    document.addEventListener('keydown',event=>{
      if(event.key!=='Escape')return;
      if(state.resultModal)closeResults();
      else if(state.modal)close();
    });

    state.observer=new MutationObserver(records=>{
      if(records.some(record=>[...record.addedNodes].some(node=>node.nodeType===1&&(node.id==='playHub'||node.querySelector?.('#playHub')))))scheduleDecorate();
    });
    state.observer.observe(document.body,{childList:true,subtree:true});

    setTimeout(async()=>{
      await loadInbox();
      renderChallengeCenter();
      if(isPlayActive())await markSeen();
      await waitFor(()=>window.UFC_GAME_CHALLENGES?.route).catch(()=>null);
      const router=window.UFC_PROFILE_CHALLENGES?.routeCurrent;
      await (router&&router!==routeCurrent?router():routeCurrent());
    },200);
  }

  window.UFC_PROFILE_CHALLENGES={
    version:VERSION,
    openSendModal,
    openChallenge,
    openInbox:openCenter,
    openCenter,
    playInboxChallenge,
    viewResults,
    loadInbox,
    markSeen,
    routeCurrent,
    challengeUrl,
    renderChallengeCenter,
    get rows(){return state.inbox.rows;},
    get unreadCount(){return Number(state.inbox.unread_count)||0;}
  };
  document.documentElement.setAttribute('data-profile-challenges',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

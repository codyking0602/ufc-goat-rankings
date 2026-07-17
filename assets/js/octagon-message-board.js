(function(){
  'use strict';

  const VERSION='octagon-message-board-20260717b';
  const CANONICAL_CODE='GOAT26';
  const TOKEN_KEY=`ufc-picks:group:${CANONICAL_CODE}`;
  const state={snapshot:null,weekStart:null,replyTo:null,loading:false,busy:false,mounted:false};

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

  function avatarMarkup(member,className=''){
    const fighter=fighterFor(member?.fighter_avatar_slug);
    const src=fighterPhoto(fighter);
    const label=fighter?.name||member?.display_name||'UFC profile';
    return `<span class="octagon-avatar ${esc(className)}" data-member-name="${esc(member?.display_name||'')}">${src
      ? `<img src="${esc(src)}" alt="${esc(label)}" data-octagon-avatar-image>`
      : `<span>${esc(initials(member?.display_name))}</span>`}</span>`;
  }

  function hydrateBrokenImages(root=document){
    root.querySelectorAll?.('img[data-octagon-avatar-image]').forEach(image=>{
      if(image.dataset.octagonErrorBound)return;
      image.dataset.octagonErrorBound='true';
      image.addEventListener('error',()=>{
        const fallback=document.createElement('span');
        fallback.textContent=initials(image.closest('[data-member-name]')?.dataset.memberName||image.alt);
        image.replaceWith(fallback);
      },{once:true});
    });
  }

  function linkify(value){
    const raw=String(value??'');
    const regex=/https?:\/\/[^\s<]+/gi;
    let html='';
    let cursor=0;
    let match;
    while((match=regex.exec(raw))){
      html+=esc(raw.slice(cursor,match.index));
      let url=match[0];
      let trailing='';
      while(/[),.!?;:]$/.test(url)){
        trailing=url.slice(-1)+trailing;
        url=url.slice(0,-1);
      }
      html+=`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(url)}</a>${esc(trailing)}`;
      cursor=match.index+match[0].length;
    }
    return (html+esc(raw.slice(cursor))).replace(/\n/g,'<br>');
  }

  function parseDate(value){
    const clean=text(value);
    return clean?new Date(`${clean}T12:00:00`):null;
  }

  function weekLabel(board){
    const start=parseDate(board?.week_start);
    const end=parseDate(board?.week_end);
    if(!start||!end)return'This week';
    const startText=new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric'}).format(start);
    const endText=new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',year:'numeric'}).format(end);
    return `${startText} – ${endText}`;
  }

  function timeLabel(value){
    const date=new Date(value);
    if(Number.isNaN(date.getTime()))return'';
    return new Intl.DateTimeFormat(undefined,{
      weekday:'short',hour:'numeric',minute:'2-digit',timeZone:'America/Chicago'
    }).format(date);
  }

  function installStyles(){
    if(document.getElementById('octagonMessageBoardCss'))return;
    const style=document.createElement('style');
    style.id='octagonMessageBoardCss';
    style.textContent=`
      .octagon-board{max-width:820px;margin:0 auto;color:#f8fafc}.octagon-board button,.octagon-board textarea,.octagon-board select{font:inherit}.octagon-board-head{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px;align-items:end;padding:20px;border:1px solid #2b3a52;border-radius:22px 22px 0 0;background:radial-gradient(circle at 92% 0,rgba(249,115,22,.19),transparent 34%),linear-gradient(145deg,#19263b,#0c1321)}.octagon-board-kicker{color:#fb923c;font:950 9px/1 system-ui;letter-spacing:.15em}.octagon-board-head h2{margin:7px 0 4px;font:950 clamp(34px,7vw,54px)/.94 system-ui;letter-spacing:-.045em}.octagon-board-week{margin:0;color:#cbd5e1;font:750 12px/1.35 system-ui}.octagon-board-head-actions{display:flex;align-items:center;gap:7px}.octagon-board-head button,.octagon-board-head select{min-height:36px;border:1px solid #465a78;border-radius:11px;background:#101827;color:#f8fafc;padding:0 10px;font:900 10px/1 system-ui}.octagon-board-head button{cursor:pointer}.octagon-board-head button:hover{border-color:#f97316}.octagon-week-select[hidden]{display:none}.octagon-board-status{min-height:0}.octagon-notice{margin:12px 0 0;padding:11px 13px;border:1px solid rgba(249,115,22,.35);border-radius:13px;background:rgba(249,115,22,.08);color:#fed7aa;font:750 11px/1.4 system-ui}.octagon-notice.error{border-color:rgba(248,113,113,.45);background:rgba(127,29,29,.2);color:#fecaca}.octagon-feed{min-height:260px;border-left:1px solid #2b3a52;border-right:1px solid #2b3a52;background:#0b1220;padding:14px}.octagon-empty{display:grid;place-items:center;min-height:230px;padding:30px;border:1px dashed #3a4b65;border-radius:17px;color:#94a3b8;text-align:center}.octagon-empty strong{display:block;color:#f8fafc;font:950 17px/1.1 system-ui}.octagon-empty span{display:block;margin-top:7px;font:700 12px/1.45 system-ui}.octagon-thread{display:grid;gap:8px;margin-bottom:12px}.octagon-message{border:1px solid #2b3a52;border-radius:17px;background:linear-gradient(180deg,#141e2f,#101827);padding:12px}.octagon-message.reply{margin-left:42px;border-left:3px solid rgba(249,115,22,.62);background:#0f1726}.octagon-message-head{display:grid;grid-template-columns:36px minmax(0,1fr) auto;gap:9px;align-items:center}.octagon-avatar{width:36px;height:36px;min-width:36px;display:flex;align-items:center;justify-content:center;overflow:hidden;border:1px solid rgba(249,115,22,.55);border-radius:12px;background:radial-gradient(circle at 50% 18%,rgba(249,115,22,.38),#111827 68%);color:#fff;font:950 10px/1 system-ui}.octagon-avatar img{width:100%;height:100%;display:block;object-fit:cover;object-position:center 12%}.octagon-message-author{min-width:0}.octagon-message-author strong,.octagon-message-author small{display:block}.octagon-message-author strong{font:950 12px/1 system-ui;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.octagon-message-author small{margin-top:4px;color:#94a3b8;font:700 9px/1 system-ui}.octagon-admin-label{color:#fb923c;font:950 7px/1 system-ui;letter-spacing:.1em}.octagon-message-body{margin:11px 0 0;color:#e5e7eb;font:650 14px/1.5 system-ui;overflow-wrap:anywhere}.octagon-message-body a{color:#fb923c;text-decoration:underline;text-underline-offset:2px}.octagon-message.deleted .octagon-message-body{color:#64748b;font-style:italic}.octagon-message-actions{display:flex;align-items:center;gap:6px;margin-top:11px;flex-wrap:wrap}.octagon-message-actions button{min-height:30px;border:1px solid #33445f;border-radius:10px;background:#0b1220;color:#cbd5e1;padding:0 9px;cursor:pointer;font:900 9px/1 system-ui}.octagon-message-actions button:hover{border-color:#f97316;color:#fff}.octagon-message-actions button.active{border-color:#f97316;background:rgba(249,115,22,.14);color:#fed7aa}.octagon-message-actions button.delete{margin-left:auto;color:#fca5a5}.octagon-composer{position:sticky;bottom:0;z-index:20;border:1px solid #2b3a52;border-radius:0 0 22px 22px;background:rgba(15,23,38,.97);backdrop-filter:blur(12px);padding:13px}.octagon-replying{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px;padding:8px 10px;border:1px solid rgba(249,115,22,.34);border-radius:11px;background:rgba(249,115,22,.08);color:#fed7aa;font:800 10px/1.3 system-ui}.octagon-replying[hidden]{display:none}.octagon-replying button{border:0;background:transparent;color:#fff;cursor:pointer;font-weight:950}.octagon-compose-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:9px;align-items:end}.octagon-compose-copy{position:relative}.octagon-compose-copy textarea{display:block;width:100%;min-height:72px;max-height:180px;resize:vertical;border:1px solid #435675;border-radius:14px;background:#0b1220;color:#fff;padding:11px 12px 26px;outline:none;font:650 14px/1.45 system-ui}.octagon-compose-copy textarea:focus{border-color:#f97316;box-shadow:0 0 0 3px rgba(249,115,22,.12)}.octagon-character-count{position:absolute;right:10px;bottom:8px;color:#64748b;font:800 9px/1 system-ui}.octagon-character-count.over{color:#f87171}.octagon-submit{min-width:92px;min-height:44px;border:1px solid #f97316;border-radius:13px;background:#f97316;color:#111827;padding:0 14px;cursor:pointer;font:950 10px/1 system-ui}.octagon-submit:disabled,.octagon-board button:disabled{opacity:.48;cursor:not-allowed}.octagon-auth-card{margin:14px;border:1px solid rgba(249,115,22,.35);border-radius:17px;background:rgba(249,115,22,.07);padding:18px;text-align:center}.octagon-auth-card strong{display:block;font:950 17px/1.1 system-ui}.octagon-auth-card p{margin:8px 0 13px;color:#94a3b8;font:700 12px/1.45 system-ui}.octagon-auth-card button{min-height:40px;border:1px solid #f97316;border-radius:12px;background:#f97316;color:#111827;padding:0 14px;font:950 10px/1 system-ui;cursor:pointer}
      @media(max-width:620px){.octagon-board-head{grid-template-columns:1fr;padding:16px;gap:12px}.octagon-board-head-actions{justify-content:space-between}.octagon-board-head-actions select{min-width:0;max-width:190px}.octagon-feed{padding:10px}.octagon-message.reply{margin-left:24px}.octagon-compose-row{grid-template-columns:1fr}.octagon-submit{width:100%}.octagon-composer{padding:10px}}
    `;
    document.head.appendChild(style);
  }

  function root(){return document.getElementById('octagon');}

  function mount(){
    const section=root();
    if(!section)return false;
    installStyles();
    if(section.querySelector('[data-octagon-board]')){
      state.mounted=true;
      return true;
    }
    section.innerHTML=`<div class="octagon-board" data-octagon-board>
      <header class="octagon-board-head">
        <div><div class="octagon-board-kicker">PRIVATE BETA · GOAT26</div><h2>The Octagon</h2><p class="octagon-board-week" data-octagon-week>One UFC conversation. A new board every Monday.</p></div>
        <div class="octagon-board-head-actions"><select class="octagon-week-select" data-octagon-week-select hidden aria-label="Octagon week"></select><button type="button" data-octagon-refresh>Refresh</button></div>
      </header>
      <div class="octagon-board-status" data-octagon-status role="status"></div>
      <div class="octagon-feed" data-octagon-feed><div class="octagon-empty"><div><strong>Loading The Octagon…</strong><span>Verifying your GOAT26 profile.</span></div></div></div>
      <form class="octagon-composer" data-octagon-composer>
        <div class="octagon-replying" data-octagon-replying hidden><span></span><button type="button" data-octagon-cancel-reply aria-label="Cancel reply">×</button></div>
        <div class="octagon-compose-row"><div class="octagon-compose-copy"><textarea data-octagon-input maxlength="500" placeholder="Post to The Octagon…" aria-label="Message"></textarea><span class="octagon-character-count" data-octagon-count>0 / 500</span></div><button class="octagon-submit" type="submit" data-octagon-submit disabled>POST</button></div>
      </form>
    </div>`;
    bindStaticEvents(section);
    state.mounted=true;
    return true;
  }

  function setNotice(message='',kind=''){
    const node=root()?.querySelector('[data-octagon-status]');
    if(!node)return;
    node.innerHTML=message?`<div class="octagon-notice${kind?' '+esc(kind):''}">${esc(message)}</div>`:'';
  }

  function renderAuth(message){
    const feed=root()?.querySelector('[data-octagon-feed]');
    const composer=root()?.querySelector('[data-octagon-composer]');
    if(!feed)return;
    if(composer)composer.hidden=true;
    feed.innerHTML=`<div class="octagon-auth-card"><strong>Reconnect your UFC App profile</strong><p>${esc(message||'Sign in with Cody and your four-digit PIN to open the private Beta.')}</p><button type="button" data-octagon-sign-in>SIGN IN</button></div>`;
    feed.querySelector('[data-octagon-sign-in]')?.addEventListener('click',async()=>{
      await window.UFC_PLAY_PROFILE?.require?.({title:'Open The Octagon',description:'Use your Cody profile and four-digit PIN to enter the private Beta.'});
      await load();
    });
  }

  function messageMarkup(message,isReply=false,boardCurrent=true){
    const author=message.author||{};
    const deleted=Boolean(message.deleted);
    const canReact=boardCurrent&&!deleted;
    const canReply=boardCurrent&&!deleted&&!isReply;
    const body=deleted?'Message deleted.':linkify(message.body);
    return `<article class="octagon-message${isReply?' reply':''}${deleted?' deleted':''}" data-octagon-message-id="${esc(message.id)}">
      <div class="octagon-message-head">${avatarMarkup(author)}<div class="octagon-message-author"><strong>${esc(author.display_name||'UFC member')}</strong><small>${esc(timeLabel(message.created_at))}</small></div>${author.is_admin?'<span class="octagon-admin-label">ADMIN</span>':''}</div>
      <div class="octagon-message-body">${body}</div>
      ${deleted?'':`<div class="octagon-message-actions">
        <button type="button" data-octagon-reaction="like" class="${message.my_reaction==='like'?'active':''}" ${canReact?'':'disabled'}>👍 ${Number(message.likes)||0}</button>
        <button type="button" data-octagon-reaction="dislike" class="${message.my_reaction==='dislike'?'active':''}" ${canReact?'':'disabled'}>👎 ${Number(message.dislikes)||0}</button>
        ${canReply?'<button type="button" data-octagon-reply>Reply</button>':''}
        ${message.can_delete&&boardCurrent?'<button type="button" class="delete" data-octagon-delete>Delete</button>':''}
      </div>`}
    </article>`;
  }

  function renderMessages(snapshot){
    const feed=root()?.querySelector('[data-octagon-feed]');
    if(!feed)return;
    const messages=Array.isArray(snapshot?.messages)?snapshot.messages:[];
    if(!messages.length){
      feed.innerHTML='<div class="octagon-empty"><div><strong>Start this week’s conversation</strong><span>No posts yet. Drop the first UFC take.</span></div></div>';
      return;
    }
    const replies=new Map();
    messages.filter(item=>item.parent_message_id).forEach(item=>{
      const list=replies.get(item.parent_message_id)||[];
      list.push(item);
      replies.set(item.parent_message_id,list);
    });
    const top=messages.filter(item=>!item.parent_message_id);
    feed.innerHTML=top.map(message=>`<div class="octagon-thread">${messageMarkup(message,false,Boolean(snapshot.board?.is_current))}${(replies.get(message.id)||[]).map(reply=>messageMarkup(reply,true,Boolean(snapshot.board?.is_current))).join('')}</div>`).join('');
    bindMessageEvents(feed);
    hydrateBrokenImages(feed);
  }

  function renderWeeks(snapshot){
    const select=root()?.querySelector('[data-octagon-week-select]');
    if(!select)return;
    const weeks=Array.isArray(snapshot?.available_weeks)?snapshot.available_weeks:[];
    select.hidden=weeks.length<=1;
    select.innerHTML=weeks.map(week=>`<option value="${esc(week)}"${week===snapshot.board?.week_start?' selected':''}>Week of ${esc(new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',year:'numeric'}).format(parseDate(week)))}</option>`).join('');
  }

  function renderComposer(snapshot){
    const composer=root()?.querySelector('[data-octagon-composer]');
    const input=composer?.querySelector('[data-octagon-input]');
    const submit=composer?.querySelector('[data-octagon-submit]');
    if(!composer||!input||!submit)return;
    composer.hidden=false;
    const current=Boolean(snapshot?.board?.is_current);
    input.disabled=!current||state.busy;
    input.placeholder=current?(state.replyTo?'Write a reply…':'Post to The Octagon…'):'Archived weeks are read-only.';
    updateComposer();
  }

  function render(snapshot){
    state.snapshot=snapshot;
    state.weekStart=snapshot?.board?.week_start||null;
    const week=root()?.querySelector('[data-octagon-week]');
    if(week)week.textContent=`${weekLabel(snapshot?.board)} · Resets Monday at 12:00 AM Central`;
    renderWeeks(snapshot);
    renderMessages(snapshot);
    renderReplyBanner();
    renderComposer(snapshot);
    setNotice('');
  }

  function renderReplyBanner(){
    const node=root()?.querySelector('[data-octagon-replying]');
    if(!node)return;
    if(!state.replyTo){
      node.hidden=true;
      node.querySelector('span').textContent='';
      return;
    }
    node.hidden=false;
    node.querySelector('span').textContent=`Replying to ${state.replyTo.author?.display_name||'message'}`;
  }

  function updateComposer(){
    const input=root()?.querySelector('[data-octagon-input]');
    const count=root()?.querySelector('[data-octagon-count]');
    const submit=root()?.querySelector('[data-octagon-submit]');
    if(!input||!count||!submit)return;
    const current=Boolean(state.snapshot?.board?.is_current);
    input.disabled=!current||state.busy;
    const length=input.value.length;
    count.textContent=`${length} / 500`;
    count.classList.toggle('over',length>500);
    submit.textContent=state.busy?'POSTING…':state.replyTo?'REPLY':'POST';
    submit.disabled=state.busy||!current||length<1||length>500||!input.value.trim();
  }

  async function context(){
    const profile=window.UFC_PLAY_PROFILE;
    const identity=await profile?.resolve?.();
    return{client:profile?.client||null,identity,token:tokenFor(identity)};
  }

  async function load(weekStart=null,options={}){
    if(state.loading)return null;
    if(!mount())return null;
    state.loading=true;
    if(!options.silent)setNotice('Loading this week’s board…');
    try{
      const {client,token}=await context();
      if(!client||!token){
        renderAuth('Your saved GOAT26 profile could not be verified on this device.');
        setNotice('');
        return null;
      }
      const {data,error}=await client.rpc('octagon_snapshot',{
        p_member_token:token,
        p_week_start:weekStart||null
      });
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'The Octagon could not be loaded.');
      if(state.replyTo&&!data.messages?.some(message=>message.id===state.replyTo.id))state.replyTo=null;
      render(data);
      return data;
    }catch(error){
      const message=text(error?.message)||'The Octagon could not be loaded.';
      if(/profile was not recognized|not enabled|sign in/i.test(message))renderAuth(message);
      else{
        const feed=root()?.querySelector('[data-octagon-feed]');
        if(feed)feed.innerHTML='<div class="octagon-empty"><div><strong>Could not load The Octagon</strong><span>Use Refresh to try again.</span></div></div>';
      }
      setNotice(message,'error');
      return null;
    }finally{
      state.loading=false;
    }
  }

  async function post(){
    const input=root()?.querySelector('[data-octagon-input]');
    const body=input?.value.trim()||'';
    if(!body||state.busy)return;
    state.busy=true;
    updateComposer();
    setNotice(state.replyTo?'Posting reply…':'Posting message…');
    try{
      const {client,token}=await context();
      if(!client||!token)throw new Error('Reconnect your UFC App profile.');
      const {data,error}=await client.rpc('octagon_post_message',{
        p_member_token:token,
        p_body:body,
        p_parent_message_id:state.replyTo?.id||null
      });
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'The message could not be posted.');
      input.value='';
      state.replyTo=null;
      await load(null,{silent:true});
    }catch(error){
      setNotice(text(error?.message)||'The message could not be posted.','error');
    }finally{
      state.busy=false;
      updateComposer();
    }
  }

  async function react(messageId,reaction,currentReaction){
    if(state.busy)return;
    state.busy=true;
    try{
      const {client,token}=await context();
      if(!client||!token)throw new Error('Reconnect your UFC App profile.');
      const desired=currentReaction===reaction?'remove':reaction;
      const {data,error}=await client.rpc('octagon_set_reaction',{
        p_member_token:token,
        p_message_id:messageId,
        p_reaction:desired
      });
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'The reaction could not be saved.');
      const message=state.snapshot?.messages?.find(item=>item.id===messageId);
      if(message){
        message.likes=data.likes;
        message.dislikes=data.dislikes;
        message.my_reaction=data.my_reaction;
        renderMessages(state.snapshot);
      }
    }catch(error){
      setNotice(text(error?.message)||'The reaction could not be saved.','error');
    }finally{
      state.busy=false;
      updateComposer();
    }
  }

  async function removeMessage(messageId){
    if(state.busy||!window.confirm('Delete this message?'))return;
    state.busy=true;
    updateComposer();
    setNotice('Deleting message…');
    try{
      const {client,token}=await context();
      if(!client||!token)throw new Error('Reconnect your UFC App profile.');
      const {data,error}=await client.rpc('octagon_delete_message',{
        p_member_token:token,
        p_message_id:messageId
      });
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'The message could not be deleted.');
      if(state.replyTo?.id===messageId)state.replyTo=null;
      await load(state.weekStart,{silent:true});
    }catch(error){
      setNotice(text(error?.message)||'The message could not be deleted.','error');
    }finally{
      state.busy=false;
      updateComposer();
    }
  }

  function bindMessageEvents(feed){
    feed.querySelectorAll('[data-octagon-message-id]').forEach(card=>{
      const id=card.dataset.octagonMessageId;
      const message=state.snapshot?.messages?.find(item=>item.id===id);
      card.querySelectorAll('[data-octagon-reaction]').forEach(button=>button.addEventListener('click',()=>react(id,button.dataset.octagonReaction,message?.my_reaction)));
      card.querySelector('[data-octagon-reply]')?.addEventListener('click',()=>{
        state.replyTo=message||null;
        renderReplyBanner();
        renderComposer(state.snapshot);
        const input=root()?.querySelector('[data-octagon-input]');
        input?.focus();
        input?.scrollIntoView({behavior:'smooth',block:'center'});
      });
      card.querySelector('[data-octagon-delete]')?.addEventListener('click',()=>removeMessage(id));
    });
  }

  function bindStaticEvents(section){
    section.querySelector('[data-octagon-refresh]')?.addEventListener('click',()=>load(state.weekStart));
    section.querySelector('[data-octagon-week-select]')?.addEventListener('change',event=>{
      state.replyTo=null;
      load(event.target.value||null);
    });
    section.querySelector('[data-octagon-cancel-reply]')?.addEventListener('click',()=>{
      state.replyTo=null;
      renderReplyBanner();
      renderComposer(state.snapshot);
    });
    section.querySelector('[data-octagon-input]')?.addEventListener('input',updateComposer);
    section.querySelector('[data-octagon-composer]')?.addEventListener('submit',event=>{
      event.preventDefault();
      post();
    });
  }

  function bindTab(){
    const button=document.querySelector('[data-octagon-beta-tab]');
    if(!button||button.dataset.octagonBoardBound)return Boolean(button);
    button.dataset.octagonBoardBound='true';
    button.addEventListener('click',()=>{
      if(button.disabled)return;
      window.setTimeout(()=>load(),0);
    });
    return true;
  }

  function start(){
    installStyles();
    mount();
    bindTab();
    [50,220,850,2200].forEach(delay=>window.setTimeout(()=>{mount();bindTab();},delay));
    if(root()?.classList.contains('active-view'))load();
  }

  window.addEventListener('ufc-play-profile-ready',()=>{
    if(root()?.classList.contains('active-view'))load();
  });
  window.addEventListener('ufc-app-profile-updated',()=>{
    if(root()?.classList.contains('active-view'))load(state.weekStart,{silent:true});
  });

  window.UFC_OCTAGON_BOARD={version:VERSION,load,post,react,removeMessage,get snapshot(){return state.snapshot;}};
  document.documentElement.setAttribute('data-octagon-message-board',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

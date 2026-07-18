(function(){
  'use strict';

  // Compatibility marker for the Phase 4B deployment workflow:
  // community-profiles-20260718a-phase-4b
  const VERSION='community-profiles-20260718b-full-public-profile';
  const TOP10='ufc-goat-play-top10-v1';
  const TARGET='octagon-hq:challenge-target-v1';
  const state={identity:null,snapshot:null,loading:null,modal:null,renderTimer:0,syncTimer:0,lastPublished:'',observer:null,wrapped:false};

  const text=value=>String(value??'').trim();
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const norm=value=>text(value).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const token=identity=>text(identity?.memberToken||identity?.member_token);
  const rpc=()=>window.UFC_PLAY_PROFILE?.client||null;
  const parse=(value,fallback=null)=>{try{return JSON.parse(value);}catch(_error){return fallback;}};

  function timeAgo(value){
    const then=new Date(value).getTime();
    if(!Number.isFinite(then)||then<=0)return'No recent activity';
    const minutes=Math.max(0,Math.round((Date.now()-then)/60000));
    if(minutes<1)return'Active just now';
    if(minutes<60)return`Active ${minutes}m ago`;
    const hours=Math.floor(minutes/60);
    if(hours<24)return`Active ${hours}h ago`;
    const days=Math.floor(hours/24);
    if(days<7)return`Active ${days}d ago`;
    return`Active ${new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric'}).format(new Date(value))}`;
  }

  function localTop10(){
    try{
      const rows=parse(localStorage.getItem(TOP10),[]);
      return Array.isArray(rows)?rows.map(text).filter(Boolean).slice(0,10):[];
    }catch(_error){return[];}
  }

  function fallbackMembers(){
    return Array.isArray(window.UFC_APP_PROFILE?.group?.members)?window.UFC_APP_PROFILE.group.members:[];
  }

  function meId(){
    return state.snapshot?.me_id||state.identity?.member?.id||window.UFC_APP_PROFILE?.group?.me?.id||'';
  }

  function allMembers(){
    const rows=state.snapshot?.members?.length?state.snapshot.members:fallbackMembers();
    return[...rows].sort((a,b)=>a.id===meId()?-1:b.id===meId()?1:(new Date(b.last_active_at||0)-new Date(a.last_active_at||0))||text(a.display_name).localeCompare(text(b.display_name)));
  }

  function avatar(member,kind='friend'){
    return window.UFC_APP_PROFILE?.avatarMarkup?.(member,kind)||`<span class="app-profile-avatar ${esc(kind)}"><span>${esc(text(member?.display_name).slice(0,2).toUpperCase()||'UFC')}</span></span>`;
  }

  function picksRows(){
    return window.UFC_PICKS_SEASON_LOOP?.data?.group?.members||[];
  }

  function picksFor(member){
    return picksRows().find(row=>row.id===member?.id)||picksRows().find(row=>norm(row.display_name)===norm(member?.display_name))||null;
  }

  function picksRank(member){
    const rows=picksRows();
    const row=picksFor(member);
    if(!row)return'—';
    const key=item=>[num(item?.points??item?.score),num(item?.event_wins),num(item?.correct),num(item?.picks_made??item?.picks_count)].join('|');
    const first=rows.findIndex(item=>key(item)===key(row));
    if(first<0)return'—';
    const tied=rows.filter(item=>key(item)===key(row)).length>1;
    return`${tied?'T-':'#'}${first+1}`;
  }

  function stats(member){
    const picks=picksFor(member)||{};
    const made=num(picks.picks_made??picks.picks_count);
    const correct=num(picks.correct);
    const challenges=member.challenge_stats||{};
    const war=member.war_stats||{};
    const daily=member.daily_stats||{};
    return{
      made,
      correct,
      losses:Math.max(0,made-correct),
      accuracy:Number.isFinite(Number(picks.accuracy))?num(picks.accuracy):(made?Math.round(correct/made*100):0),
      points:num(picks.points??picks.score),
      eventWins:num(picks.event_wins),
      eventsPlayed:num(picks.events_played),
      rank:picksRank(member),
      challenges:num(challenges.completed),
      sent:num(challenges.sent),
      received:num(challenges.received),
      warPosts:num(war.posts),
      warReplies:num(war.replies),
      warTotal:num(war.posts)+num(war.replies),
      dailyDays:num(daily.days),
      perfect:num(daily.perfect_tens)
    };
  }

  function top10(member){
    return Array.isArray(member?.top_ten)?member.top_ten.map(text).filter(Boolean).slice(0,10):[];
  }

  function thumb(name){
    const override=window.DISPLAY_OVERRIDES?.[name]||{};
    return text(override.thumbUrl||override.photoUrl||override.thumb||override.photo);
  }

  function top10Markup(member){
    const rows=top10(member);
    if(rows.length!==10)return'<div class="community-top-ten-empty">This member has not published a UFC Top 10 yet.</div>';
    return`<div class="community-top-ten-list">${rows.map((name,index)=>{const photo=thumb(name);return`<div class="community-top-ten-row"><b>#${index+1}</b><span class="community-top-ten-photo">${photo?`<img src="${esc(photo)}" alt="${esc(name)}">`:esc(name.slice(0,2).toUpperCase())}</span><strong>${esc(name)}</strong></div>`;}).join('')}</div>`;
  }

  function achievements(member,memberStats){
    const profileReady=Boolean(text(member?.profile_photo_data)||text(member?.fighter_avatar_slug));
    return[
      {icon:'👤',title:'Profile Ready',copy:'Shared Octagon HQ identity.',unlocked:profileReady},
      {icon:'🎯',title:'Perfect 10',copy:'Scored 10/10 in Find the Leader.',unlocked:memberStats.perfect>0},
      {icon:'📅',title:'Daily Regular',copy:'Completed three daily challenges.',unlocked:memberStats.dailyDays>=3},
      {icon:'🥊',title:'Picks Player',copy:'Has graded UFC Picks.',unlocked:memberStats.made>0},
      {icon:'🏆',title:'Event Champion',copy:'Finished first in a Picks event.',unlocked:memberStats.eventWins>0},
      {icon:'💬',title:'War Room Voice',copy:'Posted or replied in The War Room.',unlocked:memberStats.warTotal>0},
      {icon:'⚔️',title:'Challenge Competitor',copy:'Completed a direct challenge.',unlocked:memberStats.challenges>0},
      {icon:'🔟',title:'Top 10 Published',copy:'Shared a personal UFC Top 10.',unlocked:top10(member).length===10}
    ];
  }

  function signature(rows){
    return JSON.stringify(rows.map(member=>{const memberStats=stats(member);return[member.id,member.display_name,member.profile_updated_at,member.top_ten_updated_at,member.last_active_at,top10(member),memberStats.rank,memberStats.points,memberStats.correct,memberStats.made,memberStats.challenges,memberStats.warTotal,memberStats.dailyDays];}));
  }

  function directoryCard(member){
    const memberStats=stats(member);
    const own=member.id===meId();
    const complete=top10(member).length===10;
    return`<button type="button" class="community-member-card${own?' me':''}" data-community-member="${esc(member.id)}" data-member-name="${esc(member.display_name)}">
      ${avatar(member)}
      <span class="community-member-main">
        <span class="community-member-name">${esc(member.display_name)}${own?' <em>YOU</em>':''}</span>
        <span class="community-member-active">${esc(timeAgo(member.last_active_at))}</span>
        <span class="community-member-pills">
          <b>${memberStats.rank==='—'?'Picks —':`${memberStats.rank} Picks`}</b>
          <b>${memberStats.challenges} challenge${memberStats.challenges===1?'':'s'}</b>
          <b class="${complete?'complete':'missing'}">${complete?'Top 10 ready':'Top 10 needed'}</b>
        </span>
      </span>
      <span class="community-member-arrow" aria-hidden="true">›</span>
    </button>`;
  }

  function ensureDirectory(){
    const dashboard=document.querySelector('#home .home-dashboard');
    if(!dashboard)return false;
    const rows=allMembers();
    const me=rows.find(member=>member.id===meId());
    const needsTop10=me&&top10(me).length!==10;
    const sig=signature(rows);
    let node=dashboard.querySelector('[data-community-directory]');
    if(node?.dataset.signature===sig)return true;
    const html=`<section class="home-dashboard-card community-directory" data-community-directory data-signature="${esc(sig)}">
      <header class="community-directory-head">
        <div><span>OCTAGON HQ COMMUNITY</span><strong>Member Profiles</strong><small>Open a profile to see Picks, Play, War Room activity, achievements, and personal rankings.</small></div>
        <div class="community-directory-head-actions"><b>${rows.length} PROFILES</b>${needsTop10?'<button type="button" class="community-directory-action primary" data-community-build-top10>BUILD YOUR TOP 10</button>':'<button type="button" class="community-directory-action" data-community-open-self>OPEN YOUR PROFILE</button>'}</div>
      </header>
      ${rows.length?`<div class="community-member-grid">${rows.map(directoryCard).join('')}</div>`:'<div class="community-directory-empty">Member profiles will appear here after GOAT26 loads.</div>'}
    </section>`;
    if(node)node.outerHTML=html;
    else dashboard.insertAdjacentHTML('beforeend',html);
    return true;
  }

  function scheduleDirectory(delay=40){
    clearTimeout(state.renderTimer);
    state.renderTimer=setTimeout(ensureDirectory,delay);
  }

  async function identity(){
    if(state.identity)return state.identity;
    state.identity=await window.UFC_APP_PROFILE?.resolve?.().catch(()=>null)||await window.UFC_PLAY_PROFILE?.resolve?.().catch(()=>null)||null;
    return state.identity;
  }

  async function load(force=false){
    if(state.loading&&!force)return state.loading;
    state.loading=(async()=>{
      const who=await identity();
      const client=rpc();
      const memberToken=token(who);
      if(!who||!client||!memberToken){scheduleDirectory();return null;}
      try{
        const {data,error}=await client.rpc('app_profile_community_snapshot',{p_member_token:memberToken});
        if(error)throw error;
        if(!data?.ok)throw new Error(data?.error||'Community profiles unavailable.');
        state.snapshot=data;
        scheduleDirectory(0);
        if(state.modal)renderModal();
        window.dispatchEvent(new CustomEvent('octagon-hq:community-updated',{detail:data}));
        await syncTop10();
        return data;
      }catch(_error){scheduleDirectory();return null;}
    })().finally(()=>{state.loading=null;});
    return state.loading;
  }

  function updateOwn(rows){
    const member=state.snapshot?.members?.find(item=>item.id===meId());
    if(member){member.top_ten=[...rows];member.top_ten_updated_at=new Date().toISOString();}
  }

  async function syncTop10(force=false){
    const rows=localTop10();
    if(rows.length!==10||new Set(rows.map(norm)).size!==10)return false;
    const who=await identity();
    const client=rpc();
    const memberToken=token(who);
    if(!client||!memberToken)return false;
    const sig=JSON.stringify(rows);
    const mine=state.snapshot?.members?.find(member=>member.id===meId());
    if(!force&&JSON.stringify(top10(mine))===sig){state.lastPublished=sig;return true;}
    if(!force&&state.lastPublished===sig)return true;
    try{
      const {data,error}=await client.rpc('app_profile_set_top_ten',{p_member_token:memberToken,p_top_ten:rows});
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'Top 10 could not be published.');
      state.lastPublished=sig;
      updateOwn(rows);
      scheduleDirectory(0);
      if(state.modal)renderModal();
      window.dispatchEvent(new CustomEvent('octagon-hq:top-ten-published',{detail:data}));
      return true;
    }catch(_error){return false;}
  }

  function scheduleSync(delay=260){
    clearTimeout(state.syncTimer);
    state.syncTimer=setTimeout(()=>syncTop10(),delay);
  }

  function close(){
    state.modal?.remove();
    state.modal=null;
    document.body.classList.remove('community-profile-open');
  }

  function openTop10(){
    close();
    window.UFC_APP_SHELL?.activateDestination?.('play')||window.UFC_PRODUCT_ARCHITECTURE?.activateDestination?.('play');
    setTimeout(()=>window.UFC_PLAY_HUB?.openGame?.('top10'),100);
  }

  function saveTarget(member){
    try{localStorage.setItem(TARGET,JSON.stringify({id:member.id,name:member.display_name,createdAt:Date.now()}));}catch(_error){}
  }

  function target(){
    try{const value=parse(localStorage.getItem(TARGET),null);return value?.id&&Date.now()-num(value.createdAt)<86400000?value:null;}catch(_error){return null;}
  }

  function clearTarget(){
    try{localStorage.removeItem(TARGET);}catch(_error){}
    document.querySelector('[data-community-challenge-banner]')?.remove();
  }

  function ensureChallengeBanner(){
    const chosen=target();
    const hub=document.getElementById('playHub');
    if(!hub)return false;
    let node=hub.querySelector('[data-community-challenge-banner]');
    if(!chosen){node?.remove();return true;}
    const sig=`${chosen.id}:${chosen.name}`;
    if(node?.dataset.signature===sig)return true;
    const html=`<section class="community-challenge-banner" data-community-challenge-banner data-signature="${esc(sig)}"><div><span>DIRECT CHALLENGE TARGET</span><strong>Challenge ${esc(chosen.name)}</strong><small>Finish Find the Leader, then Challenge Someone. ${esc(chosen.name)} will already be selected.</small></div><button type="button" data-community-start-challenge>PLAY FIND THE LEADER</button></section>`;
    if(node)node.outerHTML=html;
    else hub.insertAdjacentHTML('afterbegin',html);
    return true;
  }

  function challenge(member){
    saveTarget(member);
    close();
    window.UFC_APP_SHELL?.activateDestination?.('play')||window.UFC_PRODUCT_ARCHITECTURE?.activateDestination?.('play');
    setTimeout(()=>{window.UFC_PLAY_HUB?.showHub?.();ensureChallengeBanner();},90);
  }

  function metric(label,value,copy){
    return`<div class="community-profile-metric"><span>${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(copy)}</small></div>`;
  }

  function activityCard(kicker,title,aside,metrics){
    return`<article class="community-profile-card"><header class="community-profile-card-head"><div><span>${esc(kicker)}</span><strong>${esc(title)}</strong></div><small>${esc(aside)}</small></header><div class="community-profile-metrics">${metrics.join('')}</div></article>`;
  }

  function achievementsMarkup(member,memberStats){
    const rows=achievements(member,memberStats);
    return`<article class="community-profile-card wide"><header class="community-profile-card-head"><div><span>ACHIEVEMENTS</span><strong>Octagon HQ résumé</strong></div><small>${rows.filter(row=>row.unlocked).length}/${rows.length} unlocked</small></header><div class="community-achievements">${rows.map(row=>`<div class="community-achievement${row.unlocked?'':' locked'}"><i>${row.icon}</i><div><strong>${esc(row.title)}</strong><small>${esc(row.copy)}</small></div></div>`).join('')}</div></article>`;
  }

  function renderModal(){
    const panel=state.modal?.querySelector('[data-community-profile-panel]');
    if(!panel)return;
    const member=allMembers().find(item=>item.id===panel.dataset.memberId);
    if(!member)return;
    const memberStats=stats(member);
    const own=member.id===meId();
    const unlocked=achievements(member,memberStats).filter(row=>row.unlocked).length;
    panel.innerHTML=`
      <header class="community-profile-head" data-member-name="${esc(member.display_name)}">
        ${avatar(member,'large')}
        <div class="community-profile-title"><span>OCTAGON HQ PROFILE · GOAT26</span><strong>${esc(member.display_name)}</strong><small>${member.is_admin?'Administrator · ':''}${timeAgo(member.last_active_at)}</small></div>
        <button type="button" class="community-profile-close" aria-label="Close member profile" data-community-close>×</button>
      </header>
      <div class="community-profile-body">
        <section class="community-profile-summary">
          <article><span>PICKS RECORD</span><strong>${memberStats.made?`${memberStats.correct}-${memberStats.losses}`:'—'}</strong><small>${memberStats.made?`${memberStats.accuracy}% correct`:'No graded picks'}</small></article>
          <article><span>SEASON RANK</span><strong>${memberStats.rank}</strong><small>${memberStats.points} points</small></article>
          <article><span>CHALLENGES</span><strong>${memberStats.challenges}</strong><small>${memberStats.sent} sent · ${memberStats.received} received</small></article>
          <article><span>ACHIEVEMENTS</span><strong>${unlocked}</strong><small>of 8 unlocked</small></article>
        </section>
        <section class="community-profile-grid">
          ${activityCard('UFC PICKS','Season Activity',`${memberStats.eventsPlayed} event${memberStats.eventsPlayed===1?'':'s'}`,[
            metric('POINTS',memberStats.points,'Total'),
            metric('ACCURACY',`${memberStats.accuracy}%`,`${memberStats.correct}/${memberStats.made||0}`),
            metric('EVENT WINS',memberStats.eventWins,'First-place finishes')
          ])}
          ${activityCard('PLAY','Games & Challenges',`${memberStats.dailyDays} daily day${memberStats.dailyDays===1?'':'s'}`,[
            metric('CHALLENGES',memberStats.challenges,'Completed'),
            metric('PERFECT 10s',memberStats.perfect,'Find the Leader'),
            metric('DAILY DAYS',memberStats.dailyDays,'Completed')
          ])}
          ${activityCard('THE WAR ROOM','Participation','Shared discussion',[
            metric('POSTS',memberStats.warPosts,'Top-level takes'),
            metric('REPLIES',memberStats.warReplies,'Conversation'),
            metric('TOTAL',memberStats.warTotal,'Messages')
          ])}
          ${achievementsMarkup(member,memberStats)}
          <article class="community-profile-card wide community-top-ten-card"><header class="community-profile-card-head"><div><span>PERSONAL RANKINGS</span><strong>${esc(member.display_name)}’s UFC Top 10</strong></div><small>${top10(member).length===10?'Published':'Not published yet'}</small></header>${top10Markup(member)}</article>
        </section>
        <footer class="community-profile-actions">${own?'<button type="button" data-community-edit-profile>EDIT PROFILE</button><button type="button" class="primary" data-community-edit-top10>EDIT TOP 10</button>':`<button type="button" data-community-close>BACK</button><button type="button" class="primary" data-community-challenge="${esc(member.id)}">CHALLENGE ${esc(member.display_name.toUpperCase())}</button>`}</footer>
      </div>`;
  }

  async function openMember(id){
    if(!state.snapshot)await load();
    const member=allMembers().find(item=>item.id===id);
    if(!member)return false;
    close();
    const overlay=document.createElement('div');
    overlay.className='community-profile-overlay';
    overlay.innerHTML=`<section class="community-profile-panel" data-community-profile-panel data-member-id="${esc(member.id)}" role="dialog" aria-modal="true" aria-label="${esc(member.display_name)} profile"></section>`;
    document.body.appendChild(overlay);
    document.body.classList.add('community-profile-open');
    state.modal=overlay;
    renderModal();
    if(!window.UFC_PICKS_SEASON_LOOP?.data){
      window.UFC_PICKS_SEASON_LOOP?.refresh?.().then(()=>{scheduleDirectory(0);if(state.modal)renderModal();}).catch(()=>null);
    }
    return true;
  }

  function wrapChallenges(){
    const api=window.UFC_PROFILE_CHALLENGES;
    if(!api||state.wrapped||api.__communityTargetWrapped||!api.openSendModal)return false;
    const original=api.openSendModal.bind(api);
    api.openSendModal=async payload=>{
      const opened=await original(payload);
      const chosen=target();
      if(opened&&chosen)setTimeout(()=>document.querySelector(`[data-challenge-member="${chosen.id}"]`)?.click(),60);
      return opened;
    };
    api.__communityTargetWrapped=true;
    state.wrapped=true;
    return true;
  }

  function bind(){
    document.addEventListener('click',event=>{
      const memberButton=event.target.closest?.('[data-community-member]');
      if(memberButton){openMember(memberButton.dataset.communityMember);return;}
      const friend=event.target.closest?.('.app-profile-friend[data-member-name]');
      if(friend){const member=allMembers().find(item=>norm(item.display_name)===norm(friend.dataset.memberName));if(member){event.preventDefault();openMember(member.id);}return;}
      if(event.target.closest?.('[data-community-open-self]')){if(meId())openMember(meId());return;}
      if(event.target.closest?.('[data-community-build-top10],[data-community-edit-top10]')){openTop10();return;}
      if(event.target.closest?.('[data-community-edit-profile]')){close();window.UFC_APP_PROFILE?.open?.();return;}
      const challengeButton=event.target.closest?.('[data-community-challenge]');
      if(challengeButton){const member=allMembers().find(item=>item.id===challengeButton.dataset.communityChallenge);if(member)challenge(member);return;}
      if(event.target.closest?.('[data-community-close]')){close();return;}
      if(event.target.closest?.('[data-community-start-challenge]')){window.UFC_PLAY_HUB?.openGame?.('find-leader',{daily:false});return;}
      if(event.target.closest?.('#playTop10List,#playFighterResults,[data-move],[data-remove-fighter],#playResetTop10Btn'))scheduleSync();
    });
    window.addEventListener('octagon-hq:view-change',event=>{
      if(event.detail?.destination==='home'){scheduleDirectory();load();}
      if(event.detail?.destination==='play')setTimeout(ensureChallengeBanner,80);
    });
    ['ufc-play-profile-ready','ufc-app-profile-updated'].forEach(name=>window.addEventListener(name,event=>{state.identity=event.detail?.identity||event.detail||state.identity;state.snapshot=null;load(true);}));
    window.addEventListener('ufc-picks-season-updated',()=>{scheduleDirectory();if(state.modal)renderModal();});
    window.addEventListener('ufc-profile-challenge-sent',clearTarget);
    window.addEventListener('storage',event=>{if(event.key===TOP10)scheduleSync(80);});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&state.modal)close();});
    document.addEventListener('click',event=>{if(event.target===state.modal)close();});
  }

  function start(){
    bind();
    scheduleDirectory(80);
    load();
    wrapChallenges();
    const root=document.getElementById('home')||document.body;
    state.observer=new MutationObserver(()=>scheduleDirectory(80));
    state.observer.observe(root,{childList:true,subtree:true});
    let attempts=0;
    const timer=setInterval(()=>{attempts+=1;wrapChallenges();ensureDirectory();if(attempts>=20)clearInterval(timer);},250);
    document.documentElement.setAttribute('data-community-profiles',VERSION);
  }

  window.UFC_COMMUNITY_PROFILES={version:VERSION,load,refresh:()=>load(true),openMember,close,syncTop10,target,clearTarget};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
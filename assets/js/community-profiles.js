(function(){
  'use strict';

  if(window.__UFC_COMMUNITY_PROFILES_STARTED__)return;
  window.__UFC_COMMUNITY_PROFILES_STARTED__=true;

  const VERSION='community-profiles-20260720b-passive-identity-consumer';
  const TOP10_KEY='ufc-goat-play-top10-v1';
  const TARGET_KEY='octagon-hq:challenge-target-v2';
  const CANONICAL_CODE='GOAT26';
  const REFRESH_AGE_MS=30000;
  const state={
    identity:null,
    snapshot:null,
    loading:null,
    overlay:null,
    top10Editor:null,
    top10Rows:[],
    top10Query:'',
    top10ReturnToProfile:false,
    lastLoadedAt:0,
    lastDirectorySignature:'',
    lastProfileSignature:'',
    lastPublished:'',
    bound:false,
    challengeWrapped:false
  };

  const text=value=>String(value??'').trim();
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const norm=value=>text(value).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const tokenFor=identity=>text(identity?.memberToken||identity?.member_token);
  const client=()=>window.UFC_PLAY_PROFILE?.client||null;

  function parse(value,fallback=null){try{return JSON.parse(value);}catch(_error){return fallback;}}
  function localTop10(){
    try{
      const rows=parse(localStorage.getItem(TOP10_KEY),[]);
      return Array.isArray(rows)?rows.map(text).filter(Boolean).slice(0,10):[];
    }catch(_error){return[];}
  }
  function storeLocalTop10(rows){try{localStorage.setItem(TOP10_KEY,JSON.stringify(rows));}catch(_error){}}
  function identityMemberId(identity=state.identity){return identity?.member?.id||'';}
  function currentMemberId(){return state.snapshot?.me_id||identityMemberId()||window.UFC_APP_PROFILE?.group?.me?.id||'';}
  function fallbackMembers(){return Array.isArray(window.UFC_APP_PROFILE?.group?.members)?window.UFC_APP_PROFILE.group.members:[];}
  function members(){
    const rows=state.snapshot?.members?.length?state.snapshot.members:fallbackMembers();
    const me=currentMemberId();
    return [...rows].sort((a,b)=>a.id===me?-1:b.id===me?1:text(a.display_name).localeCompare(text(b.display_name)));
  }
  function avatar(member,kind='friend'){
    return window.UFC_APP_PROFILE?.avatarMarkup?.(member,kind)
      ||`<span class="app-profile-avatar ${esc(kind)}"><span>${esc(text(member?.display_name).slice(0,2).toUpperCase()||'UFC')}</span></span>`;
  }
  function top10(member){return Array.isArray(member?.top_ten)?member.top_ten.map(text).filter(Boolean).slice(0,10):[];}
  function picksRows(){return window.UFC_PICKS_SEASON_LOOP?.data?.group?.members||[];}
  function picksFor(member){
    return picksRows().find(row=>row.id===member?.id)
      ||picksRows().find(row=>norm(row.display_name)===norm(member?.display_name))
      ||{};
  }
  function picksRank(member){
    const rows=picksRows();
    const row=picksFor(member);
    if(!row?.id&&!row?.display_name)return'—';
    const key=item=>[
      num(item?.points??item?.score),
      num(item?.event_wins),
      num(item?.correct),
      num(item?.picks_made??item?.picks_count)
    ].join('|');
    const index=rows.findIndex(item=>key(item)===key(row));
    if(index<0)return'—';
    return`${rows.filter(item=>key(item)===key(row)).length>1?'T-':'#'}${index+1}`;
  }
  function stats(member){
    const picks=picksFor(member);
    const made=num(picks.picks_made??picks.picks_count);
    const correct=num(picks.correct);
    const challenges=member.challenge_stats||{};
    const war=member.war_stats||{};
    const daily=member.daily_stats||{};
    return{
      made,
      correct,
      losses:Math.max(0,made-correct),
      accuracy:made?Math.round(correct/made*100):0,
      points:num(picks.points??picks.score),
      eventWins:num(picks.event_wins),
      rank:picksRank(member),
      challenges:num(challenges.completed),
      sent:num(challenges.sent),
      received:num(challenges.received),
      posts:num(war.posts),
      replies:num(war.replies),
      dailyDays:num(daily.days),
      perfect:num(daily.perfect_tens)
    };
  }
  function relativeTime(value){
    const time=new Date(value).getTime();
    if(!Number.isFinite(time)||time<=0)return'No recent activity';
    const minutes=Math.max(0,Math.round((Date.now()-time)/60000));
    if(minutes<1)return'Active just now';
    if(minutes<60)return`Active ${minutes}m ago`;
    const hours=Math.floor(minutes/60);
    if(hours<24)return`Active ${hours}h ago`;
    const days=Math.floor(hours/24);
    return days<7?`Active ${days}d ago`:new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric'}).format(new Date(value));
  }

  function ensureMount(){
    const home=document.getElementById('home');
    const dashboard=document.getElementById('homeDashboardMount');
    if(!home||!dashboard)return null;
    let mount=home.querySelector('#communityProfilesMount');
    if(!mount){
      mount=document.createElement('div');
      mount.id='communityProfilesMount';
      mount.className='community-profiles-mount';
      dashboard.after(mount);
    }
    return mount;
  }
  function memberSignature(member){
    const value=stats(member);
    return[
      member.id,
      member.display_name,
      member.profile_updated_at,
      member.top_ten_updated_at,
      member.last_active_at,
      member.profile_photo_data,
      member.fighter_avatar_slug,
      top10(member),
      value.rank,
      value.points,
      value.correct,
      value.made,
      value.eventWins,
      value.challenges,
      value.sent,
      value.received,
      value.posts,
      value.replies,
      value.dailyDays,
      value.perfect
    ];
  }
  function directorySignature(rows){return JSON.stringify(rows.map(memberSignature));}
  function directoryCard(member){
    const value=stats(member);
    const own=member.id===currentMemberId();
    const ready=top10(member).length===10;
    return`<button type="button" class="community-member-card${own?' me':''}" data-community-member="${esc(member.id)}">${avatar(member)}<span class="community-member-main"><span class="community-member-name">${esc(member.display_name)}${own?' <em>YOU</em>':''}</span><span class="community-member-active">${esc(relativeTime(member.last_active_at||member.profile_updated_at))}</span><span class="community-member-pills"><b>${value.rank==='—'?'Picks —':`${value.rank} Picks`}</b><b>${value.challenges} challenge${value.challenges===1?'':'s'}</b><b class="${ready?'complete':'missing'}">${ready?'Top 10 ready':'Top 10 needed'}</b></span></span><span class="community-member-arrow" aria-hidden="true">›</span></button>`;
  }
  function renderDirectory(){
    const mount=ensureMount();
    if(!mount)return false;
    const rows=members();
    const mine=rows.find(member=>member.id===currentMemberId());
    const signature=directorySignature(rows);
    if(signature===state.lastDirectorySignature&&mount.firstElementChild)return true;
    const wasOpen=Boolean(mount.querySelector('.community-directory')?.open);
    state.lastDirectorySignature=signature;
    const top10Label=mine&&top10(mine).length===10?'EDIT YOUR TOP 10':'BUILD YOUR TOP 10';
    mount.innerHTML=`<details class="home-dashboard-card community-directory"${wasOpen?' open':''}><summary class="community-directory-summary"><div><span>OCTAGON HQ COMMUNITY</span><strong>Member Profiles</strong></div><div class="community-directory-summary-meta"><b>${rows.length} PROFILE${rows.length===1?'':'S'}</b><i aria-hidden="true">⌄</i></div></summary><div class="community-directory-body"><div class="community-directory-intro"><small>Open a profile to see Picks, Play, War Room activity, achievements, and personal rankings.</small><div class="community-directory-actions">${mine?`<button type="button" class="community-directory-action primary" data-community-build-top10>${top10Label}</button><button type="button" class="community-directory-action" data-community-open-self>OPEN YOUR PROFILE</button>`:''}</div></div>${rows.length?`<div class="community-member-grid">${rows.map(directoryCard).join('')}</div>`:'<div class="community-directory-empty">Member profiles will appear after your GOAT26 profile loads.</div>'}</div></details>`;
    return true;
  }

  function cachedIdentity(){
    const identity=state.identity||window.UFC_PLAY_PROFILE?.identity||window.UFC_APP_PROFILE?.identity||null;
    if(identity)acceptIdentity(identity);
    return state.identity;
  }
  async function load(force=false){
    if(state.loading)return state.loading;
    if(!force&&state.snapshot&&Date.now()-state.lastLoadedAt<REFRESH_AGE_MS){
      renderDirectory();
      renderProfile();
      return state.snapshot;
    }
    if(!state.snapshot)renderDirectory();
    state.loading=(async()=>{
      const identity=cachedIdentity();
      const rpc=client();
      const token=tokenFor(identity);
      if(!identity||!rpc||!token)return null;
      try{
        const{data,error}=await rpc.rpc('app_profile_community_snapshot',{p_member_token:token});
        if(error)throw error;
        if(!data?.ok)throw new Error(data?.error||'Community profiles unavailable.');
        state.snapshot=data;
        state.lastLoadedAt=Date.now();
        renderDirectory();
        renderProfile();
        window.dispatchEvent(new CustomEvent('octagon-hq:community-updated',{detail:data}));
        return data;
      }catch(_error){return null;}
    })().finally(()=>{state.loading=null;});
    return state.loading;
  }

  function fighterRecord(name){
    const direct=window.UFC_PLAY_DATA?.resolve?.(name)||window.UFC_PLAY_DATA?.byName?.[name]||null;
    if(direct)return direct;
    const row=[...(window.RANKING_DATA?.men||[]),...(window.RANKING_DATA?.women||[])].find(item=>text(item?.fighter||item?.name)===name);
    return row?{name:row.fighter||row.name,id:row.id||norm(row.fighter||row.name).replace(/ /g,'-')}:null;
  }
  function fighterThumb(name){
    const fighter=fighterRecord(name)||{};
    const override=window.DISPLAY_OVERRIDES?.[name]||{};
    return text(fighter.thumbUrl||fighter.photoUrl||fighter.thumb||fighter.photo||override.thumbUrl||override.photoUrl||override.thumb||override.photo);
  }
  function top10Roster(query=''){
    const needle=norm(query);
    const fromPlay=window.UFC_PLAY_DATA?.search?.(query,{limit:120,filters:{}})||[];
    const rows=fromPlay.length?fromPlay:[...(window.RANKING_DATA?.men||[]),...(window.RANKING_DATA?.women||[])].map(row=>({name:row.fighter||row.name,id:row.id}));
    const seen=new Set();
    return rows.map(row=>({name:text(row?.name||row?.fighter),id:text(row?.id)})).filter(row=>row.name).filter(row=>{
      const key=norm(row.name);
      if(seen.has(key)||(!key.includes(needle)&&needle))return false;
      seen.add(key);
      return true;
    });
  }
  function top10Markup(member){
    const rows=top10(member);
    if(rows.length!==10)return'<div class="community-top-ten-empty">This member has not published a UFC Top 10 yet.</div>';
    return`<div class="community-top-ten-list">${rows.map((name,index)=>{
      const photo=fighterThumb(name);
      return`<div class="community-top-ten-row"><b>#${index+1}</b><span class="community-top-ten-photo">${photo?`<img src="${esc(photo)}" alt="${esc(name)}">`:esc(name.slice(0,2).toUpperCase())}</span><strong>${esc(name)}</strong></div>`;
    }).join('')}</div>`;
  }
  function metric(label,value,copy){return`<div class="community-profile-metric"><span>${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(copy)}</small></div>`;}
  function activityCard(kicker,title,aside,metrics){return`<article class="community-profile-card"><header class="community-profile-card-head"><div><span>${esc(kicker)}</span><strong>${esc(title)}</strong></div><small>${esc(aside)}</small></header><div class="community-profile-metrics">${metrics.join('')}</div></article>`;}
  function achievements(member,value){
    const rows=[
      {title:'Profile Ready',copy:'Shared Octagon HQ identity.',unlocked:Boolean(member.profile_photo_data||member.fighter_avatar_slug)},
      {title:'Perfect 10',copy:'Scored 10/10 in Find the Leader.',unlocked:value.perfect>0},
      {title:'Daily Regular',copy:'Completed three daily challenges.',unlocked:value.dailyDays>=3},
      {title:'Picks Player',copy:'Has graded UFC Picks.',unlocked:value.made>0},
      {title:'Event Champion',copy:'Finished first in a Picks event.',unlocked:value.eventWins>0},
      {title:'War Room Voice',copy:'Posted or replied in The War Room.',unlocked:value.posts+value.replies>0},
      {title:'Challenge Competitor',copy:'Completed a direct challenge.',unlocked:value.challenges>0},
      {title:'Top 10 Published',copy:'Shared a personal UFC Top 10.',unlocked:top10(member).length===10}
    ];
    return`<article class="community-profile-card wide"><header class="community-profile-card-head"><div><span>ACHIEVEMENTS</span><strong>Octagon HQ résumé</strong></div><small>${rows.filter(row=>row.unlocked).length}/${rows.length} unlocked</small></header><div class="community-achievements">${rows.map(row=>`<div class="community-achievement${row.unlocked?'':' locked'}"><i>${row.unlocked?'✓':'·'}</i><div><strong>${esc(row.title)}</strong><small>${esc(row.copy)}</small></div></div>`).join('')}</div></article>`;
  }
  function recentActivity(member,value){
    const items=[];
    if(value.dailyDays)items.push(`Completed ${value.dailyDays} daily challenge${value.dailyDays===1?'':'s'}`);
    if(value.challenges)items.push(`Finished ${value.challenges} direct challenge${value.challenges===1?'':'s'}`);
    if(value.posts||value.replies)items.push(`${value.posts+value.replies} War Room message${value.posts+value.replies===1?'':'s'}`);
    if(value.made)items.push(`${value.correct}-${value.losses} UFC Picks record`);
    return`<article class="community-profile-card wide"><header class="community-profile-card-head"><div><span>RECENT ACTIVITY</span><strong>Across Octagon HQ</strong></div><small>${esc(relativeTime(member.last_active_at||member.profile_updated_at))}</small></header><div class="community-recent-list">${items.length?items.map(item=>`<div><span>•</span><strong>${esc(item)}</strong></div>`).join(''):'<div><span>•</span><strong>No shared activity yet.</strong></div>'}</div></article>`;
  }

  function closeProfile(){
    state.overlay?.remove();
    state.overlay=null;
    state.lastProfileSignature='';
    document.body.classList.remove('community-profile-open');
  }
  function renderProfile(){
    const panel=state.overlay?.querySelector('[data-community-profile-panel]');
    if(!panel)return false;
    const member=members().find(item=>item.id===panel.dataset.memberId);
    if(!member)return false;
    const value=stats(member);
    const own=member.id===currentMemberId();
    const signature=JSON.stringify(memberSignature(member));
    if(signature===state.lastProfileSignature&&panel.firstElementChild)return true;
    state.lastProfileSignature=signature;
    panel.innerHTML=`<header class="community-profile-head">${avatar(member,'large')}<div class="community-profile-title"><span>OCTAGON HQ PROFILE · GOAT26</span><strong>${esc(member.display_name)}</strong><small>${member.is_admin?'Administrator · ':''}${esc(relativeTime(member.last_active_at||member.profile_updated_at))}</small></div><button type="button" class="community-profile-close" aria-label="Close member profile" data-community-close>×</button></header><div class="community-profile-body"><section class="community-profile-summary"><article><span>PICKS RECORD</span><strong>${value.made?`${value.correct}-${value.losses}`:'—'}</strong><small>${value.made?`${value.accuracy}% correct`:'No graded picks'}</small></article><article><span>SEASON RANK</span><strong>${value.rank}</strong><small>${value.points} points</small></article><article><span>CHALLENGES</span><strong>${value.challenges}</strong><small>${value.sent} sent · ${value.received} received</small></article><article><span>ACHIEVEMENTS</span><strong>${[Boolean(member.profile_photo_data||member.fighter_avatar_slug),value.perfect>0,value.dailyDays>=3,value.made>0,value.eventWins>0,value.posts+value.replies>0,value.challenges>0,top10(member).length===10].filter(Boolean).length}</strong><small>of 8 unlocked</small></article></section><section class="community-profile-grid">${activityCard('UFC PICKS','Season Activity',value.rank,[metric('POINTS',value.points,'Total'),metric('ACCURACY',`${value.accuracy}%`,`${value.correct}/${value.made||0}`),metric('EVENT WINS',value.eventWins,'First-place finishes')])}${activityCard('PLAY','Games & Challenges',`${value.dailyDays} daily day${value.dailyDays===1?'':'s'}`,[metric('CHALLENGES',value.challenges,'Completed'),metric('PERFECT 10s',value.perfect,'Find the Leader'),metric('DAILY DAYS',value.dailyDays,'Completed')])}${activityCard('THE WAR ROOM','Participation','Shared discussion',[metric('POSTS',value.posts,'Top-level takes'),metric('REPLIES',value.replies,'Conversation'),metric('TOTAL',value.posts+value.replies,'Messages')])}${achievements(member,value)}${recentActivity(member,value)}<article class="community-profile-card wide community-top-ten-card"><header class="community-profile-card-head"><div><span>PERSONAL RANKINGS</span><strong>${esc(member.display_name)}’s UFC Top 10</strong></div><small>${top10(member).length===10?'Published':'Not published yet'}</small></header>${top10Markup(member)}</article></section><footer class="community-profile-actions">${own?'<button type="button" data-community-edit-profile>EDIT PROFILE</button><button type="button" class="primary" data-community-build-top10>EDIT TOP 10</button>':`<button type="button" data-community-close>BACK</button><button type="button" class="primary" data-community-challenge="${esc(member.id)}">CHALLENGE ${esc(member.display_name.toUpperCase())}</button>`}</footer></div>`;
    return true;
  }
  async function openMember(id){
    if(!state.snapshot)await load();
    const member=members().find(item=>item.id===id);
    if(!member)return false;
    closeProfile();
    const overlay=document.createElement('div');
    overlay.className='community-profile-overlay';
    overlay.innerHTML=`<section class="community-profile-panel" data-community-profile-panel data-member-id="${esc(member.id)}" role="dialog" aria-modal="true" aria-label="${esc(member.display_name)} profile"></section>`;
    document.body.appendChild(overlay);
    document.body.classList.add('community-profile-open');
    state.overlay=overlay;
    state.lastProfileSignature='';
    renderProfile();
    if(!window.UFC_PICKS_SEASON_LOOP?.data){
      window.UFC_PICKS_SEASON_LOOP?.refresh?.().then(()=>renderProfile()).catch(()=>null);
    }
    return true;
  }

  function closeTop10Editor(){
    state.top10Editor?.remove();
    state.top10Editor=null;
    state.top10Rows=[];
    state.top10Query='';
    document.body.classList.remove('community-top10-open');
  }
  function top10SelectedMarkup(){
    if(!state.top10Rows.length)return'<div class="community-top10-empty">Add ten fighters to build your personal UFC Top 10.</div>';
    return state.top10Rows.map((name,index)=>{
      const photo=fighterThumb(name);
      return`<div class="community-top10-selected-row" data-top10-selected="${esc(name)}"><b>#${index+1}</b><span>${photo?`<img src="${esc(photo)}" alt="${esc(name)}">`:esc(name.slice(0,2).toUpperCase())}</span><strong>${esc(name)}</strong><div><button type="button" data-top10-move="up" aria-label="Move ${esc(name)} up"${index===0?' disabled':''}>↑</button><button type="button" data-top10-move="down" aria-label="Move ${esc(name)} down"${index===state.top10Rows.length-1?' disabled':''}>↓</button><button type="button" data-top10-remove aria-label="Remove ${esc(name)}">×</button></div></div>`;
    }).join('');
  }
  function top10SearchMarkup(){
    const chosen=new Set(state.top10Rows.map(norm));
    const rows=top10Roster(state.top10Query).filter(row=>!chosen.has(norm(row.name))).slice(0,36);
    if(!rows.length)return'<div class="community-top10-empty">No available fighters match that search.</div>';
    return rows.map(row=>{
      const photo=fighterThumb(row.name);
      return`<button type="button" class="community-top10-result" data-top10-add="${esc(row.name)}"${state.top10Rows.length>=10?' disabled':''}><span>${photo?`<img src="${esc(photo)}" alt="${esc(row.name)}">`:esc(row.name.slice(0,2).toUpperCase())}</span><strong>${esc(row.name)}</strong><b>+</b></button>`;
    }).join('');
  }
  function renderTop10Editor(){
    const panel=state.top10Editor?.querySelector('[data-community-top10-panel]');
    if(!panel)return false;
    panel.innerHTML=`<header class="community-top10-head"><div><span>PERSONAL RANKINGS</span><strong>Your UFC Top 10</strong><small>This saves directly to your Octagon HQ profile. It is not tied to a game.</small></div><button type="button" data-top10-close aria-label="Close Top 10 editor">×</button></header><div class="community-top10-body"><section class="community-top10-picked"><div class="community-top10-section-head"><strong>YOUR ORDER</strong><b>${state.top10Rows.length}/10</b></div><div class="community-top10-selected-list">${top10SelectedMarkup()}</div></section><section class="community-top10-add"><div class="community-top10-section-head"><strong>ADD FIGHTERS</strong><small>Search the UFC roster</small></div><input type="search" value="${esc(state.top10Query)}" placeholder="Search fighter…" autocomplete="off" data-top10-search><div class="community-top10-results">${top10SearchMarkup()}</div></section></div><footer class="community-top10-footer"><button type="button" data-top10-close>CANCEL</button><span data-top10-status>${state.top10Rows.length===10?'Ready to publish':'Choose exactly ten fighters'}</span><button type="button" class="primary" data-top10-save${state.top10Rows.length===10?'':' disabled'}>SAVE TOP 10</button></footer>`;
    panel.querySelector('[data-top10-search]')?.focus();
    return true;
  }
  async function openTop10(){
    let identity=cachedIdentity();
    if(!identity){
      identity=await window.UFC_PLAY_PROFILE?.require?.({title:'Sign in to edit your Top 10',description:'Use your Octagon HQ profile once. Picks and every other profile feature will use the same sign-in.'});
      if(!identity)return false;
      acceptIdentity(identity);
      await load(true);
    }
    const mine=members().find(member=>member.id===currentMemberId());
    if(!mine)return false;
    state.top10ReturnToProfile=Boolean(state.overlay);
    closeProfile();
    closeTop10Editor();
    state.top10Rows=(top10(mine).length?top10(mine):localTop10()).slice(0,10);
    const editor=document.createElement('div');
    editor.className='community-top10-overlay';
    editor.innerHTML='<section class="community-top10-panel" data-community-top10-panel role="dialog" aria-modal="true" aria-label="Edit your UFC Top 10"></section>';
    document.body.appendChild(editor);
    document.body.classList.add('community-top10-open');
    state.top10Editor=editor;
    renderTop10Editor();
    return true;
  }

  function saveChallengeTarget(member){
    try{localStorage.setItem(TARGET_KEY,JSON.stringify({id:member.id,name:member.display_name,createdAt:Date.now()}));}catch(_error){}
  }
  function challengeTarget(){
    try{
      const value=parse(localStorage.getItem(TARGET_KEY),null);
      return value?.id&&Date.now()-num(value.createdAt)<86400000?value:null;
    }catch(_error){return null;}
  }
  function clearChallengeTarget(){try{localStorage.removeItem(TARGET_KEY);}catch(_error){}}
  function challengeMember(member){
    saveChallengeTarget(member);
    closeProfile();
    window.UFC_APP_SHELL?.activateDestination?.('play')||window.UFC_PRODUCT_ARCHITECTURE?.activateDestination?.('play');
    window.UFC_PLAY_HUB?.showHub?.();
  }
  function wrapChallengePicker(){
    const api=window.UFC_PROFILE_CHALLENGES;
    if(!api?.openSendModal||state.challengeWrapped||api.__communityCleanWrapped)return false;
    const original=api.openSendModal.bind(api);
    api.openSendModal=async payload=>{
      const opened=await original(payload);
      const target=challengeTarget();
      if(opened&&target?.id)requestAnimationFrame(()=>document.querySelector(`[data-challenge-member="${target.id}"]`)?.click());
      return opened;
    };
    api.__communityCleanWrapped=true;
    state.challengeWrapped=true;
    return true;
  }

  async function publishTop10(clear=false,explicitRows=null){
    const rows=clear?[]:(Array.isArray(explicitRows)?explicitRows:localTop10()).map(text).filter(Boolean).slice(0,10);
    if(!clear&&(rows.length!==10||new Set(rows.map(norm)).size!==10))return false;
    const signature=JSON.stringify(rows);
    if(signature===state.lastPublished)return true;
    const identity=cachedIdentity();
    const rpc=client();
    const token=tokenFor(identity);
    if(!rpc||!token)return false;
    try{
      const{data,error}=await rpc.rpc('app_profile_set_top_ten',{p_member_token:token,p_top_ten:rows});
      if(error)throw error;
      if(!data?.ok)throw new Error(data?.error||'Top 10 could not be published.');
      state.lastPublished=signature;
      storeLocalTop10(rows);
      const mine=state.snapshot?.members?.find(member=>member.id===currentMemberId());
      if(mine){
        mine.top_ten=[...rows];
        mine.top_ten_updated_at=data.top_ten_updated_at||null;
      }
      state.lastDirectorySignature='';
      renderDirectory();
      renderProfile();
      window.dispatchEvent(new CustomEvent('octagon-hq:top-ten-published',{detail:data}));
      return true;
    }catch(_error){return false;}
  }

  function acceptIdentity(detail){
    const next=detail?.identity||detail||null;
    if(!next)return;
    const previousId=identityMemberId();
    const nextId=identityMemberId(next);
    state.identity=next;
    if(previousId&&nextId&&previousId!==nextId){
      state.snapshot=null;
      state.lastLoadedAt=0;
      state.lastDirectorySignature='';
      state.lastProfileSignature='';
    }
  }
  function bind(){
    if(state.bound)return;
    state.bound=true;
    document.addEventListener('click',event=>{
      const memberButton=event.target.closest?.('[data-community-member]');
      if(memberButton){openMember(memberButton.dataset.communityMember);return;}
      if(event.target.closest?.('[data-community-open-self]')){if(currentMemberId())openMember(currentMemberId());return;}
      if(event.target.closest?.('[data-community-build-top10]')){void openTop10();return;}
      if(event.target.closest?.('[data-community-edit-profile]')){closeProfile();window.UFC_APP_PROFILE?.open?.();return;}
      const challengeButton=event.target.closest?.('[data-community-challenge]');
      if(challengeButton){
        const member=members().find(item=>item.id===challengeButton.dataset.communityChallenge);
        if(member)challengeMember(member);
        return;
      }
      if(event.target.closest?.('[data-community-close]')){closeProfile();return;}
      if(event.target.closest?.('[data-top10-close]')){closeTop10Editor();return;}
      const addButton=event.target.closest?.('[data-top10-add]');
      if(addButton&&state.top10Rows.length<10){state.top10Rows.push(addButton.dataset.top10Add);renderTop10Editor();return;}
      const selected=event.target.closest?.('[data-top10-selected]');
      if(selected){
        const index=state.top10Rows.findIndex(name=>norm(name)===norm(selected.dataset.top10Selected));
        if(index<0)return;
        if(event.target.closest?.('[data-top10-remove]'))state.top10Rows.splice(index,1);
        else{
          const move=event.target.closest?.('[data-top10-move]')?.dataset.top10Move;
          const target=move==='up'?index-1:move==='down'?index+1:index;
          if(target>=0&&target<state.top10Rows.length&&target!==index)[state.top10Rows[index],state.top10Rows[target]]=[state.top10Rows[target],state.top10Rows[index]];
        }
        renderTop10Editor();
        return;
      }
      const saveButton=event.target.closest?.('[data-top10-save]');
      if(saveButton&&!saveButton.disabled){
        const status=state.top10Editor?.querySelector('[data-top10-status]');
        saveButton.disabled=true;
        saveButton.textContent='SAVING…';
        if(status)status.textContent='Publishing to your profile…';
        void publishTop10(false,state.top10Rows).then(saved=>{
          if(!saved){saveButton.disabled=false;saveButton.textContent='SAVE TOP 10';if(status)status.textContent='Could not save. Try again.';return;}
          if(status)status.textContent='Saved to your Octagon HQ profile.';
          const returnToProfile=state.top10ReturnToProfile;
          window.setTimeout(()=>{closeTop10Editor();if(returnToProfile)void openMember(currentMemberId());},450);
        });
        return;
      }
    });
    document.addEventListener('input',event=>{
      if(!event.target.matches?.('[data-top10-search]'))return;
      state.top10Query=event.target.value||'';
      const results=state.top10Editor?.querySelector('.community-top10-results');
      if(results)results.innerHTML=top10SearchMarkup();
    });
    window.addEventListener('octagon-hq:view-change',event=>{
      if(event.detail?.destination==='home'){
        renderDirectory();
        void load(false);
      }
      wrapChallengePicker();
    });
    window.addEventListener('ufc-picks-season-updated',()=>{
      renderDirectory();
      renderProfile();
    });
    window.addEventListener('ufc-app-profile-updated',event=>{
      acceptIdentity(event.detail);
      void load(true);
    });
    window.addEventListener('ufc-play-profile-ready',event=>{
      acceptIdentity(event.detail);
      void load(true);
    });
    window.addEventListener('ufc-profile-challenge-sent',clearChallengeTarget);
    window.addEventListener('octagon-hq:soft-refresh',()=>void load(true));
    document.addEventListener('keydown',event=>{
      if(event.key!=='Escape')return;
      if(state.top10Editor)closeTop10Editor();
      else if(state.overlay)closeProfile();
    });
    document.addEventListener('click',event=>{
      if(event.target===state.overlay)closeProfile();
      if(event.target===state.top10Editor)closeTop10Editor();
    });
  }
  function start(){
    bind();
    renderDirectory();
    wrapChallengePicker();
    acceptIdentity(window.UFC_PLAY_PROFILE?.identity||window.UFC_APP_PROFILE?.identity);
    if(state.identity&&document.getElementById('home')?.classList.contains('active-view'))void load(false);
    document.documentElement.dataset.communityProfiles=VERSION;
  }

  window.UFC_COMMUNITY_PROFILES={
    version:VERSION,
    load,
    refresh:()=>load(true),
    renderDirectory,
    openMember,
    openTop10,
    close:closeProfile,
    closeTop10Editor,
    publishTop10
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

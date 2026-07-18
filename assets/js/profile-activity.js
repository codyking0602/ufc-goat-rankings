(function(){
  'use strict';

  const VERSION='profile-activity-20260718a-phase-2a';
  const LEDGER_KEY='ufc-profile-activity-v1';
  const DAILY_PREFIX='ufc-play:daily-completion:find-leader:';
  const ROOM_PREFIX='ufc-picks:room:';
  const GAME_TITLES={
    'find-leader':'Find the Leader',
    'keep-cut':'Keep 4, Cut 4',
    'better-than':'Better Than…',
    'blind':'Blind Resume',
    'blind-resume':'Blind Resume',
    'blind-rank':'Blind Rank 5',
    'top10':'Build Your Top 10'
  };
  const state={overlay:null,identity:null,member:null,data:null,loading:false};

  const text=value=>String(value??'').trim();
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const number=value=>Number.isFinite(Number(value))?Number(value):0;
  const parseJson=(value,fallback=null)=>{try{return JSON.parse(value);}catch(_error){return fallback;}};
  const readLedger=()=>{try{const rows=parseJson(localStorage.getItem(LEDGER_KEY),[]);return Array.isArray(rows)?rows:[];}catch(_error){return[];}};
  const writeLedger=rows=>{try{localStorage.setItem(LEDGER_KEY,JSON.stringify(rows.slice(0,120)));}catch(_error){}};
  const centralDay=(date=new Date())=>{
    try{
      const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
      const map=Object.fromEntries(parts.map(part=>[part.type,part.value]));
      return `${map.year}-${map.month}-${map.day}`;
    }catch(_error){return date.toISOString().slice(0,10);}
  };
  const dayOffset=(day,offset)=>{
    const date=new Date(`${day}T12:00:00-06:00`);
    date.setDate(date.getDate()+offset);
    return centralDay(date);
  };
  const dateLabel=value=>{
    const date=new Date(value);
    if(Number.isNaN(date.getTime()))return'';
    return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:date.getFullYear()!==new Date().getFullYear()?'numeric':undefined}).format(date);
  };
  const timeAgo=value=>{
    const then=new Date(value).getTime();
    if(!Number.isFinite(then))return'';
    const minutes=Math.max(0,Math.round((Date.now()-then)/60000));
    if(minutes<1)return'Just now';
    if(minutes<60)return`${minutes}m ago`;
    const hours=Math.floor(minutes/60);
    if(hours<24)return`${hours}h ago`;
    const days=Math.floor(hours/24);
    if(days<7)return`${days}d ago`;
    return dateLabel(value);
  };

  function installStyles(){
    if(document.getElementById('profileActivityCss'))return;
    const style=document.createElement('style');
    style.id='profileActivityCss';
    style.textContent=`
      body.profile-activity-open{overflow:hidden}
      .profile-activity-overlay{position:fixed;inset:0;z-index:6100;display:grid;place-items:center;padding:18px;background:rgba(2,6,23,.88);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
      .profile-activity-panel{width:min(900px,100%);max-height:min(940px,94vh);overflow:auto;border:1px solid rgba(249,115,22,.62);border-radius:26px;background:linear-gradient(180deg,#1c293d,#0d1421);box-shadow:0 34px 120px rgba(0,0,0,.64);color:#f8fafc}
      .profile-activity-head{position:relative;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:16px;padding:20px;border-bottom:1px solid #33445f;background:radial-gradient(circle at 92% 0,rgba(249,115,22,.18),transparent 35%)}
      .profile-activity-head .app-profile-avatar{width:76px;height:76px;min-width:76px;font-size:21px}
      .profile-activity-title{min-width:0}.profile-activity-title span,.profile-activity-title strong,.profile-activity-title small{display:block}.profile-activity-title span{color:#fb923c;font:950 9px/1 system-ui;letter-spacing:.14em}.profile-activity-title strong{margin-top:7px;font:950 clamp(24px,5vw,34px)/1 system-ui;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.profile-activity-title small{margin-top:7px;color:#94a3b8;font:750 11px/1.35 system-ui}
      .profile-activity-head-actions{display:flex;align-items:center;gap:8px}.profile-activity-edit,.profile-activity-close{min-height:42px;border:1px solid #475569;border-radius:12px;background:#111827;color:#fff;padding:0 13px;cursor:pointer;font:950 10px/1 system-ui}.profile-activity-edit{border-color:#f97316;color:#fed7aa}.profile-activity-close{width:42px;padding:0;font-size:22px}
      .profile-activity-body{display:grid;gap:18px;padding:20px}.profile-activity-loading{min-height:360px;display:grid;place-items:center;color:#94a3b8;font:900 13px/1.3 system-ui;text-align:center}
      .profile-activity-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.profile-activity-stat{min-width:0;padding:16px;border:1px solid #33445f;border-radius:18px;background:#111a2a}.profile-activity-stat span,.profile-activity-stat strong,.profile-activity-stat small{display:block}.profile-activity-stat span{color:#94a3b8;font:900 9px/1 system-ui;letter-spacing:.1em}.profile-activity-stat strong{margin-top:9px;color:#fff;font:950 28px/1 system-ui}.profile-activity-stat small{margin-top:7px;color:#cbd5e1;font:700 10px/1.3 system-ui}
      .profile-activity-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.profile-activity-card{min-width:0;padding:17px;border:1px solid #33445f;border-radius:20px;background:#101827}.profile-activity-card.wide{grid-column:1/-1}.profile-activity-card-head{display:flex;align-items:start;justify-content:space-between;gap:12px;margin-bottom:14px}.profile-activity-card-head span,.profile-activity-card-head strong,.profile-activity-card-head small{display:block}.profile-activity-card-head span{color:#fb923c;font:950 9px/1 system-ui;letter-spacing:.12em}.profile-activity-card-head strong{margin-top:6px;font:950 18px/1 system-ui}.profile-activity-card-head small{color:#94a3b8;font:750 10px/1.3 system-ui;text-align:right}
      .profile-streak-row{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:7px}.profile-streak-day{display:grid;place-items:center;gap:6px;min-height:58px;border:1px solid #2f3e56;border-radius:12px;background:#0b1220;color:#64748b}.profile-streak-day.complete{border-color:rgba(34,197,94,.58);background:rgba(22,101,52,.18);color:#86efac}.profile-streak-day.perfect{border-color:#f97316;background:rgba(249,115,22,.14);color:#fed7aa}.profile-streak-day b{font:950 11px/1 system-ui}.profile-streak-day span{font:850 8px/1 system-ui;letter-spacing:.06em}
      .profile-activity-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.profile-activity-metric{padding:12px;border:1px solid #2f3e56;border-radius:13px;background:#0b1220}.profile-activity-metric span,.profile-activity-metric strong,.profile-activity-metric small{display:block}.profile-activity-metric span{color:#94a3b8;font:850 8px/1 system-ui;letter-spacing:.08em}.profile-activity-metric strong{margin-top:7px;font:950 20px/1 system-ui}.profile-activity-metric small{margin-top:5px;color:#94a3b8;font:700 9px/1.2 system-ui}
      .profile-achievements{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.profile-achievement{display:grid;grid-template-columns:34px minmax(0,1fr);align-items:center;gap:9px;padding:11px;border:1px solid #33445f;border-radius:14px;background:#0b1220}.profile-achievement.locked{opacity:.42;filter:saturate(.35)}.profile-achievement i{display:grid;place-items:center;width:34px;height:34px;border-radius:11px;background:rgba(249,115,22,.14);font-style:normal;font-size:17px}.profile-achievement strong,.profile-achievement small{display:block}.profile-achievement strong{font:900 10px/1.15 system-ui}.profile-achievement small{margin-top:4px;color:#94a3b8;font:700 8px/1.25 system-ui}
      .profile-recent-list{display:grid;gap:8px}.profile-recent-row{display:grid;grid-template-columns:36px minmax(0,1fr) auto;align-items:center;gap:10px;padding:10px;border:1px solid #2f3e56;border-radius:13px;background:#0b1220}.profile-recent-row i{display:grid;place-items:center;width:36px;height:36px;border-radius:11px;background:rgba(249,115,22,.13);font-style:normal}.profile-recent-row strong,.profile-recent-row small{display:block}.profile-recent-row strong{font:900 11px/1.2 system-ui}.profile-recent-row small{margin-top:4px;color:#94a3b8;font:700 9px/1.3 system-ui}.profile-recent-row time{color:#94a3b8;font:800 8px/1 system-ui;white-space:nowrap}
      .profile-activity-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.profile-activity-actions button{min-height:44px;border:1px solid #475569;border-radius:13px;background:#172033;color:#fff;cursor:pointer;font:950 10px/1 system-ui}.profile-activity-actions button:first-child{border-color:#f97316;background:#f97316;color:#111827}
      .profile-activity-empty{padding:18px;border:1px dashed #475569;border-radius:14px;color:#94a3b8;text-align:center;font:750 11px/1.4 system-ui}
      @media(max-width:700px){.profile-activity-overlay{padding:0;align-items:end}.profile-activity-panel{max-height:95vh;border-radius:24px 24px 0 0}.profile-activity-head{grid-template-columns:auto minmax(0,1fr);padding:16px}.profile-activity-head .app-profile-avatar{width:62px;height:62px;min-width:62px}.profile-activity-head-actions{grid-column:1/-1;display:grid;grid-template-columns:1fr 42px}.profile-activity-body{padding:14px}.profile-activity-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.profile-activity-grid{grid-template-columns:1fr}.profile-activity-card.wide{grid-column:auto}.profile-achievements{grid-template-columns:1fr 1fr}.profile-activity-actions{grid-template-columns:1fr}.profile-activity-metrics{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:390px){.profile-achievements{grid-template-columns:1fr}.profile-activity-metric{padding:10px}.profile-activity-metric strong{font-size:18px}}
      @media(prefers-reduced-motion:reduce){.profile-activity-overlay *{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
    `;
    document.head.appendChild(style);
  }

  function ledgerEvent(detail={}){
    const gameType=text(detail.gameType||detail.game_type||'game');
    const daily=Boolean(detail.daily);
    const day=centralDay();
    const score=number(detail.score??detail.result?.score);
    const maxScore=number(detail.maxScore??detail.max_score)||null;
    const completedAt=detail.completedAt||new Date().toISOString();
    return{
      id:daily?`daily:${gameType}:${day}`:`${gameType}:${completedAt}:${Math.random().toString(36).slice(2,7)}`,
      type:'game',gameType,title:GAME_TITLES[gameType]||'UFC Game',daily,score,maxScore,completedAt
    };
  }

  function recordGame(detail={}){
    const entry=ledgerEvent(detail);
    const rows=readLedger().filter(row=>row.id!==entry.id);
    rows.unshift(entry);
    writeLedger(rows);
    if(state.overlay)refresh();
  }

  function dailyResults(){
    const rows=[];
    try{
      for(let index=0;index<localStorage.length;index+=1){
        const key=localStorage.key(index)||'';
        if(!key.startsWith(DAILY_PREFIX))continue;
        const day=key.slice(DAILY_PREFIX.length);
        const saved=parseJson(localStorage.getItem(key),null);
        if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!saved?.completed)continue;
        rows.push({day,score:number(saved.score),total:number(saved.total)||10,completedAt:saved.completedAt||`${day}T12:00:00-06:00`});
      }
    }catch(_error){}
    return rows.sort((a,b)=>a.day.localeCompare(b.day));
  }

  function mergeDailyIntoLedger(results){
    const rows=readLedger();
    const ids=new Set(rows.map(row=>row.id));
    let changed=false;
    results.forEach(result=>{
      const id=`daily:find-leader:${result.day}`;
      if(ids.has(id))return;
      rows.push({id,type:'game',gameType:'find-leader',title:'Find the Leader',daily:true,score:result.score,maxScore:result.total,completedAt:result.completedAt});
      changed=true;
    });
    if(changed)writeLedger(rows.sort((a,b)=>new Date(b.completedAt)-new Date(a.completedAt)));
  }

  function streaks(results){
    const days=[...new Set(results.map(row=>row.day))].sort();
    if(!days.length)return{current:0,best:0};
    let best=1;let run=1;
    for(let index=1;index<days.length;index+=1){
      if(dayOffset(days[index-1],1)===days[index])run+=1;else run=1;
      best=Math.max(best,run);
    }
    const today=centralDay();
    const last=days[days.length-1];
    if(last!==today&&last!==dayOffset(today,-1))return{current:0,best};
    let current=1;
    for(let index=days.length-1;index>0;index-=1){
      if(dayOffset(days[index-1],1)!==days[index])break;
      current+=1;
    }
    return{current,best};
  }

  function storedRooms(){
    const rooms=[];
    try{
      for(let index=0;index<localStorage.length;index+=1){
        const key=localStorage.key(index)||'';
        if(!key.startsWith(ROOM_PREFIX))continue;
        const code=text(key.slice(ROOM_PREFIX.length)).toUpperCase();
        const token=text(localStorage.getItem(key));
        if(code&&token)rooms.push({code,token});
      }
    }catch(_error){}
    return rooms.slice(0,24);
  }

  function eventComplete(event){
    if(!event)return false;
    if(event.status==='complete')return true;
    const fights=Array.isArray(event.fights)?event.fights:[];
    return fights.length>0&&fights.every(fight=>fight.resultStatus&&fight.resultStatus!=='scheduled');
  }

  async function picksActivity(identity){
    const client=window.UFC_PLAY_PROFILE?.client||window.UFC_APP_PROFILE?.identity?.client;
    const rooms=storedRooms();
    if(!client||!rooms.length)return{events:0,correct:0,total:0,points:0,seasonRank:null,bestFinish:null,rows:[]};
    try{
      const [{data:events,error:eventError},snapshots]=await Promise.all([
        client.rpc('picks_public_events'),
        Promise.all(rooms.map(async room=>{
          const {data,error}=await client.rpc('picks_room_snapshot',{p_room_code:room.code,p_member_token:room.token});
          return error||!data?.room?null:data;
        }))
      ]);
      if(eventError||!Array.isArray(events))throw eventError||new Error('Picks events unavailable');
      const eventMap=new Map(events.map(event=>[event.id,event]));
      const unique=new Map();
      snapshots.filter(Boolean).forEach(snapshot=>{
        const event=eventMap.get(snapshot.room?.event_id);
        if(!event||!eventComplete(event))return;
        const key=event.id;
        const existing=unique.get(key);
        if(!existing||snapshot.room?.code==='GOAT26')unique.set(key,{snapshot,event});
      });
      const rows=[...unique.values()].map(({snapshot,event})=>{
        const members=[...(snapshot.members||[])].sort((a,b)=>number(b.score)-number(a.score)||number(b.correct)-number(a.correct));
        const memberId=identity?.member?.id;
        const display=text(identity?.member?.display_name).toLowerCase();
        const me=snapshot.me||members.find(member=>member.id===memberId)||members.find(member=>text(member.display_name).toLowerCase()===display)||null;
        const place=me?members.findIndex(member=>member.id===me.id||text(member.display_name).toLowerCase()===text(me.display_name).toLowerCase())+1:null;
        const total=number(me?.picks_count||me?.pick_count)||number(snapshot.my_picks?.length)||number(event.fights?.length);
        return{eventId:event.id,name:event.name,eventDate:event.eventDate,correct:number(me?.correct),total,points:number(me?.score),place:place||null,members};
      }).sort((a,b)=>new Date(b.eventDate)-new Date(a.eventDate));
      const standings=new Map();
      rows.forEach(row=>row.members.forEach(member=>{
        const key=text(member.display_name).toLowerCase();if(!key)return;
        const value=standings.get(key)||{name:member.display_name,points:0,correct:0};
        value.points+=number(member.score);value.correct+=number(member.correct);standings.set(key,value);
      }));
      const ranked=[...standings.values()].sort((a,b)=>b.points-a.points||b.correct-a.correct||a.name.localeCompare(b.name));
      const myName=text(identity?.member?.display_name).toLowerCase();
      const seasonIndex=ranked.findIndex(member=>text(member.name).toLowerCase()===myName);
      return{
        events:rows.length,
        correct:rows.reduce((sum,row)=>sum+row.correct,0),
        total:rows.reduce((sum,row)=>sum+row.total,0),
        points:rows.reduce((sum,row)=>sum+row.points,0),
        seasonRank:seasonIndex>=0?seasonIndex+1:null,
        bestFinish:rows.reduce((best,row)=>row.place&&(!best||row.place<best)?row.place:best,null),
        rows
      };
    }catch(_error){return{events:0,correct:0,total:0,points:0,seasonRank:null,bestFinish:null,rows:[]};}
  }

  async function warActivity(identity){
    let snapshot=window.UFC_OCTAGON_BOARD?.snapshot||null;
    if(!snapshot&&window.UFC_OCTAGON_BOARD?.load){
      try{snapshot=await window.UFC_OCTAGON_BOARD.load(null,{silent:true});}catch(_error){snapshot=null;}
    }
    const messages=Array.isArray(snapshot?.messages)?snapshot.messages:[];
    const memberId=identity?.member?.id;
    const display=text(identity?.member?.display_name).toLowerCase();
    const mine=messages.filter(message=>message?.author?.id===memberId||text(message?.author?.display_name).toLowerCase()===display).filter(message=>!message.deleted);
    return{
      posts:mine.filter(message=>!message.parent_message_id).length,
      replies:mine.filter(message=>message.parent_message_id).length,
      reactions:mine.reduce((sum,message)=>sum+number(message.likes)+number(message.dislikes),0),
      rows:mine.map(message=>({id:`war:${message.id}`,type:'war',title:message.parent_message_id?'Replied in The War Room':'Posted in The War Room',detail:text(message.body).slice(0,90),completedAt:message.created_at}))
    };
  }

  function gameActivity(daily){
    mergeDailyIntoLedger(daily);
    const rows=readLedger().filter(row=>row.type==='game').sort((a,b)=>new Date(b.completedAt)-new Date(a.completedAt));
    const types=new Set(rows.map(row=>row.gameType));
    return{rows,total:rows.length,types:types.size};
  }

  function achievements(data,member){
    const perfect=data.daily.some(row=>row.score>=row.total&&row.total>0);
    const profileComplete=Boolean(text(member?.profile_photo_data)||text(member?.fighter_avatar_slug));
    return[
      {icon:'👤',title:'Profile Ready',copy:'Set your shared Octagon HQ identity.',unlocked:profileComplete},
      {icon:'🎯',title:'Perfect 10',copy:'Finish Find the Leader with 10/10.',unlocked:perfect},
      {icon:'🔥',title:'Three-Day Run',copy:'Reach a three-day daily streak.',unlocked:data.streak.best>=3},
      {icon:'🎮',title:'Game Explorer',copy:'Complete three different Play games.',unlocked:data.games.types>=3},
      {icon:'🥊',title:'Picks Player',copy:'Finish a UFC Picks event.',unlocked:data.picks.events>=1},
      {icon:'🏆',title:'Event Champion',copy:'Finish first in a Picks event.',unlocked:data.picks.bestFinish===1},
      {icon:'💬',title:'War Room Voice',copy:'Post or reply in The War Room.',unlocked:data.war.posts+data.war.replies>=1},
      {icon:'📣',title:'Debate Starter',copy:'Earn three reactions on your takes.',unlocked:data.war.reactions>=3}
    ];
  }

  function recentRows(data){
    const picks=data.picks.rows.map(row=>({id:`picks:${row.eventId}`,type:'picks',title:`${row.name} Picks`,detail:`${row.correct}/${row.total} correct · ${row.points} pts${row.place?` · #${row.place}`:''}`,completedAt:row.eventDate}));
    return[...data.games.rows,...picks,...data.war.rows].filter(row=>row.completedAt).sort((a,b)=>new Date(b.completedAt)-new Date(a.completedAt)).slice(0,7);
  }

  function iconFor(type,gameType){
    if(type==='picks')return'🥊';
    if(type==='war')return'💬';
    if(gameType==='find-leader')return'🎯';
    if(gameType==='keep-cut')return'4/4';
    if(gameType==='blind-rank')return'1–5';
    return'🎮';
  }

  function avatarMarkup(member){
    return window.UFC_APP_PROFILE?.avatarMarkup?.(member,'large')||`<span class="app-profile-avatar large"><span>${esc(text(member?.display_name).slice(0,2).toUpperCase()||'UFC')}</span></span>`;
  }

  function mount(member){
    close();
    const overlay=document.createElement('div');
    overlay.className='profile-activity-overlay';
    overlay.innerHTML=`<section class="profile-activity-panel" role="dialog" aria-modal="true" aria-labelledby="profileActivityTitle"><header class="profile-activity-head" data-member-name="${esc(member?.display_name)}">${avatarMarkup(member)}<div class="profile-activity-title"><span>ACTIVITY PROFILE · GOAT26</span><strong id="profileActivityTitle">${esc(member?.display_name||'UFC Profile')}</strong><small>${member?.is_admin?'Administrator · ':''}Your games, Picks, achievements, and War Room activity.</small></div><div class="profile-activity-head-actions"><button type="button" class="profile-activity-edit" data-profile-activity-edit>EDIT PROFILE</button><button type="button" class="profile-activity-close" aria-label="Close activity profile" data-profile-activity-close>×</button></div></header><div class="profile-activity-body" data-profile-activity-body><div class="profile-activity-loading">Loading your Octagon HQ activity…</div></div></section>`;
    document.body.appendChild(overlay);document.body.classList.add('profile-activity-open');state.overlay=overlay;
    overlay.querySelector('[data-profile-activity-close]')?.addEventListener('click',close);
    overlay.addEventListener('click',event=>{if(event.target===overlay)close();});
    overlay.querySelector('[data-profile-activity-edit]')?.addEventListener('click',()=>{close();window.UFC_APP_PROFILE?.open?.();});
  }

  function summaryMarkup(data){
    const accuracy=data.picks.total?Math.round((data.picks.correct/data.picks.total)*100):0;
    return`<section class="profile-activity-summary">
      <article class="profile-activity-stat"><span>CURRENT STREAK</span><strong>${data.streak.current}</strong><small>Find the Leader days</small></article>
      <article class="profile-activity-stat"><span>BEST STREAK</span><strong>${data.streak.best}</strong><small>Consecutive daily plays</small></article>
      <article class="profile-activity-stat"><span>PICKS RECORD</span><strong>${data.picks.correct}-${Math.max(0,data.picks.total-data.picks.correct)}</strong><small>${accuracy}% correct</small></article>
      <article class="profile-activity-stat"><span>ACHIEVEMENTS</span><strong>${data.achievements.filter(row=>row.unlocked).length}</strong><small>of ${data.achievements.length} unlocked</small></article>
    </section>`;
  }

  function streakMarkup(data){
    const map=new Map(data.daily.map(row=>[row.day,row]));
    const today=centralDay();
    const days=Array.from({length:7},(_,index)=>dayOffset(today,index-6));
    return`<article class="profile-activity-card"><header class="profile-activity-card-head"><div><span>DAILY CHALLENGE</span><strong>Find the Leader</strong></div><small>${data.daily.length} recorded day${data.daily.length===1?'':'s'}</small></header><div class="profile-streak-row">${days.map(day=>{const row=map.get(day);const perfect=row&&row.score>=row.total;return`<div class="profile-streak-day${row?' complete':''}${perfect?' perfect':''}"><b>${day.slice(-2)}</b><span>${row?`${row.score}/${row.total}`:'—'}</span></div>`;}).join('')}</div></article>`;
  }

  function picksMarkup(data){
    const accuracy=data.picks.total?Math.round((data.picks.correct/data.picks.total)*100):0;
    return`<article class="profile-activity-card"><header class="profile-activity-card-head"><div><span>UFC PICKS</span><strong>Season Activity</strong></div><small>${data.picks.events} completed event${data.picks.events===1?'':'s'}</small></header><div class="profile-activity-metrics"><div class="profile-activity-metric"><span>POINTS</span><strong>${data.picks.points}</strong><small>Total</small></div><div class="profile-activity-metric"><span>ACCURACY</span><strong>${accuracy}%</strong><small>${data.picks.correct}/${data.picks.total}</small></div><div class="profile-activity-metric"><span>SEASON RANK</span><strong>${data.picks.seasonRank?`#${data.picks.seasonRank}`:'—'}</strong><small>${data.picks.bestFinish?`Best #${data.picks.bestFinish}`:'No final yet'}</small></div></div></article>`;
  }

  function playMarkup(data){
    return`<article class="profile-activity-card"><header class="profile-activity-card-head"><div><span>PLAY</span><strong>Game Activity</strong></div><small>${data.games.types} game type${data.games.types===1?'':'s'}</small></header><div class="profile-activity-metrics"><div class="profile-activity-metric"><span>COMPLETIONS</span><strong>${data.games.total}</strong><small>Recorded games</small></div><div class="profile-activity-metric"><span>PERFECT 10s</span><strong>${data.daily.filter(row=>row.score>=row.total&&row.total>0).length}</strong><small>Find the Leader</small></div><div class="profile-activity-metric"><span>DAILY DAYS</span><strong>${data.daily.length}</strong><small>Completed</small></div></div></article>`;
  }

  function warMarkup(data){
    return`<article class="profile-activity-card"><header class="profile-activity-card-head"><div><span>THE WAR ROOM</span><strong>Participation</strong></div><small>This week</small></header><div class="profile-activity-metrics"><div class="profile-activity-metric"><span>POSTS</span><strong>${data.war.posts}</strong><small>Top-level takes</small></div><div class="profile-activity-metric"><span>REPLIES</span><strong>${data.war.replies}</strong><small>Conversation</small></div><div class="profile-activity-metric"><span>REACTIONS</span><strong>${data.war.reactions}</strong><small>On your posts</small></div></div></article>`;
  }

  function achievementsMarkup(data){
    return`<article class="profile-activity-card wide"><header class="profile-activity-card-head"><div><span>ACHIEVEMENTS</span><strong>Your Octagon HQ résumé</strong></div><small>${data.achievements.filter(row=>row.unlocked).length}/${data.achievements.length} unlocked</small></header><div class="profile-achievements">${data.achievements.map(row=>`<div class="profile-achievement${row.unlocked?'':' locked'}"><i>${row.icon}</i><div><strong>${esc(row.title)}</strong><small>${esc(row.copy)}</small></div></div>`).join('')}</div></article>`;
  }

  function recentMarkup(data){
    const rows=recentRows(data);
    return`<article class="profile-activity-card wide"><header class="profile-activity-card-head"><div><span>RECENT ACTIVITY</span><strong>Your latest results</strong></div><small>Across Octagon HQ</small></header>${rows.length?`<div class="profile-recent-list">${rows.map(row=>`<div class="profile-recent-row"><i>${iconFor(row.type,row.gameType)}</i><div><strong>${esc(row.title||GAME_TITLES[row.gameType]||'Activity')}</strong><small>${esc(row.detail||((row.score!==undefined&&row.maxScore)?`${row.score}/${row.maxScore}`:'Completed'))}</small></div><time>${esc(timeAgo(row.completedAt))}</time></div>`).join('')}</div>`:'<div class="profile-activity-empty">Complete a game, finish a Picks event, or join The War Room to build your activity history.</div>'}</article>`;
  }

  function actionsMarkup(){
    return`<section class="profile-activity-actions"><button type="button" data-profile-activity-destination="play">PLAY GAMES</button><button type="button" data-profile-activity-destination="picks">OPEN PICKS</button><button type="button" data-profile-activity-destination="war-room">JOIN WAR ROOM</button></section>`;
  }

  function render(){
    const body=state.overlay?.querySelector('[data-profile-activity-body]');
    if(!body||!state.data)return;
    body.innerHTML=`${summaryMarkup(state.data)}<section class="profile-activity-grid">${streakMarkup(state.data)}${picksMarkup(state.data)}${playMarkup(state.data)}${warMarkup(state.data)}${achievementsMarkup(state.data)}${recentMarkup(state.data)}</section>${actionsMarkup()}`;
    body.querySelectorAll('[data-profile-activity-destination]').forEach(button=>button.addEventListener('click',()=>{const destination=button.dataset.profileActivityDestination;close();window.UFC_APP_SHELL?.activateDestination?.(destination)||window.UFC_PRODUCT_ARCHITECTURE?.activateDestination?.(destination);}));
  }

  async function load(){
    if(state.loading)return;
    state.loading=true;
    try{
      const profile=window.UFC_APP_PROFILE;
      const identity=state.identity||await profile?.resolve?.();
      state.identity=identity||null;state.member=profile?.group?.me||identity?.member||null;
      const daily=dailyResults();
      const [picks,war]=await Promise.all([picksActivity(identity),warActivity(identity)]);
      const games=gameActivity(daily);
      const streak=streaks(daily);
      const data={daily,picks,war,games,streak};
      data.achievements=achievements(data,state.member);
      state.data=data;render();
    }finally{state.loading=false;}
  }

  async function open(){
    installStyles();
    let identity=await window.UFC_APP_PROFILE?.resolve?.().catch(()=>null);
    if(!identity){identity=await window.UFC_PLAY_PROFILE?.require?.({title:'Open your Activity Profile',description:'Use your GOAT26 display name and four-digit PIN.'});if(!identity)return;}
    state.identity=identity;state.member=window.UFC_APP_PROFILE?.group?.me||identity.member||{};
    mount(state.member);load();
  }

  function close(){state.overlay?.remove();state.overlay=null;document.body.classList.remove('profile-activity-open');}

  function bind(){
    document.addEventListener('click',event=>{
      const chip=event.target.closest?.('.app-profile-chip');
      if(!chip)return;
      event.preventDefault();event.stopImmediatePropagation();open();
    },true);
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&state.overlay)close();});
    window.addEventListener('ufc-play-game-complete',event=>recordGame(event.detail||{}));
    window.addEventListener('ufc-app-profile-updated',event=>{state.identity=event.detail?.identity||state.identity;state.member=event.detail?.member||state.member;if(state.overlay)refresh();});
  }

  async function refresh(){state.data=null;const body=state.overlay?.querySelector('[data-profile-activity-body]');if(body)body.innerHTML='<div class="profile-activity-loading">Refreshing your Octagon HQ activity…</div>';await load();}

  installStyles();bind();
  window.UFC_PROFILE_ACTIVITY={version:VERSION,open,close,refresh,recordGame,get data(){return state.data;}};
  document.documentElement.setAttribute('data-profile-activity',VERSION);
})();
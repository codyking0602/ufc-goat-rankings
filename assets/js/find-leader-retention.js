(function(){
  'use strict';

  const VERSION='find-leader-retention-20260718a-phase-2b';
  const GAME_TYPE='find-leader';
  const GAME_VERSION='find-leader-daily-v1';
  const MAX_SCORE=10;
  const HISTORY_DAYS=35;
  const LEDGER_KEY='ufc-find-leader-retention-v1';
  const DAILY_PREFIX='ufc-play:daily-completion:find-leader:';
  const CACHE_PREFIX='ufc-find-leader-board-v1:';
  const state={rows:[],identity:null,loading:null,historyOpen:false,countdownTimer:0,bound:false};

  const text=value=>String(value??'').trim();
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const parseJson=(value,fallback=null)=>{try{return JSON.parse(value);}catch(_error){return fallback;}};
  const readLocal=key=>{try{return localStorage.getItem(key)||'';}catch(_error){return'';}};
  const writeLocal=(key,value)=>{try{localStorage.setItem(key,value);}catch(_error){}};
  const readJson=(key,fallback=null)=>parseJson(readLocal(key),fallback);
  const writeJson=(key,value)=>writeLocal(key,JSON.stringify(value));

  function centralParts(date=new Date()){
    try{
      return Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date).map(part=>[part.type,part.value]));
    }catch(_error){
      return{year:String(date.getUTCFullYear()),month:String(date.getUTCMonth()+1).padStart(2,'0'),day:String(date.getUTCDate()).padStart(2,'0'),hour:String(date.getUTCHours()).padStart(2,'0'),minute:String(date.getUTCMinutes()).padStart(2,'0'),second:String(date.getUTCSeconds()).padStart(2,'0')};
    }
  }
  function centralDay(date=new Date()){const parts=centralParts(date);return`${parts.year}-${parts.month}-${parts.day}`;}
  function dayOffset(day,offset){const date=new Date(`${day}T12:00:00Z`);date.setUTCDate(date.getUTCDate()+offset);return date.toISOString().slice(0,10);}
  function dayLabel(day,options={}){try{return new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',weekday:options.weekday?'short':undefined,month:'short',day:'numeric',year:options.year?'numeric':undefined}).format(new Date(`${day}T12:00:00Z`));}catch(_error){return day;}}
  function dateTimeLabel(value){const date=new Date(value);if(Number.isNaN(date.getTime()))return'';return new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(date);}

  function zonedMidnightUtc(day){
    const [year,month,date]=day.split('-').map(Number);
    const guess=Date.UTC(year,month-1,date,6,0,0);
    const parts=centralParts(new Date(guess));
    const represented=Date.UTC(Number(parts.year),Number(parts.month)-1,Number(parts.day),Number(parts.hour),Number(parts.minute),Number(parts.second));
    return Date.UTC(year,month-1,date,0,0,0)-(represented-guess);
  }
  function resetTime(){return zonedMidnightUtc(dayOffset(centralDay(),1));}
  function countdownText(){
    const remaining=Math.max(0,resetTime()-Date.now());
    const hours=Math.floor(remaining/3600000);
    const minutes=Math.floor((remaining%3600000)/60000);
    const seconds=Math.floor((remaining%60000)/1000);
    if(hours>=1)return`${hours}h ${String(minutes).padStart(2,'0')}m`;
    return`${minutes}m ${String(seconds).padStart(2,'0')}s`;
  }

  function readLedger(){const rows=readJson(LEDGER_KEY,[]);return Array.isArray(rows)?rows:[];}
  function writeLedger(rows){writeJson(LEDGER_KEY,rows.sort((a,b)=>b.day.localeCompare(a.day)).slice(0,180));}

  function localDailyRows(){
    const rows=[];
    try{
      for(let index=0;index<localStorage.length;index+=1){
        const key=localStorage.key(index)||'';
        if(!key.startsWith(DAILY_PREFIX))continue;
        const day=key.slice(DAILY_PREFIX.length);
        const saved=readJson(key,null);
        if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!saved?.completed)continue;
        rows.push({day,officialScore:num(saved.score),bestScore:num(saved.score),maxScore:num(saved.total)||MAX_SCORE,attemptCount:1,completedAt:saved.completedAt||`${day}T12:00:00Z`,source:'device'});
      }
    }catch(_error){}
    return rows;
  }

  function mergeRows(...collections){
    const map=new Map();
    collections.flat().filter(Boolean).forEach(row=>{
      const day=text(row.day||row.challenge_day);
      if(!/^\d{4}-\d{2}-\d{2}$/.test(day))return;
      const current=map.get(day)||{day,officialScore:0,bestScore:0,maxScore:MAX_SCORE,attemptCount:0,rank:null,playerCount:null,completedAt:'',result:null,source:''};
      const official=num(row.officialScore??row.official_score??row.score);
      const best=num(row.bestScore??row.best_score??official);
      const incoming={
        ...current,...row,day,
        officialScore:official||current.officialScore,
        bestScore:Math.max(current.bestScore,best,official),
        maxScore:num(row.maxScore??row.max_score)||current.maxScore||MAX_SCORE,
        attemptCount:Math.max(current.attemptCount,num(row.attemptCount??row.attempt_count)||0),
        rank:num(row.rank)||current.rank||null,
        playerCount:num(row.playerCount??row.player_count)||current.playerCount||null,
        completedAt:row.completedAt||row.completed_at||row.updated_at||current.completedAt,
        result:row.result||current.result||null,
        source:row.source||current.source
      };
      map.set(day,incoming);
    });
    return[...map.values()].filter(row=>row.officialScore>0||row.bestScore>0).sort((a,b)=>b.day.localeCompare(a.day));
  }

  function saveAttempt(detail={}){
    if(!detail.daily||text(detail.gameType||detail.game_type)!==GAME_TYPE)return null;
    const day=text(window.UFC_PLAY_DAILY_ROTATION?.context?.challenge_day||window.UFC_PLAY_HUB?.dailyChallenge?.challengeDay)||centralDay();
    const score=num(detail.score??detail.result?.score);
    const maxScore=num(detail.maxScore??detail.max_score)||MAX_SCORE;
    const rows=readLedger();
    const existing=rows.find(row=>row.day===day);
    if(existing){
      existing.bestScore=Math.max(num(existing.bestScore),score);
      existing.attemptCount=Math.max(1,num(existing.attemptCount))+1;
      existing.completedAt=existing.completedAt||new Date().toISOString();
      existing.result=existing.result||detail.result||null;
    }else{
      rows.push({day,officialScore:score,bestScore:score,maxScore,attemptCount:1,completedAt:new Date().toISOString(),result:detail.result||null,source:'device'});
    }
    writeLedger(rows);
    state.rows=mergeRows(rows,localDailyRows());
    renderAll();
    [700,2200,6000].forEach(delay=>setTimeout(()=>syncDay(day,{force:true}),delay));
    return rows.find(row=>row.day===day)||null;
  }

  async function identity(){
    if(state.identity)return state.identity;
    state.identity=await window.UFC_APP_PROFILE?.resolve?.().catch(()=>null)||await window.UFC_PLAY_PROFILE?.resolve?.().catch(()=>null)||null;
    return state.identity;
  }

  function cacheKey(day,name){return`${CACHE_PREFIX}${day}:${String(name||'').toLowerCase()}`;}
  function cacheFresh(cached,day){
    if(!cached?.checkedAt)return false;
    const age=Date.now()-new Date(cached.checkedAt).getTime();
    return age<(day===centralDay()?45000:24*60*60*1000);
  }

  async function fetchOfficialDay(day,{force=false}={}){
    const profile=await identity();
    const client=window.UFC_PLAY_PROFILE?.client;
    const name=text(profile?.member?.display_name).toLowerCase();
    if(!client||!name)return null;
    const key=cacheKey(day,name);
    const cached=readJson(key,null);
    if(!force&&cacheFresh(cached,day))return cached.row||null;
    try{
      const {data,error}=await client.rpc('play_daily_leaderboard',{p_game_type:GAME_TYPE,p_challenge_day:day,p_limit:100});
      if(error||!data?.ok)throw error||new Error(data?.error||'Daily history unavailable');
      const row=(Array.isArray(data.rows)?data.rows:[]).find(item=>text(item?.display_name).toLowerCase()===name);
      const mapped=row?{
        day,
        officialScore:num(row.official_score),
        bestScore:num(row.best_score),
        maxScore:num(row.max_score)||num(data.max_score)||MAX_SCORE,
        attemptCount:num(row.attempt_count)||1,
        rank:num(row.rank)||null,
        playerCount:num(data.player_count)||num(data.rows?.length)||null,
        completedAt:row.completed_at||row.updated_at||`${day}T12:00:00Z`,
        source:'official'
      }:null;
      writeJson(key,{checkedAt:new Date().toISOString(),row:mapped});
      return mapped;
    }catch(_error){return cached?.row||null;}
  }

  async function mapLimit(items,limit,worker){
    const output=new Array(items.length);let cursor=0;
    async function run(){while(cursor<items.length){const index=cursor++;output[index]=await worker(items[index],index);}}
    await Promise.all(Array.from({length:Math.min(limit,items.length)},run));
    return output;
  }

  async function refresh(options={}){
    if(state.loading&&!options.force)return state.loading;
    state.loading=(async()=>{
      const days=Math.max(7,Math.min(60,num(options.days)||HISTORY_DAYS));
      const today=centralDay();
      const dayList=Array.from({length:days},(_,index)=>dayOffset(today,-index));
      const official=await mapLimit(dayList,5,day=>fetchOfficialDay(day,{force:Boolean(options.force&&day===today)}));
      state.rows=mergeRows(readLedger(),localDailyRows(),official);
      writeLedger(state.rows);
      renderAll();
      window.dispatchEvent(new CustomEvent('ufc-find-leader-history-updated',{detail:{rows:history(),streak:streaks()}}));
      return history();
    })().finally(()=>{state.loading=null;});
    return state.loading;
  }

  function history(){return state.rows.length?[...state.rows]:mergeRows(readLedger(),localDailyRows());}
  function streaks(rows=history()){
    const days=[...new Set(rows.map(row=>row.day))].sort();
    if(!days.length)return{current:0,best:0,perfect:0,total:0};
    let best=1,run=1;
    for(let index=1;index<days.length;index+=1){if(dayOffset(days[index-1],1)===days[index])run+=1;else run=1;best=Math.max(best,run);}
    const today=centralDay();const last=days[days.length-1];let current=0;
    if(last===today||last===dayOffset(today,-1)){
      current=1;
      for(let index=days.length-1;index>0;index-=1){if(dayOffset(days[index-1],1)!==days[index])break;current+=1;}
    }
    return{current,best,perfect:rows.filter(row=>row.officialScore>=row.maxScore&&row.maxScore>0).length,total:rows.length};
  }

  function resultStatus(row){
    if(!row)return'NOT PLAYED';
    if(row.officialScore>=row.maxScore)return'PERFECT 10';
    return`${row.officialScore}/${row.maxScore}`;
  }

  function installStyles(){
    if(document.getElementById('findLeaderRetentionCss'))return;
    const style=document.createElement('style');style.id='findLeaderRetentionCss';style.textContent=`
      .find-retention-card{margin:18px 0 0;border:1px solid #33445f;border-radius:20px;background:linear-gradient(145deg,#182438,#0d1523);color:#f8fafc;overflow:hidden}.find-retention-card>summary{list-style:none;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;padding:16px;cursor:pointer}.find-retention-card>summary::-webkit-details-marker{display:none}.find-retention-card>summary span,.find-retention-card>summary strong,.find-retention-card>summary small{display:block}.find-retention-card>summary span{color:#fb923c;font:950 9px/1 system-ui;letter-spacing:.13em}.find-retention-card>summary strong{margin-top:6px;font:950 18px/1 system-ui}.find-retention-card>summary small{color:#cbd5e1;font:850 10px/1.3 system-ui;text-align:right}.find-retention-body{display:grid;gap:14px;padding:0 16px 16px}.find-retention-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.find-retention-metric{padding:12px;border:1px solid #30415b;border-radius:13px;background:#0b1220}.find-retention-metric span,.find-retention-metric strong,.find-retention-metric small{display:block}.find-retention-metric span{color:#94a3b8;font:850 8px/1 system-ui;letter-spacing:.08em}.find-retention-metric strong{margin-top:7px;font:950 21px/1 system-ui}.find-retention-metric small{margin-top:5px;color:#94a3b8;font:700 8px/1.25 system-ui}.find-retention-calendar{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}.find-retention-day{min-width:0;min-height:51px;border:1px solid #2d3d55;border-radius:10px;background:#0b1220;color:#64748b;padding:6px 3px;text-align:center;cursor:default}.find-retention-day.complete{border-color:rgba(34,197,94,.5);color:#86efac;cursor:pointer}.find-retention-day.perfect{border-color:#f97316;background:rgba(249,115,22,.12);color:#fed7aa}.find-retention-day b,.find-retention-day span{display:block}.find-retention-day b{font:950 9px/1 system-ui}.find-retention-day span{margin-top:7px;font:850 8px/1 system-ui}.find-retention-recent{display:grid;gap:7px}.find-retention-row{display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:10px;padding:10px;border:1px solid #2d3d55;border-radius:12px;background:#0b1220;cursor:pointer;text-align:left;color:#fff}.find-retention-row strong,.find-retention-row small{display:block}.find-retention-row strong{font:900 11px/1.15 system-ui}.find-retention-row small{margin-top:4px;color:#94a3b8;font:700 9px/1.25 system-ui}.find-retention-row b{color:#fed7aa;font:950 12px/1 system-ui}.find-retention-row em{color:#94a3b8;font:850 8px/1 system-ui;font-style:normal}.find-retention-empty{padding:18px;border:1px dashed #475569;border-radius:13px;color:#94a3b8;text-align:center;font:750 10px/1.4 system-ui}.find-retention-result{margin:14px 0 0;padding:14px;border:1px solid rgba(249,115,22,.48);border-radius:16px;background:rgba(249,115,22,.08);color:#fff}.find-retention-result-head{display:flex;justify-content:space-between;gap:12px}.find-retention-result-head span{color:#fb923c;font:950 9px/1 system-ui;letter-spacing:.12em}.find-retention-result-head b{font:950 13px/1 system-ui}.find-retention-result p{margin:8px 0 11px;color:#cbd5e1;font:700 11px/1.4 system-ui}.find-retention-result button,.find-retention-history-action{min-height:40px;border:1px solid #f97316;border-radius:11px;background:#f97316;color:#111827;padding:0 13px;font:950 9px/1 system-ui;cursor:pointer}.find-retention-home-status{margin-top:10px;color:#cbd5e1;font:850 9px/1.3 system-ui;letter-spacing:.04em}.find-retention-overlay{position:fixed;inset:0;z-index:6500;display:grid;place-items:center;padding:18px;background:rgba(2,6,23,.9);backdrop-filter:blur(12px)}.find-retention-panel{width:min(720px,100%);max-height:92vh;overflow:auto;border:1px solid rgba(249,115,22,.65);border-radius:24px;background:linear-gradient(180deg,#1b283c,#0d1421);color:#fff}.find-retention-panel header{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:18px;border-bottom:1px solid #33445f}.find-retention-panel header span,.find-retention-panel header strong{display:block}.find-retention-panel header span{color:#fb923c;font:950 9px/1 system-ui;letter-spacing:.13em}.find-retention-panel header strong{margin-top:6px;font:950 24px/1 system-ui}.find-retention-panel header button{width:42px;height:42px;border:1px solid #475569;border-radius:12px;background:#111827;color:#fff;font-size:22px}.find-retention-panel-body{display:grid;gap:14px;padding:18px}.find-retention-detail{padding:18px;border:1px solid #33445f;border-radius:18px;background:#101827}.find-retention-detail h3{margin:0;font:950 24px/1 system-ui}.find-retention-detail p{margin:9px 0 0;color:#cbd5e1;font:700 11px/1.45 system-ui}.find-retention-detail-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:14px}.find-retention-detail-grid div{padding:11px;border:1px solid #2d3d55;border-radius:12px;background:#0b1220}.find-retention-detail-grid span,.find-retention-detail-grid strong{display:block}.find-retention-detail-grid span{color:#94a3b8;font:850 8px/1 system-ui;letter-spacing:.08em}.find-retention-detail-grid strong{margin-top:6px;font:950 17px/1 system-ui}@media(max-width:650px){.find-retention-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.find-retention-card>summary{padding:14px}.find-retention-card>summary small{font-size:9px}.find-retention-overlay{padding:0;align-items:end}.find-retention-panel{max-height:94vh;border-radius:24px 24px 0 0}.find-retention-detail-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    `;document.head.appendChild(style);
  }

  function calendarMarkup(rows=history(),days=28){
    const map=new Map(rows.map(row=>[row.day,row]));const today=centralDay();
    const list=Array.from({length:days},(_,index)=>dayOffset(today,index-days+1));
    return`<div class="find-retention-calendar">${list.map(day=>{const row=map.get(day);const perfect=row&&row.officialScore>=row.maxScore;return`<button type="button" class="find-retention-day${row?' complete':''}${perfect?' perfect':''}" ${row?`data-find-history-day="${esc(day)}"`:'disabled'}><b>${day.slice(-2)}</b><span>${row?`${row.officialScore}/${row.maxScore}`:'—'}</span></button>`;}).join('')}</div>`;
  }

  function recentMarkup(rows=history(),limit=6){
    const recent=rows.slice(0,limit);
    if(!recent.length)return'<div class="find-retention-empty">Play today’s Find the Leader to begin your daily history.</div>';
    return`<div class="find-retention-recent">${recent.map(row=>`<button type="button" class="find-retention-row" data-find-history-day="${esc(row.day)}"><div><strong>${esc(dayLabel(row.day,{weekday:true}))}</strong><small>${row.attemptCount>1?`Best ${row.bestScore}/${row.maxScore} · ${row.attemptCount} attempts`:'Official first attempt'}</small></div><b>${row.officialScore}/${row.maxScore}</b><em>${row.rank?`#${row.rank} of ${row.playerCount||'—'}`:'Rank pending'}</em></button>`).join('')}</div>`;
  }

  function retentionMarkup(){
    const stats=streaks();
    return`<details class="find-retention-card" data-find-retention-card><summary><div><span>DAILY HISTORY</span><strong>Find the Leader streak</strong></div><small>${stats.current}-day current · ${stats.best}-day best<br>Next board in <b data-find-countdown>${countdownText()}</b></small></summary><div class="find-retention-body"><div class="find-retention-metrics"><div class="find-retention-metric"><span>CURRENT</span><strong>${stats.current}</strong><small>Consecutive days</small></div><div class="find-retention-metric"><span>BEST</span><strong>${stats.best}</strong><small>Longest streak</small></div><div class="find-retention-metric"><span>PERFECT 10s</span><strong>${stats.perfect}</strong><small>Official runs</small></div><div class="find-retention-metric"><span>DAILY PLAYS</span><strong>${stats.total}</strong><small>Recorded days</small></div></div>${calendarMarkup()}${recentMarkup()}</div></details>`;
  }

  function ensurePlayCard(){
    const carousel=document.getElementById('playDailyCarousel');const hub=document.getElementById('playHub');
    if(!hub)return;
    let card=document.querySelector('[data-find-retention-card]');
    if(!card){const holder=document.createElement('div');holder.innerHTML=retentionMarkup();card=holder.firstElementChild;(carousel||hub.querySelector('.play-daily-card'))?.insertAdjacentElement('afterend',card);}
    else{const open=card.open;const holder=document.createElement('div');holder.innerHTML=retentionMarkup();card.replaceWith(holder.firstElementChild);holder.firstElementChild.open=open;}
  }

  function ensureHomeStatus(){
    const card=document.querySelector('#homeDashboardMount .home-daily-card');
    if(!card)return;
    let node=card.querySelector('[data-find-retention-home]');
    if(!node){node=document.createElement('div');node.className='find-retention-home-status';node.dataset.findRetentionHome='true';card.querySelector('.home-card-action,.home-daily-action,button,a')?.insertAdjacentElement('beforebegin',node)||card.appendChild(node);}
    const stats=streaks();const today=history().find(row=>row.day===centralDay());
    node.textContent=today?`${resultStatus(today)} · ${stats.current}-day streak · Next challenge in ${countdownText()}`:`${stats.current?`${stats.current}-day streak · `:''}Next challenge resets at midnight Central`;
  }

  function ensureResultCard(){
    const result=document.querySelector('#playFindLeaderPanel .find-leader-results');
    if(!result)return;
    const today=history().find(row=>row.day===centralDay());if(!today)return;
    let card=result.querySelector('[data-find-retention-result]');
    if(!card){card=document.createElement('section');card.className='find-retention-result';card.dataset.findRetentionResult='true';result.querySelector('.find-leader-actions')?.before(card)||result.appendChild(card);}
    const stats=streaks();
    card.innerHTML=`<div class="find-retention-result-head"><span>DAILY RUN SAVED</span><b>${today.rank?`OFFICIAL #${today.rank}`:'RANK UPDATING'}</b></div><p>${today.officialScore}/${today.maxScore} official · Best ${today.bestScore}/${today.maxScore} · ${stats.current}-day streak. Tomorrow’s board unlocks in <b data-find-countdown>${countdownText()}</b>.</p><button type="button" data-find-history-open>VIEW DAILY HISTORY</button>`;
  }

  function detailMarkup(row){
    if(!row)return'<div class="find-retention-empty">That daily result is not available.</div>';
    const perfect=row.officialScore>=row.maxScore;
    return`<article class="find-retention-detail"><h3>${perfect?'Perfect 10':`${row.officialScore}/${row.maxScore}`} · ${esc(dayLabel(row.day,{weekday:true,year:true}))}</h3><p>${perfect?'You left the verified leader standing and cleared all nine eliminations.':'Your first completed attempt is the official daily score. Replays can improve the best score without changing placement.'}</p><div class="find-retention-detail-grid"><div><span>OFFICIAL</span><strong>${row.officialScore}/${row.maxScore}</strong></div><div><span>BEST</span><strong>${row.bestScore}/${row.maxScore}</strong></div><div><span>PLACE</span><strong>${row.rank?`#${row.rank}`:'—'}</strong></div><div><span>FIELD</span><strong>${row.playerCount||'—'}</strong></div></div>${row.completedAt?`<p>Completed ${esc(dateTimeLabel(row.completedAt))} · ${row.attemptCount||1} attempt${row.attemptCount===1?'':'s'}.</p>`:''}</article>`;
  }

  function openHistory(day=''){
    closeHistory();state.historyOpen=true;
    const rows=history();const selected=rows.find(row=>row.day===day)||rows[0]||null;const stats=streaks(rows);
    const overlay=document.createElement('div');overlay.className='find-retention-overlay';overlay.dataset.findRetentionOverlay='true';
    overlay.innerHTML=`<section class="find-retention-panel" role="dialog" aria-modal="true" aria-labelledby="findRetentionTitle"><header><div><span>PHASE 2B · DAILY HISTORY</span><strong id="findRetentionTitle">Find the Leader</strong></div><button type="button" aria-label="Close daily history" data-find-history-close>×</button></header><div class="find-retention-panel-body"><div class="find-retention-metrics"><div class="find-retention-metric"><span>CURRENT STREAK</span><strong>${stats.current}</strong><small>Days</small></div><div class="find-retention-metric"><span>BEST STREAK</span><strong>${stats.best}</strong><small>Days</small></div><div class="find-retention-metric"><span>PERFECT 10s</span><strong>${stats.perfect}</strong><small>Official</small></div><div class="find-retention-metric"><span>NEXT RESET</span><strong data-find-countdown>${countdownText()}</strong><small>Midnight Central</small></div></div>${detailMarkup(selected)}${calendarMarkup(rows,35)}${recentMarkup(rows,35)}</div></section>`;
    document.body.appendChild(overlay);document.body.style.overflow='hidden';
    overlay.addEventListener('click',event=>{if(event.target===overlay||event.target.closest('[data-find-history-close]'))closeHistory();});
  }
  function closeHistory(){document.querySelector('[data-find-retention-overlay]')?.remove();state.historyOpen=false;if(!document.querySelector('.profile-activity-overlay,.app-profile-overlay'))document.body.style.overflow='';}

  function bind(){
    if(state.bound)return;state.bound=true;
    window.addEventListener('ufc-play-game-complete',event=>saveAttempt(event.detail||{}));
    window.addEventListener('ufc-play-hub-ready',()=>{ensurePlayCard();refresh({days:HISTORY_DAYS});});
    window.addEventListener('ufc-play-daily-rotation-ready',()=>{ensurePlayCard();renderAll();});
    window.addEventListener('ufc-find-leader-history-open',event=>openHistory(event.detail?.day||''));
    document.addEventListener('click',event=>{
      const dayButton=event.target.closest?.('[data-find-history-day]');if(dayButton){openHistory(dayButton.dataset.findHistoryDay);return;}
      if(event.target.closest?.('[data-find-history-open]'))openHistory();
    });
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&state.historyOpen)closeHistory();});
    window.addEventListener('ufc-play-profile-ready',event=>{state.identity=event.detail||null;refresh({days:HISTORY_DAYS});});
    window.addEventListener('ufc-app-profile-updated',event=>{state.identity=event.detail?.identity||state.identity;refresh({days:HISTORY_DAYS,force:true});});
  }

  function updateCountdowns(){document.querySelectorAll('[data-find-countdown]').forEach(node=>node.textContent=countdownText());ensureHomeStatus();}
  function renderAll(){installStyles();ensurePlayCard();ensureHomeStatus();ensureResultCard();updateCountdowns();}
  function start(){installStyles();bind();state.rows=mergeRows(readLedger(),localDailyRows());renderAll();refresh({days:HISTORY_DAYS});clearInterval(state.countdownTimer);state.countdownTimer=setInterval(updateCountdowns,1000);}

  window.UFC_FIND_LEADER_RETENTION={version:VERSION,refresh,history,streaks,openHistory,closeHistory,saveAttempt,centralDay,countdownText,get rows(){return history();}};
  document.documentElement.setAttribute('data-find-leader-retention',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
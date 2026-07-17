(function(){
  'use strict';

  const VERSION='find-leader-experience-20260717a-endless-control-center';
  const SESSION_KEY='ufc-find-leader-endless-session-v1';
  const RECENT_KEY='ufc-find-leader-recent-questions-v1';
  const RECENT_LIMIT=14;
  const AUDIT_ENABLED=new URLSearchParams(location.search).get('findLeaderAudit')==='1'||new URLSearchParams(location.search).get('audit')==='1';
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const safeParse=(value,fallback)=>{try{return JSON.parse(value);}catch(_error){return fallback;}};
  const defaultSession=()=>({completed:0,perfects:0,totalScore:0,bestScore:0,history:[],filter:'all'});
  let session={...defaultSession(),...safeParse(sessionStorage.getItem(SESSION_KEY),{})};
  let mode='idle';
  let currentSetup=null;
  let recordedCurrent=false;
  let originalOpen=null;
  let originalStartGame=null;
  let decorating=false;
  let observer=null;

  function saveSession(){sessionStorage.setItem(SESSION_KEY,JSON.stringify(session));}
  function recentStored(){const value=safeParse(localStorage.getItem(RECENT_KEY),[]);return Array.isArray(value)?value.map(String):[];}
  function combinedRecent(){return [...recentStored(),...(Array.isArray(session.history)?session.history:[])].slice(-RECENT_LIMIT);}
  function rememberQuestion(id){
    if(!id)return;
    const rows=[...recentStored(),String(id)].slice(-RECENT_LIMIT);
    localStorage.setItem(RECENT_KEY,JSON.stringify(rows));
    session.history=[...(Array.isArray(session.history)?session.history:[]),String(id)].slice(-RECENT_LIMIT);
  }
  function average(){return session.completed?Math.round((session.totalScore/session.completed)*10)/10:0;}
  function filters(){return window.UFC_FIND_LEADER_QUESTION_BANK?.filters||{all:{label:'All'}};}
  function filterLabel(){return filters()[session.filter]?.label||'All';}
  function panel(){return document.getElementById('playFindLeaderPanel');}
  function game(){return window.UFC_FIND_LEADER;}
  function bank(){return window.UFC_FIND_LEADER_QUESTION_BANK;}

  function sessionStats(){
    return `<div class="find-leader-session-stats">
      <span><small>QUESTIONS</small><strong>${session.completed}</strong></span>
      <span><small>PERFECT 10s</small><strong>${session.perfects}</strong></span>
      <span><small>AVG SCORE</small><strong>${average()}</strong></span>
      <span><small>BEST</small><strong>${session.bestScore||'—'}</strong></span>
    </div>`;
  }
  function filterButtons(){
    return Object.entries(filters()).map(([id,row])=>`<button type="button" data-find-leader-filter="${esc(id)}" class="${session.filter===id?'active':''}">${esc(row.label)}</button>`).join('');
  }
  function sourceLabel(setup=currentSetup){return setup?.sourceLabel||({
    'official-record-book':'UFC Record Book','main-event-ledger':'Main-Event Ledger','canonical-ledger':'Canonical Fight Ledger'
  }[setup?.sourceType]||setup?.source?.name||'Verified UFC data');}
  function sourceStrip(){
    const grade=currentSetup?.qualityGrade||'Verified';
    return `<div class="find-leader-source-strip"><span>${esc(sourceLabel())}</span><b>${esc(grade)}</b><small>${Number(currentSetup?.fullPoolCount||currentSetup?.decoyPoolSize||10)} verified performers in pool</small></div>`;
  }
  function sessionBar(){
    return `<section class="find-leader-session-bar" data-find-leader-session-bar>
      <div><span>ENDLESS MODE</span><strong>Question ${session.completed+1}</strong><small>No repeats inside your previous 14 boards.</small></div>
      ${sessionStats()}
      <div class="find-leader-family-filters" aria-label="Find the Leader category filter">${filterButtons()}</div>
      ${AUDIT_ENABLED?'<button type="button" class="find-leader-audit-button" data-find-leader-audit>CONTROL CENTER</button>':''}
    </section>`;
  }

  function decoratePlaying(){
    const host=panel();
    if(!host||host.hidden||game()?.state?.phase!=='playing')return;
    if(mode==='endless'||mode==='replay'){
      if(!host.querySelector('[data-find-leader-session-bar]'))host.insertAdjacentHTML('afterbegin',sessionBar());
    }
    const hero=host.querySelector('.find-leader-hero');
    if(hero&&!hero.querySelector('.find-leader-source-strip'))hero.querySelector('div')?.insertAdjacentHTML('beforeend',sourceStrip());
  }
  function sortedCandidates(){return [...(Array.isArray(currentSetup?.candidates)?currentSetup.candidates:[])].sort((a,b)=>Number(b.value)-Number(a.value)||String(a.name).localeCompare(String(b.name)));}
  function deepestDecoy(){return sortedCandidates().filter(row=>row.id!==currentSetup?.leaderId).sort((a,b)=>Number(b.statRank||0)-Number(a.statRank||0))[0]||null;}
  function resultInsights(){
    const margin=Number(currentSetup?.leaderMargin);
    const second=currentSetup?.secondName||'second place';
    const deep=deepestDecoy();
    return `<section class="find-leader-result-insights" data-find-leader-result-insights>
      <article><span>LEADER MARGIN</span><strong>${Number.isFinite(margin)?`+${margin}`:'—'}</strong><small>${esc(currentSetup?.leaderMargin==null?'Global runner-up unavailable':`over ${second} (${Number(currentSetup?.secondValue||0)})`)}</small></article>
      <article><span>SOURCE</span><strong>${esc(sourceLabel())}</strong><small>${esc(currentSetup?.qualityGrade||'Verified')} board quality</small></article>
      <article><span>DEEPEST DECOY</span><strong>${esc(deep?.name||'—')}</strong><small>${deep?.statRank?`#${Number(deep.statRank)} in the full stat pool`:'Displayed hard-pool candidate'}</small></article>
      <article class="session"><span>ENDLESS SESSION</span><strong>${session.completed} played · ${session.perfects} perfect</strong><small>${average()} average · best ${session.bestScore||'—'} · ${esc(filterLabel())} filter</small></article>
    </section>`;
  }
  function decorateRanks(){
    const tiles=panel()?.querySelectorAll('.find-leader-reveal-tile')||[];
    const rows=sortedCandidates();
    tiles.forEach((tile,index)=>{const label=tile.querySelector('span>b');const rank=rows[index]?.statRank;if(label&&rank)label.textContent=`#${Number(rank)}`;});
  }
  function decorateFinish(){
    const host=panel();
    if(!host||host.hidden||game()?.state?.phase!=='complete')return;
    const hero=host.querySelector('.find-leader-result-hero');
    if(hero&&!host.querySelector('[data-find-leader-result-insights]'))hero.insertAdjacentHTML('afterend',resultInsights());
    decorateRanks();
    if(mode==='endless'||mode==='replay'){
      const actions=host.querySelector('.find-leader-actions');
      if(actions&&!actions.querySelector('[data-find-leader-next]')){
        const challenge=actions.querySelector('[data-find-leader-challenge]');
        if(challenge)challenge.className='find-leader-secondary';
        actions.insertAdjacentHTML('afterbegin','<button type="button" class="find-leader-primary" data-find-leader-next>NEXT QUESTION</button>');
      }
      const replay=actions?.querySelector('[data-find-leader-replay]');
      if(replay){replay.removeAttribute('data-find-leader-replay');replay.setAttribute('data-find-leader-replay-board','');replay.textContent='REPLAY BOARD';}
      if(AUDIT_ENABLED&&!actions?.querySelector('[data-find-leader-audit]'))actions?.insertAdjacentHTML('beforeend','<button type="button" class="find-leader-secondary" data-find-leader-audit>CONTROL CENTER</button>');
    }
  }
  function decorate(){
    if(decorating)return;
    decorating=true;
    try{decoratePlaying();decorateFinish();}finally{decorating=false;}
  }
  function scheduleDecorate(){requestAnimationFrame(()=>requestAnimationFrame(decorate));}

  function nextSetup(){
    return bank()?.endless?.({history:combinedRecent(),filter:session.filter,slot:session.completed,random:Math.random})||bank()?.random?.()||null;
  }
  function startEndless({replay=false}={}){
    const setup=replay?clone(currentSetup):nextSetup();
    if(!setup)return false;
    mode=replay?'replay':'endless';
    currentSetup=clone(setup);
    recordedCurrent=false;
    originalOpen({setup});
    scheduleDecorate();
    return true;
  }
  function wrappedOpen(options={}){
    const normalized=options&&typeof options==='object'?options:{};
    if(normalized.daily){mode='daily';currentSetup=clone(normalized.setup||null);recordedCurrent=false;const result=originalOpen(normalized);scheduleDecorate();return result;}
    if(normalized.setup||normalized.questionId){mode='single';currentSetup=clone(normalized.setup||null);recordedCurrent=false;const result=originalOpen(normalized);scheduleDecorate();return result;}
    return startEndless();
  }
  function wrappedStartGame(options={}){
    const normalized=options&&typeof options==='object'?options:{};
    if(normalized.daily||normalized.setup||normalized.questionId)return originalStartGame(normalized);
    return startEndless();
  }
  function recordCompletion(detail){
    if(mode!=='endless'||recordedCurrent||detail?.daily)return;
    recordedCurrent=true;
    const score=Number(detail?.score||0);
    session.completed+=1;
    session.totalScore+=score;
    session.bestScore=Math.max(Number(session.bestScore||0),score);
    if(score===10||detail?.result?.perfect)session.perfects+=1;
    rememberQuestion(currentSetup?.questionId||detail?.result?.questionId);
    saveSession();
  }

  function centralDay(){
    try{
      const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
      const map=Object.fromEntries(parts.map(part=>[part.type,part.value]));
      return `${map.year}-${map.month}-${map.day}`;
    }catch(_error){return new Date().toISOString().slice(0,10);}
  }
  function nextScheduleMap(){
    const map=new Map();
    (bank()?.dailyPlan?.(centralDay(),180)||[]).forEach(row=>{if(row.questionId&&!map.has(row.questionId))map.set(row.questionId,row.day);});
    return map;
  }
  function auditSummary(audit){
    const counts=audit.gradeCounts||{};
    return `<section class="find-leader-audit-kpis">
      <article><span>AUTHORED</span><strong>${Number(audit.definitionCount||0)}</strong></article>
      <article><span>PLAYABLE</span><strong>${Number(audit.playable?.length||0)}</strong></article>
      <article><span>ELITE</span><strong>${Number(counts.Elite||0)}</strong></article>
      <article><span>GOOD</span><strong>${Number(counts.Good||0)}</strong></article>
      <article><span>NEEDS REVIEW</span><strong>${Number(counts['Needs review']||0)}</strong></article>
      <article><span>EXCLUDED</span><strong>${Number(counts.Excluded||0)}</strong></article>
    </section>`;
  }
  function auditRow(row,nextDate){
    const quality=row.quality||{},definition=row.definition||{},leader=quality.leader,second=quality.second;
    const status=row.valid?'ACTIVE':'EXCLUDED';
    const issues=quality.issues?.length?quality.issues.map(issue=>`<li>${esc(issue)}</li>`).join(''):'<li>No automatic quality flags.</li>';
    const pool=quality.topPool?.length?quality.topPool.map(item=>`<span><b>#${Number(item.statRank)}</b>${esc(item.name)} <em>${Number(item.value)}</em></span>`).join(''):'<span>No verified pool available.</span>';
    return `<details class="find-leader-audit-row grade-${esc(String(quality.grade||'excluded').toLowerCase().replace(/\s+/g,'-'))}" data-audit-row data-grade="${esc(quality.grade||'Excluded')}" data-family="${esc(definition.family||'other')}" data-search="${esc(`${definition.question||''} ${definition.id||''} ${leader?.name||''}`.toLowerCase())}">
      <summary><b>${esc(quality.grade||'Excluded')}</b><span><strong>${esc(definition.question||definition.id||'Unknown question')}</strong><small>${esc(definition.family||'other')} · ${esc(quality.sourceLabel||'Unknown source')} · ${status}</small></span><em>${leader?`${esc(leader.name)} · ${Number(leader.value)}`:esc(row.reason||'Unavailable')}</em></summary>
      <div class="find-leader-audit-detail">
        <section><span>LEADER</span><strong>${esc(leader?.name||'—')} ${leader?`(${Number(leader.value)})`:''}</strong><small>${second?`${esc(second.name)} is second at ${Number(second.value)} · margin ${Number(quality.leaderMargin||0)}`:'No runner-up available'}</small></section>
        <section><span>BOARD DEPTH</span><strong>${Number(quality.positivePoolCount||0)} positive performers</strong><small>${Number(quality.uniqueTopTenValues||0)} unique values in top 10 · ${Number(quality.missingPhotos||0)} missing photos</small></section>
        <section><span>NEXT DAILY APPEARANCE</span><strong>${esc(nextDate||'Not in next 180 selections')}</strong><small>${esc(definition.id||'')}</small></section>
        <section class="issues"><span>FLAGS</span><ul>${issues}</ul></section>
        <section class="pool"><span>FULL TOP POOL</span><div>${pool}</div></section>
      </div>
    </details>`;
  }
  function ensureControlPanel(){
    const shell=document.querySelector('#play .play-shell');
    if(!shell)return null;
    let control=document.getElementById('playFindLeaderControlCenter');
    if(!control){control=document.createElement('section');control.id='playFindLeaderControlCenter';control.className='find-leader-control-center play-panel';control.hidden=true;shell.appendChild(control);}
    return control;
  }
  function renderAudit(){
    const control=ensureControlPanel(),audit=bank()?.refreshAudit?.()||bank()?.audit?.();
    if(!control||!audit)return false;
    const schedule=nextScheduleMap();
    control.innerHTML=`<header class="find-leader-audit-hero"><div><span>INTERNAL CONTROL CENTER</span><h2>Find the Leader Audit</h2><p>Every authored question, its current production status, automatic board grade, verified leader, full stat pool, and next scheduled appearance.</p></div><button type="button" data-find-leader-audit-close>ALL GAMES</button></header>
      ${auditSummary(audit)}
      <section class="find-leader-audit-toolbar"><input type="search" placeholder="Search question or leader…" data-find-leader-audit-search><select data-find-leader-audit-grade><option value="all">All grades</option><option>Elite</option><option>Good</option><option>Needs review</option><option>Excluded</option></select><select data-find-leader-audit-family><option value="all">All families</option>${[...new Set(audit.rows.map(row=>row.definition?.family||'other'))].sort().map(family=>`<option>${esc(family)}</option>`).join('')}</select></section>
      <section class="find-leader-audit-list">${audit.rows.map(row=>auditRow(row,schedule.get(row.definition?.id))).join('')}</section>`;
    return true;
  }
  function filterAudit(){
    const control=ensureControlPanel();
    if(!control)return;
    const query=String(control.querySelector('[data-find-leader-audit-search]')?.value||'').trim().toLowerCase();
    const grade=String(control.querySelector('[data-find-leader-audit-grade]')?.value||'all');
    const family=String(control.querySelector('[data-find-leader-audit-family]')?.value||'all');
    control.querySelectorAll('[data-audit-row]').forEach(row=>{
      const visible=(!query||String(row.dataset.search||'').includes(query))&&(grade==='all'||row.dataset.grade===grade)&&(family==='all'||row.dataset.family===family);
      row.hidden=!visible;
    });
  }
  function openAudit(){
    const control=ensureControlPanel();
    if(!control||!renderAudit())return false;
    document.querySelectorAll('#play .play-panel').forEach(node=>{node.hidden=node!==control;});
    document.getElementById('playHub')?.setAttribute('hidden','');
    control.hidden=false;
    document.documentElement.setAttribute('data-play-screen','find-leader-control-center');
    control.scrollIntoView({block:'start'});
    return true;
  }
  function closeAudit(){
    ensureControlPanel()?.setAttribute('hidden','');
    window.UFC_PLAY_HUB?.showHub?.();
  }

  function bind(){
    const host=panel();
    if(host&&!observer){observer=new MutationObserver(scheduleDecorate);observer.observe(host,{childList:true,subtree:false});}
    document.addEventListener('click',event=>{
      const filter=event.target.closest?.('[data-find-leader-filter]');
      if(filter){event.preventDefault();event.stopImmediatePropagation();session.filter=filter.dataset.findLeaderFilter||'all';saveSession();startEndless();return;}
      if(event.target.closest?.('[data-find-leader-next]')){event.preventDefault();event.stopImmediatePropagation();startEndless();return;}
      if(event.target.closest?.('[data-find-leader-replay-board]')){event.preventDefault();event.stopImmediatePropagation();startEndless({replay:true});return;}
      if(event.target.closest?.('[data-find-leader-audit]')){event.preventDefault();event.stopImmediatePropagation();openAudit();return;}
      if(event.target.closest?.('[data-find-leader-audit-close]')){event.preventDefault();closeAudit();return;}
    },true);
    document.addEventListener('input',event=>{if(event.target.matches?.('[data-find-leader-audit-search]'))filterAudit();});
    document.addEventListener('change',event=>{if(event.target.matches?.('[data-find-leader-audit-grade],[data-find-leader-audit-family]'))filterAudit();});
    window.addEventListener('ufc-play-game-complete',event=>{
      if(event.detail?.gameType!=='find-leader')return;
      recordCompletion(event.detail);
      scheduleDecorate();
    });
  }

  function install(){
    const currentGame=game(),currentBank=bank();
    if(!currentGame||!currentBank?.endless||currentGame.experienceVersion===VERSION)return Boolean(currentGame?.experienceVersion===VERSION);
    originalOpen=currentGame.open.bind(currentGame);
    originalStartGame=currentGame.startGame.bind(currentGame);
    currentGame.open=wrappedOpen;
    currentGame.startGame=wrappedStartGame;
    currentGame.experienceVersion=VERSION;
    currentGame.openControlCenter=openAudit;
    currentGame.resetEndlessSession=()=>{session=defaultSession();saveSession();return clone(session);};
    bind();
    window.UFC_FIND_LEADER_EXPERIENCE={version:VERSION,openControlCenter:openAudit,closeControlCenter:closeAudit,startEndless,resetSession:currentGame.resetEndlessSession,get session(){return clone(session);}};
    document.documentElement.setAttribute('data-find-leader-experience',VERSION);
    scheduleDecorate();
    return true;
  }

  if(!install()){
    const timer=setInterval(()=>{if(install())clearInterval(timer);},80);
    setTimeout(()=>clearInterval(timer),20000);
    window.addEventListener('ufc-find-leader-quality-ready',install,{once:true});
  }
})();

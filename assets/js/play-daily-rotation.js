(function(){
  'use strict';

  const VERSION='play-daily-controller-20260717e-find-leader-permanent';
  const ORDER=['find-leader','keep-cut','better-than','blind','blind-rank','top10'];
  const DAILY=Object.freeze({
    id:'find-leader',
    gameType:'find-leader',
    gameVersion:'find-leader-daily-v1',
    maxScore:10,
    scored:true,
    title:'Find the Leader',
    description:'Eliminate nine fighters without removing the verified stat leader. One fatal pick ends the run.',
    details:['10 FIGHTERS','ONE VERIFIED LEADER','OFFICIAL LEADERBOARD'],
    visual:'leader'
  });

  let currentContext=null;
  let opening=false;
  const text=value=>String(value??'').trim();
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  function centralDay(date=new Date()){
    try{
      const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
      const map=Object.fromEntries(parts.map(part=>[part.type,part.value]));
      return `${map.year}-${map.month}-${map.day}`;
    }catch(_error){return date.toISOString().slice(0,10);}
  }

  function dateLabel(day=centralDay()){
    try{return new Intl.DateTimeFormat(undefined,{weekday:'short',month:'short',day:'numeric',timeZone:'America/Chicago'}).format(new Date(`${day}T12:00:00-05:00`)).toUpperCase();}
    catch(_error){return day;}
  }

  function titleFor(id){
    return ({
      'find-leader':'Find the Leader',
      'keep-cut':'Keep 4, Cut 4',
      'better-than':'Better Than…',
      'blind':'Blind Resume',
      'blind-rank':'Blind Rank 5',
      'top10':'Build Your Top 10'
    })[id]||'';
  }

  function cardFor(id){
    const hub=document.getElementById('playHub');
    if(!hub)return null;
    return hub.querySelector(`.play-game-card[data-open-game="${id}"]`)
      || [...hub.querySelectorAll('.play-game-card')].find(card=>card.querySelector('.play-game-copy strong')?.textContent.trim()===titleFor(id))
      || null;
  }

  function makeLive(card,id){
    if(!card)return;
    card.classList.remove('is-coming');
    card.classList.add('is-live');
    card.removeAttribute('data-coming-game');
    card.dataset.openGame=id;
    const status=card.querySelector('.play-game-card-top em');
    const action=card.querySelector('.play-game-action');
    if(status)status.textContent='PLAY NOW';
    if(action)action.textContent='OPEN GAME →';
  }

  function reorderGames(){
    const grid=document.querySelector('#playHub .play-game-grid');
    if(!grid)return false;
    ORDER.forEach(id=>{
      const card=cardFor(id);
      makeLive(card,id);
      if(card)grid.appendChild(card);
    });
    const api=window.UFC_PLAY_HUB;
    if(Array.isArray(api?.games)){
      const rows=new Map(api.games.map(game=>[game.id,game]));
      api.games.splice(0,api.games.length,...ORDER.map(id=>rows.get(id)).filter(Boolean));
    }
    document.documentElement.setAttribute('data-play-game-order',ORDER.join('|'));
    return true;
  }

  function bindDailyCard(card){
    if(!card||card.dataset.findLeaderPermanentBound==='true')return;
    card.dataset.findLeaderPermanentBound='true';
    card.addEventListener('click',event=>{
      if(event.target.closest('a,button,input,select,textarea'))return;
      openDaily();
    });
    card.addEventListener('keydown',event=>{
      if(event.key!=='Enter'&&event.key!==' ')return;
      event.preventDefault();
      openDaily();
    });
  }

  function updateDailyCard(context=null){
    if(context?.game_type==='find-leader')currentContext=context;
    const day=text(currentContext?.challenge_day)||centralDay();
    const card=document.querySelector('#playHub .play-daily-card');
    if(!card)return false;

    card.querySelectorAll('.play-daily-button,[data-daily-board-open]').forEach(node=>node.remove());
    card.querySelectorAll('.play-daily-actions').forEach(node=>{if(!node.children.length)node.remove();});

    const date=card.querySelector('#playDailyDate');
    const title=card.querySelector('#playDailyTitle');
    const copy=card.querySelector('.play-daily-copy>p');
    const details=card.querySelector('.play-daily-details');
    const visual=card.querySelector('.play-daily-visual');
    if(date)date.textContent=dateLabel(day);
    if(title)title.textContent=DAILY.title;
    if(copy)copy.textContent=DAILY.description;
    if(details)details.innerHTML=DAILY.details.map(item=>`<span>${esc(item)}</span>`).join('');
    if(visual)visual.innerHTML='<span class="play-daily-fighter">10</span><strong>→</strong><span class="play-daily-fighter">1</span><small>LEAVE THE LEADER</small>';

    let hint=card.querySelector('.play-daily-swipe-hint');
    if(!hint){hint=document.createElement('span');hint.className='play-daily-swipe-hint';card.appendChild(hint);}
    hint.textContent='TAP TO PLAY · SWIPE FOR LEADERBOARD →';
    card.dataset.dailyGame='find-leader';
    card.dataset.dailyRotationCard='true';
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    card.setAttribute('aria-label',"Play today's Find the Leader. Swipe for today's leaderboard.");
    bindDailyCard(card);

    document.documentElement.setAttribute('data-daily-game','find-leader');
    window.dispatchEvent(new CustomEvent('ufc-play-daily-rotation-ready',{detail:{day,daily:DAILY,context:currentContext,permanent:true}}));
    return true;
  }

  async function prepareContext(){
    const shared=window.UFC_PLAY_SHARED;
    if(!shared?.dailyContext){updateDailyCard();return null;}
    try{
      currentContext=await shared.dailyContext(DAILY.gameType,DAILY.gameVersion,DAILY.maxScore);
    }catch(_error){currentContext=null;}
    updateDailyCard(currentContext);
    return currentContext;
  }

  async function openDaily(){
    if(opening)return false;
    opening=true;
    try{
      if(window.UFC_PLAY_HUB?.openDailyChallenge){
        await window.UFC_PLAY_HUB.openDailyChallenge();
        return true;
      }
      if(window.UFC_PLAY_HUB?.openGame){
        await window.UFC_PLAY_HUB.openGame('find-leader',{daily:true});
        return true;
      }
      return false;
    }finally{opening=false;}
  }

  function apply(){
    reorderGames();
    updateDailyCard(currentContext);
  }

  window.UFC_PLAY_DAILY_ROTATION={
    version:VERSION,
    permanent:true,
    order:[...ORDER],
    centralDay,
    dailyFor:()=>DAILY,
    openDaily,
    updateDailyCard,
    reorderGames,
    get current(){return DAILY;},
    get context(){return currentContext;}
  };

  document.documentElement.setAttribute('data-play-daily-rotation',VERSION);
  document.documentElement.setAttribute('data-daily-game','find-leader');
  window.addEventListener('ufc-play-hub-ready',()=>{apply();prepareContext();},{once:true});
  window.addEventListener('ufc-play-shared-ready',()=>prepareContext(),{once:true});

  if(document.getElementById('playHub')){
    apply();
    window.setTimeout(()=>prepareContext(),0);
  }else{
    [100,400,1000].forEach(delay=>window.setTimeout(apply,delay));
  }
})();
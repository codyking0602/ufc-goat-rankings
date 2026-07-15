(function(){
  'use strict';

  const VERSION='blind-rank-20260715a-phase-three';
  const STORAGE_KEY='ufc-goat-blind-rank-v1';
  const SITE_TITLE='UFC Blind Rank 5';
  const PLAY_DATA=window.UFC_PLAY_DATA;
  const play=document.getElementById('play');
  const shell=play?.querySelector('.play-shell');
  const hub=document.getElementById('playHub');
  const gameNav=document.getElementById('playGameNav');
  if(!PLAY_DATA||!play||!shell||!hub||!gameNav)return;

  const PACKS=[
    {id:'men-chaos',name:'Men’s UFC Chaos',description:'Legends, contenders, cult favorites, and total wildcards.',filters:{gender:'men'}},
    {id:'all-chaos',name:'All UFC Chaos',description:'The entire men’s and women’s Play roster is live.',filters:{}},
    {id:'women-chaos',name:'Women’s UFC Chaos',description:'Champions, contenders, stars, and curveballs.',filters:{gender:'women'}},
    {id:'lightweight',name:'Lightweight Roulette',description:'One division. Absolutely no safe slot.',filters:{gender:'men',division:'Lightweight'}},
    {id:'welterweight',name:'Welterweight Roulette',description:'A deep division with every kind of UFC career.',filters:{gender:'men',division:'Welterweight'}},
    {id:'heavyweight',name:'Heavyweight Roulette',description:'Champions, sluggers, veterans, and chaos agents.',filters:{gender:'men',division:'Heavyweight'}},
    {id:'early-ufc',name:'Early UFC Chaos',description:'Tournament-era names from the wild beginning.',filters:{gender:'men',era:'tournament'}}
  ];

  const state={
    packId:'men-chaos',
    lineup:[],
    placements:Array(5).fill(null),
    currentIndex:0,
    completed:false,
    shared:false
  };

  function esc(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
  function initials(name){return String(name||'').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase()||'UFC';}
  function packFor(id){return PACKS.find(pack=>pack.id===id)||PACKS[0];}
  function shuffled(values){
    const items=[...values];
    for(let index=items.length-1;index>0;index-=1){
      const swap=Math.floor(Math.random()*(index+1));
      [items[index],items[swap]]=[items[swap],items[index]];
    }
    return items;
  }
  function randomItem(items){return items.length?items[Math.floor(Math.random()*items.length)]:null;}

  function injectStyles(){
    if(document.getElementById('blind-rank-phase-three-css'))return;
    const style=document.createElement('style');
    style.id='blind-rank-phase-three-css';
    style.textContent=`
      #playBlindRankPanel[hidden]{display:none!important}
      #play .br-wrap{display:grid;gap:12px;color:#f8fafc}
      #play .br-intro{display:flex;justify-content:space-between;align-items:end;gap:18px;border:1px solid rgba(249,115,22,.55);border-radius:20px;background:linear-gradient(135deg,#29364b,#182236 62%,#101522);padding:17px}
      #play .br-kicker{display:block;color:#facc15;font-size:10px;font-weight:950;letter-spacing:.13em}
      #play .br-intro h3{margin:5px 0 0;color:#fff;font-size:27px;line-height:1}
      #play .br-intro p{max-width:650px;margin:7px 0 0;color:#cbd5e1;font-size:12px;line-height:1.45}
      #play .br-pack-control{display:grid;grid-template-columns:minmax(180px,1fr) auto;gap:7px;min-width:330px}
      #play .br-pack-control select,#play .br-pack-control button{min-height:42px;border-radius:12px;font:850 11px/1 system-ui}
      #play .br-pack-control select{border:1px solid #526786;background:#101725;color:#f8fafc;padding:0 10px}
      #play .br-pack-control button{border:1px solid #f97316;background:#f97316;color:#111827;padding:0 12px;cursor:pointer}
      #play .br-game-card{display:grid;gap:13px;border:1px solid #4b5f7e;border-radius:21px;background:linear-gradient(180deg,#223047,#172033);padding:15px}
      #play .br-progress{display:flex;justify-content:space-between;gap:10px;align-items:center}
      #play .br-progress strong{color:#facc15;font-size:11px;letter-spacing:.08em}
      #play .br-progress span{color:#cbd5e1;font-size:11px}
      #play .br-slots{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px}
      #play .br-slot{position:relative;min-height:116px;border:1px solid #526786;border-radius:15px;background:#101725;color:#f8fafc;padding:8px;text-align:left;cursor:pointer;overflow:hidden}
      #play .br-slot.empty:hover{border-color:#f97316;background:#172033;transform:translateY(-1px)}
      #play .br-slot:disabled{cursor:default}
      #play .br-slot-number{position:absolute;top:8px;left:9px;color:#facc15;font-size:18px;font-weight:950;z-index:2}
      #play .br-slot.empty{display:flex;align-items:center;justify-content:center;color:#64748b;font-size:10px;font-weight:900;letter-spacing:.08em}
      #play .br-slot-fighter{display:grid;justify-items:center;gap:6px;padding-top:17px;text-align:center}
      #play .br-slot-fighter strong{max-width:100%;color:#fff;font-size:11px;line-height:1.12;overflow:hidden;text-overflow:ellipsis}
      #play .br-mini-photo{width:52px;height:52px;border:1px solid #475569;border-radius:13px;overflow:hidden;background:#26364e;display:flex;align-items:center;justify-content:center;color:#e2e8f0;font-weight:950}
      #play .br-mini-photo img,#play .br-current-photo img,#play .br-result-photo img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block}
      #play .br-current{display:grid;grid-template-columns:minmax(135px,.55fr) minmax(0,1.45fr);gap:15px;align-items:center;border:1px solid rgba(250,204,21,.42);border-radius:18px;background:radial-gradient(circle at 18% 25%,rgba(249,115,22,.18),transparent 42%),#0f1624;padding:15px}
      #play .br-current-photo{width:100%;max-width:220px;aspect-ratio:1/1;border:1px solid rgba(250,204,21,.45);border-radius:18px;overflow:hidden;background:linear-gradient(180deg,#35445d,#172033);display:flex;align-items:center;justify-content:center;color:#f8fafc;font-size:48px;font-weight:950;margin:auto}
      #play .br-current-copy>span{display:block;color:#facc15;font-size:10px;font-weight:950;letter-spacing:.11em}
      #play .br-current-copy h4{margin:6px 0 0;color:#fff;font-size:32px;line-height:.98}
      #play .br-current-copy p{margin:8px 0 0;color:#cbd5e1;font-size:12px;line-height:1.4}
      #play .br-current-meta{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px}
      #play .br-current-meta b{border:1px solid #526786;border-radius:999px;background:#172033;padding:5px 8px;color:#dbe5f3;font-size:9px;letter-spacing:.04em}
      #play .br-current-instruction{margin-top:13px;color:#fdba74;font-size:11px;font-weight:900}
      #play .br-finish{display:grid;gap:12px}
      #play .br-finish-hero{text-align:center;border:1px solid rgba(250,204,21,.5);border-radius:18px;background:linear-gradient(135deg,rgba(250,204,21,.1),rgba(249,115,22,.08));padding:17px}
      #play .br-finish-hero span{color:#facc15;font-size:10px;font-weight:950;letter-spacing:.12em}
      #play .br-finish-hero h4{margin:5px 0 0;color:#fff;font-size:27px}
      #play .br-finish-hero p{margin:7px auto 0;max-width:600px;color:#cbd5e1;font-size:12px;line-height:1.4}
      #play .br-results{display:grid;gap:6px}
      #play .br-result-row{display:grid;grid-template-columns:42px 48px minmax(0,1fr) auto;gap:9px;align-items:center;border:1px solid #465a78;border-radius:14px;background:#101725;padding:7px 9px}
      #play .br-result-rank{color:#facc15;font-size:20px;font-weight:950;text-align:center}
      #play .br-result-photo{width:48px;height:48px;border-radius:12px;overflow:hidden;background:#26364e;display:flex;align-items:center;justify-content:center;color:#e2e8f0;font-weight:950}
      #play .br-result-copy strong,#play .br-result-copy small{display:block}
      #play .br-result-copy strong{color:#fff;font-size:14px}
      #play .br-result-copy small{margin-top:3px;color:#94a3b8;font-size:10px}
      #play .br-result-row em{border-radius:999px;background:#26364e;padding:5px 7px;color:#cbd5e1;font-size:8px;font-style:normal;font-weight:950;letter-spacing:.04em}
      #play .br-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
      #play .br-actions button{min-height:43px;border-radius:12px;font:950 10px/1 system-ui;letter-spacing:.04em;cursor:pointer}
      #play .br-actions .primary{border:1px solid #f97316;background:#f97316;color:#111827}
      #play .br-actions .secondary{border:1px solid #526786;background:#101725;color:#f8fafc}
      #play .br-toast{position:fixed;left:50%;bottom:22px;z-index:1000;transform:translate(-50%,14px);opacity:0;pointer-events:none;border:1px solid rgba(250,204,21,.5);border-radius:999px;background:#101725;padding:9px 13px;color:#fde68a;font-size:11px;font-weight:900;transition:.18s ease}
      #play .br-toast.show{opacity:1;transform:translate(-50%,0)}
      @media(max-width:700px){
        #play .br-intro{display:grid;align-items:start;padding:14px}
        #play .br-intro h3{font-size:23px}
        #play .br-pack-control{min-width:0;grid-template-columns:1fr auto}
        #play .br-slots{grid-template-columns:repeat(5,minmax(57px,1fr));gap:4px;overflow-x:auto;padding-bottom:2px}
        #play .br-slot{min-height:91px;padding:5px}
        #play .br-slot-number{top:5px;left:6px;font-size:15px}
        #play .br-mini-photo{width:38px;height:38px;border-radius:9px}
        #play .br-slot-fighter{gap:4px;padding-top:15px}
        #play .br-slot-fighter strong{font-size:8px}
        #play .br-current{grid-template-columns:92px minmax(0,1fr);gap:11px;padding:12px}
        #play .br-current-photo{width:92px;border-radius:15px;font-size:34px}
        #play .br-current-copy h4{font-size:24px}
        #play .br-current-copy p{font-size:10px}
        #play .br-current-meta{margin-top:8px}
        #play .br-current-meta b{font-size:7px;padding:4px 6px}
        #play .br-current-instruction{margin-top:9px;font-size:9px}
        #play .br-actions{grid-template-columns:1fr}
        #play .br-result-row{grid-template-columns:34px 42px minmax(0,1fr)}
        #play .br-result-photo{width:42px;height:42px}
        #play .br-result-row em{display:none}
      }
    `;
    document.head.appendChild(style);
  }

  function visual(fighter,className){
    const url=fighter?.thumbUrl||fighter?.profileUrl||'';
    return `<span class="${className}">${url?`<img src="${esc(url)}" alt="${esc(fighter.name)}">`:`<span>${esc(initials(fighter?.name))}</span>`}</span>`;
  }

  function eraLabel(fighter){
    const id=fighter?.eras?.[0];
    const era=window.UFC_ERA_FILTER_DATA?.byId?.[id];
    return era?.name||'';
  }

  function poolForPack(pack){
    return PLAY_DATA.poolFor('blind-rank',pack.filters||{});
  }

  function buildLineup(packId){
    const pack=packFor(packId);
    const pool=poolForPack(pack);
    if(pool.length<5)return [];
    const selected=[];
    const remaining=[...pool];
    ['legend','elite','contender','recognizable','wildcard'].forEach(tier=>{
      const candidates=remaining.filter(fighter=>fighter.selectionTier===tier);
      const fighter=randomItem(candidates);
      if(!fighter)return;
      selected.push(fighter);
      remaining.splice(remaining.findIndex(row=>row.id===fighter.id),1);
    });
    while(selected.length<5&&remaining.length){
      const fighter=randomItem(remaining);
      selected.push(fighter);
      remaining.splice(remaining.findIndex(row=>row.id===fighter.id),1);
    }
    return shuffled(selected.slice(0,5));
  }

  function saveState(){
    try{
      localStorage.setItem(STORAGE_KEY,JSON.stringify({
        packId:state.packId,
        lineup:state.lineup.map(fighter=>fighter.id),
        placements:state.placements.map(fighter=>fighter?.id||null),
        currentIndex:state.currentIndex,
        completed:state.completed
      }));
    }catch(_error){}
  }

  function restoreState(){
    try{
      const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
      if(!saved||!Array.isArray(saved.lineup)||saved.lineup.length!==5)return false;
      const lineup=saved.lineup.map(id=>PLAY_DATA.resolve(id));
      if(lineup.some(fighter=>!fighter)||new Set(lineup.map(fighter=>fighter.id)).size!==5)return false;
      const placements=Array.isArray(saved.placements)?saved.placements.slice(0,5).map(id=>id?PLAY_DATA.resolve(id):null):Array(5).fill(null);
      while(placements.length<5)placements.push(null);
      state.packId=packFor(saved.packId).id;
      state.lineup=lineup;
      state.placements=placements;
      state.currentIndex=Math.max(0,Math.min(5,Number(saved.currentIndex)||0));
      state.completed=Boolean(saved.completed&&state.currentIndex>=5&&placements.every(Boolean));
      return true;
    }catch(_error){return false;}
  }

  function challengeUrl(){
    const url=new URL(window.location.href);
    url.searchParams.delete('room');
    url.searchParams.set('game','blind-rank');
    url.searchParams.set('brpack',state.packId);
    url.searchParams.set('brlineup',state.lineup.map(fighter=>fighter.id).join(','));
    url.hash='play';
    return url.toString();
  }

  function parseSharedLineup(){
    const url=new URL(window.location.href);
    if(url.searchParams.get('game')!=='blind-rank')return null;
    const ids=(url.searchParams.get('brlineup')||'').split(',').map(value=>value.trim()).filter(Boolean);
    if(ids.length!==5||new Set(ids).size!==5)return null;
    const lineup=ids.map(id=>PLAY_DATA.resolve(id));
    if(lineup.some(fighter=>!fighter))return null;
    return {lineup,packId:packFor(url.searchParams.get('brpack')).id};
  }

  function startGame(options={}){
    const packId=packFor(options.packId||state.packId).id;
    const lineup=Array.isArray(options.lineup)&&options.lineup.length===5?options.lineup:buildLineup(packId);
    if(lineup.length!==5)return;
    state.packId=packId;
    state.lineup=lineup;
    state.placements=Array(5).fill(null);
    state.currentIndex=0;
    state.completed=false;
    state.shared=Boolean(options.shared);
    saveState();
    render();
  }

  function placeCurrent(slotIndex){
    if(state.completed||state.placements[slotIndex]||!state.lineup[state.currentIndex])return;
    state.placements[slotIndex]=state.lineup[state.currentIndex];
    state.currentIndex+=1;
    state.completed=state.currentIndex>=state.lineup.length;
    saveState();
    render();
  }

  function fighterMeta(fighter){
    const parts=[fighter.primaryDivision||fighter.divisions?.[0],eraLabel(fighter)].filter(Boolean);
    return parts.join(' · ')||'UFC Play roster';
  }

  function renderSlots(){
    return state.placements.map((fighter,index)=>fighter?`
      <button type="button" class="br-slot filled" disabled>
        <span class="br-slot-number">${index+1}</span>
        <span class="br-slot-fighter">${visual(fighter,'br-mini-photo')}<strong>${esc(fighter.name)}</strong></span>
      </button>`:`
      <button type="button" class="br-slot empty" data-br-slot="${index}">
        <span class="br-slot-number">${index+1}</span><span>PLACE HERE</span>
      </button>`).join('');
  }

  function renderCurrent(){
    const fighter=state.lineup[state.currentIndex];
    if(!fighter)return'';
    return `<div class="br-current">
      ${visual(fighter,'br-current-photo')}
      <div class="br-current-copy">
        <span>FIGHTER ${state.currentIndex+1} OF 5</span>
        <h4>${esc(fighter.name)}</h4>
        <p>${esc(fighterMeta(fighter))}</p>
        <div class="br-current-meta">
          <b>${esc(fighter.selectionTier.toUpperCase())} POOL</b>
          <b>${fighter.modelRanked?'GOAT MODEL ROSTER':'PLAY-ONLY ROSTER'}</b>
        </div>
        <div class="br-current-instruction">Choose an open slot. Once placed, it is locked.</div>
      </div>
    </div>`;
  }

  function renderFinish(){
    return `<div class="br-finish">
      <div class="br-finish-hero"><span>FINAL RANKING</span><h4>You survived the reveal</h4><p>There is no correct answer here. The fun is living with every locked decision.</p></div>
      <div class="br-results">${state.placements.map((fighter,index)=>`<div class="br-result-row">
        <div class="br-result-rank">#${index+1}</div>
        ${visual(fighter,'br-result-photo')}
        <div class="br-result-copy"><strong>${esc(fighter.name)}</strong><small>${esc(fighterMeta(fighter))}</small></div>
        <em>${fighter.modelRanked?'RANKED':'WILDCARD'}</em>
      </div>`).join('')}</div>
      <div class="br-actions">
        <button type="button" class="primary" data-br-share-result>SHARE MY RANKING</button>
        <button type="button" class="secondary" data-br-challenge>CHALLENGE A FRIEND</button>
        <button type="button" class="secondary" data-br-replay>NEW LINEUP</button>
      </div>
    </div>`;
  }

  function render(){
    const panel=document.getElementById('playBlindRankPanel');
    const target=document.getElementById('blindRankGame');
    const packSelect=document.getElementById('blindRankPack');
    if(!panel||!target)return;
    if(packSelect)packSelect.value=state.packId;
    const pack=packFor(state.packId);
    target.innerHTML=`<div class="br-game-card">
      <div class="br-progress"><strong>${state.completed?'COMPLETE':`LOCKED ${state.currentIndex} OF 5`}</strong><span>${esc(pack.name)}</span></div>
      <div class="br-slots">${renderSlots()}</div>
      ${state.completed?renderFinish():renderCurrent()}
    </div>`;
  }

  function showToast(message){
    const toast=document.getElementById('blindRankToast');
    if(!toast)return;
    toast.textContent=message;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer=window.setTimeout(()=>toast.classList.remove('show'),1500);
  }

  function resultText(){
    return `MY UFC BLIND RANK 5\n\n${state.placements.map((fighter,index)=>`${index+1}. ${fighter.name}`).join('\n')}\n\nThink you can handle the same lineup?`;
  }

  async function sharePayload(payload,success){
    try{
      if(navigator.share){await navigator.share(payload);return;}
      await navigator.clipboard.writeText([payload.text,payload.url].filter(Boolean).join('\n\n'));
      showToast(success||'Copied');
    }catch(error){
      if(error?.name!=='AbortError')showToast('Share failed');
    }
  }

  function shareResult(){return sharePayload({title:SITE_TITLE,text:resultText(),url:challengeUrl()},'Ranking copied');}
  function shareChallenge(){return sharePayload({title:'UFC Blind Rank Challenge',text:'Blind rank these same five UFC fighters. Every placement locks before the next reveal.',url:challengeUrl()},'Challenge link copied');}

  function ensurePanel(){
    let panel=document.getElementById('playBlindRankPanel');
    if(panel)return panel;
    panel=document.createElement('section');
    panel.id='playBlindRankPanel';
    panel.className='play-panel';
    panel.hidden=true;
    panel.innerHTML=`<div class="br-wrap">
      <div class="br-intro">
        <div><span class="br-kicker">BLIND RANK 5</span><h3>Rank their UFC careers</h3><p>You see one fighter at a time. Place each fighter from #1 to #5 before the next reveal.</p></div>
        <div class="br-pack-control"><select id="blindRankPack" aria-label="Blind Rank pack">${PACKS.map(pack=>`<option value="${esc(pack.id)}">${esc(pack.name)}</option>`).join('')}</select><button type="button" data-br-new>NEW LINEUP</button></div>
      </div>
      <div id="blindRankGame"></div>
      <div id="blindRankToast" class="br-toast" role="status" aria-live="polite"></div>
    </div>`;
    shell.appendChild(panel);
    panel.addEventListener('click',event=>{
      const slot=event.target.closest('[data-br-slot]');
      if(slot){placeCurrent(Number(slot.dataset.brSlot));return;}
      if(event.target.closest('[data-br-new],[data-br-replay]')){startGame({packId:document.getElementById('blindRankPack')?.value||state.packId});return;}
      if(event.target.closest('[data-br-share-result]')){shareResult();return;}
      if(event.target.closest('[data-br-challenge]'))shareChallenge();
    });
    panel.querySelector('#blindRankPack')?.addEventListener('change',event=>startGame({packId:event.target.value}));
    return panel;
  }

  function hideOtherPanels(){
    document.getElementById('playTop10Panel')?.setAttribute('hidden','');
    document.getElementById('playBlindPanel')?.setAttribute('hidden','');
  }

  function open(options={}){
    const panel=ensurePanel();
    hideOtherPanels();
    panel.hidden=false;
    hub.hidden=true;
    shell.hidden=false;
    gameNav.hidden=false;
    play.classList.add('play-game-active');
    const eyebrow=document.getElementById('playGameEyebrow');
    const title=document.getElementById('playGameTitle');
    if(eyebrow)eyebrow.textContent=options.shared?'FRIEND CHALLENGE':'BLIND RANK 5';
    if(title)title.textContent=options.shared?'Same Five. Your Ranking.':'Rank Their UFC Careers';
    document.documentElement.setAttribute('data-play-screen','blind-rank');
    if(options.lineup)startGame(options);
    else if(!state.lineup.length&&!restoreState())startGame({packId:state.packId});
    else render();
    gameNav.scrollIntoView({block:'start'});
  }

  function close(){
    const panel=document.getElementById('playBlindRankPanel');
    if(panel)panel.hidden=true;
  }

  function patchHub(){
    const card=[...hub.querySelectorAll('[data-coming-game]')].find(node=>node.dataset.comingGame==='Blind Rank 5');
    if(card){
      card.classList.remove('is-coming');
      card.classList.add('is-live');
      card.removeAttribute('data-coming-game');
      card.dataset.openGame='blind-rank';
      const status=card.querySelector('.play-game-card-top em');
      const action=card.querySelector('.play-game-action');
      if(status)status.textContent='PLAY NOW';
      if(action)action.textContent='OPEN GAME →';
    }

    hub.addEventListener('click',event=>{
      const trigger=event.target.closest('[data-open-game="blind-rank"]');
      if(!trigger)return;
      event.preventDefault();
      event.stopImmediatePropagation();
      open();
    },true);

    document.querySelectorAll('[data-play-mode="top10"],[data-play-mode="blind"]').forEach(button=>button.addEventListener('click',close));
    gameNav.addEventListener('click',event=>{if(event.target.closest('[data-play-home]'))close();},true);

    const api=window.UFC_PLAY_HUB;
    if(api&&!api.__blindRankPatched){
      const nativeOpen=api.openGame;
      const nativeHome=api.showHub;
      api.openGame=function(mode,options){
        if(mode==='blind-rank')return open(options||{});
        close();
        return nativeOpen.call(api,mode,options);
      };
      api.showHub=function(){close();return nativeHome.call(api);};
      api.__blindRankPatched=true;
    }
  }

  injectStyles();
  ensurePanel();
  patchHub();

  const shared=parseSharedLineup();
  if(shared){
    window.setTimeout(()=>{
      document.querySelector('.tab[data-view="play"]')?.click();
      open({...shared,shared:true});
    },80);
  }

  window.UFC_BLIND_RANK={version:VERSION,packs:PACKS.map(pack=>({...pack})),state,open,startGame,challengeUrl};
  document.documentElement.setAttribute('data-blind-rank',VERSION);
  window.dispatchEvent(new CustomEvent('ufc-blind-rank-ready',{detail:{version:VERSION}}));
})();

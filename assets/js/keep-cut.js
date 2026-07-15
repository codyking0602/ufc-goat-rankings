(function(){
  'use strict';

  const VERSION='keep-cut-20260715a-phase-four';
  const STORAGE_KEY='ufc-goat-keep-cut-v1';
  const PLAY_DATA=window.UFC_PLAY_DATA;
  const play=document.getElementById('play');
  const shell=play?.querySelector('.play-shell');
  const hub=document.getElementById('playHub');
  const gameNav=document.getElementById('playGameNav');
  if(!PLAY_DATA||!play||!shell||!hub||!gameNav)return;

  const NEVER_UNDISPUTED=[
    'Dustin Poirier','Tony Ferguson','Jorge Masvidal','Nate Diaz','Nick Diaz','Carlos Condit',
    'Alexander Gustafsson','Donald Cerrone','Dan Henderson','Chael Sonnen','Urijah Faber','Yoel Romero',
    'Stephen Thompson','Colby Covington','Dan Hooker','Michael Chandler','Kevin Lee','Chan Sung Jung',
    'Cub Swanson','Rory MacDonald','Kevin Holland','Tai Tuivasa','Derrick Lewis','Matt Brown','Joe Lauzon'
  ];

  const ACTION_FIGHTERS=[
    'Justin Gaethje','Dustin Poirier','Charles Oliveira','Max Holloway','Tony Ferguson','Robbie Lawler',
    'Dan Henderson','Nate Diaz','Nick Diaz','Donald Cerrone','Edson Barboza','Chan Sung Jung','Cub Swanson',
    'Matt Brown','Joe Lauzon','Diego Sanchez','Clay Guida','Derrick Lewis','Tai Tuivasa','Mike Perry',
    'Dan Hooker','Michael Chandler','Michel Pereira','Anthony Pettis','Jorge Masvidal','Chris Leben'
  ];

  const UFC_STARS=[
    'Jon Jones','Georges St-Pierre','Anderson Silva','Khabib Nurmagomedov','Conor McGregor','Ronda Rousey',
    'Brock Lesnar','Israel Adesanya','Alex Pereira','Nate Diaz','Jorge Masvidal','Max Holloway',
    'Dustin Poirier','Justin Gaethje','Charles Oliveira','Sean O’Malley','Francis Ngannou','Chuck Liddell',
    'Tito Ortiz','B.J. Penn','Robbie Lawler','Donald Cerrone','Paige VanZant','Derrick Lewis','Kevin Holland',
    'Michael Chandler','Tony Ferguson','Chael Sonnen','Urijah Faber','Stephen Thompson','Tai Tuivasa'
  ];

  const FORMER_CHAMPIONS=[
    'Jon Jones','Georges St-Pierre','Demetrious Johnson','Anderson Silva','Khabib Nurmagomedov',
    'Alexander Volkanovski','Jose Aldo','Dominick Cruz','Kamaru Usman','Max Holloway','Daniel Cormier',
    'Stipe Miocic','Islam Makhachev','Charles Oliveira','Israel Adesanya','Alex Pereira','Conor McGregor',
    'Henry Cejudo','Amanda Nunes','Valentina Shevchenko','Ronda Rousey','Joanna Jedrzejczyk','Matt Hughes',
    'Randy Couture','B.J. Penn','Chuck Liddell','Tito Ortiz','Cain Velasquez','Francis Ngannou',
    'Junior dos Santos','Robbie Lawler','Michael Bisping','Brock Lesnar','Frankie Edgar','T.J. Dillashaw',
    'Aljamain Sterling','Petr Yan','Deiveson Figueiredo','Dricus du Plessis','Tyron Woodley','Ilia Topuria',
    'Sean Strickland','Robert Whittaker','Sean O’Malley','Zhang Weili','Rose Namajunas','Miesha Tate',
    'Alexa Grasso','Julianna Peña','Carla Esparza','Holly Holm','Alexandre Pantoja','Royce Gracie','Frank Shamrock'
  ];

  const PACKS=[
    {id:'ufc-careers',name:'UFC Careers',prompt:'Keep four UFC careers. Cut four.',description:'Eight fighters arrive one at a time. Every decision locks.',filters:{gender:'men'}},
    {id:'all-careers',name:'All UFC Careers',prompt:'Keep four UFC careers. Cut four.',description:'Men and women from across UFC history arrive one at a time.',filters:{}},
    {id:'never-undisputed',name:'Never Won Undisputed Gold',prompt:'Keep four. Cut four.',description:'Every fighter had a major UFC career without winning undisputed UFC gold.',names:NEVER_UNDISPUTED},
    {id:'action-fighters',name:'Action Fighters',prompt:'Keep four action fighters. Cut four.',description:'Violence, pressure, wild exchanges, and fan-favorite chaos.',names:ACTION_FIGHTERS},
    {id:'former-champions',name:'Former Champions',prompt:'Keep four champions. Cut four.',description:'Eight UFC champions arrive one at a time.',names:FORMER_CHAMPIONS},
    {id:'ufc-stars',name:'UFC Stars',prompt:'Keep four UFC stars. Cut four.',description:'Famous champions, fan favorites, personalities, and attractions.',names:UFC_STARS},
    {id:'lightweight',name:'Lightweight',prompt:'Keep four lightweights. Cut four.',description:'One deep division. Eight locked decisions.',filters:{gender:'men',division:'Lightweight'}},
    {id:'welterweight',name:'Welterweight',prompt:'Keep four welterweights. Cut four.',description:'Champions, challengers, veterans, and fan favorites.',filters:{gender:'men',division:'Welterweight'}},
    {id:'heavyweight',name:'Heavyweight',prompt:'Keep four heavyweights. Cut four.',description:'Champions, sluggers, veterans, and unpredictable names.',filters:{gender:'men',division:'Heavyweight'}},
    {id:'early-ufc',name:'Early UFC',prompt:'Keep four early UFC names. Cut four.',description:'Tournament, Survival, and Zuffa Rebuild era fighters.',filters:{gender:'men'},eras:['tournament','survival','zuffa-rebuild']}
  ];

  const state={
    packId:'ufc-careers',
    lineup:[],
    decisions:[],
    currentIndex:0,
    completed:false,
    shared:false
  };

  function esc(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
  function initials(name){return String(name||'').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase()||'UFC';}
  function packFor(id){return PACKS.find(pack=>pack.id===id)||PACKS[0];}
  function randomItem(items){return items.length?items[Math.floor(Math.random()*items.length)]:null;}
  function shuffled(values){
    const items=[...values];
    for(let index=items.length-1;index>0;index-=1){
      const swap=Math.floor(Math.random()*(index+1));
      [items[index],items[swap]]=[items[swap],items[index]];
    }
    return items;
  }

  function visual(fighter,className){
    const url=fighter?.thumbUrl||fighter?.profileUrl||'';
    return `<span class="${className}">${url?`<img src="${esc(url)}" alt="${esc(fighter.name)}">`:`<span>${esc(initials(fighter?.name))}</span>`}</span>`;
  }

  function eraLabel(fighter){
    const id=fighter?.eras?.[0];
    return window.UFC_ERA_FILTER_DATA?.byId?.[id]?.name||'';
  }

  function fighterMeta(fighter){
    return [fighter?.primaryDivision||fighter?.divisions?.[0],eraLabel(fighter)].filter(Boolean).join(' · ')||'UFC Play roster';
  }

  function poolForPack(pack){
    let pool=PLAY_DATA.poolFor('keep-cut',pack.filters||{});
    if(Array.isArray(pack.names)){
      const allowed=new Set(pack.names.map(name=>PLAY_DATA.resolve(name)?.id).filter(Boolean));
      pool=pool.filter(fighter=>allowed.has(fighter.id));
    }
    if(Array.isArray(pack.eras)&&pack.eras.length){
      pool=pool.filter(fighter=>fighter.eras?.some(era=>pack.eras.includes(era)));
    }
    return pool;
  }

  function buildLineup(packId){
    const pool=poolForPack(packFor(packId));
    if(pool.length<8)return[];
    const remaining=[...pool];
    const selected=[];
    const targetTiers=['legend','legend','elite','elite','contender','recognizable','wildcard','wildcard'];
    targetTiers.forEach(tier=>{
      const fighter=randomItem(remaining.filter(row=>row.selectionTier===tier));
      if(!fighter)return;
      selected.push(fighter);
      remaining.splice(remaining.findIndex(row=>row.id===fighter.id),1);
    });
    while(selected.length<8&&remaining.length){
      const fighter=randomItem(remaining);
      selected.push(fighter);
      remaining.splice(remaining.findIndex(row=>row.id===fighter.id),1);
    }
    return shuffled(selected.slice(0,8));
  }

  function kept(){return state.decisions.filter(row=>row.choice==='keep');}
  function cut(){return state.decisions.filter(row=>row.choice==='cut');}

  function saveState(){
    try{
      localStorage.setItem(STORAGE_KEY,JSON.stringify({
        packId:state.packId,
        lineup:state.lineup.map(fighter=>fighter.id),
        decisions:state.decisions.map(row=>({fighterId:row.fighter.id,choice:row.choice,revealIndex:row.revealIndex})),
        currentIndex:state.currentIndex,
        completed:state.completed
      }));
    }catch(_error){}
  }

  function restoreState(){
    try{
      const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
      if(!saved||!Array.isArray(saved.lineup)||saved.lineup.length!==8)return false;
      const lineup=saved.lineup.map(id=>PLAY_DATA.resolve(id));
      if(lineup.some(fighter=>!fighter)||new Set(lineup.map(fighter=>fighter.id)).size!==8)return false;
      const decisions=(saved.decisions||[]).map(row=>({
        fighter:PLAY_DATA.resolve(row.fighterId),
        choice:row.choice==='keep'?'keep':'cut',
        revealIndex:Number(row.revealIndex)||0
      })).filter(row=>row.fighter);
      state.packId=packFor(saved.packId).id;
      state.lineup=lineup;
      state.decisions=decisions.slice(0,8);
      state.currentIndex=Math.max(0,Math.min(8,Number(saved.currentIndex)||decisions.length));
      state.completed=Boolean(saved.completed&&state.currentIndex>=8&&kept().length===4&&cut().length===4);
      return true;
    }catch(_error){return false;}
  }

  function startGame(options={}){
    const packId=packFor(options.packId||state.packId).id;
    const lineup=Array.isArray(options.lineup)&&options.lineup.length===8?options.lineup:buildLineup(packId);
    if(lineup.length!==8)return;
    state.packId=packId;
    state.lineup=lineup;
    state.decisions=[];
    state.currentIndex=0;
    state.completed=false;
    state.shared=Boolean(options.shared);
    saveState();
    render();
  }

  function decide(choice){
    const fighter=state.lineup[state.currentIndex];
    if(!fighter||state.completed)return;
    if(choice==='keep'&&kept().length>=4)return;
    if(choice==='cut'&&cut().length>=4)return;
    state.decisions.push({fighter,choice,revealIndex:state.currentIndex});
    state.currentIndex+=1;
    state.completed=state.currentIndex>=8;
    saveState();
    render();
  }

  function decisionSlots(choice){
    const rows=state.decisions.filter(row=>row.choice===choice);
    return Array.from({length:4},(_,index)=>{
      const fighter=rows[index]?.fighter;
      return fighter?`<div class="kc-mini filled">${visual(fighter,'kc-mini-photo')}<strong>${esc(fighter.name)}</strong></div>`:`<div class="kc-mini empty"><span>${index+1}</span></div>`;
    }).join('');
  }

  function renderCurrent(){
    const fighter=state.lineup[state.currentIndex];
    if(!fighter)return'';
    const keepFull=kept().length>=4;
    const cutFull=cut().length>=4;
    const forced=keepFull?'KEEP IS FULL — THIS FIGHTER MUST BE CUT':cutFull?'CUT IS FULL — THIS FIGHTER MUST BE KEPT':'MAKE THE CALL. IT LOCKS IMMEDIATELY.';
    return `<div class="kc-current">
      ${visual(fighter,'kc-current-photo')}
      <div class="kc-current-copy">
        <span>FIGHTER ${state.currentIndex+1} OF 8</span>
        <h4>${esc(fighter.name)}</h4>
        <p>${esc(fighterMeta(fighter))}</p>
        <div class="kc-forced${keepFull||cutFull?' active':''}">${forced}</div>
        <div class="kc-choice-buttons">
          <button type="button" class="keep" data-kc-choice="keep" ${keepFull?'disabled':''}>KEEP</button>
          <button type="button" class="cut" data-kc-choice="cut" ${cutFull?'disabled':''}>CUT</button>
        </div>
      </div>
    </div>`;
  }

  function resultCard(row){
    return `<div class="kc-result-card">${visual(row.fighter,'kc-result-photo')}<div><strong>${esc(row.fighter.name)}</strong><small>${esc(fighterMeta(row.fighter))}</small></div><span>REVEAL ${row.revealIndex+1}</span></div>`;
  }

  function renderFinish(){
    return `<div class="kc-finish">
      <section class="kc-final-group keep"><div class="kc-final-head"><span>YOUR FOUR</span><strong>KEPT</strong></div><div class="kc-final-list">${kept().map(resultCard).join('')}</div></section>
      <section class="kc-final-group cut"><div class="kc-final-head"><span>YOUR FOUR</span><strong>CUT</strong></div><div class="kc-final-list">${cut().map(resultCard).join('')}</div></section>
      <div class="kc-actions"><button type="button" class="primary" data-kc-challenge>CHALLENGE A FRIEND</button><button type="button" class="secondary" data-kc-replay>NEW LINEUP</button></div>
    </div>`;
  }

  function render(){
    const target=document.getElementById('keepCutGame');
    const select=document.getElementById('keepCutPack');
    if(!target)return;
    const pack=packFor(state.packId);
    if(select)select.value=pack.id;
    const prompt=document.getElementById('keepCutPrompt');
    const description=document.getElementById('keepCutDescription');
    if(prompt)prompt.textContent=pack.prompt;
    if(description)description.textContent=pack.description;
    const title=document.getElementById('playGameTitle');
    if(title&&!state.shared)title.textContent='Keep 4, Cut 4';
    target.innerHTML=`<div class="kc-game-card">
      <div class="kc-progress"><strong>${state.completed?'COMPLETE':`DECISION ${state.currentIndex+1} OF 8`}</strong><span>${esc(pack.name)}</span></div>
      <div class="kc-board">
        <section class="kc-tray keep"><div><strong>KEEP</strong><span>${kept().length}/4</span></div><div class="kc-mini-grid">${decisionSlots('keep')}</div></section>
        <section class="kc-tray cut"><div><strong>CUT</strong><span>${cut().length}/4</span></div><div class="kc-mini-grid">${decisionSlots('cut')}</div></section>
      </div>
      ${state.completed?renderFinish():renderCurrent()}
    </div>`;
  }

  function challengeUrl(){
    const url=new URL(window.location.href);
    url.searchParams.delete('room');
    url.searchParams.set('game','keep-cut');
    url.searchParams.set('kcpack',state.packId);
    url.searchParams.set('kclineup',state.lineup.map(fighter=>fighter.id).join(','));
    url.hash='play';
    return url.toString();
  }

  function parseShared(){
    const url=new URL(window.location.href);
    if(url.searchParams.get('game')!=='keep-cut')return null;
    const ids=(url.searchParams.get('kclineup')||'').split(',').map(value=>value.trim()).filter(Boolean);
    if(ids.length!==8||new Set(ids).size!==8)return null;
    const lineup=ids.map(id=>PLAY_DATA.resolve(id));
    if(lineup.some(fighter=>!fighter))return null;
    return {lineup,packId:packFor(url.searchParams.get('kcpack')).id,shared:true};
  }

  function showToast(message){
    const toast=document.getElementById('keepCutToast');
    if(!toast)return;
    toast.textContent=message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer=setTimeout(()=>toast.classList.remove('show'),1500);
  }

  async function shareChallenge(){
    const pack=packFor(state.packId);
    const payload={title:'UFC Keep 4, Cut 4',text:`Keep four and cut four from the same ${pack.name} lineup. Every decision locks.`,url:challengeUrl()};
    try{
      if(navigator.share)await navigator.share(payload);
      else{await navigator.clipboard.writeText(`${payload.text}\n\n${payload.url}`);showToast('Challenge link copied');}
    }catch(error){if(error?.name!=='AbortError')showToast('Share failed');}
  }

  function injectStyles(){
    if(document.getElementById('keep-cut-css'))return;
    const style=document.createElement('style');
    style.id='keep-cut-css';
    style.textContent=`
      #playKeepCutPanel[hidden]{display:none!important}
      #play .kc-wrap{display:grid;gap:12px;color:#f8fafc}
      #play .kc-intro{display:flex;justify-content:space-between;align-items:end;gap:18px;border:1px solid rgba(249,115,22,.55);border-radius:20px;background:linear-gradient(135deg,#29364b,#182236 62%,#101522);padding:17px}
      #play .kc-kicker{display:block;color:#facc15;font-size:10px;font-weight:950;letter-spacing:.13em}
      #play .kc-intro h3{margin:5px 0 0;color:#fff;font-size:27px;line-height:1}
      #play .kc-intro p{max-width:650px;margin:7px 0 0;color:#cbd5e1;font-size:12px;line-height:1.45}
      #play .kc-pack-control{display:grid;grid-template-columns:minmax(190px,1fr) auto;gap:7px;min-width:350px}
      #play .kc-pack-control select,#play .kc-pack-control button{min-height:42px;border-radius:12px;font:850 11px/1 system-ui}
      #play .kc-pack-control select{border:1px solid #526786;background:#101725;color:#f8fafc;padding:0 10px}
      #play .kc-pack-control button{border:1px solid #f97316;background:#f97316;color:#111827;padding:0 12px;cursor:pointer}
      #play .kc-game-card{display:grid;gap:13px;border:1px solid #4b5f7e;border-radius:21px;background:linear-gradient(180deg,#223047,#172033);padding:15px}
      #play .kc-progress{display:flex;justify-content:space-between;gap:10px;align-items:center}
      #play .kc-progress strong{color:#facc15;font-size:11px;letter-spacing:.08em}
      #play .kc-progress span{color:#cbd5e1;font-size:11px}
      #play .kc-board{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
      #play .kc-tray{border:1px solid #526786;border-radius:16px;background:#101725;padding:10px}
      #play .kc-tray>div:first-child{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
      #play .kc-tray>div:first-child strong{font-size:12px;letter-spacing:.09em}
      #play .kc-tray>div:first-child span{font-size:11px;font-weight:950}
      #play .kc-tray.keep>div:first-child strong,#play .kc-tray.keep>div:first-child span{color:#4ade80}
      #play .kc-tray.cut>div:first-child strong,#play .kc-tray.cut>div:first-child span{color:#fb7185}
      #play .kc-mini-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
      #play .kc-mini{min-height:76px;border:1px solid #334155;border-radius:11px;background:#172033;display:grid;justify-items:center;align-content:center;gap:4px;padding:5px;text-align:center;overflow:hidden}
      #play .kc-mini.empty span{color:#475569;font-size:18px;font-weight:950}
      #play .kc-mini strong{max-width:100%;color:#e2e8f0;font-size:8px;line-height:1.08;overflow:hidden;text-overflow:ellipsis}
      #play .kc-mini-photo{width:38px;height:38px;border-radius:9px;background:#26364e;display:flex;align-items:center;justify-content:center;color:#e2e8f0;font-size:11px;font-weight:950;overflow:hidden}
      #play .kc-mini-photo img,#play .kc-current-photo img,#play .kc-result-photo img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block}
      #play .kc-current{display:grid;grid-template-columns:minmax(150px,.58fr) minmax(0,1.42fr);gap:16px;align-items:center;border:1px solid rgba(250,204,21,.42);border-radius:18px;background:radial-gradient(circle at 18% 25%,rgba(249,115,22,.18),transparent 42%),#0f1624;padding:15px}
      #play .kc-current-photo{width:100%;max-width:230px;aspect-ratio:1/1;border:1px solid rgba(250,204,21,.45);border-radius:18px;overflow:hidden;background:linear-gradient(180deg,#35445d,#172033);display:flex;align-items:center;justify-content:center;color:#f8fafc;font-size:48px;font-weight:950;margin:auto}
      #play .kc-current-copy>span{display:block;color:#facc15;font-size:10px;font-weight:950;letter-spacing:.11em}
      #play .kc-current-copy h4{margin:6px 0 0;color:#fff;font-size:32px;line-height:.98}
      #play .kc-current-copy p{margin:8px 0 0;color:#cbd5e1;font-size:12px}
      #play .kc-forced{margin-top:13px;color:#fdba74;font-size:10px;font-weight:950;letter-spacing:.04em}
      #play .kc-forced.active{color:#facc15}
      #play .kc-choice-buttons{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:12px}
      #play .kc-choice-buttons button{min-height:49px;border-radius:13px;font:950 13px/1 system-ui;letter-spacing:.08em;cursor:pointer}
      #play .kc-choice-buttons .keep{border:1px solid #22c55e;background:#16a34a;color:#fff}
      #play .kc-choice-buttons .cut{border:1px solid #f43f5e;background:#e11d48;color:#fff}
      #play .kc-choice-buttons button:disabled{opacity:.2;cursor:not-allowed}
      #play .kc-finish{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
      #play .kc-final-group{border:1px solid #526786;border-radius:17px;background:#101725;padding:11px}
      #play .kc-final-head{display:flex;justify-content:space-between;align-items:end;margin-bottom:8px}
      #play .kc-final-head span{color:#94a3b8;font-size:8px;font-weight:950;letter-spacing:.11em}
      #play .kc-final-head strong{font-size:17px;letter-spacing:.08em}
      #play .kc-final-group.keep .kc-final-head strong{color:#4ade80}
      #play .kc-final-group.cut .kc-final-head strong{color:#fb7185}
      #play .kc-final-list{display:grid;gap:6px}
      #play .kc-result-card{display:grid;grid-template-columns:46px minmax(0,1fr) auto;gap:8px;align-items:center;border:1px solid #334155;border-radius:12px;background:#172033;padding:6px}
      #play .kc-result-photo{width:46px;height:46px;border-radius:10px;background:#26364e;display:flex;align-items:center;justify-content:center;color:#e2e8f0;font-size:12px;font-weight:950;overflow:hidden}
      #play .kc-result-card strong,#play .kc-result-card small{display:block}
      #play .kc-result-card strong{color:#fff;font-size:12px}
      #play .kc-result-card small{margin-top:2px;color:#94a3b8;font-size:8px}
      #play .kc-result-card>span{color:#64748b;font-size:7px;font-weight:950;letter-spacing:.05em}
      #play .kc-actions{grid-column:1/-1;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
      #play .kc-actions button{min-height:43px;border-radius:12px;font:950 10px/1 system-ui;letter-spacing:.04em;cursor:pointer}
      #play .kc-actions .primary{border:1px solid #f97316;background:#f97316;color:#111827}
      #play .kc-actions .secondary{border:1px solid #526786;background:#101725;color:#f8fafc}
      #play .kc-toast{position:fixed;left:50%;bottom:22px;z-index:1000;transform:translate(-50%,14px);opacity:0;pointer-events:none;border:1px solid rgba(250,204,21,.5);border-radius:999px;background:#101725;padding:9px 13px;color:#fde68a;font-size:11px;font-weight:900;transition:.18s ease}
      #play .kc-toast.show{opacity:1;transform:translate(-50%,0)}
      @media(max-width:700px){
        #play .kc-intro{display:grid;align-items:start;padding:14px}
        #play .kc-intro h3{font-size:23px}
        #play .kc-pack-control{min-width:0;grid-template-columns:1fr auto}
        #play .kc-board{grid-template-columns:1fr}
        #play .kc-mini{min-height:68px}
        #play .kc-current{grid-template-columns:92px minmax(0,1fr);gap:11px;padding:12px}
        #play .kc-current-photo{width:92px;border-radius:15px;font-size:34px}
        #play .kc-current-copy h4{font-size:24px}
        #play .kc-current-copy p{font-size:10px}
        #play .kc-forced{font-size:8px}
        #play .kc-choice-buttons button{min-height:45px;font-size:11px}
        #play .kc-finish{grid-template-columns:1fr}
        #play .kc-actions{grid-column:auto;grid-template-columns:1fr}
      }
    `;
    document.head.appendChild(style);
  }

  function ensurePanel(){
    let panel=document.getElementById('playKeepCutPanel');
    if(panel)return panel;
    panel=document.createElement('section');
    panel.id='playKeepCutPanel';
    panel.className='play-panel';
    panel.hidden=true;
    panel.innerHTML=`<div class="kc-wrap">
      <div class="kc-intro">
        <div><span class="kc-kicker">KEEP 4, CUT 4</span><h3 id="keepCutPrompt">Keep four UFC careers. Cut four.</h3><p id="keepCutDescription">Eight fighters arrive one at a time. Every decision locks.</p></div>
        <div class="kc-pack-control"><select id="keepCutPack" aria-label="Keep 4 Cut 4 pack">${PACKS.map(pack=>`<option value="${esc(pack.id)}">${esc(pack.name)}</option>`).join('')}</select><button type="button" data-kc-new>NEW LINEUP</button></div>
      </div>
      <div id="keepCutGame"></div>
      <div id="keepCutToast" class="kc-toast" role="status" aria-live="polite"></div>
    </div>`;
    shell.appendChild(panel);
    panel.addEventListener('click',event=>{
      const choice=event.target.closest('[data-kc-choice]');
      if(choice){decide(choice.dataset.kcChoice);return;}
      if(event.target.closest('[data-kc-new],[data-kc-replay]')){startGame({packId:document.getElementById('keepCutPack')?.value||state.packId});return;}
      if(event.target.closest('[data-kc-challenge]'))shareChallenge();
    });
    panel.querySelector('#keepCutPack')?.addEventListener('change',event=>startGame({packId:event.target.value}));
    return panel;
  }

  function hideOtherPanels(){
    document.getElementById('playTop10Panel')?.setAttribute('hidden','');
    document.getElementById('playBlindPanel')?.setAttribute('hidden','');
    document.getElementById('playBlindRankPanel')?.setAttribute('hidden','');
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
    if(eyebrow)eyebrow.textContent=options.shared?'FRIEND CHALLENGE':'KEEP 4, CUT 4';
    if(title)title.textContent=options.shared?'Same Eight. Your Decisions.':'Keep 4, Cut 4';
    document.documentElement.setAttribute('data-play-screen','keep-cut');
    if(options.lineup)startGame(options);
    else if(!state.lineup.length&&!restoreState())startGame({packId:state.packId});
    else render();
    gameNav.scrollIntoView({block:'start'});
  }

  function close(){
    const panel=document.getElementById('playKeepCutPanel');
    if(panel)panel.hidden=true;
  }

  function patchHub(){
    const card=[...hub.querySelectorAll('[data-coming-game]')].find(node=>node.dataset.comingGame==='Keep 4, Cut 4');
    if(card){
      card.classList.remove('is-coming');
      card.classList.add('is-live');
      card.removeAttribute('data-coming-game');
      card.dataset.openGame='keep-cut';
      const status=card.querySelector('.play-game-card-top em');
      const action=card.querySelector('.play-game-action');
      if(status)status.textContent='PLAY NOW';
      if(action)action.textContent='OPEN GAME →';
    }

    hub.addEventListener('click',event=>{
      const trigger=event.target.closest('[data-open-game="keep-cut"]');
      if(!trigger)return;
      event.preventDefault();
      event.stopImmediatePropagation();
      open();
    },true);

    document.querySelectorAll('[data-play-mode="top10"],[data-play-mode="blind"]').forEach(button=>button.addEventListener('click',close));
    gameNav.addEventListener('click',event=>{if(event.target.closest('[data-play-home]'))close();},true);

    const api=window.UFC_PLAY_HUB;
    if(api&&!api.__keepCutPatched){
      const nativeOpen=api.openGame;
      const nativeHome=api.showHub;
      api.openGame=function(mode,options){
        if(mode==='keep-cut')return open(options||{});
        close();
        return nativeOpen.call(api,mode,options);
      };
      api.showHub=function(){close();return nativeHome.call(api);};
      api.__keepCutPatched=true;
    }
  }

  injectStyles();
  ensurePanel();
  patchHub();

  const shared=parseShared();
  if(shared){
    setTimeout(()=>{
      document.querySelector('.tab[data-view="play"]')?.click();
      open(shared);
    },120);
  }

  window.UFC_KEEP_CUT={version:VERSION,packs:PACKS.map(pack=>({...pack})),state,open,startGame,challengeUrl};
  document.documentElement.setAttribute('data-keep-cut',VERSION);
  window.dispatchEvent(new CustomEvent('ufc-keep-cut-ready',{detail:{version:VERSION}}));
})();
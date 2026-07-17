(function(){
  'use strict';

  const VERSION='keep-cut-20260716c-best-prime';
  const STORAGE_KEY='ufc-goat-keep-cut-v1';
  const STORAGE_VERSION=2;
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

  const CULT_CHAOS=[
    'Chael Sonnen','Nate Diaz','Nick Diaz','Jorge Masvidal','Mike Perry','Diego Sanchez','Derrick Lewis',
    'Tai Tuivasa','Kevin Holland','Michel Pereira','Paige VanZant','Molly McCann','Kimbo Slice','CM Punk',
    'Sage Northcutt','Artem Lobov','Sam Alvey','Houston Alexander','Clay Guida','Chris Leben'
  ];

  const CATEGORY_ORDERS={
    'never-undisputed':[
      'Dustin Poirier','Tony Ferguson','Urijah Faber','Alexander Gustafsson','Carlos Condit','Yoel Romero',
      'Colby Covington','Stephen Thompson','Dan Henderson','Jorge Masvidal','Donald Cerrone','Chan Sung Jung',
      'Rory MacDonald','Nate Diaz','Nick Diaz','Michael Chandler','Chael Sonnen','Dan Hooker','Cub Swanson',
      'Derrick Lewis','Kevin Lee','Matt Brown','Joe Lauzon','Kevin Holland','Tai Tuivasa'
    ],
    'action-fighters':[
      'Justin Gaethje','Dustin Poirier','Max Holloway','Charles Oliveira','Robbie Lawler','Tony Ferguson',
      'Michael Chandler','Chan Sung Jung','Edson Barboza','Donald Cerrone','Dan Henderson','Nate Diaz',
      'Dan Hooker','Anthony Pettis','Jorge Masvidal','Nick Diaz','Cub Swanson','Joe Lauzon','Matt Brown',
      'Diego Sanchez','Clay Guida','Derrick Lewis','Tai Tuivasa','Mike Perry','Michel Pereira','Chris Leben'
    ],
    'ufc-stars':[
      'Conor McGregor','Ronda Rousey','Georges St-Pierre','Jon Jones','Anderson Silva','Brock Lesnar',
      'Khabib Nurmagomedov','Israel Adesanya','Chuck Liddell','Alex Pereira','Nate Diaz','Jorge Masvidal',
      'Tito Ortiz','Max Holloway','Francis Ngannou','Sean O’Malley','Dustin Poirier','Justin Gaethje',
      'B.J. Penn','Charles Oliveira','Robbie Lawler','Donald Cerrone','Tony Ferguson','Chael Sonnen',
      'Urijah Faber','Paige VanZant','Michael Chandler','Derrick Lewis','Stephen Thompson','Kevin Holland','Tai Tuivasa'
    ],
    'cult-chaos':[
      'Chael Sonnen','Nate Diaz','Nick Diaz','Jorge Masvidal','Mike Perry','Diego Sanchez','Derrick Lewis',
      'Tai Tuivasa','Kevin Holland','Michel Pereira','Clay Guida','Chris Leben','Paige VanZant','Molly McCann',
      'Kimbo Slice','Artem Lobov','Sage Northcutt','Houston Alexander','Sam Alvey','CM Punk'
    ]
  };

  const PACKS=[
    {id:'ufc-careers',group:'Serious',name:'UFC Careers',prompt:'Keep four UFC careers. Cut four.',description:'Eight ranked UFC careers arrive one at a time. Every decision locks.',scoreMode:'overall-rank',filters:{gender:'men',modelRanked:true}},
    {id:'all-careers',group:'Serious',name:'All UFC Careers',prompt:'Keep four UFC careers. Cut four.',description:'Ranked men and women from across UFC history arrive one at a time.',scoreMode:'overall-score',filters:{modelRanked:true}},
    {id:'best-prime',group:'Serious',name:'Best Prime',prompt:'Keep four UFC primes. Cut four.',description:'Balanced by Prime Dominance and Apex Peak—not overall career rank.',scoreMode:'prime-score',candidateLimit:48,filters:{modelRanked:true}},
    {id:'never-undisputed',group:'Serious',name:'Never Won Undisputed Gold',prompt:'Keep four. Cut four.',description:'Major UFC careers without undisputed UFC gold, balanced by UFC résumé.',scoreMode:'ordered',filters:{modelRanked:true},names:NEVER_UNDISPUTED,order:CATEGORY_ORDERS['never-undisputed']},
    {id:'former-champions',group:'Serious',name:'Former Champions',prompt:'Keep four champions. Cut four.',description:'Eight ranked UFC champions arrive one at a time.',scoreMode:'overall-score',filters:{modelRanked:true},names:FORMER_CHAMPIONS},
    {id:'lightweight',group:'Serious',name:'Lightweight',prompt:'Keep four lightweights. Cut four.',description:'Ranked UFC lightweight careers, balanced by lightweight résumé.',scoreMode:'division-score',division:'Lightweight',filters:{gender:'men',division:'Lightweight',modelRanked:true}},
    {id:'welterweight',group:'Serious',name:'Welterweight',prompt:'Keep four welterweights. Cut four.',description:'Ranked UFC welterweight careers, balanced by welterweight résumé.',scoreMode:'division-score',division:'Welterweight',filters:{gender:'men',division:'Welterweight',modelRanked:true}},
    {id:'heavyweight',group:'Serious',name:'Heavyweight',prompt:'Keep four heavyweights. Cut four.',description:'Ranked UFC heavyweight careers, balanced by heavyweight résumé.',scoreMode:'division-score',division:'Heavyweight',filters:{gender:'men',division:'Heavyweight',modelRanked:true}},
    {id:'early-ufc',group:'Serious',name:'Early UFC',prompt:'Keep four early UFC names. Cut four.',description:'Ranked Tournament, Survival, and Zuffa Rebuild era careers.',scoreMode:'overall-rank',filters:{gender:'men',modelRanked:true},eras:['tournament','survival','zuffa-rebuild']},
    {id:'action-fighters',group:'Entertainment',name:'Action Fighters',prompt:'Keep four action fighters. Cut four.',description:'Balanced by action value—not by the GOAT leaderboard.',scoreMode:'ordered',names:ACTION_FIGHTERS,order:CATEGORY_ORDERS['action-fighters']},
    {id:'ufc-stars',group:'Entertainment',name:'UFC Stars',prompt:'Keep four UFC stars. Cut four.',description:'Balanced by UFC star power—not by career rank.',scoreMode:'ordered',names:UFC_STARS,order:CATEGORY_ORDERS['ufc-stars']},
    {id:'cult-chaos',group:'Chaos',name:'Cult & Chaos',prompt:'Keep four agents of chaos. Cut four.',description:'Cult heroes, personalities, attractions, and beautifully strange UFC careers.',scoreMode:'ordered',names:CULT_CHAOS,order:CATEGORY_ORDERS['cult-chaos']}
  ];

  const TARGET_BUCKETS=['elite','great','great','good','good','average','average','chaos'];
  const BUCKET_ORDER=['elite','great','good','average','chaos'];
  const REQUIRED_BUCKET_COUNTS=TARGET_BUCKETS.reduce((counts,bucket)=>({...counts,[bucket]:(counts[bucket]||0)+1}),{});
  const state={packId:'ufc-careers',lineup:[],decisions:[],currentIndex:0,completed:false,shared:false,balance:null};
  let audit={passed:false,packs:[]};

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

  function rankingRow(fighter){
    const target=String(fighter?.name||'').trim().toLowerCase();
    const data=window.RANKING_DATA||{};
    return [...(data.men||[]),...(data.women||[]),...(data.fighters||[])].find(row=>String(row?.fighter||'').trim().toLowerCase()===target)||null;
  }

  function fallbackScore(fighter){
    if(Number.isFinite(Number(fighter?.modelRank)))return 10000-(Number(fighter.modelRank)*100)+(Number(fighter.modelScore)||0);
    const tierScore={legend:5000,elite:4000,contender:3000,recognizable:2000,wildcard:1000};
    return tierScore[fighter?.selectionTier]||0;
  }

  function divisionEntry(fighter,division){
    const entries=window.UFC_DIVISION_RANKING_PIPELINE?.entryFor?.(fighter?.name);
    return Array.isArray(entries)?entries.find(entry=>entry?.division===division)||null:null;
  }

  function primeScore(fighter){
    const row=rankingRow(fighter);
    const dominance=Number(row?.primeDominance);
    const apex=Number(row?.apexPeak);
    if(!Number.isFinite(dominance))return null;
    return dominance+(Number.isFinite(apex)?apex:0);
  }

  function scoreForPack(pack,fighter){
    if(pack.scoreMode==='ordered'&&Array.isArray(pack.order)){
      const index=pack.order.findIndex(name=>PLAY_DATA.resolve(name)?.id===fighter.id);
      if(index>=0)return 20000-index*100;
    }
    if(pack.scoreMode==='overall-score'&&Number.isFinite(Number(fighter?.modelScore)))return Number(fighter.modelScore);
    if(pack.scoreMode==='prime-score'){
      const score=primeScore(fighter);
      if(Number.isFinite(score))return score;
    }
    if(pack.scoreMode==='division-score'){
      const score=divisionEntry(fighter,pack.division)?.divisionScore;
      if(Number.isFinite(Number(score)))return Number(score);
    }
    return fallbackScore(fighter);
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
    if(Number.isInteger(pack.candidateLimit)&&pack.candidateLimit>=8){
      pool=[...pool].sort((a,b)=>scoreForPack(pack,b)-scoreForPack(pack,a)||a.name.localeCompare(b.name)).slice(0,pack.candidateLimit);
    }
    return pool;
  }

  function bucketedPool(pack,pool=poolForPack(pack)){
    const ranked=[...pool].sort((a,b)=>scoreForPack(pack,b)-scoreForPack(pack,a)||a.name.localeCompare(b.name));
    const buckets=Object.fromEntries(BUCKET_ORDER.map(bucket=>[bucket,[]]));
    ranked.forEach((fighter,index)=>{
      const percentile=(index+0.5)/ranked.length;
      const bucket=percentile<=0.125?'elite':percentile<=0.375?'great':percentile<=0.625?'good':percentile<=0.875?'average':'chaos';
      buckets[bucket].push(fighter);
    });
    return {ranked,buckets};
  }

  function nearestAvailableBucket(target,buckets){
    const targetIndex=BUCKET_ORDER.indexOf(target);
    return BUCKET_ORDER
      .map((bucket,index)=>({bucket,distance:Math.abs(index-targetIndex)}))
      .sort((a,b)=>a.distance-b.distance)
      .map(row=>row.bucket)
      .find(bucket=>buckets[bucket]?.length);
  }

  function buildLineup(packId){
    PLAY_DATA.rebuild?.();
    const pack=packFor(packId);
    const pool=poolForPack(pack);
    if(pool.length<8)return[];
    const {buckets}=bucketedPool(pack,pool);
    const working=Object.fromEntries(BUCKET_ORDER.map(bucket=>[bucket,shuffled(buckets[bucket])]));
    const selected=[];
    const actualBuckets=[];

    TARGET_BUCKETS.forEach(target=>{
      const source=working[target]?.length?target:nearestAvailableBucket(target,working);
      const fighter=source?working[source].pop():null;
      if(!fighter)return;
      selected.push(fighter);
      actualBuckets.push(source);
    });

    if(selected.length<8){
      const used=new Set(selected.map(fighter=>fighter.id));
      shuffled(pool.filter(fighter=>!used.has(fighter.id))).slice(0,8-selected.length).forEach(fighter=>{
        selected.push(fighter);
        actualBuckets.push('fallback');
      });
    }

    state.balance={packId:pack.id,target:[...TARGET_BUCKETS],actual:actualBuckets,poolSize:pool.length};
    return shuffled(selected.slice(0,8));
  }

  function auditPacks(){
    const packs=PACKS.map(pack=>{
      const pool=poolForPack(pack);
      const {ranked,buckets}=bucketedPool(pack,pool);
      const bucketCounts=Object.fromEntries(BUCKET_ORDER.map(bucket=>[bucket,buckets[bucket].length]));
      const bucketReady=Object.entries(REQUIRED_BUCKET_COUNTS).every(([bucket,count])=>bucketCounts[bucket]>=count);
      const orderMissing=Array.isArray(pack.order)?pool.filter(fighter=>!pack.order.some(name=>PLAY_DATA.resolve(name)?.id===fighter.id)).map(fighter=>fighter.name):[];
      const divisionMissing=pack.scoreMode==='division-score'?pool.filter(fighter=>!Number.isFinite(Number(divisionEntry(fighter,pack.division)?.divisionScore))).map(fighter=>fighter.name):[];
      const primeMissing=pack.scoreMode==='prime-score'?pool.filter(fighter=>!Number.isFinite(primeScore(fighter))).map(fighter=>fighter.name):[];
      return {
        id:pack.id,
        group:pack.group,
        scoreMode:pack.scoreMode,
        poolSize:pool.length,
        bucketCounts,
        topFive:ranked.slice(0,5).map(fighter=>fighter.name),
        bottomFive:ranked.slice(-5).map(fighter=>fighter.name),
        orderMissing,
        divisionMissing,
        primeMissing,
        playable:pool.length>=8&&bucketReady&&orderMissing.length===0&&divisionMissing.length===0&&primeMissing.length===0
      };
    });
    return {passed:packs.every(pack=>pack.playable),packs};
  }

  function refreshAudit(){
    PLAY_DATA.rebuild?.();
    audit=auditPacks();
    document.documentElement.setAttribute('data-keep-cut-balance-audit',audit.passed?'passed':'failed');
    if(window.UFC_KEEP_CUT)window.UFC_KEEP_CUT.audit=audit;
    return audit;
  }

  function kept(){return state.decisions.filter(row=>row.choice==='keep');}
  function cut(){return state.decisions.filter(row=>row.choice==='cut');}

  function saveState(){
    try{
      localStorage.setItem(STORAGE_KEY,JSON.stringify({
        storageVersion:STORAGE_VERSION,
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
      if(!saved||saved.storageVersion!==STORAGE_VERSION||!Array.isArray(saved.lineup)||saved.lineup.length!==8)return false;
      const pack=packFor(saved.packId);
      const lineup=saved.lineup.map(id=>PLAY_DATA.resolve(id));
      if(lineup.some(fighter=>!fighter)||new Set(lineup.map(fighter=>fighter.id)).size!==8)return false;
      const allowed=new Set(poolForPack(pack).map(fighter=>fighter.id));
      if(lineup.some(fighter=>!allowed.has(fighter.id)))return false;
      const lineupIds=new Set(lineup.map(fighter=>fighter.id));
      const decisions=(saved.decisions||[]).map(row=>({
        fighter:PLAY_DATA.resolve(row.fighterId),
        choice:row.choice==='keep'?'keep':row.choice==='cut'?'cut':null,
        revealIndex:Number(row.revealIndex)
      })).filter(row=>row.fighter&&row.choice&&lineupIds.has(row.fighter.id)&&Number.isInteger(row.revealIndex)&&row.revealIndex>=0&&row.revealIndex<8);
      if(new Set(decisions.map(row=>row.revealIndex)).size!==decisions.length)return false;
      state.packId=pack.id;
      state.lineup=lineup;
      state.decisions=decisions.slice(0,8);
      state.currentIndex=Math.max(0,Math.min(8,Number(saved.currentIndex)||decisions.length));
      state.completed=Boolean(saved.completed&&state.currentIndex>=8&&kept().length===4&&cut().length===4);
      state.balance=null;
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
    if(options.lineup)state.balance=null;
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
      <div class="kc-progress"><strong>${state.completed?'COMPLETE':`DECISION ${state.currentIndex+1} OF 8`}</strong><span>${esc(pack.group)} · ${esc(pack.name)}</span></div>
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

  function packOptions(){
    return ['Serious','Entertainment','Chaos'].map(group=>{
      const packs=PACKS.filter(pack=>pack.group===group);
      return packs.length?`<optgroup label="${esc(group)}">${packs.map(pack=>`<option value="${esc(pack.id)}">${esc(pack.name)}</option>`).join('')}</optgroup>`:'';
    }).join('');
  }

  function injectStyles(){
    if(document.querySelector('link[data-keep-cut-css]'))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='assets/css/keep-cut.css?v=keep-cut-20260716a-category-balance';
    link.dataset.keepCutCss='true';
    document.head.appendChild(link);
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
        <div class="kc-pack-control"><select id="keepCutPack" aria-label="Keep 4 Cut 4 pack">${packOptions()}</select><button type="button" data-kc-new>NEW LINEUP</button></div>
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
    PLAY_DATA.rebuild?.();
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

  refreshAudit();
  window.addEventListener('ufc-scoring-pipeline-ready',refreshAudit);

  const shared=parseShared();
  if(shared){
    setTimeout(()=>{
      document.querySelector('.tab[data-view="play"]')?.click();
      open(shared);
    },120);
  }

  window.UFC_KEEP_CUT={
    version:VERSION,
    packs:PACKS.map(pack=>({...pack})),
    targetBuckets:[...TARGET_BUCKETS],
    state,
    audit,
    open,
    startGame,
    buildLineup,
    challengeUrl,
    refreshAudit
  };
  document.documentElement.setAttribute('data-keep-cut',VERSION);
  window.dispatchEvent(new CustomEvent('ufc-keep-cut-ready',{detail:{version:VERSION,audit}}));
})();

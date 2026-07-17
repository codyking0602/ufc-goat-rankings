(function(){
  'use strict';

  const VERSION='keep-cut-20260717e-full-roster-ledger';
  const STORAGE_KEY='ufc-goat-keep-cut-v1';
  const STORAGE_VERSION=3;
  const PLAY_DATA=window.UFC_PLAY_DATA;
  const RATINGS=window.UFC_KEEP_CUT_CATEGORY_RATINGS;
  const play=document.getElementById('play');
  const shell=play?.querySelector('.play-shell');
  const hub=document.getElementById('playHub');
  const gameNav=document.getElementById('playGameNav');
  if(!PLAY_DATA||!RATINGS||!play||!shell||!hub||!gameNav)return;
  if(window.UFC_KEEP_CUT?.version===VERSION)return;

  const FORMER_CHAMPIONS=[
    'Jon Jones','Georges St-Pierre','Demetrious Johnson','Anderson Silva','Khabib Nurmagomedov',
    'Alexander Volkanovski','Jose Aldo','Dominick Cruz','Kamaru Usman','Max Holloway','Daniel Cormier',
    'Stipe Miocic','Islam Makhachev','Charles Oliveira','Israel Adesanya','Alex Pereira','Conor McGregor',
    'Henry Cejudo','Amanda Nunes','Valentina Shevchenko','Ronda Rousey','Joanna Jedrzejczyk','Matt Hughes',
    'Randy Couture','B.J. Penn','Chuck Liddell','Tito Ortiz','Cain Velasquez','Francis Ngannou',
    'Junior dos Santos','Robbie Lawler','Michael Bisping','Brock Lesnar','Frankie Edgar','T.J. Dillashaw',
    'Aljamain Sterling','Petr Yan','Deiveson Figueiredo','Dricus du Plessis','Tyron Woodley','Ilia Topuria',
    'Sean Strickland','Robert Whittaker','Sean O’Malley','Zhang Weili','Rose Namajunas','Miesha Tate',
    'Alexa Grasso','Julianna Peña','Carla Esparza','Holly Holm','Alexandre Pantoja','Royce Gracie','Frank Shamrock',
    'Leon Edwards','Belal Muhammad','Merab Dvalishvili','Tom Aspinall','Brandon Moreno','Cody Garbrandt',
    'Benson Henderson','Eddie Alvarez','Fabricio Werdum','Andrei Arlovski','Frank Mir','Jiri Prochazka',
    'Glover Teixeira','Jamahal Hill','Rashad Evans','Forrest Griffin','Jessica Andrade','Anthony Pettis'
  ];

  const PACKS=[
    {id:'ufc-careers',group:'Serious',name:'UFC Careers',prompt:'Keep four UFC careers. Cut four.',description:'Every eligible man in the Play roster, rated by UFC-only career value.',categoryKey:'ufcCareer',filters:{gender:'men'}},
    {id:'all-careers',group:'Serious',name:'All UFC Careers',prompt:'Keep four UFC careers. Cut four.',description:'The full men’s and women’s Play roster, rated on one UFC-only career scale.',categoryKey:'allCareers'},
    {id:'best-prime',group:'Serious',name:'Best Prime',prompt:'Keep four UFC primes. Cut four.',description:'The full roster rated by Prime Dominance and Apex Peak—not overall career rank.',categoryKey:'bestPrime'},
    {id:'never-undisputed',group:'Serious',name:'Never Won Undisputed Gold',prompt:'Keep four. Cut four.',description:'Every eligible roster fighter without undisputed UFC gold, rated by UFC career.',categoryKey:'allCareers',eligibility:'never-undisputed'},
    {id:'former-champions',group:'Serious',name:'Former Champions',prompt:'Keep four champions. Cut four.',description:'Every recognized UFC champion currently available in the Play roster.',categoryKey:'allCareers',eligibility:'former-champion'},
    {id:'lightweight',group:'Serious',name:'Lightweight',prompt:'Keep four lightweights. Cut four.',description:'Every eligible Play-roster lightweight, rated specifically at lightweight.',division:'Lightweight',filters:{gender:'men'}},
    {id:'welterweight',group:'Serious',name:'Welterweight',prompt:'Keep four welterweights. Cut four.',description:'Every eligible Play-roster welterweight, rated specifically at welterweight.',division:'Welterweight',filters:{gender:'men'}},
    {id:'heavyweight',group:'Serious',name:'Heavyweight',prompt:'Keep four heavyweights. Cut four.',description:'Every eligible Play-roster heavyweight, rated specifically at heavyweight.',division:'Heavyweight',filters:{gender:'men'}},
    {id:'early-ufc',group:'Serious',name:'Early UFC',prompt:'Keep four early UFC names. Cut four.',description:'Every eligible Tournament, Survival, and Zuffa Rebuild era fighter in the roster.',categoryKey:'ufcCareer',filters:{gender:'men'},eras:['tournament','survival','zuffa-rebuild']},
    {id:'hardest-at-peak',group:'Debate',name:'Hardest at Their Peak',prompt:'Keep four fighters at their hardest-to-beat peak. Cut four.',description:'The full roster rated by peak control, Apex Peak, rounds won, and prime-loss context.',categoryKey:'hardestAtPeak'},
    {id:'most-complete',group:'Debate',name:'Most Complete Fighter',prompt:'Keep four complete fighters. Cut four.',description:'The full roster rated for striking, wrestling, grappling, defense, cardio, and adaptability.',categoryKey:'mostComplete'},
    {id:'best-finisher',group:'Debate',name:'Best Finisher',prompt:'Keep four UFC finishers. Cut four.',description:'The full roster rated for finishing threat, UFC volume, elite wins, and title stakes.',categoryKey:'bestFinisher'},
    {id:'biggest-what-if',group:'Debate',name:'Biggest UFC What-If',prompt:'Keep four UFC what-ifs. Cut four.',description:'The full roster rated for unrealized upside, injuries, timing, choices, and short runs.',categoryKey:'biggestWhatIf'},
    {id:'action-fighters',group:'Entertainment',name:'Action Fighters',prompt:'Keep four action fighters. Cut four.',description:'The full roster rated by violence, pace, drama, and entertainment reliability.',categoryKey:'actionFighter'},
    {id:'ufc-stars',group:'Entertainment',name:'UFC Stars',prompt:'Keep four UFC stars. Cut four.',description:'The full roster rated by UFC fame, drawing power, and cultural reach.',categoryKey:'starPower'},
    {id:'cult-chaos',group:'Chaos',name:'Cult & Chaos',prompt:'Keep four agents of chaos. Cut four.',description:'The full roster rated for personality, novelty, unpredictability, and cult appeal.',categoryKey:'cultChaos'}
  ];

  const TARGET_BUCKETS=['elite','great','great','good','good','average','average','chaos'];
  const BUCKET_ORDER=['elite','great','good','average','chaos'];
  const REQUIRED_BUCKET_COUNTS=TARGET_BUCKETS.reduce((counts,bucket)=>({...counts,[bucket]:(counts[bucket]||0)+1}),{});
  const state={packId:'ufc-careers',lineup:[],decisions:[],currentIndex:0,completed:false,shared:false,balance:null};
  let audit={passed:false,packs:[]};

  function esc(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
  function normal(value){return String(value??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`]/g,"'").replace(/[^a-zA-Z0-9]+/g,' ').trim().toLowerCase();}
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

  const formerChampionNames=new Set(FORMER_CHAMPIONS.map(normal));
  function isFormerChampion(fighter){
    return formerChampionNames.has(normal(fighter?.name))||(fighter?.tags||[]).includes('former-champion');
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

  function ratingEntry(fighter){return RATINGS.resolve(fighter?.id)||RATINGS.resolve(fighter?.name);}

  function scoreForPack(pack,fighter){
    const entry=ratingEntry(fighter);
    if(!entry)return null;
    const value=pack.division?entry.divisionRatings?.[pack.division]:entry.ratings?.[pack.categoryKey];
    return Number.isFinite(Number(value))?Number(value):null;
  }

  function eligibleForPack(pack,fighter){
    const entry=ratingEntry(fighter);
    if(!entry)return false;
    if(pack.division){
      if(!entry.eligibility?.divisions?.[pack.division])return false;
      if(!Number.isFinite(Number(entry.divisionRatings?.[pack.division])))return false;
    }else{
      if(!entry.eligibility?.[pack.categoryKey])return false;
      if(!Number.isFinite(Number(entry.ratings?.[pack.categoryKey])))return false;
    }
    if(pack.eligibility==='former-champion'&&!isFormerChampion(fighter))return false;
    if(pack.eligibility==='never-undisputed'&&isFormerChampion(fighter))return false;
    if(Array.isArray(pack.eras)&&pack.eras.length&&!fighter.eras?.some(era=>pack.eras.includes(era)))return false;
    return true;
  }

  function poolForPack(pack){
    PLAY_DATA.rebuild?.();
    RATINGS.rebuild?.();
    const filters={...(pack.filters||{})};
    if(pack.division)filters.division=pack.division;
    return PLAY_DATA.poolFor('keep-cut',filters).filter(fighter=>eligibleForPack(pack,fighter));
  }

  function bucketedPool(pack,pool=poolForPack(pack)){
    const ranked=[...pool].sort((a,b)=>(scoreForPack(pack,b)??-1)-(scoreForPack(pack,a)??-1)||a.name.localeCompare(b.name));
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

    state.balance={
      packId:pack.id,
      target:[...TARGET_BUCKETS],
      actual:actualBuckets,
      poolSize:pool.length,
      modelRanked:selected.filter(fighter=>fighter.modelRanked).length,
      playOnly:selected.filter(fighter=>!fighter.modelRanked).length
    };
    return shuffled(selected.slice(0,8));
  }

  function auditPacks(){
    const packs=PACKS.map(pack=>{
      const pool=poolForPack(pack);
      const {ranked,buckets}=bucketedPool(pack,pool);
      const bucketCounts=Object.fromEntries(BUCKET_ORDER.map(bucket=>[bucket,buckets[bucket].length]));
      const bucketReady=Object.entries(REQUIRED_BUCKET_COUNTS).every(([bucket,count])=>bucketCounts[bucket]>=count);
      const missingRatings=pool.filter(fighter=>!Number.isFinite(scoreForPack(pack,fighter))).map(fighter=>fighter.name);
      const modelRanked=pool.filter(fighter=>fighter.modelRanked).length;
      const playOnly=pool.length-modelRanked;
      return {
        id:pack.id,
        group:pack.group,
        categoryKey:pack.categoryKey||null,
        division:pack.division||null,
        poolSize:pool.length,
        modelRanked,
        playOnly,
        fullRosterEligible:playOnly>0||pack.id==='former-champions',
        bucketCounts,
        topFive:ranked.slice(0,5).map(fighter=>fighter.name),
        bottomFive:ranked.slice(-5).map(fighter=>fighter.name),
        missingRatings,
        playable:pool.length>=8&&bucketReady&&missingRatings.length===0
      };
    });
    return {
      passed:Boolean(RATINGS.audit?.passed)&&packs.every(pack=>pack.playable),
      ledgerVersion:RATINGS.version,
      ledgerAuditPassed:Boolean(RATINGS.audit?.passed),
      rosterTotal:PLAY_DATA.audit?.total||PLAY_DATA.allFighters.length,
      packs
    };
  }

  function refreshAudit(){
    PLAY_DATA.rebuild?.();
    RATINGS.rebuild?.();
    audit=auditPacks();
    document.documentElement.setAttribute('data-keep-cut-balance-audit',audit.passed?'passed':'failed');
    document.documentElement.setAttribute('data-keep-cut-full-roster','phase-two');
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
    return ['Serious','Debate','Entertainment','Chaos'].map(group=>{
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
    RATINGS.rebuild?.();
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
  window.addEventListener('ufc-keep-cut-ratings-ready',refreshAudit);

  const shared=parseShared();
  if(shared){
    setTimeout(()=>{
      document.querySelector('.tab[data-view="play"]')?.click();
      open(shared);
    },120);
  }

  window.UFC_KEEP_CUT={
    version:VERSION,
    phase:2,
    packs:PACKS.map(pack=>({...pack})),
    targetBuckets:[...TARGET_BUCKETS],
    ratingLedgerVersion:RATINGS.version,
    state,
    audit,
    open,
    startGame,
    buildLineup,
    challengeUrl,
    refreshAudit,
    scoreForPack,
    poolForPack
  };
  document.documentElement.setAttribute('data-keep-cut',VERSION);
  document.documentElement.setAttribute('data-keep-cut-phase','2');
  window.dispatchEvent(new CustomEvent('ufc-keep-cut-ready',{detail:{version:VERSION,phase:2,audit}}));
})();

(function(){
  'use strict';

  const VERSION='blind-rank-polish-20260715c-purpose-packs-turning-point';
  const PACK_KEY='ufc-goat-blind-rank-pack-v2';
  const GAME_KEY='ufc-goat-blind-rank-v1';
  const STRIKERS=[
    'Anderson Silva','Israel Adesanya','Alex Pereira','Conor McGregor','Max Holloway','Jose Aldo','Ilia Topuria','Stephen Thompson','Edson Barboza','Anthony Pettis','Joanna Jedrzejczyk','Valentina Shevchenko','Zhang Weili','Dustin Poirier','Justin Gaethje','Chuck Liddell','Lyoto Machida','Robbie Lawler','Sean O’Malley','Michel Pereira','Darren Till','Kevin Holland','Holly Holm','Donald Cerrone','Chan Sung Jung','Cub Swanson','Derrick Lewis','Francis Ngannou','Mike Perry','Tai Tuivasa','Paulo Costa'
  ];
  const GRAPPLERS=[
    'Khabib Nurmagomedov','Islam Makhachev','Georges St-Pierre','Jon Jones','Demetrious Johnson','Charles Oliveira','B.J. Penn','Matt Hughes','Randy Couture','Daniel Cormier','Henry Cejudo','Dominick Cruz','Aljamain Sterling','Merab Dvalishvili','Kamaru Usman','Cain Velasquez','Royce Gracie','Frank Shamrock','Ken Shamrock','Mark Coleman','Urijah Faber','Colby Covington','Yoel Romero','Tony Ferguson','Diego Sanchez','Clay Guida','Khamzat Chimaev','Alexandre Pantoja','Mackenzie Dern','Kayla Harrison','Julianna Peña','Carla Esparza','Ronda Rousey'
  ];
  const PACKS=[
    {id:'ufc-careers',name:'UFC Careers',prompt:'Rank their UFC careers',intro:'You see one fighter at a time. Place each UFC career from #1 to #5 before the next reveal.',filters:{gender:'men'}},
    {id:'all-careers',name:'All UFC Careers',prompt:'Rank their UFC careers',intro:'You see one fighter at a time. Place each UFC career from #1 to #5 before the next reveal.',filters:{}},
    {id:'womens-careers',name:'Women’s UFC Careers',prompt:'Rank their UFC careers',intro:'You see one fighter at a time. Place each UFC career from #1 to #5 before the next reveal.',filters:{gender:'women'}},
    {id:'lightweight',name:'Lightweight Careers',prompt:'Rank their UFC careers',intro:'You see one lightweight at a time. Place each UFC career from #1 to #5 before the next reveal.',filters:{gender:'men',division:'Lightweight'}},
    {id:'welterweight',name:'Welterweight Careers',prompt:'Rank their UFC careers',intro:'You see one welterweight at a time. Place each UFC career from #1 to #5 before the next reveal.',filters:{gender:'men',division:'Welterweight'}},
    {id:'heavyweight',name:'Heavyweight Careers',prompt:'Rank their UFC careers',intro:'You see one heavyweight at a time. Place each UFC career from #1 to #5 before the next reveal.',filters:{gender:'men',division:'Heavyweight'}},
    {id:'striking',name:'Striking',prompt:'Rank their striking',intro:'You see one fighter at a time. Rank only their UFC striking from #1 to #5 before the next reveal.',names:STRIKERS},
    {id:'wrestling-grappling',name:'Wrestling & Grappling',prompt:'Rank their wrestling and grappling',intro:'You see one fighter at a time. Rank their UFC wrestling and grappling from #1 to #5 before the next reveal.',names:GRAPPLERS},
    {id:'early-ufc',name:'Early UFC Careers',prompt:'Rank their UFC careers',intro:'You see one early-era fighter at a time. Place each UFC career from #1 to #5 before the next reveal.',filters:{gender:'men'},eras:['tournament','survival','zuffa-rebuild']}
  ];
  const ALIASES={'men-chaos':'ufc-careers','all-chaos':'all-careers','women-chaos':'womens-careers'};
  let patching=false;

  function esc(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
  function api(){return window.UFC_BLIND_RANK;}
  function data(){return window.UFC_PLAY_DATA;}
  function packFor(id){const key=ALIASES[id]||id;return PACKS.find(pack=>pack.id===key)||PACKS[0];}
  function savedPack(){try{return packFor(localStorage.getItem(PACK_KEY)||api()?.state?.packId).id;}catch(_error){return packFor(api()?.state?.packId).id;}}
  function random(items){return items.length?items[Math.floor(Math.random()*items.length)]:null;}
  function shuffle(items){const copy=[...items];for(let i=copy.length-1;i>0;i-=1){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}

  function pool(pack){
    const source=data();
    if(!source)return[];
    let rows=source.poolFor('blind-rank',pack.filters||{});
    if(pack.names){const ids=new Set(pack.names.map(name=>source.resolve(name)?.id).filter(Boolean));rows=rows.filter(row=>ids.has(row.id));}
    if(pack.eras)rows=rows.filter(row=>row.eras?.some(era=>pack.eras.includes(era)));
    return rows;
  }

  function lineup(pack){
    const remaining=[...pool(pack)];
    if(remaining.length<5)return[];
    const picked=[];
    ['legend','elite','contender','recognizable','wildcard'].forEach(tier=>{
      const fighter=random(remaining.filter(row=>row.selectionTier===tier));
      if(!fighter)return;
      picked.push(fighter);
      remaining.splice(remaining.findIndex(row=>row.id===fighter.id),1);
    });
    while(picked.length<5&&remaining.length){const fighter=random(remaining);picked.push(fighter);remaining.splice(remaining.findIndex(row=>row.id===fighter.id),1);}
    return shuffle(picked.slice(0,5));
  }

  function save(packId){
    const game=api();
    if(!game)return;
    try{
      localStorage.setItem(PACK_KEY,packId);
      localStorage.setItem(GAME_KEY,JSON.stringify({
        packId,
        lineup:game.state.lineup.map(fighter=>fighter.id),
        placements:game.state.placements.map(fighter=>fighter?.id||null),
        currentIndex:game.state.currentIndex,
        completed:game.state.completed
      }));
    }catch(_error){}
  }

  function start(packId,sharedLineup=null,shared=false){
    const game=api();
    const pack=packFor(packId);
    const fighters=sharedLineup||lineup(pack);
    if(!game||fighters.length!==5)return;
    game.startGame({packId:'men-chaos',lineup:fighters,shared});
    game.state.packId=pack.id;
    game.state.shared=Boolean(shared);
    save(pack.id);
    patch();
  }

  function story(){
    const state=api()?.state;
    if(!state?.completed)return null;
    const decisions=state.lineup.map((fighter,revealIndex)=>({fighter,slot:state.placements.findIndex(row=>row?.id===fighter.id),remaining:4-revealIndex}));
    return {commitment:decisions.find(item=>item.slot===0||item.slot===4)||decisions[0],forced:decisions[4]};
  }

  function patchSelect(pack){
    const select=document.getElementById('blindRankPack');
    if(!select)return;
    if(select.dataset.refined!==VERSION){
      select.innerHTML=PACKS.map(item=>`<option value="${esc(item.id)}">${esc(item.name)}</option>`).join('');
      select.dataset.refined=VERSION;
    }
    select.value=pack.id;
  }

  function patchFinish(){
    const result=story();
    if(!result)return;
    const hero=document.querySelector('#playBlindRankPanel .br-finish-hero');
    if(hero&&hero.dataset.refined!==VERSION){
      const count=result.commitment.remaining;
      hero.innerHTML=`<span>THE TURNING POINT</span><div class="br-turning-grid"><div><small>FIRST BIG COMMITMENT</small><h4>${esc(result.commitment.fighter.name)} locked at #${result.commitment.slot+1}</h4><p>${count?`You committed that slot with ${count} fighter${count===1?'':'s'} still hidden.`:'That slot stayed open until the final reveal.'}</p></div><div><small>FORCED FINISH</small><h4>${esc(result.forced.fighter.name)} landed at #${result.forced.slot+1}</h4><p>The final remaining slot made the decision for you.</p></div></div>`;
      hero.dataset.refined=VERSION;
      const results=hero.nextElementSibling;
      if(results?.classList.contains('br-results')&&!results.previousElementSibling?.classList.contains('br-results-title'))results.insertAdjacentHTML('beforebegin','<div class="br-results-title">YOUR FINAL RANKING</div>');
    }
    const actions=document.querySelector('#playBlindRankPanel .br-actions');
    if(actions&&actions.dataset.refined!==VERSION){
      actions.innerHTML='<button type="button" class="primary" data-br-challenge>CHALLENGE A FRIEND</button><button type="button" class="secondary" data-br-replay>NEW LINEUP</button>';
      actions.dataset.refined=VERSION;
    }
  }

  function patch(){
    if(patching||!api())return;
    patching=true;
    try{
      const state=api().state;
      const pack=packFor(state.packId||savedPack());
      state.packId=pack.id;
      patchSelect(pack);
      const heading=document.querySelector('#playBlindRankPanel .br-intro h3');
      const intro=document.querySelector('#playBlindRankPanel .br-intro p');
      const progress=document.querySelector('#playBlindRankPanel .br-progress span');
      const title=document.getElementById('playGameTitle');
      if(heading)heading.textContent=pack.prompt;
      if(intro)intro.textContent=pack.intro;
      if(progress)progress.textContent=pack.name;
      if(title&&!state.shared)title.textContent=pack.prompt.replace(/^./,letter=>letter.toUpperCase());
      patchFinish();
      document.documentElement.setAttribute('data-blind-rank-refinements',VERSION);
    }finally{patching=false;}
  }

  function injectStyles(){
    if(document.getElementById('blind-rank-refinement-css'))return;
    const style=document.createElement('style');
    style.id='blind-rank-refinement-css';
    style.textContent=`
      #play .br-current-meta,#play .br-result-row em{display:none!important}
      #play .br-result-row{grid-template-columns:42px 48px minmax(0,1fr)!important}
      #play .br-finish-hero{padding:17px!important;text-align:left!important}
      #play .br-finish-hero>span{display:block;color:#facc15;font-size:10px;font-weight:950;letter-spacing:.12em;text-align:center}
      #play .br-turning-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:11px}
      #play .br-turning-grid>div{border:1px solid rgba(82,103,134,.82);border-radius:14px;background:rgba(16,23,37,.62);padding:12px}
      #play .br-turning-grid small{display:block;color:#94a3b8;font-size:8px;font-weight:950;letter-spacing:.1em}
      #play .br-turning-grid h4{margin:5px 0 0;color:#fff;font-size:18px;line-height:1.1}
      #play .br-turning-grid p{margin:6px 0 0;color:#cbd5e1;font-size:10px;line-height:1.4}
      #play .br-results-title{color:#facc15;font-size:9px;font-weight:950;letter-spacing:.12em}
      #play .br-actions{grid-template-columns:repeat(2,minmax(0,1fr))!important}
      @media(max-width:700px){#play .br-result-row{grid-template-columns:34px 42px minmax(0,1fr)!important}#play .br-turning-grid{grid-template-columns:1fr}#play .br-actions{grid-template-columns:1fr!important}}
    `;
    document.head.appendChild(style);
  }

  function sharedChallenge(){
    const url=new URL(window.location.href);
    if(url.searchParams.get('game')!=='blind-rank')return null;
    const ids=(url.searchParams.get('brlineup')||'').split(',').map(value=>value.trim()).filter(Boolean);
    if(ids.length!==5||new Set(ids).size!==5||!data())return null;
    const fighters=ids.map(id=>data().resolve(id));
    if(fighters.some(fighter=>!fighter))return null;
    return {fighters,packId:packFor(url.searchParams.get('brpack')).id};
  }

  function init(){
    if(!api()||!data())return;
    injectStyles();
    api().state.packId=savedPack();
    patch();

    document.addEventListener('change',event=>{
      const select=event.target.closest?.('#blindRankPack');
      if(!select)return;
      event.preventDefault();
      event.stopImmediatePropagation();
      start(select.value);
    },true);

    document.addEventListener('click',event=>{
      const open=event.target.closest?.('[data-open-game="blind-rank"]');
      if(open){
        event.preventDefault();
        event.stopImmediatePropagation();
        api().open();
        api().state.packId=savedPack();
        patch();
        return;
      }
      if(!event.target.closest?.('#playBlindRankPanel'))return;
      if(event.target.closest('[data-br-new],[data-br-replay]')){
        event.preventDefault();
        event.stopImmediatePropagation();
        start(document.getElementById('blindRankPack')?.value||savedPack());
      }
    },true);

    const observer=new MutationObserver(()=>window.requestAnimationFrame(patch));
    observer.observe(document.getElementById('playBlindRankPanel')||document.body,{childList:true,subtree:true});

    const shared=sharedChallenge();
    if(shared)window.setTimeout(()=>{
      document.querySelector('.tab[data-view="play"]')?.click();
      api().open();
      start(shared.packId,shared.fighters,true);
    },180);
  }

  if(api()&&data())init();
  else window.addEventListener('ufc-blind-rank-ready',init,{once:true});
})();
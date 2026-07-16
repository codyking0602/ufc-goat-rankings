(function(){
  'use strict';

  const VERSION='play-challenge-adapters-20260715b-routing';
  let blindController=null;

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));

  function waitFor(check,timeout=9000){
    return new Promise((resolve,reject)=>{
      const started=Date.now();
      const tick=()=>{
        const value=check();
        if(value){resolve(value);return;}
        if(Date.now()-started>timeout){reject(new Error('The game did not finish loading.'));return;}
        setTimeout(tick,70);
      };
      tick();
    });
  }

  async function activatePlayView(){
    document.querySelector('.tab[data-view="play"]')?.click();
    await new Promise(resolve=>setTimeout(resolve,25));
  }

  function photoMarkup(fighter,className='play-adapter-photo'){
    const url=fighter?.thumbUrl||fighter?.profileUrl||'';
    const name=fighter?.name||fighter?.fighter||'UFC';
    const initials=String(name).split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
    return `<span class="${className}">${url?`<img src="${esc(url)}" alt="${esc(name)}">`:`<b>${esc(initials)}</b>`}</span>`;
  }

  function playFighter(idOrName){
    return window.UFC_PLAY_DATA?.resolve(idOrName)||null;
  }

  function rankingFighter(name){
    const key=String(name||'').trim().toLowerCase();
    const data=window.RANKING_DATA||{};
    const row=[...(data.men||[]),...(data.women||[])].find(item=>String(item?.fighter||'').trim().toLowerCase()===key)||{};
    const profile=(data.fighters||[]).find(item=>String(item?.fighter||'').trim().toLowerCase()===key)||{};
    return {...profile,...row,fighter:name};
  }

  function replaceOrInsert(host,selector,markup,beforeSelector){
    if(!host)return;
    host.querySelector(selector)?.remove();
    const before=beforeSelector?host.querySelector(beforeSelector):null;
    if(before)before.insertAdjacentHTML('beforebegin',markup);
    else host.insertAdjacentHTML('beforeend',markup);
  }

  function injectStyles(){
    if(document.getElementById('play-challenge-adapters-css'))return;
    const style=document.createElement('style');
    style.id='play-challenge-adapters-css';
    style.textContent=`
      #play .play-adapter-photo{width:38px;height:38px;border-radius:9px;background:#26364e;display:flex;align-items:center;justify-content:center;overflow:hidden;color:#e2e8f0;font-size:9px}#play .play-adapter-photo img{width:100%;height:100%;object-fit:cover;object-position:center top}
      #play .adapter-two-player{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}#play .adapter-player{border:1px solid #465a78;border-radius:14px;background:#172033;padding:9px;min-width:0}#play .adapter-player>h4{margin:0 0 8px;color:#fff;font-size:12px;text-transform:uppercase;letter-spacing:.05em}
      #play .adapter-choice-group{border-top:1px solid #334155;padding-top:7px;margin-top:7px}#play .adapter-choice-group>header{display:flex;justify-content:space-between;gap:8px}#play .adapter-choice-group>header span{color:#94a3b8;font-size:7px;font-weight:950;letter-spacing:.09em}#play .adapter-choice-group>header strong{font-size:10px;letter-spacing:.06em}#play .adapter-choice-group.keep>header strong{color:#4ade80}#play .adapter-choice-group.cut>header strong{color:#fb7185}
      #play .adapter-fighter-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;margin-top:6px}#play .adapter-fighter-grid article{min-width:0;border:1px solid #334155;border-radius:10px;background:#101725;padding:5px;display:grid;grid-template-columns:38px minmax(0,1fr);gap:6px;align-items:center}#play .adapter-fighter-grid article>strong{min-width:0;color:#fff;font-size:9px;line-height:1.08}
      #play .adapter-splits{margin-top:9px}#play .adapter-splits>span{display:block;color:#facc15;font-size:8px;font-weight:950;letter-spacing:.12em}#play .adapter-splits>div{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}#play .adapter-splits p{margin:0;border:1px solid #334155;border-radius:9px;background:#172033;padding:6px}#play .adapter-splits p strong,#play .adapter-splits p small{display:block}#play .adapter-splits p strong{color:#fff;font-size:9px}#play .adapter-splits p small{margin-top:2px;color:#cbd5e1;font-size:7px}
      #play .adapter-rank-list{display:grid;gap:5px}#play .adapter-rank-row{display:grid;grid-template-columns:25px 34px minmax(0,1fr);gap:6px;align-items:center;border:1px solid #334155;border-radius:9px;background:#101725;padding:5px}#play .adapter-rank-row>b{color:#facc15;font-size:11px;text-align:center}#play .adapter-rank-row .play-adapter-photo{width:34px;height:34px}#play .adapter-rank-row>strong{color:#fff;font-size:9px}
      #play .adapter-rounds{display:grid;gap:5px;margin-top:9px}#play .adapter-round{display:grid;grid-template-columns:55px minmax(0,1fr) auto;gap:7px;align-items:center;border:1px solid #334155;border-radius:10px;background:#172033;padding:7px}#play .adapter-round>b{color:#facc15;font-size:8px;letter-spacing:.06em}#play .adapter-round>span{color:#fff;font-size:9px}#play .adapter-round>small{color:#94a3b8;font-size:8px;text-align:right}
      @media(max-width:700px){#play .adapter-two-player{grid-template-columns:1fr}#play .adapter-fighter-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    `;
    document.head.appendChild(style);
  }

  function decisionArray(state){
    if(!state?.completed||!Array.isArray(state.decisions)||state.decisions.length!==8)return null;
    const result=Array(8).fill('');
    state.decisions.forEach(row=>{
      const index=Number(row.revealIndex);
      if(index>=0&&index<8)result[index]=row.choice==='keep'?'K':'C';
    });
    return result.every(Boolean)?result:null;
  }

  function choiceGroup(title,choice,lineup,result){
    const fighters=lineup.filter((_fighter,index)=>result[index]===choice);
    return `<section class="adapter-choice-group ${choice==='K'?'keep':'cut'}"><header><span>${esc(title)}</span><strong>${choice==='K'?'KEPT':'CUT'}</strong></header><div class="adapter-fighter-grid">${fighters.map(fighter=>`<article>${photoMarkup(fighter)}<strong>${esc(fighter.name)}</strong></article>`).join('')}</div></section>`;
  }

  function keepCutAdapter(){
    return {
      id:'keep-cut',
      version:'keep-cut-v2',
      title:'Keep 4, Cut 4',
      challengeSelector:'[data-kc-challenge]',
      incompleteMessage:'Finish all eight Keep/Cut decisions first.',
      canChallenge:()=>Boolean(decisionArray(window.UFC_KEEP_CUT?.state)),
      isComplete:()=>Boolean(decisionArray(window.UFC_KEEP_CUT?.state)),
      exportSetup:()=>{
        const state=window.UFC_KEEP_CUT?.state;
        if(!state?.lineup?.length)return null;
        return {packId:state.packId||'ufc-careers',lineup:state.lineup.map(fighter=>fighter.id)};
      },
      exportResult:()=>{
        const decisions=decisionArray(window.UFC_KEEP_CUT?.state);
        return decisions?{decisions}:null;
      },
      exportMetadata:()=>({comparison:'keep-cut-decisions'}),
      shareText:({url})=>`Keep four and cut four from my exact UFC lineup. Every decision locks.\n\n${url}`,
      bannerHost:()=>document.querySelector('#playKeepCutPanel .kc-wrap'),
      matchesSetup:setup=>window.UFC_KEEP_CUT?.state?.lineup?.map(fighter=>fighter.id).join('|')===(setup?.lineup||[]).join('|'),
      openSetup:async setup=>{
        const game=await waitFor(()=>window.UFC_KEEP_CUT);
        const data=await waitFor(()=>window.UFC_PLAY_DATA);
        const lineup=(setup?.lineup||[]).map(id=>data.resolve(id));
        if(lineup.length!==8||lineup.some(fighter=>!fighter))throw new Error('The Keep/Cut challenge lineup is incomplete.');
        await activatePlayView();
        game.open({lineup,packId:setup.packId||'ufc-careers',shared:true});
      },
      renderComparison:data=>{
        const finish=document.querySelector('#playKeepCutPanel .kc-finish');
        const lineup=window.UFC_KEEP_CUT?.state?.lineup||[];
        const mine=data.responder_result?.decisions||[];
        const theirs=data.creator_result?.decisions||[];
        if(!finish||lineup.length!==8||mine.length!==8||theirs.length!==8)return;
        const differences=lineup.map((fighter,index)=>({fighter,mine:mine[index],theirs:theirs[index]})).filter(row=>row.mine!==row.theirs);
        const same=8-differences.length;
        finish.querySelectorAll('.kc-final-group').forEach(node=>node.remove());
        const markup=`<section class="play-generic-comparison play-keep-cut-comparison"><header><div><span>CHALLENGE RESULTS</span><strong>${same}/8 SAME CALLS</strong></div><small>${differences.length?`${differences.length} disagreement${differences.length===1?'':'s'}`:'Perfect match'}</small></header><div class="adapter-two-player"><section class="adapter-player"><h4>YOU · ${esc(data.responder_name)}</h4>${choiceGroup('YOUR FOUR','K',lineup,mine)}${choiceGroup('YOUR FOUR','C',lineup,mine)}</section><section class="adapter-player"><h4>${esc(data.creator_name)}</h4>${choiceGroup("CHALLENGER'S FOUR",'K',lineup,theirs)}${choiceGroup("CHALLENGER'S FOUR",'C',lineup,theirs)}</section></div>${differences.length?`<div class="adapter-splits"><span>WHERE YOU SPLIT</span><div>${differences.map(row=>`<p><strong>${esc(row.fighter.name)}</strong><small>You ${row.mine==='K'?'kept':'cut'} · ${esc(data.creator_name)} ${row.theirs==='K'?'kept':'cut'}</small></p>`).join('')}</div></div>`:''}</section>`;
        replaceOrInsert(finish,'.play-keep-cut-comparison',markup,'.kc-actions');
      }
    };
  }

  function rankingList(title,names){
    const fighters=names.map(name=>playFighter(name)).filter(Boolean);
    return `<section class="adapter-player"><h4>${esc(title)}</h4><div class="adapter-rank-list">${fighters.map((fighter,index)=>`<div class="adapter-rank-row"><b>#${index+1}</b>${photoMarkup(fighter)}<strong>${esc(fighter.name)}</strong></div>`).join('')}</div></section>`;
  }

  function blindRankAdapter(){
    return {
      id:'blind-rank',
      version:'blind-rank-v2',
      title:'Blind Rank 5',
      challengeSelector:'[data-br-challenge]',
      incompleteMessage:'Finish all five placements first.',
      canChallenge:()=>Boolean(window.UFC_BLIND_RANK?.state?.completed&&window.UFC_BLIND_RANK.state.placements?.every(Boolean)),
      isComplete:()=>Boolean(window.UFC_BLIND_RANK?.state?.completed&&window.UFC_BLIND_RANK.state.placements?.every(Boolean)),
      exportSetup:()=>{
        const state=window.UFC_BLIND_RANK?.state;
        if(!state?.lineup?.length)return null;
        return {packId:state.packId||'ufc-careers',lineup:state.lineup.map(fighter=>fighter.id)};
      },
      exportResult:()=>{
        const state=window.UFC_BLIND_RANK?.state;
        return state?.completed&&state.placements?.every(Boolean)?{ranking:state.placements.map(fighter=>fighter.id)}:null;
      },
      exportMetadata:()=>({comparison:'ordered-ranking'}),
      shareText:({url})=>`Blind rank my exact five UFC fighters in the same reveal order, then compare our lists.\n\n${url}`,
      bannerHost:()=>document.querySelector('#playBlindRankPanel .br-wrap'),
      matchesSetup:setup=>window.UFC_BLIND_RANK?.state?.lineup?.map(fighter=>fighter.id).join('|')===(setup?.lineup||[]).join('|'),
      openSetup:async setup=>{
        const game=await waitFor(()=>window.UFC_BLIND_RANK);
        const data=await waitFor(()=>window.UFC_PLAY_DATA);
        const lineup=(setup?.lineup||[]).map(id=>data.resolve(id));
        if(lineup.length!==5||lineup.some(fighter=>!fighter))throw new Error('The Blind Rank challenge lineup is incomplete.');
        await activatePlayView();
        game.open({lineup,packId:setup.packId||'ufc-careers',shared:true});
      },
      renderComparison:data=>{
        const finish=document.querySelector('#playBlindRankPanel .br-finish');
        const mine=data.responder_result?.ranking||[];
        const theirs=data.creator_result?.ranking||[];
        if(!finish||mine.length!==5||theirs.length!==5)return;
        const exact=mine.filter((id,index)=>theirs[index]===id).length;
        const distances=mine.map((id,index)=>Math.abs(index-theirs.indexOf(id))).filter(Number.isFinite);
        const totalDistance=distances.reduce((sum,value)=>sum+value,0);
        finish.querySelector('.br-results-title')?.remove();
        finish.querySelector('.br-results')?.remove();
        const markup=`<section class="play-generic-comparison play-blind-rank-comparison"><header><div><span>CHALLENGE RESULTS</span><strong>${exact}/5 EXACT PLACEMENTS</strong></div><small>${totalDistance} total rank movement</small></header><div class="adapter-two-player">${rankingList(`YOU · ${data.responder_name}`,mine)}${rankingList(data.creator_name,theirs)}</div></section>`;
        replaceOrInsert(finish,'.play-blind-rank-comparison',markup,'.br-actions');
      }
    };
  }

  function blindResult(){
    const state=window.UFC_BLIND_MATCHMAKING?.state;
    if(!state?.finalVisible||state.rounds!==5||state.history?.length!==5)return null;
    return {
      score:Number(state.score)||0,
      rounds:state.history.map(row=>({
        round:row.round,
        fighterA:row.fighterA,
        fighterB:row.fighterB,
        picked:row.picked,
        winner:row.winner,
        correct:Boolean(row.correct)
      }))
    };
  }

  function setBlindChallengePair(index){
    if(!blindController?.active)return;
    const round=blindController.rounds[index];
    const engine=window.UFC_BLIND_MATCHMAKING;
    if(!round||!engine)return;
    engine.state.pair=[rankingFighter(round.fighterA),rankingFighter(round.fighterB)];
    engine.state.choice=null;
    engine.state.currentResult=null;
    engine.state.finalVisible=false;
    blindController.index=index;
    document.querySelector('[data-play-mode="blind"]')?.click();
  }

  function resetBlindEngine(){
    const state=window.UFC_BLIND_MATCHMAKING?.state;
    if(!state)return;
    state.pair=null;
    state.choice=null;
    state.currentResult=null;
    state.score=0;
    state.rounds=0;
    state.history=[];
    state.seenPairs=new Set();
    state.usedNames=new Set();
    state.lastNames=new Set();
    state.appearances=new Map();
    state.genderHistory=[];
    state.waitingForModel=false;
    state.finalVisible=false;
  }

  function bindBlindController(api){
    document.addEventListener('click',event=>{
      if(!blindController?.active)return;
      const next=event.target.closest?.('[data-five-round-next]');
      if(next&&window.UFC_BLIND_MATCHMAKING?.state?.rounds<5){
        event.preventDefault();
        event.stopImmediatePropagation();
        setBlindChallengePair(window.UFC_BLIND_MATCHMAKING.state.rounds);
        return;
      }
      if(event.target.closest?.('[data-five-round-replay]')){
        blindController=null;
        api.clearActiveChallenge?.();
      }
    },true);
  }

  function blindResumeAdapter(){
    return {
      id:'blind-resume',
      version:'blind-resume-v2',
      title:'Blind Resume',
      challengeSelector:'[data-five-round-share]',
      incompleteMessage:'Finish all five Blind Resume rounds first.',
      shouldHandleChallenge:()=>document.documentElement.getAttribute('data-play-screen')!=='daily-blind',
      canChallenge:()=>Boolean(blindResult()),
      isComplete:()=>Boolean(blindResult()),
      exportSetup:()=>{
        const result=blindResult();
        return result?{rounds:result.rounds.map(row=>({fighterA:row.fighterA,fighterB:row.fighterB}))}:null;
      },
      exportResult:blindResult,
      exportScore:()=>blindResult()?.score,
      exportMetadata:()=>({comparison:'five-round-model-picks'}),
      shareText:({url})=>`Play my exact five Blind Resume matchups, then compare our picks and scores.\n\n${url}`,
      bannerHost:()=>document.querySelector('#playBlindPanel .blind-stage'),
      matchesSetup:setup=>{
        const history=window.UFC_BLIND_MATCHMAKING?.state?.history||[];
        const rounds=setup?.rounds||[];
        return history.length===rounds.length&&history.every((row,index)=>row.fighterA===rounds[index]?.fighterA&&row.fighterB===rounds[index]?.fighterB);
      },
      openSetup:async setup=>{
        const rounds=setup?.rounds||[];
        if(rounds.length!==5||rounds.some(row=>!row.fighterA||!row.fighterB))throw new Error('The Blind Resume challenge is incomplete.');
        await waitFor(()=>window.UFC_BLIND_MATCHMAKING&&window.UFC_PLAY_HUB);
        await activatePlayView();
        await window.UFC_PLAY_HUB.openGame('blind',{daily:false});
        resetBlindEngine();
        blindController={active:true,rounds,index:0};
        setBlindChallengePair(0);
      },
      renderComparison:data=>{
        const card=document.querySelector('#playBlindPanel .blind-final-card');
        const mine=data.responder_result||{};
        const theirs=data.creator_result||{};
        if(!card||!Array.isArray(mine.rounds)||!Array.isArray(theirs.rounds))return;
        const differences=mine.rounds.map((round,index)=>({mine:round,theirs:theirs.rounds[index]})).filter(row=>row.mine?.picked!==row.theirs?.picked);
        const markup=`<section class="play-generic-comparison play-blind-resume-comparison"><header><div><span>CHALLENGE RESULTS</span><strong>YOU ${mine.score}/5 · ${esc(data.creator_name)} ${theirs.score}/5</strong></div><small>${differences.length?`${differences.length} different pick${differences.length===1?'':'s'}`:'Same five picks'}</small></header><div class="adapter-rounds">${mine.rounds.map((round,index)=>{const other=theirs.rounds[index]||{};const same=round.picked===other.picked;return `<div class="adapter-round"><b>ROUND ${index+1}</b><span>${esc(round.fighterA)} vs. ${esc(round.fighterB)}</span><small>${same?'Same pick':`You: ${esc(round.picked)} · ${esc(data.creator_name)}: ${esc(other.picked)}`}</small></div>`;}).join('')}</div></section>`;
        replaceOrInsert(card,'.play-blind-resume-comparison',markup,'.blind-final-recap');
      },
      decorate:()=>{
        const button=document.querySelector('#playBlindPanel [data-five-round-share]');
        if(!button)return;
        button.textContent=document.documentElement.getAttribute('data-play-screen')==='daily-blind'?'SHARE MY SCORE':'CHALLENGE A FRIEND';
      },
      bind:bindBlindController,
      daily:{
        version:'blind-resume-daily-v2',
        maxScore:5,
        isActive:()=>document.documentElement.getAttribute('data-play-screen')==='daily-blind',
        score:()=>blindResult()?.score,
        exportResult:blindResult,
        resultHost:()=>document.querySelector('#playBlindPanel .blind-final-card'),
        resultAnchor:()=>document.querySelector('#playBlindPanel .blind-final-hero')
      }
    };
  }

  function register(){
    const shared=window.UFC_PLAY_SHARED;
    if(!shared?.registerAdapter)return;
    injectStyles();
    shared.registerAdapter(keepCutAdapter());
    shared.registerAdapter(blindRankAdapter());
    shared.registerAdapter(blindResumeAdapter());
    document.documentElement.setAttribute('data-play-challenge-adapters',VERSION);
  }

  if(window.UFC_PLAY_SHARED?.registerAdapter)register();
  else window.addEventListener('ufc-play-shared-ready',register,{once:true});
})();
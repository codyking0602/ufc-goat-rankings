(function(){
  'use strict';

  const VERSION='keep-cut-challenge-20260715a';
  const SESSION_KEY='ufc-goat-keep-cut-active-challenge-v1';
  let activeChallenge=null;
  let observer=null;

  function esc(value){
    return String(value??'').replace(/[&<>"']/g,char=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[char]));
  }

  function initials(name){
    return String(name||'').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase()||'UFC';
  }

  function game(){return window.UFC_KEEP_CUT;}
  function data(){return window.UFC_PLAY_DATA;}

  function visual(fighter){
    const url=fighter?.thumbUrl||fighter?.profileUrl||'';
    return `<span class="kcc-photo">${url?`<img src="${esc(url)}" alt="${esc(fighter.name)}">`:`<b>${esc(initials(fighter?.name))}</b>`}</span>`;
  }

  function parseChoices(value){
    const choices=String(value||'').trim().toUpperCase();
    return /^[KC]{8}$/.test(choices)?choices.split(''):null;
  }

  function parseUrl(){
    const source=data();
    if(!source)return null;
    const url=new URL(window.location.href);
    if(url.searchParams.get('game')!=='keep-cut')return null;
    const ids=(url.searchParams.get('kclineup')||'').split(',').map(value=>value.trim()).filter(Boolean);
    if(ids.length!==8||new Set(ids).size!==8)return null;
    const lineup=ids.map(id=>source.resolve(id));
    if(lineup.some(fighter=>!fighter))return null;
    return {
      lineup,
      lineupIds:ids,
      packId:url.searchParams.get('kcpack')||'ufc-careers',
      choices:parseChoices(url.searchParams.get('kcchoices')),
      id:ids.join('|')
    };
  }

  function saveChallenge(challenge){
    activeChallenge=challenge;
    try{
      sessionStorage.setItem(SESSION_KEY,JSON.stringify({
        lineupIds:challenge.lineupIds,
        packId:challenge.packId,
        choices:challenge.choices?.join('')||''
      }));
    }catch(_error){}
  }

  function restoreChallenge(){
    const source=data();
    if(!source)return null;
    try{
      const saved=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null');
      if(!saved||!Array.isArray(saved.lineupIds)||saved.lineupIds.length!==8)return null;
      const lineup=saved.lineupIds.map(id=>source.resolve(id));
      if(lineup.some(fighter=>!fighter))return null;
      return {
        lineup,
        lineupIds:saved.lineupIds,
        packId:saved.packId||'ufc-careers',
        choices:parseChoices(saved.choices),
        id:saved.lineupIds.join('|')
      };
    }catch(_error){return null;}
  }

  function senderChoices(){
    const state=game()?.state;
    if(!state?.completed||!Array.isArray(state.decisions)||state.decisions.length!==8)return null;
    const choices=Array(8).fill('');
    state.decisions.forEach(row=>{
      const index=Number(row.revealIndex);
      if(index>=0&&index<8)choices[index]=row.choice==='keep'?'K':'C';
    });
    return choices.every(Boolean)?choices:null;
  }

  function challengeUrl(){
    const state=game()?.state;
    if(!state?.lineup?.length)return window.location.href;
    const url=new URL(window.location.href);
    url.searchParams.delete('room');
    url.searchParams.set('game','keep-cut');
    url.searchParams.set('kcpack',state.packId||'ufc-careers');
    url.searchParams.set('kclineup',state.lineup.map(fighter=>fighter.id).join(','));
    const choices=senderChoices();
    if(choices)url.searchParams.set('kcchoices',choices.join(''));
    else url.searchParams.delete('kcchoices');
    url.searchParams.set('kcv','2');
    url.hash='play';
    return url.toString();
  }

  function showToast(message){
    const toast=document.getElementById('keepCutToast');
    if(!toast)return;
    toast.textContent=message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer=setTimeout(()=>toast.classList.remove('show'),1600);
  }

  async function shareChallenge(){
    const state=game()?.state;
    if(!state?.completed)return;
    const pack=game().packs?.find(row=>row.id===state.packId);
    const payload={
      title:'UFC Keep 4, Cut 4',
      text:`Keep four and cut four from the exact same ${pack?.name||'UFC'} lineup. Then compare your choices with mine.`,
      url:challengeUrl()
    };
    try{
      if(navigator.share)await navigator.share(payload);
      else{
        await navigator.clipboard.writeText(`${payload.text}\n\n${payload.url}`);
        showToast('Challenge link copied');
      }
    }catch(error){
      if(error?.name!=='AbortError')showToast('Share failed');
    }
  }

  function choiceMap(decisions){
    const map=Array(8).fill(null);
    (decisions||[]).forEach(row=>{
      const index=Number(row.revealIndex);
      if(index>=0&&index<8)map[index]=row.choice==='keep'?'K':'C';
    });
    return map;
  }

  function resultCard(fighter){
    return `<div class="kcc-fighter">${visual(fighter)}<strong>${esc(fighter.name)}</strong></div>`;
  }

  function comparisonMarkup(challenge){
    const state=game()?.state;
    if(!state?.completed||!challenge?.choices)return'';
    const mine=choiceMap(state.decisions);
    if(mine.some(choice=>!choice))return'';
    const agreement=mine.reduce((total,choice,index)=>total+(choice===challenge.choices[index]?1:0),0);
    const myFour=state.lineup.filter((_fighter,index)=>mine[index]==='K');
    const theirFour=challenge.lineup.filter((_fighter,index)=>challenge.choices[index]==='K');
    const disagreements=state.lineup.map((fighter,index)=>({fighter,mine:mine[index],theirs:challenge.choices[index]})).filter(row=>row.mine!==row.theirs);
    return `<section class="kcc-comparison" data-kcc-id="${esc(challenge.id)}">
      <div class="kcc-heading"><div><span>CHALLENGE RESULTS</span><strong>${agreement}/8 SAME CALLS</strong></div><small>${disagreements.length?`${disagreements.length} disagreement${disagreements.length===1?'':'s'}`:'Perfect match'}</small></div>
      <div class="kcc-columns">
        <article><header><span>YOUR FOUR</span><strong>KEPT</strong></header><div class="kcc-four">${myFour.map(resultCard).join('')}</div></article>
        <article><header><span>CHALLENGER'S FOUR</span><strong>KEPT</strong></header><div class="kcc-four">${theirFour.map(resultCard).join('')}</div></article>
      </div>
      ${disagreements.length?`<div class="kcc-differences"><span>WHERE YOU SPLIT</span><div>${disagreements.map(row=>`<p><strong>${esc(row.fighter.name)}</strong><small>You ${row.mine==='K'?'kept':'cut'} · Challenger ${row.theirs==='K'?'kept':'cut'}</small></p>`).join('')}</div></div>`:''}
    </section>`;
  }

  function patchFinishedScreen(){
    const challenge=activeChallenge||restoreChallenge();
    const state=game()?.state;
    if(!challenge?.choices||!state?.completed)return;
    const sameLineup=state.lineup?.map(fighter=>fighter.id).join('|')===challenge.id;
    if(!sameLineup)return;
    const finish=document.querySelector('#playKeepCutPanel .kc-finish');
    if(!finish||finish.querySelector('.kcc-comparison'))return;
    finish.querySelectorAll('.kc-final-group').forEach(node=>node.remove());
    const actions=finish.querySelector('.kc-actions');
    const markup=comparisonMarkup(challenge);
    if(actions&&markup)actions.insertAdjacentHTML('beforebegin',markup);
  }

  function openChallenge(challenge){
    const currentGame=game();
    if(!currentGame||!challenge)return;
    saveChallenge(challenge);
    document.querySelector('.tab[data-view="play"]')?.click();
    setTimeout(()=>{
      currentGame.open({lineup:challenge.lineup,packId:challenge.packId,shared:true});
      saveChallenge(challenge);
      patchFinishedScreen();
    },260);
  }

  function injectStyles(){
    if(document.getElementById('keep-cut-challenge-css'))return;
    const style=document.createElement('style');
    style.id='keep-cut-challenge-css';
    style.textContent=`
      #play .kcc-comparison{grid-column:1/-1;border:1px solid rgba(250,204,21,.48);border-radius:17px;background:linear-gradient(135deg,rgba(250,204,21,.08),rgba(249,115,22,.05)),#101725;padding:12px}
      #play .kcc-heading{display:flex;justify-content:space-between;align-items:end;gap:10px;margin-bottom:10px}
      #play .kcc-heading span,#play .kcc-differences>span{display:block;color:#facc15;font-size:8px;font-weight:950;letter-spacing:.12em}
      #play .kcc-heading strong{display:block;margin-top:3px;color:#fff;font-size:18px}
      #play .kcc-heading small{color:#94a3b8;font-size:9px;font-weight:850}
      #play .kcc-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
      #play .kcc-columns article{border:1px solid #465a78;border-radius:14px;background:#172033;padding:9px}
      #play .kcc-columns header{display:flex;justify-content:space-between;align-items:end;margin-bottom:8px}
      #play .kcc-columns header span{color:#94a3b8;font-size:8px;font-weight:950;letter-spacing:.1em}
      #play .kcc-columns header strong{color:#4ade80;font-size:14px;letter-spacing:.07em}
      #play .kcc-four{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
      #play .kcc-fighter{min-width:0;border:1px solid #334155;border-radius:11px;background:#101725;padding:6px;display:grid;grid-template-columns:34px minmax(0,1fr);gap:6px;align-items:center}
      #play .kcc-fighter strong{min-width:0;color:#fff;font-size:9px;line-height:1.08}
      #play .kcc-photo{width:34px;height:34px;border-radius:8px;background:#26364e;display:flex;align-items:center;justify-content:center;overflow:hidden;color:#e2e8f0;font-size:9px}
      #play .kcc-photo img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block}
      #play .kcc-differences{margin-top:9px}
      #play .kcc-differences>div{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;margin-top:6px}
      #play .kcc-differences p{margin:0;border:1px solid #334155;border-radius:10px;background:#172033;padding:7px}
      #play .kcc-differences strong,#play .kcc-differences small{display:block}
      #play .kcc-differences strong{color:#fff;font-size:10px}
      #play .kcc-differences small{margin-top:2px;color:#cbd5e1;font-size:8px}
      @media(max-width:700px){
        #play .kcc-columns{grid-template-columns:1fr}
        #play .kcc-differences>div{grid-template-columns:1fr}
      }
    `;
    document.head.appendChild(style);
  }

  function bind(){
    injectStyles();

    document.addEventListener('click',event=>{
      const challengeButton=event.target.closest?.('[data-kc-challenge]');
      if(!challengeButton)return;
      event.preventDefault();
      event.stopImmediatePropagation();
      shareChallenge();
    },true);

    const panel=document.getElementById('playKeepCutPanel');
    if(panel){
      observer=new MutationObserver(()=>requestAnimationFrame(patchFinishedScreen));
      observer.observe(panel,{childList:true,subtree:true});
    }

    const incoming=parseUrl();
    if(incoming)openChallenge(incoming);
    else activeChallenge=restoreChallenge();

    document.documentElement.setAttribute('data-keep-cut-challenge',VERSION);
  }

  function init(){
    if(game()&&data())bind();
    else window.addEventListener('ufc-keep-cut-ready',bind,{once:true});
  }

  init();
})();
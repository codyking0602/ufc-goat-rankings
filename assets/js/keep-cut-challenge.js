(function(){
  'use strict';

  const VERSION='keep-cut-challenge-20260715d-stable-hash-compare';
  const SESSION_KEY='ufc-goat-keep-cut-active-challenge-v2';
  let activeChallenge=null;

  const game=()=>window.UFC_KEEP_CUT;
  const data=()=>window.UFC_PLAY_DATA;
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const initials=name=>String(name||'').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase()||'UFC';

  function visual(fighter){
    const url=fighter?.thumbUrl||fighter?.profileUrl||'';
    return `<span class="kcc-photo">${url?`<img src="${esc(url)}" alt="${esc(fighter.name)}">`:`<b>${esc(initials(fighter?.name))}</b>`}</span>`;
  }

  function encodeToken(payload){
    const bytes=new TextEncoder().encode(JSON.stringify(payload));
    let binary='';
    bytes.forEach(byte=>{binary+=String.fromCharCode(byte);});
    return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  }

  function decodeToken(token){
    try{
      const base64=String(token||'').replace(/-/g,'+').replace(/_/g,'/');
      const binary=atob(base64+'='.repeat((4-base64.length%4)%4));
      const bytes=Uint8Array.from(binary,char=>char.charCodeAt(0));
      return JSON.parse(new TextDecoder().decode(bytes));
    }catch(_error){return null;}
  }

  function choices(value){
    const normalized=String(value||'').trim().toUpperCase();
    return /^[KC]{8}$/.test(normalized)?normalized.split(''):null;
  }

  function resolveChallenge(payload){
    const source=data();
    if(!source||!payload)return null;
    const ids=Array.isArray(payload.l)?payload.l:String(payload.kclineup||'').split(',').map(value=>value.trim()).filter(Boolean);
    if(ids.length!==8||new Set(ids).size!==8)return null;
    const lineup=ids.map(id=>source.resolve(id));
    if(lineup.some(fighter=>!fighter))return null;
    return {lineup,lineupIds:ids,packId:payload.p||payload.kcpack||'ufc-careers',choices:choices(payload.c||payload.kcchoices),id:ids.join('|')};
  }

  function parseUrl(){
    const hash=window.location.hash||'';
    if(hash.startsWith('#kc-')){
      const challenge=resolveChallenge(decodeToken(hash.slice(4)));
      if(challenge)return challenge;
    }
    const url=new URL(window.location.href);
    if(url.searchParams.get('game')!=='keep-cut')return null;
    return resolveChallenge({kclineup:url.searchParams.get('kclineup'),kcpack:url.searchParams.get('kcpack'),kcchoices:url.searchParams.get('kcchoices')});
  }

  function saveChallenge(challenge){
    activeChallenge=challenge;
    try{sessionStorage.setItem(SESSION_KEY,JSON.stringify({l:challenge.lineupIds,p:challenge.packId,c:challenge.choices?.join('')||''}));}catch(_error){}
  }

  function restoreChallenge(){
    try{return resolveChallenge(JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null'));}catch(_error){return null;}
  }

  function senderChoices(){
    const state=game()?.state;
    if(!state?.completed||state.decisions?.length!==8)return null;
    const result=Array(8).fill('');
    state.decisions.forEach(row=>{
      const index=Number(row.revealIndex);
      if(index>=0&&index<8)result[index]=row.choice==='keep'?'K':'C';
    });
    return result.every(Boolean)?result:null;
  }

  function challengeUrl(){
    const state=game()?.state;
    const originalChoices=senderChoices();
    if(!state?.lineup?.length||!originalChoices)return window.location.href;
    const url=new URL(window.location.origin+window.location.pathname);
    url.hash=`kc-${encodeToken({v:3,p:state.packId||'ufc-careers',l:state.lineup.map(fighter=>fighter.id),c:originalChoices.join('')})}`;
    return url.toString();
  }

  function showToast(message){
    const toast=document.getElementById('keepCutToast');
    if(!toast)return;
    toast.textContent=message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer=setTimeout(()=>toast.classList.remove('show'),1700);
  }

  async function shareChallenge(){
    const state=game()?.state;
    if(!state?.completed)return;
    const pack=game().packs?.find(row=>row.id===state.packId);
    const link=challengeUrl();
    const text=`Keep four and cut four from the exact same ${pack?.name||'UFC'} lineup. Then compare your choices with mine.\n\n${link}`;
    try{
      if(navigator.share)await navigator.share({title:'UFC Keep 4, Cut 4',text});
      else{await navigator.clipboard.writeText(text);showToast('Challenge link copied');}
    }catch(error){if(error?.name!=='AbortError')showToast('Share failed');}
  }

  function choiceMap(decisions){
    const result=Array(8).fill(null);
    (decisions||[]).forEach(row=>{
      const index=Number(row.revealIndex);
      if(index>=0&&index<8)result[index]=row.choice==='keep'?'K':'C';
    });
    return result;
  }

  function fighterCard(fighter,choice){
    return `<div class="kcc-fighter ${choice==='K'?'kept':'cut'}">${visual(fighter)}<strong>${esc(fighter.name)}</strong><span>${choice==='K'?'KEEP':'CUT'}</span></div>`;
  }

  function choiceGroup(label,fighters,choice){
    return `<section class="kcc-choice-group ${choice==='K'?'kept':'cut'}"><header><span>${esc(label)}</span><strong>${choice==='K'?'KEPT':'CUT'}</strong></header><div class="kcc-four">${fighters.map(fighter=>fighterCard(fighter,choice)).join('')}</div></section>`;
  }

  function comparisonMarkup(challenge){
    const state=game()?.state;
    if(!state?.completed||!challenge?.choices)return'';
    const mine=choiceMap(state.decisions);
    if(mine.some(choice=>!choice))return'';
    const agreement=mine.reduce((total,choice,index)=>total+(choice===challenge.choices[index]?1:0),0);
    const myKept=state.lineup.filter((_fighter,index)=>mine[index]==='K');
    const myCut=state.lineup.filter((_fighter,index)=>mine[index]==='C');
    const theirKept=challenge.lineup.filter((_fighter,index)=>challenge.choices[index]==='K');
    const theirCut=challenge.lineup.filter((_fighter,index)=>challenge.choices[index]==='C');
    const disagreements=state.lineup.map((fighter,index)=>({fighter,mine:mine[index],theirs:challenge.choices[index]})).filter(row=>row.mine!==row.theirs);
    return `<section class="kcc-comparison" data-kcc-id="${esc(challenge.id)}">
      <div class="kcc-heading"><div><span>CHALLENGE RESULTS</span><strong>${agreement}/8 SAME CALLS</strong></div><small>${disagreements.length?`${disagreements.length} disagreement${disagreements.length===1?'':'s'}`:'Perfect match'}</small></div>
      <div class="kcc-players">
        <article class="kcc-player"><div class="kcc-player-title"><span>YOUR PICKS</span><strong>YOU</strong></div>${choiceGroup('YOUR FOUR',myKept,'K')}${choiceGroup('YOUR FOUR',myCut,'C')}</article>
        <article class="kcc-player"><div class="kcc-player-title"><span>ORIGINAL PICKS</span><strong>CHALLENGER</strong></div>${choiceGroup('THEIR FOUR',theirKept,'K')}${choiceGroup('THEIR FOUR',theirCut,'C')}</article>
      </div>
      ${disagreements.length?`<div class="kcc-differences"><span>WHERE YOU SPLIT</span><div>${disagreements.map(row=>`<p><strong>${esc(row.fighter.name)}</strong><small>You ${row.mine==='K'?'kept':'cut'} · Challenger ${row.theirs==='K'?'kept':'cut'}</small></p>`).join('')}</div></div>`:''}
    </section>`;
  }

  function patchFinishedScreen(){
    const challenge=activeChallenge||restoreChallenge();
    const state=game()?.state;
    if(!challenge?.choices||!state?.completed)return;
    if(state.lineup?.map(fighter=>fighter.id).join('|')!==challenge.id)return;
    const finish=document.querySelector('#playKeepCutPanel .kc-finish');
    if(!finish)return;
    const existing=finish.querySelector('.kcc-comparison');
    if(existing?.dataset.kccId===challenge.id)return;
    finish.querySelectorAll('.kc-final-group').forEach(node=>node.remove());
    existing?.remove();
    const actions=finish.querySelector('.kc-actions');
    const markup=comparisonMarkup(challenge);
    if(actions&&markup)actions.insertAdjacentHTML('beforebegin',markup);
  }

  function panelIsOpen(challenge){
    const panel=document.getElementById('playKeepCutPanel');
    const state=game()?.state;
    return Boolean(panel&&!panel.hidden&&state?.shared&&state.lineup?.map(fighter=>fighter.id).join('|')===challenge.id);
  }

  function openChallenge(challenge){
    if(!challenge)return;
    saveChallenge(challenge);
    const openNow=()=>{
      const currentGame=game();
      if(!currentGame)return;
      const tab=document.querySelector('.tab[data-view="play"]');
      if(tab&&!tab.classList.contains('active'))tab.click();
      if(!panelIsOpen(challenge))currentGame.open({lineup:challenge.lineup,packId:challenge.packId,shared:true});
      saveChallenge(challenge);
      patchFinishedScreen();
      document.documentElement.setAttribute('data-keep-cut-challenge-open','true');
    };
    openNow();
    [60,260,700].forEach(delay=>setTimeout(openNow,delay));
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
      #play .kcc-players{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
      #play .kcc-player{border:1px solid #465a78;border-radius:14px;background:#172033;padding:9px;display:grid;gap:8px}
      #play .kcc-player-title{display:flex;justify-content:space-between;align-items:end;border-bottom:1px solid #334155;padding-bottom:7px}
      #play .kcc-player-title span{color:#94a3b8;font-size:8px;font-weight:950;letter-spacing:.1em}
      #play .kcc-player-title strong{color:#fff;font-size:14px;letter-spacing:.07em}
      #play .kcc-choice-group{border:1px solid #334155;border-radius:12px;background:#101725;padding:7px}
      #play .kcc-choice-group header{display:flex;justify-content:space-between;align-items:end;margin-bottom:6px}
      #play .kcc-choice-group header span{color:#64748b;font-size:7px;font-weight:950;letter-spacing:.08em}
      #play .kcc-choice-group header strong{font-size:11px;letter-spacing:.07em}
      #play .kcc-choice-group.kept header strong{color:#4ade80}
      #play .kcc-choice-group.cut header strong{color:#fb7185}
      #play .kcc-four{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
      #play .kcc-fighter{min-width:0;border:1px solid #334155;border-radius:11px;background:#172033;padding:6px;display:grid;grid-template-columns:34px minmax(0,1fr);gap:6px;align-items:center;position:relative}
      #play .kcc-fighter strong{min-width:0;color:#fff;font-size:9px;line-height:1.08;padding-right:25px}
      #play .kcc-fighter>span:last-child{position:absolute;right:5px;top:5px;font-size:6px;font-weight:950;letter-spacing:.05em}
      #play .kcc-fighter.kept>span:last-child{color:#4ade80}
      #play .kcc-fighter.cut>span:last-child{color:#fb7185}
      #play .kcc-photo{width:34px;height:34px;border-radius:8px;background:#26364e;display:flex;align-items:center;justify-content:center;overflow:hidden;color:#e2e8f0;font-size:9px}
      #play .kcc-photo img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block}
      #play .kcc-differences{margin-top:9px}
      #play .kcc-differences>div{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;margin-top:6px}
      #play .kcc-differences p{margin:0;border:1px solid #334155;border-radius:10px;background:#172033;padding:7px}
      #play .kcc-differences strong,#play .kcc-differences small{display:block}
      #play .kcc-differences strong{color:#fff;font-size:10px}
      #play .kcc-differences small{margin-top:2px;color:#cbd5e1;font-size:8px}
      @media(max-width:700px){#play .kcc-players{grid-template-columns:1fr}#play .kcc-differences>div{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function bind(){
    injectStyles();
    document.addEventListener('click',event=>{
      const button=event.target.closest?.('[data-kc-challenge]');
      if(!button)return;
      event.preventDefault();
      event.stopImmediatePropagation();
      shareChallenge();
    },true);

    const panel=document.getElementById('playKeepCutPanel');
    if(panel)new MutationObserver(()=>requestAnimationFrame(patchFinishedScreen)).observe(panel,{childList:true,subtree:true});

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
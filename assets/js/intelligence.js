(function(){
  'use strict';

  const GPT_URL='https://chatgpt.com/g/g-6a4c40425d4881919ddebc7231bff09f-octagon-verdict';
  const VERSION='intelligence-20260719a-shanes-watchlist';
  const PROMPTS=[
    {icon:'👑',text:'Who is the best UFC fighter never to win undisputed gold?'},
    {icon:'📈',text:'What would Islam need to reach the top three?'},
    {icon:'🔥',text:'Who has the best prime outside the current top 10?'},
    {icon:'🚀',text:'Which active fighter has the clearest path to the all-time top 10?'},
    {icon:'🧩',text:'Which fighter’s clean record hides a lack of career volume?'},
    {icon:'🔍',text:'Why is Pantoja’s quality-of-wins ranking lower than expected?'}
  ];
  const copyMatchupButton=document.getElementById('intelligenceCopyMatchup');
  const toast=document.getElementById('intelligenceToast');
  let toastTimer=0;

  function ensureIntelligenceLabel(){
    const tab=document.querySelector('.tab[data-view="compare"]');
    if(tab&&tab.textContent.trim()!=='Intelligence')tab.textContent='Intelligence';
  }

  function renderStarterPrompts(){
    const list=document.querySelector('.intelligence-prompt-list');
    if(!list)return;
    list.replaceChildren(...PROMPTS.map(({icon,text})=>{
      const button=document.createElement('button');
      button.className='intelligence-prompt';
      button.type='button';
      button.dataset.intelligencePrompt=text;

      const iconNode=document.createElement('span');
      iconNode.className='intelligence-prompt-icon';
      iconNode.textContent=icon;

      const copy=document.createElement('span');
      copy.className='intelligence-prompt-copy';
      copy.textContent=text;

      const status=document.createElement('span');
      status.className='intelligence-prompt-status';
      status.textContent='Copy';

      button.append(iconNode,copy,status);
      return button;
    }));
  }

  function node(tag,className,text){
    const element=document.createElement(tag);
    if(className)element.className=className;
    if(text!==undefined&&text!==null)element.textContent=String(text);
    return element;
  }

  function renderWatchCard(fighter,index){
    const card=node('article',`shane-watch-card${index===0?' is-featured':''}`);
    card.dataset.shaneWatchFighter=fighter.id||'';

    const top=node('div','shane-watch-card-top');
    top.append(node('span','shane-watch-status',fighter.status||'Watching'),node('span','shane-watch-added',fighter.added||''));

    const identity=node('div','shane-watch-identity');
    const avatar=node('div','shane-watch-avatar',fighter.initials||fighter.name?.slice(0,2)||'FW');
    avatar.setAttribute('aria-hidden','true');
    const nameWrap=node('div','shane-watch-name-wrap');
    nameWrap.append(node('h4','shane-watch-name',fighter.name||'Fighter'));
    if(fighter.nickname)nameWrap.append(node('span','shane-watch-nickname',`“${fighter.nickname}”`));
    identity.append(avatar,nameWrap);

    const meta=[fighter.division,fighter.age?`Age ${fighter.age}`:'',fighter.country].filter(Boolean).join(' · ');
    const metaNode=node('p','shane-watch-meta',meta);
    const snapshotLabel=node('div','shane-watch-snapshot-label','At Shane’s call');
    const stats=node('div','shane-watch-stats');
    (fighter.snapshot||[]).slice(0,3).forEach(stat=>{
      const statNode=node('div','shane-watch-stat');
      statNode.append(node('strong','',stat.value),node('span','',stat.label));
      stats.append(statNode);
    });

    card.append(top,identity,metaNode,snapshotLabel,stats);
    if(fighter.quote)card.append(node('blockquote','shane-watch-quote',`“${fighter.quote}”`));
    else if(fighter.note)card.append(node('p','shane-watch-note',fighter.note));

    const footer=node('div','shane-watch-footer');
    if(fighter.comparison){
      const comparison=node('span','');
      comparison.append('Shane’s comp: ',node('strong','',fighter.comparison));
      footer.append(comparison);
    }else{
      footer.append(node('span','','Why he’s here'));
    }
    footer.append(node('span','shane-watch-highlight',fighter.highlight||''));
    card.append(footer);
    return card;
  }

  function renderShanesWatchlist(){
    const data=window.SHANES_FIGHTERS_TO_WATCH;
    const content=document.querySelector('.intelligence-content');
    const prompts=content?.querySelector('.intelligence-prompts');
    if(!content||!prompts||!Array.isArray(data?.fighters)||!data.fighters.length||content.querySelector('.shane-watchlist'))return;

    const section=node('section','shane-watchlist');
    section.setAttribute('aria-labelledby','shaneWatchlistTitle');

    const head=node('div','shane-watchlist-head');
    const copy=node('div','shane-watchlist-copy');
    copy.append(
      node('span','shane-watchlist-kicker','Scouting board'),
      node('h3','shane-watchlist-title',data.title||'Shane’s Fighters to Watch'),
      node('p','shane-watchlist-subtitle',data.subtitle||'Early calls. No hindsight. No cap.')
    );
    copy.querySelector('.shane-watchlist-title').id='shaneWatchlistTitle';
    const count=node('span','shane-watchlist-count',`${data.fighters.length} active`);
    head.append(copy,count);

    const grid=node('div','shane-watch-grid');
    data.fighters.forEach((fighter,index)=>grid.append(renderWatchCard(fighter,index)));
    section.append(head,grid);
    prompts.before(section);
  }

  ensureIntelligenceLabel();
  renderStarterPrompts();
  renderShanesWatchlist();
  const tabs=document.querySelector('.tabs');
  if(tabs)new MutationObserver(ensureIntelligenceLabel).observe(tabs,{childList:true,subtree:true,characterData:true});
  window.addEventListener?.('ufc-production-ranking-ready',ensureIntelligenceLabel);
  window.addEventListener?.('ufc-scoring-pipeline-ready',ensureIntelligenceLabel);

  document.querySelectorAll('[data-intelligence-open]').forEach(link=>{
    link.href=GPT_URL;
    link.target='_blank';
    link.rel='noopener noreferrer';
  });

  function cleanText(value){
    return String(value||'').replace(/\s+/g,' ').trim();
  }

  async function copyText(text){
    const value=cleanText(text);
    if(!value)return false;
    try{
      if(navigator.clipboard&&window.isSecureContext){
        await navigator.clipboard.writeText(value);
        return true;
      }
    }catch(_error){}
    try{
      const area=document.createElement('textarea');
      area.value=value;
      area.setAttribute('readonly','');
      area.style.position='fixed';
      area.style.opacity='0';
      area.style.pointerEvents='none';
      document.body.appendChild(area);
      area.select();
      const copied=document.execCommand('copy');
      area.remove();
      return copied;
    }catch(_error){
      return false;
    }
  }

  function showToast(message){
    if(!toast)return;
    window.clearTimeout(toastTimer);
    toast.textContent=message;
    toast.classList.add('show');
    toastTimer=window.setTimeout(()=>toast.classList.remove('show'),1900);
  }

  function activateIntelligence(){
    if(window.UFC_APP_SHELL?.activateDestination?.('intelligence'))return true;
    if(window.UFC_PRODUCT_ARCHITECTURE?.activateView?.('compare'))return true;
    const tab=document.querySelector('[data-destination="intelligence"],[data-view="compare"]');
    if(tab){tab.click();return true;}
    location.hash='#intelligence';
    return false;
  }

  document.querySelectorAll('[data-intelligence-prompt]').forEach(button=>{
    button.addEventListener('click',async()=>{
      const copied=await copyText(button.dataset.intelligencePrompt);
      const status=button.querySelector('.intelligence-prompt-status');
      if(copied){
        button.classList.add('is-copied');
        if(status)status.textContent='Copied';
        showToast('Question copied. Open Octagon Verdict when you’re ready.');
        window.setTimeout(()=>{
          button.classList.remove('is-copied');
          if(status)status.textContent='Copy';
        },1800);
      }else{
        showToast('Could not copy automatically. Press and hold the question to copy it.');
      }
    });
  });

  function matchupPrompt(){
    const fighterA=document.getElementById('fighterA')?.value;
    const fighterB=document.getElementById('fighterB')?.value;
    if(!fighterA||!fighterB)return'';
    return `Compare ${fighterA} and ${fighterB}. Start with the verdict, give the losing fighter's best counterargument, explain why the winner still wins, and separate the better fighter from the better UFC-only GOAT resume.`;
  }

  copyMatchupButton?.addEventListener('click',async()=>{
    const prompt=matchupPrompt();
    if(!prompt){
      showToast('Choose two fighters first.');
      return;
    }
    const copied=await copyText(prompt);
    showToast(copied?'Matchup copied. Open Octagon Verdict to paste it.':'Could not copy the matchup automatically.');
  });

  function blindResumePrompt(result){
    if(!result?.winner||!result?.loser)return'';
    const winnerRank=result.winner===result.fighterA?result.rankA:result.rankB;
    const loserRank=result.loser===result.fighterA?result.rankA:result.rankB;
    const board=result.gender==='women'?"women's":"men's";
    return `Compare ${result.winner} and ${result.loser} in the UFC-only GOAT model. ${result.winner} is ranked #${winnerRank} and ${result.loser} is ranked #${loserRank} on the ${board} board. Start with the verdict, break down Championship, Opponent Quality, Prime Dominance, Longevity, and Loss Context, give ${result.loser}'s strongest counterargument, explain why ${result.winner} still ranks higher, and separate the better fighter from the better UFC-only GOAT resume.`;
  }

  function installBlindGatewayStyles(){
    if(document.getElementById('blindIntelligenceGatewayCss'))return;
    const style=document.createElement('style');
    style.id='blindIntelligenceGatewayCss';
    style.textContent=`
      #play .blind-intelligence-actions{display:grid;gap:8px;margin-top:10px}
      #play .blind-intelligence-actions .play-primary,#play .blind-intelligence-actions .play-secondary{width:100%}
      #play .blind-intelligence-button{border-color:rgba(249,115,22,.58);background:#101725;color:#fdba74}
      #play .blind-intelligence-button:disabled{opacity:.68;cursor:default}
    `;
    document.head.appendChild(style);
  }

  function decorateBlindReveal(){
    const reveal=document.getElementById('blindReveal');
    const next=reveal?.querySelector('[data-five-round-next]');
    const result=window.UFC_BLIND_MATCHMAKING?.state?.currentResult;
    if(!reveal||reveal.hidden||!next||!result||reveal.querySelector('[data-blind-intelligence]'))return;
    installBlindGatewayStyles();
    const actions=document.createElement('div');
    actions.className='blind-intelligence-actions';
    const button=document.createElement('button');
    button.type='button';
    button.className='play-secondary blind-intelligence-button';
    button.dataset.blindIntelligence='true';
    button.textContent='EXPLAIN IN INTELLIGENCE';
    next.before(actions);
    actions.append(button,next);
  }

  async function handleBlindGateway(button){
    const result=window.UFC_BLIND_MATCHMAKING?.state?.currentResult;
    const prompt=blindResumePrompt(result);
    if(!prompt)return;
    button.disabled=true;
    button.textContent='COPYING MATCHUP…';
    const copied=await copyText(prompt);
    activateIntelligence();
    window.setTimeout(()=>showToast(copied?'Matchup copied. Open Octagon Verdict and paste it.':'Intelligence opened, but the matchup could not be copied automatically.'),60);
  }

  const blindReveal=document.getElementById('blindReveal');
  if(blindReveal){
    new MutationObserver(decorateBlindReveal).observe(blindReveal,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
    blindReveal.addEventListener('click',event=>{
      const button=event.target.closest('[data-blind-intelligence]');
      if(button){event.preventDefault();event.stopPropagation();handleBlindGateway(button);}
    });
    decorateBlindReveal();
  }

  window.UFC_INTELLIGENCE={version:VERSION,copyText,showToast,activate:activateIntelligence,blindResumePrompt,renderShanesWatchlist};
  document.documentElement.setAttribute('data-intelligence',VERSION);
})();

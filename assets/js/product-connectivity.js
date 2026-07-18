(function(){
  'use strict';

  const VERSION='product-connectivity-20260718c-clean-handoffs';
  const GPT_URL='https://chatgpt.com/g/g-6a4c40425d4881919ddebc7231bff09f-octagon-verdict';
  let renderFrame=0;
  let profileObserver=null;
  let warRoomObserver=null;
  let toastTimer=0;
  let eventsBound=false;

  const text=value=>String(value??'').trim();
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));

  function normalizeFighterIdentity(value){
    return text(value)
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g,'')
      .replace(/["“”'‘’][^"“”'‘’]{1,40}["“”'‘’]/g,' ')
      .replace(/\([^)]{1,40}\)/g,' ')
      .toLowerCase()
      .replace(/&/g,' and ')
      .replace(/[^a-z0-9]+/g,' ')
      .trim();
  }

  function allCanonicalNames(){
    const data=window.RANKING_DATA||{};
    const rows=[
      ...(Array.isArray(data.fighters)?data.fighters:[]),
      ...(Array.isArray(data.men)?data.men:[]),
      ...(Array.isArray(data.women)?data.women:[])
    ];
    const seen=new Set();
    return rows.map(row=>text(row?.fighter)).filter(name=>{
      const key=normalizeFighterIdentity(name);
      if(!key||seen.has(key))return false;
      seen.add(key);
      return true;
    });
  }

  function canonicalFighterName(value){
    const target=normalizeFighterIdentity(value);
    if(!target)return'';
    return allCanonicalNames().find(name=>normalizeFighterIdentity(name)===target)||text(value);
  }

  function installStyles(){
    let style=document.getElementById('productConnectivityCss');
    if(!style){
      style=document.createElement('style');
      style.id='productConnectivityCss';
      document.head.appendChild(style);
    }
    style.textContent=`
      .profile-connectivity-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:16px}
      .profile-connectivity-actions button{min-height:45px;border:1px solid #475569;border-radius:13px;background:#111827;color:#fff;padding:0 14px;cursor:pointer;font:950 10px/1 system-ui;letter-spacing:.05em;text-transform:uppercase}
      .profile-connectivity-actions button.primary{border-color:#f97316;background:#f97316;color:#17100b}
      .profile-connectivity-actions button:active{transform:translateY(1px)}
      .intelligence-context-bridge{margin:0 0 18px;padding:17px;border:1px solid rgba(249,115,22,.45);border-radius:17px;background:linear-gradient(145deg,rgba(249,115,22,.11),rgba(15,23,42,.9));color:#f8fafc}
      .intelligence-context-bridge .context-kicker{display:block;color:#fb923c;font:950 9px/1 system-ui;letter-spacing:.14em;text-transform:uppercase}
      .intelligence-context-bridge h3{margin:8px 0 0;color:#fff;font:950 19px/1.1 system-ui}
      .intelligence-context-bridge p{margin:9px 0 0;color:#cbd5e1;font:650 12px/1.5 system-ui}
      .intelligence-context-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:13px}
      .intelligence-context-actions button,.intelligence-context-actions a{min-height:40px;display:inline-flex;align-items:center;justify-content:center;border:1px solid #475569;border-radius:11px;background:#111827;color:#fff;padding:0 13px;text-decoration:none;cursor:pointer;font:950 9px/1 system-ui;letter-spacing:.04em;text-transform:uppercase}
      .intelligence-context-actions a{border-color:#f97316;background:#f97316;color:#17100b}
      .intelligence-context-status{display:block;margin-top:9px;color:#fdba74;font:750 10px/1.35 system-ui}
      #picksWarRoomBridge,.picks-war-room-bridge{display:none!important}
      .product-connectivity-toast{position:fixed;left:50%;bottom:22px;z-index:12000;max-width:min(420px,calc(100vw - 28px));transform:translate(-50%,18px);padding:11px 14px;border:1px solid rgba(249,115,22,.55);border-radius:12px;background:#111827;color:#fff;box-shadow:0 18px 50px rgba(0,0,0,.35);font:800 11px/1.35 system-ui;opacity:0;pointer-events:none;transition:.18s ease}
      .product-connectivity-toast.show{opacity:1;transform:translate(-50%,0)}
      @media(max-width:620px){.intelligence-context-actions{display:grid;grid-template-columns:1fr 1fr}.intelligence-context-actions button,.intelligence-context-actions a{width:100%}}
    `;
  }

  function toast(message){
    let node=document.getElementById('productConnectivityToast');
    if(!node){
      node=document.createElement('div');
      node.id='productConnectivityToast';
      node.className='product-connectivity-toast';
      node.setAttribute('role','status');
      node.setAttribute('aria-live','polite');
      document.body.appendChild(node);
    }
    window.clearTimeout(toastTimer);
    node.textContent=message;
    node.classList.add('show');
    toastTimer=window.setTimeout(()=>node.classList.remove('show'),2200);
  }

  async function copyText(value){
    const clean=text(value).replace(/\s+/g,' ');
    if(!clean)return false;
    try{
      if(navigator.clipboard&&window.isSecureContext){
        await navigator.clipboard.writeText(clean);
        return true;
      }
    }catch(_error){}
    try{
      const area=document.createElement('textarea');
      area.value=clean;
      area.setAttribute('readonly','');
      area.style.position='fixed';
      area.style.opacity='0';
      area.style.pointerEvents='none';
      document.body.appendChild(area);
      area.select();
      const copied=document.execCommand('copy');
      area.remove();
      return copied;
    }catch(_error){return false;}
  }

  function activate(destination){
    if(window.UFC_PRODUCT_ARCHITECTURE?.activateDestination){
      return window.UFC_PRODUCT_ARCHITECTURE.activateDestination(destination)!==false;
    }
    document.querySelector(`[data-destination="${destination}"]`)?.click();
    return true;
  }

  function rankingLocation(name){
    const target=normalizeFighterIdentity(name);
    const data=window.RANKING_DATA||{};
    const boards=[
      {key:'men',rows:Array.isArray(data.men)?data.men:[]},
      {key:'women',rows:Array.isArray(data.women)?data.women:[]}
    ];
    for(const board of boards){
      const index=board.rows.findIndex(row=>normalizeFighterIdentity(row?.fighter)===target);
      if(index>=0)return{...board,row:board.rows[index],index};
    }
    return{key:'',rows:[],row:null,index:-1};
  }

  function closeFighterDrawer(){
    document.getElementById('closeDrawer')?.click();
    const drawer=document.getElementById('drawer');
    drawer?.classList.remove('open');
    drawer?.setAttribute('aria-hidden','true');
    document.body.classList.remove('home-profile-open');
  }

  function ensureIntelligenceContext(){
    const content=document.querySelector('.intelligence-content');
    if(!content)return null;
    let card=document.getElementById('intelligenceContextBridge');
    if(!card){
      card=document.createElement('section');
      card.id='intelligenceContextBridge';
      card.className='intelligence-context-bridge';
      const subtitle=content.querySelector('.intelligence-subtitle');
      if(subtitle)subtitle.after(card);else content.prepend(card);
    }
    return card;
  }

  function renderIntelligenceContext({source='OCTAGON HQ',title='Question ready',prompt='',copied=false}={}){
    const card=ensureIntelligenceContext();
    if(!card)return null;
    const signature=`${source}|${title}|${prompt}|${copied}`;
    if(card.dataset.signature===signature)return card;
    card.dataset.signature=signature;
    card.dataset.prompt=prompt;
    card.innerHTML=`
      <span class="context-kicker">${esc(source)}</span>
      <h3>${esc(title)}</h3>
      <p>${esc(prompt)}</p>
      <div class="intelligence-context-actions">
        <button type="button" data-connectivity-copy-prompt>COPY QUESTION</button>
        <a href="${esc(GPT_URL)}" target="_blank" rel="noopener noreferrer">OPEN OCTAGON VERDICT ↗</a>
      </div>
      <span class="intelligence-context-status" data-connectivity-context-status>${copied?'Question copied. Paste it into Octagon Verdict.':'Copy the question, then open Octagon Verdict.'}</span>`;
    return card;
  }

  function openIntelligencePrompt({source,title,prompt,copy=true}={}){
    const copyPromise=copy?copyText(prompt):Promise.resolve(false);
    activate('intelligence');
    window.setTimeout(async()=>{
      const copied=await copyPromise;
      const card=renderIntelligenceContext({source,title,prompt,copied});
      card?.scrollIntoView({behavior:'smooth',block:'start'});
      toast(copied?'Question copied and ready in Intelligence.':'Question ready in Intelligence.');
    },40);
  }

  function optionForFighter(select,value){
    if(!select)return null;
    const requested=normalizeFighterIdentity(canonicalFighterName(value));
    return [...select.options].find(option=>{
      const optionValue=normalizeFighterIdentity(option.value);
      const optionLabel=normalizeFighterIdentity(option.textContent);
      return optionValue===requested||optionLabel===requested;
    })||null;
  }

  function setFighterSelect(select,value){
    const option=optionForFighter(select,value);
    if(!option)return false;
    select.value=option.value;
    select.dispatchEvent(new Event('change',{bubbles:true}));
    return true;
  }

  function resetOpponentSelect(select){
    if(!select)return false;
    let placeholder=[...select.options].find(option=>option.dataset.chooseOpponent==='true');
    if(!placeholder){
      placeholder=document.createElement('option');
      placeholder.value='';
      placeholder.textContent='Choose opponent';
      placeholder.disabled=true;
      placeholder.dataset.chooseOpponent='true';
      select.prepend(placeholder);
    }
    placeholder.selected=true;
    select.value='';
    select.dispatchEvent(new Event('change',{bubbles:true}));
    return true;
  }

  function prepareComparison(name){
    closeFighterDrawer();
    activate('intelligence');
    document.getElementById('intelligenceContextBridge')?.remove();
    let tries=0;
    const apply=()=>{
      tries+=1;
      const fighterA=document.getElementById('fighterA');
      const fighterB=document.getElementById('fighterB');
      if(!fighterA||!fighterB||!fighterA.options.length||!fighterB.options.length){
        if(tries<24)window.setTimeout(apply,60);
        return;
      }
      const canonical=canonicalFighterName(name);
      const selected=setFighterSelect(fighterA,canonical);
      resetOpponentSelect(fighterB);
      const details=document.querySelector('details.intelligence-matchup');
      if(details)details.open=true;
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        details?.scrollIntoView({behavior:'smooth',block:'start'});
      }));
      toast(selected?`${canonical} is ready. Choose an opponent.`:'Choose the first fighter, then select an opponent.');
    };
    window.setTimeout(apply,30);
  }

  function enhanceFighterProfile(){
    const summary=document.querySelector('#fighterDetail .profile-summary');
    const name=text(summary?.querySelector('h2')?.textContent);
    if(!summary||!name)return false;
    let actions=summary.querySelector('.profile-connectivity-actions');
    if(actions?.dataset.fighter===name)return true;
    actions?.remove();
    actions=document.createElement('div');
    actions.className='profile-connectivity-actions';
    actions.dataset.fighter=name;
    actions.innerHTML=`<button type="button" data-profile-connectivity="compare" data-fighter="${esc(name)}">COMPARE</button><button type="button" class="primary" data-profile-connectivity="ask" data-fighter="${esc(name)}">ASK WHY</button>`;
    const copy=summary.querySelector('.profile-copy');
    if(copy)copy.after(actions);else summary.appendChild(actions);
    return true;
  }

  function latestWarRoomTake(){
    const messages=Array.isArray(window.UFC_OCTAGON_BOARD?.snapshot?.messages)?window.UFC_OCTAGON_BOARD.snapshot.messages:[];
    const rows=messages
      .filter(message=>!message?.parent_message_id&&!message?.deleted&&text(message?.body))
      .sort((a,b)=>new Date(b?.created_at).getTime()-new Date(a?.created_at).getTime());
    return text(rows[0]?.body);
  }

  function warRoomPrompt(){
    const take=latestWarRoomTake();
    if(take){
      return `Analyze this UFC take from the War Room: "${take}". Start with a verdict, give the strongest counterargument, explain what the UFC-only GOAT model says, and separate the better fighter from the better UFC-only GOAT resume when relevant.`;
    }
    return 'Give me one strong UFC-only GOAT debate for this week’s War Room. Present both sides, give a verdict, and explain what the ranking model would prioritize.';
  }

  function enhanceWarRoom(){
    const board=document.querySelector('[data-octagon-board]');
    const actions=board?.querySelector('.octagon-board-head-actions');
    if(!board||!actions)return false;
    let button=board.querySelector('[data-connectivity-war-intelligence]');
    if(!button){
      button=document.createElement('button');
      button.type='button';
      button.className='octagon-intelligence-button';
      button.dataset.connectivityWarIntelligence='true';
      button.textContent='TAKE TO INTELLIGENCE →';
    }
    const primary=board.querySelector('[data-war-room-primary-actions]');
    if(primary&&!primary.contains(button))primary.appendChild(button);
    else if(!button.isConnected)actions.appendChild(button);
    return true;
  }

  function removePicksBridge(){
    document.querySelectorAll('#picksWarRoomBridge,.picks-war-room-bridge').forEach(node=>node.remove());
    return false;
  }

  function renderAll(){
    enhanceFighterProfile();
    enhanceWarRoom();
    removePicksBridge();
  }

  function scheduleRender(){
    if(renderFrame)return;
    renderFrame=requestAnimationFrame(()=>{
      renderFrame=0;
      renderAll();
    });
  }

  function bindObservers(){
    const detail=document.getElementById('fighterDetail');
    if(detail){
      profileObserver?.disconnect();
      profileObserver=new MutationObserver(scheduleRender);
      profileObserver.observe(detail,{childList:true,subtree:true});
    }
    const warRoom=document.getElementById('octagon');
    if(warRoom){
      warRoomObserver?.disconnect();
      warRoomObserver=new MutationObserver(scheduleRender);
      warRoomObserver.observe(warRoom,{childList:true,subtree:true});
    }
  }

  function bindEvents(){
    if(eventsBound)return;
    eventsBound=true;
    document.addEventListener('click',event=>{
      const profileButton=event.target.closest?.('[data-profile-connectivity]');
      if(profileButton){
        event.preventDefault();
        event.stopPropagation();
        const name=text(profileButton.dataset.fighter);
        if(profileButton.dataset.profileConnectivity==='compare'){
          prepareComparison(name);
        }else{
          closeFighterDrawer();
          const location=rankingLocation(name);
          const rank=Number(location.row?.rank);
          const rankText=Number.isFinite(rank)&&rank>0
            ? location.key==='women'?`#${rank} on the women’s all-time board`:`#${rank} all-time`
            : 'where they are';
          const finalQuestion=rank===1?'Explain why the fighter is the benchmark and why the fighter should not be ranked lower.':'Explain why the fighter is not ranked higher.';
          const prompt=`Why is ${name} ranked ${rankText} in this UFC-only GOAT model? Break down Championship, Opponent Quality, Prime Dominance, Longevity, and Loss Context. Explain the key judgment calls, why the fighter ranks here, and ${finalQuestion}`;
          openIntelligencePrompt({source:'FROM FIGHTER PROFILE',title:`Why ${name} ranks here`,prompt,copy:true});
        }
        return;
      }

      if(event.target.closest?.('[data-connectivity-war-intelligence]')){
        event.preventDefault();
        openIntelligencePrompt({source:'FROM THE WAR ROOM',title:'War Room debate ready',prompt:warRoomPrompt(),copy:true});
        return;
      }

      const copyButton=event.target.closest?.('[data-connectivity-copy-prompt]');
      if(copyButton){
        const card=copyButton.closest('.intelligence-context-bridge');
        const prompt=card?.dataset.prompt||card?.querySelector('p')?.textContent||'';
        copyText(prompt).then(copied=>{
          const status=card?.querySelector('[data-connectivity-context-status]');
          if(status)status.textContent=copied?'Question copied. Paste it into Octagon Verdict.':'Could not copy automatically. Press and hold the question to copy it.';
          toast(copied?'Question copied.':'Could not copy automatically.');
        });
      }
    },true);

    window.addEventListener('octagon-hq:view-change',scheduleRender);
    window.addEventListener('ufc-production-ranking-ready',scheduleRender);
    window.addEventListener('ufc-scoring-pipeline-ready',scheduleRender);
    window.addEventListener('ufc-play-profile-ready',scheduleRender);
    window.addEventListener('ufc-app-profile-updated',scheduleRender);
  }

  function start(){
    installStyles();
    removePicksBridge();
    bindObservers();
    bindEvents();
    renderAll();
    [120,500,1400].forEach(delay=>window.setTimeout(()=>{
      bindObservers();
      renderAll();
    },delay));
  }

  window.UFC_PRODUCT_CONNECTIVITY={
    version:VERSION,
    render:renderAll,
    prepareComparison,
    openIntelligencePrompt,
    renderPicksBridge:removePicksBridge,
    enhanceWarRoom,
    enhanceFighterProfile,
    normalizeFighterIdentity,
    canonicalFighterName
  };
  document.documentElement.setAttribute('data-product-connectivity',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
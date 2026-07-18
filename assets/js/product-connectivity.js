(function(){
  'use strict';

  const VERSION='product-connectivity-20260717c-clean-handoffs';
  const GPT_URL='https://chatgpt.com/g/g-6a4c40425d4881919ddebc7231bff09f-octagon-verdict';
  let profileObserver=null;
  let warRoomObserver=null;
  let renderFrame=0;
  let toastTimer=0;

  const text=value=>String(value??'').trim();
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  function normalizeName(value){
    return text(value)
      .normalize('NFKD')
      .toLowerCase()
      .replace(/[“"][^”"]+[”"]/g,' ')
      .replace(/\([^)]*\)/g,' ')
      .replace(/[^a-z0-9]+/g,' ')
      .trim();
  }

  function installStyles(){
    let style=document.getElementById('productConnectivityCss');
    if(!style){
      style=document.createElement('style');
      style.id='productConnectivityCss';
      document.head.appendChild(style);
    }
    style.textContent=`
      .profile-connectivity-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:18px}
      .profile-connectivity-actions button{min-height:46px;border:1px solid #536681;border-radius:14px;background:#101827;color:#fff;padding:0 14px;font:950 11px/1 system-ui;letter-spacing:.04em;cursor:pointer}
      .profile-connectivity-actions button.primary{border-color:#f97316;background:#f97316;color:#111827}
      .profile-connectivity-actions button:active{transform:scale(.985)}
      .intelligence-context-bridge{margin:18px 0 26px;padding:20px;border:1px solid rgba(249,115,22,.55);border-radius:20px;background:radial-gradient(circle at 100% 0,rgba(249,115,22,.14),transparent 34%),linear-gradient(145deg,#211716,#111827 58%,#0b1020);color:#f8fafc}
      .intelligence-context-bridge .context-kicker{display:block;color:#fb923c;font:950 10px/1 system-ui;letter-spacing:.16em}
      .intelligence-context-bridge h3{margin:10px 0 0;color:#fff;font:950 clamp(22px,5vw,31px)/1.02 system-ui;letter-spacing:-.025em}
      .intelligence-context-bridge p{margin:13px 0 0;color:#d8dee9;font:700 15px/1.5 system-ui}
      .intelligence-context-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}
      .intelligence-context-actions button,.intelligence-context-actions a{display:flex;align-items:center;justify-content:center;min-height:48px;border:1px solid #526783;border-radius:14px;background:#121b2b;color:#fff;padding:0 14px;text-align:center;text-decoration:none;font:950 10px/1 system-ui;letter-spacing:.04em}
      .intelligence-context-actions a{border-color:#f97316;background:#f97316;color:#111827}
      .intelligence-context-status{display:block;margin-top:13px;color:#fdba74;font:800 10px/1.4 system-ui}
      .intelligence-matchup select option[data-connectivity-placeholder]{color:#94a3b8}
      #intelligenceCopyMatchup:disabled{opacity:.48;cursor:not-allowed}
      .war-room-intelligence-strip{border-left:1px solid #2b3a52;border-right:1px solid #2b3a52;background:linear-gradient(90deg,rgba(249,115,22,.13),rgba(15,23,42,.96));padding:12px 20px}
      .war-room-intelligence-strip button{width:100%;min-height:48px;border:1px solid #f97316;border-radius:14px;background:#f97316;color:#111827;padding:0 16px;font:950 11px/1 system-ui;letter-spacing:.06em;cursor:pointer}
      .octagon-board-head{grid-template-columns:1fr!important;align-items:start!important}
      .octagon-board-head-actions{width:100%;justify-content:flex-start!important;align-items:center!important;gap:7px!important}
      .octagon-board-head-actions .octagon-live{margin-right:auto}
      .octagon-board-head-actions button{min-height:34px!important;padding:0 9px!important;font-size:9px!important}
      .octagon-board-head-actions .octagon-manage-beta{border-color:#3d4d65!important;background:transparent!important;color:#94a3b8!important}
      .octagon-board-head-actions .octagon-manage-beta.active{border-color:#f97316!important;color:#fed7aa!important}
      @media(max-width:620px){
        .profile-connectivity-actions{gap:8px}
        .profile-connectivity-actions button{min-height:44px;padding:0 8px;font-size:10px}
        .intelligence-context-actions{grid-template-columns:1fr}
        .war-room-intelligence-strip{padding:10px 16px}
        .octagon-board-head-actions{display:grid!important;grid-template-columns:auto 1fr auto auto!important}
        .octagon-board-head-actions .octagon-live{margin-right:0}
        .octagon-board-head-actions .octagon-manage-beta{justify-self:end}
      }
    `;
  }

  function activate(destination){
    const api=window.UFC_PRODUCT_ARCHITECTURE;
    if(api?.activateDestination){api.activateDestination(destination);return true;}
    const button=document.querySelector(`[data-destination="${destination}"]`);
    button?.click();
    return Boolean(button);
  }

  function showToast(message){
    const node=document.getElementById('intelligenceToast');
    if(!node)return;
    window.clearTimeout(toastTimer);
    node.textContent=message;
    node.classList.add('show');
    toastTimer=window.setTimeout(()=>node.classList.remove('show'),1900);
  }

  async function copyText(value){
    const prompt=text(value);
    if(!prompt)return false;
    try{
      if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(prompt);return true;}
    }catch(_error){}
    try{
      const area=document.createElement('textarea');
      area.value=prompt;
      area.readOnly=true;
      area.style.position='fixed';
      area.style.opacity='0';
      document.body.appendChild(area);
      area.select();
      const copied=document.execCommand('copy');
      area.remove();
      return copied;
    }catch(_error){return false;}
  }

  function rankingLocation(name){
    const data=window.RANKING_DATA||{};
    const exact=list=>(Array.isArray(list)?list:[]).find(row=>text(row?.fighter)===name);
    let row=exact(data.men);
    if(row)return{key:'men',row};
    row=exact(data.women);
    return row?{key:'women',row}:{key:'',row:null};
  }

  function closeFighterDrawer(){
    const drawer=document.getElementById('drawer');
    drawer?.classList.remove('open');
    drawer?.setAttribute('aria-hidden','true');
    document.body.classList.remove('fighter-drawer-open');
  }

  function renderIntelligenceContext({source,title,prompt,copied=false}={}){
    const content=document.querySelector('#compare .intelligence-content');
    if(!content)return null;
    let card=document.getElementById('intelligenceContextBridge');
    if(!card){
      card=document.createElement('section');
      card.id='intelligenceContextBridge';
      card.className='intelligence-context-bridge';
      const openCard=content.querySelector('.intelligence-open-card');
      if(openCard)openCard.before(card);else content.prepend(card);
    }
    card.dataset.prompt=text(prompt);
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
    const copying=copy?copyText(prompt):Promise.resolve(false);
    activate('intelligence');
    window.setTimeout(async()=>{
      const copied=await copying;
      const card=renderIntelligenceContext({source,title,prompt,copied});
      card?.scrollIntoView({behavior:'smooth',block:'start'});
      showToast(copied?'Question copied and ready in Intelligence.':'Question ready in Intelligence.');
    },40);
  }

  function optionFor(select,name){
    if(!select)return null;
    const wanted=text(name);
    const exact=[...select.options].find(option=>option.value===wanted||text(option.textContent)===wanted);
    if(exact)return exact;
    const normalized=normalizeName(wanted);
    return [...select.options].find(option=>normalizeName(option.value)===normalized||normalizeName(option.textContent)===normalized)||null;
  }

  function ensureOpponentPlaceholder(select){
    if(!select)return null;
    let option=select.querySelector('option[data-connectivity-placeholder]');
    if(!option){
      option=document.createElement('option');
      option.value='';
      option.textContent='Choose opponent';
      option.dataset.connectivityPlaceholder='true';
      option.disabled=true;
      select.prepend(option);
    }
    return option;
  }

  function updateMatchupActions(){
    const a=document.getElementById('fighterA');
    const b=document.getElementById('fighterB');
    const copy=document.getElementById('intelligenceCopyMatchup');
    if(copy)copy.disabled=!text(a?.value)||!text(b?.value);
  }

  function prepareComparison(name){
    closeFighterDrawer();
    activate('intelligence');
    document.getElementById('intelligenceContextBridge')?.remove();
    let tries=0;
    const apply=()=>{
      tries+=1;
      const first=document.getElementById('fighterA');
      const second=document.getElementById('fighterB');
      if(!first||!second||!first.options.length){
        if(tries<24)window.setTimeout(apply,50);
        return;
      }
      const fighterOption=optionFor(first,name);
      if(fighterOption){
        first.value=fighterOption.value;
        first.dispatchEvent(new Event('change',{bubbles:true}));
      }
      ensureOpponentPlaceholder(second);
      second.value='';
      second.dispatchEvent(new Event('change',{bubbles:true}));
      updateMatchupActions();
      const details=document.querySelector('details.intelligence-matchup');
      if(details)details.open=true;
      window.setTimeout(()=>details?.scrollIntoView({behavior:'smooth',block:'start'}),30);
      showToast(`${fighterOption?.textContent||name} loaded. Choose an opponent.`);
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

  function cleanWarRoomCopy(board){
    const kicker=board.querySelector('.octagon-board-kicker');
    const heading=board.querySelector('.octagon-board-head h2');
    const input=board.querySelector('[data-octagon-input]');
    const manage=board.querySelector('[data-octagon-manage-beta]');
    if(kicker&&kicker.textContent!=='GOAT26 WAR ROOM')kicker.textContent='GOAT26 WAR ROOM';
    if(heading&&heading.textContent!=='The War Room')heading.textContent='The War Room';
    if(input&&/Octagon/i.test(input.placeholder||''))input.placeholder=(input.placeholder||'').replace(/The Octagon/gi,'The War Room').replace(/Octagon/gi,'War Room');
    if(manage&&manage.textContent!=='Manage Access')manage.textContent='Manage Access';
    board.querySelectorAll('[title],[aria-label]').forEach(node=>{
      ['title','aria-label'].forEach(attribute=>{
        const current=node.getAttribute(attribute);
        if(current&&/Octagon|Beta/i.test(current))node.setAttribute(attribute,current.replace(/Private Beta/gi,'War Room').replace(/The Octagon/gi,'The War Room').replace(/Octagon/gi,'War Room').replace(/Manage Beta/gi,'Manage Access'));
      });
    });
  }

  function enhanceWarRoom(){
    const board=document.querySelector('[data-octagon-board]');
    const header=board?.querySelector('.octagon-board-head');
    const actions=header?.querySelector('.octagon-board-head-actions');
    if(!board||!header||!actions)return false;
    cleanWarRoomCopy(board);

    let strip=board.querySelector('.war-room-intelligence-strip');
    if(!strip){
      strip=document.createElement('div');
      strip.className='war-room-intelligence-strip';
      strip.innerHTML='<button type="button" data-connectivity-war-intelligence>TAKE TO INTELLIGENCE →</button>';
    }
    if(header.nextElementSibling!==strip)header.insertAdjacentElement('afterend',strip);

    const live=actions.querySelector('[data-octagon-live]');
    const week=actions.querySelector('[data-octagon-week-select]');
    const manage=actions.querySelector('[data-octagon-manage-beta]');
    const alerts=actions.querySelector('[data-octagon-alerts]');
    const refresh=actions.querySelector('[data-octagon-refresh]');
    [live,week,manage,alerts,refresh].filter(Boolean).forEach(node=>actions.appendChild(node));
    return true;
  }

  async function syncWarRoomRuntime(destination){
    const board=window.UFC_OCTAGON_BOARD;
    if(destination==='war-room'){
      await board?.load?.();
      await board?.ensureRealtime?.();
      enhanceWarRoom();
    }else{
      await board?.stopRealtime?.();
    }
  }

  function removePicksPromotion(){
    document.getElementById('picksWarRoomBridge')?.remove();
  }

  function renderAll(){
    removePicksPromotion();
    enhanceFighterProfile();
    enhanceWarRoom();
    ensureOpponentPlaceholder(document.getElementById('fighterB'));
    updateMatchupActions();
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
      warRoomObserver.observe(warRoom,{childList:true,subtree:true,attributes:true,attributeFilter:['placeholder','title','aria-label']});
    }
  }

  function bindEvents(){
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
          showToast(copied?'Question copied.':'Could not copy automatically.');
        });
      }
    },true);

    document.getElementById('fighterA')?.addEventListener('change',updateMatchupActions);
    document.getElementById('fighterB')?.addEventListener('change',updateMatchupActions);
    window.addEventListener('octagon-hq:view-change',event=>{
      scheduleRender();
      syncWarRoomRuntime(event.detail?.destination);
    });
    window.addEventListener('ufc-production-ranking-ready',scheduleRender);
    window.addEventListener('ufc-scoring-pipeline-ready',scheduleRender);
    window.addEventListener('ufc-play-profile-ready',scheduleRender);
    window.addEventListener('ufc-app-profile-updated',scheduleRender);
  }

  function start(){
    installStyles();
    removePicksPromotion();
    bindObservers();
    bindEvents();
    renderAll();
    if(document.getElementById('octagon')?.classList.contains('active-view'))syncWarRoomRuntime('war-room');
    [160,700].forEach(delay=>window.setTimeout(()=>{bindObservers();renderAll();},delay));
  }

  window.UFC_PRODUCT_CONNECTIVITY={
    version:VERSION,
    render:renderAll,
    prepareComparison,
    openIntelligencePrompt,
    enhanceWarRoom,
    enhanceFighterProfile
  };
  document.documentElement.setAttribute('data-product-connectivity',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
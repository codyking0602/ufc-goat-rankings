(function(){
  'use strict';

  const VERSION='product-connectivity-20260717a-phase-1c';
  const GPT_URL='https://chatgpt.com/g/g-6a4c40425d4881919ddebc7231bff09f-octagon-verdict';
  let renderFrame=0;
  let picksObserver=null;
  let profileObserver=null;
  let warRoomObserver=null;
  let toastTimer=0;

  const text=value=>String(value??'').trim();
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));

  function installStyles(){
    if(document.getElementById('productConnectivityCss'))return;
    const style=document.createElement('style');
    style.id='productConnectivityCss';
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
      .picks-war-room-bridge{margin:14px 0;padding:16px;border:1px solid rgba(249,115,22,.48);border-radius:17px;background:linear-gradient(135deg,#17243a,#0d1524);color:#f8fafc;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center}
      .picks-war-room-bridge span,.picks-war-room-bridge strong,.picks-war-room-bridge small{display:block}
      .picks-war-room-bridge span{color:#fb923c;font:950 9px/1 system-ui;letter-spacing:.14em}
      .picks-war-room-bridge strong{margin-top:6px;font:950 17px/1.08 system-ui}
      .picks-war-room-bridge small{margin-top:7px;color:#94a3b8;font:700 11px/1.4 system-ui}
      .picks-war-room-bridge button{min-height:44px;border:1px solid #f97316;border-radius:12px;background:#f97316;color:#17100b;padding:0 15px;cursor:pointer;font:950 10px/1 system-ui;white-space:nowrap}
      .octagon-intelligence-button{border-color:rgba(249,115,22,.72)!important;color:#fed7aa!important}
      .product-connectivity-toast{position:fixed;left:50%;bottom:22px;z-index:12000;max-width:min(420px,calc(100vw - 28px));transform:translate(-50%,18px);padding:11px 14px;border:1px solid rgba(249,115,22,.55);border-radius:12px;background:#111827;color:#fff;box-shadow:0 18px 50px rgba(0,0,0,.35);font:800 11px/1.35 system-ui;opacity:0;pointer-events:none;transition:.18s ease}
      .product-connectivity-toast.show{opacity:1;transform:translate(-50%,0)}
      @media(max-width:620px){
        .profile-connectivity-actions{grid-template-columns:1fr 1fr}
        .picks-war-room-bridge{grid-template-columns:1fr}.picks-war-room-bridge button{width:100%}
        .intelligence-context-actions{display:grid;grid-template-columns:1fr 1fr}.intelligence-context-actions button,.intelligence-context-actions a{width:100%}
      }
    `;
    document.head.appendChild(style);
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
    const api=window.UFC_PRODUCT_ARCHITECTURE;
    if(api?.activateDestination){api.activateDestination(destination);return true;}
    document.querySelector(`[data-destination="${destination}"]`)?.click();
    return true;
  }

  function rankingRow(name){
    const target=text(name).toLowerCase();
    const data=window.RANKING_DATA||{};
    const boards=[Array.isArray(data.men)?data.men:[],Array.isArray(data.women)?data.women:[]];
    for(const board of boards){
      const index=board.findIndex(row=>text(row?.fighter).toLowerCase()===target);
      if(index>=0)return{row:board[index],board,index};
    }
    return{row:null,board:[],index:-1};
  }

  function fighterRank(name){
    const value=Number(rankingRow(name).row?.rank);
    return Number.isFinite(value)&&value>0?value:null;
  }

  function nearestOpponent(name){
    const result=rankingRow(name);
    if(result.index<0)return'';
    return text(result.board[result.index+1]?.fighter||result.board[result.index-1]?.fighter);
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

  function setSelectValue(select,value){
    if(!select||!value)return false;
    const option=[...select.options].find(item=>item.value===value||text(item.textContent)===value);
    if(!option)return false;
    select.value=option.value;
    select.dispatchEvent(new Event('change',{bubbles:true}));
    return true;
  }

  function prepareComparison(name){
    activate('intelligence');
    const opponent=nearestOpponent(name);
    let tries=0;
    const apply=()=>{
      tries+=1;
      const a=document.getElementById('fighterA');
      const b=document.getElementById('fighterB');
      if(!a||!b||!a.options.length){
        if(tries<20)window.setTimeout(apply,60);
        return;
      }
      setSelectValue(a,name);
      if(opponent)setSelectValue(b,opponent);
      if(b.value===a.value){
        const fallback=[...b.options].find(option=>option.value!==a.value);
        if(fallback){b.value=fallback.value;b.dispatchEvent(new Event('change',{bubbles:true}));}
      }
      const details=document.querySelector('details.intelligence-matchup');
      if(details)details.open=true;
      const prompt=`Compare ${name} and ${b.value}. Start with the verdict, give the losing fighter's best counterargument, explain why the winner still wins, and separate the better fighter from the better UFC-only GOAT resume.`;
      renderIntelligenceContext({source:'FROM FIGHTER PROFILE',title:`${name} comparison ready`,prompt,copied:false});
      details?.scrollIntoView({behavior:'smooth',block:'start'});
      toast(`${name} loaded into Compare.`);
    };
    window.setTimeout(apply,40);
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

  function currentPicksEvent(){
    const events=Array.isArray(window.UFC_PICKS_EVENTS)?window.UFC_PICKS_EVENTS:[];
    const selected=text(document.getElementById('picksEventSelect')?.value);
    return events.find(event=>text(event?.id)===selected)
      || events.find(event=>event?.status==='live')
      || events.find(event=>event?.status==='upcoming')
      || events[0]
      || null;
  }

  function localPicks(event){
    if(!event?.id)return{};
    try{return JSON.parse(localStorage.getItem(`ufc-picks:${event.id}:local-picks`)||'{}')||{};}
    catch(_error){return{};}
  }

  function warRoomAvailable(){
    const button=document.querySelector('[data-destination="war-room"]');
    return Boolean(button&&!button.disabled&&button.getAttribute('aria-disabled')!=='true');
  }

  function renderPicksBridge(){
    const picks=document.getElementById('picks');
    if(!picks)return false;
    const event=currentPicksEvent();
    const fights=Array.isArray(event?.fights)?event.fights:[];
    const saved=localPicks(event);
    const complete=Boolean(fights.length&&fights.every(fight=>text(saved[fight.id])));
    let bridge=document.getElementById('picksWarRoomBridge');
    if(!complete||!warRoomAvailable()){
      bridge?.remove();
      return false;
    }
    if(!bridge){
      bridge=document.createElement('section');
      bridge.id='picksWarRoomBridge';
      bridge.className='picks-war-room-bridge';
      const progress=document.querySelector('#picks .picks-progress-card');
      if(progress)progress.after(bridge);else document.getElementById('picksFightList')?.before(bridge);
    }
    const main=fights.find(fight=>text(fight?.cardSection).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()==='main event')||fights[fights.length-1];
    const pick=text(saved[main?.id]);
    bridge.innerHTML=`<div><span>PICKS COMPLETE</span><strong>Defend your main-event pick.</strong><small>${pick?`You picked ${esc(pick)}. `:''}Your card is saved—take the conversation to the War Room.</small></div><button type="button" data-connectivity-war-room>JOIN WAR ROOM →</button>`;
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
    const actions=document.querySelector('[data-octagon-board] .octagon-board-head-actions');
    if(!actions)return false;
    let button=actions.querySelector('[data-connectivity-war-intelligence]');
    if(button)return true;
    button=document.createElement('button');
    button.type='button';
    button.className='octagon-intelligence-button';
    button.dataset.connectivityWarIntelligence='true';
    button.textContent='TAKE TO INTELLIGENCE';
    const refresh=actions.querySelector('[data-octagon-refresh]');
    if(refresh)refresh.before(button);else actions.appendChild(button);
    return true;
  }

  function renderAll(){
    enhanceFighterProfile();
    enhanceWarRoom();
    renderPicksBridge();
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
    const picks=document.getElementById('picks');
    if(picks){
      picksObserver?.disconnect();
      picksObserver=new MutationObserver(scheduleRender);
      picksObserver.observe(picks,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden','value']});
    }
    const warRoom=document.getElementById('octagon');
    if(warRoom){
      warRoomObserver?.disconnect();
      warRoomObserver=new MutationObserver(scheduleRender);
      warRoomObserver.observe(warRoom,{childList:true,subtree:true});
    }
  }

  function bindEvents(){
    document.addEventListener('click',event=>{
      const profileButton=event.target.closest?.('[data-profile-connectivity]');
      if(profileButton){
        event.preventDefault();
        event.stopPropagation();
        const name=text(profileButton.dataset.fighter);
        closeFighterDrawer();
        if(profileButton.dataset.profileConnectivity==='compare')prepareComparison(name);
        else{
          const rank=fighterRank(name);
          const prompt=`Why is ${name} ranked ${rank?`#${rank}`:'where they are'} in this UFC-only GOAT model? Break down Championship, Opponent Quality, Prime Dominance, Longevity, and Loss Context. Explain the key judgment calls, why the fighter ranks here, and why the fighter is not ranked higher.`;
          openIntelligencePrompt({source:'FROM FIGHTER PROFILE',title:`Why ${name} ranks here`,prompt,copy:true});
        }
        return;
      }

      if(event.target.closest?.('[data-connectivity-war-room]')){
        activate('war-room');
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
          toast(copied?'Question copied.':'Could not copy automatically.');
        });
      }
    },true);

    document.getElementById('picksEventSelect')?.addEventListener('change',()=>window.setTimeout(scheduleRender,0));
    window.addEventListener('storage',scheduleRender);
    window.addEventListener('octagon-hq:view-change',scheduleRender);
    window.addEventListener('ufc-production-ranking-ready',scheduleRender);
    window.addEventListener('ufc-scoring-pipeline-ready',scheduleRender);
    window.addEventListener('ufc-play-profile-ready',scheduleRender);
    window.addEventListener('ufc-app-profile-updated',scheduleRender);
  }

  function start(){
    installStyles();
    bindObservers();
    bindEvents();
    renderAll();
    [150,600,1600].forEach(delay=>window.setTimeout(()=>{bindObservers();renderAll();},delay));
  }

  window.UFC_PRODUCT_CONNECTIVITY={
    version:VERSION,
    render:renderAll,
    prepareComparison,
    openIntelligencePrompt,
    renderPicksBridge,
    enhanceWarRoom,
    enhanceFighterProfile
  };
  document.documentElement.setAttribute('data-product-connectivity',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
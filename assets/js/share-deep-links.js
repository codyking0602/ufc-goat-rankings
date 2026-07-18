(function(){
  'use strict';

  const VERSION='share-deep-links-20260718a-phase-2e';
  const PUBLIC_ROOT='https://codyking0602.github.io/ufc-goat-rankings/';
  const ROUTE_TYPES=new Set(['fighter','compare','find-leader','picks-event','war-room']);
  const state={routing:false,routedKey:'',fighterPatched:false,warObserver:null,toastTimer:0};

  const text=value=>String(value??'').trim();
  const slugify=value=>text(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const compact=(value,max=160)=>{const clean=text(value).replace(/\s+/g,' ');return clean.length>max?`${clean.slice(0,max-1).trim()}…`:clean;};

  function displayOverrides(){
    try{return typeof DISPLAY_OVERRIDES!=='undefined'&&DISPLAY_OVERRIDES?DISPLAY_OVERRIDES:(window.DISPLAY_OVERRIDES||{});}
    catch(_error){return window.DISPLAY_OVERRIDES||{};}
  }

  function rankingRows(){
    const data=window.RANKING_DATA||{};
    const profiles=Array.isArray(data.fighters)?data.fighters:[];
    const profileMap=new Map(profiles.map(profile=>[profile.fighter,profile]));
    return [...(data.men||[]),...(data.women||[])].map(row=>({...profileMap.get(row.fighter),...row}));
  }

  function fighterFor(value){
    const wanted=slugify(value);
    if(!wanted)return null;
    const rows=rankingRows();
    const row=rows.find(item=>slugify(item.fighter)===wanted);
    if(!row)return null;
    const override=displayOverrides()[row.fighter]||{};
    const direct=Number(row.overallOvr??row.ovr??override.overallOvr??override.ovr);
    const max=Math.max(...rows.map(item=>Number(item.totalScore)||0),1);
    const ovr=Number.isFinite(direct)?direct:Math.max(60,Math.min(99,Math.round(75+((Number(row.totalScore)||0)/max)*24)));
    return{
      fighter:row.fighter,
      displayName:override.profileDisplayName||override.displayName||row.fighter,
      rank:Number(row.rank)||null,
      ovr,
      division:override.divisionLabel||row.primaryDivision||row.division||'',
      board:(window.RANKING_DATA?.women||[]).some(item=>item.fighter===row.fighter)?'women':'men'
    };
  }

  function encode(value){
    try{
      const bytes=new TextEncoder().encode(JSON.stringify(value));
      let binary='';
      bytes.forEach(byte=>{binary+=String.fromCharCode(byte);});
      return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
    }catch(_error){return'';}
  }

  function decode(value){
    try{
      const normalized=text(value).replace(/-/g,'+').replace(/_/g,'/');
      const padded=normalized+'='.repeat((4-(normalized.length%4))%4);
      const binary=atob(padded);
      const bytes=Uint8Array.from(binary,char=>char.charCodeAt(0));
      return JSON.parse(new TextDecoder().decode(bytes));
    }catch(_error){return null;}
  }

  function shareUrl(type,params={},hash='home'){
    const url=new URL('share.html',PUBLIC_ROOT);
    url.searchParams.set('share',type);
    Object.entries(params).forEach(([key,value])=>{
      if(value!==null&&value!==undefined&&text(value)!=='')url.searchParams.set(key,String(value));
    });
    url.hash=hash.startsWith('#')?hash:`#${hash}`;
    return url.toString();
  }

  function installStyles(){
    if(document.getElementById('phase2eShareStyles'))return;
    const style=document.createElement('style');
    style.id='phase2eShareStyles';
    style.textContent=`
      .phase2e-share-button{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:34px;padding:0 11px;border:1px solid rgba(249,115,22,.58);border-radius:999px;background:rgba(249,115,22,.1);color:#ffedd5;cursor:pointer;font:900 9px/1 system-ui;letter-spacing:.08em;text-transform:uppercase}.phase2e-share-button:hover,.phase2e-share-button:focus-visible{border-color:#f97316;background:rgba(249,115,22,.18);outline:none}.profile-topline .phase2e-share-button{margin-left:auto}.intelligence-matchup-actions .phase2e-share-button{min-height:42px;border-radius:12px;padding:0 15px}.octagon-message.deep-linked{border-color:#f97316!important;box-shadow:0 0 0 3px rgba(249,115,22,.16),0 16px 36px rgba(0,0,0,.3)}.octagon-message-actions [data-phase2e-war-share]{margin-left:0}.phase2e-share-toast{position:fixed;left:50%;bottom:max(18px,calc(10px + env(safe-area-inset-bottom)));z-index:14000;max-width:min(360px,calc(100vw - 28px));transform:translate(-50%,14px);padding:10px 13px;border:1px solid rgba(249,115,22,.55);border-radius:999px;background:rgba(8,14,24,.96);color:#fff;opacity:0;pointer-events:none;box-shadow:0 18px 45px rgba(0,0,0,.45);font:850 11px/1.25 system-ui;text-align:center;transition:opacity .16s ease,transform .16s ease}.phase2e-share-toast.show{opacity:1;transform:translate(-50%,0)}
      @media(max-width:620px){.profile-topline{align-items:center;flex-wrap:wrap}.profile-topline .phase2e-share-button{margin-left:0}.intelligence-matchup-actions .phase2e-share-button{width:100%}}
    `;
    document.head.appendChild(style);
  }

  function toast(message){
    let node=document.getElementById('phase2eShareToast');
    if(!node){node=document.createElement('div');node.id='phase2eShareToast';node.className='phase2e-share-toast';node.setAttribute('role','status');node.setAttribute('aria-live','polite');document.body.appendChild(node);}
    window.clearTimeout(state.toastTimer);
    node.textContent=message;
    node.classList.add('show');
    state.toastTimer=window.setTimeout(()=>node.classList.remove('show'),1900);
  }

  async function copyText(value){
    try{
      if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(value);return true;}
    }catch(_error){}
    try{
      const area=document.createElement('textarea');
      area.value=value;area.setAttribute('readonly','');area.style.position='fixed';area.style.opacity='0';area.style.pointerEvents='none';
      document.body.appendChild(area);area.select();const copied=document.execCommand('copy');area.remove();return copied;
    }catch(_error){return false;}
  }

  async function share(payload){
    const title=compact(payload?.title,100)||'Octagon HQ';
    const description=compact(payload?.text,220)||'UFC rankings, games, picks, and conversation.';
    const url=text(payload?.url)||PUBLIC_ROOT;
    try{
      if(typeof navigator.share==='function'){
        await navigator.share({title,text:description,url});
        return true;
      }
    }catch(error){if(error?.name==='AbortError')return false;}
    const copied=await copyText(`${description}\n\n${url}`);
    toast(copied?'Link copied':'Could not copy the link');
    return copied;
  }

  function shareFighter(name){
    const fighter=fighterFor(name);
    if(!fighter){toast('Fighter profile is not ready');return Promise.resolve(false);}
    const rank=fighter.rank?`#${fighter.rank}`:'UFC all-time';
    return share({
      title:`${fighter.displayName} UFC GOAT Profile`,
      text:`${fighter.displayName} is ${rank} with ${fighter.ovr} OVR in the Octagon HQ UFC-only GOAT model.`,
      url:shareUrl('fighter',{fighter:slugify(fighter.fighter)},`rankings/${fighter.board}`)
    });
  }

  function shareComparison(first,second){
    const a=fighterFor(first),b=fighterFor(second);
    if(!a||!b||a.fighter===b.fighter){toast('Choose two different fighters');return Promise.resolve(false);}
    return share({
      title:`${a.displayName} vs. ${b.displayName}`,
      text:`Compare ${a.displayName} and ${b.displayName} in the Octagon HQ UFC-only GOAT model.`,
      url:shareUrl('compare',{a:slugify(a.fighter),b:slugify(b.fighter)},'intelligence')
    });
  }

  function shareFindLeader(payload){
    const packed=encode(payload);
    if(!packed){toast('Result link could not be created');return Promise.resolve(false);}
    const score=Number(payload?.result?.score)||0;
    const total=10;
    const question=payload?.setup?.question||'Find the Leader';
    return share({
      title:`Find the Leader — ${score}/${total}`,
      text:`I scored ${score}/${total} on “${compact(question,90)}.” Open my exact result and try the board.`,
      url:shareUrl('find-leader',{result:packed},'play')
    });
  }

  function sharePicksEvent(payload={}){
    const room=text(payload.room).toUpperCase();
    const event=text(payload.event);
    const params={room,event,archive:'1',picksView:'event'};
    return share({
      title:payload.title||'UFC Picks Event Recap',
      text:payload.text||'Open the completed UFC Picks event recap and final room standings.',
      url:shareUrl('picks-event',params,'picks')
    });
  }

  function shareWarRoom(payload={}){
    const body=compact(payload.body,150);
    const author=text(payload.author)||'The War Room';
    return share({
      title:`${author} in The War Room`,
      text:body?`“${body}” — open the discussion in Octagon HQ.`:'Open this War Room discussion in Octagon HQ.',
      url:shareUrl('war-room',{message:payload.messageId,week:payload.weekStart},'war-room')
    });
  }

  function upsertMeta(selector,attribute,value){
    let node=document.head.querySelector(selector);
    if(!node){node=document.createElement('meta');const match=selector.match(/meta\[([^=]+)="([^"]+)"\]/);if(match)node.setAttribute(match[1],match[2]);document.head.appendChild(node);}
    node.setAttribute(attribute,value);
  }

  function setMeta(title,description,url=window.location.href){
    const cleanTitle=compact(title,100)||'Octagon HQ';
    const cleanDescription=compact(description,220)||'UFC rankings, games, picks, and conversation.';
    document.title=cleanTitle;
    upsertMeta('meta[name="description"]','content',cleanDescription);
    upsertMeta('meta[property="og:title"]','content',cleanTitle);
    upsertMeta('meta[property="og:description"]','content',cleanDescription);
    upsertMeta('meta[property="og:url"]','content',url);
    upsertMeta('meta[name="twitter:title"]','content',cleanTitle);
    upsertMeta('meta[name="twitter:description"]','content',cleanDescription);
  }

  function waitFor(check,{timeout=12000,interval=80}={}){
    return new Promise((resolve,reject)=>{
      const started=Date.now();
      const tick=()=>{
        let value=null;
        try{value=check();}catch(_error){}
        if(value){resolve(value);return;}
        if(Date.now()-started>=timeout){reject(new Error('Timed out waiting for shared destination'));return;}
        window.setTimeout(tick,interval);
      };
      tick();
    });
  }

  function activate(destination){
    return Boolean(window.UFC_APP_SHELL?.activateDestination?.(destination)||window.UFC_PRODUCT_ARCHITECTURE?.activateDestination?.(destination));
  }

  function installFighterButton(name){
    const topline=document.querySelector('#fighterDetail .profile-topline');
    if(!topline)return;
    let button=topline.querySelector('[data-phase2e-share-fighter]');
    if(!button){button=document.createElement('button');button.type='button';button.className='phase2e-share-button';button.dataset.phase2eShareFighter='';button.textContent='Share Profile';topline.appendChild(button);}
    button.dataset.phase2eShareFighter=name;
  }

  function patchFighterProfiles(){
    if(state.fighterPatched||typeof window.openFighter!=='function')return false;
    const original=window.openFighter;
    const patched=function(name){const output=original.apply(this,arguments);window.setTimeout(()=>installFighterButton(name),0);return output;};
    patched.__phase2e=true;
    patched.__original=original;
    window.openFighter=patched;
    state.fighterPatched=true;
    return true;
  }

  function installComparisonButton(){
    const actions=document.querySelector('.intelligence-matchup-actions');
    if(!actions||actions.querySelector('[data-phase2e-share-comparison]'))return;
    const button=document.createElement('button');
    button.type='button';button.className='phase2e-share-button';button.dataset.phase2eShareComparison='true';button.textContent='Share Matchup';
    actions.insertBefore(button,actions.firstChild);
  }

  function decorateWarRoom(root=document){
    const cards=[];
    if(root.matches?.('[data-octagon-message-id]'))cards.push(root);
    root.querySelectorAll?.('[data-octagon-message-id]').forEach(card=>cards.push(card));
    cards.forEach(card=>{
      if(card.dataset.phase2eShareReady==='true')return;
      const actions=card.querySelector('.octagon-message-actions');
      if(!actions)return;
      const button=document.createElement('button');
      button.type='button';button.dataset.phase2eWarShare='true';button.textContent='Share';
      const deleteButton=actions.querySelector('[data-octagon-delete]');
      if(deleteButton)actions.insertBefore(button,deleteButton);else actions.appendChild(button);
      card.dataset.phase2eShareReady='true';
    });
  }

  function installWarObserver(){
    const root=document.getElementById('octagon');
    if(!root||state.warObserver)return;
    state.warObserver=new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===1)decorateWarRoom(node);}))); 
    state.warObserver.observe(root,{childList:true,subtree:true});
    decorateWarRoom(root);
  }

  function recapPayload(){
    const url=new URL(window.location.href);
    const room=text(url.searchParams.get('room')||document.querySelector('#picksRoomBanner .picks-code')?.textContent).toUpperCase();
    const event=text(url.searchParams.get('event')||document.getElementById('picksEventSelect')?.value);
    const title=text(document.querySelector('#picksEventRecap h3')?.textContent)||'UFC Picks Event Recap';
    const champion=text(document.querySelector('.picks-recap-champion strong')?.textContent);
    const score=text(document.querySelector('.picks-recap-champion b')?.textContent);
    const accuracy=text(document.querySelector('.picks-recap-stats div:nth-child(2) strong')?.textContent);
    return{room,event,title,text:champion?`${champion} won ${title.replace(/\s+Room Recap$/i,'')} with ${score||'the top score'}. Group accuracy: ${accuracy||'—'}.`:'Open the completed UFC Picks event recap and final standings.'};
  }

  function bindClicks(){
    document.addEventListener('click',event=>{
      const fighter=event.target.closest?.('[data-phase2e-share-fighter]');
      if(fighter){event.preventDefault();event.stopPropagation();shareFighter(fighter.dataset.phase2eShareFighter);return;}
      if(event.target.closest?.('[data-phase2e-share-comparison]')){event.preventDefault();const a=document.getElementById('fighterA')?.value,b=document.getElementById('fighterB')?.value;shareComparison(a,b);return;}
      const war=event.target.closest?.('[data-phase2e-war-share]');
      if(war){event.preventDefault();event.stopPropagation();const card=war.closest('[data-octagon-message-id]');const id=card?.dataset.octagonMessageId;const snapshot=window.UFC_OCTAGON_BOARD?.snapshot;const message=snapshot?.messages?.find(item=>String(item.id)===String(id));shareWarRoom({messageId:id,weekStart:snapshot?.board?.week_start,author:message?.author?.display_name,body:message?.body});}
    });
    document.addEventListener('click',event=>{
      if(!event.target.closest?.('#picksShareRecap'))return;
      event.preventDefault();event.stopImmediatePropagation();sharePicksEvent(recapPayload());
    },true);
  }

  async function routeFighter(params){
    const fighter=fighterFor(params.get('fighter'));
    if(!fighter)throw new Error('Shared fighter was not found');
    setMeta(`${fighter.displayName} UFC GOAT Profile | Octagon HQ`,`${fighter.displayName} is #${fighter.rank||'—'} with ${fighter.ovr} OVR in the UFC-only GOAT model.`);
    activate('rankings');
    patchFighterProfiles();
    const open=await waitFor(()=>typeof window.openFighter==='function'&&window.openFighter);
    open(fighter.fighter);
    installFighterButton(fighter.fighter);
  }

  async function routeComparison(params){
    const a=fighterFor(params.get('a')),b=fighterFor(params.get('b'));
    if(!a||!b)throw new Error('Shared matchup was not found');
    setMeta(`${a.displayName} vs. ${b.displayName} | Octagon HQ`,`Prepared UFC-only GOAT comparison between ${a.displayName} and ${b.displayName}.`);
    activate('intelligence');
    installComparisonButton();
    const controls=await waitFor(()=>{const first=document.getElementById('fighterA'),second=document.getElementById('fighterB');return first&&second&&first.options.length&&second.options.length?{first,second}:null;});
    controls.first.value=a.fighter;controls.second.value=b.fighter;
    controls.first.dispatchEvent(new Event('change',{bubbles:true}));controls.second.dispatchEvent(new Event('change',{bubbles:true}));
    const details=document.querySelector('details.intelligence-matchup');
    if(details)details.open=true;
    details?.scrollIntoView({behavior:'smooth',block:'start'});
  }

  async function routeFindLeader(params){
    const payload=decode(params.get('result'));
    if(!payload?.setup||!payload?.result)throw new Error('Shared Find the Leader result is invalid');
    const score=Number(payload.result.score)||0;
    setMeta(`Find the Leader — ${score}/10 | Octagon HQ`,`Open this exact Find the Leader result and try the same UFC stat board.`);
    activate('play');
    const hub=await waitFor(()=>window.UFC_PLAY_HUB?.openGame&&window.UFC_PLAY_HUB);
    await hub.openGame('find-leader',{daily:false});
    const game=await waitFor(()=>window.UFC_FIND_LEADER?.openSharedResult&&window.UFC_FIND_LEADER);
    if(!game.openSharedResult(payload))throw new Error('Shared Find the Leader result could not open');
  }

  async function routePicks(params){
    const eventId=text(params.get('event'));
    setMeta('UFC Picks Event Recap | Octagon HQ','Completed event results, room standings, and the final UFC Picks recap.');
    activate('picks');
    if(eventId){
      try{
        const select=await waitFor(()=>{const node=document.getElementById('picksEventSelect');return node&&[...node.options].some(option=>option.value===eventId)?node:null;},{timeout:7000});
        if(select.value!==eventId){select.value=eventId;select.dispatchEvent(new Event('change',{bubbles:true}));}
      }catch(_error){}
    }
    try{
      const recap=await waitFor(()=>{const node=document.getElementById('picksEventRecap');return node&&!node.hidden&&node.innerHTML?node:null;},{timeout:12000,interval:150});
      recap.scrollIntoView({behavior:'smooth',block:'start'});
    }catch(_error){document.getElementById('picksEventHero')?.scrollIntoView({behavior:'smooth',block:'start'});}
  }

  async function routeWarRoom(params){
    const messageId=text(params.get('message'));
    const week=text(params.get('week'));
    setMeta('War Room Discussion | Octagon HQ','Open the linked UFC discussion inside the private Octagon HQ War Room.');
    try{
      await waitFor(()=>{const button=document.querySelector('[data-destination="war-room"]');return button&&!button.disabled&&button.getAttribute('aria-disabled')!=='true'?button:null;},{timeout:9000,interval:120});
    }catch(_error){}
    activate('war-room');
    const board=await waitFor(()=>window.UFC_OCTAGON_BOARD?.load&&window.UFC_OCTAGON_BOARD,{timeout:12000});
    await board.load(week||null);
    decorateWarRoom(document.getElementById('octagon'));
    if(!messageId)return;
    try{
      const card=await waitFor(()=>[...document.querySelectorAll('[data-octagon-message-id]')].find(node=>String(node.dataset.octagonMessageId)===messageId),{timeout:7000});
      document.querySelectorAll('.octagon-message.deep-linked').forEach(node=>node.classList.remove('deep-linked'));
      card.classList.add('deep-linked');card.scrollIntoView({behavior:'smooth',block:'center'});
      window.setTimeout(()=>card.classList.remove('deep-linked'),7000);
    }catch(_error){toast('Discussion opened; the linked message is no longer available');}
  }

  async function routeCurrent(){
    const params=new URL(window.location.href).searchParams;
    const type=text(params.get('share'));
    if(!ROUTE_TYPES.has(type))return false;
    const key=`${type}|${params.toString()}`;
    if(state.routing||state.routedKey===key)return false;
    state.routing=true;
    try{
      if(type==='fighter')await routeFighter(params);
      else if(type==='compare')await routeComparison(params);
      else if(type==='find-leader')await routeFindLeader(params);
      else if(type==='picks-event')await routePicks(params);
      else if(type==='war-room')await routeWarRoom(params);
      state.routedKey=key;
      document.documentElement.setAttribute('data-share-route',type);
      return true;
    }catch(error){console.error(error);toast('This shared link could not fully open');return false;}
    finally{state.routing=false;}
  }

  function start(){
    installStyles();patchFighterProfiles();installComparisonButton();installWarObserver();bindClicks();
    [40,180,700].forEach(delay=>window.setTimeout(()=>{patchFighterProfiles();installComparisonButton();installWarObserver();},delay));
    window.setTimeout(routeCurrent,80);
    window.addEventListener('popstate',routeCurrent);
  }

  window.UFC_SHARE_LINKS={version:VERSION,share,shareUrl,shareFighter,shareComparison,shareFindLeader,sharePicksEvent,shareWarRoom,routeCurrent,encode,decode,fighterFor};
  document.documentElement.setAttribute('data-share-deep-links',VERSION);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

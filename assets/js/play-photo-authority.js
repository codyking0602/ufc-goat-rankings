(function(){
  'use strict';

  const VERSION='play-photo-authority-20260717b';
  const PHOTO_BUILD='20260717b';
  const attempts=new WeakMap();
  const repairedFallbacks=new WeakSet();

  const text=value=>String(value??'').trim();
  const unique=values=>[...new Set((values||[]).map(text).filter(Boolean))];
  const normal=value=>text(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/[’‘`]/g,"'")
    .replace(/[^a-zA-Z0-9]+/g,' ')
    .trim()
    .toLowerCase();
  const slug=value=>normal(value).replace(/\s+/g,'-');
  const initials=name=>text(name).split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase()||'UFC';

  const SLUG_OVERRIDES={
    'Michelle Waterson-Gomez':['michelle-waterson-gomez','michelle-waterson'],
    'Houston Alexander':['houston-alexander','alexander-houston'],
    'Alexander Gustafsson':['alexander-gustafsson','alexander-gustafson'],
    'Edson Barboza':['edson-barboza','edson-barbosa'],
    'Tai Tuivasa':['tai-tuivasa','tui-tuivasa','tai-tuiavasa']
  };

  function cleanName(value){
    return text(value)
      .replace(/\s+(?:profile photo|thumbnail|headshot|fighter photo)$/i,'')
      .replace(/^photo of\s+/i,'')
      .trim();
  }

  function versionUrl(value){
    const source=text(value);
    if(!source)return'';
    const [beforeHash,hash='']=source.split('#',2);
    const [path,query='']=beforeHash.split('?',2);
    const params=new URLSearchParams(query);
    params.set('photoBuild',PHOTO_BUILD);
    const next=params.toString();
    return `${path}${next?`?${next}`:''}${hash?`#${hash}`:''}`;
  }

  function slugsFor(name){
    return unique([...(SLUG_OVERRIDES[text(name)]||[]),slug(name)]);
  }

  function recordFor(value){
    const name=typeof value==='string'?value:value?.name;
    const api=window.UFC_PLAY_DATA;
    const resolved=api?.resolve?.(name||value?.id);
    return resolved||value||null;
  }

  function explicitFor(name,record={}){
    const override=window.DISPLAY_OVERRIDES?.[name]||{};
    return {
      thumbUrl:text(record?.thumbUrl||override.thumbUrl),
      profileUrl:text(record?.profileUrl||record?.photoUrl||override.photoUrl)
    };
  }

  function candidatesFor(value,options={}){
    const record=recordFor(value)||{};
    const name=cleanName(options.name||record.name||value);
    if(!name)return{thumbs:[],profiles:[],all:[]};
    const explicit=explicitFor(name,record);
    const slugs=slugsFor(name);
    const thumbs=unique([
      options.thumbUrl,
      explicit.thumbUrl,
      ...slugs.map(item=>`assets/fighters/${item}-thumb.webp`)
    ]).map(versionUrl);
    const profiles=unique([
      options.profileUrl,
      explicit.profileUrl,
      ...slugs.map(item=>`assets/fighters/${item}.webp`)
    ]).map(versionUrl);
    return {thumbs,profiles,all:unique([...thumbs,...profiles])};
  }

  function hydrateFighter(value){
    if(!value||typeof value!=='object')return value;
    const name=cleanName(value.name||value.fighter||'');
    if(!name)return value;
    const candidates=candidatesFor(value,{name,thumbUrl:value.thumbUrl,profileUrl:value.profileUrl||value.photoUrl});
    value.name=value.name||name;
    value.thumbUrl=candidates.thumbs[0]||'';
    value.profileUrl=candidates.profiles[0]||'';
    if(Object.prototype.hasOwnProperty.call(value,'photoUrl'))value.photoUrl=value.profileUrl;
    value.photoCandidates=candidates.all;
    value.photoBuild=PHOTO_BUILD;
    return value;
  }

  function hydrateList(rows){
    if(!Array.isArray(rows))return rows;
    rows.forEach(hydrateFighter);
    return rows;
  }

  function hydrateRoster(){
    const api=window.UFC_PLAY_DATA;
    if(!api)return false;
    hydrateList(api.allFighters);
    hydrateList(api.modelRanked);
    hydrateList(api.playOnly);
    Object.values(api.byId||{}).forEach(hydrateFighter);
    Object.values(api.byName||{}).forEach(hydrateFighter);
    document.documentElement.setAttribute('data-play-photo-authority-roster',`${VERSION}-${api.allFighters?.length||0}`);
    return true;
  }

  function patchPhotoApi(){
    const api=window.UFC_FIGHTER_PHOTOS;
    if(!api||api.authorityVersion===VERSION)return false;
    const originalApply=typeof api.apply==='function'?api.apply.bind(api):value=>value;
    api.candidatesFor=(name,explicit={})=>candidatesFor(name,explicit);
    api.apply=value=>hydrateFighter(originalApply(value));
    api.version=VERSION;
    api.authorityVersion=VERSION;
    api.photoBuild=PHOTO_BUILD;
    api.hydrate=hydrateFighter;
    api.urlFor=(value,kind='thumb')=>{
      const candidates=candidatesFor(value);
      return kind==='profile'?(candidates.profiles[0]||''):(candidates.thumbs[0]||'');
    };
    return true;
  }

  function patchFindLeader(){
    const game=window.UFC_FIND_LEADER;
    if(!game?.open||game.photoAuthorityVersion===VERSION)return false;
    const originalOpen=game.open.bind(game);
    game.open=options=>{
      if(options?.setup?.candidates)hydrateList(options.setup.candidates);
      return originalOpen(options);
    };
    if(typeof game.dailySetup==='function'){
      const originalDailySetup=game.dailySetup.bind(game);
      game.dailySetup=context=>{
        const setup=originalDailySetup(context);
        if(setup?.candidates)hydrateList(setup.candidates);
        return setup;
      };
    }
    game.photoAuthorityVersion=VERSION;
    return true;
  }

  function managedImage(image){
    if(!(image instanceof HTMLImageElement))return false;
    const source=text(image.getAttribute('src'));
    return image.dataset.fighterPhoto==='true'||/(?:^|\/)assets\/fighters\/[^?#]+\.webp(?:[?#].*)?$/i.test(source);
  }

  function nameForImage(image){
    return cleanName(image.dataset.fighterName||image.getAttribute('alt')||'');
  }

  function preferredChain(image,name){
    const current=text(image.getAttribute('src'));
    const candidates=candidatesFor(name);
    const thumbFirst=/-thumb\.webp(?:[?#].*)?$/i.test(current)||/thumb/i.test(image.className);
    return unique([
      versionUrl(current),
      ...(thumbFirst?candidates.thumbs:candidates.profiles),
      ...(thumbFirst?candidates.profiles:candidates.thumbs)
    ]);
  }

  function comparable(value){
    try{return new URL(value,document.baseURI).href;}
    catch(_error){return text(value);}
  }

  function fallback(image,name){
    if(!image?.isConnected)return;
    const node=document.createElement('span');
    node.className='fighter-photo-fallback';
    node.dataset.photoAuthorityFinal='true';
    node.setAttribute('aria-label',name||'UFC fighter');
    node.textContent=initials(name);
    image.replaceWith(node);
  }

  function recover(image,event){
    if(!managedImage(image))return false;
    const name=nameForImage(image);
    if(!name)return false;
    event?.stopImmediatePropagation?.();
    let state=attempts.get(image);
    if(!state){
      const chain=preferredChain(image,name);
      const current=comparable(image.getAttribute('src'));
      const index=chain.findIndex(item=>comparable(item)===current);
      state={chain,index:index<0?-1:index};
      attempts.set(image,state);
    }
    state.index+=1;
    if(state.index<state.chain.length){
      image.dataset.fighterPhoto='true';
      image.dataset.fighterName=name;
      image.src=state.chain[state.index];
      return true;
    }
    fallback(image,name);
    return true;
  }

  function refreshImage(image){
    if(!(image instanceof HTMLImageElement))return;
    const name=nameForImage(image);
    if(!name)return;
    const current=text(image.getAttribute('src'));
    if(!current&&!image.closest('#play,.challenge-shell'))return;
    if(current&&!managedImage(image))return;
    const chain=preferredChain(image,name);
    const target=chain[0]||'';
    if(target&&comparable(target)!==comparable(current)){
      image.dataset.fighterPhoto='true';
      image.dataset.fighterName=name;
      attempts.delete(image);
      image.src=target;
    }
  }

  function repairFallback(node){
    if(!(node instanceof HTMLElement))return;
    if(node.dataset.photoAuthorityFinal==='true'||repairedFallbacks.has(node))return;
    if(!node.closest('#play,.challenge-shell'))return;
    const name=cleanName(node.getAttribute('aria-label')||'');
    if(!name)return;
    const candidates=candidatesFor(name);
    const src=candidates.thumbs[0]||candidates.profiles[0]||'';
    if(!src)return;
    repairedFallbacks.add(node);
    const image=document.createElement('img');
    image.alt=name;
    image.dataset.fighterPhoto='true';
    image.dataset.fighterName=name;
    image.src=src;
    node.replaceWith(image);
  }

  function refreshVisible(root=document){
    const scope=root?.querySelectorAll?root:document;
    scope.querySelectorAll('#play .fighter-photo-fallback,.challenge-shell .fighter-photo-fallback').forEach(repairFallback);
    scope.querySelectorAll('#play img,.challenge-shell img,img[data-fighter-photo="true"]').forEach(refreshImage);
  }

  function installStyles(){
    if(document.getElementById('play-photo-authority-css'))return;
    const style=document.createElement('style');
    style.id='play-photo-authority-css';
    style.textContent='.fighter-photo-fallback{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:inherit;font:inherit;font-weight:950;letter-spacing:.02em}';
    document.head.appendChild(style);
  }

  function sync(){
    patchPhotoApi();
    hydrateRoster();
    patchFindLeader();
    refreshVisible();
  }

  function scheduleSync(){
    [0,40,140,420,1000].forEach(delay=>setTimeout(sync,delay));
  }

  installStyles();
  window.addEventListener('error',event=>{
    recover(event.target,event);
  },true);
  ['ufc-play-data-ready','ufc-fighter-photos-ready','ufc-play-hub-ready','ufc-play-state-changed','ufc-scoring-pipeline-ready','ufc-production-ranking-ready'].forEach(type=>window.addEventListener(type,scheduleSync));
  document.addEventListener('click',()=>setTimeout(refreshVisible,0),true);
  document.addEventListener('pointerup',()=>setTimeout(refreshVisible,0),true);
  window.addEventListener('DOMContentLoaded',scheduleSync,{once:true});
  window.addEventListener('load',scheduleSync,{once:true});

  window.UFC_PLAY_PHOTO_AUTHORITY={
    version:VERSION,
    photoBuild:PHOTO_BUILD,
    candidatesFor,
    hydrateFighter,
    hydrateList,
    hydrateRoster,
    refreshVisible,
    sync
  };
  document.documentElement.setAttribute('data-play-photo-authority',VERSION);
  scheduleSync();
})();

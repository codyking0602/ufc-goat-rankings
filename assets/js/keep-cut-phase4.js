(function(){
  'use strict';

  const VERSION='keep-cut-20260717h-category-lineup';
  const STORAGE_KEY='ufc-goat-keep-cut-v1';
  const RECENT_KEY='ufc-goat-keep-cut-recent-v1';
  const MIGRATION_KEY='ufc-goat-keep-cut-phase4-migrated';
  const api=window.UFC_KEEP_CUT;
  if(!api||Number(api.phase)<3)return;
  if(api.version===VERSION)return;

  const GROUP_ORDER=['Serious','Debate','Entertainment','Chaos'];
  const PACK_ORDER=[
    'ufc-careers','all-careers','never-undisputed','former-champions','lightweight','welterweight','heavyweight',
    'hardest-at-peak','most-complete','best-finisher','biggest-what-if',
    'action-fighters','ufc-stars','cult-chaos'
  ];
  const LEGACY_PACK_ALIASES={
    'best-prime':'hardest-at-peak',
    'early-ufc':'ufc-careers'
  };
  const PACK_OVERRIDES={
    'hardest-at-peak':{
      name:'Hardest to Beat at Their Peak',
      prompt:'Keep four fighters at their hardest-to-beat UFC peak. Cut four.',
      description:'Peak dominance, control, durability, rounds won, and the ability to solve elite opponents.'
    },
    'ufc-stars':{
      name:'UFC Star Power',
      prompt:'Keep four UFC stars. Cut four.',
      description:'The full roster rated by UFC fame, drawing power, cultural reach, and lasting recognition.'
    }
  };

  const previousStart=api.startGame.bind(api);
  const previousOpen=api.open.bind(api);
  const previousBuildLineup=api.buildLineup.bind(api);
  const previousSimulate=typeof api.simulateLineups==='function'?api.simulateLineups.bind(api):null;

  function canonicalPackId(value){
    const id=String(value||'').trim();
    return LEGACY_PACK_ALIASES[id]||id||'ufc-careers';
  }

  function cleanPacks(){
    const byId=Object.fromEntries((api.packs||[]).map(pack=>[pack.id,pack]));
    const packs=PACK_ORDER.map(id=>{
      const source=byId[id];
      return source?{...source,...(PACK_OVERRIDES[id]||{})}:null;
    }).filter(Boolean);
    api.packs.splice(0,api.packs.length,...packs);
    return packs;
  }

  function migrateSavedState(){
    try{
      if(localStorage.getItem(MIGRATION_KEY)==='1')return;
      const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
      if(saved&&LEGACY_PACK_ALIASES[saved.packId]){
        saved.packId=canonicalPackId(saved.packId);
        localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));
      }
      const recent=JSON.parse(localStorage.getItem(RECENT_KEY)||'{}');
      if(recent&&typeof recent==='object'){
        Object.entries(LEGACY_PACK_ALIASES).forEach(([legacy,target])=>{
          const source=recent[legacy];
          if(!source)return;
          const existing=recent[target]&&typeof recent[target]==='object'?recent[target]:{lineups:[],shapes:[]};
          recent[target]={
            lineups:[...(source.lineups||[]),...(existing.lineups||[])].slice(0,4),
            shapes:[...(source.shapes||[]),...(existing.shapes||[])].slice(0,4)
          };
          delete recent[legacy];
        });
        localStorage.setItem(RECENT_KEY,JSON.stringify(recent));
      }
      localStorage.setItem(MIGRATION_KEY,'1');
    }catch(_error){}
  }

  function rebuildPackSelect(){
    const select=document.getElementById('keepCutPack');
    if(!select)return;
    const selected=canonicalPackId(api.state.packId||select.value);
    const fragment=document.createDocumentFragment();
    GROUP_ORDER.forEach(group=>{
      const packs=api.packs.filter(pack=>pack.group===group);
      if(!packs.length)return;
      const optgroup=document.createElement('optgroup');
      optgroup.label=group;
      packs.forEach(pack=>{
        const option=document.createElement('option');
        option.value=pack.id;
        option.textContent=pack.name;
        optgroup.appendChild(option);
      });
      fragment.appendChild(optgroup);
    });
    select.replaceChildren(fragment);
    select.value=api.packs.some(pack=>pack.id===selected)?selected:api.packs[0]?.id||'ufc-careers';
  }

  function currentPack(){
    const id=canonicalPackId(api.state.packId);
    return api.packs.find(pack=>pack.id===id)||api.packs[0]||null;
  }

  function syncVisibleCopy(){
    const pack=currentPack();
    if(!pack)return;
    if(api.state.packId!==pack.id)api.state.packId=pack.id;
    const select=document.getElementById('keepCutPack');
    if(select&&select.value!==pack.id)select.value=pack.id;
    const prompt=document.getElementById('keepCutPrompt');
    const description=document.getElementById('keepCutDescription');
    const progress=document.querySelector('#playKeepCutPanel .kc-progress span');
    if(prompt&&prompt.textContent!==pack.prompt)prompt.textContent=pack.prompt;
    if(description&&description.textContent!==pack.description)description.textContent=pack.description;
    const progressCopy=`${pack.group} · ${pack.name}`;
    if(progress&&progress.textContent!==progressCopy)progress.textContent=progressCopy;
  }

  function installCopySync(){
    const panel=document.getElementById('playKeepCutPanel');
    if(!panel||panel.dataset.phaseFourCopySync==='true')return;
    panel.dataset.phaseFourCopySync='true';
    const observer=new MutationObserver(syncVisibleCopy);
    observer.observe(panel,{childList:true,subtree:true});
    syncVisibleCopy();
  }

  function canonicalOptions(options={}){
    return {...options,packId:canonicalPackId(options.packId||api.state.packId)};
  }

  function startGame(options={}){
    return previousStart(canonicalOptions(options));
  }

  function open(options={}){
    return previousOpen(canonicalOptions(options));
  }

  function buildLineup(packId,options={}){
    return previousBuildLineup(canonicalPackId(packId),options);
  }

  function simulateLineups(iterations=1000,packId=null){
    return previousSimulate?previousSimulate(iterations,packId?canonicalPackId(packId):null):null;
  }

  cleanPacks();
  migrateSavedState();
  api.state.packId=canonicalPackId(api.state.packId);
  if(!api.packs.some(pack=>pack.id===api.state.packId))api.state.packId=api.packs[0]?.id||'ufc-careers';
  rebuildPackSelect();
  installCopySync();

  api.startGame=startGame;
  api.open=open;
  api.buildLineup=buildLineup;
  if(previousSimulate)api.simulateLineups=simulateLineups;
  api.resolvePackId=canonicalPackId;
  api.legacyPackAliases={...LEGACY_PACK_ALIASES};
  api.categoryLineup={
    version:VERSION,
    count:api.packs.length,
    groups:Object.fromEntries(GROUP_ORDER.map(group=>[group,api.packs.filter(pack=>pack.group===group).map(pack=>pack.id)])),
    removed:['best-prime','early-ufc'],
    merged:{'best-prime':'hardest-at-peak'}
  };
  api.phase=4;
  api.version=VERSION;
  api.refreshAudit?.();

  const hubApi=window.UFC_PLAY_HUB;
  if(hubApi&&!hubApi.__keepCutPhase4Patched){
    const previousHubOpen=hubApi.openGame;
    hubApi.openGame=function(mode,options){
      if(mode==='keep-cut')return api.open(canonicalOptions(options||{}));
      return previousHubOpen.call(hubApi,mode,options);
    };
    hubApi.__keepCutPhase4Patched=true;
  }

  window.addEventListener('ufc-keep-cut-ratings-ready',()=>api.refreshAudit?.());
  document.documentElement.setAttribute('data-keep-cut',VERSION);
  document.documentElement.setAttribute('data-keep-cut-phase','4');
  document.documentElement.setAttribute('data-keep-cut-category-count',String(api.packs.length));
  window.dispatchEvent(new CustomEvent('ufc-keep-cut-ready',{detail:{version:VERSION,phase:4,audit:api.audit,categories:api.categoryLineup}}));
})();

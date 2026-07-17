(function(){
  'use strict';

  const VERSION='keep-cut-20260717f-absolute-role-engine';
  const STORAGE_KEY='ufc-goat-keep-cut-v1';
  const MIGRATION_KEY='ufc-goat-keep-cut-phase3-migrated';
  const RECENT_KEY='ufc-goat-keep-cut-recent-v1';
  const RECENT_LINEUP_LIMIT=4;
  const GENERATION_ATTEMPTS=14;
  const PLAY_DATA=window.UFC_PLAY_DATA;
  const RATINGS=window.UFC_KEEP_CUT_CATEGORY_RATINGS;
  const api=window.UFC_KEEP_CUT;
  if(!PLAY_DATA||!RATINGS||!api)return;
  if(api.version===VERSION)return;

  const TIER_ORDER=['elite','great','good','average','below-average','bad'];
  const LINEUP_ROLES=[
    {id:'anchor',label:'Top anchor',weights:{elite:60,great:40},allowBad:false},
    {id:'strong-one',label:'Strong option',weights:{great:45,good:55},allowBad:false},
    {id:'strong-two',label:'Strong option',weights:{great:45,good:55},allowBad:false},
    {id:'middle-one',label:'Middle option',weights:{good:50,average:50},allowBad:false},
    {id:'middle-two',label:'Middle option',weights:{good:50,average:50},allowBad:false},
    {id:'trap-one',label:'Potential trap',weights:{average:55,'below-average':45},allowBad:false},
    {id:'trap-two',label:'Potential trap',weights:{average:55,'below-average':45},allowBad:false},
    {id:'wildcard',label:'Wildcard',weights:{elite:8,great:12,good:20,average:25,'below-average':25,bad:10},allowBad:true}
  ];

  const originalStart=api.startGame.bind(api);
  const originalOpen=api.open.bind(api);
  let lastGenerated=null;

  function packFor(id){return api.packs.find(pack=>pack.id===id)||api.packs[0];}
  function shuffled(values){
    const items=[...values];
    for(let index=items.length-1;index>0;index-=1){
      const swap=Math.floor(Math.random()*(index+1));
      [items[index],items[swap]]=[items[swap],items[index]];
    }
    return items;
  }
  function weightedKey(weights){
    const rows=Object.entries(weights).filter(([,weight])=>Number(weight)>0);
    const total=rows.reduce((sum,[,weight])=>sum+Number(weight),0);
    if(!rows.length||total<=0)return null;
    let roll=Math.random()*total;
    for(const [key,weight] of rows){roll-=Number(weight);if(roll<0)return key;}
    return rows[rows.length-1][0];
  }
  function ratingEntry(fighter){return RATINGS.resolve(fighter?.id)||RATINGS.resolve(fighter?.name);}
  function tierForPack(pack,fighter){
    const entry=ratingEntry(fighter);
    if(!entry)return null;
    return pack.division?entry.divisionTiers?.[pack.division]:entry.tiers?.[pack.categoryKey];
  }
  function absoluteTierPools(pack,pool,used=new Set()){
    const pools=Object.fromEntries(TIER_ORDER.map(tier=>[tier,[]]));
    pool.forEach(fighter=>{
      const tier=tierForPack(pack,fighter);
      if(pools[tier]&&!used.has(fighter.id))pools[tier].push(fighter);
    });
    return pools;
  }

  function readRecent(){
    try{
      const parsed=JSON.parse(localStorage.getItem(RECENT_KEY)||'{}');
      return parsed&&typeof parsed==='object'?parsed:{};
    }catch(_error){return{};}
  }
  function recentForPack(packId){
    const record=readRecent()[packId];
    return record&&typeof record==='object'?record:{lineups:[],shapes:[]};
  }
  function recentCounts(packId){
    const counts={};
    recentForPack(packId).lineups?.forEach((lineup,index)=>{
      const factor=Math.max(1,RECENT_LINEUP_LIMIT-index);
      lineup.forEach(id=>counts[id]=(counts[id]||0)+factor);
    });
    return counts;
  }
  function rememberLineup(packId,ids,shape){
    try{
      const all=readRecent();
      const current=recentForPack(packId);
      all[packId]={
        lineups:[ids,...(current.lineups||[])].slice(0,RECENT_LINEUP_LIMIT),
        shapes:[shape,...(current.shapes||[])].slice(0,RECENT_LINEUP_LIMIT)
      };
      localStorage.setItem(RECENT_KEY,JSON.stringify(all));
    }catch(_error){}
  }
  function candidateWeight(fighter,counts){
    const pressure=Number(counts?.[fighter.id]||0);
    if(pressure<=0)return 1;
    if(pressure<=2)return .24;
    if(pressure<=5)return .08;
    return .025;
  }
  function chooseFighter(candidates,counts){
    if(!candidates.length)return null;
    const weighted=candidates.map(fighter=>({fighter,weight:candidateWeight(fighter,counts)}));
    const total=weighted.reduce((sum,row)=>sum+row.weight,0);
    let roll=Math.random()*total;
    for(const row of weighted){roll-=row.weight;if(roll<0)return row.fighter;}
    return weighted[weighted.length-1].fighter;
  }
  function nearestAvailableTier(role,pools,badAlreadyUsed,targetTier=null){
    const preferred=targetTier?[targetTier]:Object.keys(role.weights);
    const indexes=preferred.map(tier=>TIER_ORDER.indexOf(tier)).filter(index=>index>=0);
    return TIER_ORDER
      .filter(tier=>pools[tier]?.length&&(!badAlreadyUsed||tier!=='bad')&&(role.allowBad||tier!=='bad'))
      .map(tier=>({tier,distance:Math.min(...indexes.map(index=>Math.abs(TIER_ORDER.indexOf(tier)-index)))}))
      .sort((a,b)=>a.distance-b.distance||TIER_ORDER.indexOf(a.tier)-TIER_ORDER.indexOf(b.tier))[0]?.tier||null;
  }
  function chooseTierForRole(role,pools,badAlreadyUsed){
    const weights={...role.weights};
    if(badAlreadyUsed||!role.allowBad)delete weights.bad;
    const target=weightedKey(weights);
    if(target&&pools[target]?.length)return target;
    return nearestAvailableTier(role,pools,badAlreadyUsed,target);
  }
  function shapeSignature(tiers){
    const counts=Object.fromEntries(TIER_ORDER.map(tier=>[tier,0]));
    tiers.forEach(tier=>{if(tier in counts)counts[tier]+=1;});
    return TIER_ORDER.map(tier=>`${tier}:${counts[tier]}`).join('|');
  }
  function lineupFlavor(tiers){
    const high=tiers.filter(tier=>tier==='elite'||tier==='great').length;
    const low=tiers.filter(tier=>tier==='below-average'||tier==='bad').length;
    if(high>=4)return'loaded';
    if(low>=3||tiers.includes('bad'))return'ugly';
    return'mixed';
  }
  function overlapCount(ids,lineups){
    const recent=new Set((lineups||[]).flat());
    return ids.filter(id=>recent.has(id)).length;
  }
  function generateCandidate(pack,pool,counts){
    const selected=[];
    const roles=[];
    const used=new Set();
    let badUsed=false;
    for(const role of LINEUP_ROLES){
      const pools=absoluteTierPools(pack,pool,used);
      const tier=chooseTierForRole(role,pools,badUsed);
      if(!tier)return null;
      const fighter=chooseFighter(pools[tier],counts);
      if(!fighter)return null;
      selected.push(fighter);
      used.add(fighter.id);
      roles.push({roleId:role.id,roleLabel:role.label,targetTier:tier,actualTier:tier,fighterId:fighter.id});
      if(tier==='bad')badUsed=true;
    }
    const tiers=roles.map(row=>row.actualTier);
    const ids=selected.map(fighter=>fighter.id);
    return {selected,roles,tiers,ids,shape:shapeSignature(tiers),flavor:lineupFlavor(tiers)};
  }
  function buildLineup(packId,options={}){
    const pack=packFor(packId);
    const pool=api.poolForPack(pack);
    if(pool.length<8)return[];
    const recent=options.ignoreRecent?{lineups:[],shapes:[]}:recentForPack(pack.id);
    const counts=options.ignoreRecent?{}:recentCounts(pack.id);
    let best=null;
    for(let attempt=0;attempt<GENERATION_ATTEMPTS;attempt+=1){
      const candidate=generateCandidate(pack,pool,counts);
      if(!candidate)continue;
      const overlap=overlapCount(candidate.ids,recent.lineups);
      const repeatedShape=(recent.shapes||[]).includes(candidate.shape);
      const scored={...candidate,overlap,repeatedShape,penalty:(overlap*10)+(repeatedShape?5:0)};
      if(!best||scored.penalty<best.penalty)best=scored;
      if(overlap<=1&&!repeatedShape)break;
    }
    if(!best)return[];
    if(options.remember!==false)rememberLineup(pack.id,best.ids,best.shape);
    lastGenerated={
      engine:'absolute-role-weighted',
      packId:pack.id,
      poolSize:pool.length,
      roles:best.roles,
      tiers:best.tiers,
      shape:best.shape,
      flavor:best.flavor,
      recentOverlap:best.overlap,
      repeatedShape:best.repeatedShape,
      modelRanked:best.selected.filter(fighter=>fighter.modelRanked).length,
      playOnly:best.selected.filter(fighter=>!fighter.modelRanked).length
    };
    api.state.balance=lastGenerated;
    return shuffled(best.selected);
  }

  function auditPacks(){
    const packs=api.packs.map(pack=>{
      const pool=api.poolForPack(pack);
      const tierCounts=Object.fromEntries(TIER_ORDER.map(tier=>[tier,pool.filter(fighter=>tierForPack(pack,fighter)===tier).length]));
      const missingRatings=pool.filter(fighter=>!TIER_ORDER.includes(tierForPack(pack,fighter))).map(fighter=>fighter.name);
      const roleCoverage=Object.fromEntries(LINEUP_ROLES.map(role=>[
        role.id,
        TIER_ORDER.some(tier=>tierCounts[tier]>0&&(role.allowBad||tier!=='bad'))
      ]));
      return {
        id:pack.id,
        poolSize:pool.length,
        modelRanked:pool.filter(fighter=>fighter.modelRanked).length,
        playOnly:pool.filter(fighter=>!fighter.modelRanked).length,
        tierCounts,
        roleCoverage,
        missingRatings,
        playable:pool.length>=8&&missingRatings.length===0&&Object.values(roleCoverage).every(Boolean)
      };
    });
    return {
      passed:Boolean(RATINGS.audit?.passed)&&packs.every(pack=>pack.playable),
      engine:'absolute-role-weighted',
      ledgerVersion:RATINGS.version,
      rosterTotal:PLAY_DATA.audit?.total||PLAY_DATA.allFighters.length,
      packs
    };
  }
  function simulateLineups(iterations=1000,packId=null){
    const targets=packId?[packFor(packId)]:api.packs;
    const result={iterations,passed:true,packs:[]};
    targets.forEach(pack=>{
      const pool=api.poolForPack(pack);
      const tierSelections={};
      const flavors={loaded:0,mixed:0,ugly:0};
      let incomplete=0;
      let duplicateFailures=0;
      let moreThanOneBad=0;
      for(let index=0;index<iterations;index+=1){
        const candidate=generateCandidate(pack,pool,{});
        if(!candidate){incomplete+=1;continue;}
        if(candidate.ids.length!==8||new Set(candidate.ids).size!==8)duplicateFailures+=1;
        if(candidate.tiers.filter(tier=>tier==='bad').length>1)moreThanOneBad+=1;
        flavors[candidate.flavor]=(flavors[candidate.flavor]||0)+1;
        candidate.tiers.forEach(tier=>tierSelections[tier]=(tierSelections[tier]||0)+1);
      }
      const passed=incomplete===0&&duplicateFailures===0&&moreThanOneBad===0;
      result.passed=result.passed&&passed;
      result.packs.push({id:pack.id,poolSize:pool.length,passed,incomplete,duplicateFailures,moreThanOneBad,flavors,tierSelections});
    });
    return result;
  }
  function refreshAudit(){
    RATINGS.rebuild?.();
    const next=auditPacks();
    api.audit=next;
    document.documentElement.setAttribute('data-keep-cut-balance-audit',next.passed?'passed':'failed');
    document.documentElement.setAttribute('data-keep-cut-full-roster','phase-three');
    document.documentElement.setAttribute('data-keep-cut-lineup-engine','absolute-role-weighted');
    return next;
  }
  function patchedStart(options={}){
    if(Array.isArray(options.lineup)&&options.lineup.length===8)return originalStart(options);
    const packId=packFor(options.packId||api.state.packId).id;
    const lineup=buildLineup(packId);
    if(lineup.length!==8)return originalStart(options);
    const balance=lastGenerated;
    const result=originalStart({...options,packId,lineup});
    api.state.balance=balance;
    return result;
  }
  function patchedOpen(options={}){
    const hasExisting=api.state.lineup?.length===8;
    const result=originalOpen(options);
    const incoming=Array.isArray(options.lineup)&&options.lineup.length===8;
    if(!hasExisting&&!incoming&&!options.shared)patchedStart({packId:options.packId||api.state.packId});
    return result;
  }
  function migrateSavedGame(){
    try{
      if(localStorage.getItem(MIGRATION_KEY)==='1')return;
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(MIGRATION_KEY,'1');
    }catch(_error){}
  }
  function installInputOverrides(){
    document.addEventListener('click',event=>{
      const openTrigger=event.target.closest?.('[data-open-game="keep-cut"]');
      if(openTrigger){
        event.preventDefault();
        event.stopImmediatePropagation();
        patchedOpen();
        return;
      }
      const newTrigger=event.target.closest?.('[data-kc-new],[data-kc-replay]');
      if(newTrigger&&document.getElementById('playKeepCutPanel')?.contains?.(newTrigger)){
        event.preventDefault();
        event.stopImmediatePropagation();
        patchedStart({packId:document.getElementById('keepCutPack')?.value||api.state.packId});
      }
    },true);
    document.addEventListener('change',event=>{
      if(event.target?.id!=='keepCutPack')return;
      event.preventDefault();
      event.stopImmediatePropagation();
      patchedStart({packId:event.target.value});
    },true);
  }

  migrateSavedGame();
  installInputOverrides();
  api.startGame=patchedStart;
  api.open=patchedOpen;
  api.buildLineup=buildLineup;
  api.refreshAudit=refreshAudit;
  api.simulateLineups=simulateLineups;
  api.tierForPack=tierForPack;
  api.lineupRoles=LINEUP_ROLES.map(role=>({...role,weights:{...role.weights}}));
  api.absoluteTiers=[...TIER_ORDER];
  api.targetBuckets=[];
  api.phase=3;
  api.version=VERSION;
  refreshAudit();

  const hubApi=window.UFC_PLAY_HUB;
  if(hubApi&&!hubApi.__keepCutPhase3Patched){
    const previous=hubApi.openGame;
    hubApi.openGame=function(mode,options){
      if(mode==='keep-cut')return patchedOpen(options||{});
      return previous.call(hubApi,mode,options);
    };
    hubApi.__keepCutPhase3Patched=true;
  }

  document.documentElement.setAttribute('data-keep-cut',VERSION);
  document.documentElement.setAttribute('data-keep-cut-phase','3');
  window.dispatchEvent(new CustomEvent('ufc-keep-cut-ready',{detail:{version:VERSION,phase:3,audit:api.audit}}));
})();

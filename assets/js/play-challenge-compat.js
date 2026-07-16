(function(){
  'use strict';

  const VERSION='play-challenge-compat-20260715a';

  function waitFor(check,timeout=10000){
    return new Promise((resolve,reject)=>{
      const started=Date.now();
      const tick=()=>{
        const value=check();
        if(value){resolve(value);return;}
        if(Date.now()-started>timeout){reject(new Error('Play challenge tools did not finish loading.'));return;}
        setTimeout(tick,70);
      };
      tick();
    });
  }

  function normalizeSetup(setup){
    let value=setup;
    if(typeof value==='string'){
      try{value=JSON.parse(value);}catch(_error){value={};}
    }
    if(value&&typeof value==='object'&&value.setup&&typeof value.setup==='object')value=value.setup;
    return value&&typeof value==='object'?value:{};
  }

  function fighterEntries(setup){
    const value=normalizeSetup(setup);
    if(Array.isArray(value.fighters)){
      return value.fighters.map(entry=>typeof entry==='string'?{id:entry,name:entry}:{id:entry?.id||'',name:entry?.name||entry?.fighter||''});
    }
    const lineup=Array.isArray(value.lineup)?value.lineup:Array.isArray(value)?value:[];
    const names=Array.isArray(value.fighterNames)?value.fighterNames:Array.isArray(value.names)?value.names:[];
    return lineup.map((entry,index)=>typeof entry==='string'
      ? {id:entry,name:names[index]||''}
      : {id:entry?.id||'',name:entry?.name||entry?.fighter||names[index]||''});
  }

  function resolveLineup(data,setup,count){
    const entries=fighterEntries(setup);
    if(entries.length!==count)return [];
    const resolved=entries.map(entry=>data.resolve(entry.id)||data.resolve(entry.name));
    return resolved.some(fighter=>!fighter)?[]:resolved;
  }

  function shareCopy(message,url){
    return typeof navigator.share==='function'?message:`${message}\n\n${url}`;
  }

  function patchKeepCut(shared){
    const adapter=shared.adapterFor('keep-cut');
    if(!adapter||adapter.__compatPatched)return;

    adapter.version='keep-cut-v3';
    adapter.shareText=({url})=>shareCopy('Keep four and cut four from my exact UFC lineup. Every decision locks.',url);
    adapter.exportSetup=()=>{
      const state=window.UFC_KEEP_CUT?.state;
      if(!Array.isArray(state?.lineup)||state.lineup.length!==8)return null;
      const fighters=state.lineup.map(fighter=>({id:String(fighter?.id||''),name:String(fighter?.name||fighter?.fighter||'')}));
      if(fighters.some(fighter=>!fighter.id&&!fighter.name))return null;
      return {
        packId:state.packId||'ufc-careers',
        lineup:fighters.map(fighter=>fighter.id||fighter.name),
        fighterNames:fighters.map(fighter=>fighter.name),
        fighters
      };
    };
    adapter.openSetup=async setup=>{
      const game=await waitFor(()=>window.UFC_KEEP_CUT);
      const data=await waitFor(()=>window.UFC_PLAY_DATA?.allFighters?.length?window.UFC_PLAY_DATA:null);
      const normalized=normalizeSetup(setup);
      const lineup=resolveLineup(data,normalized,8);
      if(lineup.length!==8)throw new Error('This Keep 4, Cut 4 link is missing fighter data. Create and send a new challenge link.');
      document.querySelector('.tab[data-view="play"]')?.click();
      await new Promise(resolve=>setTimeout(resolve,30));
      game.open({lineup,packId:normalized.packId||normalized.pack_id||'ufc-careers',shared:true});
    };
    adapter.matchesSetup=setup=>{
      const data=window.UFC_PLAY_DATA;
      const current=window.UFC_KEEP_CUT?.state?.lineup||[];
      if(!data||current.length!==8)return false;
      const expected=resolveLineup(data,setup,8);
      return expected.length===8&&current.map(fighter=>fighter.id).join('|')===expected.map(fighter=>fighter.id).join('|');
    };
    adapter.__compatPatched=true;
  }

  function patchBlindRank(shared){
    const adapter=shared.adapterFor('blind-rank');
    if(!adapter||adapter.__compatPatched)return;

    adapter.version='blind-rank-v3';
    adapter.shareText=({url})=>shareCopy('Blind rank my exact five UFC fighters in the same reveal order, then compare our lists.',url);
    adapter.exportSetup=()=>{
      const state=window.UFC_BLIND_RANK?.state;
      if(!Array.isArray(state?.lineup)||state.lineup.length!==5)return null;
      const fighters=state.lineup.map(fighter=>({id:String(fighter?.id||''),name:String(fighter?.name||fighter?.fighter||'')}));
      return {
        packId:state.packId||'ufc-careers',
        lineup:fighters.map(fighter=>fighter.id||fighter.name),
        fighterNames:fighters.map(fighter=>fighter.name),
        fighters
      };
    };
    adapter.openSetup=async setup=>{
      const game=await waitFor(()=>window.UFC_BLIND_RANK);
      const data=await waitFor(()=>window.UFC_PLAY_DATA?.allFighters?.length?window.UFC_PLAY_DATA:null);
      const normalized=normalizeSetup(setup);
      const lineup=resolveLineup(data,normalized,5);
      if(lineup.length!==5)throw new Error('This Blind Rank link is missing fighter data. Create and send a new challenge link.');
      document.querySelector('.tab[data-view="play"]')?.click();
      await new Promise(resolve=>setTimeout(resolve,30));
      game.open({lineup,packId:normalized.packId||normalized.pack_id||'ufc-careers',shared:true});
    };
    adapter.matchesSetup=setup=>{
      const data=window.UFC_PLAY_DATA;
      const current=window.UFC_BLIND_RANK?.state?.lineup||[];
      if(!data||current.length!==5)return false;
      const expected=resolveLineup(data,setup,5);
      return expected.length===5&&current.map(fighter=>fighter.id).join('|')===expected.map(fighter=>fighter.id).join('|');
    };
    adapter.__compatPatched=true;
  }

  async function install(){
    try{
      const shared=await waitFor(()=>window.UFC_PLAY_SHARED?.adapterFor?window.UFC_PLAY_SHARED:null);
      await waitFor(()=>shared.adapterFor('keep-cut')&&shared.adapterFor('blind-rank'));
      patchKeepCut(shared);
      patchBlindRank(shared);
      document.documentElement.setAttribute('data-play-challenge-compat',VERSION);
    }catch(error){console.error(error);}
  }

  install();
})();
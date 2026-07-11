// Keeps public profile stats aligned with canonical ranking, title, and loss data.
// Runs after the scoring pipeline and does not change scores, ranks, or OVR.
(function(){
  'use strict';

  const VERSION='profile-stat-consistency-20260711b-ilia-title-prime-finish';
  const TITLE_WIN_KEYS=['normalTitleWins','interimTitleWins','vacantUndisputedWins','secondDivisionUndisputedWins','vacantSecondDivisionWins'];
  let applyCount=0;

  const numberOrNull=value=>{
    if(value===null||value===undefined||value==='')return null;
    const parsed=Number(value);
    return Number.isFinite(parsed)?parsed:null;
  };

  function titleFightWinsFromTitle(title){
    if(!title||typeof title!=='object')return null;
    const values=TITLE_WIN_KEYS.map(key=>numberOrNull(title[key])).filter(value=>value!==null);
    if(!values.length)return null;
    return values.reduce((sum,value)=>sum+value,0);
  }

  function isPrimeFinishLoss(loss){
    if(!loss)return false;
    const text=[loss.type,loss.phase,loss.method,loss.notes].filter(Boolean).join(' ').toLowerCase();
    return /finish|stoppage|\bko\b|\btko\b|submission|technical submission/.test(text);
  }

  function finishLossesFromLedger(name){
    const lossContext=window.UFC_FIGHTER_ERA_LEDGERS?.ledgers?.[name]?.lossContext;
    if(!lossContext)return null;
    const losses=[];
    if(lossContext.unrecoveredLoss)losses.push(lossContext.unrecoveredLoss);
    losses.push(...(lossContext.recoveredLosses||[]),...(lossContext.upwardDivisionLosses||[]));
    if(!losses.length)return null;
    return losses.filter(isPrimeFinishLoss).length;
  }

  function bestPrimeFinishValue(name,row,override){
    const packet=window.UFC_FIGHTER_PACKETS?.[name];
    const candidates=[
      finishLossesFromLedger(name),
      row?.timesFinishedPrime,
      row?.snapshotStats?.timesFinishedPrime,
      override?.snapshotStats?.timesFinishedPrime,
      override?.packetProfileStats?.timesFinishedPrime,
      packet?.profileStats?.timesFinishedPrime
    ].map(numberOrNull).filter(value=>value!==null);
    return candidates.length?Math.max(...candidates):0;
  }

  function setSnapshot(snapshot,label,value,patterns){
    const next=Array.isArray(snapshot)?snapshot.map(item=>Array.isArray(item)?item.slice():item):[];
    const index=next.findIndex(item=>Array.isArray(item)&&patterns.some(pattern=>pattern.test(String(item[0]||''))));
    if(index>=0)next[index]=[label,String(value)];
    else next.push([label,String(value)]);
    return next;
  }

  function applyFighter(name){
    const data=window.RANKING_DATA||{};
    const profile=(data.fighters||[]).find(row=>row?.fighter===name)||{};
    const board=(data.men||[]).find(row=>row?.fighter===name)||(data.women||[]).find(row=>row?.fighter===name)||{};
    const rows=[profile,board].filter(row=>row&&Object.keys(row).length);
    const override=typeof DISPLAY_OVERRIDES!=='undefined'?(DISPLAY_OVERRIDES[name]=DISPLAY_OVERRIDES[name]||{}):{};
    const packet=window.UFC_FIGHTER_PACKETS?.[name];
    const canonicalRecord=profile.ufcRecord||board.ufcRecord||null;
    const titleWins=titleFightWinsFromTitle(profile.title||board.title)
      ?? numberOrNull(packet?.profileStats?.titleFightWins)
      ?? numberOrNull(override?.packetProfileStats?.titleFightWins)
      ?? numberOrNull(override?.snapshotStats?.titleFightWins);
    const primeStoppageLosses=bestPrimeFinishValue(name,profile,override);
    const stats={};
    if(canonicalRecord)stats.ufcRecord=canonicalRecord;
    if(titleWins!==null)stats.titleFightWins=titleWins;
    stats.timesFinishedPrime=primeStoppageLosses;

    rows.forEach(row=>{
      row.snapshotStats={...(row.snapshotStats||{}),...stats};
      row.timesFinishedPrime=primeStoppageLosses;
    });

    if(typeof DISPLAY_OVERRIDES!=='undefined'){
      override.snapshotStats={...(override.snapshotStats||{}),...stats};
      override.packetProfileStats={...(override.packetProfileStats||{}),...stats};
      let snapshot=override.snapshot||[];
      if(canonicalRecord)snapshot=setSnapshot(snapshot,'UFC Record',canonicalRecord,[/^ufc record$/i]);
      if(titleWins!==null)snapshot=setSnapshot(snapshot,'UFC Title-Fight Wins',titleWins,[/ufc title[- ]fight wins/i,/title[- ]fight wins/i]);
      snapshot=setSnapshot(snapshot,'Prime Stoppage Losses',primeStoppageLosses,[/prime stoppage losses/i,/times finished in prime/i,/finished at peak/i]);
      override.snapshot=snapshot;
    }

    if(packet){
      packet.profileStats={...(packet.profileStats||{}),...stats};
      packet.display=packet.display||{};
      let snapshot=packet.display.snapshot||[];
      if(canonicalRecord)snapshot=setSnapshot(snapshot,'UFC Record',canonicalRecord,[/^ufc record$/i]);
      if(titleWins!==null)snapshot=setSnapshot(snapshot,'UFC Title-Fight Wins',titleWins,[/ufc title[- ]fight wins/i,/title[- ]fight wins/i]);
      snapshot=setSnapshot(snapshot,'Prime Stoppage Losses',primeStoppageLosses,[/prime stoppage losses/i,/times finished in prime/i,/finished at peak/i]);
      packet.display.snapshot=snapshot;
      packet.compareSeasoning=packet.compareSeasoning||{};
      if(titleWins!==null)packet.compareSeasoning.legacyStats={...(packet.compareSeasoning.legacyStats||{}),titleFightWins:titleWins};
    }

    const compare=window.COMPARE_PROFILES?.[name];
    if(compare&&titleWins!==null)compare.legacyStats={...(compare.legacyStats||{}),titleFightWins:titleWins};

    return{fighter:name,ufcRecord:canonicalRecord,titleFightWins:titleWins,primeStoppageLosses};
  }

  function installTitleHelpers(){
    const previous=window.titleFightWinsFromNotes;
    window.titleFightWinsFromNotes=function(title){
      const direct=titleFightWinsFromTitle(title);
      if(direct!==null)return String(Number.isInteger(direct)?direct:Number(direct.toFixed(2)));
      const note=String(title?.notes||'');
      const match=note.match(/(?:total\s+)?(?:ufc\s+)?title[- ]fight wins\s*=\s*([0-9.]+)/i);
      if(match)return match[1].replace(/\.0$/,'');
      return typeof previous==='function'?previous(title):null;
    };

    window.titleMix=function(title){
      const parts=[];
      const add=(key,label)=>{const value=numberOrNull(title?.[key]);if(value)parts.push(`${value} ${label}`);};
      add('normalTitleWins','regular title wins');
      add('interimTitleWins','interim');
      add('vacantUndisputedWins','vacant-title win');
      add('secondDivisionUndisputedWins','second-division title win');
      add('vacantSecondDivisionWins','vacant second-division title win');
      return parts.length?parts.join(' · '):'No UFC title wins loaded';
    };
  }

  function apply(){
    installTitleHelpers();
    const data=window.RANKING_DATA||{};
    const names=Array.from(new Set([...(data.fighters||[]),...(data.men||[]),...(data.women||[])].map(row=>row?.fighter).filter(Boolean)));
    const results=names.map(applyFighter);
    applyCount+=1;
    const ilia=results.find(result=>result.fighter==='Ilia Topuria')||null;
    const state={version:VERSION,applied:true,applyCount,fighterCount:results.length,results,ilia,iliaPassed:ilia?.ufcRecord==='9-1'&&Number(ilia?.titleFightWins)===3&&Number(ilia?.primeStoppageLosses)===1,mutatesScores:false,appliedAt:new Date().toISOString()};
    window.UFC_PROFILE_STAT_CONSISTENCY=state;
    document.documentElement.setAttribute('data-profile-stat-consistency',`${VERSION}-${state.iliaPassed?'passed':'review'}`);
    if(typeof window.refresh==='function')window.refresh();
    return state;
  }

  window.UFC_PROFILE_STAT_CONSISTENCY={version:VERSION,applied:false,applyCount,apply,mutatesScores:false};
  if(window.UFC_SCORING_PIPELINE?.status==='ready')apply();
  else window.addEventListener('ufc-scoring-pipeline-ready',apply,{once:true});
})();

// Phase 1 diagnostic: inventories duplicate fighter-fact ownership without changing live data.
(function(){
  'use strict';

  const VERSION='fighter-data-ownership-audit-20260713b-ready-aware';
  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const comparable=value=>{
    if(value===undefined||value===null||value==='')return null;
    if(typeof value==='number')return Number(value.toFixed(4));
    return String(value).trim().toLowerCase().replace(/\s+/g,' ');
  };
  const firstDefined=(...values)=>values.find(value=>value!==undefined&&value!==null&&value!=='');
  const valueByName=(source,name)=>source?.[name]||Object.entries(source||{}).find(([candidate])=>key(candidate)===key(name))?.[1];

  const FACT_READERS={
    ufcRecord:({board,profile,packet,override,canonical})=>({
      board:board?.ufcRecord,
      profile:profile?.ufcRecord,
      packet:packet?.profileStats?.ufcRecord,
      overrideSnapshot:override?.snapshotStats?.ufcRecord,
      overridePacket:override?.packetProfileStats?.ufcRecord,
      canonicalFacts:canonical?.facts?.ufcRecord?`${canonical.facts.ufcRecord.wins}-${canonical.facts.ufcRecord.losses}${canonical.facts.ufcRecord.draws?`-${canonical.facts.ufcRecord.draws}`:''}${canonical.facts.ufcRecord.noContests?` (${canonical.facts.ufcRecord.noContests} NC)`:''}`:undefined
    }),
    titleFightWins:({board,profile,packet,override,canonical})=>({
      board:firstDefined(board?.titleFightWins,board?.title?.titleFightWins),
      profile:firstDefined(profile?.titleFightWins,profile?.title?.titleFightWins),
      packet:packet?.profileStats?.titleFightWins,
      overrideSnapshot:override?.snapshotStats?.titleFightWins,
      overridePacket:override?.packetProfileStats?.titleFightWins,
      canonicalFacts:canonical?.facts?.championship?.titleFightWins
    }),
    eliteWins:({board,profile,packet,override,canonical})=>({
      board:firstDefined(board?.eliteWins,board?.elite),
      profile:firstDefined(profile?.eliteWins,profile?.elite),
      packet:packet?.profileStats?.eliteWins,
      overrideSnapshot:override?.snapshotStats?.eliteWins,
      overridePacket:override?.packetProfileStats?.eliteWins,
      canonicalFacts:canonical?.facts?.opponentQuality?.eliteWins
    }),
    topFiveWins:({board,profile,packet,override,canonical})=>({
      board:firstDefined(board?.topFiveWins,board?.top5Wins,board?.top5),
      profile:firstDefined(profile?.topFiveWins,profile?.top5Wins,profile?.top5),
      packet:firstDefined(packet?.profileStats?.topFiveWins,packet?.profileStats?.top5Wins),
      overrideSnapshot:firstDefined(override?.snapshotStats?.topFiveWins,override?.snapshotStats?.top5Wins),
      overridePacket:firstDefined(override?.packetProfileStats?.topFiveWins,override?.packetProfileStats?.top5Wins),
      canonicalFacts:canonical?.facts?.opponentQuality?.topFiveWins
    }),
    primeRecord:({data,name,board,profile,packet,override,canonical})=>({
      board:board?.primeRecord,
      profile:profile?.primeRecord,
      primeRecords:valueByName(data?.primeRecords,name)?.record,
      packet:packet?.profileStats?.primeRecord,
      overrideSnapshot:override?.snapshotStats?.primeRecord,
      overridePacket:override?.packetProfileStats?.primeRecord,
      canonicalFacts:canonical?.facts?.prime?`${canonical.facts.prime.wins}-${canonical.facts.prime.losses}${canonical.facts.prime.draws?`-${canonical.facts.prime.draws}`:''}`:undefined
    }),
    finishRatePct:({board,profile,packet,override,canonical})=>({
      board:firstDefined(board?.finishRatePct,board?.finishRate,board?.finishPercentage,board?.finishPct),
      profile:firstDefined(profile?.finishRatePct,profile?.finishRate,profile?.finishPercentage,profile?.finishPct),
      packet:packet?.profileStats?.finishRatePct,
      overrideSnapshot:override?.snapshotStats?.finishRatePct,
      overridePacket:override?.packetProfileStats?.finishRatePct,
      canonicalFacts:(()=>{const wins=canonical?.facts?.ufcRecord?.wins,finishes=canonical?.facts?.ufcRecord?.finishWins;return Number.isFinite(wins)&&wins>0&&Number.isFinite(finishes)?Number(((finishes/wins)*100).toFixed(2)):undefined;})()
    }),
    roundsWonPct:({board,profile,packet,override,canonical})=>({
      board:firstDefined(board?.roundsWonPct,board?.roundsWonPercentage),
      profile:firstDefined(profile?.roundsWonPct,profile?.roundsWonPercentage),
      packet:packet?.profileStats?.roundsWonPct,
      overrideSnapshot:override?.snapshotStats?.roundsWonPct,
      overridePacket:override?.packetProfileStats?.roundsWonPct,
      canonicalFacts:canonical?.facts?.prime?.roundsWonPct
    }),
    activeEliteYears:({board,profile,packet,override,canonical})=>({
      board:board?.activeEliteYears,
      profile:profile?.activeEliteYears,
      packet:packet?.profileStats?.activeEliteYears,
      overrideSnapshot:override?.snapshotStats?.activeEliteYears,
      overridePacket:override?.packetProfileStats?.activeEliteYears,
      canonicalFacts:canonical?.facts?.longevity?.activeEliteYears
    }),
    timesFinishedPrime:({board,profile,packet,override,canonical})=>({
      board:board?.timesFinishedPrime,
      profile:profile?.timesFinishedPrime,
      packet:packet?.profileStats?.timesFinishedPrime,
      overrideSnapshot:override?.snapshotStats?.timesFinishedPrime,
      overridePacket:override?.packetProfileStats?.timesFinishedPrime,
      canonicalFacts:canonical?.facts?.prime?.stoppageLosses
    })
  };

  const PRESENTATION_FORBIDDEN=[
    'rank','allTimeRank','totalScore','rawScore','overallOvr','championship','opponentQuality',
    'primeDominance','longevity','apexPeak','penalty','lossContext','eraDepthAdjustment',
    'ufcRecord','titleFightWins','eliteWins','topFiveWins','top5Wins','primeRecord',
    'finishRatePct','roundsWonPct','activeEliteYears','timesFinishedPrime'
  ];

  function sources(){
    return {
      data:window.RANKING_DATA||{},
      packets:window.UFC_FIGHTER_PACKETS||{},
      overrides:window.DISPLAY_OVERRIDES||{},
      scoring:window.UFC_CANONICAL_SCORING_RECORDS||{},
      facts:window.UFC_CANONICAL_FIGHTER_FACTS||null
    };
  }

  function collectPresentationViolations(packets,overrides){
    const violations=[];
    Object.entries(packets||{}).forEach(([fighter,packet])=>{
      PRESENTATION_FORBIDDEN.forEach(field=>{
        if(Object.prototype.hasOwnProperty.call(packet?.display||{},field))violations.push({fighter,source:'fighterPacket.display',field});
        if(Object.prototype.hasOwnProperty.call(packet?.profileStats||{},field))violations.push({fighter,source:'fighterPacket.profileStats',field});
      });
    });
    Object.entries(overrides||{}).forEach(([fighter,override])=>{
      PRESENTATION_FORBIDDEN.forEach(field=>{
        if(Object.prototype.hasOwnProperty.call(override||{},field))violations.push({fighter,source:'displayOverride',field});
        ['snapshotStats','packetProfileStats'].forEach(container=>{
          if(Object.prototype.hasOwnProperty.call(override?.[container]||{},field))violations.push({fighter,source:`displayOverride.${container}`,field});
        });
      });
    });
    return violations;
  }

  function audit(){
    const {data,packets,overrides,scoring,facts}=sources();
    const boardRows=[...(data.men||[]),...(data.women||[])].filter(row=>row?.fighter);
    const profileRows=(data.fighters||[]).filter(row=>row?.fighter);
    const boards=new Map(boardRows.map(row=>[key(row.fighter),row]));
    const profiles=new Map(profileRows.map(row=>[key(row.fighter),row]));
    const names=new Map();
    [
      ...boardRows.map(row=>row.fighter),
      ...profileRows.map(row=>row.fighter),
      ...Object.keys(packets),
      ...Object.keys(overrides),
      ...(scoring.fighters?.()||[]),
      ...(facts?.list?.()||[]).map(row=>row.fighter)
    ].forEach(name=>{if(name&&!names.has(key(name)))names.set(key(name),name);});

    const conflicts=[];
    const duplicated=[];
    names.forEach((name,id)=>{
      const context={
        data,
        name,
        board:boards.get(id),
        profile:profiles.get(id),
        packet:valueByName(packets,name),
        override:valueByName(overrides,name),
        canonical:facts?.get?.(name)
      };
      Object.entries(FACT_READERS).forEach(([field,reader])=>{
        const values=reader(context);
        const present=Object.entries(values).filter(([,value])=>value!==undefined&&value!==null&&value!=='');
        if(present.length>1)duplicated.push({fighter:name,field,sources:present.map(([source])=>source)});
        const distinct=new Map();
        present.forEach(([source,value])=>{
          const normalized=comparable(value);
          if(normalized===null)return;
          const token=JSON.stringify(normalized);
          if(!distinct.has(token))distinct.set(token,{value,sources:[]});
          distinct.get(token).sources.push(source);
        });
        if(distinct.size>1)conflicts.push({fighter:name,field,values:Array.from(distinct.values())});
      });
    });

    const scoreRows=Object.values(scoring.records||{});
    const runtimeLocks={
      expectedRank:scoreRows.filter(row=>Object.prototype.hasOwnProperty.call(row,'expectedRank')).length,
      expectedTotalScore:scoreRows.filter(row=>Object.prototype.hasOwnProperty.call(row,'expectedTotalScore')).length,
      expectedOverallOvr:scoreRows.filter(row=>Object.prototype.hasOwnProperty.call(row,'expectedOverallOvr')).length
    };
    const presentationViolations=collectPresentationViolations(packets,overrides);
    const canonicalCount=facts?.count?.()||0;
    const rosterCount=names.size;

    return {
      version:VERSION,
      capturedAt:new Date().toISOString(),
      mode:'diagnostic-only',
      rosterCount,
      boardRowCount:boardRows.length,
      profileRowCount:profileRows.length,
      fighterPacketCount:Object.keys(packets).length,
      displayOverrideCount:Object.keys(overrides).length,
      canonicalScoringRecordCount:scoreRows.length,
      canonicalFactRecordCount:canonicalCount,
      canonicalCoveragePct:rosterCount?Number(((canonicalCount/rosterCount)*100).toFixed(2)):0,
      duplicatedFactFields:duplicated,
      conflictingFactFields:conflicts,
      presentationOwnershipViolations:presentationViolations,
      runtimeExpectedValueLocks:runtimeLocks,
      passed:conflicts.length===0&&presentationViolations.length===0&&Object.values(runtimeLocks).every(value=>value===0)&&canonicalCount===rosterCount
    };
  }

  function summarize(report){
    return {
      version:VERSION,
      mode:'diagnostic-only',
      rosterCount:report.rosterCount,
      boardRowCount:report.boardRowCount,
      profileRowCount:report.profileRowCount,
      fighterPacketCount:report.fighterPacketCount,
      displayOverrideCount:report.displayOverrideCount,
      canonicalScoringRecordCount:report.canonicalScoringRecordCount,
      canonicalFactRecordCount:report.canonicalFactRecordCount,
      canonicalCoveragePct:report.canonicalCoveragePct,
      conflictCount:report.conflictingFactFields.length,
      duplicateCount:report.duplicatedFactFields.length,
      presentationViolationCount:report.presentationOwnershipViolations.length,
      runtimeExpectedValueLocks:report.runtimeExpectedValueLocks,
      passed:report.passed
    };
  }

  let resolveReady;
  const readyPromise=new Promise(resolve=>{resolveReady=resolve;});
  const API={version:VERSION,mode:'diagnostic-only',mutatesRankingData:false,ready:false,latest:null,summary:null,readyPromise,audit,activate};

  async function activate(){
    if(API.ready)return API.latest;
    try{
      const dataReady=window.UFC_RANKING_DATA_PATCHES_READY;
      if(dataReady&&typeof dataReady.then==='function')await dataReady;
      await new Promise(resolve=>setTimeout(resolve,0));
      API.latest=audit();
      API.summary=summarize(API.latest);
      API.ready=true;
      resolveReady(API.latest);
      console.info('[UFC fighter-data Phase 1 baseline]',API.summary);
      return API.latest;
    }catch(error){
      API.error=error?.stack||error?.message||String(error);
      API.ready=true;
      resolveReady(null);
      console.error('[UFC fighter-data Phase 1 baseline failed]',API.error);
      return null;
    }
  }

  window.UFC_FIGHTER_DATA_OWNERSHIP_AUDIT=API;
  const requested=new URLSearchParams(location.search).has('fighter-data-ownership-audit');
  if(requested)activate();
})();

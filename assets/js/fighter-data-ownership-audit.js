// Phase 1 diagnostic: inventories duplicate fighter-fact ownership without changing live data.
(function(){
  'use strict';

  const VERSION='fighter-data-ownership-audit-20260713a-phase1-baseline';
  const DATA=window.RANKING_DATA||{};
  const PACKETS=window.UFC_FIGHTER_PACKETS||{};
  const OVERRIDES=window.DISPLAY_OVERRIDES||{};
  const SCORING=window.UFC_CANONICAL_SCORING_RECORDS||{};
  const FACTS=window.UFC_CANONICAL_FIGHTER_FACTS||null;

  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const comparable=value=>{
    if(value===undefined||value===null||value==='')return null;
    if(typeof value==='number')return Number(value.toFixed(4));
    return String(value).trim().toLowerCase().replace(/\s+/g,' ');
  };
  const firstDefined=(...values)=>values.find(value=>value!==undefined&&value!==null&&value!=='');

  function boardRows(){return [...(DATA.men||[]),...(DATA.women||[])].filter(row=>row?.fighter);}
  function profileRows(){return (DATA.fighters||[]).filter(row=>row?.fighter);}
  function mapRows(rows){return new Map(rows.map(row=>[key(row.fighter),row]));}

  const boards=mapRows(boardRows());
  const profiles=mapRows(profileRows());
  const names=new Map();
  [
    ...boardRows().map(row=>row.fighter),
    ...profileRows().map(row=>row.fighter),
    ...Object.keys(PACKETS),
    ...Object.keys(OVERRIDES),
    ...(SCORING.fighters?.()||[]),
    ...(FACTS?.list?.()||[]).map(row=>row.fighter)
  ].forEach(name=>{if(name&&!names.has(key(name)))names.set(key(name),name);});

  const FACT_READERS={
    ufcRecord:({board,profile,packet,override,prime})=>({
      board:board?.ufcRecord,
      profile:profile?.ufcRecord,
      packet:packet?.profileStats?.ufcRecord,
      overrideSnapshot:override?.snapshotStats?.ufcRecord,
      overridePacket:override?.packetProfileStats?.ufcRecord,
      canonicalFacts:prime?.facts?.ufcRecord?`${prime.facts.ufcRecord.wins}-${prime.facts.ufcRecord.losses}${prime.facts.ufcRecord.draws?`-${prime.facts.ufcRecord.draws}`:''}${prime.facts.ufcRecord.noContests?` (${prime.facts.ufcRecord.noContests} NC)`:''}`:undefined
    }),
    titleFightWins:({board,profile,packet,override,prime})=>({
      board:firstDefined(board?.titleFightWins,board?.title?.titleFightWins),
      profile:firstDefined(profile?.titleFightWins,profile?.title?.titleFightWins),
      packet:packet?.profileStats?.titleFightWins,
      overrideSnapshot:override?.snapshotStats?.titleFightWins,
      overridePacket:override?.packetProfileStats?.titleFightWins,
      canonicalFacts:prime?.facts?.championship?.titleFightWins
    }),
    eliteWins:({board,profile,packet,override,prime})=>({
      board:firstDefined(board?.eliteWins,board?.elite),
      profile:firstDefined(profile?.eliteWins,profile?.elite),
      packet:packet?.profileStats?.eliteWins,
      overrideSnapshot:override?.snapshotStats?.eliteWins,
      overridePacket:override?.packetProfileStats?.eliteWins,
      canonicalFacts:prime?.facts?.opponentQuality?.eliteWins
    }),
    topFiveWins:({board,profile,packet,override,prime})=>({
      board:firstDefined(board?.topFiveWins,board?.top5Wins,board?.top5),
      profile:firstDefined(profile?.topFiveWins,profile?.top5Wins,profile?.top5),
      packet:firstDefined(packet?.profileStats?.topFiveWins,packet?.profileStats?.top5Wins),
      overrideSnapshot:firstDefined(override?.snapshotStats?.topFiveWins,override?.snapshotStats?.top5Wins),
      overridePacket:firstDefined(override?.packetProfileStats?.topFiveWins,override?.packetProfileStats?.top5Wins),
      canonicalFacts:prime?.facts?.opponentQuality?.topFiveWins
    }),
    primeRecord:({board,profile,packet,override,prime,name})=>({
      board:board?.primeRecord,
      profile:profile?.primeRecord,
      primeRecords:DATA.primeRecords?.[name]?.record,
      packet:packet?.profileStats?.primeRecord,
      overrideSnapshot:override?.snapshotStats?.primeRecord,
      overridePacket:override?.packetProfileStats?.primeRecord,
      canonicalFacts:prime?.facts?.prime?`${prime.facts.prime.wins}-${prime.facts.prime.losses}${prime.facts.prime.draws?`-${prime.facts.prime.draws}`:''}`:undefined
    }),
    finishRatePct:({board,profile,packet,override,prime})=>({
      board:firstDefined(board?.finishRatePct,board?.finishRate),
      profile:firstDefined(profile?.finishRatePct,profile?.finishRate),
      packet:packet?.profileStats?.finishRatePct,
      overrideSnapshot:override?.snapshotStats?.finishRatePct,
      overridePacket:override?.packetProfileStats?.finishRatePct,
      canonicalFacts:(()=>{const wins=prime?.facts?.ufcRecord?.wins,finishes=prime?.facts?.ufcRecord?.finishWins;return Number.isFinite(wins)&&wins>0&&Number.isFinite(finishes)?Number(((finishes/wins)*100).toFixed(2)):undefined;})()
    }),
    roundsWonPct:({board,profile,packet,override,prime})=>({
      board:board?.roundsWonPct,
      profile:profile?.roundsWonPct,
      packet:packet?.profileStats?.roundsWonPct,
      overrideSnapshot:override?.snapshotStats?.roundsWonPct,
      overridePacket:override?.packetProfileStats?.roundsWonPct,
      canonicalFacts:prime?.facts?.prime?.roundsWonPct
    }),
    activeEliteYears:({board,profile,packet,override,prime})=>({
      board:board?.activeEliteYears,
      profile:profile?.activeEliteYears,
      packet:packet?.profileStats?.activeEliteYears,
      overrideSnapshot:override?.snapshotStats?.activeEliteYears,
      overridePacket:override?.packetProfileStats?.activeEliteYears,
      canonicalFacts:prime?.facts?.longevity?.activeEliteYears
    }),
    timesFinishedPrime:({board,profile,packet,override,prime})=>({
      board:board?.timesFinishedPrime,
      profile:profile?.timesFinishedPrime,
      packet:packet?.profileStats?.timesFinishedPrime,
      overrideSnapshot:override?.snapshotStats?.timesFinishedPrime,
      overridePacket:override?.packetProfileStats?.timesFinishedPrime,
      canonicalFacts:prime?.facts?.prime?.stoppageLosses
    })
  };

  const PRESENTATION_FORBIDDEN=[
    'rank','allTimeRank','totalScore','rawScore','overallOvr','championship','opponentQuality',
    'primeDominance','longevity','apexPeak','penalty','lossContext','eraDepthAdjustment',
    'ufcRecord','titleFightWins','eliteWins','topFiveWins','top5Wins','primeRecord',
    'finishRatePct','roundsWonPct','activeEliteYears','timesFinishedPrime'
  ];

  function collectPresentationViolations(){
    const violations=[];
    Object.entries(PACKETS).forEach(([fighter,packet])=>{
      PRESENTATION_FORBIDDEN.forEach(field=>{
        if(Object.prototype.hasOwnProperty.call(packet?.display||{},field))violations.push({fighter,source:'fighterPacket.display',field});
        if(Object.prototype.hasOwnProperty.call(packet?.profileStats||{},field))violations.push({fighter,source:'fighterPacket.profileStats',field});
      });
    });
    Object.entries(OVERRIDES).forEach(([fighter,override])=>{
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
    const conflicts=[];
    const duplicated=[];
    names.forEach((name,id)=>{
      const context={
        name,
        board:boards.get(id),
        profile:profiles.get(id),
        packet:PACKETS[name]||Object.entries(PACKETS).find(([fighter])=>key(fighter)===id)?.[1],
        override:OVERRIDES[name]||Object.entries(OVERRIDES).find(([fighter])=>key(fighter)===id)?.[1],
        prime:FACTS?.get?.(name)
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

    const scoreRows=Object.values(SCORING.records||{});
    const runtimeLocks={
      expectedRank:scoreRows.filter(row=>Object.prototype.hasOwnProperty.call(row,'expectedRank')).length,
      expectedTotalScore:scoreRows.filter(row=>Object.prototype.hasOwnProperty.call(row,'expectedTotalScore')).length,
      expectedOverallOvr:scoreRows.filter(row=>Object.prototype.hasOwnProperty.call(row,'expectedOverallOvr')).length
    };
    const presentationViolations=collectPresentationViolations();
    const canonicalCount=FACTS?.count?.()||0;
    const rosterCount=names.size;

    return {
      version:VERSION,
      mode:'diagnostic-only',
      rosterCount,
      canonicalFactRecordCount:canonicalCount,
      canonicalCoveragePct:rosterCount?Number(((canonicalCount/rosterCount)*100).toFixed(2)):0,
      duplicatedFactFields:duplicated,
      conflictingFactFields:conflicts,
      presentationOwnershipViolations:presentationViolations,
      runtimeExpectedValueLocks:runtimeLocks,
      passed:conflicts.length===0&&presentationViolations.length===0&&Object.values(runtimeLocks).every(value=>value===0)&&canonicalCount===rosterCount
    };
  }

  const report=audit();
  window.UFC_FIGHTER_DATA_OWNERSHIP_AUDIT={version:VERSION,audit,latest:report};
  DATA.meta=DATA.meta||{};
  DATA.meta.fighterDataOwnershipPhase1={
    version:VERSION,
    mode:'diagnostic-only',
    canonicalFactRecordCount:report.canonicalFactRecordCount,
    canonicalCoveragePct:report.canonicalCoveragePct,
    conflictCount:report.conflictingFactFields.length,
    duplicateCount:report.duplicatedFactFields.length,
    presentationViolationCount:report.presentationOwnershipViolations.length,
    runtimeExpectedValueLocks:report.runtimeExpectedValueLocks
  };
  document.documentElement.setAttribute('data-fighter-data-ownership-audit',VERSION);
  console.info('[UFC fighter-data Phase 1 baseline]',DATA.meta.fighterDataOwnershipPhase1);
})();

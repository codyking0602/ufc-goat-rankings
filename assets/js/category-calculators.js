// Unified production-facing API for the seven approved UFC GOAT category calculators.
// The underlying reconstruction modules remain temporarily during migration, but callers
// consume one read-only interface and never read frozen totals, ranks, or OVR controls.
(function(){
  'use strict';

  const VERSION='category-calculators-20260714a-approved-seven-category-api';
  const EXPECTED_FIGHTERS=73;
  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  const round2=value=>{const rounded=Math.round((Number(value||0)+Number.EPSILON)*100)/100;return Object.is(rounded,-0)?0:rounded;};
  const finite=value=>Number.isFinite(Number(value));

  const SOURCE_DEFINITIONS=Object.freeze({
    championship:Object.freeze({global:'UFC_CANONICAL_CHAMPIONSHIP_RECONSTRUCTION',field:'reconstructedScore'}),
    opponentQuality:Object.freeze({global:'UFC_CANONICAL_OPPONENT_QUALITY_RECONSTRUCTION',field:'reconstructedScore'}),
    primeDominance:Object.freeze({global:'UFC_CANONICAL_PRIME_DOMINANCE_RECONSTRUCTION',field:'reconstructedScore'}),
    longevity:Object.freeze({global:'UFC_CANONICAL_LONGEVITY_RECONSTRUCTION',field:'reconstructedScore'}),
    penalty:Object.freeze({global:'UFC_CANONICAL_LOSS_CONTEXT_RECONSTRUCTION',field:'reconstructedPenalty'}),
    apex:Object.freeze({global:'UFC_CANONICAL_APEX_RECONSTRUCTION',field:'reconstructedScore'}),
    eraDepth:Object.freeze({global:'UFC_CANONICAL_DIVISION_ERA_DEPTH_RECONSTRUCTION',field:'canonicalAdjustment'})
  });

  function sourceFor(category){
    const definition=SOURCE_DEFINITIONS[category];
    return definition?window[definition.global]||null:null;
  }

  function rowFor(category,fighter){
    const source=sourceFor(category);
    return source?.entryFor?.(fighter)||null;
  }

  function entryFor(fighter){
    const scores={};
    const traces={};
    const missing=[];
    Object.entries(SOURCE_DEFINITIONS).forEach(([category,definition])=>{
      const source=sourceFor(category);
      const row=source?.entryFor?.(fighter)||null;
      const value=row?.[definition.field];
      if(!source||!row||!finite(value))missing.push(category);
      else scores[category]=round2(value);
      traces[category]=row?clone(row):null;
    });
    if(missing.length)return {fighter,status:'blocked',missing,scores,traces};
    return {
      fighter,
      status:'complete',
      missing:[],
      championship:scores.championship,
      opponentQuality:scores.opponentQuality,
      primeDominance:scores.primeDominance,
      longevity:scores.longevity,
      penalty:scores.penalty,
      apex:scores.apex,
      eraDepth:scores.eraDepth,
      scores,
      traces
    };
  }

  function list(){
    const facts=window.UFC_CANONICAL_FIGHTER_FACTS;
    if(!facts?.list)return [];
    return facts.list().map(record=>({
      ...entryFor(record.fighter),
      board:record.board
    }));
  }

  function audit(){
    const rows=list();
    const blocked=rows.filter(row=>row.status!=='complete');
    const sources=Object.fromEntries(Object.entries(SOURCE_DEFINITIONS).map(([category,definition])=>{
      const source=sourceFor(category);
      return [category,{
        global:definition.global,
        field:definition.field,
        available:Boolean(source),
        version:source?.version||null
      }];
    }));
    return {
      version:VERSION,
      expectedFighterCount:EXPECTED_FIGHTERS,
      fighterCount:rows.length,
      completeFighterCount:rows.length-blocked.length,
      blockedFighterCount:blocked.length,
      blockedFighters:blocked.map(row=>({fighter:row.fighter,missing:row.missing})),
      sources,
      readsFrozenExpectedOutputs:false,
      mutatesRankingData:false,
      passed:rows.length===EXPECTED_FIGHTERS&&blocked.length===0&&Object.values(sources).every(source=>source.available),
      rows
    };
  }

  const API={
    version:VERSION,
    role:'single read-only API for seven approved category calculations',
    expectedFighterCount:EXPECTED_FIGHTERS,
    sourceDefinitions:clone(SOURCE_DEFINITIONS),
    readsFrozenExpectedOutputs:false,
    mutatesRankingData:false,
    rowFor,
    entryFor,
    list,
    audit
  };

  window.UFC_CATEGORY_CALCULATORS=API;
  const report=audit();
  window.UFC_CATEGORY_CALCULATOR_AUDIT=report;
  if(typeof document!=='undefined'&&document.documentElement?.setAttribute){
    document.documentElement.setAttribute('data-category-calculators',`${VERSION}-${report.passed?'clean':'blocked'}-${report.completeFighterCount}`);
  }
})();

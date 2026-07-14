// Cody-approved Division-Era Depth factual completions.
// Shadow-only: supplies canonical source/control coverage without mutating live scores, totals, ranks, OVRs, profiles, or Compare Mode.
(function(){
  'use strict';

  const VERSION='canonical-division-era-depth-approved-resolutions-20260714a-leon';
  const rows=[
    {
      fighter:'Leon Edwards',
      classification:'factual-completion',
      approvalStatus:'cody-approved',
      decision:'Add the missing empirical welterweight row using the already-approved pinned source, quarterly model, title weighting, and curved adjustment.',
      approvedAdjustment:0.02,
      sourceRow:{
        fighter:'Leon Edwards',
        group:'men',
        primeStart:'2019-07-20',
        primeEnd:'2024-07-27',
        openPrime:false,
        primaryDivision:'WW',
        sampledDivisions:['WW'],
        matchedPrimeFightCount:7,
        scoredSampleCount:7,
        titleWeightedSampleCount:4,
        depthIndex:1.0008,
        curvedAdjustment:0.02,
        componentRatios:{
          qualifiedActivePool:1.0102,
          ranksSixToFifteenElo:0.9894,
          contenderDiversity:1.015
        },
        sourceDataset:{
          repository:'komaksym/UFC-DataLab',
          commit:'3268146c05211de9deab8b9b4c0bb4a954815f0b',
          file:'data/stats/stats_raw.csv',
          datasetFightCount:8737,
          datasetEnd:'2026-06-27'
        },
        reconstructionParity:{checkedNonWfwRows:69,mismatchCount:0},
        classification:'factual-completion',
        approvalStatus:'cody-approved',
        provenance:'Canonical prime 2019-07-20 through 2024-07-27 + pinned empirical Division-Era Depth generator'
      }
    }
  ];

  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const byKey=new Map(rows.map(row=>[key(row.fighter),Object.freeze(row)]));
  window.UFC_CANONICAL_DIVISION_ERA_DEPTH_APPROVED_RESOLUTIONS=Object.freeze({
    version:VERSION,
    rows:Object.freeze(rows.slice()),
    entryFor:fighter=>byKey.get(key(fighter))||null,
    fighterCount:rows.length,
    approvalStatus:'cody-approved',
    mutatesRankingData:false,
    mutatesScores:false,
    mutatesRanks:false,
    mutatesOvr:false
  });
})();

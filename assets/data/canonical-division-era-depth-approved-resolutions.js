// Cody-approved Division-Era Depth factual completions.
// Shadow-only: supplies canonical source/control coverage without mutating live scores, totals, ranks, OVRs, profiles, or Compare Mode.
(function(){
  'use strict';

  const VERSION='canonical-division-era-depth-approved-resolutions-20260714b-leon-shared-era';
  const rows=[
    {
      fighter:'Leon Edwards',
      classification:'factual-completion',
      approvalStatus:'cody-approved',
      decision:'Add the missing empirical welterweight row using the pinned source, approved quarterly mechanics, and the Cody-approved shared Fighter Era Ledger window from Rafael dos Anjos through Sean Brady.',
      approvedAdjustment:0.06,
      sourceRow:{
        fighter:'Leon Edwards',
        group:'men',
        primeStart:'2019-07-20',
        primeEnd:'2025-03-22',
        openPrime:false,
        phaseSource:'fighter-era-ledgers',
        primaryDivision:'WW',
        sampledDivisions:['WW'],
        matchedPrimeFightCount:8,
        scoredSampleCount:8,
        titleWeightedSampleCount:4,
        depthIndex:1.0032,
        curvedAdjustment:0.06,
        componentRatios:{
          qualifiedActivePool:1.0071,
          ranksSixToFifteenElo:0.9952,
          contenderDiversity:1.0173
        },
        sourceDataset:{
          repository:'komaksym/UFC-DataLab',
          commit:'3268146c05211de9deab8b9b4c0bb4a954815f0b',
          file:'data/stats/stats_raw.csv',
          datasetFightCount:8737,
          datasetEnd:'2026-06-27'
        },
        reconstructionParity:{checkedNonWfwRows:69,mismatchCount:0},
        fighterLocalPrimeAudit:{start:'2019-07-20',end:'2024-07-27',controlsScore:false},
        classification:'factual-completion',
        approvalStatus:'cody-approved',
        provenance:'Approved shared Fighter Era Ledger 2019-07-20 through 2025-03-22 + pinned empirical Division-Era Depth generator'
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
    phaseSource:'fighter-era-ledgers',
    mutatesRankingData:false,
    mutatesScores:false,
    mutatesRanks:false,
    mutatesOvr:false
  });
})();

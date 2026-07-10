// Prime Dominance audited batch seven: Frankie Edgar, T.J. Dillashaw, Tyron Woodley.
// Extends the shadow model after the base calculation and before live category promotion.
(function(){
  'use strict';
  const VERSION='prime-dominance-audit-batch-seven-20260710a';
  const base=window.UFC_PRIME_DOMINANCE_LEDGERS;
  const model=window.UFC_PRIME_DOMINANCE_SHADOW_MODEL;
  if(!base||!Array.isArray(base.report)||!model)return;

  const entries={
    'Frankie Edgar':{
      fighter:'Frankie Edgar',
      primeRecord:'9-6-1',primeWins:9,primeLosses:6,primeDraws:1,primeNCs:0,
      primeRecordPct:59.38,primeRecordScore:5.34,
      roundControlPct:56.0,roundControlScore:4.48,
      roundControlAudit:{fighter:'Frankie Edgar',roundControlPct:56.0,status:'locked',source:'approved packet-level conservative input',window:'B.J. Penn I 2010 → Brian Ortega 2018'},
      primeFights:16,primeFinishes:4,primeFinishRate:25.0,finishPressureScore:1.0,
      eliteStakesBreakdown:{titleFightWins:1.75,topFiveWins:1.25,champFormerChampWins:.75,fiveRoundTitleStageSample:.5,divisionStrengthContext:.25},
      eliteStakesRawScore:4.5,eliteStakesScore:7.2,
      total:18.02,
      dominanceProfile:'Durable lightweight-to-featherweight title prime built on pace, recovery, and elite-stage resistance rather than finish pressure.',
      status:'locked',version:VERSION
    },
    'T.J. Dillashaw':{
      fighter:'T.J. Dillashaw',
      primeRecord:'8-3',primeWins:8,primeLosses:3,primeDraws:0,primeNCs:0,
      primeRecordPct:72.73,primeRecordScore:6.55,
      roundControlPct:61.0,roundControlScore:4.88,
      roundControlAudit:{fighter:'T.J. Dillashaw',roundControlPct:61.0,status:'locked',source:'approved packet-level conservative input',window:'Renan Barao I 2014 → Aljamain Sterling 2022'},
      primeFights:11,primeFinishes:5,primeFinishRate:45.45,finishPressureScore:3.0,
      eliteStakesBreakdown:{titleFightWins:2,topFiveWins:1.25,champFormerChampWins:1,fiveRoundTitleStageSample:.5,divisionStrengthContext:.25},
      eliteStakesRawScore:5.0,eliteStakesScore:8.0,
      total:22.43,
      dominanceProfile:'Explosive two-reign bantamweight title prime with elite movement, finishing pressure, and max title-stage proof; PED history remains legacy context outside this category formula.',
      status:'locked',version:VERSION
    },
    'Tyron Woodley':{
      fighter:'Tyron Woodley',
      primeRecord:'7-3-1',primeWins:7,primeLosses:3,primeDraws:1,primeNCs:0,
      primeRecordPct:68.18,primeRecordScore:6.14,
      roundControlPct:51.35,roundControlScore:4.11,
      roundControlAudit:{fighter:'Tyron Woodley',roundsWon:19,roundsCounted:37,roundControlPct:51.35,status:'locked',source:'approved Condit-through-Burns fight ledger',window:'Carlos Condit 2014 → Gilbert Burns 2020'},
      primeFights:11,primeFinishes:4,primeFinishRate:36.36,finishPressureScore:2.0,
      eliteStakesBreakdown:{titleFightWins:2,topFiveWins:1.25,champFormerChampWins:1,fiveRoundTitleStageSample:.5,divisionStrengthContext:.2},
      eliteStakesRawScore:4.95,eliteStakesScore:7.92,
      total:20.17,
      dominanceProfile:'Strong welterweight champion prime with major elite-stage proof, offset by inconsistent round control and the Usman/Burns ending.',
      status:'locked',version:VERSION
    }
  };

  const priorEntryFor=base.entryFor;
  const byName=new Map(base.report.map(entry=>[entry.fighter,entry]));
  Object.values(entries).forEach(entry=>byName.set(entry.fighter,entry));
  const report=[...byName.values()].sort((a,b)=>Number(b.total||0)-Number(a.total||0)||String(a.fighter).localeCompare(String(b.fighter)));

  base.entryFor=fighter=>entries[fighter]||priorEntryFor?.(fighter)||null;
  base.report=report;
  base.leaders=report.slice(0,15);
  base.auditBatchSeven={version:VERSION,fighters:Object.keys(entries),entries,appliedAt:new Date().toISOString()};
  base.applied=Array.from(new Set([...(base.applied||[]),...Object.keys(entries)]));

  model.report=report;
  model.auditBatchSeven=base.auditBatchSeven;
  window.UFC_PRIME_DOMINANCE_AUDIT_BATCH_SEVEN=base.auditBatchSeven;
  document.documentElement.setAttribute('data-prime-dominance-audit-batch-seven',VERSION);
})();

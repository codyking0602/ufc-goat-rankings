// Canonical-window Prime Dominance rebuild for the five boundary-adjusted fighters.
// Replaces stale fight counts, round-control totals, and finish totals before live promotion.
(function(){
  'use strict';
  const VERSION='prime-dominance-audit-batch-ten-20260710a-canonical-window-five';
  const base=window.UFC_PRIME_DOMINANCE_LEDGERS;
  const model=window.UFC_PRIME_DOMINANCE_SHADOW_MODEL;
  const era=window.UFC_FIGHTER_ERA_LEDGERS;
  if(!base||!Array.isArray(base.report)||!model)return;

  const FINISH_SCALE=base.finishScale||[
    {min:.90,score:5},{min:.75,score:4.5},{min:.60,score:4},{min:.45,score:3},{min:.30,score:2},{min:.15,score:1},{min:0,score:.5}
  ];
  const RAW={
    'Dustin Poirier':{
      primeWins:8,primeLosses:4,primeDraws:0,primeNCs:0,primeFinishes:6,
      window:'Justin Gaethje I → Islam Makhachev',
      fights:[
        ['Justin Gaethje I',3,1],['Eddie Alvarez II',2,0],['Max Holloway II',3,2],['Khabib Nurmagomedov',0,3],
        ['Dan Hooker',3,2],['Conor McGregor II',1,1],['Conor McGregor III',1,0,'injury stoppage still counts as the winning finish round'],
        ['Charles Oliveira',1,2],['Michael Chandler',2,1],['Justin Gaethje II',0,2],['Benoit Saint Denis',1,1],['Islam Makhachev',1,4]
      ],
      eliteStakesBreakdown:{titleFightWins:.75,topFiveWins:1.25,champFormerChampWins:1,fiveRoundTitleStageSample:.5,divisionStrengthContext:.25},
      dominanceProfile:'Deep modern-lightweight prime with elite wins, repeated title-stage proof, and real recovery after championship losses; the Islam endpoint keeps the full late-prime resistance inside the score.'
    },
    'Justin Gaethje':{
      primeWins:7,primeLosses:3,primeDraws:0,primeNCs:0,primeFinishes:5,
      window:'James Vick → Max Holloway',
      fights:[
        ['James Vick',1,0],['Edson Barboza',1,0],['Donald Cerrone',1,0],['Tony Ferguson',5,0],['Khabib Nurmagomedov',0,2],
        ['Michael Chandler',2,1],['Charles Oliveira',0,1],['Rafael Fiziev',2,1],['Dustin Poirier II',1,1],['Max Holloway',0,5]
      ],
      eliteStakesBreakdown:{titleFightWins:.75,topFiveWins:1,champFormerChampWins:1,fiveRoundTitleStageSample:.5,divisionStrengthContext:.25},
      dominanceProfile:'Violent lightweight contender prime with five finishes and strong recovery wins, offset by three decisive elite losses and only modest round-by-round control.'
    },
    'Israel Adesanya':{
      primeWins:8,primeLosses:4,primeDraws:0,primeNCs:0,primeFinishes:3,
      window:'Kelvin Gastelum → Dricus du Plessis',
      fights:[
        ['Kelvin Gastelum',4,1],['Robert Whittaker I',2,0],['Yoel Romero',3,2],['Paulo Costa',2,0],['Jan Blachowicz',2,3,'upward-division loss'],
        ['Marvin Vettori II',5,0],['Robert Whittaker II',3,2],['Jared Cannonier',4,1],['Alex Pereira I',3,2,'finish loss after leading'],
        ['Alex Pereira II',1,1],['Sean Strickland',1,4],['Dricus du Plessis',1,3,'submission loss in round four']
      ],
      eliteStakesBreakdown:{titleFightWins:2,topFiveWins:1.25,champFormerChampWins:.75,fiveRoundTitleStageSample:.5,divisionStrengthContext:.15},
      dominanceProfile:'Long middleweight title prime with excellent five-round proof and strong round control, but lower finish pressure and four elite losses inside the locked window.'
    },
    'Ronda Rousey':{
      primeWins:6,primeLosses:2,primeDraws:0,primeNCs:0,primeFinishes:6,
      window:'Liz Carmouche → Amanda Nunes',
      fights:[
        ['Liz Carmouche',1,0],['Miesha Tate II',3,0],['Sara McMann',1,0],['Alexis Davis',1,0],['Cat Zingano',1,0],['Bethe Correia',1,0],
        ['Holly Holm',0,2],['Amanda Nunes',0,1]
      ],
      eliteStakesBreakdown:{titleFightWins:2,topFiveWins:.75,champFormerChampWins:.5,fiveRoundTitleStageSample:.5,divisionStrengthContext:.15},
      dominanceProfile:'Explosive UFC title prime with six straight finishes and overwhelming early separation, now correctly carrying the Holm and Nunes losses inside the same canonical window.'
    },
    'Randy Couture':{
      primeWins:11,primeLosses:6,primeDraws:0,primeNCs:0,primeFinishes:7,
      window:'Vitor Belfort I → Brock Lesnar',
      fights:[
        ['Vitor Belfort I',1,0],['Maurice Smith',1,0,'legacy single long regulation segment'],['Kevin Randleman',1,2],
        ['Pedro Rizzo I',3,2],['Pedro Rizzo II',3,0],['Josh Barnett',1,1],['Ricco Rodriguez',3,2],['Chuck Liddell I',3,0],
        ['Tito Ortiz',5,0],['Vitor Belfort II',0,1,'cut stoppage'],['Vitor Belfort III',3,0],['Chuck Liddell II',0,1],
        ['Mike van Arsdale',2,1],['Chuck Liddell III',1,1],['Tim Sylvia',5,0],['Gabriel Gonzaga',3,0],['Brock Lesnar',1,1]
      ],
      eliteStakesBreakdown:{titleFightWins:2,topFiveWins:1,champFormerChampWins:.8,fiveRoundTitleStageSample:.35,divisionStrengthContext:.15},
      dominanceProfile:'Full UFC championship arc across heavyweight and light heavyweight: unusually strong round control and title-stage proof over a long interrupted span, balanced by six losses inside the locked prime window.'
    }
  };

  function round(value){return Math.round((Number(value||0)+Number.EPSILON)*100)/100;}
  function recordText(row){return `${row.primeWins}-${row.primeLosses}${row.primeDraws?`-${row.primeDraws}`:''}${row.primeNCs?`, ${row.primeNCs} NC`:''}`;}
  function finishScore(rate){return round((FINISH_SCALE.find(t=>rate>=t.min)||FINISH_SCALE[FINISH_SCALE.length-1]).score);}
  function buildEntry(fighter,row){
    const roundsWon=row.fights.reduce((sum,fight)=>sum+Number(fight[1]||0),0);
    const roundsLost=row.fights.reduce((sum,fight)=>sum+Number(fight[2]||0),0);
    const roundsCounted=roundsWon+roundsLost;
    const primeFights=Number(row.primeWins||0)+Number(row.primeLosses||0)+Number(row.primeDraws||0);
    const primeRecordPct=primeFights?((Number(row.primeWins||0)+(Number(row.primeDraws||0)*.5))/primeFights)*100:0;
    const primeRecordScore=round((primeRecordPct/100)*9);
    const roundControlPct=roundsCounted?round((roundsWon/roundsCounted)*100):0;
    const roundControlScore=round((roundControlPct/100)*8);
    const primeFinishRate=primeFights?round((Number(row.primeFinishes||0)/primeFights)*100):0;
    const finishPressureScore=finishScore(primeFights?Number(row.primeFinishes||0)/primeFights:0);
    const elite=row.eliteStakesBreakdown||{};
    const eliteStakesRawScore=round(Number(elite.titleFightWins||0)+Number(elite.topFiveWins||0)+Number(elite.champFormerChampWins||0)+Number(elite.fiveRoundTitleStageSample||0)+Number(elite.divisionStrengthContext||0));
    const eliteStakesScore=round(Math.min(8,Math.max(0,(eliteStakesRawScore/5)*8)));
    const total=round(primeRecordScore+roundControlScore+finishPressureScore+eliteStakesScore);
    return {
      fighter,primeRecord:recordText(row),primeWins:row.primeWins,primeLosses:row.primeLosses,primeDraws:row.primeDraws,primeNCs:row.primeNCs,
      primeRecordPct:round(primeRecordPct),primeRecordScore,roundControlPct,roundControlScore,
      roundControlAudit:{fighter,roundsWon,roundsLost,roundsCounted,roundControlPct,status:'locked',source:'audited canonical-window fight ledger',window:row.window,fights:row.fights},
      primeFights,primeFinishes:row.primeFinishes,primeFinishRate,finishPressureScore,
      eliteStakesBreakdown:elite,eliteStakesRawScore,eliteStakesScore,total,
      dominanceProfile:row.dominanceProfile,status:'locked',primeWindow:{...(era?.entryFor?.(fighter)?.window||{})},
      canonicalWindowRebuild:true,version:VERSION
    };
  }

  const entries=Object.fromEntries(Object.entries(RAW).map(([fighter,row])=>[fighter,buildEntry(fighter,row)]));
  const priorEntryFor=base.entryFor;
  const byName=new Map(base.report.map(entry=>[entry.fighter,entry]));
  Object.values(entries).forEach(entry=>byName.set(entry.fighter,entry));
  const report=[...byName.values()].sort((a,b)=>Number(b.total||0)-Number(a.total||0)||String(a.fighter).localeCompare(String(b.fighter)));
  base.entryFor=fighter=>entries[fighter]||priorEntryFor?.(fighter)||null;
  base.report=report;
  base.leaders=report.slice(0,15);
  base.auditBatchTen={version:VERSION,fighters:Object.keys(entries),entries,appliedAt:new Date().toISOString()};
  base.applied=Array.from(new Set([...(base.applied||[]),...Object.keys(entries)]));
  model.report=report;
  model.auditBatchTen=base.auditBatchTen;
  window.UFC_PRIME_DOMINANCE_AUDIT_BATCH_TEN=base.auditBatchTen;
  document.documentElement.setAttribute('data-prime-dominance-audit-batch-ten',VERSION);
})();

// Canonical Prime Dominance rebuild for Tito Ortiz, Alex Pereira, and Matt Hughes.
(function(){
  'use strict';
  const VERSION='prime-dominance-audit-batch-eleven-20260712a-hughes-calibration';
  const base=window.UFC_PRIME_DOMINANCE_LEDGERS;
  const model=window.UFC_PRIME_DOMINANCE_SHADOW_MODEL;
  const era=window.UFC_FIGHTER_ERA_LEDGERS;
  const roundAudit=window.UFC_PRIME_ROUND_CONTROL_AUDIT;
  if(!base||!Array.isArray(base.report)||!model)return;

  const finishScale=base.finishScale||[
    {min:.90,score:5},{min:.75,score:4.5},{min:.60,score:4},{min:.45,score:3},{min:.30,score:2},{min:.15,score:1},{min:0,score:.5}
  ];
  function round(value){return Math.round((Number(value||0)+Number.EPSILON)*100)/100;}
  function recordText(row){return `${row.primeWins}-${row.primeLosses}${row.primeDraws?`-${row.primeDraws}`:''}${row.primeNCs?`, ${row.primeNCs} NC`:''}`;}
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
    const finishRate=primeFights?Number(row.primeFinishes||0)/primeFights:0;
    const finishPressureScore=round((finishScale.find(tier=>finishRate>=tier.min)||finishScale[finishScale.length-1]).score);
    const elite=row.eliteStakesBreakdown||{};
    const eliteStakesRawScore=round(Number(elite.titleFightWins||0)+Number(elite.topFiveWins||0)+Number(elite.champFormerChampWins||0)+Number(elite.fiveRoundTitleStageSample||0)+Number(elite.divisionStrengthContext||0));
    const eliteStakesScore=round(Math.min(8,Math.max(0,(eliteStakesRawScore/5)*8)));
    const total=round(primeRecordScore+roundControlScore+finishPressureScore+eliteStakesScore);
    return {
      fighter,primeRecord:recordText(row),primeWins:row.primeWins,primeLosses:row.primeLosses,primeDraws:row.primeDraws,primeNCs:row.primeNCs,
      primeRecordPct:round(primeRecordPct),primeRecordScore,roundControlPct,roundControlScore,
      roundControlAudit:{fighter,roundsWon,roundsLost,roundsCounted,roundControlPct,status:'locked',source:'approved canonical-window fight ledger',window:row.window,fights:row.fights,version:VERSION},
      primeFights,primeFinishes:row.primeFinishes,primeFinishRate,finishPressureScore,
      eliteStakesBreakdown:elite,eliteStakesRawScore,eliteStakesScore,total,
      dominanceProfile:row.dominanceProfile,status:'locked',primeWindow:{...(era?.entryFor?.(fighter)?.window||{})},
      canonicalWindowRebuild:true,version:VERSION
    };
  }

  const RAW={
    'Tito Ortiz':{
      primeWins:11,primeLosses:3,primeDraws:0,primeNCs:0,primeFinishes:6,
      window:'Wanderlei Silva → Chuck Liddell II',
      fights:[['Wanderlei Silva',4,1],['Yuki Kondo',1,0],['Evan Tanner',1,0],['Elvis Sinosic',1,0],['Vladimir Matyushenko',4,1],['Ken Shamrock I',3,0],['Randy Couture',0,5],['Chuck Liddell I',0,2],['Patrick Cote',3,0],['Vitor Belfort',2,1],['Forrest Griffin I',2,1],['Ken Shamrock II',1,0],['Ken Shamrock III',1,0],['Chuck Liddell II',0,3]],
      eliteStakesBreakdown:{titleFightWins:2,topFiveWins:.8,champFormerChampWins:.5,fiveRoundTitleStageSample:.5,divisionStrengthContext:.1},
      dominanceProfile:'Full early-UFC light-heavyweight title and recovery window. Championship volume remains strong, but Couture and both Liddell losses plus only moderate round control cap the dominance score.'
    },
    'Alex Pereira':{
      primeWins:8,primeLosses:3,primeDraws:0,primeNCs:0,primeFinishes:7,
      window:'Sean Strickland → Ciryl Gane',
      fights:[['Sean Strickland',1,0],['Israel Adesanya I',2,3,'finish win after trailing'],['Israel Adesanya II',1,1,'finish loss'],['Jan Blachowicz',2,1],['Jiri Prochazka I',1,1],['Jamahal Hill',1,0],['Jiri Prochazka II',2,0],['Khalil Rountree Jr.',2,2],['Magomed Ankalaev I',2,3],['Magomed Ankalaev II',1,0],['Ciryl Gane',0,2,'upward-division finish loss']],
      eliteStakesBreakdown:{titleFightWins:1.5,topFiveWins:1,champFormerChampWins:1,fiveRoundTitleStageSample:.35,divisionStrengthContext:.2},
      dominanceProfile:'Explosive two-division championship prime with seven finishes, now fully carrying the Adesanya, Ankalaev, and Gane resistance inside the same canonical window.'
    },
    'Matt Hughes':{
      primeWins:13,primeLosses:3,primeDraws:0,primeNCs:0,primeFinishes:10,
      window:'Carlos Newton I → Georges St-Pierre III',
      fights:[['Carlos Newton I',1,1,'chaotic title-winning finish; low-confidence round split'],['Hayato Sakurai',4,0],['Carlos Newton II',4,0],['Gil Castillo',1,0],['Sean Sherk',4,1],['Frank Trigg I',1,0],['B.J. Penn I',0,1],['Renato Verissimo',2,1],['Georges St-Pierre I',1,0],['Frank Trigg II',1,0],['Joe Riggs',1,0],['Royce Gracie',1,0],['B.J. Penn II',1,2],['Georges St-Pierre II',0,2],['Chris Lytle',3,0],['Georges St-Pierre III',0,2]],
      eliteStakesBreakdown:{titleFightWins:2,topFiveWins:.9,champFormerChampWins:.5,fiveRoundTitleStageSample:.5,divisionStrengthContext:.1},
      dominanceProfile:'Long early-welterweight title prime beginning with Carlos Newton. The 13-3 record, strong control, and ten finishes remain fully credited, while old-era opponent depth prevents near-modern maximum elite-stakes validation.'
    }
  };

  const entries=Object.fromEntries(Object.entries(RAW).map(([fighter,row])=>[fighter,buildEntry(fighter,row)]));
  const priorEntryFor=base.entryFor;
  const byName=new Map(base.report.map(entry=>[entry.fighter,entry]));
  Object.values(entries).forEach(entry=>byName.set(entry.fighter,entry));
  const report=[...byName.values()].sort((a,b)=>Number(b.total||0)-Number(a.total||0)||String(a.fighter).localeCompare(String(b.fighter)));
  base.entryFor=fighter=>entries[fighter]||priorEntryFor?.(fighter)||null;
  base.report=report;
  base.leaders=report.slice(0,15);
  base.auditBatchEleven={version:VERSION,fighters:Object.keys(entries),entries,appliedAt:new Date().toISOString()};
  base.applied=Array.from(new Set([...(base.applied||[]),...Object.keys(entries)]));
  model.report=report;
  model.auditBatchEleven=base.auditBatchEleven;

  if(roundAudit){
    const priorRoundEntryFor=roundAudit.entryFor;
    const auditEntries=Object.fromEntries(Object.entries(entries).map(([fighter,entry])=>[fighter,entry.roundControlAudit]));
    roundAudit.entryFor=fighter=>auditEntries[fighter]||priorRoundEntryFor?.(fighter)||null;
    const byRoundName=new Map((roundAudit.report||[]).map(entry=>[entry.fighter,entry]));
    Object.values(auditEntries).forEach(entry=>byRoundName.set(entry.fighter,entry));
    roundAudit.report=[...byRoundName.values()].sort((a,b)=>Number(b.roundControlPct||0)-Number(a.roundControlPct||0)||String(a.fighter).localeCompare(String(b.fighter)));
    roundAudit.auditBatchEleven={version:VERSION,fighters:Object.keys(auditEntries),entries:auditEntries};
  }

  const data=window.RANKING_DATA||{};
  Object.values(entries).forEach(entry=>{
    const patch=row=>{if(row?.fighter===entry.fighter){row.primeRecord=entry.primeRecord;row.primeDominanceShadowAudit=entry;}};
    (data.men||[]).forEach(patch);(data.women||[]).forEach(patch);(data.fighters||[]).forEach(patch);
    if(data.primeRecords?.[entry.fighter])data.primeRecords[entry.fighter]={...data.primeRecords[entry.fighter],record:entry.primeRecord,primeDominanceRebuildVersion:VERSION};
    if(typeof DISPLAY_OVERRIDES!=='undefined'){
      DISPLAY_OVERRIDES[entry.fighter]=DISPLAY_OVERRIDES[entry.fighter]||{};
      DISPLAY_OVERRIDES[entry.fighter].snapshotStats={...(DISPLAY_OVERRIDES[entry.fighter].snapshotStats||{}),primeRecord:entry.primeRecord,primeDominanceShadow:entry.total,primeFinishRate:`${entry.primeFinishRate}%`,roundControl:`${entry.roundControlPct}%`,dominanceProfile:entry.dominanceProfile};
    }
  });
  window.UFC_PRIME_DOMINANCE_AUDIT_BATCH_ELEVEN=base.auditBatchEleven;
  document.documentElement.setAttribute('data-prime-dominance-audit-batch-eleven',VERSION);
})();
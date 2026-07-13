// Audited UFC records, complete loss ledgers, and canonical prime windows for the eight-fighter batch.
(function(){
  'use strict';
  const BASE=window.UFC_CANONICAL_FIGHTER_REGISTRY;
  const DATA=window.RANKING_DATA;
  const F=window.UFC_BATCH_EIGHT_FIGHTER_DATA;
  const VERSION='canonical-fighter-registry-batch-eight-audit-fixes-20260712b';
  if(!BASE||!DATA||!Array.isArray(F)) return;

  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const names=new Set(F.map(f=>key(f.name)));
  const overrides=()=>window.DISPLAY_OVERRIDES||(typeof DISPLAY_OVERRIDES!=='undefined'?DISPLAY_OVERRIDES:null);
  const rowsFor=name=>[...(DATA.men||[]),...(DATA.fighters||[])].filter(row=>key(row?.fighter)===key(name));

  function methodFor(type){
    if(String(type).includes('finish')) return 'Finish';
    if(String(type).includes('decision')) return 'Decision';
    return undefined;
  }
  function event(row){
    return {label:row[0],opponent:row[0],type:row[1],date:row[2],method:methodFor(row[1])};
  }
  function eraFor(f){
    const losses=(f.losses||[]).slice().sort((a,b)=>String(a[2]||'').localeCompare(String(b[2]||'')));
    const pre=losses.filter(row=>row[1].includes('pre-prime'));
    const upward=losses.filter(row=>row[1].includes('upward-division'));
    const post=losses.filter(row=>row[1].includes('post-prime'));
    const prime=losses.filter(row=>row[1].includes('prime')&&!row[1].includes('pre-prime')&&!row[1].includes('post-prime')&&!row[1].includes('upward-division'));
    const unrecovered=prime.length?event(prime[prime.length-1]):null;
    const recovered=[...pre,...prime.slice(0,-1)].map(event);
    return {
      status:'locked',
      window:{
        start:f.primeStart,
        startLabel:f.primeStartLabel,
        end:f.primeEnd,
        endLabel:f.primeEndLabel,
        endReason:'Canonical UFC-only prime endpoint for this fighter audit.',
        canonical:true,
        locked:true,
        lockVersion:VERSION
      },
      lossContext:{
        unrecoveredLoss:unrecovered,
        recoveredLosses:recovered,
        upwardDivisionLosses:upward.map(event),
        postPrimeLosses:post.map(event),
        weirdResults:(f.weirdResults||[]).map(event)
      },
      longevity:{
        gapCapMonths:18,
        activeEliteYears:f.years,
        statusMultiplier:1,
        divisionMultiplier:f.mult,
        adjustmentNote:'Active elite UFC years only; gaps capped at 18 months.',
        canonicalWindowRecalculated:true,
        canonicalWindowRecalculationVersion:VERSION
      },
      divisionStrengthContext:`${f.label} multiplier ${Number(f.mult).toFixed(2)}.`,
      lossContextCompletion:{version:VERSION,machineReadable:true,completeUfcLossLedger:true,source:`${f.name} audited UFC-only ledger`}
    };
  }
  function primeAuditFor(f,prior={}){
    const era=eraFor(f);
    return {
      ...prior,
      fighter:f.name,
      primeRecord:f.prime,
      roundControlPct:f.rounds,
      primeFinishRate:f.finish,
      total:f.c[2],
      primeWindow:{...era.window},
      roundControlAudit:{...(prior.roundControlAudit||{}),fighter:f.name,roundControlPct:f.rounds,status:'locked',source:'Audited UFC fight-level control estimate',version:VERSION},
      status:'locked',
      version:VERSION
    };
  }
  function applyRows(){
    const store=overrides();
    F.forEach(f=>{
      const era=eraFor(f);
      rowsFor(f.name).forEach(row=>{
        row.ufcRecord=f.record;
        row.primeRecord=f.prime;
        row.finishRatePct=f.finish;
        row.roundsWonPct=f.rounds;
        row.activeEliteYears=f.years;
        row.timesFinishedPrime=f.stopped;
        row.eliteWins=f.elite;
        row.elitePlusWins=f.elite;
        row.topFivePlusWins=f.top5;
        row.rankedQualityWins=f.ranked;
        row.primeDominanceLiveAudit=primeAuditFor(f,row.primeDominanceLiveAudit||row.primeDominanceShadowAudit||{});
        row.primeDominanceShadowAudit=row.primeDominanceLiveAudit;
      });
      DATA.primeRecords=DATA.primeRecords||{};
      DATA.primeRecords[f.name]={record:f.prime,context:`${f.primeStartLabel} → ${f.primeEndLabel}`,wins:Number(f.prime.split('-')[0])||0,losses:Number(f.prime.split('-')[1])||0,source:'Audited UFC-only prime record',sourceVersion:VERSION,eraWindowLocked:true};
      const eraStore=window.UFC_FIGHTER_ERA_LEDGERS;
      if(eraStore?.ledgers){
        eraStore.ledgers[f.name]=era;
        eraStore.fighters=Array.from(new Set([...(eraStore.fighters||[]),f.name]));
      }
      const display=store?.[f.name];
      if(display){
        const stats={ufcRecord:f.record,primeRecord:f.prime,finishRatePct:f.finish,roundsWonPct:f.rounds,activeEliteYears:f.years,timesFinishedPrime:f.stopped,eliteWins:f.elite,elitePlusWins:f.elite,topFivePlusWins:f.top5,rankedQualityWins:f.ranked};
        display.snapshotStats={...(display.snapshotStats||{}),...stats};
        display.packetProfileStats={...(display.packetProfileStats||{}),...stats};
        display.snapshot=[['UFC Record',f.record],['UFC Title-Fight Wins',String(f.titles)],['Elite / Top-5 Wins',`${f.elite} / ${f.top5}`],['Prime Record',f.prime],['Finish Rate',`${f.finish}%`],['Rounds Won',`${f.rounds}%`],['Active Elite Years',Number(f.years).toFixed(2)],['Prime Stoppage Losses',String(f.stopped)]];
      }
      const compare=window.COMPARE_PROFILES?.[f.name];
      if(compare) compare.legacyStats={...(compare.legacyStats||{}),ufcRecord:f.record,primeNote:f.prime,eliteWins:f.elite,elitePlusWins:f.elite,topFivePlusWins:f.top5};
    });
    return true;
  }
  function patchPrimeStore(){
    const store=window.UFC_PRIME_DOMINANCE_LEDGERS;
    if(!store) return;
    const map=new Map(F.map(f=>[key(f.name),primeAuditFor(f,rowsFor(f.name)[0]?.primeDominanceLiveAudit||{})]));
    const old=store.entryFor;
    if(!store.__batchEightAudited){
      store.entryFor=name=>map.get(key(name))||(typeof old==='function'?old(name):null);
      store.__batchEightAudited=true;
    }
    store.report=Array.isArray(store.report)?store.report:[];
    for(const audit of map.values()){
      const index=store.report.findIndex(row=>key(row?.fighter)===key(audit.fighter));
      if(index<0) store.report.push(audit); else store.report[index]=audit;
    }
    store.report.sort((a,b)=>Number(b.total||0)-Number(a.total||0));
  }
  function rerank(){
    DATA.men.sort((a,b)=>Number(b.totalScore||0)-Number(a.totalScore||0)||String(a.fighter).localeCompare(String(b.fighter)));
    DATA.men.forEach((row,index)=>row.rank=index+1);
  }
  function result(stage,base){
    applyRows();
    patchPrimeStore();
    rerank();
    return {applied:Boolean(base?.applied),stage,version:`${BASE.version}+${VERSION}`,fighters:Array.from(new Set([...(BASE.fighters||[]),...F.map(f=>f.name)])),base,error:base?.error||null};
  }

  applyRows();
  window.UFC_BATCH_EIGHT_AUDIT_FIXES={version:VERSION,fighters:F.map(f=>f.name),apply:applyRows,eraFor,names:[...names],applied:true};
  window.UFC_CANONICAL_FIGHTER_REGISTRY={
    ...BASE,
    version:`${BASE.version}+${VERSION}`,
    fighters:Array.from(new Set([...(BASE.fighters||[]),...F.map(f=>f.name)])),
    registerBase(){return result('registerBase',BASE.registerBase());},
    applyChampionship(){return result('applyChampionship',BASE.applyChampionship());},
    applyOpponentQuality(){return result('applyOpponentQuality',BASE.applyOpponentQuality());},
    applyPrimeDominance(){const output=result('applyPrimeDominance',BASE.applyPrimeDominance());patchPrimeStore();return output;},
    applyApexPeak(){return result('applyApexPeak',BASE.applyApexPeak());},
    finalize(){const output=result('finalize',BASE.finalize());window.UFC_DYNAMIC_ROSTER_RUNTIME?.sync?.('batch-eight-audit-finalize');return output;}
  };
  document.documentElement.setAttribute('data-batch-eight-audit-fixes-ready',VERSION);
})();

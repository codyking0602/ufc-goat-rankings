// Final audited UFC records, complete loss ledgers, prime metrics, and direct-fight context for the eight-fighter batch.
(function(){
  'use strict';
  const BASE=window.UFC_CANONICAL_FIGHTER_REGISTRY;
  const DATA=window.RANKING_DATA;
  const F=window.UFC_BATCH_EIGHT_FIGHTER_DATA;
  const VERSION='canonical-fighter-registry-batch-eight-audit-fixes-20260712c-final-record-recount';
  if(!BASE||!DATA||!Array.isArray(F)) return;

  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const names=new Set(F.map(f=>key(f.name)));
  const overrides=()=>window.DISPLAY_OVERRIDES||(typeof DISPLAY_OVERRIDES!=='undefined'?DISPLAY_OVERRIDES:null);
  const rowsFor=name=>[...(DATA.men||[]),...(DATA.fighters||[])].filter(row=>key(row?.fighter)===key(name));
  const round2=value=>Math.round((Number(value||0)+Number.EPSILON)*100)/100;

  function methodFor(type){
    const text=String(type||'').toLowerCase();
    if(text.includes('finish')) return 'Finish';
    if(text.includes('decision')) return 'Decision';
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
    const statusMultiplier=1;
    const divisionMultiplier=Number(f.mult||1);
    const longevityScore=Number(f.c?.[3]||0);
    const gapAdjustedMonths=divisionMultiplier>0?round2((longevityScore/30)*144/statusMultiplier/divisionMultiplier):round2(Number(f.years||0)*12);
    return {
      status:'locked',
      window:{
        start:f.primeStart,startLabel:f.primeStartLabel,end:f.primeEnd,endLabel:f.primeEndLabel,
        endReason:'Canonical UFC-only prime endpoint for this fighter audit.',canonical:true,locked:true,lockVersion:VERSION
      },
      lossContext:{
        unrecoveredLoss:unrecovered,recoveredLosses:recovered,upwardDivisionLosses:upward.map(event),
        postPrimeLosses:post.map(event),weirdResults:(f.weirdResults||[]).map(event)
      },
      longevity:{
        gapCapMonths:18,gapAdjustedMonths,activeEliteYears:Number(f.years||0),statusMultiplier,divisionMultiplier,
        adjustmentNote:'Active elite UFC years only; gaps capped at 18 months.',
        note:'Final audited batch-eight longevity input.',canonicalWindowRecalculated:true,
        canonicalWindowRecalculationVersion:VERSION,calculationAsOf:'2026-07-12'
      },
      divisionStrengthContext:`${f.label} multiplier ${divisionMultiplier.toFixed(2)}.`,
      lossContextCompletion:{version:VERSION,machineReadable:true,completeUfcLossLedger:true,bucketReconciled:true,source:`${f.name} audited UFC-only ledger`}
    };
  }
  function primeAuditFor(f,prior={}){
    const era=eraFor(f);
    const primeWins=Number(f.primeWins??String(f.prime||'').split('-')[0]||0);
    const primeLosses=Number(f.primeLosses??String(f.prime||'').split('-')[1]||0);
    const primeDraws=Number(f.primeDraws||0);
    const primeFights=primeWins+primeLosses+primeDraws;
    const primeFinishes=Number(f.primeFinishes||0);
    const primeFinishRate=Number(f.primeFinish??(primeFights?round2(primeFinishes/primeFights*100):0));
    const recordPct=primeFights?round2((primeWins+primeDraws*.5)/primeFights*100):0;
    return {
      ...prior,fighter:f.name,primeRecord:f.prime,primeWins,primeLosses,primeDraws,primeNCs:0,
      primeRecordPct:recordPct,roundControlPct:Number(f.rounds||0),primeFights,primeFinishes,primeFinishRate,
      total:Number(f.c?.[2]||0),primeWindow:{...era.window},
      roundControlAudit:{
        ...(prior.roundControlAudit||{}),fighter:f.name,roundControlPct:Number(f.rounds||0),status:'locked',
        source:'Audited UFC fight-level control estimate',window:`${f.primeStartLabel} → ${f.primeEndLabel}`,version:VERSION
      },
      dominanceProfile:f.one,status:'locked',version:VERSION
    };
  }
  function setFight(a,b,fights,winner,summary,importance='major'){
    window.COMPARE_FIGHT_LEDGER=window.COMPARE_FIGHT_LEDGER||{};
    const pair=[key(a),key(b)].sort().join('|');
    window.COMPARE_FIGHT_LEDGER[pair]={fighters:[a,b],fights,winner,importance,summary};
  }
  function patchDirectFightLedger(){
    setFight('Benson Henderson','Frankie Edgar',2,'Benson Henderson','Henderson won both UFC lightweight title fights, although the rematch remains debated.');
    setFight('Fabricio Werdum','Cain Velasquez',1,'Fabricio Werdum','Werdum submitted Velasquez to unify the UFC heavyweight title.');
    setFight('Fabricio Werdum','Stipe Miocic',1,'Stipe Miocic','Miocic knocked Werdum out to win the heavyweight title.');
    setFight('Glover Teixeira','Jon Jones',1,'Jon Jones','Jones defeated Glover over five rounds in a light-heavyweight title fight.');
    setFight('Glover Teixeira','Rashad Evans',1,'Glover Teixeira','Glover knocked Rashad out in the first round.','notable');
    setFight('Frank Shamrock','Tito Ortiz',1,'Frank Shamrock','Frank stopped Tito late at UFC 22 in his defining final title defense.');
    setFight('Vitor Belfort','Randy Couture',3,'Randy Couture','Couture won the UFC trilogy 2-1; Belfort’s title win came from an early glove-seam cut.');
    setFight('Vitor Belfort','Dan Henderson',2,'Vitor Belfort','Belfort won both UFC meetings. Their earlier PRIDE fight is excluded.');
    setFight('Vitor Belfort','Anderson Silva',1,'Anderson Silva','Silva knocked out Belfort with the iconic front kick in their middleweight title fight.');
    setFight('Vitor Belfort','Jon Jones',1,'Jon Jones','Jones survived Belfort’s early armbar threat and submitted him in their title fight.');
    setFight('Mauricio "Shogun" Rua','Lyoto Machida',2,'Split','Machida won the disputed first decision; Shogun knocked him out in the rematch to win the title.');
    setFight('Mauricio "Shogun" Rua','Forrest Griffin',2,'Split','Forrest submitted Shogun in 2007; Shogun avenged it by first-round knockout in 2011.');
    setFight('Mauricio "Shogun" Rua','Dan Henderson',2,'Dan Henderson','Henderson won both UFC meetings, including their Hall of Fame five-round war.');
    setFight('Mauricio "Shogun" Rua','Jon Jones',1,'Jon Jones','Jones stopped Shogun to win the light-heavyweight championship.');
    setFight('Forrest Griffin','Rashad Evans',1,'Rashad Evans','Evans stopped Griffin in the third round to win the light-heavyweight title.');
    setFight('Forrest Griffin','Anderson Silva',1,'Anderson Silva','Silva knocked Griffin out in one of the clearest striking-separation performances in UFC history.');
    setFight('Forrest Griffin','Tito Ortiz',3,'Forrest Griffin','Forrest won the UFC trilogy 2-1.');
    setFight('Rashad Evans','Jon Jones',1,'Jon Jones','Jones beat former teammate Evans by five-round decision in a title defense.');
    setFight('Rashad Evans','Chuck Liddell',1,'Rashad Evans','Evans knocked Liddell out with a defining right hand.');
    setFight('Rashad Evans','Tito Ortiz',2,'Rashad Evans','Their first bout was a draw after a point deduction; Rashad stopped Tito in the rematch.');
    return true;
  }
  function applyRows(){
    const store=overrides();
    F.forEach(f=>{
      const era=eraFor(f);
      const primeAudit=primeAuditFor(f,rowsFor(f.name)[0]?.primeDominanceLiveAudit||rowsFor(f.name)[0]?.primeDominanceShadowAudit||{});
      rowsFor(f.name).forEach(row=>{
        row.ufcRecord=f.record;row.primeRecord=f.prime;row.finishRatePct=f.finish;row.roundsWonPct=f.rounds;
        row.activeEliteYears=f.years;row.timesFinishedPrime=f.stopped;row.primeStoppageLosses=f.stopped;
        row.eliteWins=f.elite;row.elitePlusWins=f.elite;row.topFiveWins=f.top5;row.topFivePlusWins=f.top5;
        row.rankedQualityWins=f.ranked;row.primeDominanceLiveAudit=primeAudit;row.primeDominanceShadowAudit=primeAudit;
      });
      DATA.primeRecords=DATA.primeRecords||{};
      DATA.primeRecords[f.name]={
        record:f.prime,context:`${f.primeStartLabel} → ${f.primeEndLabel}`,
        wins:primeAudit.primeWins,losses:primeAudit.primeLosses,draws:primeAudit.primeDraws,ncs:0,
        source:'Audited UFC-only prime record',sourceVersion:VERSION,eraWindowLocked:true,primeDominanceRebuildVersion:VERSION
      };
      const eraStore=window.UFC_FIGHTER_ERA_LEDGERS;
      if(eraStore?.ledgers){eraStore.ledgers[f.name]=era;eraStore.fighters=Array.from(new Set([...(eraStore.fighters||[]),f.name]));}
      const display=store?.[f.name];
      if(display){
        const stats={
          ufcRecord:f.record,primeRecord:f.prime,finishRatePct:f.finish,roundsWonPct:f.rounds,activeEliteYears:f.years,
          timesFinishedPrime:f.stopped,primeStoppageLosses:f.stopped,eliteWins:f.elite,elitePlusWins:f.elite,
          topFiveWins:f.top5,topFivePlusWins:f.top5,rankedQualityWins:f.ranked
        };
        display.snapshotStats={...(display.snapshotStats||{}),...stats};
        display.packetProfileStats={...(display.packetProfileStats||{}),...stats};
        display.snapshot=[
          ['UFC Record',f.record],['UFC Title-Fight Wins',String(f.titles)],['Elite / Top-5 Wins',String(f.elite)],
          ['Prime Record',f.prime],['Finish Rate',`${f.finish}%`],['Rounds Won',`${f.rounds}%`],
          ['Active Elite Years',Number(f.years).toFixed(2)],['Prime Stoppage Losses',String(f.stopped)]
        ];
      }
      const compare=window.COMPARE_PROFILES?.[f.name];
      if(compare)compare.legacyStats={
        ...(compare.legacyStats||{}),ufcRecord:f.record,primeNote:f.prime,timesFinishedPrime:f.stopped,
        primeStoppageLosses:f.stopped,eliteWins:f.elite,elitePlusWins:f.elite,topFiveWins:f.top5,topFivePlusWins:f.top5
      };
    });
    patchDirectFightLedger();
    return true;
  }
  function patchPrimeStore(){
    const store=window.UFC_PRIME_DOMINANCE_LEDGERS;
    if(!store) return;
    const map=new Map(F.map(f=>[key(f.name),primeAuditFor(f,rowsFor(f.name)[0]?.primeDominanceLiveAudit||{})]));
    const old=store.entryFor;
    if(!store.__batchEightFinalAudit){
      store.entryFor=name=>map.get(key(name))||(typeof old==='function'?old(name):null);
      store.__batchEightFinalAudit=true;
    }
    store.report=Array.isArray(store.report)?store.report:[];
    for(const audit of map.values()){
      const index=store.report.findIndex(row=>key(row?.fighter)===key(audit.fighter));
      if(index<0)store.report.push(audit);else store.report[index]=audit;
    }
    store.report.sort((a,b)=>Number(b.total||0)-Number(a.total||0));
    store.leaders=store.report.slice(0,15);
  }
  function rerank(){
    DATA.men.sort((a,b)=>Number(b.totalScore||0)-Number(a.totalScore||0)||String(a.fighter).localeCompare(String(b.fighter)));
    DATA.men.forEach((row,index)=>row.rank=index+1);
  }
  function result(stage,base){
    applyRows();patchPrimeStore();rerank();
    return {applied:Boolean(base?.applied),stage,version:`${BASE.version}+${VERSION}`,fighters:Array.from(new Set([...(BASE.fighters||[]),...F.map(f=>f.name)])),base,error:base?.error||null};
  }

  applyRows();
  window.UFC_BATCH_EIGHT_AUDIT_FIXES={version:VERSION,fighters:F.map(f=>f.name),apply:applyRows,eraFor,primeAuditFor,patchDirectFightLedger,names:[...names],applied:true};
  window.UFC_CANONICAL_FIGHTER_REGISTRY={
    ...BASE,version:`${BASE.version}+${VERSION}`,fighters:Array.from(new Set([...(BASE.fighters||[]),...F.map(f=>f.name)])),
    registerBase(){return result('registerBase',BASE.registerBase());},
    applyChampionship(){return result('applyChampionship',BASE.applyChampionship());},
    applyOpponentQuality(){return result('applyOpponentQuality',BASE.applyOpponentQuality());},
    applyPrimeDominance(){const output=result('applyPrimeDominance',BASE.applyPrimeDominance());patchPrimeStore();return output;},
    applyApexPeak(){return result('applyApexPeak',BASE.applyApexPeak());},
    finalize(){const output=result('finalize',BASE.finalize());window.UFC_DYNAMIC_ROSTER_RUNTIME?.sync?.('batch-eight-final-audit');return output;}
  };
  document.documentElement.setAttribute('data-batch-eight-audit-fixes-ready',VERSION);
})();

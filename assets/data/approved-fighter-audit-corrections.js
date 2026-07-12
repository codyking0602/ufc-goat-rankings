// Cody-approved targeted fighter audit corrections.
// Keeps canonical era, opponent-quality, Prime Dominance, and app-facing cleanup in one permanent pass.
(function(){
  'use strict';

  const VERSION='approved-fighter-audit-corrections-20260712d-cruz-tate-ilia-deiveson';
  const DATA=window.RANKING_DATA;
  const ERA=window.UFC_FIGHTER_ERA_LEDGERS;
  const ERA_LEDGERS=ERA?.ledgers;

  if(!DATA||!ERA_LEDGERS){
    window.UFC_APPROVED_FIGHTER_AUDIT_CORRECTIONS={
      version:VERSION,
      applied:false,
      error:'Missing RANKING_DATA or UFC_FIGHTER_ERA_LEDGERS.'
    };
    return;
  }

  function key(value){
    return String(value||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  }
  function round2(value){
    return Math.round((Number(value||0)+Number.EPSILON)*100)/100;
  }
  function allRowsFor(name){
    const target=key(name);
    const rows=[];
    const push=row=>{if(row&&key(row.fighter)===target)rows.push(row);};
    (DATA.men||[]).forEach(push);
    (DATA.women||[]).forEach(push);
    (DATA.fighters||[]).forEach(push);
    return rows;
  }
  function displayOverrides(){
    if(typeof window.DISPLAY_OVERRIDES!=='undefined')return window.DISPLAY_OVERRIDES;
    if(typeof DISPLAY_OVERRIDES!=='undefined')return DISPLAY_OVERRIDES;
    return null;
  }
  function patchDisplay(name,patch){
    const overrides=displayOverrides();
    if(!overrides)return;
    overrides[name]=overrides[name]||{};
    const target=overrides[name];
    if(patch.fields)Object.assign(target,patch.fields);
    target.snapshotStats={...(target.snapshotStats||{}),...(patch.snapshotStats||{})};
    const rows=Array.isArray(target.snapshot)?target.snapshot.slice():[];
    (patch.replacements||[]).forEach(([label,value,tests])=>{
      const index=rows.findIndex(item=>Array.isArray(item)&&tests.some(test=>test.test(String(item[0]||''))));
      if(index>=0)rows[index]=[label,value];
      else rows.push([label,value]);
    });
    target.snapshot=rows;
    if(patch.compare){
      target.compareProfile={...(target.compareProfile||{}),...patch.compare};
      window.COMPARE_PROFILES=window.COMPARE_PROFILES||{};
      window.COMPARE_PROFILES[name]={...(window.COMPARE_PROFILES[name]||{}),...patch.compare};
    }
  }
  function packetFor(name){
    return window.UFC_FIGHTER_PACKETS?.[name]||null;
  }
  function patchPacket(name,patch){
    const packet=packetFor(name);
    if(!packet)return;
    if(patch.profileStats)packet.profileStats={...(packet.profileStats||{}),...patch.profileStats};
    if(patch.display){
      packet.display={...(packet.display||{}),...patch.display};
      if(patch.display.snapshotStats)packet.display.snapshotStats={...(packet.display.snapshotStats||{}),...patch.display.snapshotStats};
    }
    if(patch.compare)packet.compareSeasoning={...(packet.compareSeasoning||{}),...patch.compare};
  }
  function patchReport(report,fighter,value){
    if(!Array.isArray(report))return;
    const existing=report.find(row=>row?.fighter===fighter);
    if(existing)Object.assign(existing,value);
    else report.push(value);
  }

  const tito=ERA_LEDGERS['Tito Ortiz'];
  if(tito){
    tito.status='locked';
    tito.window={...(tito.window||{}),end:'2006-12-30',endLabel:'Chuck Liddell II',endType:'unrecovered_elite_loss',endReason:'Tito re-proved elite form after Chuck I with wins over Patrick Cote, Vitor Belfort, and Forrest Griffin before returning to a UFC title fight. Chuck II is the unrecovered endpoint.',canonical:true,locked:true,lockVersion:VERSION};
    tito.longevity={...(tito.longevity||{}),gapCapMonths:18,gapAdjustedMonths:80.5,activeEliteYears:6.71,statusMultiplier:1.08,divisionMultiplier:1,adjustmentNote:'Wanderlei Silva through Chuck Liddell II. No elite-fight gap exceeded the universal 18-month cap.',note:'Full early-UFC light-heavyweight title and recovery window through the 2006 title rematch.',windowLockedPendingRecalculation:false};
    tito.lossContext={
      recoveredLosses:[
        {label:'Guy Mezger I',date:'1997-05-30',type:'pre-prime non-elite finish loss',method:'Submission',notes:'Tournament loss before the Wanderlei Silva prime start.'},
        {label:'Frank Shamrock',date:'1999-09-24',type:'pre-prime elite title finish loss',method:'TKO',notes:'Title loss before the canonical prime window.'},
        {label:'Randy Couture',date:'2003-09-26',type:'prime elite title decision loss',method:'Decision',recovery:'Tito remained elite and entered the Chuck Liddell rivalry/title path.'},
        {label:'Chuck Liddell I',date:'2004-04-02',type:'prime elite finish loss',method:'TKO',recovery:'Tito rebounded with Cote, Belfort, Forrest Griffin, and another UFC title fight.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Chuck Liddell II',date:'2006-12-30',type:'prime elite title finish loss',method:'TKO',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Lyoto Machida',date:'2008-05-24',type:'post-prime elite decision loss',method:'Decision'},
        {label:'Forrest Griffin II',date:'2009-11-21',type:'post-prime decision loss',method:'Decision'},
        {label:'Matt Hamill',date:'2010-10-23',type:'post-prime decision loss',method:'Decision'},
        {label:'Rashad Evans II',date:'2011-08-06',type:'post-prime elite finish loss',method:'TKO'},
        {label:'Antonio Rogerio Nogueira',date:'2011-12-10',type:'post-prime finish loss',method:'TKO'},
        {label:'Forrest Griffin III',date:'2012-07-07',type:'post-prime decision loss',method:'Decision'}
      ],
      weirdResults:[]
    };
    tito.windowDecision={approved:true,approvedBy:'Cody',decision:'extended-and-locked',rationale:'Chuck I did not end the prime because Tito re-proved elite UFC form and returned to a title fight. Chuck II is the proper endpoint.',version:VERSION,dependentRebuildRequired:false};
    tito.lossContextCompletion={...(tito.lossContextCompletion||{}),version:VERSION,batch:'approved-audit-correction',machineReadable:true,completeUfcLossLedger:true,source:'Cody-approved canonical era and loss audit',completedAt:new Date().toISOString()};
  }

  const tate=ERA_LEDGERS['Miesha Tate'];
  if(tate){
    tate.status='locked';
    tate.window={...(tate.window||{}),start:'2014-04-19',startLabel:'Liz Carmouche',end:'2016-07-09',endLabel:'Amanda Nunes',endType:'unrecovered_elite_loss',endReason:'Liz Carmouche begins the coherent UFC title climb; Amanda Nunes is the unrecovered prime-ending title loss.',canonical:true,locked:true,lockVersion:VERSION};
    tate.longevity={...(tate.longevity||{}),gapCapMonths:18,gapAdjustedMonths:26.7,activeEliteYears:2.23,statusMultiplier:1.03,divisionMultiplier:0.95,adjustmentNote:'Liz Carmouche through Amanda Nunes.',note:'Short but coherent UFC title-climb window; Strikeforce remains excluded.',windowLockedPendingRecalculation:false};
    tate.notes='UFC-only prime now consistently begins with Liz Carmouche and ends with Amanda Nunes.';
    tate.windowDecision={approved:true,approvedBy:'Cody',decision:'start-extended-and-locked',rationale:'Carmouche and Nakai are part of the same uninterrupted UFC title climb that led to McMann, Eye, and the Holm championship win.',version:VERSION,dependentRebuildRequired:false};
  }

  if(ERA.canonicalWindowLock){
    ERA.canonicalWindowLock.changedWindowFighters=Array.from(new Set([...(ERA.canonicalWindowLock.changedWindowFighters||[]),'Tito Ortiz','Miesha Tate']));
    ERA.canonicalWindowLock.version=VERSION;
  }

  const PRIME_RECORD_CORRECTIONS={
    'Tito Ortiz':{record:'11-3',reason:'Wanderlei Silva through Chuck Liddell II, inclusive.'},
    'Alex Pereira':{record:'8-3',reason:'Sean Strickland through Ciryl Gane, inclusive.'},
    'Matt Hughes':{record:'13-3',reason:'Carlos Newton I through Georges St-Pierre III, inclusive.'},
    'Kamaru Usman':{record:'8-2',reason:'Demian Maia through Leon Edwards III, inclusive.'},
    'Stipe Miocic':{record:'8-2',reason:'Mark Hunt through Francis Ngannou II, inclusive.'},
    'Daniel Cormier':{record:'8-3',reason:'Dan Henderson through Stipe Miocic III, inclusive; Jon Jones I is counted.'},
    'Dominick Cruz':{record:'5-2',reason:'Urijah Faber II through Henry Cejudo, inclusive; Garbrandt and Cejudo are counted.'},
    'Miesha Tate':{record:'5-1',reason:'Liz Carmouche through Amanda Nunes, inclusive.'},
    'Ilia Topuria':{record:'5-1',reason:'Bryce Mitchell through Charles Oliveira, inclusive; the Gaethje loss is counted.'},
    'Deiveson Figueiredo':{record:'7-3-1',reason:'Joseph Benavidez I through Petr Yan, inclusive.'}
  };

  DATA.primeRecords=DATA.primeRecords||{};
  Object.entries(PRIME_RECORD_CORRECTIONS).forEach(([fighter,input])=>{
    DATA.primeRecords[fighter]={...(DATA.primeRecords[fighter]||{}),record:input.record,source:'Cody-approved canonical fight-window recount',sourceVersion:VERSION,approvedReason:input.reason};
    allRowsFor(fighter).forEach(row=>{row.primeRecord=input.record;row.primeRecordContext=input.reason;});
    patchDisplay(fighter,{snapshotStats:{primeRecord:input.record,primeRecordContext:input.reason}});
  });

  patchDisplay('Tito Ortiz',{snapshotStats:{activeEliteYears:6.71,roundsWonPct:62.16,lossContextScore:-9.5},replacements:[['Active Elite Years','6.7 Elite Years',[/active elite years/i,/elite years/i]],['Rounds Won','62.2% best-effort',[/rounds won/i,/round control/i]],['Loss Context','-9.50',[/loss context/i,/penalty/i]]]});
  patchDisplay('Alex Pereira',{snapshotStats:{activeEliteYears:4,roundsWonPct:53.57},replacements:[['Active Elite Years','4.0 Elite Years',[/active elite years/i,/elite years/i]]]});
  patchDisplay('Matt Hughes',{snapshotStats:{roundsWonPct:71.43}});
  patchDisplay('Dominick Cruz',{snapshotStats:{titleFightWins:4,primeRecord:'5-2',activeEliteYears:6.5,roundsWonPct:67.86},replacements:[['UFC Title-Fight Wins','4',[/title[-\s]*fight wins/i]],['Active Elite Years','6.5 Elite Years',[/active elite years/i,/elite years/i]],['Rounds Won','67.9% best-effort',[/rounds won/i,/round control/i]],['Loss Context','Two counted elite prime losses; injuries are handled in Longevity',[/loss context/i,/penalty/i]]],fields:{whyNotHigher:'He does not rank higher because this is UFC-only, the WEC reign is excluded, and injury gaps limit active elite years. Garbrandt and Cejudo are counted inside the UFC prime window.'},compare:{longevity:'Cruz stayed title-relevant over a long calendar span, but capped injury gaps limit active elite years.',weakness:'The WEC/UFC scoring boundary and injury-fragmented active years keep the résumé below deeper UFC title runs.'}});
  patchDisplay('Miesha Tate',{snapshotStats:{primeRecord:'5-1',activeEliteYears:2.23,roundsWonPct:55.56},replacements:[['Active Elite Years','2.2 Elite Years',[/active elite years/i,/elite years/i]],['Rounds Won','55.6% best-effort',[/rounds won/i,/round control/i]]]});
  patchDisplay('Ilia Topuria',{snapshotStats:{primeRecord:'5-1',activeEliteYears:3.58,roundsWonPct:80.95},replacements:[['Active Elite Years','3.6 Elite Years',[/active elite years/i,/elite years/i]],['Rounds Won','81.0% best-effort',[/rounds won/i,/round control/i]]]});
  patchDisplay('Deiveson Figueiredo',{snapshotStats:{primeRecord:'7-3-1',activeEliteYears:4.73,roundsWonPct:53.03},replacements:[['Active Elite Years','4.7 Elite Years',[/active elite years/i,/elite years/i]],['Rounds Won','53.0% best-effort',[/rounds won/i,/round control/i]],['Loss Context','Petr Yan is the counted late-prime endpoint',[/loss context/i,/penalty/i]]]});
  patchDisplay('B.J. Penn',{fields:{oneLiner:'The brilliant-but-messy skill case: two-division UFC gold, the Hughes upset, and an elite peak limited by counted prime losses and a shorter elite window than the longest-reign legends.',whyNotHigher:'He does not rank higher because his counted pre-prime and prime losses, uneven prime results, and shorter elite window trail the cleaner long-reign champions. Post-prime losses are context only under the current model.'},compare:{shortCase:'B.J. Penn is the skill-and-two-division legacy case: lightweight dominance, the Hughes welterweight upset, and an uneven prime that trails cleaner long-reign champions.',resume:'Penn’s UFC case has enormous highs. The current model does not punish the post-prime collapse; his ceiling comes from counted prime resistance and limited sustained elite volume.',longevity:'Penn’s true elite window was strong but shorter than the decade-level cases. Later fights are post-prime context, not additional Loss Context damage.',weakness:'Counted prime losses and limited sustained elite volume keep the ranking below cleaner champions.'}});
  patchDisplay('Jessica Andrade',{snapshotStats:{activeEliteYears:5.41,apexPeak:3.25},replacements:[['Active Elite Years','5.4 Elite Years',[/active elite years/i,/elite years/i]],['Apex Peak','+3.25',[/apex peak/i]]],fields:{oneLiner:'A former UFC strawweight champion with deep win volume, cross-division relevance, and a messy but legitimate UFC-only résumé.'}});

  patchPacket('Dominick Cruz',{profileStats:{titleFightWins:4,primeRecord:'5-2',activeEliteYears:6.5,roundsWonPct:67.86,lossContext:'Garbrandt and Cejudo are counted prime elite losses. Injury gaps reduce Longevity rather than adding Loss Context damage.'},display:{whyNotHigher:'He does not rank higher because this is UFC-only, the WEC reign is excluded, and injury gaps limit active elite years. Garbrandt and Cejudo are counted inside the UFC prime window.'},compare:{longevity:'Cruz stayed title-relevant over a long calendar span, but capped injury gaps limit active elite years.',weakness:'The WEC/UFC scoring boundary and injury-fragmented active years keep the résumé below deeper UFC title runs.'}});
  patchPacket('Miesha Tate',{profileStats:{primeRecord:'5-1',activeEliteYears:2.23,roundsWonPct:55.56},compare:{primeSummary:'5-1 UFC prime from Liz Carmouche through Amanda Nunes, built around the Holm title win.'}});
  patchPacket('Ilia Topuria',{profileStats:{primeRecord:'5-1',activeEliteYears:3.58,roundsWonPct:80.95},compare:{primeSummary:'A 5-1 current title-level prime from Bryce Mitchell through the Charles Oliveira win, with the Gaethje loss counted.'}});
  patchPacket('Deiveson Figueiredo',{profileStats:{primeRecord:'7-3-1',activeEliteYears:4.73,roundsWonPct:53.03,lossContext:'The Moreno losses and Petr Yan endpoint are counted inside the prime; later bantamweight decline is post-prime.'},compare:{primeSummary:'A 7-3-1 title-level window from Benavidez I through Petr Yan, combining the Moreno rivalry with late bantamweight elite proof.',weakness:'Moreno rivalry losses, the Yan endpoint, and flyweight division strength cap the case.'}});
  patchPacket('B.J. Penn',{display:{oneLiner:'The brilliant-but-messy skill case: two-division UFC gold, the Hughes upset, and an elite peak limited by counted prime losses and a shorter elite window than the longest-reign legends.',whyNotHigher:'He does not rank higher because his counted pre-prime and prime losses, uneven prime results, and shorter elite window trail the cleaner long-reign champions. Post-prime losses are context only under the current model.'},compare:{shortCase:'B.J. Penn is the skill-and-two-division legacy case: lightweight dominance, the Hughes welterweight upset, and an uneven prime that trails cleaner long-reign champions.',resume:'Penn’s UFC case has enormous highs. The current model does not punish the post-prime collapse; his ceiling comes from counted prime resistance and limited sustained elite volume.',longevity:'Penn’s true elite window was strong but shorter than the decade-level cases. Later fights are post-prime context, not additional Loss Context damage.',weakness:'Counted prime losses and limited sustained elite volume keep the ranking below cleaner champions.'}});
  patchPacket('Jessica Andrade',{profileStats:{activeEliteYears:5.41,apexPeak:3.25},display:{oneLiner:'A former UFC strawweight champion with deep win volume, cross-division relevance, and a messy but legitimate UFC-only résumé.',apexPeakSummary:{score:3.25,window:'Claudia Gadelha 2017 through Rose Namajunas title win',components:{peakStatus:.75,eliteOpponentProof:1,separationDominance:.75,divisionStrength:.5,cleanApexAura:.25},notes:'Canonical Apex Peak score. Real champion power peak, capped by no defenses and Zhang/Valentina ceilings.'}}});

  allRowsFor('Jessica Andrade').forEach(row=>{row.activeEliteYears=5.41;});
  allRowsFor('Miesha Tate').forEach(row=>{row.activeEliteYears=2.23;});
  allRowsFor('Dominick Cruz').forEach(row=>{row.activeEliteYears=6.5;});
  allRowsFor('Ilia Topuria').forEach(row=>{row.activeEliteYears=3.58;});
  allRowsFor('Deiveson Figueiredo').forEach(row=>{row.activeEliteYears=4.73;});

  function updateOpponentQualitySurfaces(fighter,shadow,live){
    const summary=shadow.summaryFor(fighter);
    const benchmark=Number(live.benchmarkCredit||14.1);
    const liveScore=round2(Math.min(30,Math.max(0,(Number(summary.diminishedCredit||0)/benchmark)*30)));
    const liveSummary={...summary,liveScore,categoryScore:liveScore,benchmarkCredit:benchmark,sourceBenchmarkCredit:live.sourceBenchmarkCredit,approvedCorrectionVersion:VERSION};
    patchReport(shadow.report,fighter,{...summary,approvedCorrectionVersion:VERSION});
    shadow.report.sort((a,b)=>Number(b.diminishedCredit||0)-Number(a.diminishedCredit||0)||Number(b.rawCredit||0)-Number(a.rawCredit||0)||String(a.fighter).localeCompare(String(b.fighter)));
    shadow.leaders=shadow.report.slice(0,15).map(row=>({fighter:row.fighter,rawCredit:row.rawCredit,diminishedCredit:row.diminishedCredit,elitePlusWins:row.elitePlusWins,topFivePlusWins:row.topFivePlusWins,rankedQualityWins:row.rankedQualityWins,winProfile:row.winProfile}));
    patchReport(live.report,fighter,liveSummary);
    live.report.sort((a,b)=>Number(b.liveScore||0)-Number(a.liveScore||0)||Number(b.diminishedCredit||0)-Number(a.diminishedCredit||0)||String(a.fighter).localeCompare(String(b.fighter)));
    live.leaders=live.report.slice(0,20).map(row=>({fighter:row.fighter,liveScore:row.liveScore,diminishedCredit:row.diminishedCredit,elitePlusWins:row.elitePlusWins,topFivePlusWins:row.topFivePlusWins,winProfile:row.winProfile}));
    live.approvedCorrectionVersion=VERSION;
    allRowsFor(fighter).forEach(row=>{
      row.opponentQualityLegacy=row.opponentQualityLegacy??row.opponentQuality;
      row.opponentQuality=liveScore;
      row.opponentQualityLive=true;
      row.opponentQualityLiveAudit={...liveSummary,sourceMode:'approved-canonical-correction',writerMode:'category-only',version:VERSION};
      row.opponentQualityShadowAudit={...summary,sourceMode:'approved-canonical-correction',version:VERSION};
      row.elitePlusWins=summary.elitePlusWins;
      row.topFivePlusWins=summary.topFivePlusWins;
      row.rankedQualityWins=summary.rankedQualityWins;
      row.winProfile=summary.winProfile;
    });
    patchDisplay(fighter,{snapshotStats:{elitePlusWins:summary.elitePlusWins,topFivePlusWins:summary.topFivePlusWins,rankedQualityWins:summary.rankedQualityWins,bestQualityWins:(summary.bestWins||[]).slice(0,5).join(', '),winProfile:summary.winProfile,opponentQualityScore:liveScore},replacements:[['Elite+ / Top-5+ Wins',`${summary.elitePlusWins} / ${summary.topFivePlusWins}`,[/elite\+?\s*\/\s*top[-\s]*5/i,/quality wins/i,/opponent quality/i]],['Win Profile',summary.winProfile,[/win profile/i,/resume shape/i,/quality type/i]]]});
    return {fighter,diminishedCredit:summary.diminishedCredit,liveScore,summary};
  }

  function applyOpponentQualityCorrection(){
    const store=window.UFC_OPPONENT_QUALITY_LEDGERS;
    const shadow=window.UFC_OPPONENT_QUALITY_SHADOW_AUDIT;
    const live=window.UFC_OPPONENT_QUALITY_LIVE;
    if(!store?.raw||!shadow?.summaryFor||!live?.report)return{applied:false,reason:'Opponent Quality chain not ready.'};
    const changed=[];
    function patchRaw(fighter,opponent,credit,tier,context,status='locked'){
      const rows=store.raw[fighter];
      if(!Array.isArray(rows))return false;
      const row=rows.find(item=>Array.isArray(item)&&key(item[0])===key(opponent));
      if(!row)return false;
      row[1]=credit;row[2]=tier;row[3]=context;row[4]=status;
      changed.push({fighter,opponent,credit});
      return true;
    }
    const kaylaRows=store.raw['Kayla Harrison'];
    if(Array.isArray(kaylaRows)){
      const julia=kaylaRows.find(item=>Array.isArray(item)&&item[0]==='Julia Avila');
      const pena=kaylaRows.find(item=>Array.isArray(item)&&key(item[0])===key('Julianna Peña'));
      if(julia){julia[0]='Julianna Peña';julia[1]=1.25;julia[2]='Champion-level win';julia[3]='Submitted the reigning UFC bantamweight champion to win the title.';julia[4]='locked';}
      else if(pena){pena[1]=1.25;pena[2]='Champion-level win';pena[3]='Submitted the reigning UFC bantamweight champion to win the title.';pena[4]='locked';}
      else kaylaRows.push(['Julianna Peña',1.25,'Champion-level win','Submitted the reigning UFC bantamweight champion to win the title.','locked']);
      changed.push({fighter:'Kayla Harrison',opponent:'Julianna Peña',credit:1.25});
    }
    patchRaw('Kamaru Usman','Leon Edwards I',0.45,'Solid resume win','Early UFC win before Edwards became an elite contender; future championship success is not back-credited.');
    patchRaw('Stipe Miocic','Daniel Cormier III',1.00,'True top-5 win','Elite trilogy win, discounted from maximum credit for repeat-opponent, age, and final-fight context.');
    patchRaw('Daniel Cormier','Anthony Johnson II',1.00,'True top-5 win','Elite title-defense rematch, with repeat-opponent discount from the first Rumble win.');
    patchRaw('Miesha Tate','Sara McMann',0.85,'Strong top-10 win','Strong ranked bantamweight contender during Tate’s title climb.');
    patchRaw('Miesha Tate','Liz Carmouche',0.65,'Ranked / quality win','Former UFC title challenger and the start of Tate’s coherent UFC prime climb.');
    patchRaw('Miesha Tate','Jessica Eye',0.65,'Ranked / quality win','Ranked bantamweight contender win immediately before the Holm title shot.');
    const fighters=Array.from(new Set(changed.map(item=>item.fighter)));
    const results=fighters.map(fighter=>updateOpponentQualitySurfaces(fighter,shadow,live));
    if(DATA.meta?.opponentQualityLive)DATA.meta.opponentQualityLive.approvedCorrectionVersion=VERSION;
    const result={applied:true,fighters,changed,results,masvidalCreditsChanged:false,version:VERSION,appliedAt:new Date().toISOString()};
    window.UFC_APPROVED_OPPONENT_QUALITY_CORRECTIONS=result;
    return result;
  }

  function finishScore(rate,scale){
    const fallback=[{min:.75,score:5},{min:.60,score:4.5},{min:.45,score:4},{min:.30,score:3},{min:.15,score:2},{min:0,score:1}];
    const tiers=Array.isArray(scale)&&scale.length?scale:fallback;
    return round2((tiers.find(tier=>rate>=Number(tier.min||0))||tiers[tiers.length-1]).score);
  }

  function applyPrimeDominanceCorrection(){
    if(window.__UFC_APPROVED_PRIME_CORRECTION_VERSION===VERSION)return window.UFC_APPROVED_PRIME_DOMINANCE_CORRECTIONS||{applied:true,idempotent:true};
    const ledgers=window.UFC_PRIME_DOMINANCE_LEDGERS;
    const model=window.UFC_PRIME_DOMINANCE_SHADOW_MODEL;
    if(!ledgers?.entryFor||!Array.isArray(ledgers.report)||!model)return{applied:false,reason:'Prime Dominance chain not ready.'};
    const corrections={
      'Kamaru Usman':{record:'8-2',wins:8,losses:2,fights:10,reason:'Canonical Demian Maia through Leon Edwards III prime window.'},
      'Stipe Miocic':{record:'8-2',wins:8,losses:2,fights:10,reason:'Canonical Mark Hunt through Francis Ngannou II prime window.'},
      'Daniel Cormier':{record:'8-3',wins:8,losses:3,fights:11,reason:'Canonical Dan Henderson through Stipe Miocic III window, including Jon Jones I.'},
      'Dominick Cruz':{record:'5-2',wins:5,losses:2,draws:0,fights:7,roundsWon:19,roundsCounted:28,finishes:1,reason:'UFC-only Faber II through Cejudo window; Garbrandt and Cejudo are fully counted.'},
      'Miesha Tate':{record:'5-1',wins:5,losses:1,draws:0,fights:6,roundsWon:10,roundsCounted:18,finishes:1,reason:'Liz Carmouche through Amanda Nunes title-climb window.'},
      'Ilia Topuria':{record:'5-1',wins:5,losses:1,draws:0,fights:6,roundsWon:17,roundsCounted:21,finishes:3,reason:'Bryce Mitchell through Charles Oliveira; Charles is added as a five-round decision win.'},
      'Deiveson Figueiredo':{record:'7-3-1',wins:7,losses:3,draws:1,fights:11,roundsWon:17.5,roundsCounted:33,finishes:4,reason:'Benavidez I through Petr Yan, including the bantamweight wins and Yan endpoint.'}
    };
    const results=[];
    Object.entries(corrections).forEach(([fighter,input])=>{
      const entry=ledgers.entryFor(fighter);
      if(!entry)return;
      const draws=Number(input.draws??entry.primeDraws??0);
      const pct=input.fights?((input.wins+(draws*.5))/input.fights)*100:0;
      const recordScore=round2((pct/100)*9);
      const roundsWon=Number(input.roundsWon??entry.roundControlAudit?.roundsWon??0);
      const roundsCounted=Number(input.roundsCounted??entry.roundControlAudit?.roundsCounted??0);
      const roundControlPct=roundsCounted?round2((roundsWon/roundsCounted)*100):Number(entry.roundControlPct||0);
      const roundControlScore=round2((roundControlPct/100)*8);
      const primeFinishes=Number(input.finishes??entry.primeFinishes??0);
      const finishRate=input.fights?primeFinishes/input.fights:0;
      const pressureScore=finishScore(finishRate,ledgers.finishScale);
      const total=round2(recordScore+roundControlScore+pressureScore+Number(entry.eliteStakesScore||0));
      Object.assign(entry,{primeRecord:input.record,primeWins:input.wins,primeLosses:input.losses,primeDraws:draws,primeFights:input.fights,primeFinishes,primeRecordPct:round2(pct),primeRecordScore:recordScore,roundControlPct,roundControlScore,roundControlAudit:{...(entry.roundControlAudit||{}),fighter,roundsWon,roundsCounted,roundControlPct,status:'locked',version:VERSION},primeFinishRate:round2(finishRate*100),finishPressureScore:pressureScore,total,status:'locked',approvedAuditCorrection:true,approvedAuditReason:input.reason,version:VERSION});
      patchReport(ledgers.report,fighter,entry);
      patchReport(model.report,fighter,entry);
      if(Array.isArray(window.UFC_PRIME_DOMINANCE_LIVE_PROMOTER?.report))patchReport(window.UFC_PRIME_DOMINANCE_LIVE_PROMOTER.report,fighter,entry);
      if(Array.isArray(window.UFC_PRIME_ROUND_CONTROL_AUDIT?.report))patchReport(window.UFC_PRIME_ROUND_CONTROL_AUDIT.report,fighter,entry.roundControlAudit);
      allRowsFor(fighter).forEach(row=>{
        row.primeRecord=input.record;
        row.primeRecordContext=input.reason;
        row.roundsWonPct=roundControlPct;
        row.primeDominance=total;
        row.primeDominanceShadowAudit={...entry};
        row.primeDominanceLive=true;
        row.primeDominanceLiveAudit={...entry,sourceMode:'approved-canonical-correction',version:VERSION};
      });
      DATA.primeRecords[fighter]={...(DATA.primeRecords[fighter]||{}),record:input.record,source:'Cody-approved canonical fight-window recount',sourceVersion:VERSION,approvedReason:input.reason};
      patchDisplay(fighter,{snapshotStats:{primeRecord:input.record,roundsWonPct:roundControlPct,primeDominanceShadow:total,primeFinishRate:`${round2(finishRate*100)}%`,primeRecordContext:input.reason},replacements:[['Rounds Won',`${roundControlPct.toFixed(1)}% best-effort`,[/rounds won/i,/round control/i]]]});
      results.push({fighter,primeRecord:input.record,primeDominance:total,primeRecordScore:recordScore,roundControlPct,finishPressureScore:pressureScore});
    });
    ledgers.report.sort((a,b)=>Number(b.total||0)-Number(a.total||0)||String(a.fighter).localeCompare(String(b.fighter)));
    ledgers.leaders=ledgers.report.slice(0,15);
    model.report=ledgers.report;
    window.__UFC_APPROVED_PRIME_CORRECTION_VERSION=VERSION;
    const finalScoreResult=window.UFC_FINAL_SCORE_ENGINE?.apply?.('approved-six-fighter-audit-corrections')||null;
    const overrides=displayOverrides();
    if(overrides){
      [...(DATA.men||[]),...(DATA.women||[])].forEach(row=>{
        if(!row?.fighter)return;
        overrides[row.fighter]=overrides[row.fighter]||{};
        overrides[row.fighter].allTimeRank=row.rank;
        overrides[row.fighter].rank=row.rank;
        overrides[row.fighter].overallOvr=row.overallOvr;
        overrides[row.fighter].totalScore=row.totalScore;
        overrides[row.fighter].rawScore=row.rawScore;
      });
    }
    if(typeof window.refresh==='function'){try{window.refresh();}catch(error){}}
    const result={applied:true,fighters:Object.keys(corrections),results,finalScoreResult,version:VERSION,appliedAt:new Date().toISOString()};
    window.UFC_APPROVED_PRIME_DOMINANCE_CORRECTIONS=result;
    document.documentElement.setAttribute('data-approved-prime-dominance-corrections',VERSION);
    return result;
  }

  const API={
    version:VERSION,
    applied:true,
    eraCorrections:['Tito Ortiz','Miesha Tate'],
    primeRecordCorrections:Object.keys(PRIME_RECORD_CORRECTIONS),
    opponentQualityCorrections:['Kayla Harrison','Kamaru Usman','Stipe Miocic','Daniel Cormier','Miesha Tate'],
    primeDominanceCorrections:['Kamaru Usman','Stipe Miocic','Daniel Cormier','Dominick Cruz','Miesha Tate','Ilia Topuria','Deiveson Figueiredo'],
    profileCopyCorrections:['Dominick Cruz','Miesha Tate','Ilia Topuria','Deiveson Figueiredo','B.J. Penn','Jessica Andrade'],
    masvidalCreditsChanged:false,
    applyOpponentQualityCorrection,
    applyPrimeDominanceCorrection,
    appliedAt:new Date().toISOString()
  };
  window.UFC_APPROVED_FIGHTER_AUDIT_CORRECTIONS=API;
  DATA.meta=DATA.meta||{};
  DATA.meta.approvedFighterAuditCorrections={version:VERSION,eraCorrections:API.eraCorrections,primeRecordCorrections:API.primeRecordCorrections,opponentQualityCorrections:API.opponentQualityCorrections,primeDominanceCorrections:API.primeDominanceCorrections,profileCopyCorrections:API.profileCopyCorrections,masvidalCreditsChanged:false,appliedAt:API.appliedAt};
  const applyPrime=()=>applyPrimeDominanceCorrection();
  if(window.UFC_SCORING_PIPELINE?.status==='ready')setTimeout(applyPrime,0);
  else window.addEventListener('ufc-scoring-pipeline-ready',applyPrime,{once:true});
  document.documentElement.setAttribute('data-approved-fighter-audit-corrections',VERSION);
})();

// Permanent Royce Gracie registry layered onto the post-refactor canonical fighter registry.
(function(){
  'use strict';

  const BASE=window.UFC_CANONICAL_FIGHTER_REGISTRY;
  if(!BASE){
    console.error('Royce Gracie registry requires the base canonical fighter registry.');
    return;
  }

  const VERSION='canonical-fighter-registry-royce-gracie-20260712a';
  const NAME='Royce Gracie';
  const DATA=window.RANKING_DATA;
  const CHAMPIONSHIP_SCORE=4.85;
  const OPPONENT_QUALITY_SCORE=8.75;
  const PRIME_DOMINANCE_SCORE=24.93;
  const LONGEVITY_SCORE=2.84;
  const APEX_PEAK_SCORE=5.40;
  const LOSS_CONTEXT_SCORE=0;
  const ERA_DEPTH_ADJUSTMENT=-3.00;
  const EXPECTED_TOTAL=39.88;

  const TITLE_WINS=[
    {opponent:'Gerard Gordeau',event:'UFC 1',date:'1993-11-12',titleType:'tournament',strength:0.75,adjustedCredit:0.75,reviewStatus:'locked',notes:'Won the inaugural UFC tournament. Discounted because the competitive ecosystem was still embryonic.'},
    {opponent:'Patrick Smith',event:'UFC 2',date:'1994-03-11',titleType:'tournament',strength:0.65,adjustedCredit:0.65,reviewStatus:'locked',notes:'Won a four-fight one-night tournament. Field-depth discount applied.'},
    {opponent:'Dan Severn',event:'UFC 4',date:'1994-12-16',titleType:'tournament',strength:0.95,adjustedCredit:0.95,reviewStatus:'locked',notes:'Strongest tournament championship win: submitted an elite wrestler and future UFC champion.'}
  ];

  const QUALITY=[
    ['Ken Shamrock',1.00,'True top-5 era win','Submitted the clearest other elite fighter in the UFC 1 field.','locked'],
    ['Dan Severn',1.00,'True top-5 era win','Elite wrestler, UFC 4 finalist, and future UFC champion.','locked'],
    ['Kimo Leopoldo',0.60,'Ranked / quality win','Royce survived his most physically punishing early-UFC test and secured the submission.','locked'],
    ['Gerard Gordeau',0.55,'Ranked / quality win','UFC 1 finalist with legitimate striking credentials.','locked'],
    ['Keith Hackney',0.45,'Solid resume win','Credible early-UFC tournament semifinal opponent.','locked'],
    ['Jason DeLucia',0.40,'Solid resume win','Experienced early mixed-style opponent with prior Gracie challenge context.','locked'],
    ['Patrick Smith',0.40,'Solid resume win','UFC 2 finalist with dangerous kickboxing and submission experience.','locked'],
    ['Remco Pardoel',0.30,'Supporting win','Large judo and jiu-jitsu opponent in the UFC 2 field.','locked'],
    ['Ron van Clief',0.20,'Supporting win','Veteran martial artist; heavily discounted competitive value.','locked'],
    ['Minoki Ichihara',0.20,'Supporting win','Opening-round UFC 2 victory; limited elite validation.','locked'],
    ['Art Jimmerson',0.15,'Supporting win','Foundational UFC 1 victory with minimal modern resume value.','locked']
  ];

  // Early UFC bouts had no conventional rounds. Each prime bout is represented as one control unit.
  // The UFC 5 draw is split 0.5/0.5 rather than presented as a won round.
  const CONTROL_UNITS=[
    ['Art Jimmerson','1993-11-12',1,0,'Submission win; UFC 1 quarterfinal'],
    ['Ken Shamrock','1993-11-12',1,0,'Submission win; UFC 1 semifinal'],
    ['Gerard Gordeau','1993-11-12',1,0,'Submission win; UFC 1 final'],
    ['Minoki Ichihara','1994-03-11',1,0,'Submission win; UFC 2 opening round'],
    ['Jason DeLucia','1994-03-11',1,0,'Submission win; UFC 2 quarterfinal'],
    ['Remco Pardoel','1994-03-11',1,0,'Submission win; UFC 2 semifinal'],
    ['Patrick Smith','1994-03-11',1,0,'Submission win; UFC 2 final'],
    ['Kimo Leopoldo','1994-09-09',1,0,'Submission win; UFC 3 opening round'],
    ['Ron van Clief','1994-12-16',1,0,'Submission win; UFC 4 quarterfinal'],
    ['Keith Hackney','1994-12-16',1,0,'Submission win; UFC 4 semifinal'],
    ['Dan Severn','1994-12-16',1,0,'Submission win; UFC 4 final'],
    ['Ken Shamrock','1995-04-07',0.5,0.5,'Time-limit draw; UFC 5 Superfight']
  ];

  const COMPARE={
    shortCase:'Royce is the UFC foundation case: three tournament victories, an 11-0-1 prime, and complete submission dominance before modern divisions or title structures existed.',
    peak:'At his UFC best, Royce repeatedly beat multiple larger specialists in one night, then submitted Dan Severn from underneath to win his third tournament.',
    resume:'His UFC résumé is 11-1-1 with three tournament championships, eleven submission wins, and a 36-minute draw with Ken Shamrock before a post-prime return against Matt Hughes.',
    championship:'Three tournament wins create real championship substance, but every tournament receives a major early-era discount rather than being treated like a modern title defense.',
    opponentQuality:'Ken Shamrock and Dan Severn anchor the ledger. The remaining wins are historically important but come from a shallow, undeveloped opponent pool.',
    longevity:'His meaningful elite UFC window lasted only about 1.4 years from UFC 1 through UFC 5. The 2006 Hughes return does not create extra longevity credit.',
    counter:'The strongest argument for Royce is foundational dominance: he did exactly what the original UFC was designed to test and changed how fighting was understood.',
    edge:'Royce wins comparisons when unmatched tournament dominance and historical proof outweigh modern depth, longevity, and championship structure.',
    scope:'PRIDE, K-1, Bellator, and non-UFC Gracie accomplishments are context only and do not add points.',
    eliteCounter:true,
    signatureWins:'Dan Severn, Ken Shamrock, Gerard Gordeau, Patrick Smith, and Kimo Leopoldo.',
    weakness:'Embryonic competition, no modern title-defense run, very short elite UFC longevity, and only two clearly elite era wins.',
    titleSummary:'Won UFC 1, UFC 2, and UFC 4. Tournament crowns are scored with heavy era and field-depth discounts.',
    primeSummary:'11-0-1 from UFC 1 through the UFC 5 Shamrock draw; Matt Hughes is post-prime.',
    titleStyle:'foundationalTournamentKing',
    primeStyle:'noRoundSubmissionDominance',
    legacyStats:{ufcRecord:'11-1-1',titleFightWins:3,adjustedTitleWins:2.35,beltsWon:3,titleDefenses:0,activeEliteYearsLabel:'roughly 1.4 active elite years',primeNote:'UFC 1 through UFC 5; no-round era control model; Hughes loss post-prime'}
  };

  const BOARD={
    fighter:NAME,totalScore:EXPECTED_TOTAL,championship:CHAMPIONSHIP_SCORE,opponentQuality:OPPONENT_QUALITY_SCORE,
    primeDominance:PRIME_DOMINANCE_SCORE,longevity:LONGEVITY_SCORE,longevityThirtyPoint:true,apexPeak:APEX_PEAK_SCORE,
    penalty:LOSS_CONTEXT_SCORE,eraDepthAdjustment:ERA_DEPTH_ADJUSTMENT,leaderboard:'men',gender:'Men',ufcRecord:'11-1-1',
    primaryDivision:'Openweight',secondaryDivision:'Welterweight',finishRatePct:100,activeEliteYears:1.40,timesFinishedPrime:0,
    primeRecord:'11-0-1',roundsWonPct:95.83,
    notes:'Three-time UFC tournament winner. Early-UFC field depth, no modern title structure, and short elite longevity are heavily discounted.'
  };

  const PROFILE={
    id:'RG001',...BOARD,scope:'UFC',ufcWins:11,ufcLosses:1,ufcDraws:1,ufcNoContests:0,scoredUfcFights:13,
    finishWins:11,lossPenalty:0,primeStart:'Art Jimmerson — UFC 1 (1993)',primeEnd:'Ken Shamrock II — UFC 5 (1995)',
    primeRecordContext:'UFC 1 → UFC 5',
    title:{normalTitleWins:0,interimTitleWins:0,vacantUndisputedWins:0,secondDivisionUndisputedWins:0,vacantSecondDivisionWins:0,tournamentWins:3,titleFightWins:3,adjustedTitleWins:2.35,notes:'UFC 1, UFC 2, and UFC 4 tournament championships. Scored below modern title wins because the sport, field, and championship structure were undeveloped.'},
    opponents:QUALITY.map(row=>({opponent:row[0],division:'Openweight',credit:row[1],type:row[2],context:row[3]})),
    rounds:CONTROL_UNITS.map(row=>({opponent:row[0],date:row[1],roundsWon:row[2],roundsLost:row[3],roundsCounted:row[2]+row[3],method:row[4],basis:'No-round-era control unit',confidence:'Medium'})),
    notes:'UFC-only scoring. Early tournament accomplishments are counted, but PRIDE, K-1, Bellator, and broader Gracie legacy are excluded from the score.'
  };

  const DISPLAY={
    divisionLabel:'OPEN / WW',
    resumeTag:'Three-time UFC tournament winner',
    oneLiner:'The UFC’s foundational tournament king: three tournament wins and an 11-0-1 prime, heavily capped by embryonic-era depth and only 1.4 elite UFC years.',
    snapshot:[
      ['UFC Record','11-1-1'],
      ['UFC Tournament Wins','3'],
      ['Adjusted Tournament Credit','2.35'],
      ['Prime Record','11-0-1'],
      ['Prime Control','11 wins, 1 draw — no-round era'],
      ['UFC Win Finish Rate','100% (11/11)'],
      ['Active Elite Years','1.40'],
      ['Apex Peak','+5.40'],
      ['Loss Context','0.00'],
      ['Era Depth','-3.00']
    ],
    snapshotStats:{
      ufcRecord:'11-1-1',titleFightWins:3,adjustedTitleWins:2.35,primeRecord:'11-0-1',roundsWonPct:95.83,
      finishRatePct:100,primeFinishRatePct:91.67,activeEliteYears:1.40,apexPeak:5.40,lossContext:0,
      eraDepthAdjustment:-3.00,bestQualityWins:'Ken Shamrock, Dan Severn, Kimo Leopoldo, Gerard Gordeau'
    },
    whyRankedHere:'Royce earns a real UFC GOAT placement because he won three of the first four UFC tournaments, started 11-0-1, finished every UFC victory, and proved jiu-jitsu against larger specialists in the format the original UFC was built to test.',
    whyNotHigher:'The field was embryonic, most opponents were not complete mixed martial artists, the tournaments are not equivalent to modern title defenses, and his elite UFC window lasted only about 1.4 years. The model also applies the maximum -3.00 era-depth adjustment.',
    bigAssumptions:[
      ['Tournament treatment','UFC 1, UFC 2, and UFC 4 receive 0.75, 0.65, and 0.95 adjusted championship credits rather than full modern title-win value.'],
      ['Prime window','UFC 1 through the UFC 5 Shamrock draw. Matt Hughes in 2006 is fully post-prime.'],
      ['No-round era','Prime control uses one control unit per bout. The UFC 5 draw is split 0.5/0.5 and carries a confidence discount.'],
      ['Division strength','The original openweight era receives a direct -3.00 era-depth adjustment and a 0.75 Longevity multiplier.'],
      ['Scope','Only UFC bouts count. Broader Gracie-family impact and non-UFC fights are context only.']
    ],
    keyJudgmentCalls:[
      ['Dan Severn','Royce’s strongest signature win and the highest-valued tournament championship.'],
      ['Ken Shamrock series','The UFC 1 submission is a full elite-era win; the UFC 5 time-limit draw is neutral, not a loss.'],
      ['Matt Hughes loss','Post-prime with no Loss Context penalty. It remains part of the UFC record but not the prime window.'],
      ['Historical impact','Acknowledged in profile copy and Apex Peak, but not used as a free-standing résumé bonus.'],
      ['Photos','No photo paths are hardcoded until real Royce Gracie WebP files exist.']
    ],
    compareProfile:COMPARE
  };

  const ERA={
    status:'locked',
    window:{
      start:'1993-11-12',startLabel:'Art Jimmerson',end:'1995-04-07',endLabel:'Ken Shamrock II',endType:'time_limit_draw',
      endReason:'The UFC 5 draw closes Royce’s continuous elite UFC tournament era. His next UFC appearance came more than eleven years later against Matt Hughes.',
      canonical:true,locked:true,lockVersion:VERSION
    },
    lossContext:{
      unrecoveredLoss:null,recoveredLosses:[],upwardDivisionLosses:[],
      postPrimeLosses:[{label:'Matt Hughes',date:'2006-05-27',type:'post-prime elite loss',method:'TKO',reason:'Returned to the UFC more than eleven years after UFC 5 against the reigning welterweight champion.'}],
      weirdResults:[{label:'Ken Shamrock II',date:'1995-04-07',result:'draw',treatment:'Time-limit draw with no judges. No loss penalty.'}]
    },
    longevity:{
      gapCapMonths:18,gapAdjustedMonths:16.79,activeEliteYears:1.40,statusMultiplier:1.08,divisionMultiplier:0.75,
      adjustmentNote:'UFC 1 through UFC 5 with no gap exceeding the universal 18-month cap.',
      note:'Tournament-champion status boost is offset by a major embryonic-era division multiplier.',
      windowLockedPendingRecalculation:false,canonicalWindowRecalculated:true,canonicalWindowRecalculationVersion:VERSION,calculationAsOf:'2026-07-12'
    },
    notes:'UFC-only tournament-era window.',
    lossContextCompletion:{version:VERSION,batch:'canonical-fighter-registry',machineReadable:true,completeUfcLossLedger:true,source:'Royce Gracie UFC-only audit',completedAt:new Date().toISOString()}
  };

  const PRIME={
    fighter:NAME,primeRecord:'11-0-1',primeWins:11,primeLosses:0,primeDraws:1,primeNCs:0,primeRecordPct:95.83,
    primeRecordScore:8.63,roundControlPct:95.83,roundControlScore:7.00,
    roundControlAudit:{
      fighter:NAME,roundsWon:11.5,roundsLost:0.5,roundsCounted:12,roundControlPct:95.83,status:'locked',
      source:'No-round-era bout-control audit',window:'UFC 1 (1993) → UFC 5 (1995)',
      fights:CONTROL_UNITS.map(row=>[row[0],row[2],row[3],row[4]]),
      notes:'Early UFC bouts did not use conventional rounds. One control unit is assigned per bout, with the Shamrock draw split evenly.',version:VERSION
    },
    primeFights:12,primeFinishes:11,primeFinishRate:91.67,finishPressureScore:4.50,
    eliteStakesBreakdown:{tournamentChampionships:1.50,topFiveWins:1.50,champFormerChampWins:0.75,oneNightTournamentProof:0.75,divisionStrengthContext:0.10},
    eliteStakesRawScore:4.60,eliteStakesScore:4.80,total:PRIME_DOMINANCE_SCORE,
    dominanceProfile:'Unbeaten three-tournament submission prime with no-round-era uncertainty and a major opponent-depth cap.',
    status:'locked',primeWindow:{...ERA.window},canonicalWindowRebuild:true,version:VERSION
  };

  const APEX={
    score:APEX_PEAK_SCORE,window:'UFC 1 (1993) + Dan Severn at UFC 4 (1994)',
    performances:[
      {label:'UFC 1 tournament',date:'1993-11-12',rating:8.8,note:'Three submissions in one night, including Ken Shamrock and Gerard Gordeau.'},
      {label:'Dan Severn — UFC 4 final',date:'1994-12-16',rating:9.0,note:'Submitted an elite wrestler from underneath to become the first three-time UFC tournament winner.'}
    ],
    performanceAverage:8.90,
    components:{twoPerformanceStrength:1.78,proof:1.20,bestFighterClaim:1.10,aura:1.32},componentTotal:APEX_PEAK_SCORE,
    notes:'Foundational dominance and one-night proof earn a major Apex bonus; opponent depth prevents a top-of-scale score.',
    source:'Royce Gracie UFC-only Apex Peak audit',version:VERSION
  };

  const OQ_SUMMARY={
    fighter:NAME,rawCredit:5.25,diminishedCredit:4.11,elitePlusWins:2,topFivePlusWins:2,rankedQualityWins:7,
    bestWins:['Ken Shamrock','Dan Severn','Kimo Leopoldo','Gerard Gordeau','Keith Hackney'],
    winProfile:'Two true elite-era wins, several credible tournament victories, and substantial embryonic-field discounts.',
    qualityRows:QUALITY.map(row=>row.slice()),version:VERSION
  };

  function key(value){
    return String(value||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  }

  function rows(){
    return [...(DATA?.men||[]),...(DATA?.women||[]),...(DATA?.fighters||[])].filter(row=>key(row?.fighter)===key(NAME));
  }

  function upsert(list,row){
    if(!Array.isArray(list)) return null;
    const index=list.findIndex(item=>key(item?.fighter)===key(NAME));
    if(index<0){list.push(row);return row;}
    list[index]={...list[index],...row};
    return list[index];
  }

  function overrides(){
    return window.DISPLAY_OVERRIDES||(typeof DISPLAY_OVERRIDES!=='undefined'?DISPLAY_OVERRIDES:null);
  }

  function upsertReport(report,row,sorter){
    if(!Array.isArray(report)) return;
    const index=report.findIndex(item=>key(item?.fighter)===key(NAME));
    if(index<0) report.push(row); else report[index]=row;
    if(sorter) report.sort(sorter);
  }

  function stageResult(stage,baseResult,royceResult){
    return {
      applied:Boolean(baseResult?.applied)&&Boolean(royceResult?.applied),
      stage,version:`${BASE.version}+${VERSION}`,fighters:Array.from(new Set([...(BASE.fighters||[]),NAME])),
      base:baseResult,royce:royceResult,error:baseResult?.error||royceResult?.error||null
    };
  }

  function applyChampionship(){
    if(!DATA) return {applied:false,error:'Missing RANKING_DATA'};
    const report={
      fighter:NAME,status:'direct-ledger',titleFightWins:3,tournamentWins:3,adjustedTitleCredit:2.35,
      discountedWins:3,reviewStatus:'locked',formulaScore:CHAMPIONSHIP_SCORE,wins:TITLE_WINS,version:VERSION
    };
    rows().forEach(row=>{
      row.championship=CHAMPIONSHIP_SCORE;
      row.championshipResumeLive=true;
      row.championshipFormulaDriven=true;
      row.championshipResumeAudit=report;
      row.title={...(row.title||{}),tournamentWins:3,titleFightWins:3,adjustedTitleWins:2.35,championshipScore:CHAMPIONSHIP_SCORE,discountedWins:3,reviewStatus:'locked'};
    });
    const shadow=window.UFC_CHAMPIONSHIP_RESUME_SHADOW;
    if(shadow?.report){
      upsertReport(shadow.report,report,(a,b)=>Number(b.formulaScore||0)-Number(a.formulaScore||0));
      shadow.ledgerFighterCount=Object.keys(window.UFC_CHAMPIONSHIP_RESUME_LEDGERS?.ledgers||{}).length;
      shadow.reviewRows=shadow.report.filter(row=>row.reviewStatus!=='locked');
    }
    const live=window.UFC_CHAMPIONSHIP_RESUME_LIVE;
    if(live){live.fighters=shadow?.report?.length||live.fighters;live.approvedRegistryVersion=VERSION;}
    const display=overrides()?.[NAME];
    if(display) display.snapshotStats={...(display.snapshotStats||{}),titleFightWins:3,tournamentWins:3,adjustedTitleWins:2.35,championshipScore:CHAMPIONSHIP_SCORE};
    return {applied:true,fighter:NAME,score:CHAMPIONSHIP_SCORE,adjustedTitleCredit:2.35,version:VERSION};
  }

  function registerBase(){
    if(!DATA) return {applied:false,error:'Missing RANKING_DATA'};
    DATA.men=DATA.men||[];
    DATA.fighters=DATA.fighters||[];
    DATA.primeRecords=DATA.primeRecords||{};
    const board=upsert(DATA.men,BOARD);
    const profile=upsert(DATA.fighters,PROFILE);
    DATA.primeRecords[NAME]={
      record:'11-0-1',context:'UFC 1 → UFC 5',wins:11,losses:0,draws:1,ncs:0,
      source:'Royce Gracie canonical UFC prime recount',sourceVersion:VERSION,eraWindowLocked:true,primeDominanceRebuildVersion:VERSION
    };
    const displayStore=overrides();
    if(displayStore) displayStore[NAME]={...(displayStore[NAME]||{}),...DISPLAY,compareProfile:{...(displayStore[NAME]?.compareProfile||{}),...COMPARE,legacyStats:{...(displayStore[NAME]?.compareProfile?.legacyStats||{}),...COMPARE.legacyStats}}};
    window.COMPARE_PROFILES=window.COMPARE_PROFILES||{};
    window.COMPARE_PROFILES[NAME]={...(window.COMPARE_PROFILES[NAME]||{}),...COMPARE};
    window.COMPARE_FIGHT_LEDGER=window.COMPARE_FIGHT_LEDGER||{};
    window.COMPARE_FIGHT_LEDGER['ken shamrock|royce gracie']={fighters:['Ken Shamrock',NAME],fights:2,winner:NAME,importance:'major',summary:'Royce submitted Shamrock at UFC 1, then their UFC 5 Superfight ended in a 36-minute time-limit draw. Royce owns the direct series without pretending the draw was a win.'};
    window.COMPARE_FIGHT_LEDGER['matt hughes|royce gracie']={fighters:['Matt Hughes',NAME],fights:1,winner:'Matt Hughes',importance:'major',summary:'Hughes dominated Royce in the 2006 return fight. It matters as direct matchup history but is post-prime in Royce’s UFC GOAT scoring.'};
    const era=window.UFC_FIGHTER_ERA_LEDGERS;
    if(era?.ledgers){era.ledgers[NAME]=ERA;era.fighters=Array.from(new Set([...(era.fighters||[]),NAME]));}
    const championship=window.UFC_CHAMPIONSHIP_RESUME_LEDGERS;
    if(championship?.ledgers) championship.ledgers[NAME]={fighter:NAME,championshipWins:TITLE_WINS.map(row=>({...row}))};
    const quality=window.UFC_OPPONENT_QUALITY_LEDGERS;
    if(quality?.raw) quality.raw[NAME]=QUALITY.map(row=>row.slice());
    DATA.meta=DATA.meta||{};
    const currentRegistry=DATA.meta.canonicalFighterRegistry||{};
    DATA.meta.canonicalFighterRegistry={...currentRegistry,version:`${BASE.version}+${VERSION}`,fighters:Array.from(new Set([...(currentRegistry.fighters||[]),...(BASE.fighters||[]),NAME])),appliedAt:new Date().toISOString()};
    applyChampionship();
    return {applied:true,fighter:NAME,boardRow:board,profile,eraLedgerRegistered:Boolean(era?.ledgers?.[NAME]),version:VERSION};
  }

  function applyOpponentQuality(){
    if(!DATA) return {applied:false,error:'Missing RANKING_DATA'};
    const store=window.UFC_OPPONENT_QUALITY_LEDGERS;
    if(store?.raw) store.raw[NAME]=QUALITY.map(row=>row.slice());
    const report={...OQ_SUMMARY,liveScore:OPPONENT_QUALITY_SCORE,categoryScore:OPPONENT_QUALITY_SCORE,benchmarkCredit:14.1,sourceMode:'canonical-registry-fixed-audit',version:VERSION};
    rows().forEach(row=>{
      row.opponentQuality=OPPONENT_QUALITY_SCORE;
      row.opponentQualityLive=true;
      row.opponentQualityLiveAudit=report;
      row.opponentQualityShadowAudit=report;
      row.elitePlusWins=2;
      row.topFivePlusWins=2;
      row.rankedQualityWins=7;
      row.winProfile=OQ_SUMMARY.winProfile;
    });
    const audit=window.UFC_OPPONENT_QUALITY_SHADOW_AUDIT;
    if(audit){
      const previous=audit.summaryFor;
      if(!audit.__royceSummaryWrapped){
        audit.summaryFor=fighter=>key(fighter)===key(NAME)?OQ_SUMMARY:(typeof previous==='function'?previous(fighter):null);
        audit.__royceSummaryWrapped=true;
      }
      audit.report=Array.isArray(audit.report)?audit.report:[];
      upsertReport(audit.report,OQ_SUMMARY,(a,b)=>Number(b.diminishedCredit||0)-Number(a.diminishedCredit||0));
      audit.fighters=audit.report.length;
    }
    const live=window.UFC_OPPONENT_QUALITY_LIVE;
    if(live){
      live.report=Array.isArray(live.report)?live.report:[];
      upsertReport(live.report,report,(a,b)=>Number(b.liveScore||0)-Number(a.liveScore||0));
      live.fighters=live.report.length;
      live.approvedRegistryVersion=VERSION;
    }
    const display=overrides()?.[NAME];
    if(display) display.snapshotStats={...(display.snapshotStats||{}),elitePlusWins:2,topFivePlusWins:2,rankedQualityWins:7,bestQualityWins:OQ_SUMMARY.bestWins.join(', '),winProfile:OQ_SUMMARY.winProfile,opponentQualityScore:OPPONENT_QUALITY_SCORE};
    return {applied:true,fighter:NAME,rawCredit:OQ_SUMMARY.rawCredit,diminishedCredit:OQ_SUMMARY.diminishedCredit,score:OPPONENT_QUALITY_SCORE,version:VERSION};
  }

  function applyPrimeDominance(){
    const ledgers=window.UFC_PRIME_DOMINANCE_LEDGERS;
    if(!ledgers?.report) return {applied:false,error:'Prime Dominance chain not ready'};
    const previous=ledgers.entryFor;
    if(!ledgers.__royceEntryWrapped){
      ledgers.entryFor=fighter=>key(fighter)===key(NAME)?PRIME:(typeof previous==='function'?previous(fighter):null);
      ledgers.__royceEntryWrapped=true;
    }
    upsertReport(ledgers.report,PRIME,(a,b)=>Number(b.total||0)-Number(a.total||0));
    ledgers.leaders=ledgers.report.slice(0,15);
    ledgers.applied=Array.from(new Set([...(ledgers.applied||[]),NAME]));
    if(window.UFC_PRIME_DOMINANCE_SHADOW_MODEL) window.UFC_PRIME_DOMINANCE_SHADOW_MODEL.report=ledgers.report;
    const roundAudit=window.UFC_PRIME_ROUND_CONTROL_AUDIT;
    if(roundAudit){
      const previousRound=roundAudit.entryFor;
      if(!roundAudit.__royceEntryWrapped){
        roundAudit.entryFor=fighter=>key(fighter)===key(NAME)?PRIME.roundControlAudit:(typeof previousRound==='function'?previousRound(fighter):null);
        roundAudit.__royceEntryWrapped=true;
      }
      roundAudit.report=Array.isArray(roundAudit.report)?roundAudit.report:[];
      upsertReport(roundAudit.report,PRIME.roundControlAudit,(a,b)=>Number(b.roundControlPct||0)-Number(a.roundControlPct||0));
    }
    rows().forEach(row=>{
      row.primeRecord='11-0-1';
      row.primeDominance=PRIME_DOMINANCE_SCORE;
      row.primeDominanceShadowAudit=PRIME;
      row.roundsWonPct=95.83;
      row.primeFinishRatePct=91.67;
    });
    return {applied:true,fighter:NAME,entry:PRIME,version:VERSION};
  }

  function applyApexPeak(){
    rows().forEach(row=>{
      row.apexPeak=APEX_PEAK_SCORE;
      row.apexPeakAudit=APEX;
      row.apexPeakBonusLive=true;
      row.apexPeakBonusVersion=VERSION;
    });
    const display=overrides()?.[NAME];
    if(display){display.apexPeakAudit=APEX;display.snapshotStats={...(display.snapshotStats||{}),apexPeak:APEX_PEAK_SCORE,apexPeakAudit:APEX};}
    const componentAudit=window.UFC_APEX_PEAK_COMPONENT_AUDIT;
    if(componentAudit){componentAudit.componentOverrides=componentAudit.componentOverrides||{};componentAudit.componentOverrides[NAME]=APEX;componentAudit.patched=Array.from(new Set([...(componentAudit.patched||[]),NAME]));}
    const locked=window.UFC_APEX_PEAK_LOCKED_AUDIT;
    if(locked) locked.fighters=Array.from(new Set([...(locked.fighters||[]),NAME]));
    return {applied:true,fighter:NAME,score:APEX_PEAK_SCORE,audit:APEX,version:VERSION};
  }

  function finalize(){
    const board=DATA?.men?.find(row=>key(row.fighter)===key(NAME));
    const profile=DATA?.fighters?.find(row=>key(row.fighter)===key(NAME));
    if(!board||!profile) return {applied:false,error:'Royce Gracie rows missing'};
    board.eraDepthAdjustment=ERA_DEPTH_ADJUSTMENT;
    profile.eraDepthAdjustment=ERA_DEPTH_ADJUSTMENT;
    const display=overrides()?.[NAME];
    if(display){
      display.packetStatus={stage:'canonical live fighter',lastUpdated:'2026-07-12',nextFix:'Add real Royce Gracie WebP assets and a signature-fight URL when available.'};
      display.repoLocations={scoreSource:'assets/data/canonical-fighter-registry-royce-gracie.js',compareSource:'assets/data/canonical-fighter-registry-royce-gracie.js'};
    }
    return {
      applied:true,fighter:NAME,boardRow:board,profile,championship:board.championship,opponentQuality:board.opponentQuality,
      primeDominance:board.primeDominance,longevity:board.longevity,apexPeak:board.apexPeak,penalty:board.penalty,
      eraDepthAdjustment:board.eraDepthAdjustment,totalScore:board.totalScore,overallOvr:board.overallOvr,rank:board.rank,version:VERSION
    };
  }

  const ROYCE_API={
    version:VERSION,fighters:[NAME],registerBase,applyChampionship,applyOpponentQuality,applyPrimeDominance,applyApexPeak,finalize
  };

  const COMBINED={
    ...BASE,
    version:`${BASE.version}+${VERSION}`,
    fighters:Array.from(new Set([...(BASE.fighters||[]),NAME])),
    registerBase(){return stageResult('registerBase',BASE.registerBase(),ROYCE_API.registerBase());},
    applyChampionship(){return stageResult('applyChampionship',BASE.applyChampionship(),ROYCE_API.applyChampionship());},
    applyOpponentQuality(){return stageResult('applyOpponentQuality',BASE.applyOpponentQuality(),ROYCE_API.applyOpponentQuality());},
    applyPrimeDominance(){return stageResult('applyPrimeDominance',BASE.applyPrimeDominance(),ROYCE_API.applyPrimeDominance());},
    applyApexPeak(){return stageResult('applyApexPeak',BASE.applyApexPeak(),ROYCE_API.applyApexPeak());},
    finalize(){return stageResult('finalize',BASE.finalize(),ROYCE_API.finalize());}
  };

  window.UFC_ROYCE_GRACIE_REGISTRY=ROYCE_API;
  window.UFC_CANONICAL_FIGHTER_REGISTRY=COMBINED;
  document.documentElement.setAttribute('data-royce-gracie-registry-ready',VERSION);
})();
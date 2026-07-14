// Cody-approved shared Fighter Era Ledger resolutions from the canonical Longevity audit.
// Shadow-only on PR #39. This amends the shared ledger object; it does not write live scores.
(function(){
  'use strict';
  const VERSION='fighter-era-ledger-approved-longevity-resolutions-20260714a';
  const era=window.UFC_FIGHTER_ERA_LEDGERS;
  const ledgers=era?.ledgers;
  if(!ledgers){
    window.UFC_FIGHTER_ERA_LEDGER_APPROVED_LONGEVITY_RESOLUTIONS={version:VERSION,applied:false,error:'Missing UFC_FIGHTER_ERA_LEDGERS',mutatesScores:false};
    return;
  }

  const approvedBy='Cody';
  const approvedAt='2026-07-14';
  const acceptedCleanScores={
    'Glover Teixeira':23.00,
    'Rashad Evans':15.60,
    'Fabricio Werdum':15.27,
    'Vitor Belfort':15.24,
    'Dominick Cruz':14.05,
    'Benson Henderson':11.83,
    'Forrest Griffin':10.30,
    'Cris Cyborg':6.86,
    'Mauricio "Shogun" Rua':6.85,
    'Frank Shamrock':4.59,
    'Royce Gracie':3.40
  };

  Object.entries(acceptedCleanScores).forEach(([fighter,score])=>{
    const ledger=ledgers[fighter];
    if(!ledger)return;
    ledger.longevity={...(ledger.longevity||{}),approvedCanonicalAcceptance:{approved:true,approvedBy,approvedAt,score,decision:'Accept the universal 18-month-cap shared-window reconstruction. Do not reverse-engineer the frozen score with a hidden multiplier or fighter-specific exception.',version:VERSION}};
  });

  // Cruz: explicitly retire the unexplained 78-month stored value and lock the universal cap result.
  if(ledgers['Dominick Cruz']){
    ledgers['Dominick Cruz'].longevity={...(ledgers['Dominick Cruz'].longevity||{}),gapAdjustedMonths:66.1,activeEliteYears:5.51,adjustmentNote:'Urijah Faber II through Henry Cejudo. Both injury gaps use the universal 18-month cap; no special 24-month injury allowance.',note:'Cody-approved factual correction replacing the unexplained 78-month legacy value.',approvedCanonicalAcceptance:{approved:true,approvedBy,approvedAt,score:14.05,decision:'Universal 18-month cap controls.',version:VERSION}};
  }

  // Tito: later UFC elite wins and the Machida fight re-proved connected elite relevance after Chuck I.
  if(ledgers['Tito Ortiz']){
    const ledger=ledgers['Tito Ortiz'];
    ledger.status='locked';
    ledger.window={start:'2000-04-14',startLabel:'Wanderlei Silva',end:'2008-05-24',endLabel:'Lyoto Machida',endType:'unrecovered_elite_loss',endReason:'Chuck I did not close the window because Tito later beat Vitor Belfort and Forrest Griffin, drew with Rashad Evans, and remained elite-relevant through the Machida fight. Machida is the unrecovered endpoint.'};
    ledger.lossContext={...(ledger.lossContext||{}),unrecoveredLoss:{label:'Lyoto Machida',date:'2008-05-24',type:'late-prime elite decision loss'},recoveredLosses:[{label:'Randy Couture / Chuck Liddell I',date:'2003-2004',recovery:'Later Belfort and Griffin wins plus the Rashad draw re-proved elite UFC relevance.'}],postPrimeLosses:[{label:'Forrest Griffin II onward',date:'2009+',phase:'post-prime decline/comeback context'}]};
    ledger.longevity={...(ledger.longevity||{}),gapAdjustedMonths:null,activeEliteYears:null,adjustmentNote:'Wanderlei Silva through Lyoto Machida with every inactivity gap capped at 18 months.',note:'Cody-approved shared-window extension based on later UFC elite proof.',approvedWindowResolution:{approved:true,approvedBy,approvedAt,version:VERSION}};
    ledger.notes='Machida endpoint approved for the shared UFC elite-prime window.';
  }

  // Miesha: UFC title-level relevance begins at the first UFC Rousey title fight, not McMann.
  if(ledgers['Miesha Tate']){
    const ledger=ledgers['Miesha Tate'];
    ledger.status='locked';
    ledger.window={start:'2013-12-28',startLabel:'Ronda Rousey II',end:'2016-07-09',endLabel:'Amanda Nunes',endType:'unrecovered_elite_loss',endReason:'The first UFC Rousey title fight begins Tate’s UFC title-level window. Nunes is the unrecovered endpoint.'};
    ledger.lossContext={...(ledger.lossContext||{}),unrecoveredLoss:{label:'Amanda Nunes',date:'2016-07-09',type:'prime elite title finish loss'},recoveredLosses:[{label:'Ronda Rousey II',date:'2013-12-28',recovery:'Remained in the UFC title picture and later won the championship.'}],postPrimeLosses:['Post-retirement/comeback fights.']};
    ledger.longevity={...(ledger.longevity||{}),gapAdjustedMonths:null,activeEliteYears:null,adjustmentNote:'Ronda Rousey II through Amanda Nunes.',note:'Cody-approved UFC-only title-level start; Strikeforce remains excluded.',approvedWindowResolution:{approved:true,approvedBy,approvedAt,version:VERSION}};
    ledger.notes='Rousey II start and Nunes endpoint approved; Strikeforce excluded.';
  }

  // Leon: add the missing shared phase entry and explicit Longevity judgments.
  ledgers['Leon Edwards']={
    status:'locked',
    window:{start:'2019-07-20',startLabel:'Rafael dos Anjos',end:'2025-03-22',endLabel:'Sean Brady',endType:'unrecovered_elite_loss',endReason:'Rafael dos Anjos begins the connected UFC elite run. Muhammad did not close it because Edwards remained elite and fought Brady; Brady is the unrecovered endpoint.'},
    lossContext:{unrecoveredLoss:{label:'Sean Brady',date:'2025-03-22',type:'late-prime elite finish loss'},weirdResults:[{label:'Belal Muhammad I',date:'2021-03-13',phase:'prime no contest/activity anchor'}],recoveredLosses:[{label:'Belal Muhammad II',date:'2024-07-27',recovery:'Remained elite and entered the Sean Brady fight.'}],postPrimeLosses:[]},
    longevity:{gapCapMonths:18,gapAdjustedMonths:null,activeEliteYears:null,statusMultiplier:1.10,divisionMultiplier:1.05,adjustmentNote:'Rafael dos Anjos through Sean Brady with all gaps capped at 18 months.',note:'Cody-approved UFC welterweight title-level window.',approvedWindowResolution:{approved:true,approvedBy,approvedAt,version:VERSION}},
    notes:'RDA start; Brady endpoint. UFC-only.'
  };

  era.fighters=Object.keys(ledgers);
  era.approvedLongevityResolutions={version:VERSION,approvedBy,approvedAt,acceptedCleanScores,windowChanges:['Tito Ortiz','Miesha Tate','Leon Edwards'],mutatesScores:false};
  window.UFC_FIGHTER_ERA_LEDGER_APPROVED_LONGEVITY_RESOLUTIONS={version:VERSION,applied:true,approvedBy,approvedAt,acceptedCleanScores,windowChanges:['Tito Ortiz','Miesha Tate','Leon Edwards'],fighterCount:Object.keys(ledgers).length,mutatesScores:false,appliedAt:new Date().toISOString()};
  document.documentElement.setAttribute('data-fighter-era-ledger-approved-longevity-resolutions',VERSION);
})();
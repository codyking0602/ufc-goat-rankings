// Cody-approved Opponent Quality judgment inputs.
// These are explicit category judgments only. They never write category scores, totals, ranks, OVRs, profiles, or Compare Mode.
(function(){
  'use strict';

  const VERSION='canonical-opponent-quality-approved-judgments-20260714a';
  const EXCLUDED_FIGHTERS=['Leon Edwards'];
  const CREDIT_SCALE=Object.freeze({
    'champion-level':1.25,
    'top-five':1,
    'top-ten':.85,
    ranked:.65,
    solid:.45,
    'name-value':.25,
    minimal:.10,
    none:0
  });

  const rows=[];
  const add=(fighter,opponent,baseTier,finalCredit,note,options={})=>rows.push({
    fighter,opponent,baseTier,baseCredit:CREDIT_SCALE[baseTier],finalCredit,
    adjustments:Array.isArray(options.adjustments)?options.adjustments:[],
    occurrence:options.occurrence||null,
    fightId:options.fightId||null,
    required:options.required!==false,
    judgmentStatus:options.judgmentStatus||'cody-approved',
    note
  });

  // Final legacy calibration judgments that had previously lived in hidden patch layers.
  add('Demetrious Johnson','Henry Cejudo','top-five',1,'Earlier/pre-title Cejudo; no future-title back-credit.',{occurrence:1});
  add('Demetrious Johnson','Joseph Benavidez','champion-level',1.15,'Elite divisional great; transparent adjacent-tier timing/depth adjustment.',{occurrence:2,adjustments:[{type:'division-timing',value:-.10}]});
  add('Demetrious Johnson','Ray Borg','ranked',.65,'Ranked challenger; not strong Top-10 quality after timing/depth review.');
  add('Demetrious Johnson','Tim Elliott','ranked',.65,'Ranked challenger; softer opponent-quality proof.');
  add('Demetrious Johnson','John Moraga','ranked',.65,'Ranked challenger; softer opponent-quality proof.');
  add('Israel Adesanya','Alex Pereira','champion-level',1.25,'Defeated the reigning UFC champion in the rematch.',{occurrence:1});
  add('Henry Cejudo','T.J. Dillashaw','top-ten',.85,'Champion moving down with severe weight-cut context.');
  add('Henry Cejudo','Dominick Cruz','ranked',.65,'All-time name, but long-layoff and timing context.');
  add('Robert Whittaker','Paulo Costa','top-ten',.85,'Former challenger and strong contender, but not a true Top-5 win in this timing context.');
  add('Robert Whittaker','Darren Till','ranked',.65,'Ranked contender; close tactical win and timing context.');

  // Approved Cruz and Topuria corrections.
  add('Dominick Cruz','T.J. Dillashaw','champion-level',1.25,'Beat the reigning UFC bantamweight champion after a long injury layoff.');
  add('Dominick Cruz','Demetrious Johnson','top-five',1,'Elite UFC bantamweight title challenger; later flyweight greatness is context, not back-credit.');
  add('Dominick Cruz','Urijah Faber','top-five',1,'Elite UFC bantamweight title challenger in Cruz’s first UFC championship fight.',{occurrence:1});
  add('Dominick Cruz','Takeya Mizugaki','top-five',1,'Top-five bantamweight contender stopped immediately in Cruz’s return.');
  add('Dominick Cruz','Urijah Faber','top-ten',.85,'Veteran elite challenger, discounted for age and repeat context.',{occurrence:2});
  add('Dominick Cruz','Pedro Munhoz','top-ten',.85,'Ranked bantamweight contender win late in Cruz’s UFC career.');
  add('Dominick Cruz','Casey Kenney','ranked',.65,'Ranked-quality bantamweight comeback win.');
  add('Ilia Topuria','Alexander Volkanovski','champion-level',1.25,'Stopped the reigning UFC featherweight champion and all-time great.');
  add('Ilia Topuria','Max Holloway','champion-level',1.25,'Elite former UFC featherweight champion and divisional great.');
  add('Ilia Topuria','Charles Oliveira','champion-level',1.25,'Elite former lightweight champion defeated in a five-round UFC title fight.');
  add('Ilia Topuria','Josh Emmett','top-five',1,'Five-round win over a prime top featherweight contender.');
  add('Ilia Topuria','Bryce Mitchell','top-ten',.85,'Undefeated ranked featherweight contender submitted during Topuria’s rise.');
  add('Ilia Topuria','Jai Herbert','solid',.45,'Useful upward-division UFC lightweight win.');
  add('Ilia Topuria','Ryan Hall','solid',.45,'Dangerous specialist and credible UFC featherweight win.');
  add('Ilia Topuria','Damon Jackson','solid',.45,'Solid UFC featherweight win.');
  add('Ilia Topuria','Youssef Zalal','name-value',.25,'Early UFC win before either fighter reached ranked contention.');

  // Result-legitimacy special case.
  add('Aljamain Sterling','Petr Yan','ranked',.65,'Official DQ win over an elite opponent; quality credit is capped because the result did not establish a normal competitive victory.',{occurrence:1,judgmentStatus:'cody-approved-special-result'});

  // Approved missing meaningful UFC wins. These overrides apply when the canonical fight is present.
  const meaningful=[
    ['Jon Jones','Alexander Gustafsson','top-five',1,'Elite rematch title defense.',2],
    ['Kamaru Usman','Joaquin Buckley','top-five',1,'Modern top-five welterweight win.'],
    ['Anderson Silva','Travis Lutter','top-five',1,'Top-five title-level opponent; missed-weight context does not erase opponent quality.'],
    ['Anderson Silva','Derek Brunson','top-ten',.85,'Strong ranked middleweight contender.'],
    ['Daniel Cormier','Volkan Oezdemir','top-five',1,'Top-five light-heavyweight title challenger.'],
    ['Cain Velasquez','Travis Browne','top-ten',.85,'Strong ranked heavyweight contender.'],
    ['Robert Whittaker','Ikram Aliskerov','ranked',.65,'Ranked-quality short-notice middleweight win.'],
    ['Robert Whittaker','Nikita Krylov','top-ten',.85,'Strong ranked opponent in the approved app timeline.'],
    ['Max Holloway','Chan Sung Jung','top-ten',.85,'Strong ranked featherweight name with late-career timing.'],
    ['Max Holloway','Dustin Poirier','top-five',1,'Elite lightweight opponent; evaluated at the time of the approved later win.',2],
    ['Jose Aldo','Chad Mendes','top-five',1,'Prime top-five featherweight title challenger.',1],
    ['Charles Oliveira','Nik Lentz','top-ten',.85,'Ranked featherweight rivalry win during Oliveira’s climb.',2],
    ['Charles Oliveira','Mateusz Gamrot','top-ten',.85,'Strong ranked lightweight win in the approved app timeline.'],
    ['Charles Oliveira','Max Holloway','champion-level',1.25,'Champion-level opponent in the approved app timeline.'],
    ['Justin Gaethje','Rafael Fiziev','top-ten',.85,'Strong ranked lightweight rematch win.',2],
    ['Matt Hughes','Renato Verissimo','top-ten',.85,'Strong welterweight contender.'],
    ['Matt Hughes','Ricardo Almeida','top-ten',.85,'Strong ranked welterweight win.'],
    ['B.J. Penn','Matt Hughes','top-five',1,'Elite former champion rematch win.',2],
    ['B.J. Penn','Duane Ludwig','solid',.45,'Official UFC 42 win; useful but not ranked-quality proof.'],
    ['Frankie Edgar','Spencer Fisher','top-ten',.85,'Strong ranked lightweight win.'],
    ['Frankie Edgar','B.J. Penn','top-five',1,'Third UFC win over an elite former champion, timing-adjusted.',3],
    ['Aljamain Sterling','Takeya Mizugaki','top-ten',.85,'Strong ranked bantamweight win.'],
    ['Aljamain Sterling','Calvin Kattar','top-ten',.85,'Strong ranked featherweight win.'],
    ['Aljamain Sterling','Brian Ortega','top-five',1,'Top-five featherweight contender.'],
    ['Aljamain Sterling','Youssef Zalal','top-five',1,'Top-five featherweight contender in the approved app timeline.'],
    ['Petr Yan','Marcus McGhee','ranked',.65,'Ranked-quality bantamweight win.'],
    ['Merab Dvalishvili','Cody Stamann','ranked',.65,'Ranked-quality bantamweight win.'],
    ['Merab Dvalishvili','Umar Nurmagomedov','top-five',1,'Elite top-five bantamweight contender.'],
    ['Merab Dvalishvili',"Sean O'Malley",'top-five',1,'Repeat win over an elite former champion.',2],
    ['Merab Dvalishvili','Cory Sandhagen','top-five',1,'Elite top-five bantamweight contender.'],
    ['T.J. Dillashaw','Joe Soto','top-ten',.85,'Late-replacement title challenger; strong Top-10 quality.'],
    ['T.J. Dillashaw','Hugo Viana','ranked',.65,'Ranked-quality bantamweight win.'],
    ['Junior dos Santos','Roy Nelson','top-ten',.85,'Strong ranked heavyweight contender.'],
    ['Junior dos Santos','Blagoy Ivanov','ranked',.65,'Ranked-quality heavyweight win.'],
    ['Deiveson Figueiredo','Marlon Vera','top-five',1,'Top-five bantamweight win.'],
    ['Deiveson Figueiredo','Montel Jackson','top-ten',.85,'Strong ranked bantamweight win.'],
    ['Lyoto Machida','Ryan Bader','top-five',1,'Top-five light-heavyweight contender.'],
    ['Lyoto Machida','Eryk Anders','ranked',.65,'Ranked-quality middleweight win.'],
    ['Sean Strickland','Anthony Hernandez','top-five',1,'Top-five middleweight win.'],
    ['Sean Strickland','Abus Magomedov','ranked',.65,'Ranked-quality middleweight win.'],
    ['Michael Bisping','Matt Hamill','top-ten',.85,'Strong ranked light-heavyweight win.'],
    ['Michael Bisping','C.B. Dollaway','ranked',.65,'Ranked-quality middleweight win.'],
    ['Dan Henderson','Allan Goes','top-ten',.85,'Strong early UFC tournament-era opponent.'],
    ['Dan Henderson','Carlos Newton','top-ten',.85,'Strong early UFC tournament-era opponent.'],
    ['Robbie Lawler','Chris Lytle','ranked',.65,'Ranked-quality welterweight win.'],
    ['Robbie Lawler','Niko Price','ranked',.65,'Ranked-quality late-career welterweight win.'],
    ['Robbie Lawler','Aaron Riley','ranked',.65,'Ranked-quality early UFC win.'],
    ['Amanda Nunes','Irene Aldana','top-five',1,'Top-five bantamweight title challenger.'],
    ['Valentina Shevchenko','Jessica Eye','top-five',1,'Top-five flyweight title challenger.'],
    ['Valentina Shevchenko','Manon Fiorot','top-five',1,'Top-five flyweight title challenger.'],
    ['Valentina Shevchenko','Zhang Weili','champion-level',1.25,'Elite reigning strawweight champion moving up.'],
    ['Zhang Weili','Tatiana Suarez','top-five',1,'Top-five strawweight title challenger.'],
    ['Rose Namajunas','Tracy Cortez','top-ten',.85,'Strong ranked flyweight win.'],
    ['Rose Namajunas','Miranda Maverick','top-ten',.85,'Strong ranked flyweight win.'],
    ['Mackenzie Dern','Amanda Ribas','top-ten',.85,'Strong ranked strawweight win.'],
    ['Mackenzie Dern','Virna Jandiroba','top-five',1,'Elite strawweight title-level contender in the approved rematch.',2],
    ['Kayla Harrison','Julianna Peña','champion-level',1.25,'Defeated the reigning UFC bantamweight champion.'],
    ['Jessica Andrade','Raquel Pennington','top-ten',.85,'Strong ranked bantamweight win.'],
    ['Jessica Andrade','Joanne Calderwood','top-ten',.85,'Strong ranked flyweight win.'],
    ['Jessica Andrade','Cynthia Calvillo','top-ten',.85,'Strong ranked flyweight win.'],
    ['Alexa Grasso','Maycee Barber','top-five',1,'Top-five flyweight rematch win.',2],
    ['Carla Esparza','Cynthia Calvillo','top-ten',.85,'Strong ranked strawweight win.'],
    ['Carla Esparza','Marina Rodriguez','top-five',1,'Top-five strawweight contender.']
  ];
  meaningful.forEach(([fighter,opponent,tier,credit,note,occurrence])=>add(fighter,opponent,tier,credit,note,{occurrence:occurrence||null,required:false,judgmentStatus:'cody-approved-missing-win'}));

  // Lower-value omissions use canonical reviewed tiers when present; these explicit rows lock the agreed treatment where useful.
  const supporting=[
    ['Frankie Edgar','Mark Bocek','solid',.45],
    ['Merab Dvalishvili','Brad Katona','solid',.45],
    ['T.J. Dillashaw','Issei Tamura','solid',.45],
    ['Junior dos Santos','Gilbert Yvel','solid',.45],
    ['Amanda Nunes','Sheila Gaff','solid',.45],
    ['Alexa Grasso','Heather Jo Clark','solid',.45],
    ['Carla Esparza','Juliana Lima','solid',.45],
    ['Carla Esparza','Maryna Moroz','solid',.45],
    ['Joanna Jedrzejczyk','Juliana Lima','solid',.45]
  ];
  supporting.forEach(([fighter,opponent,tier,credit])=>add(fighter,opponent,tier,credit,'Approved supporting UFC win treatment.',{required:false,judgmentStatus:'cody-approved-supporting-win'}));

  const LEGACY_ROWS_TO_REMOVE=[
    ['Jon Jones','Daniel Cormier II','Official no contest; context only.'],
    ['Islam Makhachev','Beneil Dariush','Fight did not occur.'],
    ['Zhang Weili','Rose Namajunas II','Zhang did not win this fight.'],
    ['Brock Lesnar','Min-Soo Kim','Non-UFC fight.'],
    ['Frankie Edgar','Jim Miller','Non-UFC fight.'],
    ['Randy Couture','Jeremy Horn','Not an official UFC win for Couture.'],
    ['Merab Dvalishvili','Pedro Munhoz','Fight did not occur.'],
    ['Deiveson Figueiredo','Matt Schnell','Fight did not occur.'],
    ['Kayla Harrison','Julia Avila','Not a UFC win for Harrison.'],
    ['Jessica Andrade','Claudia Gadelha II','Duplicate/nonexistent second win.'],
    ['Alexa Grasso','Mizuki Inoue','Non-UFC fight.'],
    ['Carla Esparza','Tecia Torres','TUF exhibition; not an official UFC result.'],
    ['Carla Esparza','Angela Hill','TUF exhibition; not an official UFC result.'],
    ['Carla Esparza','Felice Herrig','Pre-UFC fight.'],
    ['B.J. Penn','Takanori Gomi','Non-UFC fight; historical context only.'],
    ['B.J. Penn','Renzo Gracie','Non-UFC fight; historical context only.'],
    ['Dan Henderson','Wanderlei Silva','Non-UFC fight; historical context only.'],
    ['Chael Sonnen','Paulo Filho','Non-UFC fight; historical context only.'],
    ['Amanda Nunes','Tonya Evinger','No fight occurred; the UFC 214 opponent was Cris Cyborg.'],
    ['Valentina Shevchenko','Alexis Davis','No fight occurred.'],
    ['Holly Holm','Iasmin Lucindo','No fight occurred in the approved canonical timeline.']
  ].map(([fighter,opponent,reason])=>({fighter,opponent,reason,status:'cody-approved-removal'}));

  const FIGHTER_LEVEL_ADJUSTMENTS=Object.freeze({
    // Empty by design. Early-era and division context must live in transparent fight judgments
    // or the separate Division-Era Depth category, not as a hidden Opponent Quality haircut.
  });

  const report={
    version:VERSION,
    applied:true,
    excludedFighters:EXCLUDED_FIGHTERS.slice(),
    creditScale:CREDIT_SCALE,
    judgments:rows,
    legacyRowsToRemove:LEGACY_ROWS_TO_REMOVE,
    fighterLevelAdjustments:FIGHTER_LEVEL_ADJUSTMENTS,
    doctrine:{
      scope:'UFC-only official wins',
      frontEndTerm:'Top-5 Wins',
      futureBackCredit:false,
      automaticRepeatDiscount:false,
      blanketDivisionMultiplier:false,
      performanceBonus:false,
      resultLegitimacyAdjustments:true,
      nonstandardCreditsRequireExplicitAdjustment:true
    },
    mutatesRankingData:false
  };
  window.UFC_CANONICAL_OPPONENT_QUALITY_APPROVED_JUDGMENTS=report;
  document.documentElement.setAttribute('data-canonical-opponent-quality-approved-judgments',VERSION);
})();

// Shared Fighter Era Ledger.
// Source of truth for elite-prime windows used by Prime Dominance, Longevity, Loss Penalty, and profile context.
// Batch 1 only. No live score mutation.
(function(){
  const VERSION='fighter-era-ledgers-20260709b-longevity-inputs';

  const RULES={
    model:'single-window-elite-prime',
    definition:'A fighter has one elite-prime window. A loss does not automatically end the window. The window ends at the first loss after which the fighter never proves elite UFC form again. Fighters who retire after a win, remain active as champion/title-level, or never lose in UFC can end open or on a win.',
    recoveryTests:[
      'Wins another top-5/title-level UFC fight',
      'Earns or takes another legitimate UFC title fight while still elite',
      'Clearly re-enters title relevance after a loss',
      'Moves division and proves elite UFC form again'
    ],
    sharedBy:[
      'Prime Dominance',
      'Longevity',
      'Loss Penalty phase logic',
      'Opponent Quality context',
      'Profile labels'
    ],
    gapCapMonthsDefault:18,
    ufcOnly:true
  };

  const LEDGERS={
    'Jon Jones':{
      status:'locked',
      window:{
        start:'2011-02-05',
        startLabel:'Ryan Bader',
        end:'2023-03-04',
        endLabel:'Ciryl Gane',
        endType:'active_or_retired_win',
        endReason:'No real competitive prime-ending UFC loss; Gane win keeps him title-level.'
      },
      lossContext:{
        unrecoveredLoss:null,
        weirdResults:['Matt Hamill DQ is excluded from competitive loss context.','Daniel Cormier no contest is not a scored loss.'],
        recoveredLosses:[],
        postPrimeLosses:[]
      },
      longevity:{
        gapCapMonths:18,
        gapAdjustedMonths:126.1,
        activeEliteYears:10.51,
        statusMultiplier:1.12,
        divisionMultiplier:0.99,
        adjustmentNote:'Bader 2011 through Gane 2023 with long gaps capped. Ceiling applies after multipliers.',
        note:'Long title-level window; late LHW/HW context slightly compressed but still reaches the longevity ceiling.'
      },
      notes:'UFC-only GOAT benchmark. One continuous elite-prime window with inactivity handled by gap caps, not separate windows.'
    },

    'Georges St-Pierre':{
      status:'locked',
      window:{
        start:'2006-11-18',
        startLabel:'Matt Hughes II',
        end:'2017-11-04',
        endLabel:'Michael Bisping',
        endType:'retirement_win',
        endReason:'Retired after returning to win the middleweight title.'
      },
      lossContext:{
        unrecoveredLoss:null,
        weirdResults:[],
        recoveredLosses:[
          {label:'Matt Hughes I',date:'2004-10-22',phase:'pre-prime elite loss'},
          {label:'Matt Serra',date:'2007-04-07',phase:'prime non-elite finish loss',recovery:'Recovered immediately into a dominant title-winning run.'}
        ],
        postPrimeLosses:[]
      },
      longevity:{
        gapCapMonths:18,
        gapAdjustedMonths:101.3,
        activeEliteYears:8.44,
        statusMultiplier:1.15,
        divisionMultiplier:1.03,
        adjustmentNote:'Hughes II through Bisping with retirement gap capped.',
        note:'Retirement gap is capped. Hughes II through Bisping remains one elite-prime window because the comeback proved championship form again.'
      },
      notes:'Serra stays inside the elite-prime window because GSP recovered to elite form immediately after.'
    },

    'Anderson Silva':{
      status:'locked',
      window:{
        start:'2006-06-28',
        startLabel:'Chris Leben',
        end:'2013-12-28',
        endLabel:'Chris Weidman II',
        endType:'unrecovered_elite_loss',
        endReason:'Weidman I alone does not end the window because Anderson immediately received the title rematch. Weidman II is the unrecovered endpoint.'
      },
      lossContext:{
        unrecoveredLoss:{label:'Chris Weidman II',date:'2013-12-28',type:'prime elite finish/injury loss'},
        weirdResults:[],
        recoveredLosses:[
          {label:'Chris Weidman I',date:'2013-07-06',phase:'prime elite finish loss',recovery:'Immediate title rematch keeps him inside elite-prime window.'}
        ],
        postPrimeLosses:['Nick Diaz NC and later losses are post-prime/context-heavy for scoring.']
      },
      longevity:{
        gapCapMonths:18,
        gapAdjustedMonths:90.0,
        activeEliteYears:7.50,
        statusMultiplier:1.12,
        divisionMultiplier:0.98,
        adjustmentNote:'Leben through Weidman II. Weidman I included because immediate title rematch kept him elite.',
        note:'Legendary dominance window, but shorter than the longest elite-prime cases and middleweight context is slightly compressed.'
      },
      notes:'Weidman II is the shared endpoint for Prime Dominance, Longevity, and Penalty phase logic.'
    },

    'Demetrious Johnson':{
      status:'locked',
      window:{
        start:'2012-06-08',
        startLabel:'Ian McCall II / Joseph Benavidez title run',
        end:'2018-08-04',
        endLabel:'Henry Cejudo II',
        endType:'unrecovered_elite_loss',
        endReason:'Cejudo II is the unrecovered UFC prime-ending loss. ONE Championship is excluded.'
      },
      lossContext:{
        unrecoveredLoss:{label:'Henry Cejudo II',date:'2018-08-04',type:'prime elite decision loss'},
        weirdResults:[],
        recoveredLosses:[
          {label:'Dominick Cruz',date:'2011-10-01',phase:'pre-flyweight-prime elite loss'}
        ],
        postPrimeLosses:[]
      },
      longevity:{
        gapCapMonths:18,
        gapAdjustedMonths:77.0,
        activeEliteYears:6.42,
        statusMultiplier:1.15,
        divisionMultiplier:0.95,
        adjustmentNote:'McCall/Benavidez title run through Cejudo II. ONE excluded.',
        note:'Long title-level flyweight window with a light division-depth compression, not a full skill discount.'
      },
      notes:'UFC flyweight prime only. ONE accomplishments may be context, not scoring.'
    },

    'Khabib Nurmagomedov':{
      status:'locked',
      window:{
        start:'2014-04-19',
        startLabel:'Rafael dos Anjos',
        end:'2020-10-24',
        endLabel:'Justin Gaethje',
        endType:'retirement_win',
        endReason:'Retired undefeated in UFC after a title defense.'
      },
      lossContext:{
        unrecoveredLoss:null,
        weirdResults:[],
        recoveredLosses:[],
        postPrimeLosses:[]
      },
      longevity:{
        gapCapMonths:18,
        gapAdjustedMonths:72.2,
        activeEliteYears:6.02,
        statusMultiplier:1.08,
        divisionMultiplier:1.05,
        adjustmentNote:'RDA through Gaethje. Shorter elite-prime window, no UFC losses.',
        note:'Shorter elite-prime window than the long-reign legends, but boosted by elite lightweight strength and no UFC loss.'
      },
      notes:'No UFC loss penalty. Lightweight strength matters, but Longevity should still reflect the shorter active elite window.'
    },

    'Alexander Volkanovski':{
      status:'locked-current',
      window:{
        start:'2019-05-11',
        startLabel:'Jose Aldo',
        end:null,
        endLabel:'Current championship form',
        endType:'open_current_champion',
        endReason:'Topuria does not close the window because Volkanovski recovered back to championship form. Current champion/title-level status keeps the elite-prime window open.'
      },
      lossContext:{
        unrecoveredLoss:null,
        weirdResults:[],
        upwardDivisionLosses:[
          {label:'Islam Makhachev I',date:'2023-02-12',rule:'reduced upward-division elite-loss treatment'},
          {label:'Islam Makhachev II',date:'2023-10-21',rule:'reduced upward-division elite-loss treatment'}
        ],
        recoveredLosses:[
          {label:'Ilia Topuria',date:'2024-02-17',phase:'prime elite finish loss',recovery:'Recovered back to championship form; window remains open.'}
        ],
        postPrimeLosses:[]
      },
      longevity:{
        gapCapMonths:18,
        gapAdjustedMonths:68.0,
        activeEliteYears:5.67,
        statusMultiplier:1.12,
        divisionMultiplier:1.03,
        adjustmentNote:'Aldo through current championship form. Open window; Topuria does not close it because elite form was re-proven.',
        note:'Modern featherweight strength and title-level status. Open window should update only when he suffers an unrecovered elite-prime loss or retires.'
      },
      notes:'Islam losses remain upward-division exceptions. Topuria is not currently the prime-ending loss because championship form was re-proven afterward.'
    },

    'Jose Aldo':{
      status:'locked',
      window:{
        start:'2011-04-30',
        startLabel:'Mark Hominick',
        end:'2022-08-20',
        endLabel:'Merab Dvalishvili',
        endType:'unrecovered_elite_loss',
        endReason:'McGregor, Holloway, and Volkanovski did not end the window because Aldo kept proving elite relevance. Merab is the unrecovered endpoint.'
      },
      lossContext:{
        unrecoveredLoss:{label:'Merab Dvalishvili',date:'2022-08-20',type:'late elite-prime decision loss'},
        weirdResults:[],
        recoveredLosses:[
          {label:'Conor McGregor',date:'2015-12-12',phase:'prime elite finish loss',recovery:'Recovered with elite contender/title-relevant form.'},
          {label:'Max Holloway I',date:'2017-06-03',phase:'prime elite finish loss',recovery:'Continued facing and beating elite UFC competition.'},
          {label:'Max Holloway II',date:'2017-12-02',phase:'prime elite finish loss',recovery:'Later bantamweight contender run re-proved elite relevance.'},
          {label:'Alexander Volkanovski',date:'2019-05-11',phase:'late-prime elite decision loss',recovery:'Bantamweight run re-proved elite contender form.'},
          {label:'Petr Yan',date:'2020-07-12',phase:'elite-prime title loss',recovery:'Munhoz/Font wins kept him elite-relevant.'}
        ],
        postPrimeLosses:[]
      },
      longevity:{
        gapCapMonths:18,
        gapAdjustedMonths:135.7,
        activeEliteYears:11.31,
        statusMultiplier:1.04,
        divisionMultiplier:1.01,
        adjustmentNote:'Hominick through Merab. UFC-only, WEC excluded; elite relevance recovered after prior losses.',
        note:'UFC-only excludes WEC, but UFC featherweight title run plus bantamweight elite relevance gives a huge single elite-prime window.'
      },
      notes:'WEC is excluded from scoring. UFC elite-prime starts at Hominick and ends at Merab.'
    },

    'Dominick Cruz':{
      status:'locked',
      window:{
        start:'2011-07-02',
        startLabel:'Urijah Faber II',
        end:'2020-05-09',
        endLabel:'Henry Cejudo',
        endType:'unrecovered_late_prime_title_loss',
        endReason:'Garbrandt did not automatically end the window. Cejudo title loss is the endpoint. Vera is post-prime.'
      },
      lossContext:{
        unrecoveredLoss:{label:'Henry Cejudo',date:'2020-05-09',type:'late-prime title finish loss'},
        weirdResults:[],
        recoveredLosses:[
          {label:'Cody Garbrandt',date:'2016-12-30',phase:'prime elite decision loss',recovery:'Still returned to title-level relevance by the Cejudo fight.'}
        ],
        postPrimeLosses:[
          {label:'Marlon Vera',date:'2022-08-13',phase:'post-prime finish loss'}
        ]
      },
      longevity:{
        gapCapMonths:18,
        gapAdjustedMonths:78.0,
        activeEliteYears:6.50,
        statusMultiplier:1.02,
        divisionMultiplier:1.00,
        adjustmentNote:'Faber II through Cejudo. Injury gaps capped; Vera excluded as post-prime.',
        note:'UFC-only window with WEC excluded. Injury gaps are capped, and Vera does not extend the elite-prime window.'
      },
      notes:'Cejudo is the shared endpoint. WEC reign excluded from scoring but can be mentioned as context.'
    }
  };

  function entryFor(fighter){return LEDGERS[fighter]||null;}
  function all(){return {...LEDGERS};}
  function names(){return Object.keys(LEDGERS);}

  window.UFC_FIGHTER_ERA_LEDGERS={
    version:VERSION,
    rules:RULES,
    ledgers:LEDGERS,
    entryFor,
    all,
    names,
    batch:'one',
    fighters:names(),
    mutatesScores:false,
    appliedAt:new Date().toISOString()
  };

  document.documentElement.setAttribute('data-fighter-era-ledgers',VERSION);
})();

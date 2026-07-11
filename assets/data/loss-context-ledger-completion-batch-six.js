// Loss Context ledger completion batch six.
// First half of the 35 fighters remaining after batches one through five.
// Completes eighteen UFC loss ledgers from the canonical Era windows.
// Does not change live penalties, totals, ranks, or OVR.
(function(){
  'use strict';
  const VERSION='loss-context-ledger-completion-batch-six-20260710a-first-half-eighteen';
  const era=window.UFC_FIGHTER_ERA_LEDGERS;
  const ledgers=era?.ledgers;

  if(!ledgers){
    window.UFC_LOSS_CONTEXT_LEDGER_COMPLETION_BATCH_SIX={version:VERSION,applied:false,error:'Missing UFC_FIGHTER_ERA_LEDGERS.',mutatesScores:false};
    return;
  }

  const COMPLETE={
    'Jon Jones':{
      recoveredLosses:[],
      upwardDivisionLosses:[],
      unrecoveredLoss:null,
      postPrimeLosses:[],
      weirdResults:[
        {label:'Matt Hamill disqualification',date:'2009-12-05',type:'pre-prime disqualification contextual result',notes:'Official UFC loss, but not treated as a real competitive defeat.'},
        {label:'Daniel Cormier II no contest',date:'2017-07-29',type:'prime no contest contextual result',notes:'Originally a Jones win; overturned to a no contest and excluded from loss scoring.'}
      ]
    },
    'Georges St-Pierre':{
      recoveredLosses:[
        {label:'Matt Hughes I',date:'2004-10-22',type:'pre-prime elite title finish loss',method:'Submission'},
        {label:'Matt Serra',date:'2007-04-07',type:'prime non-elite title finish loss',method:'TKO',recovery:'Avenged decisively and resumed a dominant championship run.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:null,
      postPrimeLosses:[],
      weirdResults:[]
    },
    'Demetrious Johnson':{
      recoveredLosses:[
        {label:'Dominick Cruz',date:'2011-10-01',type:'pre-prime elite bantamweight-title decision loss',method:'Decision'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Henry Cejudo II',date:'2018-08-04',type:'prime elite title decision loss',method:'Split decision',notes:'Canonical UFC prime endpoint; ONE results are excluded.'},
      postPrimeLosses:[],
      weirdResults:[]
    },
    'Khabib Nurmagomedov':{
      recoveredLosses:[],
      upwardDivisionLosses:[],
      unrecoveredLoss:null,
      postPrimeLosses:[],
      weirdResults:[]
    },
    'Islam Makhachev':{
      recoveredLosses:[
        {label:'Adriano Martins',date:'2015-10-03',type:'pre-prime non-elite finish loss',method:'KO'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:null,
      postPrimeLosses:[],
      weirdResults:[]
    },
    'Alexander Volkanovski':{
      recoveredLosses:[
        {label:'Ilia Topuria',date:'2024-02-17',type:'prime elite title finish loss',method:'KO',recovery:'Returned to championship form and kept the canonical window open.'}
      ],
      upwardDivisionLosses:[
        {label:'Islam Makhachev I',date:'2023-02-12',type:'prime upward-division elite title decision loss',method:'Decision',rule:'reduced upward-division elite-loss treatment'},
        {label:'Islam Makhachev II',date:'2023-10-21',type:'prime upward-division elite title finish loss',method:'KO',rule:'reduced upward-division elite-loss treatment'}
      ],
      unrecoveredLoss:null,
      postPrimeLosses:[],
      weirdResults:[]
    },
    'Jose Aldo':{
      recoveredLosses:[
        {label:'Conor McGregor',date:'2015-12-12',type:'prime elite title finish loss',method:'KO',recovery:'Aldo returned to interim-title and elite contender relevance.'},
        {label:'Max Holloway I',date:'2017-06-03',type:'prime elite title finish loss',method:'TKO',recovery:'Immediate title rematch kept Aldo at championship level.'},
        {label:'Max Holloway II',date:'2017-12-02',type:'prime elite title finish loss',method:'TKO',recovery:'Aldo later rebuilt into elite bantamweight relevance.'},
        {label:'Alexander Volkanovski',date:'2019-05-11',type:'prime elite decision loss',method:'Decision',recovery:'Aldo moved to bantamweight and re-proved elite relevance.'},
        {label:'Marlon Moraes',date:'2019-12-14',type:'prime elite decision loss',method:'Split decision',recovery:'Aldo remained title-level and fought Petr Yan for the bantamweight belt.'},
        {label:'Petr Yan',date:'2020-07-11',type:'prime elite vacant-title finish loss',method:'TKO',recovery:'Munhoz and Font wins kept Aldo inside the canonical elite window.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Merab Dvalishvili',date:'2022-08-20',type:'prime elite decision loss',method:'Decision',notes:'Canonical UFC prime endpoint.'},
      postPrimeLosses:[
        {label:'Mario Bautista',date:'2024-10-05',type:'post-prime elite decision loss',method:'Split decision'},
        {label:'Aiemann Zahabi',date:'2025-05-10',type:'post-prime decision loss',method:'Decision'}
      ],
      weirdResults:[]
    },
    'Kamaru Usman':{
      recoveredLosses:[
        {label:'Leon Edwards II',date:'2022-08-20',type:'prime elite title finish loss',method:'KO',recovery:'Immediate title rematch kept Usman inside the canonical window.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Leon Edwards III',date:'2023-03-18',type:'prime elite title decision loss',method:'Decision',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Khamzat Chimaev',date:'2023-10-21',type:'post-prime upward-division elite decision loss',method:'Decision',notes:'Short-notice middleweight context after the Edwards endpoint.'}
      ],
      weirdResults:[]
    },
    'Daniel Cormier':{
      recoveredLosses:[
        {label:'Jon Jones I',date:'2015-01-03',type:'prime elite title decision loss',method:'Decision',recovery:'Cormier recovered into UFC champion and two-division champion form.'},
        {label:'Stipe Miocic II',date:'2019-08-17',type:'prime elite title finish loss',method:'TKO',recovery:'Immediate trilogy title fight kept the window open.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Stipe Miocic III',date:'2020-08-15',type:'prime elite title decision loss',method:'Decision',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[],
      weirdResults:[
        {label:'Jon Jones II no contest',date:'2017-07-29',type:'prime no contest contextual result',notes:'Originally a Jones win; overturned to a no contest and excluded from loss scoring.'}
      ]
    },
    'Dricus du Plessis':{
      recoveredLosses:[],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Khamzat Chimaev',date:'2025-08-16',type:'prime elite title decision loss',method:'Decision',notes:'Current-table UFC middleweight title loss.'},
      postPrimeLosses:[],
      weirdResults:[]
    },
    'Israel Adesanya':{
      recoveredLosses:[
        {label:'Alex Pereira I',date:'2022-11-12',type:'prime elite title finish loss',method:'TKO',recovery:'Adesanya avenged the loss by knockout in the immediate rematch.'},
        {label:'Sean Strickland',date:'2023-09-10',type:'prime elite title decision loss',method:'Decision',recovery:'Returned directly to title-level competition against Dricus du Plessis.'}
      ],
      upwardDivisionLosses:[
        {label:'Jan Blachowicz',date:'2021-03-06',type:'prime upward-division elite title decision loss',method:'Decision',rule:'reduced upward-division elite-loss treatment'}
      ],
      unrecoveredLoss:{label:'Dricus du Plessis',date:'2024-08-17',type:'prime elite title finish loss',method:'Submission',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Nassourdine Imavov',date:'2025-02-01',type:'post-prime elite finish loss',method:'TKO'}
      ],
      weirdResults:[]
    },
    'Aljamain Sterling':{
      recoveredLosses:[
        {label:'Bryan Caraway',date:'2016-05-29',type:'pre-prime non-elite decision loss',method:'Split decision'},
        {label:'Raphael Assuncao',date:'2017-01-28',type:'pre-prime elite decision loss',method:'Split decision'},
        {label:'Marlon Moraes',date:'2017-12-09',type:'pre-prime elite finish loss',method:'KO'},
        {label:'Sean O’Malley',date:'2023-08-19',type:'prime elite title finish loss',method:'TKO',recovery:'Sterling re-proved elite form at featherweight.'},
        {label:'Movsar Evloev',date:'2024-12-07',type:'prime elite decision loss',method:'Decision',recovery:'Canonical window remains open/current after the elite featherweight result.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:null,
      postPrimeLosses:[],
      weirdResults:[
        {label:'Petr Yan I disqualification title win',date:'2021-03-06',type:'prime disqualification win contextual result',notes:'Not a loss; retained only as championship-result context.'}
      ]
    },
    'Petr Yan':{
      recoveredLosses:[
        {label:'Aljamain Sterling II',date:'2022-04-09',type:'prime elite title decision loss',method:'Split decision'},
        {label:'Sean O’Malley',date:'2022-10-22',type:'prime elite decision loss',method:'Split decision'},
        {label:'Merab Dvalishvili I',date:'2023-03-11',type:'prime elite decision loss',method:'Decision',recovery:'Yan later re-proved elite form and split the rivalry in the current table.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:null,
      postPrimeLosses:[],
      weirdResults:[
        {label:'Aljamain Sterling I disqualification',date:'2021-03-06',type:'prime disqualification contextual loss',notes:'Official title loss, but not treated like a normal competitive defeat.'}
      ]
    },
    'Cain Velasquez':{
      recoveredLosses:[
        {label:'Junior dos Santos I',date:'2011-11-12',type:'prime elite title finish loss',method:'KO',recovery:'Velasquez recovered by dominating the rematch and trilogy.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Fabricio Werdum',date:'2015-06-13',type:'prime elite title finish loss',method:'Submission',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Francis Ngannou',date:'2019-02-17',type:'post-prime elite finish loss',method:'KO',notes:'Injury/comeback back-end context.'}
      ],
      weirdResults:[]
    },
    'Brock Lesnar':{
      recoveredLosses:[
        {label:'Frank Mir I',date:'2008-02-02',type:'pre-prime elite finish loss',method:'Submission'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Cain Velasquez',date:'2010-10-23',type:'prime elite title finish loss',method:'TKO',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Alistair Overeem',date:'2011-12-30',type:'post-prime elite finish loss',method:'TKO',notes:'Post-diverticulitis return context.'}
      ],
      weirdResults:[
        {label:'Mark Hunt no contest',date:'2016-07-09',type:'post-prime no contest contextual result',notes:'Originally a Lesnar decision win; overturned to a no contest and excluded from loss scoring.'}
      ]
    },
    'Francis Ngannou':{
      recoveredLosses:[
        {label:'Stipe Miocic I',date:'2018-01-20',type:'pre-prime elite title decision loss',method:'Decision'},
        {label:'Derrick Lewis',date:'2018-07-07',type:'pre-prime non-elite decision loss',method:'Decision'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:null,
      postPrimeLosses:[],
      weirdResults:[]
    },
    'Henry Cejudo':{
      recoveredLosses:[
        {label:'Demetrious Johnson I',date:'2016-04-23',type:'pre-prime elite title finish loss',method:'TKO'},
        {label:'Joseph Benavidez',date:'2016-12-03',type:'pre-prime elite decision loss',method:'Split decision'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Aljamain Sterling',date:'2023-05-06',type:'prime elite title decision loss',method:'Split decision',notes:'Canonical comeback-prime endpoint.'},
      postPrimeLosses:[
        {label:'Merab Dvalishvili',date:'2024-02-17',type:'post-prime elite decision loss',method:'Decision'}
      ],
      weirdResults:[]
    },
    'Conor McGregor':{
      recoveredLosses:[
        {label:'Nate Diaz I',date:'2016-03-05',type:'prime non-elite finish loss',method:'Submission',recovery:'McGregor won the rematch and then captured the lightweight title.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Khabib Nurmagomedov',date:'2018-10-06',type:'prime elite title finish loss',method:'Submission',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Dustin Poirier II',date:'2021-01-23',type:'post-prime elite finish loss',method:'TKO'},
        {label:'Dustin Poirier III',date:'2021-07-10',type:'post-prime elite finish/injury loss',method:'TKO',notes:'Doctor stoppage after leg injury.'}
      ],
      weirdResults:[]
    }
  };

  const applied=[];
  const missing=[];
  Object.entries(COMPLETE).forEach(([fighter,lossContext])=>{
    const ledger=ledgers[fighter];
    if(!ledger){missing.push(fighter);return;}
    ledger.lossContext={
      unrecoveredLoss:lossContext.unrecoveredLoss||null,
      recoveredLosses:[...(lossContext.recoveredLosses||[])],
      upwardDivisionLosses:[...(lossContext.upwardDivisionLosses||[])],
      postPrimeLosses:[...(lossContext.postPrimeLosses||[])],
      weirdResults:[...(lossContext.weirdResults||[])]
    };
    ledger.lossContextCompletion={
      ...(ledger.lossContextCompletion||{}),
      version:VERSION,
      batch:6,
      split:'remaining-first-half',
      machineReadable:true,
      completeUfcLossLedger:true,
      source:'canonical Era window plus current fighter packet and UFC fight-history audit',
      completedAt:new Date().toISOString()
    };
    const totalLossEvents=(lossContext.unrecoveredLoss?1:0)+(lossContext.recoveredLosses||[]).length+(lossContext.upwardDivisionLosses||[]).length+(lossContext.postPrimeLosses||[]).length;
    applied.push({fighter,totalLossEvents,contextEvents:(lossContext.weirdResults||[]).length,preAndPrimeLosses:(lossContext.recoveredLosses||[]).length+(lossContext.upwardDivisionLosses||[]).length+(lossContext.unrecoveredLoss?1:0),postPrimeLosses:(lossContext.postPrimeLosses||[]).length});
  });

  const secondHalf=[
    'Ilia Topuria','Merab Dvalishvili','Alex Pereira','Justin Gaethje','Deiveson Figueiredo','Khamzat Chimaev',"Sean O'Malley",'Amanda Nunes','Valentina Shevchenko','Zhang Weili','Rose Namajunas','Mackenzie Dern','Kayla Harrison','Alexa Grasso','Julianna Peña','Holly Holm','Ronda Rousey'
  ];
  const report={
    version:VERSION,
    batch:6,
    split:'remaining-first-half',
    fighters:Object.keys(COMPLETE),
    firstHalfCount:Object.keys(COMPLETE).length,
    secondHalf,
    secondHalfCount:secondHalf.length,
    applied,
    appliedCount:applied.length,
    missing,
    notes:[
      'The 35 fighters remaining after batch five were split 18 and 17.',
      'Jon Jones and Petr Yan retain DQ/no-contest context without treating those results like normal competitive losses.',
      'Jose Aldo now has all nine UFC losses represented under the canonical Hominick-to-Merab window, exposing the old penalty-phase disagreement for later score review.',
      'Dricus du Plessis includes the current-table Khamzat title loss dated 2025-08-16.',
      'Francis Ngannou follows the canonical Blaydes II prime start, so the Stipe and Lewis losses classify as pre-prime in the ledger.',
      'No live penalty value is promoted in this batch.'
    ],
    mutatesEraLossEvents:true,
    mutatesScores:false,
    mutatesPenalty:false,
    appliedAt:new Date().toISOString()
  };
  window.UFC_LOSS_CONTEXT_LEDGER_COMPLETION_BATCH_SIX=report;
  era.lossContextCompletionBatchSix=report;
  document.documentElement.setAttribute('data-loss-context-completion-batch-six',`${VERSION}-${applied.length}`);
})();
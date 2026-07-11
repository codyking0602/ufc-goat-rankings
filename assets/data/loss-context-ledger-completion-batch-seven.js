// Loss Context ledger completion batch seven.
// Completes the final seventeen UFC loss ledgers in the 62-fighter roster.
// Does not change live penalties, totals, ranks, or OVR.
(function(){
  'use strict';
  const VERSION='loss-context-ledger-completion-batch-seven-20260710a-final-seventeen';
  const era=window.UFC_FIGHTER_ERA_LEDGERS;
  const ledgers=era?.ledgers;

  if(!ledgers){
    window.UFC_LOSS_CONTEXT_LEDGER_COMPLETION_BATCH_SEVEN={version:VERSION,applied:false,error:'Missing UFC_FIGHTER_ERA_LEDGERS.',mutatesScores:false};
    return;
  }

  const COMPLETE={
    'Ilia Topuria':{
      recoveredLosses:[
        {label:'Justin Gaethje',date:'2026-01-24',type:'prime elite lightweight-title finish loss',method:'TKO',notes:'Current-table loss and first UFC blemish. Date follows the current app timeline and should move with the fixture if that timeline changes.'}
      ],
      upwardDivisionLosses:[],unrecoveredLoss:null,postPrimeLosses:[],weirdResults:[]
    },
    'Merab Dvalishvili':{
      recoveredLosses:[
        {label:'Frankie Saenz',date:'2017-12-09',type:'pre-prime non-elite decision loss',method:'Split decision'},
        {label:'Ricky Simon',date:'2018-04-21',type:'pre-prime non-elite finish loss',method:'Technical submission',notes:'Official stoppage at the horn remains a counted UFC loss.'},
        {label:'Petr Yan II',date:'2025-12-06',type:'prime elite title decision loss',method:'Decision',recovery:'Current-table rivalry is split; Merab remains inside the open elite window.'}
      ],
      upwardDivisionLosses:[],unrecoveredLoss:null,postPrimeLosses:[],weirdResults:[]
    },
    'Alex Pereira':{
      recoveredLosses:[
        {label:'Israel Adesanya II',date:'2023-04-08',type:'prime elite title finish loss',method:'KO',recovery:'Pereira moved to light heavyweight and re-proved championship form.'},
        {label:'Magomed Ankalaev I',date:'2025-03-08',type:'prime elite title decision loss',method:'Decision',recovery:'Current-table title regain/defense keeps the canonical window open.'}
      ],
      upwardDivisionLosses:[
        {label:'Ciryl Gane',date:'2026-06-14',type:'prime upward-division elite heavyweight finish loss',method:'TKO',rule:'reduced upward-division elite-loss treatment',notes:'Current-table heavyweight result. Date is tied to the present app fixture and should be reviewed if that fixture changes.'}
      ],
      unrecoveredLoss:null,postPrimeLosses:[],
      weirdResults:[
        {label:'Pereira app-record reconciliation',date:'2026-07-02',type:'record-row discrepancy contextual result',notes:'The current profile says 10-4 while the packet identifies three scored UFC losses. The unmatched record count is not converted into a fabricated fight loss.'}
      ]
    },
    'Justin Gaethje':{
      recoveredLosses:[
        {label:'Eddie Alvarez',date:'2017-12-02',type:'pre-prime non-elite finish loss',method:'TKO'},
        {label:'Dustin Poirier I',date:'2018-04-14',type:'pre-prime elite finish loss',method:'TKO'},
        {label:'Khabib Nurmagomedov',date:'2020-10-24',type:'prime elite title finish loss',method:'Submission',recovery:'Gaethje returned with elite contender wins.'},
        {label:'Charles Oliveira',date:'2022-05-07',type:'prime elite title finish loss',method:'Submission',recovery:'Gaethje later beat Fiziev and Poirier.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Max Holloway',date:'2024-04-13',type:'prime elite finish loss',method:'KO',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[],weirdResults:[]
    },
    'Deiveson Figueiredo':{
      recoveredLosses:[
        {label:'Jussier Formiga',date:'2019-03-23',type:'pre-prime elite decision loss',method:'Decision'},
        {label:'Brandon Moreno II',date:'2021-06-12',type:'prime elite title finish loss',method:'Submission',recovery:'Figueiredo won the trilogy title fight.'},
        {label:'Brandon Moreno IV',date:'2023-01-21',type:'prime elite title finish/injury loss',method:'Doctor stoppage',recovery:'Bantamweight elite wins kept the canonical window open.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Petr Yan',date:'2024-11-23',type:'prime elite bantamweight decision loss',method:'Decision',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Cory Sandhagen',date:'2025-05-03',type:'post-prime elite upward-division injury loss',method:'Injury TKO'},
        {label:'Umar Nurmagomedov',date:'2026-02-07',type:'post-prime elite upward-division decision loss',method:'Decision'},
        {label:'Song Yadong',date:'2026-06-27',type:'post-prime elite upward-division decision loss',method:'Decision'}
      ],
      weirdResults:[]
    },
    'Khamzat Chimaev':{
      recoveredLosses:[
        {label:'Sean Strickland',date:'2026-02-14',type:'prime elite title decision loss',method:'Decision',recovery:'The canonical elite window remains open/current.'}
      ],
      upwardDivisionLosses:[],unrecoveredLoss:null,postPrimeLosses:[],weirdResults:[]
    },
    "Sean O'Malley":{
      recoveredLosses:[
        {label:'Marlon Vera I',date:'2020-08-15',type:'pre-prime non-elite finish/injury loss',method:'TKO',notes:'Official loss with leg-injury context.'},
        {label:'Merab Dvalishvili I',date:'2024-09-14',type:'prime elite title decision loss',method:'Decision',recovery:'O’Malley fought again and stayed inside the open elite window.'},
        {label:'Merab Dvalishvili II',date:'2025-06-07',type:'prime elite title finish loss',method:'Submission',recovery:'Current-table rebound wins keep the canonical window open.'}
      ],
      upwardDivisionLosses:[],unrecoveredLoss:null,postPrimeLosses:[],
      weirdResults:[
        {label:'Pedro Munhoz no contest',date:'2022-07-02',type:'pre-prime no contest contextual result',notes:'Eye-poke no contest; excluded from loss scoring.'}
      ]
    },
    'Amanda Nunes':{
      recoveredLosses:[
        {label:'Cat Zingano',date:'2014-09-27',type:'pre-prime elite finish loss',method:'TKO'},
        {label:'Julianna Peña I',date:'2021-12-11',type:'prime elite title finish loss',method:'Submission',recovery:'Nunes avenged the loss decisively in the immediate rematch.'}
      ],
      upwardDivisionLosses:[],unrecoveredLoss:null,postPrimeLosses:[],
      weirdResults:[
        {label:'Nunes app-record reconciliation',date:'2026-07-02',type:'record-row discrepancy contextual result',notes:'The profile says 16-3, but the UFC-only packet identifies two official UFC losses. The unmatched count is not converted into a fabricated UFC loss.'}
      ]
    },
    'Valentina Shevchenko':{
      recoveredLosses:[
        {label:'Amanda Nunes I',date:'2016-03-05',type:'pre-prime elite decision loss',method:'Decision'},
        {label:'Amanda Nunes II',date:'2017-09-09',type:'prime elite title decision loss',method:'Split decision',recovery:'Shevchenko moved to flyweight and became champion.'},
        {label:'Alexa Grasso I',date:'2023-03-04',type:'prime elite title finish loss',method:'Submission',recovery:'Shevchenko remained title-level and later regained the championship.'}
      ],
      upwardDivisionLosses:[],unrecoveredLoss:null,postPrimeLosses:[],
      weirdResults:[
        {label:'Shevchenko app-record reconciliation',date:'2026-07-02',type:'record-row discrepancy contextual result',notes:'The profile says 14-4-1, but one loss in the underlying career count is the non-UFC Liz Carmouche result. UFC-only scoring retains three UFC losses.'},
        {label:'Alexa Grasso II draw',date:'2023-09-16',type:'prime title-draw contextual result',notes:'Draw is not a scored loss.'}
      ]
    },
    'Zhang Weili':{
      recoveredLosses:[
        {label:'Rose Namajunas I',date:'2021-04-24',type:'prime elite title finish loss',method:'KO',recovery:'Zhang remained title-level and rebuilt into a second reign.'},
        {label:'Rose Namajunas II',date:'2021-11-06',type:'prime elite title decision loss',method:'Split decision',recovery:'Zhang regained the strawweight title afterward.'}
      ],
      upwardDivisionLosses:[
        {label:'Valentina Shevchenko',date:'2025-11-15',type:'prime upward-division elite flyweight-title decision loss',method:'Decision',rule:'reduced upward-division elite-loss treatment'}
      ],
      unrecoveredLoss:null,postPrimeLosses:[],weirdResults:[]
    },
    'Rose Namajunas':{
      recoveredLosses:[
        {label:'Carla Esparza I',date:'2014-12-12',type:'pre-prime elite title finish loss',method:'Submission'},
        {label:'Karolina Kowalkiewicz',date:'2016-07-30',type:'pre-prime elite decision loss',method:'Split decision'},
        {label:'Jessica Andrade I',date:'2019-05-11',type:'prime elite title finish loss',method:'KO',recovery:'Rose beat Andrade and later regained the title.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Carla Esparza II',date:'2022-05-07',type:'prime elite title decision loss',method:'Split decision',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Manon Fiorot',date:'2023-09-02',type:'post-prime elite upward-division decision loss',method:'Decision'},
        {label:'Erin Blanchfield',date:'2024-11-02',type:'post-prime elite upward-division decision loss',method:'Decision'},
        {label:'Natália Silva',date:'2026-01-24',type:'post-prime elite upward-division decision loss',method:'Decision',notes:'Injury/eye-poke context retained.'}
      ],
      weirdResults:[]
    },
    'Mackenzie Dern':{
      recoveredLosses:[
        {label:'Amanda Ribas I',date:'2019-10-12',type:'pre-prime non-elite decision loss',method:'Decision'},
        {label:'Marina Rodriguez',date:'2021-10-09',type:'prime elite decision loss',method:'Decision'},
        {label:'Yan Xiaonan',date:'2022-10-01',type:'prime elite decision loss',method:'Decision'},
        {label:'Jessica Andrade',date:'2023-11-11',type:'prime elite finish loss',method:'TKO'},
        {label:'Amanda Lemos',date:'2024-02-17',type:'prime elite decision loss',method:'Decision'}
      ],
      upwardDivisionLosses:[],unrecoveredLoss:null,postPrimeLosses:[],weirdResults:[]
    },
    'Kayla Harrison':{
      recoveredLosses:[],upwardDivisionLosses:[],unrecoveredLoss:null,postPrimeLosses:[],weirdResults:[]
    },
    'Alexa Grasso':{
      recoveredLosses:[
        {label:'Felice Herrig',date:'2017-02-04',type:'pre-prime non-elite decision loss',method:'Decision'},
        {label:'Tatiana Suarez',date:'2018-05-19',type:'pre-prime elite finish loss',method:'Submission'},
        {label:'Carla Esparza',date:'2019-09-21',type:'pre-prime elite decision loss',method:'Majority decision'},
        {label:'Valentina Shevchenko III',date:'2024-09-14',type:'prime elite title decision loss',method:'Decision'},
        {label:'Natália Silva',date:'2025-05-10',type:'prime elite decision loss',method:'Decision'}
      ],
      upwardDivisionLosses:[],unrecoveredLoss:null,postPrimeLosses:[],weirdResults:[]
    },
    'Julianna Peña':{
      recoveredLosses:[
        {label:'Valentina Shevchenko',date:'2017-01-28',type:'pre-prime elite finish loss',method:'Submission'},
        {label:'Germaine de Randamie',date:'2020-10-04',type:'pre-prime elite finish loss',method:'Submission'},
        {label:'Amanda Nunes II',date:'2022-07-30',type:'prime elite title decision loss',method:'Decision',recovery:'Peña remained title-relevant and won the Pennington title fight.'},
        {label:'Kayla Harrison',date:'2025-06-07',type:'prime elite title finish loss',method:'Submission',recovery:'Canonical current window remains open unless a later endpoint is approved.'}
      ],
      upwardDivisionLosses:[],unrecoveredLoss:null,postPrimeLosses:[],weirdResults:[]
    },
    'Holly Holm':{
      recoveredLosses:[
        {label:'Miesha Tate',date:'2016-03-05',type:'prime elite title finish loss',method:'Submission',recovery:'Holm remained in featherweight and bantamweight title relevance.'},
        {label:'Valentina Shevchenko',date:'2016-07-23',type:'prime elite decision loss',method:'Decision'},
        {label:'Germaine de Randamie',date:'2017-02-11',type:'prime elite featherweight-title decision loss',method:'Decision'},
        {label:'Cris Cyborg',date:'2017-12-30',type:'prime elite featherweight-title decision loss',method:'Decision'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Amanda Nunes',date:'2019-07-06',type:'prime elite title finish loss',method:'KO',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Ketlen Vieira',date:'2022-05-21',type:'post-prime elite decision loss',method:'Split decision'},
        {label:'Kayla Harrison',date:'2024-04-13',type:'post-prime elite finish loss',method:'Submission'}
      ],
      weirdResults:[
        {label:'Mayra Bueno Silva no contest',date:'2023-07-15',type:'post-prime no contest contextual result',notes:'Originally a Holm submission loss; overturned to a no contest and excluded from loss scoring.'}
      ]
    },
    'Ronda Rousey':{
      recoveredLosses:[
        {label:'Holly Holm',date:'2015-11-15',type:'prime elite title finish loss',method:'KO',recovery:'Rousey returned directly into another UFC title fight.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Amanda Nunes',date:'2016-12-30',type:'prime elite title finish loss',method:'TKO',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[],weirdResults:[]
    }
  };

  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function ledgerFor(fighter){const target=key(fighter);const name=Object.keys(ledgers).find(candidate=>key(candidate)===target);return name?ledgers[name]:null;}

  const applied=[];
  const missing=[];
  Object.entries(COMPLETE).forEach(([fighter,lossContext])=>{
    const ledger=ledgerFor(fighter);
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
      batch:7,
      split:'remaining-second-half',
      machineReadable:true,
      completeUfcLossLedger:true,
      source:'canonical Era window plus current fighter packet and UFC fight-history audit',
      completedAt:new Date().toISOString()
    };
    const totalLossEvents=(lossContext.unrecoveredLoss?1:0)+(lossContext.recoveredLosses||[]).length+(lossContext.upwardDivisionLosses||[]).length+(lossContext.postPrimeLosses||[]).length;
    applied.push({fighter,totalLossEvents,contextEvents:(lossContext.weirdResults||[]).length,preAndPrimeLosses:(lossContext.recoveredLosses||[]).length+(lossContext.upwardDivisionLosses||[]).length+(lossContext.unrecoveredLoss?1:0),postPrimeLosses:(lossContext.postPrimeLosses||[]).length});
  });

  const report={
    version:VERSION,
    batch:7,
    split:'remaining-second-half',
    fighters:Object.keys(COMPLETE),
    applied,
    appliedCount:applied.length,
    missing,
    rosterLedgerCoverage:62,
    notes:[
      'This completes the final seventeen ledgers and brings manual roster coverage to 62 of 62.',
      'Ilia Topuria and Alex Pereira current-table dates are tied to the present app fixture and are explicitly marked for fixture review if that timeline changes.',
      'Pereira, Nunes, and Shevchenko retain explicit record-row reconciliation context instead of inventing unnamed UFC losses.',
      'Holly Holm includes the Ketlen Vieira loss and the overturned Mayra Bueno Silva no contest.',
      'Kayla Harrison has no UFC losses; non-UFC results remain excluded.'
    ],
    mutatesEraLossEvents:true,
    mutatesScores:false,
    mutatesPenalty:false,
    appliedAt:new Date().toISOString()
  };
  window.UFC_LOSS_CONTEXT_LEDGER_COMPLETION_BATCH_SEVEN=report;
  era.lossContextCompletionBatchSeven=report;
  document.documentElement.setAttribute('data-loss-context-completion-batch-seven',`${VERSION}-${applied.length}`);
})();

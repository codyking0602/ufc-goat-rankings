// Loss Context ledger completion batch five.
// Completes ten veteran/champion UFC loss ledgers in one larger verified batch.
// Does not change live penalties, totals, ranks, or OVR.
(function(){
  'use strict';
  const VERSION='loss-context-ledger-completion-batch-five-20260710b-chuck-vitor-window';
  const era=window.UFC_FIGHTER_ERA_LEDGERS;
  const ledgers=era?.ledgers;

  if(!ledgers){
    window.UFC_LOSS_CONTEXT_LEDGER_COMPLETION_BATCH_FIVE={version:VERSION,applied:false,error:'Missing UFC_FIGHTER_ERA_LEDGERS.',mutatesScores:false};
    return;
  }

  const COMPLETE={
    'Anderson Silva':{
      recoveredLosses:[
        {label:'Chris Weidman I',date:'2013-07-06',type:'prime elite title finish loss',method:'KO',recovery:'Immediate UFC title rematch kept Silva inside the canonical prime window.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Chris Weidman II',date:'2013-12-28',type:'prime elite title finish/injury loss',method:'TKO',notes:'Canonical prime endpoint; official leg-injury stoppage remains a counted loss with technical context.'},
      postPrimeLosses:[
        {label:'Michael Bisping',date:'2016-02-27',type:'post-prime elite decision loss',method:'Decision'},
        {label:'Daniel Cormier',date:'2016-07-09',type:'post-prime upward-division elite decision loss',method:'Decision',notes:'Short-notice light-heavyweight context; post-prime penalty remains zero.'},
        {label:'Israel Adesanya',date:'2019-02-10',type:'post-prime elite decision loss',method:'Decision'},
        {label:'Jared Cannonier',date:'2019-05-11',type:'post-prime elite finish/injury loss',method:'TKO'},
        {label:'Uriah Hall',date:'2020-10-31',type:'post-prime non-elite finish loss',method:'TKO'}
      ],
      weirdResults:[
        {label:'Nick Diaz no contest',date:'2015-01-31',type:'post-prime no contest contextual result',notes:'Originally a Silva decision win; overturned to a no contest and excluded from loss scoring.'}
      ]
    },
    'Chuck Liddell':{
      recoveredLosses:[
        {label:'Jeremy Horn I',date:'1999-03-05',type:'pre-prime elite finish loss',method:'Submission'},
        {label:'Randy Couture I',date:'2003-06-06',type:'prime elite interim-title finish loss',method:'TKO',recovery:'Liddell later beat Couture twice and built his championship reign.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Quinton Jackson II',date:'2007-05-26',type:'prime elite title finish loss',method:'KO',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Keith Jardine',date:'2007-09-22',type:'post-prime non-elite decision loss',method:'Split decision'},
        {label:'Rashad Evans',date:'2008-09-06',type:'post-prime elite finish loss',method:'KO'},
        {label:'Mauricio Rua',date:'2009-04-18',type:'post-prime elite finish loss',method:'TKO'},
        {label:'Rich Franklin',date:'2010-06-12',type:'post-prime elite finish loss',method:'KO'}
      ],
      weirdResults:[]
    },
    'Junior dos Santos':{
      recoveredLosses:[
        {label:'Cain Velasquez II',date:'2012-12-29',type:'prime elite title decision loss',method:'Decision',recovery:'The trilogy title fight kept dos Santos at championship level.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Cain Velasquez III',date:'2013-10-19',type:'prime elite title finish loss',method:'TKO',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Alistair Overeem',date:'2015-12-19',type:'post-prime elite finish loss',method:'TKO'},
        {label:'Stipe Miocic II',date:'2017-05-13',type:'post-prime elite title finish loss',method:'TKO'},
        {label:'Francis Ngannou',date:'2019-06-29',type:'post-prime elite finish loss',method:'TKO'},
        {label:'Curtis Blaydes',date:'2020-01-25',type:'post-prime elite finish loss',method:'TKO'},
        {label:'Jairzinho Rozenstruik',date:'2020-08-15',type:'post-prime elite finish loss',method:'TKO'},
        {label:'Ciryl Gane',date:'2020-12-12',type:'post-prime elite finish loss',method:'TKO'}
      ],
      weirdResults:[]
    },
    'Dan Henderson':{
      recoveredLosses:[
        {label:'Quinton Jackson',date:'2007-09-08',type:'pre-prime elite title decision loss',method:'Decision'},
        {label:'Anderson Silva',date:'2008-03-01',type:'pre-prime elite title finish loss',method:'Submission'},
        {label:'Lyoto Machida',date:'2013-02-23',type:'prime elite decision loss',method:'Split decision',recovery:'Henderson remained in the late UFC elite window.'},
        {label:'Rashad Evans',date:'2013-06-15',type:'prime elite decision loss',method:'Split decision',recovery:'Henderson remained a relevant light-heavyweight contender.'},
        {label:'Vitor Belfort II',date:'2013-11-09',type:'prime elite finish loss',method:'KO',recovery:'Henderson returned with the Shogun rematch win before the Cormier endpoint.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Daniel Cormier',date:'2014-05-24',type:'prime elite finish loss',method:'Technical submission',notes:'Canonical UFC-only prime endpoint.'},
      postPrimeLosses:[
        {label:'Gegard Mousasi',date:'2015-01-24',type:'post-prime elite finish loss',method:'TKO'},
        {label:'Vitor Belfort III',date:'2015-11-07',type:'post-prime elite finish loss',method:'KO'},
        {label:'Michael Bisping II',date:'2016-10-08',type:'post-prime elite title decision loss',method:'Decision'}
      ],
      weirdResults:[]
    },
    'Joanna Jedrzejczyk':{
      recoveredLosses:[
        {label:'Rose Namajunas I',date:'2017-11-04',type:'prime elite title finish loss',method:'TKO',recovery:'Immediate title rematch kept Joanna championship-level.'},
        {label:'Rose Namajunas II',date:'2018-04-07',type:'prime elite title decision loss',method:'Decision',recovery:'Joanna stayed elite and later challenged Zhang for the title.'}
      ],
      upwardDivisionLosses:[
        {label:'Valentina Shevchenko',date:'2018-12-08',type:'prime upward-division elite vacant-title decision loss',method:'Decision',rule:'reduced upward-division elite-loss treatment'}
      ],
      unrecoveredLoss:{label:'Zhang Weili I',date:'2020-03-07',type:'prime elite title decision loss',method:'Split decision',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Zhang Weili II',date:'2022-06-12',type:'post-prime elite finish loss',method:'KO'}
      ],
      weirdResults:[]
    },
    'Carla Esparza':{
      recoveredLosses:[
        {label:'Joanna Jedrzejczyk',date:'2015-03-14',type:'prime elite title finish loss',method:'TKO',recovery:'Esparza eventually rebuilt into a second UFC title reign.'},
        {label:'Randa Markos',date:'2017-02-19',type:'prime non-elite decision loss',method:'Split decision',recovery:'Esparza rebuilt through the later contender run.'},
        {label:'Claudia Gadelha',date:'2018-06-09',type:'prime elite decision loss',method:'Split decision',recovery:'The later title-winning run kept the canonical window connected.'},
        {label:'Tatiana Suarez',date:'2018-09-08',type:'prime elite finish loss',method:'TKO',recovery:'Esparza recovered with the Grasso-through-Rose II title run.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Zhang Weili',date:'2022-11-12',type:'prime elite title finish loss',method:'Submission',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Tecia Pennington',date:'2024-10-05',type:'post-prime non-elite decision loss',method:'Decision',notes:'Retirement fight after the Zhang endpoint.'}
      ],
      weirdResults:[]
    },
    'Dominick Cruz':{
      recoveredLosses:[
        {label:'Cody Garbrandt',date:'2016-12-30',type:'prime elite title decision loss',method:'Decision',recovery:'Cruz later returned directly to title-level relevance against Henry Cejudo.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Henry Cejudo',date:'2020-05-09',type:'prime elite title finish loss',method:'TKO',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Marlon Vera',date:'2022-08-13',type:'post-prime elite finish loss',method:'KO'}
      ],
      weirdResults:[]
    },
    'Tyron Woodley':{
      recoveredLosses:[
        {label:'Jake Shields',date:'2013-06-15',type:'pre-prime elite decision loss',method:'Split decision'},
        {label:'Rory MacDonald',date:'2014-06-14',type:'prime elite decision loss',method:'Decision',recovery:'Woodley recovered into UFC champion form.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Kamaru Usman',date:'2019-03-02',type:'prime elite title decision loss',method:'Decision',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Gilbert Burns',date:'2020-05-30',type:'post-prime elite decision loss',method:'Decision'},
        {label:'Colby Covington',date:'2020-09-19',type:'post-prime elite finish/injury loss',method:'TKO'},
        {label:'Vicente Luque',date:'2021-03-27',type:'post-prime elite finish loss',method:'Submission'}
      ],
      weirdResults:[]
    },
    'T.J. Dillashaw':{
      recoveredLosses:[
        {label:'John Dodson',date:'2011-12-03',type:'pre-prime elite finish loss',method:'TKO'},
        {label:'Raphael Assuncao I',date:'2013-10-09',type:'pre-prime elite decision loss',method:'Split decision'},
        {label:'Dominick Cruz',date:'2016-01-17',type:'prime elite title decision loss',method:'Split decision',recovery:'Dillashaw recovered with the Garbrandt title wins.'},
        {label:'Henry Cejudo',date:'2019-01-19',type:'prime elite flyweight-title finish loss',method:'TKO',recovery:'Dillashaw returned from suspension and re-proved elite form against Cory Sandhagen.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Aljamain Sterling',date:'2022-10-22',type:'prime elite title finish/injury loss',method:'TKO',notes:'Canonical prime endpoint; shoulder-injury context retained without erasing the official result.'},
      postPrimeLosses:[],
      weirdResults:[]
    },
    'Stipe Miocic':{
      recoveredLosses:[
        {label:'Stefan Struve',date:'2012-09-29',type:'pre-prime non-elite finish loss',method:'TKO'},
        {label:'Junior dos Santos I',date:'2014-12-13',type:'pre-prime elite decision loss',method:'Decision'},
        {label:'Daniel Cormier I',date:'2018-07-07',type:'prime elite title finish loss',method:'KO',recovery:'Miocic recovered by winning the Cormier rematch and trilogy.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Francis Ngannou II',date:'2021-03-27',type:'prime elite title finish loss',method:'KO',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Jon Jones',date:'2024-11-16',type:'post-prime elite title finish loss',method:'TKO',notes:'Late retirement fight after more than three years away.'}
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
      batch:5,
      machineReadable:true,
      completeUfcLossLedger:true,
      source:'canonical Era window plus fighter packet and UFC fight-history audit',
      completedAt:new Date().toISOString()
    };
    const totalLossEvents=(lossContext.unrecoveredLoss?1:0)+(lossContext.recoveredLosses||[]).length+(lossContext.upwardDivisionLosses||[]).length+(lossContext.postPrimeLosses||[]).length;
    applied.push({fighter,totalLossEvents,preAndPrimeLosses:(lossContext.recoveredLosses||[]).length+(lossContext.upwardDivisionLosses||[]).length+(lossContext.unrecoveredLoss?1:0),postPrimeLosses:(lossContext.postPrimeLosses||[]).length});
  });

  const report={
    version:VERSION,
    batch:5,
    fighters:Object.keys(COMPLETE),
    applied,
    appliedCount:applied.length,
    missing,
    corrections:[
      'Anderson Silva includes seven official UFC losses plus the Nick Diaz no contest as non-loss context.',
      'Chuck Liddell and Junior dos Santos have every late-career UFC loss separated into individual post-prime events.',
      'Dan Henderson has nine actual UFC losses represented even though an older app row lists 8-8; the record-row mismatch is preserved for separate source-data correction.',
      'Joanna Jedrzejczyk receives the locked upward-division treatment for Valentina Shevchenko.',
      'Carla Esparza uses the corrected October 5, 2024 Tecia Pennington retirement-fight date.',
      'T.J. Dillashaw ends at Aljamain Sterling, with the shoulder injury retained as technical context rather than deleting the official loss.',
      'Stipe Miocic treats Jon Jones as a post-prime retirement-fight loss after the Ngannou endpoint.'
    ],
    mutatesEraLossEvents:true,
    mutatesScores:false,
    mutatesPenalty:false,
    appliedAt:new Date().toISOString()
  };
  window.UFC_LOSS_CONTEXT_LEDGER_COMPLETION_BATCH_FIVE=report;
  era.lossContextCompletionBatchFive=report;
  document.documentElement.setAttribute('data-loss-context-completion-batch-five',`${VERSION}-${applied.length}`);
})();
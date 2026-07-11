// Loss Context ledger completion batch four.
// Completes five highest-missing UFC loss ledgers after the first three batches.
// Does not change live penalties, totals, ranks, or OVR.
(function(){
  'use strict';
  const VERSION='loss-context-ledger-completion-batch-four-20260710a-five-highest-missing';
  const era=window.UFC_FIGHTER_ERA_LEDGERS;
  const ledgers=era?.ledgers;

  if(!ledgers){
    window.UFC_LOSS_CONTEXT_LEDGER_COMPLETION_BATCH_FOUR={version:VERSION,applied:false,error:'Missing UFC_FIGHTER_ERA_LEDGERS.',mutatesScores:false};
    return;
  }

  const COMPLETE={
    'Max Holloway':{
      recoveredLosses:[
        {label:'Dustin Poirier I',date:'2012-02-04',type:'pre-prime non-elite finish loss',method:'Submission',notes:'Occurred before the Cub Swanson prime start.'},
        {label:'Dennis Bermudez',date:'2013-05-25',type:'pre-prime non-elite decision loss',method:'Split decision'},
        {label:'Conor McGregor',date:'2013-08-17',type:'pre-prime non-elite decision loss',method:'Decision'},
        {label:'Alexander Volkanovski I',date:'2019-12-14',type:'prime elite title decision loss',method:'Decision',recovery:'Immediate title rematch kept Holloway championship-level.'},
        {label:'Alexander Volkanovski II',date:'2020-07-11',type:'prime elite title decision loss',method:'Split decision',recovery:'Holloway remained an elite featherweight contender.'},
        {label:'Alexander Volkanovski III',date:'2022-07-02',type:'prime elite title decision loss',method:'Decision',recovery:'Later elite wins and the Gaethje BMF performance kept the window open.'},
        {label:'Ilia Topuria',date:'2024-10-26',type:'prime elite title finish loss',method:'KO',recovery:'Holloway later won the Poirier trilogy fight at lightweight.'},
        {label:'Charles Oliveira II',date:'2026-03-07',type:'prime elite decision loss',method:'Decision',notes:'Current-table BMF loss inside Holloway’s still-open elite window.'}
      ],
      upwardDivisionLosses:[
        {label:'Dustin Poirier II',date:'2019-04-13',type:'prime upward-division elite interim-title decision loss',method:'Decision',rule:'reduced upward-division elite-loss treatment',recovery:'Returned to elite featherweight form.'}
      ],
      unrecoveredLoss:null,
      postPrimeLosses:[],
      weirdResults:[]
    },
    'Tony Ferguson':{
      recoveredLosses:[
        {label:'Michael Johnson',date:'2012-05-05',type:'pre-prime non-elite decision loss',method:'Decision'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Justin Gaethje',date:'2020-05-09',type:'prime elite interim-title finish loss',method:'TKO',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Charles Oliveira',date:'2020-12-12',type:'post-prime elite decision loss',method:'Decision'},
        {label:'Beneil Dariush',date:'2021-05-15',type:'post-prime elite decision loss',method:'Decision'},
        {label:'Michael Chandler',date:'2022-05-07',type:'post-prime elite finish loss',method:'KO'},
        {label:'Nate Diaz',date:'2022-09-10',type:'post-prime finish loss',method:'Submission'},
        {label:'Bobby Green',date:'2023-07-29',type:'post-prime finish loss',method:'Technical submission'},
        {label:'Paddy Pimblett',date:'2023-12-16',type:'post-prime decision loss',method:'Decision'},
        {label:'Michael Chiesa',date:'2024-08-03',type:'post-prime finish loss',method:'Submission'}
      ],
      weirdResults:[]
    },
    'Randy Couture':{
      recoveredLosses:[
        {label:'Josh Barnett',date:'2002-03-22',type:'prime elite title finish loss',method:'TKO',notes:'Official title loss; Barnett’s failed drug test remains contextual but does not erase the result.'},
        {label:'Ricco Rodriguez',date:'2002-09-27',type:'prime elite vacant-title finish loss',method:'Submission'},
        {label:'Vitor Belfort II',date:'2004-01-31',type:'prime elite title finish/injury loss',method:'TKO',notes:'Doctor stoppage from an eyelid cut; technical-result context retained.'},
        {label:'Chuck Liddell II',date:'2005-04-16',type:'prime elite title finish loss',method:'KO',recovery:'Couture remained championship-level and fought Liddell again.'},
        {label:'Chuck Liddell III',date:'2006-02-04',type:'prime elite title finish loss',method:'KO',recovery:'Couture later returned to win the UFC heavyweight title.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Brock Lesnar',date:'2008-11-15',type:'prime elite heavyweight-title finish loss',method:'TKO',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Antonio Rodrigo Nogueira',date:'2009-08-29',type:'post-prime elite decision loss',method:'Decision'},
        {label:'Lyoto Machida',date:'2011-04-30',type:'post-prime elite finish loss',method:'KO'}
      ],
      weirdResults:[]
    },
    'Dustin Poirier':{
      recoveredLosses:[
        {label:'Chan Sung Jung',date:'2012-05-15',type:'pre-prime elite finish loss',method:'Submission'},
        {label:'Cub Swanson',date:'2013-02-16',type:'pre-prime elite decision loss',method:'Decision'},
        {label:'Conor McGregor I',date:'2014-09-27',type:'pre-prime non-elite finish loss',method:'KO'},
        {label:'Michael Johnson',date:'2016-09-17',type:'pre-prime non-elite finish loss',method:'KO'},
        {label:'Khabib Nurmagomedov',date:'2019-09-07',type:'prime elite title finish loss',method:'Submission',recovery:'Poirier returned with McGregor wins and another title shot.'},
        {label:'Charles Oliveira',date:'2021-12-11',type:'prime elite title finish loss',method:'Submission',recovery:'Poirier later returned to elite lightweight relevance.'},
        {label:'Justin Gaethje II',date:'2023-07-29',type:'prime elite finish loss',method:'KO',recovery:'Poirier later earned the Islam title fight.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Islam Makhachev',date:'2024-06-01',type:'prime elite title finish loss',method:'Submission',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Max Holloway III',date:'2025-07-19',type:'post-prime elite decision loss',method:'Decision',notes:'Retirement fight after the Islam endpoint.'}
      ],
      weirdResults:[]
    },
    'Miesha Tate':{
      recoveredLosses:[
        {label:'Cat Zingano',date:'2013-04-13',type:'pre-prime elite finish loss',method:'TKO'},
        {label:'Ronda Rousey',date:'2013-12-28',type:'pre-prime elite title finish loss',method:'Submission'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Amanda Nunes',date:'2016-07-09',type:'prime elite title finish loss',method:'Submission',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Raquel Pennington',date:'2016-11-12',type:'post-prime elite decision loss',method:'Decision',notes:'Retirement/exit fight after the Nunes endpoint.'},
        {label:'Ketlen Vieira',date:'2021-11-20',type:'post-prime elite decision loss',method:'Decision'},
        {label:'Lauren Murphy',date:'2022-07-16',type:'post-prime decision loss',method:'Decision'},
        {label:'Yana Santos',date:'2025-05-03',type:'post-prime decision loss',method:'Decision'}
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
      batch:4,
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
    batch:4,
    fighters:Object.keys(COMPLETE),
    applied,
    appliedCount:applied.length,
    missing,
    corrections:[
      'Max Holloway’s Volkanovski trilogy is split into three individual title losses, and the 2026 Oliveira result is included.',
      'Tony Ferguson’s eight-fight post-Gaethje skid is represented as seven post-prime losses plus the Gaethje endpoint.',
      'Randy Couture follows the Cody-approved Vitor Belfort I-to-Brock Lesnar canonical window; Nogueira and Machida are post-prime.',
      'Dustin Poirier includes four pre-prime UFC losses, four prime title/elite losses, and the Holloway retirement fight post-prime.',
      'Miesha Tate’s Cat Zingano and Ronda Rousey losses are pre-prime, Amanda Nunes is the endpoint, and four later losses are post-prime.'
    ],
    mutatesEraLossEvents:true,
    mutatesScores:false,
    mutatesPenalty:false,
    appliedAt:new Date().toISOString()
  };
  window.UFC_LOSS_CONTEXT_LEDGER_COMPLETION_BATCH_FOUR=report;
  era.lossContextCompletionBatchFour=report;
  document.documentElement.setAttribute('data-loss-context-completion-batch-four',`${VERSION}-${applied.length}`);
})();
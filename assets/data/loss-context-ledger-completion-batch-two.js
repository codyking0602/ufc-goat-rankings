// Loss Context ledger completion batch two.
// Completes the five highest-priority missing-loss ledgers after batch one.
// Does not change live penalties, totals, ranks, or OVR.
(function(){
  'use strict';
  const VERSION='loss-context-ledger-completion-batch-two-20260710a-five-highest-priority';
  const era=window.UFC_FIGHTER_ERA_LEDGERS;
  const ledgers=era?.ledgers;

  if(!ledgers){
    window.UFC_LOSS_CONTEXT_LEDGER_COMPLETION_BATCH_TWO={version:VERSION,applied:false,error:'Missing UFC_FIGHTER_ERA_LEDGERS.',mutatesScores:false};
    return;
  }

  const COMPLETE={
    'B.J. Penn':{
      recoveredLosses:[
        {label:'Jens Pulver',date:'2002-01-11',type:'pre-prime elite title decision loss',method:'Decision',notes:'Occurred before the Matt Hughes I prime start.'},
        {label:'Georges St-Pierre I',date:'2006-03-04',type:'prime elite decision loss',method:'Decision',recovery:'Penn remained championship-level and later reclaimed lightweight gold.'},
        {label:'Matt Hughes II',date:'2006-09-23',type:'prime elite title finish loss',method:'TKO',recovery:'Penn returned to lightweight and built another championship run.'},
        {label:'Frankie Edgar I',date:'2010-04-10',type:'prime elite title decision loss',method:'Decision',recovery:'Immediate title rematch kept the prime window open.'}
      ],
      upwardDivisionLosses:[
        {label:'Georges St-Pierre II',date:'2009-01-31',type:'prime upward-division elite title finish loss',method:'TKO',rule:'reduced upward-division elite-loss treatment'}
      ],
      unrecoveredLoss:{label:'Frankie Edgar II',date:'2010-08-28',type:'prime elite title decision loss',method:'Decision',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Nick Diaz',date:'2011-10-29',type:'post-prime elite decision loss',method:'Decision'},
        {label:'Rory MacDonald',date:'2012-12-08',type:'post-prime elite decision loss',method:'Decision'},
        {label:'Frankie Edgar III',date:'2014-07-06',type:'post-prime elite finish loss',method:'TKO'},
        {label:'Yair Rodriguez',date:'2017-01-15',type:'post-prime elite finish loss',method:'TKO'},
        {label:'Dennis Siver',date:'2017-06-25',type:'post-prime decision loss',method:'Decision'},
        {label:'Ryan Hall',date:'2018-12-29',type:'post-prime finish loss',method:'Submission'},
        {label:'Clay Guida',date:'2019-05-11',type:'post-prime decision loss',method:'Decision'}
      ],
      weirdResults:[]
    },
    'Tito Ortiz':{
      recoveredLosses:[
        {label:'Guy Mezger I',date:'1997-05-30',type:'pre-prime non-elite finish loss',method:'Submission',notes:'Tournament loss before the Wanderlei Silva prime start.'},
        {label:'Frank Shamrock',date:'1999-09-24',type:'pre-prime elite title finish loss',method:'TKO',notes:'Title loss before the canonical prime window.'},
        {label:'Randy Couture',date:'2003-09-26',type:'prime elite title decision loss',method:'Decision',recovery:'Tito remained in an elite rivalry/title fight with Chuck Liddell.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Chuck Liddell I',date:'2004-04-02',type:'prime elite finish loss',method:'TKO',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Chuck Liddell II',date:'2006-12-30',type:'post-prime elite title finish loss',method:'TKO'},
        {label:'Lyoto Machida',date:'2008-05-24',type:'post-prime elite decision loss',method:'Decision'},
        {label:'Forrest Griffin II',date:'2009-11-21',type:'post-prime decision loss',method:'Decision'},
        {label:'Matt Hamill',date:'2010-10-23',type:'post-prime decision loss',method:'Decision'},
        {label:'Rashad Evans II',date:'2011-08-06',type:'post-prime elite finish loss',method:'TKO'},
        {label:'Antonio Rogerio Nogueira',date:'2011-12-10',type:'post-prime finish loss',method:'TKO'},
        {label:'Forrest Griffin III',date:'2012-07-07',type:'post-prime decision loss',method:'Decision'}
      ],
      weirdResults:[]
    },
    'Robbie Lawler':{
      recoveredLosses:[
        {label:'Pete Spratt',date:'2003-04-25',type:'pre-prime non-elite finish loss',method:'TKO',notes:'Official early loss before the Koscheck prime start; hip-injury context retained.'},
        {label:'Nick Diaz I',date:'2004-04-02',type:'pre-prime non-elite finish loss',method:'KO',notes:'Early UFC loss before the comeback title run.'},
        {label:'Evan Tanner',date:'2004-10-22',type:'pre-prime elite finish loss',method:'Submission',notes:'Pre-prime loss to a championship-level opponent.'},
        {label:'Johny Hendricks I',date:'2014-03-15',type:'prime elite vacant-title decision loss',method:'Decision',recovery:'Lawler won the UFC title in the rematch.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Tyron Woodley',date:'2016-07-30',type:'prime elite title finish loss',method:'KO',notes:'Canonical championship-prime endpoint.'},
      postPrimeLosses:[
        {label:'Rafael dos Anjos',date:'2017-12-16',type:'post-prime elite decision loss',method:'Decision'},
        {label:'Ben Askren',date:'2019-03-02',type:'post-prime technical submission loss',method:'Technical submission',notes:'Official loss with disputed-stoppage context; post-prime penalty remains zero.'},
        {label:'Colby Covington',date:'2019-08-03',type:'post-prime elite decision loss',method:'Decision'},
        {label:'Neil Magny',date:'2020-08-29',type:'post-prime decision loss',method:'Decision'},
        {label:'Bryan Barberena',date:'2022-07-02',type:'post-prime finish loss',method:'TKO'}
      ],
      weirdResults:[
        {label:'Santiago Ponzinibbio scheduled bout',date:'2022-12-10',notes:'The bout did not occur and is excluded from the loss ledger.'}
      ]
    },
    'Charles Oliveira':{
      recoveredLosses:[
        {label:'Jim Miller I',date:'2010-12-11',type:'pre-prime non-elite finish loss',method:'Submission'},
        {label:'Donald Cerrone',date:'2011-08-14',type:'pre-prime non-elite finish loss',method:'TKO'},
        {label:'Cub Swanson',date:'2012-09-22',type:'pre-prime non-elite finish loss',method:'KO'},
        {label:'Frankie Edgar',date:'2013-07-06',type:'pre-prime elite decision loss',method:'Decision'},
        {label:'Max Holloway',date:'2015-08-23',type:'pre-prime elite finish loss',method:'TKO',notes:'Official injury stoppage before the Kevin Lee prime start.'},
        {label:'Anthony Pettis',date:'2016-08-27',type:'pre-prime elite finish loss',method:'Submission'},
        {label:'Ricardo Lamas',date:'2016-11-05',type:'pre-prime elite finish loss',method:'Submission'},
        {label:'Paul Felder',date:'2017-12-02',type:'pre-prime non-elite finish loss',method:'TKO'},
        {label:'Islam Makhachev',date:'2022-10-22',type:'prime elite title finish loss',method:'Submission',recovery:'Oliveira returned to elite lightweight relevance.'},
        {label:'Arman Tsarukyan',date:'2024-04-13',type:'prime elite decision loss',method:'Decision',recovery:'Canonical window remains open under Cody’s current-prime call.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:null,
      postPrimeLosses:[],
      weirdResults:[]
    },
    'Jessica Andrade':{
      recoveredLosses:[
        {label:'Liz Carmouche',date:'2013-07-27',type:'pre-prime elite finish loss',method:'TKO'},
        {label:'Marion Reneau',date:'2015-02-22',type:'pre-prime non-elite finish loss',method:'Submission'},
        {label:'Raquel Pennington II',date:'2015-09-05',type:'pre-prime elite finish loss',method:'Submission'},
        {label:'Joanna Jedrzejczyk',date:'2017-05-13',type:'pre-prime elite title decision loss',method:'Decision'},
        {label:'Zhang Weili',date:'2019-08-31',type:'prime elite title finish loss',method:'TKO',recovery:'Andrade later re-proved elite form across divisions.'},
        {label:'Rose Namajunas II',date:'2020-07-11',type:'prime elite decision loss',method:'Decision',recovery:'Andrade remained in elite flyweight and strawweight fights.'},
        {label:'Manon Fiorot',date:'2022-09-03',type:'prime elite decision loss',method:'Decision',recovery:'Andrade stayed elite and beat Lauren Murphy afterward.'}
      ],
      upwardDivisionLosses:[
        {label:'Valentina Shevchenko',date:'2021-04-24',type:'prime upward-division elite title finish loss',method:'TKO',rule:'reduced upward-division elite-loss treatment'}
      ],
      unrecoveredLoss:{label:'Erin Blanchfield',date:'2023-02-18',type:'prime elite finish loss',method:'Submission',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Yan Xiaonan',date:'2023-05-06',type:'post-prime elite finish loss',method:'TKO'},
        {label:'Tatiana Suarez',date:'2023-08-05',type:'post-prime elite finish loss',method:'Submission'},
        {label:'Natalia Silva',date:'2024-09-07',type:'post-prime elite decision loss',method:'Decision'},
        {label:'Jasmine Jasudavicius',date:'2025-05-10',type:'post-prime elite finish loss',method:'Submission'}
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
      batch:2,
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
    batch:2,
    fighters:Object.keys(COMPLETE),
    applied,
    appliedCount:applied.length,
    missing,
    corrections:[
      'Robbie Lawler vs Santiago Ponzinibbio was a scheduled bout that did not occur and is excluded.',
      'Canonical windows control phase labels even when older packet copy described a later loss as late-prime.'
    ],
    mutatesEraLossEvents:true,
    mutatesScores:false,
    mutatesPenalty:false,
    appliedAt:new Date().toISOString()
  };
  window.UFC_LOSS_CONTEXT_LEDGER_COMPLETION_BATCH_TWO=report;
  era.lossContextCompletionBatchTwo=report;
  document.documentElement.setAttribute('data-loss-context-completion-batch-two',`${VERSION}-${applied.length}`);
})();

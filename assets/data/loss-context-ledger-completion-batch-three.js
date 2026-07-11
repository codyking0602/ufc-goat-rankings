// Loss Context ledger completion batch three.
// Completes five high-priority retired/veteran UFC loss ledgers from canonical Era windows.
// Does not change live penalties, totals, ranks, or OVR.
(function(){
  'use strict';
  const VERSION='loss-context-ledger-completion-batch-three-20260710a-five-veteran-ledgers';
  const era=window.UFC_FIGHTER_ERA_LEDGERS;
  const ledgers=era?.ledgers;

  if(!ledgers){
    window.UFC_LOSS_CONTEXT_LEDGER_COMPLETION_BATCH_THREE={version:VERSION,applied:false,error:'Missing UFC_FIGHTER_ERA_LEDGERS.',mutatesScores:false};
    return;
  }

  const COMPLETE={
    'Frankie Edgar':{
      recoveredLosses:[
        {label:'Gray Maynard I',date:'2008-04-02',type:'pre-prime non-elite decision loss',method:'Decision',notes:'Occurred before the Sean Sherk prime start.'},
        {label:'Benson Henderson I',date:'2012-02-26',type:'prime elite title decision loss',method:'Decision',recovery:'Immediate title rematch kept Edgar at championship level.'},
        {label:'Benson Henderson II',date:'2012-08-11',type:'prime elite title decision loss',method:'Split decision',recovery:'Edgar moved to featherweight and immediately remained title-level.'},
        {label:'Jose Aldo I',date:'2013-02-02',type:'prime elite title decision loss',method:'Decision',recovery:'Edgar rebuilt into another featherweight title fight.'},
        {label:'Jose Aldo II',date:'2016-07-09',type:'prime elite interim-title decision loss',method:'Decision',recovery:'Edgar remained an elite featherweight contender afterward.'},
        {label:'Brian Ortega',date:'2018-03-03',type:'prime elite finish loss',method:'KO',recovery:'Edgar returned to a UFC featherweight title fight against Max Holloway.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Max Holloway',date:'2019-07-27',type:'prime elite title decision loss',method:'Decision',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Chan Sung Jung',date:'2019-12-21',type:'post-prime elite finish loss',method:'TKO'},
        {label:'Cory Sandhagen',date:'2021-02-06',type:'post-prime elite finish loss',method:'KO'},
        {label:'Marlon Vera',date:'2021-11-06',type:'post-prime elite finish loss',method:'KO'},
        {label:'Chris Gutierrez',date:'2022-11-12',type:'post-prime finish loss',method:'KO'}
      ],
      weirdResults:[]
    },
    'Michael Bisping':{
      recoveredLosses:[
        {label:'Rashad Evans',date:'2007-11-17',type:'pre-prime elite decision loss',method:'Split decision'},
        {label:'Dan Henderson I',date:'2009-07-11',type:'pre-prime elite finish loss',method:'KO'},
        {label:'Wanderlei Silva',date:'2010-02-21',type:'pre-prime non-elite decision loss',method:'Decision'},
        {label:'Chael Sonnen',date:'2012-01-28',type:'pre-prime elite decision loss',method:'Decision'},
        {label:'Vitor Belfort',date:'2013-01-19',type:'pre-prime elite finish loss',method:'TKO'},
        {label:'Tim Kennedy',date:'2014-04-16',type:'pre-prime non-elite decision loss',method:'Decision'},
        {label:'Luke Rockhold I',date:'2014-11-08',type:'pre-prime elite finish loss',method:'Submission'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Georges St-Pierre',date:'2017-11-04',type:'prime elite title finish loss',method:'Submission',notes:'Canonical late-title-prime endpoint.'},
      postPrimeLosses:[
        {label:'Kelvin Gastelum',date:'2017-11-25',type:'post-prime finish loss',method:'KO',notes:'Quick-turnaround retirement-fight context after the GSP endpoint.'}
      ],
      weirdResults:[]
    },
    'Lyoto Machida':{
      recoveredLosses:[
        {label:'Mauricio Rua II',date:'2010-05-08',type:'prime elite title finish loss',method:'KO',recovery:'Machida later returned to UFC title relevance.'},
        {label:'Quinton Jackson',date:'2010-11-20',type:'prime elite decision loss',method:'Split decision',recovery:'Machida remained in the elite light-heavyweight title picture.'},
        {label:'Jon Jones',date:'2011-12-10',type:'prime elite title finish loss',method:'Submission',recovery:'Machida later re-proved elite form at middleweight.'},
        {label:'Phil Davis',date:'2013-08-03',type:'prime elite decision loss',method:'Decision',recovery:'Machida moved to middleweight and earned a UFC title fight.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Chris Weidman',date:'2014-07-05',type:'prime elite title decision loss',method:'Decision',notes:'Canonical cross-division prime endpoint.'},
      postPrimeLosses:[
        {label:'Luke Rockhold',date:'2015-04-18',type:'post-prime elite finish loss',method:'Submission'},
        {label:'Yoel Romero',date:'2015-06-27',type:'post-prime elite finish loss',method:'KO'},
        {label:'Derek Brunson',date:'2017-10-28',type:'post-prime finish loss',method:'KO'}
      ],
      weirdResults:[]
    },
    'Matt Hughes':{
      recoveredLosses:[
        {label:'Dennis Hallman',date:'2000-12-16',type:'pre-prime non-elite finish loss',method:'Submission',notes:'UFC loss before the Carlos Newton I prime start.'},
        {label:'B.J. Penn I',date:'2004-01-31',type:'prime elite title finish loss',method:'Submission',recovery:'Hughes rebuilt into another UFC championship run.'},
        {label:'Georges St-Pierre II',date:'2006-11-18',type:'prime elite title finish loss',method:'TKO',recovery:'Hughes remained title-level and fought for the interim belt.'}
      ],
      upwardDivisionLosses:[],
      unrecoveredLoss:{label:'Georges St-Pierre III',date:'2007-12-29',type:'prime elite interim-title finish loss',method:'Submission',notes:'Canonical prime endpoint.'},
      postPrimeLosses:[
        {label:'Thiago Alves',date:'2008-06-07',type:'post-prime elite finish loss',method:'TKO'},
        {label:'B.J. Penn III',date:'2010-11-20',type:'post-prime elite finish loss',method:'KO'},
        {label:'Josh Koscheck',date:'2011-09-24',type:'post-prime elite finish loss',method:'KO'}
      ],
      weirdResults:[]
    },
    'Chael Sonnen':{
      recoveredLosses:[
        {label:'Renato Sobral',date:'2005-10-07',type:'pre-prime elite finish loss',method:'Submission'},
        {label:'Jeremy Horn',date:'2006-05-26',type:'pre-prime elite finish loss',method:'Submission'},
        {label:'Demian Maia',date:'2009-02-21',type:'pre-prime elite finish loss',method:'Submission'},
        {label:'Anderson Silva I',date:'2010-08-07',type:'prime elite title finish loss',method:'Submission',recovery:'Sonnen remained title-level and earned another Anderson title fight.'},
        {label:'Anderson Silva II',date:'2012-07-07',type:'prime elite title finish loss',method:'TKO',recovery:'Sonnen moved up and received the Jon Jones title fight.'}
      ],
      upwardDivisionLosses:[
        {label:'Jon Jones',date:'2013-04-27',type:'prime upward-division elite title finish loss',method:'TKO',rule:'reduced upward-division elite-loss treatment',notes:'Canonical prime endpoint.'}
      ],
      unrecoveredLoss:null,
      postPrimeLosses:[
        {label:'Rashad Evans',date:'2013-11-16',type:'post-prime elite finish loss',method:'TKO'}
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
      batch:3,
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
    batch:3,
    fighters:Object.keys(COMPLETE),
    applied,
    appliedCount:applied.length,
    missing,
    corrections:[
      'Frankie Edgar losses are split into 11 individual UFC events instead of grouped rivalry summaries.',
      'Michael Bisping includes the omitted Wanderlei Silva UFC loss and follows the locked Anderson Silva-to-GSP prime window.',
      'Matt Hughes prime start remains Carlos Newton I; the prior Newton II label was corrected by the canonical window lock.',
      'Chael Sonnen title losses are individual events; Jon Jones receives the locked upward-division elite-loss treatment.'
    ],
    mutatesEraLossEvents:true,
    mutatesScores:false,
    mutatesPenalty:false,
    appliedAt:new Date().toISOString()
  };
  window.UFC_LOSS_CONTEXT_LEDGER_COMPLETION_BATCH_THREE=report;
  era.lossContextCompletionBatchThree=report;
  document.documentElement.setAttribute('data-loss-context-completion-batch-three',`${VERSION}-${applied.length}`);
})();
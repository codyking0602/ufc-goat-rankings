(function(){
  const VERSION='final-batch-loss-ledgers-20260707b';
  const CAP=-10,N='normal',X='none',R='reducedInjury';
  const WRITES=[
    ['Charles Oliveira',-10],['Frankie Edgar',-6],['Lyoto Machida',-10],['Conor McGregor',-6.75],
    ['Sean Strickland',-9.25],['Robert Whittaker',-10],['Dan Henderson',-3.75],['Brock Lesnar',-6],
    ['Tony Ferguson',-5],['Michael Bisping',-10],['Chael Sonnen',-8],['Robbie Lawler',-8.75],
    ['Miesha Tate',-6],['Holly Holm',-8.25],['Jessica Andrade',-10],['Carla Esparza',-9.75]
  ];
  const MAP=Object.fromEntries(WRITES);
  const L={
    'Charles Oliveira':[
      {opponent:'Jim Miller',phase:'prePrime',opponentTier:'nonElite',finished:true,finishTreatment:N,counted:true},
      {opponent:'Donald Cerrone',phase:'prePrime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Cub Swanson',phase:'prePrime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Frankie Edgar',phase:'prePrime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Anthony Pettis',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Ricardo Lamas',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Paul Felder',phase:'prePrime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Islam Makhachev',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Arman Tsarukyan',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true}
    ],
    'Frankie Edgar':[
      {opponent:'Benson Henderson',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Benson Henderson',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Jose Aldo',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Jose Aldo',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Brian Ortega',phase:'postPrime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Max Holloway',phase:'postPrime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true}
    ],
    'Lyoto Machida':[
      {opponent:'Shogun Rua',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Rampage Jackson',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Jon Jones',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Phil Davis',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Chris Weidman',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Yoel Romero',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true}
    ],
    'Conor McGregor':[
      {opponent:'Nate Diaz',phase:'prime',opponentTier:'nonElite',finished:true,finishTreatment:N,counted:true,penaltyOverride:-4.50,notes:'Prime short-notice welterweight loss; still treated as major upset.'},
      {opponent:'Khabib Nurmagomedov',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Dustin Poirier',phase:'postPrime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Dustin Poirier',phase:'postPrime',opponentTier:'championTop5',finished:true,finishTreatment:R,counted:true}
    ],
    'Sean Strickland':[
      {opponent:'Santiago Ponzinibbio',phase:'prePrime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Kamaru Usman',phase:'prePrime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Elizeu Zaleski',phase:'prePrime',opponentTier:'nonElite',finished:true,finishTreatment:N,counted:true},
      {opponent:'Alex Pereira',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Jared Cannonier',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true,penaltyOverride:-1.25},
      {opponent:'Dricus du Plessis',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Khamzat Chimaev',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true}
    ],
    'Robert Whittaker':[
      {opponent:'Court McGee',phase:'prePrime',opponentTier:'nonElite',finished:false,finishTreatment:X,counted:true},
      {opponent:'Stephen Thompson',phase:'prePrime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Israel Adesanya',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Israel Adesanya',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Dricus du Plessis',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Khamzat Chimaev',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true}
    ],
    'Dan Henderson':[
      {opponent:'Rampage Jackson',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Anderson Silva',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Vitor Belfort',phase:'postPrime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Daniel Cormier',phase:'postPrime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Michael Bisping',phase:'postPrime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true}
    ],
    'Brock Lesnar':[
      {opponent:'Frank Mir',phase:'prePrime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Cain Velasquez',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Alistair Overeem',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true}
    ],
    'Tony Ferguson':[
      {opponent:'Michael Johnson',phase:'prePrime',opponentTier:'nonElite',finished:false,finishTreatment:X,counted:true},
      {opponent:'Justin Gaethje',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Charles Oliveira',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Beneil Dariush',phase:'postPrime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true}
    ],
    'Michael Bisping':[
      {opponent:'Rashad Evans',phase:'prePrime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Dan Henderson',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Wanderlei Silva',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Chael Sonnen',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Vitor Belfort',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Luke Rockhold',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Georges St-Pierre',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Kelvin Gastelum',phase:'postPrime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true}
    ],
    'Chael Sonnen':[
      {opponent:'Demian Maia',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Anderson Silva',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Anderson Silva',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Jon Jones',phase:'prime',opponentTier:'championTop5',upwardDivision:true,finished:true,finishTreatment:N,counted:true}
    ],
    'Robbie Lawler':[
      {opponent:'Pete Spratt',phase:'prePrime',opponentTier:'nonElite',finished:true,finishTreatment:N,counted:true,penaltyOverride:-1.50},
      {opponent:'Nick Diaz',phase:'prePrime',opponentTier:'nonElite',finished:true,finishTreatment:N,counted:true},
      {opponent:'Johny Hendricks',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Tyron Woodley',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Rafael dos Anjos',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true}
    ],
    'Miesha Tate':[
      {opponent:'Cat Zingano',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Ronda Rousey',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Amanda Nunes',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true,penaltyOverride:-1.50},
      {opponent:'Julianna Peña',phase:'postPrime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true}
    ],
    'Holly Holm':[
      {opponent:'Miesha Tate',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Valentina Shevchenko',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Germaine de Randamie',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Cris Cyborg',phase:'prime',opponentTier:'championTop5',upwardDivision:true,finished:false,finishTreatment:X,counted:true},
      {opponent:'Amanda Nunes',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true}
    ],
    'Jessica Andrade':[
      {opponent:'Liz Carmouche',phase:'prePrime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Marion Reneau',phase:'prePrime',opponentTier:'nonElite',finished:true,finishTreatment:N,counted:true},
      {opponent:'Joanna Jedrzejczyk',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Zhang Weili',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Rose Namajunas',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Valentina Shevchenko',phase:'prime',opponentTier:'championTop5',upwardDivision:true,finished:true,finishTreatment:N,counted:true},
      {opponent:'Natalia Silva',phase:'postPrime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true}
    ],
    'Carla Esparza':[
      {opponent:'Joanna Jedrzejczyk',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Claudia Gadelha',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Tatiana Suarez',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true},
      {opponent:'Marina Rodriguez',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:X,counted:true},
      {opponent:'Zhang Weili',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:N,counted:true}
    ]
  };
  function num(v,d=0){const n=Number(v);return Number.isFinite(n)?n:d;}
  function round2(v){return Math.round((num(v)+Number.EPSILON)*100)/100;}
  function oldPenalty(f){return num(f?.penalty??f?.lossPenalty??f?.scoring?.penalty??0);}
  function positive(f){const p=num(f?.weightedScoreBreakdown?.positiveScore,NaN);return Number.isFinite(p)?p:round2(num(f?.totalScore)-oldPenalty(f));}
  function write(f,val){
    const target=Math.max(CAP,round2(val));
    const prev={totalScore:f.totalScore,penalty:f.penalty,lossPenalty:f.lossPenalty};
    const pos=positive(f),total=round2(pos+target);
    f.penalty=target;f.lossPenalty=target;f.totalScore=total;
    if(f.scoring)f.scoring.penalty=target;
    if(f.weightedScoreBreakdown){f.weightedScoreBreakdown.penalty=target;f.weightedScoreBreakdown.totalScore=total;}
    if(f.display?.scoreSummary){f.display.scoreSummary.lossContext=target;f.display.scoreSummary.totalScore=total;}
    f.lossContextScoreWriteVersion=VERSION;f.lossContextScoreWrite={previous:prev,positiveScore:pos,targetPenalty:target,source:'final ledger batch'};
    return {fighter:f.fighter,previous:prev,next:{totalScore:total,penalty:target,lossPenalty:target}};
  }
  function refreshReports(rows){
    const engine=window.UFC_SCORING_ENGINE;
    if(!engine?.calculateScore)return;
    const report=rows.map(f=>{const calc=engine.calculateScore(f);f.calculatedScore=calc;f.modelScore=calc;f.lossContextAudit=calc.lossContextAudit;return {fighter:f.fighter,storedTotalScore:calc.storedTotalScore,calculatedTotalScore:calc.totalScore,delta:calc.delta,storedLossPenalty:calc.storedLossPenalty,calculatedLossPenalty:calc.calculatedLossPenalty,rawCalculatedLossPenalty:calc.rawCalculatedLossPenalty,lossPenaltyDelta:calc.lossPenaltyDelta,lossContextStatus:calc.lossContextStatus};});
    window.UFC_SCORING_ENGINE_REPORT=report.sort((a,b)=>Math.abs(num(b.delta))-Math.abs(num(a.delta)));
    window.UFC_LOSS_CONTEXT_REPORT=report.filter(r=>r.lossContextStatus!=='missing-ledger'||r.calculatedLossPenalty!==null).sort((a,b)=>Math.abs(num(b.lossPenaltyDelta))-Math.abs(num(a.lossPenaltyDelta)));
    engine.report=window.UFC_SCORING_ENGINE_REPORT;engine.lossContextReport=window.UFC_LOSS_CONTEXT_REPORT;
  }
  const rows=Array.isArray(window.RANKING_DATA?.fighters)?window.RANKING_DATA.fighters:[];
  const applied=[],ledgerApplied=[];
  rows.forEach(f=>{if(!f?.fighter)return;if(Object.prototype.hasOwnProperty.call(L,f.fighter)){f.losses=L[f.fighter].map(x=>({...x}));f.lossContextLedgerVersion=VERSION;ledgerApplied.push(f.fighter);}if(Object.prototype.hasOwnProperty.call(MAP,f.fighter))applied.push(write(f,MAP[f.fighter]));});
  refreshReports(rows);
  if(typeof refresh==='function'){try{refresh();}catch(e){}}
  window.UFC_FINAL_BATCH_SCORES={version:VERSION,cap:CAP,applied,ledgerApplied,writes:MAP,ledgers:L};
  document.documentElement.setAttribute('data-final-batch-scores',VERSION);
})();

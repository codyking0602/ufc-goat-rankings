// First-pass loss context ledgers + first approved score writes.
(function(){
  const VERSION='loss-context-ledgers-v1-20260707b-score-writes';
  const n='normal', r='reducedInjury', x='none';
  const L={
    'Jon Jones':[
      {opponent:'Matt Hamill',phase:'prePrime',opponentTier:'nonElite',finished:false,finishTreatment:x,counted:false,penaltyOverride:0,notes:'Technical DQ; not treated as a real competitive loss.'}
    ],
    'Khabib Nurmagomedov':[],
    'Islam Makhachev':[
      {opponent:'Adriano Martins',phase:'prePrime',opponentTier:'nonElite',finished:true,finishTreatment:n,counted:true}
    ],
    'Georges St-Pierre':[
      {opponent:'Matt Hughes',phase:'prePrime',opponentTier:'championTop5',finished:true,finishTreatment:n,counted:true},
      {opponent:'Matt Serra',phase:'prime',opponentTier:'nonElite',finished:true,finishTreatment:n,counted:true,notes:'Locked as prime non-elite upset loss.'}
    ],
    'Demetrious Johnson':[
      {opponent:'Dominick Cruz',phase:'prePrime',opponentTier:'championTop5',finished:false,finishTreatment:x,counted:true},
      {opponent:'Henry Cejudo',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:x,counted:true}
    ],
    'Anderson Silva':[
      {opponent:'Chris Weidman',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:n,counted:true},
      {opponent:'Chris Weidman',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:r,counted:true,notes:'Reduced injury/technical finish treatment.'},
      {opponent:'Michael Bisping',phase:'postPrime',opponentTier:'championTop5',finished:false,finishTreatment:x,counted:true},
      {opponent:'Daniel Cormier',phase:'postPrime',opponentTier:'championTop5',upwardDivision:true,finished:false,finishTreatment:x,counted:true},
      {opponent:'Jared Cannonier',phase:'postPrime',opponentTier:'championTop5',finished:true,finishTreatment:r,counted:true},
      {opponent:'Uriah Hall',phase:'postPrime',opponentTier:'nonElite',finished:true,finishTreatment:n,counted:true}
    ],
    'Alexander Volkanovski':[
      {opponent:'Islam Makhachev',phase:'prime',opponentTier:'championTop5',upwardDivision:true,finished:false,finishTreatment:x,counted:true},
      {opponent:'Islam Makhachev',phase:'prime',opponentTier:'championTop5',upwardDivision:true,finished:true,finishTreatment:n,counted:true},
      {opponent:'Ilia Topuria',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:n,counted:true}
    ],
    'Kamaru Usman':[
      {opponent:'Leon Edwards',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:n,counted:true},
      {opponent:'Leon Edwards',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:x,counted:true},
      {opponent:'Khamzat Chimaev',phase:'prime',opponentTier:'championTop5',upwardDivision:true,finished:false,finishTreatment:x,counted:true}
    ],
    'Daniel Cormier':[
      {opponent:'Jon Jones',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:x,counted:true},
      {opponent:'Jon Jones',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:n,counted:false,penaltyOverride:0,notes:'Overturned no contest.'},
      {opponent:'Stipe Miocic',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:n,counted:true},
      {opponent:'Stipe Miocic',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:x,counted:true}
    ],
    'Stipe Miocic':[
      {opponent:'Stefan Struve',phase:'prePrime',opponentTier:'nonElite',finished:true,finishTreatment:n,counted:true},
      {opponent:'Junior dos Santos',phase:'prePrime',opponentTier:'championTop5',finished:false,finishTreatment:x,counted:true},
      {opponent:'Daniel Cormier',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:n,counted:true},
      {opponent:'Francis Ngannou',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:n,counted:true},
      {opponent:'Jon Jones',phase:'postPrime',opponentTier:'championTop5',finished:true,finishTreatment:n,counted:true}
    ],
    'Zhang Weili':[
      {opponent:'Rose Namajunas',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:n,counted:true},
      {opponent:'Rose Namajunas',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:x,counted:true},
      {opponent:'Valentina Shevchenko',phase:'prime',opponentTier:'championTop5',upwardDivision:true,finished:false,finishTreatment:x,counted:true}
    ],
    'Amanda Nunes':[
      {opponent:'Cat Zingano',phase:'prePrime',opponentTier:'championTop5',finished:true,finishTreatment:n,counted:true},
      {opponent:'Julianna Peña',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:n,counted:true}
    ],
    'Valentina Shevchenko':[
      {opponent:'Amanda Nunes',phase:'prime',opponentTier:'championTop5',upwardDivision:true,finished:false,finishTreatment:x,counted:true},
      {opponent:'Amanda Nunes',phase:'prime',opponentTier:'championTop5',upwardDivision:true,finished:false,finishTreatment:x,counted:true},
      {opponent:'Alexa Grasso',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:n,counted:true}
    ],
    'Joanna Jedrzejczyk':[
      {opponent:'Rose Namajunas',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:n,counted:true},
      {opponent:'Rose Namajunas',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:x,counted:true},
      {opponent:'Valentina Shevchenko',phase:'prime',opponentTier:'championTop5',upwardDivision:true,finished:false,finishTreatment:x,counted:true},
      {opponent:'Zhang Weili',phase:'postPrime',opponentTier:'championTop5',finished:true,finishTreatment:n,counted:true}
    ],
    'Ronda Rousey':[
      {opponent:'Holly Holm',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:n,counted:true},
      {opponent:'Amanda Nunes',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:n,counted:true}
    ]
  };
  const W={
    'Georges St-Pierre':{penalty:-6.25,totalScore:82.15,reason:'Hughes pre-prime elite finish plus Serra prime non-elite finish.'},
    'Anderson Silva':{penalty:-4.25,totalScore:71.94,reason:'Weidman I normal elite finish plus Weidman II reduced injury/technical finish.'}
  };
  function num(v,d=0){const z=Number(v);return Number.isFinite(z)?z:d;}
  function round2(v){return Math.round((num(v)+Number.EPSILON)*100)/100;}
  function apply(){
    const rows=Array.isArray(window.RANKING_DATA?.fighters)?window.RANKING_DATA.fighters:[];
    const applied=[];const writes=[];
    rows.forEach(f=>{
      if(!f?.fighter)return;
      if(Object.prototype.hasOwnProperty.call(L,f.fighter)){
        f.losses=L[f.fighter].map(row=>({...row}));
        f.lossContextLedgerVersion=VERSION;
        if(f.fighter==='Khabib Nurmagomedov')f.lossContextNoLosses=true;
        applied.push(f.fighter);
      }
      const w=W[f.fighter];
      if(w){
        const previous={totalScore:f.totalScore,penalty:f.penalty,lossPenalty:f.lossPenalty,scoringPenalty:f.scoring?.penalty,weightedPenalty:f.weightedScoreBreakdown?.penalty,weightedTotalScore:f.weightedScoreBreakdown?.totalScore};
        f.penalty=w.penalty;f.lossPenalty=w.penalty;f.totalScore=w.totalScore;
        if(f.scoring)f.scoring.penalty=w.penalty;
        if(f.weightedScoreBreakdown){f.weightedScoreBreakdown.penalty=w.penalty;f.weightedScoreBreakdown.totalScore=Number.isFinite(num(f.weightedScoreBreakdown.positiveScore,NaN))?round2(num(f.weightedScoreBreakdown.positiveScore)+w.penalty):w.totalScore;}
        f.lossContextScoreWriteVersion=VERSION;f.lossContextScoreWrite={reason:w.reason,source:'docs/loss-context-batch1-shadow-review-20260707.md',previous};
        writes.push({fighter:f.fighter,previous,next:{totalScore:f.totalScore,penalty:f.penalty,lossPenalty:f.lossPenalty}});
      }
    });
    window.UFC_LOSS_CONTEXT_LEDGERS_V1={version:VERSION,applied,scoreWritesApplied:writes,ledgers:L,scoreWrites:W};
    window.UFC_LOSS_CONTEXT_SCORE_WRITES_V1={version:VERSION,applied:writes,writes:W};
    document.documentElement.setAttribute('data-loss-context-ledgers',VERSION);
    document.documentElement.setAttribute('data-loss-context-score-writes',VERSION);
  }
  apply();
})();

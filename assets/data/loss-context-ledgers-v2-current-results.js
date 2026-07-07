// Current-result loss context ledgers. Shadow/audit only.
(function(){
  const VERSION='loss-context-ledgers-v2-20260707a-current-results';
  const L={
    'Ilia Topuria':[
      {opponent:'Justin Gaethje',phase:'prime',opponentTier:'championTop5',finished:true,finishTreatment:'normal',counted:true,notes:'Recent lightweight title loss; prime same-division elite finish.'}
    ],
    'Khamzat Chimaev':[
      {opponent:'Sean Strickland',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:'none',counted:true,notes:'Recent middleweight title loss; prime elite split decision.'}
    ],
    'Dricus du Plessis':[
      {opponent:'Khamzat Chimaev',phase:'prime',opponentTier:'championTop5',finished:false,finishTreatment:'none',counted:true,notes:'Middleweight title loss; prime elite decision.'}
    ],
    'Kayla Harrison':[]
  };
  function apply(){
    const rows=Array.isArray(window.RANKING_DATA?.fighters)?window.RANKING_DATA.fighters:[];
    const applied=[];
    rows.forEach(f=>{
      if(!f?.fighter)return;
      if(Object.prototype.hasOwnProperty.call(L,f.fighter)){
        f.losses=L[f.fighter].map(row=>({...row}));
        f.lossContextLedgerVersion=VERSION;
        if(f.fighter==='Kayla Harrison')f.lossContextNoLosses=true;
        applied.push(f.fighter);
      }
    });
    window.UFC_LOSS_CONTEXT_LEDGERS_V2={version:VERSION,applied,ledgers:L};
    document.documentElement.setAttribute('data-loss-context-ledgers-v2',VERSION);
  }
  apply();
})();

// Opponent Quality division calibration: batch-four group. Shadow-only.
(function(){
  const VERSION='opponent-quality-division-calibration-batch-four-20260708a';
  const store=window.UFC_OPPONENT_QUALITY_LEDGERS;
  const RAW=store?.raw;
  if(!RAW)return;
  const changes=[];
  const P=[
    ['Kamaru Usman','Leon Edwards I',0.85,'Strong top-10 win'],
    ['Kamaru Usman','Rafael dos Anjos',0.85,'Strong top-10 win'],
    ['Kamaru Usman','Jorge Masvidal II',0.65,'Ranked / quality win'],
    ['Israel Adesanya','Alex Pereira II',1.15,'Elite divisional win'],
    ['Israel Adesanya','Yoel Romero',0.85,'Strong top-10 win'],
    ['Israel Adesanya','Anderson Silva',0.45,'Solid resume win'],
    ['Alex Pereira','Jamahal Hill',0.85,'Strong top-10 win'],
    ['Alex Pereira','Khalil Rountree',0.65,'Ranked / quality win'],
    ['Robert Whittaker','Paulo Costa',0.85,'Strong top-10 win'],
    ['Robert Whittaker','Darren Till',0.65,'Ranked / quality win'],
    ['Daniel Cormier','Derrick Lewis',0.85,'Strong top-10 win'],
    ['Daniel Cormier','Anderson Silva',0.45,'Solid resume win'],
    ['Daniel Cormier','Frank Mir',0.45,'Solid resume win'],
    ['Daniel Cormier','Dan Henderson',0.25,'Name-value / faded / unproven'],
    ['Stipe Miocic','Junior dos Santos II',0.85,'Strong top-10 win'],
    ['Stipe Miocic','Andrei Arlovski',0.65,'Ranked / quality win'],
    ['Cain Velasquez','Brock Lesnar',0.85,'Strong top-10 win'],
    ['Cain Velasquez','Antonio Rodrigo Nogueira',0.65,'Ranked / quality win'],
    ['Cain Velasquez','Antonio Silva II',0.65,'Ranked / quality win'],
    ['Henry Cejudo','T.J. Dillashaw',0.85,'Strong top-10 win'],
    ['Henry Cejudo','Dominick Cruz',0.65,'Ranked / quality win']
  ];
  function patch([fighter,opponent,credit,label]){
    const row=RAW[fighter]?.find(r=>Array.isArray(r)&&r[0]===opponent);
    if(!row)return;
    changes.push({fighter,opponent,from:row[1],to:credit});
    row[1]=credit; row[2]=label; row[3]=(row[3]||'')+' Division/timing calibrated.'; row[4]='review';
  }
  P.forEach(patch);
  store.version=VERSION;
  store.batchFourDivisionCalibration={version:VERSION,changes,appliedAt:new Date().toISOString()};
  document.documentElement.setAttribute('data-opponent-quality-division-calibration-batch-four',VERSION);
})();
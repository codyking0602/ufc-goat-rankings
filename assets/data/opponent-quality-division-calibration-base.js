// Opponent Quality division calibration: base ledger group. Shadow-only.
(function(){
  const VERSION='opponent-quality-division-calibration-base-20260708a';
  const store=window.UFC_OPPONENT_QUALITY_LEDGERS;
  const RAW=store?.raw;
  if(!RAW)return;
  const changes=[];
  const P=[
    ['Georges St-Pierre','Michael Bisping',0.85,'Strong top-10 win'],
    ['Jon Jones','Quinton Jackson',0.85,'Strong top-10 win'],
    ['Jon Jones','Vitor Belfort',0.65,'Ranked / quality win'],
    ['Jon Jones','Anthony Smith',0.65,'Ranked / quality win'],
    ['Jon Jones','Stipe Miocic',0.45,'Solid resume win'],
    ['Khabib Nurmagomedov','Conor McGregor',1.15,'Elite divisional win'],
    ['Khabib Nurmagomedov','Michael Johnson',0.65,'Ranked / quality win'],
    ['Khabib Nurmagomedov','Al Iaquinta',0.45,'Solid resume win'],
    ['Khabib Nurmagomedov','Gleison Tibau',0.45,'Solid resume win'],
    ['Islam Makhachev','Alexander Volkanovski II',0.85,'Strong top-10 win'],
    ['Islam Makhachev','Dan Hooker',0.65,'Ranked / quality win'],
    ['Islam Makhachev','Bobby Green',0.45,'Solid resume win'],
    ['Alexander Volkanovski','Chad Mendes',0.65,'Ranked / quality win'],
    ['Alexander Volkanovski','Korean Zombie',0.45,'Solid resume win'],
    ['Max Holloway','Frankie Edgar',0.85,'Strong top-10 win'],
    ['Max Holloway','Anthony Pettis',0.65,'Ranked / quality win'],
    ['Max Holloway','Charles Oliveira',0.45,'Solid resume win'],
    ['Jose Aldo','Kenny Florian',0.85,'Strong top-10 win'],
    ['Jose Aldo','Korean Zombie',0.85,'Strong top-10 win'],
    ['Jose Aldo','Mark Hominick',0.65,'Ranked / quality win'],
    ['Charles Oliveira','Tony Ferguson',0.85,'Strong top-10 win'],
    ['Charles Oliveira','Kevin Lee',0.65,'Ranked / quality win'],
    ['Charles Oliveira','Michael Chandler II',0.65,'Ranked / quality win'],
    ['Charles Oliveira','Jeremy Stephens',0.45,'Solid resume win'],
    ['Dustin Poirier','Conor McGregor II',0.85,'Strong top-10 win'],
    ['Dustin Poirier','Anthony Pettis',0.65,'Ranked / quality win'],
    ['Dustin Poirier','Conor McGregor III',0.65,'Ranked / quality win'],
    ['Justin Gaethje','Michael Chandler',0.85,'Strong top-10 win'],
    ['Justin Gaethje','Paddy Pimblett',0.65,'Ranked / quality win'],
    ['Justin Gaethje','Donald Cerrone',0.65,'Ranked / quality win'],
    ['Justin Gaethje','James Vick',0.45,'Solid resume win']
  ];
  function patch([fighter,opponent,credit,label]){
    const row=RAW[fighter]?.find(r=>Array.isArray(r)&&r[0]===opponent);
    if(!row)return;
    changes.push({fighter,opponent,from:row[1],to:credit});
    row[1]=credit; row[2]=label; row[3]=(row[3]||'')+' Division/timing calibrated.'; row[4]='review';
  }
  P.forEach(patch);
  store.version=VERSION;
  store.baseDivisionCalibration={version:VERSION,changes,appliedAt:new Date().toISOString()};
  document.documentElement.setAttribute('data-opponent-quality-division-calibration-base',VERSION);
})();
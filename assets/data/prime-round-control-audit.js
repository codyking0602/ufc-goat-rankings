// Prime Dominance round-control audit. Shadow data only.
(function(){
  const VERSION='prime-round-control-audit-20260708a';
  const RAW={
    'Khabib Nurmagomedov':{window:'RDA 2014 → Gaethje 2020',status:'locked',fights:[['Rafael dos Anjos',3,0],['Darrell Horcher',2,0],['Michael Johnson',3,0],['Edson Barboza',3,0],['Al Iaquinta',5,0],['Conor McGregor',3,1,'McGregor R3'],['Dustin Poirier',3,0],['Justin Gaethje',2,0]]},
    'Georges St-Pierre':{window:'Hughes II 2006 → Bisping 2017',status:'locked',fights:[['Matt Hughes II',2,0],['Matt Serra I',0,1],['Josh Koscheck I',2,1],['Matt Hughes III',2,0],['Matt Serra II',2,0],['Jon Fitch',5,0],['B.J. Penn II',4,0],['Thiago Alves',5,0],['Dan Hardy',5,0],['Josh Koscheck II',5,0],['Jake Shields',3,2,'late-round resistance'],['Carlos Condit',5,0,'official consensus'],['Nick Diaz',5,0],['Johny Hendricks',3,2,'controversial official decision'],['Michael Bisping',2,1]]},
    'Jose Aldo':{window:'Hominick 2011 → McGregor 2015',status:'locked',fights:[['Mark Hominick',4,1],['Kenny Florian',4,1],['Chad Mendes I',1,0],['Frankie Edgar I',4,1],['Chan Sung Jung',4,0],['Ricardo Lamas',4,1],['Chad Mendes II',4,1],['Conor McGregor',0,1]]},
    'Jon Jones':{window:'Bader 2011 → Gane 2023',status:'locked-review',fights:[['Ryan Bader',2,0],['Mauricio Rua',3,0],['Quinton Jackson',4,0],['Lyoto Machida',1,1,'Machida R1'],['Rashad Evans',4,1],['Vitor Belfort',4,0],['Chael Sonnen',1,0],['Alexander Gustafsson I',3,2,'close official decision'],['Glover Teixeira',5,0],['Daniel Cormier I',4,1],['Ovince Saint Preux',5,0],['Daniel Cormier II',2,1,'NC included by actual rounds'],['Alexander Gustafsson II',3,0],['Anthony Smith',5,0],['Thiago Santos',3,2,'split official decision'],['Dominick Reyes',3,2,'controversial official decision'],['Ciryl Gane',1,0]]},
    'Alexander Volkanovski':{window:'Aldo 2019 → active, Islam included',status:'locked-review',fights:[['Jose Aldo',3,0],['Chad Mendes',2,0],['Max Holloway I',4,1],['Max Holloway II',3,2,'controversial official decision'],['Brian Ortega',5,0],['Chan Sung Jung',4,0],['Islam Makhachev I',2,3,'upward-division loss included'],['Yair Rodriguez',3,0],['Islam Makhachev II',0,1,'upward-division finish loss'],['Ilia Topuria',1,1,'finish loss'] ]},
    'Max Holloway':{window:'Swanson 2015 → active',status:'locked-review',fights:[['Cub Swanson',3,0],['Charles Oliveira',1,0],['Jeremy Stephens',3,0],['Ricardo Lamas',3,0],['Anthony Pettis',3,0],['Jose Aldo I',3,0],['Jose Aldo II',3,0],['Brian Ortega',4,0],['Dustin Poirier II',1,4],['Frankie Edgar',5,0],['Alexander Volkanovski I',1,4],['Alexander Volkanovski II',2,3,'controversial official decision'],['Calvin Kattar',5,0],['Yair Rodriguez',3,2],['Arnold Allen',4,1],['Chan Sung Jung',3,0],['Justin Gaethje',5,0],['Ilia Topuria',1,2,'finish loss'] ]},
    'Kamaru Usman':{window:'RDA 2018 → Edwards III 2023',status:'locked-review',fights:[['Rafael dos Anjos',5,0],['Tyron Woodley',5,0],['Colby Covington I',3,2],['Jorge Masvidal I',5,0],['Gilbert Burns',2,1],['Jorge Masvidal II',2,0],['Colby Covington II',3,2],['Leon Edwards II',3,2,'finish loss after leading'],['Leon Edwards III',2,3]]}
  };
  function round(v){return Math.round((Number(v||0)+Number.EPSILON)*100)/100;}
  function entryFor(fighter){
    const row=RAW[fighter]; if(!row)return null;
    const wins=row.fights.reduce((sum,f)=>sum+Number(f[1]||0),0);
    const losses=row.fights.reduce((sum,f)=>sum+Number(f[2]||0),0);
    const counted=wins+losses;
    return {fighter,window:row.window,status:row.status,roundsWon:wins,roundsLost:losses,roundsCounted:counted,roundControlPct:counted?round(wins/counted*100):0,fights:row.fights,version:VERSION};
  }
  function pctFor(fighter){return entryFor(fighter)?.roundControlPct ?? null;}
  function report(){return Object.keys(RAW).map(entryFor).filter(Boolean).sort((a,b)=>b.roundControlPct-a.roundControlPct||a.fighter.localeCompare(b.fighter));}
  window.UFC_PRIME_ROUND_CONTROL_AUDIT={version:VERSION,raw:RAW,entryFor,pctFor,report:report(),appliedAt:new Date().toISOString()};
  document.documentElement.setAttribute('data-prime-round-control-audit',VERSION);
})();
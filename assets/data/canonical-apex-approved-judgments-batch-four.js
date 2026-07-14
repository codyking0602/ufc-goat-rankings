// Cody-approved Apex Peak leaderboard calibration judgments.
// Shadow-only: extends the canonical approved judgment registry without touching live scores or ranking data.
(function(){
  'use strict';

  const prior=window.UFC_CANONICAL_APEX_APPROVED_JUDGMENTS;
  if(!prior?.rows)throw new Error('Approved Apex batches one through three must load before batch four.');
  const VERSION='canonical-apex-approved-judgments-20260714d-leaderboard-calibration';
  const WINDOW='Best two UFC wins within 24 months';
  const rows=[...prior.rows];
  const add=(fighter,decision,window,score,first,second,components,notes)=>rows.push({
    fighter,classification:'recovered-judgment',correctionTypes:['recovered-judgment'],decision,
    audit:{version:VERSION,window,modelWindow:WINDOW,score,performances:[first,second],components:{twoPerformanceStrength:components[0],proof:components[1],bestFighterClaim:components[2],aura:components[3]},classification:'recovered-judgment',approvalStatus:'cody-approved',notes,provenance:'Cody-approved canonical Apex leaderboard calibration'}
  });

  add('Israel Adesanya','Keep the Robert Whittaker and Paulo Costa pair. Raise Proof to 1.40 and Aura to 0.75 while retaining the existing Claim.','Robert Whittaker 2019 + Paulo Costa 2020',5.12,{fightId:'2019-10-05-robert-whittaker',label:'Robert Whittaker',date:'2019-10-05',rating:9.4},{fightId:'2020-09-26-paulo-costa',label:'Paulo Costa',date:'2020-09-26',rating:9.3},[1.87,1.40,1.10,0.75],'Stopping Whittaker and dominating unbeaten Costa support stronger Proof and Aura, but not a maximum Apex tier.');
  add('Max Holloway','Keep the Jose Aldo and Brian Ortega pair. Increase only Aura to 0.70; Proof and Claim remain unchanged.','Jose Aldo II 2017 + Brian Ortega 2018',4.89,{fightId:'2017-06-03-jose-aldo',label:'Jose Aldo',date:'2017-06-03',rating:9.3},{fightId:'2018-12-08-brian-ortega',label:'Brian Ortega',date:'2018-12-08',rating:9.6},[1.89,1.45,0.85,0.70],'The consecutive elite stoppages merit more Aura while the existing Proof and best-fighter Claim remain appropriately calibrated.');
  add('Chuck Liddell','Keep the Randy Couture II and Tito Ortiz II pair and raise Proof to match the strength of the championship run.','Randy Couture II 2005 + Tito Ortiz II 2006',5.27,{fightId:'2005-04-16-randy-couture',label:'Randy Couture',date:'2005-04-16',rating:9.2},{fightId:'2006-12-30-tito-ortiz',label:'Tito Ortiz',date:'2006-12-30',rating:9.0},[1.82,1.40,1.15,0.90],'Two defining championship knockouts justify substantially stronger Proof while preserving the existing Claim and Aura.');
  add('Stipe Miocic','Keep the Fabricio Werdum and Francis Ngannou I pair and modestly raise Proof, Claim, and Aura.','Fabricio Werdum 2016 + Francis Ngannou I 2018',5.01,{fightId:'2016-05-14-fabricio-werdum',label:'Fabricio Werdum',date:'2016-05-14',rating:9.4},{fightId:'2018-01-20-francis-ngannou',label:'Francis Ngannou',date:'2018-01-20',rating:9.2},[1.86,1.50,0.95,0.70],'Winning the title from Werdum and shutting out Ngannou support a 5.00-level heavyweight Apex.');
  add('Randy Couture','Keep the Tim Sylvia and Gabriel Gonzaga comeback pair and correct the severely understated judgment components.','Tim Sylvia 2007 + Gabriel Gonzaga 2007',4.42,{fightId:'2007-03-03-tim-sylvia',label:'Tim Sylvia',date:'2007-03-03',rating:8.8},{fightId:'2007-08-25-gabriel-gonzaga',label:'Gabriel Gonzaga',date:'2007-08-25',rating:8.4},[1.72,1.25,0.75,0.70],'Returning from retirement to dominate Sylvia and stop Gonzaga creates a clear championship Apex despite lower raw performance ratings.');
  add('Charles Oliveira','Keep the Dustin Poirier and Justin Gaethje pair and raise Claim and Aura while retaining the existing maximum-level Proof judgment.','Dustin Poirier 2021 + Justin Gaethje 2022',4.84,{fightId:'2021-12-11-dustin-poirier',label:'Dustin Poirier',date:'2021-12-11',rating:9.2},{fightId:'2022-05-07-justin-gaethje',label:'Justin Gaethje',date:'2022-05-07',rating:9.2},[1.84,1.60,0.80,0.60],'Back-to-back elite finishes support greater Claim and Aura, with the later Islam loss still limiting the ceiling.');
  add('Merab Dvalishvili','Keep the Sean O’Malley and Umar Nurmagomedov pair and raise Proof, Claim, and Aura modestly.','Sean O’Malley 2024 + Umar Nurmagomedov 2025',4.30,{fightId:'2024-09-14-sean-o-malley',label:"Sean O'Malley",date:'2024-09-14',rating:9.2},{fightId:'2025-01-18-umar-nurmagomedov',label:'Umar Nurmagomedov',date:'2025-01-18',rating:9.3},[1.85,1.40,0.60,0.45],'Consecutive elite championship wins deserve stronger Proof and a modestly higher Claim and Aura, while the later Petr Yan loss prevents a higher tier.');

  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const byKey=new Map(rows.map(row=>[key(row.fighter),Object.freeze(row)]));
  window.UFC_CANONICAL_APEX_APPROVED_JUDGMENTS=Object.freeze({
    version:VERSION,rows:Object.freeze(rows.slice()),entryFor:fighter=>byKey.get(key(fighter))||null,
    fighterCount:rows.length,approvalStatus:'cody-approved',mutatesRankingData:false,mutatesScores:false
  });
})();
// Peak Apex Live Bonus Promoter.
// Adds Peak Apex as a positive modifier after the 100-point base score.
// Formula: weighted positive base + apexPeak + loss penalty.
(function(){
  const VERSION='apex-peak-live-bonus-20260709b-locked-audit';
  const DATA=window.RANKING_DATA;
  const RUBRIC={twoPerformanceStrength:{label:'Two-performance strength',max:2},proof:{label:'Proof',max:1.75},bestFighterClaim:{label:'Best-fighter claim',max:1.25},aura:{label:'Aura',max:1},total:{label:'Peak Apex bonus',max:6}};
  const RULES={window:'Best two UFC wins within 24 months',totalMax:6,performances:'Two selected UFC wins are rated individually; their average maps into Two-performance strength.',noContests:'No contests do not count as Apex performances.',losses:'Losses are not selected as Apex performances, but can cap Best-Fighter Claim or Aura.'};
  const LOCKED=[
['Jon Jones','Shogun Rua 2011 + Lyoto Machida 2011','Shogun Rua',10,'Lyoto Machida',10,1.75,1.25,1.00,'Youngest champ, instant best-in-the-world aura.'],
['Khabib Nurmagomedov','Dustin Poirier 2019 + Justin Gaethje 2020','Dustin Poirier',10,'Justin Gaethje',10,1.75,1.25,1.00,'Complete lightweight inevitability.'],
['Amanda Nunes','Ronda Rousey 2016 + Cris Cyborg 2018','Ronda Rousey',10,'Cris Cyborg',10,1.75,1.25,1.00,'Women’s UFC apex benchmark: violent, historic, unmistakable.'],
['Ilia Topuria','Alexander Volkanovski 2024 + Charles Oliveira 2025','Alexander Volkanovski',10,'Charles Oliveira',9.9,1.75,1.25,0.96,'Volkanovski plus Oliveira is monster UFC peak proof.'],
['Anderson Silva','Forrest Griffin 2009 + Vitor Belfort 2011','Forrest Griffin',10,'Vitor Belfort',10,1.55,1.25,1.00,'Untouchable highlight-reel magic.'],
['Conor McGregor','Jose Aldo 2015 + Eddie Alvarez 2016','Jose Aldo',10,'Eddie Alvarez',10,1.75,1.05,1.00,'Two-division superstar apex.'],
['Islam Makhachev','Charles Oliveira 2022 + Dustin Poirier 2024','Charles Oliveira',9.8,'Dustin Poirier',9.4,1.75,1.15,0.86,'Modern lightweight title proof at an elite level.'],
['Francis Ngannou','Stipe Miocic II 2021 + Ciryl Gane 2022','Stipe Miocic II',9.8,'Ciryl Gane',9.2,1.60,1.15,1.00,'Terrifying heavyweight apex with evolved title-fight proof.'],
['Georges St-Pierre','B.J. Penn II 2009 + Thiago Alves 2009','B.J. Penn II',9.6,'Thiago Alves',9.2,1.65,1.25,0.78,'Elite complete-fighter apex built on surgical control.'],
['Alex Pereira','Jiri Prochazka 2023 + Jiri Prochazka II 2024','Jiri Prochazka',9.5,'Jiri Prochazka II',9.8,1.45,1.15,1.00,'Terrifying title-fight finisher aura.'],
['Kamaru Usman','Tyron Woodley 2019 + Colby Covington I 2019','Tyron Woodley',10,'Colby Covington I',9.3,1.60,1.20,0.75,'Elite welterweight king proof.'],
['Alexander Volkanovski','Jose Aldo 2019 + Max Holloway I 2019','Jose Aldo',9.2,'Max Holloway I',9.5,1.55,1.10,0.82,'High-end modern featherweight apex.'],
['Ronda Rousey','Miesha Tate II 2013 + Cat Zingano 2015','Miesha Tate II',9.3,'Cat Zingano',9.7,1.05,1.25,1.00,'Historic women’s bantamweight aura apex.'],
['Demetrious Johnson','Kyoji Horiguchi 2015 + Henry Cejudo I 2016','Kyoji Horiguchi',9.3,'Henry Cejudo I',9.7,1.30,1.15,0.80,'Legendary skill and separation, with flyweight proof context.'],
['Chuck Liddell','Randy Couture II 2005 + Tito Ortiz II 2006','Randy Couture II',9.2,'Tito Ortiz II',9.0,1.00,1.15,0.90,'Star-era light heavyweight knockout aura.'],
['Israel Adesanya','Robert Whittaker 2019 + Paulo Costa 2020','Robert Whittaker',9.4,'Paulo Costa',9.3,1.20,1.10,0.60,'Clean striking apex with real best-middleweight claim.'],
['Stipe Miocic','Fabricio Werdum 2016 + Francis Ngannou I 2018','Fabricio Werdum',9.4,'Francis Ngannou I',9.2,1.45,0.90,0.55,'Heavyweight title apex with Werdum and Ngannou proof.'],
['Max Holloway','Jose Aldo II 2017 + Brian Ortega 2018','Jose Aldo II',9.3,'Brian Ortega',9.6,1.45,0.85,0.55,'Excellent featherweight title apex with Aldo/Ortega proof.'],
['Valentina Shevchenko','Joanna Jedrzejczyk 2018 + Jessica Andrade 2021','Joanna Jedrzejczyk',9.0,'Jessica Andrade',9.4,1.20,0.95,0.71,'Clean technical flyweight apex.'],
['Daniel Cormier','Anthony Johnson I 2015 + Stipe Miocic I 2018','Anthony Johnson I',9.0,'Stipe Miocic I',9.4,1.35,0.85,0.61,'Double-champ apex with elite proof, capped by Jones.'],
['Lyoto Machida','Thiago Silva 2009 + Rashad Evans 2009','Thiago Silva',9.0,'Rashad Evans',9.4,1.10,0.85,0.85,'Machida-era style aura with title-level proof.'],
['Rose Namajunas','Joanna Jedrzejczyk I 2017 + Zhang Weili II 2021','Joanna Jedrzejczyk I',9.7,'Zhang Weili II',9.2,1.45,0.85,0.45,'Two-time strawweight title apex with Joanna and Zhang proof.'],
['Charles Oliveira','Dustin Poirier 2021 + Justin Gaethje 2022','Dustin Poirier',9.2,'Justin Gaethje',9.2,1.60,0.70,0.46,'Elite lightweight finishing proof with chaotic vulnerability.'],
['Joanna Jedrzejczyk','Carla Esparza 2015 + Jessica Andrade 2017','Carla Esparza',9.2,'Jessica Andrade',9.3,1.30,0.95,0.50,'Strawweight striking apex with major separation.'],
['T.J. Dillashaw','Renan Barao I 2014 + Cody Garbrandt II 2018','Renan Barao I',9.7,'Cody Garbrandt II',9.3,1.35,0.85,0.45,'Technically brilliant and violent bantamweight apex.'],
['Junior dos Santos','Fabricio Werdum 2008 + Cain Velasquez I 2011','Fabricio Werdum',9.0,'Cain Velasquez I',9.4,1.30,0.80,0.55,'Heavyweight boxing apex with Werdum/Cain proof.'],
['B.J. Penn','Joe Stevenson 2008 + Diego Sanchez 2009','Joe Stevenson',8.7,'Diego Sanchez',9.2,1.00,1.00,0.65,'Prime lightweight title aura and best-fighter argument.'],
['Tyron Woodley','Robbie Lawler 2016 + Darren Till 2018','Robbie Lawler',9.2,'Darren Till',9.0,1.20,0.90,0.45,'Welterweight champion apex with Lawler/Till proof.'],
['Aljamain Sterling','Petr Yan II 2022 + Henry Cejudo 2023','Petr Yan II',9.0,'Henry Cejudo',9.1,1.45,0.75,0.35,'Modern bantamweight title apex with Yan/Cejudo proof.'],
['Khamzat Chimaev','Gilbert Burns 2022 + Robert Whittaker 2024','Gilbert Burns',8.8,'Robert Whittaker',9.3,1.15,0.55,0.75,'Current-table contender apex with violent dominance.',1.90],
['Henry Cejudo','Demetrious Johnson II 2018 + Marlon Moraes 2019','Demetrious Johnson II',9.0,'Marlon Moraes',9.1,1.35,0.85,0.34,'Champ-champ peak proof in a compact run.'],
['Cain Velasquez','Brock Lesnar 2010 + Junior dos Santos III 2013','Brock Lesnar',9.2,'Junior dos Santos III',9.1,1.20,0.75,0.47,'Destructive heavyweight peak, capped by injuries and JDS I.'],
['Dominick Cruz','Takeya Mizugaki 2014 + T.J. Dillashaw 2016','Takeya Mizugaki',8.8,'T.J. Dillashaw',9.2,1.05,0.85,0.55,'UFC-only comeback/technical-control apex.'],
['Frankie Edgar','B.J. Penn I 2010 + Gray Maynard III 2011','B.J. Penn I',9.0,'Gray Maynard III',9.1,1.15,0.70,0.55,'Lightweight title apex with Penn/Maynard proof.'],
['Holly Holm','Ronda Rousey 2015 + Bethe Correia 2017','Ronda Rousey',10,'Bethe Correia',8.0,1.00,0.65,0.75,'Huge one-night apex against Ronda.'],
['Tony Ferguson','Rafael dos Anjos 2016 + Donald Cerrone 2019','Rafael dos Anjos',9.1,'Donald Cerrone',8.8,1.20,0.55,0.65,'Violent lightweight contender apex with durability and chaos.'],
['Brock Lesnar','Randy Couture 2008 + Frank Mir II 2009','Randy Couture',8.8,'Frank Mir II',9.0,1.05,0.65,0.70,'Short heavyweight title apex with huge star aura.'],
['Petr Yan','Jose Aldo 2020 + Cory Sandhagen 2021','Jose Aldo',8.8,'Cory Sandhagen',9.2,1.15,0.70,0.50,'High-skill bantamweight apex.'],
['Robert Whittaker','Jacare Souza 2017 + Yoel Romero I 2017','Jacare Souza',9.0,'Yoel Romero I',9.0,1.20,0.65,0.45,'Legit middleweight apex with Jacare/Romero proof.'],
['Jessica Andrade','Claudia Gadelha 2017 + Rose Namajunas I 2019','Claudia Gadelha',8.9,'Rose Namajunas I',9.1,1.20,0.55,0.55,'Multi-division power apex with Claudia/Rose proof.'],
['Justin Gaethje','Tony Ferguson 2020 + Dustin Poirier II 2023','Tony Ferguson',9.4,'Dustin Poirier II',9.0,1.25,0.45,0.55,'Violent lightweight apex in a brutal division.'],
['Alexa Grasso','Valentina Shevchenko I 2023 + Maycee Barber 2021','Valentina Shevchenko I',9.4,'Maycee Barber',8.4,1.15,0.60,0.55,'Valentina proof creates the apex case.'],
['Dustin Poirier','Justin Gaethje I 2018 + Conor McGregor II 2021','Justin Gaethje I',9.0,'Conor McGregor II',9.2,1.35,0.50,0.40,'Excellent lightweight apex resume, capped by title-fight ceilings.'],
['Sean O\'Malley','Aljamain Sterling 2023 + Marlon Vera II 2024','Aljamain Sterling',9.3,'Marlon Vera II',8.8,1.15,0.55,0.55,'Explosive bantamweight title apex.'],
['Julianna Peña','Amanda Nunes I 2021 + Cat Zingano 2015','Amanda Nunes I',10,'Cat Zingano',8.2,1.10,0.55,0.55,'Massive Nunes upset, capped by the rematch.'],
['Tito Ortiz','Wanderlei Silva 2000 + Evan Tanner 2001','Wanderlei Silva',8.8,'Evan Tanner',8.6,0.85,0.75,0.65,'Early UFC LHW title apex.'],
['Sean Strickland','Israel Adesanya 2023 + Nassourdine Imavov 2023','Israel Adesanya',9.7,'Nassourdine Imavov',8.3,1.05,0.45,0.55,'Izzy win gives real apex proof.'],
['Matt Hughes','Carlos Newton II 2002 + Frank Trigg II 2005','Carlos Newton II',7.3,'Frank Trigg II',7.2,0.85,0.85,0.65,'Old-era welterweight apex calibration row.'],
['Michael Bisping','Anderson Silva 2016 + Luke Rockhold II 2016','Anderson Silva',8.8,'Luke Rockhold II',9.4,1.05,0.45,0.45,'Late-career title apex with Anderson/Rockhold proof.'],
['Dan Henderson','Michael Bisping 2009 + Mauricio Rua I 2011','Michael Bisping',9.1,'Mauricio Rua I',9.0,0.95,0.35,0.65,'UFC-only apex built around violent signature moments.'],
['Miesha Tate','Sara McMann 2015 + Holly Holm 2016','Sara McMann',8.3,'Holly Holm',9.0,0.90,0.45,0.55,'Short UFC title apex with the Holm comeback win.'],
['Kayla Harrison','Holly Holm 2024 + Ketlen Vieira 2025','Holly Holm',8.8,'Ketlen Vieira',8.5,0.75,0.35,0.65,'Short UFC-only apex with grappling danger and combat-sports aura.'],
['Mackenzie Dern','Nina Nunes 2021 + Virna Jandiroba II 2025','Nina Nunes',8.4,'Virna Jandiroba II',8.7,0.85,0.35,0.55,'Grappling danger drives the apex.'],
['Chael Sonnen','Nate Marquardt 2010 + Yushin Okami 2010','Nate Marquardt',8.8,'Yushin Okami',8.6,0.85,0.30,0.55,'Elite middleweight challenger apex.'],
['Randy Couture','Tim Sylvia 2007 + Gabriel Gonzaga 2007','Tim Sylvia',8.8,'Gabriel Gonzaga',8.4,0.75,0.45,0.45,'Great UFC title moments, modest apex bonus.'],
['Carla Esparza','Rose Namajunas I 2014 + Rose Namajunas II 2022','Rose Namajunas I',8.7,'Rose Namajunas II',8.4,0.85,0.45,0.30,'Two UFC title peaks with limited separation.']
  ];
  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function num(value){const n=Number(value||0);return Number.isFinite(n)?n:0;}
  function round2(value){const n=Number(value);return Number.isFinite(n)?Math.round((n+Number.EPSILON)*100)/100:0;}
  function year(label){const m=String(label||'').match(/(19|20)\d{2}/);return m?m[0]:'';}
  function cleanLabel(label){return String(label||'').replace(/\s+(19|20)\d{2}$/,'').trim();}
  const lockedMap=new Map(LOCKED.map(row=>[key(row[0]),row]));
  function lockedAudit(row){
    const avg=round2((num(row[3])+num(row[5]))/2);
    const two=row[10]!==undefined?round2(row[10]):round2((avg/10)*2);
    const c={twoPerformanceStrength:two,proof:round2(row[6]),bestFighterClaim:round2(row[7]),aura:round2(row[8])};
    const score=round2(c.twoPerformanceStrength+c.proof+c.bestFighterClaim+c.aura);
    return {score,window:row[1],performances:[{label:cleanLabel(row[2]),date:year(row[1]),rating:row[3]},{label:cleanLabel(row[4]),date:year(row[1].split('+')[1]||row[1]),rating:row[5]}],performanceAverage:avg,components:c,componentTotal:score,notes:row[9],front:{proved:row[9],felt:c.aura>=.95?'Felt scary, iconic, and almost impossible to solve.':c.bestFighterClaim>=1.1?'Felt like a real best-in-the-world peak.':c.aura>=.65?'Felt dangerous, memorable, and clearly title-level.':'Strong peak, but not one of the cleanest aura runs.'},rubric:RUBRIC,rules:RULES,source:'Locked Peak Apex audit override',version:VERSION};
  }
  function applyLockedApex(){
    const patched=[];
    [...(DATA?.men||[]),...(DATA?.women||[]),...(DATA?.fighters||[])].forEach(f=>{
      const row=lockedMap.get(key(f?.fighter));if(!row)return;
      const audit=lockedAudit(row);f.apexPeak=audit.score;f.apexPeakAudit=audit;patched.push(f.fighter);
    });
    if(typeof DISPLAY_OVERRIDES!=='undefined')LOCKED.forEach(row=>{DISPLAY_OVERRIDES[row[0]]=DISPLAY_OVERRIDES[row[0]]||{};DISPLAY_OVERRIDES[row[0]].apexPeakAudit=lockedAudit(row);});
    window.UFC_PEAK_APEX_LOCKED_AUDIT={version:VERSION,patched:[...new Set(patched)],fighters:LOCKED.map(row=>row[0]),rule:'Peak Apex = Two-performance strength + Proof + Best-fighter claim + Aura.',appliedAt:new Date().toISOString()};
  }
  function categoryScore(row,category){
    if(category==='longevity'){
      const raw=num(row.longevity);
      if(row.longevityThirtyPoint===true || raw>15) return raw;
      return (raw/15)*30;
    }
    return num(row[category]);
  }
  function weightedBreakdown(row){
    const championship=(categoryScore(row,'championship')/30)*35;
    const opponentQuality=(categoryScore(row,'opponentQuality')/30)*27.5;
    const primeDominance=(categoryScore(row,'primeDominance')/30)*27.5;
    const longevity=(categoryScore(row,'longevity')/30)*10;
    const apexPeak=num(row.apexPeak);
    const penalty=num(row.penalty);
    const positiveScore=championship+opponentQuality+primeDominance+longevity;
    const modifierScore=apexPeak+penalty;
    return {championship:round2(championship),opponentQuality:round2(opponentQuality),primeDominance:round2(primeDominance),longevity:round2(longevity),apexPeak:round2(apexPeak),apexPeakBonus:round2(apexPeak),positiveScore:round2(positiveScore),penalty:round2(penalty),modifierScore:round2(modifierScore),totalScore:round2(positiveScore+modifierScore)};
  }
  function boardRows(){return [...(DATA?.men||[]),...(DATA?.women||[])];}
  function allRows(){return [...boardRows(),...(DATA?.fighters||[])].filter(row=>row&&row.fighter);}
  function sortBoard(board){if(!Array.isArray(board))return;board.sort((a,b)=>num(b.totalScore)-num(a.totalScore)||String(a.fighter).localeCompare(String(b.fighter)));board.forEach((row,index)=>{row.rank=index+1;});}
  function apply(){
    if(!DATA){const status={version:VERSION,applied:false,error:'Missing RANKING_DATA',mutatesScores:true,apply};window.UFC_APEX_PEAK_LIVE_BONUS=status;return status;}
    applyLockedApex();
    const applied=[];
    allRows().forEach(row=>{const breakdown=weightedBreakdown(row);row.weightedScoreBreakdown=breakdown;row.totalScore=breakdown.totalScore;row.apexPeakBonusLive=true;row.apexPeakBonusVersion=VERSION;applied.push({fighter:row.fighter,apexPeak:breakdown.apexPeak,totalScore:breakdown.totalScore});});
    sortBoard(DATA.men);sortBoard(DATA.women);
    const boards=boardRows();const rankByName=new Map(boards.map(row=>[key(row.fighter),row.rank]));const totalByName=new Map(boards.map(row=>[key(row.fighter),row.totalScore]));const breakdownByName=new Map(boards.map(row=>[key(row.fighter),row.weightedScoreBreakdown]));const apexByName=new Map(boards.map(row=>[key(row.fighter),row.apexPeak]));const auditByName=new Map(boards.map(row=>[key(row.fighter),row.apexPeakAudit]));
    (DATA.fighters||[]).forEach(profile=>{const k=key(profile.fighter);if(rankByName.has(k))profile.rank=rankByName.get(k);if(totalByName.has(k))profile.totalScore=totalByName.get(k);if(breakdownByName.has(k))profile.weightedScoreBreakdown=breakdownByName.get(k);if(apexByName.has(k))profile.apexPeak=apexByName.get(k);if(auditByName.has(k))profile.apexPeakAudit=auditByName.get(k);profile.apexPeakBonusLive=true;profile.apexPeakBonusVersion=VERSION;});
    if(typeof DISPLAY_OVERRIDES!=='undefined'){boards.forEach(row=>{const override=DISPLAY_OVERRIDES[row.fighter];if(!override)return;override.allTimeRank=row.rank;if(Object.prototype.hasOwnProperty.call(override,'overallOvr'))delete override.overallOvr;});}
    if(DATA.meta){DATA.meta.apexPeakBonusLive=true;DATA.meta.apexPeakBonusVersion=VERSION;DATA.meta.apexPeakBonusFormula='championship/30*35 + opponentQuality/30*27.5 + primeDominance/30*27.5 + longevity/30*10 + apexPeak + penalty';}
    const unique=[];const seen=new Set();applied.forEach(item=>{const k=key(item.fighter);if(seen.has(k))return;seen.add(k);unique.push(item);});
    const status={version:VERSION,applied:true,appliedCount:unique.length,lockedAudit:true,topMen:(DATA.men||[]).slice(0,10).map(row=>({fighter:row.fighter,totalScore:row.totalScore,apexPeak:row.apexPeak,rank:row.rank})),topWomen:(DATA.women||[]).slice(0,10).map(row=>({fighter:row.fighter,totalScore:row.totalScore,apexPeak:row.apexPeak,rank:row.rank})),formula:'weighted positive base + apexPeak + penalty',mutatesScores:true,apply,appliedAt:new Date().toISOString()};
    window.UFC_APEX_PEAK_LIVE_BONUS=status;document.documentElement.setAttribute('data-apex-peak-live-bonus',VERSION);if(typeof refresh==='function'){try{refresh();}catch(e){}}return status;
  }
  apply();
})();
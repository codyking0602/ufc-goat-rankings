// Penalty score corrections for the current ranked roster.
// Applies Cody-approved locked loss-penalty rules before final score derivation.
(function(){
  const VERSION='penalty-score-corrections-20260710b-frankie-cap';
  const DATA=window.RANKING_DATA;
  if(!DATA)return;

  const RULES='Locked loss penalty rules: pre-prime elite -0.75; pre-prime non-elite -1.25; prime elite -1.50; prime non-elite -4.00; counted finish extra -0.75; post-prime 0; upward-division elite -0.75; upward-division finish extra -0.50; cap -10.00.';
  const corrections={
    'Jon Jones':{penalty:0.00,notes:'Matt Hamill DQ is not treated as a true competitive loss. Daniel Cormier no contest is not a scored loss.'},
    'Georges St-Pierre':{penalty:-5.50,notes:'Hughes 2004 is pre-prime elite damage; Serra 2007 is the major prime non-elite finish loss.'},
    'Demetrious Johnson':{penalty:-2.25,notes:'Cruz bantamweight loss is pre-flyweight-prime elite damage; Cejudo 2018 is prime elite decision damage.'},
    'Anderson Silva':{penalty:-4.50,notes:'Weidman losses count as in-prime elite finish losses; later losses are post-prime/context-heavy.'},
    'Islam Makhachev':{penalty:-2.00,notes:'Adriano Martins is a pre-prime non-elite finish loss.'},
    'Khabib Nurmagomedov':{penalty:0.00,notes:'No UFC losses.'},
    'Alexander Volkanovski':{penalty:-4.25,notes:'Islam losses use reduced upward-division elite-loss treatment; Topuria is prime elite finish damage.'},
    'Randy Couture':{penalty:-10.00,notes:'Multiple prime/title-level losses justify the cap even with post-prime discipline.'},
    'Max Holloway':{penalty:-10.00,notes:'Early losses plus Poirier, Volk trilogy, and later elite losses push raw penalty beyond cap.'},
    'Kamaru Usman':{penalty:-4.50,notes:'Edwards title losses plus reduced upward-division Khamzat loss fit the locked rules.'},
    'Jose Aldo':{penalty:-8.25,notes:'McGregor, Holloway twice, and Volkanovski count as prime/late-prime elite damage; Yan/Merab are post-prime for penalty.'},
    'Matt Hughes':{penalty:-8.75,notes:'Hallman, Penn, GSP, and Alves count; later Penn/Koscheck losses are post-prime.'},
    'Daniel Cormier':{penalty:-5.25,notes:'Jones 2015 and Stipe losses count; Jones 2017 no contest is not a scored loss.'},
    'Stipe Miocic':{penalty:-8.00,notes:'Struve pre-prime finish plus JDS/Cormier/Ngannou elite losses; Jones late fight excluded per Cody.'},
    'Ilia Topuria':{penalty:-2.25,notes:'Current-table Gaethje loss counts as prime champ/top-five finish damage.'},
    'Israel Adesanya':{penalty:-6.75,notes:'Jan upward-division loss, Pereira finish, Strickland decision, and DDP finish fit locked rules.'},
    'Cain Velasquez':{penalty:-4.50,notes:'JDS and Werdum are prime elite finish losses; Ngannou is post-prime/injury-back-end context.'},
    'Petr Yan':{penalty:-5.25,notes:'Sterling DQ discounted but not ignored; Sterling rematch, O’Malley, and Merab count as prime elite decisions.'},
    'Merab Dvalishvili':{penalty:-4.75,notes:'Saenz and Simon are pre-prime losses; current-table Yan rivalry loss counts as prime elite decision damage.'},
    'B.J. Penn':{penalty:-9.75,notes:'Pulver, GSP, Hughes, and Edgar title-level losses count; late collapse is post-prime.'},
    'Alex Pereira':{penalty:-5.00,notes:'Adesanya finish, Ankalaev decision, and reduced upward-division Gane finish loss fit the packet/current-table context.'},
    'Chuck Liddell':{penalty:-10.00,notes:'Couture, Rampage, Jardine, and Evans push raw penalty beyond cap.'},
    'Dominick Cruz':{penalty:-3.75,notes:'Garbrandt prime elite decision and Cejudo late-prime title finish count; Vera is post-prime.'},
    'Francis Ngannou':{penalty:-5.50,notes:'Stipe is prime elite decision damage; Derrick Lewis is the harsh prime non-elite decision loss.'},
    'Charles Oliveira':{penalty:-10.00,notes:'Long career with many elite/non-elite losses pushes raw penalty beyond cap.'},
    'Henry Cejudo':{penalty:-5.25,notes:'DJ and Benavidez are pre-prime; Sterling and Merab comeback losses count without treating them as prime collapse.'},
    'Conor McGregor':{penalty:-7.00,notes:'Diaz is the harsh prime non-elite finish loss; Khabib is elite title finish damage; Poirier 2021 losses are post-prime/back-end context.'},
    'Justin Gaethje':{penalty:-10.00,notes:'Elite/title-loss context pushes raw penalty beyond cap.'},
    'Frankie Edgar':{penalty:-10.00,notes:'Gray Maynard I adds a pre-prime non-elite decision loss to the existing Benson, Aldo, Ortega, and Holloway damage. Raw loss context exceeds -10, so the locked cap applies; late bantamweight decline remains post-prime.'},
    'Dustin Poirier':{penalty:-10.00,notes:'McGregor early finish, Michael Johnson finish, and multiple title/elite losses push raw penalty beyond cap.'},
    'T.J. Dillashaw':{penalty:-7.25,notes:'Dodson, Assuncao, Cruz, Cejudo, and discounted Sterling shoulder-injury title finish context fit locked rules.'},
    'Dan Henderson':{penalty:-5.25,notes:'Rampage, Anderson, and Machida count; later veteran losses are post-prime/context-heavy.'},
    'Aljamain Sterling':{penalty:-7.25,notes:'Caraway, Assuncao, Moraes, O’Malley, and current-table Evloev late elite loss count.'},
    'Amanda Nunes':{penalty:-3.75,notes:'Cat Zingano is pre-prime elite finish damage; Julianna Pena is prime elite finish damage.'},
    'Valentina Shevchenko':{penalty:-4.50,notes:'First Nunes loss is lighter pre-prime/up-division damage; second Nunes and Grasso finish loss count.'},
    'Joanna Jedrzejczyk':{penalty:-6.00,notes:'Rose finish, Rose decision, reduced upward-division Valentina decision, and Zhang 2020 decision fit locked rules.'},
    'Ronda Rousey':{penalty:-4.50,notes:'Holm and Nunes are prime elite finish losses.'}
  };

  function round2(value){return Math.round((Number(value||0)+Number.EPSILON)*100)/100;}
  function recalcTotal(row){return round2(Number(row.championship||0)+Number(row.opponentQuality||0)+Number(row.primeDominance||0)+Number(row.longevity||0)+Number(row.penalty||0));}
  function patchRow(row){
    const c=corrections[row?.fighter];
    if(!c)return;
    row.penalty=c.penalty;
    row.lossPenalty=c.penalty;
    row.totalScore=recalcTotal(row);
    row.penaltyNotes=c.notes;
    row.penaltyAudit={score:c.penalty,rules:RULES,notes:c.notes,source:'Penalty active-roster worksheet',version:VERSION};
  }

  [...(DATA.men||[]),...(DATA.women||[]),...(DATA.fighters||[])].forEach(patchRow);
  function sortBoard(board){if(!Array.isArray(board))return;board.sort((a,b)=>Number(b.totalScore||0)-Number(a.totalScore||0));board.forEach((row,index)=>{row.rank=index+1;});}
  sortBoard(DATA.men);
  sortBoard(DATA.women);

  const boardRows=[...(DATA.men||[]),...(DATA.women||[])];
  const rankByFighter=new Map(boardRows.map(row=>[row.fighter,row.rank]));
  const scoreByFighter=new Map(boardRows.map(row=>[row.fighter,row.totalScore]));
  const penaltyByFighter=new Map(boardRows.map(row=>[row.fighter,row.penalty]));
  (DATA.fighters||[]).forEach(profile=>{
    if(rankByFighter.has(profile.fighter))profile.rank=rankByFighter.get(profile.fighter);
    if(scoreByFighter.has(profile.fighter))profile.totalScore=scoreByFighter.get(profile.fighter);
    if(penaltyByFighter.has(profile.fighter)){profile.penalty=penaltyByFighter.get(profile.fighter);profile.lossPenalty=penaltyByFighter.get(profile.fighter);}
  });

  if(typeof DISPLAY_OVERRIDES!=='undefined'){
    rankByFighter.forEach((rank,fighter)=>{
      if(!DISPLAY_OVERRIDES[fighter])return;
      DISPLAY_OVERRIDES[fighter].allTimeRank=rank;
      DISPLAY_OVERRIDES[fighter].penaltyAudit=corrections[fighter]||DISPLAY_OVERRIDES[fighter].penaltyAudit;
      if(DISPLAY_OVERRIDES[fighter].categories?.penalty)delete DISPLAY_OVERRIDES[fighter].categories.penalty;
    });
  }

  window.UFC_PENALTY_SCORE_CORRECTIONS={version:VERSION,fighters:Object.keys(corrections),rules:RULES,corrections,appliedAt:new Date().toISOString()};
})();

// Canonical eight-fighter UFC-only registry: Frank Shamrock, Benson Henderson, Fabricio Werdum,
// Glover Teixeira, Vitor Belfort, Mauricio Rua, Forrest Griffin, and Rashad Evans.
(function(){
  'use strict';

  const BASE=window.UFC_CANONICAL_FIGHTER_REGISTRY;
  const DATA=window.RANKING_DATA;
  const VERSION='canonical-fighter-registry-eight-legends-20260712a';
  if(!BASE||!DATA){
    console.error('Eight-fighter registry requires the active canonical registry and RANKING_DATA.');
    return;
  }

  const key=value=>String(value||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const rowsFor=name=>[...(DATA.men||[]),...(DATA.women||[]),...(DATA.fighters||[])].filter(row=>key(row?.fighter)===key(name));
  const upsert=(list,row)=>{
    if(!Array.isArray(list)) return null;
    const index=list.findIndex(item=>key(item?.fighter)===key(row?.fighter));
    if(index<0){list.push(row);return row;}
    list[index]={...list[index],...row};
    return list[index];
  };
  const overrides=()=>window.DISPLAY_OVERRIDES||(typeof DISPLAY_OVERRIDES!=='undefined'?DISPLAY_OVERRIDES:null);
  const upsertReport=(report,row,sorter)=>{
    if(!Array.isArray(report)) return;
    const index=report.findIndex(item=>key(item?.fighter)===key(row?.fighter));
    if(index<0) report.push(row); else report[index]=row;
    if(sorter) report.sort(sorter);
  };
  const snapshotStats=(cfg)=>({
    ufcRecord:cfg.ufcRecord,
    titleFightWins:cfg.titleFightWins,
    adjustedTitleWins:cfg.adjustedTitleWins,
    eliteWins:cfg.elitePlusWins,
    elitePlusWins:cfg.elitePlusWins,
    topFivePlusWins:cfg.topFivePlusWins,
    rankedQualityWins:cfg.rankedQualityWins,
    primeRecord:cfg.primeRecord,
    finishRatePct:cfg.finishRatePct,
    roundsWonPct:cfg.roundsWonPct,
    activeEliteYears:cfg.activeEliteYears,
    timesFinishedPrime:cfg.timesFinishedPrime,
    apexPeak:cfg.apexPeak,
    lossContext:cfg.penalty
  });
  const qualityRows=(rows,division)=>rows.map(row=>({
    opponent:row[0],division,credit:row[1],type:row[2],context:row[3]
  }));
  const roundRows=rows=>rows.map(row=>({
    opponent:row[0],date:row[1],roundsWon:row[2],roundsLost:row[3],
    roundsCounted:Number(row[2])+Number(row[3]),method:row[4],confidence:row[5]||'Medium'
  }));
  const titleObject=cfg=>({
    normalTitleWins:cfg.titleTypes.normal||0,
    interimTitleWins:cfg.titleTypes.interim||0,
    vacantUndisputedWins:cfg.titleTypes.vacantUndisputed||0,
    tournamentWins:cfg.titleTypes.tournament||0,
    titleFightWins:cfg.titleFightWins,
    adjustedTitleWins:cfg.adjustedTitleWins,
    championshipScore:cfg.championship,
    notes:cfg.titleNotes
  });
  const defaultLossContext=()=>({unrecoveredLoss:null,recoveredLosses:[],upwardDivisionLosses:[],postPrimeLosses:[],weirdResults:[]});

  const FIGHTERS=[
    {
      id:'FS001',name:'Frank Shamrock',ufcRecord:'5-0',ufcWins:5,ufcLosses:0,ufcDraws:0,ufcNoContests:0,
      primaryDivision:'Light Heavyweight',secondaryDivision:'Middleweight',divisionLabel:'LHW / MW',
      championship:8.05,opponentQuality:11.20,primeDominance:25.20,longevity:4.34,apexPeak:5.40,penalty:0,eraDepthAdjustment:-1.25,
      titleFightWins:5,adjustedTitleWins:3.90,titleTypes:{normal:4,vacantUndisputed:1},
      titleNotes:'Inaugural UFC light heavyweight title win plus four defenses. Early-era depth discounts apply to every title credit.',
      titleWins:[
        {opponent:'Kevin Jackson',event:'UFC Japan',date:'1997-12-21',titleType:'vacantUndisputed',strength:.75,adjustedCredit:.75,reviewStatus:'locked',notes:'Won the inaugural UFC light heavyweight title in 16 seconds.'},
        {opponent:'Igor Zinoviev',event:'UFC 16',date:'1998-03-13',titleType:'normal',strength:.75,adjustedCredit:.75,reviewStatus:'locked',notes:'First defense; embryonic field discount.'},
        {opponent:'Jeremy Horn',event:'UFC 17',date:'1998-05-15',titleType:'normal',strength:.80,adjustedCredit:.80,reviewStatus:'locked',notes:'Strong submission defense over a credible early-era contender.'},
        {opponent:'John Lober',event:'UFC Brazil',date:'1998-10-16',titleType:'normal',strength:.65,adjustedCredit:.65,reviewStatus:'locked',notes:'Valid defense with a large opponent-quality discount.'},
        {opponent:'Tito Ortiz',event:'UFC 22',date:'1999-09-24',titleType:'normal',strength:.95,adjustedCredit:.95,reviewStatus:'locked',notes:'Signature championship win over the next defining UFC light heavyweight champion.'}
      ],
      quality:[
        ['Tito Ortiz',1.00,'True top-5 era win','Defeated the next defining UFC light heavyweight champion in a championship fight.','locked'],
        ['Jeremy Horn',.85,'Elite-era win','Experienced submission specialist and legitimate early title challenger.','locked'],
        ['Kevin Jackson',.75,'Ranked / quality win','Olympic gold medalist and inaugural title opponent.','locked'],
        ['Igor Zinoviev',.65,'Ranked / quality win','Undefeated challenger entering the title defense.','locked'],
        ['John Lober',.35,'Supporting win','Title defense with a substantial opponent-depth discount.','locked']
      ],
      elitePlusWins:2,topFivePlusWins:2,rankedQualityWins:4,
      primeRecord:'5-0',primeWins:5,primeLosses:0,primeDraws:0,primeNCs:0,roundsWonPct:96,finishRatePct:100,primeFinishRatePct:100,timesFinishedPrime:0,
      primeRounds:[
        ['Kevin Jackson','1997-12-21',1,0,'R1 submission title win','Medium'],
        ['Igor Zinoviev','1998-03-13',1,0,'R1 slam KO title defense','Medium'],
        ['Jeremy Horn','1998-05-15',1,0,'Submission title defense','Medium'],
        ['John Lober','1998-10-16',1,0,'TKO title defense','Medium'],
        ['Tito Ortiz','1999-09-24',3.8,.2,'Fourth-round stoppage title defense','Medium']
      ],
      activeEliteYears:1.76,gapAdjustedMonths:21.1,statusMultiplier:1.12,divisionMultiplier:.88,
      primeStart:'1997-12-21',primeStartLabel:'Kevin Jackson',primeEnd:'1999-09-24',primeEndLabel:'Tito Ortiz',primeEndType:'retirement_vacated_title',
      primeEndReason:'Vacated the title and left the UFC after stopping Tito Ortiz, closing an unbeaten championship run.',
      lossContext:defaultLossContext(),
      apexPerformances:[
        {label:'Igor Zinoviev — UFC 16',date:'1998-03-13',rating:8.7,note:'Ended an undefeated challenger in 22 seconds with a slam.'},
        {label:'Tito Ortiz — UFC 22',date:'1999-09-24',rating:9.2,note:'Survived the pace, broke Ortiz late, and exited as an unbeaten UFC champion.'}
      ],
      apexComponents:{twoPerformanceStrength:1.78,proof:1.18,bestFighterClaim:1.18,aura:1.26},
      apexNotes:'An unbeaten five-title-fight UFC run with a defining Tito finish earns a major peak bonus; early-era depth caps the ceiling.',
      bestWins:['Tito Ortiz','Jeremy Horn','Kevin Jackson','Igor Zinoviev'],
      winProfile:'Two clear elite-era wins and five straight UFC title-fight victories, heavily adjusted for early competitive depth.',
      resumeTag:'Unbeaten early UFC champion',
      profileDisplayName:'Frank Shamrock',
      oneLiner:'An unbeaten 5-0 UFC champion with five title-fight wins and a defining Tito Ortiz finish, capped by early-era depth and a short UFC window.',
      whyRankedHere:'Frank went 5-0 in the UFC, won the inaugural light heavyweight title, defended it four times, and finished Tito Ortiz in his final UFC appearance.',
      whyNotHigher:'The run lasted fewer than two active elite years, the opponent pool was still developing, and most of his broader greatness happened outside the UFC.',
      compare:{
        shortCase:'Frank is the unbeaten early-UFC champion case: five UFC fights, five title-fight wins, five finishes, and the signature Tito Ortiz victory.',
        peak:'His best UFC version combined pace, conditioning, submissions, and finishing instinct, culminating in the late stoppage of Tito Ortiz.',
        resume:'A perfect 5-0 UFC record with the inaugural light heavyweight title and four successful defenses.',
        championship:'Five straight UFC title-fight wins are the backbone of the case, with early-era discounts applied throughout.',
        opponentQuality:'Tito Ortiz and Jeremy Horn carry the ledger; the remaining challengers were legitimate for the era but not modern-depth equivalents.',
        longevity:'Only about 1.8 active elite UFC years before he vacated and left.',
        counter:'The short UFC sample and embryonic opponent pool make it difficult to place Frank alongside long modern championship careers.',
        edge:'Frank wins comparisons when championship perfection and unbeaten dominance outweigh modern depth and longevity.',
        scope:'Pancrase, Strikeforce, WEC, and other non-UFC accomplishments are context only.',
        weakness:'Very short UFC tenure and only two clearly elite era wins.',
        titleSummary:'Won the inaugural UFC light heavyweight title and made four successful defenses.',
        primeSummary:'5-0 from Kevin Jackson through Tito Ortiz, with every UFC win a finish.',
        legacyStats:{ufcRecord:'5-0',titleFightWins:5,adjustedTitleWins:3.90,activeEliteYearsLabel:'roughly 1.8 active elite years',primeNote:'Entire UFC career is the prime window'}
      }
    },
    {
      id:'BH001',name:'Benson Henderson',ufcRecord:'10-3',ufcWins:10,ufcLosses:3,ufcDraws:0,ufcNoContests:0,
      primaryDivision:'Lightweight',secondaryDivision:'Welterweight',divisionLabel:'LW / WW',
      championship:7.55,opponentQuality:18.40,primeDominance:21.50,longevity:12.75,apexPeak:4.60,penalty:-6.00,eraDepthAdjustment:0,
      titleFightWins:4,adjustedTitleWins:3.65,titleTypes:{normal:4},
      titleNotes:'Won the UFC lightweight title and defended it three times. Close decisions receive modest opponent/context discounts rather than being erased.',
      titleWins:[
        {opponent:'Frankie Edgar',event:'UFC 144',date:'2012-02-26',titleType:'normal',strength:1.00,adjustedCredit:1.00,reviewStatus:'locked',notes:'Won the undisputed lightweight title over the reigning champion.'},
        {opponent:'Frankie Edgar',event:'UFC 150',date:'2012-08-11',titleType:'normal',strength:.90,adjustedCredit:.90,reviewStatus:'locked',notes:'Successful defense; close split-decision context discount.'},
        {opponent:'Nate Diaz',event:'UFC on Fox 5',date:'2012-12-08',titleType:'normal',strength:.90,adjustedCredit:.90,reviewStatus:'locked',notes:'Clear five-round title defense over an elite contender.'},
        {opponent:'Gilbert Melendez',event:'UFC on Fox 7',date:'2013-04-20',titleType:'normal',strength:.85,adjustedCredit:.85,reviewStatus:'locked',notes:'Successful defense with close split-decision discount.'}
      ],
      quality:[
        ['Frankie Edgar I',1.00,'True top-5 win','Won the UFC lightweight title from an established champion.','locked'],
        ['Frankie Edgar II',.90,'True top-5 win','Retained the title in a close rematch.','locked'],
        ['Nate Diaz',.90,'True top-5 win','Dominant five-round title defense.','locked'],
        ['Gilbert Melendez',.85,'True top-5 win','Beat an elite incoming challenger in a close title defense.','locked'],
        ['Jim Miller',.80,'Elite-era win','Ended Miller’s seven-fight UFC winning streak.','locked'],
        ['Clay Guida',.70,'Ranked / quality win','Title eliminator win over a leading contender.','locked'],
        ['Jorge Masvidal',.65,'Ranked / quality win','Five-round welterweight win at the end of his UFC run.','locked'],
        ['Brandon Thatch',.55,'Ranked / quality win','Submitted a much larger welterweight on short notice.','locked'],
        ['Rustam Khabilov',.50,'Ranked / quality win','Fourth-round submission over a rising lightweight.','locked'],
        ['Mark Bocek',.30,'Supporting win','Solid UFC debut victory.','locked']
      ],
      elitePlusWins:5,topFivePlusWins:5,rankedQualityWins:9,
      primeRecord:'9-3',primeWins:9,primeLosses:3,primeDraws:0,primeNCs:0,roundsWonPct:72,finishRatePct:20,primeFinishRatePct:22.22,timesFinishedPrime:2,
      primeRounds:[
        ['Jim Miller','2011-08-14',3,0,'Decision win','High'],
        ['Clay Guida','2011-11-12',2,1,'Decision win','High'],
        ['Frankie Edgar I','2012-02-26',3,2,'Title win','Medium'],
        ['Frankie Edgar II','2012-08-11',3,2,'Title defense','Low'],
        ['Nate Diaz','2012-12-08',5,0,'Title defense','High'],
        ['Gilbert Melendez','2013-04-20',3,2,'Title defense','Low'],
        ['Anthony Pettis','2013-08-31',0,1,'R1 submission loss','High'],
        ['Josh Thomson','2014-01-25',2,3,'Split decision loss','Low'],
        ['Rustam Khabilov','2014-06-07',3,0,'R4 submission win','Medium'],
        ['Rafael dos Anjos','2014-08-23',0,1,'R1 TKO loss','High'],
        ['Brandon Thatch','2015-02-14',3,0,'R4 submission win','Medium'],
        ['Jorge Masvidal','2015-11-28',3,2,'Split decision win','Low']
      ],
      activeEliteYears:4.29,gapAdjustedMonths:51.5,statusMultiplier:1.08,divisionMultiplier:1.10,
      primeStart:'2011-08-14',primeStartLabel:'Jim Miller',primeEnd:'2015-11-28',primeEndLabel:'Jorge Masvidal',primeEndType:'promotion_exit_win',
      primeEndReason:'Left the UFC after a five-round welterweight win while still operating at a ranked level.',
      lossContext:{
        unrecoveredLoss:null,
        recoveredLosses:[
          {label:'Anthony Pettis',date:'2013-08-31',type:'prime elite title finish loss',method:'Submission',recovery:'Rebounded with more ranked UFC wins.'},
          {label:'Josh Thomson',date:'2014-01-25',type:'prime elite decision loss',method:'Split decision',recovery:'Continued winning at lightweight and welterweight.'},
          {label:'Rafael dos Anjos',date:'2014-08-23',type:'prime elite finish loss',method:'KO',recovery:'Submitted Brandon Thatch and beat Jorge Masvidal afterward.'}
        ],
        upwardDivisionLosses:[],postPrimeLosses:[],weirdResults:[]
      },
      apexPerformances:[
        {label:'Frankie Edgar — UFC 144',date:'2012-02-26',rating:8.8,note:'Won the UFC lightweight title from an established champion.'},
        {label:'Nate Diaz — UFC on Fox 5',date:'2012-12-08',rating:8.7,note:'Produced his clearest five-round title defense.'}
      ],
      apexComponents:{twoPerformanceStrength:1.72,proof:1.10,bestFighterClaim:.98,aura:.80},
      apexNotes:'A strong championship peak with real lightweight proof, though the close decisions and modest finishing threat limit aura.',
      bestWins:['Frankie Edgar','Nate Diaz','Gilbert Melendez','Jim Miller','Clay Guida'],
      winProfile:'Five elite/top-five wins, four UFC title-fight victories, and a deep modern-lightweight ledger.',
      resumeTag:'Three-defense lightweight champion',
      profileDisplayName:'Benson “Smooth” Henderson',
      oneLiner:'A three-defense UFC lightweight champion with five elite wins and outstanding modern depth, held back by three prime losses and limited finishing separation.',
      whyRankedHere:'Benson won ten UFC fights, captured the lightweight title, defended it three times, and beat Frankie Edgar twice, Nate Diaz, Gilbert Melendez, and Jim Miller.',
      whyNotHigher:'Three losses inside the prime window, several razor-close decisions, and only two finishes in ten UFC wins keep him below the strongest championship résumés.',
      compare:{
        shortCase:'Benson is the deep modern lightweight champion case: four title-fight wins, five elite wins, and a 10-3 UFC record.',
        peak:'At his best he combined pace, scrambling, durability, and five-round composure, most clearly against Frankie Edgar and Nate Diaz.',
        resume:'Ten UFC wins across lightweight and welterweight, including three successful lightweight title defenses.',
        championship:'Four title-fight wins provide real championship volume in a historically strong division.',
        opponentQuality:'Frankie twice, Diaz, Melendez, Miller, and Guida create one of the deeper ledgers outside the top tier.',
        longevity:'About 4.3 active elite UFC years before leaving the promotion on a win.',
        counter:'The Pettis, Thomson, and dos Anjos losses all happened inside the prime window, and several signature wins were extremely close.',
        edge:'Benson wins comparisons through modern division strength, title volume, and breadth of ranked wins.',
        scope:'WEC and Bellator accomplishments are excluded from the score.',
        weakness:'Prime losses, low finish rate, and limited separation in close title decisions.',
        titleSummary:'Won the UFC lightweight title and defended it three times.',
        primeSummary:'9-3 from Jim Miller through Jorge Masvidal.',
        legacyStats:{ufcRecord:'10-3',titleFightWins:4,adjustedTitleWins:3.65,activeEliteYearsLabel:'roughly 4.3 active elite years',primeNote:'Jim Miller through Jorge Masvidal'}
      }
    },
    {
      id:'FW001',name:'Fabricio Werdum',ufcRecord:'12-5',ufcWins:12,ufcLosses:5,ufcDraws:0,ufcNoContests:0,
      primaryDivision:'Heavyweight',secondaryDivision:'',divisionLabel:'HW',
      championship:3.40,opponentQuality:20.20,primeDominance:21.80,longevity:21.35,apexPeak:5.20,penalty:-8.25,eraDepthAdjustment:-.20,
      titleFightWins:2,adjustedTitleWins:1.65,titleTypes:{normal:1,interim:1},
      titleNotes:'Interim title win over Mark Hunt and undisputed unification win over Cain Velasquez.',
      titleWins:[
        {opponent:'Mark Hunt',event:'UFC 180',date:'2014-11-15',titleType:'interim',strength:.87,adjustedCredit:.65,reviewStatus:'locked',notes:'Interim title win; short-notice opponent and interim base discount.'},
        {opponent:'Cain Velasquez',event:'UFC 188',date:'2015-06-13',titleType:'normal',strength:1.00,adjustedCredit:1.00,reviewStatus:'locked',notes:'Submitted the reigning champion to unify the heavyweight title.'}
      ],
      quality:[
        ['Cain Velasquez',1.00,'True top-5 win','Submitted the reigning heavyweight champion in Mexico City.','locked'],
        ['Mark Hunt',.90,'True top-5 win','Finished an elite heavyweight to win the interim title.','locked'],
        ['Travis Browne I',.85,'True top-5 win','Dominant five-round win over a leading title contender.','locked'],
        ['Antonio Rodrigo Nogueira',.80,'Elite-era win','Submitted a former UFC heavyweight champion.','locked'],
        ['Alexander Gustafsson',.70,'Elite-name win','Quick heavyweight submission over a former title challenger; late-career discount.','locked'],
        ['Roy Nelson',.65,'Ranked / quality win','Clear three-round win over a durable ranked heavyweight.','locked'],
        ['Alexey Oleinik',.55,'Ranked / quality win','Decision win over a ranked submission specialist.','locked'],
        ['Marcin Tybura',.50,'Ranked / quality win','Five-round decision win.','locked'],
        ['Travis Browne II',.45,'Ranked / quality win','Second win over Browne with diminished repeat credit.','locked'],
        ['Gabriel Gonzaga',.40,'Supporting win','First-stint UFC heavyweight win.','locked']
      ],
      elitePlusWins:5,topFivePlusWins:4,rankedQualityWins:9,
      primeRecord:'10-3',primeWins:10,primeLosses:3,primeDraws:0,primeNCs:0,roundsWonPct:72,finishRatePct:66.67,primeFinishRatePct:60,timesFinishedPrime:2,
      primeRounds:[
        ['Roy Nelson','2012-02-04',3,0,'Decision win','High'],
        ['Mike Russow','2012-06-23',1,0,'R1 TKO win','High'],
        ['Antonio Rodrigo Nogueira','2013-06-08',1,0,'R2 submission win','Medium'],
        ['Travis Browne I','2014-04-19',5,0,'Decision win','High'],
        ['Mark Hunt','2014-11-15',2,0,'R2 TKO interim-title win','High'],
        ['Cain Velasquez','2015-06-13',2,0,'R3 submission title win','High'],
        ['Stipe Miocic','2016-05-14',0,1,'R1 KO title loss','High'],
        ['Travis Browne II','2016-09-10',3,0,'Decision win','High'],
        ['Alistair Overeem','2017-07-08',1,2,'Decision loss','Medium'],
        ['Marcin Tybura','2017-11-19',5,0,'Decision win','High'],
        ['Alexander Volkov','2018-03-17',2,2,'R4 KO loss','Medium'],
        ['Alexey Oleinik','2019-09-14',2,1,'Decision win','Medium'],
        ['Alexander Gustafsson','2020-07-26',1,0,'R1 submission win','High']
      ],
      activeEliteYears:8.47,gapAdjustedMonths:100.7,statusMultiplier:1.06,divisionMultiplier:.96,
      primeStart:'2012-02-04',primeStartLabel:'Roy Nelson',primeEnd:'2020-07-26',primeEndLabel:'Alexander Gustafsson',primeEndType:'promotion_exit_win',
      primeEndReason:'Closed the UFC run with a first-round submission after re-establishing ranked heavyweight relevance.',
      lossContext:{
        unrecoveredLoss:null,
        recoveredLosses:[
          {label:'Andrei Arlovski',date:'2007-04-21',type:'pre-prime elite decision loss',method:'Decision'},
          {label:'Junior dos Santos',date:'2008-10-25',type:'pre-prime elite finish loss',method:'KO'},
          {label:'Stipe Miocic',date:'2016-05-14',type:'prime elite title finish loss',method:'KO',recovery:'Returned with more ranked UFC wins.'},
          {label:'Alistair Overeem',date:'2017-07-08',type:'prime elite decision loss',method:'Decision',recovery:'Beat Tybura, Oleinik, and Gustafsson afterward.'},
          {label:'Alexander Volkov',date:'2018-03-17',type:'prime elite finish loss',method:'KO',recovery:'Recovered with two UFC wins before leaving.'}
        ],
        upwardDivisionLosses:[],postPrimeLosses:[],weirdResults:[]
      },
      apexPerformances:[
        {label:'Mark Hunt — UFC 180',date:'2014-11-15',rating:8.7,note:'Finished Hunt to win the interim heavyweight title.'},
        {label:'Cain Velasquez — UFC 188',date:'2015-06-13',rating:9.4,note:'Outworked and submitted the reigning champion to unify the title.'}
      ],
      apexComponents:{twoPerformanceStrength:1.84,proof:1.18,bestFighterClaim:1.12,aura:1.06},
      apexNotes:'The Hunt-Cain championship pair is a genuine elite heavyweight peak, capped by the immediate Miocic loss.',
      bestWins:['Cain Velasquez','Mark Hunt','Travis Browne','Antonio Rodrigo Nogueira','Alexander Gustafsson'],
      winProfile:'Five elite wins, two title-fight victories, and one of the deepest heavyweight ledgers outside the division’s very top tier.',
      resumeTag:'Heavyweight champion and elite submission threat',
      profileDisplayName:'Fabricio “Vai Cavalo” Werdum',
      oneLiner:'A 12-5 UFC heavyweight champion with an elite Cain submission, deep ranked volume, and long relevance, offset by five counted losses.',
      whyRankedHere:'Werdum went 12-5 in the UFC, won interim and undisputed heavyweight titles, submitted Cain Velasquez, and added quality wins across two UFC stints.',
      whyNotHigher:'He never defended the undisputed title, lost five UFC fights, and his prime included decisive defeats to Miocic, Overeem, and Volkov.',
      compare:{
        shortCase:'Werdum is the deep heavyweight quality case: twelve UFC wins, two title-fight wins, and the signature Cain Velasquez submission.',
        peak:'His apex was the Hunt-Cain championship sequence, where his improved striking created the submission openings that made him champion.',
        resume:'A 12-5 UFC record with wins over Cain, Hunt, Browne, Nogueira, Nelson, Oleinik, and Gustafsson.',
        championship:'Interim and undisputed title wins create real championship substance, but no successful undisputed defense.',
        opponentQuality:'Cain anchors a deep heavyweight ledger with Hunt, Browne, Nogueira, Nelson, and others.',
        longevity:'More than eight gap-adjusted elite UFC years across two UFC runs.',
        counter:'Five losses and no undisputed defense prevent the résumé from reaching the Stipe/DC/Jones heavyweight tier.',
        edge:'Werdum wins comparisons when heavyweight opponent depth and the Cain title win outweigh cleaner but thinner records.',
        scope:'PRIDE and Strikeforce accomplishments are excluded.',
        weakness:'Five UFC losses, no title defense, and inconsistent late-prime results.',
        titleSummary:'Won the interim title over Hunt and unified it by submitting Cain.',
        primeSummary:'10-3 from Roy Nelson through Alexander Gustafsson.',
        legacyStats:{ufcRecord:'12-5',titleFightWins:2,adjustedTitleWins:1.65,activeEliteYearsLabel:'roughly 8.5 active elite years',primeNote:'Roy Nelson through Alexander Gustafsson'}
      }
    },
    {
      id:'GT001',name:'Glover Teixeira',ufcRecord:'16-7',ufcWins:16,ufcLosses:7,ufcDraws:0,ufcNoContests:0,
      primaryDivision:'Light Heavyweight',secondaryDivision:'',divisionLabel:'LHW',
      championship:2.05,opponentQuality:19.20,primeDominance:24.50,longevity:9.14,apexPeak:4.80,penalty:-8.00,eraDepthAdjustment:0,
      titleFightWins:1,adjustedTitleWins:1.00,titleTypes:{normal:1},
      titleNotes:'Submitted Jan Blachowicz to win the undisputed UFC light heavyweight title.',
      titleWins:[
        {opponent:'Jan Blachowicz',event:'UFC 267',date:'2021-10-30',titleType:'normal',strength:1.00,adjustedCredit:1.00,reviewStatus:'locked',notes:'Undisputed title win over the reigning champion.'}
      ],
      quality:[
        ['Jan Blachowicz',1.00,'True top-5 win','Submitted the reigning champion to win the UFC title.','locked'],
        ['Thiago Santos',.90,'True top-5 win','Comeback finish over the recent title challenger.','locked'],
        ['Anthony Smith',.85,'True top-5 win','Dominant five-round stoppage over a former title challenger.','locked'],
        ['Rashad Evans',.75,'Elite-name win','First-round knockout of a former champion; late-career discount.','locked'],
        ['Quinton Jackson',.70,'Elite-name win','Clear decision over a former champion.','locked'],
        ['Ryan Bader',.70,'Ranked / quality win','First-round finish over a future elite champion outside the UFC.','locked'],
        ['Ovince Saint Preux',.65,'Ranked / quality win','Third-round submission in a five-round main event.','locked'],
        ['Nikita Krylov',.60,'Ranked / quality win','Split decision over a durable ranked contender.','locked'],
        ['Misha Cirkunov',.55,'Ranked / quality win','First-round finish of a ranked contender.','locked'],
        ['Ion Cutelaba',.50,'Ranked / quality win','Second-round submission in the title-run sequence.','locked'],
        ['Jared Cannonier',.45,'Supporting win','Decision win before Cannonier’s middleweight rise.','locked']
      ],
      elitePlusWins:6,topFivePlusWins:4,rankedQualityWins:11,
      primeRecord:'6-1',primeWins:6,primeLosses:1,primeDraws:0,primeNCs:0,roundsWonPct:80,finishRatePct:81.25,primeFinishRatePct:83.33,timesFinishedPrime:1,
      primeRounds:[
        ['Karl Roberson','2019-01-19',1,0,'R1 submission win','High'],
        ['Ion Cutelaba','2019-04-27',1,0,'R2 submission win','High'],
        ['Nikita Krylov','2019-09-14',2,1,'Split decision win','Low'],
        ['Anthony Smith','2020-05-13',4,0,'R5 TKO win','High'],
        ['Thiago Santos','2020-11-07',2,0,'R3 submission win','Medium'],
        ['Jan Blachowicz','2021-10-30',1,0,'R2 submission title win','High'],
        ['Jiri Prochazka','2022-06-11',2,2,'R5 submission title loss','Medium']
      ],
      activeEliteYears:3.39,gapAdjustedMonths:40.7,statusMultiplier:1.10,divisionMultiplier:.98,
      primeStart:'2019-01-19',primeStartLabel:'Karl Roberson',primeEnd:'2022-06-11',primeEndLabel:'Jiri Prochazka',primeEndType:'unrecovered_elite_loss',
      primeEndReason:'The Jiri title loss closes the late-career elite window; Jamahal Hill is post-prime.',
      lossContext:{
        unrecoveredLoss:{label:'Jiri Prochazka',date:'2022-06-11',type:'prime elite title finish loss',method:'Submission'},
        recoveredLosses:[
          {label:'Jon Jones',date:'2014-04-26',type:'pre-prime elite title decision loss',method:'Decision'},
          {label:'Phil Davis',date:'2014-10-25',type:'pre-prime elite decision loss',method:'Decision'},
          {label:'Anthony Johnson',date:'2016-08-20',type:'pre-prime elite finish loss',method:'KO'},
          {label:'Alexander Gustafsson',date:'2017-05-28',type:'pre-prime elite finish loss',method:'KO'},
          {label:'Corey Anderson',date:'2018-07-22',type:'pre-prime non-elite decision loss',method:'Decision'}
        ],
        upwardDivisionLosses:[],
        postPrimeLosses:[{label:'Jamahal Hill',date:'2023-01-21',type:'post-prime elite title decision loss',method:'Decision'}],
        weirdResults:[]
      },
      apexPerformances:[
        {label:'Thiago Santos — UFC Vegas 13',date:'2020-11-07',rating:8.6,note:'Survived danger and submitted the recent title challenger.'},
        {label:'Jan Blachowicz — UFC 267',date:'2021-10-30',rating:9.0,note:'Dominated and submitted the reigning champion at age 42.'}
      ],
      apexComponents:{twoPerformanceStrength:1.76,proof:1.12,bestFighterClaim:1.02,aura:.90},
      apexNotes:'A remarkable late-career title peak with strong proof, slightly capped by the Jiri loss and a one-win reign.',
      bestWins:['Jan Blachowicz','Thiago Santos','Anthony Smith','Rashad Evans','Quinton Jackson','Ryan Bader'],
      winProfile:'Six elite wins, eleven ranked-quality wins, and a six-fight late-career title surge.',
      resumeTag:'Late-career light heavyweight champion',
      profileDisplayName:'Glover Teixeira',
      oneLiner:'A 16-win UFC workhorse who completed a 6-1 late-career prime by submitting Jan Blachowicz for the title at age 42.',
      whyRankedHere:'Glover owns sixteen UFC wins, a deep light heavyweight ledger, a six-fight title run, and an undisputed championship victory over Jan Blachowicz.',
      whyNotHigher:'He won only one title fight, accumulated seven UFC losses, and five damaging defeats occurred before his late championship prime began.',
      compare:{
        shortCase:'Glover is the late-career championship and volume case: sixteen UFC wins, six elite wins, and a 6-1 final prime surge.',
        peak:'His best UFC stretch was the Smith-Santos-Jan run, combining pressure, durability, ground control, and finishing ability.',
        resume:'Sixteen UFC wins with a title, thirteen finishes, and quality victories spanning multiple light heavyweight eras.',
        championship:'One undisputed title win provides meaningful but limited championship volume.',
        opponentQuality:'Jan, Santos, Smith, Rashad, Rampage, Bader, and OSP create excellent breadth.',
        longevity:'The scored prime is compact, but the full UFC career supplied exceptional ranked volume.',
        counter:'Seven losses and only one title-fight win keep the case below more accomplished champions.',
        edge:'Glover wins comparisons when total UFC win volume, finish production, and late-prime proof outweigh cleaner short careers.',
        scope:'Non-UFC accomplishments are context only.',
        weakness:'Seven UFC losses and a one-win championship résumé.',
        titleSummary:'Submitted Jan Blachowicz to become UFC light heavyweight champion.',
        primeSummary:'6-1 from Karl Roberson through Jiri Prochazka.',
        legacyStats:{ufcRecord:'16-7',titleFightWins:1,adjustedTitleWins:1.00,activeEliteYearsLabel:'roughly 3.4 active elite years',primeNote:'Karl Roberson through Jiri Prochazka'}
      }
    },
    {
      id:'VB001',name:'Vitor Belfort',ufcRecord:'14-8 (1 NC)',ufcWins:14,ufcLosses:8,ufcDraws:0,ufcNoContests:1,
      primaryDivision:'Light Heavyweight',secondaryDivision:'Middleweight',divisionLabel:'LHW / MW / HW',
      championship:2.30,opponentQuality:21.00,primeDominance:20.50,longevity:12.02,apexPeak:5.50,penalty:-10.00,eraDepthAdjustment:-.50,
      titleFightWins:2,adjustedTitleWins:1.10,titleTypes:{normal:1,tournament:1},
      titleNotes:'UFC 12 tournament championship plus the 2004 light heavyweight title win over Randy Couture, heavily discounted for the accidental-cut ending.',
      titleWins:[
        {opponent:'Scott Ferrozzo',event:'UFC 12',date:'1997-02-07',titleType:'tournament',strength:.65,adjustedCredit:.65,reviewStatus:'locked',notes:'Won the UFC 12 heavyweight tournament; early-era tournament discount.'},
        {opponent:'Randy Couture',event:'UFC 46',date:'2004-01-31',titleType:'normal',strength:.45,adjustedCredit:.45,reviewStatus:'locked',notes:'Won the light heavyweight title via doctor stoppage from an accidental glove seam cut; major context discount.'}
      ],
      quality:[
        ['Luke Rockhold',.95,'True top-5 win','First-round head-kick knockout of an elite title contender.','locked'],
        ['Michael Bisping',.90,'True top-5 win','Second-round head-kick finish of a leading contender.','locked'],
        ['Dan Henderson I',.85,'True top-5 win','First-round knockout in the 2013 title-run sequence.','locked'],
        ['Randy Couture',.75,'Elite title win','Official UFC title win with substantial accidental-cut discount.','locked'],
        ['Rich Franklin',.75,'Elite-era win','First-round knockout of a former champion.','locked'],
        ['Wanderlei Silva',.70,'Elite-era win','Historic 44-second knockout of an elite rival.','locked'],
        ['Tito Ortiz',.70,'Elite-era win','Split-decision win over a former champion.','locked'],
        ['Anthony Johnson',.65,'Ranked / quality win','Submitted a dangerous ranked opponent.','locked'],
        ['Yoshihiro Akiyama',.55,'Ranked / quality win','First-round knockout.','locked'],
        ['Dan Henderson II',.50,'Diminished repeat win','Second UFC knockout of Henderson with age/repeat discount.','locked'],
        ['Nate Marquardt',.45,'Supporting win','Late-career decision win.','locked'],
        ['Marvin Eastman',.35,'Supporting win','First-round knockout in second UFC stint.','locked']
      ],
      elitePlusWins:7,topFivePlusWins:4,rankedQualityWins:10,
      primeRecord:'6-3',primeWins:6,primeLosses:3,primeDraws:0,primeNCs:0,roundsWonPct:70,finishRatePct:85.71,primeFinishRatePct:100,timesFinishedPrime:3,
      primeRounds:[
        ['Yoshihiro Akiyama','2011-08-06',1,0,'R1 KO win','High'],
        ['Anthony Johnson','2012-01-14',1,0,'R1 submission win','High'],
        ['Jon Jones','2012-09-22',1,3,'R4 submission title loss','Medium'],
        ['Michael Bisping','2013-01-19',2,0,'R2 TKO win','High'],
        ['Luke Rockhold','2013-05-18',1,0,'R1 KO win','High'],
        ['Dan Henderson I','2013-11-09',1,0,'R1 KO win','High'],
        ['Chris Weidman','2015-05-23',0,1,'R1 TKO title loss','High'],
        ['Dan Henderson II','2015-11-07',1,0,'R1 KO win','High'],
        ['Ronaldo Souza','2016-05-14',0,1,'R1 TKO loss','High']
      ],
      activeEliteYears:4.77,gapAdjustedMonths:57.2,statusMultiplier:1.04,divisionMultiplier:.97,
      primeStart:'2011-08-06',primeStartLabel:'Yoshihiro Akiyama',primeEnd:'2016-05-14',primeEndLabel:'Ronaldo Souza',primeEndType:'unrecovered_elite_loss',
      primeEndReason:'The Jacare loss ends the final sustained elite UFC window; later UFC results are post-prime.',
      lossContext:{
        unrecoveredLoss:{label:'Ronaldo Souza',date:'2016-05-14',type:'prime elite finish loss',method:'TKO'},
        recoveredLosses:[
          {label:'Randy Couture I',date:'1997-05-30',type:'pre-prime elite finish loss',method:'TKO'},
          {label:'Chuck Liddell',date:'2002-06-22',type:'pre-prime elite decision loss',method:'Decision'},
          {label:'Randy Couture II',date:'2004-08-21',type:'pre-prime elite title finish loss',method:'TKO'},
          {label:'Anderson Silva',date:'2011-02-05',type:'pre-prime elite title finish loss',method:'KO'},
          {label:'Jon Jones',date:'2012-09-22',type:'prime elite title finish loss',method:'Submission',recovery:'Returned with three elite knockout wins.'},
          {label:'Chris Weidman',date:'2015-05-23',type:'prime elite title finish loss',method:'TKO',recovery:'Knocked out Dan Henderson afterward.'}
        ],
        upwardDivisionLosses:[],
        postPrimeLosses:[{label:'Lyoto Machida',date:'2018-05-12',type:'post-prime elite finish loss',method:'KO'}],
        weirdResults:[{label:'Kelvin Gastelum no contest',date:'2017-03-11',type:'post-prime no contest',officialLoss:false,penaltyExempt:true}]
      },
      apexPerformances:[
        {label:'Michael Bisping — UFC on FX 7',date:'2013-01-19',rating:8.8,note:'Destroyed a leading contender with a head kick.'},
        {label:'Luke Rockhold — UFC on FX 8',date:'2013-05-18',rating:9.1,note:'Landed one of the most iconic spinning head-kick knockouts in UFC history.'}
      ],
      apexComponents:{twoPerformanceStrength:1.80,proof:1.12,bestFighterClaim:1.10,aura:1.48},
      apexNotes:'The 2013 knockout run carries elite aura and proof, but the broader UFC résumé is dragged down by the maximum loss-context cap.',
      bestWins:['Luke Rockhold','Michael Bisping','Dan Henderson','Randy Couture','Rich Franklin','Wanderlei Silva','Tito Ortiz'],
      winProfile:'Seven elite wins and fourteen UFC finishes/wins across multiple eras, paired with major volatility and the maximum loss cap.',
      resumeTag:'Three-era knockout legend',
      profileDisplayName:'Vitor “The Phenom” Belfort',
      oneLiner:'A 14-win UFC knockout legend with a tournament crown, a UFC title, and elite wins across three eras, capped hard by eight losses.',
      whyRankedHere:'Vitor compiled fourteen UFC wins, twelve UFC knockouts, a tournament championship, a light heavyweight title, and elite victories from Wanderlei Silva through Luke Rockhold.',
      whyNotHigher:'Eight UFC losses, no successful title defense, the accidental-cut nature of his Couture title win, and a maxed-out loss penalty place a firm ceiling on the résumé.',
      compare:{
        shortCase:'Vitor is the explosive three-era UFC case: fourteen wins, historic knockout volume, a tournament crown, and a long list of elite names.',
        peak:'His 2013 Bisping-Rockhold-Henderson run was one of the most violent short peaks in UFC history.',
        resume:'Fourteen UFC wins, a UFC 12 tournament championship, a light heavyweight title, and elite victories across heavyweight, light heavyweight, and middleweight.',
        championship:'A tournament crown and official title win count, but both are heavily discounted and neither produced a defense.',
        opponentQuality:'Rockhold, Bisping, Henderson, Couture, Franklin, Wanderlei, Tito, and Johnson create excellent breadth.',
        longevity:'Meaningful relevance across eras, but the single scored prime window is under five active elite years.',
        counter:'Eight UFC losses and zero title defenses make the case much less stable than the highlight reel suggests.',
        edge:'Vitor wins comparisons through elite-name breadth, finishing danger, and peak violence.',
        scope:'PRIDE, Cage Rage, Affliction, and other non-UFC results are excluded.',
        weakness:'Maximum loss penalty, no defense, and inconsistent championship performance.',
        titleSummary:'Won the UFC 12 tournament and briefly held the UFC light heavyweight title.',
        primeSummary:'6-3 from Akiyama through Jacare.',
        legacyStats:{ufcRecord:'14-8 (1 NC)',titleFightWins:2,adjustedTitleWins:1.10,activeEliteYearsLabel:'roughly 4.8 active elite years',primeNote:'Akiyama through Jacare'}
      }
    },
    {
      id:'MR001',name:'Mauricio Rua',ufcRecord:'11-12-1',ufcWins:11,ufcLosses:12,ufcDraws:1,ufcNoContests:0,
      primaryDivision:'Light Heavyweight',secondaryDivision:'',divisionLabel:'LHW',
      championship:1.95,opponentQuality:20.00,primeDominance:19.50,longevity:12.83,apexPeak:5.00,penalty:-10.00,eraDepthAdjustment:0,
      titleFightWins:1,adjustedTitleWins:.95,titleTypes:{normal:1},
      titleNotes:'Knocked out Lyoto Machida in the rematch to win the undisputed UFC light heavyweight title.',
      titleWins:[
        {opponent:'Lyoto Machida',event:'UFC 113',date:'2010-05-08',titleType:'normal',strength:.95,adjustedCredit:.95,reviewStatus:'locked',notes:'Undisputed title win over an undefeated champion.'}
      ],
      quality:[
        ['Lyoto Machida',1.00,'True top-5 win','Knocked out the undefeated champion to win the UFC title.','locked'],
        ['Chuck Liddell',.85,'Elite-era win','First-round knockout of a former champion; decline discount.','locked'],
        ['Forrest Griffin',.85,'Elite-era win','Avenged the first UFC loss with a first-round knockout.','locked'],
        ['Antonio Rogerio Nogueira I',.75,'Elite-era win','Decision win over a ranked veteran.','locked'],
        ['Corey Anderson',.70,'Ranked / quality win','Split decision over a rising contender.','locked'],
        ['Antonio Rogerio Nogueira II',.60,'Ranked / quality win','Second UFC decision win with age/repeat discount.','locked'],
        ['Brandon Vera',.55,'Ranked / quality win','Fourth-round TKO in a main event.','locked'],
        ['Gian Villante',.45,'Supporting win','Third-round knockout.','locked'],
        ['Tyson Pedro',.45,'Supporting win','Third-round knockout.','locked'],
        ['James Te Huna',.40,'Supporting win','First-round knockout.','locked']
      ],
      elitePlusWins:4,topFivePlusWins:3,rankedQualityWins:8,
      primeRecord:'5-6',primeWins:5,primeLosses:6,primeDraws:0,primeNCs:0,roundsWonPct:58,finishRatePct:72.73,primeFinishRatePct:100,timesFinishedPrime:3,
      primeRounds:[
        ['Chuck Liddell','2009-04-18',1,0,'R1 TKO win','High'],
        ['Lyoto Machida I','2009-10-24',2,3,'Title decision loss','Low'],
        ['Lyoto Machida II','2010-05-08',1,0,'R1 KO title win','High'],
        ['Jon Jones','2011-03-19',0,3,'R3 TKO title loss','High'],
        ['Forrest Griffin II','2011-08-27',1,0,'R1 KO win','High'],
        ['Dan Henderson I','2011-11-19',2,3,'Decision loss','Medium'],
        ['Brandon Vera','2012-08-04',3,0,'R4 TKO win','Medium'],
        ['Alexander Gustafsson','2012-12-08',1,2,'Decision loss','High'],
        ['Chael Sonnen','2013-08-17',0,1,'R1 submission loss','High'],
        ['James Te Huna','2013-12-06',1,0,'R1 KO win','High'],
        ['Dan Henderson II','2014-03-23',2,1,'R3 TKO loss','Medium']
      ],
      activeEliteYears:4.93,gapAdjustedMonths:59.2,statusMultiplier:1.04,divisionMultiplier:1.00,
      primeStart:'2009-04-18',primeStartLabel:'Chuck Liddell',primeEnd:'2014-03-23',primeEndLabel:'Dan Henderson II',primeEndType:'unrecovered_elite_loss',
      primeEndReason:'The second Henderson loss closes the UFC title-level window; later wins are post-prime durability, not renewed title relevance.',
      lossContext:{
        unrecoveredLoss:{label:'Dan Henderson II',date:'2014-03-23',type:'prime elite finish loss',method:'TKO'},
        recoveredLosses:[
          {label:'Forrest Griffin I',date:'2007-09-22',type:'pre-prime elite finish loss',method:'Submission'},
          {label:'Lyoto Machida I',date:'2009-10-24',type:'prime elite title decision loss',method:'Decision',recovery:'Won the immediate rematch by knockout.'},
          {label:'Jon Jones',date:'2011-03-19',type:'prime elite title finish loss',method:'TKO',recovery:'Returned with another elite UFC win.'},
          {label:'Dan Henderson I',date:'2011-11-19',type:'prime elite decision loss',method:'Decision',recovery:'Returned with UFC wins and a rematch.'},
          {label:'Alexander Gustafsson',date:'2012-12-08',type:'prime elite decision loss',method:'Decision',recovery:'Knocked out Te Huna and remained ranked.'},
          {label:'Chael Sonnen',date:'2013-08-17',type:'prime elite finish loss',method:'Submission',recovery:'Knocked out Te Huna afterward.'}
        ],
        upwardDivisionLosses:[],
        postPrimeLosses:[
          {label:'Ovince Saint Preux I',date:'2014-11-08',type:'post-prime finish loss',method:'KO'},
          {label:'Anthony Smith',date:'2018-07-22',type:'post-prime finish loss',method:'KO'},
          {label:'Paul Craig',date:'2020-11-21',type:'post-prime finish loss',method:'TKO'},
          {label:'Ovince Saint Preux II',date:'2021-11-06',type:'post-prime decision loss',method:'Decision'},
          {label:'Ihor Potieria',date:'2023-01-21',type:'post-prime finish loss',method:'TKO'}
        ],
        weirdResults:[{label:'Paul Craig draw',date:'2019-11-16',type:'post-prime draw',officialLoss:false,penaltyExempt:true}]
      },
      apexPerformances:[
        {label:'Chuck Liddell — UFC 97',date:'2009-04-18',rating:8.5,note:'First-round knockout that announced his UFC title run.'},
        {label:'Lyoto Machida II — UFC 113',date:'2010-05-08',rating:9.2,note:'Knocked out the undefeated champion after the controversial first fight.'}
      ],
      apexComponents:{twoPerformanceStrength:1.78,proof:1.12,bestFighterClaim:1.02,aura:1.08},
      apexNotes:'The Liddell-Machida championship peak was elite and iconic, but the UFC-only career was far less consistent than the broader MMA legacy.',
      bestWins:['Lyoto Machida','Chuck Liddell','Forrest Griffin','Antonio Rogerio Nogueira','Corey Anderson'],
      winProfile:'Four elite wins and a real title peak, offset by a losing UFC record and the maximum loss penalty.',
      resumeTag:'UFC champion with a scope-affected legacy',
      profileDisplayName:'Mauricio “Shogun” Rua',
      oneLiner:'An iconic UFC title peak built on Liddell and Machida, but a 11-12-1 UFC record keeps the UFC-only résumé far below his all-MMA reputation.',
      whyRankedHere:'Shogun knocked out Lyoto Machida for the title, beat Chuck Liddell and Forrest Griffin, and added eleven UFC wins across a long light heavyweight career.',
      whyNotHigher:'PRIDE is excluded, his UFC record is below .500, he won only one UFC title fight, and twelve UFC losses force the maximum loss-context penalty.',
      compare:{
        shortCase:'Shogun is the scope-affected UFC champion case: an elite Machida title peak and several major wins, but a losing UFC record.',
        peak:'His UFC apex was the Liddell-to-Machida II run, ending with a clean knockout of an undefeated champion.',
        resume:'Eleven UFC wins, one title-fight win, and quality victories over Machida, Liddell, Griffin, Nogueira, and Anderson.',
        championship:'One undisputed title win with no successful defense.',
        opponentQuality:'Machida, Liddell, Griffin, Nogueira, and Anderson provide real name and ranking value.',
        longevity:'A meaningful prime window, followed by a long post-prime UFC tail that adds record volume but not elite longevity.',
        counter:'Most of the case people remember comes from PRIDE, which is intentionally excluded here.',
        edge:'Shogun wins comparisons when his elite title peak and best-win quality outweigh cleaner but less accomplished contender résumés.',
        scope:'PRIDE accomplishments are context only and add no points.',
        weakness:'11-12-1 UFC record, one title win, and maximum loss penalty.',
        titleSummary:'Knocked out Lyoto Machida to win the UFC light heavyweight title.',
        primeSummary:'5-6 from Chuck Liddell through Dan Henderson II.',
        legacyStats:{ufcRecord:'11-12-1',titleFightWins:1,adjustedTitleWins:.95,activeEliteYearsLabel:'roughly 4.9 active elite years',primeNote:'Chuck Liddell through Dan Henderson II'}
      }
    },
    {
      id:'FG001',name:'Forrest Griffin',ufcRecord:'10-5',ufcWins:10,ufcLosses:5,ufcDraws:0,ufcNoContests:0,
      primaryDivision:'Light Heavyweight',secondaryDivision:'',divisionLabel:'LHW',
      championship:1.95,opponentQuality:19.50,primeDominance:18.50,longevity:4.94,apexPeak:5.30,penalty:-7.25,eraDepthAdjustment:0,
      titleFightWins:1,adjustedTitleWins:.95,titleTypes:{normal:1},
      titleNotes:'Won the undisputed light heavyweight title from Quinton Jackson.',
      titleWins:[
        {opponent:'Quinton Jackson',event:'UFC 86',date:'2008-07-05',titleType:'normal',strength:.95,adjustedCredit:.95,reviewStatus:'locked',notes:'Five-round title win over the reigning champion.'}
      ],
      quality:[
        ['Mauricio Rua I',1.00,'True top-5 win','Submitted the highly regarded former PRIDE champion in his UFC debut.','locked'],
        ['Quinton Jackson',.95,'True top-5 win','Won the UFC light heavyweight title over the reigning champion.','locked'],
        ['Rich Franklin',.75,'Elite-era win','Decision win over a former UFC champion.','locked'],
        ['Tito Ortiz II',.70,'Elite-name win','Split-decision win over a former champion.','locked'],
        ['Tito Ortiz III',.55,'Diminished repeat win','Second official UFC win over Ortiz with late-career discount.','locked'],
        ['Stephan Bonnar I',.55,'Ranked / quality win','Historic TUF Finale victory.','locked'],
        ['Stephan Bonnar II',.40,'Diminished repeat win','Second decision win over Bonnar.','locked'],
        ['Hector Ramirez',.30,'Supporting win','Decision win before the title run.','locked']
      ],
      elitePlusWins:4,topFivePlusWins:2,rankedQualityWins:7,
      primeRecord:'2-2',primeWins:2,primeLosses:2,primeDraws:0,primeNCs:0,roundsWonPct:61,finishRatePct:30,primeFinishRatePct:50,timesFinishedPrime:2,
      primeRounds:[
        ['Mauricio Rua I','2007-09-22',2,0,'R3 submission win','Medium'],
        ['Quinton Jackson','2008-07-05',3,2,'Title decision win','Low'],
        ['Rashad Evans','2008-12-27',2,1,'R3 TKO title loss','Medium'],
        ['Anderson Silva','2009-08-08',0,1,'R1 KO loss','High']
      ],
      activeEliteYears:1.88,gapAdjustedMonths:22.6,statusMultiplier:1.05,divisionMultiplier:1.00,
      primeStart:'2007-09-22',primeStartLabel:'Mauricio Rua I',primeEnd:'2009-08-08',primeEndLabel:'Anderson Silva',primeEndType:'unrecovered_elite_loss',
      primeEndReason:'The Anderson Silva loss closes the championship-level window; later Franklin and Ortiz wins are post-prime quality, not renewed title contention.',
      lossContext:{
        unrecoveredLoss:{label:'Anderson Silva',date:'2009-08-08',type:'prime elite finish loss',method:'KO'},
        recoveredLosses:[
          {label:'Tito Ortiz I',date:'2006-04-15',type:'pre-prime elite decision loss',method:'Decision'},
          {label:'Keith Jardine',date:'2006-12-30',type:'pre-prime non-elite finish loss',method:'TKO'},
          {label:'Rashad Evans',date:'2008-12-27',type:'prime elite title finish loss',method:'TKO',recovery:'Remained in an elite superfight immediately afterward.'}
        ],
        upwardDivisionLosses:[],
        postPrimeLosses:[{label:'Mauricio Rua II',date:'2011-08-27',type:'post-prime elite finish loss',method:'KO'}],
        weirdResults:[]
      },
      apexPerformances:[
        {label:'Mauricio Rua — UFC 76',date:'2007-09-22',rating:9.0,note:'Submitted a heavily favored elite newcomer.'},
        {label:'Quinton Jackson — UFC 86',date:'2008-07-05',rating:9.0,note:'Won the UFC title in a five-round upset.'}
      ],
      apexComponents:{twoPerformanceStrength:1.80,proof:1.12,bestFighterClaim:1.06,aura:1.32},
      apexNotes:'The Shogun-Rampage upset pair is one of the strongest two-fight underdog peaks in the division, even though it was brief.',
      bestWins:['Mauricio Rua','Quinton Jackson','Rich Franklin','Tito Ortiz','Stephan Bonnar'],
      winProfile:'Four elite-name wins and two exceptional upset performances, paired with a short championship window.',
      resumeTag:'Ultimate Fighter pioneer and UFC champion',
      profileDisplayName:'Forrest Griffin',
      oneLiner:'The TUF pioneer turned UFC champion: elite upset wins over Shogun and Rampage, but only a brief title-level prime.',
      whyRankedHere:'Forrest went 10-5 in the UFC, submitted Shogun, beat Rampage for the title, defeated Rich Franklin, and twice beat Tito Ortiz.',
      whyNotHigher:'He had only one title-fight win, a 2-2 prime window, a low finish rate, and decisive losses to Rashad Evans and Anderson Silva.',
      compare:{
        shortCase:'Forrest is the historic overachiever champion case: ten UFC wins and signature upsets over Shogun and Rampage.',
        peak:'His apex was the Shogun submission followed by the five-round Rampage title win.',
        resume:'A 10-5 UFC record with one title win and meaningful victories over Shogun, Rampage, Franklin, Ortiz, and Bonnar.',
        championship:'One undisputed title win with no successful defense.',
        opponentQuality:'Shogun and Rampage are elite anchors, with Franklin and Ortiz adding depth.',
        longevity:'The true title-level window lasted under two active elite years.',
        counter:'The peak was brief, the finish rate was low, and the title reign ended in the first defense.',
        edge:'Forrest wins comparisons through signature upset quality and legitimate championship proof.',
        scope:'Only UFC fights are scored.',
        weakness:'Short prime, one title win, and decisive elite losses.',
        titleSummary:'Beat Quinton Jackson to win the UFC light heavyweight title.',
        primeSummary:'2-2 from Shogun I through Anderson Silva.',
        legacyStats:{ufcRecord:'10-5',titleFightWins:1,adjustedTitleWins:.95,activeEliteYearsLabel:'roughly 1.9 active elite years',primeNote:'Shogun I through Anderson Silva'}
      }
    },
    {
      id:'RE001',name:'Rashad Evans',ufcRecord:'14-8-1',ufcWins:14,ufcLosses:8,ufcDraws:1,ufcNoContests:0,
      primaryDivision:'Light Heavyweight',secondaryDivision:'Middleweight',divisionLabel:'LHW / MW',
      championship:1.85,opponentQuality:19.00,primeDominance:22.50,longevity:14.04,apexPeak:5.00,penalty:-5.25,eraDepthAdjustment:0,
      titleFightWins:1,adjustedTitleWins:.90,titleTypes:{normal:1},
      titleNotes:'Stopped Forrest Griffin to win the undisputed UFC light heavyweight title.',
      titleWins:[
        {opponent:'Forrest Griffin',event:'UFC 92',date:'2008-12-27',titleType:'normal',strength:.90,adjustedCredit:.90,reviewStatus:'locked',notes:'Third-round stoppage to win the undisputed title.'}
      ],
      quality:[
        ['Chuck Liddell',.95,'True top-5 win','Knocked out the former champion in a title-eliminator level fight.','locked'],
        ['Forrest Griffin',.95,'True top-5 win','Stopped the reigning champion to win the title.','locked'],
        ['Quinton Jackson',.90,'True top-5 win','Clear decision in a major title eliminator.','locked'],
        ['Phil Davis',.85,'True top-5 win','Five-round shutout of an undefeated contender.','locked'],
        ['Tito Ortiz II',.75,'Elite-era win','Second-round stoppage of a former champion.','locked'],
        ['Dan Henderson',.70,'Elite-era win','Split-decision win over an elite veteran.','locked'],
        ['Chael Sonnen',.65,'Elite-era win','First-round TKO over a recent title challenger.','locked'],
        ['Thiago Silva',.60,'Ranked / quality win','Decision win over a dangerous ranked contender.','locked'],
        ['Michael Bisping',.55,'Ranked / quality win','Split-decision win before Bisping’s middleweight prime.','locked'],
        ['Jason Lambert',.35,'Supporting win','Second-round knockout.','locked']
      ],
      elitePlusWins:7,topFivePlusWins:5,rankedQualityWins:10,
      primeRecord:'8-3',primeWins:8,primeLosses:3,primeDraws:0,primeNCs:0,roundsWonPct:77,finishRatePct:42.86,primeFinishRatePct:37.5,timesFinishedPrime:1,
      primeRounds:[
        ['Chuck Liddell','2008-09-06',2,0,'R2 KO win','High'],
        ['Forrest Griffin','2008-12-27',2,0,'R3 TKO title win','Medium'],
        ['Lyoto Machida','2009-05-23',0,2,'R2 KO title loss','High'],
        ['Thiago Silva','2010-01-02',2,1,'Decision win','High'],
        ['Quinton Jackson','2010-05-29',3,0,'Decision win','High'],
        ['Tito Ortiz II','2011-08-06',2,0,'R2 TKO win','High'],
        ['Phil Davis','2012-01-28',5,0,'Decision win','High'],
        ['Jon Jones','2012-04-21',1,4,'Title decision loss','High'],
        ['Antonio Rogerio Nogueira','2013-02-02',1,2,'Decision loss','Medium'],
        ['Dan Henderson','2013-06-15',2,1,'Split decision win','Low'],
        ['Chael Sonnen','2013-11-16',1,0,'R1 TKO win','High']
      ],
      activeEliteYears:5.20,gapAdjustedMonths:62.4,statusMultiplier:1.08,divisionMultiplier:1.00,
      primeStart:'2008-09-06',primeStartLabel:'Chuck Liddell',primeEnd:'2013-11-16',primeEndLabel:'Chael Sonnen',primeEndType:'last_elite_win',
      primeEndReason:'The Sonnen win closes the last sustained elite stretch; the later five-fight slide is post-prime.',
      lossContext:{
        unrecoveredLoss:null,
        recoveredLosses:[
          {label:'Lyoto Machida',date:'2009-05-23',type:'prime elite title finish loss',method:'KO',recovery:'Recovered with four straight ranked wins and another title shot.'},
          {label:'Jon Jones',date:'2012-04-21',type:'prime elite title decision loss',method:'Decision',recovery:'Returned to beat Henderson and Sonnen.'},
          {label:'Antonio Rogerio Nogueira',date:'2013-02-02',type:'prime elite decision loss',method:'Decision',recovery:'Beat Henderson and Sonnen afterward.'}
        ],
        upwardDivisionLosses:[],
        postPrimeLosses:[
          {label:'Ryan Bader',date:'2015-10-03',type:'post-prime elite decision loss',method:'Decision'},
          {label:'Glover Teixeira',date:'2016-04-16',type:'post-prime elite finish loss',method:'KO'},
          {label:'Daniel Kelly',date:'2017-03-04',type:'post-prime decision loss',method:'Decision'},
          {label:'Sam Alvey',date:'2017-08-05',type:'post-prime decision loss',method:'Decision'},
          {label:'Anthony Smith',date:'2018-06-09',type:'post-prime finish loss',method:'KO'}
        ],
        weirdResults:[{label:'Tito Ortiz draw',date:'2007-07-07',type:'pre-prime draw',officialLoss:false,penaltyExempt:true}]
      },
      apexPerformances:[
        {label:'Chuck Liddell — UFC 88',date:'2008-09-06',rating:9.1,note:'Produced an iconic one-punch knockout of a former champion.'},
        {label:'Forrest Griffin — UFC 92',date:'2008-12-27',rating:8.9,note:'Rallied to stop the reigning champion and win the title.'}
      ],
      apexComponents:{twoPerformanceStrength:1.80,proof:1.12,bestFighterClaim:1.02,aura:1.06},
      apexNotes:'The Liddell-Forrest championship pair is an elite two-fight peak with real knockout aura and title proof.',
      bestWins:['Chuck Liddell','Forrest Griffin','Quinton Jackson','Phil Davis','Tito Ortiz','Dan Henderson','Chael Sonnen'],
      winProfile:'Seven elite wins, five top-five wins, and a strong 8-3 prime before the late-career decline.',
      resumeTag:'Champion with elite LHW depth',
      profileDisplayName:'Rashad “Suga” Evans',
      oneLiner:'A 14-win UFC champion with an 8-3 prime, five top-five wins, and major victories over Liddell, Forrest, Rampage, and Davis.',
      whyRankedHere:'Rashad won fourteen UFC fights, captured the light heavyweight title, beat five top-five opponents, and produced one of the division’s deepest contender ledgers.',
      whyNotHigher:'He made no successful title defense, lost the belt immediately to Machida, and the post-prime five-fight skid drags down the overall UFC record even without added penalty.',
      compare:{
        shortCase:'Rashad is the deep contender-plus-champion case: fourteen UFC wins, seven elite wins, and an 8-3 prime.',
        peak:'His best sequence was the Liddell knockout followed by the comeback title win over Forrest Griffin.',
        resume:'Fourteen UFC wins with victories over Liddell, Forrest, Rampage, Davis, Tito, Henderson, Sonnen, and Bisping.',
        championship:'One title-fight win and no successful defense.',
        opponentQuality:'The ledger is unusually deep for a one-defense-free champion.',
        longevity:'More than five active elite UFC years before the late-career decline.',
        counter:'The title reign was brief, and he finished his UFC career on five straight losses.',
        edge:'Rashad wins comparisons through elite-win breadth, prime consistency, and modern light heavyweight depth.',
        scope:'Only UFC fights are scored.',
        weakness:'No defense and a severe post-prime record tail.',
        titleSummary:'Stopped Forrest Griffin to win the UFC light heavyweight title.',
        primeSummary:'8-3 from Chuck Liddell through Chael Sonnen.',
        legacyStats:{ufcRecord:'14-8-1',titleFightWins:1,adjustedTitleWins:.90,activeEliteYearsLabel:'roughly 5.2 active elite years',primeNote:'Chuck Liddell through Chael Sonnen'}
      }
    }
  ];

  const byName=new Map(FIGHTERS.map(cfg=>[key(cfg.name),cfg]));
  const totalFor=cfg=>{
    const weighted=(cfg.championship/30)*35+(cfg.opponentQuality/30)*27.5+(cfg.primeDominance/30)*27.5+(cfg.longevity/30)*10;
    return Math.round((weighted+cfg.apexPeak+cfg.penalty+cfg.eraDepthAdjustment+Number.EPSILON)*100)/100;
  };

  FIGHTERS.forEach(cfg=>{
    cfg.totalScore=totalFor(cfg);
    cfg.board={
      fighter:cfg.name,totalScore:cfg.totalScore,championship:cfg.championship,opponentQuality:cfg.opponentQuality,
      primeDominance:cfg.primeDominance,longevity:cfg.longevity,longevityThirtyPoint:true,apexPeak:cfg.apexPeak,
      penalty:cfg.penalty,eraDepthAdjustment:cfg.eraDepthAdjustment,leaderboard:'men',gender:'Men',ufcRecord:cfg.ufcRecord,
      primaryDivision:cfg.primaryDivision,secondaryDivision:cfg.secondaryDivision,finishRatePct:cfg.finishRatePct,
      activeEliteYears:cfg.activeEliteYears,timesFinishedPrime:cfg.timesFinishedPrime,primeRecord:cfg.primeRecord,
      roundsWonPct:cfg.roundsWonPct,eliteWins:cfg.elitePlusWins,elitePlusWins:cfg.elitePlusWins,
      topFivePlusWins:cfg.topFivePlusWins,rankedQualityWins:cfg.rankedQualityWins,winProfile:cfg.winProfile,
      notes:cfg.oneLiner
    };
    cfg.profile={
      id:cfg.id,...cfg.board,scope:'UFC',ufcWins:cfg.ufcWins,ufcLosses:cfg.ufcLosses,ufcDraws:cfg.ufcDraws,ufcNoContests:cfg.ufcNoContests,
      scoredUfcFights:cfg.ufcWins+cfg.ufcLosses+cfg.ufcDraws+cfg.ufcNoContests,
      finishWins:Math.round(cfg.ufcWins*(cfg.finishRatePct/100)),lossPenalty:cfg.penalty,
      primeStart:`${cfg.primeStartLabel} — ${cfg.primeStart.slice(0,4)}`,primeEnd:`${cfg.primeEndLabel} — ${cfg.primeEnd.slice(0,4)}`,
      primeRecordContext:`${cfg.primeStartLabel} → ${cfg.primeEndLabel}`,title:titleObject(cfg),
      opponents:qualityRows(cfg.quality,cfg.primaryDivision),rounds:roundRows(cfg.primeRounds),
      notes:`UFC-only scoring. Non-UFC accomplishments are excluded. ${cfg.whyNotHigher}`
    };
    cfg.display={
      divisionLabel:cfg.divisionLabel,resumeTag:cfg.resumeTag,profileDisplayName:cfg.profileDisplayName,oneLiner:cfg.oneLiner,
      snapshotStats:{...snapshotStats(cfg),bestQualityWins:cfg.bestWins.join(', '),winProfile:cfg.winProfile},
      packetProfileStats:{...snapshotStats(cfg)},
      whyRankedHere:cfg.whyRankedHere,whyNotHigher:cfg.whyNotHigher,
      bigAssumptions:[
        ['Prime window',`${cfg.primeStartLabel} through ${cfg.primeEndLabel}.`],
        ['Loss context',`${cfg.penalty.toFixed(2)} under the locked timing, opponent-quality, finish, and post-prime rules.`],
        ['Division strength',`Longevity multiplier ${cfg.divisionMultiplier.toFixed(2)}; category and opponent context remain UFC-only.`],
        ['Scope','Non-UFC accomplishments are context only and add no points.'],
        ['Photos','No fighter-specific photo paths are added until real WebP files exist.']
      ],
      keyJudgmentCalls:[
        ['Championship treatment',cfg.titleNotes],
        ['Best wins',cfg.bestWins.join(', ')],
        ['Prime result',`${cfg.primeRecord} with ${Math.round(cfg.roundsWonPct)}% estimated round control.`],
        ['Why not higher?',cfg.whyNotHigher]
      ],
      compareProfile:cfg.compare
    };
    cfg.era={
      status:'locked',
      window:{
        start:cfg.primeStart,startLabel:cfg.primeStartLabel,end:cfg.primeEnd,endLabel:cfg.primeEndLabel,
        endType:cfg.primeEndType,endReason:cfg.primeEndReason,canonical:true,locked:true,lockVersion:VERSION
      },
      lossContext:cfg.lossContext,
      longevity:{
        gapCapMonths:18,gapAdjustedMonths:cfg.gapAdjustedMonths,activeEliteYears:cfg.activeEliteYears,
        statusMultiplier:cfg.statusMultiplier,divisionMultiplier:cfg.divisionMultiplier,
        adjustmentNote:`${cfg.primeStartLabel} through ${cfg.primeEndLabel}; gaps above 18 months are capped.`,
        note:'UFC-only active elite window.',windowLockedPendingRecalculation:false,canonicalWindowRecalculated:true,
        canonicalWindowRecalculationVersion:VERSION,calculationAsOf:'2026-07-12'
      },
      notes:'UFC-only canonical batch window.',
      lossContextCompletion:{version:VERSION,batch:'eight-legends',machineReadable:true,completeUfcLossLedger:true,source:`${cfg.name} UFC-only audit`,completedAt:new Date().toISOString()}
    };
    cfg.prime={
      fighter:cfg.name,primeRecord:cfg.primeRecord,primeWins:cfg.primeWins,primeLosses:cfg.primeLosses,primeDraws:cfg.primeDraws,primeNCs:cfg.primeNCs,
      primeRecordPct:Math.round((cfg.primeWins/Math.max(1,cfg.primeWins+cfg.primeLosses+cfg.primeDraws))*10000)/100,
      roundControlPct:cfg.roundsWonPct,
      roundControlAudit:{
        fighter:cfg.name,roundsWon:cfg.primeRounds.reduce((sum,row)=>sum+Number(row[2]||0),0),
        roundsLost:cfg.primeRounds.reduce((sum,row)=>sum+Number(row[3]||0),0),
        roundsCounted:cfg.primeRounds.reduce((sum,row)=>sum+Number(row[2]||0)+Number(row[3]||0),0),
        roundControlPct:cfg.roundsWonPct,status:'locked',source:'Canonical eight-fighter prime audit',
        window:`${cfg.primeStartLabel} → ${cfg.primeEndLabel}`,fights:cfg.primeRounds.map(row=>[row[0],row[2],row[3],row[4]]),
        notes:'Round splits are conservative where historical judging or no-round formats create uncertainty.',version:VERSION
      },
      primeFights:cfg.primeWins+cfg.primeLosses+cfg.primeDraws,primeFinishes:Math.round(cfg.primeWins*(cfg.primeFinishRatePct/100)),
      primeFinishRate:cfg.primeFinishRatePct,eliteStakesScore:Math.max(3,Math.min(8,cfg.elitePlusWins+.5)),
      total:cfg.primeDominance,dominanceProfile:cfg.oneLiner,status:'locked',primeWindow:{...cfg.era.window},canonicalWindowRebuild:true,version:VERSION
    };
    cfg.apex={
      score:cfg.apexPeak,window:cfg.apexPerformances.map(row=>`${row.label} ${row.date.slice(0,4)}`).join(' + '),
      performances:cfg.apexPerformances,performanceAverage:Math.round((cfg.apexPerformances.reduce((sum,row)=>sum+row.rating,0)/cfg.apexPerformances.length)*100)/100,
      components:cfg.apexComponents,componentTotal:cfg.apexPeak,notes:cfg.apexNotes,source:`${cfg.name} UFC-only Apex Peak audit`,version:VERSION
    };
    cfg.oqSummary={
      fighter:cfg.name,rawCredit:Math.round(cfg.quality.reduce((sum,row)=>sum+Number(row[1]||0),0)*100)/100,
      diminishedCredit:Math.round(cfg.quality.reduce((sum,row,index)=>sum+Number(row[1]||0)*Math.pow(.94,index),0)*100)/100,
      elitePlusWins:cfg.elitePlusWins,topFivePlusWins:cfg.topFivePlusWins,rankedQualityWins:cfg.rankedQualityWins,
      bestWins:cfg.bestWins,winProfile:cfg.winProfile,qualityRows:cfg.quality.map(row=>row.slice()),version:VERSION
    };
  });

  const DIRECT_FIGHTS=[
    [['Frank Shamrock','Tito Ortiz'],1,'Frank Shamrock','major','Shamrock stopped Ortiz late at UFC 22 in the defining fight of his unbeaten UFC title run.'],
    [['Benson Henderson','Frankie Edgar'],2,'Benson Henderson','major','Henderson beat Edgar twice in UFC lightweight title fights; the rematch was extremely close, but the official UFC series is 2-0.'],
    [['Fabricio Werdum','Cain Velasquez'],1,'Fabricio Werdum','major','Werdum submitted Velasquez at UFC 188 to unify the heavyweight title.'],
    [['Fabricio Werdum','Stipe Miocic'],1,'Stipe Miocic','major','Miocic knocked out Werdum at UFC 198 to take the heavyweight title.'],
    [['Glover Teixeira','Rashad Evans'],1,'Glover Teixeira','major','Glover knocked out Evans in the first round in 2016.'],
    [['Glover Teixeira','Jon Jones'],1,'Jon Jones','major','Jones defeated Glover over five rounds in a UFC light heavyweight title fight.'],
    [['Glover Teixeira','Jiri Prochazka'],1,'Jiri Prochazka','major','Jiri submitted Glover late in their classic UFC 275 title fight.'],
    [['Vitor Belfort','Anderson Silva'],1,'Anderson Silva','major','Silva knocked out Belfort with the front kick in their UFC middleweight title fight.'],
    [['Vitor Belfort','Jon Jones'],1,'Jon Jones','major','Jones survived Belfort’s early armbar and submitted him in their UFC light heavyweight title fight.'],
    [['Vitor Belfort','Michael Bisping'],1,'Vitor Belfort','major','Belfort stopped Bisping with a head kick in a pivotal middleweight contender fight.'],
    [['Forrest Griffin','Mauricio Rua'],2,'Split','major','Forrest submitted Shogun in 2007; Shogun won the 2011 rematch by first-round knockout. The UFC series is split 1-1.'],
    [['Lyoto Machida','Mauricio Rua'],2,'Split','major','Machida won the disputed first title fight; Shogun won the rematch by knockout. The UFC series is split 1-1.'],
    [['Jon Jones','Mauricio Rua'],1,'Jon Jones','major','Jones stopped Shogun to win the UFC light heavyweight title.'],
    [['Forrest Griffin','Rashad Evans'],1,'Rashad Evans','major','Evans stopped Griffin in the third round to win the UFC light heavyweight title.'],
    [['Forrest Griffin','Quinton Jackson'],1,'Forrest Griffin','major','Griffin defeated Jackson over five rounds to win the UFC light heavyweight title.'],
    [['Jon Jones','Rashad Evans'],1,'Jon Jones','major','Jones defeated Evans over five rounds in their UFC light heavyweight title fight.'],
    [['Lyoto Machida','Rashad Evans'],1,'Lyoto Machida','major','Machida knocked out Evans to win the UFC light heavyweight title.']
  ];

  function installDirectFights(){
    window.COMPARE_FIGHT_LEDGER=window.COMPARE_FIGHT_LEDGER||{};
    DIRECT_FIGHTS.forEach(([fighters,fights,winner,importance,summary])=>{
      const pair=fighters.slice().sort((a,b)=>key(a).localeCompare(key(b)));
      window.COMPARE_FIGHT_LEDGER[`${key(pair[0])}|${key(pair[1])}`]={fighters,fights,winner,importance,summary};
    });
  }

  function registerOne(cfg){
    DATA.men=DATA.men||[];
    DATA.fighters=DATA.fighters||[];
    DATA.primeRecords=DATA.primeRecords||{};
    const board=upsert(DATA.men,cfg.board);
    const profile=upsert(DATA.fighters,cfg.profile);
    DATA.primeRecords[cfg.name]={
      record:cfg.primeRecord,context:`${cfg.primeStartLabel} → ${cfg.primeEndLabel}`,
      wins:cfg.primeWins,losses:cfg.primeLosses,draws:cfg.primeDraws,ncs:cfg.primeNCs,
      source:'Canonical eight-fighter UFC prime recount',sourceVersion:VERSION,eraWindowLocked:true,primeDominanceRebuildVersion:VERSION
    };
    const store=overrides();
    if(store) store[cfg.name]={...(store[cfg.name]||{}),...cfg.display,compareProfile:{...(store[cfg.name]?.compareProfile||{}),...cfg.compare,legacyStats:{...(store[cfg.name]?.compareProfile?.legacyStats||{}),...cfg.compare.legacyStats}}};
    window.COMPARE_PROFILES=window.COMPARE_PROFILES||{};
    window.COMPARE_PROFILES[cfg.name]={...(window.COMPARE_PROFILES[cfg.name]||{}),...cfg.compare};
    const era=window.UFC_FIGHTER_ERA_LEDGERS;
    if(era?.ledgers){era.ledgers[cfg.name]=cfg.era;era.fighters=Array.from(new Set([...(era.fighters||[]),cfg.name]));}
    const championship=window.UFC_CHAMPIONSHIP_RESUME_LEDGERS;
    if(championship?.ledgers) championship.ledgers[cfg.name]={fighter:cfg.name,championshipWins:cfg.titleWins.map(row=>({...row}))};
    const quality=window.UFC_OPPONENT_QUALITY_LEDGERS;
    if(quality?.raw) quality.raw[cfg.name]=cfg.quality.map(row=>row.slice());
    return {fighter:cfg.name,boardRow:board,profile,eraLedgerRegistered:Boolean(era?.ledgers?.[cfg.name])};
  }

  function applyChampionshipOne(cfg){
    const report={
      fighter:cfg.name,status:'direct-ledger',titleFightWins:cfg.titleFightWins,adjustedTitleCredit:cfg.adjustedTitleWins,
      discountedWins:cfg.titleFightWins,reviewStatus:'locked',formulaScore:cfg.championship,wins:cfg.titleWins,version:VERSION
    };
    rowsFor(cfg.name).forEach(row=>{
      row.championship=cfg.championship;
      row.championshipResumeLive=true;
      row.championshipFormulaDriven=true;
      row.championshipResumeAudit=report;
      row.title={...(row.title||{}),...titleObject(cfg),discountedWins:cfg.titleFightWins,reviewStatus:'locked'};
      row.titleFightWins=cfg.titleFightWins;
    });
    const shadow=window.UFC_CHAMPIONSHIP_RESUME_SHADOW;
    if(shadow?.report) upsertReport(shadow.report,report,(a,b)=>Number(b.formulaScore||0)-Number(a.formulaScore||0));
    const display=overrides()?.[cfg.name];
    if(display) display.snapshotStats={...(display.snapshotStats||{}),titleFightWins:cfg.titleFightWins,adjustedTitleWins:cfg.adjustedTitleWins,championshipScore:cfg.championship};
    return {applied:true,fighter:cfg.name,score:cfg.championship,adjustedTitleCredit:cfg.adjustedTitleWins};
  }

  function applyOpponentQualityOne(cfg){
    const store=window.UFC_OPPONENT_QUALITY_LEDGERS;
    if(store?.raw) store.raw[cfg.name]=cfg.quality.map(row=>row.slice());
    const report={...cfg.oqSummary,liveScore:cfg.opponentQuality,categoryScore:cfg.opponentQuality,benchmarkCredit:14.1,sourceMode:'canonical-eight-fighter-fixed-audit',version:VERSION};
    rowsFor(cfg.name).forEach(row=>{
      row.opponentQuality=cfg.opponentQuality;
      row.opponentQualityLive=true;
      row.opponentQualityLiveAudit=report;
      row.opponentQualityShadowAudit=report;
      row.eliteWins=cfg.elitePlusWins;
      row.elitePlusWins=cfg.elitePlusWins;
      row.topFivePlusWins=cfg.topFivePlusWins;
      row.rankedQualityWins=cfg.rankedQualityWins;
      row.winProfile=cfg.winProfile;
    });
    const live=window.UFC_OPPONENT_QUALITY_LIVE;
    if(live?.report){upsertReport(live.report,report,(a,b)=>Number(b.liveScore||0)-Number(a.liveScore||0));live.fighters=live.report.length;}
    const audit=window.UFC_OPPONENT_QUALITY_SHADOW_AUDIT;
    if(audit?.report) upsertReport(audit.report,cfg.oqSummary,(a,b)=>Number(b.diminishedCredit||0)-Number(a.diminishedCredit||0));
    const display=overrides()?.[cfg.name];
    if(display) display.snapshotStats={...(display.snapshotStats||{}),eliteWins:cfg.elitePlusWins,elitePlusWins:cfg.elitePlusWins,topFivePlusWins:cfg.topFivePlusWins,rankedQualityWins:cfg.rankedQualityWins,bestQualityWins:cfg.bestWins.join(', '),winProfile:cfg.winProfile,opponentQualityScore:cfg.opponentQuality};
    return {applied:true,fighter:cfg.name,score:cfg.opponentQuality};
  }

  function installQualityLookup(){
    const audit=window.UFC_OPPONENT_QUALITY_SHADOW_AUDIT;
    if(!audit||audit.__eightLegendsSummaryWrapped) return;
    const previous=audit.summaryFor;
    audit.summaryFor=fighter=>byName.get(key(fighter))?.oqSummary||(typeof previous==='function'?previous(fighter):null);
    audit.__eightLegendsSummaryWrapped=true;
  }

  function installPrimeLookup(){
    const ledgers=window.UFC_PRIME_DOMINANCE_LEDGERS;
    if(!ledgers||ledgers.__eightLegendsEntryWrapped) return;
    const previous=ledgers.entryFor;
    ledgers.entryFor=fighter=>byName.get(key(fighter))?.prime||(typeof previous==='function'?previous(fighter):null);
    ledgers.__eightLegendsEntryWrapped=true;
    const roundAudit=window.UFC_PRIME_ROUND_CONTROL_AUDIT;
    if(roundAudit&&!roundAudit.__eightLegendsEntryWrapped){
      const prior=roundAudit.entryFor;
      roundAudit.entryFor=fighter=>byName.get(key(fighter))?.prime?.roundControlAudit||(typeof prior==='function'?prior(fighter):null);
      roundAudit.__eightLegendsEntryWrapped=true;
    }
  }

  function applyPrimeOne(cfg){
    const ledgers=window.UFC_PRIME_DOMINANCE_LEDGERS;
    if(!ledgers?.report) return {applied:false,fighter:cfg.name,error:'Prime Dominance chain not ready'};
    upsertReport(ledgers.report,cfg.prime,(a,b)=>Number(b.total||0)-Number(a.total||0));
    ledgers.leaders=ledgers.report.slice(0,15);
    ledgers.applied=Array.from(new Set([...(ledgers.applied||[]),cfg.name]));
    const roundAudit=window.UFC_PRIME_ROUND_CONTROL_AUDIT;
    if(roundAudit){
      roundAudit.report=Array.isArray(roundAudit.report)?roundAudit.report:[];
      upsertReport(roundAudit.report,cfg.prime.roundControlAudit,(a,b)=>Number(b.roundControlPct||0)-Number(a.roundControlPct||0));
    }
    rowsFor(cfg.name).forEach(row=>{
      row.primeRecord=cfg.primeRecord;
      row.primeDominance=cfg.primeDominance;
      row.primeDominanceShadowAudit=cfg.prime;
      row.roundsWonPct=cfg.roundsWonPct;
      row.primeFinishRatePct=cfg.primeFinishRatePct;
      row.timesFinishedPrime=cfg.timesFinishedPrime;
    });
    return {applied:true,fighter:cfg.name,entry:cfg.prime};
  }

  function applyApexOne(cfg){
    rowsFor(cfg.name).forEach(row=>{
      row.apexPeak=cfg.apexPeak;
      row.apexPeakAudit=cfg.apex;
      row.apexPeakBonusLive=true;
      row.apexPeakBonusVersion=VERSION;
    });
    const display=overrides()?.[cfg.name];
    if(display){display.apexPeakAudit=cfg.apex;display.snapshotStats={...(display.snapshotStats||{}),apexPeak:cfg.apexPeak,apexPeakAudit:cfg.apex};}
    const componentAudit=window.UFC_APEX_PEAK_COMPONENT_AUDIT;
    if(componentAudit){componentAudit.componentOverrides=componentAudit.componentOverrides||{};componentAudit.componentOverrides[cfg.name]=cfg.apex;componentAudit.patched=Array.from(new Set([...(componentAudit.patched||[]),cfg.name]));}
    return {applied:true,fighter:cfg.name,score:cfg.apexPeak};
  }

  function runBatch(stage,fn){
    const results=FIGHTERS.map(fn);
    return {
      applied:results.every(result=>result?.applied!==false),
      stage,version:VERSION,fighters:FIGHTERS.map(cfg=>cfg.name),results,
      error:results.find(result=>result?.error)?.error||null
    };
  }

  const API={
    version:VERSION,
    fighters:FIGHTERS.map(cfg=>cfg.name),
    registerBase(){
      installDirectFights();
      const results=FIGHTERS.map(cfg=>{
        const registered=registerOne(cfg);
        applyChampionshipOne(cfg);
        return {applied:true,...registered};
      });
      DATA.meta=DATA.meta||{};
      const current=DATA.meta.canonicalFighterRegistry||{};
      DATA.meta.canonicalFighterRegistry={
        ...current,version:`${current.version||BASE.version}+${VERSION}`,
        fighters:Array.from(new Set([...(current.fighters||[]),...(BASE.fighters||[]),...FIGHTERS.map(cfg=>cfg.name)])),
        appliedAt:new Date().toISOString()
      };
      return {applied:true,stage:'registerBase',version:VERSION,fighters:FIGHTERS.map(cfg=>cfg.name),results};
    },
    applyChampionship(){return runBatch('applyChampionship',applyChampionshipOne);},
    applyOpponentQuality(){installQualityLookup();return runBatch('applyOpponentQuality',applyOpponentQualityOne);},
    applyPrimeDominance(){installPrimeLookup();return runBatch('applyPrimeDominance',applyPrimeOne);},
    applyApexPeak(){return runBatch('applyApexPeak',applyApexOne);},
    finalize(){
      const results=FIGHTERS.map(cfg=>{
        const board=(DATA.men||[]).find(row=>key(row.fighter)===key(cfg.name));
        const profile=(DATA.fighters||[]).find(row=>key(row.fighter)===key(cfg.name));
        if(!board||!profile) return {applied:false,fighter:cfg.name,error:'Missing live rows'};
        board.eraDepthAdjustment=cfg.eraDepthAdjustment;
        profile.eraDepthAdjustment=cfg.eraDepthAdjustment;
        const display=overrides()?.[cfg.name];
        if(display){
          display.packetStatus={stage:'canonical live fighter',lastUpdated:'2026-07-12',nextFix:'Add real WebP thumbnail/profile assets and signature-fight links when supplied.'};
          display.repoLocations={scoreSource:'assets/data/canonical-fighter-registry-eight-legends.js',compareSource:'assets/data/canonical-fighter-registry-eight-legends.js'};
        }
        return {applied:true,fighter:cfg.name,totalScore:board.totalScore,overallOvr:board.overallOvr,rank:board.rank};
      });
      return {applied:results.every(result=>result.applied),stage:'finalize',version:VERSION,fighters:FIGHTERS.map(cfg=>cfg.name),results,error:results.find(result=>result.error)?.error||null};
    }
  };

  function combinedStage(stage,baseResult,batchResult){
    return {
      applied:Boolean(baseResult?.applied)&&Boolean(batchResult?.applied),
      stage,version:`${BASE.version}+${VERSION}`,
      fighters:Array.from(new Set([...(BASE.fighters||[]),...FIGHTERS.map(cfg=>cfg.name)])),
      base:baseResult,batch:batchResult,error:baseResult?.error||batchResult?.error||null
    };
  }

  const COMBINED={
    ...BASE,
    version:`${BASE.version}+${VERSION}`,
    fighters:Array.from(new Set([...(BASE.fighters||[]),...FIGHTERS.map(cfg=>cfg.name)])),
    registerBase(){return combinedStage('registerBase',BASE.registerBase(),API.registerBase());},
    applyChampionship(){return combinedStage('applyChampionship',BASE.applyChampionship(),API.applyChampionship());},
    applyOpponentQuality(){return combinedStage('applyOpponentQuality',BASE.applyOpponentQuality(),API.applyOpponentQuality());},
    applyPrimeDominance(){return combinedStage('applyPrimeDominance',BASE.applyPrimeDominance(),API.applyPrimeDominance());},
    applyApexPeak(){return combinedStage('applyApexPeak',BASE.applyApexPeak(),API.applyApexPeak());},
    finalize(){return combinedStage('finalize',BASE.finalize(),API.finalize());}
  };

  window.UFC_EIGHT_LEGENDS_REGISTRY=API;
  window.UFC_CANONICAL_FIGHTER_REGISTRY=COMBINED;
  document.documentElement.setAttribute('data-eight-legends-registry-ready',VERSION);
})();

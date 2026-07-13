// Canonical eight-fighter UFC-only registry batch.
(function(){
  'use strict';

  const BASE=window.UFC_CANONICAL_FIGHTER_REGISTRY;
  const DATA=window.RANKING_DATA;
  if(!BASE||!DATA){
    console.error('Eight-fighter registry requires the canonical registry and RANKING_DATA.');
    return;
  }

  const VERSION='canonical-fighter-registry-eight-legends-20260712a';
  const NAMES=[
    'Frank Shamrock','Benson Henderson','Fabricio Werdum','Glover Teixeira',
    'Vitor Belfort','Mauricio Rua','Forrest Griffin','Rashad Evans'
  ];

  const FIGHTERS=[
    {
      id:'FS001',name:'Frank Shamrock',displayName:'Frank Shamrock',record:'5-0',
      primary:'Light Heavyweight',secondary:'Middleweight',divisionLabel:'LHW',
      scores:{championship:8.60,opponentQuality:8.50,primeDominance:24.00,longevity:4.95,apexPeak:5.30,penalty:0,eraDepthAdjustment:-2.00},
      prime:{record:'5-0',wins:5,losses:0,draws:0,finishRate:80,roundsWonPct:91.67,finishWins:4,timesFinished:0,start:'1997-12-21',startLabel:'Kevin Jackson',end:'1999-09-24',endLabel:'Tito Ortiz',endType:'retirement_win',endReason:'Left the UFC unbeaten after defending the title against Tito Ortiz.'},
      longevity:{gapAdjustedMonths:24.0,activeEliteYears:2.00,statusMultiplier:1.10,divisionMultiplier:.90,note:'Short but uninterrupted first-champion window; early-era depth compressed.'},
      titles:{adjusted:4.15,wins:[
        ['Kevin Jackson','UFC Japan','1997-12-21','normal',.80,'Won the inaugural UFC light heavyweight title in 16 seconds.'],
        ['Igor Zinoviev','UFC 16','1998-03-13','normal',.82,'First defense; fast finish over an unbeaten challenger.'],
        ['Jeremy Horn','UFC 17','1998-05-15','normal',.82,'Submission defense over a durable elite-era challenger.'],
        ['John Lober','UFC Brazil','1998-10-16','normal',.73,'Defense discounted for opponent depth.'],
        ['Tito Ortiz','UFC 22','1999-09-24','normal',.98,'Signature defense over the next divisional champion.']
      ]},
      quality:{elite:3,top5:3,ranked:5,raw:5.0,diminished:4.0,best:['Tito Ortiz','Jeremy Horn','Igor Zinoviev','Kevin Jackson','John Lober'],rows:[
        ['Tito Ortiz',1.25,'True elite win','Beat the future long-reigning champion in the signature defense.'],
        ['Jeremy Horn',1.00,'Top-five era win','High-level submission defense over a durable contender.'],
        ['Igor Zinoviev',.85,'Elite-era win','Unbeaten challenger and dangerous early-era finisher.'],
        ['Kevin Jackson',.55,'Ranked quality win','Olympic-level athlete, discounted for MMA inexperience.'],
        ['John Lober',.35,'Supporting title win','Valid defense with a substantial opponent-depth discount.']
      ]},
      apex:{score:5.30,window:'Jeremy Horn 1998 + Tito Ortiz 1999',performances:[
        ['Jeremy Horn','1998-05-15',8.7,'Submission defense against a durable elite-era challenger.'],
        ['Tito Ortiz','1999-09-24',9.4,'Late comeback finish in the defining early light-heavyweight title fight.']
      ],components:{twoPerformanceStrength:1.80,proof:1.20,bestFighterClaim:1.10,aura:1.20}},
      lossContext:{unrecoveredLoss:null,recoveredLosses:[],upwardDivisionLosses:[],postPrimeLosses:[],weirdResults:[]},
      tag:'Unbeaten first LHW champion',
      oneLiner:'The UFC’s first light-heavyweight champion went 5-0 with four defenses, capped by a signature finish of Tito Ortiz.',
      whyRanked:'Frank’s unbeaten five-title-fight run gives him one of the cleanest early championship résumés in UFC history.',
      whyNot:'Only five UFC fights, a two-year elite window, and a developing late-1990s field keep the unbeaten reign below deeper modern résumés.',
      compare:{peak:'His Tito Ortiz comeback finish is one of the defining early championship performances.',counter:'The strongest case against Frank is volume: five UFC fights cannot match decade-long elite résumés.',edge:'Frank wins comparisons through championship authority, unbeaten dominance, and the Tito signature win.',scope:'Strikeforce, WEC, Pancrase, and other non-UFC accomplishments are context only.'}
    },
    {
      id:'BH001',name:'Benson Henderson',displayName:'Benson “Smooth” Henderson',record:'11-3',
      primary:'Lightweight',secondary:'Welterweight',divisionLabel:'LW / WW',
      scores:{championship:7.45,opponentQuality:17.50,primeDominance:22.50,longevity:12.00,apexPeak:4.20,penalty:-6.00,eraDepthAdjustment:0},
      prime:{record:'10-3',wins:10,losses:3,draws:0,finishRate:20.00,roundsWonPct:70.00,finishWins:2,timesFinished:2,start:'2011-08-14',startLabel:'Jim Miller',end:'2015-11-28',endLabel:'Jorge Masvidal',endType:'promotion_exit_win',endReason:'Closed his UFC run with a second straight welterweight win before leaving the promotion.'},
      longevity:{gapAdjustedMonths:48.5,activeEliteYears:4.04,statusMultiplier:1.08,divisionMultiplier:1.10,note:'Four-plus elite UFC years in the strongest lightweight era, with no gap padding.'},
      titles:{adjusted:3.60,wins:[
        ['Frankie Edgar','UFC 144','2012-02-26','normal',.95,'Won the lightweight title from an elite champion.'],
        ['Frankie Edgar','UFC 150','2012-08-11','normal',.90,'Close but valid rematch defense.'],
        ['Nate Diaz','UFC on Fox 5','2012-12-08','normal',.90,'Clear five-round defense over an elite challenger.'],
        ['Gilbert Melendez','UFC on Fox 7','2013-04-20','normal',.85,'Close defense over an elite incoming champion.']
      ]},
      quality:{elite:8,top5:7,ranked:10,raw:9.2,diminished:8.23,best:['Frankie Edgar','Gilbert Melendez','Nate Diaz','Josh Thomson','Donald Cerrone','Jorge Masvidal'],rows:[
        ['Frankie Edgar I',1.25,'Max-credit elite win','Beat the reigning lightweight champion.'],
        ['Frankie Edgar II',1.10,'Elite title win','Close rematch defense over an all-time lightweight.'],
        ['Gilbert Melendez',1.10,'Elite title win','Beat an elite incoming champion in a close defense.'],
        ['Nate Diaz',1.00,'Top-five title win','Dominant five-round title defense.'],
        ['Josh Thomson',.90,'Top-five win','High-level win over a former champion.'],
        ['Donald Cerrone',.80,'Ranked quality win','Beat a durable ranked contender on short notice.'],
        ['Jorge Masvidal',.75,'Ranked quality win','Welterweight main-event win over a future elite contender.'],
        ['Jim Miller',.75,'Ranked quality win','Ended Miller’s seven-fight streak.'],
        ['Clay Guida',.65,'Ranked quality win','Title-eliminator victory.'],
        ['Rustam Khabilov',.55,'Solid ranked win','Late submission in a competitive main event.']
      ]},
      apex:{score:4.20,window:'Frankie Edgar 2012 + Nate Diaz 2012',performances:[
        ['Frankie Edgar','2012-02-26',8.8,'Won the UFC lightweight title from an elite champion.'],
        ['Nate Diaz','2012-12-08',8.9,'Clear five-round defense and one of his best complete performances.']
      ],components:{twoPerformanceStrength:1.70,proof:1.00,bestFighterClaim:.85,aura:.65}},
      lossContext:{unrecoveredLoss:null,recoveredLosses:[
        {label:'Anthony Pettis',date:'2013-08-31',type:'prime elite title finish loss',method:'Submission',recovery:'Rebounded with ranked wins and remained elite.'},
        {label:'Rafael dos Anjos',date:'2014-08-23',type:'prime elite finish loss',method:'KO',recovery:'Won three later UFC fights afterward.'},
        {label:'Donald Cerrone',date:'2015-01-18',type:'prime elite decision loss',method:'Decision',recovery:'Won two welterweight main events afterward.'}
      ],upwardDivisionLosses:[],postPrimeLosses:[],weirdResults:[]},
      tag:'Four-win lightweight title run',
      oneLiner:'Four UFC title-fight wins and a deep lightweight ledger, balanced against three prime elite losses and limited finishing separation.',
      whyRanked:'Benson’s four title-fight wins and elite lightweight depth make him one of the strongest missing modern résumés.',
      whyNot:'Several defining wins were close decisions, his UFC finish rate was low, and three prime elite losses prevent a higher championship-tier placement.',
      compare:{peak:'At his best, Benson combined pace, scrambling, durability, and five-round composure against elite lightweights.',counter:'His counterargument problem is separation: too many major wins were close and he was finished twice in prime.',edge:'Benson wins comparisons through title volume and the depth of his lightweight schedule.',scope:'WEC and Bellator accomplishments are excluded.'}
    },
    {
      id:'FW001',name:'Fabricio Werdum',displayName:'Fabricio “Vai Cavalo” Werdum',record:'11-5',
      primary:'Heavyweight',secondary:null,divisionLabel:'HW',
      scores:{championship:3.72,opponentQuality:17.50,primeDominance:21.50,longevity:16.00,apexPeak:5.20,penalty:-8.25,eraDepthAdjustment:0},
      prime:{record:'9-3',wins:9,losses:3,draws:0,finishRate:66.67,roundsWonPct:73.33,finishWins:6,timesFinished:2,start:'2012-02-04',startLabel:'Roy Nelson',end:'2020-07-25',endLabel:'Alexander Gustafsson',endType:'promotion_exit_win',endReason:'Finished his UFC run with a submission of Alexander Gustafsson after re-establishing elite form.'},
      longevity:{gapAdjustedMonths:72.0,activeEliteYears:6.00,statusMultiplier:1.06,divisionMultiplier:.98,note:'Long second UFC run with heavyweight context compression and suspension/inactivity gaps capped.'},
      titles:{adjusted:1.80,wins:[
        ['Mark Hunt','UFC 180','2014-11-15','interim',.80,'Won the interim heavyweight title with a second-round finish.'],
        ['Cain Velasquez','UFC 188','2015-06-13','normal',1.00,'Unified the title by submitting the reigning champion.']
      ]},
      quality:{elite:7,top5:6,ranked:10,raw:9.1,diminished:8.23,best:['Cain Velasquez','Mark Hunt','Antonio Rodrigo Nogueira','Alexander Gustafsson','Travis Browne','Roy Nelson'],rows:[
        ['Cain Velasquez',1.25,'Max-credit elite title win','Submitted the reigning heavyweight champion.'],
        ['Mark Hunt',1.00,'Elite interim-title win','Finished an elite heavyweight for interim gold.'],
        ['Antonio Rodrigo Nogueira',.95,'Elite former-champion win','Submitted a still-relevant former champion.'],
        ['Alexander Gustafsson',.85,'Elite-name heavyweight win','Submitted an elite light-heavyweight in his final UFC bout.'],
        ['Travis Browne I',.85,'Top-five win','Dominant five-round contender win.'],
        ['Roy Nelson',.75,'Ranked quality win','Clear decision over a durable ranked heavyweight.'],
        ['Marcin Tybura',.65,'Ranked quality win','Five-round main-event win.'],
        ['Travis Browne II',.55,'Ranked quality win','Second win over a declining but ranked opponent.'],
        ['Gabriel Gonzaga',.55,'Supporting ranked win','Early UFC finish over a dangerous heavyweight.'],
        ['Brandon Vera',.40,'Supporting win','Useful first-stint UFC victory.']
      ]},
      apex:{score:5.20,window:'Mark Hunt 2014 + Cain Velasquez 2015',performances:[
        ['Mark Hunt','2014-11-15',8.8,'Comeback knee finish for the interim title at altitude.'],
        ['Cain Velasquez','2015-06-13',9.6,'Submitted the reigning champion in Mexico City.']
      ],components:{twoPerformanceStrength:1.84,proof:1.20,bestFighterClaim:1.10,aura:1.06}},
      lossContext:{unrecoveredLoss:null,recoveredLosses:[
        {label:'Andrei Arlovski',date:'2007-04-21',type:'pre-prime elite decision loss',method:'Decision'},
        {label:'Junior dos Santos',date:'2008-10-25',type:'pre-prime elite finish loss',method:'KO'},
        {label:'Stipe Miocic',date:'2016-05-14',type:'prime elite title finish loss',method:'KO',recovery:'Returned to ranked winning form.'},
        {label:'Alistair Overeem',date:'2017-07-08',type:'prime elite decision loss',method:'Decision',recovery:'Won a later UFC main event.'},
        {label:'Alexander Volkov',date:'2018-03-17',type:'prime elite finish loss',method:'KO',recovery:'Later submitted Alexander Gustafsson.'}
      ],upwardDivisionLosses:[],postPrimeLosses:[],weirdResults:[]},
      tag:'Cain-submitting heavyweight champion',
      oneLiner:'A heavyweight champion with elite submission wins over Cain Velasquez and Nogueira, held back by five counted UFC losses.',
      whyRanked:'Werdum owns one of the best heavyweight wins ever, two title-fight wins, and a deep second UFC run.',
      whyNot:'He went 11-5 in the UFC, was finished in multiple counted losses, and never defended the undisputed title.',
      compare:{peak:'Submitting Cain Velasquez after finishing Mark Hunt created a genuine best-heavyweight-in-the-world peak.',counter:'The case against Werdum is loss volume and the absence of an undisputed defense.',edge:'Werdum wins comparisons through signature heavyweight wins and submission authority.',scope:'PRIDE, Strikeforce, PFL, and all other non-UFC results are excluded.'}
    },
    {
      id:'GT001',name:'Glover Teixeira',displayName:'Glover Teixeira',record:'16-7',
      primary:'Light Heavyweight',secondary:null,divisionLabel:'LHW',
      scores:{championship:1.97,opponentQuality:15.50,primeDominance:20.50,longevity:20.25,apexPeak:4.40,penalty:-10,eraDepthAdjustment:0},
      prime:{record:'10-6',wins:10,losses:6,draws:0,finishRate:80.00,roundsWonPct:66.67,finishWins:8,timesFinished:4,start:'2013-09-04',startLabel:'Ryan Bader',end:'2022-06-12',endLabel:'Jiri Prochazka',endType:'unrecovered_elite_loss',endReason:'Lost the title to Jiri Prochazka after a late-career championship surge; the Hill fight is post-prime.'},
      longevity:{gapAdjustedMonths:90.0,activeEliteYears:7.50,statusMultiplier:1.08,divisionMultiplier:1.00,note:'Long elite window with late-career title proof; inactivity gaps capped.'},
      titles:{adjusted:.95,wins:[
        ['Jan Blachowicz','UFC 267','2021-10-30','normal',.95,'Submitted the reigning champion to win the title.']
      ]},
      quality:{elite:7,top5:6,ranked:12,raw:8.6,diminished:7.29,best:['Jan Blachowicz','Thiago Santos','Anthony Smith','Rashad Evans','Ryan Bader','Ovince Saint Preux'],rows:[
        ['Jan Blachowicz',1.20,'Elite title win','Submitted the reigning champion.'],
        ['Thiago Santos',1.00,'Top-five win','Survived danger and submitted a recent title challenger.'],
        ['Anthony Smith',.95,'Top-five win','Dominant five-round stoppage over a recent title challenger.'],
        ['Rashad Evans',.80,'Former-champion win','Knocked out a declining former champion.'],
        ['Ryan Bader',.80,'Top-five win','Comeback knockout over a title-level contender.'],
        ['Ovince Saint Preux',.75,'Ranked quality win','Five-round main-event submission.'],
        ['Jared Cannonier',.65,'Ranked quality win','Decision over a future elite middleweight.'],
        ['Nikita Krylov',.65,'Ranked quality win','Close win over a durable contender.'],
        ['Ion Cutelaba',.55,'Ranked quality win','Submission over a dangerous prospect.'],
        ['Misha Cirkunov',.50,'Supporting ranked win','Quick knockout over a ranked contender.']
      ]},
      apex:{score:4.40,window:'Thiago Santos 2020 + Jan Blachowicz 2021',performances:[
        ['Thiago Santos','2020-11-07',8.5,'Survived two knockdowns and forced a submission.'],
        ['Jan Blachowicz','2021-10-30',9.1,'Submitted the reigning champion to complete the late-career title run.']
      ],components:{twoPerformanceStrength:1.76,proof:1.05,bestFighterClaim:.90,aura:.69}},
      lossContext:{unrecoveredLoss:{label:'Jiri Prochazka',date:'2022-06-12',type:'prime elite title finish loss',method:'Submission'},recoveredLosses:[
        {label:'Jon Jones',date:'2014-04-26',type:'prime elite title decision loss',method:'Decision',recovery:'Returned to elite contention and later won the title.'},
        {label:'Phil Davis',date:'2014-10-25',type:'prime elite decision loss',method:'Decision',recovery:'Returned to ranked winning form.'},
        {label:'Anthony Johnson',date:'2016-08-20',type:'prime elite finish loss',method:'KO',recovery:'Returned with ranked wins.'},
        {label:'Alexander Gustafsson',date:'2017-05-28',type:'prime elite finish loss',method:'KO',recovery:'Built a five-fight title run.'},
        {label:'Corey Anderson',date:'2018-07-22',type:'prime non-elite decision loss',method:'Decision',recovery:'Won five straight afterward.'}
      ],upwardDivisionLosses:[],postPrimeLosses:[{label:'Jamahal Hill',date:'2023-01-21',type:'post-prime elite title decision loss',method:'Decision'}],weirdResults:[]},
      tag:'Late-career LHW champion',
      oneLiner:'A 16-win UFC light-heavyweight run and remarkable late title surge, capped by the model’s loss-context ceiling.',
      whyRanked:'Glover combines major win volume, elite longevity, a championship, and a rare late-career peak.',
      whyNot:'Six losses fall inside the counted prime window, including four finishes, forcing the maximum loss-context penalty.',
      compare:{peak:'The Santos-to-Jan run turned a veteran contender into the oldest first-time UFC champion.',counter:'Glover’s real counterweight is the maximum loss penalty and only one title-fight win.',edge:'Glover wins comparisons through longevity, win volume, and late-career championship proof.',scope:'Non-UFC accomplishments are context only.'}
    },
    {
      id:'VB001',name:'Vitor Belfort',displayName:'Vitor “The Phenom” Belfort',record:'15-10, 1 NC',
      primary:'Light Heavyweight',secondary:'Middleweight',divisionLabel:'LHW / MW / HW',
      scores:{championship:2.59,opponentQuality:13.83,primeDominance:20.00,longevity:20.00,apexPeak:5.00,penalty:-10,eraDepthAdjustment:-.50},
      prime:{record:'9-6',wins:9,losses:6,draws:0,finishRate:100.00,roundsWonPct:68.75,finishWins:9,timesFinished:5,start:'1998-10-16',startLabel:'Wanderlei Silva',end:'2015-05-23',endLabel:'Chris Weidman',endType:'unrecovered_elite_loss',endReason:'The Weidman title loss ended the last elite UFC title run; later UFC results are post-prime.'},
      longevity:{gapAdjustedMonths:96.0,activeEliteYears:8.00,statusMultiplier:1.04,divisionMultiplier:.96,note:'Exceptional multi-era relevance, but long absences are capped and early-era depth is compressed.'},
      titles:{adjusted:1.25,wins:[
        ['Tank Abbott','UFC 12','1997-02-07','tournament',.65,'Won the UFC 12 heavyweight tournament; early-field discount.'],
        ['Randy Couture','UFC 46','2004-01-31','normal',.60,'Won the light-heavyweight title via early cut stoppage; major technical-result discount.']
      ]},
      quality:{elite:6,top5:5,ranked:10,raw:7.7,diminished:6.50,best:['Randy Couture','Michael Bisping','Luke Rockhold','Wanderlei Silva','Dan Henderson','Rich Franklin'],rows:[
        ['Randy Couture',1.00,'Elite title win','Official title victory, discounted for accidental cut stoppage.'],
        ['Michael Bisping',.95,'Top-five win','Head-kick finish over a top contender.'],
        ['Luke Rockhold',.95,'Top-five win','Signature spinning-kick finish over a future champion.'],
        ['Wanderlei Silva',.85,'Elite-era win','Iconic 44-second knockout.'],
        ['Dan Henderson',.80,'Elite former-champion win','Fast knockout in their UFC rematch.'],
        ['Rich Franklin',.75,'Ranked quality win','Catchweight knockout over a former champion.'],
        ['Anthony Johnson',.65,'Ranked quality win','Submission over a dangerous contender.'],
        ['Yoshihiro Akiyama',.55,'Supporting ranked win','Quick knockout over a durable veteran.'],
        ['Marvin Eastman',.45,'Supporting win','Violent finish in the light-heavyweight division.'],
        ['Tank Abbott',.35,'Tournament win','Historically important but heavily era-discounted.']
      ]},
      apex:{score:5.00,window:'Michael Bisping 2013 + Luke Rockhold 2013',performances:[
        ['Michael Bisping','2013-01-19',8.8,'Head-kick finish in a title-eliminator-level fight.'],
        ['Luke Rockhold','2013-05-18',9.2,'Spinning-heel-kick knockout over a future champion.']
      ],components:{twoPerformanceStrength:1.80,proof:1.10,bestFighterClaim:.95,aura:1.15}},
      lossContext:{unrecoveredLoss:{label:'Chris Weidman',date:'2015-05-23',type:'prime elite title finish loss',method:'TKO'},recoveredLosses:[
        {label:'Randy Couture I',date:'1997-05-30',type:'pre-prime elite finish loss',method:'TKO'},
        {label:'Chuck Liddell',date:'2002-06-22',type:'prime elite decision loss',method:'Decision',recovery:'Later won the UFC title.'},
        {label:'Randy Couture III',date:'2004-08-21',type:'prime elite title finish loss',method:'TKO',recovery:'Later rebuilt into a middleweight title run.'},
        {label:'Tito Ortiz',date:'2005-02-05',type:'prime elite decision loss',method:'Split decision',recovery:'Later returned to title contention.'},
        {label:'Anderson Silva',date:'2011-02-05',type:'prime elite title finish loss',method:'KO',recovery:'Won three straight UFC fights afterward.'}
      ],upwardDivisionLosses:[{label:'Jon Jones',date:'2012-09-22',type:'prime upward-division elite title finish loss',method:'Submission'}],postPrimeLosses:[
        {label:'Jacare Souza',date:'2016-05-14',type:'post-prime elite finish loss',method:'TKO'},
        {label:'Lyoto Machida',date:'2018-05-12',type:'post-prime elite finish loss',method:'KO'},
        {label:'Gegard Mousasi',date:'2018-10-06',type:'post-prime elite finish loss',method:'TKO'}
      ],weirdResults:[{label:'Kelvin Gastelum no contest',date:'2017-03-11',type:'post-prime no contest',officialLoss:false,penaltyExempt:true}]},
      tag:'Three-era knockout phenom',
      oneLiner:'Fifteen UFC wins and three eras of elite knockout danger, but an extreme loss ledger and technical title win cap the résumé.',
      whyRanked:'Vitor’s longevity, finish rate, and collection of elite knockout wins create real UFC-only value.',
      whyNot:'He reached the maximum loss penalty, won the UFC title through a freak cut, and never sustained a long undisputed reign.',
      compare:{peak:'The Bisping and Rockhold knockouts captured the most explosive version of Vitor.',counter:'His losses, no sustained title reign, and technical Couture title win prevent a higher placement.',edge:'Vitor wins comparisons through elite finish volume and multi-era relevance.',scope:'PRIDE, Strikeforce, Cage Rage, and other non-UFC achievements are excluded.'}
    },
    {
      id:'MR001',name:'Mauricio Rua',displayName:'Mauricio “Shogun” Rua',record:'11-11-1',
      primary:'Light Heavyweight',secondary:null,divisionLabel:'LHW',
      scores:{championship:1.97,opponentQuality:12.34,primeDominance:18.50,longevity:18.50,apexPeak:4.80,penalty:-10,eraDepthAdjustment:0},
      prime:{record:'5-6',wins:5,losses:6,draws:0,finishRate:100.00,roundsWonPct:61.54,finishWins:5,timesFinished:4,start:'2009-04-18',startLabel:'Chuck Liddell',end:'2014-11-08',endLabel:'Ovince Saint Preux',endType:'unrecovered_non_elite_loss',endReason:'The OSP knockout closed the elite UFC window; later wins did not restore top-five status.'},
      longevity:{gapAdjustedMonths:78.0,activeEliteYears:6.50,statusMultiplier:1.03,divisionMultiplier:1.00,note:'Long UFC light-heavyweight relevance with ordinary gaps capped.'},
      titles:{adjusted:.95,wins:[
        ['Lyoto Machida','UFC 113','2010-05-08','normal',.95,'Knocked out the undefeated champion in the rematch.']
      ]},
      quality:{elite:6,top5:5,ranked:9,raw:7.0,diminished:5.80,best:['Lyoto Machida','Chuck Liddell','Forrest Griffin','Dan Henderson','Antonio Rogerio Nogueira'],rows:[
        ['Lyoto Machida',1.25,'Max-credit elite title win','Knocked out the undefeated champion.'],
        ['Chuck Liddell',.90,'Elite former-champion win','Finished a declining but still ranked legend.'],
        ['Forrest Griffin',.85,'Former-champion win','Avenged the debut loss with a first-round knockout.'],
        ['Dan Henderson',.80,'Elite former-champion win','Won the rematch after losing the classic first fight.'],
        ['Antonio Rogerio Nogueira I',.75,'Ranked quality win','Close win over a durable ranked rival.'],
        ['Antonio Rogerio Nogueira II',.60,'Ranked quality win','Second UFC win in the rivalry.'],
        ['Brandon Vera',.55,'Supporting ranked win','Main-event knockout.'],
        ['Corey Anderson',.50,'Ranked quality win','Close decision over a future elite contender.'],
        ['Tyson Pedro',.40,'Supporting win','Late-career finish.']
      ]},
      apex:{score:4.80,window:'Lyoto Machida I 2009 + Lyoto Machida II 2010',performances:[
        ['Lyoto Machida I','2009-10-24',9.0,'Widely viewed as championship-level performance despite the official loss.'],
        ['Lyoto Machida II','2010-05-08',9.4,'First-round knockout to win the title.']
      ],components:{twoPerformanceStrength:1.84,proof:1.15,bestFighterClaim:1.00,aura:.81}},
      lossContext:{unrecoveredLoss:{label:'Ovince Saint Preux',date:'2014-11-08',type:'prime non-elite finish loss',method:'KO'},recoveredLosses:[
        {label:'Forrest Griffin I',date:'2007-09-22',type:'pre-prime non-elite finish loss',method:'Submission'},
        {label:'Lyoto Machida I',date:'2009-10-24',type:'prime elite title decision loss',method:'Decision',recovery:'Won the immediate rematch by knockout.'},
        {label:'Jon Jones',date:'2011-03-19',type:'prime elite title finish loss',method:'TKO',recovery:'Avenged the Forrest loss afterward.'},
        {label:'Dan Henderson I',date:'2011-11-19',type:'prime elite decision loss',method:'Decision',recovery:'Later won the rematch.'},
        {label:'Alexander Gustafsson',date:'2012-12-08',type:'prime elite decision loss',method:'Decision',recovery:'Later beat Dan Henderson.'},
        {label:'Chael Sonnen',date:'2013-08-17',type:'prime non-elite finish loss',method:'Submission',recovery:'Won the Henderson rematch.'}
      ],upwardDivisionLosses:[],postPrimeLosses:[
        {label:'Anthony Smith',date:'2018-07-22',type:'post-prime elite finish loss',method:'KO'},
        {label:'Paul Craig II',date:'2020-11-21',type:'post-prime finish loss',method:'TKO'},
        {label:'Ovince Saint Preux II',date:'2022-05-07',type:'post-prime decision loss',method:'Decision'},
        {label:'Ihor Potieria',date:'2023-01-21',type:'post-prime finish loss',method:'TKO'}
      ],weirdResults:[{label:'Paul Craig I draw',date:'2019-11-16',type:'post-prime draw',penaltyExempt:true}]},
      tag:'UFC champion, Pride excluded',
      oneLiner:'A real UFC title peak and several elite light-heavyweight wins, dramatically reduced by an 11-11-1 UFC record.',
      whyRanked:'Shogun’s Machida title win, Liddell finish, Griffin revenge, and Henderson rivalry give him meaningful UFC-only substance.',
      whyNot:'PRIDE is excluded, the UFC record is .500, and the loss-context ceiling erases much of the positive résumé.',
      compare:{peak:'The two Machida fights represent championship-level proof and an iconic title knockout.',counter:'His all-MMA reputation is much stronger than his UFC-only résumé, which is exactly 11-11-1.',edge:'Shogun wins comparisons through peak quality and signature wins, not consistency.',scope:'All PRIDE accomplishments are excluded from the score.'}
    },
    {
      id:'FG001',name:'Forrest Griffin',displayName:'Forrest Griffin',record:'9-5',
      primary:'Light Heavyweight',secondary:null,divisionLabel:'LHW',
      scores:{championship:1.97,opponentQuality:10.64,primeDominance:18.00,longevity:10.80,apexPeak:4.30,penalty:-9.50,eraDepthAdjustment:0},
      prime:{record:'4-3',wins:4,losses:3,draws:0,finishRate:25.00,roundsWonPct:64.29,finishWins:1,timesFinished:3,start:'2007-09-22',startLabel:'Mauricio Rua',end:'2011-08-27',endLabel:'Mauricio Rua II',endType:'unrecovered_elite_loss',endReason:'The Shogun rematch loss ended the elite window; the final Tito fight was post-prime.'},
      longevity:{gapAdjustedMonths:48.0,activeEliteYears:4.00,statusMultiplier:1.04,divisionMultiplier:1.00,note:'Four-year championship-level window from the Shogun upset through the rematch.'},
      titles:{adjusted:.95,wins:[
        ['Quinton Jackson','UFC 86','2008-07-05','normal',.95,'Won the light-heavyweight title in a close five-round fight.']
      ]},
      quality:{elite:4,top5:4,ranked:7,raw:5.8,diminished:5.00,best:['Mauricio Rua','Quinton Jackson','Rich Franklin','Tito Ortiz','Stephan Bonnar'],rows:[
        ['Mauricio Rua',1.25,'Max-credit elite win','Submitted a top-five incoming star in a major upset.'],
        ['Quinton Jackson',1.10,'Elite title win','Won the title from the reigning champion.'],
        ['Rich Franklin',.85,'Elite former-champion win','Decision over a still-relevant former champion.'],
        ['Tito Ortiz II',.75,'Former-champion win','Avenged the earlier loss.'],
        ['Tito Ortiz III',.50,'Supporting former-champion win','Late-career trilogy victory.'],
        ['Stephan Bonnar',.35,'Historic supporting win','Historic fight, limited elite résumé value.'],
        ['Hector Ramirez',.20,'Supporting win','Useful early UFC victory.']
      ]},
      apex:{score:4.30,window:'Mauricio Rua 2007 + Quinton Jackson 2008',performances:[
        ['Mauricio Rua','2007-09-22',9.0,'Major upset submission over an elite incoming contender.'],
        ['Quinton Jackson','2008-07-05',8.8,'Five-round title win over the reigning champion.']
      ],components:{twoPerformanceStrength:1.78,proof:1.05,bestFighterClaim:.85,aura:.62}},
      lossContext:{unrecoveredLoss:{label:'Mauricio Rua II',date:'2011-08-27',type:'prime elite finish loss',method:'KO'},recoveredLosses:[
        {label:'Tito Ortiz I',date:'2006-04-15',type:'pre-prime elite decision loss',method:'Split decision'},
        {label:'Keith Jardine',date:'2006-12-30',type:'pre-prime non-elite finish loss',method:'TKO'},
        {label:'Rashad Evans',date:'2008-12-27',type:'prime elite title finish loss',method:'TKO',recovery:'Beat Tito Ortiz and Rich Franklin afterward.'},
        {label:'Anderson Silva',date:'2009-08-08',type:'prime elite finish loss',method:'KO',recovery:'Returned with elite wins.'}
      ],upwardDivisionLosses:[],postPrimeLosses:[],weirdResults:[]},
      tag:'TUF pioneer and LHW champion',
      oneLiner:'An iconic UFC champion with huge Shogun and Rampage wins, but a short elite run and severe finish-loss damage.',
      whyRanked:'Forrest owns two excellent signature wins, a UFC title, and a central place in the promotion’s breakthrough era.',
      whyNot:'Only nine UFC wins, three prime stoppage losses, and limited dominance prevent a higher résumé ranking.',
      compare:{peak:'The Shogun upset followed by the Rampage title win was a legitimate championship apex.',counter:'Forrest’s résumé is top-heavy and his prime durability was poor against elite finishers.',edge:'Forrest wins comparisons through two signature wins and championship proof.',scope:'Only UFC accomplishments are scored.'}
    },
    {
      id:'RE001',name:'Rashad Evans',displayName:'Rashad “Suga” Evans',record:'14-8-1',
      primary:'Light Heavyweight',secondary:'Middleweight',divisionLabel:'LHW / MW',
      scores:{championship:1.97,opponentQuality:13.19,primeDominance:19.50,longevity:13.10,apexPeak:4.50,penalty:-7.75,eraDepthAdjustment:0},
      prime:{record:'9-3',wins:9,losses:3,draws:0,finishRate:44.44,roundsWonPct:70.59,finishWins:4,timesFinished:1,start:'2007-11-17',startLabel:'Michael Bisping',end:'2013-11-16',endLabel:'Chael Sonnen',endType:'elite_recovery_win',endReason:'The Chael Sonnen finish closed the last clear elite UFC stretch; later losses are post-prime.'},
      longevity:{gapAdjustedMonths:72.0,activeEliteYears:6.00,statusMultiplier:1.05,divisionMultiplier:1.00,note:'Six-year elite light-heavyweight window with championship and contender relevance.'},
      titles:{adjusted:.95,wins:[
        ['Forrest Griffin','UFC 92','2008-12-27','normal',.95,'Stopped the reigning champion to win the title.']
      ]},
      quality:{elite:7,top5:6,ranked:10,raw:7.3,diminished:6.20,best:['Chuck Liddell','Forrest Griffin','Quinton Jackson','Phil Davis','Tito Ortiz','Dan Henderson'],rows:[
        ['Chuck Liddell',1.20,'Elite former-champion win','Signature knockout over a still-highly-ranked legend.'],
        ['Forrest Griffin',1.10,'Elite title win','Stopped the reigning champion.'],
        ['Quinton Jackson',1.00,'Top-five win','Clear rivalry win over a former champion.'],
        ['Phil Davis',.95,'Top-five win','Dominant five-round title eliminator.'],
        ['Tito Ortiz',.80,'Former-champion win','Stopped Ortiz in the rematch.'],
        ['Dan Henderson',.80,'Elite former-champion win','Close decision over an elite veteran.'],
        ['Thiago Silva',.65,'Ranked quality win','Controlled a dangerous ranked contender.'],
        ['Michael Bisping',.60,'Ranked quality win','Close win over a future champion.'],
        ['Chael Sonnen',.55,'Supporting elite-name win','Quick stoppage over a former title challenger.'],
        ['Stephan Bonnar',.35,'Supporting win','Useful early-career victory.']
      ]},
      apex:{score:4.50,window:'Chuck Liddell 2008 + Forrest Griffin 2008',performances:[
        ['Chuck Liddell','2008-09-06',9.2,'One-punch knockout of the former champion.'],
        ['Forrest Griffin','2008-12-27',9.0,'Comeback stoppage to win the title.']
      ],components:{twoPerformanceStrength:1.82,proof:1.10,bestFighterClaim:.90,aura:.68}},
      lossContext:{unrecoveredLoss:null,recoveredLosses:[
        {label:'Lyoto Machida',date:'2009-05-23',type:'prime elite title finish loss',method:'KO',recovery:'Rebuilt with four elite wins and another title shot.'},
        {label:'Jon Jones',date:'2012-04-21',type:'prime elite title decision loss',method:'Decision',recovery:'Returned with elite wins.'},
        {label:'Antonio Rogerio Nogueira',date:'2013-02-02',type:'prime non-elite decision loss',method:'Decision',recovery:'Beat Dan Henderson and Chael Sonnen afterward.'}
      ],upwardDivisionLosses:[],postPrimeLosses:[
        {label:'Ryan Bader',date:'2015-10-03',type:'post-prime elite decision loss',method:'Decision'},
        {label:'Glover Teixeira',date:'2016-04-16',type:'post-prime elite finish loss',method:'KO'},
        {label:'Daniel Kelly',date:'2017-03-04',type:'post-prime decision loss',method:'Decision'},
        {label:'Sam Alvey',date:'2017-08-05',type:'post-prime decision loss',method:'Decision'},
        {label:'Anthony Smith',date:'2018-06-09',type:'post-prime finish loss',method:'KO'}
      ],weirdResults:[{label:'Tito Ortiz draw',date:'2007-07-07',type:'pre-prime draw',penaltyExempt:true}]},
      tag:'Liddell-killing LHW champion',
      oneLiner:'A deep light-heavyweight ledger, signature Liddell knockout, and UFC title run with a clean post-prime cutoff.',
      whyRanked:'Rashad beat six elite or top-five-level opponents, won the title, and sustained contender relevance for roughly six years.',
      whyNot:'Only one title-fight win, limited finishing volume, and three counted prime losses keep him below the longer champions.',
      compare:{peak:'Knocking out Liddell and then stopping Forrest for the belt created a real two-fight apex.',counter:'Rashad’s title reign ended immediately and his late career collapsed after the prime cutoff.',edge:'Rashad wins comparisons through opponent depth and a stronger sustained elite window than his title count suggests.',scope:'Only UFC accomplishments are scored.'}
    }
  ];

  const DIRECT_FIGHTS=[
    ['Frank Shamrock','Tito Ortiz',1,'Frank Shamrock','major','Frank stopped Ortiz late in their 1999 title fight, the defining win of his unbeaten UFC run.'],
    ['Benson Henderson','Frankie Edgar',2,'Benson Henderson','major','Benson won both UFC title fights; both were competitive, with the rematch especially close.'],
    ['Benson Henderson','Anthony Pettis',1,'Anthony Pettis','major','Pettis submitted Benson to take the UFC lightweight title. Their WEC fight is outside the scored UFC ledger.'],
    ['Fabricio Werdum','Cain Velasquez',1,'Fabricio Werdum','major','Werdum submitted Velasquez to unify the UFC heavyweight title.'],
    ['Fabricio Werdum','Stipe Miocic',1,'Stipe Miocic','major','Stipe knocked out Werdum to win the heavyweight title.'],
    ['Glover Teixeira','Jon Jones',1,'Jon Jones','major','Jones beat Glover by decision in a UFC light-heavyweight title fight.'],
    ['Glover Teixeira','Rashad Evans',1,'Glover Teixeira','notable','Glover knocked out Rashad in 2016; the loss is post-prime for Rashad.'],
    ['Glover Teixeira','Jan Blachowicz',1,'Glover Teixeira','major','Glover submitted Jan to win the UFC light-heavyweight title.'],
    ['Glover Teixeira','Jiri Prochazka',1,'Jiri Prochazka','major','Jiri submitted Glover late in a classic title fight.'],
    ['Vitor Belfort','Anderson Silva',1,'Anderson Silva','major','Anderson knocked out Vitor with the front kick in their middleweight title fight.'],
    ['Vitor Belfort','Jon Jones',1,'Jon Jones','major','Jones survived Vitor’s armbar and submitted him in the light-heavyweight title fight.'],
    ['Vitor Belfort','Randy Couture',3,'Randy Couture','major','Randy won two of three UFC meetings; Vitor’s official title win came via an early cut stoppage.'],
    ['Mauricio Rua','Lyoto Machida',2,'Split','major','Machida won the first decision; Shogun knocked him out in the immediate title rematch.'],
    ['Mauricio Rua','Jon Jones',1,'Jon Jones','major','Jones stopped Shogun to win the light-heavyweight title.'],
    ['Mauricio Rua','Forrest Griffin',2,'Split','major','Forrest submitted Shogun in 2007; Shogun won the rematch by first-round knockout.'],
    ['Forrest Griffin','Rashad Evans',1,'Rashad Evans','major','Rashad stopped Forrest to win the UFC light-heavyweight title.'],
    ['Forrest Griffin','Anderson Silva',1,'Anderson Silva','major','Anderson produced a dominant first-round knockout of Forrest.'],
    ['Forrest Griffin','Tito Ortiz',3,'Forrest Griffin','notable','Forrest won the UFC trilogy 2-1.'],
    ['Rashad Evans','Jon Jones',1,'Jon Jones','major','Jones beat Rashad by decision in their title fight.'],
    ['Rashad Evans','Chuck Liddell',1,'Rashad Evans','major','Rashad knocked out Liddell with one of the division’s signature finishes.'],
    ['Rashad Evans','Quinton Jackson',1,'Rashad Evans','major','Rashad beat Rampage by decision in their grudge match.'],
    ['Rashad Evans','Lyoto Machida',1,'Lyoto Machida','major','Machida knocked out Rashad to win the title.']
  ];

  const UFC_FINISH_RATE={
    'Frank Shamrock':80.00,'Benson Henderson':18.18,'Fabricio Werdum':63.64,'Glover Teixeira':81.25,
    'Vitor Belfort':93.33,'Mauricio Rua':72.73,'Forrest Griffin':33.33,'Rashad Evans':42.86
  };

  function key(v){return String(v||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function rowsFor(name){return [...(DATA.men||[]),...(DATA.women||[]),...(DATA.fighters||[])].filter(row=>key(row?.fighter)===key(name));}
  function upsert(list,row){if(!Array.isArray(list))return null;const i=list.findIndex(item=>key(item?.fighter)===key(row.fighter));if(i<0){list.push(row);return row;}list[i]={...list[i],...row};return list[i];}
  function overrides(){return window.DISPLAY_OVERRIDES||(typeof DISPLAY_OVERRIDES!=='undefined'?DISPLAY_OVERRIDES:null);}
  function qualitySummary(f){return {fighter:f.name,rawCredit:f.quality.raw,diminishedCredit:f.quality.diminished,elitePlusWins:f.quality.elite,topFivePlusWins:f.quality.top5,rankedQualityWins:f.quality.ranked,bestWins:f.quality.best.slice(),winProfile:`${f.quality.elite} elite-level wins, ${f.quality.ranked} ranked-quality wins, UFC-only.`,qualityRows:f.quality.rows.map(row=>row.slice()),version:VERSION};}
  function titleLedger(f){return f.titles.wins.map(row=>({opponent:row[0],event:row[1],date:row[2],titleType:row[3],strength:row[4],adjustedCredit:row[4],reviewStatus:'locked',notes:row[5]}));}
  function eraLedger(f){return {status:'locked',window:{start:f.prime.start,startLabel:f.prime.startLabel,end:f.prime.end,endLabel:f.prime.endLabel,endType:f.prime.endType,endReason:f.prime.endReason,canonical:true,locked:true,lockVersion:VERSION},lossContext:f.lossContext,longevity:{gapCapMonths:18,...f.longevity,adjustmentNote:f.longevity.note,windowLockedPendingRecalculation:false,canonicalWindowRecalculated:true,canonicalWindowRecalculationVersion:VERSION,calculationAsOf:'2026-07-12'},notes:'UFC-only elite-prime window.',lossContextCompletion:{version:VERSION,batch:'eight-legends',machineReadable:true,completeUfcLossLedger:true,source:`${f.name} UFC-only audit`,completedAt:new Date().toISOString()}};}
  function primeEntry(f){const fights=f.prime.wins+f.prime.losses+f.prime.draws;const finishPressure=Math.min(4.5,Math.max(1.5,(f.prime.finishRate/100)*4.5));return {fighter:f.name,primeRecord:f.prime.record,primeWins:f.prime.wins,primeLosses:f.prime.losses,primeDraws:f.prime.draws,primeNCs:0,primeRecordPct:fights?Number(((f.prime.wins+.5*f.prime.draws)/fights*100).toFixed(2)):0,primeRecordScore:Number(Math.min(9,(f.prime.wins+.5*f.prime.draws)/Math.max(fights,1)*9).toFixed(2)),roundControlPct:f.prime.roundsWonPct,roundControlScore:Number(Math.min(7,f.prime.roundsWonPct/100*7).toFixed(2)),roundControlAudit:{fighter:f.name,roundsWonPct:f.prime.roundsWonPct,roundControlPct:f.prime.roundsWonPct,status:'locked',source:'Eight-legends UFC fight-window audit',window:`${f.prime.startLabel} → ${f.prime.endLabel}`,fights:[],notes:'Round-control percentage is the locked batch estimate from UFC scorecards and finish-round ownership.',version:VERSION},primeFights:fights,primeFinishes:f.prime.finishWins,primeFinishRate:f.prime.finishRate,finishPressureScore:Number(finishPressure.toFixed(2)),eliteStakesBreakdown:{titleFightWins:f.titles.wins.length,topFiveWins:f.quality.top5,champFormerChampWins:f.quality.elite,divisionStrengthContext:f.longevity.divisionMultiplier},eliteStakesRawScore:Number((f.scores.primeDominance-12).toFixed(2)),eliteStakesScore:Number((f.scores.primeDominance-12).toFixed(2)),total:f.scores.primeDominance,dominanceProfile:`${f.prime.record} UFC prime with ${f.prime.finishRate.toFixed(1)}% finish rate and ${f.prime.roundsWonPct.toFixed(1)}% estimated round control.`,status:'locked',primeWindow:{start:f.prime.start,startLabel:f.prime.startLabel,end:f.prime.end,endLabel:f.prime.endLabel,endReason:f.prime.endReason},canonicalWindowRebuild:true,version:VERSION};}
  function apexEntry(f){return {score:f.apex.score,window:f.apex.window,performances:f.apex.performances.map(p=>({label:p[0],date:p[1],rating:p[2],note:p[3]})),performanceAverage:Number((f.apex.performances.reduce((s,p)=>s+p[2],0)/f.apex.performances.length).toFixed(2)),components:f.apex.components,componentTotal:f.apex.score,notes:`Best two-win UFC peak for ${f.name}.`,source:'Eight-legends Apex Peak audit',version:VERSION};}
  function boardRow(f){return {fighter:f.name,totalScore:0,championship:f.scores.championship,opponentQuality:f.scores.opponentQuality,primeDominance:f.scores.primeDominance,longevity:f.scores.longevity,longevityThirtyPoint:true,apexPeak:f.scores.apexPeak,penalty:f.scores.penalty,eraDepthAdjustment:f.scores.eraDepthAdjustment,leaderboard:'men',gender:'Men',ufcRecord:f.record,primaryDivision:f.primary,secondaryDivision:f.secondary,finishRatePct:UFC_FINISH_RATE[f.name],primeFinishRatePct:f.prime.finishRate,activeEliteYears:f.longevity.activeEliteYears,timesFinishedPrime:f.prime.timesFinished,primeRecord:f.prime.record,roundsWonPct:f.prime.roundsWonPct,eliteWins:f.quality.elite,elitePlusWins:f.quality.elite,topFivePlusWins:f.quality.top5,rankedQualityWins:f.quality.ranked,notes:f.oneLiner};}
  function compareProfile(f){return {shortCase:f.oneLiner,peak:f.compare.peak,resume:`${f.record} UFC record with ${f.titles.wins.length} championship-level win${f.titles.wins.length===1?'':'s'} and ${f.quality.elite} elite-level wins.`,championship:`${f.titles.adjusted.toFixed(2)} adjusted title-win credits from ${f.titles.wins.length} championship win${f.titles.wins.length===1?'':'s'}.`,opponentQuality:qualitySummary(f).winProfile,longevity:`${f.longevity.activeEliteYears.toFixed(1)} active elite UFC years after gap caps and division context.`,counter:f.compare.counter,edge:f.compare.edge,scope:f.compare.scope,eliteCounter:true,signatureWins:f.quality.best.join(', '),weakness:f.whyNot,titleSummary:`${f.titles.wins.length} UFC championship-level win${f.titles.wins.length===1?'':'s'}; ${f.titles.adjusted.toFixed(2)} adjusted title credit.`,primeSummary:`${f.prime.record} from ${f.prime.startLabel} through ${f.prime.endLabel}.`,titleStyle:'ufcOnlyTitleResume',primeStyle:'auditedElitePrime',legacyStats:{ufcRecord:f.record,titleFightWins:f.titles.wins.length,adjustedTitleWins:f.titles.adjusted,activeEliteYearsLabel:`roughly ${f.longevity.activeEliteYears.toFixed(1)} active elite years`,primeNote:`${f.prime.startLabel} through ${f.prime.endLabel}`}};}
  function displayOverride(f){return {profileDisplayName:f.displayName,divisionLabel:f.divisionLabel,resumeTag:f.tag,oneLiner:f.oneLiner,snapshotStats:{ufcRecord:f.record,titleFightWins:f.titles.wins.length,adjustedTitleWins:f.titles.adjusted,eliteWins:f.quality.elite,elitePlusWins:f.quality.elite,topFivePlusWins:f.quality.top5,rankedQualityWins:f.quality.ranked,primeRecord:f.prime.record,finishRatePct:UFC_FINISH_RATE[f.name],roundsWonPct:f.prime.roundsWonPct,activeEliteYears:f.longevity.activeEliteYears,timesFinishedPrime:f.prime.timesFinished,apexPeak:f.apex.score,lossContext:f.scores.penalty,eraDepthAdjustment:f.scores.eraDepthAdjustment,bestQualityWins:f.quality.best.join(', ')},packetProfileStats:{ufcRecord:f.record,titleFightWins:f.titles.wins.length,adjustedTitleWins:f.titles.adjusted,eliteWins:f.quality.elite,elitePlusWins:f.quality.elite,topFivePlusWins:f.quality.top5,rankedQualityWins:f.quality.ranked,finishRatePct:UFC_FINISH_RATE[f.name],roundsWonPct:f.prime.roundsWonPct,activeEliteYears:f.longevity.activeEliteYears,timesFinishedPrime:f.prime.timesFinished},whyRankedHere:f.whyRanked,whyNotHigher:f.whyNot,keyJudgmentCalls:[['Prime window',`${f.prime.startLabel} through ${f.prime.endLabel}. ${f.prime.endReason}`],['Loss Context',`${f.scores.penalty.toFixed(2)} under the locked phase, opponent, finish, and post-prime rules.`],['Scope',f.compare.scope],['Photos','No photo paths are hardcoded; real WebP files can be added separately.']],compareProfile:compareProfile(f),apexPeakAudit:apexEntry(f),repoLocations:{scoreSource:'assets/data/canonical-fighter-registry-eight-legends.js',compareSource:'assets/data/canonical-fighter-registry-eight-legends.js'}};}
  function profileRow(f){const b=boardRow(f);return {id:f.id,...b,scope:'UFC',ufcWins:Number(f.record.match(/^(\d+)/)?.[1]||0),ufcLosses:Number(f.record.match(/^\d+-(\d+)/)?.[1]||0),ufcDraws:Number(f.record.match(/^\d+-\d+-(\d+)/)?.[1]||0),ufcNoContests:/NC/.test(f.record)?1:0,scoredUfcFights:f.prime.wins+f.prime.losses+f.prime.draws,finishWins:f.prime.finishWins,lossPenalty:f.scores.penalty,primeStart:`${f.prime.startLabel} (${f.prime.start.slice(0,4)})`,primeEnd:`${f.prime.endLabel} (${f.prime.end.slice(0,4)})`,primeRecordContext:`${f.prime.startLabel} → ${f.prime.endLabel}`,title:{normalTitleWins:f.titles.wins.filter(x=>x[3]==='normal').length,interimTitleWins:f.titles.wins.filter(x=>x[3]==='interim').length,tournamentWins:f.titles.wins.filter(x=>x[3]==='tournament').length,titleFightWins:f.titles.wins.length,adjustedTitleWins:f.titles.adjusted,championshipScore:f.scores.championship,notes:f.titles.wins.map(x=>`${x[0]} ${x[4].toFixed(2)}`).join('; ')},opponents:f.quality.rows.map((row,index)=>({opponent:row[0],division:f.primary,credit:row[1],type:row[2],context:row[3],displayPriority:index+1,opponentStrengthScore:100-index})),rounds:[],notes:`UFC-only scoring. ${f.compare.scope}`};}
  function upsertReport(report,row,sorter){if(!Array.isArray(report))return;const i=report.findIndex(x=>key(x?.fighter)===key(row.fighter));if(i<0)report.push(row);else report[i]=row;if(sorter)report.sort(sorter);}
  function stageResult(stage,baseResult,batchResult){return {applied:Boolean(baseResult?.applied)&&Boolean(batchResult?.applied),stage,version:`${BASE.version}+${VERSION}`,fighters:Array.from(new Set([...(BASE.fighters||[]),...NAMES])),base:baseResult,batch:batchResult,error:baseResult?.error||batchResult?.error||null};}

  const BATCH_API={
    version:VERSION,fighters:NAMES.slice(),
    registerBase(){DATA.men=DATA.men||[];DATA.fighters=DATA.fighters||[];DATA.primeRecords=DATA.primeRecords||{};const store=overrides();window.COMPARE_PROFILES=window.COMPARE_PROFILES||{};window.COMPARE_FIGHT_LEDGER=window.COMPARE_FIGHT_LEDGER||{};const eraStore=window.UFC_FIGHTER_ERA_LEDGERS;const titleStore=window.UFC_CHAMPIONSHIP_RESUME_LEDGERS;const qualityStore=window.UFC_OPPONENT_QUALITY_LEDGERS;FIGHTERS.forEach(f=>{upsert(DATA.men,boardRow(f));upsert(DATA.fighters,profileRow(f));DATA.primeRecords[f.name]={record:f.prime.record,context:`${f.prime.startLabel} → ${f.prime.endLabel}`,wins:f.prime.wins,losses:f.prime.losses,draws:f.prime.draws,ncs:0,source:'Eight-legends canonical UFC prime recount',sourceVersion:VERSION,eraWindowLocked:true,primeDominanceRebuildVersion:VERSION};if(store)store[f.name]={...(store[f.name]||{}),...displayOverride(f)};window.COMPARE_PROFILES[f.name]={...(window.COMPARE_PROFILES[f.name]||{}),...compareProfile(f)};if(eraStore?.ledgers)eraStore.ledgers[f.name]=eraLedger(f);if(titleStore?.ledgers)titleStore.ledgers[f.name]={fighter:f.name,championshipWins:titleLedger(f)};if(qualityStore?.raw)qualityStore.raw[f.name]=f.quality.rows.map(row=>row.slice());});DIRECT_FIGHTS.forEach(row=>{const pair=[row[0],row[1]].map(key).sort().join('|');window.COMPARE_FIGHT_LEDGER[pair]={fighters:[row[0],row[1]],fights:row[2],winner:row[3],importance:row[4],summary:row[5]};});if(eraStore){eraStore.fighters=Array.from(new Set([...(eraStore.fighters||[]),...NAMES]));}DATA.meta=DATA.meta||{};const current=DATA.meta.canonicalFighterRegistry||{};DATA.meta.canonicalFighterRegistry={...current,version:`${current.version||BASE.version}+${VERSION}`,fighters:Array.from(new Set([...(current.fighters||[]),...NAMES])),appliedAt:new Date().toISOString()};this.applyChampionship();return {applied:true,fighters:NAMES.slice(),menCount:DATA.men.length,profileCount:DATA.fighters.length,version:VERSION};},
    applyChampionship(){const shadow=window.UFC_CHAMPIONSHIP_RESUME_SHADOW;const live=window.UFC_CHAMPIONSHIP_RESUME_LIVE;FIGHTERS.forEach(f=>{const report={fighter:f.name,status:'direct-ledger',titleFightWins:f.titles.wins.length,adjustedTitleCredit:f.titles.adjusted,discountedWins:f.titles.wins.length,reviewStatus:'locked',formulaScore:f.scores.championship,wins:titleLedger(f),version:VERSION};rowsFor(f.name).forEach(row=>{row.championship=f.scores.championship;row.championshipResumeLive=true;row.championshipFormulaDriven=true;row.championshipResumeAudit=report;row.title={...(row.title||{}),titleFightWins:f.titles.wins.length,adjustedTitleWins:f.titles.adjusted,championshipScore:f.scores.championship,discountedWins:f.titles.wins.length,reviewStatus:'locked'};});if(shadow?.report)upsertReport(shadow.report,report,(a,b)=>Number(b.formulaScore||0)-Number(a.formulaScore||0));});if(shadow){shadow.ledgerFighterCount=Object.keys(window.UFC_CHAMPIONSHIP_RESUME_LEDGERS?.ledgers||{}).length;shadow.reviewRows=(shadow.report||[]).filter(row=>row.reviewStatus!=='locked');}if(live){live.fighters=shadow?.report?.length||live.fighters;live.approvedRegistryVersion=VERSION;}return {applied:true,fighters:NAMES.slice(),version:VERSION};},
    applyOpponentQuality(){const audit=window.UFC_OPPONENT_QUALITY_SHADOW_AUDIT;const live=window.UFC_OPPONENT_QUALITY_LIVE;const summaries=new Map(FIGHTERS.map(f=>[key(f.name),qualitySummary(f)]));FIGHTERS.forEach(f=>{const summary=summaries.get(key(f.name));const report={...summary,liveScore:f.scores.opponentQuality,categoryScore:f.scores.opponentQuality,benchmarkCredit:14.1,sourceMode:'canonical-registry-fixed-audit',version:VERSION};rowsFor(f.name).forEach(row=>{row.opponentQuality=f.scores.opponentQuality;row.opponentQualityLive=true;row.opponentQualityLiveAudit=report;row.opponentQualityShadowAudit=summary;row.eliteWins=f.quality.elite;row.elitePlusWins=f.quality.elite;row.topFivePlusWins=f.quality.top5;row.rankedQualityWins=f.quality.ranked;row.winProfile=summary.winProfile;});if(audit){audit.report=Array.isArray(audit.report)?audit.report:[];upsertReport(audit.report,summary,(a,b)=>Number(b.diminishedCredit||0)-Number(a.diminishedCredit||0));}if(live){live.report=Array.isArray(live.report)?live.report:[];upsertReport(live.report,report,(a,b)=>Number(b.liveScore||0)-Number(a.liveScore||0));}});if(audit&&!audit.__eightLegendsSummaryWrapped){const previous=audit.summaryFor;audit.summaryFor=fighter=>summaries.get(key(fighter))||(typeof previous==='function'?previous(fighter):null);audit.__eightLegendsSummaryWrapped=true;audit.fighters=audit.report?.length||audit.fighters;}if(live){live.fighters=live.report?.length||live.fighters;live.approvedRegistryVersion=VERSION;}return {applied:true,fighters:NAMES.slice(),version:VERSION};},
    applyPrimeDominance(){const ledgers=window.UFC_PRIME_DOMINANCE_LEDGERS;if(!ledgers?.report)return {applied:false,error:'Prime Dominance chain not ready'};const entries=new Map(FIGHTERS.map(f=>[key(f.name),primeEntry(f)]));FIGHTERS.forEach(f=>{const entry=entries.get(key(f.name));upsertReport(ledgers.report,entry,(a,b)=>Number(b.total||0)-Number(a.total||0));rowsFor(f.name).forEach(row=>{row.primeRecord=f.prime.record;row.primeDominance=f.scores.primeDominance;row.primeDominanceShadowAudit=entry;row.roundsWonPct=f.prime.roundsWonPct;row.primeFinishRatePct=f.prime.finishRate;});});if(!ledgers.__eightLegendsEntryWrapped){const previous=ledgers.entryFor;ledgers.entryFor=fighter=>entries.get(key(fighter))||(typeof previous==='function'?previous(fighter):null);ledgers.__eightLegendsEntryWrapped=true;}ledgers.leaders=ledgers.report.slice(0,15);ledgers.applied=Array.from(new Set([...(ledgers.applied||[]),...NAMES]));if(window.UFC_PRIME_DOMINANCE_SHADOW_MODEL)window.UFC_PRIME_DOMINANCE_SHADOW_MODEL.report=ledgers.report;return {applied:true,fighters:NAMES.slice(),version:VERSION};},
    applyApexPeak(){FIGHTERS.forEach(f=>{const apex=apexEntry(f);rowsFor(f.name).forEach(row=>{row.apexPeak=f.apex.score;row.apexPeakAudit=apex;row.apexPeakBonusLive=true;row.apexPeakBonusVersion=VERSION;});const o=overrides()?.[f.name];if(o){o.apexPeakAudit=apex;o.snapshotStats={...(o.snapshotStats||{}),apexPeak:f.apex.score,apexPeakAudit:apex};}const component=window.UFC_APEX_PEAK_COMPONENT_AUDIT;if(component){component.componentOverrides=component.componentOverrides||{};component.componentOverrides[f.name]=apex;component.patched=Array.from(new Set([...(component.patched||[]),f.name]));}const locked=window.UFC_APEX_PEAK_LOCKED_AUDIT;if(locked)locked.fighters=Array.from(new Set([...(locked.fighters||[]),f.name]));});return {applied:true,fighters:NAMES.slice(),version:VERSION};},
    finalize(){FIGHTERS.forEach(f=>{rowsFor(f.name).forEach(row=>{row.eraDepthAdjustment=f.scores.eraDepthAdjustment;row.penalty=f.scores.penalty;row.lossPenalty=f.scores.penalty;row.longevityThirtyPoint=true;});const o=overrides()?.[f.name];if(o)o.packetStatus={stage:'canonical live fighter',lastUpdated:'2026-07-12',nextFix:'Add real WebP photo assets and signature-fight URLs when supplied.'};});return {applied:true,fighters:NAMES.map(name=>{const row=DATA.men.find(x=>key(x.fighter)===key(name));return {fighter:name,rank:row?.rank,totalScore:row?.totalScore,overallOvr:row?.overallOvr};}),version:VERSION};}
  };

  const COMBINED={...BASE,version:`${BASE.version}+${VERSION}`,fighters:Array.from(new Set([...(BASE.fighters||[]),...NAMES])),registerBase(){return stageResult('registerBase',BASE.registerBase(),BATCH_API.registerBase());},applyChampionship(){return stageResult('applyChampionship',BASE.applyChampionship(),BATCH_API.applyChampionship());},applyOpponentQuality(){return stageResult('applyOpponentQuality',BASE.applyOpponentQuality(),BATCH_API.applyOpponentQuality());},applyPrimeDominance(){return stageResult('applyPrimeDominance',BASE.applyPrimeDominance(),BATCH_API.applyPrimeDominance());},applyApexPeak(){return stageResult('applyApexPeak',BASE.applyApexPeak(),BATCH_API.applyApexPeak());},finalize(){return stageResult('finalize',BASE.finalize(),BATCH_API.finalize());}};

  window.UFC_EIGHT_LEGENDS_REGISTRY=BATCH_API;
  window.UFC_CANONICAL_FIGHTER_REGISTRY=COMBINED;
  document.documentElement.setAttribute('data-eight-legends-registry-ready',VERSION);
})();
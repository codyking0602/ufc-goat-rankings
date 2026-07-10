// Opponent Quality shadow ledger batch eight: Chuck Liddell and Tito Ortiz.
// UFC wins only. PRIDE, Bellator, Golden Boy, and other non-UFC results are excluded.
(function(){
  const VERSION='opponent-quality-ledger-batch-eight-20260710a-chuck-tito';
  const store=window.UFC_OPPONENT_QUALITY_LEDGERS;
  if(!store||!store.raw)return;
  const RAW=store.raw;

  Object.assign(RAW,{
    'Chuck Liddell':[
      ['Randy Couture II',1.25,'Champion-level win','Won the UFC light heavyweight title from an elite champion and defining rival.','locked'],
      ['Randy Couture III',1.25,'Champion-level win','Immediate trilogy win over an elite former champion and title challenger.','locked'],
      ['Tito Ortiz I',1.00,'True top-5 win','Former long-reigning UFC champion and elite light heavyweight contender.','locked'],
      ['Tito Ortiz II',1.00,'True top-5 win','Repeat title-defense win over an elite rival; repeat and timing context keep it below max.','review'],
      ['Vitor Belfort',1.00,'True top-5 win','Elite UFC light heavyweight contender and former tournament champion.','review'],
      ['Renato Sobral II',0.85,'Strong top-10 win','Ranked title challenger; strong defense with early-era depth context.','locked'],
      ['Jeremy Horn II',0.85,'Strong top-10 win','Experienced title challenger on a major unbeaten run; revenge context noted.','review'],
      ['Wanderlei Silva',0.85,'Strong top-10 win','Major elite name and dangerous UFC opponent, with post-peak timing context.','review'],
      ['Kevin Randleman',0.85,'Strong top-10 win','Former UFC heavyweight champion and dangerous elite athlete.','review'],
      ['Renato Sobral I',0.85,'Strong top-10 win','Strong contender win before the title reign.','locked'],
      ['Murilo Bustamante',0.85,'Strong top-10 win','High-level contender and future UFC champion, with earlier-career timing context.','review'],
      ['Amar Suloev',0.65,'Ranked / quality win','Quality UFC contender win during Chuck’s climb.','locked'],
      ['Jeff Monson',0.45,'Solid resume win','Solid UFC heavyweight win before Monson’s later contender run.','review'],
      ['Vernon White',0.45,'Solid resume win','Useful UFC light heavyweight win before Chuck’s title run.','locked'],
      ['Paul Jones',0.25,'Name-value / faded / unproven','Early UFC win with limited opponent-quality value.','locked'],
      ['Noe Hernandez',0.10,'Minimal UFC quality credit','UFC debut win with minimal opponent-quality value.','locked']
    ],
    'Tito Ortiz':[
      ['Vitor Belfort',1.00,'True top-5 win','Elite UFC light heavyweight name and dangerous contender; close decision context noted.','high-risk review'],
      ['Wanderlei Silva',0.85,'Strong top-10 win','Major early UFC title win over a dangerous opponent before his later non-UFC peak.','review'],
      ['Forrest Griffin I',0.85,'Strong top-10 win','Strong contender win that aged well; close decision context noted.','high-risk review'],
      ['Evan Tanner',0.85,'Strong top-10 win','Meaningful title defense over a high-level opponent and future UFC champion.','review'],
      ['Vladimir Matyushenko',0.85,'Strong top-10 win','Solid ranked title challenger and credible early-era contender.','locked'],
      ['Ryan Bader',0.85,'Strong top-10 win','Late-career upset over a strong ranked contender; does not restart Tito’s prime.','locked'],
      ['Ken Shamrock I',0.65,'Ranked / quality win','Major-name title defense, heavily capped for age and timing.','review'],
      ['Patrick Cote',0.45,'Solid resume win','Useful UFC light heavyweight win.','locked'],
      ['Yuki Kondo',0.45,'Solid resume win','Title defense with substantial early-era opponent-strength discount.','review'],
      ['Guy Mezger II',0.45,'Solid resume win','Early UFC rivalry win; only the UFC result is scored.','locked'],
      ['Jerry Bohlander',0.25,'Name-value / faded / unproven','Supporting early UFC win with limited quality value.','locked'],
      ['Ken Shamrock II',0.25,'Name-value / faded / unproven','Repeat rivalry win with a heavy age and timing discount.','review'],
      ['Ken Shamrock III',0.25,'Name-value / faded / unproven','Third rivalry bout; repeat and timing context cap the credit.','review'],
      ['Elvis Sinosic',0.25,'Name-value / faded / unproven','Weak title-defense opponent with limited quality value.','locked'],
      ['Wes Albritton',0.10,'Minimal UFC quality credit','Early UFC tournament win with minimal opponent-quality value.','locked']
    ]
  });

  store.version=VERSION;
  store.mode='shadow-ledger-batch-eight';
  store.batchEightFighters=['Chuck Liddell','Tito Ortiz'];
  document.documentElement.setAttribute('data-opponent-quality-ledger-batch-eight',VERSION);
})();

// Opponent Quality shadow ledger batch eight: Chuck Liddell and Tito Ortiz.
// UFC wins only. PRIDE, Bellator, Golden Boy, and other non-UFC results are excluded.
(function(){
  const VERSION='opponent-quality-ledger-batch-eight-20260710b-reviewed';
  const store=window.UFC_OPPONENT_QUALITY_LEDGERS;
  if(!store||!store.raw)return;
  const RAW=store.raw;

  Object.assign(RAW,{
    'Chuck Liddell':[
      ['Randy Couture II',1.25,'Champion-level win','Won the UFC light heavyweight title from an elite champion and defining rival.','locked'],
      ['Randy Couture III',1.25,'Champion-level win','Immediate trilogy win over an elite former champion and title challenger.','locked'],
      ['Tito Ortiz I',1.00,'True top-5 win','Former long-reigning UFC champion and elite light heavyweight contender.','locked'],
      ['Tito Ortiz II',1.00,'True top-5 win','Repeat title-defense win over an elite rival; repeat and timing context keep it below max.','review'],
      ['Vitor Belfort',0.85,'Strong top-10 win','Dangerous elite UFC name, but not a clean champion-level or true top-five win in this timing context.','review'],
      ['Renato Sobral II',0.85,'Strong top-10 win','Ranked title challenger; strong defense with early-era depth context.','locked'],
      ['Jeremy Horn II',0.65,'Ranked / quality win','Experienced title challenger on a major unbeaten run; revenge and era context cap the credit.','review'],
      ['Wanderlei Silva',0.65,'Ranked / quality win','Major elite name, but the UFC win came after his clearest non-UFC peak.','review'],
      ['Kevin Randleman',0.65,'Ranked / quality win','Former UFC heavyweight champion and dangerous athlete, with timing and division context.','review'],
      ['Renato Sobral I',0.65,'Ranked / quality win','Meaningful contender win before the title reign, below the later title-defense version.','locked'],
      ['Murilo Bustamante',0.65,'Ranked / quality win','High-level future UFC champion, but earlier-career timing caps the credit.','review'],
      ['Jeff Monson',0.45,'Solid resume win','Solid UFC heavyweight win before Monson’s later contender run.','review'],
      ['Amar Suloev',0.25,'Name-value / faded / unproven','Useful early win, but limited proven UFC contender value.','locked'],
      ['Vernon White',0.25,'Name-value / faded / unproven','Supporting UFC light heavyweight win with limited ranked value.','locked'],
      ['Paul Jones',0.10,'Minimal UFC quality credit','Early UFC win with minimal opponent-quality value.','locked'],
      ['Noe Hernandez',0.10,'Minimal UFC quality credit','UFC debut win with minimal opponent-quality value.','locked']
    ],
    'Tito Ortiz':[
      ['Vitor Belfort',0.90,'Strong top-10 win','Elite UFC light heavyweight name and dangerous opponent; close decision context keeps it below true top-five credit.','high-risk review'],
      ['Wanderlei Silva',0.85,'Strong top-10 win','Major early UFC title win over a dangerous opponent before his later non-UFC peak.','review'],
      ['Forrest Griffin I',0.80,'Strong top-10 win','Strong UFC win that aged well; close decision context trims the credit.','high-risk review'],
      ['Ken Shamrock I',0.75,'Strong top-10 win','Major-name UFC title defense, meaningfully discounted for age and timing.','review'],
      ['Evan Tanner',0.70,'Ranked / quality win','Meaningful title defense over a high-level opponent and future UFC champion, with early-era timing context.','review'],
      ['Vladimir Matyushenko',0.65,'Ranked / quality win','Solid ranked title challenger and credible early-era contender.','locked'],
      ['Ryan Bader',0.65,'Ranked / quality win','Late-career upset over a strong contender; valuable but does not restart Tito’s prime.','locked'],
      ['Patrick Cote',0.45,'Solid resume win','Useful supporting UFC light heavyweight win.','locked'],
      ['Yuki Kondo',0.40,'Solid resume win','Title defense with substantial early-era opponent-strength discount.','review'],
      ['Guy Mezger II',0.40,'Solid resume win','Early UFC rivalry win; only the UFC result is scored.','locked'],
      ['Ken Shamrock II',0.30,'Name-value / faded / unproven','Repeat rivalry win with a heavy age and timing discount.','review'],
      ['Ken Shamrock III',0.25,'Name-value / faded / unproven','Third rivalry bout; repeat and timing context cap the credit.','review'],
      ['Jerry Bohlander',0.25,'Name-value / faded / unproven','Supporting early UFC win with limited quality value.','locked'],
      ['Elvis Sinosic',0.25,'Name-value / faded / unproven','Weak title-defense opponent with limited quality value.','locked'],
      ['Wes Albritton',0.10,'Minimal UFC quality credit','Early UFC tournament win with minimal opponent-quality value.','locked']
    ]
  });

  store.version=VERSION;
  store.mode='shadow-ledger-batch-eight-reviewed';
  store.batchEightFighters=['Chuck Liddell','Tito Ortiz'];
  document.documentElement.setAttribute('data-opponent-quality-ledger-batch-eight',VERSION);
})();
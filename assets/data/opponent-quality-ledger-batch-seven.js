// Opponent Quality shadow ledger batch seven. Final current fighter batch; shadow-only.
(function(){
  const VERSION='opponent-quality-ledger-batch-seven-20260708a';
  const store=window.UFC_OPPONENT_QUALITY_LEDGERS;
  if(!store||!store.raw)return;
  const RAW=store.raw;
  Object.assign(RAW,{
    'Robbie Lawler':[
      ['Rory MacDonald II',1.25,'Champion-level win','Elite welterweight title challenger in an all-time title fight.','locked'],
      ['Johny Hendricks II',1.25,'Champion-level win','Elite welterweight champion-level opponent.','locked'],
      ['Carlos Condit',1.00,'True top-5 win','Elite welterweight title challenger; close decision context.','high-risk review'],
      ['Matt Brown',1.00,'True top-5 win','Prime top welterweight contender.','locked'],
      ['Rory MacDonald I',0.85,'Strong top-10 win','Young elite welterweight contender.','review'],
      ['Jake Ellenberger',0.85,'Strong top-10 win','Strong ranked welterweight contender.','locked'],
      ['Josh Koscheck',0.65,'Ranked / quality win','Former top contender, later-career timing.','review'],
      ['Donald Cerrone',0.65,'Ranked / quality win','Big-name ranked veteran with timing context.','review'],
      ['Nick Diaz',0.65,'Ranked / quality win','Early UFC rivalry win over future elite name.','review'],
      ['Bobby Voelker',0.45,'Solid resume win','Solid UFC welterweight win.','locked'],
      ['Tiki Ghosn',0.25,'Name-value / faded / unproven','Low-end UFC quality value.','locked']
    ],
    'Amanda Nunes':[
      ['Cris Cyborg',1.25,'Champion-level win','Elite UFC featherweight champion and all-time great.','locked'],
      ['Ronda Rousey',1.25,'Champion-level win','Former dominant UFC bantamweight champion.','locked'],
      ['Miesha Tate',1.25,'Champion-level win','UFC bantamweight champion.','locked'],
      ['Valentina Shevchenko II',1.25,'Champion-level win','Elite champion-level opponent and future flyweight great.','locked'],
      ['Holly Holm',1.15,'Elite divisional win','Former UFC bantamweight champion, slightly timing-adjusted.','review'],
      ['Julianna Pena II',1.00,'True top-5 win','Current champion rematch win.','locked'],
      ['Valentina Shevchenko I',1.00,'True top-5 win','Elite future champion, earlier UFC version.','review'],
      ['Germaine de Randamie II',0.85,'Strong top-10 win','Strong ranked bantamweight contender.','locked'],
      ['Raquel Pennington',0.85,'Strong top-10 win','Ranked bantamweight title challenger.','locked'],
      ['Sara McMann',0.85,'Strong top-10 win','Olympic medalist and ranked contender.','locked'],
      ['Felicia Spencer',0.65,'Ranked / quality win','Ranked featherweight challenger.','review'],
      ['Megan Anderson',0.65,'Ranked / quality win','Featherweight challenger in thin division context.','review'],
      ['Germaine de Randamie I',0.65,'Ranked / quality win','Early UFC win over future elite contender.','review'],
      ['Tonya Evinger',0.45,'Solid resume win','Veteran name in featherweight-title context.','review'],
      ['Shayna Baszler',0.45,'Solid resume win','Name-value UFC win.','locked']
    ],
    'Valentina Shevchenko':[
      ['Alexa Grasso III',1.25,'Champion-level win','Elite UFC flyweight champion rematch/trilogy win.','review'],
      ['Joanna Jedrzejczyk',1.25,'Champion-level win','Elite UFC strawweight champion moving up.','locked'],
      ['Jessica Andrade',1.15,'Elite divisional win','Former UFC strawweight champion and elite contender moving up.','locked'],
      ['Holly Holm',1.00,'True top-5 win','Former UFC bantamweight champion.','review'],
      ['Katlyn Chookagian',1.00,'True top-5 win','Top flyweight title challenger.','locked'],
      ['Taila Santos',1.00,'True top-5 win','Elite flyweight title challenger; close fight context.','high-risk review'],
      ['Jennifer Maia',0.85,'Strong top-10 win','Ranked flyweight title challenger.','locked'],
      ['Lauren Murphy',0.85,'Strong top-10 win','Ranked flyweight title challenger.','locked'],
      ['Liz Carmouche II',0.85,'Strong top-10 win','Ranked flyweight title challenger and rivalry context.','review'],
      ['Julianna Pena',0.65,'Ranked / quality win','Future UFC champion, earlier bantamweight version.','review'],
      ['Sarah Kaufman',0.65,'Ranked / quality win','Former champion name in UFC debut context.','review'],
      ['Alexis Davis',0.65,'Ranked / quality win','Ranked women’s bantamweight veteran.','review'],
      ['Priscila Cachoeira',0.45,'Solid resume win','Solid UFC flyweight win.','locked']
    ],
    'Zhang Weili':[
      ['Rose Namajunas II',1.25,'Champion-level win','Elite UFC strawweight champion-level opponent.','locked'],
      ['Joanna Jedrzejczyk I',1.25,'Champion-level win','Elite former strawweight champion in all-time title fight.','locked'],
      ['Joanna Jedrzejczyk II',1.15,'Elite divisional win','Repeat win over elite former champion, timing-adjusted.','review'],
      ['Jessica Andrade',1.25,'Champion-level win','UFC strawweight champion.','locked'],
      ['Yan Xiaonan',1.00,'True top-5 win','Top strawweight title challenger.','locked'],
      ['Amanda Lemos',1.00,'True top-5 win','Ranked strawweight title challenger.','locked'],
      ['Carla Esparza',0.85,'Strong top-10 win','Former UFC strawweight champion.','review'],
      ['Tecia Torres',0.85,'Strong top-10 win','Strong ranked strawweight contender.','locked'],
      ['Jessica Aguilar',0.45,'Solid resume win','Veteran strawweight name, timing-adjusted.','review'],
      ['Danielle Taylor',0.25,'Name-value / faded / unproven','Low-end UFC quality value.','locked']
    ],
    'Rose Namajunas':[
      ['Joanna Jedrzejczyk I',1.25,'Champion-level win','Elite UFC strawweight champion.','locked'],
      ['Joanna Jedrzejczyk II',1.25,'Champion-level win','Immediate repeat over elite champion-level opponent.','locked'],
      ['Zhang Weili I',1.25,'Champion-level win','Elite UFC strawweight champion.','locked'],
      ['Zhang Weili II',1.00,'True top-5 win','Elite champion-level rematch win, close-fight context.','review'],
      ['Jessica Andrade II',1.00,'True top-5 win','Former UFC strawweight champion rematch win.','locked'],
      ['Paige VanZant',0.85,'Strong top-10 win','Ranked strawweight contender at the time.','review'],
      ['Michelle Waterson',0.65,'Ranked / quality win','Quality strawweight contender.','locked'],
      ['Tecia Torres II',0.65,'Ranked / quality win','Quality strawweight contender.','locked'],
      ['Angela Hill',0.45,'Solid resume win','Solid UFC strawweight win.','locked'],
      ['Amanda Ribas',0.45,'Solid resume win','Solid flyweight/strawweight name, timing context.','review']
    ],
    'Miesha Tate':[
      ['Holly Holm',1.25,'Champion-level win','UFC bantamweight champion.','locked'],
      ['Sara McMann',1.00,'True top-5 win','Olympic medalist and top bantamweight contender.','locked'],
      ['Jessica Eye',0.85,'Strong top-10 win','Ranked bantamweight contender.','locked'],
      ['Liz Carmouche',0.65,'Ranked / quality win','Quality bantamweight contender.','review'],
      ['Marion Reneau',0.65,'Ranked / quality win','Quality veteran bantamweight win.','review'],
      ['Rin Nakai',0.45,'Solid resume win','Solid UFC bantamweight win.','locked'],
      ['Julia Avila',0.45,'Solid resume win','Solid late-career UFC win.','locked']
    ],
    'Mackenzie Dern':[
      ['Virna Jandiroba',1.00,'True top-5 win','Vacant-title opponent and elite strawweight contender in app timeline.','review'],
      ['Angela Hill',0.85,'Strong top-10 win','Strong veteran strawweight contender.','locked'],
      ['Loopy Godinez',0.65,'Ranked / quality win','Quality ranked strawweight win.','review'],
      ['Tecia Torres',0.65,'Ranked / quality win','Quality strawweight contender.','locked'],
      ['Nina Nunes',0.65,'Ranked / quality win','Quality strawweight/bantamweight name.','review'],
      ['Randa Markos',0.65,'Ranked / quality win','Quality strawweight veteran.','locked'],
      ['Hannah Cifers',0.45,'Solid resume win','Solid UFC strawweight win.','locked'],
      ['Amanda Cooper',0.45,'Solid resume win','Solid UFC win.','locked'],
      ['Ashley Yoder',0.45,'Solid resume win','Solid UFC win.','locked']
    ],
    'Kayla Harrison':[
      ['Holly Holm',0.85,'Strong top-10 win','Former UFC champion name, late-career timing.','review'],
      ['Ketlen Vieira',0.85,'Strong top-10 win','Strong ranked bantamweight contender.','review'],
      ['Julia Avila',0.45,'Solid resume win','Solid UFC bantamweight win.','review']
    ],
    'Jessica Andrade':[
      ['Rose Namajunas I',1.25,'Champion-level win','UFC strawweight champion and elite title opponent.','locked'],
      ['Claudia Gadelha',1.00,'True top-5 win','Elite strawweight contender.','locked'],
      ['Amanda Lemos',1.00,'True top-5 win','Elite strawweight contender.','locked'],
      ['Karolina Kowalkiewicz',0.85,'Strong top-10 win','Former strawweight title challenger.','locked'],
      ['Mackenzie Dern',0.85,'Strong top-10 win','Strong ranked strawweight contender.','locked'],
      ['Marina Rodriguez',0.85,'Strong top-10 win','Strong ranked strawweight contender.','locked'],
      ['Katlyn Chookagian',0.85,'Strong top-10 win','Ranked flyweight contender.','review'],
      ['Lauren Murphy',0.65,'Ranked / quality win','Ranked flyweight veteran.','review'],
      ['Tecia Torres',0.65,'Ranked / quality win','Quality strawweight contender.','locked'],
      ['Angela Hill',0.65,'Ranked / quality win','Quality strawweight veteran.','locked'],
      ['Jessica Penne',0.45,'Solid resume win','Former title challenger, timing-adjusted.','review'],
      ['Claudia Gadelha II',0.45,'Solid resume win','Repeat rivalry/context row; low separate credit.','review']
    ],
    'Alexa Grasso':[
      ['Valentina Shevchenko I',1.25,'Champion-level win','Elite UFC flyweight champion.','locked'],
      ['Maycee Barber',0.85,'Strong top-10 win','Strong ranked flyweight contender.','locked'],
      ['Viviane Araujo',0.85,'Strong top-10 win','Ranked flyweight contender.','locked'],
      ['Joanne Wood',0.65,'Ranked / quality win','Ranked flyweight/strawweight veteran.','review'],
      ['Karolina Kowalkiewicz',0.65,'Ranked / quality win','Former title challenger, later-career timing.','review'],
      ['Randa Markos',0.45,'Solid resume win','Solid strawweight veteran.','locked'],
      ['Ji Yeon Kim',0.45,'Solid resume win','Solid UFC win.','locked'],
      ['Mizuki Inoue',0.45,'Solid resume win','Solid UFC win.','locked']
    ],
    'Julianna Pena':[
      ['Amanda Nunes I',1.25,'Champion-level win','Elite UFC two-division champion and all-time great.','locked'],
      ['Cat Zingano',0.85,'Strong top-10 win','Former title challenger and strong bantamweight contender.','locked'],
      ['Sara McMann',0.65,'Ranked / quality win','Olympic medalist and ranked bantamweight veteran.','locked'],
      ['Jessica Eye',0.65,'Ranked / quality win','Quality bantamweight/flyweight contender.','review'],
      ['Milana Dudieva',0.45,'Solid resume win','Solid UFC win.','locked'],
      ['Jessica Rakoczy',0.25,'Name-value / faded / unproven','Low-end UFC quality value.','locked']
    ],
    'Carla Esparza':[
      ['Rose Namajunas II',1.25,'Champion-level win','Elite UFC strawweight champion.','locked'],
      ['Rose Namajunas I',1.00,'True top-5 win','Future champion in inaugural title context.','review'],
      ['Yan Xiaonan',0.85,'Strong top-10 win','Strong ranked strawweight contender.','locked'],
      ['Michelle Waterson',0.85,'Strong top-10 win','Strong ranked strawweight contender.','locked'],
      ['Virna Jandiroba',0.65,'Ranked / quality win','Quality strawweight contender.','locked'],
      ['Alexa Grasso',0.65,'Ranked / quality win','Early win over future champion.','review'],
      ['Tecia Torres',0.65,'Ranked / quality win','Quality strawweight contender.','locked'],
      ['Angela Hill',0.65,'Ranked / quality win','Quality strawweight veteran.','locked'],
      ['Felice Herrig',0.45,'Solid resume win','Solid strawweight veteran.','locked']
    ],
    'Holly Holm':[
      ['Ronda Rousey',1.25,'Champion-level win','Dominant UFC bantamweight champion and all-time star.','locked'],
      ['Raquel Pennington II',0.85,'Strong top-10 win','Strong ranked bantamweight contender.','review'],
      ['Irene Aldana',0.85,'Strong top-10 win','Strong ranked bantamweight contender.','locked'],
      ['Bethe Correia',0.65,'Ranked / quality win','Former title challenger, timing-adjusted.','review'],
      ['Megan Anderson',0.65,'Ranked / quality win','Ranked featherweight win in thin division.','review'],
      ['Yana Kunitskaya',0.65,'Ranked / quality win','Ranked bantamweight contender.','locked'],
      ['Marion Reneau',0.45,'Solid resume win','Solid bantamweight veteran.','locked'],
      ['Raquel Pennington I',0.45,'Solid resume win','Early UFC win over future contender.','review'],
      ['Iasmin Lucindo',0.45,'Solid resume win','Solid late-career UFC win in app timeline.','review']
    ],
    'Joanna Jedrzejczyk':[
      ['Carla Esparza',1.25,'Champion-level win','UFC strawweight champion.','locked'],
      ['Claudia Gadelha II',1.25,'Champion-level win','Elite strawweight title challenger and defining rival.','locked'],
      ['Jessica Andrade',1.00,'True top-5 win','Elite strawweight title challenger and future champion.','locked'],
      ['Claudia Gadelha I',1.00,'True top-5 win','Elite strawweight contender, close first fight context.','review'],
      ['Karolina Kowalkiewicz',0.85,'Strong top-10 win','Strong strawweight title challenger.','locked'],
      ['Tecia Torres',0.85,'Strong top-10 win','Strong ranked strawweight contender.','locked'],
      ['Michelle Waterson',0.85,'Strong top-10 win','Ranked strawweight contender.','locked'],
      ['Jessica Penne',0.65,'Ranked / quality win','Ranked title challenger in early strawweight era.','review'],
      ['Valerie Letourneau',0.65,'Ranked / quality win','Ranked title challenger.','review']
    ],
    'Ronda Rousey':[
      ['Miesha Tate II',1.00,'True top-5 win','Elite bantamweight rival and future UFC champion.','locked'],
      ['Sara McMann',1.00,'True top-5 win','Olympic medalist and top bantamweight title challenger.','locked'],
      ['Cat Zingano',0.85,'Strong top-10 win','Undefeated top bantamweight contender.','locked'],
      ['Alexis Davis',0.85,'Strong top-10 win','Ranked bantamweight title challenger.','locked'],
      ['Liz Carmouche',0.85,'Strong top-10 win','Ranked inaugural UFC bantamweight title challenger.','review'],
      ['Bethe Correia',0.65,'Ranked / quality win','Undefeated title challenger, softer contender context.','review']
    ]
  });
  store.version=VERSION;
  store.mode='shadow-ledger-batch-seven-final';
  store.batchSevenFighters=['Robbie Lawler','Amanda Nunes','Valentina Shevchenko','Zhang Weili','Rose Namajunas','Miesha Tate','Mackenzie Dern','Kayla Harrison','Jessica Andrade','Alexa Grasso','Julianna Pena','Carla Esparza','Holly Holm','Joanna Jedrzejczyk','Ronda Rousey'];
  document.documentElement.setAttribute('data-opponent-quality-ledger-batch-seven',VERSION);
})();
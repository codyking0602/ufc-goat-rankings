// Opponent Quality shadow ledger batch six. Extends the shadow ledger only.
(function(){
  const VERSION='opponent-quality-ledger-batch-six-20260710b-dricus-omalley';
  const store=window.UFC_OPPONENT_QUALITY_LEDGERS;
  if(!store||!store.raw)return;
  const RAW=store.raw;
  Object.assign(RAW,{
    'Dricus du Plessis':[
      ['Israel Adesanya',1.25,'Champion-level win','Elite UFC middleweight champion-level opponent.','locked'],
      ['Sean Strickland I',1.25,'Champion-level win','Beat the reigning UFC middleweight champion to win the title.','locked'],
      ['Robert Whittaker',1.00,'True top-5 win','Elite former champion and prime contender; Cody-approved at true top-five credit rather than max champion-level credit.','locked'],
      ['Sean Strickland II',1.00,'True top-5 win','Clear title-defense rematch win over an elite former champion, with repeat-opponent context.','locked'],
      ['Derek Brunson',0.85,'Strong top-10 win','Strong ranked middleweight contender.','locked'],
      ['Darren Till',0.65,'Ranked / quality win','Ranked middleweight name with timing context.','review'],
      ['Brad Tavares',0.65,'Ranked / quality win','Quality middleweight veteran.','locked'],
      ['Trevin Giles',0.45,'Solid resume win','Solid UFC middleweight win.','locked'],
      ['Markus Perez',0.25,'Name-value / faded / unproven','Low-end UFC quality value.','locked']
    ],
    'Tyron Woodley':[
      ['Robbie Lawler',1.25,'Champion-level win','UFC welterweight champion and elite title opponent.','locked'],
      ['Stephen Thompson II',1.00,'True top-5 win','Elite welterweight title challenger.','locked'],
      ['Darren Till',1.00,'True top-5 win','Undefeated top welterweight title challenger.','locked'],
      ['Carlos Condit',1.00,'True top-5 win','Elite welterweight contender, injury finish context noted.','review'],
      ['Demian Maia',0.85,'Strong top-10 win','Elite grappler and ranked welterweight contender.','locked'],
      ['Kelvin Gastelum',0.85,'Strong top-10 win','Strong welterweight contender.','review'],
      ['Dong Hyun Kim',0.65,'Ranked / quality win','Quality ranked welterweight win.','locked'],
      ['Josh Koscheck',0.65,'Ranked / quality win','Former top contender, later-career timing.','review'],
      ['Jay Hieron',0.45,'Solid resume win','Solid UFC welterweight win.','locked']
    ],
    'Ilia Topuria':[
      ['Alexander Volkanovski',1.25,'Champion-level win','Elite featherweight champion and all-time great.','locked'],
      ['Max Holloway',1.25,'Champion-level win','Elite champion-level featherweight great.','locked'],
      ['Josh Emmett',1.00,'True top-5 win','Durable top featherweight contender.','locked'],
      ['Bryce Mitchell',0.85,'Strong top-10 win','Ranked undefeated grappling contender.','locked'],
      ['Ryan Hall',0.45,'Solid resume win','Specialist name with limited contender value.','review'],
      ['Jai Herbert',0.45,'Solid resume win','Solid UFC win at lightweight.','locked'],
      ['Youssef Zalal',0.45,'Solid resume win','Solid early UFC win.','locked'],
      ['Damon Jackson',0.25,'Name-value / faded / unproven','Low-end UFC quality value.','locked']
    ],
    'Brock Lesnar':[
      ['Randy Couture',1.25,'Champion-level win','UFC heavyweight champion and all-time name, age context noted.','review'],
      ['Frank Mir II',1.00,'True top-5 win','Former UFC champion/interim champion rival.','locked'],
      ['Shane Carwin',1.00,'True top-5 win','Undefeated interim champion and elite heavyweight contender.','locked'],
      ['Heath Herring',0.65,'Ranked / quality win','Quality heavyweight veteran.','review'],
      ['Min-Soo Kim',0.10,'Minimal UFC quality credit','Minimal UFC quality value.','locked']
    ],
    'Junior dos Santos':[
      ['Cain Velasquez I',1.25,'Champion-level win','Elite heavyweight champion-level opponent.','locked'],
      ['Stipe Miocic I',1.25,'Champion-level win','Elite future UFC heavyweight champion.','locked'],
      ['Fabricio Werdum',1.00,'True top-5 win','Elite heavyweight and future UFC champion.','locked'],
      ['Shane Carwin',1.00,'True top-5 win','Elite heavyweight contender and interim champion.','locked'],
      ['Frank Mir',1.00,'True top-5 win','Former UFC heavyweight champion.','locked'],
      ['Mark Hunt',0.85,'Strong top-10 win','Dangerous ranked heavyweight contender.','locked'],
      ['Derrick Lewis',0.85,'Strong top-10 win','Dangerous ranked heavyweight contender.','locked'],
      ['Ben Rothwell',0.85,'Strong top-10 win','Ranked heavyweight contender.','locked'],
      ['Tai Tuivasa',0.65,'Ranked / quality win','Quality heavyweight win late in JDS run.','review'],
      ['Mirko Cro Cop',0.65,'Ranked / quality win','Legend name with UFC/timing context.','review'],
      ['Gabriel Gonzaga',0.65,'Ranked / quality win','Ranked heavyweight veteran.','locked'],
      ['Stefan Struve',0.45,'Solid resume win','Solid early UFC heavyweight win.','locked']
    ],
    'Dominick Cruz':[
      ['T.J. Dillashaw',1.25,'Champion-level win','Elite UFC bantamweight champion-level opponent.','locked'],
      ['Demetrious Johnson',1.00,'True top-5 win','Elite future flyweight champion at bantamweight.','review'],
      ['Urijah Faber II',1.00,'True top-5 win','Elite bantamweight rival and title challenger.','locked'],
      ['Urijah Faber III',0.85,'Strong top-10 win','Repeat win over elite rival, timing/repeat context.','review'],
      ['Takeya Mizugaki',0.65,'Ranked / quality win','Ranked bantamweight contender.','locked'],
      ['Casey Kenney',0.45,'Solid resume win','Solid late-career bantamweight win.','locked']
    ],
    'Francis Ngannou':[
      ['Stipe Miocic II',1.25,'Champion-level win','Elite UFC heavyweight champion.','locked'],
      ['Ciryl Gane',1.25,'Champion-level win','Undefeated interim champion and elite heavyweight title opponent.','locked'],
      ['Curtis Blaydes II',0.85,'Strong top-10 win','Strong ranked heavyweight contender.','locked'],
      ['Alistair Overeem',0.85,'Strong top-10 win','Elite heavyweight name, timing adjusted.','review'],
      ['Junior dos Santos',0.85,'Strong top-10 win','Former UFC champion, later-career timing.','review'],
      ['Jairzinho Rozenstruik',0.85,'Strong top-10 win','Undefeated ranked heavyweight contender.','locked'],
      ['Cain Velasquez',0.65,'Ranked / quality win','All-time heavyweight name, but late-career timing.','review'],
      ['Andrei Arlovski',0.65,'Ranked / quality win','Former champion name, late-career value.','review'],
      ['Curtis Blaydes I',0.65,'Ranked / quality win','Early win over future ranked contender.','review'],
      ['Bojan Mihajlovic',0.10,'Minimal UFC quality credit','Minimal UFC quality value.','locked']
    ],
    'Deiveson Figueiredo':[
      ['Brandon Moreno III',1.25,'Champion-level win','Elite flyweight champion and defining rival.','locked'],
      ['Joseph Benavidez II',1.15,'Elite divisional win','Elite flyweight great, division-calibrated below max.','locked'],
      ['Joseph Benavidez I',1.00,'True top-5 win','Elite flyweight title contender.','locked'],
      ['Alex Perez',0.85,'Strong top-10 win','Ranked flyweight title challenger.','locked'],
      ['Alexandre Pantoja',1.00,'True top-5 win','Future UFC flyweight champion.','review'],
      ['Rob Font',0.65,'Ranked / quality win','Ranked bantamweight veteran win.','review'],
      ['Cody Garbrandt',0.65,'Ranked / quality win','Former champion name, late-career timing.','review'],
      ['Tim Elliott',0.65,'Ranked / quality win','Ranked flyweight contender.','review'],
      ['John Moraga',0.65,'Ranked / quality win','Ranked flyweight contender.','review'],
      ['Matt Schnell',0.45,'Solid resume win','Solid UFC flyweight win.','locked']
    ],
    'Khamzat Chimaev':[
      ['Dricus Du Plessis',1.25,'Champion-level win','Elite UFC middleweight champion-level opponent in app timeline.','review'],
      ['Robert Whittaker',1.25,'Champion-level win','Elite champion-level middleweight contender.','locked'],
      ['Kamaru Usman',1.00,'True top-5 win','All-time welterweight great moving up on short notice.','review'],
      ['Gilbert Burns',1.00,'True top-5 win','Elite welterweight contender.','locked'],
      ['Kevin Holland',0.65,'Ranked / quality win','Quality welterweight/middleweight name, short-notice context.','review'],
      ['Li Jingliang',0.65,'Ranked / quality win','Ranked welterweight veteran.','locked'],
      ['Gerald Meerschaert',0.45,'Solid resume win','Solid UFC middleweight win.','locked'],
      ['Rhys McKee',0.25,'Name-value / faded / unproven','Low-end UFC quality value.','locked'],
      ['John Phillips',0.25,'Name-value / faded / unproven','Low-end UFC quality value.','locked']
    ],
    'Lyoto Machida':[
      ['Rashad Evans',1.25,'Champion-level win','UFC light heavyweight champion.','locked'],
      ['Mauricio Rua I',1.25,'Champion-level win','Elite champion-level light heavyweight; controversial decision context.','high-risk review'],
      ['Gegard Mousasi',1.00,'True top-5 win','Elite middleweight/light-heavyweight contender.','review'],
      ['Dan Henderson',0.85,'Strong top-10 win','All-time name and ranked light heavyweight, timing context.','review'],
      ['Tito Ortiz',0.85,'Strong top-10 win','Former UFC champion, later-career but still relevant.','review'],
      ['Thiago Silva',0.85,'Strong top-10 win','Undefeated ranked light heavyweight contender.','locked'],
      ['Randy Couture',0.65,'Ranked / quality win','Legend name, late-career timing.','review'],
      ['Mark Munoz',0.65,'Ranked / quality win','Ranked middleweight win.','locked'],
      ['C.B. Dollaway',0.45,'Solid resume win','Solid UFC middleweight win.','locked'],
      ['Sokoudjou',0.45,'Solid resume win','Solid UFC light-heavyweight win.','review']
    ],
    'Sean Strickland':[
      ['Israel Adesanya',1.25,'Champion-level win','Elite UFC middleweight champion.','locked'],
      ['Khamzat Chimaev',1.25,'Champion-level win','Elite title-level opponent in app timeline.','review'],
      ['Paulo Costa',0.85,'Strong top-10 win','Strong ranked middleweight contender.','review'],
      ['Nassourdine Imavov',0.85,'Strong top-10 win','Strong ranked middleweight contender.','locked'],
      ['Jack Hermansson',0.85,'Strong top-10 win','Ranked middleweight contender.','locked'],
      ['Uriah Hall',0.65,'Ranked / quality win','Quality middleweight win.','locked'],
      ['Brendan Allen',0.65,'Ranked / quality win','Quality middleweight win before Allen peak.','review'],
      ['Krzysztof Jotko',0.45,'Solid resume win','Solid UFC middleweight win.','locked'],
      ['Court McGee',0.45,'Solid resume win','Solid UFC win.','locked'],
      ['Tom Breese',0.45,'Solid resume win','Solid UFC win.','locked']
    ],
    "Sean O'Malley":[
      ['Aljamain Sterling',1.25,'Champion-level win','Knocked out the reigning UFC bantamweight champion to win the title.','locked'],
      ['Petr Yan',1.15,'Elite divisional win','Elite former champion; Cody-approved above standard top-five credit despite close decision context.','locked'],
      ['Marlon Vera II',1.00,'True top-5 win','Dominant UFC title defense over a ranked rival.','locked'],
      ['Song Yadong',0.85,'Strong top-10 win','Strong ranked bantamweight rebound win, with close-decision context.','review'],
      ['Aiemann Zahabi',0.65,'Ranked / quality win','Ranked-quality rebound finish in the current app timeline.','review'],
      ['Raulian Paiva',0.45,'Solid resume win','Solid UFC bantamweight win.','locked'],
      ['Thomas Almeida',0.25,'Name-value / faded / unproven','Former prospect name with faded timing.','review'],
      ['Eddie Wineland',0.25,'Name-value / faded / unproven','Veteran name with a heavy timing discount.','review'],
      ['Jose Alberto Quinonez',0.25,'Name-value / faded / unproven','Supporting UFC bantamweight win.','locked'],
      ['Andre Soukhamthath',0.25,'Name-value / faded / unproven','Low-end UFC quality value.','locked'],
      ['Terrion Ware',0.10,'Minimal UFC quality credit','UFC debut win with minimal opponent-quality value.','locked'],
      ['Kris Moutinho',0.10,'Minimal UFC quality credit','Minimal UFC quality value.','locked']
    ],
    'Michael Bisping':[
      ['Luke Rockhold II',1.25,'Champion-level win','UFC middleweight champion and elite title opponent.','locked'],
      ['Anderson Silva',0.85,'Strong top-10 win','All-time great name, late-career timing.','review'],
      ['Thales Leites',0.65,'Ranked / quality win','Ranked middleweight contender.','locked'],
      ['Brian Stann',0.65,'Ranked / quality win','Quality middleweight win.','locked'],
      ['Alan Belcher',0.65,'Ranked / quality win','Quality middleweight win.','locked'],
      ['Dan Henderson II',0.65,'Ranked / quality win','Legend name, but aged timing.','review'],
      ['Cung Le',0.45,'Solid resume win','Name win with timing/context discount.','review'],
      ['Jason Miller',0.45,'Solid resume win','Solid UFC win.','locked'],
      ['Chris Leben',0.45,'Solid resume win','Solid UFC middleweight win.','locked'],
      ['Yoshihiro Akiyama',0.45,'Solid resume win','Solid UFC middleweight win.','locked'],
      ['Denis Kang',0.45,'Solid resume win','Solid UFC win.','locked']
    ],
    'Dan Henderson':[
      ['Mauricio Rua I',1.00,'True top-5 win','Elite former UFC champion in classic contender fight.','locked'],
      ['Michael Bisping I',0.85,'Strong top-10 win','Strong ranked middleweight contender.','locked'],
      ['Rich Franklin',0.85,'Strong top-10 win','Former UFC champion and strong contender.','review'],
      ['Mauricio Rua II',0.85,'Strong top-10 win','Repeat win over elite name, later-career context.','review'],
      ['Rousimar Palhares',0.65,'Ranked / quality win','Quality middleweight win.','locked'],
      ['Hector Lombard',0.45,'Solid resume win','Name win with timing/context discount.','review'],
      ['Tim Boetsch',0.45,'Solid resume win','Solid UFC middleweight win.','locked'],
      ['Wanderlei Silva',0.00,'No UFC quality credit','Major win, but outside UFC and not scored here.','locked']
    ],
    'Chael Sonnen':[
      ['Yushin Okami',0.85,'Strong top-10 win','Strong ranked middleweight contender.','locked'],
      ['Nate Marquardt',0.85,'Strong top-10 win','Strong ranked middleweight contender.','locked'],
      ['Michael Bisping',0.85,'Strong top-10 win','Strong middleweight contender, close fight context.','review'],
      ['Brian Stann',0.65,'Ranked / quality win','Quality middleweight win.','locked'],
      ['Mauricio Rua',0.65,'Ranked / quality win','Former UFC champion name, late-career/light-heavyweight context.','review'],
      ['Dan Miller',0.45,'Solid resume win','Solid UFC middleweight win.','locked'],
      ['Trevor Prangley',0.45,'Solid resume win','Solid UFC win.','locked'],
      ['Paulo Filho',0.00,'No UFC quality credit','Major win, but outside UFC and not scored here.','locked']
    ]
  });
  store.version=VERSION;
  store.mode='shadow-ledger-batch-six-dricus-omalley-reviewed';
  store.batchSixFighters=['Dricus du Plessis','Tyron Woodley','Ilia Topuria','Brock Lesnar','Junior dos Santos','Dominick Cruz','Francis Ngannou','Deiveson Figueiredo','Khamzat Chimaev','Lyoto Machida','Sean Strickland',"Sean O'Malley",'Michael Bisping','Dan Henderson','Chael Sonnen'];
  document.documentElement.setAttribute('data-opponent-quality-ledger-batch-six',VERSION);
})();
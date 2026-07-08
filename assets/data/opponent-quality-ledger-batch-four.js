// Opponent Quality shadow ledger batch four.
// Extends the base shadow ledger. No live scores changed.
(function(){
  const VERSION='opponent-quality-ledger-batch-four-20260708a';
  const store=window.UFC_OPPONENT_QUALITY_LEDGERS;
  if(!store||!store.raw)return;
  const RAW=store.raw;
  Object.assign(RAW,{
    'Kamaru Usman':[
      ['Tyron Woodley',1.25,'Champion-level win','UFC welterweight champion and elite title-level opponent.','locked'],
      ['Colby Covington I',1.25,'Champion-level win','Prime elite welterweight title challenger.','locked'],
      ['Colby Covington II',1.25,'Champion-level win','Repeat win over elite welterweight title challenger.','locked'],
      ['Gilbert Burns',1.00,'True top-5 win','Elite welterweight contender and title challenger.','locked'],
      ['Leon Edwards I',1.00,'True top-5 win','Early win over future elite champion; not prime Leon yet.','review'],
      ['Rafael dos Anjos',1.00,'True top-5 win','Former lightweight champion and strong welterweight contender.','review'],
      ['Demian Maia',0.85,'Strong top-10 win','Elite grappler and ranked welterweight veteran.','locked'],
      ['Jorge Masvidal I',0.85,'Strong top-10 win','High-profile ranked contender, title-opponent context.','review'],
      ['Jorge Masvidal II',0.85,'Strong top-10 win','Repeat ranked contender win, less fresh than first.','review'],
      ['Sergio Moraes',0.65,'Ranked / quality win','Useful welterweight win on contender climb.','locked'],
      ['Sean Strickland',0.65,'Ranked / quality win','Early Strickland welterweight win before later middleweight peak.','review'],
      ['Warlley Alves',0.65,'Ranked / quality win','Strong prospect/contender-climb win.','review'],
      ['Emil Meek',0.45,'Solid resume win','Solid UFC welterweight win.','locked'],
      ['Alexander Yakovlev',0.45,'Solid resume win','Useful UFC win.','locked'],
      ['Hayder Hassan',0.25,'Name-value / faded / unproven','Low-end UFC quality value.','locked']
    ],
    'Anderson Silva':[
      ['Dan Henderson',1.25,'Champion-level win','Elite champion-level opponent and all-time great.','locked'],
      ['Rich Franklin I',1.25,'Champion-level win','UFC middleweight champion and elite title-level opponent.','locked'],
      ['Rich Franklin II',1.00,'True top-5 win','Repeat win over former champion, still elite but repeat/age context.','review'],
      ['Vitor Belfort',1.00,'True top-5 win','Explosive former champion and top middleweight title challenger.','locked'],
      ['Chael Sonnen II',1.00,'True top-5 win','Elite middleweight title challenger and real threat in rematch.','locked'],
      ['Chael Sonnen I',1.00,'True top-5 win','Elite title challenger; difficult fight context but no performance modifier.','review'],
      ['Yushin Okami',0.85,'Strong top-10 win','Strong ranked middleweight contender.','locked'],
      ['Demian Maia',0.85,'Strong top-10 win','Elite grappler and ranked middleweight challenger.','locked'],
      ['Nate Marquardt',0.85,'Strong top-10 win','Strong ranked middleweight contender.','locked'],
      ['Forrest Griffin',0.85,'Strong top-10 win','Former light heavyweight champion, timing/decline context.','review'],
      ['Stephan Bonnar',0.45,'Solid resume win','Name win at light heavyweight, limited quality value.','review'],
      ['Patrick Cote',0.45,'Solid resume win','Title challenger but weaker opponent-quality case.','review'],
      ['Thales Leites',0.45,'Solid resume win','Title challenger but softer contender context.','review'],
      ['Chris Leben',0.45,'Solid resume win','Good UFC debut win, not elite quality.','locked'],
      ['James Irvin',0.25,'Name-value / faded / unproven','Limited opponent-quality value.','locked']
    ],
    'Demetrious Johnson':[
      ['Henry Cejudo I',1.25,'Champion-level win','Future two-division UFC champion, early but elite-talent context.','review'],
      ['Joseph Benavidez II',1.25,'Champion-level win','Elite flyweight title challenger and divisional great.','locked'],
      ['Joseph Benavidez I',1.00,'True top-5 win','Elite contender win for inaugural flyweight title.','locked'],
      ['John Dodson II',1.00,'True top-5 win','Elite flyweight contender and repeat title challenger.','locked'],
      ['John Dodson I',1.00,'True top-5 win','Prime dangerous flyweight title challenger.','locked'],
      ['Kyoji Horiguchi',1.00,'True top-5 win','Elite young flyweight contender, future non-UFC greatness context.','review'],
      ['Ray Borg',0.85,'Strong top-10 win','Legit ranked flyweight title challenger.','locked'],
      ['Tim Elliott',0.85,'Strong top-10 win','Ranked title challenger with awkward style.','review'],
      ['Ali Bagautinov',0.85,'Strong top-10 win','Ranked flyweight title challenger.','locked'],
      ['John Moraga',0.85,'Strong top-10 win','Ranked flyweight title challenger.','locked'],
      ['Ian McCall II',0.85,'Strong top-10 win','Strong flyweight contender rematch win.','locked'],
      ['Wilson Reis',0.65,'Ranked / quality win','Ranked flyweight contender.','locked'],
      ['Chris Cariaso',0.65,'Ranked / quality win','Title challenger but softer division-context value.','review'],
      ['Miguel Torres',0.65,'Ranked / quality win','Former elite bantamweight name, UFC timing context.','review'],
      ['Norifumi Yamamoto',0.45,'Solid resume win','Legend name, but UFC/timing value limited.','review']
    ],
    'Israel Adesanya':[
      ['Robert Whittaker I',1.25,'Champion-level win','Elite UFC middleweight champion.','locked'],
      ['Robert Whittaker II',1.25,'Champion-level win','Repeat win over elite champion-level middleweight.','locked'],
      ['Paulo Costa',1.00,'True top-5 win','Undefeated top middleweight contender.','locked'],
      ['Yoel Romero',1.00,'True top-5 win','Elite middleweight title challenger, age/activity context.','review'],
      ['Marvin Vettori II',1.00,'True top-5 win','Top middleweight title challenger.','locked'],
      ['Kelvin Gastelum',1.00,'True top-5 win','Elite interim-title war opponent at middleweight.','locked'],
      ['Alex Pereira II',1.00,'True top-5 win','UFC champion rematch win, but limited UFC sample at the time.','review'],
      ['Jared Cannonier',0.85,'Strong top-10 win','Strong ranked middleweight contender.','locked'],
      ['Derek Brunson',0.85,'Strong top-10 win','Strong ranked middleweight contender.','locked'],
      ['Anderson Silva',0.65,'Ranked / quality win','All-time name, but late-career timing heavily discounted.','review'],
      ['Brad Tavares',0.65,'Ranked / quality win','Quality middleweight win on contender climb.','locked'],
      ['Marvin Vettori I',0.65,'Ranked / quality win','Early quality UFC win.','review'],
      ['Rob Wilkinson',0.25,'Name-value / faded / unproven','Low-end UFC quality value.','locked']
    ],
    'Alex Pereira':[
      ['Israel Adesanya I',1.25,'Champion-level win','Elite UFC middleweight champion.','locked'],
      ['Jiri Prochazka I',1.25,'Champion-level win','Elite former light heavyweight champion.','locked'],
      ['Jiri Prochazka II',1.25,'Champion-level win','Repeat win over elite light heavyweight champion-level opponent.','locked'],
      ['Jan Blachowicz',1.00,'True top-5 win','Former light heavyweight champion and top contender.','locked'],
      ['Jamahal Hill',1.00,'True top-5 win','Former light heavyweight champion returning from injury.','review'],
      ['Magomed Ankalaev',1.00,'True top-5 win','Elite light heavyweight contender/title-level opponent.','review'],
      ['Sean Strickland',0.85,'Strong top-10 win','Strong ranked middleweight win before Strickland title peak.','review'],
      ['Khalil Rountree',0.85,'Strong top-10 win','Dangerous ranked light heavyweight title challenger.','review'],
      ['Bruno Silva',0.45,'Solid resume win','Solid UFC middleweight win.','locked'],
      ['Andreas Michailidis',0.25,'Name-value / faded / unproven','Low UFC opponent-quality value.','locked']
    ],
    'Daniel Cormier':[
      ['Stipe Miocic I',1.25,'Champion-level win','Elite UFC heavyweight champion.','locked'],
      ['Anthony Johnson I',1.25,'Champion-level win','Elite light heavyweight title challenger.','locked'],
      ['Anthony Johnson II',1.25,'Champion-level win','Repeat win over elite light heavyweight title challenger.','locked'],
      ['Alexander Gustafsson',1.25,'Champion-level win','Elite champion-level light heavyweight title challenger.','locked'],
      ['Derrick Lewis',1.00,'True top-5 win','Heavyweight title challenger and dangerous top contender.','review'],
      ['Anderson Silva',0.65,'Ranked / quality win','All-time name, short-notice/late-career context.','review'],
      ['Frank Mir',0.65,'Ranked / quality win','Former heavyweight champion, later-career timing.','review'],
      ['Roy Nelson',0.65,'Ranked / quality win','Ranked heavyweight veteran.','locked'],
      ['Dan Henderson',0.45,'Solid resume win','All-time name, but aged/undersized timing.','review'],
      ['Patrick Cummins',0.25,'Name-value / faded / unproven','Short-notice low opponent-quality value.','locked']
    ],
    'Stipe Miocic':[
      ['Francis Ngannou I',1.25,'Champion-level win','Elite heavyweight title challenger and future champion.','locked'],
      ['Daniel Cormier II',1.25,'Champion-level win','Elite champion-level heavyweight/light heavyweight great.','locked'],
      ['Daniel Cormier III',1.25,'Champion-level win','Repeat win over elite champion-level opponent.','locked'],
      ['Fabricio Werdum',1.25,'Champion-level win','UFC heavyweight champion and elite title-level opponent.','locked'],
      ['Junior dos Santos II',1.00,'True top-5 win','Former UFC champion and top heavyweight contender.','review'],
      ['Alistair Overeem',1.00,'True top-5 win','Elite heavyweight title challenger.','locked'],
      ['Mark Hunt',0.85,'Strong top-10 win','Dangerous ranked heavyweight veteran.','locked'],
      ['Andrei Arlovski',0.85,'Strong top-10 win','Former champion on relevant win streak.','review'],
      ['Roy Nelson',0.65,'Ranked / quality win','Ranked heavyweight veteran.','locked'],
      ['Gabriel Gonzaga',0.65,'Ranked / quality win','Ranked heavyweight veteran.','locked'],
      ['Shane del Rosario',0.45,'Solid resume win','Solid early UFC heavyweight win.','locked'],
      ['Joey Beltran',0.25,'Name-value / faded / unproven','Low-end UFC quality value.','locked'],
      ['Philip De Fries',0.25,'Name-value / faded / unproven','Low-end UFC quality value.','locked']
    ],
    'Cain Velasquez':[
      ['Junior dos Santos II',1.25,'Champion-level win','Elite UFC heavyweight champion-level opponent.','locked'],
      ['Junior dos Santos III',1.25,'Champion-level win','Repeat win over elite champion-level heavyweight.','locked'],
      ['Brock Lesnar',1.00,'True top-5 win','UFC heavyweight champion, high-profile but limited-depth champion context.','review'],
      ['Antonio Rodrigo Nogueira',0.85,'Strong top-10 win','All-time name, UFC/timing context keeps below max.','review'],
      ['Antonio Silva I',0.85,'Strong top-10 win','Relevant heavyweight contender.','locked'],
      ['Antonio Silva II',0.85,'Strong top-10 win','Repeat contender win, slightly inflated by matchup dominance but no bonus.','review'],
      ['Ben Rothwell',0.65,'Ranked / quality win','Quality heavyweight veteran win.','locked'],
      ['Cheick Kongo',0.65,'Ranked / quality win','Quality heavyweight contender win.','locked'],
      ['Denis Stojnic',0.25,'Name-value / faded / unproven','Low UFC quality value.','locked'],
      ['Jake O’Brien',0.25,'Name-value / faded / unproven','Low UFC quality value.','locked'],
      ['Brad Morris',0.10,'Minimal UFC quality credit','Minimal UFC quality value.','locked']
    ],
    'Henry Cejudo':[
      ['Demetrious Johnson II',1.25,'Champion-level win','All-time flyweight champion; close decision flagged but max opponent quality.','high-risk review'],
      ['Marlon Moraes',1.00,'True top-5 win','Elite bantamweight contender for vacant title.','locked'],
      ['T.J. Dillashaw',1.00,'True top-5 win','UFC bantamweight champion moving down with weight-cut context.','review'],
      ['Dominick Cruz',0.85,'Strong top-10 win','All-time bantamweight name with long-layoff timing.','review'],
      ['Sergio Pettis',0.85,'Strong top-10 win','Strong flyweight contender.','locked'],
      ['Wilson Reis',0.65,'Ranked / quality win','Ranked flyweight contender.','locked'],
      ['Jussier Formiga',0.65,'Ranked / quality win','Quality flyweight contender.','locked'],
      ['Chris Cariaso',0.45,'Solid resume win','Former title challenger but limited timing value.','review'],
      ['Chico Camus',0.45,'Solid resume win','Solid UFC flyweight win.','locked'],
      ['Dustin Kimura',0.25,'Name-value / faded / unproven','Low UFC quality value.','locked']
    ],
    'Robert Whittaker':[
      ['Yoel Romero I',1.25,'Champion-level win','Elite middleweight title-level opponent.','locked'],
      ['Yoel Romero II',1.25,'Champion-level win','Repeat win over elite middleweight title-level opponent.','locked'],
      ['Jared Cannonier',1.00,'True top-5 win','Prime top middleweight contender.','locked'],
      ['Paulo Costa',1.00,'True top-5 win','Former title challenger and top middleweight contender.','review'],
      ['Marvin Vettori',1.00,'True top-5 win','Top middleweight contender.','locked'],
      ['Darren Till',0.85,'Strong top-10 win','Ranked middleweight contender, close tactical fight.','review'],
      ['Kelvin Gastelum',0.85,'Strong top-10 win','Strong ranked middleweight contender.','locked'],
      ['Jacare Souza',0.85,'Strong top-10 win','Elite grappler and ranked middleweight contender.','locked'],
      ['Derek Brunson',0.85,'Strong top-10 win','Strong ranked middleweight contender.','locked'],
      ['Uriah Hall',0.65,'Ranked / quality win','Quality middleweight win.','locked'],
      ['Brad Tavares',0.65,'Ranked / quality win','Quality middleweight win.','locked'],
      ['Clint Hester',0.45,'Solid resume win','Solid UFC middleweight win.','locked'],
      ['Mike Rhodes',0.25,'Name-value / faded / unproven','Low-end UFC quality value.','locked']
    ]
  });
  store.version=VERSION;
  store.mode='shadow-ledger-batch-four';
  store.batchFourFighters=['Kamaru Usman','Anderson Silva','Demetrious Johnson','Israel Adesanya','Alex Pereira','Daniel Cormier','Stipe Miocic','Cain Velasquez','Henry Cejudo','Robert Whittaker'];
  document.documentElement.setAttribute('data-opponent-quality-ledger-batch-four',VERSION);
})();
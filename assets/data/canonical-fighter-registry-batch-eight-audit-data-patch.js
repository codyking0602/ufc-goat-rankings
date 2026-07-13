// Final audited UFC-only records, prime windows, loss ledgers, and public stats for the eight-fighter batch.
(function(){
  'use strict';
  const VERSION='batch-eight-audit-data-patch-20260712c-final-record-recount';
  const data=window.UFC_BATCH_EIGHT_FIGHTER_DATA;
  if(!Array.isArray(data)) return;
  const byName=Object.fromEntries(data.map(row=>[row.name,row]));
  const patch=(name,values)=>{if(byName[name])Object.assign(byName[name],values);};

  patch('Benson Henderson',{
    record:'11-3',prime:'10-3',primeWins:10,primeLosses:3,primeFinishes:2,primeFinish:15.38,
    primeStart:'2011-08-14',primeStartLabel:'Jim Miller',primeEnd:'2015-11-28',primeEndLabel:'Jorge Masvidal',
    years:4.29,finish:18.18,rounds:66.2,stopped:2,c:[8,16.5,21.8,12.75,4.7,-6,0],
    elite:4,top5:5,ranked:10,
    wins:['Frankie Edgar','Frankie Edgar II','Nate Diaz','Gilbert Melendez','Jim Miller','Josh Thomson','Clay Guida','Jorge Masvidal','Rustam Khabilov','Brandon Thatch','Mark Bocek'],
    losses:[
      ['Anthony Pettis','prime elite title finish loss','2013-08-31'],
      ['Rafael dos Anjos','prime elite finish loss','2014-08-23'],
      ['Donald Cerrone','prime elite decision loss','2015-01-18']
    ],
    one:'Four UFC title-fight wins and an 11-3 UFC record in a loaded lightweight era, capped by low finish volume and three counted prime losses.',
    why:'Henderson won the UFC lightweight title, defended it three times, beat Frankie Edgar twice, and went 11-3 across lightweight and welterweight.',
    whyNot:'Several signature decisions were close, he finished only two UFC wins, and the Pettis, dos Anjos, and Cerrone losses all sit inside the counted elite window. WEC is excluded.'
  });

  patch('Fabricio Werdum',{
    record:'12-6',prime:'9-3',primeWins:9,primeLosses:3,primeFinishes:5,primeFinish:41.67,
    primeStart:'2012-02-04',primeStartLabel:'Roy Nelson',primeEnd:'2018-03-17',primeEndLabel:'Alexander Volkov',
    years:6.12,finish:58.33,rounds:69,stopped:2,c:[4,19,21.9,16.2,5.2,-8.25,0],
    elite:3,top5:5,ranked:10,
    wins:['Cain Velasquez','Mark Hunt','Antonio Rodrigo Nogueira','Travis Browne','Roy Nelson','Marcin Tybura','Alexander Gustafsson','Walt Harris','Mike Russow','Gabriel Gonzaga','Brandon Vera','Travis Browne II'],
    losses:[
      ['Andrei Arlovski','pre-prime elite decision loss','2007-04-21'],
      ['Junior dos Santos','pre-prime elite finish loss','2008-10-25'],
      ['Stipe Miocic','prime elite title finish loss','2016-05-14'],
      ['Alistair Overeem','prime elite decision loss','2017-07-08'],
      ['Alexander Volkov','prime elite finish loss','2018-03-17'],
      ['Aleksei Oleinik','post-prime decision loss','2020-05-09']
    ],
    one:'A 12-6 UFC heavyweight with interim and undisputed title wins, a signature Cain submission, and a complete six-loss UFC ledger.',
    why:'Werdum beat Cain Velasquez, Mark Hunt, Antonio Rodrigo Nogueira, Travis Browne, Roy Nelson, and several later ranked heavyweights across two UFC runs.',
    whyNot:'He made no successful undisputed defense and five losses occurred before or during the counted elite window. PRIDE and Strikeforce are excluded.'
  });

  patch('Glover Teixeira',{
    record:'16-7',prime:'13-7',primeWins:13,primeLosses:7,primeFinishes:10,primeFinish:50,
    primeStart:'2013-01-26',primeStartLabel:'Quinton Jackson',primeEnd:'2023-01-21',primeEndLabel:'Jamahal Hill',
    years:10,finish:81.25,rounds:67,stopped:3,c:[2.2,16.5,20.4,24,4.6,-10,0],
    elite:3,top5:5,ranked:12,
    wins:['Jan Blachowicz','Thiago Santos','Anthony Smith','Nikita Krylov','Rashad Evans','Ryan Bader','Ovince Saint Preux','Quinton Jackson','Jared Cannonier','Misha Cirkunov','Ion Cutelaba','Karl Roberson','James Te Huna','Patrick Cummins','Fabio Maldonado','Kyle Kingsbury'],
    losses:[
      ['Jon Jones','prime elite title decision loss','2014-04-26'],
      ['Phil Davis','prime elite decision loss','2014-10-25'],
      ['Anthony Johnson','prime elite finish loss','2016-08-20'],
      ['Alexander Gustafsson','prime elite finish loss','2017-05-28'],
      ['Corey Anderson','prime elite decision loss','2018-07-22'],
      ['Jiri Prochazka','prime elite title finish loss','2022-06-12'],
      ['Jamahal Hill','prime elite title decision loss','2023-01-21']
    ],
    one:'Sixteen UFC wins, thirteen finishes, a title at 42, and a decade-long elite window, balanced by the maximum Loss Context cap.',
    why:'Teixeira paired exceptional UFC longevity with thirteen finishes and a late championship win over Jan Blachowicz.',
    whyNot:'He won only one title fight and accumulated seven losses while operating inside the long counted elite window, producing the maximum loss penalty.'
  });

  patch('Frank Shamrock',{
    record:'5-0',prime:'5-0',primeWins:5,primeLosses:0,primeFinishes:5,primeFinish:100,
    primeStart:'1997-12-21',primeStartLabel:'Kevin Jackson',primeEnd:'1999-09-24',primeEndLabel:'Tito Ortiz',
    years:1.76,finish:100,rounds:90,stopped:0,c:[8,9,25.8,4.04,5.2,0,-2],
    elite:2,top5:3,ranked:5,
    wins:['Tito Ortiz','Kevin Jackson','Jeremy Horn','Igor Zinoviev','John Lober'],
    losses:[],
    one:'An unbeaten 5-0 UFC champion with five finishes and four defenses, capped by pioneer-era depth and a UFC window under two years.',
    why:'Shamrock finished every UFC opponent, won the inaugural 200-pound title, defended it four times, and closed with a signature win over Tito Ortiz.',
    whyNot:'The entire UFC resume is five fights in a developing era. Pancrase, WEC, Strikeforce, and other non-UFC achievements are excluded.'
  });

  patch('Rashad Evans',{
    record:'14-8-1',prime:'9-4',primeWins:9,primeLosses:4,primeFinishes:4,primeFinish:30.77,
    primeStart:'2007-11-17',primeStartLabel:'Michael Bisping',primeEnd:'2015-10-03',primeEndLabel:'Ryan Bader',
    years:7.5,finish:42.86,rounds:68,stopped:1,c:[2.2,17,21,19.7,4.7,-9.25,0],
    elite:4,top5:6,ranked:10,
    wins:['Forrest Griffin','Chuck Liddell','Quinton Jackson','Phil Davis','Michael Bisping','Dan Henderson','Tito Ortiz','Thiago Silva','Chael Sonnen','Stephan Bonnar','Sean Salmon','Jason Lambert','Sam Hoger','Brad Imes'],
    losses:[
      ['Lyoto Machida','prime elite title finish loss','2009-05-23'],
      ['Jon Jones','prime elite title decision loss','2012-04-21'],
      ['Antonio Rogerio Nogueira','prime non-elite decision loss','2013-02-02'],
      ['Ryan Bader','prime elite decision loss','2015-10-03'],
      ['Glover Teixeira','post-prime finish loss','2016-04-16'],
      ['Dan Kelly','post-prime decision loss','2017-03-04'],
      ['Sam Alvey','post-prime decision loss','2017-08-05'],
      ['Anthony Smith','post-prime finish loss','2018-06-09']
    ],
    one:'A 14-win UFC champion with elite wins over Forrest, Chuck, Rampage, and Phil Davis, offset by four losses inside the extended elite window.',
    why:'Evans began 8-0-1 in the UFC, knocked out Liddell and Griffin, won the light-heavyweight title, and later re-proved elite form against Henderson and Sonnen.',
    whyNot:'He lost the title in his first defense, never regained it, and the Nogueira and Bader losses remain inside the window because he re-established elite relevance after Jon Jones.'
  });

  patch('Vitor Belfort',{
    record:'15-10, 1 NC',prime:'6-3',primeWins:6,primeLosses:3,primeFinishes:6,primeFinish:66.67,
    primeStart:'2009-09-19',primeStartLabel:'Rich Franklin',primeEnd:'2015-05-23',primeEndLabel:'Chris Weidman',
    years:5.68,finish:93.33,rounds:62,stopped:3,c:[3,17.5,21.9,14.6,5.3,-10,0],
    elite:5,top5:7,ranked:12,
    wins:['Randy Couture','Luke Rockhold','Michael Bisping','Rich Franklin','Dan Henderson II','Dan Henderson III','Wanderlei Silva','Anthony Johnson','Yoshihiro Akiyama','Nate Marquardt','Marvin Eastman','Tank Abbott','Joe Charles','Scott Ferrozzo','Tra Telligman'],
    losses:[
      ['Randy Couture I','pre-prime elite finish loss','1997-10-17'],
      ['Chuck Liddell','pre-prime elite decision loss','2002-06-22'],
      ['Randy Couture III','pre-prime elite title finish loss','2004-08-21'],
      ['Tito Ortiz','pre-prime elite decision loss','2005-02-05'],
      ['Anderson Silva','prime elite title finish loss','2011-02-05'],
      ['Jon Jones','prime upward-division elite title finish loss','2012-09-22'],
      ['Chris Weidman','prime elite title finish loss','2015-05-23'],
      ['Jacare Souza','post-prime elite finish loss','2016-05-14'],
      ['Gegard Mousasi','post-prime elite finish loss','2016-10-08'],
      ['Lyoto Machida','post-prime elite finish loss','2018-05-12']
    ],
    weirdResults:[['Kelvin Gastelum','post-prime no contest after overturned loss','2017-03-11']],
    one:'A 15-win UFC knockout pioneer with fourteen finishes and an elite 2013 apex, capped by ten losses and the maximum Loss Context penalty.',
    why:'Belfort won a UFC tournament, captured the light-heavyweight title, recorded fourteen UFC finishes, and beat elite names across three weight classes.',
    whyNot:'He never defended a UFC title, lost many major championship opportunities, and finished 15-10 with one no contest. The Couture cut-stoppage title win is discounted.'
  });

  patch('Mauricio "Shogun" Rua',{
    record:'11-12-1',prime:'3-3',primeWins:3,primeLosses:3,primeFinishes:3,primeFinish:50,
    primeStart:'2009-04-18',primeStartLabel:'Chuck Liddell',primeEnd:'2011-11-19',primeEndLabel:'Dan Henderson I',
    years:2.59,finish:72.73,rounds:53,stopped:1,c:[2.3,14.5,18.7,6.8,4.8,-6.75,0],
    elite:3,top5:4,ranked:9,
    wins:['Lyoto Machida','Chuck Liddell','Forrest Griffin','Antonio Rogerio Nogueira I','Antonio Rogerio Nogueira II','Corey Anderson','Mark Coleman','Brandon Vera','James Te Huna','Gian Villante','Tyson Pedro'],
    losses:[
      ['Forrest Griffin I','pre-prime elite finish loss','2007-09-22'],
      ['Lyoto Machida I','prime elite title decision loss','2009-10-24'],
      ['Jon Jones','prime elite title finish loss','2011-03-19'],
      ['Dan Henderson I','prime elite decision loss','2011-11-19'],
      ['Alexander Gustafsson','post-prime elite decision loss','2012-12-08'],
      ['Chael Sonnen','post-prime finish loss','2013-08-17'],
      ['Dan Henderson II','post-prime elite finish loss','2014-03-23'],
      ['Ovince Saint Preux I','post-prime finish loss','2014-11-08'],
      ['Anthony Smith','post-prime finish loss','2018-07-22'],
      ['Paul Craig II','post-prime finish loss','2020-11-21'],
      ['Ovince Saint Preux II','post-prime decision loss','2022-05-07'],
      ['Ihor Potieria','post-prime finish loss','2023-01-21']
    ],
    one:'A real UFC champion with major wins over Machida, Liddell, Griffin, and Nogueira, scored without PRIDE and with a 3-3 UFC prime.',
    why:'Rua knocked out Lyoto Machida for the title and added major UFC wins over Chuck Liddell, Forrest Griffin, and Antonio Rogerio Nogueira.',
    whyNot:'He never defended the title and finished 11-12-1 in the UFC. His legendary PRIDE resume is historical context only.'
  });

  patch('Forrest Griffin',{
    record:'10-5',prime:'4-2',primeWins:4,primeLosses:2,primeFinishes:1,primeFinish:16.67,
    primeStart:'2007-09-22',primeStartLabel:'Mauricio Rua I',primeEnd:'2011-02-05',primeEndLabel:'Rich Franklin',
    years:3.38,finish:30,rounds:57,stopped:2,c:[2.2,14.5,18.9,8.85,4.5,-7.25,0],
    elite:2,top5:4,ranked:7,
    wins:['Quinton Jackson','Mauricio Rua','Rich Franklin','Tito Ortiz II','Tito Ortiz III','Stephan Bonnar I','Stephan Bonnar II','Hector Ramirez','Elvis Sinosic','Bill Mahood'],
    losses:[
      ['Tito Ortiz I','pre-prime elite decision loss','2006-04-15'],
      ['Keith Jardine','pre-prime non-elite finish loss','2006-12-30'],
      ['Rashad Evans','prime elite title finish loss','2008-12-27'],
      ['Anderson Silva','prime elite finish loss','2009-08-08'],
      ['Mauricio Rua II','post-prime elite finish loss','2011-08-27']
    ],
    one:'A 10-5 UFC champion with defining wins over Shogun and Rampage, balanced by no successful defense and four penalized losses.',
    why:'Griffin beat Shogun and Rampage back-to-back, won the light-heavyweight title, and added wins over Tito Ortiz, Rich Franklin, and Stephan Bonnar.',
    whyNot:'He never defended the title, finished only three UFC victories, and suffered four penalized losses before or during the counted prime.'
  });

  window.UFC_BATCH_EIGHT_AUDIT_DATA_PATCH={version:VERSION,fighters:Object.keys(byName),applied:true};
  document.documentElement.setAttribute('data-batch-eight-audit-data-ready',VERSION);
})();

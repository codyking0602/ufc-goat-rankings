(function(){
  'use strict';

  const VERSION='find-leader-record-book-20260717a-official-snapshot';
  const SOURCE={
    name:'UFC Record Book',
    url:'https://statleaders.ufc.com/en',
    asOf:'2026-07-12T07:45:00Z',
    note:'Official UFC career record tables captured for Find the Leader only. This source does not alter GOAT scoring inputs.'
  };

  const fighter=(name,primaryDivision,extra={})=>({name,primaryDivision,...extra});
  const rows=(items)=>items.map(([name,value,primaryDivision,extra])=>fighter(name,primaryDivision,{value,...(extra||{})}));

  const METRICS={
    'total-fights':{
      label:'Total UFC fights',unit:'UFC fights',family:'record-book',
      rows:rows([
        ['Jim Miller',47,'Lightweight'],['Andrei Arlovski',42,'Heavyweight'],['Donald Cerrone',38,'Lightweight'],
        ['Clay Guida',37,'Lightweight'],['Charles Oliveira',37,'Lightweight'],['Neil Magny',37,'Welterweight'],
        ['Rafael dos Anjos',36,'Lightweight'],['Jeremy Stephens',36,'Featherweight'],['Demian Maia',33,'Welterweight'],['Max Holloway',33,'Featherweight']
      ])
    },
    'fight-night-bonuses':{
      label:'UFC Fight Night bonuses',unit:'Fight Night bonuses',family:'record-book',
      rows:rows([
        ['Charles Oliveira',21,'Lightweight'],['Donald Cerrone',18,'Lightweight'],['Justin Gaethje',17,'Lightweight'],
        ['Jim Miller',16,'Lightweight'],['Nate Diaz',16,'Welterweight'],['Joe Lauzon',15,'Lightweight'],
        ['Dustin Poirier',15,'Lightweight'],['Anderson Silva',14,'Middleweight'],['Edson Barboza',13,'Lightweight'],['Max Holloway',13,'Featherweight']
      ])
    },
    'knockdowns-landed':{
      label:'UFC knockdowns landed',unit:'knockdowns',family:'record-book',
      rows:rows([
        ['Donald Cerrone',20,'Lightweight'],['Anderson Silva',18,'Middleweight'],['Jeremy Stephens',18,'Featherweight'],
        ['Edson Barboza',16,'Lightweight'],['Dustin Poirier',15,'Lightweight'],['Chuck Liddell',14,'Light Heavyweight'],
        ['Lyoto Machida',14,'Light Heavyweight'],['Mauricio Rua',14,'Light Heavyweight'],['Junior dos Santos',14,'Heavyweight'],
        ['Thiago Santos',14,'Light Heavyweight'],['Khalil Rountree Jr.',14,'Light Heavyweight']
      ])
    },
    'significant-strikes-landed':{
      label:'UFC significant strikes landed',unit:'significant strikes',family:'record-book',
      rows:rows([
        ['Max Holloway',3693,'Featherweight'],['Sean Strickland',2430,'Middleweight'],['Angela Hill',2364,"Women's Strawweight"],
        ['King Green',2124,'Lightweight',{appName:'Bobby Green'}],['Dustin Poirier',1861,'Lightweight'],['Jessica Andrade',1824,"Women's Strawweight"],
        ['Rafael dos Anjos',1822,'Lightweight'],['Alexander Volkanovski',1815,'Featherweight'],['Frankie Edgar',1801,'Featherweight'],['Joanna Jedrzejczyk',1754,"Women's Strawweight"]
      ])
    },
    'total-strikes-landed':{
      label:'UFC total strikes landed',unit:'total strikes',family:'record-book',
      rows:rows([
        ['Max Holloway',3994,'Featherweight'],['Merab Dvalishvili',2782,'Bantamweight'],['Angela Hill',2763,"Women's Strawweight"],
        ['Neil Magny',2729,'Welterweight'],['Sean Strickland',2643,'Middleweight'],['Darren Elkins',2621,'Featherweight'],
        ['Georges St-Pierre',2591,'Welterweight'],['Rafael dos Anjos',2591,'Lightweight'],['Kamaru Usman',2564,'Welterweight'],['Nate Diaz',2487,'Welterweight']
      ])
    },
    'takedowns-landed':{
      label:'UFC takedowns landed',unit:'takedowns',family:'record-book',
      rows:rows([
        ['Merab Dvalishvili',119,'Bantamweight'],['Georges St-Pierre',90,'Welterweight'],['Gleison Tibau',84,'Lightweight'],
        ['Clay Guida',78,'Lightweight'],['Demetrious Johnson',74,'Flyweight'],['Frankie Edgar',73,'Featherweight'],
        ['Colby Covington',70,'Welterweight'],['Nik Lentz',69,'Featherweight'],['Demian Maia',68,'Welterweight'],['Rafael dos Anjos',68,'Lightweight']
      ])
    },
    'submission-attempts':{
      label:'UFC submission attempts',unit:'submission attempts',family:'record-book',
      rows:rows([
        ['Jim Miller',52,'Lightweight'],['Charles Oliveira',51,'Lightweight'],['Chris Lytle',31,'Welterweight'],
        ['Joe Lauzon',29,'Lightweight'],['Demian Maia',27,'Welterweight'],['Nate Diaz',26,'Welterweight'],
        ['Nik Lentz',26,'Featherweight'],['Darren Elkins',25,'Featherweight'],['Dustin Poirier',25,'Lightweight'],
        ['Matt Brown',24,'Welterweight'],['Georges St-Pierre',24,'Welterweight'],['Joe Stevenson',24,'Lightweight'],['Cole Miller',24,'Featherweight']
      ])
    },
    'control-time-minutes':{
      label:'UFC control time',unit:'minutes of control time',family:'record-book',
      rows:rows([
        ['Georges St-Pierre',162,'Welterweight'],['Clay Guida',156,'Lightweight'],['Demian Maia',155,'Welterweight'],
        ['Kamaru Usman',147,'Welterweight'],['Rafael dos Anjos',137,'Lightweight'],['Darren Elkins',129,'Featherweight'],
        ['Jon Fitch',128,'Welterweight'],['Randy Couture',127,'Heavyweight'],['Colby Covington',125,'Welterweight'],['Valentina Shevchenko',114,"Women's Flyweight"]
      ])
    },
    'fight-time-minutes':{
      label:'Total UFC fight time',unit:'minutes of UFC fight time',family:'record-book',
      rows:rows([
        ['Max Holloway',534,'Featherweight'],['Rafael dos Anjos',523,'Lightweight'],['Frankie Edgar',477,'Featherweight'],
        ['Jim Miller',453,'Lightweight'],['Neil Magny',443,'Welterweight'],['Angela Hill',433,"Women's Strawweight"],
        ['Clay Guida',423,'Lightweight'],['Andrei Arlovski',410,'Heavyweight'],['Demian Maia',410,'Welterweight'],['Jeremy Stephens',409,'Featherweight']
      ])
    }
  };

  Object.values(METRICS).forEach(metric=>Object.freeze(metric.rows));
  window.UFC_FIND_LEADER_RECORD_BOOK={version:VERSION,source:SOURCE,metrics:METRICS};
  document.documentElement.setAttribute('data-find-leader-record-book',VERSION);
})();
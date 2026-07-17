(function(){
  'use strict';

  const VERSION='find-leader-record-book-20260717b-fifty-question-data';
  const SOURCE={
    name:'UFC Record Book',
    url:'https://statleaders.ufc.com/en',
    asOf:'2026-07-12T07:45:00Z',
    note:'Official UFC career record tables captured for Find the Leader only. Record Book coverage begins at UFC 28 and this source does not alter GOAT scoring inputs.'
  };

  const fighter=(name,primaryDivision,extra={})=>({name,primaryDivision,...extra});
  const rows=items=>items.map(([name,value,primaryDivision,extra])=>fighter(name,primaryDivision,{value,...(extra||{})}));

  const METRICS={
    'total-fights':{label:'Total UFC fights',unit:'UFC fights',family:'record-book',rows:rows([
      ['Jim Miller',47,'Lightweight'],['Andrei Arlovski',42,'Heavyweight'],['Donald Cerrone',38,'Lightweight'],
      ['Clay Guida',37,'Lightweight'],['Charles Oliveira',37,'Lightweight'],['Neil Magny',37,'Welterweight'],
      ['Rafael dos Anjos',36,'Lightweight'],['Jeremy Stephens',36,'Featherweight'],['Demian Maia',33,'Welterweight'],['Max Holloway',33,'Featherweight']
    ])},
    'fight-night-bonuses':{label:'UFC Fight Night bonuses',unit:'Fight Night bonuses',family:'record-book',rows:rows([
      ['Charles Oliveira',21,'Lightweight'],['Donald Cerrone',18,'Lightweight'],['Justin Gaethje',17,'Lightweight'],
      ['Jim Miller',16,'Lightweight'],['Nate Diaz',16,'Welterweight'],['Joe Lauzon',15,'Lightweight'],
      ['Dustin Poirier',15,'Lightweight'],['Anderson Silva',14,'Middleweight'],['Edson Barboza',13,'Lightweight'],['Max Holloway',13,'Featherweight']
    ])},
    'knockdowns-landed':{label:'UFC knockdowns landed',unit:'knockdowns',family:'record-book',rows:rows([
      ['Donald Cerrone',20,'Lightweight'],['Anderson Silva',18,'Middleweight'],['Jeremy Stephens',18,'Featherweight'],
      ['Edson Barboza',16,'Lightweight'],['Dustin Poirier',15,'Lightweight'],['Chuck Liddell',14,'Light Heavyweight'],
      ['Lyoto Machida',14,'Light Heavyweight'],['Mauricio Rua',14,'Light Heavyweight'],['Junior dos Santos',14,'Heavyweight'],
      ['Thiago Santos',14,'Light Heavyweight'],['Khalil Rountree Jr.',14,'Light Heavyweight']
    ])},
    'significant-strikes-landed':{label:'UFC significant strikes landed',unit:'significant strikes',family:'record-book',rows:rows([
      ['Max Holloway',3693,'Featherweight'],['Sean Strickland',2430,'Middleweight'],['Angela Hill',2364,"Women's Strawweight"],
      ['King Green',2124,'Lightweight',{appName:'Bobby Green'}],['Dustin Poirier',1861,'Lightweight'],['Jessica Andrade',1824,"Women's Strawweight"],
      ['Rafael dos Anjos',1822,'Lightweight'],['Alexander Volkanovski',1815,'Featherweight'],['Frankie Edgar',1801,'Featherweight'],['Joanna Jedrzejczyk',1754,"Women's Strawweight"]
    ])},
    'total-strikes-landed':{label:'UFC total strikes landed',unit:'total strikes',family:'record-book',rows:rows([
      ['Max Holloway',3994,'Featherweight'],['Merab Dvalishvili',2782,'Bantamweight'],['Angela Hill',2763,"Women's Strawweight"],
      ['Neil Magny',2729,'Welterweight'],['Sean Strickland',2643,'Middleweight'],['Darren Elkins',2621,'Featherweight'],
      ['Georges St-Pierre',2591,'Welterweight'],['Rafael dos Anjos',2591,'Lightweight'],['Kamaru Usman',2564,'Welterweight'],['Nate Diaz',2487,'Welterweight']
    ])},
    'takedowns-landed':{label:'UFC takedowns landed',unit:'takedowns',family:'record-book',rows:rows([
      ['Merab Dvalishvili',119,'Bantamweight'],['Georges St-Pierre',90,'Welterweight'],['Gleison Tibau',84,'Lightweight'],
      ['Clay Guida',78,'Lightweight'],['Demetrious Johnson',74,'Flyweight'],['Frankie Edgar',73,'Featherweight'],
      ['Colby Covington',70,'Welterweight'],['Nik Lentz',69,'Featherweight'],['Demian Maia',68,'Welterweight'],['Rafael dos Anjos',68,'Lightweight']
    ])},
    'submission-attempts':{label:'UFC submission attempts',unit:'submission attempts',family:'record-book',rows:rows([
      ['Jim Miller',52,'Lightweight'],['Charles Oliveira',51,'Lightweight'],['Chris Lytle',31,'Welterweight'],
      ['Joe Lauzon',29,'Lightweight'],['Demian Maia',27,'Welterweight'],['Nate Diaz',26,'Welterweight'],
      ['Nik Lentz',26,'Featherweight'],['Darren Elkins',25,'Featherweight'],['Dustin Poirier',25,'Lightweight'],
      ['Matt Brown',24,'Welterweight'],['Georges St-Pierre',24,'Welterweight'],['Joe Stevenson',24,'Lightweight'],['Cole Miller',24,'Featherweight']
    ])},
    'control-time-minutes':{label:'UFC control time',unit:'minutes of control time',family:'record-book',rows:rows([
      ['Georges St-Pierre',162,'Welterweight'],['Clay Guida',156,'Lightweight'],['Demian Maia',155,'Welterweight'],
      ['Kamaru Usman',147,'Welterweight'],['Rafael dos Anjos',137,'Lightweight'],['Darren Elkins',129,'Featherweight'],
      ['Jon Fitch',128,'Welterweight'],['Randy Couture',127,'Heavyweight'],['Colby Covington',125,'Welterweight'],['Valentina Shevchenko',114,"Women's Flyweight"]
    ])},
    'fight-time-minutes':{label:'Total UFC fight time',unit:'minutes of UFC fight time',family:'record-book',rows:rows([
      ['Max Holloway',534,'Featherweight'],['Rafael dos Anjos',523,'Lightweight'],['Frankie Edgar',477,'Featherweight'],
      ['Jim Miller',453,'Lightweight'],['Neil Magny',443,'Welterweight'],['Angela Hill',433,"Women's Strawweight"],
      ['Clay Guida',423,'Lightweight'],['Andrei Arlovski',410,'Heavyweight'],['Demian Maia',410,'Welterweight'],['Jeremy Stephens',409,'Featherweight']
    ])},
    'active-wins':{label:'UFC wins by active fighters',unit:'UFC wins',family:'filtered',rows:rows([
      ['Jim Miller',28,'Lightweight'],['Charles Oliveira',25,'Lightweight'],['Max Holloway',24,'Featherweight'],['Neil Magny',24,'Welterweight'],
      ['Jon Jones',22,'Heavyweight'],['Dustin Poirier',22,'Lightweight'],['Rafael dos Anjos',21,'Lightweight'],['Derrick Lewis',20,'Heavyweight'],
      ['Darren Elkins',19,'Featherweight'],['Edson Barboza',18,'Featherweight'],['Robert Whittaker',18,'Middleweight'],
      ['Aljamain Sterling',18,'Featherweight'],['Sean Strickland',18,'Middleweight']
    ])},
    'welterweight-wins':{label:'UFC welterweight wins',unit:'UFC wins',family:'filtered',rows:rows([
      ['Neil Magny',24,'Welterweight'],['Georges St-Pierre',19,'Welterweight'],['Matt Brown',17,'Welterweight'],['Kamaru Usman',16,'Welterweight'],
      ['Vicente Luque',16,'Welterweight'],['Matt Hughes',15,'Welterweight'],['Thiago Alves',15,'Welterweight'],['Belal Muhammad',15,'Welterweight'],
      ['Josh Koscheck',14,'Welterweight'],['Robbie Lawler',14,'Welterweight'],['Leon Edwards',14,'Welterweight'],['Randy Brown',14,'Welterweight']
    ])},
    'bantamweight-wins':{label:'UFC bantamweight wins',unit:'UFC wins',family:'filtered',rows:rows([
      ['Aljamain Sterling',14,'Bantamweight'],['TJ Dillashaw',13,'Bantamweight'],['Marlon Vera',13,'Bantamweight'],['Merab Dvalishvili',13,'Bantamweight'],
      ['Raphael Assuncao',12,'Bantamweight'],['Sean O\'Malley',12,'Bantamweight'],['Petr Yan',12,'Bantamweight'],['Mario Bautista',12,'Bantamweight'],
      ['Urijah Faber',11,'Bantamweight'],['Rob Font',11,'Bantamweight']
    ])}
  };

  Object.values(METRICS).forEach(metric=>Object.freeze(metric.rows));
  window.UFC_FIND_LEADER_RECORD_BOOK={version:VERSION,source:SOURCE,metrics:METRICS};

  const MAIN_EVENT_VERSION='find-leader-main-events-20260717a-headliner-ledger';
  const FINISH_METHODS=new Set(['ko-tko','submission','doctor-stoppage']);
  const FORCED_MAIN_EVENTS=new Set([]);
  const FORCED_CO_MAINS=new Set([
    '2009-07-11-thiago-alves','2016-04-23-henry-cejudo','2016-12-30-ronda-rousey','2017-10-07-valentina-shevchenko',
    '2018-07-07-francis-ngannou','2018-08-04-demetrious-johnson-ii','2018-12-29-cris-cyborg','2019-07-06-holly-holm',
    '2019-12-14-germaine-de-randamie-ii','2019-12-14-alexander-volkanovski-i','2020-02-08-katlyn-chookagian',
    '2020-07-11-alexander-volkanovski-ii','2020-11-21-jennifer-maia','2021-03-06-megan-anderson','2021-09-25-lauren-murphy',
    '2021-12-11-julianna-pena-i','2022-04-09-chan-sung-jung','2022-07-02-alexander-volkanovski-iii'
  ]);
  const ALIASES={
    'donald cerrone':['cowboy'],'chan sung jung':['korean zombie'],'mauricio rua':['shogun'],'quinton jackson':['rampage'],
    'bobby green':['king green'],'georges st pierre':['gsp'],'antonio rodrigo nogueira':['minotauro']
  };
  const normal=value=>String(value||'').trim().toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const tokens=value=>normal(value).split(/\s+/).filter(Boolean);
  const nameKeys=value=>{
    const clean=normal(value);
    const parts=tokens(clean);
    const keys=new Set([clean,parts.at(-1),parts.slice(-2).join(' '),...(ALIASES[clean]||[]).map(normal)]);
    return [...keys].filter(Boolean);
  };
  const titlePair=event=>{
    const title=String(event||'');
    const colon=title.indexOf(':');
    if(colon<0)return null;
    const subtitle=title.slice(colon+1).replace(/\s+\d+\s*$/,'').trim();
    const parts=subtitle.split(/\s+vs\.?\s+/i).map(part=>part.trim()).filter(Boolean);
    return parts.length===2?parts:null;
  };
  const sameName=(full,short)=>{
    const left=nameKeys(full),right=nameKeys(short);
    return left.some(key=>right.includes(key)||right.some(other=>key.length>=4&&other.includes(key)));
  };
  const pairMatches=(record,fight,pair)=>Boolean(pair)&&(
    (sameName(record?.fighter,pair[0])&&sameName(fight?.opponent,pair[1]))||
    (sameName(record?.fighter,pair[1])&&sameName(fight?.opponent,pair[0]))
  );
  const isOfficialTitleFight=fight=>{
    const types=window.UFC_CANONICAL_FIGHTER_FACTS?.rules?.championshipTypes||{};
    return Boolean(types?.[fight?.championshipContext?.type]?.officialTitleFight)&&fight?.championshipContext?.fighterEligible!==false;
  };
  function isMainEvent(record,fight){
    if(!fight)return false;
    if(fight.mainEvent===true||FORCED_MAIN_EVENTS.has(fight.id))return true;
    if(fight.mainEvent===false||FORCED_CO_MAINS.has(fight.id))return false;
    const pair=titlePair(fight.event);
    if(pair)return pairMatches(record,fight,pair);
    if(isOfficialTitleFight(fight))return true;
    const event=normal(fight.event);
    if(Number(fight.scheduledRounds)===5&&(/ufc fight night|ufc on espn|ufc on fox|ufc live/.test(event)))return true;
    return false;
  }
  function valueFor(record,metric){
    const fights=Array.isArray(record?.fights)?record.fights:[];
    return fights.filter(fight=>{
      if(fight?.scoringDisposition!=='count-win'||!isMainEvent(record,fight))return false;
      if(metric==='main-event-wins')return true;
      if(metric==='main-event-finishes')return FINISH_METHODS.has(fight?.method?.category);
      return false;
    }).length;
  }
  function auditRecord(record){
    const fights=(Array.isArray(record?.fights)?record.fights:[]).filter(fight=>isMainEvent(record,fight));
    return {fighter:record?.fighter||'',mainEvents:fights.map(fight=>fight.id),wins:valueFor(record,'main-event-wins'),finishes:valueFor(record,'main-event-finishes')};
  }
  window.UFC_FIND_LEADER_MAIN_EVENTS={
    version:MAIN_EVENT_VERSION,method:'event-headliner-ledger',forcedMainEvents:[...FORCED_MAIN_EVENTS],forcedCoMains:[...FORCED_CO_MAINS],
    isMainEvent,valueFor,auditRecord
  };
  document.documentElement.setAttribute('data-find-leader-record-book',VERSION);
  document.documentElement.setAttribute('data-find-leader-main-events',MAIN_EVENT_VERSION);
})();
(function(){
  'use strict';

  const fullEvents = [
    {
      id: 'ufc-329-2026-07-11',
      name: 'UFC 329',
      subtitle: 'McGregor vs. Holloway 2',
      eventType: 'numbered',
      eventDate: '2026-07-11T16:00:00-05:00',
      location: 'Las Vegas, Nevada',
      cardRule: 'Full card',
      status: 'complete',
      sourceNote: 'Confirmed 14-fight card and final results.',
      fights: [
        { id:'ufc329-durden-costa', order:1, cardSection:'Early Prelims', weightClass:'Flyweight', red:'Cody Durden', blue:'Alessandro Costa', lockAt:'2026-07-11T15:45:00-05:00', winner:'Alessandro Costa', resultStatus:'complete', redOdds:205, blueOdds:-250, oddsSource:'MMA Mania odds snapshot', oddsUpdatedAt:'2026-07-08T22:11:00-05:00' },
        { id:'ufc329-gandra-reese', order:2, cardSection:'Early Prelims', weightClass:'Middleweight', red:'Ryan Gandra', blue:'Zach Reese', lockAt:'2026-07-11T16:15:00-05:00', winner:'Ryan Gandra', resultStatus:'complete', redOdds:-155, blueOdds:130, oddsSource:'MMA Mania odds snapshot', oddsUpdatedAt:'2026-07-08T22:11:00-05:00' },
        { id:'ufc329-basharat-garza', order:3, cardSection:'Early Prelims', weightClass:'Bantamweight', red:'Farid Basharat', blue:'John Garza', lockAt:'2026-07-11T16:45:00-05:00', winner:'Farid Basharat', resultStatus:'complete', redOdds:-600, blueOdds:440, oddsSource:'MMA Mania odds snapshot', oddsUpdatedAt:'2026-07-08T22:11:00-05:00' },
        { id:'ufc329-pinas-almeida', order:4, cardSection:'Early Prelims', weightClass:'Middleweight', red:'Damian Pinas', blue:'Cesar Almeida', lockAt:'2026-07-11T17:15:00-05:00', winner:'Damian Pinas', resultStatus:'complete', redOdds:-218, blueOdds:180, oddsSource:'MMA Mania odds snapshot', oddsUpdatedAt:'2026-07-08T22:11:00-05:00' },
        { id:'ufc329-cortez-wang', order:5, cardSection:'Early Prelims', weightClass:"Women's Flyweight", red:'Tracy Cortez', blue:'Wang Cong', lockAt:'2026-07-11T17:45:00-05:00', winner:'Wang Cong', resultStatus:'complete', redOdds:-110, blueOdds:-110, oddsSource:'MMA Mania odds snapshot', oddsUpdatedAt:'2026-07-08T22:11:00-05:00' },
        { id:'ufc329-riley-kamaka', order:6, cardSection:'Prelims', weightClass:'Featherweight', red:'Luke Riley', blue:'Kai Kamaka III', lockAt:'2026-07-11T18:15:00-05:00', winner:'Luke Riley', resultStatus:'complete', redOdds:-310, blueOdds:250, oddsSource:'MMA Mania odds snapshot', oddsUpdatedAt:'2026-07-08T22:11:00-05:00' },
        { id:'ufc329-garbrandt-yanez', order:7, cardSection:'Prelims', weightClass:'Bantamweight', red:'Cody Garbrandt', blue:'Adrian Yanez', lockAt:'2026-07-11T18:45:00-05:00', winner:'Adrian Yanez', resultStatus:'complete', redOdds:310, blueOdds:-395, oddsSource:'MMA Mania odds snapshot', oddsUpdatedAt:'2026-07-08T22:11:00-05:00' },
        { id:'ufc329-steveson-ellison', order:8, cardSection:'Prelims', weightClass:'Heavyweight', red:'Gable Steveson', blue:'Elisha Ellison', lockAt:'2026-07-11T19:15:00-05:00', winner:'Gable Steveson', resultStatus:'complete', redOdds:-3200, blueOdds:1400, oddsSource:'MMA Mania odds snapshot', oddsUpdatedAt:'2026-07-08T22:11:00-05:00' },
        { id:'ufc329-krylov-whittaker', order:9, cardSection:'Prelims', weightClass:'Light Heavyweight', red:'Nikita Krylov', blue:'Robert Whittaker', lockAt:'2026-07-11T19:45:00-05:00', winner:'Robert Whittaker', resultStatus:'complete', redOdds:164, blueOdds:-198, oddsSource:'MMA Mania odds snapshot', oddsUpdatedAt:'2026-07-08T22:11:00-05:00' },
        { id:'ufc329-green-mckinney', order:10, cardSection:'Main Card', weightClass:'Lightweight', red:'King Green', blue:'Terrance McKinney', lockAt:'2026-07-11T20:15:00-05:00', winner:'King Green', resultStatus:'complete', redOdds:140, blueOdds:-166, oddsSource:'MMA Mania odds snapshot', oddsUpdatedAt:'2026-07-08T22:11:00-05:00' },
        { id:'ufc329-royval-kavanagh', order:11, cardSection:'Main Card', weightClass:'Flyweight', red:'Brandon Royval', blue:"Lone'er Kavanagh", lockAt:'2026-07-11T20:45:00-05:00', winner:'Brandon Royval', resultStatus:'complete', redOdds:185, blueOdds:-235, oddsSource:'MMA Mania odds snapshot', oddsUpdatedAt:'2026-07-08T22:11:00-05:00' },
        { id:'ufc329-sandhagen-bautista', order:12, cardSection:'Main Card', weightClass:'Bantamweight', red:'Cory Sandhagen', blue:'Mario Bautista', lockAt:'2026-07-11T21:15:00-05:00', winner:'Mario Bautista', resultStatus:'complete', redOdds:-155, blueOdds:130, oddsSource:'MMA Mania odds snapshot', oddsUpdatedAt:'2026-07-08T22:11:00-05:00' },
        { id:'ufc329-saint-denis-pimblett', order:13, cardSection:'Co-Main Event', weightClass:'Lightweight', red:'Benoit Saint Denis', blue:'Paddy Pimblett', lockAt:'2026-07-11T21:45:00-05:00', winner:'Paddy Pimblett', resultStatus:'complete', redOdds:-155, blueOdds:130, oddsSource:'MMA Mania odds snapshot', oddsUpdatedAt:'2026-07-08T22:11:00-05:00' },
        { id:'ufc329-mcgregor-holloway', order:14, cardSection:'Main Event', weightClass:'Welterweight', red:'Conor McGregor', blue:'Max Holloway', lockAt:'2026-07-11T22:30:00-05:00', winner:'Max Holloway', resultStatus:'complete', redOdds:185, blueOdds:-225, oddsSource:'MMA Mania odds snapshot', oddsUpdatedAt:'2026-07-08T22:11:00-05:00' }
      ]
    },
    {
      id: 'ufc-oklahoma-city-2026-07-18',
      name: 'UFC Oklahoma City',
      subtitle: 'Du Plessis vs. Usman',
      eventType: 'fight-night',
      eventDate: '2026-07-18T19:00:00-05:00',
      location: 'Paycom Center · Oklahoma City, Oklahoma',
      cardRule: 'Main card only',
      status: 'complete',
      sourceNote: 'Confirmed 12-fight card and final results. Fight Night Picks include only the five-fight main card.',
      fights: [
        { id:'okc-elliott-anderson', order:1, cardSection:'Prelims', weightClass:'Featherweight', red:'Ezra Elliott', blue:'Damien Anderson', lockAt:'2026-07-18T16:00:00-05:00', winner:'Ezra Elliott', resultStatus:'complete' },
        { id:'okc-barbosa-melisano', order:2, cardSection:'Prelims', weightClass:"Women's Flyweight", red:'Dione Barbosa', blue:'Anna Melisano', lockAt:'2026-07-18T16:25:00-05:00', winner:'Dione Barbosa', resultStatus:'complete' },
        { id:'okc-hines-harris', order:3, cardSection:'Prelims', weightClass:'Heavyweight', red:'Alvin Hines', blue:'RJ Harris', lockAt:'2026-07-18T16:50:00-05:00', winner:'RJ Harris', resultStatus:'complete' },
        { id:'okc-coria-nicoll', order:4, cardSection:'Prelims', weightClass:'Flyweight', red:'Alden Coria', blue:'Stewart Nicoll', lockAt:'2026-07-18T17:15:00-05:00', winner:'Alden Coria', resultStatus:'complete' },
        { id:'okc-franco-rodrigues', order:5, cardSection:'Prelims', weightClass:'Light Heavyweight', red:'Felipe Franco', blue:'Levi Rodrigues Jr.', lockAt:'2026-07-18T17:40:00-05:00', winner:'Felipe Franco', resultStatus:'complete' },
        { id:'okc-lebosnoyani-ko', order:6, cardSection:'Prelims', weightClass:'Welterweight', red:'Jean-Paul Lebosnoyani', blue:'Seok Hyeon Ko', lockAt:'2026-07-18T18:05:00-05:00', winner:'Jean-Paul Lebosnoyani', resultStatus:'complete' },
        { id:'okc-delgado-bashi', order:7, cardSection:'Prelims', weightClass:'Featherweight', red:'Jose Miguel Delgado', blue:'Austin Bashi', lockAt:'2026-07-18T18:30:00-05:00', winner:'Jose Miguel Delgado', resultStatus:'complete' },
        { id:'okc-mcmillen-montes', order:8, cardSection:'Main Card', weightClass:'Featherweight', red:'Tommy McMillen', blue:'Alberto Montes', lockAt:'2026-07-18T19:00:00-05:00', winner:'Tommy McMillen', resultStatus:'complete', redOdds:-135, blueOdds:115, oddsSource:'UFC.com event snapshot', oddsUpdatedAt:'2026-07-18T18:30:00-05:00' },
        { id:'okc-ricci-kline', order:9, cardSection:'Main Card', weightClass:"Women's Strawweight", red:'Tabatha Ricci', blue:'Fatima Kline', lockAt:'2026-07-18T19:30:00-05:00', winner:'Fatima Kline', resultStatus:'complete', redOdds:350, blueOdds:-450, oddsSource:'UFC.com event snapshot', oddsUpdatedAt:'2026-07-18T18:30:00-05:00' },
        { id:'okc-hooper-ramirez', order:10, cardSection:'Main Card', weightClass:'Lightweight', red:'Chase Hooper', blue:'Mitch Ramirez', lockAt:'2026-07-18T20:00:00-05:00', winner:'Chase Hooper', resultStatus:'complete', redOdds:-350, blueOdds:275, oddsSource:'UFC.com event snapshot', oddsUpdatedAt:'2026-07-18T18:30:00-05:00' },
        { id:'okc-cannonier-duncan', order:11, cardSection:'Co-Main Event', weightClass:'Middleweight', red:'Jared Cannonier', blue:'Christian Leroy Duncan', lockAt:'2026-07-18T21:00:00-05:00', winner:'Christian Leroy Duncan', resultStatus:'complete', redOdds:290, blueOdds:-370, oddsSource:'UFC.com event snapshot', oddsUpdatedAt:'2026-07-18T18:30:00-05:00' },
        { id:'okc-du-plessis-usman', order:12, cardSection:'Main Event', weightClass:'Middleweight', red:'Dricus Du Plessis', blue:'Kamaru Usman', lockAt:'2026-07-18T21:45:00-05:00', winner:'Dricus Du Plessis', resultStatus:'complete', redOdds:-230, blueOdds:190, oddsSource:'UFC.com event snapshot', oddsUpdatedAt:'2026-07-18T18:30:00-05:00' }
      ]
    },
    {
      id: 'ufc-abu-dhabi-2026-07-25',
      name: 'UFC Fight Night',
      subtitle: 'Ankalaev vs. Guskov',
      eventType: 'fight-night',
      eventDate: '2026-07-25T12:00:00-04:00',
      location: 'Etihad Arena · Abu Dhabi, United Arab Emirates',
      cardRule: 'Main card only',
      status: 'upcoming',
      sourceNote: 'Externally maintained from UFC.com with MMA Mania as the fallback source. Full 13-fight card snapshot loaded July 16.',
      fights: [
        { id:'abu26-abdul-hussein-cody-gibson', order:1, cardSection:'Prelims', weightClass:'Bantamweight', red:'Abdul Hussein', blue:'Cody Gibson', lockAt:'2026-07-25T09:00:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'abu26-dustin-jacoby-muhammad-said', order:2, cardSection:'Prelims', weightClass:'Light Heavyweight', red:'Dustin Jacoby', blue:'Muhammad Said', lockAt:'2026-07-25T09:25:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'abu26-santiago-ponzinibbio-sam-patterson', order:3, cardSection:'Prelims', weightClass:'Welterweight', red:'Santiago Ponzinibbio', blue:'Sam Patterson', lockAt:'2026-07-25T09:50:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'abu26-nurullo-aliev-mike-davis', order:4, cardSection:'Prelims', weightClass:'Lightweight', red:'Nurullo Aliev', blue:'Mike Davis', lockAt:'2026-07-25T10:15:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'abu26-brendson-ribeiro-magomed-tuchalov', order:5, cardSection:'Prelims', weightClass:'Light Heavyweight', red:'Brendson Ribeiro', blue:'Magomed Tuchalov', lockAt:'2026-07-25T10:40:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'abu26-ismael-bonfim-axel-sola', order:6, cardSection:'Prelims', weightClass:'Lightweight', red:'Ismael Bonfim', blue:'Axel Sola', lockAt:'2026-07-25T11:05:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'abu26-valter-walker-thomas-petersen', order:7, cardSection:'Prelims', weightClass:'Heavyweight', red:'Valter Walker', blue:'Thomas Petersen', lockAt:'2026-07-25T11:30:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'abu26-saygid-izagakhmaev-abubakar-vagaev', order:8, cardSection:'Main Card', weightClass:'Welterweight', red:'Saygid Izagakhmaev', blue:'Abubakar Vagaev', lockAt:'2026-07-25T12:00:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'abu26-magomed-zaynukov-damian-rzepecki', order:9, cardSection:'Main Card', weightClass:'Lightweight', red:'Magomed Zaynukov', blue:'Damian Rzepecki', lockAt:'2026-07-25T12:30:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'abu26-islam-dulatov-wellington-turman', order:10, cardSection:'Main Card', weightClass:'Welterweight', red:'Islam Dulatov', blue:'Wellington Turman', lockAt:'2026-07-25T13:00:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'abu26-rizvan-kuniev-tyrell-fortune', order:11, cardSection:'Main Card', weightClass:'Heavyweight', red:'Rizvan Kuniev', blue:'Tyrell Fortune', lockAt:'2026-07-25T13:30:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'abu26-steve-erceg-ramazan-temirov', order:12, cardSection:'Co-Main Event', weightClass:'Flyweight', red:'Steve Erceg', blue:'Ramazan Temirov', lockAt:'2026-07-25T14:00:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'abu26-magomed-ankalaev-bogdan-guskov', order:13, cardSection:'Main Event', weightClass:'Light Heavyweight', red:'Magomed Ankalaev', blue:'Bogdan Guskov', lockAt:'2026-07-25T14:30:00-04:00', winner:null, resultStatus:'scheduled' }
      ]
    },
    {
      id: 'ufc-belgrade-2026-08-01',
      name: 'UFC Fight Night',
      subtitle: 'Medic vs. Rodriguez',
      eventType: 'fight-night',
      eventDate: '2026-08-01T13:00:00-04:00',
      location: 'Belgrade Arena · Belgrade, Serbia',
      cardRule: 'Main card only',
      status: 'upcoming',
      sourceNote: 'Externally maintained from UFC.com with MMA Mania as the fallback source. Current 12-fight snapshot includes Blachowicz vs. Stirling.',
      fights: [
        { id:'belgrade26-jovan-leka-max-gimenis', order:1, cardSection:'Prelims', weightClass:'Heavyweight', red:'Jovan Leka', blue:'Max Gimenis', lockAt:'2026-08-01T10:00:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'belgrade26-nina-milosevic-hailey-cowan', order:2, cardSection:'Prelims', weightClass:"Women's Bantamweight", red:'Nina Milosevic', blue:'Hailey Cowan', lockAt:'2026-08-01T10:25:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'belgrade26-mateusz-rebecki-kyle-prepolec', order:3, cardSection:'Prelims', weightClass:'Lightweight', red:'Mateusz Rebecki', blue:'Kyle Prepolec', lockAt:'2026-08-01T10:50:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'belgrade26-dennis-buzukja-bogdan-grad', order:4, cardSection:'Prelims', weightClass:'Featherweight', red:'Dennis Buzukja', blue:'Bogdan Grad', lockAt:'2026-08-01T11:15:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'belgrade26-mark-vologdin-josias-musasa', order:5, cardSection:'Prelims', weightClass:'Bantamweight', red:'Mark Vologdin', blue:'Josias Musasa', lockAt:'2026-08-01T11:40:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'belgrade26-oban-elliott-michael-oliveira', order:6, cardSection:'Prelims', weightClass:'Welterweight', red:'Oban Elliott', blue:'Michael Oliveira', lockAt:'2026-08-01T12:05:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'belgrade26-ludovit-klein-tofiq-musayev', order:7, cardSection:'Prelims', weightClass:'Lightweight', red:'Ludovit Klein', blue:'Tofiq Musayev', lockAt:'2026-08-01T12:30:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'belgrade26-vlasto-cepo-gilbert-urbina', order:8, cardSection:'Main Card', weightClass:'Middleweight', red:'Vlasto Cepo', blue:'Gilbert Urbina', lockAt:'2026-08-01T13:00:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'belgrade26-dusko-todorovic-robert-valentin', order:9, cardSection:'Main Card', weightClass:'Middleweight', red:'Dusko Todorovic', blue:'Robert Valentin', lockAt:'2026-08-01T13:30:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'belgrade26-aleksandar-rakic-marcin-tybura', order:10, cardSection:'Main Card', weightClass:'Heavyweight', red:'Aleksandar Rakic', blue:'Marcin Tybura', lockAt:'2026-08-01T14:00:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'belgrade26-jan-blachowicz-navajo-stirling', order:11, cardSection:'Co-Main Event', weightClass:'Light Heavyweight', red:'Jan Blachowicz', blue:'Navajo Stirling', lockAt:'2026-08-01T14:30:00-04:00', winner:null, resultStatus:'scheduled' },
        { id:'belgrade26-uros-medic-daniel-rodriguez', order:12, cardSection:'Main Event', weightClass:'Welterweight', red:'Uros Medic', blue:'Daniel Rodriguez', lockAt:'2026-08-01T15:00:00-04:00', winner:null, resultStatus:'scheduled' }
      ]
    }
  ];

  function normalizedSection(section){
    const value=String(section || '').toLowerCase();
    if(value.includes('main')) return 'Main Card';
    if(value.includes('prelim') && !value.includes('early')) return 'Prelims';
    return 'Early Prelims';
  }

  function isPickable(event,fight){
    if(event?.eventType==='numbered' || /full card/i.test(String(event?.cardRule || ''))) return true;
    return normalizedSection(fight?.cardSection)==='Main Card';
  }

  function scopedEvent(event){
    return {...event,fights:(event?.fights || []).filter(fight=>isPickable(event,fight))};
  }

  function pruneLocalPicks(event){
    if(!event?.id || !window.localStorage) return;
    const fights=new Map((event.fights || []).map(fight=>[fight.id,fight]));
    const picksKey=`ufc-picks:${event.id}:local-picks`;
    const lockKey=`ufc-picks:${event.id}:underdog-lock`;
    let picks={};
    try{ picks=JSON.parse(localStorage.getItem(picksKey) || '{}'); }
    catch(_error){ picks={}; }
    let changed=false;
    Object.entries(picks).forEach(([fightId,fighter])=>{
      const fight=fights.get(fightId);
      if(!fight || (fighter!==fight.red && fighter!==fight.blue)){
        delete picks[fightId];
        changed=true;
      }
    });
    if(changed) localStorage.setItem(picksKey,JSON.stringify(picks));
    const lockFightId=localStorage.getItem(lockKey);
    if(lockFightId && !picks[lockFightId]) localStorage.removeItem(lockKey);
  }

  function scopeEvents(events){
    return (Array.isArray(events) ? events : []).map(event=>{
      const scoped=scopedEvent(event);
      pruneLocalPicks(scoped);
      return scoped;
    });
  }

  window.UFC_PICKS_FULL_EVENTS=fullEvents;
  window.UFC_PICKS_SCOPE={isPickable,scopeEvents};
  window.UFC_PICKS_EVENTS=scopeEvents(fullEvents);

  const supabaseApi=window.supabase;
  if(supabaseApi?.createClient && !supabaseApi.__ufcPicksScopeWrapped){
    const createClient=supabaseApi.createClient.bind(supabaseApi);
    supabaseApi.createClient=(...args)=>{
      const client=createClient(...args);
      const rpc=client.rpc.bind(client);
      client.rpc=async(name,params,options)=>{
        const response=await rpc(name,params,options);
        if(name==='picks_public_events' && Array.isArray(response?.data)){
          response.data=scopeEvents(response.data);
        }
        return response;
      };
      return client;
    };
    supabaseApi.__ufcPicksScopeWrapped=true;
  }
})();

// Public browser credentials only. Never place a Supabase service-role key here.
window.UFC_SUPABASE_CONFIG = {
  url: 'https://hdkjwezaswhisxupxydc.supabase.co',
  anonKey: ['sb_publishable_','thQI0qVmK_zOMjlmSiITww_MgWO-RNi'].join('')
};

(function reconcileAbuDhabiMainCard(){
  'use strict';

  const EVENT_ID='ufc-abu-dhabi-2026-07-25';
  const SOURCE_NOTE='Live UFC.com card reconciliation · seven main-card fights · July 20';
  const canonical=[
    {id:'abu26-ismael-bonfim-axel-sola',order:6,cardSection:'Main Card',weightClass:'Lightweight',red:'Ismael Bonfim',blue:'Axel Sola',lockAt:'2026-07-25T12:00:00-04:00',winner:null,resultStatus:'scheduled'},
    {id:'abu26-saygid-izagakhmaev-abubakar-vagaev',order:7,cardSection:'Main Card',weightClass:'Welterweight',red:'Saygid Izagakhmaev',blue:'Abubakar Vagaev',lockAt:'2026-07-25T12:30:00-04:00',winner:null,resultStatus:'scheduled'},
    {id:'abu26-magomed-zaynukov-damian-rzepecki',order:8,cardSection:'Main Card',weightClass:'Lightweight',red:'Magomed Zaynukov',blue:'Damian Rzepecki',lockAt:'2026-07-25T13:00:00-04:00',winner:null,resultStatus:'scheduled'},
    {id:'abu26-islam-dulatov-wellington-turman',order:9,cardSection:'Main Card',weightClass:'Welterweight',red:'Islam Dulatov',blue:'Wellington Turman',lockAt:'2026-07-25T13:30:00-04:00',winner:null,resultStatus:'scheduled'},
    {id:'abu26-rizvan-kuniev-tyrell-fortune',order:10,cardSection:'Main Card',weightClass:'Heavyweight',red:'Rizvan Kuniev',blue:'Tyrell Fortune',lockAt:'2026-07-25T14:00:00-04:00',winner:null,resultStatus:'scheduled'},
    {id:'abu26-steve-erceg-ramazan-temirov',order:11,cardSection:'Co-Main Event',weightClass:'Flyweight',red:'Steve Erceg',blue:'Ramazan Temirov',lockAt:'2026-07-25T14:15:00-04:00',winner:null,resultStatus:'scheduled'},
    {id:'abu26-magomed-ankalaev-bogdan-guskov',order:12,cardSection:'Main Event',weightClass:'Light Heavyweight',red:'Magomed Ankalaev',blue:'Bogdan Guskov',lockAt:'2026-07-25T14:30:00-04:00',winner:null,resultStatus:'scheduled'}
  ];

  const clean=value=>String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'');
  const red=fight=>fight?.red || fight?.red_name || '';
  const blue=fight=>fight?.blue || fight?.blue_name || '';
  const key=fight=>[clean(red(fight)),clean(blue(fight))].sort().join('|');
  const section=fight=>fight?.cardSection || fight?.card_section || '';
  const isMain=fight=>String(section(fight)).toLowerCase().includes('main');
  const order=fight=>Number(fight?.order ?? fight?.bout_order ?? 0);
  const canonicalKeys=new Set(canonical.map(key));

  function applyCanonicalShape(live,row){
    const merged={...row,...live,id:live?.id || row.id,order:row.order};
    if(Object.prototype.hasOwnProperty.call(live || {},'bout_order')) merged.bout_order=row.order;
    if(Object.prototype.hasOwnProperty.call(live || {},'card_section') && !Object.prototype.hasOwnProperty.call(live || {},'cardSection')){
      merged.card_section=row.cardSection;
      delete merged.cardSection;
    }else{
      merged.cardSection=row.cardSection;
    }
    return merged;
  }

  function canonicalMain(liveFights){
    const byMatchup=new Map((Array.isArray(liveFights) ? liveFights : []).map(fight=>[key(fight),fight]));
    return canonical.map(row=>applyCanonicalShape(byMatchup.get(key(row)),row));
  }

  function reconcileFullEvent(event){
    if(event?.id!==EVENT_ID) return event;
    const fights=Array.isArray(event.fights) ? event.fights : [];
    const prelims=fights.filter(fight=>!canonicalKeys.has(key(fight)) && !isMain(fight));
    return {...event,sourceNote:SOURCE_NOTE,fights:[...prelims,...canonicalMain(fights)].sort((left,right)=>order(left)-order(right))};
  }

  function reconcilePublicEvent(event){
    if(event?.id!==EVENT_ID) return event;
    return {...event,sourceNote:SOURCE_NOTE,source_note:SOURCE_NOTE,fights:canonicalMain(event.fights)};
  }

  if(Array.isArray(window.UFC_PICKS_FULL_EVENTS)){
    window.UFC_PICKS_FULL_EVENTS=window.UFC_PICKS_FULL_EVENTS.map(reconcileFullEvent);
    window.UFC_PICKS_EVENTS=window.UFC_PICKS_SCOPE?.scopeEvents
      ? window.UFC_PICKS_SCOPE.scopeEvents(window.UFC_PICKS_FULL_EVENTS)
      : window.UFC_PICKS_FULL_EVENTS.map(reconcilePublicEvent);
  }

  const supabaseApi=window.supabase;
  if(supabaseApi?.createClient && !supabaseApi.__ufcSevenFightMainCardWrapped){
    const createClient=supabaseApi.createClient.bind(supabaseApi);
    supabaseApi.createClient=(...args)=>{
      const client=createClient(...args);
      const rpc=client.rpc.bind(client);
      client.rpc=async(name,params,options)=>{
        const response=await rpc(name,params,options);
        if(name==='picks_public_events' && Array.isArray(response?.data)){
          response.data=response.data.map(reconcilePublicEvent);
        }
        return response;
      };
      return client;
    };
    supabaseApi.__ufcSevenFightMainCardWrapped=true;
  }
})();

(function loadPicksAutoAdvance(){
  if(document.querySelector('script[data-picks-auto-advance]')) return;
  const script=document.createElement('script');
  script.src='assets/js/picks-auto-advance.js?v=picks-auto-advance-20260719b-legacy-owner-recovery';
  script.dataset.picksAutoAdvance='true';
  document.head.appendChild(script);
})();
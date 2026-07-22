import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const CONFIG_PATH=process.env.UFC_CARD_SOURCES_FILE || path.join(ROOT,'config','ufc-card-sources.json');
const EVENTS_PATH=process.env.UFC_PICKS_EVENTS_FILE || path.join(ROOT,'assets','data','picks-events.js');
const OUTPUT_DIR=process.env.UFC_CARD_SYNC_ARTIFACT_DIR || path.join(ROOT,'artifacts','ufc-card-sync');
const APPLY=process.argv.includes('--apply');
const FORCE=process.argv.includes('--force');
const ENDPOINT=process.env.CARD_SYNC_ENDPOINT || '';
const SECRET=process.env.CARD_SYNC_SECRET || '';

fs.mkdirSync(OUTPUT_DIR,{recursive:true});

function normalizeSpace(value){
  return String(value || '').replace(/\s+/g,' ').trim();
}

function normalizeName(value){
  return normalizeSpace(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .toLowerCase()
    .replace(/\b(jr|sr|ii|iii|iv)\b/g,'')
    .replace(/[^a-z0-9]+/g,'')
    .trim();
}

function matchupKey(first,second){
  return [normalizeName(first),normalizeName(second)].sort().join('|');
}

function isMainSection(value){
  return String(value || '').toLowerCase().includes('main');
}

function expectedMainCount(config){
  if(config.eventType==='numbered' || /full card/i.test(String(config.cardRule || ''))) return 0;
  const count=Number(config.mainCardFightCount);
  if(!Number.isInteger(count) || count<1) throw new Error(`Missing valid mainCardFightCount for ${config.eventId}`);
  return count;
}

function loadMaintainedEvents(){
  const store=new Map();
  const localStorage={
    getItem:key=>store.has(key)?store.get(key):null,
    setItem:(key,value)=>store.set(key,String(value)),
    removeItem:key=>store.delete(key)
  };
  const window={localStorage,dispatchEvent:()=>{},supabase:null};
  const sandbox={
    window,
    localStorage,
    CustomEvent:class CustomEvent{constructor(type,options={}){this.type=type;this.detail=options.detail;}},
    Date,
    console
  };
  vm.runInNewContext(fs.readFileSync(EVENTS_PATH,'utf8'),sandbox,{filename:EVENTS_PATH,timeout:5000});
  const events=window.UFC_PICKS_FULL_EVENTS;
  if(!Array.isArray(events) || !events.length) throw new Error('Maintained Picks event file did not publish UFC_PICKS_FULL_EVENTS');
  return events;
}

function maintainedSnapshot(config,event){
  const fights=(event.fights || []).map(fight=>({
    id:String(fight.id || ''),
    bout_order:Number(fight.order ?? fight.bout_order),
    card_section:normalizeSpace(fight.cardSection || fight.card_section),
    weight_class:normalizeSpace(fight.weightClass || fight.weight_class),
    red_name:normalizeSpace(fight.red || fight.red_name),
    blue_name:normalizeSpace(fight.blue || fight.blue_name),
    lock_at:new Date(fight.lockAt || fight.lock_at).toISOString()
  }));
  const failures=[];
  if(fights.length<Number(config.minFights || 5)) failures.push(`too-few-fights:${fights.length}`);
  if(fights.some(fight=>!fight.id||!fight.red_name||!fight.blue_name||!fight.card_section||!fight.weight_class||!Number.isFinite(fight.bout_order)||!Number.isFinite(new Date(fight.lock_at).getTime()))) failures.push('incomplete-fight-row');
  const pairs=new Set(fights.map(fight=>matchupKey(fight.red_name,fight.blue_name)));
  if(pairs.size!==fights.length) failures.push('duplicate-matchups');
  const mainCount=fights.filter(fight=>isMainSection(fight.card_section)).length;
  const requiredMain=expectedMainCount(config);
  if(requiredMain && mainCount!==requiredMain) failures.push(`main-card-count-mismatch:${mainCount}!=${requiredMain}`);
  const expected=config.expectedMainEvent || [];
  if(expected.length===2 && !fights.some(fight=>matchupKey(fight.red_name,fight.blue_name)===matchupKey(expected[0],expected[1]))) failures.push('expected-main-event-missing');
  if(failures.length) throw new Error(`Maintained baseline validation failed for ${config.eventId}: ${failures.join(', ')}`);

  const snapshot={
    sourceType:'maintained-repo',
    sourceUrl:'repository:assets/data/picks-events.js',
    observedAt:new Date().toISOString(),
    event:{
      id:config.eventId,
      name:config.name,
      subtitle:config.subtitle,
      event_type:config.eventType,
      event_date:config.eventDate,
      location:config.location,
      card_rule:config.cardRule,
      status:config.status,
      source_note:`Maintained repository baseline from assets/data/picks-events.js at ${new Date().toISOString()}`
    },
    fights
  };
  const confirmationHash=createHash('sha256').update(JSON.stringify(fights.map(fight=>({
    pair:matchupKey(fight.red_name,fight.blue_name),
    section:fight.card_section,
    order:fight.bout_order,
    weight:fight.weight_class,
    lock:fight.lock_at
  })))).digest('hex');
  return {...snapshot,confirmed:true,confirmationHash};
}

async function postSnapshot(snapshot,config){
  if(!APPLY) return {dryRun:true};
  if(!ENDPOINT || !SECRET) throw new Error('CARD_SYNC_ENDPOINT and CARD_SYNC_SECRET are required with --apply');
  const response=await fetch(ENDPOINT,{
    method:'POST',
    headers:{'content-type':'application/json','x-card-sync-secret':SECRET},
    body:JSON.stringify({
      ...snapshot,
      validation:{
        minFights:Number(config.minFights || 5),
        expectedMainEvent:config.expectedMainEvent || [],
        expectedMainCardFights:expectedMainCount(config)
      }
    })
  });
  const text=await response.text();
  let body;
  try{body=JSON.parse(text);}catch(_error){body={raw:text};}
  if(!response.ok) throw new Error(`Supabase maintained baseline failed (${response.status}): ${JSON.stringify(body)}`);
  return body;
}

async function main(){
  const configs=JSON.parse(fs.readFileSync(CONFIG_PATH,'utf8')).events || [];
  const maintained=loadMaintainedEvents();
  const byId=new Map(maintained.map(event=>[event.id,event]));
  const now=Date.now();
  const active=configs.filter(event=>FORCE || !event.syncUntil || now<new Date(event.syncUntil).getTime());
  const report=[];
  for(const config of active){
    const event=byId.get(config.eventId);
    if(!event) throw new Error(`No maintained Picks baseline exists for ${config.eventId}`);
    const snapshot=maintainedSnapshot(config,event);
    const result=await postSnapshot(snapshot,config);
    report.push({
      eventId:config.eventId,
      sourceType:snapshot.sourceType,
      fights:snapshot.fights.length,
      mainCardFights:snapshot.fights.filter(fight=>isMainSection(fight.card_section)).length,
      confirmationHash:snapshot.confirmationHash,
      applied:APPLY,
      result
    });
  }
  fs.writeFileSync(path.join(OUTPUT_DIR,'maintained-baseline-report.json'),JSON.stringify({generatedAt:new Date().toISOString(),report},null,2)+'\n');
  console.log(JSON.stringify({maintainedBaselines:report},null,2));
}

main().catch(error=>{
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});

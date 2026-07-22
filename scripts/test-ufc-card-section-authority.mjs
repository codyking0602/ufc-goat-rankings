import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {buildReconciliationPlan,isAuthoritativeSource,isPickable} from '../supabase/functions/sync-ufc-card/reconciliation.mjs';
import {parseMmaManiaText} from './sync-ufc-card.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const event={event_type:'fight-night',card_rule:'Main card only'};
const wrongCard=[
  {
    id:'abu26-valter-walker-thomas-petersen',
    bout_order:6,
    card_section:'Main Card',
    weight_class:'Heavyweight',
    red_name:'Valter Walker',
    blue_name:'Thomas Petersen',
    lock_at:'2026-07-25T16:00:00.000Z',
    result_status:'scheduled'
  },
  {
    id:'abu26-ismael-bonfim-axel-sola',
    bout_order:7,
    card_section:'Main Card',
    weight_class:'Lightweight',
    red_name:'Ismael Bonfim',
    blue_name:'Axel Sola',
    lock_at:'2026-07-25T16:30:00.000Z',
    result_status:'scheduled'
  }
];

const mmaManiaCard=[
  {...wrongCard[0],bout_order:7,card_section:'Prelims',lock_at:'2026-07-25T15:30:00.000Z'},
  {...wrongCard[1],bout_order:6,card_section:'Prelims',lock_at:'2026-07-25T15:05:00.000Z'}
];

const mmaPlan=buildReconciliationPlan(wrongCard,mmaManiaCard,event,'mma-mania');
assert.equal(mmaPlan.authoritative,true);
assert.equal(mmaPlan.actions.length,2);
const walker=mmaPlan.actions.find((action)=>action.previous.id.includes('walker'));
const sola=mmaPlan.actions.find((action)=>action.previous.id.includes('bonfim'));
assert.equal(walker.incoming.card_section,'Prelims','MMA Mania must demote Walker-Petersen');
assert.equal(walker.demoted,true);
assert.equal(sola.incoming.card_section,'Prelims','MMA Mania must demote Bonfim-Sola');
assert.equal(sola.demoted,true);
assert.equal(isPickable(event,walker.incoming),false);
assert.equal(isPickable(event,sola.incoming),false);

const maintainedSeed=buildReconciliationPlan([],mmaManiaCard,event,'maintained-repo');
assert.equal(maintainedSeed.authoritative,true);
assert.equal(maintainedSeed.actions.filter((action)=>action.type==='insert').length,2);
assert.equal(isAuthoritativeSource('maintained-repo'),true);
assert.equal(isAuthoritativeSource('mma-mania'),true);
assert.equal(isAuthoritativeSource('official-ufc'),false);

const mmaFixture=`
UFC Abu Dhabi Main Event On Paramount+:
205 lbs.: Magomed Ankalaev vs. Bogdan Guskov
UFC Abu Dhabi Main Card On Paramount+:
125 lbs.: Steve Erceg vs. Ramazan Temirov
265 lbs.: Rizvan Kuniev vs. Tyrell Fortune
170 lbs.: Islam Dulatov vs. Wellington Turman
155 lbs.: Magomed Zaynukov vs. Damian Rzepecki
170 lbs.: Saygid Izagakhmaev vs. Abubakar Vagaev
UFC Abu Dhabi ‘Prelims’ Card On Paramount+:
265 lbs.: Valter Walker vs. Thomas Petersen
155 lbs.: Ismael Bonfim vs. Axel Sola
205 lbs.: Brendson Ribeiro vs. Magomed Tuchalov
155 lbs.: Nurullo Aliev vs. Mike Davis
170 lbs.: Santiago Ponzinibbio vs. Sam Patterson
205 lbs.: Dustin Jacoby vs. Muhammad Said
135 lbs.: Abdul Hussein vs. Cody Gibson
`;
const parsedFixture=parseMmaManiaText(mmaFixture);
assert.equal(parsedFixture.length,13);
assert.equal(parsedFixture.filter((fight)=>fight.card_section==='Main Event').length,1);
assert.equal(parsedFixture.filter((fight)=>fight.card_section==='Main Card').length,5);
assert.equal(parsedFixture.filter((fight)=>fight.card_section==='Prelims').length,7);
assert.equal(parsedFixture.find((fight)=>fight.red_name==='Valter Walker').card_section,'Prelims');
assert.equal(parsedFixture.find((fight)=>fight.red_name==='Ismael Bonfim').card_section,'Prelims');

const belgradeFixture=`
UFC Belgrade Main Event on Paramount+:
170 lbs.: Uros Medic vs. Daniel Rodriguez
UFC Belgrade Main Card on Paramount+:
265 lbs.: Marcin Tybura vs. Aleksandar Rakic
265 lbs.: Ante Delija vs. Johnny Walker
205 lbs.: Jan Błachowicz vs. Bogdan Guskov 2
UFC Belgrade Preliminary Card on Paramount+:
265 lbs.: Jovan Leka vs. Max Gimenis
185 lbs.: Vlasto Cepo vs. Gilbert Urbina
185 lbs.: Dusko Todorovic vs. Robert Valentin
155 lbs.: Ludovit Klein vs. Tofiq Musayev
170 lbs.: Oban Elliott vs. Michael Oliveira
`;
const parsedBelgrade=parseMmaManiaText(belgradeFixture);
assert.equal(parsedBelgrade.length,9);
assert.equal(parsedBelgrade.filter((fight)=>fight.card_section==='Main Event').length,1);
assert.equal(parsedBelgrade.filter((fight)=>fight.card_section==='Main Card').length,3);
assert.equal(parsedBelgrade.filter((fight)=>fight.card_section==='Prelims').length,5);

const config=JSON.parse(fs.readFileSync(path.join(ROOT,'config','ufc-card-sources.json'),'utf8'));
for(const configuredEvent of config.events){
  assert.equal('official' in configuredEvent,false,`${configuredEvent.eventId} must not configure UFC.com`);
  assert.ok(Array.isArray(configuredEvent.fallbackSources)&&configuredEvent.fallbackSources.length===1);
  assert.ok(configuredEvent.fallbackSources.every((source)=>source.type==='mma-mania'));
  assert.ok(configuredEvent.fallbackSources.every((source)=>new URL(source.url).hostname.endsWith('mmamania.com')));
}
const abuConfig=config.events.find((item)=>item.eventId==='ufc-abu-dhabi-2026-07-25');
const belgradeConfig=config.events.find((item)=>item.eventId==='ufc-belgrade-2026-08-01');
assert.equal(abuConfig.mainCardFightCount,6);
assert.equal(belgradeConfig.mainCardFightCount,4);

const eventsCode=fs.readFileSync(path.join(ROOT,'assets','data','picks-events.js'),'utf8');
const store=new Map();
const localStorage={getItem:(key)=>store.get(key)||null,setItem:(key,value)=>store.set(key,String(value)),removeItem:(key)=>store.delete(key)};
const window={localStorage,dispatchEvent:()=>{},supabase:null};
vm.runInNewContext(eventsCode,{window,localStorage,CustomEvent:class CustomEvent{},Date,console},{timeout:5000});
const abu=window.UFC_PICKS_FULL_EVENTS.find((item)=>item.id==='ufc-abu-dhabi-2026-07-25');
const belgrade=window.UFC_PICKS_FULL_EVENTS.find((item)=>item.id==='ufc-belgrade-2026-08-01');
assert.equal(abu.fights.length,13);
assert.equal(abu.fights.filter((fight)=>String(fight.cardSection).includes('Main')).length,6);
assert.equal(abu.fights.find((fight)=>fight.id==='abu26-valter-walker-thomas-petersen').cardSection,'Prelims');
assert.equal(abu.fights.find((fight)=>fight.id==='abu26-ismael-bonfim-axel-sola').cardSection,'Prelims');
assert.ok(abu.fights.some((fight)=>fight.id==='abu26-abdul-hussein-cody-gibson'));
assert.ok(abu.fights.some((fight)=>fight.id==='abu26-dustin-jacoby-muhammad-said'));
assert.equal(belgrade.fights.length,9);
assert.equal(belgrade.fights.filter((fight)=>String(fight.cardSection).includes('Main')).length,4);
assert.ok(belgrade.fights.some((fight)=>fight.id==='belgrade26-ante-delija-johnny-walker'));
assert.ok(belgrade.fights.some((fight)=>fight.id==='belgrade26-jan-blachowicz-bogdan-guskov'));
assert.equal(belgrade.fights.some((fight)=>fight.id==='belgrade26-jan-blachowicz-navajo-stirling'),false);

const scraper=fs.readFileSync(path.join(ROOT,'scripts','sync-ufc-card.mjs'),'utf8');
assert.equal(scraper.includes('official-ufc'),false,'UFC.com must not participate in the scraper');
assert.equal(scraper.includes('ufc.com'),false,'the scraper must not contain a UFC.com URL or host');
assert.equal(scraper.includes('chooseMainWindow'),false,'count-based main-card window inference must stay deleted');
assert.match(scraper,/main-card-count-mismatch:\$\{mainCount\}!=\$\{requiredMain\}/,'main-card count must reject instead of rewrite');
assert.match(scraper,/parseMmaManiaText/,'MMA Mania parser must remain the active external parser');
assert.match(scraper,/Two MMA Mania captures disagreed/,'two matching MMA Mania captures must be required');

const baselineScript=fs.readFileSync(path.join(ROOT,'scripts','apply-maintained-ufc-baselines.mjs'),'utf8');
assert.match(baselineScript,/UFC_PICKS_FULL_EVENTS/);
assert.match(baselineScript,/sourceType:'maintained-repo'/);
assert.match(baselineScript,/main-card-count-mismatch/);

const edgeFunction=fs.readFileSync(path.join(ROOT,'supabase','functions','sync-ufc-card','index.ts'),'utf8');
assert.match(edgeFunction,/ALLOWED_SOURCE_HOSTS = new Set\(\["mmamania\.com", "www\.mmamania\.com"\]\)/);
assert.equal(edgeFunction.includes('official-ufc'),false,'UFC.com must not participate in automated reconciliation');
assert.match(edgeFunction,/MMA Mania already owns this event's card slots/);
assert.match(edgeFunction,/slot-authority=/);

const recurringWorkflow=fs.readFileSync(path.join(ROOT,'.github','workflows','refresh-ufc-odds.yml'),'utf8');
assert.equal(/^\s*push:\s*$/m.test(recurringWorkflow),false,'the recurring owner must not race deployments with a push trigger');
assert.match(recurringWorkflow,/schedule:\s*\n\s*- cron: '17 \*\/6 \* \* \*'/,'the six-hour recurring owner must remain scheduled');
const baselineStep=recurringWorkflow.indexOf('Apply maintained repository card baseline');
const externalStep=recurringWorkflow.indexOf('Sync confirmed external UFC card');
assert.ok(baselineStep>=0&&externalStep>baselineStep,'maintained baseline must run before MMA Mania capture');

const deployWorkflow=fs.readFileSync(path.join(ROOT,'.github','workflows','deploy-ufc-odds-refresh.yml'),'utf8');
const deployFunctionStep=deployWorkflow.indexOf('Deploy card reconciliation function');
const deployBaselineStep=deployWorkflow.indexOf('Apply maintained repository card baseline');
assert.ok(deployFunctionStep>=0&&deployBaselineStep>deployFunctionStep,'deployment must install the Edge policy before applying the baseline');
assert.match(deployWorkflow,/Record deployed UFC card health \[skip ci\]/,'deployment must publish card reconciliation evidence');

console.log('MMA Mania card authority, Abu Dhabi, and Belgrade checks passed.');

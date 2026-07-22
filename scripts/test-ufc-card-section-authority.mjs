import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildReconciliationPlan,isAuthoritativeSource} from '../supabase/functions/sync-ufc-card/reconciliation.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const event={event_type:'fight-night',card_rule:'Main card only'};
const baseline=[
  {
    id:'abu26-valter-walker-thomas-petersen',
    bout_order:5,
    card_section:'Prelims',
    weight_class:'Heavyweight',
    red_name:'Valter Walker',
    blue_name:'Thomas Petersen',
    lock_at:'2026-07-25T15:00:00.000Z',
    result_status:'scheduled'
  },
  {
    id:'abu26-ismael-bonfim-axel-sola',
    bout_order:6,
    card_section:'Main Card',
    weight_class:'Lightweight',
    red_name:'Ismael Bonfim',
    blue_name:'Axel Sola',
    lock_at:'2026-07-25T16:00:00.000Z',
    result_status:'scheduled'
  }
];

const staleFallback=[
  {...baseline[0],bout_order:6,card_section:'Main Card',lock_at:'2026-07-25T16:00:00.000Z'},
  {...baseline[1],bout_order:5,card_section:'Prelims',lock_at:'2026-07-25T15:00:00.000Z'}
];

const fallbackPlan=buildReconciliationPlan(baseline,staleFallback,event,'mma-mania');
assert.equal(fallbackPlan.authoritative,false);
assert.equal(fallbackPlan.actions.length,2);
const walker=fallbackPlan.actions.find((action)=>action.previous.id.includes('walker'));
const sola=fallbackPlan.actions.find((action)=>action.previous.id.includes('bonfim'));
assert.equal(walker.incoming.card_section,'Prelims','fallback must not promote Walker-Petersen');
assert.equal(walker.incoming.bout_order,5,'fallback must not reorder Walker-Petersen');
assert.equal(walker.incoming.lock_at,baseline[0].lock_at,'fallback must preserve Walker-Petersen lock time');
assert.equal(sola.incoming.card_section,'Main Card','fallback must not demote Bonfim-Sola');
assert.equal(sola.incoming.bout_order,6,'fallback must not reorder Bonfim-Sola');
assert.equal(sola.incoming.lock_at,baseline[1].lock_at,'fallback must preserve Bonfim-Sola lock time');
assert.equal(fallbackPlan.actions.some((action)=>action.promoted || action.demoted),false);

assert.throws(
  ()=>buildReconciliationPlan(baseline,[...staleFallback,{...baseline[0],id:'new-slot',red_name:'New Fighter'}],event,'mma-mania'),
  /cannot add or remove fight slots/
);
assert.throws(
  ()=>buildReconciliationPlan(baseline,staleFallback.slice(0,1),event,'mma-mania'),
  /cannot add or remove fight slots/
);
assert.throws(
  ()=>buildReconciliationPlan([],staleFallback,event,'mma-mania'),
  /cannot establish an event/
);

const maintainedRepair=buildReconciliationPlan(staleFallback,baseline,event,'maintained-repo');
assert.equal(maintainedRepair.authoritative,true);
assert.equal(maintainedRepair.actions.find((action)=>action.previous.id.includes('walker')).incoming.card_section,'Prelims');
assert.equal(maintainedRepair.actions.find((action)=>action.previous.id.includes('walker')).demoted,true);
assert.equal(maintainedRepair.actions.find((action)=>action.previous.id.includes('bonfim')).incoming.card_section,'Main Card');
assert.equal(maintainedRepair.actions.find((action)=>action.previous.id.includes('bonfim')).promoted,true);
const maintainedSeed=buildReconciliationPlan([],baseline,event,'maintained-repo');
assert.equal(maintainedSeed.authoritative,true);
assert.equal(maintainedSeed.actions.filter((action)=>action.type==='insert').length,2);
assert.equal(isAuthoritativeSource('maintained-repo'),true);
assert.equal(isAuthoritativeSource('official-ufc'),true);
assert.equal(isAuthoritativeSource('mma-mania'),false);

const officialPlan=buildReconciliationPlan(baseline,staleFallback,event,'official-ufc');
assert.equal(officialPlan.authoritative,true);
assert.equal(officialPlan.actions.find((action)=>action.previous.id.includes('walker')).incoming.card_section,'Main Card');
assert.equal(officialPlan.actions.find((action)=>action.previous.id.includes('bonfim')).incoming.card_section,'Prelims');

const scraper=fs.readFileSync(path.join(ROOT,'scripts','sync-ufc-card.mjs'),'utf8');
assert.equal(scraper.includes('chooseMainWindow'),false,'count-based main-card window inference must stay deleted');
assert.equal(scraper.includes("if(!fight.card_section) fight.card_section='Prelims'"),false,'unknown sections must not default to prelims');
assert.match(scraper,/main-card-count-mismatch:\$\{mainCount\}!=\$\{requiredMain\}/,'main-card count must reject instead of rewrite');
assert.match(scraper,/pair===expectedKey && isMainSection\(section\)/,'expected main event may only refine an already-main row');

const baselineScript=fs.readFileSync(path.join(ROOT,'scripts','apply-maintained-ufc-baselines.mjs'),'utf8');
assert.match(baselineScript,/UFC_PICKS_FULL_EVENTS/);
assert.match(baselineScript,/sourceType:'maintained-repo'/);
assert.match(baselineScript,/main-card-count-mismatch/);

const edgeFunction=fs.readFileSync(path.join(ROOT,'supabase','functions','sync-ufc-card','index.ts'),'utf8');
assert.match(edgeFunction,/buildReconciliationPlan\(existing, incomingFights, event, body\.sourceType\)/);
assert.match(edgeFunction,/slot-authority=/);
assert.match(edgeFunction,/UFC\.com already owns this event's card slots/);
assert.match(edgeFunction,/sectionAuthority/);

const recurringWorkflow=fs.readFileSync(path.join(ROOT,'.github','workflows','refresh-ufc-odds.yml'),'utf8');
assert.equal(/^\s*push:\s*$/m.test(recurringWorkflow),false,'the recurring owner must not race deployments with a push trigger');
assert.match(recurringWorkflow,/schedule:\s*\n\s*- cron: '17 \*\/6 \* \* \*'/,'the six-hour recurring owner must remain scheduled');
const baselineStep=recurringWorkflow.indexOf('Apply maintained repository card baseline');
const externalStep=recurringWorkflow.indexOf('Sync confirmed external UFC card');
assert.ok(baselineStep>=0&&externalStep>baselineStep,'maintained baseline must run before external card capture');

const deployWorkflow=fs.readFileSync(path.join(ROOT,'.github','workflows','deploy-ufc-odds-refresh.yml'),'utf8');
const deployFunctionStep=deployWorkflow.indexOf('Deploy card reconciliation function');
const deployBaselineStep=deployWorkflow.indexOf('Apply maintained repository card baseline');
assert.ok(deployFunctionStep>=0&&deployBaselineStep>deployFunctionStep,'deployment must install the Edge policy before applying the baseline');
assert.match(deployWorkflow,/Record deployed UFC card health \[skip ci\]/,'deployment must publish card reconciliation evidence');

console.log('UFC card section authority, maintained baseline, and workflow order checks passed.');

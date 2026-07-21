import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const index=read('index.html');
const bootstrap=read('assets/js/production-ranking-bootstrap.js');
const profile=read('assets/js/calculated-profile-runtime.js');
const stability=read('assets/js/native-app-shell-stability.js');

const loaded=[...index.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)]
  .map(match=>match[1].split('?')[0]);
const bootstrapPath='assets/js/production-ranking-bootstrap.js';
const stabilityPath='assets/js/native-app-shell-stability.js';
const bootstrapPosition=loaded.indexOf(bootstrapPath);
const stabilityPosition=loaded.indexOf(stabilityPath);

assert(bootstrapPosition>=0,'The production ranking bootstrap must remain production-loaded.');
assert(stabilityPosition>bootstrapPosition,'The stability layer must remain subordinate to calculated ranking startup.');
assert.match(bootstrap,/assets\/js\/calculated-profile-runtime\.js/,'The production bootstrap must load the calculated profile owner.');
assert.match(bootstrap,/if\(!window\.UFC_CALCULATED_PROFILE_RUNTIME\)missing\.push\('calculated profile runtime'\)/,'Production readiness must require the calculated profile owner.');
assert(bootstrap.indexOf('assets/js/calculated-profile-runtime.js')<bootstrap.indexOf('function publishReady'),'The calculated profile owner must load before production readiness is published.');

assert.match(profile,/window\.openFighter=function\(name\)/,'The calculated profile runtime must retain fighter-profile render ownership.');
assert.match(profile,/function\s+snapshotFor\s*\(/,'The calculated profile runtime must retain Resume Snapshot construction.');
assert.match(profile,/snapshotOwner:'RANKING_DATA\.visibleStats'/,'The calculated profile runtime must explicitly publish snapshot ownership.');
assert.match(profile,/streakOwner:'UFC_CANONICAL_FIGHTER_FACTS\.fights with calculated-row fallback'/,'The canonical profile owner must retain the win-streak fallback boundary.');
assert.match(profile,/detail\.innerHTML=`/,'The canonical profile owner must retain the single profile DOM write.');
for(const label of ['UFC Record','UFC Title-Fight Wins','Top-5 Wins','Prime UFC Record','Finish Rate','Rounds Won','Active Elite Years','Longest UFC Win Streak']){
  assert(profile.includes(`['${label}'`),`The canonical profile snapshot lost ${label}.`);
}

assert.doesNotMatch(stability,/repairSnapshot|snapshotValues|canonicalFighterName|profileFor|titleFightWins|topFiveWins|roundsWonPct/,'The stability layer must not retain calculated profile helpers or a second snapshot writer.');
assert.doesNotMatch(stability,/fighterDetail|snapshot-item|snapshot-grid|RANKING_DATA|DISPLAY_OVERRIDES|currentFighter/,'The stability layer must not inspect or mutate fighter-profile content.');
assert.doesNotMatch(stability,/\.snapshot-grid/,'The drawer observer must not target canonical Resume Snapshot markup.');
assert.doesNotMatch(stability,/octagon-hq:view-change|octagon-hq:soft-refresh|\[0,80,240,700,1600,3600\]/,'Profile presentation recovery must not retain route or delayed retry triggers.');

for(const preserved of ['syncDrawerState','fighter-profile-open','closeFighterProfile','observer.observe(drawer','attributeFilter:[\'class\',\'aria-hidden\']']){
  assert(stability.includes(preserved),`Legitimate native drawer recovery changed unexpectedly: ${preserved}`);
}

function jsFiles(directory){
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{
    const absolute=path.join(directory,entry.name);
    if(entry.isDirectory())return jsFiles(absolute);
    return entry.isFile()&&entry.name.endsWith('.js')?[absolute]:[];
  });
}
const assetRoot=path.join(root,'assets','js');
const hiddenSnapshotRepairs=jsFiles(assetRoot)
  .filter(file=>/\brepairSnapshot\b/.test(fs.readFileSync(file,'utf8')))
  .map(file=>path.relative(root,file));
assert.deepEqual(hiddenSnapshotRepairs,[],'A hidden Resume Snapshot repair remains in production JavaScript.');

console.log(JSON.stringify({
  passed:true,
  retiredBehavior:'native Resume Snapshot value repair',
  canonicalOwner:'assets/js/calculated-profile-runtime.js',
  subordinateLayer:stabilityPath,
  bootstrapPosition,
  stabilityPosition,
  preserved:['drawer/body synchronization','native destination close','drawer-only observation']
},null,2));

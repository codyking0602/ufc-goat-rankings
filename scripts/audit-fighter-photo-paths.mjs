import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const run=(command,args,options={})=>{
  const result=spawnSync(command,args,{stdio:'inherit',encoding:'utf8',...options});
  if(result.status!==0)throw new Error(`${command} ${args.join(' ')} failed with ${result.status}`);
};

const workflowPath='.github/workflows/phase4-lazy-commissioner-patch.yml';
const workflow=fs.readFileSync(workflowPath,'utf8');
const marker="          python3 - <<'PY'\n";
const start=workflow.indexOf(marker)+marker.length;
const end=workflow.indexOf('\n          PY',start);
if(start<marker.length||end<0)throw new Error('Embedded commissioner patch was not found.');
const python=workflow.slice(start,end).split('\n').map(line=>line.startsWith('          ')?line.slice(10):line).join('\n');
const patchFile='/tmp/phase4-lazy-commissioner-patch.py';
fs.writeFileSync(patchFile,python);
run('python3',[patchFile]);

fs.rmSync('scripts/.phase4-commissioner-trigger',{force:true});
run('git',['checkout','origin/main','--','scripts/audit-phase-4-startup-work.mjs','scripts/audit-fighter-photo-paths.mjs']);
for(const file of ['index.html','assets/data/display-overrides.js','octagon-verdict-knowledge.md']){
  run('git',['checkout','HEAD','--',file]);
}
for(const file of [
  'assets/js/picks-commissioner.js',
  'scripts/test-picks-commissioner-active-contract.mjs',
  'scripts/test-picks-commissioner-active-owner.mjs',
  'scripts/test-ios-standalone-resume-home.mjs'
])run('node',['--check',file]);

run('git',['config','user.name','github-actions[bot]']);
run('git',['config','user.email','41898282+github-actions[bot]@users.noreply.github.com']);
run('git',['add','-A']);
run('git',['commit','-m','Gate commissioner refresh to active Picks']);
run('git',['push','origin','HEAD:agent/phase-4-lazy-commissioner-refresh']);
console.log('Applied and pushed the exact active-Picks commissioner patch.');

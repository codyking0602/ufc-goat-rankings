import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const run=(command,args)=>{
  const result=spawnSync(command,args,{stdio:'inherit',encoding:'utf8'});
  if(result.status!==0)throw new Error(`${command} ${args.join(' ')} failed with ${result.status}`);
};

const path='assets/js/picks-commissioner.js';
let source=fs.readFileSync(path,'utf8');
const oldStart=`  function start(){
    ensureCard();
    if(picksActive()) refresh();
`;
const newStart=`  function start(){
    ensureCard();
    if(picksActive() && document.getElementById('picksCommissionerCard')) refresh();
`;
const oldRoute=`    window.addEventListener('octagon-hq:view-change',event=>{
      if(event.detail?.destination==='picks') refresh();
    });
`;
const newRoute=`    window.addEventListener('octagon-hq:view-change',event=>{
      if(event.detail?.destination!=='picks') return;
      ensureCard();
      if(document.getElementById('picksCommissionerCard')) refresh();
    });
`;
if(!source.includes(oldStart)||!source.includes(oldRoute))throw new Error('Expected commissioner activation blocks were not found.');
source=source.replace(oldStart,newStart).replace(oldRoute,newRoute);
fs.writeFileSync(path,source);

run('node',['--check',path]);
run('git',['checkout','origin/main','--','scripts/audit-fighter-photo-paths.mjs']);
run('git',['checkout','HEAD','--','index.html','assets/data/display-overrides.js','octagon-verdict-knowledge.md']);
fs.rmSync('node_modules',{recursive:true,force:true});
run('git',['config','user.name','github-actions[bot]']);
run('git',['config','user.email','41898282+github-actions[bot]@users.noreply.github.com']);
run('git',['add',path,'scripts/audit-fighter-photo-paths.mjs']);
run('git',['commit','-m','Require mounted commissioner card before refresh']);
run('git',['push','origin','HEAD:agent/phase-4-lazy-commissioner-refresh']);
console.log('Tightened direct and route commissioner activation.');

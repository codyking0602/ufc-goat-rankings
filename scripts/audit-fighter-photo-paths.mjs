import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const run=(command,args)=>{
  const result=spawnSync(command,args,{stdio:'inherit',encoding:'utf8'});
  if(result.status!==0)throw new Error(`${command} ${args.join(' ')} failed with ${result.status}`);
};

const runtimePath='assets/js/octagon-access-panel.js';
let runtime=fs.readFileSync(runtimePath,'utf8');
const oldVersion="const VERSION='octagon-access-panel-20260721b-passive-identity';";
const newVersion="const VERSION='octagon-access-panel-20260721c-single-startup-access';";
const oldSchedule=`    [0,250,900,2600,5000].forEach(delay=>window.setTimeout(()=>{\n      ensurePanel();\n      checkCurrentAccess();\n    },delay));\n`;
const newSchedule=`    ensurePanel();\n    void checkCurrentAccess();\n`;
if(!runtime.includes(oldVersion)||!runtime.includes(oldSchedule))throw new Error('Expected access startup retry boundary was not found.');
runtime=runtime.replace(oldVersion,newVersion).replace(oldSchedule,newSchedule);
fs.writeFileSync(runtimePath,runtime);

const iosPath='scripts/test-ios-standalone-resume-home.mjs';
let ios=fs.readFileSync(iosPath,'utf8');
const marker="await import('./test-octagon-notification-startup-retry-owner.mjs');\n";
const addition="await import('./test-octagon-access-startup-retry-owner.mjs');\n";
if(!ios.includes(marker))throw new Error('Expected iOS suite marker was not found.');
if(!ios.includes(addition))ios=ios.replace(marker,marker+addition);
fs.writeFileSync(iosPath,ios);

run('node',['--check',runtimePath]);
run('node',['--check',iosPath]);
run('node',['--check','scripts/test-octagon-access-startup-retry-contract.mjs']);
run('node',['--check','scripts/test-octagon-access-startup-retry-owner.mjs']);
run('node',['scripts/test-octagon-access-startup-retry-contract.mjs']);
run('node',['scripts/test-octagon-access-identity-contract.mjs']);
run('node',['scripts/test-octagon-access-startup-retry-owner.mjs']);
run('node',['scripts/test-octagon-access-identity-owner.mjs']);
run('git',['checkout','origin/main','--','scripts/audit-fighter-photo-paths.mjs']);
run('git',['config','user.name','github-actions[bot]']);
run('git',['config','user.email','41898282+github-actions[bot]@users.noreply.github.com']);
run('git',['add',runtimePath,iosPath,'scripts/test-octagon-access-startup-retry-contract.mjs','scripts/test-octagon-access-startup-retry-owner.mjs','scripts/audit-fighter-photo-paths.mjs']);
run('git',['commit','-m','Retire repeated access startup status retries']);
run('git',['push','origin','HEAD:agent/phase-4-retire-access-startup-retries']);
console.log('Applied and proved access startup retry retirement.');

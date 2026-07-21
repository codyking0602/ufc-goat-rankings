import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const run=(command,args)=>{
  const result=spawnSync(command,args,{stdio:'inherit',encoding:'utf8'});
  if(result.status!==0)throw new Error(`${command} ${args.join(' ')} failed with ${result.status}`);
};

const runtimePath='assets/js/octagon-notifications.js';
let runtime=fs.readFileSync(runtimePath,'utf8');
const oldVersion="const VERSION='octagon-notifications-20260721b-passive-identity';";
const newVersion="const VERSION='octagon-notifications-20260721c-single-startup-status';";
const oldSchedule=`    [0,180,700,1800,4200].forEach(delay=>window.setTimeout(async()=>{\n      ensureBadge();\n      ensureBoardExtras();\n      await refreshStatus();\n    },delay));\n`;
const newSchedule=`    ensureBadge();\n    ensureBoardExtras();\n    void refreshStatus();\n`;
if(!runtime.includes(oldVersion)||!runtime.includes(oldSchedule))throw new Error('Expected notification startup retry boundary was not found.');
runtime=runtime.replace(oldVersion,newVersion).replace(oldSchedule,newSchedule);
fs.writeFileSync(runtimePath,runtime);

const iosPath='scripts/test-ios-standalone-resume-home.mjs';
let ios=fs.readFileSync(iosPath,'utf8');
const marker="await import('./test-native-shell-startup-resync-owner.mjs');\n";
const addition="await import('./test-octagon-notification-startup-retry-owner.mjs');\n";
if(!ios.includes(marker))throw new Error('Expected iOS suite marker was not found.');
if(!ios.includes(addition))ios=ios.replace(marker,marker+addition);
fs.writeFileSync(iosPath,ios);

run('node',['--check',runtimePath]);
run('node',['--check',iosPath]);
run('node',['--check','scripts/test-octagon-notification-startup-retry-contract.mjs']);
run('node',['--check','scripts/test-octagon-notification-startup-retry-owner.mjs']);
run('node',['scripts/test-octagon-notification-startup-retry-contract.mjs']);
run('node',['scripts/test-octagon-notification-identity-contract.mjs']);
run('node',['scripts/test-octagon-notification-startup-retry-owner.mjs']);
run('node',['scripts/test-octagon-notification-identity-owner.mjs']);
run('git',['checkout','origin/main','--','scripts/audit-fighter-photo-paths.mjs']);
run('git',['config','user.name','github-actions[bot]']);
run('git',['config','user.email','41898282+github-actions[bot]@users.noreply.github.com']);
run('git',['add',runtimePath,iosPath,'scripts/test-octagon-notification-startup-retry-contract.mjs','scripts/test-octagon-notification-startup-retry-owner.mjs','scripts/audit-fighter-photo-paths.mjs']);
run('git',['commit','-m','Retire repeated notification startup status retries']);
run('git',['push','origin','HEAD:agent/phase-4-retire-octagon-startup-retries']);
console.log('Applied and proved notification startup retry retirement.');

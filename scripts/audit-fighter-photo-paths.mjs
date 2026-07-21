import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const run=(command,args)=>{
  const result=spawnSync(command,args,{stdio:'inherit',encoding:'utf8'});
  if(result.status!==0)throw new Error(`${command} ${args.join(' ')} failed with ${result.status}`);
};

const nativePath='assets/js/native-app-shell.js';
let native=fs.readFileSync(nativePath,'utf8');
const oldVersion="const VERSION='native-app-shell-20260721b-single-activity-refresh';";
const newVersion="const VERSION='native-app-shell-20260721c-no-delayed-startup-resync';";
const delayed="    [80,260,800,1800,4200].forEach(delay=>window.setTimeout(()=>{ensureAskAction();syncActive();syncBadges();},delay));\n";
if(!native.includes(oldVersion)||!native.includes(delayed))throw new Error('Expected native delayed-pass boundary was not found.');
native=native.replace(oldVersion,newVersion).replace(delayed,'');
fs.writeFileSync(nativePath,native);

const pullPath='scripts/test-native-pull-refresh-ownership.mjs';
let pull=fs.readFileSync(pullPath,'utf8');
const oldAssertion="  assert.match(value.version,/single-activity-refresh/,`${stage}: corrected native runtime did not load.`);";
const newAssertion="  assert.equal(value.version,'native-app-shell-20260721c-no-delayed-startup-resync',`${stage}: corrected native runtime did not load.`);";
if(!pull.includes(oldAssertion))throw new Error('Expected native pull version assertion was not found.');
fs.writeFileSync(pullPath,pull.replace(oldAssertion,newAssertion));

const iosPath='scripts/test-ios-standalone-resume-home.mjs';
let ios=fs.readFileSync(iosPath,'utf8');
const marker="await import('./test-picks-commissioner-active-owner.mjs');\n";
const addition="await import('./test-native-shell-startup-resync-owner.mjs');\n";
if(!ios.includes(marker))throw new Error('Expected iOS suite marker was not found.');
if(!ios.includes(addition))ios=ios.replace(marker,marker+addition);
fs.writeFileSync(iosPath,ios);

run('node',['--check',nativePath]);
run('node',['--check',pullPath]);
run('node',['--check',iosPath]);
run('node',['--check','scripts/test-native-shell-startup-resync-contract.mjs']);
run('node',['--check','scripts/test-native-shell-startup-resync-owner.mjs']);
run('node',['scripts/test-native-shell-startup-resync-contract.mjs']);
run('node',['scripts/test-native-shell-startup-resync-owner.mjs']);
run('git',['checkout','origin/main','--','scripts/audit-fighter-photo-paths.mjs']);
run('git',['config','user.name','github-actions[bot]']);
run('git',['config','user.email','41898282+github-actions[bot]@users.noreply.github.com']);
run('git',['add',nativePath,pullPath,iosPath,'scripts/test-native-shell-startup-resync-contract.mjs','scripts/test-native-shell-startup-resync-owner.mjs','scripts/audit-fighter-photo-paths.mjs']);
run('git',['commit','-m','Retire native delayed startup resynchronization']);
run('git',['push','origin','HEAD:agent/phase-4-retire-native-startup-passes']);
console.log('Applied and proved native delayed-pass retirement.');

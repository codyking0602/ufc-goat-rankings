import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync('assets/js/home-dashboard.js','utf8');
const cached=source.match(/function cachedIdentity\(\)\{([\s\S]*?)\n  \}/);
const sync=source.match(/async function syncOfficialDaily\(force=false\)\{([\s\S]*?)\n  \}\n\n  function preferredEvent/);

assert(cached,'Home Dashboard cached identity boundary could not be identified.');
assert(sync,'Home Dashboard official daily sync boundary could not be identified.');
assert(cached[1].includes('window.UFC_PLAY_PROFILE?.identity'),'Home daily sync must consume canonical cached identity.');
assert(cached[1].includes('window.UFC_APP_PROFILE?.identity'),'Home daily sync may reuse app-profile cached identity.');
assert.equal(source.includes('shared.resolveIdentity'),false,'Home Dashboard must not call the shared identity resolver from passive daily sync.');
assert.equal(source.includes('UFC_PLAY_PROFILE?.resolve'),false,'Home Dashboard must not initiate canonical identity resolution.');
assert.equal(source.includes('UFC_APP_PROFILE?.resolve'),false,'Home Dashboard must not invoke the visible profile-editor resolver.');
assert(sync[1].includes('const identity=cachedIdentity();'),'Official daily sync must read cached identity only.');
assert(sync[1].indexOf('const identity=cachedIdentity();')<sync[1].indexOf('shared.dailyContext('),'Identity must be available before Home starts a daily context RPC.');
assert(sync[1].includes('officialLoading'),'Competing Home daily sync calls must retain the existing in-flight guard.');
assert(source.includes("'ufc-play-profile-ready'"),'Home Dashboard must retain canonical readiness-driven daily synchronization.');

console.log(JSON.stringify({
  passed:true,
  owner:'canonical-profile-cache',
  passiveResolver:false,
  rpcBeforeIdentity:false,
  inFlightGuard:true
},null,2));

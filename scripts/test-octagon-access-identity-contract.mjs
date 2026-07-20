import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync('assets/js/octagon-access-panel.js','utf8');
const cached=source.match(/function cachedIdentity\(\)\{([\s\S]*?)\n  \}/);
const passive=source.match(/function passiveContext\(\)\{([\s\S]*?)\n  \}/);
const interactive=source.match(/async function interactiveContext\(\)\{([\s\S]*?)\n  \}/);
const access=source.match(/async function checkCurrentAccess\(\)\{([\s\S]*?)\n  \}\n\n  async function loadRoster/);
const start=source.match(/function start\(\)\{([\s\S]*?)\n  \}\n\n  window\.UFC_OCTAGON_ACCESS/);

assert(cached,'Octagon access cached identity boundary could not be identified.');
assert(passive,'Octagon access passive context boundary could not be identified.');
assert(interactive,'Octagon access interactive context boundary could not be identified.');
assert(access,'Octagon access status boundary could not be identified.');
assert(start,'Octagon access startup boundary could not be identified.');
assert(cached[1].includes('window.UFC_PLAY_PROFILE?.identity'),'Passive Octagon access must consume canonical cached identity.');
assert(cached[1].includes('window.UFC_APP_PROFILE?.identity'),'Passive Octagon access may reuse app-profile cached identity.');
assert.equal(source.includes('UFC_PLAY_PROFILE?.resolve'),false,'Octagon access must not initiate canonical identity resolution.');
assert.equal(source.includes('UFC_APP_PROFILE?.resolve'),false,'Octagon access must not invoke the visible profile-editor resolver.');
assert.equal(source.includes('localStorage.getItem('),false,'Octagon access must not read canonical access directly from storage.');
assert.equal(source.includes('TOKEN_KEY'),false,'Octagon access must not own the canonical group-token key.');
assert(passive[1].includes('cachedIdentity()'),'Passive access checks must use cached identity only.');
assert(interactive[1].includes('UFC_PLAY_PROFILE'),'Interactive admin actions must use the canonical profile owner.');
assert(interactive[1].includes('require?.('),'Interactive admin actions may retain the canonical sign-in boundary.');
assert(access[1].includes('state.accessPromise'),'Competing access checks must retain an in-flight coalescing guard.');
assert(start[1].includes('checkCurrentAccess();'),'Startup must retain one immediate passive access check.');
assert.equal(start[1].includes('[0,250,900,2600,5000]'),false,'Octagon access must not fan out five startup access checks.');
assert.equal(start[1].includes("addEventListener('storage'"),false,'Octagon access must not use storage changes as identity readiness.');
assert(start[1].includes("'ufc-play-profile-ready'"),'Octagon access must retain canonical readiness synchronization.');

console.log(JSON.stringify({
  passed:true,
  owner:'canonical-profile-cache',
  passiveResolver:false,
  canonicalStorageRead:false,
  startupAccessChecks:1,
  inFlightGuard:true,
  interactiveRequire:true
},null,2));

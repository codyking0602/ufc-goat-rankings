import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync('assets/js/octagon-access-panel.js','utf8');
const passive=source.match(/function passiveIdentity\(value\)\{([\s\S]*?)\n  \}/);
const context=source.match(/function context\(value\)\{([\s\S]*?)\n  \}/);
const check=source.match(/async function checkCurrentAccess\(\)\{([\s\S]*?)\n  \}\n\n  async function loadRoster/);
const start=source.match(/function start\(\)\{([\s\S]*?)\n  \}\n\n  window\.UFC_OCTAGON_ACCESS/);

assert(passive,'Octagon access passive identity boundary could not be identified.');
assert(context,'Octagon access RPC context boundary could not be identified.');
assert(check,'Octagon access status boundary could not be identified.');
assert(start,'Octagon access startup boundary could not be identified.');

assert(passive[1].includes('window.UFC_PLAY_PROFILE?.identity'),'Octagon access must consume the canonical cached identity.');
assert(passive[1].includes('window.UFC_APP_PROFILE?.identity'),'Octagon access may reuse app-profile cached identity.');
assert.equal(source.includes('UFC_PLAY_PROFILE?.resolve'),false,'Passive Octagon access work must not invoke the canonical resolver.');
assert.equal(source.includes('UFC_APP_PROFILE?.resolve'),false,'Octagon access must not invoke the visible profile-editor resolver.');
assert.equal(source.includes('UFC_PLAY_PROFILE?.require'),false,'Octagon access has no sign-in surface and must remain a passive consumer.');
assert.equal(source.includes('TOKEN_KEY'),false,'Octagon access must not own the canonical GOAT26 token key.');
assert.equal(source.includes('localStorage.getItem('),false,'Octagon access must not read canonical access directly from storage.');

assert(context[1].includes('const identity=passiveIdentity(value);'),'Octagon access RPC context must consume published identity only.');
assert(context[1].includes('token:tokenFor(identity)'),'Octagon access RPC context must derive access from published identity.');
assert(check[1].includes('if(state.accessCheckPromise)return state.accessCheckPromise;'),'Competing Octagon access checks must share one in-flight request.');
assert(check[1].includes('state.accessCheckPromise=(async()=>{'),'Octagon access must retain one request promise owner.');
assert(check[1].includes('finally{state.accessCheckPromise=null;}'),'Octagon access must release its request owner after completion.');
assert(check[1].indexOf('const {client,token}=context();')<check[1].indexOf("client.rpc('octagon_access_status'"),'Published identity must be checked before the access-status RPC.');

assert(start[1].includes("window.addEventListener(name,event=>"),'Octagon access must retain readiness-driven synchronization.');
assert(start[1].includes('passiveIdentity(event.detail);'),'Readiness events must publish identity into the access cache.');
assert.equal(start[1].includes('window.setTimeout(checkCurrentAccess,500)'),false,'One readiness event must not schedule a second unconditional access check.');
assert.equal(start[1].includes("window.addEventListener('storage'"),false,'Octagon access must not react to canonical token storage.');
assert(start[1].includes("document.addEventListener('visibilitychange'"),'Visibility-resume access verification must remain.');
assert(start[1].includes("window.addEventListener('online'"),'Reconnect access verification must remain.');
assert(start[1].includes('window.setInterval(()=>'),'Periodic server verification must remain.');

assert(source.includes("client.rpc('octagon_access_status'"),'Octagon access must retain server-side status verification.');
assert(source.includes("client.rpc('octagon_admin_access_roster'"),'Cody must retain roster-management ownership.');
assert(source.includes("client.rpc('octagon_admin_set_access'"),'Cody must retain access-toggle ownership.');
assert(source.includes("channel.on('broadcast',{event:'access-change'}"),'Realtime access synchronization must remain.');

console.log(JSON.stringify({
  passed:true,
  owner:'canonical-profile-cache',
  passiveResolver:false,
  canonicalStorageRead:false,
  duplicateReadinessCheck:false,
  accessStatusInFlightOwner:true,
  adminAccessOwner:true
},null,2));

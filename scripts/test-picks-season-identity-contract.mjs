import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync('assets/js/picks-season-loop.js','utf8');
const passive=source.match(/function passiveIdentity\(\)\{([\s\S]*?)\n  \}/);
const load=source.match(/async function loadData\(force=false\)\{([\s\S]*?)\n  \}\n\n  function bestFinish/);
const reminder=source.match(/async function toggleReminder\(input\)\{([\s\S]*?)\n  \}\n\n  function openSeason/);

assert(passive,'Picks season passive identity boundary could not be identified.');
assert(load,'Picks season load boundary could not be identified.');
assert(reminder,'Picks season reminder boundary could not be identified.');
assert(passive[1].includes('window.UFC_PLAY_PROFILE?.identity'),'Picks season must consume canonical cached identity.');
assert(passive[1].includes('window.UFC_APP_PROFILE?.identity'),'Picks season may reuse app-profile cached identity.');
assert.equal(source.includes('UFC_PLAY_PROFILE?.resolve'),false,'Picks season must not initiate canonical identity resolution.');
assert.equal(source.includes('UFC_PLAY_PROFILE?.require'),false,'Picks season passive work must not require sign-in.');
assert.equal(source.includes('UFC_APP_PROFILE?.resolve'),false,'Picks season must not invoke the visible profile-editor resolver.');
assert.equal(source.includes('GROUP_TOKEN_KEY'),false,'Picks season must not own the canonical group-token key.');
assert.equal(source.includes('GROUP_ADMIN_KEY'),false,'Picks season must not own the canonical group-admin key.');
assert.equal(source.includes('localStorage.getItem('),false,'Picks season must not read canonical access directly from storage.');
assert(load[1].includes('const identity=passiveIdentity();'),'Picks season loads must consume published identity only.');
assert(load[1].includes('const token=tokenFor(identity);'),'Picks season loads must derive member access from published identity.');
assert(load[1].includes('const admin=adminTokenFor(identity);'),'Picks season loads must derive admin access from published identity.');
assert(load[1].indexOf('if(!client||!identity||!token)return null;')<load[1].indexOf("client.rpc('picks_group_snapshot'"),'Published identity must exist before Picks season starts RPC work.');
assert(load[1].includes('if(state.loading)return state.loading;'),'Competing Picks season loads must retain one unconditional in-flight guard.');
assert(reminder[1].includes('tokenFor(state.data?.identity||passiveIdentity())'),'Explicit reminder changes must reuse the published identity token.');
assert(source.includes("['ufc-play-profile-ready','ufc-app-profile-updated']"),'Picks season must retain readiness-driven synchronization.');

console.log(JSON.stringify({
  passed:true,
  owner:'canonical-profile-cache',
  passiveResolver:false,
  canonicalStorageRead:false,
  rpcBeforeIdentity:false,
  inFlightGuard:true
},null,2));

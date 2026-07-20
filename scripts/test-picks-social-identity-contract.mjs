import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync('assets/js/picks-social-retention.js','utf8');
const passive=source.match(/function passiveIdentity\(\)\{([\s\S]*?)\n  \}/);
const context=source.match(/function context\(\)\{([\s\S]*?)\n  \}/);
const refresh=source.match(/async function refresh\(force=false\)\{([\s\S]*?)\n  \}/);

assert(passive,'Picks social passive identity boundary could not be identified.');
assert(context,'Picks social identity context boundary could not be identified.');
assert(refresh,'Picks social refresh boundary could not be identified.');
assert(passive[1].includes('window.UFC_PLAY_PROFILE?.identity'),'Picks social must consume canonical cached identity.');
assert(passive[1].includes('window.UFC_APP_PROFILE?.identity'),'Picks social may reuse app-profile cached identity.');
assert.equal(source.includes('UFC_PLAY_PROFILE?.resolve'),false,'Picks social must not initiate canonical identity resolution.');
assert.equal(source.includes('UFC_PLAY_PROFILE?.require'),false,'Passive Picks social work must not require sign-in.');
assert.equal(source.includes('UFC_APP_PROFILE?.resolve'),false,'Picks social must not invoke the visible profile-editor resolver.');
assert.equal(source.includes('GROUP_TOKEN_PREFIX'),false,'Picks social must not own the canonical group-token prefix.');
assert.equal(source.includes('storedGroupCode'),false,'Picks social must not discover canonical access by scanning storage.');
assert.equal(source.includes("'ufc-picks:group:'"),false,'Picks social must not embed the canonical group-token storage namespace.');
assert.equal(context[1].includes('localStorage'),false,'Picks social identity context must not read canonical access from storage.');
assert(refresh[1].includes('const next=context()'),'Picks social refresh must derive access from published identity context.');
assert(refresh[1].includes('!next.identity||!next.code||!next.token'),'Picks social refresh must stop before RPC work without published identity.');
assert(refresh[1].indexOf('!next.identity||!next.code||!next.token')<refresh[1].indexOf("client.rpc('picks_social_snapshot'"),'Published identity must be available before Picks social starts its snapshot RPC.');
assert(refresh[1].includes('state.loading'),'Picks social must retain its in-flight refresh guard.');
assert(source.includes("window.addEventListener('ufc-play-profile-ready'"),'Picks social must retain canonical readiness-driven synchronization.');
assert(source.includes("window.addEventListener('ufc-app-profile-updated'"),'Picks social must retain profile-update synchronization.');

console.log(JSON.stringify({
  passed:true,
  owner:'canonical-profile-cache',
  passiveResolver:false,
  canonicalStorageRead:false,
  rpcBeforeIdentity:false,
  inFlightGuard:true
},null,2));

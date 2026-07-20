import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync('assets/js/profile-challenges.js','utf8');
const passive=source.match(/async function passiveIdentity\(\)\{([\s\S]*?)\}\n  async function identity/);
const inbox=source.match(/async function loadInbox\(\)\{([\s\S]*?)\n  \}\n\n  function waitFor/);
const group=source.match(/async function groupSnapshot\(who\)\{([\s\S]*?)\}/);

assert(passive,'Profile-challenge passive identity boundary could not be identified.');
assert(inbox,'Profile-challenge inbox boundary could not be identified.');
assert(group,'Profile-challenge direct-send group boundary could not be identified.');

assert(passive[1].includes('window.UFC_PLAY_PROFILE?.identity'),'Passive challenge identity must prefer the canonical identity cache.');
assert(passive[1].includes('window.UFC_PLAY_PROFILE?.resolve?.()'),'Passive challenge identity must resolve through the canonical owner.');
assert.equal(passive[1].includes('window.UFC_APP_PROFILE?.resolve?.()'),false,'Passive challenge identity must not invoke the visible profile-editor resolver.');

assert(inbox[1].includes('if(state.inboxPromise)return state.inboxPromise;'),'Concurrent inbox loads must share one active promise.');
assert(inbox[1].includes('state.inboxPromise=(async()=>'),'The inbox owner must establish its in-flight promise before canonical resolution can publish readiness.');
assert(inbox[1].includes("rpc.rpc('play_profile_challenge_inbox'"),'Profile challenges must retain inbox RPC ownership.');
assert(inbox[1].includes('finally{state.inboxPromise=null;}'),'The inbox coalescing boundary must reset after completion.');

assert(group[1].includes('window.UFC_APP_PROFILE?.group'),'Direct challenge sending may reuse the editor group snapshot.');
assert(group[1].includes('window.UFC_APP_PROFILE?.groupSnapshot?.(who)'),'Direct challenge sending must still request the member list when it is needed.');
assert(source.includes("window.addEventListener('ufc-play-profile-ready'"),'Profile challenges must retain canonical readiness refresh behavior.');
assert(source.includes("window.addEventListener('ufc-app-profile-updated'"),'Profile challenges must retain profile-update refresh behavior.');
assert(source.includes("window.addEventListener('ufc-profile-challenge-sent'"),'Profile challenges must retain sent-challenge inbox refresh behavior.');

console.log(JSON.stringify({
  passed:true,
  passiveIdentity:'canonical-owner',
  editorResolver:false,
  concurrentInbox:'coalesced',
  directSendGroupSnapshot:true
},null,2));

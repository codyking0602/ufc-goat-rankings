import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync('assets/js/profile-challenges.js','utf8');
const passive=source.match(/async function passiveIdentity\(\)\{([\s\S]*?)\}\s+async function identity/);
const explicit=source.match(/async function identity\(options=\{\}\)\{([\s\S]*?)\}\s+function validPayload/);
const inbox=source.match(/async function loadInbox\(\)\{([\s\S]*?)\n  \}\n\n  function isPlayActive/);
const group=source.match(/async function groupSnapshot\(who\)\{([\s\S]*?)\}/);

assert(passive,'Profile-challenge passive identity boundary could not be identified.');
assert(explicit,'Profile-challenge explicit identity boundary could not be identified.');
assert(inbox,'Profile-challenge inbox boundary could not be identified.');
assert(group,'Profile-challenge direct-send group boundary could not be identified.');

assert(passive[1].includes('window.UFC_PLAY_PROFILE?.identity'),'Passive challenge identity must consume the canonical identity cache.');
assert.equal(passive[1].includes('window.UFC_PLAY_PROFILE?.resolve?.()'),false,'Passive challenge identity must not initiate canonical resolution.');
assert.equal(passive[1].includes('window.UFC_APP_PROFILE?.resolve?.()'),false,'Passive challenge identity must not invoke the visible profile-editor resolver.');
assert(explicit[1].includes('window.UFC_PLAY_PROFILE?.require?.('),'Explicit challenge actions must retain canonical sign-in ownership.');

assert(inbox[1].includes('if(state.inboxPromise)return state.inboxPromise;'),'Concurrent inbox loads must share one active promise.');
assert(inbox[1].includes('state.inboxPromise=(async()=>'),'The inbox owner must establish its in-flight promise before readiness or update re-entry.');
assert(inbox[1].includes("rpc.rpc('play_profile_challenge_inbox'"),'Profile challenges must retain inbox RPC ownership.');
assert(inbox[1].includes('finally{state.inboxPromise=null;}'),'The inbox coalescing boundary must reset after completion.');

assert(group[1].includes('window.UFC_APP_PROFILE?.group'),'Direct challenge sending may reuse the editor group snapshot.');
assert(group[1].includes('window.UFC_APP_PROFILE?.groupSnapshot?.(who)'),'Direct challenge sending must still request the member list when it is needed.');
assert(source.includes("window.addEventListener('ufc-play-profile-ready'"),'Profile challenges must retain canonical readiness refresh behavior.');
assert(source.includes("window.addEventListener('ufc-app-profile-updated'"),'Profile challenges must retain profile-update refresh behavior.');
assert(source.includes("window.addEventListener('ufc-profile-challenge-sent'"),'Profile challenges must retain sent-challenge inbox refresh behavior.');

assert(source.includes("center.dataset.playChallengeCenter='true'"),'The canonical challenge owner must render Challenge Center on Play.');
assert(source.includes('data-challenge-filter="received"')&&source.includes('data-challenge-filter="sent"'),'Challenge Center must expose received and sent filters.');
assert(source.includes("rpc.rpc('play_mark_profile_challenges_seen'"),'Opening Play must clear unseen challenge state through the canonical challenge owner.');
assert(source.includes("rpc.rpc('play_profile_challenge_detail'"),'Completed matchups must load both participants’ results through the canonical challenge owner.');
assert.equal(source.includes('.profile-activity-body .profile-activity-grid'),false,'Activity Profile must not remain the primary challenge inbox surface.');

console.log(JSON.stringify({
  passed:true,
  passiveIdentity:'cache-and-event-consumer',
  passiveResolver:false,
  explicitRequire:true,
  concurrentInbox:'coalesced',
  directSendGroupSnapshot:true,
  challengeCenter:'play-received-sent-comparison'
},null,2));

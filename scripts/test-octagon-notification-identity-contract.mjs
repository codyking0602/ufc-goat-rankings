import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync('assets/js/octagon-notifications.js','utf8');
const passive=source.match(/function passiveIdentity\(value\)\{([\s\S]*?)\n  \}/);
const context=source.match(/function context\(value\)\{([\s\S]*?)\n  \}/);
const refresh=source.match(/async function refreshStatus\(options=\{\}\)\{([\s\S]*?)\n  \}\n\n  async function markSeen/);
const events=source.match(/function bindEvents\(\)\{([\s\S]*?)\n  \}\n\n  function start/);

assert(passive,'Octagon notification passive identity boundary could not be identified.');
assert(context,'Octagon notification RPC context boundary could not be identified.');
assert(refresh,'Octagon notification status boundary could not be identified.');
assert(events,'Octagon notification event boundary could not be identified.');

assert(passive[1].includes('window.UFC_PLAY_PROFILE?.identity'),'Octagon notifications must consume canonical cached identity.');
assert(passive[1].includes('window.UFC_APP_PROFILE?.identity'),'Octagon notifications may reuse app-profile cached identity.');
assert.equal(source.includes('UFC_PLAY_PROFILE?.resolve'),false,'Passive Octagon notification work must not invoke the canonical resolver.');
assert.equal(source.includes('UFC_APP_PROFILE?.resolve'),false,'Octagon notifications must not invoke the editor resolver.');
assert.equal(source.includes('UFC_PLAY_PROFILE?.require'),false,'Octagon notifications have no sign-in surface and must remain passive.');
assert.equal(source.includes('TOKEN_KEY'),false,'Octagon notifications must not own the canonical GOAT26 token key.');
assert.equal(source.includes('localStorage.getItem('),false,'Octagon notifications must not read canonical access from storage.');

assert(context[1].includes('const identity=passiveIdentity(value);'),'Octagon notification context must consume published identity only.');
assert(context[1].includes('if(client)wrapRpc(client);'),'Notification-specific board RPC interception must remain.');
assert(context[1].includes('token:tokenFor(identity)'),'Notification RPCs must derive access from published identity.');
assert(refresh[1].includes('if(state.refreshPromise)return state.refreshPromise;'),'Competing activity-status refreshes must share one in-flight request.');
assert(refresh[1].includes('state.refreshPromise=(async()=>{'),'Octagon notifications must retain one refresh promise owner.');
assert(refresh[1].includes('finally{state.refreshPromise=null;}'),'The activity-status request owner must be released after completion.');
assert(refresh[1].indexOf('const {client,token}=context();')<refresh[1].indexOf("client.rpc('octagon_activity_status'"),'Published access must be checked before the activity-status RPC.');

assert(events[1].includes('window.addEventListener(name,event=>'),'Readiness/update events must remain.');
assert(events[1].includes('passiveIdentity(event.detail);'),'Readiness/update events must hand identity to the passive cache.');
assert.equal(events[1].includes("window.addEventListener('storage'"),false,'Octagon notifications must not react to canonical token storage.');
assert(events[1].includes("document.addEventListener('visibilitychange'"),'Visibility lifecycle handling must remain.');
assert(events[1].includes("window.addEventListener('online'"),'Reconnect handling must remain.');

assert(source.includes("client.rpc('octagon_mark_seen'"),'Mark-seen ownership must remain.');
assert(source.includes("client.rpc('octagon_register_push_subscription'"),'Push registration ownership must remain.');
assert(source.includes("client.rpc('octagon_remove_push_subscription'"),'Push removal ownership must remain.');
assert(source.includes("client.functions.invoke('octagon-push'"),'Post/reply push invocation must remain.');
assert(source.includes("channel.on('broadcast',{event:'activity-change'}"),'Realtime activity synchronization must remain.');
assert(source.includes("name==='octagon_post_message'"),'Board post interception must remain.');
assert(source.includes("name==='octagon_delete_message'"),'Board delete interception must remain.');
assert(source.includes("url.searchParams.get('open')!=='octagon'"),'Notification deep-link opening retry must remain.');

console.log(JSON.stringify({
  passed:true,
  owner:'canonical-profile-cache',
  passiveResolver:false,
  canonicalStorageRead:false,
  activityStatusInFlightOwner:true,
  pushOwner:true,
  markSeenOwner:true
},null,2));

import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync('assets/js/octagon-message-board.js','utf8');
const passive=source.match(/function passiveIdentity\(\)\{([\s\S]*?)\n  \}/);
const context=source.match(/function context\(\)\{([\s\S]*?)\n  \}/);
const load=source.match(/async function load\(weekStart=null,options=\{\}\)\{([\s\S]*?)\n  \}\n\n  async function post/);
const auth=source.match(/function renderAuth\(message\)\{([\s\S]*?)\n  \}\n\n  function messageMarkup/);

assert(passive,'War Room passive identity boundary could not be identified.');
assert(context,'War Room identity context boundary could not be identified.');
assert(load,'War Room board load boundary could not be identified.');
assert(auth,'War Room explicit sign-in boundary could not be identified.');
assert(passive[1].includes('window.UFC_PLAY_PROFILE?.identity'),'War Room must consume the canonical cached identity.');
assert(passive[1].includes('window.UFC_APP_PROFILE?.identity'),'War Room may reuse app-profile cached identity.');
assert.equal(source.includes('UFC_PLAY_PROFILE?.resolve'),false,'War Room passive work must not invoke the canonical resolver.');
assert.equal(source.includes('UFC_APP_PROFILE?.resolve'),false,'War Room must not invoke the visible profile-editor resolver.');
assert.equal(source.includes('TOKEN_KEY'),false,'War Room must not own the canonical GOAT26 token key.');
assert.equal(source.includes('localStorage.getItem('),false,'War Room must not read canonical access directly from storage.');
assert(context[1].includes('const identity=passiveIdentity();'),'War Room RPC context must consume published identity only.');
assert(context[1].includes('token:tokenFor(identity)'),'War Room RPC context must derive access from published identity.');
assert(load[1].includes('if(state.loading)return null;'),'Competing War Room loads must retain one in-flight guard.');
assert(load[1].indexOf('const {client,token}=await context();')<load[1].indexOf("client.rpc('octagon_snapshot'"),'War Room must derive published access before starting its snapshot RPC.');
assert.equal((source.match(/UFC_PLAY_PROFILE\?\.require/g)||[]).length,1,'Only the visible War Room sign-in button may require identity.');
assert(auth[1].includes("querySelector('[data-octagon-sign-in]')"),'War Room must retain its explicit sign-in button.');
assert(auth[1].includes('const identity=await window.UFC_PLAY_PROFILE?.require?.('),'Explicit War Room sign-in must retain the canonical sign-in boundary.');
assert(auth[1].includes('if(identity)state.identity=identity;'),'Explicit sign-in must hand the returned identity back to the passive board cache.');
assert(source.includes("window.addEventListener('ufc-play-profile-ready',event=>"),'War Room must retain readiness-driven synchronization.');
assert(source.includes('state.identity=event.detail||state.identity;'),'Canonical readiness must publish identity into the War Room cache.');
assert(source.includes("window.addEventListener('ufc-app-profile-updated',event=>"),'War Room must retain profile-update synchronization.');
assert(source.includes('state.identity=event.detail?.identity||state.identity;'),'Profile updates must refresh the War Room identity cache.');

console.log(JSON.stringify({
  passed:true,
  owner:'canonical-profile-cache',
  passiveResolver:false,
  canonicalStorageRead:false,
  explicitSignInOwner:true,
  rpcBeforeIdentity:false,
  inFlightGuard:true
},null,2));

import assert from 'node:assert/strict';
import fs from 'node:fs';

const appProfile=fs.readFileSync('assets/js/app-profile.js','utf8');
const resolveBoundary=appProfile.match(/async function resolve\(force=false\)\{([\s\S]*?)\n  \}\n\n  function installStyles/);
const readyBoundary=appProfile.match(/window\.addEventListener\('ufc-play-profile-ready',event=>\{([\s\S]*?)\}\);/);
const openBoundary=appProfile.match(/async function open\(\)\{([\s\S]*?)\n  \}\n\n  function createAvatar/);

assert(resolveBoundary,'App-profile resolve boundary could not be identified.');
assert(readyBoundary,'App-profile canonical ready-event boundary could not be identified.');
assert(openBoundary,'App-profile editor-open boundary could not be identified.');

assert(resolveBoundary[1].includes('if(state.identity&&!force)'),'App profile must reuse a supplied canonical identity.');
assert(resolveBoundary[1].includes('if(!state.group){try{await groupSnapshot(state.identity);'),'App profile must hydrate missing group data through its own resolve boundary.');
assert(resolveBoundary[1].includes('window.UFC_PLAY_PROFILE?.resolve?.()'),'App profile must delegate identity resolution to the canonical owner.');
assert(resolveBoundary[1].includes('await groupSnapshot(identity)'),'An uncached canonical identity must receive one app-profile-owned group snapshot.');

assert(readyBoundary[1].includes('state.identity=event.detail||null'),'Canonical readiness must still update the editor identity.');
assert(readyBoundary[1].includes('state.group=null'),'A new canonical identity must invalidate stale editor group state.');
assert(readyBoundary[1].includes('renderChip()'),'Canonical readiness must still refresh the visible profile chip.');
assert.equal(readyBoundary[1].includes('groupSnapshot('),false,'The profile-ready listener must not independently request a full group snapshot.');

assert.equal((openBoundary[1].match(/groupSnapshot\(identity\)/g)||[]).length,1,'Profile-modal sign-in must request one full group snapshot after canonical sign-in.');
assert.equal((appProfile.match(/rpc\('app_profile_group_snapshot'/g)||[]).length,1,'The app-profile module must keep one physical group-snapshot RPC owner.');
assert(appProfile.includes("window.dispatchEvent(new CustomEvent('ufc-app-profile-updated'"),'App profile must retain update publication after saves.');

console.log(JSON.stringify({
  passed:true,
  readyEvent:'identity-only',
  startupGroupSnapshots:1,
  modalSignInGroupSnapshots:1,
  updatePublication:true
},null,2));

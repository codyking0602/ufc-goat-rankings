import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync('assets/js/community-profiles.js','utf8');
const cached=source.match(/function cachedIdentity\(\)\{([\s\S]*?)\n  \}/);
const load=source.match(/async function load\(force=false\)\{([\s\S]*?)\n  \}\n\n  function fighterRecord/);
const openTop10=source.match(/async function openTop10\(\)\{([\s\S]*?)\n  \}\n\n  function saveChallengeTarget/);
const start=source.match(/function start\(\)\{([\s\S]*?)\n  \}\n\n  window\.UFC_COMMUNITY_PROFILES/);

assert(cached,'Community cached identity boundary could not be identified.');
assert(load,'Community load boundary could not be identified.');
assert(openTop10,'Community explicit Top 10 boundary could not be identified.');
assert(start,'Community startup boundary could not be identified.');

assert(cached[1].includes('window.UFC_PLAY_PROFILE?.identity'),'Community Profiles must consume the canonical identity cache.');
assert(cached[1].includes('window.UFC_APP_PROFILE?.identity'),'Community Profiles may reuse the app-profile cache after explicit editor work.');
assert.equal(source.includes('window.UFC_APP_PROFILE?.resolve?.('),false,'Community Profiles must not invoke the visible profile-editor resolver.');
assert.equal(source.includes('window.UFC_PLAY_PROFILE?.resolve?.('),false,'Community Profiles must not initiate canonical resolution from passive work.');
assert(load[1].includes('const identity=cachedIdentity();'),'Community snapshot loading must consume cached identity only.');
assert(load[1].includes('if(state.loading)return state.loading;'),'Competing community refresh paths must share one in-flight promise.');
assert(openTop10[1].includes('window.UFC_PLAY_PROFILE?.require?.('),'Explicit Top 10 editing must retain canonical sign-in ownership.');
assert(start[1].includes('acceptIdentity(window.UFC_PLAY_PROFILE?.identity||window.UFC_APP_PROFILE?.identity);'),'Cached startup must accept an already-published identity directly.');
assert.equal(start[1].includes('.then('),false,'Community startup must not add a second promise-driven handoff beside readiness events.');
assert(source.includes("window.addEventListener('ufc-play-profile-ready'"),'Community Profiles must retain canonical readiness loading.');
assert(source.includes("window.addEventListener('ufc-app-profile-updated'"),'Community Profiles must retain explicit profile-update loading.');

console.log(JSON.stringify({
  passed:true,
  passiveIdentity:'cache-and-event-consumer',
  editorResolver:false,
  canonicalResolver:false,
  explicitRequire:true,
  concurrentRefresh:'coalesced'
},null,2));

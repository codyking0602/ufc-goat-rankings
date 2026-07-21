import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const index=read('index.html');
const migration=read('assets/js/app-canonical-group.js');
const owner=read('assets/js/play-profile-identity.js');

const loaded=[...index.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)]
  .map(match=>match[1].split('?')[0]);
const migrationPath='assets/js/app-canonical-group.js';
const ownerPath='assets/js/play-profile-identity.js';
const migrationPosition=loaded.indexOf(migrationPath);
const ownerPosition=loaded.indexOf(ownerPath);

assert(migrationPosition>=0,'Legacy canonical-group migration must remain production-loaded.');
assert(ownerPosition>migrationPosition,'The canonical identity owner must load after the pre-resolution migration bridge.');

assert.match(migration,/function resolvedHandoff\(candidate,identity\)/,'Migration must expose its already-resolved identity as a bounded handoff.');
assert.match(migration,/memberToken:candidate\.token/,'Migration handoff must include the validated member token.');
assert.match(migration,/member_token:candidate\.token/,'Migration handoff must retain compatibility token shape.');
assert.match(migration,/migrationSourceCode:candidate\.code/,'Migration handoff must retain its source code for auditability.');
assert.match(migration,/return resolvedHandoff\(candidate,response\.data\)/,'Both current and legacy snapshot paths must return the resolved handoff.');
assert.match(migration,/storeCanonical\(candidate,identity\)/,'Legacy token adoption must remain migration-owned.');
assert.match(migration,/window\.dispatchEvent\(new CustomEvent\('ufc-canonical-group-ready'/,'Migration-specific readiness publication must remain.');
assert.doesNotMatch(migration,/ufc-play-profile-ready/,'Migration must not publish canonical profile readiness.');
assert.match(migration,/window\.location\.reload\(\)/,'The existing one-time canonicalization reload must remain.');
assert.match(migration,/sessionStorage\.getItem\(RELOAD_KEY\)/,'Reload-loop protection must remain.');

assert.match(owner,/async function waitForCanonicalBridge\(\)[\s\S]*return await window\.UFC_APP_IDENTITY_CONFIG\?\.ready/,'The canonical owner must await the migration bridge and receive its result.');
assert.match(owner,/function migrationIdentity\(identity\)/,'The canonical owner must validate the bridge shape before adopting it.');
assert.match(owner,/const bridged=migrationIdentity\(await waitForCanonicalBridge\(\)\)/,'Canonical resolution must consume the bridge once.');
assert.match(owner,/if\(bridged\)\{[\s\S]*cache=bridged;[\s\S]*storeResolved\(bridged\);[\s\S]*ufc-play-profile-ready[\s\S]*return bridged;/,'The canonical owner must cache, persist, and publish the bridged identity without another snapshot.');

const bridgedBranch=owner.match(/if\(bridged\)\{([\s\S]*?)\n    \}/)?.[1]||'';
assert(bridgedBranch,'Could not identify the bridged identity branch.');
assert.doesNotMatch(bridgedBranch,/snapshot\(|client\.rpc|app_profile_resolve|play_identity_snapshot/,'The bridged identity branch must not repeat credential verification or snapshot RPC work.');
assert.match(owner,/for\(const token of candidateTokens\(\)\)[\s\S]*const identity=await snapshot\(token\)/,'Independent canonical snapshot fallback must remain when migration has no result.');
assert.equal((owner.match(/ufc-play-profile-ready/g)||[]).length,2,'Only canonical resolve and explicit login may publish canonical profile readiness.');
assert.match(owner,/async function login\(/,'Explicit login ownership must remain.');
assert.match(owner,/picks_member_login_pin/,'Legacy explicit-login fallback must remain.');

console.log(JSON.stringify({
  passed:true,
  migration:migrationPath,
  canonicalOwner:ownerPath,
  migrationPosition,
  ownerPosition,
  migrationValidationPreserved:true,
  canonicalReadinessOwnedByProfileOwner:true,
  duplicateSnapshotRemoved:true,
  independentFallbackPreserved:true,
  oneTimeReloadPreserved:true
},null,2));

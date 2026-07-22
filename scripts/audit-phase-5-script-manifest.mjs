import assert from 'node:assert/strict';
import fs from 'node:fs';

const html=fs.readFileSync('index.html','utf8');
const normalize=value=>String(value||'').split(/[?#]/,1)[0].replace(/^\.\//,'');
const localScriptPattern=/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
const scriptRefs=[];
let match;

while((match=localScriptPattern.exec(html))){
  const raw=match[1];
  const file=normalize(raw);
  if(!file.startsWith('assets/'))continue;
  scriptRefs.push({order:scriptRefs.length,file,raw,index:match.index});
}

const explicitFiles=scriptRefs.map(row=>row.file);
const counts=new Map();
for(const file of explicitFiles)counts.set(file,(counts.get(file)||0)+1);
const duplicateExplicit=[...counts.entries()].filter(([,count])=>count>1).map(([file,count])=>({file,count}));
assert.deepEqual(duplicateExplicit,[],'Production manifest must not load the same local script more than once.');

const missingExplicit=explicitFiles.filter(file=>!fs.existsSync(file));
assert.deepEqual(missingExplicit,[],'Every local production script tag must resolve to a repository file.');

const orderOf=file=>explicitFiles.indexOf(file);
const requiredOrder=[
  ['assets/js/fresh-home-route-bootstrap.js','assets/js/octagon-hq-shell.js','Early route normalization must precede the primary shell.'],
  ['assets/js/octagon-hq-shell.js','assets/js/app.js','The primary shell must publish before the base app runtime.'],
  ['assets/js/play-photo-authority.js','assets/js/better-than-standalone-share.js','The manifest-owned Play photo authority must load before Better Than compatibility.'],
  ['assets/js/play-profile-identity.js','assets/js/app-profile.js','Canonical identity must load before the visible profile editor.'],
  ['assets/js/find-leader.js','assets/js/better-than-standalone-share.js','The manifest-owned Find the Leader must load before Better Than compatibility.'],
  ['assets/js/picks-season-loop.js','assets/js/product-architecture.js','The manifest-owned Picks season API must publish before Product compatibility.'],
  ['assets/js/product-architecture.js','assets/js/fresh-home-launch.js','Product compatibility must exist before the late launch controller.'],
  ['assets/js/app-notification-center.js','assets/js/app-notification-surface-fix.js','Canonical notification ownership must load before its presentation compatibility layer.'],
  ['assets/js/native-app-shell.js','assets/js/native-app-shell-stability.js','The native shell must load before its stability adapter.']
];

for(const [before,after,message] of requiredOrder){
  assert(orderOf(before)>=0,`Missing required production script: ${before}`);
  assert(orderOf(after)>=0,`Missing required production script: ${after}`);
  assert(orderOf(before)<orderOf(after),message);
}

const betterThanSource=fs.readFileSync('assets/js/better-than-standalone-share.js','utf8');
const findLeaderSource=fs.readFileSync('assets/js/find-leader.js','utf8');
const photoAuthoritySource=fs.readFileSync('assets/js/play-photo-authority.js','utf8');
const challengeLoaderSource=fs.readFileSync('assets/data/what-changed.js','utf8');
const profileChallengeSource=fs.readFileSync('assets/js/profile-challenges.js','utf8');
const keepCutStandaloneSource=fs.readFileSync('assets/js/keep-cut-standalone-share.js','utf8');
const findLeaderVersion=findLeaderSource.match(/const VERSION='([^']+)'/)?.[1]||'';
const photoAuthorityVersion=photoAuthoritySource.match(/const VERSION='([^']+)'/)?.[1]||'';
assert(findLeaderVersion,'Current Find the Leader version could not be identified.');
assert(photoAuthorityVersion,'Current Play photo authority version could not be identified.');
assert.doesNotMatch(betterThanSource,/FIND_LEADER_VERSION/,'Better Than compatibility must not maintain a competing Find the Leader version requirement.');
assert.doesNotMatch(betterThanSource,/UFC_FIND_LEADER\?\.version\s*!==/,'Better Than compatibility must not replace a valid manifest owner because of version comparison.');
assert.match(betterThanSource,/if\(!window\.UFC_FIND_LEADER\)\{[\s\S]*data-find-leader-owner-recovery[\s\S]*\}else gameReady\(\);/,'Find the Leader recovery must run only when the manifest owner is absent.');
assert(betterThanSource.includes(`assets/js/find-leader.js?v=${findLeaderVersion}`),'Find the Leader recovery must request the current owner build.');
assert.match(betterThanSource,/if\(!window\.UFC_PLAY_PHOTO_AUTHORITY\)\{[\s\S]*data-play-photo-authority[\s\S]*return;[\s\S]*\}/,'Photo authority recovery must run only when the manifest owner is absent.');
assert(betterThanSource.includes(`assets/js/play-photo-authority.js?v=${photoAuthorityVersion}`),'Photo authority recovery must request the current owner build.');

assert.match(challengeLoaderSource,/script\.src='assets\/js\/game-challenges\.js\?v=game-challenges-[^']+';/,'The existing What Changed dependency owner must continue loading the all-game challenge controller.');
assert.match(keepCutStandaloneSource,/if\(source\.searchParams\.get\('share'\)==='play-challenge'\)return false;/,'Legacy Keep/Cut routing must never intercept a canonical all-game challenge URL.');
assert.match(profileChallengeSource,/const GAME_TITLES=\{[\s\S]*wavelength:'Wavelength'[\s\S]*'keep-cut':'Keep 4, Cut 4'/,'The profile inbox must label the actual challenge game.');
assert.match(profileChallengeSource,/titleFor\(typeFor\(row\)\)/,'Challenge rows must render their real game title instead of hard-coding Find the Leader.');
assert.match(profileChallengeSource,/window\.addEventListener\('click',[\s\S]*data-open-profile-challenge[\s\S]*playInboxChallenge/,'The profile challenge owner must intercept inbox Play actions before game-specific document handlers.');
assert.match(profileChallengeSource,/window\.UFC_GAME_CHALLENGES\?\.openChallenge[\s\S]*await loadInbox\(\);return true;/,'Non-Find Leader inbox challenges must delegate to the current all-game owner and refresh unread state after opening.');
assert.match(profileChallengeSource,/function addedActivitySurface\(records\)[\s\S]*profile-activity-grid[\s\S]*if\(addedActivitySurface\(records\)\)loadInbox\(\);/,'Opening or restoring Activity Profile must refresh and render its challenge inbox.');
assert.match(profileChallengeSource,/data-native-badge="play"[\s\S]*openInbox\(\)/,'The Play notification badge must open the Activity Profile challenge inbox.');
assert(html.includes('assets/js/profile-challenges.js?v=profile-challenges-20260722a-all-game-inbox'),'Production must request the current profile challenge owner URL.');
assert(html.includes('assets/js/keep-cut-standalone-share.js?v=keep-cut-standalone-share-20260722a-canonical-route-guard'),'Production must request the current Keep/Cut compatibility URL.');
assert(html.includes('<meta name="app-build" content="profile-challenges-delivery-20260722a" />'),'The app build marker must publish the challenge delivery update.');

const literalAssetScript=/["'`](assets\/js\/[^"'`?]+\.js)(?:\?[^"'`]*)?["'`]/g;
const dynamicEdges=[];

for(const owner of explicitFiles.filter(file=>file.startsWith('assets/js/'))){
  const source=fs.readFileSync(owner,'utf8');
  if(!/createElement\(\s*["']script["']\s*\)/.test(source))continue;
  const found=new Set();
  let sourceMatch;
  while((sourceMatch=literalAssetScript.exec(source))){
    const dependency=normalize(sourceMatch[1]);
    if(dependency===owner||found.has(dependency))continue;
    found.add(dependency);
    dynamicEdges.push({
      owner,
      dependency,
      explicit:counts.has(dependency)
    });
  }
}

const approvedRecoveryDuplicates=new Set([
  'assets/js/better-than-standalone-share.js=>assets/js/play-photo-authority.js',
  'assets/js/better-than-standalone-share.js=>assets/js/find-leader.js',
  'assets/js/product-architecture.js=>assets/js/octagon-hq-shell.js'
]);

const unapprovedDuplicateDynamicEdges=dynamicEdges.filter(edge=>
  edge.explicit&&!approvedRecoveryDuplicates.has(`${edge.owner}=>${edge.dependency}`)
);
assert.deepEqual(unapprovedDuplicateDynamicEdges,[],'Every explicit/dynamic overlap must have a tested, bounded missing-owner recovery contract.');

const approvedRecoveryEdges=dynamicEdges.filter(edge=>
  approvedRecoveryDuplicates.has(`${edge.owner}=>${edge.dependency}`)
);
assert.deepEqual(approvedRecoveryEdges,[
  {
    owner:'assets/js/better-than-standalone-share.js',
    dependency:'assets/js/play-photo-authority.js',
    explicit:true
  },
  {
    owner:'assets/js/better-than-standalone-share.js',
    dependency:'assets/js/find-leader.js',
    explicit:true
  },
  {
    owner:'assets/js/product-architecture.js',
    dependency:'assets/js/octagon-hq-shell.js',
    explicit:true
  }
],'Approved explicit/dynamic overlaps must remain limited to tested missing-owner recovery paths.');

const manifestOwnedPicksSeason=dynamicEdges.some(edge=>edge.dependency==='assets/js/picks-season-loop.js');
assert.equal(manifestOwnedPicksSeason,false,'Picks season must not regain a second dynamic loader.');

const report={
  passed:true,
  clean:true,
  productionScriptCount:explicitFiles.length,
  explicitScripts:scriptRefs,
  requiredOrder:requiredOrder.map(([before,after])=>({before,after})),
  dynamicScriptOwners:[...new Set(dynamicEdges.map(edge=>edge.owner))],
  dynamicEdges,
  approvedRecoveryEdges,
  unapprovedDuplicateDynamicEdges,
  manifestOwnedPicksSeason:true,
  canonicalChallengeRouting:true,
  profileChallengeInbox:true,
  challengeDelivery:true
};

console.log(JSON.stringify(report,null,2));

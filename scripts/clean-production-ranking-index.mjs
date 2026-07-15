import fs from 'node:fs';

const path='index.html';
let html=fs.readFileSync(path,'utf8');

const removeFragments=[
  'assets/data/canonical-fighter-facts.js?v=',
  'assets/data/canonical-fighter-facts-batch-one.js?v='
];

const removed=[];
html=html.split(/\r?\n/).filter(line=>{
  const match=removeFragments.find(fragment=>line.includes(fragment));
  if(!match)return true;
  removed.push(match);
  return false;
}).join('\n');

html=html
  .replace(/<meta name="app-build" content="[^"]+" \/>/,'<meta name="app-build" content="20260715-permanent-ranking-runtime" />')
  .replace(/assets\/data\/display-overrides\.js\?v=[^"]+/,'assets/data/display-overrides.js?v=display-overrides-20260715-presentation-only')
  .replace(/assets\/data\/ranking-data-patches\.js\?v=[^"]+/,'assets/data/ranking-data-patches.js?v=ranking-data-patches-20260715b-no-existing-script-deadlock')
  .replace(/assets\/js\/production-ranking-bootstrap\.js\?v=[^"]+/,'assets/js/production-ranking-bootstrap.js?v=production-ranking-bootstrap-20260715a-presentation-boundary');

const forbidden=[
  ...removeFragments,
  'assets/data/module-versions.js?v=',
  'assets/data/loss-context-exposure-ledger.js?v=',
  'assets/data/loss-context-hybrid-shadow.js?v=',
  'assets/data/loss-context-hybrid-audit.js?v=',
  'assets/data/loss-context-hybrid-live.js?v=',
  'assets/data/division-era-depth-shadow.js?v=',
  'assets/data/division-era-depth-audit.js?v=',
  'assets/data/division-era-depth-live.js?v=',
  'assets/data/quality-wins-audit-cruz-ilia.js?v=',
  'assets/js/profile-stat-consistency.js?v=',
  'assets/js/fighter-data-ownership-audit.js?v='
];
for(const fragment of forbidden){
  if(html.includes(fragment))throw new Error(`Obsolete production reference remains: ${fragment}`);
}

const patchesIndex=html.indexOf('assets/data/ranking-data-patches.js');
const bootstrapIndex=html.indexOf('assets/js/production-ranking-bootstrap.js');
if(patchesIndex<0||bootstrapIndex<0||patchesIndex>=bootstrapIndex)throw new Error('Production loader order is invalid.');
if(!html.includes('assets/js/play.js')||!html.includes('assets/js/picks.js'))throw new Error('Play or Picks runtime was accidentally removed.');
if(removed.length!==removeFragments.length)throw new Error(`Expected ${removeFragments.length} remaining direct fact tags, removed ${removed.length}.`);

fs.writeFileSync(path,`${html.replace(/\s+$/,'')}\n`,'utf8');
console.log(JSON.stringify({removed,patchesIndex,bootstrapIndex,appBuild:'20260715-permanent-ranking-runtime'},null,2));

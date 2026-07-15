import fs from 'node:fs';

const path='index.html';
let html=fs.readFileSync(path,'utf8');

const removeFragments=[
  'assets/data/canonical-fighter-facts.js?v=',
  'assets/data/canonical-fighter-facts-batch-one.js?v=',
  'assets/data/module-versions.js?v=',
  'window.UFC_MODULE_VERSIONS.approvedFighterAuditCorrections=',
  'assets/data/loss-context-exposure-ledger.js?v=',
  'assets/data/loss-context-hybrid-shadow.js?v=',
  'assets/data/loss-context-hybrid-audit.js?v=',
  'assets/data/loss-context-hybrid-live.js?v=',
  'assets/data/division-era-depth-shadow.js?v=',
  'assets/data/division-era-depth-audit.js?v=',
  'assets/data/division-era-depth-live.js?v=',
  'assets/data/quality-wins-audit-cruz-ilia.js?v=',
  'assets/js/profile-stat-consistency.js?v=',
  'assets/js/fighter-data-ownership-audit.js?v=',
  'assets/js/championship-label-polish.js?v='
];

const lines=html.split(/\r?\n/);
const kept=[];
const removed=[];
for(const line of lines){
  const match=removeFragments.find(fragment=>line.includes(fragment));
  if(match){removed.push(match);continue;}
  kept.push(line);
}
html=kept.join('\n');

html=html
  .replace(/<meta name="app-build" content="[^"]+" \/>/,'<meta name="app-build" content="20260715-permanent-ranking-runtime" />')
  .replace(/assets\/data\/display-overrides\.js\?v=[^"]+/,'assets/data/display-overrides.js?v=display-overrides-20260715-presentation-only')
  .replace(/assets\/data\/ranking-data-patches\.js\?v=[^"]+/,'assets/data/ranking-data-patches.js?v=ranking-data-patches-20260715b-no-existing-script-deadlock')
  .replace(/assets\/js\/production-ranking-bootstrap\.js\?v=[^"]+/,'assets/js/production-ranking-bootstrap.js?v=production-ranking-bootstrap-20260715a-presentation-boundary');

for(const fragment of removeFragments){
  if(html.includes(fragment))throw new Error(`Failed to remove ${fragment}`);
}
const patchesIndex=html.indexOf('assets/data/ranking-data-patches.js');
const bootstrapIndex=html.indexOf('assets/js/production-ranking-bootstrap.js');
if(patchesIndex<0||bootstrapIndex<0||patchesIndex>=bootstrapIndex)throw new Error('Production loader order is invalid.');
if(removed.length!==removeFragments.length)throw new Error(`Expected ${removeFragments.length} removals, got ${removed.length}: ${removed.join(', ')}`);

fs.writeFileSync(path,`${html.replace(/\s+$/,'')}\n`,'utf8');
console.log(JSON.stringify({removed,patchesIndex,bootstrapIndex},null,2));

import fs from 'node:fs/promises';

const path='index.html';
let source=await fs.readFile(path,'utf8');

const obsoleteTokens=[
  'module-versions.js',
  'window.UFC_MODULE_VERSIONS.approvedFighterAuditCorrections',
  'loss-context-exposure-ledger.js',
  'loss-context-hybrid-shadow.js',
  'loss-context-hybrid-audit.js',
  'loss-context-hybrid-live.js',
  'division-era-depth-shadow.js',
  'division-era-depth-audit.js',
  'division-era-depth-live.js',
  'quality-wins-audit-cruz-ilia.js',
  'profile-stat-consistency.js',
  'fighter-data-ownership-audit.js',
  'championship-label-polish-20260711c-compact-copy-contrast'
];

let removed=0;
const lines=source.split(/(?<=\n)/);
source=lines.filter(line=>{
  if(obsoleteTokens.some(token=>line.includes(token))){removed+=1;return false;}
  return true;
}).join('');
if(removed!==obsoleteTokens.length)throw new Error(`Expected ${obsoleteTokens.length} obsolete runtime lines, removed ${removed}.`);

source=source.replace(
  /<meta name="app-build" content="[^"]+" \/>/,
  '<meta name="app-build" content="20260715-permanent-ranking-runtime" />'
);
source=source.replace(
  /assets\/data\/ranking-data-patches\.js\?v=[^"]+/,
  'assets/data/ranking-data-patches.js?v=ranking-data-patches-20260715b-presentation-only'
);
source=source.replace(
  /assets\/js\/production-ranking-bootstrap\.js\?v=[^"]+/,
  'assets/js/production-ranking-bootstrap.js?v=production-ranking-bootstrap-20260714g-presentation-clean'
);

for(const token of obsoleteTokens)if(source.includes(token))throw new Error(`Obsolete runtime reference remains: ${token}`);
const loader=source.indexOf('assets/data/ranking-data-patches.js');
const bootstrap=source.indexOf('assets/js/production-ranking-bootstrap.js');
if(loader<0||bootstrap<0||loader>=bootstrap)throw new Error('Permanent bootstrap order is invalid.');
if(!source.includes('assets/js/play.js')||!source.includes('assets/js/picks.js'))throw new Error('Play or Picks runtime was accidentally removed.');

await fs.writeFile(path,source,'utf8');
console.log(JSON.stringify({removed,loaderBeforeBootstrap:true,appBuild:'20260715-permanent-ranking-runtime'},null,2));

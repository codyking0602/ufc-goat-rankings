import fs from 'node:fs/promises';

const path='index.html';
let source=await fs.readFile(path,'utf8');

const removals=[
  '  <script src="assets/data/module-versions.js?v=module-versions-20260713b-stage3-evidence-only"></script>\n',
  "  <script>window.UFC_MODULE_VERSIONS.approvedFighterAuditCorrections='20260713e-no-score-finalize';window.UFC_MODULE_VERSIONS.canonicalPrimeRecords='20260713b-mirror-sync';</script>\n",
  '  <script src="assets/data/loss-context-exposure-ledger.js?v=loss-context-exposure-ledger-20260713e-evidence-only"></script>\n',
  '  <script src="assets/data/loss-context-hybrid-shadow.js?v=loss-context-hybrid-shadow-20260711f-prime-volume-floor"></script>\n',
  '  <script src="assets/data/loss-context-hybrid-audit.js?v=loss-context-hybrid-audit-20260711d-judgment-approved"></script>\n',
  '  <script src="assets/data/loss-context-hybrid-live.js?v=loss-context-hybrid-live-20260713g-evidence-only"></script>\n',
  '  <script src="assets/data/division-era-depth-shadow.js?v=division-era-depth-shadow-20260712e-roster-72"></script>\n',
  '  <script src="assets/data/division-era-depth-audit.js?v=division-era-depth-judgment-review-20260712c-roster-72"></script>\n',
  '  <script src="assets/data/division-era-depth-live.js?v=division-era-depth-live-20260713c-evidence-only"></script>\n',
  '  <script src="assets/data/quality-wins-audit-cruz-ilia.js?v=quality-wins-audit-cruz-ilia-20260713a-category-only"></script>\n',
  '  <script src="assets/js/profile-stat-consistency.js?v=profile-stat-consistency-20260712d-prime-phase-finish-count"></script>\n',
  '  <script src="assets/js/fighter-data-ownership-audit.js?v=fighter-data-ownership-audit-20260713a-phase1-baseline"></script>\n',
  '  <script src="assets/js/championship-label-polish.js?v=championship-label-polish-20260711c-compact-copy-contrast" data-championship-label-polish="true"></script>\n'
];

for(const line of removals){
  const count=source.split(line).length-1;
  if(count!==1)throw new Error(`Expected exactly one obsolete index line, found ${count}: ${line.trim()}`);
  source=source.replace(line,'');
}

const before='<meta name="app-build" content="20260714-calculated-ranking-runtime" />';
const after='<meta name="app-build" content="20260715-permanent-ranking-runtime" />';
if(source.includes(before))source=source.replace(before,after);
else if(!source.includes(after))throw new Error('Unexpected app-build marker.');

const patchBefore='assets/data/ranking-data-patches.js?v=ranking-data-patches-20260713y-stage3-clean-packets';
const patchAfter='assets/data/ranking-data-patches.js?v=ranking-data-patches-20260715b-presentation-only';
if(source.includes(patchBefore))source=source.replace(patchBefore,patchAfter);
else if(!source.includes(patchAfter))throw new Error('Unexpected ranking-data-patches cache key.');

const bootstrapBefore='assets/js/production-ranking-bootstrap.js?v=production-ranking-bootstrap-20260714a';
const bootstrapAfter='assets/js/production-ranking-bootstrap.js?v=production-ranking-bootstrap-20260714g-presentation-clean';
if(source.includes(bootstrapBefore))source=source.replace(bootstrapBefore,bootstrapAfter);
else if(!source.includes(bootstrapAfter))throw new Error('Unexpected production bootstrap cache key.');

const forbidden=[
  'loss-context-hybrid-',
  'division-era-depth-audit.js',
  'division-era-depth-live.js',
  'quality-wins-audit-cruz-ilia.js',
  'profile-stat-consistency.js',
  'fighter-data-ownership-audit.js',
  'module-versions.js'
];
for(const token of forbidden)if(source.includes(token))throw new Error(`Obsolete runtime reference remains: ${token}`);

const loader=source.indexOf('assets/data/ranking-data-patches.js');
const bootstrap=source.indexOf('assets/js/production-ranking-bootstrap.js');
if(loader<0||bootstrap<0||loader>=bootstrap)throw new Error('Permanent bootstrap order is invalid.');

await fs.writeFile(path,source,'utf8');
console.log(JSON.stringify({removed:removals.length,loaderBeforeBootstrap:true,appBuild:'20260715-permanent-ranking-runtime'},null,2));

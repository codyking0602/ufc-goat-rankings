import fs from 'node:fs';

const path='assets/data/canonical-fighter-registry-batch-eight.js';
let source=fs.readFileSync(path,'utf8');

const statsBlock=/\n\s*const stats = \{[\s\S]*?\n\s*\};\n\n\s*return \{/;
if(!statsBlock.test(source))throw new Error('Batch-eight manual stats block was not found.');
source=source.replace(statsBlock,'\n\n    return {');

const snapshotBlock=/\n\s*snapshot: \[[\s\S]*?\n\s*packetProfileStats: \{ \.\.\.stats \},/;
if(!snapshotBlock.test(source))throw new Error('Batch-eight snapshot ownership block was not found.');
source=source.replace(snapshotBlock,'');

const legacyStatsBlock=/,\n\s*legacyStats: \{[\s\S]*?\n\s*\}/;
if(!legacyStatsBlock.test(source))throw new Error('Batch-eight Compare legacyStats block was not found.');
source=source.replace(legacyStatsBlock,'');

for(const forbidden of ['snapshot: [','snapshotStats: { ...stats }','packetProfileStats: { ...stats }','legacyStats: {']){
  if(source.includes(forbidden))throw new Error(`Manual presentation ownership remains: ${forbidden}`);
}

source=source.replace(
  "const VERSION = 'canonical-fighter-registry-batch-eight-20260713a-no-score-finalize';",
  "const VERSION = 'canonical-fighter-registry-batch-eight-20260715a-presentation-clean';"
);

fs.writeFileSync(path,source,'utf8');
console.log('Cleaned batch-eight manual snapshots and Compare stats.');

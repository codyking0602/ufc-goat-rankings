import fs from 'node:fs/promises';

const path='assets/data/canonical-fighter-facts-batch-four.js';
const source=await fs.readFile(path,'utf8');
const before='scheduledRounds:opt.s||3';
const after='scheduledRounds:Math.max(opt.s||3,round)';
const occurrences=source.split(before).length-1;
if(occurrences!==1)throw new Error(`Expected exactly one batch-four scheduled-round builder, found ${occurrences}.`);
await fs.writeFile(path,source.replace(before,after));
console.log('Corrected batch-four scheduled rounds to cover the recorded finish round.');

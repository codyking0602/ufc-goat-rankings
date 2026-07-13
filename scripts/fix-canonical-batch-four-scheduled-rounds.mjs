import fs from 'node:fs/promises';

const batchPath='assets/data/canonical-fighter-facts-batch-four.js';
let batchSource=await fs.readFile(batchPath,'utf8');
const oldBuilder='scheduledRounds:opt.s||3';
const fixedBuilder='scheduledRounds:Math.max(opt.s||3,round)';
const oldBuilderCount=batchSource.split(oldBuilder).length-1;
const fixedBuilderCount=batchSource.split(fixedBuilder).length-1;
if(oldBuilderCount===1&&fixedBuilderCount===0){
  batchSource=batchSource.replace(oldBuilder,fixedBuilder);
  await fs.writeFile(batchPath,batchSource);
}else if(!(oldBuilderCount===0&&fixedBuilderCount===1)){
  throw new Error(`Unexpected batch-four scheduled-round builder state: old=${oldBuilderCount}, fixed=${fixedBuilderCount}.`);
}

const testPath='scripts/test-canonical-fighter-facts-seven-person-batch-four.mjs';
let testSource=await fs.readFile(testPath,'utf8');
const oldAssertion="assert.equal(api.deriveFor('Jon Jones').lossExposure.throughPrimeUfcFights,16,'Jones through-prime exposure excludes the Cormier no contest');";
const fixedAssertion="assert.equal(api.deriveFor('Jon Jones').lossExposure.throughPrimeUfcFights,21,'Jones exposure through the prime endpoint includes pre-prime scored UFC bouts while excluding Hamill and the Cormier no contest');";
const oldAssertionCount=testSource.split(oldAssertion).length-1;
const fixedAssertionCount=testSource.split(fixedAssertion).length-1;
if(oldAssertionCount===1&&fixedAssertionCount===0){
  testSource=testSource.replace(oldAssertion,fixedAssertion);
  await fs.writeFile(testPath,testSource);
}else if(!(oldAssertionCount===0&&fixedAssertionCount===1)){
  throw new Error(`Unexpected Jones exposure assertion state: old=${oldAssertionCount}, fixed=${fixedAssertionCount}.`);
}

console.log('Batch-four source and Jones exposure assertion are normalized.');

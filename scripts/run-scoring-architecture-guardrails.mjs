import fs from 'node:fs';
import path from 'node:path';

const reportPath=path.resolve('docs/scoring-architecture-guardrails-report.json');
try{
  const contractPath=path.resolve('docs/scoring-architecture-contract.json');
  const contract=JSON.parse(fs.readFileSync(contractPath,'utf8'));
  const restoredRetiredPaths=(contract.retiredRuntimePaths||[]).filter(relative=>fs.existsSync(path.resolve(relative)));
  if(restoredRetiredPaths.length)throw new Error(`Retired scoring runtime paths were restored: ${restoredRetiredPaths.join(', ')}`);
  await import('./validate-scoring-architecture.mjs');
}catch(error){
  fs.mkdirSync(path.dirname(reportPath),{recursive:true});
  fs.writeFileSync(reportPath,`${JSON.stringify({
    generatedAt:new Date().toISOString(),
    fatalError:{message:error?.message||String(error),stack:error?.stack||null}
  },null,2)}\n`,'utf8');
  console.error(error?.stack||error);
  process.exitCode=1;
}

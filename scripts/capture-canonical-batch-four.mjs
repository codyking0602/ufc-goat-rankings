import fs from 'node:fs/promises';
import vm from 'node:vm';

const files=[
  'assets/data/canonical-fighter-facts.js',
  'assets/data/canonical-fighter-facts-batch-one.js',
  'assets/data/canonical-fighter-facts-batch-two.js',
  'assets/data/canonical-fighter-facts-batch-three.js',
  'assets/data/canonical-fighter-facts-batch-four.js'
];
const document={documentElement:{setAttribute(){}}};
const context=vm.createContext({window:{RANKING_DATA:{}},document,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean});
for(const file of files){
  const source=await fs.readFile(file,'utf8');
  vm.runInContext(source,context,{filename:file});
}
const api=context.window.UFC_CANONICAL_FIGHTER_FACTS;
const fighters=['Jon Jones','Georges St-Pierre','Demetrious Johnson','Anderson Silva','Islam Makhachev','Khabib Nurmagomedov','Alexander Volkanovski'];
const report={
  batch:context.window.UFC_CANONICAL_FIGHTER_FACTS_BATCH_FOUR,
  canonicalCount:api.count(),
  fighters:Object.fromEntries(fighters.map(fighter=>[fighter,{record:api.get(fighter),derived:api.deriveFor(fighter)}]))
};
await fs.writeFile('docs/canonical-batch-four-diagnostic.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({canonicalCount:report.canonicalCount,fighters:Object.fromEntries(fighters.map(name=>[name,report.fighters[name].derived]))},null,2));

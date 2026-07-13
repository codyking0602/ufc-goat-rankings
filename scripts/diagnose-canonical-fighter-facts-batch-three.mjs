import fs from 'node:fs/promises';
import vm from 'node:vm';

const outputPath='docs/canonical-fighter-facts-batch-three-diagnostic.json';
const files=[
  'assets/data/canonical-fighter-facts.js',
  'assets/data/canonical-fighter-facts-batch-one.js',
  'assets/data/canonical-fighter-facts-batch-two.js',
  'assets/data/canonical-fighter-facts-batch-three.js'
];
const fighters=['Fabricio Werdum','Glover Teixeira','Rashad Evans','Mauricio "Shogun" Rua','Forrest Griffin'];
const document={documentElement:{setAttribute(){}}};
const context=vm.createContext({window:{RANKING_DATA:{men:[],fighters:[],meta:{}}},document,console,Date,JSON,Map,Set,Object,Array,Number,String,Math,RegExp,Error,Boolean});
let report;
try{
  for(const file of files){
    const source=await fs.readFile(file,'utf8');
    vm.runInContext(source,context,{filename:file});
  }
  const api=context.window.UFC_CANONICAL_FIGHTER_FACTS;
  report={
    ok:true,
    batch:context.window.UFC_CANONICAL_FIGHTER_FACTS_BATCH_THREE,
    canonicalCount:api?.count?.(),
    audit:api?.audit?.(),
    fighters:Object.fromEntries(fighters.map(name=>[name,{record:api?.get?.(name),derived:api?.deriveFor?.(name)}]))
  };
}catch(error){
  report={ok:false,error:String(error?.message||error),stack:String(error?.stack||'')};
}
await fs.writeFile(outputPath,JSON.stringify(report,null,2)+'\n');
console.log(`Wrote ${outputPath}`);

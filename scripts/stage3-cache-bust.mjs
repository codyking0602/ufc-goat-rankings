import fs from 'node:fs/promises';

async function replaceInFile(path,replacements){
  let source=await fs.readFile(path,'utf8');
  for(const [before,after] of replacements){
    if(source.includes(after))continue;
    if(!source.includes(before))throw new Error(`Missing cache-bust pattern in ${path}: ${before}`);
    source=source.replace(before,after);
  }
  await fs.writeFile(path,source,'utf8');
}

await replaceInFile('index.html',[
  ['assets/data/display-overrides.js?v=display-overrides-20260710a-prime-record-clean','assets/data/display-overrides.js?v=display-overrides-20260713b-stage3-presentation-only']
]);

await replaceInFile('assets/data/ranking-data-patches.js',[
  ["const VERSION='ranking-data-patches-20260713x-stage3-loader-clean';","const VERSION='ranking-data-patches-20260713y-stage3-clean-packets';"],
  ['assets/data/fighter-packets/${slug}.js?v=fighter-packet-${slug}-${v}','assets/data/fighter-packets/${slug}.js?v=fighter-packet-${slug}-${v}-stage3-presentation-only']
]);

console.log('Stage 3 cache keys updated.');

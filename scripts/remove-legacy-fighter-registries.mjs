import fs from 'node:fs/promises';

const path='index.html';
let source=await fs.readFile(path,'utf8');
const tokens=[
  'assets/data/canonical-fighter-registry.js',
  'assets/data/canonical-fighter-registry-royce-gracie.js',
  'assets/data/canonical-fighter-registry-batch-eight-data.js',
  'assets/data/canonical-fighter-registry-batch-eight.js'
];

let removed=0;
source=source.split(/(?<=\n)/).filter(line=>{
  if(tokens.some(token=>line.includes(token))){removed+=1;return false;}
  return true;
}).join('');
if(removed!==tokens.length)throw new Error(`Expected ${tokens.length} legacy registry tags, removed ${removed}.`);
for(const token of tokens)if(source.includes(token))throw new Error(`Legacy registry reference remains: ${token}`);

source=source.replace(
  /assets\/data\/royce-watch-links\.js\?v=[^"]+/,
  'assets/data/royce-watch-links.js?v=royce-watch-links-20260715a-presentation-only'
);
source=source.replace(
  /assets\/data\/ranking-data-patches\.js\?v=[^"]+/,
  'assets/data/ranking-data-patches.js?v=ranking-data-patches-20260715c-verified-photo-paths'
);

const required=[
  'assets/data/canonical-fighter-registry-batch-eight-photos.js',
  'assets/data/royce-watch-links.js',
  'assets/data/ranking-data-patches.js',
  'assets/js/production-ranking-bootstrap.js',
  'assets/js/play.js',
  'assets/js/picks.js'
];
for(const token of required)if(!source.includes(token))throw new Error(`Required runtime reference missing: ${token}`);
const loader=source.indexOf('assets/data/ranking-data-patches.js');
const bootstrap=source.indexOf('assets/js/production-ranking-bootstrap.js');
if(loader<0||bootstrap<0||loader>=bootstrap)throw new Error('Permanent presentation-loader/bootstrap order is invalid.');

await fs.writeFile(path,source,'utf8');
console.log(JSON.stringify({removed,keptBatchEightPhotos:true,keptWatchLinks:true,loaderBeforeBootstrap:true},null,2));

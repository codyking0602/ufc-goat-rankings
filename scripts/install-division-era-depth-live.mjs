import fs from 'node:fs/promises';

const INDEX_PATH='index.html';
const LOSS_CONTEXT_TAG='  <script src="assets/data/loss-context-hybrid-live.js?v=loss-context-hybrid-live-20260711f-surface-ovr-sync"></script>';
const MODULES=[
  ['assets/data/division-era-depth-shadow.js','division-era-depth-shadow-20260712d-current-wfw-safe'],
  ['assets/data/division-era-depth-audit.js','division-era-depth-judgment-review-20260712b-live-approved'],
  ['assets/data/division-era-depth-live.js','division-era-depth-live-20260712a'],
  ['assets/data/division-era-depth-finalizer.js','division-era-depth-finalizer-20260712c-late-ready-sync']
];
const TAGS=MODULES.map(([path,version])=>`  <script src="${path}?v=${version}"></script>`);
const escapeRegex=value=>String(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

let html=await fs.readFile(INDEX_PATH,'utf8');
for(const [path] of MODULES){
  const pattern=new RegExp(`\\n?\\s*<script\\s+src=["']${escapeRegex(path)}(?:\\?[^"']*)?["']\\s*><\\/script>\\s*`,'g');
  html=html.replace(pattern,'\n');
}
if(!html.includes(LOSS_CONTEXT_TAG))throw new Error('Live Loss Context script tag not found; refusing to guess the era-depth insertion point.');
html=html.replace(LOSS_CONTEXT_TAG,`${LOSS_CONTEXT_TAG}\n${TAGS.join('\n')}`);
html=html.replace(/\n\s*<script src="assets\/data\/ranking-data-patches\.js/g,'\n  <script src="assets/data/ranking-data-patches.js');
await fs.writeFile(INDEX_PATH,html,'utf8');

const verified=await fs.readFile(INDEX_PATH,'utf8');
const positions=TAGS.map(tag=>verified.indexOf(tag));
const counts=MODULES.map(([path])=>(verified.match(new RegExp(escapeRegex(path),'g'))||[]).length);
if(positions.some(position=>position<0)||positions.some((position,index)=>index>0&&position<=positions[index-1])||counts.some(count=>count!==1)){
  throw new Error(`Division-Era Depth script verification failed: positions=${positions.join(',')}; counts=${counts.join(',')}`);
}
console.log(JSON.stringify({installed:true,index:INDEX_PATH,tags:TAGS,positions,counts},null,2));

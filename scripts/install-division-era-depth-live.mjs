import fs from 'node:fs/promises';

const INDEX_PATH='index.html';
const LOSS_CONTEXT_TAG='  <script src="assets/data/loss-context-hybrid-live.js?v=loss-context-hybrid-live-20260711f-surface-ovr-sync"></script>';
const TAGS=[
  '  <script src="assets/data/division-era-depth-shadow.js?v=division-era-depth-shadow-20260712d-current-wfw-safe"></script>',
  '  <script src="assets/data/division-era-depth-audit.js?v=division-era-depth-judgment-review-20260712b-live-approved"></script>',
  '  <script src="assets/data/division-era-depth-live.js?v=division-era-depth-live-20260712a"></script>',
  '  <script src="assets/data/division-era-depth-finalizer.js?v=division-era-depth-finalizer-20260712a"></script>'
];

let html=await fs.readFile(INDEX_PATH,'utf8');
for(const tag of TAGS){
  html=html.replace(new RegExp(`\\n?\\s*${tag.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\s*`,'g'),'\n');
}
if(!html.includes(LOSS_CONTEXT_TAG))throw new Error('Live Loss Context script tag not found; refusing to guess the era-depth insertion point.');
html=html.replace(LOSS_CONTEXT_TAG,`${LOSS_CONTEXT_TAG}\n${TAGS.join('\n')}`);
await fs.writeFile(INDEX_PATH,html,'utf8');

const verified=await fs.readFile(INDEX_PATH,'utf8');
const positions=TAGS.map(tag=>verified.indexOf(tag));
if(positions.some(position=>position<0)||positions.some((position,index)=>index>0&&position<=positions[index-1])){
  throw new Error('Division-Era Depth script order verification failed.');
}
console.log(JSON.stringify({installed:true,index:INDEX_PATH,tags:TAGS,positions},null,2));

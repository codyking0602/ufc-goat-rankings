import fs from 'node:fs';
import { chromium } from 'playwright';

const OUTPUT='assets/data/display-overrides.js';
const CALCULATED=new Set([
  'rank','allTimeRank','overallOvr','totalScore','rawScore','championship','opponentQuality',
  'primeDominance','longevity','apexPeak','penalty','lossPenalty','lossContext','eraDepthAdjustment',
  'snapshot','snapshotStats','packetProfileStats','legacyStats'
]);

function clean(value,key=''){
  if(value===null||value===undefined)return value;
  if(Array.isArray(value))return value.map(item=>clean(item)).filter(item=>item!==undefined);
  if(typeof value!=='object'){
    if(typeof value==='string'&&(key==='photoUrl'||key==='thumbUrl'))return value.split('?')[0];
    if(typeof value==='string')return value.replaceAll('résumé','resume').replaceAll('Résumé','Resume');
    return value;
  }
  const output={};
  for(const [field,nested] of Object.entries(value)){
    if(CALCULATED.has(field))continue;
    const next=clean(nested,field);
    if(next!==undefined)output[field]=next;
  }
  return output;
}

const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  await page.goto('http://127.0.0.1:4173/index.html',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>document.documentElement.getAttribute('data-scoring-pipeline')==='ready',null,{timeout:120000});
  await page.waitForTimeout(1000);
  const overrides=await page.evaluate(()=>JSON.parse(JSON.stringify(window.DISPLAY_OVERRIDES||{})));
  const cleaned=Object.fromEntries(Object.entries(clean(overrides)).sort(([a],[b])=>a.localeCompare(b)));
  if(!cleaned['Anthony Pettis'])throw new Error('Anthony Pettis runtime display override is missing.');
  if(cleaned['Anthony Pettis'].profileDisplayName!=='Anthony “Showtime” Pettis')throw new Error('Anthony Pettis nickname is missing from the runtime override.');
  const output=[
    '// App-facing copy, photos, links, and presentation-only overrides.',
    '// Calculated stats, totals, ranks, category ratings, and Resume Snapshot values come from ranking-pipeline.js.',
    `const DISPLAY_OVERRIDES = ${JSON.stringify(cleaned,null,2)};`,
    ''
  ].join('\n');
  fs.writeFileSync(OUTPUT,output);
  console.log(JSON.stringify({output:f=>f, fighterCount:Object.keys(cleaned).length, pettis:cleaned['Anthony Pettis']},null,2).replace('"output":"f=>f"',`"output":"${OUTPUT}"`));
}finally{
  await browser.close();
}

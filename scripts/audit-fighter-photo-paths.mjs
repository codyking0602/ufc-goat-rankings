import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root=process.cwd();
const fighterDir=path.join(root,'assets','fighters');
const available=fs.readdirSync(fighterDir).filter(name=>/\.webp$/i.test(name)).sort();
const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

function candidatesFor(fighter){
  const tokens=normalize(fighter).split(/\s+/).filter(token=>token.length>2&&!['junior','saint','pierre'].includes(token));
  return available
    .map(file=>({file,score:tokens.reduce((score,token)=>score+(normalize(file).includes(token)?1:0),0)}))
    .filter(item=>item.score>0)
    .sort((a,b)=>b.score-a.score||a.file.localeCompare(b.file))
    .slice(0,8)
    .map(item=>item.file);
}

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}});
try{
  await page.goto('http://127.0.0.1:4173/index.html',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>document.documentElement.getAttribute('data-scoring-pipeline')==='ready',null,{timeout:120000});
  const mappings=await page.evaluate(()=>{
    const data=window.RANKING_DATA||{};
    const names=[];
    const add=row=>{const name=typeof row==='string'?row:row?.fighter;if(name&&!names.includes(name))names.push(name);};
    (data.men||[]).forEach(add);
    (data.women||[]).forEach(add);
    (data.fighters||[]).forEach(add);
    return names.map(fighter=>({
      fighter,
      photoUrl:window.DISPLAY_OVERRIDES?.[fighter]?.photoUrl||null,
      thumbUrl:window.DISPLAY_OVERRIDES?.[fighter]?.thumbUrl||null
    }));
  });

  const missing=[];
  for(const row of mappings){
    for(const field of ['photoUrl','thumbUrl']){
      const url=row[field];
      const relative=String(url||'').split('?')[0].replace(/^\/+/, '');
      if(!relative||!fs.existsSync(path.join(root,relative))){
        missing.push({fighter:row.fighter,field,expected:url,candidates:candidatesFor(row.fighter)});
      }
    }
  }

  console.log('FIGHTER_PHOTO_PATH_AUDIT');
  console.log(JSON.stringify({fighterCount:mappings.length,availableWebpCount:available.length,missingCount:missing.length,missing},null,2));
  assert.equal(missing.length,0,`${missing.length} fighter photo paths are missing`);
}finally{
  await browser.close();
}

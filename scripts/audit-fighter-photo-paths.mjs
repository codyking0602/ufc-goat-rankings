import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const EXPECTED_FIGHTERS=79;
const root=process.cwd();
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}});
const pageErrors=[];
page.on('pageerror',error=>pageErrors.push(String(error?.message||error)));

try{
  await page.goto('http://127.0.0.1:4173/index.html',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>document.documentElement.getAttribute('data-scoring-pipeline')==='ready',null,{timeout:120000});
  await page.waitForFunction(expected=>window.UFC_PRODUCTION_RANKING_BOOTSTRAP?.photoSync?.mappedCount===expected,EXPECTED_FIGHTERS,{timeout:30000});
  await page.evaluate(()=>document.getElementById('whatsNewOverlay')?.remove());

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
  assert.equal(mappings.length,EXPECTED_FIGHTERS,`photo mapping covers all ${EXPECTED_FIGHTERS} fighters`);

  const missing=[];
  for(const row of mappings){
    for(const field of ['photoUrl','thumbUrl']){
      const relative=String(row[field]||'').split('?')[0].replace(/^\/+/, '');
      if(!relative||!fs.existsSync(path.join(root,relative)))missing.push({fighter:row.fighter,field,url:row[field]});
    }
  }

  const decodeFailures=[];
  for(const row of mappings){
    for(const field of ['photoUrl','thumbUrl']){
      const result=await page.evaluate(async url=>{
        if(!url)return{ok:false,reason:'empty'};
        const response=await fetch(`${url}${url.includes('?')?'&':'?'}audit=${Date.now()}-${Math.random()}`,{cache:'no-store'}).catch(error=>({ok:false,status:0,error:String(error)}));
        if(!response?.ok)return{ok:false,reason:'http',status:response?.status||0,error:response?.error||null};
        const blob=await response.blob();
        return await new Promise(resolve=>{
          const image=new Image();
          const objectUrl=URL.createObjectURL(blob);
          image.onload=()=>{const output={ok:image.naturalWidth>0&&image.naturalHeight>0,width:image.naturalWidth,height:image.naturalHeight};URL.revokeObjectURL(objectUrl);resolve(output);};
          image.onerror=()=>{URL.revokeObjectURL(objectUrl);resolve({ok:false,reason:'decode'});};
          image.src=objectUrl;
        });
      },row[field]);
      if(!result.ok)decodeFailures.push({fighter:row.fighter,field,url:row[field],...result});
    }
  }

  const boardRenderFailures=[];
  for(const view of ['men','women']){
    await page.evaluate(view=>document.querySelector(`.tab[data-view="${view}"]`)?.click(),view);
    const container=view==='men'?'#menList':'#womenList';
    await page.waitForTimeout(300);
    const states=await page.locator(`${container} .fighter-row`).evaluateAll(rows=>rows.map(row=>{
      const img=row.querySelector('.row-photo img');
      return{fighter:row.dataset.fighter,src:img?.getAttribute('src')||null,complete:Boolean(img?.complete),naturalWidth:Number(img?.naturalWidth||0)};
    }));
    boardRenderFailures.push(...states.filter(row=>!row.src||!row.complete||row.naturalWidth<=0));
  }

  await page.evaluate(()=>window.openFighter?.('Brandon Moreno'));
  await page.waitForFunction(()=>{
    const img=document.querySelector('#fighterDetail .fighter-photo img');
    return Boolean(img&&img.complete&&img.naturalWidth>0);
  },null,{timeout:15000});
  const morenoProfile=await page.evaluate(()=>({
    heading:document.querySelector('#fighterDetail h2')?.textContent?.trim()||null,
    src:document.querySelector('#fighterDetail .fighter-photo img')?.getAttribute('src')||null,
    watch:document.querySelector('#fighterDetail .watch-moment-link')?.href||null,
    signature:[...document.querySelectorAll('#fighterDetail a')].find(link=>/signature fight/i.test(link.textContent||''))?.href||null
  }));

  const runtime=await page.evaluate(()=>({
    bootstrapPhotoSync:window.UFC_PRODUCTION_RANKING_BOOTSTRAP?.photoSync||null,
    finalPhotoSync:window.UFC_CALCULATED_ROSTER_PHOTO_SYNC||null
  }));
  console.log('FIGHTER_PHOTO_RENDER_AUDIT');
  console.log(JSON.stringify({fighterCount:mappings.length,missing,decodeFailures,boardRenderFailures,morenoProfile,...runtime,pageErrors},null,2));

  assert.equal(missing.length,0,`${missing.length} fighter photo paths are missing`);
  assert.equal(decodeFailures.length,0,`${decodeFailures.length} fighter images fail decoding`);
  assert.equal(boardRenderFailures.length,0,`${boardRenderFailures.length} leaderboard photos fail rendering`);
  assert.match(morenoProfile.heading||'',/Brandon.*The Assassin Baby.*Moreno/);
  assert.match(morenoProfile.src||'',/brandon-moreno\.webp/);
  assert.deepEqual(pageErrors,[],'photo audit has no uncaught page errors');
}finally{
  await browser.close();
}
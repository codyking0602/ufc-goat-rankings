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
const pageErrors=[];
page.on('pageerror',error=>pageErrors.push(String(error?.message||error)));
try{
  await page.goto('http://127.0.0.1:4173/index.html',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>document.documentElement.getAttribute('data-scoring-pipeline')==='ready',null,{timeout:120000});
  await page.waitForFunction(()=>window.UFC_CALCULATED_ROSTER_PHOTO_SYNC?.mappedCount===73,null,{timeout:30000});
  await page.waitForTimeout(1000);

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

  const decodeFailures=[];
  for(const row of mappings){
    for(const field of ['photoUrl','thumbUrl']){
      const result=await page.evaluate(async ({url})=>{
        if(!url)return{ok:false,reason:'empty-url'};
        const response=await fetch(url,{cache:'no-store'}).catch(error=>({ok:false,status:0,error:String(error)}));
        if(!response?.ok)return{ok:false,reason:'http',status:response?.status||0,error:response?.error||null};
        return await new Promise(resolve=>{
          const image=new Image();
          image.onload=()=>resolve({ok:image.naturalWidth>0&&image.naturalHeight>0,width:image.naturalWidth,height:image.naturalHeight});
          image.onerror=()=>resolve({ok:false,reason:'decode'});
          image.src=`${url}${url.includes('?')?'&':'?'}audit=${Date.now()}-${Math.random()}`;
        });
      },{url:row[field]});
      if(!result.ok)decodeFailures.push({fighter:row.fighter,field,url:row[field],...result});
    }
  }

  await page.evaluate(()=>window.refresh?.());
  await page.waitForTimeout(750);
  const rendered=await page.evaluate(()=>{
    const inspect=container=>Array.from(document.querySelectorAll(`${container} .fighter-row`)).map(row=>{
      const fighter=row.dataset.fighter;
      const img=row.querySelector('.row-photo img');
      return{fighter,hasImage:Boolean(img),src:img?.getAttribute('src')||null,complete:Boolean(img?.complete),naturalWidth:Number(img?.naturalWidth||0),text:row.querySelector('.row-photo')?.textContent?.trim()||''};
    });
    return{men:inspect('#menList'),women:inspect('#womenList')};
  });
  const renderedFailures=[...rendered.men,...rendered.women].filter(row=>!row.hasImage||!row.complete||row.naturalWidth<=0);

  const named=['Cris Cyborg','Lyoto Machida','Justin Gaethje','Frank Shamrock'];
  const namedState=mappings.filter(row=>named.includes(row.fighter)).map(mapping=>({
    ...mapping,
    rendered:[...rendered.men,...rendered.women].find(row=>row.fighter===mapping.fighter)||null
  }));

  console.log('FIGHTER_PHOTO_RENDER_AUDIT');
  console.log(JSON.stringify({
    fighterCount:mappings.length,
    availableWebpCount:available.length,
    pathMissingCount:missing.length,
    decodeFailureCount:decodeFailures.length,
    renderedFailureCount:renderedFailures.length,
    photoSync:await page.evaluate(()=>window.UFC_CALCULATED_ROSTER_PHOTO_SYNC||null),
    namedState,
    missing,
    decodeFailures,
    renderedFailures,
    pageErrors
  },null,2));
  assert.equal(missing.length,0,`${missing.length} fighter photo paths are missing`);
  assert.equal(decodeFailures.length,0,`${decodeFailures.length} fighter images fail browser decoding`);
  assert.equal(renderedFailures.length,0,`${renderedFailures.length} leaderboard fighter photos fail rendering`);
  assert.deepEqual(pageErrors,[],'photo audit has no uncaught page errors');
}finally{
  await browser.close();
}

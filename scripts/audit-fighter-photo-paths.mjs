import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const EXPECTED_FIGHTERS=79;
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
const page=await browser.newPage({viewport:{width:390,height:844}});
const pageErrors=[];
page.on('pageerror',error=>pageErrors.push(String(error?.message||error)));
try{
  await page.goto('http://127.0.0.1:4173/index.html',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>document.documentElement.getAttribute('data-scoring-pipeline')==='ready',null,{timeout:120000});
  await page.waitForFunction(expected=>window.UFC_PRODUCTION_RANKING_BOOTSTRAP?.photoSync?.mappedCount===expected,EXPECTED_FIGHTERS,{timeout:30000});

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
      const url=row[field];
      const relative=String(url||'').split('?')[0].replace(/^\/+/, '');
      if(!relative||!fs.existsSync(path.join(root,relative))){
        missing.push({fighter:row.fighter,field,expected:url,candidates:candidatesFor(row.fighter)});
      }
    }
  }

  const scrollFailures=[];
  const boardNames={
    men:await page.locator('#menList .fighter-row').evaluateAll(rows=>rows.map(row=>row.dataset.fighter)),
    women:await page.locator('#womenList .fighter-row').evaluateAll(rows=>rows.map(row=>row.dataset.fighter))
  };
  for(const [board,names] of Object.entries(boardNames)){
    if(board==='women')await page.locator('.tab[data-view="women"]').click();
    for(const fighter of names){
      const row=page.locator(`${board==='men'?'#menList':'#womenList'} .fighter-row[data-fighter="${fighter.replace(/"/g,'\\"')}"]`);
      await row.scrollIntoViewIfNeeded();
      try{
        await page.waitForFunction(({container,fighter})=>{
          const rows=[...document.querySelectorAll(`${container} .fighter-row`)];
          const row=rows.find(item=>item.dataset.fighter===fighter);
          const img=row?.querySelector('.row-photo img');
          return Boolean(img&&img.complete&&img.naturalWidth>0);
        },{container:board==='men'?'#menList':'#womenList',fighter},{timeout:5000,polling:100});
      }catch{
        scrollFailures.push(await row.evaluate(element=>{
          const img=element.querySelector('.row-photo img');
          return{fighter:element.dataset.fighter,hasImage:Boolean(img),src:img?.getAttribute('src')||null,complete:Boolean(img?.complete),naturalWidth:Number(img?.naturalWidth||0),text:element.querySelector('.row-photo')?.textContent?.trim()||''};
        }));
      }
    }
  }

  const profileFailures=[];
  const named=['Cris Cyborg','Lyoto Machida','Justin Gaethje','Frank Shamrock','Brandon Moreno'];
  const profileStates=[];
  for(const fighter of named){
    await page.evaluate(name=>window.openFighter?.(name),fighter);
    try{
      await page.waitForFunction(()=>{
        const img=document.querySelector('#fighterDetail .fighter-photo img');
        return Boolean(img&&img.complete&&img.naturalWidth>0);
      },null,{timeout:15000,polling:200});
    }catch{
      profileFailures.push(fighter);
    }
    profileStates.push(await page.evaluate(name=>{
      const img=document.querySelector('#fighterDetail .fighter-photo img');
      return{fighter:name,heading:document.querySelector('#fighterDetail h2')?.textContent?.trim()||null,hasImage:Boolean(img),src:img?.getAttribute('src')||null,complete:Boolean(img?.complete),naturalWidth:Number(img?.naturalWidth||0)};
    },fighter));
    await page.evaluate(()=>document.getElementById('closeDrawer')?.click());
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

  const namedState=mappings.filter(row=>named.includes(row.fighter)).map(mapping=>({
    ...mapping,
    scrollFailure:scrollFailures.find(row=>row.fighter===mapping.fighter)||null,
    profile:profileStates.find(row=>row.fighter===mapping.fighter)||null
  }));

  const runtime=await page.evaluate(()=>({
    bootstrapPhotoSync:window.UFC_PRODUCTION_RANKING_BOOTSTRAP?.photoSync||null,
    finalPhotoSync:window.UFC_CALCULATED_ROSTER_PHOTO_SYNC||null
  }));

  console.log('FIGHTER_PHOTO_RENDER_AUDIT');
  console.log(JSON.stringify({
    fighterCount:mappings.length,
    availableWebpCount:available.length,
    pathMissingCount:missing.length,
    decodeFailureCount:decodeFailures.length,
    scrollFailureCount:scrollFailures.length,
    profileFailureCount:profileFailures.length,
    ...runtime,
    namedState,
    missing,
    decodeFailures,
    scrollFailures,
    profileFailures,
    pageErrors
  },null,2));
  assert.equal(missing.length,0,`${missing.length} fighter photo paths are missing`);
  assert.equal(scrollFailures.length,0,`${scrollFailures.length} fighter thumbnails fail after scrolling into view`);
  assert.equal(profileFailures.length,0,`${profileFailures.length} named profile photos fail rendering`);
  assert.equal(decodeFailures.length,0,`${decodeFailures.length} fighter images fail browser decoding`);
  assert.deepEqual(pageErrors,[],'photo audit has no uncaught page errors');
}finally{
  await browser.close();
}
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const root=path.resolve(process.cwd());
const outputDir=path.join(root,'assets','fighters');
const reportPath=path.join(root,'assets','fighters','okc-photo-import-report.json');
const userAgent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36 UFC-Goat-Rankings/1.0';

const fighters=[
  {name:'Tabatha Ricci',slug:'tabatha-ricci'},
  {name:'Fatima Kline',slug:'fatima-kline'},
  {name:'Tommy McMillen',slug:'tommy-mcmillen'},
  {name:'Alberto Montes',slug:'alberto-montes'},
  {name:'Chase Hooper',slug:'chase-hooper'},
  {name:'Mitch Ramirez',slug:'mitch-ramirez'},
  {name:'Jared Cannonier',slug:'jared-cannonier'},
  {name:'Christian Leroy Duncan',slug:'christian-leroy-duncan'},
  {name:'Brad Tavares',slug:'brad-tavares'},
  {name:'Marc-André Barriault',slug:'marc-andre-barriault'}
];

function decodeHtml(value=''){
  return String(value)
    .replace(/&amp;/g,'&')
    .replace(/&#x2F;/gi,'/')
    .replace(/&quot;/g,'"')
    .replace(/\\u002F/g,'/')
    .replace(/\\\//g,'/');
}

function collectStrings(value,out=[]){
  if(typeof value==='string') out.push(value);
  else if(Array.isArray(value)) value.forEach(item=>collectStrings(item,out));
  else if(value && typeof value==='object') Object.values(value).forEach(item=>collectStrings(item,out));
  return out;
}

async function fetchOk(url,options={}){
  const response=await fetch(url,{
    redirect:'follow',
    ...options,
    headers:{
      'user-agent':userAgent,
      'accept':'text/html,application/xhtml+xml,application/json,image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      'accept-language':'en-US,en;q=0.9',
      ...(options.headers || {})
    }
  });
  if(!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return response;
}

function scoreImageUrl(url){
  const lower=url.toLowerCase();
  let score=0;
  if(lower.includes('dmxg5wxfqgb4u.cloudfront.net')) score+=80;
  if(lower.includes('espncdn.com/i/headshots/mma')) score+=75;
  if(lower.includes('athlete')) score+=20;
  if(lower.includes('headshot')) score+=30;
  if(lower.includes('full_body') || lower.includes('full-body')) score+=18;
  if(lower.includes('profile')) score+=12;
  if(/\.(png|jpe?g|webp)(\?|$)/i.test(url)) score+=10;
  if(lower.includes('logo') || lower.includes('event') || lower.includes('hero') || lower.includes('background')) score-=70;
  return score;
}

function extractUfcImages(html){
  const candidates=[];
  for(const pattern of [
    /<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["']/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)["']/gi,
    /(https?:\\?\/\\?\/[^"]+(?:dmxg5wxfqgb4u\.cloudfront\.net|ufc\.com)[^"]+?\.(?:png|jpe?g|webp)(?:\?[^"']*)?)/gi
  ]){
    let match;
    while((match=pattern.exec(html))) candidates.push(decodeHtml(match[1] || match[0]));
  }
  return [...new Set(candidates.filter(url=>/^https?:\/\//i.test(url)))].sort((a,b)=>scoreImageUrl(b)-scoreImageUrl(a));
}

async function ufcCandidates(fighter){
  const urls=[
    `https://www.ufc.com/athlete/${fighter.slug}`,
    `https://www.ufc.com/athlete/${fighter.slug}?language_content_entity=en`
  ];
  const found=[];
  for(const pageUrl of urls){
    try{
      const response=await fetchOk(pageUrl,{headers:{referer:'https://www.ufc.com/athletes/all'}});
      const html=await response.text();
      found.push(...extractUfcImages(html));
    }catch(error){
      console.warn(`[UFC] ${fighter.name}: ${error.message}`);
    }
  }
  return [...new Set(found)];
}

function exactNameMatch(value,name){
  const normalize=input=>String(input || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  return normalize(value)===normalize(name);
}

async function espnCandidates(fighter){
  const endpoints=[
    `https://site.web.api.espn.com/apis/search/v2?region=us&lang=en&query=${encodeURIComponent(fighter.name)}&limit=20`,
    `https://site.api.espn.com/apis/search/v2?query=${encodeURIComponent(fighter.name)}&limit=20`,
    'https://site.api.espn.com/apis/site/v2/sports/mma/ufc/athletes?limit=1000'
  ];
  const found=[];
  for(const endpoint of endpoints){
    try{
      const response=await fetchOk(endpoint,{headers:{accept:'application/json'}});
      const data=await response.json();
      const strings=collectStrings(data);
      for(const value of strings){
        const decoded=decodeHtml(value);
        if(/https?:\/\/a\.espncdn\.com\/i\/headshots\/mma\/players\/full\/\d+\.(?:png|jpe?g|webp)/i.test(decoded)) found.push(decoded.match(/https?:\/\/a\.espncdn\.com\/i\/headshots\/mma\/players\/full\/\d+\.(?:png|jpe?g|webp)/i)[0]);
        const idMatch=decoded.match(/espn\.com\/mma\/fighter\/_\/id\/(\d+)/i);
        if(idMatch) found.push(`https://a.espncdn.com/i/headshots/mma/players/full/${idMatch[1]}.png`);
      }
      const text=JSON.stringify(data);
      if(!text.toLowerCase().includes(fighter.name.split(' ')[0].toLowerCase())) continue;
    }catch(error){
      console.warn(`[ESPN] ${fighter.name}: ${error.message}`);
    }
  }
  return [...new Set(found)].sort((a,b)=>scoreImageUrl(b)-scoreImageUrl(a));
}

async function imageBuffer(url,pageUrl){
  const response=await fetchOk(url,{headers:{referer:pageUrl || 'https://www.ufc.com/'}});
  const type=response.headers.get('content-type') || '';
  if(!type.startsWith('image/')) throw new Error(`Non-image response (${type || 'unknown'})`);
  const buffer=Buffer.from(await response.arrayBuffer());
  if(buffer.length<4000) throw new Error(`Image too small (${buffer.length} bytes)`);
  return buffer;
}

async function saveThumb(buffer,destination){
  const source=sharp(buffer,{failOn:'error'}).rotate();
  const metadata=await source.metadata();
  if(!metadata.width || !metadata.height) throw new Error('Missing image dimensions');
  await source
    .resize(160,160,{fit:'cover',position:sharp.strategy.attention})
    .webp({quality:88,smartSubsample:true})
    .toFile(destination);
  const output=await sharp(destination).metadata();
  if(output.format!=='webp' || output.width!==160 || output.height!==160) throw new Error('Invalid output thumbnail');
}

async function importFighter(fighter){
  const destination=path.join(outputDir,`${fighter.slug}-thumb.webp`);
  const ufc=await ufcCandidates(fighter);
  const espn=await espnCandidates(fighter);
  const candidates=[...ufc.map(url=>({url,source:'UFC'})),...espn.map(url=>({url,source:'ESPN'}))];
  const errors=[];
  for(const candidate of candidates){
    try{
      const buffer=await imageBuffer(candidate.url,candidate.source==='UFC'?`https://www.ufc.com/athlete/${fighter.slug}`:'https://www.espn.com/mma/');
      await saveThumb(buffer,destination);
      console.log(`Imported ${fighter.name} from ${candidate.source}: ${candidate.url}`);
      return {name:fighter.name,file:path.relative(root,destination),source:candidate.source,sourceUrl:candidate.url,status:'imported'};
    }catch(error){
      errors.push(`${candidate.source}: ${error.message}`);
    }
  }
  console.warn(`No official thumbnail imported for ${fighter.name}`);
  return {name:fighter.name,file:path.relative(root,destination),status:'missing',errors};
}

await fs.mkdir(outputDir,{recursive:true});
const results=[];
for(const fighter of fighters) results.push(await importFighter(fighter));
const report={generatedAt:new Date().toISOString(),fighters:results};
await fs.writeFile(reportPath,`${JSON.stringify(report,null,2)}\n`,'utf8');
const imported=results.filter(item=>item.status==='imported').length;
console.log(`Imported ${imported}/${fighters.length} official fighter thumbnails.`);
if(imported<6) process.exitCode=1;

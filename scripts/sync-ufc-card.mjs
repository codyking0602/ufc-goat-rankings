import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {createHash} from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {chromium} from 'playwright';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const CONFIG_PATH=process.env.UFC_CARD_SOURCES_FILE || path.join(ROOT,'config','ufc-card-sources.json');
const OUTPUT_DIR=process.env.UFC_CARD_SYNC_ARTIFACT_DIR || path.join(ROOT,'artifacts','ufc-card-sync');
const APPLY=process.argv.includes('--apply');
const FORCE=process.argv.includes('--force');
const CAPTURE_DELAY_MS=Number(process.env.UFC_CARD_CONFIRM_DELAY_MS || 5000);
const NAVIGATION_TIMEOUT_MS=Number(process.env.UFC_CARD_NAVIGATION_TIMEOUT_MS || 45000);
const ENDPOINT=process.env.CARD_SYNC_ENDPOINT || '';
const SECRET=process.env.CARD_SYNC_SECRET || '';

fs.mkdirSync(OUTPUT_DIR,{recursive:true});

function normalizeSpace(value){
  return String(value || '').replace(/\s+/g,' ').trim();
}

function normalizeName(value){
  return normalizeSpace(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .toLowerCase()
    .replace(/\b(jr|sr|ii|iii|iv)\b/g,'')
    .replace(/[^a-z0-9]+/g,'')
    .trim();
}

function slug(value){
  return normalizeSpace(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'')
    .slice(0,36);
}

function matchupKey(first,second){
  return [normalizeName(first),normalizeName(second)].sort().join('|');
}

function isMainSection(value){
  return ['Main Card','Main Event'].includes(String(value || ''));
}

function expectedMainCount(config){
  if(config.eventType==='numbered' || /full card/i.test(String(config.cardRule || ''))) return 0;
  const count=Number(config.mainCardFightCount);
  if(!Number.isInteger(count) || count<1) throw new Error(`Missing valid mainCardFightCount for ${config.eventId}`);
  return count;
}

function weightClassFromPounds(value){
  return ({
    '115':'Strawweight','125':'Flyweight','135':'Bantamweight','145':'Featherweight',
    '155':'Lightweight','165':'Catchweight','170':'Welterweight','175':'Catchweight',
    '185':'Middleweight','195':'Catchweight','205':'Light Heavyweight','225':'Catchweight','265':'Heavyweight'
  })[String(value)] || 'TBD';
}

export function parseMmaManiaText(articleText){
  const lines=String(articleText || '')
    .split(/\n+/)
    .map(line=>normalizeSpace(line))
    .filter(Boolean);
  let section='';
  const rows=[];

  for(const line of lines){
    const lower=line.toLowerCase();
    if(lower.includes('main event') && !lower.includes('original card')){
      section='Main Event';
      continue;
    }
    if(lower.includes('main card') && !lower.includes('main event')){
      section='Main Card';
      continue;
    }
    if(lower.includes('prelim') && lower.includes('card')){
      section='Prelims';
      continue;
    }
    if(!section) continue;

    const match=line.match(/^(\d{3})\s*lbs?\.?\s*:\s*(.+?)\s+vs\.?\s+(.+)$/i);
    if(!match) continue;
    const red=normalizeSpace(match[2]);
    const blue=normalizeSpace(match[3].replace(/\s*\([^)]*\)\s*$/,''));
    if(!red || !blue || normalizeName(red)===normalizeName(blue)) continue;
    rows.push({
      red_name:red,
      blue_name:blue,
      weight_class:weightClassFromPounds(match[1]),
      card_section:section,
      source_index:rows.length,
    });
  }

  return rows;
}

function chronologicalFights(rawFights,config){
  const seen=new Set();
  const cleaned=[];
  const expectedMainKey=matchupKey(config.expectedMainEvent?.[0],config.expectedMainEvent?.[1]);

  for(const raw of rawFights){
    const pair=matchupKey(raw.red_name,raw.blue_name);
    if(!pair || seen.has(pair)) continue;
    seen.add(pair);
    let section=raw.card_section;
    if(pair===expectedMainKey){
      if(section!=='Main Event') throw new Error(`Expected main event is not under the MMA Mania main-event heading for ${config.eventId}`);
      section='Main Event';
    }
    cleaned.push({...raw,card_section:section});
  }

  const prelims=cleaned.filter(fight=>fight.card_section==='Prelims').reverse();
  const main=cleaned.filter(fight=>fight.card_section==='Main Card').reverse();
  const mainEvent=cleaned.filter(fight=>fight.card_section==='Main Event').reverse();
  const ordered=[...prelims,...main,...mainEvent];
  const sectionStarts=config.sectionStarts || {};
  const defaultBoutMinutes=Math.max(15,Number(config.defaultBoutMinutes || 30));

  for(const [sectionName,fights] of [
    ['Prelims',prelims],
    ['Main Card',[...main,...mainEvent]],
  ]){
    if(!fights.length) continue;
    const startMs=new Date(sectionStarts[sectionName]).getTime();
    if(!Number.isFinite(startMs)) throw new Error(`Missing or invalid ${sectionName} start time for ${config.eventId}`);
    const nextStartMs=sectionName==='Prelims' ? new Date(sectionStarts['Main Card']).getTime() : NaN;
    let intervalMinutes=defaultBoutMinutes;
    if(Number.isFinite(nextStartMs)&&nextStartMs>startMs){
      intervalMinutes=Math.max(15,Math.min(defaultBoutMinutes,Math.floor((nextStartMs-startMs)/60000/fights.length)));
    }
    fights.forEach((fight,index)=>{
      fight.lock_at=new Date(startMs+(index*intervalMinutes*60000)).toISOString();
    });
  }

  return ordered.map((fight,index)=>({
    id:`${config.idPrefix || slug(config.eventId)}-${slug(fight.red_name)}-${slug(fight.blue_name)}`.slice(0,120),
    bout_order:index+1,
    card_section:fight.card_section,
    weight_class:fight.weight_class,
    red_name:fight.red_name,
    blue_name:fight.blue_name,
    lock_at:fight.lock_at,
  }));
}

function signature(snapshot){
  return createHash('sha256').update(JSON.stringify(snapshot.fights.map(fight=>({
    pair:matchupKey(fight.red_name,fight.blue_name),
    section:fight.card_section,
    order:fight.bout_order,
    weight:fight.weight_class,
  })))).digest('hex');
}

function validateSnapshot(snapshot,config){
  const failures=[];
  if(!snapshot.sourceUrl || new URL(snapshot.sourceUrl).hostname.replace(/^www\./,'')!=='mmamania.com') failures.push('invalid-source-url');
  if(snapshot.fights.length<Number(config.minFights || 5)) failures.push(`too-few-fights:${snapshot.fights.length}`);
  const expectedMainKey=matchupKey(config.expectedMainEvent?.[0],config.expectedMainEvent?.[1]);
  if(expectedMainKey && !snapshot.fights.some(fight=>matchupKey(fight.red_name,fight.blue_name)===expectedMainKey&&fight.card_section==='Main Event')) failures.push('expected-main-event-missing');
  const mainCount=snapshot.fights.filter(fight=>isMainSection(fight.card_section)).length;
  const requiredMain=expectedMainCount(config);
  if(requiredMain && mainCount!==requiredMain) failures.push(`main-card-count-mismatch:${mainCount}!=${requiredMain}`);
  if(snapshot.fights.some(fight=>!fight.card_section||!fight.red_name||!fight.blue_name||!fight.lock_at)) failures.push('incomplete-fight-row');
  const pairs=new Set(snapshot.fights.map(fight=>matchupKey(fight.red_name,fight.blue_name)));
  if(pairs.size!==snapshot.fights.length) failures.push('duplicate-matchups');
  if(failures.length) throw new Error(`Snapshot validation failed for ${config.eventId}: ${failures.join(', ')}`);
}

async function gotoWithRetry(page,url){
  let lastError;
  for(let attempt=1;attempt<=3;attempt+=1){
    try{
      const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:NAVIGATION_TIMEOUT_MS});
      if(response && response.status()>=400) throw new Error(`HTTP ${response.status()} for ${url}`);
      await page.waitForTimeout(2500);
      return;
    }catch(error){
      lastError=error;
      if(attempt<3) await page.waitForTimeout(1500*attempt);
    }
  }
  throw lastError;
}

function configuredSource(config){
  const sources=(config.fallbackSources || []).filter(source=>source?.type==='mma-mania'&&source?.url);
  if(sources.length!==1) throw new Error(`Exactly one MMA Mania source is required for ${config.eventId}`);
  return sources[0];
}

async function captureSource(browser,config,captureLabel){
  const source=configuredSource(config);
  const page=await browser.newPage({
    userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36',
    locale:'en-US',
    viewport:{width:1440,height:1400},
  });
  page.setDefaultTimeout(NAVIGATION_TIMEOUT_MS);
  try{
    await gotoWithRetry(page,source.url);
    const root=page.locator('article, main, body').first();
    const articleText=await root.innerText();
    const fights=chronologicalFights(parseMmaManiaText(articleText),config);
    const snapshot={
      sourceType:'mma-mania',
      sourceUrl:source.url,
      observedAt:new Date().toISOString(),
      event:{
        id:config.eventId,
        name:config.name,
        subtitle:config.subtitle,
        event_type:config.eventType,
        event_date:config.eventDate,
        location:config.location,
        card_rule:config.cardRule,
        status:config.status,
        source_note:`Externally synced from MMA Mania at ${new Date().toISOString()}`,
      },
      fights,
    };
    validateSnapshot(snapshot,config);
    return snapshot;
  }catch(error){
    const safeName=`${slug(config.eventId)}-${captureLabel}-mma-mania`;
    try{
      fs.writeFileSync(path.join(OUTPUT_DIR,`${safeName}.html`),await page.content());
      await page.screenshot({path:path.join(OUTPUT_DIR,`${safeName}.png`),fullPage:true});
    }catch(_artifactError){}
    throw error;
  }finally{
    await page.close();
  }
}

async function confirmedSnapshot(browser,config){
  const first=await captureSource(browser,config,'first');
  await new Promise(resolve=>setTimeout(resolve,CAPTURE_DELAY_MS));
  const second=await captureSource(browser,config,'second');
  const firstSignature=signature(first);
  const secondSignature=signature(second);
  if(firstSignature!==secondSignature) throw new Error(`Two MMA Mania captures disagreed for ${config.eventId}: ${firstSignature} vs ${secondSignature}`);
  return {...second,confirmed:true,confirmationHash:secondSignature};
}

async function postSnapshot(snapshot,config){
  if(!APPLY) return {dryRun:true};
  if(!ENDPOINT || !SECRET) throw new Error('CARD_SYNC_ENDPOINT and CARD_SYNC_SECRET are required with --apply');
  const response=await fetch(ENDPOINT,{
    method:'POST',
    headers:{'content-type':'application/json','x-card-sync-secret':SECRET},
    body:JSON.stringify({
      ...snapshot,
      validation:{
        minFights:Number(config.minFights || 5),
        expectedMainEvent:config.expectedMainEvent || [],
        expectedMainCardFights:expectedMainCount(config),
      },
    }),
  });
  const text=await response.text();
  let body;
  try{body=JSON.parse(text);}catch(_error){body={raw:text};}
  if(!response.ok) throw new Error(`Supabase card sync failed (${response.status}): ${JSON.stringify(body)}`);
  return body;
}

async function main(){
  const parsed=JSON.parse(fs.readFileSync(CONFIG_PATH,'utf8'));
  const events=Array.isArray(parsed.events) ? parsed.events : [];
  if(!events.length) throw new Error('No MMA Mania card sources are configured');
  events.forEach(config=>{expectedMainCount(config);configuredSource(config);});
  const now=Date.now();
  const active=events.filter(event=>FORCE || !event.syncUntil || now<new Date(event.syncUntil).getTime());
  if(!active.length){
    console.log('No active MMA Mania card sources need synchronization.');
    return;
  }

  const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage','--no-sandbox']});
  const report=[];
  try{
    for(const config of active){
      const snapshot=await confirmedSnapshot(browser,config);
      const result=await postSnapshot(snapshot,config);
      const reportRow={
        eventId:config.eventId,
        sourceType:snapshot.sourceType,
        sourceUrl:snapshot.sourceUrl,
        fights:snapshot.fights.length,
        mainCardFights:snapshot.fights.filter(fight=>isMainSection(fight.card_section)).length,
        requiredMainCardFights:expectedMainCount(config),
        confirmationHash:snapshot.confirmationHash,
        applied:APPLY,
        result,
      };
      report.push(reportRow);
      console.log(JSON.stringify(reportRow,null,2));
    }
  }finally{
    await browser.close();
  }
  fs.writeFileSync(path.join(OUTPUT_DIR,'card-sync-report.json'),JSON.stringify({generatedAt:new Date().toISOString(),report},null,2));
}

const directEntry=process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href;
if(directEntry){
  main().catch(error=>{
    console.error(error.stack || error.message || String(error));
    process.exit(1);
  });
}

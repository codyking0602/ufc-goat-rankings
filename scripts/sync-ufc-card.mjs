import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';

const ROOT=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
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

function canonicalSection(value){
  const text=normalizeSpace(value).toLowerCase();
  if(text.includes('early') && text.includes('prelim')) return 'Early Prelims';
  if(text.includes('prelim')) return 'Prelims';
  if(text.includes('co-main') || text.includes('co main')) return 'Co-Main Event';
  if(text.includes('main event')) return 'Main Event';
  if(text.includes('main')) return 'Main Card';
  return '';
}

function weightClassFromText(value){
  const text=normalizeSpace(value);
  const lower=text.toLowerCase();
  const named=[
    ["women's strawweight","Women's Strawweight"],
    ["women’s strawweight","Women's Strawweight"],
    ["women's flyweight","Women's Flyweight"],
    ["women’s flyweight","Women's Flyweight"],
    ["women's bantamweight","Women's Bantamweight"],
    ["women’s bantamweight","Women's Bantamweight"],
    ['light heavyweight','Light Heavyweight'],
    ['super heavyweight','Super Heavyweight'],
    ['heavyweight','Heavyweight'],
    ['middleweight','Middleweight'],
    ['welterweight','Welterweight'],
    ['lightweight','Lightweight'],
    ['featherweight','Featherweight'],
    ['bantamweight','Bantamweight'],
    ['flyweight','Flyweight'],
    ['strawweight','Strawweight'],
    ['catchweight','Catchweight']
  ];
  for(const [needle,label] of named){
    if(lower.includes(needle)) return label;
  }
  const pounds=lower.match(/\b(115|125|135|145|155|165|170|175|185|195|205|225|265)\s*lbs?\b/);
  if(!pounds) return 'TBD';
  return ({
    '115':'Strawweight','125':'Flyweight','135':'Bantamweight','145':'Featherweight',
    '155':'Lightweight','165':'Catchweight','170':'Welterweight','175':'Catchweight',
    '185':'Middleweight','195':'Catchweight','205':'Light Heavyweight','225':'Catchweight','265':'Heavyweight'
  })[pounds[1]] || 'TBD';
}

function signature(snapshot){
  return createHash('sha256').update(JSON.stringify(snapshot.fights.map(fight=>({
    pair:matchupKey(fight.red_name,fight.blue_name),
    section:fight.card_section,
    order:fight.bout_order,
    weight:fight.weight_class
  })))).digest('hex');
}

function expectedMainEventFound(fights,expected){
  if(!Array.isArray(expected) || expected.length!==2) return true;
  const expectedKey=matchupKey(expected[0],expected[1]);
  return fights.some(fight=>matchupKey(fight.red_name,fight.blue_name)===expectedKey);
}

function ensureFightSections(rawFights,config){
  const expectedKey=matchupKey(config.expectedMainEvent?.[0],config.expectedMainEvent?.[1]);
  const cleaned=[];
  const seen=new Set();
  for(const raw of rawFights){
    const red=normalizeSpace(raw.red_name || raw.red || '');
    const blue=normalizeSpace(raw.blue_name || raw.blue || '');
    if(!red || !blue || normalizeName(red)===normalizeName(blue)) continue;
    const pair=matchupKey(red,blue);
    if(!pair || seen.has(pair)) continue;
    seen.add(pair);
    let section=canonicalSection(raw.card_section || raw.section);
    if(pair===expectedKey) section='Main Event';
    cleaned.push({
      red_name:red,
      blue_name:blue,
      weight_class:weightClassFromText(raw.weight_class || raw.weight || raw.text || ''),
      card_section:section,
      source_bout_id:normalizeSpace(raw.source_bout_id || raw.sourceBoutId || ''),
      source_index:Number.isFinite(Number(raw.source_index)) ? Number(raw.source_index) : cleaned.length
    });
  }

  if(!cleaned.length) return [];
  const hasAnySection=cleaned.some(fight=>fight.card_section);
  if(!hasAnySection){
    const mainCount=Math.max(1,Math.min(Number(config.mainCardFightCount || 5),cleaned.length));
    cleaned.forEach((fight,index)=>{
      fight.card_section=index<mainCount ? 'Main Card' : 'Prelims';
    });
  }else{
    cleaned.forEach(fight=>{
      if(!fight.card_section) fight.card_section='Prelims';
    });
  }

  const mainEvent=cleaned.find(fight=>fight.card_section==='Main Event');
  const mainCandidates=cleaned.filter(fight=>['Main Card','Co-Main Event'].includes(fight.card_section));
  if(mainEvent && !mainCandidates.some(fight=>fight.card_section==='Co-Main Event')){
    const firstMain=mainCandidates.sort((a,b)=>a.source_index-b.source_index)[0];
    if(firstMain) firstMain.card_section='Co-Main Event';
  }

  return cleaned;
}

function chronologicalFights(rawFights,config){
  const cleaned=ensureFightSections(rawFights,config);
  const early=cleaned.filter(fight=>fight.card_section==='Early Prelims').sort((a,b)=>b.source_index-a.source_index);
  const prelims=cleaned.filter(fight=>fight.card_section==='Prelims').sort((a,b)=>b.source_index-a.source_index);
  const main=cleaned.filter(fight=>fight.card_section==='Main Card').sort((a,b)=>b.source_index-a.source_index);
  const coMain=cleaned.filter(fight=>fight.card_section==='Co-Main Event').sort((a,b)=>b.source_index-a.source_index);
  const mainEvent=cleaned.filter(fight=>fight.card_section==='Main Event').sort((a,b)=>b.source_index-a.source_index);
  const ordered=[...early,...prelims,...main,...coMain,...mainEvent];

  const grouped={
    'Early Prelims':ordered.filter(fight=>fight.card_section==='Early Prelims'),
    'Prelims':ordered.filter(fight=>fight.card_section==='Prelims'),
    'Main Card':ordered.filter(fight=>['Main Card','Co-Main Event','Main Event'].includes(fight.card_section))
  };
  const sectionNames=['Early Prelims','Prelims','Main Card'];
  const sectionStarts=config.sectionStarts || {};
  const defaultBoutMinutes=Math.max(15,Number(config.defaultBoutMinutes || 30));

  for(let sectionIndex=0;sectionIndex<sectionNames.length;sectionIndex+=1){
    const sectionName=sectionNames[sectionIndex];
    const fights=grouped[sectionName];
    if(!fights.length) continue;
    const startIso=sectionStarts[sectionName];
    if(!startIso) throw new Error(`Missing ${sectionName} start time for ${config.eventId}`);
    const startMs=new Date(startIso).getTime();
    if(!Number.isFinite(startMs)) throw new Error(`Invalid ${sectionName} start time for ${config.eventId}`);
    const nextSectionName=sectionNames.slice(sectionIndex+1).find(name=>grouped[name].length && sectionStarts[name]);
    const nextStartMs=nextSectionName ? new Date(sectionStarts[nextSectionName]).getTime() : NaN;
    let intervalMinutes=defaultBoutMinutes;
    if(Number.isFinite(nextStartMs) && nextStartMs>startMs){
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
    source_bout_id:fight.source_bout_id || null
  }));
}

function validateSnapshot(snapshot,config){
  const failures=[];
  if(!snapshot.sourceUrl || !/^https:\/\//i.test(snapshot.sourceUrl)) failures.push('missing-source-url');
  if(snapshot.fights.length<Number(config.minFights || 5)) failures.push(`too-few-fights:${snapshot.fights.length}`);
  if(!expectedMainEventFound(snapshot.fights,config.expectedMainEvent)) failures.push('expected-main-event-missing');
  const mainCount=snapshot.fights.filter(fight=>String(fight.card_section).toLowerCase().includes('main')).length;
  if(mainCount<3) failures.push(`too-few-main-card-fights:${mainCount}`);
  const uniquePairs=new Set(snapshot.fights.map(fight=>matchupKey(fight.red_name,fight.blue_name)));
  if(uniquePairs.size!==snapshot.fights.length) failures.push('duplicate-matchups');
  if(snapshot.fights.some(fight=>!fight.lock_at || !Number.isFinite(new Date(fight.lock_at).getTime()))) failures.push('invalid-lock-time');
  if(snapshot.fights.some(fight=>!fight.card_section || !fight.red_name || !fight.blue_name)) failures.push('incomplete-fight-row');
  if(failures.length) throw new Error(`Snapshot validation failed for ${config.eventId}: ${failures.join(', ')}`);
}

async function gotoWithRetry(page,url){
  let lastError;
  for(let attempt=1;attempt<=3;attempt+=1){
    try{
      const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:NAVIGATION_TIMEOUT_MS});
      if(response && response.status()>=400) throw new Error(`HTTP ${response.status()} for ${url}`);
      await page.waitForTimeout(3500);
      return;
    }catch(error){
      lastError=error;
      if(attempt<3) await page.waitForTimeout(1500*attempt);
    }
  }
  throw lastError;
}

async function discoverOfficialUrl(page,official,config){
  await gotoWithRetry(page,official.discoveryUrl);
  const candidates=await page.locator('a[href*="/event/"]').evaluateAll((anchors)=>anchors.map(anchor=>({
    href:anchor.href,
    text:(anchor.closest('article,li,div')?.innerText || anchor.innerText || '').replace(/\s+/g,' ').trim()
  })));
  const discoveryTerms=(official.discoveryTerms || []).map(value=>String(value).toLowerCase());
  const dateTerms=(official.dateTerms || []).map(value=>String(value).toLowerCase());
  const scored=candidates.map(candidate=>{
    const text=String(candidate.text || '').toLowerCase();
    let score=0;
    discoveryTerms.forEach(term=>{ if(text.includes(term)) score+=10; });
    dateTerms.forEach(term=>{ if(text.includes(term)) score+=4; });
    if(String(candidate.href || '').includes('/event/')) score+=1;
    return {...candidate,score};
  }).sort((a,b)=>b.score-a.score);
  if(scored[0]?.score>=10) return scored[0].href;
  if(official.fallbackUrl) return official.fallbackUrl;
  throw new Error(`Could not discover official UFC URL for ${config.eventId}`);
}

async function parseOfficialUfc(page){
  return page.evaluate(()=>{
    const normalize=value=>String(value || '').replace(/\s+/g,' ').trim();
    const athleteNameFromLink=link=>{
      const text=normalize(link.innerText || link.textContent || '')
        .replace(/\b(view profile|profile)\b/ig,'')
        .trim();
      if(text) return text;
      const parts=new URL(link.href,location.href).pathname.split('/').filter(Boolean);
      const athleteIndex=parts.indexOf('athlete');
      return athleteIndex>=0 ? String(parts[athleteIndex+1] || '').split('-').map(part=>part ? part[0].toUpperCase()+part.slice(1) : '').join(' ') : '';
    };
    const sectionFromText=value=>{
      const text=normalize(value).toLowerCase();
      if(text.includes('early') && text.includes('prelim')) return 'Early Prelims';
      if(text.includes('prelim')) return 'Prelims';
      if(text.includes('co-main') || text.includes('co main')) return 'Co-Main Event';
      if(text.includes('main event')) return 'Main Event';
      if(text.includes('main card')) return 'Main Card';
      return '';
    };
    const markers=[...document.querySelectorAll('h1,h2,h3,h4,h5,[class*="headline"],[class*="title"],[class*="label"]')]
      .map(node=>({node,section:sectionFromText(node.innerText || node.textContent)}))
      .filter(item=>item.section);
    const candidates=[...document.querySelectorAll('.c-listing-fight,[class*="listing-fight"],[data-fight-id],[class*="fight-card"] article')]
      .filter(node=>{
        const athleteLinks=node.querySelectorAll('a[href*="/athlete/"]');
        const cornerNames=node.querySelectorAll('[class*="corner-name"]');
        return athleteLinks.length>=2 || cornerNames.length>=2;
      });
    const smallest=candidates.filter(node=>!candidates.some(other=>other!==node && node.contains(other)));
    const rows=[];
    for(const [sourceIndex,node] of smallest.entries()){
      const linkMap=new Map();
      for(const link of node.querySelectorAll('a[href*="/athlete/"]')){
        const name=athleteNameFromLink(link);
        if(name && !linkMap.has(link.href)) linkMap.set(link.href,name);
      }
      let names=[...linkMap.values()];
      if(names.length<2){
        names=[...node.querySelectorAll('[class*="corner-name"]')].map(item=>normalize(item.innerText || item.textContent)).filter(Boolean);
      }
      names=[...new Set(names)].filter(Boolean);
      if(names.length<2) continue;
      let section='';
      for(const marker of markers){
        const relation=marker.node.compareDocumentPosition(node);
        if(relation & Node.DOCUMENT_POSITION_FOLLOWING) section=marker.section;
      }
      const weightNode=node.querySelector('[class*="class-text"],[class*="weight-class"],[class*="weight"]');
      const sourceBoutId=node.getAttribute('data-fight-id') || node.id || [...linkMap.keys()].sort().join('|');
      rows.push({
        red_name:names[0],
        blue_name:names[1],
        weight_class:normalize(weightNode?.innerText || weightNode?.textContent || node.innerText || ''),
        card_section:section,
        source_bout_id:sourceBoutId,
        source_index:sourceIndex,
        text:normalize(node.innerText || '')
      });
    }
    return rows;
  });
}

async function parseMmaMania(page){
  return page.evaluate(()=>{
    const root=document.querySelector('article') || document.querySelector('main') || document.body;
    const lines=String(root.innerText || '').split(/\n+/).map(line=>line.replace(/\s+/g,' ').trim()).filter(Boolean);
    let section='';
    const rows=[];
    for(const line of lines){
      const lower=line.toLowerCase();
      if(lower.includes('main event') && lower.includes('paramount')){ section='Main Event'; continue; }
      if(lower.includes('main card') && lower.includes('paramount')){ section='Main Card'; continue; }
      if(lower.includes('prelims') && lower.includes('card')){ section='Prelims'; continue; }
      const match=line.match(/^(\d{3})\s*lbs?\.?\s*:\s*(.+?)\s+vs\.?\s+(.+)$/i);
      if(!match) continue;
      const blue=match[3].replace(/\s*\([^)]*\)\s*$/,'').trim();
      rows.push({
        red_name:match[2].trim(),
        blue_name:blue,
        weight_class:`${match[1]} lbs`,
        card_section:section,
        source_bout_id:'',
        source_index:rows.length,
        text:line
      });
    }
    return rows;
  });
}

async function captureSource(browser,source,config,captureLabel){
  const page=await browser.newPage({
    userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36',
    locale:'en-US',
    viewport:{width:1440,height:1400}
  });
  page.setDefaultTimeout(NAVIGATION_TIMEOUT_MS);
  let sourceUrl=source.url || '';
  try{
    if(source.type==='official-ufc') sourceUrl=await discoverOfficialUrl(page,source.official,config);
    await gotoWithRetry(page,sourceUrl);
    const raw=source.type==='mma-mania' ? await parseMmaMania(page) : await parseOfficialUfc(page);
    const fights=chronologicalFights(raw,config);
    const snapshot={
      sourceType:source.type,
      sourceUrl,
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
        source_note:`Externally synced from ${source.type==='official-ufc' ? 'UFC.com' : 'MMA Mania fallback'} at ${new Date().toISOString()}`
      },
      fights
    };
    validateSnapshot(snapshot,config);
    return snapshot;
  }catch(error){
    const safeName=`${slug(config.eventId)}-${captureLabel}-${slug(source.type)}`;
    try{
      fs.writeFileSync(path.join(OUTPUT_DIR,`${safeName}.html`),await page.content());
      await page.screenshot({path:path.join(OUTPUT_DIR,`${safeName}.png`),fullPage:true});
    }catch(_artifactError){}
    throw error;
  }finally{
    await page.close();
  }
}

async function confirmedSnapshot(browser,source,config){
  const first=await captureSource(browser,source,config,'first');
  await new Promise(resolve=>setTimeout(resolve,CAPTURE_DELAY_MS));
  const second=await captureSource(browser,source,config,'second');
  const firstSignature=signature(first);
  const secondSignature=signature(second);
  if(firstSignature!==secondSignature){
    throw new Error(`Two-source captures disagreed for ${config.eventId}: ${firstSignature} vs ${secondSignature}`);
  }
  return {...second,confirmed:true,confirmationHash:secondSignature};
}

async function chooseSnapshot(browser,config){
  const attempts=[
    {type:'official-ufc',official:config.official},
    ...(config.fallbackSources || []).map(source=>({type:source.type,url:source.url}))
  ];
  const errors=[];
  for(const source of attempts){
    try{
      return await confirmedSnapshot(browser,source,config);
    }catch(error){
      errors.push(`${source.type}: ${error.message}`);
    }
  }
  throw new Error(`All card sources failed for ${config.eventId}. ${errors.join(' | ')}`);
}

async function postSnapshot(snapshot,config){
  if(!APPLY) return {dryRun:true};
  if(!ENDPOINT || !SECRET) throw new Error('CARD_SYNC_ENDPOINT and CARD_SYNC_SECRET are required with --apply');
  const response=await fetch(ENDPOINT,{
    method:'POST',
    headers:{
      'content-type':'application/json',
      'x-card-sync-secret':SECRET
    },
    body:JSON.stringify({
      ...snapshot,
      validation:{
        minFights:Number(config.minFights || 5),
        expectedMainEvent:config.expectedMainEvent || []
      }
    })
  });
  const text=await response.text();
  let body;
  try{ body=JSON.parse(text); }
  catch(_error){ body={raw:text}; }
  if(!response.ok) throw new Error(`Supabase card sync failed (${response.status}): ${JSON.stringify(body)}`);
  return body;
}

async function main(){
  const parsed=JSON.parse(fs.readFileSync(CONFIG_PATH,'utf8'));
  const events=Array.isArray(parsed.events) ? parsed.events : [];
  if(!events.length) throw new Error('No UFC card sources are configured');
  const now=Date.now();
  const active=events.filter(event=>FORCE || !event.syncUntil || now<new Date(event.syncUntil).getTime());
  if(!active.length){
    console.log('No active UFC card sources need synchronization.');
    return;
  }
  const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage','--no-sandbox']});
  const report=[];
  try{
    for(const config of active){
      const snapshot=await chooseSnapshot(browser,config);
      const result=await postSnapshot(snapshot,config);
      const reportRow={
        eventId:config.eventId,
        sourceType:snapshot.sourceType,
        sourceUrl:snapshot.sourceUrl,
        fights:snapshot.fights.length,
        confirmationHash:snapshot.confirmationHash,
        applied:APPLY,
        result
      };
      report.push(reportRow);
      console.log(JSON.stringify(reportRow,null,2));
    }
  }finally{
    await browser.close();
  }
  fs.writeFileSync(path.join(OUTPUT_DIR,'card-sync-report.json'),JSON.stringify({generatedAt:new Date().toISOString(),report},null,2));
}

main().catch(error=>{
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});

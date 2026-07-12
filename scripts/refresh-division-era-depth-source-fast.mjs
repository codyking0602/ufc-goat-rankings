import crypto from 'node:crypto';
import fs from 'node:fs/promises';

const SOURCE_REPOSITORY='komaksym/UFC-DataLab';
const SOURCE_COMMIT='3268146c05211de9deab8b9b4c0bb4a954815f0b';
const SOURCE_FILE='data/stats/stats_raw.csv';
const SOURCE_URL=`https://raw.githubusercontent.com/${SOURCE_REPOSITORY}/${SOURCE_COMMIT}/${SOURCE_FILE}`;
const REQUIRED=['red_fighter_name','blue_fighter_name','event_date','red_fighter_result','blue_fighter_result','bout_type','event_name','method','round','time'];
const OUTPUT=['fight_link','date','name_1','name_2','win_loss_1','win_loss_2','division'];
const USER_AGENT='ufc-goat-rankings-era-depth/3.1 (+https://github.com/codyking0602/ufc-goat-rankings)';
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

function parseDelimited(text){
  const firstLine=String(text).split(/\r?\n/,1)[0]||'';
  const delimiter=firstLine.includes(';')?';':',';
  const rows=[];
  let row=[];
  let field='';
  let quoted=false;
  for(let index=0;index<text.length;index+=1){
    const char=text[index];
    if(quoted){
      if(char==='"'){
        if(text[index+1]==='"'){field+='"';index+=1;}
        else quoted=false;
      }else field+=char;
    }else if(char==='"')quoted=true;
    else if(char===delimiter){row.push(field);field='';}
    else if(char==='\n'){row.push(field.replace(/\r$/,''));rows.push(row);row=[];field='';}
    else field+=char;
  }
  if(field.length||row.length){row.push(field.replace(/\r$/,''));rows.push(row);}
  return{delimiter,rows};
}

function csvCell(value){
  const text=String(value??'');
  return /[",\n\r]/.test(text)?`"${text.replace(/"/g,'""')}"`:text;
}

function isoDate(value){
  const text=String(value||'').trim();
  const dmy=text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if(dmy)return`${dmy[3]}-${dmy[2].padStart(2,'0')}-${dmy[1].padStart(2,'0')}`;
  const date=new Date(text);
  return Number.isFinite(date.getTime())?date.toISOString().slice(0,10):null;
}

function result(value){
  const marker=String(value||'').trim().toUpperCase();
  if(['W','L','D','NC'].includes(marker))return marker;
  if(['N/C','NO CONTEST','NO-CONTEST'].includes(marker))return'NC';
  if(marker==='DRAW')return'D';
  return'';
}

function fightId(row){
  const identity=[row.event_date,row.event_name,row.red_fighter_name,row.blue_fighter_name,row.method,row.round,row.time]
    .map(value=>String(value||'').trim()).join('|');
  return`github://${SOURCE_REPOSITORY}/${SOURCE_COMMIT}/${crypto.createHash('sha256').update(identity).digest('hex').slice(0,24)}`;
}

async function fetchText(url,attempts=5){
  let lastError;
  for(let attempt=1;attempt<=attempts;attempt+=1){
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),60_000);
    try{
      const response=await fetch(url,{redirect:'follow',signal:controller.signal,headers:{'User-Agent':USER_AGENT,Accept:'text/csv,text/plain;q=0.9,*/*;q=0.8','Cache-Control':'no-cache'}});
      if(!response.ok)throw new Error(`${response.status} ${response.statusText}`);
      const text=await response.text();
      if(!text.trim())throw new Error('empty response');
      return text;
    }catch(error){
      lastError=error;
      if(attempt<attempts)await sleep(Math.min(8000,750*(2**(attempt-1))));
    }finally{clearTimeout(timeout);}
  }
  throw new Error(`Failed to fetch ${url}: ${lastError?.message||lastError}`);
}

function buildRows(text){
  const parsed=parseDelimited(text);
  const rows=parsed.rows.filter(row=>row.some(cell=>String(cell||'').trim()));
  if(rows.length<2)throw new Error('UFC DataLab source is empty.');
  const header=rows.shift().map(name=>String(name||'').replace(/^\uFEFF/,'').trim());
  const positions=Object.fromEntries(header.map((name,index)=>[name,index]));
  const missing=REQUIRED.filter(name=>positions[name]===undefined);
  if(missing.length)throw new Error(`UFC DataLab source is missing columns: ${missing.join(', ')}. Delimiter=${JSON.stringify(parsed.delimiter)}; Header=${header.join(' | ')}`);
  const output=[];
  for(const values of rows){
    const source=Object.fromEntries(header.map((name,index)=>[name,values[index]??'']));
    const date=isoDate(source.event_date);
    const name1=String(source.red_fighter_name||'').trim();
    const name2=String(source.blue_fighter_name||'').trim();
    const result1=result(source.red_fighter_result);
    const result2=result(source.blue_fighter_result);
    const division=String(source.bout_type||'').trim();
    if(!date||!name1||!name2||!result1||!result2||!division)continue;
    output.push({fight_link:fightId(source),date,name_1:name1,name_2:name2,win_loss_1:result1,win_loss_2:result2,division});
  }
  if(!output.length)throw new Error('UFC DataLab source produced zero usable fights.');
  output.sort((a,b)=>a.date.localeCompare(b.date)||a.fight_link.localeCompare(b.fight_link));
  return output;
}

export async function buildCurrentDepthCsv(options={}){
  const modelDate=isoDate(options.modelDate||new Date().toISOString().slice(0,10));
  const rows=buildRows(await fetchText(SOURCE_URL));
  const datasetStart=rows[0]?.date||null;
  const datasetEnd=rows.at(-1)?.date||null;
  const ageDays=datasetEnd?(new Date(`${modelDate}T00:00:00Z`)-new Date(`${datasetEnd}T00:00:00Z`))/86_400_000:Number.POSITIVE_INFINITY;
  const csv=[OUTPUT.join(','),...rows.map(row=>OUTPUT.map(name=>csvCell(row[name])).join(','))].join('\n')+'\n';
  return{csv,metadata:{sourceUrl:SOURCE_URL,repository:SOURCE_REPOSITORY,sourceCommit:SOURCE_COMMIT,sourceFile:SOURCE_FILE,description:'Pinned UFCStats-derived all-bouts mirror including decisive fights, draws, and no contests.',datasetFightCount:rows.length,datasetStart,datasetEnd,modelDate,ageDays,sourceFresh:Number.isFinite(ageDays)&&ageDays>=0&&ageDays<=21,underlyingSource:'UFCStats'}};
}

if(import.meta.url===`file://${process.argv[1]}`){
  const output=process.argv[2];
  const built=await buildCurrentDepthCsv({modelDate:process.env.UFC_MODEL_DATE||new Date()});
  if(output)await fs.writeFile(output,built.csv);
  console.log(JSON.stringify(built.metadata,null,2));
}

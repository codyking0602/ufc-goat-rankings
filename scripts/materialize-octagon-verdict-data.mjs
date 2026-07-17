#!/usr/bin/env node
// Materializes the calculated browser feed into stable per-fighter files and an aggregate index.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const INDEX_SCHEMA_VERSION=1;
const scriptDir=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(scriptDir,'..');
const feedPath=path.join(root,'assets','data','octagon-verdict-data.json');
const outputDir=path.join(root,'assets','data','octagon-verdict');
const fighterDir=path.join(outputDir,'fighters');
const indexPath=path.join(outputDir,'index.json');

function fail(message){throw new Error(`[materialize-octagon-verdict] ${message}`);}
function slugify(value){
  return String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}
function readJson(file){return JSON.parse(fs.readFileSync(file,'utf8'));}
function writeJson(file,value){fs.writeFileSync(file,`${JSON.stringify(value)}\n`,'utf8');}

if(!fs.existsSync(feedPath))fail(`Missing calculated feed: ${path.relative(root,feedPath)}`);
const feed=readJson(feedPath);
const fighters=Array.isArray(feed.fighters)?feed.fighters:[];
if(!Number.isInteger(feed.fighterCount)||feed.fighterCount<=0)fail('Feed fighterCount is missing or invalid.');
if(fighters.length!==feed.fighterCount)fail(`Feed has ${fighters.length} fighter objects but fighterCount is ${feed.fighterCount}.`);

const divisionBoardsByFighter=new Map();
for(const [division,rows] of Object.entries(feed.divisionBoards||{})){
  for(const row of Array.isArray(rows)?rows:[]){
    const name=String(row?.fighter||row?.name||'').trim();
    if(!name)continue;
    const enriched={...row,division:row.division||division};
    const current=divisionBoardsByFighter.get(name)||[];
    current.push(enriched);
    divisionBoardsByFighter.set(name,current);
  }
}

fs.mkdirSync(fighterDir,{recursive:true});
const seenNames=new Set();
const seenSlugs=new Set();
const materialized=fighters.map(fighter=>{
  const name=String(fighter?.name||fighter?.fighter||'').trim();
  if(!name)fail('Encountered fighter without a name.');
  const slug=String(fighter?.slug||slugify(name));
  if(!slug)fail(`Could not derive slug for ${name}.`);
  if(seenNames.has(name))fail(`Duplicate fighter name: ${name}.`);
  if(seenSlugs.has(slug))fail(`Duplicate fighter slug: ${slug}.`);
  seenNames.add(name);seenSlugs.add(slug);
  const divisionBoards=Array.isArray(fighter?.divisionBoards)&&fighter.divisionBoards.length
    ? fighter.divisionBoards
    : divisionBoardsByFighter.get(name)||[];
  const object={...fighter,slug,name,divisionBoards};
  if(!Number.isFinite(Number(object.rank)))fail(`${name} is missing calculated rank.`);
  if(!Number.isFinite(Number(object.appOvr)))fail(`${name} is missing calculated OVR.`);
  if(!Number.isFinite(Number(object.totalScore)))fail(`${name} is missing calculated total score.`);
  if(!Array.isArray(object.divisionBoards))fail(`${name} has invalid divisionBoards.`);
  writeJson(path.join(fighterDir,`${slug}.json`),object);
  return object;
});

for(const file of fs.readdirSync(fighterDir)){
  if(!file.endsWith('.json'))continue;
  const slug=file.replace(/\.json$/,'');
  if(!seenSlugs.has(slug))fs.rmSync(path.join(fighterDir,file));
}

const index={
  schemaVersion:INDEX_SCHEMA_VERSION,
  name:'Octagon Verdict Index',
  version:String(feed.version||feed.generatedAt||new Date().toISOString()).slice(0,10),
  generatedAt:feed.generatedAt||new Date().toISOString(),
  source:feed.source||'calculated-browser-runtime',
  sourceVersions:feed.sourceVersions||{},
  guidance:feed.guidance||{},
  fighterCount:materialized.length,
  divisionBoardCount:Object.keys(feed.divisionBoards||{}).length,
  fighters:materialized.map(fighter=>({
    slug:fighter.slug,
    name:fighter.name,
    group:fighter.group,
    rank:fighter.rank,
    appOvr:fighter.appOvr,
    totalScore:fighter.totalScore,
    division:fighter.division,
    divisionBoards:fighter.divisionBoards,
    tag:fighter.tag||''
  }))
};
writeJson(indexPath,index);

const verification=readJson(indexPath);
if(verification.schemaVersion!==INDEX_SCHEMA_VERSION)fail(`Index schemaVersion ${verification.schemaVersion} does not match ${INDEX_SCHEMA_VERSION}.`);
if(verification.fighterCount!==feed.fighterCount)fail(`Index count ${verification.fighterCount} does not match feed count ${feed.fighterCount}.`);
if(!verification.fighters.some(fighter=>fighter.name==='Brandon Moreno')&&fighters.some(fighter=>fighter.name==='Brandon Moreno'))fail('Brandon Moreno is missing from materialized index.');
console.log(JSON.stringify({schemaVersion:verification.schemaVersion,fighterCount:verification.fighterCount,divisionBoardCount:verification.divisionBoardCount,index:path.relative(root,indexPath),fighterDirectory:path.relative(root,fighterDir)},null,2));

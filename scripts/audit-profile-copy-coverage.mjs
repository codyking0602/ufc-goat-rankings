#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(scriptDir,'..');
const fighterDir=path.join(root,'assets/data/octagon-verdict/fighters');
const packetDir=path.join(root,'assets/data/fighter-packets');
const overridePath=path.join(root,'assets/data/display-overrides.js');
const manifestPath=path.join(root,'assets/data/fighter-packet-manifest.js');
const taglinePath=path.join(root,'assets/js/fighter-tagline-system.js');
const requiredFields=['oneLiner','whyRankedHere'];
const genericFragments=[
  'resume is graded across championship success',
  'ranks here based on the calculated UFC-only balance',
  'ranks here based on the current balance',
  'the ranking reflects the championship, quality-win, dominance, longevity, and loss-context gaps'
];

function read(file){return fs.readFileSync(file,'utf8');}
function evaluateOverrides(){
  const sandbox={window:{}};
  vm.runInNewContext(`${read(overridePath)}\nwindow.__AUDIT_OVERRIDES=DISPLAY_OVERRIDES;`,sandbox,{filename:overridePath});
  return sandbox.window.__AUDIT_OVERRIDES||{};
}
function evaluateManifest(){
  const sandbox={window:{}};
  vm.runInNewContext(read(manifestPath),sandbox,{filename:manifestPath});
  return sandbox.window.UFC_FIGHTER_PACKET_MANIFEST||{packets:[]};
}
function evaluateTaglines(){
  const sandbox={window:{addEventListener(){},refresh:null},document:{documentElement:{setAttribute(){}},querySelectorAll(){return[];}}};
  vm.runInNewContext(read(taglinePath),sandbox,{filename:taglinePath});
  return sandbox.window.UFC_FIGHTER_TAGLINE_SYSTEM?.taglines||{};
}
function hasLiteralField(source,field){return new RegExp(`\\b${field}\\s*:`).test(source);}
function hasWhyNot(source){return /\bwhyNotHigher\s*:|\bwhyNotLower\s*:/.test(source);}
function containsGeneric(value){
  const text=String(value||'').toLowerCase();
  return genericFragments.some(fragment=>text.includes(fragment));
}
function overrideCoverage(override){
  if(!override||typeof override!=='object')return{complete:false,generic:false};
  const complete=requiredFields.every(field=>typeof override[field]==='string'&&override[field].trim())&&
    ((typeof override.whyNotHigher==='string'&&override.whyNotHigher.trim())||(typeof override.whyNotLower==='string'&&override.whyNotLower.trim()));
  const generic=[override.oneLiner,override.whyRankedHere,override.whyNotHigher,override.whyNotLower].some(containsGeneric);
  return{complete,generic};
}
function buildPacketIndex(registeredSlugs){
  const byFighter=new Map();
  for(const slug of registeredSlugs){
    const file=path.join(packetDir,`${slug}.js`);
    if(!fs.existsSync(file))continue;
    const source=read(file);
    const match=source.match(/\bconst\s+fighter\s*=\s*(['"`])([\s\S]*?)\1\s*;/);
    if(!match)continue;
    byFighter.set(match[2],{source,file:path.relative(root,file)});
  }
  return byFighter;
}
function packetCoverage(name,packetByFighter){
  const packet=packetByFighter.get(name);
  if(!packet)return{complete:false,generic:false,file:null};
  const complete=requiredFields.every(field=>hasLiteralField(packet.source,field))&&hasWhyNot(packet.source);
  const generic=genericFragments.some(fragment=>packet.source.toLowerCase().includes(fragment));
  return{complete,generic,file:packet.file};
}

if(!fs.existsSync(fighterDir))throw new Error(`Missing fighter object directory: ${fighterDir}`);
const roster=fs.readdirSync(fighterDir).filter(file=>file.endsWith('.json')).map(file=>{
  const row=JSON.parse(read(path.join(fighterDir,file)));
  return{name:row.name,slug:row.slug||file.replace(/\.json$/,'')};
}).sort((a,b)=>a.name.localeCompare(b.name));
const overrides=evaluateOverrides();
const manifest=evaluateManifest();
const taglines=evaluateTaglines();
const registeredSlugs=new Set((manifest.packets||[]).map(row=>Array.isArray(row)?row[0]:row.slug).filter(Boolean));
const packetByFighter=buildPacketIndex(registeredSlugs);
const report=roster.map(fighter=>{
  const direct=overrideCoverage(overrides[fighter.name]);
  const packet=packetCoverage(fighter.name,packetByFighter);
  const complete=(direct.complete&&!direct.generic)||(packet.complete&&!packet.generic);
  return{...fighter,status:complete?'GREEN':'RED',source:direct.complete?'display-overrides':packet.file||'generic-fallback'};
});
const red=report.filter(row=>row.status==='RED');
const green=report.filter(row=>row.status==='GREEN');
const missingPills=roster.filter(row=>typeof taglines[row.name]!=='string'||!taglines[row.name].trim());
console.log(`Profile copy audit: ${report.length} fighters | ${green.length} green | ${red.length} red`);
if(red.length)console.log(`PROFILE RED: ${red.map(row=>`${row.name} [${row.source}]`).join(', ')}`);
console.log(`Custom pill audit: ${roster.length-missingPills.length}/${roster.length} covered`);
if(missingPills.length)console.log(`PILL MISSING: ${missingPills.map(row=>row.name).join(', ')}`);
if(report.length===0||red.length||missingPills.length)process.exitCode=1;

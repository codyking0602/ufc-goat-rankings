import fs from 'node:fs/promises';
import vm from 'node:vm';

const displayPath='assets/data/display-overrides.js';
const comparePath='assets/compare-data.js';
const contract=JSON.parse(await fs.readFile('docs/scoring-architecture-contract.json','utf8'));

function evaluateDisplay(source){
  const sandbox={};
  vm.runInNewContext(`${source}\n;globalThis.__DISPLAY_OVERRIDES__=DISPLAY_OVERRIDES;`,sandbox,{filename:displayPath,timeout:5000});
  return JSON.parse(JSON.stringify(sandbox.__DISPLAY_OVERRIDES__||{}));
}
function cleanObjectFields(object,fields){
  if(!object||typeof object!=='object')return;
  fields.forEach(field=>delete object[field]);
}
function cleanDisplay(overrides){
  const report={fighters:0,snapshotsRemoved:0,directFieldsRemoved:0,nestedFieldsRemoved:0,categoryFieldsRemoved:0,rankPhrasesNeutralized:0};
  Object.values(overrides).forEach(override=>{
    if(!override||typeof override!=='object')return;
    report.fighters+=1;
    if(Object.prototype.hasOwnProperty.call(override,'snapshot')){delete override.snapshot;report.snapshotsRemoved+=1;}
    contract.presentation.forbiddenDirectFields.forEach(field=>{
      if(Object.prototype.hasOwnProperty.call(override,field)){delete override[field];report.directFieldsRemoved+=1;}
    });
    ['snapshotStats','packetProfileStats'].forEach(container=>{
      const target=override[container];
      if(!target||typeof target!=='object')return;
      contract.presentation.forbiddenNestedFields.forEach(field=>{
        if(Object.prototype.hasOwnProperty.call(target,field)){delete target[field];report.nestedFieldsRemoved+=1;}
      });
      if(Object.keys(target).length===0)delete override[container];
    });
    Object.entries(override.categories||{}).forEach(([category,entry])=>{
      if(!entry||typeof entry!=='object')return;
      contract.presentation.forbiddenCategoryFields.forEach(field=>{
        if(Object.prototype.hasOwnProperty.call(entry,field)){delete entry[field];report.categoryFieldsRemoved+=1;}
      });
      if(Object.keys(entry).length===0)delete override.categories[category];
    });
    if(override.categories&&Object.keys(override.categories).length===0)delete override.categories;
    for(const field of ['whyRankedHere','oneLiner','finalTakeaway']){
      if(typeof override[field]!=='string')continue;
      const cleaned=override[field]
        .replace(/\branks\s+#\d+\b/gi,'ranks here')
        .replace(/\branked\s+#\d+\b/gi,'ranked here');
      if(cleaned!==override[field])report.rankPhrasesNeutralized+=1;
      override[field]=cleaned;
    }
  });
  return report;
}

function evaluateCompare(source){
  const window={};
  const sandbox={window,DISPLAY_OVERRIDES:{}};
  vm.runInNewContext(source,sandbox,{filename:comparePath,timeout:5000});
  return{
    profiles:JSON.parse(JSON.stringify(window.COMPARE_PROFILES||{})),
    ledger:JSON.parse(JSON.stringify(window.COMPARE_FIGHT_LEDGER||{}))
  };
}
function cleanCompare(profiles){
  const report={profiles:0,legacyStatsRemoved:0,primeNotesPreserved:0};
  Object.values(profiles).forEach(profile=>{
    if(!profile||typeof profile!=='object')return;
    report.profiles+=1;
    const legacy=profile.legacyStats;
    if(legacy&&typeof legacy==='object'){
      if(legacy.primeNote&&!profile.primeNote){profile.primeNote=legacy.primeNote;report.primeNotesPreserved+=1;}
      delete profile.legacyStats;
      report.legacyStatsRemoved+=1;
    }
  });
  return report;
}

const display=evaluateDisplay(await fs.readFile(displayPath,'utf8'));
const displayReport=cleanDisplay(display);
const displayOutput=`// App-facing copy, photos, links, and presentation-only overrides.\n// Calculated stats, totals, ranks, category ratings, and Resume Snapshot values come from ranking-pipeline.js.\nconst DISPLAY_OVERRIDES = ${JSON.stringify(display,null,2)};\n`;
await fs.writeFile(displayPath,displayOutput,'utf8');

const compare=evaluateCompare(await fs.readFile(comparePath,'utf8'));
const compareReport=cleanCompare(compare.profiles);
const compareOutput=`// Compare Mode narrative copy and real direct-fight ledger. Calculated stats are injected from RANKING_DATA at runtime.\n(function(){\n  'use strict';\n  const COMPARE_PROFILES = ${JSON.stringify(compare.profiles,null,2)};\n  const FIGHT_LEDGER = ${JSON.stringify(compare.ledger,null,2)};\n\n  function installProfiles(){\n    if(typeof DISPLAY_OVERRIDES==='undefined')return;\n    Object.entries(COMPARE_PROFILES).forEach(([fighter,compareProfile])=>{\n      DISPLAY_OVERRIDES[fighter]=DISPLAY_OVERRIDES[fighter]||{};\n      DISPLAY_OVERRIDES[fighter].compareProfile={\n        ...(DISPLAY_OVERRIDES[fighter].compareProfile||{}),\n        ...compareProfile\n      };\n    });\n  }\n\n  window.COMPARE_PROFILES=COMPARE_PROFILES;\n  window.COMPARE_FIGHT_LEDGER=FIGHT_LEDGER;\n  installProfiles();\n})();\n`;
await fs.writeFile(comparePath,compareOutput,'utf8');

console.log(JSON.stringify({display:displayReport,compare:compareReport},null,2));

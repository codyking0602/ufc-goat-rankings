import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const index=read('index.html');
const scripts=[...index.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)]
  .map(match=>match[1].split('?')[0])
  .filter(src=>src.startsWith('assets/js/'));

const lineNumber=(source,index)=>source.slice(0,index).split('\n').length;
const matches=(source,regex)=>[...source.matchAll(regex)].map(match=>({
  value:match[1]||match[0],
  line:lineNumber(source,match.index)
}));

const rows=scripts.map((file,order)=>{
  const source=read(file);
  const events=matches(source,/addEventListener\(\s*["']([^"']+)["']/g);
  const timers=matches(source,/\b(setTimeout|setInterval|requestAnimationFrame|requestIdleCallback)\s*\(/g);
  const network=matches(source,/\b(fetch|rpc|channel)\s*\(/g);
  const lifecycle=events.filter(item=>['DOMContentLoaded','load','pageshow','visibilitychange','online','focus'].includes(item.value)||item.value.startsWith('ufc-')||item.value.startsWith('octagon-hq:'));
  const startupCalls=matches(source,/if\s*\(document\.readyState===['"]loading['"]\)[^\n]{0,220}else\s+([A-Za-z_$][\w$]*)\s*\(\s*\)|\bwindow\.setTimeout\(\s*([A-Za-z_$][\w$]*)|(?:^|[;}]\s*)([A-Za-z_$][\w$]*)\s*\(\s*\)\s*;\s*(?:window\.|document\.|$)/gm)
    .map(item=>item.value);
  return{
    order,
    file,
    bytes:Buffer.byteLength(source),
    timers:timers.length,
    networkOps:network.length,
    lifecycleListeners:lifecycle.map(item=>`${item.value}@${item.line}`),
    allEventCount:events.length,
    startupCalls,
    profileResolveRefs:matches(source,/UFC_APP_PROFILE\?*\.resolve|UFC_APP_PROFILE\.resolve/g).map(item=>item.line),
    profileGroupRefs:matches(source,/UFC_APP_PROFILE\?*\.groupSnapshot|UFC_APP_PROFILE\.groupSnapshot|app_profile_group_snapshot/g).map(item=>item.line)
  };
});

const ranked=[...rows].sort((a,b)=>{
  const score=row=>row.networkOps*10+row.timers*3+row.lifecycleListeners.length*2+row.allEventCount*0.1;
  return score(b)-score(a)||b.bytes-a.bytes;
});

const profileReferences=[];
for(const directory of ['assets/js','scripts']){
  const walk=absolute=>fs.readdirSync(absolute,{withFileTypes:true}).flatMap(entry=>{
    const target=path.join(absolute,entry.name);
    return entry.isDirectory()?walk(target):entry.isFile()&&/\.(?:js|mjs)$/.test(entry.name)?[target]:[];
  });
  for(const absolute of walk(path.join(root,directory))){
    const source=fs.readFileSync(absolute,'utf8');
    for(const match of source.matchAll(/UFC_APP_PROFILE(?:\?\.)?\.(resolve|groupSnapshot)|app_profile_group_snapshot/g)){
      profileReferences.push({
        file:path.relative(root,absolute),
        line:lineNumber(source,match.index),
        reference:match[0]
      });
    }
  }
}

const report={
  productionScriptCount:scripts.length,
  totalProductionJsBytes:rows.reduce((sum,row)=>sum+row.bytes,0),
  rankedStartupSignals:ranked,
  appProfileReferences:profileReferences,
  notes:[
    'Counts identify audit candidates; they do not prove that every matched network operation runs during startup.',
    'A runtime change still requires owner tracing and focused browser proof.'
  ]
};

console.log(JSON.stringify(report,null,2));

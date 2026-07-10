import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const baseUrl=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage();
page.on('console',m=>console.log(`[browser:${m.type()}] ${m.text()}`));
page.on('pageerror',e=>console.error(`[browser:error] ${e.stack||e.message}`));

try{
  await page.goto(`${baseUrl}/audit.html`,{waitUntil:'domcontentloaded',timeout:60_000});
  await page.waitForFunction(()=>document.getElementById('appFrame')?.contentWindow?.UFC_SCORING_PIPELINE?.status==='ready',{timeout:90_000});
  const report=await page.evaluate(()=>{
    const win=document.getElementById('appFrame')?.contentWindow;
    if(!win)throw new Error('Missing app frame.');
    const men=win.RANKING_DATA?.men||[],women=win.RANKING_DATA?.women||[],all=[...men,...women].filter(r=>r?.fighter);
    const shadow=win.UFC_LONGEVITY_SHADOW_SCORER;
    if(!shadow?.rows?.length)throw new Error('Longevity shadow report unavailable.');
    const num=(v,d=0)=>Number.isFinite(Number(v))?Number(v):d;
    const round=(v,d=3)=>{const p=10**d;return Math.round((num(v)+Number.EPSILON)*p)/p;};
    const mean=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0;
    const quantile=(a,q)=>{if(!a.length)return 0;const s=[...a].sort((a,b)=>a-b),p=(s.length-1)*q,b=Math.floor(p),f=p-b;return s[b+1]===undefined?s[b]:s[b]+f*(s[b+1]-s[b]);};
    const stats=a=>{const v=a.map(Number).filter(Number.isFinite),m=mean(v),variance=mean(v.map(x=>(x-m)**2));return{count:v.length,min:round(Math.min(...v)),max:round(Math.max(...v)),mean:round(m),median:round(quantile(v,.5)),stdDev:round(Math.sqrt(variance)),p10:round(quantile(v,.1)),p25:round(quantile(v,.25)),p75:round(quantile(v,.75)),p90:round(quantile(v,.9)),p90P10:round(quantile(v,.9)-quantile(v,.1))};};
    const byName=new Map(shadow.rows.map(x=>[x.fighter,x]));
    const rows=all.map(row=>{const x=byName.get(row.fighter)||row.longevityAudit||{};return{fighter:row.fighter,board:men.includes(row)?'men':'women',score:round(row.longevity,2),activeEliteYears:round(x.activeEliteYears??row.activeEliteYears,2),gapAdjustedMonths:round(x.gapAdjustedMonths,2),statusMultiplier:round(x.statusMultiplier||1,2),divisionMultiplier:round(x.divisionMultiplier||1,2),countedEliteMonths:round(x.countedEliteMonths,2),gapCapMonths:num(x.gapCapMonths,18),ceilingApplied:!!x.ceilingApplied,window:x.rawWindowLabel||'',endType:x.endType||'',notes:Array.isArray(x.notes)?x.notes:[]};}).sort((a,b)=>b.score-a.score||b.countedEliteMonths-a.countedEliteMonths||a.fighter.localeCompare(b.fighter));
    const nearest={};for(const target of [0,5,10,15,20,25,30])nearest[target]=rows.slice().sort((a,b)=>Math.abs(a.score-target)-Math.abs(b.score-target)||b.countedEliteMonths-a.countedEliteMonths).slice(0,8);
    return{version:'longevity-anchor-discovery-20260710a',generatedAt:new Date().toISOString(),readOnly:true,rosterCount:rows.length,currentFormula:shadow.formula,maxMonths:shadow.maxMonths,maxScore:shadow.maxScore,stats:{score:stats(rows.map(x=>x.score)),activeEliteYears:stats(rows.map(x=>x.activeEliteYears)),gapAdjustedMonths:stats(rows.map(x=>x.gapAdjustedMonths)),countedEliteMonths:stats(rows.map(x=>x.countedEliteMonths))},ceilingCount:rows.filter(x=>x.ceilingApplied).length,nearestCurrentScoreAnchors:nearest,rows};
  });
  const f=n=>Number(n||0).toFixed(2);
  let md=`# Longevity Anchor Discovery\n\nGenerated: ${report.generatedAt}\n\nRead-only: yes. No live score, total, rank, OVR, ledger, or formula was changed.\n\n## Current model\n\n- Formula: ${report.currentFormula}\n- Maximum counted elite months: ${f(report.maxMonths)}\n- Maximum score: ${f(report.maxScore)}\n- Roster: ${report.rosterCount} fighters\n- Fighters at ceiling: ${report.ceilingCount}\n\n## Distribution\n\n| Input | Min | P10 | P25 | Median | P75 | P90 | Max | Mean | Std dev |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n`;
  for(const [label,key] of [['Longevity score','score'],['Active elite years','activeEliteYears'],['Gap-adjusted months','gapAdjustedMonths'],['Counted elite months','countedEliteMonths']]){const s=report.stats[key];md+=`| ${label} | ${f(s.min)} | ${f(s.p10)} | ${f(s.p25)} | ${f(s.median)} | ${f(s.p75)} | ${f(s.p90)} | ${f(s.max)} | ${f(s.mean)} | ${f(s.stdDev)} |\n`;}
  md+='\n## Current score-level examples\n\n';
  for(const target of [0,5,10,15,20,25,30]){md+=`### Near ${target}/30\n\n| Fighter | Board | Counted months | Active elite years | Score | Status mult. | Division mult. | Ceiling |\n|---|---|---:|---:|---:|---:|---:|---|\n`;for(const x of report.nearestCurrentScoreAnchors[target])md+=`| ${x.fighter} | ${x.board} | ${f(x.countedEliteMonths)} | ${f(x.activeEliteYears)} | ${f(x.score)} | ${f(x.statusMultiplier)} | ${f(x.divisionMultiplier)} | ${x.ceilingApplied?'yes':'no'} |\n`;md+='\n';}
  md+='## Full Longevity board\n\n| Rank | Fighter | Board | Counted months | Active elite years | Score | Window |\n|---:|---|---|---:|---:|---:|---|\n';
  report.rows.forEach((x,i)=>{md+=`| ${i+1} | ${x.fighter} | ${x.board} | ${f(x.countedEliteMonths)} | ${f(x.activeEliteYears)} | ${f(x.score)} | ${x.window} |\n`;});
  await mkdir('docs/audits',{recursive:true});
  await writeFile('docs/audits/runtime-longevity-anchor-discovery.json',`${JSON.stringify(report,null,2)}\n`,'utf8');
  await writeFile('docs/audits/runtime-longevity-anchor-discovery.md',`${md}\n`,'utf8');
  console.log('LONGEVITY_ANCHOR_DISCOVERY='+JSON.stringify({fighters:report.rosterCount,ceilingCount:report.ceilingCount,scoreStats:report.stats.score,countedMonthsStats:report.stats.countedEliteMonths}));
}finally{await browser.close();}

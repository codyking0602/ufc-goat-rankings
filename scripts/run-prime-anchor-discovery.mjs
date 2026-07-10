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
    const primeReport=win.UFC_PRIME_DOMINANCE_LEDGERS?.report||win.UFC_PRIME_DOMINANCE_SHADOW_MODEL?.report||[];
    if(!primeReport.length)throw new Error('Prime Dominance report unavailable.');
    const num=(v,d=0)=>Number.isFinite(Number(v))?Number(v):d;
    const round=(v,d=3)=>{const p=10**d;return Math.round((num(v)+Number.EPSILON)*p)/p;};
    const mean=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0;
    const quantile=(a,q)=>{if(!a.length)return 0;const s=[...a].sort((a,b)=>a-b),p=(s.length-1)*q,b=Math.floor(p),f=p-b;return s[b+1]===undefined?s[b]:s[b]+f*(s[b+1]-s[b]);};
    const stats=a=>{const v=a.map(Number).filter(Number.isFinite),m=mean(v),variance=mean(v.map(x=>(x-m)**2));return{count:v.length,min:round(Math.min(...v)),max:round(Math.max(...v)),mean:round(m),median:round(quantile(v,.5)),stdDev:round(Math.sqrt(variance)),p10:round(quantile(v,.1)),p25:round(quantile(v,.25)),p75:round(quantile(v,.75)),p90:round(quantile(v,.9)),p90P10:round(quantile(v,.9)-quantile(v,.1))};};
    const byName=new Map(primeReport.map(x=>[x.fighter,x]));
    const rows=all.map(row=>{
      const p=byName.get(row.fighter)||row.primeDominanceLiveAudit||row.primeDominanceShadowAudit||{};
      const components={record:num(p.primeRecordScore),roundControl:num(p.roundControlScore),finish:num(p.finishPressureScore),elite:num(p.eliteStakesScore)};
      return{
        fighter:row.fighter,
        board:men.includes(row)?'men':'women',
        score:round(row.primeDominance,2),
        componentTotal:round(Object.values(components).reduce((s,v)=>s+v,0),2),
        components,
        primeRecord:p.primeRecord||row.primeRecord||'',
        primeRecordPct:round(p.primeRecordPct,2),
        roundControlPct:round(p.roundControlPct,2),
        primeFinishRate:round(p.primeFinishRate,2),
        primeFights:num(p.primeFights),
        eliteStakesRawScore:round(p.eliteStakesRawScore,2),
        dominanceProfile:p.dominanceProfile||'',
        status:p.status||''
      };
    }).sort((a,b)=>b.score-a.score||a.fighter.localeCompare(b.fighter));
    const nearest={};
    for(const target of [5,10,15,20,25,30])nearest[target]=rows.slice().sort((a,b)=>Math.abs(a.score-target)-Math.abs(b.score-target)||b.score-a.score).slice(0,8);
    const componentStats=Object.fromEntries(['record','roundControl','finish','elite'].map(key=>[key,stats(rows.map(x=>x.components[key]))]));
    const componentStdSum=Object.values(componentStats).reduce((s,x)=>s+x.stdDev,0);
    const componentShares=Object.fromEntries(Object.entries(componentStats).map(([key,x])=>[key,round(componentStdSum?x.stdDev/componentStdSum*100:0,2)]));
    const scoreBands={
      below10:rows.filter(x=>x.score<10).length,
      from10to1499:rows.filter(x=>x.score>=10&&x.score<15).length,
      from15to1999:rows.filter(x=>x.score>=15&&x.score<20).length,
      from20to2499:rows.filter(x=>x.score>=20&&x.score<25).length,
      from25to30:rows.filter(x=>x.score>=25).length
    };
    return{
      version:'prime-anchor-discovery-20260710a',generatedAt:new Date().toISOString(),readOnly:true,rosterCount:rows.length,
      formula:'Prime Dominance = Prime Record /9 + Round Control /8 + Finish Pressure /5 + Elite Stakes /8.',
      componentMaximums:{record:9,roundControl:8,finish:5,elite:8},
      scoreMeanings:{0:'No meaningful elite UFC prime',5:'Brief ranked-level prime',10:'Solid contender-level prime',15:'Established elite contender prime',20:'Championship-level prime',25:'Historically dominant champion prime',30:'Benchmark-level dominance'},
      stats:{score:stats(rows.map(x=>x.score)),componentTotal:stats(rows.map(x=>x.componentTotal))},
      componentStats,componentShares,scoreBands,nearestCurrentScoreAnchors:nearest,rows
    };
  });

  const f=n=>Number(n||0).toFixed(2);
  let md=`# Prime Dominance Anchor Discovery\n\nGenerated: ${report.generatedAt}\n\nRead-only: yes. No live score, component, total, rank, OVR, or formula was changed.\n\n## Existing formula\n\n${report.formula}\n\n| Component | Maximum | Current effective share inside Prime |\n|---|---:|---:|\n`;
  for(const [key,label] of [['record','Prime Record'],['roundControl','Round Control'],['finish','Finish Pressure'],['elite','Elite Stakes']])md+=`| ${label} | ${report.componentMaximums[key]} | ${f(report.componentShares[key])}% |\n`;
  md+=`\n## Proposed score meanings\n\n| Score | Meaning |\n|---:|---|\n`;
  for(const [score,meaning] of Object.entries(report.scoreMeanings))md+=`| ${score} | ${meaning} |\n`;
  const s=report.stats.score;
  md+=`\n## Current score distribution\n\n| Min | P10 | P25 | Median | P75 | P90 | Max | Mean | Std dev | P10–P90 |\n|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n| ${f(s.min)} | ${f(s.p10)} | ${f(s.p25)} | ${f(s.median)} | ${f(s.p75)} | ${f(s.p90)} | ${f(s.max)} | ${f(s.mean)} | ${f(s.stdDev)} | ${f(s.p90P10)} |\n\n`;
  md+=`Score-band counts: below 10 = ${report.scoreBands.below10}; 10–14.99 = ${report.scoreBands.from10to1499}; 15–19.99 = ${report.scoreBands.from15to1999}; 20–24.99 = ${report.scoreBands.from20to2499}; 25+ = ${report.scoreBands.from25to30}.\n\n`;
  for(const target of [5,10,15,20,25,30]){
    md+=`### Near ${target}/30\n\n| Fighter | Board | Prime | Record /9 | Control /8 | Finish /5 | Elite /8 | Prime record | Control % | Finish % |\n|---|---|---:|---:|---:|---:|---:|---|---:|---:|\n`;
    for(const x of report.nearestCurrentScoreAnchors[target])md+=`| ${x.fighter} | ${x.board} | ${f(x.score)} | ${f(x.components.record)} | ${f(x.components.roundControl)} | ${f(x.components.finish)} | ${f(x.components.elite)} | ${x.primeRecord||'—'} | ${f(x.roundControlPct)} | ${f(x.primeFinishRate)} |\n`;
    md+='\n';
  }
  md+=`## Full Prime board\n\n| Rank | Fighter | Board | Prime | Record /9 | Control /8 | Finish /5 | Elite /8 | Profile |\n|---:|---|---|---:|---:|---:|---:|---:|---|\n`;
  report.rows.forEach((x,i)=>{md+=`| ${i+1} | ${x.fighter} | ${x.board} | ${f(x.score)} | ${f(x.components.record)} | ${f(x.components.roundControl)} | ${f(x.components.finish)} | ${f(x.components.elite)} | ${String(x.dominanceProfile||'').replace(/\|/g,'/')} |\n`;});
  await mkdir('docs/audits',{recursive:true});
  await writeFile('docs/audits/runtime-prime-anchor-discovery.json',`${JSON.stringify(report,null,2)}\n`,'utf8');
  await writeFile('docs/audits/runtime-prime-anchor-discovery.md',`${md}\n`,'utf8');
  console.log('PRIME_ANCHOR_DISCOVERY='+JSON.stringify({fighters:report.rosterCount,scoreStats:report.stats.score,componentShares:report.componentShares,scoreBands:report.scoreBands}));
}finally{
  await browser.close();
}

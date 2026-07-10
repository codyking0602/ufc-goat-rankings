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
    const num=(v,d=0)=>Number.isFinite(Number(v))?Number(v):d;
    const round=(v,d=3)=>{const p=10**d;return Math.round((num(v)+Number.EPSILON)*p)/p;};
    const mean=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0;
    const quantile=(a,q)=>{if(!a.length)return 0;const s=[...a].sort((a,b)=>a-b),p=(s.length-1)*q,b=Math.floor(p),f=p-b;return s[b+1]===undefined?s[b]:s[b]+f*(s[b+1]-s[b]);};
    const stats=a=>{const v=a.map(Number).filter(Number.isFinite),m=mean(v),variance=mean(v.map(x=>(x-m)**2));return{count:v.length,min:round(Math.min(...v)),max:round(Math.max(...v)),mean:round(m),median:round(quantile(v,.5)),stdDev:round(Math.sqrt(variance)),p10:round(quantile(v,.1)),p25:round(quantile(v,.25)),p75:round(quantile(v,.75)),p90:round(quantile(v,.9)),p90P10:round(quantile(v,.9)-quantile(v,.1))};};
    const live=win.UFC_OPPONENT_QUALITY_LIVE;
    if(!live?.report?.length)throw new Error('Opponent Quality live report unavailable.');
    const sourceBenchmark=round(live.sourceBenchmarkCredit??Math.max(...live.report.map(x=>num(x.diminishedCredit)),1),2);
    const byName=new Map(live.report.map(x=>[x.fighter,x]));
    const rows=all.map(row=>{
      const q=byName.get(row.fighter)||row.opponentQualityLiveAudit||row.opponentQualityShadowAudit||{};
      return{
        fighter:row.fighter,
        board:men.includes(row)?'men':'women',
        diminishedCredit:round(q.diminishedCredit,2),
        rawCredit:round(q.rawCredit,2),
        currentScore:round(row.opponentQuality,2),
        elitePlusWins:num(q.elitePlusWins??q.eliteWins),
        topFivePlusWins:num(q.topFivePlusWins??q.topFiveWins),
        rankedQualityWins:num(q.rankedQualityWins),
        bestWins:Array.isArray(q.bestWins)?q.bestWins.slice(0,6):[],
        winProfile:q.winProfile||''
      };
    }).sort((a,b)=>b.diminishedCredit-a.diminishedCredit||b.rawCredit-a.rawCredit||a.fighter.localeCompare(b.fighter));
    const nearest={};
    for(const target of [0,5,10,15,20,25,30])nearest[target]=rows.slice().sort((a,b)=>Math.abs(a.currentScore-target)-Math.abs(b.currentScore-target)||b.diminishedCredit-a.diminishedCredit).slice(0,8);
    const creditBands={
      zero:rows.filter(x=>x.diminishedCredit===0),
      low:rows.filter(x=>x.diminishedCredit>0&&x.diminishedCredit<=2),
      middle:rows.filter(x=>x.diminishedCredit>2&&x.diminishedCredit<=5),
      high:rows.filter(x=>x.diminishedCredit>5&&x.diminishedCredit<=8),
      historic:rows.filter(x=>x.diminishedCredit>8)
    };
    return{
      version:'quality-anchor-discovery-20260710b-live-fixed',generatedAt:new Date().toISOString(),readOnly:true,
      liveBenchmarkCredit:round(live.benchmarkCredit,2),
      sourceBenchmarkCredit:sourceBenchmark,
      liveBenchmarkMode:live.benchmarkMode||null,
      liveFutureRosterStable:Boolean(live.futureRosterStable),
      currentFormula:live.formula||null,
      rosterCount:rows.length,
      stats:{diminishedCredit:stats(rows.map(x=>x.diminishedCredit)),rawCredit:stats(rows.map(x=>x.rawCredit)),currentScore:stats(rows.map(x=>x.currentScore))},
      nearestCurrentScoreAnchors:nearest,
      creditBandCounts:Object.fromEntries(Object.entries(creditBands).map(([k,v])=>[k,v.length])),
      retiredDynamicFutureLeaderShock:[16,18,20].map(newBenchmark=>({newBenchmark,legacyMultiplier:round(sourceBenchmark/newBenchmark,4),exampleCurrentScore20WouldBecome:round(20*sourceBenchmark/newBenchmark,2),currentFixedScore20Remains:20})),
      rows
    };
  });

  const f=n=>Number(n||0).toFixed(2);
  let md=`# Quality Wins Anchor Discovery\n\nGenerated: ${report.generatedAt}\n\nRead-only: yes. No live score, total, rank, OVR, ledger, or formula was changed.\n\n## Current conversion\n\n- Source roster leader: ${f(report.sourceBenchmarkCredit)} diminished Quality Wins credits.\n- Current live benchmark: ${f(report.liveBenchmarkCredit)} diminished credits.\n- Benchmark mode: ${report.liveBenchmarkMode||'unknown'}.\n- Future-roster stable: ${String(report.liveFutureRosterStable)}.\n- Current formula: ${report.currentFormula||'Unavailable'}\n- Roster: ${report.rosterCount} fighters.\n\n## Distribution\n\n| Input | Min | P10 | P25 | Median | P75 | P90 | Max | Mean | Std dev |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n`;
  for(const [label,key] of [['Diminished credit','diminishedCredit'],['Raw credit','rawCredit'],['Current /30 score','currentScore']]){const s=report.stats[key];md+=`| ${label} | ${f(s.min)} | ${f(s.p10)} | ${f(s.p25)} | ${f(s.median)} | ${f(s.p75)} | ${f(s.p90)} | ${f(s.max)} | ${f(s.mean)} | ${f(s.stdDev)} |\n`;}
  md+=`\n## Current score-level examples\n\nThese are descriptive only. They show which fighters currently sit nearest each proposed semantic checkpoint.\n\n`;
  for(const target of [0,5,10,15,20,25,30]){
    md+=`### Near ${target}/30\n\n| Fighter | Board | Diminished credit | Raw credit | Current score | Elite+ | Top-5+ | Ranked quality |\n|---|---|---:|---:|---:|---:|---:|---:|\n`;
    for(const x of report.nearestCurrentScoreAnchors[target])md+=`| ${x.fighter} | ${x.board} | ${f(x.diminishedCredit)} | ${f(x.rawCredit)} | ${f(x.currentScore)} | ${x.elitePlusWins} | ${x.topFivePlusWins} | ${x.rankedQualityWins} |\n`;
    md+='\n';
  }
  md+=`## Full diminished-credit board\n\n| Rank | Fighter | Board | Diminished credit | Raw credit | Current score | Elite+ | Top-5+ | Ranked quality | Best wins |\n|---:|---|---|---:|---:|---:|---:|---:|---:|---|\n`;
  report.rows.forEach((x,i)=>{md+=`| ${i+1} | ${x.fighter} | ${x.board} | ${f(x.diminishedCredit)} | ${f(x.rawCredit)} | ${f(x.currentScore)} | ${x.elitePlusWins} | ${x.topFivePlusWins} | ${x.rankedQualityWins} | ${x.bestWins.join(', ')} |\n`;});
  md+=`\n## Retired dynamic-normalization risk\n\nThe retired approach would have normalized Quality Wins to whichever fighter currently led the roster. The locked benchmark prevents these hypothetical score drops.\n\n| Future leader credit | Retired multiplier | Example current 20/30 would become | Current fixed 20/30 remains |\n|---:|---:|---:|---:|\n`;
  for(const x of report.retiredDynamicFutureLeaderShock)md+=`| ${f(x.newBenchmark)} | ${f(x.legacyMultiplier)} | ${f(x.exampleCurrentScore20WouldBecome)} | ${f(x.currentFixedScore20Remains)} |\n`;
  await mkdir('docs/audits',{recursive:true});
  await writeFile('docs/audits/runtime-quality-anchor-discovery.json',`${JSON.stringify(report,null,2)}\n`,'utf8');
  await writeFile('docs/audits/runtime-quality-anchor-discovery.md',`${md}\n`,'utf8');
  console.log('QUALITY_ANCHOR_DISCOVERY='+JSON.stringify({fighters:report.rosterCount,liveBenchmark:report.liveBenchmarkCredit,sourceBenchmark:report.sourceBenchmarkCredit,mode:report.liveBenchmarkMode,stable:report.liveFutureRosterStable,creditStats:report.stats.diminishedCredit}));
}finally{
  await browser.close();
}

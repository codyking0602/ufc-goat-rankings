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
    const stats=a=>{const v=a.map(Number).filter(Number.isFinite),m=mean(v),variance=mean(v.map(x=>(x-m)**2));return{count:v.length,min:round(Math.min(...v)),max:round(Math.max(...v)),mean:round(m),median:round(quantile(v,.5)),stdDev:round(Math.sqrt(variance)),p10:round(quantile(v,.1)),p90:round(quantile(v,.9)),p90P10:round(quantile(v,.9)-quantile(v,.1))};};
    const clamp=(x,min,max)=>Math.min(max,Math.max(min,x));
    const FIXED_CEILING=14.5;
    const currentBenchmark=num(win.UFC_CHAMPIONSHIP_RESUME_LIVE?.benchmarkCredit,Math.max(...all.map(r=>num(r.championshipResumeAudit?.adjustedTitleCredit))));
    const diminishing=(credit,tau)=>{const top=1-Math.exp(-FIXED_CEILING/tau);return clamp(30*(1-Math.exp(-num(credit)/tau))/top,0,30);};
    const scenarios={
      current:{label:'Current dynamic leader normalization',score:row=>num(row.championship)},
      fixedLinear:{label:'Locked 14.5-credit linear ceiling',score:row=>clamp(num(row.championshipResumeAudit?.adjustedTitleCredit)/FIXED_CEILING*30,0,30)},
      moderate:{label:'Locked ceiling with moderate diminishing returns',score:row=>diminishing(num(row.championshipResumeAudit?.adjustedTitleCredit),12)},
      stronger:{label:'Locked ceiling with stronger diminishing returns',score:row=>diminishing(num(row.championshipResumeAudit?.adjustedTitleCredit),8)}
    };
    const contribution=(score,weight)=>num(score)/30*weight;
    const nonChampPositive=row=>contribution(row.opponentQuality,27.5)+contribution(row.primeDominance,27.5)+contribution(row.longevity,10)+num(row.apexPeak);
    const scoreRows=scenario=>all.map(row=>{const championship=round(scenario.score(row),2);return{fighter:row.fighter,board:men.includes(row)?'men':'women',credit:round(num(row.championshipResumeAudit?.adjustedTitleCredit),2),currentChampionship:round(num(row.championship),2),championship,positiveTotal:round(nonChampPositive(row)+contribution(championship,35),2)};});
    const rankMap=(list,key,board)=>new Map(list.filter(x=>!board||x.board===board).slice().sort((a,b)=>num(b[key])-num(a[key])||a.fighter.localeCompare(b.fighter)).map((x,i)=>[x.fighter,i+1]));
    const categoryShares=list=>{const rowMap=new Map(all.map(x=>[x.fighter,x])),vals={championship:list.map(x=>contribution(x.championship,35)),quality:list.map(x=>contribution(rowMap.get(x.fighter)?.opponentQuality,27.5)),prime:list.map(x=>contribution(rowMap.get(x.fighter)?.primeDominance,27.5)),longevity:list.map(x=>contribution(rowMap.get(x.fighter)?.longevity,10))};const st=Object.fromEntries(Object.entries(vals).map(([k,v])=>[k,stats(v)])),sum=Object.values(st).reduce((s,x)=>s+x.stdDev,0);return Object.fromEntries(Object.entries(st).map(([k,x])=>[k,{...x,effectiveStdSharePct:round(sum?x.stdDev/sum*100:0,2)}]));};
    const currentList=scoreRows(scenarios.current),currentRanks={men:rankMap(currentList,'positiveTotal','men'),women:rankMap(currentList,'positiveTotal','women')};
    const currentTop30=new Set(currentList.slice().sort((a,b)=>b.positiveTotal-a.positiveTotal).slice(0,30).map(x=>x.fighter));
    const out={version:'championship-normalization-simulation-20260710a',generatedAt:new Date().toISOString(),readOnly:true,currentBenchmarkCredit:round(currentBenchmark,2),fixedCeilingCredit:FIXED_CEILING,existingScoresDependOnRosterSize:{currentDynamicNormalization:true,fixedCandidates:false},scenarios:{}};
    for(const [key,scenario] of Object.entries(scenarios)){
      const list=scoreRows(scenario),ranks={men:rankMap(list,'positiveTotal','men'),women:rankMap(list,'positiveTotal','women')};
      const movement=list.map(x=>({fighter:x.fighter,board:x.board,credit:x.credit,current:x.currentChampionship,candidate:x.championship,delta:round(x.championship-x.currentChampionship,2),boardRankDelta:(currentRanks[x.board].get(x.fighter)||0)-(ranks[x.board].get(x.fighter)||0)})).sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta)||a.fighter.localeCompare(b.fighter));
      const top30=list.filter(x=>currentTop30.has(x.fighter));
      out.scenarios[key]={label:scenario.label,all62:{championshipStats:stats(list.map(x=>x.championship)),categoryShares:categoryShares(list)},goatTierTop30:{championshipStats:stats(top30.map(x=>x.championship)),categoryShares:categoryShares(top30)},movement:{meanAbsoluteChampionshipDelta:round(mean(movement.map(x=>Math.abs(x.delta))),2),maxAbsoluteChampionshipDelta:round(Math.max(...movement.map(x=>Math.abs(x.delta))),2),fightersChangingBoardRank:movement.filter(x=>x.boardRankDelta!==0).length,largestChanges:movement.slice(0,15)},leaders:{men:list.filter(x=>x.board==='men').sort((a,b)=>b.positiveTotal-a.positiveTotal).slice(0,15).map((x,i)=>({rank:i+1,fighter:x.fighter,championship:x.championship,positive:x.positiveTotal})),women:list.filter(x=>x.board==='women').sort((a,b)=>b.positiveTotal-a.positiveTotal).slice(0,10).map((x,i)=>({rank:i+1,fighter:x.fighter,championship:x.championship,positive:x.positiveTotal}))}};
    }
    const futureLeaderCredits=[16,18,20];
    out.futureLeaderShock=futureLeaderCredits.map(newBenchmark=>({newBenchmark,currentDynamicMultiplier:round(currentBenchmark/newBenchmark,4),exampleCurrentScore20Becomes:round(20*currentBenchmark/newBenchmark,2),fixedLinearExistingScore20Remains:20,moderateExistingScoresRemain:true,strongerExistingScoresRemain:true}));
    out.notes=['The locked 14.5-credit ceiling is a fixed historical benchmark, not a current-roster percentile.','Candidates cap at 30; a future fighter can exceed 14.5 adjusted credits without lowering existing fighters.','Diminishing-return candidates give the first championship credits more meaning while reducing the marginal separation created by very large title-win totals.'];
    return out;
  });

  const f=n=>Number(n||0).toFixed(2),pct=n=>`${f(n)}%`;
  let md=`# Championship Resume Normalization Simulation\n\nGenerated: ${report.generatedAt}\n\nRead-only: yes. No live score, rank, OVR, or formula was changed.\n\n- Current dynamic benchmark: ${f(report.currentBenchmarkCredit)} adjusted title credits.\n- Tested fixed ceiling: ${f(report.fixedCeilingCredit)} adjusted title credits.\n\n## Roster-growth stability\n\nThe current formula uses the current leader as its benchmark. A future leader can therefore reduce every existing fighter's Championship score. The fixed-ceiling candidates do not have that behavior.\n\n| Future leader credit | Existing dynamic-score multiplier | Example current 20/30 becomes | Fixed-ceiling 20/30 remains |\n|---:|---:|---:|---:|\n`;
  for(const x of report.futureLeaderShock)md+=`| ${f(x.newBenchmark)} | ${f(x.currentDynamicMultiplier)} | ${f(x.exampleCurrentScore20Becomes)} | ${f(x.fixedLinearExistingScore20Remains)} |\n`;
  md+='\n';
  for(const key of ['current','fixedLinear','moderate','stronger']){
    const s=report.scenarios[key];
    md+=`## ${s.label}\n\n### Effective category separation\n\n| Scope | Championship share | Quality share | Prime share | Longevity share | Championship P10–P90 |\n|---|---:|---:|---:|---:|---:|\n| All 62 | ${pct(s.all62.categoryShares.championship.effectiveStdSharePct)} | ${pct(s.all62.categoryShares.quality.effectiveStdSharePct)} | ${pct(s.all62.categoryShares.prime.effectiveStdSharePct)} | ${pct(s.all62.categoryShares.longevity.effectiveStdSharePct)} | ${f(s.all62.championshipStats.p90P10)} |\n| Current top 30 | ${pct(s.goatTierTop30.categoryShares.championship.effectiveStdSharePct)} | ${pct(s.goatTierTop30.categoryShares.quality.effectiveStdSharePct)} | ${pct(s.goatTierTop30.categoryShares.prime.effectiveStdSharePct)} | ${pct(s.goatTierTop30.categoryShares.longevity.effectiveStdSharePct)} | ${f(s.goatTierTop30.championshipStats.p90P10)} |\n\n- Mean absolute Championship change: ${f(s.movement.meanAbsoluteChampionshipDelta)}\n- Maximum Championship change: ${f(s.movement.maxAbsoluteChampionshipDelta)}\n- Fighters changing board rank: ${s.movement.fightersChangingBoardRank}\n\n### Largest Championship changes\n\n| Fighter | Credit | Current | Candidate | Delta | Board-rank movement |\n|---|---:|---:|---:|---:|---:|\n`;
    for(const x of s.movement.largestChanges)md+=`| ${x.fighter} | ${f(x.credit)} | ${f(x.current)} | ${f(x.candidate)} | ${x.delta>=0?'+':''}${f(x.delta)} | ${x.boardRankDelta>=0?'+':''}${x.boardRankDelta} |\n`;
    md+='\n';
  }
  await mkdir('docs/audits',{recursive:true});
  await writeFile('docs/audits/runtime-championship-normalization-simulation.json',`${JSON.stringify(report,null,2)}\n`,'utf8');
  await writeFile('docs/audits/runtime-championship-normalization-simulation.md',`${md}\n`,'utf8');
  console.log('CHAMPIONSHIP_NORMALIZATION_SIMULATION='+JSON.stringify({fighters:62,benchmark:report.currentBenchmarkCredit,fixedCeiling:report.fixedCeilingCredit,scenarios:Object.keys(report.scenarios)}));
}finally{
  await browser.close();
}

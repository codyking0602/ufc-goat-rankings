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
    const clamp=(x,min,max)=>Math.min(max,Math.max(min,x));
    const mean=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0;
    const quantile=(a,q)=>{if(!a.length)return 0;const s=[...a].sort((a,b)=>a-b),p=(s.length-1)*q,b=Math.floor(p),f=p-b;return s[b+1]===undefined?s[b]:s[b]+f*(s[b+1]-s[b]);};
    const stats=a=>{const v=a.map(Number).filter(Number.isFinite),m=mean(v),variance=mean(v.map(x=>(x-m)**2));return{count:v.length,min:round(Math.min(...v)),max:round(Math.max(...v)),mean:round(m),median:round(quantile(v,.5)),stdDev:round(Math.sqrt(variance)),p10:round(quantile(v,.1)),p90:round(quantile(v,.9)),p90P10:round(quantile(v,.9)-quantile(v,.1))};};
    const live=win.UFC_OPPONENT_QUALITY_LIVE;
    if(!live?.report?.length)throw new Error('Opponent Quality live report unavailable.');
    const CURRENT_BENCHMARK=round(live.benchmarkCredit,2);
    const LOCKED_BENCHMARK=14.10;
    const byName=new Map(live.report.map(x=>[x.fighter,x]));
    const sourceRows=all.map(row=>{const q=byName.get(row.fighter)||row.opponentQualityLiveAudit||{};return{row,fighter:row.fighter,board:men.includes(row)?'men':'women',credit:round(q.diminishedCredit,2),rawCredit:round(q.rawCredit,2),elitePlusWins:num(q.elitePlusWins??q.eliteWins),topFivePlusWins:num(q.topFivePlusWins??q.topFiveWins),rankedQualityWins:num(q.rankedQualityWins),bestWins:Array.isArray(q.bestWins)?q.bestWins.slice(0,6):[],currentQuality:round(row.opponentQuality,2)};});
    const piecewise=(credit,anchors)=>{const x=clamp(num(credit),anchors[0][0],anchors[anchors.length-1][0]);for(let i=1;i<anchors.length;i++){const [x1,y1]=anchors[i-1],[x2,y2]=anchors[i];if(x<=x2){const t=x2===x1?0:(x-x1)/(x2-x1);return clamp(y1+t*(y2-y1),0,30);}}return 30;};
    const scenarios={
      legacyDynamic:{label:'Current dynamic leader normalization',anchors:[[0,0],[CURRENT_BENCHMARK,30]],score:x=>clamp(x/CURRENT_BENCHMARK*30,0,30),rosterStable:false},
      fixedLinear:{label:'Locked 14.10-credit linear anchors',anchors:[[0,0],[2.35,5],[4.70,10],[7.05,15],[9.40,20],[11.75,25],[14.10,30]],score:x=>clamp(x/LOCKED_BENCHMARK*30,0,30),rosterStable:true},
      resumeFriendly:{label:'Lower/middle résumé-friendly anchors',anchors:[[0,0],[2.00,5],[4.30,10],[6.50,15],[9.00,20],[11.50,25],[14.10,30]],score(x){return piecewise(x,this.anchors);},rosterStable:true},
      eliteGated:{label:'Elite-gated top-heavy anchors',anchors:[[0,0],[2.70,5],[5.20,10],[7.80,15],[10.20,20],[12.20,25],[14.10,30]],score(x){return piecewise(x,this.anchors);},rosterStable:true}
    };
    const contribution=(score,weight)=>num(score)/30*weight;
    const nonQualityPositive=row=>contribution(row.championship,35)+contribution(row.primeDominance,27.5)+contribution(row.longevity,10)+num(row.apexPeak);
    const scoreRows=scenario=>sourceRows.map(x=>{const quality=round(scenario.score(x.credit),2);return{...x,quality,positiveTotal:round(nonQualityPositive(x.row)+contribution(quality,27.5),2)};});
    const rankMap=(list,key,board)=>new Map(list.filter(x=>!board||x.board===board).slice().sort((a,b)=>num(b[key])-num(a[key])||a.fighter.localeCompare(b.fighter)).map((x,i)=>[x.fighter,i+1]));
    const categoryShares=list=>{const map=new Map(sourceRows.map(x=>[x.fighter,x.row])),vals={championship:list.map(x=>contribution(map.get(x.fighter)?.championship,35)),quality:list.map(x=>contribution(x.quality,27.5)),prime:list.map(x=>contribution(map.get(x.fighter)?.primeDominance,27.5)),longevity:list.map(x=>contribution(map.get(x.fighter)?.longevity,10))};const st=Object.fromEntries(Object.entries(vals).map(([k,v])=>[k,stats(v)])),sum=Object.values(st).reduce((s,x)=>s+x.stdDev,0);return Object.fromEntries(Object.entries(st).map(([k,x])=>[k,{...x,effectiveStdSharePct:round(sum?x.stdDev/sum*100:0,2)}]));};
    const currentList=scoreRows(scenarios.legacyDynamic),currentRanks={men:rankMap(currentList,'positiveTotal','men'),women:rankMap(currentList,'positiveTotal','women')};
    const currentTop30=new Set(currentList.slice().sort((a,b)=>b.positiveTotal-a.positiveTotal).slice(0,30).map(x=>x.fighter));
    const out={version:'quality-anchor-review-20260710a',generatedAt:new Date().toISOString(),readOnly:true,currentBenchmarkCredit:CURRENT_BENCHMARK,lockedBenchmarkCredit:LOCKED_BENCHMARK,inputFormula:win.UFC_OPPONENT_QUALITY_LEDGERS?.formula||null,creditScale:win.UFC_OPPONENT_QUALITY_LEDGERS?.creditScale||null,diminishingReturns:win.UFC_OPPONENT_QUALITY_LEDGERS?.diminishingReturns||null,categoryMeanings:{0:'No meaningful UFC quality-win credit',5:'Limited quality-win résumé',10:'Solid ranked-win résumé',15:'Established elite-win résumé',20:'Great quality-win résumé',25:'All-time quality-win résumé',30:'Historical benchmark'},scenarios:{}};
    for(const [key,scenario] of Object.entries(scenarios)){
      const list=scoreRows(scenario),ranks={men:rankMap(list,'positiveTotal','men'),women:rankMap(list,'positiveTotal','women')};
      const movement=list.map(x=>({fighter:x.fighter,board:x.board,credit:x.credit,current:x.currentQuality,candidate:x.quality,delta:round(x.quality-x.currentQuality,2),boardRankDelta:(currentRanks[x.board].get(x.fighter)||0)-(ranks[x.board].get(x.fighter)||0)})).sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta)||a.fighter.localeCompare(b.fighter));
      const top30=list.filter(x=>currentTop30.has(x.fighter));
      const examples={};for(const target of [5,10,15,20,25,30])examples[target]=list.slice().sort((a,b)=>Math.abs(a.quality-target)-Math.abs(b.quality-target)||b.credit-a.credit).slice(0,6).map(x=>({fighter:x.fighter,board:x.board,credit:x.credit,score:x.quality,elitePlusWins:x.elitePlusWins,topFivePlusWins:x.topFivePlusWins,rankedQualityWins:x.rankedQualityWins}));
      out.scenarios[key]={label:scenario.label,anchors:scenario.anchors,rosterStable:scenario.rosterStable,all62:{qualityStats:stats(list.map(x=>x.quality)),categoryShares:categoryShares(list)},goatTierTop30:{qualityStats:stats(top30.map(x=>x.quality)),categoryShares:categoryShares(top30)},movement:{meanAbsoluteQualityDelta:round(mean(movement.map(x=>Math.abs(x.delta))),2),maxAbsoluteQualityDelta:round(Math.max(...movement.map(x=>Math.abs(x.delta))),2),fightersChangingBoardRank:movement.filter(x=>x.boardRankDelta!==0).length,largestChanges:movement.slice(0,15)},examples};
    }
    out.futureLeaderShock=[16,18,20].map(newBenchmark=>({newBenchmark,legacyMultiplier:round(CURRENT_BENCHMARK/newBenchmark,4),exampleCurrentScore20Becomes:round(20*CURRENT_BENCHMARK/newBenchmark,2),fixedScore20Remains:20}));
    return out;
  });

  const f=n=>Number(n||0).toFixed(2),pct=n=>`${f(n)}%`;
  let md=`# Quality Wins Anchor Review\n\nGenerated: ${report.generatedAt}\n\nRead-only: yes. No live score, total, rank, OVR, ledger, or formula was changed.\n\n## Existing inputs\n\n- Win-credit scale: each UFC win receives a fixed opponent-quality credit.\n- Diminishing returns: ${report.inputFormula||'Current ledger diminishing-return formula loaded at runtime.'}\n- Current dynamic benchmark: ${f(report.currentBenchmarkCredit)} diminished credits.\n- Candidate permanent benchmark: ${f(report.lockedBenchmarkCredit)} diminished credits.\n\n## Proposed score meanings\n\n| Score | Meaning |\n|---:|---|\n`;
  for(const [score,meaning] of Object.entries(report.categoryMeanings))md+=`| ${score} | ${meaning} |\n`;
  md+='\n';
  for(const key of ['legacyDynamic','fixedLinear','resumeFriendly','eliteGated']){
    const s=report.scenarios[key];
    md+=`## ${s.label}\n\n- Roster-growth stable: ${String(s.rosterStable)}\n- Anchors: ${s.anchors.map(([x,y])=>`${f(x)} credit = ${f(y)}/30`).join('; ')}\n\n| Scope | Championship influence | Quality influence | Prime influence | Longevity influence | Quality P10–P90 |\n|---|---:|---:|---:|---:|---:|\n| All 62 | ${pct(s.all62.categoryShares.championship.effectiveStdSharePct)} | ${pct(s.all62.categoryShares.quality.effectiveStdSharePct)} | ${pct(s.all62.categoryShares.prime.effectiveStdSharePct)} | ${pct(s.all62.categoryShares.longevity.effectiveStdSharePct)} | ${f(s.all62.qualityStats.p90P10)} |\n| Current top 30 | ${pct(s.goatTierTop30.categoryShares.championship.effectiveStdSharePct)} | ${pct(s.goatTierTop30.categoryShares.quality.effectiveStdSharePct)} | ${pct(s.goatTierTop30.categoryShares.prime.effectiveStdSharePct)} | ${pct(s.goatTierTop30.categoryShares.longevity.effectiveStdSharePct)} | ${f(s.goatTierTop30.qualityStats.p90P10)} |\n\n- Mean absolute Quality change: ${f(s.movement.meanAbsoluteQualityDelta)}\n- Maximum Quality change: ${f(s.movement.maxAbsoluteQualityDelta)}\n- Fighters changing board rank: ${s.movement.fightersChangingBoardRank}\n\n### Score-level examples\n\n| Score level | Representative fighters |\n|---:|---|\n`;
    for(const target of [5,10,15,20,25,30])md+=`| ${target} | ${s.examples[target].map(x=>`${x.fighter} (${f(x.credit)} credit, ${f(x.score)})`).join('; ')} |\n`;
    md+=`\n### Largest changes\n\n| Fighter | Credit | Current | Candidate | Delta | Board-rank movement |\n|---|---:|---:|---:|---:|---:|\n`;
    for(const x of s.movement.largestChanges)md+=`| ${x.fighter} | ${f(x.credit)} | ${f(x.current)} | ${f(x.candidate)} | ${x.delta>=0?'+':''}${f(x.delta)} | ${x.boardRankDelta>=0?'+':''}${x.boardRankDelta} |\n`;
    md+='\n';
  }
  md+=`## Roster-growth stability\n\n| Future leader credit | Dynamic multiplier | Example current 20/30 becomes | Fixed 20/30 remains |\n|---:|---:|---:|---:|\n`;
  for(const x of report.futureLeaderShock)md+=`| ${f(x.newBenchmark)} | ${f(x.legacyMultiplier)} | ${f(x.exampleCurrentScore20Becomes)} | ${f(x.fixedScore20Remains)} |\n`;
  await mkdir('docs/audits',{recursive:true});
  await writeFile('docs/audits/runtime-quality-anchor-review.json',`${JSON.stringify(report,null,2)}\n`,'utf8');
  await writeFile('docs/audits/runtime-quality-anchor-review.md',`${md}\n`,'utf8');
  console.log('QUALITY_ANCHOR_REVIEW='+JSON.stringify({fighters:62,currentBenchmark:report.currentBenchmarkCredit,lockedBenchmark:report.lockedBenchmarkCredit,scenarios:Object.keys(report.scenarios)}));
}finally{
  await browser.close();
}

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
    const clamp=(x,min,max)=>Math.min(max,Math.max(min,x));
    const mean=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0;
    const quantile=(a,q)=>{if(!a.length)return 0;const s=[...a].sort((a,b)=>a-b),p=(s.length-1)*q,b=Math.floor(p),f=p-b;return s[b+1]===undefined?s[b]:s[b]+f*(s[b+1]-s[b]);};
    const stats=a=>{const v=a.map(Number).filter(Number.isFinite),m=mean(v),variance=mean(v.map(x=>(x-m)**2));return{count:v.length,min:round(Math.min(...v)),max:round(Math.max(...v)),mean:round(m),median:round(quantile(v,.5)),stdDev:round(Math.sqrt(variance)),p10:round(quantile(v,.1)),p90:round(quantile(v,.9)),p90P10:round(quantile(v,.9)-quantile(v,.1))};};
    const byName=new Map(primeReport.map(x=>[x.fighter,x]));
    const sourceRows=all.map(row=>{const p=byName.get(row.fighter)||row.primeDominanceLiveAudit||{};return{row,fighter:row.fighter,board:men.includes(row)?'men':'women',currentPrime:round(row.primeDominance,2),components:{record:round(p.primeRecordScore,2),roundControl:round(p.roundControlScore,2),finish:round(p.finishPressureScore,2),elite:round(p.eliteStakesScore,2)},primeRecord:p.primeRecord||row.primeRecord||'',roundControlPct:round(p.roundControlPct,2),finishRate:round(p.primeFinishRate,2),profile:p.dominanceProfile||''};});
    const piecewise=(value,anchors)=>{const x=clamp(num(value),anchors[0][0],anchors[anchors.length-1][0]);for(let i=1;i<anchors.length;i++){const [x1,y1]=anchors[i-1],[x2,y2]=anchors[i];if(x<=x2){const t=x2===x1?0:(x-x1)/(x2-x1);return clamp(y1+t*(y2-y1),0,30);}}return 30;};
    const scenarios={
      current:{label:'Current direct component sum',anchors:[[0,0],[5,5],[10,10],[15,15],[20,20],[25,25],[30,30]],score:x=>clamp(x,0,30),secondConversion:false},
      strictLower:{label:'Stricter lower/middle semantic ladder',anchors:[[0,0],[8,5],[13,10],[17,15],[20,20],[25,25],[30,30]],score(x){return piecewise(x,this.anchors);},secondConversion:true},
      benchmarkLift:{label:'Current scale with benchmark-level top lift',anchors:[[0,0],[5,5],[10,10],[15,15],[20,20],[25,25],[28.24,30],[30,30]],score(x){return piecewise(x,this.anchors);},secondConversion:true},
      fullSpread:{label:'Full elite-roster spread',anchors:[[0,0],[10,5],[14,10],[18,15],[21,20],[25,25],[28.24,30],[30,30]],score(x){return piecewise(x,this.anchors);},secondConversion:true}
    };
    const contribution=(score,weight)=>num(score)/30*weight;
    const nonPrimePositive=row=>contribution(row.championship,35)+contribution(row.opponentQuality,27.5)+contribution(row.longevity,10)+num(row.apexPeak);
    const scoreRows=scenario=>sourceRows.map(x=>{const prime=round(scenario.score(x.currentPrime),2);return{...x,prime,positiveTotal:round(nonPrimePositive(x.row)+contribution(prime,27.5),2)};});
    const rankMap=(list,key,board)=>new Map(list.filter(x=>!board||x.board===board).slice().sort((a,b)=>num(b[key])-num(a[key])||a.fighter.localeCompare(b.fighter)).map((x,i)=>[x.fighter,i+1]));
    const categoryShares=list=>{const map=new Map(sourceRows.map(x=>[x.fighter,x.row])),vals={championship:list.map(x=>contribution(map.get(x.fighter)?.championship,35)),quality:list.map(x=>contribution(map.get(x.fighter)?.opponentQuality,27.5)),prime:list.map(x=>contribution(x.prime,27.5)),longevity:list.map(x=>contribution(map.get(x.fighter)?.longevity,10))};const st=Object.fromEntries(Object.entries(vals).map(([k,v])=>[k,stats(v)])),sum=Object.values(st).reduce((s,x)=>s+x.stdDev,0);return Object.fromEntries(Object.entries(st).map(([k,x])=>[k,{...x,effectiveStdSharePct:round(sum?x.stdDev/sum*100:0,2)}]));};
    const currentList=scoreRows(scenarios.current),currentRanks={men:rankMap(currentList,'positiveTotal','men'),women:rankMap(currentList,'positiveTotal','women')};
    const currentTop30=new Set(currentList.slice().sort((a,b)=>b.positiveTotal-a.positiveTotal).slice(0,30).map(x=>x.fighter));
    const out={version:'prime-anchor-review-20260710a',generatedAt:new Date().toISOString(),readOnly:true,existingFormula:'Prime Dominance = Prime Record /9 + Round Control /8 + Finish Pressure /5 + Elite Stakes /8.',componentMaximums:{record:9,roundControl:8,finish:5,elite:8},categoryMeanings:{0:'No meaningful elite UFC prime',5:'Brief ranked-level prime',10:'Solid contender-level prime',15:'Established elite contender prime',20:'Championship-level prime',25:'Historically dominant champion prime',30:'Benchmark-level dominance'},scenarios:{}};
    for(const [key,scenario] of Object.entries(scenarios)){
      const list=scoreRows(scenario),ranks={men:rankMap(list,'positiveTotal','men'),women:rankMap(list,'positiveTotal','women')};
      const movement=list.map(x=>({fighter:x.fighter,board:x.board,current:x.currentPrime,candidate:x.prime,delta:round(x.prime-x.currentPrime,2),boardRankDelta:(currentRanks[x.board].get(x.fighter)||0)-(ranks[x.board].get(x.fighter)||0)})).sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta)||a.fighter.localeCompare(b.fighter));
      const top30=list.filter(x=>currentTop30.has(x.fighter));
      const examples={};for(const target of [10,15,20,25,30])examples[target]=list.slice().sort((a,b)=>Math.abs(a.prime-target)-Math.abs(b.prime-target)||b.currentPrime-a.currentPrime).slice(0,8).map(x=>({fighter:x.fighter,board:x.board,currentPrime:x.currentPrime,score:x.prime,components:x.components,profile:x.profile}));
      out.scenarios[key]={label:scenario.label,anchors:scenario.anchors,secondConversion:scenario.secondConversion,all62:{primeStats:stats(list.map(x=>x.prime)),categoryShares:categoryShares(list)},goatTierTop30:{primeStats:stats(top30.map(x=>x.prime)),categoryShares:categoryShares(top30)},movement:{meanAbsolutePrimeDelta:round(mean(movement.map(x=>Math.abs(x.delta))),2),maxAbsolutePrimeDelta:round(Math.max(...movement.map(x=>Math.abs(x.delta))),2),fightersChangingBoardRank:movement.filter(x=>x.boardRankDelta!==0).length,largestChanges:movement.slice(0,15)},examples};
    }
    return out;
  });

  const f=n=>Number(n||0).toFixed(2),pct=n=>`${f(n)}%`;
  let md=`# Prime Dominance Anchor Review\n\nGenerated: ${report.generatedAt}\n\nRead-only: yes. No live Prime score, component formula, total, rank, or OVR was changed.\n\n## Existing inputs\n\n${report.existingFormula}\n\nThe current score is already a direct fixed-accomplishment sum. It is not normalized to the roster average, percentile, or current leader.\n\n## Proposed score meanings\n\n| Score | Meaning |\n|---:|---|\n`;
  for(const [score,meaning] of Object.entries(report.categoryMeanings))md+=`| ${score} | ${meaning} |\n`;
  md+='\n';
  for(const key of ['current','strictLower','benchmarkLift','fullSpread']){
    const s=report.scenarios[key];
    md+=`## ${s.label}\n\n- Adds a second conversion over the component total: ${String(s.secondConversion)}\n- Anchors: ${s.anchors.map(([x,y])=>`${f(x)} input = ${f(y)}/30`).join('; ')}\n\n| Scope | Championship influence | Quality influence | Prime influence | Longevity influence | Prime P10–P90 |\n|---|---:|---:|---:|---:|---:|\n| All 62 | ${pct(s.all62.categoryShares.championship.effectiveStdSharePct)} | ${pct(s.all62.categoryShares.quality.effectiveStdSharePct)} | ${pct(s.all62.categoryShares.prime.effectiveStdSharePct)} | ${pct(s.all62.categoryShares.longevity.effectiveStdSharePct)} | ${f(s.all62.primeStats.p90P10)} |\n| Current top 30 | ${pct(s.goatTierTop30.categoryShares.championship.effectiveStdSharePct)} | ${pct(s.goatTierTop30.categoryShares.quality.effectiveStdSharePct)} | ${pct(s.goatTierTop30.categoryShares.prime.effectiveStdSharePct)} | ${pct(s.goatTierTop30.categoryShares.longevity.effectiveStdSharePct)} | ${f(s.goatTierTop30.primeStats.p90P10)} |\n\n- Mean absolute Prime change: ${f(s.movement.meanAbsolutePrimeDelta)}\n- Maximum Prime change: ${f(s.movement.maxAbsolutePrimeDelta)}\n- Fighters changing board rank: ${s.movement.fightersChangingBoardRank}\n\n### Score-level examples\n\n| Score level | Representative fighters |\n|---:|---|\n`;
    for(const target of [10,15,20,25,30])md+=`| ${target} | ${s.examples[target].map(x=>`${x.fighter} (${f(x.currentPrime)} input → ${f(x.score)})`).join('; ')} |\n`;
    md+=`\n### Largest changes\n\n| Fighter | Current | Candidate | Delta | Board-rank movement |\n|---|---:|---:|---:|---:|\n`;
    for(const x of s.movement.largestChanges)md+=`| ${x.fighter} | ${f(x.current)} | ${f(x.candidate)} | ${x.delta>=0?'+':''}${f(x.delta)} | ${x.boardRankDelta>=0?'+':''}${x.boardRankDelta} |\n`;
    md+='\n';
  }
  await mkdir('docs/audits',{recursive:true});
  await writeFile('docs/audits/runtime-prime-anchor-review.json',`${JSON.stringify(report,null,2)}\n`,'utf8');
  await writeFile('docs/audits/runtime-prime-anchor-review.md',`${md}\n`,'utf8');
  console.log('PRIME_ANCHOR_REVIEW='+JSON.stringify({fighters:62,scenarios:Object.keys(report.scenarios),currentInfluence:report.scenarios.current.all62.categoryShares.prime.effectiveStdSharePct,fullSpreadInfluence:report.scenarios.fullSpread.all62.categoryShares.prime.effectiveStdSharePct}));
}finally{
  await browser.close();
}

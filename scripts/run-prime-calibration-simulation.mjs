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
    const primeSource=win.UFC_PRIME_DOMINANCE_LEDGERS?.report||win.UFC_PRIME_DOMINANCE_SHADOW_MODEL?.report||[];
    const primeByName=new Map(primeSource.map(x=>[x.fighter,x]));
    const rows=all.map(row=>({row,prime:primeByName.get(row.fighter)})).filter(x=>x.prime);
    const num=(v,d=0)=>Number.isFinite(Number(v))?Number(v):d;
    const round=(v,d=3)=>{const p=10**d;return Math.round((num(v)+Number.EPSILON)*p)/p;};
    const mean=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0;
    const quantile=(a,q)=>{if(!a.length)return 0;const s=[...a].sort((a,b)=>a-b),p=(s.length-1)*q,b=Math.floor(p),f=p-b;return s[b+1]===undefined?s[b]:s[b]+f*(s[b+1]-s[b]);};
    const stats=a=>{const v=a.map(Number).filter(Number.isFinite),m=mean(v),variance=mean(v.map(x=>(x-m)**2));return{count:v.length,min:round(Math.min(...v)),max:round(Math.max(...v)),mean:round(m),median:round(quantile(v,.5)),stdDev:round(Math.sqrt(variance)),p10:round(quantile(v,.1)),p90:round(quantile(v,.9)),p90P10:round(quantile(v,.9)-quantile(v,.1))};};
    const interpolate=(value,anchors)=>{const x=num(value);if(x<=anchors[0][0])return anchors[0][1];for(let i=1;i<anchors.length;i++){const [x1,y1]=anchors[i-1],[x2,y2]=anchors[i];if(x<=x2){const t=(x-x1)/(x2-x1||1);return y1+t*(y2-y1);}}return anchors[anchors.length-1][1];};
    const clamp=(x,min,max)=>Math.min(max,Math.max(min,x));
    const currentFinish=rate=>{const scale=[[.90,5],[.75,4.5],[.60,4],[.45,3],[.30,2],[.15,1],[0,.5]];return(scale.find(([min])=>rate>=min)||scale.at(-1))[1];};
    const scenarios={
      current:{
        label:'Current locked model',
        roundAnchors:null,finishAnchors:null,eliteAnchors:null,
        score:p=>({record:num(p.primeRecordScore),round:num(p.roundControlScore),finish:num(p.finishPressureScore,currentFinish(num(p.primeFinishRate)/100)),elite:num(p.eliteStakesScore)})
      },
      conservative:{
        label:'Conservative fixed-anchor calibration',
        roundAnchors:[[0,0],[.45,2.7],[.60,4.5],[.75,6.3],[.90,8],[1,8]],
        finishAnchors:[[0,.5],[.15,1.1],[.30,1.7],[.45,2.3],[.60,3],[.75,3.8],[.90,4.6],[1,5]],
        eliteAnchors:[[0,0],[1,1],[2,2.4],[3,4.1],[4,6.1],[5,8]],
        score:p=>({record:num(p.primeRecordScore),round:interpolate(num(p.roundControlPct)/100,scenarios.conservative.roundAnchors),finish:interpolate(num(p.primeFinishRate)/100,scenarios.conservative.finishAnchors),elite:interpolate(num(p.eliteStakesRawScore),scenarios.conservative.eliteAnchors)})
      },
      stronger:{
        label:'Stronger fixed-anchor calibration',
        roundAnchors:[[0,0],[.45,2],[.60,4],[.75,6.5],[.85,8],[1,8]],
        finishAnchors:[[0,.75],[.15,1.15],[.30,1.6],[.45,2.1],[.60,2.7],[.75,3.4],[.90,4.3],[1,5]],
        eliteAnchors:[[0,0],[1,.8],[2,2],[3,3.7],[4,5.9],[5,8]],
        score:p=>({record:num(p.primeRecordScore),round:interpolate(num(p.roundControlPct)/100,scenarios.stronger.roundAnchors),finish:interpolate(num(p.primeFinishRate)/100,scenarios.stronger.finishAnchors),elite:interpolate(num(p.eliteStakesRawScore),scenarios.stronger.eliteAnchors)})
      }
    };
    const contribution=(row,key,weight)=>num(row[key])/30*weight;
    const nonPrimePositive=row=>contribution(row,'championship',35)+contribution(row,'opponentQuality',27.5)+contribution(row,'longevity',10)+num(row.apexPeak);
    const scoreRow=(item,scenario)=>{const c=scenario.score(item.prime),primeTotal=clamp(c.record+c.round+c.finish+c.elite,0,30);return{fighter:item.row.fighter,board:men.includes(item.row)?'men':'women',components:Object.fromEntries(Object.entries(c).map(([k,v])=>[k,round(v,2)])),primeTotal:round(primeTotal,2),positiveTotal:round(nonPrimePositive(item.row)+primeTotal/30*27.5,2),currentPrime:round(num(item.row.primeDominance),2)};};
    const rankMap=(list,key,board)=>new Map(list.filter(x=>!board||x.board===board).slice().sort((a,b)=>num(b[key])-num(a[key])||a.fighter.localeCompare(b.fighter)).map((x,i)=>[x.fighter,i+1]));
    const componentShares=list=>{const keys=['record','round','finish','elite'],st=Object.fromEntries(keys.map(k=>[k,stats(list.map(x=>x.components[k]))])),sum=keys.reduce((s,k)=>s+st[k].stdDev,0),spread=keys.reduce((s,k)=>s+st[k].p90P10,0);return Object.fromEntries(keys.map(k=>[k,{...st[k],effectiveStdSharePct:round(sum?st[k].stdDev/sum*100:0,2),robustSpreadSharePct:round(spread?st[k].p90P10/spread*100:0,2)}]));};
    const topCategoryShares=list=>{const defs={championship:35,quality:27.5,prime:27.5,longevity:10};const values={championship:list.map(x=>contribution(all.find(r=>r.fighter===x.fighter),'championship',35)),quality:list.map(x=>contribution(all.find(r=>r.fighter===x.fighter),'opponentQuality',27.5)),prime:list.map(x=>x.primeTotal/30*27.5),longevity:list.map(x=>contribution(all.find(r=>r.fighter===x.fighter),'longevity',10))};const st=Object.fromEntries(Object.keys(defs).map(k=>[k,stats(values[k])])),sum=Object.values(st).reduce((s,x)=>s+x.stdDev,0);return Object.fromEntries(Object.keys(defs).map(k=>[k,{declaredPct:defs[k],stdDev:st[k].stdDev,effectiveStdSharePct:round(sum?st[k].stdDev/sum*100:0,2)}]));};
    const output={version:'prime-fixed-anchor-calibration-simulation-20260710a',generatedAt:new Date().toISOString(),readOnly:true,existingScoresDependOnRosterSize:false,notes:['All candidate formulas use fixed performance anchors, not roster averages or percentiles.','Existing fighter scores do not change merely because more fighters are added.','The 200-fighter sensitivity panel is deterministic and directional only; it is not a set of real fighter scores.'],scenarios:{}};
    const currentList=rows.map(x=>scoreRow(x,scenarios.current));
    const currentPrimeRanks=rankMap(currentList,'primeTotal'),currentBoardPositive={men:rankMap(currentList,'positiveTotal','men'),women:rankMap(currentList,'positiveTotal','women')};
    const currentTop30=new Set(currentList.slice().sort((a,b)=>b.positiveTotal-a.positiveTotal).slice(0,30).map(x=>x.fighter));
    for(const [key,scenario] of Object.entries(scenarios)){
      const list=rows.map(x=>scoreRow(x,scenario));
      const primeRanks=rankMap(list,'primeTotal'),boardRanks={men:rankMap(list,'positiveTotal','men'),women:rankMap(list,'positiveTotal','women')};
      const movements=list.map(x=>({fighter:x.fighter,board:x.board,currentPrime:x.currentPrime,candidatePrime:x.primeTotal,primeDelta:round(x.primeTotal-x.currentPrime,2),primeRankDelta:(currentPrimeRanks.get(x.fighter)||0)-(primeRanks.get(x.fighter)||0),positiveBoardRankDelta:(currentBoardPositive[x.board].get(x.fighter)||0)-(boardRanks[x.board].get(x.fighter)||0)})).sort((a,b)=>Math.abs(b.primeDelta)-Math.abs(a.primeDelta)||a.fighter.localeCompare(b.fighter));
      const top30=list.filter(x=>currentTop30.has(x.fighter));
      output.scenarios[key]={label:scenario.label,anchors:{round:scenario.roundAnchors,finish:scenario.finishAnchors,elite:scenario.eliteAnchors},all62:{primeTotalStats:stats(list.map(x=>x.primeTotal)),componentShares:componentShares(list),topLevelCategoryShares:topCategoryShares(list)},goatTierTop30:{primeTotalStats:stats(top30.map(x=>x.primeTotal)),componentShares:componentShares(top30),topLevelCategoryShares:topCategoryShares(top30)},movement:{meanAbsolutePrimeDelta:round(mean(movements.map(x=>Math.abs(x.primeDelta))),2),maxAbsolutePrimeDelta:round(Math.max(...movements.map(x=>Math.abs(x.primeDelta))),2),fightersChangingBoardRank:movements.filter(x=>x.positiveBoardRankDelta!==0).length,largestPrimeChanges:movements.slice(0,15)},leaders:{men:list.filter(x=>x.board==='men').sort((a,b)=>b.positiveTotal-a.positiveTotal).slice(0,15).map((x,i)=>({rank:i+1,fighter:x.fighter,prime:x.primeTotal,positive:x.positiveTotal})),women:list.filter(x=>x.board==='women').sort((a,b)=>b.positiveTotal-a.positiveTotal).slice(0,10).map((x,i)=>({rank:i+1,fighter:x.fighter,prime:x.primeTotal,positive:x.positiveTotal}))}};
    }
    const synthetic=[];
    for(let i=0;i<138;i++){
      const a=((i*37)%138)/137,b=((i*53)%138)/137,c=((i*71)%138)/137,d=((i*89)%138)/137;
      const recordPct=.45+.30*a,roundPct=.38+.27*b,finishRate=.05+.50*c,eliteRaw=.30+2.40*d;
      synthetic.push({primeRecordScore:recordPct*9,roundControlPct:roundPct*100,primeFinishRate:finishRate*100,eliteStakesRawScore:eliteRaw,roundControlScore:roundPct*8,finishPressureScore:currentFinish(finishRate),eliteStakesScore:eliteRaw/5*8});
    }
    output.futureRosterSensitivity={description:'Current 62 plus 138 deterministic lower-tier Prime profiles (200 total). The panel tests scale behavior only.',scenarios:{}};
    for(const [key,scenario] of Object.entries(scenarios)){
      const existing=rows.map(x=>scenario.score(x.prime)),added=synthetic.map(p=>scenario.score(p)),combined=[...existing,...added].map(c=>({components:c,primeTotal:clamp(c.record+c.round+c.finish+c.elite,0,30)}));
      output.futureRosterSensitivity.scenarios[key]={primeTotalStats:stats(combined.map(x=>x.primeTotal)),componentShares:componentShares(combined)};
    }
    return output;
  });

  const f=n=>Number(n||0).toFixed(2),pct=n=>`${f(n)}%`;
  let md=`# Prime Dominance Fixed-Anchor Calibration Simulation\n\nGenerated: ${report.generatedAt}\n\nRead-only: yes. No live fighter score, rank, OVR, or formula was changed.\n\n## Design rule\n\nCandidate scores are based on fixed accomplishment anchors, not the average or percentile distribution of the current 62 fighters. Adding future fighters does not automatically alter an existing fighter's score.\n\n`;
  for(const key of ['current','conservative','stronger']){
    const s=report.scenarios[key];
    md+=`## ${s.label}\n\n### All 62 fighters — effective top-level separation\n\n| Category | Declared | Effective std share |\n|---|---:|---:|\n`;
    for(const [name,x] of Object.entries(s.all62.topLevelCategoryShares))md+=`| ${name} | ${pct(x.declaredPct)} | ${pct(x.effectiveStdSharePct)} |\n`;
    md+=`\n### Prime components — all 62\n\n| Component | Mean | Std dev | P10–P90 | Effective std share |\n|---|---:|---:|---:|---:|\n`;
    for(const [name,x] of Object.entries(s.all62.componentShares))md+=`| ${name} | ${f(x.mean)} | ${f(x.stdDev)} | ${f(x.p90P10)} | ${pct(x.effectiveStdSharePct)} |\n`;
    md+=`\n### GOAT debate tier — current top 30\n\n- Prime mean: ${f(s.goatTierTop30.primeTotalStats.mean)}\n- Prime P10–P90 spread: ${f(s.goatTierTop30.primeTotalStats.p90P10)}\n- Prime effective top-level share: ${pct(s.goatTierTop30.topLevelCategoryShares.prime.effectiveStdSharePct)}\n- Mean absolute Prime score change: ${f(s.movement.meanAbsolutePrimeDelta)}\n- Maximum Prime score change: ${f(s.movement.maxAbsolutePrimeDelta)}\n- Fighters changing board rank: ${s.movement.fightersChangingBoardRank}\n\n### Largest Prime score changes\n\n| Fighter | Current | Candidate | Delta | Board-rank movement |\n|---|---:|---:|---:|---:|\n`;
    for(const x of s.movement.largestPrimeChanges)md+=`| ${x.fighter} | ${f(x.currentPrime)} | ${f(x.candidatePrime)} | ${x.primeDelta>=0?'+':''}${f(x.primeDelta)} | ${x.positiveBoardRankDelta>=0?'+':''}${x.positiveBoardRankDelta} |\n`;
    md+='\n';
  }
  md+=`## Future 200-fighter sensitivity\n\nThis directional panel adds 138 deterministic lower-tier Prime profiles. It does not alter the 62 real fighters or pretend to predict specific future additions.\n\n| Scenario | Prime mean | Prime P10–P90 | Record share | Round share | Finish share | Elite share |\n|---|---:|---:|---:|---:|---:|---:|\n`;
  for(const [key,s] of Object.entries(report.futureRosterSensitivity.scenarios))md+=`| ${report.scenarios[key].label} | ${f(s.primeTotalStats.mean)} | ${f(s.primeTotalStats.p90P10)} | ${pct(s.componentShares.record.effectiveStdSharePct)} | ${pct(s.componentShares.round.effectiveStdSharePct)} | ${pct(s.componentShares.finish.effectiveStdSharePct)} | ${pct(s.componentShares.elite.effectiveStdSharePct)} |\n`;

  await mkdir('docs/audits',{recursive:true});
  await writeFile('docs/audits/runtime-prime-calibration-simulation.json',`${JSON.stringify(report,null,2)}\n`,'utf8');
  await writeFile('docs/audits/runtime-prime-calibration-simulation.md',`${md}\n`,'utf8');
  console.log('PRIME_CALIBRATION_SIMULATION='+JSON.stringify({fighters:62,scenarios:Object.keys(report.scenarios),futurePanel:200}));
}finally{
  await browser.close();
}

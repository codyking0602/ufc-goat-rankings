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
    const clamp=(x,min,max)=>Math.min(max,Math.max(min,x));
    const mean=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0;
    const quantile=(a,q)=>{if(!a.length)return 0;const s=[...a].sort((a,b)=>a-b),p=(s.length-1)*q,b=Math.floor(p),f=p-b;return s[b+1]===undefined?s[b]:s[b]+f*(s[b+1]-s[b]);};
    const stats=a=>{const v=a.map(Number).filter(Number.isFinite),m=mean(v),variance=mean(v.map(x=>(x-m)**2));return{count:v.length,min:round(Math.min(...v)),max:round(Math.max(...v)),mean:round(m),median:round(quantile(v,.5)),stdDev:round(Math.sqrt(variance)),p10:round(quantile(v,.1)),p90:round(quantile(v,.9)),p90P10:round(quantile(v,.9)-quantile(v,.1))};};
    const byName=new Map(shadow.rows.map(x=>[x.fighter,x]));
    const sourceRows=all.map(row=>{const x=byName.get(row.fighter)||row.longevityAudit||{};return{row,fighter:row.fighter,board:men.includes(row)?'men':'women',months:round(x.countedEliteMonths,2),activeEliteYears:round(x.activeEliteYears??row.activeEliteYears,2),currentLongevity:round(row.longevity,2),ceilingApplied:!!x.ceilingApplied};});
    const piecewise=(months,anchors)=>{const x=Math.max(0,num(months));for(let i=1;i<anchors.length;i++){const [x1,y1]=anchors[i-1],[x2,y2]=anchors[i];if(x<=x2){const t=x2===x1?0:(x-x1)/(x2-x1);return clamp(y1+t*(y2-y1),0,30);}}return 30;};
    const scenarios={
      current:{label:'Current 120-month linear scale',anchors:[[0,0],[20,5],[40,10],[60,15],[80,20],[100,25],[120,30]],score:x=>clamp(x/120*30,0,30)},
      earlyRecognition:{label:'Earlier elite-recognition anchors',anchors:[[0,0],[12,5],[30,10],[50,15],[72,20],[96,25],[120,30]],score(x){return piecewise(x,this.anchors);}},
      middleCompressed:{label:'Compressed middle, preserved historical top',anchors:[[0,0],[16,5],[36,10],[60,15],[84,20],[108,25],[120,30]],score(x){return piecewise(x,this.anchors);}},
      historicGated:{label:'Historically gated longevity anchors',anchors:[[0,0],[24,5],[48,10],[72,15],[92,20],[108,25],[120,30]],score(x){return piecewise(x,this.anchors);}}
    };
    const contribution=(score,weight)=>num(score)/30*weight;
    const totalFor=(row,longevity)=>round(contribution(row.championship,35)+contribution(row.opponentQuality,27.5)+contribution(row.primeDominance,27.5)+contribution(longevity,10)+num(row.apexPeak)+num(row.penalty),2);
    const scoreRows=scenario=>sourceRows.map(x=>({...x,longevity:round(scenario.score(x.months),2),candidateTotal:totalFor(x.row,scenario.score(x.months))}));
    const rankMap=(list,board)=>new Map(list.filter(x=>x.board===board).slice().sort((a,b)=>b.candidateTotal-a.candidateTotal||a.fighter.localeCompare(b.fighter)).map((x,i)=>[x.fighter,i+1]));
    const categoryShares=list=>{const vals={championship:list.map(x=>contribution(x.row.championship,35)),quality:list.map(x=>contribution(x.row.opponentQuality,27.5)),prime:list.map(x=>contribution(x.row.primeDominance,27.5)),longevity:list.map(x=>contribution(x.longevity,10))};const st=Object.fromEntries(Object.entries(vals).map(([k,v])=>[k,stats(v)])),sum=Object.values(st).reduce((s,x)=>s+x.stdDev,0);return Object.fromEntries(Object.entries(st).map(([k,x])=>[k,{...x,effectiveStdSharePct:round(sum?x.stdDev/sum*100:0,2)}]));};
    const currentList=scoreRows(scenarios.current),currentRanks={men:rankMap(currentList,'men'),women:rankMap(currentList,'women')};
    const currentTop30=new Set(currentList.slice().sort((a,b)=>b.candidateTotal-a.candidateTotal).slice(0,30).map(x=>x.fighter));
    const out={version:'longevity-anchor-review-20260710a',generatedAt:new Date().toISOString(),readOnly:true,currentFormula:shadow.formula,maxMonths:shadow.maxMonths,categoryMeanings:{0:'No meaningful elite UFC longevity',5:'Brief elite window',10:'Established multi-year elite relevance',15:'Strong sustained elite run',20:'Great UFC elite longevity',25:'All-time elite longevity',30:'Historical benchmark longevity'},scenarios:{}};
    for(const [key,scenario] of Object.entries(scenarios)){
      const list=scoreRows(scenario),ranks={men:rankMap(list,'men'),women:rankMap(list,'women')};
      const movement=list.map(x=>({fighter:x.fighter,board:x.board,months:x.months,current:x.currentLongevity,candidate:x.longevity,delta:round(x.longevity-x.currentLongevity,2),boardRankDelta:(currentRanks[x.board].get(x.fighter)||0)-(ranks[x.board].get(x.fighter)||0)})).sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta)||a.fighter.localeCompare(b.fighter));
      const top30=list.filter(x=>currentTop30.has(x.fighter));
      const examples={};for(const target of [5,10,15,20,25,30])examples[target]=list.slice().sort((a,b)=>Math.abs(a.longevity-target)-Math.abs(b.longevity-target)||b.months-a.months).slice(0,6).map(x=>({fighter:x.fighter,board:x.board,months:x.months,activeEliteYears:x.activeEliteYears,score:x.longevity}));
      out.scenarios[key]={label:scenario.label,anchors:scenario.anchors,all62:{longevityStats:stats(list.map(x=>x.longevity)),categoryShares:categoryShares(list)},goatTierTop30:{longevityStats:stats(top30.map(x=>x.longevity)),categoryShares:categoryShares(top30)},movement:{meanAbsoluteLongevityDelta:round(mean(movement.map(x=>Math.abs(x.delta))),2),maxAbsoluteLongevityDelta:round(Math.max(...movement.map(x=>Math.abs(x.delta))),2),fightersChangingBoardRank:movement.filter(x=>x.boardRankDelta!==0).length,largestChanges:movement.slice(0,15)},examples};
    }
    return out;
  });
  const f=n=>Number(n||0).toFixed(2),pct=n=>`${f(n)}%`;
  let md=`# Longevity Anchor Review\n\nGenerated: ${report.generatedAt}\n\nRead-only: yes. No live score, total, rank, OVR, ledger, or formula was changed.\n\n## Existing model\n\n- Formula: ${report.currentFormula}\n- Historical ceiling: ${f(report.maxMonths)} counted elite months.\n\n## Proposed score meanings\n\n| Score | Meaning |\n|---:|---|\n`;
  for(const [score,meaning] of Object.entries(report.categoryMeanings))md+=`| ${score} | ${meaning} |\n`;
  md+='\n';
  for(const key of ['current','earlyRecognition','middleCompressed','historicGated']){
    const s=report.scenarios[key];
    md+=`## ${s.label}\n\n- Anchors: ${s.anchors.map(([x,y])=>`${f(x)} months = ${f(y)}/30`).join('; ')}\n\n| Scope | Championship influence | Quality influence | Prime influence | Longevity influence | Longevity P10–P90 |\n|---|---:|---:|---:|---:|---:|\n| All 62 | ${pct(s.all62.categoryShares.championship.effectiveStdSharePct)} | ${pct(s.all62.categoryShares.quality.effectiveStdSharePct)} | ${pct(s.all62.categoryShares.prime.effectiveStdSharePct)} | ${pct(s.all62.categoryShares.longevity.effectiveStdSharePct)} | ${f(s.all62.longevityStats.p90P10)} |\n| Current top 30 | ${pct(s.goatTierTop30.categoryShares.championship.effectiveStdSharePct)} | ${pct(s.goatTierTop30.categoryShares.quality.effectiveStdSharePct)} | ${pct(s.goatTierTop30.categoryShares.prime.effectiveStdSharePct)} | ${pct(s.goatTierTop30.categoryShares.longevity.effectiveStdSharePct)} | ${f(s.goatTierTop30.longevityStats.p90P10)} |\n\n- Mean absolute Longevity change: ${f(s.movement.meanAbsoluteLongevityDelta)}\n- Maximum Longevity change: ${f(s.movement.maxAbsoluteLongevityDelta)}\n- Fighters changing board rank: ${s.movement.fightersChangingBoardRank}\n\n### Score-level examples\n\n| Score level | Representative fighters |\n|---:|---|\n`;
    for(const target of [5,10,15,20,25,30])md+=`| ${target} | ${s.examples[target].map(x=>`${x.fighter} (${f(x.months)} months, ${f(x.score)})`).join('; ')} |\n`;
    md+=`\n### Largest changes\n\n| Fighter | Counted months | Current | Candidate | Delta | Board-rank movement |\n|---|---:|---:|---:|---:|---:|\n`;
    for(const x of s.movement.largestChanges)md+=`| ${x.fighter} | ${f(x.months)} | ${f(x.current)} | ${f(x.candidate)} | ${x.delta>=0?'+':''}${f(x.delta)} | ${x.boardRankDelta>=0?'+':''}${x.boardRankDelta} |\n`;
    md+='\n';
  }
  await mkdir('docs/audits',{recursive:true});
  await writeFile('docs/audits/runtime-longevity-anchor-review.json',`${JSON.stringify(report,null,2)}\n`,'utf8');
  await writeFile('docs/audits/runtime-longevity-anchor-review.md',`${md}\n`,'utf8');
  console.log('LONGEVITY_ANCHOR_REVIEW='+JSON.stringify({fighters:62,scenarios:Object.keys(report.scenarios)}));
}finally{await browser.close();}

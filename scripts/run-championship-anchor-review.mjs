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
    const men=win.RANKING_DATA?.men||[],women=win.RANKING_DATA?.women||[],all=[...men,...women].filter(row=>row?.fighter);
    const num=(value,fallback=0)=>Number.isFinite(Number(value))?Number(value):fallback;
    const round=(value,digits=2)=>{const p=10**digits;return Math.round((num(value)+Number.EPSILON)*p)/p;};
    const mean=values=>values.length?values.reduce((sum,value)=>sum+value,0)/values.length:0;
    const quantile=(values,q)=>{if(!values.length)return 0;const sorted=[...values].sort((a,b)=>a-b),position=(sorted.length-1)*q,base=Math.floor(position),fraction=position-base;return sorted[base+1]===undefined?sorted[base]:sorted[base]+fraction*(sorted[base+1]-sorted[base]);};
    const stats=values=>{const clean=values.map(Number).filter(Number.isFinite),avg=mean(clean),variance=mean(clean.map(value=>(value-avg)**2));return{count:clean.length,min:round(Math.min(...clean)),max:round(Math.max(...clean)),mean:round(avg),median:round(quantile(clean,.5)),stdDev:round(Math.sqrt(variance)),p10:round(quantile(clean,.1)),p90:round(quantile(clean,.9)),p90P10:round(quantile(clean,.9)-quantile(clean,.1))};};
    const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
    const contribution=(score,weight)=>num(score)/30*weight;
    const nonChampPositive=row=>contribution(row.opponentQuality,27.5)+contribution(row.primeDominance,27.5)+contribution(row.longevity,10)+num(row.apexPeak);
    const piecewise=(credit,points)=>{
      const x=Math.max(0,num(credit));
      if(x<=points[0][0])return points[0][1];
      for(let i=1;i<points.length;i++){
        const [x1,y1]=points[i-1],[x2,y2]=points[i];
        if(x<=x2){const t=(x-x1)/(x2-x1||1);return y1+t*(y2-y1);}
      }
      return points[points.length-1][1];
    };
    const definitions=[
      {score:0,label:'No UFC title-win accomplishment',meaning:'No adjusted UFC title-win credit.'},
      {score:5,label:'Limited title success',meaning:'A small amount of title-winning value, usually one discounted or isolated title result.'},
      {score:10,label:'Legitimate champion résumé',meaning:'Clear UFC championship accomplishment, but limited reign depth.'},
      {score:15,label:'Established champion',meaning:'Multiple meaningful title wins or sustained championship success.'},
      {score:20,label:'Great championship résumé',meaning:'Major title volume with real historical divisional value.'},
      {score:25,label:'All-time championship résumé',meaning:'One of the stronger UFC title careers across eras and divisions.'},
      {score:30,label:'Historical benchmark',meaning:'The upper benchmark for adjusted UFC title-win accomplishment.'}
    ];
    const scenarios={
      currentLinear:{label:'Current locked linear scale',philosophy:'Every adjusted title credit has equal value through the permanent 14.54-credit benchmark.',points:[[0,0],[14.54,30]]},
      conservativeAnchors:{label:'Conservative accomplishment anchors',philosophy:'Recognizes legitimate champions earlier while retaining substantial separation for deep historical reigns.',points:[[0,0],[1,3],[3,8],[6,15],[10,23],[14.54,30]]},
      championForwardAnchors:{label:'Champion-forward accomplishment anchors',philosophy:'Gives stronger early and middle credit to real champions, then compresses the final climb toward the historical benchmark.',points:[[0,0],[1,4],[3,10],[6,18],[10,25],[14.54,30]]},
      historicalTopHeavy:{label:'Historical top-heavy anchors',philosophy:'Keeps ordinary champions modest and reserves most category separation for the deepest title résumés.',points:[[0,0],[1,2],[3,6],[6,12],[10,20],[14.54,30]]}
    };
    const baseRows=all.map(row=>({
      fighter:row.fighter,
      board:men.includes(row)?'men':'women',
      credit:round(num(row.championshipResumeAudit?.adjustedTitleCredit)),
      titleFightWins:num(row.championshipResumeAudit?.titleFightWins),
      currentChampionship:round(num(row.championship)),
      currentPositive:round(nonChampPositive(row)+contribution(row.championship,35)),
      opponentQuality:num(row.opponentQuality),
      primeDominance:num(row.primeDominance),
      longevity:num(row.longevity),
      apexPeak:num(row.apexPeak)
    }));
    const rankMap=(rows,key,board)=>new Map(rows.filter(row=>!board||row.board===board).slice().sort((a,b)=>num(b[key])-num(a[key])||a.fighter.localeCompare(b.fighter)).map((row,index)=>[row.fighter,index+1]));
    const currentRanks={men:rankMap(baseRows,'currentPositive','men'),women:rankMap(baseRows,'currentPositive','women')};
    const currentTop30=new Set(baseRows.slice().sort((a,b)=>b.currentPositive-a.currentPositive||a.fighter.localeCompare(b.fighter)).slice(0,30).map(row=>row.fighter));
    const categoryShares=rows=>{
      const values={
        championship:rows.map(row=>contribution(row.candidateChampionship,35)),
        quality:rows.map(row=>contribution(row.opponentQuality,27.5)),
        prime:rows.map(row=>contribution(row.primeDominance,27.5)),
        longevity:rows.map(row=>contribution(row.longevity,10))
      };
      const distributions=Object.fromEntries(Object.entries(values).map(([key,list])=>[key,stats(list)]));
      const totalStd=Object.values(distributions).reduce((sum,item)=>sum+item.stdDev,0);
      return Object.fromEntries(Object.entries(distributions).map(([key,item])=>[key,{...item,effectiveStdSharePct:round(totalStd?item.stdDev/totalStd*100:0)}]));
    };
    const bandCounts=rows=>{
      const bands=[
        {label:'0–4.99',min:0,max:4.999},
        {label:'5–9.99',min:5,max:9.999},
        {label:'10–14.99',min:10,max:14.999},
        {label:'15–19.99',min:15,max:19.999},
        {label:'20–24.99',min:20,max:24.999},
        {label:'25–29.99',min:25,max:29.999},
        {label:'30',min:30,max:30}
      ];
      return bands.map(band=>({...band,count:rows.filter(row=>row.candidateChampionship>=band.min&&row.candidateChampionship<=band.max).length,fighters:rows.filter(row=>row.candidateChampionship>=band.min&&row.candidateChampionship<=band.max).sort((a,b)=>b.candidateChampionship-a.candidateChampionship).slice(0,6).map(row=>row.fighter)}));
    };
    const nearestAnchors=rows=>definitions.map(definition=>{
      const matches=rows.slice().sort((a,b)=>Math.abs(a.candidateChampionship-definition.score)-Math.abs(b.candidateChampionship-definition.score)||Math.abs(b.credit)-Math.abs(a.credit)||a.fighter.localeCompare(b.fighter)).slice(0,3);
      return{...definition,matches:matches.map(row=>({fighter:row.fighter,board:row.board,credit:row.credit,titleFightWins:row.titleFightWins,score:row.candidateChampionship,distance:round(Math.abs(row.candidateChampionship-definition.score))}))};
    });
    const output={
      version:'championship-anchor-review-20260710a',
      generatedAt:new Date().toISOString(),
      readOnly:true,
      rosterCount:all.length,
      fixedBenchmarkCredit:14.54,
      definitions,
      currentCreditStats:stats(baseRows.map(row=>row.credit)),
      currentChampionshipStats:stats(baseRows.map(row=>row.currentChampionship)),
      scenarios:{},
      notes:[
        'Candidate curves are fixed accomplishment scales, not percentiles and not transformations around the current roster average.',
        'Adding fighters does not change any existing candidate score because every curve uses permanent credit anchors.',
        'The current 62 are strongest for the upper half of the scale; sparsely populated lower bands require a later real-fighter calibration sample.',
        'Effective influence is reported as a warning metric, not an automatic selection rule.'
      ]
    };
    for(const [key,scenario] of Object.entries(scenarios)){
      const rows=baseRows.map(row=>{
        const candidateChampionship=round(clamp(piecewise(row.credit,scenario.points),0,30));
        const candidatePositive=round(nonChampPositive(row)+contribution(candidateChampionship,35));
        return{...row,candidateChampionship,candidatePositive,championshipDelta:round(candidateChampionship-row.currentChampionship)};
      });
      const ranks={men:rankMap(rows,'candidatePositive','men'),women:rankMap(rows,'candidatePositive','women')};
      const movements=rows.map(row=>({
        fighter:row.fighter,board:row.board,credit:row.credit,titleFightWins:row.titleFightWins,currentChampionship:row.currentChampionship,candidateChampionship:row.candidateChampionship,championshipDelta:row.championshipDelta,currentBoardRank:currentRanks[row.board].get(row.fighter),candidateBoardRank:ranks[row.board].get(row.fighter),boardRankDelta:(currentRanks[row.board].get(row.fighter)||0)-(ranks[row.board].get(row.fighter)||0)
      })).sort((a,b)=>Math.abs(b.championshipDelta)-Math.abs(a.championshipDelta)||Math.abs(b.boardRankDelta)-Math.abs(a.boardRankDelta)||a.fighter.localeCompare(b.fighter));
      const top30=rows.filter(row=>currentTop30.has(row.fighter));
      output.scenarios[key]={
        label:scenario.label,
        philosophy:scenario.philosophy,
        points:scenario.points,
        all62:{championshipStats:stats(rows.map(row=>row.candidateChampionship)),categoryShares:categoryShares(rows),bandCounts:bandCounts(rows)},
        goatTierTop30:{championshipStats:stats(top30.map(row=>row.candidateChampionship)),categoryShares:categoryShares(top30)},
        movement:{meanAbsoluteChampionshipDelta:round(mean(movements.map(row=>Math.abs(row.championshipDelta)))),maxAbsoluteChampionshipDelta:round(Math.max(...movements.map(row=>Math.abs(row.championshipDelta)))),fightersChangingBoardRank:movements.filter(row=>row.boardRankDelta!==0).length,meanAbsoluteBoardRankChange:round(mean(movements.map(row=>Math.abs(row.boardRankDelta)))),largestChanges:movements.slice(0,20)},
        anchorExamples:nearestAnchors(rows),
        leaders:{men:rows.filter(row=>row.board==='men').sort((a,b)=>b.candidatePositive-a.candidatePositive||a.fighter.localeCompare(b.fighter)).slice(0,15).map((row,index)=>({rank:index+1,fighter:row.fighter,credit:row.credit,championship:row.candidateChampionship,positive:row.candidatePositive})),women:rows.filter(row=>row.board==='women').sort((a,b)=>b.candidatePositive-a.candidatePositive||a.fighter.localeCompare(b.fighter)).slice(0,10).map((row,index)=>({rank:index+1,fighter:row.fighter,credit:row.credit,championship:row.candidateChampionship,positive:row.candidatePositive}))}
      };
    }
    output.creditLeaders=baseRows.slice().sort((a,b)=>b.credit-a.credit||a.fighter.localeCompare(b.fighter)).slice(0,25).map(row=>({fighter:row.fighter,board:row.board,credit:row.credit,titleFightWins:row.titleFightWins,currentChampionship:row.currentChampionship}));
    return output;
  });

  const f=value=>Number(value||0).toFixed(2);
  const pct=value=>`${f(value)}%`;
  let md=`# Championship Resume Anchor Review\n\nGenerated: ${report.generatedAt}\n\n**Read-only:** yes. No live Championship score, total, rank, OVR, or formula was changed.\n\n## Purpose\n\nDefine stable UFC accomplishment meanings for the 0–30 Championship Resume scale and test fixed credit-to-score curves against the current ${report.rosterCount}-fighter roster.\n\n## Proposed score meanings\n\n| Score | Label | UFC accomplishment meaning |\n|---:|---|---|\n`;
  for(const item of report.definitions)md+=`| ${item.score} | ${item.label} | ${item.meaning} |\n`;
  md+=`\n## Current input distribution\n\n- Adjusted title-credit range: ${f(report.currentCreditStats.min)}–${f(report.currentCreditStats.max)}\n- Adjusted title-credit median: ${f(report.currentCreditStats.median)}\n- Adjusted title-credit P10–P90: ${f(report.currentCreditStats.p10)}–${f(report.currentCreditStats.p90)}\n- Current Championship range: ${f(report.currentChampionshipStats.min)}–${f(report.currentChampionshipStats.max)}\n\n## Candidate overview\n\n| Candidate | All-62 Championship share | Top-30 Championship share | Mean score change | Max score change | Fighters changing board rank |\n|---|---:|---:|---:|---:|---:|\n`;
  for(const scenario of Object.values(report.scenarios))md+=`| ${scenario.label} | ${pct(scenario.all62.categoryShares.championship.effectiveStdSharePct)} | ${pct(scenario.goatTierTop30.categoryShares.championship.effectiveStdSharePct)} | ${f(scenario.movement.meanAbsoluteChampionshipDelta)} | ${f(scenario.movement.maxAbsoluteChampionshipDelta)} | ${scenario.movement.fightersChangingBoardRank} |\n`;
  md+='\n';
  for(const scenario of Object.values(report.scenarios)){
    md+=`## ${scenario.label}\n\n${scenario.philosophy}\n\n### Fixed anchor points\n\n| Adjusted title credit | Championship score |\n|---:|---:|\n`;
    for(const [credit,score] of scenario.points)md+=`| ${f(credit)} | ${f(score)} |\n`;
    md+=`\n### Scale population\n\n| Score band | Fighter count | Example fighters |\n|---|---:|---|\n`;
    for(const band of scenario.all62.bandCounts)md+=`| ${band.label} | ${band.count} | ${band.fighters.join(', ')||'None'} |\n`;
    md+=`\n### Real-fighter examples nearest each score anchor\n\n| Target | Meaning | Nearest current examples |\n|---:|---|---|\n`;
    for(const anchor of scenario.anchorExamples)md+=`| ${anchor.score} | ${anchor.label} | ${anchor.matches.map(item=>`${item.fighter} (${f(item.credit)} credits → ${f(item.score)})`).join('; ')} |\n`;
    md+=`\n### Largest score and board movements\n\n| Fighter | Credit | Current | Candidate | Score change | Board-rank movement |\n|---|---:|---:|---:|---:|---:|\n`;
    for(const item of scenario.movement.largestChanges)md+=`| ${item.fighter} | ${f(item.credit)} | ${f(item.currentChampionship)} | ${f(item.candidateChampionship)} | ${item.championshipDelta>=0?'+':''}${f(item.championshipDelta)} | ${item.boardRankDelta>=0?'+':''}${item.boardRankDelta} |\n`;
    md+='\n';
  }
  md+=`## Current adjusted-title-credit leaders\n\n| Fighter | Board | Adjusted credit | Title-fight wins | Current Championship |\n|---|---|---:|---:|---:|\n`;
  for(const item of report.creditLeaders)md+=`| ${item.fighter} | ${item.board} | ${f(item.credit)} | ${item.titleFightWins} | ${f(item.currentChampionship)} |\n`;
  md+=`\n## Review rules\n\n- Pick anchors based on UFC accomplishment meaning, not on forcing a target statistical distribution.\n- Existing fighter scores must remain independent of roster size.\n- Use the current 62 primarily to judge the elite and historical ranges.\n- Any score bands with weak real-fighter coverage should be validated later with a small lower- and middle-tier calibration sample.\n- No candidate should go live until its fighter movements are reviewed and approved.\n`;

  await mkdir('docs/audits',{recursive:true});
  await writeFile('docs/audits/runtime-championship-anchor-review.json',`${JSON.stringify(report,null,2)}\n`,'utf8');
  await writeFile('docs/audits/runtime-championship-anchor-review.md',`${md}\n`,'utf8');
  console.log('CHAMPIONSHIP_ANCHOR_REVIEW='+JSON.stringify({fighters:report.rosterCount,scenarios:Object.keys(report.scenarios),fixedBenchmark:report.fixedBenchmarkCredit}));
}finally{
  await browser.close();
}

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
    const num=(v,d=0)=>Number.isFinite(Number(v))?Number(v):d;
    const round=(v,d=3)=>{const p=10**d;return Math.round((num(v)+Number.EPSILON)*p)/p;};
    const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
    const mean=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0;
    const quantile=(a,q)=>{if(!a.length)return 0;const s=[...a].sort((x,y)=>x-y),p=(s.length-1)*q,b=Math.floor(p),f=p-b;return s[b+1]===undefined?s[b]:s[b]+f*(s[b+1]-s[b]);};
    const stats=a=>{const v=a.map(Number).filter(Number.isFinite),m=mean(v),variance=mean(v.map(x=>(x-m)**2));return{count:v.length,min:round(Math.min(...v)),max:round(Math.max(...v)),mean:round(m),median:round(quantile(v,.5)),stdDev:round(Math.sqrt(variance)),p10:round(quantile(v,.1)),p90:round(quantile(v,.9)),p90P10:round(quantile(v,.9)-quantile(v,.1))};};
    const piecewise=(x,anchors)=>{const value=Math.max(0,num(x));if(value<=anchors[0][0])return anchors[0][1];for(let i=1;i<anchors.length;i++){const [x1,y1]=anchors[i-1],[x2,y2]=anchors[i];if(value<=x2){const t=(value-x1)/(x2-x1||1);return clamp(y1+t*(y2-y1),0,30);}}return anchors.at(-1)[1];};
    const DECLARED={championship:35,quality:27.5,prime:27.5,longevity:10};
    const GUARDRAILS={championship:[30,42],quality:[22,33],prime:[22,33],longevity:[7,15]};
    const CHAMPION_FORWARD=[[0,0],[1,4],[3,10],[6,18],[10,25],[14.54,30]];
    const boardName=row=>men.includes(row)?'men':'women';
    const sourceRows=all.map(row=>({
      fighter:row.fighter,board:boardName(row),row,
      championship:num(row.championship),championshipCredit:num(row.championshipResumeAudit?.adjustedTitleCredit),
      quality:num(row.opponentQuality),prime:num(row.primeDominance),longevity:num(row.longevity),
      apex:num(row.apexPeak),penalty:num(row.penalty)
    }));
    const scaleRows=scale=>sourceRows.map(x=>({...x,scaledChampionship:scale==='championForward'?round(piecewise(x.championshipCredit,CHAMPION_FORWARD),2):x.championship}));
    const contribution=(score,weight)=>num(score)/30*num(weight);
    const scoreRows=(scale,weights)=>scaleRows(scale).map(x=>{
      const breakdown={
        championship:contribution(x.scaledChampionship,weights.championship),
        quality:contribution(x.quality,weights.quality),
        prime:contribution(x.prime,weights.prime),
        longevity:contribution(x.longevity,weights.longevity)
      };
      const base=Object.values(breakdown).reduce((s,v)=>s+v,0),positive=base+x.apex,full=positive+x.penalty;
      return{...x,weights,scale,breakdown:Object.fromEntries(Object.entries(breakdown).map(([k,v])=>[k,round(v,3)])),base:round(base,3),positive:round(positive,3),full:round(full,3)};
    });
    const categoryShares=rows=>{
      const keys=['championship','quality','prime','longevity'];
      const distributions=Object.fromEntries(keys.map(key=>[key,stats(rows.map(x=>x.breakdown[key]))]));
      const sum=keys.reduce((s,key)=>s+distributions[key].stdDev,0);
      return Object.fromEntries(keys.map(key=>[key,{...distributions[key],declaredPct:DECLARED[key],effectiveStdSharePct:round(sum?distributions[key].stdDev/sum*100:0,2)}]));
    };
    const rawScoreStd=scale=>{
      const rows=scaleRows(scale);
      return{
        championship:stats(rows.map(x=>x.scaledChampionship)).stdDev,
        quality:stats(rows.map(x=>x.quality)).stdDev,
        prime:stats(rows.map(x=>x.prime)).stdDev,
        longevity:stats(rows.map(x=>x.longevity)).stdDev
      };
    };
    const exactWeights=scale=>{
      const std=rawScoreStd(scale),raw={};
      for(const key of Object.keys(DECLARED))raw[key]=std[key]?DECLARED[key]/std[key]:0;
      const total=Object.values(raw).reduce((s,v)=>s+v,0);
      return Object.fromEntries(Object.entries(raw).map(([k,v])=>[k,round(v/total*100,2)]));
    };
    const sharePass=shares=>Object.entries(GUARDRAILS).every(([key,[min,max]])=>shares[key].effectiveStdSharePct>=min&&shares[key].effectiveStdSharePct<=max);
    const findMinimalGuardrailWeights=scale=>{
      let best=null;
      for(let champ=35;champ>=20;champ-=.25){
        const weights={championship:round(champ,2),quality:27.5,prime:round(62.5-champ,2),longevity:10};
        const rows=scoreRows(scale,weights),shares=categoryShares(rows);
        const violation=Object.entries(GUARDRAILS).reduce((sum,[key,[min,max]])=>{const v=shares[key].effectiveStdSharePct;return sum+(v<min?(min-v)**2:v>max?(v-max)**2:0);},0);
        const candidate={weights,shares,pass:sharePass(shares),violation};
        if(candidate.pass)return candidate;
        if(!best||candidate.violation<best.violation)best=candidate;
      }
      return best;
    };
    const guardCurrent=findMinimalGuardrailWeights('current');
    const guardSemantic=findMinimalGuardrailWeights('championForward');
    const scenarios={
      currentDeclared:{label:'Current live scales and declared weights',type:'baseline',scale:'current',weights:{...DECLARED},philosophy:'Current fixed category scales with the declared 35 / 27.5 / 27.5 / 10 formula.'},
      semanticDeclared:{label:'Semantic scales only',type:'scale-only',scale:'championForward',weights:{...DECLARED},philosophy:'Uses the provisional champion-forward Championship curve while keeping all headline weights unchanged.'},
      moderateWeightOnly:{label:'Moderate weight-only shift',type:'weight-only',scale:'current',weights:{championship:30,quality:27.5,prime:32.5,longevity:10},philosophy:'Moves five points from Championship to Prime without changing any category score.'},
      minimumGuardrailWeightOnly:{label:'Minimum-shift guardrail weights',type:'weight-only',scale:'current',weights:guardCurrent.weights,philosophy:'Smallest Championship-to-Prime weight transfer that places all four all-roster practical shares inside the monitoring guardrails.'},
      moderateHybrid:{label:'Moderate semantic hybrid',type:'hybrid',scale:'championForward',weights:{championship:28,quality:27.5,prime:34.5,longevity:10},philosophy:'Combines the champion-forward Championship meanings with a meaningful Championship-to-Prime weight transfer.'},
      minimumGuardrailHybrid:{label:'Minimum-shift semantic guardrail hybrid',type:'hybrid',scale:'championForward',weights:guardSemantic.weights,philosophy:'Smallest weight transfer that keeps the champion-forward Championship scale while bringing all all-roster practical shares inside the monitoring guardrails.'},
      exactVarianceCurrent:{label:'Exact current-roster variance match',type:'cautionary-exact-match',scale:'current',weights:exactWeights('current'),philosophy:'Mathematically chooses weights so the current 62 approximate the declared practical shares. Included as an overfitting benchmark.'},
      exactVarianceSemantic:{label:'Exact semantic-scale variance match',type:'cautionary-exact-match',scale:'championForward',weights:exactWeights('championForward'),philosophy:'Exact current-roster variance matching after the champion-forward Championship curve. Included as an overfitting benchmark.'}
    };
    const rankMap=(rows,key,board)=>new Map(rows.filter(x=>!board||x.board===board).slice().sort((a,b)=>num(b[key])-num(a[key])||a.fighter.localeCompare(b.fighter)).map((x,i)=>[x.fighter,i+1]));
    const baseline=scoreRows(scenarios.currentDeclared.scale,scenarios.currentDeclared.weights);
    const baselineRanks={positive:{men:rankMap(baseline,'positive','men'),women:rankMap(baseline,'positive','women')},full:{men:rankMap(baseline,'full','men'),women:rankMap(baseline,'full','women')}};
    const currentTop30=new Set(baseline.slice().sort((a,b)=>b.positive-a.positive||a.fighter.localeCompare(b.fighter)).slice(0,30).map(x=>x.fighter));
    const coreNames=['Jon Jones','Georges St-Pierre','Demetrious Johnson','Anderson Silva','Khabib Nurmagomedov','Alexander Volkanovski','Jose Aldo','Islam Makhachev','Amanda Nunes','Valentina Shevchenko'];
    const output={
      version:'four-category-balance-simulation-20260710a',generatedAt:new Date().toISOString(),readOnly:true,rosterCount:sourceRows.length,
      declaredWeights:DECLARED,guardrails:GUARDRAILS,championForwardAnchors:CHAMPION_FORWARD,
      notes:[
        'The simulation changes no live score, total, rank, OVR, category rule, Apex bonus, or Loss Context value.',
        'Board movement is measured primarily on the positive model: four weighted base categories plus Apex Peak. Current penalty values are also held fixed and reported separately.',
        'Exact variance-matching weights are roster-dependent demonstrations, not recommended permanent anchors.',
        'The future 200-fighter panel is deterministic and directional only; it is not a prediction of specific future fighters.'
      ],scenarios:{},futureRosterSensitivity:{description:'Current 62 plus 138 deterministic lower-tier category profiles.',scenarios:{}}
    };
    for(const [key,scenario] of Object.entries(scenarios)){
      const rows=scoreRows(scenario.scale,scenario.weights),positiveRanks={men:rankMap(rows,'positive','men'),women:rankMap(rows,'positive','women')},fullRanks={men:rankMap(rows,'full','men'),women:rankMap(rows,'full','women')};
      const movement=rows.map(x=>{
        const base=baseline.find(b=>b.fighter===x.fighter);
        return{
          fighter:x.fighter,board:x.board,currentChampionship:base.scaledChampionship,candidateChampionship:x.scaledChampionship,
          currentPositive:base.positive,candidatePositive:x.positive,positiveDelta:round(x.positive-base.positive,2),
          currentFull:base.full,candidateFull:x.full,fullDelta:round(x.full-base.full,2),
          positiveRankDelta:(baselineRanks.positive[x.board].get(x.fighter)||0)-(positiveRanks[x.board].get(x.fighter)||0),
          fullRankDelta:(baselineRanks.full[x.board].get(x.fighter)||0)-(fullRanks[x.board].get(x.fighter)||0)
        };
      }).sort((a,b)=>Math.abs(b.positiveDelta)-Math.abs(a.positiveDelta)||Math.abs(b.positiveRankDelta)-Math.abs(a.positiveRankDelta)||a.fighter.localeCompare(b.fighter));
      const top30=rows.filter(x=>currentTop30.has(x.fighter)),allShares=categoryShares(rows),topShares=categoryShares(top30);
      output.scenarios[key]={
        label:scenario.label,type:scenario.type,scale:scenario.scale,weights:scenario.weights,philosophy:scenario.philosophy,
        all62:{categoryShares:allShares,guardrailPass:sharePass(allShares),positiveStats:stats(rows.map(x=>x.positive)),fullStats:stats(rows.map(x=>x.full))},
        goatTierTop30:{categoryShares:topShares,guardrailPass:sharePass(topShares),positiveStats:stats(top30.map(x=>x.positive))},
        movement:{meanAbsolutePositiveDelta:round(mean(movement.map(x=>Math.abs(x.positiveDelta))),2),maxAbsolutePositiveDelta:round(Math.max(...movement.map(x=>Math.abs(x.positiveDelta))),2),fightersChangingPositiveBoardRank:movement.filter(x=>x.positiveRankDelta!==0).length,fightersChangingFullBoardRank:movement.filter(x=>x.fullRankDelta!==0).length,meanAbsolutePositiveRankChange:round(mean(movement.map(x=>Math.abs(x.positiveRankDelta))),2),largestChanges:movement.slice(0,18)},
        coreFighters:coreNames.map(name=>{const x=rows.find(r=>r.fighter===name),base=baseline.find(r=>r.fighter===name);if(!x||!base)return null;return{fighter:name,board:x.board,currentPositive:base.positive,candidatePositive:x.positive,delta:round(x.positive-base.positive,2),currentRank:baselineRanks.positive[x.board].get(name),candidateRank:positiveRanks[x.board].get(name),rankDelta:(baselineRanks.positive[x.board].get(name)||0)-(positiveRanks[x.board].get(name)||0)};}).filter(Boolean),
        leaders:{men:rows.filter(x=>x.board==='men').sort((a,b)=>b.positive-a.positive||a.fighter.localeCompare(b.fighter)).slice(0,12).map((x,i)=>({rank:i+1,fighter:x.fighter,positive:round(x.positive,2)})),women:rows.filter(x=>x.board==='women').sort((a,b)=>b.positive-a.positive||a.fighter.localeCompare(b.fighter)).slice(0,8).map((x,i)=>({rank:i+1,fighter:x.fighter,positive:round(x.positive,2)}))}
      };
    }
    const synthetic=[];
    for(let i=0;i<138;i++){
      const a=((i*37)%138)/137,b=((i*53)%138)/137,c=((i*71)%138)/137,d=((i*89)%138)/137;
      const championshipCredit=a<.46?0:round(((a-.46)/.54)*3.5,3);
      synthetic.push({
        fighter:`Synthetic ${i+1}`,board:'synthetic',championshipCredit,
        championship:round(clamp(championshipCredit/14.54*30,0,30),3),
        quality:round(clamp((.35+6.25*b)/14.10*30,0,30),3),
        prime:round(5+13*c,3),longevity:round(2+16*d,3),apex:0,penalty:0
      });
    }
    const combinedSource=[...sourceRows,...synthetic];
    const combinedRows=(scale,weights)=>combinedSource.map(x=>{
      const champ=scale==='championForward'?piecewise(x.championshipCredit,CHAMPION_FORWARD):x.championship;
      return{breakdown:{championship:contribution(champ,weights.championship),quality:contribution(x.quality,weights.quality),prime:contribution(x.prime,weights.prime),longevity:contribution(x.longevity,weights.longevity)}};
    });
    for(const [key,scenario] of Object.entries(scenarios)){
      output.futureRosterSensitivity.scenarios[key]={categoryShares:categoryShares(combinedRows(scenario.scale,scenario.weights))};
    }
    return output;
  });

  const f=n=>Number(n||0).toFixed(2),pct=n=>`${f(n)}%`,weights=w=>`${f(w.championship)} / ${f(w.quality)} / ${f(w.prime)} / ${f(w.longevity)}`;
  let md=`# Four-Category Balance Simulation\n\nGenerated: ${report.generatedAt}\n\n**Read-only:** yes. No live score, total, rank, OVR, category formula, Apex bonus, or Loss Context value was changed.\n\n## Purpose\n\nCompare scale-only, weight-only, hybrid, and exact variance-matching strategies after all four base categories received semantic-anchor review.\n\nDeclared weights: **35 Championship / 27.5 Quality Wins / 27.5 Prime Dominance / 10 Longevity**.\n\nMonitoring guardrails: Championship 30–42%, Quality 22–33%, Prime 22–33%, Longevity 7–15%.\n\n## Scenario overview\n\n| Scenario | Type | Weights C/Q/P/L | All-62 influence C/Q/P/L | Top-30 influence C/Q/P/L | All-62 guardrails | Mean positive change | Max change | Positive board movers |\n|---|---|---|---|---|---|---:|---:|---:|\n`;
  for(const s of Object.values(report.scenarios)){
    const a=s.all62.categoryShares,t=s.goatTierTop30.categoryShares;
    md+=`| ${s.label} | ${s.type} | ${weights(s.weights)} | ${pct(a.championship.effectiveStdSharePct)} / ${pct(a.quality.effectiveStdSharePct)} / ${pct(a.prime.effectiveStdSharePct)} / ${pct(a.longevity.effectiveStdSharePct)} | ${pct(t.championship.effectiveStdSharePct)} / ${pct(t.quality.effectiveStdSharePct)} / ${pct(t.prime.effectiveStdSharePct)} / ${pct(t.longevity.effectiveStdSharePct)} | ${s.all62.guardrailPass?'PASS':'FAIL'} | ${f(s.movement.meanAbsolutePositiveDelta)} | ${f(s.movement.maxAbsolutePositiveDelta)} | ${s.movement.fightersChangingPositiveBoardRank} |\n`;
  }
  md+='\n';
  for(const s of Object.values(report.scenarios)){
    md+=`## ${s.label}\n\n- Type: ${s.type}\n- Scale: ${s.scale}\n- Weights: ${weights(s.weights)}\n- Philosophy: ${s.philosophy}\n- All-62 guardrail result: ${s.all62.guardrailPass?'PASS':'FAIL'}\n- Top-30 guardrail result: ${s.goatTierTop30.guardrailPass?'PASS':'FAIL'}\n- Fighters changing positive board rank: ${s.movement.fightersChangingPositiveBoardRank}\n- Fighters changing full board rank with current penalties held fixed: ${s.movement.fightersChangingFullBoardRank}\n\n### Core fighters\n\n| Fighter | Current positive | Candidate positive | Delta | Current board rank | Candidate board rank | Rank movement |\n|---|---:|---:|---:|---:|---:|---:|\n`;
    for(const x of s.coreFighters)md+=`| ${x.fighter} | ${f(x.currentPositive)} | ${f(x.candidatePositive)} | ${x.delta>=0?'+':''}${f(x.delta)} | ${x.currentRank} | ${x.candidateRank} | ${x.rankDelta>=0?'+':''}${x.rankDelta} |\n`;
    md+='\n### Largest score changes\n\n| Fighter | Positive delta | Positive-rank movement | Full-rank movement |\n|---|---:|---:|---:|\n';
    for(const x of s.movement.largestChanges)md+=`| ${x.fighter} | ${x.positiveDelta>=0?'+':''}${f(x.positiveDelta)} | ${x.positiveRankDelta>=0?'+':''}${x.positiveRankDelta} | ${x.fullRankDelta>=0?'+':''}${x.fullRankDelta} |\n`;
    md+='\n';
  }
  md+='## Directional 200-fighter stress panel\n\nThis combines the 62 real fighters with 138 deterministic lower-tier category profiles. Existing fighter scores remain fixed; only the observed distribution changes.\n\n| Scenario | Championship | Quality | Prime | Longevity |\n|---|---:|---:|---:|---:|\n';
  for(const [key,s] of Object.entries(report.futureRosterSensitivity.scenarios)){
    const label=report.scenarios[key].label,c=s.categoryShares;
    md+=`| ${label} | ${pct(c.championship.effectiveStdSharePct)} | ${pct(c.quality.effectiveStdSharePct)} | ${pct(c.prime.effectiveStdSharePct)} | ${pct(c.longevity.effectiveStdSharePct)} |\n`;
  }
  md+='\n## Interpretation rules\n\n1. Semantic fit comes before exact statistical matching.\n2. Exact variance matching is roster-dependent and is included to expose the cost of forcing the percentages.\n3. Top-30 Prime compression can remain even when all-roster guardrails pass because the GOAT-tier roster contains many similarly strong primes.\n4. A recommended permanent formula should use round, explainable weights and must not depend on recalculating the roster distribution.\n';
  await mkdir('docs/audits',{recursive:true});
  await writeFile('docs/audits/runtime-four-category-balance-simulation.json',`${JSON.stringify(report,null,2)}\n`,'utf8');
  await writeFile('docs/audits/runtime-four-category-balance-simulation.md',`${md}\n`,'utf8');
  console.log('FOUR_CATEGORY_BALANCE='+JSON.stringify({roster:report.rosterCount,scenarios:Object.keys(report.scenarios),guardrailWeightOnly:report.scenarios.minimumGuardrailWeightOnly.weights,guardrailHybrid:report.scenarios.minimumGuardrailHybrid.weights}));
}finally{
  await browser.close();
}

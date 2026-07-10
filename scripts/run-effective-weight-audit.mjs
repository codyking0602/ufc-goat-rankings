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
    const all=[...(win.RANKING_DATA?.men||[]),...(win.RANKING_DATA?.women||[])].filter(r=>r?.fighter);
    const num=(v,d=0)=>Number.isFinite(Number(v))?Number(v):d;
    const r=(v,d=4)=>{const p=10**d;return Math.round((num(v)+Number.EPSILON)*p)/p;};
    const mean=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0;
    const quantile=(a,q)=>{if(!a.length)return 0;const s=[...a].sort((x,y)=>x-y),p=(s.length-1)*q,b=Math.floor(p),f=p-b;return s[b+1]===undefined?s[b]:s[b]+f*(s[b+1]-s[b]);};
    const stats=a=>{const v=a.map(Number).filter(Number.isFinite),m=mean(v),variance=mean(v.map(x=>(x-m)**2));return{count:v.length,min:r(Math.min(...v)),max:r(Math.max(...v)),range:r(Math.max(...v)-Math.min(...v)),mean:r(m),median:r(quantile(v,.5)),stdDev:r(Math.sqrt(variance)),p10:r(quantile(v,.1)),p25:r(quantile(v,.25)),p75:r(quantile(v,.75)),p90:r(quantile(v,.9)),iqr:r(quantile(v,.75)-quantile(v,.25)),p90P10:r(quantile(v,.9)-quantile(v,.1)),distinctValues:new Set(v.map(x=>r(x,2))).size};};
    const pearson=(a,b)=>{if(a.length!==b.length||a.length<2)return 0;const ma=mean(a),mb=mean(b),cov=mean(a.map((x,i)=>(x-ma)*(b[i]-mb))),sa=Math.sqrt(mean(a.map(x=>(x-ma)**2))),sb=Math.sqrt(mean(b.map(x=>(x-mb)**2)));return sa&&sb?r(cov/(sa*sb)):0;};
    const rankMap=(rows,valueFor)=>{const sorted=[...rows].sort((a,b)=>valueFor(b)-valueFor(a)||String(a.fighter).localeCompare(String(b.fighter)));return new Map(sorted.map((row,i)=>[row.fighter,i+1]));};
    const rankImpact=(rows,fullValue,removedValue)=>{const full=rankMap(rows,fullValue),alt=rankMap(rows,removedValue),changes=rows.map(row=>Math.abs(full.get(row.fighter)-alt.get(row.fighter)));return{meanAbsoluteRankChange:r(mean(changes)),medianAbsoluteRankChange:r(quantile(changes,.5)),maxRankChange:Math.max(...changes),fightersMoved:changes.filter(Boolean).length};};
    const contribution=(row,key,weight,max)=>key==='apexPeak'?num(row[key]):num(row[key])/max*weight;
    const categoryDefs={championship:{label:'Championship Resume',max:30,weight:35},opponentQuality:{label:'Quality Wins',max:30,weight:27.5},primeDominance:{label:'Prime Dominance',max:30,weight:27.5},longevity:{label:'Longevity',max:30,weight:10},apexPeak:{label:'Apex Peak',max:6,weight:6,bonus:true}};
    function categoryScope(rows){
      const positive=row=>Object.entries(categoryDefs).reduce((s,[key,d])=>s+contribution(row,key,d.weight,d.max),0);
      const final=row=>num(row.totalScore,num(row.rawScore,positive(row)+num(row.penalty)));
      const out={fighterCount:rows.length,categories:{}};
      for(const [key,d] of Object.entries(categoryDefs)){
        const raw=rows.map(row=>num(row[key])),points=rows.map(row=>contribution(row,key,d.weight,d.max)),positives=rows.map(positive),finals=rows.map(final);
        out.categories[key]={label:d.label,declaredMaxPoints:d.weight,declaredBaseWeightPct:d.bonus?null:d.weight,rawStats:stats(raw),contributionStats:stats(points),correlationWithPositiveTotal:pearson(points,positives),correlationWithFinalTotal:pearson(points,finals),rankImpact:rankImpact(rows,positive,row=>positive(row)-contribution(row,key,d.weight,d.max))};
      }
      const baseKeys=['championship','opponentQuality','primeDominance','longevity'];
      const stdSum=baseKeys.reduce((s,k)=>s+out.categories[k].contributionStats.stdDev,0),spreadSum=baseKeys.reduce((s,k)=>s+out.categories[k].contributionStats.p90P10,0);
      baseKeys.forEach(k=>{out.categories[k].effectiveStdSharePct=r(stdSum?out.categories[k].contributionStats.stdDev/stdSum*100:0,2);out.categories[k].robustSpreadSharePct=r(spreadSum?out.categories[k].contributionStats.p90P10/spreadSum*100:0,2);out.categories[k].compressionRatio=r(out.categories[k].contributionStats.p90P10/out.categories[k].declaredMaxPoints,3);});
      out.positiveTotalStats=stats(rows.map(positive));out.finalTotalStats=stats(rows.map(final));return out;
    }
    const primeRows=(win.UFC_PRIME_DOMINANCE_LEDGERS?.report||win.UFC_PRIME_DOMINANCE_SHADOW_MODEL?.report||[]).filter(x=>all.some(r=>r.fighter===x.fighter));
    const primeDefs={primeRecordScore:{label:'Prime record',max:9},roundControlScore:{label:'Round control',max:8},finishPressureScore:{label:'Finish pressure',max:5},eliteStakesScore:{label:'Elite stakes',max:8}};
    const primeByName=new Map(primeRows.map(x=>[x.fighter,x]));
    const primeComponents={fighterCount:primeRows.length,components:{}};
    const primeTotal=x=>Object.keys(primeDefs).reduce((s,k)=>s+num(x[k]),0);
    const positiveByName=new Map(all.map(row=>[row.fighter,Object.entries(categoryDefs).reduce((s,[k,d])=>s+contribution(row,k,d.weight,d.max),0)]));
    for(const [key,d] of Object.entries(primeDefs)){
      const vals=primeRows.map(x=>num(x[key])),overallPoints=vals.map(v=>v*27.5/30),primeTotals=primeRows.map(primeTotal),positiveTotals=primeRows.map(x=>positiveByName.get(x.fighter)||0);
      primeComponents.components[key]={label:d.label,max:d.max,scoreStats:stats(vals),overallContributionStats:stats(overallPoints),correlationWithPrimeTotal:pearson(vals,primeTotals),correlationWithPositiveTotal:pearson(overallPoints,positiveTotals),primeRankImpact:rankImpact(primeRows,primeTotal,x=>primeTotal(x)-num(x[key])),overallRankImpact:rankImpact(primeRows,x=>positiveByName.get(x.fighter)||0,x=>(positiveByName.get(x.fighter)||0)-num(x[key])*27.5/30)};
    }
    const primeStdSum=Object.values(primeComponents.components).reduce((s,x)=>s+x.scoreStats.stdDev,0),primeSpreadSum=Object.values(primeComponents.components).reduce((s,x)=>s+x.scoreStats.p90P10,0);
    Object.values(primeComponents.components).forEach(x=>{x.effectiveStdSharePct=r(primeStdSum?x.scoreStats.stdDev/primeStdSum*100:0,2);x.robustSpreadSharePct=r(primeSpreadSum?x.scoreStats.p90P10/primeSpreadSum*100:0,2);x.compressionRatio=r(x.scoreStats.p90P10/x.max,3);});
    const apexDefs={twoPerformanceStrength:{label:'Two-performance strength',max:2},proof:{label:'Proof',max:1.75},bestFighterClaim:{label:'Best-fighter claim',max:1.25},aura:{label:'Aura',max:1}};
    const apexRows=all.map(row=>({fighter:row.fighter,...(row.apexPeakAudit?.components||{})})).filter(x=>Object.keys(apexDefs).every(k=>Number.isFinite(Number(x[k]))));
    const apexComponents={fighterCount:apexRows.length,components:{}};
    const apexTotal=x=>Object.keys(apexDefs).reduce((s,k)=>s+num(x[k]),0);
    for(const [key,d] of Object.entries(apexDefs)){
      const vals=apexRows.map(x=>num(x[key])),totals=apexRows.map(apexTotal);
      apexComponents.components[key]={label:d.label,max:d.max,scoreStats:stats(vals),correlationWithApexTotal:pearson(vals,totals),apexRankImpact:rankImpact(apexRows,apexTotal,x=>apexTotal(x)-num(x[key]))};
    }
    const apexStdSum=Object.values(apexComponents.components).reduce((s,x)=>s+x.scoreStats.stdDev,0),apexSpreadSum=Object.values(apexComponents.components).reduce((s,x)=>s+x.scoreStats.p90P10,0);
    Object.values(apexComponents.components).forEach(x=>{x.effectiveStdSharePct=r(apexStdSum?x.scoreStats.stdDev/apexStdSum*100:0,2);x.robustSpreadSharePct=r(apexSpreadSum?x.scoreStats.p90P10/apexSpreadSum*100:0,2);x.compressionRatio=r(x.scoreStats.p90P10/x.max,3);});
    const champInputs={adjustedTitleCredit:stats(all.map(row=>num(row.championshipResumeAudit?.adjustedTitleCredit))),titleFightWins:stats(all.map(row=>num(row.championshipResumeAudit?.titleFightWins)))};
    const qualityInputs={diminishedCredit:stats(all.map(row=>num(row.opponentQualityLiveAudit?.diminishedCredit))),elitePlusWins:stats(all.map(row=>num(row.opponentQualityLiveAudit?.elitePlusWins))),topFivePlusWins:stats(all.map(row=>num(row.opponentQualityLiveAudit?.topFivePlusWins))),rankedQualityWins:stats(all.map(row=>num(row.opponentQualityLiveAudit?.rankedQualityWins)))};
    const longevityRows=win.UFC_LONGEVITY_SHADOW_SCORER?.rows||[];
    const longevityInputs={activeEliteYears:stats(longevityRows.map(x=>num(x.activeEliteYears))),gapAdjustedMonths:stats(longevityRows.map(x=>num(x.gapAdjustedMonths))),statusMultiplier:stats(longevityRows.map(x=>num(x.statusMultiplier))),divisionMultiplier:stats(longevityRows.map(x=>num(x.divisionMultiplier))),countedEliteMonths:stats(longevityRows.map(x=>num(x.countedEliteMonths)))};
    return{version:'effective-weight-audit-20260710a',generatedAt:new Date().toISOString(),readOnly:true,formula:'Championship /30×35 + Quality /30×27.5 + Prime /30×27.5 + Longevity /30×10 + Apex + Penalty',scopes:{all:categoryScope(all),men:categoryScope(all.filter(x=>(win.RANKING_DATA?.men||[]).includes(x))),women:categoryScope(all.filter(x=>(win.RANKING_DATA?.women||[]).includes(x)))},primeComponents,apexComponents,sourceInputs:{championship:champInputs,qualityWins:qualityInputs,longevity:longevityInputs},notes:['Dispersion measures effective separation, not philosophical importance.','Standard-deviation share and p90–p10 share are descriptive; correlated categories can overlap in influence.','Rank-impact tests remove one category or component while leaving all others unchanged.','Loss Context is excluded from calibration conclusions because its live promoter remains disabled.']};
  });
  const f=n=>Number(n||0).toFixed(2),pct=n=>`${f(n)}%`;
  const c=report.scopes.all.categories;
  let md=`# Category Distribution and Effective-Weight Audit\n\nGenerated: ${report.generatedAt}\n\nRead-only: yes. No fighter scores were changed.\n\n## Top-Level Positive Categories — All 62 Fighters\n\n| Category | Declared max | Mean contribution | Std dev | P10–P90 spread | Effective std share | Robust spread share | Mean rank movement if removed |\n|---|---:|---:|---:|---:|---:|---:|---:|\n`;
  for(const k of ['championship','opponentQuality','primeDominance','longevity','apexPeak']){const x=c[k];md+=`| ${x.label} | ${f(x.declaredMaxPoints)} | ${f(x.contributionStats.mean)} | ${f(x.contributionStats.stdDev)} | ${f(x.contributionStats.p90P10)} | ${x.effectiveStdSharePct==null?'Bonus':pct(x.effectiveStdSharePct)} | ${x.robustSpreadSharePct==null?'Bonus':pct(x.robustSpreadSharePct)} | ${f(x.rankImpact.meanAbsoluteRankChange)} |\n`;}
  md+=`\n## Prime Dominance Components\n\n| Component | Max | Mean | Std dev | P10–P90 | Effective std share | Robust spread share | Mean Prime-rank movement if removed |\n|---|---:|---:|---:|---:|---:|---:|---:|\n`;
  for(const x of Object.values(report.primeComponents.components))md+=`| ${x.label} | ${f(x.max)} | ${f(x.scoreStats.mean)} | ${f(x.scoreStats.stdDev)} | ${f(x.scoreStats.p90P10)} | ${pct(x.effectiveStdSharePct)} | ${pct(x.robustSpreadSharePct)} | ${f(x.primeRankImpact.meanAbsoluteRankChange)} |\n`;
  md+=`\n## Apex Peak Components\n\n| Component | Max | Mean | Std dev | P10–P90 | Effective std share | Robust spread share | Mean Apex-rank movement if removed |\n|---|---:|---:|---:|---:|---:|---:|---:|\n`;
  for(const x of Object.values(report.apexComponents.components))md+=`| ${x.label} | ${f(x.max)} | ${f(x.scoreStats.mean)} | ${f(x.scoreStats.stdDev)} | ${f(x.scoreStats.p90P10)} | ${pct(x.effectiveStdSharePct)} | ${pct(x.robustSpreadSharePct)} | ${f(x.apexRankImpact.meanAbsoluteRankChange)} |\n`;
  md+=`\n## Source-Input Distributions\n\n### Championship Resume\n\n- Adjusted title credit P10–P90: ${f(report.sourceInputs.championship.adjustedTitleCredit.p10)}–${f(report.sourceInputs.championship.adjustedTitleCredit.p90)}\n- Title-fight wins P10–P90: ${f(report.sourceInputs.championship.titleFightWins.p10)}–${f(report.sourceInputs.championship.titleFightWins.p90)}\n\n### Quality Wins\n\n- Diminished credit P10–P90: ${f(report.sourceInputs.qualityWins.diminishedCredit.p10)}–${f(report.sourceInputs.qualityWins.diminishedCredit.p90)}\n- Elite+ wins P10–P90: ${f(report.sourceInputs.qualityWins.elitePlusWins.p10)}–${f(report.sourceInputs.qualityWins.elitePlusWins.p90)}\n- Top-5+ wins P10–P90: ${f(report.sourceInputs.qualityWins.topFivePlusWins.p10)}–${f(report.sourceInputs.qualityWins.topFivePlusWins.p90)}\n\n### Longevity\n\n- Active elite years P10–P90: ${f(report.sourceInputs.longevity.activeEliteYears.p10)}–${f(report.sourceInputs.longevity.activeEliteYears.p90)}\n- Counted elite months P10–P90: ${f(report.sourceInputs.longevity.countedEliteMonths.p10)}–${f(report.sourceInputs.longevity.countedEliteMonths.p90)}\n- Status multiplier P10–P90: ${f(report.sourceInputs.longevity.statusMultiplier.p10)}–${f(report.sourceInputs.longevity.statusMultiplier.p90)}\n- Division multiplier P10–P90: ${f(report.sourceInputs.longevity.divisionMultiplier.p10)}–${f(report.sourceInputs.longevity.divisionMultiplier.p90)}\n\n## Interpretation Rules\n\n- A high average does not make a category influential; wide dispersion does.\n- A compressed component has a low P10–P90 spread relative to its maximum.\n- Effective shares are descriptive and should guide review, not automatically force a uniform distribution.\n- Loss Context is intentionally excluded until its live ledger is finalized.\n`;
  await mkdir('docs/audits',{recursive:true});
  await writeFile('docs/audits/runtime-effective-weight-audit.json',`${JSON.stringify(report,null,2)}\n`,'utf8');
  await writeFile('docs/audits/runtime-effective-weight-audit.md',`${md}\n`,'utf8');
  console.log('EFFECTIVE_WEIGHT_AUDIT='+JSON.stringify({fighters:report.scopes.all.fighterCount,primeComponents:report.primeComponents.fighterCount,apexComponents:report.apexComponents.fighterCount}));
}finally{await browser.close();}

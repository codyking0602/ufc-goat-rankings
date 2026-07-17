import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';

const BASE_URL=process.env.BLIND_RANK_AUDIT_URL||'http://127.0.0.1:4173/';
const GAMES=Math.max(1000,Math.min(100000,Number(process.env.BLIND_RANK_GAMES)||25000));

async function collect(browser,expansionEnabled){
  const page=await browser.newPage();
  page.setDefaultTimeout(180000);
  const url=new URL(BASE_URL);
  url.searchParams.set('blindRankExpansion',expansionEnabled?'on':'off');
  await page.goto(url.toString(),{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>Boolean(window.UFC_BLIND_RANK&&window.UFC_BLIND_RANK_PHASE_FIVE&&window.UFC_BLIND_RANK_CATEGORY_RATINGS?.audit));
  const report=await page.evaluate(games=>window.UFC_BLIND_RANK_PHASE_FIVE.runAll(games,{includeRaw:false}),GAMES);
  await page.close();
  delete report.poolAudit;
  delete report.ledgerAudit;
  delete report.raw;
  return report;
}

function comparison(before,after){
  const beforeMap=new Map(before.packs.map(pack=>[pack.packId,pack]));
  return after.packs.map(pack=>{
    const old=beforeMap.get(pack.packId)||{};
    const delta=(a,b)=>Math.round(((Number(a)||0)-(Number(b)||0))*100)/100;
    return {
      packId:pack.packId,
      packName:pack.packName,
      poolBefore:old.poolSize||0,
      poolAfter:pack.poolSize||0,
      poolChange:(pack.poolSize||0)-(old.poolSize||0),
      fallbackChange:delta(pack.fallbackPct,old.fallbackPct),
      emergencyFallbackChange:delta(pack.emergencyFallbackPct,old.emergencyFallbackPct),
      exhaustedRepeatChange:delta(pack.repeatProtectionExhaustedPct,old.repeatProtectionExhaustedPct),
      badGameChange:delta(pack.badGamePct,old.badGamePct)
    };
  });
}

function markdown(report){
  const lines=[
    '# Blind Rank Phase 5 Production Audit','',
    `Generated: **${report.generatedAt}**  `,
    `Games per pack: **${report.gamesPerPack.toLocaleString()}**  `,
    `Baseline roster: **${report.baseline.rosterSize}**  `,
    `Expanded roster: **${report.expanded.rosterSize}**  `,
    `Expansion batch: **${report.expanded.expansionFighters.length} fighters**`,'',
    '| Pack | Pool | Tiers E/G/G/A/BA/B | Bad games | Fallback | Emergency | Repeat exhausted | Status |',
    '|---|---:|---|---:|---:|---:|---:|---|'
  ];
  for(const pack of report.expanded.packs){
    const tiers=pack.tiers||{};
    lines.push(`| ${pack.packName} | ${pack.poolSize} | ${tiers.elite||0}/${tiers.great||0}/${tiers.good||0}/${tiers.average||0}/${tiers['below-average']||0}/${tiers.bad||0} | ${pack.badGamePct}% | ${pack.fallbackPct}% | ${pack.emergencyFallbackPct}% | ${pack.repeatProtectionExhaustedPct}% | ${pack.status} |`);
  }
  lines.push('','## Expansion impact','',
    '| Pack | Pool change | Fallback Δ | Emergency Δ | Repeat-exhausted Δ |',
    '|---|---:|---:|---:|---:|');
  for(const row of report.comparison){
    lines.push(`| ${row.packName} | ${row.poolChange>=0?'+':''}${row.poolChange} | ${row.fallbackChange>=0?'+':''}${row.fallbackChange} pts | ${row.emergencyFallbackChange>=0?'+':''}${row.emergencyFallbackChange} pts | ${row.exhaustedRepeatChange>=0?'+':''}${row.exhaustedRepeatChange} pts |`);
  }
  lines.push('','## Added fighters','',...report.expanded.expansionFighters.map(name=>`- ${name}`),'');
  return lines.join('\n');
}

const browser=await chromium.launch({headless:true});
try{
  const baseline=await collect(browser,false);
  const expanded=await collect(browser,true);
  const report={version:'blind-rank-phase-five-production-audit-20260717a',generatedAt:new Date().toISOString(),gamesPerPack:GAMES,baseline,expanded,comparison:comparison(baseline,expanded)};
  await writeFile('assets/data/blind-rank-phase-five-report.json',`${JSON.stringify(report,null,2)}\n`);
  await writeFile('assets/data/blind-rank-phase-five-report.md',`${markdown(report)}\n`);
  console.log(markdown(report));
}finally{
  await browser.close();
}

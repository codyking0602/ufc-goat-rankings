import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const url=process.env.UFC_APP_URL||'http://127.0.0.1:4173/index.html?fighter-data-ownership-audit=1';
const jsonPath=process.env.UFC_FIGHTER_DATA_BASELINE_JSON||'docs/fighter-data-ownership-baseline.json';
const mdPath=process.env.UFC_FIGHTER_DATA_BASELINE_MD||'docs/fighter-data-ownership-baseline.md';
const timeout=Number(process.env.UFC_FIGHTER_DATA_BASELINE_TIMEOUT_MS||60_000);
const browserErrors=[];
let browser;

const countBy=(rows,selector)=>Object.entries(rows.reduce((counts,row)=>{
  const key=selector(row)||'Unknown';
  counts[key]=(counts[key]||0)+1;
  return counts;
},{})).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));

try{
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:1200}});
  page.on('console',message=>{if(message.type()==='error')browserErrors.push(message.text());});
  page.on('pageerror',error=>browserErrors.push(error?.stack||error?.message||String(error)));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout});
  await page.waitForFunction(()=>window.UFC_FIGHTER_DATA_OWNERSHIP_AUDIT?.ready===true,null,{timeout,polling:100});

  const report=await page.evaluate(()=>{
    const api=window.UFC_FIGHTER_DATA_OWNERSHIP_AUDIT;
    return JSON.parse(JSON.stringify({
      schemaVersion:'ufc-fighter-data-ownership-baseline-v1',
      sourceUrl:location.href,
      auditVersion:api?.version||null,
      summary:api?.summary||null,
      report:api?.latest||null,
      error:api?.error||null
    }));
  });

  if(!report.report)throw new Error(`Ownership audit did not return a report${report.error?`: ${report.error}`:''}.`);
  const conflicts=[...(report.report.conflictingFactFields||[])].sort((a,b)=>a.fighter.localeCompare(b.fighter)||a.field.localeCompare(b.field));
  const duplicates=[...(report.report.duplicatedFactFields||[])].sort((a,b)=>a.fighter.localeCompare(b.fighter)||a.field.localeCompare(b.field));
  const presentation=[...(report.report.presentationOwnershipViolations||[])].sort((a,b)=>a.fighter.localeCompare(b.fighter)||a.source.localeCompare(b.source)||a.field.localeCompare(b.field));
  const orphans=[...(report.report.orphanIdentities||[])].sort((a,b)=>a.fighter.localeCompare(b.fighter));
  report.report.conflictingFactFields=conflicts;
  report.report.duplicatedFactFields=duplicates;
  report.report.presentationOwnershipViolations=presentation;
  report.report.orphanIdentities=orphans;
  report.captureDiagnostics={browserErrorCount:browserErrors.length,browserErrors:browserErrors.slice(0,50)};
  report.analysis={
    conflictFighterCount:new Set(conflicts.map(row=>row.fighter)).size,
    duplicateFighterCount:new Set(duplicates.map(row=>row.fighter)).size,
    presentationViolationFighterCount:new Set(presentation.map(row=>row.fighter)).size,
    conflictsByField:countBy(conflicts,row=>row.field),
    duplicatesByField:countBy(duplicates,row=>row.field),
    presentationViolationsBySource:countBy(presentation,row=>row.source),
    presentationViolationsByField:countBy(presentation,row=>row.field)
  };

  await fs.mkdir('docs',{recursive:true});
  await fs.writeFile(jsonPath,`${JSON.stringify(report,null,2)}\n`,'utf8');

  const locks=report.summary?.runtimeExpectedValueLocks||{};
  const table=(rows,headingA='Field',headingB='Count')=>[
    `| ${headingA} | ${headingB} |`,
    '|---|---:|',
    ...(rows.length?rows.slice(0,20).map(([label,count])=>`| ${String(label).replaceAll('|','\\|')} | ${count} |`):['| None | 0 |'])
  ];
  const knownNames=new Set(['Charles Oliveira','Benson Henderson','Vitor Belfort','Deiveson Figueiredo']);
  const knownConflicts=conflicts.filter(row=>knownNames.has(row.fighter));
  const knownLines=knownConflicts.length?knownConflicts.map(row=>`- **${row.fighter} — ${row.field}:** ${row.values.map(group=>`${JSON.stringify(group.value)} [${group.sources.join(', ')}]`).join(' vs ')}`):['- None captured.'];
  const orphanLines=orphans.length?orphans.map(row=>`- **${row.fighter}:** ${row.sources.join(', ')}`):['- None.'];
  const markdown=[
    '# Fighter Data Ownership Baseline','',
    '> Phase 1 diagnostic. A failing ownership result is expected until migration is complete; capture failure is not.','',
    `- Captured: ${report.report.capturedAt}`,
    `- Audit version: \`${report.auditVersion}\``,
    `- Roster identities found: **${report.summary.rosterCount}**`,
    `- Board rows: **${report.summary.boardRowCount}**`,
    `- Profile rows: **${report.summary.profileRowCount}**`,
    `- Fighter packets loaded: **${report.summary.fighterPacketCount}**`,
    `- Display overrides: **${report.summary.displayOverrideCount}**`,
    `- Canonical scoring records: **${report.summary.canonicalScoringRecordCount}**`,
    `- Canonical fighter-fact records: **${report.summary.canonicalFactRecordCount}** (${report.summary.canonicalCoveragePct}%)`,
    `- Orphan identities: **${report.summary.orphanIdentityCount??orphans.length}**`,
    `- Duplicate fact fields: **${report.summary.duplicateCount}** across **${report.analysis.duplicateFighterCount}** fighters`,
    `- Conflicting fact fields: **${report.summary.conflictCount}** across **${report.analysis.conflictFighterCount}** fighters`,
    `- Presentation ownership violations: **${report.summary.presentationViolationCount}** across **${report.analysis.presentationViolationFighterCount}** fighters`,
    `- Runtime expected-rank locks: **${locks.expectedRank??0}**`,
    `- Runtime expected-total locks: **${locks.expectedTotalScore??0}**`,
    `- Runtime expected-OVR locks: **${locks.expectedOverallOvr??0}**`,
    `- Browser errors: **${report.captureDiagnostics.browserErrorCount}**`,'',
    '## Orphan identities','',...orphanLines,'',
    '## Conflicts by field','',...table(report.analysis.conflictsByField),'',
    '## Duplicate ownership by field','',...table(report.analysis.duplicatesByField),'',
    '## Presentation violations by source','',...table(report.analysis.presentationViolationsBySource,'Source','Count'),'',
    '## First migration batch conflicts','',...knownLines,'',
    '## Interpretation','',
    '- Duplicate ownership means the same measurable fact exists in more than one place, even when the values currently agree.',
    '- A conflict means those duplicate sources disagree.',
    '- Agreement across duplicate sources does not prove the shared value is factually correct; evidence audits still matter.',
    '- Expected rank, total, and OVR counts confirm runtime locks that must be removed in Phase 4.',
    '- Canonical coverage begins at zero intentionally and increases only as fighters are fully reconciled.',''
  ].join('\n');
  await fs.writeFile(mdPath,markdown,'utf8');
  console.log('FIGHTER_DATA_OWNERSHIP_BASELINE');
  console.log(JSON.stringify(report.summary,null,2));
  if(report.captureDiagnostics.browserErrorCount)process.exitCode=1;
}catch(error){
  console.error(error?.stack||error);
  process.exitCode=1;
}finally{
  if(browser)await browser.close();
}

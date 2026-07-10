import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const baseUrl = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

page.on('console', message => {
  console.log(`[browser:${message.type()}] ${message.text()}`);
});
page.on('pageerror', error => {
  console.error(`[browser:error] ${error.stack || error.message}`);
});

try {
  await page.goto(`${baseUrl}/audit.html`, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000
  });

  await page.waitForFunction(() => {
    const frame = document.getElementById('appFrame');
    return Boolean(frame?.contentWindow?.UFC_SIX_CATEGORY_INTEGRITY_AUDIT?.latest);
  }, { timeout: 90_000 });

  // The current app deliberately reapplies scoring modules through 8.2 seconds.
  // Wait beyond the final timer, then run one explicit read-only audit.
  await page.waitForTimeout(15_000);

  const payload = await page.evaluate(() => {
    const frame = document.getElementById('appFrame');
    const win = frame?.contentWindow;
    const audit = win?.UFC_SIX_CATEGORY_INTEGRITY_AUDIT;
    if (!audit || !win) return null;

    const report = audit.run('github-actions-settled-runtime');
    const engine = win.UFC_FINAL_SCORE_ENGINE || null;
    const weighting = win.UFC_SCORE_WEIGHTING || null;
    const boardRows = [
      ...(win.RANKING_DATA?.men || []),
      ...(win.RANKING_DATA?.women || [])
    ];
    const rowsWithWrongOwner = boardRows
      .filter(row => row?.finalScoreEngineVersion !== engine?.version)
      .map(row => ({
        fighter: row?.fighter,
        expectedOwnerVersion: engine?.version || null,
        actualOwnerVersion: row?.finalScoreEngineVersion || null
      }));

    const ownership = {
      finalScoreEnginePresent: Boolean(engine),
      finalScoreEngineVersion: engine?.version || null,
      declaredOverallOwner: weighting?.overallOwner || null,
      legacyWeightingPresent: Boolean(weighting),
      legacyWeightingVersion: weighting?.version || null,
      legacyWeightingMode: weighting?.mode || null,
      legacyWeightingMutatesScores: weighting?.mutatesScores,
      legacyPrimeWindowsLoader: weighting?.primeWindowsLoader,
      legacyPrimeDominanceLoader: weighting?.primeDominanceShadowLoader,
      fighterRowsChecked: boardRows.length,
      rowsWithWrongOwner,
      passed: Boolean(
        engine &&
        weighting &&
        weighting.mutatesScores === false &&
        weighting.mode === 'compatibility-only' &&
        weighting.overallOwner === 'final-score-engine.js' &&
        weighting.primeWindowsLoader === false &&
        weighting.primeDominanceShadowLoader === false &&
        rowsWithWrongOwner.length === 0
      )
    };

    report.ownership = ownership;
    report.summary.ownershipPass = ownership.passed;
    const markdown = `${audit.exportMarkdown()}\n\n## Overall Score Ownership\n\n` +
      `- Final score engine: ${ownership.finalScoreEngineVersion || 'missing'}\n` +
      `- Legacy weighting mode: ${ownership.legacyWeightingMode || 'missing'}\n` +
      `- Legacy weighting mutates scores: ${String(ownership.legacyWeightingMutatesScores)}\n` +
      `- Legacy duplicate Prime loaders: ${String(Boolean(ownership.legacyPrimeWindowsLoader || ownership.legacyPrimeDominanceLoader))}\n` +
      `- Fighter rows with a non-final owner: ${ownership.rowsWithWrongOwner.length}\n` +
      `- Ownership gate: ${ownership.passed ? 'PASS' : 'FAIL'}\n`;

    return {
      report,
      json: JSON.stringify(report, null, 2),
      markdown
    };
  });

  if (!payload?.report) {
    throw new Error('Six-category integrity report was not available after the settled runtime wait.');
  }

  await mkdir('docs/audits', { recursive: true });
  await writeFile('docs/audits/runtime-six-category-audit.json', `${payload.json}\n`, 'utf8');
  await writeFile('docs/audits/runtime-six-category-audit.md', `${payload.markdown}\n`, 'utf8');

  const summary = payload.report.summary || {};
  console.log('AUDIT_SUMMARY=' + JSON.stringify(summary));
  console.log(`AUDIT_PASSED=${Boolean(payload.report.passed)}`);
  console.log(`AUDIT_FIGHTERS=${summary.fighterCount ?? 'unknown'}`);
  console.log(`AUDIT_COMPLETE=${summary.completeCount ?? 'unknown'}`);
  console.log(`AUDIT_INCOMPLETE=${summary.incompleteCount ?? 'unknown'}`);
  console.log(`AUDIT_FORMULA_MISMATCHES=${summary.formulaMismatchCount ?? 'unknown'}`);
  console.log(`AUDIT_FORBIDDEN_OVERRIDES=${summary.forbiddenOverrideCount ?? 'unknown'}`);
  console.log(`AUDIT_OWNERSHIP_PASS=${Boolean(summary.ownershipPass)}`);

  if (!payload.report.ownership?.passed) {
    throw new Error(`Overall score ownership gate failed: ${JSON.stringify(payload.report.ownership)}`);
  }
  if ((summary.formulaMismatchCount ?? 1) !== 0) {
    throw new Error(`Locked-formula regression detected: ${summary.formulaMismatchCount} mismatches.`);
  }
} finally {
  await browser.close();
}
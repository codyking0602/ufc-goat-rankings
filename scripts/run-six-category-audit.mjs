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
    const audit = frame?.contentWindow?.UFC_SIX_CATEGORY_INTEGRITY_AUDIT;
    if (!audit) return null;
    const report = audit.run('github-actions-settled-runtime');
    return {
      report,
      json: audit.exportJson(),
      markdown: audit.exportMarkdown()
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
} finally {
  await browser.close();
}

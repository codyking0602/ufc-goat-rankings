import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const baseUrl = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

try {
  await page.goto(`${baseUrl}/index.html`, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000
  });
  await page.waitForFunction(
    () => window.UFC_SCORING_PIPELINE?.status === 'ready',
    { timeout: 90_000 }
  );

  const report = await page.evaluate(() => {
    const profiles = window.RANKING_DATA?.fighters || [];
    const boardNames = [
      ...(window.RANKING_DATA?.men || []),
      ...(window.RANKING_DATA?.women || [])
    ].map(row => row.fighter);
    const canonical = new Map(profiles.map(row => [row.fighter, row.primeRecord]));
    const rows = [];

    for (const fighter of boardNames) {
      window.openFighter(fighter);
      const tile = [...document.querySelectorAll('#fighterDetail .snapshot-item')]
        .find(item => item.querySelector('small')?.textContent.trim() === 'Prime Record');
      const visible = tile?.querySelector('strong')?.textContent.trim() || null;
      const expected = canonical.get(fighter) || null;
      rows.push({
        fighter,
        expected,
        visible,
        passed: Boolean(expected && visible === expected)
      });
    }

    const packetScripts = [...document.scripts]
      .filter(script => [...script.attributes].some(attr => attr.name.startsWith('data-fighter-packet-')))
      .map(script => script.src);

    const overrideWriters = [];
    const scan = (value, path = []) => {
      if (!value || typeof value !== 'object') return;
      if (Array.isArray(value)) {
        value.forEach((item, index) => scan(item, [...path, index]));
        return;
      }
      for (const [key, child] of Object.entries(value)) {
        if (
          (key === 'primeRecord' || key === 'primeUfcRecord' || key === 'prime_record') &&
          typeof child === 'string'
        ) {
          overrideWriters.push([...path, key].join('.'));
        }
        scan(child, [...path, key]);
      }
    };
    scan(window.DISPLAY_OVERRIDES || {}, ['DISPLAY_OVERRIDES']);

    return {
      fighterCount: boardNames.length,
      canonicalCount: canonical.size,
      invalidCanonical: profiles
        .filter(row => !/^\d+-\d+(?:-\d+)?(?:,\s*\d+\s*NC)?$/.test(String(row.primeRecord || '')))
        .map(row => ({ fighter: row.fighter, primeRecord: row.primeRecord })),
      mismatches: rows.filter(row => !row.passed),
      packetScripts,
      packetRuntimeCount: Object.keys(window.UFC_FIGHTER_PACKETS || {}).length,
      overrideWriters,
      rows
    };
  });

  report.passed = Boolean(
    report.fighterCount === 62 &&
    report.canonicalCount === 62 &&
    report.invalidCanonical.length === 0 &&
    report.mismatches.length === 0 &&
    report.packetScripts.length === 0 &&
    report.packetRuntimeCount === 0 &&
    report.overrideWriters.length === 0
  );

  await mkdir('docs/audits', { recursive: true });
  await writeFile(
    'docs/audits/runtime-prime-record-source-audit.json',
    `${JSON.stringify(report, null, 2)}\n`,
    'utf8'
  );
  await writeFile(
    'docs/audits/runtime-prime-record-source-audit.md',
    `# Prime Record Source Audit\n\n` +
      `- Fighters: ${report.fighterCount}\n` +
      `- Canonical records: ${report.canonicalCount}\n` +
      `- Invalid canonical values: ${report.invalidCanonical.length}\n` +
      `- Visible tile mismatches: ${report.mismatches.length}\n` +
      `- Loaded legacy packet scripts: ${report.packetScripts.length}\n` +
      `- Runtime packet entries: ${report.packetRuntimeCount}\n` +
      `- Display override writers: ${report.overrideWriters.length}\n` +
      `- Result: ${report.passed ? 'PASS' : 'FAIL'}\n`,
    'utf8'
  );

  console.log('PRIME_RECORD_SOURCE_AUDIT=' + JSON.stringify({
    passed: report.passed,
    fighters: report.fighterCount,
    mismatches: report.mismatches.length,
    invalidCanonical: report.invalidCanonical.length,
    packetScripts: report.packetScripts.length,
    overrideWriters: report.overrideWriters.length
  }));

  if (!report.passed) {
    throw new Error(`Prime Record source audit failed: ${JSON.stringify(report)}`);
  }
} finally {
  await browser.close();
}

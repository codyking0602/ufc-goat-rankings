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
    const data = window.RANKING_DATA || {};
    const boardNames = [...(data.men || []), ...(data.women || [])].map(row => row.fighter);
    const canonical = data.primeRecords || {};
    const rows = [];
    const keys = ['primeRecord', 'primeUfcRecord', 'prime_record'];

    for (const fighter of boardNames) {
      window.openFighter(fighter);
      const tile = [...document.querySelectorAll('#fighterDetail .snapshot-item')]
        .find(item => item.querySelector('small')?.textContent.trim() === 'Prime Record');
      const visible = tile?.querySelector('strong')?.textContent.trim() || null;
      const expected = canonical[fighter]?.record || null;
      rows.push({
        fighter,
        expected,
        visible,
        passed: Boolean(expected && visible === expected)
      });
    }

    const directWriters = (value, path) => {
      if (!value || typeof value !== 'object') return [];
      return keys
        .filter(key => Object.prototype.hasOwnProperty.call(value, key) && typeof value[key] === 'string')
        .map(key => `${path}.${key}`);
    };
    const snapshotWriters = (value, path) => {
      if (!Array.isArray(value)) return [];
      return value
        .map((item, index) => Array.isArray(item) && item[0] === 'Prime Record' ? `${path}.${index}` : null)
        .filter(Boolean);
    };

    const displayOverrideWriters = [];
    for (const [fighter, override] of Object.entries(window.DISPLAY_OVERRIDES || {})) {
      const base = `DISPLAY_OVERRIDES.${fighter}`;
      displayOverrideWriters.push(...directWriters(override, base));
      displayOverrideWriters.push(...directWriters(override?.snapshotStats, `${base}.snapshotStats`));
      displayOverrideWriters.push(...directWriters(override?.packetProfileStats, `${base}.packetProfileStats`));
      displayOverrideWriters.push(...snapshotWriters(override?.snapshot, `${base}.snapshot`));
    }

    const packetWriters = [];
    for (const [fighter, packet] of Object.entries(window.UFC_FIGHTER_PACKETS || {})) {
      const base = `UFC_FIGHTER_PACKETS.${fighter}`;
      packetWriters.push(...directWriters(packet?.boardRow, `${base}.boardRow`));
      packetWriters.push(...directWriters(packet?.profile, `${base}.profile`));
      packetWriters.push(...directWriters(packet?.profileStats, `${base}.profileStats`));
      packetWriters.push(...directWriters(packet?.display, `${base}.display`));
      packetWriters.push(...directWriters(packet?.display?.snapshotStats, `${base}.display.snapshotStats`));
      packetWriters.push(...snapshotWriters(packet?.display?.snapshot, `${base}.display.snapshot`));
    }

    const rowWriters = [];
    for (const [label, collection] of [
      ['RANKING_DATA.men', data.men || []],
      ['RANKING_DATA.women', data.women || []],
      ['RANKING_DATA.fighters', data.fighters || []]
    ]) {
      collection.forEach((row, index) => rowWriters.push(...directWriters(row, `${label}.${index}`)));
    }

    return {
      fighterCount: boardNames.length,
      canonicalCount: Object.keys(canonical).length,
      invalidCanonical: Object.entries(canonical)
        .filter(([, value]) => !/^\d+-\d+(?:-\d+)?(?:,\s*\d+\s*NC)?$/.test(String(value?.record || '')))
        .map(([fighter, value]) => ({ fighter, primeRecord: value?.record || null })),
      missingCanonical: boardNames.filter(fighter => !canonical[fighter]?.record),
      mismatches: rows.filter(row => !row.passed),
      displayOverrideWriters,
      packetWriters,
      rowWriters,
      rows
    };
  });

  report.passed = Boolean(
    report.fighterCount === 62 &&
    report.canonicalCount === 62 &&
    report.invalidCanonical.length === 0 &&
    report.missingCanonical.length === 0 &&
    report.mismatches.length === 0 &&
    report.displayOverrideWriters.length === 0 &&
    report.packetWriters.length === 0 &&
    report.rowWriters.length === 0
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
      `- Canonical map records: ${report.canonicalCount}\n` +
      `- Invalid canonical values: ${report.invalidCanonical.length}\n` +
      `- Missing canonical values: ${report.missingCanonical.length}\n` +
      `- Visible tile mismatches: ${report.mismatches.length}\n` +
      `- Display override writers: ${report.displayOverrideWriters.length}\n` +
      `- Fighter packet writers: ${report.packetWriters.length}\n` +
      `- Board/profile row writers: ${report.rowWriters.length}\n` +
      `- Internal Prime Dominance audit fields are evidence only and are not profile writers.\n` +
      `- Result: ${report.passed ? 'PASS' : 'FAIL'}\n`,
    'utf8'
  );

  console.log('PRIME_RECORD_SOURCE_AUDIT=' + JSON.stringify({
    passed: report.passed,
    fighters: report.fighterCount,
    canonicalCount: report.canonicalCount,
    mismatches: report.mismatches.length,
    invalidCanonical: report.invalidCanonical.length,
    missingCanonical: report.missingCanonical.length,
    displayOverrideWriters: report.displayOverrideWriters.length,
    packetWriters: report.packetWriters.length,
    rowWriters: report.rowWriters.length
  }));

  if (!report.passed) {
    throw new Error(`Prime Record source audit failed: ${JSON.stringify(report)}`);
  }
} finally {
  await browser.close();
}

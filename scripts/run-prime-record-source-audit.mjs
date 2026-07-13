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
    const normalize = name => String(name || '')
      .trim()
      .toLowerCase()
      .replace(/[’‘`´]/g, "'")
      .replace(/\s+/g, ' ');
    const validRecord = value => /^\d+-\d+(?:-\d+)?(?:,\s*\d+\s*NC)?$/.test(String(value || ''));
    const boardNames = [];
    const seenBoard = new Set();
    [...(data.men || []), ...(data.women || [])].forEach(row => {
      const fighter = row?.fighter;
      const id = normalize(fighter);
      if (!fighter || !id || seenBoard.has(id)) return;
      seenBoard.add(id);
      boardNames.push(fighter);
    });

    const canonicalApi = window.UFC_CANONICAL_PRIME_RECORDS || null;
    const rawEntries = Array.isArray(canonicalApi?.entries)
      ? canonicalApi.entries.map(entry => ({ fighter: entry.fighter, record: entry.record }))
      : Object.entries(data.primeRecords || {}).map(([fighter, value]) => ({ fighter, record: value?.record || null }));
    const canonicalGroups = new Map();
    rawEntries.forEach(entry => {
      const id = normalize(entry.fighter);
      if (!id) return;
      if (!canonicalGroups.has(id)) canonicalGroups.set(id, []);
      canonicalGroups.get(id).push(entry);
    });
    const canonicalByKey = new Map();
    canonicalGroups.forEach((entries, id) => {
      canonicalByKey.set(id, entries.find(entry => validRecord(entry.record)) || entries[0]);
    });

    const rows = [];
    for (const fighter of boardNames) {
      window.openFighter(fighter);
      const tile = [...document.querySelectorAll('#fighterDetail .snapshot-item')]
        .find(item => item.querySelector('small')?.textContent.trim() === 'Prime Record');
      const visible = tile?.querySelector('strong')?.textContent.trim() || null;
      const expected = canonicalApi?.entryFor?.(fighter)?.record || canonicalByKey.get(normalize(fighter))?.record || null;
      rows.push({
        fighter,
        expected,
        visible,
        passed: Boolean(expected && visible === expected)
      });
    }

    const keys = ['primeRecord', 'primeUfcRecord', 'prime_record'];
    const collectDirect = (value, path, out) => {
      if (!value || typeof value !== 'object') return;
      keys.forEach(key => {
        if (Object.prototype.hasOwnProperty.call(value, key) && typeof value[key] === 'string') {
          out.push({ path: `${path}.${key}`, value: value[key] });
        }
      });
    };
    const collectSnapshot = (value, path, out) => {
      if (!Array.isArray(value)) return;
      value.forEach((item, index) => {
        if (Array.isArray(item) && item[0] === 'Prime Record' && typeof item[1] === 'string') {
          out.push({ path: `${path}.${index}`, value: item[1] });
        }
      });
    };
    const expectedFor = fighter => canonicalApi?.entryFor?.(fighter)?.record || canonicalByKey.get(normalize(fighter))?.record || null;
    const mirrorRows = [];

    for (const [label, collection] of [
      ['RANKING_DATA.men', data.men || []],
      ['RANKING_DATA.women', data.women || []],
      ['RANKING_DATA.fighters', data.fighters || []]
    ]) {
      collection.forEach((row, index) => {
        const values = [];
        collectDirect(row, `${label}.${index}`, values);
        values.forEach(item => mirrorRows.push({ fighter: row?.fighter, expected: expectedFor(row?.fighter), ...item }));
      });
    }

    for (const [fighter, override] of Object.entries(window.DISPLAY_OVERRIDES || {})) {
      const base = `DISPLAY_OVERRIDES.${fighter}`;
      const values = [];
      collectDirect(override, base, values);
      collectDirect(override?.snapshotStats, `${base}.snapshotStats`, values);
      collectDirect(override?.packetProfileStats, `${base}.packetProfileStats`, values);
      collectSnapshot(override?.snapshot, `${base}.snapshot`, values);
      values.forEach(item => mirrorRows.push({ fighter, expected: expectedFor(fighter), ...item }));
    }

    for (const [fighter, packet] of Object.entries(window.UFC_FIGHTER_PACKETS || {})) {
      const base = `UFC_FIGHTER_PACKETS.${fighter}`;
      const values = [];
      collectDirect(packet?.boardRow, `${base}.boardRow`, values);
      collectDirect(packet?.profile, `${base}.profile`, values);
      collectDirect(packet?.profileStats, `${base}.profileStats`, values);
      collectDirect(packet?.display, `${base}.display`, values);
      collectDirect(packet?.display?.snapshotStats, `${base}.display.snapshotStats`, values);
      collectSnapshot(packet?.display?.snapshot, `${base}.display.snapshot`, values);
      values.forEach(item => mirrorRows.push({ fighter, expected: expectedFor(fighter), ...item }));
    }

    const duplicateCanonicalKeys = [...canonicalGroups.entries()]
      .filter(([, entries]) => entries.length > 1)
      .map(([key, entries]) => ({ key, aliases: entries.map(entry => entry.fighter), records: entries.map(entry => entry.record) }));
    const conflictingCanonicalKeys = duplicateCanonicalKeys.filter(group => new Set(group.records.filter(validRecord)).size > 1);
    const invalidCanonical = boardNames
      .map(fighter => ({ fighter, primeRecord: expectedFor(fighter) }))
      .filter(entry => !validRecord(entry.primeRecord));
    const missingCanonical = boardNames.filter(fighter => !expectedFor(fighter));
    const mirrorMismatches = mirrorRows.filter(row => row.expected && row.value !== row.expected);

    return {
      fighterCount: boardNames.length,
      canonicalCount: canonicalByKey.size,
      invalidCanonical,
      missingCanonical,
      mismatches: rows.filter(row => !row.passed),
      duplicateCanonicalKeys,
      conflictingCanonicalKeys,
      mirrorCount: mirrorRows.length,
      mirrorMismatches,
      rows
    };
  });

  report.passed = Boolean(
    report.fighterCount > 0 &&
    report.canonicalCount === report.fighterCount &&
    report.invalidCanonical.length === 0 &&
    report.missingCanonical.length === 0 &&
    report.mismatches.length === 0 &&
    report.conflictingCanonicalKeys.length === 0 &&
    report.mirrorMismatches.length === 0
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
      `- Canonical normalized records: ${report.canonicalCount}\n` +
      `- Invalid canonical values: ${report.invalidCanonical.length}\n` +
      `- Missing canonical values: ${report.missingCanonical.length}\n` +
      `- Visible tile mismatches: ${report.mismatches.length}\n` +
      `- Conflicting canonical aliases: ${report.conflictingCanonicalKeys.length}\n` +
      `- Prime Record display mirrors checked: ${report.mirrorCount}\n` +
      `- Prime Record mirror mismatches: ${report.mirrorMismatches.length}\n` +
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
    conflictingCanonicalAliases: report.conflictingCanonicalKeys.length,
    mirrorCount: report.mirrorCount,
    mirrorMismatches: report.mirrorMismatches.length
  }));

  if (!report.passed) {
    throw new Error(`Prime Record source audit failed: ${JSON.stringify(report)}`);
  }
} finally {
  await browser.close();
}

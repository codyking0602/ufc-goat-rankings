import crypto from 'node:crypto';
import fs from 'node:fs/promises';

const SOURCE_REPOSITORY = 'komaksym/UFC-DataLab';
const SOURCE_COMMIT = '3268146c05211de9deab8b9b4c0bb4a954815f0b';
const SOURCE_FILE = 'data/stats/stats_raw.csv';
const SOURCE_URL = `https://raw.githubusercontent.com/${SOURCE_REPOSITORY}/${SOURCE_COMMIT}/${SOURCE_FILE}`;
const REQUIRED_SOURCE_COLUMNS = [
  'red_fighter_name',
  'blue_fighter_name',
  'event_date',
  'red_fighter_result',
  'blue_fighter_result',
  'bout_type',
  'event_name',
  'method',
  'round',
  'time'
];
const OUTPUT_COLUMNS = ['fight_link', 'date', 'name_1', 'name_2', 'win_loss_1', 'win_loss_2', 'division'];
const USER_AGENT = 'ufc-goat-rankings-era-depth/3.0 (+https://github.com/codyking0602/ufc-goat-rankings)';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field.length || row.length) {
    row.push(field.replace(/\r$/, ''));
    rows.push(row);
  }
  return rows;
}

function csvCell(value) {
  const text = String(value ?? '');
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function parseMirrorDate(value) {
  const text = String(value || '').trim();
  const dmy = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) {
    const [, day, month, year] = dmy;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  const date = new Date(text);
  return Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : null;
}

function normalizeResult(value) {
  const result = String(value || '').trim().toUpperCase();
  if (result === 'W' || result === 'L' || result === 'D' || result === 'NC') return result;
  if (result === 'N/C' || result === 'NO CONTEST' || result === 'NO-CONTEST') return 'NC';
  if (result === 'DRAW') return 'D';
  return '';
}

function stableFightId(row) {
  const identity = [
    row.event_date,
    row.event_name,
    row.red_fighter_name,
    row.blue_fighter_name,
    row.method,
    row.round,
    row.time
  ].map(value => String(value || '').trim()).join('|');
  const digest = crypto.createHash('sha256').update(identity).digest('hex').slice(0, 24);
  return `github://${SOURCE_REPOSITORY}/${SOURCE_COMMIT}/${digest}`;
}

async function fetchText(url, attempts = 5) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'text/csv,text/plain;q=0.9,*/*;q=0.8',
          'Cache-Control': 'no-cache'
        }
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const text = await response.text();
      if (!text.trim()) throw new Error('empty response');
      return text;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await sleep(Math.min(8_000, 750 * (2 ** (attempt - 1))));
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new Error(`Failed to fetch ${url}: ${lastError?.message || lastError}`);
}

function buildRows(csvText) {
  const parsed = parseCsv(csvText).filter(row => row.some(cell => String(cell || '').trim()));
  if (parsed.length < 2) throw new Error('UFC DataLab source is empty.');
  const header = parsed.shift().map(name => String(name || '').trim());
  const positions = Object.fromEntries(header.map((name, index) => [name, index]));
  const missing = REQUIRED_SOURCE_COLUMNS.filter(name => positions[name] === undefined);
  if (missing.length) throw new Error(`UFC DataLab source is missing columns: ${missing.join(', ')}. Header: ${header.join(', ')}`);

  const rows = [];
  for (const values of parsed) {
    const sourceRow = Object.fromEntries(header.map((name, index) => [name, values[index] ?? '']));
    const date = parseMirrorDate(sourceRow.event_date);
    const name1 = String(sourceRow.red_fighter_name || '').trim();
    const name2 = String(sourceRow.blue_fighter_name || '').trim();
    const result1 = normalizeResult(sourceRow.red_fighter_result);
    const result2 = normalizeResult(sourceRow.blue_fighter_result);
    const division = String(sourceRow.bout_type || '').trim();
    if (!date || !name1 || !name2 || !division || !result1 || !result2) continue;
    rows.push({
      fight_link: stableFightId(sourceRow),
      date,
      name_1: name1,
      name_2: name2,
      win_loss_1: result1,
      win_loss_2: result2,
      division
    });
  }
  if (!rows.length) throw new Error('UFC DataLab source produced zero usable fights.');
  rows.sort((a, b) => a.date.localeCompare(b.date) || a.fight_link.localeCompare(b.fight_link));
  return rows;
}

export async function buildCurrentDepthCsv(options = {}) {
  const modelDate = parseMirrorDate(options.modelDate || new Date().toISOString().slice(0, 10));
  const sourceText = await fetchText(SOURCE_URL);
  const rows = buildRows(sourceText);
  const datasetStart = rows[0]?.date || null;
  const datasetEnd = rows.at(-1)?.date || null;
  const ageDays = datasetEnd
    ? (new Date(`${modelDate}T00:00:00Z`) - new Date(`${datasetEnd}T00:00:00Z`)) / 86_400_000
    : Number.POSITIVE_INFINITY;
  const csv = [
    OUTPUT_COLUMNS.join(','),
    ...rows.map(row => OUTPUT_COLUMNS.map(name => csvCell(row[name])).join(','))
  ].join('\n') + '\n';

  return {
    csv,
    metadata: {
      sourceUrl: SOURCE_URL,
      repository: SOURCE_REPOSITORY,
      sourceCommit: SOURCE_COMMIT,
      sourceFile: SOURCE_FILE,
      description: 'Pinned UFCStats-derived all-bouts mirror including decisive fights, draws, and no contests.',
      datasetFightCount: rows.length,
      datasetStart,
      datasetEnd,
      modelDate,
      ageDays,
      sourceFresh: Number.isFinite(ageDays) && ageDays >= 0 && ageDays <= 21,
      underlyingSource: 'UFCStats'
    }
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const output = process.argv[2];
  const result = await buildCurrentDepthCsv({ modelDate: process.env.UFC_MODEL_DATE || new Date() });
  if (output) await fs.writeFile(output, result.csv);
  console.log(JSON.stringify(result.metadata, null, 2));
}

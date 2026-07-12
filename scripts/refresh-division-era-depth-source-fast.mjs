import fs from 'node:fs/promises';

const HISTORICAL_SOURCE_URL = 'https://raw.githubusercontent.com/Yahlawat/UFC_Data_WEBSCRAPING/main/Data/wrangled_Data/wrangled_fight_details.csv';
const UFCSTATS_EVENTS_URL = 'https://ufcstats.com/statistics/events/completed?page=all';
const REQUIRED_COLUMNS = ['fight_link', 'date', 'name_1', 'name_2', 'win_loss_1', 'win_loss_2', 'division'];
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function decodeHtml(value) {
  return String(value || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function textContent(html) {
  return decodeHtml(String(html || '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function attrValue(attrs, name) {
  const match = String(attrs || '').match(new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i'));
  return decodeHtml(match?.[1] || match?.[2] || '');
}

function absoluteUfcStatsUrl(value) {
  const url = decodeHtml(value).trim();
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url.replace(/^http:/i, 'https:');
  return `https://ufcstats.com${url.startsWith('/') ? '' : '/'}${url}`;
}

function isoDate(value) {
  const date = value instanceof Date ? value : new Date(String(value || '').trim());
  return Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : null;
}

function csvCell(value) {
  const text = String(value ?? '');
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

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

async function fetchText(url, attempts = 5) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'text/html,application/xhtml+xml,text/csv;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache'
        }
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const text = await response.text();
      if (!text.trim()) throw new Error('empty response');
      return text;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await sleep(Math.min(8_000, 500 * (2 ** (attempt - 1))));
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new Error(`Failed to fetch ${url}: ${lastError?.message || lastError}`);
}

function historicalRows(csvText) {
  const parsed = parseCsv(csvText).filter(row => row.some(cell => String(cell || '').trim()));
  if (parsed.length < 2) throw new Error('Historical depth source is empty.');
  const header = parsed.shift();
  const positions = Object.fromEntries(header.map((name, index) => [String(name).trim(), index]));
  const missing = REQUIRED_COLUMNS.filter(name => positions[name] === undefined);
  if (missing.length) throw new Error(`Historical depth source is missing: ${missing.join(', ')}`);
  return parsed
    .map(values => Object.fromEntries(REQUIRED_COLUMNS.map(name => [name, values[positions[name]] ?? ''])))
    .filter(row => row.fight_link && isoDate(row.date))
    .map(row => ({ ...row, fight_link: absoluteUfcStatsUrl(row.fight_link), date: isoDate(row.date) }));
}

function rowBlocks(html) {
  const rows = [];
  const pattern = /<tr\b([^>]*)>([\s\S]*?)<\/tr>/gi;
  let match;
  while ((match = pattern.exec(html))) rows.push({ attrs: match[1] || '', html: match[2] || '' });
  return rows;
}

function eventDateFromRow(rowHtml) {
  const classMatch = rowHtml.match(/<(?:span|i)\b[^>]*class=(?:"[^"]*b-statistics__date[^"]*"|'[^']*b-statistics__date[^']*')[^>]*>([\s\S]*?)<\/(?:span|i)>/i);
  const classDate = isoDate(textContent(classMatch?.[1] || ''));
  if (classDate) return classDate;
  const text = textContent(rowHtml);
  const fallback = text.match(/\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+\d{1,2},\s+\d{4}\b/i);
  return isoDate(fallback?.[0] || '');
}

function completedEvents(html) {
  const events = [];
  const seen = new Set();
  for (const row of rowBlocks(html)) {
    const linkMatch = row.html.match(/href\s*=\s*(?:"([^"]*\/event-details\/[^"]+)"|'([^']*\/event-details\/[^']+)')/i);
    const url = absoluteUfcStatsUrl(linkMatch?.[1] || linkMatch?.[2] || attrValue(row.attrs, 'data-link'));
    if (!url.includes('/event-details/') || seen.has(url)) continue;
    const date = eventDateFromRow(row.html);
    if (!date) continue;
    seen.add(url);
    events.push({ url, date });
  }
  if (!events.length) {
    const title = textContent(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '');
    const snippet = textContent(html).slice(0, 600);
    throw new Error(`UFCStats completed-events page parsed zero completed events. bytes=${html.length}; title=${JSON.stringify(title)}; snippet=${JSON.stringify(snippet)}`);
  }
  return events.sort((a, b) => b.date.localeCompare(a.date));
}

function tagBlocks(html, tag) {
  const blocks = [];
  const pattern = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
  let match;
  while ((match = pattern.exec(html))) blocks.push(match[1]);
  return blocks;
}

function anchorTexts(html, needle = '') {
  const rows = [];
  const pattern = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const href = absoluteUfcStatsUrl(attrValue(match[1], 'href'));
    if (needle && !href.includes(needle)) continue;
    const text = textContent(match[2]);
    if (text) rows.push({ href, text });
  }
  return rows;
}

function resultFromCell(cell) {
  const text = textContent(cell).toUpperCase();
  if (/\bNC\b|NO CONTEST/.test(text)) return ['NC', 'NC'];
  if (/\bD\b|DRAW/.test(text)) return ['D', 'D'];
  if (/\bL\b/.test(text) && !/\bW\b/.test(text)) return ['L', 'W'];
  return ['W', 'L'];
}

function parseEventFights(html, event) {
  const fights = [];
  for (const row of rowBlocks(html)) {
    const hrefMatch = row.html.match(/href\s*=\s*(?:"([^"]*\/fight-details\/[^"]+)"|'([^']*\/fight-details\/[^']+)')/i);
    const fightLink = absoluteUfcStatsUrl(hrefMatch?.[1] || hrefMatch?.[2] || attrValue(row.attrs, 'data-link'));
    if (!fightLink.includes('/fight-details/')) continue;
    const cells = tagBlocks(row.html, 'td');
    if (cells.length < 7) continue;
    const fighters = anchorTexts(row.html, '/fighter-details/').slice(0, 2);
    if (fighters.length !== 2) continue;
    const division = textContent(tagBlocks(cells[6], 'p')[0] || cells[6]);
    const [result1, result2] = resultFromCell(cells[0]);
    fights.push({
      fight_link: fightLink,
      date: event.date,
      name_1: fighters[0].text,
      name_2: fighters[1].text,
      win_loss_1: result1,
      win_loss_2: result2,
      division,
      event_url: event.url
    });
  }
  if (!fights.length) {
    throw new Error(`UFCStats event parsed zero fights: ${event.url}; bytes=${html.length}; snippet=${JSON.stringify(textContent(html).slice(0, 400))}`);
  }
  return fights;
}

async function mapConcurrent(items, concurrency, mapper) {
  const output = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(concurrency, Math.max(1, items.length)) }, async () => {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      output[index] = await mapper(items[index], index);
    }
  });
  await Promise.all(workers);
  return output;
}

async function scrapeNewRows(cutoffDate, modelDate) {
  const eventsHtml = await fetchText(UFCSTATS_EVENTS_URL);
  const allEvents = completedEvents(eventsHtml);
  const events = allEvents.filter(event => event.date > cutoffDate && event.date <= modelDate);
  if (!events.length) return { events, fights: [], latestAvailable: allEvents[0]?.date || null };
  const cards = await mapConcurrent(events, 5, async event => parseEventFights(await fetchText(event.url), event));
  return { events, fights: cards.flat(), latestAvailable: allEvents[0]?.date || null };
}

export async function buildCurrentDepthCsv(options = {}) {
  const modelDate = isoDate(options.modelDate || new Date());
  const historicalText = await fetchText(options.historicalSourceUrl || HISTORICAL_SOURCE_URL);
  const baseRows = historicalRows(historicalText);
  const cutoffDate = baseRows.reduce((latest, row) => row.date > latest ? row.date : latest, '0000-00-00');
  const refresh = await scrapeNewRows(cutoffDate, modelDate);
  const byLink = new Map(baseRows.map(row => [row.fight_link, row]));
  refresh.fights.forEach(row => {
    byLink.set(row.fight_link, Object.fromEntries(REQUIRED_COLUMNS.map(name => [name, row[name] ?? ''])));
  });
  const rows = [...byLink.values()].sort((a, b) => a.date.localeCompare(b.date) || a.fight_link.localeCompare(b.fight_link));
  const csv = [
    REQUIRED_COLUMNS.join(','),
    ...rows.map(row => REQUIRED_COLUMNS.map(name => csvCell(row[name])).join(','))
  ].join('\n') + '\n';
  const datasetEnd = rows.at(-1)?.date || cutoffDate;
  const ageDays = (new Date(`${modelDate}T00:00:00Z`) - new Date(`${datasetEnd}T00:00:00Z`)) / 86_400_000;
  return {
    csv,
    metadata: {
      historicalSourceUrl: options.historicalSourceUrl || HISTORICAL_SOURCE_URL,
      liveSourceUrl: UFCSTATS_EVENTS_URL,
      historicalFightCount: baseRows.length,
      addedEventCount: refresh.events.length,
      addedFightCount: refresh.fights.length,
      datasetFightCount: rows.length,
      historicalCutoff: cutoffDate,
      latestAvailableEventDate: refresh.latestAvailable,
      datasetEnd,
      modelDate,
      ageDays,
      sourceFresh: datasetEnd >= modelDate || ageDays <= 21
    }
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const output = process.argv[2];
  const result = await buildCurrentDepthCsv({ modelDate: process.env.UFC_MODEL_DATE || new Date() });
  if (output) await fs.writeFile(output, result.csv);
  console.log(JSON.stringify(result.metadata, null, 2));
}

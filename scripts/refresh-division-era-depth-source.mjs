import fs from 'node:fs/promises';

const HISTORICAL_SOURCE_URL = 'https://raw.githubusercontent.com/Yahlawat/UFC_Data_WEBSCRAPING/main/Data/wrangled_Data/wrangled_fight_details.csv';
const UFCSTATS_EVENTS_URL = 'http://ufcstats.com/statistics/events/completed?page=all';
const USER_AGENT = 'Mozilla/5.0 (compatible; UFCGoatRankingsDepth/2.1; +https://github.com/codyking0602/ufc-goat-rankings)';
const REQUIRED_COLUMNS = ['fight_link', 'date', 'name_1', 'name_2', 'win_loss_1', 'win_loss_2', 'division'];

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

function isoDate(value) {
  const date = value instanceof Date ? value : new Date(String(value || '').trim());
  if (!Number.isFinite(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function attrValue(attrs, name) {
  const match = String(attrs || '').match(new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i'));
  return decodeHtml(match?.[1] || match?.[2] || '');
}

async function fetchText(url, attempts = 5) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,text/csv;q=0.9,*/*;q=0.8' }
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const text = await response.text();
      if (!text.trim()) throw new Error('empty response');
      return text;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await sleep(Math.min(8000, 500 * (2 ** (attempt - 1))));
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
  return parsed.map(values => Object.fromEntries(REQUIRED_COLUMNS.map(name => [name, values[positions[name]] ?? ''])))
    .filter(row => row.fight_link && isoDate(row.date))
    .map(row => ({ ...row, date: isoDate(row.date) }));
}

function completedEvents(html) {
  const events = [];
  const seen = new Set();
  const rowPattern = /<tr\b([^>]*)class=(?:"[^"]*b-statistics__table-row[^"]*"|'[^']*b-statistics__table-row[^']*')([^>]*)>([\s\S]*?)<\/tr>/gi;
  let match;
  while ((match = rowPattern.exec(html))) {
    const attrs = `${match[1] || ''} ${match[2] || ''}`;
    const block = match[3];
    const anchorMatch = block.match(/href=(?:"([^"]*\/event-details\/[^"]+)"|'([^']*\/event-details\/[^']+)')/i);
    const url = decodeHtml(anchorMatch?.[1] || anchorMatch?.[2] || attrValue(attrs, 'data-link'));
    if (!url || !url.includes('/event-details/') || seen.has(url)) continue;
    const dateMatch = block.match(/<span\b[^>]*class=(?:"[^"]*b-statistics__date[^"]*"|'[^']*b-statistics__date[^']*')[^>]*>([\s\S]*?)<\/span>/i);
    const date = isoDate(textContent(dateMatch?.[1] || ''));
    if (!date) continue;
    seen.add(url);
    events.push({ url, date });
  }
  if (!events.length) throw new Error('UFCStats completed-events page parsed zero completed events.');
  return events.sort((a, b) => b.date.localeCompare(a.date));
}

function tagBlocks(html, tag) {
  const blocks = [];
  const pattern = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
  let match;
  while ((match = pattern.exec(html))) blocks.push(match[1]);
  return blocks;
}

function anchorTexts(html, hrefNeedle = '') {
  const rows = [];
  const pattern = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const href = attrValue(match[1], 'href');
    if (hrefNeedle && !href.includes(hrefNeedle)) continue;
    const text = textContent(match[2]);
    if (text) rows.push({ href, text });
  }
  return rows;
}

function parseEventFights(html, event) {
  const fights = [];
  const rowPattern = /<tr\b([^>]*)class=(?:"[^"]*b-fight-details__table-row[^"]*"|'[^']*b-fight-details__table-row[^']*')([^>]*)>([\s\S]*?)<\/tr>/gi;
  let match;
  while ((match = rowPattern.exec(html))) {
    const attrs = `${match[1] || ''} ${match[2] || ''}`;
    const row = match[3];
    const cells = tagBlocks(row, 'td');
    if (cells.length < 7) continue;
    const cellFightAnchor = anchorTexts(cells[0], '/fight-details/')[0];
    const fightLink = cellFightAnchor?.href || attrValue(attrs, 'data-link');
    const fighterAnchors = anchorTexts(cells[1], '/fighter-details/').slice(0, 2);
    if (!fightLink || !fightLink.includes('/fight-details/') || fighterAnchors.length !== 2) continue;
    const division = textContent(tagBlocks(cells[6], 'p')[0] || cells[6]);
    const resultTokens = tagBlocks(cells[0], 'p').map(textContent).map(value => value.toUpperCase()).filter(Boolean);
    let results = ['W', 'L'];
    if (resultTokens.some(value => value.includes('NC'))) results = ['NC', 'NC'];
    else if (resultTokens.some(value => value === 'D' || value.includes('DRAW'))) results = ['D', 'D'];
    fights.push({
      fight_link: fightLink,
      date: event.date,
      name_1: fighterAnchors[0].text,
      name_2: fighterAnchors[1].text,
      win_loss_1: results[0],
      win_loss_2: results[1],
      division,
      event_url: event.url
    });
  }
  if (!fights.length) throw new Error(`UFCStats event parsed zero fights: ${event.url}`);
  return fights;
}

function fightDetailMeta(html) {
  const titleMatch = html.match(/<(?:i|span)\b[^>]*class=(?:"[^"]*b-fight-details__fight-title[^"]*"|'[^']*b-fight-details__fight-title[^']*')[^>]*>([\s\S]*?)<\/(?:i|span)>/i);
  const title = textContent(titleMatch?.[1] || '');
  const statuses = [];
  const statusPattern = /<i\b[^>]*class=(?:"[^"]*b-fight-details__person-status[^"]*"|'[^']*b-fight-details__person-status[^']*')[^>]*>([\s\S]*?)<\/i>/gi;
  let match;
  while ((match = statusPattern.exec(html))) {
    const value = textContent(match[1]).toUpperCase();
    if (value) statuses.push(value);
  }
  return { title, statuses: statuses.slice(0, 2) };
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
  if (!events.length) {
    const latestAvailable = allEvents[0]?.date || null;
    return { events, fights: [], latestAvailable };
  }
  const cards = await mapConcurrent(events, 4, async event => {
    const html = await fetchText(event.url);
    return parseEventFights(html, event);
  });
  const fights = cards.flat();
  const enriched = await mapConcurrent(fights, 6, async fight => {
    try {
      const html = await fetchText(fight.fight_link, 4);
      const meta = fightDetailMeta(html);
      const statuses = meta.statuses.length === 2 ? meta.statuses : [fight.win_loss_1, fight.win_loss_2];
      return {
        ...fight,
        win_loss_1: statuses[0] || fight.win_loss_1,
        win_loss_2: statuses[1] || fight.win_loss_2,
        division: /title bout/i.test(meta.title) ? meta.title : fight.division
      };
    } catch (error) {
      console.warn(`Fight detail fallback for ${fight.fight_link}: ${error.message}`);
      return fight;
    }
  });
  return { events, fights: enriched, latestAvailable: allEvents[0]?.date || null };
}

export async function buildCurrentDepthCsv(options = {}) {
  const modelDate = isoDate(options.modelDate || new Date());
  const historicalText = await fetchText(options.historicalSourceUrl || HISTORICAL_SOURCE_URL);
  const baseRows = historicalRows(historicalText);
  const cutoffDate = baseRows.reduce((latest, row) => row.date > latest ? row.date : latest, '0000-00-00');
  const refresh = await scrapeNewRows(cutoffDate, modelDate);
  const byLink = new Map(baseRows.map(row => [row.fight_link, row]));
  refresh.fights.forEach(row => byLink.set(row.fight_link, Object.fromEntries(REQUIRED_COLUMNS.map(name => [name, row[name] ?? '']))));
  const rows = [...byLink.values()].sort((a, b) => a.date.localeCompare(b.date) || a.fight_link.localeCompare(b.fight_link));
  const csv = [REQUIRED_COLUMNS.join(','), ...rows.map(row => REQUIRED_COLUMNS.map(name => csvCell(row[name])).join(','))].join('\n') + '\n';
  const datasetEnd = rows.at(-1)?.date || cutoffDate;
  const ageDays = (new Date(`${modelDate}T00:00:00Z`) - new Date(`${datasetEnd}T00:00:00Z`)) / 86400000;
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

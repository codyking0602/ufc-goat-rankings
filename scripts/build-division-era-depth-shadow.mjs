import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const SOURCE_URL = process.env.UFC_DEPTH_SOURCE_URL || 'https://raw.githubusercontent.com/Yahlawat/UFC_Data_WEBSCRAPING/main/Data/wrangled_Data/wrangled_fight_details.csv';
const SOURCE_REPO = 'Yahlawat/UFC_Data_WEBSCRAPING';
const SOURCE_FILE = 'Data/wrangled_Data/wrangled_fight_details.csv';
const VERSION = 'division-era-depth-shadow-20260712a-fight-network';
const ACTIVE_LOOKBACK_DAYS = 730;
const DIVERSITY_QUARTERS = 12;
const MODERN_LOOKBACK_YEARS = 6;
const REPLACEMENT_ELO = 1450;
const COMPONENT_WEIGHTS = { qualifiedActivePool: 0.30, ranksSixToFifteenElo: 0.50, contenderDiversity: 0.20 };
const FULL_ADJUSTMENT_SCALE = 30;
const FULL_ADJUSTMENT_FLOOR = -3;
const FULL_ADJUSTMENT_CEILING = 1;
const SENSITIVITY_SCALE = 20;
const SENSITIVITY_FLOOR = -2;
const SENSITIVITY_CEILING = 0.75;

const round = (value, digits = 2) => {
  const factor = 10 ** digits;
  return Math.round((Number(value || 0) + Number.EPSILON) * factor) / factor;
};
const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value || 0)));
const median = values => {
  const clean = values.map(Number).filter(Number.isFinite).sort((a, b) => a - b);
  if (!clean.length) return 0;
  const middle = Math.floor(clean.length / 2);
  return clean.length % 2 ? clean[middle] : (clean[middle - 1] + clean[middle]) / 2;
};
const mean = values => {
  const clean = values.map(Number).filter(Number.isFinite);
  return clean.length ? clean.reduce((sum, value) => sum + value, 0) / clean.length : 0;
};
const normalizeName = value => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[’‘`´]/g, "'")
  .toLowerCase()
  .replace(/\bjunior\b/g, 'jr')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ');

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
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

function divisionCode(label) {
  const text = String(label || '').toLowerCase();
  if (!text || text.includes('catch weight') || text.includes('catchweight')) return null;
  if (text.includes("women's strawweight")) return 'WSW';
  if (text.includes("women's flyweight")) return 'WFLW';
  if (text.includes("women's bantamweight")) return 'WBW';
  if (text.includes("women's featherweight")) return 'WFW';
  if (text.includes('light heavyweight')) return 'LHW';
  if (text.includes('heavyweight')) return 'HW';
  if (text.includes('middleweight')) return 'MW';
  if (text.includes('welterweight')) return 'WW';
  if (text.includes('lightweight')) return 'LW';
  if (text.includes('featherweight')) return 'FW';
  if (text.includes('bantamweight')) return 'BW';
  if (text.includes('flyweight')) return 'FLW';
  if (text.includes('strawweight')) return 'WSW';
  return null;
}

function primaryDivision(appDivision) {
  const aliases = {
    HW: 'HW', LHW: 'LHW', MW: 'MW', WW: 'WW', LW: 'LW', FW: 'FW', FTW: 'FW', BW: 'BW', FLW: 'FLW',
    WBW: 'WBW', WFLW: 'WFLW', WFW: 'WFW', WSW: 'WSW', SW: 'WSW'
  };
  for (const raw of String(appDivision || '').split('/')) {
    const token = raw.trim().toUpperCase();
    if (aliases[token]) return aliases[token];
  }
  return null;
}

function isoDate(date) {
  return date instanceof Date && Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : null;
}
function parseDate(value) {
  const date = new Date(`${String(value || '').slice(0, 10)}T00:00:00Z`);
  return Number.isFinite(date.getTime()) ? date : null;
}
function daysBetween(later, earlier) {
  return (later.getTime() - earlier.getTime()) / 86400000;
}
function quarterKey(date) {
  const quarter = Math.floor(date.getUTCMonth() / 3) + 1;
  return `${date.getUTCFullYear()}-Q${quarter}`;
}
function quarterEndDates(minDate, maxDate) {
  const dates = [];
  for (let year = minDate.getUTCFullYear(); year <= maxDate.getUTCFullYear(); year += 1) {
    for (const month of [2, 5, 8, 11]) {
      const date = new Date(Date.UTC(year, month + 1, 0));
      if (date >= minDate && date <= maxDate) dates.push(date);
    }
  }
  if (!dates.length || dates.at(-1) < maxDate) dates.push(maxDate);
  return dates;
}
function expectedScore(ratingA, ratingB) {
  return 1 / (1 + (10 ** ((ratingB - ratingA) / 400)));
}
function resultFor(row) {
  const one = String(row.winLoss1 || '').trim().toUpperCase();
  const two = String(row.winLoss2 || '').trim().toUpperCase();
  if (one === 'W' && two === 'L') return 1;
  if (one === 'L' && two === 'W') return 0;
  if (one === 'D' || two === 'D') return 0.5;
  return null;
}
function findSnapshot(snapshotMap, division, date) {
  const snapshots = snapshotMap.get(division) || [];
  if (!snapshots.length) return null;
  let candidate = snapshots[0];
  for (const snapshot of snapshots) {
    if (snapshot.date <= date) candidate = snapshot;
    else break;
  }
  return candidate;
}
function componentRatio(value, baseline, floor = 0.55, ceiling = 1.15) {
  if (!(baseline > 0)) return 1;
  return clamp(value / baseline, floor, ceiling);
}
function eloComponentRatio(value, baseline) {
  const numerator = Math.max(1, value - REPLACEMENT_ELO);
  const denominator = Math.max(1, baseline - REPLACEMENT_ELO);
  return clamp(numerator / denominator, 0.55, 1.15);
}

async function downloadSource() {
  const response = await fetch(SOURCE_URL, {
    headers: { 'User-Agent': 'ufc-goat-rankings-era-depth-shadow/1.0', Accept: 'text/csv,*/*' }
  });
  if (!response.ok) throw new Error(`Failed to download fight dataset: ${response.status} ${response.statusText}`);
  return response.text();
}

function buildFightRows(csvText) {
  const parsed = parseCsv(csvText);
  if (parsed.length < 2) throw new Error('Fight dataset is empty.');
  const header = parsed.shift();
  const positions = Object.fromEntries(header.map((name, index) => [name, index]));
  const required = ['fight_link', 'date', 'name_1', 'name_2', 'win_loss_1', 'win_loss_2', 'division'];
  const missing = required.filter(name => positions[name] === undefined);
  if (missing.length) throw new Error(`Fight dataset is missing columns: ${missing.join(', ')}`);
  const seen = new Set();
  const fights = [];
  for (const values of parsed) {
    const link = values[positions.fight_link];
    if (!link || seen.has(link)) continue;
    seen.add(link);
    const date = parseDate(values[positions.date]);
    const fighter1 = values[positions.name_1];
    const fighter2 = values[positions.name_2];
    const divisionLabel = values[positions.division];
    if (!date || !fighter1 || !fighter2) continue;
    fights.push({
      link,
      date,
      fighter1,
      fighter2,
      fighter1Key: normalizeName(fighter1),
      fighter2Key: normalizeName(fighter2),
      winLoss1: values[positions.win_loss_1],
      winLoss2: values[positions.win_loss_2],
      divisionLabel,
      division: divisionCode(divisionLabel),
      titleFight: /title bout/i.test(String(divisionLabel || '')),
      result1: null
    });
  }
  fights.forEach(fight => { fight.result1 = resultFor(fight); });
  fights.sort((a, b) => a.date - b.date || a.link.localeCompare(b.link));
  return fights;
}

function buildSnapshots(fights) {
  const divisions = ['HW', 'LHW', 'MW', 'WW', 'LW', 'FW', 'BW', 'FLW', 'WBW', 'WFLW', 'WSW', 'WFW'];
  const ratings = new Map(divisions.map(code => [code, new Map()]));
  const lastFight = new Map(divisions.map(code => [code, new Map()]));
  const divisionFightDates = new Map(divisions.map(code => [code, []]));
  const overallFightCount = new Map();
  const snapshots = new Map(divisions.map(code => [code, []]));
  const topHistory = new Map(divisions.map(code => [code, []]));
  const minDate = fights[0].date;
  const maxDate = fights.at(-1).date;
  const quarterDates = quarterEndDates(minDate, maxDate);
  let cursor = 0;

  const ensureRating = (division, fighter) => {
    const table = ratings.get(division);
    if (!table.has(fighter)) table.set(fighter, 1500);
    return table.get(fighter);
  };

  const processFight = fight => {
    overallFightCount.set(fight.fighter1Key, (overallFightCount.get(fight.fighter1Key) || 0) + 1);
    overallFightCount.set(fight.fighter2Key, (overallFightCount.get(fight.fighter2Key) || 0) + 1);
    if (!fight.division) return;
    lastFight.get(fight.division).set(fight.fighter1Key, fight.date);
    lastFight.get(fight.division).set(fight.fighter2Key, fight.date);
    divisionFightDates.get(fight.division).push(fight.date);
    const rating1 = ensureRating(fight.division, fight.fighter1Key);
    const rating2 = ensureRating(fight.division, fight.fighter2Key);
    if (fight.result1 === null) return;
    const k = fight.titleFight ? 30 : 24;
    const expected1 = expectedScore(rating1, rating2);
    const delta = k * (fight.result1 - expected1);
    ratings.get(fight.division).set(fight.fighter1Key, rating1 + delta);
    ratings.get(fight.division).set(fight.fighter2Key, rating2 - delta);
  };

  for (const snapshotDate of quarterDates) {
    while (cursor < fights.length && fights[cursor].date <= snapshotDate) {
      processFight(fights[cursor]);
      cursor += 1;
    }
    for (const division of divisions) {
      const active = [...ratings.get(division).entries()]
        .filter(([fighter]) => {
          const last = lastFight.get(division).get(fighter);
          return (overallFightCount.get(fighter) || 0) >= 2 && last && daysBetween(snapshotDate, last) <= ACTIVE_LOOKBACK_DAYS;
        })
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
      const top15 = active.slice(0, 15).map(([fighter]) => fighter);
      const history = topHistory.get(division);
      history.push({ date: snapshotDate, top15 });
      const recentHistory = history.slice(-DIVERSITY_QUARTERS);
      const diversity = new Set(recentHistory.flatMap(entry => entry.top15)).size;
      const depthRatings = [];
      for (let rank = 6; rank <= 15; rank += 1) {
        depthRatings.push(active[rank - 1]?.[1] ?? REPLACEMENT_ELO);
      }
      const trailingFightCount = divisionFightDates.get(division)
        .filter(date => date <= snapshotDate && daysBetween(snapshotDate, date) <= 365.25).length;
      snapshots.get(division).push({
        date: snapshotDate,
        dateIso: isoDate(snapshotDate),
        quarter: quarterKey(snapshotDate),
        division,
        qualifiedActivePool: active.length,
        ranksSixToFifteenElo: mean(depthRatings),
        contenderDiversity: diversity,
        trailingTwelveMonthFightCount: trailingFightCount,
        top15
      });
    }
  }
  return { snapshots, minDate, maxDate, fightCount: fights.length };
}

function addDepthIndexes(snapshotMap, maxDate) {
  const baselines = {};
  const modernStartYear = maxDate.getUTCFullYear() - MODERN_LOOKBACK_YEARS;
  for (const [division, snapshots] of snapshotMap.entries()) {
    let candidates = snapshots.filter(snapshot => snapshot.date.getUTCFullYear() >= modernStartYear && snapshot.qualifiedActivePool >= 6);
    if (candidates.length < 8) candidates = snapshots.filter(snapshot => snapshot.qualifiedActivePool >= 6).slice(-24);
    if (!candidates.length) candidates = snapshots.filter(snapshot => snapshot.qualifiedActivePool >= 3).slice(-16);
    if (!candidates.length) candidates = snapshots.slice(-8);
    const baseline = {
      division,
      start: candidates[0]?.dateIso || null,
      end: candidates.at(-1)?.dateIso || null,
      sampleCount: candidates.length,
      qualifiedActivePool: median(candidates.map(row => row.qualifiedActivePool)),
      ranksSixToFifteenElo: median(candidates.map(row => row.ranksSixToFifteenElo)),
      contenderDiversity: median(candidates.map(row => row.contenderDiversity)),
      trailingTwelveMonthFightCount: median(candidates.map(row => row.trailingTwelveMonthFightCount))
    };
    baselines[division] = baseline;
    for (const snapshot of snapshots) {
      const poolRatio = componentRatio(snapshot.qualifiedActivePool, baseline.qualifiedActivePool);
      const eloRatio = eloComponentRatio(snapshot.ranksSixToFifteenElo, baseline.ranksSixToFifteenElo);
      const diversityRatio = componentRatio(snapshot.contenderDiversity, baseline.contenderDiversity);
      snapshot.componentRatios = {
        qualifiedActivePool: round(poolRatio, 4),
        ranksSixToFifteenElo: round(eloRatio, 4),
        contenderDiversity: round(diversityRatio, 4)
      };
      snapshot.depthIndex = round(clamp(
        (poolRatio * COMPONENT_WEIGHTS.qualifiedActivePool) +
        (eloRatio * COMPONENT_WEIGHTS.ranksSixToFifteenElo) +
        (diversityRatio * COMPONENT_WEIGHTS.contenderDiversity),
        0.75,
        1.05
      ), 4);
    }
  }
  return baselines;
}

function fighterFightMap(fights) {
  const map = new Map();
  const add = (key, fight) => {
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(fight);
  };
  fights.forEach(fight => {
    add(fight.fighter1Key, fight);
    add(fight.fighter2Key, fight);
  });
  return map;
}

function scoreFighters(feed, fights, snapshotMap, maxDate) {
  const byFighter = fighterFightMap(fights);
  const results = [];
  const datasetEnd = maxDate;
  for (const fighter of feed.fighters || []) {
    const fighterKey = normalizeName(fighter.name);
    const start = parseDate(fighter.primeWindowDetail?.start) || parseDate(fighter.primeWindow?.split('→')?.[0]) || fights[0].date;
    const explicitEnd = parseDate(fighter.primeWindowDetail?.end);
    const end = explicitEnd || datasetEnd;
    const primary = primaryDivision(fighter.division);
    const matched = (byFighter.get(fighterKey) || []).filter(fight => fight.date >= start && fight.date <= end);
    const samples = [];
    for (const fight of matched) {
      const division = fight.division || primary;
      const snapshot = division ? findSnapshot(snapshotMap, division, fight.date) : null;
      if (!snapshot) continue;
      samples.push({
        date: isoDate(fight.date),
        division,
        titleFight: fight.titleFight,
        weight: fight.titleFight ? 1.5 : 1,
        depthIndex: snapshot.depthIndex,
        componentRatios: snapshot.componentRatios,
        snapshotQuarter: snapshot.quarter,
        source: 'matched-prime-fight'
      });
    }
    const activePastDataset = !explicitEnd || end > datasetEnd;
    if (activePastDataset && primary) {
      const latest = (snapshotMap.get(primary) || []).at(-1);
      if (latest) samples.push({
        date: latest.dateIso,
        division: primary,
        titleFight: false,
        weight: 1,
        depthIndex: latest.depthIndex,
        componentRatios: latest.componentRatios,
        snapshotQuarter: latest.quarter,
        source: 'open-prime-terminal-modern-snapshot'
      });
    }
    let fallback = false;
    if (!samples.length && primary) {
      fallback = true;
      const safeEnd = end > datasetEnd ? datasetEnd : end;
      const midpoint = new Date((start.getTime() + safeEnd.getTime()) / 2);
      const snapshot = findSnapshot(snapshotMap, primary, midpoint) || (snapshotMap.get(primary) || []).at(-1);
      if (snapshot) samples.push({
        date: snapshot.dateIso,
        division: primary,
        titleFight: false,
        weight: 1,
        depthIndex: snapshot.depthIndex,
        componentRatios: snapshot.componentRatios,
        snapshotQuarter: snapshot.quarter,
        source: 'prime-midpoint-fallback'
      });
    }
    const totalWeight = samples.reduce((sum, sample) => sum + sample.weight, 0) || 1;
    const weighted = key => samples.reduce((sum, sample) => sum + (Number(sample[key] || 0) * sample.weight), 0) / totalWeight;
    const weightedComponent = key => samples.reduce((sum, sample) => sum + (Number(sample.componentRatios?.[key] || 0) * sample.weight), 0) / totalWeight;
    const depthIndex = round(weighted('depthIndex'), 4);
    const shadowAdjustment = round(clamp((depthIndex - 1) * FULL_ADJUSTMENT_SCALE, FULL_ADJUSTMENT_FLOOR, FULL_ADJUSTMENT_CEILING), 2);
    const sensitivityAdjustment = round(clamp((depthIndex - 1) * SENSITIVITY_SCALE, SENSITIVITY_FLOOR, SENSITIVITY_CEILING), 2);
    results.push({
      fighter: fighter.name,
      group: fighter.group,
      currentRank: Number(fighter.rank),
      currentOvr: Number(fighter.appOvr),
      currentTotal: Number(fighter.totalScore),
      primeStart: isoDate(start),
      primeEnd: explicitEnd ? isoDate(explicitEnd) : null,
      openPrime: !explicitEnd,
      primaryDivision: primary,
      sampledDivisions: [...new Set(samples.map(sample => sample.division).filter(Boolean))],
      matchedPrimeFightCount: matched.length,
      scoredSampleCount: samples.length,
      titleWeightedSampleCount: samples.filter(sample => sample.titleFight).length,
      fallback,
      depthIndex,
      componentRatios: {
        qualifiedActivePool: round(weightedComponent('qualifiedActivePool'), 4),
        ranksSixToFifteenElo: round(weightedComponent('ranksSixToFifteenElo'), 4),
        contenderDiversity: round(weightedComponent('contenderDiversity'), 4)
      },
      shadowAdjustment,
      sensitivityAdjustment,
      shadowTotal: round(Number(fighter.totalScore) + shadowAdjustment, 2),
      sensitivityTotal: round(Number(fighter.totalScore) + sensitivityAdjustment, 2),
      samples
    });
  }

  for (const group of ['men', 'women']) {
    const groupRows = results.filter(row => row.group === group);
    const full = [...groupRows].sort((a, b) => b.shadowTotal - a.shadowTotal || a.fighter.localeCompare(b.fighter));
    const sensitivity = [...groupRows].sort((a, b) => b.sensitivityTotal - a.sensitivityTotal || a.fighter.localeCompare(b.fighter));
    full.forEach((row, index) => { row.shadowRank = index + 1; row.rankMovement = row.currentRank - row.shadowRank; });
    sensitivity.forEach((row, index) => { row.sensitivityRank = index + 1; row.sensitivityRankMovement = row.currentRank - row.sensitivityRank; });
  }
  return results.sort((a, b) => a.group.localeCompare(b.group) || a.currentRank - b.currentRank);
}

function summarize(fighters) {
  const concernNames = ['Matt Hughes', 'Jose Aldo', 'Junior dos Santos', 'Chuck Liddell', 'Tito Ortiz', 'Georges St-Pierre', 'Anderson Silva', 'Demetrious Johnson'];
  const movers = [...fighters].sort((a, b) => Math.abs(b.rankMovement) - Math.abs(a.rankMovement) || a.currentRank - b.currentRank);
  return {
    rosterCount: fighters.length,
    coverageCount: fighters.filter(row => row.scoredSampleCount > 0).length,
    fallbackCount: fighters.filter(row => row.fallback).length,
    negativeAdjustmentCount: fighters.filter(row => row.shadowAdjustment < 0).length,
    positiveAdjustmentCount: fighters.filter(row => row.shadowAdjustment > 0).length,
    neutralAdjustmentCount: fighters.filter(row => row.shadowAdjustment === 0).length,
    averageDepthIndex: round(mean(fighters.map(row => row.depthIndex)), 4),
    averageAdjustment: round(mean(fighters.map(row => row.shadowAdjustment)), 2),
    largestNegativeAdjustments: [...fighters].sort((a, b) => a.shadowAdjustment - b.shadowAdjustment).slice(0, 15).map(compactFighter),
    largestPositiveAdjustments: [...fighters].sort((a, b) => b.shadowAdjustment - a.shadowAdjustment).slice(0, 10).map(compactFighter),
    largestRankMovers: movers.slice(0, 20).map(compactFighter),
    concernGroup: concernNames.map(name => compactFighter(fighters.find(row => row.fighter === name))).filter(Boolean)
  };
}
function compactFighter(row) {
  if (!row) return null;
  return {
    fighter: row.fighter,
    group: row.group,
    currentRank: row.currentRank,
    shadowRank: row.shadowRank,
    rankMovement: row.rankMovement,
    currentTotal: row.currentTotal,
    depthIndex: row.depthIndex,
    shadowAdjustment: row.shadowAdjustment,
    shadowTotal: row.shadowTotal,
    componentRatios: row.componentRatios,
    matchedPrimeFightCount: row.matchedPrimeFightCount,
    fallback: row.fallback
  };
}

async function main() {
  const feedPath = path.join(ROOT, 'assets/data/octagon-verdict-data.json');
  const feed = JSON.parse(await fs.readFile(feedPath, 'utf8'));
  const expectedRosterCount = (feed.fighters || []).length;
  const csvText = await downloadSource();
  const fights = buildFightRows(csvText);
  const snapshotBuild = buildSnapshots(fights);
  const baselines = addDepthIndexes(snapshotBuild.snapshots, snapshotBuild.maxDate);
  const fighters = scoreFighters(feed, fights, snapshotBuild.snapshots, snapshotBuild.maxDate);
  const report = {
    version: VERSION,
    generatedAt: new Date().toISOString(),
    mode: 'shadow-only',
    mutatesLiveScores: false,
    source: {
      url: SOURCE_URL,
      repository: SOURCE_REPO,
      file: SOURCE_FILE,
      description: 'UFCStats-derived fight-level dataset containing date, participants, result, and division.',
      datasetFightCount: snapshotBuild.fightCount,
      datasetStart: isoDate(snapshotBuild.minDate),
      datasetEnd: isoDate(snapshotBuild.maxDate),
      sourceLicense: 'MIT repository; UFCStats is the underlying statistical source.'
    },
    methodology: {
      purpose: 'Measure competitive depth within each UFC division over time without using a generic old-versus-new penalty.',
      snapshotCadence: 'Quarterly',
      activePoolDefinition: `At least two UFC appearances through the snapshot and a fight in the division during the prior ${ACTIVE_LOOKBACK_DAYS} days.`,
      components: {
        qualifiedActivePool: { weight: COMPONENT_WEIGHTS.qualifiedActivePool, description: 'Number of qualified active fighters in the division.' },
        ranksSixToFifteenElo: { weight: COMPONENT_WEIGHTS.ranksSixToFifteenElo, description: 'Mean division-specific Elo strength for ranks 6–15, with empty slots filled at replacement Elo.' },
        contenderDiversity: { weight: COMPONENT_WEIGHTS.contenderDiversity, description: `Unique fighters appearing in the top 15 over the trailing ${DIVERSITY_QUARTERS} quarterly snapshots.` }
      },
      elo: { startingRating: 1500, regularFightK: 24, titleFightK: 30, noContestsIgnored: true, drawsScore: 0.5 },
      baseline: `Each division is normalized to its own most recent ${MODERN_LOOKBACK_YEARS}-year mature window; sparse divisions use their most recent valid snapshots. This isolates era depth from the app's separate division-strength treatment.`,
      fighterSampling: 'Every UFC fight inside the app’s canonical prime window is sampled at the division’s nearest prior quarterly depth snapshot. Title fights receive 1.5× weight. Open primes receive one terminal modern snapshot.',
      fullAdjustmentFormula: `clamp((depthIndex - 1.00) × ${FULL_ADJUSTMENT_SCALE}, ${FULL_ADJUSTMENT_FLOOR}, +${FULL_ADJUSTMENT_CEILING})`,
      sensitivityFormula: `clamp((depthIndex - 1.00) × ${SENSITIVITY_SCALE}, ${SENSITIVITY_FLOOR}, +${SENSITIVITY_CEILING})`,
      caveats: [
        'The external fight dataset may end before the app’s latest 2026 results; open primes therefore receive the latest available modern snapshot.',
        'Elo is a depth proxy, not a claim that athletes from one era were inherently more skilled.',
        'The output is shadow-only and must not mutate live category scores, ranks, or OVRs.'
      ]
    },
    baselines,
    summary: summarize(fighters),
    fighters
  };
  if (report.summary.rosterCount !== expectedRosterCount || report.summary.coverageCount !== expectedRosterCount) {
    throw new Error(`Depth shadow coverage failure: ${report.summary.coverageCount}/${report.summary.rosterCount}.`);
  }
  const docsDir = path.join(ROOT, 'docs');
  const dataDir = path.join(ROOT, 'assets/data');
  await fs.mkdir(docsDir, { recursive: true });
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(path.join(docsDir, 'division-era-depth-shadow-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  const runtime = {
    version: report.version,
    generatedAt: report.generatedAt,
    mode: report.mode,
    mutatesLiveScores: false,
    source: report.source,
    methodology: report.methodology,
    baselines: report.baselines,
    summary: report.summary,
    fighters: report.fighters.map(row => ({
      fighter: row.fighter,
      group: row.group,
      currentRank: row.currentRank,
      currentOvr: row.currentOvr,
      currentTotal: row.currentTotal,
      shadowRank: row.shadowRank,
      rankMovement: row.rankMovement,
      shadowTotal: row.shadowTotal,
      depthIndex: row.depthIndex,
      shadowAdjustment: row.shadowAdjustment,
      sensitivityRank: row.sensitivityRank,
      sensitivityRankMovement: row.sensitivityRankMovement,
      sensitivityAdjustment: row.sensitivityAdjustment,
      componentRatios: row.componentRatios,
      matchedPrimeFightCount: row.matchedPrimeFightCount,
      scoredSampleCount: row.scoredSampleCount,
      fallback: row.fallback,
      sampledDivisions: row.sampledDivisions,
      primeStart: row.primeStart,
      primeEnd: row.primeEnd,
      openPrime: row.openPrime
    }))
  };
  const js = `// Full-roster Division-Era Depth Index. Shadow only; never mutates live scores.\n(function(){\n  'use strict';\n  const SHADOW=${JSON.stringify(runtime)};\n  window.UFC_DIVISION_ERA_DEPTH_SHADOW=SHADOW;\n  document.documentElement.setAttribute('data-division-era-depth-shadow',SHADOW.version);\n  window.dispatchEvent(new CustomEvent('ufc-division-era-depth-shadow-ready',{detail:SHADOW}));\n})();\n`;
  await fs.writeFile(path.join(dataDir, 'division-era-depth-shadow.js'), js);
  console.log(JSON.stringify({
    version: report.version,
    rosterCount: report.summary.rosterCount,
    coverageCount: report.summary.coverageCount,
    fallbackCount: report.summary.fallbackCount,
    datasetFightCount: report.source.datasetFightCount,
    datasetEnd: report.source.datasetEnd,
    concernGroup: report.summary.concernGroup
  }, null, 2));
}

main().catch(error => {
  console.error(error?.stack || error);
  process.exitCode = 1;
});

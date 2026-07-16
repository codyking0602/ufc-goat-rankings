#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const EXPECTED_FIGHTERS = 76;
const VALIDATION_FIGHTERS = [
  'Jon Jones',
  'Georges St-Pierre',
  'Demetrious Johnson',
  'Anderson Silva',
  'Khabib Nurmagomedov',
  'Alexander Volkanovski',
  'Islam Makhachev',
  'Jose Aldo',
  'Alexandre Pantoja',
  'Cain Velasquez',
  'Francis Ngannou'
];

const CORE_SOURCE_FILES = [
  'assets/data/ranking-data.js',
  'assets/data/display-overrides.js',
  'assets/data/canonical-fighter-facts.js',
  'assets/data/canonical-fighter-facts-batch-one.js',
  'assets/data/canonical-fighter-facts-batch-two.js',
  'assets/data/canonical-fighter-facts-batch-three.js',
  'assets/data/canonical-fighter-facts-batch-four.js',
  'assets/data/canonical-fighter-facts-batch-five.js',
  'assets/data/canonical-fighter-facts-batch-six.js',
  'assets/data/canonical-fighter-facts-batch-seven-data-a.js',
  'assets/data/canonical-fighter-facts-batch-seven-data-b.js',
  'assets/data/canonical-fighter-facts-batch-seven.js',
  'assets/data/canonical-fighter-facts-batch-eight-data-a.js',
  'assets/data/canonical-fighter-facts-batch-eight-data-b.js',
  'assets/data/canonical-fighter-facts-batch-eight.js',
  'assets/data/canonical-fighter-facts-batch-nine-data-a.js',
  'assets/data/canonical-fighter-facts-batch-nine-data-b.js',
  'assets/data/canonical-fighter-facts-batch-nine-data-c.js',
  'assets/data/canonical-fighter-facts-batch-nine.js',
  'assets/data/canonical-fighter-facts-approved-corrections.js',
  'assets/data/canonical-fighter-facts-opponent-quality-corrections.js',
  'assets/data/canonical-fighter-facts-prime-round-corrections.js',
  'assets/data/fighter-era-ledgers.js',
  'assets/data/fighter-era-ledger-approved-longevity-resolutions.js',
  'assets/data/fighter-era-ledger-approved-loss-context-resolutions.js',
  'assets/data/division-era-depth-shadow.js',
  'assets/data/canonical-division-era-depth-approved-resolutions.js',
  'assets/data/canonical-scoring-judgments.js',
  'assets/data/canonical-opponent-quality-audit-adjustments.js',
  'assets/data/canonical-championship-audit-adjustments.js',
  'assets/js/category-calculators.js',
  'assets/data/canonical-roster-batch-ten.js',
  'assets/js/ranking-pipeline.js',
  'assets/js/octagon-verdict-data.js',
  'assets/data/canonical-woodley-audit-adjustments.js'
];

const SCORE_CATEGORY_KEYS = ['championship', 'opponentQuality', 'primeDominance', 'longevity'];
const UNDISPUTED_TYPES = new Set(['normal', 'vacant-undisputed', 'second-division-undisputed', 'vacant-second-division']);

function parseArgs(argv) {
  const options = {
    output: path.join(ROOT, 'octagon-verdict-knowledge.md'),
    jsonOutput: path.join(ROOT, 'octagon-verdict-data.json'),
    validateOnly: false
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--output') options.output = path.resolve(ROOT, argv[++index]);
    else if (arg === '--json-output') options.jsonOutput = path.resolve(ROOT, argv[++index]);
    else if (arg === '--validate-only') options.validateOnly = true;
    else if (arg === '--no-json') options.jsonOutput = null;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

function createBrowserContext() {
  const listeners = new Map();
  const attributes = new Map();
  const documentListeners = new Map();
  const element = () => ({
    dataset: {},
    style: {},
    children: [],
    setAttribute(name, value) { this[name] = String(value); },
    getAttribute(name) { return this[name] ?? null; },
    addEventListener() {},
    removeEventListener() {},
    appendChild(child) { this.children.push(child); return child; },
    insertBefore(child) { this.children.push(child); return child; },
    remove() {},
    click() {},
    querySelector() { return null; },
    querySelectorAll() { return []; }
  });
  const document = {
    readyState: 'complete',
    documentElement: {
      setAttribute(name, value) { attributes.set(name, String(value)); },
      getAttribute(name) { return attributes.get(name) ?? null; }
    },
    body: element(),
    head: element(),
    createElement: element,
    getElementById() { return null; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    write() {},
    addEventListener(type, handler) {
      if (!documentListeners.has(type)) documentListeners.set(type, []);
      documentListeners.get(type).push(handler);
    },
    dispatchEvent(event) {
      for (const handler of documentListeners.get(event?.type) || []) handler.call(document, event);
      return true;
    }
  };

  class CustomEvent {
    constructor(type, init = {}) {
      this.type = type;
      this.detail = init.detail;
    }
  }

  const sandbox = {
    console,
    document,
    CustomEvent,
    setTimeout,
    clearTimeout,
    queueMicrotask,
    URL,
    URLSearchParams,
    TextEncoder,
    TextDecoder,
    Blob,
    navigator: { clipboard: null, userAgent: 'octagon-verdict-generator' },
    location: { href: 'https://codyking0602.github.io/ufc-goat-rankings/' }
  };
  const context = vm.createContext(sandbox);
  context.window = context;
  context.self = context;
  context.globalThis = context;
  context.addEventListener = (type, handler, options = {}) => {
    if (!listeners.has(type)) listeners.set(type, []);
    listeners.get(type).push({ handler, once: Boolean(options?.once) });
  };
  context.removeEventListener = (type, handler) => {
    listeners.set(type, (listeners.get(type) || []).filter(entry => entry.handler !== handler));
  };
  context.dispatchEvent = event => {
    const entries = [...(listeners.get(event?.type) || [])];
    for (const entry of entries) {
      entry.handler.call(context, event);
      if (entry.once) context.removeEventListener(event.type, entry.handler);
    }
    return true;
  };
  context.open = () => null;
  context.refresh = () => {};
  context.UFC_PRODUCTION_RANKING_BOOTSTRAP = { syncComparePresentation() {} };
  context.COMPARE_PROFILES = {};
  context.COMPARE_FIGHT_LEDGER = {};
  return context;
}

function runFile(context, relativePath) {
  const absolutePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(absolutePath)) throw new Error(`Missing source file: ${relativePath}`);
  const code = fs.readFileSync(absolutePath, 'utf8');
  vm.runInContext(code, context, { filename: relativePath, timeout: 60_000 });
  if (relativePath === 'assets/data/display-overrides.js') {
    vm.runInContext("window.DISPLAY_OVERRIDES = typeof DISPLAY_OVERRIDES !== 'undefined' ? DISPLAY_OVERRIDES : {};", context);
  }
}

function buildRuntime() {
  const context = createBrowserContext();
  const beforePipeline = CORE_SOURCE_FILES.indexOf('assets/js/ranking-pipeline.js');
  CORE_SOURCE_FILES.slice(0, beforePipeline + 1).forEach(file => runFile(context, file));

  const report = context.UFC_RANKING_PIPELINE.apply();
  context.document.documentElement.setAttribute('data-scoring-pipeline', 'ready');

  runFile(context, 'assets/js/octagon-verdict-data.js');
  context.UFC_OCTAGON_VERDICT_DATA.build();
  runFile(context, 'assets/data/canonical-woodley-audit-adjustments.js');
  const woodleyAudit = context.UFC_APPLY_WOODLEY_AUDIT();
  context.UFC_OCTAGON_VERDICT_DATA.build();

  return { context, report, woodleyAudit };
}

function round(value, digits = 2) {
  const factor = 10 ** digits;
  const result = Math.round((Number(value || 0) + Number.EPSILON) * factor) / factor;
  return Object.is(result, -0) ? 0 : result;
}

function fmt(value, digits = 2) {
  if (value === null || value === undefined || value === '' || !Number.isFinite(Number(value))) return '—';
  return Number(value).toFixed(digits).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
}

function signed(value, digits = 2) {
  const number = Number(value || 0);
  return `${number > 0 ? '+' : ''}${fmt(number, digits)}`;
}

function pct(value, digits = 1) {
  return Number.isFinite(Number(value)) ? `${fmt(value, digits)}%` : '—';
}

function text(value, fallback = '—') {
  const normalized = String(value ?? '').replace(/\s+/g, ' ').trim();
  return normalized || fallback;
}

function tableText(value) {
  return text(value).replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function markdownTable(headers, rows) {
  if (!rows.length) return '_No rows._\n';
  return [
    `| ${headers.map(tableText).join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map(row => `| ${row.map(tableText).join(' | ')} |`)
  ].join('\n') + '\n';
}

function headingId(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function recordFor(runtime, fighter) {
  return runtime.context.UFC_CANONICAL_FIGHTER_FACTS.get(fighter);
}

function eraFor(runtime, fighter) {
  const api = runtime.context.UFC_FIGHTER_ERA_LEDGERS;
  return api?.entryFor?.(fighter) || api?.ledgers?.[fighter] || null;
}

function traceFor(runtime, fighter) {
  return runtime.context.UFC_CATEGORY_CALCULATORS.entryFor(fighter);
}

function resolutionFor(runtime, fighter) {
  return runtime.context.UFC_CANONICAL_DIVISION_ERA_DEPTH_APPROVED_RESOLUTIONS?.entryFor?.(fighter) || null;
}

function titleSummary(record) {
  const wins = (record?.fights || []).filter(fight => fight?.scoringDisposition === 'count-win' && fight?.championshipContext?.fighterEligible !== false);
  return {
    undisputedWins: wins.filter(fight => UNDISPUTED_TYPES.has(fight?.championshipContext?.type)).length,
    interimWins: wins.filter(fight => fight?.championshipContext?.type === 'interim').length,
    titleFightWins: wins.filter(fight => fight?.championshipContext?.type !== 'none' && fight?.championshipContext?.type !== 'tournament').length
  };
}

function calculateOvr(totalScore, board, rank, projection) {
  const config = projection.ovr;
  const anchors = config.anchors[board] || config.anchors.men;
  const normalized = Math.max(0, Math.min(1, (Number(totalScore) - Number(anchors.floorScore)) / (Number(anchors.ceilingScore) - Number(anchors.floorScore))));
  const curved = Math.pow(normalized, Number(config.curve));
  let ovr = Math.max(config.floor, Math.min(config.ceiling, Math.round(config.floor + curved * (config.ceiling - config.floor))));
  if (config.leaderOnly99 && Number(rank) > 1 && ovr === config.ceiling) ovr = config.ceiling - 1;
  return { ovr, normalized, curved, anchors };
}

function weightedRecalculation(row, projection) {
  const weights = projection.weights;
  const contributions = {
    championship: round((Number(row.championship || 0) / projection.categoryMax) * weights.championship),
    opponentQuality: round((Number(row.opponentQuality || 0) / projection.categoryMax) * weights.opponentQuality),
    primeDominance: round((Number(row.primeDominance || 0) / projection.categoryMax) * weights.primeDominance),
    longevity: round((Number(row.longevity || 0) / projection.categoryMax) * weights.longevity)
  };
  const baseScore = round(Object.values(contributions).reduce((sum, value) => sum + value, 0));
  const totalScore = round(baseScore + Number(row.apexPeak || 0) + Number(row.penalty || 0) + Number(row.eraDepthAdjustment || 0));
  return { contributions, baseScore, totalScore };
}

function categoryRank(rows, fighter, field) {
  const row = rows.find(entry => entry.fighter === fighter);
  if (!row) return null;
  return 1 + rows.filter(entry => Number(entry[field] || 0) > Number(row[field] || 0)).length;
}

function fallbackWhyRanked(row, boardRows, recalculated) {
  const strengths = [
    ['Championship', recalculated.contributions.championship],
    ['Opponent Quality', recalculated.contributions.opponentQuality],
    ['Prime Dominance', recalculated.contributions.primeDominance],
    ['Longevity', recalculated.contributions.longevity]
  ].sort((a, b) => b[1] - a[1]);
  return `${row.fighter} ranks #${row.rank} because ${strengths[0][0]} and ${strengths[1][0]} provide the largest weighted parts of a ${fmt(row.totalScore)} raw model score. The placement is calculated from the full UFC-only board, not manually assigned.`;
}

function fallbackWhyNotHigher(row, boardRows) {
  if (Number(row.rank) === 1) return 'Jones is the current benchmark. The main pressure points are close decisions, inactivity, and late-career heavyweight sample size, but no fighter currently passes his total UFC-only model score.';
  const fighterIndex = boardRows.findIndex(entry => entry.fighter === row.fighter);
  const above = fighterIndex > 0 ? boardRows[fighterIndex - 1] : null;
  const gap = above ? round(Number(above.totalScore) - Number(row.totalScore)) : null;
  const categoryGaps = SCORE_CATEGORY_KEYS.map(key => ({ key, gap: round(Number(above?.[key] || 0) - Number(row[key] || 0)) })).sort((a, b) => b.gap - a.gap);
  const label = { championship: 'Championship', opponentQuality: 'Opponent Quality', primeDominance: 'Prime Dominance', longevity: 'Longevity' }[categoryGaps[0]?.key] || 'total score';
  return above ? `${row.fighter} is ${fmt(gap)} raw points behind #${above.rank} ${above.fighter}. The largest category separation versus that next target is currently ${label}; future movement must be earned through new UFC evidence and a full pipeline rerun.` : 'The fighters above have a stronger total combination of title work, quality wins, prime dominance, longevity, and loss context.';
}

function sourceVersionRows(runtime) {
  const w = runtime.context;
  return [
    ['Canonical fighter facts', w.UFC_CANONICAL_FIGHTER_FACTS?.version],
    ['Fighter-era ledgers', w.UFC_FIGHTER_ERA_LEDGERS?.version],
    ['Scoring judgments', w.UFC_CANONICAL_SCORING_JUDGMENTS?.version],
    ['Opponent Quality adjustments', w.UFC_CANONICAL_OPPONENT_QUALITY_AUDIT_ADJUSTMENTS?.version],
    ['Championship adjustments', w.UFC_CANONICAL_CHAMPIONSHIP_AUDIT_ADJUSTMENTS?.version],
    ['Category calculators', w.UFC_CATEGORY_CALCULATORS?.version],
    ['Ranking pipeline', w.UFC_RANKING_PIPELINE?.version],
    ['Octagon Verdict JSON view', w.UFC_OCTAGON_VERDICT_DATA?.version],
    ['Woodley audit', w.UFC_CANONICAL_WOODLEY_AUDIT_ADJUSTMENTS?.version]
  ];
}

function validateRuntime(runtime) {
  const w = runtime.context;
  const projection = w.UFC_CALCULATED_RANKING_PROJECTION;
  assert.ok(projection, 'Calculated ranking projection was not created.');
  assert.equal(runtime.report?.fighterCount, EXPECTED_FIGHTERS, 'Ranking pipeline fighter count mismatch.');
  assert.equal(w.UFC_CANONICAL_FIGHTER_FACTS.count(), EXPECTED_FIGHTERS, 'Canonical fighter count mismatch.');
  assert.equal(w.UFC_CATEGORY_CALCULATORS.audit().passed, true, 'Category calculator audit is blocked.');
  assert.equal(w.UFC_CATEGORY_CALCULATORS.audit().completeFighterCount, EXPECTED_FIGHTERS, 'Not every fighter has seven complete calculated categories.');
  assert.equal(w.UFC_CANONICAL_ROSTER_BATCH_TEN?.passed, true, 'Batch-ten roster audit failed.');
  assert.equal(w.UFC_CANONICAL_WOODLEY_AUDIT_ADJUSTMENTS?.passed, true, 'Woodley audit failed.');

  const rows = [...projection.men, ...projection.women];
  assert.equal(rows.length, EXPECTED_FIGHTERS, 'Projection row count mismatch.');
  for (const row of rows) {
    const recalculated = weightedRecalculation(row, projection);
    assert.ok(Math.abs(recalculated.totalScore - Number(row.totalScore)) <= 0.011, `${row.fighter}: total score does not reconcile.`);
    const ovr = calculateOvr(row.totalScore, row.board, row.rank, projection).ovr;
    assert.equal(ovr, Number(row.overallOvr), `${row.fighter}: OVR does not reconcile.`);
    const trace = traceFor(runtime, row.fighter);
    assert.equal(trace?.status, 'complete', `${row.fighter}: category trace is incomplete.`);
  }

  for (const fighter of VALIDATION_FIGHTERS) {
    assert.ok(projection.entryFor(fighter), `Missing validation fighter: ${fighter}`);
    assert.ok(recordFor(runtime, fighter), `Missing canonical record: ${fighter}`);
    assert.equal(traceFor(runtime, fighter)?.status, 'complete', `Incomplete validation trace: ${fighter}`);
  }

  const jones = projection.entryFor('Jon Jones');
  assert.equal(jones.rank, 1, 'Jon Jones is not the current men’s #1.');
  assert.equal(jones.overallOvr, 99, 'Jon Jones is not the 99 OVR benchmark.');
  assert.ok(traceFor(runtime, 'Alexandre Pantoja')?.traces?.opponentQuality?.inputs?.length > 0, 'Pantoja Opponent Quality receipts are missing.');
  assert.ok(traceFor(runtime, 'Anderson Silva')?.traces?.penalty?.events?.length > 0, 'Anderson Silva loss receipts are missing.');

  return {
    passed: true,
    fighterCount: rows.length,
    validatedFighters: VALIDATION_FIGHTERS,
    jones: { rank: jones.rank, overallOvr: jones.overallOvr, totalScore: jones.totalScore }
  };
}

function buildFighterPayload(runtime, row, boardRows) {
  const record = recordFor(runtime, row.fighter);
  const derived = runtime.context.UFC_CANONICAL_FIGHTER_FACTS.deriveFor(row.fighter);
  const trace = traceFor(runtime, row.fighter);
  const era = eraFor(runtime, row.fighter);
  const override = runtime.context.DISPLAY_OVERRIDES?.[row.fighter] || {};
  const compare = runtime.context.COMPARE_PROFILES?.[row.fighter] || override.compareProfile || {};
  const resolution = resolutionFor(runtime, row.fighter);
  const recalculated = weightedRecalculation(row, runtime.context.UFC_CALCULATED_RANKING_PROJECTION);
  const titles = titleSummary(record);
  return {
    row,
    record,
    derived,
    trace,
    era,
    override,
    compare,
    resolution,
    recalculated,
    titles,
    categoryRanks: {
      championship: categoryRank(boardRows, row.fighter, 'championship'),
      opponentQuality: categoryRank(boardRows, row.fighter, 'opponentQuality'),
      primeDominance: categoryRank(boardRows, row.fighter, 'primeDominance'),
      longevity: categoryRank(boardRows, row.fighter, 'longevity')
    }
  };
}

function fighterMarkdown(runtime, payload) {
  const { row, record, derived, trace, era, override, compare, resolution, recalculated, titles, categoryRanks } = payload;
  const projection = runtime.context.UFC_CALCULATED_RANKING_PROJECTION;
  const ovr = calculateOvr(row.totalScore, row.board, row.rank, projection);
  const championship = trace.traces.championship;
  const quality = trace.traces.opponentQuality;
  const prime = trace.traces.primeDominance;
  const longevity = trace.traces.longevity;
  const penalty = trace.traces.penalty;
  const apex = trace.traces.apex;
  const eraDepth = trace.traces.eraDepth;
  const divisions = [row.primaryDivision, row.secondaryDivision].filter(Boolean).join(' / ') || record?.identity?.primaryDivision || '—';
  const whyRanked = override.whyRankedHere || fallbackWhyRanked(row, row.board === 'women' ? projection.women : projection.men, recalculated);
  const whyNotHigher = Number(row.rank) === 1
    ? (override.whyNotLower || fallbackWhyNotHigher(row, row.board === 'women' ? projection.women : projection.men))
    : (override.whyNotHigher || fallbackWhyNotHigher(row, row.board === 'women' ? projection.women : projection.men));
  const primeWindow = `${text(era?.window?.startLabel || prime?.stats?.eraStartDate)} → ${text(era?.window?.endLabel || (prime?.stats?.open ? 'active' : prime?.stats?.eraEndDate))}`;

  const lines = [];
  lines.push(`### ${row.rank}. ${row.fighter} — ${row.overallOvr} OVR`);
  lines.push('');
  lines.push(text(override.oneLiner || compare.shortCase || `${row.fighter} is ranked from the current UFC-only calculated pipeline.`));
  lines.push('');
  lines.push(markdownTable(
    ['Board', 'Raw score', 'UFC record', 'Division(s)', 'Title-fight wins', 'Adjusted title wins', 'Top-5 wins', 'Prime record', 'Rounds won', 'Elite years'],
    [[row.board, fmt(row.totalScore), row.ufcRecord, divisions, row.titleFightWins, fmt(row.adjustedTitleWins), row.topFiveWins, row.primeRecord, pct(row.roundsWonPct), fmt(row.activeEliteYears)]]
  ).trimEnd());
  lines.push('');
  lines.push('#### Exact model math');
  lines.push('');
  lines.push(markdownTable(
    ['Component', 'Category value', 'Weight', 'Weighted contribution'],
    [
      ['Championship', fmt(row.championship), '35', fmt(recalculated.contributions.championship)],
      ['Opponent Quality', fmt(row.opponentQuality), '25', fmt(recalculated.contributions.opponentQuality)],
      ['Prime Dominance', fmt(row.primeDominance), '30', fmt(recalculated.contributions.primeDominance)],
      ['Longevity', fmt(row.longevity), '10', fmt(recalculated.contributions.longevity)]
    ]
  ).trimEnd());
  lines.push('');
  lines.push(`Base score: **${fmt(recalculated.baseScore)}**. Modifiers: Apex **${signed(row.apexPeak)}**, Loss Penalty **${signed(row.penalty)}**, Division-Era Depth **${signed(row.eraDepthAdjustment)}**. Final raw score: **${fmt(row.totalScore)}**.`);
  lines.push('');
  lines.push(`OVR conversion: board anchors **${fmt(ovr.anchors.floorScore)}–${fmt(ovr.anchors.ceilingScore)}**, normalized score **${fmt(ovr.normalized, 4)}**, curved score **${fmt(ovr.curved, 4)}**, resulting in **${row.overallOvr} OVR**. Only the board leader may receive 99.`);
  lines.push('');

  lines.push('#### Category breakdown');
  lines.push('');
  lines.push(markdownTable(
    ['Category', 'Score', 'Board rank', 'Primary receipt'],
    [
      ['Championship', fmt(row.championship), `#${categoryRanks.championship}`, `${fmt(championship.adjustedTitleCredit)} adjusted credit / ${fmt(championship.benchmarkCredit)} benchmark`],
      ['Opponent Quality', fmt(row.opponentQuality), `#${categoryRanks.opponentQuality}`, `${fmt(quality.diminishedCredit)} diminished credit / ${fmt(quality.benchmarkCredit)} benchmark`],
      ['Prime Dominance', fmt(row.primeDominance), `#${categoryRanks.primeDominance}`, `${fmt(prime.stats.rawScore)} raw × ${pct(prime.stats.samplePercent)} sample`],
      ['Longevity', fmt(row.longevity), `#${categoryRanks.longevity}`, `${fmt(longevity.stats.countedEliteMonths)} counted elite months`],
      ['Apex modifier', signed(row.apexPeak), 'Modifier', text(apex.notes, 'Two approved peak performances plus proof/aura components')],
      ['Loss penalty', signed(row.penalty), 'Modifier', `${penalty.events.length} official/technical loss events reviewed`],
      ['Division-era depth', signed(row.eraDepthAdjustment), 'Modifier', text(resolution?.decision || eraDepth.source)]
    ]
  ).trimEnd());
  lines.push('');

  lines.push('#### Championship receipts');
  lines.push('');
  lines.push(`UFC title-fight wins: **${row.titleFightWins}**. Adjusted title wins: **${fmt(row.adjustedTitleWins)}**. Derived undisputed-title win count: **${titles.undisputedWins}**. Interim-title win count: **${titles.interimWins}**.`);
  lines.push('');
  lines.push(markdownTable(
    ['Date', 'Opponent', 'Title type', 'Base', 'Opponent strength', 'Final adjusted credit', 'Review note'],
    (championship.inputs || []).map(input => [input.date, input.opponent, input.titleType || input.canonicalTitleType, fmt(input.baseCredit), fmt(input.opponentStrength), fmt(input.finalAdjustedCredit), input.notes || input.note || input.reviewStatus])
  ).trimEnd());
  lines.push('');

  lines.push('#### Opponent Quality receipts');
  lines.push('');
  lines.push(`Raw win credit: **${fmt(quality.rawCredit)}**. Diminishing-return credit before fighter adjustment: **${fmt(quality.preAdjustmentDiminishedCredit)}**. Fighter adjustment: **${signed(quality.fighterAdjustment)}**. Final diminished credit: **${fmt(quality.diminishedCredit)}**.`);
  lines.push('');
  lines.push(markdownTable(
    ['Slot', 'Date', 'Opponent', 'Base/final credit', 'Slot rate', 'Counted credit', 'Context'],
    (quality.inputs || []).map(input => [input.slot, input.date, input.opponent, fmt(input.finalCredit), fmt(input.countedRate), fmt(input.countedCredit), input.note || input.notes || input.adjustments?.map(item => item.note || item.type).join('; ') || input.reviewStatus])
  ).trimEnd());
  lines.push('');

  lines.push('#### Prime Dominance receipts');
  lines.push('');
  lines.push(`Prime window: **${primeWindow}**. Prime record: **${row.primeRecord}**. Effective samples: **${prime.stats.effectivePrimeSampleCount}**. Sample multiplier: **${pct(prime.stats.samplePercent)}**.`);
  lines.push('');
  lines.push(markdownTable(
    ['Prime component', 'Score', 'Evidence'],
    [
      ['Prime record', fmt(prime.stats.components.primeRecord), `${prime.stats.wins}-${prime.stats.losses}${prime.stats.draws ? `-${prime.stats.draws}` : ''}; ${pct(prime.stats.recordPct)}`],
      ['Round control', fmt(prime.stats.components.roundControl), `${pct(prime.stats.roundControlPct)}; rounds ${fmt(prime.stats.roundsWon)}-${fmt(prime.stats.roundsLost)}`],
      ['Finish pressure', fmt(prime.stats.components.finishPressure), `${prime.stats.finishWins} finishes; ${pct(prime.stats.finishPressurePct)}`],
      ['Elite-level validation', fmt(prime.stats.components.eliteLevelValidation), `${prime.stats.eliteLevelValidation.fightCount} elite-stage fights; ${fmt(prime.stats.eliteLevelValidation.score)} points`],
      ['Raw prime score', fmt(prime.stats.rawScore), 'Before sample multiplier'],
      ['Final Prime Dominance', fmt(row.primeDominance), `${fmt(prime.stats.rawScore)} × ${fmt(prime.stats.sampleMultiplier)}`]
    ]
  ).trimEnd());
  lines.push('');
  if (prime.stats.missingRoundRows?.length) {
    lines.push(`Round-data limitation: ${prime.stats.missingRoundRows.map(item => item.opponent || item.fightId).join(', ')} do not have audited round allocation.`);
    lines.push('');
  }

  lines.push('#### Longevity receipts');
  lines.push('');
  lines.push(`Active elite years: **${fmt(row.activeEliteYears)}**. Raw calendar months: **${fmt(longevity.stats.rawCalendarMonths)}**. Gap-adjusted months: **${fmt(longevity.stats.gapAdjustedMonths)}**. Status multiplier: **${fmt(longevity.stats.statusMultiplier)}**. Division multiplier: **${fmt(longevity.stats.divisionMultiplier)}**. Counted elite months: **${fmt(longevity.stats.countedEliteMonths)}**.`);
  lines.push('');
  const cappedIntervals = (longevity.stats.intervals || []).filter(interval => interval.capped);
  if (cappedIntervals.length) {
    lines.push(markdownTable(
      ['From', 'To', 'Raw months', 'Counted months', 'Reason'],
      cappedIntervals.map(interval => [interval.fromDate, interval.toDate, fmt(interval.rawMonths), fmt(interval.countedMonths), interval.type === 'open-window-tail' ? 'Open-window tail capped at 18 months' : 'Between-fight gap capped at 18 months'])
    ).trimEnd());
    lines.push('');
  }

  lines.push('#### Loss-penalty receipts');
  lines.push('');
  lines.push(`The fight-level rules create raw loss events. The final category then compresses those events through severity, frequency, and a prime-loss volume floor. Exposure: **${penalty.exposure}** fights. Severity: **${fmt(penalty.severity)}**. Frequency: **${fmt(penalty.frequency)}**. Prime-volume floor: **${fmt(penalty.primeVolumeFloor)}**. Pre-division magnitude: **${fmt(penalty.preDivision)}**. Final penalty: **${signed(row.penalty)}**.`);
  lines.push('');
  lines.push(markdownTable(
    ['Date', 'Opponent', 'Phase', 'Quality', 'Division', 'Finished', 'Competitive', 'Raw event penalty', 'Special rule'],
    (penalty.events || []).map(event => [event.date, event.opponent, event.phase, event.qualityTier, event.divisionContext, event.finished ? 'Yes' : 'No', event.competitive ? 'Yes' : 'No', signed(event.rawPenalty), event.overrideRule || (event.technicalException ? 'technical exception / no penalty' : 'standard rule')])
  ).trimEnd());
  lines.push('');

  lines.push('#### Division-strength context');
  lines.push('');
  lines.push(`Default division key: **${text(record?.divisionStrength?.defaultKey)}**. Era-ledger division multiplier: **${fmt(era?.longevity?.divisionMultiplier)}**. Division-era modifier: **${signed(row.eraDepthAdjustment)}**.`);
  lines.push('');
  lines.push(text(record?.divisionStrength?.note || era?.longevity?.adjustmentNote || resolution?.decision, 'No additional division note.'));
  lines.push('');

  lines.push('#### Key judgment calls');
  lines.push('');
  if (override.keyJudgmentCalls?.length) {
    for (const [label, explanation] of override.keyJudgmentCalls) lines.push(`- **${text(label)}:** ${text(explanation)}`);
  } else {
    lines.push(`- **Prime window:** ${primeWindow}.`);
    lines.push(`- **Coverage:** ${text(record?.coverage?.note, 'Complete UFC-only ledger.')}`);
    lines.push(`- **Loss endpoint:** ${text(era?.window?.endReason, 'Defined by the shared fighter-era ledger.')}`);
  }
  lines.push('');

  lines.push('#### Why ranked here');
  lines.push('');
  lines.push(text(whyRanked));
  lines.push('');
  lines.push(`#### ${Number(row.rank) === 1 ? 'Why not ranked lower?' : 'Why not ranked higher?'}`);
  lines.push('');
  lines.push(text(whyNotHigher));
  lines.push('');
  if (compare.counter || compare.edge) {
    lines.push('#### Compare-mode guidance');
    lines.push('');
    if (compare.counter) lines.push(`- **Best counterargument:** ${text(compare.counter)}`);
    if (compare.edge) lines.push(`- **Why this résumé can still win:** ${text(compare.edge)}`);
    lines.push('');
  }
  lines.push('#### Final takeaway');
  lines.push('');
  lines.push(text(override.finalTakeaway || compare.shortCase || whyRanked));
  lines.push('');
  lines.push(`_Source IDs: ${record?.coverage?.verifiedThrough ? `fighter ledger verified through ${record.coverage.verifiedThrough}; ` : ''}score owner ${row.overallScoreOwner}; category owner ${row.scoreInputOwner}._`);
  lines.push('');
  return lines.join('\n');
}

function buildKnowledge(runtime, validation) {
  const w = runtime.context;
  const projection = w.UFC_CALCULATED_RANKING_PROJECTION;
  const facts = w.UFC_CANONICAL_FIGHTER_FACTS.list();
  const generatedAt = new Date().toISOString();
  const maxVerifiedThrough = facts.map(record => record?.coverage?.verifiedThrough).filter(Boolean).sort().at(-1) || null;
  const rows = [...projection.men, ...projection.women];
  const payloads = rows.map(row => buildFighterPayload(runtime, row, row.board === 'women' ? projection.women : projection.men));
  const missingRoundFighters = payloads.filter(payload => payload.trace?.traces?.primeDominance?.stats?.missingRoundRows?.length).map(payload => payload.row.fighter);
  const missingWhyRanked = payloads.filter(payload => !payload.override?.whyRankedHere).map(payload => payload.row.fighter);
  const missingWhyNotHigher = payloads.filter(payload => Number(payload.row.rank) !== 1 && !payload.override?.whyNotHigher).map(payload => payload.row.fighter);
  const missingCompare = payloads.filter(payload => !payload.compare || !Object.keys(payload.compare).length).map(payload => payload.row.fighter);
  const noUndisputed = payloads.filter(payload => payload.row.board === 'men' && payload.titles.undisputedWins === 0).sort((a, b) => a.row.rank - b.row.rank);
  const bestNoUndisputed = noUndisputed[0] || null;
  const bestPrimeOutsideTop10 = payloads.filter(payload => payload.row.board === 'men' && payload.row.rank > 10).sort((a, b) => b.row.primeDominance - a.row.primeDominance)[0] || null;
  const cain = projection.entryFor('Cain Velasquez');
  const ngannou = projection.entryFor('Francis Ngannou');
  const islam = projection.entryFor('Islam Makhachev');
  const gsp = projection.entryFor('Georges St-Pierre');

  const lines = [];
  lines.push('# Octagon Verdict — Official UFC-Only Knowledge Pack');
  lines.push('');
  lines.push(`Generated: **${generatedAt}**  `);
  lines.push(`Canonical model-as-of date: **${w.UFC_CANONICAL_FIGHTER_FACTS.modelAsOfDate}**  `);
  lines.push(`Latest fighter-ledger verification date: **${maxVerifiedThrough || '—'}**  `);
  lines.push(`Fighters: **${rows.length}**`);
  lines.push('');
  lines.push('> This file is generated from the live repository’s calculated scoring pipeline. It is the knowledge source for Octagon Verdict. Do not replace calculated values with legacy score patches, visible UI percentiles, memory, or non-UFC achievements.');
  lines.push('');

  lines.push('## 1. Purpose and scope');
  lines.push('');
  lines.push('Octagon Verdict explains and debates the same UFC-only rankings shown by the live app. It must distinguish three things: **model fact**, **documented judgment call**, and **opinion/inference**. Model facts come from the calculated pipeline and its fight-level receipts. Judgment calls come from approved canonical classifications and presentation notes. Anything else must be labeled as opinion.');
  lines.push('');

  lines.push('## 2. Source architecture');
  lines.push('');
  lines.push('### Authoritative score path');
  lines.push('');
  lines.push('1. `canonical-fighter-facts*.js` owns official UFC fight ledgers, quality tiers, title contexts, prime windows, round audits, and loss classifications.');
  lines.push('2. `fighter-era-ledgers.js` plus approved resolutions owns shared prime/longevity windows and loss endpoints.');
  lines.push('3. `canonical-scoring-judgments.js` plus approved Opponent Quality and Championship adjustments owns judgment inputs—not final category totals.');
  lines.push('4. `category-calculators.js` reconstructs Championship, Opponent Quality, Prime Dominance, Longevity, Loss Penalty, Apex, and Division-Era Depth.');
  lines.push('5. `ranking-pipeline.js` applies weights, modifiers, board ranks, visible stats, and fixed-anchor OVRs.');
  lines.push('6. `display-overrides.js` supplies human-facing explanations and judgment copy, but does not own scores.');
  lines.push('7. `octagon-verdict-data.js` is a thin runtime JSON projection. This Markdown generator expands it with the underlying receipts.');
  lines.push('');
  lines.push('### Legacy compare warning');
  lines.push('');
  lines.push('`assets/data/compare-profiles.js` still points to legacy compare packs. Some of those packs contain old `RANKING_DATA` score patches. They are narrative history, not score authority, and this generator intentionally does **not** execute them. Current comparisons must use calculated pipeline values plus canonical evidence.');
  lines.push('');
  lines.push(markdownTable(['Layer', 'Version'], sourceVersionRows(runtime)).trimEnd());
  lines.push('');

  lines.push('## 3. UFC-only rules');
  lines.push('');
  lines.push('- Score official UFC achievements only. Pride, Strikeforce, WEC, ONE, Bellator, Cage Warriors, regional titles, and TUF exhibitions may be mentioned only as context.');
  lines.push('- Official no contests are excluded from scored wins/losses.');
  lines.push('- Technical and weird results keep their official record status but may be classified as non-competitive or technical exceptions. Jon Jones’s Matt Hamill DQ is not a real competitive loss.');
  lines.push('- Prime windows are fighter-specific and controlled by canonical facts plus shared era ledgers.');
  lines.push('- Long inactivity gaps are capped at 18 months, so calendar time away does not inflate longevity.');
  lines.push('- When a question’s premise conflicts with the current data, correct the premise before debating it.');
  lines.push('');

  lines.push('## 4. Scoring model');
  lines.push('');
  lines.push(markdownTable(
    ['Category', 'Raw range', 'Final weight', 'What it rewards'],
    [
      ['Championship', '0–30', '35', 'Adjusted UFC title-fight wins and title-opponent context'],
      ['Opponent Quality', '0–30', '25', 'Quality of UFC wins with diminishing returns and fighter-specific adjustments'],
      ['Prime Dominance', '0–30', '30', 'Prime record, round control, finish pressure, elite-stage validation, and sample strength'],
      ['Longevity', '0–30', '10', 'Gap-adjusted active elite months with status and division multipliers'],
      ['Apex', '0–6', 'Direct modifier', 'Two best approved UFC performances, proof, best-fighter claim, and aura'],
      ['Loss Penalty', '0 to -6', 'Direct modifier', 'Contextual loss burden after event rules and aggregate compression'],
      ['Division-Era Depth', 'Approved adjustment', 'Direct modifier', 'Approved division/era depth context']
    ]
  ).trimEnd());
  lines.push('');
  lines.push('**Raw total formula**');
  lines.push('');
  lines.push('`Total = Championship/30×35 + OpponentQuality/30×25 + PrimeDominance/30×30 + Longevity/30×10 + Apex + LossPenalty + DivisionEraDepth`');
  lines.push('');

  lines.push('## 5. OVR versus raw score');
  lines.push('');
  lines.push(`Raw score decides rank. OVR is a front-end presentation conversion with a floor of **${projection.ovr.floor}**, a ceiling of **${projection.ovr.ceiling}**, a curve exponent of **${projection.ovr.curve}**, fixed board anchors, and a leader-only 99 rule. Men use ${fmt(projection.ovr.anchors.men.floorScore)}–${fmt(projection.ovr.anchors.men.ceilingScore)} anchors; women use ${fmt(projection.ovr.anchors.women.floorScore)}–${fmt(projection.ovr.anchors.women.ceilingScore)}. OVR is not an extra scoring category and must never be added back into the raw total.`);
  lines.push('');

  lines.push('## 6. Loss-penalty rules');
  lines.push('');
  lines.push(markdownTable(
    ['Situation', 'Raw event rule'],
    [
      ['Pre-prime loss to champion/top-five', '-0.75'],
      ['Pre-prime loss to non-elite', '-1.25'],
      ['Prime loss to champion/top-five', '-1.50'],
      ['Prime loss to non-elite', '-4.00'],
      ['Finished in counted loss', 'extra -0.75'],
      ['Post-prime loss', '0'],
      ['Prime upward-division loss to champion/top-five', '-0.75'],
      ['Finished upward-division vs champion/top-five', 'extra -0.50']
    ]
  ).trimEnd());
  lines.push('');
  lines.push('Important: the current calculator does not simply add every raw event forever. It converts the event ledger into a final penalty using the worst-loss severity, loss frequency relative to exposure, and a prime-loss volume floor; the final magnitude is capped at 6 and can receive a limited division-strength discount. Fighter cards below show both the raw events and the final aggregate calculation.');
  lines.push('');

  lines.push('## 7. Division-strength framework');
  lines.push('');
  lines.push('Division strength is implemented through fighter-specific canonical keys, era-ledger multipliers, and approved Division-Era Depth adjustments. Defaults are guidance, not blind universal constants. Modern lightweight usually receives the strongest positive context; GSP-era welterweight and modern featherweight are positive; modern bantamweight is around neutral; Anderson-era middleweight and late Jones LHW/HW are modestly discounted; Demetrious Johnson-era flyweight receives a larger discount. Use each fighter’s receipts below instead of substituting a generic multiplier.');
  lines.push('');

  lines.push('## 8. Current all-time leaderboard');
  lines.push('');
  lines.push('### Men');
  lines.push('');
  lines.push(markdownTable(
    ['Rank', 'Fighter', 'OVR', 'Raw', 'Champ', 'OQ', 'Prime', 'Long', 'Apex', 'Penalty', 'Era'],
    projection.men.map(row => [row.rank, row.fighter, row.overallOvr, fmt(row.totalScore), fmt(row.championship), fmt(row.opponentQuality), fmt(row.primeDominance), fmt(row.longevity), signed(row.apexPeak), signed(row.penalty), signed(row.eraDepthAdjustment)])
  ).trimEnd());
  lines.push('');
  lines.push('### Women');
  lines.push('');
  lines.push(markdownTable(
    ['Rank', 'Fighter', 'OVR', 'Raw', 'Champ', 'OQ', 'Prime', 'Long', 'Apex', 'Penalty', 'Era'],
    projection.women.map(row => [row.rank, row.fighter, row.overallOvr, fmt(row.totalScore), fmt(row.championship), fmt(row.opponentQuality), fmt(row.primeDominance), fmt(row.longevity), signed(row.apexPeak), signed(row.penalty), signed(row.eraDepthAdjustment)])
  ).trimEnd());
  lines.push('');

  lines.push('## 9. Query indexes');
  lines.push('');
  lines.push(`- **Highest-ranked men’s fighter with no derived undisputed UFC title win:** ${bestNoUndisputed ? `#${bestNoUndisputed.row.rank} ${bestNoUndisputed.row.fighter} (${bestNoUndisputed.row.overallOvr} OVR)` : 'none'}. Treat “better fighter” as a separate opinion question.`);
  lines.push(`- **Best Prime Dominance score outside the men’s top 10:** ${bestPrimeOutsideTop10 ? `#${bestPrimeOutsideTop10.row.rank} ${bestPrimeOutsideTop10.row.fighter}, ${fmt(bestPrimeOutsideTop10.row.primeDominance)}` : 'none'}.`);
  lines.push(`- **Islam-to-GSP current raw-score gap:** ${fmt(Number(gsp.totalScore) - Number(islam.totalScore))} points. Passing GSP requires a full scenario rerun, not merely adding that number to one category.`);
  lines.push(`- **Cain vs Ngannou current ordering:** ${cain.rank < ngannou.rank ? `Cain is currently ahead (#${cain.rank} vs #${ngannou.rank})` : `Ngannou is currently ahead (#${ngannou.rank} vs #${cain.rank})`}. Any answer must correct a false premise.`);
  lines.push('- **“Most hurt by UFC-only scoring” is not a direct model field.** It requires an explicitly labeled opinion using excluded WEC/ONE/Pride/Strikeforce context; do not invent a counterfactual score.');
  lines.push('');

  lines.push('## 10. Fighter-by-fighter data cards');
  lines.push('');
  for (const payload of payloads) lines.push(fighterMarkdown(runtime, payload));

  lines.push('## 11. Comparison guidance');
  lines.push('');
  lines.push('1. Start with the verdict.');
  lines.push('2. State whether the verdict is about **better fighter/ability** or **better UFC-only GOAT résumé**. Those can differ.');
  lines.push('3. Cite actual category values and the most important receipts.');
  lines.push('4. Give the losing fighter’s strongest real counterargument.');
  lines.push('5. Explain why the winner still wins.');
  lines.push('6. Use a direct-fight ledger only when the fighters actually fought or had a real rivalry.');
  lines.push('7. Avoid reading every number. Lead with the decisive two or three differences, then support them.');
  lines.push('');

  lines.push('## 12. Scenario-analysis guidance');
  lines.push('');
  lines.push('For “what would it take to pass X?” questions:');
  lines.push('');
  lines.push('- Start with the current raw-score and OVR gap.');
  lines.push('- Define the hypothetical UFC fight: opponent tier, champion status, title type, division, result, method, rounds, and date.');
  lines.push('- Update the canonical ledger, Championship/Opponent Quality judgment inputs, prime sample, longevity window, loss exposure, Apex case, and division context as applicable.');
  lines.push('- Rerun all seven categories, the weighted total, both fighters’ board ranks, and the OVR conversion.');
  lines.push('- Do not promise a pass from a single win unless the full rerun actually produces it.');
  lines.push('- Clearly separate a deterministic model result from a judgment-dependent estimate.');
  lines.push('');

  lines.push('## 13. Validation and regression readiness');
  lines.push('');
  lines.push(`Automated validation passed for **${validation.fighterCount} fighters** and specifically checked: ${validation.validatedFighters.join(', ')}.`);
  lines.push('');
  lines.push(markdownTable(
    ['Regression question', 'Status', 'Required answer behavior'],
    [
      ['Show me exactly how Jon Jones got 99 OVR.', 'Ready', 'Use Jones’s exact weighted raw total, anchors, curve, and leader-only 99 rule.'],
      ['Why is Pantoja’s quality-wins score low?', 'Ready', 'Use final-credit inputs, diminishing-return slots, benchmark, and modern-flyweight context.'],
      ['Who is the best UFC fighter never to win undisputed gold?', 'Ready with definition', 'Use the derived no-undisputed index; separate résumé rank from subjective ability.'],
      ['Compare Khabib and Volkanovski.', 'Ready', 'Verdict first; Khabib prime/cleanliness versus Volk title depth/quality/balance.'],
      ['What would Islam need to do to pass GSP?', 'Scenario-ready', 'State current gap, define fight assumptions, and require a full rerun.'],
      ['Why is Cain behind Ngannou overall?', 'Premise check required', cain.rank < ngannou.rank ? 'Current data has Cain ahead; correct the premise, then explain the category comparison.' : 'Current data has Ngannou ahead; explain the decisive category and modifier gaps.'],
      ['How was Anderson Silva’s loss penalty calculated?', 'Ready', 'Show each loss event, phase, finish/upward context, and aggregate severity/frequency/volume calculation.'],
      ['Who has the best prime outside the top 10?', 'Ready', `Current answer: ${bestPrimeOutsideTop10?.row?.fighter || '—'} by Prime Dominance score.`],
      ['Which fighter is hurt most by UFC-only scoring?', 'Opinion only', 'Use excluded-achievement context, label the answer as opinion, and never invent a non-UFC score.'],
      ['Who has the strongest UFC résumé without becoming undisputed champion?', 'Ready with definition', `Current derived leader: ${bestNoUndisputed?.row?.fighter || '—'}.`]
    ]
  ).trimEnd());
  lines.push('');

  lines.push('## 14. Known limitations and data gaps');
  lines.push('');
  lines.push(`- **Presentation coverage:** ${missingWhyRanked.length} fighters lack a bespoke “Why ranked here” override; ${missingWhyNotHigher.length} lack bespoke “Why not ranked higher?” copy. This file supplies calculated fallbacks, but bespoke copy would improve debate quality.`);
  lines.push(`- **Compare-profile coverage:** ${missingCompare.length} fighters lack a current pipeline-safe compare profile. Legacy compare packs are not score-safe because some contain frozen score patches.`);
  lines.push(`- **Round audit coverage:** ${missingRoundFighters.length} fighters have at least one prime fight without audited round allocation: ${missingRoundFighters.length ? missingRoundFighters.join(', ') : 'none'}.`);
  lines.push(`- **Freshness metadata:** canonical model-as-of is ${w.UFC_CANONICAL_FIGHTER_FACTS.modelAsOfDate}, while the latest fighter ledger is verified through ${maxVerifiedThrough || '—'}. Keep these dates synchronized in a future cleanup.`);
  lines.push('- **Non-UFC counterfactuals:** the model intentionally does not calculate what WEC, Pride, Strikeforce, ONE, Bellator, or regional achievements would have added.');
  lines.push('- **Scenario uncertainty:** future opponents, rankings, title context, and prime-round allocations require explicit assumptions and may change judgment inputs.');
  lines.push('- **Direct-fight ledger:** rivalry copy is useful context, but the score is still owned by the canonical pipeline, not by head-to-head history alone.');
  lines.push('');

  lines.push('## 15. Update workflow');
  lines.push('');
  lines.push('1. Update canonical fighter facts and approved judgments in the repo.');
  lines.push('2. Run `node scripts/generate-octagon-verdict-knowledge.mjs`.');
  lines.push('3. The generator validates all fighters, reconciles raw totals and OVRs, and writes this Markdown plus the companion JSON.');
  lines.push('4. GitHub Pages runs the generator on every relevant main-branch deploy, publishing fresh files at `/octagon-verdict-knowledge.md` and `/octagon-verdict-data.json`.');
  lines.push('5. Upload the new Markdown file to the Octagon Verdict Custom GPT and run the regression questions above.');
  lines.push('');

  return {
    markdown: lines.join('\n'),
    payloads,
    generatedAt,
    maxVerifiedThrough,
    gaps: { missingWhyRanked, missingWhyNotHigher, missingCompare, missingRoundFighters }
  };
}

function buildJson(runtime, knowledge, validation) {
  const projection = runtime.context.UFC_CALCULATED_RANKING_PROJECTION;
  return {
    schemaVersion: 2,
    generatedAt: knowledge.generatedAt,
    modelAsOfDate: runtime.context.UFC_CANONICAL_FIGHTER_FACTS.modelAsOfDate,
    latestLedgerVerifiedThrough: knowledge.maxVerifiedThrough,
    methodology: {
      categoryMax: projection.categoryMax,
      weights: projection.weights,
      ovr: projection.ovr,
      sourceFiles: CORE_SOURCE_FILES,
      legacyComparePacksExecuted: false
    },
    validation,
    gaps: knowledge.gaps,
    fighters: knowledge.payloads.map(payload => ({
      fighter: payload.row.fighter,
      board: payload.row.board,
      rank: payload.row.rank,
      overallOvr: payload.row.overallOvr,
      totalScore: payload.row.totalScore,
      divisions: [payload.row.primaryDivision, payload.row.secondaryDivision].filter(Boolean),
      ufcRecord: payload.row.ufcRecord,
      titleFightWins: payload.row.titleFightWins,
      adjustedTitleWins: payload.row.adjustedTitleWins,
      undisputedTitleWins: payload.titles.undisputedWins,
      topFiveWins: payload.row.topFiveWins,
      rankedWins: payload.row.rankedWins,
      finishRatePct: payload.row.finishRatePct,
      primeRecord: payload.row.primeRecord,
      roundsWonPct: payload.row.roundsWonPct,
      activeEliteYears: payload.row.activeEliteYears,
      scores: {
        championship: payload.row.championship,
        opponentQuality: payload.row.opponentQuality,
        primeDominance: payload.row.primeDominance,
        longevity: payload.row.longevity,
        apex: payload.row.apexPeak,
        penalty: payload.row.penalty,
        eraDepth: payload.row.eraDepthAdjustment
      },
      weighted: payload.recalculated,
      traces: payload.trace.traces,
      primeWindow: payload.era?.window || null,
      divisionStrength: payload.record?.divisionStrength || null,
      eraLedger: payload.era || null,
      eraDepthResolution: payload.resolution || null,
      presentation: {
        oneLiner: payload.override?.oneLiner || payload.compare?.shortCase || null,
        whyRankedHere: payload.override?.whyRankedHere || null,
        whyNotHigher: payload.override?.whyNotHigher || payload.override?.whyNotLower || null,
        keyJudgmentCalls: payload.override?.keyJudgmentCalls || null,
        finalTakeaway: payload.override?.finalTakeaway || null,
        compareProfile: payload.compare || null
      }
    }))
  };
}

function writeFile(target, content) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const runtime = buildRuntime();
  const validation = validateRuntime(runtime);
  if (options.validateOnly) {
    console.log(JSON.stringify(validation, null, 2));
    return;
  }
  const knowledge = buildKnowledge(runtime, validation);
  writeFile(options.output, knowledge.markdown);
  if (options.jsonOutput) writeFile(options.jsonOutput, JSON.stringify(buildJson(runtime, knowledge, validation), null, 2));
  console.log(`Generated ${path.relative(ROOT, options.output)} with ${validation.fighterCount} validated fighters.`);
  if (options.jsonOutput) console.log(`Generated ${path.relative(ROOT, options.jsonOutput)}.`);
}

main().catch(error => {
  console.error(error?.stack || error);
  process.exitCode = 1;
});

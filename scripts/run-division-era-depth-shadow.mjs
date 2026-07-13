import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildCurrentDepthCsv } from './refresh-division-era-depth-source.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const FEED_PATH = path.join(ROOT, 'assets/data/octagon-verdict-data.json');
const REPORT_PATH = path.join(ROOT, 'docs/division-era-depth-shadow-report.json');
const RUNTIME_PATH = path.join(ROOT, 'assets/data/division-era-depth-shadow.js');
const GENERATOR_PATH = path.join(ROOT, 'scripts/build-division-era-depth-shadow.mjs');
const OLD_VERSION = 'division-era-depth-shadow-20260712a-fight-network';
const VERSION = 'division-era-depth-shadow-20260712e-roster-72';
const CURVE_FULL_GAP = 0.25;
const CURVE_EXPONENT = 1.5;
const CURVE_NEGATIVE_CAP = -3;
const CURVE_POSITIVE_CAP = 0.75;
const LINEAR_SCALE = 30;
const LINEAR_FLOOR = -3;
const LINEAR_CEILING = 1;
const SENSITIVITY_SCALE = 20;
const SENSITIVITY_FLOOR = -2;
const SENSITIVITY_CEILING = 0.75;

const ALIASES = new Map([
  ['B.J. Penn', 'BJ Penn'],
  ['T.J. Dillashaw', 'TJ Dillashaw'],
  ['Cris Cyborg', 'Cristiane Justino'],
  ['Mauricio "Shogun" Rua', 'Mauricio Rua']
]);
const RESTORE = new Map([...ALIASES.entries()].map(([canonical, dataset]) => [dataset, canonical]));

const round = (value, digits = 2) => {
  const factor = 10 ** digits;
  return Math.round((Number(value || 0) + Number.EPSILON) * factor) / factor;
};
const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value || 0)));
const mean = values => {
  const clean = values.map(Number).filter(Number.isFinite);
  return clean.length ? clean.reduce((sum, value) => sum + value, 0) / clean.length : 0;
};

function replaceAllAliases(text) {
  let output = String(text);
  for (const [dataset, canonical] of RESTORE) {
    output = output.replaceAll(JSON.stringify(dataset), JSON.stringify(canonical));
  }
  return output.replaceAll(OLD_VERSION, VERSION);
}

function curvedAdjustment(depthIndex) {
  const depth = Number(depthIndex || 0);
  if (depth < 1) {
    const gapRatio = Math.max(0, (1 - depth) / CURVE_FULL_GAP);
    return round(Math.max(CURVE_NEGATIVE_CAP, -3 * (gapRatio ** CURVE_EXPONENT)), 2);
  }
  return round(Math.min(CURVE_POSITIVE_CAP, (depth - 1) * 20), 2);
}

function weighted(samples, getter) {
  const totalWeight = samples.reduce((sum, sample) => sum + Number(sample.weight || 0), 0);
  if (!totalWeight) return null;
  return samples.reduce((sum, sample) => sum + Number(getter(sample) || 0) * Number(sample.weight || 0), 0) / totalWeight;
}

function recalculateScenarioRanks(report) {
  for (const group of ['men', 'women']) {
    const rows = (report.fighters || []).filter(row => row.group === group);
    const linear = [...rows].sort((a, b) => b.shadowTotal - a.shadowTotal || a.fighter.localeCompare(b.fighter));
    const sensitivity = [...rows].sort((a, b) => b.sensitivityTotal - a.sensitivityTotal || a.fighter.localeCompare(b.fighter));
    linear.forEach((row, index) => {
      row.shadowRank = index + 1;
      row.rankMovement = Number(row.currentRank || 0) - row.shadowRank;
    });
    sensitivity.forEach((row, index) => {
      row.sensitivityRank = index + 1;
      row.sensitivityRankMovement = Number(row.currentRank || 0) - row.sensitivityRank;
    });
  }
}

function applyWomenFeatherweightTreatment(report) {
  const affected = [];
  for (const row of report.fighters || []) {
    const originalSamples = row.samples || [];
    const wfwSamples = originalSamples.filter(sample => sample.division === 'WFW');
    if (!wfwSamples.length) continue;
    const usableSamples = originalSamples.filter(sample => sample.division !== 'WFW');
    const originalDepthIndex = row.depthIndex;
    const originalCurvedAdjustment = curvedAdjustment(originalDepthIndex);
    let depthIndex = 1;
    let componentRatios = { qualifiedActivePool: 1, ranksSixToFifteenElo: 1, contenderDiversity: 1 };
    let treatment = 'pure-wfw-zero-adjustment';
    if (usableSamples.length) {
      depthIndex = round(weighted(usableSamples, sample => sample.depthIndex), 4);
      componentRatios = {
        qualifiedActivePool: round(weighted(usableSamples, sample => sample.componentRatios?.qualifiedActivePool), 4),
        ranksSixToFifteenElo: round(weighted(usableSamples, sample => sample.componentRatios?.ranksSixToFifteenElo), 4),
        contenderDiversity: round(weighted(usableSamples, sample => sample.componentRatios?.contenderDiversity), 4)
      };
      treatment = 'mixed-career-non-wfw-only';
    }
    row.samples = usableSamples;
    row.depthIndex = depthIndex;
    row.componentRatios = componentRatios;
    row.sampledDivisions = [...new Set(usableSamples.map(sample => sample.division).filter(Boolean))];
    row.scoredSampleCount = usableSamples.length;
    row.titleWeightedSampleCount = usableSamples.filter(sample => sample.titleFight).length;
    row.shadowAdjustment = round(clamp((depthIndex - 1) * LINEAR_SCALE, LINEAR_FLOOR, LINEAR_CEILING), 2);
    row.sensitivityAdjustment = round(clamp((depthIndex - 1) * SENSITIVITY_SCALE, SENSITIVITY_FLOOR, SENSITIVITY_CEILING), 2);
    row.shadowTotal = round(Number(row.currentTotal || 0) + row.shadowAdjustment, 2);
    row.sensitivityTotal = round(Number(row.currentTotal || 0) + row.sensitivityAdjustment, 2);
    row.womenFeatherweightTreatment = {
      version: VERSION,
      treatment,
      excludedSampleCount: wfwSamples.length,
      retainedSampleCount: usableSamples.length,
      originalDepthIndex,
      originalCurvedAdjustment,
      finalDepthIndex: depthIndex,
      finalCurvedAdjustment: curvedAdjustment(depthIndex)
    };
    affected.push(row.fighter);
  }
  report.methodology.womenFeatherweightTreatment = {
    status: 'locked-live-safe',
    rule: 'Women’s featherweight samples are excluded because the division never maintained a viable ranks-6–15 baseline. Mixed careers use non-WFW samples; pure WFW careers receive a zero era-depth adjustment.',
    affectedFighters: affected
  };
  report.summary.womenFeatherweightTreatmentApplied = affected.length === 3;
  report.summary.womenFeatherweightAffectedCount = affected.length;
  report.summary.pureWomenFeatherweightZeroCount = (report.fighters || []).filter(row => row.womenFeatherweightTreatment?.treatment === 'pure-wfw-zero-adjustment').length;
  recalculateScenarioRanks(report);
}

function compact(row) {
  return {
    fighter: row.fighter,
    group: row.group,
    currentRank: row.currentRank,
    curvedRank: row.curvedRank,
    curvedRankMovement: row.curvedRankMovement,
    currentTotal: row.currentTotal,
    depthIndex: row.depthIndex,
    curvedAdjustment: row.curvedAdjustment,
    curvedTotal: row.curvedTotal,
    componentRatios: row.componentRatios,
    matchedPrimeFightCount: row.matchedPrimeFightCount,
    fallback: row.fallback,
    womenFeatherweightTreatment: row.womenFeatherweightTreatment || null
  };
}

function addCurvedScenario(report) {
  for (const row of report.fighters || []) {
    row.curvedAdjustment = curvedAdjustment(row.depthIndex);
    row.curvedTotal = round(Number(row.currentTotal || 0) + row.curvedAdjustment, 2);
  }
  for (const group of ['men', 'women']) {
    const board = (report.fighters || [])
      .filter(row => row.group === group)
      .sort((a, b) => b.curvedTotal - a.curvedTotal || a.fighter.localeCompare(b.fighter));
    board.forEach((row, index) => {
      row.curvedRank = index + 1;
      row.curvedRankMovement = Number(row.currentRank || 0) - row.curvedRank;
    });
  }
  const concernNames = new Set((report.summary?.concernGroup || []).map(row => row.fighter));
  const byNegative = [...report.fighters].sort((a, b) => a.curvedAdjustment - b.curvedAdjustment || a.currentRank - b.currentRank);
  const byPositive = [...report.fighters].sort((a, b) => b.curvedAdjustment - a.curvedAdjustment || a.currentRank - b.currentRank);
  const byMovement = [...report.fighters].sort((a, b) => Math.abs(b.curvedRankMovement) - Math.abs(a.curvedRankMovement) || a.currentRank - b.currentRank);
  report.methodology.curvedCandidate = {
    status: 'judgment-approved-live-candidate',
    purpose: 'Translate the empirical depth index without flattening every moderately older era at the same maximum penalty.',
    negativeFormula: `-3 × ((1.00 - depthIndex) / ${CURVE_FULL_GAP})^${CURVE_EXPONENT}, capped at ${CURVE_NEGATIVE_CAP}`,
    positiveFormula: `(depthIndex - 1.00) × 20, capped at +${CURVE_POSITIVE_CAP}`,
    interpretation: 'A 0.75 index receives the full -3; a moderate 0.89 index receives about -0.9 instead of the same -3.'
  };
  report.summary.curvedCandidate = {
    averageAdjustment: round(mean(report.fighters.map(row => row.curvedAdjustment)), 2),
    negativeAdjustmentCount: report.fighters.filter(row => row.curvedAdjustment < 0).length,
    positiveAdjustmentCount: report.fighters.filter(row => row.curvedAdjustment > 0).length,
    neutralAdjustmentCount: report.fighters.filter(row => row.curvedAdjustment === 0).length,
    largestNegativeAdjustments: byNegative.slice(0, 15).map(compact),
    largestPositiveAdjustments: byPositive.slice(0, 10).map(compact),
    largestRankMovers: byMovement.slice(0, 20).map(compact),
    concernGroup: report.fighters.filter(row => concernNames.has(row.fighter)).map(compact)
  };
}

function runtimeFromReport(report) {
  return {
    version: report.version,
    generatedAt: report.generatedAt,
    mode: report.mode,
    mutatesLiveScores: false,
    source: report.source,
    methodology: report.methodology,
    baselines: report.baselines,
    summary: report.summary,
    aliasResolution: report.aliasResolution,
    promotionContract: report.promotionContract,
    fighters: (report.fighters || []).map(row => ({
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
      curvedRank: row.curvedRank,
      curvedRankMovement: row.curvedRankMovement,
      curvedAdjustment: row.curvedAdjustment,
      curvedTotal: row.curvedTotal,
      componentRatios: row.componentRatios,
      matchedPrimeFightCount: row.matchedPrimeFightCount,
      scoredSampleCount: row.scoredSampleCount,
      fallback: row.fallback,
      sampledDivisions: row.sampledDivisions,
      primeStart: row.primeStart,
      primeEnd: row.primeEnd,
      openPrime: row.openPrime,
      womenFeatherweightTreatment: row.womenFeatherweightTreatment || null
    }))
  };
}

async function runGenerator(csv, sourceUrl) {
  const server = createServer((request, response) => {
    if (request.url !== '/depth.csv') {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(csv);
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  const localUrl = `http://127.0.0.1:${address.port}/depth.csv`;
  try {
    await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [GENERATOR_PATH], {
        cwd: ROOT,
        stdio: 'inherit',
        env: { ...process.env, UFC_DEPTH_SOURCE_URL: localUrl, UFC_DEPTH_PUBLIC_SOURCE_URL: sourceUrl }
      });
      child.once('error', reject);
      child.once('close', code => code === 0 ? resolve() : reject(new Error(`Depth generator exited with status ${code}.`)));
    });
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

async function main() {
  const originalFeedText = await fs.readFile(FEED_PATH, 'utf8');
  const feed = JSON.parse(originalFeedText);
  const expectedRosterCount = (feed.fighters || []).length;
  let changed = 0;
  for (const fighter of feed.fighters || []) {
    const alias = ALIASES.get(fighter.name);
    if (!alias) continue;
    fighter.name = alias;
    changed += 1;
  }
  if (changed !== ALIASES.size) throw new Error(`Expected ${ALIASES.size} fighter aliases, applied ${changed}.`);

  try {
    const refreshed = await buildCurrentDepthCsv({ modelDate: process.env.UFC_MODEL_DATE || new Date() });
    if (!refreshed.metadata.sourceFresh) {
      throw new Error(`UFCStats refresh is stale: ${refreshed.metadata.datasetEnd} for model date ${refreshed.metadata.modelDate}.`);
    }
    await fs.writeFile(FEED_PATH, `${JSON.stringify(feed)}\n`);
    await runGenerator(refreshed.csv, refreshed.metadata.liveSourceUrl);

    const report = JSON.parse(await fs.readFile(REPORT_PATH, 'utf8'));
    const restored = JSON.parse(replaceAllAliases(JSON.stringify(report)));
    restored.version = VERSION;
    restored.source = {
      url: refreshed.metadata.liveSourceUrl,
      description: 'Verified historical UFCStats-derived base merged with direct completed-event and fight-detail refreshes from UFCStats.',
      datasetFightCount: refreshed.metadata.datasetFightCount,
      datasetStart: restored.source?.datasetStart || null,
      datasetEnd: refreshed.metadata.datasetEnd,
      modelDate: refreshed.metadata.modelDate,
      sourceFresh: refreshed.metadata.sourceFresh,
      historicalBase: {
        url: refreshed.metadata.historicalSourceUrl,
        fightCount: refreshed.metadata.historicalFightCount,
        cutoff: refreshed.metadata.historicalCutoff
      },
      liveRefresh: {
        addedEventCount: refreshed.metadata.addedEventCount,
        addedFightCount: refreshed.metadata.addedFightCount
      },
      underlyingSource: 'UFCStats'
    };
    restored.aliasResolution = {
      version: VERSION,
      applied: true,
      aliases: Object.fromEntries(ALIASES),
      directMatchCoverageRequired: true
    };
    const fallbacks = (restored.fighters || []).filter(row => row.fallback || Number(row.matchedPrimeFightCount || 0) < 1);
    restored.summary.fallbackCount = fallbacks.length;
    restored.summary.directMatchCoverageCount = restored.fighters.length - fallbacks.length;
    restored.summary.aliasResolutionComplete = fallbacks.length === 0;
    if (restored.summary.rosterCount !== expectedRosterCount || fallbacks.length) {
      throw new Error(`Alias-complete depth coverage failed: ${expectedRosterCount - fallbacks.length}/${expectedRosterCount} direct matches; ${fallbacks.map(row => row.fighter).join(', ')}`);
    }

    applyWomenFeatherweightTreatment(restored);
    addCurvedScenario(restored);
    restored.promotionContract = {
      version: VERSION,
      empiricalIndexApproved: true,
      curvedTranslationApproved: true,
      linearTranslationRejected: true,
      sourceFresh: refreshed.metadata.sourceFresh,
      womenFeatherweightSafe: restored.summary.womenFeatherweightTreatmentApplied === true && restored.summary.pureWomenFeatherweightZeroCount === 1,
      directMatchCoverageComplete: restored.summary.directMatchCoverageCount === expectedRosterCount && restored.summary.fallbackCount === 0,
      rosterCount: restored.summary.rosterCount,
      readyForJudgmentFinalization: refreshed.metadata.sourceFresh && restored.summary.womenFeatherweightTreatmentApplied === true && restored.summary.directMatchCoverageCount === expectedRosterCount
    };
    restored.generatedAt = new Date().toISOString();
    await fs.writeFile(REPORT_PATH, `${JSON.stringify(restored, null, 2)}\n`);

    const runtime = runtimeFromReport(restored);
    const runtimeText = `// Full-roster Division-Era Depth Index. Generated evidence plus approved curved live candidate.\n(function(){\n  'use strict';\n  const SHADOW=${JSON.stringify(runtime)};\n  window.UFC_DIVISION_ERA_DEPTH_SHADOW=SHADOW;\n  document.documentElement.setAttribute('data-division-era-depth-shadow',SHADOW.version);\n  window.dispatchEvent(new CustomEvent('ufc-division-era-depth-shadow-ready',{detail:SHADOW}));\n})();\n`;
    await fs.writeFile(RUNTIME_PATH, runtimeText);

    console.log(JSON.stringify({
      version: VERSION,
      rosterCount: restored.summary.rosterCount,
      coverageCount: restored.summary.coverageCount,
      directMatchCoverageCount: restored.summary.directMatchCoverageCount,
      fallbackCount: restored.summary.fallbackCount,
      datasetEnd: restored.source.datasetEnd,
      sourceFresh: restored.source.sourceFresh,
      womenFeatherweightTreatment: restored.methodology.womenFeatherweightTreatment,
      concernGroup: restored.summary.curvedCandidate.concernGroup
    }, null, 2));
  } finally {
    await fs.writeFile(FEED_PATH, originalFeedText);
  }
}

main().catch(error => {
  console.error(error?.stack || error);
  process.exitCode = 1;
});

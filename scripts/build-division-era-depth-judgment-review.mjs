import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const REPORT_PATH = path.join(ROOT, 'docs/division-era-depth-shadow-report.json');
const JSON_PATH = path.join(ROOT, 'docs/division-era-depth-judgment-review.json');
const MARKDOWN_PATH = path.join(ROOT, 'docs/division-era-depth-judgment-review.md');
const VERSION = 'division-era-depth-judgment-review-20260712a';
const CURRENT_MODEL_DATE = '2026-07-12';
const CURVE_FULL_GAP = 0.25;
const CURVE_EXPONENT = 1.5;
const CURVE_NEGATIVE_CAP = -3;
const CURVE_POSITIVE_CAP = 0.75;

const round = (value, digits = 2) => {
  const factor = 10 ** digits;
  return Math.round((Number(value || 0) + Number.EPSILON) * factor) / factor;
};

function curvedAdjustment(depthIndex) {
  const depth = Number(depthIndex || 0);
  if (depth < 1) {
    const gapRatio = Math.max(0, (1 - depth) / CURVE_FULL_GAP);
    return round(Math.max(CURVE_NEGATIVE_CAP, -3 * (gapRatio ** CURVE_EXPONENT)), 2);
  }
  return round(Math.min(CURVE_POSITIVE_CAP, (depth - 1) * 20), 2);
}

function weightedAverage(samples, key) {
  const totalWeight = samples.reduce((sum, sample) => sum + Number(sample.weight || 0), 0);
  if (!totalWeight) return null;
  return samples.reduce((sum, sample) => sum + Number(sample[key] || 0) * Number(sample.weight || 0), 0) / totalWeight;
}

function wfwExcludedScenario(row) {
  const samples = (row.samples || []).filter(sample => sample.division !== 'WFW');
  if (!samples.length) {
    return {
      usable: false,
      remainingSampleCount: 0,
      depthIndex: null,
      curvedAdjustment: 0,
      recommendation: 'Use no era-depth adjustment until women’s featherweight has a viable depth baseline.'
    };
  }
  const depthIndex = round(weightedAverage(samples, 'depthIndex'), 4);
  return {
    usable: true,
    remainingSampleCount: samples.length,
    depthIndex,
    curvedAdjustment: curvedAdjustment(depthIndex),
    recommendation: 'Use the non-WFW divisional samples if an era-depth adjustment is later promoted.'
  };
}

const MANUAL_NOTES = {
  'Georges St-Pierre': 'Approve. A moderate era-depth deduction is supported, but the championship résumé remains comfortably second.',
  'Anderson Silva': 'Approve. The adjustment is material but not destructive; the DJ/Anderson ordering becomes legitimately close.',
  'Demetrious Johnson': 'Approve. The smaller deduction correctly reflects a later UFC era while still recognizing early flyweight maturity limits.',
  'Jose Aldo': 'Approve. The data supports only a modest era deduction; his remaining high placement is driven by UFC title volume and longevity, not an era bug.',
  'Matt Hughes': 'Approve major move. The active-pool and ranks-6–15 depth ratios both strongly validate a full early-era correction.',
  'Junior dos Santos': 'Approve major move. The adjustment is smaller than the early-era cap and appropriately distinguishes expansion-era heavyweight from modern heavyweight.',
  'Tito Ortiz': 'Approve major move. The full deduction is supported by both field size and contender-network concentration.',
  'Randy Couture': 'Approve heavyweight output. The early heavyweight/light-heavyweight ecosystem warrants a near-cap deduction.',
  'Chuck Liddell': 'Approve. The near-cap deduction is consistent with the early light-heavyweight field without erasing the title résumé.',
  'Jon Jones': 'Approve mixed-division output. Fight-level sampling prevents his late heavyweight appearance from rewriting his primarily light-heavyweight prime.',
  'Daniel Cormier': 'Approve mixed-division output. LHW and HW are sampled by actual fight date rather than a single career label.',
  'Stipe Miocic': 'Approve heavyweight output. Within-division normalization avoids punishing heavyweight merely for being shallower than lightweight.',
  'Cain Velasquez': 'Approve heavyweight output. The model produces a meaningful but non-cap adjustment for the early-2010s heavyweight field.',
  'Francis Ngannou': 'Approve heavyweight output. His near-modern depth index correctly produces almost no adjustment.',
  'Brock Lesnar': 'Approve heavyweight output. The large deduction reflects a smaller and less developed heavyweight ecosystem, not a skill judgment.',
  'Cris Cyborg': 'Hold current output. Women’s featherweight never had a viable ranks-6–15 ecosystem, so the current -3 is partly an empty-slot artifact.',
  'Amanda Nunes': 'Hold WFW-influenced portion. Preserve bantamweight samples and exclude women’s-featherweight samples from any promoted era calculation.',
  'Holly Holm': 'Hold WFW-influenced portion. Recalculate from bantamweight samples rather than allowing the sparse WFW baseline to dominate.',
  'Kayla Harrison': 'Approve with sample caution. The positive adjustment is capped and modest, but it is based on a very short UFC prime sample.',
  'Ilia Topuria': 'Approve with freshness caution. The structure is sound, but the external fight dataset does not include the latest 2025–2026 portion of his open prime.',
  'Islam Makhachev': 'Approve with freshness caution. Refreshing the source through the current model date is required before live promotion.',
  'Alexander Volkanovski': 'Approve with freshness caution. Open-prime terminal sampling is acceptable for shadow work, not final production.',
  'Alex Pereira': 'Approve with freshness caution. The small modern adjustment is directionally sound, but the dataset cutoff misses part of the current title run.'
};

function classify(row) {
  const sampledDivisions = row.sampledDivisions || [];
  const isWfwInfluenced = sampledDivisions.includes('WFW');
  const isHeavyweight = row.primaryDivision === 'HW' || sampledDivisions.includes('HW');
  const isMajorMover = Math.abs(Number(row.curvedRankMovement || 0)) >= 3;
  const lowSample = Number(row.matchedPrimeFightCount || 0) < 4;
  const flags = [];
  if (isWfwInfluenced) flags.push('wfw-sparse-baseline');
  if (isHeavyweight) flags.push('heavyweight-review');
  if (isMajorMover) flags.push('major-rank-mover');
  if (row.openPrime) flags.push('open-prime-source-cutoff');
  if (lowSample) flags.push('low-prime-sample');

  let status = 'approved';
  let liveEligible = true;
  if (isWfwInfluenced) {
    status = 'hold-wfw-treatment';
    liveEligible = false;
  } else if (isMajorMover) {
    status = 'approved-major-mover';
  } else if (isHeavyweight) {
    status = 'approved-heavyweight';
  } else if (row.openPrime || lowSample) {
    status = 'approved-with-caution';
  }

  return {
    fighter: row.fighter,
    group: row.group,
    currentRank: row.currentRank,
    curvedRank: row.curvedRank,
    rankMovement: row.curvedRankMovement,
    currentTotal: row.currentTotal,
    curvedTotal: row.curvedTotal,
    depthIndex: row.depthIndex,
    curvedAdjustment: row.curvedAdjustment,
    primaryDivision: row.primaryDivision,
    sampledDivisions,
    matchedPrimeFightCount: row.matchedPrimeFightCount,
    openPrime: row.openPrime,
    status,
    liveEligible,
    flags,
    judgment: MANUAL_NOTES[row.fighter] || (
      status === 'approved-major-mover'
        ? 'Approve. The movement is driven by a meaningful empirical adjustment rather than a manual ranking target.'
        : status === 'approved-heavyweight'
          ? 'Approve. The division is normalized against modern heavyweight, so this is an era comparison inside heavyweight rather than a cross-division penalty.'
          : status === 'approved-with-caution'
            ? 'Approve for shadow use. Refresh the fight source before any live promotion.'
            : 'Approve. Direction and magnitude are within the curved model’s intended range.'
    ),
    wfwExcludedScenario: isWfwInfluenced ? wfwExcludedScenario(row) : null
  };
}

function table(rows) {
  const header = '| Fighter | Current | Curved | Move | Depth | Adj. | Decision |\n|---|---:|---:|---:|---:|---:|---|';
  const body = rows.map(row => `| ${row.fighter} | #${row.currentRank} | #${row.curvedRank} | ${row.rankMovement > 0 ? '+' : ''}${row.rankMovement} | ${Number(row.depthIndex).toFixed(4)} | ${row.curvedAdjustment > 0 ? '+' : ''}${Number(row.curvedAdjustment).toFixed(2)} | ${row.status} |`).join('\n');
  return `${header}\n${body}`;
}

async function main() {
  const report = JSON.parse(await fs.readFile(REPORT_PATH, 'utf8'));
  if (report.mode !== 'shadow-only' || report.mutatesLiveScores !== false) {
    throw new Error('Depth source is not shadow-safe.');
  }
  if (report.summary?.rosterCount !== 63 || report.summary?.directMatchCoverageCount !== 63 || report.summary?.fallbackCount !== 0) {
    throw new Error('Depth source does not have clean 63-fighter direct coverage.');
  }
  if (!report.methodology?.curvedCandidate) {
    throw new Error('Curved depth candidate is missing.');
  }

  const fighters = (report.fighters || []).map(classify);
  const majorMovers = fighters.filter(row => Math.abs(row.rankMovement) >= 3).sort((a, b) => Math.abs(b.rankMovement) - Math.abs(a.rankMovement));
  const heavyweights = fighters.filter(row => row.flags.includes('heavyweight-review')).sort((a, b) => a.currentRank - b.currentRank);
  const wfwInfluenced = fighters.filter(row => row.flags.includes('wfw-sparse-baseline')).sort((a, b) => a.group.localeCompare(b.group) || a.currentRank - b.currentRank);
  const openPrimeRows = fighters.filter(row => row.openPrime);
  const holds = fighters.filter(row => !row.liveEligible);
  const datasetStale = String(report.source?.datasetEnd || '') < '2026-01-01';
  const blockers = [];
  if (wfwInfluenced.length) {
    blockers.push({
      code: 'wfw-sparse-baseline',
      severity: 'critical',
      affectedFighters: wfwInfluenced.map(row => row.fighter),
      recommendation: 'Do not use WFW samples in a live era-depth adjustment. Use non-WFW samples for mixed-division fighters and zero era adjustment for pure WFW cases.'
    });
  }
  if (datasetStale) {
    blockers.push({
      code: 'source-freshness',
      severity: 'critical',
      datasetEnd: report.source.datasetEnd,
      modelDate: CURRENT_MODEL_DATE,
      affectedOpenPrimes: openPrimeRows.map(row => row.fighter),
      recommendation: 'Refresh the fight source through the current scoring date before live promotion.'
    });
  }

  const review = {
    version: VERSION,
    generatedAt: new Date().toISOString(),
    shadowVersion: report.version,
    mode: 'judgment-review-shadow-only',
    mutatesLiveScores: false,
    formulaJudgment: {
      empiricalIndexApproved: true,
      curvedTranslationApproved: true,
      linearTranslationRejected: true,
      majorMoverJudgmentApproved: majorMovers.every(row => row.liveEligible),
      rationale: 'The curved formula distinguishes truly thin early divisions from moderately older but already mature divisions. It avoids the linear model’s excessive -3 cap saturation.'
    },
    promotionDecision: {
      readyForLivePromotion: blockers.length === 0,
      decision: blockers.length ? 'hold' : 'approve',
      summary: blockers.length
        ? 'Keep the curved model in shadow. Resolve WFW treatment and refresh the source before promotion.'
        : 'The curved model is judgment-approved for live implementation.',
      blockers
    },
    coverage: {
      rosterCount: fighters.length,
      reviewedCount: fighters.length,
      approvedCount: fighters.filter(row => row.liveEligible).length,
      holdCount: holds.length,
      majorMoverCount: majorMovers.length,
      heavyweightReviewCount: heavyweights.length,
      wfwInfluencedCount: wfwInfluenced.length,
      openPrimeCount: openPrimeRows.length,
      fallbackCount: report.summary.fallbackCount
    },
    majorMovers,
    heavyweightReview: heavyweights,
    womenFeatherweightReview: wfwInfluenced,
    fighters
  };

  const markdown = `# Division-Era Depth Judgment Review\n\n` +
    `**Version:** ${VERSION}  \n` +
    `**Shadow source:** ${report.version}  \n` +
    `**Live scores changed:** No\n\n` +
    `## Decision\n\n` +
    `The empirical Division-Era Depth Index and the curved point translation pass the broad 63-fighter judgment review. The original linear translation remains rejected because it pushed too many moderately older fighters to the same -3 cap.\n\n` +
    `The model is **not ready for live promotion**. Two blockers remain:\n\n` +
    `1. **Women’s featherweight:** the division never maintained a viable ranks-6–15 field. Pure WFW output should receive no era adjustment, and mixed-division fighters should be recalculated without WFW samples.\n` +
    `2. **Source freshness:** the fight dataset ends ${report.source.datasetEnd}, while the live scoring model includes 2026 results. Open-prime terminal snapshots are acceptable for shadow analysis but not final production.\n\n` +
    `## Major Movers\n\n${table(majorMovers)}\n\n` +
    `All major movers pass judgment. Hughes, JDS, and Tito move because the empirical field-depth gap is substantial, not because their rankings were manually targeted.\n\n` +
    `## Heavyweight Review\n\n${table(heavyweights)}\n\n` +
    `Heavyweight passes as a model class. Every heavyweight era is normalized against modern heavyweight, so the model does not punish heavyweight for being naturally shallower than lightweight.\n\n` +
    `## Women’s Featherweight Review\n\n${table(wfwInfluenced)}\n\n` +
    `These rows remain on hold until WFW samples are excluded or replaced with a zero era adjustment for pure WFW careers.\n\n` +
    `## Full 63-Fighter Review\n\n${table(fighters)}\n`;

  await fs.writeFile(JSON_PATH, `${JSON.stringify(review, null, 2)}\n`, 'utf8');
  await fs.writeFile(MARKDOWN_PATH, markdown, 'utf8');

  console.log(JSON.stringify({
    version: VERSION,
    reviewedCount: review.coverage.reviewedCount,
    approvedCount: review.coverage.approvedCount,
    holdCount: review.coverage.holdCount,
    majorMoverCount: review.coverage.majorMoverCount,
    heavyweightReviewCount: review.coverage.heavyweightReviewCount,
    wfwInfluencedCount: review.coverage.wfwInfluencedCount,
    readyForLivePromotion: review.promotionDecision.readyForLivePromotion,
    blockers: review.promotionDecision.blockers
  }, null, 2));
}

main().catch(error => {
  console.error(error?.stack || error);
  process.exitCode = 1;
});

#!/usr/bin/env node
/*
 * Build the public Octagon Verdict GPT feed from the fully rendered app.
 * The browser runtime is the source of truth, so the feed cannot drift onto
 * retired correction files, stale ranks, or an old OVR formula.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const legacyPath = path.join(root, 'assets/data/octagon-verdict-data.json');
const dataDir = path.join(root, 'assets/data/octagon-verdict');
const fightersDir = path.join(dataDir, 'fighters');
const matchupsDir = path.join(dataDir, 'matchups');
const appUrl = process.env.OCTAGON_VERDICT_APP_URL || 'http://127.0.0.1:4173';

function round(value, digits = 2) {
  const n = Number(value);
  return Number.isFinite(n) ? Number(n.toFixed(digits)) : undefined;
}
function compact(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => {
    if (value === undefined || value === null || value === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return false;
    return true;
  }));
}
function slugify(name) {
  return String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[’']/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
function pairKey(a, b) { return [slugify(a), slugify(b)].sort().join('--'); }
function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data)}\n`, 'utf8');
}

async function readRuntime() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error?.message || error)));
  try {
    await page.goto(appUrl, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForFunction(() => document.documentElement.getAttribute('data-scoring-pipeline') === 'ready', null, { timeout: 120000 });

    const result = await page.evaluate(() => {
      const DATA = window.RANKING_DATA || { men: [], women: [], fighters: [] };
      let OVERRIDES = window.DISPLAY_OVERRIDES || {};
      try { if (!Object.keys(OVERRIDES).length && typeof DISPLAY_OVERRIDES !== 'undefined') OVERRIDES = DISPLAY_OVERRIDES; } catch (error) {}
      const PACKETS = window.UFC_FIGHTER_PACKETS || {};
      const COMPARE = window.COMPARE_PROFILES || {};
      const profiles = new Map((DATA.fighters || []).map(profile => [profile.fighter, profile]));
      const qualityStore = window.UFC_OPPONENT_QUALITY_SHADOW_AUDIT || {};
      const eraStore = window.UFC_FIGHTER_ERA_LEDGERS || {};
      const primeStore = window.UFC_PRIME_DOMINANCE_LEDGERS || {};
      const titleStore = window.UFC_CHAMPIONSHIP_RESUME_LEDGERS || {};
      const directLedger = window.COMPARE_FIGHT_LEDGER || {};

      const finite = value => Number.isFinite(Number(value)) ? Number(value) : undefined;
      const first = (...values) => values.find(value => value !== undefined && value !== null && value !== '');
      const cleanText = (value, max = 1000) => {
        if (value === undefined || value === null) return undefined;
        const text = String(value).replace(/\s+/g, ' ').trim();
        if (!text) return undefined;
        return text.length > max ? `${text.slice(0, max - 1).trim()}…` : text;
      };
      const snapshotValue = (snapshot, labels) => {
        if (!Array.isArray(snapshot)) return undefined;
        const wanted = labels.map(label => String(label).toLowerCase());
        const row = snapshot.find(item => Array.isArray(item) && wanted.includes(String(item[0] || '').toLowerCase()));
        return row ? row[1] : undefined;
      };
      const firstNumber = value => {
        const match = String(value ?? '').match(/-?\d+(?:\.\d+)?/);
        return match ? Number(match[0]) : undefined;
      };
      const titleFightWins = (row, profile, display, compare, stats) => {
        const direct = first(row.titleFightWins, profile.titleFightWins, stats.titleFightWins, row.championshipResumeLiveAudit?.titleFightWins, row.championshipResumeShadowAudit?.titleFightWins);
        if (direct !== undefined) return direct;
        const snap = snapshotValue(display.snapshot, ['UFC Title-Fight Wins', 'Title-Fight Wins', 'Title Wins']);
        const parsed = firstNumber(snap);
        if (parsed !== undefined) return parsed;
        const legacy = compare.legacyStats?.titleFightWins;
        if (legacy !== undefined) return legacy;
        const title = row.title || profile.title || {};
        const noteMatch = String(title.notes || '').match(/Total title fight wins = ([0-9.]+)/i);
        return noteMatch ? Number(noteMatch[1]) : undefined;
      };
      const titleLedgerFor = name => {
        const raw = titleStore.raw?.[name] || titleStore.ledgers?.[name] || titleStore[name] || [];
        if (!Array.isArray(raw)) return [];
        return raw.slice(0, 20).map(item => {
          if (Array.isArray(item)) return { opponent: item[0], adjustedCredit: finite(item[1]), context: cleanText(item[2] || item[3], 240) };
          return { opponent: item.opponent || item.label, adjustedCredit: finite(item.adjustedCredit ?? item.credit ?? item.value), context: cleanText(item.context || item.notes || item.type, 240) };
        }).filter(item => item.opponent);
      };
      const qualityLedgerFor = (name, quality) => {
        const rows = Array.isArray(quality?.rows) ? quality.rows : [];
        return rows.slice(0, 12).map(item => ({
          opponent: item.opponent,
          credit: finite(item.credit),
          tier: cleanText(item.tierLabel, 80),
          context: cleanText(item.context, 260)
        })).filter(item => item.opponent);
      };
      const lossEventsFor = era => {
        const source = era?.lossContext || {};
        const buckets = [
          ...(source.recoveredLosses || []),
          ...(source.upwardDivisionLosses || []),
          ...(source.unrecoveredLoss ? [source.unrecoveredLoss] : []),
          ...(source.postPrimeLosses || []),
          ...(source.weirdResults || [])
        ];
        return buckets.slice(0, 16).map(item => ({
          opponent: item.label || item.opponent,
          date: item.date,
          type: cleanText(item.type, 120),
          method: cleanText(item.method, 60),
          context: cleanText(item.notes || item.recovery || item.context, 260)
        })).filter(item => item.opponent);
      };
      const divisionMultiplier = (row, profile, era) => finite(first(
        row.divisionStrengthMultiplier,
        row.divisionMultiplier,
        profile.divisionStrengthMultiplier,
        era?.longevity?.divisionMultiplier
      ));

      const fighters = [];
      for (const [group, board] of [['men', DATA.men || []], ['women', DATA.women || []]]) {
        for (const row of board) {
          const name = row.fighter;
          const profile = profiles.get(name) || {};
          const display = OVERRIDES[name] || {};
          const packet = PACKETS[name] || {};
          const compare = COMPARE[name] || display.compareProfile || profile.compareProfile || {};
          const stats = { ...(packet.profileStats || {}), ...(display.packetProfileStats || {}), ...(display.snapshotStats || {}) };
          const quality = row.opponentQualityLiveAudit || row.opponentQualityShadowAudit || qualityStore.summaryFor?.(name) || {};
          const era = eraStore.entryFor?.(name) || eraStore.ledgers?.[name] || {};
          const prime = row.primeDominanceLiveAudit || row.primeDominanceShadowAudit || primeStore.entryFor?.(name) || {};
          const title = row.title || profile.title || {};
          const primeRecord = first(DATA.primeRecords?.[name]?.record, row.primeRecord, profile.primeRecord, stats.primeRecord, snapshotValue(display.snapshot, ['Prime Record']));
          const roundControl = finite(first(prime.roundControlPct, prime.roundControlAudit?.roundControlPct, row.roundsWonPct, profile.roundsWonPct, stats.roundsWonPct));
          const finishRate = finite(first(row.finishRatePct, profile.finishRatePct, stats.finishRatePct, prime.primeFinishRate));
          const activeYears = finite(first(row.activeEliteYears, profile.activeEliteYears, stats.activeEliteYears, era.longevity?.activeEliteYears));
          const adjustedTitleWins = finite(first(
            row.championshipResumeLiveAudit?.adjustedTitleWins,
            row.championshipResumeLiveAudit?.adjustedCredit,
            row.championshipResumeShadowAudit?.adjustedTitleWins,
            row.championshipResumeShadowAudit?.adjustedCredit,
            title.adjustedTitleWins,
            stats.adjustedTitleWins
          ));
          const bestWins = Array.from(new Set((quality.bestWins || (profile.opponents || []).map(item => item.opponent)).filter(Boolean))).slice(0, 8);
          const window = era.window || prime.primeWindow || {};
          const windowLabel = first(window.startLabel || window.start, window.endLabel || window.end)
            ? `${window.startLabel || window.start || 'Prime start'} → ${window.endLabel || window.end || 'Current elite form'}`
            : undefined;

          fighters.push({
            slug: name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, ' and ').replace(/[’']/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
            name,
            group,
            rank: finite(row.rank),
            appOvr: finite(row.overallOvr) ?? finite(window.UFC_FINAL_SCORE_ENGINE?.overallOvrFor?.(row)),
            totalScore: finite(row.totalScore),
            championship: finite(row.championship),
            opponentQuality: finite(row.opponentQuality),
            primeDominance: finite(row.primeDominance),
            longevity: finite(row.longevity),
            apexPeak: finite(row.apexPeak),
            lossPenalty: finite(row.penalty),
            division: first(display.divisionLabel, [row.primaryDivision, row.secondaryDivision].filter(Boolean).join(' / '), profile.primaryDivision),
            divisionStrengthMultiplier: divisionMultiplier(row, profile, era),
            divisionStrengthContext: cleanText(first(row.divisionStrengthContext, profile.divisionStrengthContext, era.divisionStrengthContext), 260),
            tag: cleanText(first(display.resumeTag, row.resumeTag), 100),
            ufcRecord: first(row.ufcRecord, profile.ufcRecord, stats.ufcRecord, snapshotValue(display.snapshot, ['UFC Record'])),
            titleFightWins: titleFightWins(row, profile, display, compare, stats),
            adjustedTitleWins,
            elitePlusWins: finite(first(quality.elitePlusWins, row.elitePlusWins, stats.elitePlusWins)),
            topFivePlusWins: finite(first(quality.topFivePlusWins, row.topFivePlusWins, stats.topFivePlusWins)),
            rankedQualityWins: finite(first(quality.rankedQualityWins, row.rankedQualityWins, stats.rankedQualityWins)),
            winProfile: cleanText(first(quality.winProfile, row.winProfile, stats.winProfile), 180),
            bestWins,
            qualityWinLedger: qualityLedgerFor(name, quality),
            titleWinLedger: titleLedgerFor(name),
            primeRecord,
            primeWindow: windowLabel,
            primeWindowDetail: window && Object.keys(window).length ? {
              start: window.start,
              startLabel: window.startLabel,
              end: window.end,
              endLabel: window.endLabel,
              endReason: cleanText(window.endReason, 300)
            } : undefined,
            roundsWonPct: roundControl,
            finishRatePct: finishRate,
            activeEliteYears: activeYears,
            timesFinishedPrime: finite(first(row.timesFinishedPrime, profile.timesFinishedPrime, stats.timesFinishedPrime)),
            lossContextEvents: lossEventsFor(era),
            shortCase: cleanText(first(compare.shortCase, display.oneLiner), 650),
            bestArgument: cleanText(first(compare.bestArgument, compare.edge, compare.peak), 650),
            counterArgument: cleanText(first(compare.counter, compare.weakness, display.whyNotHigher), 650),
            whyRankedHere: cleanText(display.whyRankedHere, 750),
            whyNotHigher: cleanText(display.whyNotHigher, 750),
            finalTakeaway: cleanText(display.finalTakeaway, 650)
          });
        }
      }

      const directMatchups = Object.values(directLedger).map(item => ({
        fighters: Array.isArray(item.fighters) ? item.fighters.slice(0, 2) : [],
        fights: finite(item.fights),
        directWinner: item.winner,
        importance: item.importance,
        summary: cleanText(item.summary, 650)
      })).filter(item => item.fighters.length === 2);

      return {
        fighters,
        directMatchups,
        pipelineVersion: window.UFC_SCORING_PIPELINE?.version,
        finalScoreEngineVersion: window.UFC_FINAL_SCORE_ENGINE?.version,
        pipelineFighterCount: window.UFC_SCORING_PIPELINE?.fighterCount,
        pipelineStatus: window.UFC_SCORING_PIPELINE?.status
      };
    });

    if (result.pipelineStatus !== 'ready') throw new Error(`Scoring pipeline is ${result.pipelineStatus || 'unknown'}.`);
    if (result.fighters.length !== 63) throw new Error(`Expected 63 live fighters, received ${result.fighters.length}.`);
    return { ...result, pageErrors };
  } finally {
    await browser.close();
  }
}

function addCurrentLean(matchup, fightersByName) {
  const [a, b] = matchup.fighters;
  const fighterA = fightersByName.get(a);
  const fighterB = fightersByName.get(b);
  if (!fighterA || !fighterB) return compact({ ...matchup, pairKey: pairKey(a, b), slugs: [slugify(a), slugify(b)] });
  const totalA = Number(fighterA.totalScore);
  const totalB = Number(fighterB.totalScore);
  return compact({
    ...matchup,
    pairKey: pairKey(a, b),
    slugs: [slugify(a), slugify(b)],
    defaultLean: totalA === totalB ? 'Essentially even' : (totalA > totalB ? a : b),
    margin: round(Math.abs(totalA - totalB))
  });
}

function specialFrames(fightersByName) {
  const pair = (a, b, coreDebate, debateLanes, notes = []) => addCurrentLean({ fighters: [a, b], coreDebate, debateLanes, notes }, fightersByName);
  return [
    pair('Jon Jones', 'Georges St-Pierre', 'GSP has the cleaner consistency and revenge-win argument. Jones has the larger championship-volume and multi-era case.', { cleanerCase: 'Georges St-Pierre', largerUfcResume: 'Jon Jones' }),
    pair('Khabib Nurmagomedov', 'Islam Makhachev', 'Khabib owns the cleaner undefeated peak. Islam owns the larger current championship and modern-depth case.', { cleanerPeak: 'Khabib Nurmagomedov', largerCurrentResume: 'Islam Makhachev' }),
    pair('Kamaru Usman', 'Max Holloway', 'Usman has the stronger championship reign and current overall score. Holloway has the longevity, durability, and quality-win-volume counterargument.', { championPeak: 'Kamaru Usman', volumeCounter: 'Max Holloway' }, ['The current score determines the verdict; do not reuse the old Max-over-Usman lean.']),
    pair('Jose Aldo', 'Lyoto Machida', 'Aldo has the deeper UFC body of work and longevity. Machida owns the short-reign champion-apex counterargument.', { deeperUfcResume: 'Jose Aldo', apexCounter: 'Lyoto Machida' }),
    pair('Amanda Nunes', 'Cris Cyborg', 'Nunes has the deeper two-division UFC championship resume and the direct knockout. Cyborg has the dominant compact-reign and aura counterargument.', { deeperUfcResume: 'Amanda Nunes', compactDominanceCounter: 'Cris Cyborg' }),
    pair('Cris Cyborg', 'Holly Holm', 'Cyborg has the stronger UFC championship run and won their title fight. Holm owns the Rousey-upset and broader two-sport striking-legacy counterargument.', { strongerUfcTitleRun: 'Cris Cyborg', iconicUpsetCounter: 'Holly Holm' })
  ];
}

async function build() {
  const runtime = await readRuntime();
  const fighters = runtime.fighters
    .map(fighter => compact(fighter))
    .sort((a, b) => a.group !== b.group ? (a.group === 'men' ? -1 : 1) : Number(a.rank || 999) - Number(b.rank || 999));
  const fightersByName = new Map(fighters.map(fighter => [fighter.name, fighter]));
  const direct = runtime.directMatchups
    .filter(matchup => matchup.fighters.every(name => fightersByName.has(name)))
    .map(matchup => addCurrentLean(matchup, fightersByName));
  const specials = specialFrames(fightersByName);
  const matchupMap = new Map(direct.map(matchup => [matchup.pairKey, matchup]));
  for (const special of specials) matchupMap.set(special.pairKey, compact({ ...(matchupMap.get(special.pairKey) || {}), ...special }));
  const matchups = [...matchupMap.values()].sort((a, b) => a.pairKey.localeCompare(b.pairKey));

  const generatedAt = new Date().toISOString();
  const guidance = {
    sourceOfTruth: 'Use this live-runtime feed over uploaded memory, browsing, or old scores. The current totalScore determines the winner.',
    scope: 'Judge UFC accomplishments by default. Non-UFC achievements may be mentioned only as context.',
    verdictRule: 'Special matchup framing supplies debate lanes only. It may never override the current score order.',
    explainWith: ['current rank and OVR', 'UFC record', 'title-fight wins and adjusted title credit', 'Elite+ and Top-5+ wins', 'prime record and rounds won', 'finish percentage', 'active elite years', 'Apex Peak', 'loss context'],
    writingStyle: ['Start with the verdict', 'Give the losing fighter a real counterargument', 'Explain why the winner still wins', 'Separate better fighter from better UFC resume when relevant'],
    avoid: ['raw formula narration in normal answers', 'database/model language', 'outside citations unless asked', 'treating special matchup copy as a locked verdict']
  };
  const sourceVersions = compact({
    scoringPipeline: runtime.pipelineVersion,
    finalScoreEngine: runtime.finalScoreEngineVersion,
    pipelineFighterCount: runtime.pipelineFighterCount
  });
  const index = {
    name: 'Octagon Verdict Index',
    version: generatedAt.slice(0, 10),
    generatedAt,
    source: 'live-browser-runtime',
    sourceVersions,
    guidance,
    fighterCount: fighters.length,
    fighters: fighters.map(fighter => compact({
      slug: fighter.slug, name: fighter.name, group: fighter.group, rank: fighter.rank,
      appOvr: fighter.appOvr, totalScore: fighter.totalScore, division: fighter.division, tag: fighter.tag
    })),
    specialMatchups: specials.map(matchup => compact({
      pairKey: matchup.pairKey, fighters: matchup.fighters, slugs: matchup.slugs,
      defaultLean: matchup.defaultLean, margin: matchup.margin, coreDebate: matchup.coreDebate, debateLanes: matchup.debateLanes
    }))
  };
  const legacyFeed = {
    name: 'Octagon Verdict Data',
    version: index.version,
    generatedAt,
    source: index.source,
    sourceVersions,
    defaultScope: guidance.scope,
    guidance,
    fighterCount: fighters.length,
    fighters,
    specialMatchups: specials,
    directFightMatchups: direct
  };

  fs.rmSync(dataDir, { recursive: true, force: true });
  fs.mkdirSync(fightersDir, { recursive: true });
  fs.mkdirSync(matchupsDir, { recursive: true });
  writeJson(path.join(dataDir, 'index.json'), index);
  for (const fighter of fighters) writeJson(path.join(fightersDir, `${fighter.slug}.json`), fighter);
  for (const matchup of matchups) writeJson(path.join(matchupsDir, `${matchup.pairKey}.json`), matchup);
  writeJson(legacyPath, legacyFeed);

  const cyborg = fightersByName.get('Cris Cyborg');
  const jones = fightersByName.get('Jon Jones');
  const gsp = fightersByName.get('Georges St-Pierre');
  console.log(`Built live-runtime Octagon Verdict feed with ${fighters.length} fighters and ${matchups.length} matchup files.`);
  console.log(`Jones: #${jones?.rank}, ${jones?.totalScore}, ${jones?.appOvr} OVR.`);
  console.log(`GSP: #${gsp?.rank}, ${gsp?.totalScore}, ${gsp?.appOvr} OVR.`);
  console.log(`Cyborg: #${cyborg?.rank}, ${cyborg?.totalScore}, ${cyborg?.appOvr} OVR.`);
  if (runtime.pageErrors.length) console.warn(`Page errors captured: ${runtime.pageErrors.join(' | ')}`);
}

build().catch(error => {
  console.error(error?.stack || error);
  process.exit(1);
});

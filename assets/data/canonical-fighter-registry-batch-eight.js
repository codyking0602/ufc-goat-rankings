// Permanent UFC-only registry for the audited eight-fighter batch.
(function(){
  'use strict';

  const BASE = window.UFC_CANONICAL_FIGHTER_REGISTRY;
  const DATA = window.RANKING_DATA;
  const FIGHTERS = window.UFC_BATCH_EIGHT_FIGHTER_DATA;
  const VERSION = 'canonical-fighter-registry-batch-eight-20260715a-presentation-clean';

  if (!BASE || !DATA || !Array.isArray(FIGHTERS) || FIGHTERS.length !== 8) {
    console.error('Batch-eight registry prerequisites missing.');
    return;
  }

  const NAMES = FIGHTERS.map(fighter => fighter.name);
  const DISPLAY_NAMES = {
    'Benson Henderson': 'Benson “Smooth” Henderson',
    'Fabricio Werdum': 'Fabricio “Vai Cavalo” Werdum',
    'Vitor Belfort': 'Vitor “The Phenom” Belfort',
    'Mauricio "Shogun" Rua': 'Mauricio “Shogun” Rua',
    'Rashad Evans': 'Rashad “Suga” Evans'
  };

  function key(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[’‘`´]/g, "'")
      .replace(/\s+/g, ' ');
  }

  const BY_NAME = new Map(FIGHTERS.map(fighter => [key(fighter.name), fighter]));
  const round2 = value => Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
  const displayStore = () => window.DISPLAY_OVERRIDES || (typeof DISPLAY_OVERRIDES !== 'undefined' ? DISPLAY_OVERRIDES : null);
  const allRows = name => [...(DATA.men || []), ...(DATA.fighters || [])].filter(row => key(row?.fighter) === key(name));

  function totalFor(fighter) {
    return round2(
      (fighter.c[0] / 30) * 35 +
      (fighter.c[1] / 30) * 27.5 +
      (fighter.c[2] / 30) * 27.5 +
      (fighter.c[3] / 30) * 10 +
      fighter.c[4] + fighter.c[5] + fighter.c[6]
    );
  }

  function upsert(list, row) {
    if (!Array.isArray(list)) return null;
    const index = list.findIndex(item => key(item?.fighter) === key(row.fighter));
    if (index < 0) {
      list.push(row);
      return row;
    }
    list[index] = { ...list[index], ...row };
    return list[index];
  }

  function upsertReport(report, row, sorter) {
    if (!Array.isArray(report)) return;
    const index = report.findIndex(item => key(item?.fighter) === key(row.fighter));
    if (index < 0) report.push(row);
    else report[index] = row;
    if (sorter) report.sort(sorter);
  }

  function parseRecord(record) {
    const match = String(record || '').match(/^(\d+)-(\d+)(?:-(\d+))?/);
    return {
      wins: Number(match?.[1] || 0),
      losses: Number(match?.[2] || 0),
      draws: Number(match?.[3] || 0),
      ncs: /NC/i.test(String(record || '')) ? 1 : 0
    };
  }

  function lossMethod(type) {
    const text = String(type || '').toLowerCase();
    if (/finish|submission|tko|\bko\b/.test(text)) return 'Finish';
    if (text.includes('decision')) return 'Decision';
    return undefined;
  }

  function lossEvent(row) {
    return {
      label: row[0],
      opponent: row[0],
      type: row[1],
      date: row[2],
      method: lossMethod(row[1])
    };
  }

  function titleObject(fighter) {
    const shape = {
      titleFightWins: fighter.titles,
      adjustedTitleWins: fighter.adj,
      normalTitleWins: fighter.titles,
      interimTitleWins: 0,
      tournamentWins: 0,
      inauguralUndisputedWins: 0,
      unificationWins: 0,
      notes: `${fighter.titles} UFC title-level wins; ${fighter.adj.toFixed(2)} adjusted credit. UFC-only.`
    };

    if (fighter.name === 'Frank Shamrock') {
      shape.normalTitleWins = 4;
      shape.inauguralUndisputedWins = 1;
    } else if (fighter.name === 'Fabricio Werdum') {
      shape.normalTitleWins = 1;
      shape.interimTitleWins = 1;
      shape.unificationWins = 1;
    } else if (fighter.name === 'Vitor Belfort') {
      shape.normalTitleWins = 1;
      shape.tournamentWins = 1;
    }

    return shape;
  }

  function qualityRows(fighter) {
    return fighter.wins.map((name, index) => ({
      opponent: name,
      credit: index < fighter.elite ? 1.25 : index < fighter.top5 ? 1 : 0.65,
      tierLabel: index < fighter.elite ? 'Elite+ win' : index < fighter.top5 ? 'True top-5 win' : 'Ranked / quality win',
      context: 'UFC-only quality credit.',
      reviewStatus: 'locked'
    }));
  }

  function qualitySummary(fighter) {
    const rows = qualityRows(fighter);
    return {
      fighter: fighter.name,
      rawCredit: round2(rows.reduce((sum, row) => sum + row.credit, 0)),
      diminishedCredit: round2(fighter.c[1] / 2),
      elitePlusWins: fighter.elite,
      topFivePlusWins: fighter.top5,
      rankedQualityWins: fighter.ranked,
      bestWins: fighter.wins.slice(),
      winProfile: `${fighter.elite} Elite+ wins, ${fighter.top5} Top-5+ wins, ${fighter.ranked} ranked quality wins.`,
      rows,
      qualityRows: rows,
      liveScore: fighter.c[1],
      categoryScore: fighter.c[1],
      version: VERSION
    };
  }

  function eraEntry(fighter) {
    const losses = (fighter.losses || []).slice().sort((a, b) => String(a[2] || '').localeCompare(String(b[2] || '')));
    const prePrime = losses.filter(row => row[1].includes('pre-prime'));
    const upward = losses.filter(row => row[1].includes('upward-division'));
    const postPrime = losses.filter(row => row[1].includes('post-prime'));
    const prime = losses.filter(row =>
      row[1].includes('prime') &&
      !row[1].includes('pre-prime') &&
      !row[1].includes('post-prime') &&
      !row[1].includes('upward-division')
    );

    return {
      status: 'locked',
      window: {
        start: fighter.primeStart,
        startLabel: fighter.primeStartLabel,
        end: fighter.primeEnd,
        endLabel: fighter.primeEndLabel,
        endType: fighter.primeEndWin ? 'elite_recovery_win' : prime.length ? 'unrecovered_loss' : 'retirement_or_exit_win',
        endReason: fighter.primeEndWin
          ? `${fighter.primeEndLabel} closes the final sustained elite UFC run with a win.`
          : prime.length
            ? `${prime[prime.length - 1][0]} is the final counted loss in the shared elite UFC window.`
            : 'The UFC elite window closed without a counted loss.',
        canonical: true,
        locked: true,
        lockVersion: VERSION
      },
      lossContext: {
        unrecoveredLoss: prime.length && !fighter.primeEndWin ? lossEvent(prime[prime.length - 1]) : null,
        recoveredLosses: [...prePrime, ...(fighter.primeEndWin ? prime : prime.slice(0, -1))].map(lossEvent),
        upwardDivisionLosses: upward.map(lossEvent),
        postPrimeLosses: postPrime.map(lossEvent),
        weirdResults: (fighter.weirdResults || []).map(lossEvent)
      },
      longevity: {
        gapCapMonths: 18,
        gapAdjustedMonths: fighter.gapMonths,
        activeEliteYears: fighter.years,
        statusMultiplier: fighter.status || 1,
        divisionMultiplier: fighter.mult,
        adjustmentNote: 'Active elite UFC years only; gaps are capped at 18 months.',
        note: `${fighter.primeStartLabel} through ${fighter.primeEndLabel}.`,
        windowLockedPendingRecalculation: false,
        canonicalWindowRecalculated: true,
        canonicalWindowRecalculationVersion: VERSION,
        calculationAsOf: '2026-07-12'
      },
      divisionStrengthContext: `${fighter.label} multiplier ${Number(fighter.mult).toFixed(2)}.`,
      lossContextCompletion: {
        version: VERSION,
        batch: 'eight-legends',
        machineReadable: true,
        completeUfcLossLedger: true,
        source: `${fighter.name} audited UFC-only ledger`,
        completedAt: new Date().toISOString()
      }
    };
  }

  function primeAudit(fighter) {
    const parts = String(fighter.prime).split('-').map(Number);
    const primeWins = parts[0] || 0;
    const primeLosses = parts[1] || 0;
    const primeDraws = parts[2] || 0;
    const primeFights = primeWins + primeLosses + primeDraws;

    return {
      fighter: fighter.name,
      primeRecord: fighter.prime,
      primeWins,
      primeLosses,
      primeDraws,
      primeNCs: 0,
      primeRecordPct: primeFights ? round2((primeWins + primeDraws * 0.5) / primeFights * 100) : 0,
      roundControlPct: fighter.rounds,
      roundControlAudit: {
        fighter: fighter.name,
        roundControlPct: fighter.rounds,
        status: 'locked',
        source: 'Audited UFC fight-level control estimate',
        window: `${fighter.primeStartLabel} → ${fighter.primeEndLabel}`,
        fights: [],
        version: VERSION
      },
      primeFights,
      primeFinishes: Math.round(primeFights * fighter.primeFinish / 100),
      primeFinishRate: fighter.primeFinish,
      eliteStakesBreakdown: {
        titleFightWins: fighter.titles,
        topFiveWins: fighter.top5,
        eliteWins: fighter.elite,
        divisionStrengthContext: fighter.mult
      },
      total: fighter.c[2],
      dominanceProfile: `${fighter.prime} prime, ${fighter.rounds}% estimated round control, ${fighter.primeFinish}% prime-fight finish rate.`,
      status: 'locked',
      primeWindow: { ...eraEntry(fighter).window },
      version: VERSION
    };
  }

  function apexAudit(fighter) {
    return {
      score: fighter.c[4],
      componentTotal: fighter.c[4],
      window: fighter.apexWins.join(' + '),
      performances: fighter.apexWins.map((name, index) => ({
        label: name,
        rating: 9 - index * 0.2,
        note: 'Signature UFC peak performance.'
      })),
      notes: 'UFC-only Apex Peak audit using two wins.',
      version: VERSION
    };
  }

  function compareProfile(fighter) {
    return {
      shortCase: fighter.one,
      peak: `At his UFC best, ${fighter.apexWins.join(' and ')} formed the clearest two-win peak of the run.`,
      resume: `${fighter.record} UFC record with ${fighter.titles} title-fight wins and ${fighter.ranked} ranked quality wins.`,
      championship: `${fighter.titles} UFC title-level wins and ${fighter.adj.toFixed(2)} adjusted title credit.`,
      opponentQuality: `${fighter.elite} Elite+ wins and ${fighter.top5} Top-5+ wins.`,
      longevity: `${fighter.years.toFixed(2)} active elite UFC years after the shared prime window, gap caps, and division context.`,
      edge: fighter.why,
      counter: fighter.whyNot,
      weakness: fighter.whyNot,
      scope: 'UFC accomplishments only; non-UFC achievements are context.',
      signatureWins: fighter.wins.slice(0, 5).join(', '),
      eliteCounter: true
    };
  }

  function boardRow(fighter) {
    return {
      fighter: fighter.name,
      totalScore: totalFor(fighter),
      championship: fighter.c[0],
      opponentQuality: fighter.c[1],
      primeDominance: fighter.c[2],
      longevity: fighter.c[3],
      longevityThirtyPoint: true,
      apexPeak: fighter.c[4],
      penalty: fighter.c[5],
      eraDepthAdjustment: fighter.c[6],
      leaderboard: 'men',
      gender: 'Men',
      ufcRecord: fighter.record,
      primaryDivision: fighter.div,
      secondaryDivision: fighter.div2 || null,
      finishRatePct: fighter.finish,
      primeFinishRatePct: fighter.primeFinish,
      activeEliteYears: fighter.years,
      timesFinishedPrime: fighter.stopped,
      primeStoppageLosses: fighter.stopped,
      primeRecord: fighter.prime,
      roundsWonPct: fighter.rounds,
      eliteWins: fighter.elite,
      elitePlusWins: fighter.elite,
      topFiveWins: fighter.top5,
      topFivePlusWins: fighter.top5,
      rankedQualityWins: fighter.ranked,
      titleFightWins: fighter.titles,
      adjustedTitleWins: fighter.adj,
      divisionStrengthMultiplier: fighter.mult,
      notes: fighter.one
    };
  }

  function profileRow(fighter) {
    const record = parseRecord(fighter.record);
    return {
      id: `B8-${key(fighter.name).replace(/[^a-z0-9]/g, '')}`,
      ...boardRow(fighter),
      scope: 'UFC',
      ufcWins: record.wins,
      ufcLosses: record.losses,
      ufcDraws: record.draws,
      ufcNoContests: record.ncs,
      scoredUfcFights: record.wins + record.losses + record.draws,
      finishWins: Math.round(record.wins * fighter.finish / 100),
      lossPenalty: fighter.c[5],
      primeStart: `${fighter.primeStartLabel} (${String(fighter.primeStart).slice(0, 4)})`,
      primeEnd: `${fighter.primeEndLabel} (${String(fighter.primeEnd).slice(0, 4)})`,
      primeRecordContext: `${fighter.primeStartLabel} → ${fighter.primeEndLabel}`,
      title: titleObject(fighter),
      opponents: qualityRows(fighter).map(row => ({
        opponent: row.opponent,
        division: fighter.div,
        credit: row.credit,
        type: row.tierLabel,
        context: row.context
      })),
      rounds: [],
      notes: 'UFC-only scoring. Non-UFC accomplishments are excluded.',
      compareProfile: compareProfile(fighter)
    };
  }

  function displayOverride(fighter) {
    const compare = compareProfile(fighter);

    return {
      profileDisplayName: DISPLAY_NAMES[fighter.name] || fighter.name,
      divisionLabel: fighter.label,
      resumeTag: fighter.tag,
      oneLiner: fighter.one,
      whyRankedHere: fighter.why,
      whyNotHigher: fighter.whyNot,
      bigAssumptions: [
        ['UFC-only scope', 'Non-UFC achievements are excluded from scoring.'],
        ['Prime window', `${fighter.primeStartLabel} through ${fighter.primeEndLabel}.`],
        ['Loss Context', `Locked penalty target ${fighter.c[5].toFixed(2)} under the shared loss rules.`],
        ['Division strength', `Multiplier ${fighter.mult.toFixed(2)}; era modifier ${fighter.c[6].toFixed(2)}.`]
      ],
      keyJudgmentCalls: [
        ['Best win', fighter.wins[0]],
        ['Title treatment', `${fighter.titles} wins become ${fighter.adj.toFixed(2)} adjusted credit.`],
        ['Photos', 'Only real uploaded WebP assets are used.']
      ],
      compareProfile: compare,
      repoLocations: {
        scoreSource: 'assets/data/canonical-fighter-registry-batch-eight-data.js',
        compareSource: 'assets/data/canonical-fighter-registry-batch-eight.js'
      }
    };
  }

  function registerFight(a, b, fights, winner, summary, importance = 'major') {
    window.COMPARE_FIGHT_LEDGER = window.COMPARE_FIGHT_LEDGER || {};
    const pair = [key(a), key(b)].sort().join('|');
    window.COMPARE_FIGHT_LEDGER[pair] = { fighters: [a, b], fights, winner, importance, summary };
  }

  function registerFightLedger() {
    registerFight('Benson Henderson', 'Frankie Edgar', 2, 'Benson Henderson', 'Henderson won both UFC lightweight title fights; the rematch remains debated.');
    registerFight('Benson Henderson', 'Anthony Pettis', 1, 'Anthony Pettis', 'Pettis submitted Henderson to take the UFC lightweight title. Their earlier WEC fight is outside the scored scope.');
    registerFight('Fabricio Werdum', 'Cain Velasquez', 1, 'Fabricio Werdum', 'Werdum submitted Velasquez to unify the UFC heavyweight title.');
    registerFight('Fabricio Werdum', 'Stipe Miocic', 1, 'Stipe Miocic', 'Miocic knocked Werdum out to win the heavyweight title.');
    registerFight('Fabricio Werdum', 'Travis Browne', 2, 'Fabricio Werdum', 'Werdum beat Browne twice in the UFC.');
    registerFight('Glover Teixeira', 'Jon Jones', 1, 'Jon Jones', 'Jones won their light-heavyweight title fight.');
    registerFight('Glover Teixeira', 'Rashad Evans', 1, 'Glover Teixeira', 'Glover knocked Evans out; the loss is post-prime for Rashad.', 'notable');
    registerFight('Glover Teixeira', 'Jan Blachowicz', 1, 'Glover Teixeira', 'Glover submitted Blachowicz to win the UFC light-heavyweight title.');
    registerFight('Glover Teixeira', 'Jiri Prochazka', 1, 'Jiri Prochazka', 'Prochazka submitted Glover late in their title fight.');
    registerFight('Frank Shamrock', 'Tito Ortiz', 1, 'Frank Shamrock', 'Shamrock stopped Ortiz in his defining final title defense.');
    registerFight('Rashad Evans', 'Forrest Griffin', 1, 'Rashad Evans', 'Evans stopped Griffin to win the title.');
    registerFight('Rashad Evans', 'Chuck Liddell', 1, 'Rashad Evans', 'Evans scored an iconic knockout of Liddell.');
    registerFight('Rashad Evans', 'Jon Jones', 1, 'Jon Jones', 'Jones beat Evans by five-round decision in a title defense.');
    registerFight('Rashad Evans', 'Lyoto Machida', 1, 'Lyoto Machida', 'Machida knocked Evans out to win the title.');
    registerFight('Rashad Evans', 'Tito Ortiz', 2, 'Rashad Evans', 'Their first fight was a draw after a point deduction; Evans stopped Ortiz in the rematch.');
    registerFight('Vitor Belfort', 'Randy Couture', 3, 'Randy Couture', 'Couture won the UFC trilogy 2-1; Belfort’s title win came by an early cut stoppage.');
    registerFight('Vitor Belfort', 'Dan Henderson', 2, 'Vitor Belfort', 'Belfort won both UFC meetings. Their earlier PRIDE fight is outside the scored scope.');
    registerFight('Vitor Belfort', 'Anderson Silva', 1, 'Anderson Silva', 'Silva knocked Belfort out with the iconic front kick.');
    registerFight('Vitor Belfort', 'Jon Jones', 1, 'Jon Jones', 'Jones survived Belfort’s early armbar threat and submitted him.');
    registerFight('Vitor Belfort', 'Lyoto Machida', 1, 'Lyoto Machida', 'Machida knocked Belfort out with a front kick.');
    registerFight('Mauricio "Shogun" Rua', 'Lyoto Machida', 2, 'Split', 'Machida won the first decision; Shogun won the rematch by knockout.');
    registerFight('Mauricio "Shogun" Rua', 'Forrest Griffin', 2, 'Split', 'Each won one UFC fight.');
    registerFight('Mauricio "Shogun" Rua', 'Dan Henderson', 2, 'Dan Henderson', 'Henderson won both UFC meetings, including their Hall of Fame five-round war.');
    registerFight('Mauricio "Shogun" Rua', 'Jon Jones', 1, 'Jon Jones', 'Jones stopped Shogun to win the light-heavyweight title.');
    registerFight('Forrest Griffin', 'Tito Ortiz', 3, 'Forrest Griffin', 'Griffin won the UFC trilogy 2-1.');
    registerFight('Forrest Griffin', 'Anderson Silva', 1, 'Anderson Silva', 'Silva knocked Griffin out in a famous display of striking separation.');
  }

  function installEraLookup() {
    const store = window.UFC_FIGHTER_ERA_LEDGERS;
    if (!store) return;

    store.ledgers = store.ledgers || {};
    FIGHTERS.forEach(fighter => { store.ledgers[fighter.name] = eraEntry(fighter); });
    store.fighters = Array.from(new Set([...(store.fighters || []), ...NAMES]));

    if (!store.__batchEightCanonicalEntryFor) {
      const previous = store.entryFor;
      store.entryFor = name => {
        const fighter = BY_NAME.get(key(name));
        if (fighter) return eraEntry(fighter);
        return typeof previous === 'function' ? previous(name) : store.ledgers?.[name] || null;
      };
      store.__batchEightCanonicalEntryFor = true;
    }
  }

  function installTitleAndQualityLedgers() {
    const titleStore = window.UFC_CHAMPIONSHIP_RESUME_LEDGERS;
    const qualityStore = window.UFC_OPPONENT_QUALITY_LEDGERS;

    FIGHTERS.forEach(fighter => {
      if (titleStore?.ledgers) {
        titleStore.ledgers[fighter.name] = {
          fighter: fighter.name,
          championshipWins: fighter.titleWins.map(row => ({
            opponent: row[0],
            adjustedCredit: row[1],
            reviewStatus: 'locked'
          }))
        };
      }
      if (qualityStore?.raw) {
        qualityStore.raw[fighter.name] = qualityRows(fighter).map(row => [
          row.opponent, row.credit, row.tierLabel, row.context, row.reviewStatus
        ]);
      }
    });
  }

  function registerBase() {
    DATA.men = DATA.men || [];
    DATA.fighters = DATA.fighters || [];
    DATA.primeRecords = DATA.primeRecords || {};
    window.COMPARE_PROFILES = window.COMPARE_PROFILES || {};
    const overrides = displayStore();

    FIGHTERS.forEach(fighter => {
      upsert(DATA.men, boardRow(fighter));
      upsert(DATA.fighters, profileRow(fighter));

      const parts = fighter.prime.split('-').map(Number);
      DATA.primeRecords[fighter.name] = {
        record: fighter.prime,
        context: `${fighter.primeStartLabel} → ${fighter.primeEndLabel}`,
        wins: parts[0] || 0,
        losses: parts[1] || 0,
        draws: parts[2] || 0,
        ncs: 0,
        source: 'Audited UFC-only prime record',
        sourceVersion: VERSION,
        eraWindowLocked: true
      };

      if (overrides) overrides[fighter.name] = { ...(overrides[fighter.name] || {}), ...displayOverride(fighter) };
      window.COMPARE_PROFILES[fighter.name] = {
        ...(window.COMPARE_PROFILES[fighter.name] || {}),
        ...compareProfile(fighter)
      };
    });

    installEraLookup();
    installTitleAndQualityLedgers();
    registerFightLedger();
    applyChampionship();
    return {
      applied: true,
      fighters: NAMES,
      menCount: DATA.men.length,
      profileCount: DATA.fighters.length,
      version: VERSION
    };
  }

  function applyChampionship() {
    FIGHTERS.forEach(fighter => {
      const report = {
        fighter: fighter.name,
        status: 'direct-ledger',
        titleFightWins: fighter.titles,
        adjustedTitleCredit: fighter.adj,
        adjustedTitleWins: fighter.adj,
        reviewStatus: 'locked',
        formulaScore: fighter.c[0],
        wins: fighter.titleWins.map(row => ({ opponent: row[0], adjustedCredit: row[1] })),
        version: VERSION
      };

      allRows(fighter.name).forEach(row => {
        row.championship = fighter.c[0];
        row.championshipResumeLiveAudit = report;
        row.championshipResumeShadowAudit = report;
        row.title = { ...(row.title || {}), ...titleObject(fighter), championshipScore: fighter.c[0] };
      });

      const shadow = window.UFC_CHAMPIONSHIP_RESUME_SHADOW;
      if (shadow?.report) upsertReport(shadow.report, report, (a, b) => Number(b.formulaScore || 0) - Number(a.formulaScore || 0));
    });

    return { applied: true, fighters: NAMES, version: VERSION };
  }

  function applyOpponentQuality() {
    const summaries = new Map();

    FIGHTERS.forEach(fighter => {
      const summary = qualitySummary(fighter);
      summaries.set(key(fighter.name), summary);
      allRows(fighter.name).forEach(row => Object.assign(row, {
        opponentQuality: fighter.c[1],
        opponentQualityLive: true,
        opponentQualityLiveAudit: summary,
        opponentQualityShadowAudit: summary,
        eliteWins: fighter.elite,
        elitePlusWins: fighter.elite,
        topFiveWins: fighter.top5,
        topFivePlusWins: fighter.top5,
        rankedQualityWins: fighter.ranked,
        winProfile: summary.winProfile
      }));
    });

    const audit = window.UFC_OPPONENT_QUALITY_SHADOW_AUDIT;
    if (audit) {
      if (!audit.__batchEightCanonical) {
        const previous = audit.summaryFor;
        audit.summaryFor = name => summaries.get(key(name)) || (typeof previous === 'function' ? previous(name) : null);
        audit.__batchEightCanonical = true;
      }
      audit.report = Array.isArray(audit.report) ? audit.report : [];
      for (const summary of summaries.values()) upsertReport(audit.report, summary, (a, b) => Number(b.diminishedCredit || 0) - Number(a.diminishedCredit || 0));
      audit.fighters = audit.report.length;
    }

    const live = window.UFC_OPPONENT_QUALITY_LIVE;
    if (live) {
      live.report = Array.isArray(live.report) ? live.report : [];
      for (const summary of summaries.values()) upsertReport(live.report, summary, (a, b) => Number(b.liveScore || 0) - Number(a.liveScore || 0));
      live.fighters = live.report.length;
    }

    return { applied: true, fighters: NAMES, version: VERSION };
  }

  function applyPrimeDominance() {
    const entries = new Map(FIGHTERS.map(fighter => [key(fighter.name), primeAudit(fighter)]));

    FIGHTERS.forEach(fighter => {
      const audit = entries.get(key(fighter.name));
      allRows(fighter.name).forEach(row => Object.assign(row, {
        primeRecord: fighter.prime,
        primeDominance: fighter.c[2],
        primeDominanceShadowAudit: audit,
        primeDominanceLiveAudit: audit,
        roundsWonPct: fighter.rounds,
        primeFinishRatePct: fighter.primeFinish,
        timesFinishedPrime: fighter.stopped,
        primeStoppageLosses: fighter.stopped
      }));
    });

    const store = window.UFC_PRIME_DOMINANCE_LEDGERS;
    if (!store?.report) return { applied: false, error: 'Prime Dominance chain not ready' };

    if (!store.__batchEightCanonical) {
      const previous = store.entryFor;
      store.entryFor = name => entries.get(key(name)) || (typeof previous === 'function' ? previous(name) : null);
      store.__batchEightCanonical = true;
    }

    for (const audit of entries.values()) upsertReport(store.report, audit, (a, b) => Number(b.total || 0) - Number(a.total || 0));
    store.applied = Array.from(new Set([...(store.applied || []), ...NAMES]));
    store.leaders = store.report.slice(0, 15);
    if (window.UFC_PRIME_DOMINANCE_SHADOW_MODEL) window.UFC_PRIME_DOMINANCE_SHADOW_MODEL.report = store.report;

    return { applied: true, fighters: NAMES, version: VERSION };
  }

  function applyApexPeak() {
    FIGHTERS.forEach(fighter => {
      const audit = apexAudit(fighter);
      allRows(fighter.name).forEach(row => Object.assign(row, {
        apexPeak: fighter.c[4],
        apexPeakAudit: audit,
        apexPeakBonusLive: true,
        apexPeakBonusVersion: VERSION
      }));

      const override = displayStore()?.[fighter.name];
      if (override) override.apexPeakAudit = audit;

      const component = window.UFC_APEX_PEAK_COMPONENT_AUDIT;
      if (component) {
        component.componentOverrides = component.componentOverrides || {};
        component.componentOverrides[fighter.name] = audit;
      }
    });

    return { applied: true, fighters: NAMES, version: VERSION };
  }

  function finalize() {
    installEraLookup();
    registerFightLedger();

    FIGHTERS.forEach(fighter => {
      allRows(fighter.name).forEach(row => Object.assign(row, {
        ufcRecord: fighter.record,
        primeRecord: fighter.prime,
        finishRatePct: fighter.finish,
        primeFinishRatePct: fighter.primeFinish,
        roundsWonPct: fighter.rounds,
        activeEliteYears: fighter.years,
        timesFinishedPrime: fighter.stopped,
        primeStoppageLosses: fighter.stopped,
        eliteWins: fighter.elite,
        elitePlusWins: fighter.elite,
        topFiveWins: fighter.top5,
        topFivePlusWins: fighter.top5,
        rankedQualityWins: fighter.ranked,
        eraDepthAdjustment: fighter.c[6]
      }));
    });

    return {
      applied: true,
      fighters: NAMES.map(name => {
        const row = DATA.men.find(item => key(item.fighter) === key(name));
        return {
          fighter: name,
          rank: row?.rank,
          totalScore: row?.totalScore,
          overallOvr: row?.overallOvr,
          penalty: row?.penalty,
          longevity: row?.longevity
        };
      }),
      menCount: DATA.men.length,
      version: VERSION
    };
  }

  const API = {
    version: VERSION,
    fighters: NAMES,
    registerBase,
    applyChampionship,
    applyOpponentQuality,
    applyPrimeDominance,
    applyApexPeak,
    finalize
  };

  function wrap(stage, baseResult, batchResult) {
    return {
      applied: Boolean(baseResult?.applied) && Boolean(batchResult?.applied),
      stage,
      version: `${BASE.version}+${VERSION}`,
      fighters: Array.from(new Set([...(BASE.fighters || []), ...NAMES])),
      base: baseResult,
      batch: batchResult,
      error: baseResult?.error || batchResult?.error || null
    };
  }

  window.UFC_BATCH_EIGHT_FIGHTER_REGISTRY = API;
  window.UFC_CANONICAL_FIGHTER_REGISTRY = {
    ...BASE,
    version: `${BASE.version}+${VERSION}`,
    fighters: Array.from(new Set([...(BASE.fighters || []), ...NAMES])),
    registerBase() { return wrap('registerBase', BASE.registerBase(), API.registerBase()); },
    applyChampionship() { return wrap('applyChampionship', BASE.applyChampionship(), API.applyChampionship()); },
    applyOpponentQuality() { return wrap('applyOpponentQuality', BASE.applyOpponentQuality(), API.applyOpponentQuality()); },
    applyPrimeDominance() { return wrap('applyPrimeDominance', BASE.applyPrimeDominance(), API.applyPrimeDominance()); },
    applyApexPeak() { return wrap('applyApexPeak', BASE.applyApexPeak(), API.applyApexPeak()); },
    finalize() { return wrap('finalize', BASE.finalize(), API.finalize()); }
  };

  document.documentElement.setAttribute('data-batch-eight-fighter-registry-ready', VERSION);
})();

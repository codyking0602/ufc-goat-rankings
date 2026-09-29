(function () {
  function normalizeKey(a, b) {
    return [String(a || '').toLowerCase(), String(b || '').toLowerCase()].sort().join('|');
  }

  function patchFighter(boardName, fighterName, patch) {
    const data = window.RANKING_DATA;
    const board = data && data[boardName];
    if (!Array.isArray(board)) return;
    const row = board.find(f => f.fighter === fighterName);
    if (row) Object.assign(row, patch);
  }

  function mergeProfile(fighter, profile) {
    window.COMPARE_PROFILES = window.COMPARE_PROFILES || {};
    const existing = window.COMPARE_PROFILES[fighter] || {};
    window.COMPARE_PROFILES[fighter] = {
      ...existing,
      ...profile,
      legacyStats: {
        ...(existing.legacyStats || {}),
        ...(profile.legacyStats || {})
      }
    };

    if (typeof DISPLAY_OVERRIDES !== 'undefined') {
      DISPLAY_OVERRIDES[fighter] = DISPLAY_OVERRIDES[fighter] || {};
      DISPLAY_OVERRIDES[fighter].compareProfile = {
        ...(DISPLAY_OVERRIDES[fighter].compareProfile || {}),
        ...window.COMPARE_PROFILES[fighter],
        legacyStats: {
          ...((DISPLAY_OVERRIDES[fighter].compareProfile || {}).legacyStats || {}),
          ...(window.COMPARE_PROFILES[fighter].legacyStats || {})
        }
      };
    }
  }

  const SCORE_PATCHES = [
    {
      board: 'men',
      fighter: 'Georges St-Pierre',
      patch: { timesFinishedPrime: 1 }
    },
    {
      board: 'men',
      fighter: 'Charles Oliveira',
      patch: {
        totalScore: 40.13,
        championship: 5.32,
        opponentQuality: 17.85,
        primeDominance: 20.96,
        longevity: 5.99,
        penalty: -10.00,
        ufcRecord: '25-11, 1 NC',
        timesFinishedPrime: 2,
        activeEliteYears: 5.99,
        notes: 'Audited scoring: prime starts with Kevin Lee; Gaethje win credited as 0.90 adjusted title-level win because Oliveira missed championship weight; loss penalty capped at -10.00.'
      }
    },
    {
      board: 'men',
      fighter: 'Ilia Topuria',
      patch: {
        totalScore: 43.44,
        championship: 5.99,
        opponentQuality: 13.10,
        primeDominance: 23.60,
        longevity: 2.97,
        penalty: -2.25,
        ufcRecord: '9-1',
        timesFinishedPrime: 1,
        activeEliteYears: 2.97,
        notes: 'Audited scoring: prime starts with Josh Emmett; includes Volkanovski, Holloway, and Charles Oliveira title-level wins; Gaethje title loss counted as strict prime finished loss.'
      }
    },
    {
      board: 'men',
      fighter: 'Petr Yan',
      patch: {
        totalScore: 43.35,
        championship: 5.04,
        opponentQuality: 13.10,
        primeDominance: 21.43,
        longevity: 5.98,
        penalty: -5.25,
        ufcRecord: '12-4',
        timesFinishedPrime: 0,
        activeEliteYears: 5.98,
        notes: 'Audited scoring: Sterling DQ reduced to -0.75; Sterling 2, O\'Malley, and Merab 1 count as prime elite losses at -1.50 each; no finish add-ons.'
      }
    }
  ];

  SCORE_PATCHES.forEach(({ board, fighter, patch }) => patchFighter(board, fighter, patch));

  const PACK_PROFILES = {
    'Jon Jones': {
      shortCase: 'Jones is the UFC-only benchmark case: unmatched title-fight volume, elite light heavyweight dominance, a heavyweight title chapter, and no real competitive loss inside the scoring rules.',
      peak: 'At his best, Jones blended range, wrestling, clinch offense, elbows, submissions, adaptability, and fight IQ better than any long-reign champion in the ranking.',
      resume: 'Jones owns the strongest UFC-only résumé: a deep light heavyweight title run, wins over multiple champions, heavyweight title value, and official blemishes that need context more than score damage.',
      championship: 'The championship case is the separator. Jones has the most valuable title-level résumé in the system and remains the 99 OVR benchmark.',
      opponentQuality: 'Cormier, Gustafsson, Shogun, Machida, Rashad, Rampage, Glover, Bader, Gane, and Stipe give Jones a deep champion-heavy ledger.',
      longevity: 'Jones stayed title-level across a long UFC window, with long inactivity gaps capped rather than counted as extra longevity.',
      counter: 'The counterargument is context: the Cormier no contest, outside-cage issues, and close late light heavyweight fights against Santos and Reyes. None moves him off #1 under the UFC-only scoring rules.',
      edge: 'Jones wins comparisons when title-fight volume, championship weight, opponent quality, and no real competitive loss penalty matter most.',
      eliteCounter: true,
      signatureWins: 'Cormier, Gustafsson, Shogun, Machida, Rashad, Rampage, Glover, Bader, Gane, and Stipe anchor the strongest UFC-only title résumé.',
      titleSummary: 'Jones is the title-volume benchmark: dominant light heavyweight champion, later heavyweight title winner, and still the 99 OVR anchor.',
      primeSummary: 'His prime combined round control, finishing danger, durability, and adaptability across multiple eras of elite opponents.',
      titleStyle: 'ufcGoatBenchmark',
      primeStyle: 'completeLongReignPrime',
      legacyStats: {
        titleFightWins: 15,
        beltsWon: 2,
        titleDefenses: 11,
        activeEliteYearsLabel: 'roughly 11 active elite years',
        primeNote: 'long elite title run with the Hamill DQ treated as official-record context, not a competitive loss'
      }
    },
    'Georges St-Pierre': {
      shortCase: 'GSP is the clean complete-champion case: elite welterweight title control, unmatched opponent-quality depth, dominant round-winning, and a second-division title win.',
      peak: 'At his best, GSP was jab, timing, wrestling, top control, transitions, cardio, discipline, and game-planning. He beat elite opponents by making fights happen on his terms.',
      resume: 'GSP has the deepest opponent-quality case in the system, avenged both UFC losses, and added middleweight title value against Bisping.',
      championship: 'The championship case is elite: welterweight title reign, interim title value, and a second-division undisputed title win.',
      opponentQuality: 'Hughes, Penn, Serra, Fitch, Alves, Condit, Diaz, Hendricks, Shields, Koscheck, Sherk, and Bisping give GSP the strongest quality-wins ledger.',
      longevity: 'GSP stayed elite for years, then returned after a long layoff to win the middleweight title without letting the late career damage pile up.',
      counter: 'The Serra upset is the major mark. GSP also has a lower finish rate than some other GOAT candidates and only one middleweight fight rather than a full second reign.',
      edge: 'GSP wins comparisons when opponent depth, title control, round dominance, and clean résumé management outweigh a flashier peak from the other fighter.',
      eliteCounter: true,
      signatureWins: 'Hughes twice, Penn twice, Serra revenge, Fitch, Alves, Condit, Diaz, Hendricks, Shields, Koscheck, Sherk, and Bisping give GSP unmatched UFC quality depth.',
      titleSummary: 'GSP ruled welterweight, avenged both UFC losses, and added a second-division title win over Bisping.',
      primeSummary: 'His prime was built on dominant round control, elite game-planning, and very few uncontrolled moments after the Serra loss.',
      titleStyle: 'completeWelterweightStandard',
      primeStyle: 'cleanRoundControlPrime',
      legacyStats: {
        titleFightWins: 13,
        beltsWon: 2,
        titleDefenses: 9,
        activeEliteYearsLabel: 'roughly 9 active elite years',
        primeNote: 'complete welterweight reign with Serra 2007 counted as one prime finish loss'
      }
    },
    'Charles Oliveira': {
      shortCase: 'Oliveira is the chaos-champion finishing case: all-time UFC finishing records, a late lightweight title surge, and elite wins in a brutal modern lightweight era.',
      peak: 'At his best, Charles was pressure, submission threat, clinch danger, opportunistic striking, and comeback chaos. He could look vulnerable and still end fights instantly.',
      resume: 'Charles has a messy record but a serious UFC-only résumé: lightweight title win, Dustin defense, Gaethje title-level win, and major late-prime quality wins.',
      championship: 'The title case is real but not long-reign clean: vacant title win over Chandler, defense over Poirier, and adjusted title-level Gaethje credit because of the scale issue.',
      opponentQuality: 'Chandler twice, Poirier, Gaethje, Dariush, Gamrot, Holloway, Ferguson, and Kevin Lee give Charles one of the best modern lightweight ledgers.',
      longevity: 'Charles has a long UFC story, but only active elite years count. His true elite window starts with Kevin Lee under the locked audit.',
      counter: 'The case is capped by losses. Charles has too many UFC losses to look like a clean all-time champion case, and the Islam/Ilia finish losses hurt the ceiling.',
      edge: 'Charles wins comparisons when elite finishing value, modern lightweight quality wins, and title-surge impact outweigh a cleaner but less explosive résumé.',
      eliteCounter: true,
      signatureWins: 'Chandler, Poirier, Gaethje, Dariush, Gamrot, Holloway, Ferguson, and Kevin Lee anchor Charles’ modern lightweight case.',
      titleSummary: 'Charles won the lightweight title, defended against Poirier, and gets adjusted title-level credit for beating Gaethje despite the weight-miss complication.',
      primeSummary: 'His prime is a late-career lightweight surge built on chaos, finishes, and elite quality wins rather than a long clean reign.',
      titleStyle: 'chaosLightweightChampion',
      primeStyle: 'lateFinishingSurge',
      legacyStats: {
        titleFightWins: 2,
        beltsWon: 1,
        titleDefenses: 1,
        activeEliteYearsLabel: 'roughly 6 active elite years',
        primeNote: 'late elite lightweight surge starting with Kevin Lee; loss penalty reaches the cap'
      }
    },
    'Petr Yan': {
      shortCase: 'Yan is the technical bantamweight championship-depth case: title win, interim title win, rebound title value, and official losses with important context.',
      peak: 'At his best, Yan was layered boxing, stance switching, takedown defense, body work, pressure, and late-fight reads. He could win rounds without needing wild finishing swings.',
      resume: 'Yan has a strong modern bantamweight résumé with Aldo, Sandhagen, Song, Deiveson, McGhee, and Merab title-rematch value, but the official losses keep the case from being clean.',
      championship: 'The championship case is strong but broken up: vacant title over Aldo, interim title over Sandhagen, and later undisputed title value in the locked audit assumptions.',
      opponentQuality: 'Aldo, Sandhagen, Song, Deiveson, McGhee, Merab, and Faber give Yan a strong modern bantamweight ledger.',
      longevity: 'Yan has a meaningful active elite window, but not a decade-long reign. His case is quality and title-level consistency more than huge calendar longevity.',
      counter: 'The Sterling DQ, Sterling rematch loss, O’Malley split, and first Merab loss all keep the résumé from looking spotless.',
      edge: 'Yan wins comparisons when technical level, bantamweight depth, clean no-finish-loss durability, and context around official losses matter most.',
      eliteCounter: true,
      signatureWins: 'Aldo, Sandhagen, Song, Deiveson, McGhee, Merab, and Faber give Yan one of the deeper modern bantamweight win lists.',
      titleSummary: 'Yan’s title case includes vacant undisputed, interim, and rebound undisputed title value under the locked audit treatment.',
      primeSummary: 'His prime is a technical round-control bantamweight run with frustrating official-loss context but no prime finish losses.',
      titleStyle: 'technicalBantamweightChampion',
      primeStyle: 'roundControlTechnicalPrime',
      legacyStats: {
        titleFightWins: 3,
        beltsWon: 1,
        titleDefenses: 0,
        activeEliteYearsLabel: 'roughly 6 active elite years',
        primeNote: 'technical bantamweight prime with DQ/split/rivalry context shaping the résumé'
      }
    }
  };

  Object.entries(PACK_PROFILES).forEach(([fighter, profile]) => mergeProfile(fighter, profile));

  const PACK_LEDGER = {
    [normalizeKey('Jon Jones', 'Daniel Cormier')]: {
      fighters: ['Jon Jones', 'Daniel Cormier'],
      fights: 2,
      winner: 'Jon Jones',
      importance: 'major',
      summary: 'Jones beat Cormier in their first light heavyweight title fight, and the second meeting became a no contest. The rivalry still creates clear separation in Jones’ favor in the UFC-only GOAT debate.'
    },
    [normalizeKey('Jon Jones', 'Alexander Gustafsson')]: {
      fighters: ['Jon Jones', 'Alexander Gustafsson'],
      fights: 2,
      winner: 'Jon Jones',
      importance: 'major',
      summary: 'Gustafsson pushed Jones hard in their first title fight, but Jones won the official decision and later stopped him in the rematch. The rivalry adds toughness context without taking the edge from Jones.'
    },
    [normalizeKey('Jon Jones', 'Dominick Reyes')]: {
      fighters: ['Jon Jones', 'Dominick Reyes'],
      fights: 1,
      winner: 'Jon Jones',
      importance: 'contextual',
      summary: 'Jones beat Reyes by official decision in a controversial late light heavyweight title defense. It matters as close-fight context, but it remains an official UFC title win.'
    },
    [normalizeKey('Jon Jones', 'Matt Hamill')]: {
      fighters: ['Jon Jones', 'Matt Hamill'],
      fights: 1,
      winner: 'Matt Hamill',
      importance: 'contextual',
      summary: 'Hamill is the official DQ loss on Jones’ record, but it is not treated like a real competitive defeat in this UFC-only scoring system.'
    },
    [normalizeKey('Georges St-Pierre', 'B.J. Penn')]: {
      fighters: ['Georges St-Pierre', 'B.J. Penn'],
      fights: 2,
      winner: 'Georges St-Pierre',
      importance: 'major',
      summary: 'GSP beat Penn twice, including a dominant championship rematch. That creates clear separation between them in the UFC-only all-time debate.'
    },
    [normalizeKey('Georges St-Pierre', 'Matt Hughes')]: {
      fighters: ['Georges St-Pierre', 'Matt Hughes'],
      fights: 3,
      winner: 'Georges St-Pierre',
      importance: 'major',
      summary: 'Hughes submitted GSP in their first fight, but GSP won the next two and took the welterweight rivalry separation. The first loss remains pre-prime elite-loss context.'
    },
    [normalizeKey('Georges St-Pierre', 'Matt Serra')]: {
      fighters: ['Georges St-Pierre', 'Matt Serra'],
      fights: 2,
      winner: 'Split',
      importance: 'major',
      summary: 'Serra’s upset is the biggest blemish on GSP’s GOAT case, but GSP dominated the rematch to regain the title. The loss matters; the revenge win stabilizes the résumé.'
    },
    [normalizeKey('Georges St-Pierre', 'Johny Hendricks')]: {
      fighters: ['Georges St-Pierre', 'Johny Hendricks'],
      fights: 1,
      winner: 'Georges St-Pierre',
      importance: 'contextual',
      summary: 'GSP beat Hendricks by official split decision in a controversial title fight. The official win counts, but the closeness is part of the late-prime context.'
    },
    [normalizeKey('Charles Oliveira', 'Dustin Poirier')]: {
      fighters: ['Charles Oliveira', 'Dustin Poirier'],
      fights: 1,
      winner: 'Charles Oliveira',
      importance: 'major',
      summary: 'Oliveira submitted Poirier in a lightweight title defense. Dustin has the deeper long-form lightweight ledger, but Charles owns the direct championship result.'
    },
    [normalizeKey('Charles Oliveira', 'Max Holloway')]: {
      fighters: ['Charles Oliveira', 'Max Holloway'],
      fights: 1,
      winner: 'Charles Oliveira',
      importance: 'major',
      summary: 'Oliveira beat Holloway 50-45, giving Charles the clear direct lightweight/BMF chapter. Max can still own the deeper total UFC résumé, but the head-to-head is strongly Charles.'
    },
    [normalizeKey('Charles Oliveira', 'Ilia Topuria')]: {
      fighters: ['Charles Oliveira', 'Ilia Topuria'],
      fights: 1,
      winner: 'Ilia Topuria',
      importance: 'major',
      summary: 'Topuria beat Oliveira in a lightweight title fight, giving Ilia the direct high-end edge. Charles has more UFC volume and finishing records; Ilia owns the sharper peak result.'
    },
    [normalizeKey('Charles Oliveira', 'Tony Ferguson')]: {
      fighters: ['Charles Oliveira', 'Tony Ferguson'],
      fights: 1,
      winner: 'Charles Oliveira',
      importance: 'major',
      summary: 'Oliveira dominated Ferguson in a key lightweight contender fight, a major bridge win before Charles’ title surge and a clear late-prime ceiling point for Tony.'
    },
    [normalizeKey('Charles Oliveira', 'Justin Gaethje')]: {
      fighters: ['Charles Oliveira', 'Justin Gaethje'],
      fights: 1,
      winner: 'Charles Oliveira',
      importance: 'major',
      summary: 'Oliveira submitted Gaethje in a title-level fight. The weight-miss context keeps it from being a clean full defense, but the performance still carries major title-level value.'
    },
    [normalizeKey('Petr Yan', 'Aljamain Sterling')]: {
      fighters: ['Petr Yan', 'Aljamain Sterling'],
      fights: 2,
      winner: 'Aljamain Sterling',
      importance: 'major',
      summary: 'Sterling owns the official rivalry edge, but the first win was a DQ and the second fight was competitive. This rivalry needs context because the official results do not tell the whole Yan case.'
    },
    [normalizeKey('Petr Yan', 'Merab Dvalishvili')]: {
      fighters: ['Petr Yan', 'Merab Dvalishvili'],
      fights: 2,
      winner: 'Split',
      importance: 'major',
      summary: 'Merab overwhelmed Yan in the first meeting, while Yan later answered with title-level rematch value under the locked audit assumptions. The split keeps both bantamweight cases connected.'
    },
    [normalizeKey('Petr Yan', 'Sean O\'Malley')]: {
      fighters: ['Petr Yan', 'Sean O\'Malley'],
      fights: 1,
      winner: 'Sean O\'Malley',
      importance: 'major',
      summary: 'O’Malley owns the official split-decision win over Yan. It matters, but the closeness and Yan’s broader title-level volume keep the total résumé comparison more complicated.'
    },
    [normalizeKey('Petr Yan', 'Jose Aldo')]: {
      fighters: ['Petr Yan', 'Jose Aldo'],
      fights: 1,
      winner: 'Petr Yan',
      importance: 'major',
      summary: 'Yan stopped Aldo to win the vacant bantamweight title. It gives Yan a direct title win over Aldo, while Aldo’s wider UFC résumé still carries more total legacy context.'
    },
    [normalizeKey('Ilia Topuria', 'Alexander Volkanovski')]: {
      fighters: ['Ilia Topuria', 'Alexander Volkanovski'],
      fights: 1,
      winner: 'Ilia Topuria',
      importance: 'major',
      summary: 'Topuria knocked out Volkanovski to win the featherweight title, giving Ilia a direct era-shifting win over one of the division’s greatest champions.'
    },
    [normalizeKey('Ilia Topuria', 'Max Holloway')]: {
      fighters: ['Ilia Topuria', 'Max Holloway'],
      fights: 1,
      winner: 'Ilia Topuria',
      importance: 'major',
      summary: 'Topuria beat Holloway in a major featherweight legacy fight. Max still owns the longer all-time résumé, but Ilia owns the direct result.'
    },
    [normalizeKey('Ilia Topuria', 'Charles Oliveira')]: {
      fighters: ['Ilia Topuria', 'Charles Oliveira'],
      fights: 1,
      winner: 'Ilia Topuria',
      importance: 'major',
      summary: 'Topuria beat Oliveira in a lightweight title fight, adding a second-division championship peak to Ilia’s short but loud UFC résumé.'
    }
  };

  window.COMPARE_FIGHT_LEDGER = {
    ...(window.COMPARE_FIGHT_LEDGER || {}),
    ...PACK_LEDGER
  };

  window.LIVE_INTEGRATION_PACK_V1_APPLIED = true;
})();

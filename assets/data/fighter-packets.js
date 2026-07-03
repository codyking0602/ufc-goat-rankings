// Central fighter app-content packets.
// Goal: one obvious place for fighter-facing content going forward.
// Scoring rows still live in assets/data/ranking-data.js until the scoring model is refactored.
(function(){
  const VERSION = 'fighter-packets-20260702b';

  const FIGHTER_PACKETS = {
    'Jon Jones': {
      status: {
        stage: 'complete in packet system',
        lastUpdated: '2026-07-02',
        nextFix: 'None for Jon. Migrate GSP next.'
      },
      repoLocations: {
        scoreSource: 'assets/data/ranking-data.js',
        centralPacket: 'assets/data/fighter-packets.js',
        displayFallback: 'assets/data/display-overrides.js',
        compareFallback: 'assets/compare-data.js',
        watchFallback: 'assets/js/watch-moments.js',
        photos: 'assets/fighters/jon-jones.webp and assets/fighters/jon-jones-thumb.webp'
      },
      photos: {
        photoUrl: 'assets/fighters/jon-jones.webp',
        thumbUrl: 'assets/fighters/jon-jones-thumb.webp'
      },
      display: {
        overallOvr: 99,
        allTimeRank: 1,
        divisionLabel: 'LHW / HW',
        resumeTag: 'UFC benchmark resume',
        oneLiner: 'The benchmark UFC resume: unmatched title-fight success, elite quality wins, long-term dominance, and no true competitive loss.'
      },
      profileStats: {
        ufcRecord: '22-1, 1 NC',
        titleFightWins: 16,
        adjustedTitleWins: 15.8,
        finishRatePct: 52.2,
        activeEliteYears: 10.82,
        primeRecordLabel: 'Essentially unbeaten',
        lossContext: 'Hamill DQ is official, but not treated as a true competitive loss.',
        notFinishedContext: 'Never finished in the UFC.'
      },
      compareSeasoning: {
        shortCase: 'The UFC-only GOAT benchmark: unmatched title-fight volume, elite opponent depth, two-division champion status, and no true competitive UFC loss.',
        peak: 'At his peak, Jon was a matchup nightmare: length, wrestling, clinch damage, creativity, fight IQ, durability, and defensive composure all stacked together. He did not just beat elite light heavyweights; he usually made their strengths look unusable.',
        resume: 'Jon\'s resume is built on repeated championship wins over elite names across multiple eras, then capped by moving up and winning the heavyweight title. In a UFC-only comparison, his volume of title-level success is the standard everyone else is chasing.',
        championship: 'His championship case is the strongest in the ranking: long light heavyweight reign, repeated UFC title-fight wins, and a second UFC belt at heavyweight.',
        opponentQuality: 'Jon\'s opponent list is loaded with former champions, future Hall of Fame names, and elite contenders. The strength of his case is not one signature win; it is how many high-level names he stacked.',
        longevity: 'Jon stayed elite for an unusually long time, from his early light heavyweight title run through his heavyweight title win. Even when the dominance faded late, he was still winning at the highest level.',
        counter: 'The case against Jon is cleanliness: late-career performances were less dominant, Gustafsson and Reyes created real debate, the heavyweight sample is thin, and some fans will always hold the official Hamill DQ, no contest, or outside-the-cage issues against the resume.',
        edge: 'Jon\'s edge is championship volume plus opponent depth. Other fighters may have cleaner stories, prettier peaks, or fewer caveats, but Jon\'s UFC-only resume has the most total weight.',
        signatureWins: 'Cormier, Gustafsson, Shogun, Machida, Rashad, Rampage, Glover, Belfort, and Gane give Jon a title-level win stack that almost nobody can match.',
        weakness: 'Late-prime dominance dipped, Reyes and Gustafsson created real debate, the heavyweight resume is short, and the Hamill DQ needs context even though this model does not treat it as a true competitive loss.',
        titleSummary: 'UFC light heavyweight champion, UFC heavyweight champion, and the strongest UFC title-fight resume in the system.',
        primeSummary: 'Long prime built around elite control, adaptability, durability, and the ability to beat championship-level opponents in different styles of fights.',
        titleStyle: 'Championship Volume King',
        primeStyle: 'Matchup Nightmare',
        bestArgument: 'Jon\'s best argument is total UFC-only weight: the deepest title-fight resume, elite opponent depth across eras, two-division champion value, and no true competitive UFC loss.',
        hamillContext: 'The Matt Hamill DQ is official, but this ranking does not treat it as a true competitive loss.',
        cleanResumeCounter: 'GSP, Khabib, and DJ can argue cleaner resumes in different ways; Jon\'s answer is that his championship volume and opponent depth still carry more total UFC-only weight.',
        betterFighterVsGoat: 'Skill-for-skill debates can get closer, but the UFC-only GOAT resume benchmark remains Jon because of title volume, opponent depth, and multi-era championship success.',
        eliteCounter: true,
        legacyStats: {
          ufcRecord: '22-1, 1 NC',
          trueCompetitiveUfcLosses: 0,
          titleFightWins: 16,
          beltsWon: 2,
          titleDefenses: 11,
          divisions: 'LHW / HW',
          neverFinishedInUfc: true,
          activeEliteYearsLabel: 'roughly 12 active elite years',
          primeNote: 'multi-era elite run from young light heavyweight champion to later heavyweight title winner, with late-career close-fight context but no true competitive UFC loss'
        }
      },
      watchMoment: {
        url: 'https://youtube.com/shorts/yG-D2r6HVp4?is=fstX4Wc_rvCITSw0',
        label: 'Watch Moment'
      }
    }
  };

  function mergeLegacyStats(existingStats, packetStats) {
    return {
      ...(existingStats || {}),
      ...(packetStats || {})
    };
  }

  function mergeCompareProfile(existingProfile, packetProfile) {
    return {
      ...(existingProfile || {}),
      ...(packetProfile || {}),
      legacyStats: mergeLegacyStats((existingProfile || {}).legacyStats, (packetProfile || {}).legacyStats)
    };
  }

  function applyDisplay(name, packet) {
    if (typeof DISPLAY_OVERRIDES === 'undefined') return;
    DISPLAY_OVERRIDES[name] = DISPLAY_OVERRIDES[name] || {};
    DISPLAY_OVERRIDES[name] = {
      ...DISPLAY_OVERRIDES[name],
      ...(packet.display || {}),
      ...(packet.photos || {})
    };
    if (packet.watchMoment?.url) {
      DISPLAY_OVERRIDES[name].watchUrl = packet.watchMoment.url;
      DISPLAY_OVERRIDES[name].watchLabel = packet.watchMoment.label || 'Watch Moment';
    }
    DISPLAY_OVERRIDES[name].packetProfileStats = {
      ...(DISPLAY_OVERRIDES[name].packetProfileStats || {}),
      ...(packet.profileStats || {})
    };
    DISPLAY_OVERRIDES[name].packetStatus = packet.status || {};
    DISPLAY_OVERRIDES[name].repoLocations = packet.repoLocations || {};
  }

  function applyCompare(name, packet) {
    if (!packet.compareSeasoning) return;
    window.COMPARE_PROFILES = window.COMPARE_PROFILES || {};
    window.COMPARE_PROFILES[name] = mergeCompareProfile(window.COMPARE_PROFILES[name], packet.compareSeasoning);
    if (typeof DISPLAY_OVERRIDES !== 'undefined') {
      DISPLAY_OVERRIDES[name] = DISPLAY_OVERRIDES[name] || {};
      DISPLAY_OVERRIDES[name].compareProfile = mergeCompareProfile(DISPLAY_OVERRIDES[name].compareProfile, window.COMPARE_PROFILES[name]);
    }
  }

  function applyPackets() {
    Object.entries(FIGHTER_PACKETS).forEach(([name, packet]) => {
      applyDisplay(name, packet);
      applyCompare(name, packet);
    });
    window.UFC_FIGHTER_PACKET_SYSTEM = {
      version: VERSION,
      purpose: 'Central source for fighter-facing app content during migration.',
      fighters: Object.keys(FIGHTER_PACKETS),
      appliedAt: new Date().toISOString()
    };
  }

  window.UFC_FIGHTER_PACKETS = FIGHTER_PACKETS;
  applyPackets();
})();

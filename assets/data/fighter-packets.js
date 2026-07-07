// Do not add new fighter data here.
// LEGACY: fighter data has been migrated to assets/data/ranking-data.js.
// Central fighter app-content packets.
// Goal: one obvious place for fighter-facing content going forward.
// Scoring rows still live in assets/data/ranking-data.js until the scoring model is refactored.
(function(){
  const VERSION = 'fighter-packets-20260702c';

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
        oneLiner: 'The benchmark UFC resume: unmatched title-fight success, elite quality wins, long-term dominance, and no true competitive loss.',
        categories: {
          championship: { ovr: 99, rank: 1 },
          opponentQuality: { ovr: 98, rank: 1 },
          primeDominance: { ovr: 96, rank: 3 },
          longevity: { ovr: 98, rank: 1 }
        },
        snapshot: [
          ['UFC Record', '22-1, 1 NC'],
          ['UFC Title-Fight Wins', '16'],
          ['Championship Level', 'All-Time Best'],
          ['Elite Wins', 'All-Time Best Tier'],
          ['Prime Record', 'Essentially Unbeaten'],
          ['Active Elite Years', 'Elite Longevity'],
          ['Loss Context', 'No true competitive loss']
        ],
        whyRankedHere: 'Jones ranks #1 because he has the strongest UFC championship resume ever, the best title-fight win total, elite wins across multiple eras, and one of the longest elite runs in UFC history. His resume combines championship success, quality wins, prime dominance, and longevity better than anyone else.',
        whyNotLower: 'The main arguments against Jones are close fights, inactivity gaps, late-career sample size at heavyweight, and outside-the-cage controversy. But as a UFC resume, his in-cage case still has the strongest overall combination of title success, elite opponents, dominance, and longevity.',
        keyJudgmentCalls: [
          ['Matt Hamill DQ', 'not treated as a true competitive loss.'],
          ['Daniel Cormier NC', 'not counted as a win, but the broader Cormier rivalry still matters in context.'],
          ['Heavyweight run', 'boosts the resume, but does not carry the case by itself.'],
          ['Close fights', 'Santos/Reyes slightly affect dominance, but not enough to move him from #1.'],
          ['Controversy', 'acknowledged in context, while the profile stays focused on the UFC resume.']
        ],
        finalTakeaway: 'Jones is the UFC benchmark: the deepest championship resume, elite quality wins, rare longevity, and no true competitive loss. He is the 99 OVR standard every other fighter is measured against.'
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
    },
    'Georges St-Pierre': {
      status: {
        stage: 'complete in packet system',
        lastUpdated: '2026-07-02',
        nextFix: 'None for GSP. Migrate Demetrious Johnson next.'
      },
      repoLocations: {
        scoreSource: 'assets/data/ranking-data.js',
        centralPacket: 'assets/data/fighter-packets.js',
        displayFallback: 'assets/data/display-overrides.js',
        compareFallback: 'assets/compare-data.js',
        profileStatsFallback: 'assets/js/fighter-profile-packages.js',
        watchFallback: 'assets/js/watch-moments.js',
        photos: 'assets/fighters/georges-st-pierre.webp and assets/fighters/georges-st-pierre-thumb.webp'
      },
      photos: {
        photoUrl: 'assets/fighters/georges-st-pierre.webp',
        thumbUrl: 'assets/fighters/georges-st-pierre-thumb.webp'
      },
      display: {
        overallOvr: 96,
        allTimeRank: 2,
        divisionLabel: 'WW / MW',
        resumeTag: 'Complete all-time resume',
        oneLiner: 'The complete UFC resume: a legendary welterweight reign, elite quality wins, and one of the cleanest prime runs in the sport.',
        categories: {
          championship: { ovr: 94, rank: 2 },
          opponentQuality: { ovr: 99, rank: 1 },
          primeDominance: { ovr: 93, rank: 5 },
          longevity: { ovr: 96, rank: 2 }
        },
        snapshot: [
          ['UFC Record', '20-2'],
          ['UFC Title-Fight Wins', '13'],
          ['Championship Level', 'All-Time Great'],
          ['Elite Wins', 'Best Quality Wins Case'],
          ['Prime Record', 'Legendary Second Act'],
          ['Active Elite Years', 'Long Championship Window'],
          ['Loss Context', 'Hughes and Serra losses were avenged decisively']
        ],
        whyRankedHere: 'St-Pierre ranks #2 because he combines an all-time welterweight title reign with the strongest quality-wins case in the UFC, elite consistency across his prime, and decisive revenge wins over the losses that matter most. His resume is one of the deepest, cleanest, and easiest to defend in the sport.',
        whyNotHigher: 'Jon Jones still has the edge in championship volume and total time at the very top. St-Pierre\'s case is elite across the board, but the Serra upset and slightly lower title-fight total keep him just behind #1.',
        keyJudgmentCalls: [
          ['Matt Hughes 2004', 'counts as a real early-career elite loss, but it was avenged twice.'],
          ['Matt Serra 2007', 'counts as a meaningful upset loss, but the rematch and title reclaim are central to his case.'],
          ['Middleweight title win', 'adds value, but his resume is built primarily on the welterweight reign.'],
          ['Opponent quality wins', 'is the clearest strength of the GSP case and the best in this ranking.'],
          ['Late-career sample', 'is small, so the profile stays focused on the established welterweight prime.']
        ],
        finalTakeaway: 'St-Pierre is the complete champion case: elite title success, the best quality-wins score in this ranking, long-term consistency, and decisive answers to the biggest questions on his resume.'
      },
      profileStats: {
        ufcRecord: '20-2',
        titleFightWins: 13,
        eliteWins: 14,
        primeRecord: '18-1',
        finishRatePct: 36.4,
        roundsWonPct: 85.9,
        activeEliteYears: 9.15,
        timesFinishedPrime: 1,
        lossContext: 'Hughes and Serra losses count, but both were avenged decisively.',
        qualityWinsContext: 'Best quality-wins case in the current ranking.'
      },
      compareSeasoning: {
        shortCase: 'GSP is the cleanest elite GOAT case: deep opponent quality, long welterweight control, avenged losses, and one of the most complete skill sets ever.',
        peak: 'At his best, GSP was control without chaos. He could out-wrestle strikers, out-strike wrestlers, win rounds safely, and make elite opponents look limited.',
        resume: 'GSP\'s resume is built on quality and polish. He beat elite names across multiple generations, reclaimed his belt after the Serra upset, and later added the middleweight title.',
        championship: 'His championship case is elite: a long welterweight reign, repeated title-fight wins, and a second-division title that adds value without carrying the whole case.',
        opponentQuality: 'This is GSP\'s best lane. Hughes, Penn, Fitch, Shields, Condit, Diaz, Hendricks, and Bisping give him one of the strongest quality-win ledgers in the ranking.',
        longevity: 'GSP\'s elite window was long, consistent, and unusually clean. He did not hang around collecting post-prime damage, which makes the resume easier to defend.',
        counter: 'GSP\'s argument against anyone is cleanliness. He avenged the losses, controlled elite opponents, and has fewer awkward resume questions than Jones.',
        edge: 'GSP wins comparisons when opponent quality, resume polish, and clean championship control matter more than raw title-fight volume.',
        eliteCounter: true,
        signatureWins: 'Hughes, Penn, Fitch, Shields, Condit, Diaz, Hendricks, and Bisping give GSP one of the deepest elite-win ledgers in the ranking.',
        againstPerfectPeak: 'Against perfect-peak fighters, GSP\'s argument is total proof: more elite opponents, more championship rounds, and a longer window as the standard at welterweight.',
        cleanResumeCounter: 'GSP is the cleanest counterargument to Jon: fewer weird resume questions, avenged losses, elite control, and one of the best opponent-quality cases ever.',
        titleSummary: 'GSP\'s title case is built on a long welterweight reign, repeated title-fight wins, and a later middleweight belt that adds bonus value.',
        primeSummary: 'His prime lasted across multiple welterweight eras, and he left before piling up ugly post-prime damage.',
        titleStyle: 'Clean Reign Standard',
        primeStyle: 'Control Without Chaos',
        bestArgument: 'GSP\'s best argument is clean completeness: elite opponent quality, long title control, avenged losses, and very few awkward resume questions.',
        legacyStats: {
          ufcRecord: '20-2',
          titleFightWins: 13,
          beltsWon: 2,
          titleDefenses: 9,
          activeEliteYearsLabel: 'roughly 9 active elite years',
          primeNote: 'long, clean welterweight control without much post-prime damage'
        }
      },
      watchMoment: {
        url: 'https://youtube.com/shorts/Gb0lJf0-lZU?is=ViJReSsAfOjWw1xf',
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

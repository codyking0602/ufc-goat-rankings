// Prime Dominance no-sample-confidence score corrections.
// Applies locked Prime Dominance worksheet corrections after base data, additions, packets, round-row fixes, Championship, and OQ corrections load.
(function(){
  const VERSION = 'prime-dominance-score-corrections-20260705b';
  const DATA = window.RANKING_DATA;
  if(!DATA) return;

  const corrections = {
    // Batch 1
    'Islam Makhachev': { primeDominance: 28.45, notes: 'No-sample formula. Clean modern-LW prime: perfect record/round/safety scores, strong finish profile, and developing title-defense dominance.' },
    'Jon Jones': { primeDominance: 28.05, notes: 'No-sample formula. UFC-only prime benchmark: no real competitive prime loss, huge title-defense streak, elite round control, and strong LHW/HW context.' },
    'Khabib Nurmagomedov': { primeDominance: 27.50, notes: 'No-sample formula. Perfect elite-prime record, perfect round-control/safety scores, full lightweight division-strength credit, shorter defense streak than long-reign champions.' },
    'Demetrious Johnson': { primeDominance: 26.11, notes: 'No-sample formula. Historic title-defense streak and elite control; flyweight division-strength context keeps him below the clean LW/Jon peaks.' },
    'Amanda Nunes': { primeDominance: 25.22, notes: 'No-sample formula. Two-division finishing/title-dominance monster, capped by Pena finished-loss context and blended BW/FW division strength.' },
    'Georges St-Pierre': { primeDominance: 24.29, notes: 'No-sample formula. Massive defense streak and round control; Serra finished-loss context and lower finish score keep him below the cleanest primes.' },
    'Anderson Silva': { primeDominance: 23.70, notes: 'No-sample formula. Historic finishing/aura and 10-defense streak; Weidman losses and MW strength context cap the score.' },
    'Alexander Volkanovski': { primeDominance: 22.25, notes: 'No-sample formula. Modern FW title run and strong round control, capped by Topuria and upward-division Islam loss context.' },
    'Max Holloway': { primeDominance: 19.48, notes: 'No-sample formula. Long elite-prime volume and modern FW context, but full elite-prime window includes Volk/Topuria/Poirier/Oliveira caps.' },

    // Batch 2
    'Cain Velasquez': { primeDominance: 21.42, notes: 'No-sample formula. Strong HW peak control/finishing, but injuries, losses, and shorter title-defense dominance cap the score.' },
    'Kamaru Usman': { primeDominance: 21.18, notes: 'No-sample formula. Strong WW title streak and round control, capped by Leon and late-prime loss context.' },
    'Matt Hughes': { primeDominance: 19.05, notes: 'No-sample formula. Old-era WW title volume and finishing, but full elite-prime losses and safety score cap heavily.' },
    'Jose Aldo': { primeDominance: 17.00, notes: 'Rebalanced UFC-only prime. Title-defense skill still matters, but a 10-4 prime/late-prime window with McGregor KO, Holloway TKO twice, and Volkanovski decision should not grade like a top-10 all-time UFC prime.' },
    'Stipe Miocic': { primeDominance: 18.73, notes: 'No-sample formula. HW championship peak and finish profile, capped by prime losses and heavyweight division context.' },
    'Daniel Cormier': { primeDominance: 18.62, notes: 'No-sample formula. Strong LHW/HW elite-prime résumé, but Jones/Stipe round and loss context caps Prime Dominance.' },
    'Charles Oliveira': { primeDominance: 17.96, notes: 'No-sample formula. Dangerous modern LW finisher, but full elite-prime window includes Islam/Arman/Topuria caps and shorter title-defense streak.' },
    'Israel Adesanya': { primeDominance: 15.95, notes: 'No-sample formula. Five-defense MW reign helps, but Jan/Pereira/Strickland/DDP losses and low finish/safety scores cap him.' },

    // Batch 3
    'Merab Dvalishvili': { primeDominance: 22.02, notes: 'No-sample formula. Modern BW cardio/control monster with strong recent title run, capped by low finish score.' },
    'Chuck Liddell': { primeDominance: 21.20, notes: 'No-sample formula. Strong LHW title/finish peak, capped by prime knockout losses and old-era safety context.' },
    'Francis Ngannou': { primeDominance: 19.45, notes: 'No-sample formula. Historic HW finishing and strong safety after early losses, capped by Stipe/Lewis round-control context and short reign.' },
    'Alex Pereira': { primeDominance: 18.12, notes: 'No-sample formula. Elite title/finish profile across divisions, capped by short sample, low round-control score, and prime losses.' },
    'Dominick Cruz': { primeDominance: 17.62, notes: 'No-sample formula. UFC-only title-prime case excludes WEC reign; strong control but low finish score and Cejudo loss cap.' },
    'Conor McGregor': { primeDominance: 17.40, notes: 'No-sample formula. Explosive FW/LW peak and elite finishing, but no defense streak and Diaz/Khabib finished losses cap.' },
    'B.J. Penn': { primeDominance: 17.12, notes: 'No-sample formula. UFC-only early elite/two-division title value, but full prime sample is chaotic with multiple losses/draws.' },
    'Henry Cejudo': { primeDominance: 16.23, notes: 'No-sample formula. Double-champ peak matters, but UFC elite-prime record, Merab/Aljo context, and shorter defense streak cap.' },
    'Petr Yan': { primeDominance: 15.82, notes: 'No-sample formula. Strong technical BW prime, but no true defense streak and several elite losses keep him down.' },
    'Randy Couture': { primeDominance: 15.65, notes: 'No-sample formula. UFC-only old-era title relevance and round volume, but mixed prime record and loss safety cap.' },

    // Batch 4
    'Valentina Shevchenko': { primeDominance: 21.37, notes: 'No-sample formula. Long flyweight title-prime and strong round control, capped by Nunes/Grasso context and women FLW strength.' },
    'Ilia Topuria': { primeDominance: 21.33, notes: 'No-sample formula with corrected runtime prime round rows: 10/15 = 66.7%. Huge active-prime peak, capped by Gaethje loss and still-building title volume.' },
    'Ronda Rousey': { primeDominance: 20.45, notes: 'No-sample formula. Historic finish/title-defense dominance, capped by Holm/Nunes finished losses and formative early WBW division strength.' },
    'T.J. Dillashaw': { primeDominance: 18.02, notes: 'No-sample formula. Strong BW title/finish case, capped by Cejudo/Sterling context and EPO/vacated-belt legacy context.' },
    'Joanna Jedrzejczyk': { primeDominance: 17.76, notes: 'No-sample formula. Five-defense SW reign and strong round volume, capped by Rose/Valentina/Weili loss context and low finish score.' },
    'Aljamain Sterling': { primeDominance: 17.72, notes: 'No-sample formula. Strong modern BW title run, capped by lower finish/separation profile and O\'Malley/elite loss context.' },
    'Justin Gaethje': { primeDominance: 15.91, notes: 'No-sample formula using audited snapshot inputs. Elite violence/finish profile and full LW difficulty, but no sustained defense streak and loss safety cap.' },
    'Dustin Poirier': { primeDominance: 15.64, notes: 'No-sample formula using audited snapshot inputs. Quality Wins monster, but full prime window has too many title/elite losses for a high Prime Dominance score.' },
    'Frankie Edgar': { primeDominance: 14.97, notes: 'No-sample formula using audited snapshot inputs. Longevity/Championship/Quality case more than clean Prime Dominance; many close/lost elite rounds cap.' },
    'Dan Henderson': { primeDominance: 9.95, notes: 'No-sample formula using audited snapshot inputs. UFC-only Prime sharply discounts non-UFC aura and his UFC prime was too uneven round-to-round.' }
  };

  function round2(value){
    return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
  }

  function recalcTotal(row){
    return round2(
      Number(row.championship || 0) +
      Number(row.opponentQuality || 0) +
      Number(row.primeDominance || 0) +
      Number(row.longevity || 0) +
      Number(row.penalty || 0)
    );
  }

  function patchRow(row){
    if(!row || !corrections[row.fighter]) return;
    const c = corrections[row.fighter];
    row.primeDominance = c.primeDominance;
    row.totalScore = recalcTotal(row);
    row.primeDominanceNotes = c.notes;
    row.primeDominanceAudit = {
      score: c.primeDominance,
      formula: 'Prime record / 7 + Prime rounds won / 7 + Title-defense dominance / 5 + Finish/stoppage / 5 + Loss safety / 4 + Division strength / 2',
      sampleConfidenceRemoved: true,
      notes: c.notes,
      source: 'Prime Dominance Batches 1-4 no-sample-confidence worksheet',
      version: VERSION
    };
  }

  [...(DATA.men || []), ...(DATA.women || []), ...(DATA.fighters || [])].forEach(patchRow);

  function sortBoard(board){
    if(!Array.isArray(board)) return;
    board.sort((a,b) => Number(b.totalScore || 0) - Number(a.totalScore || 0));
    board.forEach((row,index) => { row.rank = index + 1; });
  }

  sortBoard(DATA.men);
  sortBoard(DATA.women);

  const boardRows = [...(DATA.men || []), ...(DATA.women || [])];
  const rankByFighter = new Map(boardRows.map(row => [row.fighter, row.rank]));
  const scoreByFighter = new Map(boardRows.map(row => [row.fighter, row.totalScore]));
  const primeByFighter = new Map(boardRows.map(row => [row.fighter, row.primeDominance]));

  (DATA.fighters || []).forEach(profile => {
    if(rankByFighter.has(profile.fighter)) profile.rank = rankByFighter.get(profile.fighter);
    if(scoreByFighter.has(profile.fighter)) profile.totalScore = scoreByFighter.get(profile.fighter);
    if(primeByFighter.has(profile.fighter)) profile.primeDominance = primeByFighter.get(profile.fighter);
  });

  if(typeof DISPLAY_OVERRIDES !== 'undefined'){
    rankByFighter.forEach((rank,fighter) => {
      if(!DISPLAY_OVERRIDES[fighter]) return;
      DISPLAY_OVERRIDES[fighter].allTimeRank = rank;
      if(DISPLAY_OVERRIDES[fighter].categories?.primeDominance){
        delete DISPLAY_OVERRIDES[fighter].categories.primeDominance;
      }
      DISPLAY_OVERRIDES[fighter].primeDominanceAudit = corrections[fighter] || DISPLAY_OVERRIDES[fighter].primeDominanceAudit;
    });
  }

  window.UFC_PRIME_DOMINANCE_SCORE_CORRECTIONS = {
    version: VERSION,
    fighters: Object.keys(corrections),
    formula: 'record7 + rounds7 + titleDefense5 + finish5 + safety4 + division2',
    corrections,
    appliedAt: new Date().toISOString()
  };
})();
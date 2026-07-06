// Opponent Quality audit score corrections.
// Applies locked OQ worksheet corrections after base data, additions, packets, and Championship corrections load.
(function(){
  const VERSION = 'opponent-quality-score-corrections-20260705b';
  const DATA = window.RANKING_DATA;
  if(!DATA) return;

  const corrections = {
    // Men's board: Batch 1B + top-five consistency pass
    'Georges St-Pierre': { opponentQuality: 25.00, notes: 'OQ benchmark. Locked adjusted OQ index = 15.62; score = 25.00.' },
    'Jon Jones': { opponentQuality: 22.00, notes: 'Top-five consistency pass upgraded Glover, Machida, Gustafsson 2, and Smith to full title-level OQ.' },
    'Alexander Volkanovski': { opponentQuality: 16.48, notes: 'Batch 1B locked with modern featherweight 1.05 adjustment.' },
    'Kamaru Usman': { opponentQuality: 14.90, notes: 'Batch 1B locked including Masvidal 1/2 and Buckley current-table credit.' },
    'Max Holloway': { opponentQuality: 20.79, notes: 'Batch 1B plus top-five consistency upgrade for Frankie Edgar. Pettis stays 0.75.' },
    'Dustin Poirier': { opponentQuality: 15.84, notes: 'Batch 1B plus top-five consistency upgrades for Eddie Alvarez and Dan Hooker.' },
    'Charles Oliveira': { opponentQuality: 12.76, notes: 'Batch 1B locked result. Current prior OQ was high under cleaned formula.' },
    'Aljamain Sterling': { opponentQuality: 14.80, notes: 'Batch 1B plus top-five consistency upgrades for Jimmie Rivera and Pedro Munhoz.' },

    // Batch 2
    'Khabib Nurmagomedov': { opponentQuality: 12.32, notes: 'Batch 2 locked with lightweight 1.10 adjustment.' },
    'Islam Makhachev': { opponentQuality: 14.53, notes: 'Batch 2 locked with modern lightweight 1.10 adjustment and current-table JDM inclusion.' },
    'Demetrious Johnson': { opponentQuality: 13.94, notes: 'Batch 2 locked with flyweight 0.85 adjustment.' },
    'Jose Aldo': { opponentQuality: 13.50, notes: 'Rebalanced UFC-only Aldo treatment: Edgar/Mendes/Lamas/Stephens/Moicano/BW resurgence still score, but WEC greatness is context only and late partials no longer place him above Usman/Sterling-level UFC quality-win cases.' },
    'Alex Pereira': { opponentQuality: 11.77, notes: 'Batch 2 locked with 0.98 blended division adjustment.' },

    // Batch 3 old-era
    'Matt Hughes': { opponentQuality: 16.41, notes: 'Batch 3 old-era OQ locked.' },
    'Randy Couture': { opponentQuality: 18.25, notes: 'Batch 3 old-era OQ locked with 0.95 era adjustment.' },
    'B.J. Penn': { opponentQuality: 14.40, notes: 'Batch 3 old-era OQ locked.' },
    'Chuck Liddell': { opponentQuality: 15.40, notes: 'Batch 3 old-era OQ locked.' },
    'Dan Henderson': { opponentQuality: 8.97, notes: 'Batch 3 old-era OQ locked with 0.95 blended adjustment.' },

    // Batch 4 MW/HW + top-five consistency pass
    'Anderson Silva': { opponentQuality: 18.82, notes: 'Batch 4 plus top-five consistency upgrades for Demian Maia and Yushin Okami.' },
    'Israel Adesanya': { opponentQuality: 16.11, notes: 'Batch 4 locked with modern MW 1.00 adjustment and Cannonier top-five 1.00 call.' },
    'Stipe Miocic': { opponentQuality: 14.45, notes: 'Batch 4 locked with 0.95 heavyweight adjustment.' },
    'Daniel Cormier': { opponentQuality: 12.16, notes: 'Batch 4 locked with 0.98 blended LHW/HW adjustment.' },
    'Cain Velasquez': { opponentQuality: 10.64, notes: 'Batch 4 locked with 0.95 heavyweight adjustment.' },

    // Batch 5 BW/star + Yan audit
    'Conor McGregor': { opponentQuality: 10.50, notes: 'Batch 5 locked with 1.05 FW/LW adjustment.' },
    'Henry Cejudo': { opponentQuality: 11.02, notes: 'Batch 5 plus top-five consistency upgrades for Formiga and Sergio Pettis.' },
    'Dominick Cruz': { opponentQuality: 8.64, notes: 'Batch 5 locked with DJ special 1.15 title-defense credit.' },
    'Petr Yan': { opponentQuality: 11.60, notes: 'Batch 5 Yan audit includes McGhee and current-table Merab rematch; Aldo/Rivera/Song stay 0.75.' },
    'Merab Dvalishvili': { opponentQuality: 11.60, notes: 'Batch 5 locked with modern BW 1.00 adjustment.' },

    // Batch 6 LW/FW/HW
    'Francis Ngannou': { opponentQuality: 10.26, notes: 'Batch 6 locked with 0.95 heavyweight adjustment.' },
    'Justin Gaethje': { opponentQuality: 14.97, notes: 'Batch 6 locked after top-five/title-level clarification for LW contender cluster.' },
    'Frankie Edgar': { opponentQuality: 16.41, notes: 'Batch 6 plus top-five consistency upgrade for Pedro Munhoz.' },
    'Ilia Topuria': { opponentQuality: 10.50, notes: 'Batch 6 plus top-five consistency upgrade for Josh Emmett and app-timeline Charles 1.25 credit.' },

    // Women's board: Batch 7
    'Amanda Nunes': { opponentQuality: 19.61, notes: 'Batch 7 women locked with 1.00 BW/FW blended adjustment.' },
    'Valentina Shevchenko': { opponentQuality: 15.78, notes: 'Batch 7 women locked with Grasso 3 and Fiorot current-table wins included and 0.95 FLW adjustment.' },
    'Joanna Jedrzejczyk': { opponentQuality: 13.30, notes: 'Batch 7 women locked with 1.00 strawweight adjustment.' },
    'Ronda Rousey': { opponentQuality: 7.22, notes: 'Batch 7 women locked with 0.95 early women\'s BW adjustment.' }
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
    row.opponentQuality = c.opponentQuality;
    row.totalScore = recalcTotal(row);
    row.opponentQualityNotes = c.notes;
    row.oqAudit = {
      score: c.opponentQuality,
      notes: c.notes,
      source: 'Locked OQ worksheets + top-five consistency audit',
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

  const rankByFighter = new Map([...(DATA.men || []), ...(DATA.women || [])].map(row => [row.fighter, row.rank]));
  const scoreByFighter = new Map([...(DATA.men || []), ...(DATA.women || [])].map(row => [row.fighter, row.totalScore]));
  const oqByFighter = new Map([...(DATA.men || []), ...(DATA.women || [])].map(row => [row.fighter, row.opponentQuality]));

  (DATA.fighters || []).forEach(profile => {
    if(rankByFighter.has(profile.fighter)) profile.rank = rankByFighter.get(profile.fighter);
    if(scoreByFighter.has(profile.fighter)) profile.totalScore = scoreByFighter.get(profile.fighter);
    if(oqByFighter.has(profile.fighter)) profile.opponentQuality = oqByFighter.get(profile.fighter);
  });

  if(typeof DISPLAY_OVERRIDES !== 'undefined'){
    rankByFighter.forEach((rank,fighter) => {
      if(!DISPLAY_OVERRIDES[fighter]) return;
      DISPLAY_OVERRIDES[fighter].allTimeRank = rank;
      if(DISPLAY_OVERRIDES[fighter].categories?.opponentQuality){
        delete DISPLAY_OVERRIDES[fighter].categories.opponentQuality;
      }
    });
  }

  window.UFC_OPPONENT_QUALITY_SCORE_CORRECTIONS = {
    version: VERSION,
    fighters: Object.keys(corrections),
    corrections,
    appliedAt: new Date().toISOString()
  };
})();
// Prime Dominance round-row cleanup patch.
(function(){
  const VERSION = 'prime-round-row-fixes-20260704a';
  const DATA = window.RANKING_DATA;
  const fixed = [];
  const notes = [];

  function findFighter(name){
    return (DATA?.fighters || []).find(f => f?.fighter === name);
  }

  function patchRound(fighter, opponent, patch){
    const profile = findFighter(fighter);
    if(!profile || !Array.isArray(profile.rounds)) return false;
    const row = profile.rounds.find(r => r?.opponent === opponent);
    if(!row) return false;
    Object.assign(row, patch);
    fixed.push(`${fighter} vs ${opponent}`);
    return true;
  }

  // Ilia's prime rows had roundsWon/roundsCounted reversed on finish-context fights.
  // Rule: roundsCounted = roundEnded; roundsWon = rounds actually won by Topuria, including finish round if he won by finish.
  patchRound('Ilia Topuria','Alexander Volkanovski',{
    roundsCounted: 2.0,
    roundsWon: 1.0,
    basis: 'Best effort; finish round counted by result',
    confidence: 'Best-effort',
    notes: 'Volkanovski likely won R1; Topuria won finishing R2.'
  });

  patchRound('Ilia Topuria','Max Holloway',{
    roundsCounted: 3.0,
    roundsWon: 2.0,
    basis: 'Best effort; finish round counted by result',
    confidence: 'Best-effort / official scorecards page',
    notes: 'Count R1 Holloway, R2 Topuria, R3 Topuria finish until exact card review.'
  });

  patchRound('Ilia Topuria','Justin Gaethje',{
    roundsCounted: 4.0,
    roundsWon: 1.0,
    basis: 'Best effort; reported scorecard context',
    confidence: 'Best-effort / official scorecards page',
    notes: 'Gaethje reported up 39-37 after four; Topuria credited with R2 only.'
  });

  const ilia = findFighter('Ilia Topuria');
  if(ilia?.rounds){
    const primeOpponents = new Set(['Josh Emmett','Alexander Volkanovski','Max Holloway','Charles Oliveira','Justin Gaethje']);
    const rows = ilia.rounds.filter(r => primeOpponents.has(r?.opponent));
    const roundsWon = rows.reduce((sum,r)=>sum + Number(r.roundsWon || 0),0);
    const roundsCounted = rows.reduce((sum,r)=>sum + Number(r.roundsCounted || 0),0);
    const roundsWonPct = roundsCounted ? Number(((roundsWon / roundsCounted) * 100).toFixed(1)) : null;
    ilia.primeRoundsWon = roundsWon;
    ilia.primeRoundsCounted = roundsCounted;
    ilia.roundsWonPct = roundsWonPct;
    notes.push(`Ilia Topuria prime rounds now ${roundsWon}/${roundsCounted} = ${roundsWonPct}%`);

    if(typeof DISPLAY_OVERRIDES !== 'undefined'){
      DISPLAY_OVERRIDES['Ilia Topuria'] = DISPLAY_OVERRIDES['Ilia Topuria'] || {};
      DISPLAY_OVERRIDES['Ilia Topuria'].packetProfileStats = {
        ...(DISPLAY_OVERRIDES['Ilia Topuria'].packetProfileStats || {}),
        ufcRecord: ilia.ufcRecord,
        primeRecord: '4-1 in full elite-prime window',
        roundsWonPct,
        timesFinishedPrime: ilia.timesFinishedPrime || 0,
        lossContext: 'Gaethje title loss counts as a prime elite finished loss in the current scoring table.'
      };
    }
  }

  window.UFC_PRIME_ROUND_ROW_FIXES = {
    version: VERSION,
    purpose: 'Fix malformed prime round rows without requiring a full base-data rewrite.',
    fixed,
    notes,
    appliedAt: new Date().toISOString()
  };
})();
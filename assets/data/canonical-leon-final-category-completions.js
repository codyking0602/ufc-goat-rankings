// Mechanical canonical category completions for Leon Edwards.
// Shadow-only: calculates from canonical facts and locked category calculators; never writes live scores, totals, ranks, OVRs, profiles, or Compare Mode.
(function(){
  'use strict';

  const VERSION='canonical-leon-final-category-completions-20260714b-calculated';
  const FIGHTER='Leon Edwards';
  const STANDARD_CREDITS=Object.freeze({'champion-level':1.25,'top-five':1,'top-ten':.85,ranked:.65,solid:.45,'name-value':.25,minimal:.10,none:0});
  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const round6=value=>Math.round((Number(value||0)+Number.EPSILON)*1e6)/1e6;

  const facts=window.UFC_CANONICAL_FIGHTER_FACTS;
  const oqReport=window.UFC_CANONICAL_OPPONENT_QUALITY_RECONSTRUCTION;
  const primeReport=window.UFC_CANONICAL_PRIME_DOMINANCE_RECONSTRUCTION;
  const record=facts?.get?.(FIGHTER)||null;

  function canonicalOpponentQualityEntry(){
    if(!record||!oqReport?.calculateOpponentQuality)return null;
    const counts=new Map();
    const inputs=record.fights.filter(fight=>fight?.scoringDisposition==='count-win').map(fight=>{
      const opponent=key(fight.opponent);
      const occurrence=(counts.get(opponent)||0)+1;
      counts.set(opponent,occurrence);
      const baseTier=fight?.opponentContext?.qualityTier||'none';
      const baseCredit=Number(STANDARD_CREDITS[baseTier]||0);
      return {
        fightId:fight.id,
        fighter:FIGHTER,
        opponent:fight.opponent,
        date:fight.date,
        event:fight.event,
        division:fight.division,
        occurrence,
        baseTier,
        baseCredit:round6(baseCredit),
        adjustments:[],
        finalCredit:round6(baseCredit),
        judgmentSource:'canonical-reviewed-quality-tier',
        judgmentStatus:'factual-completion',
        reviewStatus:fight?.opponentContext?.reviewStatus||'locked',
        note:fight?.opponentContext?.note||'Canonical reviewed opponent-quality tier.',
        canonicalQualityTier:baseTier,
        championStatus:fight?.opponentContext?.championStatus||'unknown',
        resultContext:fight?.method?.category==='dq'?'official-dq-win':'normal-official-win',
        provenance:'canonical UFC fight fact and reviewed opponentContext quality tier'
      };
    });
    const calculated=oqReport.calculateOpponentQuality(inputs,0,oqReport.benchmarkCredit);
    return {
      fighter:FIGHTER,
      board:record.board,
      currentScore:null,
      reconstructedScore:calculated.score,
      difference:null,
      scoreStatus:'factual-completion-no-frozen-control',
      classification:'factual completion from canonical reviewed opponent tiers and locked diminishing returns',
      canonicalWinCount:inputs.length,
      inputCount:inputs.length,
      legacyRowCount:0,
      canonicalFallbackCount:inputs.length,
      explicitApprovedJudgmentCount:0,
      recoveredLegacyJudgmentCount:0,
      removedLegacyRowCount:0,
      duplicateInputFightIds:[],
      missingInputFightIds:[],
      rawCredit:calculated.rawCredit,
      preAdjustmentDiminishedCredit:calculated.preAdjustmentDiminishedCredit,
      fighterAdjustment:calculated.fighterAdjustment,
      diminishedCredit:calculated.diminishedCredit,
      benchmarkCredit:calculated.benchmarkCredit,
      topFiveWins:calculated.rows.filter(row=>Number(row.finalCredit)>=1).length,
      championLevelWins:calculated.rows.filter(row=>Number(row.finalCredit)>=1.15).length,
      rankedQualityWins:calculated.rows.filter(row=>Number(row.finalCredit)>=.65).length,
      inputs:calculated.rows,
      removedLegacyRows:[],
      notices:[{classification:'factual completion',reason:`All ${inputs.length} counted UFC wins use already-reviewed canonical quality tiers; no fighter adjustment or manual score override is applied.`}],
      provenance:'canonical UFC fight facts + reviewed opponentContext quality tiers + locked Opponent Quality calculator'
    };
  }

  function canonicalPrimeDominanceEntry(){
    if(!record||!primeReport?.calculatePrimeDominance)return null;
    const stats=primeReport.calculatePrimeDominance(record);
    const blockers=[...(stats?.missingRoundRows||[]),...(stats?.eliteLevelValidation?.missingRoundRows||[])];
    if(!stats?.windowValid||blockers.length)return null;
    return {
      fighter:FIGHTER,
      board:record.board,
      currentScore:null,
      reconstructedScore:stats.score,
      difference:null,
      legacyCanonicalScore:null,
      legacyDifference:null,
      classification:'factual completion under the Cody-approved 9/9/5/7 formula and full-sample lock',
      currentControlSource:'mechanical-factual-completion',
      primeWindowSource:'fighter-era-ledgers',
      legacyJudgmentSource:'none; canonical facts and locked formula only',
      formerLegacyEliteStakes:null,
      stats,
      issues:[{classification:'factual completion',reason:'The Sean Brady round audit closes the only missing input; the approved shared Era Ledger and locked calculator produce this score without manual adjustment.'}],
      provenance:'shared Fighter Era Ledger + canonical UFC fight facts + audited rounds + locked Prime Dominance calculator'
    };
  }

  function install(report,entry){
    if(!report?.applied||!entry)return false;
    const originalEntryFor=report.entryFor;
    const existing=typeof originalEntryFor==='function'?originalEntryFor(FIGHTER):null;
    if(existing)return true;
    const originalFighters=Array.isArray(report.fighters)?report.fighters.slice():[];
    report.fighters=[...originalFighters,entry].sort((a,b)=>Number(b.reconstructedScore||0)-Number(a.reconstructedScore||0)||String(a.fighter).localeCompare(String(b.fighter)));
    report.fighterCount=report.fighters.length;
    if(Array.isArray(report.excludedFighters))report.excludedFighters=report.excludedFighters.filter(name=>key(name)!==key(FIGHTER));
    report.entryFor=fighter=>key(fighter)===key(FIGHTER)?entry:(typeof originalEntryFor==='function'?originalEntryFor(fighter):null);
    return true;
  }

  const opponentQuality=canonicalOpponentQualityEntry();
  const primeDominance=canonicalPrimeDominanceEntry();
  const opponentQualityInstalled=install(oqReport,opponentQuality);
  const primeDominanceInstalled=install(primeReport,primeDominance);

  window.UFC_CANONICAL_LEON_FINAL_CATEGORY_COMPLETIONS=Object.freeze({
    version:VERSION,
    fighter:FIGHTER,
    opponentQuality,
    primeDominance,
    opponentQualityInstalled,
    primeDominanceInstalled,
    championshipPendingApproval:true,
    manualNumericAdjustment:0,
    mutatesFightFacts:false,
    mutatesRankingData:false,
    mutatesScores:false,
    mutatesRanks:false,
    mutatesOvr:false
  });
})();

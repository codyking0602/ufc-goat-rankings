// Phase 1 foundation: the future single owner of UFC fighter facts and reviewed judgment calls.
// This registry does not own scores, totals, ranks, OVR, or presentation copy.
(function(){
  'use strict';

  const VERSION='canonical-fighter-facts-20260713a-phase1-foundation';
  const VALID_STATUSES=new Set(['draft','audited','live']);
  const DERIVED_ONLY_FIELDS=new Set([
    'rank','allTimeRank','totalScore','rawScore','overallOvr',
    'expectedRank','expectedTotalScore','expectedOverallOvr',
    'championshipScore','opponentQualityScore','primeDominance',
    'primeDominanceScore','longevityScore','apexPeak','apexPeakBonus',
    'penalty','lossPenalty','lossContext','eraDepthAdjustment'
  ]);
  const REQUIRED_AUDITED_PATHS=[
    'fighter','board','facts.ufcRecord.wins','facts.ufcRecord.losses',
    'facts.ufcRecord.draws','facts.ufcRecord.noContests','facts.ufcRecord.finishWins',
    'facts.championship.titleFightWins','facts.championship.adjustedTitleWins',
    'facts.opponentQuality.eliteWins','facts.opponentQuality.topFiveWins',
    'facts.opponentQuality.rankedWins','facts.prime.start','facts.prime.open',
    'facts.prime.wins','facts.prime.losses','facts.prime.draws',
    'facts.prime.noContests','facts.prime.roundsWonPct',
    'facts.prime.finishWins','facts.prime.stoppageLosses',
    'facts.longevity.activeEliteYears','facts.longevity.gapCapMonths',
    'facts.divisionStrength.multiplier'
  ];

  const records=new Map();
  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  const valueAt=(obj,path)=>path.split('.').reduce((value,part)=>value?.[part],obj);

  function findDerivedFields(value,path='',found=[]){
    if(!value||typeof value!=='object')return found;
    Object.entries(value).forEach(([field,nested])=>{
      const next=path?`${path}.${field}`:field;
      if(DERIVED_ONLY_FIELDS.has(field))found.push(next);
      findDerivedFields(nested,next,found);
    });
    return found;
  }

  function validate(record){
    const errors=[];
    if(!record||typeof record!=='object')return {valid:false,errors:['Record must be an object.']};
    if(!String(record.fighter||'').trim())errors.push('fighter is required.');
    if(!['men','women'].includes(record.board))errors.push('board must be men or women.');
    if(!VALID_STATUSES.has(record.status||'draft'))errors.push('status must be draft, audited, or live.');

    const derived=findDerivedFields(record);
    if(derived.length)errors.push(`Derived score/display fields are forbidden: ${derived.join(', ')}`);

    if(record.status==='audited'||record.status==='live'){
      REQUIRED_AUDITED_PATHS.forEach(path=>{
        const value=valueAt(record,path);
        if(value===undefined||value===null||value==='')errors.push(`${path} is required for ${record.status} records.`);
      });
    }

    const ufc=record?.facts?.ufcRecord;
    if(ufc){
      ['wins','losses','draws','noContests','finishWins'].forEach(field=>{
        if(!Number.isInteger(ufc[field])||ufc[field]<0)errors.push(`facts.ufcRecord.${field} must be a non-negative integer.`);
      });
      if(Number.isInteger(ufc.finishWins)&&Number.isInteger(ufc.wins)&&ufc.finishWins>ufc.wins)errors.push('facts.ufcRecord.finishWins cannot exceed UFC wins.');
    }
    const prime=record?.facts?.prime;
    if(prime){
      if(typeof prime.open!=='boolean')errors.push('facts.prime.open must be boolean.');
      if(prime.open===false&&(prime.end===undefined||prime.end===null||prime.end===''))errors.push('facts.prime.end is required when the prime window is closed.');
      if(prime.open===true&&prime.end!==undefined&&prime.end!==null&&prime.end!=='')errors.push('facts.prime.end must be empty when the prime window is open.');
    }
    return {valid:errors.length===0,errors};
  }

  function register(record){
    const copy=clone(record);
    copy.status=copy.status||'draft';
    const report=validate(copy);
    if(!report.valid)throw new Error(`[${VERSION}] ${copy?.fighter||'Unknown fighter'}: ${report.errors.join(' ')}`);
    const id=key(copy.fighter);
    if(records.has(id))throw new Error(`[${VERSION}] Duplicate canonical fighter record: ${copy.fighter}`);
    records.set(id,Object.freeze(copy));
    return clone(copy);
  }

  function replace(record,reason){
    if(!String(reason||'').trim())throw new Error(`[${VERSION}] replace() requires a migration reason.`);
    const id=key(record?.fighter);
    if(!records.has(id))throw new Error(`[${VERSION}] Cannot replace missing fighter: ${record?.fighter||'Unknown fighter'}`);
    records.delete(id);
    return register({...record,migrationNote:String(reason).trim()});
  }

  function audit(){
    const results=Array.from(records.values()).map(record=>({fighter:record.fighter,status:record.status,...validate(record)}));
    return {
      version:VERSION,
      total:results.length,
      live:results.filter(row=>row.status==='live').length,
      audited:results.filter(row=>row.status==='audited').length,
      draft:results.filter(row=>row.status==='draft').length,
      invalid:results.filter(row=>!row.valid),
      passed:results.every(row=>row.valid)
    };
  }

  window.UFC_CANONICAL_FIGHTER_FACTS={
    version:VERSION,
    role:'single owner of UFC facts and reviewed judgment calls',
    phase:'1A-foundation',
    mutatesRankingData:false,
    derivedOnlyFields:Array.from(DERIVED_ONLY_FIELDS),
    requiredAuditedPaths:REQUIRED_AUDITED_PATHS.slice(),
    register,
    replace,
    validate,
    audit,
    has:fighter=>records.has(key(fighter)),
    get:fighter=>clone(records.get(key(fighter))||null),
    list:()=>Array.from(records.values()).map(clone),
    count:()=>records.size
  };

  document.documentElement.setAttribute('data-canonical-fighter-facts',VERSION);
})();

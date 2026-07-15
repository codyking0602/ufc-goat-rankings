// Phase 1 canonical UFC fighter ledger.
// Owns fight facts and reviewed classifications. It never owns category scores,
// total score, rank, OVR, or hand-written aggregate snapshot stats.
(function(){
  'use strict';

  const VERSION='canonical-fighter-facts-20260713c-audited-rounds';
  const MODEL_AS_OF_DATE='2026-07-13';
  const VALID_STATUSES=new Set(['draft','audited','live']);
  const REVIEW_STATUSES=new Set(['locked','review','high-risk-review']);
  const OFFICIAL_RESULTS=new Set(['win','loss','draw','no-contest']);
  const SCORING_DISPOSITIONS=new Set(['count-win','count-loss','count-draw','excluded-no-contest','technical-exception']);
  const METHOD_CATEGORIES=new Set(['ko-tko','submission','doctor-stoppage','decision','dq','no-contest','draw','other']);
  const DIVISION_CONTEXTS=new Set(['home','upward','downward','catchweight']);
  const CHAMPION_STATUSES=new Set(['reigning-champion','interim-champion','former-champion','title-challenger','contender','unranked','unknown']);
  const ROUND_STATUSES=new Set(['audited','not-audited']);
  const FINISH_METHODS=new Set(['ko-tko','submission','doctor-stoppage']);

  const QUALITY_TIERS=Object.freeze({
    'champion-level':{credit:1.25,elite:true,topFive:true,ranked:true},
    'top-five':{credit:1,elite:false,topFive:true,ranked:true},
    'top-ten':{credit:.85,elite:false,topFive:false,ranked:true},
    ranked:{credit:.65,elite:false,topFive:false,ranked:true},
    solid:{credit:.45,elite:false,topFive:false,ranked:false},
    'name-value':{credit:.25,elite:false,topFive:false,ranked:false},
    minimal:{credit:.1,elite:false,topFive:false,ranked:false},
    none:{credit:0,elite:false,topFive:false,ranked:false}
  });

  const CHAMPIONSHIP_TYPES=Object.freeze({
    none:{baseCredit:0,officialTitleFight:false},
    normal:{baseCredit:1,officialTitleFight:true},
    interim:{baseCredit:.75,officialTitleFight:true},
    'vacant-undisputed':{baseCredit:.9,officialTitleFight:true},
    'second-division-undisputed':{baseCredit:1.25,officialTitleFight:true},
    'vacant-second-division':{baseCredit:1.15,officialTitleFight:true},
    tournament:{baseCredit:0,officialTitleFight:false},
    'retention-draw':{baseCredit:0,officialTitleFight:true}
  });

  const DERIVED_ONLY_FIELDS=new Set([
    'rank','allTimeRank','totalScore','rawScore','overallOvr',
    'expectedRank','expectedTotalScore','expectedOverallOvr',
    'championship','championshipScore','opponentQuality','opponentQualityScore',
    'primeDominance','primeDominanceScore','longevity','longevityScore',
    'apexPeak','apexPeakBonus','penalty','lossPenalty','lossContext','eraDepthAdjustment',
    'ufcRecord','finishRate','finishRatePct','finishPercentage','finishPct',
    'titleFightWins','adjustedTitleWins','adjustedChampionshipWins',
    'eliteWins','topFiveWins','top5Wins','rankedWins',
    'primeRecord','primeWins','primeLosses','primeDraws','primeNCs','primeFights','primeFinishes',
    'roundsWonPct','roundsWonPercentage','activeEliteYears','timesFinishedPrime',
    'throughPrimeUfcFights','baseScore','weightedScoreBreakdown'
  ]);

  const REQUIRED_AUDITED_PATHS=[
    'fighter','board','identity.primaryDivision','coverage.complete','coverage.verifiedThrough',
    'primeWindow.startFightId','primeWindow.open','primeWindow.reviewStatus',
    'longevityContext.gapCapMonths','longevityContext.statusMultiplier','longevityContext.reviewStatus',
    'divisionStrength.defaultKey','divisionStrength.reviewStatus','fights'
  ];

  const records=new Map();
  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  const valueAt=(obj,path)=>path.split('.').reduce((value,part)=>value?.[part],obj);
  const finite=value=>Number.isFinite(Number(value));
  const round2=value=>Math.round((Number(value||0)+Number.EPSILON)*100)/100;
  const validDate=value=>/^\d{4}-\d{2}-\d{2}$/.test(String(value||''))&&!Number.isNaN(Date.parse(`${value}T00:00:00Z`));

  function deepFreeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value))return value;
    Object.values(value).forEach(deepFreeze);
    return Object.freeze(value);
  }

  function findDerivedFields(value,path='',found=[]){
    if(!value||typeof value!=='object')return found;
    Object.entries(value).forEach(([field,nested])=>{
      const next=path?`${path}.${field}`:field;
      if(DERIVED_ONLY_FIELDS.has(field))found.push(next);
      findDerivedFields(nested,next,found);
    });
    return found;
  }

  function validateReviewStatus(value,path,errors,required=true){
    if((value===undefined||value===null||value==='')&&!required)return;
    if(!REVIEW_STATUSES.has(value))errors.push(`${path} must be locked, review, or high-risk-review.`);
  }

  function validateRounds(rounds,path,record,errors){
    if(!rounds||!ROUND_STATUSES.has(rounds.status)){
      errors.push(`${path}.status must be audited or not-audited.`);
      return;
    }
    if(rounds.status==='audited'){
      ['won','lost','drawn'].forEach(field=>{
        if(!finite(rounds[field])||Number(rounds[field])<0)errors.push(`${path}.${field} must be a non-negative number when rounds are audited.`);
      });
      validateReviewStatus(rounds.reviewStatus,`${path}.reviewStatus`,errors,record.status!=='draft');
      return;
    }
    ['won','lost','drawn','reviewStatus'].forEach(field=>{
      if(rounds[field]!==undefined&&rounds[field]!==null&&rounds[field]!=='')errors.push(`${path}.${field} must be omitted while rounds are not-audited.`);
    });
  }

  function validateFight(fight,index,record,seenIds,errors){
    const path=`fights[${index}]`;
    if(!String(fight?.id||'').trim())errors.push(`${path}.id is required.`);
    else if(seenIds.has(fight.id))errors.push(`${path}.id duplicates ${fight.id}.`);
    else seenIds.add(fight.id);
    if(!validDate(fight?.date))errors.push(`${path}.date must use YYYY-MM-DD.`);
    if(!String(fight?.opponent||'').trim())errors.push(`${path}.opponent is required.`);
    if(!String(fight?.event||'').trim())errors.push(`${path}.event is required.`);
    if(!String(fight?.division||'').trim())errors.push(`${path}.division is required.`);
    if(!Number.isInteger(fight?.scheduledRounds)||fight.scheduledRounds<1||fight.scheduledRounds>5)errors.push(`${path}.scheduledRounds must be an integer from 1 to 5.`);
    if(!OFFICIAL_RESULTS.has(fight?.officialResult))errors.push(`${path}.officialResult is invalid.`);
    if(!SCORING_DISPOSITIONS.has(fight?.scoringDisposition))errors.push(`${path}.scoringDisposition is invalid.`);

    const expected={win:'count-win',loss:'count-loss',draw:'count-draw','no-contest':'excluded-no-contest'}[fight?.officialResult];
    if(fight?.scoringDisposition!=='technical-exception'&&expected&&fight?.scoringDisposition!==expected)errors.push(`${path}.scoringDisposition does not match officialResult.`);
    if(fight?.scoringDisposition==='technical-exception'&&!String(fight?.technicalExceptionNote||'').trim())errors.push(`${path}.technicalExceptionNote is required for technical exceptions.`);

    if(!METHOD_CATEGORIES.has(fight?.method?.category))errors.push(`${path}.method.category is invalid.`);
    if(fight?.method?.round!==undefined&&(!Number.isInteger(fight.method.round)||fight.method.round<1||fight.method.round>fight.scheduledRounds))errors.push(`${path}.method.round is invalid.`);
    validateRounds(fight?.rounds,`${path}.rounds`,record,errors);

    const quality=fight?.opponentContext;
    if(!quality||!Object.prototype.hasOwnProperty.call(QUALITY_TIERS,quality.qualityTier))errors.push(`${path}.opponentContext.qualityTier is invalid.`);
    if(!CHAMPION_STATUSES.has(quality?.championStatus))errors.push(`${path}.opponentContext.championStatus is invalid.`);
    validateReviewStatus(quality?.reviewStatus,`${path}.opponentContext.reviewStatus`,errors,record.status!=='draft');

    const title=fight?.championshipContext;
    if(!title||!Object.prototype.hasOwnProperty.call(CHAMPIONSHIP_TYPES,title.type))errors.push(`${path}.championshipContext.type is invalid.`);
    if(title&&title.type!=='none'){
      if(typeof title.fighterEligible!=='boolean')errors.push(`${path}.championshipContext.fighterEligible must be boolean.`);
      if(title.manualCredit===undefined||title.manualCredit===null){
        if(!finite(title.opponentStrength)||Number(title.opponentStrength)<0||Number(title.opponentStrength)>1.5)errors.push(`${path}.championshipContext.opponentStrength must be 0–1.5 when manualCredit is absent.`);
      }else if(!finite(title.manualCredit)||Number(title.manualCredit)<0)errors.push(`${path}.championshipContext.manualCredit must be a non-negative number.`);
      validateReviewStatus(title.reviewStatus,`${path}.championshipContext.reviewStatus`,errors,record.status!=='draft');
    }

    const loss=fight?.lossClassification;
    if(fight?.officialResult==='loss'||fight?.scoringDisposition==='technical-exception'){
      if(!loss)errors.push(`${path}.lossClassification is required for official losses or technical exceptions.`);
      if(loss&&!DIVISION_CONTEXTS.has(loss.divisionContext))errors.push(`${path}.lossClassification.divisionContext is invalid.`);
      if(loss&&typeof loss.competitive!=='boolean')errors.push(`${path}.lossClassification.competitive must be boolean.`);
      if(loss?.competitive===false&&!String(loss?.note||'').trim())errors.push(`${path}.lossClassification.note is required when competitive is false.`);
      validateReviewStatus(loss?.reviewStatus,`${path}.lossClassification.reviewStatus`,errors,record.status!=='draft');
    }
  }

  function phaseIndexes(record){
    const fights=record?.fights||[];
    const start=fights.findIndex(fight=>fight.id===record?.primeWindow?.startFightId);
    const end=record?.primeWindow?.open?fights.length-1:fights.findIndex(fight=>fight.id===record?.primeWindow?.endFightId);
    return {start,end};
  }

  function validate(record){
    const errors=[];
    if(!record||typeof record!=='object')return {valid:false,errors:['Record must be an object.']};
    if(!String(record.fighter||'').trim())errors.push('fighter is required.');
    if(!['men','women'].includes(record.board))errors.push('board must be men or women.');
    if(!VALID_STATUSES.has(record.status||'draft'))errors.push('status must be draft, audited, or live.');

    const derived=findDerivedFields(record);
    if(derived.length)errors.push(`Derived score/aggregate fields are forbidden: ${derived.join(', ')}`);

    const audited=record.status==='audited'||record.status==='live';
    if(audited){
      REQUIRED_AUDITED_PATHS.forEach(path=>{
        const value=valueAt(record,path);
        if(value===undefined||value===null||value==='')errors.push(`${path} is required for ${record.status} records.`);
      });
      if(record?.coverage?.complete!==true)errors.push(`coverage.complete must be true for ${record.status} records.`);
      if(!validDate(record?.coverage?.verifiedThrough))errors.push('coverage.verifiedThrough must use YYYY-MM-DD.');
    }

    if(record?.identity?.aliases&&!Array.isArray(record.identity.aliases))errors.push('identity.aliases must be an array.');
    if(!Number.isInteger(record?.longevityContext?.gapCapMonths)||record.longevityContext.gapCapMonths<1)errors.push('longevityContext.gapCapMonths must be a positive integer.');
    if(!finite(record?.longevityContext?.statusMultiplier)||Number(record.longevityContext.statusMultiplier)<=0)errors.push('longevityContext.statusMultiplier must be positive.');
    validateReviewStatus(record?.longevityContext?.reviewStatus,'longevityContext.reviewStatus',errors,record.status!=='draft');
    if(!String(record?.divisionStrength?.defaultKey||'').trim())errors.push('divisionStrength.defaultKey is required.');
    validateReviewStatus(record?.divisionStrength?.reviewStatus,'divisionStrength.reviewStatus',errors,record.status!=='draft');
    validateReviewStatus(record?.primeWindow?.reviewStatus,'primeWindow.reviewStatus',errors,record.status!=='draft');

    const fights=Array.isArray(record.fights)?record.fights:[];
    if(audited&&!fights.length)errors.push(`fights must contain the complete UFC ledger for ${record.status} records.`);
    const seenIds=new Set();
    fights.forEach((fight,index)=>validateFight(fight,index,record,seenIds,errors));
    for(let index=1;index<fights.length;index+=1){
      if(String(fights[index-1]?.date||'')>String(fights[index]?.date||''))errors.push(`fights must be chronological; ${fights[index]?.id||index} is out of order.`);
    }

    const fightIds=new Set(fights.map(fight=>fight?.id).filter(Boolean));
    const startId=record?.primeWindow?.startFightId;
    const endId=record?.primeWindow?.endFightId;
    if(startId&&!fightIds.has(startId))errors.push('primeWindow.startFightId must exist in fights.');
    if(typeof record?.primeWindow?.open!=='boolean')errors.push('primeWindow.open must be boolean.');
    if(record?.primeWindow?.open===false){
      if(!endId)errors.push('primeWindow.endFightId is required when the prime window is closed.');
      else if(!fightIds.has(endId))errors.push('primeWindow.endFightId must exist in fights.');
    }
    if(record?.primeWindow?.open===true&&endId)errors.push('primeWindow.endFightId must be empty when the prime window is open.');

    const {start,end}=phaseIndexes(record);
    if(startId&&endId&&start>end)errors.push('primeWindow.startFightId cannot occur after endFightId.');
    if(audited&&start>=0&&end>=start){
      fights.slice(start,end+1).forEach((fight,offset)=>{
        if(fight?.rounds?.status!=='audited')errors.push(`fights[${start+offset}].rounds must be audited because the fight is inside the prime window.`);
      });
    }

    const segments=record?.divisionStrength?.segments||[];
    if(!Array.isArray(segments))errors.push('divisionStrength.segments must be an array.');
    else segments.forEach((segment,index)=>{
      if(!String(segment?.key||'').trim())errors.push(`divisionStrength.segments[${index}].key is required.`);
      if(segment?.startFightId&&!fightIds.has(segment.startFightId))errors.push(`divisionStrength.segments[${index}].startFightId must exist in fights.`);
      if(segment?.endFightId&&!fightIds.has(segment.endFightId))errors.push(`divisionStrength.segments[${index}].endFightId must exist in fights.`);
      validateReviewStatus(segment?.reviewStatus,`divisionStrength.segments[${index}].reviewStatus`,errors,record.status!=='draft');
    });

    return {valid:errors.length===0,errors};
  }

  function dispositionCounts(fights){
    const counts={wins:0,losses:0,draws:0,noContests:0,technicalExceptions:0};
    fights.forEach(fight=>{
      if(fight.officialResult==='no-contest')counts.noContests+=1;
      if(fight.scoringDisposition==='count-win')counts.wins+=1;
      else if(fight.scoringDisposition==='count-loss')counts.losses+=1;
      else if(fight.scoringDisposition==='count-draw')counts.draws+=1;
      else if(fight.scoringDisposition==='technical-exception')counts.technicalExceptions+=1;
    });
    return counts;
  }

  function formatRecord(counts,includeNc=true){
    const base=`${counts.wins}-${counts.losses}${counts.draws?`-${counts.draws}`:''}`;
    return includeNc&&counts.noContests?`${base}, ${counts.noContests} NC`:base;
  }

  function championshipCredit(fight){
    const context=fight?.championshipContext;
    const rule=CHAMPIONSHIP_TYPES[context?.type]||CHAMPIONSHIP_TYPES.none;
    if(context?.manualCredit!==undefined&&context?.manualCredit!==null)return Number(context.manualCredit)||0;
    if(fight?.scoringDisposition!=='count-win'||context?.fighterEligible===false)return 0;
    return rule.baseCredit*(Number(context?.opponentStrength)||0);
  }

  function activeEliteYears(record,primeFights){
    const dates=primeFights.map(fight=>fight.date).filter(validDate).map(date=>Date.parse(`${date}T00:00:00Z`));
    if(!dates.length)return 0;
    const capDays=Number(record?.longevityContext?.gapCapMonths||18)*30.4375;
    let days=0;
    for(let index=1;index<dates.length;index+=1)days+=Math.min((dates[index]-dates[index-1])/86_400_000,capDays);
    if(record?.primeWindow?.open){
      const asOf=Date.parse(`${MODEL_AS_OF_DATE}T00:00:00Z`);
      if(asOf>dates.at(-1))days+=Math.min((asOf-dates.at(-1))/86_400_000,capDays);
    }
    return round2(days/365.25);
  }

  function derive(record){
    const fights=Array.isArray(record?.fights)?record.fights:[];
    const official={wins:0,losses:0,draws:0,noContests:0};
    fights.forEach(fight=>{
      if(fight.officialResult==='win')official.wins+=1;
      else if(fight.officialResult==='loss')official.losses+=1;
      else if(fight.officialResult==='draw')official.draws+=1;
      else if(fight.officialResult==='no-contest')official.noContests+=1;
    });
    const scored=dispositionCounts(fights);
    const finishWins=fights.filter(fight=>fight.scoringDisposition==='count-win'&&FINISH_METHODS.has(fight?.method?.category)).length;
    const {start,end}=phaseIndexes(record);
    const primeFights=start>=0&&end>=start?fights.slice(start,end+1):[];
    const prime=dispositionCounts(primeFights);
    const primeScoredFights=prime.wins+prime.losses+prime.draws;
    const primeFinishWins=primeFights.filter(fight=>fight.scoringDisposition==='count-win'&&FINISH_METHODS.has(fight?.method?.category)).length;
    const primeStoppageLosses=primeFights.filter(fight=>fight.scoringDisposition==='count-loss'&&FINISH_METHODS.has(fight?.method?.category)).length;
    const rounds=primeFights.reduce((totals,fight)=>{
      if(fight?.rounds?.status!=='audited')return totals;
      totals.won+=Number(fight.rounds.won||0);
      totals.lost+=Number(fight.rounds.lost||0);
      totals.drawn+=Number(fight.rounds.drawn||0);
      return totals;
    },{won:0,lost:0,drawn:0});
    const roundTotal=rounds.won+rounds.lost+rounds.drawn;
    const titleRows=fights.map(fight=>({
      fightId:fight.id,
      credit:round2(championshipCredit(fight)),
      officialTitleFight:Boolean(CHAMPIONSHIP_TYPES[fight?.championshipContext?.type]?.officialTitleFight),
      eligible:fight?.championshipContext?.fighterEligible!==false,
      result:fight.scoringDisposition
    }));
    const qualityWins=fights.filter(fight=>fight.scoringDisposition==='count-win').map(fight=>({
      fightId:fight.id,
      opponent:fight.opponent,
      tier:fight?.opponentContext?.qualityTier||'none',
      credit:QUALITY_TIERS[fight?.opponentContext?.qualityTier]?.credit||0
    }));
    const throughPrime=end>=0?fights.slice(0,end+1):[];
    const exposure=dispositionCounts(throughPrime);

    return {
      fighter:record?.fighter||null,
      officialUfcRecord:{...official,text:formatRecord(official)},
      scoringRecord:{...scored,text:formatRecord(scored,false)},
      finishWins,
      finishRatePct:scored.wins?round2((finishWins/scored.wins)*100):0,
      championship:{
        titleFightWins:titleRows.filter(row=>row.officialTitleFight&&row.eligible&&row.result==='count-win').length,
        adjustedTitleWins:round2(titleRows.reduce((sum,row)=>sum+row.credit,0)),
        rows:titleRows.filter(row=>row.credit>0||row.officialTitleFight)
      },
      opponentQuality:{
        eliteWins:qualityWins.filter(row=>QUALITY_TIERS[row.tier]?.elite).length,
        topFiveWins:qualityWins.filter(row=>QUALITY_TIERS[row.tier]?.topFive).length,
        rankedWins:qualityWins.filter(row=>QUALITY_TIERS[row.tier]?.ranked).length,
        rawCredit:round2(qualityWins.reduce((sum,row)=>sum+row.credit,0)),
        rows:qualityWins
      },
      prime:{
        startFightId:record?.primeWindow?.startFightId||null,
        endFightId:record?.primeWindow?.open?null:(record?.primeWindow?.endFightId||null),
        open:Boolean(record?.primeWindow?.open),
        ...prime,
        recordText:formatRecord(prime),
        scoredFights:primeScoredFights,
        finishWins:primeFinishWins,
        finishPressurePct:primeScoredFights?round2((primeFinishWins/primeScoredFights)*100):0,
        stoppageLosses:primeStoppageLosses,
        rounds,
        roundsWonPct:roundTotal?round2(((rounds.won+(rounds.drawn*.5))/roundTotal)*100):0
      },
      longevity:{
        activeEliteYears:activeEliteYears(record,primeFights),
        gapCapMonths:Number(record?.longevityContext?.gapCapMonths||18),
        statusMultiplier:Number(record?.longevityContext?.statusMultiplier||1),
        divisionStrengthKey:record?.divisionStrength?.defaultKey||null
      },
      lossExposure:{
        throughPrimeUfcFights:exposure.wins+exposure.losses+exposure.draws,
        countedLosses:fights.filter(fight=>fight.scoringDisposition==='count-loss').map((fight,index)=>{
          const fightIndex=fights.indexOf(fight);
          return {
            fightId:fight.id,
            phase:fightIndex<start?'pre-prime':fightIndex<=end?'prime':'post-prime',
            opponentTier:fight?.opponentContext?.qualityTier||'none',
            divisionContext:fight?.lossClassification?.divisionContext||'home',
            finished:FINISH_METHODS.has(fight?.method?.category),
            competitive:fight?.lossClassification?.competitive!==false,
            overrideRule:fight?.lossClassification?.overrideRule||null,
            index
          };
        })
      }
    };
  }

  function prepare(record){
    const copy=clone(record);
    copy.status=copy.status||'draft';
    copy.identity=copy.identity||{};
    copy.identity.aliases=copy.identity.aliases||[];
    copy.coverage=copy.coverage||{};
    copy.primeWindow=copy.primeWindow||{};
    copy.longevityContext=copy.longevityContext||{};
    copy.divisionStrength=copy.divisionStrength||{};
    copy.divisionStrength.segments=copy.divisionStrength.segments||[];
    copy.fights=copy.fights||[];
    return copy;
  }

  function register(record){
    const copy=prepare(record);
    const report=validate(copy);
    if(!report.valid)throw new Error(`[${VERSION}] ${copy?.fighter||'Unknown fighter'}: ${report.errors.join(' ')}`);
    const id=key(copy.fighter);
    if(records.has(id))throw new Error(`[${VERSION}] Duplicate canonical fighter record: ${copy.fighter}`);
    records.set(id,deepFreeze(copy));
    return clone(copy);
  }

  function replace(record,reason){
    if(!String(reason||'').trim())throw new Error(`[${VERSION}] replace() requires a migration reason.`);
    const copy=prepare({...record,migrationNote:String(reason).trim()});
    const id=key(copy?.fighter);
    if(!records.has(id))throw new Error(`[${VERSION}] Cannot replace missing fighter: ${copy?.fighter||'Unknown fighter'}`);
    const report=validate(copy);
    if(!report.valid)throw new Error(`[${VERSION}] ${copy?.fighter||'Unknown fighter'}: ${report.errors.join(' ')}`);
    records.set(id,deepFreeze(copy));
    return clone(copy);
  }

  function audit(){
    const results=Array.from(records.values()).map(record=>({fighter:record.fighter,status:record.status,...validate(record),derived:derive(record)}));
    return {
      version:VERSION,
      modelAsOfDate:MODEL_AS_OF_DATE,
      total:results.length,
      live:results.filter(row=>row.status==='live').length,
      audited:results.filter(row=>row.status==='audited').length,
      draft:results.filter(row=>row.status==='draft').length,
      invalid:results.filter(row=>!row.valid),
      passed:results.every(row=>row.valid),
      results
    };
  }

  window.UFC_CANONICAL_FIGHTER_FACTS={
    version:VERSION,
    modelAsOfDate:MODEL_AS_OF_DATE,
    role:'single owner of UFC fight facts and reviewed classifications',
    phase:'1B-ledger-schema',
    mutatesRankingData:false,
    rules:{
      qualityTiers:clone(QUALITY_TIERS),
      championshipTypes:clone(CHAMPIONSHIP_TYPES),
      reviewStatuses:Array.from(REVIEW_STATUSES),
      officialResults:Array.from(OFFICIAL_RESULTS),
      scoringDispositions:Array.from(SCORING_DISPOSITIONS),
      methodCategories:Array.from(METHOD_CATEGORIES),
      divisionContexts:Array.from(DIVISION_CONTEXTS),
      championStatuses:Array.from(CHAMPION_STATUSES),
      roundStatuses:Array.from(ROUND_STATUSES)
    },
    derivedOnlyFields:Array.from(DERIVED_ONLY_FIELDS),
    requiredAuditedPaths:REQUIRED_AUDITED_PATHS.slice(),
    register,
    replace,
    validate,
    derive,
    deriveFor:fighter=>{const record=records.get(key(fighter));return record?derive(record):null;},
    audit,
    has:fighter=>records.has(key(fighter)),
    get:fighter=>clone(records.get(key(fighter))||null),
    list:()=>Array.from(records.values()).map(clone),
    count:()=>records.size
  };
})();

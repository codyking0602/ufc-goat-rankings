// Canonical UFC fight-exposure source for the hybrid Loss Context model.
// Open prime windows use the full current UFC record. Closed windows use an audited
// count of UFC fights through the canonical prime endpoint. No contests are excluded.
(function(){
  'use strict';

  const VERSION='loss-context-exposure-ledger-20260712d-dynamic-roster';
  const DATA=window.RANKING_DATA;

  const CLOSED_WINDOW_COUNTS={
    'Jon Jones':{throughPrimeUfcFights:22,endpoint:'Ciryl Gane — 2023-03-04'},
    'Georges St-Pierre':{throughPrimeUfcFights:22,endpoint:'Michael Bisping — 2017-11-04'},
    'Anderson Silva':{throughPrimeUfcFights:18,endpoint:'Chris Weidman II — 2013-12-28'},
    'Demetrious Johnson':{throughPrimeUfcFights:18,endpoint:'Henry Cejudo II — 2018-08-04',notes:'Includes the Ian McCall draw; no contests excluded.'},
    'Khabib Nurmagomedov':{throughPrimeUfcFights:13,endpoint:'Justin Gaethje — 2020-10-24'},
    'Jose Aldo':{throughPrimeUfcFights:20,endpoint:'Merab Dvalishvili — 2022-08-20'},
    'Dominick Cruz':{throughPrimeUfcFights:7,endpoint:'Henry Cejudo — 2020-05-09'},
    'Kamaru Usman':{throughPrimeUfcFights:17,endpoint:'Leon Edwards III — 2023-03-18'},
    'Daniel Cormier':{throughPrimeUfcFights:14,endpoint:'Stipe Miocic III — 2020-08-15',notes:'Jon Jones II no contest excluded.'},
    'Stipe Miocic':{throughPrimeUfcFights:18,endpoint:'Francis Ngannou II — 2021-03-27'},
    'Dustin Poirier':{throughPrimeUfcFights:30,endpoint:'Islam Makhachev — 2024-06-01',notes:'Eddie Alvarez I no contest excluded.'},
    'Justin Gaethje':{throughPrimeUfcFights:13,endpoint:'Max Holloway — 2024-04-13'},
    'Israel Adesanya':{throughPrimeUfcFights:16,endpoint:'Dricus du Plessis — 2024-08-17'},
    'Conor McGregor':{throughPrimeUfcFights:11,endpoint:'Khabib Nurmagomedov — 2018-10-06'},
    'Henry Cejudo':{throughPrimeUfcFights:12,endpoint:'Aljamain Sterling — 2023-05-06'},
    'Amanda Nunes':{throughPrimeUfcFights:18,endpoint:'Irene Aldana — 2023-06-10'},
    'Ronda Rousey':{throughPrimeUfcFights:8,endpoint:'Amanda Nunes — 2016-12-30'},
    'Joanna Jedrzejczyk':{throughPrimeUfcFights:14,endpoint:'Zhang Weili I — 2020-03-07'},
    'Matt Hughes':{throughPrimeUfcFights:19,endpoint:'Georges St-Pierre III — 2007-12-29'},
    'Randy Couture':{throughPrimeUfcFights:19,endpoint:'Brock Lesnar — 2008-11-15'},
    'B.J. Penn':{throughPrimeUfcFights:18,endpoint:'Frankie Edgar II — 2010-08-28',notes:'Includes scored draws through the endpoint.'},
    'Chuck Liddell':{throughPrimeUfcFights:18,endpoint:'Quinton Jackson II — 2007-05-26'},
    'Tito Ortiz':{throughPrimeUfcFights:15,endpoint:'Chuck Liddell I — 2004-04-02'},
    'Cain Velasquez':{throughPrimeUfcFights:13,endpoint:'Fabricio Werdum — 2015-06-13'},
    'Francis Ngannou':{throughPrimeUfcFights:14,endpoint:'Ciryl Gane — 2022-01-22'},
    'Junior dos Santos':{throughPrimeUfcFights:12,endpoint:'Cain Velasquez III — 2013-10-19'},
    'Lyoto Machida':{throughPrimeUfcFights:18,endpoint:'Chris Weidman — 2014-07-05'},
    'Robbie Lawler':{throughPrimeUfcFights:17,endpoint:'Tyron Woodley — 2016-07-30'},
    'Michael Bisping':{throughPrimeUfcFights:28,endpoint:'Georges St-Pierre — 2017-11-04'},
    'Tony Ferguson':{throughPrimeUfcFights:16,endpoint:'Justin Gaethje — 2020-05-09'},
    'Brock Lesnar':{throughPrimeUfcFights:6,endpoint:'Cain Velasquez — 2010-10-23',notes:'Mark Hunt no contest occurred later and is excluded.'},
    'Chael Sonnen':{throughPrimeUfcFights:13,endpoint:'Jon Jones — 2013-04-27'},
    'Frankie Edgar':{throughPrimeUfcFights:25,endpoint:'Max Holloway — 2019-07-27'},
    'T.J. Dillashaw':{throughPrimeUfcFights:16,endpoint:'Henry Cejudo — 2019-01-19'},
    'Aljamain Sterling':{throughPrimeUfcFights:17,endpoint:'Sean O’Malley — 2023-08-19'},
    'Deiveson Figueiredo':{throughPrimeUfcFights:15,endpoint:'Petr Yan — 2024-11-23',notes:'Includes the Brandon Moreno draw.'},
    'Tyron Woodley':{throughPrimeUfcFights:13,endpoint:'Kamaru Usman — 2019-03-02',notes:'Includes the Stephen Thompson draw.'},
    'Robert Whittaker':{throughPrimeUfcFights:23,endpoint:'Khamzat Chimaev — 2024-10-26'},
    'Dan Henderson':{throughPrimeUfcFights:12,endpoint:'Daniel Cormier — 2014-05-24',notes:'Aligned to the app’s locked 8-9 UFC-only record treatment.'},
    'Rose Namajunas':{throughPrimeUfcFights:12,endpoint:'Carla Esparza II — 2022-05-07'},
    'Miesha Tate':{throughPrimeUfcFights:7,endpoint:'Amanda Nunes — 2016-07-09'},
    'Jessica Andrade':{throughPrimeUfcFights:19,endpoint:'Erin Blanchfield — 2023-02-18'},
    'Carla Esparza':{throughPrimeUfcFights:14,endpoint:'Zhang Weili — 2022-11-12'},
    'Holly Holm':{throughPrimeUfcFights:10,endpoint:'Amanda Nunes — 2019-07-06'},
    'Cris Cyborg':{throughPrimeUfcFights:7,endpoint:'Felicia Spencer — 2019-07-27'},

    // Canonical roster additions. These counts stop at each locked prime endpoint.
    'Royce Gracie':{throughPrimeUfcFights:12,endpoint:'Ken Shamrock II — 1995-04-07',notes:'Includes the UFC 5 time-limit draw; Matt Hughes is post-prime.'},
    'Benson Henderson':{throughPrimeUfcFights:14,endpoint:'Jorge Masvidal — 2015-11-28'},
    'Fabricio Werdum':{throughPrimeUfcFights:16,endpoint:'Alexander Volkov — 2018-03-17'},
    'Glover Teixeira':{throughPrimeUfcFights:22,endpoint:'Jiri Prochazka — 2022-06-12'},
    'Frank Shamrock':{throughPrimeUfcFights:5,endpoint:'Tito Ortiz — 1999-09-24'},
    'Rashad Evans':{throughPrimeUfcFights:18,endpoint:'Chael Sonnen — 2013-11-16',notes:'Includes the Tito Ortiz draw.'},
    'Vitor Belfort':{throughPrimeUfcFights:21,endpoint:'Dan Henderson III — 2015-11-07',notes:'No contests excluded.'},
    'Mauricio "Shogun" Rua':{throughPrimeUfcFights:8,endpoint:'Dan Henderson I — 2011-11-19'},
    'Forrest Griffin':{throughPrimeUfcFights:14,endpoint:'Mauricio Rua II — 2011-08-27'}
  };

  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}
  function parseRecord(value){
    const text=String(value||'').trim();
    const main=text.replace(/\([^)]*NC[^)]*\)/ig,'').replace(/,?\s*\d+\s*NC/ig,'').trim();
    const nums=(main.match(/\d+/g)||[]).map(Number);
    if(nums.length<2)return null;
    return {wins:nums[0],losses:nums[1],draws:nums[2]||0,scoredFights:nums[0]+nums[1]+(nums[2]||0)};
  }
  function allRows(){return [...(DATA?.men||[]),...(DATA?.women||[]),...(DATA?.fighters||[])].filter(row=>row?.fighter);}
  function boardRows(){return [...(DATA?.men||[]),...(DATA?.women||[])].filter(row=>row?.fighter);}
  function rowsFor(fighter){const target=key(fighter);return allRows().filter(row=>key(row.fighter)===target);}
  function recordFor(fighter){
    const target=key(fighter);
    const packet=Object.entries(window.UFC_FIGHTER_PACKETS||{}).find(([name])=>key(name)===target)?.[1];
    const override=typeof DISPLAY_OVERRIDES!=='undefined'?Object.entries(DISPLAY_OVERRIDES||{}).find(([name])=>key(name)===target)?.[1]:null;
    const candidates=[
      ...rowsFor(fighter).flatMap(row=>[row?.ufcRecord,row?.record,row?.ufc_record]),
      packet?.profileStats?.ufcRecord,packet?.boardRow?.ufcRecord,packet?.profile?.ufcRecord,
      override?.packetProfileStats?.ufcRecord,override?.snapshotStats?.ufcRecord
    ];
    const value=candidates.find(item=>parseRecord(item));
    return value?{text:String(value),...parseRecord(value)}:null;
  }

  function build(){
    const ERA=window.UFC_FIGHTER_ERA_LEDGERS;
    if(!DATA||!ERA?.ledgers)return false;
    const rows=[];
    const missing=[];
    const invalid=[];
    const names=[...new Set(boardRows().map(row=>row.fighter))];

    names.forEach(fighter=>{
      const era=Object.entries(ERA.ledgers||{}).find(([name])=>key(name)===key(fighter))?.[1]||null;
      const record=recordFor(fighter);
      const openWindow=!era?.window?.end;
      const explicit=Object.entries(CLOSED_WINDOW_COUNTS).find(([name])=>key(name)===key(fighter))?.[1]||null;
      let exposure=null;
      let source=null;
      const endpoint=era?.window?.end||null;
      let notes=null;

      if(openWindow&&record){
        exposure=record.scoredFights;
        source='dynamic-full-ufc-record-open-window';
        notes='Prime window is open, so every scored UFC fight is pre-prime or prime exposure.';
      }else if(explicit){
        exposure=Number(explicit.throughPrimeUfcFights);
        source='audited-closed-window-count';
        notes=explicit.notes||null;
      }

      const issues=[];
      if(!era)issues.push('missing-era-ledger');
      if(!record)issues.push('missing-ufc-record');
      if(!Number.isFinite(exposure)||exposure<1)issues.push('missing-through-prime-exposure');
      if(record&&Number.isFinite(exposure)&&exposure>record.scoredFights)issues.push('exposure-exceeds-current-scored-record');
      if(!openWindow&&!explicit)issues.push('missing-closed-window-count');
      const status=issues.length?'blocked':'ready';
      const entry={fighter,status,openWindow,throughPrimeUfcFights:exposure,currentScoredUfcFights:record?.scoredFights??null,currentUfcRecord:record?.text||null,endpoint,endpointLabel:explicit?.endpoint||era?.window?.endLabel||null,source,notes,issues,postPrimeFightCount:record&&Number.isFinite(exposure)?Math.max(0,record.scoredFights-exposure):null};
      rows.push(entry);
      if(!era||!record||(!openWindow&&!explicit))missing.push(entry);
      if(issues.length)invalid.push(entry);
    });

    const byKey=new Map(rows.map(entry=>[key(entry.fighter),entry]));
    const report={
      version:VERSION,
      applied:true,
      expectedRosterCount:names.length,
      coveredCount:rows.filter(row=>row.status==='ready').length,
      blockedCount:invalid.length,
      coverageComplete:invalid.length===0&&rows.length===names.length,
      closedWindowCount:rows.filter(row=>!row.openWindow).length,
      openWindowCount:rows.filter(row=>row.openWindow).length,
      closedWindowCounts:CLOSED_WINDOW_COUNTS,
      rows,
      missing,
      invalid,
      entryFor:fighter=>byKey.get(key(fighter))||null,
      mutatesScores:false,
      mutatesPenalty:false,
      generatedAt:new Date().toISOString()
    };
    window.UFC_LOSS_CONTEXT_EXPOSURE_LEDGER=report;
    if(DATA.meta)DATA.meta.lossContextExposureLedger={version:VERSION,expectedRosterCount:report.expectedRosterCount,coveredCount:report.coveredCount,blockedCount:report.blockedCount,coverageComplete:report.coverageComplete,generatedAt:report.generatedAt};
    document.documentElement.setAttribute('data-loss-context-exposure-ledger',`${VERSION}-${report.coveredCount}-${report.blockedCount}`);
    window.dispatchEvent(new CustomEvent('ufc-loss-context-exposure-ledger-ready',{detail:report}));
    return true;
  }

  if(build())return;
  window.UFC_LOSS_CONTEXT_EXPOSURE_LEDGER={version:VERSION,applied:false,status:'waiting-for-era-ledgers',mutatesScores:false,mutatesPenalty:false};
  window.addEventListener('ufc-loss-context-final-reconciliation-ready',()=>build(),{once:true});
  window.addEventListener('ufc-scoring-pipeline-ready',()=>build(),{once:true});
})();

// Roster-dynamic post-pipeline reconciliation.
// The legacy live promoters were judgment-locked to 63 fighters. This layer keeps those
// approved models intact while applying them to the current canonical roster size.
(function(){
  'use strict';

  const VERSION='dynamic-roster-scoring-repair-20260712a';
  const LOCK='loss-context-hybrid-judgment-lock-20260711a';
  const OVR_MIN=82;
  const OVR_MAX=99;
  let applyCount=0;
  let stableRuns=0;
  let intervalId=null;

  const key=name=>String(name||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const round2=value=>Math.round((num(value)+Number.EPSILON)*100)/100;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

  function boards(data){return [...(data?.men||[]),...(data?.women||[])].filter(row=>row?.fighter);}
  function apex(row){
    const override=window.DISPLAY_OVERRIDES?.[row?.fighter]||{};
    return num(row?.apexPeak ?? row?.apexPeakBonus ?? row?.apexPeakAudit?.score ?? override?.apexPeakAudit?.score);
  }
  function total(row){
    return round2(
      num(row?.championship)/30*35+
      num(row?.opponentQuality)/30*27.5+
      num(row?.primeDominance)/30*27.5+
      num(row?.longevity)/30*10+
      apex(row)+
      num(row?.penalty)+
      num(row?.eraDepthAdjustment)
    );
  }
  function rerank(rows){
    rows.sort((a,b)=>num(b.totalScore)-num(a.totalScore)||num(b.championship)-num(a.championship)||String(a.fighter||'').localeCompare(String(b.fighter||'')));
    rows.forEach((row,index)=>{row.rank=index+1;});
  }
  function assignOvrs(data,boardName){
    const rows=data?.[boardName]||[];
    if(!rows.length)return;
    const values=rows.map(row=>num(row.totalScore));
    const high=Math.max(...values);
    const low=Math.min(...values);
    const span=Math.max(high-low,0.01);
    rows.forEach(row=>{
      row.overallOvr=clamp(Math.round(OVR_MIN+(num(row.totalScore)-low)/span*(OVR_MAX-OVR_MIN)),OVR_MIN,OVR_MAX);
    });
  }

  function promoteHybrid(row,result){
    if(row.preHybridLossContextPenalty===undefined)row.preHybridLossContextPenalty=num(row.penalty);
    if(row.preHybridTotalScore===undefined)row.preHybridTotalScore=num(row.totalScore);
    row.penalty=round2(result.recommendedPenalty);
    row.lossPenalty=row.penalty;
    row.lossContext=row.penalty;
    row.lossContextHybrid={
      version:VERSION,
      sourceShadowVersion:window.UFC_LOSS_CONTEXT_HYBRID_SHADOW?.version||null,
      judgmentLockVersion:LOCK,
      severity:result.severity,
      frequency:result.frequency,
      hybridBase:result.hybridBase,
      primeLossCount:result.primeLossCount,
      primeFinishCount:result.primeFinishCount,
      primeVolumeFloor:result.primeVolumeFloor,
      primeVolumeFloorApplied:result.primeVolumeFloorApplied,
      throughPrimeUfcFights:result.exposure,
      divisionMultiplier:result.divisionMultiplier,
      divisionDiscountPct:result.divisionDiscountPct,
      divisionPointsSaved:result.divisionPointsSaved,
      finalPenalty:result.recommendedPenalty,
      worstLosses:result.worstLosses||[]
    };
  }

  function attachDepth(row,result){
    const adjustment=round2(result.curvedAdjustment);
    row.eraDepthAdjustment=adjustment;
    row.divisionEraDepth={
      version:VERSION,
      sourceShadowVersion:window.UFC_DIVISION_ERA_DEPTH_SHADOW?.version||null,
      depthIndex:result.depthIndex,
      adjustment,
      componentRatios:result.componentRatios||{},
      matchedPrimeFightCount:result.matchedPrimeFightCount,
      sampledDivisions:result.sampledDivisions||[],
      primeStart:result.primeStart||null,
      primeEnd:result.primeEnd||null,
      openPrime:Boolean(result.openPrime),
      womenFeatherweightTreatment:result.womenFeatherweightTreatment||null
    };
  }

  function preserveCanonicalDepth(row){
    const adjustment=round2(row.eraDepthAdjustment);
    row.eraDepthAdjustment=adjustment;
    row.divisionEraDepth=row.divisionEraDepth||{
      version:VERSION,
      sourceShadowVersion:null,
      sourceMode:'canonical-roster-extension',
      depthIndex:null,
      adjustment,
      componentRatios:{},
      matchedPrimeFightCount:null,
      sampledDivisions:[],
      primeStart:row.primeStart||null,
      primeEnd:row.primeEnd||null,
      openPrime:false,
      note:'Audited canonical adjustment retained because the pinned 63-fighter empirical depth snapshot predates this roster addition.'
    };
  }

  function sync(data){
    const boardRows=boards(data);
    const byKey=new Map(boardRows.map(row=>[key(row.fighter),row]));
    (data.fighters||[]).forEach(profile=>{
      const board=byKey.get(key(profile?.fighter));
      if(!board)return;
      [
        'penalty','lossPenalty','lossContext','lossContextHybrid','eraDepthAdjustment','divisionEraDepth',
        'preHybridLossContextPenalty','preHybridTotalScore','preEraDepthTotalScore','weightedScoreBreakdown',
        'rawScore','totalScore','rank','scoreFormula','overallOvr','finalScoreEngineVersion','overallScoreOwner'
      ].forEach(field=>{
        if(board[field]!==undefined)profile[field]=board[field];
      });
    });

    window.DISPLAY_OVERRIDES=window.DISPLAY_OVERRIDES||{};
    for(const [boardName,rows] of [['men',data.men||[]],['women',data.women||[]]]){
      rows.forEach(row=>{
        const override=window.DISPLAY_OVERRIDES[row.fighter]=window.DISPLAY_OVERRIDES[row.fighter]||{};
        override.overallOvr=row.overallOvr;
        override.allTimeRank=row.rank;
        override.rankLabel=`${boardName==='women'?'Women':'Men'} #${row.rank}`;
        override.lossContext=row.penalty;
        override.eraDepthAdjustment=row.eraDepthAdjustment;
        override.lossContextHybrid=row.lossContextHybrid;
        override.divisionEraDepth=row.divisionEraDepth;
      });
    }
  }

  function finalize(){
    const data=window.RANKING_DATA;
    const hybridShadow=window.UFC_LOSS_CONTEXT_HYBRID_SHADOW;
    const hybridAudit=window.UFC_LOSS_CONTEXT_HYBRID_AUDIT;
    const eraShadow=window.UFC_DIVISION_ERA_DEPTH_SHADOW;
    const eraAudit=window.UFC_DIVISION_ERA_DEPTH_AUDIT;
    if(!data||!hybridShadow?.applied||!hybridAudit?.applied||!eraShadow||!eraAudit?.applied)return false;
    if(hybridAudit.readyForLivePromotion!==true||hybridAudit.judgmentApproved!==true||hybridAudit.judgmentLockVersion!==LOCK)return false;
    if(eraAudit.readyForLivePromotion!==true||eraAudit.judgmentApproved!==true)return false;

    const boardRows=boards(data);
    if(!boardRows.length)return false;

    const hybridByKey=new Map((hybridShadow.scored||[]).map(result=>[key(result.fighter),result]));
    const missingHybrid=boardRows.filter(row=>!hybridByKey.has(key(row.fighter))).map(row=>row.fighter);
    if(missingHybrid.length)return false;
    boardRows.forEach(row=>promoteHybrid(row,hybridByKey.get(key(row.fighter))));

    const eraByKey=new Map((eraShadow.fighters||[]).map(result=>[key(result.fighter),result]));
    const missingDepth=[];
    const canonicalDepthExtensions=[];
    boardRows.forEach(row=>{
      const result=eraByKey.get(key(row.fighter));
      if(result){
        attachDepth(row,result);
      }else if(Number.isFinite(Number(row.eraDepthAdjustment))){
        preserveCanonicalDepth(row);
        canonicalDepthExtensions.push(row.fighter);
      }else{
        missingDepth.push(row.fighter);
      }
    });
    if(missingDepth.length)return false;

    const engineResult=window.UFC_FINAL_SCORE_ENGINE?.apply?.('dynamic-roster-scoring-repair');
    if(!engineResult?.applied){
      boardRows.forEach(row=>{
        row.apexPeak=apex(row);
        row.apexPeakBonus=row.apexPeak;
        row.rawScore=total(row);
        row.totalScore=row.rawScore;
        row.scoreFormula='championship/30*35 + opponentQuality/30*27.5 + primeDominance/30*27.5 + longevity/30*10 + apexPeak + hybridLossContext + eraDepthAdjustment';
      });
      rerank(data.men||[]);
      rerank(data.women||[]);
      assignOvrs(data,'men');
      assignOvrs(data,'women');
    }

    sync(data);
    const finalRows=boards(data);
    const byKey=new Map(finalRows.map(row=>[key(row.fighter),row]));
    const scoreMismatches=finalRows.filter(row=>Math.abs(num(row.totalScore)-total(row))>0.011).map(row=>row.fighter);
    const gaethje=byKey.get(key('Justin Gaethje'))||null;
    const dricus=byKey.get(key('Dricus du Plessis'))||null;
    const applied=scoreMismatches.length===0&&Boolean(gaethje)&&Boolean(dricus);

    const hybridReport={
      ...(window.UFC_LOSS_CONTEXT_HYBRID_LIVE||{}),
      version:'loss-context-hybrid-live-dynamic-roster-20260712a',
      applied,
      mode:'live-canonical-hybrid-loss-context-dynamic-roster',
      sourceShadowVersion:hybridShadow.version,
      sourceAuditVersion:hybridAudit.version,
      judgmentLockVersion:LOCK,
      rosterCount:finalRows.length,
      promotedCount:finalRows.length,
      blockedCount:0,
      mismatchCount:scoreMismatches.length,
      mismatches:scoreMismatches,
      results:finalRows.map(row=>({fighter:row.fighter,board:(data.women||[]).includes(row)?'women':'men',rank:row.rank,totalScore:row.totalScore,penalty:row.penalty,overallOvr:row.overallOvr,lossContextHybrid:row.lossContextHybrid})),
      entryFor:fighter=>byKey.get(key(fighter))||null,
      dynamicRosterRepairVersion:VERSION,
      appliedAt:new Date().toISOString()
    };
    window.UFC_LOSS_CONTEXT_HYBRID_LIVE=hybridReport;

    const eraReport={
      ...(window.UFC_DIVISION_ERA_DEPTH_LIVE||{}),
      version:'division-era-depth-live-dynamic-roster-20260712a',
      applied,
      mode:'live-canonical-division-era-depth-dynamic-roster',
      sourceShadowVersion:eraShadow.version,
      sourceAuditVersion:eraAudit.version,
      rosterCount:finalRows.length,
      promotedCount:finalRows.length,
      empiricalPromotionCount:eraByKey.size,
      canonicalExtensionCount:canonicalDepthExtensions.length,
      canonicalExtensions:canonicalDepthExtensions,
      mismatchCount:scoreMismatches.length,
      mismatches:scoreMismatches,
      results:finalRows.map(row=>({fighter:row.fighter,board:(data.women||[]).includes(row)?'women':'men',rank:row.rank,totalScore:row.totalScore,eraDepthAdjustment:row.eraDepthAdjustment,overallOvr:row.overallOvr,divisionEraDepth:row.divisionEraDepth})),
      dynamicRosterRepairVersion:VERSION,
      finalizedAfterPipeline:true,
      finalizedAt:new Date().toISOString()
    };
    window.UFC_DIVISION_ERA_DEPTH_LIVE=eraReport;

    data.meta=data.meta||{};
    data.meta.lossContextHybridLive={
      version:hybridReport.version,
      judgmentLockVersion:LOCK,
      rosterCount:finalRows.length,
      promotedCount:finalRows.length,
      mismatchCount:hybridReport.mismatchCount,
      applied:hybridReport.applied,
      dynamicRosterRepairVersion:VERSION,
      appliedAt:hybridReport.appliedAt
    };
    data.meta.divisionEraDepthLive={
      version:eraReport.version,
      sourceShadowVersion:eraShadow.version,
      sourceAuditVersion:eraAudit.version,
      rosterCount:finalRows.length,
      promotedCount:finalRows.length,
      empiricalPromotionCount:eraByKey.size,
      canonicalExtensionCount:canonicalDepthExtensions.length,
      mismatchCount:eraReport.mismatchCount,
      applied:eraReport.applied,
      finalizedAfterPipeline:true,
      dynamicRosterRepairVersion:VERSION,
      appliedAt:eraReport.finalizedAt
    };

    applyCount+=1;
    const relationshipRestored=Boolean(gaethje&&dricus&&num(gaethje.rank)<num(dricus.rank));
    const report={
      version:VERSION,
      applied,
      applyCount,
      rosterCount:finalRows.length,
      hybridScoredCount:hybridByKey.size,
      empiricalEraDepthCount:eraByKey.size,
      canonicalEraDepthExtensions:canonicalDepthExtensions,
      missingHybrid,
      missingDepth,
      scoreMismatches,
      anchors:{
        justinGaethje:gaethje?{rank:gaethje.rank,totalScore:gaethje.totalScore,penalty:gaethje.penalty,eraDepthAdjustment:gaethje.eraDepthAdjustment,overallOvr:gaethje.overallOvr}:null,
        dricusDuPlessis:dricus?{rank:dricus.rank,totalScore:dricus.totalScore,penalty:dricus.penalty,eraDepthAdjustment:dricus.eraDepthAdjustment,overallOvr:dricus.overallOvr}:null
      },
      gaethjeAheadOfDricus:relationshipRestored,
      finalScoreEngineVersion:window.UFC_FINAL_SCORE_ENGINE?.version||null,
      appliedAt:new Date().toISOString()
    };
    window.UFC_DYNAMIC_ROSTER_SCORING_REPAIR=report;
    document.documentElement.setAttribute('data-dynamic-roster-scoring-repair',`${VERSION}-${finalRows.length}-${applied?'ready':'mismatch'}`);
    document.documentElement.setAttribute('data-loss-context-hybrid-live',`${hybridReport.version}-${finalRows.length}-${hybridReport.mismatchCount}`);
    document.documentElement.setAttribute('data-division-era-depth-live',`${eraReport.version}-${finalRows.length}-${eraReport.mismatchCount}`);

    if(typeof window.refresh==='function')window.refresh();
    if(typeof window.renderCategories==='function')window.renderCategories();
    if(window.UFC_HOME_POLISH?.refreshHero)window.UFC_HOME_POLISH.refreshHero();
    if(window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER?.render)window.UFC_OCTAGON_VERDICT_COMPARE_LAUNCHER.render();
    window.dispatchEvent(new CustomEvent('ufc-dynamic-roster-scoring-repaired',{detail:report}));
    return applied;
  }

  function attempt(){
    const applied=finalize();
    stableRuns=applied?stableRuns+1:0;
    if(stableRuns>=3&&intervalId){
      clearInterval(intervalId);
      intervalId=null;
    }
  }

  [
    'ufc-loss-context-hybrid-audit-ready',
    'ufc-division-era-depth-live-ready',
    'ufc-division-era-depth-finalized',
    'ufc-scoring-pipeline-ready',
    'ufc-ranking-data-patches-ready'
  ].forEach(eventName=>window.addEventListener(eventName,attempt));

  [0,50,250,750,1500,3000,5000].forEach(delay=>setTimeout(attempt,delay));
  intervalId=setInterval(attempt,400);
  setTimeout(()=>{if(intervalId){clearInterval(intervalId);intervalId=null;}},8000);

  window.UFC_DYNAMIC_ROSTER_SCORING_REPAIR={version:VERSION,applied:false,status:'waiting-for-full-scoring-pipeline'};
})();

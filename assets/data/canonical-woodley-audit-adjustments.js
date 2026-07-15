// Cody-approved Tyron Woodley fighter audit corrections.
// Input-only layer: updates canonical facts, judgment inputs, shared era context, and presentation copy.
// It never writes a manual category score, total, rank, OVR, or division rank.
(function(){
  'use strict';

  const VERSION='canonical-woodley-audit-adjustments-20260715a';
  const FIGHTER='Tyron Woodley';
  const clean=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/[^a-z0-9']+/g,' ').replace(/\s+/g,' ').trim();
  const round2=value=>{const rounded=Math.round((Number(value||0)+Number.EPSILON)*100)/100;return Object.is(rounded,-0)?0:rounded;};
  let applying=false;
  let applied=false;

  const OQ_ADJUSTMENTS=Object.freeze([
    Object.freeze({opponent:'Carlos Condit',baseTier:'top-five',baseCredit:1,finalCredit:.85,adjustmentType:'injury-finish-context',adjustmentValue:-.15,note:'Top-five welterweight win discounted because the finish came through Condit’s knee injury.'}),
    Object.freeze({opponent:'Kelvin Gastelum',baseTier:'top-five',baseCredit:1,finalCredit:.85,adjustmentType:'catchweight-close-result-context',adjustmentValue:-.15,note:'Top-five contender base tier retained; final credit remains discounted for catchweight and razor-thin split-decision context.'}),
    Object.freeze({opponent:'Demian Maia',baseTier:'top-five',baseCredit:1,finalCredit:.85,adjustmentType:'late-career-short-turnaround-context',adjustmentValue:-.15,note:'Top-five title challenger base tier retained; final credit remains discounted for late-career and short-turnaround context.'}),
    Object.freeze({opponent:'Josh Koscheck',baseTier:'ranked',baseCredit:.65,finalCredit:.45,adjustmentType:'late-career-timing',adjustmentValue:-.20,note:'Former top contender discounted to supporting-win value because of clear late-career timing.'})
  ]);

  const TITLE_CREDITS=Object.freeze({
    '2016-07-30-robbie-lawler':1,
    '2017-03-04-stephen-thompson':.90,
    '2017-07-29-demian-maia':.90,
    '2018-09-08-darren-till':.85
  });

  function patchCanonicalFacts(){
    const api=window.UFC_CANONICAL_FIGHTER_FACTS;
    if(!api?.get||!api?.replace||!api?.deriveFor)throw new Error('Missing canonical fighter facts API.');
    const record=api.get(FIGHTER);
    if(!record)throw new Error(`Missing canonical fighter record: ${FIGHTER}.`);

    record.primeWindow={
      ...(record.primeWindow||{}),
      startFightId:'2014-03-15-carlos-condit',
      endFightId:'2019-03-02-kamaru-usman',
      open:false,
      reviewStatus:'locked',
      note:'Cody-approved Woodley audit: Carlos Condit starts the connected UFC elite-prime window. Rory MacDonald was recovered from by becoming champion. Kamaru Usman is the unrecovered endpoint; Gilbert Burns confirms the decline but is post-prime.'
    };
    record.divisionStrength={
      ...(record.divisionStrength||{}),
      defaultKey:'woodley-welterweight-neutral-1.00',
      reviewStatus:'locked',
      note:'Cody-approved Woodley audit: treat his welterweight era as neutral rather than bonus-strength context.'
    };

    Object.entries(TITLE_CREDITS).forEach(([fightId,credit])=>{
      const fight=(record.fights||[]).find(row=>row.id===fightId);
      if(!fight)throw new Error(`Missing Woodley title fight: ${fightId}.`);
      fight.championshipContext={
        ...(fight.championshipContext||{}),
        opponentStrength:credit,
        reviewStatus:'locked',
        note:[fight?.championshipContext?.note,`Cody-approved Woodley audit title credit: ${credit.toFixed(2)}.`].filter(Boolean).join(' ')
      };
      delete fight.championshipContext.manualCredit;
    });

    api.replace(record,'Cody-approved Tyron Woodley input-first GOAT audit corrections.');
    const derived=api.deriveFor(FIGHTER);
    const expected={primeRecord:'7-2-1',adjustedTitleWins:3.65,throughPrime:13};
    if(derived?.prime?.recordText!==expected.primeRecord)throw new Error(`Woodley prime record expected ${expected.primeRecord}; received ${derived?.prime?.recordText}.`);
    if(round2(derived?.championship?.adjustedTitleWins)!==expected.adjustedTitleWins)throw new Error(`Woodley adjusted title wins expected ${expected.adjustedTitleWins}; received ${derived?.championship?.adjustedTitleWins}.`);
    if(Number(derived?.lossExposure?.throughPrimeUfcFights)!==expected.throughPrime)throw new Error(`Woodley through-prime exposure expected ${expected.throughPrime}; received ${derived?.lossExposure?.throughPrimeUfcFights}.`);
    return derived;
  }

  function patchOpponentQualityJudgments(){
    const api=window.UFC_CANONICAL_SCORING_JUDGMENTS;
    if(!api?.entryFor)throw new Error('Missing canonical scoring judgments API.');
    if(api.__woodleyAuditVersion===VERSION)return;
    const originalEntryFor=api.entryFor.bind(api);
    const originalList=api.list?.bind(api)||null;

    function applyToRow(row){
      if(!row||!Array.isArray(row.inputs))return row;
      OQ_ADJUSTMENTS.forEach(adjustment=>{
        const target=row.inputs.find(input=>clean(input?.opponent)===clean(adjustment.opponent));
        if(!target)throw new Error(`Missing Woodley Opponent Quality row: ${adjustment.opponent}.`);
        target.baseTier=adjustment.baseTier;
        target.baseCredit=adjustment.baseCredit;
        target.adjustments=[{type:adjustment.adjustmentType,value:adjustment.adjustmentValue,note:adjustment.note}];
        target.finalCredit=adjustment.finalCredit;
        target.judgmentSource='cody-approved-fighter-audit';
        target.judgmentStatus='cody-approved';
        target.reviewStatus='locked';
        target.note=adjustment.note;
        target.provenance='canonical UFC fight fact + Cody-approved Tyron Woodley audit judgment';
      });
      return row;
    }

    api.entryFor=function(category,fighter){
      const row=originalEntryFor(category,fighter);
      return category==='opponentQuality'&&clean(fighter)===clean(FIGHTER)?applyToRow(row):row;
    };
    if(originalList){
      api.list=function(category){
        const rows=originalList(category);
        if(category!=='opponentQuality')return rows;
        return rows.map(row=>{
          const fighter=row?.inputs?.[0]?.fighter||row?.fighter||row?.normalized||'';
          return clean(fighter)===clean(FIGHTER)?applyToRow(row):row;
        });
      };
    }
    Object.defineProperty(api,'__woodleyAuditVersion',{value:VERSION,configurable:true});
    applyToRow(originalEntryFor('opponentQuality',FIGHTER));
  }

  function patchSharedEraLedger(){
    const era=window.UFC_FIGHTER_ERA_LEDGERS;
    const ledger=era?.ledgers?.[FIGHTER]||era?.entryFor?.(FIGHTER);
    if(!ledger)throw new Error('Missing Woodley shared Fighter Era Ledger.');
    ledger.window={
      ...(ledger.window||{}),
      start:'2014-03-15',
      startLabel:'Carlos Condit',
      end:'2019-03-02',
      endLabel:'Kamaru Usman',
      endType:'unrecovered_elite_loss',
      endReason:'Rory MacDonald was recovered from by becoming champion. Kamaru Usman is the unrecovered endpoint; Burns, Covington, and Luque are post-prime decline context.'
    };
    ledger.longevity={
      ...(ledger.longevity||{}),
      divisionMultiplier:1.00,
      adjustmentNote:'Carlos Condit through Kamaru Usman. Neutral welterweight division treatment; no division-strength bonus.',
      note:'Cody-approved Woodley audit: retain the champion-status multiplier but remove the welterweight division bonus.'
    };
    ledger.lossContext={
      ...(ledger.lossContext||{}),
      unrecoveredLoss:{label:'Kamaru Usman',date:'2019-03-02',type:'prime elite title decision loss'},
      postPrimeLosses:['Gilbert Burns, Colby Covington, and Vicente Luque decline context.']
    };
    ledger.notes='Cody-approved Woodley audit: Condit-to-Usman shared window with neutral welterweight division treatment.';
    ledger.approvedWoodleyAudit={approved:true,approvedBy:'Cody',approvedAt:'2026-07-15',version:VERSION};
  }

  function patchEraDepthResolution(){
    const current=window.UFC_CANONICAL_DIVISION_ERA_DEPTH_APPROVED_RESOLUTIONS;
    if(!current?.entryFor)throw new Error('Missing canonical Division-Era Depth resolution API.');
    if(current.__woodleyAuditVersion===VERSION)return;
    const originalEntryFor=current.entryFor.bind(current);
    const resolution=Object.freeze({
      fighter:FIGHTER,
      classification:'fighter-audit-neutralization',
      approvalStatus:'cody-approved',
      decision:'Treat Woodley-era welterweight as neutral. The measured +0.21 is too small and too sensitive to justify an affirmative GOAT bonus.',
      approvedAdjustment:0,
      approvedBy:'Cody',
      approvedAt:'2026-07-15',
      provenance:'Cody-approved Tyron Woodley input-first GOAT audit'
    });
    const priorRows=Array.isArray(current.rows)?current.rows.filter(row=>clean(row?.fighter)!==clean(FIGHTER)):[];
    window.UFC_CANONICAL_DIVISION_ERA_DEPTH_APPROVED_RESOLUTIONS=Object.freeze({
      ...current,
      version:'canonical-division-era-depth-approved-resolutions-20260715c-woodley-neutral',
      rows:Object.freeze([...priorRows,resolution]),
      fighterCount:priorRows.length+1,
      entryFor:fighter=>clean(fighter)===clean(FIGHTER)?resolution:originalEntryFor(fighter),
      __woodleyAuditVersion:VERSION
    });
  }

  function patchPresentationCopy(){
    const replacements=[
      [/Usman\/Burns exposed the ending sharply/gi,'Usman ended the prime window and Burns confirmed the decline'],
      [/before the Usman\/Burns ending/gi,'before Usman ended the prime window and Burns confirmed the decline'],
      [/Usman plus Burns clearly end the prime window/gi,'Usman clearly ended the prime window, while Burns confirmed the decline'],
      [/Usman\/Burns ending/gi,'Usman endpoint and Burns decline confirmation']
    ];
    const patch=value=>{
      if(typeof value==='string')return replacements.reduce((text,[pattern,replacement])=>text.replace(pattern,replacement),value);
      if(Array.isArray(value))return value.map(patch);
      if(value&&typeof value==='object')Object.keys(value).forEach(key=>{value[key]=patch(value[key]);});
      return value;
    };
    if(window.DISPLAY_OVERRIDES?.[FIGHTER])patch(window.DISPLAY_OVERRIDES[FIGHTER]);
    if(window.COMPARE_PROFILES?.[FIGHTER])patch(window.COMPARE_PROFILES[FIGHTER]);
  }

  function rerunProduction(){
    const pipeline=window.UFC_RANKING_PIPELINE;
    if(!pipeline?.apply)throw new Error('Missing production ranking pipeline.');
    const report=pipeline.apply();
    const divisionReport=window.UFC_DIVISION_RANKING_PIPELINE?.rebuild?.()||null;
    window.UFC_PRODUCTION_RANKING_BOOTSTRAP?.syncComparePresentation?.();
    window.UFC_RANKING_DATA_PATCHES_V1?.syncCalculatedRosterPhotos?.({refresh:false,source:'woodley-audit'});
    window.UFC_OCTAGON_VERDICT_DATA?.build?.();
    if(typeof window.refresh==='function')window.refresh();

    const row=window.UFC_CALCULATED_RANKING_PROJECTION?.entryFor?.(FIGHTER);
    if(!row)throw new Error('Missing recalculated Woodley projection.');
    const expected={opponentQuality:14.81,longevity:13.41,penalty:-2.37,eraDepthAdjustment:0,totalScore:47.49,overallOvr:89};
    Object.entries(expected).forEach(([field,value])=>{
      if(round2(row[field])!==value)throw new Error(`Woodley ${field} expected ${value}; received ${row[field]}.`);
    });
    if(row.primeRecord!=='7-2-1')throw new Error(`Woodley visible prime record expected 7-2-1; received ${row.primeRecord}.`);
    if(round2(row.roundsWonPct)!==59.38)throw new Error(`Woodley rounds won expected 59.38; received ${row.roundsWonPct}.`);
    if(round2(row.adjustedTitleWins)!==3.65)throw new Error(`Woodley adjusted title wins expected 3.65; received ${row.adjustedTitleWins}.`);

    const detail={version:VERSION,applied:true,passed:true,fighter:FIGHTER,row,report,divisionReport,inputChanges:{conditFinalCredit:.85,koscheckFinalCredit:.45,welterweightDivisionMultiplier:1,eraDepthAdjustment:0,primeStart:'Carlos Condit',primeEnd:'Kamaru Usman'}};
    window.UFC_CANONICAL_WOODLEY_AUDIT_ADJUSTMENTS=detail;
    document.documentElement.setAttribute('data-canonical-woodley-audit',`${VERSION}-clean-${row.rank}`);
    window.dispatchEvent(new CustomEvent('ufc-woodley-audit-applied',{detail}));
    window.dispatchEvent(new CustomEvent('ufc-production-ranking-ready',{detail:{report,divisionReport,woodleyAudit:detail}}));
    return detail;
  }

  function apply(){
    if(applied||applying)return window.UFC_CANONICAL_WOODLEY_AUDIT_ADJUSTMENTS||null;
    if(document.documentElement.getAttribute('data-scoring-pipeline')!=='ready')return null;
    applying=true;
    try{
      patchCanonicalFacts();
      patchOpponentQualityJudgments();
      patchSharedEraLedger();
      patchEraDepthResolution();
      patchPresentationCopy();
      const detail=rerunProduction();
      applied=true;
      return detail;
    }catch(error){
      const detail={version:VERSION,applied:false,passed:false,error:String(error?.message||error)};
      window.UFC_CANONICAL_WOODLEY_AUDIT_ADJUSTMENTS=detail;
      document.documentElement.setAttribute('data-canonical-woodley-audit',`${VERSION}-error`);
      console.error(`[${VERSION}]`,error);
      return detail;
    }finally{
      applying=false;
    }
  }

  window.addEventListener('ufc-production-ranking-ready',()=>setTimeout(apply,0),{once:true});
  if(document.documentElement.getAttribute('data-scoring-pipeline')==='ready')setTimeout(apply,0);
  window.UFC_APPLY_WOODLEY_AUDIT=apply;
})();

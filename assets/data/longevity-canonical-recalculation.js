// Canonical Longevity recalculation for Cody-approved Fighter Era window changes.
// Updates Era Ledger inputs only; the existing shadow scorer and live promoter own the /30 category score.
(function(){
  'use strict';
  const VERSION='longevity-canonical-recalculation-20260710b-eleven-window-rebuild';
  const AS_OF='2026-07-10';
  const GAP_CAP_MONTHS=18;
  const era=window.UFC_FIGHTER_ERA_LEDGERS;
  const ledgers=era?.ledgers;

  if(!ledgers){
    window.UFC_CANONICAL_LONGEVITY_RECALCULATION={version:VERSION,error:'Missing UFC_FIGHTER_ERA_LEDGERS.',mutatesScores:false};
    return;
  }

  const RECALCULATED={
    'Dustin Poirier':{
      gapAdjustedMonths:73.6,
      window:'Justin Gaethje I → Islam Makhachev',
      note:'Gaethje I starts the connected elite-lightweight window; Islam remains the endpoint.'
    },
    'Justin Gaethje':{
      gapAdjustedMonths:67.6,
      window:'James Vick → Max Holloway',
      note:'Vick, Barboza, and Cerrone are now included before the Ferguson breakthrough.'
    },
    'Israel Adesanya':{
      gapAdjustedMonths:64.2,
      window:'Kelvin Gastelum → Dricus du Plessis',
      note:'The interim-title win over Gastelum starts the canonical championship-level window.'
    },
    'Ronda Rousey':{
      gapAdjustedMonths:46.2,
      window:'Liz Carmouche → Amanda Nunes',
      note:'The first UFC title defense is included; Holm and Nunes remain inside the same window.'
    },
    'Randy Couture':{
      gapAdjustedMonths:128.7,
      window:'Vitor Belfort I → Brock Lesnar',
      startCorrection:'1997-10-17',
      note:'The full UFC championship arc is connected, with every inactivity gap capped at 18 months.'
    },
    'Chuck Liddell':{
      gapAdjustedMonths:59.1,
      window:'Vitor Belfort → Quinton Jackson II',
      note:'The full connected elite run now includes the Belfort and Sobral wins plus the Couture interim-title loss before the championship reign.'
    },
    'T.J. Dillashaw':{
      gapAdjustedMonths:88.8,
      window:'Renan Barao I → Aljamain Sterling',
      note:'The suspension gap is capped at 18 months; the Sandhagen win re-opened elite proof before Sterling.'
    },
    'Aljamain Sterling':{
      gapAdjustedMonths:85.1,
      window:'Pedro Munhoz → Current elite form',
      note:'The window starts at Munhoz and stays open through the featherweight extension.'
    },
    'Sean Strickland':{
      gapAdjustedMonths:59.3,
      window:'Uriah Hall → Current elite form',
      note:'Hall begins the sustained elite contender run that produced the title.'
    },
    'Robert Whittaker':{
      gapAdjustedMonths:94.9,
      window:'Derek Brunson → Khamzat Chimaev',
      note:'Brunson is included as the first elite breakthrough before the Jacare/title run.'
    },
    'Dan Henderson':{
      gapAdjustedMonths:64.2,
      window:'Rich Franklin → Daniel Cormier',
      note:'The former-champion win over Franklin begins the late UFC elite window.'
    }
  };

  function round2(value){return Math.round((Number(value||0)+Number.EPSILON)*100)/100;}
  function previewScore(months,statusMultiplier,divisionMultiplier){
    const counted=Number(months||0)*Number(statusMultiplier||1)*Number(divisionMultiplier||1);
    return {countedEliteMonths:round2(counted),score:round2(Math.min(30,Math.max(0,(counted/144)*30)))};
  }

  const applied=[];
  const missing=[];
  Object.entries(RECALCULATED).forEach(([fighter,input])=>{
    const ledger=ledgers[fighter];
    if(!ledger){missing.push(fighter);return;}

    if(input.startCorrection){
      ledger.window={...(ledger.window||{}),start:input.startCorrection};
      ledger.windowDecision={
        ...(ledger.windowDecision||{}),
        approved:true,
        approvedBy:'Cody',
        dateCorrection:'Vitor Belfort I occurred on 1997-10-17.',
        version:VERSION
      };
    }

    const previous={...(ledger.longevity||{})};
    const statusMultiplier=Number(previous.statusMultiplier||1);
    const divisionMultiplier=Number(previous.divisionMultiplier||1);
    const activeEliteYears=round2(Number(input.gapAdjustedMonths)/12);
    const preview=previewScore(input.gapAdjustedMonths,statusMultiplier,divisionMultiplier);

    ledger.longevity={
      ...previous,
      gapCapMonths:GAP_CAP_MONTHS,
      gapAdjustedMonths:Number(input.gapAdjustedMonths),
      activeEliteYears,
      adjustmentNote:`${input.window}. ${input.note}`,
      windowLockedPendingRecalculation:false,
      canonicalWindowRecalculated:true,
      canonicalWindowRecalculationVersion:VERSION,
      calculationAsOf:AS_OF
    };

    applied.push({
      fighter,
      window:`${ledger.window?.startLabel||ledger.window?.start||'Start'} → ${ledger.window?.endLabel||ledger.window?.end||'Current'}`,
      gapAdjustedMonths:Number(input.gapAdjustedMonths),
      activeEliteYears,
      gapCapMonths:GAP_CAP_MONTHS,
      statusMultiplier,
      divisionMultiplier,
      countedEliteMonths:preview.countedEliteMonths,
      longevityScorePreview:preview.score,
      priorGapAdjustedMonths:Number(previous.gapAdjustedMonths||0),
      priorActiveEliteYears:Number(previous.activeEliteYears||0)
    });
  });

  const stillPending=Object.keys(ledgers).filter(fighter=>!!ledgers[fighter]?.longevity?.windowLockedPendingRecalculation);
  window.UFC_CANONICAL_LONGEVITY_RECALCULATION={
    version:VERSION,
    source:'Cody-approved canonical Fighter Era windows',
    asOf:AS_OF,
    gapCapMonths:GAP_CAP_MONTHS,
    formulaPreview:'score = min(30, (gapAdjustedMonths × statusMultiplier × divisionMultiplier) / 144 × 30)',
    fighters:Object.keys(RECALCULATED),
    applied,
    appliedCount:applied.length,
    missing,
    stillPending,
    allChangedWindowsRecalculated:missing.length===0&&stillPending.length===0,
    correctsRandyBelfortDate:true,
    mutatesEraLongevityInputs:true,
    mutatesScores:false,
    appliedAt:new Date().toISOString()
  };
  era.canonicalLongevityRecalculation=window.UFC_CANONICAL_LONGEVITY_RECALCULATION;
  document.documentElement.setAttribute('data-canonical-longevity-recalculation',`${VERSION}-${applied.length}`);
})();
// Prime Dominance shadow ledger. No live score changes.
(function(){
  const VERSION='prime-dominance-ledgers-20260708a-batch-one';
  const COMPONENTS={primeRecord:8,roundControl:7,separation:6,finishPressure:4,eliteStakes:5,total:30};
  const DEFINITION='Prime Dominance measures how clearly a fighter separated during their actual UFC prime window. It rewards prime record, round control, separation, finish pressure, and dominance under elite stakes.';
  const RAW={
    'Khabib Nurmagomedov':{scores:[8,7,6,3.5,4.5],labels:['7-0','Near-total control','Minimal resistance','Late-prime finisher','Title-level LW finish'],profile:'Smothering lightweight control with no UFC loss',status:'locked'},
    'Jon Jones':{scores:[8,6.5,5.25,3.5,5],labels:['16-0, 1 NC','Elite control','Late close fights cap it','Danger everywhere','Historic title gauntlet'],profile:'Longest elite control window with unmatched title-stage proof',status:'locked'},
    'Demetrious Johnson':{scores:[7.25,6.75,5.5,3.5,5],labels:['12-1-1','Clean minute winner','High technical separation','Sneaky finishing peak','Full title-era validation'],profile:'Complete flyweight control with elite title consistency',status:'locked'},
    'Georges St-Pierre':{scores:[7.5,7,5.25,2.75,5],labels:['14-1','Historic round control','Hendricks caps perfection','Lower finish pressure','Elite title-stage proof'],profile:'Cleanest control champion of the modern UFC era',status:'locked'},
    'Anderson Silva':{scores:[7,5.75,5.75,4,5],labels:['16-2','Strong but chaos-friendly','Peak aura was massive','Legendary finisher','Long title-stage reign'],profile:'Best finish aura, with Weidman losses capping perfection',status:'locked'},
    'Islam Makhachev':{scores:[8,6.75,5.5,3.5,3.75],labels:['active unbeaten prime','Elite control','Clear separation','Real finishing layer','Still building title volume'],profile:'Modern lightweight control monster, still adding elite-stakes volume',status:'review'},
    'Ronda Rousey':{scores:[8,5.75,6,4,3.75],labels:['6-0','Fast fight control','Huge division gap','Historic finish pressure','Short title window'],profile:'Short, explosive title-prime dominance with a hard stop at Holm',status:'locked'},
    'Amanda Nunes':{scores:[7,5.75,5.25,4,5],labels:['review','Strong control','Two-division separation','Elite finishing threat','Two-division title proof'],profile:'Two-division finishing dominance with one major blemish avenged',status:'locked'},
    'Valentina Shevchenko':{scores:[7,6.75,5,3.25,4.5],labels:['review','Excellent control','Grasso rivalry caps it','Solid finishing layer','Long title-stage proof'],profile:'Technical flyweight control with late-rivalry resistance',status:'review'},
    'Alexander Volkanovski':{scores:[7,6.5,5,3,4.75],labels:['active elite prime','Elite round control','Close elite fights cap it','Moderate finish pressure','Featherweight title proof'],profile:'High-IQ featherweight control with elite close-fight context',status:'locked'},
    'Kamaru Usman':{scores:[7,6.25,5,3,4.75],labels:['10-2','Strong pressure/control','Leon KO caps run','Moderate finish pressure','Strong WW title proof'],profile:'Powerful welterweight control run stopped by Edwards',status:'review'},
    'Israel Adesanya':{scores:[6.75,6.5,4.75,2.5,5],labels:['review','Elite kickboxing control','Some narrow/low-output wins','Lower finish rate','Long MW title proof'],profile:'Elite middleweight control with lower finish pressure',status:'review'},
    'Max Holloway':{scores:[6.75,6.25,5,3,3.75],labels:['review','High-volume control','Deep but not always title-winning','Strong pressure','Less title-stage dominance than top tier'],profile:'Relentless featherweight volume and pace over a long elite window',status:'review'},
    'Zhang Weili':{scores:[6.5,5.75,5,3.25,4],labels:['active','Strong control','Rose losses cap it','Real finishing threat','Second-reign proof building'],profile:'Explosive strawweight prime with dominant second-reign control',status:'review'},
    'Jose Aldo':{scores:[5.75,5.5,4.75,2.5,4],labels:['UFC-only review','Strong but late-window','UFC-only excludes WEC peak','Moderate finish pressure','Title-level UFC proof'],profile:'UFC-only prime is strong but misses the WEC dominance peak',status:'review'}
  };
  function round(v){return Math.round((Number(v||0)+Number.EPSILON)*100)/100;}
  function total(row){return round((row.scores||[]).reduce((sum,x)=>sum+Number(x||0),0));}
  function entryFor(fighter){const row=RAW[fighter];if(!row)return null;const [primeRecord,roundControl,separation,finishPressure,eliteStakes]=row.scores;return{fighter,primeRecordScore:primeRecord,roundControlScore:roundControl,separationScore:separation,finishPressureScore:finishPressure,eliteStakesScore:eliteStakes,total:total(row),labels:row.labels,dominanceProfile:row.profile,status:row.status,primeWindow:window.UFC_PRIME_WINDOWS?.entryFor?.(fighter)||null,version:VERSION};}
  function allRowsFor(name){const DATA=window.RANKING_DATA||{};const rows=[];const push=row=>{if(row&&row.fighter===name)rows.push(row);};(DATA.men||[]).forEach(push);(DATA.women||[]).forEach(push);(DATA.fighters||[]).forEach(push);return rows;}
  function report(){return Object.keys(RAW).map(entryFor).filter(Boolean).sort((a,b)=>b.total-a.total||a.fighter.localeCompare(b.fighter));}
  function apply(){const applied=[];report().forEach(entry=>{allRowsFor(entry.fighter).forEach(row=>{row.primeDominanceShadowAudit=entry;});if(typeof DISPLAY_OVERRIDES!=='undefined'){DISPLAY_OVERRIDES[entry.fighter]=DISPLAY_OVERRIDES[entry.fighter]||{};DISPLAY_OVERRIDES[entry.fighter].snapshotStats={...(DISPLAY_OVERRIDES[entry.fighter].snapshotStats||{}),primeDominanceShadow:entry.total,dominanceProfile:entry.dominanceProfile};}applied.push(entry.fighter);});return applied;}
  function evidenceItems(f){const entry=entryFor(f?.fighter)||{};const labels=entry.labels||[];return[['Prime record',labels[0]||'Prime window loaded'],['Round control',labels[1]||'Round control review'],['Finish pressure',labels[3]||'Finish pressure review'],['Dominance profile',entry.dominanceProfile||'Prime dominance profile pending']];}
  const previousEvidence=typeof categoryEvidenceItems==='function'?categoryEvidenceItems:null;
  if(previousEvidence){categoryEvidenceItems=function(f,key){if(key==='primeDominance')return evidenceItems(f);return previousEvidence(f,key);};}
  const previousLogic=typeof categoryLogicSentence==='function'?categoryLogicSentence:null;
  if(previousLogic){categoryLogicSentence=function(f,key){if(key==='primeDominance')return DEFINITION;return previousLogic(f,key);};}
  const applied=apply();
  window.UFC_PRIME_DOMINANCE_LEDGERS={version:VERSION,mode:'shadow-batch-one',components:COMPONENTS,definition:DEFINITION,raw:RAW,report:report(),leaders:report().slice(0,15),entryFor,apply,applied,appliedAt:new Date().toISOString()};
  document.documentElement.setAttribute('data-prime-dominance-ledgers',VERSION);
  if(typeof refresh==='function'){try{refresh();}catch(e){}}
})();
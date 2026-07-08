// Prime Dominance shadow ledger. Data-input restart. No live score changes.
(function(){
  const VERSION='prime-dominance-ledgers-20260708b-data-restart';
  const COMPONENTS={primeRecord:8,roundControl:7,separation:6,finishPressure:4,eliteStakes:5,total:30};
  const DEFINITION='Prime Dominance measures how clearly a fighter separated during their actual UFC prime window. Prime record, round control, and finish pressure are data-input driven; separation and elite-stakes validation are context scored.';
  const FINISH_SCALE=[{min:.75,score:4},{min:.60,score:3.5},{min:.45,score:3},{min:.30,score:2.25},{min:.15,score:1.5},{min:.01,score:.75},{min:0,score:0}];
  const RAW={
    'Khabib Nurmagomedov':{primeRecord:'8-0',primeRecordScore:8,roundControlPct:94,primeFights:8,primeFinishes:5,separationScore:6,eliteStakesScore:4.5,profile:'Smothering lightweight control with no UFC loss',status:'locked'},
    'Jon Jones':{primeRecord:'16-0, 1 NC',primeRecordScore:8,roundControlPct:88,primeFights:17,primeFinishes:7,separationScore:5.25,eliteStakesScore:5,profile:'Longest elite control window with unmatched title-stage proof',status:'locked'},
    'Georges St-Pierre':{primeRecord:'14-1',primeRecordScore:7.5,roundControlPct:92,primeFights:15,primeFinishes:4,separationScore:5.25,eliteStakesScore:5,profile:'Cleanest control champion of the modern UFC era',status:'locked'},
    'Demetrious Johnson':{primeRecord:'12-1-1',primeRecordScore:7.25,roundControlPct:90,primeFights:14,primeFinishes:7,separationScore:5.5,eliteStakesScore:5,profile:'Complete flyweight control with elite title consistency',status:'locked'},
    'Anderson Silva':{primeRecord:'16-2',primeRecordScore:7,roundControlPct:78,primeFights:18,primeFinishes:14,separationScore:5.75,eliteStakesScore:5,profile:'Best finish aura, with Weidman losses capping perfection',status:'locked'},
    'Islam Makhachev':{primeRecord:'active unbeaten prime',primeRecordScore:8,roundControlPct:88,primeFights:10,primeFinishes:6,separationScore:5.5,eliteStakesScore:3.75,profile:'Modern lightweight control monster, still adding elite-stakes volume',status:'review'},
    'Alexander Volkanovski':{primeRecord:'active elite prime',primeRecordScore:7,roundControlPct:84,primeFights:13,primeFinishes:4,separationScore:5,eliteStakesScore:4.75,profile:'High-IQ featherweight control with elite close-fight context',status:'locked'},
    'Ronda Rousey':{primeRecord:'6-0',primeRecordScore:8,roundControlPct:86,primeFights:6,primeFinishes:6,separationScore:6,eliteStakesScore:3.75,profile:'Short, explosive title-prime dominance with a hard stop at Holm',status:'locked'},
    'Amanda Nunes':{primeRecord:'review',primeRecordScore:7,roundControlPct:78,primeFights:12,primeFinishes:8,separationScore:5.25,eliteStakesScore:5,profile:'Two-division finishing dominance with one major blemish avenged',status:'locked'},
    'Kamaru Usman':{primeRecord:'10-2',primeRecordScore:7,roundControlPct:82,primeFights:12,primeFinishes:3,separationScore:5,eliteStakesScore:4.75,profile:'Powerful welterweight control run stopped by Edwards',status:'review'},
    'Max Holloway':{primeRecord:'review',primeRecordScore:6.75,roundControlPct:80,primeFights:20,primeFinishes:7,separationScore:5,eliteStakesScore:3.75,profile:'Relentless featherweight volume and pace over a long elite window',status:'review'},
    'Israel Adesanya':{primeRecord:'review',primeRecordScore:6.75,roundControlPct:82,primeFights:15,primeFinishes:4,separationScore:4.75,eliteStakesScore:5,profile:'Elite middleweight control with lower finish pressure',status:'review'}
  };
  function round(v){return Math.round((Number(v||0)+Number.EPSILON)*100)/100;}
  function finishRate(row){return row.primeFights?row.primeFinishes/row.primeFights:0;}
  function finishScore(row){const rate=finishRate(row);return (FINISH_SCALE.find(t=>rate>=t.min)||FINISH_SCALE[FINISH_SCALE.length-1]).score;}
  function roundControlScore(row){return round(Math.min(7,Math.max(0,(Number(row.roundControlPct||0)/100)*7)));}
  function total(row){return round(Number(row.primeRecordScore||0)+roundControlScore(row)+Number(row.separationScore||0)+finishScore(row)+Number(row.eliteStakesScore||0));}
  function rateLabel(row){return `${row.primeFinishes}/${row.primeFights} finishes (${round(finishRate(row)*100)}%)`;}
  function entryFor(fighter){
    const row=RAW[fighter]; if(!row)return null;
    const windowEntry=window.UFC_PRIME_WINDOWS?.entryFor?.(fighter)||null;
    const primeWindow=fighter==='Khabib Nurmagomedov'&&windowEntry?{...windowEntry,primeRecord:'8-0'}:windowEntry;
    return {fighter,primeRecord:row.primeRecord,primeRecordScore:row.primeRecordScore,roundControlPct:row.roundControlPct,roundControlScore:roundControlScore(row),primeFights:row.primeFights,primeFinishes:row.primeFinishes,primeFinishRate:round(finishRate(row)*100),finishPressureScore:finishScore(row),separationScore:row.separationScore,eliteStakesScore:row.eliteStakesScore,total:total(row),labels:[row.primeRecord,`${row.roundControlPct}% round control`,rateLabel(row),row.profile],dominanceProfile:row.profile,status:row.status,primeWindow,version:VERSION};
  }
  function allRowsFor(name){const DATA=window.RANKING_DATA||{};const rows=[];const push=row=>{if(row&&row.fighter===name)rows.push(row);};(DATA.men||[]).forEach(push);(DATA.women||[]).forEach(push);(DATA.fighters||[]).forEach(push);return rows;}
  function report(){return Object.keys(RAW).map(entryFor).filter(Boolean).sort((a,b)=>b.total-a.total||a.fighter.localeCompare(b.fighter));}
  function apply(){const applied=[];report().forEach(entry=>{allRowsFor(entry.fighter).forEach(row=>{row.primeDominanceShadowAudit=entry;if(entry.fighter==='Khabib Nurmagomedov')row.primeRecord='8-0';});if(typeof DISPLAY_OVERRIDES!=='undefined'){DISPLAY_OVERRIDES[entry.fighter]=DISPLAY_OVERRIDES[entry.fighter]||{};DISPLAY_OVERRIDES[entry.fighter].snapshotStats={...(DISPLAY_OVERRIDES[entry.fighter].snapshotStats||{}),primeDominanceShadow:entry.total,primeFinishRate:`${entry.primeFinishRate}%`,roundControl:`${entry.roundControlPct}%`,dominanceProfile:entry.dominanceProfile};if(entry.fighter==='Khabib Nurmagomedov')DISPLAY_OVERRIDES[entry.fighter].snapshotStats.primeRecord='8-0';}applied.push(entry.fighter);});return applied;}
  function evidenceItems(f){const entry=entryFor(f?.fighter)||{};return [['Prime record',entry.primeRecord||'Prime window loaded'],['Round control',entry.roundControlPct?`${entry.roundControlPct}% input → ${entry.roundControlScore}/7`:'Round control review'],['Finish pressure',entry.primeFights?`${entry.primeFinishes}/${entry.primeFights} finishes → ${entry.finishPressureScore}/4`:'Finish rate review'],['Dominance profile',entry.dominanceProfile||'Prime dominance profile pending']];}
  const previousEvidence=typeof categoryEvidenceItems==='function'?categoryEvidenceItems:null;if(previousEvidence){categoryEvidenceItems=function(f,key){if(key==='primeDominance')return evidenceItems(f);return previousEvidence(f,key);};}
  const previousLogic=typeof categoryLogicSentence==='function'?categoryLogicSentence:null;if(previousLogic){categoryLogicSentence=function(f,key){if(key==='primeDominance')return DEFINITION;return previousLogic(f,key);};}
  const applied=apply();
  window.UFC_PRIME_DOMINANCE_LEDGERS={version:VERSION,mode:'shadow-data-restart',components:COMPONENTS,definition:DEFINITION,finishScale:FINISH_SCALE,raw:RAW,report:report(),leaders:report().slice(0,15),entryFor,apply,applied,appliedAt:new Date().toISOString()};
  document.documentElement.setAttribute('data-prime-dominance-ledgers',VERSION);
  if(typeof refresh==='function'){try{refresh();}catch(e){}}
})();
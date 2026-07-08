// Central cache-bust versions for scoring/category modules.
window.UFC_MODULE_VERSIONS = {
  primeWindows: "20260708a",
  primeRoundControlAudit: "20260708c-batch-three",
  primeDominanceLedgers: "20260708j-round-audit-batch-two",
  scoreWeighting: "20260708d-prime-dominance-data-restart-loader",
  championshipResumeLive: "20260708e",
  opponentQualityLive: "20260708b"
};

(function(){
  const versions = window.UFC_MODULE_VERSIONS || {};
  function loadScript(src, attr, done){
    if(!src || document.querySelector('script[' + attr + ']')){
      if(done) done();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.setAttribute(attr, 'true');
    s.onload = function(){ if(done) done(); };
    s.onerror = function(){ if(done) done(); };
    document.body.appendChild(s);
  }
  function tunePrimeDominance(){
    const base = window.UFC_PRIME_DOMINANCE_LEDGERS;
    if(!base || !base.entryFor || base.tuningVersion === '20260708a') return;
    const oldEntry = base.entryFor;
    const scale = [{min:.90,score:5},{min:.75,score:4.5},{min:.60,score:4},{min:.45,score:3},{min:.30,score:2},{min:.15,score:1},{min:0,score:.5}];
    const override = {
      'Demetrious Johnson': {titleFightWins:1.6,topFiveWins:1.05,champFormerChampWins:.75,fiveRoundTitleStageSample:.5,divisionStrengthContext:.1},
      'Ronda Rousey': {titleFightWins:2,topFiveWins:.75,champFormerChampWins:.5,fiveRoundTitleStageSample:.5,divisionStrengthContext:.15}
    };
    function round(v){return Math.round((Number(v||0)+Number.EPSILON)*100)/100;}
    function finishScore(entry){const rate = Number(entry.primeFinishRate || 0) / 100;return round((scale.find(t => rate >= t.min) || scale[scale.length - 1]).score);}
    function eliteBreakdown(entry){return override[entry.fighter] || entry.eliteStakesBreakdown || {};}
    function eliteRaw(entry){const e = eliteBreakdown(entry);return round(Number(e.titleFightWins||0)+Number(e.topFiveWins||0)+Number(e.champFormerChampWins||0)+Number(e.fiveRoundTitleStageSample||0)+Number(e.divisionStrengthContext||0));}
    function eliteScore(entry){return round(Math.min(8, Math.max(0, eliteRaw(entry) / 5 * 8)));}
    function tunedEntryFor(fighter){
      const entry = oldEntry(fighter); if(!entry) return null;
      const fs = finishScore(entry); const eb = eliteBreakdown(entry);
      const er = eliteRaw({...entry, eliteStakesBreakdown: eb}); const es = eliteScore({...entry, eliteStakesBreakdown: eb});
      return {...entry, finishPressureScore: fs, eliteStakesBreakdown: eb, eliteStakesRawScore: er, eliteStakesScore: es, total: round(Number(entry.primeRecordScore||0)+Number(entry.roundControlScore||0)+fs+es), version: 'prime-dominance-tuned-20260708a'};
    }
    function report(){return Object.keys(base.raw || {}).map(tunedEntryFor).filter(Boolean).sort((a,b)=>b.total-a.total || a.fighter.localeCompare(b.fighter));}
    function allRowsFor(name){const DATA=window.RANKING_DATA||{};const rows=[];const push=row=>{if(row&&row.fighter===name)rows.push(row);};(DATA.men||[]).forEach(push);(DATA.women||[]).forEach(push);(DATA.fighters||[]).forEach(push);return rows;}
    function applyTuned(){const applied=[];base.report.forEach(entry=>{allRowsFor(entry.fighter).forEach(row=>{row.primeDominanceShadowAudit=entry;});if(typeof DISPLAY_OVERRIDES!=='undefined'){DISPLAY_OVERRIDES[entry.fighter]=DISPLAY_OVERRIDES[entry.fighter]||{};DISPLAY_OVERRIDES[entry.fighter].snapshotStats={...(DISPLAY_OVERRIDES[entry.fighter].snapshotStats||{}),primeDominanceShadow:entry.total,primeFinishRate:`${entry.primeFinishRate}%`,roundControl:`${entry.roundControlPct}%`,dominanceProfile:entry.dominanceProfile};}applied.push(entry.fighter);});return applied;}
    function evidenceItems(f){const entry=tunedEntryFor(f?.fighter)||{};const audit=entry.roundControlAudit;const elite=entry.eliteStakesBreakdown||{};return [['Prime record',entry.primeRecord?`${entry.primeRecordPct}% win rate → ${entry.primeRecordScore}/9`:'Prime window loaded'],['Round control',audit?`${audit.roundsWon}/${audit.roundsCounted} rounds → ${entry.roundControlScore}/8`:(entry.roundControlPct?`${entry.roundControlPct}% input → ${entry.roundControlScore}/8`:'Round control review')],['Finish pressure',entry.primeFights?`${entry.primeFinishes}/${entry.primeFights} finishes → ${entry.finishPressureScore}/5`:'Finish rate review'],['Elite-stakes validation',entry.eliteStakesRawScore?`${entry.eliteStakesRawScore}/5 raw → ${entry.eliteStakesScore}/8 weighted`:'Elite-stakes review'],['Elite-stakes split',`Title ${elite.titleFightWins}/2 · Top-5 ${elite.topFiveWins}/1.25 · Champs ${elite.champFormerChampWins}/1 · Stage ${elite.fiveRoundTitleStageSample}/0.5 · Division ${elite.divisionStrengthContext}/0.25`],['Dominance profile',entry.dominanceProfile||'Prime dominance profile pending']];}
    const priorEvidence=typeof categoryEvidenceItems==='function'?categoryEvidenceItems:null;if(priorEvidence){categoryEvidenceItems=function(f,key){if(key==='primeDominance')return evidenceItems(f);return priorEvidence(f,key);};}
    base.entryFor = tunedEntryFor; base.report = report(); base.leaders = base.report.slice(0,15); base.finishScale = scale;
    base.eliteStakesBreakdowns = {...(base.eliteStakesBreakdowns || {}), ...override}; base.tuningVersion = '20260708a'; base.mode = 'shadow-finish-scale-ronda-dj-tuned'; base.applied = applyTuned();
    window.UFC_PRIME_DOMINANCE_TUNING_PATCH = {version:'20260708a'};
    if(typeof refresh === 'function'){try{refresh();}catch(e){}}
  }

  loadScript(
    versions.primeRoundControlAudit ? 'assets/data/prime-round-control-audit.js?v=prime-round-control-audit-' + versions.primeRoundControlAudit : null,
    'data-prime-round-control-audit',
    function(){
      loadScript(
        versions.primeDominanceLedgers ? 'assets/data/prime-dominance-ledgers.js?v=prime-dominance-ledgers-' + versions.primeDominanceLedgers : null,
        'data-prime-dominance-ledgers',
        tunePrimeDominance
      );
    }
  );
})();

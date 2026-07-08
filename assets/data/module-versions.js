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
    if(!base || !base.entryFor || base.tuningVersion === '20260708e') return;
    const oldEntry = base.entryFor;
    const scale = [{min:.90,score:5},{min:.75,score:4.5},{min:.60,score:4},{min:.45,score:3},{min:.30,score:2},{min:.15,score:1},{min:0,score:.5}];
    const override = {
      'Demetrious Johnson': {titleFightWins:1.6,topFiveWins:1.05,champFormerChampWins:.75,fiveRoundTitleStageSample:.5,divisionStrengthContext:.1},
      'Ronda Rousey': {titleFightWins:2,topFiveWins:.75,champFormerChampWins:.5,fiveRoundTitleStageSample:.5,divisionStrengthContext:.15}
    };
    const extraRaw = {
      'Randy Couture': {primeRecord:'5-2',primeWins:5,primeLosses:2,primeDraws:0,primeNCs:0,roundControlPct:81.82,roundsWon:18,roundsCounted:22,primeFights:7,primeFinishes:3,profile:'Late-career two-division title-prime with high stakes but uneven dominance',status:'review'},
      'Matt Hughes': {primeRecord:'10-1',primeWins:10,primeLosses:1,primeDraws:0,primeNCs:0,roundControlPct:84,roundsWon:21,roundsCounted:25,primeFights:11,primeFinishes:8,profile:'Classic welterweight control prime with one Penn interruption',status:'review'},
      'B.J. Penn': {primeRecord:'6-2',primeWins:6,primeLosses:2,primeDraws:0,primeNCs:0,roundControlPct:75,roundsWon:18,roundsCounted:24,primeFights:8,primeFinishes:6,profile:'Explosive lightweight peak with GSP resistance included',status:'review'},
      'Ilia Topuria': {primeRecord:'4-1',primeWins:4,primeLosses:1,primeDraws:0,primeNCs:0,roundControlPct:81.25,roundsWon:13,roundsCounted:16,primeFights:5,primeFinishes:3,profile:'Short active championship burst with Gaethje title loss counted in prime',status:'review'},
      'Petr Yan': {primeRecord:'7-4',primeWins:7,primeLosses:4,primeDraws:0,primeNCs:0,roundControlPct:70.45,roundsWon:31,roundsCounted:44,primeFights:11,primeFinishes:2,profile:'Elite bantamweight boxing prime; includes the recent Merab title win',status:'review'},
      'Merab Dvalishvili': {primeRecord:'6-1',primeWins:6,primeLosses:1,primeDraws:0,primeNCs:0,roundControlPct:75,roundsWon:21,roundsCounted:28,primeFights:7,primeFinishes:1,profile:'Relentless bantamweight control run with Yan title loss counted in prime',status:'review'},
      'Chuck Liddell': {primeRecord:'10-1',primeWins:10,primeLosses:1,primeDraws:0,primeNCs:0,roundControlPct:80.95,roundsWon:17,roundsCounted:21,primeFights:11,primeFinishes:7,profile:'UFC-only title-prime now runs through the Quinton Jackson UFC loss',status:'review'},
      'Dominick Cruz': {primeRecord:'4-1',primeWins:4,primeLosses:1,primeDraws:0,primeNCs:0,roundControlPct:77.78,roundsWon:14,roundsCounted:18,primeFights:5,primeFinishes:1,profile:'UFC-only title prime with WEC reign excluded',status:'review'},
      'Francis Ngannou': {primeRecord:'6-0',primeWins:6,primeLosses:0,primeDraws:0,primeNCs:0,roundControlPct:81.82,roundsWon:9,roundsCounted:11,primeFights:6,primeFinishes:5,profile:'Short heavyweight terror prime with Stipe rebound and Gane control',status:'review'},
      'Joanna Jedrzejczyk': {primeRecord:'6-2',primeWins:6,primeLosses:2,primeDraws:0,primeNCs:0,roundControlPct:80.65,roundsWon:25,roundsCounted:31,primeFights:8,primeFinishes:2,profile:'Strawweight title-control prime with Rose losses included',status:'review'},
      'Lyoto Machida': {primeRecord:'8-4',primeWins:8,primeLosses:4,primeDraws:0,primeNCs:0,roundControlPct:70.21,roundsWon:33,roundsCounted:47,primeFights:12,primeFinishes:4,profile:'Technical light-heavyweight prime with Jones and Weidman resistance counted',status:'review'},
      'Khamzat Chimaev': {primeRecord:'6-1',primeWins:6,primeLosses:1,primeDraws:0,primeNCs:0,roundControlPct:76.19,roundsWon:16,roundsCounted:21,primeFights:7,primeFinishes:4,profile:'Active control-heavy prime with Strickland title loss counted',status:'review'},
      'Deiveson Figueiredo': {primeRecord:'4-2-1',primeWins:4,primeLosses:2,primeDraws:1,primeNCs:0,roundControlPct:59.46,roundsWon:22,roundsCounted:37,primeFights:7,primeFinishes:3,profile:'Flyweight title-war prime defined by Moreno rivalry volatility',status:'review'},
      'Tito Ortiz': {primeRecord:'7-2',primeWins:7,primeLosses:2,primeDraws:0,primeNCs:0,roundControlPct:78.38,roundsWon:29,roundsCounted:37,primeFights:9,primeFinishes:5,profile:'Early UFC title-control prime with Couture and Chuck losses counted',status:'review'},
      'Junior dos Santos': {primeRecord:'9-2',primeWins:9,primeLosses:2,primeDraws:0,primeNCs:0,roundControlPct:70.45,roundsWon:31,roundsCounted:44,primeFights:11,primeFinishes:7,profile:'Heavyweight boxing prime with Cain trilogy damage fully counted',status:'review'},
      'Michael Bisping': {primeRecord:'5-1',primeWins:5,primeLosses:1,primeDraws:0,primeNCs:0,roundControlPct:64.29,roundsWon:18,roundsCounted:28,primeFights:6,primeFinishes:2,profile:'Late-career middleweight title peak built on grit more than clean dominance',status:'review'},
      'Tony Ferguson': {primeRecord:'8-1',primeWins:8,primeLosses:1,primeDraws:0,primeNCs:0,roundControlPct:68.57,roundsWon:24,roundsCounted:35,primeFights:9,primeFinishes:5,profile:'Chaotic lightweight win streak with Gaethje collapse counted',status:'review'},
      'Brock Lesnar': {primeRecord:'4-1',primeWins:4,primeLosses:1,primeDraws:0,primeNCs:0,roundControlPct:75,roundsWon:12,roundsCounted:16,primeFights:5,primeFinishes:3,profile:'Short heavyweight title burst with Cain loss counted',status:'review'},
      'Chael Sonnen': {primeRecord:'4-4',primeWins:4,primeLosses:4,primeDraws:0,primeNCs:0,roundControlPct:60.71,roundsWon:17,roundsCounted:28,primeFights:8,primeFinishes:2,profile:'High-stakes contender prime with title losses and elite resistance counted',status:'review'},
      'Robbie Lawler': {primeRecord:'7-2',primeWins:7,primeLosses:2,primeDraws:0,primeNCs:0,roundControlPct:60,roundsWon:27,roundsCounted:45,primeFights:9,primeFinishes:4,profile:'Violent welterweight title prime; greatness came through wars, not clean control',status:'review'}
    };
    const extraElite = {
      'Randy Couture': {titleFightWins:2,topFiveWins:1,champFormerChampWins:.8,fiveRoundTitleStageSample:.35,divisionStrengthContext:.15},
      'Matt Hughes': {titleFightWins:2,topFiveWins:1.1,champFormerChampWins:.8,fiveRoundTitleStageSample:.5,divisionStrengthContext:.1},
      'B.J. Penn': {titleFightWins:1.25,topFiveWins:1.25,champFormerChampWins:1,fiveRoundTitleStageSample:.35,divisionStrengthContext:.25},
      'Ilia Topuria': {titleFightWins:1.25,topFiveWins:1.25,champFormerChampWins:.75,fiveRoundTitleStageSample:.25,divisionStrengthContext:.25},
      'Petr Yan': {titleFightWins:1.25,topFiveWins:1.25,champFormerChampWins:.5,fiveRoundTitleStageSample:.5,divisionStrengthContext:.25},
      'Merab Dvalishvili': {titleFightWins:1.25,topFiveWins:1.25,champFormerChampWins:.75,fiveRoundTitleStageSample:.4,divisionStrengthContext:.25},
      'Chuck Liddell': {titleFightWins:2,topFiveWins:.8,champFormerChampWins:.5,fiveRoundTitleStageSample:.45,divisionStrengthContext:.15},
      'Dominick Cruz': {titleFightWins:1.25,topFiveWins:1,champFormerChampWins:.75,fiveRoundTitleStageSample:.35,divisionStrengthContext:.15},
      'Francis Ngannou': {titleFightWins:1.25,topFiveWins:1,champFormerChampWins:.75,fiveRoundTitleStageSample:.35,divisionStrengthContext:.25},
      'Joanna Jedrzejczyk': {titleFightWins:2,topFiveWins:.75,champFormerChampWins:.3,fiveRoundTitleStageSample:.5,divisionStrengthContext:.25},
      'Lyoto Machida': {titleFightWins:1.25,topFiveWins:1,champFormerChampWins:.75,fiveRoundTitleStageSample:.5,divisionStrengthContext:.15},
      'Khamzat Chimaev': {titleFightWins:.75,topFiveWins:1,champFormerChampWins:.75,fiveRoundTitleStageSample:.35,divisionStrengthContext:.25},
      'Deiveson Figueiredo': {titleFightWins:1.5,topFiveWins:1,champFormerChampWins:.75,fiveRoundTitleStageSample:.5,divisionStrengthContext:.1},
      'Tito Ortiz': {titleFightWins:2,topFiveWins:.8,champFormerChampWins:.5,fiveRoundTitleStageSample:.5,divisionStrengthContext:.1},
      'Junior dos Santos': {titleFightWins:1.5,topFiveWins:1,champFormerChampWins:.75,fiveRoundTitleStageSample:.5,divisionStrengthContext:.15},
      'Michael Bisping': {titleFightWins:1.25,topFiveWins:.75,champFormerChampWins:.75,fiveRoundTitleStageSample:.4,divisionStrengthContext:.15},
      'Tony Ferguson': {titleFightWins:.75,topFiveWins:1.25,champFormerChampWins:.75,fiveRoundTitleStageSample:.35,divisionStrengthContext:.25},
      'Brock Lesnar': {titleFightWins:1.5,topFiveWins:.75,champFormerChampWins:.75,fiveRoundTitleStageSample:.3,divisionStrengthContext:.15},
      'Chael Sonnen': {titleFightWins:0,topFiveWins:1,champFormerChampWins:.75,fiveRoundTitleStageSample:.4,divisionStrengthContext:.15},
      'Robbie Lawler': {titleFightWins:1.5,topFiveWins:1.25,champFormerChampWins:.75,fiveRoundTitleStageSample:.5,divisionStrengthContext:.2}
    };
    function round(v){return Math.round((Number(v||0)+Number.EPSILON)*100)/100;}
    function finishScore(entry){const rate = Number(entry.primeFinishRate || 0) / 100;return round((scale.find(t => rate >= t.min) || scale[scale.length - 1]).score);}
    function primeRecordCounted(row){return Number(row.primeWins||0)+Number(row.primeLosses||0)+Number(row.primeDraws||0);}
    function primeRecordPct(row){const counted=primeRecordCounted(row);return counted?((Number(row.primeWins||0)+(Number(row.primeDraws||0)*0.5))/counted):0;}
    function primeRecordScore(row){return round(Math.min(9,Math.max(0,primeRecordPct(row)*9)));}
    function eliteBreakdown(entry){return override[entry.fighter] || extraElite[entry.fighter] || entry.eliteStakesBreakdown || {};}
    function eliteRaw(entry){const e = eliteBreakdown(entry);return round(Number(e.titleFightWins||0)+Number(e.topFiveWins||0)+Number(e.champFormerChampWins||0)+Number(e.fiveRoundTitleStageSample||0)+Number(e.divisionStrengthContext||0));}
    function eliteScore(entry){return round(Math.min(8, Math.max(0, eliteRaw(entry) / 5 * 8)));}
    function rawEntryFor(fighter){const row=extraRaw[fighter];if(!row)return null;const prPct=round(primeRecordPct(row)*100);const rcScore=round(Math.min(8,Math.max(0,(Number(row.roundControlPct||0)/100)*8)));const finishRate=row.primeFights?round(row.primeFinishes/row.primeFights*100):0;return {fighter,primeRecord:row.primeRecord,primeWins:row.primeWins,primeLosses:row.primeLosses,primeDraws:row.primeDraws,primeNCs:row.primeNCs,primeRecordPct:prPct,primeRecordScore:primeRecordScore(row),roundControlPct:row.roundControlPct,roundControlScore:rcScore,roundControlAudit:{fighter,roundsWon:row.roundsWon,roundsCounted:row.roundsCounted,roundControlPct:row.roundControlPct,status:row.status},primeFights:row.primeFights,primeFinishes:row.primeFinishes,primeFinishRate:finishRate,dominanceProfile:row.profile,status:row.status,version:'prime-dominance-batch-five-20260708b'};}
    function tunedEntryFor(fighter){
      const entry = oldEntry(fighter) || rawEntryFor(fighter); if(!entry) return null;
      const fs = finishScore(entry); const eb = eliteBreakdown(entry);
      const er = eliteRaw({...entry, eliteStakesBreakdown: eb}); const es = eliteScore({...entry, eliteStakesBreakdown: eb});
      return {...entry, finishPressureScore: fs, eliteStakesBreakdown: eb, eliteStakesRawScore: er, eliteStakesScore: es, total: round(Number(entry.primeRecordScore||0)+Number(entry.roundControlScore||0)+fs+es), version: 'prime-dominance-tuned-20260708e'};
    }
    function names(){return Array.from(new Set([...Object.keys(base.raw || {}),...Object.keys(extraRaw)]));}
    function report(){return names().map(tunedEntryFor).filter(Boolean).sort((a,b)=>b.total-a.total || a.fighter.localeCompare(b.fighter));}
    function allRowsFor(name){const DATA=window.RANKING_DATA||{};const rows=[];const push=row=>{if(row&&row.fighter===name)rows.push(row);};(DATA.men||[]).forEach(push);(DATA.women||[]).forEach(push);(DATA.fighters||[]).forEach(push);return rows;}
    function applyTuned(){const applied=[];base.report.forEach(entry=>{allRowsFor(entry.fighter).forEach(row=>{row.primeDominanceShadowAudit=entry;});if(typeof DISPLAY_OVERRIDES!=='undefined'){DISPLAY_OVERRIDES[entry.fighter]=DISPLAY_OVERRIDES[entry.fighter]||{};DISPLAY_OVERRIDES[entry.fighter].snapshotStats={...(DISPLAY_OVERRIDES[entry.fighter].snapshotStats||{}),primeDominanceShadow:entry.total,primeFinishRate:`${entry.primeFinishRate}%`,roundControl:`${entry.roundControlPct}%`,dominanceProfile:entry.dominanceProfile};}applied.push(entry.fighter);});return applied;}
    function evidenceItems(f){const entry=tunedEntryFor(f?.fighter)||{};const audit=entry.roundControlAudit;const elite=entry.eliteStakesBreakdown||{};return [['Prime record',entry.primeRecord?`${entry.primeRecordPct}% win rate → ${entry.primeRecordScore}/9`:'Prime window loaded'],['Round control',audit?`${audit.roundsWon}/${audit.roundsCounted} rounds → ${entry.roundControlScore}/8`:(entry.roundControlPct?`${entry.roundControlPct}% input → ${entry.roundControlScore}/8`:'Round control review')],['Finish pressure',entry.primeFights?`${entry.primeFinishes}/${entry.primeFights} finishes → ${entry.finishPressureScore}/5`:'Finish rate review'],['Elite-stakes validation',entry.eliteStakesRawScore?`${entry.eliteStakesRawScore}/5 raw → ${entry.eliteStakesScore}/8 weighted`:'Elite-stakes review'],['Elite-stakes split',`Title ${elite.titleFightWins}/2 · Top-5 ${elite.topFiveWins}/1.25 · Champs ${elite.champFormerChampWins}/1 · Stage ${elite.fiveRoundTitleStageSample}/0.5 · Division ${elite.divisionStrengthContext}/0.25`],['Dominance profile',entry.dominanceProfile||'Prime dominance profile pending']];}
    const priorEvidence=typeof categoryEvidenceItems==='function'?categoryEvidenceItems:null;if(priorEvidence){categoryEvidenceItems=function(f,key){if(key==='primeDominance')return evidenceItems(f);return priorEvidence(f,key);};}
    base.entryFor = tunedEntryFor; base.report = report(); base.leaders = base.report.slice(0,15); base.finishScale = scale;
    base.eliteStakesBreakdowns = {...(base.eliteStakesBreakdowns || {}), ...override, ...extraElite}; base.extraRawBatchFive = extraRaw; base.tuningVersion = '20260708e'; base.mode = 'shadow-finish-scale-batch-five-khamzat-loss-corrected'; base.applied = applyTuned();
    window.UFC_PRIME_DOMINANCE_TUNING_PATCH = {version:'20260708e',batchFive:Object.keys(extraRaw)};
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

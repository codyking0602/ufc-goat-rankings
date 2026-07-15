// Canonical OVR reconstruction over the Cody-approved final-score engine.
// Shadow-only: converts calculated UFC GOAT totals into a fluid 2K-style OVR without mutating live rankings or display data.
(function(){
  'use strict';

  const VERSION='canonical-ovr-reconstruction-20260714a-approved-fixed-anchor-scale';
  const OVR_FLOOR=82;
  const OVR_CEILING=99;
  const OVR_CURVE=.85;
  const LEADER_ONLY_99=true;
  const ANCHORS=Object.freeze({
    men:Object.freeze({floorScore:18.68,ceilingScore:101.92}),
    women:Object.freeze({floorScore:25.78,ceilingScore:80.79})
  });
  const TIERS=Object.freeze([
    Object.freeze({min:99,max:99,label:'generational benchmark'}),
    Object.freeze({min:96,max:98,label:'GOAT inner circle'}),
    Object.freeze({min:92,max:95,label:'all-time elite'}),
    Object.freeze({min:89,max:91,label:'all-time champion'}),
    Object.freeze({min:86,max:88,label:'major UFC legacy'}),
    Object.freeze({min:82,max:85,label:'credible UFC legacy'})
  ]);

  const round2=value=>Math.round((Number(value||0)+Number.EPSILON)*100)/100;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,Number(value||0)));
  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));

  function tierFor(ovr){
    return TIERS.find(tier=>Number(ovr)>=tier.min&&Number(ovr)<=tier.max)?.label||TIERS[TIERS.length-1].label;
  }

  function calculateOvr(totalScore,board,rank){
    const anchors=ANCHORS[board]||ANCHORS.men;
    const range=Number(anchors.ceilingScore)-Number(anchors.floorScore);
    if(range<=0)return OVR_FLOOR;
    const normalized=clamp((Number(totalScore)-Number(anchors.floorScore))/range,0,1);
    const curved=Math.pow(normalized,OVR_CURVE);
    let ovr=clamp(Math.round(OVR_FLOOR+(curved*(OVR_CEILING-OVR_FLOOR))),OVR_FLOOR,OVR_CEILING);
    if(LEADER_ONLY_99&&Number(rank)>1&&ovr===OVR_CEILING)ovr=OVR_CEILING-1;
    return ovr;
  }

  function build(){
    const finalScore=window.UFC_CANONICAL_FINAL_SCORE_RECONSTRUCTION;
    const before=window.RANKING_DATA?JSON.stringify(window.RANKING_DATA):null;
    if(!finalScore?.applied||!finalScore?.approvedReport?.rows){
      return {version:VERSION,applied:false,error:'Approved final-score reconstruction is unavailable.',mutatesRankingData:false,mutatesScores:false,mutatesRanks:false,mutatesOvr:false};
    }

    const sourceRows=finalScore.approvedReport.rows.filter(row=>row.status==='complete'&&Number.isFinite(Number(row.totalScore))&&Number.isFinite(Number(row.calculatedRank)));
    const rows=sourceRows.map(source=>{
      const calculatedOvr=calculateOvr(source.totalScore,source.board,source.calculatedRank);
      const frozenOvr=Number.isFinite(Number(source.frozenControl?.expectedOverallOvr))?Number(source.frozenControl.expectedOverallOvr):null;
      return {
        fighter:source.fighter,
        board:source.board,
        rank:Number(source.calculatedRank),
        totalScore:round2(source.totalScore),
        calculatedOvr,
        tier:tierFor(calculatedOvr),
        frozenOvr,
        ovrDelta:frozenOvr===null?null:calculatedOvr-frozenOvr,
        sourceVersion:finalScore.version,
        mutatesOvr:false
      };
    });

    const boards={};
    ['men','women'].forEach(board=>{
      const boardRows=rows.filter(row=>row.board===board).sort((a,b)=>a.rank-b.rank||b.totalScore-a.totalScore||a.fighter.localeCompare(b.fighter));
      const monotonicViolations=[];
      for(let index=1;index<boardRows.length;index+=1){
        const previous=boardRows[index-1];
        const current=boardRows[index];
        if(current.totalScore>previous.totalScore+.001||current.calculatedOvr>previous.calculatedOvr){
          monotonicViolations.push({previous:clone(previous),current:clone(current)});
        }
      }
      const nonLeaderNinetyNines=boardRows.filter(row=>row.rank>1&&row.calculatedOvr===99).map(row=>row.fighter);
      const distribution=Object.fromEntries(Array.from({length:OVR_CEILING-OVR_FLOOR+1},(_,index)=>OVR_CEILING-index).map(ovr=>[ovr,boardRows.filter(row=>row.calculatedOvr===ovr).length]));
      boards[board]={
        fighterCount:boardRows.length,
        anchors:clone(ANCHORS[board]),
        leader:boardRows[0]||null,
        topFifteen:boardRows.slice(0,15),
        rows:boardRows,
        distribution,
        monotonicViolations,
        nonLeaderNinetyNines,
        passed:boardRows.length>0&&boardRows[0]?.calculatedOvr===99&&monotonicViolations.length===0&&nonLeaderNinetyNines.length===0
      };
    });

    const controlled=rows.filter(row=>row.frozenOvr!==null);
    const changed=controlled.filter(row=>row.ovrDelta!==0);
    const exact=controlled.filter(row=>row.ovrDelta===0);
    const biggestChanges=changed.slice().sort((a,b)=>Math.abs(b.ovrDelta)-Math.abs(a.ovrDelta)||a.rank-b.rank||a.fighter.localeCompare(b.fighter));
    const after=window.RANKING_DATA?JSON.stringify(window.RANKING_DATA):null;
    const byKey=new Map(rows.map(row=>[key(row.fighter),row]));

    return {
      version:VERSION,
      applied:true,
      status:'ovr-reconstruction-complete-shadow-only',
      mode:'approved-fixed-anchor-score-derived-ovr-shadow-only',
      doctrine:'OVR is a presentation layer derived only from the approved calculated total. It never changes category scores, total score, or rank.',
      formula:'round(82 + clamp((totalScore - boardFloorScore) / (boardCeilingScore - boardFloorScore), 0, 1)^0.85 × 17), with only the board leader eligible for 99',
      floor:OVR_FLOOR,
      ceiling:OVR_CEILING,
      curve:OVR_CURVE,
      leaderOnly99:LEADER_ONLY_99,
      anchors:clone(ANCHORS),
      tiers:clone(TIERS),
      fighterCount:rows.length,
      controlledComparisonCount:controlled.length,
      exactFrozenOvrMatchCount:exact.length,
      changedOvrCount:changed.length,
      biggestChanges,
      boards,
      rows,
      entryFor:fighter=>byKey.get(key(fighter))||null,
      allBoardsPassed:Object.values(boards).every(board=>board.passed),
      liveDataUnchanged:before===after,
      mutatesRankingData:false,
      mutatesScores:false,
      mutatesRanks:false,
      mutatesOvr:false,
      manualFighterOverrides:false,
      ovrReconstructionComplete:true,
      livePromotionBlocked:true,
      livePromotionBlockReason:'The calculated OVR layer is approved in shadow, but the production scoring pipeline has not yet been promoted into RANKING_DATA and app-facing outputs.'
    };
  }

  const report=build();
  window.UFC_CANONICAL_OVR_RECONSTRUCTION=report;
  if(typeof document!=='undefined'&&document.documentElement?.setAttribute){
    document.documentElement.setAttribute('data-canonical-ovr-reconstruction',`${VERSION}-${report.applied?'ready':'error'}`);
  }
})();

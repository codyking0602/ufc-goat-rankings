// Final normalization for the canonical division allocation pipeline.
// It absorbs decimal rounding residue and blocks meaningful unexplained allocation gaps.
(function(){
  'use strict';

  const VERSION='division-ranking-reconciliation-20260715d-strict-openweight';
  const MAX_ROUNDING_RESIDUAL=.20;
  const pipeline=window.UFC_DIVISION_RANKING_PIPELINE;
  const divisionUi=window.UFC_DIVISION_RANKINGS;
  if(!pipeline?.rebuild)return;

  const originalRebuild=pipeline.rebuild.bind(pipeline);
  const originalRender=divisionUi?.render?.bind(divisionUi)||null;
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const round2=value=>{const rounded=Math.round((num(value)+Number.EPSILON)*100)/100;return Object.is(rounded,-0)?0:rounded;};

  function resortBoards(report){
    const boards={};
    (pipeline.divisionOrder||[]).forEach(division=>{
      const ranked=(report.rows||[]).filter(row=>row.division===division&&row.rankEligible).sort((a,b)=>num(b.divisionScore)-num(a.divisionScore)||num(b.overallScore)-num(a.overallScore)||String(a.fighter).localeCompare(String(b.fighter)));
      ranked.forEach((row,index)=>{row.rank=index+1;});
      if(ranked.length)boards[division]=ranked;
    });
    report.boards=boards;
    report.divisionCount=Object.keys(boards).length;
    report.rankedRowCount=Object.values(boards).reduce((sum,board)=>sum+board.length,0);
  }

  function reconcile(report){
    if(!report||!Array.isArray(report.rows))return report;
    const groups=new Map();
    report.rows.forEach(row=>{
      const list=groups.get(row.fighter)||[];
      list.push(row);
      groups.set(row.fighter,list);
    });

    const allocationWarnings=[];
    groups.forEach((rows,fighter)=>{
      const expected=round2(rows[0]?.overallScore);
      const allocated=round2(rows.reduce((sum,row)=>sum+num(row.divisionScore),0));
      const residual=round2(expected-allocated);
      if(!residual)return;
      const target=rows.find(row=>row.role==='primary')||rows.slice().sort((a,b)=>num(b.resumeSharePct)-num(a.resumeSharePct))[0];
      if(!target){allocationWarnings.push({fighter,expected,allocated,residual,reason:'no eligible allocation row'});return;}
      target.roundingAdjustment=round2(num(target.roundingAdjustment)+residual);
      target.divisionScore=round2(num(target.divisionScore)+residual);
      if(Math.abs(residual)>MAX_ROUNDING_RESIDUAL){
        allocationWarnings.push({fighter,division:target.division,expected,allocated,residual,reason:'allocation exceeds decimal-rounding tolerance'});
      }
    });

    const conservation=[];
    groups.forEach((rows,fighter)=>{
      const expected=round2(rows[0]?.overallScore);
      const allocated=round2(rows.reduce((sum,row)=>sum+num(row.divisionScore),0));
      if(Math.abs(allocated-expected)>.001)conservation.push({fighter,allocated,expected,difference:round2(allocated-expected)});
    });
    const invalid=report.rows.filter(row=>!Number.isFinite(Number(row.divisionScore)));
    const passed=invalid.length===0&&conservation.length===0&&allocationWarnings.length===0;
    report.version=`${String(report.version||'').split('+')[0]}+${VERSION}`;
    report.status=passed?'ready':'blocked';
    report.passed=passed;
    report.invalid=invalid;
    report.conservation=conservation;
    report.allocationWarnings=allocationWarnings;
    report.roundingReconciliation={version:VERSION,maxResidual:MAX_ROUNDING_RESIDUAL,applied:true};
    resortBoards(report);
    window.UFC_DIVISION_RANKING_REPORT=report;
    document.documentElement.setAttribute('data-division-ranking-pipeline',`${report.version}-${report.status}-${report.rowCount||report.rows.length}`);
    return report;
  }

  function rebuild(){return reconcile(originalRebuild());}
  function render(){
    const report=rebuild();
    if(report?.passed&&originalRender)originalRender();
    return report;
  }

  pipeline.rebuild=rebuild;
  if(divisionUi){divisionUi.rebuild=rebuild;divisionUi.render=render;}
  window.renderDivision=render;
  window.addEventListener?.('ufc-scoring-pipeline-ready',()=>render());
  window.UFC_DIVISION_RANKING_RECONCILIATION={version:VERSION,maxResidual:MAX_ROUNDING_RESIDUAL,reconcile,rebuild,render};
})();

// Final normalization for the canonical division allocation pipeline.
// It absorbs only decimal rounding residue and blocks meaningful unexplained allocation gaps.
(function(){
  'use strict';

  const VERSION='division-ranking-reconciliation-20260715a';
  const MAX_ROUNDING_RESIDUAL=.20;
  const pipeline=window.UFC_DIVISION_RANKING_PIPELINE;
  if(!pipeline?.rebuild)return;

  const originalRebuild=pipeline.rebuild.bind(pipeline);
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const round2=value=>{const rounded=Math.round((num(value)+Number.EPSILON)*100)/100;return Object.is(rounded,-0)?0:rounded;};

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
      if(!target){allocationWarnings.push({fighter,expected,allocated,residual,reason:'no eligible division row'});return;}
      target.roundingAdjustment=round2(num(target.roundingAdjustment)+residual);
      target.divisionScore=round2(num(target.divisionScore)+residual);
      if(Math.abs(residual)>MAX_ROUNDING_RESIDUAL){
        allocationWarnings.push({fighter,division:target.division,expected,allocated,residual,reason:'exceeds rounding tolerance'});
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
    report.version=`${report.version}+${VERSION}`;
    report.status=passed?'ready':'blocked';
    report.passed=passed;
    report.invalid=invalid;
    report.conservation=conservation;
    report.allocationWarnings=allocationWarnings;
    report.roundingReconciliation={version:VERSION,maxResidual:MAX_ROUNDING_RESIDUAL,applied:true};
    window.UFC_DIVISION_RANKING_REPORT=report;
    document.documentElement.setAttribute('data-division-ranking-pipeline',`${report.version}-${report.status}-${report.rowCount||report.rows.length}`);
    return report;
  }

  function rebuild(){return reconcile(originalRebuild());}
  pipeline.rebuild=rebuild;
  if(window.UFC_DIVISION_RANKINGS)window.UFC_DIVISION_RANKINGS.rebuild=rebuild;
  window.UFC_DIVISION_RANKING_RECONCILIATION={version:VERSION,maxResidual:MAX_ROUNDING_RESIDUAL,reconcile};
})();

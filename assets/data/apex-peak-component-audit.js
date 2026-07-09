// Apex Peak Component Audit Layer.
// Keeps Apex Peak honest as component math, not hand-entered totals.
// Total = Peak Status + Elite Proof + Separation + Division Strength + Clean Apex Aura.
(function(){
  const VERSION='apex-peak-component-audit-20260709a-matt-hughes-template';
  const DATA=window.RANKING_DATA;
  if(!DATA) return;

  const RUBRIC={
    peakStatus:{label:'Peak status / best-alive claim',max:1.50},
    eliteOpponentProof:{label:'Elite proof',max:1.50},
    separationDominance:{label:'Separation / dominance',max:1.25},
    divisionStrength:{label:'Division strength',max:1.00},
    cleanApexAura:{label:'Clean apex / aura',max:0.75},
    total:{label:'Apex Peak bonus',max:6.00}
  };

  function entry(window,components,notes){return{window,components,notes};}
  function round2(value){const n=Number(value||0);return Math.round((n+Number.EPSILON)*100)/100;}
  function total(components){return round2(Object.values(components||{}).reduce((sum,value)=>sum+Number(value||0),0));}
  function key(name){return String(name||'').trim().toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s+/g,' ');}

  const componentOverrides={
    'Matt Hughes':entry(
      'Carlos Newton II 2002 through Frank Trigg II 2005',
      {
        peakStatus:0.95,
        eliteOpponentProof:0.90,
        separationDominance:0.85,
        divisionStrength:0.45,
        cleanApexAura:0.65
      },
      'Best UFC welterweight claim before GSP separation. Elite proof includes GSP, B.J. Penn, Newton, Sherk, and Trigg. Physically overwhelmed his era, with early-WW division discount and strong pre-Penn/GSP aura.'
    )
  };

  function findOverride(fighter){
    return componentOverrides[fighter] || Object.entries(componentOverrides).find(([name])=>key(name)===key(fighter))?.[1] || null;
  }

  function patchRow(row){
    if(!row?.fighter) return false;
    const override=findOverride(row.fighter);
    if(!override) return false;
    const score=total(override.components);
    row.apexPeak=score;
    row.apexPeakAudit={
      score,
      window:override.window,
      components:override.components,
      componentTotal:score,
      notes:override.notes,
      rubric:RUBRIC,
      source:'Apex Peak decimal component audit',
      version:VERSION
    };
    return true;
  }

  const patched=[];
  [...(DATA.men||[]),...(DATA.women||[]),...(DATA.fighters||[])].forEach(row=>{if(patchRow(row))patched.push(row.fighter);});

  if(typeof DISPLAY_OVERRIDES!=='undefined'){
    Object.entries(componentOverrides).forEach(([fighter,override])=>{
      DISPLAY_OVERRIDES[fighter]=DISPLAY_OVERRIDES[fighter]||{};
      const score=total(override.components);
      DISPLAY_OVERRIDES[fighter].apexPeakAudit={
        score,
        window:override.window,
        components:override.components,
        componentTotal:score,
        notes:override.notes,
        rubric:RUBRIC,
        version:VERSION
      };
    });
  }

  window.UFC_APEX_PEAK_COMPONENT_AUDIT={
    version:VERSION,
    rubric:RUBRIC,
    componentOverrides,
    patched:[...new Set(patched)],
    rule:'Apex Peak total must equal the sum of the five component scores.',
    appliedAt:new Date().toISOString()
  };
})();

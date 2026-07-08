// Opponent Quality shadow audit/profile-card layer.
// Computes full-ledger audit data, profile-card evidence boxes, snapshot stats, and category ranks. Total scores are unchanged.
(function(){
  const VERSION='opponent-quality-shadow-audit-20260708b-win-profile-ranks';
  const store=window.UFC_OPPONENT_QUALITY_LEDGERS;
  if(!store||!store.raw)return;
  const DATA=window.RANKING_DATA||{};
  const RETURNS=store.diminishingReturns||[[1,6,1],[7,12,0.75],[13,18,0.5],[19,999,0.25]];
  const DEFINITION='Opponent Quality rewards who you beat, when you beat them, and how strong the division was. Elite champions and true top contenders carry the most weight. Softer, faded, short-notice, or weird-context wins get capped.';
  const WIN_PROFILE_OVERRIDES={
    'Jon Jones':'Historic title-opponent gauntlet',
    'Georges St-Pierre':'Champion wins + deep WW contender run',
    'Demetrious Johnson':'Flyweight king with calibrated depth',
    'Anderson Silva':'Legendary MW reign with elite names',
    'Khabib Nurmagomedov':'Elite LW top-end, lighter volume',
    'Max Holloway':'Deepest featherweight win stack',
    'Amanda Nunes':'Champion-heavy two-division résumé',
    'Ronda Rousey':'Strong title wins, thinner depth',
    'Conor McGregor':'Huge top-end, thinner depth',
    'Frankie Edgar':'Deep multi-division contender wins',
    'Jessica Andrade':'Volume-heavy cross-division résumé',
    'Ilia Topuria':'Monster top-end, still building volume'
  };
  function n(v,d=0){const x=Number(v);return Number.isFinite(x)?x:d;}
  function round(v,dec=2){const p=Math.pow(10,dec);return Math.round((n(v)+Number.EPSILON)*p)/p;}
  function rateForSlot(slot){const hit=RETURNS.find(([from,to])=>slot>=from&&slot<=to);return hit?n(hit[2],0.25):0.25;}
  function cleanName(name){return String(name||'').replace(/\s+I{1,3}$/,'').replace(/\s+\d+$/,'').trim();}
  function rawRowsFor(fighter){return Array.isArray(store.raw?.[fighter])?store.raw[fighter]:[];}
  function rowsFor(fighter){
    return rawRowsFor(fighter).map((row,index)=>({
      originalSlot:index+1,
      opponent:String(row[0]||'TBD'),
      credit:Math.max(0,Math.min(1.25,n(row[1]))),
      tierLabel:String(row[2]||''),
      context:String(row[3]||''),
      reviewStatus:String(row[4]||'review')
    })).sort((a,b)=>b.credit-a.credit||a.opponent.localeCompare(b.opponent)).map((row,index)=>{
      const slot=index+1;
      const countedRate=rateForSlot(slot);
      const exactCountedCredit=row.credit*countedRate;
      return {...row,slot,countedRate,exactCountedCredit,countedCredit:round(exactCountedCredit,2)};
    });
  }
  function profileFor(name){return (DATA.fighters||[]).find(f=>f?.fighter===name)||{};}
  function boardForName(name){return (DATA.women||[]).some(row=>row?.fighter===name)?'women':'men';}
  function divisionShort(name){
    const f=profileFor(name);
    const primary=String(f.primaryDivision||f.division||'').toLowerCase();
    if(primary.includes('light heavyweight'))return'LHW';
    if(primary.includes('heavyweight'))return'HW';
    if(primary.includes('welterweight'))return'WW';
    if(primary.includes('lightweight'))return'LW';
    if(primary.includes('featherweight'))return'FW';
    if(primary.includes('bantamweight'))return'BW';
    if(primary.includes('flyweight'))return'FLW';
    if(primary.includes('middleweight'))return'MW';
    if(primary.includes('strawweight'))return'SW';
    return'UFC';
  }
  function winProfileFor(summary){
    if(WIN_PROFILE_OVERRIDES[summary.fighter])return WIN_PROFILE_OVERRIDES[summary.fighter];
    const div=divisionShort(summary.fighter);
    if(summary.elitePlusWins>=5&&summary.topFivePlusWins>=9)return`All-time ${div} quality-wins stack`;
    if(summary.elitePlusWins>=4&&summary.topFivePlusWins>=7)return`Champion wins + deep ${div} contender run`;
    if(summary.elitePlusWins>=3&&summary.topFivePlusWins>=5)return`Elite top-end + strong ${div} depth`;
    if(summary.elitePlusWins>=2&&summary.topFivePlusWins>=4)return`Big signature wins, lighter ${div} volume`;
    if(summary.topFivePlusWins>=4)return`Strong ${div} contender résumé`;
    if(summary.elitePlusWins>=1)return`Major signature win, thinner depth`;
    return`Solid ${div} win depth`;
  }
  function summaryFor(fighter){
    const rows=rowsFor(fighter);
    const rawCredit=round(rows.reduce((s,r)=>s+r.credit,0),2);
    const diminishedCredit=round(rows.reduce((s,r)=>s+r.exactCountedCredit,0),2);
    const reviewRows=rows.filter(r=>!String(r.reviewStatus).toLowerCase().includes('lock'));
    const highRiskRows=rows.filter(r=>String(r.reviewStatus).toLowerCase().includes('high'));
    const bestWins=[];
    rows.forEach(r=>{const name=cleanName(r.opponent);if(name&&!bestWins.includes(name))bestWins.push(name);});
    const summary={
      fighter,
      rawCredit,
      diminishedCredit,
      maxCreditWins:rows.filter(r=>r.credit>=1.25).length,
      elitePlusWins:rows.filter(r=>r.credit>=1.15).length,
      topFivePlusWins:rows.filter(r=>r.credit>=1).length,
      rankedQualityWins:rows.filter(r=>r.credit>=0.65).length,
      bestWins:bestWins.slice(0,6),
      reviewRows,
      highRiskRows,
      rows,
      board:boardForName(fighter)
    };
    summary.winProfile=winProfileFor(summary);
    return summary;
  }
  function allSummaries(){return Object.keys(store.raw).map(summaryFor).sort((a,b)=>b.diminishedCredit-a.diminishedCredit||b.rawCredit-a.rawCredit||a.fighter.localeCompare(b.fighter));}
  const report=allSummaries();
  const byName=new Map(report.map(row=>[row.fighter,row]));
  function allDataRows(){return [...(DATA.men||[]),...(DATA.women||[]),...(DATA.fighters||[])];}
  function rankMaps(){
    const maps={men:new Map(),women:new Map()};
    ['men','women'].forEach(board=>{
      report.filter(s=>s.board===board).sort((a,b)=>b.diminishedCredit-a.diminishedCredit||b.rawCredit-a.rawCredit||a.fighter.localeCompare(b.fighter)).forEach((s,i)=>maps[board].set(s.fighter,i+1));
    });
    return maps;
  }
  function percentileFor(rank,total){
    if(total<=1)return 99;
    return Math.max(55,Math.min(99,Math.round(99-((rank-1)/(total-1))*44)));
  }
  function updateSnapshot(snapshot,summary){
    const rows=Array.isArray(snapshot)?snapshot.slice():[];
    function upsert(label,value,tests){
      const idx=rows.findIndex(item=>Array.isArray(item)&&tests.some(re=>re.test(String(item[0]||''))));
      if(idx>=0)rows[idx]=[label,value];
      else rows.push([label,value]);
    }
    upsert('Elite+ / Top-5+ Wins',`${summary.elitePlusWins} / ${summary.topFivePlusWins}`,[/elite\s*wins/i,/quality\s*wins/i,/opponent\s*quality/i,/top[-\s]*5/i]);
    upsert('Win Profile',summary.winProfile,[/win\s*profile/i,/resume\s*shape/i,/quality\s*type/i]);
    return rows;
  }
  function applyToData(){
    const ranks=rankMaps();
    const totals={men:(DATA.men||[]).filter(row=>byName.has(row.fighter)).length,women:(DATA.women||[]).filter(row=>byName.has(row.fighter)).length};
    allDataRows().forEach(row=>{
      if(!row?.fighter)return;
      const audit=byName.get(row.fighter);
      if(!audit)return;
      const board=audit.board;
      const rank=ranks[board].get(row.fighter)||null;
      const ovr=rank?percentileFor(rank,totals[board]):null;
      row.opponentQualityLegacy=row.opponentQualityLegacy??row.opponentQuality;
      row.opponentQuality=audit.diminishedCredit;
      row.opponentQualityShadowScore=audit.diminishedCredit;
      row.opponentQualityShadowAudit={...audit,rank,ovr};
      row.elitePlusWins=audit.elitePlusWins;
      row.topFivePlusWins=audit.topFivePlusWins;
      row.rankedQualityWins=audit.rankedQualityWins;
      row.winProfile=audit.winProfile;
      if(typeof DISPLAY_OVERRIDES!=='undefined'){
        DISPLAY_OVERRIDES[row.fighter]=DISPLAY_OVERRIDES[row.fighter]||{};
        const o=DISPLAY_OVERRIDES[row.fighter];
        o.snapshotStats={...(o.snapshotStats||{}),elitePlusWins:audit.elitePlusWins,topFivePlusWins:audit.topFivePlusWins,rankedQualityWins:audit.rankedQualityWins,bestQualityWins:audit.bestWins.slice(0,5).join(', '),winProfile:audit.winProfile,opponentQualityScore:audit.diminishedCredit};
        o.categories={...(o.categories||{})};
        o.categories.opponentQuality={ovr,rank};
        o.snapshot=updateSnapshot(o.snapshot,audit);
      }
    });
  }
  applyToData();
  function summaryFromFighter(f){return byName.get(f?.fighter)||summaryFor(f?.fighter);}
  function evidenceItems(f){
    const s=summaryFromFighter(f);
    return [
      ['Elite+ wins', String(s.elitePlusWins||0)],
      ['Top-5+ wins', String(s.topFivePlusWins||0)],
      ['Best wins', (s.bestWins||[]).slice(0,5).join(', ')||'No UFC win ledger loaded'],
      ['Win profile', s.winProfile||'Quality-wins profile not loaded']
    ];
  }
  const previousEvidence=typeof categoryEvidenceItems==='function'?categoryEvidenceItems:null;
  if(previousEvidence){
    categoryEvidenceItems=function(f,key){
      if(key==='opponentQuality')return evidenceItems(f);
      return previousEvidence(f,key);
    };
  }
  const previousLogic=typeof categoryLogicSentence==='function'?categoryLogicSentence:null;
  if(previousLogic){
    categoryLogicSentence=function(f,key){
      if(key==='opponentQuality')return DEFINITION;
      return previousLogic(f,key);
    };
  }
  window.UFC_OPPONENT_QUALITY_SHADOW_AUDIT={
    version:VERSION,
    mode:'shadow-audit-profile-card-snapshot-ranks',
    formula:'Sorted UFC win credits. Best 6 count 100%, wins 7-12 count 75%, wins 13-18 count 50%, wins 19+ count 25%. Total scores unchanged.',
    fighters:report.length,
    report,
    leaders:report.slice(0,15).map(r=>({fighter:r.fighter,rawCredit:r.rawCredit,diminishedCredit:r.diminishedCredit,elitePlusWins:r.elitePlusWins,topFivePlusWins:r.topFivePlusWins,rankedQualityWins:r.rankedQualityWins,winProfile:r.winProfile})),
    summaryFor,
    rowsFor,
    definition:DEFINITION,
    boxes:['Elite+ wins','Top-5+ wins','Best wins','Win profile'],
    appliedAt:new Date().toISOString()
  };
  document.documentElement.setAttribute('data-opponent-quality-shadow-audit',VERSION);
  if(typeof refresh==='function'){try{refresh();}catch(e){}}
  if(window.UFC_CATEGORY_LEADERS?.render){try{window.UFC_CATEGORY_LEADERS.render();}catch(e){}}
})();
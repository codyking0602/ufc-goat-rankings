// Canonical division rankings derived from the same UFC fight ledgers and calculated scoring rows as the main board.
// No fighter-specific division guardrails, hand-entered sample shares, or UI-owned scores live here.
(function(){
  'use strict';

  const VERSION='division-ranking-pipeline-20260715a-canonical-allocation';
  const DIVISION_ORDER=['Heavyweight','Light Heavyweight','Middleweight','Welterweight','Lightweight','Featherweight','Bantamweight','Flyweight'];
  const SCORED=new Set(['count-win','count-loss','count-draw']);
  const FINISHES=new Set(['ko-tko','submission','doctor-stoppage']);
  const ELITE_TIERS=new Set(['champion-level','top-five']);
  const aliases={
    heavyweight:'Heavyweight',hw:'Heavyweight',
    'light heavyweight':'Light Heavyweight',lhw:'Light Heavyweight',
    middleweight:'Middleweight',mw:'Middleweight',
    welterweight:'Welterweight',ww:'Welterweight',
    lightweight:'Lightweight',lw:'Lightweight',
    featherweight:'Featherweight',fw:'Featherweight',
    bantamweight:'Bantamweight',bw:'Bantamweight',
    flyweight:'Flyweight',flw:'Flyweight'
  };

  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const round2=value=>{const rounded=Math.round((num(value)+Number.EPSILON)*100)/100;return Object.is(rounded,-0)?0:rounded;};
  const key=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const canonicalDivision=value=>aliases[key(value)]||String(value||'').trim();
  const supportedDivision=value=>DIVISION_ORDER.includes(canonicalDivision(value));
  const add=(map,division,value)=>{if(!supportedDivision(division)||!num(value))return;const name=canonicalDivision(division);map.set(name,num(map.get(name))+num(value));};
  const total=map=>Array.from(map.values()).reduce((sum,value)=>sum+num(value),0);
  const share=(map,division,fallback)=>{const denominator=total(map);if(denominator>0)return num(map.get(division))/denominator;return division===fallback?1:0;};

  function state(){
    const facts=window.UFC_CANONICAL_FIGHTER_FACTS;
    const calculators=window.UFC_CATEGORY_CALCULATORS;
    const data=window.RANKING_DATA;
    if(!facts?.list||!facts?.deriveFor||!calculators?.rowFor||!data)return null;
    return{facts,calculators,data};
  }

  function fightForEvidence(record,evidence){
    const fights=record?.fights||[];
    if(evidence?.fightId){const direct=fights.find(fight=>fight.id===evidence.fightId);if(direct)return direct;}
    const opponent=key(evidence?.opponent||evidence?.label);
    const date=String(evidence?.date||'');
    return fights.find(fight=>(!opponent||key(fight.opponent)===opponent||key(fight.opponent).includes(opponent)||opponent.includes(key(fight.opponent)))&&(!date||fight.date===date))||null;
  }

  function divisionForFight(record,fight){
    const direct=canonicalDivision(fight?.division);
    if(supportedDivision(direct))return direct;
    const primary=canonicalDivision(record?.identity?.primaryDivision);
    return supportedDivision(primary)?primary:null;
  }

  function primeBounds(record){
    const fights=record?.fights||[];
    const start=fights.findIndex(fight=>fight.id===record?.primeWindow?.startFightId);
    const end=record?.primeWindow?.open?fights.length-1:fights.findIndex(fight=>fight.id===record?.primeWindow?.endFightId);
    return{start,end};
  }

  function weightedEvidence(record,rows,valueFor){
    const map=new Map();
    (rows||[]).forEach(row=>{const fight=fightForEvidence(record,row);const division=divisionForFight(record,fight);add(map,division,valueFor(row,fight));});
    return map;
  }

  function generalEvidence(record){
    const map=new Map();
    (record?.fights||[]).filter(fight=>SCORED.has(fight?.scoringDisposition)).forEach(fight=>{
      const title=(fight?.championshipContext?.type||'none')!=='none'?1:.0;
      const elite=ELITE_TIERS.has(fight?.opponentContext?.qualityTier||'none')?.65:0;
      add(map,divisionForFight(record,fight),1+title+elite);
    });
    return map;
  }

  function primeEvidence(record){
    const map=new Map();
    const fights=record?.fights||[];
    const {start,end}=primeBounds(record);
    if(start<0||end<start)return map;
    fights.slice(start,end+1).filter(fight=>SCORED.has(fight?.scoringDisposition)).forEach(fight=>{
      const rounds=fight?.rounds?.status==='audited'?num(fight.rounds.won)+num(fight.rounds.lost)+num(fight.rounds.drawn):0;
      const elite=ELITE_TIERS.has(fight?.opponentContext?.qualityTier||'none')?.5:0;
      const title=(fight?.championshipContext?.type||'none')!=='none'?.5:0;
      add(map,divisionForFight(record,fight),1+elite+title+Math.min(rounds,5)*.05);
    });
    return map;
  }

  function longevityEvidence(record,trace){
    const map=new Map();
    const fightById=new Map((record?.fights||[]).map(fight=>[fight.id,fight]));
    (trace?.stats?.intervals||[]).forEach(interval=>{
      const months=num(interval.countedMonths);
      const from=divisionForFight(record,fightById.get(interval.fromFightId));
      const to=divisionForFight(record,fightById.get(interval.toFightId));
      if(from&&to&&from!==to){add(map,from,months/2);add(map,to,months/2);}else add(map,from||to,months);
    });
    if(!total(map)){
      const fallback=primeEvidence(record);
      fallback.forEach((value,division)=>add(map,division,value));
    }
    return map;
  }

  function lossEvidence(record,trace){
    const map=new Map();
    (trace?.events||[]).forEach(event=>{
      const fight=fightForEvidence(record,event);
      const weight=Math.abs(num(event.rawPenalty||event.total||event.base)+num(event.finishExtra));
      add(map,divisionForFight(record,fight),weight||1);
    });
    return map;
  }

  function divisionRecord(record,division){
    const fights=(record?.fights||[]).filter(fight=>divisionForFight(record,fight)===division);
    const counts={wins:0,losses:0,draws:0,noContests:0};
    fights.forEach(fight=>{
      if(fight.officialResult==='win')counts.wins+=1;
      else if(fight.officialResult==='loss')counts.losses+=1;
      else if(fight.officialResult==='draw')counts.draws+=1;
      else if(fight.officialResult==='no-contest')counts.noContests+=1;
    });
    const text=`${counts.wins}-${counts.losses}${counts.draws?`-${counts.draws}`:''}${counts.noContests?`, ${counts.noContests} NC`:''}`;
    return{...counts,text,fightCount:fights.length,fights};
  }

  function divisionStats(record,derived,division,longevityMonths){
    const result=divisionRecord(record,division);
    const fightById=new Map((record?.fights||[]).map(fight=>[fight.id,fight]));
    const inDivision=id=>divisionForFight(record,fightById.get(id))===division;
    const titleRows=(derived?.championship?.rows||[]).filter(row=>inDivision(row.fightId));
    const qualityRows=(derived?.opponentQuality?.rows||[]).filter(row=>inDivision(row.fightId));
    const wins=result.fights.filter(fight=>fight.scoringDisposition==='count-win');
    const finishWins=wins.filter(fight=>FINISHES.has(fight?.method?.category)).length;
    const {start,end}=primeBounds(record);
    const prime=(start>=0&&end>=start?(record.fights||[]).slice(start,end+1):[]).filter(fight=>divisionForFight(record,fight)===division&&SCORED.has(fight?.scoringDisposition));
    const primeWins=prime.filter(fight=>fight.scoringDisposition==='count-win').length;
    const primeLosses=prime.filter(fight=>fight.scoringDisposition==='count-loss').length;
    const primeDraws=prime.filter(fight=>fight.scoringDisposition==='count-draw').length;
    const rounds=prime.reduce((sum,fight)=>{if(fight?.rounds?.status!=='audited')return sum;sum.won+=num(fight.rounds.won);sum.lost+=num(fight.rounds.lost);sum.drawn+=num(fight.rounds.drawn);return sum;},{won:0,lost:0,drawn:0});
    const roundTotal=rounds.won+rounds.lost+rounds.drawn;
    return{
      ufcRecord:result.text,
      ufcFightCount:result.fightCount,
      titleFightWins:titleRows.filter(row=>row.officialTitleFight&&row.eligible&&row.result==='count-win').length,
      adjustedTitleWins:round2(titleRows.reduce((sum,row)=>sum+num(row.credit),0)),
      topFiveWins:qualityRows.filter(row=>['champion-level','top-five'].includes(row.tier)).length,
      rankedWins:qualityRows.filter(row=>['champion-level','top-five','top-ten','ranked'].includes(row.tier)).length,
      finishRatePct:wins.length?round2((finishWins/wins.length)*100):0,
      primeRecord:`${primeWins}-${primeLosses}${primeDraws?`-${primeDraws}`:''}`,
      roundsWonPct:roundTotal?round2(((rounds.won+(rounds.drawn*.5))/roundTotal)*100):0,
      activeEliteYears:round2(longevityMonths/12)
    };
  }

  function fighterDivisionRows(record,row,calculators){
    const primary=canonicalDivision(record?.identity?.primaryDivision);
    const derived=window.UFC_CANONICAL_FIGHTER_FACTS.deriveFor(record.fighter);
    const traces={
      championship:calculators.rowFor('championship',record.fighter),
      opponentQuality:calculators.rowFor('opponentQuality',record.fighter),
      primeDominance:calculators.rowFor('primeDominance',record.fighter),
      longevity:calculators.rowFor('longevity',record.fighter),
      apex:calculators.rowFor('apex',record.fighter),
      penalty:calculators.rowFor('penalty',record.fighter)
    };
    const maps={
      championship:weightedEvidence(record,traces.championship?.inputs,input=>num(input.finalAdjustedCredit??input.adjustedCredit??input.credit)),
      opponentQuality:weightedEvidence(record,traces.opponentQuality?.inputs,input=>num(input.countedCredit??input.finalCredit??input.credit)),
      primeDominance:primeEvidence(record),
      longevity:longevityEvidence(record,traces.longevity),
      apex:weightedEvidence(record,traces.apex?.performances,input=>num(input.rating)||1),
      penalty:lossEvidence(record,traces.penalty),
      general:generalEvidence(record)
    };
    const divisions=new Set((record.fights||[]).map(fight=>divisionForFight(record,fight)).filter(supportedDivision));
    const weighted=row?.weightedScoreBreakdown||{};
    return Array.from(divisions).map(division=>{
      const shares={
        championship:share(maps.championship,division,primary),
        opponentQuality:share(maps.opponentQuality,division,primary),
        primeDominance:share(maps.primeDominance,division,primary),
        longevity:share(maps.longevity,division,primary),
        apex:share(maps.apex,division,primary),
        penalty:share(maps.penalty,division,primary),
        eraDepth:share(maps.general,division,primary)
      };
      const components={
        championship:round2(num(weighted.championship)*shares.championship),
        opponentQuality:round2(num(weighted.opponentQuality)*shares.opponentQuality),
        primeDominance:round2(num(weighted.primeDominance)*shares.primeDominance),
        longevity:round2(num(weighted.longevity)*shares.longevity),
        apex:round2(num(weighted.apex)*shares.apex),
        penalty:round2(num(weighted.penalty)*shares.penalty),
        eraDepth:round2(num(weighted.eraDepth)*shares.eraDepth)
      };
      const divisionScore=round2(Object.values(components).reduce((sum,value)=>sum+num(value),0));
      const positiveOverall=num(weighted.championship)+num(weighted.opponentQuality)+num(weighted.primeDominance)+num(weighted.longevity)+num(weighted.apex);
      const positiveDivision=components.championship+components.opponentQuality+components.primeDominance+components.longevity+components.apex;
      const resumeShare=positiveOverall>0?positiveDivision/positiveOverall:share(maps.general,division,primary);
      const longevityMonths=total(maps.longevity)*shares.longevity;
      const secondary=(record?.identity?.secondaryDivisions||[]).map(canonicalDivision);
      const role=division===primary?'primary':secondary.includes(division)?'secondary':'crossover';
      return{
        fighter:record.fighter,
        division,
        role,
        overallRank:num(row?.rank)||null,
        overallOvr:num(row?.overallOvr)||null,
        overallScore:round2(row?.totalScore),
        divisionScore,
        resumeSharePct:round2(resumeShare*100),
        components,
        evidenceShares:Object.fromEntries(Object.entries(shares).map(([name,value])=>[name,round2(value*100)])),
        stats:divisionStats(record,derived,division,longevityMonths),
        source:'canonical-fighter-facts + calculated weighted score allocation'
      };
    });
  }

  let latest={version:VERSION,status:'not-built',passed:false,boards:{},rows:[]};

  function rebuild(){
    const current=state();
    if(!current)return latest;
    const boardRows=new Map((current.data.men||[]).map(row=>[key(row.fighter),row]));
    const rows=current.facts.list().filter(record=>record.board==='men').flatMap(record=>fighterDivisionRows(record,boardRows.get(key(record.fighter))||{},current.calculators));
    const boards={};
    DIVISION_ORDER.forEach(division=>{
      const ranked=rows.filter(row=>row.division===division).sort((a,b)=>b.divisionScore-a.divisionScore||b.overallScore-a.overallScore||a.fighter.localeCompare(b.fighter));
      ranked.forEach((row,index)=>{row.rank=index+1;});
      if(ranked.length)boards[division]=ranked;
    });
    const invalid=rows.filter(row=>!Number.isFinite(row.divisionScore));
    const conservation=[];
    const overallByFighter=new Map((current.data.men||[]).map(row=>[key(row.fighter),num(row.totalScore)]));
    new Set(rows.map(row=>row.fighter)).forEach(fighter=>{
      const allocated=round2(rows.filter(row=>row.fighter===fighter).reduce((sum,row)=>sum+row.divisionScore,0));
      const expected=round2(overallByFighter.get(key(fighter)));
      if(Math.abs(allocated-expected)>.08)conservation.push({fighter,allocated,expected,difference:round2(allocated-expected)});
    });
    const passed=invalid.length===0&&conservation.length===0;
    latest={version:VERSION,status:passed?'ready':'blocked',passed,allocationOwner:'canonical fight-level division evidence',manualGuardrails:false,fighterCount:new Set(rows.map(row=>row.fighter)).size,rowCount:rows.length,divisionCount:Object.keys(boards).length,invalid,conservation,boards,rows};
    window.UFC_DIVISION_RANKING_REPORT=latest;
    document.documentElement.setAttribute('data-division-ranking-pipeline',`${VERSION}-${latest.status}-${latest.rowCount}`);
    return latest;
  }

  function boardFor(division){if(latest.status!=='ready')rebuild();return clone(latest.boards[canonicalDivision(division)]||[]);}
  function entryFor(fighter){if(latest.status!=='ready')rebuild();return clone(latest.rows.filter(row=>key(row.fighter)===key(fighter)));}
  function exportData(){if(latest.status!=='ready')rebuild();return clone({version:latest.version,allocationOwner:latest.allocationOwner,manualGuardrails:false,boards:latest.boards});}

  function photo(row){
    const override=window.DISPLAY_OVERRIDES?.[row.fighter]||{};
    const url=override.thumbUrl||override.photoUrl||'';
    const initials=String(row.fighter||'').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
    return `<div class="row-photo">${url?`<img src="${url}" alt="${row.fighter} thumbnail" loading="lazy">`:initials}</div>`;
  }

  function injectCss(){
    if(document.getElementById('canonical-division-ranking-css'))return;
    const style=document.createElement('style');
    style.id='canonical-division-ranking-css';
    style.textContent='.division-leader-shell{display:grid;gap:14px;margin-bottom:18px}.division-leader-controls{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.division-leader-pill{border:1px solid var(--line);background:var(--panel);color:var(--text);padding:10px 12px;border-radius:999px;cursor:pointer;font-weight:850;min-height:42px}.division-leader-pill.active{background:var(--accent2);border-color:var(--accent2);color:#111827}.division-leader-summary{border:1px solid rgba(250,204,21,.28);background:rgba(18,23,34,.94);border-radius:16px;padding:12px 14px;color:var(--text);line-height:1.38}.division-row{grid-template-columns:54px 64px minmax(0,1fr) auto!important}.division-row .score,.division-row .resume-tag,.division-row .watch-moment-link{display:none!important}.canonical-division-score{text-align:right;font-weight:900;color:var(--text)}.canonical-division-score span{display:block;color:var(--muted);font-size:10px;letter-spacing:.08em}.division-context{margin-top:6px;color:var(--muted);font-size:12px}@media(max-width:900px){.division-leader-controls{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.division-row{grid-template-columns:34px 58px minmax(0,1fr) auto!important}.canonical-division-score{font-size:14px}}';
    document.head.appendChild(style);
  }

  function controls(active){return `<div class="division-leader-controls">${Object.keys(latest.boards).map(division=>`<button type="button" class="division-leader-pill ${division===active?'active':''}" data-division-pick="${division}">${division}</button>`).join('')}</div>`;}
  function rowHtml(row){
    const role=row.role==='primary'?'Primary UFC division':row.role==='secondary'?'Second-division résumé':'Crossover résumé';
    return `<article class="row fighter-row division-row" data-fighter="${row.fighter}"><div class="rank">#${row.rank}</div>${photo(row)}<div class="row-main"><div class="name">${row.fighter}</div><div class="meta">${row.stats.ufcRecord} UFC · Overall #${row.overallRank||'—'}</div><div class="division-context">${role} · ${Math.round(row.resumeSharePct)}% of calculated UFC résumé</div></div><div class="canonical-division-score">${row.divisionScore.toFixed(1)}<span>DIV SCORE</span></div></article>`;
  }

  function render(){
    injectCss();
    if(latest.status!=='ready')rebuild();
    const target=document.getElementById('divisionList');
    const select=document.getElementById('divisionFilter');
    if(!target||!select||latest.status!=='ready')return;
    const divisions=Object.keys(latest.boards);
    if(select.dataset.canonicalDivisionOptions!==VERSION){
      const current=select.value;
      select.innerHTML='<option value="All">All divisions</option>'+divisions.map(division=>`<option value="${division}">${division}</option>`).join('');
      select.value=divisions.includes(current)?current:'All';
      select.dataset.canonicalDivisionOptions=VERSION;
    }
    const active=canonicalDivision(select.value);
    const section=document.querySelector('#division .section-title');
    if(active==='All'||!latest.boards[active]){
      if(section){section.querySelector('h2').textContent='Division Boards';section.querySelector('p').textContent='Calculated automatically from each fighter’s UFC fights in that weight class.';}
      target.innerHTML=`<div class="division-leader-shell">${controls('')}<div class="division-leader-summary"><strong>Pick a division</strong><br>Every board is rebuilt from the canonical fight ledgers—no manual fighter placement or sample-share tuning.</div></div>`;
    }else{
      const rows=latest.boards[active];
      if(section){section.querySelector('h2').textContent=`${active} Rankings`;section.querySelector('p').textContent='UFC-only divisional résumé, allocated from the same calculated GOAT model.';}
      target.innerHTML=`<div class="division-leader-shell">${controls(active)}<div class="division-leader-summary"><strong>${active} · Men</strong><br>${rows.length} fighters ranked from fight-level divisional evidence.</div><div class="leaderboard">${rows.map(rowHtml).join('')}</div></div>`;
    }
    target.querySelectorAll('[data-division-pick]').forEach(button=>button.addEventListener('click',()=>{select.value=button.dataset.divisionPick;render();}));
    target.querySelectorAll('[data-fighter]').forEach(node=>node.addEventListener('click',()=>{if(typeof window.openFighter==='function')window.openFighter(node.dataset.fighter);else if(typeof openFighter==='function')openFighter(node.dataset.fighter);}));
  }

  const API={version:VERSION,role:'automatic UFC-only division ranking owner',divisionOrder:DIVISION_ORDER.slice(),manualGuardrails:false,rebuild,boardFor,entryFor,exportData,get latest(){return clone(latest);}};
  window.UFC_DIVISION_RANKING_PIPELINE=API;
  window.UFC_DIVISION_RANKINGS={version:VERSION,mode:'canonical-fight-level-allocation',manualGuardrails:false,render,rebuild,boardFor,entryFor,exportData};
  window.renderDivision=render;
  window.addEventListener?.('ufc-scoring-pipeline-ready',()=>{rebuild();render();});
})();

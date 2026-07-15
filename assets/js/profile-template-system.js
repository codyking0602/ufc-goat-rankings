// Durable UFC profile template system backed by the calculated ranking projection.
(function(){
  'use strict';
  const DATA=window.RANKING_DATA;
  const VERSION='profile-template-system-20260715b-peak-apex';
  if(!DATA||typeof DISPLAY_OVERRIDES==='undefined')return;

  const PROFILE_CATEGORIES=[
    ['championship','Title Reign'],
    ['opponentQuality','Quality Wins'],
    ['primeDominance','Prime Dominance'],
    ['longevity','Elite Longevity'],
    ['apexPeak','Peak Apex'],
    ['penalty','Loss Context']
  ];
  const PROFILE_DISPLAY_NAMES={
    'Jon Jones':'Jon “Bones” Jones','Georges St-Pierre':'Georges “Rush” St-Pierre','Demetrious Johnson':'Demetrious “Mighty Mouse” Johnson',
    'Anderson Silva':'Anderson “The Spider” Silva','Khabib Nurmagomedov':'Khabib “The Eagle” Nurmagomedov','Alexander Volkanovski':'Alexander “The Great” Volkanovski',
    'Jose Aldo':'Jose Aldo “Junior”','Max Holloway':'Max “Blessed” Holloway','Kamaru Usman':'Kamaru “The Nigerian Nightmare” Usman',
    'Randy Couture':'Randy “The Natural” Couture','Chuck Liddell':'Chuck “The Iceman” Liddell','Israel Adesanya':'Israel “The Last Stylebender” Adesanya',
    'Alex Pereira':'Alex “Poatan” Pereira','Aljamain Sterling':'Aljamain “Funk Master” Sterling','Petr Yan':'Petr “No Mercy” Yan',
    'Merab Dvalishvili':'Merab “The Machine” Dvalishvili','B.J. Penn':'B.J. “The Prodigy” Penn','BJ Penn':'B.J. “The Prodigy” Penn',
    'Dustin Poirier':'Dustin “The Diamond” Poirier','Dominick Cruz':'Dominick “The Dominator” Cruz','Francis Ngannou':'Francis “The Predator” Ngannou',
    'Charles Oliveira':'Charles “Do Bronx” Oliveira','Henry Cejudo':'Henry “Triple C” Cejudo','Conor McGregor':'“The Notorious” Conor McGregor',
    'Justin Gaethje':'Justin “The Highlight” Gaethje','Frankie Edgar':'Frankie “The Answer” Edgar','Dan Henderson':'Dan “Hendo” Henderson',
    'Amanda Nunes':'Amanda “The Lioness” Nunes','Valentina Shevchenko':'Valentina “Bullet” Shevchenko','Joanna Jedrzejczyk':'Joanna “Champion” Jedrzejczyk',
    'Ronda Rousey':'Ronda “Rowdy” Rousey','Ilia Topuria':'Ilia “El Matador” Topuria','Daniel Cormier':'Daniel “DC” Cormier',
    'Mauricio Rua':'Mauricio “Shogun” Rua','Maurício Rua':'Mauricio “Shogun” Rua','Junior dos Santos':'Junior “Cigano” dos Santos',
    'Tony Ferguson':'Tony “El Cucuy” Ferguson'
  };

  const pctText=value=>Number.isFinite(Number(value))?`${Number(value).toFixed(1)}%`:'—';
  const yearsText=value=>Number.isFinite(Number(value))?Number(value).toFixed(1):'—';
  const countText=value=>Number.isFinite(Number(value))?String(Number(value)):'—';

  function liveProfileFor(name){return (DATA.fighters||[]).find(row=>row?.fighter===name)||{};}
  function liveBoardRowFor(name){return (DATA.men||[]).find(row=>row?.fighter===name)||(DATA.women||[]).find(row=>row?.fighter===name)||{};}
  window.profileFor=function(row){return liveProfileFor(row?.fighter||row);};
  window.fullRow=function(row){
    const name=row?.fighter||row;
    return{...liveProfileFor(name),...liveBoardRowFor(name),...(typeof row==='object'?row:{fighter:name})};
  };

  function profileDisplayName(fighter,override){return override?.profileDisplayName||override?.fighterDisplayName||PROFILE_DISPLAY_NAMES[fighter.fighter]||fighter.fighter;}
  function visibleStatsFor(fighter){
    const visible=fighter.visibleStats||{};
    return{
      ufcRecord:visible.ufcRecord||fighter.ufcRecord||'—',
      titleFightWins:visible.titleFightWins??fighter.titleFightWins,
      topFiveWins:visible.topFiveWins??fighter.topFiveWins??fighter.top5Wins,
      primeRecord:visible.primeRecord||fighter.primeRecord||DATA.primeRecords?.[fighter.fighter]?.record||'—',
      finishRatePct:visible.finishRatePct??fighter.finishRatePct,
      roundsWonPct:visible.roundsWonPct??fighter.roundsWonPct,
      activeEliteYears:visible.activeEliteYears??fighter.activeEliteYears,
      timesFinishedPrime:visible.timesFinishedPrime??fighter.timesFinishedPrime
    };
  }
  function snapshotFor(fighter){
    const stats=visibleStatsFor(fighter);
    return[
      ['UFC Record',stats.ufcRecord],
      ['UFC Title-Fight Wins',countText(stats.titleFightWins)],
      ['Top-5 Wins',countText(stats.topFiveWins)],
      ['Prime UFC Record',stats.primeRecord],
      ['Finish Rate',pctText(stats.finishRatePct)],
      ['Rounds Won',pctText(stats.roundsWonPct)],
      ['Active Elite Years',yearsText(stats.activeEliteYears)],
      ['Prime Stoppage Losses',countText(stats.timesFinishedPrime)]
    ];
  }

  function priority(row){
    if(Number.isFinite(Number(row?.displayPriority)))return Number(row.displayPriority);
    if(Number.isFinite(Number(row?.opponentStrengthScore)))return 1000-Number(row.opponentStrengthScore);
    return 500-Number(row?.credit||0)*10;
  }
  window.rowsTable=function(rows,cols,max=18){
    const labels=cols.map(column=>column.label).join('|');
    const sorted=labels.includes('Opponent')?[...(rows||[])].sort((a,b)=>priority(a)-priority(b)||Number(b?.credit||0)-Number(a?.credit||0)):[...(rows||[])];
    if(!sorted.length)return'<p class="meta evidence-empty">Evidence rows are still being added for this fighter.</p>';
    const body=sorted.slice(0,max).map(row=>`<tr>${cols.map(column=>`<td>${row[column.key]??''}</td>`).join('')}</tr>`).join('');
    return`<table class="table"><thead><tr>${cols.map(column=>`<th>${column.label}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table>${sorted.length>max?`<p class="meta">Showing first ${max} of ${sorted.length} rows.</p>`:''}`;
  };

  window.categoryCards=function(fighter){
    return PROFILE_CATEGORIES.map(([key,label])=>{
      const rating=categoryOvr(fighter,key);
      const rank=categoryRank(fighter,key);
      const tier=tierForOvr(rating);
      return`<button type="button" class="category-card ${tier.cls}" data-category="${key}" aria-label="Explain ${label} rating for ${fighter.fighter}"><span class="category-label">${label}</span><strong>${rating} <span class="meta">Rating</span></strong><small>#${rank||'—'} in category</small><span class="tier-pill">${tier.label}</span><div class="category-bar"><i style="width:${Math.max(0,Math.min(100,rating))}%"></i></div></button>`;
    }).join('');
  };
  window.categoryExplanation=function(fighter,key){
    const info=PROFILE_CATEGORIES.find(([category])=>category===key)||[key,key];
    const rating=categoryOvr(fighter,key);
    const rank=categoryRank(fighter,key);
    const tier=tierForOvr(rating);
    const items=categoryEvidenceItems(fighter,key);
    return`<div class="category-explainer ${tier.cls}"><div class="category-explainer-kicker">${tier.label} · #${rank||'—'} in category</div><h3>${info[1]}: ${rating} <span>rating</span></h3><p><strong>What it means:</strong> ${categoryLogicSentence(fighter,key)||''}</p><div class="category-explainer-grid">${items.map(([label,value])=>`<div class="category-explainer-item"><strong>${label}</strong><small>${value}</small></div>`).join('')}</div></div>`;
  };

  function rowPhotoClean(fighter){
    const url=DISPLAY_OVERRIDES[fighter.fighter]?.thumbUrl||DISPLAY_OVERRIDES[fighter.fighter]?.photoUrl||'';
    return`<div class="row-photo">${url?`<img src="${url}" alt="${fighter.fighter} thumbnail" loading="lazy">`:fighterInitials(fighter.fighter)}</div>`;
  }
  function fighterRow(fighter,rankOverride=null,tagOverride=null){
    return`<article class="row clean-row fighter-row" data-fighter="${fighter.fighter}"><div class="rank">#${rankOverride||fighter.rank||'—'}</div>${rowPhotoClean(fighter)}<div class="row-main"><div class="name">${fighter.fighter}</div><div class="meta">${fighter.ufcRecord||''} · ${fighter.primaryDivision||''}${fighter.secondaryDivision?' / '+fighter.secondaryDivision:''}</div><div class="resume-tag">${tagOverride||resumeTagFor(fighter)}</div></div><div class="score"><strong>${overallOvr(fighter)}</strong><span class="meta">OVR</span></div></article>`;
  }
  window.renderList=function(containerId,rows){
    const q=el('search').value.trim().toLowerCase();
    const div=el('divisionFilter').value;
    const filtered=rows.map(fullRow).filter(row=>(!q||row.fighter.toLowerCase().includes(q))&&(div==='All'||[row.primaryDivision,row.secondaryDivision].join(' ').toLowerCase().includes(div.toLowerCase())));
    el(containerId).innerHTML=filtered.map(row=>fighterRow(row)).join('')||'<div class="notice">No fighters match that filter.</div>';
    document.querySelectorAll(`#${containerId} .row`).forEach(row=>row.addEventListener('click',()=>openFighter(row.dataset.fighter)));
  };
  window.renderDivision=function(){
    const div=el('divisionFilter').value;
    const rows=(DATA.fighters||[]).filter(fighter=>fighter.gender==='Men').map(fighter=>fullRow((DATA.men||[]).find(row=>row.fighter===fighter.fighter)||{fighter:fighter.fighter,totalScore:fighter.totalScore})).filter(fighter=>div==='All'||[fighter.primaryDivision,fighter.secondaryDivision].join(' ').toLowerCase().includes(div.toLowerCase())).sort((a,b)=>Number(b.totalScore||0)-Number(a.totalScore||0));
    el('divisionList').innerHTML=rows.map((row,index)=>fighterRow(row,index+1,div==='All'?resumeTagFor(row):`${div} view`)).join('');
    document.querySelectorAll('#divisionList .row').forEach(row=>row.addEventListener('click',()=>openFighter(row.dataset.fighter)));
  };

  window.openFighter=function(name){
    const fighter=fullRow((DATA.men||[]).find(row=>row.fighter===name)||(DATA.women||[]).find(row=>row.fighter===name)||{fighter:name});
    const override=DISPLAY_OVERRIDES[fighter.fighter]||{};
    const divisionLabel=override.divisionLabel||`${fighter.primaryDivision||''}${fighter.secondaryDivision?' / '+fighter.secondaryDivision:''}`;
    const rankLabel=fighter.rank||'—';
    const photoUrl=override.photoUrl||'';
    const rankedSectionTitle=Number(rankLabel)===1?'Why Not Lower?':'Why Not Ranked Higher?';
    const rankedSectionBody=Number(rankLabel)===1
      ?`<p>${override.whyNotLower||'The #1 case holds because no other UFC resume matches the same full blend of title volume, quality wins, prime dominance, and longevity.'}</p>`
      :`<p>${override.whyNotHigher||'The ranking reflects the championship, quality-win, dominance, longevity, and loss-context gaps versus the fighters above.'}</p>`;
    el('fighterDetail').innerHTML=`
      <section class="profile-hero">
        <div class="${photoUrl?'fighter-photo has-photo':'fighter-photo'}">${photoUrl?`<img src="${photoUrl}" alt="${fighter.fighter} profile photo" class="fighter-photo-img" style="object-position:${override.photoPosition||'center top'}">`:`<div class="photo-initials">${fighterInitials(fighter.fighter)}</div>`}</div>
        <div class="profile-summary"><div class="profile-topline"><span class="profile-pill gold">UFC All-Time Rank: #${rankLabel}</span><span class="profile-pill">${divisionLabel}</span></div><h2>${profileDisplayName(fighter,override)}</h2><div class="profile-ovr-wrap"><div class="profile-ovr">${overallOvr(fighter)} <small>OVR</small></div></div><p class="profile-copy">${override.oneLiner||`${fighter.fighter}'s UFC resume is graded across championship success, quality wins, prime dominance, elite longevity, and loss context.`}</p></div>
      </section>
      <section class="profile-main-flow">
        <div class="card"><h3>Resume Snapshot</h3>${snapshotGrid(snapshotFor(fighter))}</div>
        <div class="category-grid">${categoryCards(fighter)}</div>
        <div id="categoryExplanation"></div>
        <div class="card"><h3>Why Ranked Here</h3><p>${override.whyRankedHere||`${fighter.fighter} ranks here based on the calculated UFC-only balance of championship success, quality wins, prime dominance, and active elite longevity.`}</p></div>
        <div class="card"><h3>${rankedSectionTitle}</h3>${rankedSectionBody}</div>
      </section>`;
    el('drawer').classList.add('open');el('drawer').setAttribute('aria-hidden','false');
    const panel=document.querySelector('.drawer-panel');if(panel)panel.scrollTop=0;
    attachCategoryExplanations(fighter);
  };

  window.UFC_PROFILE_TEMPLATE_SYSTEM={version:VERSION,snapshotLabels:['UFC Record','UFC Title-Fight Wins','Top-5 Wins','Prime UFC Record','Finish Rate','Rounds Won','Active Elite Years','Prime Stoppage Losses'],profileDisplayNames:PROFILE_DISPLAY_NAMES,publicProfileSections:['Hero','Resume Snapshot','Category Cards','Why Ranked Here','Why Not Ranked Higher'],statOwner:'ranking-pipeline.js visibleStats',mutatesScores:false};
  if(typeof refresh==='function')refresh();
})();